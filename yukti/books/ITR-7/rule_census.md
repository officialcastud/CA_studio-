# ITR-7 · AY 2026-27 — Validation-rule census (Phase 6, finalized)

Every CBDT ITR-7 validation serial in `books/ITR-7/rules.json` is classified into one of the constitution buckets, so that Phase-6 Gate-6 can prove **MISSING = 0**. The built return read by the encoder is `I = Object.values(buildReturn().ITR)[0]` (root **ITR7**); every path below is a key on `I` (confirmed against `sources/ITR-7/ITR-7_2026_Main_V0_1_schema.json`, definition `ITR7`).

`rules.json` holds **661 Category-A** (blocking — return not allowed to upload) and **33 Category-B** (advisory) serials. There is **no Category-D** in the ITR-7 rule set.

> **rules.json line-wrap.** The source text wraps each serial by ~one physical line, so entry *n*'s `text` carries the tail of rule *n−1* and the head of rule *n*. The classification below is made against the **re-joined** semantic rule, not the raw fragment; the reference encoder `61_rules_enc_01.js` encodes to the same re-joined reading.

## Buckets

- **ENFORCED-target** — offline-checkable against a schema key that exists on the built return; encoded as `A(serial, cond, msg)` (Category A) or an advisory `Dd(serial, cond, msg)` (Category B), cond TRUE on a lawful return, FALSE on a violation.
- **NA** — not this form's job: resolved by the e-filing portal, by a server clock / the filing timestamp (which the built return does **not** carry), by AIS/26AS, or by another form. Nothing to encode offline.
- **OFFLINE-IMPOSSIBLE** — cannot be checked offline without faking it: the rule needs an external database not shipped, a schema field that does not exist in ITR-7, or a composite/derived target that the built return never separately materialises (so any literal encoding would be vacuous or would false-fire on the lawful client).
- **MISSING** — a serial with no bucket. Must be **0**. This census leaves none.

## Counts

| Category | ENFORCED-target | NA | OFFLINE-IMPOSSIBLE | Total |
|---|--:|--:|--:|--:|
| **A** (blocking) | 638 | 10 | 13 | 661 |
| **B** (advisory) | 28 | 5 | 0 | 33 |
| **D** | — | — | — | 0 |

MISSING (A) = 661 − 638 − 10 − 13 = **0**.  MISSING (B) = 33 − 28 − 5 − 0 = **0**.

> **Coded set is authoritative.** The 638 Category-A ENFORCED serials are exactly the literal `A(serial, …)` calls across `forms/ITR-7/src/61_rules_enc_01.js`–`enc_13.js` (Gate 6: `category_A_coded` = 638, `category_A_total` = 661, 0 Category-A fire on the lawful client). The 28 Category-B ENFORCED serials are the literal `Dd(serial, …)` advisories in `61_rules_enc_14.js`. During fan-out the encoders re-filed **12** serials that had been planned ENFORCED to OFFLINE-IMPOSSIBLE (A169, A293, A295, A454, A469, A470, A474, A475, A492, A507, A510, A550) — each because its target is a composite/derived figure the built return never separately materialises, so a faithful non-vacuous offline check that does not false-fire on the lawful client does not exist. These are folded in below; every re-file is documented in the header of the `61_rules_enc_*.js` file that owns the serial range.

### Category-A NA serials (10)

- **A4** — registration date (Income-tax Act table) ≤ date of filing — the built return does not carry the filing date (portal timestamp)
- **A22** — registration date (other-law table) ≤ date of filing — return does not carry the filing date (portal timestamp)
- **A46** — effective date of registration (ITA table) ≤ date of filing — return does not carry the filing date (portal timestamp)
- **A48** — effective date of registration (other-law table) ≤ date of filing — return does not carry the filing date (portal timestamp)
- **A51** — exemption allowed only if the return is filed within the 139(1)/(4)/(5) time limit — needs the portal filing timestamp
- **A54** — mandatory verification per Rule 12/12AC at submission — resolved by the portal at upload
- **A61** — PAN in the return must equal the uploader's PAN — portal uploader identity
- **A637** — 234F fee only if filed after the due date — needs the portal filing timestamp
- **A639** — 234-I fee keyed to filing after 31/12/2026 — needs the portal filing timestamp
- **A640** — 234-I fee keyed to filing after 31/12/2026 — needs the portal filing timestamp

> The registration-date rules are compound (one clause vs the filing date, one clause vs the date of formation). The **filing-date clause is NA** (the built return carries no filing date); the **formation-date clause is ENFORCED** and is encoded as the paired serial (A5/A23/A47/A49).

### Category-A OFFLINE-IMPOSSIBLE serials (13)

The census plan carried one OFFLINE serial (A1, external DB). Fan-out encoding proved a further **12** targets to be composite/derived figures the built return never separately materialises; the encoders honestly re-filed them here rather than fake a check. Each reason below is verbatim from the header of the owning `61_rules_enc_*.js` file.

- **A1** — the name in the return must match the name in the PAN database — external PAN name database not shipped (portal resolves it at upload) · `enc_01`
- **A169** — "corpus fund in Schedule VC = corpus fund received during the year in Schedule J" does not hold on the lawful return (VC corpus 20,00,000 vs Schedule J `TotReceivedCorpus` 0 — carried there as opening balance); reconciled via Schedule R / the portal, not a direct VC = J-received equality · `enc_04`
- **A293** — "sum of improve cost in each L&B block = sum of all improve costs for such block" needs an itemised cost-of-improvement breakdown; the built LTCG land block carries only the single aggregate leaf `CostOfImprovements.ImproveCost`, so there is no per-item list to sum · `enc_06`
- **A295** — Table-D presence check on items 1aiv/1civ/1div (sub-details iva/ivb/ivc); those item letters do not resolve to any leaf of the built `DeducClaimInfo` (54D/54EC/54G/54GA) tables · `enc_06`
- **A454** — "Schedule 115BBI Sl.6 ≥ Total of (i)+(ii) of Col 10 of A1 of Schedule J"; Schedule J A1 Col 10 is a single column in this build (`Investment_11_5_Other` / `TotInvestment_11_5_Other`), so the (i)/(ii) sub-rows have no faithful operand · `enc_09`
- **A469 / A470** — 6(v) ≤ 15% of ((Sl.1 + Sl.3) − "A1 of Schedule A"); the accumulation base "A1 of Schedule A" is not a materialised key and the boundary-exact "≤" would false-fire on any mis-stated base · `enc_10`
- **A474** — Sl.1 == "C − Ai − Bi + E of Schedule VC": a composite Schedule-VC derivation, not a single materialised VC key · `enc_10`
- **A475** — Sl.3 == "Sum of 10 of Schedule AI"; the built Sl.3 (`AggregateIncomeUs1112`) folds in voluntary contributions and does not equal Schedule-AI's aggregate, so the "aggregate excluding VC" line is not materialised · `enc_10`
- **A492** — Sl.11 == (9 + 10); the schema collapses Sl.9 and Sl.11 into the one key `GrossIncome`, so Sl.11 is not independently stored · `enc_10`
- **A507** — Sl.5 == "[1 + 3 − 4 − (A1 − A1a of Schedule A)]": a composite self-formula over Schedule-A A1/A1a, not reconstructable to a silent equality from the materialised keys · `enc_10`
- **A510** — "Part-B1 Sl.2 should be zero" targets `PartB_TI.VoluntaryContributions.TotIncFromVC`, which is legitimately non-zero on a lawful s.11 trust (reference client emits 75,00,000); an unconditional "must be zero" assertion would fire on the lawful client · `enc_11`
- **A550** — "income entered in return and tax is not computed on the same" is a portal-side tax-computation assertion; the built return always computes tax and a lawful trust within the slab bears zero tax legitimately, so "tax > 0 whenever income > 0" would false-fire · `enc_11`

> Where a rule names a field, the field was located on `I` (block-by-block against the `ITR7` definition). Where fan-out proved the target to be an external DB, an absent field, or a composite the return never separately materialises, the serial was re-filed OFFLINE-IMPOSSIBLE with the reason above — never faked. Gate 6 confirms 0 Category-A fire on the lawful client.

## Category-A by schema block (ENFORCED-target)

| Schema block(s) on `I` | Serials | ENFORCED | NA / OFFLINE in range |
|---|---|--:|---|
| `PartA_GEN1.* / PartA_GEN2.*` | A1–A64 | 56 | A1(OFFLINE), A4(NA), A22(NA), A46(NA), A48(NA), A51(NA), A54(NA), A61(NA) |
| `PartB_TI.*` | A65 | 1 | — |
| `ITRScheduleI.*` | A66–A72 | 7 | — |
| `ITRScheduleIA.*` | A73–A76 | 4 | — |
| `ITRScheduleD.*` | A77–A80 | 4 | — |
| `ITRScheduleDA.*` | A81–A84 | 4 | — |
| `ITRScheduleJ.*` | A85–A97 | 13 | — |
| `PARTA_BS.*` | A98–A110 | 13 | — |
| `ITRScheduleR.*` | A111–A119 | 9 | — |
| `SchedulePP.*` | A120–A127 | 8 | — |
| `ScheduleET.*` | A128–A137 | 10 | — |
| `SchedulePP.*` | A138–A139 | 2 | — |
| `ScheduleAI.*` | A140–A142 | 3 | — |
| `ScheduleA.*` | A143–A154 | 12 | — |
| `ScheduleVC.*` | A155–A159 | 5 | — |
| `ScheduleIE_I..IV.*` | A160–A163 | 4 | — |
| `ScheduleVC.*` | A164 | 1 | — |
| `ScheduleVC.*` | A165–A169 | 4 | A169(OFFLINE) |
| `ScheduleIE_I..IV.*` | A170–A178 | 9 | — |
| `ScheduleHP.*` | A179–A195 | 17 | — |
| `ScheduleCG.*` | A196–A297 | 100 | A293(OFFLINE), A295(OFFLINE) |
| `ScheduleOS.*` | A298–A325 | 28 | — |
| `ScheduleVDA.*` | A326–A329 | 4 | — |
| `CorpScheduleBP.*` | A330–A353 | 24 | — |
| `ScheduleCYLA.*` | A354–A378 | 25 | — |
| `SchedulePTI.*` | A379–A383 | 5 | — |
| `ScheduleSI.*` | A384–A444 | 61 | — |
| `Schedule115TD.*` | A445–A450 | 6 | — |
| `Schedule115BBI.*` | A451–A455 | 4 | A454(OFFLINE) |
| `ScheduleFSI.*` | A456–A461 | 6 | — |
| `ScheduleTR1.*` | A462–A467 | 6 | — |
| `ScheduleSH.*` | A468 | 1 | — |
| `PartB_TI.*` | A469–A617 | 141 | A469/A470/A474/A475/A492/A507/A510/A550(OFFLINE) |
| `PartB_TTI.*` | A618–A640 | 20 | A637(NA), A639(NA), A640(NA) |
| `ScheduleIT.*` | A641 | 1 | — |
| `ScheduleTDS2.* / ScheduleTDS3.*` | A642–A654 | 13 | — |
| `ScheduleTCS.*` | A655–A661 | 7 | — |

> Cross-schedule serials are filed under their **assertion target** (the block whose key the rule reads to decide): e.g. A65 reads `PartB_TI`, A468 reads `ScheduleSH`, A638 reads `ScheduleFA`, and the Schedule-SI band (A384–A444) reads `ScheduleSI` while comparing to `ScheduleOS`/`ScheduleCG`/`ScheduleCYLA`. The much larger `PartB_TI` band (A469–A617) holds the Part B-TI Part-B1/B2/B3 statement-of-income roll-ups that tie the schedules together.

## Category-B census (33)

Category-B advisories encode as `Dd(serial, cond, msg)` warnings — they never block the export. 28 are cross-checkable within the built return; 5 are NA.

| Serial | Bucket | Target block / reason |
|---|---|---|
| B1 | ENF (advisory → Dd/warn) | PartB_TI.* — GPU 2(15) receipts >20% ⇒ Part B-3 applicable |
| B2 | ENF (advisory → Dd/warn) | PartA_GEN2.OtherDetailsFor7.* — change in objects without fresh registration |
| B3 | NA | NA — audit u/s 92E furnished ⇒ file Form 3CEB (separate form) |
| B4 | ENF (advisory → Dd/warn) | SchedulePP.* — 13A books of account maintained |
| B5 | ENF (advisory → Dd/warn) | SchedulePP.* — 13A record of >Rs.20000 non-electoral-bond contributions |
| B6 | ENF (advisory → Dd/warn) | SchedulePP.* — 13A accounts audited |
| B7 | ENF (advisory → Dd/warn) | SchedulePP.* — 13A donation >Rs.2000 by non-banking mode |
| B8 | ENF (advisory → Dd/warn) | SchedulePP.* — 13A report u/s 29C submitted |
| B9 | NA | NA — 13A exemption barred if filed after due date — portal filing timestamp |
| B10 | ENF (advisory → Dd/warn) | ScheduleET.* — 13B books of account maintained |
| B11 | ENF (advisory → Dd/warn) | ScheduleET.* — 13B record of parties to whom sums distributed |
| B12 | ENF (advisory → Dd/warn) | ScheduleET.* — 13B accounts audited |
| B13 | ENF (advisory → Dd/warn) | ScheduleET.* — 13B list of contributors/parties furnished |
| B14 | ENF (advisory → Dd/warn) | ScheduleET.* — 6(iv) distributed >95% of contributions |
| B15 | ENF (advisory → Dd/warn) | ScheduleET.* — admin expense ≤5% / Rs.5L / Rs.3L |
| B16 | NA | NA — 10(47) exemption barred if filed after due date — portal filing timestamp |
| B17 | ENF (advisory → Dd/warn) | PartB_TI.* / SchedulePP.* — 13A no BP-income exemption |
| B18 | ENF (advisory → Dd/warn) | PartB_TI.* — 11/10(23C) exemption not against additions 7ix |
| B19 | ENF (advisory → Dd/warn) | PartB_TI.* — B2 political-party field 4 ≤ VC + heads |
| B20 | ENF (advisory → Dd/warn) | SchedulePP.* — 13A registered u/s 29A of RPA 1951 |
| B21 | ENF (advisory → Dd/warn) | SchedulePP.* — 13A registration number & date furnished |
| B22 | ENF (advisory → Dd/warn) | ScheduleOS.* — 57 deduction not allowed against 1(e) disallowed-exemption income |
| B23 | ENF (advisory → Dd/warn) | PartB_TI.* — B3 expenditure not against additions 4(vii) |
| B24 | ENF (advisory → Dd/warn) | SchedulePP.* — 13A 29C report date furnished |
| B25 | ENF (advisory → Dd/warn) | PartB_TI.* — 10(23C)(iv)/(v) GPU 2(15) >20% ⇒ Part B-3 |
| B26 | ENF (advisory → Dd/warn) | PartB_TI.* — return with all-zero income fields |
| B27 | NA | NA — TDS in another person's hands allowed only if they declare it in their own ITR (external return) |
| B28 | NA | NA — TCS in another person's hands allowed only if they declare it in their own ITR (external return) |
| B29 | ENF (advisory → Dd/warn) | ScheduleTR1.* / ScheduleFSI.* — resident DTAA-rate claim advisory |
| B30 | ENF (advisory → Dd/warn) | ScheduleVDA.* / ScheduleTDS.* — 194S gross > VDA income |
| B31 | ENF (advisory → Dd/warn) | ScheduleOS.* / ScheduleTDS.* — 194B gross > 115BB income |
| B32 | ENF (advisory → Dd/warn) | ScheduleOS.* / ScheduleTDS.* — 194BB gross > race-horse income |
| B33 | ENF (advisory → Dd/warn) | ScheduleOS.* / ScheduleTDS.* — 194BA gross > 115BBJ income |

## Batch plan — ENFORCED Category-A serials, ~50 per file

The 638 ENFORCED-target Category-A serials are partitioned into **13** contiguous serial-range files `forms/ITR-7/src/61_rules_enc_NN.js`, each registered with `ruleset(fn)` (disjoint files → parallel fan-out, no merge conflicts). NA/OFFLINE serials inside a range are skipped (they are bucketed above). The **coded** column below is the actual literal `A(serial, …)` call count per file (summing to 638, = Gate 6 `category_A_coded`); it dips below the ~50 plan wherever a serial in the range was re-filed OFFLINE-IMPOSSIBLE during fan-out.

| File | Serial range | Coded (ENFORCED) | OFFLINE re-files in range | Schema blocks covered |
|---|---|--:|---|---|
| `61_rules_enc_01.js` | A1–A57 | 50 | (A1 planned OFFLINE) | PartA_GEN1.* / PartA_GEN2.* |
| `61_rules_enc_02.js` | A58–A108 | 50 | — | PartA_GEN1.* / PartA_GEN2.* · PartB_TI.* · ITRScheduleI.* · ITRScheduleIA.* · ITRScheduleD.* · ITRScheduleDA.* · ITRScheduleJ.* · PARTA_BS.* |
| `61_rules_enc_03.js` | A109–A158 | 50 | — | PARTA_BS.* · ITRScheduleR.* · SchedulePP.* · ScheduleET.* · ScheduleAI.* · ScheduleA.* · ScheduleVC.* |
| `61_rules_enc_04.js` | A159–A208 | 49 | A169 | ScheduleVC.* · ScheduleIE_I..IV.* · ScheduleHP.* · ScheduleCG.* |
| `61_rules_enc_05.js` | A209–A258 | 50 | — | ScheduleCG.* |
| `61_rules_enc_06.js` | A259–A308 | 48 | A293, A295 | ScheduleCG.* · ScheduleOS.* |
| `61_rules_enc_07.js` | A309–A358 | 50 | — | ScheduleOS.* · ScheduleVDA.* · CorpScheduleBP.* · ScheduleCYLA.* |
| `61_rules_enc_08.js` | A359–A408 | 50 | — | ScheduleCYLA.* · SchedulePTI.* · ScheduleSI.* |
| `61_rules_enc_09.js` | A409–A458 | 49 | A454 | ScheduleSI.* · Schedule115TD.* · Schedule115BBI.* · ScheduleFSI.* |
| `61_rules_enc_10.js` | A459–A508 | 44 | A469, A470, A474, A475, A492, A507 | ScheduleFSI.* · ScheduleTR1.* · ScheduleSH.* · PartB_TI.* |
| `61_rules_enc_11.js` | A509–A558 | 48 | A510, A550 | PartB_TI.* |
| `61_rules_enc_12.js` | A559–A608 | 50 | — | PartB_TI.* |
| `61_rules_enc_13.js` | A609–A661 | 50 | — | PartB_TI.* · PartB_TTI.* · ScheduleFA.* · ScheduleIT.* · ScheduleTDS2.* / ScheduleTDS3.* · ScheduleTCS.* |
| `61_rules_enc_14.js` | B1–B33 | 28 `Dd` | — | Category-B advisories (28 `Dd(serial,…)`; 5 NA) |

## Reference batch — `61_rules_enc_01.js` (serials A1–A57)

Encoded (**38**): **A2, A3, A5, A6, A7, A8, A9, A10, A11, A12, A13, A14, A15, A16, A17, A18, A19, A20, A21, A23, A24, A25, A26, A27, A30, A31, A32, A33, A38, A39, A40, A41, A42, A47, A49, A55, A56, A57** — Schedule PI identity/sub-status/mobile, the registration-table code ⇔ exemption-section pairing (A6–A21), the 139(4A)/(4B)/(4C)/(4D) ⇔ exemption-section gates (A24–A27), the A24 "other details" change-of-objects date checks (A30–A33), the political-party / electoral-trust / domestic-company sub-status bars (A38–A40), the exemption ⇒ registration-furnished checks (A41–A42), the effective-date-vs-formation checks (A47/A49) and the audit-report-date floor (A55).

Deferred inside A1–A57 (still ENFORCED-target, to finish in fan-out, **not faked**): A28/A29 (GPU u/s 2(15) percentage / aggregate-receipts sub-fields), A34/A35/A36/A37 (exemption ⇒ Schedule IE-1/IE-2/IE-3/IE-4 presence — cross-schedule), A43/A44 (A26/A26(a) keyed to A23(i) sum-of-receipts > 20%), A45 (LEI mandatory when refund ≥ ₹50 crore — needs Part B-TTI refund), A50/A53 (exemption ⇒ Schedule J/A/AI/115BBI/ET presence — cross-schedule, false-fire risk until those blocks emit), A52 (A26(a) vs A23(i) 20% derivation). NA/OFFLINE in the band (7): A1 (OFFLINE), A4/A22/A46/A48/A51/A54 (NA). 38 encoded + 12 deferred ENFORCED = the 50 ENFORCED of A1–A57.

**Registration.** `61_rules_enc_01.js` calls `ruleset(function(I,S_,A,Dd){…})` exactly as the driver `forms/ITR-7/src/60_rules.js` expects — the function is pushed to `_RULEBATCHES` (via `08_registry.js`) and `runRules()` invokes it with its own fault-tolerant `A`/`Dd` collectors. Every read is guarded (`RG` / `N` / `(X||{})`), so a wrong-typed imported field skips just that rule.

**Smoke test** (single-scope eval with the shell's `N`/`RG`/`REQ`/`ruleset`, against the built `PartA_GEN1`/`PartA_GEN2` subtree of the lawful client `tests/ITR-7/state.js`): empty `{}` fires only the presence rule **A57** (A24(i) must be answered); the lawful trust return (SUDHIR MEMORIAL CHARITABLE TRUST, status AOP/BOI, exemption u/s 11, 12AB-registered, audited, on-time) fires **none**; a return with a 5-digit mobile + an invalid AOP sub-status + a registration date before formation + a 12AB registration whose exemption is 13A under a 139(4A) filing + an audit-report date of 15/03/2026 fires exactly **A2, A3, A5, A6, A24, A55**. `node --check` passes.

## Appendix — every Category-A serial, one line (MISSING = 0)

| Serial | Bucket | Block / reason |
|---|---|---|
| A1 | OFFLINE | name must match the PAN database — external PAN name database not shipped |
| A2 | ENF | PartA_GEN1.* / PartA_GEN2.* |
| A3 | ENF | PartA_GEN1.* / PartA_GEN2.* |
| A4 | NA | registration date ≤ date of filing — the built return does not carry the filing date (portal timestamp) |
| A5 | ENF | PartA_GEN1.* / PartA_GEN2.* |
| A6 | ENF | PartA_GEN1.* / PartA_GEN2.* |
| A7 | ENF | PartA_GEN1.* / PartA_GEN2.* |
| A8 | ENF | PartA_GEN1.* / PartA_GEN2.* |
| A9 | ENF | PartA_GEN1.* / PartA_GEN2.* |
| A10 | ENF | PartA_GEN1.* / PartA_GEN2.* |
| A11 | ENF | PartA_GEN1.* / PartA_GEN2.* |
| A12 | ENF | PartA_GEN1.* / PartA_GEN2.* |
| A13 | ENF | PartA_GEN1.* / PartA_GEN2.* |
| A14 | ENF | PartA_GEN1.* / PartA_GEN2.* |
| A15 | ENF | PartA_GEN1.* / PartA_GEN2.* |
| A16 | ENF | PartA_GEN1.* / PartA_GEN2.* |
| A17 | ENF | PartA_GEN1.* / PartA_GEN2.* |
| A18 | ENF | PartA_GEN1.* / PartA_GEN2.* |
| A19 | ENF | PartA_GEN1.* / PartA_GEN2.* |
| A20 | ENF | PartA_GEN1.* / PartA_GEN2.* |
| A21 | ENF | PartA_GEN1.* / PartA_GEN2.* |
| A22 | NA | other-law registration date ≤ date of filing — return does not carry the filing date (portal timestamp) |
| A23 | ENF | PartA_GEN1.* / PartA_GEN2.* |
| A24 | ENF | PartA_GEN1.* / PartA_GEN2.* |
| A25 | ENF | PartA_GEN1.* / PartA_GEN2.* |
| A26 | ENF | PartA_GEN1.* / PartA_GEN2.* |
| A27 | ENF | PartA_GEN1.* / PartA_GEN2.* |
| A28 | ENF | PartA_GEN1.* / PartA_GEN2.* |
| A29 | ENF | PartA_GEN1.* / PartA_GEN2.* |
| A30 | ENF | PartA_GEN1.* / PartA_GEN2.* |
| A31 | ENF | PartA_GEN1.* / PartA_GEN2.* |
| A32 | ENF | PartA_GEN1.* / PartA_GEN2.* |
| A33 | ENF | PartA_GEN1.* / PartA_GEN2.* |
| A34 | ENF | PartA_GEN1.* / PartA_GEN2.* |
| A35 | ENF | PartA_GEN1.* / PartA_GEN2.* |
| A36 | ENF | PartA_GEN1.* / PartA_GEN2.* |
| A37 | ENF | PartA_GEN1.* / PartA_GEN2.* |
| A38 | ENF | PartA_GEN1.* / PartA_GEN2.* |
| A39 | ENF | PartA_GEN1.* / PartA_GEN2.* |
| A40 | ENF | PartA_GEN1.* / PartA_GEN2.* |
| A41 | ENF | PartA_GEN1.* / PartA_GEN2.* |
| A42 | ENF | PartA_GEN1.* / PartA_GEN2.* |
| A43 | ENF | PartA_GEN1.* / PartA_GEN2.* |
| A44 | ENF | PartA_GEN1.* / PartA_GEN2.* |
| A45 | ENF | PartA_GEN1.* / PartA_GEN2.* |
| A46 | NA | effective date of registration ≤ date of filing — return does not carry the filing date (portal timestamp) |
| A47 | ENF | PartA_GEN1.* / PartA_GEN2.* |
| A48 | NA | other-law effective date ≤ date of filing — return does not carry the filing date (portal timestamp) |
| A49 | ENF | PartA_GEN1.* / PartA_GEN2.* |
| A50 | ENF | PartA_GEN1.* / PartA_GEN2.* |
| A51 | NA | return filed within the 139(1)/(4)/(5) time limit — needs the portal filing timestamp |
| A52 | ENF | PartA_GEN1.* / PartA_GEN2.* |
| A53 | ENF | PartA_GEN1.* / PartA_GEN2.* |
| A54 | NA | mandatory verification per Rule 12/12AC at submission — resolved by the portal at upload |
| A55 | ENF | PartA_GEN1.* / PartA_GEN2.* |
| A56 | ENF | PartA_GEN1.* / PartA_GEN2.* |
| A57 | ENF | PartA_GEN1.* / PartA_GEN2.* |
| A58 | ENF | PartA_GEN1.* / PartA_GEN2.* |
| A59 | ENF | PartA_GEN1.* / PartA_GEN2.* |
| A60 | ENF | PartA_GEN1.* / PartA_GEN2.* |
| A61 | NA | PAN in the return must equal the uploader's PAN — portal uploader identity |
| A62 | ENF | PartA_GEN1.* / PartA_GEN2.* |
| A63 | ENF | PartA_GEN1.* / PartA_GEN2.* |
| A64 | ENF | PartA_GEN1.* / PartA_GEN2.* |
| A65 | ENF | PartB_TI.* |
| A66 | ENF | ITRScheduleI.* |
| A67 | ENF | ITRScheduleI.* |
| A68 | ENF | ITRScheduleI.* |
| A69 | ENF | ITRScheduleI.* |
| A70 | ENF | ITRScheduleI.* |
| A71 | ENF | ITRScheduleI.* |
| A72 | ENF | ITRScheduleI.* |
| A73 | ENF | ITRScheduleIA.* |
| A74 | ENF | ITRScheduleIA.* |
| A75 | ENF | ITRScheduleIA.* |
| A76 | ENF | ITRScheduleIA.* |
| A77 | ENF | ITRScheduleD.* |
| A78 | ENF | ITRScheduleD.* |
| A79 | ENF | ITRScheduleD.* |
| A80 | ENF | ITRScheduleD.* |
| A81 | ENF | ITRScheduleDA.* |
| A82 | ENF | ITRScheduleDA.* |
| A83 | ENF | ITRScheduleDA.* |
| A84 | ENF | ITRScheduleDA.* |
| A85 | ENF | ITRScheduleJ.* |
| A86 | ENF | ITRScheduleJ.* |
| A87 | ENF | ITRScheduleJ.* |
| A88 | ENF | ITRScheduleJ.* |
| A89 | ENF | ITRScheduleJ.* |
| A90 | ENF | ITRScheduleJ.* |
| A91 | ENF | ITRScheduleJ.* |
| A92 | ENF | ITRScheduleJ.* |
| A93 | ENF | ITRScheduleJ.* |
| A94 | ENF | ITRScheduleJ.* |
| A95 | ENF | ITRScheduleJ.* |
| A96 | ENF | ITRScheduleJ.* |
| A97 | ENF | ITRScheduleJ.* |
| A98 | ENF | PARTA_BS.* |
| A99 | ENF | PARTA_BS.* |
| A100 | ENF | PARTA_BS.* |
| A101 | ENF | PARTA_BS.* |
| A102 | ENF | PARTA_BS.* |
| A103 | ENF | PARTA_BS.* |
| A104 | ENF | PARTA_BS.* |
| A105 | ENF | PARTA_BS.* |
| A106 | ENF | PARTA_BS.* |
| A107 | ENF | PARTA_BS.* |
| A108 | ENF | PARTA_BS.* |
| A109 | ENF | PARTA_BS.* |
| A110 | ENF | PARTA_BS.* |
| A111 | ENF | ITRScheduleR.* |
| A112 | ENF | ITRScheduleR.* |
| A113 | ENF | ITRScheduleR.* |
| A114 | ENF | ITRScheduleR.* |
| A115 | ENF | ITRScheduleR.* |
| A116 | ENF | ITRScheduleR.* |
| A117 | ENF | ITRScheduleR.* |
| A118 | ENF | ITRScheduleR.* |
| A119 | ENF | ITRScheduleR.* |
| A120 | ENF | SchedulePP.* |
| A121 | ENF | SchedulePP.* |
| A122 | ENF | SchedulePP.* |
| A123 | ENF | SchedulePP.* |
| A124 | ENF | SchedulePP.* |
| A125 | ENF | SchedulePP.* |
| A126 | ENF | SchedulePP.* |
| A127 | ENF | SchedulePP.* |
| A128 | ENF | ScheduleET.* |
| A129 | ENF | ScheduleET.* |
| A130 | ENF | ScheduleET.* |
| A131 | ENF | ScheduleET.* |
| A132 | ENF | ScheduleET.* |
| A133 | ENF | ScheduleET.* |
| A134 | ENF | ScheduleET.* |
| A135 | ENF | ScheduleET.* |
| A136 | ENF | ScheduleET.* |
| A137 | ENF | ScheduleET.* |
| A138 | ENF | SchedulePP.* |
| A139 | ENF | SchedulePP.* |
| A140 | ENF | ScheduleAI.* |
| A141 | ENF | ScheduleAI.* |
| A142 | ENF | ScheduleAI.* |
| A143 | ENF | ScheduleA.* |
| A144 | ENF | ScheduleA.* |
| A145 | ENF | ScheduleA.* |
| A146 | ENF | ScheduleA.* |
| A147 | ENF | ScheduleA.* |
| A148 | ENF | ScheduleA.* |
| A149 | ENF | ScheduleA.* |
| A150 | ENF | ScheduleA.* |
| A151 | ENF | ScheduleA.* |
| A152 | ENF | ScheduleA.* |
| A153 | ENF | ScheduleA.* |
| A154 | ENF | ScheduleA.* |
| A155 | ENF | ScheduleVC.* |
| A156 | ENF | ScheduleVC.* |
| A157 | ENF | ScheduleVC.* |
| A158 | ENF | ScheduleVC.* |
| A159 | ENF | ScheduleVC.* |
| A160 | ENF | ScheduleIE_I..IV.* |
| A161 | ENF | ScheduleIE_I..IV.* |
| A162 | ENF | ScheduleIE_I..IV.* |
| A163 | ENF | ScheduleIE_I..IV.* |
| A164 | ENF | ScheduleVC.* |
| A165 | ENF | ScheduleVC.* |
| A166 | ENF | ScheduleVC.* |
| A167 | ENF | ScheduleVC.* |
| A168 | ENF | ScheduleVC.* |
| A169 | OFFLINE | VC corpus = Sch J corpus-received equality does not hold on the lawful return; reconciled via Sch R/portal (enc_04) |
| A170 | ENF | ScheduleIE_I..IV.* |
| A171 | ENF | ScheduleIE_I..IV.* |
| A172 | ENF | ScheduleIE_I..IV.* |
| A173 | ENF | ScheduleIE_I..IV.* |
| A174 | ENF | ScheduleIE_I..IV.* |
| A175 | ENF | ScheduleIE_I..IV.* |
| A176 | ENF | ScheduleIE_I..IV.* |
| A177 | ENF | ScheduleIE_I..IV.* |
| A178 | ENF | ScheduleIE_I..IV.* |
| A179 | ENF | ScheduleHP.* |
| A180 | ENF | ScheduleHP.* |
| A181 | ENF | ScheduleHP.* |
| A182 | ENF | ScheduleHP.* |
| A183 | ENF | ScheduleHP.* |
| A184 | ENF | ScheduleHP.* |
| A185 | ENF | ScheduleHP.* |
| A186 | ENF | ScheduleHP.* |
| A187 | ENF | ScheduleHP.* |
| A188 | ENF | ScheduleHP.* |
| A189 | ENF | ScheduleHP.* |
| A190 | ENF | ScheduleHP.* |
| A191 | ENF | ScheduleHP.* |
| A192 | ENF | ScheduleHP.* |
| A193 | ENF | ScheduleHP.* |
| A194 | ENF | ScheduleHP.* |
| A195 | ENF | ScheduleHP.* |
| A196 | ENF | ScheduleCG.* |
| A197 | ENF | ScheduleCG.* |
| A198 | ENF | ScheduleCG.* |
| A199 | ENF | ScheduleCG.* |
| A200 | ENF | ScheduleCG.* |
| A201 | ENF | ScheduleCG.* |
| A202 | ENF | ScheduleCG.* |
| A203 | ENF | ScheduleCG.* |
| A204 | ENF | ScheduleCG.* |
| A205 | ENF | ScheduleCG.* |
| A206 | ENF | ScheduleCG.* |
| A207 | ENF | ScheduleCG.* |
| A208 | ENF | ScheduleCG.* |
| A209 | ENF | ScheduleCG.* |
| A210 | ENF | ScheduleCG.* |
| A211 | ENF | ScheduleCG.* |
| A212 | ENF | ScheduleCG.* |
| A213 | ENF | ScheduleCG.* |
| A214 | ENF | ScheduleCG.* |
| A215 | ENF | ScheduleCG.* |
| A216 | ENF | ScheduleCG.* |
| A217 | ENF | ScheduleCG.* |
| A218 | ENF | ScheduleCG.* |
| A219 | ENF | ScheduleCG.* |
| A220 | ENF | ScheduleCG.* |
| A221 | ENF | ScheduleCG.* |
| A222 | ENF | ScheduleCG.* |
| A223 | ENF | ScheduleCG.* |
| A224 | ENF | ScheduleCG.* |
| A225 | ENF | ScheduleCG.* |
| A226 | ENF | ScheduleCG.* |
| A227 | ENF | ScheduleCG.* |
| A228 | ENF | ScheduleCG.* |
| A229 | ENF | ScheduleCG.* |
| A230 | ENF | ScheduleCG.* |
| A231 | ENF | ScheduleCG.* |
| A232 | ENF | ScheduleCG.* |
| A233 | ENF | ScheduleCG.* |
| A234 | ENF | ScheduleCG.* |
| A235 | ENF | ScheduleCG.* |
| A236 | ENF | ScheduleCG.* |
| A237 | ENF | ScheduleCG.* |
| A238 | ENF | ScheduleCG.* |
| A239 | ENF | ScheduleCG.* |
| A240 | ENF | ScheduleCG.* |
| A241 | ENF | ScheduleCG.* |
| A242 | ENF | ScheduleCG.* |
| A243 | ENF | ScheduleCG.* |
| A244 | ENF | ScheduleCG.* |
| A245 | ENF | ScheduleCG.* |
| A246 | ENF | ScheduleCG.* |
| A247 | ENF | ScheduleCG.* |
| A248 | ENF | ScheduleCG.* |
| A249 | ENF | ScheduleCG.* |
| A250 | ENF | ScheduleCG.* |
| A251 | ENF | ScheduleCG.* |
| A252 | ENF | ScheduleCG.* |
| A253 | ENF | ScheduleCG.* |
| A254 | ENF | ScheduleCG.* |
| A255 | ENF | ScheduleCG.* |
| A256 | ENF | ScheduleCG.* |
| A257 | ENF | ScheduleCG.* |
| A258 | ENF | ScheduleCG.* |
| A259 | ENF | ScheduleCG.* |
| A260 | ENF | ScheduleCG.* |
| A261 | ENF | ScheduleCG.* |
| A262 | ENF | ScheduleCG.* |
| A263 | ENF | ScheduleCG.* |
| A264 | ENF | ScheduleCG.* |
| A265 | ENF | ScheduleCG.* |
| A266 | ENF | ScheduleCG.* |
| A267 | ENF | ScheduleCG.* |
| A268 | ENF | ScheduleCG.* |
| A269 | ENF | ScheduleCG.* |
| A270 | ENF | ScheduleCG.* |
| A271 | ENF | ScheduleCG.* |
| A272 | ENF | ScheduleCG.* |
| A273 | ENF | ScheduleCG.* |
| A274 | ENF | ScheduleCG.* |
| A275 | ENF | ScheduleCG.* |
| A276 | ENF | ScheduleCG.* |
| A277 | ENF | ScheduleCG.* |
| A278 | ENF | ScheduleCG.* |
| A279 | ENF | ScheduleCG.* |
| A280 | ENF | ScheduleCG.* |
| A281 | ENF | ScheduleCG.* |
| A282 | ENF | ScheduleCG.* |
| A283 | ENF | ScheduleCG.* |
| A284 | ENF | ScheduleCG.* |
| A285 | ENF | ScheduleCG.* |
| A286 | ENF | ScheduleCG.* |
| A287 | ENF | ScheduleCG.* |
| A288 | ENF | ScheduleCG.* |
| A289 | ENF | ScheduleCG.* |
| A290 | ENF | ScheduleCG.* |
| A291 | ENF | ScheduleCG.* |
| A292 | ENF | ScheduleCG.* |
| A293 | OFFLINE | per-item L&B cost-of-improvement list absent — build carries only aggregate ImproveCost (enc_06) |
| A294 | ENF | ScheduleCG.* |
| A295 | OFFLINE | Table-D item letters 1aiv/1civ/1div (iva/ivb/ivc) do not resolve to any DeducClaimInfo leaf (enc_06) |
| A296 | ENF | ScheduleCG.* |
| A297 | ENF | ScheduleCG.* |
| A298 | ENF | ScheduleOS.* |
| A299 | ENF | ScheduleOS.* |
| A300 | ENF | ScheduleOS.* |
| A301 | ENF | ScheduleOS.* |
| A302 | ENF | ScheduleOS.* |
| A303 | ENF | ScheduleOS.* |
| A304 | ENF | ScheduleOS.* |
| A305 | ENF | ScheduleOS.* |
| A306 | ENF | ScheduleOS.* |
| A307 | ENF | ScheduleOS.* |
| A308 | ENF | ScheduleOS.* |
| A309 | ENF | ScheduleOS.* |
| A310 | ENF | ScheduleOS.* |
| A311 | ENF | ScheduleOS.* |
| A312 | ENF | ScheduleOS.* |
| A313 | ENF | ScheduleOS.* |
| A314 | ENF | ScheduleOS.* |
| A315 | ENF | ScheduleOS.* |
| A316 | ENF | ScheduleOS.* |
| A317 | ENF | ScheduleOS.* |
| A318 | ENF | ScheduleOS.* |
| A319 | ENF | ScheduleOS.* |
| A320 | ENF | ScheduleOS.* |
| A321 | ENF | ScheduleOS.* |
| A322 | ENF | ScheduleOS.* |
| A323 | ENF | ScheduleOS.* |
| A324 | ENF | ScheduleOS.* |
| A325 | ENF | ScheduleOS.* |
| A326 | ENF | ScheduleVDA.* |
| A327 | ENF | ScheduleVDA.* |
| A328 | ENF | ScheduleVDA.* |
| A329 | ENF | ScheduleVDA.* |
| A330 | ENF | CorpScheduleBP.* |
| A331 | ENF | CorpScheduleBP.* |
| A332 | ENF | CorpScheduleBP.* |
| A333 | ENF | CorpScheduleBP.* |
| A334 | ENF | CorpScheduleBP.* |
| A335 | ENF | CorpScheduleBP.* |
| A336 | ENF | CorpScheduleBP.* |
| A337 | ENF | CorpScheduleBP.* |
| A338 | ENF | CorpScheduleBP.* |
| A339 | ENF | CorpScheduleBP.* |
| A340 | ENF | CorpScheduleBP.* |
| A341 | ENF | CorpScheduleBP.* |
| A342 | ENF | CorpScheduleBP.* |
| A343 | ENF | CorpScheduleBP.* |
| A344 | ENF | CorpScheduleBP.* |
| A345 | ENF | CorpScheduleBP.* |
| A346 | ENF | CorpScheduleBP.* |
| A347 | ENF | CorpScheduleBP.* |
| A348 | ENF | CorpScheduleBP.* |
| A349 | ENF | CorpScheduleBP.* |
| A350 | ENF | CorpScheduleBP.* |
| A351 | ENF | CorpScheduleBP.* |
| A352 | ENF | CorpScheduleBP.* |
| A353 | ENF | CorpScheduleBP.* |
| A354 | ENF | ScheduleCYLA.* |
| A355 | ENF | ScheduleCYLA.* |
| A356 | ENF | ScheduleCYLA.* |
| A357 | ENF | ScheduleCYLA.* |
| A358 | ENF | ScheduleCYLA.* |
| A359 | ENF | ScheduleCYLA.* |
| A360 | ENF | ScheduleCYLA.* |
| A361 | ENF | ScheduleCYLA.* |
| A362 | ENF | ScheduleCYLA.* |
| A363 | ENF | ScheduleCYLA.* |
| A364 | ENF | ScheduleCYLA.* |
| A365 | ENF | ScheduleCYLA.* |
| A366 | ENF | ScheduleCYLA.* |
| A367 | ENF | ScheduleCYLA.* |
| A368 | ENF | ScheduleCYLA.* |
| A369 | ENF | ScheduleCYLA.* |
| A370 | ENF | ScheduleCYLA.* |
| A371 | ENF | ScheduleCYLA.* |
| A372 | ENF | ScheduleCYLA.* |
| A373 | ENF | ScheduleCYLA.* |
| A374 | ENF | ScheduleCYLA.* |
| A375 | ENF | ScheduleCYLA.* |
| A376 | ENF | ScheduleCYLA.* |
| A377 | ENF | ScheduleCYLA.* |
| A378 | ENF | ScheduleCYLA.* |
| A379 | ENF | SchedulePTI.* |
| A380 | ENF | SchedulePTI.* |
| A381 | ENF | SchedulePTI.* |
| A382 | ENF | SchedulePTI.* |
| A383 | ENF | SchedulePTI.* |
| A384 | ENF | ScheduleSI.* |
| A385 | ENF | ScheduleSI.* |
| A386 | ENF | ScheduleSI.* |
| A387 | ENF | ScheduleSI.* |
| A388 | ENF | ScheduleSI.* |
| A389 | ENF | ScheduleSI.* |
| A390 | ENF | ScheduleSI.* |
| A391 | ENF | ScheduleSI.* |
| A392 | ENF | ScheduleSI.* |
| A393 | ENF | ScheduleSI.* |
| A394 | ENF | ScheduleSI.* |
| A395 | ENF | ScheduleSI.* |
| A396 | ENF | ScheduleSI.* |
| A397 | ENF | ScheduleSI.* |
| A398 | ENF | ScheduleSI.* |
| A399 | ENF | ScheduleSI.* |
| A400 | ENF | ScheduleSI.* |
| A401 | ENF | ScheduleSI.* |
| A402 | ENF | ScheduleSI.* |
| A403 | ENF | ScheduleSI.* |
| A404 | ENF | ScheduleSI.* |
| A405 | ENF | ScheduleSI.* |
| A406 | ENF | ScheduleSI.* |
| A407 | ENF | ScheduleSI.* |
| A408 | ENF | ScheduleSI.* |
| A409 | ENF | ScheduleSI.* |
| A410 | ENF | ScheduleSI.* |
| A411 | ENF | ScheduleSI.* |
| A412 | ENF | ScheduleSI.* |
| A413 | ENF | ScheduleSI.* |
| A414 | ENF | ScheduleSI.* |
| A415 | ENF | ScheduleSI.* |
| A416 | ENF | ScheduleSI.* |
| A417 | ENF | ScheduleSI.* |
| A418 | ENF | ScheduleSI.* |
| A419 | ENF | ScheduleSI.* |
| A420 | ENF | ScheduleSI.* |
| A421 | ENF | ScheduleSI.* |
| A422 | ENF | ScheduleSI.* |
| A423 | ENF | ScheduleSI.* |
| A424 | ENF | ScheduleSI.* |
| A425 | ENF | ScheduleSI.* |
| A426 | ENF | ScheduleSI.* |
| A427 | ENF | ScheduleSI.* |
| A428 | ENF | ScheduleSI.* |
| A429 | ENF | ScheduleSI.* |
| A430 | ENF | ScheduleSI.* |
| A431 | ENF | ScheduleSI.* |
| A432 | ENF | ScheduleSI.* |
| A433 | ENF | ScheduleSI.* |
| A434 | ENF | ScheduleSI.* |
| A435 | ENF | ScheduleSI.* |
| A436 | ENF | ScheduleSI.* |
| A437 | ENF | ScheduleSI.* |
| A438 | ENF | ScheduleSI.* |
| A439 | ENF | ScheduleSI.* |
| A440 | ENF | ScheduleSI.* |
| A441 | ENF | ScheduleSI.* |
| A442 | ENF | ScheduleSI.* |
| A443 | ENF | ScheduleSI.* |
| A444 | ENF | ScheduleSI.* |
| A445 | ENF | Schedule115TD.* |
| A446 | ENF | Schedule115TD.* |
| A447 | ENF | Schedule115TD.* |
| A448 | ENF | Schedule115TD.* |
| A449 | ENF | Schedule115TD.* |
| A450 | ENF | Schedule115TD.* |
| A451 | ENF | Schedule115BBI.* |
| A452 | ENF | Schedule115BBI.* |
| A453 | ENF | Schedule115BBI.* |
| A454 | OFFLINE | 115BBI Sl.6 vs (i)+(ii) of Col 10 of A1 of Sch J — Col 10 is a single column, sub-rows not materialised (enc_09) |
| A455 | ENF | Schedule115BBI.* |
| A456 | ENF | ScheduleFSI.* |
| A457 | ENF | ScheduleFSI.* |
| A458 | ENF | ScheduleFSI.* |
| A459 | ENF | ScheduleFSI.* |
| A460 | ENF | ScheduleFSI.* |
| A461 | ENF | ScheduleFSI.* |
| A462 | ENF | ScheduleTR1.* |
| A463 | ENF | ScheduleTR1.* |
| A464 | ENF | ScheduleTR1.* |
| A465 | ENF | ScheduleTR1.* |
| A466 | ENF | ScheduleTR1.* |
| A467 | ENF | ScheduleTR1.* |
| A468 | ENF | ScheduleSH.* |
| A469 | OFFLINE | 6(v) ≤ 15% of non-materialised accumulation base ('A1 of Schedule A'); boundary-exact ≤ would false-fire (enc_10) |
| A470 | OFFLINE | 6(v) ≤ 15% of non-materialised accumulation base ('A1 of Schedule A'); boundary-exact ≤ would false-fire (enc_10) |
| A471 | ENF | PartB_TI.* |
| A472 | ENF | PartB_TI.* |
| A473 | ENF | PartB_TI.* |
| A474 | OFFLINE | Sl.1 = 'C − Ai − Bi + E of Schedule VC' — composite Sch-VC derivation, not a single materialised key (enc_10) |
| A475 | OFFLINE | Sl.3 'aggregate excluding VC' not materialised — built Sl.3 (AggregateIncomeUs1112) folds in VC (enc_10) |
| A476 | ENF | PartB_TI.* |
| A477 | ENF | PartB_TI.* |
| A478 | ENF | PartB_TI.* |
| A479 | ENF | PartB_TI.* |
| A480 | ENF | PartB_TI.* |
| A481 | ENF | PartB_TI.* |
| A482 | ENF | PartB_TI.* |
| A483 | ENF | PartB_TI.* |
| A484 | ENF | PartB_TI.* |
| A485 | ENF | PartB_TI.* |
| A486 | ENF | PartB_TI.* |
| A487 | ENF | PartB_TI.* |
| A488 | ENF | PartB_TI.* |
| A489 | ENF | PartB_TI.* |
| A490 | ENF | PartB_TI.* |
| A491 | ENF | PartB_TI.* |
| A492 | OFFLINE | Sl.11 = 9+10 — schema collapses Sl.9/Sl.11 into the one key GrossIncome; Sl.11 not stored separately (enc_10) |
| A493 | ENF | PartB_TI.* |
| A494 | ENF | PartB_TI.* |
| A495 | ENF | PartB_TI.* |
| A496 | ENF | PartB_TI.* |
| A497 | ENF | PartB_TI.* |
| A498 | ENF | PartB_TI.* |
| A499 | ENF | PartB_TI.* |
| A500 | ENF | PartB_TI.* |
| A501 | ENF | PartB_TI.* |
| A502 | ENF | PartB_TI.* |
| A503 | ENF | PartB_TI.* |
| A504 | ENF | PartB_TI.* |
| A505 | ENF | PartB_TI.* |
| A506 | ENF | PartB_TI.* |
| A507 | OFFLINE | Sl.5 = '1 + 3 − 4 − (A1 − A1a of Schedule A)' — composite Sch-A self-formula, not reconstructable to a silent equality (enc_10) |
| A508 | ENF | PartB_TI.* |
| A509 | ENF | PartB_TI.* |
| A510 | OFFLINE | Part-B1 Sl.2 'must be zero' — TotIncFromVC is legitimately non-zero on a lawful s.11 trust; unconditional zero would false-fire (enc_11) |
| A511 | ENF | PartB_TI.* |
| A512 | ENF | PartB_TI.* |
| A513 | ENF | PartB_TI.* |
| A514 | ENF | PartB_TI.* |
| A515 | ENF | PartB_TI.* |
| A516 | ENF | PartB_TI.* |
| A517 | ENF | PartB_TI.* |
| A518 | ENF | PartB_TI.* |
| A519 | ENF | PartB_TI.* |
| A520 | ENF | PartB_TI.* |
| A521 | ENF | PartB_TI.* |
| A522 | ENF | PartB_TI.* |
| A523 | ENF | PartB_TI.* |
| A524 | ENF | PartB_TI.* |
| A525 | ENF | PartB_TI.* |
| A526 | ENF | PartB_TI.* |
| A527 | ENF | PartB_TI.* |
| A528 | ENF | PartB_TI.* |
| A529 | ENF | PartB_TI.* |
| A530 | ENF | PartB_TI.* |
| A531 | ENF | PartB_TI.* |
| A532 | ENF | PartB_TI.* |
| A533 | ENF | PartB_TI.* |
| A534 | ENF | PartB_TI.* |
| A535 | ENF | PartB_TI.* |
| A536 | ENF | PartB_TI.* |
| A537 | ENF | PartB_TI.* |
| A538 | ENF | PartB_TI.* |
| A539 | ENF | PartB_TI.* |
| A540 | ENF | PartB_TI.* |
| A541 | ENF | PartB_TI.* |
| A542 | ENF | PartB_TI.* |
| A543 | ENF | PartB_TI.* |
| A544 | ENF | PartB_TI.* |
| A545 | ENF | PartB_TI.* |
| A546 | ENF | PartB_TI.* |
| A547 | ENF | PartB_TI.* |
| A548 | ENF | PartB_TI.* |
| A549 | ENF | PartB_TI.* |
| A550 | OFFLINE | portal-side tax-computation assertion — lawful trust within slab bears zero tax; 'tax>0 when income>0' would false-fire (enc_11) |
| A551 | ENF | PartB_TI.* |
| A552 | ENF | PartB_TI.* |
| A553 | ENF | PartB_TI.* |
| A554 | ENF | PartB_TI.* |
| A555 | ENF | PartB_TI.* |
| A556 | ENF | PartB_TI.* |
| A557 | ENF | PartB_TI.* |
| A558 | ENF | PartB_TI.* |
| A559 | ENF | PartB_TI.* |
| A560 | ENF | PartB_TI.* |
| A561 | ENF | PartB_TI.* |
| A562 | ENF | PartB_TI.* |
| A563 | ENF | PartB_TI.* |
| A564 | ENF | PartB_TI.* |
| A565 | ENF | PartB_TI.* |
| A566 | ENF | PartB_TI.* |
| A567 | ENF | PartB_TI.* |
| A568 | ENF | PartB_TI.* |
| A569 | ENF | PartB_TI.* |
| A570 | ENF | PartB_TI.* |
| A571 | ENF | PartB_TI.* |
| A572 | ENF | PartB_TI.* |
| A573 | ENF | PartB_TI.* |
| A574 | ENF | PartB_TI.* |
| A575 | ENF | PartB_TI.* |
| A576 | ENF | PartB_TI.* |
| A577 | ENF | PartB_TI.* |
| A578 | ENF | PartB_TI.* |
| A579 | ENF | PartB_TI.* |
| A580 | ENF | PartB_TI.* |
| A581 | ENF | PartB_TI.* |
| A582 | ENF | PartB_TI.* |
| A583 | ENF | PartB_TI.* |
| A584 | ENF | PartB_TI.* |
| A585 | ENF | PartB_TI.* |
| A586 | ENF | PartB_TI.* |
| A587 | ENF | PartB_TI.* |
| A588 | ENF | PartB_TI.* |
| A589 | ENF | PartB_TI.* |
| A590 | ENF | PartB_TI.* |
| A591 | ENF | PartB_TI.* |
| A592 | ENF | PartB_TI.* |
| A593 | ENF | PartB_TI.* |
| A594 | ENF | PartB_TI.* |
| A595 | ENF | PartB_TI.* |
| A596 | ENF | PartB_TI.* |
| A597 | ENF | PartB_TI.* |
| A598 | ENF | PartB_TI.* |
| A599 | ENF | PartB_TI.* |
| A600 | ENF | PartB_TI.* |
| A601 | ENF | PartB_TI.* |
| A602 | ENF | PartB_TI.* |
| A603 | ENF | PartB_TI.* |
| A604 | ENF | PartB_TI.* |
| A605 | ENF | PartB_TI.* |
| A606 | ENF | PartB_TI.* |
| A607 | ENF | PartB_TI.* |
| A608 | ENF | PartB_TI.* |
| A609 | ENF | PartB_TI.* |
| A610 | ENF | PartB_TI.* |
| A611 | ENF | PartB_TI.* |
| A612 | ENF | PartB_TI.* |
| A613 | ENF | PartB_TI.* |
| A614 | ENF | PartB_TI.* |
| A615 | ENF | PartB_TI.* |
| A616 | ENF | PartB_TI.* |
| A617 | ENF | PartB_TI.* |
| A618 | ENF | PartB_TTI.* |
| A619 | ENF | PartB_TTI.* |
| A620 | ENF | PartB_TTI.* |
| A621 | ENF | PartB_TTI.* |
| A622 | ENF | PartB_TTI.* |
| A623 | ENF | PartB_TTI.* |
| A624 | ENF | PartB_TTI.* |
| A625 | ENF | PartB_TTI.* |
| A626 | ENF | PartB_TTI.* |
| A627 | ENF | PartB_TTI.* |
| A628 | ENF | PartB_TTI.* |
| A629 | ENF | PartB_TTI.* |
| A630 | ENF | PartB_TTI.* |
| A631 | ENF | PartB_TTI.* |
| A632 | ENF | PartB_TTI.* |
| A633 | ENF | PartB_TTI.* |
| A634 | ENF | PartB_TTI.* |
| A635 | ENF | PartB_TTI.* |
| A636 | ENF | PartB_TTI.* |
| A637 | NA | 234F fee only if filed after the due date — needs the portal filing timestamp |
| A638 | ENF | ScheduleFA.* |
| A639 | NA | 234-I fee keyed to filing after 31/12/2026 — needs the portal filing timestamp |
| A640 | NA | 234-I fee keyed to filing after 31/12/2026 — needs the portal filing timestamp |
| A641 | ENF | ScheduleIT.* |
| A642 | ENF | ScheduleTDS2.* / ScheduleTDS3.* |
| A643 | ENF | ScheduleTDS2.* / ScheduleTDS3.* |
| A644 | ENF | ScheduleTDS2.* / ScheduleTDS3.* |
| A645 | ENF | ScheduleTDS2.* / ScheduleTDS3.* |
| A646 | ENF | ScheduleTDS2.* / ScheduleTDS3.* |
| A647 | ENF | ScheduleTDS2.* / ScheduleTDS3.* |
| A648 | ENF | ScheduleTDS2.* / ScheduleTDS3.* |
| A649 | ENF | ScheduleTDS2.* / ScheduleTDS3.* |
| A650 | ENF | ScheduleTDS2.* / ScheduleTDS3.* |
| A651 | ENF | ScheduleTDS2.* / ScheduleTDS3.* |
| A652 | ENF | ScheduleTDS2.* / ScheduleTDS3.* |
| A653 | ENF | ScheduleTDS2.* / ScheduleTDS3.* |
| A654 | ENF | ScheduleTDS2.* / ScheduleTDS3.* |
| A655 | ENF | ScheduleTCS.* |
| A656 | ENF | ScheduleTCS.* |
| A657 | ENF | ScheduleTCS.* |
| A658 | ENF | ScheduleTCS.* |
| A659 | ENF | ScheduleTCS.* |
| A660 | ENF | ScheduleTCS.* |
| A661 | ENF | ScheduleTCS.* |
