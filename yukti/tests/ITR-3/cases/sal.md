# Hand-checked case — Section `sal` (Schedule S), ITR-3

One employer, Central Government (`CGOV`). The same inputs are traced under both
regimes to confirm the 115BAC closures (REGIME.md) and the book formulas.

## Inputs
- **1a — Salary u/s 17(1)** breakup: Basic (code 1) ₹6,00,000; DA (code 2) ₹2,00,000;
  HRA (code 4) ₹1,20,000 → `s17_1` = **₹9,20,000**
- **1b — Perquisites u/s 17(2)**: ₹50,000 → `s17_2` = **₹50,000**
- **1c / 1d / 1e / 1f**: nil
- **10(13A) HRA working**: place = Metro; salary (basic+DA) ₹8,00,000; HRA received
  ₹1,20,000; rent paid ₹3,00,000
- **Exempt allowance dropdown**: 10(5) LTA ₹20,000
- **16(ii)** entertainment ₹4,000 · **16(iii)** professional tax ₹2,500
- Relief u/s 89A: nil (no 1d)

## Arithmetic — OLD regime (`S.fs.optout="Yes"`, everything open)
| Book cell / item | Formula | Value |
|---|---|---|
| [E7] Gross Salary | 1a+1b+1c+1d+1e+1f = 9,20,000+50,000 | **9,70,000** |
| basic / basic+DA | code 1 / codes 1,2 | 6,00,000 / 8,00,000 |
| [J72] HRA (B) rent−10% sal | 3,00,000 − 80,000 | 2,20,000 |
| [E73] HRA (C) 50% of sal (metro) | 0.50 × 8,00,000 | 4,00,000 |
| [J74] Eligible 10(13A) | max(0, min(A 1,20,000, B 2,20,000, C 4,00,000)) | **1,20,000** |
| [L59] Allowances exempt u/s 10 | dropdown 20,000 + HRA 1,20,000 | **1,40,000** |
| [L75] Net Salary | max(0, 9,70,000 − 0 − 1,40,000) | **8,30,000** |
| [J77] Std deduction 16(ia) | min(8,30,000, 50,000) | 50,000 |
| 16(ii) entertainment | CGOV ok → min(5,000, 4,000, ⌊6,00,000/5⌋) | 4,000 |
| 16(iii) professional tax | min(5,000, 2,500) | 2,500 |
| [L76] Deduction u/s 16 | 50,000+4,000+2,500 | **56,500** |
| [L80] Income under 'Salaries' | max(0, 8,30,000 − 56,500) | **7,73,500** |

`S.C.sal.income = 7,73,500` → contribution to Gross Total Income.

## Arithmetic — NEW regime (`S.fs.optout="No"`, 115BAC closures)
- HRA 10(13A) exemption forced to **0** ([J69] bacValue=1).
- 10(5) is not in the 115BAC subset {10(14)(i)(115BAC), 10(14)(ii)(115BAC)} → exempt **0**.
- Net Salary = 9,70,000 − 0 − 0 = **9,70,000**.
- Std deduction 16(ia) = min(9,70,000, **75,000**) = 75,000 (the larger, new-regime figure).
- 16(ii) = 0, 16(iii) = 0 → Deduction u/s 16 = **75,000**.
- Income under 'Salaries' = 9,70,000 − 75,000 = **8,95,000**.

## engSal() output (verified by running the engine)
- OLD → `income: 773500`, net 830000, exempt 140000, hra13a 120000, d16ia 50000, d16 56500. ✓
- NEW → `income: 895000`, net 970000, exempt 0, hra13a 0, d16ia 75000, d16 75000. ✓

Both figures match the hand arithmetic to the rupee, and every 115BAC closure in
REGIME.md (16(ii), 16(iii), HRA 10(13A), non-subset 10(14) allowances, the
50,000→75,000 standard-deduction swap) fires exactly on `isNew()`.
