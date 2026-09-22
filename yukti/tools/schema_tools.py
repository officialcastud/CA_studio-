#!/usr/bin/env python3
"""Phase 0 — the required-key skeleton and every enum, from the form's schema.
usage: python tools/schema_tools.py --form ITR-3
writes books/ITR-3/skeleton.json (the SKEL object), books/ITR-3/enums.json, books/ITR-3/blocks.json
"""
import argparse, json, re, sys, os
sys.path.insert(0,os.path.dirname(__file__));from dump import schema,res
def skeleton(D,node,seen=()):
    n=res(D,node);t=n.get("type")
    if "properties" in n:
        o={}
        for k in (n.get("required")or[]):
            if k in n["properties"]:o[k]=skeleton(D,n["properties"][k],seen)
        return o
    if t=="array":return []
    if "enum" in n:return n["enum"][0]
    if t=="string":
        d=n.get("description","")
        if "YYYY-MM-DD" in d or "date" in d.lower():return "2026-01-01"
        return "na@na.in" if "mail" in d.lower() else ("AAAPA0000A" if n.get("maxLength")==10 and "PAN" in json.dumps(node) else "na")
    if t in("integer","number"):return 0
    if t=="boolean":return False
    return None
def main():
    ap=argparse.ArgumentParser();ap.add_argument("--form",required=True);a=ap.parse_args()
    S=schema(a.form);D=S["definitions"];root=[k for k in D if re.match(r"^ITR\d",k)][0]
    top=res(D,D[root]);blocks=[{"name":k,"required":k in(top.get("required")or[])} for k in top["properties"]]
    sk={k:skeleton(D,top["properties"][k]) for k in (top.get("required")or[])}
    enums={}
    def walk(node,path,seen=()):
        n=res(D,node)
        for k,v in n.get("properties",{}).items():
            r=res(D,v);p=path+"."+k if path else k
            if "enum" in r:
                desc=re.sub(r"\s+"," ",r.get("description",""));pairs=[]
                for c in r["enum"]:
                    m=re.search(re.escape(str(c))+r"\s*[:\-–]\s*([^;]+?)(?:;|$)",desc);pairs.append([str(c),m.group(1).strip()[:120] if m else str(c)])
                enums[p]=pairs
            if "properties" in r:walk(v,p)
            elif r.get("type")=="array" and "items" in r:walk(r["items"],p+"[]")
    walk(D[root],"")
    os.makedirs(f"books/{a.form}",exist_ok=True)
    json.dump(sk,open(f"books/{a.form}/skeleton.json","w"),indent=1);json.dump(enums,open(f"books/{a.form}/enums.json","w"),indent=1,ensure_ascii=False);json.dump({"root":root,"blocks":blocks},open(f"books/{a.form}/blocks.json","w"),indent=1)
    print(f"{a.form}: root {root} — {len(blocks)} blocks ({sum(b['required'] for b in blocks)} required) · {len(enums)} enums · skeleton written")
if __name__=="__main__":main()
