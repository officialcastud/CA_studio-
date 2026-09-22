# Yukti section-builder task (ITR-3, Phase 4) — shared contract

You build ONE section of ITR-3 into a single self-contained file. You never edit a shared file. Work inside `/home/user/CA_studio-/yukti` (`cd` there first). Your section id, title, books, schema blocks, compute `order` and screen refs are in the dispatch message.

## Read first (quote from these; never invent tax logic)
1. `shell/README.md` — the renderer + global contract. `shell/shell.js` — how renderers (`row, inp, sel, dte, cell, grid, fold, card, blk, sub, note, formNote`), `S`, `put`, `deep`, `isNew()`, `N/R/F/RS`, dates work. **Study `forms/ITR-2/Yukti_ITR2_software_reference.html`** for the finished ITR-2 version of a comparable section — copy its shell idioms and shape, but NOT its numbers/item-numbers/rules (rule 2: never port an engine; build ITR-3 logic from ITR-3's book).
2. Your book(s) in `books/ITR-3/` — the single source for every item, schema key, dropdown, rule (with cell refs), what repeats, what is mandatory, hidden rows (never build them).
3. `books/ITR-3/REGIME.md` — MANDATORY. Every item your section closes/opens on the new-vs-old regime must gate on `isNew()`: the renderer shows a closed item as `cell(0)` or a `note`, never an input; the engine zeroes it; a check warns if a closed item carries a value. Build and test BOTH ways (`S.fs.optout="Yes"` old, `="No"` new).
4. `books/ITR-3/enums.json` — dropdown values (use these, never hand-type). `python3 tools/dump.py --form ITR-3 --leaves <Block>` / `--schema <Block>` for the exact schema keys and required flags.

## Write EXACTLY one file: `forms/ITR-3/src/70_sec_<id>.js`
It defines (all suffixed with your Id, e.g. `engCg`, `secCg`):
- **State**: at top level, `S.<id> = S.<id> || { …defaults… }` (your section's namespace; seed repeatable arrays as `[]`, cards off). Put default grid rows into `SEED` via `SEED.<key>=SEED.<key>||{…}`.
- **`eng<Id>()`**: compute this section's numbers from `S.<id>` into `S.C.<id>`. Every income section MUST set `S.C.<id>.income` = this head's contribution to Gross Total Income (a signed rupee integer; a loss is negative), because the `tax` section rolls up `Σ S.C.<head>.income`. Encode every formula from the book WITH its cell ref in a comment. Regime-gate per REGIME.md. Never throw — guard cross-reads as `(S.C.other||{}).x||0`.
- **`sec<Id>()`**: the renderer. Every live (non-hidden) book row → a field via a shell renderer; every dropdown from `enums.json`; computed cells via `cell(...)` (green, untypeable); overrides behind the sheet's own switch; regime-closed items shown closed. Return an HTML string.
- **`exp<Id>(j)`**: write your schema block(s) onto `j` using `put(j,"Block.path.key", value)` — a block/array only when it carries a value; required totals present even at zero. Keys verbatim from the schema.
- **`imp<Id>(I3)`**: the inverse — read `I3.<Block>` back into `S.<id>`; return a list of short strings naming what you read.
- **`chk<Id>()`**: return `[{lvl:"err"|"warn"|"ok", t, m, sec:"<id>"}]` — the sheet's own rules as live messages (regime-aware), from the book.
- **Register once, at the bottom**: `reg({id:"<id>", t:"<title>", ref:"<ref>", f:secXx, s:()=>"<one-line summary>", eng:engXx, exp:expXx, imp:impXx, chk:chkXx, order:<N>});`

## Verify before reporting
- `node --check forms/ITR-3/src/70_sec_<id>.js` — MUST pass.
- **Do NOT run `tools/assemble.py` or the gates** — other section-builders run in parallel and would clobber the shared assembled HTML and gate logs. The CEO/integrator assembles once, all sections together, and drives gates 2/4/5. Your job is a correct, `node --check`-clean `70_sec_<id>.js`.
- Instead, self-verify by reasoning: hand-compute one case for your section in `tests/ITR-3/cases/<id>.md` (the arithmetic from your book), and trace your `eng<Id>()` line by line against it — the figure must match to the rupee. Re-read the shell (`shell/shell.js`) to confirm every renderer/helper you call exists and is called with the right args (e.g. `fold(id,ref,title,status,inner,opts)`), and that every `put(j,"<key>",…)` key is a real schema key from your block's `--leaves`.
- Confirm both regime paths in your head: with `isNew()` true (new) the REGIME.md closures apply; with it false (old) they open.

Never edit a gate. Never edit a shared file (00_form/08_registry/10_state/90_wiring/30_sec_00_boot). Only create your own `70_sec_<id>.js`. Never build a hidden row. Encode every rule from its text.

## Report
Your id; files written; which schema blocks you export/import; `gate 2` green y/n; the one hand-checked figure; anything in the book you could not honour, by row. Do not commit — the CEO commits.
