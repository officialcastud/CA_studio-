/* DEFECT scenario: a VDA gain taxed under the BUSINESS head (Schedule VDA
   head = "BI").  BP.md I16 says Schedule BP A3f = MAX(0, VDA.TotalIncomeBI)
   and PARTB_TI_TTI.md J9 says Part B-TI 2(iv) = BP 3d + 3e + 3f, but the form
   leaves A3f a manual input and never computes 2(iv) — so rules A267 and
   A801 block the export of an otherwise lawful return. */
S.cg.vda=[{buy:"20/06/2025",sale:"28/12/2025",head:"BI",cost:200000,cons:450000}];
S.bp.a3f=250000;      /* what BP.md I16 says the form should compute itself */
