# Schedule VDA — Income from transfer of Virtual Digital Assets (s.115BBH)

Form: **ITR-5**, A.Y. 2026-27. Sheet: **VDA**. Section: `cg`. Block: **ScheduleVDA**.
Source: `python tools/dump.py --form ITR-5 --sheet "VDA"` (rows / --formulas / --dropdowns) and `--schema ScheduleVDA` / `--leaves ScheduleVDA`; rules from `books/ITR-5/rules.json`; enum map from `books/ITR-5/enums.json`; validator text from `sources/ITR-5/vba_text.txt`; cell↔key map from `books/ITR-5/sheet_map.json`.

## The shape

Schedule VDA is a **repeating transaction table** — one row per VDA transfer (every ‘transfer’ is a transaction) — followed by two computed total rows.

The block title `[B3]` = **"Schedule VDA"**; the header banner `[E3]` (verbatim): **"Income from transfer of Virtual Digital Assets (Note: Details of every transaction are to be filled, wherein every ‘transfer’ is a transaction)"**.

The column header row `[C4]..[I4]` defines seven columns (1)–(7). The data-entry rows are **5–9** (five template rows in the utility; a real add-row list). Rows **11** and **12** are the computed totals A and B. (Row 10 holds `Button_VDA` at `[C10]` — the add/populate control; not a data field.)

Seven columns (the sheet numbers them (1)–(7); col (5) is the Cost column, so the header calls Consideration "(6)" and Income "(7)"):

- Col (1) `[C4]` = **"Serial number (1)"** — auto serial (`C6 = C5+1` …); not a schema field.
- Col (2) `[D4]` = **"Date of Acquisition (2)"** — input date → schema key `DateofAcquisition`.
- Col (3) `[E4]` = **"Date of Transfer (3)"** — input date → schema key `DateofTransfer`.
- Col (4) `[F4]` = **"Head under which income to be taxed (Business/Capital Gain) (4)"** — dropdown → schema key `HeadUndIncTaxed`.
- Col (5) `[G4]` = **"Cost of Acquisition (In case of gift; a. Enter the amount on which tax is paid u/s 56(2)(x) if any b. In any other case cost to previous owner) (5)"** — input amount → schema key `AcquisitionCost`.
- Col (6) `[H4]` = **"Consideration Received (6)"** — input amount → schema key `ConsidReceived`.
- Col (7) `[I4]` = **"Income from transfer of Virtual Digital Assets (enter nil in case of loss) (Col. 6 – Col. 5) (7)"** — computed → schema key `IncomeFromVDA`.

## The items

### Block `ScheduleVDA` → `ScheduleVDADtls[]` (array — one object per transaction, required)

| Sl. col (1) | Field | Type | Schema key | Rule |
|---|---|---|---|---|
| (2) `[D5:D9]` | Date of Acquisition | date (YYYY-MM-DD) | `ScheduleVDADtls[].DateofAcquisition` | cannot be after 31 Mar of FY (A470) |
| (3) `[E5:E9]` | Date of Transfer | date (YYYY-MM-DD) | `ScheduleVDADtls[].DateofTransfer` | cannot be after 31 Mar of FY (A470); ≥ Date of Acquisition (VBA) |
| (4) `[F5:F9]` | Head under which income to be taxed | dropdown | `ScheduleVDADtls[].HeadUndIncTaxed` | enum `BI`/`CG` (display "Business Income"/"Capital Gain") |
| (5) `[G5:G9]` | Cost of Acquisition | integer ≥ 0 | `ScheduleVDADtls[].AcquisitionCost` | max 99999999999999 |
| (6) `[H5:H9]` | Consideration Received | integer ≥ 0 | `ScheduleVDADtls[].ConsidReceived` | max 99999999999999 |
| (7) `[I5:I9]` | Income from transfer of Virtual Digital Assets | integer ≥ 0 (computed) | `ScheduleVDADtls[].IncomeFromVDA` | `= MAX(0, col6 − col5)` (A467) |

### Total rows (one figure each — not part of the array)

| Sl. | Label `[D..]` | Type | Schema key | Cell |
|---|---|---|---|---|
| A. `[C11]` | Total (Sum of all Positive Incomes of Business Income in Col. 7) | integer ≥ 0 (computed) | `TotIncBusiness` | `[J11]` |
| B. `[C12]` | Total (Sum of all Positive Incomes of Capital Gain in Col. 7) | integer ≥ 0 (computed) | `TotIncCapGain` | `[J12]` |

**Full leaf paths (verbatim schema keys):**
- `ScheduleVDADtls[].DateofAcquisition` (string, YYYY-MM-DD)
- `ScheduleVDADtls[].DateofTransfer` (string, YYYY-MM-DD)
- `ScheduleVDADtls[].HeadUndIncTaxed` (string, enum: `BI`, `CG`)
- `ScheduleVDADtls[].AcquisitionCost` (integer, 0 … 99999999999999)
- `ScheduleVDADtls[].ConsidReceived` (integer, 0 … 99999999999999)
- `ScheduleVDADtls[].IncomeFromVDA` (integer, 0 … 99999999999999)
- `TotIncBusiness` (integer, 0 … 99999999999999)
- `TotIncCapGain` (integer, 0 … 99999999999999)

## The rules the sheet computes (with cell references)

- **Col (7) per row = MAX(0, col(6) − col(5))** — `[I5]= MAX(0,H5-G5)` (pattern repeats I5:I9). i.e. `IncomeFromVDA = max(0, ConsidReceived − AcquisitionCost)` — "enter nil in case of loss". Matches rules.json **A467**: *"In Schedule VDA, value at Sl. No. 7 should be equal to Sl. No. 6 - Sl. No. 5"*.
- **Serial auto-increment** — `[C6]= C5+1`, `[C7]= C6+1`, `[C8]= C7+1`, `[C9]= C8+1`. Col (1) is generated, not input.
- **Total A (Business)** — `[J11]= SUMIF(VDA_Head_Income,"Business Income",VDA_Income_from_transfer)` → `TotIncBusiness`. Matches rules.json **A468/A469**: *"value at Sl. No. A 'Total (Sum of all Positive Incomes of Business Income in Col. 7) should be equal to sum of col. 7 if head of income is selected as Business income in col. 4"*. (`VDA_Head_Income` = `VDA!$F$5:$F$9`, `VDA_Income_from_transfer` = `VDA!$I$5:$I$9`.)
- **Total B (Capital Gain)** — `[J12]= SUMIF(VDA_Head_Income,"Capital Gain",VDA_Income_from_transfer)` → `TotIncCapGain`. Matches rules.json **A469/A470**: *"value at Sl. No. B 'Total (Sum of all Positive Incomes of Capital Gain in Col. 7) should be equal to sum of col. 7 if head of income is selected as Capital Gain in col. 4"*.
- **Date bound** — rules.json **A470**: *"In schedule VDA, Date of Acquisition or Date of transfer cannot be after 31st March of financial year."* VBA (`vba_text.txt`) also enforces *"Date of Transfer cannot be before Date of Acquisition"* and a valid dd/mm/yyyy format.

### Cross-schedule rules (from rules.json)

- **A417 / CG** (rules.json ~line 2065): *"In Schedule CG, Sl. No. C2 Income from transfer of Virtual Digital Assets should be equal to Sl. No. B of Schedule VDA"* — i.e. CG C2 = `TotIncCapGain`. (`CG.IncomeVDA` = `CG!$S$346` in sheet_map.)
- **BP** (rules.json ~line 1335): Schedule BP Sl. No. 3f *"u/s 115BBH (net of Cost of acquisition, if any)"* should match Sl. No. A "Total" of Schedule VDA — i.e. BP 3f = `TotIncBusiness`.
- **SI** (rules.json ~line 3560): Schedule SI special income u/s 115BBH (business-head portion) should match BP Sl. No. 3f.
- **Part B-TI** (rules.json ~line 4070): "Capital gain chargeable @ 30% u/s 115BBH" in Part B-TI ties back to Schedule VDA Sl. No. B.
- **TDS/194S** (rules.json ~line 4560): gross receipts on which TDS u/s 194S was deducted must not exceed total income from VDA in the return.

## Dropdowns

`python tools/dump.py --form ITR-5 --dropdowns "VDA"`:

- **`F5:F9`** (col (4) Head under which income to be taxed) — source `"(Select),Business Income,Capital Gain"`, values:
  - `(Select)`
  - `Business Income`  → schema enum `BI`
  - `Capital Gain`  → schema enum `CG`
- All other listed validations are numeric/date input constraints, not value lists: `D5:D9` and `E5:E9` (date, `source: "10"` = date type), `G5:G9`, `H5:H9`, `J5:K9`, `J10:K10`, `J11:L11` (`source: "0"`, values null) and `J12:L12` (`source: "-99999999999999"`, values null — a signed-amount floor). **No further value-list dropdowns.**

## What repeats and what is one figure

- **Repeats:** `ScheduleVDADtls[]` — one object per VDA transaction. The utility ships five template rows (5–9), but this is an add-row array driven by `Button_VDA` (`[C10]`); build it as an unbounded repeating list, not a fixed 5.
- **One figure each:** `TotIncBusiness` (`[J11]`) and `TotIncCapGain` (`[J12]`) — the two computed totals, one value each.

## Mandatory

- Schema `required` at block level: **`ScheduleVDADtls`**, **`TotIncBusiness`**, **`TotIncCapGain`**.
- Within each array object, **all six keys are required**: `DateofAcquisition`, `DateofTransfer`, `HeadUndIncTaxed`, `AcquisitionCost`, `ConsidReceived`, `IncomeFromVDA`.
- In practice the schedule is optional data (fill only when a VDA transfer occurred); when any row is present, every column in that row must be filled and the two totals emitted.

## Hidden rows — not built

**None.** No row in the VDA dump is flagged `H` (dump prints a space, not `H`, after every row number: r 3, r 4, r 11, r 12). Rows 5–9 (data), 10 (`Button_VDA`), 11–12 (totals) are all visible.

## What this means for the build

- Build a repeating transaction table (add/remove rows via the equivalent of `Button_VDA`), each row → one `ScheduleVDADtls[]` object.
- Per row: two date inputs (col 2 `DateofAcquisition`, col 3 `DateofTransfer`, both YYYY-MM-DD), one dropdown (col 4 `HeadUndIncTaxed` → `BI`/`CG`, shown as "Business Income"/"Capital Gain", default "(Select)"), two integer amounts (col 5 `AcquisitionCost`, col 6 `ConsidReceived`, both ≥ 0).
- Auto-serial col (1); compute col (7) `IncomeFromVDA = MAX(0, ConsidReceived − AcquisitionCost)` per row (nil on loss).
- Compute `TotIncBusiness = SUMIF(head=Business Income, IncomeFromVDA)` and `TotIncCapGain = SUMIF(head=Capital Gain, IncomeFromVDA)`.
- Validate: neither date after 31 Mar of the FY; Date of Transfer ≥ Date of Acquisition; valid date format.
- Wire cross-schedule: `TotIncCapGain` → Schedule CG C2 (`CG.IncomeVDA`, A417); `TotIncBusiness` → Schedule BP Sl. No. 3f (115BBH) → Schedule SI (115BBH business) → Part B-TI @ 30%.
