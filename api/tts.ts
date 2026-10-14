import https from 'https';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

// Lean memory cache for audio buffers (limited to max 30 recent items to protect serverless memory)
const memoryCache = new Map<string, { buffer: Buffer; timestamp: number }>();
const MAX_CACHE_ITEMS = 30;

// Disk cache directory to persist generated audio in /tmp
const CACHE_DIR = '/tmp/tts_audio_cache';
try {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }
} catch {
  // ignore
}

function getCacheDiskPath(key: string): string {
  const safeKey = Buffer.from(key).toString('hex').slice(0, 64);
  return path.join(CACHE_DIR, `${safeKey}.mp3`);
}

/**
 * Splits text into safe sub-chunks (< 120 chars) on whitespace boundaries
 * so Google TTS never throws 400 Bad Request.
 */
function splitIntoSafeChunks(text: string, maxLen = 120): string[] {
  if (text.length <= maxLen) return [text];
  const words = text.split(/\s+/);
  const chunks: string[] = [];
  let current = '';

  for (const w of words) {
    if ((current + ' ' + w).trim().length <= maxLen) {
      current = current ? `${current} ${w}` : w;
    } else {
      if (current.trim()) chunks.push(current.trim());
      current = w;
    }
  }

  if (current.trim()) {
    chunks.push(current.trim());
  }

  return chunks.length > 0 ? chunks : [text.slice(0, maxLen)];
}

/**
 * Fetches a single chunk (< 120 chars) from upstream TTS
 */
function fetchRawChunk(text: string, lang: 'ar' | 'ur'): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const encoded = encodeURIComponent(text);
    const googleLang = lang === 'ur' ? 'ur' : 'ar';
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${googleLang}&q=${encoded}`;

    const req = https.get(
      url,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Referer: 'https://translate.google.com/',
        },
      },
      (res) => {
        if (res.statusCode !== 200) {
          return reject(new Error(`Upstream TTS returned status ${res.statusCode}`));
        }

        const chunks: Buffer[] = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => resolve(Buffer.concat(chunks)));
        res.on('error', reject);
      }
    );

    req.on('error', reject);
    req.setTimeout(8000, () => {
      req.destroy(new Error('TTS request timed out'));
    });
  });
}

/**
 * Transforms audio stream with studio equalization into resonant masculine baritone orator voice.
 * If ffmpeg is not available in the serverless environment, gracefully falls back to rawCombined.
 */
function processStudioAudio(
  rawCombined: Buffer,
  lang: 'ar' | 'ur'
): Promise<Buffer> {
  return new Promise((resolve) => {
    const filter =
      lang === 'ur'
        ? 'asetrate=24000*0.76,atempo=1.31,equalizer=f=120:width_type=h:width=60:g=7,equalizer=f=260:width_type=h:width=100:g=3,equalizer=f=3500:width_type=h:width=1000:g=-5'
        : 'asetrate=24000*0.77,atempo=1.30,equalizer=f=125:width_type=h:width=60:g=6,equalizer=f=280:width_type=h:width=100:g=3,equalizer=f=3600:width_type=h:width=1000:g=-5';

    try {
      const ff = spawn('ffmpeg', [
        '-i',
        'pipe:0',
        '-af',
        filter,
        '-f',
        'mp3',
        '-b:a',
        '96k',
        'pipe:1',
      ]);

      const outChunks: Buffer[] = [];
      ff.stdout.on('data', (c) => outChunks.push(c));

      ff.on('close', (code) => {
        if (code === 0 && outChunks.length > 0) {
          resolve(Buffer.concat(outChunks));
        } else {
          resolve(rawCombined);
        }
      });

      ff.on('error', () => {
        // Fallback gracefully without throwing or leaking memory if ffmpeg is absent
        resolve(rawCombined);
      });

      ff.stdin.write(rawCombined);
      ff.stdin.end();
    } catch {
      resolve(rawCombined);
    }
  });
}

export default async function handler(req: any, res: any) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const tl = ((req.query?.tl as string) || 'ar').toLowerCase() as 'ar' | 'ur';
  // Exclusively masculine voice
  const gender = 'male';
  const q = ((req.query?.q as string) || '').trim();

  if (!q) {
    return res.status(400).send('Query text is required');
  }

  const cleanText = q.slice(0, 500).trim();
  const cacheKey = `${tl}:${gender}:${cleanText}`;

  // 1. Check in-memory cache
  if (memoryCache.has(cacheKey)) {
    const cached = memoryCache.get(cacheKey)!;
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader(
      'Cache-Control',
      'public, max-age=2592000, s-maxage=2592000, stale-while-revalidate=86400, immutable'
    );
    return res.send(cached.buffer);
  }

  // 2. Check disk cache (stream directly to response to conserve Node.js heap)
  const diskPath = getCacheDiskPath(cacheKey);
  if (fs.existsSync(diskPath)) {
    try {
      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader(
        'Cache-Control',
        'public, max-age=2592000, s-maxage=2592000, stale-while-revalidate=86400, immutable'
      );
      return fs.createReadStream(diskPath).pipe(res);
    } catch {
      // fallback to generation
    }
  }

  // 3. Split into safe chunks, fetch raw buffers, concatenate & process
  try {
    const chunks = splitIntoSafeChunks(cleanText, 110);
    const rawBuffers: Buffer[] = [];

    for (const chunk of chunks) {
      const buf = await fetchRawChunk(chunk, tl);
      rawBuffers.push(buf);
    }

    const combinedRaw = Buffer.concat(rawBuffers);
    const audioBuffer = await processStudioAudio(combinedRaw, tl);

    // Store in lean memory cache (LRU purge if > MAX_CACHE_ITEMS)
    if (memoryCache.size >= MAX_CACHE_ITEMS) {
      const oldestKey = memoryCache.keys().next().value;
      if (oldestKey) memoryCache.delete(oldestKey);
    }
    memoryCache.set(cacheKey, { buffer: audioBuffer, timestamp: Date.now() });

    // Store on disk
    try {
      fs.writeFileSync(diskPath, audioBuffer);
    } catch {
      // ignore disk write errors
    }

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', audioBuffer.length);
    res.setHeader(
      'Cache-Control',
      'public, max-age=2592000, s-maxage=2592000, stale-while-revalidate=86400, immutable'
    );
    return res.send(audioBuffer);
  } catch (err: any) {
    console.error('TTS generation error:', err);
    return res.status(500).send('Audio generation failed');
  }
}
