# ITR-3 · A.Y. 2026-27 — CBDT validation-rule CENSUS (consolidated)

Independent re-count of **every** CBDT validation rule against the shipped engine
(`forms/ITR-3/Yukti_ITR3.html`), performed by three read-only agents over disjoint serial
ranges, then reconciled here. This is the full census (all rules), not just the GAP/WEAK
subset in `TICK_SHEET.md`.

## Result

| Slice | Total | Enforced | NA | Offline-impossible | Missing |
|---|---|---|---|---|---|
| A1–A350 | 350 | 341 | 7 | 2 | 0 |
| A351–A700 | 350 | 347 | 3 | 0 | 0 |
| A701–A999 + B + D | 356 | 336 | 11 | 9 | 0 |
| **TOTAL** | **1056** | **1024** | **21** | **11** | **0** |

All 1056 serials are in the CBDT document (no phantom serials).

**Missing = 0.** Every CBDT rule that is offline-checkable and has a schema field to test is
enforced by a live check. Build all-gates-green (G0–G7).

## The 11 offline-impossible rules (cannot be done by any offline utility)
- **A972** — IFSC must be a member of the RBI master database (external DB; the IFSC *format* is
  enforced by `IFSC_RE`, membership is validated by the portal).
- **A3 / A4** — name / senior-citizen DOB must match the PAN master database (external DB).
- **8 Category-B external-form value reconciliations** — where the amount reported on an external
  form (Form 29C AMT, 10AA↔56F, 80JJAA↔10DA, 80-IA/IB/IAB/IE/IBA↔10CCB) has no schema field to
  compare against. Their **presence-side** notices (claim made ⇒ file the form) *are* enforced as
  Category-D `Dd()` advisories.

## NA (21) — informational / portal / database, no offline JSON condition
Name/Aadhaar/DOB profile matches (A31/A32 …), prior-return & prior-notice status (A5, A19, A35/A36),
uploader-identity (A8), AIS/26AS nudges, PAN–Aadhaar linking, and pure "kindly fill" advisories
(e.g. A549) — the same class the official CBDT utility also leaves to the portal.

## Method / integrity
Each agent read the CBDT rule text (`RULES_ALL.md`), the Sep-17 per-batch audit verdicts, and the
CURRENT engine (base `60_rules.js` + `61_rules_g0..g5.js` + fix batches `61_rules_fix_01..09.js`),
and confirmed the enforcement chain: fix batches register via `ruleset()` → `_RULEBATCHES`, are run
by `runRules()` in `60_rules.js`, and are inlined into the shipped HTML. Loop-coded CG rules
(425–428/451/452 Table F, 459/462/463/464 loss caps) were verified inside their loop arrays, not
assumed. Category-B/D rules were disambiguated by message text, not serial number, because numbers
collide across A/B/D in the `Dd()` registry. Per-slice detail:
`census/CENSUS_A0001-0350.md`, `census/CENSUS_A0351-0700.md`, `census/CENSUS_A0701-END.md`.
