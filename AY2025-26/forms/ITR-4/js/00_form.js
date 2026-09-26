/* =====================================================================
   ITR-4 (Sugam) · A.Y. 2025-26 — Phase 2 shell instantiation (STUB).
   Every section is present with its title and a placeholder body.
   Real fields, engines and rules arrive in Phase 4.
   ===================================================================== */
/* FORM.ay and FORM.due are the assessment year label and ITR-4's
   ItrFilingDueDate. They are set from the YEAR OVERLAY in 05_year_config.js
   (loaded next), the single source of everything year-specific — for
   A.Y. 2025-26, ay "2025-26" and due "2025-07-31" (the CBDT AY 2025-26
   schema pattern-locks FilingStatus.ItrFilingDueDate to 2025-07-31). */
window.FORM={id:"ITR-4",name:"ITR-4 (Sugam)",sw:"SW10000001"};   /* ay + due overlaid by 05_year_config.js */

/* ---- code tables the shell's commit() may read (kept minimal) ----
   The shell resolves a PIN prefix to a state code and an IFSC prefix to a
   bank name when those fields are edited. No such fields exist in the stub,
   but defining the tables keeps the globals defined. Real tables: Phase 4. */
const PIN2ST={};   /* PIN first-two-digits -> state code */
const BANK={};     /* IFSC first-four-chars -> bank name */
