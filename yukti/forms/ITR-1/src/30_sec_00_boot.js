/* Bootstrap: placeholder registrations for all 10 screen sections so the form
   always boots with its full structure. Real section-builders call reg() later
   with the same id; 90_wiring resolves each id to the LAST registration, so a
   real section overrides its placeholder. Titles/refs and order from
   books/ITR-1/sections.md + section_map.json (the SAHAJ resident-individual
   return). Every section is present, each a "being built" placeholder body. */
[
 ["who","Who is filing — Personal information","PersonalInfo · CreationInfo · Form_ITR1"],
 ["ret","Filing status & tax regime","FilingStatus (+ PartA_139_8A · PartB-ATI when 139(8A))"],
 ["sal","Salary income","ITR1_IncomeDeductions (salary) · ScheduleEA10_13A"],
 ["hp","Income from house property","ITR1_IncomeDeductions.PropertyDetails[]"],
 ["os","Income from other sources","ITR1_IncomeDeductions.OthersInc · DeductionUs57iia"],
 ["ded","Chapter VI-A deductions","UsrDeductUndChapVIA · DeductUndChapVIA · Schedule80*"],
 ["ei","Exempt income","ITR1_IncomeDeductions.ExemptIncAgriOthUs10"],
 ["tax","Tax computation","ITR1_TaxComputation · LTCG112A"],
 ["paid","Taxes paid — TDS / TCS / advance / self-assessment","TaxPaid · TDSonSalaries · TDSonOthThanSals · ScheduleTDS3Dtls · ScheduleTCS · TaxPayments"],
 ["bank","Bank accounts & verification","Refund · Verification"],
].forEach(([id,t,ref])=>reg({id,t,ref,f:()=>note("<b>"+esc(t)+"</b> — being built."),s:()=>""}));
