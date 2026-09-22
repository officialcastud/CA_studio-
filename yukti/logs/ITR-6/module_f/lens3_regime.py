#!/usr/bin/env python3
"""Lens 3 — regime / entity / cap matrix. Layer a regime delta onto the lawful
golden state, paint, and read the tax engine's computed rate/surcharge/cess/MAT/
deduction internals + fired Category-A rules. Plus direct probes of the rate
ladder (taxRateInfo), marginal relief (taxCoSurcharge/taxMatSurcharge) and §288B
rounding. Read-only."""
import json, pathlib
from playwright.sync_api import sync_playwright

HTML="forms/ITR-6/Yukti_ITR6.html"; STATE="tests/ITR-6/state.js"

# regime deltas: (label, extra-JS appended after the state, before paint)
VARIANTS=[
 ("normal_NA",     "S.fs.s115='NA';"),
 ("115BA",         "S.fs.s115='115BA';S.fs.s115AY='2020-21';S.fs.s115Ack='123456789012345';S.fs.s115Date='15/09/2020';"),
 ("115BAA",        "S.fs.s115='115BAA';S.fs.s115AY='2020-21';S.fs.s115Ack='123456789012345';S.fs.s115Date='15/09/2020';"),
 ("115BAB",        "S.fs.s115='115BAB';S.fs.s115AY='2020-21';S.fs.s115Ack='123456789012345';S.fs.s115Date='15/09/2020';S.C.bp=S.C.bp||{};"),
 # concessional with incentives stripped -> the concession should STAND (clean 22% / 15%)
 ("115BAA_clean",  "S.fs.s115='115BAA';S.ded.g80=[];S.ded.ggb=[];S.ded.ia=[];S.ded.ib=[];S.ded.ie=[];S.ded.iac={};S.ded.jjaa={};S.ded.m80=[];S.ded10AA=(S.ded10AA||{});S.d10aa=[];"),
]

READ=r"""
()=>{
  const T=S.C.tax||{}, D=S.C.ded||{}, M=S.C.mat||{}, MC=S.C.matc||{};
  const b=buildReturn(); const I=Object.values(b.ITR)[0];
  const rules=runRules(I,S);
  const A=rules.filter(r=>r.cat==='A').map(r=>'A'+r.n+' '+r.msg.slice(0,60));
  return {
    regime:T.regime, ri:T.ri, matBlocked:T.matBlocked, matHigher:T.matHigher,
    surRate:T.surRate, surI:T.surI, surII:T.surII, sur:T.sur, cess:T.cess, mr:T.mr,
    gross:T.gross, grossPayable:T.grossPayable, deemedTI:T.deemedTI,
    mat1d:(M.tax1d!=null?M.tax1d:null), matDeemed:(M.deemedTI!=null?M.deemedTI:(M.total9!=null?M.total9:null)),
    matcTotBF:(MC.totBF!=null?MC.totBF:null),
    credit:(T.credit!=null?T.credit:(T.matCredit!=null?T.matCredit:null)),
    relief:T.relief, net:T.net, balance:T.balance, refund:T.refund,
    ded_partB:D.partB, ded_partC:D.partC, ded_allowed:D.allowed, ded_why:D.why,
    ti:S.C.ti, gti:S.C.gti,
    taxKeys:Object.keys(T),
    A_rules:A
  };
}
"""

PROBE=r"""
()=>{
  // direct rate-ladder probe (bypasses incentive gate for the non-115BAA cases)
  const ladder={};
  const dl=[['foreign',{domestic:false,sec:'',per25small:false}],
            ['dom_30_gt400',{domestic:true,sec:'',per25small:false}],
            ['dom_25_le400',{domestic:true,sec:'',per25small:true}],
            ['115BA',{domestic:true,sec:'115BA',per25small:true}],
            ['115BAB',{domestic:true,sec:'115BAB',per25small:false}]];
  dl.forEach(([k,dr])=>{const ri=taxRateInfo(dr);ladder[k]={rate:ri.rate,kind:ri.kind,label:ri.label};});
  // corp tax split for 115BAB: mfg 15% + balance 22%
  const bab=taxCorpTax(10000000, {kind:'115BAB',rate:0.22}, 4000000); // 40L mfg@15 + 60L@22 = 6L+13.2L=19.2L
  // marginal relief probe on the normal ladder
  const dr={domestic:true};
  const tif=function(x){return taxCorpTax(x,{kind:'domestic',rate:0.30},0);}; // pure 30% for a clean threshold demo
  function mr(ti){const tax=taxCorpTax(ti,{kind:'domestic',rate:0.30},0);
    const s=taxCoSurcharge(ti,tax,0,dr,tif);return {ti:ti,tax:tax,surRate:s.rate,surII:s.surII,mr:s.mr};}
  const mrProbe=[mr(10000000),mr(10000100),mr(10500000),mr(100000000),mr(100010000),mr(110000000)];
  // MAT surcharge marginal relief
  function mmr(dti){const t=taxMatSurcharge(dti, R(dti*0.15), {domestic:true});return {dti:dti,rate:t.rate,sur:t.sur,mr:t.mr};}
  const matMr=[mmr(10000000),mmr(10050000),mmr(100000000),mmr(100050000)];
  return {ladder:ladder, bab_10Lmfg4L:bab, mrProbe:mrProbe, matMr:matMr};
}
"""

def run(pg, extra):
    state=open(STATE,encoding="utf-8").read()
    pg.evaluate("()=>{location.reload();}"); pg.wait_for_timeout(400)
    pg.evaluate("()=>{"+state+"\n"+extra+"\nif(typeof paint==='function')paint();}")
    pg.wait_for_timeout(1600)
    return pg.evaluate(READ)

def main():
    f="file://"+str(pathlib.Path(HTML).resolve())
    out={"variants":{}}
    with sync_playwright() as p:
        b=p.chromium.launch(); pg=b.new_page(viewport={"width":1400,"height":1000})
        errs=[]; pg.on("pageerror",lambda e:errs.append(str(e)))
        pg.goto(f); pg.wait_for_timeout(700)
        out["probe"]=pg.evaluate(PROBE)
        for name,extra in VARIANTS:
            try: out["variants"][name]=run(pg,extra)
            except Exception as e: out["variants"][name]={"ERROR":str(e)[:300]}
        b.close()
    out["page_errors"]=errs
    print(json.dumps(out,indent=1,ensure_ascii=False))

if __name__=="__main__": main()
