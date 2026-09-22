# The book of Schedule 115TD — ITR-7, A.Y. 2026-27

Read row by row from the utility's **Schedule 115TD** sheet, with the dropdowns,
the helper (computation) columns and the cell formulas, and confirmed against
the schema block `Schedule115TD` and the section map (`Schedule 115TD` → section
**si** → block `Schedule115TD`). Item numbers (1, 2, 3, 4i–4iv, 5, 6, 7, 8, 9,
10, 11, 12) are taken from the sheet's row order and the schema.

---

## Schedule 115TD — Accreted income under section 115TD

*"Schedule 115TD — Accreted income under section 115TD (Applicable if exemption
claimed u/s 11 and 12 or 10(23C)(iv)/10(23C)(v)/10(23C)(vi)/10(23C)(via))."*
When a charitable or religious trust or institution ceases to exist as such —
its registration is cancelled, it converts into a non-eligible form, or it
merges/dissolves without transferring assets to another eligible entity —
section 115TD taxes the **accreted income** (the excess of the fair market value
of its assets over its liabilities) at the **maximum marginal rate**, with
interest under section 115TE. ITR-7 is the return of such trusts/institutions,
so this schedule is the natural home of the exit tax; a "specified person"
computes and pays that additional tax here.

## 1 · Purpose and shape — the accreted-income computation, then the challan table

| Row/Cell | Item | Label | Type | Schema key |
|---|---|---|---|---|
| F4 | 1 | **Aggregate Fair Market Value (FMV) of total assets of Specified Person** | integer | `FMVTotTrustInst` |
| F5 | 2 | **Less: Total liability of Specified Person** | integer | `LessTotLiaTrustInst` |
| F6 | 3 | **Net value of assets (1 – 2)** | computed = 1 − 2 | `NetValAsst` |
| F7 | 4i | **FMV of assets directly acquired out of income referred to in section 10(1)** | integer | `FMVAsstAcqrdRfrdSec101` |
| F8 | 4ii | **FMV of assets acquired during the period from the date of creation or establishment to the effective date of registration/provisional registration u/s 12AB or 2nd Proviso to s. 10(23C), if benefit u/s 11 and 12 or 10(23C)(iv)/(v)/(vi)/(via) respectively not claimed during the said period** | integer | `FMVAsstAcqPeriodFromDateCrtn` |
| F9 | 4iii | **FMV of assets transferred in accordance with third proviso to section 115TD(2)** | integer | `FMVAsstTrnfsrdSec115TD2` |
| F10 | 4iv | **Total (4i + 4ii + 4iii)** | computed = 4i+4ii+4iii | `FMVTotal` |
| F11 | 5 | **Liability in respect of assets at 4 above** | integer | `LiabilityRespectofAsset4Above` |
| F12 | 6 | **Accreted income as per section 115TD [3 – (4 – 5)]** | computed | `AccretedIncomeSection115TD` |
| F13 | 7 | **Additional income-tax payable u/s 115TD at maximum marginal rate** | computed | `AddIncPay115TDMarginalRate` |
| F14 | 8 | **Interest payable u/s 115TE** | computed | `InterestPayable115TE` |
| F15 | 9 | **Specified date u/s 115TD** | date/string | `SpecifiedDateUs115TD` |
| F16 | 10 | **Additional income-tax and interest payable** | computed = 7 + 8 | `AddIncIntstPayb` |
| F17 | 11 | **Tax and interest paid** | computed = Σ challans | `TaxIntstPaid` |
| F18 | 12 | **Net payable/refundable (10 – 11)** | computed = 10 − 11 | `NetPaybleRefble` |

**The challan table — "Date(s) of deposit of tax on accreted income" (F19), one
row per challan (rows 20 header, 21–24 entry):**

| Col | Label | Type | Schema key |
|---|---|---|---|
| F20 | **Sl. No.** | serial | — |
| G20/G21:G24 | **Date (DD/MM/YYYY)** | date, len 10 | `DepositofTaxAccInc.DepositofTaxAccIncDtls[].DateDep` |
| H20/H21:H24 | **Name of Bank and Branch** | text, 125 | `…DepositofTaxAccIncDtls[].NameBankBranch` |
| I20/I21:I24 | **BSR Code** | text, 7 | `…DepositofTaxAccIncDtls[].BSRCode` |
| J20/J21:J24 | **Serial number of challan** | integer, 5 | `…DepositofTaxAccIncDtls[].SrlNoOfChaln` |
| K20/K21:K24 | **Amount deposited** | integer | `…DepositofTaxAccIncDtls[].Amount` |

## 2 · The helper (computation) columns — hidden method, read not shown

Rows 17 and 20 carry hidden helper columns that compute the interest under 115TE
and the running adjustment of each challan against interest then tax (these are
the rule for how a late payment is split):

- **Row 17:** **Year2** (P17), **Day2** (Q17), **Month2** (R17), **DateDiff**
  (S17), **New Specified Date** (U17), **Total Interest** (W17), **Balance
  Interest** (X17) — the date arithmetic from the specified date to the payment
  date that drives the 115TE interest.
- **Row 20:** **Interest** (Q20), **Tax Paid after Adj Int** (R20), **OBTE
  remaining** (S20), **Interest CF** (T20), **OBTE** (U20) — each challan is
  first applied to outstanding interest, then to tax; the remainder and
  carried-forward interest track what is still due.

These columns are the computation method behind items 8, 11 and 12; they are
read to reproduce the interest and the payment split, and are not themselves
fields on screen.

## 3 · The computation identities

- Item **3** "Net value of assets" = item 1 − item 2 (`NetValAsst` = F4 − F5).
- Item **4iv** "Total" = 4i + 4ii + 4iii (`FMVTotal` = F7 + F8 + F9).
- Item **6** "Accreted income as per section 115TD" = 3 − (4iv − 5), on screen
  written as **[3 – (4 – 5)]** (`AccretedIncomeSection115TD`).
- Item **10** "Additional income-tax and interest payable" = item 7 + item 8
  (`AddIncIntstPayb`).
- Item **11** "Tax and interest paid" = Σ of the challan "Amount deposited"
  column (`TaxIntstPaid`).
- Item **12** "Net payable/refundable" = item 10 − item 11, floored at 0
  (`NetPaybleRefble`).
- Item **7** additional income-tax at the maximum marginal rate and item **8**
  interest u/s 115TE must be computed whenever accreted income is present; if
  accreted income is entered, item **9** "Specified date u/s 115TD" cannot be
  blank.

## 4 · The dropdowns

The sheet carries **no value-list dropdowns**. The data-validations on the
challan table are length/format constraints, not enumerations:

- **G21:G24** (Date) — source `10` (length 10, DD/MM/YYYY).
- **H21:H24** (Name of Bank and Branch) — source `125` (max length 125).
- **I21:I24** (BSR Code) — source `7` (length 7).
- **J21:J24** (Serial number of challan) — source `5` (max length 5).
- **K21:K24** (Amount deposited) — source `0` (numeric).
- The `M*` helper cells (M4, M5, M6, M7:M9, M10, M11, M12:M13, M14, M15, M17,
  M18) carry source `0`/`10` — internal compute guards, not on-screen fields.

## 5 · Cross-sheet feeds

| Flows | To |
|---|---|
| item **12** `NetPaybleRefble` | Part B-TTI — "Net tax payable on 115TD income including interest u/s 115TE" |
| Part B-TTI (next line) | = the 115TD line less refund adjustment |

The challan "Amount deposited" (K21:K24) totals into item 11 (`TaxIntstPaid`),
which nets against item 10 to give item 12.

## 6 · Hidden rows

None of the numbered rows (3–20) are marked hidden (`hidden_rows` = 0 in
`sheet_map.json`); the helper columns noted in §2 are computation aids in
visible rows.

## 7 · Schema — block `Schedule115TD`

None of the scalar leaves is marked required in the schema, so the block is
written only when the trust has ceased and accreted income arises; the
"specified date not blank" requirement then makes `SpecifiedDateUs115TD`
effectively mandatory. The **challan array leaves are required** once a challan
row is present. Full leaf list in **Appendix B**.

## 8 · What this means for the build

A computation card (items 1, 2, 4i–4iii, 5 and the specified date typed; items
3, 4iv, 6, 7, 8, 10, 11, 12 computed and untypeable per the identities in §3)
over a repeatable deposit table whose total feeds item 11. The 115TE interest
(item 8) follows the hidden helper columns' date arithmetic from the specified
date to the payment date. Checks for the four arithmetic identities and the
"specified date blank" rule. Item 12 feeds Part B-TTI. Export `Schedule115TD`
only when the schedule applies, with the deposit array present when a challan is
entered.

---

## Appendix A · Every live row, verbatim (dump)

```
r   3 : [C3] Schedule 115TD  |  [F3] Accreted income under section 115TD (Applicable if exemption claimed u/s 11 and 12 or 10(23C)(iv)/10
r   4 : [F4] Aggregate Fair Market Value (FMV) of total assets of Specified Person
r   5 : [F5] Less: Total liability of Specified Person
r   6 : [F6] Net value of assets (1 – 2)
r   7 : [E7] 4i  |  [F7] FMV of assets directly acquired out of income referred to in section 10(1)  |  [L7] 4i
r   8 : [E8] 4ii  |  [F8] FMV of assets acquired during the period from the date of creation or establishment to the effective  |  [L8] 4ii
r   9 : [E9] 4iii  |  [F9] FMV of assets transferred in accordance with third proviso to section 115TD(2)  |  [L9] 4iii
r  10 : [E10] 4iv  |  [F10] Total (4i + 4ii + 4iii)  |  [L10] 4iv
r  11 : [F11] Liability in respect of assets at 4 above
r  12 : [F12] Accreted income as per section 115TD [3 – (4 – 5)]
r  13 : [F13] Additional income-tax payable u/s 115TD at maximum marginal rate
r  14 : [F14] Interest payable u/s 115TE
r  15 : [F15] Specified date u/s 115TD
r  16 : [F16] Additional income-tax and interest payable
r  17 : [F17] Tax and interest paid  |  [P17] Year2  |  [Q17] Day2  |  [R17] Month2  |  [S17] DateDiff  |  [U17] New Specified Date  |  [W17] Total Interest  |  [X17] Balance Interest
r  18 : [F18] Net payable/refundable (10– 11)
r  19 : [F19] Date(s) of deposit of tax on accreted income
r  20 : [F20] Sl. No.  |  [G20] Date (DD/MM/YYYY)  |  [H20] Name of Bank and Branch  |  [I20] BSR Code  |  [J20] Serial number of challan  |  [K20] Amount deposited  |  [Q20] Interest  |  [R20] Tax Paid after Adj Int  |  [S20] OBTE remaining  |  [T20] Interest CF  |  [U20] OBTE
```

Full item 4ii label (from sharedStrings, truncated on screen): *"FMV of assets
acquired during the period from the date of creation or establishment to the
effective date of registration/provisional registration u/s 12AB or 2nd Proviso
to s. 10(23C), if benefit u/s 11 and 12 or 10(23C)(iv)/10(23C)(v)/10(23C)(vi)/
10(23C)(via) respectively not claimed during the said period."*

Full row-3 header: *"Accreted income under section 115TD (Applicable if
exemption claimed u/s 11 and 12 or 10(23C)(iv)/10(23C)(v)/10(23C)(vi)/
10(23C)(via))."*

## Appendix B · Schema leaves — block `Schedule115TD` (`*` = required)

```
  FMVTotTrustInst integer
  LessTotLiaTrustInst integer
  NetValAsst integer
  FMVAsstAcqrdRfrdSec101 integer
  FMVAsstAcqPeriodFromDateCrtn integer
  FMVAsstTrnfsrdSec115TD2 integer
  FMVTotal integer
  LiabilityRespectofAsset4Above integer
  AccretedIncomeSection115TD integer
  AddIncPay115TDMarginalRate integer
  InterestPayable115TE integer
  SpecifiedDateUs115TD string
  AddIncIntstPayb integer
  TaxIntstPaid integer
  NetPaybleRefble integer
  DepositofTaxAccInc.DepositofTaxAccIncDtls[] array
* DepositofTaxAccInc.DepositofTaxAccIncDtls[].DateDep string
* DepositofTaxAccInc.DepositofTaxAccIncDtls[].NameBankBranch string
* DepositofTaxAccInc.DepositofTaxAccIncDtls[].BSRCode string
* DepositofTaxAccInc.DepositofTaxAccIncDtls[].SrlNoOfChaln integer
* DepositofTaxAccInc.DepositofTaxAccIncDtls[].Amount integer
```

## Appendix C · Dropdowns

No value-list dropdowns. Data-validation constraints only, per §4: G21:G24 len
10, H21:H24 len 125, I21:I24 len 7, J21:J24 len 5, K21:K24 numeric.
