# Standing instructions (from the user)

Read this before touching anything in this repo. These are the user's words, not my inferences.

## 1. The source of truth is the file the user provides
- When the user supplies a Word/DOCX file, **that file is the authority.** Focus on it completely.
- Report every mismatch **before** changing anything: old text, new text, and where it sits.
- Change only what the source sanctions. If my DOCX-derived build and the user's file disagree, **the user's file wins.**
- Word-by-word comparison. Do not sample, do not spot-check, do not summarise instead of checking.

## 2. Never choose tahqeeq words myself
- Do not pick, infer, or add tahqeeq ("srfai") words. Only the rows the proofreader declared.
- If a word is not in the proofreader's list, it does not get a popup.
- **Bab 14 only:** render from its own 14 declared rows (`ownTahqeeqOnly: true`). Do not let the
  global cross-chapter table light up words here.
- Removed by explicit instruction: `بِهِمْ` (matn 36) and `بَنِي` (matn 35).
- The 14 Bab 14 rows came from the proofreader's HTML tool inside the DOCX (commit a991862). Do not
  add to or remove from that set without being asked.

## 3. Do not hand-type Arabic or Urdu
- Extract text from the source. Where a codepoint is needed, use explicit `\uXXXX` escapes.
- Assert exact equality against the source and **abort** on mismatch. Never "fix" a mismatch by
  guessing which side is right.
- Do not classify language by guessed codepoint ranges. That approach already caused wrong columns.

## 4. Data invariants
- Preserve exactly **10,948** non-space characters and the exact source character multiset.
- Keep the bare `مِلَاكُ` row. The user explicitly said not to delete it; `وَمِلَاكُ` is the matn-matching key.
- `مِلَاكُ` / `وَمِلَاكُ` meaning ends exactly with `دارومدار ہو`.

## 5. Never commit, push, or deploy without explicit approval
- Local edits and verification are fine uncommitted. Ask before `git commit`, `git push`, or any
  change to the public site or the OneDrive copy.

## 6. Code traps in this file
- The `CHAPTERS` data is scanned for its closing brace by a quote-tracking matcher that does **not**
  understand comments. Never put an apostrophe, quote, or brace inside a comment in that data.
- Verification harnesses extract single functions out of the app file and eval them. Do not add a new
  global that `tokenizeArabic` depends on; the older harnesses will throw. Prefer using the existing
  `words` parameter.

## 7. How to verify my own work
- Passing gates is **not** evidence that the user's instructions were followed. Gates check the data
  against the source; nothing checked the app against the instructions. Check the instructions
  explicitly, and treat any unrequested behaviour as a bug even when every test is green.
