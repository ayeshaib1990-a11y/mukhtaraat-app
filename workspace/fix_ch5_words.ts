import fs from 'fs';

// Read the user prompt input or existing chapter 5 words
const rawInput = fs.readFileSync('workspace/chapter5_replacement.json', 'utf8');
const data = JSON.parse(rawInput);

console.log(`Original words count: ${data.words.length}`);

// Map of original wazn before ta'leel (اصل درسی وزن ف-ع-ل قبل از تعلیل)
const ASL_WAZN_MAP: Record<string, string> = {
  'لَمْ تُبْقِ': 'لَمْ تُفْعِلْ',
  'قُلْتُ': 'فَعَلْتُ',
  'لَمْ آخُذْ': 'لَمْ أَفْعُلْ',
  'فَلَآخُذَنَّهُ': 'فَلَأَفْعُلَنَّهُ',
  'قَالَ': 'فَعَلَ',
  'لَمْ أَجِدْ': 'لَمْ أَفْعِلْ',
  'شَاءَ': 'فَعِلَ',
  'نَامَا': 'فَعِلَا',
  'مَا كُنَّا': 'مَا فَعَلْنَا',
  'قَامَ': 'فَعَلَ',
  'فَبِتْنَا': 'فَفَعِلْنَا',
  'فَقُلْتُ': 'فَفَعَلْتُ',
  'لَأَرْجُو': 'لَأَفْعُلُ',
  'لَيَقُلْنَ': 'لَيَفْعُلْنَ',
  'كُنْتِ': 'فَعَلْتِ',
  'أَقُولُ': 'أَفْعُلُ',
  'تَرُوحُ': 'تَفْعُلُ',
  'لَا يَجِدُهَا': 'لَا يَفْعِلُهَا',
  'جِيَاعًا': 'فِعَالًا',
  'لَمْ نَزَلْ': 'لَمْ نَفْعَلْ',
  'مَضَتْ': 'فَعَلَتْ',
  'كَانَ': 'فَعَلَ',
  'يَشِبُّ': 'يَفْعِلُ',
  'لَا يَشُبُّهُ': 'لَا يَفْعُلُهُ',
  'نَرَىٰ': 'نَفْعَلُ',
  'أَخْشَىٰ': 'أَفْعَلُ',
  'رَدَّتْهُ': 'فَعَلَتْهُ',
  'أَتَانَا': 'فَعَلَنَا',
  'يَشْتَدُّ': 'يَفْتَعِلُ',
  'بِيضٌ': 'فُعْلٌ',
  'فَشَقَّا': 'فَفَعَلَا',
  'يَسُوطَانِهِ': 'يَفْعُلَانِهِ',
  'قَائِمًا': 'فَاعِلًا',
  'فَقُلْنَا': 'فَفَعَلْنَا',
  'جَاءَنِي': 'فَعَلَنِي',
  'لَا أَدْرِي': 'لَا أَفْعِلُ',
  'أَنْ يَكُونَ': 'أَنْ يَفْعُلَ',
  'أُصِيبَ': 'أُفْعِلَ',
  'تُحِبِّينَ': 'تُفْعِلِينَ',
  'فَلَمْ تَدَعْنِي': 'فَلَمْ تَفْعَلْنِي',
  'أَضَاءَ': 'أَفْعَلَ',
  'أَخَفَّ': 'أَفْعَلَ',
  'دَعِيهِ': 'اِفْعَلِيهِ'
};

const fixedWords = data.words.map((w: any) => {
  const item = { ...w };

  // 1. Strip 'الـ' or 'الْـ' from wazn if it's a noun
  if (item.wazn) {
    let cleanWazn = item.wazn
      .replace(/^[اأإآ]ل[َُِْ]?/g, '')
      .replace(/^الِ/g, 'اِ')
      .replace(/^الأَ/g, 'أَ')
      .trim();
    item.wazn = cleanWazn;
  }

  // 2. Check if there's a specific Asl Wazn
  const cleanWordKey = (item.w || item.word || '').replace(/[ؐ-ؚ]/g, '').trim();
  if (ASL_WAZN_MAP[cleanWordKey]) {
    item.wazn = ASL_WAZN_MAP[cleanWordKey];
  }

  // 3. Format Taleel as: [اصل] ۔۔ [قاعدہ] ۔۔۔ [تعلیل شدہ لفظ]
  let rawTaleel = item.tallel || item.taleel || '';
  if (rawTaleel) {
    rawTaleel = rawTaleel.trim();
    // If it's a "no taleel" text, remove it
    if (
      rawTaleel.includes('کوئی تعلیل واقع نہیں ہوئی') ||
      rawTaleel.includes('کلمہ صحیح ہے') ||
      rawTaleel.includes('کلمہ اپنے اصل پر ہے') ||
      rawTaleel.includes('اپنے اصلی وزن پر قائم ہے') ||
      rawTaleel.includes('اسم منقوص ہے')
    ) {
      delete item.tallel;
      delete item.taleel;
    } else {
      // Check if it has اصل and قاعدہ
      const m1 = rawTaleel.match(/اصل:\s*«?([^»\r\n]+)»?\s*(?:تھا)?\s*(?:---|۔۔)?\s*قاعدہ:\s*(.+?)\s*(?:---|۔۔۔)?\s*تعلیل شدہ (?:کلمہ|لفظ):\s*«?([^»\r\n]+)»?(?:\s*بن گیا۔?)?$/s);
      if (m1) {
        const formatted = `${m1[1].trim()} ۔۔ ${m1[2].trim()} ۔۔۔ ${m1[3].trim()}`;
        item.tallel = formatted;
        item.taleel = formatted;
      } else {
        // Look for dashed format
        const m2 = rawTaleel.match(/^(.+?)\s*---\s*(.+?)\s*---\s*(.+?)$/s);
        if (m2) {
          const p1 = m2[1].replace(/اصل:\s*«?|»?\s*تھا/g, '').trim();
          const p2 = m2[2].replace(/قاعدہ:\s*/g, '').trim();
          const p3 = m2[3].replace(/تعلیل شدہ (?:کلمہ|لفظ):\s*«?|»?\s*بن گیا۔?/g, '').trim();
          const formatted = `${p1} ۔۔ ${p2} ۔۔۔ ${p3}`;
          item.tallel = formatted;
          item.taleel = formatted;
        } else {
          item.tallel = rawTaleel;
          item.taleel = rawTaleel;
        }
      }
    }
  }

  // 4. Ensure bahas says معلوم instead of معروف
  if (item.bahas) {
    item.bahas = item.bahas.replace(/معروف/g, 'معلوم');
  }

  return item;
});

data.words = fixedWords;
fs.writeFileSync('workspace/chapter5_replacement.json', JSON.stringify(data, null, 2), 'utf8');
fs.writeFileSync('workspace/chapter5_parsed_words.json', JSON.stringify(fixedWords, null, 2), 'utf8');

console.log('Successfully updated chapter5_replacement.json and chapter5_parsed_words.json');
