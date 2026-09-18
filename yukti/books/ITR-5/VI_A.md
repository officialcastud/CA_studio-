# Schedule VI-A — Deductions under Chapter VI-A (Part B & Part C)

Form: **ITR-5**, A.Y. 2026-27. Sheet: **VI-A** (gate-sanitised book file `VI_A.md`). Section: `ded`. Block: **ScheduleVIA**.
Source: `python tools/dump.py --form ITR-5 --sheet "VI-A"` (rows / `--formulas` / `--dropdowns`) and `--schema ScheduleVIA` / `--leaves ScheduleVIA`; rules from `books/ITR-5/rules.json`; new-regime / validator text from `sources/ITR-5/vba_text.txt` and the CBDT validation-rules PDF. All quotes below are from those sources, not memory.

## The shape

Schedule VI-A is a **single fixed summary matrix** — one row per deduction section, **no repeats**. It is the roll-up of the individual deduction sub-schedules (80G, 80GGA, 80GGC, 80-IA, 80-IB, 80-IC/IE, 80-IAC, 80-LA, 80P, etc.); most amount cells are **auto-populated** from those schedules, not keyed here. Header `[C3]` = **"Schedule VI-A"**, `[E3]` = **"Deductions under Chapter VI-A"**.

The matrix has two amount columns per section row:
- **Column I** — the taxpayer/eligible figure carried from the sub-schedule → schema object **`UsrDeductUndChapVIA`** (the "user-enterable"/claimed amount).
- **Column K** — `[K4]` header **"System Calculated"** → schema object **`DeductUndChapVIA`** (the amount the utility actually allows after applying caps, the GTI clamp, and the new-regime shut-offs).

Two lettered blocks of sections:
- **`[D4]` "1. Part B- Deduction in respect of certain payments"** — rows a–c (5–7), total row 8.
- **`[D9]` "2. Part C- Deduction in respect of certain incomes"** — rows d–n (10–20), total row 21.
- **`[E22]` "Total Deductions under Chapter VI-A (1 + 2 )"** — grand total, row 22.

Two control/flag cells drive the shut-offs (both are label+formula, not inputs):
- `[N3]` **"SectionCheck"**, `[O3]= IF(MID(sheet1.ReturnFileSec1,1,6)="139(4)",TRUE,FALSE)` — belated-return (139(4)) flag; several Part C deductions are barred on a belated return (s.80AC).
- `[S3]` **"GTI"**, `[T3]= Sheet8b.GrossTotalIncome` — the Gross-Total-Income figure used by the clamps.

## The items

Column I = claimed → `UsrDeductUndChapVIA.<key>`. Column K = allowed → `DeductUndChapVIA.<key>`. Every leaf is `[integer]`, `minimum 0`, `maximum 99999999999999`.

### Part B — "1. Part B- Deduction in respect of certain payments" (rows 5–8)

| Sl. | Section label (col `[E..]` / `[D..]` verbatim) | source (col I) | Usr key | Calc key (col K) |
|---|---|---|---|---|
| a (r5) | **80G -Donations to certain funds, charitable institutions, etc. (Please fill 80G schedule. This field is auto-populated from schedule.)** | `Per5080G.TotalEligibleDonationsUs80G` | `Section80G` | `Section80G` |
| b (r6) | **80GGA -Deduction in respect of certain donations for scientific research or rural development (Please fill 80GGA schedule. This field is auto-populated from schedule.)** | `Total_Donation_80GGA` | `Section80GGA` | `Section80GGA` |
| c (r7) | **80GGC -Contribution to Political party** | `Total_Donation_80GGC` | `Section80GGC` | `Section80GGC` |
| — (r8) | **Total Deduction under Part B (a + b + c)** | `SUM(I5:I7)` | `TotPartBchapterVIA` *(required)* | `TotPartBchapterVIA` *(required)* |

### Part C — "2. Part C- Deduction in respect of certain incomes" (rows 10–21)

| Sl. | Section label (col `[E..]` verbatim) | source (col I) | Usr key | Calc key (col K) |
|---|---|---|---|---|
| d (r10) | **80IA (c of Schedule 80-IA)-Profits and gains from industrial undertakings or enterprises engaged in infrastructure development, etc.** | `IA80.TotSchedule80_IA` | `Section80IA` | `Section80IA` |
| e (r11) | **80IAB-Profits and gains by an undertaking or enterprise engaged in development of Special Economic Zone** | (keyed) `scvia.Section80IAB` | `Section80IAB` | `Section80IAB` |
| f (r12) | **80-IAC (6 of Schedule 80-IAC)-Special provision in respect of specified business** | `AmountDeduction_80IAC` | `Section80IAC` | `Section80IAC` |
| g (r13) | **80IB (f of Schedule 80-IB-Profits and gains from certain industrial undertakings other than infrastructure development undertakings)** | `IB80.TotSchedule80_IB` | `Section80IB` | `Section80IB` |
| h (r14) | **80-IBA-Profits and gains from housing projects** | (keyed) `scvia.Section80IBA` | `Section80IBA` | `Section80IBA` |
| i (r15) | **80IE (B of Schedule 80-IE)-Special provisions in respect of certain undertakings or enterprises in certain special category States/North-Eastern States.** | `IC80.TotSchedule80_IC` | `Section80IC` (schema desc: *"Section 80IE"*) | `Section80IC` |
| j (r16) | **80JJA-Profits and gains from business of collecting and processing of bio-degradable waste.** | (keyed) `scvia.Section80JJA` | `Section80JJA` (schema desc: *"Also add 80ID"*) | `Section80JJA` |
| k (r17) | **80JJAA-Employment of new employees** | (keyed) `scvia.Section80JJAA` | `Section80JJAA` | `Section80JJAA` |
| l (r18) | **80LA(1) ( 8 of Schedule 80-LA)-Certain Income Of Offshore Banking Units** | (keyed) `scvia.Section80LA` | `Section80LA` | `Section80LA` |
| m (r19) | **80LA(1A) ( 8 of Schedule 80-LA) -Certain Income Of International Financial Services Centre** | (keyed) `scvia.Section80LA1A` | `Section80LA_1A` | `Section80LA_1A` |
| n (r20) | **80P-Income of co-operative societies.** | `MAX(0,Sch80P.Total)` | `Section80P` | `Section80P` |
| — (r21) | **Total Deduction under Part C (total of d to n)** | `SUM(I10:I20)` | `TotPartCchapterVIA` *(required)* | `TotPartCchapterVIA` *(required)* |

### Grand total (row 22)

| Sl. | Label `[E22]` verbatim | source (col I) | Usr key | Calc key (col K) |
|---|---|---|---|---|
| 3 (r22) | **Total Deductions under Chapter VI-A (1 + 2 )** | `scvia.TotPartBchapterVIA+scvia.TotPartCchapterVIA` | `TotalChapVIADeductions` *(required)* | `TotalChapVIADeductions` *(required)* |

**All 17 leaf keys, under both objects (verbatim):**
`Section80G`, `Section80GGA`, `Section80GGC`, `TotPartBchapterVIA`, `Section80IA`, `Section80IAB`, `Section80IAC`, `Section80IB`, `Section80IBA`, `Section80IC`, `Section80JJA`, `Section80JJAA`, `Section80LA`, `Section80LA_1A`, `Section80P`, `TotPartCchapterVIA`, `TotalChapVIADeductions` — once under `UsrDeductUndChapVIA` (claimed, col I) and once under `DeductUndChapVIA` (System Calculated, col K).

> **Not exposed in ITR-5 VI-A:** there is **no 80M row** (inter-corporate-dividend deduction; that line lives in ITR-6), no 80CCD(2), 80TTA/80TTB, 80C, 80D, 80DD/80U etc. — ITR-5 Chapter VI-A is limited to the donation lines (Part B) and the business/income lines (Part C) above.

## The rules the sheet computes (with cell references)

Per-section **System Calculated (col K)** logic — each cell caps the claimed figure and, for the regime-sensitive lines, zeroes it under the new regime:

- **a 80G** — `[K5]= Per5080G.TotalEligibleDonationsUs80G` (carries the eligible-donations figure from Schedule 80G).
- **b 80GGA** — `[K6]= IF(Sheet8b.TotProfBusGain>0,0,MIN(Total_Donation_Eligible_80GGA,Total_Income))` → **allowed only when there is no business income**, then capped at eligible donation and at Total Income. (`[P6]` "old Formula" is a retained comment cell, not live.)
- **c 80GGC** — `[K7]= IF(GTI_80GGC<0,0,Total_Donation_Eligible_80GGC)`; the retained old formula `[P7]= MIN(IF(MID(sheet1.MainStatus,1,1)="4",0,IF(MID(sheet1.MainStatus,1,1)="2",0,VALUE(scvia.Section80GGC))),Total_Income)` shows the status shut-off (status "4"=Local Authority / "2"=AJP → 0).
- **Part B total** — `[K8]= MIN(MAX(0,Sheet8b.GrossTotalIncome-Sheet8b.IncChargeableTaxSplRates),SUM(K5:K7))` → Part B is **clamped to (GTI − income taxable at special rates)**. `[I8]= SUM(I5:I7)`.
- **d 80IA** — `[K10]= MIN(IA80.TotSchedule80_IA)*1`; `[I10]= IA80.TotSchedule80_IA`.
- **e 80IAB** — `[K11]= MIN(VALUE(scvia.Section80IAB))*1`.
- **f 80IAC** — `[K12]= MIN(VALUE(scvia.Section80IAC))*1`; `[I12]= AmountDeduction_80IAC`.
- **g 80IB** — `[K13]= MIN(IB80.TotSchedule80_IB)*1`; `[I13]= IB80.TotSchedule80_IB`.
- **h 80IBA** — `[K14]= IF(bacValue=1,0,IF(scvia.Section80IBA>Sheet8b.GrossTotalIncome,Sheet8b.GrossTotalIncome,scvia.Section80IBA))` → **zeroed under the new regime (`bacValue=1`)**, else capped at GTI.
- **i 80IE** — `[K15]= MIN(VALUE(scvia.Section80IC))*1`; `[I15]= IC80.TotSchedule80_IC`.
- **j 80JJA** — `[K16]= IF(bacValue=1,0,IF(scvia.Section80JJA>Sheet8b.GrossTotalIncome,Sheet8b.GrossTotalIncome,scvia.Section80JJA))` → **zeroed under the new regime (`bacValue=1`)**, else capped at GTI.
- **k 80JJAA** — `[K17]= MIN(VALUE(scvia.Section80JJAA))` (survives the new regime — see below). Helper `[Q17]` label **"(i+ii+iii+iv+vii+xii+xiii) Col 5 of BFLA"**, `[R17]= SUM(hp.IncOfCurYrAfterSetOffBFLosses1, busipofincl.IncOfCurYrAfterSetOffBFLosses2, bp.IncOfCurYrAfterSetOffBFLosses115B, busipofinclspec.IncOfCurYrAfterSetOffBFLosses2a, stcg.IncOfCurYrAfterSetOffBFLosses3a, ltcg.IncOfCurYrAfterSetOffBFLossesDTAA, othsrcincl.IncOfCurYrAfterSetOffBFLosses5)`, `[S17]= TotalAmountDed_80LA`, `[T17]= IF(S17>=R17,R17,S17)` (80LA capped at the summed post-BFLA incomes).
- **l 80LA(1)** — `[K18]= MIN(VALUE(scvia.Section80LA))`; `[R18]` "sum80LA1", `[S18]= TotalAmountDed_80LA1`, `[T18]= IF(S18>=R18,R18,S18)`.
- **m 80LA(1A)** — `[K19]= MIN(VALUE(scvia.Section80LA1A))`; `[R19]` "sum80LA1A", `[S19]= TotalAmountDed_80LA1A`.
- **n 80P** — `[K20]= MIN(Sch80P.Total)*1`; `[I20]= MAX(0,Sch80P.Total)`. `[S20]` **"sheet1.ForeignExchangeFlag"**, `[T20]= IF(LEFT(sheet1.ForeignExchangeFlag,1)="Y",Sec80LA1A_cal_M,Sec80LA1_cal_M)` — the IFSC/foreign-exchange flag decides whether 80LA(1) or 80LA(1A) is the live line.
- **Part C total** — `[K21]= MAX(0,IF(scvia.Section80P_Calc>0, MIN(busipofincl.IncOfCurYrAfterSetOffBFLosses2+hp.IncOfCurYrAfterSetOffBFLosses1+othsrcincl.IncOfCurYrAfterSetOffBFLosses5-sheet11.Section44AD-sheet11.Section44ADA-sheet11.Section44AE, SUM(K10:K20)), MIN(busipofincl.IncOfCurYrAfterSetOffBFLosses2-sheet11.Section44AD-sheet11.Section44ADA-sheet11.Section44AE, SUM(K10:K20))))` → Part C is **clamped to non-speculative / non-specified / non-presumptive business income** (44AD/44ADA/44AE presumptive income excluded), with 80P allowing HP + OS income into the pool. `[I21]= SUM(I10:I20)`.
- **Grand total** — `[K22]= MAX(0,MIN(Sheet8b.GrossTotalIncome-Sheet8b.IncChargeableTaxSplRates,(scvia.TotPartBchapterVIA_Calc+scvia.TotPartCchapterVIA_Calc)))` → **the master GTI-limit clamp: total Chapter VI-A ≤ (GTI − income chargeable at special rates)**. `[I22]= scvia.TotPartBchapterVIA+scvia.TotPartCchapterVIA`.

### The GTI-limit clamp (summary)
Deductions can never create/increase a loss: Part B ≤ (GTI − special-rate income) `[K8]`; Part C ≤ eligible business income after BFLA less presumptive `[K21]`; total ≤ (GTI − special-rate income) `[K22]`. Cross-check rules: **"In Schedule VIA Sl no 3 should be equal to total of sl no 1&2 subject to sl.no.9 - sl.no.10 of Part BTI"**, and Part B/Part C of VI-A must equal sl. no. 1 / sl. no. 2 respectively used in **Part B-TI point 11a / 11b**.

### New regime (u/s 115BAC(1A) / 115BAD / 115BAE) — which deductions close
Formula-level shut-off (`bacValue=1`) zeroes **80IBA `[K14]`** and **80JJA `[K16]`**. The broader closure is enforced by category-A validation rules (from `rules.json`):
- **80G** — *"Deduction u/s 80G cannot be claimed if New tax regime is selected (115BAC/ 115BAD or 115BAE)."* → closed.
- **80GGC** — *"In Part A General, If New tax regime is selecte[d] then Schedule 80GGC is not required to be filled."* → closed.
- **80GGA** — Part B donation; allowed only when there is no business income (`[K6]`), and shut with the other donation deductions under the new regime.
- **Part C, general** — *"Deductions u/s (i) schedule 10AA or (ii) Schedule 80 or (iii) Part C deductions under chapter VI-A **except 80JJAA & 80LA(1A)** cannot be claimed by assessee opting for 115BAD / 115BAE / 115BAC(1A)."* → i.e. **80IA, 80IAB, 80IAC, 80IB, 80IBA, 80IE(80IC), 80JJA, 80LA(1), 80P close under the new regime; only 80JJAA and 80LA(1A) survive.**
- **80LA(1A)** is the IFSC exception (survives), but note the separate rule *"115BAD / 115BAE can be opted only by Resident Co-operative society"* — a co-op society on 115BAD/BAE would not have an IFSC unit.

### Other category-A validation rules (from rules.json)
- **Sub-schedule ceilings:** 80-IA VI-A ≤ Schedule 80-IA sl.no c; 80-IB ≤ Schedule 80-IB; 80IE ≤ Schedule 80IE; 80-IAC ≤ Schedule 80-IAC sl.no 6; 80LA(1)/80LA(1A) ≤ Schedule 80-LA sl.no 8. Each: *"…claimed in Schedule VI-A … but [sub-schedule] is not filled!"* when the schedule is empty.
- **Non-presumptive cap:** 80IA / 80IAB / 80IAC / 80IBA / 80JJA / 80JJAA each *"cannot be more than non speculative and non specified business income and non presumptive income in Schedule VIA."*
- **80P eligibility:** *"80P can be claimed only by assessee being Primary Agricultural Credit Society / Primary Co-operative Agricultural and Rural Development bank / Other co-operative Society"*; 80P sub-schedule + P&L must be filled; not from 44AD income.
- **80GGA:** *"allowed only to assessee having no business income"*; eligible cash donation ≤ Rs. 2000; donee PAN ≠ assessee PAN.
- **80GGC:** *"not allowed for status 'Local Authority' and 'AJP'"*; Name & PAN of political party mandatory; if claimed in VI-A(a) then Schedule 80GGC mandatory.
- **80G:** donee PAN ≠ assessee PAN; cash donation > Rs. 2000 not eligible; PAN of donee mandatory when amount > 0.
- **80IAC:** *"can be claimed by only LLP"* / *"Deduction u/s 80-IAC can be claimed by only LLP"*, DPIIT start-up recognition + incorporation after 01-Apr-2016.
- **80LA:** both 80LA(1) and 80LA(1A) cannot be claimed together; 80LA(1A) needs the IFSC-convertible-forex answer = "Yes", 80LA(1) needs "No"; *"80LA or 80LA(1) allowed only if Form 10CCF is filed."*
- **Forms:** 80-IA(7)/80IAB/80IAC/80-IB/80IC/80IE need **Form 10CCB**; 80JJAA needs **Form 10DA**.

## Dropdowns

`python tools/dump.py --form ITR-5 --dropdowns "VI-A"` returns only numeric-input constraints (`source: "0"`, `values: null`) on the calculated/total cells (`K21 K8 I6:I8 I21:I22 I11 I14 I16:I19` and `I12`). **There are no value-list dropdowns in this sheet** — every cell is either an auto-populated amount or a computed figure. Nothing to enumerate.

## What repeats and what is one figure

- **Nothing repeats.** Schedule VI-A is a fixed 14-section summary (a–c, d–n) plus two sub-totals and a grand total. There is no add-row / instance list.
- **One figure each.** Every section cell is a single amount, and every one is **auto-populated** from its sub-schedule (80G/80GGA/80GGC/80-IA/…/80P) or is a keyed `scvia.Section…` figure; the totals (rows 8, 21, 22) are single computed figures.

## Mandatory

- Schema `required` at block level: **`UsrDeductUndChapVIA`** and **`DeductUndChapVIA`** (both objects). Within each object, the required keys are **`TotPartBchapterVIA`**, **`TotPartCchapterVIA`**, **`TotalChapVIADeductions`** — the three totals must always be present. All individual `Section*` keys are optional (present only when that deduction is claimed).
- In practice the whole schedule is data-driven: fill a section only when its sub-schedule is filled; the totals are emitted whenever the block is built.

## Hidden rows — not built

**None.** `sheet_map.json` reports `hidden_rows: 0` for sheet "VI-A", and the row dump shows no `H`-flagged rows (rows 3–22 all visible). Nothing to exclude.

## What this means for the build

- Build a fixed two-part summary: **Part B** rows a–c (80G, 80GGA, 80GGC) + total; **Part C** rows d–n (80IA, 80IAB, 80IAC, 80IB, 80IBA, 80IE, 80JJA, 80JJAA, 80LA(1), 80LA(1A), 80P) + total; grand total row — no add/remove controls.
- **Auto-populate col I** from each sub-schedule (`Per5080G…`, `Total_Donation_80GGA/80GGC`, `IA80/IB80/IC80.TotSchedule…`, `AmountDeduction_80IAC`, `Sch80P.Total`, `scvia.Section…`); do not make these free-entry.
- **Compute col K (System Calculated)** per the formulas above: per-line cap at the sub-schedule total, per-line non-presumptive/GTI cap, then Part B ≤ (GTI − special-rate income) `[K8]`, Part C ≤ eligible business income `[K21]`, total ≤ (GTI − special-rate income) `[K22]`.
- **Wire the regime shut-off** (`bacValue`): under 115BAC(1A)/115BAD/115BAE zero **every Part B line and every Part C line except 80JJAA and 80LA(1A)** — formula clamp only exists for 80IBA/80JJA; enforce the rest as category-A validations (80G, 80GGC explicitly barred).
- **Emit the two schema objects** `UsrDeductUndChapVIA` (col I) and `DeductUndChapVIA` (col K) with all 17 keys each; always emit the three required totals.
- **Feed Part B-TI:** VI-A Part B total → Part B-TI 11a; Part C total → 11b; grand total → Part B-TI point 3 area (GTI − Chapter VI-A).
- Honour the `SectionCheck`/139(4) belated-return flag and the sub-schedule/Form-availability validations (10CCB, 10CCF, 10DA, 10IEA/10IFA). No dropdowns to populate.
