# The book of ITR-1 on-screen sections — A.Y. 2026-27

The section plan the rebuild presents to the filer, each mapped to the schema
block(s) it fills. Order follows the utility's own tab flow (Income Details →
TDS → Taxes Paid & Verification, with the deduction sub-sheets behind their
Chapter-VI-A rows). This is the sole input to the section-builder phase.

Regime gating is shown per section; `new` = OptOutNewTaxRegime N (BacValue 1),
`old` = OptOutNewTaxRegime Y (BacValue 2).

---

## S1 · Who — Personal information
**Schema:** `PersonalInfo`, and `CreationInfo` + `Form_ITR1` (auto-filled).
- Name (First/Middle/Surname), PAN, DOB, Aadhaar.
- Address: ResidenceNo, RoadOrStreet, LocalityOrArea, CityOrTownOrDistrict,
  StateCode (enum), CountryCode, PinCode/ZipCode, mobile (+country code), email,
  secondary mobile/email.
- SecondaryAdd (Y/N) → optional `AlternateAddress` block.
- EmployerCategory (enum, 9 codes) — drives HRA schedule visibility.
- Age derived from DOB → senior/super-senior status for tax & interest.

## S2 · Filing status & regime
**Schema:** `FilingStatus` (+ `PartA_139_8A`/`PartB-ATI` when updated return).
- **Tax regime toggle** → OptOutNewTaxRegime (N=new default, Y=old). This is the
  master gate for every Chapter-VI-A detail schedule (S5) and the HRA schedule.
- ReturnFileSec (enum, ITR-1 valid: 11/12/17/20/21 only). 13/14/15/16/18 must be
  blocked with a clear message.
- Conditional: NoticeNo/NoticeDate (13/14/15/16/18/20), ReceiptNo/OrigRetFiledDate
  (17/18/21). ItrFilingDueDate auto (2026-07-31).
- Seventh-proviso 139(1) flags (SeventhProvisio139 + three sub-flags & amounts).
- clauseiv7provisio139i flag + details.
- AsseseeRepFlg → AssesseeRep block (representative filer).
- **If ReturnFileSec == 21 (139(8A))**: unlock the whole updated-return section →
  `PartA_139_8A` (reasons, period, unabsorbed-depreciation years) and `PartB-ATI`
  (head-wise income, additional-tax computation, Schedule IT-1/IT-2 challans,
  140B, relief u/s 89).

## S3 · Salary income
**Schema:** `ITR1_IncomeDeductions` (salary leaves) + `ScheduleEA10_13A`.
- GrossSalary, Salary (17(1)), PerquisitesValue (17(2)), ProfitsInSalary (17(3)).
- Allowances exempt u/s 10 → `AllwncExemptUs10Dtls[]` (SalNatureDesc enum +
  amount). Under new regime only the 115BAC-permitted subset is offered.
- Deductions u/s 16: 16(ia) std deduction (computed, 75k/50k), 16(ii)
  entertainment (govt only), 16(iii) professional tax.
- **HRA (10(13A))**: `old` regime + EmployerCategory != NA → ScheduleEA10_13A
  (place of work metro/non-metro, actual HRA, rent paid, basic+DA, computed
  eligible exemption). Its result feeds an AllwncExemptUs10 `10(13A)` row.
- NetSalary, IncomeFromSal (computed).

## S4 · House property
**Schema:** `ITR1_IncomeDeductions.PropertyDetails[]` (+ `TotalIncomeChargeableUnHP`).
- Repeating per property: address, PropertyOwner (enum SE/MI/SP/OT), co-owned
  flag + CoOwners[], ifLetOut (S/L/D), TenantDetails[] (for let/deemed).
- Rentdetails: AnnualLetableValue, RentNotRealized, LocalTaxes, 30%-standard,
  interest on borrowed capital (24(b), Section24BDtls[] loan table), arrears,
  IncomeOfHP.
- Caps: self-occupied 24(b) ₹2,00,000; HP-loss set-off ₹2,00,000 (see caps.md §5).

## S5 · Income from other sources
**Schema:** `ITR1_IncomeDeductions.OthersInc` + `IncomeOthSrc`, `DeductionUs57iia`.
- OthersIncDtlsOthSrc[] rows (OthSrcNatureDesc enum: SAV/IFD/TAX/OII/FAP/DIV/PF
  provisos/OTH), amount + optional nature text.
- Dividend row carries the quarterly DateRange break-up (for 234C).
- DeductionUs57iia (family-pension standard deduction under 57(iia)).

## S6 · Chapter VI-A deductions
**Schema:** `UsrDeductUndChapVIA` (entered) + `DeductUndChapVIA` (allowed) + the
detail schedules (`old` regime only).
- Entered amounts for all 20 sections → utility caps them into the allowed
  block (see caps.md §3). New regime leaves only 80CCD(2) + 80CCH(2) standing.
- Detail sub-screens (old regime), each behind its row:
  - **80C** → Schedule80C (Amount + IdentificationNo rows). Group cap ₹1.5L.
  - **80CCC** → PensionContribution80CCC[] (PRAN/OTHPRAN + name + amount).
  - **80CCD(1B)/80CCD(2)** → PRANDtls[] (PRAN numbers) when NPS claimed.
  - **80D** → Schedule80D (4 insurer sub-blocks, age-based; flags Y/N/S, Y/N/P).
  - **80DD** → Schedule80DD (nature 1/2, type 1/2, dependent, Form10IA, UDID).
  - **80DDB** → NameOfSpecDisease80DDB enum + 80DDBUsrType.
  - **80U** → Schedule80U (nature 1/2, type 1/2, Form10IA, UDID).
  - **80E/80EE/80EEA/80EEB** → loan tables (LoanTknFrom B/I, bank, loan, interest;
    80EEA adds PropStmpDtyVal, 80EEB adds VehicleRegNo).
  - **80G** → Schedule80G (four donee buckets 100%/50% × with/without limit).
  - **80GG** → Form10BAAckNum (rent, no HRA).
  - **80GGA** → Schedule80GGA (RelevantClause enum, donee, donation).
  - **80GGC** → Schedule80GGC (political party name/PAN, date, non-cash amount).
  - **80TTA/80TTB** → amounts only (₹10k / ₹50k senior).

## S7 · Tax computation
**Schema:** `ITR1_TaxComputation` + `LTCG112A`.
- Slab tax (regime-specific), 87A rebate (AO177 formula, marginal relief),
  TaxPayableOnRebate, 4% cess, GrossTaxLiability.
- Relief u/s 89 (Section89).
- NetTaxLiability, interest 234A/234B/234C, fee 234F, 234-I fee → TotalIntrstPay,
  TotTaxPlusIntrstPay.
- LTCG112A: exempt long-term capital gain u/s 112A disclosure (≤ ₹1.25L),
  sale/cost/gain.

## S8 · Taxes paid — TDS / TCS / advance / self-assessment
**Schema:** `TaxPaid` + `TDSonSalaries` + `TDSonOthThanSals` + `ScheduleTDS3Dtls`
+ `ScheduleTCS` + `TaxPayments`.
- TDS on salary: TAN, employer, income charged, TDS (→ TDSonSalary[]).
- TDS other than salary: TAN, deductor, section (TDSSection enum), year, amount,
  claimed (→ TDSonOthThanSal[]).
- TDS on rent 26QB: tenant PAN/Aadhaar/name, section, year, deducted, claimed
  (→ TDS3Details[]).
- TCS: TAN, collector, amount, year, brought-forward, claimed (→ TCS[]).
- Advance / self-assessment challans: BSR, date, serial, amount (→ TaxPayment[]).
- Totals roll into TaxPaid.TaxesPaid (AdvanceTax/TDS/TCS/SAT/Total) + BalTaxPayable.

## S9 · Exempt income
**Schema:** `ITR1_IncomeDeductions.ExemptIncAgriOthUs10`.
- ExemptIncAgriOthUs10Dtls[] rows: Category enum (8 codes) + SubCategory enum
  (section-10 clauses) + Description (only for circular/notification/receipt) +
  amount. Total → ExemptIncAgriOthUs10Total.

## S10 · Bank accounts & verification
**Schema:** `Refund` + `Verification` (+ optional `TaxReturnPreparer`).
- Bank accounts: IFSC, bank name, account number, AccountType enum
  (SB/CA/CC/OD/NRO/OTH), UseForRefund flag → AddtnlBankDetails[]. RefundDue.
- Verification: AssesseeVerName, FatherName, AssesseeVerPAN, Capacity (S/R),
  Place.
- TRP (optional): identification no, name, reimbursement from govt.

---

## Section → schema block map (one-line index)

| Section | Primary schema block(s) | Regime gate |
|---|---|---|
| S1 Personal info | PersonalInfo, CreationInfo, Form_ITR1 | both |
| S2 Filing status & regime | FilingStatus (+ PartA_139_8A, PartB-ATI) | both |
| S3 Salary | ITR1_IncomeDeductions.(salary), ScheduleEA10_13A | HRA sched: old only |
| S4 House property | ITR1_IncomeDeductions.PropertyDetails[] | both |
| S5 Other sources | ITR1_IncomeDeductions.OthersInc | both |
| S6 Chapter VI-A | UsrDeductUndChapVIA, DeductUndChapVIA, Schedule80* | detail scheds old only |
| S7 Tax computation | ITR1_TaxComputation, LTCG112A | both |
| S8 Taxes paid | TaxPaid, TDSonSalaries, TDSonOthThanSals, ScheduleTDS3Dtls, ScheduleTCS, TaxPayments | both |
| S9 Exempt income | ITR1_IncomeDeductions.ExemptIncAgriOthUs10 | both |
| S10 Bank & verification | Refund, Verification, TaxReturnPreparer | both |
