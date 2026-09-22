# Schedule HP (ITR-5) — hand-computed cases

Verifies `forms/ITR-5/src/70_sec_hp.js` (engine `engProp`/`engHp`). ITR-5 has
**no self-occupied** property; every property runs the full a–k on its gross
rent. The assessee's own share % (J6) is **computed** = 100 − Σ co-owner shares
(when co-owned) else 100. There is **no per-loan interest cap**; the only
₹2,00,000 cap is on the aggregate HP-loss set-off into Schedule CYLA.

Formulas (cell refs from books/ITR-5/HOUSE_PROPERTY.md):
- 1d [H22] = 1b + 1c
- 1e [J23] = max(0, 1a − 1d)
- 1f [J24] = round(1e × own% / 100)
- 1g [H25] = max(round(0.30 × 1f), 0)
- 1h [H26] = TotalInterestUs24B = Σ loan InterestUs24B [J34]
- 1i [J35] = 1g + 1h
- 1j [J36] = round(0.70 × amount received)   (arrears/unrealised rent less 30%)
- 1k [J37] = 1f − 1i + 1j
- row 42 TotalIncomeChargeableUnHP = Σ1k + PassThroghIncome
- CYLA feeds: F8 = max(income,0); G7 = |min(income,0)|;
  P3 = max(income, −200000); T3 = max(0, −income − 200000);
  capLoss = min(|loss|, 200000)  (s.71(3A))

---

## Case A — two properties, net loss within the ₹2 L cap

**Property 1** — Let Out (Y), co-owned YES, one co-owner @ 40% ⇒ own share **60%**
| item | input / formula | value |
|---|---|---|
| 1a gross rent | input | 300000 |
| 1b rent not realized | input | 20000 |
| 1c local taxes | input | 10000 |
| 1d = 1b+1c | | 30000 |
| 1e = max(0, 1a−1d) | 300000−30000 | 270000 |
| own share % | 100 − 40 | 60 |
| 1f = round(1e×60/100) | round(162000) | 162000 |
| 1g = round(0.30×1f) | round(48600) | 48600 |
| 1h interest (1 loan) | 120000 | 120000 |
| 1i = 1g+1h | 48600+120000 | 168600 |
| 1j arrears recd 50000, less 30% | round(0.7×50000) | 35000 |
| **1k = 1f−1i+1j** | 162000−168600+35000 | **28400** |

**Property 2** — Deemed Let Out (D), not co-owned ⇒ own share **100%**
| item | input / formula | value |
|---|---|---|
| 1a gross rent | input | 100000 |
| 1d, 1e | 0 / 100000 | 100000 |
| 1f = 100000×100% | | 100000 |
| 1g = round(0.30×1f) | | 30000 |
| 1h interest (1 loan) | 250000 | 250000 |
| 1i = 1g+1h | | 280000 |
| **1k = 1f−1i+1j** | 100000−280000+0 | **−180000** |

**Schedule totals**
- Σ1k = 28400 + (−180000) = **−151600**
- PassThroghIncome = 0
- **TotalIncomeChargeableUnHP (item 3) = −151600**  (a loss)

**Published on S.C.hp for the losses section**
- income = −151600, posInc = 0, lossAvail = 151600
- P3 (loss for 2 L adjustment) = max(−151600, −200000) = **−151600**  (whole loss ≤ cap)
- T3 (loss beyond 2 L) = max(0, 151600−200000) = **0**
- capLoss = min(151600, 200000) = **151600**  → all of it flows to CYLA 2(i)

Engine output (verified): rows k = 28400, −180000; income −151600; P3 −151600; T3 0; capLoss 151600. ✓

---

## Case B — loss exceeds the ₹2 L cap (Property 2 interest 500000)

Property 1 unchanged (1k = 28400). Property 2: 1i = 30000+500000 = 530000,
1k = 100000 − 530000 = **−430000**.

- Σ1k = 28400 − 430000 = **−401600** = TotalIncomeChargeableUnHP
- lossAvail = 401600
- P3 = max(−401600, −200000) = **−200000**  (capped)
- T3 = max(0, 401600−200000) = **201600**  (excess loss carried forward to CFL)
- capLoss = min(401600, 200000) = **200000**  → ₹2,00,000 set off in CYLA, ₹2,01,600 carried forward

Engine output (verified): p2 1k = −430000; income −401600; P3 −200000; T3 201600; capLoss 200000. ✓

Note: under the **new tax regime** (bacValue=1) the HP loss is not set off at
all — that zeroing is applied by the losses section (CYLA G26), which reads
`S.C.hp.income`; this section only publishes the signed head total and the
P3/T3/capLoss scratch figures.
