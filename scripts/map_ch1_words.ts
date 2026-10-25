import { USER_RAW_CH1 } from './user_raw_ch1';
import { CHAPTERS } from '../src/data/chaptersData';

const ch1 = CHAPTERS[0];
const allWords = ch1.words || [];

// Helper to normalize diacritics for comparison only:
function normalizeForCompare(str: string): string {
  return str
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '') // remove diacritics
    .replace(/[\u0622\u0623\u0625\u0671]/g, 'ا') // alifs
    .replace(/[\u06CC\u0649]/g, 'ي') // yehs
    .replace(/[\u06A9]/g, 'ك') // kafs
    .replace(/[\s\u200B-\u200D\uFEFF]+/g, ' ')
    .trim();
}

console.log('Mapping all 83 words to sections:');

allWords.forEach((wordObj, wIdx) => {
  const rawW = wordObj.w;
  // Clean annotation if present, like "يَفْعَلْ (مَنْ يَفْعَلْ)" -> "يَفْعَلْ"
  const cleanW = rawW.replace(/\s*\([^)]*\)/, '').replace(/\s*-.*$/, '').trim();
  const normW = normalizeForCompare(cleanW);

  // Find in user sections
  const matchedSecs: { secNum: number; exactMatch: string }[] = [];
  USER_RAW_CH1.forEach((sec, sIdx) => {
    // Look for exact word or word with prefixes (like و or ل)
    // Let's tokenize user section into words
    const tokens = sec.arabic.split(/\s+/);
    tokens.forEach(tok => {
      const cleanTok = tok.replace(/[۝ۚۖۗۘۙ،]/g, '').trim();
      const normTok = normalizeForCompare(cleanTok);
      if (normTok === normW) {
        matchedSecs.push({ secNum: sIdx + 1, exactMatch: cleanTok });
      } else if (normTok.startsWith('و') && normalizeForCompare(cleanTok.slice(1)) === normW) {
        matchedSecs.push({ secNum: sIdx + 1, exactMatch: cleanTok });
      } else if (normTok.startsWith('ل') && normalizeForCompare(cleanTok.slice(1)) === normW) {
        matchedSecs.push({ secNum: sIdx + 1, exactMatch: cleanTok });
      } else if (normTok.startsWith('ول') && normalizeForCompare(cleanTok.slice(2)) === normW) {
        matchedSecs.push({ secNum: sIdx + 1, exactMatch: cleanTok });
      }
    });
  });

  console.log(`${wIdx + 1}. [${rawW}] (clean: "${cleanW}", norm: "${normW}"): matched ${matchedSecs.length} times ->`, matchedSecs);
});
