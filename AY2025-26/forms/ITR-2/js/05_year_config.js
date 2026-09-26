"use strict";
/* =====================================================================
   YEAR OVERLAY — ITR-2 · A.Y. 2025-26 (F.Y. 2024-25)
   ---------------------------------------------------------------------
   The ONE place that carries everything year-specific for this build.
   Loads right after 00_shell_engine.js (which defines the engine bindings
   as `let` so this file can set the year's values) and before every
   section / rule / export file, so they read these values as globals.

   Sources (AY 2025-26):
     · AssessmentYear leaf "2025" and ItrFilingDueDate "2025-07-31" are the
       values the CBDT AY2025-26 ITR-2 schema pattern-locks
       (fields_ITR-2_AY2025-26.tsv: Form_ITR2.AssessmentYear, FilingStatus.ItrFilingDueDate).
     · NEW-regime slab table and §87A (₹7,00,000 ceiling / ₹25,000 cap, with
       marginal relief) are the F.Y. 2024-25 rates under s.115BAC — confirmed by the
       diff chunk (rule A-484→A-507: rebate threshold 12,00,000 → 7,00,000).
     · OLD-regime slabs and §87A (₹5,00,000 / ₹12,500) are unchanged year-to-year.
     · The Budget-2024 indexation cutoff (23-Jul-2024, CUT in 00_shell_engine.js)
       falls WITHIN F.Y. 2024-25, so it is unchanged.
   ===================================================================== */
const YC = {
  ay: "2025-26",            /* A.Y. label (header + working-file meta) */
  ayYear: "2025",           /* Form_ITR2.AssessmentYear leaf */
  fy: "2024-25",            /* previous year (F.Y.) */
  due: "2025-07-31",        /* FilingStatus.ItrFilingDueDate — 234A/234F reference date */
  fyStartYear: 2024,        /* P.Y. begins 01-04-2024 (234C Q1-Q3, CG sale-in-FY test) */
  fyEndYear: 2025,          /* P.Y. ends 31-03-2025 (age ref, 234B/234C Q4) */
  ayStartYear: 2025,        /* A.Y. begins 01-04-2025 (234A/234B window, SAT match) */

  /* NEW regime (s.115BAC) slab table for F.Y. 2024-25: cumulative upper band + rate% */
  slabNew: [[300000,0],[700000,5],[1000000,10],[1200000,15],[1500000,20],[Infinity,30]],

  /* §87A rebate */
  rebateNewTI: 700000, rebateNewMax: 25000,   /* NEW: TI <= 7L -> min(tax, 25,000), marginal above */
  rebateOldTI: 500000, rebateOldMax: 12500,   /* OLD: TI <= 5L -> min(tax, 12,500) */

  cessRate: 0.04,           /* health & education cess */

  /* year-boundary dates the interest/234 engine reads (overlaid onto the engine bindings below) */
  DUE:   new Date(2025,6,31),   /* 31-Jul-2025 due date */
  YREND: new Date(2025,2,31),   /* 31-Mar-2025 (end of F.Y. 2024-25) */
  QCUT:  [new Date(2024,5,16), new Date(2024,8,20), new Date(2024,11,15), new Date(2025,2,16)]  /* 234C instalment cut-offs, F.Y. 2024-25 */
};
window.YC = YC;

/* Overlay the year onto the engine's mutable bindings (declared `let` in 00_shell_engine.js). */
SLAB_NEW = YC.slabNew;
DUE      = YC.DUE;
YREND    = YC.YREND;
Q_CUT    = YC.QCUT;

/* Carry-forward loss window shifted back one year to AY2025-26 (FY 2017-18 .. 2024-25). */
CFL_YEARS = [["2017-18","LossCFFromPrev8thYearFromAY",false],["2018-19","LossCFFromPrev7thYearFromAY",false],
 ["2019-20","LossCFFromPrev6thYearFromAY",false],["2020-21","LossCFFromPrev5thYearFromAY",false],
 ["2021-22","LossCFFromPrev4thYearFromAY",true],["2022-23","LossCFFromPrev3rdYearFromAY",true],
 ["2023-24","LossCFFromPrev2ndYearFromAY",true],["2024-25","LossCFFromPrevYrToAY",true]];

/* AMT-credit assessment years for AY2025-26: 2013-14 .. 2024-25 (12 rows). */
AMTC_YRS = ["2013-14","2014-15","2015-16","2016-17","2017-18","2018-19","2019-20","2020-21","2021-22","2022-23","2023-24","2024-25"];

/* Overlay the form identity if present. */
if (window.FORM) { window.FORM.ay = YC.ay; window.FORM.due = YC.due; }
