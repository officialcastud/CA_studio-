#!/usr/bin/env python3
"""Lens 2 — rule-firing probe. Load ITR-6, build the lawful return, then for each
target serial apply ONE targeted mutation to a clone of the built return and run
runRules on it. Confirms (a) baseline is silent, (b) the target serial fires on its
violation. Prints JSON. Read-only (mutates only an in-memory clone in the page)."""
import json, pathlib
from playwright.sync_api import sync_playwright

HTML = "forms/ITR-6/Yukti_ITR6.html"
STATE = "tests/ITR-6/state.js"

# (target serial, path, op, value)  op: "add" | "set"
MUT = [
 (1,  "PartA_GEN1.OrgFirmInfo.Address.MobileNo", "set", "123"),
 (43, "PARTA_BSFor6FrmAY13.TotalAssets", "add", 1000),
 (137,"PARTA_PL.NoBooksOfAccPL.NetProfit", "set", 100),
 (196,"CorpScheduleBP.BusinessIncOthThanSpec.DepreciationAllowITAct32.DepreciationAllowUs32_1_ii","add",1000),
 (256,"CorpScheduleBP.BusinessIncOthThanSpec.IncRecCredPLOthHeadDtls.OtherSources","add",1000),
 (307,"ScheduleDEP.PlantMachinerySummary.DeprBlockTot15Percent","add",1000),
 (411,"ScheduleCG.IncChargeableHeadCapGain","add",1000),
 (458,"ScheduleVDA.ScheduleVDADtls.0.IncomeFromVDA","add",1000),
 (464,"ScheduleOS.IncOthThanOwnRaceHorse.Deductions.TotDeductions","add",1000),
 (489,"ScheduleOS.IncOthThanOwnRaceHorse.DividendGross","add",1000),
 (502,"ScheduleCYLA.TotalLossSetOff.TotHPlossCurYrSetoff","set",300000),
 (183,"ScheduleHP.PropertyDetails.0.Rentdetails.TotalUnrealizedAndTax","add",1000),
 (620,"ScheduleSI.TotSplRateInc","add",1000),
 (647,"ScheduleEI.TotalExemptInc","add",1000),
 (667,"ScheduleMAT.BookProfUs115JB","add",1000),
 (677,"ScheduleMATC.TaxUs115JBCurrAssYr","add",1000),
 (718,"PartB-TI.CapGain.LongTerm.TotalLongTerm","add",1000),
 (719,"PartB-TI.CapGain.ShortTermLongTermTotal","add",1000),
 (734,"PartB-TI.GrossTotalIncome","add",1000),
 (757,"PartB_TTI.ComputationOfTaxLiability.TaxPayableOnTI.TaxPayableOnTotInc","add",1000),
 (761,"PartB_TTI.ComputationOfTaxLiability.TaxRelief.TotTaxRelief","add",1000),
 (764,"PartB_TTI.TaxPaid.TaxesPaid.TotalTaxesPaid","add",1000),
 (785,"ScheduleIT.TotalTaxPayments","add",1000),
 (788,"ScheduleTDS2.TotalTDSonOthThanSals","add",1000),
 (808,"Schedule80G.TotalEligibleDonationsUs80G","set",99999999),
 (828,"ScheduleVIA.UsrDeductUndChapVIA.Section80IA","set",99999999),
 (834,"ScheduleVIA.DeductUndChapVIA.TotalChapVIADeductions","add",1000),
 (851,"ScheduleVIA.DeductUndChapVIA.Section80G","set",99999999),
 (868,"Verification.Declaration.AssesseeVerPAN","set","ZZZZZ9999Z"),
]

JS = r"""
(spec)=>{
  const b=buildReturn(); const I=Object.values(b.ITR)[0];
  const base=runRules(I,S).map(r=>r.cat+r.n);
  function setP(o,path,op,val){
    const ks=path.split('.'); let cur=o;
    for(let i=0;i<ks.length-1;i++){ let k=ks[i];
      if(cur==null) return "MISS@"+k;
      cur = Array.isArray(cur)? cur[parseInt(k)] : cur[k];
      if(cur==null) return "MISS@"+k;
    }
    const last=ks[ks.length-1];
    const container=cur; const idx=Array.isArray(container)?parseInt(last):last;
    const had = container!=null && (idx in container);
    const prev = container? container[idx] : undefined;
    if(op==='add') container[idx]=(Number(prev)||0)+val; else container[idx]=val;
    return {had:had, prev:prev===undefined?null:prev, now:container[idx]};
  }
  const out=[];
  for(const m of spec){
    const [n,path,op,val]=m;
    const I2=JSON.parse(JSON.stringify(I));
    const info=setP(I2,path,op,val);
    const fired=runRules(I2,S).map(r=>r.cat+r.n);
    const newf=fired.filter(x=>base.indexOf(x)<0);
    out.push({n:n, path:path, info:info,
      target_fires: fired.indexOf('A'+n)>=0,
      new_fired:newf});
  }
  return {baseline:base, results:out};
}
"""

def main():
    state = open(STATE, encoding="utf-8").read()
    f = "file://" + str(pathlib.Path(HTML).resolve())
    with sync_playwright() as p:
        b = p.chromium.launch(); pg = b.new_page(viewport={"width":1400,"height":1000})
        errs=[]; pg.on("pageerror", lambda e: errs.append(str(e)))
        pg.goto(f); pg.wait_for_timeout(700)
        pg.evaluate("()=>{"+state+"\nif(typeof paint==='function')paint();}")
        pg.wait_for_timeout(1500)
        res = pg.evaluate(JS, MUT)
        b.close()
    res["page_errors"]=errs
    print(json.dumps(res, indent=1))

if __name__=="__main__":
    main()
