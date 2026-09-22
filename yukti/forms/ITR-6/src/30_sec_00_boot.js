/* Phase 4 bootstrap: placeholder registrations for all 18 screen sections so the
   form always boots with its full structure. Real section-builders call reg()
   later with the same id; 90_wiring resolves each id to the LAST registration,
   so a real section overrides its placeholder. Titles/refs and order from
   books/ITR-6/structure.md (the company return). */
[
 ["who","Who is filing","Part A - General"],
 ["gen","Company particulars","General2 · Nature of business"],
 ["accounts","Audited accounts","BS · Mfg/Trading · P&L · Ind-AS · OI · QD · OL"],
 ["bp","Business and profession","BP · DPM/DOA · DEP/DCG · ESR · ICDS"],
 ["cg","Capital gains","Schedule CG · 112A · 115AD · VDA"],
 ["os","Other sources","Schedule OS"],
 ["hp","House property","Schedule HP"],
 ["loss","Losses — set-off and carry-forward","CYLA · BFLA · CFL · UD"],
 ["ded","Deductions","VIA · 80G/80GGA · 80-IA/IB/IC · 80M · 80IAC · 80LA · 10AA"],
 ["si","Special-rate income","Schedule SI"],
 ["ei","Exempt income","Schedule EI"],
 ["mat","MAT — section 115JB","MAT · MATC"],
 ["fa","Foreign income and assets","FSI · TR · FA"],
 ["al","Assets, liabilities and shareholding","AL-1 · AL-2 · SH-1/SH-2"],
 ["other","Other schedules","PTI · IF · TPSA · 115TD · GST · FD"],
 ["paid","Taxes paid","IT · TDS · TCS"],
 ["tax","Part B — total income and tax","Part B-TI · TTI"],
 ["bank","Verification","Verification"],
].forEach(([id,t,ref])=>reg({id,t,ref,f:()=>note("<b>"+esc(t)+"</b> — being built (Phase 4)."),s:()=>""}));
