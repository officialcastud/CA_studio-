# Yukti section-builder task (ITR-4, Phase 4) — shared contract

You build ONE section of ITR-4 into a single self-contained file. You never edit a shared file. Work inside `/home/user/CA_studio-/yukti` (`cd` there first). Your section id, title, books, schema blocks, compute `order` and screen refs are in the dispatch message.

## Read first (quote from these; never invent tax logic)
1. `shell/README.md` — the renderer + global contract. `shell/shell.js` — how renderers (`row, inp, sel, dte, cell, grid, fold, card, blk, sub, note, formNote`), `S`, `put`, `deep`, `isNew()`, `N/R/F/RS`, dates work. **Study `forms/ITR-2/Yukti_ITR2_software_reference.html`** for the finished ITR-2 version of a comparable section — copy its shell idioms and shape, but NOT its numbers/item-numbers/rules (rule 2: never port an engine; build ITR-4 logic from ITR-4's book).
2. Your book(s) in `books/ITR-4/` — the single source for every item, schema key, dropdown, rule (with cell refs), what repeats, what is mandatory, hidden rows (never build them).
3. `books/ITR-4/REGIME.md` — MANDATORY. Every item your section closes/opens on the new-vs-old regime must gate on `isNew()`: the renderer shows a closed item as `cell(0)` or a `note`, never an input; the engine zeroes it; a check warns if a closed item carries a value. Build and test BOTH ways (`S.fs.optout="Yes"` old, `="No"` new).
4. `books/ITR-4/enums.json` — dropdown values (use these, never hand-type). `python3 tools/dump.py --form ITR-4 --leaves <Block>` / `--schema <Block>` for the exact schema keys and required flags.

## Write EXACTLY one file: `forms/ITR-4/src/70_sec_<id>.js`
It defines (all suffixed with your Id, e.g. `engCg`, `secCg`):
- **State**: at top level, `S.<id> = S.<id> || { …defaults… }` (your section's namespace; seed repeatable arrays as `[]`, cards off). Put default grid rows into `SEED` via `SEED.<key>=SEED.<key>||{…}`.
- **`eng<Id>()`**: compute this section's numbers from `S.<id>` into `S.C.<id>`. Every income section MUST set `S.C.<id>.income` = this head's contribution to Gross Total Income (a signed rupee integer; a loss is negative), because the `tax` section rolls up `Σ S.C.<head>.income`. Encode every formula from the book WITH its cell ref in a comment. Regime-gate per REGIME.md. Never throw — guard cross-reads as `(S.C.other||{}).x||0`.
- **`sec<Id>()`**: the renderer. Every live (non-hidden) book row → a field via a shell renderer; every dropdown from `enums.json`; computed cells via `cell(...)` (green, untypeable); overrides behind the sheet's own switch; regime-closed items shown closed. Return an HTML string.
- **`exp<Id>(j)`**: write your schema block(s) onto `j` using `put(j,"Block.path.key", value)` — a block/array only when it carries a value; required totals present even at zero. Keys verbatim from the schema.
- **`imp<Id>(I3)`**: the inverse — read `I3.<Block>` back into `S.<id>`; return a list of short strings naming what you read.
- **`chk<Id>()`**: return `[{lvl:"err"|"warn"|"ok", t, m, sec:"<id>"}]` — the sheet's own rules as live messages (regime-aware), from the book.
- **Register once, at the bottom**: `reg({id:"<id>", t:"<title>", ref:"<ref>", f:secXx, s:()=>"<one-line summary>", eng:engXx, exp:expXx, imp:impXx, chk:chkXx, order:<N>});`

## Verify before reporting
- `node --check forms/ITR-4/src/70_sec_<id>.js` — MUST pass.
- **Do NOT run `tools/assemble.py` or the gates** — other section-builders run in parallel and would clobber the shared assembled HTML and gate logs. The CEO/integrator assembles once, all sections together, and drives gates 2/4/5. Your job is a correct, `node --check`-clean `70_sec_<id>.js`.
- Instead, self-verify by reasoning: hand-compute one case for your section in `tests/ITR-4/cases/<id>.md` (the arithmetic from your book), and trace your `eng<Id>()` line by line against it — the figure must match to the rupee. Re-read the shell (`shell/shell.js`) to confirm every renderer/helper you call exists and is called with the right args (e.g. `fold(id,ref,title,status,inner,opts)`), and that every `put(j,"<key>",…)` key is a real schema key from your block's `--leaves`.
- Confirm both regime paths in your head: with `isNew()` true (new) the REGIME.md closures apply; with it false (old) they open.

Never edit a gate. Never edit a shared file (00_form/08_registry/10_state/90_wiring/30_sec_00_boot). Only create your own `70_sec_<id>.js`. Never build a hidden row. Encode every rule from its text.

## Report
Your id; files written; which schema blocks you export/import; `gate 2` green y/n; the one hand-checked figure; anything in the book you could not honour, by row. Do not commit — the CEO commits.

## ITR-4 ownership map (avoid duplicate schema-key writers — one section owns each block)
ITR-4's PersonalInfo, FilingStatus, IncomeDeductions and TaxComputation all live on the ONE "Income Details" sheet and are one computation flow. Ownership is split so no block is written by two sections:
- **inccore** (screen sections who, ret, inc, hp, tax; compute order: income 20, tax roll-up 80): OWNS export/import of `PersonalInfo`, `FilingStatus`, `IncomeDeductions` (all of it — salary rows, `PropertyDetails` for HP, `IncomeFromBusinessProf`, `OthersInc`, `DeductUndChapVIA`/`UsrDeductUndChapVIA` totals, `GrossTotIncome`, `TotalIncome`), `TaxComputation`, `ScheduleBP` (presumptive 44AD/44ADA/44AE), `LTCG112A`, `TaxExmpIntIncDtls`. It renders who (identity), ret (regime + Form 10-IEA), inc (salary + presumptive business + other sources), hp (house property into IncomeDeductions.PropertyDetails), tax (Part B → GTI → VI-A → TI → tax → 87A rebate → cess → 234A/B/C → liability). It READS `S.C.ded.total` (Chapter VI-A deduction) and `S.C.paid.total` for the roll-up; guard as `(S.C.ded||{}).total||0`.
- **ded** (screen section ded; order 40): OWNS export/import of `Schedule80C/80D/80G/80GGC/80DD/80U/80E/80EE/80EEA/80EEB` and `ScheduleEA10_13A` (HRA). Computes the total Chapter VI-A deduction into `S.C.ded.total` (regime-gated) for inccore. Does NOT write IncomeDeductions.
- **paidbank** (screen sections paid, bank; order 60/95): OWNS export/import of `ScheduleIT`, `ScheduleTCS`, `TDSonSalaries`, `TDSonOthThanSals`, `ScheduleTDS3Dtls`, `TaxPaid`, `Refund` (bank), `Verification`, `TaxReturnPreparer`. Computes `S.C.paid.total` (taxes paid) and the balance/refund reading inccore's `S.C.tax.liability`.

Each builder registers ALL its screen sections via reg() (last registration overrides the boot placeholder). Attach eng/exp/imp to the section that owns the block; a pure-view screen section (e.g. who, ret) registers with just `f:` renderer.

## Regime (ITR-4)
New regime u/s 115BAC(1A) is default; opting out (old regime) is via Form 10-IEA (FilingStatus fields). In the NEW regime, Chapter VI-A deductions close except 80CCD(2)/80CCH (and 80JJAA n/a here); the ₹75,000 standard deduction and family-pension deduction stay; entertainment allowance 16(ii)/professional tax 16(iii) and HRA 10(13A) close; self-occupied HP interest 24(b) closes; 87A rebate is ₹60,000 up to ₹12L (new) as the schema's Rebate87A max shows. Gate every closed item on `isNew()` (`S.fs.optout!=="Yes"`). The ITR-4 rules PDF has the regime conditions (e.g. "If Old Tax Regime is selected, then in Schedule 80D…") — encode from those.
