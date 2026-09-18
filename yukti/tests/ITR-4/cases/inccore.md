# inccore — hand-checked case (to the rupee)

Resident **Individual**, **new** regime (S.fs.optout="No").

## Inputs
- Salary 17(1) = 15,00,000; perquisites 0; profit in lieu 0; no exempt allowances.
- No business, no house property, no other sources, no LTCG 112A, no Chapter VI-A.

## Salary (Income_Details B1)
- Gross salary (i) = 15,00,000  [H111]
- Exempt u/s 10 (ii) = 0  [H121]
- Net salary (iii) = 15,00,000  [H130, #320]
- Std deduction 16(ia) = min(75,000, 15,00,000) = 75,000  [H132]
- 16(ii)/16(iii) closed in the new regime = 0
- Deduction u/s 16 (iv) = 75,000  [H131]
- Income from Salaries (v) = 14,25,000  [H135, #330]

## Part B / C
- B5 Gross Total Income = 14,25,000  [F172]
- C19 Chapter VI-A = 0 ; C20 Total Income = 14,25,000  [F224, #230]

## Part D — new-regime slabs 115BAC(1A), base 14,25,000
- 0–4L: 0
- 4–8L: 5% × 4,00,000 = 20,000
- 8–12L: 10% × 4,00,000 = 40,000
- 12–14.25L: 15% × 2,25,000 = 33,750
- **D1 = 93,750**
- D2 rebate 87A = 0 (base > 12,00,000; marginal 93,750 − 2,25,000 < 0)  [#1135]
- D3 = 93,750  [#260]
- D4 cess @4% = 3,750
- **D5 Total Tax & Cess = 97,500**  [#265]
- D6 relief 0 → D7 = 97,500 → **D12 = 97,500**

engInc/engTax reproduce every figure exactly (verified via node harness).

## Cross-checked variants
- OLD regime, income from salary 14,17,500 (ent 5,000 + ptax 2,500 add to 16), Total Income 12,67,500 after 80C 1,50,000 → D1 = 1,92,750, cess 7,710, D5 = 2,00,460.
- NEW regime, base 11,00,000 → D1 50,000, 87A rebate 50,000 → D3 = 0.
- HP self-occupied, interest 2,50,000: new regime HP income = 0 (24(b) closed); old regime = −2,00,000 (cap).
- Export → import → export byte-identical (round-trip gate 12).
