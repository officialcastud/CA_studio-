#!/usr/bin/env python3
"""Schema-leaf coverage audit — does every schema particular have a home in the software?

For each leaf of every schema block (books/<form>/blocks.json), check whether the software
can produce/accept a value for it: the leaf's key must appear in the assembled form's script
either as an export path / object-literal key (`"Key"` or `Key:`), or as a state field a
`data-p` input writes. A leaf whose key never appears has NO home — a coverage gap.

usage: python3 tools/coverage.py --form ITR-3 [--required-only] [--block <name>]

This is a heuristic (key-token presence), tuned for FEW false-negatives: a required leaf it
reports as uncovered is almost certainly a genuine hole; spot-check the handful it flags.
"""
import argparse, json, os, re, sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__)))
from dump import leaves

GENERIC = set("Amount Date Type Name Code Rate Total Income Number No Flag Dtls Details Value".split())

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--form", required=True)
    ap.add_argument("--required-only", action="store_true")
    ap.add_argument("--block")
    a = ap.parse_args()
    # the assembled single-file form is the source of truth for what the software can do
    html = f"forms/{a.form}/Yukti_{a.form.replace('-','')}.html"
    src = open(html, encoding="utf-8").read() if os.path.exists(html) else ""
    # also fold in the raw section src (in case something is un-assembled)
    for p in sorted(__import__("glob").glob(f"forms/{a.form}/src/*.js")):
        src += "\n" + open(p, encoding="utf-8").read()
    bl = json.load(open(f"books/{a.form}/blocks.json"))
    blocks = bl["blocks"] if isinstance(bl, dict) and "blocks" in bl else bl
    def covered(key):
        # key appears as a quoted path segment, an object key, or a data-p tail
        if re.search(r'"[^"]*\b' + re.escape(key) + r'\b', src): return True
        if re.search(r'\b' + re.escape(key) + r'\s*:', src): return True
        if re.search(r'\b' + re.escape(key) + r'\b', src): return True
        # keys built at runtime by concatenation, e.g. b["SaleValue"+suf] (suf="115AD")
        # or y["TotalTaxAttributedAmt"+n] (n="21"): covered if a prefix stem is emitted
        # as a `"<stem>"+` concatenation.
        for L in range(1, min(7, len(key))):
            stem = key[:-L]
            if len(stem) >= 4 and re.search(r'"' + re.escape(stem) + r'"\s*\+', src): return True
        return False
    total = miss_req = miss_opt = 0
    report = {}
    for b in blocks:
        name = b["name"] if isinstance(b, dict) else b
        if a.block and name != a.block: continue
        try:
            lv = leaves(a.form, name)
        except Exception as e:
            report.setdefault(name, []).append(("(block leaves unreadable: %s)" % e, None, True, False))
            continue
        for path, typ, req in lv:
            key = path.split(".")[-1].replace("[]", "")
            if not key or path.endswith("[]"):  # array container — judged by its children
                continue
            total += 1
            ok = covered(key)
            if ok: continue
            if req: miss_req += 1
            else: miss_opt += 1
            report.setdefault(name, []).append((path, typ, req, ok))
    # print
    for name in sorted(report):
        rows = report[name]
        if a.required_only:
            rows = [r for r in rows if r[2]]
            if not rows: continue
        print(f"\n## {name}  — {len(rows)} uncovered")
        for path, typ, req, ok in rows:
            print(f"   {'REQ' if req else 'opt'}  {path}  ({typ})")
    print(f"\n=== {a.form}: {total} leaves checked · uncovered: {miss_req} required, {miss_opt} optional ===")
    print("(heuristic: a leaf is 'covered' if its key token appears in the assembled form; spot-check flagged ones.)")

if __name__ == "__main__":
    main()
