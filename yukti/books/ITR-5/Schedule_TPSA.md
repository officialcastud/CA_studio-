# Schedule TPSA — Tax on secondary adjustments u/s 92CE(2A)

Form: **ITR-5**, A.Y. 2026-27. Sheet: **Schedule TPSA** (`sheet47.xml`, 27 rows, **3 hidden rows**). Section: `other`. Block: **ScheduleTPSA**.
Source: `python tools/dump.py --form ITR-5 --sheet "Schedule TPSA"` (rows / `--formulas` / `--dropdowns "Schedule TPSA"`) and `--schema ScheduleTPSA` / `--leaves ScheduleTPSA`; defined-name → cell map from `sources/ITR-5/utility/xl/workbook.xml`; rules from `books/ITR-5/rules.json`; Part A-OI flag from `books/ITR-5/PART_A_OI.md`; VBA hints from `sources/ITR-5/vba_text.txt`. Quoted, not remembered.

## The shape

Schedule TPSA reports the **additional income-tax on secondary adjustment to transfer price under section 92CE(2A)**. The schema block `ScheduleTPSA` is a single `object` (one figure each) plus **one repeating array** `DtlsTaxesPaid[]` for the challan-wise taxes-paid table.

Header row `[C3]`/`[E3]` reads (verbatim):
- `[C3]` = **"Schedule TPSA"**
- `[E3]` = **"Details of Tax on secondary adjustments as per section 92CE(2A)"**

The whole schedule is **gated on Part A-OI Sl. No. 17** — `ScheduleTPSAFlg` ("Whether assessee is exercising option under subsection 2A of section 92CE ?", cell L117, dropdown Yes/No). If that flag is **"Yes"**, Schedule TPSA must be filled (rules.json n190/n191). If Yes and the primary-adjustment amount is left blank, the utility errors: *"Please enter amount of primary adjustment on which option u/s 92CE(2A) is exercised & such excess money has not been repatriated within the prescribed time in schedule TPSA"* (vba_text.txt).

The body is: one input (primary adjustment, `[H4]`), a computed tax cascade (2a–2d, `[H8]`..`[H11]`), taxes paid (`[H12]`), net tax payable (`[H13]`), then a 6-row challan grid (rows 18–23) with a Total (`[H24]`).

## The items

### Block `ScheduleTPSA` (object — one figure each)

| Sl. (rules) | Sheet row / cell | Field | Type | Schema key | Rule |
|---|---|---|---|---|---|
| 1 | `[D4]` label, input `[H4]` | Amount of primary adjustment on which option u/s 92CE(2A) is exercised & such excess money has not been repatriated within the prescribed time (please indicate the total of adjustments made in respect of all the Ays) | integer, 0 … 99999999999999 | `AmtPrimaryAdjUs92CE_2A` | required; ≥ 0; user input (defined name `TPSA_92CE_Amount` = `$H$4`) |
| 2a | `[C8]` "2a" / `[D8]` / `[H8]` | Additional Income tax payable @ 18% on above | integer | `AdditionalIncTax18PercAbove` | required; **computed** = 18% of Sl. 1 |
| 2b | `[C9]` "2b" / `[D9]` / `[H9]` | Surcharge @ 12% on "a" | integer | `Surcharge12Perc` | required; **computed** = 12% of 2a |
| 2c | `[C10]` "2c" / `[D10]` / `[H10]` | Health & Education cess on (a+b) | integer | `HealthEducationCess` | required; **computed** = 4% of (2a+2b) |
| 2d | `[C11]` "2d" / `[D11]` / `[H11]` | Total Additional tax payable (a+b+c) | integer | `TotalAdditionalTax` | required; **computed** = 2a+2b+2c |
| 3 | `[D12]` / `[H12]` | Taxes paid | integer | `TaxesPaid` | required; **computed** = total amount deposited (`TPSC_Amount_Deposited`) |
| 4 | `[D13]` / `[H13]` | Net tax payable (2d-3) | integer | `NetTaxPayable` | required; **computed** = 2d − 3 (floored at 0) |
| — | `[H24]` | Total (of challan table) | integer | `TotalAmountDeposited` | required; **computed** = SUM of challan amounts |

### Block `ScheduleTPSA.DtlsTaxesPaid[]` (array — "Details of Taxes Paid", header `[C15]`; column headers row 16; data rows 18–23, up to 6 challans)

| Col (sheet) | Header `[..16]` | Data range | Type | Schema key | Rule |
|---|---|---|---|---|---|
| `[C16]` | Sl. No. | `[C18]`..`[C23]` (`[C19]=C18+1`, …) | index | *(none — printed running index)* | not built as a field |
| `[D16]` | BSR Code | `[D18:D23]` (`TPSC_BSRCode`) | string | `DtlsTaxesPaid[].BSRCode` | required |
| `[E16]` | Name of Bank and Branch | `[E18:E23]` (`TPSC_BankName`) | string, maxLength 125 | `DtlsTaxesPaid[].BankBranchName` | required |
| `[F16]` | Date of Deposit (DD/MM/YYYY) | `[F18:F23]` (`TPSC_DateDep`) | string date `YYYY-MM-DD` | `DtlsTaxesPaid[].DateDep` | required; on/after 2021-04-01; cannot be after system date (n756) |
| `[G16]` | Serial Number of Challan | `[G18:G23]` (`TPSC_SrlNoOfChaln`) | integer, 0 … 99999 | `DtlsTaxesPaid[].SrlNoOfChaln` | required |
| `[H16]` | Amount deposited (Rs) | `[H18:H23]` (`TPSC_Amt`) | integer, 0 … 99999999999999 | `DtlsTaxesPaid[].Amount` | required; ≥ 0 |

**Full leaf paths (verbatim schema keys), from `--leaves ScheduleTPSA`:**
- `ScheduleTPSA.AmtPrimaryAdjUs92CE_2A` — integer, 0 … 99999999999999
- `ScheduleTPSA.AdditionalIncTax18PercAbove` — integer
- `ScheduleTPSA.Surcharge12Perc` — integer
- `ScheduleTPSA.HealthEducationCess` — integer
- `ScheduleTPSA.TotalAdditionalTax` — integer
- `ScheduleTPSA.TaxesPaid` — integer
- `ScheduleTPSA.NetTaxPayable` — integer
- `ScheduleTPSA.DtlsTaxesPaid[]` — array of { `BSRCode`, `BankBranchName`, `DateDep`, `SrlNoOfChaln`, `Amount` }
- `ScheduleTPSA.TotalAmountDeposited` — integer

## The rules the sheet computes (with cell references)

Defined-name → cell (from `workbook.xml`): `TPSA_92CE_Amount`=`H4`, `TPSA_Additional_Income`=`H8`, `TPSA_Surcharge`=`H9`, `TPSA_Education_Cess`=`H10`, `TPSA_AddtionalTax_Total`=`H11`, `TPSA_Taxpaid`=`H12`, `TPSA_Nettax`=`H13`, `TPSC_Amt`=`H18:H23`, `TPSC_Amount_Deposited`=`H24`.

- **`[H8]` (2a) = `MAX(0,ROUND(TPSA_92CE_Amount*0.18,0))`** — additional income-tax @ 18% of the primary adjustment (Sl. 1). Rules.json n750: *"Income tax payable at sl.no.2a should be 18% of amount of primary adjustment sl.no.1"*.
- **`[H9]` (2b) = `MAX(0,ROUND(TPSA_Additional_Income*0.12,0))`** — surcharge @ 12% of 2a. Rules.json n751: *"Surcharge should be 12% of amount of Additional income tax payable"*.
- **`[H10]` (2c) = `MAX(0,ROUND((TPSA_Additional_Income+TPSA_Surcharge)*0.04,0))`** — H&E cess @ 4% of (2a+2b). Rules.json n752: *"Health & Education cess should be 4% of amount of (Additional income tax payable+ Surcharge )"*.
- **`[H11]` (2d) = `MAX(0,TPSA_Additional_Income+TPSA_Surcharge+TPSA_Education_Cess)`** — total additional tax = 2a+2b+2c. Rules.json n753: *"Sr. No. 2d should be equal to sum of (2a +2b+2c)"*.
- **`[H12]` (3) = `MAX(0,TPSC_Amount_Deposited)`** — taxes paid = challan-table total. Rules.json n754: *"Sr. No. 3 is should be equal to sum of Tax amount deposited"*.
- **`[H13]` (4) = `MAX(0,TPSA_AddtionalTax_Total-TPSA_Taxpaid)`** — net tax payable = 2d − 3, floored at 0. Rules.json n755: *"Sr. No. 4 should be equal to (2d-3)"*.
- **`[H24]` = `SUM(TPSC_Amt)`** — Total of the "Amount deposited" column (rows 18–23) → `TotalAmountDeposited`.
- **`[C19]=C18+1`, `[C20]=C19+1` … `[C23]=C22+1`** — running Sl. No. for the challan rows (display only, no schema key).
- **Date validator, rules.json n756 (cat A):** *"Date at which tax is deposit cannot be after System Date"* — `DateDep` ≤ today; schema also requires on/after 2021-04-01.

### Gating / cross-schedule rules
- **rules.json n190 (cat A):** *"Part A- OI If in Part A-OI, \"Whether assessee is exercising option under subsection 2A of section 92CE\" at sl.no.17 is selected as YES"* → **n191:** *"then Schedule TPSA should be filled"*. The flag is Part A-OI `ScheduleTPSAFlg` (cell L117).

## Dropdowns

`python tools/dump.py --form ITR-5 --dropdowns "Schedule TPSA"` returns **no enumerated value lists** — every entry has `"values": null`. They are data-validation constraints (text-length / numeric), not selectable dropdowns:
- `[H4:H7]` source "0" — numeric ≥ 0 (only `[H4]` is live; H5–H7 sit on hidden rows).
- `[D18:D23]` source "7" — BSR Code text length.
- `[E18:E23]` source "125" — bank/branch name maxLength 125.
- `[F18:F23]` source "10" — date text length (DD/MM/YYYY = 10 chars).
- `[G18:G23]` source "0" and `[H18:H23]` source "0" — numeric ≥ 0.
- `[E6:E7]` source "0" — belongs to the hidden FY rows (not built).

No option values to enumerate for this sheet.

## What repeats and what is one figure

- **Repeats:** `DtlsTaxesPaid[]` — the "Details of Taxes Paid" challan grid, rows 18–23 (up to **6** challans). Each instance = BSR Code, Bank/Branch name, Date of Deposit, Serial No. of Challan, Amount deposited.
- **One figure each:** `AmtPrimaryAdjUs92CE_2A`, `AdditionalIncTax18PercAbove`, `Surcharge12Perc`, `HealthEducationCess`, `TotalAdditionalTax`, `TaxesPaid`, `NetTaxPayable`, `TotalAmountDeposited`.

## Mandatory

Schema `required` for `ScheduleTPSA`: **`AmtPrimaryAdjUs92CE_2A`, `AdditionalIncTax18PercAbove`, `Surcharge12Perc`, `HealthEducationCess`, `TotalAdditionalTax`, `TaxesPaid`, `NetTaxPayable`, `TotalAmountDeposited`** (all eight scalar leaves, when the block is present).

Within each `DtlsTaxesPaid[]` instance, `required`: **`BSRCode`, `BankBranchName`, `DateDep`, `SrlNoOfChaln`, `Amount`** (all five, per the array's `required`).

The whole block is **conditional**: present only when Part A-OI `ScheduleTPSAFlg` = "Yes" (Sl. No. 17). When present, the primary-adjustment amount is user-mandatory (vba validator).

## Hidden rows — not built

Three rows are hidden (`sheet_map.json`: `hidden_rows: 3`); marked `H` in the dump — **do not build**:
- **`r5H` `[D5]`** = "Financial Year for which claiming benefit under Section 92CE (2A)]" — legacy FY-selection header.
- **`r6H` `[C6]` "1a" / `[D6]` "2019-20"** — legacy FY row (with hidden dropdown `[E6]`).
- **`r7H` `[C7]` "1b" / `[D7]` "2020-21"** — legacy FY row (with hidden dropdown `[E7]`).

These carry the defined name `TPSA.Amount` = `$E$6:$E$7`, which maps to **no schema key** in `ScheduleTPSA` and is not exported. The live primary-adjustment figure is `[H4]` (`TPSA_92CE_Amount`), not these rows.

## What this means for the build

- Build **one** `ScheduleTPSA` object plus a repeating `DtlsTaxesPaid[]` grid (up to 6 challan rows). Do not build the hidden FY rows (5–7) or `TPSA.Amount`.
- **One user input:** `[H4]` → `AmtPrimaryAdjUs92CE_2A` (integer ≥ 0). Everything else in the top block is **computed** — replicate the formulas exactly:
  - `AdditionalIncTax18PercAbove = round(AmtPrimaryAdjUs92CE_2A * 0.18)`
  - `Surcharge12Perc = round(AdditionalIncTax18PercAbove * 0.12)`
  - `HealthEducationCess = round((AdditionalIncTax18PercAbove + Surcharge12Perc) * 0.04)`
  - `TotalAdditionalTax = AdditionalIncTax18PercAbove + Surcharge12Perc + HealthEducationCess`
  - `TotalAmountDeposited = sum(DtlsTaxesPaid[].Amount)` and `TaxesPaid = TotalAmountDeposited`
  - `NetTaxPayable = max(0, TotalAdditionalTax − TaxesPaid)`
- **Gate the whole schedule** on Part A-OI `ScheduleTPSAFlg == "Yes"`; if Yes, require `AmtPrimaryAdjUs92CE_2A` (utility error message quoted above).
- Challan-row validators: `BankBranchName` ≤ 125 chars; `SrlNoOfChaln` 0…99999; `Amount` ≥ 0; `DateDep` in `YYYY-MM-DD`, on/after 2021-04-01 and not after today (n756).
- The challan grid's per-row Sl. No. is display-only (`C18`+running increment); do not map it to a schema key.
