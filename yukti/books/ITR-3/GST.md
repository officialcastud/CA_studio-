# Schedule GST — book (ITR-3, A.Y. 2026-27)

## The shape
Schedule GST captures **INFORMATION REGARDING TURNOVER/GROSS RECEIPT REPORTED FOR GST**: for each GSTIN the assessee holds, the GSTIN number and the annual value of outward supplies as declared in the GST return(s) filed. It is a pure data-entry table with no computation and no totalling on the sheet — one row per GSTIN, up to four rows visible (Sl.No 1–4). The schema stores it as a single repeating array with two leaves per row. There are no hidden rows and no enumerated dropdown lists.

## The items

### Block: ScheduleGST

| Sheet ref | Field label | Type | Schema key | Rule / notes |
|-----------|-------------|------|-----------|--------------|
| C3 / F3 | Schedule GST — INFORMATION REGARDING TURNOVER/GROSS RECEIPT REPORTED FOR GST | header | *(section heading; not a leaf)* | Title row for the schedule. |
| E4 | Sl.No | header/serial | *(row index; auto-numbered, not a leaf)* | Column header. Serials auto-increment down the rows (E6=E5+1, E7=E6+1, E8=E7+1). |
| F4 / F5:F8 | GSTIN No(s). | string | `TurnoverGrsRcptForGSTIN[].GSTINNo` | 15-character GSTIN, entered per row; upper-cased and format-validated (see rules). |
| G4 / G5:G8 | Annual value of outward supplies as per the GST return(s) filed | integer | `TurnoverGrsRcptForGSTIN[].AmtTurnGrossRcptGSTIN` | Amount of turnover / gross receipt for the year corresponding to the GSTIN; min 0, max 99999999999999. |
| C11 | Note:-Please furnish the information above for each GSTIN No. separately | note | *(instruction; not a leaf)* | One row must be furnished per GSTIN. |

Array wrapper: `TurnoverGrsRcptForGSTIN[]` — one element per data row (GSTIN + amount).

## The rules the sheet computes
- **E6 `= E5+1`**, **E7 `= E6+1`**, **E8 `= E7+1`** — Sl.No is auto-numbered: each row's serial is the previous row's serial plus one (starting from E5 = 1). Sl.No is a display index, not a filed value.
- No other on-sheet formulas: there is no total, no cross-sheet reference, and no cap computed on the sheet. The only value bound is the amount field's schema range (0 … 99999999999999).

### Validators from VBA (`sources/ITR-3/vba_text.txt`)
- Named ranges `GST_GSTRno` (GSTIN cells) and `GST_GSTRAmount` (amount cells); the GSTIN entry is force-upper-cased: `Target.value = UCase(Target.value)`.
- GSTIN length must be 15: *"If Len((UCase(Trim(Range(TargetGSTRNo))))) = 15 Then … If Not GST.CheckGSTR(...)"* — on failure: *"Invalid GSTIN.GSTIN format should be First 2 numeric, next 5 Alphabets, next 4 numeric , next 1 Alphabet, then next 3 alphanumeric.in schedule GST"*.
- *"Invaild GSTIN. GSTIN should be in alphanumeric digits at Sr. No in schedule GST"* — GSTIN must be alphanumeric.
- *"Please enter the Amount of turnover/Gross receipt for the year corresponding to the GSTIN at Sr. No in schedule GST"* — if a GSTIN is present, its amount must be filled (paired entry).

## Dropdowns
There are **no enumerated dropdown value lists** on this sheet.
- `F5:F8` (GSTIN No(s).) — data-validation source `15` (text length = 15, the GSTIN width); no value list (`values: null`).
- `G5:G8` (Annual value of outward supplies) — data-validation source `0` (numeric ≥ 0); no value list (`values: null`).

## What repeats and what is one figure
- **Repeats (array):** the whole table — `TurnoverGrsRcptForGSTIN[]`, one element per GSTIN, each carrying `GSTINNo` and `AmtTurnGrossRcptGSTIN`. Up to four rows are visible on the sheet (Sl.No 1–4).
- **One figure:** none — there is no single scalar total on this schedule.

## Mandatory
Schema `required` for `ScheduleGST` block: **None** (no required keys). The whole schedule is conditional: it is furnished only where the assessee has a GSTIN. Within a furnished row, VBA pairs the two fields — a GSTIN present demands its corresponding turnover/gross-receipt amount.

## Hidden rows — not built
**None.** No row in the GST sheet dump is flagged hidden (`H`). Rows 5, 9 and 10 carry no label/formula in the dump (blank data-entry / spacer cells), but none are marked hidden, so nothing is excluded on that basis.

## What this means for the build
- Render one repeatable table with columns **Sl.No** (auto-numbered, computed/untypeable), **GSTIN No(s).** and **Annual value of outward supplies as per the GST return(s) filed**; add-row control with the dustbin, backed by `TurnoverGrsRcptForGSTIN[]`.
- Sl.No is display-only (E = previous+1); do not export it — export only `GSTINNo` and `AmtTurnGrossRcptGSTIN` per element.
- Enforce GSTIN validation client-side: force upper-case; length exactly 15; format = 2 numeric + 5 alphabets + 4 numeric + 1 alphabet + 3 alphanumeric; reject non-alphanumeric.
- Enforce the paired rule: a row with a GSTIN must have its amount; clamp amount to 0 … 99999999999999.
- Emit the note verbatim near the table: *Please furnish the information above for each GSTIN No. separately.*
- No totals, no cross-schedule feed — this schedule computes nothing beyond its own row serials.
