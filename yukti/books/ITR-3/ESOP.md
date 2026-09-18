# The book of Schedule ESOP — ITR-3, A.Y. 2026-27

Read row by row from the utility's **ESOP** sheet (rows 3–26, no hidden
labelled rows), with the hidden-row flags, the formulas, the dropdowns and the
validation rules, and confirmed against the schema block **`ScheduleESOP`**.
Item numbers below are the sheet's own column numbers (1)–(8) and the rule
document's Sl.no references — not row counts.

---

## The shape

*"Schedule : ESOP — Tax deferred on ESOP: Information related to Tax deferred -
relatable to income on perquisites referred in section 17(2)(vi) received from
employer, being an eligible start-up referred to in section 80-IAC."* Under
section 192(1C) the tax on the ESOP perquisite of an eligible start-up is
**deferred** until the earliest of three events — the specified security or
sweat equity shares are **sold**, the person **ceases to be the employee**, or
**forty-eight months have expired** from the end of the relevant assessment
year of allotment. The sheet is two header fields plus a fixed six-row table
(one row per assessment year of allotment, 2021-22 to 2026-27) and a sale
sub-table (four rows) that feeds column 4(ii).

---

## The items

### Header (rows 3–5)

| Sheet ref | Field label | Type | Schema key | Rule / notes |
|---|---|---|---|---|
| C4 | **PAN of the employer being an eligible startup** | string | `PanofStartUp` | employer PAN |
| C5 | **DPIIT registration number of the employer** | string | `DPIITRegNo` | Department for Promotion of Industry and Internal Trade registration number |

### Main table — one row per assessment year (rows 6–13)

Six fixed year rows: 2021-22 (row 8), 2022-23 (9), 2023-24 (10), 2024-25 (11),
2025-26 (12), 2026-27 (13). Each year maps to its own schema object
`ScheduleESOP2122_Type` … `ScheduleESOP2627_Type`.

| Sheet col | Field label | Type | Schema key (per-year object) | Rule / notes |
|---|---|---|---|---|
| (1) | **SI. No.** | computed | — | serial 1–6; D9=D8+1 auto-increments |
| (2) | **Assessment Year** | string | `AssessmentYear` (required) | fixed: 2021-22 … 2026-27 |
| (3) | **Amount of Tax deferred brought forward** | integer | `TaxDeferredBFEarlierAY` | tax deferred b/f from that year |
| (4i) | **Such specified security or sweat equity shares were sold** (Specify the date and amount of tax attributed to such sale out of Col 3) (Details to be provided as per utility) | string | `ScheduleESOPEventDtls.SecurityType` — enum **FS / PS / NS** | dropdown: Fully Sold / Partly Sold / Not sold |
| (4ii) | **Total Amount of Table below (4ii)** | integer | `TotalTaxAttributedAmt21` (row 8), `TotalTaxAttributedAmt22` (rows 9,10,11), `TotalTaxAttributedAmt25` (row 12) | total of the sale sub-table for that AY |
| (5) | **Ceased to be the employee of the employer who allotted or transferred such specified security or sweat equity share?** | string | `ScheduleESOPEventDtls.CeasedEmployee` — enum **Y / N** | dropdown: Yes / No |
| (5i) | **Date of Ceasing** | string (YYYY-MM-DD) | `ScheduleESOPEventDtls.DateOfCeasing` | date the person left the employer |
| (6) | **Forty-eight months have expired from the end of the relevant assessment year in which specified security or sweat equity shares referred to in the said clause were allotted. If yes, specify date** | — | — | condition column (no separate schema leaf) |
| (7) | **Amount of tax payable in the current Assessment Year** | integer | `TaxPayableCurrentAY` | the deferred tax that has fallen due this year |
| (8) | **Balance amount of tax deferred to be carried forward to the next Assessment years Col (3- 7)** | integer | `BalanceTaxCF` (required) | = Col 3 − Col 7; carried to next year's ESOP |

The 2026-27 row (row 13, object `ScheduleESOP2627_Type`) carries only
`AssessmentYear` and `BalanceTaxCF` — an allotment this year has nothing yet to
bring forward; its balance column M13 pulls Gross Tax Payable from Part B-TTI.

The sale event array lives under each year: `ScheduleESOPEventDtls.ScheduleESOPEventDtlsType[]`
with leaves `ScheduleESOPEventDtlsType[].Date` and
`ScheduleESOPEventDtlsType[].TaxAttributedAmt`.

### Sale sub-table (rows 16–21) — feeds column 4(ii)

Header (row 16): **SI. No.** and *"Has any of the following events occurred
during the previous year relevant to current assessment year"*. Four data rows
(18–21), serial auto-incremented (D19=D18+1 …).

| Sheet col | Field label | Type | Schema key | Rule / notes |
|---|---|---|---|---|
| (i) | **Assessment Year i** | string | (feeds `SecurityType`/`TotalTaxAttributedAmt` per AY) | dropdown: 2021-22 … 2025-26 |
| (ii) | **Date** | string (YYYY-MM-DD) | `ScheduleESOPEventDtlsType[].Date` | date of sale, DD/MM/YYYY |
| (iii) | **Amount of Tax Attributed out of the sale** | integer | `ScheduleESOPEventDtlsType[].TaxAttributedAmt` | tax attributed to that sale |

Row 26 note: **"Note: Leave table blank if specified security or sweat equity
shares were not sold."**

Schedule total (required): **`TotalTaxAttributedAmt`** — the whole-schedule sum
of tax attributed.

---

## The rules the sheet computes

- **H8** `=IF(OR(ESOP.SecType = "Fully Sold", ESOP.CeasedEmployee = "Yes"),ESOP.TaxPrevAY,SUMIF(ESOPCurrAY,"=2021-22", (ESOP.AttributedTax)))` — column 4(ii) total for 2021-22: if fully sold or ceased employee, take the whole deferred tax; else sum the sale sub-table rows tagged to that AY. H9–H12 repeat the same with SecType2..5 / CeasedEmployee2.. and years 2022-23 … 2025-26.
- **L8** `=ESOP.TaxPrevAY` — column 7 tax payable for 2021-22 equals the deferred tax (48-month expiry falls due).
- **L9** `=IF(AND(I9="Yes",G9="Fully Sold"),F9,IF(AND(I9="No",G9="Fully Sold"),F9,IF(AND(I9="Yes",G9="Partly Sold"),F9,IF(OR(G9="Fully Sold",G9="Partly Sold"),H9,IF(AND(G9="Not sold",I9="No"),0,IF(H9>0,H9,F9))))))` — column 7 logic: fully sold ⇒ whole b/f (F); partly sold with cease ⇒ whole; partly/fully sold otherwise ⇒ sale-table total (H); **Not sold + not ceased ⇒ 0**. L10–L12 repeat for later years.
- **M8** `=MAX(0,F8-L8)` — column 8 balance carried forward = Col 3 − Col 7, floored at 0. M9–M12 repeat.
- **M13** `=sheet9.GrossTaxPayable_3b` — 2026-27 balance row is tied to Sl.no 3b of Part B-TTI (Gross Tax Payable).
- Rule (rules.json): *"Sl.no 8 should be equal to Sl.no 3-7"* — column 8 = column 3 − column 7.
- Rule: *"Sl.no 8 should be equal to Sl.no 3b of Part B-TTI"* — the balance ties to Part B-TTI 3b.
- Rule: *"If Sl.no 4 option selected as 'Not sold' AND Sl.no 5 selected as 'No', then Sl.no 7 should be Zero"* — matches L9's Not-sold/No branch.
- Rule: *"if Sl.No. 5 is selected as 'Yes', then Sl.no 7 should be auto populated from Sl.no 3"* — ceased employee ⇒ whole deferred tax falls due.

---

## Dropdowns

- **Column 4(i) — Security sold** (`G8:G12`): **(Select)**, **Fully Sold**, **Partly Sold**, **Not sold** → schema enum FS / PS / NS.
- **Column 5 — Ceased to be employee** (`I8`, `I9:I10`, `I11`, `I12`): **(Select)**, **Yes**, **No** → schema enum Y / N.
- **Sale sub-table Assessment Year** (`E18:E21`): **(Select)**, **2021-22**, **2022-23**, **2023-24**, **2024-25**, **2025-26**.
- Main-table Assessment Year column (`E8:E13`) is fixed text, not a chooser.

---

## What repeats and what is one figure

- **Repeats**: the sale sub-table `ScheduleESOPEventDtls.ScheduleESOPEventDtlsType[]` is an **array** (one entry per sale — Date + TaxAttributedAmt) under each year object.
- **One figure per year**: each of the six year objects (`ScheduleESOP2122_Type` … `ScheduleESOP2627_Type`) is a single fixed object, not a repeatable block — the years are fixed, not user-added.
- **One figure for the schedule**: `TotalTaxAttributedAmt`, `PanofStartUp`, `DPIITRegNo`.

---

## Mandatory (schema `required` keys)

- Schedule level: **`TotalTaxAttributedAmt`**.
- Each year object requires **`AssessmentYear`** and **`BalanceTaxCF`**
  (`ScheduleESOP2122_Type.AssessmentYear`, `ScheduleESOP2122_Type.BalanceTaxCF`,
  and the same pair on `ScheduleESOP2223_Type`, `ScheduleESOP2324_Type`,
  `ScheduleESOP2425_Type`, `ScheduleESOP2526_Type`, `ScheduleESOP2627_Type`).

All other leaves (`TaxDeferredBFEarlierAY`, `SecurityType`, the event array,
`CeasedEmployee`, `DateOfCeasing`, `TotalTaxAttributedAmt21`/`22`/`25`,
`TaxPayableCurrentAY`, `PanofStartUp`, `DPIITRegNo`) are optional at schema
level but must be filled where the event answers require them.

---

## Hidden rows — not built

No labelled row on the ESOP sheet is hidden. Row 29 carries the hidden flag but
holds no content (blank spacer). Rows 14–15 and 22–25 are blank layout rows and
the ESOPCurrAY helper-range area referenced by the SUMIF formulas; they carry no
labelled item. Nothing is excluded as a hidden item.

---

## What this means for the build

1. A card with two header fields (**PAN of the employer being an eligible
   startup**, **DPIIT registration number of the employer**), then the six-year
   table with columns (1)–(8) and the four-row sale sub-table.
2. Columns 4(ii), 7 and 8 are **computed** (green, untypeable): 4(ii) from the
   sale table / event answers per H-formulas; 7 per the L-formula branches; 8 =
   MAX(0, col3 − col7). The 2026-27 balance (M13) reads Part B-TTI 3b.
3. Column 7 of each year row (`TaxPayableCurrentAY`) is the deferred tax that
   has fallen due — it flows to Part B-TTI as tax payable this year.
4. Enforce the four rule-document checks: 8 = 3 − 7; 8 ties to Part B-TTI 3b;
   Not sold + No ⇒ 7 = 0; ceased = Yes ⇒ 7 auto-populated from 3.
5. **Export** — `ScheduleESOP` with `PanofStartUp`, `DPIITRegNo`, each present
   year object (`AssessmentYear` + `BalanceTaxCF` at minimum, plus event
   details and the `ScheduleESOPEventDtlsType[]` array), and the required
   `TotalTaxAttributedAmt`.
