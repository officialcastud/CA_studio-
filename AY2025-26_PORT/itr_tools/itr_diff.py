#!/usr/bin/env python3
"""
itr_diff.py - diff ITR JSON schemas + CBDT validation-rule PDFs between two AYs.
Runs locally, zero LLM tokens. Output = exact patch list to convert a form
built for one AY (default: newest) into another AY (default: every older AY found).

Usage:
    pip install pdfplumber rapidfuzz
    python3 itr_diff.py <input_dir> <output_dir> [--from 2026-27] [--to 2025-26]

File names are auto-detected (same names CBDT publishes):
    ITR-1_2026_Main_V1_1.json                      -> schema, ITR-1, AY 2026-27
    CBDT_e-Filing_ITR_1_Validation_Rules_AY_2025-26_V1_1.pdf -> rules
    CBDT_e-filing_ITR-3_Validation_Rules_V1_0_AY_25-26.pdf    -> rules
    ITR_4_Schema_change_document_AY2025-26_V1_3.pdf           -> change log
Drop in ITR-5/6/7 files with the same naming and they are picked up too.
"""
import argparse, difflib, json, os, re, sys
from collections import defaultdict, Counter

try:
    import pdfplumber
    from rapidfuzz import fuzz
    from rapidfuzz.process import cdist
except ImportError:
    sys.exit("pip install pdfplumber rapidfuzz")

# ----------------------------------------------------------------- file discovery
def ay_from_year(y):
    y = int(y); y = y + 2000 if y < 100 else y
    return f"{y}-{(y + 1) % 100:02d}"

def classify(fname):
    n = fname.replace(" ", "_")
    fm = re.search(r"ITR[\s_-]*(\d)", n, re.I)
    if not fm:
        return None
    form = f"ITR-{fm.group(1)}"
    if n.lower().endswith(".json"):
        m = re.search(r"ITR[\s_-]*\d_(\d{4})_", n, re.I)
        return ("schema", form, ay_from_year(m.group(1))) if m else None
    if n.lower().endswith(".pdf"):
        m = re.search(r"AY[\s_]*(\d{2,4})-(\d{2})", n, re.I)
        if not m:
            return None
        ay = ay_from_year(m.group(1))
        if re.search(r"schema[\s_]*change", n, re.I):
            return ("changelog", form, ay)
        if re.search(r"validation", n, re.I):
            return ("rules", form, ay)
    return None

def discover(indir):
    found = defaultdict(dict)  # (form) -> {(kind, ay): path}
    for f in sorted(os.listdir(indir)):
        c = classify(f)
        if not c:
            continue
        kind, form, ay = c
        key = (kind, ay)
        if key in found[form]:
            print(f"  [warn] duplicate {form} {kind} {ay}: keeping {f}")
        found[form][key] = os.path.join(indir, f)
    return found

# ----------------------------------------------------------------- schema flatten
LEAF_KEYS = ["type", "enum", "minimum", "maximum", "exclusiveMinimum", "exclusiveMaximum",
             "minLength", "maxLength", "pattern", "format", "default", "minItems", "maxItems"]

def flatten_schema(path):
    s = json.load(open(path, encoding="utf-8"))
    defs = s.get("definitions", {})
    leaves, containers = {}, {}

    def deref(node, stack):
        """Resolve $ref/allOf into one merged dict (outer keys win)."""
        node = dict(node)
        if "$ref" in node:
            name = node.pop("$ref").split("/")[-1]
            if name in stack:
                return {"_cycle": name}
            base = deref(defs.get(name, {}), stack | {name})
            base.setdefault("_def", name)
            base.update({k: v for k, v in node.items()})
            node = base
        if "allOf" in node:
            parts = node.pop("allOf")
            merged = {}
            for p in parts:
                for k, v in deref(p, stack).items():
                    merged.setdefault(k, v)
            merged.update(node)
            node = merged
        return node

    def info(node, required):
        d = {k: node[k] for k in LEAF_KEYS if k in node}
        if "description" in node:
            d["description"] = " ".join(str(node["description"]).split())
        d["required"] = bool(required)
        return d

    def walk(node, p, required, stack):
        node = deref(node, stack)
        if "_cycle" in node:
            leaves[p] = {"type": "cycle->" + node["_cycle"], "required": required}
            return
        t = node.get("type")
        for alt in ("oneOf", "anyOf"):
            if alt in node:
                for i, sub in enumerate(node[alt]):
                    walk(sub, f"{p}{{{alt}{i}}}", required, stack)
                return
        if t == "object" or "properties" in node:
            props = node.get("properties") or {}
            req = set(node.get("required", []))
            containers[p] = {"kind": "object", "required": bool(required), "def": node.get("_def")}
            if not props:
                leaves[p] = info(node, required)
            for k, v in props.items():
                walk(v, f"{p}.{k}", k in req, stack)
        elif t == "array":
            containers[p] = {"kind": "array", "required": bool(required), "def": node.get("_def"),
                             **{k: node[k] for k in ("minItems", "maxItems") if k in node}}
            walk(node.get("items", {}), p + "[]", True, stack)
        else:
            leaves[p] = info(node, required)

    for k, v in s.get("properties", {}).items():
        walk(v, k, True, frozenset())
    return leaves, containers

def sig(d):  # constraint signature ignoring description/required
    return json.dumps({k: v for k, v in d.items() if k not in ("description", "required")}, sort_keys=True)

def diff_schema(src_path, dst_path):
    """src = AY you have built, dst = AY you want. Actions are src -> dst."""
    sL, sC = flatten_schema(src_path)
    dL, dC = flatten_schema(dst_path)
    only_src = sorted(set(sL) - set(dL))
    only_dst = sorted(set(dL) - set(sL))

    def group(paths, conts_self, conts_other):
        """collapse leaves under the highest container that is new on this side."""
        new_conts = set(conts_self) - set(conts_other)
        g = defaultdict(list)
        for p in paths:
            anc = None
            parts = re.split(r"(?<=[^\\])\.", p)
            for i in range(1, len(parts)):
                cand = ".".join(parts[:i])
                if cand in new_conts:
                    anc = cand
                    break
            g[anc or p].append(p)
        return g

    remove = group(only_src, sC, dC)
    add = group(only_dst, dC, sC)

    changes, desc_only = [], []
    for p in sorted(set(sL) & set(dL)):
        a, b = sL[p], dL[p]
        if a == b:
            continue
        diffs = {}
        for k in sorted(set(a) | set(b)):
            if a.get(k) != b.get(k):
                diffs[k] = {"from": a.get(k), "to": b.get(k)}
        if "enum" in diffs:
            ea, eb = a.get("enum") or [], b.get("enum") or []
            diffs["enum"] = {"remove_values": [x for x in ea if x not in eb],
                             "add_values": [x for x in eb if x not in ea]}
        (desc_only if set(diffs) == {"description"} else changes).append({"path": p, "diff": diffs})

    cont_changes = []
    for p in sorted(set(sC) & set(dC)):
        a, b = sC[p], dC[p]
        d = {k: {"from": a.get(k), "to": b.get(k)} for k in ("kind", "required", "minItems", "maxItems")
             if a.get(k) != b.get(k)}
        if d:
            cont_changes.append({"path": p, "diff": d})

    # rename candidates: same parent, exactly one removed + one added, same constraints
    renames = []
    par = lambda p: p.rsplit(".", 1)[0]
    rs, ad = defaultdict(list), defaultdict(list)
    for p in only_src: rs[par(p)].append(p)
    for p in only_dst: ad[par(p)].append(p)
    for parent in set(rs) & set(ad):
        if len(rs[parent]) == 1 and len(ad[parent]) == 1:
            a, b = rs[parent][0], ad[parent][0]
            if sig(sL[a]) == sig(dL[b]):
                renames.append({"from": a, "to": b})

    return {
        "stats": {"src_fields": len(sL), "dst_fields": len(dL), "remove": len(only_src),
                  "add": len(only_dst), "changed": len(changes), "description_only": len(desc_only)},
        "remove": {k: v for k, v in remove.items()},
        "add": {k: [{"path": p, **dL[p]} for p in v] for k, v in add.items()},
        "change": changes, "description_only": desc_only,
        "container_change": cont_changes, "possible_renames": renames,
    }, dL

# ----------------------------------------------------------------- validation rules
CAT_RE = re.compile(r"^\s*(?:\d(?:\.\d)*\s+)?Category\s+([A-Z](?:\s*/\s*[A-Z])?)\s*:")
ANNEX_RE = re.compile(r"^\s*Annexure\s*[-–:]?\s*([0-9IVX]*)\s*$", re.I)
HEADER_WORDS = ("sl. no", "sl.no", "s.no", "publishing document", "scenario", "category of",
                "action to be taken")
NUM_RE = re.compile(r"^\(?(\d{1,4})[.)]?$")

def clean(c):
    return " ".join((c or "").replace("\u00a0", " ").split())

NOISE_RE = re.compile(r"CBDT|e-?Filing|Validation Rules|^Page\s*\d+$|Anywhere Anytime|Income Tax Department", re.I)

def _gap_row(page, tb_cells, bbox, top, bottom):
    """Rows that sit outside a table's ruled area (missing top/bottom border) -> (no, text)."""
    top, bottom = max(0, top), min(page.height, bottom)
    if bottom - top < 6:
        return None
    xs = sorted(set(round(c[0]) for c in tb_cells))
    col1 = xs[1] if len(xs) > 1 else bbox[0] + 60
    words = page.crop((max(0, bbox[0] - 2), top, min(page.width, bbox[2] + 2), bottom)).extract_words()
    lines = defaultdict(list)
    for wd in words:
        lines[round(wd["top"] / 3)].append(wd)
    num, txt = [], []
    for k in sorted(lines):
        ln = sorted(lines[k], key=lambda w: w["x0"])
        if NOISE_RE.search(" ".join(w["text"] for w in ln)):
            continue
        num += [w["text"] for w in ln if w["x1"] <= col1 + 2]
        txt.append(" ".join(w["text"] for w in ln if w["x1"] > col1 + 2))
    m = NUM_RE.match("".join(num))
    return (m.group(1), " ".join(t for t in txt if t)) if m else None

def parse_rules(path):
    rules, cat, last, annex_sched, annex_k = [], None, None, None, 0
    last_no = defaultdict(int)

    def add_rule(no, text, pno):
        nonlocal last
        last = {"cat": cat, "no": str(no), "page": pno, "text": text}
        rules.append(last)
        last_no[cat] = int(no)

    with pdfplumber.open(path) as pdf:
        for pno, page in enumerate(pdf.pages, 1):
            events = []
            for ln in page.extract_text_lines():
                t = ln["text"]
                if "...." in t:
                    continue
                m = CAT_RE.match(t)
                if m:
                    events.append((ln["top"], ln["bottom"], "cat", m.group(1).replace(" ", "")))
                elif ANNEX_RE.match(t):
                    events.append((ln["top"], ln["bottom"], "cat", "Annex" + (ANNEX_RE.match(t).group(1) or "")))
            for tb in page.find_tables():
                events.append((tb.bbox[1], tb.bbox[3], "table", tb))
            events.sort(key=lambda e: e[0])
            prev_bottom, last_tb, page_spans = 0, None, []
            for top, bottom, kind, obj in events:
                if kind == "cat":
                    cat, last, prev_bottom, last_tb = obj, None, bottom, None
                    continue
                if cat is None:
                    prev_bottom = bottom
                    continue
                if not cat.startswith("Annex"):
                    g = _gap_row(page, obj.cells, obj.bbox, prev_bottom, top)
                    if g and int(g[0]) == last_no[cat] + 1:
                        add_rule(g[0], g[1], pno)
                ob = obj.bbox
                host = next((h for h in page_spans if h[0] <= ob[1] and ob[3] <= h[1] + 2 and h[3] is not obj), None)
                if host is not None:  # nested table inside a rule cell -> attach to that rule
                    inner = " ".join(clean(c) for r in obj.extract() for c in r if c)
                    if host[2] is not None and inner and inner[:25] not in host[2]["text"]:
                        host[2]["text"] += " " + inner
                    continue
                for rowobj, row in zip(obj.rows, obj.extract()):
                    cells = [clean(c) for c in row]
                    ne = [c for c in cells if c]
                    if len(ne) >= 2 and ne[0] == ne[1] and NUM_RE.match(ne[0]):
                        ne = ne[1:]
                    if not ne:
                        continue
                    if any(ne[0].lower().startswith(h) for h in HEADER_WORDS) or \
                       (len(ne) <= 2 and any(x.lower() in HEADER_WORDS for x in ne)):
                        continue
                    if cat.startswith("Annex"):
                        if cells[0] and not NUM_RE.match(cells[0]):
                            annex_sched = cells[0]
                        body = [c for c in cells[1:] if c] if cells[0] else ne
                        if len(ne) >= 2:
                            annex_k += 1
                            last = {"cat": cat, "no": str(annex_k), "page": pno,
                                    "text": " | ".join(([annex_sched] if annex_sched else []) + body)}
                            rules.append(last)
                        elif last:
                            last["text"] += " " + ne[0]
                        continue
                    m = NUM_RE.match(ne[0])
                    if m:
                        text = " | ".join(ne[1:])
                        if not text:  # text overflowed the cell grid: read the row box directly
                            rb = rowobj.bbox
                            raw = clean(page.crop((max(0, rb[0]), max(0, rb[1]), min(page.width, rb[2]),
                                                   min(page.height, rb[3]))).extract_text())
                            text = re.sub(r"^\(?" + m.group(1) + r"[.)]?\s*", "", raw)
                        add_rule(m.group(1), text or f"[text not extractable - see PDF page {pno}]", pno)
                        page_spans.append((rowobj.bbox[1], rowobj.bbox[3], last, obj))
                    elif last is not None:
                        last["text"] = (last["text"] + " " + " | ".join(ne)).strip()
                        page_spans.append((rowobj.bbox[1], rowobj.bbox[3], last, obj))
                prev_bottom, last_tb = bottom, obj
            if last_tb is not None and cat and not cat.startswith("Annex"):
                g = _gap_row(page, last_tb.cells, last_tb.bbox, prev_bottom, page.height - 55)
                if g and int(g[0]) == last_no[cat] + 1:
                    add_rule(g[0], g[1], pno)
    for r in rules:
        r["text"] = r["text"].strip(" |")
    return [r for r in rules if r["text"]]

def numbering_gaps(rules):
    by = defaultdict(list)
    for r in rules:
        if not r["cat"].startswith("Annex"):
            by[r["cat"]].append(int(r["no"]))
    return {c: sorted(set(range(1, max(v) + 1)) - set(v)) for c, v in by.items() if set(range(1, max(v) + 1)) - set(v)}

YEAR_RE = re.compile(r"\b(?:19|20)\d{2}-\d{2}\b|\b(?:19|20)\d{2}\b|\b\d{2}-\d{2}\b")
def norm(t):
    t = t.lower().replace("“", '"').replace("”", '"').replace("’", "'").replace("‘", "'")
    t = re.sub(r"(?<=\d),(?=\d)", "", t)
    t = re.sub(r"[^\w%/.()+-]+", " ", t)
    return " ".join(t.split())

SEC_RE = re.compile(r"(?:u/s\.?|sec(?:tion)?\.?|under section)\s*(\d{1,3}[A-Z]{0,5}(?:\([0-9A-Za-z]{1,6}\))*)", re.I)
def secrefs(t):
    """section references like 80CCD(1B), 10(26AAA), 234F, 112A - different sections = different rule"""
    return set(x.upper() for x in SEC_RE.findall(t.replace(" (", "(")))

def yearmask(t):
    t = re.sub(r"(?<=\d[./])\s+(?=\d)", "", t)
    return norm(YEAR_RE.sub("Y", t))

def numbers(t):
    return sorted(set(n.replace(",", "") for n in re.findall(r"\d[\d,]*(?:\.\d+)?", t)))

def rid(r):
    return f"{r['cat']}-{r['no']}"

def diff_rules(src, dst, thresh=78):
    """src = rules of AY you built, dst = rules of AY you want."""
    si = list(range(len(src))); di = list(range(len(dst)))
    pairs = []
    # 1) exact normalized
    bucket = defaultdict(list)
    for j in di: bucket[norm(dst[j]["text"])].append(j)
    used_d, used_s = set(), set()
    for i in si:
        k = norm(src[i]["text"])
        if bucket.get(k):
            j = bucket[k].pop(0); used_s.add(i); used_d.add(j); pairs.append((i, j, 100.0))
    # 2) fuzzy on the rest
    rs = [i for i in si if i not in used_s]; rd = [j for j in di if j not in used_d]
    if rs and rd:
        M = cdist([norm(src[i]["text"]) for i in rs], [norm(dst[j]["text"]) for j in rd],
                  scorer=fuzz.ratio, workers=-1)
        cand = []
        for a in range(len(rs)):
            ra = src[rs[a]]; sa = secrefs(ra["text"])
            for b in range(len(rd)):
                if M[a][b] < thresh - 3:
                    continue
                rb = dst[rd[b]]; sb = secrefs(rb["text"])
                sc = M[a][b] - min(36, 12 * len(sa ^ sb)) + (3 if rid(ra) == rid(rb) else 0)
                if sc >= thresh:
                    cand.append((min(sc, 99.9), a, b))
        cand.sort(reverse=True)
        ua, ub = set(), set()
        for sc, a, b in cand:
            if a in ua or b in ub:
                continue
            ua.add(a); ub.add(b); used_s.add(rs[a]); used_d.add(rd[b]); pairs.append((rs[a], rd[b], sc))

    out = {"unchanged": 0, "renumbered": [], "year_shift": [], "wording": [], "changed": [],
           "disable": [src[i] | {"id": rid(src[i])} for i in si if i not in used_s],
           "add": [dst[j] | {"id": rid(dst[j])} for j in di if j not in used_d]}
    for i, j, sc in sorted(pairs, key=lambda x: x[1]):
        a, b = src[i], dst[j]
        rec = {"src_id": rid(a), "dst_id": rid(b), "score": round(sc, 1),
               "src_text": a["text"], "dst_text": b["text"]}
        if sc == 100.0:
            out["unchanged"] += 1
            if rid(a) != rid(b):
                out["renumbered"].append({"src_id": rid(a), "dst_id": rid(b)})
            continue
        na, nb = numbers(a["text"]), numbers(b["text"])
        rec["numbers_removed"] = [x for x in na if x not in nb]
        rec["numbers_added"] = [x for x in nb if x not in na]
        if yearmask(a["text"]) == yearmask(b["text"]):
            out["year_shift"].append(rec)
        elif na == nb and sc >= 93:
            out["wording"].append(rec)
        else:
            out["changed"].append(rec)
    return out

def word_diff(a, b):
    """inline diff a->b : ~~removed~~ **added**"""
    A, B = a.split(), b.split()
    res = []
    for op, i1, i2, j1, j2 in difflib.SequenceMatcher(None, A, B, autojunk=False).get_opcodes():
        if op == "equal":
            res.append(" ".join(A[i1:i2]))
        else:
            if i2 > i1: res.append("~~" + " ".join(A[i1:i2]) + "~~")
            if j2 > j1: res.append("**" + " ".join(B[j1:j2]) + "**")
    return " ".join(res)

# ----------------------------------------------------------------- change logs
def parse_changelog(path):
    rows, section = [], None
    with pdfplumber.open(path) as pdf:
        for page in pdf.pages:
            ev = [(ln["top"], "h", ln["text"]) for ln in page.extract_text_lines()
                  if re.search(r"Schema changes as on", ln["text"]) and "...." not in ln["text"]]
            ev += [(t.bbox[1], "t", t) for t in page.find_tables()]
            for _, k, o in sorted(ev, key=lambda e: e[0]):
                if k == "h":
                    section = clean(o); continue
                for r in o.extract():
                    c = [clean(x) for x in r]
                    ne = [x for x in c if x]
                    if len(ne) >= 4 and NUM_RE.match(ne[0]):
                        rows.append({"section": section, "root": ne[1], "element": ne[2],
                                     "change": ne[3], "description": " ".join(ne[4:])})
    return rows

# ----------------------------------------------------------------- report
def fmt_leaf(d):
    bits = []
    for k in ("type", "minimum", "maximum", "minLength", "maxLength", "pattern", "format"):
        if k in d: bits.append(f"{k}={d[k]}")
    if "enum" in d:
        e = d["enum"]; bits.append("enum=" + (str(e) if len(str(e)) < 160 else str(e)[:160] + "…]"))
    if d.get("required"): bits.append("REQUIRED")
    return ", ".join(bits)

def short(p, form):
    return re.sub(rf"^ITR\.ITR{form[-1]}\.", "", p)

def write_report(form, src_ay, dst_ay, sch, dL, rul, logs, outdir):
    L = []; w = L.append
    title = f"{form}: convert AY {src_ay} build -> AY {dst_ay}"
    w(f"# {title}\n")
    w("Generated by itr_diff.py (no LLM). Direction: everything below is what to change in your "
      f"**AY {src_ay}** HTML to make it an exact **AY {dst_ay}** form. "
      "~~strike~~ = remove, **bold** = add.\n")
    # summary
    w("## 1. Summary\n")
    w("| Area | Count |\n|---|---|")
    if sch:
        s = sch["stats"]
        w(f"| Schema leaf fields ({src_ay} → {dst_ay}) | {s['src_fields']} → {s['dst_fields']} |")
        w(f"| Fields to REMOVE | {s['remove']} (in {len(sch['remove'])} groups) |")
        w(f"| Fields to ADD | {s['add']} (in {len(sch['add'])} groups) |")
        w(f"| Fields with constraint/enum changes | {s['changed']} |")
        w(f"| Description-only changes | {s['description_only']} |")
        w(f"| Container (object/array) changes | {len(sch['container_change'])} |")
    if rul:
        w(f"| Validation rules identical | {rul['unchanged']} ({len(rul['renumbered'])} renumbered) |")
        w(f"| Rules to DISABLE (exist only in {src_ay}) | {len(rul['disable'])} |")
        w(f"| Rules to ADD (exist only in {dst_ay}) | {len(rul['add'])} |")
        w(f"| Rules CHANGED (limits/logic) | {len(rul['changed'])} |")
        w(f"| Rules with only year references changed | {len(rul['year_shift'])} |")
        w(f"| Rules with wording-only changes | {len(rul['wording'])} |")
    w("")
    # key numbers
    if rul and rul["changed"]:
        w("## 2. Numbers that differ in changed rules (limits, dates, Sl.No. references)\n")
        w(f"| {src_ay} rule | {dst_ay} rule | numbers only in {src_ay} | numbers only in {dst_ay} |")
        w("|---|---|---|---|")
        for c in rul["changed"]:
            if c["numbers_removed"] or c["numbers_added"]:
                w(f"| {c['src_id']} | {c['dst_id']} | {', '.join(c['numbers_removed']) or '-'} | "
                  f"{', '.join(c['numbers_added']) or '-'} |")
        w("")
    # schema
    if sch:
        w("## 3. Schema changes (JSON your form must emit)\n")
        w(f"### 3a. REMOVE — present in {src_ay}, absent in {dst_ay}\n")
        if not sch["remove"]: w("_None._\n")
        for g, paths in sorted(sch["remove"].items()):
            if len(paths) == 1 and paths[0] == g:
                w(f"- `{short(g, form)}`")
            else:
                w(f"- **`{short(g, form)}`** (whole block, {len(paths)} fields)")
                for p in paths: w(f"  - `{short(p, form)}`")
        w(f"\n### 3b. ADD — required by {dst_ay} schema\n")
        if not sch["add"]: w("_None._\n")
        for g, items in sorted(sch["add"].items()):
            if len(items) == 1 and items[0]["path"] == g:
                it = items[0]
                w(f"- `{short(g, form)}` — {fmt_leaf(it)}" + (f"  \n  _{it['description'][:300]}_" if it.get("description") else ""))
            else:
                w(f"- **`{short(g, form)}`** (whole block, {len(items)} fields)")
                for it in items:
                    w(f"  - `{short(it['path'], form)}` — {fmt_leaf(it)}")
        if sch["possible_renames"]:
            w("\n### 3c. Probable renames (same parent, same constraints)\n")
            for r in sch["possible_renames"]:
                w(f"- `{short(r['from'], form)}` → `{short(r['to'], form)}`")
        w("\n### 3d. CHANGE constraints / enums\n")
        if not sch["change"]: w("_None._\n")
        for c in sch["change"]:
            w(f"- `{short(c['path'], form)}`")
            for k, v in c["diff"].items():
                if k == "enum":
                    if v["remove_values"]: w(f"  - enum: ~~remove {v['remove_values']}~~")
                    if v["add_values"]: w(f"  - enum: **add {v['add_values']}**")
                elif k == "description":
                    w(f"  - description: {word_diff(str(v['from'] or ''), str(v['to'] or ''))}")
                else:
                    w(f"  - {k}: `{v['from']}` → `{v['to']}`")
        if sch["container_change"]:
            w("\n### 3e. Container changes (required / array limits)\n")
            for c in sch["container_change"]:
                w(f"- `{short(c['path'], form)}`: " + "; ".join(f"{k} `{v['from']}` → `{v['to']}`" for k, v in c["diff"].items()))
        if sch["description_only"]:
            w(f"\n<details><summary>3f. Description-only changes ({len(sch['description_only'])}) — labels/help text</summary>\n")
            for c in sch["description_only"]:
                v = c["diff"]["description"]
                w(f"- `{short(c['path'], form)}`: {word_diff(str(v['from'] or ''), str(v['to'] or ''))}")
            w("\n</details>\n")
    # rules
    if rul:
        w("\n## 4. Validation rules\n")
        w(f"### 4a. DISABLE — rules that exist only in {src_ay}\n")
        if not rul["disable"]: w("_None._\n")
        for r in rul["disable"]: w(f"- **{r['id']}** (p{r['page']}): {r['text']}")
        w(f"\n### 4b. ADD — rules that exist only in {dst_ay}\n")
        if not rul["add"]: w("_None._\n")
        for r in rul["add"]: w(f"- **{r['id']}** (p{r['page']}): {r['text']}")
        w(f"\n### 4c. CHANGE — same rule, different logic/limits\n")
        if not rul["changed"]: w("_None._\n")
        for c in rul["changed"]:
            w(f"- **{c['src_id']} → {c['dst_id']}** (similarity {c['score']})")
            w(f"  - {src_ay}: {c['src_text']}")
            w(f"  - {dst_ay}: {c['dst_text']}")
            w(f"  - diff: {word_diff(c['src_text'], c['dst_text'])}")
        w(f"\n### 4d. Year references only (swap AY/FY dates, nothing else)\n")
        if not rul["year_shift"]: w("_None._\n")
        for c in rul["year_shift"]:
            w(f"- **{c['src_id']} → {c['dst_id']}**: {word_diff(c['src_text'], c['dst_text'])}")
        if rul["wording"]:
            w(f"\n<details><summary>4e. Wording-only changes ({len(rul['wording'])}) — no logic change</summary>\n")
            for c in rul["wording"]:
                w(f"- **{c['src_id']} → {c['dst_id']}**: {word_diff(c['src_text'], c['dst_text'])}")
            w("\n</details>\n")
        if rul["renumbered"]:
            w(f"\n<details><summary>4f. Identical rules, renumbered ({len(rul['renumbered'])}) — only matters if you show rule numbers</summary>\n")
            w(", ".join(f"{r['src_id']}→{r['dst_id']}" for r in rul["renumbered"]))
            w("\n</details>\n")
    # changelogs
    if logs:
        w("\n## 5. Official intra-year schema revisions (CBDT change documents)\n")
        for ay, rows in sorted(logs.items()):
            w(f"### AY {ay}\n")
            if not rows: w("_No rows parsed._\n")
            for r in rows:
                w(f"- {r['section'] or ''} — `{r['root']}.{r['element']}`: {r['change']} — {r['description']}")
            w("")
    base = f"{form}_AY{src_ay}_to_AY{dst_ay}"
    open(os.path.join(outdir, base + ".md"), "w", encoding="utf-8").write("\n".join(L))
    # bite-size chunks: feed ONE chunk per LLM session instead of the whole report
    cdir = os.path.join(outdir, base + "_chunks"); os.makedirs(cdir, exist_ok=True)
    chunks, cur, name = [], [], "00_intro"
    for line in "\n".join(L).split("\n"):
        if line.startswith("## ") or line.startswith("### "):
            if any(x.strip() for x in cur): chunks.append((name, cur))
            name = re.sub(r"[^0-9a-zA-Z]+", "_", line.lstrip("# ").split("—")[0]).strip("_")[:40]
            cur = [f"<!-- {title} -->", line]
        else:
            cur.append(line)
    if any(x.strip() for x in cur): chunks.append((name, cur))
    index = []
    for k, (n, c) in enumerate(chunks):
        fn = f"{k:02d}_{n}.md"
        txt = "\n".join(c)
        open(os.path.join(cdir, fn), "w", encoding="utf-8").write(txt)
        index.append((fn, len(txt) // 4))
    open(os.path.join(cdir, "INDEX.md"), "w").write(
        f"# {title} - chunks (~tokens)\n\n" + "\n".join(f"- {f}: ~{t:,} tokens" for f, t in index) + "\n")
    json.dump({"form": form, "from_ay": src_ay, "to_ay": dst_ay, "schema": sch, "rules": rul,
               "changelog": logs}, open(os.path.join(outdir, base + ".json"), "w", encoding="utf-8"),
              indent=1, ensure_ascii=False, default=str)
    return base

# ----------------------------------------------------------------- main
def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("indir"); ap.add_argument("outdir")
    ap.add_argument("--from", dest="src"); ap.add_argument("--to", dest="dst")
    a = ap.parse_args()
    os.makedirs(os.path.join(a.outdir, "data"), exist_ok=True)
    found = discover(a.indir)
    summary = []
    for form in sorted(found):
        files = found[form]
        ays = sorted({ay for (_, ay) in files})
        src = a.src or ays[-1]
        targets = [a.dst] if a.dst else [x for x in ays if x != src]
        print(f"{form}: AYs found {ays}")
        rules_cache, schema_cache = {}, {}
        for (kind, ay), p in files.items():
            if kind == "rules":
                rules_cache[ay] = parse_rules(p)
                json.dump(rules_cache[ay], open(os.path.join(a.outdir, "data", f"rules_{form}_AY{ay}.json"), "w"),
                          indent=1, ensure_ascii=False)
                cats = Counter(r["cat"] for r in rules_cache[ay])
                gaps = numbering_gaps(rules_cache[ay])
                print(f"  rules {ay}: {len(rules_cache[ay])} {dict(cats)}" + (f"  numbering gaps (check PDF): {gaps}" if gaps else ""))
        logs = {ay: parse_changelog(p) for (kind, ay), p in files.items() if kind == "changelog"}
        for dst in targets:
            sch = dL = None
            if ("schema", src) in files and ("schema", dst) in files:
                sch, dL = diff_schema(files[("schema", src)], files[("schema", dst)])
                # field inventory of target AY (handy for building the form)
                with open(os.path.join(a.outdir, "data", f"fields_{form}_AY{dst}.tsv"), "w", encoding="utf-8") as f:
                    f.write("path\ttype\trequired\tconstraints\tdescription\n")
                    for p, d in dL.items():
                        f.write(f"{p}\t{d.get('type','')}\t{d.get('required')}\t{fmt_leaf(d)}\t{d.get('description','')}\n")
            rul = diff_rules(rules_cache[src], rules_cache[dst]) if src in rules_cache and dst in rules_cache else None
            if not (sch or rul):
                print(f"  skip {src}->{dst}: need schema or rules for both AYs"); continue
            base = write_report(form, src, dst, sch, dL, rul, {k: v for k, v in logs.items() if k in (src, dst)}, a.outdir)
            summary.append((form, src, dst, sch, rul, base))
            print(f"  wrote {base}.md")
    # index
    L = ["# ITR AY conversion — summary\n", "| Form | From → To | Fields −/+/Δ | Rules disable/add/changed/year-only | Report |",
         "|---|---|---|---|---|"]
    for form, s, d, sch, rul, base in summary:
        fs = f"{sch['stats']['remove']}/{sch['stats']['add']}/{sch['stats']['changed']}" if sch else "no schema pair"
        rs = f"{len(rul['disable'])}/{len(rul['add'])}/{len(rul['changed'])}/{len(rul['year_shift'])}" if rul else "no rules pair"
        L.append(f"| {form} | {s} → {d} | {fs} | {rs} | [{base}.md]({base}.md) |")
    missing = [f"ITR-{n}" for n in range(1, 8) if f"ITR-{n}" not in found]
    if missing: L.append(f"\nNot provided yet: {', '.join(missing)} — drop their schema JSON + validation PDFs in the input folder and rerun.")
    open(os.path.join(a.outdir, "SUMMARY.md"), "w").write("\n".join(L) + "\n")
    print("done ->", a.outdir)

if __name__ == "__main__":
    main()
