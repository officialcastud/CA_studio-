# The book of Schedule TPSA — ITR-3, A.Y. 2026-27

Read from the utility's **TPSA** sheet (rows 3–19; rows 5, 6, 7 are hidden), with
its formulas, its data-validation cells and the VBA validators, confirmed against
schema block `ScheduleTPSA` and the rules document (`books/ITR-3/rules.json`,
serials at lines 4395–4430). This is an ITR-3-only, business/profession-head
sheet; there is no ITR-2 model. Every figure, item number and rule below is
ITR-3's own. Quotes are from the sources.

---

## The shape

**Schedule TPSA — "Tax on secondary adjustments as per section 92CE(2A)."** Where
the assessee exercised the one-time option under **sub-section (2A) of section
92CE** (Part A-OI flag `Yes`), and the excess money arising from a primary
transfer-pricing adjustment has **not been repatriated** within the prescribed
time, that excess is charged to an **additional income tax @ 18%**, plus
**surcharge @ 12%** and **health & education cess @ 4%**. The schedule computes
the total additional tax, subtracts the tax already paid, shows the net tax
payable, and carries a challan-wise table of the taxes deposited (BSR code, bank,
date, challan serial, amount) whose total feeds the "Taxes paid" line.

---

## The items

### Block `ScheduleTPSA`

| Sheet item | Field label | Type | Schema key | Rule / notes |
|---|---|---|---|---|
| **1** | Amount of primary adjustment on which option u/s 92CE(2A) is exercised & such excess money has not been repatriated within the prescribed time | integer | `AmtPrimaryAdjUs92CE_2A` | named range `TPSA_92CE_Amount`; typed. Mandatory & locked-open only when Part A-OI 92CE flag = `Yes` |
| **2a** | Additional Income tax payable @ 18% on above | integer | `AdditionalIncTax18PercAbove` | `[P8]= TPSA_92CE_Amount*0.18` |
| **2b** | Surcharge @ 12% on "a" | integer | `Surcharge12Perc` | `[P9]= TPSA_Additional_Income*0.12` |
| **2c** | Health & Education cess on (a+b) | integer | `HealthEducationCess` | `[P10]= (TPSA_Additional_Income+TPSA_Surcharge)*0.04` |
| **2d** | Total Additional tax payable (a+b+c) | integer | `TotalAdditionalTax` | `[P11]= TPSA_Additional_Income+TPSA_Surcharge+TPSA_Education_Cess` |
| **3** | Taxes paid | integer | `TaxesPaid` | `[P12]= TPSC_Amount_Deposited`; = total of the challan table |
| **4** | Net tax payable (2d-3) | integer | `NetTaxPayable` | `[P13]= MAX(TPSA_AddtionalTax_Total-TPSA_Taxpaid,0)`; floored at 0 |
| — | **Details of Taxes Paid** (the challan table below) | array | `DtlsTaxesPaid[]` | one element per deposit challan; rows 17–18 are the entry rows, `[C18]= C17+1` auto-numbers the Sl.No |
| — | Amount deposited (total of the table) | integer | `TotalAmountDeposited` | `[H19]= SUM(TPSC_Amt)` |

#### The "Details of Taxes Paid" table — column headers (row 16)

**Sl.No · BSR Code · Name of Bank and Branch · Date of deposit · Serial number of challan · Amount**

Each row is one element of `DtlsTaxesPaid[]`:

| Column | Schema key | Type | Rule / notes |
|---|---|---|---|
| BSR Code | `DtlsTaxesPaid[].BSRCode` | string | named range `TPSC_BSRCode`; must be a valid 7-digit BSR code |
| Name of Bank and Branch | `DtlsTaxesPaid[].BankBranchName` | string | `TPSC_BankName`; maxLength 125 |
| Date of deposit | `DtlsTaxesPaid[].DateDep` | string | `TPSC_DateDep`; YYYY-MM-DD, on/after 2025-04-01, not after system date |
| Serial number of challan | `DtlsTaxesPaid[].SrlNoOfChaln` | integer | `TPSC_SrlNoOfChaln`; numeric, max 99999 |
| Amount | `DtlsTaxesPaid[].Amount` | integer | `TPSC_Amt`; sums to `TotalAmountDeposited` |

---

## The rules the sheet computes

- **`[P8]= TPSA_92CE_Amount*0.18`** — additional income tax is 18% of the primary
  adjustment amount (item 1). Rule (4395): "Income tax payable should be equal to
  18% of amount of primary adjustment".
- **`[P9]= TPSA_Additional_Income*0.12`** — surcharge is 12% of the additional
  income tax at 2a. Rule (4400).
- **`[P10]= (TPSA_Additional_Income+TPSA_Surcharge)*0.04`** — health & education
  cess is 4% of (additional income tax + surcharge). Rule (4405).
- **`[P11]= TPSA_Additional_Income+TPSA_Surcharge+TPSA_Education_Cess`** — total
  additional tax payable = 2a + 2b + 2c. Rule (4410).
- **`[P12]= TPSC_Amount_Deposited`** — "Taxes paid" (item 3) equals the challan
  table total. Rule (4415): "Sl.No. 3 should be equal to sum of column 9 'Amount
  deposited'".
- **`[P13]= MAX(TPSA_AddtionalTax_Total-TPSA_Taxpaid,0)`** — net tax payable =
  total additional tax − taxes paid, floored at 0. Rule (4420): "net tax payable
  should be equal to the difference of 'Total additional tax payable' and 'Taxes
  paid'".
- **`[H19]= SUM(TPSC_Amt)`** — "Amount deposited" totals the Amount column of the
  table.
- **`[C18]= C17+1`** — the Sl.No of each subsequent challan row auto-increments.
- **Trigger (rule 4425):** if Part A-OI "Whether assessee is exercising option
  under subsection 2A of section 92CE" = `Yes`, Schedule TPSA must be filled;
  VBA locks/unlocks `TPSA_92CE_Amount` on the `sheet7.Section92CE_Flag = "Yes"`
  condition.
- **Date rule (rules 4430 & VBA):** date of deposit cannot be after the system
  date, and (A.Y. 2026-27) "Date of deposit cannot be prior to 01-04-2025 in
  Schedule TPSA."

---

## Dropdowns

**None with enumerated value lists.** The data-validation cells on the entry rows
(`D17:D18` BSR, `E17:E18` bank name len-125, `F17:F18` date, `G17:G18` challan
serial, plus the computed `P4`–`P13` cells) are length/format/lock constraints,
not selectable value lists — every list resolved to `null`. The only Yes/No that
governs this sheet lives on Part A-OI (`Section92CE_Flag`), not on TPSA itself.

---

## What repeats and what is one figure

- **Repeats (array):** `DtlsTaxesPaid[]` — the challan-wise "Details of Taxes
  Paid" table, one element per deposit (BSR code, bank/branch, date, challan
  serial, amount). Rows 17–18 in the utility are the visible entry rows and the
  utility unhides/adds more on demand.
- **One figure each (singletons):** `AmtPrimaryAdjUs92CE_2A`,
  `AdditionalIncTax18PercAbove`, `Surcharge12Perc`, `HealthEducationCess`,
  `TotalAdditionalTax`, `TaxesPaid`, `NetTaxPayable`, and the table total
  `TotalAmountDeposited`.

---

## Mandatory

Schema `required` on `ScheduleTPSA`: `AmtPrimaryAdjUs92CE_2A`,
`AdditionalIncTax18PercAbove`, `Surcharge12Perc`, `HealthEducationCess`,
`TotalAdditionalTax`, `TaxesPaid`, `NetTaxPayable`, `TotalAmountDeposited`.
Within each `DtlsTaxesPaid[]` element, required: `BSRCode`, `BankBranchName`,
`DateDep`, `SrlNoOfChaln`, `Amount`. (The whole block is only reached when the
Part A-OI 92CE(2A) option flag is `Yes`.)

---

## Hidden rows — not built

- **r5 H** — `[D5] Financial Year | [E5] Amount` — header of a hidden per-year
  primary-adjustment table; not a filed field.
- **r6 H** — `[C6] 1a | [D6] 2019-20` — hidden financial-year row (2019-20).
- **r7 H** — `[C7] 1b | [D7] 2020-21` — hidden financial-year row (2020-21).

These three rows are a legacy hidden Financial-Year/Amount breakdown; the live
schema carries only the single aggregate `AmtPrimaryAdjUs92CE_2A` (item 1), so
they are recorded here and never presented as items.

---

## What this means for the build

- Gate the whole schedule behind the Part A-OI `Section92CE_Flag = Yes`; when it
  is not `Yes`, keep `AmtPrimaryAdjUs92CE_2A` locked/blank and emit no block.
- Only item 1 (`AmtPrimaryAdjUs92CE_2A`) and the challan table are typed; every
  other head figure (2a–2d, 3, 4, the table total) is computed and untypeable
  (green): 18% / 12% / 4% chain, table SUM, and the `MAX(...,0)` net line.
- The challan table is the repeating unit — render Sl.No auto-increment, BSR
  7-digit check, bank name ≤125, challan serial numeric, and the date validator
  (YYYY-MM-DD, ≥ 2025-04-01, ≤ system date).
- Item 3 "Taxes paid" must be wired to `TotalAmountDeposited`, and net payable
  floored at zero — do not allow a negative.
- Do not build the hidden Financial-Year/Amount rows (r5–r7).


## Additional visible rows — verbatim from the sheet (completeness)
Rows present on the utility sheet and captured here verbatim so every visible label is in the book:

- Surcharge @ 12% on “a”
- Net tax payable (2d-3)
