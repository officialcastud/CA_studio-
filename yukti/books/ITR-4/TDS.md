# The book of the TDS sheet — Schedules TDS 1 · TDS 2(i) · TDS 2(ii) · ITR-4, A.Y. 2026-27

Read row by row from the utility's **TDS** sheet (61 rows, with rows 15–25 and
51–61 hidden), with the hidden-row flags, its formulas and its dropdowns, and
confirmed against the schema blocks `TDSonSalaries`, `TDSonOthThanSals` and
`ScheduleTDS3Dtls`. Item lettering is taken from the sheet's own item column
("Sch TDS1", "Sch TDS2(i)", "Sch TDS2(ii)") and from `books/ITR-4/rules.json`;
nothing here is carried over from ITR-3 (which is used for style only). Note the
ITR-4 specifics: there is **no Schedule TCS block on this sheet**, no Capital
Gains head of income (business income is presumptive u/s 44AD/44ADA/44AE), and
two legacy 26AS/26QC-style credit tables sit hidden.

---

## The shape

Three **visible** tables, each repeatable and each ending in a total the schema
requires even at zero. **TDS 1 (Sch TDS1)** is tax deducted from salary per
Form 16 issued by the Employer(s). **TDS 2(i) (Sch TDS2(i))** is TDS on income
other than salary per Form 16A issued by the Deductor(s). **TDS 2(ii) (Sch
TDS2(ii))** is TDS per Form 16C / 16D furnished by the Payer(s), where the
deductor is a tenant/deductor identified by **PAN and Aadhaar**, not a TAN. Two
older credit tables — a 26AS-style "Sch TDS2(i)" (rows 15–25) and a 26QC-style
"Sch TDS2(ii)" (rows 51–61) — sit on the sheet **hidden** and are not built. The
salary tax-deducted total (col 4) and the two other-than-salary claimed totals
(col 6) feed **Sl. No. D15 of the schedule / 10b of Part B-TTI**.

---

## The items

### TDS 1 — Sch TDS1 · Details of Tax Deducted at Source from SALARY [As per FORM 16 issued by Employer(s)]

`TDSonSalaries.TDSonSalary[]` — one row per employer.

| Sheet col | Field label | Type | Schema key | Rule / notes |
|---|---|---|---|---|
| (1) | Sl.No. | computed | — | row number, `D7=D6+1`, `D8=D7+1` … |
| (2) | Tax Deduction Account Number (TAN) | string | `TDSonSalary[].EmployerOrDeductorOrCollectDetl.TAN` | required |
| (3) | Name of the Employer | string | `TDSonSalary[].EmployerOrDeductorOrCollectDetl.EmployerOrDeductorOrCollecterName` | required, max 125 |
| (4) | Income under Salary | integer | `TDSonSalary[].IncChrgSal` | required; min 0; `S4=SUM(TDSal.IncChrgSal)` |
| (4) | Tax Deducted | integer | `TDSonSalary[].TotalTDSSal` | required; min 0; totalled at H11 |
| TOTAL | TOTAL | computed | `TotalTDSonSalaries` | `H11=SUM(TDSal.TotalTDSSal)` |

Note under the table: *"Enter the total of column 4 of Schedule-TDS1 and column
6 of Schedule-TDS2(i) and TDS 2(ii) in D15."*

### TDS 2(i) — Sch TDS2(i) · Schedule TDS2(i) Details of Tax Deducted at Source on Income Other than Salary [As per Form 16 A issued by Deductor(s)]

`TDSonOthThanSals.TDSonOthThanSalDtls[]` — one row per deductor per section.

| Sheet col | Field label | Type | Schema key | Rule / notes |
|---|---|---|---|---|
| Col 1 | Sl.No. (Col 1) | computed | — | `D31=D30+1`, `D32=D31+1` … |
| Col 2 | Tax Deduction Account Number (TAN) of the Deductor (Col 2) | string | `TDSonOthThanSalDtls[].TANOfDeductor` | required; TAN pattern |
| Col 2a | Section under which TDS deducted (Col 2a) | string | `TDSonOthThanSalDtls[].TDSSection` | required; dropdown of 60 codes (see Dropdowns); schema enum stores the short code (92A …) |
| Col 3 | Unclaimed TDS brought forward (b/f) — Fin. Year in which TDS is deducted (Col 3) | string | `TDSonOthThanSalDtls[].DeductedYr` | dropdown 2024-25 … 2008-09; enum 2024 … 2008; required when b/f is claimed |
| Col 4 | Unclaimed TDS brought forward (b/f) — TDS b/f (Col 4) | integer | `TDSonOthThanSalDtls[].BroughtFwdTDSAmt` | min 0; credit from an earlier year |
| Col 5 | TDS of the current Fin. Year (TDS deducted during the FY 2025-26) — TDS Deducted (Col 5) | integer | `TDSonOthThanSalDtls[].TDSDeducted` | min 0 |
| Col 6 | TDS credit being claimed this Year (only if corresponding receipt is being offered for tax this year) — TDS Claimed (Col 6) | integer | `TDSonOthThanSalDtls[].TDSClaimed` | required; totalled at J35; `J35=SUM(TDsOthr.tdsclaimed)` |
| Col 7 | Corresponding Receipt /Withdrawals offered — Gross Amount (Col 7) | integer | `TDSonOthThanSalDtls[].GrossAmount` | min 0; mandatory when col 6 is claimed |
| Col 8 | Head of Income (Col 8) | string | `TDSonOthThanSalDtls[].HeadOfIncome` | enum **BP, HP, OS, EI, NA**; dropdown of 6 values |
| Col 9 | TDS credit being carried forward (Col 9) | integer | `TDSonOthThanSalDtls[].TDSCreditCarriedFwd` | required; `M30=MAX(0,H30+I30-J30)` |
| TOTAL | TOTAL | computed | `TotalTDSonOthThanSals` | `J35=SUM(TDsOthr.tdsclaimed)` |

Note under the table: *"Enter the total of column 6 of Schedule TDS2(i) and
TDS2(ii) and column 4 of Schedule-TDS1 in D15."*

### TDS 2(ii) — Sch TDS2(ii) · Sch TDS 2(ii) Details of Tax Deducted at Source [As per Form 16C / 16D furnished by Payer(s)]

`ScheduleTDS3Dtls.TDS3Details[]` — the tenant / deductor is identified by **PAN
and Aadhaar**, not a TAN.

| Sheet col | Field label | Type | Schema key | Rule / notes |
|---|---|---|---|---|
| Col 1 | Sl.No. (Col 1) | computed | — | `D43=D42+1`, `D44=D43+1` … |
| Col 2 | PAN of the Tenant / Deductor. (Col 2) | string | `TDS3Details[].PANofTenant` | required; PAN pattern `[A-Z]{5}[0-9]{4}[A-Z]` |
| Col 2 | Aadhaar No of the tenant / Deductor. | string | `TDS3Details[].AadhaarofTenant` | 12-digit pattern; alternative identifier |
| Col 2a | Section under which TDS deducted (Col 2a) | string | `TDS3Details[].TDSSection` | required; same 60-code dropdown |
| Col 3 | Unclaimed TDS brought forward (b/f) — Fin. Year in which deducted (Col 3) | string | `TDS3Details[].DeductedYr` | dropdown 2024-25 … 2017-18; enum 2024 … 2017; required when b/f is claimed |
| Col 4 | Unclaimed TDS brought forward (b/f) — TDS b/f (Col 4) | integer | `TDS3Details[].BroughtFwdTDSAmt` | min 0 |
| Col 5 | TDS of the current Fin. Year — TDS Deducted (Col 5) | integer | `TDS3Details[].TDSDeducted` | min 0 |
| Col 6 | TDS credit being claimed this Year (only if corresponding receipt is being offered for tax this year) — TDS Claimed (Col 6) | integer | `TDS3Details[].TDSClaimed` | required; totalled at K47; `K47=SUM(TDsOthr2.tdsclaimed)` |
| Col 7 | Corresponding Receipt offered — Gross Amount (Col 7) | integer | `TDS3Details[].GrossAmount` | min 0 |
| Col 8 | Head of Income (Col 8) | string | `TDS3Details[].HeadOfIncome` | enum **HP, BP, OS, EI** (no NA); dropdown of 5 values |
| Col 9 | TDS credit being carried forward (Col 9) | integer | `TDS3Details[].TDSCreditCarriedFwd` | required; `N42=MAX(0,I42+J42-K42)` |
| TOTAL | TOTAL | computed | `TotalTDS3Details` | `K47=SUM(TDsOthr2.tdsclaimed)` |

Note under the table: *"Enter the total of column 6 of Schedule TDS2(i) and
TDS2(ii) and column 4 of Schedule-TDS1 in D15."*

---

## The rules the sheet computes

- **Sl. No. auto-increment** — `D7=D6+1` (TDS 1); `D31=D30+1` … `D34=D33+1` (TDS 2(i)); `D43=D42+1` … `D46=D45+1` (TDS 2(ii)).
- **TDS 1 income total** — `S4=SUM(TDSal.IncChrgSal)` (sum of col 3, Income under Salary).
- **TDS 1 tax-deducted total** — `H11=SUM(TDSal.TotalTDSSal)` → `TotalTDSonSalaries`; col 4 feeds D15 / 10b.
- **TDS 2(i) carry-forward per row** — `M30=MAX(0,H30+I30-J30)` (b/f + deducted − claimed, floored at 0), rows 30–34.
- **TDS 2(i) claimed total** — `J35=SUM(TDsOthr.tdsclaimed)` → `TotalTDSonOthThanSals`; col 6 feeds D15 / 10b.
- **TDS 2(ii) carry-forward per row** — `N42=MAX(0,I42+J42-K42)`, rows 42–46.
- **TDS 2(ii) claimed total** — `K47=SUM(TDsOthr2.tdsclaimed)` → `TotalTDS3Details`; col 6 feeds D15 / 10b.
- **Cross-schedule note (rows 13/37/49)** — D15 = total of column 4 of Schedule-TDS1 + column 6 of Schedule-TDS2(i) + column 6 of Schedule-TDS2(ii).
- **Validation (rules.json line 570)** — in Schedule TDS(2), year of tax deduction cannot be '0'/null if there is a claim of brought-forward TDS.
- **Validation (rules.json lines 605–610)** — if TDS is claimed in column 6, the Corresponding Receipt "Gross Amount (Col 7)" and "Head of Income (Col 8)" must be filled (for both TDS2(i) and TDS2(ii)).
- **Validation (rules.json line 580/585)** — claim of TDS in Sr. No. 6 cannot be more than income disclosed in Sr. No. 7; amount claimed cannot exceed tax deducted.
- **Validation (rules.json line 1550)** — section 192 (salary) cannot be selected in TDS2(i)/2(ii), which are for TDS on income other than salary.
- **Presumptive limit (rules.json line 2067)** — for presumptive income under 44AD, 44ADA & 44AE, TDS deducted in Schedule TDS1 cannot be more than the presumptive value.

---

## Dropdowns

**Head of Income — TDS 2(i)** (`N30:N34`), schema enum BP, HP, OS, EI, NA:

- (Select)
- Income from Business &amp; Profession
- Income from House Property
- Income from Other Source
- Exempt Income
- Not applicable (only in case TDS is deducted u/s 194N)

**Head of Income — TDS 2(ii)** (`M42:M46`), schema enum HP, BP, OS, EI (no NA):

- (Select)
- Income from House property
- Income from other sources
- Exempt Income
- Income from Business &amp; Profession

**Financial Year in which TDS is deducted — TDS 2(i)** (`G30:G34`):
(Select), 2024-25, 2023-24, 2022-23, 2021-22, 2020-21, 2019-20, 2018-19, 2017-18,
2016-17, 2015-16, 2014-15, 2013-14, 2012-13, 2011-12, 2010-11, 2009-10, 2008-09.

**Financial Year in which deducted — TDS 2(ii)** (`H42:H46`):
(Select), 2024-25, 2023-24, 2022-23, 2021-22, 2020-21, 2019-20, 2018-19, 2017-18.

**Section under which TDS deducted** — TDS 2(i) `F30:F34` and TDS 2(ii)
`G42:G46`, list `TDS_sectionslist`, 60 codes plus (Select). The schema
`TDSSection` enum[59] stores the short codes (92A, 92B, 92C, 192A, 193, 194,
94A, 94B, 94BA, 4BB, 94C, 94D, 4DA, 94E, 4EE, 4F, 4G, 4H, 4-IA, 4-IB, 4IA, 4IB,
4IC, 94J-A, 94J-B, 94K, 4LA, 4LB, 4LC1, 4LC2, 4LC3, 4BA1, 4BA2, LBA1, LBA2,
LBA3, LBB, 94R, 94S, 94B-P, 94R-P, 94S-P, LBC, 4LD, 94M, 94N, 94N-F, 94N-C,
94N-FT, 94O, 94P, 94Q, 195, 96A, 96B, 96C, 96D, 96DA, 94BA-P). The dropdown text:

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
- 194N-First Proviso Payment of certain amounts in cash to non-filers except in case of co-operativesocieties
- 194N-Third Proviso Payment of certain amounts in cash to co-operative societies not covered by first proviso
- 194N-First Proviso read with Third Proviso Payment of certain amount in cash to non-filers being co-operative societies
- 194O-Payment of certain sums by e-commerce operator to e-commerce participant.
- 194P-Deduction of tax in case of specified senior citizen
- 194Q-Deduction of tax at source on payment of certain sum for purchase of goods
- 195-Other sums payable to a non-resident
- 196A-Income in respect of units of non-residents
- 196B-Payments in respect of units to an offshore fund
- 196C-Income from foreign currency bonds or shares of Indian
- 196D-Income of foreign institutional investors from securities
- 196D(1A)-Income of specified fund from securities
- 194BA(2)-Sub-section (2) of section 194BA Net Winnings from online games where the net winnings are made in kind or cash is not sufficient to meet the tax liability and tax has been paid before such net winnings are released

---

## What repeats and what is one figure

Every visible table is a repeating array — `TDSonSalary[]` (TDS 1),
`TDSonOthThanSalDtls[]` (TDS 2(i)), `TDS3Details[]` (TDS 2(ii)). Each table's
total (`TotalTDSonSalaries`, `TotalTDSonOthThanSals`, `TotalTDS3Details`) is a
single computed figure. Nothing else on the sheet is a single figure.

---

## Mandatory (schema `required` keys)

- **TDSonSalaries**: `TotalTDSonSalaries`; per row `TAN`,
  `EmployerOrDeductorOrCollecterName`, `IncChrgSal`, `TotalTDSSal`
  (all four leaves marked required in the item).
- **TDSonOthThanSals**: `TotalTDSonOthThanSals`; per row `TANOfDeductor`,
  `TDSSection`, `TDSClaimed`, `TDSCreditCarriedFwd`. Optional per row:
  `DeductedYr`, `BroughtFwdTDSAmt`, `TDSDeducted`, `GrossAmount`, `HeadOfIncome`.
- **ScheduleTDS3Dtls**: `TotalTDS3Details`; per row `PANofTenant`, `TDSSection`,
  `TDSClaimed`, `TDSCreditCarriedFwd`. Optional per row: `AadhaarofTenant`,
  `DeductedYr`, `BroughtFwdTDSAmt`, `TDSDeducted`, `GrossAmount`, `HeadOfIncome`.
- Plus, by the validation rules, `DeductedYr` whenever brought-forward TDS is
  claimed, and `GrossAmount` + `HeadOfIncome` whenever TDS is claimed in col 6.

---

## Hidden rows — not built

Two legacy credit tables sit on the sheet flagged `H` and are **not built** —
they are superseded by the live Sch TDS2(i) (rows 27–35) and Sch TDS2(ii) (rows
39–47), which use the modern schema blocks `TDSonOthThanSals` and
`ScheduleTDS3Dtls`. There is no schema block for either hidden table.

- **Hidden "20 Sch TDS2(i)", rows 15–25** — *"Details of Tax Deducted at Source
  on Income Other than Salary [As per Form 16 A issued by Deductor(s)]"*, an
  older 26AS-style layout with columns: SI.No; TDS credit in the name of; Tax
  Deduction Account Number (TAN) of the Deductor; Name of the Deductor; Unique
  TDS Certificate No.; Year of tax deduction; Details of Receipt as mentioned in
  Form 26AS; Tax Deducted (in own hands / in the hands of spouse as per section
  5A or any other person as per rule 37BA(2) Col (7)); Income; and a TOTAL row.
  Its dropdowns (kept here only for completeness, since they belong to hidden
  rows): the "TDS credit in the name of" list `E20:E24` — **(Select), Self,
  Other PAN**; and the "Year of tax deduction" list `J20:K24` — **(Select),
  2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010, 2009, 2008, 2007, 2006,
  2005, 2004, 2003, 2002, 2001**.
- **Hidden "20 Sch TDS2(ii)", rows 51–61** — *"Details of Tax Deducted at Source
  [As per Form 26QC furnished by Deductor(s)]"*, an older 26QC-style layout with
  columns: SI.No; TDS credit in the name of; PAN of the Tenant; Name of the
  Tenant; Unique TDS Certificate No.; Year of tax deduction; Details of Receipt
  as mentioned in Form 26AS; Tax Deducted (in own hands / in the hands of spouse
  as per section 5A or any other person as per rule 37BA(2) Col (7)); Income; and
  a TOTAL row. Its dropdowns (hidden-row values, for completeness): "TDS credit
  in the name of" `E56:E60` — **(Select), Self, Other PAN**; "Year of tax
  deduction" `J56:K60` — **(Select), 2018, 2017**.

Do not build either hidden table; the live Sch TDS2(i) and Sch TDS2(ii) carry
the fuller brought-forward / current-year / claimed / carried-forward columns.

---

## What this means for the build

1. **Three visible tables, two hidden.** Build Sch TDS1 (salary),
   Sch TDS2(i) (`TDSonOthThanSals`, Form 16A) and Sch TDS2(ii)
   (`ScheduleTDS3Dtls`, Form 16C/16D). Do not build the hidden 26AS/26QC tables.
2. **TDS 2(i) and TDS 2(ii) are nine-column credit tables** — deductor identifier
   (TAN for 2(i); PAN + Aadhaar for 2(ii)), section, brought-forward year and
   amount, current-year deducted, claimed this year, gross receipt offered, head
   of income, carried forward. TDS 2(ii) differs in that col 2 is the **PAN of
   the tenant/deductor** (with Aadhaar) instead of a TAN, its year dropdown stops
   at 2017-18, and its head-of-income dropdown drops the "Not applicable (194N)"
   option.
3. **Row arithmetic is live**: carried forward = MAX(0, b/f + deducted − claimed)
   per the `M`/`N` formulas.
4. **Validations to enforce**: year of deduction required whenever b/f is claimed;
   gross amount + head of income required whenever col 6 is claimed; claimed
   cannot exceed tax deducted or the income offered; section 192 is not allowed
   in these other-than-salary tables; for presumptive income, TDS1 cannot exceed
   the presumptive figure.
5. **No Schedule TCS and no Capital Gains head** on this ITR-4 sheet — head of
   income is limited to BP/HP/OS/EI(/NA), consistent with presumptive filing.
6. **Three totals feed D15 / 10b of Part B-TTI** — col 4 of TDS 1, col 6 of
   TDS 2(i) and col 6 of TDS 2(ii). Every total must be present even at zero.

## Additional visible rows — verbatim from the sheet (completeness)

- Sch TDS1 — Details of Tax Deducted at Source from SALARY [As per FORM 16 issued by Employer(s)]
- Tax Deduction Account Number (TAN)
- Name of the Employer
- Income under Salary
- Tax Deducted
- Enter the total of column 4 of Schedule-TDS1 and column 6 of Schedule-TDS2(i) and TDS 2(ii) in D15
- Sch TDS2(i) — Schedule TDS2(i) Details of Tax Deducted at Source on Income Other than Salary [As per Form 16 A issued by Deductor(s)]
- Sl.No. (Col 1)
- Tax Deduction Account Number (TAN) of the Deductor (Col 2)
- Section under which TDS deducted (Col 2a)
- Unclaimed TDS brought forward (b/f)
- TDS of the current Fin. Year (TDS deducted during the FY 2025-26)
- TDS credit being claimed this Year (only if corresponding receipt is being offered for tax this year)
- Corresponding Receipt /Withdrawals offered
- TDS credit being carried forward (Col 9)
- Fin. Year in which TDS is deducted (Col 3)
- TDS b/f (Col 4)
- TDS Deducted ( Col 5)
- TDS Claimed ( Col 6)
- Gross Amount (Col 7)
- Head of Income (Col 8)
- Sch TDS2(ii) — Sch TDS 2(ii) Details of Tax Deducted at Source [As per Form 16C / 16D furnished by Payer(s)]
- PAN of the Tenant / Deductor.
- Aadhaar No of the tenant / Deductor.
- Section under which TDS deducted
- Corresponding Receipt offered
- Fin. Year in which deducted (Col 3)
- Head of Income (Col 8)
- TOTAL
