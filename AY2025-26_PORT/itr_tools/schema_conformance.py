#!/usr/bin/env python3
"""Leaf-level schema conformance check for the AY-port forms.

Compares a form's exported return JSON against the target-year schema leaf
inventory (reports/data/fields_ITR-<n>_AY2025-26.tsv, produced by itr_diff.py).
It is the verification bar for the schema deltas (PLAN.md §8 step 2, part 3):
apply 3a REMOVE / 3b ADD / 3d CHANGE until this reports clean.

It classifies every leaf the form emits and every leaf the schema names:
  EMITTED_NOT_IN_SCHEMA  the form emits a leaf the target year does not have
                         -> a 3a REMOVE not yet done (or a stray write)
  REQUIRED_MISSING       the schema marks a leaf REQUIRED but the form did not
                         emit it. Only counted when a SIBLING leaf of the same
                         parent object/array WAS emitted, so an entirely-absent
                         optional block (e.g. PartB-ATI when not a 139(8A)
                         return) is not spuriously flagged.
  TYPE_MISMATCH          emitted value's JSON type != schema type

Array indices in emitted paths are normalised to `[]` so they line up with the
inventory's array notation.

usage:
  python3 schema_conformance.py --tsv reports/data/fields_ITR-1_AY2025-26.tsv \\
      --json <return.json> [--root ITR.ITR1]
"""
import argparse, json, re, sys


def load_schema(tsv):
    """path -> {type, required, enum?}. Paths are stored without the ITR.ITR1 root."""
    out = {}
    with open(tsv, encoding="utf-8") as f:
        header = f.readline()
        for line in f:
            parts = line.rstrip("\n").split("\t")
            if len(parts) < 4:
                continue
            path, typ, required, constraints = parts[0], parts[1], parts[2], parts[3]
            out[path] = {
                "type": typ,
                "required": required.strip().lower() == "true",
                "constraints": constraints,
            }
    return out


def strip_root(path, root):
    """Drop a leading 'ITR.ITR1.' style root from a schema path."""
    if root and path.startswith(root + "."):
        return path[len(root) + 1:]
    return path


def flatten(obj, prefix=""):
    """Yield (normalised_path, json_type) for every leaf. Arrays -> '[]'."""
    if isinstance(obj, dict):
        for k, v in obj.items():
            yield from flatten(v, prefix + ("." if prefix else "") + k)
    elif isinstance(obj, list):
        for v in obj:
            yield from flatten(v, prefix + "[]")
    else:
        t = ("integer" if isinstance(obj, bool) is False and isinstance(obj, int)
             else "number" if isinstance(obj, float)
             else "string" if isinstance(obj, str)
             else "boolean" if isinstance(obj, bool)
             else "null")
        yield prefix, t


TYPE_OK = {
    ("integer", "number"), ("number", "integer"),  # numeric leniency
}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--tsv", required=True)
    ap.add_argument("--json", required=True)
    ap.add_argument("--root", default="ITR.ITR1",
                    help="schema path root to strip; also the return sub-object to read")
    a = ap.parse_args()

    schema = load_schema(a.tsv)
    schema_leaves = {strip_root(p, a.root): v for p, v in schema.items()}

    ret = json.load(open(a.json))
    # descend into ITR.ITR1 (or bare ITR1)
    node = ret
    for k in a.root.split("."):
        if isinstance(node, dict) and k in node:
            node = node[k]
        elif isinstance(node, dict) and "ITR" in node:
            inner = node["ITR"]
            node = inner.get(k.split(".")[-1]) or next(iter(inner.values()))
    emitted = {}
    for p, t in flatten(node):
        emitted.setdefault(p, t)

    emitted_not_in_schema = sorted(p for p in emitted if p not in schema_leaves)

    # parents (object/array prefixes) that the form actually populated
    emitted_parents = set()
    for p in emitted:
        segs = p.split(".")
        for i in range(1, len(segs)):
            emitted_parents.add(".".join(segs[:i]))

    required_missing = []
    for p, meta in schema_leaves.items():
        if not meta["required"] or p in emitted:
            continue
        parent = ".".join(p.split(".")[:-1])
        if parent in emitted_parents:      # sibling present -> block is in play
            required_missing.append(p)
    required_missing.sort()

    type_mismatch = []
    for p, t in emitted.items():
        if p in schema_leaves:
            st = schema_leaves[p]["type"]
            if t != st and (t, st) not in TYPE_OK and t != "null":
                type_mismatch.append((p, t, st))
    type_mismatch.sort()

    print("== schema conformance ==")
    print(" schema leaves:", len(schema_leaves), " emitted leaves:", len(emitted))
    print(" EMITTED_NOT_IN_SCHEMA (candidate 3a removes / stray writes):", len(emitted_not_in_schema))
    for p in emitted_not_in_schema:
        print("   +", p)
    print(" REQUIRED_MISSING (schema-required, sibling present):", len(required_missing))
    for p in required_missing:
        print("   -", p)
    print(" TYPE_MISMATCH:", len(type_mismatch))
    for p, t, st in type_mismatch:
        print("   ~", p, "emitted", t, "want", st)

    ok = not (emitted_not_in_schema or required_missing or type_mismatch)
    print("RESULT:", "CLEAN" if ok else "GAPS")
    sys.exit(0 if ok else 1)


if __name__ == "__main__":
    main()
