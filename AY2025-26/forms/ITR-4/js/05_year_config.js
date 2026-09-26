/* =====================================================================
   YEAR OVERLAY — ITR-4 (Sugam) · A.Y. 2025-26 (F.Y. 2024-25)
   ---------------------------------------------------------------------
   The ONE place that carries everything year-specific for this build.
   To port to the next assessment year, edit this file (slab table, §87A
   limits, due date, assessment-year leaf, FY-boundary years) and the
   handful of schema/rule deltas from a fresh itr_diff.py run — the core
   engine, sections and unchanged rules never move. (PLAN.md §7.)

   Loads right after 00_form.js (which defines window.FORM) and before
   every engine/section/rule file, so they read these values as globals.

   ITR-4 (Sugam) is a presumptive return (44AD/44ADA/44AE) but the
   personal-tax slab / §87A / regime logic is the same resident-individual
   ladder as ITR-1, so these values are identical to the ITR-1 overlay.

   Sources (AY 2025-26):
     · Assessment year leaf "2025"  and  ItrFilingDueDate "2025-07-31"
       are the values the CBDT AY 2025-26 ITR-4 schema pattern-locks
       (fields_ITR-4_AY2025-26.tsv: Form_ITR4.AssessmentYear pattern 2025,
        PartA_139_8A.AssessmentYear pattern 2025,
        FilingStatus.ItrFilingDueDate pattern 2025-07-31).
     · NEW-regime slab table and §87A (₹7,00,000 ceiling / ₹25,000 cap,
       with marginal relief) are the F.Y. 2024-25 rates under s.115BAC.
     · OLD-regime slabs and §87A (₹5,00,000 / ₹12,500) are unchanged
       year-to-year and stay in 70_sec_inccore.js.
   ===================================================================== */
const YC = {
  ay: "2025-26",            /* A.Y. label shown in the header + working-file meta */
  ayYear: "2025",           /* Form_ITR4.AssessmentYear / PartA_139_8A.AssessmentYear leaf */
  fy: "2024-25",            /* previous year (F.Y.) */
  due: "2025-07-31",        /* FilingStatus.ItrFilingDueDate — the 234A / 234F reference date */
  fyStartYear: 2024,        /* calendar year the P.Y. begins (01-04-2024) — 234C Q1-Q3 */
  fyEndYear: 2025,          /* calendar year the P.Y. ends   (31-03-2025) — age ref, 234B/234C Q4,
                               advance-vs-self-assessment challan split */

  /* NEW regime (s.115BAC) slab table for F.Y. 2024-25: cumulative upper band + rate (as a fraction) */
  slabNew: [[300000,0],[700000,0.05],[1000000,0.10],[1200000,0.15],[1500000,0.20],[Infinity,0.30]],

  /* §87A rebate */
  rebateNewTI: 700000, rebateNewMax: 25000,   /* NEW: total income <= 7L -> min(tax, 25,000), marginal above */
  rebateOldTI: 500000, rebateOldMax: 12500,   /* OLD: total income <= 5L -> min(tax, 12,500) */

  cessRate: 0.04            /* health & education cess */
};
window.YC = YC;

/* Overlay the year onto the form identity defined in 00_form.js. */
if (window.FORM) { window.FORM.ay = YC.ay; window.FORM.due = YC.due; }
