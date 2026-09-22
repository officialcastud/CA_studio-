# ITR-7 — the structure (the continuous sheet)

AY 2026-27. ITR-7 is the return for **trusts, institutions and other bodies** filing under
sections **139(4A), 139(4B), 139(4C), 139(4D), 139(4E) and 139(4F)** — charitable / religious
trusts, research associations, news agencies, universities and colleges, political parties,
electoral trusts, business trusts and investment funds. It has **no salary head and no
individual deductions (Chapter VI-A)**; its centre of gravity is what the body *received*
(voluntary contributions and income), what it *applied* to its objects, and what it
*accumulated or set apart* — with the exemption regime it claims driving everything.

Twelve on-screen sections (plus `ret`, a view of the PI sheet), ordered by how often an
ITR-7 filer needs them: who is filing first, then receipts and income, then application and
accumulation — the core of a trust return — then the funds, the special-body schedules, the
special-rate/accreted income, foreign, Part B, tax paid, and verification. One continuous
sheet, a left index that scrolls to a section, collapse-and-open at every level.

**Part A-General is two physical sheets.** `PI` carries the personal information, address,
**details of registration / approval** under the Income-tax Act and under other laws, the
**section under which the return is furnished** (139(4A)–(4D)) and the **exemption section
claimed** (11, 10(23C)(iv)…, 13A, 13B, 21, 35, etc.), plus the filing status — mapped to
`who`, with `ret` (return & exemption status) shown as a view of the same sheet, not a
separate mapping. `Audit` carries the other Part A-General details (change in activities u/s
2(15), first-return and 13(10)/(1) flags), the audit liability u/s 44AB / 92E, the audit
details, liability to audit under any other Act, and the partner/member information — mapped
to `who` as its `PartA_GEN2` half.

| # | Section | id | Sheets it holds (utility) | Schema blocks |
|---|---|---|---|---|
| 1 | Who is filing | who | PI (personal info, address, registration/approval under IT Act & other laws, return section 139(4A)–(4D), exemption section claimed), Audit (2(15)/13(10) other details, 44AB/92E audit, audit under other Acts, partner/member info) | PartA_GEN1, PartA_GEN2 |
| 2 | Return & exemption status | ret | PI *(a view — return furnished u/s 139(4A)–(4D), exemption section claimed, filing status)* | PartA_GEN1·OrgFirmInfo, PartA_GEN1·FilingStatus |
| 3 | Voluntary contributions & income | vc | Schedule VC (voluntary contributions / donations received, incl. corpus & anonymous 115BBC), Schedule AI (aggregate of income derived, excluding voluntary contributions) | ScheduleVC, ScheduleAI |
| 4 | Income & Expenditure statements | ie | Schedule IE-1, Schedule IE-2, Schedule IE-3, Schedule IE-4 (I&E statements per exemption regime — 10(21)/10(22B)/10(23A/B)/10(23C)(iiiab…) etc.) | ScheduleIE_I, ScheduleIE_II, ScheduleIE_III, ScheduleIE_IV |
| 5 | Income under the heads & set-off | heads | Schedule HP, Schedule CG, Schedule VDA, Schedule OS, Schedule OA (business — general), Schedule BP (business income), Schedule PTI (pass-through), Schedule CYLA (current-year loss set-off) | ScheduleHP, ScheduleCG, ScheduleVDA, ScheduleOS, ScheduleOA, CorpScheduleBP, SchedulePTI, ScheduleCYLA |
| 6 | Application & accumulation of income | app | Schedule A (amount applied to stated objects — revenue & capital), Schedule I (accumulation / set-apart u/s 11(2)), Schedule IA (accumulated income taxed in earlier years u/s 11(3)), Schedule D (deemed application, Expln. 1 to 11(1)), Schedule DA (deemed application taxed earlier u/s 11(1B)) | ScheduleA, ITRScheduleI, ITRScheduleIA, ITRScheduleD, ITRScheduleDA |
| 7 | Balance sheet, funds & corpus | funds | BALANCE_SHEET (Part A-BS, consolidated balance sheet), Schedule J (funds & investments on the last day of the year), Schedule R (reconciliation of corpus of Schedule J and the Balance Sheet) | PARTA_BS, ITRScheduleJ, ITRScheduleR |
| 8 | Political party, electoral trust & shareholding | bodies | Schedule PP (political party — 29A registration & 13A conditions), Schedule ET (electoral trust), Schedule SH (shareholding of unlisted company) | SchedulePP, ScheduleET, ScheduleSH |
| 9 | Special-rate, specified & accreted income | si | Schedule SI (income chargeable at special rates), Schedule 115BBI (specified income of certain institutions), Schedule 115TD (accreted income / exit tax) | ScheduleSI, Schedule115BBI, Schedule115TD |
| 10 | Foreign income & assets | fa | Schedule FSI (income from outside India & tax relief), Schedule TR (tax relief u/s 90/90A/91), Schedule FA (foreign assets) | ScheduleFSI, ScheduleTR1, ScheduleFA |
| 11 | Part B — total income & tax | tax | PART-B-TI & TTI (Part B-TI income computation for each exemption regime, Part B-TTI tax), TaxCalc(N) *(hidden — the method)*, TaxCalc *(hidden — the method & interest)* | PartB_TI, PartB_TI2, PartB_TI3, PartB_TTI |
| 12 | Tax payments | paid | IT (advance & self-assessment tax), TDS (TDS as per 16A / 26QB-26QC), TCS | ScheduleIT, ScheduleTDS2, ScheduleTDS3, ScheduleTCS |
| 13 | Bank & verification | bank | Verification (bank accounts, declaration, capacity, TRP) | Verification |

Twelve distinct section ids in `section_map.json` (`ret` is a view of the `who`/`PI` sheet, not
a separate mapping) — well within the gate's limit of 20.

`CreationInfo` and `Form_ITR7` are required internal metadata blocks with no sheet of their own
(the form envelope and creation info) — carried by the form, not shown as a section.

## Read, not shown — hidden computation sheets (rule 7)

The display sheet shows the results; the hidden computation sheet shows the method. These two
are mapped to `tax` with a `why_built` reason rather than excluded, because their formulas are
the engine behind Part B-TTI and the interest — they are read, never painted.

- **`TaxCalc(N)`** — status-wise basic tax, surcharge and rebate rates (the newer table).
- **`TaxCalc`** — the tax and 234A/B/C interest computation.

## Excluded (with reasons) — see `section_map.json`

| Sheet | State | Reason |
|---|---|---|
| Home | visible | the utility's index/navigation page — Yukti's left index replaces it; no schedule, no schema block |
| Part A Gen_139(8A) | hidden | the 139(8A) updated-return variant of Part A-General — not applicable to an original return |
| Schedule K | hidden | Statement of particulars regarding author(s)/founder(s)/trustee(s)/manager(s) — no schema block in ITR-7's block list; not filed as a schedule this year |
| Schedule ER | hidden | application detail (establishment & administrative expenses) — feeds Schedule A; no schema block of its own |
| Schedule EC | hidden | application detail (capital account / capital work in progress) — feeds Schedule A; no schema block of its own |
| Schedule CGold | hidden | superseded prior-version Capital Gains table; the current Schedule CG sheet is built |
| Sheet1 | hidden | utility scratch sheet (0 rows) — no schedule, no schema block |
| Part B ATI | hidden | Part B-ATI is the updated-return (139(8A) / 140B) computation — no schema block, not for an original return |
| CG Pop up_prefill | hidden | capital-gains prefill pop-up helper — Schedule CG is built from the visible CG sheet; no separate schema block |
| SUMMARY | hidden | internal preview / summary sheet — no schedule, no schema block |
| Temporary Values | hidden | utility scratch / temporary values — no schedule |
| DataBase | hidden | master lookup data (pincodes, dropdown lists) — data, not a schedule |
| Instructions | hidden | the utility's instructions text — not a schedule |
