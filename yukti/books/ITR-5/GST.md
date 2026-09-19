# Schedule GST — Information regarding turnover / gross receipt reported for GST

Form: **ITR-5**, A.Y. 2026-27. Sheet: **GST**. Section: `other`. Block: **ScheduleGST**.
Source: `python tools/dump.py --form ITR-5 --sheet "GST"` (rows / --formulas / --dropdowns) and `--schema ScheduleGST` / `--leaves ScheduleGST`; rules from `books/ITR-5/rules.json`; cell↔key map from `books/ITR-5/sheet_map.json`; validator text from `sources/ITR-5/vba_text.txt`.

## The shape

Schedule GST is a **small repeating table** — one row per GSTIN — with exactly two data columns (GSTIN and its annual value of outward supplies) and no computed total. There is no aggregate figure; each GSTIN is reported separately.

The block title `[C3]` = **"Schedule GST"**; the header banner `[E3]` (verbatim): **"INFORMATION REGARDING TURNOVER/GROSS RECEIPT REPORTED FOR GST"**.

The column header row is `[D4]..[F4]`, three columns:

- Col (1) `[D4]` = **"Sl.No."** — auto serial (`D6 = D5+1`, `D7 = D6+1`, `D8 = D7+1`; D5 is the literal 1); not a schema field.
- Col (2) `[E4]` = **"GSTIN No(s)."** — text input → schema key `GSTINNo`.
- Col (3) `[F4]` = **"Annual value of outward supplies as per the GST return(s) filed"** — integer input → schema key `AmtTurnGrossRcptGSTIN`.

The data-entry rows are **5–8** (four template rows: `GST_GSTRno` = `GST!$E$5:$E$8`, `GST_GSTRAmount` = `GST!$F$5:$F$8`). Row **9** holds `Button_GST` at `[D9]` — the add/populate control, not a data field. Row **10** is the note `[C10]` "Note :" / `[D10]` **"Please furnish the information above for each GSTIN No. separately"**.

## The items

### Block `ScheduleGST` → `TurnoverGrsRcptForGSTIN[]` (array — one object per GSTIN)

| Sl. col (1) | Field | Type | Schema key | Rule |
|---|---|---|---|---|
| (2) `[E5:E8]` | GSTIN No(s). | string | `TurnoverGrsRcptForGSTIN[].GSTINNo` | 15 chars; format: first 2 numeric, next 5 alphabets, next 4 numeric, next 1 alphabet, then 3 alphanumeric (VBA); mandatory if amount filled (A779) |
| (3) `[F5:F8]` | Annual value of outward supplies as per the GST return(s) filed | integer ≥ 0 | `TurnoverGrsRcptForGSTIN[].AmtTurnGrossRcptGSTIN` | 0 … 99999999999999; mandatory if GSTIN filled (A780) |

**Full leaf paths (verbatim schema keys):**
- `TurnoverGrsRcptForGSTIN[]` (array)
- `TurnoverGrsRcptForGSTIN[].GSTINNo` (string, required within object)
- `TurnoverGrsRcptForGSTIN[].AmtTurnGrossRcptGSTIN` (integer, 0 … 99999999999999, required within object)

## The rules the sheet computes (with cell references)

- **Serial auto-increment** — `[D6]= D5+1`, `[D7]= D6+1`, `[D8]= D7+1`. Col (1) `Sl.No.` is generated, not input; D5 is the literal `1`.
- **No computed value.** There is no total/aggregate cell in the sheet — the amount column `F5:F8` is direct input, not a formula.
- **Paired-mandatory (rules.json A779 / A780):**
  - A779: *"Schedule GST In schedule GST if GSTIN No(s). is filled then \"Annual value of outward supplies as per the GST return(s) filed\" is mandatory."*
  - A780: *"Schedule GST In schedule GST if \"Annual value of outward supplies as per the GST return(s) filed\" is filled then \"GSTIN No(s).\" is mandatory."*
  - i.e. within a row, `GSTINNo` and `AmtTurnGrossRcptGSTIN` are all-or-nothing.
- **GSTIN validators (VBA, `vba_text.txt` ~line 22393):**
  - *"GSTIN format should be First 2 numeric, next 5 Alphabets, next 4 numeric , next 1 Alphabet, then next 3 alphanumeric. at Sr. No ."*
  - *"Invalid GSTIN. GSTIN should be in alphanumeric digits at Sr. No ."*
  - *"Amount of turnover/Gross receipt for the year corresponding to the GSTIN at Sr. No . is Mandatory"*
  - *"Please enter GSTIN No in schedule GST at Sr. No . is Mandatory"*
  - *"Please enter the Annual Value of Outward Supplies as per the GST return filed at Sr. No . is Mandatory"*
- **Auto-populate / prefill (VBA `vba_text.txt` ~line 28634):** `GST_GSTRno` / `GST_GSTRAmount` are prefilled from `form26as` → `scheduleBP.TurnoverGrsRcptForGSTIN` (nodes `gstinNo`, `amtTurnGrossRcptGSTIN`), with fallback to `lastFiledITR.TurnoverGrsRcptForGSTIN`. The `Button_GST` control (`[D9]`) drives the add-rows/import.

## Dropdowns

`python tools/dump.py --form ITR-5 --dropdowns "GST"`:

- **`E5:E8`** (col (2) GSTIN No(s).) — `source: "15"`, `values: null` → a **text-length constraint (max 15 characters)**, not a value list.
- **`F5:F8`** (col (3) Annual value of outward supplies) — `source: "0"`, `values: null` → a **numeric input floor (≥ 0)**, not a value list.

**No value-list dropdowns in this sheet.** Both validations are input constraints only.

## What repeats and what is one figure

- **Repeats:** `TurnoverGrsRcptForGSTIN[]` — one object per GSTIN (`GSTINNo` + `AmtTurnGrossRcptGSTIN`). The utility ships four template rows (5–8), but this is an add-row array driven by `Button_GST` (`[D9]`); the note at `[D10]` confirms "furnish the information above for each GSTIN No. separately". Build it as a repeating list, not a fixed 4.
- **One figure:** none — there is no computed total or single summary value for the schedule.

## Mandatory

- Schema `required` at block level: **None** (`== ScheduleGST == required: None`). The whole schedule is optional data.
- Within each array object, **both keys are required** (marked `*` in `--schema`): `GSTINNo` and `AmtTurnGrossRcptGSTIN`.
- Enforced pairing: if either of GSTIN / amount is entered in a row, the other becomes mandatory (rules.json A779 / A780; VBA messages above). Fill the schedule only when the assessee has GST turnover to report; when any row is present, both columns of that row must be filled.

## Hidden rows — not built

**None.** The sheet_map records `"hidden_rows": 0` for GST, and no row in the dump is flagged `H` (dump prints a space after each row number: r 3, r 4, r 6, r 7, r 8, r 10). Rows 5–8 (data), 9 (`Button_GST`) and 10 (note) are all visible.

## What this means for the build

- Build a small repeating table (add/remove rows via the equivalent of `Button_GST`), each row → one `TurnoverGrsRcptForGSTIN[]` object with two fields.
- Per row: one text input col (2) `GSTINNo` (max 15 chars; validate the 15-char GSTIN pattern — 2 numeric / 5 alpha / 4 numeric / 1 alpha / 3 alphanumeric), one integer amount col (3) `AmtTurnGrossRcptGSTIN` (≥ 0, max 99999999999999).
- Auto-serial col (1) `Sl.No.`; no computed column or total to emit.
- Validate the all-or-nothing pairing per row: GSTIN present ⇒ amount required (A779); amount present ⇒ GSTIN required (A780).
- Support prefill of both columns from `form26as` (scheduleBP `TurnoverGrsRcptForGSTIN`) with fallback to `lastFiledITR`.
- Emit `TurnoverGrsRcptForGSTIN` as an array only when at least one GSTIN is reported; omit the schedule entirely otherwise (block not required).
