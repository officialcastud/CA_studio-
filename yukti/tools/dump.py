#!/usr/bin/env python3
"""Read a utility sheet row by row (H = hidden row), with dropdowns and formulas; walk the schema.
usage: python tools/dump.py --form ITR-3 --sheet "Schedule S" [--formulas] [--maxcol 24]
       python tools/dump.py --form ITR-3 --schema ScheduleS [--depth 3]
       python tools/dump.py --form ITR-3 --dropdowns "Schedule S"
"""
import argparse, json, re, glob, os, sys
import xml.etree.ElementTree as ET
NS="{http://schemas.openxmlformats.org/spreadsheetml/2006/main}"
def cn(r):
    m=re.match(r"([A-Z]+)",r);n=0
    for ch in m.group(1):n=n*26+ord(ch)-64
    return n
def load(form):
    base=f"sources/{form}/utility";sst=[]
    for si in ET.parse(f"{base}/xl/sharedStrings.xml").getroot():sst.append("".join(t.text or "" for t in si.iter(f"{NS}t")))
    smap=json.load(open(f"books/{form}/sheet_map.json"));return base,sst,smap
def sheet_file(smap,name):
    for s in smap["sheets"]:
        if s["name"].strip().lower()==name.strip().lower():return s["file"]
    sys.exit(f"sheet not found: {name}. Have: "+", ".join(s["name"] for s in smap["sheets"]))
def dump_sheet(form,name,formulas=False,maxcol=24,maxrow=100000,width=100):
    base,sst,smap=load(form);fn=sheet_file(smap,name)
    ws=ET.parse(f"{base}/xl/worksheets/{fn}").getroot();out=[]
    for row in ws.find(f"{NS}sheetData"):
        rn=int(row.get("r"))
        if rn>maxrow:break
        hid=row.get("hidden")=="1";cs=[]
        for c in sorted(row,key=lambda c:cn(c.get("r"))):
            if cn(c.get("r"))>maxcol:continue
            v=c.find(f"{NS}v");f=c.find(f"{NS}f")
            if c.get("t")=="s" and v is not None:
                t=re.sub(r"\s+"," ",sst[int(v.text)].strip())
                if t:cs.append(f"[{c.get('r')}] {t[:width]}")
            elif formulas and f is not None and f.text:cs.append(f"[{c.get('r')}]= {re.sub(chr(92)+'s+',' ',f.text)[:width]}")
        if cs:out.append(f"r{rn:>4}{'H' if hid else ' '}: "+"  |  ".join(cs))
    return out
def dropdowns(form,name):
    base,sst,smap=load(form);fn=sheet_file(smap,name);raw=open(f"{base}/xl/worksheets/{fn}",encoding="utf-8").read()
    dvs=re.findall(r'<(?:x14:)?dataValidation[^>]*sqref="([^"]+)"[^>]*>.*?<(?:x14:)?formula1>(?:<xm:f>)?(.*?)(?:</xm:f>)?</(?:x14:)?formula1>',raw,re.S)
    out=[]
    for sq,f in dvs:
        vals=None;m=re.match(r'^"(.*)"$',f.strip())
        if m:vals=m.group(1).split(",")
        elif f.strip() in smap["named_ranges"]:vals=named_list(form,smap["named_ranges"][f.strip()],base,sst,smap)
        out.append({"cells":sq,"source":f,"values":vals})
    return out
def named_list(form,ref,base,sst,smap):
    ref=ref.replace("$","")
    if "!" not in ref:return None
    sh,rng=ref.rsplit("!",1);sh=sh.strip("'")
    fn=None
    for s in smap["sheets"]:
        if s["name"].strip("'")==sh:fn=s["file"]
    if not fn:return None
    a,b=rng.split(":") if ":" in rng else (rng,rng)
    r1,r2=int(re.search(r"\d+",a).group()),int(re.search(r"\d+",b).group());col=cn(a)
    ws=ET.parse(f"{base}/xl/worksheets/{fn}").getroot();vals=[]
    for row in ws.find(f"{NS}sheetData"):
        rn=int(row.get("r"))
        if rn<r1 or rn>r2:continue
        for c in row:
            if cn(c.get("r"))==col:
                v=c.find(f"{NS}v")
                if c.get("t")=="s" and v is not None:vals.append(sst[int(v.text)].strip())
    return vals
# ---- schema ----
def schema(form):
    fs=glob.glob(f"sources/{form}/*.json");fs=[f for f in fs if "schema" in f.lower() or "Main" in f]
    if not fs:sys.exit("no schema json in sources/"+form)
    return json.load(open(fs[0]))
def res(D,n,seen=()):
    if isinstance(n,str):return {}
    o={}
    if "$ref" in n:
        nm=n["$ref"].split("/")[-1]
        if nm in seen or nm not in D:return {}
        o.update(res(D,D[nm],seen+(nm,)))
    for sub in n.get("allOf",[]):o.update(res(D,sub,seen))
    for k,v in n.items():
        if k in("$ref","allOf"):continue
        o[k]=v
    return o
def tree(form,defname,maxd=3):
    S=schema(form);D=S["definitions"];lines=[]
    def w(node,pre,depth):
        n=res(D,node)
        for k,v in n.get("properties",{}).items():
            r=res(D,v);t=r.get("type","");req="*" if k in(n.get("required")or[])else " ";e=""
            if "enum" in r:e="  enum["+str(len(r["enum"]))+"]: "+", ".join(map(str,r["enum"][:12]))+("…" if len(r["enum"])>12 else "")
            d=re.sub(r"\s+"," ",r.get("description",""))[:120]
            if d and "enum" not in r:e="  — "+d
            for kk in("maxItems","maxLength","maximum","minimum"):
                if kk in r:e+=f"  ({kk} {r[kk]})"
            lines.append(f"{pre}{req}{k} [{t}]{e}")
            if depth<maxd:
                if "properties" in r:w(v,pre+"    ",depth+1)
                elif t=="array" and "items" in r:lines.append(f"{pre}    (each:)");w(r["items"],pre+"      ",depth+1)
    root=res(D,{"$ref":"#/definitions/"+defname});lines.append(f"== {defname} == required: {root.get('required')}")
    w({"$ref":"#/definitions/"+defname},"",0);return lines
def leaves(form,defname):
    """every leaf path under a definition, with required flag — for the coverage gate"""
    S=schema(form);D=S["definitions"];out=[]
    def w(node,path,depth=0):
        n=res(D,node)
        for k,v in n.get("properties",{}).items():
            r=res(D,v);t=r.get("type","");p=path+"."+k if path else k;req=k in(n.get("required")or[])
            if "properties" in r:w(v,p,depth+1)
            elif t=="array":
                out.append((p+"[]",t,req));it=r.get("items",{})
                if it:w(it,p+"[]",depth+1)
            else:out.append((p,t,req))
    w({"$ref":"#/definitions/"+defname},"");return out
if __name__=="__main__":
    ap=argparse.ArgumentParser();ap.add_argument("--form",required=True);ap.add_argument("--sheet");ap.add_argument("--formulas",action="store_true");ap.add_argument("--maxcol",type=int,default=24)
    ap.add_argument("--schema");ap.add_argument("--depth",type=int,default=3);ap.add_argument("--dropdowns");ap.add_argument("--leaves");a=ap.parse_args()
    if a.sheet:print("\n".join(dump_sheet(a.form,a.sheet,a.formulas,a.maxcol)))
    if a.dropdowns:print(json.dumps(dropdowns(a.form,a.dropdowns),indent=1,ensure_ascii=False))
    if a.schema:print("\n".join(tree(a.form,a.schema,a.depth)))
    if a.leaves:
        for p,t,r in leaves(a.form,a.leaves):print(("*" if r else " "),p,t)
