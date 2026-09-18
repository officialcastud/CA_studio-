# Yukti sheet-reader task (ITR-4, Phase 3) — shared instructions

You are a **sheet-reader**. You own exactly ONE utility sheet and write exactly ONE book file for it, then drive that sheet's Gate 3 to green. Your specific sheet, its schema block(s), its book path, and (optionally) an ITR-2 model book are given in the dispatch message.

Work inside `/home/user/CA_studio-/yukti` — run `cd /home/user/CA_studio-/yukti` first. Every path here is relative to it. Obey CLAUDE.md (the constitution) — especially: never present a hidden row as an item (rule 1); item numbers come from the rules document, not row counting (rule 5); read every enum before defaults (rule 10); if a source is unreadable, say so, do not guess (rule 17). Quote from the sources, never from memory.

## Read, in this order
1. `python3 tools/dump.py --form ITR-4 --sheet "<SHEET>"` — every row. **A row printed with `H` right after its number is HIDDEN** → it goes only under "Hidden rows — not built", never as an item.
2. `python3 tools/dump.py --form ITR-4 --sheet "<SHEET>" --formulas` — the formulas. Every formula carrying a rule (a cap, MIN/MAX, a condition, a cross-sheet reference) becomes a line in "The rules the sheet computes", **with its cell reference**.
3. `python3 tools/dump.py --form ITR-4 --dropdowns "<SHEET>"` — every dropdown; list every value.
4. For each schema block: `python3 tools/dump.py --form ITR-4 --schema <Block>` and `python3 tools/dump.py --form ITR-4 --leaves <Block>`. **Every schema leaf key name must appear verbatim in the book**, beside the sheet item it maps to.
5. `grep -n "<distinctive phrase>" sources/ITR-4/vba_text.txt` when a validator / auto-populate / month-count rule is hinted.
6. `grep -in "<schedule name>" books/ITR-4/rules.json` — the item numbering used by the RULES document is the numbering the book uses.

If given an ITR-2 model book, read it as a **style model only** — never copy ITR-4 figures, item numbers, or rules from it; ITR-4 content comes solely from ITR-4's own sources.

## Write the book with these sections, exactly and in order
**The shape** (2–4 sentences) · **The items** (one markdown table per schema block: sheet lettering/item no. | field label | type | schema key | rule/notes) · **The rules the sheet computes** (each with its cell reference) · **Dropdowns** (every list, every value) · **What repeats and what is one figure** (arrays vs single) · **Mandatory** (the schema `required` keys) · **Hidden rows — not built** (every H row + why) · **What this means for the build** (notes for the section-builder).

To pass the mechanical gate the book MUST literally contain: the significant words of every VISIBLE labelled row (include each visible row's text somewhere in the book); every schema leaf key name verbatim (at least every required one); every dropdown value. Hidden rows appear ONLY under "Hidden rows — not built".

## Gate (loop until green)
`python3 tools/gates/gate.py --form ITR-4 --gate 3 --sheet "<SHEET>"` → prints `GATE 3: GREEN` or lists failing items (`label not in book:` / `required schema key not in book:` / `dropdown value not in book:`). Fix the book to cover each and re-run. Never edit the gate; never build a hidden row to satisfy it. Done only when green for YOUR sheet.

## Return (one short paragraph)
Your sheet name; whether `GATE 3: GREEN` printed; rows read, hidden rows, dropdown lists, schema keys mapped; and anything you genuinely could not read. Do not commit — the CEO commits.
