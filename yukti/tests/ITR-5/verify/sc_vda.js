/* Scenario: firm with heavy VDA (crypto) transactions — Schedule VDA
   §115BBH 30%, no set-off of the loss row, plus s.194S TDS. All rows are
   taxed under the CAPITAL-GAIN head (the business-head leg is broken —
   see d_vda_business_head.js and the A267/A801 defects in the report). */
S.cg.vda=[
 {buy:"14/07/2025",sale:"09/02/2026",head:"CG",cost:300000,cons:900000},
 {buy:"02/05/2025",sale:"11/11/2025",head:"CG",cost:1000000,cons:600000},
 {buy:"11/01/2026",sale:"20/03/2026",head:"CG",cost:200000,cons:450000}];
S.paid.tds3=[{who:"S",pan:"AAAPB1234Q",sec:"94S",dedOwn:19500,claimOwn:19500,gross:1950000,head:"CG"}];
