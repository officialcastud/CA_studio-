# ITR-3 (AY 2026-27) — build record

Built end to end by the Yukti pipeline. **All gates 0–7 GREEN.**

## Sources (sources/ITR-3/)
- Utility `ITR3_AY_26-27_V1.3.xlsm` — 66 sheets (40 visible, 26 hidden), 5810 named ranges.
- Schema `ITR-3_2026_Main_V1_1_schema.json` (9-Jul release) — root ITR3, 69 blocks, 216 enums.
- Validation rules `CBDT_e-Filing_ITR_3_Validation_Rules_AY_2026-27_V1_0.pdf` (73 pp) — **fetched from incometax.gov.in** (the upload named "rules PDF" was the 5-page schema-change doc). 999 Category A + 40 B + 17 D, numbering continuous.
- Schema-change document V1.1 kept for reference.

## Result
| Gate | Result |
|---|---|
| 0 sources | GREEN — sheet_map, skeleton, enums, blocks, rules.json |
| 1 structure | GREEN — 17 section ids / 18 screen sections; every sheet mapped; business heads in `bpa`+`bp` |
| 2 shell | GREEN — boots on the shared shell (ITR-2 UI), all sections paint, save/open |
| 3 books | GREEN — 39 sheet books (parallel Opus readers) |
| 4 schedules | GREEN — 18 sections built (engine/screen/export/import/checks), assembled, 0 duplicate writers |
| 5 whole form | GREEN — full return validates 0 schema errors; byte-identical round-trip |
| 6 rules | GREEN — 430/999 Category A coded, **0 firing** on the return; 4 Category-D advisories |
| 7 test client | GREEN — S SUDHIR complete return; content audit 0 empty; hand figures match |

## The constant client — S SUDHIR (TVOPS4373C, 05/11/2006), OLD regime
- **GTI 3,273,500** = Salary 1,372,500 + Business 1,020,000 + Capital gains 950,000 + Other sources 361,000 − CYLA HP-loss 200,000 − BFLA 230,000.
- **TI 1,786,500** = GTI − Chapter VI-A 1,287,000 − 10AA 200,000.
- Tax via **AMT u/s 115JC** (AMT > normal in the old regime). Hand-reconciled to the rupee (tests/ITR-3/figures.json), 60 of 69 schema blocks populated (the 9 absent are heads this client has no data for — manufacturing, GST, 80GGA/80EE/80RA, etc.).

## Deliverables
- `forms/ITR-3/Yukti_ITR3.html` — the single-file offline builder.
- `tests/ITR-3/state.js`, `tests/ITR-3/figures.json`.
- `tests/ITR-3/S_SUDHIR_ITR3_AY2026-27_return.json` (the return) and `…working.json` (the working file).

## ITR-3-specific decisions (from ITR-3's own sources)
- Business/profession stack built: Part A BS/P&L/Trading/Manufacturing/OI/QD, BP, depreciation DPM/DOA/DEP/DCG, ESR, UD, ICDS, GST, Schedule IF, TPSA; presumptive 44AD/44ADA/44AE.
- Regime toggle (`books/ITR-3/REGIME.md`): opting out of the new regime opens Chapter VI-A, 10AA, 35AD, additional depreciation, ESR weighted deductions, self-occupied HP interest, HP-loss set-off and AMT; the new regime closes them (40 rules). The `ret` section computes the return both ways.
- Due date FORM.due = 2026-07-31 base; audit/92CE variants (31-Oct / 30-Nov) in the tax engine.

## Pipeline changes made during the build (with evidence)
- `tools/rules_pdf.py` generalised beyond ITR-2's PDF (pick the validation PDF; per-table A/B/D categories; stop at the Annexure; keep rules whose text begins "Sl. No."; trim the page header).
- `tools/gates/gate.py` gate-3 threshold `max(2,len-2)` → `min(len,max(2,len-2))` — a proven bug where a 1-significant-word label was unsatisfiable by any book (logs/ITR-3/gate3_analysis.md); applied with the user's explicit approval.
- `shell/shell.js` — restored the `fold()` renderer (listed in the contract, its CSS + click handler already present) and made `grid()` tolerant of a missing rows collection. `shell/example.html` re-verified.
