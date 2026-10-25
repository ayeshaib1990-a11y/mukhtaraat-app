import { USER_RAW_CH1 } from './user_raw_ch1';
import { CHAPTERS } from '../src/data/chaptersData';

// Function to strip all HTML tags
function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, '');
}

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

// Let's verify that stripHtml(tokenizedSectionsArabic[i]) === USER_RAW_CH1[i].arabic
console.log('=== VERIFYING STRIP HTML EQUALITY TO USER RAW ARABIC ===');
let allArabicMatch = true;
for (let i = 0; i < 18; i++) {
  const stripped = stripHtml(tokenizedSectionsArabic[i]);
  const expected = USER_RAW_CH1[i].arabic;
  if (stripped !== expected) {
    console.error(`Mismatch at section ${i + 1}!`);
    console.error('Stripped:', JSON.stringify(stripped));
    console.error('Expected:', JSON.stringify(expected));
    allArabicMatch = false;
  } else {
    console.log(`Sec ${i + 1}: Arabic 100% PERFECT MATCH!`);
  }
}

if (!allArabicMatch) {
  process.exit(1);
}

console.log('\nAll 18 Arabic sections match user raw text with 100% precision!');
