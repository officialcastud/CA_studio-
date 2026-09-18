# Schedule OS (ITR-5) — hand-computed cases

Verifies `forms/ITR-5/src/70_sec_os.js` (engine `engOs`). ITR-5's Schedule OS
is the special-rate machinery **stripped of the individual-only lines**: no 89A
retirement block, no family-pension line / 57(iia) deduction, only five 1b
interest lines (no PF-proviso lines), no s.111 accumulated-PF table, no
56(2)(xiii). The special-rate sub-items are lettered **2c / 2d / 2e** (what
ITR-3 calls 2d / 2e / 2f).

Formulas (cell refs from books/ITR-5/OS.md):
- 1a [N5]  = 1a(i)+1a(ii)+1a(iii)
- 1b [N9]  = bi+bii+biii+biv+bv        (biv PTI may be < 0)
- 1d [N16] = SUM(1d i…v)               (no floor in ITR-5)
- 1e [N22] = OthersInc table + 56(2)(xii)
- 1  [P4]  = 1a+1b+1c+1d+1e
- 2b [N36] = SUM(2b i…vi)
- 2c [N43] = Σ OthersGrossDtls amount
- 2d [N52] = Σ PTIOthersGrossDtls amount
- 2e [N58] = IF(NRI, Σ(TRC="Yes") amt, Σ amt)   (DTAA total)
- P30 DTAA carve-in = Σ DTAA amt whose section code ∈ {56i,56i_f,56,562iii,562x}
- 2  [P30] = MAX(0, 2a(i)+2a(ii)+2b+2c+2d + P30 DTAA carve-in)
- 3c(i)    = MIN(3c entered, 20% × (1a(i)+1a(ii)))   [only if that dividend > 0]
- 3d [N74] = 3a + 3b + 3c(i)                         [3b only if 1c > 0]
- item-1 DTAA portion = Σ DTAA amt whose NatureOfIncome ∈ {1ai,1aiii,1b,1c,1d}
- 6  [P77] = 1 − 3d + MAX(0,4) + 5 − item-1 DTAA portion   (signed → CYLA 4i)
- 7  [P78] = MAX(0,6) + 2
- 8e [P84] = 8a − 8b + 8c + 8d                        (signed → CFL 11xvii)
- 9  [P85] = 7 + MAX(0,8e)
- N60 applicable rate = lower of treaty (col 6) and I.T.-Act (col 9); for an
  NRI blank unless TRC = "Yes"

Published to `S.C.os`: `income` (signed GTI leg), `netNormal`/`posNormal`/
`lossNormal` (item 6 → CYLA), `special`+`item2c`/`item2d`/`item2e`+`splRows`/
`ptiRows`/`dtaaRows` (→ Schedule SI), `raceHorse` (item 8e → CFL), `chargeable`
(item 9), `dtaaTotal`.

---

## Case A — resident firm, every leg populated

Residential status **RES** (so every DTAA row counts).

**Item 1 — normal rates**
| line | input | value |
|---|---|---|
| 1a(i) dividend other | 100000 | 100000 |
| 1a(ii) 2(22)(e)      | 20000  | 20000 |
| 1a(iii) 2(22)(f)     | 0      | 0 |
| **1a** = i+ii+iii    |        | **120000** |
| 1b(i) savings        | 10000  | |
| 1b(ii) deposits      | 50000  | |
| 1b(iii) IT refund    | 2000   | |
| 1b(iv) PTI           | −3000  | |
| 1b(v) others         | 5000   | |
| **1b** = Σ           |        | **64000** |
| 1c rental            | 30000  | **30000** |
| 1d(i) money          | 40000  | |
| **1d** = Σ           |        | **40000** |
| 1e table {X:15000} + 56(2)(xii) 5000 | | **20000** |
| **1 [P4]** = 120000+64000+30000+40000+20000 | | **274000** |

**Item 2 — special rates**
| line | input | value |
|---|---|---|
| 2a(i) 115BB   | 60000 | 60000 |
| 2a(ii) 115BBJ | 10000 | 10000 |
| 2b(i) 68      | 25000 | **2b = 25000** |
| 2c row 5A1ai  | 80000 | **2c = 80000** |
| 2d row PTI_5A1ai | 12000 | **2d = 12000** |
| 2e DTAA row: amt 20000, nature 1b, section **56**, treaty 10, I.T.Act 20 | | **2e = 20000** |
| carve-in (section 56 ∈ normal-rate set) | | 20000 |
| **2 [P30]** = MAX(0, 60000+10000+25000+80000+12000+20000) | | **207000** |
| applicable rate = min(10,20) | | 10 |

**Item 3 — deductions**
| line | formula | value |
|---|---|---|
| 3a expenses | 5000 | 5000 |
| 3b depreciation (1c>0) | 3000 | 3000 |
| 3c entered | 30000 | |
| 3c(i) eligible = min(30000, 20%×120000=24000) | | **24000** |
| **3d** = 5000+3000+24000 | | **32000** |

**Items 4–9**
| line | formula | value |
|---|---|---|
| 4 not-deductible u/s 58 | 4000 | 4000 |
| 5 profits u/s 59 | 2000 | 2000 |
| item-1 DTAA portion (nature 1b) | | 20000 |
| **6 [P77]** = 274000 − 32000 + 4000 + 2000 − 20000 | | **228000** |
| **7 [P78]** = max(0,228000) + 207000 | | **435000** |
| 8a 50000, 8b 10000, 8c 2000, 8d 1000 | | |
| **8e [P84]** = 50000−10000+2000+1000 | | **43000** |
| **9 [P85]** = 435000 + max(0,43000) | | **478000** |

**Published rolls:** netNormal 228000, posNormal 228000, lossNormal 0,
special 207000, item2c 80000, item2d 12000, item2e 20000, raceHorse 43000,
chargeable 478000, income (signed) = 207000+228000+43000 = **478000**.

Harness result: **CASE1 ALL MATCH**; export item1/2/6/7/9 = 274000 / 207000 /
228000 / 435000 / 478000; all ten quarterly `DateRange` objects emitted;
import → re-export **round-trip identical**.

---

## Case B — non-resident, TRC gate + losses

Residential status **NRI**. One DTAA row with **TRC = "No"** must NOT count.

| line | input | value |
|---|---|---|
| 1b(i) savings | 1000 | 1 [P4] = **1000** |
| 2c row **5BBF** (115BBF patent) | 5000 | 2c = 5000 |
| 2e DTAA row amt 9000, nature 1b, section 56, treaty **NIL**, TRC No | | not counted |
| **2e total [N58]** (NRI, TRC=No) | | **0** |
| applicable rate (NRI, no TRC) | | blank ("") |
| carve-in (row not counted) | | 0 |
| **2 [P30]** = MAX(0, 5000 + 0) | | **5000** |
| 3a expenses | 50000 | 3d = 50000 |
| item-1 DTAA portion (row not counted) | | 0 |
| **6 [P77]** = 1000 − 50000 | | **−49000** (loss → CYLA 4i) |
| **7 [P78]** = max(0,−49000) + 5000 | | **5000** |
| 8a 1000, 8b 8000 | | **8e = −7000** (loss → CFL 11xvii) |
| **9 [P85]** = 5000 + max(0,−7000) | | **5000** |

**Published:** netNormal −49000, lossNormal 49000, income (signed) =
5000 + (−49000) + 0 = **−44000**.

**Checks fired:** `warn DTAA row 1` (NRI, no TRC — amount not counted);
`warn DTAA vs 1b interest` (9000 DTAA > 1000 parent, rules 480-487);
`err Section 115BBF` (a non-resident cannot claim 115BBF/PTI, rules 249/479);
`ok Race horses` (8e loss → CFL 11xvii); `ok Other sources loss`
(item 6 loss → CYLA 4i). Export: 2e total 0, `RateAsPerTreaty` 0 (NIL),
`ApplicableRate` omitted (blank), `BalanceOwnRaceHorse` −7000 signed.

Both cases verified against `engOs`/`expOs`/`impOs` with a stub harness; the
file is clean under `node --check`.
