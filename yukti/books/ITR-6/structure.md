# ITR-6 — the structure (the continuous sheet)

Eighteen sections, ordered the way a company return is filled: who is filing, the company's particulars, the audited accounts, then each head of income, set-off, deductions, the special-rate and MAT computations, the disclosure schedules, taxes paid, Part B, and verification. One sheet, a left index that scrolls to a section, collapse-and-open at every level.

ITR-6 is the **company return**: unlike ITR-2 the financial-statement schedules (Balance Sheet, Manufacturing/Trading/P&L in both regular and Ind-AS forms, OI, QD, OL), Schedule BP with its depreciation chain (DPM/DOA/DEP/DCG/ESR), MAT (115JB) + MATC, and the company-specific disclosures (holding/subsidiary, shareholding SH-1/SH-2, unincorporated-entity investment IF, 115TD, GST, FD) are all live and visible.

| # | Section | id | Sheets it holds (utility) | Schema blocks |
|---|---|---|---|---|
| 1 | Who is filing | who | PART A - GENERAL | PartA_GEN1 |
| 2 | Company particulars | gen | GENERAL2, NATURE OF BUSINESS | PartA_GEN2For6 |
| 3 | Audited accounts | accounts | BALANCE SHEET, Part A-Manufacturing Account, Part A-Trading Account, PROFIT LOSS, Part A-BS - Ind AS, Part AManufacturingAccountIndas, Part A-Trading Account Indas, Part A-P& L - Ind AS, PART - A OI, QUANTITATIVE DETAILS, PART-A OL | PARTA_BSFor6FrmAY13, ManufacturingAccount, TradingAccount, PARTA_PL, PARTA_BSIndAS, ManufacturingAccountIndAS, TradingAccountIndAS, PARTA_PLIndAS, PARTA_OI, PARTA_QD, PARTA_OL |
| 4 | Business and profession | bp | BP, DPM_DOA, DEP_DCG, ESR, ICDS | CorpScheduleBP, ScheduleDPM, ScheduleDOA, ScheduleDEP, ScheduleDCG, ScheduleESR, ScheduleICDS |
| 5 | Capital gains | cg | CG, 112A, 115AD(1)(b)(iii) proviso, VDA | ScheduleCG, Schedule112A, Schedule115AD, ScheduleVDA |
| 6 | Other sources | os | OS | ScheduleOS |
| 7 | House property | hp | HOUSE PROPERTY | ScheduleHP |
| 8 | Losses — set-off and carry-forward | loss | CYLA-BFLA, CFL, Unabsorbed Depreciation | ScheduleCYLA, ScheduleBFLA, ScheduleCFL, ITRScheduleUD |
| 9 | Deductions | ded | VIA, 80G, 80GGA, RA, 80, 80M, 80GGB, 80GGC, 80IAC, 80LA, 10AA | ScheduleVIA, Schedule80G, Schedule80GGA, Schedule80RA, Schedule80_IA, Schedule80_IB, Schedule80_IC, Schedule80GGB, Schedule80GGC, Schedule80IAC, Schedule80LA, Schedule10AA |
| 10 | Special-rate income | si | SI | ScheduleSI |
| 11 | Exempt income | ei | EI | ScheduleEI |
| 12 | MAT — section 115JB | mat | MAT, MATC | ScheduleMAT, ScheduleMATC |
| 13 | Foreign income and assets | fa | FSI, TR_FA | ScheduleFSI, ScheduleTR1, ScheduleFA |
| 14 | Assets, liabilities and shareholding | al | AL-1, AL-2, SH-1 AND SH-2 | ScheduleAL, ScheduleSH |
| 15 | Other schedules | other | PTI, IF, TPSA, Schedule 115TD, GST, FD | SchedulePTI, ScheduleIF, ScheduleTPSA, Schedule115TD, ScheduleGST, ScheduleFD |
| 16 | Taxes paid | paid | IT, TDS | ScheduleIT, ScheduleTDS2, ScheduleTDS3, ScheduleTCS |
| 17 | Part B — total income and tax | tax | PARTB - TI - TTI, Tax (hidden — the method) | PartB-TI, PartB_TTI |
| 18 | Verification | bank | Verification | Verification |

Notes:
- **80M** has its own sheet but no separate schema block — its dividend-distribution table feeds `ScheduleVIA.UsrDeductUndChapVIA.Section80MDtls[]`; mapped to `ded`/`ScheduleVIA` with `why_built`.
- **AL-1** (unlisted company) and **AL-2** (start-up) are two parts of the single `ScheduleAL` block (`AsstLiabilitiesUnlistedCompany`, `AsstLiabilitiesStartUps`).
- **NATURE OF BUSINESS** and **GENERAL2** both belong to `PartA_GEN2For6` (nature of business, holding status, business organisation, ownership/key persons, shareholders, MSME, audit).
- **Tax** is the hidden computation sheet behind Part B-TTI and the interest — read, not shown (`why_built`), mirroring ITR-2's "Tax Calculated".
- `CreationInfo` and `Form_ITR6` are metadata blocks with no sheet.

Excluded (with reasons) — see `section_map.json`: the Home index page, the veryHidden subsidiary-lookup helper, the 139(8A) updated-return variant, and every other hidden helper/superseded/navigation sheet (HelpCSV, OS_Old, DB, BBS, Part B ATI, Index, Help, SUMMARY, CG Pop up_prefill).
