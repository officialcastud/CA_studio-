# Schedule BP — hand-checked case (section `bp`, order 22)

Traced against `forms/ITR-3/src/70_sec_bp.js` (`engBp`), verified in a node harness
to the rupee. Books: BP.md, DEP_DCG.md, DPM_DOA.md, ESR.md, ICDS.md.

## Inputs (old regime — `S.fs.optout="Yes"`, everything open)

| Source | Field | Value |
|---|---|---|
| BP 1 | Profit before tax as per P&L (`bp.pbt`) | 10,00,000 |
| BP 3c | Capital gains credited to P&L (`bp.a3c`) | 50,000 |
| BP 5a | Share of income from firm — exempt (`bp.a5a`) | 20,000 |
| BP 7d | Other-sources expense debited to P&L (`bp.e7d`) | 10,000 |
| BP 11 | Depreciation debited to P&L (`bp.depDebPL`) | 80,000 |
| BP 14 | Disallowable u/s 36 (`bp.d14`) | 15,000 |
| BP 31 | Any other amount allowable (`bp.d31`) | 5,000 |
| DPM 15% | WDV first day 5,00,000 + additions ≥180 days 1,00,000 | — |
| ESR i | 35(1)(i): debited 30,000, allowable 40,000 | — |
| ICDS I | Accounting Policies increase 25,000 | — |

## Feeder schedules

- **DPM 15%**: fullBase = MAX(0, 5,00,000 + 1,00,000 − 0) = 6,00,000; depreciation at full rate
  = ROUND(6,00,000 × 15/100) = **90,000** → Schedule DEP item 6 total = **90,000** → BP 12i.
- **ESR**: col (4) excess = MAX(0, 40,000 − 30,000) = **10,000** → BP item 28.
- **ICDS**: total increase = MAX(0, 25,000) = **25,000** → BP item 25 (added to any OI stock-deviation part, here 0).

## BP ladder

| Item | Formula | Value |
|---|---|---|
| 6 Balance | 1 − 2a − 2b − 3a…3g − 4a − 4b − 5d − 5A = 10,00,000 − 50,000 − 20,000 | **9,30,000** |
| 9 | 7a…7g + 8a + 8b = 10,000 | 10,000 |
| 10 | 6 + 9 = 9,30,000 + 10,000 | 9,40,000 |
| 12iii | 12i + 12ii = 90,000 + 0 | 90,000 |
| 13 | 10 + 11 − 12iii = 9,40,000 + 80,000 − 90,000 | **9,30,000** |
| 25 | ICDS increase = 25,000 | 25,000 |
| 26 | 14…25 = 15,000 + 25,000 | 40,000 |
| 28 | ESR X(4) = 10,000 | 10,000 |
| 33 | 27…32 = 10,000 + 5,000 | 15,000 |
| 34 | 13 + 26 − 33 = 9,30,000 + 40,000 − 15,000 | **9,55,000** |
| 36 | 34 + 35viii = 9,55,000 + 0 | 9,55,000 |
| A37 | 37a…37f (37f = item 36) | 9,55,000 |
| **D** | MAX(0,C48) + MAX(0,B42) + A37 = 0 + 0 + 9,55,000 | **9,55,000** |

**`S.C.bp.income` = D = ₹9,55,000** (signed contribution to Gross Total Income). Engine output matches. ✔

## Regime gating (new regime — `S.fs.optout="No"`)

- DPM 45% block WDV 2,00,000 → depreciation at full rate = **0** (A310, Rule 5). ✔
- ESR 35(1)(ii) allowable 5,000 → forced to **0**, `gatedZeroed` flag set (A354). ✔
- 35AD deduction (BP 47) 99,999 → **0** (A287). ✔
- Checks raised: "45% block cannot claim depreciation", "ESR weighted deduction closed",
  "35AD deduction closed", "Schedule RA required". ✔
- Old regime: a Schedule UD 115BAC adjustment (col 3a) raises the rule-624 warning. ✔
