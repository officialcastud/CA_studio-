# ITR-5 verification — AREA: caps_and_limits

**Scope.** Every statutory cap / limit / threshold the ITR-5 builder is supposed to enforce, exercised by
crafting returns that deliberately **try to over-claim** each one, and checking to the rupee that the form
either caps the figure or fires the rule.

**Method.** `forms/ITR-5/Yukti_ITR5.html` driven in Chromium (Playwright). The lawful reference client
`tests/ITR-5/state.js` (resident partnership firm, OLD regime) is loaded first, then a per-case patch is
injected and `paint()` run; `S.C` (gti / ti / tax / int / ded / si / loss / cg / amtOut), `S.C.checks` and
`runRules(Object.values(buildReturn().ITR)[0], S)` are read back. Every expected figure below was hand-computed
from `books/ITR-5/*.md` (80G.md, 80P.md, 10AA.md, 80GGC.md, VI_A.md, CYLA_BFLA.md, CFL.md, CG.md, SI.md,
PARTB_TI_TTI.md, **Tax_N.md**) and the Act, then compared to the engine.

- Driver: `tests/ITR-5/verify/caps_drive.py`
- 69 scenario states (68 over-claim/boundary cases + 1 lawful control): `tests/ITR-5/verify/caps_and_limits_cases.json`
- Control run: the lawful reference client produces **0 Category-A rule hits** and 0 page errors, so every
  Category-A hit reported below is attributable to the case.

**Result: 4 distinct defects (FAIL-1 … FAIL-4), reproduced in 9 of the 69 states. Every other cap, limit and
threshold in the brief came out correct to the rupee — 60 PASS rows below, 0 unexplained differences.**
(Three states additionally trip Category-A rules that are pure patch side-effects, not defects — listed at the end.)

---

# FAILURES (all listed here first)

## FAIL-1 — Part B-TI item 3 reads the **pre-set-off** capital-gain totals (HIGH)
`forms/ITR-5/src/70_sec_tax.js:138-140`, fed by `forms/ITR-5/src/70_sec_cg.js:378`

```js
/* 70_sec_tax.js */
const totST=CG.shortTerm!=null?Math.max(0,R(CG.shortTerm)):st20+st30+stApp+stDTAA;   /* 3av (J18) */
const totLT=CG.longTerm !=null?Math.max(0,R(CG.longTerm )):lt125+ltDTAA;             /* 3biii (J24) */
/* 70_sec_cg.js */
shortTerm:A.total, longTerm:B.total,                 /* = Part A total A10 / Part B total B12, BEFORE Table E */
```

`books/ITR-5/PARTB_TI_TTI.md` lines 35-43 is explicit: 3a(i)…3a(iv) and 3b(i)/3b(ii) are the
**"8ii…8vii of item E of Schedule CG"** leaves, i.e. *after* the intra-head set-off, and
`J18 = SUM(J14:J17)`, `J24 = SUM(J21:J23)`. The engine instead takes `S.C.cg.shortTerm/.longTerm`, which are
the **pre-set-off** Part A / Part B totals. The (correct) fallback expression is never reached because those
fields are always non-null.

**Bite condition:** a current-year **short-term capital loss absorbing long-term capital gain** (the one
direction the Act allows and the E-table performs). The LTCG that Table E has already consumed is still
reported at 3b(iii).

### Repro A — `cg_defect_min` (minimal, stripped state)
State: firm, old regime; only BP `pbt = 10,00,000` and two land transfers —
`{buy 12/05/2024, sale 20/11/2025, Short, cons 10,00,000, cost 20,00,000}` (STCL 10,00,000, slot `stApp`) and
`{buy 12/05/2018, sale 20/11/2025, Long, cons 16,00,000, cost 10,00,000}` (LTCG 6,00,000, slot `lt125`).

| figure | expected (book) | actual | |
|---|---|---|---|
| Schedule CG Table E `after.stApp` / `after.lt125` | 0 / 0 | 0 / 0 | ok |
| Part B-TI 3b(i) `LongTerm12_5Per` | 0 | 0 | ok |
| Part B-TI **3b(iii) `TotalLongTerm`** | **0** | **6,00,000** | **FAIL** |
| Part B-TI 3c / 3e | 0 / 0 | 6,00,000 / 6,00,000 | FAIL |
| Gross total income | 9,80,000 | **15,80,000** | FAIL (+6,00,000) |
| Total income | 9,80,000 | 15,80,000 | FAIL |

Category-A rule **A783** fires on the form's own export: *"Part B-TI: 3b Total long-term capital gains must
equal 3b(i) + 3b(ii)"* — the return the builder produces cannot pass CBDT validation.

### Repro B — `cg_st_vs_lt` (full reference client, one land row replaced by an STCL of 20,00,000)
GTI expected **34,92,000**, actual **39,92,000**; TI expected **30,47,000**, actual **35,47,000**
(over-statement ₹5,00,000 = the LTCG absorbed). Excess tax for a firm = 5,00,000 × 30% × 1.04 = **₹1,56,000**.
A783 fires here too.

**Not affected** (verified): LTCL vs STCG (`cg_lt_vs_st` — LT loss correctly confined to LT slots, 3a(v)
stays 9,00,000, no rule fires); loss and gain inside the same group (nets inside A.total/B.total).

---

## FAIL-2 — Schedule 10AA total is filled with the **capped** figure (MEDIUM)
`forms/ITR-5/src/70_sec_ded.js:542` — `TotalDedUs10Sub : n0(V.ded10AA)`

`books/ITR-5/10AA.md` §"The rules the sheet computes": `[J11] = IF(bacValue=1, 0, SUM(AA10.DedFromUndertaking))`
— the Schedule-10AA total is the **plain sum of the undertaking rows** (zeroed only in the new regime); the
GTI cap lives at Part B-TI item 12 (rule **A804**: Part B-TI 12 ≤ `TotalDedUs10Sub`). The builder writes the
already-capped Part B-TI figure into the schedule's own total, so the schedule contradicts its own rows.

| case | Σ `DedUs10Sub` rows | expected `TotalDedUs10Sub` | actual | Part B-TI 12 |
|---|---|---|---|---|
| `d10AA_over` (10AA claim ₹1,00,00,000) | 1,00,00,000 | 1,00,00,000 | **34,97,000** | 34,97,000 (correctly capped at gtiNet−VI-A) |
| `partC_10AA_over` | 1,00,00,000 | 1,00,00,000 | **13,67,000** | 13,67,000 (correct) |
| `g80_A_overTI` (VI-A eats all of GTI−SI) | 2,00,000 | 2,00,000 | **0** | 0 (correct) |

Category-A rule **A580** fires in all three: *"Schedule 10AA: the total deduction under section 10AA must
equal the sum of the amounts at all rows."* The **cap itself is right** (Part B-TI 12 is exactly
`min(Σrows, GTI − special-rate − ChVI-A)`); only the cell it is written into is wrong.

---

## FAIL-3 — Schedule 80GGC "Total eligible" is filled with the VI-A-gated figure (MEDIUM)
`forms/ITR-5/src/70_sec_ded.js:497` — `TotalEligibleDonationAmt80GGC : n0(O.c80ggc)`

`books/ITR-5/80GGC.md`: `[I14] = IF(bacValue=1, 0, SUM(EligibleAmountofDonation_80GGC))`; the status
exclusion for Local Authority / AJP belongs to the **VI-A side** (book line 102, rules n.870/910/970), not to
`I14`. The builder pushes `O.c80ggc` (0 for LA/AJP) into `I14` while each row's `EligibleDonationAmt` stays at
the other-mode amount.

| case | Σ column vi | expected `I14` | actual | |
|---|---|---|---|---|
| `ggc_la` (status 2 Local Authority, contribution ₹25,000 other mode) | 25,000 | 25,000 | **0** | **A587 fires** |
| `ggc_ajp` (status 9 AJP, same) | 25,000 | 25,000 | **0** | **A587 fires** |

Category-A **A587**: *"Schedule 80GGC, Sl. No. D 'Total Eligible Amount of Contribution' is not equal to total
of column vi."* Again the **cap/gate is correct** (VI-A `Section80GGC = 0` for LA/AJP — PASS), only the cell.

**Same pattern, silent:** `70_sec_ded.js:476` writes `TotalEligibleDonationAmt80GGA = O.c80gga` (0 whenever
there is business income). `ggc`-style rule 587 has no 80GGA twin in the rule set, so nothing fires, but the
schedule is internally inconsistent (rows 3,00,000 vs total 0 in case `gga_bizinc`).

---

## FAIL-4 — §234C ladder target uses ROUND where the book uses FLOOR-to-100 (LOW, ≤ ₹3/quarter)
`forms/ITR-5/src/70_sec_tax.js:300` — `const need = R(assessed234c*pc)`

`books/ITR-5/Tax_N.md` line 165: `AU113 = FLOOR(0.15*AT113,100)`, `AU114 = FLOOR(0.45,…)`,
`AU115 = FLOOR(0.75,…)`, `AU116/AU117 = FLOOR(1,…)`; shortfall
`AX113 = IF(AW113>=AV113, 0, MAX(0, FLOOR(MAX(0, AU113−AW113), 100)))`. The builder rounds the target instead
of flooring it to ₹100, then floors the difference — the two agree except when
`ROUND(pc·AT) − FLOOR(pc·AT,100)` pushes the gap across a ₹100 boundary.

### Repro — `c234c_floor`
Reference client; challans `14/06/2025 ₹2,00,000 · 12/09/2025 ₹2,00,000 · 13/12/2025 ₹3,47,651 · 14/03/2026 ₹3,00,000`.
`assessed234c = net 10,80,014 − TDS 75,000 − TCS 8,000 = 9,97,014`.

| Q3 (15 Dec) | book | actual |
|---|---|---|
| target | `FLOOR(0.75×9,97,014, 100)` = **7,47,700** | `ROUND(…)` = 7,47,761 |
| cumulative paid | 7,47,651 | 7,47,651 |
| shortfall | `FLOOR(7,47,700−7,47,651,100)` = **0** | **100** |
| interest | **₹0** | **₹3** |

Total `i234c` expected **₹0**, actual **₹3**. Bounded: the target can exceed the book's by <₹100, so the
over-charge is ≤ ₹100 principal → ≤ ₹3 per quarter (₹1 in Q4), ≤ ₹10 on a return. The Q1/Q2 12%/36%
safe-harbour floors are computed correctly (`FLOOR(0.12·AT,100)`), so this only bites Q3/Q4.

---

# PASS — detail by cap
(expected figures hand-computed; "actual" is `S.C`)

## (a) Chapter VI-A · s.10AA

Reference-client constants used below: Schedule-80G `Total_Income` `[T5]` = BFLA col-5 total = **41,62,000**;
`gtiNet` (GTI − special-rate) = **37,42,000**; business pool after BFLA = **22,50,000**.

| # | case | cap / basis | expected | actual | |
|---|---|---|---|---|---|
| 1 | `base` (control) | lawful firm | 0 Category-A hits; GTI 44,12,000; TI 39,67,000 | same | PASS |
| 2 | `g80_QL` | 80G qualifying limit `[X3]=10%·max(0,TI−80GGA−80GGC−ΣK10:K20)`; C consumes it first, D gets `[AA3]=max(0,(QL−C)/2)` | QL = 10%×(41,62,000−1,25,000) = **4,03,700**; C(₹2L) = 2,00,000; CDE = (4,03,700−2,00,000)/2 = 1,01,850; D(₹10L) = min(1,01,850, 5,00,000) = **1,01,850**; 80G = **3,01,850** | QL 4,03,700 · C 2,00,000 · D 1,01,850 · 80G 3,01,850 | PASS |
| 3 | `g80_AB` | buckets A/B carry **no** qualifying limit | A ₹5L → 5,00,000 (100%); B ₹5L → 2,50,000 (50%); 80G = **7,50,000** (> QL 4,03,700, correctly not capped) | 5,00,000 / 2,50,000 / 7,50,000 | PASS |
| 4 | `g80_cash` | s.80G(5D) ₹2,000 cash cap `[O7…] IF(L>2000,0,L)` | A cash ₹1,00,000 → eligible **0**; B cash ₹2,000 (= limit, allowed) → 50% = **1,000** | 0 / 1,000 | PASS |
| 5 | `g80_cash2001` | boundary ₹2,001 | whole cash disallowed → 80G = **0** | 0 | PASS |
| 6 | `g80_A_overTI` | `[O7]` per-row `min(base,TI)`, `[O52]` `min(TI,Σ)`; then VI-A `[K8]/[K22]` ≤ GTI − special-rate | Aelig = **41,62,000** (= TI); Part B = min(41,87,000, 37,42,000) = **37,42,000**; ChVI-A allowed = **37,42,000**; s.10AA = 0; TI = 44,12,000 − 37,42,000 − 0 = **6,70,000** = the special-rate income | identical | PASS |
| 7 | `g80_new` | rule 610 / `[O52]` new-regime gate | 80G = 0, all VI-A = 0 except 80JJAA / 80LA(1A); s.10AA = 0 | all 0 | PASS |
| 8 | `ggc_cash` | 80GGC cash never eligible `[I8]` | contribution ₹50,000 in cash → **0** | 0 | PASS |
| 9 | `ggc_la` | 80GGC barred for Local Authority (80GGC.md P7 / n.910) | VI-A `Section80GGC` = **0** | 0 | PASS (but see FAIL-3) |
| 10 | `ggc_ajp` | 80GGC barred for AJP | 0 | 0 | PASS (but see FAIL-3) |
| 11 | `gga_bizinc` | s.80GGA(1) proviso — no 80GGA where there is business income `[K6]` | ₹3,00,000 claimed → **0** | 0 | PASS |
| 12 | `gga_nobiz` | same, with no business income | **3,00,000** allowed | 3,00,000 | PASS |
| 13 | `p80_caps` | 80P row caps (80P.md): 2(c)(i) ≤ ₹1,00,000, 2(c)(ii) ≤ ₹50,000, every row ≤ its own income | r13 ₹5,00,000 → **1,00,000**; r14 ₹5,00,000 → **50,000**; r5 amt ₹5,00,000 vs income ₹1,00,000 → **1,00,000**; total **2,50,000** | 1,00,000 / 50,000 / 1,00,000 / 2,50,000 | PASS |
| 14 | `p80_by_firm` | 80P is a co-operative-society deduction | Category-A rule must fire | **fires**: *"Schedule VI-A: 80P can be claimed only by a co-operative society…"* | PASS |
| 15 | `partC_over` | 80-IA over-claim; `[K21]` Part C ≤ business income after BFLA | 80-IA ₹50,00,000 → line K10 = 50,00,000, **Part C = 22,50,000** | 50,00,000 / 22,50,000 | PASS |
| 16 | `ia_u2_only` | 80.md `[C3]` — undertaking-2 ignored unless undertaking-1 is filled | `["", "5,00,000"]` → **0** | 0 | PASS |
| 17 | `ia_both` | both undertakings | `["3,00,000","2,00,000"]` → **5,00,000** | 5,00,000 | PASS |
| 18 | `jja_over` | `[K14]/[K16]` ≤ GTI, `[K17]` 80JJAA ≤ GTI − special-rate | each claimed ₹90,00,000 → 80-IBA **41,62,000**, 80JJA **41,62,000**, 80JJAA **37,42,000**; Part C total **22,50,000** | identical | PASS |
| 19 | `d10AA_over` | s.10AA ≤ GTI − special-rate − ChVI-A (Part B-TI L43) | claim ₹1,00,00,000 → Part B-TI 12 = 37,42,000 − 2,45,000 = **34,97,000**; TI = 44,12,000 − 2,45,000 − 34,97,000 = **6,70,000** | 34,97,000 / 6,70,000 | PASS (schedule total: FAIL-2) |
| 20 | `partC_10AA_over` | both Part C and 10AA over-claimed | Part C **22,50,000**, ChVI-A **23,75,000**, 10AA **13,67,000**, **TI = 6,70,000 = special-rate income** (deductions can never push TI below it) | identical | PASS |
| 21 | 80M | **N/A to ITR-5** — `books/ITR-5/VI_A.md:62` "there is **no 80M row** … that line lives in ITR-6"; confirmed absent from `DED_VIA` | no 80M row | absent | PASS (by design) |
| 22 | 80GGB | **N/A to ITR-5** — s.80GGB applies only to an Indian company; ITR-5 exposes 80GGC only | no 80GGB row | absent | PASS (by design) |

## (b) Income side

| # | case | cap / basis | expected | actual | |
|---|---|---|---|---|---|
| 23 | `hp_cap` | s.71(3A) — HP loss set off against other heads ≤ ₹2,00,000 (`CYLA G25`) | 24(b) interest ₹30,00,000 → HP income −26,08,000; set-off pool **2,00,000**, excess **24,08,000** straight to CFL; Part B-TI 1 = 0; item 6 (CYLA) = **2,00,000**; CFL xix HP = **24,08,000** | hpCapped 2,00,000 · totHPset 2,00,000 · hpExcess/hpRemain 24,08,000 · cyla 2,00,000 · cur.hp 24,08,000 | PASS |
| 24 | `hp_cap_override` | same, with the CYLA "edit auto-populated" override asking for ₹5,00,000 | `TotHPlossCurYrSetoff` still **2,00,000**; Part B-TI 6 still **2,00,000**; TI unchanged at 35,75,000 | identical (cap holds) | PASS — see Observation O2 |
| 25 | `t112a_small` | s.112A ₹1,25,000 exemption `[O17]` | 112A gain 1,00,000 → exemption **1,00,000** (limited to the gain), taxable 0, tax **0** | 1,00,000 / 0 / 0 | PASS |
| 26 | `t112a_exact` | boundary | gain 1,25,000 → exemption 1,25,000, tax **0** | same | PASS |
| 27 | `t112a_big` | over the limit | gain 20,00,000 → taxable **18,75,000** @12.5% = **2,34,375**; exemption exactly **1,25,000** | same | PASS |
| 28 | `base` | post-BFLA scaling of the 112A bucket | gain 5,00,000, BF LTCL 80,000 → 112A income **4,20,000**, taxable 2,95,000, tax **36,875** | same | PASS |
| 29 | `si_pool_full` | `[O17]`→`[O18]` — 112A and PTI-112A **share one** ₹1.25L pool | 2A 4,20,000 takes the whole 1,25,000; PTI-112A 2,00,000 taxable **2,00,000** (tax 25,000) | same; `exemption112A` 1,25,000 | PASS |
| 30 | `si_pool_share` | same, pool split | 2A 1,00,000 → exempt 1,00,000; PTI-112A 2,00,000 → exempt **25,000**, taxable **1,75,000** (tax 21,875) | same | PASS |
| 31 | `si_pool_115ad` | `[O19]` — s.115AD(1)(iii) proviso has its **own** ₹1.25L pool | 2A exempt 1,00,000 (pool A) + 5ADiiiP exempt 1,25,000 (pool B) → total exemption **2,25,000**; 5ADiiiP taxable 1,75,000 | same | PASS |
| 32 | `horse_loss` | s.74A — race-horse loss ring-fenced | receipts 1,00,000, s.57 deductions 4,00,000 → 8e = −3,00,000; Part B-TI 4c = **0**; CFL xix horse = **3,00,000**; **no other head touched** (afterC identical to control) | identical | PASS |
| 33 | `horse_bf_noinc` | BF race-horse loss only against race-horse income | BF 2,00,000, no horse income → set off **0**, carried forward **2,00,000**; business/OS/CG untouched | same | PASS |
| 34 | `horse_bf_inc` | with horse income 5,00,000 | set off **2,00,000**, BFLA col-5 horse **3,00,000**, c/f **0** | same | PASS |
| 35 | `spec_loss` | s.73 — speculative loss ring-fenced | A2a = −5,00,000 → B42 = −5,00,000; CFL xix spec = **5,00,000**; non-speculative business income rises to 31,10,000 (loss removed from PBT); Part B-TI 2ii = **0**; **not** set off against any other head | identical | PASS |
| 36 | `specified_loss` | s.73A — 35AD specified-business loss ring-fenced | A2b = −5,00,000 → C48 = −5,00,000; CFL xix specified = **5,00,000**; Part B-TI 2iii = 0; no cross-head relief | identical | PASS |
| 37 | `spec_bf_vs_inc` | BF speculative loss → speculative income only | BF 4,00,000 vs speculative income 6,00,000 → set off **4,00,000**, BFLA col-5 spec **2,00,000** | same | PASS |
| 38 | `cg_st_vs_lt` | Table E: an STCL sets off **any** capital gain | STCL 20,00,000 absorbs LTCG 5,00,000 → `after.lt125` **0**, CFL STCL **15,00,000** | same | PASS (Table E) / **FAIL-1** (Part B-TI 3) |
| 39 | `cg_lt_vs_st` | an LTCL sets off **long-term only** | LTCL 15,00,000 with STCG 9,00,000 → `after.stApp` stays **9,00,000**, `after.lt125` 0, CFL LTCL **15,00,000** | same | PASS |
| 40 | `cfl_tier` | CFL carry windows by tier (CFL.md) | AY 2017-18 row (tier 1) may carry **only** specified-business loss → `bf = {specified: 3,00,000}`, its HP/business/speculative/STCL/LTCL of ₹5,00,000 each **ignored**; AY 2021-22 row (8-yr tier) → its speculative and race-horse ₹4,00,000 **ignored** | exactly that | PASS |
| 41 | `cfl_lapse8` | 8-year window — the oldest row lapses (`[G30]`) | BF HP 1,00,000 (2018-19) + 1,00,000 (2019-20), HP income 1,92,000 → set off 1,92,000, c/f = 2,00,000 − max(1,92,000, oldest 1,00,000) = **8,000** | 8,000 | PASS |
| 42 | `cfl_lapse4` | 4-year speculative window | BF spec 1,00,000 (2022-23, oldest) + 1,00,000 (2023-24), no speculative income → c/f **1,00,000**, **lapsed 1,00,000** | 1,00,000 / 1,00,000 | PASS |
| 43 | `cfl_specified` (in `cfl_tier`) | s.73A losses never lapse (`[N30]`) | specified 3,00,000 carried forward in full | 3,00,000 | PASS |

## (c) Tax side

| # | case | cap / basis | expected | actual | |
|---|---|---|---|---|---|
| 44 | `sur_firm_at` | firm surcharge only **above** ₹1 cr | TI = 1,00,00,000 → rate **0%**, surcharge **0**; tax 29,10,875; cess 1,16,435; gross **30,27,310** | identical | PASS |
| 45 | `sur_firm_over` | 12% + marginal relief at ₹1 cr | TI = 1,00,00,100 → tax 29,10,905; sur before relief (28,74,030×12% + 36,875×12%) = **3,49,309**; MR = (29,10,905+3,49,309) − 29,10,875 − 100 = **3,49,239**; surcharge **70**; cess **1,16,439**; gross **30,27,414**. Marginal test: (tax+sur) rises by exactly ₹100 for ₹100 more income | identical to the rupee | PASS |
| 46 | `sur_firm_big` | 12%, no relief | TI = 1,20,00,000 → surcharge **4,21,305**, MR **0**, cess **1,57,287**, gross **40,89,467** | identical | PASS |
| 47 | `sur_aop_50L` | AOP/BOI ladder 10% at ₹50 L + MR | TI = 50,00,100 → tax 12,23,405; sur raw 1,22,341; MR **1,22,271**; surcharge **70**; cess **48,939**; gross **12,72,414**; Δ(tax+sur) = ₹100 | identical | PASS |
| 48 | `sur_aop_2cr_at` | 15% band exactly at ₹2 cr | TI = 2,00,00,000 → rate **15%**, surcharge **8,58,506**, MR **0**, gross **68,45,156** | identical | PASS |
| 49 | `sur_aop_2cr` | 25% band + MR at ₹2 cr | TI = 2,00,00,100 → sur raw 14,27,164; MR **5,68,588**; surcharge **8,58,576**; cess **2,63,279**; gross **68,45,260**; continuity Δ = ₹100 | identical | PASS |
| 50 | `sur_aop_5cr` | 37% band + MR at ₹5 cr | TI = 5,00,00,100 → sur raw 54,39,547; MR **17,62,321**; surcharge **36,77,226**; cess **7,36,025**; gross **1,91,36,656**; Δ = ₹100 | identical | PASS |
| 51 | `sur_coop_1cr_at` | co-op 7% band starts **above** ₹1 cr | TI = 1,00,00,000 → rate 0, surcharge 0, gross **30,24,190** | identical | PASS |
| 52 | `sur_coop_1cr` | co-op 7% + MR | TI = 1,00,00,100 → co-op slab 10/20/30 gives 27,96,030; tax 29,07,905; sur raw 2,03,553; MR **2,03,483**; surcharge **70**; cess **1,16,319**; gross **30,24,294** | identical | PASS |
| 53 | `sur_cap15` | **15% cap on 111A/112/112A** (`Tax_N.md` `L2 = MIN(0.15, Surcharge_Rate)`) | AOP, TI = 6,13,17,000, 112A tax 24,84,375, rate band 37% → surcharge = (1,46,91,975−24,84,375)×37% + 24,84,375×**15%** = 45,16,812 + 3,72,656 = **48,89,468** (uncapped would be 54,36,031 — the cap saves ₹5,46,563); cess **7,83,258**; gross **2,03,64,701** | identical | PASS |
| 54 | `aop_new_37cap` | s.115BAC(1A) caps the 37% band at 25% (`M4/M8`) | AOP new regime, TI = 6,17,82,000 → rate **25%** (not 37), cap rate 15; new-regime slab tax **1,79,13,600**; surcharge **45,02,681**; cess **9,01,126**; gross **2,34,29,282** | identical | PASS |
| 55 | `bbe` | s.115BBE 60% + flat 25% surcharge | s.68 credit ₹10,00,000 → 115BBE tax **6,00,000** (60%); surcharge 2e(i) = **1,50,000** (25%), independent of TI; graduated surcharge 0; cess **74,039**; gross **19,25,014** | identical | PASS |
| 56 | `bbe_big` | 115BBE carved **out of** the graduated base | AOP, TI 2,50,00,100, s.68 ₹50,00,000 → 115BBE tax **30,00,000**, 2e(i) **7,50,000**; graduated part = (87,23,405 − 30,00,000 − 36,875)×25% + 36,875×15% = **14,27,164**; total surcharge **21,77,164**; cess **4,36,023**; gross **1,13,36,592** | identical | PASS |
| 57 | `r87a_aop` | s.87A rebate is **individuals only** | AOP, TI 3,80,000 → old slab 5% of 1,30,000 = **6,500** + cess 260 = **6,760**; rebate **0** (an individual would pay nil) | 6,500 / 260 / 6,760 / rebate 0 | PASS |
| 58 | `r87a_firm` | same for a firm | TI 3,80,000 → 30% = **1,14,000** + cess 4,560 = **1,18,560**; rebate **0** | identical | PASS |
| 59 | `late_234A` | s.234A 1%/month on net less prepaid, principal floored to ₹100 | filed 15/01/2027 vs due 31/10/2026 → 3 months; principal = 10,80,014 − 9,50,000 − 75,000 − 8,000 = 47,014 → **47,000**; interest **₹1,410**; s.234F fee **₹5,000** (TI > ₹5 L) | identical | PASS |
| 60 | `gate_small` | 234A on a small liability + ₹1,000 fee band | net ₹9,360 → principal 9,300, 3 months → **₹279**; 234F **₹1,000** (TI ≤ ₹5 L); 234B and 234C **nil** (net < ₹10,000 gate) | identical | PASS |
| 61 | `b234b_edge_ok` | **s.234B 90% test**, upper side | assessed tax = 9,97,014; 90% = 8,97,312.60; advance tax **8,97,313** → 234B **₹0** | 0 | PASS |
| 62 | `b234b_edge_fail` | 90% test, ₹1 below | advance tax **8,97,312** → principal = 10,80,014 − 8,97,312 − 83,000 = 99,702 → **99,700**; 7 months → **₹6,979** | identical | PASS |
| 63 | `b234b` | 234B with a large shortfall | advance 3,90,000 → principal **6,07,000**, 7 months → **₹42,490**; 234C Q3 3,57,700→10,731, Q4 6,07,000→6,070, total **₹16,801**; §288B balance **₹6,66,310** | identical | PASS |
| 64 | `c234c_sh_ok` | **s.234C Q1 12% safe harbour** | `FLOOR(0.12×9,97,014,100)` = **1,19,600**; paid by 15 Jun = 1,19,600 → Q1 **₹0**; Q3 1,08,100→3,243; Q4 57,400→574; total **₹3,817** | identical | PASS |
| 65 | `c234c_sh_fail` | ₹100 below the safe harbour | paid 1,19,500 → Q1 shortfall `FLOOR(1,49,552−1,19,500,100)` = 30,000 → **₹900**; total **₹4,721** | identical | PASS |
| 66 | `c234c_q2_ok` | **Q2 36% safe harbour** | `FLOOR(0.36×9,97,014,100)` = **3,58,900**; cumulative 3,58,900 → Q2 **₹0**; total **₹4,645** | identical | PASS |
| 67 | `c234c_q2_fail` | ₹100 below | cumulative 3,58,800 → Q2 shortfall 89,800 → **₹2,694**; total **₹7,343** | identical | PASS |
| 68 | `r288b_down` | **s.288B** nearest-₹10 on the refund | aggregate 10,82,945, paid 11,83,007 → raw refund 1,00,062 → **1,00,060** | 1,00,060 | PASS |
| 69 | `r288b_half` | §288B half-way case (part of ten ≥ ₹5 rounds up) | raw refund 1,00,065 → **1,00,070**; and `late_234A` balance 56,825 → **56,830** | 1,00,070 / 56,830 | PASS |

### §234C base — re-verified independently after the fix

The defect just fixed was the 234C base double-subtracting s.90/91 relief and the s.115JD credit.
`books/ITR-5/Tax_N.md:165` gives the base as
`AT113:AT117 = MAX(tax + surcharge + cess − TDS − TCS − 115JD credit − relief, 0)`, and the AMT path
(`AC5 = IF(Higher_MATC, MAX(TotalTax_DI − TDS − TCS − 115JD − relief, 0), 0)`). Part B-TTI item 7 (`net`)
already equals `MAX(normal, AMT) − 115JD credit − relief`, so the base **must** be `net − TDS − TCS`, which is
exactly what `70_sec_tax.js:297` now computes, and exactly the same expression `70_sec_tax.js:310` uses for
234B's `assessedB`.

Two scenarios hand-checked end-to-end, both with **non-zero relief and non-zero 115JD credit**:

**S1 — `c234c_relief_short`** (s.90 relief ₹2,00,000; §115JD credit pool ₹4,00,000; advance tax ₹3,90,000)

| step | hand | engine |
|---|---|---|
| gross tax liability (2g) | 11,45,014 | 11,45,014 |
| §115JD credit set off | 3,24,043 | 3,24,043 |
| s.90 relief | 2,00,000 | 2,00,000 |
| item 7 `net` | 11,45,014 − 3,24,043 − 2,00,000 = **6,20,971** | 6,20,971 |
| **234C base** = net − TDS 75,000 − TCS 8,000 | **5,37,971** | **5,37,971** |
| **234B base** `assessedB` | **5,37,971** | **5,37,971** → **identical, consistent** |
| Q1 15% = 80,696 vs paid 1,30,000 (12% floor 64,500) | 0 | 0 |
| Q2 45% = 2,42,087 vs paid 3,90,000 (36% floor 1,93,600) | 0 | 0 |
| Q3 75% = 4,03,478 vs 3,90,000 → `FLOOR(13,478,100)` = 13,400 × 1% × 3 | **₹402** | ₹402 |
| Q4 100% = 5,37,971 vs 3,90,000 → 1,47,900 × 1% × 1 | **₹1,479** | ₹1,479 |
| **i234C** | **₹1,881** | **₹1,881** |
| 234B: 90% of 5,37,971 = 4,84,175 > advance 3,90,000 → principal `FLOOR(6,20,971−3,90,000−83,000,100)` = 1,47,900 × 1% × 7 | **₹10,353** | ₹10,353 |
| aggregate / §288B balance | 6,33,205 / **1,60,210** | 6,33,205 / 1,60,210 |

Under the old (buggy) base the 234C base would have been 5,37,971 − 2,00,000 − 3,24,043 = 13,928 and
`i234C` would have been **₹0** instead of ₹1,881 — the fix is confirmed to bite in the right direction.

**S2 — `partC_10AA_over`** (the **AMT path**: AMT 8,24,819 > normal 1,16,350; relief ₹15,000; credit correctly 0)

| step | hand (book `AC5`) | engine |
|---|---|---|
| `TotalTax_DI` (AMT total) | 8,24,819 | 8,24,819 |
| item 7 `net` = 8,24,819 − 0 − 15,000 | **8,09,819** | 8,09,819 |
| 234C base = net − 75,000 − 8,000 | **7,26,819** | **7,26,819** |
| 234B `assessedB` | **7,26,819** | **7,26,819** → identical |
| all four instalment targets vs cumulative advance tax 1,30,000 / 3,90,000 / 6,50,000 / 9,50,000 | 1,09,023 / 3,27,069 / 5,45,114 / 7,26,819 → all met | same, `i234C` ₹0 |

**Conclusion:** §234C and §234B now use one and the same base — `net − TDS − TCS` — on both the normal and
the AMT path, with s.90/91 relief and the s.115JD credit netted exactly once (inside `net`). Verified to the
rupee in 20 interest scenarios. The only residual 234C divergence is FAIL-4 (ROUND vs FLOOR-to-100 target).

---

# Observations (not scored as failures)

- **O1 — §234C fifth instalment slot is permanently nil.** `70_sec_tax.js:304`
  `q5base = amtCase ? 0 : max(0, assessed234c − Math.floor(assessed234c*1))` is the fractional part of an
  integer, i.e. always 0. `Tax_N.md:165` gives `AU117 = FLOOR(1*AT,100)` against `AW117 = IT.Qtr5` only.
  Taken literally the book row would double-charge the Q4 amount, so the builder's choice never
  **over**-charges; but the 16–31 March slot is not modelled and there is no input for income arising then.
- **O2 — Schedule CYLA manual override.** With `S.loss.editC = "Yes"`, the per-head column-2 set-offs may be
  keyed above ₹2,00,000 (`hp_cap_override`: columns sum to ₹5,00,000). `TotHPlossCurYrSetoff` and Part B-TI
  item 6 are still clamped to ₹2,00,000 and **Total Income is unchanged**, and rule 508's own text
  (*"…should be equal to Sum of losses set off in column 2 to the maximum of Rs.200000"*) tolerates it — so
  the statutory cap holds. The side effect is that Schedule CYLA/BFLA col-1 and the Chapter VI-A cap base
  (`S.C.ded.gti`) drop by the excess (37,70,000 → 34,70,000 here), which is conservative but presentationally
  wrong.
- **O3 — 80G qualifying-limit base.** The form uses `Total_Income` = the BFLA col-5 total (41,62,000), which
  **includes** special-rate capital gains. That is what `80G.md` `[T5]` prescribes for the utility, so this is
  replica-faithful; it diverges from the Act's "adjusted gross total income" (s.80G(5)(vi) r/w Explanation 5),
  which excludes LTCG and s.111A STCG. Flagged as a book-vs-Act divergence, not a builder defect.
- **O4 — 15% surcharge cap scope.** The cap is applied only to the Schedule-SI buckets (`SI_CGDIV`), matching
  `Tax_N.md` `L2`. Resident dividend taxed at normal/slab rates therefore attracts the full 25%/37% for an
  AOP/BOI, whereas the Finance Act proviso caps surcharge on *dividend income* at 15%. Utility-faithful;
  worth a note.
- **O5 — 80GGC per-row eligible amount.** `80GGC.md` `[I8] = MIN(other-mode, Sheet8b.GrossTotalIncome)`; the
  builder writes `EligibleDonationAmt = other-mode` with no GTI cap (`70_sec_ded.js:494`). Only bites when a
  single contribution exceeds GTI.
- **O6 — 80P row caps are status-agnostic.** `engDed80P` applies the ₹1,00,000 / ₹50,000 caps and the
  "≤ income" rule for any assessee; the co-operative-society restriction is enforced by the Category-A rule
  rather than by zeroing the line (`p80_by_firm` — rule fires). Acceptable, matching the utility's
  rule-driven model.
- **Test artefacts, not defects.** Cases that rewrite `S.bp.pbt` trip *"Schedule BP: Sl.No.A1 must equal the
  sum of Sl.No. 54, 62ii…"* (P&L not re-keyed); cases that rewrite `S.pi.status` trip *"Part A-P&L:
  salary/remuneration to partners can be claimed only by a Firm"* and (for co-op sub-statuses) the
  115BAD/115BAE question; `p80_caps` trips the 80P business-code ↔ Schedule-NOB cross-check because the
  co-op activity codes were not added to `S.nob`. All three are consequences of the patch, not of the cap
  logic under test.

---

# Files implicated

| finding | file : line |
|---|---|
| FAIL-1 | `forms/ITR-5/src/70_sec_tax.js:138-140` (reads `CG.shortTerm`/`CG.longTerm`); `forms/ITR-5/src/70_sec_cg.js:378` (publishes the pre-set-off `A.total`/`B.total`). Rule A783 — `forms/ITR-5/src/61_rules_enc_19.js:38` |
| FAIL-2 | `forms/ITR-5/src/70_sec_ded.js:542`. Rule A580 — `forms/ITR-5/src/61_rules_enc_13.js:56` |
| FAIL-3 | `forms/ITR-5/src/70_sec_ded.js:497` (and the silent twin at `:476`). Rule A587 — `forms/ITR-5/src/61_rules_enc_13.js:92` |
| FAIL-4 | `forms/ITR-5/src/70_sec_tax.js:300` |
| O1 | `forms/ITR-5/src/70_sec_tax.js:304` |
| O2 | `forms/ITR-5/src/70_sec_loss.js:167` (the clamp) + `:156-161` (the override branch that feeds it) |
| O5 | `forms/ITR-5/src/70_sec_ded.js:494` |

Reproduce any case with:
`python3 tests/ITR-5/verify/caps_drive.py tests/ITR-5/verify/caps_and_limits_cases.json out.json`
(run from the worktree root; each key is a JS patch applied on top of `tests/ITR-5/state.js`).
