# ITR-1 (SAHAJ) — structure note · A.Y. 2026-27

ITR-1 is the return for a **resident individual** (ordinarily resident, not a
director in a company, holding no unlisted equity) whose total income is up to
Rs.50 lakh and comes only from salary/pension, one house property, other sources
(interest, dividend, family pension) and long-term capital gains u/s 112A up to
Rs.1.25 lakh. The new tax regime is the default (`OptOutNewTaxRegime = "N"`);
the filer opts out to the old regime (`"Y"`).

## Screen sections (10) — screen order / compute order

| id | Section | order | corder | Owns |
|---|---|---|---|---|
| who | Personal information | 10 | 10 | PersonalInfo, CreationInfo, Form_ITR1 |
| ret | Filing status & tax regime | 20 | 12 | FilingStatus (+ PartA_139_8A, PartB-ATI when 139(8A)) |
| sal | Salary income | 30 | 30 | ITR1_IncomeDeductions (salary), ScheduleEA10_13A |
| hp | Income from house property | 40 | 40 | ITR1_IncomeDeductions (PropertyDetails, Section24BDtls) |
| os | Income from other sources | 50 | 44 | ITR1_IncomeDeductions (OthersInc, DeductionUs57iia) |
| ded | Chapter VI-A deductions | 60 | 50 | UsrDeductUndChapVIA, DeductUndChapVIA, Schedule80* |
| ei | Exempt income | 70 | 28 | ITR1_IncomeDeductions.ExemptIncAgriOthUs10 |
| tax | Tax computation | 90 | 90 | ITR1_TaxComputation, LTCG112A |
| paid | Taxes paid (TDS/TCS/advance/SAT) | 80 | 92 | TaxPaid, TDSonSalaries, TDSonOthThanSals, ScheduleTDS3Dtls, ScheduleTCS, TaxPayments |
| bank | Bank accounts & verification | 95 | 95 | Refund, Verification |

`order` is the on-screen (navigation) order; `corder` is the compute order the
2-pass fixpoint uses (income heads → exempt income → deductions → tax → interest).

## Utility sheets → sections

The ITR-1 utility crams most of the return onto the single visible **Income
Details** sheet (personal info, filing status & regime, salary, other sources,
Chapter-VI-A totals, exempt income and the Part B tax computation). Yukti splits
that one sheet into seven on-screen sections (who/ret/sal/os/ded/ei/tax). The
remaining sheets are separate: **HP** (house property) and its hidden **Schedule
24(b)** loan table; the hidden **Schedule EA 10(13A)** HRA schedule; the hidden
139(8A) sheets **Part A Gen_139(8A)** / **Part B ATI**; **TDS**, **TCS** and
**Taxes Paid and Verification**; and the hidden OLD-regime deduction detail
sub-sheets (**80C**, **80D**, **80G**, **80GGA**, **80GGC**, **80U-80DD**,
**80E_80EE_80EEA_80EEB**). Five lookup/summary/help sheets (**BankCode**,
**IFSC**, **DataBase**, **SUMMARY**, **Help**) hold no schema block and are
excluded. Full per-sheet mapping in `section_map.json`.

## Export envelope

The return is `{ "ITR": { "ITR1": { … } } }`. `buildReturn()` deep-clones the
required-key skeleton (`skeleton.json` → `SKEL`), each section's export writer
fills its block(s), and the whole is wrapped as `{ITR:{ITR1:j}}`.
`importReturn()` unwraps `I.ITR1` and each section's reader re-seeds `S`.
`Form_ITR1.AssessmentYear` and (when present) `PartA_139_8A.AssessmentYear` are
emitted as **"2026"** (the utility hard-codes 2025 — a utility bug we correct).
The Chapter-VI-A detail schedules and the 139(8A) blocks are conditional
(OLD regime / `ReturnFileSec == 21`) and are not in the base skeleton.
