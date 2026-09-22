#!/usr/bin/env python3
"""Consolidate per-batch rule-audit reports into a master coverage report per form.
Parses the ```tsv blocks. Verifies every serial appears exactly once. Lists GAP/WEAK."""
import json, os, re, glob, collections, sys

FORMS = {"ITR-3":"/home/user/CA_studio-/yukti","ITR-4":"/home/user/ca-itr4/yukti"}
for form, root in FORMS.items():
    ad = f"{root}/logs/{form}/rule_audit"
    rules = json.load(open(f"{root}/books/{form}/rules.json"))
    expected = collections.defaultdict(set)  # cat -> {serials}
    for r in rules: expected[r["cat"]].add(r["n"])
    got = {}   # (cat, serial) -> (verdict, ref, note, batchfile)
    dupes = []
    files = sorted(f for f in glob.glob(f"{ad}/*.md") if os.path.basename(f)[0] in "ABD" and "-" in os.path.basename(f))
    present_batches = set(os.path.basename(f) for f in files)
    for fp in files:
        cat = os.path.basename(fp)[0]
        txt = open(fp, encoding="utf-8").read()
        m = re.search(r'```tsv\n(.*?)```', txt, re.S)
        if not m:
            print(f"  !! {os.path.basename(fp)}: no tsv block"); continue
        for line in m.group(1).splitlines():
            if not line.strip(): continue
            parts = line.split("\t")
            try: serial = int(parts[0].strip())
            except: continue
            verdict = (parts[1].strip() if len(parts)>1 else "?").upper()
            ref = parts[2].strip() if len(parts)>2 else ""
            note = parts[3].strip() if len(parts)>3 else ""
            key = (cat, serial)
            if key in got: dupes.append(key)
            got[key] = (verdict, ref, note, os.path.basename(fp))
    # coverage vs expected
    report = [f"# {form} — validation-rule enforcement: MASTER coverage", ""]
    total_expected = sum(len(v) for v in expected.values())
    report.append(f"Batches present: {len(files)}. Rules expected: {total_expected}. Rules judged: {len(got)}.")
    vc = collections.Counter(v[0] for v in got.values())
    report.append(f"Verdicts: " + " · ".join(f"{k}={vc.get(k,0)}" for k in ["OK","WEAK","GAP","STRUCT","NA"]))
    report.append("")
    for cat in sorted(expected):
        missing = sorted(expected[cat] - {s for (c,s) in got if c==cat})
        if missing:
            report.append(f"## Category {cat}: MISSING from audit (batch not run / serial skipped): {missing}")
    if dupes: report.append(f"## DUPLICATE judgements: {sorted(set(dupes))}")
    report.append("")
    for verd in ["GAP","WEAK"]:
        rows = sorted([(c,s,v) for (c,s),v in got.items() if v[0]==verd])
        report.append(f"## {verd} — {len(rows)} rules")
        for c,s,v in rows:
            report.append(f"- **{c}{s}** [{v[3]}] {v[2]}  ({v[1] or 'not encoded'})")
        report.append("")
    outp = f"{ad}/MASTER_COVERAGE.md"
    open(outp,"w").write("\n".join(report))
    # console summary
    print(f"\n=== {form}: {len(got)}/{total_expected} judged · OK={vc.get('OK',0)} WEAK={vc.get('WEAK',0)} GAP={vc.get('GAP',0)} STRUCT={vc.get('STRUCT',0)} NA={vc.get('NA',0)} ===")
    miss_any = {cat: sorted(expected[cat]-{s for (c,s) in got if c==cat}) for cat in expected}
    miss_any = {k:v for k,v in miss_any.items() if v}
    if miss_any: print(f"   batches still pending/missing serials: {miss_any}")
    print(f"   -> {outp}")
