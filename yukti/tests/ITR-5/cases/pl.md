# Section `pl` — hand-computed case (ITR-5, A.Y. 2026-27)

Blocks: `ManufacturingAccount`, `TradingAccount`, `PARTA_PL`.
Every figure below is computed by hand from the books
(`MANUFACTURING_ACCOUNT.md`, `TRADING_ACCOUNT.md`, `PROFIT_LOSS.md`) and asserted
against `engPl()` in a node harness (all OK). A firm with regular books, one
manufacturing account, one trading account, a full P&L, plus a 44AE goods-carriage
face to exercise the presumptive arithmetic.

## Manufacturing Account (items 1–3)
Inputs: 1Ai 100000, 1Aii 50000, 1B 500000, 1C 200000, 1Di 10000, 1Dii 20000,
1Diii 5000, 1Ei 30000, 1Eii 15000, 1Eiii 5000, 1Eiv 25000, 1Ev 10000, 1Evi 40000,
2i 80000, 2ii 20000.

| Sl | formula | value |
|---|---|---|
| 1Aiii | 100000 + 50000 | **150000** |
| 1D | 10000 + 20000 + 5000 | **35000** |
| 1Evii | 30000+15000+5000+25000+10000+40000 | **125000** |
| 1F | 150000 + 500000 + 200000 + 35000 + 125000 | **1010000** |
| 2iii | 80000 + 20000 | **100000** |
| 3 (COGP) | 1010000 − 100000 | **910000** |

## Trading Account (items 4–12)
Inputs: 4A(i) 2000000, 4A(iii) one row 50000, 4B 0, 4C all 0, 5 300000, 7 200000,
8 400000, 9(i) 10000, 9(ii) 15000, 9(iii) one row 5000, 10 all 0, 12b 20000, 12d 10000.

| Sl | formula | value |
|---|---|---|
| 4A(iiic) | 50000 | **50000** |
| 4A(iv) | 2000000 + 0 + 50000 | **2050000** |
| 4C(ix) | 0 | **0** |
| 4D | 2050000 + 0 + 0 | **2050000** |
| 6 (credits) | 2050000 + 300000 | **2350000** |
| 9(iii) total | 5000 | **5000** |
| 9 (direct exp) | 10000 + 15000 + 5000 | **30000** |
| 10(xii) | 0 | **0** |
| 11 (from Mfg 3) | 910000 | **910000** |
| 12 (GP) | 2350000 − 200000 − 400000 − 30000 − 0 − 910000 | **810000** |

## Profit & Loss (items 13–61)
Inputs (credits): 14i Rent 30000, 14iv Interest 5000.
Inputs (debits, DebitPlAcnt): 16 20000, 17 10000, 18 15000, 19 25000, 20 5000,
21 5000, 22i 100000, 23i 5000, 24 3000, 25 2000, 30ii 4000, 32ii 6000, 43 5000,
44v(CGST) 3000, 45 10000, 46 50000, 47 (row) 7000, 48i(PAN row) 150000, 48iii 5000,
49 2000, 50 1000, 52iia 20000, 52iib 10000, 53 60000, 55 100000, 58 50000, 60 100000.

| Sl | formula | value |
|---|---|---|
| 13 | 810000 + 20000(12b) + 10000(12d) | **840000** |
| 14xii | 30000 + 5000 | **35000** |
| 15 | 840000 + 35000 | **875000** |
| 22xi | 100000 | **100000** |
| 23v | 5000 | **5000** |
| 30iii | 0 + 4000 | **4000** |
| 32iii | 0 + 6000 | **6000** |
| 44x | 3000 | **3000** |
| 47 | 7000 | **7000** |
| 48iv | 150000 + 0 + 5000 | **155000** |
| 51 (PBIDTA) | 875000 − 433000 (all heads 16..50) | **442000** |
| 52iii | 0 + 0 + 20000 + 10000 | **30000** |
| 54 (PBT) | 442000 − 30000 − 60000 | **352000** |
| 57 (PAT) | 352000 − 100000 − 0 | **252000** |
| 59 | 252000 + 50000 | **302000** |
| 61 | 302000 − 100000 | **202000** |

Item-51 subtractor (433000) = 16..21 (80000) + 22xi (100000) + 23v (5000) +
24..29 (5000) + 30iii (4000) + 31iii (0) + 32iii (6000) + 33..43 (5000) + 44x (3000)
+ 45 (10000) + 46 (50000) + 47 (7000) + 48iv (155000) + 49 (2000) + 50 (1000).

## Presumptive 44AE (item 64)
Two carriages: (a) 15 MT owned 12 months → >12 MT ⇒ Rs 1000/ton/month = 1000×15×12 = **180000**;
(b) 10 MT owned 6 months → ≤12 MT ⇒ Rs 7500/month = 7500×6 = **45000**.

| Sl | formula | value |
|---|---|---|
| 64i total months | 12 + 6 | **18** (≤120 ✓) |
| 64ii (col-5 total) | 180000 + 45000 | **225000** |
| 64iv | MAX(0, 225000 − 0) | **225000** |

## Round-trip
`expPl` → `impPl` → `expPl` reproduces `PARTA_PL`, `ManufacturingAccount` and
`TradingAccount` byte-identically (verified in the harness). Required leaves are
supplied from the block skeletons; optional zero leaves are omitted.

## Checks exercised (`chkPl`)
No-negative (Mfg 1/2), 12b≤12a / 12d≤12c, 22xii(a)=Yes⇒22xii(b)≠0, presumptive
code⇒income mandatory, 44AD 6%/8% floors + turnover cap, 44ADA 50% floor + cap,
44AE months≤120 / >10 carriages / unique registration / 64iii needs 64ii,
no-account GP≤GR, bad-debt PAN/Aadhaar and name+address rules, speculative
turnover required with income. All fire correctly and none throw.
