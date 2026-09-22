#!/usr/bin/env python3
"""List every array in a return JSON with its row count, and the blocks present/absent — for Gate 7."""
import argparse, json
ap=argparse.ArgumentParser();ap.add_argument("--form",required=True);ap.add_argument("--json",required=True);a=ap.parse_args()
j=json.load(open(a.json));I=list(j["ITR"].values())[0];arrs=[]
def walk(o,path):
    if isinstance(o,dict):
        for k,v in o.items():walk(v,path+"/"+k)
    elif isinstance(o,list):
        arrs.append((path,len(o)))
        for i,v in enumerate(o):walk(v,path+f"[{i}]")
walk(I,"")
empty=[p for p,n in arrs if "[" not in p and n==0]
print(f"arrays: {len([a for a in arrs if '[' not in a[0]])} — empty: {len(empty)}")
for p,n in arrs:
    if "[" not in p:print(f"  {n:>3}  {p}")
blocks=json.load(open(f"books/{a.form}/blocks.json"))["blocks"]
print("absent blocks:",[b["name"] for b in blocks if b["name"] not in I])
