/* =====================================================================
   Sections (Phase 2 STUB). One sec<Id>() per screen section from
   books/ITR-3/structure.md, each returning a placeholder body built
   from the shell's renderers. The bar title/ref come from SECS below.
   Real fields, grids and folds are added in Phase 4.
   ===================================================================== */
const TODO="Fields are added in Phase 4.";

function secWho(){return note("<b>Who is filing.</b> Personal information, address, residential status, representative assessee and the audit-info flags (Part A - General; PartA_GEN1 and PartA_GEN2 &middot; AuditInfo). "+TODO);}
function secRet(){return note("<b>Return and regime.</b> Filing status, old / new regime and Form 10-IEA, the seventh proviso to 139(1), and the director / partner / unlisted-share flags (Part A - General &middot; FilingStatus). "+TODO);}
function secBpa(){return note("<b>Business &mdash; Part A accounts.</b> Nature of business, Balance Sheet, Manufacturing, Trading and Profit &amp; Loss accounts, Other Information, Quantitative Details and GST turnover (PARTA_BS / PARTA_PL / PARTA_OI / PARTA_QD / ScheduleGST, and PartA_GEN2 &middot; NatOfBus). "+TODO);}
function secBp(){return note("<b>Business &mdash; BP &amp; depreciation.</b> Schedule BP, the depreciation schedules DPM / DOA / DEP / DCG, scientific-research (ESR), unabsorbed depreciation and ICDS (ITR3ScheduleBP, ScheduleDPM/DOA/DEP/DCG/ESR, ITR3ScheduleUD, ScheduleICDS). "+TODO);}
function secSal(){return note("<b>Salary.</b> Salary, allowances and the section-16 deductions (Schedule S). "+TODO);}
function secHp(){return note("<b>House property.</b> Let-out, self-occupied and deemed-let-out properties with co-owners, tenants and interest on borrowed capital (Schedule HP). "+TODO);}
function secCg(){return note("<b>Capital gains.</b> Short- and long-term capital gains, Schedule 112A, the 115AD(1)(iii) proviso and virtual digital assets (ScheduleCGFor23, Schedule112A, Schedule115AD, ScheduleVDA). "+TODO);}
function secOs(){return note("<b>Other sources.</b> Interest, dividend, special-rate income and race-horse income (Schedule OS). "+TODO);}
function secDed(){return note("<b>Deductions.</b> Chapter VI-A (Schedule VI-A) and its sub-schedules 80C / 80D / 80G / 80GGA / 80GGC / 80U-80DD / 80E group / RA, plus the SEZ deduction 10AA and the profit-linked 80-IA / 80-IB / 80-IE (AMT triggers). "+TODO);}
function secLoss(){return note("<b>Losses &mdash; set-off and carry-forward.</b> Current-year set-off (CYLA), brought-forward set-off (BFLA) and carry-forward of losses (ScheduleCYLA, ScheduleBFLA, ScheduleCFL). "+TODO);}
function secPaid(){return note("<b>Taxes paid.</b> TDS (salary and non-salary), TCS and advance / self-assessment tax (ScheduleTDS1/2/3, ScheduleTCS, ScheduleIT). "+TODO);}
function secEi(){return note("<b>Exempt income.</b> Agricultural income and other exempt income (Schedule EI). "+TODO);}
function secSi(){return note("<b>Specified persons, special rates &amp; firms.</b> Income of specified persons (SPI), special-rate income (SI) and partnership-firm details (ScheduleSPI, ScheduleSI, ScheduleIF). "+TODO);}
function secFa(){return note("<b>Foreign income and assets.</b> Foreign-source income and the tax-relief and foreign-asset schedules (ScheduleFSI, ScheduleTR1, ScheduleFA). "+TODO);}
function secAl(){return note("<b>Assets and liabilities.</b> Schedule AL, filed where total income exceeds the threshold (ScheduleAL). "+TODO);}
function secOther(){return note("<b>Other schedules.</b> Apportionment between spouses governed by a Portuguese Civil Code (Sch 5A), pass-through income (PTI) and ESOP tax deferral under 80-IAC (Schedule5A2014, SchedulePTI, ScheduleESOP). "+TODO);}
function secTax(){return note("<b>Part B &mdash; total income and tax.</b> Part B-TI and Part B-TTI, the AMT credit (AMTC) and tax on secondary adjustment (TPSA); AMT and Tax-Calculated are the hidden computation sheets (PartB-TI, PartB_TTI, ScheduleAMTC, ScheduleAMT, ScheduleTPSA). "+TODO);}
function secBank(){return note("<b>Bank and verification.</b> Bank accounts (from PartB_TTI), the verification declaration and the tax-return-preparer details (Verification, TaxReturnPreparer). "+TODO);}

/* SECS — screen order per books/ITR-3/structure.md. `ret` is a screen view
   of the Part A - General sheet (mapped to `who` in section_map.json). */
const SECS=[
 {id:"who",   t:"Who is filing",                            ref:"Part A - General",   f:secWho,   s:()=>""},
 {id:"ret",   t:"Return and regime",                        ref:"Part A - General",   f:secRet,   s:()=>""},
 {id:"bpa",   t:"Business — Part A accounts",                ref:"BS · P&L · OI · GST",f:secBpa,   s:()=>""},
 {id:"bp",    t:"Business — BP & depreciation",              ref:"Schedule BP · DPM",  f:secBp,    s:()=>""},
 {id:"sal",   t:"Salary",                                    ref:"Schedule S",         f:secSal,   s:()=>""},
 {id:"hp",    t:"House property",                            ref:"Schedule HP",        f:secHp,    s:()=>""},
 {id:"cg",    t:"Capital gains",                             ref:"Schedule CG · 112A", f:secCg,    s:()=>""},
 {id:"os",    t:"Other sources",                             ref:"Schedule OS",        f:secOs,    s:()=>""},
 {id:"ded",   t:"Deductions",                                ref:"Schedule VI-A",      f:secDed,   s:()=>""},
 {id:"loss",  t:"Losses — set-off and carry-forward",        ref:"CYLA · BFLA · CFL",  f:secLoss,  s:()=>""},
 {id:"paid",  t:"Taxes paid",                                ref:"TDS · TCS · IT",     f:secPaid,  s:()=>""},
 {id:"ei",    t:"Exempt income",                             ref:"Schedule EI",        f:secEi,    s:()=>""},
 {id:"si",    t:"Specified persons, special rates & firms",  ref:"SPI · SI · IF",      f:secSi,    s:()=>""},
 {id:"fa",    t:"Foreign income and assets",                 ref:"FSI · TR · FA",      f:secFa,    s:()=>""},
 {id:"al",    t:"Assets and liabilities",                    ref:"Schedule AL",        f:secAl,    s:()=>""},
 {id:"other", t:"Other schedules",                           ref:"Sch 5A · PTI · ESOP",f:secOther, s:()=>""},
 {id:"tax",   t:"Part B — total income and tax",             ref:"Part B-TI · TTI",    f:secTax,   s:()=>""},
 {id:"bank",  t:"Bank and verification",                     ref:"Verification",       f:secBank,  s:()=>""}
];
