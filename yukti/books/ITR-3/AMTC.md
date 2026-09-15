# The book of Schedule AMTC — ITR-3, A.Y. 2026-27

Read from the utility's **AMTC** sheet (rows 3–25, all visible — no hidden rows),
with its formulas and constant fills, and confirmed against schema block
`ScheduleAMTC` and the rules document (`books/ITR-3/rules.json`, serials at
lines 4200–4240). The ITR-2 AMTC book was read as a style model only; every
figure, item number and rule below is ITR-3's own.

---

## The shape

**Schedule AMTC — "Computation of tax credit under section 115JD."** Alternate
Minimum Tax paid in an earlier year, to the extent it exceeded normal tax, is a
**credit** carried forward and set off in a later year when normal tax exceeds
AMT. The schedule has three head lines (1 tax under 115JC this year, 2 tax under
other provisions, 3 credit available this year), a year-by-year utilisation
table (Sl.No. item 4) spanning thirteen prior assessment years plus the current
AY row and a total row, and two closing totals (5 credit utilised, 6 liability
carried to subsequent years). It is computed almost entirely from Part B-TTI and
from the typed carry-forward figures.

---

## The items

### Block `ScheduleAMTC`

| Sheet item | Field label | Type | Schema key | Rule / notes |
|---|---|---|---|---|
| **1** | AMT CREDIT — Tax under section 115JC in assessment year 2026-27 (1d of Part-B-TTI) | integer | `TaxSection115JC` | `[L4]= sheet9.TotalTax_DI`; = Sl.No. 1d of Part B-TTI |
| **2** | Tax under other provisions of the Act in assessment year 2026-27 (2i of Part-B-TTI) | integer | `TaxOthProvisions` | `[L5]= Sheet9.GrossTaxLiability`; = Sl.No. 2i of Part B-TTI |
| **3** | Amount of tax against which credit is available [enter (2 – 1) if 2 is greater than 1, otherwise enter 0] | integer | `AmtTaxCreditAvailable` | `[L6]= MAX(0,AMTC.TaxOthProvisions-AMTC.TaxSection115JC)`; zero when 2 ≤ 1 |
| **4** | Utilisation of AMT credit Available (Sum of AMT credit utilized during the current year is subject to the amount at Sl.No. 3) — the table below | — | `ScheduleAMTCDtls[]` + current-AY pair + totals | see table |

#### The utilisation table (Sl.No. 4) — column headers (row 8)

Sl.No. · **Assessment Year (A)** · **Gross (B1)** · **Set off in earlier assessment years (B2)** · **Balance brought forward to the current assessment year (B3) = (B1) – (B2)** · **AMT Credit Utilised during the Current Assessment Year (C)** · **Balance AMT Credit Carried Forward (D) = (B3) – (C)**

| Sl.No. | Assessment Year | Gross (B1) | Set off earlier (B2) | Balance b/f (B3) | Utilised (C) | Carried fwd (D) | Schema key(s) |
|---|---|---|---|---|---|---|---|
| i | 2013-14 | typed | typed | `[I9]= MAX((AMTC.AmtCreditFwd1-AMTC.AmtCreditSetOfEy1),0)` | computed | computed | one `ScheduleAMTCDtls` element |
| ii | 2014-15 | typed | typed | `[I10]= MAX((AMTC.AmtCreditFwd2-AMTC.AmtCreditSetOfEy2),0)` | | | element |
| iii | 2015-16 | typed | typed | `[I11]= MAX((AMTC.AmtCreditFwd3-AMTC.AmtCreditSetOfEy3),0)` | | | element |
| iv | 2016-17 | typed | typed | `[I12]= MAX((AMTC.AmtCreditFwd-AMTC.AmtCreditSetOfEy),0)` | | | element |
| v | 2017-18 | typed | typed | `[I13]= MAX((AMTC.AmtCreditFwd5-AMTC.AmtCreditSetOfEy5),0)` | | | element |
| vi | 2018-19 | typed | typed | `[I14]= MAX((AMTC.AmtCreditFwd4-AMTC.AmtCreditSetOfEy4),0)` | | | element |
| vii | 2019-20 | typed | typed | `[I15]= MAX((AMTC.AmtCreditFwd6-AMTC.AmtCreditSetOfEy6),0)` | | | element |
| viii | 2020-21 | typed | typed | `[I16]= MAX((AMTC.AmtCreditFwd7-AMTC.AmtCreditSetOfEy7),0)` | | | element |
| ix | 2021-22 | typed | typed | `[I17]= MAX((AMTC.AmtCreditFwd8-AMTC.AmtCreditSetOfEy8),0)` | | | element |
| x | 2022-23 | typed | typed | `[I18]= MAX((AMTC.AmtCreditFwd9-AMTC.AmtCreditSetOfEy9),0)` | | | element |
| xi | 2023-24 | typed | typed | `[I19]= MAX((AMTC.AmtCreditFwd10-AMTC.AmtCreditSetOfEy10),0)` | | | element |
| xii | 2024-25 | typed | typed | `[I20]= MAX((AMTC.AmtCreditFwd11-AMTC.AmtCreditSetOfEy11),0)` | | | element |
| xiii | 2025-26 | typed | typed | `[I21]= MAX((AMTC.AmtCreditFwd12-AMTC.AmtCreditSetOfEy12),0)` | | | element |
| xiv | **Current AY (enter 1 -2, if 1>2 else enter 0)** | `[G22]= MAX(AMTC.TaxSection115JC-AMTC.TaxOthProvisions-AMTCmove,0)` | — | — | — | `[K22]= AMTC.AmtCreditFwd0` | `CurrAssYr` (=2026-27), `CurrYrAmtCreditFwd`, `CurrYrCreditCarryFwd` |
| xv | **Total** | `[G23]= SUM(G9:G22)` | `[H23]= SUM(H9:H20)` | `[I23]= SUM(I9:I21)` | `[J23]= SUM(J9:J21)` | `[K23]= SUM(K9:L22)` | `TotAMTGross`, `TotSetOffEys`, `TotBalBF`, `TotAmtCreditUtilisedCY`, `TotBalAMTCreditCF` |

Each prior-year row (i–xiii) is one element of `ScheduleAMTCDtls[]` with:
`AssYr` (the year), `AmtCreditFwd` (Gross B1), `AmtCreditSetOfEy` (Set off B2),
`AmtCreditBalBroughtFwd` (Balance b/f B3), `AmtCreditUtilized` (Utilised C),
`BalAmtCreditCarryFwd` (Carried fwd D).

#### The two closing lines

| Sheet item | Field label | Type | Schema key | Rule / notes |
|---|---|---|---|---|
| **5** | Amount of tax credit under section 115JD utilised during the year [total of item no 4 (C)] | integer | `TaxSection115JD` | `[K24]= AMTC.AmtCreditUtilized_Total`; feeds Part B-TTI credit |
| **6** | Amount of AMT liability available for credit in subsequent assessment years [total of 4 (D)] | integer | `AmtLiabilityAvailable` | `[K25]= AMTC.BalAmtCreditCarryFwd_Total` |

---

## The rules the sheet computes

- **Item 1** `[L4]= sheet9.TotalTax_DI` — Tax under section 115JC = Sl.No. 1d of Part B-TTI (rules: "Sl.No. 1 should be equal to Sl.No. 1d of Part B-TTI").
- **Item 2** `[L5]= Sheet9.GrossTaxLiability` — Tax under other provisions = Sl.No. 2i of Part B-TTI (rules: "Sl.No. 2 should be equal to Sl.No. 2i of Part B-TTI").
- **Item 3** `[L6]= MAX(0,AMTC.TaxOthProvisions-AMTC.TaxSection115JC)` — credit available = (2 − 1) if 2 > 1, else 0 (rules: "Sl.No. 3 should be equal to zero when Sl.No. 2 is less than or equal to Sl.No. 1").
- **Balance b/f (B3), each prior year** `[I9]…[I21]= MAX((AmtCreditFwd_n - AmtCreditSetOfEy_n),0)` — Gross minus set-off in earlier years, floored at zero.
- **Current-AY Gross (B1)** `[G22]= MAX(AMTC.TaxSection115JC-AMTC.TaxOthProvisions-AMTCmove,0)` — this year's excess of AMT over normal tax becomes new credit (enter 1 − 2 if 1 > 2, else 0); `[K22]= AMTC.AmtCreditFwd0` carries it forward.
- **Totals (row xv)** `[G23]= SUM(G9:G22)`, `[H23]= SUM(H9:H20)`, `[I23]= SUM(I9:I21)`, `[J23]= SUM(J9:J21)`, `[K23]= SUM(K9:L22)`.
- **Item 5** `[K24]= AMTC.AmtCreditUtilized_Total` — total of column 4(C).
- **Item 6** `[K25]= AMTC.BalAmtCreditCarryFwd_Total` — total of column 4(D).
- **Set-off cap** (rules serial, line 4230): "value at Sl. No. B2(xii) cannot be greater than zero i.e. set off in earlier assessment years cannot be claimed for AY 2025-26."
- **Utilisation ceiling**: "Sum of AMT credit utilized during the current year is subject to the amount at Sl.No. 3."
- **New regime** (rules line 4240): values at column C and column D must not be more than zero if the New Tax Regime is selected.
- **Part B-TTI tie-back** (rules line 4235): AMT Credit u/s 115JD claimed there equals the credit at Schedule AMTC.

---

## Dropdowns

The **AMTC** sheet has **no value-carrying dropdowns** — every entry returned by
`--dropdowns "AMTC"` is a constant/range fill with `values: null` (the cell
blocks G/H/I/J/K, L4:L6, F11:F21, F22). The only enumerated list is the schema
enum for `AssYr` on each table row:

`AssYr` enum (13 values): **2013-14, 2014-15, 2015-16, 2016-17, 2017-18,
2018-19, 2019-20, 2020-21, 2021-22, 2022-23, 2023-24, 2024-25, 2025-26**.

`CurrAssYr` enum (1 value): **2026-27**.

---

## What repeats and what is one figure

- **Repeats:** the utilisation table's prior-year rows — `ScheduleAMTCDtls[]`,
  up to **13** elements (maxItems 13), one per fixed assessment year i–xiii.
- **One figure each:** items 1, 2, 3; the current-AY pair (`CurrAssYr`,
  `CurrYrAmtCreditFwd`, `CurrYrCreditCarryFwd`); the five totals
  (`TotAMTGross`, `TotSetOffEys`, `TotBalBF`, `TotAmtCreditUtilisedCY`,
  `TotBalAMTCreditCF`); and items 5 and 6 (`TaxSection115JD`,
  `AmtLiabilityAvailable`).

---

## Mandatory

Schema `required` keys: `TaxSection115JC`, `TaxOthProvisions`,
`AmtTaxCreditAvailable`, `CurrYrAmtCreditFwd`, `CurrYrCreditCarryFwd`,
`TotAMTGross`, `TotSetOffEys`, `TotBalBF`, `TotAmtCreditUtilisedCY`,
`TotBalAMTCreditCF`, `TaxSection115JD`, `AmtLiabilityAvailable`. Within each
`ScheduleAMTCDtls` element all six are required: `AssYr`, `AmtCreditFwd`,
`AmtCreditSetOfEy`, `AmtCreditBalBroughtFwd`, `AmtCreditUtilized`,
`BalAmtCreditCarryFwd`.

---

## Hidden rows — not built

**None.** Every row of the AMTC sheet (rows 3–25) is visible; the dump printed
no `H` flag on any row.

---

## What this means for the build

1. **Nothing is typed by the user in the head lines** — items 1 and 2 pull from
   Part B-TTI (1d and 2i), item 3 is `MAX(0, 2−1)`. Show them computed and
   green.
2. **The table** is a fixed thirteen-row grid (AY 2013-14 … 2025-26) with typed
   Gross (B1) and Set-off-earlier (B2) columns; Balance b/f (B3), Utilised (C)
   and Carried fwd (D) are computed. Enforce B2(xii) for AY 2025-26 ≤ 0 and the
   utilisation ceiling (Σ C ≤ item 3), oldest year set off first.
3. **Current-AY row (xiv)** takes this year's excess of AMT over normal tax
   (`MAX(TaxSection115JC − TaxOthProvisions, 0)`) as new Gross credit; write the
   `CurrAssYr`/`CurrYrAmtCreditFwd`/`CurrYrCreditCarryFwd` trio.
4. **Totals (xv)** feed items 5 (`TaxSection115JD`, total of col C) and 6
   (`AmtLiabilityAvailable`, total of col D). Item 5 is the credit Part B-TTI
   claims under 115JD; wire the tie-back.
5. **New regime:** zero out utilisation (col C and D) when the New Tax Regime is
   selected.
6. **Export** `ScheduleAMTC` whenever a credit exists (a prior-year balance) or
   arises this year.
