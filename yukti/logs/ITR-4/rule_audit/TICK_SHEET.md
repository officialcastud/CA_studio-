# ITR-4 — CBDT validation-rule enforcement TICK SHEET

Cross-check of every rule the audit flagged (GAP + WEAK) against the shipped rule engine, regenerated after the fix pass. A rule is **ticked** when a live `A(n,…)` / `Dd(n,…)` check (direct, loop-coded, or advisory) enforces it in an assembled, all-gates-green build.

**Status: 120 / 122 enforced (105 GAP + 17 WEAK).** Remaining 2 are offline-impossible (no schema field / external DB) and documented below.

Build at tick time: Gates G0–G7 GREEN.

## Enforced (ticked)

### GAP — 103 enforced
- [x] **A10** — 44AD ineligibility for commission agents/44AA(1) not enforced; code is free text  (not encoded)  → `61_rules_fix_01.js`
- [x] **A15** — 44ADA ineligibility for business persons not cross-checked  (not encoded)  → `61_rules_fix_01.js`
- [x] **A30** — 80DDB eligible-category description not enforced unlike 80DD/80U  (not encoded)  → `61_rules_fix_01.js`
- [x] **A68** — non-govt entertainment allowance 16(ii) not zeroed (inccore:209 allows <=5000 all empcat)  (not encoded)  → `61_rules_fix_01.js`
- [x] **A72** — no cap 10(7) <= gross salary; dropdown live but no A(72)  (not encoded)  → `61_rules_fix_01.js`
- [x] **A80** — no old-regime cap 10(14)(i) <= salary 17(1); no A(80)  (not encoded)  → `61_rules_fix_01.js`
- [x] **A81** — no old-regime cap 10(14)(ii) <= salary 17(1); no A(81)  (not encoded)  → `61_rules_fix_01.js`
- [x] **A83** — 10(10D) once-only missing; D20 sub free-text, no A(83)  (not encoded)  → `61_rules_fix_01.js`
- [x] **A84** — 10(11) once-only missing; no A(84)  (not encoded)  → `61_rules_fix_01.js`
- [x] **A86** — 10(13) once-only missing; no A(86)  (not encoded)  → `61_rules_fix_01.js`
- [x] **A87** — 10(16) once-only missing; no A(87)  (not encoded)  → `61_rules_fix_01.js`
- [x] **A89** — 10(17A) once-only missing; no A(89)  (not encoded)  → `61_rules_fix_01.js`
- [x] **A90** — 10(18) once-only missing; no A(90)  (not encoded)  → `61_rules_fix_01.js`
- [x] **A92** — 10(19) once-only missing; no A(92)  (not encoded)  → `61_rules_fix_01.js`
- [x] **A93** — 10(26) once-only missing; no A(93)  (not encoded)  → `61_rules_fix_01.js`
- [x] **A99** — 80G table(A) cash-or-other mandatory not enforced; grid cols not req, no A(99)  (not encoded)  → `61_rules_fix_01.js`
- [x] **A100** — 80G table(B) cash-or-other mandatory not enforced; no A(100)  (not encoded)  → `61_rules_fix_01.js`
- [x] **A101** — 80G table C cash-or-other mandatory not enforced; Total is a free input  (70_sec_ded.js:389)  → `61_rules_fix_02.js`
- [x] **A102** — 80G table D cash-or-other mandatory not enforced  (70_sec_ded.js:389)  → `61_rules_fix_02.js`
- [x] **A104** — 80G (A) Total=cash+other not validated; only bucket C encoded  (70_sec_ded.js:391)  → `61_rules_fix_02.js`
- [x] **A105** — 80G (B) Total=cash+other not validated  (70_sec_ded.js:391)  → `61_rules_fix_02.js`
- [x] **A107** — 80G (D) Total=cash+other not validated  (70_sec_ded.js:391)  → `61_rules_fix_02.js`
- [x] **A108** — individual cash>2000 struct-handled but same-PAN cash aggregation missing  (70_sec_ded.js:132)  → `61_rules_fix_02.js`
- [x] **A109** — duplicate donee PAN not checked  (not encoded)  → `61_rules_fix_02.js`
- [x] **A115** — b/f and current-FY TDS can share one row; not separated  (not encoded)  → `61_rules_fix_02.js`
- [x] **A123** — IFSC not matched against RBI database (external DB, offline unenforceable)  (70_sec_ded.js:493)  → `61_rules_fix_02.js`
- [x] **A139** — financial particulars req:1 label only; not enforced when turnover present  (70_sec_inccore.js:539)  → `61_rules_fix_02.js`
- [x] **A140** — no check that ITR-4 discloses 44AD/44AE/44ADA income  (not encoded)  → `61_rules_fix_02.js`
- [x] **A142** — no cross-check that TDS receipts are offered to tax  (70_sec_paidbank.js:374)  → `61_rules_fix_02.js`
- [x] **A143** — std deduction min(75000,netSal) both regimes; old-regime 50000 cap unenforced/contradicted  (70_sec_inccore.js:208)  → `61_rules_fix_02.js`
- [x] **A151** — HRA+80GG 55k interaction not enforced; engine caps 80GG at 60k only  (70_sec_ded.js:76)  → `61_rules_fix_02.js`
- [x] **A155** — 80CCD(1) 10% of salary cap absent; only 20% GTI applied  (70_sec_ded.js:226)  → `61_rules_fix_02.js`
- [x] **A162** — relief u/s 89 is user input; not checked against zero salary/family pension  (70_sec_inccore.js:692)  → `61_rules_fix_02.js`
- [x] **A164** — HUF/Firm 80EEB not blocked (80EE is, 80EEB is not; no A rule)  (70_sec_ded.js:211)  → `61_rules_fix_02.js`
- [x] **A165** — Sch TDS1 not status-gated; HUF/Firm salary-TDS unchecked  (70_sec_paidbank.js:280)  → `61_rules_fix_02.js`
- [x] **A186** — 10(14)(ii) transport-handicapped 38400 cap not enforced (sub-type not distinguished)  (70_sec_inccore.js:131)  → `61_rules_fix_03.js`
- [x] **A187** — old-regime 10(14)(i)(a-c)/handicapped sub-clause restriction not enforced (generic codes; text truncated)  (70_sec_inccore.js:130)  → `61_rules_fix_03.js`
- [x] **A188** — 148-proceeding revised-return bar not enforced (no filing-history capture)  (70_sec_inccore.js:110)  → `61_rules_fix_03.js`
- [x] **A212** — HUF-not-eligible-44ADA not enforced; no status guard on 44ADA  (not encoded)  → `61_rules_fix_03.js`
- [x] **A213** — 44AE goods-carriage reg no uniqueness not enforced (note only)  (not encoded)  → `61_rules_fix_03.js`
- [x] **A215** — 10(10CC) not capped to TDS u/s 192 in TDS1 (only vs perquisites)  (not encoded)  → `61_rules_fix_03.js`
- [x] **A225** — 80CCH eligibility (CG, joining age 17-27) not enforced  (not encoded)  → `61_rules_fix_03.js`
- [x] **A235** — Regime not forced to N/A nor greyed for Firm  (70_sec_inccore.js:389)  → `61_rules_fix_03.js`
- [x] **A247** — Other-mode 80GGC transaction details not required/checked  (not encoded)  → `61_rules_fix_03.js`
- [x] **A249** — VIA 80U user+system vs Schedule 80U not checked (80DD has it, 80U missing)  (not encoded)  → `61_rules_fix_03.js`
- [x] **A252** — 80DD Form 10-IA ack not enforced; exporter omits silently  (not encoded)  → `61_rules_fix_03.js`
- [x] **A253** — 80U Form 10-IA ack not enforced; exporter omits silently  (not encoded)  → `61_rules_fix_03.js`
- [x] **A254** — Member-of-HUF dependent (code 8) not tied to status=H  (not encoded)  → `61_rules_fix_03.js`
- [x] **A259** — mobile required but no 10-digit/validity check  (not encoded)  → `61_rules_fix_03.js`
- [x] **A264** — Firm A23 (115BAC) not greyed/N-A; carries a value  (not encoded)  → `61_rules_fix_04.js`
- [x] **A267** — Total-income-excl-LTCG112A <= 50L eligibility ceiling not enforced (UI hint only)  (not encoded)  → `61_rules_fix_04.js`
- [x] **A270** — no check that 24(b) limit is exhausted before 80EE/80EEA  (not encoded)  → `61_rules_fix_04.js`
- [x] **A271** — 80EE bank details not cross-checked against 24(b)  (not encoded)  → `61_rules_fix_04.js`
- [x] **A273** — 80C nature/id detail not validated; exporter defaults id to NA  (not encoded)  → `61_rules_fix_04.js`
- [x] **A279** — 80EEA loan date range 1.4.19-31.3.22 not validated; blank defaults to 2025-04-01  (not encoded)  → `61_rules_fix_04.js`
- [x] **A282** — 80GG Form 10BA ack not enforced  (not encoded)  → `61_rules_fix_04.js`
- [x] **A287** — Form 10-IA for 80U/80DD not enforced (UI note only)  (not encoded)  → `61_rules_fix_04.js`
- [x] **A288** — 80DDB specified-disease detail not enforced  (not encoded)  → `61_rules_fix_04.js`
- [x] **A301** — No 80EE loan-sanction date-range (1.4.16-31.3.17) check; date defaults on export  (not encoded)  → `61_rules_fix_04.js`
- [x] **A303** — Firm block partial: 80E and 80EEB not zeroed for Firm; no A(303)  (70_sec_ded.js:204-213)  → `61_rules_fix_04.js`
- [x] **A306** — 80D 1a(i) insurer/policy not enforced; export defaults NA  (70_sec_ded.js:444)  → `61_rules_fix_04.js`
- [x] **A307** — 80D 1b(i) insurer/policy not enforced; export defaults NA  (70_sec_ded.js:444)  → `61_rules_fix_04.js`
- [x] **A308** — 80D 2a(i) insurer/policy default NA and receipt/document-no field not captured  (70_sec_ded.js:444)  → `61_rules_fix_04.js`
- [x] **A309** — 80D 2b(i) insurer/policy not enforced; export defaults NA  (70_sec_ded.js:444)  → `61_rules_fix_04.js`
- [x] **A315** — Salary 10(13A) allowance not tied to ScheduleEA10_13A presence  (not encoded)  → `61_rules_fix_04.js`
- [x] **A316** — basic+DA+HRA received <= salary 17(1) not checked  (not encoded)  → `61_rules_fix_04.js`
- [x] **A318** — Firm/HUF formation on/after 01/04/2026 not blocked; dte has no date bound  (shell/shell.js:75)  → `61_rules_fix_04.js`
- [x] **A319** — Individual minor DOB floor (01/04/2008) not enforced  (shell/shell.js:75)  → `61_rules_fix_05.js`
- [x] **A320** — Salary 10(13A) not forced to equal schedule eligible; independent inputs  (not encoded)  → `61_rules_fix_05.js`
- [x] **A321** — A23A/A23B one-only mutual exclusion not enforced (flattened regime UI)  (70_sec_inccore.js:407-426)  → `61_rules_fix_05.js`
- [x] **A348** — Interest not tied to share; share 0 -> interest 0 not enforced  (70_sec_inccore.js:247)  → `61_rules_fix_05.js`
- [x] **A355** — A23(A)(ii) re-entry sub-tree not modeled; (ii)(a) mandate unenforced  (not encoded)  → `61_rules_fix_05.js`
- [x] **A356** — A23(A)(ii) not modeled; (ii)(b) mandate unenforced  (not encoded)  → `61_rules_fix_05.js`
- [x] **A357** — A23(A)(ii)(b) not modeled; (ii)(b)(i) mandate unenforced  (not encoded)  → `61_rules_fix_05.js`
- [x] **A368** — Missing dedup for 10(10BB); sub is free text  (not encoded)  → `61_rules_fix_05.js`
- [x] **A369** — Missing dedup for 10(11A)  (not encoded)  → `61_rules_fix_05.js`
- [x] **A371** — Missing dedup for 10(12AA)  (not encoded)  → `61_rules_fix_05.js`
- [x] **A372** — Missing dedup for 10(12AB)  (not encoded)  → `61_rules_fix_05.js`
- [x] **A374** — Missing dedup for 10(12BA)  (not encoded)  → `61_rules_fix_05.js`
- [x] **A375** — Missing dedup for 10(12C) Agniveer  (not encoded)  → `61_rules_fix_05.js`
- [x] **A377** — Missing dedup for 10(19A)  (not encoded)  → `61_rules_fix_05.js`
- [x] **A378** — Missing dedup for 10(23AA)  (not encoded)  → `61_rules_fix_05.js`
- [x] **A380** — Missing dedup for 10(23FBB)  (not encoded)  → `61_rules_fix_05.js`
- [x] **A381** — Missing dedup for 10(23FD)  (not encoded)  → `61_rules_fix_05.js`
- [x] **A383** — Missing dedup for 10(25A) ESI  (not encoded)  → `61_rules_fix_06.js`
- [x] **A384** — Missing dedup for 10(30) Tea Board  (not encoded)  → `61_rules_fix_06.js`
- [x] **A386** — Missing dedup for 10(32) minor-child small exemption  (not encoded)  → `61_rules_fix_06.js`
- [x] **A387** — Missing dedup for 10(35) Mutual Funds  (not encoded)  → `61_rules_fix_06.js`
- [x] **A389** — Missing dedup for 10(43) reverse mortgage  (not encoded)  → `61_rules_fix_06.js`
- [x] **A390** — Missing dedup for 10(44) NPS Trust  (not encoded)  → `61_rules_fix_06.js`
- [x] **A392** — 234-I fee (fee234i) free input; not tied to ₹1000/139(5)/<=5L/date  (not encoded)  → `61_rules_fix_06.js`
- [x] **A394** — 80G ref/ifsc not req:1 for non-cash donations; only advisory note  (not encoded)  → `61_rules_fix_06.js`
- [x] **A397** — 234-I fee ₹5000 case (income>5L) not validated; free input  (not encoded)  → `61_rules_fix_06.js`
- [x] **A399** — No check preventing both cash and other-mode in one 80G row  (not encoded)  → `61_rules_fix_06.js`
- [x] **A404** — no check forcing 100% share when not co-owned  (70_sec_inccore.js:611)  → `61_rules_fix_06.js`
- [x] **A409** — no min-row check when 80CCC>0 (identifier table optional)  (70_sec_ded.js:328)  → `61_rules_fix_06.js`
- [x] **A411** — no check that alt address differs from primary when secAdd=N  (70_sec_inccore.js:380)  → `61_rules_fix_06.js`
- [x] **B2** — TDS1 deducted vs gross salary never compared; only row-sum A(118) exists  (not encoded)  → `61_rules_fix_06.js`
- [x] **B4** — Aadhaar quoting (139AA) captured but never required; linking half portal-side  (not encoded)  → `61_rules_fix_06.js`
- [x] **B6** — Special-rate TDS codes selectable in TDS2(i) with no eligibility warning  (not encoded)  → `61_rules_fix_06.js`
- [x] **B7** — Special-rate TDS codes (incl 194R) in TDS2(ii) with no eligibility warning  (not encoded)  → `61_rules_fix_06.js`
- [x] **B8** — 194E/LB/LC/195/196x codes in TDS2(i) selectable, no defect warning  (not encoded)  → `61_rules_fix_07.js`
- [x] **B9** — 194E/LB/LC/195/196x codes in TDS2(ii) selectable, no defect warning  (not encoded)  → `61_rules_fix_07.js`

### WEAK — 17 enforced
- [x] **A37** — Only 60k ceiling enforced; 25%-of-income leg of 80GG missing  (61_rules_g0.js:156)  → `61_rules_fix_01.js`
- [x] **A51** — 87A rebate auto-computed but old-regime 5L threshold uses base=ti-ltcg, excludes LTCG112A required by rule  (70_sec_inccore.js:323)  → `61_rules_fix_01.js`
- [x] **A67** — only flat Rs5000 cap on 16(ii); missing 1/5th-basic alternative and govt-only scope  (61_rules_g0.js:72)  → `61_rules_fix_01.js`
- [x] **A117** — TDS2(i) claim>gross only a warn, not a blocking Category-A check  (70_sec_paidbank.js:386)  → `61_rules_fix_02.js`
- [x] **A161** — 80CCD(2) pensioner bar omits the not-applicable (NA) employer category  (61_rules_g1.js:109)  → `61_rules_fix_02.js`
- [x] **A222** — Exempt-income no-duplicate only for 12 enumerated codes  (61_rules_g0.js:115)  → `61_rules_fix_03.js`
- [x] **A224** — 80CCH capped at 288000 only; 46.2%-of-salary ceiling missing  (70_sec_ded.js:262)  → `61_rules_fix_03.js`
- [x] **A238** — 44ADA capped at 50L unconditionally; ignores cash<=5% to 75L  (61_rules_g0.js:45)  → `61_rules_fix_03.js`
- [x] **A261** — new-regime 57(iia) hard-zeroed; rule allows up to Rs.25,000  (70_sec_inccore.js:272)  → `61_rules_fix_03.js`
- [x] **A263** — engine caps 80CCD(2) at 10% for PSU/Others in new regime (rule says 14%); A(263) uses GrossSalary  (61_rules_g1.js:115)  → `61_rules_fix_03.js`
- [x] **A272** — A(272) checks 80EEA row presence only, not the 24(b) cross-schedule match  (61_rules_g1.js:150)  → `61_rules_fix_04.js`
- [x] **A305** — Omits Schedule80EEB and 10(13A) from the checked schedule list; no status guard  (61_rules_g1.js:124)  → `61_rules_fix_04.js`
- [x] **A353** — Enforces A(i) AY only; A23(A)(ii) re-entry mandate not modeled  (61_rules_g1.js:238)  → `61_rules_fix_05.js`
- [x] **A359** — Guard tests "Yes" but export writes "Y" (inccore:754); A() dead, date backstopped by req:1/checks  (61_rules_g1.js:240)  → `61_rules_fix_05.js`
- [x] **A402** — PRAN enforced only for 80CCD(1B), not 80CCD(1)  (70_sec_ded.js:589)  → `61_rules_fix_06.js`
- [x] **A403** — omits taxpayer secondary contact no (Phone.PhoneNo)  (61_rules_g1.js:233)  → `61_rules_fix_06.js`
- [x] **A405** — dead: guard uses "Y" but enum value is "YES", never fires  (61_rules_g0.js:144)  → `61_rules_fix_06.js`

## Not enforceable offline (documented, accepted)

- [ ] **A167** (GAP) — revised return over 142(1) original not blocked; original section not captured  (70_sec_inccore.js:399)
  _Section under which the ORIGINAL return was filed — not captured by any ITR-4 schema field._
- [ ] **A379** (GAP) — Missing dedup for recognized stock exchange contribution code  (not encoded)
  _10(23EE) Core-SGF — the ITR-4 schema TaxExmpIntIncDtls SubCategory enum has no such value._

