# ITR-2 — the reference form

`Yukti_ITR2.html` was built before `tools/assemble.py` existed, so it is a single hand-assembled file rather than
`src/*.js` parts; it carries `buildReturn()` and `window.FORM` aliases so the harness can drive it. It satisfies the
shell contract. New forms are built as parts and assembled.

Gates 0, 1, 2, 4, 5, 6, 7 are green on it (`python tools/gates/gate.py --form ITR-2 --gate all`). Gate 3 is red:
its books in `books/ITR-2/` are the prose originals written before the book contract (every schema key verbatim,
every dropdown value, hidden rows listed). Regenerating them with the sheet-reader agents is the pipeline's
first self-test — run the Kickoff for ITR-2 and expect Phase 3 to rewrite the books and Phases 4–7 to stay green.
