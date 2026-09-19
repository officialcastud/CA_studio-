# The book of Schedule ICDS — Effect of Income Computation Disclosure Standards · ITR-6, A.Y. 2026-27

Read row by row from the utility's **ICDS** sheet (16 live rows + 2 hidden), the
formulas in columns F, G, H and the hidden helper column K, and confirmed against
the CBDT ITR-6 schema's `ScheduleICDS` and the validation-rules document. Nothing
here is invented.

---

## 1 · The shape — ten standards, an increase and a decrease, one total

Schedule ICDS records the **adjustment to book profit** required because the ten
notified Income Computation and Disclosure Standards (section 145(2)) compute
income differently from the books. Each standard has one row; for each the
company enters the amount by which the standard **increases** profit and the
amount by which it **decreases** profit; the net effect is (increase − decrease).

The header (E3): *"Effect of Income Computation Disclosure Standards (ICDS) on
profit."*

| Part | What it is |
|---|---|
| **Rows I–X** | one line per ICDS — Accounting Policies through Provisions/Contingent Liabilities |
| **Row XI** | **Total effect of ICDS adjustments on profit (I + II + … + X)** |
| **Rows XIA, XIB** | hidden — the positive-only and negative-only totals (the method behind the OI feed) |

---

## 2 · The grid, column by column

From the sheet's header row (r4):

| Col | Sheet header | Kind | Schema key |
|---|---|---|---|
| **(3)** | Increase in Profit | amount entered | `IncreaseInProfit` |
| **(4)** | Decrease in Profit | amount entered | `DecreaseInProfit` |
| **(5)** | Net Effect | **computed** = (3) − (4) | `NetEffect` |

The sheet's Net-Effect cells (H6:H15) are `= F − G` per row. The hidden helper
column **K** (cell K4) carries a flag formula that is TRUE when any of the ten
ICDS named cells is non-empty — the sheet's own "has the company made any ICDS
disclosure?" switch:

`K4 = IF(OR(ICDS.AccPolicies<>"", ICDS.ValuationInv<>"", ICDS.ConsContracts<>"",
ICDS.RevenueRecog<>"", ICDS.TangibleFixAssests<>"", ICDS.ChngRates<>"",
ICDS.Govgrants<>"", ICDS.Securities<>"", ICDS.BorrowingCosts<>"",
ICDS.ProvLiability<>""), TRUE, FALSE)`

Note the named cells in that formula (`AccPolicies`, `ValuationInv`,
`ConsContracts`, `RevenueRecog`, `TangibleFixAssests`, `ChngRates`, `Govgrants`,
`Securities`, `BorrowingCosts`, `ProvLiability`) are the workbook's internal
handles for the ten rows; the **schema uses different names** (see §3). Read the
flag — it is the rule for whether the schedule is carried at all.

---

## 3 · The rows — standard by standard (item numbers I–X from the rules document)

| Item | ICDS (col 2) | Row | Schema object |
|---|---|---|---|
| **I** | Accounting Policies | r6 | `AccPolicyAmtDetl` |
| **II** | Valuation of Inventories (other than the effect of change in method of valuation u/s 145A, if the same is separately reported at col. 4d or 4e of Part A-OI) | r7 | `InventoriesValueDetl` |
| **III** | Construction Contracts | r8 | `ConstContractsAmtDetl` |
| **IV** | Revenue Recognition | r9 | `RevenueRcgAmtDetl` |
| **V** | Tangible Fixed Assets | r10 | `TangibleFixedAssetDetl` |
| **VI** | Changes in Foreign Exchange Rates | r11 | `ForeignExgRatesDetl` |
| **VII** | Government Grants | r12 | `GovtGrantsDetl` |
| **VIII** | Securities (other than the effect of change in method of valuation u/s 145A, if the same is separately reported at col. 4d or 4e of Part A-OI) | r13 | `SecuritiesDetl` |
| **IX** | Borrowing Costs | r14 | `BorrowingCostsDetl` |
| **X** | Provisions, Contingent Liabilities and Contingent Assets | r15 | `ProvAssetsDetl` |
| **XI** | Total effect of ICDS adjustments on profit (I+II+III+IV+V+VI+VII+VIII+IX+X) | r16 | `TotalNetAmtDetl` |

Each row-object I–X nests three leaves: `IncreaseInProfit`, `DecreaseInProfit`,
`NetEffect`. The total object `TotalNetAmtDetl` nests **only** `IncreaseInProfit`
and `DecreaseInProfit` (no `NetEffect` leaf) — because the total's two halves are
what the OI feed needs (see §5), not a single net.

---

## 4 · The rules the sheet computes (from its formulas and the rules document)

| Cell / rule | What it enforces |
|---|---|
| **H6:H15** = `F − G` | Net Effect (5) = Increase (3) − Decrease (4), per standard |
| **F16** = `MAX(0, SUM(F6:F15))` | Total column (3) — total increase in profit |
| **G16** = `MAX(0, SUM(G6:G15))` | Total column (4) — total decrease in profit |
| **H16** = `MAX(SUM(H6:H15), 0)` | Total Net Effect (item XI, col 5), floored at 0 |
| **H17** (XIA, hidden) = `MAX(0, SUM(H6:H15))` | total effect **if positive** |
| **H18** (XIB, hidden) = `MIN(SUM(H6:H15), 0) × −1` | total effect **if negative** (as a positive number) |
| **Rule A575** | Sl. No. XI = sum of (I + II + III + IV + V + VI + VII + VIII + IX + X) **if positive** |
| **Rule A576** | column (5) Net effect must match (column (3) − column (4)) for all fields |

The two hidden rows XIA and XIB are the display sheet hiding its method: XIA is
the positive part of the net ICDS effect, XIB the negative part. **They are not
built** (hidden) and are not schema fields, but they are the arithmetic that
splits the total into the increase and decrease that Part A-OI item 3 reports.

---

## 5 · Cross-sheet feeds — the ICDS → OI → BP chain (in and out)

**Into ICDS:** the company enters columns (3) and (4) directly; nothing is
computed from other sheets.

**Out of ICDS — the feed the whole schedule exists to produce:**

| From ICDS | To | Rule |
|---|---|---|
| **column XI(3)** — total Increase in Profit (`TotalNetAmtDetl.IncreaseInProfit`) | **Part A-OI Sl. No. 3a** | **A163** (OI 3a = column XI(3) of Schedule ICDS) |
| **column XI(4)** — total Decrease in Profit (`TotalNetAmtDetl.DecreaseInProfit`) | **Part A-OI Sl. No. 3b** | **A164** (OI 3b = column XI(4) of Schedule ICDS) |

Part A-OI then feeds Schedule BP — this is the "ICDS → OI/BP" chain:

| Part A-OI | To Schedule BP | Rule |
|---|---|---|
| **OI 3a** (ICDS increase) + **OI 4d** (increase in profit from change in stock valuation u/s 145A) | **BP item 25** — "Increase in profit or decrease in loss on account of ICDS adjustments and deviation in method of valuation of stock (Column 3a + 4d of Schedule OI)" — an **addition** | **A197** (BP A25 = 3a + 4d of Part A-OI) |
| **OI 3b** (ICDS decrease) + **OI 4e** (decrease in profit from change in stock valuation u/s 145A) | **BP item 33** — "Decrease in profit or increase in loss on account of ICDS adjustments and deviation in method of valuation of stock (Column 3b + 4e of Schedule OI)" — a **deduction** | — (BP r111 label; mirrors A197) |

So an ICDS **increase** ultimately adds to business income (via OI 3a → BP 25),
and an ICDS **decrease** reduces it (via OI 3b → BP 33). The 145A stock-valuation
deviation rides the same two OI lines (4d / 4e) but is entered in Part A-OI, not
here — hence the "other than the effect of change in method of valuation u/s 145A"
carve-out in the ICDS II and VIII labels.

---

## 6 · What is mandatory

The schema marks `TotalNetAmtDetl` required on the block. The ten standard
objects and their leaves are not individually required, but the block is written
whenever the ICDS flag (K4) is TRUE. Every amount is an integer; `IncreaseInProfit`
and `DecreaseInProfit` are non-negative (min 0), `NetEffect` may be negative
(min −99999999999999), maximum 99999999999999.

**Schema leaf keys** (block `ScheduleICDS`): under each of `AccPolicyAmtDetl`,
`InventoriesValueDetl`, `ConstContractsAmtDetl`, `RevenueRcgAmtDetl`,
`TangibleFixedAssetDetl`, `ForeignExgRatesDetl`, `GovtGrantsDetl`,
`SecuritiesDetl`, `BorrowingCostsDetl`, `ProvAssetsDetl` — the three leaves
`IncreaseInProfit`, `DecreaseInProfit`, `NetEffect`; and under `TotalNetAmtDetl`
the two leaves `IncreaseInProfit`, `DecreaseInProfit`.

---

## 7 · Dropdowns and hidden rows

- **No dropdowns with value lists.** All four data-validation ranges (H6:H16,
  F16, G6:G16, F6:F15) are numeric constraints only.
- **Hidden rows — not built, logged here:**
  - **XIA** (r17H) — "Total effect of ICDS adjustments on profit … (if positive)" — hidden; the positive-only total, method for the OI 3a feed.
  - **XIB** (r18H) — "Total effect of ICDS adjustments on profit … (if negative)" — hidden; the negative-only total, method for the OI 3b feed.
  Also hidden: helper **column K** (the disclosure flag), described in §2.

---

## 8 · What this means for the build

1. **Ten standard rows plus a Total**, each with Increase (3), Decrease (4) and a
   computed green Net Effect (5) = (3) − (4).
2. **The Total row XI** floors its columns at zero and is the only object the
   schema requires; carry its Increase and Decrease halves separately, because
   they feed OI 3a and 3b respectively.
3. **Do not build XIA / XIB** — they are hidden; reproduce their arithmetic
   (positive part → OI 3a path, negative part → OI 3b path) in the engine only.
4. **Wire the chain** ICDS XI(3)/XI(4) → OI 3a/3b → BP 25/33, and keep the 145A
   stock-valuation deviation on OI 4d/4e out of ICDS itself.
