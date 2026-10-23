import https from 'https';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { CHAPTERS } from '../src/data/chaptersData.ts';

const AUDIO_DIR = path.resolve(process.cwd(), 'public/audio');
if (!fs.existsSync(AUDIO_DIR)) {
  fs.mkdirSync(AUDIO_DIR, { recursive: true });
}

function normalizeSalawat(text: string, lang: 'ar' | 'ur'): string {
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

function fetchGoogleTTS(text: string, lang: 'ar' | 'ur'): Promise<Buffer> {
  const enc = encodeURIComponent(text);
  const url = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${lang}&q=${enc}`;
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      if (res.statusCode !== 200) {
        return reject(new Error(`TTS returned status ${res.statusCode}`));
      }
      const chunks: Buffer[] = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

function splitIntoSafeSubstrings(text: string, maxLen = 140): string[] {
  if (text.length <= maxLen) return [text];
  const words = text.split(' ');
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
  if (current.trim()) chunks.push(current.trim());
  return chunks;
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function generateMaleAudioFile(text: string, lang: 'ar' | 'ur', destMp3: string): Promise<boolean> {
  const clean = normalizeSalawat(text, lang);
  if (!clean) return false;

  const chunks = splitIntoSafeSubstrings(clean, 130);
  const rawBuffers: Buffer[] = [];

  for (const sub of chunks) {
    try {
      const buf = await fetchGoogleTTS(sub, lang);
      rawBuffers.push(buf);
      await sleep(150);
    } catch (err: any) {
      console.error(`Error fetching chunk "${sub}":`, err.message);
      return false;
    }
  }

  if (rawBuffers.length === 0) return false;
  const combinedRaw = Buffer.concat(rawBuffers);
  const tmpRaw = `/tmp/raw_${Date.now()}_${Math.random().toString(36).slice(2)}.mp3`;

  try {
    fs.writeFileSync(tmpRaw, combinedRaw);
    // Transform into deep, authoritative, resonant masculine baritone orator voice
    const filter =
      lang === 'ur'
        ? 'asetrate=24000*0.74,atempo=1.35,equalizer=f=120:width_type=h:width=60:g=8,equalizer=f=260:width_type=h:width=100:g=4,equalizer=f=3500:width_type=h:width=1000:g=-7'
        : 'asetrate=24000*0.74,atempo=1.35,equalizer=f=120:width_type=h:width=60:g=8,equalizer=f=260:width_type=h:width=100:g=4,equalizer=f=3500:width_type=h:width=1000:g=-7';

    execSync(`ffmpeg -y -i "${tmpRaw}" -af "${filter}" -b:a 96k "${destMp3}" 2>/dev/null`);
    try { fs.unlinkSync(tmpRaw); } catch {}
    return true;
  } catch (err: any) {
    console.error(`FFmpeg transform error for ${destMp3}:`, err.message);
    try { if (fs.existsSync(tmpRaw)) fs.unlinkSync(tmpRaw); } catch {}
    return false;
  }
}

async function processChapter(chIdx: number) {
  const ch = CHAPTERS[chIdx];
  if (!ch) return;

  console.log(`Processing Chapter ${chIdx}: ${ch.title} (${ch.sections.length} sections)...`);

  for (let sIdx = 0; sIdx < ch.sections.length; sIdx++) {
    const sec = ch.sections[sIdx];
    const arFile = path.join(AUDIO_DIR, `ch${chIdx}_ar_sec${sIdx}.mp3`);
    const urFile = path.join(AUDIO_DIR, `ch${chIdx}_ur_sec${sIdx}.mp3`);

    // For Chapter 4, sections 0-3 already have Fenrir audio! Don't overwrite them if size > 50k
    if (chIdx === 4 && sIdx <= 3) {
      if (fs.existsSync(arFile) && fs.statSync(arFile).size > 50000) {
        console.log(`[Ch${chIdx} Sec${sIdx}] Arabic: Keeping Fenrir audio (${fs.statSync(arFile).size} bytes)`);
      } else {
        await generateMaleAudioFile(sec.arabic, 'ar', arFile);
      }

      if (fs.existsSync(urFile) && fs.statSync(urFile).size > 50000) {
        console.log(`[Ch${chIdx} Sec${sIdx}] Urdu: Keeping Fenrir audio (${fs.statSync(urFile).size} bytes)`);
      } else {
        await generateMaleAudioFile(sec.urdu, 'ur', urFile);
      }
      continue;
    }

    // Generate Arabic (skip Chapters 0 & 1 as they use Qari Abdul Basit EveryAyah)
    if (chIdx !== 0 && chIdx !== 1) {
      process.stdout.write(`[Ch${chIdx} Sec${sIdx}] Arabic: `);
      const okAr = await generateMaleAudioFile(sec.arabic, 'ar', arFile);
      console.log(okAr ? `OK (${fs.statSync(arFile).size} bytes)` : 'FAILED');
    }

    // Generate Urdu for all chapters
    process.stdout.write(`[Ch${chIdx} Sec${sIdx}] Urdu: `);
    const okUr = await generateMaleAudioFile(sec.urdu, 'ur', urFile);
    console.log(okUr ? `OK (${fs.statSync(urFile).size} bytes)` : 'FAILED');
  }
}

async function main() {
  const chapterToRun = process.argv[2] !== undefined ? parseInt(process.argv[2], 10) : 4;
  await processChapter(chapterToRun);
  console.log(`Finished processing Chapter ${chapterToRun}!`);
}

main().catch(console.error);
