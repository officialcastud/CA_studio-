# DEEP HANDOFF PROMPT — Build the Previous‑Year (A.Y. 2025‑26) ITR utilities

> Paste everything below (from "MISSION" onward) into a fresh Claude Code session.
> It is self‑contained: paths, tools, method, the exact signing values already
> extracted, the verification bar, current status, and every known pitfall.

---

## MISSION

Build offline, single‑double‑click **A.Y. 2025‑26 (F.Y. 2024‑25)** income‑tax‑return
builders that are **exact functional replicas of the CBDT offline utilities** —
ITR‑1, ITR‑2, ITR‑3, ITR‑4 first (ITR‑5/6/7 later). Each must:

* compute every figure exactly as the CBDT utility does,
* emit an **export JSON that validates against the real A.Y. 2025‑26 schema only**,
* pass **every A.Y. 2025‑26 CBDT validation rule** (Category A = reject, D = notice),
* produce a **portal‑signable digest** using that year's real signing constants,
* behave identically to the current‑year (A.Y. 2026‑27) build in the UI.

"Done" for a form = all five, independently verified (see **DEFINITION OF DONE**).

---

## NON‑NEGOTIABLE CONSTRAINTS

1. **Git branch:** develop and push ONLY on `claude/blissful-faraday-ui8eub`
   (repo root `/home/user/ca-ay2025`). Never push elsewhere without explicit
   permission. Open/keep a **draft PR** for the branch.
2. **UI is frozen.** Front‑end, layout, labels, inputs, help text, styling — must
   be **byte‑for‑byte behaviourally identical** to the current‑year build. Only
   *backend* logic (compute / export / rules / signing) changes between years.
   If a current‑year refinement changes user‑visible text, KEEP the existing
   text; port only the backend behaviour.
3. **File layout = multi‑file split, HTML only.** Each form lives in its own
   folder: `index.html` (thin shell: `<link>` css + ordered classic
   `<script src="js/NN_*.js">`) + `js/NN_*.js` (numeric load order) + `css/`.
   **No ES modules. No fetch. No network.** Data is embedded as JS globals so
   the page works from `file://` on a double‑click. `build.py` in each form
   regenerates `index.html`'s script list **and** a concatenated single‑file
   `Yukti_ITR<n>.html`. The split must be **output‑preserving**: the single‑file
   build's export must be byte‑identical to the multi‑file build's.
4. **Form isolation.** When working on one form, touch ONLY that form's folder.
   Never read or edit another form to "borrow" logic — each form has its OWN
   utility base and OWN difference docs. Do not assume ITR‑2's deltas equal
   ITR‑1's.
5. **Never guess signing or schema.** Extract them from the real A.Y. 2025‑26
   `.xlsm` utility (see **SIGNING** and **SCHEMA**). If a required input is
   missing, STOP and ask the user for that year's file — do not fabricate.
6. **Attribution** (commits): end every commit message with
   `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>` and
   `Claude-Session: <this session's claude.ai/code link>`.
   PR body ends with `🤖 Generated with [Claude Code](https://claude.com/claude-code)`
   + the session link. **Never** put any model identifier in commit messages,
   PR text, code, or comments.
7. **Verify every "green" yourself.** If you delegate to sub‑agents, re‑run the
   full verification bar independently before committing. A sub‑agent's report is
   not proof.

---

## THE METHOD — diff‑port, per form

The current‑year (A.Y. 2026‑27) builds already exist and are complete. Do NOT
rebuild from scratch. For each form:

* **Step 0 — Base.** Start from the current‑year (A.Y. 2026‑27) build for that
  form. **Prefer the user's authoritative production HTML** if supplied for that
  form (it carries real signing + refinements); otherwise the repo base. Confirm
  which you're on by checking the signing block (real vs stub).
* **Step 1 — Split** the single HTML into `index.html` + `js/*.js` + `css/` at
  safe column‑0 boundaries (never mid‑statement). Add `build.py`. Prove
  output‑preserving (single‑file export == multi‑file export).
* **Step 2 — Apply the A.Y. 2025‑26 deltas** from the difference reports
  (`itr_tools/reports/ITR-<n>_AY2026-27_to_AY2025-26.{md,json}`):
  * **3a REMOVE / 3b ADD / 3d CHANGE** — schema leaf changes.
  * **4a DISABLE / 4b ADD / 4c CHANGE** — validation‑rule changes. (4f renumber
    is cosmetic; serials are internal and never exported — skip.)
  * **Year overlay** in `js/05_year_config.js` (see that file for ITR‑1..4): AY
    string, slab table (F.Y. 2024‑25 new‑regime bands), §87A thresholds, due
    dates, 234A/B/C windows, carry‑forward loss years, AMT‑credit years, and the
    **signing constants** (see below).
  * **Budget‑2024 CG cutoff (23‑Jul‑2024)** falls WITHIN F.Y. 2024‑25, so the
    before/after‑23‑Jul capital‑gains split is retained for AY 25‑26 (ITR‑2/3).
* **Step 3 — Signing** (see **SIGNING**).
* **Step 4 — Verify** (see **VERIFICATION BAR**) both regimes; commit; push.

---

## INPUTS & WHERE THEY ARE

* **Repo (work here):** `/home/user/ca-ay2025` — forms under
  `AY2025-26/forms/ITR-<n>/`. Port tracker + method notes:
  `AY2025-26_PORT/PLAN.md`. This prompt: `AY2025-26_PORT/NEXT_SESSION_PROMPT.md`.
* **Difference reports (AY26‑27 → AY25‑26):**
  `AY2025-26_PORT/itr_tools/reports/ITR-<n>_AY2026-27_to_AY2025-26.{md,json}`
  (+ `_chunks/` for large ones).
* **Derived schema leaf inventories:**
  `AY2025-26_PORT/itr_tools/reports/data/fields_ITR-<n>_AY2025-26.tsv`
  (produced by `itr_diff.py` = AY26‑27 schema + difference docs — **derived, must
  be re‑verified against the real utility schema**).
* **Derived rule inventories:** `.../data/rules_ITR-<n>_AY2025-26.json` (derived).
* **Current‑year (AY26‑27) Excel utilities on disk** (source of current‑year
  signing, for reference):
  `/home/user/itr1_verify/util/ITR1_AY_26-27_V1.2.xlsm`, and under `/tmp/`:
  `itr3src/…ITR3_AY_26-27_V1.3.xlsm`, `itr4x/ITR4_AY_26-27_V1.2.xlsm`, etc.
* **A.Y. 2025‑26 Excel utilities** (the real signing + schema source) — user
  uploads into `/root/.claude/uploads/<session>/`. Known so far:
  `…-ITR1_AY_25-26_V1.7.zip` → `ITR1_AY_25-26_V1.7.xlsm`. **Ask the user for
  ITR‑2/3/4 AY 25‑26 `.xlsm` if not present.**
* **A.Y. 2025‑26 validation‑rules PDFs** — NOT yet provided (uploads have only
  AY26‑27 rule PDFs). **Ask the user for the AY 25‑26 rule PDFs (ITR‑1..4)** to
  run a real rule census.
* **Verification harness:** `/home/user/itr1_verify/tools/harness/run_form.py`
  and `roundtrip.py` (Playwright/Chromium; run from `/home/user/itr1_verify`).
* **Schema conformance:** `AY2025-26_PORT/itr_tools/schema_conformance.py`.
* **VBA extraction:** `python3 -m oletools.olevba <file.xlsm>` (install with
  `pip install -q oletools` if missing).

---

## SIGNING — extract from the real A.Y. 2025‑26 `.xlsm`, never guess

The CBDT digest = HMAC‑SHA256 over the **compact** JSON with `Digest:"-"`,
re‑hashed `HashIteration` times, base64; then substitute into `CreationInfo.Digest`
and write **compact** (the portal recomputes over the uploaded bytes, replacing
Digest with "-"). All constants live in the utility's `GenerateJson.bas`.

**These constants are YEAR‑SPECIFIC and change every year — key, iterations,
version and SW id all differ.** Extract the **active (uncommented)** lines:

```
python3 -m oletools.olevba <ITR<n>_AY_25-26_*.xlsm> 2>/dev/null \
 | grep -aE "getSWVersionNo|getSWCreatedBy|getJSONCreatedBy|getHashKey|getHashIteration" \
 | sed 's/^[[:space:]]*//' | grep -avE "^'"
```

**Already extracted — A.Y. 2025‑26 (from `ITR1_AY_25-26_V1.7.xlsm`):**

| Constant | A.Y. 2025‑26 value | (A.Y. 2026‑27 for contrast — do NOT use) |
|---|---|---|
| `getHashKey` | **`LO3QtH59fGuVaETa`** | `HZX4oKH11zARYIb2` |
| `getHashIteration` | **`1978`** | `1988` |
| `getSWCreatedBy` / `getJSONCreatedBy` | **`SW90002526`** | `SW90002627` |
| `getSWVersionNo` (ITR‑1) | **`R8`** | R3 |
| AssessmentYear / SchemaVer | `2025` / `Ver1.0` | 2026 / `Ver1.0` |

Pattern confirmed from the VBA history: **`SWCreatedBy` = `SW9000` + startYY +
endYY** (AY24‑25=`SW90002425`, AY25‑26=`SW90002526`, AY26‑27=`SW90002627`).
**HashKey, HashIteration and SWCreatedBy are shared across all forms within a
year; `SWVersionNo` differs per form** — so extract each form's own `.xlsm` for
its `SWVersionNo` (ITR‑1 = R8; ITR‑2/3/4 = read from their files).

**Wiring:** put `HASH_KEY`, `HASH_ITER`, `SW_VERSION`, `SW_CREATED` through
`js/05_year_config.js` (the single per‑year switch), define `computeDigest()` in
the engine, make `exportJSON()` async, hash compact + write compact, and set
`SWVersionNo`/`SWCreatedBy`/`JSONCreatedBy`/`Digest` in `buildITR<n>()`. crypto
.subtle works under `file://` (Chromium treats it as a secure context) and in the
Playwright harness. The exported `Digest` must be a **44‑char base64** string,
never `"-"`.

---

## SCHEMA — verify the derived schema against the real utility schema

The `fields_ITR-<n>_AY2025-26.tsv` inventories are **derived** (AY26‑27 + diff
docs). Before claiming schema correctness for AY 25‑26:

1. Extract the **real** A.Y. 2025‑26 schema from each `.xlsm` (embedded in the
   utility — inspect worksheets / VBA / any bundled schema JSON; `olevba` plus
   unzipping `xl/` inside the `.xlsm` exposes it).
2. Diff the real schema's leaf set against the derived TSV. Reconcile every
   difference (a mismatch means the difference docs were incomplete — fix the
   TSV and re‑port the affected leaves).
3. Re‑run `schema_conformance.py` against the reconciled TSV. Only then is
   "schema‑only, verified" true against the real year.

Note: the CBDT schema permits `Digest` = `-|.{44}` and `SWCreatedBy` =
`[S][W][0-9]{8}`, so a stub passes schema conformance — schema‑CLEAN does NOT
prove the return is portal‑signable. Signing is a separate gate.

---

## RULES — census against the official A.Y. 2025‑26 rule source

"All CBDT rules present and imposed" is only true once censused against the
**official A.Y. 2025‑26 validation‑rules PDFs** (get them from the user). For
each form: build the rule‑number census from the PDF, map each to the encoded
rule in `js/60_rules.js` (or `61_rules_*`), and prove **0 MISSING**. Category A
must block export; Category D must warn only. The derived
`rules_ITR-<n>_AY2025-26.json` is a starting point, not proof.

---

## CONDITIONAL LOGIC — must be correct and tested

Every option that changes the return must be wired AND exercised in a test state:

* **Regime (new vs old, s.115BAC):** under the new regime, drop all old‑regime
  Chapter VI‑A deductions from the export (only 80CCD(2)/80CCH survive) and use
  the new‑regime slabs/§87A; the export JSON must contain schema leaves only for
  the selected regime. (ITR‑2 reference: VIA total must fall e.g. ₹14,42,000 →
  ₹96,000 when switching to new.)
* **Residential status (RES / RNOR / NRI):** NRI ⇒ no CG indexation
  (rule 570 zeroes indexed cost), no Schedule‑TR relief (rules 526/527), Schedule
  ‑FA/FSI/TR gating, DTAA special‑rate paths. Exercise each status.
* **Type of person (Individual / HUF / Firm …):** name vs org fields, age‑based
  slabs (Individual only), applicable schedules. ITR‑1 = resident Individual
  only; ITR‑2 = Individual/HUF; ITR‑4 = Individual/HUF/Firm (presumptive).
* Build a small **test matrix** per form (regime × status × person‑type where
  applicable) and confirm figures + 0 Category‑A for each.

---

## LEAF COVERAGE

Every schema leaf must be **reachable** — either entered via a UI field or
computed by an engine. Run the leaf‑coverage audit per form (not just
schema‑conformance): list schema leaves, confirm each has an enter‑or‑compute
path, and that nothing old‑regime‑only leaks into a new‑regime export.

---

## VERIFICATION BAR — run for EVERY form, BOTH regimes

Run from `/home/user/itr1_verify`. Replace `<n>` and paths per form.

```
D=/home/user/ca-ay2025/AY2025-26/forms/ITR-<n>
TSV=/home/user/ca-ay2025/AY2025-26_PORT/itr_tools/reports/data/fields_ITR-<n>_AY2025-26.tsv
SC=/home/user/ca-ay2025/AY2025-26_PORT/itr_tools/schema_conformance.py

# OLD regime
python3 tools/harness/run_form.py --form ITR-<n> --html "$D/index.html" --state "$D/tests/state.js"     --out /tmp/v/old
python3 $SC --tsv "$TSV" --json /tmp/v/old/return.json --root ITR.ITR<n>
# NEW regime
python3 tools/harness/run_form.py --form ITR-<n> --html "$D/index.html" --state "$D/tests/state_new.js" --out /tmp/v/new
python3 $SC --tsv "$TSV" --json /tmp/v/new/return.json --root ITR.ITR<n>
# round-trip (use the ACTUAL filed date in tests/state.js, e.g. 25/07/2025 or 28/07/2025)
python3 tools/harness/roundtrip.py --form ITR-<n> --html "$D/index.html" \
   --open /tmp/v/old/working.json --against /tmp/v/old/return.json --filed <DD/MM/2025>
```

**Required results (all of them):**
* harness (both regimes): `boot_errors: []`, `page_errors: []`, `exported: true`,
  `saved: true`, **0 Category A**.
* schema (both regimes): `RESULT: CLEAN` (EMITTED_NOT_IN_SCHEMA / REQUIRED_MISSING
  / TYPE_MISMATCH all 0).
* round‑trip: `round-trip differences: 0`, `page errors: none`.
* signing: `return.json` → `CreationInfo.Digest` is 44 chars (not `"-"`),
  `SWVersionNo`/`SWCreatedBy` = the real AY25‑26 values, `Form_ITR<n>.Description`
  = the full CBDT description.
* figures: sanity‑check GTI/TI/tax/refund against a known‑good golden.

Harness contract: the page must expose globals `buildReturn()` (alias of
`buildITR<n>()`), `runRules()`, `paint()`, `compute()`, state `S` with `S.C.*`
computed fields, and buttons `#b_json` (export) / `#b_save` (working file) /
`#filepick` (import).

---

## CURRENT STATUS (as of this handoff)

| Form | Split | Compute/figures | Schema (derived) | Rules | Signing | Portal‑ready? |
|---|---|---|---|---|---|---|
| ITR‑1 | ✅ | ✅ verified | ✅ CLEAN both regimes | derived only | ❌ stub `SW10000000` (real values **extracted**: R8/SW90002526/LO3QtH59fGuVaETa/1978 — **not yet applied**) | ❌ |
| ITR‑2 | ✅ | ✅ verified | ✅ CLEAN both regimes | derived only | ⚠️ real HMAC applied but with **AY26‑27** constants (WRONG for 25‑26 — must swap to LO3QtH59fGuVaETa/1978/SW90002526 + ITR‑2's own SWVersionNo) | ❌ |
| ITR‑3 | ✅ | ✅ verified | ✅ CLEAN both regimes | derived only | ❌ stub | ❌ |
| ITR‑4 | ✅ | ✅ verified | ✅ CLEAN both regimes | derived only | ❌ stub | ❌ |

Gaps to close for ALL four: (a) real AY25‑26 signing per form; (b) schema
verified against the real utility schema (not just derived); (c) rule census vs
official AY25‑26 rule PDFs; (d) conditional‑logic test matrix. ITR‑5/6/7 for
AY 25‑26: not started.

Committed on branch `claude/blissful-faraday-ui8eub` (PR #7). ITR‑4's `<title>`
still stubs "ITR‑2" — fix.

---

## KNOWN GOTCHAS (learned the hard way)

* `schema_conformance.py` defaults to `--root ITR.ITR1`. **Always pass the right
  `--root ITR.ITR<n>`** or you get false "not in schema" for every leaf.
* Wrong `--filed` date in `roundtrip.py`/state triggers a phantom §234F late‑fee
  and shows fake round‑trip diffs / wrong balance. Use the state's ACTUAL filed
  date. AY 25‑26 due date is 31‑Jul‑2025; advance‑tax/234C windows are F.Y.
  2024‑25.
* Signing requires **compact** hash AND compact write; if you hash compact but
  write pretty (`JSON.stringify(x,null,1)`), the portal recompute mismatches.
* `exportJSON()` becomes **async** once it awaits `computeDigest`; the `#b_json`
  click handler tolerates the returned promise; the harness still gets its
  download.
* Test states authored against a stub base may put a deduction under the wrong
  section (e.g. b9 deemed‑LTCG only permits `DeductionUs54F`, not 54EC). Fix the
  test data to the schema‑correct section; figures must not change.
* Use `Read` before `Edit` (bash `sed`/`cat` viewing doesn't register the file
  as read).
* Don't create pointer/marker files on branches you can't commit to.

---

## HOW TO WORK

* Update `AY2025-26_PORT/PLAN.md` as you go (status tracker + decisions).
* You may fan out **read‑only audit** agents (leaf‑coverage, rule census, schema
  reconciliation) in parallel, but **serialize edits** to the same files and
  keep strict **form isolation** (one agent per form folder). Re‑verify every
  agent's "green" yourself before committing.
* Commit per form with a descriptive message + the attribution footer. Push with
  `git push -u origin claude/blissful-faraday-ui8eub` (retry on network error
  with backoff). Keep the draft PR updated.

## DEFINITION OF DONE (per form)

1. Multi‑file split, offline double‑click, output‑preserving. ✅
2. Schema verified against the **real** AY 25‑26 utility schema — CLEAN both
   regimes. ✅
3. Rule census vs the **official** AY 25‑26 rule PDF — 0 MISSING; A blocks, D
   warns. ✅
4. Real AY 25‑26 signing (per‑form `SWVersionNo`, shared key/iters/SWid) — 44‑char
   digest. ✅
5. Conditional‑logic matrix (regime × residential status × person type) exercised
   — 0 Category‑A each; figures match golden. ✅
6. Leaf coverage: every schema leaf entered or computed. ✅
7. Harness + round‑trip 0‑diff, both regimes. Independently re‑verified. ✅
8. Committed + pushed; draft PR updated; `PLAN.md` reflects DONE.

**When any required input is missing (a form's AY 25‑26 `.xlsm`, or the AY 25‑26
rule PDF), STOP and ask the user — never guess signing, schema, or rules.**
