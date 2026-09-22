# ITR-5 · A.Y. 2026-27 — verification report: RULES AND GATING

Scope: (1) adversarial rule firing, (2) schedule gating, (3) round-trip + schema.
Everything below was produced by driving `forms/ITR-5/Yukti_ITR5.html` in Chromium
(Playwright), injecting scenario states, and reading `S.C`, `runRules(buildReturn(),S)`,
`buildReturn()` / `importReturn()` and the `#b_json` / `#b_save` export paths.
Nothing in `forms/ITR-5/src` or `books/` was modified.

Scenario states written for this report live in `tests/ITR-5/verify/` (`sc_*.js`
entity/feature scenarios, `g_*.js` gating scenarios, `d_*.js` defect-isolation
scenarios); every one is a delta applied on top of the lawful reference client
`tests/ITR-5/state.js`. Round-trip artefacts are in `logs/ITR-5/verify/rag/`.

---

## 0. FAILURES — read this section first

Seven defects. Five of them **block the export outright** (the shell refuses
`#b_json` when a Category-A rule fails), one produces a **wrong Total Income**,
one breaks the **export round-trip**.

### FAIL-1 (BLOCKER) · Part B-TI item 2(iv) is permanently zero → rule A801
- **Scenario** `tests/ITR-5/verify/d_vda_business_head.js` — firm, old regime, one
  Schedule VDA row taxed under the business head (`head:"BI"`, cost 2,00,000,
  consideration 4,50,000 → VDA `TotIncBusiness` 2,50,000), `S.bp.a3f = 250000`.
- **Expected** (`books/ITR-5/PARTB_TI_TTI.md` line 31): Part B-TI 2(iv)
  `ProfBusGain.IncChrgblTaxSplRate` = `J9 = IncRecCredPL115BBF + …115BBG + …115BBH`
  = 0 + 0 + 2,50,000 = **2,50,000**.
- **Actual**: `IncChrgblTaxSplRate` = **0**. `runRules` returns `A801`
  ("item 2(iv) must equal the sum of 3d + 3e + 3f of Schedule BP") and the export
  is refused: *"The portal would reject this return — 1 Category A rule fails."*
- **Implicated**: `forms/ITR-5/src/70_sec_tax.js:131`
  `const b2iv=Math.max(0,R(BP.splRate!=null?BP.splRate:(BP.spl||0)));`
  `S.C.bp` publishes `a3d` / `a3e` / `a3f` (`forms/ITR-5/src/70_sec_bp.js:368`) and
  **neither `splRate` nor `spl`**, so the expression is always 0. Probed
  `Object.keys(S.C.bp)` = `[on,a,b,c,d,e,income,curDep,dcg,ded35AD,a3d,a3e,a3f]`.
- **Effect**: every ITR-5 carrying 115BBF (patent), 115BBG (carbon credits) or
  business-head 115BBH (VDA) income is un-exportable.

### FAIL-2 (BLOCKER) · Schedule BP A3f is not computed from Schedule VDA → rule A267
- **Scenario** same as FAIL-1 but with `S.bp.a3f` left at its default 0.
- **Expected** (`books/ITR-5/BP.md` line 195): **A3f (I16) = MAX(0, VDA.TotalIncomeBI)**
  — the utility auto-populates it.
- **Actual**: the form renders A3f as a free numeric input
  (`forms/ITR-5/src/70_sec_bp.js:401` `inpN("bp.a3f")`, value at `:368`), default 0,
  while Schedule VDA reports `TotIncBusiness: 250000`. `runRules` → `A267`
  ("Sl.No.3f must match the business-head total of Schedule VDA"); export refused.
- A correctly-filled Schedule VDA therefore blocks its own return until the user
  happens to re-key the same figure into Schedule BP by hand.

### FAIL-3 (BLOCKER) · rule A836 is encoded without the sheet's `MAX(...,0)` floor
- **Scenario** `tests/ITR-5/verify/d_lowgti_clip.js` — firm whose GTI is 0 while
  Schedule TR carries s.90 relief of ₹15,000.
- **Expected** (`books/ITR-5/PARTB_TI_TTI.md` line 120):
  `L82 = MAX(sheet9.TaxPayAfterCreditUs115JD − Sheet9.TotTaxRelief, 0)`, i.e. item 7
  is **floored at zero**. The form computes item 7 = 0 — correct.
- **Actual**: `forms/ITR-5/src/61_rules_enc_20.js:113-116` asserts strict equality
  `NetTaxLiability == TaxPaidUnderCredit − TotTaxRelief` (= 0 − 15,000 = −15,000),
  so **A836 fires on a lawful return** and blocks it.
- Any year where s.90/91 relief exceeds the tax payable after the 115JD credit
  (a loss year with foreign-tax credit) is blocked.

### FAIL-4 (BLOCKER) · 80GGC barred for Local Authority / AJP zeroes only the total → rule A587
- **Scenario** `tests/ITR-5/verify/d_ajp_80ggc.js` — AJP (status 9, "3-Other AJP")
  with the reference client's single 80GGC contribution of ₹25,000.
- **Expected**: 80GGC is not available to a Local Authority or AJP
  (`books/ITR-5/80GGC.md` P7 / rule A662), so the schedule should not be produced
  at all (or its rows should be zeroed with it).
- **Actual**: `ScheduleVIA.DeductUndChapVIA.Section80GGC = 0` (the bar is applied)
  **but** `Schedule80GGC.TotalEligibleDonationAmt80GGC = 0` while the row still
  carries `EligibleDonationAmt: 25000`. `A587` ("D must equal the total of column vi")
  fires on a return the builder itself produced from lawful input; export refused.
- **Implicated**: `forms/ITR-5/src/70_sec_ded.js` `barred80ggc` path — the bar is
  applied to the Part-C figure only, not to the schedule rows.

### FAIL-5 (BLOCKER) · Chapter VI-A / 10AA clipping leaves the schedules self-contradictory → rules A580 + A587
- **Scenario** `tests/ITR-5/verify/d_lowgti_clip.js` (GTI 0, with the reference
  client's 10AA claim of ₹2,00,000 and 80GGC of ₹25,000 still in place).
- **Expected**: when the deduction is clipped to the available income, the schedule
  totals and their rows stay consistent (the utility clips at Part B-TI 11c, per
  `PARTB_TI_TTI.md` line 61, not by zeroing a schedule's own total).
- **Actual**: `Schedule10AA.DeductSEZ.DedUs10Detail.TotalDedUs10Sub = 0` while the
  row `DedUs10Sub = 200000` → **A580**; `Schedule80GGC` total 0 vs row 25,000 → **A587**.
  Both are Category-A; export refused.

### FAIL-6 (WRONG FIGURE) · 80P is granted to a non-co-operative
- **Scenario** `tests/ITR-5/verify/g_firm_80p_attempt.js` — partnership firm
  (status 1, "1-Partnership Firm") entering 80P(2)(d) income/deduction ₹3,00,000
  with the matching business code 23011 in the nature-of-business schedule.
- **Expected**: 80P belongs to co-operative societies only
  (`books/ITR-5/80P.md`, rule A653). The deduction must not enter Part C.
- **Actual** (identical figures to the co-op control `g_coop_80p.js`):
  `S.C.ded.out.c80p = 300000`, `S.C.ded.isCoop = false`,
  `ScheduleVIA.DeductUndChapVIA.Section80P = 300000`,
  Part B-TI `TotDeductUndSchVIA = 545000` (co-op control: 545000),
  **Total Income 36,67,000 instead of 39,67,000**. The only guard raised inside the
  form is a `warn`-level check ("80P is for co-operative societies",
  `forms/ITR-5/src/70_sec_ded.js:625-626`).
  Category-A **A653 does fire**, so the return cannot be uploaded — but the tax the
  user sees on screen is understated by ₹90,000 of tax at 30% plus cess.
  Compare the correct handling of 80-IAC (hard `err`, `:620`) and of 80GGC
  (`barred80ggc` zeroes the figure).

### FAIL-7 (ROUND-TRIP) · an empty `ScheduleIF` stub is exported but lost on import
- **Scenarios**: `sc_coop`, `sc_ajp`, `sc_aop_new`, `sc_btrust`, `sc_invfund`,
  `sc_115td` — 6 of 10 — all of which answer "partner in 0 firms".
- **Expected**: export → import → export byte-identical.
- **Actual**: export-1 carries
  `"ScheduleIF": {"PartnerInNumberOfFirms":0,"TotalProfitShareAmt":0,"TotalFirmCapBalOn31Mar":0}`;
  export-2 omits the block entirely. Single-key diff, every time.
- **Implicated**: `forms/ITR-5/src/70_sec_other.js:399` emits the block whenever
  `ifRows.length || st0((O.if||{}).n)!==""`, while `:513` imports it as
  `n: nz(A.PartnerInNumberOfFirms)` and `nz(0)` returns `""` — verified by probe:
  after importing `sc_coop.export1.json`, `S.other.if` = `{n:"",firms:[]}` and
  `buildReturn()` no longer contains `ScheduleIF`.
- Either stop emitting the stub (gate on `ifRows.length || N(CI.n)>0`) or preserve
  the 0 on import.

### Not a defect, but worth recording · the filing date is not carried in the return
`S.fs.filed` (which drives 234A / 234B / 234C and the 234F fee) has no field in the
CBDT ITR-5 schema, so it is not in the exported JSON. An import therefore recomputes
interest against a different date: `sc_loss` showed 234A 3,066 → 0, 234F 5,000 → 0,
234B 10,220 → 6,132; `sc_vda` showed 234B 11,011 → 9,438. **Re-supplying the date on
import makes every one of those round-trips byte-identical** (verified with
`--filed`), which confirms this is the sole cause and not a builder bug.
`tools/harness/roundtrip.py` already carries a `--filed` flag for exactly this.

---

## 1. ADVERSARIAL RULE FIRING

### Method
1. **Silence on lawful returns.** Ten lawful scenarios (firm/old, AOP/new, co-op,
   business trust, investment fund, AJP, foreign, VDA, loss-carry-forward, 115TD)
   were built and each produced **0 Category-A and 0 Category-D** findings,
   `S.C.checks` error-free, no page errors. This is the "silent on a lawful return"
   half of the contract, and it is the baseline every mutation was diffed against.
2. **Reachability probe.** `_RULEBATCHES` was re-driven with instrumented `A`/`Dd`
   collectors that record **every serial evaluated** and its truth value, rather than
   only the failures. Across the ten lawful scenarios **690 Category-A serials and
   13 Category-B/D serials are evaluated**, and **every one of them evaluated TRUE**
   (no lawful-return false-fire anywhere).
3. **Systematic single-field mutation sweep.** For each scenario the built return was
   walked to every leaf (2,100-2,400 paths) and each leaf perturbed
   (`+1e6`, `0`, `−1e6`, delete / `"Y"`, `"N"`, `""`, `"ZZZ9"`, delete / `[]` / `{}` / delete).
   **79,845 mutant returns** in total (7,510-8,320 per scenario); each was re-run
   through `runRules` and the newly-appearing serials recorded.
4. **Hand-crafted multi-field adversarial cases.** Single-field mutation cannot reach
   a conditional rule whose guard and requirement are different fields, so **248
   hand-written violating returns** were crafted from the encoded conditions and the
   `books/ITR-5/rules.json` text — one per serial that the sweep had not reached,
   heavily weighted to the regime-gated, entity-gated, date-gated and
   schedule-presence-gated rules the brief called out.

### Result

| measure | count |
|---|---|
| Category-A serials **proven to fire** on a violating return | **768** |
| Category-B/D serials proven to fire | **13 of 13** (15, 16, 23, 25, 35, 36, 46, 47, 48, 49, 52, 55, 56) |
| Category-A serials evaluated on a lawful return that were never made to fire | **0** |
| literal `A(n,…)` serials in the 24 `61_rules_enc_*.js` files never made to fire | **0** |
| Category-A false-fires on a lawful return (10 scenarios) | **0** |
| rule batches that threw | **0 of 24** |

Ranges covered (every serial in these bands fired at least once, in the correct
direction — silent on the lawful control, firing on the violating return):

- **1-80** Part A-General, regime / 115BAD / 115BAE / Form 10-IEA / 10-IF / 10-IFA
  tree, private-discretionary-trust Table F, due-date gates, secondary address.
- **101-179** Manufacturing / Trading / P&L, including the whole presumptive block
  (44AD 6%/8% floors and ceilings, 44ADA, 44AE goods-carriage table, months ≤ 120,
  tonnage ≤ 100, ₹7,500/month floor, duplicate registration numbers, the barred
  44AD business codes, the non-resident 44B/44BB/44BBA/44BBC/44BBD profit floors).
- **180-250** Part A-OI, ICDS, Schedule HP (co-ownership share, annual value,
  interest with a nil share, co-owner PAN = assessee PAN), Schedule BP Tables A-E.
- **251-330** Schedule BP adjustments, DPM / DOA / DEP / DCG (all six blocks,
  including the intangible-asset and ships summaries).
- **331-470** Schedule CG (A1/A2/A3/A3ii/A5/A8, B1/B2/B3/B4/B6/B7/B8, Table D CGAS
  deposits, Table E set-off matrix, Table F quarters, DTAA), Schedule VDA.
- **471-500** Schedule OS including the race-horse block and the 2e DTAA table.
- **501-575** CYLA / BFLA / CFL / UD.
- **576-680** Schedule 10AA, 80G, 80GGA, 80GGC, RA, 80-IA/IB/IC/IE/IAC/LA, 80P
  (row caps, business codes, co-op-only), Schedule VI-A cross-checks.
- **681-745** AMT / AMTC, Schedule SI (all twelve SI-vs-CG upper bounds and the
  SI-vs-OS 2c/2d/2a identities), Schedule EI.
- **746-800** TPSA, 115TD, FSI, TR, FA.
- **801-866** Part B-TI and Part B-TTI, Schedule TDS1/TDS2/TCS/IT, verification.

Not covered, and why:
- The census's **NA (21) + OFFLINE-IMPOSSIBLE (55)** Category-A buckets and the
  **NA (38) + OFFLINE-IMPOSSIBLE (6)** Category-B buckets are, by construction, not
  offline-checkable (AIS/26AS, Form 3CA-3CD / 10DA / 10CCB / 29C / 10-IEA, portal
  filing state, a PAN-name or IFSC database, another person's ITR). They are not
  encoded and so cannot be fired.
- The census records **790** Category-A serials as ENFORCED; 768 were individually
  fired. The residual is made up of computed/loop serials inside families that use a
  base-plus-index serial (`A(598+bi)`, `A(602+bi)`, the per-DPM-block and
  per-80P-row loops) — sibling serials in each of those families did fire, but my
  scenarios did not instantiate every index of every family.

Two conditional guards deserve an explicit "correct" note because they are the kind
that hides a wrong direction:
- **A567** (CFL 5b 115BAD adjustment) is encoded as `isNewReg || every(...===0)`,
  which is the *opposite* of a literal reading of the rules.json wording. The
  encoding is right: the schema field is "amount adjusted ON ACCOUNT OF opting", so
  it is legitimately non-zero under the new regime. Verified: fires on an old-regime
  return carrying a 5b amount, silent under the new regime.
- **A141** (44ADA 63i/63ii) is deliberately encoded as `63ii <= 63i` rather than the
  literal text, which would contradict serial A134's 50% floor and fire on every
  lawful 44ADA return. Verified silent on lawful data.

---

## 2. SCHEDULE GATING

22 scenarios (10 entity/feature + 12 presence/absence) were exported and the block
list, the downstream Part B-TI / Part B-TTI lines and `runRules` were read for each.

| gate | requirement | verdict | evidence |
|---|---|---|---|
| **Schedule 80P** | co-operative societies only | **FAIL (FAIL-6)** | absent for firm, AOP/BOI, AJP, business trust, investment fund, and present for `3-Other Cooperative Society` — but a **firm that enters 80P rows gets the deduction into VI-A and Total Income**; only a `warn` plus the A653 upload block. |
| **Schedule IF** | partner in a firm only | **PASS on rows, FAIL on the stub (FAIL-7)** | `PartnerFirmDetails` present only when `S.fs.partner="Y"` with firm rows; but a zero stub is exported when the answer is "0 firms", and that stub is lost on re-import. |
| **Schedule PTI** | business trust / investment fund pass-through | **PASS** | absent when `S.other.pti=[]`; present for the investment-fund scenario with `SchedulePTIDtls` and `ScheduleEI.PassThrIncNotChrgblTax = 400000` matching PTI 1(iv) (rule A732 silent). Also correctly present for an ordinary firm holding REIT units — ITR-5's Schedule PTI is a unit-holder disclosure, not an entity-type gate. |
| **MAT (115JB)** | must NOT exist in ITR-5 | **PASS** | zero occurrences of `115JB` / `MinimumAlternate` in `forms/ITR-5/src/**`; `PartB_TTI.ComputationOfTaxLiability` contains no MAT key in any of the 22 exports. |
| **AMT (115JC)** | old regime, deduction-driven | **PASS** | `ScheduleAMT` present for firm/co-op/trust/AJP old-regime returns with `AdjustedUnderSec115JC` = TI + VI-A Part C + 10AA; **absent** under the new regime (`sc_aop_new`) and absent when no VI-A/10AA claim exists (`sc_loss`, `g_no_deduction`), exactly as `books/ITR-5/AMT.md` requires. `ScheduleAMTC` carries the 115JD credit pool and feeds `ComputationOfTaxLiability.CreditUS115JD`. |
| **FSI / TR / FA** | only with foreign income / assets | **PASS** | all three absent in `g_no_foreign.js` (`S.fa` emptied, `foreignExch="N"`, `faFlag="N"`); present together in `sc_foreign` with `ScheduleFSI.TotTaxRelief` → `ScheduleTR1.TotalTaxReliefOutsideIndia` → `PartB_TTI…TaxRelief.Section90/91`. Rules A765 / A774 (FSI / TR not for a non-resident) fire only when residential status is NRI. |
| **Schedule VDA** | only with VDA transactions | **PASS** on presence | absent in `g_no_vda.js`; present in `sc_vda` feeding `ScheduleCG.IncmFromVDATrnsf` and Schedule SI code `5BBH`. The **business-head** leg is broken — see FAIL-1 / FAIL-2. |
| **Schedule 115TD** | accreted income only | **PASS** | absent in all 21 other scenarios, present only in `sc_115td`. Computation matches `books/ITR-5/115TD.md`: `AccretedIncomeSection115TD = MAX(0, NetValAsst − (FMVTotal − LiabilityRespectofAsset4Above))`, tax at 34.944% MMR, interest u/s 115TE, net payable rounded up to ₹10. |
| **Schedule GST** | only when GST turnover is reported | **PASS** | absent in `g_no_gst.js`, present with the GSTIN/turnover row otherwise. |
| **Schedule SI** | populated only with special-rate income | **PASS on content, minor note** | with all special-rate income removed (`g_no_si.js`) `SplCodeRateTax` is empty and Part B-TI `IncChargeableTaxSplRate` is 0 — but a zero stub `{"TotSplRateInc":0,"TotSplRateIncTax":0}` is still emitted. Content gating is right; the empty block is cosmetic. |
| **Schedule EI** | exempt income only | **PASS on content, minor note** | with all exempt income removed (`g_no_ei.js`) the block collapses to `{"NetAgriIncOrOthrIncRule7":0,"TotalExemptInc":0}`; net agricultural income no longer feeds the aggregation-for-rate path. Again a zero stub rather than an absent block. |
| **Schedule CG / 112A / HP** | only with the corresponding income | **PASS** | `g_no_cg.js` drops `ScheduleCG`, `Schedule112A` and `ScheduleVDA` together and Part B-TI `CapGain` goes to 0; `g_no_hp.js` drops `ScheduleHP` and Part B-TI `IncomeFromHP` to 0. |
| **Schedule VIA / 80G / 80GGC / 10AA** | only with a claim | **PASS** | `g_no_deduction.js` drops `Schedule10AA`, `Schedule80G`, `Schedule80GGC`, `Schedule80_IA` and `ScheduleAMT`; Part B-TI 11c = 0 and TI = GTI. |
| **no false-fire when a schedule is absent** | every rule guarded | **PASS** | all 24 rule batches are wrapped in `if(I.ScheduleX)` guards or `RG(...)` defaults; 22 lawful scenarios × 0 Category-A, and the probe confirms no batch threw. The nine blocks absent from a typical export (`Schedule115AD`, `Schedule80LA`, `Schedule80IAC`, `Schedule80GGA`, `Schedule80RA`, `Schedule80_IB`, `Schedule80_IC`, `Schedule80P`, `Schedule115TD`) contributed no findings anywhere. |

Entity-type tax gating also checked while the scenarios were open, and all correct:
firm / LLP / local authority flat 30% with 12% surcharge above ₹1 cr; AOP/BOI and AJP
on the slab with the graduated 10/15/25/37 surcharge ladder (capped at 25 under
115BAC); co-operative on the 10/20/30 slab with the 7%/12% co-op ladder; business
trust and investment fund flat 30%; estate-of-the-insolvent AJP flat 30%.

---

## 3. ROUND-TRIP + SCHEMA

Ten scenarios. Each was exported (`#b_json`), the export re-imported into a fresh
page and re-exported, and separately the working file (`#b_save`) re-imported and
exported. `JSONCreationDate` is normalised out of the comparison; the filing date
is re-supplied on import (see the note in §0).

| scenario | schema (`ITR-5_2026_Main_V1_1_schema.json`) | export → import → export | working → import → export | Category A/D on export |
|---|---|---|---|---|
| `firm_old` (resident firm, OLD regime) | **0 errors — PASS** | **IDENTICAL — PASS** | IDENTICAL — PASS | 0 / 0 |
| `sc_aop_new` (AOP/BOI, NEW regime 115BAC) | **0 errors — PASS** | **DIFFERS — FAIL-7** (empty `ScheduleIF` only) | IDENTICAL — PASS | 0 / 0 |
| `sc_coop` (other co-operative society, 80P) | **0 errors — PASS** | **DIFFERS — FAIL-7** | IDENTICAL — PASS | 0 / 0 |
| `sc_foreign` (3-country FSI + TR + FA tables) | **0 errors — PASS** | **IDENTICAL — PASS** | IDENTICAL — PASS | 0 / 0 |
| `sc_vda` (3 VDA rows, s.194S TDS) | **0 errors — PASS** | **IDENTICAL — PASS** | IDENTICAL — PASS | 0 / 0 |
| `sc_loss` (belated 139(4), 5 years of CFL + UD) | **0 errors — PASS** | **IDENTICAL — PASS** | IDENTICAL — PASS | 0 / 0 |
| `sc_ajp` (AJP, estate of the insolvent) | **0 errors — PASS** | **DIFFERS — FAIL-7** | IDENTICAL — PASS | 0 / 0 |
| `sc_invfund` (investment fund 115UB + PTI) | **0 errors — PASS** | **DIFFERS — FAIL-7** | IDENTICAL — PASS | 0 / 0 |
| `sc_btrust` (business trust) | **0 errors — PASS** | **DIFFERS — FAIL-7** | IDENTICAL — PASS | 0 / 0 |
| `sc_115td` (AOP with accreted income u/s 115TD) | **0 errors — PASS** | **DIFFERS — FAIL-7** | IDENTICAL — PASS | 0 / 0 |
| `d_vda_business_head` (defect isolation) | n/a — export blocked | n/a | n/a | **A801** |

- **Schema: 10 of 10 PASS**, zero validation errors against the real CBDT
  `sources/ITR-5/ITR-5_2026_Main_V1_1_schema.json`. Block coverage 44-50 of 58
  depending on the scenario, with the absent blocks being exactly the ones the
  scenario does not exercise.
- **Working-file round-trip: 10 of 10 IDENTICAL** — the save/load path preserves the
  whole state, including the filing date.
- **Export round-trip: 4 of 10 IDENTICAL**, 6 differing by exactly one key
  (FAIL-7). No figure, enum or array differs anywhere once the filing date is
  re-supplied.
- `auditRules(buildReturn())` returned `[]` on every scenario — the return agrees
  with itself arithmetically in all ten.

Two schema errors seen during the run turned out to be faults in my scenario input
rather than the form, and are recorded here so they are not chased again:
`ScheduleFA` table-b/a2 field names (the form's state keys are `NameOfEntity`,
`AddressOfEntity`, `NatureOfInt`, `DateHeld`, `FinancialInstName`,
`FinancialInstAddress`, `AccountNumber`, `Status`, `NatureOfAmount`), and the
uppercase enum values (`DIRECT`, `INTEREST`) plus the ISD-style country codes.
Worth noting for robustness: the FA builder emits a row whenever a country code is
present and does **not** enforce the schema-required leaves of that row, so a
half-filled Schedule FA row exports schema-invalid JSON with no error surfaced in
`S.C.checks`.

---

## 4. Totals

- **768** Category-A serials and **13** Category-B/D serials proven to fire on a
  violating return, in the direction the rule text states.
- **0** Category-A serials that could be evaluated but never made to fire.
- **0** false-fires across 10 lawful scenarios and 22 gating scenarios.
- **79,845** systematic mutant returns + **248** hand-crafted adversarial returns.
- **12 of 14** schedule gates PASS; **80P** (entity gate) and **Schedule IF**
  (empty-stub round-trip) FAIL.
- **10 of 10** schema PASS; **10 of 10** working-file round-trips PASS;
  **4 of 10** export round-trips byte-identical.
- **7 defects** reported, 5 of them blocking.
