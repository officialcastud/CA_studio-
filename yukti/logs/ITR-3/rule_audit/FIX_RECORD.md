# ITR-3 — validation-rule enforcement FIX pass

The audit found 169 unenforced/weak rules (133 GAP + 36 WEAK of 1056). This pass encodes them into the rule
engine as guarded `A(n,cond,msg)` / `Dd(n,cond,msg)` checks across nine new registered batch files
`forms/ITR-3/src/61_rules_fix_01..09.js` (each a `ruleset(...)`; no existing rule file edited, so the batches
never collided). Every check is guarded to stay silent on a valid/empty return.

**Result: Gates 5, 6, 7 GREEN** on a fresh build (the isolation harness `/tmp/verify_rules.js` confirms zero
Category-A firings on the lawful client; only the two non-blocking D1 advisories fire). GTI ₹32,73,500 / TI
₹17,86,500 unchanged to the rupee; full return validates with 0 schema errors and round-trips byte-identical.

## Engine bug FIXED in this pass (correctness — the software was producing a wrong return)
- **A966 / A967 — foreign-tax relief u/s 90/90A & 91 was never applied.** `70_sec_tax.js` computed the net
  tax reading dead fields `S.C.trDTAA` / `S.C.fsi.dtaaRel` (never set), so `PartB_TTI…TaxRelief` exported
  empty while Schedule TR showed ₹1,00,000 (DTAA) + ₹25,000 (non-DTAA). The taxpayer was **overcharged
  ₹1,25,000**. Fixed to read `S.C.fa.dtaa` / `S.C.fa.notDtaa` (the same FA-engine values Schedule TR exports).
  Relief now applied; A966/A967 reconcile and pass. GTI/TI unaffected (relief is post-tax).

## HELD — 6 checks written but commented (they expose deeper defects; re-enable after the fix). See in-file `HELD` notes.
| Rule | Kind | Defect |
|---|---|---|
| A237 | test-data | client `S.bp.pbt` (11,10,000) ≠ P&L PBT (39,80,000) — BP item 1 inconsistency |
| A271 | test-data | client `S.bp.depDebPL` (80,000) ≠ P&L depreciation (25,000) — BP item 11 inconsistency |
| A426, A452 | **engine** | Schedule CG Table F quarterly break-up is built from pre-set-off land-sale rows, not BFLA col 5 (`70_sec_cg.js` `Fauto`). The 112A gain never reaches Table F; brought-forward losses aren't netted |
| A870 | **engine** | Schedule SI 2A (112A) uses the pre-BFLA CG bucket (3,00,000) instead of the post-BFLA figure (BFLA 5x = 2,20,000) — `70_sec_si.js` should read post-BFLA |
| A891 | test-data | client's FSI (UK) row claims HP relief on 3,00,000 foreign HP income while Schedule HP 1k+2 is −2,14,000 |

These change either the canonical client's business income / CG-schedule presentation or need test-data
reconciliation, so they were held rather than guessed. The other 4 Table-F heads (451/425/427/428) stay live.

## Not mappable (no schema key / offline-uncheckable — documented in-file)
- A972 — IFSC vs the RBI master database (external; the IFSC *format* is already enforced by `IFSC_RE`).

## Coverage
133 GAP + 36 WEAK addressed. Live: ~161 checks — salary 10-exemption caps, presumptive thresholds,
Chapter VI-A caps/acknowledgements, Schedule OS quarterly & special-rate reconciliations, CG deduction-claim
detail, loss set-off order, AMT triggers, DTAA/relief, Category-B advisories (as Dd). Held: the 6 above +
A972. Recommended follow-up: a focused engine-correctness pass (Table F ↔ BFLA, SI ↔ BFLA) plus test-client
reconciliation (bp.pbt, bp.depDebPL, FSI-UK HP), then re-enable the 6 held checks.
