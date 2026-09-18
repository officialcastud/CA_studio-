import json, os, math

PDFS = {
 "ITR-3": "/root/.claude/uploads/f83992ce-d154-5ec6-8aad-e2bd28be6369/252a8b57-CBDT_e-filing_ITR-3_Validation_Rules_V1.0_AY_26-27.pdf",
 "ITR-4": "/root/.claude/uploads/f83992ce-d154-5ec6-8aad-e2bd28be6369/3b2394f4-CBDT_e-Filing_ITR_4_Validation_Rules_AY_2026-27_1.pdf",
}
ROOTS = {"ITR-3":"/home/user/CA_studio-/yukti","ITR-4":"/home/user/ca-itr4/yukti"}
# category page spans (1-based, inclusive) from the PDF TOC
SPAN = {
 "ITR-3": {"A":(4,61), "B":(62,64), "D":(65,73)},
 "ITR-4": {"A":(5,22), "B":(23,23), "D":(24,24)},
}
CLEAN = {"ITR-4": json.load(open("/tmp/ITR-4_clean.json"))}  # only ITR-4 extracted cleanly
BATCH = 50
manifest = []
for form, root in ROOTS.items():
    rules = json.load(open(f"{root}/books/{form}/rules.json"))
    ad = f"{root}/logs/{form}/rule_audit"; sl = f"{ad}/slices"
    os.makedirs(sl, exist_ok=True)
    clean = CLEAN.get(form, {})
    for cat in sorted(set(r["cat"] for r in rules)):
        crules = sorted([r for r in rules if r["cat"]==cat], key=lambda x:x["n"])
        lo_s, hi_s = crules[0]["n"], crules[-1]["n"]
        span = SPAN[form].get(cat, (1,1)); p0,p1 = span; npages = p1-p0+1
        nser = hi_s-lo_s+1
        for i in range(0, len(crules), BATCH):
            chunk = crules[i:i+BATCH]
            lo, hi = chunk[0]["n"], chunk[-1]["n"]
            # attach clean text + pdf page hint
            for r in chunk:
                ck = clean.get(f"{cat}{r['n']}")
                if ck and len(ck) > len(r.get("text","")): r["clean"] = ck
            def page_of(s): return p0 + int((s-lo_s)/max(nser,1)*npages)
            pg_lo, pg_hi = page_of(lo), min(p1, page_of(hi)+1)
            name = f"{cat}_{lo:04d}-{hi:04d}"
            json.dump(chunk, open(f"{sl}/{name}.json","w"), indent=0)
            manifest.append({"form":form,"root":root,"cat":cat,"lo":lo,"hi":hi,"count":len(chunk),
                             "slice":f"logs/{form}/rule_audit/slices/{name}.json",
                             "out":f"logs/{form}/rule_audit/{name}.md",
                             "pdf":PDFS[form],"pdf_pages":f"{pg_lo}-{pg_hi}"})
json.dump(manifest, open("/tmp/audit_manifest.json","w"), indent=1)
print(f"{len(manifest)} batches finalized")
for m in manifest[:3]+manifest[-3:]:
    print(f"  {m['form']} {m['cat']} {m['lo']}-{m['hi']} pdf p.{m['pdf_pages']} -> {m['out']}")
