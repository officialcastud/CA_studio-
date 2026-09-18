# ITR-4 · A.Y. 2026-27 — CBDT validation-rule CENSUS (consolidated)

Independent re-count of **every** CBDT validation rule against the shipped engine
(`forms/ITR-4/Yukti_ITR4.html`), performed by two read-only agents over disjoint serial
ranges, then reconciled here. This is the full census (all rules), not just the GAP/WEAK
subset in `TICK_SHEET.md`.

## Result

| Slice | Total | Enforced | NA | Offline-impossible | Missing |
|---|---|---|---|---|---|
| A1–A200 | 200 | 198 | 0 | 2 | 0 |
| A201–A411 + B + D | 224 | 210 | 13 | 1 | 0 |
| **TOTAL** | **424** | **408** | **13** | **3** | **0** |

Serial count note: the audit's MASTER_COVERAGE lists 426 serials; the census found **A400 and
A401 are not real CBDT rules** (the CBDT numbering skips them), leaving **424** actual rules.

**Missing = 0.** Every CBDT rule that is offline-checkable and has a schema field to test is
enforced by a live check. Build all-gates-green (G0–G7).

## The three offline-impossible rules (cannot be done by any offline utility)
- **A48** — the assessee's name must match the PAN master database (external CPC DB).
- **A167** — a return originally filed u/s 142(1) cannot be revised; ITR-4's schema stores only the
  original receipt no. + date, not the section, so there is no field to test.
- **A379** — 10(23EE) Core-SGF exemption: the ITR-4 `TaxExmpIntIncDtls` SubCategory enum has no such
  value, so the amount cannot be represented, let alone checked.

## One defect found by the census and FIXED this session
- **A346** (co-owned property: assessee's share + co-owners' shares must total 100%) was **dead code**:
  the live `A(346)` at `61_rules_g0.js:143` sat inside a `PropCoOwnedFlg==="Y"` guard while the exporter
  writes the enum value `"YES"`, so it never fired. Re-added as a live check in
  `61_rules_fix_06.js` with the correct `"YES"` guard (alongside the already-corrected A404/A405).
  Rebuilt; G0–G7 green; the lawful test client (properties `co:"NO"`) does not trip it.
  This moved the slice from Missing=1 to **Missing=0**.

## Method / integrity
Each agent read the CBDT rule text (`RULES_ALL.md`), the Sep-17 per-batch audit verdicts, and the
CURRENT engine (base `60_rules.js` + `61_rules_g0/g1/g2.js` + fix batches `61_rules_fix_01..07.js`),
and confirmed the enforcement chain: fix batches register via `ruleset()` → `_RULEBATCHES`, are run by
`runRules()` in `60_rules.js`, and are inlined into the shipped HTML. Category-B rules are encoded by
reusing the B-number as an A-number (B2→A(2), B4→A(4), B6→A(6), B7→A(7) in fix_06; B8→A(8), B9→A(9) in
fix_07). Per-slice detail: `census/CENSUS_A0001-0200.md`, `census/CENSUS_A0201-END.md`.
