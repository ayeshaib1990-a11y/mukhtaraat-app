import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';
import https from 'https';

// Cache of audio chunks in memory to be blazing fast
const memoryCache = new Map<string, { buffer: Buffer; timestamp: number }>();
const MAX_CACHE_ITEMS = 300;

export default async function handler(req: any, res: any) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const tl = ((req.query?.tl as string) || 'ar').toLowerCase();
  const q = ((req.query?.q as string) || '').trim();
  const chapter = parseInt((req.query?.ch as string) || '-1', 10);
  const requestedVoice = (req.query?.voice as string) || '';

  if (!q) {
    return res.status(400).send('Query text is required');
  }

  // Max 300 chars per query chunk
  const cleanText = q.slice(0, 300).trim();
  const cacheKey = `${tl}:${requestedVoice}:${chapter}:${cleanText}`;

  if (memoryCache.has(cacheKey)) {
    const cached = memoryCache.get(cacheKey)!;
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');
    return res.send(cached.buffer);
  }

  // 1. Primary: High-fidelity natural neural male voices via Microsoft Edge TTS
  try {
    let voiceName: string;
    let voiceOptions: { pitch?: string; rate?: string } = {};

    if (tl === 'ar') {
      // Arabic male voice (Amro Elbosaty / Shakir style Egyptian Classical Arabic)
      // ar-EG-ShakirNeural is an authentic, natural, classical male voice
      voiceName = 'ar-EG-ShakirNeural';
      voiceOptions = { pitch: '-5Hz', rate: '-4%' };
    } else {
      // Urdu male voice (Zia Mohyeddin style: deep baritone resonant Pakistani Urdu orator)
      // ur-PK-AsadNeural with deep resonant pitch
      voiceName = 'ur-PK-AsadNeural';
      voiceOptions = { pitch: '-15Hz', rate: '-6%' };
    }

    if (requestedVoice) {
      voiceName = requestedVoice;
    }

    const tts = new MsEdgeTTS();
    await tts.setMetadata(voiceName, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
    const { audioStream } = await tts.toStream(cleanText, voiceOptions);

    const chunks: Buffer[] = [];
    audioStream.on('data', (chunk: Buffer) => chunks.push(chunk));

    await new Promise<void>((resolve, reject) => {
      audioStream.on('end', () => resolve());
      audioStream.on('error', (err: any) => reject(err));
    });

    const fullBuffer = Buffer.concat(chunks);
    if (fullBuffer.length > 0) {
      if (memoryCache.size > MAX_CACHE_ITEMS) {
        const oldestKey = memoryCache.keys().next().value;
        if (oldestKey) memoryCache.delete(oldestKey);
      }
      memoryCache.set(cacheKey, { buffer: fullBuffer, timestamp: Date.now() });

      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');
      return res.send(fullBuffer);
    }
  } catch (edgeError) {
    console.warn('Edge TTS attempt failed, trying fallback:', edgeError);
  }

  // 2. Fallback: Google Translate TTS proxy
  try {
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${encodeURIComponent(tl)}&q=${encodeURIComponent(cleanText.slice(0, 190))}`;

    const proxyReq = https.get(
      ttsUrl,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Referer: 'https://translate.google.com/',
        },
      },
      (proxyRes) => {
        if (proxyRes.statusCode !== 200) {
          return res.status(proxyRes.statusCode || 500).send('TTS fetch failed');
        }

        res.setHeader('Content-Type', 'audio/mpeg');
        res.setHeader('Cache-Control', 'public, max-age=86400');
        proxyRes.pipe(res);
      }
    );

    proxyReq.on('error', (err) => {
      console.error('Fallback TTS Proxy Error:', err);
      res.status(500).send('TTS Error');
    });
  } catch (err) {
    res.status(500).send('TTS processing failed');
  }
}
