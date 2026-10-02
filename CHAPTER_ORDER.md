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

Full text present (29 of 33) — all in correct canonical position:
1–19, 21, 22, 23, 25, 26, 27, 28, 29, 30, 31

Placeholders in place, awaiting text (4):
- Bab 20 في سبيل السعادة واليقين
- Bab 24 النبوة المحمدية وآياتها
- Bab 32 سالم مولى أبي حذيفة رضي الله عنه
- Bab 33 الفردوس الإسلامي في قارة آسيا

Bab 14 (القميص الأحمر) is filled: 50 sections (one Arabic text + its
translation each), 14 tahqeeq rows imported verbatim from the proofreader's
HTML tool. Source of truth was
`لْقَمِيْصُ الْأَحْمَرُ (سرخ قمیض)(rectified).docx`; all 10,948 non-space
characters of the DOCX are reproduced in the app — nothing lost, nothing added
(verified by character multiset, and by both columns reproducing the DOCX word
order as two subsequences).

**This DOCX must not be split the way Bab 19 was.** It has no title and no
page-marker paragraph, and it does not keep one Arabic block then one Urdu
block per paragraph: Arabic and Urdu *alternate inside the same paragraph* —
58 Arabic runs and 58 Urdu runs, and 8 paragraphs (2, 3, 12, 26, 28, 29, 33,
36) switch language more than once. Splitting each paragraph at its last
harakah, as Bab 19 requires, strands whole Urdu sentences inside the `arabic`
column. What holds for this file instead, and was checked before anything was
built: Arabic is fully vocalised, Urdu never is, and **no Arabic word appears
bare**, so a word's language is decided exactly by whether it carries a
harakah. Words are classified individually; whitespace goes with the following
word and punctuation with the preceding one, so an Arabic comma never migrates
into the Urdu column. Paragraph 30 is Arabic-only and paragraph 31 is its
Urdu-only translation, so those two were merged into one section — 51 paragraphs
become 50 sections, and no column is left empty. Verified afterwards: zero bare
words in the `arabic` column, zero vocalised words in the `urdu` column, every
DOCX word in exactly one column, both columns in document order.

This tool's سِہ اَقْسَام field is spelled `seh` in its `dictionary` records
(`{ word, seh, mada, segha, bahas, shash, baab, haft, meaning }`); it maps to
the app's `qism` as `seh → qism`. All 14 rows carry a real value there — ten
`فعل` and four `اسم (…مصدر/اسم فاعل)` — so the قِسْم row is populated on every
row, which no earlier chapter managed.

Six rows needed a lookup key that matches the source, for the same reason as
Bab 19: the DOCX writes the word attached to the preceding ب or ف or وَ, and the
app matches whole words only, so the tool's standalone spelling can never match.
Their `w` key was re-spelled to the word exactly as the source writes it —
فَجَزَعَ, وَأَرْسَلَ, وَاسْتَلَمَ, بِجَمْعِ, وَاقْتَصَرْتُ, وَاهْتَمَمْتَ — so all 14
rows light up (verified through the app's own `tokenizeArabic`). Keys were
extracted programmatically out of the chapter text, never typed, and only a
leading Arabic clitic (ب و ف ك ل) is accepted as the attachment: a plain
"ends with" test would also match تَجْمَعُ ("you gather") against جَمْعِ, a
different word. All 8 data fields of all 14 rows are byte-identical to the
tool's. No visible character was altered.

Five rows keep a بَاب that disagrees with their own triple, imported as-is per
the proofreader's ruling, awaiting a proofreader: أَشْكُوْ, يَدْخُلُنِي and غَافِلٌ
(all labelled `نَصَرَ` with a triple of another verb) and جَزَعَ, اَطَّمْعُ (both
labelled `سَمِعَ` with a triple of another verb). Rows whose قِسْم is a masdar
(ظُهُورَ, جَمْعِ, اَطَّمْعُ) carry `-` for صِّیغَہ and بَحْث, kept exactly as the
tool shows them.

All 8 visible modal labels now use the proofreader's exact wording and order:
سِہ اَقْسَام · مَادَّہ (حروفِ اصلیہ) · صِّیغَہ · بَحْث · شَش اَقْسَام · بَاب کَا نَام ·
هَفْت اَقْسَام · مَعْنٰی (لغوی معنی). Only the label text changed; the `qism`
data key and the `['Qism','qism']` element-id map are untouched, so entries with
a blank قِسْم still hide that row as before. (Three of these labels — سِہ اَقْسَام,
شَش اَقْسَام, هَفْت اَقْسَام — had been committed missing the alif of اقسام, and
مَعْنٰی had the parentheses in the wrong place. Corrected and re-verified
character by character.)

Bab 19 (حديث الناس) is filled: 78 sections (one Arabic text + its translation
each), 14 tahqeeq rows imported verbatim from the proofreader's HTML tool.
Source of truth was `حَدِيثُ النَّاسِ(rectified).docx`; every non-space character
of the DOCX is reproduced in the app (17,508 chars, verified). The DOCX had the
Arabic and Urdu glued together with no separator, so each paragraph was split at
its last harakah (Arabic here is fully vocalised, Urdu is not) and consecutive
chunks were merged; the resulting 78 pairs lose no text.

Three tahqeeq rows needed a lookup key that matches the source: the DOCX writes
اسْتَوْحَشْنَا, انْقَلَبْنَا and اطَّلَعُوْا attached to وَ (وَاسْتَوْحَشْنَا …), and the
app matches whole words only, so the standalone spelling can never match. Their
`w` key was re-spelled to the word exactly as the source writes it —
وَاسْتَوْحَشْنَا, وَانْقَلَبْنَا, وَاطَّلَعُوْا — so all 14 rows light up. The key was
copied verbatim out of the chapter text, never typed. All 7 data fields of those
three rows are byte-identical to the tool's (verified field by field); only the
matching key differs, and no visible character was altered.

Three rows keep a بَاب that disagrees with their own triple, imported as-is per
the proofreader's ruling, awaiting a proofreader: نَزُوْرَ and طَالَ (both labelled
`نَصَرَ` but the triple given is `فَتَحَ`) and تَكْشِفَ (labelled `ضَرَبَ` with the
triple of `كَشَفَ`, not of the marked word).

All 8 visible modal labels now use the proofreader's exact wording and order:
سِہ اَقْسَام · مَادَّہ (حروفِ اصلیہ) · صِّیغَہ · بَحْث · شَش اَقْسَام · بَاب کَا نَام ·
هَفْت اَقْسَام · مَعْنٰی (لغوی) معنی. Only the label text changed; the `qism`
data key and the `['Qism','qism']` element-id map are untouched, so entries with
a blank قِسْم still hide that row as before.

The chapter's `urduTitle` was the attribution (ابو حيان التوحيدي رحمه الله), and
the main menu prints `urduTitle`, so the menu showed the attribution instead of
the chapter name. It is now حديث الناس, matching `title`; the attribution is
recorded here instead.

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

Note: tahqeeq de-duplication is per chapter — `renderChapter()` creates a fresh
`chapterUsed = new Set()` for each chapter and threads it through
`tokenizeArabic()`, so a word is flagged on its first occurrence in every
chapter and never twice in the same one. No array index is special-cased, so a
chapter may be filled at any canonical position.

