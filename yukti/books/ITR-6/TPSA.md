# The book of Schedule TPSA — ITR-6, A.Y. 2026-27

Read row by row from the utility's **TPSA** sheet, with the hidden-row flags, the
dropdowns and the cell formulas, and confirmed against the schema block
`ScheduleTPSA`. Item numbers (1, 2a–2d, 3, 4) are taken from the ITR-6
validation-rules document (rules 687–694), never from counting rows.

---

## Schedule TPSA — Tax on secondary adjustments as per section 92CE(2A)

*"Schedule TPSA — Details of Tax on secondary adjustments as per section
92CE(2A)."* Where a transfer-pricing **primary adjustment** created excess money
lying with the associated enterprise that was not repatriated in time, section
92CE(2A) lets the assessee pay a **one-time additional tax of 18%** (with 12%
surcharge and health & education cess) on that excess, in lieu of the secondary
adjustment. This schedule computes that additional tax and records the challans
paying it.

### The shape — the computation block, then the challan table

**The computation:**

| Row/Cell | Item | Label | Type | Schema key |
|---|---|---|---|---|
| D4 | 1 | **Amount of primary adjustment on which option u/s 92CE(2A) is exercised & such excess money has not been repatriated within the prescribed time (please indicate the total of adjustments made in respect of all the AYs)** | integer | `AmtPrimaryAdjUs92CE_2A` |
| D8 | 2a | **Additional Income tax payable @ 18% on above** | computed = 18% of item 1 | `AdditionalIncTax18PercAbove` |
| D9 | 2b | **Surcharge @ 12% on "a"** | computed = 12% of 2a | `Surcharge12Perc` |
| D10 | 2c | **Health & Education cess on (a+b)** | computed = 4% of (2a+2b) | `HealthEducationCess` |
| D11 | 2d | **Total Additional tax payable (a+b+c)** | computed = 2a+2b+2c | `TotalAdditionalTax` |
| D12 | 3 | **Taxes paid** | computed = Σ challans | `TaxesPaid` |
| D13 | 4 | **Net tax payable (2d-3)** | computed = 2d − 3 | `NetTaxPayable` |

**The challan table — "Details of Taxes Paid" (C15), one row per challan:**

| Col | Label | Type | Schema key |
|---|---|---|---|
| C16 | **Sl. No.** | serial | — |
| D16 | **BSR Code** | text, 7 | `DtlsTaxesPaid[].BSRCode` |
| E16 | **Name of Bank and Branch** | text, 125 | `DtlsTaxesPaid[].BankBranchName` |
| F16 | **Date of Deposit (DD/MM/YYYY)** | date | `DtlsTaxesPaid[].DateDep` |
| G16 | **Serial Number of Challan** | integer, 5 | `DtlsTaxesPaid[].SrlNoOfChaln` |
| H16 | **Amount deposited (Rs)** | integer | `DtlsTaxesPaid[].Amount` |
| G21/H21 | **Total** | computed = Σ H | `TotalAmountDeposited` |

### The rules the sheet computes

- Rule **687** (Category A): the income tax payable (2a) must be **18%** of the
  amount of primary adjustment (item 1).
- Rule **688**: the surcharge (2b) must be **12%** of the additional income tax
  payable (2a).
- Rule **689**: the health & education cess (2c) must be **4%** of (additional
  income tax + surcharge) = (2a + 2b).
- Rule **690**: total additional tax payable (2d) = 2a + 2b + 2c.
- Rule **691**: "Taxes paid" (item 3) = the sum of the amount deposited across the
  challan table (`TotalAmountDeposited`).
- Rule **692**: net tax payable (item 4) = total additional tax payable − taxes
  paid = 2d − 3.
- Rule **693**: if Part A-OI's "impermissible avoidance arrangement (section 96)"
  is **Yes**, Schedule TPSA must be filled.
- Rule **694**: a challan's date of deposit cannot be after the system date.

### The dropdowns

The sheet carries no value-list dropdowns; the data-validations on the challan
table (BSR code length 7, name length 125, date length 10, challan serial length
5, amount numeric) are length/format constraints, not enumerations.

### Cross-sheet feeds

| Flows | To |
|---|---|
| Part A-OI section-96 flag = Yes | requires this schedule (rule 693) |
| `NetTaxPayable` (item 4) | Part B-TTI, tax payable on secondary adjustment |

### Hidden rows

- **r5H** — "Financial Year for which claiming benefit under Section 92CE (2A)" —
  hidden; **not built**.
- **r6H** — item 1a, financial year **2019-20** — hidden; not built.
- **r7H** — item 1b, financial year **2020-21** — hidden; not built.

These year-wise rows are hidden in the utility (the year break-up was used in the
first years of the provision); the schema carries only the single aggregate
`AmtPrimaryAdjUs92CE_2A`, so the display collapses to one primary-adjustment
figure. Logged as hidden, per rule 1.

### Schema

`ScheduleTPSA` — `AmtPrimaryAdjUs92CE_2A`, `AdditionalIncTax18PercAbove`,
`Surcharge12Perc`, `HealthEducationCess`, `TotalAdditionalTax`, `TaxesPaid`,
`NetTaxPayable`, `DtlsTaxesPaid[]{BSRCode, BankBranchName, DateDep, SrlNoOfChaln,
Amount}`, `TotalAmountDeposited`. All the scalar leaves and the challan-object
leaves are required; the challan array is present only when a challan is entered.

### What this means for the build

A computation card (item 1 typed; 2a–2d, 3 and 4 all computed and untypeable per
rules 687–692) over a repeatable challan table whose total feeds "Taxes paid".
Checks for the four percentage identities and the date-not-in-future rule (694),
and a requirement message when Part A-OI's section-96 flag is Yes (693). Export
`ScheduleTPSA` with `DtlsTaxesPaid[]` only when a challan is present, totals at
zero otherwise.
