#!/usr/bin/env python3
"""Load a form in Chromium, inject a state, paint, export the return and the working file, run the rules.
usage: python tools/harness/run_form.py --form ITR-3 [--state tests/ITR-3/state.js] [--out logs/ITR-3/run]
prints a JSON summary; writes <out>/return.json, <out>/working.json, <out>/summary.json, <out>/screen.png
"""
import argparse, json, os, pathlib, sys
from playwright.sync_api import sync_playwright
def main():
    ap=argparse.ArgumentParser();ap.add_argument("--form",required=True);ap.add_argument("--state");ap.add_argument("--out");ap.add_argument("--html");a=ap.parse_args()
    html=a.html or f"forms/{a.form}/Yukti_{a.form.replace('-','')}.html";out=a.out or f"logs/{a.form}/run";os.makedirs(out,exist_ok=True)
    state=open(a.state,encoding="utf-8").read() if a.state else ""
    f="file://"+str(pathlib.Path(html).resolve());summary={"form":a.form,"html":html}
    with sync_playwright() as p:
        b=p.chromium.launch();pg=b.new_page(viewport={"width":1500,"height":1100});al=[];er=[]
        pg.on("dialog",lambda d:(al.append(d.message),d.accept()));pg.on("pageerror",lambda e:er.append(str(e)));pg.on("console",lambda m:er.append("console: "+m.text) if m.type=="error" else None)
        pg.goto(f);pg.wait_for_timeout(800);summary["boot_errors"]=list(er)
        if state:pg.evaluate("()=>{"+state+"\nif(typeof paint==='function')paint();}");pg.wait_for_timeout(1800)
        summary["checks_err"]=pg.evaluate("()=>(S.C.checks||[]).filter(c=>c.lvl==='err').map(c=>c.t+' — '+c.m)")
        summary["figures"]=pg.evaluate("()=>({gti:S.C.gti,ti:S.C.ti,tax:(S.C.tax||{}).gross,net:(S.C.int||{}).net,balance:(S.C.int||{}).balance,refund:(S.C.int||{}).refund})")
        try:summary["rules"]=pg.evaluate("()=>{const b=buildReturn();return runRules(Object.values(b.ITR)[0],S);}")
        except Exception as e:summary["rules_error"]=str(e)[:300]
        try:
            with pg.expect_download(timeout=10000) as d:pg.click("#b_json")
            d.value.save_as(f"{out}/return.json");summary["exported"]=True
        except Exception:summary["exported"]=False;summary["export_block"]=al[-1][:600] if al else "(no dialog)"
        try:
            with pg.expect_download(timeout=10000) as d2:pg.click("#b_save")
            d2.value.save_as(f"{out}/working.json");summary["saved"]=True
        except Exception:summary["saved"]=False
        summary["page_errors"]=list(er);summary["alerts"]=[x[:200] for x in al]
        pg.screenshot(path=f"{out}/screen.png",full_page=False);b.close()
    json.dump(summary,open(f"{out}/summary.json","w"),indent=1);print(json.dumps({k:v for k,v in summary.items() if k not in("rules",)},indent=1)[:3000])
    if "rules" in summary:
        A=[r for r in summary["rules"] if r["cat"]=="A"];print(f"rules: {len(A)} Category A, {len(summary['rules'])-len(A)} Category D")
if __name__=="__main__":main()
