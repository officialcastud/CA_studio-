# The book of Part B-TI · Part B-TTI — ITR-2, A.Y. 2026-27

Read row by row from the utility's **Part B – TI TTI** sheet (138 rows), the
hidden **Tax Calculated** sheet (345 rows) it computes from, and the named
formulas, with the hidden-row flags, and confirmed against `PartB-TI` and
`PartB_TTI`.

This is the sheet a CA holds against the paper form. Every line below carries
the form's own number so the two land on the same row.

---

## Part 1 · Part B-TI — Computation of total income

| Line | Field | Source / formula |
|---|---|---|
| **1** | Salaries | 6 of Schedule S |
| **2** | Income from house property — *enter nil if loss* | 3 of Schedule HP |
| *3* | *Profits and gains from business or profession, i to v* | **hidden** — not on ITR-2 |
| **3** | Capital gains | |
| 3a | Short-term | |
| *3a(ia)* | *at 15%* | **hidden** — pre-July |
| 3a(i) | at 20% | 8ii of Table E, Schedule CG |
| 3a(ii) | at 30% | 8iii |
| 3a(iii) | at applicable rate | 8iv |
| 3a(iv) | at special rates under a DTAA | 8v |
| 3a(v) | **Total short-term** (i + ii + iii + iv) — *nil if loss* | computed |
| 3b | Long-term | |
| *3b(ia)* | *at 10%* | **hidden** |
| 3b(i) | at 12.5% | 8vi |
| *3b(ii)* | *at 20%* | **hidden** |
| 3b(ii) | at special rates under a DTAA | 8vii |
| 3b(iii) | **Total long-term** (i + ii) — *nil if loss* | computed |
| 3c | Sum of short-term and long-term (3av + 3biii) — *nil if loss* | computed |
| 3d | Capital gains at 30% under 115BBH | C2 of Schedule CG |
| 3e | **Total capital gains** (3c + 3d) | computed |
| **4** | Income from other sources | |
| 4a | Net income at normal rates | 6 of Schedule OS |
| 4b | Income at special rates | 2 of Schedule OS |
| 4c | Race horses — *nil if loss* | 8e of Schedule OS |
| 4d | **Total** (4a + 4b + 4c) — *nil if loss* | computed |
| **5** | **Total of head-wise income** (1 + 2 + 3e + 4d) | computed |
| **6** | Losses of the current year set off against 5 | total of 2xiii and 3xiii of Schedule CYLA |
| **7** | Balance after set-off of current-year losses (5 − 6) | total of column 4 of CYLA |
| **8** | Brought-forward losses set off against 7 | 2xii of Schedule BFLA |
| **9** | **Gross total income** (7 − 8) | 3xiii of BFLA + 2 of Schedule OS |
| **10** | Income chargeable at special rates under 111A, 112, 112A etc. included in 9 | |
| *11a, 11b* | *Part B/CA/D and Part C of VI-A separately* | **hidden** |
| **11** | Deductions under Chapter VI-A — **v of Schedule VI-A, limited to (9 − 10)** | `MAX(0, MIN(VI-A total, GTI − special-rate income))` |
| *—* | *Deduction under 10AA* | **hidden** |
| **12** | **Total income** (9 − 11) | `ROUND(MAX(0, GTI − VI-A), −1)` |
| **13** | Income included in 12 chargeable at special rates — total of (i) of Schedule SI | `SUM(SI.SplRateIncCalc)` |
| **14** | Net agricultural income, or other income for rate purposes | 2 of Schedule EI |
| **15** | **Aggregate income** (12 − 13 + 14) — *applicable if (12 − 13) exceeds the maximum amount not chargeable to tax* | `IF(MAX(0, TI − special) > exemption, (TI − special) + agri, 0)` |
| **16** | Losses of the current year to be carried forward | total of row xi of Schedule CFL |
| **17** | Deemed income under section 115JC | 3 of Schedule AMT |

### The two rules on this page the engine did not have

**Line 11 — Chapter VI-A is capped at gross total income *minus* special-rate
income.** `L42 = MAX(0, MIN(PartB + PartC + 80CCH, GTI − IncChargeableTaxSplRates))`.
Deductions cannot be set against lottery, 115BBE, or special-rate capital
gains. Yukti today caps at GTI alone.

**Line 15 — agricultural income is added for rate only when normal-rate
income already exceeds the exemption limit.** Where (12 − 13) is at or below
the limit, line 15 is nil and no rate effect arises.

### The exemption limit the sheet uses (`ExemptionUnder_TI`, S47)

```
IF bacValue = 1 (new regime)                              → 4,00,000
ELSE IF individual, age 60–79, resident or RNOR          → 4,00,000   ← see note
ELSE IF individual, age 80+, resident or RNOR            → 5,00,000
ELSE individual or HUF                                    → 2,50,000
```

**Note.** The second branch gives a senior citizen under the *old* regime
₹4,00,000. The statutory old-regime exemption for a senior is ₹3,00,000 — and
the helper comment on the cell reads *"Formula changed by Konda as per Bindu on
10-06-2026."* This cell drives only line 15's threshold test, not the slab tax
itself (which the VBA `calculateTaxPayableold` computes). Build the slab from
the statute — 2.5L / 3L / 5L old, 4L new — and treat this cell as what the
utility does for the line-15 test. Flag it; do not copy a likely bug into the
tax.

---

## Part 2 · Part B-TTI — Computation of tax liability on total income

| Line | Field | Source / formula |
|---|---|---|
| **1** | Tax payable on deemed total income | |
| 1a | Tax under 115JC — 4 of Schedule AMT | |
| 1b | Surcharge on 1a, if applicable | |
| 1c | Health and education cess at 4% on (1a + 1b) | |
| 1d | **Total tax on deemed total income** (1a + 1b + 1c) | computed |
| **2** | Tax payable on total income | |
| 2a | Tax at normal rates on 15 of Part B-TI | the slabs on aggregate income |
| 2b | Tax at special rates — total of (ii) of Schedule SI | |
| 2c | Rebate on agricultural income — *applicable if (12 − 13) exceeds the exemption* | tax on (exemption + agricultural income) |
| 2d | **Tax payable on total income** (2a + 2b − 2c) | `MAX(2a + 2b − 2c, 0)` |
| *—* | *Rebate under 88E · Balance · Surcharge on 3* | **hidden** |
| **3** | Rebate under section 87A | see below |
| **4** | **Tax payable after rebate** (2d − 3) | `MAX(0, …)` |
| **5** | Surcharge | |
| 5A | *Surcharge computed before marginal relief* | |
| 5A(i) | **25% of tax under 115BBE** | never gets relief |
| 5A(ii) | 10% or 15% as applicable — on the capital-gains and dividend portion | **the 15% cap** |
| 5A(iii) | On the rest — [(4) − 15(ii) of SI − tax on 5(ii)] | 10 / 15 / 25 / 37 |
| 5B | *Surcharge after marginal relief* — i, ii, iii | see below |
| 5B(iv) | **Total surcharge** | `MAX(0, Surcharge_i + Surcharge_ii)` |
| **6** | Health and education cess at 4% on (4 + 5iv) | |
| **7** | **Gross tax liability** (4 + 5iv + 6) | |
| **8** | **Gross tax payable** — higher of 1d and 7 | `MAX(GrossTaxLiability, TotalTax_DI)` |
| 8a | Tax on income *without* the ESOP perquisite of 17(2)(vi) | |
| 8b | Tax deferred on the ESOP perquisite — this year | to Schedule ESOP |
| 8c | Tax deferred from earlier years but payable now — total of column 7 of Schedule ESOP | |
| **9** | Credit under 115JD of tax paid in earlier years — *only if 7 is higher than 1d* | `IF(7 ≤ 1d, 0, AMTC line 5)` |
| **10** | **Tax payable after credit** (8a + 8c − 9) | |
| **11** | Tax relief | |
| 11a | Section 89 — *ensure Form 10E is submitted* | |
| *—* | *Section 89A* | **hidden** — handled inside the income schedules |
| 11b | Section 90 / 90A — 2 of Schedule TR | |
| 11c | Section 91 — 3 of Schedule TR | |
| 11d | **Total relief** (11a + 11b + 11c) | |
| **12** | **Net tax liability** (10 − 11d) — *nil if negative* | |
| **13** | Interest and fee | |
| 13a | Interest for default in furnishing the return — 234A | |
| 13b | Interest for default in payment of advance tax — 234B | |
| 13c | Interest for deferment of advance tax — 234C | the quarterly working from Schedule IT, CG Table F, OS item 10 |
| 13d | Fee for default in furnishing the return — 234F | |
| 13da | **Fee for furnishing a revised return — 234-I** | new this year |
| 13e | **Total interest and fee** (13a + 13b + 13c + 13d + 13da) | |
| **14** | **Aggregate liability** (12 + 13e) | |
| **15** | Taxes paid | |
| 15a | Advance tax — column 5 of Schedule IT, by date | |
| 15b | TDS — TDS 1 column 5 + TDS 2 column 9 + TDS 3 column 9 | claimed in own hands |
| 15c | TCS — column 7(i) of Schedule TCS | |
| 15d | Self-assessment tax — column 5 of Schedule IT, by date | |
| 15e | **Total taxes paid** | |
| **16** | **Amount payable** — if 14 > 15e | `ROUND(MAX(0, 14 − 15e), −1)` |
| **17** | **Refund** — if 15e > 14 | `ROUND(MAX(0, 15e − 14), −1)` |

Both 16 and 17 are **rounded to the nearest ten**.

### Line 3 — the rebate under section 87A, as the utility computes it

Not for an HUF. Not for a non-resident.

**Old regime** (`bacValue = 2`): if total income ≤ ₹5,00,000 → `MIN(tax, 12,500)`.
The base excludes the tax on 112A gains and on the 115AD proviso —
`MIN(TaxPayable − SI_112A_Tax − SI_115AD_Tax, 12500)` — the rebate is not
available against long-term equity gains.

**New regime** (`bacValue = 1`):
- total income ≤ ₹12,00,000 → `MIN(tax, 60,000)`
- total income > ₹12,00,000 → **marginal relief**: if the slab tax exceeds the
  excess of income over ₹12 lakh, rebate = `MIN(tax, slab tax − excess)` — the
  person pays no more than the income above ₹12 lakh.

(`Rebate87Aformula_new`, cell P80.)

### Line 5 — the surcharge, as the hidden sheet computes it

Two components, computed separately and added:

**Surcharge_i — on section 115BBE income, at 25%.** Never reduced by marginal
relief.

**Surcharge_ii — on everything else, tiered by total income:**

| Total income | Rate on normal-rate tax | Rate on capital-gains and dividend tax |
|---|---|---|
| over ₹50 lakh to ₹1 crore | 10 | 10 |
| over ₹1 crore to ₹2 crore | 15 | 15 |
| over ₹2 crore to ₹5 crore | 25 | **15** |
| over ₹5 crore | 37 (25 under the new regime) | **15** |

The 15% cap on the capital-gains and dividend portion is line 5A(ii); the rest
is 5A(iii).

**Marginal relief** — the same working at each of the four thresholds
(`Surcharge Calculation for 5000000 / 1 crore / 2 crore / 5 crore`):

```
tempSurcharge   = tax + surcharge at the actual income
taxOnCutOffInc  = tax + surcharge at exactly the threshold (getSlabbedIncome at the cutoff)
marginalRelief  = MAX(0, tempSurcharge − taxOnCutOffInc − (income − threshold))
surcharge       = tempSurcharge − marginalRelief
```

In words: tax plus surcharge may not exceed what it would be at the threshold
plus the income above the threshold. The DTAA-rate income is pulled out of the
base first (`dtaaInc`, `dtaaTax`) and its surcharge worked at 9%.

### What is mandatory

On `PartB-TI` — the head totals, gross total income, deductions, total income,
the special-rate and aggregate lines, current-year loss carried, deemed income.
On `PartB_TTI` — the whole `ComputationOfTaxLiability` object, `TaxPaid`,
`Refund` with its bank block, and `AssetOutIndiaFlag`.

### The bank block, and the two closing questions

**Bank accounts held in India** — *"Do you have a bank account in India?"* —
then one row per account: IFS code, name of bank, account number, **type**,
and *"select account for refund credit — tick at least one."* The sheet's
note: *"All bank accounts held at any time is to be reported, except dormant
accounts."* And *"Please validate Schedule CG before importing bank details."*

**Non-residents without an Indian account** may give a foreign account: SWIFT
code, name of bank, country, **IBAN**.

**The foreign-asset question** — *"Do you at any time during the previous year
hold, as beneficial owner, beneficiary or otherwise, any asset located outside
India, or have signing authority in any account outside India, or have income
from any source outside India?"* — Yes/No; Yes means Schedule FA is required.
Schema: `AssetOutIndiaFlag`, YES / NO.

**Tax return preparer** — identification number, name, counter-signature,
reimbursement from Government if any. Schema: the optional
`TaxReturnPreparer` block.

---

## What this means for the build

1. **Part B-TI as a result block with the form's line numbers** — 1 to 17,
   every hidden line omitted, every figure fed from its schedule.
2. **Two engine corrections** — VI-A capped at GTI minus special-rate income;
   agricultural income for rate only above the exemption.
3. **Part B-TTI as a result block, 1 to 17** — with the AMT comparison at 8,
   the credit at 9, the ESOP split at 8a/8b/8c, relief at 11 from TR, and
   **234-I** at 13da.
4. **The 87A rule as the utility has it** — old regime excluding 112A tax from
   the base; new regime with marginal relief above ₹12 lakh.
5. **The surcharge as the hidden sheet has it** — two components, the 15% cap,
   marginal relief at four thresholds by the cutoff comparison, DTAA income at
   9%.
6. **The exemption cell** — use the statute for the slab; note the utility's
   ₹4L senior figure on the line-15 test and flag it in the checks.
7. **Rounding** — 12 to the nearest ten; 16 and 17 to the nearest ten.
8. **Export** — every line of both objects to the schema's keys; the bank
   block; `AssetOutIndiaFlag`; `TaxReturnPreparer` when given.
