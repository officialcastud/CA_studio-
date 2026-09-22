#!/usr/bin/env python3
"""Drive Yukti_ITR5.html with a base state + per-case patch JS; dump a deep S.C probe."""
import json,pathlib,sys
from playwright.sync_api import sync_playwright

ROOT=pathlib.Path("/home/user/ca-itr5/yukti")
HTML="file://"+str((ROOT/"forms/ITR-5/Yukti_ITR5.html").resolve())
BASE=(ROOT/"tests/ITR-5/state.js").read_text(encoding="utf-8")

PROBE = """()=>{
 const pick=(o,ks)=>{const r={};if(!o)return r;ks.forEach(k=>{if(o[k]!==undefined)r[k]=o[k];});return r;};
 let rules=[];try{const b=buildReturn();rules=runRules(Object.values(b.ITR)[0],S).map(r=>({cat:r.cat,id:r.id||r.serial||r.code||'',m:(r.m||r.msg||r.text||'').slice(0,240)}));}catch(e){rules=[{cat:'ERR',id:'',m:String(e).slice(0,300)}];}
 return {
  gti:S.C.gti, ti:S.C.ti,
  tax:S.C.tax, int:S.C.int, amtOut:S.C.amtOut,
  ded:S.C.ded, si:S.C.si, loss:S.C.loss, cg:S.C.cg, hp:S.C.hp, os:S.C.os, bp:S.C.bp, paid:S.C.paid, ei:S.C.ei, fa:S.C.fa, amt:S.C.amt,
  checks:(S.C.checks||[]).map(c=>({lvl:c.lvl,t:c.t,m:(c.m||'').slice(0,200)})),
  rulesA:rules.filter(r=>r.cat==='A'), rulesOther:rules.filter(r=>r.cat!=='A').map(r=>r.cat+':'+r.id+' '+r.m)
 };}"""

def run(cases):
    out={}
    with sync_playwright() as p:
        b=p.chromium.launch()
        for name,patch in cases:
            pg=b.new_page(viewport={"width":1400,"height":900})
            errs=[]
            pg.on("pageerror",lambda e:errs.append(str(e)[:300]))
            pg.on("console",lambda m:errs.append("console:"+m.text[:200]) if m.type=="error" else None)
            pg.on("dialog",lambda d:d.accept())
            pg.goto(HTML); pg.wait_for_timeout(500)
            pg.evaluate("()=>{"+BASE+"\n"+patch+"\nif(typeof paint==='function')paint();}")
            pg.wait_for_timeout(900)
            try:
                res=pg.evaluate(PROBE)
            except Exception as e:
                res={"probe_error":str(e)[:500]}
            res["page_errors"]=errs[:10]
            out[name]=res
            pg.close()
        b.close()
    return out

if __name__=="__main__":
    spec=json.load(open(sys.argv[1]))
    cases=[(k,v) for k,v in spec.items()]
    res=run(cases)
    json.dump(res,open(sys.argv[2],"w"),indent=1,default=str)
    print("wrote",sys.argv[2])
