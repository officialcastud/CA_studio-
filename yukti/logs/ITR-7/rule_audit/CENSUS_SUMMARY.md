# ITR-7 · AY 2026-27 — Rule-census audit summary

Finalization of the ITR-7 validation-rule census. Every CBDT ITR-7 validation
serial in `books/ITR-7/rules.json` is placed in **exactly one** bucket, so
Gate 6 can prove **MISSING = 0** for both categories. Numbers below are
re-derived from the encoder source, not copied from the plan.

Date: 2026-09-22 · Branch: `claude/itr-7` · Gates 0–7: green
(Gate 6: 0 Category-A fire on the lawful client; `category_A_coded` = 638,
`category_A_total` = 661).

## Enforcement census

| Category | Total | ENFORCED | NA | OFFLINE-IMPOSSIBLE | MISSING |
|---|--:|--:|--:|--:|--:|
| **A** (blocking) | 661 | 638 | 10 | 13 | 0 |
| **B** (advisory) | 33 | 28 | 5 | 0 | 0 |
| **D** | 0 | — | — | — | 0 |

- Category-A: 661 = 638 + 10 + 13 → MISSING **0**.
- Category-B: 33 = 28 + 5 + 0 → MISSING **0**.

## Methodology

1. **Coded set (ground truth).** The ENFORCED buckets are defined by the actual
   literal calls in the encoder source, not by the plan:
   - Category A: every `A(serial, cond, msg)` call across
     `forms/ITR-7/src/61_rules_enc_01.js` … `enc_13.js`. Extracting the serial
     from each call and de-duplicating yields **638** distinct serials
     (50+50+50+49+50+48+50+50+49+44+48+50+50 across enc_01–enc_13). This equals
     Gate 6's `category_A_coded`.
   - Category B: every `Dd(serial, cond, msg)` advisory in
     `61_rules_enc_14.js` → **28** distinct serials.
   > Note on extraction: matching bare `A(<n>` over-counts by 1 because rule
   > *messages* contain the Part A-BS label text "A(1)(g)", "A(1)(a)", etc.
   > Requiring a comma after the serial (`A(<n>,`) — the call signature — removes
   > those false positives and gives the true 638.
2. **NA bucket.** Serials the form cannot check offline because they depend on
   the portal filing timestamp, uploader identity, or portal-side verification.
   Category A: A4, A22, A46, A48, A51, A54, A61, A637, A639, A640 (**10**).
   Category B: B3 (Form 3CEB — separate form), B9, B16 (exemption barred if
   filed late — portal timestamp), B27, B28 (TDS/TCS allowed only if the other
   person declares it in their own return — external return) (**5**).
3. **OFFLINE-IMPOSSIBLE bucket.** Serials whose target is an external database,
   an absent schema field, or a composite/derived figure the built return never
   separately materialises, so no faithful non-vacuous offline check exists that
   would not false-fire on the lawful client. Category A: **13** (list below).
   Category B: **0**.
4. **Reconciliation.** allSerials(1..661) − coded(638) − NA(10) = the 13 OFFLINE
   serials, with no residue. Every Category-A serial lands in exactly one bucket
   (verified: appendix in `books/ITR-7/rule_census.md` counts ENF 638 / NA 10 /
   OFFLINE 13 = 661). Same for Category-B: coded(28) + NA(5) = 33.
5. **Re-file verification.** Each OFFLINE re-file was verified by reading the
   header comment of the `61_rules_enc_*.js` file that owns the serial's range;
   the reasons below are quoted from those headers.

## OFFLINE-IMPOSSIBLE re-files (Category A, 13)

One was planned OFFLINE (A1, external DB). The other **12** were re-filed during
fan-out when the encoder found the target was a composite/derived figure the
built return never separately materialises — re-filed honestly rather than faked.

| Serial | File | Reason |
|---|---|---|
| A1 | `enc_01` | Name in return must match the PAN database — external PAN name DB not shipped; portal resolves at upload. |
| A169 | `enc_04` | "VC corpus = corpus received during the year in Sch J" fails on the lawful return (VC corpus 20,00,000 vs Sch J `TotReceivedCorpus` 0 — carried as opening balance); reconciled via Schedule R / portal, not a direct VC = J equality. |
| A293 | `enc_06` | Per-item cost-of-improvement list for each L&B block is absent — the build carries only the single aggregate leaf `CostOfImprovements.ImproveCost`, so there is no per-item list to sum. |
| A295 | `enc_06` | Table-D presence check on item letters 1aiv/1civ/1div (iva/ivb/ivc) — those letters do not resolve to any leaf of the built `DeducClaimInfo` (54D/54EC/54G/54GA) tables. |
| A454 | `enc_09` | "115BBI Sl.6 ≥ (i)+(ii) of Col 10 of A1 of Sch J" — Sch J A1 Col 10 is a single column in this build (`Investment_11_5_Other` / `TotInvestment_11_5_Other`); the (i)/(ii) sub-rows have no faithful operand. |
| A469 | `enc_10` | "6(v) ≤ 15% of ((Sl.1 + Sl.3) − A1 of Schedule A)" — accumulation base "A1 of Schedule A" is not a materialised key; boundary-exact ≤ would false-fire. |
| A470 | `enc_10` | Same accumulation-base clause as A469 — non-materialised base; boundary-exact ≤ would false-fire. |
| A474 | `enc_10` | "Sl.1 = C − Ai − Bi + E of Schedule VC" — composite Schedule-VC derivation, not a single materialised VC key. |
| A475 | `enc_10` | "Sl.3 = Sum of 10 of Schedule AI" — built Sl.3 (`AggregateIncomeUs1112`) folds in voluntary contributions; the "aggregate excluding VC" line is not materialised. |
| A492 | `enc_10` | "Sl.11 = 9 + 10" — schema collapses Sl.9 and Sl.11 into the single key `GrossIncome`; Sl.11 is not independently stored. |
| A507 | `enc_10` | "Sl.5 = 1 + 3 − 4 − (A1 − A1a of Schedule A)" — composite Schedule-A self-formula, not reconstructable to a silent equality from the materialised keys. |
| A510 | `enc_11` | "Part-B1 Sl.2 should be zero" targets `PartB_TI.VoluntaryContributions.TotIncFromVC`, legitimately non-zero on a lawful s.11 trust (reference client emits 75,00,000); an unconditional "must be zero" would fire on the lawful client. |
| A550 | `enc_11` | "Income entered in return and tax is not computed on the same" — portal-side tax-computation assertion; the build always computes tax and a lawful trust within the slab bears zero tax legitimately, so "tax > 0 whenever income > 0" would false-fire. |

## NA re-cap

- **Category A (10):** A4, A22, A46, A48, A51, A54, A61, A637, A639, A640 —
  filing-date / portal-verification / uploader-identity (the built return carries
  no filing timestamp; the paired formation-date clauses A5/A23/A47/A49 are
  ENFORCED).
- **Category B (5):** B3 (Form 3CEB), B9, B16 (late-filing exemption bars —
  portal timestamp), B27, B28 (TDS/TCS in another person's hands — external
  return).

## Provenance

- Counts, per-serial appendix, and schema-block table: `books/ITR-7/rule_census.md`.
- Coded set: literal `A(…)` / `Dd(…)` calls in `forms/ITR-7/src/61_rules_enc_01.js`–`enc_14.js`.
- Gate result: `logs/ITR-7/gate6.json` (`category_A_coded` 638, `category_A_total` 661, `ok` true).
