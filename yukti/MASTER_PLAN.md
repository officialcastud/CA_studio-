# Yukti — MASTER PLAN for building an ITR form to portal-grade, fast

This is the single, end-to-end playbook for building one Income-tax return form (ITR-N, A.Y. 2026-27)
as an offline single-file HTML builder that the e-filing portal will accept — **and** proving every CBDT
validation rule is enforced. It folds together three things we learned the hard way on ITR-2, ITR-3 and
ITR-4:

1. the **build pipeline** (Phases 0–7, gated), and
2. the **rule-enforcement pass** (audit → fix → engine-correctness → census), and
3. the **agent orchestration** — who to launch, how many, which model, how smart, read-only vs write,
   and the discipline that keeps parallel agents from colliding.

Read `CLAUDE.md` (the constitution) and `PIPELINE.md` (the build procedure) first; this document is the
layer on top that tells you **how to run it with agents and how to finish the rule work to 0-missing.**

> The one rule above all: **three sources must agree at once** — the utility (`.xlsm`), the schema
> (`.json`), and the validation-rules (`.pdf`). Every defect we ever shipped came from reading one and
> not the other two.

---

## 0. What you are given, and what you must produce (per form)

### Inputs — the three CBDT sources (nothing starts without all three; this is Gate 0)
| File | What it is | Used for |
|---|---|---|
| `sources/ITR-N/ITRN_AY_26-27_Vx.x.xlsm` | the official Excel utility | every sheet, hidden flag, dropdown, formula, VBA — the *method* |
| `sources/ITR-N/ITRN_<ver>.json` (schema) | the JSON schema the portal accepts | every key, block, enum, cardinality — the *shape* |
| `sources/ITR-N/ITRN_Validation_Rules_AY26-27.pdf` | the CBDT validation rules | Category A / B / D rules with serial numbers — the *law* |

If any is missing, write `logs/ITR-N/BLOCKED.md` saying exactly what is needed and stop. Never invent a
source to get past a gate.

### Outputs — the deliverable set (what "done" looks like)
- `forms/ITR-N/Yukti_ITRN.html` — the single self-contained file (no external refs; one `<style>`, one `<script>`).
- `tests/ITR-N/state.js` + `figures.json` + the S SUDHIR return JSON (`.json` + `.working.json`).
- `books/ITR-N/BUILD_RECORD.md`, `REGIME.md`, and the per-sheet books.
- `logs/ITR-N/rule_audit/` — `RULES_ALL.md`, per-batch audit reports, `MASTER_COVERAGE.md`,
  `TICK_SHEET.md`, `FIX_RECORD.md`, `CENSUS_SUMMARY.md`, and `census/`.
- All Gates 0–7 green; PR to `main` (draft) with the enforcement census table in the body.

---

## 1. The gates are the only definition of progress

`python3 tools/gates/gate.py --form ITR-N --gate K` (or `--gate all`) returns 0 on green. A phase is not
done until its gate is green **and** every earlier gate is still green. Never edit a gate to pass.

| Gate | Proves |
|---|---|
| 0 | sources extracted, rule numbering dense |
| 1 | structure / section map |
| 2 | shell boots, saves |
| 3 | books cover sheets + schema |
| 4 | form syntax, export, schema-valid, round-trips byte-identical |
| 5 | coverage — every schema block referenced |
| 6 | department rules — 0 Category-A rules fire on the lawful client |
| 7 | complete client, arrays filled, hand figures to the rupee |

**Two traps that cost us time — encode them into muscle memory:**
- **Gate-6 STALE-summary trap.** `gate6()` reuses `logs/ITR-N/gate5run/summary.json` if present. After any
  rule change you MUST re-run Gate 5 first, then Gate 6, or you are grading against an old build.
  `--gate all` does this in order; a bare `--gate 6` may lie.
- **Never assemble or gate while a subagent is mid-edit.** Let the wave finish; the CEO assembles once.

---

## 2. The agent model (how we actually run this)

One **CEO** (this session's model) supervises, dispatches, integrates, runs gates, and is the only one who
declares a phase done or commits. Everyone else is a subagent doing one bounded job. Two hard constraints
we hit:

- **Concurrency cap = 20** (`CLAUDE_CODE_MAX_CONCURRENT_SUBAGENTS`). Launch in waves of ≤20 and refill
  slots as they free.
- **Parallel-safe = one new file each.** When many agents write at once, **each writes exactly ONE new,
  disjoint file** (a new `61_rules_fix_NN.js`, a new census slice, a new book). No two agents ever touch
  the same file. The CEO integrates by assembling — never by merging half-written files.

### Model tiering (what we learned pays off)
| Work | Model | Why |
|---|---|---|
| **Audit / census** (read-only judgement over rule text vs code) | **Opus, low reasoning** | needs deep, careful reading and honest classification; 50 rules/agent keeps accuracy ~100% |
| **Fix encoding** (write a guarded `A()`/`Dd()` from a rule's text) | **Fable 5.1** | mechanical, schema-path-driven; cheap and fast; the gate is the guard, not the model |
| **Section builders / integrator / rules-enforcer** (build the form) | **strongest available** | cross-section seams, compute order, engine formulas |
| **Sheet readers** (dump a sheet to a book) | **cheap model** | the Gate-3 check is the guard |
| **CEO** | session model | decides, integrates, gates, commits |

**How smart each agent must be:** the read-only judgement agents (audit, census) must be smart enough to
tell "a live check fires" from "a check exists but is dead/vacuous" — that is the whole game (see §6, the
A346 dead-guard). The fix agents only need to translate a sentence of rule text into one guarded
conditional against a known schema path — give them the path and they don't need to be clever. Never let a
cheap model make the enforced/not-enforced *call*; never waste a strong model on a mechanical `A()` write.

---

## 3. MODULE A — BUILD the form (Phases 0–7)

The roles are defined in `.claude/agents/`; this is how many and in what order.

| Phase | Agent(s) | Count | Model | Reads | Writes | Gate |
|---|---|---|---|---|---|---|
| 1 Structure | structure-architect | 1 | strong | every sheet name + hidden flag | `structure.md`, `section_map.json` | 1 |
| 3 Books | sheet-reader | **1 per sheet**, in waves of ≤20 | cheap | its sheet dump + schema block | `books/ITR-N/<Sheet>.md` | 3 |
| 3 Verify | sheet-verifier | 1 per sheet (independent) | cheap | book vs sheet dump | `logs/ITR-N/verify_<Sheet>.md` | 3 |
| 4 Sections | section-builder | **1 per section**, own worktree | strongest | the books only | `forms/ITR-N/src/30_sections_<id>.js` + engine/export/import/checks | 4 |
| 4–5 Assemble | integrator | 1 | strongest | all sections | assembled HTML, fixes seams | 2,4,5 |
| 6 Rules (first pass) | rules-enforcer | 1 (or split) | strongest | `rules.json` / `RULES_ALL.md` | `60_rules.js`, `61_rules_g*.js` | 6 |
| 7 Client | test-client | 1 | strong | rules + every fillable box | `tests/ITR-N/state.js`, `figures.json` | 7 |

Discipline: item numbers come from the rules document, never from counting rows; every live row needs a
schema key or it is dropped and logged; after every splice, grep for duplicate writers (the gate does
this); verify one figure per schedule by hand to the rupee.

Output of Module A: **all gates 0–7 green** with a first-pass rule set. This is where ITR-3/ITR-4 were when
the real rule work began — and the first pass only had ~63% of Category-A rules coded (ITR-3 665/999,
ITR-4 209/411). That is *not* done. Modules B–E take it to 0-missing.

---

## 4. MODULE B — RULE AUDIT (read-only, the checklist)

**Goal:** for every single CBDT rule, decide honestly whether the software enforces it — with zero rules
skipped. This is the checklist the user asked for.

### Step B0 — extract the rule text
Read the validation-rules PDF into `logs/ITR-N/rule_audit/RULES_ALL.md`, one line per serial
(`- **A123** — <verbatim text>`). Keep Category A (blocking), B ("may be treated as defective u/s 139(9)",
advisory), D (advisory). This is the master list every later agent reconciles against.

### Step B1 — slice and launch (50 rules per head)
- **Agent count = ceil(total_rules / 50).** ITR-3: 1056 → 22 agents. ITR-4: 426 → 9 agents.
- **Model: Opus, low reasoning. READ-ONLY — no agent edits any code.** 50 rules per head is the sweet spot
  for ~100% accuracy; do not raise it.
- Each agent gets one contiguous serial slice (`A_0001-0050.md` …), reads the rule text + the current
  engine (`60_rules.js`, `61_rules_g*.js`, and the section engines/exporters the rule touches), and writes
  **one report file** `logs/ITR-N/rule_audit/A_XXXX-YYYY.md`.
- Each rule gets exactly one verdict:
  - **OK** — a live, non-commented check faithfully enforces it.
  - **WEAK** — a check exists but is incomplete / vacuous / keyed wrong (`||true`, wrong enum, wrong field).
  - **GAP** — offline-checkable, has a schema field, but nothing enforces it.
  - **STRUCT** — enforced by construction (computed green cell / mandatory blank-less field).
  - **NA** — not offline-checkable (portal/DB/AIS, or a pure advisory with no violable condition).
- The report is a table + a machine-readable TSV (`serial<TAB>verdict<TAB>where<TAB>finding`) so it
  consolidates cleanly.

### Step B2 — consolidate
CEO runs `tools/rule_audit_consolidate.py` → `MASTER_COVERAGE.md` with the tallies
(`OK / WEAK / GAP / STRUCT / NA`) and the full GAP + WEAK lists. Sanity check: the five buckets must sum to
the total rule count. This master list is the backlog for Module C.

**Contract for these agents** lives in `logs/CHECKER_INSTRUCTIONS.md` — hand it to each one verbatim.

---

## 5. MODULE C — FIX PASS (parallel-safe, write)

**Goal:** turn every GAP and WEAK from `MASTER_COVERAGE.md` into a live guarded check — without any two
agents colliding.

- **Agent count = number of disjoint fix files** you split the backlog into (we used ~7–9 per form:
  `61_rules_fix_01.js … 61_rules_fix_09.js`). Group by schedule so each file is coherent (CG in one, OS in
  one, deductions in one …).
- **Model: Fable 5.1.** Each agent is given: its slice of GAP/WEAK serials with their rule text, the schema
  paths (copied from the section exporters), and the rule-helper API.
- **Each agent writes exactly ONE new file** `61_rules_fix_NN.js` — a `ruleset(function(I,S_,A,Dd){ … })`
  batch. **No existing file is edited, so the batches never collide.** Sort order: `61_rules_fix_NN.js`
  sorts after `60_rules.js` and before `61_rules_g0.js`, so it assembles in.
- The rule API: `A(n,cond,msg)` fires (blocks) when `cond` is FALSE; `Dd(n,cond,msg)` is the advisory
  (Category B/D). **Every check must be guarded to no-op on absent/empty data** — it stays silent on a
  lawful return. A throw inside a batch silently skips the rest of that batch (try/catch in `runRules`), so
  guard every field read (`RG(...)`, `N(...)`, `arr(...)`).
- Category-B/D rules reuse the B/D number as the `A()`/`Dd()` serial (e.g. B6→`A(6)`, B1→`Dd(1)`); loop-
  coded families put the serials in a `[[n,…],…].forEach(([n,…])=>A(n,…))`.

**Contract for these agents** lives in `logs/FIX_INSTRUCTIONS.md`.

### CEO integration (only the CEO does this)
1. Wait for the whole wave to finish (never assemble mid-edit).
2. `tools/assemble.py --form ITR-N`.
3. Run Gate 5 then Gate 6 then Gate 7 (order matters — the STALE trap).
4. If a new check fires on the lawful client, it is either a real defect in the client (fix the client per
   rule 14) or the check is wrong (fix the check) — decide with the isolation harness (§7), never by
   disabling the check.
5. Commit per green gate; push to `claude/itr-N`.

---

## 6. MODULE D — ENGINE-CORRECTNESS (the "held" rules)

Some rules **cannot** be honestly enabled until the engine computes the right number — enabling the check
would just fire on a correct return. These are "held" until the engine is fixed. Examples we actually hit:

- **ITR-3 foreign-tax relief (A966/A967):** the tax engine read dead fields, so §90/§91 relief (₹1,25,000)
  was never applied — the taxpayer was overcharged. Fixed the engine to read the live FA values; then the
  reconciliation checks pass.
- **ITR-3 Schedule SI & CG Table F vs BFLA:** special-rate income and its tax were computed pre-set-off.
  Decoupled the compute order (`corder`) so SI runs after the loss engine, and scaled Table F quarters to
  post-BFLA (BFLA col 5); then A870/A426/A452 reconcile.
- **ITR-4 standard deduction 16(ia):** engine used `min(75000,…)` in both regimes; old regime cap is
  ₹50,000. Fixed to `min(isNew()?75000:50000,…)`; then A143 passes and the client figures re-derive.

Rule of thumb (constitution rule 6): **encode a rule from its text; if the engine disagrees, the engine is
wrong until proven otherwise.** When you change a canonical figure to obey the rule book, re-derive the
test client's figures to the rupee and record it in `FIX_RECORD.md`. Keep GTI/TI/net-tax invariant unless
the rule book says otherwise.

Output of Modules C+D: `TICK_SHEET.md` — every GAP/WEAK serial ticked with the fix file it landed in, plus
the handful of documented offline-impossible residuals.

---

## 7. MODULE E — CENSUS (independent re-count — this is what catches the silent holes)

**Do not trust the tick sheet.** The audit and fix agents can both miss the same thing. The census is a
**fresh, independent re-count of every rule against the shipped HTML**, by different agents, whose only job
is to bucket each serial and prove **Missing = 0.**

- **Agent count = ceil(total_rules / ~350)**, i.e. 2–3 per form (ITR-3: 3 agents over 1056; ITR-4: 2 over
  424). Disjoint serial ranges. Read-only. Model: Opus.
- Each agent reads the rule text, the prior audit verdicts, **and the CURRENT engine (including the fix
  files, and the inlined build in `Yukti_ITRN.html`)**, and buckets every serial into
  **ENFORCED / NA / OFFLINE-IMPOSSIBLE / MISSING**, writing `census/CENSUS_<range>.md` with a TSV.
- **MISSING must come back empty.** If it doesn't, it is a real hole — fix it, rebuild, re-gate.

### What the census caught that everything else missed — the A346 lesson
ITR-4 A346 (co-owned property shares must total 100%) had a live `A(346)` — but its guard tested
`PropCoOwnedFlg==="Y"` while the exporter writes the enum `"YES"`, so it **never fired**. Grep found it;
the tick sheet counted it; only an agent that traced the guard value against the exporter caught that it
was **dead code**. A co-owned 50%+20%=70% return passed every check. We re-added it with the correct guard.
**This is why the census exists and why its agents must be smart:** the skill is distinguishing "a check is
present" from "a check actually fires on the input that should trip it."

### The verification chain each census agent must confirm
fix file → `ruleset()` registers into `_RULEBATCHES` (`08_registry.js`) → `runRules()` iterates them
(`60_rules.js`) → `assemble.py` globs `src/*.js` sorted → the check is present in the shipped
`Yukti_ITRN.html`. If any link is broken, the rule is not really live.

Output: `CENSUS_SUMMARY.md` — the reconciliation table (Enforced / NA / Offline-impossible / **Missing 0**).

---

## 8. Buckets that are legitimately not "enforced" (and why that's correct)

Be honest and precise; the portal does these, and so does the official CBDT utility:

- **OFFLINE-IMPOSSIBLE** — needs an external database or a schema field that doesn't exist: IFSC-vs-RBI
  master (format *is* enforced), name/DOB-vs-PAN database, or a value the schema has no slot for (e.g.
  ITR-4 original-return section, 10(23EE) sub-category). Left to the portal by design.
- **NA** — informational nudges and portal-held facts: Aadhaar/PAN linking, prior-return/notice status,
  uploader identity, AIS/26AS checks, and pure "kindly fill X" advisories with no violable condition.

Everything **else** — every rule that is offline-checkable and has a field to test — must be **ENFORCED**,
and deduction limits are additionally **capped structurally** in the engine (`allowed = min(claim, cap)`),
so a user can't benefit past a ceiling even if they type more.

---

## 9. The agent roster at a glance (copy this to plan the next form)

| Wave | Purpose | Model | How many | R/W | One-file-each? | Output |
|---|---|---|---|---|---|---|
| Structure | map sheets | strong | 1 | W | — | `section_map.json` |
| Sheet-read | book each sheet | cheap | 1/sheet (≤20/wave) | W | ✅ | `books/…` |
| Sheet-verify | independent re-read | cheap | 1/sheet | R | ✅ | `verify_…` |
| Section-build | build schedules | strongest | 1/section | W (own worktree) | ✅ | `30_sections_*.js` |
| Integrate | seams, compute order | strongest | 1 | W | — | assembled HTML |
| **Audit** | classify every rule | **Opus low** | **ceil(rules/50)** | **R** | ✅ | `rule_audit/A_*.md` |
| **Fix** | encode GAP/WEAK | **Fable 5.1** | **# fix files (~7–9)** | **W** | ✅ | `61_rules_fix_NN.js` |
| Engine-fix | held rules / real bugs | strongest | 1–2 | W | — | section engines |
| **Census** | prove Missing=0 | **Opus** | **ceil(rules/350) (2–3)** | **R** | ✅ | `census/CENSUS_*.md` |
| Test-client | lawful client to the rupee | strong | 1 | W | — | `tests/…` |

**CEO (you)** never writes a book or a rule batch itself — it dispatches, assembles, gates, decides,
commits, and does the cross-cutting engine fixes.

---

## 10. Pitfalls log (every one of these bit us once — don't repeat)

1. **Gate-6 STALE summary** — re-run Gate 5 before Gate 6 after any rule change.
2. **Concurrency cap 20** — launch in waves, refill as slots free.
3. **Assembling mid-edit** — never; wait for the wave, then the CEO assembles.
4. **Serial reuse** — the same serial number can be used for two unrelated rules (e.g. ITR-3 459/463); a
   grep hit is not proof the *right* rule fires. Read the message text.
5. **Loop-coded false negatives** — `[[425,…],…].forEach(([n,…])=>A(n,…))` won't match `grep 'A(425'`; the
   serial lives in the array. Verify inside the loop.
6. **Dead guard / enum mismatch (A346)** — a check whose guard value never matches the exporter's enum is
   dead. Trace guard literals against the exporter, not just presence.
7. **Category-B/D collectors** — encoded as `Dd()`/`A()` reusing the B/D number; disambiguate by message
   text, not serial, because numbers collide across A/B/D.
8. **Throw kills a batch silently** — guard every read; `runRules` try/catch swallows the rest of the batch.
9. **Wrong base branch** — develop on `claude/itr-N`; `main` is a different (Netlify) project. PRs target
   `main` only at Gate 7.
10. **Isolation harness** — keep a `/tmp/verify_rules.js` with the real shell helpers to see per-file throws
    and actual firings independent of the gate, when a gate result looks too clean or too red.

---

## 11. Fast path for the next ITR (the whole thing in order)

1. Drop the three sources → Gate 0.
2. Module A: structure → sheet-read/verify (waves) → section-build (worktrees) → integrate → first-pass
   rules → test-client. Gates 0–7 green.
3. Module B: extract `RULES_ALL.md`; launch `ceil(rules/50)` **Opus read-only** audit agents (50 each);
   consolidate → `MASTER_COVERAGE.md`.
4. Module C: split GAP+WEAK into ~7–9 files; launch that many **Fable** agents, **one new file each**;
   CEO assembles + gates 5→6→7; commit.
5. Module D: fix the held/engine-bug rules; re-derive client figures to the rupee; `TICK_SHEET.md`.
6. Module E: launch 2–3 **Opus read-only** census agents; **prove Missing=0**; fix anything they find
   (there will usually be one A346-style dead check); rebuild; `CENSUS_SUMMARY.md`.
7. Sign-off: gates 0–7 green, Missing=0, PR to `main` (draft) with the census table in the body.

**Estimated agent budget per large form (~1000 rules):** ~22 audit + ~9 fix + ~3 census + the build waves
≈ 34 rule-work agents; per small form (~400 rules): ~9 + ~7 + ~2 ≈ 18. All within the cap of 20 concurrent
if launched in waves.

---

_This plan is the distilled experience of ITR-2 (reference), ITR-3 (1056 rules → 1024 enforced, 0 missing)
and ITR-4 (424 rules → 408 enforced, 0 missing, A346 dead-guard caught by the census). Apply it verbatim to
ITR-5/6/7; only the sources and the per-form facts change._
