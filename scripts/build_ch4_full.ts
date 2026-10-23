import fs from 'fs';

// Load raw user text from attachment
const raw = fs.readFileSync('public/assets/aistudio/Paste_October_22__2026_-_6_59PM_55b766a8', 'utf8');
const blocks = raw.split(/\n(?=\d+\.\s*کلمہ:)/);

export interface FormattedWord {
  num: number;
  w: string;
  root: string;
  qism: string;
  bahas: string;
  seegha: string;
  bab: string;
  shash: string;
  haft: string;
  wazn: string;
  taleel?: string;
  tallel?: string;
  meaning: string;
  singular?: string;
  plural?: string;
}

const words: FormattedWord[] = [];

for (const b of blocks) {
  if (!b.trim()) continue;
  const numMatch = b.match(/^(\d+)\.\s*کلمہ:\s*(.+)/);
  if (!numMatch) continue;
  const num = parseInt(numMatch[1], 10);
  let kalma = numMatch[2].trim();

  // Indo-Pak Subcontinent orthography adjustments on words (e.g. dagger alif)
  if (kalma === 'أَعْطَى') kalma = 'أَعْطٰى';
  if (kalma === 'أَتَى') kalma = 'أَتٰى';
  if (kalma === 'أَثْنَى') kalma = 'أَثْنٰى';
  if (kalma === 'فَبَكَى') kalma = 'فَبَكٰى';

  const getField = (prefix: string) => {
    const m = b.match(new RegExp(prefix + ':\\s*([^\n]+)'));
    return m ? m[1].trim() : '';
  };

  let wazn = getField('وزن');
  // Strip definite article 'الْـ' or 'الـ' or 'بِالْـ' from noun wazan
  if (wazn.startsWith('الْ') || wazn.startsWith('ال')) {
    wazn = wazn.replace(/^الْ?/, '');
  }
  if (wazn.startsWith('بِالْ')) {
    wazn = wazn.replace(/^بِالْ/, '');
  }
  if (wazn.includes('الْفَعَالَى')) {
    wazn = wazn.replace(/الْفَعَالَى/g, 'فَعَالَى').replace(/الْفَعَائِل/g, 'فَعَائِل');
  }

  // Ensure original un-altered wazn before ta'leel
  if (num === 3) wazn = 'أَفْعَلَ'; // أَعْطٰى (اصل: أَعْطَوَ)
  if (num === 4) wazn = 'فَعَالَى (اصل: فَعَائِلُ / فَعَالِوُ)';
  if (num === 7) wazn = 'لَمْ يَفْعُلْ'; // لَمْ يَكُنْ (اصل: لَمْ يَكْوُنْ)
  if (num === 11) wazn = 'فَعَلَةُ'; // الْقَالَةُ (اصل: قَوَلَةُ)
  if (num === 12) wazn = 'فَعَلَ'; // قَالَ (اصل: قَوَلَ)
  if (num === 13) wazn = 'فَاعِلُهُمْ'; // قَائِلُهُمْ (اصل: قَاوِلُهُمْ)
  if (num === 19) wazn = 'أَفْعَلْتَ'; // أَصَبْتَ (اصل: أَصْوَبْتَ)
  if (num === 21) wazn = 'أَفْعَلْتَ'; // أَعْطَيْتَ (اصل: أَعْطَوْتَ)
  if (num === 22) wazn = 'فَعَالَى'; // عَطَايَا (اصل: عَطَائِوُ)
  if (num === 26) wazn = 'فَعَلَ'; // جَاءَ (اصل: جَيَأَ)
  if (num === 31) wazn = 'أَفْعَلُونَ'; // آخَرُونَ (اصل: أَأْخَرُونَ)
  if (num === 32) wazn = 'فَعَلَهُمْ'; // رَدَّهُمْ (اصل: رَدَدَهُمْ)
  if (num === 34) wazn = 'فَعَلَ'; // أَتٰى (اصل: أَتَيَ)
  if (num === 37) wazn = 'أَفْعَلَ'; // أَثْنٰى (اصل: أَثْنَيَ)
  if (num === 38) wazn = 'فَعَلَةٌ'; // قَالَةٌ (اصل: قَوَلَةٌ)
  if (num === 41) wazn = 'أَلَمْ أَفْعِكُمْ (اصل: أَلَمْ أَفْعِلْكُمْ)';
  if (num === 43) wazn = 'فَعَلَكُمُ'; // فَهَدَاكُمُ (اصل: فَهَدَيَكُمُ)
  if (num === 44) wazn = 'فَعَلَةً'; // عَالَةً (اصل: عَيَلَةً)
  if (num === 45) wazn = 'أَفْعَلَكُمُ'; // فَأَغْنَاكُمُ (اصل: فَأَغْنَيَكُمْ)
  if (num === 46) wazn = 'أَفْعَالًا'; // أَعْدَاءً (اصل: أَعْدَاوًا)
  if (num === 48) wazn = 'فَعَلُوا'; // قَالُوا (اصل: قَوَلُوا)
  if (num === 49) wazn = 'أَفْعَلُ'; // أَمَنُّ (اصل: أَمْنَنُ)
  if (num === 51) wazn = 'أَلَا تُفْعِلُونَنِي'; // أَلَا تُجِيبُونَنِي (اصل: تُجْوِبُونَ)
  if (num === 52) wazn = 'نُفْعِلُكَ'; // نُجِيبُكَ (اصل: نُجْوِبُكَ)
  if (num === 53) wazn = 'فَعِلْتُمْ'; // شِئْتُمْ (اصل: شَيِئْتُمْ)
  if (num === 54) wazn = 'فَعَلْتُمْ'; // قُلْتُمْ (اصل: قَوَلْتُمْ)
  if (num === 63) wazn = 'أَفْعَلْنَاكَ'; // آوَيْنَاكَ (اصل: أَأْوَيْنَاكَ)
  if (num === 64) wazn = 'فَاعِلًا'; // عَائِلًا (اصل: عَايِلًا)
  if (num === 65) wazn = 'فَاعَلْنَاكَ'; // وَاسَيْنَاكَ (اصل: آسَيْنَاكَ)
  if (num === 71) wazn = 'تَفْعَلُونَ'; // تَرْضَوْنَ (اصل: تَرْضَيُونَ)
  if (num === 73) wazn = 'فَعَةِ (اصل: فَعْلَة)'; // بِالشَّاةِ (اصل: شَوْهَة)
  if (num === 77) wazn = 'أَفْعَلُ (اصل: أَخْيَرُ)'; // خَيْرٌ
  if (num === 79) wazn = 'فَعَلْتُ'; // كُنْتُ (اصل: كَوَنْتُ)
  if (num === 87) wazn = 'فَعَلَ'; // بَكٰى (اصل: بَكَيَ)

  let taleel = getField('تعلیل');
  if (taleel) {
    taleel = taleel.trim();
    // Normalize format to: اصل: «...» --- قاعدہ: [...] --- تعلیل شدہ کلمہ: «...»
    if (!taleel.startsWith('اصل:')) {
      taleel = taleel.replace(/^اصل میں\s*/, 'اصل: ').replace(/تھا[؛،]\s*/, 'تھا --- قاعدہ: ');
    }
  }

  let bahas = getField('بحث');
  bahas = bahas.replace(/فعل ماضی معروف/g, 'فعل ماضی معلوم');
  bahas = bahas.replace(/فعل مضارع معروف/g, 'فعل مضارع معلوم');

  const mada = getField('مادہ');
  const seh = getField('سہ اقسام');
  const seegha = getField('صیغہ');
  const baab = getField('باب');
  const shash = getField('شش اقسام');
  const haft = getField('ہفت اقسام');
  const mana = getField('معنی و سیاق') || getField('معنی');

  // Extract singular/plural if present in bahas or text
  let singular: string | undefined = undefined;
  let plural: string | undefined = undefined;
  const singM = bahas.match(/مفرد:\s*([^)]+)/);
  if (singM) singular = singM[1].trim();
  const plurM = bahas.match(/جمع:\s*([^)]+)/);
  if (plurM) plural = plurM[1].trim();

  words.push({
    num,
    w: kalma,
    root: mada,
    qism: seh,
    bahas: bahas,
    seegha: seegha,
    bab: baab,
    shash: shash,
    haft: haft,
    wazn: wazn,
    taleel: taleel || undefined,
    tallel: taleel || undefined,
    meaning: mana,
    singular: singular,
    plural: plural
  });
}

console.log('Total words ready:', words.length);
fs.writeFileSync('workspace/chapter4_parsed_words.json', JSON.stringify(words, null, 2), 'utf8');
console.log('Saved workspace/chapter4_parsed_words.json');
