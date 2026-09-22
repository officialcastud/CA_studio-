# The book of the `Tax` sheet (hidden computation) — ITR-6, A.Y. 2026-27

**Status: hidden (`sheet18.xml`, 124 rows) — `why_built` in `section_map.json`:
"the hidden computation sheet — the method behind Part B-TTI and the interest;
read, not shown".** This is ITR-6's equivalent of ITR-2's "Tax Calculated"
sheet (seventeen-mistakes rule 7): Part B-TTI shows the *results*, this sheet is
the *method*. It is never rendered as a section; the section-builder reads it to
build the tax/surcharge/cess/interest engine behind `PartB_TTI`. No live-row
book is required by Gate 3 for a hidden sheet, but every formula that carries a
rule is transcribed here so the engine can be built from the sources, not memory
(rule 2: never port an engine).

Every cell reference below is verbatim from `tools/dump.py --form ITR-6 --sheet
"Tax" --formulas`. Named ranges resolve to cells on this sheet unless a sheet
prefix is shown.

---

## The layout of the sheet

The sheet is four working blocks laid side by side:

- **Columns A-H, rows 1-92** — the BASIC TAX CALCULATION and the several
  SURCHARGE CALCULATION parts (normal, MAT, DTAA), plus the 115BAA eligibility
  scan.
- **Columns M-P, rows 1-20 & 95-98** — the interest 234A / 234B / 234C driver
  (dates, assessed tax, quarter flags from date of incorporation).
- **Columns R-AD, rows 1-117** — the 234C quarterly buckets (normal income, each
  capital-gains rate band, special-rate income, lottery/online-game income), with
  cumulative advance-tax targets and per-quarter shortfall interest.
- **Column Q / scattered names** — the surcharge marginal-relief ratios that carry
  the surcharge back onto each income band and quarter.

---

## 1 · The corporate tax ladder (feeds Part B-TTI item 2a)

The taxable base is `TaxableIncome = Sheet8b.AggregateIncome` (`C3`); the normal
rate depends on three inputs read from Part A-General:

| Named range | Cell | Meaning |
|---|---|---|
| `Status_Dom_Foreign` | `D3` = `MID(sheet1.DomesticCompFlg,1,1)` | `Y` = domestic company, else foreign |
| `_Per25` | `E3` = `MID(sheet1.NRI_GR_1,1,1)` | first letter of the turnover answer; `N` = turnover does **not** exceed the ₹400-cr threshold → small-company 25 % |
| `Check_115BA` | `F3` | the opted section number extracted from `sheet1.NRI_115BA_1` (or `Section115CurrAY`): `115BA` / `115BAA` / `115BAB` / blank |

**The rate ladder (`B4` / `C4`):**

```
IF Status_Dom_Foreign = "Y":                       (domestic company)
   IF _Per25 = "N"            → 25%  × TaxableIncome
   ELSE IF Check_115BA=115BA  → 25%
   ELSE IF Check_115BA=115BAA → 22%
   ELSE IF Check_115BA=115BAB → 15% × Temp5BAB (manufacturing) + 22% × Bal
   ELSE                       → 30%
ELSE:                                               (foreign company)
   35%   (B4; the sheet comment "Old formula - 40 to 35% forgine updated" and
          row-17 note "Old formula Foreign updated from 40 to 35%")
```

- `Temp5BAB` = `D4` = the 115BAB manufacturing income taxed at 15 %.
- `Bal` = `E4` = `TaxableIncome − Temp5BAB`, taxed at 22 % under 115BAB.
- **There is no basic exemption** for a company — `Tax!S12` reads "BASIC
  EXEMPTION IS NOT THERE IN ITR6"; the `B.E` name (`Q1`) evaluates to 0 and only
  appears inside the 234C capital-gains bucketing helpers.

## 2 · The 115BAA / 115BAB eligibility gate (`D65`)

Rows 62-87 scan every incentive that disqualifies the 22 % concessional rate. Each
`C`-column flag is 1 if the corresponding deduction/addition is non-zero:

`AA10.TotalDedUs10Sub` (10AA/SEZ), additional depreciation
(`DPM15/30/40/45.AddlnDepr…`, `AdditionsDepThan180Days`), `sheet11.DeductUs32AD`,
`sheet12.DeductUs35AD1`, ESR `35`/`35CCC`/`35CCD` allowances, and
`scvia.TotPartCchapterVIA_Calc` net of 80JJAA and 80M.

```
D65 = IF( SUM(C65:C87) = 0 , 0.22 , 0.30 )
```

i.e. if **any** listed incentive is claimed the concessional 22 % is withdrawn and
30 % applies. (Mirrors rule 674: 115JB MAT does not apply where 115BAA/115BAB is
opted; and the mutual exclusivity of the concessional rate with the incentives.)

## 3 · The company surcharge on normal tax (feeds Part B-TTI item 2dii)

`SurchargeInterestRate` = `C31`, `SurchargeForGrpB` = `E31`. Group-B thresholds
on total income (`C29`, `E29`):

| Total income | Domestic | Foreign |
|---|---|---|
| > ₹1 crore and ≤ ₹10 crore | **7 %** | **2 %** |
| > ₹10 crore | **12 %** | **5 %** |

Marginal relief (`C49` / `C50`, rows 42-50), the same working the department uses:

```
Total1  = TaxPayableOnTotalIncome + SurchargeOnIncome              (at actual income)
Total2  = tax + surcharge computed at exactly ₹1 crore            (C45)
Total3  = tax + surcharge computed at exactly ₹10 crore           (C48)
MarginalRelief = MAX(0, Total1 − MAX(Total2, Total3))             (C49)
SurchargeOn2C  = surcharge after marginal relief                 (C50)
```

**115BBE surcharge — a flat 25 %, never relieved (`Surcharge_i`, Part B-TTI 2di).**
Row 84: `Tax on 115BBE = SI_115BBE`, `Surcharge 115BBE = Sheet9.Surcharge_i`.
Row 85: `Surcharge Normal = Sheet9.Surcharge_ii` on `TaxPayableOnTotInc − 115BBE tax`.

**DTAA income surcharge cap (rows 54-58).** DTAA income is pulled out
(`B54 = IS_DTAA`, `DTAA_INCOME = SI!U69`), and its surcharge is capped at the
least of the tier surcharge and a maximum of **70 % (domestic) / 60 % (foreign)**
of the income exceeding the threshold (`B56`, `B58 = MAX(MIN(B56, B57), 0)`).

## 4 · The MAT surcharge (feeds Part B-TTI item 1b, `SurchargeMAT` = `C20`)

MAT deemed income is `C9 = MAT.Total9`; MAT tax is `C10 = ROUND(sheet9.TaxDeemedTISec115JC, 0)`.

```
RateForComp (H11) = IF Status_Dom_Foreign="Y": IF C9>10cr: (C9>100cr? 12% : 7%) else 0
                    ELSE (foreign):            IF C9>10cr: (C9>100cr?  5% : 2%) else 0
Surcharge (C11)   = IF C9>1cr, ROUND(C10 × RateForComp, 0), 0
Marginal relief   = rows 13-19 (tax on ₹1cr / ₹10cr cut-offs), C19
SurchargeMAT (C20)= IF C19<=0, C10 × rate, MAX(C11 − C19, 0)
```

## 5 · Cess

4 % on (tax + surcharge): on the normal computation → Part B-TTI 2e; on the MAT
computation → 1c (`ROUND(0.04 × (TaxDeemedTISec115JC + deemeds), 0)`, `L57` on
Part B-TTI).

## 6 · MAT (115JB) vs normal, and MAT credit (115JAA)

Read back into Part B-TTI:
- **Item 3 gross tax payable = `MAX(GrossTaxLiability, TotalTax_DI)`** — higher of
  normal 2f and MAT 1d.
- **Item 4 credit u/s 115JAA** = `IF(GrossTaxLiability ≤ TotalTax_DI, 0,
  AMTC.TaxSection115JD)` — allowed only when the normal tax exceeds MAT.
- **`Higher_MATC` (`R9`) = `sheet9.TotalTax_DI > Sheet9.GrossTaxLiability`** — when
  MAT/MATC tax is the higher, the 234C base uses `TotalTax_DI` (columns R-AD3-8).

**Naming carryover to flag:** internally the utility reuses the AMT named ranges
(`TaxDeemedTISec115JC`, `deemeds`, `EducationCess_DI`, `CreditUS115JD`,
`AMTC.TaxSection115JD`) even though the *company* provisions are section **115JB**
(MAT) and **115JAA** (MAT credit), and the schema keys and displayed labels are
115JB / 115JAA. This is a cosmetic carryover from the individual/AMT engine; build
the engine to 115JB / 115JAA. Do not guess a separate 115JC/115JD path — there is
none for a company.

## 7 · Interest under sections 234A / 234B / 234C

**234A (`M11`, `N18`).** `234A lakh Check = MAX(NetTaxLiability − AdvanceTax − TDS
− TCS, 0)` (`N18`); interest at 1 %/month from the due date (`I6` = 31/10/2026,
`I7` = 30/11/2026 for audit cases — "Changed by Sai") to the date of filing
(`N3` = 16/09/2025 default, overwritten by `sheet9.Date`).

**234B (`M12`, `N17`).** `Assessed Tax = NetTaxLiability − (TDS + TCS)` (`N17`);
interest at 1 %/month on the shortfall of advance tax.

**234C (`M13`, columns R-AD).** Quarterly deferment interest. Two paths:
- **Normal path** — five quarter buckets on cumulative advance tax vs. targets
  **12 % / 36 % / 45 % / 75 % / 100 %** for the due dates 15 Jun / 15 Sep / 15 Dec
  / 15 Mar / 31 Mar (`R3`-`R7`). Income is segregated into normal income
  (`Normal_Income_234C` = `O21`), each CG rate band (STCG 15/30 %, LTCG 10/12.5/20 %,
  STCGDTAA, LTCGDTAA — rows 33-92), special-rate income, and lottery / online-game
  income (rows 52-57), each bucketed by quarter of accrual; the per-quarter
  shortfall carries 1 % × 3 months (× 1 for the last quarter).
- **MATC-higher path (`R1`-`R8`, `S3`)** — when `Higher_MATC`, the base is
  `MAX(TotalTax_DI − (TDS + TCS + CreditUS115JD + TotTaxRelief), 0)`; targets
  12 % / 45 % / 75 % / 100 % (`V3`-`V6`); interest `AD3`-`AD6` compares tax paid to
  the 12 %/36 % (Q1/Q2 lower) targets before charging.
- **Quarter flags from date of incorporation (`P95`-`P99`).** Q1-Q5 booleans keyed
  on `sheet1.DOCOB` (date of commencement) decide which quarters a newly
  incorporated company is liable for — a first-year company is not charged 234C for
  quarters before it existed. **Helper columns are rules (mistake 8):** these date
  flags are the rule for what advance-tax instalment was due.

## 8 · The named ranges the engine needs (all on this sheet unless prefixed)

| Name | Cell | Name | Cell |
|---|---|---|---|
| `TaxableIncome` | `C3` | `Status_Dom_Foreign` | `D3` |
| `_Per25` | `E3` | `Check_115BA` | `F3` |
| `Temp5BAB` | `D4` | `Bal` | `E4` |
| `TotalIncome` | `C29` | `IncFromGrpB` | `E29` |
| `TaxPayableOnTotalIncome` | `C30` | `NormalIncome` | `C32` |
| `SurchargeInterestRate` | `C31` | `SurchargeForGrpB` | `E31` |
| `TaxAt1CrOR10Cr` | `G33` | `TaxableIncomeAt10Cr` | `H22` |
| `SurchargeRateIncome_grt1Cr_lessthan_10Cr` | `H21` | `SurchargeOnIncome` | `C40` |
| `MarginalRelief` | `C49` | `SurchargeOn2C` | `C50` |
| `SurchargeMAT` | `C20` | `RateForComp` | `H11` |
| `Higher_MATC` | `R9` | `Normal_Income_234C` | `O21` |
| `Consumed_BE` / `ConsumedBE2` | `T16` / `T33` | `n_1` / `n_3` | `T17` / `T34` |
| `IS_DTAA` | `B54` | `B.E` (=0) | `Q1` |
| `DTAA_INCOME` | `SI!U69` | `TDS` / `TCS` | `N15` / `N16` |
| `NetTax_115TD` | `'PARTB - TI - TTI'!L96` | `Section115CurrAY` | `'PART A - GENERAL'!AR50` |

## Cross-sheet feeds

**In:** Part A-General (`sheet1`) — domestic/foreign flag, opted section
115BA/115BAA/115BAB, turnover answer, date of incorporation; `Sheet8b` — aggregate
income, total income, GTI, deductions, special-rate income; Schedule MAT
(`MAT.Total9`, `MAT.TaxPayableUs115JB`); Schedule MATC (`AMTC.TaxSection115JD`);
Schedule SI (every special-rate income and its tax, and the 115BBE income);
Schedule IT (`IT.Qtr1..Qtr4`) for advance-tax instalments; `sheet9` — the running
tax/surcharge/cess results.

**Out:** every figure of Part B-TTI lines 1a-1d (via `sheet9` deemed-income
results), 2a (`C4`), 2di/2dii (`Surcharge_i`/`Surcharge_ii`), 8a/8b/8c
(234A/234B/234C interest), and the "higher of 1d/2f" comparison at item 3.

## Sources fully readable

All 124 rows and every cell formula of the `Tax` sheet resolved cleanly. There is
**no VBA routine** behind the ITR-6 tax computation (unlike ITR-2's
`calculateTaxPayableold`): the entire corporate tax ladder, both surcharge
computations, the marginal relief, the MAT interplay and the 234A/B/C interest are
in this sheet's cell formulas. Nothing was compressed or truncated (mistake 17: if
it had been, it would be logged here rather than guessed).
