import fs from 'fs';

const rawReplacement = fs.readFileSync('workspace/chapter5_replacement.json', 'utf8');
const ch5Data = JSON.parse(rawReplacement);

let chaptersDataSrc = fs.readFileSync('src/data/chaptersData.ts', 'utf8');

// Find start of Chapter 5
const ch5Marker = '"title": "فِي بَنِي سَعْدٍ"';
const ch5Index = chaptersDataSrc.indexOf(ch5Marker);
if (ch5Index === -1) {
  console.error('Could not find Chapter 5 in chaptersData.ts');
  process.exit(1);
}

// Find the words array of chapter 5
const wordsKey = '"words": [';
const wordsStart = chaptersDataSrc.indexOf(wordsKey, ch5Index);
if (wordsStart === -1) {
  console.error('Could not find words array in Chapter 5');
  process.exit(1);
}

// Find matching closing bracket for words: [ ... ]
let depth = 0;
let wordsEnd = -1;
for (let i = wordsStart + wordsKey.length - 1; i < chaptersDataSrc.length; i++) {
  if (chaptersDataSrc[i] === '[') depth++;
  else if (chaptersDataSrc[i] === ']') {
    depth--;
    if (depth === 0) {
      wordsEnd = i + 1;
      break;
    }
  }
}

if (wordsEnd === -1) {
  console.error('Could not find closing bracket for words array');
  process.exit(1);
}

const serializedWords = '"words": ' + JSON.stringify(ch5Data.words, null, 6);
const updatedCode = chaptersDataSrc.substring(0, wordsStart) + serializedWords + chaptersDataSrc.substring(wordsEnd);

fs.writeFileSync('src/data/chaptersData.ts', updatedCode, 'utf8');
console.log('Successfully spliced updated Chapter 5 words into src/data/chaptersData.ts!');
