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
    .replace(/<[^>]*>/g, ' ')
    .replace(/[«»"'“”]/g, '')
    .replace(/[–—―-]/g, ' ، ')
    .replace(/[\/\\|]/g, ' یا ')
    .replace(/[()\[\]{}]/g, ' ، ')
    .replace(/۔\s*۔+/g, '۔ ')
    .replace(/\.{2,}/g, '۔ ')
    .replace(/\s+/g, ' ')
    .trim();

  if (lang === 'ar') {
    cleaned = cleaned
      .replace(/ﷺ/g, ' صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ ')
      .replace(/صَلَّى اللّٰهُ عَلَيْهِ وَسَلَّمَ/g, ' صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ ')
      .replace(/صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ/g, ' صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ ')
      .replace(/اللّٰهُ/g, 'اللهُ')
      .replace(/اللّٰهِ/g, 'اللهِ')
      .replace(/اللّٰهَ/g, 'اللهَ')
      .replace(/رَضِيَ اللّٰهُ عَنْهُ/g, ' رَضِيَ اللهُ عَنْهُ ')
      .replace(/رَضِيَ اللّٰهُ عَنْهَا/g, ' رَضِيَ اللهُ عَنْهَا ')
      .replace(/رَضِيَ اللّٰهُ عَنْهُمْ/g, ' رَضِيَ اللهُ عَنْهُمْ ')
      .replace(/رَضِيَ اللهُ عَنْهُ/g, ' رَضِيَ اللهُ عَنْهُ ')
      .replace(/عَلَيْهِ السَّلَامُ/g, ' عَلَيْهِ السَّلَامُ ')
      .replace(/عَلَيْهَا السَّلَامُ/g, ' عَلَيْهَا السَّلَامُ ')
      .replace(/عَلَيْهِمَا السَّلَامُ/g, ' عَلَيْهِمَا السَّلَامُ ')
      .replace(/عَلَيْهِمُ السَّلَامُ/g, ' عَلَيْهِمُ السَّلَامُ ')
      .replace(/جَلَّ جَلَالُهُ/g, ' جَلَّ جَلَالُهُ ')
      .replace(/سُبْحَانَهُ وَتَعَالَىٰ?/g, ' سُبْحَانَهُ وَتَعَالَى ')
      .replace(/عَزَّ وَجَلَّ/g, ' عَزَّ وَجَلَّ ')
      .replace(/تَبَارَكَ وَتَعَالَىٰ?/g, ' تَبَارَكَ وَتَعَالَى ');
  } else {
    cleaned = cleaned
      .replace(/ﷺ/g, ' صَلَّی اللّٰہُ عَلَیْہِ وَسَلَّمْ ')
      .replace(/صَلَّى اللّٰهُ عَلَيْهِ وَسَلَّمَ/g, ' صَلَّی اللّٰہُ عَلَیْہِ وَسَلَّمْ ')
      .replace(/صلی اللہ علیہ وسلم/g, ' صَلَّی اللّٰہُ عَلَیْہِ وَسَلَّمْ ')
      .replace(/صلی اللہ علیہ و آلہ وسلم/g, ' صَلَّی اللّٰہُ عَلَیْہِ وَسَلَّمْ ')
      .replace(/رضی اللہ عنہا/g, ' رَضِیَ اللّٰہُ عَنْہَا ')
      .replace(/رَضِيَ اللّٰهُ عَنْهَا/g, ' رَضِیَ اللّٰہُ عَنْہَا ')
      .replace(/رضی اللہ عنہ/g, ' رَضِیَ اللّٰہُ عَنْہُ ')
      .replace(/رَضِيَ اللّٰهُ عَنْهُ/g, ' رَضِیَ اللّٰہُ عَنْہُ ')
      .replace(/رضی اللہ عنہم/g, ' رَضِیَ اللّٰہُ عَنْہُمْ ')
      .replace(/رَضِيَ اللّٰهُ عَنْهُمْ/g, ' رَضِیَ اللّٰہُ عَنْہُمْ ')
      .replace(/علیہ السلام/g, ' عَلَیْہِ السَّلَامْ ')
      .replace(/عَلَيْهِ السَّلَامُ/g, ' عَلَیْہِ السَّلَامْ ')
      .replace(/علیہا السلام/g, ' عَلَیْہَا السَّلَامْ ')
      .replace(/عَلَيْهَا السَّلَامُ/g, ' عَلَیْہَا السَّلَامْ ')
      .replace(/علیہم السلام/g, ' عَلَیْہِمُ السَّلَامْ ')
      .replace(/عَلَيْهِمُ السَّلَامُ/g, ' عَلَیْہِمُ السَّلَامْ ')
      .replace(/رحمتہ اللہ علیہ/g, ' رَحْمَۃُ اللّٰہِ عَلَیْہِ ')
      .replace(/رحمہ اللہ/g, ' رَحِمَہُ اللّٰہُ ')
      .replace(/رَحِمَهُ اللّٰهُ/g, ' رَحِمَہُ اللّٰہُ ')
      .replace(/جل جلالہ/g, ' جَلَّ جَلَالُہٗ ')
      .replace(/جَلَّ جَلَالُهُ/g, ' جَلَّ جَلَالُہٗ ')
      .replace(/سبحانہ و تعالی/g, ' سُبْحَانَہٗ وَتَعَالٰی ')
      .replace(/سبحانہ وتعالیٰ?/g, ' سُبْحَانَہٗ وَتَعَالٰی ')
      .replace(/سُبْحَانَهُ وَتَعَالَىٰ?/g, ' سُبْحَانَہٗ وَتَعَالٰی ')
      .replace(/عز وجل/g, ' عَزَّ وَجَلَّ ')
      .replace(/عَزَّ وَجَلَّ/g, ' عَزَّ وَجَلَّ ')
      .replace(/تبارک و تعالی/g, ' تَبَارَکَ وَتَعَالٰی ')
      .replace(/تَبَارَكَ وَتَعَالَىٰ?/g, ' تَبَارَکَ وَتَعَالٰی ');
  }

  return cleaned.replace(/\s+/g, ' ').trim();
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
 * Direct high-fidelity Google Translate TTS fetcher in Node.js
 * Produces crisp, clear, perfectly enunciated natural speech without cutting or distortion.
 */
function fetchGoogleTtsBuffer(text: string, lang: 'ar' | 'ur'): Promise<Buffer> {
  const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${lang}&client=tw-ob&q=${encodeURIComponent(text)}`;
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://translate.google.com/'
      }
    }, (res) => {
      if (res.statusCode !== 200) {
        return reject(new Error(`Google TTS status: ${res.statusCode}`));
      }
      const chunks: Buffer[] = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

/**
 * Generates natural studio male narration using @google/genai with model 'gemini-3.8-flash-lite-tts'.
 * Strictly uses 'Charon' (authoritative, baritone, dignified male voice) for scholarly Islamic & Urdu recitation.
 */
async function generateGeminiAudio(text: string): Promise<Buffer | null> {
  if (!process.env.GEMINI_API_KEY) return null;
  try {
    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI();
    // 'Charon' is the premier authoritative, deep baritone male voice in Gemini TTS
    const voiceName = 'Charon';
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [{ text }],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      return Buffer.from(base64Audio, 'base64');
    }
  } catch (err) {
    console.error('Gemini TTS generation error (will seamlessly fall back to Google TTS):', err);
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
  const cacheKey = `male:${tl}:${cleanText}`;

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
  const diskPathWav = path.join(CACHE_DIR, `${Buffer.from(cacheKey).toString('hex').slice(0, 48)}.wav`);
  const diskPathMp3 = path.join(CACHE_DIR, `${Buffer.from(cacheKey).toString('hex').slice(0, 48)}.mp3`);

  if (fs.existsSync(diskPathWav)) {
    try {
      const diskBuf = fs.readFileSync(diskPathWav);
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
  } else if (fs.existsSync(diskPathMp3)) {
    try {
      const diskBuf = fs.readFileSync(diskPathMp3);
      memoryCache.set(cacheKey, { buffer: diskBuf, contentType: 'audio/mpeg', timestamp: Date.now() });
      res.setHeader('Content-Type', 'audio/mpeg');
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

  // 3. Strategy A: Check if word is an authentic Quranic word from QuranCDN (Male Qari recitation)
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
        try {
          fs.writeFileSync(diskPathMp3, audioBuffer);
        } catch {}

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

  // 4. Strategy B: Generate high-fidelity authoritative male audio via Gemini TTS (voice: Charon)
  try {
    const geminiBuffer = await generateGeminiAudio(cleanText);
    if (geminiBuffer) {
      if (memoryCache.size >= MAX_CACHE_ITEMS) {
        const oldest = memoryCache.keys().next().value;
        if (oldest) memoryCache.delete(oldest);
      }
      memoryCache.set(cacheKey, { buffer: geminiBuffer, contentType: 'audio/wav', timestamp: Date.now() });
      try {
        fs.writeFileSync(diskPathWav, geminiBuffer);
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

  // 5. Strategy C: Bulletproof fallback to Google Translate TTS (Never 404s, crisp, natural pronunciation)
  try {
    const googleBuffer = await fetchGoogleTtsBuffer(cleanText, tl);
    if (googleBuffer && googleBuffer.length > 0) {
      if (memoryCache.size >= MAX_CACHE_ITEMS) {
        const oldest = memoryCache.keys().next().value;
        if (oldest) memoryCache.delete(oldest);
      }
      memoryCache.set(cacheKey, { buffer: googleBuffer, contentType: 'audio/mpeg', timestamp: Date.now() });
      try {
        fs.writeFileSync(diskPathMp3, googleBuffer);
      } catch {}

      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Content-Length', googleBuffer.length);
      res.setHeader(
        'Cache-Control',
        'public, max-age=2592000, s-maxage=2592000, stale-while-revalidate=86400, immutable'
      );
      return res.send(googleBuffer);
    }
  } catch (err) {
    console.error('Google TTS fallback error:', err);
  }

  return res.status(500).send('Unable to generate audio');
}
