# The book of Schedule MATC — ITR-6, A.Y. 2026-27

Read from the utility's **MATC** sheet (`sheet52.xml`, **visible**, 34 rows,
**3 hidden rows**), with every column header, the data-validation lists and the
cell formulas, confirmed against the schema block `ScheduleMATC` and the
validation-rules document (Schedule MATC, serials 677–685; Part B-TTI feeds
769, 772, 773).

Schedule MATC is *"Computation of tax credit under section 115JAA"* — the
**MAT credit**. MAT paid in a year under section 115JB above the tax that would
have been payable under the normal provisions becomes a **credit**, carried
forward up to **fifteen assessment years** (s.115JAA(3A)), and set off in a
later year when the normal tax exceeds the MAT of that year. It is ITR-6's
counterpart to Schedule AMTC (s.115JD) on ITR-2/ITR-5 — same shape, MAT
figures instead of AMT.

---

## 1 · When MATC applies on ITR-6

- **Only a domestic company** — rule 685: MAT/MATC are filled only where Type of
  Company in Part A-General is *"Domestic company"*.
- **Not if the concessional regime is opted** — rule 683: *"If taxpayer is
  opting for tax regime under section 115BAA or 115BAB, then MATC should not be
  filled."* The sheet enforces this: the balance-carried-forward column `K`
  forces **0** when `MID(sheet1.NRI_115BA_1,9,6)` is `"115BAA"` or `"115BAB"`,
  and the head figures (`J4:J6`) are 0 when `MATCSchLocked = TRUE`.
- **Credit is usable only where normal tax exceeds MAT** in the current year —
  the current-year available headroom (item 3) is the ceiling on set-off.

---

## 2 · The three head lines — items 1, 2, 3

| Item | Sheet cell | Label | Schema key | Formula |
|---|---|---|---|---|
| **1** | E4 · `J4` | Tax under section 115JB in assessment year 2026-27 (1d of Part-BTTI) | `TaxUs115JBCurrAssYr` | `J4 = IF(MATCSchLocked, 0, sheet9.TotalTax_DI)` — the MAT (incl. surcharge + cess) at **Part B-TTI 1d** |
| **2** | E5 · `J5` | Tax under other provisions of the Act in assessment year 2026-27 (2f of Part-BTTI) | `TaxOthProvCurrAssYr` | `J5 = IF(MATCSchLocked, 0, Sheet9.GrossTaxLiability)` — the normal tax at **Part B-TTI 2f** |
| **3** | E6 · `J6` | Amount of tax against which credit is available [enter (2 – 1) if 2 is greater than 1, otherwise enter 0] | `AmtOfTaxWithCred` | `J6 = IF(MATCSchLocked, 0, MAX(0, TaxOthProvisions − TaxSection115JC))` = **MAX(0, item 2 − item 1)** |

**Rules on the head:**
- Rule 677: *item 1 = 1d of Part B-TTI.*
- Rule 678: *item 2 = 2f of Part B-TTI.*
- Rule 679: *item 3 = (2 − 1), only if 2 > 1.*
- Rule 680: *item 3 = 0 when 2 ≤ 1.*

Item 3 is the **headroom** for the year: MAT credit can be set off only up to the
amount by which normal tax exceeds the MAT of the current year.

---

## 3 · Item 4 — Utilisation of MAT credit available (the table)

Sheet row 7 (E7) heads the table: *"Utilisation of MAT credit Available [Sum of
MAT credit utilised during the current year is subject to maximum of amount
mentioned in 3 above and cannot exceed the sum of MAT Credit Brought Forward]."*

### Column header — row 8

| Col | Header (E8:K8) |
|---|---|
| A | Assessment Year (A) |
| B1 | Gross (B1) |
| B2 | Set-off in earlier years (B2) |
| B3 | Balance Brought forward (B3 = B1 − B2) |
| C | MAT Credit Utilised during the Current Year (C) |
| D | Balance MAT Credit Carried Forward (D) = (B3) − (C) |

### The rows — fifteen carry-forward years + the current year

The schema array `ScheduleMATC.UtilMATCredAvl[]` holds the **fifteen prior
assessment years**, `AssYr` from the fixed 15-value enum
**2011-12, 2012-13, 2013-14, 2014-15, 2015-16, 2016-17, 2017-18, 2018-19,
2019-20, 2020-21, 2021-22, 2022-23, 2023-24, 2024-25, 2025-26** (`maxItems 15,
minItems 1`). On the sheet these are the visible rows **12 (S.No i, 2011-12)**
through **26 (S.No xv, 2025-26)**. The current year **2026-27 (S.No xvi, row 27)**
and the **Total (S.No xvii, row 28)** are separate fields, not array members.

| Column | Schema key (array item) | Type | Derivation |
|---|---|---|---|
| A — Assessment Year | `UtilMATCredAvl[].AssYr` | string enum (15 years) | fixed per row |
| B1 — Gross | `UtilMATCredAvl[].MATCredGross` | integer ≥ 0 | typed — MAT credit originally generated in that year |
| B2 — Set-off in earlier years | `UtilMATCredAvl[].MATCredSetOff` | integer ≥ 0 | typed — credit of that year already used in years before this |
| B3 — Balance brought forward | `UtilMATCredAvl[].MATCredBF` | integer ≥ 0 | computed `I = MAX(0, B1 − B2)` |
| C — Utilised current year | `UtilMATCredAvl[].MATCredUtilCurrYr` | integer ≥ 0 | computed — set off oldest year first, total capped at item 3 and at Σ B3 |
| D — Balance carried forward | `UtilMATCredAvl[].BalMATCredCF` | integer ≥ 0 | computed `K = IF(115BAA/115BAB, 0, MAX(0, B3 − C))` |

All six array leaves are **schema-required** on every row present.

### The current-year row (S.No xvi, 2026-27, row 27)

| Item | Sheet cell | Label | Schema key | Formula |
|---|---|---|---|---|
| — | F27 | 2026-27 (enter 1 − 2, if 1 > 2 else enter 0) | `CurAssYr` (enum **2026-27**) | the current AY |
| B1 | G27 | Gross credit generated this year | `MATCredGrossCurAY` | `G27 = MAX(0, (TaxSection115JC − TaxOthProvisions − IF((TotTaxRelief − GrossTaxLiability) > 0, (TotTaxRelief − GrossTaxLiability), 0)))` — this year's **MAT above normal tax** (item 1 − item 2, floored at 0), net of any tax relief; it becomes the new credit |
| D | K27 | Balance carried forward | `BalMATCredCFCurAY` | `K27 = AMTC.AmtCreditFwd26_27` — the current year's own gross carried forward (no set-off against itself in the year it arises) |

Columns B2 and C do not apply to the current-year row (a credit is not set off in
the year it is created).

### The totals (S.No xvii — Total, row 28)

| Item | Sheet cell | Label | Schema key | Formula |
|---|---|---|---|---|
| 4B1 total | G28 | Total Gross | `TotMatCredGross` | `SUM(G12:G27)` |
| 4B2 total | H28 | Total Set-off in earlier years | `TotMatCredSetOff` | `SUM(H12:H27)` |
| 4B3 total | I28 | Total Balance brought forward | `TotMatCredBF` | `SUM(I12:I27)` |
| 4C total | J28 | Total Utilised current year | `TotMatCredUtilCurrYr` | `SUM(J12:J27)` |
| 4D total | K28 | Total Balance carried forward | `TotBalMATCredCF` | `SUM(K12:K27)` |

All five totals are **schema-required**.

---

## 4 · Items 5 and 6 — the two closing lines

| Item | Sheet cell | Label | Schema key | Formula |
|---|---|---|---|---|
| **5** | E29 · `J29` | Amount of tax credit under section 115JAA utilized during the year [enter 4(C) xvii] | `AmtTaxCredUs115JAA` | `J29 = AMTC.AmtCreditUtilized_Total` = **Total of column C (item 4C xvii)** — feeds Part B-TTI as the credit against tax |
| **6** | E30 · `J30` | Amount of MAT liability available for credit in subsequent assessment years [enter 4(D) xvii] | `AmtMATLiabAllAssYrAvailSubseqYr` | `J30 = AMTC.BalAmtCreditCarryFwd_Total` = **Total of column D (item 4D xvii)** |

**Rules:**
- Rule 681: *item 5 = Total of item 4C(xvii).*
- Rule 682: *item 6 = Total of item 4D(xvii).*

---

## 5 · The rules that govern the credit

- **Credit is set off only where normal tax exceeds MAT** — item 3 (= 2 − 1, if
  2 > 1) is the ceiling on the total of column C for the year; and the total of C
  can never exceed the sum of balances brought forward (Σ B3). (Row-7 header.)
- **Oldest year first** — the fifteen-year window runs out on the earliest row,
  so brought-forward credit is consumed from 2011-12 upward.
- **The current year's excess of MAT over normal tax becomes the new credit** —
  row xvi (2026-27), `G27 = MAX(0, item 1 − item 2 − relief)`, the same two head
  figures with the sign reversed.
- **Fifteen-year window (s.115JAA(3A)).** The table's earliest **live** row is
  2011-12, which is fifteen years back from 2026-27; credit older than that has
  lapsed — hence the two hidden rows (see §7).
- Rule 773 (Part B-TTI): the 115JAA credit **cannot be claimed if 2f < 1d** —
  i.e. no set-off in a year MAT is the higher tax.

---

## 6 · Dropdowns on this sheet

MATC has **no value-list dropdowns** — every data-validation range on the sheet
(J4:J6, G9:K27, J29, J30, F9:F27) is numeric-only with a null value list. The
`AssYr`/`CurAssYr` year strings come from the schema enums, not from a sheet
dropdown.

---

## 7 · Hidden rows — not built

| Row | S.No | Assessment Year | Why hidden |
|---|---|---|---|
| 9 | — | (blank template/spacer row) | no content — spacer |
| 10 | i | **2009-10** | outside the fifteen-year window — credit lapsed |
| 11 | ii | **2010-11** | outside the fifteen-year window — credit lapsed |

These three rows are hidden in the utility (`hidden_rows: 3`) and are **not**
built or filed; the schema `AssYr` enum starts at 2011-12 accordingly.

---

## 8 · What is mandatory · what repeats

**Schema-required** (block written when a credit exists or arises):
`TaxUs115JBCurrAssYr`, `TaxOthProvCurrAssYr`, `AmtOfTaxWithCred`,
`MATCredGrossCurAY`, `BalMATCredCFCurAY`, the five totals (`TotMatCredGross`,
`TotMatCredSetOff`, `TotMatCredBF`, `TotMatCredUtilCurrYr`, `TotBalMATCredCF`),
`AmtTaxCredUs115JAA`, `AmtMATLiabAllAssYrAvailSubseqYr`; and on each present
year row all six of `AssYr`, `MATCredGross`, `MATCredSetOff`, `MATCredBF`,
`MATCredUtilCurrYr`, `BalMATCredCF`. `CurAssYr` and `UtilMATCredAvl[]` itself are
schema-optional containers.

**What repeats:** the `UtilMATCredAvl[]` year rows — up to **fifteen**, the fixed
assessment years 2011-12 to 2025-26. Nothing else repeats.

**Cross-source observations (report):**
1. **Sheet label lag on item 1.** Rule 677 text reads *"Tax under section 115JB
   in assessment **year 2025-26**"*, whereas the sheet cell E4 and schema
   (`…CurrAssYr`, `CurAssYr` enum) are for **2026-27**. The rules PDF carries a
   stale year in that one line; the correct current AY is 2026-27.
2. **Utility computes MATC through the AMTC named ranges.** Every MATC output
   formula points at `AMTC.*` objects — `J6 = MAX(0, AMTC.TaxOthProvisions −
   AMTC.TaxSection115JC)`, `G27` uses `AMTC.TaxSection115JC/TaxOthProvisions`,
   `K27 = AMTC.AmtCreditFwd26_27`, `J29 = AMTC.AmtCreditUtilized_Total`,
   `J30 = AMTC.BalAmtCreditCarryFwd_Total`. The utility reuses one shared
   credit-engine object for both AMT and MAT credit; the **filed** block is
   `ScheduleMATC`. Build the engine against the MATC schema keys, reading the
   115JB/normal-tax figures from Part B-TTI.
3. **S.No re-lettering.** The visible table restarts at S.No **i** for 2011-12
   (row 12), running i…xv for 2025-26 (row 26), **xvi** for the current 2026-27
   (row 27) and **xvii** for the Total (row 28); the hidden 2009-10 / 2010-11
   rows carry the same i/ii letters but are not part of the filed table.

---

## 9 · Cross-sheet feeds

**In:**
- Item 1 `TaxUs115JBCurrAssYr` ← **Part B-TTI 1d** (`sheet9.TotalTax_DI`, MAT +
  surcharge + cess) — sourced from Schedule MAT item 10.
- Item 2 `TaxOthProvCurrAssYr` ← **Part B-TTI 2f** (`Sheet9.GrossTaxLiability`).
- Current-year gross (G27) ← this year's 115JB vs. normal-tax excess.
- Regime flag `sheet1.NRI_115BA_1` (115BAA/115BAB → MATC not filled) and
  domestic-company flag — from **Part A-General**.

**Out:**
- Item 5 `AmtTaxCredUs115JAA` → **Part B-TTI point 4** (Credit under section
  115JAA of tax paid in earlier years) — rule 772; not claimable if 2f < 1d
  (rule 773). Part B-TTI 5 (tax payable after 115JAA credit) = 3 − 4 (rule 769).
- Item 6 `AmtMATLiabAllAssYrAvailSubseqYr` → the MAT credit carried into future
  years.

---

## 10 · What this means for the build

1. **Build the three head lines, the fifteen-year table with a current-year row
   and totals, and the two closing lines.** The array is fixed to the fifteen
   assessment years 2011-12 … 2025-26.
2. **Applicability gates:** show/file MATC only for a **domestic company** on the
   normal regime; force every carried-forward balance and the head figures to
   **0** under 115BAA/115BAB.
3. **Engine, from this sheet's cells:** item 3 = max(0, item 2 − item 1);
   per row B3 = max(0, B1 − B2); set off column C **oldest year first**, total C
   capped at item 3 **and** at Σ B3; D = max(0, B3 − C); current-year gross
   G27 = max(0, item 1 − item 2 − relief); totals are the column sums; item 5 =
   Σ C; item 6 = Σ D.
4. **Do not build the hidden 2009-10 / 2010-11 rows** — they are outside the
   fifteen-year window.
5. **Feeds:** read item 1 from Part B-TTI 1d (which comes from Schedule MAT
   item 10) and item 2 from 2f; push item 5 to Part B-TTI point 4.
6. **Export** `ScheduleMATC` when a MAT credit is brought forward or arises this
   year.
