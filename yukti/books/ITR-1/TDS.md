# The book of the TDS sheet — ITR-1 SAHAJ, A.Y. 2026-27

Read row by row from the utility's **TDS** sheet and confirmed against the CBDT
ITR-1 schema blocks **TDSonSalaries** and **TDSonOthThanSals** (`section_map.json`
→ section `paid`; `schema_tree.md` §14 and §15, VBA lines 35363-35758). The sheet
is the taxpayer's register of pre-paid taxes deducted at source, in four stacked
tables: **18 TDS1** (TDS from salary, Form 16), **19 TDS2** (TDS on income other
than salary, Form 16A), **20 TDS3** (TDS on rent under 26QB, Form 16C) and
**21 IT** (advance-tax and self-assessment-tax challans). Nothing here is
invented; the appendices list every schema leaf of the two mapped TDS blocks
(plus the TDS3 and IT tables that share the sheet), every live row verbatim, and
every dropdown value.

---

## 1 · Purpose and shape

Four tables, each with a header, a column-number band and a **Total** row.

- **18 TDS1** (rows 3-11) — TDS from **SALARY** [as per Form 16 issued by
  Employer(s)] → block `TDSonSalaries`, array `TDSonSalary[]`, total
  `TotalTDSonSalaries`.
- **19 TDS2** (rows 14-22) — TDS from income **OTHER THAN Salary** [as per Form
  16A issued by Deductor(s)] → block `TDSonOthThanSals`, array
  `TDSonOthThanSal[]`, total `TotalTDSonOthThanSals`.
- **20 TDS3** (rows 25-32) — TDS [as per Form 16C furnished by the Payer(s)] →
  block `ScheduleTDS3Dtls`, array `TDS3Details[]`, total `TotalTDS3Details`.
- **21 IT** (rows 35-43) — Details of Advance tax and Self Assessment tax
  payments → block `TaxPayments`, array `TaxPayment[]`, total `TotalTaxPayments`.

---

## 2 · 18 TDS1 — TDS from salary (rows 3-11)

| Col | Header label | Type | Schema key |
|---|---|---|---|
| 1 | Tax Deduction Account Number (TAN) of the Deductor | string | `TDSonSalary[].EmployerOrDeductorOrCollectDetl.TAN` |
| 2 | Name of Deductor | string | `...EmployerOrDeductorOrCollectDetl.EmployerOrDeductorOrCollecterName` |
| 3 | Income chargeable under Salaries | integer | `TDSonSalary[].IncChrgSal` |
| 4 | Total Tax Deducted | integer | `TDSonSalary[].TotalTDSSal` |
| — | Total | integer | `TotalTDSonSalaries` |

## 3 · 19 TDS2 — TDS on income other than salary (rows 14-22)

| Col | Header label | Type | Schema key |
|---|---|---|---|
| 1 | Tax Deduction Account Number (TAN) of the Deductor | string | `TDSonOthThanSal[].EmployerOrDeductorOrCollectDetl.TAN` |
| 2a | Name of Deductor | string | `...EmployerOrDeductorOrCollectDetl.EmployerOrDeductorOrCollecterName` |
| 2b | Section under which TDS deducted | dropdown (`TDS_sectionslist`) | `TDSonOthThanSal[].TDSSection` |
| 3 | Gross receipt which is subject to tax Deduction | integer | `TDSonOthThanSal[].AmtForTaxDeduct` |
| 4 | Year of tax deduction | dropdown (`TDS2_YearRange`) | `TDSonOthThanSal[].DeductedYr` |
| 5 | Tax Deducted | integer | `TDSonOthThanSal[].TotTDSOnAmtPaid` |
| 6 | TDS credit out of (5) claimed this Year | integer | `TDSonOthThanSal[].ClaimOutOfTotTDSOnAmtPaid` |
| — | Total | integer | `TotalTDSonOthThanSals` |

## 4 · 20 TDS3 — TDS on rent under 26QB (rows 25-32) and 21 IT — challans (rows 35-43)

TDS3 (Form 16C) columns map to `ScheduleTDS3Dtls.TDS3Details[]`: PAN of the
Tenant (`PANofTenant`), Aadhaar No of the tenant (`AadhaarofTenant`), Name of the
Tenant (`NameOfTenant`), Section (`TDSSection`, `TDS_sectionslist`), Gross
receipt, Year of tax Deduction (`DeductedYr`, `TDS3_YearRange`), Tax Deducted
(`TDSDeducted`) and TDS credit claimed this Year (`TDSClaimed`); total
`TotalTDS3Details`.

**21 IT** (Details of Advance tax and Self Assessment tax payments) columns map
to `TaxPayments.TaxPayment[]`: BSR Code (`BSRCode`), Date of Deposit
(`DateDep`), Serial Number of Challan (`SrlNoOfChaln`) and Tax Paid (`Amt`);
total `TotalTaxPayments`.

---

## 5 · Cross-sheet feeds

**Out:** `TotalTDSonSalaries` + `TotalTDSonOthThanSals` + `TotalTDS3Details` →
**D12(c) Total TDS Claimed (Total from item 18 + item 19 + item 20)** on Taxes
Paid and Verification → `TaxPaid.TaxesPaid.TDS`. The IT challans feed **D12(a)
Advance Tax** and **D12(b) Self Assessment Tax** (`TaxPayments.TotalTaxPayments`,
split by date into advance vs self-assessment).

**In:** column 3 of TDS1 (income chargeable under salaries) is cross-checked
against the salary head on Income Details; the section and year columns are
constrained to the named dropdown lists.

---

## Appendix · Every schema leaf of the mapped blocks (full paths)
`*` = schema-required. Blocks TDSonSalaries and TDSonOthThanSals are the mapped
blocks; ScheduleTDS3Dtls and TaxPayments share this sheet and are listed too.
```
  -- TDSonSalaries --
  TDSonSalaries.TDSonSalary[].EmployerOrDeductorOrCollectDetl.TAN string
  TDSonSalaries.TDSonSalary[].EmployerOrDeductorOrCollectDetl.EmployerOrDeductorOrCollecterName string
  TDSonSalaries.TDSonSalary[].IncChrgSal int
  TDSonSalaries.TDSonSalary[].TotalTDSSal int
* TDSonSalaries.TotalTDSonSalaries int
  -- TDSonOthThanSals --
  TDSonOthThanSals.TDSonOthThanSal[].EmployerOrDeductorOrCollectDetl.TAN string
  TDSonOthThanSals.TDSonOthThanSal[].EmployerOrDeductorOrCollectDetl.EmployerOrDeductorOrCollecterName string
  TDSonOthThanSals.TDSonOthThanSal[].AmtForTaxDeduct int
  TDSonOthThanSals.TDSonOthThanSal[].TDSSection enum(TDSSection)
  TDSonOthThanSals.TDSonOthThanSal[].DeductedYr enum(year)
  TDSonOthThanSals.TDSonOthThanSal[].TotTDSOnAmtPaid int
  TDSonOthThanSals.TDSonOthThanSal[].ClaimOutOfTotTDSOnAmtPaid int
* TDSonOthThanSals.TotalTDSonOthThanSals int
  -- ScheduleTDS3Dtls (26QB rent, shares this sheet) --
  ScheduleTDS3Dtls.TDS3Details[].PANofTenant string
  ScheduleTDS3Dtls.TDS3Details[].AadhaarofTenant string
  ScheduleTDS3Dtls.TDS3Details[].NameOfTenant string
  ScheduleTDS3Dtls.TDS3Details[].TDSSection enum(TDSSection)
  ScheduleTDS3Dtls.TDS3Details[].DeductedYr enum(year)
  ScheduleTDS3Dtls.TDS3Details[].TDSDeducted int
  ScheduleTDS3Dtls.TDS3Details[].TDSClaimed int
* ScheduleTDS3Dtls.TotalTDS3Details int
  -- TaxPayments (advance / self-assessment challans, shares this sheet) --
  TaxPayments.TaxPayment[].BSRCode string
  TaxPayments.TaxPayment[].DateDep date
  TaxPayments.TaxPayment[].SrlNoOfChaln int
  TaxPayments.TaxPayment[].Amt int
* TaxPayments.TotalTaxPayments int
```

## Appendix · Every live row of the sheet, verbatim
```
r   3 : [C3] 18 TDS1  |  [D3] Details of Tax Deducted at Source from SALARY [As per FORM 16 issued by Employer(s)]
r   4 : [D4] SI.No.  |  [E4] Tax Deduction Account Number (TAN) of the Deductor  |  [F4] Name of Deductor  |  [G4] Income chargeable under Salaries  |  [H4] Total Tax Deducted
r   5 : [E5] (1)  |  [F5] (2)  |  [G5] (3)  |  [H5] (4)
r  11 : [C11] Total
r  14 : [C14] 19 TDS2  |  [D14] Details of Tax Deducted at Source from Income OTHER THAN Salary [As per FORM 16 A issued by Deductor
r  15 : [D15] SI.No.  |  [E15] Tax Deduction Account Number (TAN) of the Deductor  |  [F15] Name of Deductor  |  [G15] Section under which TDS deducted  |  [H15] Gross receipt which is subject to tax Deduction  |  [I15] Year of tax deduction  |  [J15] Tax Deducted  |  [K15] TDS credit out of (5) claimed this Year
r  16 : [E16] (1)  |  [F16] (2a)  |  [G16] (2b)  |  [H16] (3)  |  [I16] (4)  |  [J16] (5)  |  [K16] (6)
r  22 : [C22] Total
r  25 : [C25] 20 TDS3  |  [D25] Details of Tax Deducted at Source [As per Form 16C furnished by the Payer(s)]
r  26 : [D26] SI.No.  |  [E26] Permanent Account Number (PAN) of the Tenant  |  [F26] Aadhaar No of the tenant  |  [G26] Name of the Tenant  |  [H26] Section under which TDS deducted  |  [I26] Gross receipt which is subject to tax Deduction  |  [J26] Year of tax Deduction  |  [K26] Tax Deducted  |  [L26] TDS credit out of (6) claimed this Year
r  27 : [E27] (1)  |  [F27] (2)  |  [G27] (3a)  |  [H27] (3b)  |  [I27] (4)  |  [J27] (5)  |  [K27] (6)  |  [L27] (7)
r  32 : [C32] Total  |  [D32] Total
r  34 : [X34] ExSAT
r  35 : [C35] 21 IT  |  [D35] Details of Advance tax and Self Assessment tax payments  |  [N35] TN AND PONDICHERRY CASE
r  36 : [D36] Sl.No.  |  [E36] BSR Code  |  [F36] Date of Deposit (DD/MM/YYYY)  |  [G36] Serial Number of Challan  |  [H36] Tax Paid
r  37 : [E37] (1)  |  [F37] (2)  |  [G37] (3)  |  [H37] (4)  |  [N37] Year  |  [O37] Day  |  [P37] Month  |  [T37] normal case  |  [U37] TN case
r  43 : [C43] Total
```

## Appendix · Every dropdown value, verbatim

**Cells `I17:I21`** — source `TDS2_YearRange` — 19 values:
```
(Select) | 2008-09 | 2009-10 | 2010-11 | 2011-12 | 2012-13 | 2013-14 | 2014-15 | 2015-16 | 2016-17 | 2017-18 | 2018-19 | 2019-20 | 2020-21 | 2021-22 | 2022-23 | 2023-24 | 2024-25 | 2025-26
```

**Cells `J28:J31`** — source `TDS3_YearRange` — 10 values:
```
(Select) | 2017-18 | 2018-19 | 2019-20 | 2020-21 | 2021-22 | 2022-23 | 2023-24 | 2024-25 | 2025-26
```

**Cells `G17:G21 H28:H31`** — source `TDS_sectionslist` — 60 values:
```
(Select) | 192-Salary-Payment to Government employees other than Indian Government employees | 192-Salary-Payment to employees other than Government employees | 192-Salary-Payment to Indian Government employees | 192A-TDS on PF withdrawal | 193-Interest on Securities | 194-Dividends | 194A-Interest other than 'Interest on securities' | 194B-Winning from lottery or crossword puzzle | 194BA-Winnings from online games | 194BB-Winning from horse race | 194C-Payments to contractors and sub-contractors | 194D-Insurance commission | 194DA-Payment in respect of life insurance policy | 194E-Payments to non-resident sportsmen or sports associations | 194EE-Payments in respect of deposits under National Savings | 194F-Payments on account of repurchase of units by Mutual Fund or Unit Trust of India | 194G-Commission, price, etc. on sale of lottery tickets | 194H-Commission or brokerage | 194I(a)-Rent on hiring of plant and machinery | 194I(b)-Rent on other than plant and machinery | 194IA-TDS on Sale of immovable property | 194IB-Payment of rent by certain individuals or Hindu undivided | 194IC-Payment under specified agreement | 194J(a)-Fees for technical services | 194J(b)-Fees for professional  services or royalty etc | 194K-Income payable to a resident assessee in respect of units of a specified mutual fund or of the units of the Unit Trust of India | 194LA-Payment of compensation on acquisition of certain immovable | 194LB-Income by way of Interest from Infrastructure Debt fund | 194LC-194LC (2)(i) and (ia) Income under clause (i) and (ia) of sub-section (2) of section 194LC | 194LC-194LC (2)(ib) Income under clause (ib) of sub-section (2) of section 194LC | 194LC-194LC (2)(ic) Income under clause (ic) of sub-section (2) of section 194LC | 194LBA(a)-Certain income in the form of interest from units of a business trust to a resident unit holder | 194LBA(b)-Certain income in the form of dividend from units of a business trust to a resident unit holder | 194LBA(a)-194LBA(a) income referred to in section 10(23FC)(a) from units of a business trust-NR | 194LBA(b)-194LBA(b) Income referred to in section 10(23FC)(b) from units of a business trust-NR | 194LBA(c)-194LBA(c) Income referred to in section 10(23FCA) from units of a business trust-NR | 194LBB-Income in respect of units of investment fund | 194R-Benefits or perquisites of business or profession | 194S-Payment of consideration for transfer of virtual digital asset by persons other than specified persons | Proviso to section 194B-Winnings from lotteries and crossword puzzles where consideration is made in kind or cash is not sufficient to meet the tax liability and tax has been paid before such winnings are released | First Proviso to sub-section(1) of section 194R-Benefits or perquisites of business or profession where such benefit is provided in kind or where part in cash is not sufficient to meet tax liability and tax required to be deducted is paid before such benefit is released | Proviso to sub- section(1) of section 194S-Payment for transfer of virtual digital asset where payment is in kind or in exchange of another virtual digital asset and tax required to be deducted is paid before such payment is released | 194LBC-Income in respect of investment in securitization trust | 194LD-TDS on interest on bonds / government securities | 194M-Payment of certain sums by certain individuals or HUF | 194N-Payment of certain amounts in cash other than cases covered by first proviso or third proviso | 194N -First Proviso Payment of certain amounts in cash to non-filers except in case of co-operativesocieties | 194N -Third Proviso Payment of certain amounts in cash to co-operative societies not covered by first proviso | 194N-First Proviso read with Third Proviso Payment of certain amount in cash to non-filers being co-operative societies | 194O-Payment of certain sums by e-commerce operator to e-commerce participant. | 194P-Deduction of tax in case of specified senior citizen | 194Q-Deduction of tax at source on payment of certain sum for purchase of goods | 195-Other sums payable to a non-resident | 196A-Income in respect of units of non-residents | 196B-Payments in respect of units to an offshore fund | 196C-Income from foreign currency bonds or shares of Indian | 196D-Income of foreign institutional investors from securities | 196D(1A)-Income of specified fund from securities | 194BA(2)-Sub-section (2) of section 194BA Net Winnings from online games where the net winnings are made in kind or cash is not sufficient to meet the tax liability and tax has been paid before such net winnings are released
```

