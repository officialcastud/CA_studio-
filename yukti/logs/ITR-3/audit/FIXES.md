# ITR-3 — Tier-1 audit fixes (applied on claude/itr-3)

Six correctness fixes from the sheet-by-sheet audit (`CONSOLIDATED.md`). All 8 gates stay GREEN, and
each fix is proven on the case it targets with a targeted harness run (the canonical S SUDHIR client
masked every one of these because its state pre-set `dueExt`/`res`/FA data).

## #2 Residential status — engines read a dead mirror
`S.pi.res` was a seed stuck at "RES"; the UI/export/import use `S.fs.resStatus`. Every engine
(cg, ded, ei, fa, os, si, tax) read `S.pi.res` → every NRI/NOR return computed as Resident.
Fix: all readers now use `S.fs.resStatus`; the dead seed removed. (Also caught 5 `(S.pi||{}).res`
reads a first pass missed.)
**Proof:** senior salary client, old regime — RES tax ₹2,32,960 vs NRI tax ₹2,35,560; NRI pays ₹2,600
more = 5%+cess on the ₹50,000 senior-exemption band an NRI is denied. (Before: identical.)

## #3 Due date — 234A/B/C/F used a never-written field
The interest engine read `S.fs.dueExt` (never set) → fell back to FORM.due = 31-Jul for everyone,
over-charging every audit-case (31-Oct) filer. Fix (tax.js): `D(dmy(S.fs.duedate))||D(S.fs.dueExt)||DUE`.
**Proof:** identical salary client filed 15-Dec, tax ₹89,700 — 234A = ₹1,794 (2 months) at duedate 31-Oct
vs ₹4,485 (5 months) at 31-Jul. Old code gave ₹4,485 for both.

## #4 New-regime exempt allowances — over-closed
`SAL_ALW10_NEW` kept only the two 10(14)(115BAC) codes and zeroed 10(6)/10(7)/10(10)/10(10A)/10(10AA)/
10(10B)(i)&(ii)/10(10C)/10(10CC) — taxing gratuity, commuted pension, leave encashment, VRS for every
new-regime salaried filer. The utility's `RngBacYes` list (DropDownValues col P r21-31) keeps all of
those exempt; only LTA 10(5), HRA 10(13A), generic 10(14), 10(17), EIC close. Fix: expanded the list.
**Proof:** new-regime salary ₹20,00,000 with 10(10) ₹3,00,000 + 10(10AA) ₹2,50,000 → both exported
exempt; GTI = ₹13,75,000 (20,00,000 − 5,50,000 − 75,000 std) to the rupee. Before: GTI would be ₹19,25,000.

## #5 Current-year loss set-off — two wiring faults
(a) `CY_ORDER_HP` omitted `bus` → a current-year house-property loss never set off against business
income. Fixed to the CYLA sheet's R/N-column order: sal → bus → spec → specified → os → race-horse → CG
(and dropped OS-DTAA, which the sheet does not set HP loss against).
(b) `§loss` read `os.balanceNoRaceHorse` / `os.raceHorseBal` / `os.dtaa`, but `§os` publishes
`netNormal` / `raceHorse` / `dtaaTotal` — so OS normal-loss was mis-measured (fell back to os.income
incl. special-rate), race-horse loss never reached CFL, and OS-DTAA income was absent from CYLA. Fixed
the key names. (Structural + canonical client, which has HP loss + business + OS income, stays green.)

## #6 AssetOutIndiaFlag hardcoded "YES" (found while proving the above)
`PartB_TTI.AssetOutIndiaFlag` was hardcoded "YES" in the skeleton and never set from data, so **any
resident with no foreign assets** exported flag=YES with no Schedule FA → rule A901 **blocked the return**
(the common case). The canonical client masked it by holding foreign assets. Fix: engFa publishes
`S.C.fa.hasFA` (RES-only, any FA row); tax export writes the flag from it.
**Proof:** the no-FA salary client now exports with `AssetOutIndiaFlag = NO` (0 rules firing).

## #1 Audit u/s — BiiDetails (the buildable audit gap)
The schema has **no** UDIN / membership no / auditor person-name / audit-report-date leaf (only
`AuditReportFurnishDate` + firm name/PAN/Aadhaar, already written), so the "44AB return can't be filed"
claim was over-stated. The real buildable gap — `AuditInfo.BiiDetails.{44AD,44ADA,44AE,44BB}` (which
presumptive section the assessee falls under under condition "bii") — is now captured (UI in ret.js when
Cndnfor44AB="bii", plus export + import in who.js).

## Not changed (documented, out of Tier-1 scope)
NRI residential *cascade* (jurisdiction/TIN/days-of-stay capture), 10-IEA new-regime re-entry leaves,
CG entry-detail tables, 80GGA ₹2,000 cut-off, nature-of-business duplicate writer — see CONSOLIDATED.md
Tier-2/3. These do not corrupt the resident return.

---

## Tier-2 completion + schema-leaf coverage (this pass)

Built the remaining entry-detail and NRI capability, then verified with a new leaf-by-leaf
schema-coverage auditor (`tools/coverage.py`): every schema block's every leaf must have a home
(export path / object-literal key / data-p input). **Result: 0 of 2798 required leaves uncovered.**

- **80GGA cash cut-off** ₹10,000 → ₹2,000 (utility 80GGA sheet S7: cash over ₹2,000 gives no deduction).
- **CG Part D deduction-claim detail tables** (54/54B/54D/54EC/54F/54G/54GA/115F) — real entry tables
  with CGAS/date/cost/account/IFSC; removed the fabricated `DateofTransfer:"2025-04-01"`. `DeducClaimInfo`
  is schema-required so it stays `{TotDeductClaim:0}` for a no-deduction client (round-trip unchanged).
- **CG 194-IA buyer detail** columns (Aadhaar / Address / State / Pin / Country) now enterable.
- **CG unutilized-CG** columns (YrInWhichAssetAcq / AmtUtilized) added + exported; LTCG deem import added.
- **CG impCg s54B** import bug fixed (reads per-section ExemptionSecCode instead of dumping the grand total).
- **CG non-resident heads** A4 (NRITransacSec48Dtl), A5 (NRISecur115AD), B5 (NRIProvisoSec48),
  B6 (NRIOnSec112and115[]), B8 (NRISaleofForeignAsset), and the A9/B12 DTAA grids
  (NRICgDTAA.NRIDTAADtls[], ApplicableRate = lower of treaty & IT-Act) — gated on non-resident.
  Also fixed B7 export writing an invalid key `NRISecurLTCGProviso` → `NRISaleOfEquityShareUs112A`.
- **Part A NRI capture** — ConditionsResStatus, JurisdictionResPrevYr (jurisdiction/TIN grid),
  TotalPrStayIndiaPrevYr / 4PrecYr (days of stay), and the Form 10-IEA new-regime re-entry leaves.
- **Foreign refund bank** (Refund.BankAccountDtls.ForeignBankDetails[]: SWIFT/BankName/CountryCode/IBAN) —
  for a non-resident with no Indian account.
- **80-IC** DeductInNorthEast.TotDeductInNorthEast sub-total now emitted.

Every fix keeps the canonical resident S SUDHIR return byte-identical (all new fields empty ⇒ nothing new).
All 8 gates GREEN. Data note (flagged, not blocking): `books/ITR-3/enums.json` `JurisdictionResidence`
labels are shuffled (codes correct) — the jurisdiction UI uses the vetted Schedule-FA country list instead.

Remaining: 25 OPTIONAL leaves without a UI space (secondary mobile; unlisted-share intra-year columns;
Schedule80DD/80U Form-10IA ack; ScheduleCG UnutilizedStcg/Ltcg flags + PTI pass-through CG nature amounts;
ScheduleESOP per-year tax-attributed totals). None is mandatory; listed for a follow-up pass.
