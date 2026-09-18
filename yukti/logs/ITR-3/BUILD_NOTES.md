# ITR-3 build — running notes (CEO)

## Sources (all three + change doc, in sources/ITR-3/)
- Utility: ITR3_AY_26-27_V1.3.xlsm (66 sheets, 40 visible, 26 hidden; 5810 named ranges)
- Schema: ITR-3_2026_Main_V1_1_schema.json (root ITR3; 69 blocks, 12 required; 216 enums)
- Validation rules: CBDT_e-Filing_ITR_3_Validation_Rules_AY_2026-27_V1_0.pdf (73 pp) — **fetched from incometax.gov.in**
  because the upload named "validation-rules PDF" was in fact the 5-page schema-change document. Official source, not invented.
- Schema-change document V1.1 (30 Jun 2026) kept as ITR-3_Schema_Change_Document_V1_1.pdf (reference only).

## Phase 0 — GREEN
- rules.json: 999 Category A, 40 Category B, 17 Category D; numbering continuous per category.
- Fixed tools/rules_pdf.py (it was tuned to ITR-2's PDF): (1) select the *validation* PDF when several PDFs sit in
  sources/; (2) latch category on each table heading — Table 2=A (pp4-61), Table 3=B (pp62-64), Table 4=D (p65) —
  ITR-3 splits B and D into their own tables where ITR-2 combined "B/D"; (3) stop at the "Annexure" field-map;
  (4) do NOT drop a rule whose scenario text legitimately begins "Sl. No. ..." (that swallowed rule A468);
  (5) trim the page header/title out of each table's first rule. Numbering continuous check now per category.

## UI decision (per user)
- User supplied the running ITR-2 software (forms/ITR-2/Yukti_ITR2_software_reference.html). Its <style> is
  **byte-identical** to shell/shell.css and it uses the shell renderers (row/inp/dte/sel/cell/grid/fold/card/blk).
  => ITR-3 is built on the shared shell via tools/assemble.py: same UI/chrome as the ITR-2 software, ITR-3's own
  content. No per-form shell edits. "Don't mix the particulars" honoured — content comes only from ITR-3 sources.

## Test identity (constant) — DOB corrected
- Kickoff wrote "05/11/2026"; that is a future date and cannot have business income. PIPELINE.md's constant identity
  and the kickoff's own "same person as ITR-2" fix it to **05/11/2006**. Using 05/11/2006, TVOPS4373C, S SUDHIR.
