# ITR-3 — the structure (the continuous sheet)

AY 2026-27. ITR-3 is a superset of ITR-2: it keeps every ITR-2 section and adds the
business/profession heads (Part A accounts, BP and depreciation, the profit-linked and SEZ
deductions, GST, partnership firms). Eighteen on-screen sections, ordered by how often an
ITR-3 filer needs them — business income first, because that is what puts a filer on ITR-3.
One continuous sheet, a left index that scrolls to a section, collapse-and-open at every level.

`who` and `ret` are two views of the one **PART A - General** sheet (mapped to `who` in
`section_map.json`); `PartA_GEN2` is split across two sheets — its **AuditInfo** rows sit on
PART A - General (shown under `who`), its **NatOfBus** rows on the Nature Of Business sheet
(shown under `bpa`).

| # | Section | id | Sheets it holds (utility) | Schema blocks |
|---|---|---|---|---|
| 1 | Who is filing | who | PART A - General (personal info, address, residential status, representative assessee) | PartA_GEN1, PartA_GEN2·AuditInfo |
| 2 | Return and regime | ret | PART A - General (filing status, old/new regime & Form 10-IEA, seventh proviso, director / partner / unlisted-share flags) | PartA_GEN1·FilingStatus |
| 3 | Business — Part A accounts | bpa | Nature Of Business, Part A - BS, Manufacturing Account, Trading Account, Profit and Loss, Part A - OI, Quantitative Details, GST | PartA_GEN2·NatOfBus, PARTA_BS, ManufacturingAccount, TradingAccount, PARTA_PL, PARTA_OI, PARTA_QD, ScheduleGST |
| 4 | Business — BP & depreciation | bp | BP, DPM - DOA, DEP_DCG, ESR, Unabsorbed Depreciation, ICDS | ITR3ScheduleBP, ScheduleDPM, ScheduleDOA, ScheduleDEP, ScheduleDCG, ScheduleESR, ITR3ScheduleUD, ScheduleICDS |
| 5 | Salary | sal | Schedule S | ScheduleS |
| 6 | House property | hp | House Property | ScheduleHP |
| 7 | Capital gains | cg | CG, Schedule 112A, Schedule 115AD(1)(iii) proviso, VDA | ScheduleCGFor23, Schedule112A, Schedule115AD, ScheduleVDA |
| 8 | Other sources | os | OS | ScheduleOS |
| 9 | Deductions | ded | VI-A, 80C, 80D, 80G, 80GGA, 80GGC, 80U-80DD, 80E_80EE_80EEA_80EEB, RA, 10AA, 80 | ScheduleVIA, Schedule80C, Schedule80D, Schedule80G, Schedule80GGA, Schedule80GGC, Schedule80U, Schedule80DD, Schedule80E, Schedule80EE, Schedule80EEA, Schedule80EEB, Schedule80RA, Schedule10AA, Schedule80_IA, Schedule80_IB, Schedule80_IC |
| 10 | Losses — set-off and carry-forward | loss | CYLA - BFLA, CFL | ScheduleCYLA, ScheduleBFLA, ScheduleCFL |
| 11 | Taxes paid | paid | TDS, IT | ScheduleTDS1, ScheduleTDS2, ScheduleTDS3, ScheduleTCS, ScheduleIT |
| 12 | Exempt income | ei | EI | ScheduleEI |
| 13 | Specified persons, special rates & firms | si | SPI - SI - IF | ScheduleSPI, ScheduleSI, ScheduleIF |
| 14 | Foreign income and assets | fa | FSI, TR_FA | ScheduleFSI, ScheduleTR1, ScheduleFA |
| 15 | Assets and liabilities | al | AL | ScheduleAL |
| 16 | Other schedules | other | Sch 5A, PTI, ESOP | Schedule5A2014, SchedulePTI, ScheduleESOP |
| 17 | Part B — total income and tax | tax | Part B - TI TTI, AMTC, AMT *(hidden — the method)*, Tax Calculated *(hidden — the method)*, TPSA | PartB-TI, PartB_TTI, ScheduleAMTC, ScheduleAMT, ScheduleTPSA |
| 18 | Bank and verification | bank | Verification, Part B - TI TTI (bank block, from PartB_TTI) | Verification, TaxReturnPreparer |

Seventeen distinct section ids in `section_map.json` (`ret` is a view of the `who` sheet, not a
separate mapping) — within the gate's limit of 20.

## Built on demand — hidden sheets the utility unhides when the claim is made (rule 1)

These are hidden until the taxpayer makes the claim; the utility unhides them on demand and the
sub-schedule is filed, so each is mapped with a `why_built` reason rather than excluded.

- **Deductions (`ded`)** — the Chapter VI-A sub-schedules behind Schedule VI-A: `80C`, `80D`,
  `80G`, `80GGA`, `80GGC`, `80U-80DD`, `80E_80EE_80EEA_80EEB`, `RA` (→ Schedule80RA); plus two
  ITR-3-only groups: **`10AA`** (SEZ deduction → Schedule10AA — an AMT trigger) and **`80`**
  (profit-linked business deductions 80-IA / 80-IB / 80-IE-North-East → Schedule80_IA /
  Schedule80_IB / Schedule80_IC — AMT triggers). The utility labels the third block "80-IE"; the
  schema files its North-East data under `Schedule80_IC`.
- **Part B (`tax`)** — **`AMT`** (→ ScheduleAMT) and **`Tax Calculated`** (no block) are the
  hidden *computation* sheets: the method behind Schedule AMT and Part B-TTI. Read, not shown
  (rule 7).

## Excluded (with reasons) — see `section_map.json`

| Sheet | State | Reason |
|---|---|---|
| Home | visible | the utility's index/navigation page — Yukti's left index replaces it; no schedule, no schema block |
| ISIN List | hidden | reference list of ISINs — lookup data, not a schedule |
| Part A Gen_139(8A) | hidden | the 139(8A) updated-return variant of Part A General — not applicable to an original return |
| Sheet1 | hidden | utility scratch sheet — no schedule, no schema block |
| ITold | veryHidden | utility internals (prior-version carryover) — no schedule |
| HelpCSV | hidden | utility CSV-import helper — data scaffold, not a schedule |
| FSI1 | hidden | helper backing the FSI sheet — FSI is built from the visible FSI sheet; no separate schema block |
| Part B ATI | hidden | Part B-ATI is the updated-return (139(8A) / 140B) computation — not applicable to an original return, and no schema block in ITR-3's list |
| OLDAL | veryHidden | superseded old Assets & Liabilities table; the current AL sheet is built |
| Temporary Values | hidden | utility scratch / temporary values — no schedule |
| DropDownValues | hidden | the utility's dropdown master lists — data, not a schedule |
| CG Pop up_prefill | hidden | capital-gains prefill pop-up helper — CG is built from the visible CG sheet; no separate schema block |
| SUMMARY | hidden | internal preview / summary sheet — no schedule, no schema block |
| BA | hidden | the bank-accounts table (Schedule BA) is filed via PartB_TTI on the visible Part B - TI TTI sheet; a superseded helper copy with no schema block of its own |
| Instructions | hidden | the utility's instructions text — not a schedule |
