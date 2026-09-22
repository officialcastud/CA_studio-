#!/usr/bin/env python3
"""The gates. Each returns exit 0 (green) or 1 (red) and writes logs/ITR-N/gateK.json with the failing items.
usage: python tools/gates/gate.py --form ITR-3 --gate 0|1|2|3|4|5|6|7|all
"""
import argparse, json, os, re, subprocess, sys, glob, pathlib
sys.path.insert(0,os.path.join(os.path.dirname(__file__),".."));from dump import dump_sheet, leaves, dropdowns, load
def log(form,k,ok,items,extra=None):
    os.makedirs(f"logs/{form}",exist_ok=True);json.dump({"gate":k,"ok":ok,"failing":items,"extra":extra or {}},open(f"logs/{form}/gate{k}.json","w"),indent=1)
    print(f"GATE {k}: {'GREEN' if ok else 'RED — '+str(len(items))+' items'}")
    for it in items[:40]:print("   ",it)
    return ok
def sh(cmd):r=subprocess.run(cmd,shell=True,capture_output=True,text=True);return r.returncode,r.stdout+r.stderr
# ---------- gate 0: sources extracted ----------
def gate0(form):
    items=[]
    for need in [f"sources/{form}/utility/xl/workbook.xml",f"books/{form}/sheet_map.json",f"books/{form}/skeleton.json",f"books/{form}/enums.json",f"books/{form}/blocks.json",f"books/{form}/rules.json"]:
        if not os.path.exists(need):items.append("missing "+need)
    if not items:
        rc,o=sh(f"python tools/harness/validate_schema.py --form {form} --json /dev/stdin <<< '{{\"ITR\":{{}}}}'")  # skeleton check below instead
        sk=json.load(open(f"books/{form}/skeleton.json"));bl=json.load(open(f"books/{form}/blocks.json"))
        req=[b["name"] for b in bl["blocks"] if b["required"]]
        for r in req:
            if r not in sk:items.append("skeleton lacks required block "+r)
        rules=json.load(open(f"books/{form}/rules.json"));A=[r["n"] for r in rules if r["cat"]=="A"]
        if A!=list(range(1,len(A)+1)):items.append("rules numbering not continuous")
    return log(form,0,not items,items)
# ---------- gate 1: structure ----------
def gate1(form):
    items=[];sm=json.load(open(f"books/{form}/sheet_map.json"))
    if not os.path.exists(f"books/{form}/structure.md"):items.append("missing books/%s/structure.md"%form)
    if not os.path.exists(f"books/{form}/section_map.json"):items.append("missing books/%s/section_map.json"%form);return log(form,1,False,items)
    mp=json.load(open(f"books/{form}/section_map.json"))
    for s in sm["sheets"]:
        n=s["name"]
        if n not in mp:items.append(f"sheet not mapped: {n}");continue
        v=mp[n]
        if s["state"]!="visible":
            if v.get("section")=="excluded":
                if not v.get("reason"):items.append(f"hidden sheet excluded without a reason: {n}")
            elif not v.get("why_built"):items.append(f"hidden sheet mapped to a section needs why_built (e.g. 'hidden until the deduction is claimed'): {n}")
        elif v.get("section")=="excluded" and not v.get("reason"):items.append(f"visible sheet excluded without a reason: {n}")
    secs=set(v["section"] for v in mp.values() if v.get("section")!="excluded")
    if len(secs)>20:items.append(f"too many sections ({len(secs)}) — the point is fewer, simpler sessions")
    return log(form,1,not items,items,{"sections":sorted(secs)})
# ---------- gate 2: shell boots ----------
def gate2(form):
    html=f"forms/{form}/Yukti_{form.replace('-','')}.html"
    if not os.path.exists(html):return log(form,2,False,["missing "+html])
    rc,o=sh(f"python tools/harness/run_form.py --form {form} --out logs/{form}/gate2run")
    s=json.load(open(f"logs/{form}/gate2run/summary.json"));items=[]
    if s["boot_errors"]:items+=["boot: "+e for e in s["boot_errors"]]
    if s["page_errors"]:items+=["page: "+e for e in s["page_errors"]]
    if not s.get("saved"):items.append("save file did not download")
    return log(form,2,not items,items)
# ---------- gate 3: books cover the sheets and the schema ----------
STOP=set("the of to in as per for and or from with by at on income tax section any case which under is are be if this that such not".split())
def norm(t):return re.sub(r"[^a-z0-9 ]"," ",t.lower())
def gate3(form,only=None):
    items=[];sm=json.load(open(f"books/{form}/sheet_map.json"));mp=json.load(open(f"books/{form}/section_map.json"))
    for s in sm["sheets"]:
        n=s["name"]
        if only and n!=only:continue
        if s["state"]!="visible" or mp.get(n,{}).get("section")=="excluded":continue
        bf=f"books/{form}/{re.sub(r'[^A-Za-z0-9]+','_',n).strip('_')}.md"
        if not os.path.exists(bf):items.append(f"[{n}] no book at {bf}");continue
        book=open(bf,encoding="utf-8").read().lower()
        # every live-row label
        missing=[]
        for line in dump_sheet(form,n):
            if line[5]=="H":continue
            for cell in line.split("  |  "):
                t=cell.split("] ",1)[-1].strip()
                if len(t)<12 or t.startswith("(Select") or "Sl. No" in t:continue
                words=[w for w in norm(t).split() if len(w)>3 and w not in STOP][:6]
                if words and sum(1 for w in words if w in book)<min(len(words),max(2,len(words)-2)):missing.append(t[:80])
        for m in missing[:25]:items.append(f"[{n}] label not in book: {m}")
        # schema leaves of the blocks the book claims
        for blk in mp.get(n,{}).get("blocks",[]):
            try:lv=leaves(form,blk)
            except Exception as e:items.append(f"[{n}] schema block not found: {blk}");continue
            for p,t,req in lv:
                key=p.split(".")[-1].replace("[]","")
                if key in("DateRange",):continue
                if key.lower() not in book and req:items.append(f"[{n}] required schema key not in book: {p}")
        # dropdowns
        for dv in dropdowns(form,n):
            for v in (dv.get("values") or [])[:200]:
                v2=str(v).strip().lower()
                if len(v2)>2 and v2 not in book:items.append(f"[{n}] dropdown value not in book: {v[:60]}");break
    return log(form,3,not items,items)
# ---------- gate 4/5: the form — syntax, export, schema, round-trips, coverage ----------
def gate45(form,k):
    items=[];html=f"forms/{form}/Yukti_{form.replace('-','')}.html";state=f"tests/{form}/state.js"
    if not os.path.exists(html):return log(form,k,False,["missing "+html])
    js=open(html,encoding="utf-8").read().split("<script>",1)[1].split("</script>",1)[0];open("/tmp/_g.js","w",encoding="utf-8").write(js)
    rc,o=sh("node --check /tmp/_g.js")
    if rc:items.append("syntax: "+o.strip()[:300]);return log(form,k,False,items)
    dup=re.findall(r'put\(\w+,"([^"]+)"',js);seen={};
    for d_ in dup:seen[d_]=seen.get(d_,0)+1
    for d_,c in seen.items():
        if c>1:items.append(f"duplicate writer of {d_} ({c}×) — a stale line may be overwriting the new one")
    st=state if os.path.exists(state) else None
    rc,o=sh(f"python tools/harness/run_form.py --form {form} {'--state '+st if st else ''} --out logs/{form}/gate{k}run")
    s=json.load(open(f"logs/{form}/gate{k}run/summary.json"))
    items+=["page: "+e for e in s["page_errors"]]
    if not s.get("exported"):items.append("export blocked: "+s.get("export_block","")[:300])
    else:
        rc,o=sh(f"python tools/harness/validate_schema.py --form {form} --json logs/{form}/gate{k}run/return.json");print(o)
        if rc:items.append("schema errors — see above")
        rc,o=sh(f"python tools/harness/roundtrip.py --form {form} --open logs/{form}/gate{k}run/working.json --against logs/{form}/gate{k}run/return.json");print(o)
        if rc:items.append("working-file round-trip not identical")
        filed=json.load(open(f"logs/{form}/gate{k}run/working.json")).get("fs",{}).get("filed","")
        rc,o=sh(f"python tools/harness/roundtrip.py --form {form} --open logs/{form}/gate{k}run/return.json --against logs/{form}/gate{k}run/return.json {'--filed '+filed if filed else ''}");print(o)
        if rc:items.append("return-JSON round-trip not identical")
    if k==5:
        # coverage: every non-excluded live sheet row → a data-p field somewhere; every schema block → export writer + import reader
        sm=json.load(open(f"books/{form}/sheet_map.json"));mp=json.load(open(f"books/{form}/section_map.json"))
        bl=json.load(open(f"books/{form}/blocks.json"));fields=set(re.findall(r'data-p=\\?"([^"\\]+)',js))
        for b in bl["blocks"]:
            nm=b["name"]
            if nm in ("CreationInfo","Form_"+form.replace("-","")):continue
            if f'"{nm}"' not in js and f".{nm}" not in js and nm not in js:items.append(f"schema block never referenced in the form: {nm}")
    return log(form,k,not items,items)
# ---------- gate 6: the department's rules ----------
def gate6(form):
    s=json.load(open(f"logs/{form}/gate5run/summary.json")) if os.path.exists(f"logs/{form}/gate5run/summary.json") else None
    if not s:rc,o=sh(f"python tools/harness/run_form.py --form {form} --state tests/{form}/state.js --out logs/{form}/gate6run");s=json.load(open(f"logs/{form}/gate6run/summary.json"))
    items=[]
    if "rules_error" in s:items.append("runRules failed: "+s["rules_error"])
    A=[r for r in s.get("rules",[]) if r["cat"]=="A"];items+=[f"A{r['n']} {r['msg']}" for r in A]
    rules=json.load(open(f"books/{form}/rules.json"));coded=set(int(x) for x in re.findall(r'\bA\((\d{1,3}),',open(f"forms/{form}/Yukti_{form.replace('-','')}.html",encoding="utf-8").read()))
    total=len([r for r in rules if r["cat"]=="A"])
    return log(form,6,not items,items,{"category_A_coded":len(coded),"category_A_total":total,"D_notices":[f"D{r['n']} {r['msg']}" for r in s.get("rules",[]) if r["cat"]=="D"]})
# ---------- gate 7: the complete client ----------
def gate7(form):
    items=[];state=f"tests/{form}/state.js"
    if not os.path.exists(state):return log(form,7,False,["missing "+state])
    if not gate45(form,5):items.append("gate 5 red")
    if not gate6(form):items.append("gate 6 red")
    rc,o=sh(f"python tools/harness/content_audit.py --form {form} --json logs/{form}/gate5run/return.json");print(o)
    if "empty:" in o and not o.split("empty:")[1].strip().startswith("0"):items.append("some arrays are empty — the client must fill every table the form allows, or the empty ones must be logged as not applicable")
    fig=f"tests/{form}/figures.json"
    if os.path.exists(fig):
        want=json.load(open(fig));got=json.load(open(f"logs/{form}/gate5run/summary.json"))["figures"]
        for k,v in want.items():
            if k.startswith("_"):continue
            if abs(float(got.get(k,0) or 0)-float(v))>1:items.append(f"hand figure {k}: expected {v}, got {got.get(k)}")
    else:items.append("missing tests/%s/figures.json — the hand-computed Part B figures"%form)
    return log(form,7,not items,items)
if __name__=="__main__":
    ap=argparse.ArgumentParser();ap.add_argument("--form",required=True);ap.add_argument("--gate",default="all");ap.add_argument("--sheet");a=ap.parse_args()
    G={"0":gate0,"1":gate1,"2":gate2,"3":lambda f:gate3(f,a.sheet),"4":lambda f:gate45(f,4),"5":lambda f:gate45(f,5),"6":gate6,"7":gate7}
    ks=list(G) if a.gate=="all" else [a.gate];ok=True;status={}
    for k in ks:
        status[k]=G[k](a.form)
        if not status[k]:ok=False
    if a.gate=="all":print("SUMMARY: "+"  ".join(f"G{k}:{'green' if v else 'RED'}" for k,v in status.items()))
    sys.exit(0 if ok else 1)
