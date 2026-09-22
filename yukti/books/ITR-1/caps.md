# The book of ITR-1 caps, ceilings and regime bars — A.Y. 2026-27

Every deduction ceiling, rebate, interest and fee rule the utility applies,
with the exact VBA line or worksheet-formula cell. "New regime" =
`OptOutNewTaxRegime == "N"` = `Sheet5.BacValue == 1` (the AY2026-27 default);
"Old regime" = `OptOutNewTaxRegime == "Y"` = `BacValue == 2`. Nothing here is
invented; each row cites the source.

---

## 1 · The regime bar on Chapter VI-A (section 115BAC)

Under the **new regime** the utility builds the Chapter-VI-A **detail
schedules only when `BacValue == 2`** (old regime) — VBA `ToJsonFormat` line
32449 `If (Sheet5.Range("BacValue").Value) = 2 Then ... Schedule80G/80D/... End
If`. Under the new regime the only Chapter-VI-A deductions that survive into the
allowed `DeductUndChapVIA` block are:

- **80CCD(2)** — employer's contribution to NPS (`Section80CCDEmployer`)
- **80CCH(2)** — Agniveer Corpus Fund (`AnyOthSec80CCH`)

Every other 80-series deduction (80C, 80CCC, 80CCD(1), 80CCD(1B), 80D, 80DD,
80DDB, 80E, 80EE, 80EEA, 80EEB, 80G, 80GG, 80GGA, 80GGC, 80U, 80TTA, 80TTB) is
**disallowed** and its allowed amount is 0 under the new regime. The `IncD.
SectionXX_Calc` cells zero out and the detail schedules are not emitted.

> **Rule cross-ref (rules.json #1):** "If Old Tax Regime is selected and Sum of
> deductions claimed u/s 80C, 80CCC & 80CCD(1) cannot be more than Rs.
> 1,50,000." — the ceilings below are enforced only when old regime is in force.

---

## 2 · Standard deduction u/s 16(ia)

| Regime | Cap | Cell / formula |
|---|---|---|
| New (BacValue=1) | ₹75,000 | `Income Details!AO73` = `IF(BacValue=1,MIN(Net_salary,75000),IF(BacValue=2,MIN(Net_salary,50000),0))` |
| Old (BacValue=2) | ₹50,000 | same cell |

The deduction is `MIN(NetSalary, cap)` — capped at the salary, never negative.

---

## 3 · Chapter VI-A ceilings (old regime)

| Section | Cap | Source |
|---|---|---|
| 80C + 80CCC + 80CCD(1) group | **₹1,50,000** aggregate | rules.json #1; `IncD.SectionXX_Calc` cells |
| 80CCD(1) own contribution | 10% of salary (within the 1.5L group) | 80CCD(1) sub-cap |
| 80CCD(1B) additional NPS | **₹50,000** | prior builder VIA table; over-and-above 1.5L |
| 80CCD(2) employer NPS | **14% of salary** if EmployerCategory govt (CGOV/SGOV), else **10%** | 115BAC-permitted; salary-percentage cap |
| 80CCH(2) Agniveer | no fixed cap (as contributed) | `AnyOthSec80CCH` |
| 80D health insurance | age-based, computed on **80D** sheet | see §4 |
| 80DD dependant disability | **₹75,000** (40-80%) / **₹1,25,000** (severe ≥80%) | `Amtdeduction_80DD`; NatureOfDisability 1 vs 2 |
| 80DDB specified disease | **₹40,000** / **₹1,00,000** (senior) | `Amtdeduction_80DDB`; NameOfSpecDisease80DDB |
| 80E education-loan interest | no cap (full interest) | `TotalInterest80E` |
| 80EE housing-loan interest | **₹50,000** | `TotalInterest80EE` |
| 80EEA affordable-housing interest | **₹1,50,000** | `TotalInterest80EEA` |
| 80EEB electric-vehicle-loan interest | **₹1,50,000** | `TotalInterest80EEB` |
| 80G donation | eligible amount per bucket (100%/50%, with/without qualifying limit) | Schedule80G four buckets |
| 80GG rent paid (no HRA) | **₹60,000** (least-of rule) | `IncD.Section80GG_Calc` |
| 80GGA sci-research/rural donation | full eligible | `Total_Donation_Eligible_80GGA` |
| 80GGC political-party contribution | full eligible (non-cash only) | `Total_Donation_Eligible_80GGC` |
| 80TTA savings interest | **₹10,000** | `IncD.Section80TTA_Calc` |
| 80TTB deposits interest (senior) | **₹50,000** | `IncD.Section80TTB_Calc` |
| 80U self disability | **₹75,000** (40-80%) / **₹1,25,000** (severe) | `Amtdeduction_80U`; NatureOfDisability 1 vs 2 |

**80DD/80U codes** (enums.json `NatureOfDisability_80U_80DD`): `1` = 40-80%
disability → ₹75,000; `2` = severe ≥80% → ₹1,25,000. **80DDB** `1,00,000` for a
senior patient, else `40,000`.

---

## 4 · 80D — age-based ceiling (computed on the 80D sheet)

The `EligibleAmountOfDedn` (`Eligible_Amount_80D`) is the utility's own
age-aware least-of computation over four insurer sub-blocks:

- **Self & family, non-senior**: health insurance + preventive check-up, capped
  at ₹25,000 (preventive sub-cap ₹5,000).
- **Self & family, senior** (`SeniorCitizenFlag = Y`): capped at ₹50,000
  (includes medical expenditure when no policy).
- **Parents, non-senior**: capped at ₹25,000.
- **Parents, senior** (`ParentsSeniorCitizenFlag = Y`): capped at ₹50,000.

Flags: `SeniorCitizenFlag` Y/N/**S** (not claiming for self/family);
`ParentsSeniorCitizenFlag` Y/N/**P** (not claiming for parents). Source: VBA
`Schedule80D` lines 37031-37434; the numeric caps live in the 80D-sheet
formulas.

---

## 5 · House-property caps

| Cap | Value | Source |
|---|---|---|
| 24(b) interest, self-occupied | **₹2,00,000** | `IntOnBorwCap_HP` capped on HP sheet |
| Set-off of HP loss against other heads | **₹2,00,000** | current-year HP loss set-off ceiling (rules.json HP rules) |
| Standard deduction 30% of NAV | 30% | `ThirtyPercentOfBalance_HP` |

`ifLetOut` = `S` (self-occupied) triggers the ₹2,00,000 24(b) cap; `L`/`D`
(let/deemed) allow full interest but the HP loss carried to other heads is still
capped at ₹2,00,000.

---

## 6 · Rebate u/s 87A  (`Income Details!AO177`, VBA reads `IncD.Rebate87A`)

The single authoritative formula:

```
AO177 = IF(BacValue=2,
           IF(IncD.TotalIncome_New <= 500000, MIN(IncD.TotalTaxPayable, 12500), 0),
           IF(BacValue=1,
              IF(IncD.TotalIncome <= 1200000, MIN(IncD.TotalTaxPayable, 60000),
                 IF(IncD.TotalTaxPayable > (IncD.TotalIncome - 1200000),
                    IncD.TotalTaxPayable - (IncD.TotalIncome - 1200000), 0)),
              0))
```

- **Old regime**: Total Income ≤ ₹5,00,000 → rebate = MIN(tax, ₹12,500).
- **New regime**: Total Income ≤ ₹12,00,000 → rebate = MIN(tax, ₹60,000).
- **New regime marginal relief**: when TI > ₹12,00,000, rebate =
  `tax − (TI − 12,00,000)` if that is positive (so tax never exceeds the income
  above ₹12L). This is the AY2026-27 marginal-relief carve-out.

`TaxPayableOnRebate = ROUND(TotalTaxPayable − Rebate87A, 0)` (`AO178`).

---

## 7 · Slabs (AY 2026-27)

### New regime (BacValue=1) — `calcTaxPayableOnTINTRQ*`, lines 16252-16276

| Total income | Rate | Cumulative base |
|---|---|---|
| ≤ 4,00,000 | 0% | 0 |
| 4,00,001 – 8,00,000 | 5% | |
| 8,00,001 – 12,00,000 | 10% | |
| 12,00,001 – 16,00,000 | 15% | +60,000 at 12L |
| 16,00,001 – 20,00,000 | 20% | |
| 20,00,001 – 24,00,000 | 25% | |
| > 24,00,000 | 30% | |

### Old regime (BacValue=2) — lines 15927-15940

| Total income | Rate |
|---|---|
| ≤ 2,50,000 | 0% |
| 2,50,001 – 5,00,000 | 5% |
| 5,00,001 – 10,00,000 | 20% (+12,500) |
| > 10,00,000 | 30% (+1,12,500) |

Senior (age 60-79): basic exemption ₹3,00,000 (slab start 300,001). Super-senior
(≥80): ₹5,00,000. Applies only in old regime — in new regime the utility forces
`age = 55` (line 16918-16920), removing any age-based basic-exemption benefit.

Health & Education **Cess = 4%** on tax after rebate (`IncD.EducationCess`).

---

## 8 · Interest u/s 234A / 234B / 234C  (`calcItr1`, `calcIntrst234C`, `calcIntrst234B`)

### 234A — default in furnishing return (1%/month on unpaid tax)
- Principal = `Floor(BalTaxPayable − AdvanceTax − TDS − TCS − SAT, 100)` (line 16900-16904).
- `intrst234A = principal × 0.01 × MonthsAfterDueDate` (line 17111).
- **Senior handling**: at line 16917-16920 `bacage = age`; then
  `If BacValue = 1 Then age = 55`. The 234A age>59 branches use the (possibly
  overridden) `age`, so the senior benefit in 234A applies **only in the old
  regime**.

### 234B — default in advance-tax (1%/month)
- Computed in `calcIntrst234B` (lines 17900-17968), 1% per month on the shortfall.
- **Senior-citizen exemption**: `If (bacage > 59) Then intrst234B = 0`
  (line 17964-17966). Uses **`bacage` = actual age** (captured before the
  new-regime override), so the exemption applies in **both regimes**.

### 234C — deferment of advance-tax instalments (`calcIntrst234C`, lines 17463-17599)
- Quarterly 12%/36%/75%/100% instalment tests with slab0-slab4 challan buckets
  (lines 17140-17170); rate ~1% per instalment shortfall.
- **₹10,000 threshold**: `If ((baseTax − TDS − TCS) < 10000) Then intrst234C = 0`
  (line ~17582) — no 234C if net tax below ₹10,000.
- **Senior-citizen exemption**: `If (bacage > 59) Then intrst234C = 0`
  (line ~17587). Actual age → applies in **both regimes**.
- Dividend income is bucketed by the quarterly `DateRange` leaves for the 234C
  instalment test.

---

## 9 · Late-filing fee u/s 234F  (`NEW234F`, lines 18386-18560)

- `IncD.TotalIncome_New ≤ 500000` and late → **₹1,000** (line 18469).
- `IncD.TotalIncome_New > 500000` and late (verification/filing after due date,
  up to 31 Dec 2025) → **₹5,000** (line 18476).
- On time → 0.

**Basic-exemption carve-out** — 234F is charged only if GTI exceeds the basic
exemption for the regime (`calcItr1` lines 17088-17100):

| Age status | Regime | GTI threshold above which 234F applies |
|---|---|---|
| Non-senior (NC) | New (BacValue=1) | **> ₹4,00,000** |
| Non-senior (NC) | Old (BacValue=2) | **> ₹2,50,000** |
| Senior (SC, 60-79) | either | **> ₹3,00,000** |
| Super-senior (SSC, ≥80) | either | **> ₹5,00,000** |

If the seventh-proviso 139(1) flag is set, 234F applies regardless (line 17080
`If SeventhProvisoFlag = "Yes" Then NEW234F`).

Age-status derivation (lines 17046-17052): `age ≤ 59` → NC; `60-79` → SC; `≥ 80`
→ SSC — computed after the `BacValue=1 → age=55` override, so under new regime
everyone is treated as NC for the 234F GTI threshold (₹4,00,000).

### 234-I fee (`FeeFurnish234I`, V0.4)
Added leaf `IntrstPay.FeeFurnish234I` = `IncD.Section234I` (fee for furnishing
statement), included in `TotalIntrstPay`.

---

## 10 · Differences from the prior builder — flag list

| # | Item | Prior builder | Utility (authoritative) | Where |
|---|---|---|---|---|
| D1 | Senior 234B/234C exemption | not modelled / regime-agnostic unclear | `bacage > 59` (actual age) → 0 in **both** regimes | 234B 17964, 234C 17587 |
| D2 | Senior 234A exemption | — | uses `age` (forced 55 in new regime) → **old regime only** | 16917-16920 |
| D3 | 234C ₹10,000 threshold | — | `(baseTax − TDS − TCS) < 10000` → 0 | 17582 |
| D4 | 234F basic-exemption carve-out | — | new >4L / old >2.5L / SC >3L / SSC >5L | 17088-17100 |
| D5 | 234F fee amounts | — | ≤5L → ₹1,000; >5L → ₹5,000 | 18469/18476 |
| D6 | HP 24(b) & loss set-off | ₹2,00,000 | ₹2,00,000 self-occupied interest + ₹2,00,000 loss set-off | HP sheet |
| D7 | 80DD/80U caps | 1,25,000 flat in VIA table | ₹75,000 (40-80%) / ₹1,25,000 (severe) by NatureOfDisability | 38227/38363 |
| D8 | 80DDB cap | ₹1,00,000 flat | ₹40,000 / ₹1,00,000 (senior) | 80DDB calc |
| D9 | 80CCD(2) cap | flat 0 in VIA table | 14% (govt) / 10% (other) of salary | 115BAC-permitted |
| D10 | 87A new-regime marginal relief | — | `tax − (TI − 12,00,000)` above ₹12L | AO177 |
| D11 | 87A new-regime threshold | ₹7,00,000 / ₹25,000 (stale, still in AO177's BG177 back-up cell) | **₹12,00,000 / ₹60,000** in the live AO177 | AO177 vs BG177 |
| D12 | Std deduction | 75,000/50,000 | confirmed 75,000 (new) / 50,000 (old) | AO73 |
| D13 | ReturnFileSec valid set | included 13/14/16/18 | ITR-1 valid = 11/12/17/20/21 only | VBA 967-988 |
| D14 | Exempt-income categories | stale EICAT | AY26-27 AGRI/GOVC/ISI/SSRA/SRSC/SRST/SRPC/OTH | 34988-35008 |

**Note on D11**: the utility keeps a *back-up* 87A cell `BG177` still carrying
the old ₹7,00,000 / ₹25,000 new-regime rule, but the **live** rebate the VBA
reads is `AO177` with the ₹12,00,000 / ₹60,000 / marginal-relief rule. The
rebuild must use the AO177 rule.
