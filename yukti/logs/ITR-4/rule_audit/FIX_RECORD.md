# ITR-4 — validation-rule enforcement FIX pass

The audit found 122 unenforced/weak Category-rules (105 GAP + 17 WEAK of 426). This pass encodes them into
the rule engine as guarded `A(n,cond,msg)` / `Dd(n,cond,msg)` checks, split across seven new registered
batch files `forms/ITR-4/src/61_rules_fix_01..07.js` (each a `ruleset(...)`; no existing file edited, so the
batches never collided). Every check is guarded so it stays silent on a valid/empty return.

**Result: Gate 6 GREEN, Gate 7 GREEN.** All gates 0–7 green; the lawful S SUDHIR return validates with zero
schema errors, round-trips byte-identical, hand figures match to the rupee.

## Test-client correction (rule 14 — the client must be lawful)
- **A225** fired on the test client: it claimed 80CCH (Agnipath) with `empcat:"OTH"`, but 80CCH is lawful
  only for Central-Government employment. Fixed the client (`empcat` → `CGOV`); c80ccd2 ₹50,000 stays within
  both the 10% and 14% salary caps, so GTI/TI/tax are unchanged. Acceptance return JSON refreshed.

## ENGINE defect — FIXED (engine-correctness pass)
- **A143** — old-regime standard deduction u/s 16(ia) must be ≤ ₹50,000, but the engine computed
  `min(75000, netSal)` in BOTH regimes (over-deducting ₹25,000 old-regime). **Fixed:**
  `70_sec_inccore.js` now uses `min(isNew()?75000:50000, netSal)`; A143 enabled and live. The client's
  figures were re-derived to the rupee: income from salary +₹25,000 ⇒ GTI ₹16,96,500, TI ₹7,40,500, tax
  ₹42,224 (was a ₹4,580 refund, now a ₹620 balance due). Gate 6 & 7 green.

## Not mappable (no schema key exists in ITR-4 for the rule's field — documented as comments in-file)
- 167 (original-return section for a 142(1) revision), 188 second half (148-proceeding bar), 225 age-17–27
  limb (date of joining armed forces), 379 (10(23EE) — no such SubCategory enum in ITR-4).

## Census follow-up — dead-code defect found and FIXED
- **A346** (co-owned property: assessee's share + co-owners' shares must total 100%). The full-census
  re-count found the live `A(346)` at `61_rules_g0.js:143` was **dead**: its guard `PropCoOwnedFlg==="Y"`
  never matches the exporter's `"YES"` enum, so it never fired, and no STRUCT covered the 100% sum
  (A404 covers only the non-co-owned case; A405/A406 constrain individual shares, not the total).
  Counter-example that passed every live check: co-owned, assessee 50% + one co-owner 20% = 70%.
  **Fixed:** re-added in `61_rules_fix_06.js` with the correct `PropCoOwnedFlg!=="YES"` guard, beside
  the already-corrected A404/A405. Rebuilt; G0–G7 green; lawful client (properties `co:"NO"`) unaffected.
  This closed the last MISSING serial — census Missing is now **0**. See `CENSUS_SUMMARY.md`.

## Coverage
105 GAP + 17 WEAK addressed. Live checks cover the salary 10-exemption caps, presumptive thresholds
(44AD/44ADA/44AE), 80G cash-vs-other-mode splits, Chapter VI-A caps and acknowledgements, TDS special-rate
code checks, 234-I late fee, Aadhaar/139AA, co-ownership shares, and the 10-IEA regime-election chain.
Remaining not-enforced: A143 (held for the engine fix) + the 4 not-mappable serials above.
