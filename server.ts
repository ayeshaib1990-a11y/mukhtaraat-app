import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import https from 'https';

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// API route for High-Quality Native TTS proxy: /api/tts?tl=ar&q=... or /api/tts?tl=ur&q=...
app.get('/api/tts', (req, res) => {
  const tl = (req.query.tl as string) || 'ar';
  const q = (req.query.q as string) || '';

  if (!q.trim()) {
    return res.status(400).send('Query text is required');
  }

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
      res.setHeader('Cache-Control', 'public, max-age=86400');
      res.setHeader('Access-Control-Allow-Origin', '*');
      proxyRes.pipe(res);
    }
  );

  proxyReq.on('error', (err) => {
    console.error('TTS Proxy Error:', err);
    res.status(500).send('TTS Error');
  });
});

async function startServer() {
  const distPath = path.resolve(process.cwd(), 'dist');
  const hasDist = fs.existsSync(path.resolve(distPath, 'index.html'));
  const isDev = process.env.NODE_ENV === 'development' || (!hasDist && process.env.NODE_ENV !== 'production');

  if (isDev) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer();
