#!/usr/bin/env python3
"""Validate a return JSON against the form's real schema. exit 0 on zero errors."""
import argparse, json, glob, sys
import jsonschema
ap=argparse.ArgumentParser();ap.add_argument("--form",required=True);ap.add_argument("--json",required=True);a=ap.parse_args()
sf=[f for f in glob.glob(f"sources/{a.form}/*.json") if "schema" in f.lower() or "Main" in f][0]
S=json.load(open(sf));j=json.load(open(a.json))
errs=sorted(jsonschema.Draft4Validator(S).iter_errors(j),key=lambda e:list(e.path))
print(f"schema {sf.split('/')[-1]}: {len(errs)} errors")
for e in errs[:40]:print("  ","/".join(str(x) for x in e.path),"→",e.message[:140])
root=[k for k in j.get("ITR",{})][0] if j.get("ITR") else None
if root:
    blocks=json.load(open(f"books/{a.form}/blocks.json"))["blocks"];present=[b["name"] for b in blocks if b["name"] in j["ITR"][root]]
    print(f"blocks present: {len(present)} of {len(blocks)}; absent: {[b['name'] for b in blocks if b['name'] not in j['ITR'][root]]}")
sys.exit(1 if errs else 0)
