# The book of the interest computations — 234A · 234B · 234C · 234F · 234-I · ITR-2, A.Y. 2026-27

Read from the utility's hidden **Tax Calculated** sheet (345 rows) — the
formulas at rows 1 to 16 (234A), 64 to 92 (234B), 94 to 289 (234C) — and the
named formulas they reference. These are the workings behind Part B-TTI lines
13a to 13da.

---

## 1 · The inputs every computation reads

| Named cell | What it is |
|---|---|
| `Sheet9.NetTaxLiability` | Part B-TTI line 12 — tax after credits and relief |
| `Sheet9.AdvanceTax` | line 15a — challans in Schedule IT dated on or before 31 March 2026 |
| `Sheet9.TDS` · `Sheet9.TCS` | lines 15b, 15c — credits claimed in own hands |
| `matchedSAT` | self-assessment tax paid **before the date of filing** |
| `dueDate` | 31 July 2026 for ITR-2 (`finalDuedate`, row 7 — the audit branches are ITR-3) |
| `currentDate` | the date of filing entered in Part A |
| the quarterly tables | Schedule CG Table F, Schedule OS item 10, the dividend quarters |

---

## 2 · Section 234A — interest for default in furnishing the return

**Applies** when the return is filed after the due date.

| Step | Formula | Cell |
|---|---|---|
| principal | `MAX(NetTaxLiability − AdvanceTax − TDS − TCS − matchedSAT, 0)` | B3 |
| rounded down | `IF(principal > 100, FLOOR(principal, 100), principal)` | B4 |
| months | `IF(currentDate < dueDate, 0, DATEDIF(dueDate, currentDate, "m") + 1)` — a part of a month counts as a whole month | B13 / VBA `calculate234Amonths` |
| **interest** | `principal × 1% × months` | B15 |

`matchedSAT` — self-assessment tax paid before the return is filed reduces the
234A principal (the *CIT v Prannoy Roy* rule, which the utility follows). Tax
paid after filing does not.

---

## 3 · Section 234B — interest for default in payment of advance tax

**Applies** when assessed tax is ₹10,000 or more **and** advance tax paid is
less than 90% of it.

| Step | Formula | Cell |
|---|---|---|
| assessed tax | `NetTaxLiability − TDS − TCS` | B70 − B68 − B69 |
| test | `assessed ≥ 10000 AND AdvanceTax < 0.9 × assessed` | B71 |
| shortfall | `FLOOR(MAX(0, NetTaxLiability − AdvanceTax − TDS − TCS), 100)` | B71 |
| period | from **1 April 2026** to the date of filing, in months, part month as whole — VBA `calculate234Bmonths` | B74 |

**Then the monthly cycle** — *"234B — 24 cycles"* (rows 76 to 92). The
utility does not multiply shortfall × months. It runs month by month:

```
month 1:  principal₁ = shortfall
          interest₁  = ROUND(1% × principal₁)
month n:  principalₙ = principalₙ₋₁ − self-assessment tax paid in month n−1
          interestₙ  = ROUND(1% × principalₙ)
total     = Σ interestₙ for n = 1 … period, capped at 24 months
```

So a self-assessment challan paid in, say, June stops interest on that amount
from July. The `balanceInterest` row (80) shows the running total with 234A,
234C and 234F folded in — the utility tracks the whole interest bill month by
month, because a challan paid in a month first meets the interest accrued and
then the tax.

**`interest234B = IF(assessed ≥ 10000, MAX(of the cumulative at the period), 0)`** (B92).

---

## 4 · Section 234C — interest for deferment of advance tax

The instalments, on the **tax on total income** for the year, less TDS and TCS
(`taxDue`):

| Instalment | By | Required, cumulative | Interest |
|---|---|---|---|
| 1 | 15 June 2025 | 15% | 1% × 3 months on the shortfall |
| 2 | 15 September 2025 | 45% | 1% × 3 months |
| 3 | 15 December 2025 | 75% | 1% × 3 months |
| 4 | 15 March 2026 | 100% | 1% × 1 month |

The safe-harbour on the first two — from the formulas at rows 271 and 272:

```
Q1: IF(paid ≥ 12% of taxDue, 0, FLOOR(MAX(0, 15% − paid), 100))
Q2: IF(paid ≥ 36% of taxDue, 0, FLOOR(MAX(0, 45% − paid), 100))
Q3:                             FLOOR(MAX(0, 75% − paid), 100)
Q4:                             FLOOR(MAX(0, 100% − paid), 100)
```

Where at least 12% is paid by 15 June, or 36% by 15 September, that
instalment's interest is nil even if it is short of 15% or 45%.

### The quarterly income — the part that makes 234C a working, not a formula

Income that **arose after** an instalment date cannot be charged interest for
that instalment. So the utility builds the tax due **quarter by quarter** from:

| Source | Cells |
|---|---|
| capital gains, by quarter | Schedule CG Table F (`AccSTCGOTH.*`) |
| dividend under 1a(i) and 1a(iii), by quarter | Schedule OS item 10 (`BBDA_1aiii.*`, `IncD_q*OS1`) |
| lottery and the other special-rate rows, by quarter | Schedule OS item 10 |
| the normal-rate balance | spread evenly |

Rows 117 to 121 total each quarter; `applyExemption` (D117 …) applies the
basic exemption to the quarterly income in order; the tax on each quarter's
cumulative income is then the instalment base. A gain in Q3 is charged only
from Q3.

`exemptionRemaining` (B109) — where normal-rate income is below the exemption,
the balance is applied to the special-rate quarters first, so 234C is not
charged on income the exemption covers.

`MarginalRelief` (B99) flags whether surcharge marginal relief applied, because
the per-quarter surcharge then has to be prorated rather than rated
(rows 285 to 289).

The senior-citizen rule from Schedule CG's Table F — no advance tax, so no
234C — applies here through the same tables.

---

## 5 · Section 234F — fee for default in furnishing the return

| Condition | Fee |
|---|---|
| filed after the due date, total income above ₹5,00,000 | ₹5,000 |
| filed after the due date, total income ₹5,00,000 or less | ₹1,000 |
| filed by the due date | nil |

`Sheet9.IntrstPayUs234F`, line 13d.

## 6 · Section 234-I — fee for furnishing a revised return

New this year — line 13da, `FeeFurnish234I`. An amount the person enters
where the return is a revised return under 139(5); the schema caps it at
five digits. The utility does not compute it.

---

## 7 · How the four land in Part B-TTI

| Line | Field |
|---|---|
| 13a | 234A |
| 13b | 234B |
| 13c | 234C |
| 13d | 234F |
| 13da | 234-I |
| 13e | total |
| 14 | aggregate = 12 + 13e |

And the two closing figures, rounded to the nearest ten: 16 payable = 14 − 15e
if positive; 17 refund = 15e − 14 if positive.

---

## 8 · What this means for the build

1. **234A** — principal net of self-assessment tax paid before filing, floored
   to hundreds, months from the due date with a part month as whole.
2. **234B** — the 10,000 / 90% test, then the **monthly cycle** with the
   principal reducing as self-assessment challans are paid, capped at 24 months.
   Today's engine multiplies shortfall by months; it has to walk the months.
3. **234C** — the four instalments with the 12% / 36% safe-harbour, on
   quarterly tax built from CG Table F and OS item 10 with the exemption applied
   in order; the senior-citizen exemption.
4. **234F** — as today.
5. **234-I** — an input, only for a revised return.
6. Every figure to the schema's `IntrstPay` object; 16 and 17 rounded to ten.
