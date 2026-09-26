/* Phase 4 bootstrap: placeholder registrations for all 8 screen sections so the
   form always boots with its full structure. Real section-builders call reg()
   later with the same id; 90_wiring resolves each id to the LAST registration,
   so a real section overrides its placeholder. Ids/titles/refs from
   books/ITR-4/structure.md. */
[
 ["who","Who is filing","Part A - General"],
 ["ret","Return and regime","Filing status"],
 ["inc","Income","Part B - GTI · BP · 44AD/44ADA/44AE"],
 ["hp","House property","Schedule HP"],
 ["ded","Deductions","Part C - Chapter VI-A"],
 ["tax","Part B — tax computation","Part D - Tax computations"],
 ["paid","Taxes paid","TDS · TCS · IT"],
 ["bank","Bank and verification","Taxes Paid and Verification"],
].forEach(([id,t,ref])=>reg({id,t,ref,f:()=>note("<b>"+esc(t)+"</b> — being built (Phase 4)."),s:()=>""}));
