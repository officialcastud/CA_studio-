# The book of Schedule 115TD — ITR-6, A.Y. 2026-27

Read row by row from the utility's **Schedule 115TD** sheet, with the hidden-row
flags, the dropdowns, the helper (computation) columns and the cell formulas, and
confirmed against the schema block `Schedule115TD`. Item numbers (1, 2, 3, 4i–4iv,
5, 6, 7, 8, 9, 10, 11, 12) are taken from the ITR-6 validation-rules document
(rules 695–700, 779–780), never from counting rows.

---

## Schedule 115TD — Accreted income under section 115TD

*"Schedule 115TD — Accreted income under section 115TD."* When a charitable or
religious trust or institution ceases to exist as such — its registration is
cancelled, it converts into a non-eligible form, or it merges/dissolves without
transferring assets to another eligible entity — section 115TD taxes the
**accreted income** (the excess of the fair market value of its assets over its
liabilities) at the **maximum marginal rate**, with interest under section 115TE.
An ITR-6 filer that is such a "specified person" computes and pays that
additional tax here.

### The shape — the accreted-income computation, then the challan table

| Row/Cell | Item | Label | Type | Schema key |
|---|---|---|---|---|
| F4 | 1 | **Aggregate Fair Market Value (FMV) of total assets of Specified Person** | integer | `FMVTotTrustInst` |
| F5 | 2 | **Less: Total liability of Specified Person** | integer | `LessTotLiaTrustInst` |
| F6 | 3 | **Net value of assets (1 – 2)** | computed = 1 − 2 | `NetValAsst` |
| F7 | 4i | **FMV of assets directly acquired out of income referred to in section 10(1)** | integer | `FMVAsstAcqrdRfrdSec101` |
| F8 | 4ii | **FMV of assets acquired during the period from the date of creation or establishment to the effective date of registration/provisional registration u/s 12AB, if benefit u/s 11 and 12 not claimed during the said period** | integer | `FMVAsstAcqPeriodFromDateCrtn` |
| F9 | 4iii | **FMV of assets transferred in accordance with third proviso to section 115TD(2)** | integer | `FMVAsstTrnfsrdSec115TD2` |
| F10 | 4iv | **Total (4i + 4ii + 4iii)** | computed = 4i+4ii+4iii | `FMVTotal` |
| F11 | 5 | **Liability in respect of assets at 4 above** | integer | `LiabilityRespectofAsset4Above` |
| F12 | 6 | **Accreted income as per section 115TD [3 – (4iv – 5)]** | computed | `AccretedIncomeSection115TD` |
| F13 | 7 | **Additional income-tax payable u/s 115TD at maximum marginal rate** | computed | `AddIncPay115TDMarginalRate` |
| F14 | 8 | **Interest payable u/s 115TE** | computed | `InterestPayable115TE` |
| F15 | 9 | **Specified date u/s 115TD** | date | `SpecifiedDateUs115TD` |
| F16 | 10 | **Additional income-tax and interest payable** | computed = 7 + 8 | `AddIncIntstPayb` |
| F17 | 11 | **Tax and interest paid** | computed = Σ challans | `TaxIntstPaid` |
| F18 | 12 | **Net payable/refundable (10-11) (Enter 0, if negative)** | computed = 10 − 11 | `NetPaybleRefble` |

**The challan table — "Date(s) of deposit of tax on accreted income" (F19),
one row per challan:**

| Col | Label | Type | Schema key |
|---|---|---|---|
| F20 | **Sl. No.** | serial | — |
| G20 | **Date (DD/MM/YYYY)** | date | `DepositofTaxAccInc.DepositofTaxAccIncDtls[].DateDep` |
| H20 | **Name of Bank and Branch** | text, 125 | `…DepositofTaxAccIncDtls[].NameBankBranch` |
| I20 | **BSR Code** | text, 7 | `…DepositofTaxAccIncDtls[].BSRCode` |
| J20 | **Serial number of challan** | integer, 5 | `…DepositofTaxAccIncDtls[].SrlNoOfChaln` |
| K20 | **Amount deposited** | integer | `…DepositofTaxAccIncDtls[].Amount` |

### The helper (computation) columns — hidden method, read not shown

Rows 17 and 20 carry hidden helper columns that compute the interest under 115TE
and the running adjustment of each challan against interest then tax (per rule 8,
these helper columns are the rule for how a late payment is split):

- Row 17: **Year2**, **Day2**, **Month2**, **DateDiff**, **New Specified Date**,
  **Total Interest**, **Balance Interest** — the date arithmetic from the
  specified date to the payment date that drives the 115TE interest.
- Row 20: **Interest**, **Tax Paid after Adj Int**, **OBTE remaining**,
  **Interest CF**, **OBTE** — each challan is first applied to outstanding
  interest, then to tax; the remainder and carried-forward interest track what is
  still due.

These columns are the computation method behind items 8, 11 and 12; they are read
to reproduce the interest and the payment split, and are not themselves fields on
screen.

### The rules the sheet computes

- Rule **695** (Category A): item **3** "Net value of assets" = item 1 − item 2.
- Rule **696**: item **4(iv)** "Total" = 4i + 4ii + 4iii.
- Rule **697**: item **6** "Accreted income as per section 115TD" = 3 − (4 − 5)
  i.e. [3 − (4iv − 5)].
- Rule **698**: item **12** "Net payable/refundable" = 10 − 11.
- Rule **699**: if accreted income u/s 115TD is entered, item **9** "Specified
  date u/s 115TD" cannot be blank.
- Rule **700**: income entered in the return and tax not computed on the same is
  a Category A error — the additional tax (item 7) and interest (item 8) must be
  computed whenever accreted income is present.

### The dropdowns

The sheet carries no value-list dropdowns; the validations on the challan table
(name length 125, BSR 7, challan serial 5, dates length 10, amount numeric) are
length/format constraints, not enumerations.

### Cross-sheet feeds

| Flows | To |
|---|---|
| item **12** `NetPaybleRefble` | Part B-TTI Sl. No. **13** — "Net tax payable on 115TD income including interest u/s 115TE" (rule 779) |
| Part B-TTI Sl. No. **14** | = Sl. No. 13 less refund adjustment (rule 780) |

### Hidden rows

None of the numbered rows (3–20) are marked hidden; the helper columns noted
above are computation aids in visible rows.

### Schema

`Schedule115TD` — `FMVTotTrustInst`, `LessTotLiaTrustInst`, `NetValAsst`,
`FMVAsstAcqrdRfrdSec101`, `FMVAsstAcqPeriodFromDateCrtn`, `FMVAsstTrnfsrdSec115TD2`,
`FMVTotal`, `LiabilityRespectofAsset4Above`, `AccretedIncomeSection115TD`,
`AddIncPay115TDMarginalRate`, `InterestPayable115TE`, `SpecifiedDateUs115TD`,
`AddIncIntstPayb`, `TaxIntstPaid`, `NetPaybleRefble`, and
`DepositofTaxAccInc.DepositofTaxAccIncDtls[]{DateDep, NameBankBranch, BSRCode,
SrlNoOfChaln, Amount}`. None of the leaves is marked required in the schema, so
the block is written only when the trust has ceased and accreted income arises;
rule 699 then makes the specified date effectively mandatory.

### What this means for the build

A computation card (items 1, 2, 4i–4iii, 5 and the specified date typed; items 3,
4iv, 6, 7, 8, 10, 11, 12 computed and untypeable per rules 695–698) over a
repeatable deposit table whose total feeds item 11. The 115TE interest (item 8)
follows the hidden helper columns' date arithmetic from the specified date to the
payment date. Checks for the four arithmetic identities and the "specified date
blank" rule (699). Item 12 feeds Part B-TTI Sl. 13/14. Export `Schedule115TD`
only when the schedule applies, with the deposit array present when a challan is
entered.
