import fs from 'fs';
import path from 'path';

// Load attachment
const attachmentPath = path.resolve(process.cwd(), 'public/assets/aistudio/Paste_October_25__2026_-_7_23PM_2738a2f2');
const attachmentContent = fs.readFileSync(attachmentPath, 'utf8');

// Parse 77 words
const lines = attachmentContent.split(/\r?\n/);
const wordsParsed: any[] = [];
let cur: any = null;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const m = line.match(/^(\d+)\.\s*کلمہ:\s*(.+)$/);
  if (m) {
    if (cur) wordsParsed.push(cur);
    cur = {
      num: parseInt(m[1], 10),
      rawWord: m[2].trim(),
      lines: []
    };
  } else if (cur) {
    cur.lines.push(line);
  }
}
if (cur) wordsParsed.push(cur);

const parsedWordsList = wordsParsed.map(w => {
  // Extract clean word title
  let wStr = w.rawWord;
  if (wStr.includes('(')) {
    wStr = wStr.split('(')[0].trim();
  }

  const obj: any = {
    w: wStr,
    root: '',
    qism: '',
    bahas: '',
    seegha: '',
    bab: '',
    shash: '',
    haft: '',
    wazn: '',
    meaning: ''
  };

  // Special handling for 36. عَزَّ وَجَلَّ
  if (w.num === 36) {
    obj.w = 'عَزَّ وَجَلَّ';
    obj.root = 'ع - ز - ز / ج - ل - ل';
    obj.qism = 'فعل';
    obj.bahas = 'فعل ماضی معلوم (جملۂ معترضہ برائے تعظیم)';
    obj.seegha = 'واحد مذکر غائب';
    obj.bab = 'باب ضَرَبَ (عَزَّ - يَعِزُّ) / باب ضَرَبَ (جَلَّ - يَجِلُّ)';
    obj.shash = 'ثلاثی مجرد';
    obj.haft = 'مضاعف ثلاثی';
    obj.wazn = 'فَعَّ وَفَعَّ (اصل: فَعَلَ وَفَعَلَ)';
    obj.taleel = 'عَزَزَ اور جَلَلَ: دو متحرک ہم جنس حروف جمع ہوئے، پہلے حرف کو ساکن کر کے دوسرے میں ادغام کر دیا گیا۔';
    obj.tallel = obj.taleel;
    obj.meaning = 'عَزَّ: وہ غالب اور زبردست ہوا۔ جَلَّ: وہ بزرگ اور عالی شان ہوا۔ دونوں مل کر اللہ تعالیٰ کی جلالت و عزت کی صفت بیان کرتے ہیں۔';
    return obj;
  }

  for (const l of w.lines) {
    const fm = l.match(/^([^:]+):\s*(.+)$/);
    if (fm) {
      const k = fm[1].trim();
      const v = fm[2].trim();
      if (k === 'مادہ') obj.root = v;
      else if (k === 'سہ اقسام') obj.qism = v;
      else if (k === 'بحث') obj.bahas = v;
      else if (k === 'صیغہ') obj.seegha = v;
      else if (k === 'باب') obj.bab = v;
      else if (k === 'شش اقسام') obj.shash = v;
      else if (k === 'ہفت اقسام') obj.haft = v;
      else if (k === 'وزن') obj.wazn = v;
      else if (k === 'تعلیل') {
        obj.taleel = v;
        obj.tallel = v;
      }
      else if (k === 'معنی و سیاق' || k === 'معنی') obj.meaning = v;
      else if (k === 'مفرد') obj.singular = v;
      else if (k === 'جمع') obj.plural = v;
    }
  }

  // Normalizations for app compatibility:
  if (obj.w === 'لَا يَأْتِيْ') obj.w = 'لَا يَأْتِي';

  return obj;
});

console.log(`Parsed ${parsedWordsList.length} words.`);

// 55 Sections with authentic Urdu and Arabic, tokens properly wrapped
const sections = [
  {
    label: "العبارة 1",
    arabic: "أَمَّا بَعْدُ! فَإِنَّ <span class=\"word-token\" data-word=\"أَصْدَقَ\">أَصْدَقَ</span> الْحَدِيثِ كِتَابُ اللّٰهِ،",
    urdu: "حمد و صلوٰۃ کے بعد! بلاشبہ تمام باتوں میں سب سے سچی بات اللہ تعالیٰ کی کتاب ہے،"
  },
  {
    label: "العبارة 2",
    arabic: "وَ<span class=\"word-token\" data-word=\"أَوْثَقَ\">أَوْثَقَ</span> الْعُرٰى كَلِمَةُ <span class=\"word-token\" data-word=\"التَّقْوٰى\">التَّقْوٰى</span>،",
    urdu: "اور تمام سہاروں میں سب سے زیادہ مضبوط سہارا تقویٰ کا کلمہ ہے،"
  },
  {
    label: "العبارة 3",
    arabic: "وَ<span class=\"word-token\" data-word=\"خَيْرَ\">خَيْرَ</span> <span class=\"word-token\" data-word=\"الْمِلَلِ\">الْمِلَلِ</span> مِلَّةُ إِبْرَاهِيمَ،",
    urdu: "اور تمام ادیان و مذاہب میں سب سے بہترین دین حضرت ابراہیم علیہ السلام کا دینِ حنیف ہے،"
  },
  {
    label: "العبارة 4",
    arabic: "وَخَيْرَ <span class=\"word-token\" data-word=\"السُّنَنِ\">السُّنَنِ</span> سُنَّةُ مُحَمَّدٍ صَلَّى اللّٰهُ عَلَيْهِ وَسَلَّمَ،",
    urdu: "اور تمام طریقوں میں سب سے بہترین طریقہ حضرت محمد ﷺ کا مبارک طریقہ اور سنت ہے،"
  },
  {
    label: "العبارة 5",
    arabic: "وَ<span class=\"word-token\" data-word=\"أَشْرَفَ\">أَشْرَفَ</span> الْحَدِيثِ ذِكْرُ اللّٰهِ،",
    urdu: "اور تمام کلاموں میں سب سے زیادہ باعزت اور بلند مرتبہ کلام اللہ تعالیٰ کا ذکر ہے،"
  },
  {
    label: "العبارة 6",
    arabic: "وَ<span class=\"word-token\" data-word=\"أَحْسَنَ\">أَحْسَنَ</span> <span class=\"word-token\" data-word=\"الْقِصَصِ\">الْقِصَصِ</span> هٰذَا الْقُرْآنُ،",
    urdu: "اور تمام قصوں اور داستانوں میں سب سے زیادہ خوبصورت و عبرت آموز قصے اس قرآن مجید کے ہیں،"
  },
  {
    label: "العبارة 7",
    arabic: "وَخَيْرَ <span class=\"word-token\" data-word=\"الأُمُورِ\">الأُمُورِ</span> عَوَازِمُهَا،",
    urdu: "اور تمام کاموں میں سب سے بہتر کام وہ ہیں جن کے پیچھے پختہ اور سچے ارادے ہوں،"
  },
  {
    label: "العبارة 8",
    arabic: "وَ<span class=\"word-token\" data-word=\"شَرَّ\">شَرَّ</span> الأُمُورِ <span class=\"word-token\" data-word=\"مُحْدَثَاتُ\">مُحْدَثَاتُهَا</span>،",
    urdu: "اور تمام کاموں میں سب سے بدترین کام دین کے اندر اپنی طرف سے نئی باتیں گھڑنا (بدعات) ہیں،"
  },
  {
    label: "العبارة 9",
    arabic: "وَأَحْسَنَ الْهَدْيِ <span class=\"word-token\" data-word=\"هَدْيُ\">هَدْيُ</span> <span class=\"word-token\" data-word=\"الأَنْبِيَاءِ\">الأَنْبِيَاءِ</span>،",
    urdu: "اور تمام سیرتوں اور رہنمائیوں میں سب سے بہترین طرزِ عمل انبیائے کرام علیہم السلام کا طرزِ عمل ہے،"
  },
  {
    label: "العبارة 10",
    arabic: "وَأَشْرَفَ الْمَوْتِ قَتْلُ <span class=\"word-token\" data-word=\"الشُّهَدَاءِ\">الشُّهَدَاءِ</span>،",
    urdu: "اور موت کی تمام اقسام میں سب سے باعزت اور افضل موت راہِ خدا میں شہیدوں کا قتل ہونا ہے،"
  },
  {
    label: "العبارة 11",
    arabic: "وَ<span class=\"word-token\" data-word=\"أَعْمٰى\">أَعْمٰى</span> <span class=\"word-token\" data-word=\"الْعَمٰى\">الْعَمٰى</span> <span class=\"word-token\" data-word=\"الضَّلَالَةُ\">الضَّلَالَةُ</span> بَعْدَ الْهُدٰى،",
    urdu: "اور تمام اندھے پن میں سب سے زیادہ اندھی گمراہی یہ ہے کہ انسان کو ہدایت ملنے کے بعد وہ پھر گمراہی کی دلدل میں جا گرے،"
  },
  {
    label: "العبارة 12",
    arabic: "وَخَيْرَ الْعِلْمِ مَا <span class=\"word-token\" data-word=\"نَفَعَ\">نَفَعَ</span>،",
    urdu: "اور تمام علوم میں سب سے بہترین علم وہ ہے جو عمل اور نجات میں نفع بخش ہو،"
  },
  {
    label: "العبارة 13",
    arabic: "وَخَيْرَ الْهَدْيِ مَا <span class=\"word-token\" data-word=\"اتُّبِعَ\">اتُّبِعَ</span>،",
    urdu: "اور سب سے بہترین طریقہ وہ ہے جس کی عملی طور پر پیروی کی جائے،"
  },
  {
    label: "العبارة 14",
    arabic: "وَشَرَّ الْعَمٰى عَمٰى الْقَلْبِ،",
    urdu: "اور تمام اندھے پن میں سب سے بدترین اندھا پن دل کی بصیرت کا مٹ جانا ہے،"
  },
  {
    label: "العبارة 15",
    arabic: "وَالْيَدُ <span class=\"word-token\" data-word=\"الْعُلْيَا\">الْعُلْيَا</span> خَيْرٌ مِنَ الْيَدِ <span class=\"word-token\" data-word=\"السُّفْلٰى\">السُّفْلٰى</span>،",
    urdu: "اور دینے والا اوپر کا ہاتھ، مانگنے والے نیچے کے ہاتھ سے کہیں زیادہ بہتر ہے،"
  },
  {
    label: "العبارة 16",
    arabic: "وَمَا <span class=\"word-token\" data-word=\"قَلَّ\">قَلَّ</span> وَ<span class=\"word-token\" data-word=\"كَفٰى\">كَفٰى</span> خَيْرٌ مِمَّا <span class=\"word-token\" data-word=\"كَثُرَ\">كَثُرَ</span> وَ<span class=\"word-token\" data-word=\"أَلْهٰى\">أَلْهٰى</span>،",
    urdu: "اور جو حلال مال تھوڑا ہو مگر کفایت کر جائے وہ اس کثیر مال سے بدرجہا بہتر ہے جو انسان کو اللہ سے غافل کر دے،"
  },
  {
    label: "العبارة 17",
    arabic: "وَشَرَّ الْمَعْذِرَةِ حِينَ <span class=\"word-token\" data-word=\"يَحْضُرُ\">يَحْضُرُ</span> الْمَوْتُ،",
    urdu: "اور تمام معذرتوں میں سب سے بدترین معذرت وہ ہے جو عین موت کے فرشتے کے سامنے آنے پر توبہ کے طور پر کی جائے،"
  },
  {
    label: "العبارة 18",
    arabic: "وَشَرَّ <span class=\"word-token\" data-word=\"النَّدَامَةِ\">النَّدَامَةِ</span> يَوْمُ الْقِيَامَةِ،",
    urdu: "اور تمام شرمندگیوں میں سب سے زیادہ ہولناک اور بدترین ندامت قیامت کے دن کی رسوائی ہے،"
  },
  {
    label: "العبارة 19",
    arabic: "وَمِنَ النَّاسِ مَنْ <span class=\"word-token\" data-word=\"لَا يَأْتِي\">لَا يَأْتِي</span> الصَّلَاةَ إِلَّا دُبُرًا،",
    urdu: "اور بعض لوگ ایسے بدنصیب ہیں جو نماز کے لیے مسجد نہیں آتے مگر آخری لمحات میں پیٹھ موڑ کر اور دیر کر کے،"
  },
  {
    label: "العبارة 20",
    arabic: "وَمِنْهُمْ مَنْ <span class=\"word-token\" data-word=\"لَا يَذْكُرُ\">لَا يَذْكُرُ</span> اللّٰهَ إِلَّا هَجْرًا،",
    urdu: "اور ان میں سے بعض وہ ہیں جو اللہ کا ذکر نہیں کرتے مگر بے دلی، غفلت اور محض دکھاوے کے ساتھ،"
  },
  {
    label: "العبارة 21",
    arabic: "وَ<span class=\"word-token\" data-word=\"أَعْظَمَ\">أَعْظَمَ</span> <span class=\"word-token\" data-word=\"الْخَطَايَا\">الْخَطَايَا</span> اللِّسَانُ <span class=\"word-token\" data-word=\"الْكَذُوبُ\">الْكَذُوبُ</span>،",
    urdu: "اور تمام گناہوں میں سب سے بڑا اور ہلاکت خیز گناہ دروغ گو اور جھوٹی زبان ہے،"
  },
  {
    label: "العبارة 22",
    arabic: "وَخَيْرَ <span class=\"word-token\" data-word=\"الْغِنٰى\">الْغِنٰى</span> غِنٰى النَّفْسِ،",
    urdu: "اور تمام دولتوں اور مالداریوں میں سب سے بہترین غنا دل اور نفس کی بے نیازی و قناعت ہے،"
  },
  {
    label: "العبارة 23",
    arabic: "وَخَيْرَ الزَّادِ التَّقْوٰى،",
    urdu: "اور آخرت کے تمام توشوں میں سب سے بہترین اور لازوال توشہ اللہ کا تقویٰ ہے،"
  },
  {
    label: "العبارة 24",
    arabic: "وَرَأْسَ الْحِكْمَةِ <span class=\"word-token\" data-word=\"مَخَافَةُ\">مَخَافَةُ</span> اللّٰهِ <span class=\"word-token\" data-word=\"عَزَّ وَجَلَّ\">عَزَّ وَجَلَّ</span>،",
    urdu: "اور تمام دانائی اور حکمت کی بنیاد اور جڑ اللہ عزوجل کا خوف اور خشیت ہے،"
  },
  {
    label: "العبارة 25",
    arabic: "وَخَيْرَ مَا <span class=\"word-token\" data-word=\"وُقِرَ\">وُقِرَ</span> فِي <span class=\"word-token\" data-word=\"الْقُلُوبِ\">الْقُلُوبِ</span> الْيَقِينُ،",
    urdu: "اور دلوں کے اندر جم جانے والی تمام چیزوں میں سب سے بہترین شے اللہ پر پختہ یقین ہے،"
  },
  {
    label: "العبارة 26",
    arabic: "وَ<span class=\"word-token\" data-word=\"الِارْتِيَابَ\">الِارْتِيَابَ</span> مِنَ الْكُفْرِ،",
    urdu: "اور دین اور حق کے اندر بلاوجہ شک و شبہ میں مبتلا ہونا کفر کی شاخوں میں سے ہے،"
  },
  {
    label: "العبارة 27",
    arabic: "وَ<span class=\"word-token\" data-word=\"النِّيَاحَةَ\">النِّيَاحَةَ</span> مِنْ عَمَلِ الْجَاهِلِيَّةِ،",
    urdu: "اور میت پر چیخ چیخ کر نوحہ اور بین کرنا دورِ جاہلیت کے بدترین اعمال میں سے ہے،"
  },
  {
    label: "العبارة 28",
    arabic: "وَ<span class=\"word-token\" data-word=\"الْغُلُولَ\">الْغُلُولَ</span> مِنْ <span class=\"word-token\" data-word=\"جُثٰى\">جُثٰى</span> جَهَنَّمَ،",
    urdu: "اور مالِ غنیمت یا سرکاری امانت میں خیانت کرنا جہنم کے دہکتے ہوئے انگاروں کے ڈھیر ہیں،"
  },
  {
    label: "العبارة 29",
    arabic: "وَالْكَنْزَ كَيٌّ مِنَ النَّارِ،",
    urdu: "اور زکوٰۃ ادا کیے بغیر مال و دولت کا خزانہ جوڑنا قیامت کے دن جہنم کی آگ سے داغنے کا سامان ہے،"
  },
  {
    label: "العبارة 30",
    arabic: "وَالشِّعْرَ مِنْ <span class=\"word-token\" data-word=\"مَزَامِيرِ\">مَزَامِيرِ</span> إِبْلِيسَ،",
    urdu: "اور وہ بیہودہ و شہوانی شاعری جو انسان کو بہکائے وہ شیطان کی بانسریوں اور سازوں میں سے ہے،"
  },
  {
    label: "العبارة 31",
    arabic: "وَالْخَمْرَ <span class=\"word-token\" data-word=\"جُمَّاعُ\">جُمَّاعُ</span> الإِثْمِ،",
    urdu: "اور نشہ آور شراب تمام تر گناہوں اور برائیوں کی جڑ اور مجموعہ ہے،"
  },
  {
    label: "العبارة 32",
    arabic: "وَالنِّسَاءَ حَبَائِلُ الشَّيْطَانِ،",
    urdu: "اور فتنہ پرور عورتیں انسان کے شکار کے لیے شیطان کے بچھائے ہوئے جال اور پھندے ہیں،"
  },
  {
    label: "العبارة 33",
    arabic: "وَ<span class=\"word-token\" data-word=\"الشَّبَابَ\">الشَّبَابَ</span> <span class=\"word-token\" data-word=\"شُعْبَةٌ\">شُعْبَةٌ</span> مِنَ الْجُنُونِ،",
    urdu: "اور نوجوانی اور جوانی کا نشہ دیوانگی اور جنون کا ایک شعبہ ہے،"
  },
  {
    label: "العبارة 34",
    arabic: "وَشَرَّ <span class=\"word-token\" data-word=\"الْمَكَاسِبِ\">الْمَكَاسِبِ</span> كَسْبُ الرِّبَا،",
    urdu: "اور تمام کمائیوں میں سب سے زیادہ ناپاک اور بدترین کمائی سود کی کمائی ہے،"
  },
  {
    label: "العبارة 35",
    arabic: "وَشَرَّ <span class=\"word-token\" data-word=\"الْمَأْكَلِ\">الْمَأْكَلِ</span> مَالُ الْيَتِيمِ،",
    urdu: "اور کھانے کی تمام چیزوں میں سب سے بدترین اور خبیث ترین کھانا یتیم کا مال ناجائز ہڑپ کرنا ہے،"
  },
  {
    label: "العبارة 36",
    arabic: "<span class=\"word-token\" data-word=\"وَالسَّعِيدَ\">وَالسَّعِيدَ</span> مَنْ <span class=\"word-token\" data-word=\"وُعِظَ\">وُعِظَ</span> بِغَيْرِهِ،",
    urdu: "اور حقیقی نیک بخت اور خوش نصیب انسان وہ ہے جو دوسروں کے انجام سے نصیحت و عبرت حاصل کرے،"
  },
  {
    label: "العبارة 37",
    arabic: "<span class=\"word-token\" data-word=\"وَالشَّقِيَّ\">وَالشَّقِيَّ</span> مَنْ <span class=\"word-token\" data-word=\"شَقِيَ\">شَقِيَ</span> فِي بَطْنِ أُمِّهِ،",
    urdu: "اور ازلی بدبخت وہ ہے جو اپنی ماں کے پیٹ ہی میں (علمِ الٰہی کے مطابق) بدبخت لکھا گیا تھا،"
  },
  {
    label: "العبارة 38",
    arabic: "وَإِنَّمَا <span class=\"word-token\" data-word=\"يَصِيرُ\">يَصِيرُ</span> أَحَدُكُمْ إِلٰى مَوْضِعِ أَرْبَعِ <span class=\"word-token\" data-word=\"أَذْرُعٍ\">أَذْرُعٍ</span>،",
    urdu: "اور بات بس اتنی ہے کہ تم میں سے ہر انسان کا آخری ٹھکانا قبر کی وہی چار ہاتھ کی تنگ جگہ ہوگی،"
  },
  {
    label: "العبارة 39",
    arabic: "وَالأَمْرَ بِآخِرَتِهِ، وَمِلَاكَ الْعَمَلِ خَوَاتِمُهُ،",
    urdu: "اور ہر معاملے کا اصل دارومدار اس کے انجام پر ہے، اور اعمال کا اصل سرمایہ اور فیصلہ خاتمے کے وقت پر ہے،"
  },
  {
    label: "العبارة 40",
    arabic: "وَشَرَّ <span class=\"word-token\" data-word=\"الرَّوَايَا\">الرَّوَايَا</span> رَوَايَا الْكَذِبِ،",
    urdu: "اور تمام راویوں اور باتوں میں سب سے بدترین روایات جھوٹ اور فریب پر مبنی باتیں ہیں،"
  },
  {
    label: "العبارة 41",
    arabic: "وَكُلَّ مَا هُوَ <span class=\"word-token\" data-word=\"آتٍ\">آتٍ</span> قَرِيبٌ،",
    urdu: "اور ہر آنے والی چیز (خواہ وہ موت ہو یا قیامت) بالکل قریب آ پہنچی ہے،"
  },
  {
    label: "العبارة 42",
    arabic: "وَ<span class=\"word-token\" data-word=\"سِبَابَ\">سِبَابَ</span> <span class=\"word-token\" data-word=\"الْمُؤْمِنِ\">الْمُؤْمِنِ</span> <span class=\"word-token\" data-word=\"فُسُوقٌ\">فُسُوقٌ</span>،",
    urdu: "اور کسی سچے مومن کو گالی دینا اور برا بھلا کہنا سخت گناہ اور فسق ہے،"
  },
  {
    label: "العبارة 43",
    arabic: "وَ<span class=\"word-token\" data-word=\"قِتَالَ\">قِتَالَ</span> الْمُؤْمِنِ كُفْرٌ،",
    urdu: "اور کسی مومن کو ناحق قتل کرنے کے لیے ہتھیار اٹھانا کفر جیسا سنگین جرم ہے،"
  },
  {
    label: "العبارة 44",
    arabic: "وَأَكْلَ لَحْمِهِ مِنْ <span class=\"word-token\" data-word=\"مَعْصِيَةِ\">مَعْصِيَةِ</span> اللّٰهِ،",
    urdu: "اور مومن کی غیبت کر کے اس کا گوشت کھانا اللہ تعالیٰ کی کھلی نافرمانی اور معصیت ہے،"
  },
  {
    label: "العبارة 45",
    arabic: "وَحُرْمَةَ مَالِهِ كَحُرْمَةِ دَمِهِ،",
    urdu: "اور مومن کے مال کی حرمت اسی طرح واجب اور محترم ہے جس طرح اس کی جان اور خون کی حرمت ہے،"
  },
  {
    label: "العبارة 46",
    arabic: "وَمَنْ <span class=\"word-token\" data-word=\"يَتَأَلَّ\">يَتَأَلَّ</span> عَلٰى اللّٰهِ <span class=\"word-token\" data-word=\"يُكْذِبْهُ\">يُكْذِبْهُ</span>،",
    urdu: "اور جو شخص اللہ کے اوپر حاکمانہ یا دعوے دارانہ قسم کھائے گا اللہ اس کے دعوے کو جھوٹا اور باطل ثابت کر دے گا،"
  },
  {
    label: "العبارة 47",
    arabic: "وَمَنْ <span class=\"word-token\" data-word=\"يَغْفِرْ\">يَغْفِرْ</span> يَغْفِرِ اللّٰهُ لَهُ،",
    urdu: "اور جو انسان دوسروں کی غلطیوں کو معاف کرے گا اللہ تعالیٰ اس کے گناہوں کی مغفرت فرما دے گا،"
  },
  {
    label: "العبارة 48",
    arabic: "وَمَنْ <span class=\"word-token\" data-word=\"يَعْفُ\">يَعْفُ</span> يَعْفُ اللّٰهُ عَنْهُ،",
    urdu: "اور جو لوگوں سے درگزر کرے گا اللہ تعالیٰ اس کے قصوروں سے درگزر فرمائے گا،"
  },
  {
    label: "العبارة 49",
    arabic: "وَمَنْ <span class=\"word-token\" data-word=\"يَكْظِمِ\">يَكْظِمِ</span> <span class=\"word-token\" data-word=\"الْغَيْظَ\">الْغَيْظَ</span> <span class=\"word-token\" data-word=\"يَأْجُرْ\">يَأْجُرْ</span>هُ اللّٰهُ،",
    urdu: "اور جو قدرت کے باوجود اپنے غصے کا گھونٹ پی جائے گا اللہ تعالیٰ اسے بے پایاں اجر سے نوازے گا،"
  },
  {
    label: "العبارة 50",
    arabic: "وَمَنْ <span class=\"word-token\" data-word=\"يَصْبِرْ\">يَصْبِرْ</span> عَلٰى الرَّزِيَّةِ <span class=\"word-token\" data-word=\"يُعَوِّضْهُ\">يُعَوِّضْهُ</span> اللّٰهُ،",
    urdu: "اور جو شخص کسی صدمے اور ناگہانی مصیبت پر صبر کا دامن تھامے رکھے گا اللہ تعالیٰ اسے اس کا بہترین نعم البدل عطا فرمائے گا،"
  },
  {
    label: "العبارة 51",
    arabic: "وَمَنْ <span class=\"word-token\" data-word=\"يَتَّبِعْ\">يَتَّبِعِ</span> السُّمْعَةَ <span class=\"word-token\" data-word=\"يُسَمِّعْ\">يُسَمِّعِ</span> اللّٰهُ بِهِ،",
    urdu: "اور جو شخص نیک اعمال کے ذریعے دنیا میں اپنی شہرت اور نام و نمود کا متلاشی ہوگا اللہ قیامت کے دن سب کے سامنے اس کا کچا چٹھا کھول کر رسوا کر دے گا،"
  },
  {
    label: "العبارة 52",
    arabic: "وَمَنْ يَصْبِرْ <span class=\"word-token\" data-word=\"يُضَعِّفْ\">يُضَعِّفِ</span> اللّٰهُ لَهُ،",
    urdu: "اور جو انسان دین اور حق پر ثابت قدمی کے ساتھ صبر کرے گا اللہ تعالیٰ اس کے ثواب کو کئی گنا بڑھا دے گا،"
  },
  {
    label: "العبارة 53",
    arabic: "وَمَنْ <span class=\"word-token\" data-word=\"يَعْصِ\">يَعْصِ</span> اللّٰهَ <span class=\"word-token\" data-word=\"يُعَذِّبْهُ\">يُعَذِّبْهُ</span> اللّٰهُ،",
    urdu: "اور جو شخص اللہ تعالیٰ کی نافرمانی اور سرکشی پر اڑا رہے گا اللہ اسے سخت عذاب میں مبتلا فرمائے گا،"
  },
  {
    label: "العبارة 54",
    arabic: "اللّٰهُمَّ <span class=\"word-token\" data-word=\"اغْفِرْ\">اغْفِرْ</span> لِي وَلِأُمَّتِي! اللّٰهُمَّ اغْفِرْ لِي وَلِأُمَّتِي!",
    urdu: "اے اللہ! میری بھی مغفرت فرما اور میری امت کی بھی بخشش فرما! اے اللہ! میری بھی مغفرت فرما اور میری امت کی بھی بخشش فرما!"
  },
  {
    label: "العبارة 55",
    arabic: "<span class=\"word-token\" data-word=\"أَسْتَغْفِرُ\">أَسْتَغْفِرُ</span> اللّٰهَ لِي وَلَكُمْ!",
    urdu: "میں اللہ تبارک و تعالیٰ سے اپنے لیے بھی اور تم سب کے لیے بھی مغفرت اور بخشش کا طلب گار ہوں!"
  }
];

// Check token matching
const tokens: string[] = [];
sections.forEach(s => {
  const matches = s.arabic.match(/data-word="([^"]+)"/g) || [];
  matches.forEach(m => {
    tokens.push(m.replace('data-word="', '').replace('"', ''));
  });
});

console.log(`Total tokens in sections: ${tokens.length}`);
console.log(`Total words in words array: ${parsedWordsList.length}`);

const wordSet = new Set(parsedWordsList.map(w => w.w));
const missingInWords = tokens.filter(t => !wordSet.has(t));
console.log("Tokens missing in words:", missingInWords);

const tokenSet = new Set(tokens);
const missingInTokens = parsedWordsList.map(w => w.w).filter(w => !tokenSet.has(w));
console.log("Words missing in tokens:", missingInTokens);

// Read chaptersData.ts and update Chapter 3 (index 2)
const chaptersDataPath = path.resolve(process.cwd(), 'src/data/chaptersData.ts');
let chaptersContent = fs.readFileSync(chaptersDataPath, 'utf8');

// We need to replace CHAPTERS[2]
import { CHAPTERS } from '../src/data/chaptersData.ts';
CHAPTERS[2].sections = sections;
CHAPTERS[2].words = parsedWordsList;

const updatedFullContent = `import { Chapter } from '../types';\n\nexport const CHAPTERS: Chapter[] = ${JSON.stringify(CHAPTERS, null, 2)};\n`;

fs.writeFileSync(chaptersDataPath, updatedFullContent, 'utf8');
console.log("Successfully updated Chapter 3 in src/data/chaptersData.ts!");
