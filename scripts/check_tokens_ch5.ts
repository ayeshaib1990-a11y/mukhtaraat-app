import fs from 'fs';
import { CHAPTERS } from '../src/data/chaptersData.ts';

const raw = fs.readFileSync('./public/assets/aistudio/Paste_October_25__2026_-_7_35PM_483f8f83', 'utf8');

const blocks = raw.split(/(?:^|\n)\s*(?:[۰-۹\d]+[\.\-]\s*)?کلمہ:/g);

const parsedWords: any[] = [];

blocks.slice(1).forEach((block, idx) => {
  const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
  const firstLine = lines[0] || '';
  
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

  parsedWords.push({
    num: idx + 1,
    rawLine: firstLine,
    w: cleanWord,
    root: getField('مادہ:'),
    seh: getField('سہ اقسام:'),
    bahas: getField('بحث:'),
    seegha: getField('صیغہ:'),
    bab: getField('باب:'),
    shash: getField('شش اقسام:'),
    haft: getField('ہفت اقسام:'),
    wazn: getField('وزن:'),
    talil: getMultiLineField('تعلیل:', ['معنی و سیاق:', 'معنی:', 'سیاق:']),
    meaning: getMultiLineField('معنی و سیاق:', ['کلمہ:', 'تعلیل:'])
  });
});

const ch = CHAPTERS[4];
console.log('Chapter 4 Title:', ch.title);
console.log('Sections:', ch.sections.length);

// Extract all data-word from sections
const tokens: string[] = [];
ch.sections.forEach((sec, sIdx) => {
  const matches = sec.arabic.match(/data-word="([^"]+)"/g) || [];
  matches.forEach(m => {
    const val = m.replace('data-word="', '').replace('"', '');
    tokens.push(val);
  });
});

console.log('Total tokens in sections:', tokens.length);
console.log('Total parsed words from attachment:', parsedWords.length);

// Check differences
const tokenSet = new Set(tokens);
const wordSet = new Set(parsedWords.map(w => w.w));

const inTokensNotWords = tokens.filter(t => !wordSet.has(t));
const inWordsNotTokens = parsedWords.map(w => w.w).filter(w => !tokenSet.has(w));

console.log('Tokens not in words:', inTokensNotWords);
console.log('Words not in tokens:', inWordsNotTokens);
