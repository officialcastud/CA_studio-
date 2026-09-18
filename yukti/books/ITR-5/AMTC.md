# AMTC — Schedule AMTC (ITR-5, A.Y. 2026-27)

Block: `ScheduleAMTC` · Sheet tab: **AMTC** · Section: `amt` (per `section_map.json`).
Header: **Schedule AMTC — Computation of tax credit under section 115JD** ([C3]/[F3]), sub-title **AMT CREDIT** ([C4]).

All figures below are quoted from `tools/dump.py` (rows, `--formulas`, `--dropdowns`, `--schema/--leaves ScheduleAMTC`) and `books/ITR-5/rules.json`. Nothing here is from memory.

Schedule AMTC records the tax credit for Alternate Minimum Tax paid under section 115JC (claimable u/s 115JD). It has two parts: (a) a **head block** of three current-year figures (items 1–3) that decides how much credit can be used this year, and (b) a **per-assessment-year table** (item 4) that tracks each earlier year's AMT credit through Gross → Set-off → Balance b/f → Utilised this year → Carried forward, plus a Current-Year row and a Total row; items 5–6 restate the Total column figures.

---

## The shape

- **Head block (rows 4–6):** three single figures — Tax u/s 115JC (item 1), Tax under other provisions (item 2), and the amount of tax against which credit is available (item 3). Items 1 and 2 are pulled from Part-B-TTI; item 3 is computed.
- **Per-AY credit table (item 4, rows 8–26):** a **matrix**, one **row per assessment year** crossed with six **columns**: Assessment Year (A), then AMT Credit split into **Gross (B1)** / **Set-off in earlier AYs (B2)** / **Balance b/f (B3)=B1−B2**, then **Utilised this AY (C)**, then **Balance carried forward (D)=B3−C**.
  - Rows **i–xiv** (rows 11–24) = the fourteen brought-forward years **2012-13 … 2025-26**, one schema-array object each. (Row 10 = 2011-12 is hidden — see below.)
  - Row **xv** (row 25) = **Current Year (2026-27)** — the AMT credit *generated* this year; its own set of columns.
  - Row **xvi** (row 26) = **Total** (column sums).
- **Footer restatements (rows 27–28):** item 5 = credit u/s 115JD utilised during the year (= Total of column C); item 6 = AMT liability available for credit in subsequent years (= Total of column D).

---

## The items

### Head block (rows 4–6) — single figures

| Sl. | Cell | Field | Type | Schema key | Rule (cell ref) |
|---|---|---|---|---|---|
| 1 | [E4] | Tax under section 115JC in assessment year 2026-27 (1d of Part-B-TTI) | integer | `TaxSection115JC` | Auto: [L4]= `sheet9.TotalTax_DI`. Rule A687: must equal "1d of Part-B-TTI". |
| 2 | [E5] | Tax under other provisions of the Act in assessment year 2026-27 (2g of Part-B-TTI) | integer | `TaxOthProvisions` | Auto: [L5]= `Sheet9.GrossTaxLiability`. Rule A688: must equal "2g of Part-B-TTI". |
| 3 | [E6] | Amount of tax against which credit is available [enter (2 – 1) if 2 is greater than 1, otherwise enter 0] | integer | `AmtTaxCreditAvailable` | Computed: [L6]= `MAX(0, AMTC.TaxOthProvisions − AMTC.TaxSection115JC)`. Rules A689/A690: = Sl.no.2 − Sl.no.1. |

Row 7 [E7] is the item-4 caption: *"Utilisation of AMT credit Available (Sum of AMT credit utilized during the current year is subject to maximum of amount mentioned in 3 above and cannot exceed the sum of AMT Credit Brought Forward)"* — the cap governing column C.

### Item 4 — per-AY AMT-credit table (rows 8–26)

Column headers: [F8] Assessment Year (A) · [G8] AMT Credit · [J8] AMT Credit Utilised during the Current Assessment Year (C) · [K8] Balance AMT Credit Carried Forward (D)= (B3) −(C). Sub-headers under "AMT Credit": [G9] Gross (B1) · [H9] Set-off in earlier assessment years (B2) · [I9] Balance brought forward to the current assessment year (B3) = (B1) – (B2).

Each of rows i–xiv is one object in the array `ScheduleAMTCDtls[]` (maxItems 14, minItems 1):

| Column | Cell (row 11 e.g.) | Field | Type | Schema key | Rule (cell ref) |
|---|---|---|---|---|---|
| A | [F11] | Assessment Year | string (enum) | `ScheduleAMTCDtls[].AssYr` | Fixed label per row (2012-13 … 2025-26). |
| B1 | [G11] | AMT Credit — Gross | integer | `ScheduleAMTCDtls[].AmtCreditFwd` | User input (b/f gross credit). |
| B2 | [H11] | Set-off in earlier assessment years | integer | `ScheduleAMTCDtls[].AmtCreditSetOfEy` | User input (optional; not in schema `required`). |
| B3 | [I11] | Balance brought forward to current AY = B1 − B2 | integer | `ScheduleAMTCDtls[].AmtCreditBalBroughtFwd` | Computed: [I11]= `MAX(G11−H11, 0)`. Rule A695: = B1−B2. |
| C | [J11] | AMT Credit Utilised during the Current Assessment Year | integer | `ScheduleAMTCDtls[].AmtCreditUtilized` | User input, capped by item 3 and by B3 (row 7 caption). |
| D | [K11] | Balance AMT Credit Carried Forward = B3 − C | integer | `ScheduleAMTCDtls[].BalAmtCreditCarryFwd` | Computed: [K11]= `IF(bacValue=1, 0, MAX(0, I11−J11))`. Rule A694: = Col.B3 − Col.C. |

Rows carrying the same pattern: 11–24 (formulas confirmed on I/K at rows 11, 20–24; the pattern applies to every live row 11–24). Sl. No. labels [E11]–[E24] = i…xiv, years [F11]–[F24] = 2012-13 … 2025-26.

**Current-Year row (xv, row 25)** — the credit *generated* in AY 2026-27:

| Column | Cell | Field | Type | Schema key | Rule (cell ref) |
|---|---|---|---|---|---|
| A | [F25] | Current Year (enter 1 -2, if 1>2 else enter 0) → AY 2026-27 | string (enum `2026-27`) | `CurrAssYr` | Fixed. |
| B1 | [G25] | Current-year AMT credit generated | integer | `CurrYrAmtCreditFwd` | Computed: [G25]= `MAX(0, (AMTC.TaxSection115JC − AMTC.TaxOthProvisions − IF((Sheet9.TotTaxRelief − Sheet9.GrossTaxLiability)>0, (Sheet9.TotTaxRelief − Sheet9.GrossTaxLiability), 0)))`. |
| B3 | [I25] | Balance b/f (current year) | integer | `CurrYrCreditBalBF` | User/derived. |
| D | [K25] | Current-year balance carried forward | integer | `CurrYrCreditCarryFwd` | Computed: [K25]= `IF(bacValue=1, 0, MAX(0, AMTC.AmtCreditFwd0))`. |

**Total row (xvi, row 26):**

| Column | Cell | Field | Type | Schema key | Rule (cell ref) |
|---|---|---|---|---|---|
| B1 | [G26] | Total Gross | integer | `TotAMTGross` | [G26]= `SUM(G10:G25)`. |
| B2 | [H26] | Total Set-off in earlier AYs | integer | `TotSetOffEys` | [H26]= `SUM(H10:H25)`. |
| B3 | [I26] | Total Balance b/f | integer | `TotBalBF` | [I26]= `SUM(I10:I25)`. |
| C | [J26] | Total Utilised during current AY | integer | `TotAmtCreditUtilisedCY` | [J26]= `SUM(J10:J25)`. |
| D | [K26] | Total Balance carried forward | integer | `TotBalAMTCreditCF` | [K26]= `SUM(K10:L25)`. |

### Footer restatements (rows 27–28) — single figures

| Sl. | Cell | Field | Type | Schema key | Rule (cell ref) |
|---|---|---|---|---|---|
| 5 | [E27] | Amount of tax credit under section 115JD utilised during the year [total of item no 4 (C)] | integer | `TaxSection115JD` | [K27]= `IF(bacValue=1, 0, AMTC.AmtCreditUtilized_Total)`. Rule A691: = 4·xvi Total of column C. |
| 6 | [E28] | Amount of AMT liability available for credit in subsequent assessment years [total of 4 (D)] | integer | `AmtLiabilityAvailable` | [K28]= `AMTC.BalAmtCreditCarryFwd_Total`. Rule A692: = 4·xvi Total of column D. |

Helper/linkage cells (not schema leaves, quoted for completeness): [O3]= `MAX(0, AMTC.TaxSection115JC − AMTC.TaxOthProvisions)`; [O26] label "Part B TI(6c-2g)" with [Q26]= `MAX((Sheet9.TotTaxRelief − Sheet9.GrossTaxLiability), 0)`.

---

## The rules the sheet computes (with cell references)

- **Item 3 cap** — [L6]= `MAX(0, TaxOthProvisions − TaxSection115JC)`: credit usable this year is the excess of tax under other provisions over AMT (0 if AMT is higher). Rules A689/A690.
- **Column B3 (b/f)** — [I·n]= `MAX(G·n − H·n, 0)` for each AY row: Gross minus set-off, floored at 0. Rule A695 (= B1−B2).
- **Column D (carry forward)** — [K·n]= `IF(bacValue=1, 0, MAX(0, I·n − J·n))`: B3 minus C, floored at 0, **but forced to 0 when the New Tax Regime is opted (`bacValue=1`)**. Rule A694 (= B3−C) and rule A696 (Col C and Col D = 0 if New Tax Regime = "yes").
- **Utilisation cap (column C)** — per [E7] caption: sum of AMT credit utilised during the year ≤ item 3 (amount tax available for credit) **and** ≤ total AMT Credit Brought Forward (Σ B3).
- **Current-year credit generated** — [G25]= `MAX(0, TaxSection115JC − TaxOthProvisions − IF((TotTaxRelief − GrossTaxLiability)>0, (TotTaxRelief − GrossTaxLiability), 0))`: AMT paid in excess of ordinary tax, net of relief, becomes new credit.
- **Totals** — [G26]/[H26]/[I26]/[J26]/[K26]= `SUM(·10:·25)` (K sums to L25 per formula). Item 5 [K27] = Utilised total; item 6 [K28] = Carry-forward total; both zeroed under New Tax Regime for K27.
- **New-Tax-Regime kill switch** — `bacValue=1` (opting section 115BAC new regime) drives columns C and D, item 5 to 0, since AMT/AMT-credit does not apply under the new regime (rule A696).
- **B2(xiv) restriction** — rule A693: set-off in earlier assessment years at Sl. No. B2(xiv) (row 24, AY 2025-26) cannot be claimed for AY 2026-27.
- **Downstream linkage** — Part B-TTI Sl.no.4 "Credit under section 115JD of tax paid in earlier years" = Sl.no.5 of Schedule AMTC, applicable only when 2g of Part B-TTI > 1d of Part B-TTI (rules A820/A821); Part B-TTI Sl.no.5 = Sl.no.3 − Sl.no.4 (rule A835).

---

## Dropdowns

**No value-list dropdowns.** The `--dropdowns AMTC` dump returns only numeric-input data validations (`source` "0" or "7", `values: null`) on cells G10:G11/G25, L4:L6, K27, K28, H10:H16, H17:H20, I10:I20, H21:I25, K10:K26, F25, F12:F24, G12:G24 — these are number-entry constraints, not selectable lists.

The only enum-constrained fields are set by the schema, not chosen by the user:
- `ScheduleAMTCDtls[].AssYr` — enum of 14 fixed years: **2012-13, 2013-14, 2014-15, 2015-16, 2016-17, 2017-18, 2018-19, 2019-20, 2020-21, 2021-22, 2022-23, 2023-24, 2024-25, 2025-26** (one per row i–xiv).
- `CurrAssYr` — enum of 1: **2026-27**.

---

## What repeats and what is one figure

- **Repeats:** the array `ScheduleAMTCDtls[]` — one object per earlier assessment year (rows i–xiv, 2012-13 … 2025-26), each with `AssYr`, `AmtCreditFwd`, `AmtCreditSetOfEy`, `AmtCreditBalBroughtFwd`, `AmtCreditUtilized`, `BalAmtCreditCarryFwd`. maxItems 14, minItems 1.
- **One figure each (not repeated):** head items `TaxSection115JC`, `TaxOthProvisions`, `AmtTaxCreditAvailable`; the Current-Year row `CurrAssYr`, `CurrYrAmtCreditFwd`, `CurrYrCreditBalBF`, `CurrYrCreditCarryFwd`; the Total row `TotAMTGross`, `TotSetOffEys`, `TotBalBF`, `TotAmtCreditUtilisedCY`, `TotBalAMTCreditCF`; footer `TaxSection115JD`, `AmtLiabilityAvailable`.

---

## Mandatory (from the schema `required`)

`ScheduleAMTC` required: `TaxSection115JC`, `TaxOthProvisions`, `AmtTaxCreditAvailable`, `CurrAssYr`, `CurrYrAmtCreditFwd`, `CurrYrCreditBalBF`, `CurrYrCreditCarryFwd`, `TotAMTGross`, `TotSetOffEys`, `TotBalBF`, `TotAmtCreditUtilisedCY`, `TotBalAMTCreditCF`, `TaxSection115JD`, `AmtLiabilityAvailable`.

`ScheduleAMTCDtls` (each array item) required: `AssYr`, `AmtCreditFwd`, `AmtCreditBalBroughtFwd`, `AmtCreditUtilized`, `BalAmtCreditCarryFwd`. Optional: `AmtCreditSetOfEy`.

All integers: minimum 0, maximum 99999999999999, default 0.

---

## Hidden rows — not built

- **Row 10 (10H): Sl. No. i — Assessment Year 2011-12.** Hidden in the utility (`hidden="1"`). Not built. Confirmed by the schema: `ScheduleAMTCDtls[].AssYr` enum starts at **2012-13** and has only 14 entries (`maxItems 14`), so 2011-12 is excluded from the array. Its cells still appear in the Total `SUM(·10:·25)` ranges but contribute 0.

No other hidden rows in this sheet.

---

## What this means for the build

- Build **one array** `ScheduleAMTCDtls[]` of up to 14 rows for AYs **2012-13 → 2025-26** (never 2011-12). Each row: `AssYr` (fixed label), `AmtCreditFwd` (input B1), `AmtCreditSetOfEy` (input B2, optional), `AmtCreditBalBroughtFwd` = MAX(B1−B2,0) (computed B3), `AmtCreditUtilized` (input C, capped), `BalAmtCreditCarryFwd` = MAX(B3−C,0) but 0 under new regime (computed D).
- Head items 1–2 are **read-only pulls** from Part-B-TTI (`sheet9.TotalTax_DI`, `Sheet9.GrossTaxLiability`); item 3 = MAX(0, item2 − item1).
- The **Current-Year row** and **Total row** are their own flat schema fields (not array members): compute `CurrYrAmtCreditFwd`, `CurrYrCreditCarryFwd` per the formulas; totals are column sums.
- Wire the **`bacValue` (New Tax Regime) kill switch**: when opted, force every column C, column D, `TaxSection115JD`, and `AmtLiabilityAvailable` chain to 0 (rule A696).
- Enforce the **utilisation cap**: Σ column C ≤ item 3 and ≤ Σ column B3.
- Feed **Part-B-TTI Sl.no.4** from item 5 (`TaxSection115JD`) only when 2g > 1d of Part B-TTI.
