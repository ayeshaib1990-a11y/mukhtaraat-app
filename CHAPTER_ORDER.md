# Mukhtaraat App — Canonical Chapter Order (33 chapters)

Source: provided by the user. This is the authoritative chapter order for the app.
When adding a chapter, insert it at the position given here — do not append or guess.

| Bab | Chapter | Attribution |
|-----|---------|-------------|
| 1 | عباد الرحمن | القرآن الكريم |
| 2 | سيدنا موسى عليه السلام | القرآن الكريم |
| 3 | جوامع الكلم | سيدنا ومولانا محمد صلى الله عليه وسلم |
| 4 | الخطبة المعجزة | سيدنا ومولانا محمد صلى الله عليه وسلم |
| 5 | في بني سعد | سيرة ابن هشام |
| 6 | كيف هاجر النبي صلى الله عليه وسلم | أم المؤمنين عائشة رضي الله عنها |
| 7 | ابتلاء ابن كعب | كعب بن مالك رضي الله عنه |
| 8 | مقتل عمر بن الخطاب | عمرو بن ميمون رضي الله عنه |
| 9 | أخلاق المؤمن | الحسن البصري رحمه الله |
| 10 | إخوان الصفا | ابن المقفع رحمه الله |
| 11 | وصف الزاهد | ابن السماك رحمه الله |
| 12 | بين السيدة زبيدة والمأمون | السيدة زبيدة والمأمون |
| 13 | بين قاض وقور وذباب جسور | أبو عثمان عمرو بن بحر الجاحظ رحمه الله |
| 14 | القميص الأحمر | ابن عبد ربه رحمه الله |
| 15 | كيف كان معاوية رضي الله عنه يقضي يومه | المسعودي رحمه الله |
| 16 | استقامة الإمام أحمد بن حنبل رحمه الله | ابن حبان البستي رحمه الله |
| 17 | أشعب والبغيل | أبو الفرج الأصفهاني رحمه الله |
| 18 | رسالة عتاب | أبو بكر الخوارزمي رحمه الله |
| 19 | حديث الناس | أبو حيان التوحيدي رحمه الله |
| 20 | في سبيل السعادة واليقين | الإمام الغزالي رحمه الله |
| 21 | وفاة السلطان صلاح الدين الأيوبي رحمه الله | القاضي بهاء الدين المعروف بابن شداد رحمه الله |
| 22 | علو الهمة | عبد الرحمن بن الجوزي رحمه الله |
| 23 | سيد التابعين سعيد بن المسيب رحمه الله | ابن خلكان رحمه الله |
| 24 | النبوة المحمدية وآياتها | الحافظ ابن تيمية رحمه الله |
| 25 | الظلم مؤذن بخراب العمران | ابن خلدون رحمه الله |
| 26 | المدينة العجمية عند بعثة الرسول | الشيخ ولي الله الدهلوي رحمه الله |
| 27 | أهل الطبقة العليا من الأمة | السيد عبد الرحمن الكواكبي رحمه الله |
| 28 | رسالة محمد صلى الله عليه وسلم | السيد مصطفى لطفي المنفلوطي رحمه الله |
| 29 | الكوخ والقصر | الشيخ محمد عبده رحمه الله |
| 30 | سيدي أحمد الشريف السنوسي | الأمير شكيب أرسلان رحمه الله |
| 31 | الدين الصناعي | الدكتور أحمد أمين رحمه الله |
| 32 | سالم مولى أبي حذيفة رضي الله عنه | الدكتور طه حسين رحمه الله |
| 33 | الفردوس الإسلامي في قارة آسيا | الأستاذ علي الطنطاوي رحمه الله |

## Status

App slots: **33 of 33** — real chapters occupy their canonical position; the
remaining ones are `placeholder: true` entries that render the
"یہ باب ابھی شامل کیا جانا باقی ہے" notice. Because the app numbers by array
position, displayed "باب N" now matches this table exactly.

Full text present (28 of 33) — all in correct canonical position:
1–13, 15, 16, 17, 18, 19, 21, 22, 23, 25, 26, 27, 28, 29, 30, 31

Placeholders in place, awaiting text (5):
- Bab 14 القميص الأحمر
- Bab 20 في سبيل السعادة واليقين
- Bab 24 النبوة المحمدية وآياتها
- Bab 32 سالم مولى أبي حذيفة رضي الله عنه
- Bab 33 الفردوس الإسلامي في قارة آسيا

Bab 19 (حديث الناس) is filled: 78 sections (one Arabic text + its translation
each), 14 tahqeeq rows imported verbatim from the proofreader's HTML tool.
Source of truth was `حَدِيثُ النَّاسِ(rectified).docx`; every non-space character
of the DOCX is reproduced in the app (17,508 chars, verified). The DOCX had the
Arabic and Urdu glued together with no separator, so each paragraph was split at
its last harakah (Arabic here is fully vocalised, Urdu is not) and consecutive
chunks were merged; the resulting 78 pairs lose no text.

Three tahqeeq rows do not light up, by the proofreader's explicit ruling to
import the tool verbatim: اسْتَوْحَشْنَا, انْقَلَبْنَا, اطَّلَعُوْا. The DOCX writes
them attached to وَ (وَاسْتَوْحَشْنَا …) and the app matches whole words only, so
the standalone entries can never match. Not "fixed" by altering either the text
or the data.

Three rows keep a بَاب that disagrees with their own triple, also imported
as-is per the same ruling, awaiting a proofreader: نَزُوْرَ and طَالَ (both labelled
`نَصَرَ` but the triple given is `فَتَحَ`) and تَكْشِفَ (labelled `ضَرَبَ` with the
triple of `كَشَفَ`, not of the marked word).

The visible modal label قِسْم is now rendered as سہ اقسام. Only the label text
changed; the `qism` data key and the `['Qism','qism']` element-id map are
untouched, so 788 entries with a blank قِسْم still hide that row as before.

Bab 23 (سيد التابعين سعيد بن المسيب) is filled: 60 sections (one Arabic
paragraph + its Urdu translation each), 33 tahqeeq words, all carrying the
full 8-field schema (قسم/مادہ/صیغہ/بحث/باب/شُشّ/ہفت/معنی) as pre-baked
spans. One open srafi conflict on that chapter is logged in
`TEHQEEQ_REVIEW.md`.

## Tahqeeq schema

The app now renders **8 fields** in the word modal:
قِسْم، مَادَّہ، صِّیغَہ، بَحْث، شُشَّ اِقْسَام، بَاب، ہَفْتِ اِقْسَام، معنی

Rows are hidden when a value is absent, so legacy 4-field entries still look
exactly as before. `data-qism`, `data-bahas`, `data-shash`, `data-haft` are
emitted by `tokenizeArabic()` alongside the original five attributes; the
optional `data-extra` is unchanged.

## How to fill a placeholder

Replace the whole placeholder object at its canonical index with a normal
chapter object (`title`, `urduTitle`, `sections`, `words`) and drop
`placeholder: true`. Do not append — position is the chapter number.

Note: `index.html` special-cases `idx === 7` for tahqeeq de-duplication
(مقتل عمر بن الخطاب). Never insert anything before index 7, or that fix breaks.

