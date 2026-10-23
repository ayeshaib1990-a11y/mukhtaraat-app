import fs from 'fs';

// 1. Read parsed words
const wordsData: any[] = JSON.parse(fs.readFileSync('workspace/chapter4_parsed_words.json', 'utf8'));

// 2. Build 40 sections with tokenization and Indo-Pak orthography
const sections = [
  {
    label: "متن 1",
    arabic: "«الْخُطْبَةُ <span class=\"word-token\" data-word=\"الْمُعْجِزَةُ\">الْمُعْجِزَةُ</span>» عَنْ أَبِي سَعِيدٍ الْخُدْرِيِّ رَضِيَ اللّٰهُ عَنْهُ قَالَ:",
    urdu: "«معجزانہ و مسحور کن خطبہ» حضرت ابو سعید خدری رضی اللہ عنہ سے روایت ہے، وہ فرماتے ہیں کہ:"
  },
  {
    label: "متن 2",
    arabic: "<span class=\"word-token\" data-word=\"لَمَّا\">لَمَّا</span> <span class=\"word-token\" data-word=\"أَعْطٰى\">أَعْطٰى</span> رَسُولُ اللّٰهِ صَلَّى اللّٰهُ عَلَيْهِ وَسَلَّمَ مَا أَعْطٰى مِنْ تِلْكَ <span class=\"word-token\" data-word=\"الْعَطَايَا\">الْعَطَايَا</span> <span class=\"word-token\" data-word=\"الْكِبَارِ\">الْكِبَارِ</span> فِي قُرَيْشٍ وَفِي <span class=\"word-token\" data-word=\"قَبَائِلِ\">قَبَائِلِ</span> الْعَرَبِ،",
    urdu: "جب رسول اللہ ﷺ نے (غزوہ حنین کے مالِ غنیمت میں سے) قریش کے لوگوں اور عرب کے قبائل کو وہ بڑے بڑے تاریخی عطیات اور بخششیں عطا فرمائیں،"
  },
  {
    label: "متن 3",
    arabic: "وَ<span class=\"word-token\" data-word=\"لَمْ يَكُنْ\">لَمْ يَكُنْ</span> فِي الأَنْصَارِ مِنْهَا شَيْءٌ،",
    urdu: "اور انصار کو اس مالِ غنیمت میں سے کچھ بھی نہ ملا،"
  },
  {
    label: "متن 4",
    arabic: "<span class=\"word-token\" data-word=\"وَجَدَ\">وَجَدَ</span> هٰذَا الْحَيُّ مِنَ الأَنْصَارِ فِي <span class=\"word-token\" data-word=\"أَنْفُسِهِمْ\">أَنْفُسِهِمْ</span>،",
    urdu: "تو انصار کے اس قبیلے نے اپنے دلوں میں شدید رنجش اور ملال محسوس کیا،"
  },
  {
    label: "متن 5",
    arabic: "حَتّٰى <span class=\"word-token\" data-word=\"كَثُرَتْ\">كَثُرَتْ</span> فِيهِمُ <span class=\"word-token\" data-word=\"الْقَالَةُ\">الْقَالَةُ</span>،",
    urdu: "یہاں تک کہ ان کے اندر چہ مگوئیاں اور شکوے کثرت سے ہونے لگے،"
  },
  {
    label: "متن 6",
    arabic: "حَتّٰى <span class=\"word-token\" data-word=\"قَالَ\">قَالَ</span> <span class=\"word-token\" data-word=\"قَائِلُهُمْ\">قَائِلُهُمْ</span>: «<span class=\"word-token\" data-word=\"لَقِيَ\">لَقِيَ</span> وَاللّٰهِ رَسُولُ اللّٰهِ صَلَّى اللّٰهُ عَلَيْهِ وَسَلَّمَ قَوْمَهُ!»",
    urdu: "یہاں تک کہ ان میں سے کہنے والے نے کہہ دیا: «بخدا! رسول اللہ ﷺ (ہمیں چھوڑ کر) اپنی قوم سے جا ملے ہیں!»"
  },
  {
    label: "متن 7",
    arabic: "فَ<span class=\"word-token\" data-word=\"دَخَلَ\">دَخَلَ</span> عَلَيْهِ سَعْدُ بْنُ عُبَادَةَ رَضِيَ اللّٰهُ عَنْهُ،",
    urdu: "چنانچہ حضرت سعد بن عبادہ رضی اللہ عنہ آپ ﷺ کی خدمت میں حاضر ہوئے،"
  },
  {
    label: "متن 8",
    arabic: "فَقَالَ: «يَا رَسُولَ اللّٰهِ! إِنَّ هٰذَا الْحَيَّ قَدْ <span class=\"word-token\" data-word=\"وَجَدُوا\">وَجَدُوا</span> عَلَيْكَ فِي أَنْفُسِهِمْ لِمَا <span class=\"word-token\" data-word=\"صَنَعْتَ\">صَنَعْتَ</span> فِي هٰذَا <span class=\"word-token\" data-word=\"الْفَيْءِ\">الْفَيْءِ</span> الَّذِي <span class=\"word-token\" data-word=\"أَصَبْتَ\">أَصَبْتَ</span>،",
    urdu: "اور عرض کیا: «اے اللہ کے رسول! انصار کا یہ قبیلہ اپنے دلوں میں آپ کے اس فیصلے پر رنجیدہ ہے جو آپ نے اس مالِ غنیمت کے بارے میں فرمایا جو آپ کو حاصل ہوا تھا،"
  },
  {
    label: "متن 9",
    arabic: "<span class=\"word-token\" data-word=\"قَسَّمْتَ\">قَسَّمْتَ</span> فِي قَوْمِكَ، وَ<span class=\"word-token\" data-word=\"أَعْطَيْتَ\">أَعْطَيْتَ</span> <span class=\"word-token\" data-word=\"عَطَايَا\">عَطَايَا</span> <span class=\"word-token\" data-word=\"عِظَامًا\">عِظَامًا</span> فِي قَبَائِلِ الْعَرَبِ، وَلَمْ يَكُنْ فِي هٰذَا الْحَيِّ مِنَ الأَنْصَارِ شَيْءٌ!»",
    urdu: "کہ آپ نے وہ سارا مال اپنی قوم (قریش) میں بانٹ دیا، اور عرب کے دیگر قبائل کو بھی بھاری عطیات دے ڈالے، مگر انصار کے اس قبیلے کے حصے میں کچھ بھی نہ آیا!»"
  },
  {
    label: "متن 10",
    arabic: "قَالَ: «فَأَيْنَ أَنْتَ مِنْ ذٰلِكَ يَا سَعْدُ؟»",
    urdu: "رسول اللہ ﷺ نے دریافت فرمایا: «اے سعد! اس معاملے میں تمہارا اپنا کیا موقف ہے؟»"
  },
  {
    label: "متن 11",
    arabic: "قَالَ: «يَا رَسُولَ اللّٰهِ! مَا أَنَا إِلَّا امْرُؤٌ مِنْ قَوْمِي»،",
    urdu: "انہوں نے عرض کیا: «یا رسول اللہ! میں بھی تو اپنی ہی قوم کا ایک فرد ہوں (جو ان کے دل میں ہے وہی میرے دل میں بھی ہے)»،"
  },
  {
    label: "متن 12",
    arabic: "قَالَ: «<span class=\"word-token\" data-word=\"فَاجْمَعْ\">فَاجْمَعْ</span> لِي قَوْمَكَ فِي هٰذِهِ <span class=\"word-token\" data-word=\"الْحَظِيرَةِ\">الْحَظِيرَةِ</span>!»",
    urdu: "آپ ﷺ نے فرمایا: «تو پھر جاؤ اور اپنی قوم (انصار) کو میرے لیے اس احاطے (باڑے) میں اکٹھا کرو!»"
  },
  {
    label: "متن 13",
    arabic: "قَالَ: <span class=\"word-token\" data-word=\"فَجَاءَ\">فَجَاءَ</span> <span class=\"word-token\" data-word=\"رِجَالٌ\">رِجَالٌ</span> مِنَ <span class=\"word-token\" data-word=\"الْمُهَاجِرِينَ\">الْمُهَاجِرِينَ</span> <span class=\"word-token\" data-word=\"فَتَرَكَهُمْ\">فَتَرَكَهُمْ</span> <span class=\"word-token\" data-word=\"فَدَخَلُوا\">فَدَخَلُوا</span>،",
    urdu: "راوی کہتے ہیں: مہاجرین میں سے بھی کچھ لوگ آئے تو حضرت سعدؓ نے انہیں اندر جانے کی اجازت دے دی اور وہ داخل ہو گئے،"
  },
  {
    label: "متن 14",
    arabic: "وَجَاءَ <span class=\"word-token\" data-word=\"آخَرُونَ\">آخَرُونَ</span> <span class=\"word-token\" data-word=\"فَرَدَّهُمْ\">فَرَدَّهُمْ</span>،",
    urdu: "پھر کچھ اور لوگ آئے تو انہیں حضرت سعدؓ نے روک دیا (کیونکہ مجلس خاص انصار کے لیے تھی)،"
  },
  {
    label: "متن 15",
    arabic: "فَلَمَّا <span class=\"word-token\" data-word=\"اجْتَمَعُوا\">اجْتَمَعُوا</span> <span class=\"word-token\" data-word=\"أَتٰى\">أَتٰى</span> سَعْدٌ فَقَالَ: «قَدِ <span class=\"word-token\" data-word=\"اجْتَمَعَ\">اجْتَمَعَ</span> لَكَ هٰذَا الْحَيُّ مِنَ الأَنْصَارِ»،",
    urdu: "جب سارے انصار جمع ہو گئے تو حضرت سعدؓ نے حاضر ہو کر عرض کیا: «یا رسول اللہ! انصار کا یہ قبیلہ آپ کے حسبِ ارشاد اکٹھا ہو چکا ہے»،"
  },
  {
    label: "متن 16",
    arabic: "فَأَتَاهُمْ رَسُولُ اللّٰهِ صَلَّى اللّٰهُ عَلَيْهِ وَسَلَّمَ، <span class=\"word-token\" data-word=\"فَحَمِدَ\">فَحَمِدَ</span> اللّٰهَ وَ<span class=\"word-token\" data-word=\"أَثْنٰى\">أَثْنٰى</span> عَلَيْهِ بِالَّذِي هُوَ لَهُ أَهْلٌ،",
    urdu: "پس رسول اللہ ﷺ ان کے پاس تشریف لائے، اللہ تعالیٰ کی حمد بیان فرمائی اور ایسی شایانِ شان ثنا کی جس کا وہ لائق ہے،"
  },
  {
    label: "متن 17",
    arabic: "ثُمَّ قَالَ: «يَا مَعْشَرَ الأَنْصَارِ! مَا <span class=\"word-token\" data-word=\"قَالَةٌ\">قَالَةٌ</span> <span class=\"word-token\" data-word=\"بَلَغَتْنِي\">بَلَغَتْنِي</span> عَنْكُمْ، وَوَجِدَةٌ <span class=\"word-token\" data-word=\"وَجَدْتُمُوهَا\">وَجَدْتُمُوهَا</span> فِي أَنْفُسِكُمْ؟",
    urdu: "پھر آپ ﷺ نے خطاب فرمایا: «اے گروہِ انصار! یہ کیسی بات ہے جو تمہاری طرف سے مجھ تک پہنچی ہے؟ اور یہ کیسا ملال اور رنج ہے جو تم نے اپنے دلوں میں محسوس کیا ہے؟"
  },
  {
    label: "متن 18",
    arabic: "<span class=\"word-token\" data-word=\"أَلَمْ آتِكُمْ\">أَلَمْ آتِكُمْ</span> <span class=\"word-token\" data-word=\"ضُلَّالًا\">ضُلَّالًا</span> <span class=\"word-token\" data-word=\"فَهَدَاكُمُ\">فَهَدَاكُمُ</span> اللّٰهُ بِي؟",
    urdu: "کیا میں تمہارے پاس اس حال میں نہیں آیا تھا کہ تم گمراہ تھے تو اللہ نے میرے ذریعے تمہیں ہدایت عطا فرمائی؟"
  },
  {
    label: "متن 19",
    arabic: "وَ<span class=\"word-token\" data-word=\"عَالَةً\">عَالَةً</span> <span class=\"word-token\" data-word=\"فَأَغْنَاكُمُ\">فَأَغْنَاكُمُ</span> اللّٰهُ بِي؟",
    urdu: "اور تم نادار و مفلس تھے تو اللہ نے میرے سبب تمہیں غنی و بے نیاز کر دیا؟"
  },
  {
    label: "متن 20",
    arabic: "وَ<span class=\"word-token\" data-word=\"أَعْدَاءً\">أَعْدَاءً</span> <span class=\"word-token\" data-word=\"فَأَلَّفَ\">فَأَلَّفَ</span> اللّٰهُ بَيْنَ قُلُوبِكُمْ؟»",
    urdu: "اور تم باہم خون کے پیاسے دشمن تھے تو اللہ نے میرے وسیلے سے تمہارے دلوں میں الفت پیدا فرما دی؟»"
  },
  {
    label: "متن 21",
    arabic: "<span class=\"word-token\" data-word=\"قَالُوا\">قَالُوا</span>: «اللّٰهُ وَرَسُولُهُ <span class=\"word-token\" data-word=\"أَمَنُّ\">أَمَنُّ</span> وَ<span class=\"word-token\" data-word=\"أَفْضَلُ\">أَفْضَلُ</span>!»",
    urdu: "انصار نے نہایت ادب سے عرض کیا: «یقیناً اللہ اور اس کے رسول ہی کا احسان اور فضل سب سے بڑھ کر ہے!»"
  },
  {
    label: "متن 22",
    arabic: "قَالَ: «<span class=\"word-token\" data-word=\"أَلَا تُجِيبُونَنِي\">أَلَا تُجِيبُونَنِي</span> يَا مَعْشَرَ الأَنْصَارِ؟»",
    urdu: "آپ ﷺ نے فرمایا: «اے گروہِ انصار! تم مجھے کھل کر جواب کیوں نہیں دیتے؟»"
  },
  {
    label: "متن 23",
    arabic: "قَالُوا: «وَبِمَاذَا <span class=\"word-token\" data-word=\"نُجِيبُكَ\">نُجِيبُكَ</span> يَا رَسُولَ اللّٰهِ؟ وَلِلّٰهِ وَلِرَسُولِهِ الْمَنُّ وَالْفَضْلُ!»",
    urdu: "انہوں نے رو کر عرض کیا: «یا رسول اللہ! ہم آپ کو کیا جواب دیں؟ جبکہ تمام احسان اور فضل صرف اللہ اور اس کے رسول ہی کا ہے!»"
  },
  {
    label: "متن 24",
    arabic: "قَالَ: «أَمَا وَاللّٰهِ لَوْ <span class=\"word-token\" data-word=\"شِئْتُمْ\">شِئْتُمْ</span> <span class=\"word-token\" data-word=\"لَقُلْتُمْ\">لَقُلْتُمْ</span> <span class=\"word-token\" data-word=\"فَلَصَدَقْتُمْ\">فَلَصَدَقْتُمْ</span> وَ<span class=\"word-token\" data-word=\"لَصُدِّقْتُمْ\">لَصُدِّقْتُمْ</span>:",
    urdu: "آپ ﷺ نے فرمایا: «سنو! بخدا، اگر تم چاہتے تو جواب میں یہ کہہ سکتے تھے، اور تم اپنی بات میں سچے ہوتے اور تمہاری تصدیق کی جاتی کہ:"
  },
  {
    label: "متن 25",
    arabic: "<span class=\"word-token\" data-word=\"أَتَيْتَنَا\">أَتَيْتَنَا</span> <span class=\"word-token\" data-word=\"مُكَذَّبًا\">مُكَذَّبًا</span> <span class=\"word-token\" data-word=\"فَصَدَّقْنَاكَ\">فَصَدَّقْنَاكَ</span>،",
    urdu: "آپ ہمارے پاس اس حال میں تشریف لائے تھے کہ آپ کی قوم نے آپ کو جھٹلا دیا تھا تو ہم نے آپ کی تصدیق کی،"
  },
  {
    label: "متن 26",
    arabic: "وَ<span class=\"word-token\" data-word=\"مَخْذُولًا\">مَخْذُولًا</span> <span class=\"word-token\" data-word=\"فَنَصَرْنَاكَ\">فَنَصَرْنَاكَ</span>،",
    urdu: "اور سب نے آپ کا ساتھ چھوڑ دیا تھا تو ہم نے آپ کی نصرت و مدد کی،"
  },
  {
    label: "متن 27",
    arabic: "وَ<span class=\"word-token\" data-word=\"طَرِيدًا\">طَرِيدًا</span> <span class=\"word-token\" data-word=\"فَآوَيْنَاكَ\">فَآوَيْنَاكَ</span>،",
    urdu: "اور آپ کو وطن سے نکال دیا گیا تھا تو ہم نے آپ کو اپنے گھروں میں پناہ دی،"
  },
  {
    label: "متن 28",
    arabic: "وَ<span class=\"word-token\" data-word=\"عَائِلًا\">عَائِلًا</span> <span class=\"word-token\" data-word=\"فَوَاسَيْنَاكَ\">فَوَاسَيْنَاكَ</span>!»",
    urdu: "اور آپ خالی ہاتھ تھے تو ہم نے اپنے جان و مال سے آپ کی غمخواری کی!»"
  },
  {
    label: "متن 29",
    arabic: "«<span class=\"word-token\" data-word=\"أَوَجَدْتُمْ\">أَوَجَدْتُمْ</span> فِي أَنْفُسِكُمْ يَا مَعْشَرَ الأَنْصَارِ فِي <span class=\"word-token\" data-word=\"لُعَاعَةٍ\">لُعَاعَةٍ</span> مِنَ الدُّنْيَا،",
    urdu: "«اے گروہِ انصار! کیا تم نے دنیا کے ایک حقیر و ناپائیدار گھاس کے تنکے کی خاطر اپنے دلوں میں ملال پیدا کر لیا،"
  },
  {
    label: "متن 30",
    arabic: "<span class=\"word-token\" data-word=\"تَأَلَّفْتُ\">تَأَلَّفْتُ</span> بِهَا قَوْمًا <span class=\"word-token\" data-word=\"لِيُسْلِمُوا\">لِيُسْلِمُوا</span>، وَ<span class=\"word-token\" data-word=\"وَكَّلْتُكُمْ\">وَكَّلْتُكُمْ</span> إِلٰى إِسْلَامِكُمْ?!",
    urdu: "جس کے ذریعے میں نے ایک قوم کی دلجوئی کی تاکہ وہ اسلام پر پختہ ہو جائیں، جبکہ تمہیں تمہارے سچے اور مضبوط اسلام کے بھروسے پر سونپ دیا تھا؟!»"
  },
  {
    label: "متن 31",
    arabic: "«أَلَا <span class=\"word-token\" data-word=\"تَرْضَوْنَ\">تَرْضَوْنَ</span> يَا مَعْشَرَ الأَنْصَارِ أَنْ <span class=\"word-token\" data-word=\"يَذْهَبَ\">يَذْهَبَ</span> النَّاسُ <span class=\"word-token\" data-word=\"بِالشَّاةِ\">بِالشَّاةِ</span> وَالْبَعِيرِ،",
    urdu: "«اے گروہِ انصار! کیا تم اس بات پر راضی اور خوش نہیں ہو کہ دوسرے لوگ اپنے گھروں کو بھیڑ بکریاں اور اونٹ لے کر جائیں،"
  },
  {
    label: "متن 32",
    arabic: "وَ<span class=\"word-token\" data-word=\"تَرْجِعُونَ\">تَرْجِعُونَ</span> بِرَسُولِ اللّٰهِ إِلٰى <span class=\"word-token\" data-word=\"رِحَالِكُمْ\">رِحَالِكُمْ</span>?!",
    urdu: "اور تم خود رسول اللہ ﷺ کو اپنے ساتھ لے کر اپنے گھروں کو واپس لوٹو?!»"
  },
  {
    label: "متن 33",
    arabic: "«فَوَالَّذِي نَفْسُ مُحَمَّدٍ بِيَدِهِ! لَمَا <span class=\"word-token\" data-word=\"تَنْقَلِبُونَ\">تَنْقَلِبُونَ</span> بِهِ <span class=\"word-token\" data-word=\"خَيْرٌ\">خَيْرٌ</span> مِمَّا يَنْقَلِبُونَ بِهِ!",
    urdu: "«اس ذاتِ پاک کی قسم جس کے دستِ قدرت میں محمد کی جان ہے! جس رسول کو تم اپنے گھروں کو لے جا رہے ہو وہ ان تمام جانوروں اور دولتوں سے کروڑوں درجے افضل و برتر ہے جو وہ لے کر جا رہے ہیں!"
  },
  {
    label: "متن 34",
    arabic: "وَلَوْلَا <span class=\"word-token\" data-word=\"الْهِجْرَةُ\">الْهِجْرَةُ</span> <span class=\"word-token\" data-word=\"لَكُنْتُ\">لَكُنْتُ</span> امْرَأً مِنَ الأَنْصَارِ!",
    urdu: "اگر ہجرت کا شرف اور فرضیت نہ ہوتی، تو میں بھی انصار ہی کا ایک فرد بننا پسند کرتا!"
  },
  {
    label: "متن 35",
    arabic: "وَلَوْ <span class=\"word-token\" data-word=\"سَلَكَ\">سَلَكَ</span> النَّاسُ <span class=\"word-token\" data-word=\"شِعْبًا\">شِعْبًا</span> وَوَادِيًا، وَ<span class=\"word-token\" data-word=\"سَلَكَتِ\">سَلَكَتِ</span> الأَنْصَارُ شِعْبًا وَوَادِيًا،",
    urdu: "اور اگر تمام لوگ ایک وادی یا پہاڑی راستے پر چلیں، اور انصار کسی دوسری وادی یا گھاٹی کا راستہ اختیار کریں،"
  },
  {
    label: "متن 36",
    arabic: "<span class=\"word-token\" data-word=\"لَسَلَكْتُ\">لَسَلَكْتُ</span> شِعْبَ الأَنْصَارِ وَوَادِيَهَا!",
    urdu: "تو میں یقیناً تمام لوگوں کو چھوڑ کر انصار کی وادی اور گھاٹی کا راستہ اختیار کروں گا!"
  },
  {
    label: "متن 37",
    arabic: "الأَنْصَارُ <span class=\"word-token\" data-word=\"شِعَارٌ\">شِعَارٌ</span> وَالنَّاسُ <span class=\"word-token\" data-word=\"دِثَارٌ\">دِثَارٌ</span>!",
    urdu: "انصار میرے جسم سے چمٹا ہوا اندرونی لباس ہیں، اور باقی تمام لوگ اوپر کی اوڑھی ہوئی چادر کی مانند ہیں!"
  },
  {
    label: "متن 38",
    arabic: "اَللّٰهُمَّ <span class=\"word-token\" data-word=\"ارْحَمِ\">ارْحَمِ</span> الأَنْصَارَ، وَأَبْنَاءَ الأَنْصَارِ، وَأَبْنَاءَ أَبْنَاءِ الأَنْصَارِ!»",
    urdu: "اے اللہ! انصار پر رحم فرما، اور انصار کے بیٹوں پر رحم فرما، اور انصار کے پوتوں پر بھی خصوصی رحمتیں نازل فرما!»"
  },
  {
    label: "متن 39",
    arabic: "قَالَ: <span class=\"word-token\" data-word=\"فَبَكٰى\">فَبَكٰى</span> الْقَوْمُ حَتّٰى <span class=\"word-token\" data-word=\"أَخْضَلُوا\">أَخْضَلُوا</span> لُحَاهُمْ،",
    urdu: "راوی کہتے ہیں: خطبہ سن کر انصار اس شدت سے روئے کہ آنسوؤں سے ان کی داڑھیاں تر بتر ہو گئیں،"
  },
  {
    label: "متن 40",
    arabic: "وَقَالُوا: «<span class=\"word-token\" data-word=\"رَضِينَا\">رَضِينَا</span> بِرَسُولِ اللّٰهِ قِسْمًا وَ<span class=\"word-token\" data-word=\"حَظًّا\">حَظًّا</span>!»",
    urdu: "اور وہ سب پکار اٹھے: «ہم اپنے حصے اور نصیب کے طور پر رسول اللہ ﷺ پر دل و جان سے راضی ہیں!»"
  }
];

// Clean words structure matching WordItem interface
const formattedWords = wordsData.map(w => ({
  w: w.w,
  root: w.root,
  qism: w.qism,
  bahas: w.bahas,
  seegha: w.seegha,
  bab: w.bab,
  shash: w.shash,
  haft: w.haft,
  wazn: w.wazn,
  taleel: w.taleel,
  tallel: w.tallel,
  meaning: w.meaning,
  singular: w.singular,
  plural: w.plural
}));

// Build Chapter 4 object
const ch4Obj = {
  title: "الْخُطْبَةُ الْمُعْجِزَةُ",
  urduTitle: "معجزانہ خطاب (غزوہ حنین کے موقع پر انصار سے خطاب)",
  attribution: "نبی کریم حضرت محمد مصطفیٰ ﷺ",
  ownTahqeeqOnly: true,
  sections: sections,
  words: formattedWords
};

console.log('Ch 4 Sections Count:', sections.length);
console.log('Ch 4 Words Count:', formattedWords.length);

// Verify token matching
const wordMap = new Map();
formattedWords.forEach(w => wordMap.set(w.w, w));

let tokenCount = 0;
let errors: any[] = [];
sections.forEach((s, idx) => {
  const matches = s.arabic.match(/data-word=\"([^\"]+)\"/g) || [];
  matches.forEach(m => {
    tokenCount++;
    const w = m.replace('data-word=\"', '').replace('\"', '');
    if (!wordMap.has(w)) {
      errors.push({ section: idx + 1, word: w });
    }
  });
});

console.log('Total tokens found in text:', tokenCount);
if (errors.length > 0) {
  console.error('Mismatched tokens:', errors);
  process.exit(1);
} else {
  console.log('SUCCESS: All tokens match word definitions perfectly!');
}

// Save replacement JSON
fs.writeFileSync('workspace/chapter4_replacement.json', JSON.stringify(ch4Obj, null, 2), 'utf8');
console.log('Saved workspace/chapter4_replacement.json');
