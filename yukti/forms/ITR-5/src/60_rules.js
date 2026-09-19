/* ITR-5 · A.Y. 2026-27 — the rule driver.
   runRules(I,S_) returns [{cat:"A"|"D", n, msg}] — one entry per rule whose lawful
   assertion is FALSE (a violation). Every actual CBDT check lives in the
   61_rules_enc_*.js ruleset() batches (Category A blocking, Category B/D advisory),
   which register into _RULEBATCHES (08_registry.js). This driver sets up the A/Dd
   collectors and runs every batch, wrapping each in try/catch so one throwing batch
   never suppresses the others. Mechanism mirrors forms/ITR-3/src/60_rules.js. */
function runRules(I,S_){
  I=I||{};
  const out=[];
  const A =(n,cond,msg)=>{ if(!cond) out.push({cat:"A", n:n, msg:msg}); };   /* Category A — return not allowed to upload */
  const Dd=(n,cond,msg)=>{ if(!cond) out.push({cat:"D", n:n, msg:msg}); };   /* Category B/D — advisory / may be defective u/s 139(9) */
  if(typeof _RULEBATCHES!=="undefined"){
    _RULEBATCHES.forEach(rb=>{ try{ rb(I,S_,A,Dd); }catch(e){ /* a batch that throws is skipped, never aborts the rest */ } });
  }
  return out;
}
/* auditRules(b) — the form's OWN arithmetic audit on the built return (belt-and-braces
   roll-up checks), returning string messages, [] when the return agrees with itself.
   This is NOT the department's validation rules (that is runRules, whose Category-A
   blocks the upload and Category-D is only a warning); the shell calls this separately
   as the "does not agree with itself" gate, so it must never carry Category-D advisories. */
function auditRules(b){
  const out=[];
  const j=(b&&b.ITR&&(b.ITR.ITR5||b.ITR[Object.keys(b.ITR)[0]]))||{};
  const g=(p,d)=>{let o=j;for(const k of p.split(".")){if(o&&k in o)o=o[k];else return d===undefined?0:d;}return o==null?(d===undefined?0:d):o;};
  const R_=(w,l,r,t)=>{if(Math.abs(N(l)-N(r))>(t||1))out.push(w+" (out by "+(N(l)-N(r))+")");};
  /* total income = round10(max(0, GTI − Chapter VI-A − 10AA)) */
  R_("total income is not gross total income less Chapter VI-A and 10AA",g("PartB-TI.TotalIncome"),
    Math.max(0,Math.round((g("PartB-TI.GrossTotalIncome")-g("PartB-TI.DeductionsUndSchVIADtl.TotDeductUndSchVIA")-g("PartB-TI.DeductionsUnder10Aor10AA"))/10)*10),10);
  /* gross tax liability = tax on total income − 87A rebate + surcharge + cess */
  const C="PartB_TTI.ComputationOfTaxLiability.TaxPayableOnTI.";
  R_("gross tax liability does not add up",g(C+"GrossTaxLiability"),
    Math.max(0,g(C+"TaxPayableOnTotInc")-g(C+"Rebate87A"))+g(C+"TotalSurcharge")+g(C+"EducationCess"),2);
  /* taxes paid = advance + TDS + TCS + self-assessment */
  R_("the taxes paid do not add up",g("PartB_TTI.TaxPaid.TaxesPaid.TotalTaxesPaid"),
    g("PartB_TTI.TaxPaid.TaxesPaid.AdvanceTax")+g("PartB_TTI.TaxPaid.TaxesPaid.TDS")
    +g("PartB_TTI.TaxPaid.TaxesPaid.TCS")+g("PartB_TTI.TaxPaid.TaxesPaid.SelfAssessmentTax"));
  return out;
}
