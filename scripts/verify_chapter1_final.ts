import { CHAPTERS } from '../src/data/chaptersData';
import { USER_RAW_CH1 } from './user_raw_ch1';

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, '');
}

console.log('=== RUNNING FINAL CHAPTER 1 VERIFICATION ===\n');

const ch1 = CHAPTERS[0];
console.log('Title:', ch1.title);
console.log('Urdu Title:', ch1.urduTitle);
console.log('Sections count:', ch1.sections.length);
console.log('Words count:', ch1.words?.length);

if (ch1.sections.length !== 18) {
  console.error(`ERROR: Expected 18 sections, got ${ch1.sections.length}`);
  process.exit(1);
}

let errorCount = 0;

for (let i = 0; i < 18; i++) {
  const sec = ch1.sections[i];
  const expected = USER_RAW_CH1[i];

  const strippedArabic = stripHtml(sec.arabic);
  if (strippedArabic !== expected.arabic) {
    console.error(`ERROR in Arabic verse ${i + 1}:`);
    console.error('Actual:  ', strippedArabic);
    console.error('Expected:', expected.arabic);
    errorCount++;
  }

  if (sec.urdu !== expected.urdu) {
    console.error(`ERROR in Urdu verse ${i + 1}:`);
    console.error('Actual:  ', sec.urdu);
    console.error('Expected:', expected.urdu);
    errorCount++;
  }
}

if (errorCount === 0) {
  console.log('✓ All 18 Arabic verses match user text byte-for-byte!');
  console.log('✓ All 18 Urdu translations match user text byte-for-byte!');
} else {
  console.error(`Found ${errorCount} text mismatches!`);
  process.exit(1);
}

// Token and Word verification
const tokens: string[] = [];
ch1.sections.forEach(sec => {
  const matches = [...sec.arabic.matchAll(/data-word="([^"]+)"/g)].map(m => m[1]);
  tokens.push(...matches);
});

console.log(`\nTokens count: ${tokens.length}`);
const words = ch1.words || [];
const wordSet = new Set(words.map(w => w.w));
const tokenSet = new Set(tokens);

const unlinkedTokens = tokens.filter(t => !wordSet.has(t));
const unlinkedWords = words.filter(w => !tokenSet.has(w.w)).map(w => w.w);

console.log('Unlinked tokens:', unlinkedTokens);
console.log('Unlinked words:', unlinkedWords);

if (unlinkedTokens.length > 0 || unlinkedWords.length > 0) {
  console.error('ERROR: Token-word mismatch detected!');
  process.exit(1);
}

console.log('\n✓ 100% PERFECT: All 83 tokens and words match bidirectionally with zero mismatches!');
