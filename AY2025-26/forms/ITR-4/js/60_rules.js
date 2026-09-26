/* ITR-4 validation rules. runRules(I,S_) returns [{cat:"A"|"D",n,msg}] — a rule
   FIRES (is pushed) when its assertion is false. Checkable Category-A rules live
   in 61_rules_g*.js / 61_rules_fix_*.js ruleset() batches; this runner aggregates
   them. Helpers RG/RSUM/REQ/N/R/isNew come from the shell. */

/* AY 2025-26 port · 4a DISABLE — the Category-A rules that exist only in the
   AY 2026-27 ruleset (no AY 2025-26 counterpart), keyed by their AY 2026-27
   coded number. They target fields removed in AY 2025-26 (the nested
   PropertyDetails co-owner/tenant/24B model, TotalIncomeChargeableUnHP,
   representative-assessee contact leaves, secondary/alternate address, the
   80CCC identifier rows / PRAN rows, the 80G donee IFSC/txn-ref and 80GGC
   party leaves, the Form-10IEA current/earlier-AY leaves, the exempt-income
   Category/SubCategory/Description triple) and the assorted 2026-27-only
   cross-checks. Disabling them here keeps their bodies intact for audit while
   removing them from the live run, so a removed-field rule cannot false-fire and
   block export. Source: itr_tools reports …_chunks/08_4a_DISABLE.md (all A-<n>).
   A later rule-deviation pass (the parent's job) reconciles any that in fact have
   an AY 2025-26 counterpart on surviving fields. */
const RULES_DISABLED_2025 = new Set([
  3,22,33,37,41,45,49,60,63,64,67,72,79,82,90,97,103,108,126,133,140,144,149,154,
  161,170,174,176,184,196,200,223,227,228,237,258,262,268,271,287,303,308,313,322,
  323,324,325,326,327,328,329,330,331,332,333,334,335,336,337,338,339,340,341,342,
  343,344,345,346,347,348,349,350,351,352,353,354,355,356,357,358,359,360,361,362,
  363,364,365,366,367,368,369,370,371,372,373,374,375,376,377,378,379,380,381,382,
  383,384,385,386,387,388,389,390,391,392,393,394,395,396,397,398,399,403,404,405,
  406,407,408,409,410,411]);

function runRules(I,S_){
  I=I||{};
  const out=[];
  const fire=(cat,n,cond,msg)=>{
    if(cat==="A" && RULES_DISABLED_2025.has(n)) return;   /* 4a: no AY 2025-26 counterpart */
    let c;
    try{ c=(typeof cond==="function")?cond():cond; }
    catch(e){ out.push({cat:"D", n:n, msg:"[rule "+n+" skipped — "+((e&&e.message)||e)+"]"}); return; }  /* a throwing rule is skipped & recorded, never aborts its siblings */
    if(!c) out.push({cat:cat, n:n, msg:msg});
  };
  const A =(n,cond,msg)=>fire("A",n,cond,msg);   /* Category A — return not allowed to upload */
  const Dd=(n,cond,msg)=>fire("D",n,cond,msg);   /* Category D — advisory / may be defective u/s 139(9) */
  if(typeof _RULEBATCHES!=="undefined"){
    _RULEBATCHES.forEach(rb=>{ try{ rb(I,S_,A,Dd); }catch(e){ /* backstop: a fault in a batch's shared setup skips the rest of THAT batch only */ } });
  }
  return out;
}
function auditRules(b){return [];}
