import fs from 'fs';

// 1. Read the Sarfi Tahqeeq raw text
const rawTahqeeq = fs.readFileSync('./public/assets/aistudio/Paste_October_25__2026_-_7_35PM_483f8f83', 'utf8');

// Parse 179 words
const blocks = rawTahqeeq.split(/(?:^|\n)\s*(?:[۰-۹\d]+[\.\-]\s*)?کلمہ:/g);

interface WordItem {
  w: string;
  word?: string;
  root?: string;
  seh?: string;
  qism?: string;
  bahas?: string;
  seegha?: string;
  bab?: string;
  shash?: string;
  haft?: string;
  wazn?: string;
  talil?: string;
  meaning?: string;
  [key: string]: any;
}

const parsedWords: WordItem[] = [];

blocks.slice(1).forEach((block, idx) => {
  const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
  const firstLine = lines[0] || '';
  
  // Clean word: remove brackets / plus explanations
  let cleanWord = firstLine.split(/[\(\-\+–—]/)[0].trim();
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
    w: cleanWord,
    root,
    seh,
    qism: seh, // ensure both seh and qism are populated for complete UI compatibility
    bahas,
    seegha,
    bab,
    shash,
    haft,
    wazn: wazn || '-------',
    talil: talil || undefined,
    meaning
  });
});

console.log(`Parsed ${parsedWords.length} words from Tahqeeq attachment.`);

// Let's load the current chaptersData to see current Chapter 5 sections
const chaptersFile = fs.readFileSync('./src/data/chaptersData.ts', 'utf8');
const jsonMatch = chaptersFile.match(/export const CHAPTERS: Chapter\[\] = ([\s\S]+);/);
if (!jsonMatch) {
  throw new Error('Could not match CHAPTERS array');
}

const chapters = eval(jsonMatch[1]);
const ch5 = chapters[4];
console.log('Chapter 5 title:', ch5.title);
console.log('Chapter 5 sections count:', ch5.sections.length);

// Let's inspect tokens in current sections vs parsedWords
const currentTokens: string[] = [];
ch5.sections.forEach((sec: any) => {
  const matches = sec.arabic.match(/data-word="([^"]+)"/g) || [];
  matches.forEach((m: string) => {
    currentTokens.push(m.replace('data-word="', '').replace('"', ''));
  });
});

console.log(`Current sections tokens: ${currentTokens.length}`);
console.log(`Parsed words count: ${parsedWords.length}`);

// Compare word lists
const currentTokenSet = new Set(currentTokens);
const parsedWordSet = new Set(parsedWords.map(w => w.w));

const missingInWords = currentTokens.filter(t => !parsedWordSet.has(t));
const missingInTokens = parsedWords.map(w => w.w).filter(w => !currentTokenSet.has(w));

console.log('Tokens missing in parsed words:', missingInWords);
console.log('Parsed words missing in tokens:', missingInTokens);
