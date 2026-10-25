import { CHAPTERS } from '../src/data/chaptersData';

const ch1 = CHAPTERS[0];
console.log('Words count:', ch1.words?.length);

const allWords = ch1.words || [];
const wordMap = new Map();
allWords.forEach(w => wordMap.set(w.w, w));

ch1.sections.forEach((sec, idx) => {
  const matches = [...sec.arabic.matchAll(/data-word="([^"]+)"/g)].map(m => m[1]);
  console.log(`\nSec ${idx + 1} (${sec.label}): ${matches.length} tokens`);
  matches.forEach(m => {
    const found = wordMap.has(m);
    console.log(`  - token: "${m}" -> found in words: ${found}`);
  });
});

console.log('\n--- Words not used in any section ---');
const usedTokens = new Set<string>();
ch1.sections.forEach(sec => {
  const matches = [...sec.arabic.matchAll(/data-word="([^"]+)"/g)].map(m => m[1]);
  matches.forEach(m => usedTokens.add(m));
});

allWords.forEach(w => {
  if (!usedTokens.has(w.w)) {
    console.log(`  Word "${w.w}" NOT used in tokens`);
  }
});
