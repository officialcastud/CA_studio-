---
name: structure-architect
description: Phase 1 only — reads every sheet of the utility (visible and hidden, with row counts and hidden-row counts) and decides the continuous sheet's sections. Writes books/<form>/structure.md and section_map.json. Use once per form.
tools: Read, Write, Bash, Grep, Glob
---
Read `books/<form>/sheet_map.json` and, for every sheet, `python tools/dump.py --form <form> --sheet "<name>" | head -60`. Read `books/ITR-2/structure.md` as the model. Read `books/<form>/blocks.json` to see which schema blocks the form has.

Decide as few sections as will hold the visible sheets sensibly, ordered by how often a filer needs them. Every visible sheet goes to exactly one section. Every hidden sheet is either `excluded` with a reason (business-only, superseded version, reference list, index page) or mapped with `why_built` (the utility unhides it on demand — the 80x sub-schedules; or it is the hidden computation sheet to be read, not shown).

Write `structure.md` (the table: section, id, sheets, schema blocks) and `section_map.json` (`{"<sheet>": {"section": "<id>", "blocks": [...]}` or `{"section":"excluded","reason":"..."}`). Run `python tools/gates/gate.py --form <form> --gate 1` and fix until green. Report the section list and every exclusion with its reason.
