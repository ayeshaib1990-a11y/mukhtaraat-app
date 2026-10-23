import { GoogleGenAI } from '@google/genai';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { CHAPTERS } from '../src/data/chaptersData.ts';

const ai = new GoogleGenAI();
const AUDIO_DIR = path.resolve(process.cwd(), 'public/audio');

if (!fs.existsSync(AUDIO_DIR)) {
  fs.mkdirSync(AUDIO_DIR, { recursive: true });
}

function cleanArabic(text: string): string {
  return text
    .replace(/<[^>]*>/g, '')
    .replace(/[«»]/g, '')
    .replace(/ﷺ/g, 'صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ')
    .replace(/اللّٰهُ/g, 'اللهُ')
    .replace(/اللّٰهِ/g, 'اللهِ')
    .replace(/اللّٰهَ/g, 'اللهَ')
    .replace(/رَضِيَ اللّٰهُ عَنْهُ/g, 'رَضِيَ اللهُ عَنْهُ')
    .replace(/رَضِيَ اللّٰهُ عَنْهَا/g, 'رَضِيَ اللهُ عَنْهَا')
    .replace(/رَضِيَ اللّٰهُ عَنْهُمْ/g, 'رَضِيَ اللهُ عَنْهُمْ')
    .replace(/عَلَيْهِ السَّلَامُ/g, 'عَلَيْهِ السَّلَامُ')
    .replace(/\s+/g, ' ')
    .trim();
}

function cleanUrdu(text: string): string {
  return text
    .replace(/<[^>]*>/g, '')
    .replace(/[«»]/g, '')
    .replace(/ﷺ/g, 'صلی اللہ علیہ وسلم')
    .replace(/صَلَّى اللّٰهُ عَلَيْهِ وَسَلَّمَ/g, 'صلی اللہ علیہ وسلم')
    .replace(/رضی اللہ عنہا/g, 'رضی اللہ عنہا')
    .replace(/رضی اللہ عنہ/g, 'رضی اللہ عنہ')
    .replace(/علیہ السلام/g, 'علیہ السلام')
    .replace(/\s+/g, ' ')
    .trim();
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function generateClip(
  text: string,
  destMp3: string,
  voice: string = 'Fenrir'
): Promise<boolean> {
  const tmpWav = `/tmp/gen_${Date.now()}_${Math.random().toString(36).slice(2)}.wav`;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const resp = await ai.models.generateContent({
        model: 'gemini-3.8-flash-tts',
        contents: text,
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: voice }, // Fenrir: Resonant, masculine orator
            },
          },
        },
      });

      const b64 = resp.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (!b64) {
        throw new Error('No audio data in response');
      }

      fs.writeFileSync(tmpWav, Buffer.from(b64, 'base64'));
      execSync(`ffmpeg -y -i "${tmpWav}" -b:a 64k "${destMp3}" 2>/dev/null`);
      try {
        fs.unlinkSync(tmpWav);
      } catch {}
      return true;
    } catch (err: any) {
      console.error(`Attempt ${attempt} error for ${destMp3}:`, err.message || err);
      try {
        if (fs.existsSync(tmpWav)) fs.unlinkSync(tmpWav);
      } catch {}
      await sleep(1500 * attempt);
    }
  }
  return false;
}

async function main() {
  const targetChapterIdx = parseInt(process.argv[2] || '4', 10);
  const maxSections = parseInt(process.argv[3] || '999', 10);
  const ch = CHAPTERS[targetChapterIdx];
  if (!ch) {
    console.error(`Chapter ${targetChapterIdx} not found!`);
    process.exit(1);
  }

  const limit = Math.min(ch.sections.length, maxSections);
  console.log(`Starting male audio generation for Chapter ${targetChapterIdx}: ${ch.title} (first ${limit} sections)...`);

  for (let sIdx = 0; sIdx < limit; sIdx++) {
    const sec = ch.sections[sIdx];
    const arFile = path.join(AUDIO_DIR, `ch${targetChapterIdx}_ar_sec${sIdx}.mp3`);
    const urFile = path.join(AUDIO_DIR, `ch${targetChapterIdx}_ur_sec${sIdx}.mp3`);

    // 1. Generate Arabic
    const arText = cleanArabic(sec.arabic);
    if (arText) {
      process.stdout.write(`[Ch${targetChapterIdx} Sec${sIdx}] Arabic: `);
      const okAr = await generateClip(arText, arFile, 'Fenrir');
      console.log(okAr ? `OK (${fs.statSync(arFile).size} bytes)` : 'FAILED');
      await sleep(500);
    }

    // 2. Generate Urdu
    const urText = cleanUrdu(sec.urdu);
    if (urText) {
      process.stdout.write(`[Ch${targetChapterIdx} Sec${sIdx}] Urdu: `);
      const okUr = await generateClip(urText, urFile, 'Fenrir');
      console.log(okUr ? `OK (${fs.statSync(urFile).size} bytes)` : 'FAILED');
      await sleep(500);
    }
  }

  console.log(`Finished audio generation for Chapter ${targetChapterIdx}!`);
}

main().catch(console.error);
