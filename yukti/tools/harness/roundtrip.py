#!/usr/bin/env python3
"""Open a file in the form (working file or return JSON), re-export, and diff against the original export.
usage: python tools/harness/roundtrip.py --form ITR-3 --open logs/ITR-3/run/working.json --against logs/ITR-3/run/return.json [--filed 25/07/2026]
"""
import argparse, json, pathlib, sys
from playwright.sync_api import sync_playwright
def diff(a,b,path="",out=None):
    out=out if out is not None else []
    if isinstance(a,dict) and isinstance(b,dict):
        for k in set(a)|set(b):
            if k not in a:out.append(("+",path+"/"+k));continue
            if k not in b:out.append(("-",path+"/"+k));continue
            diff(a[k],b[k],path+"/"+k,out)
    elif isinstance(a,list) and isinstance(b,list):
        if len(a)!=len(b):out.append(("len",path))
        for i,(x,y) in enumerate(zip(a,b)):diff(x,y,path+f"[{i}]",out)
    elif a!=b:out.append(("≠",path,str(a)[:40],str(b)[:40]))
    return out
ap=argparse.ArgumentParser();ap.add_argument("--form",required=True);ap.add_argument("--open",required=True);ap.add_argument("--against",required=True);ap.add_argument("--filed");ap.add_argument("--html");a=ap.parse_args()
html=a.html or f"forms/{a.form}/Yukti_{a.form.replace('-','')}.html";f="file://"+str(pathlib.Path(html).resolve())
with sync_playwright() as p:
    b=p.chromium.launch();pg=b.new_page();er=[];al=[]
    pg.on("pageerror",lambda e:er.append(str(e)));pg.on("dialog",lambda d:(al.append(d.message),d.accept()))
    pg.goto(f);pg.wait_for_timeout(600);pg.set_input_files("#filepick",a.open);pg.wait_for_timeout(2000)
    if a.filed:pg.evaluate("(d)=>{S.fs.filed=d;paint();}",a.filed);pg.wait_for_timeout(1200)
    try:
        with pg.expect_download(timeout=10000) as d:pg.click("#b_json")
        d.value.save_as("/tmp/rt_export.json")
    except Exception:print("re-export blocked:",al[-1][:400] if al else "(no dialog)");sys.exit(1)
    b.close()
x=json.load(open(a.against));y=json.load(open("/tmp/rt_export.json"))
for z in(x,y):
    r=list(z["ITR"].values())[0];r.get("CreationInfo",{}).pop("JSONCreationDate",None)
d=diff(x,y);print(f"round-trip differences: {len(d)}")
for t in d[:30]:print("  ",t)
print("page errors:",er or "none");sys.exit(1 if d or er else 0)
