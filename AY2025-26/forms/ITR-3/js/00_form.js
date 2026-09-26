/* =====================================================================
   ITR-3 · A.Y. 2025-26 — Phase 2 shell instantiation (STUB).
   Every section is present with its title and a placeholder body.
   Real fields, engines and rules arrive in Phase 4.
   ===================================================================== */
/* FORM.ay and FORM.due are the assessment-year label and the ITR-3 filer's
   139(1) due date. They are set from the YEAR OVERLAY in 05_year_config.js
   (loaded next), the single source of everything year-specific — for
   A.Y. 2025-26, ay "2025-26" and non-audit due "2025-07-31" (the audit-case
   31-Oct and 92CE 30-Nov due dates are selected in the return / ret section
   and drive the interest engine). */
window.FORM={id:"ITR-3",name:"ITR-3",sw:"SW10000001"};   /* ay + due overlaid by 05_year_config.js */

/* ---- code tables the shell's commit() may read (kept minimal) ----
   The shell resolves a PIN prefix to a state code and an IFSC prefix to a
   bank name when those fields are edited. No such fields exist in the stub,
   but defining the tables keeps the globals defined. Real tables: Phase 4. */
const PIN2ST={};   /* PIN first-two-digits -> state code */
const BANK={};     /* IFSC first-four-chars -> bank name */
