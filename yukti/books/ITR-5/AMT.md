# Schedule AMT — Alternate Minimum Tax payable under section 115JC

Form: **ITR-5**, A.Y. 2026-27. Sheet: **AMT** (`sheet39.xml`, 15 rows, 0 hidden). Section: `amt`. Block: **ScheduleAMT**.
Source: `python tools/dump.py --form ITR-5 --sheet "AMT"` (rows / `--formulas` / `--dropdowns`) and `--schema ScheduleAMT` / `--leaves ScheduleAMT`; full cell text/formulas read from `sources/ITR-5/utility/xl/worksheets/sheet39.xml`; named ranges from `sources/ITR-5/utility/xl/workbook.xml` and `books/ITR-5/sheet_map.json`; rules from `books/ITR-5/rules.json`; block mapping from `books/ITR-5/blocks.json` and `books/ITR-5/section_map.json`.

## The shape

Schedule AMT is a **single-occurrence computation block** (not a grid) that derives the Alternate Minimum Tax payable u/s 115JC. Title `[C3]` = **"Schedule AMT"**; `[F3]` (verbatim) = **"Computation of Alternate Minimum Tax payable under section 115JC"**; header `[C4]` = **"ALTERNATE MINIMUM TAX"**.

The visible schedule occupies **rows 4–13**, columns C–J:
- **Row 1 (Sl. 1)** `[E4]` — Total income (from Part B-TI), auto-filled `[J4]`.
- **Row 2 (Sl. 2)** `[E5]` — the three add-backs u/s 115JC(2): **2a** Chapter VI-A Part C (`[H6]`), **2b** section 10AA (`[H7]`), **2c** section 35AD net of depreciation (`[H8]`, input), and **2d** total (`[H9]`).
- **Row 3 (Sl. 3)** `[E10]` — Adjusted Total Income u/s 115JC(1) = 1 + 2d (`[J10]`); split into **3a** IFSC units (`[J11]`, input) and **3b** other units (`[J12]`).
- **Row 4 (Sl. 4)** `[E13]` — Tax payable u/s 115JC (`[J13]`).

Columns **M–R (rows 1–13) are hidden helper cells** that bracket the adjusted income by surcharge slabs (50L / 1cr / 2cr / 5cr / 10cr) and hold the rate flags — they are computation scaffolding, not fields (see "What this means for the build").

## The items

### Block `ScheduleAMT`

Schema keys are verbatim from `--leaves ScheduleAMT`. The three add-backs live in the array `AdjustmentSec115JC[]` (single item, index 0).

| Sl. | Field `[E../F..]` (verbatim) | Cell | Type | Schema key | Rule / source |
|---|---|---|---|---|---|
| 1 | "Total Income as per item 13 of PART-B-TI" | `J4` | computed | `TotalIncItem13` | = Part B-TI sl.13 total income (A677) |
| 2 | "Adjustment as per section 115JC(2)" | — | (header) | `AdjustmentSec115JC[]` | array, one item |
| 2a | "Deduction Claimed under any section included in Chapter VI-A under the heading "C.—Deductions in respect of certain incomes"" | `H6` | computed | `AdjustmentSec115JC[0].DeductClaimSec6A` | Ch VI-A Part C add-back (A678) |
| 2b | "Deduction Claimed u/s 10AA" | `H7` | computed | `AdjustmentSec115JC[0].DeductClaimSec10AA` | = 10AA deduction (A679) |
| 2c | "Deduction claimed u/s 35AD as reduced by the amount of depreciation on assets on which such deduction is claimed" | `H8` | **input** | `AdjustmentSec115JC[0].DeductClaimSec35AD` | user entry (35AD less depreciation) |
| 2d | "Total Adjustment (2a+ 2b+2c)" | `H9` | computed | `AdjustmentSec115JC[0].Total` | = 2a+2b+2c (A680) |
| 3 | "Adjusted Total Income under section 115JC(1) (1+2d)" | `J10` | computed | `AdjustedUnderSec115JC` | = sl.1 + sl.2d (A681); feeds Part B-TI sl.18 (A806) |
| 3a | "Adjusted Total Income u/s 115JC from units located in IFSC, if any" | `J11` | **input** | `AdjustedUnderSec115JCIFSC` | ≤ 3; taxed at 9% |
| 3b | "Adjusted Total Income u/s 115JC from other Units (3-3a)" | `J12` | computed | `AdjustedUnderSec115JCOther` | = 3 − 3a (A685); taxed at 18.5% / 15% |
| 4 | "Tax payable under section 115JC [9% of (3a) + 18.5% or 15% of (3b) as applicable]" | `J13` | computed | `TaxPayableUnderSec115JC` | = AMT; feeds Part B-TTI sl.1a (A700) |

**Full leaf paths (verbatim schema keys):**
- `TotalIncItem13` — integer, `maximum 99999999999999` (required)
- `AdjustmentSec115JC[]` — array (one occurrence)
- `AdjustmentSec115JC[].DeductClaimSec6A` — integer, `minimum 0`, `maximum 99999999999999` (required)
- `AdjustmentSec115JC[].DeductClaimSec10AA` — integer, `minimum 0`, `maximum 99999999999999` (required)
- `AdjustmentSec115JC[].DeductClaimSec35AD` — integer, `minimum 0`, `maximum 99999999999999` (required)
- `AdjustmentSec115JC[].Total` — integer, `minimum 0`, `maximum 99999999999999` (required)
- `AdjustedUnderSec115JC` — integer, `minimum 0`, `maximum 99999999999999` (required)
- `AdjustedUnderSec115JCIFSC` — integer, `maximum 99999999999999` (required)
- `AdjustedUnderSec115JCOther` — integer, `minimum -99999999999999`, `maximum 99999999999999` (required — may be negative)
- `TaxPayableUnderSec115JC` — integer, `minimum 0`, `maximum 99999999999999` (required)

**Excel named ranges** (`workbook.xml`): `AMT.TotalIncItem11` = `AMT!$J$4` (sl.1); `AMT.DeductClaimSec6A` = `AMT!$H$6`; `AMT.DeductClaimSec10AA` = `AMT!$H$7`; `AMT.DeductClaimSec35AD` = `AMT!$H$8`; `AMT.Total` = `AMT!$H$9`; `AMT.AdjustedUnderSec115JC` = `AMT!$J$10`; `AMT.AdjustedUnderSec115JC3a` = `AMT!$J$11`; `AMT.AdjustedUnderSec115JC3b` = `AMT!$J$12`. (The utility's named ranges use `...3a/3b/Item11`; the exported JSON keys are `...IFSC/Other/Item13` as above.)

## The rules the sheet computes (with cell references)

- **New-regime gate (whole schedule zeroed)** — every computed cell opens with `IF(bacValue=1,0,…)`. `bacValue` = `DB!$CP$3` (opted for new regime u/s 115BAC). When `bacValue=1`, sl.1, 2a, 2b, 2d, 3, 4 all resolve to **0** — AMT does not apply under the new regime.
- **Sl.1 Total income** — `[J4]= IF(bacValue=1,0,IF(Amt_condn=1,sheet12.AdjustedPLFrmSpecifiedBus,Sheet8b.TotalIncome))`. Normally the Part B-TI total income; when `Amt_condn=1` (specified-business loss condition, see below) it takes the adjusted P&L from specified business instead — this is how **Total Income at Schedule AMT can be negative** (rules.json **B27**).
- **2a Chapter VI-A Part C** — `[H6]= IF(bacValue=1,0,MAX(0,MIN(Sheet8b.GrossTotalIncome-Sheet8b.IncChargeableTaxSplRates-Sheet8b.ProfGainSpecifiedBus, scvia.TotPartCchapterVIA_Calc-scvia.Section80P_Calc)))`. The Part C "C.—Deductions in respect of certain incomes" total **less 80P**, capped at GTI net of special-rate income and specified-business profit. (A678: 2a = sum of Sch VIA sl.'d'–'m' subject to sl.9−10 of Part B-TI.)
- **2b section 10AA** — `[H7]= IF(bacValue=1,0,MIN(busipofincl.IncOfCurYrAfterSetOffBFLosses2, Sheet8b.DeductionsUnder10Aor10AA))` = the 10AA deduction (A679, = Part B-TI sl.12a).
- **2c section 35AD** — `[H8]` is a **manual input** (35AD deduction as reduced by depreciation on those assets); no formula.
- **2d Total Adjustment** — `[H9]= IF(bacValue=1,0, AMT.DeductClaimSec6A+AMT.DeductClaimSec10AA+AMT.DeductClaimSec35AD)` = 2a+2b+2c (A680).
- **Sl.3 Adjusted Total Income** — `[J10]= IF(bacValue=1,0, MAX(0,(AMT.TotalIncItem11+AMT.Total)))` = sl.1 + sl.2d (A681). If sl.3 = 0 then 3a and 3b must both be 0 (A686).
- **3b other units** — `[J12]= AMT.AdjustedUnderSec115JC - AMT.AdjustedUnderSec115JC3a` = 3 − 3a (A685). 3a (`J11`) is the **input** for IFSC units.
- **Sl.4 Tax payable (AMT rate)** — `[J13]= IF(bacValue=1,0, IF(FormulaOfAMT="N", IF(AMT.Total<=0,0, IF(AMT.AdjustedUnderSec115JC<=2000000,0, MAX(0,ROUND(AMT.AdjustedUnderSec115JC3aNew + AMTSerial3b15or18,0)))), IF(AMT.Total<=0,0, MAX(0,ROUND(AMT.AdjustedUnderSec115JC3aNew + AMTSerial3b15or18,0)))))`.
  - **`FormulaOfAMT`** = `O13` = `IF(MID(sheet1.MainStatus,1,1)="1" OR "2","Y","N")`. **"N" (AOP/BOI/AJP)** applies the **Rs. 20 lakh threshold** (`AMT.AdjustedUnderSec115JC<=2000000 ⇒ 0`, per A682/A683); **"Y" (Firm/LLP/company statuses 1–2)** has no threshold.
  - **IFSC leg (3a) = 9%** — `AMT.AdjustedUnderSec115JC3aNew` = `N10` = `0.09*(…3a…)`.
  - **Other leg (3b) = 18.5% or 15%** — `AMTSerial3b15or18` = `Q12` = `IF(AsseesseeSubStatusFlag=2, AMT.AdjustedUnderSec115JC3bNew, AMT.AdjustedUnderSec115JC3b15New)`; `N11`=`0.185*(…3b…)`, `N12`=`0.15*(…3b…)`.
  - **`AsseesseeSubStatusFlag`** = `P12` = `1` for co-operative societies (SubStatus 1a/1b/1c/3), else `2`. So **co-operative societies pay 15%** on 3b; all others **18.5%**.
- **Specified-business condition** — `Amt_condn` = `O3` = `AND(Condn_1..Condn_6)`; the Condn 1–5 tests (`Q3/S3/U3/W3`) check whether the whole total income arises from a specified-business loss (net P&L from specified business = profit before tax, adjusted specified-business P&L < 0, 35AD deduction > 0, etc.). Only then may sl.1 / sl.3 go negative (B27).
- **Surcharge helper (hidden cols M–R)** — cells like `O1/O4/O6/O8` and the `_50L/_1cr/_2cr/_5cr/_10cr` named ranges recompute the tax at each surcharge slab so surcharge on AMT can be levied. Rules.json **B23**: *"Surcharge on AMT can be claimed only if AMT income at sl.no.3 in Schedule AMT is > 1Cr or 50L as the case may be."*

### AMT-vs-normal comparison (cross-schedule)

The comparison of AMT (sl.4) against tax under the normal provisions is done in **Part B-TTI / Schedule AMTC**, not on this sheet:
- **A700**: Part B-TTI sl.1a "Tax payable on deemed total income under section 115JC" = **sl.4 of Schedule AMT**.
- **A684/A695**: Part B-TTI tax payable on deemed total income u/s 115JC = sl.4 of Schedule AMT.
- **A806**: Part B-TI sl.18 "Deemed total income under section 115JC" = **sl.3 of AMT**.
- When AMT liability exceeds normal tax, the excess (AMT − normal) is credit u/s **115JD**, carried in **Schedule AMTC** (Part B-TTI sl.4 = AMTC sl.5, applicable only when Part B-TTI 2g > 1d).
- **Form 29C**: *"If net tax liability is as per AMT (Sl.No.3 = Sl.No.1d), then Form 29C is required to be filed"* and *"A General Assessee liable to pay AMT u/s 115JC is required to file Form 29C"* (rules.json cat-A/B).

## Dropdowns

`python tools/dump.py --form ITR-5 --dropdowns "AMT"` returns **no value-list dropdowns**. Every entry (`J4`, `H6`, `H7`, `H9`, `J10 J12`, `J13`, plus J-column cells) has `"values": null` — these are numeric data-validation bounds only (`source: "-99999999999999"` for the total-income cell, `source: "0"` for the non-negative cells), not selectable lists. **Nothing to populate as a dropdown.**

## What repeats and what is one figure

- **One figure each:** every item on this sheet is a single value — sl.1, 2a, 2b, 2c, 2d, 3, 3a, 3b, 4. There is no repeating grid.
- **`AdjustmentSec115JC[]` is an array in the schema but has exactly one occurrence** (the single 2a/2b/2c/2d row). Emit one array item at index 0.
- The regime flag `bacValue`, `FormulaOfAMT`, `AsseesseeSubStatusFlag`, `Amt_condn` are single computed flags.

## Mandatory

- Block `ScheduleAMT` is **`required: false`** at block level (`blocks.json`) — the schedule is conditional (built only when AMT applies, i.e. old regime with 115JC(2) adjustments).
- **When present, all nine leaves are required** (`--schema ScheduleAMT` required list): `TotalIncItem13`, `AdjustedUnderSec115JC`, `AdjustedUnderSec115JCIFSC`, `AdjustedUnderSec115JCOther`, `TaxPayableUnderSec115JC`, and inside each `AdjustmentSec115JC[]` item: `DeductClaimSec6A`, `DeductClaimSec10AA`, `DeductClaimSec35AD`, `Total`.
- `AdjustedUnderSec115JCOther` allows negatives (`minimum -99999999999999`); the rest are `minimum 0`.

## Hidden rows — not built

**None.** `sheet_map.json` reports `hidden_rows: 0` for AMT, and the row dump flags no `H` rows. (The hidden **columns** M–R carrying surcharge-slab helper formulas are computation scaffolding, not schedule rows — do not surface them as fields.)

## What this means for the build

- Build a **single computation panel** (not a grid): show sl.1, 2a–2d, 3/3a/3b, 4. Only **two cells are user inputs — 2c (`H8`, 35AD net of depreciation) and 3a (`J11`, IFSC units)**; everything else is auto-computed and read-only.
- Auto-fill sl.1 (`J4`) from Part B-TI total income (or specified-business adjusted P&L when `Amt_condn`), 2a (`H6`) from Sch VIA Part C less 80P, 2b (`H7`) from the 10AA deduction, 2d (`H9`) = 2a+2b+2c, sl.3 (`J10`) = 1+2d (floored at 0), 3b (`J12`) = 3−3a.
- Emit the array `AdjustmentSec115JC[]` with a **single item** holding `DeductClaimSec6A`/`DeductClaimSec10AA`/`DeductClaimSec35AD`/`Total`.
- **Wire the new-regime gate:** when `bacValue=1` (115BAC opted, not opted out) zero the entire schedule and skip it.
- **Rate engine for sl.4 (`J13`):** IFSC leg (3a) at **9%**; other leg (3b) at **18.5%**, or **15% for co-operative societies** (`AsseesseeSubStatusFlag=1`). Apply the **Rs. 20 lakh floor** only for AOP/BOI/AJP (`FormulaOfAMT="N"`); Firms/LLPs (statuses 1–2) have no floor. Result is `MAX(0,ROUND(9%·3a + rate·3b))`.
- Enforce validations: sl.1 = Part B-TI sl.13 (A677); 2d = 2a+2b+2c (A680); sl.3 = 1+2d (A681) and = 3−3a rearranged, i.e. 3b = 3−3a (A685); if sl.3 = 0 then 3a = 3b = 0 (A686); sl.4 = 9%·3a when any IFSC unit and > 0 (A676/A677). Total income may be negative only from a specified-business loss (B27).
- Cross-wire outputs: sl.3 → Part B-TI sl.18 (A806); sl.4 → Part B-TTI sl.1a (A700); feed Schedule AMTC / 115JD credit when AMT > normal tax; prompt **Form 29C** when net liability is per AMT.
- Surcharge on AMT is allowed only when sl.3 > 50L / 1Cr (B23) — carry the slab helper logic into the tax engine.
- No dropdowns to render on this sheet; no hidden rows to build.
