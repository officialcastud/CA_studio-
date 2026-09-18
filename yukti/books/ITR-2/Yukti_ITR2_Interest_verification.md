# Verification report — the interest engine against the ITR-2 utility

**Status: book 09 is built** — `engInt()` computes 234A, 234B, 234C, 234F and
234-I, and on the two test cases it matched a hand computation exactly. This
report compares it against the utility's own formulas on the **Tax Calculated**
sheet (rows 1–16, 64–92, 94–130, 265–276) and the **IT** sheet's helper columns
(Q to AA), cell by cell. Every difference is listed with the cell that
establishes the utility's rule.

---

## 1 · Section 234A

| Rule | Utility | Yukti today | Verdict |
|---|---|---|---|
| Principal | `B3 = MAX(NetTax − Advance − TDS − TCS − matchedSAT, 0)` | same | ✓ |
| Rounded down to hundreds | `B4 = IF(principal > 100, FLOOR(principal, 100), principal)` | same | ✓ |
| Months | `B13 = DATEDIF(due, current, "m") + 1` — part month as whole; VBA `calculate234Amonths` | same | ✓ |
| Interest | `B15 = principal × 1% × months` | same | ✓ |
| **What `matchedSAT` is** | `D3` (non-audit branch) = `IT_Sat_1 + IT_Sat_2 + IT_Sat_3 + IT_Sat_4 + ExSAT` — and from the IT sheet, `IT_Sat_N` is self-assessment tax paid in **month N from April** (V7 = `IF(S<4, S+9, S−3)`), so Sat_1…4 = **April to July**; `ExSAT` (W7) = SAT paid up to an **extended** due date where one exists | SAT paid **up to the date of filing** | **✗ differs** — the utility reduces 234A only by SAT paid **on or before the due date** (31 July, or the extended date). SAT paid after the due date but before filing does **not** reduce the utility's principal |
| **Which date the delay runs to** | `B12 = IF(filing section is 17 or 18 AND OrigRetFiledDate ≠ "", OrigRetFiledDate, B11)`; `B11 = MAX(TODAY(), verification date)` | the date of filing entered | **✗ differs** — for a **revised (139(5)) or defective (139(9)) return the delay runs to the *original* return's filing date**, not the revised one. And for a fresh return the utility takes the later of today and the verification date |

---

## 2 · Section 234B

| Rule | Utility | Yukti today | Verdict |
|---|---|---|---|
| Assessed tax | `B70 − B68 − B69` = NetTax − TDS − TCS | same | ✓ |
| Test | `B71`: assessed ≥ 10,000 **and** Advance < 90% of assessed | same | ✓ |
| Shortfall | `FLOOR(MAX(0, NetTax − Advance − TDS − TCS), 100)` | same | ✓ |
| Period | VBA `calculate234Bmonths(sheet9.Date)` — from 1 April to the verification date, part month whole, max 24 | same | ✓ |
| Monthly cycle | `B77` principal · `B78 = ROUND(1% × principal)` · `C77 = B84` (next month's principal is this month's carry-forward) | same | ✓ |
| **What a self-assessment challan does inside the cycle** | `B80` balanceInterest = 234F + 234A + 234C + this month's 234B · `B81` SAT paid this month · **`B82 = MIN(SAT, balanceInterest)` — the challan first pays the interest accrued** · `B83 = MAX(0, MIN(SAT − B82, principal))` — **only the remainder reduces principal** · `B84 = principal − B83` | the whole challan reduces principal | **✗ differs** — the utility applies a self-assessment payment **first to accrued interest, then to principal**. Where interest has accrued, less of the challan reaches the principal, and the next month's 234B is higher than Yukti's |
| Extra gate | `B92 = IF(NetTax ≥ 10000, …)` | not present | minor — the assessed-tax gate already covers it in practice |

---

## 3 · Section 234C

This is the largest difference.

| Rule | Utility | Yukti today | Verdict |
|---|---|---|---|
| Instalments and rates | 15 / 45 / 75 / 100 %, interest 3 / 3 / 3 / 1 months at 1% | same | ✓ |
| Safe harbour | `E271 = FLOOR(12% × base, 100)`, `E272 = FLOOR(36% × base, 100)`; `G = IF(paid ≥ safe, 0, …)` | same | ✓ |
| Shortfall floored to hundreds | `G = FLOOR(MAX(0, required − paid), 100)` | same | ✓ |
| Base net of relief | `C271 = base − TDS − TCS − TotTaxRelief − RebateUs88E` | net after relief | ✓ |
| **The base per instalment** | Rows 117–121: the tax on income **cumulative to each instalment date** — `B117 = CG Table F Q1 + OS dividend Q1 + 2(22)(f) dividend Q1`; `F117` = normal income less the special-rate income **not yet accrued** by that date; `H117 = slab tax on (G117 + exemption)` — so a capital gain in December is charged only from the third instalment | the **whole-year** tax × 15 / 45 / 75 / 100 % for every instalment | **✗ missing** — Yukti charges the first two instalments on income that had not arisen. The quarterly tables (CG Table F, OS item 10) exist on screen and in the JSON but the interest engine does not read them |
| Exemption applied by quarter | `D117 = applyExemption(exemptionRemaining, 1, quarters)` — the unexhausted basic exemption is applied to the quarterly special-rate income in order | not present | **✗ missing** (follows from the above) |
| Lottery and online games by quarter | rows 127–130: quarter × 30% + surcharge + cess | not present | **✗ missing** (part of the same) |
| **A fifth slot** | `B275 / G275 / H275` — income arising **16 to 31 March** (`Qtr_5`), its own 1-month interest if unpaid by 31 March | four slots only | **✗ missing** |
| **The AMT case** | `B271 = IF(P95, SUM(E267), 0)` where E267 = the 115JC tax — where AMT is the tax payable, the instalments are on AMT, flat; `H276 = Total_234Cii` is used in the 234B chain when `GrossTaxPayable ≠ GrossTaxLiability` | one base for all cases | partly — Yukti's flat base is effectively the AMT-case formula applied everywhere |
| Gate | `H276 = IF(NetTax ≥ 10000, SUM, 0)` | not present | **✗ missing** — no 234C where net tax is under ₹10,000 |
| Senior citizen | via CG Table F's non-mandatory rule | same | ✓ |
| **The instalment cutoff dates** | IT sheet `X7`: Q1 up to **16 June 2025** (`(S=6)*(R>16) → 2`), Q2 up to **20 September 2025** (`(S=9)*(R>20) → 3`), Q3 up to **15 December 2025** (`(S=12)*(R>=16) → 4`), Q4 up to **16 March 2026** (`IF(R<17, 4, 5)`) | 15 June · 15 September · 15 December · 15 March | **✗ differs** — the utility extends Q1 and Q4 by a day (15 June 2025 and 15 March 2026 fell on Sundays) and Q2 to the 20th. A challan dated 16 June is Q1 in the utility, Q2 in Yukti |
| An oddity worth knowing | `X7`: after the June test, `IF(S<8, 1, …)` — so a **July** advance-tax challan is placed in **Q1**. The Tamil Nadu variant `Y7` reads `IF(S<7, 1, …)`, which is what was clearly intended | — | the utility has a bug here; Yukti should not copy it |

---

## 4 · Section 234F and 234-I

| Rule | Utility | Yukti today | Verdict |
|---|---|---|---|
| 234F | ₹5,000 if late; ₹1,000 if total income ≤ ₹5 lakh | same | ✓ |
| 234-I | an input, revised returns only, ≤ 99,999 | same | ✓ |

---

## 5 · Summary

| Section | Built | Matches the utility | Differences |
|---|---|---|---|
| 234A | ✓ | mostly | (1) matchedSAT is SAT **up to the due date**, not up to filing; (2) a revised or defective return runs to the **original** return's date |
| 234B | ✓ | mostly | (3) a self-assessment challan **pays accrued interest first**, then principal |
| 234C | ✓ | **structure only** | (4) the base is **cumulative quarterly tax**, not whole-year tax × %; (5) exemption applied by quarter; (6) lottery by quarter; (7) a **fifth slot** for 16–31 March; (8) the ₹10,000 gate; (9) the cutoff dates 16 Jun / 20 Sep / 15 Dec / 16 Mar |
| 234F | ✓ | ✓ | — |
| 234-I | ✓ | ✓ | — |

Nine differences. Four are small (1, 2, 3, 8, 9 are each a few lines). One is
structural — **234C on cumulative quarterly income** (4, with 5, 6, 7 following
from it), which is the only one that changes the figure materially, and only
for a person whose income arrived unevenly through the year.

On the two test cases run so far the engine matched by hand because the income
was salary-only (even through the year) and the challans fell on the 15ths.
On a capital gain in December with no advance tax, Yukti today would charge
234C for all three earlier instalments; the utility would charge from the third.

---

## 6 · What I would change, if told to

1. `matchedSAT` — sum SAT challans dated on or before 31 July 2026 (and up to
   an extended due date if one is entered).
2. The 234A end date — for filing section 17 or 18 with an original return
   date, use that date.
3. The 234B cycle — each month, apply that month's SAT first to
   (234A + 234C + 234F + 234B accrued so far), remainder to principal.
4. 234C — build the base per instalment from the quarterly tables: CG Table F
   by slot, OS item 10 rows, lottery and online games; normal income cumulative;
   the basic exemption applied in quarter order; slab tax on the cumulative;
   add the fifth 16–31 March slot; gate on net tax ≥ 10,000; use the utility's
   cutoff dates but **not** the July→Q1 bug.
5. Where AMT is the tax payable, use the flat AMT base — the utility's `Total_234Cii`.
