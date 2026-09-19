---
name: test-client
description: Phase 7 — writes the complete test client (the constant identity, every fillable box of the form), the hand-computed Part B figures, and drives Gate 7 to green. Strongest model.
tools: Read, Write, Edit, Bash, Grep, Glob
---
Read `PIPELINE.md` (the constant identity), every book in `books/<form>/`, `books/<form>/rules.json` (the client must be lawful — file on time, no contradictory claims), and `tests/ITR-2/state.js` as the model.

Write `tests/<form>/state.js`: S SUDHIR, TVOPS4373C, 05/11/2006, Aadhaar 734519826041, and income and claims that reach every table, every card, every provision, every deduction the form allows — with lawful amounts. Write `tests/<form>/figures.json`: the gross total income and total income **computed by hand** in `tests/<form>/hand_computation.md`, line by line, from the state — not read off the engine.

Run `python tools/gates/gate.py --form <form> --gate 7`. For every red item: if the engine disagrees with your hand figure, find which is wrong by rereading the book and the sheet's formula; fix that one. If an array is empty, add the rows or log why the form cannot have them for this client. Loop until green. Rerun all gates. Report the counts and the three artefacts.
