import fs from 'fs';
import { CHAPTERS } from '../src/data/chaptersData';
import { USER_RAW_CH1 } from './user_raw_ch1';

// Tokenized Arabic versions of the 18 sections
const tokenizedSectionsArabic: string[] = [
  // 1
  `<span class="word-token" data-word="تَبَارَكَ">تَبَارَكَ</span> الَّذِي <span class="word-token" data-word="جَعَلَ">جَعَلَ</span> فِي السَّمَآءِ  <span class="word-token" data-word="بُرُوجًا">بُرُوجًا</span> وَجَعَلَ فِيهَا <span class="word-token" data-word="سِرَاجًا">سِرَاجًا</span> وَقَمَرًا <span class="word-token" data-word="مُنِيرًا">مُنِيرًا</span> ۝`,

  // 2
  `وَهُوَ الَّذِي جَعَلَ اللَّيْلَ وَالنَّهَارَ <span class="word-token" data-word="خِلْفَةً">خِلْفَةً</span> لِمَنْ <span class="word-token" data-word="أَرَادَ">أَرَادَ</span> <span class="word-token" data-word="أَنْ يَذَّكَّرَ">أَنْ يَذَّكَّرَ</span> أَوْ أَرَادَ <span class="word-token" data-word="شُكُورًا">شُكُورًا</span> ۝`,

  // 3
  `وَ<span class="word-token" data-word="عِبَادُ">عِبَادُ</span> <span class="word-token" data-word="الرَّحْمٰنِ">الرَّحْمٰنِ</span> الَّذِينَ <span class="word-token" data-word="يَمْشُونَ">يَمْشُونَ</span> عَلَى الأَرْضِ <span class="word-token" data-word="هَوْنًا">هَوْنًا</span> وَإِذَا <span class="word-token" data-word="خَاطَبَهُمُ">خَاطَبَهُمُ</span> <span class="word-token" data-word="الْجَاهِلُونَ">الْجَاهِلُونَ</span> <span class="word-token" data-word="قَالُوا">قَالُوا</span> <span class="word-token" data-word="سَلَامًا">سَلَامًا</span> ۝`,

  // 4
  `وَالَّذِينَ <span class="word-token" data-word="يَبِيتُونَ">يَبِيتُونَ</span> لِرَبِّهِمْ <span class="word-token" data-word="سُجَّدًا">سُجَّدًا</span> وَ<span class="word-token" data-word="قِيَامًا">قِيَامًا</span> ۝`,

  // 5
  `وَالَّذِينَ <span class="word-token" data-word="يَقُولُونَ">يَقُولُونَ</span> رَبَّنَا <span class="word-token" data-word="اصْرِفْ">اصْرِفْ</span> عَنَّا <span class="word-token" data-word="عَذَابَ">عَذَابَ</span> جَهَنَّمَ إِنَّ عَذَابَهَا <span class="word-token" data-word="كَانَ">كَانَ</span> <span class="word-token" data-word="غَرَامًا">غَرَامًا</span> ۝`,

  // 6
  `إِنَّهَا <span class="word-token" data-word="سَاءَتْ">سَاءَتْ</span> <span class="word-token" data-word="مُسْتَقَرًّا">مُسْتَقَرًّا</span> وَ<span class="word-token" data-word="مُقَامًا">مُقَامًا</span> ۝`,

  // 7
  `وَالَّذِينَ إِذَا <span class="word-token" data-word="أَنْفَقُوا">أَنْفَقُوا</span> <span class="word-token" data-word="لَمْ يُسْرِفُوا">لَمْ يُسْرِفُوا</span> وَ<span class="word-token" data-word="لَمْ يَقْتُرُوا">لَمْ يَقْتُرُوا</span> وَكَانَ بَيْنَ ذٰلِكَ <span class="word-token" data-word="قَوَامًا">قَوَامًا</span> ۝`,

  // 8
  `وَالَّذِينَ <span class="word-token" data-word="لَا يَدْعُونَ">لَا يَدْعُونَ</span> مَعَ اللّٰهِ إِلٰهًا آخَرَ وَ<span class="word-token" data-word="لَا يَقْتُلُونَ">لَا يَقْتُلُونَ</span> النَّفْسَ الَّتِي <span class="word-token" data-word="حَرَّمَ">حَرَّمَ</span> اللّٰهُ إِلَّا بِالْحَقِّ وَ<span class="word-token" data-word="لَا يَزْنُونَ">لَا يَزْنُونَ</span> ۚ`,

  // 9
  `وَمَنْ <span class="word-token" data-word="يَفْعَلْ">يَفْعَلْ</span> ذٰلِكَ <span class="word-token" data-word="يَلْقَ">يَلْقَ</span> <span class="word-token" data-word="أَثَامًا">أَثَامًا</span> ۝`,

  // 10
  `<span class="word-token" data-word="يُضَاعَفْ">يُضَاعَفْ</span> لَهُ الْعَذَابُ يَوْمَ الْقِيَامَةِ وَ<span class="word-token" data-word="يَخْلُدْ">يَخْلُدْ</span> فِيهِ <span class="word-token" data-word="مُهَانًا">مُهَانًا</span> ۝`,

  // 11
  `إِلَّا مَنْ <span class="word-token" data-word="تَابَ">تَابَ</span> وَ<span class="word-token" data-word="آمَنَ">آمَنَ</span> وَ<span class="word-token" data-word="عَمِلَ">عَمِلَ</span> <span class="word-token" data-word="عَمَلًا">عَمَلًا</span> <span class="word-token" data-word="صَالِحًا">صَالِحًا</span> فَأُولٰئِكَ <span class="word-token" data-word="يُبَدِّلُ">يُبَدِّلُ</span> اللّٰهُ <span class="word-token" data-word="سَيِّئَاتِهِمْ">سَيِّئَاتِهِمْ</span> <span class="word-token" data-word="حَسَنَاتٍ">حَسَنَاتٍ</span> ۗ وَكَانَ اللّٰهُ <span class="word-token" data-word="غَفُورًا">غَفُورًا</span> <span class="word-token" data-word="رَحِيمًا">رَحِيمًا</span> ۝`,

  // 12
  `وَمَنْ تَابَ وَعَمِلَ صَالِحًا فَإِنَّهُ <span class="word-token" data-word="يَتُوبُ">يَتُوبُ</span> إِلَى اللّٰهِ <span class="word-token" data-word="مَتَابًا">مَتَابًا</span> ۝`,

  // 13
  `وَالَّذِينَ <span class="word-token" data-word="لَا يَشْهَدُونَ">لَا يَشْهَدُونَ</span> <span class="word-token" data-word="الزُّورَ">الزُّورَ</span> وَإِذَا <span class="word-token" data-word="مَرُّوا">مَرُّوا</span> بِاللَّغْوِ مَرُّوا <span class="word-token" data-word="كِرَامًا">كِرَامًا</span> ۝`,

  // 14
  `وَالَّذِينَ إِذَا <span class="word-token" data-word="ذُكِّرُوا">ذُكِّرُوا</span> بِآيَاتِ رَبِّهِمْ <span class="word-token" data-word="لَمْ يَخِرُّوا">لَمْ يَخِرُّوا</span> عَلَيْهَا <span class="word-token" data-word="صُمًّا">صُمًّا</span> وَ<span class="word-token" data-word="عُمْيَانًا">عُمْيَانًا</span> ۝`,

  // 15
  `وَالَّذِينَ يَقُولُونَ رَبَّنَا <span class="word-token" data-word="هَبْ">هَبْ</span> لَنَا مِنْ <span class="word-token" data-word="أَزْوَاجِنَا">أَزْوَاجِنَا</span> وَ <span class="word-token" data-word="ذُرِّيَّاتِنَا">ذُرِّيَّاتِنَا</span> <span class="word-token" data-word="قُرَّةَ">قُرَّةَ</span> <span class="word-token" data-word="أَعْيُنٍ">أَعْيُنٍ</span> وَ<span class="word-token" data-word="اجْعَلْنَا">اجْعَلْنَا</span> <span class="word-token" data-word="الْمُتَّقِينَ">لِلْمُتَّقِينَ</span> <span class="word-token" data-word="إِمَامًا">إِمَامًا</span> ۝`,

  // 16
  `أُولٰئِكَ <span class="word-token" data-word="يُجْزَوْنَ">يُجْزَوْنَ</span> <span class="word-token" data-word="الْغُرْفَةَ">الْغُرْفَةَ</span> بِمَا <span class="word-token" data-word="صَبَرُوا">صَبَرُوا</span> وَ<span class="word-token" data-word="يُلَقَّوْنَ">يُلَقَّوْنَ</span> فِيهَا <span class="word-token" data-word="تَحِيَّةً">تَحِيَّةً</span> وَسَلَامًا ۝`,

  // 17
  `<span class="word-token" data-word="خَالِدِينَ">خَالِدِينَ</span> فِيهَا ۚ <span class="word-token" data-word="حَسُنَتْ">حَسُنَتْ</span> مُسْتَقَرًّا وَمُقَامًا ۝`,

  // 18
  `<span class="word-token" data-word="قُلْ">قُلْ</span> <span class="word-token" data-word="مَا يَعْبَأُ">مَا يَعْبَأُ</span> بِكُمْ رَبِّي لَوْلَا <span class="word-token" data-word="دُعَاؤُكُمْ">دُعَاؤُكُمْ</span> ۖ فَقَدْ <span class="word-token" data-word="كَذَّبْتُمْ">كَذَّبْتُمْ</span> فَسَوْفَ <span class="word-token" data-word="يَكُونُ">يَكُونُ</span> <span class="word-token" data-word="لِزَامًا">لِزَامًا</span> ۝`
];

const labels = [
  'الآيَةُ 61 (آیت ۶۱)',
  'الآيَةُ 62 (آیت ۶۲)',
  'الآيَةُ 63 (آیت ۶۳)',
  'الآيَةُ 64 (آیت ۶۴)',
  'الآيَةُ 65 (آیت ۶۵)',
  'الآيَةُ 66 (آیت ۶۶)',
  'الآيَةُ 67 (آیت ۶۷)',
  'الآيَةُ 68 (آیت ۶۸ - حصہ اول)',
  'الآيَةُ 68 (آیت ۶۸ - حصہ دوم)',
  'الآيَةُ 69 (آیت ۶۹)',
  'الآيَةُ 70 (آیت ۷۰)',
  'الآيَةُ 71 (آیت ۷۱)',
  'الآيَةُ 72 (آیت ۷۲)',
  'الآيَةُ 73 (آیت ۷۳)',
  'الآيَةُ 74 (آیت ۷۴)',
  'الآيَةُ 75 (آیت ۷۵)',
  'الآيَةُ 76 (آیت ۷۶)',
  'الآيَةُ 77 (آیت ۷۷)'
];

const newSections = USER_RAW_CH1.map((raw, i) => ({
  label: labels[i],
  arabic: tokenizedSectionsArabic[i],
  urdu: raw.urdu
}));

const ch1Words = JSON.parse(JSON.stringify(CHAPTERS[0].words || []));
const replacements: Record<string, string> = {
  'أَنْ يَذَّكَّرَ': 'أَنْ يَذَّكَّرَ',
  'الرَّحْمٰنِ': 'الرَّحْمٰنِ',
  'خَاطَبَهُمْ': 'خَاطَبَهُمُ',
  'سُجَّدًا': 'سُجَّدًا',
  'کَانَ': 'كَانَ',
  'مُسْتَقَرًّا': 'مُسْتَقَرًّا',
  'حَرَّمَ': 'حَرَّمَ',
  'يَفْعَلْ (مَنْ يَفْعَلْ)': 'يَفْعَلْ',
  'يُبَدِّلُ': 'يُبَدِّلُ',
  'سَيِّئَاتِهِمْ - سَیِّئَاتِ': 'سَيِّئَاتِهِمْ',
  'الزُّورَ': 'الزُّورَ',
  'مَرُّوا': 'مَرُّوا',
  'ذُكِّرُوا': 'ذُكِّرُوا',
  'لَمْ يَخِرُّوا': 'لَمْ يَخِرُّوا',
  'صُمًّا': 'صُمًّا',
  'ذُرِّيَّاتِنَا': 'ذُرِّيَّاتِنَا',
  'قُرَّةَ': 'قُرَّةَ',
  'الْمُتَّقِينَ': 'الْمُتَّقِينَ',
  'يُلَقَّوْنَ': 'يُلَقَّوْنَ',
  'تَحِيَّةً': 'تَحِيَّةً',
  'مَا یَعْبَؤْا': 'مَا يَعْبَأُ',
  'دُعَآؤُكُمْ': 'دُعَاؤُكُمْ',
  'كَذَّبْتُمْ': 'كَذَّبْتُمْ',
  'یَکُوْنُ': 'يَكُونُ'
};

ch1Words.forEach((wordObj: any) => {
  if (replacements[wordObj.w]) {
    wordObj.w = replacements[wordObj.w];
  }
});

const newChapter1 = {
  title: 'عِبَادُ الرَّحْمٰنِ',
  urduTitle: 'رحمن کے برگزیده بندے (سورۃ الفرقان: آیات ۶۱ تا ۷۷)',
  ownTahqeeqOnly: true,
  sections: newSections,
  words: ch1Words
};

const fullFile = fs.readFileSync('src/data/chaptersData.ts', 'utf8');

// Find the start of CHAPTERS array and the start of Chapter 2
const ch1Start = fullFile.indexOf('export const CHAPTERS: Chapter[] = [\n  {\n    "title": "عِبَادُ الرَّحْمٰنِ"');
const ch2Start = fullFile.indexOf('    "title": "سَيِّدُنَا مُوسىٰ عَلَيْهِ السَّلَامُ"');

if (ch1Start === -1 || ch2Start === -1) {
  console.error('Could not find chapter 1 or chapter 2 boundaries!');
  process.exit(1);
}

// Find the opening brace of chapter 2
const ch2Brace = fullFile.lastIndexOf('  {', ch2Start);

const before = fullFile.substring(0, ch1Start + 'export const CHAPTERS: Chapter[] = [\n'.length);
const after = fullFile.substring(ch2Brace);

// Serialize newChapter1 with nice formatting
const newCh1String = '  ' + JSON.stringify(newChapter1, null, 2).replace(/\n/g, '\n  ') + ',\n';

const updatedContent = before + newCh1String + after;
fs.writeFileSync('src/data/chaptersData.ts', updatedContent, 'utf8');
console.log('Successfully updated Chapter 1 in src/data/chaptersData.ts!');
