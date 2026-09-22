# The book of the TCS sheet — ITR-1 SAHAJ, A.Y. 2026-27

Read row by row from the utility's **TCS** sheet (item **22 TCS**) and confirmed
against the CBDT ITR-1 schema block **ScheduleTCS** (`section_map.json` → section
`paid`; `schema_tree.md` §17, VBA lines 36767-36870). This is the register of
**Tax Collected at Source** — the credit a taxpayer claims for tax that a
*collector* (seller) collected from them under Chapter XVII-BB, as reported on
**Form 27D**. Its one total feeds the "Total TCS Claimed" line (D12(d)) of the
Taxes-Paid computation. Nothing here is invented; the appendices list every
schema leaf of `ScheduleTCS`, every live row verbatim, and every dropdown value.

---

## 1 · Purpose and shape

One flat grid, one row per Form-27D certificate. Row 3 is the schedule title
(**22 TCS — Details of Tax Collected at Source [as per Form 27D issued by the
collector(s)]**). Row 4 is the seven-column header, row 5 the column-number
band `(1)…(6)`, the entry rows follow, and row 10 is the **Total**.

Detail array: `ScheduleTCS.TCS[]`; the total `TotalSchTCS` is a scalar key.

---

## 2 · The columns (rows 4-5)

| Col | Header label | Type | Schema key |
|---|---|---|---|
| — | Sl.No. | serial | `TCS[]` index |
| 1 | Tax Collection Account Number of the Collector | string (TAN) | `TCS[].EmployerOrDeductorOrCollectDetl.TAN` |
| 2 | Name of the Collector | string | `TCS[].EmployerOrDeductorOrCollectDetl.EmployerOrDeductorOrCollecterName` |
| 3 | Gross payment which is subject to tax collection | integer | `TCS[].AmtTaxCollected` |
| 4 | Year of tax Collection | dropdown (year) | `TCS[].CollectedYr` |
| 5 | Tax Collected | integer | `TCS[].TotalTCS` (brought-forward + current) |
| 6 | TCS credit out of (5) claimed this Year | integer | `TCS[].AmtTCSClaimedThisYear` |

Column 5 carries the whole TCS available on the certificate; column 6 is only the
portion the assessee claims **this** year (the remainder can belong to another
person or be carried to a later year). Row 10 sums column 6 into `TotalSchTCS`.

---

## 3 · The total (row 10)

| Item | Label | Schema key |
|---|---|---|
| — | Total (Total of Tax Collected credit claimed this year) | `TotalSchTCS` |

---

## 4 · The law

Tax Collected at Source is levied by the seller/collector under section 206C (for
example on sale of scrap, tendu leaves, minerals, motor vehicles above the
threshold, remittances under the LRS and overseas tour packages). The collector
issues **Form 27D**; the collectee claims the credit here, matched against
Form 26AS / AIS. Only the amount **claimed this year** (column 6) is credited
against the tax liability; the balance may pertain to another year or another
person.

---

## 5 · Cross-sheet feeds

**Out:** `TotalSchTCS` → **D12(d) Total TCS Claimed (Total from item 22)** on the
Taxes Paid and Verification sheet → `TaxPaid.TaxesPaid.TCS`.

**In:** entered from each Form 27D; the **Year of tax Collection** column is
constrained to the `TCS_CollectedYear` list.

---

## 6 · The dropdown

Column 4 (**Year of tax Collection**, cells `H6:H9`) — source named range
`TCS_CollectedYear`: `(Select)` plus every financial year from **2008-09** to
**2025-26**.

---

## Appendix · Every schema leaf of block ScheduleTCS (full paths)
`*` = schema-required.
```
  ScheduleTCS.TCS[] array
  ScheduleTCS.TCS[].EmployerOrDeductorOrCollectDetl.TAN string
  ScheduleTCS.TCS[].EmployerOrDeductorOrCollectDetl.EmployerOrDeductorOrCollecterName string
  ScheduleTCS.TCS[].AmtTaxCollected integer
  ScheduleTCS.TCS[].CollectedYr enum(year)
  ScheduleTCS.TCS[].TotalTCS integer
  ScheduleTCS.TCS[].AmtTCSClaimedThisYear integer
* ScheduleTCS.TotalSchTCS integer
```

## Appendix · Every live row of the sheet, verbatim
```
r   3 : [C3] 22 TCS  |  [D3] DETAILS OF TAX COLLECTED AT SOURCE [AS PER FORM 27D ISSUED BY THE COLLECTOR(S)]
r   4 : [D4] SI.No.  |  [E4] Tax Collection Account Number of the Collector  |  [F4] Name of the Collector  |  [G4] Gross payment which is subject to tax collection  |  [H4] Year of tax Collection  |  [I4] Tax Collected  |  [J4] TCS credit out of (5) claimed this Year
r   5 : [E5] (1)  |  [F5] (2)  |  [G5] (3)  |  [H5] (4)  |  [I5] (5)  |  [J5] (6)
r  10 : [C10] Total
```

## Appendix · Every dropdown value, verbatim

**Cells `H6:H9`** — Year of tax Collection (source named range `TCS_CollectedYear`) — 18 years + `(Select)`:
```
(Select) | 2008-09 | 2009-10 | 2010-11 | 2011-12 | 2012-13 | 2013-14 | 2014-15 | 2015-16 | 2016-17 | 2017-18 | 2018-19 | 2019-20 | 2020-21 | 2021-22 | 2022-23 | 2023-24 | 2024-25 | 2025-26
```
