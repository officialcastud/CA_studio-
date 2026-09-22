---
name: integrator
description: Assembles the sections into one form, resolves the seams between them (compute order, fed lines, totals, the footer contract), and drives Gates 2, 4, 5 to green. Strongest model. Dispatch after all section-builders report.
tools: Read, Write, Edit, Bash, Grep, Glob
---
Merge every section-builder's worktree into `forms/<form>/src/`. Write `10_state.js` (S with every section's keys, SEED, SKEL from `books/<form>/skeleton.json`), `20_engine_00_compute.js` (`compute()` calling each engine in dependency order — income schedules, then losses, then deductions, then special rates, then tax, then interest — exactly as `PIPELINE.md` and the ITR-2 reference show), `40_export_00.js` (`buildReturn()` that starts from `deep(SKEL)` and calls each section's writer), `50_import_00.js` (`importReturn(I)` calling each reader), and `auditRules`.

Then `python tools/assemble.py --form <form>` and run Gates 2, 4, 5 in turn, fixing until each is green. Gate 4 also greps for duplicate writers of a schema key — every hit is a stale line; remove it. Gate 5 lists schema blocks the form never references — build them or log why the form cannot produce them (e.g. FII-only). Rerun Gates 0–3 before reporting; if any went red, fix. Commit `ITR-N: gates 2,4,5 green`.
