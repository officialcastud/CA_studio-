# ITR-1 AY2025-26 — Step 2b execution plan (schema + rule deltas)

Steps 1 (multi-file split) and 2a (year overlay) are done, verified and committed.
This file scopes the remaining Step 2b work so it lands as **complete, verified
sub-units** — a half-applied schema change makes the form export an invalid
AY 2025-26 return, so each sub-unit must be finished and re-checked before the next.

## The verification bar (run after every sub-unit)

`itr_tools/schema_conformance.py` compares the form's exported return against the
AY 2025-26 leaf inventory (`reports/data/fields_ITR-1_AY2025-26.tsv`). Drive it to
`RESULT: CLEAN`:

```
# 1) export the current build with the golden state re-dated on-time
python3 tools/harness/run_form.py --form ITR-1 \
    --html /home/user/ca-ay2025/AY2025-26/forms/ITR-1/index.html \
    --state tests/ITR-1/state.js --out /tmp/itr1run          # (run from ca-itr1/yukti)
# 2) conformance
python3 schema_conformance.py --tsv reports/data/fields_ITR-1_AY2025-26.tsv \
    --json /tmp/itr1run/return.json                          # (run from itr_tools)
```

Baseline at end of Step 2a (golden state): 36 EMITTED_NOT_IN_SCHEMA, 3
REQUIRED_MISSING, 0 TYPE_MISMATCH — see `reports/ITR-1_conformance.txt`. Note the
checker only flags leaves the *golden state populates*; the full 3a list is 78
fields, so also grep the source for the removed paths (empty arrays hide the rest).

Alongside conformance, keep the **figures to the rupee** (both regimes) and a
schema-valid **round-trip** (export → import → re-export identical). Old-regime
golden: GTI 9,85,000 / TI 8,10,000 / tax 74,500 / net 77,480 / refund 2,520.

## Sub-units (do in this order; each ends CLEAN + figures intact)

### A. House property — the big one (3a: 41 fields out; 3b: flat + ScheduleUs24B)
AY 2026-27 emits a nested `ITR1_IncomeDeductions.PropertyDetails[]` (address,
co-owners, tenants, embedded `Rentdetails.Section24B`). AY 2025-26 is FLAT:
- Add under `ITR1_IncomeDeductions`: `TypeOfHP` (S/L/D), `GrossRentReceived`,
  `TaxPaidlocalAuth`, `AnnualValue` (REQ), `StandardDeduction` (REQ, 30% of AV),
  `ArrearsUnrealizedRentRcvd`, `InterestPayable`, `TotalIncomeOfHP` (REQ, min −2L).
- Move loan rows to a NEW top-level `ScheduleUs24B.ScheduleUs24BDtls[]`
  (BankOrInstnName, DateofLoan, InterestUs24B, LoanAccNoOfBankOrInstnRefNo,
  LoanOutstndngAmt, LoanTknFrom[B|I], TotalLoanAmt) + `TotalInterestUs24B`.
- Remove `TotalIncomeChargeableUnHP` (3a).
- Files: `js/70_sec_hp.js` (export `expHp`, import `impHp`, engine, UI data model),
  `js/10_state.js` SKEL, HP rules in `js/61_rules_enc_*` (paths reference
  PropertyDetails — re-point to the flat leaves / ScheduleUs24B).
- Keep the single-property model the UI already uses; drop co-owner/tenant/address
  capture (ITR-1 AY 2025-26 has none). Verify the −1,80,000 self-occupied 24(b)
  loss still reaches GTI and the golden figures hold.

### B. Personal info (3a): drop secondary/alternate address
Remove `PersonalInfo.SecondaryAdd`, `PersonalInfo.Address.{MobileNoSec,
EmailAddressSec,CountryCodeMobileNoSec}`, and the whole `PersonalInfo.AlternateAddress`
(9 fields). Files: `js/70_sec_who.js` (UI + export + import), `js/10_state.js` SKEL,
any who-rules referencing SecondaryAdd / AlternateAddress signatures (e.g. A337/A338).

### C. Filing status (3a): drop representative-assessee block
Remove `FilingStatus.AsseseeRepFlg` and `FilingStatus.AssesseeRep` (4 fields).
Files: `js/70_sec_ret.js` (or who — wherever FilingStatus is written), SKEL, rules.

### D. Tax computation (3a): drop 234-I
Remove `ITR1_TaxComputation.IntrstPay.FeeFurnish234I` (kept at 0 today). Already
computed as f234i in `70_sec_paid`/`70_sec_tax`; stop emitting the leaf. The 4e
wording note also drops "+ Fees u/s 234-I" from the total-interest rule text.

### E. Chapter VI-A deductions (3a/3b)
- `PensionContribution80CCC[]` (array, 3 fields) OUT; `PRANDtls[]` (array) OUT.
- `UsrDeductUndChapVIA.PRANNum` IN as a **scalar** string.
- Files: `js/70_sec_ded.js` export/import + SKEL + 80CCD PRAN rules (A226→A234).

### F. Exempt income (3a/3b): NatureDesc enum replaces Category/SubCategory
Out: `ExemptIncAgriOthUs10Dtls[].{Category,Description,SubCategory}`. In:
`.NatureDesc` (enum AGRI/10(10BC)/10(10D)/… — see 3b) + `.OthNatOfInc`. Also salary
`AllwncExemptUs10Dtls[].SalOthNatOfInc` IN. Files: `js/70_sec_ei.js`, `js/70_sec_sal.js`, SKEL, EI rules.

### G. Section 89A (3b): foreign-retirement income (new for ITR-1 AY 2025-26)
Add `ITR1_IncomeDeductions.{IncomeNotified89A (REQ), IncomeNotified89AType[],
IncomeNotifiedOther89A, Increliefus89A, Increliefus89AOS}` and the OthersInc
`OthersIncDtlsOthSrc[].{NOT89AInc.DateRange.*, NOT89A[]}`. `IncomeNotified89A` is
schema-REQUIRED at the IncomeDeductions level, so it must be emitted (0 when none).
Files: `js/70_sec_os.js`, `js/70_sec_sal.js` (89A relief), SKEL.

### H. Schedule 80G / 80GGC (3a)
Drop `Schedule80G.*.DoneeWithPan[].{IFSCCode,TransactionRefNum}` (8 fields) and
`Schedule80GGC.Schedule80GGCDetails[].{PoliticalPartyName,PoliticalPartyPAN}`.
Files: the 80G/80GGC writers in `js/70_sec_ded.js`, SKEL, rules.

### I. PartA_139_8A / PartB-ATI (3b, 17 + 34 fields)
Updated-return (139(8A)) blocks. The AY 2026-27 build already emits a partial
`PartA_139_8A`; AY 2025-26 needs the full 17-field block + the 34-field `PartB-ATI`
computation, but ONLY when the return is filed u/s 139(8A). Optional otherwise —
confirm they are absent (not zero-stubbed) for an ordinary 139(1) return so the
conformance check does not flag them. Files: `js/70_sec_ret.js`, SKEL.

### J. Constraint/enum changes (3d, 9 fields)
Apply the length/enum tweaks from chunk `06_3d_CHANGE_constraints_enums.md`
(e.g. `UsrDeductUndChapVIA.PRANNum` and `Sch80DInsDtls.InsurerName` maxLength;
`FilingStatus.ReturnFileSec` enum "21" for 139(8A)). Mostly input maxlength / enum
option edits.

## Rules (after schema is CLEAN)

- 4a DISABLE (77) / 4b ADD (19) / 4c CHANGE (15): work chunks `08_4a`,`09_4b`,`10_4c`
  against `reports/data/rules_ITR-1_AY2025-26.json` (the target rule set). The
  Category-A rule bodies live in `js/61_rules_enc_01..08.js`.
- 4d year-only: only A-211 (80GGC dates) — DONE in Step 2a.
- 4f renumber (125): remap the coded `A(<n>, …)` numbers old→new (map in chunk
  `11_4d…` §4f). Keep a census id map. `js/60_rules.js` header + each
  `61_rules_enc_*.js` header still say "A.Y. 2026-27" — update when renumbering.
- Bar: `gate.py --gate 6` style — 0 Category-A failures on the golden; coded
  A-count == target A-count; runRules matches `rules_ITR-1_AY2025-26.json`.

## Gates (Step 3-4)

The yukti `gate.py` expects AY 2026-27 `books/`. For the port, either (a) generate
AY 2025-26 `books/ITR-1` (skeleton/enums/rules) from the CBDT AY 2025-26 sources +
`fields_*.tsv` / `rules_*.json`, or (b) rely on `schema_conformance.py` + the rule
JSON + figures/round-trip as the bar. Decide with the user. The single-file
`Yukti_ITR1.html` (from `build.py`) is what `gate.py`/the harness parse.
