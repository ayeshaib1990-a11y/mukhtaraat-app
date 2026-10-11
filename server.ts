import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import ttsHandler from './api/tts';

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// API route for High-Quality Neural Male TTS: /api/tts?tl=ar&q=... or /api/tts?tl=ur&q=...
app.get('/api/tts', (req, res) => {
  return ttsHandler(req, res);
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
