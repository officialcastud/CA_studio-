# Validation-rule enforcement audit — checker instructions (READ-ONLY)

You are one auditor in a parallel fleet. Your job: for a slice of CBDT validation rules, determine
**whether the software actually enforces each rule, and whether it does so faithfully.** You make **NO code
changes.** You read code and write exactly one Markdown report. Nothing else.

## Why this matters
The software generates the return JSON. A CBDT **Category A** rule that the software does not enforce can let
a defective/invalid return be produced that the e-Filing portal rejects. We must find every rule that is
missing or wrongly enforced. Be strict and literal. When unsure, flag it — a false GAP is cheap, a missed
GAP is the whole point of this audit.

## Your inputs (given in your task prompt)
- **form** (ITR-3 or ITR-4), **category** (A/B/D), **serial range lo–hi**.
- **root** — the form's working directory (all paths below are relative to it unless absolute).
- **slice** — a JSON file `[{n,cat,text,clean?}, …]` for your exact serials. `text` is the PDF parse (may be
  noisy / have adjacent-column bleed); `clean` (when present) is a cleaner extraction. Prefer `clean`.
- **pdf** + **pdf_pages** — the source PDF and the page range holding your serials. If a rule's text is
  garbled or ambiguous, **Read those PDF pages** to recover the exact rule before you judge it.

## Where enforcement lives
Rules are encoded in the form's rule engine, split across these files under `root`:
- `forms/<form>/src/60_rules.js` — main `runRules(I,S_)`; calls `A(n,cond,msg)` (Category A) and
  `Dd(n,cond,msg)` (Category D). `cond` is the **"valid" assertion** — the rule FIRES (is violated) when
  `cond` is false. `n` is the rules.json serial.
- `forms/<form>/src/61_rules_g0.js … g5.js` — additional `ruleset(function(I,S_,A,Dd){…})` batches, same
  `A(n,…)`/`Dd(n,…)` calls.
- Category B has **no dedicated call** — B rules are generally not encoded (CBDT Category B = "may be treated
  as defective", advisory). For a B rule, judge whether it *ought* to be enforced or is informational.

Some rules are enforced **by construction** rather than by an `A()` call — e.g. a total that the engine
auto-computes into a green (untypeable) cell can never be violated, or a value constrained to a schema enum /
dropdown. To decide this, you may `Read` the relevant engine/section file
(`forms/<form>/src/70_sec_*.js`, `10_state.js`, etc.). Cite what enforces it.

## Method (per serial in your slice)
1. Get the rule's true meaning: read `clean`/`text`; if unclear, Read the PDF pages.
2. `Grep` the rule source for the serial: pattern `A(<n>,` or `Dd(<n>,` (regex-escape the paren, e.g.
   `A\(<n>,`). Search across `forms/<form>/src/60_rules.js` and `forms/<form>/src/61_rules_*.js`.
3. If found → read the `cond` and `msg`. Decide if `cond` **faithfully** implements the rule:
   - **OK** — condition correctly captures the rule (right fields, right comparison, right guard).
   - **WEAK** — encoded but partial/wrong: misses a case, wrong field, wrong threshold, wrong sign, guard too
     narrow/broad, or the message contradicts the condition. Explain precisely what is wrong.
4. If not found → decide:
   - **STRUCT** — enforced by construction (auto-computed green cell, schema enum, dropdown). Cite the file
     and mechanism.
   - **NA** — not applicable to this form/assessee type (explain why the rule can never apply here).
   - **GAP** — genuinely not enforced and it should be. This is a real hole. Say what check is missing and,
     in one line, what condition would enforce it (do NOT write code into the form).
5. Record evidence as `file:line` (the actual line of the `A(n,…)` call, or of the structural enforcement).

## Output — write EXACTLY ONE file, at the `out` path given to you
Markdown, in this shape (keep the columns; keep the fenced `tsv` block — it is parsed by a script):

```
# <form> · Category <cat> rules <lo>–<hi> — enforcement audit
read-only · opus auditor

| Serial | Encoded | Where | Verdict | Rule (short) | Finding |
|---|---|---|---|---|---|
| <cat><n> | yes/no | 60_rules.js:NN | OK/WEAK/GAP/STRUCT/NA | <=8-word gist | precise finding |
… one row per serial …

## Machine-readable
​```tsv
<n>	<VERDICT>	<file:line or blank>	<short finding, no tabs>
… one line per serial, VERDICT ∈ OK|WEAK|GAP|STRUCT|NA …
​```

## Summary
counts: OK=_ WEAK=_ GAP=_ STRUCT=_ NA=_ (total <count>)
GAPs: <list serials>
WEAKs: <list serials>
```

## Hard rules
- **Do not edit any file except writing your one report at `out`.** No code changes, no fixes.
- Every serial in your slice appears exactly once in the table and once in the tsv block. Do not skip any.
- Judge from the sources, not from assumption. Cite `file:line`. When the rule text is unreadable, read the
  PDF — do not guess.
