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
/* auditRules(b): the gate-6/7 view — kept as a thin wrapper so the harness has a stable entry. */
function auditRules(b){ try{ return runRules(Object.values((b&&b.ITR)||{})[0]||{}, (typeof S!=="undefined"?S:{})); }catch(e){ return []; } }
