# ITR-1 · AY 2026-27 — Validation-rule census (Phase 6)

Every CBDT ITR-1 validation serial in `books/ITR-1/rules.json` is classified into one of the constitution buckets, so Phase-6 Gate-6 can prove **MISSING = 0**. The built return read by the encoder is `I = Object.values(buildReturn().ITR)[0]` (root **ITR1**); every path below is a key on `I` (confirmed against `books/ITR-1/schema_tree.md`, `blocks.json`, `caps.md` and the section `exp*()` builders in `forms/ITR-1/src/70_sec_*.js`).

`rules.json` holds **339 Category-A** (blocking — return not allowed to upload) and **9 Category-D** (advisory / may be defective u/s 139(9)) serials. Category-A serials are numbered A1–A339; Category-D serials are numbered D1–D9 (a separate `n` sequence in the file).

> **rules.json line-wrap.** The source text wraps each serial by ~one physical line, so raw entry *n* carries the tail of rule *n−1* and the head of rule *n*. The classification below is made against the **re-joined** semantic rule, not the raw fragment; the reference encoder `61_rules_enc_01.js` encodes to the same re-joined reading.

## Buckets

- **ENFORCED-target** — offline-checkable against a schema key that exists on the built return; encoded as `A(serial, cond, msg)` (Category A) or an advisory `Dd(serial, cond, msg)` (Category D), cond TRUE on a lawful return, FALSE on a violation.
- **NA** — not this form's job: resolved by the e-filing portal, by a server clock / the filing timestamp (which the built return does **not** carry), by AIS/26AS, or by another form / another return. Nothing to encode offline.
- **OFFLINE-IMPOSSIBLE** — cannot be checked offline without faking it: the rule needs an external database not shipped (PAN-name, RBI/GIFT IFSC) or a field the ITR-1 schema does not carry.
- **MISSING** — a serial with no bucket. Must be **0**. This census leaves none.

## Counts

| Category | ENFORCED-target | NA | OFFLINE-IMPOSSIBLE | Total |
|---|--:|--:|--:|--:|
| **A** (blocking) | 324 | 10 | 5 | 339 |
| **D** (advisory) | 9 | 0 | 0 | 9 |

MISSING (A) = 339 − 324 − 10 − 5 = **0**.  MISSING (D) = 9 − 9 − 0 − 0 = **0**.

### Category-A NA serials (10)

- **A113** — TDS claimed but receipts per Form 26AS not offered -- AIS/26AS reconciliation
- **A126** — original return u/s 142(1) then no 139 return -- checked at upload (portal)
- **A151** — old regime cannot be selected after the 139(1) due date -- filing timestamp (clock)
- **A152** — once 148 proceeding initiated no 139 return -- blocked at upload (portal)
- **A189** — 139(5) over an original 139(4) => old regime barred -- original-return section not carried (portal)
- **A190** — withdraw from new regime barred after 139(1) due date -- filing timestamp (clock)
- **A212** — Aadhaar in return vs Aadhaar as per profile -- portal profile
- **A219** — 139(9) A23 responses match the defective original -- portal cross-return
- **A324** — 234-I fee = 1,000 if filed after 31.12.2026 & 139(5) & TI<=5L -- filing timestamp (clock)
- **A328** — 234-I fee = 5,000 if filed after 31.12.2026 & 139(5) & TI>5L -- filing timestamp (clock)

> The 234-I fee serials A324/A328 and the regime-timing serials A151/A190 are keyed to the **filing timestamp** (filed after the 139(1) due date / after 31.12.2026), which the built return does not carry — the portal applies them at upload. A126/A152/A189/A219 are portal/other-return cross-checks; A212 compares to the portal profile; A113 reconciles against Form 26AS / AIS.

### Category-A OFFLINE-IMPOSSIBLE serials (5)

- **A7** — 80DDB 'Self or Dependent' 40,000 cap needs Section80DDBUsrType (self/dependent vs senior patient); expDed does not emit that leaf to the built return, so the 40,000-vs-1,00,000 branch cannot be resolved offline (A5's <=1,00,000 bound is the encodable part)
- **A19** — name in return vs PAN database -- external DB not shipped (portal resolves at upload)
- **A107** — IFSC vs RBI / GIFT IFSC database -- external DB not shipped
- **A187** — 80CCH needs age 17-27 at date of joining armed forces -- date of joining not carried
- **A268** — individual with date of formation on/after 01.04.2008 barred -- no formation-date field for an individual (vacuous)

> A19 (name vs PAN) and A107 (IFSC vs RBI/GIFT) need external databases not shipped — the portal resolves them at upload. A187 needs the date of joining the armed forces (age 17-27 test), a field the ITR-1 schema does not carry. A268 targets an individual's *date of formation*, which does not exist for an individual assessee (the built return carries only PersonalInfo.DOB), so any literal encoding would be vacuous.

## Category-A by schema block (ENFORCED-target)

Cross-schedule serials are filed under their **assertion target** (the block whose key the rule reads to decide). Counts below are ENFORCED serials only; NA/OFFLINE in each band are listed in the counts above.

| Schema block on `I` | ENFORCED serials |
|---|--:|
| `PersonalInfo.*` | 3 — A210, A338–A339 |
| `FilingStatus.* / AssesseeRep` | 3 — A293–A294, A331 |
| `IncomeDeductions — Salary head + AllwncExemptUs10` | 43 — A37, A57–A77, A112, A142, A148–A150, A161, A163–A167, A176–A177, A185, A188, A213, A215, A267, A269–A270, A301 |
| `ScheduleEA10_13A.* (HRA)` | 6 — A261–A266 |
| `IncomeDeductions.PropertyDetails[] (House property)` | 23 — A43–A49, A162, A220, A240, A246, A253, A271, A295–A300, A332–A334, A336 |
| `IncomeDeductions — Other Sources` | 9 — A50–A56, A145, A214 |
| `LTCG112A.*` | 3 — A217–A218, A292 |
| `IncomeDeductions.ExemptIncAgriOthUs10.*` | 36 — A29–A36, A38–A42, A141, A184, A303–A323 |
| `IncomeDeductions — GTI / TotalIncome` | 6 — A20, A22, A24, A117, A160, A174 |
| `IncomeDeductions — Chapter VI-A` | 64 — A1–A6, A11–A18, A114–A116, A119–A124, A146, A153–A155, A157–A159, A168–A172, A186, A216, A221, A226, A233, A239, A272–A291, A302, A335, A337 |
| `Schedule80C.*` | 4 — A224, A241, A247, A255 |
| `Schedule80D.*` | 28 — A127–A138, A173, A178–A183, A234–A237, A254, A256–A259 |
| `Schedule80DD.*` | 5 — A203–A206, A209 |
| `Schedule80U.*` | 6 — A200–A202, A207–A208, A238 |
| `Schedule80E/80EE/80EEA/80EEB.*` | 18 — A222–A223, A225, A227–A232, A242–A245, A248–A252 |
| `Schedule80G.*` | 20 — A8–A10, A78–A88, A139, A147, A156, A325–A327 |
| `Schedule80GGA.*` | 10 — A89–A94, A118, A143–A144, A175 |
| `Schedule80GGC.*` | 10 — A193–A199, A211, A329–A330 |
| `ITR1_TaxComputation.*` | 10 — A21, A23, A25–A28, A125, A140, A191–A192 |
| `TaxPaid.*` | 5 — A103–A104, A106, A108–A109 |
| `Refund.*` | 1 — A105 |
| `TDS / TCS / TaxPayments schedules` | 11 — A95–A102, A110–A111, A260 |
| **Total ENFORCED (A)** | **324** |

## Batch plan — ENFORCED Category-A serials, ~50 per file

The 324 ENFORCED Category-A serials are partitioned into **7** contiguous serial-range files `forms/ITR-1/src/61_rules_enc_NN.js`, each registered with `ruleset(fn)` (disjoint files → parallel fan-out, no merge conflicts). NA/OFFLINE serials inside a range are **skipped** (bucketed above) and named in that file's header. The 9 Category-D advisories are encoded as `Dd(serial,…)` in a final batch file `61_rules_enc_08.js`.

| File | Serial range | ENFORCED (coded) | NA / OFFLINE skipped in range |
|---|---|--:|---|
| `61_rules_enc_01.js` | A1–A50 | 48 | A7(OFF), A19(OFF) |
| `61_rules_enc_02.js` | A51–A100 | 50 | — |
| `61_rules_enc_03.js` | A101–A150 | 47 | A107(OFF), A113(NA), A126(NA) |
| `61_rules_enc_04.js` | A151–A200 | 45 | A151(NA), A152(NA), A187(OFF), A189(NA), A190(NA) |
| `61_rules_enc_05.js` | A201–A250 | 48 | A212(NA), A219(NA) |
| `61_rules_enc_06.js` | A251–A300 | 49 | A268(OFF) |
| `61_rules_enc_07.js` | A301–A339 | 37 | A324(NA), A328(NA) |
| `61_rules_enc_08.js` | D1–D9 | 9 `Dd` | — |
| **Total** | | **324 A + 9 D** | 10 NA + 5 OFFLINE |

Per-file block coverage:

- **enc_01** (A1–A50): Chapter VI-A caps (80C/80CCD/80DDB/80TTA/80TTB), Schedule80G opening, GTI/TotalIncome, ITR1_TaxComputation roll-ups, ExemptIncAgriOthUs10 uniqueness, House property, Other Sources (A1–A50)
- **enc_02** (A51–A100): Salary head + AllwncExemptUs10 caps/roll-ups (A57–A77), Schedule80G buckets & totals (A78–A88), Schedule80GGA (A89–A94), TDS/TCS/IT schedule totals & TaxPaid/Refund roll-ups (A95–A106, A108–A111), A107 skipped (A51–A100)
- **enc_03** (A101–A150): TaxPaid/Refund tail, Chapter VI-A caps & detail-presence (A114–A124), Schedule80D full block (A127–A139), tax roll-up A140, exempt/salary/80GGA (A141–A150); A107/A113/A126 skipped (A101–A150)
- **enc_04** (A151–A200): new-regime zero-bars across VIA / salary / HP / 80D / 80GGA (A146,A153–A175), HRA & salary caps, 80CCH, 80GGC block (A193–A199); A151/A152/A187/A189/A190 skipped (A151–A200)
- **enc_05** (A201–A250): Schedule80U/80DD (A200–A209), 80C/80E/80EE/80EEA/80EEB loan schedules & VIA matches (A220–A251), Section24B, 80D breakup/insurer detail (A234–A237), LTCG112A (A217–A218); A212/A219 skipped (A201–A250)
- **enc_06** (A251–A300): loan-date windows, HP self-occupied/new-regime, 80D insurer details, HRA Schedule EA (A261–A266,A269), VIA allowed<=entered caps (A272–A291), LTCG112A A292, co-owned HP & AssesseeRep (A293–A300); A268 skipped (A251–A300)
- **enc_07** (A301–A339): new-regime EIC bar, 80CCC rows, ExemptIncAgriOthUs10 uniqueness (A303–A322,A323), 80G non-cash/ cash-2000 (A325–A327), 80GGC name/PAN/mode, co-owned HP shares, PRAN, PersonalInfo secondary address (A329–A339); A324/A328 skipped (A301–A339)
- **enc_08** (D1–D9): the 9 Category-D advisories — relief-89/Form-10E & Aadhaar reminder (D1), special-rate / not-applicable TDS section codes in TDS2/TDS3 (D2–D7), and TDS1 <= Gross Salary (D8–D9) — all as `Dd(serial,…)` warnings.

## Reference batch — `61_rules_enc_01.js` (serials A1–A50)

Encoded (**48**): A1, A2, A3, A4, A5, A6, A8, A9, A10, A11, A12, A13, A14, A15, A16, A17, A18, A20, A21, A22, A23, A24, A25, A26, A27, A28, A29, A30, A31, A32, A33, A34, A35, A36, A37, A38, A39, A40, A41, A42, A43, A44, A45, A46, A47, A48, A49, A50.

Skipped in the A1–A50 band: **A7** (OFFLINE — 80DDB self/dependent 40,000 cap needs Section80DDBUsrType, not emitted) and **A19** (OFFLINE — name vs PAN database). 48 ENCODED + 2 OFFLINE = the 50 serials of A1–A50.

**Registration.** `61_rules_enc_01.js` calls `ruleset(function(I,S_,A,Dd){…})` exactly as the driver `forms/ITR-1/src/60_rules.js` expects — the function is pushed to `_RULEBATCHES` (via `08_registry.js`) and `runRules()` invokes it with its own fault-tolerant `A`/`Dd` collectors. Every read is guarded (`RG` / `N` / `(X||{})`), so a wrong-typed imported field skips just that rule. Schedule-scoped assertions run under `if(I.<block>)`; regime-scoped ones read `FilingStatus.OptOutNewTaxRegime` (`Y` = old, `N` = new).

**Smoke test.** Empty `{}` fires nothing (every assertion is vacuously TRUE on absent blocks / a regime guard). A lawful old-regime return fires none. A return that violates the roll-ups (GrossSalary ≠ 17(1)+17(2)+17(3), NetSalary mis-added), the caps (80TTA > 10,000, self-occupied 24(b) interest > 2,00,000, agri exempt > 5,000) and a duplicate exempt-income dropdown fires exactly those serials. `node --check` passes.

## Appendix · per-serial classification (Category A)

| Serial | Bucket | Block on `I` | Assertion (re-joined) |
|---|---|---|---|
| A1 | ENFORCED | `IncomeDeductions.UsrDeductUndChapVIA / DeductUndChapVIA` | 80C+80CCC+80CCD(1) aggregate <= 1,50,000 (old) |
| A2 | ENFORCED | `IncomeDeductions.UsrDeductUndChapVIA / DeductUndChapVIA` | 80CCD(1) <= 20% GTI for pensioner/NA employer (old) |
| A3 | ENFORCED | `IncomeDeductions.UsrDeductUndChapVIA / DeductUndChapVIA` | 80CCD(1) <= 10% salary for non-pensioner employer (old) |
| A4 | ENFORCED | `IncomeDeductions.UsrDeductUndChapVIA / DeductUndChapVIA` | 80CCD(2) <= 10% salary, non-govt employer (old) |
| A5 | ENFORCED | `IncomeDeductions.UsrDeductUndChapVIA / DeductUndChapVIA` | 80DDB resident <= 1,00,000 (old) |
| A6 | ENFORCED | `IncomeDeductions.UsrDeductUndChapVIA / DeductUndChapVIA` | 80DDB claimed => NameOfSpecDisease80DDB present (old) |
| A7 | OFFLINE | `IncomeDeductions.UsrDeductUndChapVIA` | 80DDB 'Self or Dependent' 40,000 cap needs Section80DDBUsrType (self/dependent vs senior patient); expDed does not emit that leaf to the built return, so the 40,000-vs-1,00,000 branch cannot be resolved offline (A5's <=1,00,000 bound is the encodable part) |
| A8 | ENFORCED | `Schedule80G` | 80G claimed => Schedule80G present (old) |
| A9 | ENFORCED | `Schedule80G` | Table F total = sum of the four bucket totals (old) |
| A10 | ENFORCED | `Schedule80G` | VIA 80G allowed <= TotalEligibleDonationsUs80G (old) |
| A11 | ENFORCED | `IncomeDeductions.UsrDeductUndChapVIA / DeductUndChapVIA` | 80TTA <= 10,000 (old) |
| A12 | ENFORCED | `IncomeDeductions.UsrDeductUndChapVIA / DeductUndChapVIA + IncomeDeductions.{OthersInc,IncomeOthSrc,DeductionUs57iia}` | 80TTA <= savings-account interest (SAV) in OthersInc (old) |
| A13 | ENFORCED | `IncomeDeductions.UsrDeductUndChapVIA / DeductUndChapVIA + PersonalInfo` | 80TTA barred for senior (DOB <= 01.04.1966) |
| A14 | ENFORCED | `IncomeDeductions.UsrDeductUndChapVIA / DeductUndChapVIA` | 80TTB <= 50,000 (old) |
| A15 | ENFORCED | `IncomeDeductions.UsrDeductUndChapVIA / DeductUndChapVIA + PersonalInfo` | 80TTB needs age>=60 (DOB before 02.04.1966) |
| A16 | ENFORCED | `IncomeDeductions.UsrDeductUndChapVIA / DeductUndChapVIA + IncomeDeductions.{OthersInc,IncomeOthSrc,DeductionUs57iia}` | senior 80TTB restricted to interest income (old) |
| A17 | ENFORCED | `IncomeDeductions.UsrDeductUndChapVIA / DeductUndChapVIA` | TotalChapVIADeductions = sum of allowed sections restricted to GTI |
| A18 | ENFORCED | `IncomeDeductions.UsrDeductUndChapVIA / DeductUndChapVIA + IncomeDeductions.{GrossTotIncome,GrossTotIncomeIncLTCG112A,TotalIncome}` | Chapter VI-A deductions <= GrossTotIncome |
| A19 | OFFLINE | `PersonalInfo` | name in return vs PAN database -- external DB not shipped (portal resolves at upload) |
| A20 | ENFORCED | `IncomeDeductions.{GrossTotIncome,GrossTotIncomeIncLTCG112A,TotalIncome} + TaxPaid` | GTI/heads > 0 when tax liability computed & paid |
| A21 | ENFORCED | `ITR1_TaxComputation + TaxPaid` | income details & tax computation disclosed when taxes paid disclosed |
| A22 | ENFORCED | `IncomeDeductions.{GrossTotIncome,GrossTotIncomeIncLTCG112A,TotalIncome}` | old regime: GrossTotIncomeIncLTCG112A = Sal + HP + OS + LTCG112A |
| A23 | ENFORCED | `ITR1_TaxComputation` | old regime: Rebate87A barred when total income incl LTCG112A > 5,00,000 |
| A24 | ENFORCED | `IncomeDeductions.{GrossTotIncome,GrossTotIncomeIncLTCG112A,TotalIncome}` | TotalIncome = max(0, GTI incl LTCG - TotalChapVIADeductions) |
| A25 | ENFORCED | `ITR1_TaxComputation` | TaxPayableOnRebate = TotalTaxPayable - Rebate87A |
| A26 | ENFORCED | `ITR1_TaxComputation` | GrossTaxLiability = TaxPayableOnRebate + EducationCess |
| A27 | ENFORCED | `ITR1_TaxComputation` | TotTaxPlusIntrstPay = (GrossTaxLiability - Section89) + total interest/fees |
| A28 | ENFORCED | `ITR1_TaxComputation` | TotalIntrstPay = 234A+234B+234C+234F+234-I |
| A29 | ENFORCED | `IncomeDeductions.ExemptIncAgriOthUs10` | agricultural income (10(1)) exempt <= 5,000 |
| A30 | ENFORCED | `IncomeDeductions.ExemptIncAgriOthUs10` | ExemptIncAgriOthUs10Total = sum of row OthAmount |
| A31 | ENFORCED | `IncomeDeductions.ExemptIncAgriOthUs10` | 10(10BC) SubCategory selected at most once |
| A32 | ENFORCED | `IncomeDeductions.ExemptIncAgriOthUs10` | 10(10D) SubCategory selected at most once |
| A33 | ENFORCED | `IncomeDeductions.ExemptIncAgriOthUs10` | 10(11) SubCategory selected at most once |
| A34 | ENFORCED | `IncomeDeductions.ExemptIncAgriOthUs10` | 10(12) SubCategory selected at most once |
| A35 | ENFORCED | `IncomeDeductions.ExemptIncAgriOthUs10` | 10(13) SubCategory selected at most once |
| A36 | ENFORCED | `IncomeDeductions.ExemptIncAgriOthUs10` | 10(16) SubCategory selected at most once |
| A37 | ENFORCED | `IncomeDeductions.{GrossSalary,Salary,PerquisitesValue,ProfitsInSalary,NetSalary,DeductionUs16*,IncomeFromSal,AllwncExemptUs10}` | 10(17) MP/MLA/MLC allowance selected at most once in AllwncExemptUs10 |
| A38 | ENFORCED | `IncomeDeductions.ExemptIncAgriOthUs10` | 10(18) SubCategory selected at most once |
| A39 | ENFORCED | `IncomeDeductions.ExemptIncAgriOthUs10` | DMD (defence medical disability pension) selected at most once |
| A40 | ENFORCED | `IncomeDeductions.ExemptIncAgriOthUs10` | 10(19) SubCategory selected at most once |
| A41 | ENFORCED | `IncomeDeductions.ExemptIncAgriOthUs10` | 10(26) SubCategory selected at most once |
| A42 | ENFORCED | `IncomeDeductions.ExemptIncAgriOthUs10` | 10(26AAA) SubCategory selected at most once |
| A43 | ENFORCED | `IncomeDeductions.PropertyDetails[] / TotalIncomeChargeableUnHP` | standard deduction = 30% of annual value (ThirtyPercentOfBalance) |
| A44 | ENFORCED | `IncomeDeductions.PropertyDetails[] / TotalIncomeChargeableUnHP` | AnnualLetableValue > 0 when LocalTaxes claimed |
| A45 | ENFORCED | `IncomeDeductions.PropertyDetails[] / TotalIncomeChargeableUnHP` | let-out/deemed-let (ifLetOut L/D) => AnnualLetableValue > 0 |
| A46 | ENFORCED | `IncomeDeductions.PropertyDetails[] / TotalIncomeChargeableUnHP` | annual value B2iii = B2i - B2ii (AnnualOfPropOwned) |
| A47 | ENFORCED | `IncomeDeductions.PropertyDetails[] / TotalIncomeChargeableUnHP` | income chargeable HP = iii-iv-v+vi (IncomeOfHP / TotalIncomeChargeableUnHP) |
| A48 | ENFORCED | `IncomeDeductions.PropertyDetails[] / TotalIncomeChargeableUnHP` | old regime: self-occupied interest IntOnBorwCap <= 2,00,000 |
| A49 | ENFORCED | `IncomeDeductions.PropertyDetails[] / TotalIncomeChargeableUnHP` | self-occupied => LocalTaxes not allowed |
| A50 | ENFORCED | `IncomeDeductions.{OthersInc,IncomeOthSrc,DeductionUs57iia}` | SAV (savings interest) selected at most once in OthersInc |
| A51 | ENFORCED | `IncomeDeductions.{OthersInc,IncomeOthSrc,DeductionUs57iia}` | IFD (deposit interest) selected at most once |
| A52 | ENFORCED | `IncomeDeductions.{OthersInc,IncomeOthSrc,DeductionUs57iia}` | IncomeOthSrc = sum of OthSrcOthAmount rows |
| A53 | ENFORCED | `IncomeDeductions.{OthersInc,IncomeOthSrc,DeductionUs57iia}` | DeductionUs57iia allowed only if family pension (FAP) offered |
| A54 | ENFORCED | `IncomeDeductions.{OthersInc,IncomeOthSrc,DeductionUs57iia}` | old regime: 57(iia) <= lower(1/3 family pension, 15,000) |
| A55 | ENFORCED | `IncomeDeductions.{OthersInc,IncomeOthSrc,DeductionUs57iia}` | TAX (IT-refund interest) selected at most once |
| A56 | ENFORCED | `IncomeDeductions.{OthersInc,IncomeOthSrc,DeductionUs57iia}` | FAP (family pension) selected at most once |
| A57 | ENFORCED | `IncomeDeductions.{GrossSalary,Salary,PerquisitesValue,ProfitsInSalary,NetSalary,DeductionUs16*,IncomeFromSal,AllwncExemptUs10}` | old: entertainment 16(ii) CG/SG/PSU <= min(5000, 1/5 salary) |
| A58 | ENFORCED | `IncomeDeductions.{GrossSalary,Salary,PerquisitesValue,ProfitsInSalary,NetSalary,DeductionUs16*,IncomeFromSal,AllwncExemptUs10}` | old: no entertainment 16(ii) for non CG/SG/PSU |
| A59 | ENFORCED | `IncomeDeductions.{GrossSalary,Salary,PerquisitesValue,ProfitsInSalary,NetSalary,DeductionUs16*,IncomeFromSal,AllwncExemptUs10}` | GrossSalary = Salary(17(1)) + PerquisitesValue(17(2)) + ProfitsInSalary(17(3)) |
| A60 | ENFORCED | `IncomeDeductions.{GrossSalary,Salary,PerquisitesValue,ProfitsInSalary,NetSalary,DeductionUs16*,IncomeFromSal,AllwncExemptUs10}` | NetSalary = GrossSalary - TotalAllwncExemptUs10 |
| A61 | ENFORCED | `IncomeDeductions.{GrossSalary,Salary,PerquisitesValue,ProfitsInSalary,NetSalary,DeductionUs16*,IncomeFromSal,AllwncExemptUs10}` | DeductionUs16 = 16ia + EntertainmentAlw16ii + ProfessionalTaxUs16iii |
| A62 | ENFORCED | `IncomeDeductions.{GrossSalary,Salary,PerquisitesValue,ProfitsInSalary,NetSalary,DeductionUs16*,IncomeFromSal,AllwncExemptUs10}` | IncomeFromSal = NetSalary - DeductionUs16 |
| A63 | ENFORCED | `IncomeDeductions.{GrossSalary,Salary,PerquisitesValue,ProfitsInSalary,NetSalary,DeductionUs16*,IncomeFromSal,AllwncExemptUs10}` | TotalAllwncExemptUs10 <= GrossSalary |
| A64 | ENFORCED | `IncomeDeductions.{GrossSalary,Salary,PerquisitesValue,ProfitsInSalary,NetSalary,DeductionUs16*,IncomeFromSal,AllwncExemptUs10}` | old: 10(5) LTC <= Salary 17(1) |
| A65 | ENFORCED | `IncomeDeductions.{GrossSalary,Salary,PerquisitesValue,ProfitsInSalary,NetSalary,DeductionUs16*,IncomeFromSal,AllwncExemptUs10}` | 10(6) <= GrossSalary |
| A66 | ENFORCED | `IncomeDeductions.{GrossSalary,Salary,PerquisitesValue,ProfitsInSalary,NetSalary,DeductionUs16*,IncomeFromSal,AllwncExemptUs10}` | 10(7) <= GrossSalary |
| A67 | ENFORCED | `IncomeDeductions.{GrossSalary,Salary,PerquisitesValue,ProfitsInSalary,NetSalary,DeductionUs16*,IncomeFromSal,AllwncExemptUs10}` | 10(10) gratuity <= 20,00,000 (PSU/Pensioners/Others) |
| A68 | ENFORCED | `IncomeDeductions.{GrossSalary,Salary,PerquisitesValue,ProfitsInSalary,NetSalary,DeductionUs16*,IncomeFromSal,AllwncExemptUs10}` | 10(10A) commuted pension <= Salary 17(1) |
| A69 | ENFORCED | `IncomeDeductions.{GrossSalary,Salary,PerquisitesValue,ProfitsInSalary,NetSalary,DeductionUs16*,IncomeFromSal,AllwncExemptUs10}` | 10(10AA) leave encashment <= Salary 17(1) |
| A70 | ENFORCED | `IncomeDeductions.{GrossSalary,Salary,PerquisitesValue,ProfitsInSalary,NetSalary,DeductionUs16*,IncomeFromSal,AllwncExemptUs10}` | 10(10B) first proviso <= 5,00,000 |
| A71 | ENFORCED | `IncomeDeductions.{GrossSalary,Salary,PerquisitesValue,ProfitsInSalary,NetSalary,DeductionUs16*,IncomeFromSal,AllwncExemptUs10}` | 10(10C) VRS <= 5,00,000 |
| A72 | ENFORCED | `IncomeDeductions.{GrossSalary,Salary,PerquisitesValue,ProfitsInSalary,NetSalary,DeductionUs16*,IncomeFromSal,AllwncExemptUs10}` | only one of 10(10B)(i)/10(10B)(ii)/10(10C) present |
| A73 | ENFORCED | `IncomeDeductions.{GrossSalary,Salary,PerquisitesValue,ProfitsInSalary,NetSalary,DeductionUs16*,IncomeFromSal,AllwncExemptUs10}` | 10(10CC) <= PerquisitesValue 17(2) |
| A74 | ENFORCED | `IncomeDeductions.{GrossSalary,Salary,PerquisitesValue,ProfitsInSalary,NetSalary,DeductionUs16*,IncomeFromSal,AllwncExemptUs10}` | old: 10(13A) <= Salary 17(1) |
| A75 | ENFORCED | `IncomeDeductions.{GrossSalary,Salary,PerquisitesValue,ProfitsInSalary,NetSalary,DeductionUs16*,IncomeFromSal,AllwncExemptUs10}` | 10(14)(i) <= Salary 17(1) |
| A76 | ENFORCED | `IncomeDeductions.{GrossSalary,Salary,PerquisitesValue,ProfitsInSalary,NetSalary,DeductionUs16*,IncomeFromSal,AllwncExemptUs10}` | old: 10(14)(ii) <= Salary 17(1) |
| A77 | ENFORCED | `IncomeDeductions.{GrossSalary,Salary,PerquisitesValue,ProfitsInSalary,NetSalary,DeductionUs16*,IncomeFromSal,AllwncExemptUs10}` | TotalAllwncExemptUs10 = sum of AllwncExemptUs10Dtls rows |
| A78 | ENFORCED | `Schedule80G` | donee PAN != assessee PAN / verification PAN |
| A79 | ENFORCED | `Schedule80G` | bucket A: cash or other-mode mandatory when total entered |
| A80 | ENFORCED | `Schedule80G` | bucket B: cash or other-mode mandatory when total entered |
| A81 | ENFORCED | `Schedule80G` | bucket C: cash or other-mode mandatory when total entered |
| A82 | ENFORCED | `Schedule80G` | bucket D: cash or other-mode mandatory when total entered |
| A83 | ENFORCED | `Schedule80G` | Table E total = sum of four bucket donation totals |
| A84 | ENFORCED | `Schedule80G` | bucket A DonationAmt = DonationAmtCash + DonationAmtOtherMode |
| A85 | ENFORCED | `Schedule80G` | bucket B DonationAmt = cash + other-mode |
| A86 | ENFORCED | `Schedule80G` | bucket C DonationAmt = cash + other-mode |
| A87 | ENFORCED | `Schedule80G` | bucket D DonationAmt = cash + other-mode |
| A88 | ENFORCED | `Schedule80G` | cash donation > 2000 same PAN excluded from eligible amount |
| A89 | ENFORCED | `Schedule80GGA` | 80GGA: cash or other-mode mandatory when total entered |
| A90 | ENFORCED | `Schedule80GGA` | TotalDonationsUs80GGA = cash + other-mode |
| A91 | ENFORCED | `Schedule80GGA` | 80GGA claimed => Schedule80GGA details present |
| A92 | ENFORCED | `Schedule80GGA` | EligibleDonationAmt <= TotalDonations (80GGA) |
| A93 | ENFORCED | `Schedule80GGA` | VIA 80GGA allowed <= TotalEligibleDonationAmt80GGA |
| A94 | ENFORCED | `Schedule80GGA` | 80GGA donee PAN != assessee/verification PAN |
| A95 | ENFORCED | `TDSonSalaries / TDSonOthThanSals / ScheduleTDS3Dtls / ScheduleTCS / TaxPayments` | Schedule IT (TaxPayments) col4 total = sum of Amt rows |
| A96 | ENFORCED | `TDSonSalaries / TDSonOthThanSals / ScheduleTDS3Dtls / ScheduleTCS / TaxPayments` | ScheduleTCS: AmtTCSClaimedThisYear <= AmtTaxCollected |
| A97 | ENFORCED | `TDSonSalaries / TDSonOthThanSals / ScheduleTDS3Dtls / ScheduleTCS / TaxPayments` | ScheduleTCS col6 total = sum of AmtTCSClaimedThisYear |
| A98 | ENFORCED | `TDSonSalaries / TDSonOthThanSals / ScheduleTDS3Dtls / ScheduleTCS / TaxPayments` | TDSonOthThanSals: ClaimOutOfTotTDSOnAmtPaid <= TotTDSOnAmtPaid |
| A99 | ENFORCED | `TDSonSalaries / TDSonOthThanSals / ScheduleTDS3Dtls / ScheduleTCS / TaxPayments` | TDS2/TDS3/TCS DeductedYr/CollectedYr not null when a claim exists |
| A100 | ENFORCED | `TDSonSalaries / TDSonOthThanSals / ScheduleTDS3Dtls / ScheduleTCS / TaxPayments` | TDSonSalaries col5 total = sum of TotalTDSSal |
| A101 | ENFORCED | `TDSonSalaries / TDSonOthThanSals / ScheduleTDS3Dtls / ScheduleTCS / TaxPayments` | TDSonOthThanSals col6 total = sum of ClaimOutOfTotTDSOnAmtPaid |
| A102 | ENFORCED | `TDSonSalaries / TDSonOthThanSals / ScheduleTDS3Dtls / ScheduleTCS / TaxPayments` | ScheduleTDS3Dtls col7 total = sum of TDSClaimed |
| A103 | ENFORCED | `TaxPaid` | TaxPaid TDS/TCS/tax = totals of Schedule IT/TDS1/TDS2/TCS |
| A104 | ENFORCED | `TaxPaid` | TotalTaxesPaid = AdvanceTax + TDS + TCS + SelfAssessmentTax |
| A105 | ENFORCED | `Refund` | RefundDue = TotalTaxesPaid - TotTaxPlusIntrstPay (when positive) |
| A106 | ENFORCED | `TaxPaid` | BalTaxPayable = TotTaxPlusIntrstPay - TotalTaxesPaid (when positive) |
| A107 | OFFLINE | `Refund / Schedule80G / Schedule80GGC` | IFSC vs RBI / GIFT IFSC database -- external DB not shipped |
| A108 | ENFORCED | `TaxPaid` | TaxPaid.TDS = TDS1 + TDS2 + TDS3 totals |
| A109 | ENFORCED | `TaxPaid` | TaxPaid.TCS = ScheduleTCS total |
| A110 | ENFORCED | `TDSonSalaries / TDSonOthThanSals / ScheduleTDS3Dtls / ScheduleTCS / TaxPayments` | AdvanceTax = sum of Schedule IT challans deposited 01/04-31/03 of PY |
| A111 | ENFORCED | `TDSonSalaries / TDSonOthThanSals / ScheduleTDS3Dtls / ScheduleTCS / TaxPayments` | SelfAssessmentTax = sum of Schedule IT challans deposited after 31/03 |
| A112 | ENFORCED | `IncomeDeductions.{GrossSalary,Salary,PerquisitesValue,ProfitsInSalary,NetSalary,DeductionUs16*,IncomeFromSal,AllwncExemptUs10}` | old: standard deduction 16(ia) <= 50,000 |
| A113 | NA | `TaxPaid / TDSonSalaries / TDSonOthThanSals / ScheduleTDS3Dtls / ScheduleTCS / TaxPayments` | TDS claimed but receipts per Form 26AS not offered -- AIS/26AS reconciliation |
| A114 | ENFORCED | `IncomeDeductions.UsrDeductUndChapVIA / DeductUndChapVIA` | 80GG <= least(60,000, 25% of total income excl LTCG) |
| A115 | ENFORCED | `IncomeDeductions.UsrDeductUndChapVIA / DeductUndChapVIA` | old: 80CCD(1B) <= 50,000 |
| A116 | ENFORCED | `IncomeDeductions.UsrDeductUndChapVIA / DeductUndChapVIA` | 80CCD(2) barred for CG/SG/PSU pensioners |
| A117 | ENFORCED | `IncomeDeductions.{GrossTotIncome,GrossTotIncomeIncLTCG112A,TotalIncome}` | total income excl LTCG (C3(a)(iii)) <= 50,00,000 (ITR-1 ceiling) |
| A118 | ENFORCED | `Schedule80GGA` | 80GGA cash donation: same donee PAN not more than once |
| A119 | ENFORCED | `IncomeDeductions.UsrDeductUndChapVIA / DeductUndChapVIA` | HRA 10(13A) claimed => 80GG not allowed |
| A120 | ENFORCED | `IncomeDeductions.UsrDeductUndChapVIA / DeductUndChapVIA` | old: 80CCD(2) <= 14% salary when employer CG/SG |
| A121 | ENFORCED | `IncomeDeductions.UsrDeductUndChapVIA / DeductUndChapVIA` | old: 80EE <= 50,000 |
| A122 | ENFORCED | `IncomeDeductions.UsrDeductUndChapVIA / DeductUndChapVIA` | old: 80EEA <= 1,50,000 |
| A123 | ENFORCED | `IncomeDeductions.UsrDeductUndChapVIA / DeductUndChapVIA` | 80EE and 80EEA mutually exclusive |
| A124 | ENFORCED | `IncomeDeductions.UsrDeductUndChapVIA / DeductUndChapVIA` | old: 80EEB <= 1,50,000 |
| A125 | ENFORCED | `ITR1_TaxComputation / IncomeDeductions.{GrossSalary,Salary,PerquisitesValue,ProfitsInSalary,NetSalary,DeductionUs16*,IncomeFromSal,AllwncExemptUs10}` | Section89 relief needs salary/perquisite/profits/family pension present |
| A126 | NA | `FilingStatus` | original return u/s 142(1) then no 139 return -- checked at upload (portal) |
| A127 | ENFORCED | `Schedule80D` | old: 80D 1a Self&Family <= 25,000 |
| A128 | ENFORCED | `Schedule80D` | 80D 1a = i + ii |
| A129 | ENFORCED | `Schedule80D` | old: 80D preventive health check-up combined <= 5,000 |
| A130 | ENFORCED | `Schedule80D` | old: 80D 1b Self&Family (senior) <= 50,000 |
| A131 | ENFORCED | `Schedule80D` | 80D 1b = i + ii + iii |
| A132 | ENFORCED | `Schedule80D` | old: 80D 2a Parents <= 25,000 ; 2a = i + ii |
| A133 | ENFORCED | `Schedule80D` | 80D 2a old-regime applicability (paired with A132) |
| A134 | ENFORCED | `Schedule80D` | old: 80D 2b > 50,000 barred |
| A135 | ENFORCED | `Schedule80D` | 80D 2b = i + ii + iii |
| A136 | ENFORCED | `Schedule80D` | old: 80D Sl.3 eligible <= 1,00,000 |
| A137 | ENFORCED | `Schedule80D` | 80D Sl.3 = 1a+1b+2a+2b restricted to GTI |
| A138 | ENFORCED | `Schedule80D` | 80D in VIA => same amount/details in Schedule80D |
| A139 | ENFORCED | `Schedule80G` | 80G EligibleDonationAmt <= TotalDonations |
| A140 | ENFORCED | `ITR1_TaxComputation` | Total Tax Fee Interest = Balance tax after relief + TotalIntrstPay |
| A141 | ENFORCED | `IncomeDeductions.ExemptIncAgriOthUs10` | 10(17A) SubCategory selected at most once |
| A142 | ENFORCED | `IncomeDeductions.{GrossSalary,Salary,PerquisitesValue,ProfitsInSalary,NetSalary,DeductionUs16*,IncomeFromSal,AllwncExemptUs10}` | 10(10AA) > 25,00,000 barred for employer other than CG/SG/pensioners |
| A143 | ENFORCED | `Schedule80GGA` | 80GGA cash donation > 2,000 not allowed |
| A144 | ENFORCED | `Schedule80GGA` | 80GGA same donee PAN not more than once |
| A145 | ENFORCED | `IncomeDeductions.{OthersInc,IncomeOthSrc,DeductionUs57iia}` | dividend total = sum of DividendInc.DateRange quarterly leaves |
| A146 | ENFORCED | `IncomeDeductions.UsrDeductUndChapVIA / DeductUndChapVIA` | new regime: Chapter VI-A deductions B5(a..s) must be 0 |
| A147 | ENFORCED | `Schedule80G` | 80G same PAN not entered across multiple buckets |
| A148 | ENFORCED | `IncomeDeductions.{GrossSalary,Salary,PerquisitesValue,ProfitsInSalary,NetSalary,DeductionUs16*,IncomeFromSal,AllwncExemptUs10}` | new regime: 10(14)(ii) transport <= 38,400; 10(5)/10(13A)/10(14) bars |
| A149 | ENFORCED | `IncomeDeductions.{GrossSalary,Salary,PerquisitesValue,ProfitsInSalary,NetSalary,DeductionUs16*,IncomeFromSal,AllwncExemptUs10}` | new regime allowance description continuation (wrap of A148) |
| A150 | ENFORCED | `IncomeDeductions.{GrossSalary,Salary,PerquisitesValue,ProfitsInSalary,NetSalary,DeductionUs16*,IncomeFromSal,AllwncExemptUs10}` | old regime 10(14)(i)/(ii) Rule 2BB allowances (wrap of A149/A151) |
| A151 | NA | `FilingStatus` | old regime cannot be selected after the 139(1) due date -- filing timestamp (clock) |
| A152 | NA | `FilingStatus` | once 148 proceeding initiated no 139 return -- blocked at upload (portal) |
| A153 | ENFORCED | `IncomeDeductions.UsrDeductUndChapVIA / DeductUndChapVIA` | new regime: 80C+80CCC+80CCD(1) must be 0 |
| A154 | ENFORCED | `IncomeDeductions.UsrDeductUndChapVIA / DeductUndChapVIA` | new regime: 80DD must be 0 |
| A155 | ENFORCED | `IncomeDeductions.UsrDeductUndChapVIA / DeductUndChapVIA` | new regime: 80DDB must be 0 |
| A156 | ENFORCED | `Schedule80G / IncomeDeductions.UsrDeductUndChapVIA / DeductUndChapVIA` | new regime: 80G must be 0 and no Schedule80G details |
| A157 | ENFORCED | `IncomeDeductions.UsrDeductUndChapVIA / DeductUndChapVIA` | new regime: 80TTA must be 0 |
| A158 | ENFORCED | `IncomeDeductions.UsrDeductUndChapVIA / DeductUndChapVIA` | new regime: 80TTB must be 0 |
| A159 | ENFORCED | `IncomeDeductions.UsrDeductUndChapVIA / DeductUndChapVIA` | new regime: 80U must be 0 |
| A160 | ENFORCED | `IncomeDeductions.{GrossTotIncome,GrossTotIncomeIncLTCG112A,TotalIncome}` | new regime + HP loss: GTI = Salary + Other Sources |
| A161 | ENFORCED | `IncomeDeductions.{GrossSalary,Salary,PerquisitesValue,ProfitsInSalary,NetSalary,DeductionUs16*,IncomeFromSal,AllwncExemptUs10} / IncomeDeductions.ExemptIncAgriOthUs10` | new regime: 10(17) MP/MLA allowance must be 0 |
| A162 | ENFORCED | `IncomeDeductions.PropertyDetails[] / TotalIncomeChargeableUnHP` | new regime: self-occupied interest must be 0 |
| A163 | ENFORCED | `IncomeDeductions.{GrossSalary,Salary,PerquisitesValue,ProfitsInSalary,NetSalary,DeductionUs16*,IncomeFromSal,AllwncExemptUs10}` | new regime: entertainment 16(ii) must be 0 |
| A164 | ENFORCED | `IncomeDeductions.{GrossSalary,Salary,PerquisitesValue,ProfitsInSalary,NetSalary,DeductionUs16*,IncomeFromSal,AllwncExemptUs10}` | new regime: 10(5) LTC must be 0 |
| A165 | ENFORCED | `IncomeDeductions.{GrossSalary,Salary,PerquisitesValue,ProfitsInSalary,NetSalary,DeductionUs16*,IncomeFromSal,AllwncExemptUs10}` | new regime: 10(13A) HRA must be 0 |
| A166 | ENFORCED | `IncomeDeductions.{GrossSalary,Salary,PerquisitesValue,ProfitsInSalary,NetSalary,DeductionUs16*,IncomeFromSal,AllwncExemptUs10}` | new regime: 10(14)(i) must be 0 |
| A167 | ENFORCED | `IncomeDeductions.{GrossSalary,Salary,PerquisitesValue,ProfitsInSalary,NetSalary,DeductionUs16*,IncomeFromSal,AllwncExemptUs10}` | new regime: 10(14)(ii) must be 0 |
| A168 | ENFORCED | `IncomeDeductions.UsrDeductUndChapVIA / DeductUndChapVIA / IncomeDeductions.{GrossSalary,Salary,PerquisitesValue,ProfitsInSalary,NetSalary,DeductionUs16*,IncomeFromSal,AllwncExemptUs10}` | new regime: professional tax 16(iii) must be 0 |
| A169 | ENFORCED | `IncomeDeductions.UsrDeductUndChapVIA / DeductUndChapVIA` | new regime: 80CCD(1B) must be 0 |
| A170 | ENFORCED | `IncomeDeductions.UsrDeductUndChapVIA / DeductUndChapVIA` | new regime: 80EE must be 0 |
| A171 | ENFORCED | `IncomeDeductions.UsrDeductUndChapVIA / DeductUndChapVIA` | new regime: 80EEA must be 0 |
| A172 | ENFORCED | `IncomeDeductions.UsrDeductUndChapVIA / DeductUndChapVIA` | new regime: 80EEB must be 0 |
| A173 | ENFORCED | `Schedule80D / IncomeDeductions.UsrDeductUndChapVIA / DeductUndChapVIA` | new regime: 80D must be 0 and no Schedule80D details |
| A174 | ENFORCED | `IncomeDeductions.{GrossTotIncome,GrossTotIncomeIncLTCG112A,TotalIncome}` | new regime + HP positive: GTI = Sal + HP + OS + LTCG112A |
| A175 | ENFORCED | `Schedule80GGA / IncomeDeductions.UsrDeductUndChapVIA / DeductUndChapVIA` | new regime: 80GGA must be 0 and no Schedule80GGA details |
| A176 | ENFORCED | `IncomeDeductions.{GrossSalary,Salary,PerquisitesValue,ProfitsInSalary,NetSalary,DeductionUs16*,IncomeFromSal,AllwncExemptUs10}` | old: 10(13A) <= 1/3 of Salary 17(1) |
| A177 | ENFORCED | `IncomeDeductions.{GrossSalary,Salary,PerquisitesValue,ProfitsInSalary,NetSalary,DeductionUs16*,IncomeFromSal,AllwncExemptUs10} / TDSonSalaries / TDSonOthThanSals / ScheduleTDS3Dtls / ScheduleTCS / TaxPayments` | 10(10CC) <= TDS u/s 192 in Schedule TDS1 |
| A178 | ENFORCED | `Schedule80D` | 80D 1a claimable only if SeniorCitizenFlag = N |
| A179 | ENFORCED | `Schedule80D` | 80D 1b claimable only if SeniorCitizenFlag = Y |
| A180 | ENFORCED | `Schedule80D` | 80D 2a claimable only if ParentsSeniorCitizenFlag = N |
| A181 | ENFORCED | `Schedule80D` | 80D 2b claimable only if ParentsSeniorCitizenFlag = Y |
| A182 | ENFORCED | `Schedule80D` | 80D no 1a/1b when SeniorCitizenFlag = S (not claiming self/family) |
| A183 | ENFORCED | `Schedule80D` | 80D no 2a/2b when ParentsSeniorCitizenFlag = P (not claiming parents) |
| A184 | ENFORCED | `IncomeDeductions.ExemptIncAgriOthUs10` | any exempt-income nature (SubCategory) selected at most once |
| A185 | ENFORCED | `IncomeDeductions.{GrossSalary,Salary,PerquisitesValue,ProfitsInSalary,NetSalary,DeductionUs16*,IncomeFromSal,AllwncExemptUs10}` | 10(10B)(i)/(ii) not allowed to CG/SG/PSU/Pensioners |
| A186 | ENFORCED | `IncomeDeductions.UsrDeductUndChapVIA / DeductUndChapVIA` | 80CCH <= 46.2% of Salary 17(1) |
| A187 | OFFLINE | `IncomeDeductions.UsrDeductUndChapVIA / DeductUndChapVIA / PersonalInfo` | 80CCH needs age 17-27 at date of joining armed forces -- date of joining not carried |
| A188 | ENFORCED | `IncomeDeductions.{GrossSalary,Salary,PerquisitesValue,ProfitsInSalary,NetSalary,DeductionUs16*,IncomeFromSal,AllwncExemptUs10}` | 10(10B) second proviso <= 5,00,000 |
| A189 | NA | `FilingStatus` | 139(5) over an original 139(4) => old regime barred -- original-return section not carried (portal) |
| A190 | NA | `FilingStatus` | withdraw from new regime barred after 139(1) due date -- filing timestamp (clock) |
| A191 | ENFORCED | `ITR1_TaxComputation` | new regime: Rebate87A barred when total income excl LTCG > 12,70,590 |
| A192 | ENFORCED | `ITR1_TaxComputation` | old regime: Rebate87A <= 12,500 when total income = 5,00,000 |
| A193 | ENFORCED | `Schedule80GGC` | 80GGC in VIA => Schedule80GGC details present |
| A194 | ENFORCED | `Schedule80GGC` | 80GGC eligible = other-mode contribution restricted to GTI |
| A195 | ENFORCED | `Schedule80GGC` | TotalDonationsUs80GGC = cash + other-mode |
| A196 | ENFORCED | `Schedule80GGC` | 80GGC Sl.D eligible = sum of row eligible restricted to GTI |
| A197 | ENFORCED | `Schedule80GGC` | 80GGC A/B/C totals = sum of row cash/other/total |
| A198 | ENFORCED | `Schedule80GGC` | DonationDate mandatory for 80GGC contribution |
| A199 | ENFORCED | `Schedule80GGC` | other-mode details required for 80GGC |
| A200 | ENFORCED | `Schedule80U` | old: 80U self severe disability = 1,25,000 |
| A201 | ENFORCED | `Schedule80U` | old: 80U self disability = 75,000 |
| A202 | ENFORCED | `Schedule80U` | 80U in VIA => Schedule80U details present |
| A203 | ENFORCED | `Schedule80DD` | old: 80DD dependant disability = 75,000 |
| A204 | ENFORCED | `Schedule80DD` | old: 80DD dependant severe disability = 1,25,000 |
| A205 | ENFORCED | `Schedule80DD` | 80DD in VIA => Schedule80DD details present |
| A206 | ENFORCED | `Schedule80DD` | 80DD deduction > 0 => details required |
| A207 | ENFORCED | `Schedule80U` | 80U deduction > 0 => details required |
| A208 | ENFORCED | `Schedule80U` | 80U deduction > 0 => details required |
| A209 | ENFORCED | `Schedule80DD` | 80DD deduction > 0 => details required |
| A210 | ENFORCED | `PersonalInfo / IncomeDeductions.{GrossSalary,Salary,PerquisitesValue,ProfitsInSalary,NetSalary,DeductionUs16*,IncomeFromSal,AllwncExemptUs10}` | salary income present => EmployerCategory != Not Applicable |
| A211 | ENFORCED | `Schedule80GGC` | 80GGC contributions dated between 01.04.2025 and 31.03.2026 |
| A212 | NA | `PersonalInfo` | Aadhaar in return vs Aadhaar as per profile -- portal profile |
| A213 | ENFORCED | `IncomeDeductions.{GrossSalary,Salary,PerquisitesValue,ProfitsInSalary,NetSalary,DeductionUs16*,IncomeFromSal,AllwncExemptUs10}` | each exempt allowance disclosed in exactly one dropdown |
| A214 | ENFORCED | `IncomeDeductions.{OthersInc,IncomeOthSrc,DeductionUs57iia}` | new regime: 57(iia) <= 1/3 family pension, max 25,000 |
| A215 | ENFORCED | `IncomeDeductions.{GrossSalary,Salary,PerquisitesValue,ProfitsInSalary,NetSalary,DeductionUs16*,IncomeFromSal,AllwncExemptUs10}` | new regime: standard deduction 16(ia) <= 75,000 |
| A216 | ENFORCED | `IncomeDeductions.UsrDeductUndChapVIA / DeductUndChapVIA` | new regime: 80CCD(2) <= 14% salary |
| A217 | ENFORCED | `LTCG112A` | exempt LTCG u/s 112A <= 1,25,000 |
| A218 | ENFORCED | `LTCG112A` | LTCG112A iii = i - ii (LongCap112A = TotSaleCnsdrn - TotCstAcqisn) |
| A219 | NA | `FilingStatus` | 139(9) A23 responses match the defective original -- portal cross-return |
| A220 | ENFORCED | `IncomeDeductions.PropertyDetails[] / TotalIncomeChargeableUnHP` | Section24B bank details required when 24(b) interest claimed |
| A221 | ENFORCED | `IncomeDeductions.UsrDeductUndChapVIA / DeductUndChapVIA` | 80EE/80EEA claimable only when the 24(b) limit is exhausted |
| A222 | ENFORCED | `Schedule80E/80EE/80EEA/80EEB / IncomeDeductions.PropertyDetails[] / TotalIncomeChargeableUnHP` | 80EE loan bank details form part of the 24(b) schedule details |
| A223 | ENFORCED | `Schedule80E/80EE/80EEA/80EEB / IncomeDeductions.PropertyDetails[] / TotalIncomeChargeableUnHP` | 80EEA loan bank details form part of the 24(b) schedule details |
| A224 | ENFORCED | `Schedule80C` | 80C: Amount and IdentificationNo required to claim |
| A225 | ENFORCED | `Schedule80E/80EE/80EEA/80EEB` | 80EE bank/loan details required |
| A226 | ENFORCED | `IncomeDeductions.UsrDeductUndChapVIA / DeductUndChapVIA` | PRAN (PRANDtls) required for 80CCD(1)/80CCD(1B) |
| A227 | ENFORCED | `Schedule80E/80EE/80EEA/80EEB` | 80EE loan amount <= 35,00,000 |
| A228 | ENFORCED | `Schedule80E/80EE/80EEA/80EEB` | 80EEA bank/loan details required |
| A229 | ENFORCED | `Schedule80E/80EE/80EEA/80EEB` | 80EEA stamp-duty value <= 45,00,000 |
| A230 | ENFORCED | `Schedule80E/80EE/80EEA/80EEB` | 80EEA loan sanction date between 01.04.2019 and 31.03.2022 |
| A231 | ENFORCED | `Schedule80E/80EE/80EEA/80EEB` | 80EEB bank/loan details required |
| A232 | ENFORCED | `Schedule80E/80EE/80EEA/80EEB` | 80EEB loan sanction date between 01.04.2019 and 31.03.2023 |
| A233 | ENFORCED | `IncomeDeductions.UsrDeductUndChapVIA / DeductUndChapVIA` | Form 10BA (Form10BAAckNum) required for 80GG |
| A234 | ENFORCED | `Schedule80D` | 80D 1a premium-row breakup matches HealthInsPremSlfFam |
| A235 | ENFORCED | `Schedule80D` | 80D 1b premium-row breakup matches HlthInsPremSlfFamSrCtzn |
| A236 | ENFORCED | `Schedule80D` | 80D 2a premium-row breakup matches HlthInsPremParents |
| A237 | ENFORCED | `Schedule80D` | 80D 2b premium-row breakup matches HlthInsPremParentsSrCtzn |
| A238 | ENFORCED | `Schedule80U / Schedule80DD` | Form 10IA (Form10IAAckNum) for 80U and 80DD |
| A239 | ENFORCED | `IncomeDeductions.UsrDeductUndChapVIA / DeductUndChapVIA` | 80DDB specified-disease details (NameOfSpecDisease80DDB) required |
| A240 | ENFORCED | `IncomeDeductions.PropertyDetails[] / TotalIncomeChargeableUnHP` | HP IntOnBorwCap = TotalInterestUs24B of the Section24B schedule |
| A241 | ENFORCED | `Schedule80C` | 80C in VIA = Schedule80C TotalAmt |
| A242 | ENFORCED | `Schedule80E/80EE/80EEA/80EEB` | 80E in VIA = TotalInterest80E |
| A243 | ENFORCED | `Schedule80E/80EE/80EEA/80EEB` | 80EE in VIA = TotalInterest80EE |
| A244 | ENFORCED | `Schedule80E/80EE/80EEA/80EEB` | 80EEA in VIA = TotalInterest80EEA |
| A245 | ENFORCED | `Schedule80E/80EE/80EEA/80EEB` | 80EEB in VIA = TotalInterest80EEB |
| A246 | ENFORCED | `IncomeDeductions.PropertyDetails[] / TotalIncomeChargeableUnHP` | Section24B rows InterestUs24B sum = TotalInterestUs24B |
| A247 | ENFORCED | `Schedule80C` | Schedule80C rows Amount sum = TotalAmt |
| A248 | ENFORCED | `Schedule80E/80EE/80EEA/80EEB` | Schedule80E rows Interest80E sum = TotalInterest80E |
| A249 | ENFORCED | `Schedule80E/80EE/80EEA/80EEB` | Schedule80EE rows sum = TotalInterest80EE |
| A250 | ENFORCED | `Schedule80E/80EE/80EEA/80EEB` | Schedule80EEA rows sum = TotalInterest80EEA |
| A251 | ENFORCED | `Schedule80E/80EE/80EEA/80EEB` | Schedule80EEB rows sum = TotalInterest80EEB |
| A252 | ENFORCED | `Schedule80E/80EE/80EEA/80EEB` | 80EE loan sanction date between 01.04.2016 and 31.03.2017 |
| A253 | ENFORCED | `IncomeDeductions.PropertyDetails[] / TotalIncomeChargeableUnHP` | new regime: no 24(b) interest for self-occupied property |
| A254 | ENFORCED | `Schedule80D` | old: 80D claimed => Schedule80D details present |
| A255 | ENFORCED | `Schedule80C / Schedule80E/80EE/80EEA/80EEB / ScheduleEA10_13A` | new regime individual => none of 80C/10(13A)/80E/80EE/80EEA/80EEB schedules filled |
| A256 | ENFORCED | `Schedule80D` | 80D 1a(i) insurer name/policy required |
| A257 | ENFORCED | `Schedule80D` | 80D 1b(i) insurer name/policy required |
| A258 | ENFORCED | `Schedule80D` | 80D 2a(i) insurer name/policy required |
| A259 | ENFORCED | `Schedule80D` | 80D 2b(i) insurer name/policy required |
| A260 | ENFORCED | `TDSonSalaries / TDSonOthThanSals / ScheduleTDS3Dtls / ScheduleTCS / TaxPayments` | section 192 not selectable in TDSonOthThanSals / ScheduleTDS3Dtls |
| A261 | ENFORCED | `ScheduleEA10_13A` | HRA <= actual rent paid - 10% of basic+DA |
| A262 | ENFORCED | `ScheduleEA10_13A` | HRA <= 40%/50% of basic+DA (non-metro/metro) |
| A263 | ENFORCED | `ScheduleEA10_13A` | HRA exemption = lowest of actual HRA / rent-10% / 40-50% |
| A264 | ENFORCED | `ScheduleEA10_13A / PersonalInfo` | HRA continuation; nature of employment required with salary+exempt allowances |
| A265 | ENFORCED | `ScheduleEA10_13A` | Schedule EA10(13A) required to claim 10(13A) exempt allowance |
| A266 | ENFORCED | `ScheduleEA10_13A / IncomeDeductions.{GrossSalary,Salary,PerquisitesValue,ProfitsInSalary,NetSalary,DeductionUs16*,IncomeFromSal,AllwncExemptUs10}` | basic + DA + actual HRA <= Salary 17(1) |
| A267 | ENFORCED | `IncomeDeductions.{GrossSalary,Salary,PerquisitesValue,ProfitsInSalary,NetSalary,DeductionUs16*,IncomeFromSal,AllwncExemptUs10}` | 10(10) gratuity <= 25,00,000 for CG/SG/CG-Pensioners/SG-Pensioners |
| A268 | OFFLINE | `PersonalInfo` | individual with date of formation on/after 01.04.2008 barred -- no formation-date field for an individual (vacuous) |
| A269 | ENFORCED | `IncomeDeductions.{GrossSalary,Salary,PerquisitesValue,ProfitsInSalary,NetSalary,DeductionUs16*,IncomeFromSal,AllwncExemptUs10} / ScheduleEA10_13A` | 10(13A) in salary = EligbleExmpAllwncUs13A of Schedule EA |
| A270 | ENFORCED | `IncomeDeductions.{GrossSalary,Salary,PerquisitesValue,ProfitsInSalary,NetSalary,DeductionUs16*,IncomeFromSal,AllwncExemptUs10}` | EIC judge exemption only for CG/SG employees |
| A271 | ENFORCED | `IncomeDeductions.PropertyDetails[] / TotalIncomeChargeableUnHP` | ifLetOut (type of house property) mandatory when 24(b) interest claimed |
| A272 | ENFORCED | `IncomeDeductions.UsrDeductUndChapVIA / DeductUndChapVIA` | DeductUndChapVIA 80C allowed <= UsrDeductUndChapVIA 80C entered |
| A273 | ENFORCED | `IncomeDeductions.UsrDeductUndChapVIA / DeductUndChapVIA` | DeductUndChapVIA 80CCC allowed <= UsrDeductUndChapVIA 80CCC entered |
| A274 | ENFORCED | `IncomeDeductions.UsrDeductUndChapVIA / DeductUndChapVIA` | DeductUndChapVIA 80CCD(1) allowed <= UsrDeductUndChapVIA 80CCD(1) entered |
| A275 | ENFORCED | `IncomeDeductions.UsrDeductUndChapVIA / DeductUndChapVIA` | DeductUndChapVIA 80CCD(1B) allowed <= UsrDeductUndChapVIA 80CCD(1B) entered |
| A276 | ENFORCED | `IncomeDeductions.UsrDeductUndChapVIA / DeductUndChapVIA` | DeductUndChapVIA 80CCD(2) allowed <= UsrDeductUndChapVIA 80CCD(2) entered |
| A277 | ENFORCED | `IncomeDeductions.UsrDeductUndChapVIA / DeductUndChapVIA` | DeductUndChapVIA 80D allowed <= UsrDeductUndChapVIA 80D entered |
| A278 | ENFORCED | `IncomeDeductions.UsrDeductUndChapVIA / DeductUndChapVIA` | DeductUndChapVIA 80DD allowed <= UsrDeductUndChapVIA 80DD entered |
| A279 | ENFORCED | `IncomeDeductions.UsrDeductUndChapVIA / DeductUndChapVIA` | DeductUndChapVIA 80DDB allowed <= UsrDeductUndChapVIA 80DDB entered |
| A280 | ENFORCED | `IncomeDeductions.UsrDeductUndChapVIA / DeductUndChapVIA` | DeductUndChapVIA 80E allowed <= UsrDeductUndChapVIA 80E entered |
| A281 | ENFORCED | `IncomeDeductions.UsrDeductUndChapVIA / DeductUndChapVIA` | DeductUndChapVIA 80EE allowed <= UsrDeductUndChapVIA 80EE entered |
| A282 | ENFORCED | `IncomeDeductions.UsrDeductUndChapVIA / DeductUndChapVIA` | DeductUndChapVIA 80EEA allowed <= UsrDeductUndChapVIA 80EEA entered |
| A283 | ENFORCED | `IncomeDeductions.UsrDeductUndChapVIA / DeductUndChapVIA` | DeductUndChapVIA 80EEB allowed <= UsrDeductUndChapVIA 80EEB entered |
| A284 | ENFORCED | `IncomeDeductions.UsrDeductUndChapVIA / DeductUndChapVIA` | DeductUndChapVIA 80G allowed <= UsrDeductUndChapVIA 80G entered |
| A285 | ENFORCED | `IncomeDeductions.UsrDeductUndChapVIA / DeductUndChapVIA` | DeductUndChapVIA 80GG allowed <= UsrDeductUndChapVIA 80GG entered |
| A286 | ENFORCED | `IncomeDeductions.UsrDeductUndChapVIA / DeductUndChapVIA` | DeductUndChapVIA 80GGA allowed <= UsrDeductUndChapVIA 80GGA entered |
| A287 | ENFORCED | `IncomeDeductions.UsrDeductUndChapVIA / DeductUndChapVIA` | DeductUndChapVIA 80GGC allowed <= UsrDeductUndChapVIA 80GGC entered |
| A288 | ENFORCED | `IncomeDeductions.UsrDeductUndChapVIA / DeductUndChapVIA` | DeductUndChapVIA 80TTA allowed <= UsrDeductUndChapVIA 80TTA entered |
| A289 | ENFORCED | `IncomeDeductions.UsrDeductUndChapVIA / DeductUndChapVIA` | DeductUndChapVIA 80TTB allowed <= UsrDeductUndChapVIA 80TTB entered |
| A290 | ENFORCED | `IncomeDeductions.UsrDeductUndChapVIA / DeductUndChapVIA` | DeductUndChapVIA 80U allowed <= UsrDeductUndChapVIA 80U entered |
| A291 | ENFORCED | `IncomeDeductions.UsrDeductUndChapVIA / DeductUndChapVIA` | DeductUndChapVIA 80CCH allowed <= UsrDeductUndChapVIA 80CCH entered |
| A292 | ENFORCED | `LTCG112A / IncomeDeductions.{GrossTotIncome,GrossTotIncomeIncLTCG112A,TotalIncome}` | LongCap112A = GrossTotIncomeIncLTCG112A - GrossTotIncome |
| A293 | ENFORCED | `FilingStatus / Verification` | capacity Representative => AssesseeRep name/email/contact present |
| A294 | ENFORCED | `FilingStatus` | AsseseeRepFlg = Y => AssesseeRep details present |
| A295 | ENFORCED | `IncomeDeductions.PropertyDetails[] / TotalIncomeChargeableUnHP` | co-owned property: assessee share + co-owners share = 100% |
| A296 | ENFORCED | `IncomeDeductions.PropertyDetails[] / TotalIncomeChargeableUnHP` | co-owned: AnnualOfPropOwned = share% * annual value |
| A297 | ENFORCED | `IncomeDeductions.PropertyDetails[] / TotalIncomeChargeableUnHP` | co-owned share 0 => interest on borrowed capital 0 |
| A298 | ENFORCED | `IncomeDeductions.PropertyDetails[] / TotalIncomeChargeableUnHP` | HP Sl.1d = 1b + 1c |
| A299 | ENFORCED | `IncomeDeductions.PropertyDetails[] / TotalIncomeChargeableUnHP` | HP Sl.1i = 1g + 1h |
| A300 | ENFORCED | `IncomeDeductions.PropertyDetails[] / TotalIncomeChargeableUnHP` | co-owned: assessee PAN != co-owner PAN |
| A301 | ENFORCED | `IncomeDeductions.{GrossSalary,Salary,PerquisitesValue,ProfitsInSalary,NetSalary,DeductionUs16*,IncomeFromSal,AllwncExemptUs10}` | new regime: EIC judge exemption must be 0 |
| A302 | ENFORCED | `IncomeDeductions.UsrDeductUndChapVIA / DeductUndChapVIA` | 80CCC rows Amount sum = 80CCC total (PensionContribution80CCC) |
| A303 | ENFORCED | `IncomeDeductions.ExemptIncAgriOthUs10` | 10(2) HUF share selected at most once |
| A304 | ENFORCED | `IncomeDeductions.ExemptIncAgriOthUs10` | 10(10BB) selected at most once |
| A305 | ENFORCED | `IncomeDeductions.ExemptIncAgriOthUs10` | 10(11A) Sukanya Samriddhi selected at most once |
| A306 | ENFORCED | `IncomeDeductions.ExemptIncAgriOthUs10` | 10(12A) selected at most once |
| A307 | ENFORCED | `IncomeDeductions.ExemptIncAgriOthUs10` | 10(12AA) selected at most once |
| A308 | ENFORCED | `IncomeDeductions.ExemptIncAgriOthUs10` | 10(12AB) selected at most once |
| A309 | ENFORCED | `IncomeDeductions.ExemptIncAgriOthUs10` | 10(12B) selected at most once |
| A310 | ENFORCED | `IncomeDeductions.ExemptIncAgriOthUs10` | 10(12BA) selected at most once |
| A311 | ENFORCED | `IncomeDeductions.ExemptIncAgriOthUs10` | 10(12C) Agniveer Corpus selected at most once |
| A312 | ENFORCED | `IncomeDeductions.ExemptIncAgriOthUs10` | 10(15) selected at most once |
| A313 | ENFORCED | `IncomeDeductions.ExemptIncAgriOthUs10` | 10(19A) selected at most once |
| A314 | ENFORCED | `IncomeDeductions.ExemptIncAgriOthUs10` | 10(23AA) selected at most once |
| A315 | ENFORCED | `IncomeDeductions.ExemptIncAgriOthUs10` | 10(23FBB) selected at most once |
| A316 | ENFORCED | `IncomeDeductions.ExemptIncAgriOthUs10` | 10(23FD) selected at most once |
| A317 | ENFORCED | `IncomeDeductions.ExemptIncAgriOthUs10` | 10(25) selected at most once |
| A318 | ENFORCED | `IncomeDeductions.ExemptIncAgriOthUs10` | 10(32) minor child selected at most once |
| A319 | ENFORCED | `IncomeDeductions.ExemptIncAgriOthUs10` | 10(35) selected at most once |
| A320 | ENFORCED | `IncomeDeductions.ExemptIncAgriOthUs10` | 10(35A) selected at most once |
| A321 | ENFORCED | `IncomeDeductions.ExemptIncAgriOthUs10` | 10(43) selected at most once |
| A322 | ENFORCED | `IncomeDeductions.ExemptIncAgriOthUs10` | 10(44) selected at most once |
| A323 | ENFORCED | `IncomeDeductions.ExemptIncAgriOthUs10` | new regime: 10(32) minor-child exempt income must be 0 |
| A324 | NA | `ITR1_TaxComputation` | 234-I fee = 1,000 if filed after 31.12.2026 & 139(5) & TI<=5L -- filing timestamp (clock) |
| A325 | ENFORCED | `Schedule80G` | 80G: IFSC and transaction ref mandatory when donation in mode other than cash |
| A326 | ENFORCED | `Schedule80G` | 80G: IFSC and transaction ref mandatory when donation other than cash (duplicate of A325) |
| A327 | ENFORCED | `Schedule80G` | 80G cash same PAN <= 2000 => eligible allowed up to 2000 or claimed, whichever lower |
| A328 | NA | `ITR1_TaxComputation` | 234-I fee = 5,000 if filed after 31.12.2026 & 139(5) & TI>5L -- filing timestamp (clock) |
| A329 | ENFORCED | `Schedule80GGC` | political-party name and PAN required to claim 80GGC |
| A330 | ENFORCED | `Schedule80GGC` | either cash or other-mode entered under any 80GGC row |
| A331 | ENFORCED | `FilingStatus / PersonalInfo` | representative email/contact != taxpayer email/contact |
| A332 | ENFORCED | `IncomeDeductions.PropertyDetails[] / TotalIncomeChargeableUnHP` | co-owned (PropCoOwnedFlg=YES) => AsseseeShareProperty < 100% |
| A333 | ENFORCED | `IncomeDeductions.PropertyDetails[] / TotalIncomeChargeableUnHP` | co-owned => each co-owner PercentShareProperty > 0 and < 100% |
| A334 | ENFORCED | `IncomeDeductions.PropertyDetails[] / TotalIncomeChargeableUnHP` | not co-owned => AsseseeShareProperty = 100% |
| A335 | ENFORCED | `IncomeDeductions.UsrDeductUndChapVIA / DeductUndChapVIA` | PRAN entered but 80CCD(1) and 80CCD(1B) both 0 |
| A336 | ENFORCED | `IncomeDeductions.PropertyDetails[] / TotalIncomeChargeableUnHP` | RentNotRealized <= AnnualLetableValue (gross rent) |
| A337 | ENFORCED | `IncomeDeductions.UsrDeductUndChapVIA / DeductUndChapVIA` | 80CCC > 0 => at least one PensionContribution80CCC row with identifier/amount |
| A338 | ENFORCED | `PersonalInfo` | SecondaryAdd mandatory (Part A General) |
| A339 | ENFORCED | `PersonalInfo` | AlternateAddress != Address when SecondaryAdd 'No same as primary' |

## Appendix · per-serial classification (Category D)

| Serial | Bucket | Block on `I` | Advisory (re-joined) |
|---|---|---|---|
| D1 | ENFORCED (Dd) | `ITR1_TaxComputation / PersonalInfo` | relief u/s 89 claimed (Section89>0) => advisory to furnish Form 10E; Aadhaar quoting u/s 139AA |
| D2 | ENFORCED (Dd) | `TDSonOthThanSals` | special-rate TDS section (194B/BB/BA/IA/IC/LA/S) in TDS2 => ITR-1 may not be eligible (special-rate income); PAN-Aadhaar linking |
| D3 | ENFORCED (Dd) | `ScheduleTDS3Dtls` | special-rate TDS section (194B/BB/BA/IA/IC/LA/S) in TDS3 => ITR-1 may not be eligible |
| D4 | ENFORCED (Dd) | `TDSonOthThanSals` | special-rate income advisory (continuation) -- TDS2 section codes |
| D5 | ENFORCED (Dd) | `TDSonOthThanSals` | 194E/194LB/194LC/194LBA(a/b/c)/195/196A/196B/196C/196D/196D(1A) in TDS2 => ITR-1 not applicable |
| D6 | ENFORCED (Dd) | `ScheduleTDS3Dtls / TDSonOthThanSals` | same 195/196x set in TDS3; 194Q/194C/194R in TDS2 => ITR-1 not applicable |
| D7 | ENFORCED (Dd) | `ScheduleTDS3Dtls` | 194Q/194C/194R in TDS3 => ITR-1 not applicable |
| D8 | ENFORCED (Dd) | `TDSonSalaries / IncomeDeductions.GrossSalary` | TDS deducted in Schedule TDS1 cannot exceed Total Gross Salary |
| D9 | ENFORCED (Dd) | `TDSonSalaries / IncomeDeductions.GrossSalary` | TDS1 value <= Gross Salary (continuation of D8) |

