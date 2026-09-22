#!/usr/bin/env python3
"""Reconcile LENS 1: for every leaf, apply coverage.py's three tests separately:
  q = quoted path-segment  "...Key..."   (a put/export path or export literal)
  o = object-literal key   Key:
  c = concat stem          "Stem"+
  b = bare token \\bKey\\b anywhere (incl. comments/unrelated) -- the loose branch
A leaf with none of q/o/c/b is a hard ORPHAN (coverage.py flags it).
A leaf with ONLY b (bare) is a SOFT suspect: its key appears only as a loose token,
possibly a comment -- worth eyeballing for a real writer/reader.
"""
import json, os, re, glob, sys
sys.path.insert(0, os.path.abspath("tools"))
from dump import leaves

SRC = ""
for p in sorted(glob.glob("forms/ITR-7/src/*.js")):
    SRC += "\n" + open(p, encoding="utf-8").read()
# strip // line comments and /* */ block comments to test writers in CODE only
CODE = re.sub(r'/\*.*?\*/', ' ', SRC, flags=re.S)
CODE = re.sub(r'//[^\n]*', ' ', CODE)

sm = json.load(open("books/ITR-7/section_map.json"))
blocks = []
for sheet, v in sm.items():
    for b in v.get("blocks", []):
        if b not in blocks: blocks.append(b)

def q(key, s): return re.search(r'"[^"]*\b' + re.escape(key) + r'\b', s) is not None
def o(key, s): return re.search(r'\b' + re.escape(key) + r'\s*:', s) is not None
def asg(key, s): return (re.search(r'\.' + re.escape(key) + r'\s*=[^=]', s) is not None
                         or re.search(r'\b' + re.escape(key) + r'\s*=[^=]', s) is not None)
def c(key, s):
    for L in range(1, min(9, len(key))):
        stem = key[:-L]
        if len(stem) >= 4 and re.search(r'"' + re.escape(stem) + r'"\s*\+', s): return True
    return False
def bare(key, s): return re.search(r'\b' + re.escape(key) + r'\b', s) is not None

hard, softcomment = [], []
total = 0
for name in blocks:
    try: lv = leaves("ITR-7", name)
    except Exception as e: print("!!", name, e); continue
    for path, typ, req in lv:
        key = path.split(".")[-1].replace("[]", "")
        if not key or path.endswith("[]"): continue
        total += 1
        # is there a writer/reader in CODE (comments stripped)?
        incode = q(key, CODE) or o(key, CODE) or asg(key, CODE) or c(key, CODE)
        if incode: continue
        # not in code. is it anywhere in raw (incl comments)?
        if bare(key, SRC):
            softcomment.append((name, path, typ, req))
        else:
            hard.append((name, path, typ, req))

print(f"=== {total} leaves ===")
print(f"\n--- HARD ORPHANS (key absent from entire src): {len(hard)} ---")
for n,p,t,r in hard: print(f"  {'REQ' if r else 'opt'}  {n}.{p} ({t})")
print(f"\n--- SOFT (key only in comments, no code writer/reader): {len(softcomment)} ---")
for n,p,t,r in softcomment: print(f"  {'REQ' if r else 'opt'}  {n}.{p} ({t})")
