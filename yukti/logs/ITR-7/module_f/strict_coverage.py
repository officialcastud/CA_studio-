#!/usr/bin/env python3
"""LENS 1 strict leaf-coverage: for every schema leaf of every section_map block,
classify by evidence of a WRITER (put/exp target or B+"Key" concat or "Key": literal)
and a READER (data-p="...Key" input / state binding). A leaf with neither is a
candidate ORPHAN. Stricter than tools/coverage.py (which counts any bare token match).
"""
import json, os, re, glob, sys
sys.path.insert(0, os.path.abspath("tools"))
from dump import leaves

SRC = ""
for p in sorted(glob.glob("forms/ITR-7/src/*.js")):
    SRC += "\n" + open(p, encoding="utf-8").read()

sm = json.load(open("books/ITR-7/section_map.json"))
blocks = []
for sheet, v in sm.items():
    for b in v.get("blocks", []):
        if b not in blocks:
            blocks.append(b)

def writer(key):
    # explicit string literal (export path / object key), or concat stem
    if re.search(r'"' + re.escape(key) + r'"', SRC): return True
    if re.search(r'\b' + re.escape(key) + r'\s*:', SRC): return True   # object literal key:
    if re.search(r'\.' + re.escape(key) + r'\s*=', SRC): return True   # o.Key= property assign
    if re.search(r'\b' + re.escape(key) + r'\s*=[^=]', SRC): return True  # bare Key= assign
    # runtime concat: "Stem"+n  where key = Stem+suffix
    for L in range(1, min(9, len(key))):
        stem = key[:-L]
        if len(stem) >= 4 and re.search(r'"' + re.escape(stem) + r'"\s*\+', SRC): return True
    return False

def reader(key):
    # data-p attribute or explicit S.<...>.key read is hard generically; treat the
    # quoted/obj-key hit as covering read too. Only used to distinguish pure comments.
    if re.search(r'data-p="[^"]*' + re.escape(key), SRC): return True
    return False

total = 0
orphans = []
for name in blocks:
    try:
        lv = leaves("ITR-7", name)
    except Exception as e:
        print("!! block unreadable", name, e); continue
    for path, typ, req in lv:
        key = path.split(".")[-1].replace("[]", "")
        if not key or path.endswith("[]"):
            continue
        total += 1
        if writer(key) or reader(key):
            continue
        orphans.append((name, path, typ, req))

print(f"=== strict scan: {total} leaves, {len(orphans)} with NO string-literal writer/reader ===\n")
for name, path, typ, req in orphans:
    print(f"  {'REQ' if req else 'opt'}  {name}.{path}  ({typ})")
