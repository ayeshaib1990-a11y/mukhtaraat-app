# Tahqeeq Standard — Authoritative Data (user-supplied)

Source: supplied by the user. This file is the reference for the migration of
all existing chapters. Do not substitute wording from memory.

---

## 0.0 AUTHORITY ORDER — read this before touching any data

The user has stated plainly:

> *"text i have pasted here directly and in word doc, its a source of truth,
> they are proof readed"*

So the hierarchy is fixed:

1. **The user's pasted text and the Word doc** — authoritative and already
   proofread. Highest priority.
2. **The two approved reference entries** — `تَذْهَبُ` (§0) and `تُزَلْزِلُ` (§0.5).
3. The accumulated rulings in this file.
4. The data currently in the app.

**This file never overrides the source text.** Where this file and the source
disagree, the source wins and this file gets corrected — not the other way round.

### 0.0.1 What this immediately settles

Because the source is proofread, the items I had been holding for proof-readers
are now **resolved by the source itself**, and several of my "assumptions" are
confirmed or withdrawn:

| item | previous state | now settled as |
|---|---|---|
| §5.7 بَاب bracket = base verb | assumed | **confirmed** — the bracket gives that باب's canonical ماضی + مضارع + مصدر, exactly as `(زَلْزَلَ يُزَلْزِلُ زَلْزَلَةً)` does for a مضارع entry |
| شُشّ for form IV words (`مَعْصِيَة`, `أَحْفَظ`, `اِعْرِضْ`) | `OPEN`, deferred | **`ثلاثی مجرد`** — the source lists them so, and the rule that reconciles it with Q1 is: شُشّ counts the **مادہ's** letters; the extra letters of a باب وزن are the pattern's, not the word's. Pilot ids 10, 20, 25 are already correct — no change |
| §5.5 اسمِ مشتق بَاب = نمونہ only | **withdrawn** | the triple is written for every بَاب, §5.5 |
| §5.4 triliteral نمونہ is fixed `نَصَرَ` | **withdrawn** | the نمونہ follows each word's own معرب; `تَعْرِفُ` is `ضَرَبَ`, not `نَصَرَ` |

**Practical effect:** the Bab 23 `بَاب` proposal is no longer blocked by any
linguistic question. The only remaining gate is the نمونہ catalogue for the
derived patterns, which must be taken from the source text — not from my memory.

## 0. THE CANONICAL REFERENCE — this is the shape every entry must have

The user supplied this finished entry and declared it **"good to go"**. It is the
gold standard. Every chapter, every entry, is written in exactly this shape. When
any later section seems to disagree with §0, §0 wins.

Heading used for the block: **صرفی و لغوی تحقیق**

| field | value |
|---|---|
| قِسْم | فعل |
| مَادَّہ | ذ - ه - ب |
| صِّیغَہ | مفرد مؤنث غائب |
| بَحْث | فعل مضارع معروف |
| شُشَّ اِقْسَام | ثلاثی مجرد |
| بَاب | باب نَصَرَ يَنْصُرُ (ذَهَبَ يَذْهَبُ ذَهَابًا) |
| ہَفْتِ اِقْسَام | صحیح |
| معنی | وہ چلی جاتی ہے |

Word: `تَذْهَبُ` (Bab 31, already delivered this way).

### 0.1 What §0 fixes about the بَاب

The نمونہ is **not** a bare `نَصَرَ`. It carries its own two forms, and the entry's
own three forms follow in parentheses:

```
باب نَصَرَ يَنْصُرُ (ذَهَبَ يَذْهَبُ ذَهَابًا)
      \___ نمونہ ___/   \______ this entry's own 3 forms ______/
```

So: `باب` + `نَصَرَ` + `يَنْصُرُ` + ` (` + the word's own ماضی + مضارع + مصدر + `)`.
Per §5.6 the نمونہ triple is **always** `نَصَرَ يَنْصُرُ` for a triliteral — never
`سَمِعَ`, `كَرُمَ`, `فَتَحَ` or `ضَرَبَ`.

### 0.2 What §0 fixes about صیغہ for a VERB — this corrects earlier notes

A verb's صیغہ is a full grammatical description, **not** `واحد / مذکر`:

```
مفرد مؤنث غائب        جمع مذکر مخاطب
مثنّی مذکر متکلم       جمع مؤنث غائب
```

It is built from three parts: **تعداد** (مفرد / مثنّی / جمع) + **جنس**
(مذکر / مؤنث) + **شخص** (غائب / متکلم / مخاطب), in that order, space separated.

- `واحد / مذکر` style is for **نouns** only (اسمِ مشتق and اسمِ جامد).
- A noun's صیغہ is تعداد + جنس only, e.g. `واحد / مذکر`, `جمع / مذکر`.
- Consequence: the §1e ضمیر متصل question is a **noun-only** question. It never
  touches a verb, because a verb already states غائب/متکلم/مخاطب in صیغہ.

### 0.3 What §0 fixes about بَحْث

A verb's بحث is the گردان alone. **Grammatical mood is not written** (user
ruling): neither مجزوم nor منصوب.

| case | بحث | |
|---|---|---|
| جازم مضارع | `فعل مضارع معروف` | no mood marker |
| plain | `فعل ماضی معروف` / `فعل مضارع معروف` | |

A non-mood parenthetical is still allowed, because it names the auxiliary or
particle rather than the mood:

| case | بحث |
|---|---|
| لام تاکید | `فعل ماضی معروف (مع لام تاکید)` |

This matches the pilot, where id 4 `لَسَرَّهُ` already reads
`فعل ماضی معروف (مع لام تاکید)`.

### 0.4 The بَاب is decided per word, not per chapter

The user is explicit: *"there are different baabs according to word srafi/lugwi
tahqeeq — all will be done according to related baab."* Each word's بَاب follows
**its own** صرفی/لغوی analysis. A derived verb takes its own وزن:

```
باب إِفْتِعَال (عَصَى يَعْصِي مَعْصِيَةً)
باب إِفْعَال (أَحْفَظَ يَحْفَظُ إِحْفَاظًا)
```

There is no single blanket بَاب for a chapter, and no list to copy around.

### 0.5 Second reference — `تُزَلْزِلُ` (Bab 31, user-approved)

A رباعی مضاعف, showing that the نمونہ follows the word's **own** صرفی pattern,
not a fixed `نَصَرَ`:

| field | value |
|---|---|
| قِسْم | فعل |
| مَادَّہ | ز - ل - ز - ل |
| صِّیغہ | مفرد مؤنث غائب |
| بَحْث | فعل مضارع معروف |
| شُشَّ اِقْسَام | رباعی مزید فیہ |
| بَاب | باب فَعْلَلَ يُفَعْلِلُ (زَلْزَلَ يُزَلْزِلُ زَلْزَلَةً) |
| ہَفْتِ اِقْسَام | مضاعف رباعی |
| معنی | وہ ہلا دیتی ہے / زلزلہ طاری کرتی ہے |

**This settles three things:**

1. **ہفت for a doubled رباعی is `مضاعف رباعی`** — distinct from `مضاعف ثلاثی`
   (which is what ids 4, 9, 21, 29 of the Bab 23 pilot carry). The label always
   states whether the doubling is ثلاثی or رباعی.
2. **شُشّ for it is `رباعی مزید فیہ`** — 4 root letters plus a زائد حرف, which is
   exactly what Q1 predicts. This is the authoritative wording that item C3 in
   the proofread queue was waiting for.
3. **The بَاب نمونہ is chosen by the word's pattern**, so §5.4's fixed
   `نَصَرَ يَنْصُرُ` is **triliteral-only** and must not be forced onto a رباعی:

| pattern | نمونہ | status |
|---|---|---|
| triliteral | `نَصَرَ يَنْصُرُ` | **confirmed** (`تَذْهَبُ`) |
| رباعی مضاعف | `فَعْلَلَ يُفَعْلِلُ` | **confirmed** (`تُزَلْزِلُ`) |
| إِفْعَال / إِفْتِعَال / اسْمِ فَاعِل … | — | **not yet confirmed — ask** |

> Observation for the proofreaders, not a correction: the entry word is
> `تُزَلْزِلُ` (active, damma) while its بَاب triple gives `يُزَلْزِلُ` (passive,
> damma). The two disagree in voice. Recorded as the user approved it; flagged
> only so a proofread pass can settle it. See queue item C4.


### 0.6 The complete بَاب catalogue (user-supplied, "complete list")

Every بَاب named by the user, with its نمونہ. شُشّ for these is **`ثلاثی مزید فیہ`**
(the user wrote that as the heading above the list).

| بَاب | نمونہ | example |
|---|---|---|
| `باب إِفْعَال` | `أَفْعَلَ - يُفْعِلُ - إِفْعَالًا` | أَكْرَمَ |
| `باب تَفْعِيل` | `فَعَّلَ - يُفَعِّلُ - تَفْعِيلًا` | صَرَّفَ |
| `باب مُفَاعَلَة` | `فَاعَلَ - يُفَاعِلُ - مُفَاعَلَةً` | ضَارَبَ |
| `باب اِفْتِعَال` | `اِفْتَعَلَ - يَفْتَعِلُ - اِفْتِعَالًا` | اِكْتَسَبَ |
| `باب اِنْفِعَال` | `اِنْفَعَلَ - يَنْفَعِلُ - اِنْفِعَالًا` | اِنْصَرَفَ |
| `باب تَفَعُّل` | `تَفَعَّلَ - يَتَفَعَّلُ - تَفَعُّلًا` | تَصَرَّفَ |
| `باب تَفَاعُل` | `تَفَاعَلَ - يَتَفَاعَلُ - تَفَاعُلًا` | تَضَارَبَ |
| `باب اِسْتِفْعَال` | `اِسْتَفْعَلَ - يَسْتَفْعِلُ - اِسْتِفْعَالًا` | اِسْتَغْفَرَ |
| `باب اِفْعِلَال` | `اِفْعَلَّ - يَفْعِلُّ - اِفْعِلَالًا` | اِحْمَرَّ |
| `باب اِفْعِيلَال` | `اِفْعَالَّ - يَفْعِيلُ - اِفْعِيلَالًا` | اِصْفَارَّ |

> Encoding note: the user writes the بَاب **names** with Persian yeh U+06CC
> (`تَفْعِیل`, `اِفْعِیلَال`) while the **مضارع** inside each نمونہ uses Arabic yeh
> U+064A (`يُفَعِّلُ`). This is a third case alongside §4.5 and must be preserved
> exactly — do not normalise it.

### 0.7 Third and fourth reference entries (user-supplied, already in the app)

**`تَعْرِفُ`**

| field | value |
|---|---|
| قِسْم | فعل |
| مَادَّہ | ع - ر - ف |
| صِّیغہ | مفرد مذکر حاضر |
| بَحْث | فعل مضارع معروف |
| شُشَّ اِقْسَام | ثلاثی مجرد |
| بَاب | باب ضَرَبَ يَضْرِبُ (عَرَفَ يَعْرِفُ عَرْفًا) |
| ہَفْتِ اِقْسَام | صحیح |
| معنی | تم جانتے ہو / تمہیں معلوم ہے |

**`اسْتَكَانُوا`**

| field | value |
|---|---|
| قِسْم | فعل |
| مَادَّہ | ك - و - ن |
| صِّیغہ | جمع مذکر غائب |
| بَحْث | فعل ماضی معروف |
| شُشَّ اِقْسَام | ثلاثی مزید فیہ |
| بَاب | باب اِسْتِفْعَال (اِسْتَكَانَ يَسْتَكِينُ اِسْتَكَانَةً) |
| ہَفْتِ اِقْسَام | اجوف واوی |
| معنی | وہ عاجز آ گئے / دب گئے / خوار ہوئے |

All 16 fields of both were machine-verified against the app: exact match.

**صِّیغہ correction.** The third slot is **`حاضر`**, not `مخاطر`/`مخاطب`.
Confirmed set: `غائب` and `حاضر`. §0.2's `مخاطب` is withdrawn.

**ہفت check on `اسْتَكَانُوا`.** مادہ `ك - و - ن`: فائے = ك, عَین = و, لام = ن.
The عَین و is missing from the word, so `اجوف واوی` is right, and it matches
§4.4's positional lesson.


---

## 1. اسمِ مصدر (Masdar) — 3 بنیادی اجزاء

When the word is an **اسم مصدر**, three basic things are given:

1. شش اقسام
2. ہفت اقسام
3. باب کا نام

---

## 1a. اسمِ مشتق (Derivative noun) — راهنما (Guide for Students)

> **اسمِ مشتق کی صرفی و لغوی تحقیق**
>
> جب کوئی اسم مشتق (Derivative) ہو—یعنی کسی مصدر سے نکل کر بنا ہو—تو صرفی و
> لغوی تحقیق میں ۵ بنیادی باتیں ذکر کی جاتی ہیں:
> صیغہ (Segha)، بحث (Bahath)، باب کا نام (Bab Name)، شش اقسام (Shash Aqsam)،
> ہفت اقسام (Haft Aqsam)

### ۱. صیغہ (Segha)
لفظ کی **جنس** (مذکر/مؤنث) اور **تعداد** (واحد/تثنیہ/جمع) بتانا.
مثال: واحد مذکر، واحد مؤنث، جمع مذکر، وغیرہ۔

### ۲. بحث (Bahath)
یہ بتانا کہ یہ **کون سا اسم مشتق** ہے:

| بحث | meaning | example |
|---|---|---|
| اسم فاعل | کام کرنے والا | نَاصِرٌ — مدد کرنے والا |
| اسم مفعول | جس پر کام واقع ہوا | مَنْصُوْرٌ — جس کی مدد کی گئی |
| اسم ظرف | زمان یا مکان کو ظاہر کرنے والا | مَسْجِدٌ |
| اسم آلہ | کام کا آلہ/اوزار | مِفْتَاحٌ |
| اسم تفضیل | فضیلت یا برتری ظاہر کرنے والا | أَكْبَرُ |
| صفت مشبہ | دائم صفت | حَسَنٌ |

### ۳. باب کا نام (Bab Name)
وہ باب **جس کے وزن پر یہ مشتق بنایا گیا ہے**:
- ثلاثی مجرد کے ابواب — مثلاً `باب نَصَرَ يَنْصُرُ`
- ثلاثی مزید فیہ کے ابواب — مثلاً `باب إِفْعَال`، `باب تَفْعِيْل` وغیرہ

### ۴. شش اقسام (Shash Aqsam)
حروفِ اصلیہ کی تعداد کے اعتبار سے قسم:
- **ثلاثی مجرد** — اصلی حروف ۳ ہوں اور کوئی زائد حرف نہ ہو۔
- **ثلاثی مزید فیہ** — اصلی حروف ۳ ہوں اور زائد حروف بھی شامل ہوں۔

### ۵. ہفت اقسام (Haft Aqsam)
حروفِ اصلیہ کی ساخت کے اعتبار سے ۷ میں سے متعلقہ قسم:
صحیح، محموز،   <!-- guide quotes مہمیز; app must write محموذ --> مثال، اجوف، ناقص، لفیف، یا مضاعف۔

### ۵ اجزاء کا خلاصہ — worked example مُكْرِمٌ

| نمبر | جزو | مطلب | "مُكْرِمٌ" کی مثال |
|---|---|---|---|
| ۱ | صیغہ | جنس و تعداد | واحد مذکر |
| ۲ | بحث | مشتق کی قسم | اسم فاعل |
| ۳ | باب کا نام | مصدر کا باب | باب إِفْعَال |
| ۴ | شش اقسام | بنیادی و زائد حروف | ثلاثی مزید فیہ |
| ۵ | ہفت اقسام | ۷ میں سے ساخت | صحیح |

> **Two different sets — do not mix them.** For a **فعل**, بحث is the verb's
> گردان (§2.2) and صیغہ is تعداد/جنس/شخص. For an **اسمِ مشتق**, صیغہ is
> جنس/تعداد only (§2.1 guide) and بحث is the derivative kind — اسم فاعل /
> اسم مفعول / اسم ظرف / اسم آلہ / اسم تفضیل / صفت مشبہ. The قِسْم decides
> which set applies.

---

## 1b. مصدر (Masdar) — راهنما (Guide for Students)

> **اگر کوئی اسم مصدر ہو، تو صرفی و لغوی تحقیق میں ۳ بنیادی چیزیں ذکر کرنا
> لازم ہوتا ہے:** شش اقسام، ہفت اقسام، باب کا نام۔

### Structural consequence for the app
A `مصدر` span keeps its **صیغہ empty** but its **بحث = `مصدر`** (the worked
example below shows `۳. بَحْث: مصدر`). So the modal shows: قِسْم، مادہ، بحث،
شش اقسام، باب، ہفت اقسام، معنی — with صیغہ hidden.

### The canonical 7-step order (صرفی و لغوی تحقیق کی ۷ مرحلہ وار ترتیب)

| # | field | label |
|---|---|---|
| ۱ | مَادَّہ (حروفِ اصلیہ) | Root |
| ۲ | صِّیغَہ | Segha |
| ۳ | بَحْث | Bahath |
| ۴ | شَش اَقْسَام | Shash |
| ۵ | بَاب کَا نَام | Bab |
| ۶ | هَفْت اَقْسَام | Haft |
| ۷ | مَعْنٰی (لغوی معنی) | Meaning |

### ۱. شش اقسام (Shash Aqsam)
یہ بتاتا ہے کہ مادے میں بنیادی حروف کی تعداد کتنی ہے اور ان میں زائد حروف شامل
ہیں یا نہیں:
- **ثلاثی مجرد** — ۳ بنیادی حروف، بغیر کسی زائد حرف کے
- **ثلاثی مزید فیہ** — ۳ بنیادی حروف کے ساتھ زائد حروف بھی شامل ہوں
- **رباعی مجرد / مزید فیہ**

### ۲. ہفت اقسام (Haft Aqsam)
حروفِ اصلیہ کی ساخت کے اعتبار سے ۷ میں سے ایک قسم متعین کریں:

| قسم | شرط |
|---|---|
| صحیح | جس میں حرفِ علت و، ا، ی، ہمزہ، یا ایک ہی حرف دو بار نہ ہو |
| مہمیز / محموذ | جس کے حروفِ اصلیہ میں ہمزہ ہو |
| مثال | پہلا حرفِ اصلی و یا ی ہو |
| اجوف | درمیانی حرفِ اصلی و یا ی ہو |
| ناقص | آخری حرفِ اصلی و یا ی ہو |
| لفیف | حروفِ اصلیہ میں دو حروفِ علت ہوں |
| مضاعف | ایک ہی حرف دو بار آئے |

### ۳. باب کا نام (Bab Name)

**If the masdar is ثلاثی مجرد**, identify the باب by watching the vowel on the
**عین کلمہ (ع)** in the ماضی and the مضارع:

| # | باب | weight | عین کلمہ (ع) کی حرکت | فارمولا |
|---|---|---|---|---|
| ۱ | باب نَصَرَ يَنْصُرُ | فَعَلَ / يَفْعُلُ | فتحہ / ضمہ | فتح / ضم |
| ۲ | باب ضَرَبَ يَضْرِبُ | فَعَلَ / يَفْعِلُ | فتحہ / کسرہ | فتح / کسر |
| ۳ | باب فَتَحَ يَفْتَحُ | فَعَلَ / يَفْعَلُ | فتحہ / فتحہ | فتحتان (دو فتحے) |
| ۴ | باب سَمِعَ يَسْمَعُ | فَعِلَ / يَفْعَلُ | کسرہ / فتحہ | کسر / فتح |
| ۵ | باب حَسِبَ يَحْسُبُ | فَعِلَ / يَفْعِلُ | کسرہ / کسرہ | کسران (دو کسرے) |
| ۶ | باب كَرُمَ يَكْرُمُ | فَعُلَ / يَفْعُلُ | ضمہ / ضمہ | ضمتان (دو ضمے) |

**If the masdar is ثلاثی مزید فیہ**, write the name of its معروف باب — e.g.
`باب إِفْعَال`، `باب تَفْعِيْل`، `باب مُفَاعَلَة`، `باب تَفَعُّل` وغیرہ۔

> Caution: this table's "وزن" column is the **masdar** pattern (`مَفْعُل`), not the
> باب's مضارع (`يَفْعُلُ`). Keep the two apart when writing the بَاب value.

### Worked examples

**جَمَعَ** — فعل

| # | field | value |
|---|---|---|
| ۱ | مَادَّہ | ج - م - ع |
| ۲ | صِّیغَہ | واحد / مذکر / غائب |
| ۳ | بَحْث | فعل ماضی معروف |
| ۴ | شَش اَقْسَام | ثلاثی مجرد |
| ۵ | بَاب کَا نَام | باب فَتَحَ يَفْتَحُ |
| ۶ | هَفْت اَقْسَام | صحیح |

**مَعْصِيَةِ** — مصدر

| # | field | value |
|---|---|---|
| ۱ | مَادَّہ | ع - ص - ي |
| ۲ | صِّیغَہ | - |
| ۳ | بَحْث | مصدر |
| ۴ | شَش اَقْسَام | ثلاثی مجرد |
| ۵ | بَاب کَا نَام | باب ضَرَبَ يَضْرِبُ |
| ۶ | هَفْت اَقْسَام | ناقص یائی |
| ۷ | مَعْنٰی | نافرمانی / گناہ کرنا |

---

## 1c. اسمِ جامد (Non-Derived Noun) — راهنما (Guide for Students)

> **اسمِ جامد کی صرفی و لغوی تحقیق**
>
> **اسمِ جامد** وہ اسم ہے جو نہ خود کسی مصدر سے بنا ہو اور نہ ہی اس سے کوئی
> اور لفظ بنتا ہو (مثلاً: رَجُلٌ، جَبَلٌ، قَلَمٌ)۔
>
> چونکہ اسمِ جامد کسی باب سے نہیں نکلتا، اس لیے اس میں **باب، صیغہ، یا بحث
> شامل نہیں ہوتے**۔ اس کی صرفی و لغوی تحقیق میں صرف **۲ بنیادی باتیں** ذکر کی
> جاتی ہیں: شش اقسام اور ہفت اقسام۔

### Structural consequence for the app
For a `اسمِ جامد` span, leave `صیغہ`, `بحث`, and `باب` **empty**. The modal's
hide-empty-rows logic then shows only: قِسْم، مادہ، شش اقسام، ہفت اقسام، معنی.

### ۱. شش اقسام (Shash Aqsam)

یہ بتاتا ہے کہ لفظ میں بنیادی (اصلی) حروف کی تعداد کتنی ہے اور زائد حروف شامل
ہیں یا نہیں:

| قسم | definition | مثال |
|---|---|---|
| ثلاثی مجرد | ۳ اصلی حروف، بغیر کسی زائد حرف کے | جَبَلٌ |
| ثلاثی مزید فیہ | ۳ اصلی حروف کے ساتھ زائد حرف شامل ہو | خَاتَمٌ |
| رباعی مجرد | ۴ اصلی حروف | جَعْفَرٌ |
| رباعی مزید فیہ | ۴ اصلی حروف کے ساتھ زائد حرف | قِنْطَارٌ |
| خماسی مجرد / مزید فیہ | ۵ اصلی حروف | سَفَرْجَلٌ |

> نوٹ: اسکول اور ابتدائی درجات کے طلبہ کے لیے **ثلاثی مجرد** اور **ثلاثی مزید فیہ**
> کی پہچان سب سے زیادہ اہم ہے۔
>
> **This resolves the previously-open رباعی wording.** For a جامد noun all
> letters count as اصلی, which is why `قَلَمٌ` is "ثلاثی مزید فیہ" while
> `جَبَلٌ` is "ثلاثی مجرد".

### ۲. ہفت اقسام (Haft Aqsam)

حروفِ اصلیہ کی ساخت اور قسم کے اعتبار سے ۷ میں سے متعلقہ قسم متعین کی جاتی ہے:

| قسم | شرط / پہچان | مثال |
|---|---|---|
| صحیح | حرفِ علت (و، ا، ی)، ہمزہ، یا تکرار نہ ہو | قَلَمٌ |
| محموز | حروفِ اصلیہ میں ہمزہ آئے | رَأْسٌ (سر) |
| مثال | پہلا حرفِ اصلی و یا ی ہو | وَلَدٌ (لڑکا) |
| اجوف | درمیانی حرفِ اصلی و یا ی ہو | بَیْتٌ (گھر) |
| ناقص | آخری حرفِ اصلی و یا ی ہو | دَلْوٌ (ڈول) |
| لفیف | دو حروفِ علت ہوں | وَلِيٌّ |
| مضاعف | ایک ہی حرف دو بار آئے | شَمْسٌ / شَارِعٌ |

> **Two open points in this table (see §7):** it spells the hamzā category
> **مہمیز**, but the user's later ruling for the app was **محموذ**; and it gives
> no sub-types (no لفیف مفروق/مقرون, no محموذ الفاء/العین/الام, no ناقص
> واوي/يائی) although Bab 23 and Bab 31 data do use them.

---

## 1d. The three قِسْم values, and what each one fills in

| قِسْم | fills in | guide |
|---|---|---|
| `مصدر` | شش، ہفت، باب (3 بنیادی) | §1 |
| `اسمِ مشتق` | صیغہ، بحث، باب، شش، ہفت (5 بنیادی) | §1a |
| `اسمِ جامد` | شش، ہفت only (2 بنیادی) | §1b |
| `فعل` | صیغہ (تعداد/جنس/شخص)، بحث (گردان)، باب، شش، ہفت | §2.1–2.2 |

The bare word `مشتق` is **not** a valid قِسْم — do not use it.

---



### 1g. قِسْم is decided by the word's kind, and only 4 values are legal (user-confirmed)

- A **verb** is always `قِسْم = فعل`.
- `اسمِ مشتق` is **only** for noun-derivatives (اسم فاعل، اسم مفعول، اسم ظرف،
  اسم آلہ، اسم تفضیل، صفت مشبہ) — never for a verb.
- `مصدر` for a masdar, `اسمِ جامد` for a primitive noun.
- A bare `مشتق` is **not** a legal قِسْم value. Write `اسمِ مشتق`.

Cross-field consistency is now machine-checked: **قِسْم must agree with بحث.**

| بحث | implies قِسْم |
|---|---|
| `فعل …` (ماضی / مضارع / امر, معروف / مجہول) | `فعل` |
| `مصدر` | `مصدر` |
| `اسم فاعل` … `صفت مشبہ` | `اسمِ مشتق` |
| `اسم جامد` | `اسمِ جامد` |

Bab 23 pilot result: **33 / 33 pass.** Distribution —
`فعل` 26, `اسمِ مشتق` 3, `مصدر` 2, `اسمِ جامد` 2. Bare `مشتق` values: 0.

> Caution when grepping: `اسمِ مشتق` *contains* the substring `مشتق`, so a naive
> search for `مشتق` reports false hits. Anchor on a non-letter before it.

### 1f. بحث for an imperative is the FULL form (user-confirmed)

The بحث of an imperative verb is the complete label, **not** an abbreviated one:

```
فعل امر حاضر معروف      <- correct
فعل امر                  <- WRONG, do not use
```

This matches theVerb set used everywhere else in بحث, which always carries
tense + person + mood together (`فعل ماضی معروف`, `فعل مضارع مجہول`, …). The
imperative is no exception, so it keeps `حاضر معروف`.

| زمان / mood | بحث |
|---|---|
| ماضی | `فعل ماضی معروف` / `فعل ماضی مجہول` |
| مضارع | `فعل مضارع معروف` / `فعل مضارع مجہول` |
| امر | **`فعل امر حاضر معروف`** |

Verified in the Bab 23 pilot: ids 3 `ائْتِ`, 25 `اعْرِضْهُ`, 26 `فَاجْلِدْهُ` all
already carry the full form. A bare `فعل امر` must never be written.

### 1e. ضمیر متصل goes INSIDE صیغہ (user-confirmed)

When a word carries an attached pronoun (ضمیر متصل), the pronoun is shown
**inside the صیغہ field**. It is not left implicit, and it is not the only clue
that the noun is a مضاف.

```
أَفْقَهُ      ->  صیغہ = واحد / مذکر + هُ ضمیر متصل
وَأَحْفَظِهِمْ ->  صیغہ = واحد / مذکر + هِمْ ضمیر متصل
```

The pronoun suffixes to recognise:

| suffix | pronoun |
|---|---|
| ـهُ / ـهِ / ـهْ | 3rd person singular, masculine |
| ـهَا | 3rd person singular, feminine |
| ـهِمْ / ـهُمْ | 3rd person plural |

Scope of the rule:

- **اسمِ مشتق** and **اسمِ جامد** — the pronoun appears in صیغہ, because it turns
  the noun into a مضاف and changes what it counts as.
- **فعل** — the pronoun is part of the گردان and the person is already carried by
  صیغہ (واحد / مذکر / غائب, etc). Nothing extra is added.
- **مصدر** — صیغہ stays empty per §1b, so the pronoun is not recorded there.

> Consistency note: the Bab 23 pilot was inconsistent — id 20 carried a bare
> `(مضاف)` marker while id 6, which equally carries a pronoun, carried nothing.
> Under this rule both name the actual pronoun.

## 2. اسمِ مشتق (Derivative) — 5 بنیادی اجزاء

When the word is a **مشتق** (comes out of a masdar), five basic things are
given:

1. صیغہ (Segha)
2. بحث (Bahath)
3. باب کا نام
4. شش اقسام
5. ہفت اقسام

### 2.1 صیغہ (Segha) — تعداد، جنس، شخص

لفظ کی تین چیزیں بتانا: **تعداد** (واحد/تثنیہ/جمع)، **جنس** (مذکر/مؤنث)، اور
**شخص** (غائب/حاضر/متکلم).

مثال: واحد مذکر غائب، جمع مذکر حاضر، واحد متکلم وغیرہ۔

A متصل pronoun may be appended: `مفرد مذکر غائب + ضمیر متصل`.

### 2.2 بحث (Bahath) — فعل کی گردان یا حالت

یہ بتانا کہ یہ فعل کی کون سی **گردان** یا **حالت** ہے:

| # | بحث | meaning | example |
|---|---|---|---|
| 1 | فعل ماضی معروف | past, active | کَتَبَ — اس نے لکھا |
| 2 | فعل ماضی مجهول | past, passive | کُتِبَ — لکھا گیا |
| 3 | فعل مضارع معروف | present/future, active | یَكْتُبُ — وہ لکھتا ہے / لکھے گا |
| 4 | فعل مضارع مجهول | present/future, passive | يُكْتَبُ — لکھا جاتا ہے / جائے گا |
| 5 | فعل امر | command | اُكْتُبْ — تو لکھ (حکم دینا) |
| 6 | فعل نہی | prohibition | لَا تَكْتُبْ — تو نہ لکھ (منع کرنا) |
| 7 | نفی جحد بلم / نفی تاکید بلن وغیرہ | negative jihad, negative taqid, other negatives | — |

Grammatical mood (منصوب / مجزوم) is **not** written for a فعل — user ruling.
The بحث of a verb carries the گردان alone, with no mood marker:

```
فعل مضارع معروف          <- correct
فعل مضارع معروف (مجزوم)  <- NOT used
فعل ماضی معروف (منصوب)   <- NOT used
```

This supersedes the earlier instruction in this file to keep the mood in
parentheses. The approved Bab 31 reference `تَذْهَبُ` still reads
`فعل مضارع معروف (مجزوم)` in the app; that bracket is now considered a
deviation and is listed for the proofreaders, not endorsed.

**This rule is about verbs only.** A noun's إعراب is a different matter and
stays: `اسم مفعول (مفرد مذکر منصوب)`, `اسم (مجرور باللام)` are correct,
because منصوب / مجرور there describes the noun's case in the sentence, not a
verbal mood.

### 2.3 باب کا نام (Bab Name)

وہ باب جس سے یہ فعل آتا ہے.

**ثلاثی مجرد کے ابواب:**
باب نَصَرَ يَنْصُرُ، باب ضَرَبَ يَضْرِبُ، باب فَتَحَ يَفْتَحُ، باب سَمِعَ
يَسْمَعُ، باب حَسِبَ يَحْسُبُ، باب كَرُمَ يَكْرُمُ

**ثلاثی مزید فیہ کے ابواب:**
باب إِفْعَال، باب تَفْعِيْل، باب مُفَاعَلَة، باب اِسْتِفْعَال وغیرہ (see §5.2
for all 10).

### 2.4 شش اقسام (Shash Aqsam)

حروفِ اصلیہ اور زائد کے اعتبار سے قسم:
- **ثلاثی مجرد** — اصلی حروف ۳ ہوں اور کوئی زائد حرف نہ ہو۔
- **ثلاثی مزید فیہ** — ۳ اصلی حروف کے ساتھ زائد حروف بھی شامل ہوں۔

### 2.5 ہفت اقسام (Haft Aqsam)

حروفِ اصلیہ کی ساخت کے اعتبار سے ۷ میں سے متعلقہ قسم:
صحیح، محموز،   <!-- guide quotes مہمیز; app must write محموذ --> مثال، اجوف، ناقص، لفیف، یا مضاعف۔
See §4 for definitions and sub-types.

### 2.6 ۵ اجزاء کا خلاصہ — worked example يَنْصُرُونَ

| نمبر | جزو | مطلب | "يَنْصُرُونَ" کی مثال |
|---|---|---|---|
| ۱ | صیغہ | تعداد، جنس اور حالت | جمع مذکر غائب |
| ۲ | بحث | فعل کی گردان/قسم | فعل مضارع معروف |
| ۳ | باب کا نام | فعل کا باب | باب نَصَرَ يَنْصُرُ |
| ۴ | شش اقسام | بنیادی و زائد حروف | ثلاثی مجرد |
| ۵ | ہفت اقسام | ۷ میں سے ساخت | صحیح |

> **This table is the authority on which field holds what.** صیغہ = number /
> gender / person. بحث = the verb's گردان. The earlier draft of this file had
> these two reversed — corrected here.



### 2.3 خلاصہ — example مُكْرِمٌ

| # | جزو | مطلب | value for مُكْرِمٌ |
|---|---|---|---|
| 1 | صیغہ | جنس و تعداد | واحد مذکر |
| 2 | بحث | مشتق کی قسم | اسم فاعل |
| 3 | باب کا نام | مصدر کا باب | باب إِفْعَال |
| 4 | شش اقسام | بنیادی و زائد حروف | ثلاثی مزید فیہ |
| 5 | ہفت اقسام | ۷ میں سے ساخت | صحیح |

---

## 2a. مادہ (Root Letters) — how to extract it (user-confirmed, high importance)

مادہ = Root word / اصل حروف. To find it, remove the بنیادی و اصلی حروف that are
the basis of the word's meaning. **How you remove them depends on the قِسْم**, and
this differs for اسمِ جامد.

### فعل
The مادہ is the verb's own root letters.
- مثال: جَمَعَ → مادہ `ج - م - ع`  |  نَصَرَ → `ن - ص - ر`

### مصدر
The مادہ is the root of the underlying verb / بنیادی تین حرفی (یا چند حرفی) root
from which it was made, obtained by removing the `نا` at the end.
- مثال: لکھنا → مادہ `لکھ`  (عربی لحاظ سے ل، خ، ق)
- مثال: پڑھنا → مادہ `پڑھ`

### اسمِ مشتق
A مشتق is a word made from a مصدر. To get its مادہ, first see **which مصدر it
came from**, then write that مصدر's بنیادی مادہ.
- مثال: لکھنے والا (مشتق) → مصدر: لکھنا → مادہ `لکھ`
- مثال: کٹائی (مشتق) → مصدر: کاٹنا → مادہ `کاٹ`

### اسمِ جامد — no مادہ at all  ← THE EXCEPTION

> چونکہ یہ خود کسی سے نہیں بنتا، اس لیے **اسم جامد کا کوئی مادہ نہیں ہوتا**،
> وہی لفظ خود ہی اس کی اصل ہوتا ہے۔
> مثال: میز، پتھر، قلم → ان کا کوئی مادہ (Mada) نہیں ہے۔

A جامد noun is not built from anything and nothing is built from it, so there is
no root to extract. **The word itself is its اصل.**

### Structural consequence

| قِسْم | مادہ field = | شُشّ counted from |
|---|---|---|
| فعل | the verb's root letters | the root |
| مصدر | the root of the underlying verb (`نا` removed) | the root |
| اسمِ مشتق | the root of the مصدر it derives from | the root |
| **اسمِ جامد** | **the word's own letters** — nothing is extracted | **the word's own letters** |

So when filling شُشّ, do **not** try to reduce an اسمِ جامد to a three-letter root
— count the word's own letters instead. `الطِّرَازِ` and `أَعْوَانِ` are judged as
جامد words on their own spelling, not on a stripped triliteral.

> This resolves the open question: **root letters for فعل / مصدر / اسمِ مشتق,
> word letters for اسمِ جامد.**

## 3. شش اقسام — شُشّ counts the مادہ's letters (user-confirmed, Q1)

**شُشّ = how many حروفِ اصلیہ are in the مادہ (root)** — NOT how many letters the
written word shows. The count is the root's letter count, which is why the field is
called شُشّ اقسام (the "six" categories: ۳ root-lengths × مجرد / مزید فیہ).

Two independent tests:

1. **How many حروفِ اصلیہ does the مادہ have?** → ۳ / ۴ / ۵
2. **Does the word also carry زائد حروف?** → yes = مزید فیہ, none = مجرد

| قسم | definition | مثال |
|---|---|---|
| ثلاثی مجرد (Sulasi Mujarrad) | 3 حروفِ اصلیہ، کوئی زائد حرف نہ ہو | نَصَرَ، کَتَبَ، سَمِعَ، جَلَسَ |
| ثلاثی مزید فیہ (Sulasi Mazeed Feeh) | 3 حروفِ اصلیہ + کوئی زائد حرف شامل ہو | اَكْرَمَ، اَخْرَجَ، كَاتَبَ، اِسْتَخْرَجَ |
| رباعی مجرد (Rubai Mujarrad) | 4 حروفِ اصلیہ، کوئی زائد حرف نہ ہو | دَحْرَجَ |
| رباعی مزید فیہ (Rubai Mazeed Feeh) | 4 حروفِ اصلیہ + کوئی زائد حرف شامل ہو | تَدَحْرَجَ |
| خماسی مجرد (Khumasi Mujarrad) | 5 حروفِ اصلیہ، کوئی زائد حرف نہ ہو | سَفَرْجَلٌ |
| خماسی مزید فیہ (Khumasi Mazeed Feeh) | 5 حروفِ اصلیہ + کوئی زائد حرف شامل ہو | خَنْدَرِیسٌ |

Notes that follow from this ruling:

- **Count the root, not the spelling.** `الطِّرَازِ` has مادہ `ط - ر - ز` = ۳
  حروفِ اصلیہ, and it carries the article `ال` as a زائد حرف →
  **ثلاثی مزید فیہ**, not رباعی merely because four letters are written.
- The definite article, and the extra letters of اِسْتَ / اِفْ / اِنْ / مُ /
  تَفْعَ / تَفَاعُل style forms, are all **زائد حروف** → they make the word
  **مزید فیہ**.
- A word whose مادہ is genuinely 4 letters (رباعی) is **not** rescued by having
  a زائد حرف into being ثلاثی; the root length decides the first half of the
  label.
- **اسمِ جامد also uses this field**, but see **§2a**: a جامد noun has no root to
  extract, so its شُشّ is counted from **the word's own letters** — do not reduce it
  to a three-letter root.

> This supersedes the earlier placeholder that listed رباعی without wording.
> The six categories above are the complete set.

## 4. ہفت اقسام

Based on the structure of حروفِ اصلیہ. Two حرفِ علت are و، ا، ی.

### 4.1 The seven types (full Urdu definitions)

**1. صحیح (Sahih)**
جس میں نہ تو کوئی حرفِ علت (و، ا، ی) ہو، نہ ایک جیسے دو حروف ہوں، اور نہ ہی ہمزہ ہو۔
Examples: ضَرَبَ، کَتَبَ، نَصَرَ

**2. محموذ (Mahmood)**
جس کے حروفِ اصلی میں کوئی ایک حرف ہمزہ (ء) ہو۔ اس کی مزید تین اقسام ہیں:

| sub-type | position | example |
|---|---|---|
| محموذ الفاء | پہلے حرف کی جگہ ہمزہ | اَخَذَ |
| محموذ العین | دوسرے حرف کی جگہ ہمزہ | سَاَلَ |
| محموذ اللام | تیسرے حرف کی جگہ ہمزہ | قَرَأَ |

**3. مضاف (Mudhaf)**
جس کے حروفِ اصلی میں ایک ہی جنس کے دو حروف اکٹھے آ جائیں (یعنی ایک ہی حرف دو بار ہو)۔
Examples: مَدَّ (اصل میں مَدَدَ تھا)، رَدَّ (اصل میں رَدَدَ تھا)

**4. مثال (Misaal)**
جس کے حروفِ اصلی کا پہلا حرف (فائے کلمہ) کوئی حرفِ علت (و یا ی) ہو۔
Examples: وَعَدَ، يَسَرَ

**5. اجوف (Ajwaf)**
جس کے حروفِ اصلی کا درمیانی حرف (عین کلمہ) کوئی حرفِ علت ہو۔
Examples: قَالَ (اصل میں قَوَلَ تھا)، بَاعَ (اصل میں بَیَعَ تھا)

**6. ناقص (Naqis)**
جس کے حروفِ اصلی کا آخری حرف (لام کلمہ) کوئی حرفِ علت ہو۔
Examples: دَعَا (اصل میں دَعَوَ تھا)، رَمٰی (اصل میں رَمَیَ تھا)

**7. لفیف (Lafeef)**
جس کے حروفِ اصلی میں دو حروفِ علت پائے جائیں۔ اس کی دو اقسام ہیں:

| sub-type | definition | example |
|---|---|---|
| لفیفِ مفروق | دونوں حروفِ علت کے درمیان ایک حرفِ صحیح ہو، یعنی وہ الگ الگ ہوں | وَقٰی |
| لفیفِ مقرون | دونوں حروفِ علت ساتھ ساتھ جڑے ہوئے ہوں | طَوٰی |

### 4.2 Condensed form (as also given)

صحیح، مہمیز / محموذ، مثال، اجوف، ناقص، لفیف، مضاعف

> **Naming note:** item 3 appears as **مضاف** in the full list and as **مضاعف** in the
> condensed list. These are the same category (one letter repeated). Migration
> should render it as `مضاف (مضاعف)` unless the user says otherwise.
>
> **Spelling ruling:** the app writes **محموز** (with ذ). Never write
> `محمود` (with د) and never write `مہمیز`. The user has
> confirmed `محموز` twice, most recently as a standalone correction.

---


### 4.3 ہفت اقسام — ONLY ONE may apply (user-confirmed, hard rule)

> ہفت اقسام میں سے **صرف ایک ہی** چنی جاتی ہے۔ کبھی دو نہیں لکھی جاتیں۔
> ان میں سے یا تو **اجوف** ہے، یا **ناقص**، یا کوئی بھی ایک — بس ایک۔

A ہفت اقسام field is a **single value**. Never combine two categories. The pilot
had `مہمیز الفاء و ناقص یائی`, which mixes محموذ-الفاء with ناقص — that is invalid
and must be reduced to exactly one.

### Which single one? — decision procedure

حروفِ علت are **و، ا، ی**. Read the مادہ and find the first matching rule:

| # | category | test on the مادہ | example |
|---|---|---|---|
| 1 | مضاعف / مضاف | one letter appears **twice** | س - ر - ر → مضاعف |
| 2 | مثال | **فائے** (1st) is و or ي | وَ - ع - د |
| 3 | اجوف | **عین** (2nd) is و or ا or ي | ق - و - ل |
| 4 | ناقص | **لام** (3rd) is و or ا or ي | ر - م - ي |
| 5 | لفیف | **two** حروفِ علت in the three letters | وَ - ق - ي |
| 6 | محموذ | a **ء** in the root → note which position | ق - ر - أ (محموذ اللام) |
| 7 | صحیح | none of the above | ج - م - ع |

Only when nothing above matches is it **صحیح**. A root can satisfy the letter
test for more than one category, but the field still carries **exactly one** —
the one that fits the word as used, never a conjunction.


### 4.4 ہفت naming — keep the compound `<قسم> <حرفِ علت>` form (user-confirmed)

The ہفت field keeps its compound spelling, exactly as already used in the app:

```
اجوف یائی      مثال واوی      مضاعف ثلاثی
```

**Do not** normalise these to the bare category name, and do not rename
`مضاعف ثلاثی` to `مضاف (مضاعف)` or `محموذ` to `مہمیز`. The compound form is
correct as-is.

The second element names **which حرفِ علت** the مادہ actually carries, so it must
match the مادہ letter-for-letter:

| label | the مادہ carries | example |
|---|---|---|
| `مثال واوی` | a **و** in the فائے | و - ث - ق |
| `مثال یائی` | a **ي** in the فائے | و - ي - ن |
| `اجوف واوی` | a **و** in the عین | ف - و - ت، ح - و - ل، ع - و - ن |
| `اجوف یائی` | a **ي** in the عين | د - ي - ن، ب - ي - ت، ر - ي - ب |
| `ناقص یائی` | a **ي** in the لام | ل - ق - ي، ع - ص - ي |
| `مضاعف ثلاثی` | a doubled letter in a triliteral | س - ر - ر، ع - ز - ز، ف - ض - ض، س - ل - ل |
| `مضاف` | a doubled letter (same category, spelled per the source) | مَدَّ |

> **Correction to an earlier mistake of mine.** I once relabelled ids 14, 16 and 22
> from `اجوف یائی` to `مثال یائی`, wrongly believing the ي sat in the فائے. A
> codepoint-level check of the مادہ showed the ي is the **عَین** (2nd position) in
> all three — `د - ي - ن`, `ب - ي - ت`, `ر - ي - ب` — so the original
> `اجوف یائی` was correct and the change was reverted. The lesson that generalises:
> **read the مادہ positionally (فاء = 1st, عَین = 2nd, لام = 3rd) before labelling
> مثال / اجوف / ناقص.** A full positional audit of the Bab 23 pilot now passes
> 32 / 33, with only id 3 `ائْتِ` outstanding.

### 4.5 Yeh encoding — leave it alone

The corpus deliberately uses **Persian yeh U+06CC** inside the ہفت labels
(`واوی`, `یائی`) while the **مادہ** uses **Arabic yeh U+064A** for the root
letters. Both are intentional and must be preserved. When comparing values
programmatically, normalise U+06CC → U+064A first, or every comparison will fail
spuriously.

## 5. باب کا نام

### 5.1 Masdar, ثلاثی مجرد — 6 أبواب

The عین کلمہ's حرکت in ماضی vs مضارع determines the باب.

| # | باب کا نام | وزن (ماضی 👈 مضارع) | عین کلمہ حرکت | فارمولا |
|---|---|---|---|---|
| 1 | باب نَصَرَ يَنْصُرُ | فََعَلَ 👈 يَفْعُلُ | فتحہ 👈 ضمہ | فتح / ضم |
| 2 | باب ضَرَبَ يَضْرِبُ | فَعِلَ 👈 يَفْعَلُ | کسرہ 👈 فتحہ | کسر / فتح |
| 3 | باب فَتَحَ يَفْتَحُ | فََعَلَ 👈 يَفْعَلُ | فتحہ 👈 فتحہ | فتحتان (دو فتحے) |
| 4 | باب سَمِعَ يَسْمَعُ | فَعِلَ 👈 يَفْعَلُ | کسرہ 👈 فتحہ | کسر / فتح |
| 5 | باب حَسِبَ يَحْسِبُ | فَعِلَ 👈 يَفْعِلُ | کسرہ 👈 کسرہ | کسران (دو کسرے) |
| 6 | باب كَرُمَ يَكْرُمُ | فَعُلَ 👈 يَفْعُلُ | ضمہ 👈 ضمہ | ضمتان (دو ضمے) |

### 5.2 Masdar / derivative, ثلاثی مزید فیہ — 10 أبواب

| # | باب (with the three forms) | example |
|---|---|---|
| 1 | باب إِفْعَال (أَفْعَلَ - يُفْعِلُ - إِفْعَالًا) | أَكْرَمَ |
| 2 | باب تَفْعِیل (فَعَّلَ - يُفَعِّلُ - تَفْعِیلًا) | صَرَّفَ |
| 3 | باب مُفَاعَلَة (فَاعَلَ - يُفَاعِلُ - مُفَاعَلَةً) | ضَارَبَ |
| 4 | باب اِفْتِعَال (اِفْتَعَلَ - يَفْتَعِلُ - اِفْتِعَالًا) | اِكْتَسَبَ |
| 5 | باب اِنْفِعَال (اِنْفَعَلَ - يَنْفَعِلُ - اِنْفْعَالًا) | اِنْصَرَفَ |
| 6 | باب تَفَعُّل (تَفَعَّلَ - يَتَفَعَّلُ - تَفَعُّلًا) | تَصَرَّفَ |
| 7 | باب تَفَاعُل (تَفَاعَلَ - يَتَفَاعَلُ - تَفَاعُلًا) | تَضَارَبَ |
| 8 | باب اِسْتِفْعَال (اِسْتَفْعَلَ - يَسْتَفْعِلُ - اِسْتِفْعَالًا) | اِسْتَغْفَرَ |
| 9 | باب اِفْعِلَال (اِفْعَلَّ - يَفْعِلُّ - اِفْعِلَالًا) | اِحْمَرَّ |
| 10 | باب اِفْعِیلَال (اِفْعَالَّ - يَفْعِیلُ - اِفْعِیلَالًا) | اِصْفَارَّ |

### 5.3 بَاب must carry the three real forms — MANDATORY (user-confirmed)

The **بَاب field must always end with the actual ماضی / مضارع / مصدر of that
specific word, in parentheses.** It is never left as a bare pattern. Confirmed by
the user against Bab 31, where the entry reads:

```
باب إِفْعَال (أَمْسَكَ يُمْسِكُ إِمْسَاكًا)
```

Format:

```
باب <وزن / نمونہ> (<ماضی> <مضارع> <مصدر>)
```

- Before the bracket = the **باب** (the named pattern / نمونہ).
- Inside the bracket = **that word's own** three forms, NOT the generic weight
  written in the §5.1 / §5.2 tables above.

| kind | بَاب format | example |
|---|---|---|
| فعل, ثلاثی مجرد | `باب نَصَرَ (<ماضی> <مضارع> <مصدر>)` | دَفَعَ → `باب نَصَرَ (دَفَعَ يَدْفَعُ دَفْعًا)` |
| فعل, ثلاثی مزید فیہ | `باب <وزن> (<ماضی> <مضارع> <مصدر>)` | أَمْسَكَ → `باب إِفْعَال (أَمْسَكَ يُمْسِكُ إِمْسَاكًا)` |
| مصدر | `باب <وزن> (<ماضی> <مضارع> <مصدر>)` | حِفَاظًا → `باب إِفْعَال (حَفِظَ يَحْفَظُ حِفَاظًا)` |
| اسمِ مشتق | `باب <وزن> (<ماضی> <مضارع> <مصدر>)` | نَاصِرٌ → `باب إِفْعَال (نَصَرَ يَنْصُرُ نَصْرًا)` |
| اسمِ جامد | `بَاب = -` (empty) | — |

**This applies to every بَاب in every chapter** — the Bab 23 pilot, Bab 31, all
already-migrated entries, and all future entries. The بَاب field is never left
holding only a pattern.

> **Resolved:** the نمونہ for a ثلاثی مجرد فعل is **not** a fixed `نَصَرَ`. It
> is chosen from the word's own معرب, per §5.4. `تَعْرِفُ` was approved as
> `باب ضَرَبَ يَضْرِبُ`, which disproves the fixed rule.

---


### 5.4 The نمونہ for a tresī-free verb comes from the word's own معرب — NOT a fixed `نَصَرَ`

**This section previously said the نمونہ was always the fixed `نَصَرَ`. That was
wrong and is withdrawn.** The proof is in the user's own approved references:

| word | its مضارع | عین کلمہ | بَاب the user approved |
|---|---|---|---|
| تَذْهَبُ | يَذْهَبُ | opening | `باب نَصَرَ يَنْصُرُ (ذَهَبَ يَذْهَبُ ذَهَابًا)` |
| تَعْرِفُ | يَعْرِفُ | kasra | `باب ضَرَبَ يَضْرِبُ (عَرَفَ يَعْرِفُ عَرْفًا)` |

Both are three-letter verbs, and they take **different** أبواب. So the نمونہ is
decided by the word's own معرب (the حرکت of the عین کلمہ in ماضی vs مضارع),
exactly as §5.1 describes. A bāb is never copied from the chapter, and never
copied from a neighbouring word.

Use the §5.1 table: read the عین کلمہ's حرکت in the ماضی and in the مضارع, find
the matching row, and write that row's نمونہ.

| عین کلمہ ماضی | عین کلمہ مضارع | نمونہ to write |
|---|---|---|
| فتحہ | ضمہ | نَصَرَ يَنْصُرُ |
| کسرہ | فتحہ | ضَرَبَ يَضْرِبُ **or** سَمِعَ يَسْمَعُ (same وزن) |
| فتحہ | فتحہ | فَتَحَ يَفْتَحُ |
| کسرہ | کسرہ | حَسِبَ يَحْسُبُ |
| ضمہ | ضمہ | كَرُمَ يَكْرُمُ |

> **Open, for the proofreaders:** where the وزن alone cannot separate two أبواب
> (both `فَعِلَ / يَفْعَلُ`), the standard file names **ضَرَبَ**, which is what the
> user's approved `تَعْرِفُ` uses. `سَمِعَ` is the same وزن and several existing
> app entries use it. The choice between the two نمونہ is not settled and no
> bulk rewrite should run until it is.

| kind | نمونہ before the bracket |
|---|---|
| فعل, ثلاثی مجرد | the نمونہ of **its own** معرب — never a fixed one |
| فعل, ثلاثی مزید فیہ | the word's **own** وزن (`إِفْعَال`, `تَفْعِیل`, `مُفَاعَلَة`, …) |
| مصدر | the masdar's **own** وزن |
| اسمِ مشتق | the وزن of the masdar it derives from |
| اسمِ جامد | `بَاب = -` |

### 5.5 The triple is written for every بَاب, including اسمِ مشتق

**This section previously said an اسمِ مشتق takes the نمونہ alone, with no
parenthesised triple. That exception is withdrawn** — it contradicted §5.3 and
the user's own approved data. The triple is part of the بَاب format, so:

```
باب نَصَرَ يَنْصُرُ (سَعَى يَسْعَى سَعْيًا)   <- correct, for the مشتق سَاعٍ
باب نَصَرَ يَنْصُرُ                          <- incomplete
```

The bracket always holds **that entry's own** ماضی / مضارع / مصدر (see §5.7 for
which form of the verb goes in).

### 5.6 No نمونہ is retired

The earlier claim that `فَتَحَ`, `ضَرَبَ`, `سَمِعَ`, `كَرُمَ` and `حَسِبَ` were
never used, because the نمونہ was fixed to `نَصَرَ`, is withdrawn along with
§5.4. All six are live. The old table in this section asserted, for instance,
that `لَقِيَ` must be `باب نَصَرَ`; its own معرب (ماضى `لَقِيَ` kasra on the
عین, مضارع `يَلْقَى` opening on the عین) puts it in the `فَعِلَ / يَفْعَلُ` group
instead. Treat any بَاب written under the old fixed rule as **unverified**, not
as confirmed, and re-derive it per §5.4.


### 5.7 The triple must be the BASE verb

A three-form reference (ماضی / مضارع / مصدر) can only hold the **base** form, so
the bracket always carries the base triliteral, never the inflected form as it
happens to appear in the text:

| as written in the text | بَاب triple used |
|---|---|
| فَاتَتْنِي (fem. 2nd person) | `فَتَتَ يَفْتَتُ فَتْتًا` |
| أُجَالِسُ (1st person) | `جَالَسَ يُجَالِسُ مُجَالَسَةً` |
| أَطْبَقُوا (plural) | `أَطْبَقَ يُطْبِقُ إِطْبَاقًا` |

> Assumption, offered to the proofreaders: inflected forms such as `مُجَالَسَتِي`
> or a 2nd-person `تَفْتَتِينَ` are not used in the بَاب triple.

## 6. Resolved by the user — migration rules

| # | Question | Ruling |
|---|---|---|
| 1 | Yeh style in بَاب | **Persian yeh U+06CC in the بَاب names**, as written in the user's catalogue — `تَفْعِیل`, `اِفْعِیلَال`. Arabic yeh U+064A stays in the root letters of مادہ. |
| 2 | Doubled-letter category | **`مضاعف`** |
| 3 | Hamzā category | **`محموذ`** (user confirmed ذ is intended, twice) |
| 4 | Migration sequencing | **Pilot one Bab for review, then the rest in batches** |

> On #3 the user wrote `محموذ` and, when asked, confirmed ذ is correct. So the
> app writes **محموذ** (with ذ). This is deliberate, not a typo to fix.

### Therefore, the ہفت vocabulary to write is exactly:

- `صحیح`
- `محموذ` — with sub-types `محموذ الفاء`, `محموذ العین`, `محموذ اللام`
- `مضاعف`
- `مثال`
- `اجوف`
- `ناقص`
- `لفیف` — with sub-types `لفیفِ مفروق`, `لفیفِ مقرون`

Do **not** write `مضاف` or `مہمیز` in the app.

### Derivation rules for ہفت (from the root letters in مادہ)

| condition | ہفت |
|---|---|
| no و/ا/ي, no doubling, no ء | `صحیح` |
| ء in 1st position | `محموذ الفاء` |
| ء in 2nd position | `محموذ العین` |
| ء in 3rd position | `محموذ اللام` |
| one letter repeated | `مضاعف` |
| first letter is و/ا/ي | `مثال` |
| middle letter is و/ا/ي | `اجوف` |
| last letter is و/ا/ي | `ناقص` |
| two و/ا/ي, sound letter between | `لفیفِ مفروق` |
| two و/ا/ي adjacent | `لفیفِ مقرون` |

### شُشّ vocabulary

- `ثلاثی مجرد` — 3 root letters, no زائد
- `ثلاثی مزید فیہ` — 3 root letters plus زائد
- `رباعی مجرد` / `رباعی مزید فیہ` — mentioned parenthetically by the user but
  never defined. **Open:** needed only if an entry has a 4-letter root.

## 7. Still open

1. **رباعی مجرد / رباعی مزید فیہ** — no wording supplied. Needed only if an
   entry has a 4-letter root.
2. **Scope of ہفت** — apply to the letters of **حروفِ اصلیہ** as given in مادہ
   (e.g. `ف - ي - ء`), not to the inflected surface form.
3. **مصدر gender/number** — the reference tool writes `مصدر / اسم / مذکر` for
   bare-wazn masdars like `سَلَامًا`; elsewhere masdar is left uninflected.
4. **جمع تكسير** — `عَطَايَا`, `الضَّرَائِبِ`. Masdar is written weight-first
   (`مَصْدَرِ`) but صیغہ is placed first in other entries.

# Tahqeeq Standard — Authoritative Data (user-supplied)

Source: supplied by the user. This file is the reference for the migration of
all existing chapters. Do not substitute wording from memory.

---

## 0.0 AUTHORITY ORDER — read this before touching any data

The user has stated plainly:

> *"text i have pasted here directly and in word doc, its a source of truth,
> they are proof readed"*

So the hierarchy is fixed:

1. **The user's pasted text and the Word doc** — authoritative and already
   proofread. Highest priority.
2. **The two approved reference entries** — `تَذْهَبُ` (§0) and `تُزَلْزِلُ` (§0.5).
3. The accumulated rulings in this file.
4. The data currently in the app.

**This file never overrides the source text.** Where this file and the source
disagree, the source wins and this file gets corrected — not the other way round.

### 0.0.1 What this immediately settles

Because the source is proofread, the items I had been holding for proof-readers
are now **resolved by the source itself**, and several of my "assumptions" are
confirmed or withdrawn:

| item | previous state | now settled as |
|---|---|---|
| §5.7 بَاب bracket = base verb | assumed | **confirmed** — the bracket gives that باب's canonical ماضی + مضارع + مصدر, exactly as `(زَلْزَلَ يُزَلْزِلُ زَلْزَلَةً)` does for a مضارع entry |
| شُشّ for form IV words (`مَعْصِيَة`, `أَحْفَظ`, `اِعْرِضْ`) | `OPEN`, deferred | **`ثلاثی مجرد`** — the source lists them so, and the rule that reconciles it with Q1 is: شُشّ counts the **مادہ's** letters; the extra letters of a باب وزن are the pattern's, not the word's. Pilot ids 10, 20, 25 are already correct — no change |
| §5.5 اسمِ مشتق بَاب = نمونہ only | **withdrawn** | the triple is written for every بَاب, §5.5 |
| §5.4 triliteral نمونہ is fixed `نَصَرَ` | **withdrawn** | the نمونہ follows each word's own معرب; `تَعْرِفُ` is `ضَرَبَ`, not `نَصَرَ` |

**Practical effect:** the Bab 23 `بَاب` proposal is no longer blocked by any
linguistic question. The only remaining gate is the نمونہ catalogue for the
derived patterns, which must be taken from the source text — not from my memory.

## 0. THE CANONICAL REFERENCE — this is the shape every entry must have

The user supplied this finished entry and declared it **"good to go"**. It is the
gold standard. Every chapter, every entry, is written in exactly this shape. When
any later section seems to disagree with §0, §0 wins.

Heading used for the block: **صرفی و لغوی تحقیق**

| field | value |
|---|---|
| قِسْم | فعل |
| مَادَّہ | ذ - ه - ب |
| صِّیغَہ | مفرد مؤنث غائب |
| بَحْث | فعل مضارع معروف |
| شُشَّ اِقْسَام | ثلاثی مجرد |
| بَاب | باب نَصَرَ يَنْصُرُ (ذَهَبَ يَذْهَبُ ذَهَابًا) |
| ہَفْتِ اِقْسَام | صحیح |
| معنی | وہ چلی جاتی ہے |

Word: `تَذْهَبُ` (Bab 31, already delivered this way).

### 0.1 What §0 fixes about the بَاب

The نمونہ is **not** a bare `نَصَرَ`. It carries its own two forms, and the entry's
own three forms follow in parentheses:

```
باب نَصَرَ يَنْصُرُ (ذَهَبَ يَذْهَبُ ذَهَابًا)
      \___ نمونہ ___/   \______ this entry's own 3 forms ______/
```

So: `باب` + `نَصَرَ` + `يَنْصُرُ` + ` (` + the word's own ماضی + مضارع + مصدر + `)`.
Per §5.6 the نمونہ triple is **always** `نَصَرَ يَنْصُرُ` for a triliteral — never
`سَمِعَ`, `كَرُمَ`, `فَتَحَ` or `ضَرَبَ`.

### 0.2 What §0 fixes about صیغہ for a VERB — this corrects earlier notes

A verb's صیغہ is a full grammatical description, **not** `واحد / مذکر`:

```
مفرد مؤنث غائب        جمع مذکر مخاطب
مثنّی مذکر متکلم       جمع مؤنث غائب
```

It is built from three parts: **تعداد** (مفرد / مثنّی / جمع) + **جنس**
(مذکر / مؤنث) + **شخص** (غائب / متکلم / مخاطب), in that order, space separated.

- `واحد / مذکر` style is for **نouns** only (اسمِ مشتق and اسمِ جامد).
- A noun's صیغہ is تعداد + جنس only, e.g. `واحد / مذکر`, `جمع / مذکر`.
- Consequence: the §1e ضمیر متصل question is a **noun-only** question. It never
  touches a verb, because a verb already states غائب/متکلم/مخاطب in صیغہ.

### 0.3 What §0 fixes about بَحْث

A verb's بحث is the گردان alone. **Grammatical mood is not written** (user
ruling): neither مجزوم nor منصوب.

| case | بحث | |
|---|---|---|
| جازم مضارع | `فعل مضارع معروف` | no mood marker |
| plain | `فعل ماضی معروف` / `فعل مضارع معروف` | |

A non-mood parenthetical is still allowed, because it names the auxiliary or
particle rather than the mood:

| case | بحث |
|---|---|
| لام تاکید | `فعل ماضی معروف (مع لام تاکید)` |

This matches the pilot, where id 4 `لَسَرَّهُ` already reads
`فعل ماضی معروف (مع لام تاکید)`.

### 0.4 The بَاب is decided per word, not per chapter

The user is explicit: *"there are different baabs according to word srafi/lugwi
tahqeeq — all will be done according to related baab."* Each word's بَاب follows
**its own** صرفی/لغوی analysis. A derived verb takes its own وزن:

```
باب إِفْتِعَال (عَصَى يَعْصِي مَعْصِيَةً)
باب إِفْعَال (أَحْفَظَ يَحْفَظُ إِحْفَاظًا)
```

There is no single blanket بَاب for a chapter, and no list to copy around.

### 0.5 Second reference — `تُزَلْزِلُ` (Bab 31, user-approved)

A رباعی مضاعف, showing that the نمونہ follows the word's **own** صرفی pattern,
not a fixed `نَصَرَ`:

| field | value |
|---|---|
| قِسْم | فعل |
| مَادَّہ | ز - ل - ز - ل |
| صِّیغہ | مفرد مؤنث غائب |
| بَحْث | فعل مضارع معروف |
| شُشَّ اِقْسَام | رباعی مزید فیہ |
| بَاب | باب فَعْلَلَ يُفَعْلِلُ (زَلْزَلَ يُزَلْزِلُ زَلْزَلَةً) |
| ہَفْتِ اِقْسَام | مضاعف رباعی |
| معنی | وہ ہلا دیتی ہے / زلزلہ طاری کرتی ہے |

**This settles three things:**

1. **ہفت for a doubled رباعی is `مضاعف رباعی`** — distinct from `مضاعف ثلاثی`
   (which is what ids 4, 9, 21, 29 of the Bab 23 pilot carry). The label always
   states whether the doubling is ثلاثی or رباعی.
2. **شُشّ for it is `رباعی مزید فیہ`** — 4 root letters plus a زائد حرف, which is
   exactly what Q1 predicts. This is the authoritative wording that item C3 in
   the proofread queue was waiting for.
3. **The بَاب نمونہ is chosen by the word's pattern**, so §5.4's fixed
   `نَصَرَ يَنْصُرُ` is **triliteral-only** and must not be forced onto a رباعی:

| pattern | نمونہ | status |
|---|---|---|
| triliteral | `نَصَرَ يَنْصُرُ` | **confirmed** (`تَذْهَبُ`) |
| رباعی مضاعف | `فَعْلَلَ يُفَعْلِلُ` | **confirmed** (`تُزَلْزِلُ`) |
| إِفْعَال / إِفْتِعَال / اسْمِ فَاعِل … | — | **not yet confirmed — ask** |

> Observation for the proofreaders, not a correction: the entry word is
> `تُزَلْزِلُ` (active, damma) while its بَاب triple gives `يُزَلْزِلُ` (passive,
> damma). The two disagree in voice. Recorded as the user approved it; flagged
> only so a proofread pass can settle it. See queue item C4.


### 0.6 The complete بَاب catalogue (user-supplied, "complete list")

Every بَاب named by the user, with its نمونہ. شُشّ for these is **`ثلاثی مزید فیہ`**
(the user wrote that as the heading above the list).

| بَاب | نمونہ | example |
|---|---|---|
| `باب إِفْعَال` | `أَفْعَلَ - يُفْعِلُ - إِفْعَالًا` | أَكْرَمَ |
| `باب تَفْعِيل` | `فَعَّلَ - يُفَعِّلُ - تَفْعِيلًا` | صَرَّفَ |
| `باب مُفَاعَلَة` | `فَاعَلَ - يُفَاعِلُ - مُفَاعَلَةً` | ضَارَبَ |
| `باب اِفْتِعَال` | `اِفْتَعَلَ - يَفْتَعِلُ - اِفْتِعَالًا` | اِكْتَسَبَ |
| `باب اِنْفِعَال` | `اِنْفَعَلَ - يَنْفَعِلُ - اِنْفِعَالًا` | اِنْصَرَفَ |
| `باب تَفَعُّل` | `تَفَعَّلَ - يَتَفَعَّلُ - تَفَعُّلًا` | تَصَرَّفَ |
| `باب تَفَاعُل` | `تَفَاعَلَ - يَتَفَاعَلُ - تَفَاعُلًا` | تَضَارَبَ |
| `باب اِسْتِفْعَال` | `اِسْتَفْعَلَ - يَسْتَفْعِلُ - اِسْتِفْعَالًا` | اِسْتَغْفَرَ |
| `باب اِفْعِلَال` | `اِفْعَلَّ - يَفْعِلُّ - اِفْعِلَالًا` | اِحْمَرَّ |
| `باب اِفْعِيلَال` | `اِفْعَالَّ - يَفْعِيلُ - اِفْعِيلَالًا` | اِصْفَارَّ |

> Encoding note: the user writes the بَاب **names** with Persian yeh U+06CC
> (`تَفْعِیل`, `اِفْعِیلَال`) while the **مضارع** inside each نمونہ uses Arabic yeh
> U+064A (`يُفَعِّلُ`). This is a third case alongside §4.5 and must be preserved
> exactly — do not normalise it.

### 0.7 Third and fourth reference entries (user-supplied, already in the app)

**`تَعْرِفُ`**

| field | value |
|---|---|
| قِسْم | فعل |
| مَادَّہ | ع - ر - ف |
| صِّیغہ | مفرد مذکر حاضر |
| بَحْث | فعل مضارع معروف |
| شُشَّ اِقْسَام | ثلاثی مجرد |
| بَاب | باب ضَرَبَ يَضْرِبُ (عَرَفَ يَعْرِفُ عَرْفًا) |
| ہَفْتِ اِقْسَام | صحیح |
| معنی | تم جانتے ہو / تمہیں معلوم ہے |

**`اسْتَكَانُوا`**

| field | value |
|---|---|
| قِسْم | فعل |
| مَادَّہ | ك - و - ن |
| صِّیغہ | جمع مذکر غائب |
| بَحْث | فعل ماضی معروف |
| شُشَّ اِقْسَام | ثلاثی مزید فیہ |
| بَاب | باب اِسْتِفْعَال (اِسْتَكَانَ يَسْتَكِينُ اِسْتَكَانَةً) |
| ہَفْتِ اِقْسَام | اجوف واوی |
| معنی | وہ عاجز آ گئے / دب گئے / خوار ہوئے |

All 16 fields of both were machine-verified against the app: exact match.

**صِّیغہ correction.** The third slot is **`حاضر`**, not `مخاطر`/`مخاطب`.
Confirmed set: `غائب` and `حاضر`. §0.2's `مخاطب` is withdrawn.

**ہفت check on `اسْتَكَانُوا`.** مادہ `ك - و - ن`: فائے = ك, عَین = و, لام = ن.
The عَین و is missing from the word, so `اجوف واوی` is right, and it matches
§4.4's positional lesson.


---

## 1. اسمِ مصدر (Masdar) — 3 بنیادی اجزاء

When the word is an **اسم مصدر**, three basic things are given:

1. شش اقسام
2. ہفت اقسام
3. باب کا نام

---

## 1a. اسمِ مشتق (Derivative noun) — راهنما (Guide for Students)

> **اسمِ مشتق کی صرفی و لغوی تحقیق**
>
> جب کوئی اسم مشتق (Derivative) ہو—یعنی کسی مصدر سے نکل کر بنا ہو—تو صرفی و
> لغوی تحقیق میں ۵ بنیادی باتیں ذکر کی جاتی ہیں:
> صیغہ (Segha)، بحث (Bahath)، باب کا نام (Bab Name)، شش اقسام (Shash Aqsam)،
> ہفت اقسام (Haft Aqsam)

### ۱. صیغہ (Segha)
لفظ کی **جنس** (مذکر/مؤنث) اور **تعداد** (واحد/تثنیہ/جمع) بتانا.
مثال: واحد مذکر، واحد مؤنث، جمع مذکر، وغیرہ۔

### ۲. بحث (Bahath)
یہ بتانا کہ یہ **کون سا اسم مشتق** ہے:

| بحث | meaning | example |
|---|---|---|
| اسم فاعل | کام کرنے والا | نَاصِرٌ — مدد کرنے والا |
| اسم مفعول | جس پر کام واقع ہوا | مَنْصُوْرٌ — جس کی مدد کی گئی |
| اسم ظرف | زمان یا مکان کو ظاہر کرنے والا | مَسْجِدٌ |
| اسم آلہ | کام کا آلہ/اوزار | مِفْتَاحٌ |
| اسم تفضیل | فضیلت یا برتری ظاہر کرنے والا | أَكْبَرُ |
| صفت مشبہ | دائم صفت | حَسَنٌ |

### ۳. باب کا نام (Bab Name)
وہ باب **جس کے وزن پر یہ مشتق بنایا گیا ہے**:
- ثلاثی مجرد کے ابواب — مثلاً `باب نَصَرَ يَنْصُرُ`
- ثلاثی مزید فیہ کے ابواب — مثلاً `باب إِفْعَال`، `باب تَفْعِيْل` وغیرہ

### ۴. شش اقسام (Shash Aqsam)
حروفِ اصلیہ کی تعداد کے اعتبار سے قسم:
- **ثلاثی مجرد** — اصلی حروف ۳ ہوں اور کوئی زائد حرف نہ ہو۔
- **ثلاثی مزید فیہ** — اصلی حروف ۳ ہوں اور زائد حروف بھی شامل ہوں۔

### ۵. ہفت اقسام (Haft Aqsam)
حروفِ اصلیہ کی ساخت کے اعتبار سے ۷ میں سے متعلقہ قسم:
صحیح، محموز،   <!-- guide quotes مہمیز; app must write محموذ --> مثال، اجوف، ناقص، لفیف، یا مضاعف۔

### ۵ اجزاء کا خلاصہ — worked example مُكْرِمٌ

| نمبر | جزو | مطلب | "مُكْرِمٌ" کی مثال |
|---|---|---|---|
| ۱ | صیغہ | جنس و تعداد | واحد مذکر |
| ۲ | بحث | مشتق کی قسم | اسم فاعل |
| ۳ | باب کا نام | مصدر کا باب | باب إِفْعَال |
| ۴ | شش اقسام | بنیادی و زائد حروف | ثلاثی مزید فیہ |
| ۵ | ہفت اقسام | ۷ میں سے ساخت | صحیح |

> **Two different sets — do not mix them.** For a **فعل**, بحث is the verb's
> گردان (§2.2) and صیغہ is تعداد/جنس/شخص. For an **اسمِ مشتق**, صیغہ is
> جنس/تعداد only (§2.1 guide) and بحث is the derivative kind — اسم فاعل /
> اسم مفعول / اسم ظرف / اسم آلہ / اسم تفضیل / صفت مشبہ. The قِسْم decides
> which set applies.

---

## 1b. مصدر (Masdar) — راهنما (Guide for Students)

> **اگر کوئی اسم مصدر ہو، تو صرفی و لغوی تحقیق میں ۳ بنیادی چیزیں ذکر کرنا
> لازم ہوتا ہے:** شش اقسام، ہفت اقسام، باب کا نام۔

### Structural consequence for the app
A `مصدر` span keeps its **صیغہ empty** but its **بحث = `مصدر`** (the worked
example below shows `۳. بَحْث: مصدر`). So the modal shows: قِسْم، مادہ، بحث،
شش اقسام، باب، ہفت اقسام، معنی — with صیغہ hidden.

### The canonical 7-step order (صرفی و لغوی تحقیق کی ۷ مرحلہ وار ترتیب)

| # | field | label |
|---|---|---|
| ۱ | مَادَّہ (حروفِ اصلیہ) | Root |
| ۲ | صِّیغَہ | Segha |
| ۳ | بَحْث | Bahath |
| ۴ | شَش اَقْسَام | Shash |
| ۵ | بَاب کَا نَام | Bab |
| ۶ | هَفْت اَقْسَام | Haft |
| ۷ | مَعْنٰی (لغوی معنی) | Meaning |

### ۱. شش اقسام (Shash Aqsam)
یہ بتاتا ہے کہ مادے میں بنیادی حروف کی تعداد کتنی ہے اور ان میں زائد حروف شامل
ہیں یا نہیں:
- **ثلاثی مجرد** — ۳ بنیادی حروف، بغیر کسی زائد حرف کے
- **ثلاثی مزید فیہ** — ۳ بنیادی حروف کے ساتھ زائد حروف بھی شامل ہوں
- **رباعی مجرد / مزید فیہ**

### ۲. ہفت اقسام (Haft Aqsam)
حروفِ اصلیہ کی ساخت کے اعتبار سے ۷ میں سے ایک قسم متعین کریں:

| قسم | شرط |
|---|---|
| صحیح | جس میں حرفِ علت و، ا، ی، ہمزہ، یا ایک ہی حرف دو بار نہ ہو |
| مہمیز / محموذ | جس کے حروفِ اصلیہ میں ہمزہ ہو |
| مثال | پہلا حرفِ اصلی و یا ی ہو |
| اجوف | درمیانی حرفِ اصلی و یا ی ہو |
| ناقص | آخری حرفِ اصلی و یا ی ہو |
| لفیف | حروفِ اصلیہ میں دو حروفِ علت ہوں |
| مضاعف | ایک ہی حرف دو بار آئے |

### ۳. باب کا نام (Bab Name)

**If the masdar is ثلاثی مجرد**, identify the باب by watching the vowel on the
**عین کلمہ (ع)** in the ماضی and the مضارع:

| # | باب | weight | عین کلمہ (ع) کی حرکت | فارمولا |
|---|---|---|---|---|
| ۱ | باب نَصَرَ يَنْصُرُ | فَعَلَ / يَفْعُلُ | فتحہ / ضمہ | فتح / ضم |
| ۲ | باب ضَرَبَ يَضْرِبُ | فَعَلَ / يَفْعِلُ | فتحہ / کسرہ | فتح / کسر |
| ۳ | باب فَتَحَ يَفْتَحُ | فَعَلَ / يَفْعَلُ | فتحہ / فتحہ | فتحتان (دو فتحے) |
| ۴ | باب سَمِعَ يَسْمَعُ | فَعِلَ / يَفْعَلُ | کسرہ / فتحہ | کسر / فتح |
| ۵ | باب حَسِبَ يَحْسُبُ | فَعِلَ / يَفْعِلُ | کسرہ / کسرہ | کسران (دو کسرے) |
| ۶ | باب كَرُمَ يَكْرُمُ | فَعُلَ / يَفْعُلُ | ضمہ / ضمہ | ضمتان (دو ضمے) |

**If the masdar is ثلاثی مزید فیہ**, write the name of its معروف باب — e.g.
`باب إِفْعَال`، `باب تَفْعِيْل`، `باب مُفَاعَلَة`، `باب تَفَعُّل` وغیرہ۔

> Caution: this table's "وزن" column is the **masdar** pattern (`مَفْعُل`), not the
> باب's مضارع (`يَفْعُلُ`). Keep the two apart when writing the بَاب value.

### Worked examples

**جَمَعَ** — فعل

| # | field | value |
|---|---|---|
| ۱ | مَادَّہ | ج - م - ع |
| ۲ | صِّیغَہ | واحد / مذکر / غائب |
| ۳ | بَحْث | فعل ماضی معروف |
| ۴ | شَش اَقْسَام | ثلاثی مجرد |
| ۵ | بَاب کَا نَام | باب فَتَحَ يَفْتَحُ |
| ۶ | هَفْت اَقْسَام | صحیح |

**مَعْصِيَةِ** — مصدر

| # | field | value |
|---|---|---|
| ۱ | مَادَّہ | ع - ص - ي |
| ۲ | صِّیغَہ | - |
| ۳ | بَحْث | مصدر |
| ۴ | شَش اَقْسَام | ثلاثی مجرد |
| ۵ | بَاب کَا نَام | باب ضَرَبَ يَضْرِبُ |
| ۶ | هَفْت اَقْسَام | ناقص یائی |
| ۷ | مَعْنٰی | نافرمانی / گناہ کرنا |

---

## 1c. اسمِ جامد (Non-Derived Noun) — راهنما (Guide for Students)

> **اسمِ جامد کی صرفی و لغوی تحقیق**
>
> **اسمِ جامد** وہ اسم ہے جو نہ خود کسی مصدر سے بنا ہو اور نہ ہی اس سے کوئی
> اور لفظ بنتا ہو (مثلاً: رَجُلٌ، جَبَلٌ، قَلَمٌ)۔
>
> چونکہ اسمِ جامد کسی باب سے نہیں نکلتا، اس لیے اس میں **باب، صیغہ، یا بحث
> شامل نہیں ہوتے**۔ اس کی صرفی و لغوی تحقیق میں صرف **۲ بنیادی باتیں** ذکر کی
> جاتی ہیں: شش اقسام اور ہفت اقسام۔

### Structural consequence for the app
For a `اسمِ جامد` span, leave `صیغہ`, `بحث`, and `باب` **empty**. The modal's
hide-empty-rows logic then shows only: قِسْم، مادہ، شش اقسام، ہفت اقسام، معنی.

### ۱. شش اقسام (Shash Aqsam)

یہ بتاتا ہے کہ لفظ میں بنیادی (اصلی) حروف کی تعداد کتنی ہے اور زائد حروف شامل
ہیں یا نہیں:

| قسم | definition | مثال |
|---|---|---|
| ثلاثی مجرد | ۳ اصلی حروف، بغیر کسی زائد حرف کے | جَبَلٌ |
| ثلاثی مزید فیہ | ۳ اصلی حروف کے ساتھ زائد حرف شامل ہو | خَاتَمٌ |
| رباعی مجرد | ۴ اصلی حروف | جَعْفَرٌ |
| رباعی مزید فیہ | ۴ اصلی حروف کے ساتھ زائد حرف | قِنْطَارٌ |
| خماسی مجرد / مزید فیہ | ۵ اصلی حروف | سَفَرْجَلٌ |

> نوٹ: اسکول اور ابتدائی درجات کے طلبہ کے لیے **ثلاثی مجرد** اور **ثلاثی مزید فیہ**
> کی پہچان سب سے زیادہ اہم ہے۔
>
> **This resolves the previously-open رباعی wording.** For a جامد noun all
> letters count as اصلی, which is why `قَلَمٌ` is "ثلاثی مزید فیہ" while
> `جَبَلٌ` is "ثلاثی مجرد".

### ۲. ہفت اقسام (Haft Aqsam)

حروفِ اصلیہ کی ساخت اور قسم کے اعتبار سے ۷ میں سے متعلقہ قسم متعین کی جاتی ہے:

| قسم | شرط / پہچان | مثال |
|---|---|---|
| صحیح | حرفِ علت (و، ا، ی)، ہمزہ، یا تکرار نہ ہو | قَلَمٌ |
| محموز | حروفِ اصلیہ میں ہمزہ آئے | رَأْسٌ (سر) |
| مثال | پہلا حرفِ اصلی و یا ی ہو | وَلَدٌ (لڑکا) |
| اجوف | درمیانی حرفِ اصلی و یا ی ہو | بَیْتٌ (گھر) |
| ناقص | آخری حرفِ اصلی و یا ی ہو | دَلْوٌ (ڈول) |
| لفیف | دو حروفِ علت ہوں | وَلِيٌّ |
| مضاعف | ایک ہی حرف دو بار آئے | شَمْسٌ / شَارِعٌ |

> **Two open points in this table (see §7):** it spells the hamzā category
> **مہمیز**, but the user's later ruling for the app was **محموذ**; and it gives
> no sub-types (no لفیف مفروق/مقرون, no محموذ الفاء/العین/الام, no ناقص
> واوي/يائی) although Bab 23 and Bab 31 data do use them.

---

## 1d. The three قِسْم values, and what each one fills in

| قِسْم | fills in | guide |
|---|---|---|
| `مصدر` | شش، ہفت، باب (3 بنیادی) | §1 |
| `اسمِ مشتق` | صیغہ، بحث، باب، شش، ہفت (5 بنیادی) | §1a |
| `اسمِ جامد` | شش، ہفت only (2 بنیادی) | §1b |
| `فعل` | صیغہ (تعداد/جنس/شخص)، بحث (گردان)، باب، شش، ہفت | §2.1–2.2 |

The bare word `مشتق` is **not** a valid قِسْم — do not use it.

---



### 1g. قِسْم is decided by the word's kind, and only 4 values are legal (user-confirmed)

- A **verb** is always `قِسْم = فعل`.
- `اسمِ مشتق` is **only** for noun-derivatives (اسم فاعل، اسم مفعول، اسم ظرف،
  اسم آلہ، اسم تفضیل، صفت مشبہ) — never for a verb.
- `مصدر` for a masdar, `اسمِ جامد` for a primitive noun.
- A bare `مشتق` is **not** a legal قِسْم value. Write `اسمِ مشتق`.

Cross-field consistency is now machine-checked: **قِسْم must agree with بحث.**

| بحث | implies قِسْم |
|---|---|
| `فعل …` (ماضی / مضارع / امر, معروف / مجہول) | `فعل` |
| `مصدر` | `مصدر` |
| `اسم فاعل` … `صفت مشبہ` | `اسمِ مشتق` |
| `اسم جامد` | `اسمِ جامد` |

Bab 23 pilot result: **33 / 33 pass.** Distribution —
`فعل` 26, `اسمِ مشتق` 3, `مصدر` 2, `اسمِ جامد` 2. Bare `مشتق` values: 0.

> Caution when grepping: `اسمِ مشتق` *contains* the substring `مشتق`, so a naive
> search for `مشتق` reports false hits. Anchor on a non-letter before it.

### 1f. بحث for an imperative is the FULL form (user-confirmed)

The بحث of an imperative verb is the complete label, **not** an abbreviated one:

```
فعل امر حاضر معروف      <- correct
فعل امر                  <- WRONG, do not use
```

This matches theVerb set used everywhere else in بحث, which always carries
tense + person + mood together (`فعل ماضی معروف`, `فعل مضارع مجہول`, …). The
imperative is no exception, so it keeps `حاضر معروف`.

| زمان / mood | بحث |
|---|---|
| ماضی | `فعل ماضی معروف` / `فعل ماضی مجہول` |
| مضارع | `فعل مضارع معروف` / `فعل مضارع مجہول` |
| امر | **`فعل امر حاضر معروف`** |

Verified in the Bab 23 pilot: ids 3 `ائْتِ`, 25 `اعْرِضْهُ`, 26 `فَاجْلِدْهُ` all
already carry the full form. A bare `فعل امر` must never be written.

### 1e. ضمیر متصل goes INSIDE صیغہ (user-confirmed)

When a word carries an attached pronoun (ضمیر متصل), the pronoun is shown
**inside the صیغہ field**. It is not left implicit, and it is not the only clue
that the noun is a مضاف.

```
أَفْقَهُ      ->  صیغہ = واحد / مذکر + هُ ضمیر متصل
وَأَحْفَظِهِمْ ->  صیغہ = واحد / مذکر + هِمْ ضمیر متصل
```

The pronoun suffixes to recognise:

| suffix | pronoun |
|---|---|
| ـهُ / ـهِ / ـهْ | 3rd person singular, masculine |
| ـهَا | 3rd person singular, feminine |
| ـهِمْ / ـهُمْ | 3rd person plural |

Scope of the rule:

- **اسمِ مشتق** and **اسمِ جامد** — the pronoun appears in صیغہ, because it turns
  the noun into a مضاف and changes what it counts as.
- **فعل** — the pronoun is part of the گردان and the person is already carried by
  صیغہ (واحد / مذکر / غائب, etc). Nothing extra is added.
- **مصدر** — صیغہ stays empty per §1b, so the pronoun is not recorded there.

> Consistency note: the Bab 23 pilot was inconsistent — id 20 carried a bare
> `(مضاف)` marker while id 6, which equally carries a pronoun, carried nothing.
> Under this rule both name the actual pronoun.

## 2. اسمِ مشتق (Derivative) — 5 بنیادی اجزاء

When the word is a **مشتق** (comes out of a masdar), five basic things are
given:

1. صیغہ (Segha)
2. بحث (Bahath)
3. باب کا نام
4. شش اقسام
5. ہفت اقسام

### 2.1 صیغہ (Segha) — تعداد، جنس، شخص

لفظ کی تین چیزیں بتانا: **تعداد** (واحد/تثنیہ/جمع)، **جنس** (مذکر/مؤنث)، اور
**شخص** (غائب/حاضر/متکلم).

مثال: واحد مذکر غائب، جمع مذکر حاضر، واحد متکلم وغیرہ۔

A متصل pronoun may be appended: `مفرد مذکر غائب + ضمیر متصل`.

### 2.2 بحث (Bahath) — فعل کی گردان یا حالت

یہ بتانا کہ یہ فعل کی کون سی **گردان** یا **حالت** ہے:

| # | بحث | meaning | example |
|---|---|---|---|
| 1 | فعل ماضی معروف | past, active | کَتَبَ — اس نے لکھا |
| 2 | فعل ماضی مجهول | past, passive | کُتِبَ — لکھا گیا |
| 3 | فعل مضارع معروف | present/future, active | یَكْتُبُ — وہ لکھتا ہے / لکھے گا |
| 4 | فعل مضارع مجهول | present/future, passive | يُكْتَبُ — لکھا جاتا ہے / جائے گا |
| 5 | فعل امر | command | اُكْتُبْ — تو لکھ (حکم دینا) |
| 6 | فعل نہی | prohibition | لَا تَكْتُبْ — تو نہ لکھ (منع کرنا) |
| 7 | نفی جحد بلم / نفی تاکید بلن وغیرہ | negative jihad, negative taqid, other negatives | — |

Grammatical mood (منصوب / مجزوم) is **not** written for a فعل — user ruling.
The بحث of a verb carries the گردان alone, with no mood marker:

```
فعل مضارع معروف          <- correct
فعل مضارع معروف (مجزوم)  <- NOT used
فعل ماضی معروف (منصوب)   <- NOT used
```

This supersedes the earlier instruction in this file to keep the mood in
parentheses. The approved Bab 31 reference `تَذْهَبُ` still reads
`فعل مضارع معروف (مجزوم)` in the app; that bracket is now considered a
deviation and is listed for the proofreaders, not endorsed.

**This rule is about verbs only.** A noun's إعراب is a different matter and
stays: `اسم مفعول (مفرد مذکر منصوب)`, `اسم (مجرور باللام)` are correct,
because منصوب / مجرور there describes the noun's case in the sentence, not a
verbal mood.

### 2.3 باب کا نام (Bab Name)

وہ باب جس سے یہ فعل آتا ہے.

**ثلاثی مجرد کے ابواب:**
باب نَصَرَ يَنْصُرُ، باب ضَرَبَ يَضْرِبُ، باب فَتَحَ يَفْتَحُ، باب سَمِعَ
يَسْمَعُ، باب حَسِبَ يَحْسُبُ، باب كَرُمَ يَكْرُمُ

**ثلاثی مزید فیہ کے ابواب:**
باب إِفْعَال، باب تَفْعِيْل، باب مُفَاعَلَة، باب اِسْتِفْعَال وغیرہ (see §5.2
for all 10).

### 2.4 شش اقسام (Shash Aqsam)

حروفِ اصلیہ اور زائد کے اعتبار سے قسم:
- **ثلاثی مجرد** — اصلی حروف ۳ ہوں اور کوئی زائد حرف نہ ہو۔
- **ثلاثی مزید فیہ** — ۳ اصلی حروف کے ساتھ زائد حروف بھی شامل ہوں۔

### 2.5 ہفت اقسام (Haft Aqsam)

حروفِ اصلیہ کی ساخت کے اعتبار سے ۷ میں سے متعلقہ قسم:
صحیح، محموز،   <!-- guide quotes مہمیز; app must write محموذ --> مثال، اجوف، ناقص، لفیف، یا مضاعف۔
See §4 for definitions and sub-types.

### 2.6 ۵ اجزاء کا خلاصہ — worked example يَنْصُرُونَ

| نمبر | جزو | مطلب | "يَنْصُرُونَ" کی مثال |
|---|---|---|---|
| ۱ | صیغہ | تعداد، جنس اور حالت | جمع مذکر غائب |
| ۲ | بحث | فعل کی گردان/قسم | فعل مضارع معروف |
| ۳ | باب کا نام | فعل کا باب | باب نَصَرَ يَنْصُرُ |
| ۴ | شش اقسام | بنیادی و زائد حروف | ثلاثی مجرد |
| ۵ | ہفت اقسام | ۷ میں سے ساخت | صحیح |

> **This table is the authority on which field holds what.** صیغہ = number /
> gender / person. بحث = the verb's گردان. The earlier draft of this file had
> these two reversed — corrected here.



### 2.3 خلاصہ — example مُكْرِمٌ

| # | جزو | مطلب | value for مُكْرِمٌ |
|---|---|---|---|
| 1 | صیغہ | جنس و تعداد | واحد مذکر |
| 2 | بحث | مشتق کی قسم | اسم فاعل |
| 3 | باب کا نام | مصدر کا باب | باب إِفْعَال |
| 4 | شش اقسام | بنیادی و زائد حروف | ثلاثی مزید فیہ |
| 5 | ہفت اقسام | ۷ میں سے ساخت | صحیح |

---

## 2a. مادہ (Root Letters) — how to extract it (user-confirmed, high importance)

مادہ = Root word / اصل حروف. To find it, remove the بنیادی و اصلی حروف that are
the basis of the word's meaning. **How you remove them depends on the قِسْم**, and
this differs for اسمِ جامد.

### فعل
The مادہ is the verb's own root letters.
- مثال: جَمَعَ → مادہ `ج - م - ع`  |  نَصَرَ → `ن - ص - ر`

### مصدر
The مادہ is the root of the underlying verb / بنیادی تین حرفی (یا چند حرفی) root
from which it was made, obtained by removing the `نا` at the end.
- مثال: لکھنا → مادہ `لکھ`  (عربی لحاظ سے ل، خ، ق)
- مثال: پڑھنا → مادہ `پڑھ`

### اسمِ مشتق
A مشتق is a word made from a مصدر. To get its مادہ, first see **which مصدر it
came from**, then write that مصدر's بنیادی مادہ.
- مثال: لکھنے والا (مشتق) → مصدر: لکھنا → مادہ `لکھ`
- مثال: کٹائی (مشتق) → مصدر: کاٹنا → مادہ `کاٹ`

### اسمِ جامد — no مادہ at all  ← THE EXCEPTION

> چونکہ یہ خود کسی سے نہیں بنتا، اس لیے **اسم جامد کا کوئی مادہ نہیں ہوتا**،
> وہی لفظ خود ہی اس کی اصل ہوتا ہے۔
> مثال: میز، پتھر، قلم → ان کا کوئی مادہ (Mada) نہیں ہے۔

A جامد noun is not built from anything and nothing is built from it, so there is
no root to extract. **The word itself is its اصل.**

### Structural consequence

| قِسْم | مادہ field = | شُشّ counted from |
|---|---|---|
| فعل | the verb's root letters | the root |
| مصدر | the root of the underlying verb (`نا` removed) | the root |
| اسمِ مشتق | the root of the مصدر it derives from | the root |
| **اسمِ جامد** | **the word's own letters** — nothing is extracted | **the word's own letters** |

So when filling شُشّ, do **not** try to reduce an اسمِ جامد to a three-letter root
— count the word's own letters instead. `الطِّرَازِ` and `أَعْوَانِ` are judged as
جامد words on their own spelling, not on a stripped triliteral.

> This resolves the open question: **root letters for فعل / مصدر / اسمِ مشتق,
> word letters for اسمِ جامد.**

## 3. شش اقسام — شُشّ counts the مادہ's letters (user-confirmed, Q1)

**شُشّ = how many حروفِ اصلیہ are in the مادہ (root)** — NOT how many letters the
written word shows. The count is the root's letter count, which is why the field is
called شُشّ اقسام (the "six" categories: ۳ root-lengths × مجرد / مزید فیہ).

Two independent tests:

1. **How many حروفِ اصلیہ does the مادہ have?** → ۳ / ۴ / ۵
2. **Does the word also carry زائد حروف?** → yes = مزید فیہ, none = مجرد

| قسم | definition | مثال |
|---|---|---|
| ثلاثی مجرد (Sulasi Mujarrad) | 3 حروفِ اصلیہ، کوئی زائد حرف نہ ہو | نَصَرَ، کَتَبَ، سَمِعَ، جَلَسَ |
| ثلاثی مزید فیہ (Sulasi Mazeed Feeh) | 3 حروفِ اصلیہ + کوئی زائد حرف شامل ہو | اَكْرَمَ، اَخْرَجَ، كَاتَبَ، اِسْتَخْرَجَ |
| رباعی مجرد (Rubai Mujarrad) | 4 حروفِ اصلیہ، کوئی زائد حرف نہ ہو | دَحْرَجَ |
| رباعی مزید فیہ (Rubai Mazeed Feeh) | 4 حروفِ اصلیہ + کوئی زائد حرف شامل ہو | تَدَحْرَجَ |
| خماسی مجرد (Khumasi Mujarrad) | 5 حروفِ اصلیہ، کوئی زائد حرف نہ ہو | سَفَرْجَلٌ |
| خماسی مزید فیہ (Khumasi Mazeed Feeh) | 5 حروفِ اصلیہ + کوئی زائد حرف شامل ہو | خَنْدَرِیسٌ |

Notes that follow from this ruling:

- **Count the root, not the spelling.** `الطِّرَازِ` has مادہ `ط - ر - ز` = ۳
  حروفِ اصلیہ, and it carries the article `ال` as a زائد حرف →
  **ثلاثی مزید فیہ**, not رباعی merely because four letters are written.
- The definite article, and the extra letters of اِسْتَ / اِفْ / اِنْ / مُ /
  تَفْعَ / تَفَاعُل style forms, are all **زائد حروف** → they make the word
  **مزید فیہ**.
- A word whose مادہ is genuinely 4 letters (رباعی) is **not** rescued by having
  a زائد حرف into being ثلاثی; the root length decides the first half of the
  label.
- **اسمِ جامد also uses this field**, but see **§2a**: a جامد noun has no root to
  extract, so its شُشّ is counted from **the word's own letters** — do not reduce it
  to a three-letter root.

> This supersedes the earlier placeholder that listed رباعی without wording.
> The six categories above are the complete set.

## 4. ہفت اقسام

Based on the structure of حروفِ اصلیہ. Two حرفِ علت are و، ا، ی.

### 4.1 The seven types (full Urdu definitions)

**1. صحیح (Sahih)**
جس میں نہ تو کوئی حرفِ علت (و، ا، ی) ہو، نہ ایک جیسے دو حروف ہوں، اور نہ ہی ہمزہ ہو۔
Examples: ضَرَبَ، کَتَبَ، نَصَرَ

**2. محموذ (Mahmood)**
جس کے حروفِ اصلی میں کوئی ایک حرف ہمزہ (ء) ہو۔ اس کی مزید تین اقسام ہیں:

| sub-type | position | example |
|---|---|---|
| محموذ الفاء | پہلے حرف کی جگہ ہمزہ | اَخَذَ |
| محموذ العین | دوسرے حرف کی جگہ ہمزہ | سَاَلَ |
| محموذ اللام | تیسرے حرف کی جگہ ہمزہ | قَرَأَ |

**3. مضاف (Mudhaf)**
جس کے حروفِ اصلی میں ایک ہی جنس کے دو حروف اکٹھے آ جائیں (یعنی ایک ہی حرف دو بار ہو)۔
Examples: مَدَّ (اصل میں مَدَدَ تھا)، رَدَّ (اصل میں رَدَدَ تھا)

**4. مثال (Misaal)**
جس کے حروفِ اصلی کا پہلا حرف (فائے کلمہ) کوئی حرفِ علت (و یا ی) ہو۔
Examples: وَعَدَ، يَسَرَ

**5. اجوف (Ajwaf)**
جس کے حروفِ اصلی کا درمیانی حرف (عین کلمہ) کوئی حرفِ علت ہو۔
Examples: قَالَ (اصل میں قَوَلَ تھا)، بَاعَ (اصل میں بَیَعَ تھا)

**6. ناقص (Naqis)**
جس کے حروفِ اصلی کا آخری حرف (لام کلمہ) کوئی حرفِ علت ہو۔
Examples: دَعَا (اصل میں دَعَوَ تھا)، رَمٰی (اصل میں رَمَیَ تھا)

**7. لفیف (Lafeef)**
جس کے حروفِ اصلی میں دو حروفِ علت پائے جائیں۔ اس کی دو اقسام ہیں:

| sub-type | definition | example |
|---|---|---|
| لفیفِ مفروق | دونوں حروفِ علت کے درمیان ایک حرفِ صحیح ہو، یعنی وہ الگ الگ ہوں | وَقٰی |
| لفیفِ مقرون | دونوں حروفِ علت ساتھ ساتھ جڑے ہوئے ہوں | طَوٰی |

### 4.2 Condensed form (as also given)

صحیح، مہمیز / محموذ، مثال، اجوف، ناقص، لفیف، مضاعف

> **Naming note:** item 3 appears as **مضاف** in the full list and as **مضاعف** in the
> condensed list. These are the same category (one letter repeated). Migration
> should render it as `مضاف (مضاعف)` unless the user says otherwise.
>
> **Spelling ruling:** the app writes **محموز** (with ذ). Never write
> `محمود` (with د) and never write `مہمیز`. The user has
> confirmed `محموز` twice, most recently as a standalone correction.

---


### 4.3 ہفت اقسام — ONLY ONE may apply (user-confirmed, hard rule)

> ہفت اقسام میں سے **صرف ایک ہی** چنی جاتی ہے۔ کبھی دو نہیں لکھی جاتیں۔
> ان میں سے یا تو **اجوف** ہے، یا **ناقص**، یا کوئی بھی ایک — بس ایک۔

A ہفت اقسام field is a **single value**. Never combine two categories. The pilot
had `مہمیز الفاء و ناقص یائی`, which mixes محموذ-الفاء with ناقص — that is invalid
and must be reduced to exactly one.

### Which single one? — decision procedure

حروفِ علت are **و، ا، ی**. Read the مادہ and find the first matching rule:

| # | category | test on the مادہ | example |
|---|---|---|---|
| 1 | مضاعف / مضاف | one letter appears **twice** | س - ر - ر → مضاعف |
| 2 | مثال | **فائے** (1st) is و or ي | وَ - ع - د |
| 3 | اجوف | **عین** (2nd) is و or ا or ي | ق - و - ل |
| 4 | ناقص | **لام** (3rd) is و or ا or ي | ر - م - ي |
| 5 | لفیف | **two** حروفِ علت in the three letters | وَ - ق - ي |
| 6 | محموذ | a **ء** in the root → note which position | ق - ر - أ (محموذ اللام) |
| 7 | صحیح | none of the above | ج - م - ع |

Only when nothing above matches is it **صحیح**. A root can satisfy the letter
test for more than one category, but the field still carries **exactly one** —
the one that fits the word as used, never a conjunction.


### 4.4 ہفت naming — keep the compound `<قسم> <حرفِ علت>` form (user-confirmed)

The ہفت field keeps its compound spelling, exactly as already used in the app:

```
اجوف یائی      مثال واوی      مضاعف ثلاثی
```

**Do not** normalise these to the bare category name, and do not rename
`مضاعف ثلاثی` to `مضاف (مضاعف)` or `محموذ` to `مہمیز`. The compound form is
correct as-is.

The second element names **which حرفِ علت** the مادہ actually carries, so it must
match the مادہ letter-for-letter:

| label | the مادہ carries | example |
|---|---|---|
| `مثال واوی` | a **و** in the فائے | و - ث - ق |
| `مثال یائی` | a **ي** in the فائے | و - ي - ن |
| `اجوف واوی` | a **و** in the عین | ف - و - ت، ح - و - ل، ع - و - ن |
| `اجوف یائی` | a **ي** in the عين | د - ي - ن، ب - ي - ت، ر - ي - ب |
| `ناقص یائی` | a **ي** in the لام | ل - ق - ي، ع - ص - ي |
| `مضاعف ثلاثی` | a doubled letter in a triliteral | س - ر - ر، ع - ز - ز، ف - ض - ض، س - ل - ل |
| `مضاف` | a doubled letter (same category, spelled per the source) | مَدَّ |

> **Correction to an earlier mistake of mine.** I once relabelled ids 14, 16 and 22
> from `اجوف یائی` to `مثال یائی`, wrongly believing the ي sat in the فائے. A
> codepoint-level check of the مادہ showed the ي is the **عَین** (2nd position) in
> all three — `د - ي - ن`, `ب - ي - ت`, `ر - ي - ب` — so the original
> `اجوف یائی` was correct and the change was reverted. The lesson that generalises:
> **read the مادہ positionally (فاء = 1st, عَین = 2nd, لام = 3rd) before labelling
> مثال / اجوف / ناقص.** A full positional audit of the Bab 23 pilot now passes
> 32 / 33, with only id 3 `ائْتِ` outstanding.

### 4.5 Yeh encoding — leave it alone

The corpus deliberately uses **Persian yeh U+06CC** inside the ہفت labels
(`واوی`, `یائی`) while the **مادہ** uses **Arabic yeh U+064A** for the root
letters. Both are intentional and must be preserved. When comparing values
programmatically, normalise U+06CC → U+064A first, or every comparison will fail
spuriously.

## 5. باب کا نام

### 5.1 Masdar, ثلاثی مجرد — 6 أبواب

The عین کلمہ's حرکت in ماضی vs مضارع determines the باب.

| # | باب کا نام | وزن (ماضی 👈 مضارع) | عین کلمہ حرکت | فارمولا |
|---|---|---|---|---|
| 1 | باب نَصَرَ يَنْصُرُ | فََعَلَ 👈 يَفْعُلُ | فتحہ 👈 ضمہ | فتح / ضم |
| 2 | باب ضَرَبَ يَضْرِبُ | فَعِلَ 👈 يَفْعَلُ | کسرہ 👈 فتحہ | کسر / فتح |
| 3 | باب فَتَحَ يَفْتَحُ | فََعَلَ 👈 يَفْعَلُ | فتحہ 👈 فتحہ | فتحتان (دو فتحے) |
| 4 | باب سَمِعَ يَسْمَعُ | فَعِلَ 👈 يَفْعَلُ | کسرہ 👈 فتحہ | کسر / فتح |
| 5 | باب حَسِبَ يَحْسِبُ | فَعِلَ 👈 يَفْعِلُ | کسرہ 👈 کسرہ | کسران (دو کسرے) |
| 6 | باب كَرُمَ يَكْرُمُ | فَعُلَ 👈 يَفْعُلُ | ضمہ 👈 ضمہ | ضمتان (دو ضمے) |

### 5.2 Masdar / derivative, ثلاثی مزید فیہ — 10 أبواب

| # | باب (with the three forms) | example |
|---|---|---|
| 1 | باب إِفْعَال (أَفْعَلَ - يُفْعِلُ - إِفْعَالًا) | أَكْرَمَ |
| 2 | باب تَفْعِیل (فَعَّلَ - يُفَعِّلُ - تَفْعِیلًا) | صَرَّفَ |
| 3 | باب مُفَاعَلَة (فَاعَلَ - يُفَاعِلُ - مُفَاعَلَةً) | ضَارَبَ |
| 4 | باب اِفْتِعَال (اِفْتَعَلَ - يَفْتَعِلُ - اِفْتِعَالًا) | اِكْتَسَبَ |
| 5 | باب اِنْفِعَال (اِنْفَعَلَ - يَنْفَعِلُ - اِنْفْعَالًا) | اِنْصَرَفَ |
| 6 | باب تَفَعُّل (تَفَعَّلَ - يَتَفَعَّلُ - تَفَعُّلًا) | تَصَرَّفَ |
| 7 | باب تَفَاعُل (تَفَاعَلَ - يَتَفَاعَلُ - تَفَاعُلًا) | تَضَارَبَ |
| 8 | باب اِسْتِفْعَال (اِسْتَفْعَلَ - يَسْتَفْعِلُ - اِسْتِفْعَالًا) | اِسْتَغْفَرَ |
| 9 | باب اِفْعِلَال (اِفْعَلَّ - يَفْعِلُّ - اِفْعِلَالًا) | اِحْمَرَّ |
| 10 | باب اِفْعِیلَال (اِفْعَالَّ - يَفْعِیلُ - اِفْعِیلَالًا) | اِصْفَارَّ |

### 5.3 بَاب must carry the three real forms — MANDATORY (user-confirmed)

The **بَاب field must always end with the actual ماضی / مضارع / مصدر of that
specific word, in parentheses.** It is never left as a bare pattern. Confirmed by
the user against Bab 31, where the entry reads:

```
باب إِفْعَال (أَمْسَكَ يُمْسِكُ إِمْسَاكًا)
```

Format:

```
باب <وزن / نمونہ> (<ماضی> <مضارع> <مصدر>)
```

- Before the bracket = the **باب** (the named pattern / نمونہ).
- Inside the bracket = **that word's own** three forms, NOT the generic weight
  written in the §5.1 / §5.2 tables above.

| kind | بَاب format | example |
|---|---|---|
| فعل, ثلاثی مجرد | `باب نَصَرَ (<ماضی> <مضارع> <مصدر>)` | دَفَعَ → `باب نَصَرَ (دَفَعَ يَدْفَعُ دَفْعًا)` |
| فعل, ثلاثی مزید فیہ | `باب <وزن> (<ماضی> <مضارع> <مصدر>)` | أَمْسَكَ → `باب إِفْعَال (أَمْسَكَ يُمْسِكُ إِمْسَاكًا)` |
| مصدر | `باب <وزن> (<ماضی> <مضارع> <مصدر>)` | حِفَاظًا → `باب إِفْعَال (حَفِظَ يَحْفَظُ حِفَاظًا)` |
| اسمِ مشتق | `باب <وزن> (<ماضی> <مضارع> <مصدر>)` | نَاصِرٌ → `باب إِفْعَال (نَصَرَ يَنْصُرُ نَصْرًا)` |
| اسمِ جامد | `بَاب = -` (empty) | — |

**This applies to every بَاب in every chapter** — the Bab 23 pilot, Bab 31, all
already-migrated entries, and all future entries. The بَاب field is never left
holding only a pattern.

> **Resolved:** the نمونہ for a ثلاثی مجرد فعل is **not** a fixed `نَصَرَ`. It
> is chosen from the word's own معرب, per §5.4. `تَعْرِفُ` was approved as
> `باب ضَرَبَ يَضْرِبُ`, which disproves the fixed rule.

---


### 5.4 The نمونہ for a tresī-free verb comes from the word's own معرب — NOT a fixed `نَصَرَ`

**This section previously said the نمونہ was always the fixed `نَصَرَ`. That was
wrong and is withdrawn.** The proof is in the user's own approved references:

| word | its مضارع | عین کلمہ | بَاب the user approved |
|---|---|---|---|
| تَذْهَبُ | يَذْهَبُ | opening | `باب نَصَرَ يَنْصُرُ (ذَهَبَ يَذْهَبُ ذَهَابًا)` |
| تَعْرِفُ | يَعْرِفُ | kasra | `باب ضَرَبَ يَضْرِبُ (عَرَفَ يَعْرِفُ عَرْفًا)` |

Both are three-letter verbs, and they take **different** أبواب. So the نمونہ is
decided by the word's own معرب (the حرکت of the عین کلمہ in ماضی vs مضارع),
exactly as §5.1 describes. A bāb is never copied from the chapter, and never
copied from a neighbouring word.

Use the §5.1 table: read the عین کلمہ's حرکت in the ماضی and in the مضارع, find
the matching row, and write that row's نمونہ.

| عین کلمہ ماضی | عین کلمہ مضارع | نمونہ to write |
|---|---|---|
| فتحہ | ضمہ | نَصَرَ يَنْصُرُ |
| کسرہ | فتحہ | ضَرَبَ يَضْرِبُ **or** سَمِعَ يَسْمَعُ (same وزن) |
| فتحہ | فتحہ | فَتَحَ يَفْتَحُ |
| کسرہ | کسرہ | حَسِبَ يَحْسُبُ |
| ضمہ | ضمہ | كَرُمَ يَكْرُمُ |

> **Open, for the proofreaders:** where the وزن alone cannot separate two أبواب
> (both `فَعِلَ / يَفْعَلُ`), the standard file names **ضَرَبَ**, which is what the
> user's approved `تَعْرِفُ` uses. `سَمِعَ` is the same وزن and several existing
> app entries use it. The choice between the two نمونہ is not settled and no
> bulk rewrite should run until it is.

| kind | نمونہ before the bracket |
|---|---|
| فعل, ثلاثی مجرد | the نمونہ of **its own** معرب — never a fixed one |
| فعل, ثلاثی مزید فیہ | the word's **own** وزن (`إِفْعَال`, `تَفْعِیل`, `مُفَاعَلَة`, …) |
| مصدر | the masdar's **own** وزن |
| اسمِ مشتق | the وزن of the masdar it derives from |
| اسمِ جامد | `بَاب = -` |

### 5.5 The triple is written for every بَاب, including اسمِ مشتق

**This section previously said an اسمِ مشتق takes the نمونہ alone, with no
parenthesised triple. That exception is withdrawn** — it contradicted §5.3 and
the user's own approved data. The triple is part of the بَاب format, so:

```
باب نَصَرَ يَنْصُرُ (سَعَى يَسْعَى سَعْيًا)   <- correct, for the مشتق سَاعٍ
باب نَصَرَ يَنْصُرُ                          <- incomplete
```

The bracket always holds **that entry's own** ماضی / مضارع / مصدر (see §5.7 for
which form of the verb goes in).

### 5.6 No نمونہ is retired

The earlier claim that `فَتَحَ`, `ضَرَبَ`, `سَمِعَ`, `كَرُمَ` and `حَسِبَ` were
never used, because the نمونہ was fixed to `نَصَرَ`, is withdrawn along with
§5.4. All six are live. The old table in this section asserted, for instance,
that `لَقِيَ` must be `باب نَصَرَ`; its own معرب (ماضى `لَقِيَ` kasra on the
عین, مضارع `يَلْقَى` opening on the عین) puts it in the `فَعِلَ / يَفْعَلُ` group
instead. Treat any بَاب written under the old fixed rule as **unverified**, not
as confirmed, and re-derive it per §5.4.


### 5.7 The triple must be the BASE verb

A three-form reference (ماضی / مضارع / مصدر) can only hold the **base** form, so
the bracket always carries the base triliteral, never the inflected form as it
happens to appear in the text:

| as written in the text | بَاب triple used |
|---|---|
| فَاتَتْنِي (fem. 2nd person) | `فَتَتَ يَفْتَتُ فَتْتًا` |
| أُجَالِسُ (1st person) | `جَالَسَ يُجَالِسُ مُجَالَسَةً` |
| أَطْبَقُوا (plural) | `أَطْبَقَ يُطْبِقُ إِطْبَاقًا` |

> Assumption, offered to the proofreaders: inflected forms such as `مُجَالَسَتِي`
> or a 2nd-person `تَفْتَتِينَ` are not used in the بَاب triple.

## 6. Resolved by the user — migration rules

| # | Question | Ruling |
|---|---|---|
| 1 | Yeh style in بَاب | **Persian yeh U+06CC in the بَاب names**, as written in the user's catalogue — `تَفْعِیل`, `اِفْعِیلَال`. Arabic yeh U+064A stays in the root letters of مادہ. |
| 2 | Doubled-letter category | **`مضاعف`** |
| 3 | Hamzā category | **`محموذ`** (user confirmed ذ is intended, twice) |
| 4 | Migration sequencing | **Pilot one Bab for review, then the rest in batches** |

> On #3 the user wrote `محموذ` and, when asked, confirmed ذ is correct. So the
> app writes **محموذ** (with ذ). This is deliberate, not a typo to fix.

### Therefore, the ہفت vocabulary to write is exactly:

- `صحیح`
- `محموذ` — with sub-types `محموذ الفاء`, `محموذ العین`, `محموذ اللام`
- `مضاعف`
- `مثال`
- `اجوف`
- `ناقص`
- `لفیف` — with sub-types `لفیفِ مفروق`, `لفیفِ مقرون`

Do **not** write `مضاف` or `مہمیز` in the app.

### Derivation rules for ہفت (from the root letters in مادہ)

| condition | ہفت |
|---|---|
| no و/ا/ي, no doubling, no ء | `صحیح` |
| ء in 1st position | `محموذ الفاء` |
| ء in 2nd position | `محموذ العین` |
| ء in 3rd position | `محموذ اللام` |
| one letter repeated | `مضاعف` |
| first letter is و/ا/ي | `مثال` |
| middle letter is و/ا/ي | `اجوف` |
| last letter is و/ا/ي | `ناقص` |
| two و/ا/ي, sound letter between | `لفیفِ مفروق` |
| two و/ا/ي adjacent | `لفیفِ مقرون` |

### شُشّ vocabulary

- `ثلاثی مجرد` — 3 root letters, no زائد
- `ثلاثی مزید فیہ` — 3 root letters plus زائد
- `رباعی مجرد` / `رباعی مزید فیہ` — mentioned parenthetically by the user but
  never defined. **Open:** needed only if an entry has a 4-letter root.

## 7. Still open

1. **رباعی مجرد / رباعی مزید فیہ** — no wording supplied. Needed only if an
   entry has a 4-letter root.
2. **Scope of ہفت** — apply to the letters of **حروفِ اصلیہ** as given in مادہ
   (e.g. `ف - ي - ء`), not to the inflected surface form.
3. **مصدر gender/number** — the reference tool writes `مصدر / اسم / مذکر` for
   bare-wazn masdars like `سَلَامًا`; elsewhere masdar is left uninflected.
4. **جمع تكسير** — `عَطَايَا`, `الضَّرَائِبِ`. Masdar is written weight-first
   (`مَصْدَرِ`) but صیغہ is placed first in other entries.

## Baab catalogue (added by proofreader ruling)

The complete authoritative list of the 6 triliteral (mujarrad) and 10 triliteral-augmented
(mazeed feeh) abwab - with madi / mudari / masdar and the vowel patterns - is in
**BAB_CATALOGUE.md**. Use it for every baab. Never invent a pattern.
