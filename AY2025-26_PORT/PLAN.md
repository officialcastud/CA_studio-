# AY 2025-26 Multi-File ITR Port — Handoff Plan

> Durable handoff. This branch (`claude/blissful-faraday-ui8eub`, worktree `/home/user/ca-ay2025`)
> is where ALL AY 2025-26 work is committed and pushed. Written before a `/clear`; a fresh
> session should read this file top-to-bottom, then start at §8.

## 0. Fresh-session start-here
1. `cd /home/user/ca-ay2025` (branch `claude/blissful-faraday-ui8eub`).
2. Read this file, then `AY2025-26_PORT/itr_tools/reports/SUMMARY.md`.
3. Begin the first form in the order at §8 (ITR-1). Use its `_chunks/` — **one chunk per step**.
4. Do NOT re-derive any diff; it is already computed (§3). Do NOT rebuild forms from scratch.

## 1. Goal
Build **ITR-1 … ITR-7 for AY 2025-26 (FY 2024-25)** as functional replicas of the CBDT
Excel utilities — **by diff-porting the already-complete AY 2026-27 builds**, not rebuilding.
Same 8-gate Yukti bar as the AY 2026-27 forms.

## 2. Non-negotiable constraints (user-stated)
- **UI / front-end / behaviour = 100% identical** to the AY 2026-27 build. The change is
  *purely the backend file layout*. A user must see **no** difference in the app.
- **HTML only. Entry = `index.html`.**
- Instead of one long standalone `.html`, the code is **split into many small files inside the
  form's own folder** so a future edit touches one tiny file = low token cost.
- **Must still open offline by double-click.** Therefore:
  - Split with **classic `<script src="js/…">` tags in dependency order**.
  - **NO** ES modules (`type="module"`, `import`/`export`), **NO** `fetch()`/XHR of local files
    (both are blocked by browsers over `file://`). Embed all data (enums, tables) as **JS globals**
    inside `.js` files.
- **Form isolation:** only touch the form being worked on. Never edit/read other forms' code.
- **Branch:** commit/push only to `claude/blissful-faraday-ui8eub`. Never push elsewhere without
  explicit permission. Draft PR per form (or one umbrella PR — decide with user).
- Attribution footers on commits/PR bodies per the session's standing instructions.

## 3. Precomputed inputs (already here, zero further token cost to produce)
`AY2025-26_PORT/itr_tools/`:
- `itr_diff.py` — local, no-LLM differ (schema JSON + validation-rule PDF diff). Re-run for
  ITR-5/6/7 once their sources arrive: `pip install pdfplumber rapidfuzz` then
  `python3 itr_diff.py <indir> <outdir> --from 2026-27 --to 2025-26`.
- `reports/ITR-{1,2,3,4}_AY2026-27_to_AY2025-26.md` — full change reports **already done**.
- `reports/ITR-{1,2,3,4}_..._chunks/` — bite-size chunks + `INDEX.md` (token sizes). **Feed one
  chunk per step.**
- `reports/data/rules_ITR-x_AY20xx.json` — parsed rules, both years.
- `reports/data/fields_ITR-x_AY2025-26.tsv` — target-year field inventory.
- `reports/SUMMARY.md` — master delta table.

Delta magnitude (from SUMMARY): ITR-1 78−/84+/9Δ fields, 77 disable/19 add/15 change/1 year rules
(228 identical, 125 renumbered) · ITR-2 57/293/24 · ITR-3 98/342/33 · ITR-4 86/96/10.
Bigger than a year-string swap (esp. ITR-2/3), but fully itemized — apply, don't re-discover.

## 4. AY 2026-27 bases to port FROM (sibling worktrees, persist across /clear)
- Pipeline (`tools/`, `shell/`, `books/`, `PIPELINE.md`, `CLAUDE.md`): in every yukti worktree,
  e.g. `/home/user/ca-itr1/yukti`.
- Per-form AY 2026-27 builds (single-file HTML + modular `src/*.js`):
  - ITR-1 → `/home/user/ca-itr1/yukti/forms/ITR-1`  (branch `claude/itr-1`, PR #6)
  - ITR-2 → `/home/user/ca-itr4/yukti/forms/ITR-2`  (also present in ca-itr5/6/7)
  - ITR-3 → `/home/user/ca-itr4/yukti/forms/ITR-3`  (PR #1)
  - ITR-4 → `/home/user/ca-itr4/yukti/forms/ITR-4`  (PR #2)
  - ITR-5 → `/home/user/ca-itr5/yukti/forms/ITR-5`  (PR #3)
  - ITR-6 → `/home/user/ca-itr6/yukti/forms/ITR-6`  (PR #4)
  - ITR-7 → `/home/user/ca-itr7/yukti/forms/ITR-7`  (PR #5)
- Each form's `src/*.js` is already one file per schedule and registers into globals via `reg({…})`
  — i.e. already compatible with classic multi-`<script>` loading. The split is a natural extension.

## 5. Still needed from the user
- **ITR-5, ITR-6, ITR-7 AY 2025-26 CBDT sources** (utility `.xlsm` + schema `.json` +
  validation-rules `.pdf`). Then re-run `itr_diff.py` to generate their reports.
- The **"ITR 1–4 docs"** the user said they'll upload — read on arrival; reconcile against the
  precomputed reports before acting.

## 6. Target layout on this branch
```
AY2025-26/
  forms/
    ITR-1/
      index.html         # thin shell: <head> css <link>s + mount points + ordered <script src>
      css/               # styles, split logically
      js/
        00_shell.js
        05_year_config.js  # AY string, slab table, 87A limit, surcharge, due date (YEAR OVERLAY)
        10_state.js
        20_enums.js        # data as globals — NO fetch
        30_engine_*.js
        70_sec_*.js        # one per schedule (mirrors AY2026-27 src split)
        61_rules_*.js      # rule batches
        90_boot.js
      README.md          # exact script load ORDER + provenance + AY2026-27 source commit
    ITR-2/ … ITR-7/
  pipeline/              # yukti tools/shell/books copied as needed to run gates
```
- **Preserve the exact load order** the AY 2026-27 `assemble.py` uses (numeric filename order:
  00_,05_,10_,20_,30_,60_,61_,70_,90_…). Document it in each form's README.

## 7. Year-overlay = cheap future years
Put everything year-specific in `js/05_year_config.js` and keep schema/rule deltas as clearly
labelled blocks. Next AY = write one small `05_year_config.js` + a handful of delta edits from a
fresh `itr_diff.py` run. Core engine + sections + unchanged rules never move.

## 8. Per-form workflow — one form at a time
**Order:** ITR-1 → ITR-4 → ITR-5 → ITR-6 → ITR-7 → ITR-2 → ITR-3
(simplest first to validate the multi-file split + port method before the big ITR-2/3 deltas).

For each form:
1. **Split first, no year change yet.** Copy the AY 2026-27 form into `AY2025-26/forms/ITR-x/`
   and refactor single-HTML → multi-file (`index.html` + `js/` + `css/`, classic `<script src>`).
   **This refactor must be output-preserving:** the multi-file build must render the identical DOM,
   compute identical figures, and export byte-identical JSON to the single-file original. Verify
   before touching the year.
2. **Apply the year delta** from the chunks, one chunk per step, in order:
   - `05_year_config.js` (AY 2026→2025, slab table, 87A, surcharge, due date)
   - schema: 3a REMOVE → 3b ADD → 3d CHANGE → 3e containers
   - rules: 4a DISABLE → 4b ADD → 4c CHANGE → 4d year-only
   - reconcile rule **renumbering** (keep a census id map old→new)
3. **Gates 0–7** via `yukti/tools/gates/gate.py` on the AY 2025-26 form.
4. **Deep-verify only what changed**; regression-check the rest with the existing test client to the
   rupee (update golden for slab/threshold changes only).
5. **Commit** to `claude/blissful-faraday-ui8eub`; draft PR.

## 9. Verification bar (per form, same as AY 2026-27)
Gates 0–7 green · census MISSING=0 · both regimes to the rupee · schema-valid export + byte round-trip
· multi-file build opens by double-click and is behaviour-identical to the single-file equivalent.
Honest caveat kept: final proof = Import-JSON into the real CBDT AY 2025-26 utility (user tests).

## 10. Credit discipline
- One form at a time; **no parallel agent fleets**.
- **One chunk per step** (see each `_chunks/INDEX.md` for sizes).
- Reuse precomputed reports; never re-derive a diff.
- Targeted edits; don't re-read whole forms.

## 11. Status tracker (update as you go)
- ITR-1: STEP 1 DONE (output-preserving multi-file split @ `AY2025-26/forms/ITR-1/`,
  behaviour-identical to AY2026-27 build — DOM/figures/export byte-verified).
  STEP 2a DONE (year overlay `js/05_year_config.js`: NEW slabs 3/7/10/12/15L, §87A
  7L/25k+marginal, AssessmentYear "2025", due 2025-07-31, FY2024-25 challan/234BC
  dates — both regimes + 87A boundaries verified). STEP 2b NEXT: schema deltas
  (3a/3b/3d) + rule deltas (4a/4b/4c) + rule renumbering (4d/4f), then gates.
- ITR-2: NOT STARTED — chunks ready.
- ITR-3: NOT STARTED — chunks ready.
- ITR-4: NOT STARTED — chunks ready.
- ITR-5: BLOCKED — need AY 2025-26 sources.
- ITR-6: PARTIAL — AY 2025-26 validation-rules PDF + schema-change doc provided;
  rules-only diff report done (135 disable / 128 add / 100 changed; 486 renumbered).
  Still need AY 2025-26 **schema JSON** for the field-level 3a/3b/3d diff.
- ITR-7: PARTIAL — AY 2025-26 validation-rules PDF provided; rules-only diff report
  done (55 disable / 68 add / 70 changed / 6 year-only; 326 renumbered). Still need
  AY 2025-26 **schema JSON** for the field-level diff.

## 12. Background note
Prior session also runs a PR-watch loop on PRs #3/#4/#5/#6 (AY 2026-27 drafts). That is separate
from this port and can continue independently.
