import https from 'https';
import fs from 'fs';
import path from 'path';

// Lean memory cache for audio buffers (limited to max 60 recent items)
const memoryCache = new Map<string, { buffer: Buffer; contentType: string; timestamp: number }>();
const MAX_CACHE_ITEMS = 60;

// Disk cache directory to persist generated audio in /tmp
const CACHE_DIR = '/tmp/tts_audio_cache';
try {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }
} catch {
  // ignore
}

// Load Quran word audio mapping if present
let quranWordMap: Record<string, string> = {};
try {
  const mapPath = path.resolve(process.cwd(), 'src/data/quranWordAudioMap.json');
  if (fs.existsSync(mapPath)) {
    quranWordMap = JSON.parse(fs.readFileSync(mapPath, 'utf8'));
  }
} catch {
  // ignore
}

function stripArabicDiacritics(str: string): string {
  return (str || '')
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '')
    .replace(/[ٱإأآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .trim();
}

function normalizeSalawatAndSacredText(text: string, lang: 'ar' | 'ur'): string {
  let cleaned = (text || '')
    .replace(/<[^>]*>/g, '')
    .replace(/[«»"']/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (lang === 'ar') {
    cleaned = cleaned
      .replace(/ﷺ/g, 'صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ')
      .replace(/اللّٰهُ/g, 'اللهُ')
      .replace(/اللّٰهِ/g, 'اللهِ')
      .replace(/اللّٰهَ/g, 'اللهَ')
      .replace(/رَضِيَ اللّٰهُ عَنْهُ/g, 'رَضِيَ اللهُ عَنْهُ')
      .replace(/رَضِيَ اللّٰهُ عَنْهَا/g, 'رَضِيَ اللهُ عَنْهَا')
      .replace(/رَضِيَ اللّٰهُ عَنْهُمْ/g, 'رَضِيَ اللهُ عَنْهُمْ')
      .replace(/عَلَيْهِ السَّلَامُ/g, 'عَلَيْهِ السَّلَامُ');
  } else {
    cleaned = cleaned
      .replace(/ﷺ/g, 'صلی اللہ علیہ وسلم')
      .replace(/صَلَّى اللّٰهُ عَلَيْهِ وَسَلَّمَ/g, 'صلی اللہ علیہ وسلم')
      .replace(/رضی اللہ عنہا/g, 'رضی اللہ عنہا')
      .replace(/رضی اللہ عنہ/g, 'رضی اللہ عنہ')
      .replace(/علیہ السلام/g, 'علیہ السلام');
  }

  return cleaned;
}

function lookupQuranWordAudio(word: string): string | null {
  if (!word || !quranWordMap) return null;
  const raw = word.trim();
  const clean = stripArabicDiacritics(raw);
  const parts = clean.split(/\s+/);
  const toCheck = [raw, clean];
  if (parts.length > 1) {
    toCheck.push(parts[parts.length - 1]);
    toCheck.push(parts[0]);
  }

  for (const item of toCheck) {
    const c = stripArabicDiacritics(item);
    const rootWord = c.startsWith('ال') ? c.slice(2) : c.startsWith('لل') ? c.slice(2) : c;
    const candidates = [
      item,
      c,
      rootWord,
      'و' + c,
      'ف' + c,
      'ال' + c,
      'ب' + c,
      'ل' + c,
      'لل' + c,
      'ال' + rootWord,
      'لل' + rootWord,
      'و' + rootWord,
      'ف' + rootWord,
      'ب' + rootWord,
      c.startsWith('و') ? c.slice(1) : null,
      c.startsWith('ف') ? c.slice(1) : null,
      c.startsWith('ال') ? c.slice(2) : null,
      c.startsWith('ب') ? c.slice(1) : null,
      c.startsWith('ل') ? c.slice(1) : null,
      c.startsWith('لل') ? c.slice(2) : null,
    ].filter(Boolean) as string[];

    for (const cand of candidates) {
      if (quranWordMap[cand]) {
        return quranWordMap[cand];
      }
    }
  }
  return null;
}

function fetchHttpBuffer(url: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to fetch audio from ${url}: status ${res.statusCode}`));
      }
      const chunks: Buffer[] = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

/**
 * Generates natural studio male narration using @google/genai with model 'gemini-3.8-flash-tts'
 * and voice 'Fenrir' (deep, dignified masculine voice).
 */
async function generateGeminiMaleAudio(text: string, _lang: 'ar' | 'ur'): Promise<Buffer | null> {
  if (!process.env.GEMINI_API_KEY) return null;
  try {
    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-tts',
      contents: text,
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Fenrir' }, // Deep resonant masculine voice
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      return Buffer.from(base64Audio, 'base64');
    }
  } catch (err) {
    console.error('Gemini male TTS generation error:', err);
  }
  return null;
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
  const rawQ = ((req.query?.q as string) || '').trim();

  if (!rawQ) {
    return res.status(400).send('Query text is required');
  }

  const cleanText = normalizeSalawatAndSacredText(rawQ.slice(0, 500), tl);
  const cacheKey = `${tl}:male:${cleanText}`;

  // 1. Check in-memory cache
  if (memoryCache.has(cacheKey)) {
    const cached = memoryCache.get(cacheKey)!;
    res.setHeader('Content-Type', cached.contentType);
    res.setHeader(
      'Cache-Control',
      'public, max-age=2592000, s-maxage=2592000, stale-while-revalidate=86400, immutable'
    );
    return res.send(cached.buffer);
  }

  // 2. Check disk cache
  const diskPath = path.join(CACHE_DIR, `${Buffer.from(cacheKey).toString('hex').slice(0, 48)}.wav`);
  if (fs.existsSync(diskPath)) {
    try {
      const diskBuf = fs.readFileSync(diskPath);
      memoryCache.set(cacheKey, { buffer: diskBuf, contentType: 'audio/wav', timestamp: Date.now() });
      res.setHeader('Content-Type', 'audio/wav');
      res.setHeader('Content-Length', diskBuf.length);
      res.setHeader(
        'Cache-Control',
        'public, max-age=2592000, s-maxage=2592000, stale-while-revalidate=86400, immutable'
      );
      return res.send(diskBuf);
    } catch {
      // ignore
    }
  }

  // 3. Strategy A: Check if word is an authentic Quranic word from QuranCDN (Male Qari)
  if (tl === 'ar') {
    const quranAudioUrl = lookupQuranWordAudio(cleanText);
    if (quranAudioUrl) {
      try {
        const audioBuffer = await fetchHttpBuffer(quranAudioUrl);
        if (memoryCache.size >= MAX_CACHE_ITEMS) {
          const oldest = memoryCache.keys().next().value;
          if (oldest) memoryCache.delete(oldest);
        }
        memoryCache.set(cacheKey, { buffer: audioBuffer, contentType: 'audio/mpeg', timestamp: Date.now() });

        res.setHeader('Content-Type', 'audio/mpeg');
        res.setHeader('Content-Length', audioBuffer.length);
        res.setHeader(
          'Cache-Control',
          'public, max-age=2592000, s-maxage=2592000, stale-while-revalidate=86400, immutable'
        );
        return res.send(audioBuffer);
      } catch (err) {
        console.error('QuranCDN audio fetch error:', err);
      }
    }
  }

  // 4. Strategy B: Generate high-fidelity neural male audio via Gemini TTS (gemini-3.8-flash-tts)
  try {
    const geminiBuffer = await generateGeminiMaleAudio(cleanText, tl);
    if (geminiBuffer) {
      if (memoryCache.size >= MAX_CACHE_ITEMS) {
        const oldest = memoryCache.keys().next().value;
        if (oldest) memoryCache.delete(oldest);
      }
      memoryCache.set(cacheKey, { buffer: geminiBuffer, contentType: 'audio/wav', timestamp: Date.now() });
      try {
        fs.writeFileSync(diskPath, geminiBuffer);
      } catch {}

      res.setHeader('Content-Type', 'audio/wav');
      res.setHeader('Content-Length', geminiBuffer.length);
      res.setHeader(
        'Cache-Control',
        'public, max-age=2592000, s-maxage=2592000, stale-while-revalidate=86400, immutable'
      );
      return res.send(geminiBuffer);
    }
  } catch (err) {
    console.error('Gemini TTS processing error:', err);
  }

  // 5. If serverless has no audio available, return 404 so client knows
  return res.status(404).send('Male audio source not available on server');
}
