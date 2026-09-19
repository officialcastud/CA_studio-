# ITR-3 audit — GROUP G5 (hp · os · loss)

Sheets: **House Property** (§hp), **OS** (§os), **CYLA - BFLA** + **CFL** (§loss).
Sources cross-read: the utility (`sheet_.xml` House Property / OS=sheet24 / CYLA-BFLA=sheet25 /
CFL=sheet26), the schema blocks (ScheduleHP / ScheduleOS / ScheduleCYLA / ScheduleBFLA / ScheduleCFL),
`rules.json`, and the books `House_Property.md`, `OS.md`, `CYLA_BFLA.md`, `CFL.md`, `REGIME.md`.

---

## House Property  (section: hp)

### Missing fields/rows
- None. All 46 content rows of the utility sheet (rows 3–75, blocks at 4–38 / 39–73) are built in
  `forms/ITR-3/src/70_sec_hp.js`: address/town/state/country/PIN/ZIP, owner + "specify if Others",
  co-owned flag + share, the co-owner table, type, the tenant table, the rent working **a–k**
  (`engProp` lines 114–145 mirror `[I23]/[K24]/[K25]/[I26]/[K35]/[K36]/[K38]`), the inside-block
  Section 24(b) loan table (all seven columns), item 2 PassThroghIncome (row 74) and item 3
  TotalIncomeChargeableUnHP (row 75). The 114 hidden rows are blank spare capacity (extra
  co-owner/tenant/loan rows and property blocks 3+), correctly implemented as "add another".

### Dropdowns
- Owner F6 {SE,MI,SP,OT}, co-owned I6 {YES,NO}, type F15 {S,L,D}, loan-from E31 {B,I}, State (38+Foreign),
  Country (250) — all present and matching (`HP_OWNER/HP_COOWN/HP_TYPE/HP_LOANFROM/HP_STATE/HP_COUNTRY`).
  No missing values.

### Conditional cascades (show/hide)
- FLAG "Is the property co-owned?" [I6]: YES → opens the co-owner grid (rows 8–14) + free-text share;
  NO → share fixed at 100, grid hidden. Ours: **YES** (secHp lines 200–214; share input only when co-owned).
- SELECTOR "Type Of House Property?" [F15]: S (self-occupied) → forces 1a nil, hides a–g inputs, opens only
  interest capped at ₹2,00,000; L/D → full a–k working + the tenant grid opens, 1a>0 required. Ours: **YES**
  (hpBlock lines 219–248; tenant grid only when `p.type!=="S"`).
- Third self-occupied → deemed let out (s.23(4)): utility limits to two self-occupied. Ours: **YES** — warning
  (secHp lines 295–297) + `chkHp` err (lines 505–506).
- Arrears 1j taken at 70% [K37]: ours **YES** (`engProp` line 139 `0.70*jRecd`).

### Regime open/close
- Self-occupied interest u/s 24(b): Excel new = **closed** ([H27] cap; `bacValue=1` disallows it), old = up to ₹2L.
  Ours: `isNew()` gate at `70_sec_hp.js:134` (new → `h=0, barred`; old → cap 200000). **Match.** Renderer closes
  item 1h in new regime (lines 267–270). **Match.**
- HP-loss set-off / carry: Excel `[N74]=IF(bacValue=1,0,MAX(...,-200000))`, `[N75]` remainder → CFL; nil under
  new regime. This section only publishes the signed head total `S.C.hp.income` (line 170); the closure is applied
  in §loss (see below). Publication is correct.

### Audit u/s
- None on this sheet (correctly — no 44AB/44AD/92E trigger lives here).

### ITR-2 bleed / notes
- Clean build from ITR-3's own sheet. Share correctly applied at 1f not 1a; loan table inside the block; loss
  cap deferred to CYLA. No bleed.

### Verdict: SOLID — full coverage, cascades and regime gates all reproduced.

---

## OS  (section: os)

### Missing fields/rows
- None material. All live rows are built (`70_sec_os.js`): 1a(i–iii) dividends, 1b(i–ix) interest,
  1c rent, 1d(i–v) 56(2)(x), 1e (family pension, OthersInc array, 89A notified/other/prior-year lines,
  56(2)(xii)/(xiii)); item 2 special rates — 2a(i) 115BB, 2a(ii) 115BBJ (row 45 live version), 2b 115BBE(i–vi),
  2c accumulated-PF u/s 111 table, 2d OthersGrossDtls, 2e PTIOthersGrossDtls, 2f NRI DTAA table; item 3
  section-57 deductions (3a(i)/3a(ii)/3b/3c/3d); items 4/5/5a; item 6 net normal; item 7; item 8 race horses
  (8a–8e); item 9; item 10 quarterly break-up (11 live rows).
- Hidden rows correctly excluded: **42H/43H/44H** (superseded 115BBJ-with-Rule-133 version — the live one is
  row 45) and **116H** (Dividend 115A(1)(a)(iiac) quarterly row). Per rule 1, not built.

### Dropdowns
- 2f DTAA "Item No." classifier [L107/J27] {1ai,1aiii,1b,1c,1d,2ai,2aii,2d,2e} — `OS_DTAA_NAT` matches all 9.
- 2d special-rate [G62:G66]: all 16 utility live options are covered by `OS_SPL`, with the utility display
  codes mapped to their schema enum values (`5AC1a`→`5AC1ab`, `5AC1b`→`5AC1abD`). `OS_SPL` additionally carries
  5 schema-valid codes not shown in the utility 2d list (5ACA1a, 5AD1i, 5AD1iP, 5AD1iDiv, 5BBF) — harmless
  over-inclusion, not a missing value.
- 2e PTI [G71:G76]: `OS_PTI` covers all standard PTI codes; the utility list includes one anomalous
  `5BBH - 115BBH (VDA)` entry (VDA has its own schedule) not in `OS_PTI` — negligible.

### Conditional cascades (show/hide)
- 3b Depreciation opens only if 1c rental offered: Excel; ours **YES** (`secOs` line 455 renders input only when
  `C.c1>0`; `chkOs` line 705 blocks otherwise).
- 3c interest u/s 57(1) eligible only against 1a(i)/1a(ii) dividend, ≤20%: Excel [T95/U95]; ours **YES**
  (`engOs` lines 281–283; `chkOs` 708–713).
- 8e race-horse loss → CFL 10xii note: rendered (line 486). **BUT the wiring to §loss is broken — see the loss
  section below.**

### Regime open/close
- Family pension deduction u/s 57(iia) [J88] = `IF(bacValue=1, MIN(fp/3, 25000), IF(bacValue=2, MIN(fp/3, 15000), 0))`
  — **cap differs by regime: ₹25,000 new, ₹15,000 old.** The engine is **correct** (`70_sec_os.js:276`
  `Math.min(R(fp/3), isNew()?25000:15000)`). **Match.**
  - Defect (documentation/UI only): the file header comment (lines 12–15) wrongly states the cap is "₹25,000 in
    BOTH regimes … carries NO regime-gated field" — this contradicts the engine and J88. The renderer hint
    (line 454) and the `chkOs` note (lines 716–717) also say "₹25,000" unconditionally, which misleads an
    old-regime user (actual cap 15,000). Compute is fine; the narrative is stale.
- No other OS item closes under 115BAC (correct — OS is not in the closure list).

### Audit u/s
- None on this sheet.

### ITR-2 bleed / notes
- Content built from ITR-3's own OS sheet. Special-rate block (2a–2f) fully present. The only concern is the
  stale family-pension regime narrative and the §loss contract naming (below).

### Verdict: MINOR GAPS — engine correct throughout; the family-pension regime cap is mis-documented in the
header/hint (not in the math), and the OS→loss publication names drift (root cause of the MAJOR loss gaps).

---

## CYLA - BFLA + CFL  (section: loss)

### Missing fields/rows
- None absent. `70_sec_loss.js` builds all **14 live CYLA/BFLA head rows** (`LOSS_ROWS`, lines 24–38):
  sal, hp, bus, spec, specified, st20, st30, stApp, stDTAA, lt125, ltDTAA, os, horse, osDTAA — matching CYLA
  rows ii–xv / BFLA i–xiv. The **3 superseded CG rate rows** hidden in the sheet (STCG@15% r13H, LTCG@10% r18H,
  LTCG@20% r20H in CYLA; r39H/r44H/r46H in BFLA) are correctly **not built**.
- CFL: all **16 year-rows 2010-11…2025-26** + 4 summary rows built (`CFL_YEARS` lines 59–75), all **10 columns**
  incl. the 5a/5b/5c business split, speculative (6), specified (7), STCL (8), LTCL (9), race horses (10). The
  schema block names per year (`LossCFFromPrev9thYearFromAY` … `LossCFCurrentAssmntYear2026`) match the book exactly.
- The ITR-3-only rows the CEO worried about (speculative / specified-business / unabsorbed-depreciation /
  35(4)) are all present: CYLA/BFLA `spec`+`specified` rows, BFLA cols 3 (`BFUnabsorbedDeprSetoff`) and
  4 (`BFAllUs35Cl4Setoff`), CFL cols 6/7 and the 5b `AdjustAccTax115BACAmt`.

### Dropdowns
- CYLA edit flag [I28], BFLA edit flag [I55] → `EditAutopoulatedDetail` {Y,N}: both present (`loss.editC`/`editB`).
  CFL numeric cells carry no picklists. No missing values.

### Conditional cascades (show/hide) / set-off flows
- **[MAJOR] HP-loss current-year set-off omits business income.** `CY_ORDER_HP` (line 43) =
  `[sal,os,horse,osDTAA,spec,specified,st30,stApp,st20,stDTAA,lt125,ltDTAA]` — **"bus" is absent**. The walk
  (line 131) only visits array members, so `setHP.bus` stays 0. But the utility *does* set the current-year HP
  loss against business income: helper `[N10]=IF(R8<(busprof.Inc−...OS setoff),R8,(...))` feeds the input cell
  `G10`, and the schema Business row (`BusProfExclSpecProf.IncCYLA`) carries `HPlossCurYrSetoff`. The book states
  "whole House property loss can be setoff against any head of income". `LOSS_ROWS` even flags bus `cyHP:1`, so
  the flag is set but never used. Ours: **NO.** Impact: a taxpayer with a let-out HP loss + business income (a
  bread-and-butter ITR-3 case) gets the loss wrongly carried to CFL instead of set off — GTI overstated,
  carry-forward overstated. e.g. HP loss 150k (old), business 500k, nothing else → utility GTI 350k; ours GTI 500k
  with 150k wrongly carried forward.
- **[MAJOR] OS→loss contract name mismatch — three broken flows.** The loss engine reads `os.balanceNoRaceHorse`
  (line 99), `os.raceHorseBal` (line 100), `os.dtaa` (line 101); the OS engine publishes `S.C.os.netNormal`
  (os.js:326), `.raceHorse` (328), `.dtaaTotal` (330) — **none of the three read-names is ever written.**
  Consequences:
  1. `osNorm` falls back to `N(os.income)` (= item2 + item6 + max(0,item8e)), not item6/L97. CYLA row i OS loss
     `I6=ABS(MIN(os.BalanceNoRaceHorse,0))` and row xiii income `F22=MAX(0,os.BalanceNoRaceHorse)` are therefore
     wrong whenever special-rate OS income (2) or a race-horse balance is present — a normal-rate OS loss can be
     masked by special-rate income, and HP/business losses can be set off against OS-normal "income" that
     actually includes special-rate income.
  2. `osHorseBal` is always 0 → CYLA row xiv (race horse) income is always 0, and CFL `cur.horse` (line 190,
     `[U24]=ABS(MIN(0,os.BalanceOwnRaceHorse))`) is always 0. **A current-year race-horse loss is never carried to
     CFL 10xii** — directly contradicting the OS renderer's own note (os.js:486).
  3. `osDtaa` is always 0 → CYLA row xv (OS DTAA) income `F24=MAX(0,os.DTAA_Amt)` is always 0.
  Ours: **NO** for all three. (Correct fix: read `os.netNormal` / `os.raceHorse` / `os.dtaaTotal`.)
- **[order] HP-loss set-off order also diverges.** Utility order (from the R/N chain, sheet25): sal → **bus** →
  spec → specified → os → horse → CG(@30,app,…). Ours: sal → os → horse → osDTAA → spec → specified → CG. Even
  ignoring the missing bus, os/horse are placed ahead of spec/specified. Ours: **PARTIAL** — matters when income
  is insufficient to absorb the whole loss (allocation across heads differs).
- Business-loss order `CY_ORDER_BUS` (hp,os,horse,CG) and OS-loss order `CY_ORDER_OS` (horse,osDTAA,sal,hp,bus,
  spec,specified,CG) **match** the utility chains (S / T columns), incl. the book rule "normal OS loss set off
  first against race horses & OS-DTAA". Reproduced: **YES.**
- ₹2,00,000 s.71(3A) cap on HP set-off [G25≤200000] + `chkLoss` err: **YES** (`totHPset` line 136; check line 415).
- New-regime HP-loss closure [G26 `IF(bacValue=1,0,…)`]: **YES** (`hpCapped`/`hpRemain` New→0, lines 106–139;
  check line 418).
- BFLA: b/f loss only against same head (HP↔HP, spec↔spec, specified↔specified, horse↔horse), STCL against any
  CG slot, LTCL against LTCG only & first, nothing against salary or DTAA/OS-normal rows: `LOSS_ROWS` bf2/bfDep
  flags + `BF_ORDER_LT`/`BF_ORDER_ST` (lines 48–49, 159–166). Reproduced: **YES.**
- CFL carry windows: specified indefinite (all rows, `F_SPEC`), HP/business/STCL/LTCL 8-yr (2018-19+, `F_8YR`),
  speculative & race horses 4-yr (2022-23+, `F_FULL`), plus the oldest-year lapse [G25/L25/M25/…]: reproduced
  **YES** (lines 56–78, 193–199). Date-of-filing required on any carrying year + 5b-only-in-new-regime checks: **YES**.

### Regime open/close
- HP loss (set-off + carry-forward) nil under new regime: Excel new=closed, old=open (₹2L). Ours: `isNew()` at
  loss.js:102/106/139; check 418. **Match.**
- CFL 5b `AdjustAccTax115BACAmt` live only in new regime: Excel; ours renderer line 296 + check 421–422. **Match.**
- No other regime mismatch. (The family-pension regime handling lives in §os and is computed correctly there.)

### Audit u/s
- None on these sheets.

### ITR-2 bleed / notes
- Structurally this is ITR-3's own loss chain — business/speculative/specified/unabsorbed-dep rows are all
  present, unlike ITR-2. The two MAJOR defects are **wiring** faults (a dropped array member and a cross-section
  key-name drift), not ITR-2 content bleed: the CY_ORDER_BUS/CY_ORDER_OS arrays include their heads correctly,
  only CY_ORDER_HP dropped "bus"; and the OS publisher was renamed (netNormal/raceHorse/dtaaTotal) without
  updating the loss reader (balanceNoRaceHorse/raceHorseBal/dtaa).

### Verdict: MAJOR GAPS — coverage and the CFL ledger are complete and correct, but the current-year HP-loss
set-off skips business income entirely and the OS→loss contract is broken (race-horse loss never carried,
OS-DTAA income absent from CYLA, OS-normal loss mis-measured when special-rate income exists).

---

## GROUP SUMMARY

| Metric | Count | Notes |
|---|---|---|
| Missing fields/rows | 0 | full live-row coverage on all three sheets; hidden rows correctly excluded |
| Missing cascades / set-off flows | 4 | (loss) HP-loss vs business; race-horse loss→CFL 10xii; OS-DTAA income in CYLA; OS-normal-vs-special measurement; + HP-loss order divergence (PARTIAL) |
| Missing dropdown values | 0 | code covers every utility live option (2d/2e/2f/HP all complete); a few harmless extra schema codes |
| Regime mismatches | 0 | all `isNew()` gates match the utility (HP self-occ interest, HP-loss closure, family-pension 25k/15k, CFL 5b). One **documentation** defect: OS header/hint mis-states the family-pension cap as 25k in both regimes (engine is correct). |
| Audit gaps | 0 | no audit u/s trigger belongs on hp/os/loss (they live in Part A / BP) |

### The 3 most serious items
1. **§loss — `CY_ORDER_HP` omits "bus" (line 43).** The current-year house-property loss is never set off against
   business income, though the utility (`[N10]`/`G10`), the schema (`BusProfExclSpecProf.HPlossCurYrSetoff`) and the
   book all provide it. Common-case wrong GTI and wrong carry-forward.
2. **§loss ↔ §os — broken cross-section contract.** Loss reads `os.balanceNoRaceHorse`/`os.raceHorseBal`/`os.dtaa`;
   OS writes `os.netNormal`/`os.raceHorse`/`os.dtaaTotal`. Result: race-horse loss never reaches CFL 10xii,
   OS-DTAA income never appears in CYLA row xv, and the OS-normal loss is mis-measured (uses os.income incl.
   special-rate + race-horse) whenever special-rate OS income is present.
3. **§loss — HP-loss CYLA set-off order diverges** from the utility (sal→bus→spec→specified→os→horse→CG vs
   ours sal→os→horse→osDTAA→spec→specified→CG); affects per-head allocation when income is insufficient to absorb
   the loss. (§os family-pension header/hint mis-documentation is the notable non-loss item; the engine math is right.)
