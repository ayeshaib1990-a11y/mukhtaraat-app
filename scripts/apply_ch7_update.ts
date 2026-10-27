import fs from 'fs';

const raw = fs.readFileSync('public/assets/aistudio/Paste_October_27__2026_-_5_55PM_d6f84a3c', 'utf8');
const lines = raw.split('\n').map(l => l.trim()).filter(Boolean);

interface RawSection {
  num: number;
  label: string;
  arabic: string;
  urdu: string;
}

function isAudioPlaceholder(str: string): boolean {
  const s = str.trim();
  return s === 'عربی آواز' || s === 'اردو آواز';
}

const rawSections: RawSection[] = [];
// Section 1: line 0 is title, line 1 is urduTitle
rawSections.push({
  num: 1,
  label: 'متن 1',
  arabic: lines[2],
  urdu: lines[3]
});

let i = 4;
while (i < lines.length) {
  const line = lines[i];
  const match = line.match(/^متن\s*(\d+)$/);
  if (match) {
    const num = parseInt(match[1]);
    let arabic = '';
    let urdu = '';
    let j = i + 1;
    while (j < lines.length && isAudioPlaceholder(lines[j])) {
      j++;
    }
    if (j < lines.length && !lines[j].match(/^متن\s*\d+$/) && !isAudioPlaceholder(lines[j])) {
      arabic = lines[j];
      j++;
    }
    while (j < lines.length && isAudioPlaceholder(lines[j])) {
      j++;
    }
    if (j < lines.length && !lines[j].match(/^متن\s*\d+$/) && !isAudioPlaceholder(lines[j])) {
      urdu = lines[j];
      j++;
    }
    rawSections.push({ num, label: `متن ${num}`, arabic, urdu });
    i = j;
  } else {
    i++;
  }
}

console.log('Parsed raw sections count:', rawSections.length);

export function toPakistanArabic(text: string): string {
  let s = text;

  // 1. Allah: اللّٰه (shaddah + khara zabar \u0651\u0670)
  s = s.replace(/(^|[^\u0621-\u064A])فَوَاللهِ/g, '$1فَوَاللّٰهِ');
  s = s.replace(/(^|[^\u0621-\u064A])وَاللهِ/g, '$1وَاللّٰهِ');
  s = s.replace(/(^|[^\u0621-\u064A])بِاللهِ/g, '$1بِاللّٰهِ');
  s = s.replace(/(^|[^\u0621-\u064A])اللهِ/g, '$1اللّٰهِ');
  s = s.replace(/(^|[^\u0621-\u064A])اللهُ/g, '$1اللّٰهُ');
  s = s.replace(/(^|[^\u0621-\u064A])اللهَ/g, '$1اللّٰهَ');
  s = s.replace(/(^|[^\u0621-\u064A])الله/g, '$1اللّٰه');

  // 2. Alif Maqsura (standing alif ٰ on ى)
  s = s.replace(/صَلَّى(?![\u0670])/g, 'صَلَّىٰ');
  s = s.replace(/صلى(?![\u0670])/g, 'صَلَّىٰ');

  s = s.replace(/(^|[\s،؛.:؟!«»\"\'\(\)\{\}\[\]])عَلَى(?![\u0670])/g, '$1عَلَىٰ');
  s = s.replace(/(^|[\s،؛.:؟!«»\"\'\(\)\{\}\[\]])وَإِلَى(?![\u0670])/g, '$1وَإِلَىٰ');
  s = s.replace(/(^|[\s،؛.:؟!«»\"\'\(\)\{\}\[\]])إِلَى(?![\u0670])/g, '$1إِلَىٰ');

  s = s.replace(/حَتَّى(?![\u0670])/g, 'حَتَّىٰ');
  s = s.replace(/(^|[\s،؛.:؟!«»\"\'\(\)\{\}\[\]])بَلَى(?![\u0670])/g, '$1بَلَىٰ');
  s = s.replace(/أَقْوَى(?![\u0670])/g, 'أَقْوَىٰ');
  s = s.replace(/بِأَعْلَى(?![\u0670])/g, 'بِأَعْلَىٰ');
  s = s.replace(/(^|[\s،؛.:؟!«»\"\'\(\)\{\}\[\]])أَعْلَى(?![\u0670])/g, '$1أَعْلَىٰ');

  s = s.replace(/تَعَالَى(?![\u0670])/g, 'تَعَالَىٰ');
  s = s.replace(/فَأَوْفَى(?![\u0670])/g, 'فَأَوْفَىٰ');
  s = s.replace(/(^|[\s،؛.:؟!«»\"\'\(\)\{\}\[\]])أَوْفَى(?![\u0670])/g, '$1أَوْفَىٰ');
  s = s.replace(/وَسَعَى(?![\u0670])/g, 'وَسَعَىٰ');
  s = s.replace(/(^|[\s،؛.:؟!«»\"\'\(\)\{\}\[\]])سَعَى(?![\u0670])/g, '$1سَعَىٰ');
  s = s.replace(/وَنَهَى(?![\u0670])/g, 'وَنَهَىٰ');
  s = s.replace(/(^|[\s،؛.:؟!«»\"\'\(\)\{\}\[\]])نَهَى(?![\u0670])/g, '$1نَهَىٰ');
  s = s.replace(/فَجَلَّى(?![\u0670])/g, 'فَجَلَّىٰ');
  s = s.replace(/(^|[\s،؛.:؟!«»\"\'\(\)\{\}\[\]])جَلَّى(?![\u0670])/g, '$1جَلَّىٰ');
  s = s.replace(/وَرَّى(?![\u0670])/g, 'وَرَّىٰ');
  s = s.replace(/يَتَمَادَى(?![\u0670])/g, 'يَتَمَادَىٰ');
  s = s.replace(/سَيَخْفَى(?![\u0670])/g, 'سَيَخْفَىٰ');
  s = s.replace(/تَرْضَى(?![\u0670])/g, 'تَرْضَىٰ');
  s = s.replace(/يَرْضَى(?![\u0670])/g, 'يَرْضَىٰ');
  s = s.replace(/أَرَى(?![\u0670])/g, 'أَرَىٰ');

  // 3. Demonstratives in Indo-Pak / Quranic standard:
  s = s.replace(/(^|[\s،؛.:؟!«»\"\'\(\)\{\}\[\]])ذَلِكَ/g, '$1ذٰلِكَ');
  s = s.replace(/(^|[\s،؛.:؟!«»\"\'\(\)\{\}\[\]])بِذَلِكَ/g, '$1بِذٰلِكَ');
  s = s.replace(/(^|[\s،؛.:؟!«»\"\'\(\)\{\}\[\]])لِذَلِكَ/g, '$1لِذٰلِكَ');

  s = s.replace(/(^|[\s،؛.:؟!«»\"\'\(\)\{\}\[\]])وَهَذَا/g, '$1وَهٰذَا');
  s = s.replace(/(^|[\s،؛.:؟!«»\"\'\(\)\{\}\[\]])هَذَا/g, '$1هٰذَا');
  s = s.replace(/(^|[\s،؛.:؟!«»\"\'\(\)\{\}\[\]])بِهَذَا/g, '$1بِهٰذَا');
  s = s.replace(/(^|[\s،؛.:؟!«»\"\'\(\)\{\}\[\]])هَذِهِ/g, '$1هٰذِهِ');

  return s;
}

// 21 Words from Chapter 7
const words = [
  {
    "w": "أَتَخَلَّفْ",
    "word": "أَتَخَلَّفْ",
    "root": "خ - ل - ف",
    "seegha": "واحد متکلم",
    "bahas": "فعل مضارع معلوم منفی با لَمْ",
    "bab": "تَفَعُّل",
    "shash": "ثلاثی مزید فیہ",
    "haft": "صحیح",
    "wazn": "أَتَفَعَّلْ",
    "meaning": "پیچھے رہ جانا",
    "qism": "فعل",
    "talil": "لَمْ جازمہ داخل ہونے کی وجہ سے فا پر سکون آیا ہے۔"
  },
  {
    "w": "يُعَاتَبْ",
    "word": "يُعَاتَبْ",
    "root": "ع - ت - ب",
    "seegha": "واحد مذکر غائب",
    "bahas": "فعل مضارع مجہول منفی با لَمْ",
    "bab": "مُفَاعَلَة",
    "shash": "ثلاثی مزید فیہ",
    "haft": "صحیح",
    "wazn": "يُفَاعَلْ",
    "meaning": "سرزنش / عتاب کیا جانا",
    "qism": "فعل",
    "talil": "عَاتَبَ يُعَاتِبُ سے مضارع مجہول، لَمْ کی وجہ سے مجزوم ہے۔"
  },
  {
    "w": "تَوَاثَقْنَا",
    "word": "تَوَاثَقْنَا",
    "root": "و - ث - ق",
    "seegha": "جمع متکلم",
    "bahas": "فعل ماضی معروف",
    "bab": "تَفَاعُل",
    "shash": "ثلاثی مزید فیہ",
    "haft": "مثال واوی",
    "wazn": "تَفَاعَلْنَا",
    "meaning": "آپس میں پختہ عہد و پیمان کرنا",
    "qism": "فعل",
    "talil": "حرف علت فاء کلمہ میں واو ہے لہٰذا مثال واوی ہے۔"
  },
  {
    "w": "غَزَاهَا",
    "word": "غَزَاهَا",
    "root": "غ - ز - و",
    "seegha": "واحد مذکر غائب مع ضمیر مفعول",
    "bahas": "فعل ماضی معروف",
    "bab": "نَصَرَ يَنْصُرُ",
    "shash": "ثلاثی مجرد",
    "haft": "ناقص واوی",
    "wazn": "فَعَلَهَا",
    "meaning": "جنگ کرنا / لشکر کشی کرنا",
    "qism": "فعل",
    "talil": "غَزَوَ تھا، واو متحرک ماقبل مفتوح الف سے بدل گیا: غَزَا۔"
  },
  {
    "w": "أَقْوَىٰ",
    "word": "أَقْوَىٰ",
    "root": "ق - و - ی",
    "seegha": "واحد مذکر (اسم تفضیل)",
    "bahas": "اسم تفضیل",
    "bab": "سَمِعَ يَسْمَعُ (قَوِيَ)",
    "shash": "ثلاثی مجرد",
    "haft": "لفیف مقرون",
    "wazn": "أَفْعَلُ",
    "meaning": "سب سے زیادہ طاقتور اور قوی",
    "qism": "اسم",
    "talil": "عین میں واو اور لام میں یاء ہے لہٰذا لفیف مقرون ہے۔ برصغیر طرز میں الف مقصورہ پر کھڑا زبر لکھا جاتا ہے۔"
  },
  {
    "w": "أَيْسَرَ",
    "word": "أَيْسَرَ",
    "root": "ی - س - ر",
    "seegha": "واحد مذکر (اسم تفضیل)",
    "bahas": "اسم تفضیل",
    "bab": "سَمِعَ یا کَرُمَ",
    "shash": "ثلاثی مجرد",
    "haft": "مثال یائی",
    "wazn": "أَفْعَلُ",
    "meaning": "زیادہ خوشحال / آسودہ حال",
    "qism": "اسم",
    "talil": "فاء کلمہ میں یاء ہے لہٰذا مثال یائی ہے۔"
  },
  {
    "w": "مَفَازًا",
    "word": "مَفَازًا",
    "root": "ف - و - ز",
    "seegha": "اسم مکان / مصدر میمی",
    "bahas": "اسم مکان",
    "bab": "نَصَرَ (فَازَ يَفُوزُ)",
    "shash": "ثلاثی مجرد",
    "haft": "اجوف واوی",
    "wazn": "مَفْعَلًا",
    "meaning": "بے آب و گیاہ چٹیل میدان / ہلاکت خیز صحرا (بطور تفاؤل مَفَازہ کہا جاتا ہے)",
    "qism": "اسم",
    "talil": "مَفْوَز تھا، واو متحرک ماقبل ساکن نقل حرکت کے بعد الف سے بدلا: مَفَاز۔"
  },
  {
    "w": "فَطَفِقْتُ",
    "word": "فَطَفِقْتُ",
    "root": "ط - ف - ق",
    "seegha": "واحد متکلم",
    "bahas": "افعالِ مقاربہ / شروع",
    "bab": "سَمِعَ يَسْمَعُ",
    "shash": "ثلاثی مجرد",
    "haft": "صحیح",
    "wazn": "فَفَعِلْتُ",
    "meaning": "میں شروع ہو گیا / لگ گیا",
    "qism": "فعل",
    "talil": "افعالِ شروع میں سے ہے جو خبر مضارع کو چاہتے ہیں۔"
  },
  {
    "w": "قَافِلًا",
    "word": "قَافِلًا",
    "root": "ق - ف - ل",
    "seegha": "واحد مذکر (اسم فاعل منسوب بحال)",
    "bahas": "اسم فاعل",
    "bab": "نَصَرَ يَنْصُرُ (قَفَلَ)",
    "shash": "ثلاثی مجرد",
    "haft": "صحیح",
    "wazn": "فَاعِلًا",
    "meaning": "واپس لوٹنے والا / سفر سے رجوع کرنے والا",
    "qism": "اسم",
    "talil": "حال ہونے کی بنا پر منصوب ہے۔"
  },
  {
    "w": "الْبَاطِلُ",
    "word": "الْبَاطِلُ",
    "root": "ب - ط - ل",
    "seegha": "واحد مذکر (اسم فاعل)",
    "bahas": "اسم فاعل",
    "bab": "نَصَرَ / کَرُمَ",
    "shash": "ثلاثی مجرد",
    "haft": "صحیح",
    "wazn": "الْفَاعِلُ",
    "meaning": "جھوٹ، ناحق اور بے بنیاد بات",
    "qism": "اسم",
    "talil": "حق کی ضد ہے۔"
  },
  {
    "w": "تَبَسَّمَ",
    "word": "تَبَسَّمَ",
    "root": "ب - س - م",
    "seegha": "واحد مذکر غائب",
    "bahas": "فعل ماضی معروف",
    "bab": "تَفَعُّل",
    "shash": "ثلاثی مزید فیہ",
    "haft": "صحیح",
    "wazn": "تَفَعَّلَ",
    "meaning": "مسکرانا / زیرِ لب ہنسنا",
    "qism": "فعل",
    "talil": "ثلاثی مزید فیہ برائے تکلف و اظہار۔"
  },
  {
    "w": "الْمُغْضَبِ",
    "word": "الْمُغْضَبِ",
    "root": "غ - ض - ب",
    "seegha": "واحد مذکر (اسم مفعول)",
    "bahas": "اسم مفعول",
    "bab": "إِفْعَال (أَغْضَبَ يُغْضِبُ)",
    "shash": "ثلاثی مزید فیہ",
    "haft": "صحیح",
    "wazn": "الْمُفْعَلِ",
    "meaning": "غضب ناک کیا گیا / ناراض شخص",
    "qism": "اسم",
    "talil": "مضاف الیہ ہونے کی وجہ سے مجرور ہے۔"
  },
  {
    "w": "فَاجْتَنَبَنَا",
    "word": "فَاجْتَنَبَنَا",
    "root": "ج - ن - ب",
    "seegha": "واحد مذکر غائب مع ضمیر مفعول",
    "bahas": "فعل ماضی معروف",
    "bab": "إِفْتِعَال",
    "shash": "ثلاثی مزید فیہ",
    "haft": "صحیح",
    "wazn": "فَافْتَعَلَنَا",
    "meaning": "ہم سے کنارہ کش ہو گئے / ہم سے بچنے لگے",
    "qism": "فعل",
    "talil": "جَنَبَ سے افتعال برائے مبالغہ و التزام۔"
  },
  {
    "w": "تَنَكَّرَتْ",
    "word": "تَنَكَّرَتْ",
    "root": "ن - ک - ر",
    "seegha": "واحد مؤنث غائب",
    "bahas": "فعل ماضی معروف",
    "bab": "تَفَعُّل",
    "shash": "ثلاثی مزید فیہ",
    "haft": "صحیح",
    "wazn": "تَفَعَّلَتْ",
    "meaning": "اجنبی اور نا آشنا ہو گئی",
    "qism": "فعل",
    "talil": "الْأَرْضُ چونکہ مؤنث سماعی ہے اس لیے فعل مؤنث لایا گیا۔"
  },
  {
    "w": "تَسَوَّرْتُ",
    "word": "تَسَوَّرْتُ",
    "root": "س - و - ر",
    "seegha": "واحد متکلم",
    "bahas": "فعل ماضی معروف",
    "bab": "تَفَعُّل",
    "shash": "ثلاثی مزید فیہ",
    "haft": "اجوف واوی",
    "wazn": "تَفَعَّلْتُ",
    "meaning": "میں دیوار پھلانگ کر اوپر چڑھا اور داخل ہوا",
    "qism": "فعل",
    "talil": "سُور سے ماخوذ ہے جس کا معنی فصیل یا چاردیواری ہے۔"
  },
  {
    "w": "سَجَرْتُهُ",
    "word": "سَجَرْتُهُ",
    "root": "س - ج - ر",
    "seegha": "واحد متکلم مع ضمیر مفعول",
    "bahas": "فعل ماضی معروف",
    "bab": "نَصَرَ يَنْصُرُ",
    "shash": "ثلاثی مجرد",
    "haft": "صحیح",
    "wazn": "فَعَلْتُهُ",
    "meaning": "میں نے اس سے تنور کو دہکا دیا / جلا ڈالا",
    "qism": "فعل",
    "talil": "سَجَرَ التَّنُّورَ کا مطلب آگ جھونک کر بھڑکانا ہے۔"
  },
  {
    "w": "تَعْتَزِلَ",
    "word": "تَعْتَزِلَ",
    "root": "ع - ز - ل",
    "seegha": "واحد مذکر مخاطب",
    "bahas": "فعل مضارع معروف منصوب با أَنْ",
    "bab": "إِفْتِعَال",
    "shash": "ثلاثی مزید فیہ",
    "haft": "صحیح",
    "wazn": "تَفْتَعِلَ",
    "meaning": "تو الگ ہو جائے / کنارہ کشی اختیار کرے",
    "qism": "فعل",
    "talil": "حرفِ ناصبہ 'أَنْ' داخل ہونے کی وجہ سے لام کلمہ پر فتحہ آیا۔"
  },
  {
    "w": "أَبْشِرْ",
    "word": "أَبْشِرْ",
    "root": "ب - ش - ر",
    "seegha": "واحد مذکر حاضر (فعل امر)",
    "bahas": "فعل امر حاضر معروف",
    "bab": "إِفْعَال",
    "shash": "ثلاثی مزید فیہ",
    "haft": "صحیح",
    "wazn": "أَفْعِلْ",
    "meaning": "خوش ہو جاؤ / خوشخبری قبول کرو",
    "qism": "فعل",
    "talil": "أَبْشَرَ يُبْشِرُ سے امر حاضر معروف، آخری حرف ساکن۔"
  },
  {
    "w": "اسْتَنَارَ",
    "word": "اسْتَنَارَ",
    "root": "ن - و - ر",
    "seegha": "واحد مذکر غائب",
    "bahas": "فعل ماضی معروف",
    "bab": "إِسْتِفْعَال",
    "shash": "ثلاثی مزید فیہ",
    "haft": "اجوف واوی",
    "wazn": "اِسْتَفْعَلَ",
    "meaning": "روشن و منور ہو جانا / چمک اٹھنا",
    "qism": "فعل",
    "talil": "اِسْتَنْوَرَ تھا، واو کی حرکت ماقبل کو دے کر واو کو الف سے بدلا: اِسْتَنَارَ۔"
  }
];

function wrapTokens(arabic: string): string {
  let res = arabic;
  for (const item of words) {
    const w = item.w;
    if (res.includes(`data-word="${w}"`)) continue;
    const escaped = w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(^|[\\s،؛.:؟!«»\"\'\\(\\)\\{\\}\\[\\]])(${escaped})([\\s،؛.:؟!«»\"\'\\(\\)\\{\\}\\[\\]]|$)`, 'g');
    res = res.replace(regex, `$1<span class="word-token" data-word="${w}">$2</span>$3`);
  }
  return res;
}

const processedSections = rawSections.map(s => {
  const pakArabic = toPakistanArabic(s.arabic);
  const wrapped = wrapTokens(pakArabic);
  return {
    label: s.label,
    arabic: wrapped,
    urdu: s.urdu
  };
});

const chapter7Obj = {
  title: "اِبْتِلَاءُ ابْنِ كَعْبٍ",
  urduTitle: "حضرت کعب بن مالک رضی اللہ عنہ کی آزمائش اور سچی توبہ",
  attribution: "حضرت کعب بن مالک رضی اللہ عنہ (صحیح بخاری و مسلم / ریاض الصالحین)",
  sections: processedSections,
  words: words
};

console.log('Processed', processedSections.length, 'sections.');

// Replace Chapter 7 in chaptersData.ts
const filePath = './src/data/chaptersData.ts';
let content = fs.readFileSync(filePath, 'utf8');

const ch7Start = content.indexOf('"title": "اِبْتِلَاءُ ابْنِ كَعْبٍ"');
if (ch7Start === -1) {
  console.error('Could not find ch7 in chaptersData.ts');
  process.exit(1);
}

const openBrace = content.lastIndexOf('{', ch7Start);
const ch8Start = content.indexOf('"title": "مقتل عمر بن الخطاب"');
const closeBraceBeforeCh8 = content.lastIndexOf('},', ch8Start);

const jsonReplacement = JSON.stringify(chapter7Obj, null, 2);
const newContent = content.slice(0, openBrace) + jsonReplacement + content.slice(closeBraceBeforeCh8 + 1);

fs.writeFileSync(filePath, newContent, 'utf8');
console.log('Successfully updated Chapter 7 in', filePath);

fs.writeFileSync('./src/data/chapter7Data.ts', `export const CHAPTER_7 = ${JSON.stringify(chapter7Obj, null, 2)};\n`, 'utf8');
console.log('Successfully saved /src/data/chapter7Data.ts');
