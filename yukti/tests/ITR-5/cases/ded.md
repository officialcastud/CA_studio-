# Section `ded` — hand-computed cases (ITR-5, A.Y. 2026-27)

File under test: `forms/ITR-5/src/70_sec_ded.js` (engine `engDed`, export `expDed`,
import `impDed`, checks `chkDed`, `reg(order 50, corder 50)`).

Books: `books/ITR-5/VI_A.md`, `80G.md`, `80GGA.md`, `80GGC.md`, `RA.md`, `80.md`,
`80IAC.md`, `80LA.md`, `80P.md`, `10AA.md`. Consumes `S.C.loss.afterB`
`{hp,bus,spec,specified,st20,st30,stApp,stDTAA,lt125,ltDTAA,os,horse,osDTAA}`
(BFLA col-5, per `tests/ITR-5/cases/loss.md`) for GTI / special-rate income /
business-income pool; the tax section (order 90) re-applies the authoritative cap.

All figures verified with a node harness that loads `shell/shell.js` (helpers only)
+ this section; the 12 emitted blocks validate against
`sources/ITR-5/ITR-5_2026_Main_V1_1_schema.json` (draft-04); export→import→export is
byte-identical.

---

## Case A — OLD regime: 80G qualifying limit + the GTI clamp

**Identity / regime.** Status `1` Partnership Firm, sub-status "1-Partnership Firm",
`S.fs.optout = "Yes"` (old regime), IFSC-forex `N`.

**Income (from `S.C.loss.afterB`).** `bus = 1,50,000`; every other head 0.
→ GTI = 1,50,000; special-rate income = 0; **GTI net = 1,50,000**; business pool
(non-presumptive, no 44AD/ADA/AE) = 1,50,000.

**Chapter VI-A claimed.**
- Schedule 80G donees:
  - Bucket **A** (100%, no limit): other-mode ₹50,000.
  - Bucket **C** (100%, with limit): other-mode ₹2,00,000.
  - Bucket **D** (50%, with limit): cash ₹5,000 + other ₹95,000 = ₹1,00,000.
- Part C: **80JJAA** keyed ₹1,00,000 (the only Part C line).

### 80G qualifying-limit waterfall (80G.md)
- Cash > ₹2,000 is disallowed: bucket D cash ₹5,000 → 0 eligible cash, so D base = ₹95,000 (other only).
- Part C raw before 80G = 80JJAA ₹1,00,000.
- **Qualifying limit** `[X3]` = 10% × max(0, TI − (80GGA + 80GGC + Part C))
  = 10% × (1,50,000 − 0 − 0 − 1,00,000) = 10% × 50,000 = **₹5,000**.
- **A** `[O12]` = min(50,000, TI) = **50,000**.
- **B** = 0 (no bucket-B donee).
- **C** `[O31/O36]`: per-row min(min(2,00,000, TI), QL) = min(2,00,000, 5,000) = 5,000;
  C_raw = 5,000; C total = min(5,000, QL 5,000) = **5,000**.
- **D** `[AA3/O48]`: CDE = max(0, round((QL − C_raw)/2)) = round((5,000 − 5,000)/2) = 0;
  D total = round(min(TI, min(0, 95,000/2))) = **0**.
- **80G eligible** `[O52]` = 50,000 + 0 + 5,000 + 0 = **₹55,000**.

### Part totals and the GTI clamp (VI_A.md)
- Part B raw = 80G 55,000 + 80GGA 0 + 80GGC 0 = **55,000**; Part B `[K8]` = min(55,000, GTI net 1,50,000) = **55,000**.
- Part C raw = 80JJAA 1,00,000; Part C `[K21]` = min(1,00,000, business pool 1,50,000) = **1,00,000**.
- Total (col I / sl.3) = 55,000 + 1,00,000 = **1,55,000**.
- **Grand total `[K22]` = min(GTI net 1,50,000, Part B + Part C 1,55,000) = ₹1,50,000** ← the GTI
  clamp bites: `clipped = true`.

### Export check (`ScheduleVIA`)
- `UsrDeductUndChapVIA`: TotPartB 55,000, TotPartC 1,00,000, **TotalChapVIADeductions 1,55,000** (uncapped col I).
- `DeductUndChapVIA`: TotPartB 55,000, TotPartC 1,00,000, **TotalChapVIADeductions 1,50,000** (clamped col K).
- `Schedule80G` emits buckets A, C, D (B absent), `TotalEligibleDonationsUs80G = 55,000`.

### Published `S.C.ded`
`allowed = 1,50,000`, `partB = 55,000`, `partC = 1,00,000`, `partCForAMT = 1,00,000`
(= Part C − 80P 0), `ded10AA = 0`, `clipped = true`.

---

## Case B — NEW regime: closures zero out; only 80JJAA and 80LA(1A) survive

**Identity / regime.** Status `1`, sub-status "2-LLP (Limited Liability Partnership)",
`S.fs.optout = "No"` (new regime u/s 115BAC(1A)/115BAD/115BAE), IFSC-forex **`Y`**.

**Income.** `S.C.loss.afterB.bus = 8,00,000`; other heads 0 → GTI 8,00,000, special 0.

**Everything claimed** (to prove the closures):
80G bucket A ₹50,000 · 80GGC other ₹20,000 · 80-IA infrastructure ₹1,00,000 ·
keyed 80IBA ₹50,000 · keyed 80JJA ₹40,000 · keyed **80JJAA ₹1,00,000** ·
80LA(1A) unit ₹70,000 · Schedule 10AA ₹60,000.

### Expected `S.C.ded.out` — every closed line is 0
| line | value | why |
|---|---|---|
| c80g, c80gga, c80ggc | 0 | Part B closed under 115BAC (VI_A.md; 80G rule 610, 80GGC rule 581) |
| c80ia, c80iab, c80iac, c80ib, c80iba, c80ie, c80jja, c80la1, c80p | 0 | Part C closed (except the two survivors) |
| **c80jjaa** | **1,00,000** | survives (VI_A.md "except 80JJAA & 80LA(1A)"); ≤ GTI net |
| **c80la1a** | **70,000** | survives (IFSC exception); needs IFSC-forex = Yes ✓ |
| c80la1 | 0 | 80LA(1) closes in the new regime, and forex=Yes bars it anyway |

- Part B = **0**; Part C = 80JJAA 1,00,000 + 80LA(1A) 70,000 = **1,70,000**;
  **allowed = 1,70,000**; `partCForAMT = 1,70,000` (no 80P); **`ded10AA = 0`** (10AA closed).

### Export check
- `ScheduleVIA.DeductUndChapVIA` = `{Section80JJAA:1,00,000, Section80LA_1A:70,000,
  TotPartBchapterVIA:0, TotPartCchapterVIA:1,70,000, TotalChapVIADeductions:1,70,000}`.
- **Only `ScheduleVIA` and `Schedule80LA` are emitted** — the closed sub-schedules
  (`Schedule80G`, `Schedule80_IA`, `Schedule80P`, `Schedule10AA`, …) are suppressed in
  the new regime (expDed guards them behind `!isNew()` / the regime-zeroed totals).
- A `chkDed` warning lists the closed deductions set to zero, and a second warning for 10AA.

---

## AMT add-back exposed for the AMT section
`S.C.ded.partCForAMT` = (Part C calc − 80P calc) is the ITR-5 AMT sl.2a figure
(`AMT.md [H6]`: "Chapter VI-A Part C less 80P"); the AMT section applies its own cap
(GTI − special-rate − specified-business profit). `S.C.ded.ded10AA` feeds AMT sl.2b and
Part B-TI sl.12. `S.C.ded.allowed` feeds Part B-TI sl.11c.

## Verification run
- `node --check forms/ITR-5/src/70_sec_ded.js` → clean.
- Both cases computed by `engDed`; all 12 blocks validate (draft-04); export→import→export identical.
