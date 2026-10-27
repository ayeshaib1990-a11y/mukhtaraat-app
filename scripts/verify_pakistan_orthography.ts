import { CHAPTERS } from '../src/data/chaptersData';

// Rule 1: Dagger alif must be directly on the consonant, NOT fatha on consonant + dagger alif on yaa (e.g. إِلَىٰ, عَلَىٰ, حَتَّىٰ are forbidden; must be إِلٰى, عَلٰى, حَتّٰى)
// Rule 2: No fatha before yaa without dagger alif for maqsura words like إلى, على, حتى.

const FORBIDDEN_PATTERNS = [
  { pattern: /[\u064e]\u0649\u0670/g, name: 'Fatha on letter + dagger alif on yaa (e.g. َىٰ)' },
  { pattern: /[\u064e]\u0670/g, name: 'Fatha + dagger alif on same letter (َٰ)' },
  { pattern: /إِلَىٰ/g, name: 'Cairo style إِلَىٰ (should be إِلٰى)' },
  { pattern: /عَلَىٰ/g, name: 'Cairo style عَلَىٰ (should be عَلٰى)' },
  { pattern: /حَتَّىٰ/g, name: 'Cairo style حَتَّىٰ (should be حَتّٰى)' },
  { pattern: /يَسْعَىٰ/g, name: 'Cairo style يَسْعَىٰ (should be يَسْعٰى)' },
];

console.log('=== VERIFYING PAKISTANI ORTHOGRAPHY ACROSS ALL CHAPTERS ===\n');

let issuesFound = 0;

CHAPTERS.forEach((chapter) => {
  chapter.sections.forEach((section, sIdx) => {
    FORBIDDEN_PATTERNS.forEach(({ pattern, name }) => {
      const arabicMatches = section.arabic.match(pattern);
      if (arabicMatches) {
        console.warn(`[Ch ${chapter.id} Sec ${sIdx + 1}] Issue: ${name} found in: "${section.arabic.substring(0, 40)}..."`);
        issuesFound++;
      }
    });
  });

  if (chapter.sarfiTahqeeq) {
    chapter.sarfiTahqeeq.forEach((t, tIdx) => {
      FORBIDDEN_PATTERNS.forEach(({ pattern, name }) => {
        const wordMatch = t.word.match(pattern);
        if (wordMatch) {
          console.warn(`[Ch ${chapter.id} Word ${tIdx + 1} (${t.word})] Issue: ${name}`);
          issuesFound++;
        }
      });
    });
  }
});

if (issuesFound === 0) {
  console.log('✅ ALL CHAPTERS PASS! 100% compliant with authentic Pakistani orthography.');
} else {
  console.log(`⚠️ Found ${issuesFound} occurrences to check.`);
}
