# HOME — the ITR-5 utility landing / navigation page

Form: **ITR-5**, A.Y. 2026-27. Sheet: **HOME**. Section: `gen`. Blocks: **none** (`section_map.json` entry is `{"section":"gen","blocks":[]}` — HOME maps to no schema block, so there are no schema keys to carry).

Source: `python tools/dump.py --form ITR-5 --sheet "HOME"` (rows / `--formulas` / `--dropdowns "HOME"`). Quoted cell text is verbatim from that dump (cell text truncated at 100 chars by the dumper, same as the gate reads it).

## The shape

HOME is **not a data schedule** — it is the workbook's landing / navigation page. It is a single fixed table (no repeats, no computed income figures) that lists every sheet / schedule of the ITR-5 utility, one row per schedule, and lets the preparer switch a schedule on/off and select what to print, then "Apply". Clicking a schedule link navigates to that sheet.

- `[D3]` **Assessment Year 2026-27** — the A.Y. banner (fixed display, not a user-entered selector).
- Header row 8 (`[C8]`..`[H8]`) labels the table columns.
- Rows 9–57 are one navigation row per schedule (columns D/E/F describe it; G/H are the Y/N toggles).
- `[C59]` is the instructions legend.
- Column C carries a running Sl.No counter (`[C10]= C9+1`, `[C11]= C10+1`, … — see rules).

## The items

There are **no income / figure inputs** on this sheet. The only real inputs are the two Y/N toggle columns per schedule row:

| Cell | Column header | Type | Meaning |
|---|---|---|---|
| `[C8]` | **Sl.No** | display | running serial number of the schedule |
| `[D8]` | **Schedule Name** | display | the sheet's short/internal name (the link target) |
| `[E8]` | **Schedule for filing Income tax return** | display | the schedule's formal name |
| `[F8]` | **Description ("Click on applicable links to navigate to the respective sheet / schedule.")** | display | one-line description of the schedule |
| `[G8]` | **Select applicable sheets below by choosing Y/N and Click on Apply** | dropdown Y/N per row | switch the schedule on/off for this return |
| `[H8]` | **Select sheets to print and click apply** | dropdown Y/N per row | include the schedule in the print set |

The navigation rows (D = Schedule Name, E = Schedule for filing Income tax return, F = Description; every G/H default is `Y`):

| Sl | D (Schedule Name) | E (Schedule) | F (Description) |
|---|---|---|---|
| 1 | PART A - GENERAL | Personal Information, Filing Status & Audit Information | Details of Personal Information, Filing Status & Audit Information |
| 2 | PART A - GENERAL(2) | Partners/ Members Information, Nature of Business or Profession | Partners/ Members Information, Nature of business or profession, if more than one trade names please |
| 3 | Part A Gen_139(8A) | GENERAL INFORMATION _139(8A) | ITR U - INDIAN INCOME TAX UPDATED RETURN |
| 4 | BALANCE_SHEET | PartA-BS | Balance sheet as on 31st day of March, 2026 or date of dissolution. |
| 5 | MANUFACTURING ACCOUNT | Part A Manufacturing Account | Manufacturing Account for the financial year 2025-26 |
| 6 | TRADING ACCOUNT | Part A-Trading Account | Trading Account for the financial year 2025-26 |
| 7 | PROFIT_LOSS | PartA-P&L | Profit and Loss Account for the previous year 2025-26 |
| 8 | PART - A OI | PartA-OI | Other Information (optional in a case not liable for audit under section 44AB) |
| 9 | QUANTITATIVE_DETAILS | PartA-QD | Quantitative details (optional in a case not liable for audit under section 44AB) |
| 10 | HOUSE_PROPERTY | Schedule HP | Details of Income from House Property |
| 11 | BP | Schedule BP | Computation of income from business or profession |
| 12 | DPM_DOA | Schedule DPM, Schedule DOA | Depreciation on Plant and Machinery & on other assets |
| 13 | DEP_DCG | Schedule DEP, Schedule DCG | Summary of depreciation on assets & Deemed Capital Gains on sale of depreciable assets |
| 14 | ESR | Schedule ESR | Deduction under section 35 or 35CCC or 35CCD |
| 15 | CG | Schedule CG | Details of Income from Capital Gains |
| 16 | Schedule 112A | Schedule 112A | From sale of equity share in a company or unit of equity oriented fund or unit of a business trust o |
| 17 | Schedule 115AD(1)(iii)(p) | Schedule 115AD(1)(iii) proviso | For NON-RESIDENTS - From sale of equity share in a company or unit of equity oriented fund or unit o |
| 18 | VDA | Schedule VDA | Income from transfer of Virtual Digital Assets |
| 19 | OS | Schedule OS | Details of Income from Other Sources |
| 20 | CYLA-BFLA | Schedule CYLA, Schedule BFLA | Details of Income after Set off of Current years losses &Brought Forward Losses of earlier years |
| 21 | CFL | Schedule CFL | Details of Losses to be carried forward to future Years |
| 22 | Unabsorbed Depreciation | Schedule UD | Unabsorbed depreciation and allowance under section 35(4) |
| 23 | Schedule ICDS | Schedule ICDS | Effect of Income Computation Disclosure Standards on profit |
| 24 | 10AA | Schedule 10AA | Deduction under section 10AA |
| 25 | 80G | Schedule 80G | Details of donations entitled for deduction under section 80G |
| 26 | 80GGA | Schedule 80GGA | Details of donations for scientific research or rural development |
| 27 | 80GGC | Schedule 80GGC | Schedule 80GGC Details of contributions made to political parties |
| 28 | RA | Schedule RA | Details of donations to research associations etc. [deduction under sections 35(1)(ii) or 35(1)(iia) |
| 29 | 80 | Schedule 80-IA, Schedule 80-IB, Schedule 80-IC or Schedule 80-IE | Deductions under section 80-IA, 80-IB, 80-IC or 80-IE & Chapter VI-A |
| 30 | 80IAC | Schedule 80IAC | Deduction in respect of eligible start-up |
| 31 | 80LA | Schedule 80LA | Deduction in respect of offshore banking unit or IFSC |
| 32 | 80P | Schedule 80P | Deductions under section 80P |
| 33 | VI-A | Schedule VI-A | Deductions under Chapter VI-A |
| 34 | AMT | Schedule AMT | Computation of Alternate Minimum Tax payable under section 115JC |
| 35 | AMTC | Schedule AMTC | Computation of tax credit under section 115JD |
| 36 | SI | Schedule SI | Income chargeable to Income tax at special rates IB |
| 37 | IF | Schedule IF | Information regarding partnership firms in which you are partner |
| 38 | EI | Schedule EI | Details of Exempt Income |
| 39 | Schedule PTI | Schedule PTI | Pass Through Income details from business trust or investment fund as per section 115UA, 115UB |
| 40 | Schedule TPSA | Schedule TPSA | Details of Tax on secondary adjustments as per section 92CE(2A) |
| 41 | FSI | Schedule FSI | Details of Income from outside India and tax relief |
| 42 | TR_FA | Schedule TR, Schedule FA | Summary of tax relief claimed for taxes paid outside India & Schedule FA Details of foreign assets |
| 43 | GST | Schedule GST | Information regarding turnover/gross receipt reported for GST |
| 44 | PARTB - TI - TTI | PartB-TI, PartB-TTI & Verification | Computation of Total Income & Tax Liability on total income |
| 45 | Part B ATI | Part B ATI | Details of Part B ATI |
| 46 | IT | 15A | Details of payments of Advance Tax and Self-Assessment Tax |
| 47 | 115TD | Schedule 115TD | Accreted income under section 115TD |
| 48 | TDS | 15B, 15C | Details of Tax Deducted at Source & Tax Collected at Source |
| 49 | VERIFICATION | Schedule Verification | Schedule Verification |

Row 59 legend `[C59]`: **Instructions: 1. Green cells are for data entry 2. Red labels indicate Mandatory fields 3. Do not us[e]** (text truncated by the dumper at 100 chars).

## The rules the sheet computes

- **Sl.No auto-increment** — column C is a running counter: `[C10]= C9+1`, `[C11]= C10+1`, `[C12]= C11+1`, `[C13]= C12+1`, `[C26]= C25+1`, `[C27]= C26+1`, `[C50]= C49+1`, `[C51]= C50+1` (the same `=Cn+1` pattern runs down the column). No income or tax figure is computed on this sheet.
- No `MIN`/`MAX`, cap, or conditional formula is present — HOME carries no data rule.

## Dropdowns

One data validation, applied to the two toggle columns:

- **`G54:H56 G12:H51`** — source `"Y,N"` → values **Y**, **N**.

(Column G = "Select applicable sheets" on/off; Column H = "Select sheets to print". Note the gate skips these because each value is a single character.)

## What repeats and what is one figure

- **Repeats:** the navigation row (Sl.No / Schedule Name / Schedule / Description / Y-N select / Y-N print) — one per schedule, rows 9–57.
- **One figure:** none. `[D3]` Assessment Year 2026-27 is a single fixed banner; there are no monetary one-off inputs.

## Mandatory

**None from schema** — HOME has no schema block (`blocks: []`), so there are no `required` keys. The Y/N toggles are UI switches, not filed fields.

## Hidden rows — not built

**None.** No content row on HOME is hidden (no row in the dump is marked `H`; the `[H9]`..`[H57]` cells are column-H "print" toggles, not hidden-row flags). Column L and columns beyond are hidden in the worksheet, and rows 60–65543 are empty blank rows the dumper omits — none carry a label to build.

## What this means for the build

HOME is a **navigation / landing page, not a data schedule**. It maps to no schema block and **exports nothing** to the return JSON. In the built form it is realised as the workbook's sheet index / launcher: a list of the schedules with links, plus per-schedule "include" and "print" Y/N switches that drive which sheets are shown and printed — no data-`p` fields, no writers, no readers. Nothing on this sheet flows to `PartB-TI`/`TTI` or any schedule.
