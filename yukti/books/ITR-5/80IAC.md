# Schedule 80IAC — Deduction in respect of eligible start-up u/s 80-IAC

Form: **ITR-5**, A.Y. 2026-27. Sheet: **80IAC** (`sheet35.xml`, 12 rows, 0 hidden rows). Section: `ded`. Block: **Schedule80IAC**.
Source: `python tools/dump.py --form ITR-5 --sheet "80IAC"` (rows / --formulas / --dropdowns) and `--schema Schedule80IAC` / `--leaves Schedule80IAC`; schema `sources/ITR-5/ITR-5_2026_Main_V1_1_schema.json` (`#/definitions/Schedule80IAC`); rules from `books/ITR-5/rules.json`; raw cells from `sources/ITR-5/utility/xl/worksheets/sheet35.xml`.

## The shape

Schedule 80IAC is a **single-undertaking block**, not a repeat. The schema defines `Schedule80IAC` as `{"type": "object"}` (not an array) with five leaf keys — so exactly **one** eligible start-up's details are captured, one figure each.

Title row `[C5]`/`[D5]` reads (verbatim):
- `[C5]` = **"Schedule 80IAC"**
- `[D5]` = **" Deduction in respect of eligible start-up [to be filled only if answer to A19(g) is 'Yes']"**

The schedule is a one-row grid: a column-header row `[C6]..[H6]`, a column-number row `[C7]..[H7]` (the printed labels "1".."6", not data), and a single data-entry row (row 8) holding the six columns. The "Sl. No." column `[C8]` carries the index "1" only; it maps to no schema key.

## The items

### Block `Schedule80IAC` (object — one undertaking)

| Col (sheet) | Header `[..6]` | Data cell | Type | Schema key | Rule |
|---|---|---|---|---|---|
| (1) Sl. No. `[C6]` | Sl. No. | `[C8]` = "1" | index | *(none — printed index)* | not built as a field |
| (2) `[D6]` | Date of incorporation of Startup | `[D8]` | date `YYYY-MM-DD` | `DateIncrpStrup` | required; date on or before 2025-04-01; incorporation must be after 01-Apr-2016 (rules.json n614) |
| (3) `[E6]` | Nature of Business | `[E8]` | string, maxLength 120 | `NatureOfBusiness` | required |
| (4) `[F6]` | Certificate number as obtained from Inter Ministerial Board of Certification | `[F8]` | string, maxLength 30 | `InterMnstBoardCertNum` | required |
| (5) `[G6]` | First AY in which deduction was claimed | `[G8]` | dropdown enum | `FstAYDeduction` | required; one of 2017-18 … 2026-27 |
| (6) `[H6]` | Amount of deduction claimed for current AY | `[H8]` | integer, 0 … 99999999999999 | `AmtDedCurAY` | required; ≥ 0 |

**Full leaf paths (verbatim schema keys):**
- `Schedule80IAC.DateIncrpStrup` — string, pattern `([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))`, "Date in format YYYY-MM-DD on or before 2025-04-01"
- `Schedule80IAC.NatureOfBusiness` — string, maxLength 120, nonEmptyString
- `Schedule80IAC.InterMnstBoardCertNum` — string, maxLength 30, nonEmptyString
- `Schedule80IAC.FstAYDeduction` — string, enum (10 values), nonEmptyString
- `Schedule80IAC.AmtDedCurAY` — integer, minimum 0, maximum 99999999999999

## The rules the sheet computes (with cell references)

The sheet carries **no formulas** (`--formulas` returns only the header rows 5–6; row 8 cells are plain user inputs). All rules are validators, not computed cells:

- **Data-validation constraints on the entry row** (`--dropdowns "80IAC"`): `[D8]` textLength ≤ 10 (source "10"), `[E8]` textLength ≤ 120 (source "120"), `[F8]` textLength ≤ 30 (source "30"), `[G8]` list dropdown (AY values), `[H8]` numeric ≥ 0 (source "0"). These mirror the schema maxLengths / minimum.
- **rules.json n613 (cat A):** *"Schedule 80IAC Schedule 80IAC, Amount of deduction claimed is more than zero but remaining fields are not filled up"* — if `AmtDedCurAY` > 0 then `DateIncrpStrup`, `NatureOfBusiness`, `InterMnstBoardCertNum`, `FstAYDeduction` are all mandatory.
- **rules.json n614 (cat A):** *"Schedule 80IAC Schedule 80IAC, Amount of deduction can be claimed by entities whose date of incorporation is after 01st April, 2016"* — `DateIncrpStrup` must be after 01-Apr-2016 (schema additionally caps it on/before 2025-04-01).
- **rules.json n615/n616 (cat A):** *"Schedule 80IAC Schedule 80IAC will be enabled only when the taxpayer has selected 'Yes' in the field 'Whether you are recognized as start up by DPIIT' in Part A general"* — the whole schedule is gated on Part A General `FilingStatus.StartUpDPIITFlag` = Yes (the sheet's own note calls this A19(g)).

### Cross-schedule rules (from rules.json)
- **n652 (cat A):** *"…Schedule VI-A Deduction u/s 80-IAC can be claimed by only LLP."* — 80-IAC claim allowed only for status LLP.
- **n661 (cat A):** *"Schedule VI-A Deduction u/s 80IAC in Sl.no.2f cannot be more than non speculative and non specified business income and non presumptive income in Schedule VIA"* — VI-A cap on the 80IAC deduction.
- **n667 (cat A):** *"Schedule VI-A Value claimed in 80-IAC field in Schedule VI A at Sl.No. 2d cannot be higher than the value in Schedule 80-IAC at Sl.No 6."* — VI-A 2d ≤ Schedule 80-IAC col (6) = `AmtDedCurAY`.
- **n668 (cat A):** *"Schedule VI-A Deduction u/s 80-IAC claimed in 'Schedule VI-A' at sl.no.2d but 'Schedule 80-IAC' is not filled!"* — if VI-A 2d is claimed, this schedule must be filled.
- **cat B n22:** *"VI-A Deduction u/s 80-I(7) or u/s 80-IA(7) or 80IAB or 80IAC or u/s 80- IB or u/s. 80 IC/80IE can be claimed only if Form 10CCB filed within due date"* — 80-IAC needs Form 10CCB.

## Dropdowns

`python tools/dump.py --form ITR-5 --dropdowns "80IAC"` — only cell `[G8]` (First AY in which deduction was claimed → `FstAYDeduction`) is a value-list dropdown. `[D8]`, `[E8]`, `[F8]`, `[H8]` are textLength / numeric constraints with `values: null` (no enumerated list).

`[G8]` `FstAYDeduction` — 11 source entries (10 real values; "(Select)" is the placeholder):
- (Select)
- 2017-18
- 2018-19
- 2019-20
- 2020-21
- 2021-22
- 2022-23
- 2023-24
- 2024-25
- 2025-26
- 2026-27

(Schema enum matches: 2017-18, 2018-19, 2019-20, 2020-21, 2021-22, 2022-23, 2023-24, 2024-25, 2025-26, 2026-27.)

## What repeats and what is one figure

- **Nothing repeats.** Schema `Schedule80IAC` is a single `object`, not an array — one eligible start-up only. The sheet's "Sl. No." column shows a single index "1".
- **One figure each:** `DateIncrpStrup`, `NatureOfBusiness`, `InterMnstBoardCertNum`, `FstAYDeduction`, `AmtDedCurAY` are each a single value.

## Mandatory

Schema `required` for `Schedule80IAC`: **`DateIncrpStrup`, `NatureOfBusiness`, `InterMnstBoardCertNum`, `FstAYDeduction`, `AmtDedCurAY`** — all five leaves required (when the block is present).

- The block itself is **conditional**: present/enabled only when Part A General `FilingStatus.StartUpDPIITFlag` = "Yes" (A19(g)), and filled only when an 80-IAC deduction is actually claimed.
- Practical mandate (n613): once `AmtDedCurAY` > 0, all other four keys become mandatory.

## Hidden rows — not built

None. Sheet `80IAC` has 0 hidden rows (`sheet_map.json`: `hidden_rows: 0`); no row is marked `H` in the dump. Nothing to exclude.

## What this means for the build

- Build **one** object `Schedule80IAC` with five inputs (date, text 120, text 30, AY dropdown, integer). No add-row / instance list — do not build a repeating grid despite the "Sl. No." column.
- Gate the block's visibility/enablement on `FilingStatus.StartUpDPIITFlag == "Yes"`.
- Wire the `[G8]` dropdown to the AY enum exactly (10 values, "(Select)" as placeholder), and enforce: date pattern + on/before 2025-04-01 + after 01-Apr-2016; NatureOfBusiness ≤ 120; InterMnstBoardCertNum ≤ 30; AmtDedCurAY ≥ 0.
- Enforce the "amount > 0 ⇒ all fields required" validator (n613) and the VI-A cross-links (VI-A 2d ≤ `AmtDedCurAY`; VI-A claim ⇒ schedule filled; LLP-only status; Form 10CCB requirement).
- No formulas to compute in this sheet — all values are direct user inputs; the figure `AmtDedCurAY` feeds Schedule VI-A (80-IAC, Sl. No. 2d).
