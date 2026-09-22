# ITR-3 integration — bug log (integrator)

Status: Gates 0–7 all GREEN. Hand vs engine: GTI 3,273,500 (hand) = 3,273,500 (engine); TI 1,786,500 = 1,786,500. Export succeeds; 0 Category-A rules; 0 schema errors; round-trip identical.

## Cross-section bugs found and fixed

### Paint / runtime
- `secBpa` read `B.qd.trd/raw/fin` and `B.gst` unguarded → crash when the client left `qd:{}`/`gst:{}`. Normalised at the top of secBpa (arrays defaulted); also guarded `B.pl.NonResidentPLDetails`.

### Engine feed / compute order
- `engSal` returned its result but never stored `S.C.sal`, so loss/CYLA and Part B-TI read nothing → CYLA had no Salary row and Part B-TI salary was 0 (A571/A920). Now stores `S.C.sal`.
- `other`/PTI section ran at order 24, after HP (12) and EI (18), so HP `PassThroghIncome` and EI exempt pass-through never populated (A222/A992). Moved `other` to order 11 (its PTI is computed purely from raw state, no head dependency).
- tax Part B-TI item 12a (`PartBchapterVIA`) dropped Part CA & D of Chapter VI-A → understated total VI-A (inflated TI) and failed A942. Now 12a = Part B + Part CA & D per book J41.
- OS 57(iia) family-pension deduction was hard-capped at ₹25,000; old regime cap is ₹15,000 (A531). Now regime-aware.
- tax read advance-tax/SAT challans from the top-level mirror `S.it`, which the import never restores → 234C wrong on round-trip. Now reads canonical `S.paid.it`.

### Export schema-key / value bugs
- salary: HRA 10(13A) exemption not added to `AllwncExemptUs10Dtls`, so the aggregate `AllwncExtentExemptUs10` (which includes HRA) ≠ sum of rows (A162) and `ex("10(13A)")` ≠ table (A38). Now emits a 10(13A) drop-down row; import excludes it to avoid double-count on round-trip.
- who: `PortugeseCC5A` filing-status flag was never written, so a filled Schedule 5A tripped A7/A22. Now written from `S.pi.s5a`; import restores `S.pi.s5a` from it.
- ded 80-IA/80-IB: `Sch80SectionCode`/`Sch80LocOrDescCode` used the filer's free-text code instead of the fixed schema codes (80-IA/POWER, 80-IB/COMM_PROD/HOUSING_PROJECT/STOR_TRANS); empty required `Sch80DeductAmtDtls` emitted. Fixed to fixed codes; omit empty Dtls.
- CG `ScheduleCGFor23`: many required sub-objects/leaves omitted when the client has no such transaction (SlumpSaleInStcg, NRITransacSec48Dtl, NRISecur115AD, SaleOnOtherAssets; LT SlumpSaleInLtcgDtls, NRISaleOfEquityShareUs112A, NRISaleofForeignAsset, SaleofAssetNADtls; CurrYrLosses.TotLossSetOff/LossRemainSetOff; AccruOrRecOfCG.VDATrnsfGainsUnder30Per; DeducClaimInfo). Now emits zero-stubs unconditionally.
- CG land buyer table (`TrnsfImmblPrprty`) not restored on import → dropped on re-export (round-trip). Import now rebuilds buyers + property address.
- BP items 25/32 (`IncProfDecLossAccICDSAdj`/`Dec...`) export = OI-typed part + Schedule ICDS total, but import stored the combined value into `S.bp.i25/i32` while also restoring `S.icds` → ICDS double-counted on re-export. Import now strips the ICDS-schedule contribution.
- BP DOA blocks wrote a `Total` key that exists only on the DPM DepreciationDetail, not DOA. Gated off for DOA.
- FA: required per-row numerics (`TotGrossAmtPaidCredited`, `TotGrossProceeds`, `IncDrvAsset`, `IncTaxAmt`) were skipped when zero, and `IncTaxSchNo` (minLength 1) was empty. Now force-written; `IncTaxSchNo` defaults to "-".
- who: `BenefitUs115HFlg` written non-deterministically (absent vs "N") → round-trip drift. Now always "N" default when applicable.
- SKEL meta: CreationInfo/Form_ITR3 used "na" placeholders violating schema patterns. Set Digest "-", SW/JSONCreatedBy "SW10000000", Schema/FormVer "Ver1.0".

### Rule-encoding bugs (fixed to the rule's text, not weakened)
- A204/A206: `ActlRentPaid10Per` is already "rent − 10% of salary" (book E72); the rules subtracted it from rent again. Now compare against it directly.
- A172 / govt check: used employer codes CG/SG/PE; the enum is CGOV/SGOV/PSU. Corrected.
- A552: CYLA HP income compares to MAX(0, Sch HP item 3) per book F9 (was raw signed item 3, which fails whenever HP is a loss).
- A355/A356: summed a non-existent per-row field `STCGonImmvblPrprty`/`LTCGonImmvblPrprty`; the schema field is `CapgainonAssets`.
- A393: read `Schedule112A.TotalBalance112A`; the schema col-14 total is `Balance112A`.

### Test-client (state.js) corrections toward a lawful, complete S SUDHIR
- PRAN added for 80CCD(1B); TPSA challan date moved out of the future and given bank/serial; EI item-5 pass-through set to 25,000 (matches Sch PTI); self-occupied HP interest capped at ₹2,00,000 (rule 1075); filing flags Y/N; ItrFilingDueDate a valid enum (2026-10-31); audit percentages Upto5Per; other-audit section 80-IA; TradingAccount array field names (OperatingRevenueName, NatureOfIncome).

## Remaining / notes
- Nothing failing. Absent schema blocks (ManufacturingAccount, PARTA_OI, PARTA_QD, Schedule115AD, Schedule80GGA/80EE/80RA/80_IC, ScheduleGST) are not applicable to this client and are logged absent by the gate, not errors.
- Category-D advisories still surface at export (Form 29C for AMT, Form 10DA for 80JJAA, Form 56F for 10AA) — these are attach-a-form reminders, not blocking.
