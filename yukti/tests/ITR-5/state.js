/* ====== Integrator smoke-state for ITR-5 · A.Y. 2026-27 ======
   A minimal LAWFUL firm return that fills every mandatory identity / filing /
   nature-of-business / verification field so the form exports, validates and
   round-trips. It exists so Gates 4 and 5 can run at integrator time (Phase 5);
   the Phase-7 test-client replaces it with the complete client that exercises
   every fillable box. Constant identity from PIPELINE.md, cast as the firm the
   test person is a partner in (Sudhir & Associates, a partnership firm). */

/* ---- Part A - General : identity (firm, status 1) ---- */
S.pi={status:"1", substatus:"1-Partnership Firm",
  name:"SUDHIR & ASSOCIATES", pan:"AAJFS7788L", formed:"01/04/2019", res:"RES",
  addr1:"No. 42, 3rd Cross", premises:"Brigade Gardens", road:"Richmond Road",
  locality:"Richmond Town", city:"Bengaluru", state:"15", pin:"560025", country:"91",
  email:"s.sudhir.test@example.in", mobile:"9845012345",
  addr2same:"Y"};

/* ---- Filing status / regime (old regime, non-audit business due date) ---- */
S.fs={optout:"Yes", sec:11, duedate:"2026-10-31", resStatus:"RES",
  rep:"N", partner:"N", unl:"N"};

/* ---- Nature of business (mandatory, rule A11) ---- */
S.nob=[{code:"16003", trade:"Sudhir & Associates", desc:"Tax consultancy"}];

/* ---- Verification (signer = managing partner) ---- */
S.ver={name:"S SUDHIR", father:"RAMAN SUDHIR", pan:"TVOPS4373C",
  capacity:"MP", place:"Bengaluru"};
