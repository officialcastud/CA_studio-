# Hand-traced case — Section `si` (SPI · SI · IF)

Source: `books/ITR-3/SPI_SI_IF.md`, engine `forms/ITR-3/src/70_sec_si.js` (`engSi`).
Verified by running `engSi()` against the inputs below (scratchpad harness).

## Primary case (SI · Schedule SI — the ₹1,25,000 s.112A exemption + rate)

**Facts.** Resident individual, **new regime** (`fs.optout="No"`, so `isNew()`
true). Schedule CG publishes a single special-rate bucket:
`S.C.cg.buckets.si112a = 2,00,000` (LTCG u/s 112A @ 12.5%). Salary etc. put the
gross total income at `S.C.gti = 12,00,000`, so the normal-rate income already
uses the whole basic-exemption limit.

**Trace (matching the book rules O4/P4 and `I28 = ROUND((H−P4)·F/100,0)`).**

| Step | Rule (book) | Figure |
|---|---|---|
| Income (i) | 112A bucket from Schedule CG | ₹2,00,000 |
| s.112A exemption | ₹1,25,000 pool, own-112A first (`P4=MIN(125000, inc)`) | −₹1,25,000 |
| after 112A exemption | | ₹75,000 |
| basic-exemption slack | resident new-regime basic = ₹4,00,000; normal-rate income = GTI − splInc = 12,00,000 − 2,00,000 = ₹10,00,000 ≥ 4,00,000 → slack = **0** (book U19/U22) | −₹0 |
| **Taxable after Min-Chg adj. (ii)** = H | | **₹75,000** |
| **Tax thereon (iii)** = `ROUND(H × 12.5 / 100)` | | **₹9,375** |

`TotSplRateInc = 2,00,000`, `TotSplRateIncCalc = 75,000`,
**`TotSplRateIncTax = 9,375`** (the figure Part B-TTI 2b adds to normal tax).
`S.C.si.income = 0` (SI re-presents CG income already in GTI — it adds nothing).
`S.C.si.tax112A = 9,375`, `S.C.si.cgDivTax = 9,375` (surcharge-capped set).

Engine output: `totInc 200000 · totCalc 75000 · totTax 9375 · income 0` — matches to the rupee.

## Corroborating cases (also run)

- **Resident, only 112A ₹2,00,000, GTI = ₹2,00,000** (all income special →
  normal-rate income 0 → full ₹4,00,000 basic slack). After ₹1,25,000 112A
  exemption → ₹75,000, then basic slack absorbs it → **taxable 0, tax ₹0**.
  (`exemptionBasic = 75,000`.) Confirms the resident basic-exemption walk.
- **Non-resident, 112A ₹2,00,000, GTI = ₹2,00,000** — no basic slack for a
  non-resident (book U19) → taxable ₹75,000, **tax ₹9,375**.
- **Manual heads** (override on): 115BBE ₹5,00,000 @60% = ₹3,00,000 and 115BB
  winnings ₹1,00,000 @30% = ₹30,000 — no ₹1,25,000 or basic exemption applies →
  `TotSplRateIncTax = 3,30,000`; `bbeTax = 3,00,000`. `income 0`.

## Regime both-ways note

Only the *basic-exemption slack rate* switches on `isNew()`: ₹4,00,000 (new)
vs ₹2,50,000 / ₹3,00,000 / ₹5,00,000 by age (old). The special rates, the
₹1,25,000 s.112A exemption, SPI and IF are the same under both regimes (this
section closes nothing on the regime — it only *uses* the regime's basic limit).
The non-resident path (`S.pi.res!=="RES"`) sets the slack to nil either way.
