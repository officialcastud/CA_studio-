# ITR-5 · LEAF-COVERAGE CHECK — AREA `loss`

Blocks: `ScheduleCYLA` · `ScheduleBFLA` · `ScheduleCFL` · `ITRScheduleUD` (incl. the nested `ScheduleUD[]`).

Schema: `sources/ITR-5/ITR-5_2026_Main_V1_1_schema.json` (leaves enumerated by walking `properties`/`items` and resolving every `$ref`).
Software: `forms/ITR-5/src/70_sec_loss.js` (verified embedded verbatim in the assembled `forms/ITR-5/Yukti_ITR5.html`).
Books cited: `books/ITR-5/CYLA_BFLA.md`, `books/ITR-5/CFL.md`, `books/ITR-5/Unabsorbed_Depreciation.md`.

**283 leaves enumerated · 0 unclassified · 4 ORPHANs (3 of them schema-required).**

`L.70:n` = line *n* of `forms/ITR-5/src/70_sec_loss.js`. Every `data-p` shown is what `inp()` / `sel()` / `grid()`
emit at runtime (`Yukti_ITR5.html:17387-17417`); a grid column becomes `data-p="<gridkey>.<rowindex>.<col>"`.

**Bucket convention.** A cell whose *default* value the engine derives is booked **COMPUTED** even where the sheet's own
"Do you want to edit the auto-populated details?" switch (`CYLAEditFlag` / `BFLAEditFlag`) turns it into a typeable box;
the override `data-p` is named in the evidence so nothing is hidden. This mirrors the book: *"Everything is computed and
read-only; the only interactive controls are the two edit-flag dropdowns"* (`CYLA_BFLA.md:201`).

---

## THE ORPHANS — read this first

### CRITICAL (schema-required leaves) — Schedule CFL row xx, `CurrentYearDistrUnitHolder`

| leaf | schema path | required? | evidence |
|---|---|---|---|
| `TotalHPPTILossCF` | `ScheduleCFL.CurrentYearDistrUnitHolder.LossSummaryDetail.TotalHPPTILossCF` | **REQUIRED** | no `data-p`, no engine expression — see below |
| `TotalSTCGPTILossCF` | `ScheduleCFL.CurrentYearDistrUnitHolder.LossSummaryDetail.TotalSTCGPTILossCF` | **REQUIRED** | no `data-p`, no engine expression — see below |
| `TotalLTCGPTILossCF` | `ScheduleCFL.CurrentYearDistrUnitHolder.LossSummaryDetail.TotalLTCGPTILossCF` | **REQUIRED** | no `data-p`, no engine expression — see below |

### ORPHAN (optional leaf, same block)

| leaf | schema path | required? | evidence |
|---|---|---|---|
| `OthSrcLossRaceHorseCF` | `ScheduleCFL.CurrentYearDistrUnitHolder.LossSummaryDetail.OthSrcLossRaceHorseCF` | optional | no `data-p`, no engine expression — see below |

**What is wrong.** Schedule CFL row **xx** — *"Current year loss distributed among the unit-holder (Applicable for
Investment fund only)"* — is a **typed input row in the department's utility** and the book says in terms that it **is
built**:

> `books/ITR-5/CFL.md:172` — *"(The visible row **xx**, r28, "Current year loss distributed among the unit-holder", **is**
> built — it maps to `CurrentYearDistrUnitHolder` and is not hidden.)"*

> `books/ITR-5/CFL.md:158` — *"**Row xx `CurrentYearDistrUnitHolder`:** `*TotalHPPTILossCF`, `*TotalSTCGPTILossCF`,
> `*TotalLTCGPTILossCF` required (`OthSrcLossRaceHorseCF` optional)."*

The three hidden rows that CFL.md *does* tell the builder to skip are r24H, r25H and r31H (`CFL.md:166-170`) — row xx (r28)
is expressly **not** among them. The utility's own data-validation covers it: `CFL.md:141` lists `G23:W31` among the numeric-entry
ranges, i.e. row 28 is enterable.

**What the software does.** The export always writes this block, always with zeros:

```js
/* 70_sec_loss.js:472-473 */
C.CurrentYearDistrUnitHolder={LossSummaryDetail:{TotalHPPTILossCF:n0(L.distr.hp),TotalSTCGPTILossCF:n0(L.distr.st),
  TotalLTCGPTILossCF:n0(L.distr.lt),OthSrcLossRaceHorseCF:n0(L.distr.horse)}};                                     /* xx */
```

`L.distr` comes from one line in the engine:

```js
/* 70_sec_loss.js:232-233 */
const distr={hp:0,bus:0,spec:0,specified:0,st:0,lt:0,horse:0};
Object.keys(distr).forEach(k=>distr[k]=Math.min(N((S.loss.distr||{})[k]),cur[k]));
```

`S.loss.distr` is **not in the state seed** (`70_sec_loss.js:26-27` seeds only `cfl`, `ud`, `editC`, `editB`, `cylaOver`,
`busOver`, `osOver`, `bflaOver`) and is written in **exactly one place** — `impLoss`, when re-loading a JSON somebody else
already filed:

```js
/* 70_sec_loss.js:517-518 */
const dd=rg(cf,"CurrentYearDistrUnitHolder.LossSummaryDetail");
if(dd){S.loss.distr={hp:N(dd.TotalHPPTILossCF),st:N(dd.TotalSTCGPTILossCF),lt:N(dd.TotalLTCGPTILossCF),horse:N(dd.OthSrcLossRaceHorseCF),bus:0,spec:0,specified:0};}
```

A repo-wide grep confirms it: `grep -rn "loss\.distr" forms/ITR-5/src/` returns exactly three hits — `70_sec_loss.js:231`
(a comment), `:233` (the read above) and `:518` (the import). **No file writes `S.loss.distr` from a screen field, and
there is no `data-p` for it anywhere.** On screen, row xx is a
read-only footer:

```js
/* 70_sec_loss.js:394 */
frow("xx","Current-year loss distributed among unit-holders (investment fund only)",D2)+
```

`frow()` (`70_sec_loss.js:388-390`) emits `F(o.hp)` text — no `inp()`, no input element.

**Why it is an ORPHAN and not NA.** ITR-5 *is* the investment-fund return, and this build supports that assessee:
- sub-status list `70_sec_gen.js:46` offers **`"5-Investment Fund"`** (mapped to code `21` at `70_sec_gen.js:60`);
- `70_sec_gen.js:232` renders **`data-p="fs.invFund"`** — *"Whether you are an investment fund referred to in section 115UB?"*;
- `70_sec_tax.js:66` gives business trusts / investment funds the flat-30% rate;
- `70_sec_other.js:28` builds Schedule PTI for investment funds.

So an AIF Cat I/II filing ITR-5 through this form can reach Schedule CFL, but **cannot enter the loss it distributed to its
unit-holders**.

**Blast radius.** Row **xxi** is defined as *xix − xx* (`CFL.md:125`, rule 569) and the engine implements it —
`curCF[k]=Math.max(0,cur[k]-distr[k])` (`70_sec_loss.js:235`). With xx pinned at 0, **xxi always equals xix**, and then
xxii (`cf`, `70_sec_loss.js:240-243`) is overstated too. `CFL.md:133` (rule 560): *"Investment Fund sub-status → Part B-TI
amount flows from Total of 5cxxi + 6xxi + 7xxi of Sch CFL."* An investment fund therefore carries forward, and reports to
Part B-TI Sl.17, a loss it has already passed through to its unit-holders. Note the schema deliberately gives row xx only
the HP / STCG / LTCG / race-horse legs (`CurrYrDistrLoss`), so the fix needs four input cells, not seven.

**Fix shape (CEO's call, not applied here).** Seed `S.loss.distr`, render four numeric inputs on row xx —
`data-p="loss.distr.hp" | ".st" | ".lt" | ".horse"` — ideally gated on the Investment Fund sub-status / `fs.invFund`, and
keep the existing `Math.min(..., cur[k])` clamp so xx can never exceed xix.

---

## Counts

| block | leaves | INPUT | COMPUTED | NA | ORPHAN |
|---|---:|---:|---:|---:|---:|
| `ScheduleCYLA` | 70 | 1 | 69 | 0 | 0 |
| `ScheduleBFLA` | 68 | 1 | 67 | 0 | 0 |
| `ScheduleCFL` | 127 | 80 | 43 | 0 | 4 |
| `ITRScheduleUD` | 18 | 8 | 10 | 0 | 0 |
| **TOTAL** | **283** | **90** | **189** | **0** | **4** |

No leaf in these four blocks was classified **NA**: the loss schedules carry no other-form-only, portal-filled or
assessee-class-excluded leaf. The rows the books do exclude (CYLA iv / BFLA iii "life insurance u/s 115B"; CFL column O;
CFL r24H / r25H / r31H; the CFL 4b/4c, 9b/9c, 10b/10c PTI sub-columns; the CYLA column-N and BFLA column-M/N/O/P/Q helper
cells) **carry no schema leaf at all** (`CYLA_BFLA.md:51,68,97,180-190`; `CFL.md:85-98,166-170`), so they never entered this
enumeration.

---

## ScheduleCYLA — set-off of the current year's losses (70 leaves)

| leaf | schema path | required? | bucket | evidence |
|---|---|---|---|---|
| `CYLAEditFlag` | `CYLAEditFlag` | — | INPUT | `data-p="loss.editC"` — `sel("loss.editC",[["","No"],["Y","Yes"]])` L.70:322; exported `CY.CYLAEditFlag=S.loss.editC?"Y":"N"` L.70:419 |
| `IncOfCurYrUnderThatHead` | `HP.IncCYLA.IncOfCurYrUnderThatHead` | **REQ** | COMPUTED | `CY[cyKey].IncCYLA.IncOfCurYrUnderThatHead=n0(L.inc["hp"])` L.70:411 ← engLoss `inc` (L.70:142-155), fed by S.C.hp/bp/cg/os |
| `BusLossSetoff` | `HP.IncCYLA.BusLossSetoff` | — | COMPUTED | `c.BusLossSetoff=n0(L.setBus["hp"])` L.70:413 ← CY_ORDER_BUS walk L.70:163; INPUT override `data-p="loss.busOver.hp.bus"` (L.70:314, read at L.70:159) |
| `OthSrcLossNoRaceHorseSetoff` | `HP.IncCYLA.OthSrcLossNoRaceHorseSetoff` | — | COMPUTED | `c.OthSrcLossNoRaceHorseSetoff=n0(L.setOS["hp"])` L.70:414 ← CY_ORDER_OS walk L.70:164; INPUT override `data-p="loss.osOver.hp.os"` (L.70:315, read at L.70:160) |
| `IncOfCurYrAfterSetOff` | `HP.IncCYLA.IncOfCurYrAfterSetOff` | **REQ** | COMPUTED | `c.IncOfCurYrAfterSetOff=n0(L.afterC["hp"])` L.70:411 ← `afterC=inc−setHP−setBus−setOS` L.70:173 |
| `IncOfCurYrUnderThatHead` | `BusProfExclSpecProf.IncCYLA.IncOfCurYrUnderThatHead` | **REQ** | COMPUTED | `CY[cyKey].IncCYLA.IncOfCurYrUnderThatHead=n0(L.inc["bus"])` L.70:411 ← engLoss `inc` (L.70:142-155), fed by S.C.hp/bp/cg/os |
| `HPlossCurYrSetoff` | `BusProfExclSpecProf.IncCYLA.HPlossCurYrSetoff` | — | COMPUTED | `c.HPlossCurYrSetoff=n0(L.setHP["bus"])` L.70:412 ← greedy CY_ORDER_HP walk L.70:162; INPUT override `data-p="loss.cylaOver.bus.hp"` (L.70:313, read at L.70:158) when loss.editC="Y" |
| `OthSrcLossNoRaceHorseSetoff` | `BusProfExclSpecProf.IncCYLA.OthSrcLossNoRaceHorseSetoff` | — | COMPUTED | `c.OthSrcLossNoRaceHorseSetoff=n0(L.setOS["bus"])` L.70:414 ← CY_ORDER_OS walk L.70:164; INPUT override `data-p="loss.osOver.bus.os"` (L.70:315, read at L.70:160) |
| `IncOfCurYrAfterSetOff` | `BusProfExclSpecProf.IncCYLA.IncOfCurYrAfterSetOff` | **REQ** | COMPUTED | `c.IncOfCurYrAfterSetOff=n0(L.afterC["bus"])` L.70:411 ← `afterC=inc−setHP−setBus−setOS` L.70:173 |
| `IncOfCurYrUnderThatHead` | `SpeculationIncome.IncCYLA.IncOfCurYrUnderThatHead` | **REQ** | COMPUTED | `CY[cyKey].IncCYLA.IncOfCurYrUnderThatHead=n0(L.inc["spec"])` L.70:411 ← engLoss `inc` (L.70:142-155), fed by S.C.hp/bp/cg/os |
| `HPlossCurYrSetoff` | `SpeculationIncome.IncCYLA.HPlossCurYrSetoff` | — | COMPUTED | `c.HPlossCurYrSetoff=n0(L.setHP["spec"])` L.70:412 ← greedy CY_ORDER_HP walk L.70:162; INPUT override `data-p="loss.cylaOver.spec.hp"` (L.70:313, read at L.70:158) when loss.editC="Y" |
| `OthSrcLossNoRaceHorseSetoff` | `SpeculationIncome.IncCYLA.OthSrcLossNoRaceHorseSetoff` | — | COMPUTED | `c.OthSrcLossNoRaceHorseSetoff=n0(L.setOS["spec"])` L.70:414 ← CY_ORDER_OS walk L.70:164; INPUT override `data-p="loss.osOver.spec.os"` (L.70:315, read at L.70:160) |
| `IncOfCurYrAfterSetOff` | `SpeculationIncome.IncCYLA.IncOfCurYrAfterSetOff` | **REQ** | COMPUTED | `c.IncOfCurYrAfterSetOff=n0(L.afterC["spec"])` L.70:411 ← `afterC=inc−setHP−setBus−setOS` L.70:173 |
| `IncOfCurYrUnderThatHead` | `SpecifiedBusIncome.IncCYLA.IncOfCurYrUnderThatHead` | **REQ** | COMPUTED | `CY[cyKey].IncCYLA.IncOfCurYrUnderThatHead=n0(L.inc["specified"])` L.70:411 ← engLoss `inc` (L.70:142-155), fed by S.C.hp/bp/cg/os |
| `HPlossCurYrSetoff` | `SpecifiedBusIncome.IncCYLA.HPlossCurYrSetoff` | — | COMPUTED | `c.HPlossCurYrSetoff=n0(L.setHP["specified"])` L.70:412 ← greedy CY_ORDER_HP walk L.70:162; INPUT override `data-p="loss.cylaOver.specified.hp"` (L.70:313, read at L.70:158) when loss.editC="Y" |
| `OthSrcLossNoRaceHorseSetoff` | `SpecifiedBusIncome.IncCYLA.OthSrcLossNoRaceHorseSetoff` | — | COMPUTED | `c.OthSrcLossNoRaceHorseSetoff=n0(L.setOS["specified"])` L.70:414 ← CY_ORDER_OS walk L.70:164; INPUT override `data-p="loss.osOver.specified.os"` (L.70:315, read at L.70:160) |
| `IncOfCurYrAfterSetOff` | `SpecifiedBusIncome.IncCYLA.IncOfCurYrAfterSetOff` | **REQ** | COMPUTED | `c.IncOfCurYrAfterSetOff=n0(L.afterC["specified"])` L.70:411 ← `afterC=inc−setHP−setBus−setOS` L.70:173 |
| `IncOfCurYrUnderThatHead` | `STCG20Per.IncCYLA.IncOfCurYrUnderThatHead` | **REQ** | COMPUTED | `CY[cyKey].IncCYLA.IncOfCurYrUnderThatHead=n0(L.inc["st20"])` L.70:411 ← engLoss `inc` (L.70:142-155), fed by S.C.hp/bp/cg/os |
| `HPlossCurYrSetoff` | `STCG20Per.IncCYLA.HPlossCurYrSetoff` | — | COMPUTED | `c.HPlossCurYrSetoff=n0(L.setHP["st20"])` L.70:412 ← greedy CY_ORDER_HP walk L.70:162; INPUT override `data-p="loss.cylaOver.st20.hp"` (L.70:313, read at L.70:158) when loss.editC="Y" |
| `BusLossSetoff` | `STCG20Per.IncCYLA.BusLossSetoff` | — | COMPUTED | `c.BusLossSetoff=n0(L.setBus["st20"])` L.70:413 ← CY_ORDER_BUS walk L.70:163; INPUT override `data-p="loss.busOver.st20.bus"` (L.70:314, read at L.70:159) |
| `OthSrcLossNoRaceHorseSetoff` | `STCG20Per.IncCYLA.OthSrcLossNoRaceHorseSetoff` | — | COMPUTED | `c.OthSrcLossNoRaceHorseSetoff=n0(L.setOS["st20"])` L.70:414 ← CY_ORDER_OS walk L.70:164; INPUT override `data-p="loss.osOver.st20.os"` (L.70:315, read at L.70:160) |
| `IncOfCurYrAfterSetOff` | `STCG20Per.IncCYLA.IncOfCurYrAfterSetOff` | **REQ** | COMPUTED | `c.IncOfCurYrAfterSetOff=n0(L.afterC["st20"])` L.70:411 ← `afterC=inc−setHP−setBus−setOS` L.70:173 |
| `IncOfCurYrUnderThatHead` | `STCG30Per.IncCYLA.IncOfCurYrUnderThatHead` | **REQ** | COMPUTED | `CY[cyKey].IncCYLA.IncOfCurYrUnderThatHead=n0(L.inc["st30"])` L.70:411 ← engLoss `inc` (L.70:142-155), fed by S.C.hp/bp/cg/os |
| `HPlossCurYrSetoff` | `STCG30Per.IncCYLA.HPlossCurYrSetoff` | — | COMPUTED | `c.HPlossCurYrSetoff=n0(L.setHP["st30"])` L.70:412 ← greedy CY_ORDER_HP walk L.70:162; INPUT override `data-p="loss.cylaOver.st30.hp"` (L.70:313, read at L.70:158) when loss.editC="Y" |
| `BusLossSetoff` | `STCG30Per.IncCYLA.BusLossSetoff` | — | COMPUTED | `c.BusLossSetoff=n0(L.setBus["st30"])` L.70:413 ← CY_ORDER_BUS walk L.70:163; INPUT override `data-p="loss.busOver.st30.bus"` (L.70:314, read at L.70:159) |
| `OthSrcLossNoRaceHorseSetoff` | `STCG30Per.IncCYLA.OthSrcLossNoRaceHorseSetoff` | — | COMPUTED | `c.OthSrcLossNoRaceHorseSetoff=n0(L.setOS["st30"])` L.70:414 ← CY_ORDER_OS walk L.70:164; INPUT override `data-p="loss.osOver.st30.os"` (L.70:315, read at L.70:160) |
| `IncOfCurYrAfterSetOff` | `STCG30Per.IncCYLA.IncOfCurYrAfterSetOff` | **REQ** | COMPUTED | `c.IncOfCurYrAfterSetOff=n0(L.afterC["st30"])` L.70:411 ← `afterC=inc−setHP−setBus−setOS` L.70:173 |
| `IncOfCurYrUnderThatHead` | `STCGAppRate.IncCYLA.IncOfCurYrUnderThatHead` | **REQ** | COMPUTED | `CY[cyKey].IncCYLA.IncOfCurYrUnderThatHead=n0(L.inc["stApp"])` L.70:411 ← engLoss `inc` (L.70:142-155), fed by S.C.hp/bp/cg/os |
| `HPlossCurYrSetoff` | `STCGAppRate.IncCYLA.HPlossCurYrSetoff` | — | COMPUTED | `c.HPlossCurYrSetoff=n0(L.setHP["stApp"])` L.70:412 ← greedy CY_ORDER_HP walk L.70:162; INPUT override `data-p="loss.cylaOver.stApp.hp"` (L.70:313, read at L.70:158) when loss.editC="Y" |
| `BusLossSetoff` | `STCGAppRate.IncCYLA.BusLossSetoff` | — | COMPUTED | `c.BusLossSetoff=n0(L.setBus["stApp"])` L.70:413 ← CY_ORDER_BUS walk L.70:163; INPUT override `data-p="loss.busOver.stApp.bus"` (L.70:314, read at L.70:159) |
| `OthSrcLossNoRaceHorseSetoff` | `STCGAppRate.IncCYLA.OthSrcLossNoRaceHorseSetoff` | — | COMPUTED | `c.OthSrcLossNoRaceHorseSetoff=n0(L.setOS["stApp"])` L.70:414 ← CY_ORDER_OS walk L.70:164; INPUT override `data-p="loss.osOver.stApp.os"` (L.70:315, read at L.70:160) |
| `IncOfCurYrAfterSetOff` | `STCGAppRate.IncCYLA.IncOfCurYrAfterSetOff` | **REQ** | COMPUTED | `c.IncOfCurYrAfterSetOff=n0(L.afterC["stApp"])` L.70:411 ← `afterC=inc−setHP−setBus−setOS` L.70:173 |
| `IncOfCurYrUnderThatHead` | `STCGDTAARate.IncCYLA.IncOfCurYrUnderThatHead` | **REQ** | COMPUTED | `CY[cyKey].IncCYLA.IncOfCurYrUnderThatHead=n0(L.inc["stDTAA"])` L.70:411 ← engLoss `inc` (L.70:142-155), fed by S.C.hp/bp/cg/os |
| `HPlossCurYrSetoff` | `STCGDTAARate.IncCYLA.HPlossCurYrSetoff` | — | COMPUTED | `c.HPlossCurYrSetoff=n0(L.setHP["stDTAA"])` L.70:412 ← greedy CY_ORDER_HP walk L.70:162; INPUT override `data-p="loss.cylaOver.stDTAA.hp"` (L.70:313, read at L.70:158) when loss.editC="Y" |
| `BusLossSetoff` | `STCGDTAARate.IncCYLA.BusLossSetoff` | — | COMPUTED | `c.BusLossSetoff=n0(L.setBus["stDTAA"])` L.70:413 ← CY_ORDER_BUS walk L.70:163; INPUT override `data-p="loss.busOver.stDTAA.bus"` (L.70:314, read at L.70:159) |
| `OthSrcLossNoRaceHorseSetoff` | `STCGDTAARate.IncCYLA.OthSrcLossNoRaceHorseSetoff` | — | COMPUTED | `c.OthSrcLossNoRaceHorseSetoff=n0(L.setOS["stDTAA"])` L.70:414 ← CY_ORDER_OS walk L.70:164; INPUT override `data-p="loss.osOver.stDTAA.os"` (L.70:315, read at L.70:160) |
| `IncOfCurYrAfterSetOff` | `STCGDTAARate.IncCYLA.IncOfCurYrAfterSetOff` | **REQ** | COMPUTED | `c.IncOfCurYrAfterSetOff=n0(L.afterC["stDTAA"])` L.70:411 ← `afterC=inc−setHP−setBus−setOS` L.70:173 |
| `IncOfCurYrUnderThatHead` | `LTCG12_5Per.IncCYLA.IncOfCurYrUnderThatHead` | **REQ** | COMPUTED | `CY[cyKey].IncCYLA.IncOfCurYrUnderThatHead=n0(L.inc["lt125"])` L.70:411 ← engLoss `inc` (L.70:142-155), fed by S.C.hp/bp/cg/os |
| `HPlossCurYrSetoff` | `LTCG12_5Per.IncCYLA.HPlossCurYrSetoff` | — | COMPUTED | `c.HPlossCurYrSetoff=n0(L.setHP["lt125"])` L.70:412 ← greedy CY_ORDER_HP walk L.70:162; INPUT override `data-p="loss.cylaOver.lt125.hp"` (L.70:313, read at L.70:158) when loss.editC="Y" |
| `BusLossSetoff` | `LTCG12_5Per.IncCYLA.BusLossSetoff` | — | COMPUTED | `c.BusLossSetoff=n0(L.setBus["lt125"])` L.70:413 ← CY_ORDER_BUS walk L.70:163; INPUT override `data-p="loss.busOver.lt125.bus"` (L.70:314, read at L.70:159) |
| `OthSrcLossNoRaceHorseSetoff` | `LTCG12_5Per.IncCYLA.OthSrcLossNoRaceHorseSetoff` | — | COMPUTED | `c.OthSrcLossNoRaceHorseSetoff=n0(L.setOS["lt125"])` L.70:414 ← CY_ORDER_OS walk L.70:164; INPUT override `data-p="loss.osOver.lt125.os"` (L.70:315, read at L.70:160) |
| `IncOfCurYrAfterSetOff` | `LTCG12_5Per.IncCYLA.IncOfCurYrAfterSetOff` | **REQ** | COMPUTED | `c.IncOfCurYrAfterSetOff=n0(L.afterC["lt125"])` L.70:411 ← `afterC=inc−setHP−setBus−setOS` L.70:173 |
| `IncOfCurYrUnderThatHead` | `LTCGDTAARate.IncCYLA.IncOfCurYrUnderThatHead` | **REQ** | COMPUTED | `CY[cyKey].IncCYLA.IncOfCurYrUnderThatHead=n0(L.inc["ltDTAA"])` L.70:411 ← engLoss `inc` (L.70:142-155), fed by S.C.hp/bp/cg/os |
| `HPlossCurYrSetoff` | `LTCGDTAARate.IncCYLA.HPlossCurYrSetoff` | — | COMPUTED | `c.HPlossCurYrSetoff=n0(L.setHP["ltDTAA"])` L.70:412 ← greedy CY_ORDER_HP walk L.70:162; INPUT override `data-p="loss.cylaOver.ltDTAA.hp"` (L.70:313, read at L.70:158) when loss.editC="Y" |
| `BusLossSetoff` | `LTCGDTAARate.IncCYLA.BusLossSetoff` | — | COMPUTED | `c.BusLossSetoff=n0(L.setBus["ltDTAA"])` L.70:413 ← CY_ORDER_BUS walk L.70:163; INPUT override `data-p="loss.busOver.ltDTAA.bus"` (L.70:314, read at L.70:159) |
| `OthSrcLossNoRaceHorseSetoff` | `LTCGDTAARate.IncCYLA.OthSrcLossNoRaceHorseSetoff` | — | COMPUTED | `c.OthSrcLossNoRaceHorseSetoff=n0(L.setOS["ltDTAA"])` L.70:414 ← CY_ORDER_OS walk L.70:164; INPUT override `data-p="loss.osOver.ltDTAA.os"` (L.70:315, read at L.70:160) |
| `IncOfCurYrAfterSetOff` | `LTCGDTAARate.IncCYLA.IncOfCurYrAfterSetOff` | **REQ** | COMPUTED | `c.IncOfCurYrAfterSetOff=n0(L.afterC["ltDTAA"])` L.70:411 ← `afterC=inc−setHP−setBus−setOS` L.70:173 |
| `IncOfCurYrUnderThatHead` | `OthSrcExclRaceHorseLottery.IncCYLA.IncOfCurYrUnderThatHead` | **REQ** | COMPUTED | `CY[cyKey].IncCYLA.IncOfCurYrUnderThatHead=n0(L.inc["os"])` L.70:411 ← engLoss `inc` (L.70:142-155), fed by S.C.hp/bp/cg/os |
| `HPlossCurYrSetoff` | `OthSrcExclRaceHorseLottery.IncCYLA.HPlossCurYrSetoff` | — | COMPUTED | `c.HPlossCurYrSetoff=n0(L.setHP["os"])` L.70:412 ← greedy CY_ORDER_HP walk L.70:162; INPUT override `data-p="loss.cylaOver.os.hp"` (L.70:313, read at L.70:158) when loss.editC="Y" |
| `BusLossSetoff` | `OthSrcExclRaceHorseLottery.IncCYLA.BusLossSetoff` | — | COMPUTED | `c.BusLossSetoff=n0(L.setBus["os"])` L.70:413 ← CY_ORDER_BUS walk L.70:163; INPUT override `data-p="loss.busOver.os.bus"` (L.70:314, read at L.70:159) |
| `IncOfCurYrAfterSetOff` | `OthSrcExclRaceHorseLottery.IncCYLA.IncOfCurYrAfterSetOff` | **REQ** | COMPUTED | `c.IncOfCurYrAfterSetOff=n0(L.afterC["os"])` L.70:411 ← `afterC=inc−setHP−setBus−setOS` L.70:173 |
| `IncOfCurYrUnderThatHead` | `ProfitFrmRaceHorse.IncCYLA.IncOfCurYrUnderThatHead` | **REQ** | COMPUTED | `CY[cyKey].IncCYLA.IncOfCurYrUnderThatHead=n0(L.inc["horse"])` L.70:411 ← engLoss `inc` (L.70:142-155), fed by S.C.hp/bp/cg/os |
| `HPlossCurYrSetoff` | `ProfitFrmRaceHorse.IncCYLA.HPlossCurYrSetoff` | — | COMPUTED | `c.HPlossCurYrSetoff=n0(L.setHP["horse"])` L.70:412 ← greedy CY_ORDER_HP walk L.70:162; INPUT override `data-p="loss.cylaOver.horse.hp"` (L.70:313, read at L.70:158) when loss.editC="Y" |
| `BusLossSetoff` | `ProfitFrmRaceHorse.IncCYLA.BusLossSetoff` | — | COMPUTED | `c.BusLossSetoff=n0(L.setBus["horse"])` L.70:413 ← CY_ORDER_BUS walk L.70:163; INPUT override `data-p="loss.busOver.horse.bus"` (L.70:314, read at L.70:159) |
| `OthSrcLossNoRaceHorseSetoff` | `ProfitFrmRaceHorse.IncCYLA.OthSrcLossNoRaceHorseSetoff` | — | COMPUTED | `c.OthSrcLossNoRaceHorseSetoff=n0(L.setOS["horse"])` L.70:414 ← CY_ORDER_OS walk L.70:164; INPUT override `data-p="loss.osOver.horse.os"` (L.70:315, read at L.70:160) |
| `IncOfCurYrAfterSetOff` | `ProfitFrmRaceHorse.IncCYLA.IncOfCurYrAfterSetOff` | **REQ** | COMPUTED | `c.IncOfCurYrAfterSetOff=n0(L.afterC["horse"])` L.70:411 ← `afterC=inc−setHP−setBus−setOS` L.70:173 |
| `IncOfCurYrUnderThatHead` | `IncOSDTAA.IncCYLA.IncOfCurYrUnderThatHead` | **REQ** | COMPUTED | `CY[cyKey].IncCYLA.IncOfCurYrUnderThatHead=n0(L.inc["osDTAA"])` L.70:411 ← engLoss `inc` (L.70:142-155), fed by S.C.hp/bp/cg/os |
| `HPlossCurYrSetoff` | `IncOSDTAA.IncCYLA.HPlossCurYrSetoff` | — | COMPUTED | `c.HPlossCurYrSetoff=n0(L.setHP["osDTAA"])` L.70:412 ← greedy CY_ORDER_HP walk L.70:162; INPUT override `data-p="loss.cylaOver.osDTAA.hp"` (L.70:313, read at L.70:158) when loss.editC="Y" |
| `BusLossSetoff` | `IncOSDTAA.IncCYLA.BusLossSetoff` | — | COMPUTED | `c.BusLossSetoff=n0(L.setBus["osDTAA"])` L.70:413 ← CY_ORDER_BUS walk L.70:163; INPUT override `data-p="loss.busOver.osDTAA.bus"` (L.70:314, read at L.70:159) |
| `OthSrcLossNoRaceHorseSetoff` | `IncOSDTAA.IncCYLA.OthSrcLossNoRaceHorseSetoff` | — | COMPUTED | `c.OthSrcLossNoRaceHorseSetoff=n0(L.setOS["osDTAA"])` L.70:414 ← CY_ORDER_OS walk L.70:164; INPUT override `data-p="loss.osOver.osDTAA.os"` (L.70:315, read at L.70:160) |
| `IncOfCurYrAfterSetOff` | `IncOSDTAA.IncCYLA.IncOfCurYrAfterSetOff` | **REQ** | COMPUTED | `c.IncOfCurYrAfterSetOff=n0(L.afterC["osDTAA"])` L.70:411 ← `afterC=inc−setHP−setBus−setOS` L.70:173 |
| `TotHPlossCurYr` | `TotalCurYr.TotHPlossCurYr` | **REQ** | COMPUTED | `CY.TotalCurYr` L.70:416 — L.hpTotal = ABS(MIN(S.C.hp.income,0)) L.70:135 |
| `TotBusLoss` | `TotalCurYr.TotBusLoss` | **REQ** | COMPUTED | `CY.TotalCurYr` L.70:416 — L.busLoss = S.C.bp.e.lossRemain (Sch BP Table-E 2vi) L.70:138 |
| `TotOthSrcLossNoRaceHorse` | `TotalCurYr.TotOthSrcLossNoRaceHorse` | **REQ** | COMPUTED | `CY.TotalCurYr` L.70:416 — L.osLoss = ABS(MIN(S.C.os.netNormal,0)) L.70:139 |
| `TotHPlossCurYrSetoff` | `TotalLossSetOff.TotHPlossCurYrSetoff` | **REQ** | COMPUTED | `CY.TotalLossSetOff` L.70:417 — L.totHPset = MIN(Σ setHP, hpTotal, 200000) — s.71(3A) cap L.70:167 |
| `TotBusLossSetoff` | `TotalLossSetOff.TotBusLossSetoff` | **REQ** | COMPUTED | `CY.TotalLossSetOff` L.70:417 — L.totBusset = Σ setBus |
| `TotOthSrcLossNoRaceHorseSetoff` | `TotalLossSetOff.TotOthSrcLossNoRaceHorseSetoff` | **REQ** | COMPUTED | `CY.TotalLossSetOff` L.70:417 — L.totOSset = Σ setOS |
| `BalHPlossCurYrAftSetoff` | `LossRemAftSetOff.BalHPlossCurYrAftSetoff` | **REQ** | COMPUTED | `CY.LossRemAftSetOff` L.70:418 — L.hpRemain (→ CFL xix HP) L.70:170 |
| `BalBusLossAftSetoff` | `LossRemAftSetOff.BalBusLossAftSetoff` | **REQ** | COMPUTED | `CY.LossRemAftSetOff` L.70:418 — L.busRemain (→ CFL xix business) L.70:171 |
| `BalOthSrcLossNoRaceHorseAftSetoff` | `LossRemAftSetOff.BalOthSrcLossNoRaceHorseAftSetoff` | **REQ** | COMPUTED | `CY.LossRemAftSetOff` L.70:418 — L.osRemain (normal OS loss lapses) L.70:172 |

## ScheduleBFLA — set-off of brought-forward losses (68 leaves)

| leaf | schema path | required? | bucket | evidence |
|---|---|---|---|---|
| `BFLAEditFlag` | `BFLAEditFlag` | — | INPUT | `data-p="loss.editB"` — `sel("loss.editB",...)` L.70:343; exported `BF.BFLAEditFlag` L.70:431 |
| `IncOfCurYrUndHeadFromCYLA` | `HP.IncBFLA.IncOfCurYrUndHeadFromCYLA` | **REQ** | COMPUTED | `o.IncOfCurYrUndHeadFromCYLA=n0(L.afterC["hp"])` L.70:425 — carries CYLA col 5 across |
| `BFlossPrevYrUndSameHeadSetoff` | `HP.IncBFLA.BFlossPrevYrUndSameHeadSetoff` | **REQ** | COMPUTED | `o.BFlossPrevYrUndSameHeadSetoff=n0(L.setBF["hp"])` L.70:427 ← ring-fenced set-off of the CFL b/f pools L.70:189-195; INPUT override `data-p="loss.bflaOver.hp"` (L.70:334, read at L.70:187) when loss.editB="Y" |
| `BFUnabsorbedDeprSetoff` | `HP.IncBFLA.BFUnabsorbedDeprSetoff` | **REQ** | COMPUTED | `o.BFUnabsorbedDeprSetoff=n0(L.setDep["hp"])` L.70:426 ← Schedule UD col-4 pool allotted over BF_DEP_ORDER L.70:209-211 |
| `BFAllUs35Cl4Setoff` | `HP.IncBFLA.BFAllUs35Cl4Setoff` | **REQ** | COMPUTED | `o.BFAllUs35Cl4Setoff=n0(L.set35["hp"])` L.70:426 ← Schedule UD col-7 pool allotted over BF_DEP_ORDER L.70:212-214 |
| `IncOfCurYrAfterSetOffBFLosses` | `HP.IncBFLA.IncOfCurYrAfterSetOffBFLosses` | **REQ** | COMPUTED | `o.IncOfCurYrAfterSetOffBFLosses=n0(L.afterB["hp"])` L.70:425 ← `afterB=MAX(0,afterC−setBF−setDep−set35)` L.70:217 |
| `IncOfCurYrUndHeadFromCYLA` | `BusProfExclSpecProf.IncBFLA.IncOfCurYrUndHeadFromCYLA` | **REQ** | COMPUTED | `o.IncOfCurYrUndHeadFromCYLA=n0(L.afterC["bus"])` L.70:425 — carries CYLA col 5 across |
| `BFlossPrevYrUndSameHeadSetoff` | `BusProfExclSpecProf.IncBFLA.BFlossPrevYrUndSameHeadSetoff` | **REQ** | COMPUTED | `o.BFlossPrevYrUndSameHeadSetoff=n0(L.setBF["bus"])` L.70:427 ← ring-fenced set-off of the CFL b/f pools L.70:189-195; INPUT override `data-p="loss.bflaOver.bus"` (L.70:334, read at L.70:187) when loss.editB="Y" |
| `BFUnabsorbedDeprSetoff` | `BusProfExclSpecProf.IncBFLA.BFUnabsorbedDeprSetoff` | **REQ** | COMPUTED | `o.BFUnabsorbedDeprSetoff=n0(L.setDep["bus"])` L.70:426 ← Schedule UD col-4 pool allotted over BF_DEP_ORDER L.70:209-211 |
| `BFAllUs35Cl4Setoff` | `BusProfExclSpecProf.IncBFLA.BFAllUs35Cl4Setoff` | **REQ** | COMPUTED | `o.BFAllUs35Cl4Setoff=n0(L.set35["bus"])` L.70:426 ← Schedule UD col-7 pool allotted over BF_DEP_ORDER L.70:212-214 |
| `IncOfCurYrAfterSetOffBFLosses` | `BusProfExclSpecProf.IncBFLA.IncOfCurYrAfterSetOffBFLosses` | **REQ** | COMPUTED | `o.IncOfCurYrAfterSetOffBFLosses=n0(L.afterB["bus"])` L.70:425 ← `afterB=MAX(0,afterC−setBF−setDep−set35)` L.70:217 |
| `IncOfCurYrUndHeadFromCYLA` | `SpeculationIncome.IncBFLA.IncOfCurYrUndHeadFromCYLA` | **REQ** | COMPUTED | `o.IncOfCurYrUndHeadFromCYLA=n0(L.afterC["spec"])` L.70:425 — carries CYLA col 5 across |
| `BFlossPrevYrUndSameHeadSetoff` | `SpeculationIncome.IncBFLA.BFlossPrevYrUndSameHeadSetoff` | **REQ** | COMPUTED | `o.BFlossPrevYrUndSameHeadSetoff=n0(L.setBF["spec"])` L.70:427 ← ring-fenced set-off of the CFL b/f pools L.70:189-195; INPUT override `data-p="loss.bflaOver.spec"` (L.70:334, read at L.70:187) when loss.editB="Y" |
| `BFUnabsorbedDeprSetoff` | `SpeculationIncome.IncBFLA.BFUnabsorbedDeprSetoff` | **REQ** | COMPUTED | `o.BFUnabsorbedDeprSetoff=n0(L.setDep["spec"])` L.70:426 ← Schedule UD col-4 pool allotted over BF_DEP_ORDER L.70:209-211 |
| `BFAllUs35Cl4Setoff` | `SpeculationIncome.IncBFLA.BFAllUs35Cl4Setoff` | **REQ** | COMPUTED | `o.BFAllUs35Cl4Setoff=n0(L.set35["spec"])` L.70:426 ← Schedule UD col-7 pool allotted over BF_DEP_ORDER L.70:212-214 |
| `IncOfCurYrAfterSetOffBFLosses` | `SpeculationIncome.IncBFLA.IncOfCurYrAfterSetOffBFLosses` | **REQ** | COMPUTED | `o.IncOfCurYrAfterSetOffBFLosses=n0(L.afterB["spec"])` L.70:425 ← `afterB=MAX(0,afterC−setBF−setDep−set35)` L.70:217 |
| `IncOfCurYrUndHeadFromCYLA` | `SpecifiedBusIncome.IncBFLA.IncOfCurYrUndHeadFromCYLA` | **REQ** | COMPUTED | `o.IncOfCurYrUndHeadFromCYLA=n0(L.afterC["specified"])` L.70:425 — carries CYLA col 5 across |
| `BFlossPrevYrUndSameHeadSetoff` | `SpecifiedBusIncome.IncBFLA.BFlossPrevYrUndSameHeadSetoff` | **REQ** | COMPUTED | `o.BFlossPrevYrUndSameHeadSetoff=n0(L.setBF["specified"])` L.70:427 ← ring-fenced set-off of the CFL b/f pools L.70:189-195; INPUT override `data-p="loss.bflaOver.specified"` (L.70:334, read at L.70:187) when loss.editB="Y" |
| `BFUnabsorbedDeprSetoff` | `SpecifiedBusIncome.IncBFLA.BFUnabsorbedDeprSetoff` | **REQ** | COMPUTED | `o.BFUnabsorbedDeprSetoff=n0(L.setDep["specified"])` L.70:426 ← Schedule UD col-4 pool allotted over BF_DEP_ORDER L.70:209-211 |
| `BFAllUs35Cl4Setoff` | `SpecifiedBusIncome.IncBFLA.BFAllUs35Cl4Setoff` | **REQ** | COMPUTED | `o.BFAllUs35Cl4Setoff=n0(L.set35["specified"])` L.70:426 ← Schedule UD col-7 pool allotted over BF_DEP_ORDER L.70:212-214 |
| `IncOfCurYrAfterSetOffBFLosses` | `SpecifiedBusIncome.IncBFLA.IncOfCurYrAfterSetOffBFLosses` | **REQ** | COMPUTED | `o.IncOfCurYrAfterSetOffBFLosses=n0(L.afterB["specified"])` L.70:425 ← `afterB=MAX(0,afterC−setBF−setDep−set35)` L.70:217 |
| `IncOfCurYrUndHeadFromCYLA` | `STCG20Per.IncBFLA.IncOfCurYrUndHeadFromCYLA` | **REQ** | COMPUTED | `o.IncOfCurYrUndHeadFromCYLA=n0(L.afterC["st20"])` L.70:425 — carries CYLA col 5 across |
| `BFlossPrevYrUndSameHeadSetoff` | `STCG20Per.IncBFLA.BFlossPrevYrUndSameHeadSetoff` | **REQ** | COMPUTED | `o.BFlossPrevYrUndSameHeadSetoff=n0(L.setBF["st20"])` L.70:427 ← ring-fenced set-off of the CFL b/f pools L.70:189-195; INPUT override `data-p="loss.bflaOver.st20"` (L.70:334, read at L.70:187) when loss.editB="Y" |
| `BFUnabsorbedDeprSetoff` | `STCG20Per.IncBFLA.BFUnabsorbedDeprSetoff` | **REQ** | COMPUTED | `o.BFUnabsorbedDeprSetoff=n0(L.setDep["st20"])` L.70:426 ← Schedule UD col-4 pool allotted over BF_DEP_ORDER L.70:209-211 |
| `BFAllUs35Cl4Setoff` | `STCG20Per.IncBFLA.BFAllUs35Cl4Setoff` | **REQ** | COMPUTED | `o.BFAllUs35Cl4Setoff=n0(L.set35["st20"])` L.70:426 ← Schedule UD col-7 pool allotted over BF_DEP_ORDER L.70:212-214 |
| `IncOfCurYrAfterSetOffBFLosses` | `STCG20Per.IncBFLA.IncOfCurYrAfterSetOffBFLosses` | **REQ** | COMPUTED | `o.IncOfCurYrAfterSetOffBFLosses=n0(L.afterB["st20"])` L.70:425 ← `afterB=MAX(0,afterC−setBF−setDep−set35)` L.70:217 |
| `IncOfCurYrUndHeadFromCYLA` | `STCG30Per.IncBFLA.IncOfCurYrUndHeadFromCYLA` | **REQ** | COMPUTED | `o.IncOfCurYrUndHeadFromCYLA=n0(L.afterC["st30"])` L.70:425 — carries CYLA col 5 across |
| `BFlossPrevYrUndSameHeadSetoff` | `STCG30Per.IncBFLA.BFlossPrevYrUndSameHeadSetoff` | **REQ** | COMPUTED | `o.BFlossPrevYrUndSameHeadSetoff=n0(L.setBF["st30"])` L.70:427 ← ring-fenced set-off of the CFL b/f pools L.70:189-195; INPUT override `data-p="loss.bflaOver.st30"` (L.70:334, read at L.70:187) when loss.editB="Y" |
| `BFUnabsorbedDeprSetoff` | `STCG30Per.IncBFLA.BFUnabsorbedDeprSetoff` | **REQ** | COMPUTED | `o.BFUnabsorbedDeprSetoff=n0(L.setDep["st30"])` L.70:426 ← Schedule UD col-4 pool allotted over BF_DEP_ORDER L.70:209-211 |
| `BFAllUs35Cl4Setoff` | `STCG30Per.IncBFLA.BFAllUs35Cl4Setoff` | **REQ** | COMPUTED | `o.BFAllUs35Cl4Setoff=n0(L.set35["st30"])` L.70:426 ← Schedule UD col-7 pool allotted over BF_DEP_ORDER L.70:212-214 |
| `IncOfCurYrAfterSetOffBFLosses` | `STCG30Per.IncBFLA.IncOfCurYrAfterSetOffBFLosses` | **REQ** | COMPUTED | `o.IncOfCurYrAfterSetOffBFLosses=n0(L.afterB["st30"])` L.70:425 ← `afterB=MAX(0,afterC−setBF−setDep−set35)` L.70:217 |
| `IncOfCurYrUndHeadFromCYLA` | `STCGAppRate.IncBFLA.IncOfCurYrUndHeadFromCYLA` | **REQ** | COMPUTED | `o.IncOfCurYrUndHeadFromCYLA=n0(L.afterC["stApp"])` L.70:425 — carries CYLA col 5 across |
| `BFlossPrevYrUndSameHeadSetoff` | `STCGAppRate.IncBFLA.BFlossPrevYrUndSameHeadSetoff` | **REQ** | COMPUTED | `o.BFlossPrevYrUndSameHeadSetoff=n0(L.setBF["stApp"])` L.70:427 ← ring-fenced set-off of the CFL b/f pools L.70:189-195; INPUT override `data-p="loss.bflaOver.stApp"` (L.70:334, read at L.70:187) when loss.editB="Y" |
| `BFUnabsorbedDeprSetoff` | `STCGAppRate.IncBFLA.BFUnabsorbedDeprSetoff` | **REQ** | COMPUTED | `o.BFUnabsorbedDeprSetoff=n0(L.setDep["stApp"])` L.70:426 ← Schedule UD col-4 pool allotted over BF_DEP_ORDER L.70:209-211 |
| `BFAllUs35Cl4Setoff` | `STCGAppRate.IncBFLA.BFAllUs35Cl4Setoff` | **REQ** | COMPUTED | `o.BFAllUs35Cl4Setoff=n0(L.set35["stApp"])` L.70:426 ← Schedule UD col-7 pool allotted over BF_DEP_ORDER L.70:212-214 |
| `IncOfCurYrAfterSetOffBFLosses` | `STCGAppRate.IncBFLA.IncOfCurYrAfterSetOffBFLosses` | **REQ** | COMPUTED | `o.IncOfCurYrAfterSetOffBFLosses=n0(L.afterB["stApp"])` L.70:425 ← `afterB=MAX(0,afterC−setBF−setDep−set35)` L.70:217 |
| `IncOfCurYrUndHeadFromCYLA` | `STCGDTAARate.IncBFLA.IncOfCurYrUndHeadFromCYLA` | **REQ** | COMPUTED | `o.IncOfCurYrUndHeadFromCYLA=n0(L.afterC["stDTAA"])` L.70:425 — carries CYLA col 5 across |
| `BFlossPrevYrUndSameHeadSetoff` | `STCGDTAARate.IncBFLA.BFlossPrevYrUndSameHeadSetoff` | **REQ** | COMPUTED | `o.BFlossPrevYrUndSameHeadSetoff=n0(L.setBF["stDTAA"])` L.70:427 ← ring-fenced set-off of the CFL b/f pools L.70:189-195; INPUT override `data-p="loss.bflaOver.stDTAA"` (L.70:334, read at L.70:187) when loss.editB="Y" |
| `BFUnabsorbedDeprSetoff` | `STCGDTAARate.IncBFLA.BFUnabsorbedDeprSetoff` | **REQ** | COMPUTED | `o.BFUnabsorbedDeprSetoff=n0(L.setDep["stDTAA"])` L.70:426 ← Schedule UD col-4 pool allotted over BF_DEP_ORDER L.70:209-211 |
| `BFAllUs35Cl4Setoff` | `STCGDTAARate.IncBFLA.BFAllUs35Cl4Setoff` | **REQ** | COMPUTED | `o.BFAllUs35Cl4Setoff=n0(L.set35["stDTAA"])` L.70:426 ← Schedule UD col-7 pool allotted over BF_DEP_ORDER L.70:212-214 |
| `IncOfCurYrAfterSetOffBFLosses` | `STCGDTAARate.IncBFLA.IncOfCurYrAfterSetOffBFLosses` | **REQ** | COMPUTED | `o.IncOfCurYrAfterSetOffBFLosses=n0(L.afterB["stDTAA"])` L.70:425 ← `afterB=MAX(0,afterC−setBF−setDep−set35)` L.70:217 |
| `IncOfCurYrUndHeadFromCYLA` | `LTCG12_5Per.IncBFLA.IncOfCurYrUndHeadFromCYLA` | **REQ** | COMPUTED | `o.IncOfCurYrUndHeadFromCYLA=n0(L.afterC["lt125"])` L.70:425 — carries CYLA col 5 across |
| `BFlossPrevYrUndSameHeadSetoff` | `LTCG12_5Per.IncBFLA.BFlossPrevYrUndSameHeadSetoff` | **REQ** | COMPUTED | `o.BFlossPrevYrUndSameHeadSetoff=n0(L.setBF["lt125"])` L.70:427 ← ring-fenced set-off of the CFL b/f pools L.70:189-195; INPUT override `data-p="loss.bflaOver.lt125"` (L.70:334, read at L.70:187) when loss.editB="Y" |
| `BFUnabsorbedDeprSetoff` | `LTCG12_5Per.IncBFLA.BFUnabsorbedDeprSetoff` | **REQ** | COMPUTED | `o.BFUnabsorbedDeprSetoff=n0(L.setDep["lt125"])` L.70:426 ← Schedule UD col-4 pool allotted over BF_DEP_ORDER L.70:209-211 |
| `BFAllUs35Cl4Setoff` | `LTCG12_5Per.IncBFLA.BFAllUs35Cl4Setoff` | **REQ** | COMPUTED | `o.BFAllUs35Cl4Setoff=n0(L.set35["lt125"])` L.70:426 ← Schedule UD col-7 pool allotted over BF_DEP_ORDER L.70:212-214 |
| `IncOfCurYrAfterSetOffBFLosses` | `LTCG12_5Per.IncBFLA.IncOfCurYrAfterSetOffBFLosses` | **REQ** | COMPUTED | `o.IncOfCurYrAfterSetOffBFLosses=n0(L.afterB["lt125"])` L.70:425 ← `afterB=MAX(0,afterC−setBF−setDep−set35)` L.70:217 |
| `IncOfCurYrUndHeadFromCYLA` | `LTCGDTAARate.IncBFLA.IncOfCurYrUndHeadFromCYLA` | **REQ** | COMPUTED | `o.IncOfCurYrUndHeadFromCYLA=n0(L.afterC["ltDTAA"])` L.70:425 — carries CYLA col 5 across |
| `BFlossPrevYrUndSameHeadSetoff` | `LTCGDTAARate.IncBFLA.BFlossPrevYrUndSameHeadSetoff` | **REQ** | COMPUTED | `o.BFlossPrevYrUndSameHeadSetoff=n0(L.setBF["ltDTAA"])` L.70:427 ← ring-fenced set-off of the CFL b/f pools L.70:189-195; INPUT override `data-p="loss.bflaOver.ltDTAA"` (L.70:334, read at L.70:187) when loss.editB="Y" |
| `BFUnabsorbedDeprSetoff` | `LTCGDTAARate.IncBFLA.BFUnabsorbedDeprSetoff` | **REQ** | COMPUTED | `o.BFUnabsorbedDeprSetoff=n0(L.setDep["ltDTAA"])` L.70:426 ← Schedule UD col-4 pool allotted over BF_DEP_ORDER L.70:209-211 |
| `BFAllUs35Cl4Setoff` | `LTCGDTAARate.IncBFLA.BFAllUs35Cl4Setoff` | **REQ** | COMPUTED | `o.BFAllUs35Cl4Setoff=n0(L.set35["ltDTAA"])` L.70:426 ← Schedule UD col-7 pool allotted over BF_DEP_ORDER L.70:212-214 |
| `IncOfCurYrAfterSetOffBFLosses` | `LTCGDTAARate.IncBFLA.IncOfCurYrAfterSetOffBFLosses` | **REQ** | COMPUTED | `o.IncOfCurYrAfterSetOffBFLosses=n0(L.afterB["ltDTAA"])` L.70:425 ← `afterB=MAX(0,afterC−setBF−setDep−set35)` L.70:217 |
| `IncOfCurYrUndHeadFromCYLA` | `OthSrcExclRaceHorse.IncBFLA.IncOfCurYrUndHeadFromCYLA` | **REQ** | COMPUTED | `o.IncOfCurYrUndHeadFromCYLA=n0(L.afterC["os"])` L.70:425 — carries CYLA col 5 across |
| `BFUnabsorbedDeprSetoff` | `OthSrcExclRaceHorse.IncBFLA.BFUnabsorbedDeprSetoff` | **REQ** | COMPUTED | `o.BFUnabsorbedDeprSetoff=n0(L.setDep["os"])` L.70:426 ← Schedule UD col-4 pool allotted over BF_DEP_ORDER L.70:209-211 |
| `BFAllUs35Cl4Setoff` | `OthSrcExclRaceHorse.IncBFLA.BFAllUs35Cl4Setoff` | **REQ** | COMPUTED | `o.BFAllUs35Cl4Setoff=n0(L.set35["os"])` L.70:426 ← Schedule UD col-7 pool allotted over BF_DEP_ORDER L.70:212-214 |
| `IncOfCurYrAfterSetOffBFLosses` | `OthSrcExclRaceHorse.IncBFLA.IncOfCurYrAfterSetOffBFLosses` | **REQ** | COMPUTED | `o.IncOfCurYrAfterSetOffBFLosses=n0(L.afterB["os"])` L.70:425 ← `afterB=MAX(0,afterC−setBF−setDep−set35)` L.70:217 |
| `IncOfCurYrUndHeadFromCYLA` | `ProfitFrmRaceHorse.IncBFLA.IncOfCurYrUndHeadFromCYLA` | **REQ** | COMPUTED | `o.IncOfCurYrUndHeadFromCYLA=n0(L.afterC["horse"])` L.70:425 — carries CYLA col 5 across |
| `BFlossPrevYrUndSameHeadSetoff` | `ProfitFrmRaceHorse.IncBFLA.BFlossPrevYrUndSameHeadSetoff` | **REQ** | COMPUTED | `o.BFlossPrevYrUndSameHeadSetoff=n0(L.setBF["horse"])` L.70:427 ← ring-fenced set-off of the CFL b/f pools L.70:189-195; INPUT override `data-p="loss.bflaOver.horse"` (L.70:334, read at L.70:187) when loss.editB="Y" |
| `BFUnabsorbedDeprSetoff` | `ProfitFrmRaceHorse.IncBFLA.BFUnabsorbedDeprSetoff` | **REQ** | COMPUTED | `o.BFUnabsorbedDeprSetoff=n0(L.setDep["horse"])` L.70:426 ← Schedule UD col-4 pool allotted over BF_DEP_ORDER L.70:209-211 |
| `BFAllUs35Cl4Setoff` | `ProfitFrmRaceHorse.IncBFLA.BFAllUs35Cl4Setoff` | **REQ** | COMPUTED | `o.BFAllUs35Cl4Setoff=n0(L.set35["horse"])` L.70:426 ← Schedule UD col-7 pool allotted over BF_DEP_ORDER L.70:212-214 |
| `IncOfCurYrAfterSetOffBFLosses` | `ProfitFrmRaceHorse.IncBFLA.IncOfCurYrAfterSetOffBFLosses` | **REQ** | COMPUTED | `o.IncOfCurYrAfterSetOffBFLosses=n0(L.afterB["horse"])` L.70:425 ← `afterB=MAX(0,afterC−setBF−setDep−set35)` L.70:217 |
| `IncOfCurYrUndHeadFromCYLA` | `IncOSDTAA.IncBFLA.IncOfCurYrUndHeadFromCYLA` | **REQ** | COMPUTED | `o.IncOfCurYrUndHeadFromCYLA=n0(L.afterC["osDTAA"])` L.70:425 — carries CYLA col 5 across |
| `BFUnabsorbedDeprSetoff` | `IncOSDTAA.IncBFLA.BFUnabsorbedDeprSetoff` | **REQ** | COMPUTED | `o.BFUnabsorbedDeprSetoff=n0(L.setDep["osDTAA"])` L.70:426 ← Schedule UD col-4 pool allotted over BF_DEP_ORDER L.70:209-211 |
| `BFAllUs35Cl4Setoff` | `IncOSDTAA.IncBFLA.BFAllUs35Cl4Setoff` | **REQ** | COMPUTED | `o.BFAllUs35Cl4Setoff=n0(L.set35["osDTAA"])` L.70:426 ← Schedule UD col-7 pool allotted over BF_DEP_ORDER L.70:212-214 |
| `IncOfCurYrAfterSetOffBFLosses` | `IncOSDTAA.IncBFLA.IncOfCurYrAfterSetOffBFLosses` | **REQ** | COMPUTED | `o.IncOfCurYrAfterSetOffBFLosses=n0(L.afterB["osDTAA"])` L.70:425 ← `afterB=MAX(0,afterC−setBF−setDep−set35)` L.70:217 |
| `TotBFLossSetoff` | `TotalBFLossSetOff.TotBFLossSetoff` | **REQ** | COMPUTED | `BF.TotalBFLossSetOff` L.70:429 — L.totBFset = Σ setBF |
| `TotUnabsorbedDeprSetoff` | `TotalBFLossSetOff.TotUnabsorbedDeprSetoff` | **REQ** | COMPUTED | `BF.TotalBFLossSetOff` L.70:429 — L.totDep = Σ setDep (= UD col-4 total) |
| `TotAllUs35cl4Setoff` | `TotalBFLossSetOff.TotAllUs35cl4Setoff` | **REQ** | COMPUTED | `BF.TotalBFLossSetOff` L.70:429 — L.tot35 = Σ set35 (= UD col-7 total) |
| `IncomeOfCurrYrAftCYLABFLA` | `IncomeOfCurrYrAftCYLABFLA` | **REQ** | COMPUTED | `BF.IncomeOfCurrYrAftCYLABFLA=n0(L.gti)` L.70:430 — Σ afterB over all heads = gross total income |

## ScheduleCFL — losses carried forward to future years (127 leaves)

| leaf | schema path | required? | bucket | evidence |
|---|---|---|---|---|
| `DateOfFiling` | `LossCFFromPrev9thYearFromAY.CarryFwdLossDetail.DateOfFiling` | **REQ** | INPUT | `data-p="loss.cfl.2010-11.dt"` — `inp("loss.cfl.2010-11.dt",{ph:DF,max:10})` L.70:377; exported `DateOfFiling:ISO(r.dt)||"2025-07-31"` L.70:458 |
| `LossFrmSpecifiedBusCF` | `LossCFFromPrev9thYearFromAY.CarryFwdLossDetail.LossFrmSpecifiedBusCF` | — | INPUT | `data-p="loss.cfl.2010-11.specified"` — `inp("loss.cfl.2010-11.specified",{n:1})` L.70:383; exported L.70:462. |
| `DateOfFiling` | `LossCFFromPrev8thYearFromAY.CarryFwdLossDetail.DateOfFiling` | **REQ** | INPUT | `data-p="loss.cfl.2011-12.dt"` — `inp("loss.cfl.2011-12.dt",{ph:DF,max:10})` L.70:377; exported `DateOfFiling:ISO(r.dt)||"2025-07-31"` L.70:458 |
| `LossFrmSpecifiedBusCF` | `LossCFFromPrev8thYearFromAY.CarryFwdLossDetail.LossFrmSpecifiedBusCF` | — | INPUT | `data-p="loss.cfl.2011-12.specified"` — `inp("loss.cfl.2011-12.specified",{n:1})` L.70:383; exported L.70:462. |
| `DateOfFiling` | `LossCFFromPrev7thYearFromAY.CarryFwdLossDetail.DateOfFiling` | **REQ** | INPUT | `data-p="loss.cfl.2012-13.dt"` — `inp("loss.cfl.2012-13.dt",{ph:DF,max:10})` L.70:377; exported `DateOfFiling:ISO(r.dt)||"2025-07-31"` L.70:458 |
| `LossFrmSpecifiedBusCF` | `LossCFFromPrev7thYearFromAY.CarryFwdLossDetail.LossFrmSpecifiedBusCF` | — | INPUT | `data-p="loss.cfl.2012-13.specified"` — `inp("loss.cfl.2012-13.specified",{n:1})` L.70:383; exported L.70:462. |
| `DateOfFiling` | `LossCFFromPrev6thYearFromAY.CarryFwdLossDetail.DateOfFiling` | **REQ** | INPUT | `data-p="loss.cfl.2013-14.dt"` — `inp("loss.cfl.2013-14.dt",{ph:DF,max:10})` L.70:377; exported `DateOfFiling:ISO(r.dt)||"2025-07-31"` L.70:458 |
| `LossFrmSpecifiedBusCF` | `LossCFFromPrev6thYearFromAY.CarryFwdLossDetail.LossFrmSpecifiedBusCF` | — | INPUT | `data-p="loss.cfl.2013-14.specified"` — `inp("loss.cfl.2013-14.specified",{n:1})` L.70:383; exported L.70:462. |
| `DateOfFiling` | `LossCFFromPrev5thYearFromAY.CarryFwdLossDetail.DateOfFiling` | **REQ** | INPUT | `data-p="loss.cfl.2014-15.dt"` — `inp("loss.cfl.2014-15.dt",{ph:DF,max:10})` L.70:377; exported `DateOfFiling:ISO(r.dt)||"2025-07-31"` L.70:458 |
| `LossFrmSpecifiedBusCF` | `LossCFFromPrev5thYearFromAY.CarryFwdLossDetail.LossFrmSpecifiedBusCF` | — | INPUT | `data-p="loss.cfl.2014-15.specified"` — `inp("loss.cfl.2014-15.specified",{n:1})` L.70:383; exported L.70:462. |
| `DateOfFiling` | `LossCFFromPrev4thYearFromAY.CarryFwdLossDetail.DateOfFiling` | **REQ** | INPUT | `data-p="loss.cfl.2015-16.dt"` — `inp("loss.cfl.2015-16.dt",{ph:DF,max:10})` L.70:377; exported `DateOfFiling:ISO(r.dt)||"2025-07-31"` L.70:458 |
| `LossFrmSpecifiedBusCF` | `LossCFFromPrev4thYearFromAY.CarryFwdLossDetail.LossFrmSpecifiedBusCF` | — | INPUT | `data-p="loss.cfl.2015-16.specified"` — `inp("loss.cfl.2015-16.specified",{n:1})` L.70:383; exported L.70:462. |
| `DateOfFiling` | `LossCFFromPrev3rdYearFromAY.CarryFwdLossDetail.DateOfFiling` | **REQ** | INPUT | `data-p="loss.cfl.2016-17.dt"` — `inp("loss.cfl.2016-17.dt",{ph:DF,max:10})` L.70:377; exported `DateOfFiling:ISO(r.dt)||"2025-07-31"` L.70:458 |
| `LossFrmSpecifiedBusCF` | `LossCFFromPrev3rdYearFromAY.CarryFwdLossDetail.LossFrmSpecifiedBusCF` | — | INPUT | `data-p="loss.cfl.2016-17.specified"` — `inp("loss.cfl.2016-17.specified",{n:1})` L.70:383; exported L.70:462. |
| `DateOfFiling` | `LossCFFromPrev2ndYearFromAY.CarryFwdLossDetail.DateOfFiling` | **REQ** | INPUT | `data-p="loss.cfl.2017-18.dt"` — `inp("loss.cfl.2017-18.dt",{ph:DF,max:10})` L.70:377; exported `DateOfFiling:ISO(r.dt)||"2025-07-31"` L.70:458 |
| `LossFrmSpecifiedBusCF` | `LossCFFromPrev2ndYearFromAY.CarryFwdLossDetail.LossFrmSpecifiedBusCF` | — | INPUT | `data-p="loss.cfl.2017-18.specified"` — `inp("loss.cfl.2017-18.specified",{n:1})` L.70:383; exported L.70:462. |
| `DateOfFiling` | `LossCFFromPrevYrToAY.CarryFwdLossDetail.DateOfFiling` | **REQ** | INPUT | `data-p="loss.cfl.2018-19.dt"` — `inp("loss.cfl.2018-19.dt",{ph:DF,max:10})` L.70:377; exported `DateOfFiling:ISO(r.dt)||"2025-07-31"` L.70:458 |
| `TotalHPPTILossCF` | `LossCFFromPrevYrToAY.CarryFwdLossDetail.TotalHPPTILossCF` | **REQ** | INPUT | `data-p="loss.cfl.2018-19.hp"` — `inp("loss.cfl.2018-19.hp",{n:1})` L.70:378; exported L.70:459. |
| `BrtFwdBusLoss` | `LossCFFromPrevYrToAY.CarryFwdLossDetail.BrtFwdBusLoss` | — | INPUT | `data-p="loss.cfl.2018-19.bus5a"` — `inp("loss.cfl.2018-19.bus5a",{n:1})` L.70:379; exported L.70:460. |
| `AdjustAccTax115BADAmt` | `LossCFFromPrevYrToAY.CarryFwdLossDetail.AdjustAccTax115BADAmt` | — | INPUT | `data-p="loss.cfl.2018-19.bus5b"` — `inp("loss.cfl.2018-19.bus5b",{n:1})` L.70:380; exported L.70:460. Rendered only under the new regime; a closed 0 cell otherwise (rule 567), and exported only `if(New&&N(r.bus5b))` L.70:460. |
| `BusLossOthThanSpecLossCF` | `LossCFFromPrevYrToAY.CarryFwdLossDetail.BusLossOthThanSpecLossCF` | — | COMPUTED | `d.BusLossOthThanSpecLossCF=n0(b5c)` L.70:460 — 5c = MAX(0, 5a − 5b) (rule 568); shown as a read-only cell `cell(b5cView(r))` L.70:381 |
| `LossFrmSpecifiedBusCF` | `LossCFFromPrevYrToAY.CarryFwdLossDetail.LossFrmSpecifiedBusCF` | — | INPUT | `data-p="loss.cfl.2018-19.specified"` — `inp("loss.cfl.2018-19.specified",{n:1})` L.70:383; exported L.70:462. |
| `TotalSTCGPTILossCF` | `LossCFFromPrevYrToAY.CarryFwdLossDetail.TotalSTCGPTILossCF` | **REQ** | INPUT | `data-p="loss.cfl.2018-19.st"` — `inp("loss.cfl.2018-19.st",{n:1})` L.70:384; exported L.70:463. |
| `TotalLTCGPTILossCF` | `LossCFFromPrevYrToAY.CarryFwdLossDetail.TotalLTCGPTILossCF` | **REQ** | INPUT | `data-p="loss.cfl.2018-19.lt"` — `inp("loss.cfl.2018-19.lt",{n:1})` L.70:385; exported L.70:464. |
| `DateOfFiling` | `LossCFCurrentAssmntYear.CarryFwdLossDetail.DateOfFiling` | **REQ** | INPUT | `data-p="loss.cfl.2019-20.dt"` — `inp("loss.cfl.2019-20.dt",{ph:DF,max:10})` L.70:377; exported `DateOfFiling:ISO(r.dt)||"2025-07-31"` L.70:458 |
| `TotalHPPTILossCF` | `LossCFCurrentAssmntYear.CarryFwdLossDetail.TotalHPPTILossCF` | **REQ** | INPUT | `data-p="loss.cfl.2019-20.hp"` — `inp("loss.cfl.2019-20.hp",{n:1})` L.70:378; exported L.70:459. |
| `BrtFwdBusLoss` | `LossCFCurrentAssmntYear.CarryFwdLossDetail.BrtFwdBusLoss` | — | INPUT | `data-p="loss.cfl.2019-20.bus5a"` — `inp("loss.cfl.2019-20.bus5a",{n:1})` L.70:379; exported L.70:460. |
| `AdjustAccTax115BADAmt` | `LossCFCurrentAssmntYear.CarryFwdLossDetail.AdjustAccTax115BADAmt` | — | INPUT | `data-p="loss.cfl.2019-20.bus5b"` — `inp("loss.cfl.2019-20.bus5b",{n:1})` L.70:380; exported L.70:460. Rendered only under the new regime; a closed 0 cell otherwise (rule 567), and exported only `if(New&&N(r.bus5b))` L.70:460. |
| `BusLossOthThanSpecLossCF` | `LossCFCurrentAssmntYear.CarryFwdLossDetail.BusLossOthThanSpecLossCF` | — | COMPUTED | `d.BusLossOthThanSpecLossCF=n0(b5c)` L.70:460 — 5c = MAX(0, 5a − 5b) (rule 568); shown as a read-only cell `cell(b5cView(r))` L.70:381 |
| `LossFrmSpecifiedBusCF` | `LossCFCurrentAssmntYear.CarryFwdLossDetail.LossFrmSpecifiedBusCF` | — | INPUT | `data-p="loss.cfl.2019-20.specified"` — `inp("loss.cfl.2019-20.specified",{n:1})` L.70:383; exported L.70:462. |
| `TotalSTCGPTILossCF` | `LossCFCurrentAssmntYear.CarryFwdLossDetail.TotalSTCGPTILossCF` | **REQ** | INPUT | `data-p="loss.cfl.2019-20.st"` — `inp("loss.cfl.2019-20.st",{n:1})` L.70:384; exported L.70:463. |
| `TotalLTCGPTILossCF` | `LossCFCurrentAssmntYear.CarryFwdLossDetail.TotalLTCGPTILossCF` | **REQ** | INPUT | `data-p="loss.cfl.2019-20.lt"` — `inp("loss.cfl.2019-20.lt",{n:1})` L.70:385; exported L.70:464. |
| `DateOfFiling` | `LossCFCurrentAssmntYear2021.CarryFwdLossDetail.DateOfFiling` | **REQ** | INPUT | `data-p="loss.cfl.2020-21.dt"` — `inp("loss.cfl.2020-21.dt",{ph:DF,max:10})` L.70:377; exported `DateOfFiling:ISO(r.dt)||"2025-07-31"` L.70:458 |
| `TotalHPPTILossCF` | `LossCFCurrentAssmntYear2021.CarryFwdLossDetail.TotalHPPTILossCF` | **REQ** | INPUT | `data-p="loss.cfl.2020-21.hp"` — `inp("loss.cfl.2020-21.hp",{n:1})` L.70:378; exported L.70:459. |
| `BrtFwdBusLoss` | `LossCFCurrentAssmntYear2021.CarryFwdLossDetail.BrtFwdBusLoss` | — | INPUT | `data-p="loss.cfl.2020-21.bus5a"` — `inp("loss.cfl.2020-21.bus5a",{n:1})` L.70:379; exported L.70:460. |
| `AdjustAccTax115BADAmt` | `LossCFCurrentAssmntYear2021.CarryFwdLossDetail.AdjustAccTax115BADAmt` | — | INPUT | `data-p="loss.cfl.2020-21.bus5b"` — `inp("loss.cfl.2020-21.bus5b",{n:1})` L.70:380; exported L.70:460. Rendered only under the new regime; a closed 0 cell otherwise (rule 567), and exported only `if(New&&N(r.bus5b))` L.70:460. |
| `BusLossOthThanSpecLossCF` | `LossCFCurrentAssmntYear2021.CarryFwdLossDetail.BusLossOthThanSpecLossCF` | — | COMPUTED | `d.BusLossOthThanSpecLossCF=n0(b5c)` L.70:460 — 5c = MAX(0, 5a − 5b) (rule 568); shown as a read-only cell `cell(b5cView(r))` L.70:381 |
| `LossFrmSpecifiedBusCF` | `LossCFCurrentAssmntYear2021.CarryFwdLossDetail.LossFrmSpecifiedBusCF` | — | INPUT | `data-p="loss.cfl.2020-21.specified"` — `inp("loss.cfl.2020-21.specified",{n:1})` L.70:383; exported L.70:462. |
| `TotalSTCGPTILossCF` | `LossCFCurrentAssmntYear2021.CarryFwdLossDetail.TotalSTCGPTILossCF` | **REQ** | INPUT | `data-p="loss.cfl.2020-21.st"` — `inp("loss.cfl.2020-21.st",{n:1})` L.70:384; exported L.70:463. |
| `TotalLTCGPTILossCF` | `LossCFCurrentAssmntYear2021.CarryFwdLossDetail.TotalLTCGPTILossCF` | **REQ** | INPUT | `data-p="loss.cfl.2020-21.lt"` — `inp("loss.cfl.2020-21.lt",{n:1})` L.70:385; exported L.70:464. |
| `DateOfFiling` | `LossCFCurrentAssmntYear2022.CarryFwdLossDetail.DateOfFiling` | **REQ** | INPUT | `data-p="loss.cfl.2021-22.dt"` — `inp("loss.cfl.2021-22.dt",{ph:DF,max:10})` L.70:377; exported `DateOfFiling:ISO(r.dt)||"2025-07-31"` L.70:458 |
| `TotalHPPTILossCF` | `LossCFCurrentAssmntYear2022.CarryFwdLossDetail.TotalHPPTILossCF` | **REQ** | INPUT | `data-p="loss.cfl.2021-22.hp"` — `inp("loss.cfl.2021-22.hp",{n:1})` L.70:378; exported L.70:459. |
| `BrtFwdBusLoss` | `LossCFCurrentAssmntYear2022.CarryFwdLossDetail.BrtFwdBusLoss` | — | INPUT | `data-p="loss.cfl.2021-22.bus5a"` — `inp("loss.cfl.2021-22.bus5a",{n:1})` L.70:379; exported L.70:460. |
| `AdjustAccTax115BADAmt` | `LossCFCurrentAssmntYear2022.CarryFwdLossDetail.AdjustAccTax115BADAmt` | — | INPUT | `data-p="loss.cfl.2021-22.bus5b"` — `inp("loss.cfl.2021-22.bus5b",{n:1})` L.70:380; exported L.70:460. Rendered only under the new regime; a closed 0 cell otherwise (rule 567), and exported only `if(New&&N(r.bus5b))` L.70:460. |
| `BusLossOthThanSpecLossCF` | `LossCFCurrentAssmntYear2022.CarryFwdLossDetail.BusLossOthThanSpecLossCF` | — | COMPUTED | `d.BusLossOthThanSpecLossCF=n0(b5c)` L.70:460 — 5c = MAX(0, 5a − 5b) (rule 568); shown as a read-only cell `cell(b5cView(r))` L.70:381 |
| `LossFrmSpecifiedBusCF` | `LossCFCurrentAssmntYear2022.CarryFwdLossDetail.LossFrmSpecifiedBusCF` | — | INPUT | `data-p="loss.cfl.2021-22.specified"` — `inp("loss.cfl.2021-22.specified",{n:1})` L.70:383; exported L.70:462. |
| `TotalSTCGPTILossCF` | `LossCFCurrentAssmntYear2022.CarryFwdLossDetail.TotalSTCGPTILossCF` | **REQ** | INPUT | `data-p="loss.cfl.2021-22.st"` — `inp("loss.cfl.2021-22.st",{n:1})` L.70:384; exported L.70:463. |
| `TotalLTCGPTILossCF` | `LossCFCurrentAssmntYear2022.CarryFwdLossDetail.TotalLTCGPTILossCF` | **REQ** | INPUT | `data-p="loss.cfl.2021-22.lt"` — `inp("loss.cfl.2021-22.lt",{n:1})` L.70:385; exported L.70:464. |
| `DateOfFiling` | `LossCFCurrentAssmntYear2023.CarryFwdLossDetail.DateOfFiling` | **REQ** | INPUT | `data-p="loss.cfl.2022-23.dt"` — `inp("loss.cfl.2022-23.dt",{ph:DF,max:10})` L.70:377; exported `DateOfFiling:ISO(r.dt)||"2025-07-31"` L.70:458 |
| `TotalHPPTILossCF` | `LossCFCurrentAssmntYear2023.CarryFwdLossDetail.TotalHPPTILossCF` | — | INPUT | `data-p="loss.cfl.2022-23.hp"` — `inp("loss.cfl.2022-23.hp",{n:1})` L.70:378; exported L.70:459. |
| `BrtFwdBusLoss` | `LossCFCurrentAssmntYear2023.CarryFwdLossDetail.BrtFwdBusLoss` | — | INPUT | `data-p="loss.cfl.2022-23.bus5a"` — `inp("loss.cfl.2022-23.bus5a",{n:1})` L.70:379; exported L.70:460. |
| `AdjustAccTax115BADAmt` | `LossCFCurrentAssmntYear2023.CarryFwdLossDetail.AdjustAccTax115BADAmt` | — | INPUT | `data-p="loss.cfl.2022-23.bus5b"` — `inp("loss.cfl.2022-23.bus5b",{n:1})` L.70:380; exported L.70:460. Rendered only under the new regime; a closed 0 cell otherwise (rule 567), and exported only `if(New&&N(r.bus5b))` L.70:460. |
| `BusLossOthThanSpecLossCF` | `LossCFCurrentAssmntYear2023.CarryFwdLossDetail.BusLossOthThanSpecLossCF` | — | COMPUTED | `d.BusLossOthThanSpecLossCF=n0(b5c)` L.70:460 — 5c = MAX(0, 5a − 5b) (rule 568); shown as a read-only cell `cell(b5cView(r))` L.70:381 |
| `LossFrmSpecBusCF` | `LossCFCurrentAssmntYear2023.CarryFwdLossDetail.LossFrmSpecBusCF` | — | INPUT | `data-p="loss.cfl.2022-23.spec"` — `inp("loss.cfl.2022-23.spec",{n:1})` L.70:382; exported L.70:461. |
| `LossFrmSpecifiedBusCF` | `LossCFCurrentAssmntYear2023.CarryFwdLossDetail.LossFrmSpecifiedBusCF` | — | INPUT | `data-p="loss.cfl.2022-23.specified"` — `inp("loss.cfl.2022-23.specified",{n:1})` L.70:383; exported L.70:462. |
| `TotalSTCGPTILossCF` | `LossCFCurrentAssmntYear2023.CarryFwdLossDetail.TotalSTCGPTILossCF` | — | INPUT | `data-p="loss.cfl.2022-23.st"` — `inp("loss.cfl.2022-23.st",{n:1})` L.70:384; exported L.70:463. |
| `TotalLTCGPTILossCF` | `LossCFCurrentAssmntYear2023.CarryFwdLossDetail.TotalLTCGPTILossCF` | — | INPUT | `data-p="loss.cfl.2022-23.lt"` — `inp("loss.cfl.2022-23.lt",{n:1})` L.70:385; exported L.70:464. |
| `OthSrcLossRaceHorseCF` | `LossCFCurrentAssmntYear2023.CarryFwdLossDetail.OthSrcLossRaceHorseCF` | — | INPUT | `data-p="loss.cfl.2022-23.horse"` — `inp("loss.cfl.2022-23.horse",{n:1})` L.70:386; exported L.70:465. |
| `DateOfFiling` | `LossCFCurrentAssmntYear2024.CarryFwdLossDetail.DateOfFiling` | **REQ** | INPUT | `data-p="loss.cfl.2023-24.dt"` — `inp("loss.cfl.2023-24.dt",{ph:DF,max:10})` L.70:377; exported `DateOfFiling:ISO(r.dt)||"2025-07-31"` L.70:458 |
| `TotalHPPTILossCF` | `LossCFCurrentAssmntYear2024.CarryFwdLossDetail.TotalHPPTILossCF` | — | INPUT | `data-p="loss.cfl.2023-24.hp"` — `inp("loss.cfl.2023-24.hp",{n:1})` L.70:378; exported L.70:459. |
| `BrtFwdBusLoss` | `LossCFCurrentAssmntYear2024.CarryFwdLossDetail.BrtFwdBusLoss` | — | INPUT | `data-p="loss.cfl.2023-24.bus5a"` — `inp("loss.cfl.2023-24.bus5a",{n:1})` L.70:379; exported L.70:460. |
| `AdjustAccTax115BADAmt` | `LossCFCurrentAssmntYear2024.CarryFwdLossDetail.AdjustAccTax115BADAmt` | — | INPUT | `data-p="loss.cfl.2023-24.bus5b"` — `inp("loss.cfl.2023-24.bus5b",{n:1})` L.70:380; exported L.70:460. Rendered only under the new regime; a closed 0 cell otherwise (rule 567), and exported only `if(New&&N(r.bus5b))` L.70:460. |
| `BusLossOthThanSpecLossCF` | `LossCFCurrentAssmntYear2024.CarryFwdLossDetail.BusLossOthThanSpecLossCF` | — | COMPUTED | `d.BusLossOthThanSpecLossCF=n0(b5c)` L.70:460 — 5c = MAX(0, 5a − 5b) (rule 568); shown as a read-only cell `cell(b5cView(r))` L.70:381 |
| `LossFrmSpecBusCF` | `LossCFCurrentAssmntYear2024.CarryFwdLossDetail.LossFrmSpecBusCF` | — | INPUT | `data-p="loss.cfl.2023-24.spec"` — `inp("loss.cfl.2023-24.spec",{n:1})` L.70:382; exported L.70:461. |
| `LossFrmSpecifiedBusCF` | `LossCFCurrentAssmntYear2024.CarryFwdLossDetail.LossFrmSpecifiedBusCF` | — | INPUT | `data-p="loss.cfl.2023-24.specified"` — `inp("loss.cfl.2023-24.specified",{n:1})` L.70:383; exported L.70:462. |
| `TotalSTCGPTILossCF` | `LossCFCurrentAssmntYear2024.CarryFwdLossDetail.TotalSTCGPTILossCF` | — | INPUT | `data-p="loss.cfl.2023-24.st"` — `inp("loss.cfl.2023-24.st",{n:1})` L.70:384; exported L.70:463. |
| `TotalLTCGPTILossCF` | `LossCFCurrentAssmntYear2024.CarryFwdLossDetail.TotalLTCGPTILossCF` | — | INPUT | `data-p="loss.cfl.2023-24.lt"` — `inp("loss.cfl.2023-24.lt",{n:1})` L.70:385; exported L.70:464. |
| `OthSrcLossRaceHorseCF` | `LossCFCurrentAssmntYear2024.CarryFwdLossDetail.OthSrcLossRaceHorseCF` | — | INPUT | `data-p="loss.cfl.2023-24.horse"` — `inp("loss.cfl.2023-24.horse",{n:1})` L.70:386; exported L.70:465. |
| `DateOfFiling` | `LossCFCurrentAssmntYear2025.CarryFwdLossDetail.DateOfFiling` | **REQ** | INPUT | `data-p="loss.cfl.2024-25.dt"` — `inp("loss.cfl.2024-25.dt",{ph:DF,max:10})` L.70:377; exported `DateOfFiling:ISO(r.dt)||"2025-07-31"` L.70:458 |
| `TotalHPPTILossCF` | `LossCFCurrentAssmntYear2025.CarryFwdLossDetail.TotalHPPTILossCF` | — | INPUT | `data-p="loss.cfl.2024-25.hp"` — `inp("loss.cfl.2024-25.hp",{n:1})` L.70:378; exported L.70:459. |
| `BrtFwdBusLoss` | `LossCFCurrentAssmntYear2025.CarryFwdLossDetail.BrtFwdBusLoss` | — | INPUT | `data-p="loss.cfl.2024-25.bus5a"` — `inp("loss.cfl.2024-25.bus5a",{n:1})` L.70:379; exported L.70:460. |
| `AdjustAccTax115BADAmt` | `LossCFCurrentAssmntYear2025.CarryFwdLossDetail.AdjustAccTax115BADAmt` | — | INPUT | `data-p="loss.cfl.2024-25.bus5b"` — `inp("loss.cfl.2024-25.bus5b",{n:1})` L.70:380; exported L.70:460. Rendered only under the new regime; a closed 0 cell otherwise (rule 567), and exported only `if(New&&N(r.bus5b))` L.70:460. |
| `BusLossOthThanSpecLossCF` | `LossCFCurrentAssmntYear2025.CarryFwdLossDetail.BusLossOthThanSpecLossCF` | — | COMPUTED | `d.BusLossOthThanSpecLossCF=n0(b5c)` L.70:460 — 5c = MAX(0, 5a − 5b) (rule 568); shown as a read-only cell `cell(b5cView(r))` L.70:381 |
| `LossFrmSpecBusCF` | `LossCFCurrentAssmntYear2025.CarryFwdLossDetail.LossFrmSpecBusCF` | — | INPUT | `data-p="loss.cfl.2024-25.spec"` — `inp("loss.cfl.2024-25.spec",{n:1})` L.70:382; exported L.70:461. |
| `LossFrmSpecifiedBusCF` | `LossCFCurrentAssmntYear2025.CarryFwdLossDetail.LossFrmSpecifiedBusCF` | — | INPUT | `data-p="loss.cfl.2024-25.specified"` — `inp("loss.cfl.2024-25.specified",{n:1})` L.70:383; exported L.70:462. |
| `TotalSTCGPTILossCF` | `LossCFCurrentAssmntYear2025.CarryFwdLossDetail.TotalSTCGPTILossCF` | — | INPUT | `data-p="loss.cfl.2024-25.st"` — `inp("loss.cfl.2024-25.st",{n:1})` L.70:384; exported L.70:463. |
| `TotalLTCGPTILossCF` | `LossCFCurrentAssmntYear2025.CarryFwdLossDetail.TotalLTCGPTILossCF` | — | INPUT | `data-p="loss.cfl.2024-25.lt"` — `inp("loss.cfl.2024-25.lt",{n:1})` L.70:385; exported L.70:464. |
| `OthSrcLossRaceHorseCF` | `LossCFCurrentAssmntYear2025.CarryFwdLossDetail.OthSrcLossRaceHorseCF` | — | INPUT | `data-p="loss.cfl.2024-25.horse"` — `inp("loss.cfl.2024-25.horse",{n:1})` L.70:386; exported L.70:465. |
| `DateOfFiling` | `LossCFCurrentAssmntYear2026.CarryFwdLossDetail.DateOfFiling` | **REQ** | INPUT | `data-p="loss.cfl.2025-26.dt"` — `inp("loss.cfl.2025-26.dt",{ph:DF,max:10})` L.70:377; exported `DateOfFiling:ISO(r.dt)||"2025-07-31"` L.70:458 |
| `TotalHPPTILossCF` | `LossCFCurrentAssmntYear2026.CarryFwdLossDetail.TotalHPPTILossCF` | — | INPUT | `data-p="loss.cfl.2025-26.hp"` — `inp("loss.cfl.2025-26.hp",{n:1})` L.70:378; exported L.70:459. |
| `BrtFwdBusLoss` | `LossCFCurrentAssmntYear2026.CarryFwdLossDetail.BrtFwdBusLoss` | — | INPUT | `data-p="loss.cfl.2025-26.bus5a"` — `inp("loss.cfl.2025-26.bus5a",{n:1})` L.70:379; exported L.70:460. |
| `AdjustAccTax115BADAmt` | `LossCFCurrentAssmntYear2026.CarryFwdLossDetail.AdjustAccTax115BADAmt` | — | INPUT | `data-p="loss.cfl.2025-26.bus5b"` — `inp("loss.cfl.2025-26.bus5b",{n:1})` L.70:380; exported L.70:460. Rendered only under the new regime; a closed 0 cell otherwise (rule 567), and exported only `if(New&&N(r.bus5b))` L.70:460. |
| `BusLossOthThanSpecLossCF` | `LossCFCurrentAssmntYear2026.CarryFwdLossDetail.BusLossOthThanSpecLossCF` | — | COMPUTED | `d.BusLossOthThanSpecLossCF=n0(b5c)` L.70:460 — 5c = MAX(0, 5a − 5b) (rule 568); shown as a read-only cell `cell(b5cView(r))` L.70:381 |
| `LossFrmSpecBusCF` | `LossCFCurrentAssmntYear2026.CarryFwdLossDetail.LossFrmSpecBusCF` | — | INPUT | `data-p="loss.cfl.2025-26.spec"` — `inp("loss.cfl.2025-26.spec",{n:1})` L.70:382; exported L.70:461. |
| `LossFrmSpecifiedBusCF` | `LossCFCurrentAssmntYear2026.CarryFwdLossDetail.LossFrmSpecifiedBusCF` | — | INPUT | `data-p="loss.cfl.2025-26.specified"` — `inp("loss.cfl.2025-26.specified",{n:1})` L.70:383; exported L.70:462. |
| `TotalSTCGPTILossCF` | `LossCFCurrentAssmntYear2026.CarryFwdLossDetail.TotalSTCGPTILossCF` | — | INPUT | `data-p="loss.cfl.2025-26.st"` — `inp("loss.cfl.2025-26.st",{n:1})` L.70:384; exported L.70:463. |
| `TotalLTCGPTILossCF` | `LossCFCurrentAssmntYear2026.CarryFwdLossDetail.TotalLTCGPTILossCF` | — | INPUT | `data-p="loss.cfl.2025-26.lt"` — `inp("loss.cfl.2025-26.lt",{n:1})` L.70:385; exported L.70:464. |
| `OthSrcLossRaceHorseCF` | `LossCFCurrentAssmntYear2026.CarryFwdLossDetail.OthSrcLossRaceHorseCF` | — | INPUT | `data-p="loss.cfl.2025-26.horse"` — `inp("loss.cfl.2025-26.horse",{n:1})` L.70:386; exported L.70:465. |
| `TotalHPPTILossCF` | `TotalOfBFLossesEarlierYrs.LossSummaryDetail.TotalHPPTILossCF` | — | COMPUTED | CFL row xvii — `C.<block>=summ(L.bf)` L.70:469 (`summ` helper L.70:467-468), leaf from `.hp`. Σ of the AY rows live in that head's carry window (engLoss `bf` accumulator, L.70:178-182) |
| `BusLossOthThanSpecLossCF` | `TotalOfBFLossesEarlierYrs.LossSummaryDetail.BusLossOthThanSpecLossCF` | — | COMPUTED | CFL row xvii — `C.<block>=summ(L.bf)` L.70:469 (`summ` helper L.70:467-468), leaf from `.bus`. Σ of the AY rows live in that head's carry window (engLoss `bf` accumulator, L.70:178-182) |
| `LossFrmSpecBusCF` | `TotalOfBFLossesEarlierYrs.LossSummaryDetail.LossFrmSpecBusCF` | — | COMPUTED | CFL row xvii — `C.<block>=summ(L.bf)` L.70:469 (`summ` helper L.70:467-468), leaf from `.spec`. Σ of the AY rows live in that head's carry window (engLoss `bf` accumulator, L.70:178-182) |
| `LossFrmSpecifiedBusCF` | `TotalOfBFLossesEarlierYrs.LossSummaryDetail.LossFrmSpecifiedBusCF` | — | COMPUTED | CFL row xvii — `C.<block>=summ(L.bf)` L.70:469 (`summ` helper L.70:467-468), leaf from `.specified`. Σ of the AY rows live in that head's carry window (engLoss `bf` accumulator, L.70:178-182) |
| `TotalSTCGPTILossCF` | `TotalOfBFLossesEarlierYrs.LossSummaryDetail.TotalSTCGPTILossCF` | — | COMPUTED | CFL row xvii — `C.<block>=summ(L.bf)` L.70:469 (`summ` helper L.70:467-468), leaf from `.st`. Σ of the AY rows live in that head's carry window (engLoss `bf` accumulator, L.70:178-182) |
| `TotalLTCGPTILossCF` | `TotalOfBFLossesEarlierYrs.LossSummaryDetail.TotalLTCGPTILossCF` | — | COMPUTED | CFL row xvii — `C.<block>=summ(L.bf)` L.70:469 (`summ` helper L.70:467-468), leaf from `.lt`. Σ of the AY rows live in that head's carry window (engLoss `bf` accumulator, L.70:178-182) |
| `OthSrcLossRaceHorseCF` | `TotalOfBFLossesEarlierYrs.LossSummaryDetail.OthSrcLossRaceHorseCF` | — | COMPUTED | CFL row xvii — `C.<block>=summ(L.bf)` L.70:469 (`summ` helper L.70:467-468), leaf from `.horse`. Σ of the AY rows live in that head's carry window (engLoss `bf` accumulator, L.70:178-182) |
| `TotalHPPTILossCF` | `AdjTotBFLossInBFLA.LossSummaryDetail.TotalHPPTILossCF` | — | COMPUTED | CFL row xviii — `C.<block>=summ(L.usedBF)` L.70:470 (`summ` helper L.70:467-468), leaf from `.hp`. how much of each b/f column BFLA actually used (engLoss `usedBF`, L.70:198-201) |
| `BusLossOthThanSpecLossCF` | `AdjTotBFLossInBFLA.LossSummaryDetail.BusLossOthThanSpecLossCF` | — | COMPUTED | CFL row xviii — `C.<block>=summ(L.usedBF)` L.70:470 (`summ` helper L.70:467-468), leaf from `.bus`. how much of each b/f column BFLA actually used (engLoss `usedBF`, L.70:198-201) |
| `LossFrmSpecBusCF` | `AdjTotBFLossInBFLA.LossSummaryDetail.LossFrmSpecBusCF` | — | COMPUTED | CFL row xviii — `C.<block>=summ(L.usedBF)` L.70:470 (`summ` helper L.70:467-468), leaf from `.spec`. how much of each b/f column BFLA actually used (engLoss `usedBF`, L.70:198-201) |
| `LossFrmSpecifiedBusCF` | `AdjTotBFLossInBFLA.LossSummaryDetail.LossFrmSpecifiedBusCF` | — | COMPUTED | CFL row xviii — `C.<block>=summ(L.usedBF)` L.70:470 (`summ` helper L.70:467-468), leaf from `.specified`. how much of each b/f column BFLA actually used (engLoss `usedBF`, L.70:198-201) |
| `TotalSTCGPTILossCF` | `AdjTotBFLossInBFLA.LossSummaryDetail.TotalSTCGPTILossCF` | — | COMPUTED | CFL row xviii — `C.<block>=summ(L.usedBF)` L.70:470 (`summ` helper L.70:467-468), leaf from `.st`. how much of each b/f column BFLA actually used (engLoss `usedBF`, L.70:198-201) |
| `TotalLTCGPTILossCF` | `AdjTotBFLossInBFLA.LossSummaryDetail.TotalLTCGPTILossCF` | — | COMPUTED | CFL row xviii — `C.<block>=summ(L.usedBF)` L.70:470 (`summ` helper L.70:467-468), leaf from `.lt`. how much of each b/f column BFLA actually used (engLoss `usedBF`, L.70:198-201) |
| `OthSrcLossRaceHorseCF` | `AdjTotBFLossInBFLA.LossSummaryDetail.OthSrcLossRaceHorseCF` | — | COMPUTED | CFL row xviii — `C.<block>=summ(L.usedBF)` L.70:470 (`summ` helper L.70:467-468), leaf from `.horse`. how much of each b/f column BFLA actually used (engLoss `usedBF`, L.70:198-201) |
| `TotalHPPTILossCF` | `CurrentAYloss.LossSummaryDetail.TotalHPPTILossCF` | — | COMPUTED | CFL row xix — `C.<block>=summ(L.cur)` L.70:471 (`summ` helper L.70:467-468), leaf from `.hp`. engLoss `cur` from CYLA balances + BP B42/C48 + CG Table-E + OS race-horse (L.70:221-227) |
| `BusLossOthThanSpecLossCF` | `CurrentAYloss.LossSummaryDetail.BusLossOthThanSpecLossCF` | — | COMPUTED | CFL row xix — `C.<block>=summ(L.cur)` L.70:471 (`summ` helper L.70:467-468), leaf from `.bus`. engLoss `cur` from CYLA balances + BP B42/C48 + CG Table-E + OS race-horse (L.70:221-227) |
| `LossFrmSpecBusCF` | `CurrentAYloss.LossSummaryDetail.LossFrmSpecBusCF` | — | COMPUTED | CFL row xix — `C.<block>=summ(L.cur)` L.70:471 (`summ` helper L.70:467-468), leaf from `.spec`. engLoss `cur` from CYLA balances + BP B42/C48 + CG Table-E + OS race-horse (L.70:221-227) |
| `LossFrmSpecifiedBusCF` | `CurrentAYloss.LossSummaryDetail.LossFrmSpecifiedBusCF` | — | COMPUTED | CFL row xix — `C.<block>=summ(L.cur)` L.70:471 (`summ` helper L.70:467-468), leaf from `.specified`. engLoss `cur` from CYLA balances + BP B42/C48 + CG Table-E + OS race-horse (L.70:221-227) |
| `TotalSTCGPTILossCF` | `CurrentAYloss.LossSummaryDetail.TotalSTCGPTILossCF` | — | COMPUTED | CFL row xix — `C.<block>=summ(L.cur)` L.70:471 (`summ` helper L.70:467-468), leaf from `.st`. engLoss `cur` from CYLA balances + BP B42/C48 + CG Table-E + OS race-horse (L.70:221-227) |
| `TotalLTCGPTILossCF` | `CurrentAYloss.LossSummaryDetail.TotalLTCGPTILossCF` | — | COMPUTED | CFL row xix — `C.<block>=summ(L.cur)` L.70:471 (`summ` helper L.70:467-468), leaf from `.lt`. engLoss `cur` from CYLA balances + BP B42/C48 + CG Table-E + OS race-horse (L.70:221-227) |
| `OthSrcLossRaceHorseCF` | `CurrentAYloss.LossSummaryDetail.OthSrcLossRaceHorseCF` | — | COMPUTED | CFL row xix — `C.<block>=summ(L.cur)` L.70:471 (`summ` helper L.70:467-468), leaf from `.horse`. engLoss `cur` from CYLA balances + BP B42/C48 + CG Table-E + OS race-horse (L.70:221-227) |
| `TotalHPPTILossCF` | `CurrentYearDistrUnitHolder.LossSummaryDetail.TotalHPPTILossCF` | **REQ** | **ORPHAN** | **No `data-p` anywhere and nothing computes it.** `S.loss.distr` is read at L.70:233 (`Math.min(N((S.loss.distr||{})[k]),cur[k])`) but is absent from the state seed (L.70:26-27) and is written ONLY by `impLoss` from an already-filed JSON (L.70:517-518). Row xx renders as the read-only footer `frow("xx",...,D2)` L.70:394. Export always writes 0: `C.CurrentYearDistrUnitHolder={LossSummaryDetail:{...n0(L.distr.hp)...}}` L.70:472-473. |
| `TotalSTCGPTILossCF` | `CurrentYearDistrUnitHolder.LossSummaryDetail.TotalSTCGPTILossCF` | **REQ** | **ORPHAN** | **No `data-p` anywhere and nothing computes it.** `S.loss.distr` is read at L.70:233 (`Math.min(N((S.loss.distr||{})[k]),cur[k])`) but is absent from the state seed (L.70:26-27) and is written ONLY by `impLoss` from an already-filed JSON (L.70:517-518). Row xx renders as the read-only footer `frow("xx",...,D2)` L.70:394. Export always writes 0: `C.CurrentYearDistrUnitHolder={LossSummaryDetail:{...n0(L.distr.hp)...}}` L.70:472-473. |
| `TotalLTCGPTILossCF` | `CurrentYearDistrUnitHolder.LossSummaryDetail.TotalLTCGPTILossCF` | **REQ** | **ORPHAN** | **No `data-p` anywhere and nothing computes it.** `S.loss.distr` is read at L.70:233 (`Math.min(N((S.loss.distr||{})[k]),cur[k])`) but is absent from the state seed (L.70:26-27) and is written ONLY by `impLoss` from an already-filed JSON (L.70:517-518). Row xx renders as the read-only footer `frow("xx",...,D2)` L.70:394. Export always writes 0: `C.CurrentYearDistrUnitHolder={LossSummaryDetail:{...n0(L.distr.hp)...}}` L.70:472-473. |
| `OthSrcLossRaceHorseCF` | `CurrentYearDistrUnitHolder.LossSummaryDetail.OthSrcLossRaceHorseCF` | — | **ORPHAN** | **No `data-p` anywhere and nothing computes it.** `S.loss.distr` is read at L.70:233 (`Math.min(N((S.loss.distr||{})[k]),cur[k])`) but is absent from the state seed (L.70:26-27) and is written ONLY by `impLoss` from an already-filed JSON (L.70:517-518). Row xx renders as the read-only footer `frow("xx",...,D2)` L.70:394. Export always writes 0: `C.CurrentYearDistrUnitHolder={LossSummaryDetail:{...n0(L.distr.hp)...}}` L.70:472-473. |
| `TotalHPPTILossCF` | `CurrentYearLossCF.LossSummaryDetail.TotalHPPTILossCF` | — | COMPUTED | CFL row xxi — `C.<block>=summ(L.curCF)` L.70:474 (`summ` helper L.70:467-468), leaf from `.hp`. curCF = MAX(0, xix − xx) (L.70:235) |
| `BusLossOthThanSpecLossCF` | `CurrentYearLossCF.LossSummaryDetail.BusLossOthThanSpecLossCF` | — | COMPUTED | CFL row xxi — `C.<block>=summ(L.curCF)` L.70:474 (`summ` helper L.70:467-468), leaf from `.bus`. curCF = MAX(0, xix − xx) (L.70:235) |
| `LossFrmSpecBusCF` | `CurrentYearLossCF.LossSummaryDetail.LossFrmSpecBusCF` | — | COMPUTED | CFL row xxi — `C.<block>=summ(L.curCF)` L.70:474 (`summ` helper L.70:467-468), leaf from `.spec`. curCF = MAX(0, xix − xx) (L.70:235) |
| `LossFrmSpecifiedBusCF` | `CurrentYearLossCF.LossSummaryDetail.LossFrmSpecifiedBusCF` | — | COMPUTED | CFL row xxi — `C.<block>=summ(L.curCF)` L.70:474 (`summ` helper L.70:467-468), leaf from `.specified`. curCF = MAX(0, xix − xx) (L.70:235) |
| `TotalSTCGPTILossCF` | `CurrentYearLossCF.LossSummaryDetail.TotalSTCGPTILossCF` | — | COMPUTED | CFL row xxi — `C.<block>=summ(L.curCF)` L.70:474 (`summ` helper L.70:467-468), leaf from `.st`. curCF = MAX(0, xix − xx) (L.70:235) |
| `TotalLTCGPTILossCF` | `CurrentYearLossCF.LossSummaryDetail.TotalLTCGPTILossCF` | — | COMPUTED | CFL row xxi — `C.<block>=summ(L.curCF)` L.70:474 (`summ` helper L.70:467-468), leaf from `.lt`. curCF = MAX(0, xix − xx) (L.70:235) |
| `OthSrcLossRaceHorseCF` | `CurrentYearLossCF.LossSummaryDetail.OthSrcLossRaceHorseCF` | — | COMPUTED | CFL row xxi — `C.<block>=summ(L.curCF)` L.70:474 (`summ` helper L.70:467-468), leaf from `.horse`. curCF = MAX(0, xix − xx) (L.70:235) |
| `TotalHPPTILossCF` | `TotalLossCFSummary.LossSummaryDetail.TotalHPPTILossCF` | — | COMPUTED | CFL row xxii — `C.<block>=summ(L.cf)` L.70:475 (`summ` helper L.70:467-468), leaf from `.hp`. cf = bf − MAX(used,oldest) + curCF, window lapse (L.70:240-243) |
| `BusLossOthThanSpecLossCF` | `TotalLossCFSummary.LossSummaryDetail.BusLossOthThanSpecLossCF` | — | COMPUTED | CFL row xxii — `C.<block>=summ(L.cf)` L.70:475 (`summ` helper L.70:467-468), leaf from `.bus`. cf = bf − MAX(used,oldest) + curCF, window lapse (L.70:240-243) |
| `LossFrmSpecBusCF` | `TotalLossCFSummary.LossSummaryDetail.LossFrmSpecBusCF` | — | COMPUTED | CFL row xxii — `C.<block>=summ(L.cf)` L.70:475 (`summ` helper L.70:467-468), leaf from `.spec`. cf = bf − MAX(used,oldest) + curCF, window lapse (L.70:240-243) |
| `LossFrmSpecifiedBusCF` | `TotalLossCFSummary.LossSummaryDetail.LossFrmSpecifiedBusCF` | — | COMPUTED | CFL row xxii — `C.<block>=summ(L.cf)` L.70:475 (`summ` helper L.70:467-468), leaf from `.specified`. cf = bf − MAX(used,oldest) + curCF, window lapse (L.70:240-243) |
| `TotalSTCGPTILossCF` | `TotalLossCFSummary.LossSummaryDetail.TotalSTCGPTILossCF` | — | COMPUTED | CFL row xxii — `C.<block>=summ(L.cf)` L.70:475 (`summ` helper L.70:467-468), leaf from `.st`. cf = bf − MAX(used,oldest) + curCF, window lapse (L.70:240-243) |
| `TotalLTCGPTILossCF` | `TotalLossCFSummary.LossSummaryDetail.TotalLTCGPTILossCF` | — | COMPUTED | CFL row xxii — `C.<block>=summ(L.cf)` L.70:475 (`summ` helper L.70:467-468), leaf from `.lt`. cf = bf − MAX(used,oldest) + curCF, window lapse (L.70:240-243) |
| `OthSrcLossRaceHorseCF` | `TotalLossCFSummary.LossSummaryDetail.OthSrcLossRaceHorseCF` | — | COMPUTED | CFL row xxii — `C.<block>=summ(L.cf)` L.70:475 (`summ` helper L.70:467-468), leaf from `.horse`. cf = bf − MAX(used,oldest) + curCF, window lapse (L.70:240-243) |

## ITRScheduleUD / ScheduleUD[] — unabsorbed depreciation and 35(4) allowance (18 leaves)

| leaf | schema path | required? | bucket | evidence |
|---|---|---|---|---|
| `CurrAssYr` | `CurrAssYr` | **REQ** | COMPUTED | `CurrAssYr:"2026-27"` constant L.70:438 — fixed enum, book Unabsorbed_Depreciation.md:137 "write it as a constant, do not solicit it" |
| `CurBalCFNY` | `CurBalCFNY` | **REQ** | INPUT | `data-p="loss.ud.curBal"` — `inp("loss.ud.curBal",{n:1})` L.70:349; exported L.70:438 |
| `CurAllowBalCFNY` | `CurAllowBalCFNY` | **REQ** | INPUT | `data-p="loss.ud.curAllowBal"` — `inp("loss.ud.curAllowBal",{n:1})` L.70:350; exported L.70:438 |
| `AssYr` | `ScheduleUD[].AssYr` | **REQ** | INPUT | `data-p="loss.ud.rows.<i>.ay"` — grid col {k:"ay",t:"txt",req:1} L.70:353; exported `AssYr:st0(r.ay)||"2025-26"` L.70:443 |
| `AmtBFUD` | `ScheduleUD[].AmtBFUD` | **REQ** | INPUT | `data-p="loss.ud.rows.<i>.bfUD"` — grid col {k:"bfUD",t:"num"} L.70:354; exported L.70:443 |
| `AdjustAccTax115BADAmt` | `ScheduleUD[].AdjustAccTax115BADAmt` | **REQ** | INPUT | `data-p="loss.ud.rows.<i>.adj"` — grid col {k:"adj",t:"num"} L.70:355; forced to 0 unless the new regime (engUD L.70:280, rule 572); exported L.70:443 |
| `AmtDeprSOCY` | `ScheduleUD[].AmtDeprSOCY` | **REQ** | INPUT | `data-p="loss.ud.rows.<i>.deprSO"` — grid col {k:"deprSO",t:"num"} L.70:356; exported L.70:443 |
| `BalCFNY` | `ScheduleUD[].BalCFNY` | **REQ** | COMPUTED | grid col {k:"bal",t:"calc"} L.70:357 (untypeable) — `bal=MAX(0,bfUD−adj−deprSO)` engUD L.70:282; exported `BalCFNY:n0(r.bal)` L.70:444 |
| `AmtBFUAllow` | `ScheduleUD[].AmtBFUAllow` | **REQ** | INPUT | `data-p="loss.ud.rows.<i>.bfUAllow"` — grid col {k:"bfUAllow",t:"num"} L.70:358; exported `AmtBFUAllow:n0(r.bfUA)` L.70:444 |
| `AmtAllowSOCY` | `ScheduleUD[].AmtAllowSOCY` | **REQ** | INPUT | `data-p="loss.ud.rows.<i>.allowSO"` — grid col {k:"allowSO",t:"num"} L.70:359; exported L.70:444 |
| `AllowBalCFNY` | `ScheduleUD[].AllowBalCFNY` | **REQ** | COMPUTED | grid col {k:"allowBal",t:"calc"} L.70:360 (untypeable) — `allowBal=MAX(0,bfUA−allowSO)` engUD L.70:283; exported L.70:444 |
| `TotBFUDepritAmt` | `TotBFUDepritAmt` | **REQ** | COMPUTED | `U.TotBFUDepritAmt` L.70:438-441 — UD.totBF (Σ col 3) (engUD L.70:287-289); rendered as the grid `foot:` row L.70:362 |
| `TotAdjustAccTax115BADAmt` | `TotAdjustAccTax115BADAmt` | **REQ** | COMPUTED | `U.TotAdjustAccTax115BADAmt` L.70:438-441 — UD.totAdj (Σ col 3a) (engUD L.70:287-289); rendered as the grid `foot:` row L.70:362 |
| `TotCurYrdepritSetoffInc` | `TotCurYrdepritSetoffInc` | **REQ** | COMPUTED | `U.TotCurYrdepritSetoffInc` L.70:438-441 — UD.totSetoff (Σ col 4) → BFLA col 3 pool (engUD L.70:287-289); rendered as the grid `foot:` row L.70:362 |
| `TotDepritBalCFNY` | `TotDepritBalCFNY` | **REQ** | COMPUTED | `U.TotDepritBalCFNY` L.70:438-441 — UD.totBal (Σ col 5 + CurBalCFNY) (engUD L.70:287-289); rendered as the grid `foot:` row L.70:362 |
| `TotBFUAllowAmt` | `TotBFUAllowAmt` | **REQ** | COMPUTED | `U.TotBFUAllowAmt` L.70:438-441 — UD.totBFAllow (Σ col 6) (engUD L.70:287-289); rendered as the grid `foot:` row L.70:362 |
| `TotCurYrAllowSetoffInc` | `TotCurYrAllowSetoffInc` | **REQ** | COMPUTED | `U.TotCurYrAllowSetoffInc` L.70:438-441 — UD.totAllowSetoff (Σ col 7) → BFLA col 4 pool (engUD L.70:287-289); rendered as the grid `foot:` row L.70:362 |
| `TotalBalCFNY` | `TotalBalCFNY` | **REQ** | COMPUTED | `U.TotalBalCFNY` L.70:438-441 — UD.totAllowBal (Σ col 8 + CurAllowBalCFNY) (engUD L.70:287-289); rendered as the grid `foot:` row L.70:362 |

---

## Notes from the pass (not orphans — for the record)

1. **All 13 CYLA head blocks and all 13 BFLA head blocks are emitted unconditionally** (`70_sec_loss.js:415,428`, then
   `put(j,"ScheduleCYLA",CY)` L.420 and `put(j,"ScheduleBFLA",BF)` L.432), so the six schema-required CG blocks
   (`STCG20Per`, `STCG30Per`, `STCGAppRate`, `STCGDTAARate`, `LTCG12_5Per`, `LTCGDTAARate`) are always present in both.
   `put()` skips only `undefined`/`null`/`""` (`Yukti_ITR5.html:17601-17603`) and `n0(x)=Math.max(0,R(x))` always returns a
   number, so a zero is written, never dropped — no required leaf can go missing through a zero value.

2. **The per-head column masks match the schema exactly.** `LOSS_ROWS` (`70_sec_loss.js:40-53`) drops `HPlossCurYrSetoff`
   on `HP`, `BusLossSetoff` on `BusProfExclSpecProf`/`SpeculationIncome`/`SpecifiedBusIncome`,
   `OthSrcLossNoRaceHorseSetoff` on `OthSrcExclRaceHorseLottery`, and `BFlossPrevYrUndSameHeadSetoff` on
   `OthSrcExclRaceHorse`/`IncOSDTAA` — which is precisely the set of leaves those schema blocks do not declare. Nothing is
   emitted that the schema forbids and nothing declared is skipped.

3. **The CYLA/BFLA name asymmetry is handled.** The CYLA normal-OS block is `OthSrcExclRaceHorseLottery` while the BFLA one
   is `OthSrcExclRaceHorse`; `LOSS_ROWS` carries both names (`cyKey`/`bfKey`, `70_sec_loss.js:51`). Confirmed against the
   schema definitions.

4. **The CFL tier gating matches the schema's three `CarryFwdLossDetail` shapes.** `F_SPEC` / `F_8YR` / `F_FULL`
   (`70_sec_loss.js:79-81`) line up leaf-for-leaf with `CarryFwdLossDetailSpcfBus` (2 leaves),
   `CarryFwdLossWithoutSpecBusOS` (8) and `CarryFwdLossDetail` (10). No year emits a head leaf its block does not declare
   (`CFL.md:179` warns this would not validate).

5. **`AdjustAccTax115BADAmt` (CFL 5b and UD 3a) is regime-gated, not orphaned.** The CFL 5b input renders only under the
   new regime and is a closed zero cell otherwise (`70_sec_loss.js:380`); UD 3a has a permanent `data-p` but the engine
   zeroes it outside the new regime (`70_sec_loss.js:280`). Both follow rules 567 / 572, and `chkLoss` warns if either is
   filled without the new regime (`70_sec_loss.js:535-539`).

6. **Minor, worth a look — `ScheduleUD[].AssYr` is a free-text box.** The schema constrains it to
   `pattern: "[0-9][0-9][0-9][0-9]-[0-9][0-9]"`, but the grid column is `{k:"ay", t:"txt"}` (`70_sec_loss.js:353`) with no
   mask, and the export falls back to a hard-coded `"2025-26"` when blank (`70_sec_loss.js:443`). The leaf has a home, so
   this is not an orphan — but a typo such as `2025-2026` would ship an unvalidatable return. A `sel()` over the allowed
   years would close it.

7. **Minor — the UD earlier-year grid is unbounded.** The utility gives rows 8-16, i.e. nine earlier-year lines
   (`Unabsorbed_Depreciation.md:14,113`); `grid("loss.ud.rows", ...)` has no cap. Not a leaf-coverage defect.

