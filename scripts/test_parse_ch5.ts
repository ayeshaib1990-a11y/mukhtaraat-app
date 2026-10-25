import fs from 'fs';

const raw = fs.readFileSync('./public/assets/aistudio/Paste_October_25__2026_-_7_35PM_483f8f83', 'utf8');

// Regex to split by word blocks
// Matches numbers in Urdu or Arabic or Western digits followed by period and ' کلمہ:'
const blocks = raw.split(/(?:^|\n)\s*(?:[۰-۹\d]+[\.\-]\s*)?کلمہ:/g);

console.log('Total split blocks:', blocks.length);

const parsedWords: any[] = [];

blocks.slice(1).forEach((block, idx) => {
  const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
  const firstLine = lines[0] || '';
  
  // Extract word: before parenthesis or dash or plus if present
  let cleanWord = firstLine.split(/[\(\-\+–—]/)[0].trim();
  // Remove any trailing punct
  cleanWord = cleanWord.replace(/[،,.:]/g, '').trim();

  const getField = (prefix: string) => {
    for (const l of lines) {
      if (l.startsWith(prefix)) {
        return l.substring(prefix.length).trim().replace(/^[:：\s]+/, '');
      }
    }
    return '';
  };

  const getMultiLineField = (prefix: string, nextPrefixes: string[]) => {
    let result = '';
    let capturing = false;
    for (const l of lines) {
      if (l.startsWith(prefix)) {
        capturing = true;
        result = l.substring(prefix.length).trim().replace(/^[:：\s]+/, '');
        continue;
      }
      if (capturing) {
        if (nextPrefixes.some(p => l.startsWith(p))) {
          capturing = false;
        } else {
          result += ' ' + l;
        }
      }
    }
    return result.trim();
  };

  const root = getField('مادہ:');
  const seh = getField('سہ اقسام:');
  const bahas = getField('بحث:');
  const seegha = getField('صیغہ:');
  const bab = getField('باب:');
  const shash = getField('شش اقسام:');
  const haft = getField('ہفت اقسام:');
  const wazn = getField('وزن:');
  const talil = getMultiLineField('تعلیل:', ['معنی و سیاق:', 'معنی:', 'سیاق:']);
  const meaning = getMultiLineField('معنی و سیاق:', ['کلمہ:', 'تعلیل:']);

  parsedWords.push({
    num: idx + 1,
    rawLine: firstLine,
    w: cleanWord,
    root,
    seh,
    bahas,
    seegha,
    bab,
    shash,
    haft,
    wazn,
    talil,
    meaning
  });
});

console.log('Parsed words count:', parsedWords.length);
console.log('Word 1:', parsedWords[0]);
console.log('Word 179:', parsedWords[parsedWords.length - 1]);

// Check for missing meanings or roots or sehs
const missingMeanings = parsedWords.filter(w => !w.meaning);
const missingRoots = parsedWords.filter(w => !w.root);
const missingSeh = parsedWords.filter(w => !w.seh);
console.log('Missing meanings count:', missingMeanings.length);
console.log('Missing roots count:', missingRoots.length);
console.log('Missing seh count:', missingSeh.length);
if (missingMeanings.length) {
  console.log('Missing meanings samples:', missingMeanings.slice(0, 3));
}
