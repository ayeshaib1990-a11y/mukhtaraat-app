import fs from 'fs';

// Read raw words from attachment
const rawWordsText = fs.readFileSync('public/assets/aistudio/Paste_October_22__2026_-_7_56PM_a3c955b0', 'utf8');

// Parse entries
const entries = rawWordsText.split(/(?=[۰-۹0-9]+[\.،\s]+کلمہ:)/).filter(e => e.trim().includes('کلمہ:'));
console.log('Found raw word entries:', entries.length);

function cleanWazn(wazn: string, qism: string): string {
  if (!wazn) return '';
  let w = wazn.trim();
  // Strip Alif-Lam from nouns
  w = w.replace(/^(?:الْـ?|الـ?|اَلـ?|الِ?|الأَ?)/, (match) => {
    if (match.startsWith('الأَ')) return 'أَ';
    if (match.startsWith('الِ')) return 'اِ';
    return '';
  });
  return w;
}

function formatTaleel(rawTaleel: string): string {
  if (!rawTaleel) return '';
  let t = rawTaleel.trim();
  if (t.includes('کلمہ صحیح ہے') || t.includes('کوئی تعلیل واقع نہیں ہوئی')) {
    return '';
  }
  const aslMatch = t.match(/اصل:\s*([^\n\r]+)/);
  const qaidaMatch = t.match(/قاعدہ:\s*([\s\S]*?)(?=(?:تعلیل شدہ|$))/);
  const natMatch = t.match(/تعلیل شدہ (?:لفظ|کلمہ):\s*([^\n\r]+)/);

  if (aslMatch && qaidaMatch && natMatch) {
    const asl = aslMatch[1].trim();
    const qaida = qaidaMatch[1].trim().replace(/\r?\n/g, ' ');
    const nat = natMatch[1].trim();
    return `اصل: «${asl}» تھا --- قاعدہ: ${qaida} --- تعلیل شدہ کلمہ: «${nat}» بن گیا۔`;
  }
  return t.replace(/\r?\n/g, ' ');
}

function normalizeIndoPakWord(w: string): string {
  let s = w.trim().replace(/\s*\([^\)]*\)/g, '').trim();
  // Standardize Alif Maqsura with dagger alif on preceding letter
  s = s.replace(/عَس[َٰ]*ى[ٰ]*/g, '\u0639\u064E\u0633\u0670\u0649'); // عَسٰى
  s = s.replace(/أَخْش[َٰ]*ى[ٰ]*/g, '\u0623\u064E\u062E\u0652\u0634\u0670\u0649'); // أَخْشٰى
  s = s.replace(/نَر[َٰ]*ى[ٰ]*/g, '\u0646\u064E\u0631\u0670\u0649'); // نَرٰى
  return s;
}

const parsedWords = entries.map((entry, idx) => {
  const numMatch = entry.match(/^([۰-۹0-9]+)[\.،\s]+کلمہ:\s*([^\n\r]+)/);
  let rawW = numMatch ? numMatch[2].trim() : '';
  let w = normalizeIndoPakWord(rawW);

  const rootM = entry.match(/مادہ:\s*([^\n\r]+)/);
  const qismM = entry.match(/سہ اقسام:\s*([^\n\r]+)/);
  const bahasM = entry.match(/بحث:\s*([^\n\r]+)/);
  const seeghaM = entry.match(/صیغہ:\s*([^\n\r]+)/);
  const babM = entry.match(/باب:\s*([^\n\r]+)/);
  const shashM = entry.match(/شش اقسام:\s*([^\n\r]+)/);
  const haftM = entry.match(/ہفت اقسام:\s*([^\n\r]+)/);
  const waznM = entry.match(/وزن:\s*([^\n\r]+)/);

  let taleel = '';
  const taleelM = entry.match(/تعلیل:\s*([\s\S]*?)(?=(?:\r?\n\s*معنی و سیاق:|\r?\n\s*مفرد:|\r?\n\s*جمع:|$))/);
  if (taleelM) {
    taleel = formatTaleel(taleelM[1]);
  }

  const meaningM = entry.match(/معنی و سیاق:\s*([\s\S]*?)$/);
  const meaning = meaningM ? meaningM[1].trim() : '';

  const qism = qismM ? qismM[1].trim() : '';
  let bahas = bahasM ? bahasM[1].trim() : '';
  bahas = bahas.replace(/معروف/g, 'معلوم');

  let wazn = waznM ? cleanWazn(waznM[1].trim(), qism) : '';

  const wordObj: any = {
    w,
    root: rootM ? rootM[1].trim() : '',
    qism,
    bahas,
    seegha: seeghaM ? seeghaM[1].trim() : '',
    bab: babM ? babM[1].trim() : '',
    shash: shashM ? shashM[1].trim() : '',
    haft: haftM ? haftM[1].trim() : '',
    wazn,
    meaning
  };

  if (taleel) {
    wordObj.taleel = taleel;
    wordObj.tallel = taleel;
  }

  return wordObj;
});

console.log('Processed words:', parsedWords.length);
fs.writeFileSync('workspace/chapter5_parsed_words.json', JSON.stringify(parsedWords, null, 2), 'utf8');
console.log('Saved workspace/chapter5_parsed_words.json');
