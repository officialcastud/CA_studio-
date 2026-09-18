# ITR-3 — consolidated audit: our software vs the CBDT Excel utility

Eight parallel Opus agents audited all 40 visible sheets (+ the hidden helper sheets) of the ITR-3
A.Y. 2026-27 utility against `forms/ITR-3/Yukti_ITR3.html` and its `src/*.js`. Per-group detail is in
`G1_general_salary.md` … `G8_other_schedules.md`. This is the summary.

## Headline answer to the CEO's worry ("did we just copy ITR-2? are ITR-3 options missing?")
**No major ITR-2 content bleed.** The ITR-3-unique machinery is genuinely built and correct:
speculative + specified-business (35AD) + intra-head set-off, DPM/DOA depreciation + deemed CG u/s 50,
unabsorbed depreciation, ICDS, slump sale (CG A2/B2), 112A grandfathering, the 23-Jul-2024 CG rate
split, VDA, the **wide AMT trigger set (10AA + 35AD + Ch VI-A Part C**, not ITR-2's narrow pair), the
full loss chain with business/speculative/specified/unabsorbed-dep rows, 10AA (SEZ), Schedule FA's 10
tables, Sch 5A, PTI 115U, ESOP deferral, all business books (BS/Mfg/Trading/P&L/OI/Quantitative/GST).
Every sheet exists; almost every dropdown matches to the value.

**What's actually wrong is not "missing ITR-3 options" — it's (a) the non-resident path, (b) the
tax-audit completion, and (c) a handful of shared-state wiring bugs.** Only two clear ITR-2 bleeds
were found (a free-text nature-of-business grid, and the salary new-regime exempt list).

## Coverage scoreboard (per group)
| Group | Sheets | Verdict | Missing fields | Missing/partial cascades | Regime | Audit |
|---|---|---|---|---|---|---|
| G1 General + Salary | PartA-Gen, Sch S | **MAJOR** | 11 | 4 | 1 severe | 1 |
| G2 Business books | NOB, BS, Mfg, Trading, P&L, OI, Quant, GST | books **SOLID**, audit **MAJOR** | 5 (audit) | 1 | 0 | 5f/1c |
| G3 BP + depreciation | BP, DPM-DOA, DEP_DCG, ESR, UD, ICDS | **MINOR** (strongest) | 2 | 0 | 0 | 0 |
| G4 Capital gains | CG, 112A, 115AD, VDA | **MINOR** (core strong) | 8 | 1+2p | 0 | 0 |
| G5 HP + OS + Loss | HP, OS, CYLA-BFLA, CFL | HP **SOLID**, loss **MAJOR** | 0 | 4 | 0 (1 doc) | 0 |
| G6 Deductions | VI-A + 80x + 10AA | **MINOR** | 4 | 0 | 0 | 0 |
| G7 Tax + Special | PartB-TI/TTI, TaxCalc, AMT, AMTC, TPSA, SPI-SI-IF | **MAJOR** (wiring) | 2 | 1p | 2 | 1 |
| G8 Other + Payments | EI, FSI, TR_FA, AL, PTI, 5A, ESOP, IT, TDS, Verif | **SOLID** | 0 | 0 | 0 | 0 |

Totals: ~**32 missing/thin fields**, ~**11 missing or partial cascades**, **3–4 regime/residential
defects**, and the **44AB tax-audit completion gap**.

---

## TIER 1 — must fix (a wrong or unfileable return)

1. **Tax-audit (44AB) completion is half-built — a 44AB return cannot be filed.** [G1, G2]
   The reveal on `70_sec_ret.js:316-325` stops at auditor firm name/PAN/Aadhaar + furnishing date. It
   never captures **UDIN, auditor membership no, auditor signing name, firm registration no, date of
   the audit report**. (The `PART_A_General.md` book told the builder to leave rows 164H/165H/167H/
   170H/172H unbuilt as if hidden-by-design — they are conditional-reveal, not optional.) Confirm which
   of these have a schema leaf under `PartA_GEN2.AuditInfo`; build the ones that do, gated on
   `sec44AB=Y && audited=Y`.

2. **Residential status is a dead mirror → every NRI/NOR return is computed as Resident.** [G7, G1]
   UI/import write `S.fs.resStatus`, but the tax + special-income engines read `S.pi.res` (stuck at
   `"RES"`): `si.js:161,248`, `tax.js:36,46,136,225`. NRI/NOR basic-exemption set-off, exemption bands,
   87A rebate and senior-234C are all wrong for a non-resident. **One key must own residential status.**

3. **Due date is never wired → audit-case interest/fee over-charged.** [G7]
   234A/B/C + 234F read `S.fs.dueExt` (`tax.js:205`, `shell.js:12`, `00_form.js:10`), which is **never
   written**; the real `S.fs.duedate` (default 31-Oct for audit cases, from `finalDuedate`) is ignored.
   An audited filer is over-charged 234A interest and the 234F fee.

4. **New-regime exempt-allowance engine over-closes statutory 10(x) exemptions → inflated taxable
   salary in the DEFAULT regime.** [G1] `SAL_ALW10_NEW` (`70_sec_sal.js:86`, used at 138, 468) keeps
   only the two `10(14)(115BAC)` codes and zeroes 10(6)/10(7)/10(10)/10(10A)/10(10AA)/10(10B)(i)/(ii)/
   10(10C)/10(10CC) — but the utility's `AllowanceBACYes` list keeps all of those exempt under 115BAC.
   We are taxing gratuity, commuted pension, leave encashment, VRS etc. for every new-regime salaried
   filer. Should use the full `AllowanceBACYes` set.

5. **Current-year loss set-off wiring is wrong in two places → wrong GTI + wrong carry-forward.** [G5]
   (a) `CY_ORDER_HP` omits `'bus'` (`70_sec_loss.js:43`) → a current-year house-property loss is never
   set off against business income (utility [N10] + schema allow it). (b) `§loss` reads
   `os.balanceNoRaceHorse/raceHorseBal/dtaa` but `§os` publishes `netNormal/raceHorse/dtaaTotal` —
   key-name drift, so race-horse loss never reaches CFL, OS-DTAA income is absent from CYLA, and the
   OS normal loss is mis-measured when special-rate OS income is present. Also the HP-loss CYLA order
   diverges from the utility's sal→bus→spec→specified→os→horse→CG.

## TIER 2 — should fix (missing capability / real figure error)

6. **NRI/RNOR residential cascade entirely absent.** [G1] No `ConditionsResStatus` (W36), no
   Jurisdiction+TIN table (r37-40), no days-of-stay this-year/4-preceding-years (r43/44). An NRI/RNOR
   return cannot record why it qualifies. (Related to Tier-1 #2.)

7. **Form 10-IEA "new-regime re-entry" leaves unbuilt.** [G1] Only the old-regime opt-out direction is
   exported (`expWho:189-198`); a filer who opted out and now re-enters the new regime (rows 63-78)
   can't be represented.

8. **CG entry-detail tables entry-less.** [G4] 54/54B/54D/54EC/54F/54G/54GA exemption detail files
   placeholder dates (`DateofTransfer='2025-04-01'` from a never-populated `C.dedD`) with blank CGAS/
   account/IFSC; DTAA relief grids in CG have no UI/export; non-resident CG heads (A4/A5/B5/B6/B8) never
   surface for an NRI; the 194-IA buyer table lacks Aadhaar/Address/State/Pin. 54EE/54GB PAN missing.

9. **80GGA cash cut-off wrong: ₹10,000 in ours, ₹2,000 in the utility** → over-claim. [G6]
   (`70_sec_ded.js:174`, note at 376.)

10. **Nature-of-business is a duplicate writer + ITR-2 bleed.** [G2] A free-text 5-char code grid on
    `ret` (`70_sec_ret.js:354-358`, `S.nob`) AND the full 357-entry dropdown on `bpa`
    (`70_sec_bpa.js:283-286`) both write `PartA_GEN2.NatOfBus.NatureOfBusiness` (order 5 vs 20). The
    free-text `ret` copy is the ITR-2 bleed; drop it.

11. **44AB "bii" sub-flags dropped.** [G1] `AuditInfo.BiiDetails.{44AD,44ADA,44AE,44BB}` (rows 157-160)
    not captured — which presumptive section the assessee falls under (without offering presumptively)
    is lost.

12. **Special-income (SI) auto-population partial.** [G7] Only ~6 of ~15 CG special heads flow from
    Schedule CG into SI; NR/FII/PTI/unlisted CG heads must be re-keyed manually (`si.js:181-189`).

## TIER 3 — minor / polish
- `BP.PLUs44sChapXIIG` export-only, hard-wired 0 — can't be filled, drops on round-trip. [G3]
- DPM 45% P&M block omits the half-rate (<180-day) + additional-depreciation rows. [G3]
- Rule-11A ack fields missing on Schedule 80DD (K15) and 80U (H5). [G6]
- 80G qualifying-limit base uses gross 0.1×GTI, not net of other VI-A; unpicked State80G defaults to
  invalid '99'. [G6]
- 80-IB/80-IE multi-undertaking routing collapsed to one sub-object each. [G6]
- OS family-pension cap: engine correct (25k new / 15k old) but header/hint/check text wrongly say 25k
  both regimes. [G5]
- `impCg` dumps STCG-land exemption grand-total into `s54B`, losing the actual section. [G4]
- AMT surcharge marginal-relief + `Amt_Condn` 35AD substitution not reproduced. [G7]
- Salary exempt-allowance dropdown isn't filtered by regime/employer-category (values all present;
  only the show/hide filtering is absent — engine gate is where #4 lives). [G1]
- Minor Part-A field omissions: secondary mobile, unlisted-share intra-year price columns,
  AuditReportDetails.OtherITActFlag. [G1]

## Schema-faithful omissions (NOT bugs — flagged for CEO confirmation)
The utility visibly collects some fields that have **no schema leaf**, so we correctly drop them
(rule 3): **UDIN / auditor personal name / membership no** (PartA_GEN2 AuditInfo has only firm
name/PAN/Aadhaar — so Tier-1 #1's buildable subset is whatever the schema *does* expose), Form 10-IE
pre-AY24 election rows, Aadhaar Enrolment Id, Passport No, representative Capacity/Address/PAN/Aadhaar.
Worth a one-time check that the portal really files no UDIN.
