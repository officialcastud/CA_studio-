# ITR-2 — the structure (the continuous sheet)

Sixteen sections, ordered by how often a filer needs them. One sheet, a left index that scrolls to a section, collapse-and-open at every level.

| # | Section | id | Sheets it holds (utility) | Schema blocks |
|---|---|---|---|---|
| 1 | Who is filing | who | PART A - General, Home | PartA_GEN1 |
| 2 | Return and regime | ret | PART A - General (filing status, regime, seventh proviso) | PartA_GEN1.FilingStatus |
| 3 | Salary | sal | Schedule S | ScheduleS |
| 4 | Capital gains | cg | CG, Schedule 112A, Schedule 115AD(1)(iii) proviso, VDA | ScheduleCGFor23, Schedule112A, Schedule115AD, ScheduleVDA |
| 5 | Other sources | os | OS | ScheduleOS |
| 6 | House property | hp | House Property | ScheduleHP |
| 7 | Deductions | ded | VI-A, 80C, 80D, 80G, 80GGA, 80GGC, 80U-80DD, 80E_80EE_80EEA_80EEB, RA | ScheduleVIA, Schedule80C … Schedule80EEB |
| 8 | Losses — set-off and carry-forward | loss | CYLA - BFLA, CFL | ScheduleCYLA, ScheduleBFLA, ScheduleCFL |
| 9 | Taxes paid | paid | TDS, IT | ScheduleTDS1, TDS2, TDS3, TCS, IT |
| 10 | Exempt income | ei | EI | ScheduleEI |
| 11 | Specified persons and special rates | si | SPI - SI | ScheduleSPI, ScheduleSI |
| 12 | Foreign income and assets | fa | FSI, TR_FA | ScheduleFSI, ScheduleTR1, ScheduleFA |
| 13 | Assets and liabilities | al | AL | ScheduleAL |
| 14 | Other schedules | other | Sch 5A, PTI, ESOP | Schedule5A2014, SchedulePTI, ScheduleESOP |
| 15 | Part B — total income and tax | tax | Part B - TI TTI, AMTC, Tax Calculated (hidden — the method) | PartB-TI, PartB_TTI, ScheduleAMT, ScheduleAMTC |
| 16 | Bank and verification | bank | Verification, Part B - TI TTI (bank block) | Verification, TaxReturnPreparer |

Excluded (with reasons) — see `section_map.json`: every hidden sheet (business heads, superseded table versions, 10AA), the ISIN reference list.
