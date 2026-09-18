# Hand-checked case — section `loss` (CYLA · BFLA · CFL · UD), ITR-5 AY 2026-27

Traces `engLoss()` (compute order 46) line by line for one case and ties every
figure to the rupee. Verified against the built engine with a Node harness that
stubs the shell globals; each assertion below prints PASS. All four blocks of
the export also validate against the ITR-5 schema (Draft-04).

## Inputs (old regime — `S.fs.optout="Yes"`, so `isNew()=false`)

Cross-head figures the income sections publish into `S.C` (ITR-5 has **no
salary head**):

| upstream key | meaning | value |
|---|---|---|
| `S.C.hp.income` | House property — a loss | −3,50,000 |
| `S.C.bp.a.A37` / `S.C.bp.income` | Business (excl. spec/specified), a profit | 4,00,000-plus → 5,00,000 |
| `S.C.bp.e.lossRemain` | business loss remaining after Sch BP Table-E | 0 |
| `S.C.bp.e.specRemain` / `.specifiedRemain` | speculative / specified income after Table-E | 0 / 0 |
| `S.C.bp.b.B42` / `S.C.bp.c.C48` | speculative / specified P&L (signed) | 0 / 0 |
| `S.C.cg.after.*`, `cg.cflSTCL`, `cg.cflLTCL` | capital gains & unabsorbed CL | 0 |
| `S.C.os.netNormal` / `.raceHorse` / `.dtaaTotal` | other sources | 0 / 0 / 0 |

The person's own Schedule CFL entry: assessment year **2020-21** (row xi, an
8-year window, tier-2) carries a **business loss 5c of 1,00,000**, return filed
31/07/2021 (in time). No 5b (old regime). Schedule UD: nil.

## CYLA — current-year set-off (the ₹2,00,000 HP cap)

- Row i incoming losses: HP loss `G7 = ABS(MIN(−3,50,000, 0)) = 3,50,000`;
  business loss `H7 = bp.e.lossRemain = 0`; OS loss `I7 = ABS(MIN(0, 0)) = 0`.
- HP set-off **pool** = `min(3,50,000, 2,00,000) = 2,00,000` (old regime, not nil);
  the **excess 1,50,000** goes straight to CFL.
- Col-1 income: `bus = MAX(A37, 0) = 5,00,000`; every other head 0.
- HP-loss walk (order bus → spec → …): the whole 2,00,000 lands on Business.
  `setHP.bus = 2,00,000`.
- Row xvi totals: **`TotHPlossCurYrSetoff = min(2,00,000, 3,50,000, 2,00,000) =
  2,00,000`** — exactly the s.71(3A) cap (schema `maximum:200000`).
- Row xvii remaining: `hpRemain`: because `totHPset (2,00,000)` is **not** below
  2,00,000, the balance carried is just the excess = **1,50,000 → CFL**.
- Col-5: `afterC.bus = 5,00,000 − 2,00,000 = 3,00,000`.

## BFLA — brought-forward set-off

- `bf.bus = 1,00,000` (the 2020-21 5c figure, an 8-year head still in window).
- `setBF.bus = min(1,00,000, afterC.bus 3,00,000) = 1,00,000`.
- No brought-forward depreciation / 35(4) (Schedule UD nil) → cols 3,4 = 0.
- Col-5: `afterB.bus = 3,00,000 − 1,00,000 = 2,00,000`.
- **`IncomeOfCurrYrAftCYLABFLA` (gti) = 2,00,000.**
- `usedBF.bus = 1,00,000`.

## CFL — carry-forward

- xix current-year losses: `cur.hp = hpRemain = 1,50,000`; `cur.bus = busRemain
  = 0`; the rest 0.
- xx distribution (investment-fund only) = 0 → xxi `curCF = xix`.
- xxii total carried forward, with the 8-year window lapse
  `cf = MAX(0, bf − MAX(usedBF, oldest)) + curCF`:
  - business: `MAX(0, 1,00,000 − MAX(1,00,000, oldest2018-19=0)) + 0 = 0` (fully used).
  - house property: `MAX(0, 0 − 0) + 1,50,000 = 1,50,000`.
  - **`cf.total = 1,50,000`.**

## GTI reconciliation

`loss.income` is the correction so that Σ heads = true GTI (BFLA total):
`otherHeads = −3,50,000 + 5,00,000 + 0 + 0 = 1,50,000`; `income = gti − otherHeads
= 2,00,000 − 1,50,000 = 50,000`. Check: `−3,50,000 + 5,00,000 + 50,000 =
2,00,000 = gti`. ✓

## Schedule UD scenario (second harness) — the two totals that feed BFLA

Business income 8,00,000; UD row AY 2023-24: b/f depreciation 3,00,000, set-off
2,50,000 (→ `BalCFNY = MAX(3,00,000−0−2,50,000,0)=50,000`); b/f 35(4) allowance
60,000, set-off 40,000 (→ `AllowBalCFNY = 20,000`); 2026-27 balance 1,20,000.

- `TotCurYrdepritSetoffInc` (col-4 total) = 2,50,000 == BFLA `TotUnabsorbedDeprSetoff` (rule 534). ✓
- `TotCurYrAllowSetoffInc` (col-7 total) = 40,000 == BFLA `TotAllUs35cl4Setoff` (rule 533). ✓
- `TotDepritBalCFNY = 50,000 + 1,20,000 = 1,70,000`; `TotalBalCFNY = 20,000`.
- `afterB.bus = 8,00,000 − 2,50,000 − 40,000 = 5,10,000`. ✓

## Round-trip

`expLoss(j)` → `impLoss(j)` → `engLoss()` → `expLoss(j2)` yields `j2 === j`
(byte-identical). Export blocks `ScheduleCYLA`, `ScheduleBFLA`, `ScheduleCFL`,
`ITRScheduleUD` each validate against the ITR-5 schema.

## `S.C.loss.afterB` published contract (consumed by cg export / SI)

`{ hp, bus, spec, specified, st20, st30, stApp, stDTAA, lt125, ltDTAA, os,
horse, osDTAA }` — the BFLA column-5 (income remaining after CYLA + BFLA) per
head / rate bucket.
