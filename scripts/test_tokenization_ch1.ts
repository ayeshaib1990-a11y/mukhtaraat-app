import { USER_RAW_CH1 } from './user_raw_ch1';
import { CHAPTERS } from '../src/data/chaptersData';

const ch1 = CHAPTERS[0];
const allWords = ch1.words || [];

// Let's see the current tokens in each section:
const oldSecTokens: string[][] = ch1.sections.map(sec => {
  return [...sec.arabic.matchAll(/data-word="([^"]+)"/g)].map(m => m[1]);
});

console.log('Old section token counts:');
oldSecTokens.forEach((toks, i) => {
  console.log(`Sec ${i + 1}: ${toks.length} tokens -> [${toks.join(', ')}]`);
});

// Let's check how each token matches in USER_RAW_CH1
USER_RAW_CH1.forEach((sec, i) => {
  const userText = sec.arabic;
  const toks = oldSecTokens[i] || [];
  console.log(`\n--- Sec ${i + 1} ---`);
  console.log('User Arabic:', userText);
  toks.forEach(t => {
    // Check if token exists in userText
    // Note: some tokens had annotations like "يَفْعَلْ (مَنْ يَفْعَلْ)" or "سَيِّئَاتِهِمْ - سَیِّئَاتِ"
    // or alternate spellings like "مَا یَعْبَؤْا" vs "مَا يَعْبَأُ"
    console.log(`Token: "${t}" -> in userText directly: ${userText.includes(t)}`);
  });
});
