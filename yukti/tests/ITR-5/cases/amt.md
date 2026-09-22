# Schedule AMT / AMTC (ITR-5) — hand-computed cases

Section `amt` — `forms/ITR-5/src/70_sec_amt.js` (blocks `ScheduleAMT`,
`ScheduleAMTC`). Figures verified to the rupee against the engine (`engAmt`,
`amtcTable`, `expAmt`, `impAmt`) with a stubbed shell (scratchpad harness
`amt_harness.js`). Books: `books/ITR-5/AMT.md`, `books/ITR-5/AMTC.md`.

Rate/floor facts confirmed from the source (AMT sheet39 `[O13]`/`[P12]` and
`DB!O1:O5` MainStatus = 1-Firm / 2-Local Authority / 3-AOP/BOI / 4-AJP):
- **₹20-lakh floor** (`FormulaOfAMT="N"`) applies to **AOP/BOI (status 14)** and
  **AJP (status 9)** only — MainStatus first char "3"/"4". No floor for Firm
  (1) or Local Authority (2).
- **3b rate** = 15% for a **co-operative society** (SubStatus 1a/1b/1c or
  "3-Other Cooperative Society"), else 18.5%. 3a (IFSC units) always 9%.
- New regime (`bacValue=1`, `isNew()` true) zeroes the whole schedule.

---

## Case 1 — Firm, old regime, AMT applies (no floor)

Inputs: status "1" (Partnership Firm); `fs.optout="Yes"` (old regime);
`S.C.loss.gti = 5,000,000`; `S.C.ded.allowed = 1,200,000`,
`partC = 800,000`, `s80P = 100,000`, `ded10AA = 300,000`; 2c input
`S.amt.d35AD = 200,000`; `S.amt.ifsc = 0`; normal-tax `S.C.tax.gross = 700,000`.

Schedule AMT (cell refs from AMT.md):
- sl.1 Total income `[J4]` = round10(MAX(0, 5,000,000 − 1,200,000 − 300,000)) = **3,500,000**
- 2a Part C less 80P `[H6]` = MAX(0, MIN(GTI, 800,000 − 100,000)) = **700,000**
- 2b 10AA `[H7]` = **300,000**
- 2c 35AD `[H8]` (input) = **200,000**
- 2d Total `[H9]` = 700,000 + 300,000 + 200,000 = **1,200,000**
- sl.3 Adjusted `[J10]` = MAX(0, 3,500,000 + 1,200,000) = **4,700,000**
- 3a IFSC = 0; 3b other `[J12]` = 4,700,000 − 0 = **4,700,000**
- sl.4 Tax `[J13]` = ROUND(0.09×0 + 0.185×4,700,000) = **869,500**  (firm ⇒ no floor)
- surcharge = 0 (adjusted ≤ ₹1cr); cess = ROUND(869,500×4%) = **34,780**;
  total 1d = **904,280**

Schedule AMTC (2i = 700,000 < 1d = 904,280):
- item 1 = 904,280; item 2 = 700,000; item 3 = MAX(0, 700,000 − 904,280) = **0**
- no prior rows → used = **0**; current-year credit `[G25]` = MAX(0, 904,280 − 700,000) = **204,280**
- item 5 (utilised) = 0; item 6 (carried forward) = **204,280**

Engine: all figures match. `ScheduleAMT` and `ScheduleAMTC` both exported.

## Case 2 — AOP/BOI, old regime, floor zeroes the tax (adjusted ≤ ₹20L)

Inputs: status "14"; old regime; `gti = 1,500,000`; `allowed = 400,000`,
`partC = 300,000`, `ded10AA = 0`; 2c = 100,000.

- sl.1 = round10(1,500,000 − 400,000 − 0) = **1,100,000**
- 2a = MIN(1,500,000, 300,000) = **300,000**; 2b = 0; 2c = 100,000; 2d = **400,000**
- sl.3 = 1,100,000 + 400,000 = **1,500,000**  (≤ ₹20,00,000)
- sl.4 = **0** — AOP/BOI floor: adjusted ≤ ₹20L ⇒ no AMT (`applies=true`, `payable=false`)

`ScheduleAMT` exported (computation shown, tax 0); `ScheduleAMTC` not exported
(no credit). Engine matches.

## Case 3 — Co-operative society (status 14), old regime, 3b @ 15%

Inputs: status "14", SubStatus "3-Other Cooperative Society"; `gti = 6,000,000`;
`allowed = 1,000,000`, `partC = 600,000`; 2c = 400,000.

- sl.1 = 6,000,000 − 1,000,000 = **5,000,000**; 2a = 600,000; 2d = **1,000,000**
- sl.3 = **6,000,000** (> ₹20L; floor does not zero it)
- sl.4 = ROUND(0.15 × 6,000,000) = **900,000**  (co-op ⇒ 15%)
- cess = 36,000; total 1d = **936,000**

Confirms the co-op 15% branch and that the status-14 floor lifts once
adjusted > ₹20L. Engine matches.

## Case 4 — AMTC brought-forward utilisation (normal tax > AMT)

Inputs: firm, old regime, no add-backs (2d = 0 ⇒ Schedule AMT not built);
prior credit `2013-14` gross 100,000 / set-off 0, `2015-16` gross 50,000 /
set-off 20,000; `S.C.tax.gross = 500,000`.

- balance b/f `[I·n]` = MAX(B1−B2,0): 100,000 and 30,000 → pool (Σ B3) = **130,000**
- item 1 (1d) = 0; item 2 (2i) = 500,000; item 3 = MAX(0, 500,000 − 0) = **500,000**
- utilised oldest-first, capped by MIN(500,000, 130,000): 2013-14 → 100,000,
  2015-16 → 30,000 → used = **130,000**; each row carried fwd = 0
- item 5 = 130,000; item 6 = 0; current-year credit = 0

`ScheduleAMTC` exported with two `ScheduleAMTCDtls` rows; `ScheduleAMT` not
built. Engine matches.

## Case 5 — New regime (AMT closed)

Inputs of Case 1 but `fs.optout="No"` (new regime). Every computed cell = 0;
`applies=false`; neither `ScheduleAMT` nor `ScheduleAMTC` is exported (no prior
credit). Confirms the `bacValue=1` gate. Engine matches.

## Round-trip (rule 12)

Export Case 1 (with a prior AMTC row), `impAmt` into a fresh state, recompute
and re-export: `ScheduleAMT` and `ScheduleAMTC` come out **identical**. Only the
three user inputs (2c `DeductClaimSec35AD`, 3a `AdjustedUnderSec115JCIFSC`, and
the per-AY `AmtCreditFwd`/`AmtCreditSetOfEy`) are restored on import; every other
figure is recomputed.
