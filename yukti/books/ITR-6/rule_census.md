# ITR-6 · AY 2026-27 — Validation-rule census (Phase 6 plan)

Every CBDT ITR-6 validation serial in `books/ITR-6/rules.json` is classified into one of the constitution buckets, so that Phase-6 Gate-6 can prove **MISSING = 0**. The built return read by the encoder is `I = Object.values(buildReturn().ITR)[0]` (root **ITR6**); every path below is a key on `I`.

## Buckets

- **ENFORCED-target** — offline-checkable against a schema key that exists on the built return; will be encoded as `A(serial, cond, msg)` (cond TRUE on a lawful return, FALSE on a violation).
- **NA** — not this form's job: resolved by the e-filing portal, by AIS/26AS, by a server clock, or by another form. Nothing to encode offline.
- **OFFLINE-IMPOSSIBLE** — would require an external database not shipped, or a schema field that does not exist in ITR-6.
- **MISSING** — a serial with no bucket. Must be **0**. This census leaves none.

## Counts

| Category | ENFORCED-target | NA | OFFLINE-IMPOSSIBLE | Total |
|---|--:|--:|--:|--:|
| **A** (blocking) | 856 | 11 | 1 | 868 |
| **B** (advisory) | 16 | 6 | 5 | 27 |
| **D** (advisory, follow-up forms) | 23 | 0 | 0 | 23 |

MISSING (A) = 868 − 856 − 11 − 1 = **0**.  MISSING (B) = 27 − 16 − 6 − 5 = **0**.

### Category-A NA serials (11)

- **A2** — uploader-PAN identity — resolved by the portal at upload, not in the return
- **A8** — audit-report date ≤ system clock — server-clock comparison (portal)
- **A10** — "cannot opt out in subsequent years" — needs prior-year filing history (portal)
- **A12** — 148/153C proceeding bars revision — proceeding status held by the portal
- **A26** — regime must match the defective-notice return — that prior return is portal-side
- **A35** — "return filed after the due date" — needs the portal filing timestamp
- **A652** — "ensure Form 10-II is filed" — a separate form (advisory / portal)
- **A653** — "ensure Form 10-IG/10-IK is filed" — a separate form (advisory / portal)
- **A694** — tax-deposit date ≤ system clock — server-clock comparison (portal)
- **A783** — 234F/234-I fee keyed to the actual filing date — portal timestamp
- **A784** — 234F/234-I fee keyed to the actual filing date — portal timestamp

### Category-A OFFLINE-IMPOSSIBLE serials (1)

- **A765** — IFSC must tally with the live RBI IFSC database — external DB, no offline table shipped

> No Category-A serial targets a schema field that is absent from ITR-6. Where a rule names a field, the field was located in `sources/ITR-6/ITR-6_2026_Main_V1_0_schema.json` (verified block-by-block). If, during fan-out encoding, a serial's target proves absent, it must be re-filed here as OFFLINE-IMPOSSIBLE with the reason — never faked.

## Category-A by schema block (ENFORCED-target)

| Schema block(s) on `I` | Serials | ENFORCED | NA / OFFLINE in range |
|---|---|--:|---|

| `PartA_GEN1.* / PartA_GEN2For6.*` | A1–A41 | 35 | A2(NA), A8(NA), A10(NA), A12(NA), A26(NA), A35(NA) |
| `PARTA_BSFor6FrmAY13.* (regular) / PARTA_BSIndAS.* (Ind-AS)` | A42–A63 | 22 | — |
| `TradingAccount.* / TradingAccountIndAS.*` | A64–A82 | 19 | — |
| `ManufacturingAccount.* / ManufacturingAccountIndAS.*` | A83–A96 | 14 | — |
| `PARTA_PL.* / PARTA_PLIndAS.*` | A97–A139 | 43 | — |
| `PARTA_PLIndAS.*` | A140–A162 | 23 | — |
| `PARTA_OI.*` | A163–A173 | 11 | — |
| `PARTA_OL.*` | A174 | 1 | — |
| `ScheduleHP.*` | A175–A194 | 20 | — |
| `CorpScheduleBP.*` | A195–A269 | 75 | — |
| `ScheduleDPM.*` | A270–A286 | 17 | — |
| `ScheduleDOA.*` | A287–A303 | 17 | — |
| `ScheduleDEP.*` | A304–A316 | 13 | — |
| `ScheduleDCG.*` | A317–A329 | 13 | — |
| `ScheduleESR.*` | A330–A331 | 2 | — |
| `Schedule80RA.*` | A332–A335 | 4 | — |
| `ScheduleCG.*` | A336–A439 | 104 | — |
| `Schedule112A.*` | A440–A448 | 9 | — |
| `Schedule115AD.*` | A449–A457 | 9 | — |
| `ScheduleVDA.*` | A458–A461 | 4 | — |
| `ScheduleOS.*` | A462–A500 | 39 | — |
| `ScheduleCYLA.*` | A501–A527 | 27 | — |
| `ScheduleBFLA.*` | A528–A555 | 28 | — |
| `ScheduleCFL.*` | A556–A568 | 13 | — |
| `ITRScheduleUD.*` | A569–A574 | 6 | — |
| `ScheduleICDS.*` | A575–A577 | 3 | — |
| `Schedule80GGB.*` | A578–A588 | 11 | — |
| `Schedule80GGC.*` | A589–A598 | 10 | — |
| `Schedule80IAC.*` | A599–A603 | 5 | — |
| `Schedule80LA.*` | A604–A611 | 8 | — |
| `ScheduleSI.*` | A612–A645 | 34 | — |
| `ScheduleEI.*` | A646–A661 | 14 | A652(NA), A653(NA) |
| `SchedulePTI.*` | A662–A665 | 4 | — |
| `ScheduleMAT.*` | A666–A676 | 11 | — |
| `ScheduleMATC.*` | A677–A686 | 10 | — |
| `ScheduleTPSA.*` | A687–A694 | 7 | A694(NA) |
| `Schedule115TD.*` | A695–A700, A780 | 7 | — |
| `ScheduleFSI.*` | A701–A707 | 7 | — |
| `ScheduleTR1.*` | A708–A713 | 6 | — |
| `ScheduleGST.*` | A714–A715 | 2 | — |
| `PartB-TI.*` | A716–A754 | 39 | — |
| `PartB_TTI.*` | A755–A779, A781–A784 | 26 | A765(OF), A783(NA), A784(NA) |
| `ScheduleIT.*` | A785 | 1 | — |
| `ScheduleFA.*` | A786–A787 | 2 | — |
| `ScheduleTDS2 / ScheduleTDS3.*` | A788–A798 | 11 | — |
| `ScheduleTCS.*` | A799–A805 | 7 | — |
| `Schedule80G.*` | A806–A817 | 12 | — |
| `Schedule80GGA.*` | A818–A822 | 5 | — |
| `Schedule80_IA.*` | A823 | 1 | — |
| `Schedule80_IB.*` | A824 | 1 | — |
| `Schedule80_IC.*` | A825 | 1 | — |
| `Schedule10AA.*` | A826 | 1 | — |
| `ScheduleIF.*` | A827 | 1 | — |
| `ScheduleVIA.*` | A828–A866 | 39 | — |
| `Verification.*` | A867–A868 | 2 | — |

## Category-B census (27)

| Serial | Bucket | Target key / reason |
|---|---|---|
| B1 | NA | file Form 3CA-3CD/3CB-3CD — separate audit form |
| B2 | NA | upload Form 3CE — separate form |
| B3 | OFFLINE-IMPOSSIBLE | Date/Ack must match backend Form 10-IB DB — external DB |
| B4 | OFFLINE-IMPOSSIBLE | … Form 10-IC DB — external DB |
| B5 | OFFLINE-IMPOSSIBLE | … Form 10-ID DB — external DB |
| B6 | NA | file Form 3CLA — separate form |
| B7 | ENFORCED-target (advisory → Dd/warn) | see rule text — cross-checkable within the return |
| B8 | OFFLINE-IMPOSSIBLE | valid Form 10-IB/IC/ID present in backend — external DB |
| B9 | OFFLINE-IMPOSSIBLE | valid Form present in backend for current year — external DB |
| B10 | ENFORCED-target (advisory → Dd/warn) | see rule text — cross-checkable within the return |
| B11 | ENFORCED-target (advisory → Dd/warn) | see rule text — cross-checkable within the return |
| B12 | ENFORCED-target (advisory → Dd/warn) | see rule text — cross-checkable within the return |
| B13 | ENFORCED-target (advisory → Dd/warn) | see rule text — cross-checkable within the return |
| B14 | ENFORCED-target (advisory → Dd/warn) | see rule text — cross-checkable within the return |
| B15 | ENFORCED-target (advisory → Dd/warn) | see rule text — cross-checkable within the return |
| B16 | ENFORCED-target (advisory → Dd/warn) | see rule text — cross-checkable within the return |
| B17 | ENFORCED-target (advisory → Dd/warn) | see rule text — cross-checkable within the return |
| B18 | ENFORCED-target (advisory → Dd/warn) | see rule text — cross-checkable within the return |
| B19 | ENFORCED-target (advisory → Dd/warn) | see rule text — cross-checkable within the return |
| B20 | ENFORCED-target (advisory → Dd/warn) | see rule text — cross-checkable within the return |
| B21 | NA | other person must disclose the TDS in their own ITR — external |
| B22 | NA | file Form 29B — separate form |
| B23 | ENFORCED-target (advisory → Dd/warn) | see rule text — cross-checkable within the return |
| B24 | ENFORCED-target (advisory → Dd/warn) | see rule text — cross-checkable within the return |
| B25 | ENFORCED-target (advisory → Dd/warn) | see rule text — cross-checkable within the return |
| B26 | NA | check AIS / 26AS — external data |
| B27 | ENFORCED-target (advisory → Dd/warn) | see rule text — cross-checkable within the return |

Category-D (23) are all **ENFORCED-target** as `Dd(serial, cond, msg)` follow-up notices (each names the form/return to file); they never block the export.

## Batch plan — ENFORCED Category-A serials, ~50 per file

The 856 ENFORCED-target Category-A serials are partitioned into 18 contiguous serial-range files `forms/ITR-6/src/61_rules_enc_NN.js`, each registered with `ruleset(fn)` (disjoint files → parallel fan-out, no merge conflicts). NA/OFFLINE serials inside a range are simply skipped (they are bucketed above).

| File | Serial range | ENFORCED serials | Schedules covered |
|---|---|--:|---|
| `61_rules_enc_01.js` | A1–A56 | 50 | Part A General + Balance Sheet (regular) |
| `61_rules_enc_02.js` | A57–A106 | 50 | Balance Sheet (Ind-AS) · Trading · Manufacturing · P&L |
| `61_rules_enc_03.js` | A107–A156 | 50 | P&L · P&L Ind-AS |
| `61_rules_enc_04.js` | A157–A206 | 50 | P&L Ind-AS · Part A-OI · Part A-OL · Schedule HP · Schedule BP |
| `61_rules_enc_05.js` | A207–A256 | 50 | Schedule BP |
| `61_rules_enc_06.js` | A257–A306 | 50 | Schedule BP · DPM · DOA |
| `61_rules_enc_07.js` | A307–A356 | 50 | DOA · DEP · DCG |
| `61_rules_enc_08.js` | A357–A406 | 50 | Schedule CG |
| `61_rules_enc_09.js` | A407–A456 | 50 | Schedule CG |
| `61_rules_enc_10.js` | A457–A506 | 50 | Schedule CG · 112A · 115AD · VDA · OS |
| `61_rules_enc_11.js` | A507–A556 | 50 | OS · CYLA |
| `61_rules_enc_12.js` | A557–A606 | 50 | CYLA · BFLA · CFL |
| `61_rules_enc_13.js` | A607–A658 | 50 | CFL · UD · ICDS · 80GGB · 80GGC · 80IAC · 80LA · SI |
| `61_rules_enc_14.js` | A659–A709 | 50 | SI · EI · PTI · MAT · MATC · TPSA · 115TD |
| `61_rules_enc_15.js` | A710–A759 | 50 | FSI · TR · GST · Part B-TI |
| `61_rules_enc_16.js` | A760–A812 | 50 | Part B-TI · Part B-TTI · 10AA |
| `61_rules_enc_17.js` | A813–A862 | 50 | TTI · FA · IT · TDS · TCS · 80G · 80GGA · 80-IA/IB/IE · VIA |
| `61_rules_enc_18.js` | A863–A868 | 6 | Schedule VI-A · Verification |

## Reference batch — `61_rules_enc_01.js` (serials A1–A56)

Encoded (42): **A1, A3, A4, A5, A6, A7, A9, A11, A13, A14, A15, A16, A17, A18, A19, A20, A21, A22, A23, A24, A25, A27, A28, A30, A31, A32, A38, A40, A41, A42** (30 — Part A General) and **A43, A44, A45, A46, A47, A48, A49, A50, A51, A53, A55, A56** (12 — Balance Sheet, regular). The remaining 8 ENFORCED serials in the A1–A56 band are deferred below (42 + 8 = the 50 ENFORCED serials of this range; the other 6 serials A2/A8/A10/A12/A26/A35 are NA).

Deferred inside A1–A56 (still ENFORCED-target, to finish in fan-out, not faked): A29 (multi-branch 44AB derivation), A33/A34/A36/A37 (due-date & cash-%→audit derivations), A39 (needs Schedule OS §115AD income), A52/A54 (deep BS current-asset sub-totals).

Smoke test (single-scope eval with the shell's `N/RG/REQ/ruleset`): empty `{}` fires only presence rules A4/A21/A40; a lawful minimal accounts return fires none; a return with broken BS totals + MSME-yes-without-registration fires exactly A22, A43, A49, A51. `node --check` passes.

## Appendix — every Category-A serial, one line (MISSING = 0)

| Serial | Bucket | Block / reason |
|---|---|---|
| A1 | ENF | PartA_GEN1.* / PartA_GEN2For6.* |
| A2 | NA | uploader-PAN identity — resolved by the portal at upload, not in the return |
| A3 | ENF | PartA_GEN1.* / PartA_GEN2For6.* |
| A4 | ENF | PartA_GEN1.* / PartA_GEN2For6.* |
| A5 | ENF | PartA_GEN1.* / PartA_GEN2For6.* |
| A6 | ENF | PartA_GEN1.* / PartA_GEN2For6.* |
| A7 | ENF | PartA_GEN1.* / PartA_GEN2For6.* |
| A8 | NA | audit-report date ≤ system clock — server-clock comparison (portal) |
| A9 | ENF | PartA_GEN1.* / PartA_GEN2For6.* |
| A10 | NA | "cannot opt out in subsequent years" — needs prior-year filing history (portal) |
| A11 | ENF | PartA_GEN1.* / PartA_GEN2For6.* |
| A12 | NA | 148/153C proceeding bars revision — proceeding status held by the portal |
| A13 | ENF | PartA_GEN1.* / PartA_GEN2For6.* |
| A14 | ENF | PartA_GEN1.* / PartA_GEN2For6.* |
| A15 | ENF | PartA_GEN1.* / PartA_GEN2For6.* |
| A16 | ENF | PartA_GEN1.* / PartA_GEN2For6.* |
| A17 | ENF | PartA_GEN1.* / PartA_GEN2For6.* |
| A18 | ENF | PartA_GEN1.* / PartA_GEN2For6.* |
| A19 | ENF | PartA_GEN1.* / PartA_GEN2For6.* |
| A20 | ENF | PartA_GEN1.* / PartA_GEN2For6.* |
| A21 | ENF | PartA_GEN1.* / PartA_GEN2For6.* |
| A22 | ENF | PartA_GEN1.* / PartA_GEN2For6.* |
| A23 | ENF | PartA_GEN1.* / PartA_GEN2For6.* |
| A24 | ENF | PartA_GEN1.* / PartA_GEN2For6.* |
| A25 | ENF | PartA_GEN1.* / PartA_GEN2For6.* |
| A26 | NA | regime must match the defective-notice return — that prior return is portal-side |
| A27 | ENF | PartA_GEN1.* / PartA_GEN2For6.* |
| A28 | ENF | PartA_GEN1.* / PartA_GEN2For6.* |
| A29 | ENF | PartA_GEN1.* / PartA_GEN2For6.* |
| A30 | ENF | PartA_GEN1.* / PartA_GEN2For6.* |
| A31 | ENF | PartA_GEN1.* / PartA_GEN2For6.* |
| A32 | ENF | PartA_GEN1.* / PartA_GEN2For6.* |
| A33 | ENF | PartA_GEN1.* / PartA_GEN2For6.* |
| A34 | ENF | PartA_GEN1.* / PartA_GEN2For6.* |
| A35 | NA | "return filed after the due date" — needs the portal filing timestamp |
| A36 | ENF | PartA_GEN1.* / PartA_GEN2For6.* |
| A37 | ENF | PartA_GEN1.* / PartA_GEN2For6.* |
| A38 | ENF | PartA_GEN1.* / PartA_GEN2For6.* |
| A39 | ENF | PartA_GEN1.* / PartA_GEN2For6.* |
| A40 | ENF | PartA_GEN1.* / PartA_GEN2For6.* |
| A41 | ENF | PartA_GEN1.* / PartA_GEN2For6.* |
| A42 | ENF | PARTA_BSFor6FrmAY13.* (regular) / PARTA_BSIndAS.* (Ind-AS) |
| A43 | ENF | PARTA_BSFor6FrmAY13.* (regular) / PARTA_BSIndAS.* (Ind-AS) |
| A44 | ENF | PARTA_BSFor6FrmAY13.* (regular) / PARTA_BSIndAS.* (Ind-AS) |
| A45 | ENF | PARTA_BSFor6FrmAY13.* (regular) / PARTA_BSIndAS.* (Ind-AS) |
| A46 | ENF | PARTA_BSFor6FrmAY13.* (regular) / PARTA_BSIndAS.* (Ind-AS) |
| A47 | ENF | PARTA_BSFor6FrmAY13.* (regular) / PARTA_BSIndAS.* (Ind-AS) |
| A48 | ENF | PARTA_BSFor6FrmAY13.* (regular) / PARTA_BSIndAS.* (Ind-AS) |
| A49 | ENF | PARTA_BSFor6FrmAY13.* (regular) / PARTA_BSIndAS.* (Ind-AS) |
| A50 | ENF | PARTA_BSFor6FrmAY13.* (regular) / PARTA_BSIndAS.* (Ind-AS) |
| A51 | ENF | PARTA_BSFor6FrmAY13.* (regular) / PARTA_BSIndAS.* (Ind-AS) |
| A52 | ENF | PARTA_BSFor6FrmAY13.* (regular) / PARTA_BSIndAS.* (Ind-AS) |
| A53 | ENF | PARTA_BSFor6FrmAY13.* (regular) / PARTA_BSIndAS.* (Ind-AS) |
| A54 | ENF | PARTA_BSFor6FrmAY13.* (regular) / PARTA_BSIndAS.* (Ind-AS) |
| A55 | ENF | PARTA_BSFor6FrmAY13.* (regular) / PARTA_BSIndAS.* (Ind-AS) |
| A56 | ENF | PARTA_BSFor6FrmAY13.* (regular) / PARTA_BSIndAS.* (Ind-AS) |
| A57 | ENF | PARTA_BSFor6FrmAY13.* (regular) / PARTA_BSIndAS.* (Ind-AS) |
| A58 | ENF | PARTA_BSFor6FrmAY13.* (regular) / PARTA_BSIndAS.* (Ind-AS) |
| A59 | ENF | PARTA_BSFor6FrmAY13.* (regular) / PARTA_BSIndAS.* (Ind-AS) |
| A60 | ENF | PARTA_BSFor6FrmAY13.* (regular) / PARTA_BSIndAS.* (Ind-AS) |
| A61 | ENF | PARTA_BSFor6FrmAY13.* (regular) / PARTA_BSIndAS.* (Ind-AS) |
| A62 | ENF | PARTA_BSFor6FrmAY13.* (regular) / PARTA_BSIndAS.* (Ind-AS) |
| A63 | ENF | PARTA_BSFor6FrmAY13.* (regular) / PARTA_BSIndAS.* (Ind-AS) |
| A64 | ENF | TradingAccount.* / TradingAccountIndAS.* |
| A65 | ENF | TradingAccount.* / TradingAccountIndAS.* |
| A66 | ENF | TradingAccount.* / TradingAccountIndAS.* |
| A67 | ENF | TradingAccount.* / TradingAccountIndAS.* |
| A68 | ENF | TradingAccount.* / TradingAccountIndAS.* |
| A69 | ENF | TradingAccount.* / TradingAccountIndAS.* |
| A70 | ENF | TradingAccount.* / TradingAccountIndAS.* |
| A71 | ENF | TradingAccount.* / TradingAccountIndAS.* |
| A72 | ENF | TradingAccount.* / TradingAccountIndAS.* |
| A73 | ENF | TradingAccount.* / TradingAccountIndAS.* |
| A74 | ENF | TradingAccount.* / TradingAccountIndAS.* |
| A75 | ENF | TradingAccount.* / TradingAccountIndAS.* |
| A76 | ENF | TradingAccount.* / TradingAccountIndAS.* |
| A77 | ENF | TradingAccount.* / TradingAccountIndAS.* |
| A78 | ENF | TradingAccount.* / TradingAccountIndAS.* |
| A79 | ENF | TradingAccount.* / TradingAccountIndAS.* |
| A80 | ENF | TradingAccount.* / TradingAccountIndAS.* |
| A81 | ENF | TradingAccount.* / TradingAccountIndAS.* |
| A82 | ENF | TradingAccount.* / TradingAccountIndAS.* |
| A83 | ENF | ManufacturingAccount.* / ManufacturingAccountIndAS.* |
| A84 | ENF | ManufacturingAccount.* / ManufacturingAccountIndAS.* |
| A85 | ENF | ManufacturingAccount.* / ManufacturingAccountIndAS.* |
| A86 | ENF | ManufacturingAccount.* / ManufacturingAccountIndAS.* |
| A87 | ENF | ManufacturingAccount.* / ManufacturingAccountIndAS.* |
| A88 | ENF | ManufacturingAccount.* / ManufacturingAccountIndAS.* |
| A89 | ENF | ManufacturingAccount.* / ManufacturingAccountIndAS.* |
| A90 | ENF | ManufacturingAccount.* / ManufacturingAccountIndAS.* |
| A91 | ENF | ManufacturingAccount.* / ManufacturingAccountIndAS.* |
| A92 | ENF | ManufacturingAccount.* / ManufacturingAccountIndAS.* |
| A93 | ENF | ManufacturingAccount.* / ManufacturingAccountIndAS.* |
| A94 | ENF | ManufacturingAccount.* / ManufacturingAccountIndAS.* |
| A95 | ENF | ManufacturingAccount.* / ManufacturingAccountIndAS.* |
| A96 | ENF | ManufacturingAccount.* / ManufacturingAccountIndAS.* |
| A97 | ENF | PARTA_PL.* / PARTA_PLIndAS.* |
| A98 | ENF | PARTA_PL.* / PARTA_PLIndAS.* |
| A99 | ENF | PARTA_PL.* / PARTA_PLIndAS.* |
| A100 | ENF | PARTA_PL.* / PARTA_PLIndAS.* |
| A101 | ENF | PARTA_PL.* / PARTA_PLIndAS.* |
| A102 | ENF | PARTA_PL.* / PARTA_PLIndAS.* |
| A103 | ENF | PARTA_PL.* / PARTA_PLIndAS.* |
| A104 | ENF | PARTA_PL.* / PARTA_PLIndAS.* |
| A105 | ENF | PARTA_PL.* / PARTA_PLIndAS.* |
| A106 | ENF | PARTA_PL.* / PARTA_PLIndAS.* |
| A107 | ENF | PARTA_PL.* / PARTA_PLIndAS.* |
| A108 | ENF | PARTA_PL.* / PARTA_PLIndAS.* |
| A109 | ENF | PARTA_PL.* / PARTA_PLIndAS.* |
| A110 | ENF | PARTA_PL.* / PARTA_PLIndAS.* |
| A111 | ENF | PARTA_PL.* / PARTA_PLIndAS.* |
| A112 | ENF | PARTA_PL.* / PARTA_PLIndAS.* |
| A113 | ENF | PARTA_PL.* / PARTA_PLIndAS.* |
| A114 | ENF | PARTA_PL.* / PARTA_PLIndAS.* |
| A115 | ENF | PARTA_PL.* / PARTA_PLIndAS.* |
| A116 | ENF | PARTA_PL.* / PARTA_PLIndAS.* |
| A117 | ENF | PARTA_PL.* / PARTA_PLIndAS.* |
| A118 | ENF | PARTA_PL.* / PARTA_PLIndAS.* |
| A119 | ENF | PARTA_PL.* / PARTA_PLIndAS.* |
| A120 | ENF | PARTA_PL.* / PARTA_PLIndAS.* |
| A121 | ENF | PARTA_PL.* / PARTA_PLIndAS.* |
| A122 | ENF | PARTA_PL.* / PARTA_PLIndAS.* |
| A123 | ENF | PARTA_PL.* / PARTA_PLIndAS.* |
| A124 | ENF | PARTA_PL.* / PARTA_PLIndAS.* |
| A125 | ENF | PARTA_PL.* / PARTA_PLIndAS.* |
| A126 | ENF | PARTA_PL.* / PARTA_PLIndAS.* |
| A127 | ENF | PARTA_PL.* / PARTA_PLIndAS.* |
| A128 | ENF | PARTA_PL.* / PARTA_PLIndAS.* |
| A129 | ENF | PARTA_PL.* / PARTA_PLIndAS.* |
| A130 | ENF | PARTA_PL.* / PARTA_PLIndAS.* |
| A131 | ENF | PARTA_PL.* / PARTA_PLIndAS.* |
| A132 | ENF | PARTA_PL.* / PARTA_PLIndAS.* |
| A133 | ENF | PARTA_PL.* / PARTA_PLIndAS.* |
| A134 | ENF | PARTA_PL.* / PARTA_PLIndAS.* |
| A135 | ENF | PARTA_PL.* / PARTA_PLIndAS.* |
| A136 | ENF | PARTA_PL.* / PARTA_PLIndAS.* |
| A137 | ENF | PARTA_PL.* / PARTA_PLIndAS.* |
| A138 | ENF | PARTA_PL.* / PARTA_PLIndAS.* |
| A139 | ENF | PARTA_PL.* / PARTA_PLIndAS.* |
| A140 | ENF | PARTA_PLIndAS.* |
| A141 | ENF | PARTA_PLIndAS.* |
| A142 | ENF | PARTA_PLIndAS.* |
| A143 | ENF | PARTA_PLIndAS.* |
| A144 | ENF | PARTA_PLIndAS.* |
| A145 | ENF | PARTA_PLIndAS.* |
| A146 | ENF | PARTA_PLIndAS.* |
| A147 | ENF | PARTA_PLIndAS.* |
| A148 | ENF | PARTA_PLIndAS.* |
| A149 | ENF | PARTA_PLIndAS.* |
| A150 | ENF | PARTA_PLIndAS.* |
| A151 | ENF | PARTA_PLIndAS.* |
| A152 | ENF | PARTA_PLIndAS.* |
| A153 | ENF | PARTA_PLIndAS.* |
| A154 | ENF | PARTA_PLIndAS.* |
| A155 | ENF | PARTA_PLIndAS.* |
| A156 | ENF | PARTA_PLIndAS.* |
| A157 | ENF | PARTA_PLIndAS.* |
| A158 | ENF | PARTA_PLIndAS.* |
| A159 | ENF | PARTA_PLIndAS.* |
| A160 | ENF | PARTA_PLIndAS.* |
| A161 | ENF | PARTA_PLIndAS.* |
| A162 | ENF | PARTA_PLIndAS.* |
| A163 | ENF | PARTA_OI.* |
| A164 | ENF | PARTA_OI.* |
| A165 | ENF | PARTA_OI.* |
| A166 | ENF | PARTA_OI.* |
| A167 | ENF | PARTA_OI.* |
| A168 | ENF | PARTA_OI.* |
| A169 | ENF | PARTA_OI.* |
| A170 | ENF | PARTA_OI.* |
| A171 | ENF | PARTA_OI.* |
| A172 | ENF | PARTA_OI.* |
| A173 | ENF | PARTA_OI.* |
| A174 | ENF | PARTA_OL.* |
| A175 | ENF | ScheduleHP.* |
| A176 | ENF | ScheduleHP.* |
| A177 | ENF | ScheduleHP.* |
| A178 | ENF | ScheduleHP.* |
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
| A195 | ENF | CorpScheduleBP.* |
| A196 | ENF | CorpScheduleBP.* |
| A197 | ENF | CorpScheduleBP.* |
| A198 | ENF | CorpScheduleBP.* |
| A199 | ENF | CorpScheduleBP.* |
| A200 | ENF | CorpScheduleBP.* |
| A201 | ENF | CorpScheduleBP.* |
| A202 | ENF | CorpScheduleBP.* |
| A203 | ENF | CorpScheduleBP.* |
| A204 | ENF | CorpScheduleBP.* |
| A205 | ENF | CorpScheduleBP.* |
| A206 | ENF | CorpScheduleBP.* |
| A207 | ENF | CorpScheduleBP.* |
| A208 | ENF | CorpScheduleBP.* |
| A209 | ENF | CorpScheduleBP.* |
| A210 | ENF | CorpScheduleBP.* |
| A211 | ENF | CorpScheduleBP.* |
| A212 | ENF | CorpScheduleBP.* |
| A213 | ENF | CorpScheduleBP.* |
| A214 | ENF | CorpScheduleBP.* |
| A215 | ENF | CorpScheduleBP.* |
| A216 | ENF | CorpScheduleBP.* |
| A217 | ENF | CorpScheduleBP.* |
| A218 | ENF | CorpScheduleBP.* |
| A219 | ENF | CorpScheduleBP.* |
| A220 | ENF | CorpScheduleBP.* |
| A221 | ENF | CorpScheduleBP.* |
| A222 | ENF | CorpScheduleBP.* |
| A223 | ENF | CorpScheduleBP.* |
| A224 | ENF | CorpScheduleBP.* |
| A225 | ENF | CorpScheduleBP.* |
| A226 | ENF | CorpScheduleBP.* |
| A227 | ENF | CorpScheduleBP.* |
| A228 | ENF | CorpScheduleBP.* |
| A229 | ENF | CorpScheduleBP.* |
| A230 | ENF | CorpScheduleBP.* |
| A231 | ENF | CorpScheduleBP.* |
| A232 | ENF | CorpScheduleBP.* |
| A233 | ENF | CorpScheduleBP.* |
| A234 | ENF | CorpScheduleBP.* |
| A235 | ENF | CorpScheduleBP.* |
| A236 | ENF | CorpScheduleBP.* |
| A237 | ENF | CorpScheduleBP.* |
| A238 | ENF | CorpScheduleBP.* |
| A239 | ENF | CorpScheduleBP.* |
| A240 | ENF | CorpScheduleBP.* |
| A241 | ENF | CorpScheduleBP.* |
| A242 | ENF | CorpScheduleBP.* |
| A243 | ENF | CorpScheduleBP.* |
| A244 | ENF | CorpScheduleBP.* |
| A245 | ENF | CorpScheduleBP.* |
| A246 | ENF | CorpScheduleBP.* |
| A247 | ENF | CorpScheduleBP.* |
| A248 | ENF | CorpScheduleBP.* |
| A249 | ENF | CorpScheduleBP.* |
| A250 | ENF | CorpScheduleBP.* |
| A251 | ENF | CorpScheduleBP.* |
| A252 | ENF | CorpScheduleBP.* |
| A253 | ENF | CorpScheduleBP.* |
| A254 | ENF | CorpScheduleBP.* |
| A255 | ENF | CorpScheduleBP.* |
| A256 | ENF | CorpScheduleBP.* |
| A257 | ENF | CorpScheduleBP.* |
| A258 | ENF | CorpScheduleBP.* |
| A259 | ENF | CorpScheduleBP.* |
| A260 | ENF | CorpScheduleBP.* |
| A261 | ENF | CorpScheduleBP.* |
| A262 | ENF | CorpScheduleBP.* |
| A263 | ENF | CorpScheduleBP.* |
| A264 | ENF | CorpScheduleBP.* |
| A265 | ENF | CorpScheduleBP.* |
| A266 | ENF | CorpScheduleBP.* |
| A267 | ENF | CorpScheduleBP.* |
| A268 | ENF | CorpScheduleBP.* |
| A269 | ENF | CorpScheduleBP.* |
| A270 | ENF | ScheduleDPM.* |
| A271 | ENF | ScheduleDPM.* |
| A272 | ENF | ScheduleDPM.* |
| A273 | ENF | ScheduleDPM.* |
| A274 | ENF | ScheduleDPM.* |
| A275 | ENF | ScheduleDPM.* |
| A276 | ENF | ScheduleDPM.* |
| A277 | ENF | ScheduleDPM.* |
| A278 | ENF | ScheduleDPM.* |
| A279 | ENF | ScheduleDPM.* |
| A280 | ENF | ScheduleDPM.* |
| A281 | ENF | ScheduleDPM.* |
| A282 | ENF | ScheduleDPM.* |
| A283 | ENF | ScheduleDPM.* |
| A284 | ENF | ScheduleDPM.* |
| A285 | ENF | ScheduleDPM.* |
| A286 | ENF | ScheduleDPM.* |
| A287 | ENF | ScheduleDOA.* |
| A288 | ENF | ScheduleDOA.* |
| A289 | ENF | ScheduleDOA.* |
| A290 | ENF | ScheduleDOA.* |
| A291 | ENF | ScheduleDOA.* |
| A292 | ENF | ScheduleDOA.* |
| A293 | ENF | ScheduleDOA.* |
| A294 | ENF | ScheduleDOA.* |
| A295 | ENF | ScheduleDOA.* |
| A296 | ENF | ScheduleDOA.* |
| A297 | ENF | ScheduleDOA.* |
| A298 | ENF | ScheduleDOA.* |
| A299 | ENF | ScheduleDOA.* |
| A300 | ENF | ScheduleDOA.* |
| A301 | ENF | ScheduleDOA.* |
| A302 | ENF | ScheduleDOA.* |
| A303 | ENF | ScheduleDOA.* |
| A304 | ENF | ScheduleDEP.* |
| A305 | ENF | ScheduleDEP.* |
| A306 | ENF | ScheduleDEP.* |
| A307 | ENF | ScheduleDEP.* |
| A308 | ENF | ScheduleDEP.* |
| A309 | ENF | ScheduleDEP.* |
| A310 | ENF | ScheduleDEP.* |
| A311 | ENF | ScheduleDEP.* |
| A312 | ENF | ScheduleDEP.* |
| A313 | ENF | ScheduleDEP.* |
| A314 | ENF | ScheduleDEP.* |
| A315 | ENF | ScheduleDEP.* |
| A316 | ENF | ScheduleDEP.* |
| A317 | ENF | ScheduleDCG.* |
| A318 | ENF | ScheduleDCG.* |
| A319 | ENF | ScheduleDCG.* |
| A320 | ENF | ScheduleDCG.* |
| A321 | ENF | ScheduleDCG.* |
| A322 | ENF | ScheduleDCG.* |
| A323 | ENF | ScheduleDCG.* |
| A324 | ENF | ScheduleDCG.* |
| A325 | ENF | ScheduleDCG.* |
| A326 | ENF | ScheduleDCG.* |
| A327 | ENF | ScheduleDCG.* |
| A328 | ENF | ScheduleDCG.* |
| A329 | ENF | ScheduleDCG.* |
| A330 | ENF | ScheduleESR.* |
| A331 | ENF | ScheduleESR.* |
| A332 | ENF | Schedule80RA.* |
| A333 | ENF | Schedule80RA.* |
| A334 | ENF | Schedule80RA.* |
| A335 | ENF | Schedule80RA.* |
| A336 | ENF | ScheduleCG.* |
| A337 | ENF | ScheduleCG.* |
| A338 | ENF | ScheduleCG.* |
| A339 | ENF | ScheduleCG.* |
| A340 | ENF | ScheduleCG.* |
| A341 | ENF | ScheduleCG.* |
| A342 | ENF | ScheduleCG.* |
| A343 | ENF | ScheduleCG.* |
| A344 | ENF | ScheduleCG.* |
| A345 | ENF | ScheduleCG.* |
| A346 | ENF | ScheduleCG.* |
| A347 | ENF | ScheduleCG.* |
| A348 | ENF | ScheduleCG.* |
| A349 | ENF | ScheduleCG.* |
| A350 | ENF | ScheduleCG.* |
| A351 | ENF | ScheduleCG.* |
| A352 | ENF | ScheduleCG.* |
| A353 | ENF | ScheduleCG.* |
| A354 | ENF | ScheduleCG.* |
| A355 | ENF | ScheduleCG.* |
| A356 | ENF | ScheduleCG.* |
| A357 | ENF | ScheduleCG.* |
| A358 | ENF | ScheduleCG.* |
| A359 | ENF | ScheduleCG.* |
| A360 | ENF | ScheduleCG.* |
| A361 | ENF | ScheduleCG.* |
| A362 | ENF | ScheduleCG.* |
| A363 | ENF | ScheduleCG.* |
| A364 | ENF | ScheduleCG.* |
| A365 | ENF | ScheduleCG.* |
| A366 | ENF | ScheduleCG.* |
| A367 | ENF | ScheduleCG.* |
| A368 | ENF | ScheduleCG.* |
| A369 | ENF | ScheduleCG.* |
| A370 | ENF | ScheduleCG.* |
| A371 | ENF | ScheduleCG.* |
| A372 | ENF | ScheduleCG.* |
| A373 | ENF | ScheduleCG.* |
| A374 | ENF | ScheduleCG.* |
| A375 | ENF | ScheduleCG.* |
| A376 | ENF | ScheduleCG.* |
| A377 | ENF | ScheduleCG.* |
| A378 | ENF | ScheduleCG.* |
| A379 | ENF | ScheduleCG.* |
| A380 | ENF | ScheduleCG.* |
| A381 | ENF | ScheduleCG.* |
| A382 | ENF | ScheduleCG.* |
| A383 | ENF | ScheduleCG.* |
| A384 | ENF | ScheduleCG.* |
| A385 | ENF | ScheduleCG.* |
| A386 | ENF | ScheduleCG.* |
| A387 | ENF | ScheduleCG.* |
| A388 | ENF | ScheduleCG.* |
| A389 | ENF | ScheduleCG.* |
| A390 | ENF | ScheduleCG.* |
| A391 | ENF | ScheduleCG.* |
| A392 | ENF | ScheduleCG.* |
| A393 | ENF | ScheduleCG.* |
| A394 | ENF | ScheduleCG.* |
| A395 | ENF | ScheduleCG.* |
| A396 | ENF | ScheduleCG.* |
| A397 | ENF | ScheduleCG.* |
| A398 | ENF | ScheduleCG.* |
| A399 | ENF | ScheduleCG.* |
| A400 | ENF | ScheduleCG.* |
| A401 | ENF | ScheduleCG.* |
| A402 | ENF | ScheduleCG.* |
| A403 | ENF | ScheduleCG.* |
| A404 | ENF | ScheduleCG.* |
| A405 | ENF | ScheduleCG.* |
| A406 | ENF | ScheduleCG.* |
| A407 | ENF | ScheduleCG.* |
| A408 | ENF | ScheduleCG.* |
| A409 | ENF | ScheduleCG.* |
| A410 | ENF | ScheduleCG.* |
| A411 | ENF | ScheduleCG.* |
| A412 | ENF | ScheduleCG.* |
| A413 | ENF | ScheduleCG.* |
| A414 | ENF | ScheduleCG.* |
| A415 | ENF | ScheduleCG.* |
| A416 | ENF | ScheduleCG.* |
| A417 | ENF | ScheduleCG.* |
| A418 | ENF | ScheduleCG.* |
| A419 | ENF | ScheduleCG.* |
| A420 | ENF | ScheduleCG.* |
| A421 | ENF | ScheduleCG.* |
| A422 | ENF | ScheduleCG.* |
| A423 | ENF | ScheduleCG.* |
| A424 | ENF | ScheduleCG.* |
| A425 | ENF | ScheduleCG.* |
| A426 | ENF | ScheduleCG.* |
| A427 | ENF | ScheduleCG.* |
| A428 | ENF | ScheduleCG.* |
| A429 | ENF | ScheduleCG.* |
| A430 | ENF | ScheduleCG.* |
| A431 | ENF | ScheduleCG.* |
| A432 | ENF | ScheduleCG.* |
| A433 | ENF | ScheduleCG.* |
| A434 | ENF | ScheduleCG.* |
| A435 | ENF | ScheduleCG.* |
| A436 | ENF | ScheduleCG.* |
| A437 | ENF | ScheduleCG.* |
| A438 | ENF | ScheduleCG.* |
| A439 | ENF | ScheduleCG.* |
| A440 | ENF | Schedule112A.* |
| A441 | ENF | Schedule112A.* |
| A442 | ENF | Schedule112A.* |
| A443 | ENF | Schedule112A.* |
| A444 | ENF | Schedule112A.* |
| A445 | ENF | Schedule112A.* |
| A446 | ENF | Schedule112A.* |
| A447 | ENF | Schedule112A.* |
| A448 | ENF | Schedule112A.* |
| A449 | ENF | Schedule115AD.* |
| A450 | ENF | Schedule115AD.* |
| A451 | ENF | Schedule115AD.* |
| A452 | ENF | Schedule115AD.* |
| A453 | ENF | Schedule115AD.* |
| A454 | ENF | Schedule115AD.* |
| A455 | ENF | Schedule115AD.* |
| A456 | ENF | Schedule115AD.* |
| A457 | ENF | Schedule115AD.* |
| A458 | ENF | ScheduleVDA.* |
| A459 | ENF | ScheduleVDA.* |
| A460 | ENF | ScheduleVDA.* |
| A461 | ENF | ScheduleVDA.* |
| A462 | ENF | ScheduleOS.* |
| A463 | ENF | ScheduleOS.* |
| A464 | ENF | ScheduleOS.* |
| A465 | ENF | ScheduleOS.* |
| A466 | ENF | ScheduleOS.* |
| A467 | ENF | ScheduleOS.* |
| A468 | ENF | ScheduleOS.* |
| A469 | ENF | ScheduleOS.* |
| A470 | ENF | ScheduleOS.* |
| A471 | ENF | ScheduleOS.* |
| A472 | ENF | ScheduleOS.* |
| A473 | ENF | ScheduleOS.* |
| A474 | ENF | ScheduleOS.* |
| A475 | ENF | ScheduleOS.* |
| A476 | ENF | ScheduleOS.* |
| A477 | ENF | ScheduleOS.* |
| A478 | ENF | ScheduleOS.* |
| A479 | ENF | ScheduleOS.* |
| A480 | ENF | ScheduleOS.* |
| A481 | ENF | ScheduleOS.* |
| A482 | ENF | ScheduleOS.* |
| A483 | ENF | ScheduleOS.* |
| A484 | ENF | ScheduleOS.* |
| A485 | ENF | ScheduleOS.* |
| A486 | ENF | ScheduleOS.* |
| A487 | ENF | ScheduleOS.* |
| A488 | ENF | ScheduleOS.* |
| A489 | ENF | ScheduleOS.* |
| A490 | ENF | ScheduleOS.* |
| A491 | ENF | ScheduleOS.* |
| A492 | ENF | ScheduleOS.* |
| A493 | ENF | ScheduleOS.* |
| A494 | ENF | ScheduleOS.* |
| A495 | ENF | ScheduleOS.* |
| A496 | ENF | ScheduleOS.* |
| A497 | ENF | ScheduleOS.* |
| A498 | ENF | ScheduleOS.* |
| A499 | ENF | ScheduleOS.* |
| A500 | ENF | ScheduleOS.* |
| A501 | ENF | ScheduleCYLA.* |
| A502 | ENF | ScheduleCYLA.* |
| A503 | ENF | ScheduleCYLA.* |
| A504 | ENF | ScheduleCYLA.* |
| A505 | ENF | ScheduleCYLA.* |
| A506 | ENF | ScheduleCYLA.* |
| A507 | ENF | ScheduleCYLA.* |
| A508 | ENF | ScheduleCYLA.* |
| A509 | ENF | ScheduleCYLA.* |
| A510 | ENF | ScheduleCYLA.* |
| A511 | ENF | ScheduleCYLA.* |
| A512 | ENF | ScheduleCYLA.* |
| A513 | ENF | ScheduleCYLA.* |
| A514 | ENF | ScheduleCYLA.* |
| A515 | ENF | ScheduleCYLA.* |
| A516 | ENF | ScheduleCYLA.* |
| A517 | ENF | ScheduleCYLA.* |
| A518 | ENF | ScheduleCYLA.* |
| A519 | ENF | ScheduleCYLA.* |
| A520 | ENF | ScheduleCYLA.* |
| A521 | ENF | ScheduleCYLA.* |
| A522 | ENF | ScheduleCYLA.* |
| A523 | ENF | ScheduleCYLA.* |
| A524 | ENF | ScheduleCYLA.* |
| A525 | ENF | ScheduleCYLA.* |
| A526 | ENF | ScheduleCYLA.* |
| A527 | ENF | ScheduleCYLA.* |
| A528 | ENF | ScheduleBFLA.* |
| A529 | ENF | ScheduleBFLA.* |
| A530 | ENF | ScheduleBFLA.* |
| A531 | ENF | ScheduleBFLA.* |
| A532 | ENF | ScheduleBFLA.* |
| A533 | ENF | ScheduleBFLA.* |
| A534 | ENF | ScheduleBFLA.* |
| A535 | ENF | ScheduleBFLA.* |
| A536 | ENF | ScheduleBFLA.* |
| A537 | ENF | ScheduleBFLA.* |
| A538 | ENF | ScheduleBFLA.* |
| A539 | ENF | ScheduleBFLA.* |
| A540 | ENF | ScheduleBFLA.* |
| A541 | ENF | ScheduleBFLA.* |
| A542 | ENF | ScheduleBFLA.* |
| A543 | ENF | ScheduleBFLA.* |
| A544 | ENF | ScheduleBFLA.* |
| A545 | ENF | ScheduleBFLA.* |
| A546 | ENF | ScheduleBFLA.* |
| A547 | ENF | ScheduleBFLA.* |
| A548 | ENF | ScheduleBFLA.* |
| A549 | ENF | ScheduleBFLA.* |
| A550 | ENF | ScheduleBFLA.* |
| A551 | ENF | ScheduleBFLA.* |
| A552 | ENF | ScheduleBFLA.* |
| A553 | ENF | ScheduleBFLA.* |
| A554 | ENF | ScheduleBFLA.* |
| A555 | ENF | ScheduleBFLA.* |
| A556 | ENF | ScheduleCFL.* |
| A557 | ENF | ScheduleCFL.* |
| A558 | ENF | ScheduleCFL.* |
| A559 | ENF | ScheduleCFL.* |
| A560 | ENF | ScheduleCFL.* |
| A561 | ENF | ScheduleCFL.* |
| A562 | ENF | ScheduleCFL.* |
| A563 | ENF | ScheduleCFL.* |
| A564 | ENF | ScheduleCFL.* |
| A565 | ENF | ScheduleCFL.* |
| A566 | ENF | ScheduleCFL.* |
| A567 | ENF | ScheduleCFL.* |
| A568 | ENF | ScheduleCFL.* |
| A569 | ENF | ITRScheduleUD.* |
| A570 | ENF | ITRScheduleUD.* |
| A571 | ENF | ITRScheduleUD.* |
| A572 | ENF | ITRScheduleUD.* |
| A573 | ENF | ITRScheduleUD.* |
| A574 | ENF | ITRScheduleUD.* |
| A575 | ENF | ScheduleICDS.* |
| A576 | ENF | ScheduleICDS.* |
| A577 | ENF | ScheduleICDS.* |
| A578 | ENF | Schedule80GGB.* |
| A579 | ENF | Schedule80GGB.* |
| A580 | ENF | Schedule80GGB.* |
| A581 | ENF | Schedule80GGB.* |
| A582 | ENF | Schedule80GGB.* |
| A583 | ENF | Schedule80GGB.* |
| A584 | ENF | Schedule80GGB.* |
| A585 | ENF | Schedule80GGB.* |
| A586 | ENF | Schedule80GGB.* |
| A587 | ENF | Schedule80GGB.* |
| A588 | ENF | Schedule80GGB.* |
| A589 | ENF | Schedule80GGC.* |
| A590 | ENF | Schedule80GGC.* |
| A591 | ENF | Schedule80GGC.* |
| A592 | ENF | Schedule80GGC.* |
| A593 | ENF | Schedule80GGC.* |
| A594 | ENF | Schedule80GGC.* |
| A595 | ENF | Schedule80GGC.* |
| A596 | ENF | Schedule80GGC.* |
| A597 | ENF | Schedule80GGC.* |
| A598 | ENF | Schedule80GGC.* |
| A599 | ENF | Schedule80IAC.* |
| A600 | ENF | Schedule80IAC.* |
| A601 | ENF | Schedule80IAC.* |
| A602 | ENF | Schedule80IAC.* |
| A603 | ENF | Schedule80IAC.* |
| A604 | ENF | Schedule80LA.* |
| A605 | ENF | Schedule80LA.* |
| A606 | ENF | Schedule80LA.* |
| A607 | ENF | Schedule80LA.* |
| A608 | ENF | Schedule80LA.* |
| A609 | ENF | Schedule80LA.* |
| A610 | ENF | Schedule80LA.* |
| A611 | ENF | Schedule80LA.* |
| A612 | ENF | ScheduleSI.* |
| A613 | ENF | ScheduleSI.* |
| A614 | ENF | ScheduleSI.* |
| A615 | ENF | ScheduleSI.* |
| A616 | ENF | ScheduleSI.* |
| A617 | ENF | ScheduleSI.* |
| A618 | ENF | ScheduleSI.* |
| A619 | ENF | ScheduleSI.* |
| A620 | ENF | ScheduleSI.* |
| A621 | ENF | ScheduleSI.* |
| A622 | ENF | ScheduleSI.* |
| A623 | ENF | ScheduleSI.* |
| A624 | ENF | ScheduleSI.* |
| A625 | ENF | ScheduleSI.* |
| A626 | ENF | ScheduleSI.* |
| A627 | ENF | ScheduleSI.* |
| A628 | ENF | ScheduleSI.* |
| A629 | ENF | ScheduleSI.* |
| A630 | ENF | ScheduleSI.* |
| A631 | ENF | ScheduleSI.* |
| A632 | ENF | ScheduleSI.* |
| A633 | ENF | ScheduleSI.* |
| A634 | ENF | ScheduleSI.* |
| A635 | ENF | ScheduleSI.* |
| A636 | ENF | ScheduleSI.* |
| A637 | ENF | ScheduleSI.* |
| A638 | ENF | ScheduleSI.* |
| A639 | ENF | ScheduleSI.* |
| A640 | ENF | ScheduleSI.* |
| A641 | ENF | ScheduleSI.* |
| A642 | ENF | ScheduleSI.* |
| A643 | ENF | ScheduleSI.* |
| A644 | ENF | ScheduleSI.* |
| A645 | ENF | ScheduleSI.* |
| A646 | ENF | ScheduleEI.* |
| A647 | ENF | ScheduleEI.* |
| A648 | ENF | ScheduleEI.* |
| A649 | ENF | ScheduleEI.* |
| A650 | ENF | ScheduleEI.* |
| A651 | ENF | ScheduleEI.* |
| A652 | NA | "ensure Form 10-II is filed" — a separate form (advisory / portal) |
| A653 | NA | "ensure Form 10-IG/10-IK is filed" — a separate form (advisory / portal) |
| A654 | ENF | ScheduleEI.* |
| A655 | ENF | ScheduleEI.* |
| A656 | ENF | ScheduleEI.* |
| A657 | ENF | ScheduleEI.* |
| A658 | ENF | ScheduleEI.* |
| A659 | ENF | ScheduleEI.* |
| A660 | ENF | ScheduleEI.* |
| A661 | ENF | ScheduleEI.* |
| A662 | ENF | SchedulePTI.* |
| A663 | ENF | SchedulePTI.* |
| A664 | ENF | SchedulePTI.* |
| A665 | ENF | SchedulePTI.* |
| A666 | ENF | ScheduleMAT.* |
| A667 | ENF | ScheduleMAT.* |
| A668 | ENF | ScheduleMAT.* |
| A669 | ENF | ScheduleMAT.* |
| A670 | ENF | ScheduleMAT.* |
| A671 | ENF | ScheduleMAT.* |
| A672 | ENF | ScheduleMAT.* |
| A673 | ENF | ScheduleMAT.* |
| A674 | ENF | ScheduleMAT.* |
| A675 | ENF | ScheduleMAT.* |
| A676 | ENF | ScheduleMAT.* |
| A677 | ENF | ScheduleMATC.* |
| A678 | ENF | ScheduleMATC.* |
| A679 | ENF | ScheduleMATC.* |
| A680 | ENF | ScheduleMATC.* |
| A681 | ENF | ScheduleMATC.* |
| A682 | ENF | ScheduleMATC.* |
| A683 | ENF | ScheduleMATC.* |
| A684 | ENF | ScheduleMATC.* |
| A685 | ENF | ScheduleMATC.* |
| A686 | ENF | ScheduleMATC.* |
| A687 | ENF | ScheduleTPSA.* |
| A688 | ENF | ScheduleTPSA.* |
| A689 | ENF | ScheduleTPSA.* |
| A690 | ENF | ScheduleTPSA.* |
| A691 | ENF | ScheduleTPSA.* |
| A692 | ENF | ScheduleTPSA.* |
| A693 | ENF | ScheduleTPSA.* |
| A694 | NA | tax-deposit date ≤ system clock — server-clock comparison (portal) |
| A695 | ENF | Schedule115TD.* |
| A696 | ENF | Schedule115TD.* |
| A697 | ENF | Schedule115TD.* |
| A698 | ENF | Schedule115TD.* |
| A699 | ENF | Schedule115TD.* |
| A700 | ENF | Schedule115TD.* |
| A701 | ENF | ScheduleFSI.* |
| A702 | ENF | ScheduleFSI.* |
| A703 | ENF | ScheduleFSI.* |
| A704 | ENF | ScheduleFSI.* |
| A705 | ENF | ScheduleFSI.* |
| A706 | ENF | ScheduleFSI.* |
| A707 | ENF | ScheduleFSI.* |
| A708 | ENF | ScheduleTR1.* |
| A709 | ENF | ScheduleTR1.* |
| A710 | ENF | ScheduleTR1.* |
| A711 | ENF | ScheduleTR1.* |
| A712 | ENF | ScheduleTR1.* |
| A713 | ENF | ScheduleTR1.* |
| A714 | ENF | ScheduleGST.* |
| A715 | ENF | ScheduleGST.* |
| A716 | ENF | PartB-TI.* |
| A717 | ENF | PartB-TI.* |
| A718 | ENF | PartB-TI.* |
| A719 | ENF | PartB-TI.* |
| A720 | ENF | PartB-TI.* |
| A721 | ENF | PartB-TI.* |
| A722 | ENF | PartB-TI.* |
| A723 | ENF | PartB-TI.* |
| A724 | ENF | PartB-TI.* |
| A725 | ENF | PartB-TI.* |
| A726 | ENF | PartB-TI.* |
| A727 | ENF | PartB-TI.* |
| A728 | ENF | PartB-TI.* |
| A729 | ENF | PartB-TI.* |
| A730 | ENF | PartB-TI.* |
| A731 | ENF | PartB-TI.* |
| A732 | ENF | PartB-TI.* |
| A733 | ENF | PartB-TI.* |
| A734 | ENF | PartB-TI.* |
| A735 | ENF | PartB-TI.* |
| A736 | ENF | PartB-TI.* |
| A737 | ENF | PartB-TI.* |
| A738 | ENF | PartB-TI.* |
| A739 | ENF | PartB-TI.* |
| A740 | ENF | PartB-TI.* |
| A741 | ENF | PartB-TI.* |
| A742 | ENF | PartB-TI.* |
| A743 | ENF | PartB-TI.* |
| A744 | ENF | PartB-TI.* |
| A745 | ENF | PartB-TI.* |
| A746 | ENF | PartB-TI.* |
| A747 | ENF | PartB-TI.* |
| A748 | ENF | PartB-TI.* |
| A749 | ENF | PartB-TI.* |
| A750 | ENF | PartB-TI.* |
| A751 | ENF | PartB-TI.* |
| A752 | ENF | PartB-TI.* |
| A753 | ENF | PartB-TI.* |
| A754 | ENF | PartB-TI.* |
| A755 | ENF | PartB_TTI.* |
| A756 | ENF | PartB_TTI.* |
| A757 | ENF | PartB_TTI.* |
| A758 | ENF | PartB_TTI.* |
| A759 | ENF | PartB_TTI.* |
| A760 | ENF | PartB_TTI.* |
| A761 | ENF | PartB_TTI.* |
| A762 | ENF | PartB_TTI.* |
| A763 | ENF | PartB_TTI.* |
| A764 | ENF | PartB_TTI.* |
| A765 | OFF | IFSC must tally with the live RBI IFSC database — external DB, no offline table shipped |
| A766 | ENF | PartB_TTI.* |
| A767 | ENF | PartB_TTI.* |
| A768 | ENF | PartB_TTI.* |
| A769 | ENF | PartB_TTI.* |
| A770 | ENF | PartB_TTI.* |
| A771 | ENF | PartB_TTI.* |
| A772 | ENF | PartB_TTI.* |
| A773 | ENF | PartB_TTI.* |
| A774 | ENF | PartB_TTI.* |
| A775 | ENF | PartB_TTI.* |
| A776 | ENF | PartB_TTI.* |
| A777 | ENF | PartB_TTI.* |
| A778 | ENF | PartB_TTI.* |
| A779 | ENF | PartB_TTI.* |
| A780 | ENF | Schedule115TD.* |
| A781 | ENF | PartB_TTI.* |
| A782 | ENF | PartB_TTI.* |
| A783 | NA | 234F/234-I fee keyed to the actual filing date — portal timestamp |
| A784 | NA | 234F/234-I fee keyed to the actual filing date — portal timestamp |
| A785 | ENF | ScheduleIT.* |
| A786 | ENF | ScheduleFA.* |
| A787 | ENF | ScheduleFA.* |
| A788 | ENF | ScheduleTDS2 / ScheduleTDS3.* |
| A789 | ENF | ScheduleTDS2 / ScheduleTDS3.* |
| A790 | ENF | ScheduleTDS2 / ScheduleTDS3.* |
| A791 | ENF | ScheduleTDS2 / ScheduleTDS3.* |
| A792 | ENF | ScheduleTDS2 / ScheduleTDS3.* |
| A793 | ENF | ScheduleTDS2 / ScheduleTDS3.* |
| A794 | ENF | ScheduleTDS2 / ScheduleTDS3.* |
| A795 | ENF | ScheduleTDS2 / ScheduleTDS3.* |
| A796 | ENF | ScheduleTDS2 / ScheduleTDS3.* |
| A797 | ENF | ScheduleTDS2 / ScheduleTDS3.* |
| A798 | ENF | ScheduleTDS2 / ScheduleTDS3.* |
| A799 | ENF | ScheduleTCS.* |
| A800 | ENF | ScheduleTCS.* |
| A801 | ENF | ScheduleTCS.* |
| A802 | ENF | ScheduleTCS.* |
| A803 | ENF | ScheduleTCS.* |
| A804 | ENF | ScheduleTCS.* |
| A805 | ENF | ScheduleTCS.* |
| A806 | ENF | Schedule80G.* |
| A807 | ENF | Schedule80G.* |
| A808 | ENF | Schedule80G.* |
| A809 | ENF | Schedule80G.* |
| A810 | ENF | Schedule80G.* |
| A811 | ENF | Schedule80G.* |
| A812 | ENF | Schedule80G.* |
| A813 | ENF | Schedule80G.* |
| A814 | ENF | Schedule80G.* |
| A815 | ENF | Schedule80G.* |
| A816 | ENF | Schedule80G.* |
| A817 | ENF | Schedule80G.* |
| A818 | ENF | Schedule80GGA.* |
| A819 | ENF | Schedule80GGA.* |
| A820 | ENF | Schedule80GGA.* |
| A821 | ENF | Schedule80GGA.* |
| A822 | ENF | Schedule80GGA.* |
| A823 | ENF | Schedule80_IA.* |
| A824 | ENF | Schedule80_IB.* |
| A825 | ENF | Schedule80_IC.* |
| A826 | ENF | Schedule10AA.* |
| A827 | ENF | ScheduleIF.* |
| A828 | ENF | ScheduleVIA.* |
| A829 | ENF | ScheduleVIA.* |
| A830 | ENF | ScheduleVIA.* |
| A831 | ENF | ScheduleVIA.* |
| A832 | ENF | ScheduleVIA.* |
| A833 | ENF | ScheduleVIA.* |
| A834 | ENF | ScheduleVIA.* |
| A835 | ENF | ScheduleVIA.* |
| A836 | ENF | ScheduleVIA.* |
| A837 | ENF | ScheduleVIA.* |
| A838 | ENF | ScheduleVIA.* |
| A839 | ENF | ScheduleVIA.* |
| A840 | ENF | ScheduleVIA.* |
| A841 | ENF | ScheduleVIA.* |
| A842 | ENF | ScheduleVIA.* |
| A843 | ENF | ScheduleVIA.* |
| A844 | ENF | ScheduleVIA.* |
| A845 | ENF | ScheduleVIA.* |
| A846 | ENF | ScheduleVIA.* |
| A847 | ENF | ScheduleVIA.* |
| A848 | ENF | ScheduleVIA.* |
| A849 | ENF | ScheduleVIA.* |
| A850 | ENF | ScheduleVIA.* |
| A851 | ENF | ScheduleVIA.* |
| A852 | ENF | ScheduleVIA.* |
| A853 | ENF | ScheduleVIA.* |
| A854 | ENF | ScheduleVIA.* |
| A855 | ENF | ScheduleVIA.* |
| A856 | ENF | ScheduleVIA.* |
| A857 | ENF | ScheduleVIA.* |
| A858 | ENF | ScheduleVIA.* |
| A859 | ENF | ScheduleVIA.* |
| A860 | ENF | ScheduleVIA.* |
| A861 | ENF | ScheduleVIA.* |
| A862 | ENF | ScheduleVIA.* |
| A863 | ENF | ScheduleVIA.* |
| A864 | ENF | ScheduleVIA.* |
| A865 | ENF | ScheduleVIA.* |
| A866 | ENF | ScheduleVIA.* |
| A867 | ENF | Verification.* |
| A868 | ENF | Verification.* |
