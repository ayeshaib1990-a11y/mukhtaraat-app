import https from 'https';

export default function handler(req: any, res: any) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const tl = (req.query?.tl as string) || 'ar';
  const q = (req.query?.q as string) || '';

  if (!q.trim()) {
    return res.status(400).send('Query text is required');
  }

  // Google Translate TTS accepts up to 200 chars per query
  const cleanText = q.slice(0, 200).trim();
  const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${encodeURIComponent(tl)}&q=${encodeURIComponent(cleanText)}`;

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
      res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800');
      proxyRes.pipe(res);
    }
  );

  proxyReq.on('error', (err) => {
    console.error('TTS Proxy Error:', err);
    res.status(500).send('TTS Error');
  });
}
