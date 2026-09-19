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

## Engine-correctness pass — all 6 held checks FIXED and re-enabled (Gates 5/6/7 green; GTI/TI & net tax unchanged)
| Rule | Kind | Fix |
|---|---|---|
| A870 | **engine** | Schedule SI special-rate CG heads now scaled to post-BFLA (`S.C.loss.afterB` = BFLA col 5). SI computes after the loss engine via a decoupled compute order (`corder:46` in the registry; `90_wiring.js` sorts by `corder||order`), so the special-rate income **and its tax** reflect brought-forward-loss set-off. SI 2A: 3,00,000 → 2,20,000 = BFLA 5x. |
| A426, A452 | **engine** | `expCg` now scales Table F quarters to post-BFLA (BFLA col 5), remainder into the last quarter so each rate row sums exactly. STCGAppRate 4,50,000 → 4,00,000; LTCG12.5 3,00,000 → 2,20,000. All 6 heads live. |
| A237 | test-data | Trading account reconciled (`Purchases` 60,00,000 → 88,15,000) so P&L PBT (item 53) = BP item 1 = 11,10,000. Business income is driven by `bp.pbt`, so GTI is unchanged. |
| A271 | test-data | P&L `DepreciationAmort` 25,000 → 80,000 to match BP item 11; business income unaffected. |
| A891 | test-data | FSI-UK foreign income moved from HP (Schedule HP is a net loss → no headroom) to CG (headroom 9,50,000). Non-DTAA (sec 91) ₹25,000 relief preserved, so net tax is unchanged. |

**Impact of the two engine bugs on real returns:** any return with brought-forward capital losses previously
showed/taxed special-rate income pre-set-off. Now Schedule SI, CG Table F and the special-rate tax all use the
post-BFLA figure (BFLA col 5), matching the portal. For S SUDHIR the *payable* tax is AMT-driven (unchanged at
net ₹2,91,835); the normal-tax line rose correctly as the 80k moved out of the 12.5% bucket, but AMT > normal so
the payable did not change.

Only A972 remains not-live (IFSC vs the external RBI master — format already enforced by `IFSC_RE`).

## Not mappable (no schema key / offline-uncheckable — documented in-file)
- A972 — IFSC vs the RBI master database (external; the IFSC *format* is already enforced by `IFSC_RE`).

## Coverage
133 GAP + 36 WEAK addressed. Live: ~161 checks — salary 10-exemption caps, presumptive thresholds,
Chapter VI-A caps/acknowledgements, Schedule OS quarterly & special-rate reconciliations, CG deduction-claim
detail, loss set-off order, AMT triggers, DTAA/relief, Category-B advisories (as Dd). Held: the 6 above +
A972. Recommended follow-up: a focused engine-correctness pass (Table F ↔ BFLA, SI ↔ BFLA) plus test-client
reconciliation (bp.pbt, bp.depDebPL, FSI-UK HP), then re-enable the 6 held checks.
