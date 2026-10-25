import fs from 'fs';

// Read Paste_October_22__2026_-_7_56PM_a3c955b0 which contains the 179 words
const rawTahqeeq = fs.readFileSync('./public/assets/aistudio/Paste_October_22__2026_-_7_56PM_a3c955b0', 'utf8');

const blocks = rawTahqeeq.split(/(?:^|\n)\s*(?:[۰-۹\d]+[\.\-]\s*)?کلمہ:/g);

const parsedWords: any[] = [];

blocks.slice(1).forEach((block, idx) => {
  const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
  const firstLine = lines[0] || '';
  
  let cleanWord = firstLine.split(/[\(\-\+–—]/)[0].trim();
  cleanWord = cleanWord.replace(/[،,.:]/g, '').trim();

  // Normalize dagger alifs to match the text tokens:
  if (cleanWord === 'عَسَىٰ' || cleanWord === 'عَسَى') cleanWord = 'عَسٰى';
  if (cleanWord === 'نَرَىٰ' || cleanWord === 'نَرَى') cleanWord = 'نَرٰى';
  if (cleanWord === 'أَخْشَىٰ' || cleanWord === 'أَخْشَى') cleanWord = 'أَخْشٰى';
  if (cleanWord === 'أَضَآءَ') cleanWord = 'أَضَاءَ';

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
    qism: seh,
    bahas,
    seegha,
    bab,
    shash,
    haft,
    wazn: wazn || '-------',
    talil: talil || undefined,
    taleel: talil || undefined,
    tallel: talil || undefined,
    meaning
  });
});

console.log(`Parsed ${parsedWords.length} words from Tahqeeq.`);

// Load chapters
const chaptersFile = fs.readFileSync('./src/data/chaptersData.ts', 'utf8');
const jsonMatch = chaptersFile.match(/export const CHAPTERS: Chapter\[\] = ([\s\S]+);/);
if (!jsonMatch) {
  throw new Error('Could not match CHAPTERS array');
}

const chapters = eval(jsonMatch[1]);
const ch5 = chapters[4];

// Check current sections tokens vs parsedWords
const currentTokens: string[] = [];
ch5.sections.forEach((sec: any) => {
  const matches = sec.arabic.match(/data-word="([^"]+)"/g) || [];
  matches.forEach((m: string) => {
    currentTokens.push(m.replace('data-word="', '').replace('"', ''));
  });
});

console.log(`Tokens in Chapter 5 sections: ${currentTokens.length}`);
console.log(`Words in parsedWords array: ${parsedWords.length}`);

const currentTokenSet = new Set(currentTokens);
const parsedWordSet = new Set(parsedWords.map(w => w.w));

const missingInWords = currentTokens.filter(t => !parsedWordSet.has(t));
const missingInTokens = parsedWords.map(w => w.w).filter(w => !currentTokenSet.has(w));

console.log('Tokens missing in parsed words:', missingInWords);
console.log('Parsed words missing in tokens:', missingInTokens);

if (missingInWords.length === 0 && missingInTokens.length === 0 && parsedWords.length === 179) {
  console.log('PERFECT 100% MATCH! All 179 tokens match all 179 words.');
  
  // Update Chapter 5 in chapters
  ch5.words = parsedWords;
  ch5.ownTahqeeqOnly = true;

  // Build new file content
  const header = `export interface WordItem {
  id?: number | string;
  w: string;
  word?: string;
  meaning?: string;
  root?: string;
  seh?: string;
  bab?: string;
  seegha?: string;
  bahas?: string;
  shash?: string;
  haft?: string;
  wazn?: string;
  talil?: string;
  extra?: string;
  singular?: string;
  plural?: string;
  qism?: string;
  [key: string]: any;
}

export interface Section {
  label: string;
  arabic: string;
  urdu: string;
  [key: string]: any;
}

export interface Chapter {
  title: string;
  urduTitle: string;
  attribution?: string;
  ownTahqeeqOnly?: boolean;
  sections: Section[];
  words?: WordItem[];
  [key: string]: any;
}

export const CHAPTERS: Chapter[] = `;

  const newFileContent = header + JSON.stringify(chapters, null, 2) + `;\n`;
  fs.writeFileSync('./src/data/chaptersData.ts', newFileContent, 'utf8');
  console.log('Successfully written updated Chapter 5 to src/data/chaptersData.ts!');
} else {
  console.error('Mismatch found! Aborting write.');
}
