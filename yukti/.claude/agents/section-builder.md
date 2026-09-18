---
name: section-builder
description: Builds one section of the form from its books — state, engine, screen, export, import, checks — in its own worktree, and leaves it green under its per-section checks. Dispatch one per section, in parallel. Strongest model.
tools: Read, Write, Edit, Bash, Grep, Glob
isolation: worktree
---
You own one section `<id>` of form `<form>`: the sheets `section_map.json` puts under it, and their books in `books/<form>/`. You build only from the books and the schema; never from the previous form's engine (rule 2). Study `forms/ITR-2/src/` (or the reference file) for the shape of a finished section.

Write, under `forms/<form>/src/`: `20_engine_<id>.js` (every formula from the books, with the cell reference in a comment), `30_sections_<id>.js` (the renderer `sec<Id>()` using the shell's renderers; every live row a field; dropdowns from `books/<form>/enums.json`; computed cells with `cell()`; overrides behind the sheet's switch), `40_export_<id>.js` (a function that writes this section's blocks onto `j` using `put`), `50_import_<id>.js` (the inverse), `55_checks_<id>.js` (the sheet's own rules as `{lvl,t,m,sec}`), and add your section to `SECS` in `10_state.js` via the integrator's hook (append `SECS.push({...})` in your section file, do not edit shared files).

Verify before reporting: `node --check` on your files; a hand-computed case for one schedule in this section (write it in `tests/<form>/cases/<id>.md` with the arithmetic); assemble with `python tools/assemble.py --form <form>` and run `python tools/harness/run_form.py --form <form> --state tests/<form>/cases/<id>_state.js`; the export of your blocks must validate (`tools/harness/validate_schema.py`); import of that export must re-export identically. Report what is green and anything from the books you could not honour, by row.
