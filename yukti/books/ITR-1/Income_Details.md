# The book of the Income Details sheet — ITR-1 SAHAJ, A.Y. 2026-27

Read row by row from the utility's **Income Details** sheet — the face of ITR-1
SAHAJ — and confirmed against the CBDT ITR-1 schema. Its mapped block is
**ITR1_TaxComputation** (`section_map.json` → section `tax`; `schema_tree.md` §8,
VBA lines 35216-35329); the sheet also carries the income and deduction leaves of
**ITR1_IncomeDeductions** (§7, salary / other sources / Chapter VI-A / total
income / exempt income) and **LTCG112A** (§9) that are entered or shown here.
This is the single page that runs from Part A General Information through the
five heads of income, Part C deductions, total income, and the D-series tax,
cess, interest and fee computation. Nothing here is invented; the appendices list
every schema leaf of the mapped and on-sheet blocks, every live row verbatim, and
every dropdown value.

Return context: ITR-1 SAHAJ is for a **RESIDENT (other than not ordinarily
resident) individual** with total income up to Rs. 50 lakh from salary/pension,
one house property, other sources, and agricultural income up to Rs. 5,000.

---

## 1 · Part A — General Information (rows 6-53)

First / Middle / Last Name, **Aadhaar Number [12 Digits]** (or Aadhaar Enrolment
Id), **Date of Birth (DD/MM/YYYY)**, communication details (Primary/Secondary
Email ID, mobile), Primary and Secondary Address (Flat/Door/Block No., Road/
Street/Post Office, Area/Locality, Town/City, **State**, **Country/Region**,
PIN). Regime and filing switches:

- **Do you wish to exercise the option u/s 115BAC(6) of Opting out of new tax
  regime?** (default "No") — the old-vs-new regime switch (`OptOutNewTaxRegime`).
- **Are you filing return of income under Seventh proviso to section 139(1)** but
  otherwise not required to furnish a return — plus the four sub-conditions
  (deposit exceeding Rs. 1 Crore in current accounts; expenditure exceeding Rs. 2
  lakhs on foreign travel; expenditure exceeding Rs. 1 lakh on electricity; TDS+TCS
  during the year; savings-bank deposit of fifty lakh rupees or more).
- **A22 Whether this return is being filed by a representative assessee?** with
  the representative's Name, Email-ID and Contact no.
- Employer category (`EmpCatList`) and, for a revised/defective return, the
  Receipt Number and the notice/DIN (Unique Number/Document Identification Number).

## 2 · The five heads of income (rows 54-112)

**B1 SALARY / PENSION** (`ITR1_IncomeDeductions`): (i) **Gross Salary (ia+ib+ic)**
= Salary as per section 17(1) + Value of perquisites as per section 17(2) +
Profit in lieu of salary as per section 17(3); (ii) **Less: Allowances to the
extent exempt u/s 10** (nature-of-exempt-allowance grid, including Sec 10(13A)
HRA); (iii) **Net Salary (i − ii)**; (iv) **Deductions u/s 16** = Standard
Deduction u/s 16(ia) + Entertainment Allowance u/s 16(ii) + Professional Tax u/s
16(iii); (v) **Income chargeable under the Head 'Salaries' (iii − iv)**.

**B2 HOUSE PROPERTY** — Type of House Property, Gross rent, Tax paid to local
authorities, Annual Value, 30% of Annual Value, Interest payable on borrowed
capital, Arrears/Unrealised Rent; **Income chargeable under the head 'House
Property'** (feeds from the HP sheet, loss shown in negative).

**B3 Income from Other Sources** — nature-of-income grid (`PART_Nature_2`)
including interest from savings/deposit/income-tax refund, family pension,
provident-fund interest and Any Other; **Dividend** quarterly break-up (Upto
15-Jun-2025 … 16-Mar to 31-Mar-2026); **Less: Deduction u/s 57(iia)** in case of
family pension only.

**B4 Gross Total Income (B1+B2+B3+C3a(iii))** — if loss, the figure is put in
negative.

## 3 · Part C — Deductions and Taxable Total Income (rows 113-165)

The Chapter VI-A deduction ladder (each is auto-populated from its own schedule
where one exists): **80C** (life insurance premium, provident fund, etc.),
**80CCC** (Pension Fund, with Type of Identifier PRAN/Other than PRAN), **80CCD(1)**,
**80CCD(1B)**, **80CCD(2)** (employer contribution), **80D** (Health Insurance
premia — health insurance premium / medical expenditure / preventive health
check-up), **80DD**, **80DDB** (with Name of the specified Disease), **80E**,
**80EE**, **80EEA**, **80EEB**, **80G**, **80GG** (with Acknowledgement number of
Form 10BA), **80GGA**, **80GGC**, **80TTA**, **80TTB**, **80U**, **80CCH**
(Agnipath), and **Any Other deductions**. **C1 Total Deductions**; **C2 Total
Income (B4 − C1)** — noting the Total Income field includes LTCG u/s 112A on
which no tax is payable; **C3 Exempt Income** (Category / Sub-Category grid);
**C3(a) Long Term capital gains u/s 112A not chargeable to Income-tax** — Total
sale consideration, Total cost of acquisition, Long term capital gains as per
sec 112A (`LTCG112A`).

## 4 · The D-series tax computation (rows 176-191) — block ITR1_TaxComputation

| Item | Label | Schema key |
|---|---|---|
| D1 | Tax Payable on Total Income | `ITR1_TaxComputation.TotalTaxPayable` |
| D2 | Rebate u/s 87A | `ITR1_TaxComputation.Rebate87A` |
| D3 | Tax payable after Rebate | `ITR1_TaxComputation.TaxPayableOnRebate` |
| D4 | Health and Education Cess @4% on (D3) | `ITR1_TaxComputation.EducationCess` |
| D5 | Total Tax and Cess (D3+D4) | `ITR1_TaxComputation.GrossTaxLiability` |
| D6 | Relief u/s 89 (submit Form 10E) | `ITR1_TaxComputation.Section89` |
| — | Balance Tax after Relief (D5−D6) | `ITR1_TaxComputation.NetTaxLiability` |
| D7 | Interest u/s 234A | `ITR1_TaxComputation.IntrstPay.IntrstPayUs234A` |
| D8 | Interest u/s 234B | `ITR1_TaxComputation.IntrstPay.IntrstPayUs234B` |
| D9 | Interest u/s 234C | `ITR1_TaxComputation.IntrstPay.IntrstPayUs234C` |
| D10 | Fee u/s 234F | `ITR1_TaxComputation.IntrstPay.LateFilingFee234F` |
| D10a | Fee for furnishing revised return of income (section 234-I) | `ITR1_TaxComputation.IntrstPay.FeeFurnish234I` |
| — | Total Interest, Fee Payable (D7+D8+D9+D10+D10a) | `ITR1_TaxComputation.TotalIntrstPay` |
| D11 | Total Tax, Fee and Interest (D5+D7+D8+D9+D10+D10a−D6) | `ITR1_TaxComputation.TotTaxPlusIntrstPay` |

**D11** is the figure carried to the Taxes Paid sheet as the total against which
D12 (taxes paid) is set to strike D13 (payable) or D14 (refund).

## 5 · Cross-sheet feeds

**In:** B2 from the HP sheet; the Chapter VI-A lines from the hidden 80C/80D/80G/
… schedules; the salary exempt-allowance 10(13A) from Schedule EA. **Out:** D11
(`TotTaxPlusIntrstPay`) → Taxes Paid and Verification; C3(a) LTCG feeds the
special-rate line.

---

## Appendix · Every schema leaf of the mapped + on-sheet blocks (full paths)
`*` = schema-required. Mapped block: ITR1_TaxComputation. On-sheet income /
deduction leaves of ITR1_IncomeDeductions and LTCG112A are listed too.
```
  -- ITR1_TaxComputation (mapped block) --
* ITR1_TaxComputation.TotalTaxPayable int
* ITR1_TaxComputation.Rebate87A int
* ITR1_TaxComputation.TaxPayableOnRebate int
* ITR1_TaxComputation.EducationCess int
* ITR1_TaxComputation.GrossTaxLiability int
* ITR1_TaxComputation.Section89 int
* ITR1_TaxComputation.NetTaxLiability int
* ITR1_TaxComputation.TotalIntrstPay int
* ITR1_TaxComputation.IntrstPay.IntrstPayUs234A int
* ITR1_TaxComputation.IntrstPay.IntrstPayUs234B int
* ITR1_TaxComputation.IntrstPay.IntrstPayUs234C int
* ITR1_TaxComputation.IntrstPay.LateFilingFee234F int
* ITR1_TaxComputation.IntrstPay.FeeFurnish234I int
* ITR1_TaxComputation.TotTaxPlusIntrstPay int
  -- ITR1_IncomeDeductions : salary head --
* ITR1_IncomeDeductions.GrossSalary int
* ITR1_IncomeDeductions.Salary int
* ITR1_IncomeDeductions.PerquisitesValue int
* ITR1_IncomeDeductions.ProfitsInSalary int
* ITR1_IncomeDeductions.NetSalary int
* ITR1_IncomeDeductions.DeductionUs16 int
* ITR1_IncomeDeductions.DeductionUs16ia int
* ITR1_IncomeDeductions.EntertainmentAlw16ii int
* ITR1_IncomeDeductions.ProfessionalTaxUs16iii int
* ITR1_IncomeDeductions.IncomeFromSal int
  -- allowances exempt u/s 10 --
  ITR1_IncomeDeductions.AllwncExemptUs10.AllwncExemptUs10Dtls[].SalNatureDesc enum
  ITR1_IncomeDeductions.AllwncExemptUs10.AllwncExemptUs10Dtls[].SalOthAmount int
  ITR1_IncomeDeductions.AllwncExemptUs10.TotalAllwncExemptUs10 int
  -- house property head (shown here, entered on HP sheet) --
* ITR1_IncomeDeductions.TotalIncomeChargeableUnHP int
  -- income from other sources --
* ITR1_IncomeDeductions.IncomeOthSrc int
  ITR1_IncomeDeductions.OthersInc.OthersIncDtlsOthSrc[].OthSrcNatureDesc enum
  ITR1_IncomeDeductions.OthersInc.OthersIncDtlsOthSrc[].OthSrcOthNatOfInc string
  ITR1_IncomeDeductions.OthersInc.OthersIncDtlsOthSrc[].OthSrcOthAmount int
  ITR1_IncomeDeductions.OthersInc.OthersIncDtlsOthSrc[].DividendInc.DateRange.Upto15Of6 int
  ITR1_IncomeDeductions.OthersInc.OthersIncDtlsOthSrc[].DividendInc.DateRange.Upto15Of9 int
  ITR1_IncomeDeductions.OthersInc.OthersIncDtlsOthSrc[].DividendInc.DateRange.Up16Of9To15Of12 int
  ITR1_IncomeDeductions.OthersInc.OthersIncDtlsOthSrc[].DividendInc.DateRange.Up16Of12To15Of3 int
  ITR1_IncomeDeductions.OthersInc.OthersIncDtlsOthSrc[].DividendInc.DateRange.Up16Of3To31Of3 int
* ITR1_IncomeDeductions.DeductionUs57iia int
  -- gross total income --
* ITR1_IncomeDeductions.GrossTotIncome int
* ITR1_IncomeDeductions.GrossTotIncomeIncLTCG112A int
  -- Chapter VI-A user-entered (UsrDeductUndChapVIA) and computed (DeductUndChapVIA) --
  UsrDeductUndChapVIA.Section80C int
  UsrDeductUndChapVIA.Section80CCC int
  UsrDeductUndChapVIA.Section80CCDEmployeeOrSE int
  UsrDeductUndChapVIA.Section80CCD1B int
  UsrDeductUndChapVIA.Section80CCDEmployer int
  UsrDeductUndChapVIA.Section80D int
  UsrDeductUndChapVIA.Section80DD int
  UsrDeductUndChapVIA.Section80DDB int
  UsrDeductUndChapVIA.Section80E int
  UsrDeductUndChapVIA.Section80EE int
  UsrDeductUndChapVIA.Section80EEA int
  UsrDeductUndChapVIA.Section80EEB int
  UsrDeductUndChapVIA.Section80G int
  UsrDeductUndChapVIA.Section80GG int
  UsrDeductUndChapVIA.Section80GGA int
  UsrDeductUndChapVIA.Section80GGC int
  UsrDeductUndChapVIA.Section80U int
  UsrDeductUndChapVIA.Section80TTA int
  UsrDeductUndChapVIA.Section80TTB int
  UsrDeductUndChapVIA.AnyOthSec80CCH int
* UsrDeductUndChapVIA.TotalChapVIADeductions int
* DeductUndChapVIA.TotalChapVIADeductions int
  -- total income --
* ITR1_IncomeDeductions.TotalIncome int
  -- exempt income --
  ExemptIncAgriOthUs10.ExemptIncAgriOthUs10Dtls[].Category enum
  ExemptIncAgriOthUs10.ExemptIncAgriOthUs10Dtls[].SubCategory enum
  ExemptIncAgriOthUs10.ExemptIncAgriOthUs10Dtls[].Description string
  ExemptIncAgriOthUs10.ExemptIncAgriOthUs10Dtls[].OthAmount int
  ExemptIncAgriOthUs10.ExemptIncAgriOthUs10Total int
  -- LTCG112A (C3a) --
* LTCG112A.TotSaleCnsdrn int
* LTCG112A.TotCstAcqisn int
* LTCG112A.LongCap112A int
```

## Appendix · Every live row of the sheet, verbatim
```
r   3 : [C3] FORM  |  [E3] ITR-1 SAHAJ  |  [J3] INDIAN INCOME TAX RETURN
r   4 : [J4] [For individuals being a RESIDENT (OTHER THAN NOT ORDINARILY RESIDENT) having total income up to Rs.
r   6 : [C6] PART A GENERAL INFORMATION  |  [E6] First Name  |  [O6] Middle Name
r   8 : [E8] Aadhaar Number [12 Digits]
r   9H: [E9] Aadhaar Enrolment Id [Note: If Aadhaar Number is not yet allotted, then Aadhaar Enrolment Id is requ
r  10 : [E10] Date of Birth (DD/MM/YYYY)
r  12 : [E12] Details to be provided for communication purposes:
r  13 : [E13] Primary Email ID of the taxpayer  |  [K13] Secondary Email ID
r  15H: [E15] Addresses to be provided for communication purposes:
r  16 : [E16] Primary Address
r  17 : [E17] Flat / Door / Block No.
r  19 : [E19] Road / Street/ Post Office  |  [W19] Area / Locality
r  21 : [E21] State  |  [K21] Country/ Region
r  22 : [E22] (Select)  |  [K22] 91-INDIA
r  23 : [E23] Is the secondary address same as primary address?
r  24 : [E24] Secondary Address:
r  25 : [E25] Flat / Door / Block No.
r  27 : [E27] Road / Street / Post Office  |  [W27] Area / Locality
r  29 : [E29] State  |  [K29] Country / Region
r  30 : [E30] (Select)  |  [K30] (Select)
r  31 : [E31] Do you wish to exercise the option u/s 115BAC(6) of Opting out of new tax regime ? (default is “No”)
r  32 : [E32] To estimate your total tax and decide as to which tax regime is beneficial, you may use income tax c
r  33 : [E33] Are you filing return of income under Seventh proviso to section 139(1) but otherwise not required t
r  34H: [E34] Have you deposited amount or aggregate of amounts exceeding Rs. 1 Crore in one or more current accou
r  35 : [E35] Have you incurred expenditure of an amount or aggregate of amount exceeding Rs. 2 lakhs for travel t
r  36 : [E36] Have you incurred expenditure of amount or aggregate of amount exceeding Rs. 1 lakh on consumption o
r  37 : [E37] Are you required to file a return as per other conditions prescribed under clause (iv) of seventh pr
r  38H: [E38] The total sales, turnover or gross receipts, as the case may be, of the person in the business excee
r  39H: [E39] the total gross receipts of the person in profession exceeds ten lakh rupees during the previous yea
r  40 : [E40] the aggregate of tax deducted at source and tax collected at source during the previous year, in the
r  41 : [E41] The deposit in one or more savings bank account of the person, in aggregate, is fifty lakh rupees or
r  42 : [E42] A22  |  [F42] Whether this return is being filed by a representative assessee? If yes, please furnish following in
r  43 : [F43] 1  |  [G43] Name of the representative assessee
r  44 : [F44] 2  |  [G44] Email-ID of the representative assessee
r  45 : [F45] 3  |  [G45] Contact no of the representative assessee
r  48H: [E48] "Tax payer is required to select section as "139(8A) in Part A General" while filing corrected retur
r  49 : [E49] If revised/defective then enter
r  50 : [E50] Receipt Number
r  51 : [E51] If filed in response to notice u/s 139(9)/142(1)/148/153C or order u/s 119(2)(b)-
r  52 : [E52] Unique Number/ Document Identification Number (DIN)
r  53H: [E53] Due Date of filing of ITR  |  [P53] 31/07/2026
r  54 : [C54] SALARY / PENSION  |  [F54] i  |  [G54] Gross Salary (ia + ib + ic)
r  55 : [G55] a  |  [I55] Salary as per section 17(1)
r  56 : [G56] b  |  [I56] Value of perquisites as per section 17(2)
r  57 : [G57] c  |  [I57] Profit in lieu of salary as per section 17(3)
r  58H: [G58] d  |  [I58] Income from retirement benefit account maintained in a notified country u/s 89A
r  59H: [I59] Country
r  60H: [I60] United States of America
r  61H: [I61] United Kingdom of Great Britain and Northern Ireland
r  62H: [I62] Canada
r  63H: [G63] e  |  [I63] Income from retirement benefit account maintained in a country other than notified country u/s 89A
r  64 : [F64] ii  |  [G64] Less : Allowances to the extent exempt u/s 10 (Ensure that it is included in salary income u/s 17(1)
r  65 : [G65] Sl.No.  |  [J65] Nature of Exempt Allowance
r  66 : [E66] B1  |  [J66] (Select)
r  67 : [J67] (Select)
r  69 : [F69] Sec 10(13A)-Allowance to meet expenditure incurred on house rent
r  70H: [F70] iia  |  [G70] Less: Income claimed for relief from taxation u/s 89A
r  71 : [F71] iii  |  [G71] Net Salary (i – ii )
r  72 : [F72] iv  |  [G72] Deductions u/s 16 (iva + ivb + ivc)
r  73 : [G73] a  |  [I73] Standard Deduction u/s 16(ia)
r  74 : [G74] b  |  [I74] Entertainment Allowance u/s 16(ii)
r  75 : [G75] c  |  [I75] Professional Tax u/s 16(iii)
r  76 : [F76] v  |  [G76] Income chargeable under the Head ‘Salaries’ (iii-iv)
r  77H: [C77] HOUSE PROPERTY  |  [E77] B2  |  [F77] Type of House Property
r  78H: [F78] i  |  [G78] Gross rent received/ receivable/ lettable value during the year
r  79H: [F79] ii  |  [G79] Tax paid to local authorities
r  80H: [F80] iii  |  [G80] Annual Value (i – ii)
r  81H: [F81] iv  |  [G81] 30% of Annual Value (30% * iii)
r  82H: [F82] v  |  [G82] Interest payable on borrowed capital
r  83H: [F83] vi  |  [G83] Arrears/Unrealised Rent received during the year Less 30%
r  84 : [G84] Income chargeable under the head ‘House Property’ ( Ʃ1k ) (If loss, put the figure in negative) Note
r  85 : [F85] Income from Other Sources
r  86 : [G86] Sl.No.  |  [J86] Nature of Income
r  87 : [E87] B3
r  92H: [F92] Income from retirement benefit account maintained in a country other than a country notified u/s 89A
r  93H: [F93] Income from retirement benefit account maintained in a notified country u/s 89A (1 + 2 + 3)
r  94H: [G94] United States of America
r  95H: [G95] United Kingdom of Great Britain and Northern Ireland
r  96H: [G96] Canada
r  97H: [F97] Income from retirement benefit account maintained in a notified country u/s 89A (Quarterly breakup o
r  98H: [F98] i  |  [G98] Upto 15-Jun-2025
r  99H: [F99] ii  |  [G99] From 16-Jun-2025 to 15-Sep-2025
r 100H: [F100] iii  |  [G100] From 16-Sep-2025 to 15-Dec-2025
r 101H: [F101] iv  |  [G101] From 16-Dec-2025 to 15-Mar-2026
r 102H: [F102] v  |  [G102] From 16-Mar-2026 to 31-Mar-2026
r 103 : [F103] Dividend (i+ii+iii+iv+v)
r 104 : [F104] i  |  [G104] Upto 15-Jun-2025
r 105 : [F105] ii  |  [G105] From 16-Jun-2025 to 15-Sep-2025
r 106 : [F106] iii  |  [G106] From 16-Sep-2025 to 15-Dec-2025
r 107 : [F107] iv  |  [G107] From 16-Dec-2025 to 15-Mar-2026
r 108 : [F108] v  |  [G108] From 16-Mar-2026 to 31-Mar-2026
r 109H: [F109] Less : Income claimed for relief from taxation u/s 89A
r 110 : [F110] Less: Deduction u/s 57(iia) (In case of family pension only)
r 111H: [F111] Gross Total Income (1+2+3) (If loss, put the figure in negative) Note: To avail the benefit of carry
r 112 : [E112] B4  |  [F112] Gross Total Income (B1+B2+B3+C3a(iii)) (If loss, put the figure in negative) Note: To avail the bene
r 113 : [E113] C  |  [F113] Part C – Deductions and Taxable Total Income
r 114H: [F114] Please note that the deduction in respect of the investment/ deposit/ payments for the period 01-04-
r 115 : [F115] a  |  [H115] 80C - Life insurance premium, deferred annuity, contributions to provident fund, subscription to cer
r 116 : [F116] b  |  [H116] 80CCC - Payment in respect Pension Fund, etc.
r 117 : [F117] Sl.No.  |  [H117] Type of Identifier
r 121 : [F121] c  |  [H121] 80CCD(1) - Contribution to pension scheme of Central Government
r 122H: [F122] Sl.No.  |  [H122] Type of Identifier
r 126 : [F126] d  |  [H126] 80CCD(1B) - Contribution to pension scheme of Central Government
r 127H: [F127] Sl.No.  |  [H127] Type of Identifier
r 131 : [H131] PRAN
r 136H: [F136] PRAN of the taxpayer
r 137 : [C137] DEDUCTIONS  |  [F137] e  |  [H137] 80CCD(2) - Contribution to pension scheme of Central Government by employer
r 138H: [F138] f  |  [H138] 80CCG - Investment made under an equity savings scheme
r 139H: [F139] PRAN of the taxpayer
r 140 : [F140] f  |  [H140] 80D-Deduction in respect of Health Insurance premia. (Please fill 80D Schedule. This field is auto-p
r 141H: [H141] a) Health insurance premium  |  [K141] (Select)
r 142H: [H142] b) Medical expenditure  |  [K142] (Select)
r 143H: [H143] c) Preventive health check-up  |  [K143] (Select)
r 144 : [F144] g  |  [H144] 80DD - Maintenance including medical treatment of a dependent who is a person with disability.(Pleas
r 145 : [F145] h  |  [H145] 80DDB - Medical treatment of specified disease  |  [K145] Name of the specified Disease
r 146 : [H146] (Select)  |  [K146] (Select)
r 147 : [F147] i  |  [H147] 80E - Interest on loan taken for higher education
r 148 : [F148] j  |  [H148] 80EE - Interest on loan taken for residential house property
r 149 : [F149] k  |  [H149] 80EEA-Deduction in respect of interest on loan taken for certain house property
r 150 : [F150] l  |  [H150] 80EEB-Deduction in respect of purchase of electric vehicle
r 151 : [F151] m  |  [H151] 80G - Donations to certain funds, charitable institutions, etc. (Please fill 80G Schedule. This fiel
r 152 : [F152] n  |  [H152] 80GG - Rent paid (Please submit form 10BA to claim deduction)
r 153 : [F153] Acknowledgement number of Form 10BA
r 154 : [F154] o  |  [H154] 80GGA - Certain donations for scientific research or rural development (Please fill 80GGA Schedule. 
r 155 : [F155] p  |  [H155] 80GGC - Contribution to Political party. (Please fill 80GGC Schedule. This field is auto-populated f
r 156H: [F156] p  |  [H156] 80 QQB - Royalty income of authors of certain books.
r 157H: [F157] q  |  [H157] 80 RRB - Royalty on patents
r 158 : [F158] q  |  [H158] 80TTA - Interest on saving bank Accounts in case of other than Resident senior citizens
r 159 : [F159] r  |  [H159] 80TTB- Interest on deposits in case of Resident senior citizens
r 160 : [F160] s  |  [H160] 80U - In case of a person with disability.(Please fill 80U Schedule. This field is auto-populated fr
r 161 : [F161] t  |  [H161] 80CCH-Contribution to Agnipath Scheme
r 162 : [F162] u  |  [H162] Any Other deductions
r 163 : [E163] C1  |  [F163] Total Deductions (Total of 5a to 5t)
r 164H: [F164] Total Income (4 - 6)
r 165 : [E165] C2  |  [F165] Total Income (B4-C1) Note: The Total Income Field includes LTCG u/s 112A. However, no tax would be p
r 166 : [E166] C3  |  [F166] Exempt Income: For reporting purpose and Income on which no tax is payable
r 167 : [F167] Sl.No.  |  [H167] Category  |  [T167] Sub-Category
r 171 : [F171] Total Exempt Income
r 172 : [E172] C3(a)  |  [F172] Long Term capital gains u/s 112A not chargeable to Income-tax
r 173 : [F173] i  |  [G173] Total sale consideration
r 174 : [F174] ii  |  [G174] Total cost of acquisition
r 175 : [F175] iii  |  [G175] Long term capital gains as per sec 112A
r 176 : [E176] D1  |  [F176] Tax Payable on Total Income
r 177 : [E177] D2  |  [F177] Rebate u/s 87A
r 178 : [E178] D3  |  [F178] Tax payable after Rebate
r 180 : [E180] D4  |  [F180] Health and Education Cess @4% on (D3)
r 181 : [E181] D5  |  [F181] Total Tax and Cess(D3+D4)
r 182 : [E182] D6  |  [F182] Relief u/s 89 (Please ensure to submit Form 10E to claim this relief)
r 183H: [E183] 13a  |  [F183] Relief u/s 89A
r 184 : [F184] Balance Tax after Relief (D5-D6)
r 185 : [E185] D7  |  [F185] Interest u/s 234 A
r 186 : [E186] D8  |  [F186] Interest u/s 234 B
r 187 : [E187] D9  |  [F187] Interest u/s 234 C
r 188 : [E188] D10  |  [F188] Fee u/s 234F
r 189 : [E189] D10a  |  [F189] Fee for furnishing revised return of income (section 234-I)
r 190 : [F190] Total Interest, Fee Payable (D7+D8+D9+D10+D10a)
r 191 : [E191] D11  |  [F191] Total Tax , Fee and Interest (D5+D7+D8+D9+D10+D10a-D6)
```

## Appendix · Every dropdown value, verbatim

**Cells `E22 E30:J30`** — source `StateList` — 39 values:
```
(Select) | 01-ANDAMAN AND NICOBAR ISLANDS | 02-ANDHRA PRADESH | 03-ARUNACHAL PRADESH | 04-ASSAM | 05-BIHAR | 06-CHANDIGARH | 07-DADRA NAGAR AND HAVELI | 08-DAMAN AND DIU | 09-DELHI | 10-GOA | 11-GUJARAT | 12-HARYANA | 13-HIMACHAL PRADESH | 14-JAMMU AND KASHMIR | 15-KARNATAKA | 16-KERALA | 17-LAKHSWADEEP | 18-MADHYA PRADESH | 19-MAHARASHTRA | 20-MANIPUR | 21-MEGHALAYA | 22-MIZORAM | 23-NAGALAND | 24-ODISHA | 25-PUDUCHERRY | 26-PUNJAB | 27-RAJASTHAN | 28-SIKKIM | 29-TAMILNADU | 30-TRIPURA | 31-UTTAR PRADESH | 32-WEST BENGAL | 33-CHHATTISGARH | 34-UTTARAKHAND | 35-JHARKHAND | 36-TELANGANA | 37-LADAKH | 99-FOREIGN
```

**Cells `AO77:AW77`** — source `"(Select),Self Occupied, Let Out,Deemed Let Out"` — 4 values:
```
(Select) | Self Occupied | Let Out | Deemed Let Out
```

**Cells `K142:X142`** — source `Selection80DB` — 4 values:
```
(Select) | 1-Self and Family ( senior citizen) | 2-Parents ( senior citizen) | 3-Self and Family including parents (senior citizen)
```

**Cells `K143:X143`** — source `Selection80DC` — 4 values:
```
(Select) | 1-Self and family | 2-Parent | 3-Self and family and Parents
```

**Cells `K141:X141`** — source `Selection80D` — 8 values:
```
(Select) | 1-Self and Family (Non Senior citizen) | 2-Self and Family (Including Senior citizen) | 3-Parents | 4-Parents(Senior citizen) | 5-Self and Family including parents | 6-Self and Family including senior citizen parents | 7-Self(Senior citizen) & family including senior citizen parents
```

**Cells `H168:S169`** — source `Nature_TP` — 9 values:
```
(Select) | Agricultural & related incomes | Compensation/other sums received by government or other approved entities | Income from specified Investments | Specified sums received by armed forces personnel | Sums received by Senior Citizens/Minors | Sums received by specified Category of Taxpayers | Sums received from policies/contributions such as LIC/NPS/PF/Sukanya Samriddhi Yojana | Other Incomes
```

**Cells `AN33:AW33 AD34:AM34 AD35:AL36 AN37:AW37 AD38:AL41 AN23:AW23 AN30:AS30 AN22:AS22`** — source `"(Select),Yes,No"` — 3 values:
```
(Select) | Yes | No
```

**Cells `Z87:Z90`** — source `PART_Nature_2` — 10 values:
```
(Select) | Interest from Savings Bank Account | Interest from Deposit (Bank/Post Office/Cooperative Society) | Interest from Income Tax Refund | Family pension | Interest accrued on contributions to provident fund to the extent taxable as per first proviso to section 10(11) | Interest accrued on contributions to provident fund to the extent taxable as per second proviso to section 10(11) | Interest accrued on contributions to provident fund to the extent taxable as per first proviso to section 10(12) | Interest accrued on contributions to provident fund to the extent taxable as per second proviso to section 10(12) | Any Other
```

**Cells `H146:J146`** — source `Selection80DDB` — 3 values:
```
(Select) | 1-Self or Dependent | 2-Self or Dependent- Senior Citizen
```

**Cells `K146:X146`** — source `Specified_Disease` — 15 values:
```
(Select) | (a) Dementia | (b) Dystonia Musculorum Deformans | (c) Motor Neuron Disease | (d) Ataxia | (e) Chorea | (f) Hemiballismus | (g) Aphasia | (h) Parkinsons Disease | (i) Malignant Cancers | (j) Full Blown Acquired Immuno-Deficiency Syndrome (AIDS) | (k) Chronic Renal failure | (l) Hematological disorders | (m) Hemophilia | (n) Thalassaemia
```

**Cells `AD42:AW42`** — source `"(Select), Yes, No"` — 3 values:
```
(Select) | Yes | No
```

**Cells `K30 K22`** — source `CountList` — 251 values:
```
(Select) | 93-AFGHANISTAN | 1001-ALAND ISLANDS | 355-ALBANIA | 213-ALGERIA | 684-AMERICAN SAMOA | 376-ANDORRA | 244-ANGOLA | 1264-ANGUILLA | 1010-ANTARCTICA | 1268-ANTIGUA AND BARBUDA | 54-ARGENTINA | 374-ARMENIA | 297-ARUBA | 61-AUSTRALIA | 43-AUSTRIA | 994-AZERBAIJAN | 1242-BAHAMAS | 973-BAHRAIN | 880-BANGLADESH | 1246-BARBADOS | 375-BELARUS | 32-BELGIUM | 501-BELIZE | 229-BENIN | 1441-BERMUDA | 975-BHUTAN | 591-BOLIVIA (PLURINATIONAL STATE OF) | 1002-BONAIRE, SINT EUSTATIUS AND SABA | 387-BOSNIA AND HERZEGOVINA | 267-BOTSWANA | 1003-BOUVET ISLAND | 55-BRAZIL | 1014-BRITISH INDIAN OCEAN TERRITORY | 673-BRUNEI DARUSSALAM | 359-BULGARIA | 226-BURKINA FASO | 257-BURUNDI | 238-CABO VERDE | 855-CAMBODIA | 237-CAMEROON | 1-CANADA | 1345-CAYMAN ISLANDS | 236-CENTRAL AFRICAN REPUBLIC | 235-CHAD | 56-CHILE | 86-CHINA | 9-CHRISTMAS ISLAND | 672-COCOS (KEELING) ISLANDS | 57-COLOMBIA | 270-COMOROS | 242-CONGO | 243-CONGO (DEMOCRATIC REPUBLIC OF THE) | 682-COOK ISLANDS | 506-COSTA RICA | 225-CÔTE D'IVOIRE | 385-CROATIA | 53-CUBA | 1015-CURAÇAO | 357-CYPRUS | 420-CZECHIA | 45-DENMARK | 253-DJIBOUTI | 1767-DOMINICA | 1809-DOMINICAN REPUBLIC | 593-ECUADOR | 20-EGYPT | 503-EL SALVADOR | 240-EQUATORIAL GUINEA | 291-ERITREA | 372-ESTONIA | 251-ETHIOPIA | 500-FALKLAND ISLANDS (MALVINAS) | 298-FAROE ISLANDS | 679-FIJI | 358-FINLAND | 33-FRANCE | 594-FRENCH GUIANA | 689-FRENCH POLYNESIA | 1004-FRENCH SOUTHERN TERRITORIES | 241-GABON | 220-GAMBIA | 995-GEORGIA | 49-GERMANY | 233-GHANA | 350-GIBRALTAR | 30-GREECE | 299-GREENLAND | 1473-GRENADA | 590-GUADELOUPE | 1671-GUAM | 502-GUATEMALA | 1481-GUERNSEY | 224-GUINEA | 245-GUINEA-BISSAU | 592-GUYANA | 509-HAITI | 1005-HEARD ISLAND AND MCDONALD ISLANDS | 6-HOLY SEE | 504-HONDURAS | 852-HONG KONG | 36-HUNGARY | 354-ICELAND | 91-INDIA | 62-INDONESIA | 98-IRAN (ISLAMIC REPUBLIC OF) | 964-IRAQ | 353-IRELAND | 1624-ISLE OF MAN | 972-ISRAEL | 5-ITALY | 1876-JAMAICA | 81-JAPAN | 1534-JERSEY | 962-JORDAN | 7-KAZAKHSTAN | 254-KENYA | 686-KIRIBATI | 850-KOREA (DEMOCRATIC PEOPLE'S REPUBLIC OF) | 82-KOREA (REPUBLIC OF) | 965-KUWAIT | 996-KYRGYZSTAN | 856-LAO PEOPLE'S DEMOCRATIC REPUBLIC | 371-LATVIA | 961-LEBANON | 266-LESOTHO | 231-LIBERIA | 218-LIBYA | 423-LIECHTENSTEIN | 370-LITHUANIA | 352-LUXEMBOURG | 853-MACAO | 389-MACEDONIA (THE FORMER YUGOSLAV REPUBLIC OF) | 261-MADAGASCAR | 265-MALAWI | 60-MALAYSIA | 960-MALDIVES | 223-MALI | 356-MALTA | 692-MARSHALL ISLANDS | 596-MARTINIQUE | 222-MAURITANIA | 230-MAURITIUS | 269-MAYOTTE | 52-MEXICO | 691-MICRONESIA (FEDERATED STATES OF) | 373-MOLDOVA (REPUBLIC OF) | 377-MONACO | 976-MONGOLIA | 382-MONTENEGRO | 1664-MONTSERRAT | 212-MOROCCO | 258-MOZAMBIQUE | 95-MYANMAR | 264-NAMIBIA | 674-NAURU | 977-NEPAL | 31-NETHERLANDS | 687-NEW CALEDONIA | 64-NEW ZEALAND | 505-NICARAGUA | 227-NIGER | 234-NIGERIA | 683-NIUE | 15-NORFOLK ISLAND | 1670-NORTHERN MARIANA ISLANDS | 47-NORWAY | 968-OMAN | 92-PAKISTAN | 680-PALAU | 970-PALESTINE, STATE OF | 507-PANAMA | 675-PAPUA NEW GUINEA | 595-PARAGUAY | 51-PERU | 63-PHILIPPINES | 1011-PITCAIRN | 48-POLAND | 14-PORTUGAL | 1787-PUERTO RICO | 974-QATAR | 262-RÉUNION | 40-ROMANIA | 8-RUSSIAN FEDERATION | 250-RWANDA | 1006-SAINT BARTHÉLEMY | 290-SAINT HELENA, ASCENSION AND TRISTAN DA CUNHA | 1869-SAINT KITTS AND NEVIS | 1758-SAINT LUCIA | 1007-SAINT MARTIN (FRENCH PART) | 508-SAINT PIERRE AND MIQUELON | 1784-SAINT VINCENT AND THE GRENADINES | 685-SAMOA | 378-SAN MARINO | 239-SAO TOME AND PRINCIPE | 966-SAUDI ARABIA | 221-SENEGAL | 381-SERBIA | 248-SEYCHELLES | 232-SIERRA LEONE | 65-SINGAPORE | 1721-SINT MAARTEN (DUTCH PART) | 421-SLOVAKIA | 386-SLOVENIA | 677-SOLOMON ISLANDS | 252-SOMALIA | 28-SOUTH AFRICA | 1008-SOUTH GEORGIA AND THE SOUTH SANDWICH ISLANDS | 211-SOUTH SUDAN | 35-SPAIN | 94-SRI LANKA | 249-SUDAN | 597-SURINAME | 1012-SVALBARD AND JAN MAYEN | 268-SWAZILAND | 46-SWEDEN | 41-SWITZERLAND | 963-SYRIAN ARAB REPUBLIC | 886-TAIWAN | 992-TAJIKISTAN | 255-TANZANIA, UNITED REPUBLIC OF | 66-THAILAND | 670-TIMOR-LESTE (EAST TIMOR) | 228-TOGO | 690-TOKELAU | 676-TONGA | 1868-TRINIDAD AND TOBAGO | 216-TUNISIA | 90-TURKEY | 993-TURKMENISTAN | 1649-TURKS AND CAICOS ISLANDS | 688-TUVALU | 256-UGANDA | 380-UKRAINE | 971-UNITED ARAB EMIRATES | 44-UNITED KINGDOM OF GREAT BRITAIN AND NORTHERN IRELAND | 2-UNITED STATES OF AMERICA | 1009-UNITED STATES MINOR OUTLYING ISLANDS | 598-URUGUAY | 998-UZBEKISTAN | 678-VANUATU | 58-VENEZUELA (BOLIVARIAN REPUBLIC OF) | 84-VIET NAM | 1284-VIRGIN ISLANDS (BRITISH) | 1340-VIRGIN ISLANDS (U.S.) | 681-WALLIS AND FUTUNA | 1013-WESTERN SAHARA | 967-YEMEN | 260-ZAMBIA | 263-ZIMBABWE | 9999-OTHERS
```

**Cells `Z11:AW11`** — source `EmpCatList` — 10 values:
```
(Select) | Central Government | State Government | Public Sector Undertaking | Pensioners - Central Government | Pensioners - State Government | Pensioners - Public sector undertaking | Pensioners - Others | Others | Not Applicable (eg. Family pension etc)
```

**Cells `AC47:AW47`** — source `ReturnSecList` — 6 values:
```
(Select) | 139(1)-On or before due date | 139(4)-Belated | 139(5)-Revised | 119(2)(b)- After condonation of delay | 139(8A)
```

**Cells `U168:AF169`** — source `Agri_dropdown` — 4 values:
```
(Select) | 10(1)-Agricultural income(Less than or equal to 5000) | 10(30)-subsidy received from or through the Tea Board | 10(31)-Rubber/Coffee/Tea development accounts/funds
```

**Cells `H118:X119`** — source `"(Select),PRAN,Other than PRAN"` — 3 values:
```
(Select) | PRAN | Other than PRAN
```

**Cells `T168 T169`** — source `Othe_dropdown` — 6 values:
```
(Select) | 10(2)-Member’s share from HUF | 10(16)-Scholarships for education | Income exempt as per CBDT Circular | Income exempt as per CBDT Notification | Receipts not in the nature of income
```

**Cells `J66:Y67`** — source `Dropdown_115BAC_Y` — 12 values:
```
(Select) | Sec 10(6)-Remuneration received as an official, by whatever name called, of an embassy, high commission etc. | Sec 10(7)-Allowances or perquisites paid or allowed as such outside India by the Government to a citizen of India for rendering service outside India | Sec 10(10)-Death-cum-retirement gratuity received | Sec 10(10A)-Commuted value of pension received | Sec 10(10AA)-Earned leave encashment on Retirement | Sec 10(10B) First proviso - Compensation limit notified by CG in the Official Gazette | Sec 10(10B) Second proviso - Compensation under scheme approved by the Central Government | Sec 10(10C)-Amount received/receivable on voluntary retirement or termination of service | Sec 10(10CC)-Tax paid by employer on non-monetary perquisite | Section 10(14)(i) - Allowances referred in sub-clauses (a) to (c) of sub-rule (1) in Rule 2BB | Section 10(14)(ii) -  Transport allowance granted to certain physically handicapped assessee
```

