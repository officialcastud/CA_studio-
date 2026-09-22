# ITR-5 verification — AREA: regimes_and_entities

Form under test: `forms/ITR-5/Yukti_ITR5.html` (worktree `/home/user/ca-itr5/yukti`, branch `claude/itr-5`).
Driver: Playwright, state injected then `paint()`; figures read from `S.C` / `buildReturn()`, rules from
`runRules(Object.values(buildReturn().ITR)[0], S)`.
Scenario states: `tests/ITR-5/verify/re_*.js` (53 states) plus the lawful reference `tests/ITR-5/state.js`.
Ground truth: `books/ITR-5/Tax_N.md` (the live engine), `books/ITR-5/Tax.md`, `books/ITR-5/AMT.md`,
`books/ITR-5/80P.md`, `books/ITR-5/VI_A.md`, `books/ITR-5/rules.json`, and the Income-tax Act limits they encode.

**Verdict: 54 runs (53 scenario states in `tests/ITR-5/verify/re_*.js` + the reference return) —
44 PASS, 9 FAIL.**
The rate engine itself is excellent: every slab, flat rate, surcharge band, marginal-relief computation and
4%-cess figure below reconciles **to the rupee** with the Tax(N) method. All nine failures are *gating*
failures — the engine does not know that **§115BAD / §115BAE are concessional regimes**, it never reads the
**AOP/BOI member-case flags**, it lets a **firm** be put into §115BAC, it adds **80P back into AMT**, and the
**80P entity rule is too permissive**.

---

## FAILURES (worst first)

### FAIL-1 · §115BAD / §115BAE do not close ANY of the concessional-regime doors
**Scenario** `tests/ITR-5/verify/re_c5b_coop_115BAD_ded.js` — "3-Other Cooperative Society" (status 14),
`S.fs.newTaxRegime="Y"` (115BAD opted, `bad115AY:"2021-22"`), `S.fs.optout="Yes"`, `pbt = 50,00,000`,
80-IA 5,00,000, 80G 1,00,000, Schedule 80P 6,50,000, Schedule 10AA 2,00,000.

| item | expected (§115BAD(2) / rule A18 / A610 / A641 / §115JC(5)) | actual |
|---|---|---|
| Ch VI-A Part C (80-IA + 80P) | 0 | **11,50,000** |
| Ch VI-A Part B (80G) | 0 | **1,00,000** |
| §10AA | 0 | **2,00,000** |
| Total income | 50,00,000 | **35,50,000** |
| Tax @22% | 11,00,000 | 7,81,000 |
| Surcharge @10% | 1,10,000 | 78,100 |
| Cess 4% | 48,400 | 34,364 |
| **Gross tax liability** | **12,58,400** | **8,93,464** (short by **₹3,64,936**) |
| Schedule AMT sl.4 | 0 (§115JC(5) — AMT does not apply to a person who exercised 115BAD) | **7,35,000** (1d = 7,64,400, exported) |
| Rule A18 ("Part C except 80JJAA/80LA(1A) cannot be claimed when opting 115BAD/115BAE/115BAC(1A)") | FIRES | **silent** |
| Rule A610 (80G barred under 115BAC/115BAD/115BAE) | FIRES | **silent** |
| Rule A641 (Schedule 80P nil in the new regime) | FIRES | **silent** |

**Root cause.** The single regime predicate is `const isNew = () => S.fs.optout !== "Yes";`
(`shell/shell.js:49`, assembled at `forms/ITR-5/Yukti_ITR5.html:17365`). It reads only
`OptOldRegimeCurrAY`. §115BAD (`S.fs.newTaxRegime`) and §115BAE (`S.fs.baeYes`/`S.fs.baeNo`) are read
**only** by `taxStatus()` to pick the *rate* (`forms/ITR-5/src/70_sec_tax.js:60-61`) and by nothing else.
Every closure — `70_sec_ded.js:193` (`const conc=isNew()`), `70_sec_amt.js:84` (`const New=isNew()`),
`70_sec_bp.js:161/171/173/338` — therefore stays open.
The rule engine repeats the same mistake: `newR`/`isNewReg` is `OptOldRegimeCurrAY!=="Y"` at
`61_rules_enc_01.js:73`, `61_rules_enc_06.js:49`, `61_rules_enc_12.js:23`, `61_rules_enc_16.js:114`,
and `61_rules_enc_14.js:209` (A641) tests `OptOldRegimeCurrAY` directly.

### FAIL-2 · §115BAD does not bar additional depreciation (rule A277)
**Scenario** `re_c11_coop_115BAD_dep.js` vs baseline `re_c11b_coop_old_dep.js` — co-op, 115BAD opted,
DPM 15% block: WDV 20,00,000, additions >180d 10,00,000, `AddlnDeprOnGT180DayAdditions` 2,00,000.

| item | expected (§115BAD(2)(a)(i) bars §32(1)(iia); rule A277) | actual |
|---|---|---|
| Depreciation allowed | 4,50,000 | **6,50,000** (additional 2,00,000 allowed) |
| GTI / Total income | 55,50,000 | **53,50,000** |
| Tax 22% + 10% sur + 4% cess | 12,21,000 + 1,22,100 + 53,724 = **13,96,824** | **13,46,488** (short by **₹50,336**) |
| Rule A277 | FIRES | **silent** |

`70_sec_bp.js:171` — `const addlOK = opts.addl!==false && !isNew();`. The old-regime baseline
`re_c11b` is correct (additional depreciation allowed, 3b adjustment barred for a co-op — PASS).

### FAIL-3 · §115BAD does not bar depreciation @45% (rule A278)
**Scenario** `re_h2_coop_115BAD_r45.js` — co-op, 115BAD opted, `S.dpm.r45 = {WDVFirstDay:10,00,000}`.

| item | expected (rule A278: "Depreciation @45% cannot be claimed by assessee opting for 115BAD") | actual |
|---|---|---|
| Rate-45 depreciation | 0 | **4,50,000** |
| Total income | 60,00,000 | **55,50,000** |
| **Gross tax liability** | **15,10,080** | **13,96,824** (short by **₹1,13,256**) |
| Rule A278 | FIRES | **silent** |

`70_sec_bp.js:173` — `const blocked = opts.blocked && isNew();`. The check and the rule
(`61_rules_enc_06.js:224`) both gate on 115BAC, but rule A278 is worded for **115BAD**.
Control `re_h2b_coop_new_r45.js` (same co-op with `optout:"No"`) *does* block it — proving the gate works,
just off the wrong flag.

### FAIL-4 · Schedule AMT adds 80P back into the adjusted total income (rule A678)
**Scenario** `re_c9_coop_80P_only.js` — co-op, GTI 50,00,000, the **only** Part-C deduction is
80P(2)(a)(i) 45,00,000 → Total income 5,00,000.

| item | expected (`AMT.md [H6]` = `MIN(GTI−spl−specBus, TotPartCchapterVIA_Calc − Section80P_Calc)`; rule A678) | actual (exported `ScheduleAMT`) |
|---|---|---|
| AMT sl.2a `DeductClaimSec6A` | **0** (45,00,000 − 45,00,000) | **45,00,000** |
| AMT sl.2d Total | 0 | 45,00,000 |
| AMT sl.3 Adjusted TI | 5,00,000 | 50,00,000 |
| AMT sl.4 `TaxPayableUnderSec115JC` | **0** (`IF(AMT.Total<=0,0,…)`) | **7,50,000** |
| Part B-TTI 1d TotalTax | 0 | 7,80,000 |
| **Part B-TTI 3 Gross tax payable** | **1,52,880** (the normal computation) | **7,80,000** — over-assessed by **₹6,27,120** |

**Root cause** — `forms/ITR-5/src/70_sec_amt.js:95-96`:
```js
const s80P=Math.max(0,R(DED.s80P!=null?DED.s80P:(DED.section80P!=null?DED.section80P:
  (DED.p80P!=null?DED.p80P:(DED.d80P||0)))));
```
None of `s80P` / `section80P` / `p80P` / `d80P` exist on `S.C.ded`; the published names are
`S.C.ded.p80.totalAmt` / `S.C.ded.out.c80p`, and **`S.C.ded.partCForAMT` (`70_sec_ded.js:270`) already holds
the correct Part-C-less-80P figure** (0 in this scenario) but is never read. So `s80P` is always 0 and
the whole 80P deduction is added back. Also visible in `re_c4_coop_80P.js` (2a = 6,50,000, should be 0)
and, harmlessly but wrongly, in `re_c7`/`re_c8`.

### FAIL-5 · AOP/BOI member cases are not implemented — no maximum-marginal-rate branch (§167B)
**Scenario** `re_f1_aop_member_exceeds.js` — status 14, sub-status "7-Any other AOP/BOI", determinate member
shares (Alpha Ltd 60% / Beta LLP 40%), `S.pm.dExceeds="Y"` → exported as
`PartA_GEN2 … PartnerOrMemberInfo[0].TotIncFrmMemberOfAop = "Y"`, Total income 30,00,000.

| item | expected (Tax(N) `GrpsB.4` = SubStatus {4,5,7} → member cases 1-5, case flag `S2 = PMInfo.TotIncFrmMemberOfAop`; §167B(2)(i) MMR) | actual |
|---|---|---|
| Rate | maximum marginal rate 30% | **old AOP slab** |
| Tax on total income | 9,00,000 | **7,12,500** |
| Cess 4% | 36,000 | 28,500 |
| **Gross tax liability** | **9,36,000** | **7,41,000** (short by **₹1,95,000**) |

### FAIL-6 · AOP/BOI foreign-company member split (Tax(N) case 3, 35%/30%) is not implemented
**Scenario** `re_f2_aop_foreign_member.js` — same AOP, `S.pm.bForeign="YES"`, `S.pm.cPct=40`
(→ `PercentageOfShareForeignComp = 40`), Total income 30,00,000.

| item | expected (Tax(N) `C27 = ROUND(TI×(R2/100)×0.35) + ROUND(TI×((100−R2)/100)×0.30)`) | actual |
|---|---|---|
| Tax on total income | 4,20,000 + 5,40,000 = **9,60,000** | **7,12,500** |
| Cess 4% | 38,400 | 28,500 |
| **Gross tax liability** | **9,98,400** | **7,41,000** (short by **₹2,57,400**) |

**Root cause for FAIL-5/6** — `taxStatus()` (`forms/ITR-5/src/70_sec_tax.js:52-72`) maps sub-status "7" straight
to `kind:"slab"`; `70_sec_tax.js` never references `S.pm` / `PMInfo` at all (grep: zero hits). Cases 1 (30%),
3 (35/30 split), 4 (30%) and 5 (35%) of Tax(N) `C20:C31`, and the `PDT.MMR` roll-up, have no counterpart.
The data *is* captured (`70_sec_gen.js:425-427`, exported at `:640-642`) — it is just never consumed.

### FAIL-7 · A firm / LLP / local authority / co-op can be put into §115BAC (rule A40)
**Scenario** `re_h1_firm_optout_no.js` — Partnership Firm with `S.fs.optout="No"`, 80-IA 5,00,000,
80G 1,00,000, 10AA 2,00,000, additional depreciation 2,00,000.

| item | expected (rule A40: for sub-status Firm/LLP/Local authority/Co-op society the §115BAC(6) option **must be disabled**; §115BAC applies only to Individual/HUF/AOP/BOI/AJP) | actual |
|---|---|---|
| Regime | Old (the only regime open to a firm) | **New** |
| Additional depreciation | 2,00,000 allowed | **0** |
| Ch VI-A (80-IA + 80G) / 10AA | 6,00,000 / 2,00,000 | **0 / 0** |
| Total income | 45,50,000 | **55,50,000** |
| **Gross tax liability** | **14,19,600** | **17,31,600** (over-assessed by **₹3,12,000**) |
| Schedule AMT | computed (adj. 52,50,000 → 9,71,250) | **suppressed** |

Aggravating: `70_sec_gen.js:101` defaults `S.fs.optout = "No"`, so a **fresh firm/LLP/co-op return starts in
the new regime** with every deduction closed. `70_sec_gen.js:239` renders the switch for every status with no
entity gate, and no rule fires to catch it.

### FAIL-8 · Rule A653 (80P only for a co-operative society) is too permissive
**Scenario** `re_c7_aop_claims_80P.js` — status 14 **sub-status "7-Any other AOP/BOI"** claiming
Schedule 80P 6,50,000 (`Section80P` exported, TI reduced from 50,00,000 to 43,50,000).

| item | expected (rules A631 / A653: 80P allowed only to "Primary Agricultural Credit Society / Primary Co-operative Agricultural and Rural Development bank / Other co-operative Society" — sub-statuses 1a, 1b, 3) | actual |
|---|---|---|
| Rule A653 | FIRES | **silent** |
| Rule A631 (Schedule-80P entity gate) | FIRES | **not implemented anywhere** |

`61_rules_enc_15.js:83` tests only `stat==="14"`, so Business Trust (4), Investment Fund (5), private
discretionary trust (6), "Any other AOP/BOI" (7) and Societies-Registration-Act societies (2) all pass.
Control `re_c8_firm_claims_80P.js` (status 1) correctly fires A653 — PASS.

### FAIL-9 · `engDed`'s co-op test disagrees with the tax engine's (over-broad)
`70_sec_ded.js:197` — `const isCoop = stat==="14" && /^(1a|1b|1c|2|3)/.test(sub);` includes sub-status
**"2-Society Registered under Societies Registration Act-1860"**, which is *not* a co-operative society
(Tax(N) `GrpsB.1 = SubStatus {1,3}`; `taxStatus()` at `70_sec_tax.js:62` and `amtIsCoop()` at
`70_sec_amt.js:80` both use {1a,1b,1c,3}). Consequence: such a society taxed on the AOP slab shows no
"80P is for co-operative societies" warning (`70_sec_ded.js:403`, `:625`). Cosmetic today (the flag only
drives a warning and a screen note) but it is a third, inconsistent definition of "co-op" in the form.

---

## PASS table — expected vs actual (to the rupee)

Legend: TI = Part B-TI 13 total income; Tax = Part B-TTI 2a; Sur = 2e-iv after marginal relief;
Cess = 2f (4%); Gross = 2g; AMT = Schedule AMT sl.4.

### (a) OLD regime — firm / LLP
| # | scenario | basis | expected | actual | |
|---|---|---|---|---|---|
| 1 | `re_a1_firm_old` TI 50,00,000 | Tax(N) `C7` flat 30%, cess 4% `AR113` | Tax 15,00,000 · Sur 0 · Cess 60,000 · Gross **15,60,000** | identical | PASS |
| 2 | `re_a2_firm_1_2cr` TI 1,20,00,000 | `M2`/`C120` 12% above ₹1cr | Tax 36,00,000 · scr 12% · Sur 4,32,000 · MR 0 · Cess 1,61,280 · Gross **41,93,280** | identical | PASS |
| 3 | `re_a3_firm_exactly_1cr` TI 1,00,00,000 | surcharge only **above** ₹1cr | scr **0** · Sur 0 · Gross **31,20,000** | identical | PASS |
| 4 | `re_a4_firm_marginal` TI 1,01,00,000 | marginal relief `MarginalRelief`=`C176` | Tax 30,30,000 · Sur raw 3,63,600 · **MR 2,93,600** · Sur 70,000 · Tax+Sur = 31,00,000 (= tax@1cr + ₹1,00,000) · Cess 1,24,000 · Gross **32,24,000** | identical | PASS |
| 5 | `re_a5_firm_open` (VI-A + 10AA + addl depr + 35AD + 3b) | old regime opens everything except DPM 3b for a firm (rule 282) | Depr 6,50,000 (addl 2,00,000 **allowed**, 3b 1,00,000 **barred**) · GTI 53,50,000 · VI-A B 1,50,000 / C 6,00,000 · 10AA 2,00,000 · TI 44,00,000 · Gross **13,72,800** · AMT adj 55,00,000 (incl. 35AD 3,00,000) → **10,17,500**, 1d 10,58,200 | identical | PASS |
| 6 | `tests/ITR-5/state.js` (reference firm) | §24(b) uncapped for a let-out property | HP 6,00,000 − 40,000 taxes → 5,60,000 − 30% 1,68,000 − interest 2,00,000 = **1,92,000** | 1,92,000 | PASS |

### (b) NEW regime §115BAC — AOP/BOI, `OptOldRegimeCurrAY = "N"`
| # | scenario | basis | expected | actual | |
|---|---|---|---|---|---|
| 7 | `re_b1_aop_new_30L` TI 30,00,000 | `C18` 4/8/12/16/20/24-lakh slab | 20,000+40,000+60,000+80,000+1,00,000+1,80,000 = **4,80,000** · Cess 19,200 · Gross **4,99,200** | identical | PASS |
| 8 | `re_b2_aop_new_loaded` (same inputs as #9) | 115BAC closures | 80-IA **0**, 80G **0**, 80GGC **0**, 10AA **0**, 80JJAA **1,00,000 survives**, addl depr **0**, 35AD(1) **0**, DPM 3b **0**, Schedule AMT **off** · GTI 55,50,000 · TI 54,50,000 · Tax 12,15,000 · scr 10% · Sur 1,21,500 · Cess 53,460 · Gross **13,89,960** | identical | PASS |
| 9 | `re_b2b_aop_old_loaded` (same state, `optout:"Yes"`) | old regime opens everything; DPM 3b allowed for an AOP (rule 282 bars only firm/LLP/co-op) | Depr 6,65,000 (3b 1,00,000 **allowed**) · VI-A B 1,50,000 / C 6,00,000 · 10AA 2,00,000 · TI 43,85,000 · Gross **11,73,120** · AMT adj 54,85,000 → 10,14,725 (+10% sur 1,01,473 +cess 44,648) 1d **11,60,846** | identical | PASS |
| 10 | `re_b3_aop_new_6cr` TI 6,00,00,000 | `M4/M8` — 115BAC caps the 37% band at **25%** | Tax 1,75,80,000 · scr **25** · Sur 43,95,000 · Cess 8,79,000 · Gross **2,28,54,000** | identical | PASS |
| 11 | `re_b3b_aop_old_6cr` same income, old regime | old ladder reaches 37% | Tax 1,78,12,500 · scr **37** · Sur 65,90,625 · Cess 9,76,125 · Gross **2,53,79,250** | identical | PASS |
| 12 | `re_b4_aop_new_4L` TI 4,00,000 | `W4` basic exemption ₹4L under 115BAC | Tax **0** | 0 | PASS |
| 13 | `re_b5_aop_new_8L` TI 8,00,000 | 5% on 4-8L | Tax **20,000** · Cess 800 · Gross 20,800 | identical | PASS |
| 14 | `re_m1_aop_new_50L_mr` TI 50,10,000 | 10% band + marginal relief at ₹50L | Tax 10,83,000 · **MR 1,01,300** · Sur 7,000 · Tax+Sur = 10,90,000 · Cess 43,600 · Gross **11,33,600** | identical | PASS |
| 15 | `re_m4_aop_old_1cr_mr` TI 1,00,10,000 (old) | 15% band + marginal relief at ₹1cr | Tax 28,15,500 · **MR 1,34,075** · Sur 2,88,250 · Tax+Sur = 31,03,750 · Cess 1,24,150 · Gross **32,27,900** | identical | PASS |
| 16 | `re_g1_aop_new_hploss` vs `re_g1b`/`re_g1c` (old) | rule A528 — no HP-loss set-off in the new regime | new: CYLA set-off **0**, GTI 30,00,000 · old: CYLA **2,00,000** (§71(3A) cap), GTI 28,00,000 | identical | PASS |

### (c) Co-operative society
| # | scenario | basis | expected | actual | |
|---|---|---|---|---|---|
| 17 | `re_c1_coop_25k` TI 25,000 | `C10:C12` 10%/20%+1,000/30%+3,000 | 1,000+2,000+1,500 = **4,500** · Cess 180 · Gross 4,680 | identical | PASS |
| 18 | `re_c2_coop_1_5cr` TI 1,50,00,000 | co-op surcharge **7%** in ₹1-10cr | Tax 44,97,000 · scr **7** · Sur 3,14,790 · Cess 1,92,472 · Gross **50,04,262** | identical | PASS |
| 19 | `re_c3_coop_12cr` TI 12,00,00,000 | co-op surcharge **12%** above ₹10cr | Tax 3,59,97,000 · scr **12** · Sur 43,19,640 · Cess 16,12,666 · Gross **4,19,29,306** | identical | PASS |
| 20 | `re_m2_coop_1cr_mr` TI 1,00,10,000 | marginal relief at the ₹1cr / 7% edge | Tax 30,00,000 · **MR 2,03,000** · Sur 7,000 · Tax+Sur = 30,07,000 · Gross **31,27,280** | identical | PASS |
| 21 | `re_m3_coop_10cr_mr` TI 10,00,10,000 | marginal relief at the ₹10cr / 12% edge | Tax 3,00,00,000 · **MR 14,93,210** · Sur 21,06,790 · Tax+Sur = 3,21,06,790 · Cess 12,84,272 · Gross **3,33,91,062** | identical | PASS |
| 22 | `re_c4_coop_80P` (80P caps) | rules A632 / A633 | 80P(2)(a)(i) 5,00,000 uncapped · **80P(2)(c)(i) capped to 1,00,000** · **80P(2)(c)(ii) capped to 50,000** · total 6,50,000; exported `Sec80P2ciAmt`=1,00,000, `Sec80P2ciiAmt`=50,000; A632/A633 silent (prevented by construction) | identical | PASS |
| 23 | `re_c5_coop_115BAD` TI 50,00,000 | `C12` §115BAD **22%**, surcharge 10% flat | Tax **11,00,000** · Sur 1,10,000 · Cess 48,400 · Gross **12,58,400** | identical | PASS |
| 24 | `re_c6_coop_115BAE` TI 50,00,000 (all manufacturing) | `C12` §115BAE 15% mfg + 22% other | Tax **7,50,000** · Sur 75,000 · Cess 33,000 · Gross **8,58,000** | identical | PASS |
| 25 | `re_c10_coop_115BAE_os` business 50,00,000 + interest 10,00,000 | `G12` = business income, `H12` = TI − G12 | 15%×50,00,000 + 22%×10,00,000 = **9,70,000** · Sur 97,000 · Cess 42,680 · Gross **11,09,680** | identical | PASS |
| 26 | `re_c11b_coop_old_dep` | old-regime co-op baseline for FAIL-2 | addl depr **allowed**, DPM 3b **barred** (rule 282, co-op) → Depr 6,50,000 · TI 53,50,000 · Tax 16,02,000 · Gross **16,66,080** | identical | PASS |
| 27 | `re_h2c_coop_old_r45` | old-regime Rate-45 baseline for FAIL-3 | Depr 4,50,000 allowed · TI 55,50,000 · Tax 16,62,000 · Gross **17,28,480** | identical | PASS |
| 28 | `re_c8_firm_claims_80P` — a **firm** claims 80P | rule A653 | A653 **FIRES** | fires | PASS |

**Verdict on the concessional co-op paths:** §115BAD (22%) and §115BAE (15%+22%) **are** implemented, and
their rates, the 10% flat surcharge and the 4% cess are exact. What is missing is everything *else* the two
sections do — see FAIL-1/2/3.

### (d) Firm/LLP vs AOP/BOI/AJP — AMT (§115JC)
| # | scenario | basis | expected | actual | |
|---|---|---|---|---|---|
| 29 | `re_d1_firm_amt_15L` — firm, adjusted TI **15,00,000** | rule **A683** / `FormulaOfAMT="Y"` — **no ₹20-lakh floor** for a firm | AMT **2,77,500** (18.5%) · 1d 2,88,600 · normal 1,56,000 · **Gross tax payable 2,88,600** | identical | PASS |
| 30 | `re_d1b_llp_amt_15L` — LLP, same | ditto | AMT **2,77,500** · Gross payable 2,88,600 | identical | PASS |
| 31 | `re_d2_aop_amt_15L` — AOP/BOI, adjusted TI 15,00,000 | rule **A682** / `FormulaOfAMT="N"` — ₹20-lakh floor | AMT **0** · Gross payable 13,000 | identical | PASS |
| 32 | `re_d3_aop_amt_25L` — AOP/BOI, adjusted TI 25,00,000 | 18.5% above the floor | AMT **4,62,500** · 1d 4,81,000 · Gross payable 4,81,000 | identical | PASS |
| 33 | `re_d5_ajp_amt_25L` — AJP, adjusted TI 25,00,000 | floor applies to AJP too | AMT **4,62,500** · 1d 4,81,000 | identical | PASS |
| 34 | `re_d4_coop_amt_25L` — co-op, adjusted TI 25,00,000 | `AsseesseeSubStatusFlag=1` ⇒ **15%** (AMT.md `P12`/`N12`) | AMT **3,75,000** · 1d 3,90,000 · Gross payable 3,90,000 | identical | PASS |
| 35 | `re_d4b_coop_amt_15L` — co-op, adjusted TI 15,00,000 | `FormulaOfAMT` keys on **MainStatus 3**, so the floor covers co-ops in the utility | AMT **0** | 0 | PASS (see Note 2) |

### (e) Entity-type rate routing (Tax(N) `N2:P2`, `O4:O9`, `P4:P6`)
All at TI 30,00,000, old regime.
| # | scenario | sub-status | expected rate / tax | actual | |
|---|---|---|---|---|---|
| 36 | `re_e7_llp_flat30` | 1 / "2-LLP" | flat 30% → 9,00,000 · Gross 9,36,000 | identical | PASS |
| 37 | `re_e6_localauth` | 2 / Local Authority | flat 30% (`C7`) → 9,00,000 | identical | PASS |
| 38 | `re_e8_aop_old_30L` | 14 / "7-Any other AOP/BOI" | old AOP slab → 7,12,500 (but see FAIL-5/6) | identical | PASS |
| 39 | `re_e5_society_slab` | 14 / "2-Society Reg. under Societies Reg. Act" | `GrpsB.2` AOP slab → 7,12,500 | identical | PASS |
| 40 | `re_e3_mmr_trust` | 14 / "6-Trust other than ITR-7" | `C19` MMR **30%** → 9,00,000 | identical | PASS |
| 41 | `re_e4_bustrust` | 14 / "4-Business Trust" | `C46` flat 30% → 9,00,000 | identical | PASS |
| 42 | `re_e1_ajp_other_slab` | 9 / "3-Other AJP" | `GrpsC.3` slab (`C41:C45`) → 7,12,500 | identical | PASS |
| 43 | `re_e2_ajp_insolvent` | 9 / "2-Estate of the insolvent" | `GrpsC.2` flat 30% (`C37/C39`) → 9,00,000 | identical | PASS |
| 44 | co-op sub-statuses 1a/1b/1c/3 → co-op slab; `re_h2b_coop_new_r45` | `GrpsB.1` = SubStatus {1,3} | co-op slab, Rate-45 depreciation blocked under `optout:"N"` | identical | PASS |

---

## Notes and observations (not scored as failures)

1. **Cess is 4% everywhere** (`70_sec_tax.js:236/243`), never the legacy `Tax.md` 3%. Verified on every case
   above, including the AMT leg. Correct per `Tax_N.md` `AR113` and rule A752.
2. **The ₹20-lakh AMT floor reaches co-operative societies** because `amtFloorApplies()`
   (`70_sec_amt.js:76`) keys on schema status 14/9 — i.e. the utility's `FormulaOfAMT = "N"` for
   MainStatus 3, which covers co-ops. That replicates `AMT.md [O13]` faithfully, though §115JC(4) of the Act
   names only individual/HUF/AOP/BOI/AJP. Flagged for the lead: the form follows the utility, as instructed.
3. **AMT surcharge rates for AOP/AJP.** `70_sec_amt.js:140-150` uses the graduated 10/15/25/37 ladder
   (and 7/12 for co-ops). `Tax_N.md` §3 documents a fixed `SurchargeRate_AMT` table (Firm/LA 12%, AOP/BOI
   15%, co-op 12%, AJP 15%) applied at the 50L/1cr/2cr/5cr/10cr comparison cells. The engine's rates match
   the Finance Act; the book's table would give different figures above ₹2cr. Left to the AMT area to settle.
4. **§115BAE manufacturing base.** `70_sec_tax.js:202` uses `S.C.bp.a.A37` (all non-speculative business
   income) as the 15% base, matching `Tax(N) G12` ("business income"). It does not consult the
   nature-of-business code, so a 115BAE co-op with non-manufacturing business income gets 15% on all of it.
   Same simplification as the utility's `G12`, so recorded as an observation only.
5. **80LA(1A) survives the new regime** (`70_sec_ded.js:249`, rule A18 at `61_rules_enc_01.js:76`). That
   matches rule A18's own wording ("except 80JJAA & 80LA(1A)") even though §115BAC(2)(i) of the Act preserves
   only 80CCD(2)/80CCH(2)/80JJAA. The utility is ground truth here, so: PASS.
6. **Marginal relief thresholds are entity-correct**: `[1cr]` for firm/LA, `[1cr, 10cr]` for co-op,
   `[50L, 1cr, 2cr, 5cr]` for AOP/BOI/AJP (`70_sec_tax.js:215-217`). Verified at every edge (#4, #14, #15,
   #20, #21) — in each case tax + surcharge after relief equals exactly (tax at the threshold + the excess
   income), which is the statutory test.
7. Scenario states are checked in at `tests/ITR-5/verify/re_*.js`; raw per-case JSON dumps are in the
   session scratchpad (`re/out/*.json`). Nothing in `forms/ITR-5/src` or `books/` was modified.
