/* Phase 2 bootstrap: placeholder registrations for all 12 screen sections so
   the form always boots with its full structure. Real section-builders call
   reg() later with the same id; 90_wiring resolves each id to the LAST
   registration, so a real section overrides its placeholder. Titles/refs and
   order from books/ITR-7/structure.md + section_map.json (the trust/institution
   return). `ret` (return & exemption status) is a VIEW of the who/PI sheet,
   not a separate section_map mapping, so it is not a boot stub of its own. */
[
 ["who","Who is filing","Part A - General · PI · Audit"],
 ["vc","Voluntary contributions & income","Schedule VC · AI"],
 ["ie","Income & Expenditure statements","Schedule IE-1/2/3/4"],
 ["hp","Income from house property","Schedule HP"],
 ["cg","Capital gains","Schedule CG"],
 ["vda","Virtual digital assets","Schedule VDA"],
 ["os","Income from other sources","Schedule OS"],
 ["oa","Business — general","Schedule OA"],
 ["bp","Business income","Schedule BP"],
 ["pti","Pass-through income","Schedule PTI"],
 ["cyla","Current-year loss set-off","Schedule CYLA"],
 ["app","Application & accumulation of income","Schedule A · I · IA · D · DA"],
 ["funds","Balance sheet, funds & corpus","Part A-BS · Schedule J · R"],
 ["bodies","Political party, electoral trust & shareholding","Schedule PP · ET · SH"],
 ["si","Special-rate, specified & accreted income","Schedule SI · 115BBI · 115TD"],
 ["fa","Foreign income & assets","Schedule FSI · TR · FA"],
 ["tax","Part B — total income & tax","Part B-TI · TTI"],
 ["paid","Tax payments","IT · TDS · TCS"],
 ["bank","Bank & verification","Verification"],
].forEach(([id,t,ref])=>reg({id,t,ref,f:()=>note("<b>"+esc(t)+"</b> — being built (Phase 4)."),s:()=>""}));
