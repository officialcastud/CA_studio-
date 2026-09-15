# ITR-3 — Schedule VI-A (Deductions under Chapter VI-A)

Read from the utility's **VI-A** sheet (rows 2–70, with the hidden-row flags), its
formulas and dropdowns, and the schema block **`ScheduleVIA`** (the two objects
`UsrDeductUndChapVIA` — the user-entered figures — and `DeductUndChapVIA` — the
system-calculated / allowed figures). All figures, item numbers and rules below
come solely from ITR-3's own sources; the ITR-2 book was used for layout style only.

## The shape

Schedule VI-A is one lettered list of Chapter VI-A deductions in three parts:
**Part B** — deductions in respect of certain payments (letters a to o(i)),
**Part C** — deductions in respect of certain incomes (letters p to x), and
**Part CA and D** — deductions in respect of other incomes / other deduction
(letters y, z, i, ia, ib). Each live row carries a user-entered amount and a
**System Calculated** allowed amount (the utility's own two-column design), and
each part has its own total; the three part-totals sum to the Chapter VI-A total.
Because ITR-3 is a business return, the Part C business-deduction rows (80IA,
80IAB, 80IB, 80IBA, 80IE, 80JJA, 80JJAA) are **live** here, unlike ITR-2.

## The items

Each schema key exists twice — once under `UsrDeductUndChapVIA` (claimed) and once
under `DeductUndChapVIA` (allowed / system-calculated). The single key name is
listed once below and maps to both objects.

### Part B — Deduction in respect of certain payments (a to o(i)) — row 5

| Item | Field label (row) | Type | Schema key | Rule / notes |
|---|---|---|---|---|
| a | 80C - Life insurance premia, deferred annuity, contributions to provident fund, subscription to certain equity shares etc. (r6) | integer | `Section80C` | capped at 1,50,000 and GTI limit (K6) |
| b | 80CCC - Payment in respect Pension Fund (r7) | integer | `Section80CCC` | with an **identifier table** (S.No / Type of Identifier / Identifier No. / Amount, r8); pension array below |
| — | Pension contribution identifier row (r8): Type of Identifier · Identifier No. · Amount | array | `PensionContribution80CCC[]` → `TypeofIdentifier`, `NameofIdentifier`, `Amount` | each row required; type enum PRAN / OTHPRAN |
| c | 80CCD(1) - Contribution to pension scheme of Central Government (r13) | integer | `Section80CCDEmployeeOrSE` | "For Employee/SelfEmployed"; zero if 80C sum > 1,50,000 or > GTI (K13) |
| d | 80CCD(1B) - Contribution to pension scheme of Central Government (r18) | integer | `Section80CCD1B` | max 50,000 (K18, schema maximum 50000) |
| — | PRAN (r23) — PRAN of the taxpayer | array | `PRANDtls[]` → `PRANNum` | |
| e | 80CCD(2) - Contribution to pension scheme of Central Government by the Employer (r29) | integer | `Section80CCDEmployer` | zero for HUF; employer-category limits (K29) |
| f | 80CCF (r31) | — | *(no schema key — drop & log, see below)* | withdrawn section; row visible but K31 formula is malformed and references 80CCG |
| f | 80D-Deduction in respect of Health Insurance premia (r32) | integer | `Section80D` | auto-populated from Schedule 80D; schema maximum 100000 (K32) |
| g | 80DD - Maintenance including medical treatment of a dependent who is a person with disability. (Please fill 80DD Schedule.) (r36) | integer | `Section80DD` | zero for NRI (K36); schema maximum 125000 |
| h | 80DDB - Medical treatment of specified disease (r37) — Name of specified disease | integer + string | `Section80DDB`, `Section80DDBUsrType`, `NameOfSpecDisease80DDB` | disease dropdown + self/dependent type dropdown (r38); schema maximum 100000 (K37) |
| i | 80E - Interest on loan taken for higher education (r39) | integer | `Section80E` | zero for HUF (K39) |
| j | 80EE - Interest on loan taken for residential house property (r40) | integer | `Section80EE` | max 50,000 (K40) |
| k | 80EEA-Deduction in respect of interest on loan taken for certain house property (r41) | integer | `Section80EEA` | max 1,50,000 (K41) |
| l | 80EEB-Deduction in respect of purchase of electric vehicle (r42) | integer | `Section80EEB` | max 1,50,000 (K42) |
| m | 80G - Donations to certain funds, charitable institutions, etc (Please fill 80G Schedule. This field is auto-populated.) (r43) | integer | `Section80G` | from Schedule 80G eligible donations (K43) |
| n | 80GG - Rent paid (r44) | integer | `Section80GG` | max 60,000; min of 25% of GTI etc. (K44); schema maximum 60000 |
| — | Acknowledgement number of Form 10BA (r45) | string | `Form10BAAckNum` | 15 digits; required when 80GG claimed |
| o | 80GGA - Certain donations for scientific research or rural development (Please fill 80GGA Schedule.) (r46) | integer | `Section80GGA` | zero if business/profession income > 0 (K46) |
| o(i) | 80GGC - Donation to Political party (Please fill 80GGC Schedule. This field is auto-populated.) (r47) | integer | `Section80GGC` | auto-populated (K47) |
| — | Total Deduction under Part B (total of a to o(i)) (r48) | integer | `TotPartBchapterVIA` | capped at GTI less income taxed at special rates (K48) |

### Part C — Deduction in respect of certain incomes (p to x) — row 49

| Item | Field label (row) | Type | Schema key | Rule / notes |
|---|---|---|---|---|
| p | 80IA (b of Schedule 80-IA) - Profits and gains from industrial undertakings or enterprises engaged in infrastructure development etc. (r50) | integer | `Section80IA` | from Schedule 80-IA (K50) |
| q | 80IAB - Profits and gains by an undertaking or enterprise engaged in development of Special Economic Zone (r51) | integer | `Section80IAB` | (K51) |
| r | 80IB (E of Schedule 80-IB) - Profits and gains from certain industrial undertakings other than infrastructure development undertakings (r52) | integer | `Section80IB` | from Schedule 80-IB (K52) |
| s | 80-IBA - Profits and gains from housing projects (r53) | integer | `Section80IBA` | capped at GTI (K53) |
| t | 80IE (b of Schedule 80-IE) - Special provisions in respect of certain undertakings or enterprises in certain special category States (r54) | integer | `Section80IC` | note: 80IE row maps to schema key `Section80IC` (K54) |
| u | 80JJA - Profits and gains from business of collecting and processing of bio-degradable waste. (r56) | integer | `Section80JJA` | capped at GTI (K56) |
| v | 80JJAA - Employment of new employees (r57) | integer | `Section80JJAA` | (K57) |
| w | 80QQB - Royalty income of authors of certain books. Note: This deduction shall be allowed only if Form 10CCD is filed. (r58) | integer | `Section80QQB` | zero for NRI / non-Individual; max 3,00,000 (K58) |
| — | Acknowledgement number of Form 10CCD (r59) | string | `Form10CCDAckNum` | required when 80QQB claimed |
| x | 80RRB - Royalty on patents Note: This deduction shall be allowed only if the assessee has filed Form 10CCE. (r60) | integer | `Section80RRB` | zero for NRI / non-Individual; max 3,00,000 (K60) |
| — | Acknowledgement number of Form 10CCE (r61) | string | `Form10CCEAckNum` | required when 80RRB claimed |
| — | Total Deduction under Part C (total of p to x) (r62) | integer | `TotPartCchapterVIA` | (K62) |

### Part CA and D — Deduction in respect of other incomes / other deduction — row 63

| Item | Field label (row) | Type | Schema key | Rule / notes |
|---|---|---|---|---|
| y | 80TTA - Interest on saving bank Accounts in case of other than Resident senior citizens (r64) | integer | `Section80TTA` | max 10,000 (K64); schema maximum 10000 |
| z | 80TTB - Interest on deposits in case of Resident senior citizens (r65) | integer | `Section80TTB` | max 50,000 (K65); schema maximum 50000 |
| i | 80U - In case of a person with disability. (r66) | integer | `Section80U` | zero for NRI (K66); schema maximum 125000 |
| ia | 80CCH - Contribution to Agnipath Scheme (r67) | integer | `AnyOthSec80CCH` | schema maximum 288000 (K67) |
| ib | Any other Deduction (r68) | integer | *(feeds `AnyOthSec80CCH` grouping)* | last figure before the CA-and-D total |
| — | Total Deduction under Part CA and D (total of I, ii and iii) (r69) | integer | `TotPartCAandDchapterVIA` | capped at GTI less special-rate income (K69) |
| — | Total deductions under Chapter VI-A (1 + 2 + 3) (r70) | integer | `TotalChapVIADeductions` | sum of the three part totals (K70) |

Column headers on the identifier rows: **S.No**, **Type of Identifier**,
**Identifier No.**, **Amount** (r8) — these are labels, not items.
Row 3 header: **Schedule VI-A · Deductions under Chapter VI-A**. Row 5 sub-header:
**Part B- Deduction in respect of certain payments** with the **System Calculated**
column. Row 49: **Part C- Deduction in respect of certain incomes**. Row 63:
**Part CA and D- Deduction in respect of other incomes/other deduction**.

## The rules the sheet computes

- **Cross-sheet salary reference** (Q2, `SAL.TotalGrossSalary`): row 2 cell `[Q2] SAL.TotalGrossSalary` is a helper pulling the gross salary from the Salary sheet; it feeds the 80CCD(1) salary-percentage limit (K13). It is a helper cell, not a filed item.
- **GTI limit** (W3, `V3`): `MAX(0, ROUND(Sheet8b.GrossTotalIncome − Sheet8b.IncChargeableTaxSplRates, 0))` — the ceiling every deduction is min'd against.
- **Max_Amount for 80C group** (W5): `IF(GTI_LIMIT>150000, 150000, GTI_LIMIT)`.
- **80C allowed** (K6): `MIN(MIN(VALUE(scvia.Section80C), 150000), GTI_LIMIT)`.
- **80CCC allowed** (K7): `IF(status="H", 0, MIN(MIN(VALUE(scvia.Section80CCC), 150000, 150000 − Section80C...)))` — HUF gets zero; shares the 1,50,000 cap with 80C.
- **80CCD(1) allowed** (K13): zero if `Sum_80C>150000` or `Sum_80C>GTI_LIMIT`, zero for HUF; salary-based 20%/10% limit via `Salaryded` (Q13).
- **80CCD(1B) allowed** (K18): `IF(status="I", MIN(VALUE(scvia.Section80CCD1B_SE), 50000, GTI_LIMIT), 0)` — Individuals only, cap 50,000.
- **80CCD(2) allowed** (K29): zero for HUF; employer-category limit; `ROUND(...)`.
- **80CCG allowed** (K30, hidden row): zero for HUF/NRI, equity-savings-scheme rule.
- **80CCF** (K31): malformed formula `IF(GTI_LIMIT>1200000,0,MIN(VALUE(scvia.Section80CCG),25000)))...` — withdrawn section, no schema key.
- **80D** (K32 `= scvia.Section80DValue`; I32 `= Eligible_Amount_80D`); helper cells R30/R32/S34/T34 compute the self/parents/senior/preventive/medical-expenditure split with the 25,000 / 50,000 / 5,000 sub-caps (Q34, Q35, R34, R35).
- **80DD allowed** (K36): `IF(NRI, 0, Amtdeduction_80DD)`.
- **80DDB allowed** (K37): `MIN(IF(not NRI, MIN(Sec80DDBref, VALUE(scvia.Section80DDB)), 0), GTI_LIMIT)`; senior-citizen ref computed from DOB.
- **80E allowed** (K39): `IF(status="H", 0, MIN(VALUE(scvia.Section80E), GTI_LIMIT))`.
- **80EE / 80EEA / 80EEB allowed** (K40/K41/K42): min with 50,000 / 1,50,000 / 1,50,000, zero for HUF.
- **80G allowed** (K43): `Per5080G.TotalEligibleDonationsUs80G`.
- **80GG allowed** (K44): `MIN(ROUND(IF(status="H",0,MIN(60000, 0.25*(MAX(0,GTI_LIMIT−Q40)))),0), VALUE(scvia...))`; Q40 is the running deduction sum `SUM(K6:K43)+K47+SUM(K50:K60)+SUM(K64:K66)`.
- **80GGA allowed** (K46): `IF(bacValue=1, 0, IF(Sheet8b.TotProfBusGain>0, 0, Total_Donation_Eligible_80GGANew))`.
- **80GGC allowed** (K47): `IF(bacValue=1, 0, Total_Donation_Eligible_80GGC)`.
- **Part B total** (K48): `MIN(SUM(K6:K47), Sheet8b.GrossTotalIncome − Sheet8b.IncChargeableTaxSplRates)`; I48 `= SUM(I6:I47)`.
- **80IA/IAB/IB/IC allowed** (K50/K51/K52/K54): `= scvia.Section80IA/…`; **80IBA** (K53) capped at GTI, zero if new regime; **80ID** (K55, hidden) `MIN(VALUE(scvia.Section80ID), GTI_LIMIT_PartC)`; **80JJA** (K56) capped at GTI.
- **Part C total** (K62): `MAX(0, MIN(SUM(...80IA_Calc,80IAB_Calc,...), ...))`; I62 `= SUM(I50:I54, I56:I60)`.
- **80TTA allowed** (K64): `MIN(othsrcincl.IncOfCurYrAfterSetOffBFLosses5, MIN(MIN(VALUE(scvia.Section80TTA), 10000), MAX(0, MIN(GTI...))))`.
- **80TTB allowed** (K65): same shape, cap 50,000.
- **80U allowed** (K66): `IF(NRI, 0, Amtdeduction_80U)`.
- **80CCH allowed** (K67): `MAX(0, IF(bacValue=2, MIN(MIN(..Anyother80CCH, Anyother80CCH_PreCalc), 288000)...))`.
- **Part CA and D total** (K69): `MAX(0, MIN(SUM(K64:K67), Sheet8b.GrossTotalIncome − Sheet8b.IncChargeableTaxSplRates))`; I69 `= SUM(scvia.Section80TTA, scvia.Section80TTB, scvia.Section80U, Anyother80CCH)`.
- **Chapter VI-A total** (K70): `ROUND(MAX(0, MIN(TotPartBchapterVIA_Calc + TotPartCchapterVIA_Calc + TotPartCAandDchapterVIA_Calc, ...)), 0)`; I70 `= TotPartBchapterVIA + TotPartCchapterVIA + TotPartCAandDchapterVIA`.

## Dropdowns

- **Type of Identifier** (E9:E11, source `"PRAN,Other than PRAN"`): `PRAN`, `Other than PRAN`.
- **80D — self/family/parents category** (Selection80D, F33:G33): `(Select)`, `1-Self and Family (Non Senior citizen)`, `2-Self and Family (Including Senior citizen)`, `3-Parents`, `4-Parents(Senior citizen)`, `5-Self and Family including parents`, `6-Self and Family including senior citizen parents`, `7-Self(Senior citizen) & family including senior citizen parents`.
- **80D — medical expenditure category** (Selection80D_B, F34:G34): `(Select)`, `1-Self & family ( senior citizen)`, `2-Parents( senior citizen)`, `3-Self & family including parents(senior citizen)`.
- **80D — preventive health check-up category** (Selection80D_C, F35:G35): `(Select)`, `1-Self and family`, `2-Parent`, `3-Self and family and Parents`.
- **80DDB — self/dependent type** (Section80DDB, E38): `(Select)`, `1-Self or Dependent`, `2-Self or Dependent(Senior Citizen)`.
- **80DDB — name of specified disease** (Specified_Disease_List, F38:G38): `(Select)`, `(a) Dementia`, `(b) Dystonia Musculorum Deformans`, `(c) Motor Neuron Disease`, `(d) Ataxia`, `(e) Chorea`, `(f) Hemiballismus`, `(g) Aphasia`, `(h) Parkinsons Disease`, `(i) Malignant Cancers`, `(j) Full Blown Acquired Immuno-Deficiency Syndrome (AIDS)`, `(k) Chronic Renal failure`, `(l) Hematological disorders`, `(m) Hemophilia`, `(n) Thalassaemia`.

## What repeats and what is one figure

- **Arrays (repeat):** `PensionContribution80CCC[]` (the 80CCC identifier table — Type of Identifier, Name/Identifier No., Amount) and `PRANDtls[]` (`PRANNum`, under 80CCD(1B)).
- **Single figures:** every section amount (`Section80C` … `Section80U`, `AnyOthSec80CCH`), every acknowledgement number (`Form10BAAckNum`, `Form10CCDAckNum`, `Form10CCEAckNum`), the 80DDB type/disease selectors, and all totals (`TotPartBchapterVIA`, `TotPartCchapterVIA`, `TotPartCAandDchapterVIA`, `TotalChapVIADeductions`).
- Each figure appears in **both** objects: `UsrDeductUndChapVIA` (claimed) and `DeductUndChapVIA` (allowed/system-calculated).

## Mandatory

Required keys of `ScheduleVIA`: the two blocks **`UsrDeductUndChapVIA`** and
**`DeductUndChapVIA`** themselves. Within each block the required leaves are the
four totals — **`TotPartBchapterVIA`**, **`TotPartCchapterVIA`**,
**`TotPartCAandDchapterVIA`**, **`TotalChapVIADeductions`**. Within
`UsrDeductUndChapVIA.PensionContribution80CCC[]` each row requires
**`TypeofIdentifier`**, **`NameofIdentifier`** and **`Amount`**. All other section
amount keys are optional (claimed only when the deduction is taken).

## Hidden rows — not built

| Row | Content | Why hidden / not built |
|---|---|---|
| 14H | Identifier table header for 80CCD(1): S.No / Type of Identifier / Name of Identifier / Amount | utility hides the 80CCD(1) identifier grid; no schema array for it |
| 16H | Auto S.No cell `= D15+1` | serial-number helper on the hidden 80CCD(1) grid |
| 21H | Auto S.No cell `= D20+1` | serial-number helper on the hidden 80CCD(1B) grid |
| 28H | PRAN of the taxpayer (label) | header for the hidden PRAN entry area |
| 30H | 80CCG - Investment made under an equity savings scheme | withdrawn deduction; no schema key |
| 33H | (A) Health Insurance Premium | internal 80D sub-computation row (feeds `Section80D`), not a filed item |
| 34H | (B) Medical expenditure | internal 80D sub-computation row (helper `80DB`) |
| 35H | (C) Preventive health check-up | internal 80D sub-computation row (helper `80DC`) |
| 55H | 80ID | withdrawn/inactive business deduction; no distinct schema key (maps into `Section80IC` group) |

The 80D category dropdowns (Selection80D, Selection80D_B, Selection80D_C) sit on
hidden rows 33–35 but their values are still recorded above because Schedule 80D
feeds the visible 80D figure (item f, row 32).

## What this means for the build

- Render one lettered list in three parts (B: a–o(i); C: p–x; CA and D: y, z, i, ia, ib) with a two-column **claimed** (`UsrDeductUndChapVIA`) / **allowed = System Calculated** (`DeductUndChapVIA`) layout matching the sheet.
- The business-deduction rows (80IA, 80IAB, 80IB, 80IBA, 80IE, 80JJA, 80JJAA) are **live in ITR-3** — build them; do not carry over ITR-2's "correctly absent" verdict.
- **Row 31 (80CCF)** is visible on the sheet but has **no schema key** and a malformed formula referencing 80CCG — per constitution rule 3 it must be **dropped and logged**, not filed. **Row 30 (80CCG)** is hidden and equally has no key.
- **80IE → `Section80IC`**: the 80IE row (item t, row 54) maps to schema key `Section80IC`; keep that mapping explicit so the export writes the right key.
- Build the identifier arrays: `PensionContribution80CCC[]` (visible header row 8) and `PRANDtls[]`. The 80CCD(1) identifier grid (rows 14H+) is hidden — do not build it as a visible item.
- Add the three acknowledgement fields (`Form10BAAckNum` 15-digit under 80GG; `Form10CCDAckNum` under 80QQB; `Form10CCEAckNum` under 80RRB) and the 80DDB disease + self/dependent dropdowns.
- Honour the schema `maximum` caps (80CCD1B 50000, 80D 100000, 80DD 125000, 80DDB 100000, 80EE 50000, 80EEA/80EEB 150000, 80GG 60000, 80QQB/80RRB 300000, 80TTA 10000, 80TTB 50000, 80U 125000, 80CCH 288000) and the GTI ceiling from Sheet8b.
- All allowed figures are computed and untypeable (green); each override lives behind the sheet's own regime gate (many rows zero-out under the new regime / for HUF / for NRI per the K-column formulas).


## Additional visible rows — verbatim from the sheet (completeness)
Rows present on the utility sheet and captured here verbatim so every visible label is in the book:

- SAL.TotalGrossSalary
- Schedule VI-A
- Identifier No.
