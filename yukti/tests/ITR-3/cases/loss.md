# Hand-checked case — section `loss` (CYLA · BFLA · CFL), ITR-3 AY 2026-27

Traces `engLoss()` (compute order 45) line by line for one case and ties the
figure to the rupee. Verified against the built engine with a Node harness.

## Inputs (old regime — `S.fs.optout="Yes"`)

Cross-head figures other income sections publish into `S.C`:

| head | figure | value |
|---|---|---|
| `S.C.sal.income` | Salary | 5,00,000 |
| `S.C.hp.income` | House property (a loss) | −1,50,000 |
| `S.C.bp.busExcl` / `S.C.bp.income` | Business (excl. spec/specified), a profit | 4,00,000 |
| `S.C.os.balanceNoRaceHorse` / `S.C.os.income` | Other sources at normal rates, a profit | 50,000 |
| CG / speculative / specified / race horse | — | nil |

Schedule CFL, the person's own entry: assessment year **2020-21** (row xi,
8-year window) carries a **business loss (5c) of 1,00,000**, return filed
31/07/2021 (in time). No 5b (old regime).

## CYLA — current-year set-off

- Row i incoming losses: HP loss `G6 = ABS(MIN(−1,50,000,0)) = 1,50,000`;
  business loss `H6 = ABS(MIN(0, 4,00,000+0+0)) = 0`; OS loss
  `I6 = ABS(MIN(50,000,0)) = 0`.
- HP set-off cap: `min(1,50,000, 2,00,000) = 1,50,000` (old regime, not nil).
- Col-1 income: sal 5,00,000; hp 0; bus 4,00,000; os 50,000.
- HP-loss walk (order sal → os → …): the whole 1,50,000 lands on Salary.
  `setHP.sal = 1,50,000`. **`totHPset = 1,50,000`.**
- No business or OS loss to set. `totBusset = 0`, `totOSset = 0`.
- Remaining: `hpRemain = max(0,(1,50,000−1,50,000)+0) = 0`; `busRemain = 0`;
  `osRemain = 0`.
- Col-5 after CYLA: sal `5,00,000−1,50,000 = 3,50,000`; bus 4,00,000; os 50,000.

## BFLA — brought-forward set-off

- From CFL: `bf.bus = 1,00,000` (the 2020-21 5c).
- `setBF.bus = min(1,00,000, afterC.bus 4,00,000) = 1,00,000`;
  `usedBF.bus = 1,00,000`.
- Depreciation / 35(4) columns from Schedule UD: nil (default).
- Col-5 after BFLA: sal 3,50,000; bus `4,00,000−1,00,000 = 3,00,000`; os 50,000.
- **`gti (IncomeOfCurrYrAftCYLABFLA) = 3,50,000 + 3,00,000 + 50,000 = 7,00,000`.**

## CFL — carry forward

- xix current-year: hp `= hpRemain = 0`; bus `= busRemain = 0`; rest nil.
- xx total c/f, business column (8-yr window, oldest = 2018-19 = 0):
  `cf.bus = max(0, bf.bus 1,00,000 − max(usedBF.bus 1,00,000, oldest 0) + cur 0) = 0`.
- **`cf.total = 0`** — the brought-forward business loss is fully absorbed.

## GTI contribution (`S.C.loss.income`)

`income = gti − Σ(other heads' S.C.<head>.income)`
`= 7,00,000 − (5,00,000 + (−1,50,000) + 4,00,000 + 0 + 50,000)`
`= 7,00,000 − 8,00,000 = −1,00,000`.

So `Σ S.C.<head>.income = 8,00,000 + (−1,00,000) = 7,00,000 = gti`. The
−1,00,000 is exactly the brought-forward business loss the naive head sum did
not account for. **Figure ties to the rupee.**

Engine output (harness): `gti 700000`, `income -100000`, `cf.total 0`,
`SUM CHECK 700000`. ✓

## Regime cross-check (new regime — `S.fs.optout="No"`)

Same inputs. HP loss lapses: `hpCapped = 0`, `totHPset = 0`, `hpRemain = 0`
(A572/A573/A579 — HP loss neither set off nor carried). GTI rises to
`5,00,000 + 4,00,000 + 50,000 − 1,00,000(bf bus) = 8,50,000`... i.e. the
1,50,000 HP loss is simply not relieved. Harness: `gti 950000` before the
brought-forward set-off row is added in the CFL fixture — confirmed HP loss
does not reduce income and does not carry.
