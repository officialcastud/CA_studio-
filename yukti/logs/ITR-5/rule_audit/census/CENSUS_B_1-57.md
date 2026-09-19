# ITR-5 rule census — SLICE B_1-57 (Category-B, serials 1–57)

Category-B rules are advisory; when encoded they use `Dd(n,cond,msg)` (category "D",
"may be defective u/s 139(9)"). Encoded serials verified by grepping every
`forms/ITR-5/src/61_rules_enc_*.js`: Category-B is encoded **only** via `Dd(...)`,
and the complete set of `Dd(` calls is serials 15,16,23,25 (enc_21) and
35,36,46,47,48,49,55,56 (enc_22) — 12 in all. Serial 28 was deliberately downgraded
to not-mappable. No Category-B serial in 1–57 is encoded in any other file.

Reminder applied: Category-B being *advisory* does NOT excuse a MISSING — if a rule is
offline-checkable against existing schema fields, it should have been a `Dd`.

| serial | cat | bucket | justification (field / reason) |
|---|---|---|---|
| 1 | B | NA | Form 29C filing status (AMT) — external form/portal record, no schema field. |
| 2 | B | NA | Part B-TI 11b allowed only if original return filed by 139(1) due date — filing-date/portal state. |
| 3 | B | NA | 80LA / 80LA(1) allowed only if Form 10CCF filed — form-filing status, external. |
| 4 | B | NA | Presumptive gross-receipts/floor OR-condition; gated on 44AB-audit/book-maintenance status + presumptive election; stitched cross-serial fragment, no self-contained assertion. |
| 5 | B | NA | 44AD presumptive floor (6%/8%) gated on book-maintenance / 44AB-audit state; fragment. |
| 6 | B | NA | 44ADA presumptive floor (50%) gated on book-maintenance / 44AB-audit state; fragment. |
| 7 | B | OFFLINE-IMPOSSIBLE | "Name" in Part A-General must match PAN database — external DB (name match). |
| 8 | B | NA | Return u/s 142(1) → cannot file revised return — filing-history/portal state. |
| 9 | B | NA | 44AB audit → must file Form 3CA-3CD / 3CB-3CD — form-filing status. |
| 10 | B | NA | 44DA audit → must file Form 3CE — form-filing status. |
| 11 | B | NA | 92E audit → must file Form 3CEB — form-filing status. |
| 12 | B | NA | AMT u/s 115JC → must file Form 29C — form-filing status. |
| 13 | B | NA | Return cannot be filed if assessment u/s 143(3)/144 completed — assessment/portal state. |
| 14 | B | OFFLINE-IMPOSSIBLE | IFSC (Bank Details / 80G / 80GGC) vs RBI database — external DB. |
| 15 | B | ENCODED | `Dd(15)` enc_21 — PartB-TI.TotalIncome & PartB_TTI GrossTaxLiability nil while TotalTaxesPaid>0. |
| 16 | B | ENCODED | `Dd(16)` enc_21 — PartB-TI.IncChargeableTaxSplRates>0 while ScheduleSI.TotSplRateInc<=0. |
| 17 | B | NA | Relief u/s 90 & 91 → must file Form 67 — form-filing status. |
| 18 | B | NA | 10AA deduction → must file ITR within due date — due-date/filing state. |
| 19 | B | NA | 115BBF allowed only if original return filed within due date — due-date/filing state. |
| 20 | B | NA | 115BBF without Form 3CFA / not filed within due date — form-filing + due-date state. |
| 21 | B | NA | Once proceeding u/s 148 initiated, 139 return cannot be revised — proceeding/portal state. |
| 22 | B | NA | 80-I(7)/80-IA(7)/80IAB/80IAC/80-IB/80IC/80IE only if Form 10CCB filed within due date — form+due-date. |
| 23 | B | ENCODED | `Dd(23)` enc_21 — surcharge on AMT vs ScheduleAMT.AdjustedUnderSec115JC>₹50L threshold. |
| 24 | B | NA | 80JJAA deduction → Form 10DA required — form-filing status. |
| 25 | B | ENCODED | `Dd(25)` enc_21 — CorpScheduleBP.IncChrgUnHdProftGain>2.5L → PARTA_PL & PARTA_BS present. |
| 26 | B | NA | 10AA claimed only if Form 56F filed — form-filing status (BP>2.5L→P&L/BS limb is encoded as B25). |
| 27 | B | OFFLINE-IMPOSSIBLE | AMT total income negative only if loss from specified business — no schema field flags the loss origin, and 70_sec_amt floors Sl.1 at 0 offline. |
| 28 | B | OFFLINE-IMPOSSIBLE | Sl.10 quarterly break-up of 1a(i) dividend — Schedule OS exports 8 distinct dividend DateRange blocks, none a clean "generic 1a(i) normal dividend" bucket; deliberately downgraded (ambiguous, literal encoding false-fires). |
| 29 | B | NA | 35(2AB) in-house R&D → Form 3CLA required — form-filing status (adj-expenditure formula only referenced by downgraded B28). |
| 30 | B | NA | 10(23FF) > 0 → fill Form 10-II — form-filing nudge; EI carries only category codes. |
| 31 | B | NA | Audit mandatory if profit < 8% of turnover — 44AB/44AD mandate turns on presumptive-eligibility context; literal check false-fires on lawful non-presumptive returns. |
| 32 | B | NA | Co-op 115BAD earlier-year option + Form 10-IF within due date — form/portal earlier-year state; fragment. |
| 33 | B | NA | Co-op 115BAD earlier-year benefit/option state + Form 10-IF — form/portal state; fragment. |
| 34 | B | NA | Co-op 115BAD tail + 10(4D)>0 → Form 10-IK/10-IG — form-filing + earlier-year DB state. |
| 35 | B | ENCODED | `Dd(35)` enc_22 — PartB_TTI.Refund.RefundDue>=₹50cr → PartA_GEN1 LEINumber present. |
| 36 | B | ENCODED | `Dd(36)` enc_22 — PartA_GEN2 turnover band Upto10CR + cash >5% → LiableSec44ABflg="Y". |
| 37 | B | OFFLINE-IMPOSSIBLE | "OS dividend > income reduced from Schedule BP" — no determinate schema field for the reconciliation target; the only candidate (BP A3ci) false-fires since dividend not routed through P&L is lawful. |
| 38 | B | NA | Nil return → check AIS/26AS — external (AIS/26AS) comparison + soft nudge. |
| 39 | B | NA | TDS in another person's hands allowed only if they declare it — depends on a third party's ITR. |
| 40 | B | NA | TCS in another person's hands allowed only if they declare it — depends on a third party's ITR. |
| 41 | B | NA | Resident DTAA-rate re-check nudge; residents may lawfully claim DTAA via Schedule TR/FSI — no silent-on-lawful assertion. |
| 42 | B | NA | Co-op 115BAE opening fragment — earlier-AY (2024-25/2025-26) benefit + option/portal state; fragment. |
| 43 | B | NA | Co-op 115BAE option "No" to earlier-AY exercise — earlier-AY DB/option state; fragment. |
| 44 | B | NA | Co-op 115BAE tail (form/portal earlier-AY state) + "CG Table E entire loss set off with available gains" — Table E set-off is auto-computed maximal (70_sec_cg L327/714), so structurally enforced, not a single-field advisory assertion; validating an override needs full-matrix recomputation. |
| 45 | B | NA | DTAA claimed → non-residents must file Form 10F — form-filing status. |
| 46 | B | ENCODED | `Dd(46)` enc_22 — TDS 194S gross vs ScheduleVDA consideration received. |
| 47 | B | ENCODED | `Dd(47)` enc_22 — TDS 194B gross vs ScheduleOS 115BB winnings. |
| 48 | B | ENCODED | `Dd(48)` enc_22 — TDS 194BB gross vs ScheduleOS race-horse receipts. |
| 49 | B | ENCODED | `Dd(49)` enc_22 — TDS 194BA gross vs ScheduleOS 115BBJ online-game winnings. |
| 50 | B | NA | Form 10IEA details must match Schedule Part A-General — department-database match, external. |
| 51 | B | NA | Form 10IEA details missing/not matching database — database match, external. |
| **52** | **B** | **MISSING** | **"Current-year losses to carry forward must be 0 if return filed u/s 139(4)." ALL fields exist: filing section `PartA_GEN1.FilingStatus.ReturnFileSec.IncomeTaxSec` (="12" belated); per-head current-year CF `ScheduleCFL.CurrentYearLossCF.LossSummaryDetail.{BusLossOthThanSpecLossCF, LossFrmSpecBusCF, LossFrmSpecifiedBusCF, TotalSTCGPTILossCF, TotalLTCGPTILossCF, OthSrcLossRaceHorseCF}` — sum must be 0 (HP field `TotalHPPTILossCF` excluded, since s.71B HP loss / s.32(2) unabsorbed depreciation are lawfully carried forward when belated). Self-contained offline arithmetic; the enc_22 "no per-head breakdown → false-fire" reason is refuted by the schema emit (70_sec_loss.js L467-468, L474).** |
| 53 | B | OFFLINE-IMPOSSIBLE | 80G against "valid Donee PANs only" — "valid/approved donee" is a department-DB check, not an offline schema assertion. |
| 54 | B | NA | Profession turnover < 50/75L + profit < 50% → 44ADA audit mandatory — mandate turns on presumptive election; literal check false-fires on lawful non-presumptive returns. |
| 55 | B | ENCODED | `Dd(55)` enc_22 — ScheduleIF interest total vs PARTA_PL.CreditsToPL.OthIncome.AmtofInterest (14xi(b)). |
| 56 | B | ENCODED | `Dd(56)` enc_22 — ScheduleOS 3C(i) IntExp57 <= 20% of dividend (1a(i)+1a(ii), tightened by PartB-TI 13-14). |
| 57 | B | NA | "Temporary calculated values a/b/c" are the computation detail for serial 56 (non-rule note); trailing "P&L loss without books + 44AB audit" references book-maintenance state, no offline field. |

## Counts per bucket (sum = 57)
- ENCODED (12): 15, 16, 23, 25, 35, 36, 46, 47, 48, 49, 55, 56
- NA (38): 1, 2, 3, 4, 5, 6, 8, 9, 10, 11, 12, 13, 17, 18, 19, 20, 21, 22, 24, 26, 29, 30, 31, 32, 33, 34, 38, 39, 40, 41, 42, 43, 44, 45, 50, 51, 54, 57
- OFFLINE-IMPOSSIBLE (6): 7, 14, 27, 28, 37, 53
- MISSING (1): 52

**MISSING: 52 — "Current-year losses to be carried forward should not be more than ZERO if return is filed under 139(4)." Offline-checkable from `PartA_GEN1.FilingStatus.ReturnFileSec.IncomeTaxSec` (="12") plus the per-head `ScheduleCFL.CurrentYearLossCF.LossSummaryDetail` business/speculation/specified/STCL/LTCL/race-horse fields (excluding the HP field), but was not encoded.**
