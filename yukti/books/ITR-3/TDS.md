# The book of the TDS sheet — Schedules TDS 1 · TDS 2 · TDS 3 · TCS · ITR-3, A.Y. 2026-27

Read row by row from the utility's **TDS** sheet (90 rows, 16 hidden) with the
hidden-row flags, its formulas and its dropdowns, and confirmed against the
schema blocks `ScheduleTDS1`, `ScheduleTDS2`, `ScheduleTDS3` and `ScheduleTCS`.
Item lettering is taken from the sheet's own item column and from
`books/ITR-3/rules.json`; nothing here is carried over from ITR-2.

---

## The shape

Four **visible** tables, each repeatable and unlimited, each ending in a total
the schema requires even at zero. **TDS 1 (item 17B)** is tax deducted from
salary per Form 16. **TDS 2 (item 17C1)** is TDS on income other than salary
per Form 16A. **TDS 3 (item 18C2)** is TDS per Form 16B / 16C / 16D / 16E, where
the deductor is a buyer or tenant identified by PAN, not TAN. **Schedule TCS
(item 15C)** is tax collected at source per Form 27D. An older six-column TCS
table (item **17D**, rows 48–61) sits on the sheet **hidden** and is not built.
The salary total (col 5) and the two other-than-salary claimed totals (col 9)
feed **Sl. No. 10b of Part B-TTI**; the TCS claimed total (col 7i) feeds **Sl.
No. 10c of Part B-TTI**.

---

## The items

### TDS 1 — item 17B · Details of Tax Deducted at Source from SALARY [As per FORM 16 issued by Employer(s)]

`ScheduleTDS1.TDSonSalary[]` — one row per employer.

| Sheet col | Field label | Type | Schema key | Rule / notes |
|---|---|---|---|---|
| (1) | Sl. No. | computed | — | row number, `D9=D8+1` etc. |
| (2) | Tax Deduction Account Number (TAN) of the Employer | string | `TDSonSalary[].EmployerOrDeductorOrCollectDetl.TAN` | required |
| (3) | Name of Employer | string | `TDSonSalary[].EmployerOrDeductorOrCollectDetl.EmployerOrDeductorOrCollecterName` | required, max 125 |
| (4) | Income chargeable under Salaries | integer | `TDSonSalary[].IncChrgSal` | required; totalled at G13 |
| (5) | Total tax deducted | integer | `TDSonSalary[].TotalTDSSal` | required; totalled at H13 |
| Total | Total | computed | `TotalTDSonSalaries` | `G13=SUM(TDS1.IncChrgSal)`, `H13=SUM(TDS1.TotalTDSSal)` |

Note under the table: *"Note: Please enter total of column 5 in 10b of Part
B-TTI."*

### TDS 2 — item 17C1 · Details of Tax Deducted at Source (TDS) on Income [As per FORM 16A issued by Deductor(s)]

`ScheduleTDS2.TDSOthThanSalaryDtls[]` — one row per deductor per section.

| Sheet col | Field label | Type | Schema key | Rule / notes |
|---|---|---|---|---|
| Col 1 | Sl. No. | computed | — | `D24=D23+1` |
| Col 2 | TDS credit relating to Self/Other Person [Spouse as per section 5A / Other person as per Rule 37BA(2)] | string | `TDSOthThanSalaryDtls[].TDSCreditName` | required; enum **S, O**; dropdown shows (Select) / Self / Other Person |
| Col 3 | PAN Of Other Person (If TDS credit related to other person) | string | `TDSOthThanSalaryDtls[].PANofOtherPerson` | needed when col 2 = Other Person |
| Col 3 | Aadhaar No. Of Other Person (If TDS credit related to other person) | string | `TDSOthThanSalaryDtls[].AadhaarOfOtherPerson` | alternative to PAN |
| Col 4 | Tax Deduction Account Number (TAN) of the Deductor | string | `TDSOthThanSalaryDtls[].TANOfDeductor` | required |
| — | Section under which TDS is deducted | string | `TDSOthThanSalaryDtls[].TDSSection` | required; dropdown of 60 codes (see Dropdowns); schema enum stores the code (92A …) |
| Col 5 | Financial Year in which TDS is deducted | integer | `TDSOthThanSalaryDtls[].DeductedYr` | dropdown 2024-25 … 2008-09; enum 2008–2024 — for brought-forward credit |
| Col 6 | Unclaimed TDS brought forward (b/f) — TDS b/f | integer | `TDSOthThanSalaryDtls[].BroughtFwdTDSAmt` | credit from an earlier year |
| Col 7 | TDS of the current financial Year (TDS deducted during the FY 2025-26) — Deducted in own hands | integer | `TDSOthThanSalaryDtls[].TaxDeductCreditDtls.TaxDeductedOwnHands` | |
| Col 8 | Deducted in the hands of spouse as per section 5A or any other person as per rule 37BA(2) (if applicable) — Income | integer | `TDSOthThanSalaryDtls[].TaxDeductCreditDtls.TaxDeductedIncome` | |
| Col 8 | Deducted in the hands of spouse / other person — TDS | integer | `TDSOthThanSalaryDtls[].TaxDeductCreditDtls.TaxDeductedTDS` | |
| Col 9 | TDS credit being claimed this Year (only if corresponding income is being offered for tax this year) — Claimed In own hands | integer | `TDSOthThanSalaryDtls[].TaxDeductCreditDtls.TaxClaimedOwnHands` | required; totalled at P28 |
| Col 10 | Claimed in the hands of spouse as per section 5A or any other person as per rule 37BA(2) (if applicable) — Income | integer | `TDSOthThanSalaryDtls[].TaxDeductCreditDtls.TaxClaimedIncome` | |
| Col 10 | Claimed in the hands of spouse / other person — TDS | integer | `TDSOthThanSalaryDtls[].TaxDeductCreditDtls.TaxClaimedTDS` | |
| Col 10 | Claimed in the hands of spouse / other person — PAN | string | `TDSOthThanSalaryDtls[].TaxDeductCreditDtls.TaxClaimedSpouseOthPrsnPAN` | |
| Col 10 | Claimed in the hands of spouse / other person — Aadhaar | string | `TDSOthThanSalaryDtls[].TaxDeductCreditDtls.SpouseOthPrsnAadhaar` | |
| Col 11 | Corresponding Receipt/withdrawals offered — Gross Amount | integer | `TDSOthThanSalaryDtls[].GrossAmount` | |
| Col 12 | Head of Income (Col 12) | string | `TDSOthThanSalaryDtls[].HeadOfIncome` | enum **HP, BP, CG, OS, EI, NA**; dropdown pre-filled from the section |
| Col 13 | TDS Credit being carried forward | integer | `TDSOthThanSalaryDtls[].AmtCarriedFwd` | required; `W23=MAX(0,L23+O23+M23-P23-R23)` |
| Total | Total | computed | `TotalTDSonOthThanSals` | `P28=SUM(TDS2.ClaimedInOwnHands)` |

Note under the table: *"Note: Please enter total column 9 of above in 10b of
Part B-TTI."*

### TDS 3 — item 18C2 · Details of Tax Deducted at Source (TDS) on Income [As per Form 16B/16C/16D/16E furnished issued by Deductor(s)]

`ScheduleTDS3.TDS3onOthThanSalDtls[]` — the buyer / tenant / deductor is
identified by **PAN**, not TAN.

| Sheet col | Field label | Type | Schema key | Rule / notes |
|---|---|---|---|---|
| Col 1 | Sl. No. | computed | — | `D39=D38+1` |
| Col 2 | TDS credit relating to Self/Other Person [Spouse as per section 5A / Other person as per Rule 37BA(2)] | string | `TDS3onOthThanSalDtls[].TDSCreditName` | required; enum S, O |
| Col 3 | PAN Of Other Person (If TDS Credit related to other person) | string | `TDS3onOthThanSalDtls[].PANofOtherPerson` | when col 2 = Other Person |
| Col 3 | Aadhaar of other Person | string | `TDS3onOthThanSalDtls[].AadhaarOfOtherPerson` | alternative to PAN |
| Col 4 | PAN of the buyer/ Tenant/ Deductor | string | `TDS3onOthThanSalDtls[].PANOfBuyerTenant` | required — replaces the TAN |
| Col 4 | Aadhaar of the buyer/ Tenant/ Deductor | string | `TDS3onOthThanSalDtls[].AadhaarOfBuyerTenant` | alternative |
| — | Section under which TDS is deducted | string | `TDS3onOthThanSalDtls[].TDSSection` | required; same 60-code dropdown |
| Col 5 | Financial Year in which TDS is deducted | integer | `TDS3onOthThanSalDtls[].DeductedYr` | dropdown 2024-25 … 2008-09 |
| Col 6 | Unclaimed TDS brought forward (b/f) — TDS b/f | integer | `TDS3onOthThanSalDtls[].BroughtFwdTDSAmt` | |
| Col 7 | TDS of the current financial Year (TDS deducted during the FY 2025-26) — Deducted in own hands | integer | `TDS3onOthThanSalDtls[].TaxDeductCreditDtls.TaxDeductedOwnHands` | |
| Col 8 | Deducted in the hands of spouse as per section 5A or any other person as per rule 37BA(2) (if applicable) — Income | integer | `TDS3onOthThanSalDtls[].TaxDeductCreditDtls.TaxDeductedIncome` | |
| Col 8 | Deducted in the hands of spouse / other person — TDS | integer | `TDS3onOthThanSalDtls[].TaxDeductCreditDtls.TaxDeductedTDS` | |
| Col 9 | TDS credit being claimed this Year (only if corresponding income is being offered for tax this year) — Claimed in own hands | integer | `TDS3onOthThanSalDtls[].TaxDeductCreditDtls.TaxClaimedOwnHands` | required; totalled at Q43 |
| Col 10 | Claimed in the hands of spouse as per section 5A or any other person as per rule 37BA(2) (if applicable) — Income | integer | `TDS3onOthThanSalDtls[].TaxDeductCreditDtls.TaxClaimedIncome` | |
| Col 10 | Claimed in the hands of spouse / other person — TDS | integer | `TDS3onOthThanSalDtls[].TaxDeductCreditDtls.TaxClaimedTDS` | |
| Col 10 | Claimed in the hands of spouse / other person — PAN | string | `TDS3onOthThanSalDtls[].TaxDeductCreditDtls.TaxClaimedSpouseOthPrsnPAN` | |
| Col 10 | Claimed in the hands of spouse / other person — Aadhaar | string | `TDS3onOthThanSalDtls[].TaxDeductCreditDtls.SpouseOthPrsnAadhaar` | |
| Col 11 | Corresponding Receipt offered — Gross Amount | integer | `TDS3onOthThanSalDtls[].GrossAmount` | |
| Col 12 | Head of Income (Col 12) | string | `TDS3onOthThanSalDtls[].HeadOfIncome` | enum HP, BP, CG, OS, EI (no NA); dropdown of 6 values |
| Col 13 | TDS Credit being carried forward | integer | `TDS3onOthThanSalDtls[].AmtCarriedFwd` | required; `X38=MAX(0,M38+N38+P38-Q38-S38)` |
| Total | Total | computed | `TotalTDS3OnOthThanSal` | `Q43=SUM(TDS3.ClaimedInOwnHands)` |

Note under the table: *"Note: Please enter total column 9 of above in 10b of
Part B-TTI."*

### Schedule TCS — item 15C · Details of Tax Collected at Source (TCS) [As per Form 27D issued by the Collector(s)]

`ScheduleTCS.TCS[]` — one row per collector.

| Sheet col | Field label | Type | Schema key | Rule / notes |
|---|---|---|---|---|
| Col 1 | Sl No | computed | — | `D68=D67+1` |
| Col 2i | TCS credit relating to self /other person [spouse as per section 5A / other person as per rule 37-I(1)] | string | `TCS[].TCSCreditOwner` | required; enum **1, 2**; dropdown shows (Select) / Self / Other Person |
| Col 2ii | Tax Deduction and Tax Collection Account Number of the Collector | string | `TCS[].EmployerOrDeductorOrCollectTAN` | required, max 10 |
| Col 3 | PAN of Other person (if TCS credit related to other person) | string | `TCS[].PANOfSpouseOrOthrPrsn` | when col 2i = Other Person |
| Col 4 | Financial year in which TCS is collected | integer | `TCS[].DeductedYr` | dropdown 2024 … 2008; enum 2008–2024 |
| Col 5 | Unclaimed TCS brought forward (b/f) — Amount b/f (Col 5) | integer | `TCS[].BroughtFwdTDSAmt` | |
| Col 6i | TCS of the current financial Year (TCS collected during the FY 2025-26) — Collected in own hands | integer | `TCS[].TCSCurrFYDtls.TCSAmtCollOwnHand` | |
| Col 6ii | Collected in the hands of spouse as per section 5A or any other person as per rule 37i(1) (if applicable) | integer | `TCS[].TCSCurrFYDtls.TCSAmtCollSpouseOrOthrHand` | |
| Col 7i | TCS credit being claimed this year — Claimed in own hands | integer | `TCS[].TCSClaimedThisYearDtls.TCSAmtCollOwnHand` | totalled at L73 |
| Col 7(ii)(a) | Claimed in the hands of spouse as per section 5A or any other person as per rule 37i(1) (if applicable) — TCS | integer | `TCS[].TCSClaimedThisYearDtls.TCSAmtCollOthrHands.TCSAmtCollSpouseOrOthrHand` | |
| Col 7(ii)(b) | — PAN | string | `TCS[].TCSClaimedThisYearDtls.TCSAmtCollOthrHands.PANOfSpouseOrOthrPrsn` | |
| Col 8 | TCS credit being credit forward | integer | `TCS[].AmtCarriedFwd` | required; `O67=MAX(0,(I67+J67+K67-L67-M67))` |
| Total | Total | computed | `TotalSchTCS` | `L73=SUM(TCS1.ClaimedOwnHands)` |

Note under the table: *"Note: Please enter total of column (7i) of Schedule-TCS
in 10c of Part B-TTI."*

---

## The rules the sheet computes

- **TDS 1 salary totals** — `G13=SUM(TDS1.IncChrgSal)`, `H13=SUM(TDS1.TotalTDSSal)` → `TotalTDSonSalaries`. Feeds 10b of Part B-TTI.
- **TDS 2 carry-forward per row** — `W23=MAX(0,L23+O23+M23-P23-R23)` (b/f + deducted own + deducted-other-TDS − claimed own − claimed-other-TDS, floored at 0), rows 23–26.
- **TDS 2 claimed total** — `P28=SUM(TDS2.ClaimedInOwnHands)` → `TotalTDSonOthThanSals`; column 9 feeds 10b of Part B-TTI.
- **TDS 3 carry-forward per row** — `X38=MAX(0,M38+N38+P38-Q38-S38)`, rows 38–41.
- **TDS 3 claimed total** — `Q43=SUM(TDS3.ClaimedInOwnHands)` → `TotalTDS3OnOthThanSal`; column 9 feeds 10b of Part B-TTI.
- **Schedule TCS carry-forward per row** — `O67=MAX(0,(I67+J67+K67-L67-M67))`, rows 67–71.
- **Schedule TCS claimed total** — `L73=SUM(TCS1.ClaimedOwnHands)` → `TotalSchTCS`; column 7i feeds 10c of Part B-TTI.
- **Hidden TCS (17D) carry-forward** — `K52=MAX(0,H52+I52-J52)`, `J58=SUM(TCS.AmtTCSClaimedThisYear)` — on hidden rows, not built.
- **Cross-schedule (rules.json)** — 10b of Part B-TTI = sum of column 5 of TDS 1, column 9 of Schedule TDS 2 and Schedule TDS 3; 10c = sum of column 7(i) of Schedule TCS.
- **Validation (rules.json)** — In Schedule TDS2 and TDS3, if TDS b/f is claimed then the year of tax deduction must be provided.

---

## Dropdowns

**TDS credit relating to** — `E23:E26` (TDS 2), `E38:E41` (TDS 3), `E67:E71` (TCS):
(Select), Self, Other Person. *(Schema stores S/O for TDS 2 & 3, and 1/2 for TCS.)*

**Financial Year in which TDS is deducted** — `K23:K26` (TDS 2), `L38:L41` (TDS 3):
(Select), 2024-25, 2023-24, 2022-23, 2021-22, 2020-21, 2019-20, 2018-19, 2017-18,
2016-17, 2015-16, 2014-15, 2013-14, 2012-13, 2011-12, 2010-11, 2009-10, 2008-09.

**Financial year in which TCS is collected** — `H67:H71` (Schedule TCS):
(Select), 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013,
2012, 2011, 2010, 2009, 2008. *(The hidden 17D year list `G52:G56` is a subset:
(Select), 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010, 2009,
2008.)*

**Head of Income — TDS 2** (`V23:V26`), enum HP, BP, CG, OS, EI, NA:

- (Select)
- Income from House Property
- Income from Business & Profession
- Income from Capital Gains
- Income from Other Sources
- Exempt Income
- Not applicable ( only in case TDS is deducted u/s 194N)

**Head of Income — TDS 3** (`W38:W41`), enum HP, BP, CG, OS, EI (no NA):

- (Select)
- Income from House Property
- Income from Business & Profession
- Income from Capital Gains
- Income from Other Sources
- Exempt Income

**Section under which TDS is deducted** — `I23:J26` (TDS 2), `J38:K41` (TDS 3),
list `TDS_Section_List_1`, 60 codes plus (Select):

- (Select)
- 192-Salary-Payment to Government employees other than Indian Government employees
- 192-Salary-Payment to employees other than Government employees
- 192-Salary-Payment to Indian Government employees
- 192A-TDS on PF withdrawal
- 193-Interest on Securities
- 194-Dividends
- 194A-Interest other than 'Interest on securities'
- 194B-Winning from lottery or crossword puzzle
- 194BA-Winnings from online games
- 194BB-Winning from horse race
- 194C-Payments to contractors and sub-contractors
- 194D-Insurance commission
- 194DA-Payment in respect of life insurance policy
- 194E-Payments to non-resident sportsmen or sports associations
- 194EE-Payments in respect of deposits under National Savings
- 194F-Payments on account of repurchase of units by Mutual Fund or Unit Trust of India
- 194G-Commission, price, etc. on sale of lottery tickets
- 194H-Commission or brokerage
- 194I(a)-Rent on hiring of plant and machinery
- 194I(b)-Rent on other than plant and machinery
- 194IA-TDS on Sale of immovable property
- 194IB-Payment of rent by certain individuals or Hindu undivided
- 194IC-Payment under specified agreement
- 194J(a)-Fees for technical services
- 194J(b)-Fees for professional  services or royalty etc
- 194K-Income payable to a resident assessee in respect of units of a specified mutual fund or of the units of the Unit Trust of India
- 194LA-Payment of compensation on acquisition of certain immovable
- 194LB-Income by way of Interest from Infrastructure Debt fund
- 194LC-194LC (2)(i) and (ia) Income under clause (i) and (ia) of sub-section (2) of section 194LC
- 194LC-194LC (2)(ib) Income under clause (ib) of sub-section (2) of section 194LC
- 194LC-194LC (2)(ic) Income under clause (ic) of sub-section (2) of section 194LC
- 194LBA(a)-Certain income in the form of interest from units of a business trust to a resident unit holder
- 194LBA(b)-Certain income in the form of dividend from units of a business trust to a resident unit holder
- 194LBA(a)-194LBA(a) income referred to in section 10(23FC)(a) from units of a business trust-NR
- 194LBA(b)-194LBA(b) Income referred to in section 10(23FC)(b) from units of a business trust-NR
- 194LBA(c)-194LBA(c) Income referred to in section 10(23FCA) from units of a business trust-NR
- 194LBB-Income in respect of units of investment fund
- 194R-Benefits or perquisites of business or profession
- 194S-Payment of consideration for transfer of virtual digital asset by persons other than specified persons
- Proviso to section 194B-Winnings from lotteries and crossword puzzles where consideration is made in kind or cash is not sufficient to meet the tax liability and tax has been paid before such winnings are released
- First Proviso to sub-section(1) of section 194R-Benefits or perquisites of business or profession where such benefit is provided in kind or where part in cash is not sufficient to meet tax liability and tax required to be deducted is paid before such benefit is released
- Proviso to sub- section(1) of section 194S-Payment for transfer of virtual digital asset where payment is in kind or in exchange of another virtual digital asset and tax required to be deducted is paid before such payment is released
- 194LBC-Income in respect of investment in securitization trust
- 194LD-TDS on interest on bonds / government securities
- 194M-Payment of certain sums by certain individuals or HUF
- 194N-Payment of certain amounts in cash other than cases covered by first proviso or third proviso
- 194N -First Proviso Payment of certain amounts in cash to non-filers except in case of co-operativesocieties
- 194N -Third Proviso Payment of certain amounts in cash to co-operative societies not covered by first proviso
- 194N-First Proviso read with Third Proviso Payment of certain amount in cash to non-filers being co-operative societies
- 194O-Payment of certain sums by e-commerce operator to e-commerce participant.
- 194P-Deduction of tax in case of specified senior citizen
- 194Q-Deduction of tax at source on payment of certain sum for purchase of goods
- 194T-Payments to partners of firms
- 195-Other sums payable to a non-resident
- 196A-Income in respect of units of non-residents
- 196B-Payments in respect of units to an offshore fund
- 196C-Income from foreign currency bonds or shares of Indian
- 196D-Income of foreign institutional investors from securities
- 196D(1A)-Income of specified fund from securities
- 194BA(2)-Sub-section (2) of section 194BA Net Winnings from online games where the net winnings are made in kind or cash is not sufficient to meet the tax liability and tax has been paid before such net winnings are released

*(Schema `TDSSection` enum[60] stores the short codes: 92A, 92B, 92C, 192A, 193,
194, 94A, 94B, 94BA, 4BB, 94C, 94D … through the 196/194 series.)*

---

## What repeats and what is one figure

Every table is an unlimited repeating array — `TDSonSalary[]`,
`TDSOthThanSalaryDtls[]`, `TDS3onOthThanSalDtls[]`, `TCS[]`. Each table's total
(`TotalTDSonSalaries`, `TotalTDSonOthThanSals`, `TotalTDS3OnOthThanSal`,
`TotalSchTCS`) is a single computed figure. Nothing else on the sheet is a
single figure.

---

## Mandatory (schema `required` keys)

- **ScheduleTDS1**: `TotalTDSonSalaries`; per row `TAN`,
  `EmployerOrDeductorOrCollecterName`, `IncChrgSal`, `TotalTDSSal`.
- **ScheduleTDS2**: `TotalTDSonOthThanSals`; per row `TDSCreditName`,
  `TANOfDeductor`, `TDSSection`, `TaxDeductCreditDtls` (with `TaxClaimedOwnHands`),
  `AmtCarriedFwd`.
- **ScheduleTDS3**: `TotalTDS3OnOthThanSal`; per row `TDSCreditName`,
  `PANOfBuyerTenant`, `TDSSection`, `TaxClaimedOwnHands`, `AmtCarriedFwd`.
- **ScheduleTCS**: `TotalSchTCS`; per row `TCSCreditOwner`,
  `EmployerOrDeductorOrCollectTAN`, `AmtCarriedFwd`.
- Plus, by the validation rule, the PAN/Aadhaar of the other person whenever the
  credit relates to Other Person, and the year of deduction whenever TDS b/f is
  claimed.

---

## Hidden rows — not built

The whole **17D TCS block, rows 48–61 (flagged `H`)**, is a superseded
six-column Tax Collected at Source table — *"Details of Tax Collected at Source
(TCS) [As per Form 27D issued by the Collector(s)]"* with columns SI. No.; Tax
Deduction and Tax Collection Account Number of the collector; Name of the
Collector; Unclaimed TCS brought forward (b/f); Fin. Year in which collected;
Amount b/f; TCS of the current Fin. Year; Amount out of (5) or (6) being claimed
this Year; Amount out of (5) or (6) being carried forward; its total; and the
note *"Please enter total of column (7) of TCS in 10c of Part B-TTI."* It carries
formulas `K52=MAX(0,H52+I52-J52)` and `J58=SUM(TCS.AmtTCSClaimedThisYear)` and a
year dropdown (2020 … 2008). It is **hidden and superseded by the live Schedule
TCS (item 15C, rows 63–75)**, which has the fuller self/other, brought-forward
and carry-forward columns and the modern schema block `ScheduleTCS`. Do not build
17D; there is no schema block for it, and the live Schedule TCS feeds 10c
instead.

---

## What this means for the build

1. **Four visible tables, one hidden.** Build TDS 1 (17B), TDS 2 (17C1), TDS 3
   (18C2) and Schedule TCS (15C). Do not build the hidden 17D table.
2. **TDS 2 and TDS 3 are thirteen-column credit tables** — self/other with the
   other person's PAN and Aadhaar, the financial year and brought-forward amount,
   deducted-in-own-hands and deducted-in-other's-hands (income + TDS),
   claimed-in-own-hands and claimed-in-other's-hands (income + TDS + PAN +
   Aadhaar), gross amount, head of income, carried forward. TDS 3 differs only in
   that col 4 is the **PAN of the buyer/tenant/deductor** (with Aadhaar) instead
   of a TAN, and its head-of-income dropdown drops the "Not applicable (194N)"
   option.
3. **Row arithmetic is live**: carried forward = MAX(0, b/f + deducted − claimed)
   per the `W`/`X`/`O` formulas; the other-person columns open only when credit
   relates to Other Person; head of income pre-fills from the section and stays
   editable.
4. **Schedule TCS uses codes 1/2**, not S/O, for `TCSCreditOwner`, and its year
   dropdown is bare years 2024 … 2008.
5. **Five totals feed Part B-TTI** — TDS 1 col 5, TDS 2 col 9 and TDS 3 col 9 all
   into 10b; Schedule TCS col 7i into 10c. Every total must be present even at
   zero.
6. **Export** — every row to its schema object under the right block; enforce the
   validation that year of deduction is provided whenever TDS b/f is claimed.


## Additional visible rows — verbatim from the sheet (completeness)
Rows present on the utility sheet and captured here verbatim so every visible label is in the book:

- Section under which TDS is deducted
- Head of Income (Col 12)
- Schedule TCS
- Amount b/f (Col 5)
