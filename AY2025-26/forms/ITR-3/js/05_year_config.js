/* =====================================================================
   YEAR OVERLAY — ITR-3 · A.Y. 2025-26 (F.Y. 2024-25)
   ---------------------------------------------------------------------
   The ONE place that carries everything year-specific for this build.
   To port to the next assessment year, edit this file (slab table, §87A
   limits, due date, assessment-year leaf, FY-boundary years, AMTC year
   list) and the handful of schema/rule deltas from a fresh diff run — the
   core engine, sections and unchanged rules never move.

   Loads right after 00_form.js (which defines window.FORM) and before
   every engine/section/rule file, so they read these values as globals.
   95_shell.js loads LAST and reads YC for its DUE / YREND date globals.

   Sources (AY 2025-26, from fields_ITR-3_AY2025-26.tsv):
     · Form_ITR3.AssessmentYear leaf "2025" (enum ['2025']).
     · FilingStatus.ItrFilingDueDate enum ['2025-07-31','2025-10-31',
       '2025-11-30'] — 31 Jul non-audit, 31 Oct audit-case, 30 Nov 92E.
     · ScheduleAMTC.CurrAssYr / ITR3ScheduleUD.CurrAssYr enum ['2025-26'].
     · NEW-regime slab table and §87A (₹7,00,000 ceiling / ₹25,000 cap
       with marginal relief) are the F.Y. 2024-25 rates under s.115BAC
       (six bands 0/5/10/15/20/30%; the AY 2026-27 seven-band table with a
       25% band and ₹12,00,000/₹60,000 §87A does NOT apply this year).
     · NEW-regime basic exemption ₹3,00,000 (was ₹4,00,000 in AY 2026-27).
     · OLD-regime slabs and §87A (₹5,00,000 / ₹12,500) are unchanged
       year-to-year and stay in 70_sec_tax.js.
   ===================================================================== */
const YC = {
  ay: "2025-26",            /* A.Y. label shown in the header + working-file meta */
  ayYear: "2025",           /* Form_ITR3.AssessmentYear / PartA_139_8A.AssessmentYear leaf */
  fy: "2024-25",            /* previous year (F.Y.) */
  due: "2025-07-31",        /* FORM.due fallback — non-audit 139(1) due date */
  fyStartYear: 2024,        /* calendar year the P.Y. begins (01-04-2024) — 234C Q1-Q3 */
  fyEndYear: 2025,          /* calendar year the P.Y. ends   (31-03-2025) — age ref, YREND,
                               234A/234B start (01-04-2025), advance-vs-SAT challan split */

  /* ItrFilingDueDate dropdown (FilingStatus) — the three enum values, with display */
  dueDates: [["2025-07-31","31/07/2025"],["2025-10-31","31/10/2025"],["2025-11-30","30/11/2025"]],
  dueDefault: "2025-10-31",   /* default when audit / IF / 5A apply (mirrors base 2026-10-31) */

  /* NEW regime (s.115BAC) slab table for F.Y. 2024-25: cumulative upper band + rate% */
  slabNew: [[300000,0],[700000,5],[1000000,10],[1200000,15],[1500000,20],[Infinity,30]],
  exemptNew: 300000,        /* NEW-regime basic exemption (Tax Calculated C33/C34) */

  /* §87A rebate */
  rebateNewTI: 700000, rebateNewMax: 25000,   /* NEW: total income <= 7L -> min(tax, 25,000), marginal above */
  rebateOldTI: 500000, rebateOldMax: 12500,   /* OLD: total income <= 5L -> min(tax, 12,500) */

  cessRate: 0.04,           /* health & education cess */

  /* Schedule AMTC — the current assessment year label and the immediately
     preceding AY whose set-off-in-earlier-years column must be nil. */
  currAssYr: "2025-26",     /* ScheduleAMTC.CurrAssYr (enum ['2025-26']) */
  prevAssYr: "2024-25",     /* last-prior-year set-off cap row */

  /* AMTC utilisation table — the thirteen prior assessment years (i–xiii),
     2012-13 … 2024-25 for current A.Y. 2025-26 (each shifts down one year). */
  amtcYrs: ["2012-13","2013-14","2014-15","2015-16","2016-17","2017-18","2018-19",
            "2019-20","2020-21","2021-22","2022-23","2023-24","2024-25"]
};
window.YC = YC;

/* Overlay the year onto the form identity defined in 00_form.js. */
if (window.FORM) { window.FORM.ay = YC.ay; window.FORM.due = YC.due; }
