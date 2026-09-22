# The Yukti pipeline — how every ITR form gets built

The steps as you set them out, made exact. Each phase has inputs, outputs, and
a **gate**: a script that returns pass or fail. A phase does not end until
its gate passes. "Fix until covered" is a loop, not an instruction.

This is written so that Claude Code can run it from a repository, one form at
a time or several in parallel, and stop only on green.

---

## The repository

```
yukti/
  tools/            dump.py · schema.py · rules_pdf.py · harness/ (shared, built once)
  shell/            the common UI: CSS, renderers, paint, events, save/open, gate, rules panel
  sources/ITR-N/    the utility .xlsm (unzipped to utility/), the schema .json, the rules .pdf
  books/ITR-N/      one markdown per sheet, plus structure.md and coverage.json
  forms/ITR-N/      Yukti_ITRN.html — the deliverable
  tests/ITR-N/      state.js (the client), the Playwright scripts, expected figures
  logs/ITR-N/       every gate run, with the failing items
```

Constant across every form: `tools/`, `shell/`, the harness, the test identity.
Per form: everything else. **Nothing is copied from one form to another except
the shell and the tools.** An engine is never ported.

---

## The constant test identity

Every ITR 1 to 4 is tested on the same person, so the forms can be compared:

| Field | Value |
|---|---|
| Name | S SUDHIR |
| PAN | TVOPS4373C |
| Date of birth | 05/11/2006 |
| Aadhaar | 734519826041 |
| Mobile · email | 9845012345 · s.sudhir.test@example.in |
| Address | No. 42, 3rd Cross, Richmond Town, Bengaluru 560025, Karnataka |
| Bank for refund | SBIN0040011 · 30412345678 |

What differs per form is only the income that form is for. The test person
must exercise **every fillable box, every provision, every deduction, every
schedule** of that form — a client who needs the whole return.

---

## Phase 0 — Extract the sources (deterministic; scripts, no judgement)

**Input:** `sources/ITR-N/`
**Steps**
1. Unzip the utility. Map sheet name → xml file → visible/hidden state → row count.
2. `dump.py`: every row of every sheet as `rN[H]: [cell] text | …` — **H marks a hidden row**. Also formulas per cell, named ranges, data-validation (dropdown) lists, and the VBA as searchable text.
3. `schema.py`: resolve every definition; list the top-level blocks with `required`; generate the required-key skeleton; extract every enum with its description.
4. `rules_pdf.py`: parse the validation-rules PDF by word coordinates into `rules.json` with category and serial; assert the numbering is continuous.

**Gate 0:** sheet map written · every sheet dumped · schema skeleton validates against the schema · rules count matches the PDF's last serial in each category.

---

## Phase 1 — Decide the structure (the continuous sheet)

The utility has dozens of sheets. Yukti has as few sections as will hold them
sensibly, so filling is easy.

**Steps**
1. From the sheet map, list every **visible** sheet and every hidden sheet with the reason it is hidden (business-only, NRI-only, superseded version).
2. Group the visible sheets into sections, ordered by how often a filer needs them (who is filing · return and regime · salary · … · Part B · bank and verification). One section may hold several sheets (SPI + SI; FSI + TR + FA; 5A + PTI + ESOP).
3. Write `books/ITR-N/structure.md`: the section list, and under each section the sheets it holds, in the order they appear on screen.
4. Write `section_map.json`: sheet → section, or sheet → `excluded` with the reason.

**Gate 1:** every visible sheet appears in exactly one section · every hidden sheet is in `excluded` with a reason · no section holds more than the form's schedules · a human reads `structure.md` once and approves it.

---

## Phase 2 — The outer UI (the shell)

Built once in `shell/`; instantiated per form.

Same in every form: masthead · left index · the section bar with its
collapse control, reference and running figure · the six renderers · the
footer strip (gross, total, tax, payable/refund, regime) · Open file · Save
file · Export return · the rules panel · the export gate. Maroon and white,
red label text for mandatory, `DD/MM/YYYY` on every date, the dustbin.

**Gate 2:** the empty form boots with no console errors · all sections from `structure.md` paint · save then open restores an empty state · one screenshot per section reviewed.

---

## Phase 3 — The books (parallel across sheets)

One document per sheet, from the dump — **every row, every item number, every
dropdown value, every hidden flag, every formula that carries a rule.**

Each book has the same sections: the shape · the items (a table per block,
with the sheet's own lettering) · the rules the sheet computes (from its
formulas and VBA, with cell references) · what repeats and what is one figure
· what the schema marks mandatory · what this form has that the simpler form
does not · what it means for the build.

The books are independent; they can be written in parallel, one sheet each.

**Gate 3 — mechanical, per book, loop until green:**
- every label on the sheet's live rows appears in the book;
- every leaf key of the sheet's schema block(s) appears in the book;
- every dropdown list on the sheet appears in the book with all its values;
- every hidden row is listed as hidden, not built;
- every item number in the book matches the item number the **rules document** uses for it.
If anything is missing → fix the book → run the gate again. No build starts
on a book with a red gate.

---

## Phase 4 — Build each schedule from its book (parallel or in order)

Per schedule, in this order, from the book alone:
1. **State** — the keys, seeded defaults, the repeatable arrays.
2. **Engine** — every formula the sheet has, from its cells; every VBA rule; nothing from memory, nothing ported.
3. **Screen** — the section's renderer: every live row a field, every dropdown from the enum file, computed cells green, overrides behind the sheet's switch, fed lines shown as fed.
4. **Export** — every value onto its schema key; blocks only when carrying a value; totals present even at zero.
5. **Import** — the inverse of the export, every key back to its field.
6. **Checks** — the sheet's own rules as live messages, with the sheet's wording.

**Gate 4 — per schedule, loop until green:**
- `node --check` passes;
- a hand-computed case for this schedule matches the engine to the rupee;
- a Playwright run loads the case, paints, exports, with no page errors;
- the exported block validates against the schema with zero errors;
- import of that export re-exports byte-identical;
- a screenshot is reviewed against the book.

---

## Phase 5 — Re-check the whole form against the utility and the books

After every schedule is in.

**Steps — three mechanical cross-checks, then the human one**
1. **Sheet coverage:** every live row of every visible sheet → a field on screen. Missing → build it.
2. **Schema coverage:** every key of every block the schema has for this form → an export writer and an import reader. Missing → build it. A key the form cannot produce (FII-only on a resident form) → logged as not applicable.
3. **Placement:** every field's export key lives in the block the schema puts it in; every section holds only the sheets `section_map.json` says.
4. **Same UI:** buttons, options, dropdown values, the rules panel — identical to the shell. A diff of the rendered controls against the shell's manifest.

**Gate 5:** the coverage matrix (sheet rows × screen · schema keys × export/import) is all green · the full-return export validates with zero schema errors · the full return round-trips byte-identical.

---

## Phase 6 — The validation rules

**Steps**
1. Read every rule in `rules.json`. Classify: arithmetic · conditional · cap · format · external (PAN database etc., cannot be checked offline) · duplicate · not-this-form.
2. Encode every checkable rule in `runRules`, **from the rule's text**, with its serial. The rule decides what the engine must produce, not the other way round.
3. Where a rule contradicts the engine, the engine changes — the rule names the sheet item, the book says which field that is, the engine is edited there.
4. Category A stops the export; Category D lists the forms that must follow.

**Gate 6:** every checkable rule is encoded (the count is logged with the excluded ones and their reason) · the full test return runs with **zero Category A** · the D notices are listed and each names its form.

---

## Phase 7 — The test client and the working file

**Steps**
1. Write `tests/ITR-N/state.js`: the constant identity, and income and claims that reach **every fillable box** of this form — every table with rows, every card on, every provision, every deduction schedule, brought-forward losses, foreign assets, everything the form allows.
2. Load it, export, save the working file.
3. Run every gate on it: schema zero · rules zero A · content audit (every array has rows; every block the form allows is present; the absent ones are logged with the reason) · round-trip through the working file · round-trip through the return JSON · hand-check the Part B figures.
4. Keep the three files as the form's acceptance artefacts: the return JSON, the working file, the figures.

**Gate 7 — the form is done when:** schema 0 · Category A 0 · blocks present = all the form allows for this person · both round-trips byte-identical · the hand figures match.

---

## The rules of the pipeline — from the seventeen mistakes

These run inside every phase; they are the reason the loops converge.

1. **Never build a hidden row.** A hidden row is read as *not on this form*; it goes in the excluded log with its reason.
2. **Never port an engine.** Every formula from this form's sheet; the previous form's engine is not an input.
3. **Every live row must have a schema key**, or it cannot be filed — drop it, log it.
4. **Every schema array must have a place on screen**, or the portal will reject the return for what is missing.
5. **Item numbers come from the rules document**, not from counting rows; the count skips hidden rows.
6. **Encode a rule from its text.** If the engine already does something else, the engine is wrong until proven otherwise.
7. **Read the hidden computation sheets** (Tax Calculated and its like); the display sheet shows results, the hidden sheet shows the method.
8. **Helper columns are rules.** A column that buckets challans by month is the rule for what counts as paid in time.
9. **Read the whole header.** A column header that says "if acquired after … enter directly" is a rule.
10. **Read every enum's range before seeding a default.**
11. **After every splice, grep for duplicate writers of the same key.** Stale lines beneath new ones silently win.
12. **The round-trip is a gate, not a test.** Return → import → export must be identical; anything the export writes that the import cannot read is a field that will be lost.
13. **Zero errors is a state that the next change breaks.** Every gate runs after every change, not once at the end.
14. **The rules document is read before the test data is written**, so the test client is a lawful one.
15. **A figure is verified by hand before it is trusted** — one case per schedule, to the rupee.
16. **The screenshot is reviewed against the book**, not against the code's intent.
17. **The three sources must agree at once:** utility (what is shown), schema (what is filed), rules (what must hold). Any build that satisfied one without the other two was wrong every time.

---

## What runs in parallel

- Phase 3 (books) and Phase 4 (schedules) — one worker per sheet, once Phase 1's structure is approved and Phase 2's shell exists.
- Across forms — ITR-1, 3 and 4 can run as three pipelines at once; they share `tools/` and `shell/` and nothing else.
- Phase 5 onward is per form and sequential, because it needs the whole form.

## What the loop looks like when it runs unattended

```
for each phase:
    run the gate
    while the gate is red:
        read the failing items
        fix exactly those (book, engine, screen, export, import, rule)
        re-run every gate that any earlier phase owns   ← regressions are caught here
    log the green gate with its counts
declare the form done only on Gate 7
```

Every log line names the sheet, the row, the schema key or the rule serial,
so a human can audit the run without reading code.

---

## Definition of done — one line per form

**Every visible sheet of the utility is on screen under its section; every
schema key the form allows is written and read back; every checkable rule
passes; the constant client's complete return validates with zero errors,
round-trips byte-identical, and its Part B figures match a hand computation.**
