# The book of Schedule TDS — Tax deducted at source (other than salary) · ITR-7, A.Y. 2026-27

Read row by row from the utility's **TDS** sheet (two live tables), with the
dropdowns and the column-header conditions, and confirmed against the schema's
`ScheduleTDS2` and `ScheduleTDS3` blocks. A trust/institution has no salary TDS,
so this sheet has **no salary (Form 16 / `ScheduleTDS1`) table**. The IT
(advance / self-assessment) challans live on their own sheet,
`books/ITR-7/IT.md`; the TCS table on `books/ITR-7/TCS.md`.

---

## 0 · The sheet-name ↔ schema-block offset — read this first

The utility labels **two** tables on this sheet, and their display names are
**offset by one** from the schema blocks they back. Getting this wrong maps every
column to the wrong array.

| Sheet label / item no. | What it is (form furnished) | **Schema block** | Array |
|---|---|---|---|
| **Schedule TDS1** · item **15B1** | TDS on income other than salary, as per **Form 16A** issued by deductor(s) | **`ScheduleTDS2`** | `TDSOthThanSalaryDtls[]` |
| **Schedule TDS2** · item **15B2** | TDS as per **Form 16B/16C/16D/16E** (buyer/tenant deducts — 194IA/IB/M/S) | **`ScheduleTDS3`** | `TDS3onOthThanSalDtls[]` |

So: the sheet's *"Schedule TDS1"* (Form 16A) is the schema's **`ScheduleTDS2`**;
the sheet's *"Schedule TDS2"* (Form 16B/C/D/E) is the schema's **`ScheduleTDS3`**.
There is no `ScheduleTDS1` in ITR-7 (that block is the salary table). Rule
**A633** confirms the mapping by content — Part B-TTI **9b** = *"the sum of
Totals of Column 9 of TDS 1 + column 9 of TDS 2"* (the two other-than-salary
tables here). Both tables feed **9b**; the sheet's own NOTE at D16 and D31 says
so: *"Please enter total column 9 of above in 9b of Part B-TTI."*

---

## 1 · The shape — two tables feeding Part B-TTI 9b

| Table | Item | Schema block | Feeds |
|---|---|---|---|
| **Schedule TDS1** (Form 16A) | 15B1 | `ScheduleTDS2` | **9b** — total of column 9 "Claimed in own hands" (rule A633) |
| **Schedule TDS2** (Form 16B/16C/16D/16E) | 15B2 | `ScheduleTDS3` | **9b** — total of column 9 "Claimed in own hands" (rule A633) |

Every table is repeatable and unlimited; every table's total is schema-required
even at zero. Each row enforces **deducted = claimed + carried forward** (rule
**A654**: col 13 = col 6 + col 7 + col 8(ii) − col 9 − col 10). Credit follows
income — column 9 may be claimed only where the corresponding receipt (col 11)
is offered under the head of income (col 12) (rule A652). The other-person case
(rule 37BA(2)) needs the PAN of that person (rule A647 / B27).

---

## 2 · Schedule TDS1 — TDS on income other than salary, Form 16A (schema `ScheduleTDS2`)

*Details of Tax Deducted at Source (TDS) on Income [As per FORM 16A issued by
Deductor(s)]* (D3). Item **15B1**. One row per deductor per section. Thirteen
logical columns (the sheet splits some into sub-columns):

| Sheet col | Sheet cell | Field (label) | Options / rule | Schema key (`TDSOthThanSalaryDtls[]`) |
|---|---|---|---|---|
| 1 | D4/D5 | Sl. No (Col 1) | serial | — |
| 2 | E4/E5 | **TDS credit relating to self /other person [other person as per rule 37BA(2)]** (Col 2) | dropdown **Self / Other Person** | `TDSCreditName` (S/O) |
| 3a | F4/F5 | **PAN Of Other Person (If TDS credit related to other person)** (Col 3a) | required when col 2 = Other Person | `PANofOtherPerson` |
| 3b | G4/G5 | **Aadhaar of Other Person (if TDS credit related to other person)** (Col 3b) | alternative to PAN | `AadhaarOfOtherPerson` |
| 4 | H4/H5 | **Tax Deduction Account Number (TAN) of the Deductor** (Col 4) | required | `TANOfDeductor` |
| 4a | I4 | **Section under which TDS is deducted** | dropdown — the section list, §6 | `TDSSection` |
| 5 | J5 | **Fin. Year in which deducted (Col (5))** | dropdown 2024 … 2008 (b/f credit) | `DeductedYr` |
| 6 | J4 / K5 | **Unclaimed TDS brought forward (b/f)** — TDS b/f (Col 6) | b/f credit not claimed earlier | `BroughtFwdTDSAmt` |
| 7 | L4 / L5 | **TDS of the current financial Year (TDS deducted during the FY 2025-26)** — Deducted in own hands (Col 7) | | `TaxDeductCreditDtls.TaxDeductedOwnHands` |
| 8 | M5 | Deducted in the hands of any other person as per rule 37BA(2) (Col 8) — **i) Income** (M6) / **ii) TDS** (N6) | two sub-columns | `TaxDeductCreditDtls.TaxDeductedIncome`, `TaxDeductCreditDtls.TaxDeductedTDS` |
| 9 | O4 / O5 | **TDS credit being claimed this Year (only if corresponding income is being offered for tax this year)** — Claimed In own hands (Col 9) | required to claim | `TaxDeductCreditDtls.TaxClaimedOwnHands` |
| 10 | P5 | Claimed in the hands of any other person as per rule 37BA(2) (Col 10) — **Income** (P6) / **TDS** (Q6) / **PAN** (R6) / **Aadhaar No.** (S6) | four sub-columns | `TaxDeductCreditDtls.TaxClaimedIncome`, `TaxClaimedTDS`, `TaxClaimedSpouseOthPrsnPAN`, `SpouseOthPrsnAadhaar` |
| 11 | T4 / T5 | **Corresponding Receipts /withdrawl offered** — Gross Amount (Col 11) | | `GrossAmount` |
| 12 | U5 | **Head of Income (Col 12)** | dropdown, §6.2 (pre-filled from the section, editable) | `HeadOfIncome` |
| 13 | V4 / V5 | **TDS credit being carried forward** (Col 13) | required | `AmtCarriedFwd` |
| — | (D13) | **Total** | computed | `TotalTDSonOthThanSals` |

`ScheduleTDS2` `required: [TotalTDSonOthThanSals]`. Per row, `tdscreditname`,
`tanofdeductor`, `tdssection`, `TaxDeductCreditDtls.taxclaimedownhands` and
`amtcarriedfwd` are required.

NOTE (D16): *"Please enter total column 9 of above in 9b of Part B-TTI."*

---

## 3 · Schedule TDS2 — TDS under 194IA/IB/M/S, Form 16B/16C/16D/16E (schema `ScheduleTDS3`)

*Details of Tax Deducted at Source (TDS) on Income [As per Form 16B/16C/16D/16E
furnished issued by Deductor(s)]* (D18). Item **15B2**. These are the sections
where the **buyer or tenant** deducts (194IA sale of property, 194IB rent,
194M contractor/professional payments, 194S virtual digital asset), so the
deductor has **no TAN** — identified by **PAN of the buyer/Tenant** instead.
Same thirteen columns as §2, with the deductor identity substituted:

| Sheet col | Sheet cell | Field (label) | Rule | Schema key (`TDS3onOthThanSalDtls[]`) |
|---|---|---|---|---|
| 1 | D19/D20 | Sl. No (Col 1) | serial | — |
| 2 | E19/E20 | **TDS credit in the name of (Col 2)** | dropdown Self / Other Person | `TDSCreditName` (S/O) |
| 3a | F19/F20 | **PAN Of Other Person (If TDS Credit related to other person)** (Col 3a) | when col 2 = Other Person | `PANofOtherPerson` |
| 3b | G19/G20 | **Aadhaar of Other Person (if TDS credit related to other person)** (Col 3b) | alternative | `AadhaarOfOtherPerson` |
| 4 | H19/H20 | **PAN of the buyer/Tenant** (Col 4) | required — in place of TAN | `PANOfBuyerTenant` |
| 4b | I19 | **Aadhaar of buyer/Tenant** | alternative | `AadhaarOfBuyerTenant` |
| 4c | J19 | **Section under which TDS is deducted** | dropdown, §6 | `TDSSection` |
| 5 | K20 | **Fin. Year in which deducted (Col (5))** | dropdown 2024 … 2008 | `DeductedYr` |
| 6 | K19 / L20 | **Unclaimed TDS brought forward (b/f)** — TDS b/f (Col 6) | | `BroughtFwdTDSAmt` |
| 7 | M19 / M20 | **TDS of the current financial Year (TDS deducted during the FY 2025-26)** — Deducted in own hands (Col 7) | | `TaxDeductCreditDtls.TaxDeductedOwnHands` |
| 8 | N20 | Deducted in the hands of any other person as per rule 37BA(2) (Col 8) — **i) Income** (N21) / **ii) TDS** (O21) | two sub-columns | `TaxDeductCreditDtls.TaxDeductedIncome`, `TaxDeductedTDS` |
| 9 | P19 / P20 | **TDS credit being claimed this Year (only if corresponding Receipt is being offered for tax this year)** — Claimed in own hands (Col 9) | required to claim | `TaxDeductCreditDtls.TaxClaimedOwnHands` |
| 10 | Q20 | Claimed in the hands of any other person as per rule 37BA(2) (Col 10) — **Income** (Q21) / **TDS** (R21) / **PAN** (S21) / **Aadhaar** (T21) | four sub-columns | `TaxDeductCreditDtls.TaxClaimedIncome`, `TaxClaimedTDS`, `TaxClaimedSpouseOthPrsnPAN`, `SpouseOthPrsnAadhaar` |
| 11 | U19 / U20 | **Corresponding Receipt offered** — Gross Amount (Col 11) | | `GrossAmount` |
| 12 | V20 | **Head of Income (Col 12)** | dropdown, §6.3 (no "Not applicable" here) | `HeadOfIncome` |
| 13 | W19 / W20 | **TDS credit being carried forward** (Col 13) | required | `AmtCarriedFwd` |
| — | (D28) | **Total** | computed | `TotalTDS3OnOthThanSal` |

`ScheduleTDS3` `required: [TotalTDS3OnOthThanSal]`. Per row, `tdscreditname`,
`panofbuyertenant`, `tdssection`, `TaxDeductCreditDtls.taxclaimedownhands` and
`amtcarriedfwd` are required.

NOTE (D31): *"Please enter total column 9 of above in 9b of Part B-TTI."*

---

## 4 · The five (Select) placeholder rows

Rows 7–11 (Schedule TDS1) and 22–26 (Schedule TDS2) each show **"(Select)"** in
column E — the entry rows waiting for a Self / Other Person choice. They are the
live input rows, not separate labels.

---

## 5 · The row arithmetic (from the rules document)

- **A654** — Schedule TDS (both tables), column 13 "TDS credit being carried
  forward" = column 6 + 7 + 8(ii) − 9 − 10.
- **A650** — Schedule TDS 15b(i): total of column 9 = Σ individual amounts.
  **A651** — Schedule TDS 15b(ii): total of column 9 = Σ individual amounts.
- **A642** — Schedule TDS1: unclaimed b/f and current-FY TDS in different rows.
  **A643** — Schedule TDS2: same.
- **A644** — Schedule TDS2: TDS claimed this year ≤ Tax deducted.
  **A645** — Schedule TDS1: TDS claimed this year ≤ Tax deducted.
- **A648** — Schedule TDS1 & TDS2: financial year in which tax deducted must not
  be null if there is a claim of brought-forward TDS.
- **A649** — Schedule TDS1 & TDS2: col 9 claimed ≤ col 11 gross amount.
- **A652** — if TDS is claimed, "Gross Amount" and "Head of Income" under
  "Corresponding Income offered" must be filled.
- **A653** — the column-2 dropdown (Self / Other Person) must be selected.
- **A646 / A647** — TAN of the deductor (TDS1) / PAN of Tenant / Buyer (TDS2)
  must be filled; if credit relates to the other person, the PAN of the other
  person is mandatory.
- **B27** — TDS credited in the hands of another person is allowed to that person
  only if they declare it in Schedule TDS of their own ITR.

---

## 6 · Dropdowns (verbatim — every value on the sheet)

Every value below is checked by Gate 3 against this book. The head-of-income is
pre-filled from the section and stays editable.

### 6.1 · TDS credit relating to (E7:E11, E22:E26)

```
(Select)
Self
Other Person
```

### 6.2 · Head of Income — TDS1 (U7:U11 — `Dropdown_HeadOfIncome_TDS2`)

Note the ITR-7 head list includes the trust exemption schedules (AI, IE-1…IE-4,
VC) as well as the four heads and "Not applicable":

```
(Select)
Schedule AI
Schedule IE-1
Schedule IE-2
Schedule IE-3
Schedule IE-4
Schedule VC
Income from House Property
Income from Business & Profession
Income from Capital Gains
Income from Other Sources
Not applicable ( only in case TDS is deducted u/s 194N)
```

### 6.3 · Head of Income — TDS2 (V22:V26 — `Dropdown_HeadOfIncome_TDS3`; drops "Not applicable")

```
(Select)
Schedule AI
Schedule IE-1
Schedule IE-2
Schedule IE-3
Schedule IE-4
Schedule VC
Income from House Property
Income from Business & Profession
Income from Capital Gains
Income from Other Sources
```

### 6.4 · Financial year of deduction (J7:J11, K22:K26)

```
(Select)
2024
2023
2022
2021
2020
2019
2018
2017
2016
2015
2014
2013
2012
2011
2010
2009
2008
```

### 6.5 · Section under which TDS is deducted (I7:I11, J22:J26 — `TDS_Section_List_1`)

The sheet dropdown lists **58 entries** (plus **(Select)**) as descriptive
labels; the schema `TDSSection` enum stores short codes. The full descriptive
list, verbatim:

```
(Select)
193-Interest on Securities
194-Dividends
194A-Interest other than 'Interest on securities'
194B-Winning from lottery or crossword puzzle
194BA-Winnings from online games
194BB-Winning from horse race
194C-Payments to contractors and sub-contractors
194D-Insurance commission
194DA-Payment in respect of life insurance policy
194E-Payments to non-resident sportsmen or sports associations
194EE-Payments in respect of deposits under National Savings
194F-Payments on account of repurchase of units by Mutual Fund or Unit Trust of India
194G-Commission, price, etc. on sale of lottery tickets
194H-Commission or brokerage
194I(a)-Rent on hiring of plant and machinery
194I(b)-Rent on other than plant and machinery
194IA-TDS on Sale of immovable property
194IB-Payment of rent by certain individuals or Hindu undivided
194IC-Payment under specified agreement
194J(a)-Fees for technical services
194J(b)-Fees for professional  services or royalty etc
194K-Income payable to a resident assessee in respect of units of a specified mutual fund or of the units of the Unit Trust of India
194LA-Payment of compensation on acquisition of certain immovable
194LB-Income by way of Interest from Infrastructure Debt fund
194LC-194LC (2)(i) and (ia) Income under clause (i) and (ia) of sub-section (2) of section 194LC
194LC-194LC (2)(ib) Income under clause (ib) of sub-section (2) of section 194LC
194LC-194LC (2)(ic) Income under clause (ic) of sub-section (2) of section 194LC
194LBA(a)-Certain income in the form of interest from units of a business trust to a resident unit holder
194LBA(b)-Certain income in the form of dividend from units of a business trust to a resident unit holder
194LBA(a)-194LBA(a) income referred to in section 10(23FC)(a) from units of a business trust-NR
194LBA(b)-194LBA(b) Income referred to in section 10(23FC)(b) from units of a business trust-NR
194LBA(c)-194LBA(c) Income referred to in section 10(23FCA) from units of a business trust-NR
194LBB-Income in respect of units of investment fund
194R-Benefits or perquisites of business or profession
194S-Payment of consideration for transfer of virtual digital asset by persons other than specified persons
Proviso to section 194B-Winnings from lotteries and crossword puzzles where consideration is made in kind or cash is not sufficient to meet the tax liability and tax has been paid before such winnings are released
First Proviso to sub-section(1) of section 194R-Benefits or perquisites of business or profession where such benefit is provided in kind or where part in cash is not sufficient to meet tax liability and tax required to be deducted is paid before such benefit is released
Proviso to sub- section(1) of section 194S-Payment for transfer of virtual digital asset where payment is in kind or in exchange of another virtual digital asset and tax required to be deducted is paid before such payment is released
194LBC-Income in respect of investment in securitization trust
194LD-TDS on interest on bonds / government securities
194M-Payment of certain sums by certain individuals or HUF
194N-Payment of certain amounts in cash other than cases covered by first proviso or third proviso
194N -First Proviso Payment of certain amounts in cash to non-filers except in case of co-operativesocieties
194N -Third Proviso Payment of certain amounts in cash to co-operative societies not covered by first proviso
194N-First Proviso read with Third Proviso Payment of certain amount in cash to non-filers being co-operative societies
194O-Payment of certain sums by e-commerce operator to e-commerce participant.
194P-Deduction of tax in case of specified senior citizen
194Q-Deduction of tax at source on payment of certain sum for purchase of goods
195-Other sums payable to a non-resident
196A-Income in respect of units of non-residents
196B-Payments in respect of units to an offshore fund
196C-Income from foreign currency bonds or shares of Indian
196D-Income of foreign institutional investors from securities
196D(1A)-Income of specified fund from securities
194BA(2)-Sub-section (2) of section 194BA Net Winnings from online games where the net winnings are made in kind or cash is not sufficient to meet the tax liability and tax has been paid before such net winnings are released
```

**Export note.** The schema stores short codes (e.g. `193`, `94A`, `4-IA`,
`4IA`, `94J-A`, `LBA1`, `94S-P`, `94T`, `96DA`); the sheet stores the descriptive
strings above. The engine must map each descriptive label to its schema
`TDSSection` code on export. There is **no `194T` (Payments to partners of
firms)** row on the ITR-7 dropdown — the ITR-7 list ends at the 194BA(2) proviso.

---

## 7 · What is mandatory

| Table | Required on every row | Required on the table |
|---|---|---|
| Schedule TDS1 (`ScheduleTDS2`) | `TDSCreditName`, `TANOfDeductor`, `TDSSection`, `TaxClaimedOwnHands`, `AmtCarriedFwd` | `TotalTDSonOthThanSals` |
| Schedule TDS2 (`ScheduleTDS3`) | `TDSCreditName`, `PANOfBuyerTenant`, `TDSSection`, `TaxClaimedOwnHands`, `AmtCarriedFwd` | `TotalTDS3OnOthThanSal` |

Plus: PAN (or Aadhaar) of the other person whenever credit relates to "Other
Person"; head of income and gross amount whenever col 9 is claimed.

---

## 8 · What repeats

Every table (`TDSOthThanSalaryDtls[]`, `TDS3onOthThanSalDtls[]`), unlimited.
Nothing else.

---

## 9 · Cross-sheet feeds

| Out of this sheet | Into |
|---|---|
| Σ column 9 of Schedule TDS1 + Schedule TDS2 (own hands) | Part B-TTI **9b** "TDS" (rule A633) |
| Head of income per row | tags the TDS credit to its head / exemption schedule |

Part B-TTI **9e** = 9a + 9b + 9c + 9d (rule A628); 9a/9d are the advance and
self-assessment totals from `books/ITR-7/IT.md`, 9c the TCS total from
`books/ITR-7/TCS.md`.

---

## 10 · What this means for the build

1. **Two tables, offset from their blocks** — the sheet's "Schedule TDS1" →
   `ScheduleTDS2`, "Schedule TDS2" → `ScheduleTDS3`. No salary table exists.
2. **Thirteen columns each** — credit self/other with the other person's PAN and
   Aadhaar, the deductor's TAN (TDS1) or the buyer/tenant's PAN/Aadhaar (TDS2),
   the section, financial year, b/f amount, deducted-own/other (income + TDS),
   claimed-own/other (income + TDS + PAN + Aadhaar), gross amount, head of
   income, carried forward.
3. **Row arithmetic checked live** — deducted = claimed + carried (A654); the
   other-person columns open only on "Other Person"; head pre-fills from the
   section and stays editable.
4. **Head-of-income list includes the trust schedules** (AI, IE-1…IE-4, VC),
   unlike a company return.
5. **Feed 9b** of Part B-TTI (ITR-7 numbering), both totals present even at zero.
6. **Export** — map each descriptive section label to its schema `TDSSection`
   code; write every row to its array; grep for duplicate writers after splicing.

---

## Appendix A · Every schema leaf (verbatim; * = required)

### `ScheduleTDS2` (sheet "Schedule TDS1", Form 16A)

```
  TDSOthThanSalaryDtls[]                                            array
* TDSOthThanSalaryDtls[].TDSCreditName                             string
  TDSOthThanSalaryDtls[].PANofOtherPerson                          string
  TDSOthThanSalaryDtls[].AadhaarOfOtherPerson                      string
* TDSOthThanSalaryDtls[].TANOfDeductor                            string
* TDSOthThanSalaryDtls[].TDSSection                               string
  TDSOthThanSalaryDtls[].DeductedYr                               integer
  TDSOthThanSalaryDtls[].BroughtFwdTDSAmt                         integer
  TDSOthThanSalaryDtls[].TaxDeductCreditDtls.TaxDeductedOwnHands  integer
  TDSOthThanSalaryDtls[].TaxDeductCreditDtls.TaxDeductedIncome    integer
  TDSOthThanSalaryDtls[].TaxDeductCreditDtls.TaxDeductedTDS       integer
* TDSOthThanSalaryDtls[].TaxDeductCreditDtls.TaxClaimedOwnHands   integer
  TDSOthThanSalaryDtls[].TaxDeductCreditDtls.TaxClaimedIncome     integer
  TDSOthThanSalaryDtls[].TaxDeductCreditDtls.TaxClaimedTDS        integer
  TDSOthThanSalaryDtls[].TaxDeductCreditDtls.TaxClaimedSpouseOthPrsnPAN  string
  TDSOthThanSalaryDtls[].TaxDeductCreditDtls.SpouseOthPrsnAadhaar string
  TDSOthThanSalaryDtls[].GrossAmount                             integer
  TDSOthThanSalaryDtls[].HeadOfIncome                             string
* TDSOthThanSalaryDtls[].AmtCarriedFwd                           integer
* TotalTDSonOthThanSals                                          integer
```

### `ScheduleTDS3` (sheet "Schedule TDS2", Form 16B/16C/16D/16E)

```
  TDS3onOthThanSalDtls[]                                            array
* TDS3onOthThanSalDtls[].TDSCreditName                            string
  TDS3onOthThanSalDtls[].PANofOtherPerson                         string
  TDS3onOthThanSalDtls[].AadhaarOfOtherPerson                     string
* TDS3onOthThanSalDtls[].PANOfBuyerTenant                        string
  TDS3onOthThanSalDtls[].AadhaarOfBuyerTenant                     string
* TDS3onOthThanSalDtls[].TDSSection                              string
  TDS3onOthThanSalDtls[].DeductedYr                              integer
  TDS3onOthThanSalDtls[].BroughtFwdTDSAmt                        integer
  TDS3onOthThanSalDtls[].TaxDeductCreditDtls.TaxDeductedOwnHands integer
  TDS3onOthThanSalDtls[].TaxDeductCreditDtls.TaxDeductedIncome   integer
  TDS3onOthThanSalDtls[].TaxDeductCreditDtls.TaxDeductedTDS      integer
* TDS3onOthThanSalDtls[].TaxDeductCreditDtls.TaxClaimedOwnHands  integer
  TDS3onOthThanSalDtls[].TaxDeductCreditDtls.TaxClaimedIncome    integer
  TDS3onOthThanSalDtls[].TaxDeductCreditDtls.TaxClaimedTDS       integer
  TDS3onOthThanSalDtls[].TaxDeductCreditDtls.TaxClaimedSpouseOthPrsnPAN  string
  TDS3onOthThanSalDtls[].TaxDeductCreditDtls.SpouseOthPrsnAadhaar  string
  TDS3onOthThanSalDtls[].GrossAmount                            integer
  TDS3onOthThanSalDtls[].HeadOfIncome                            string
* TDS3onOthThanSalDtls[].AmtCarriedFwd                          integer
* TotalTDS3OnOthThanSal                                         integer
```

## Appendix B · Every live-row label on the TDS sheet (verbatim from `tools/dump.py`)

```
r   2 : [C2] Schedule TDS1
r   3 : [C3] 15B1  |  [D3] Details of Tax Deducted at Source (TDS) on Income [As per FORM 16A issued by Deductor(s)]
r   4 : [D4] Sl. No  |  [E4] TDS credit relating to self /other person [other person as per rule 37BA(2)] (Col 2)  |  [F4] PAN Of Other Person(If TDS credit related to other person)  |  [G4] Aadhaar of Other Person (if TDS credit related to other person)  |  [H4] Tax Deduction Account Number (TAN) of the Deductor  |  [I4] Section under which TDS is deducted  |  [J4] Unclaimed TDS brought forward (b/f) (If TDS was deducted in previous year but was not claimed, detai  |  [L4] TDS of the current financial Year (TDS deducted during the FY 2025-26)  |  [O4] TDS credit being claimed this Year (only if corresponding income is being offered for tax this year)  |  [T4] Corresponding Receipts /withdrawl offered  |  [V4] TDS credit being carried forward
r   5 : [D5] (Col 1)  |  [E5] (Col 2)  |  [F5] (Col 3a)  |  [G5] (Col 3b)  |  [H5] (Col 4)  |  [J5] Fin. Year in which deducted (Col (5))  |  [K5] TDS b/f (Col 6)  |  [L5] Deducted in own hands (Col 7)  |  [M5] Deducted in the hands of any other person as per rule 37BA(2) (if applicable) Col (8) (if applicable  |  [O5] Claimed In own hands (Col 9)  |  [P5] Claimed in the hands of any other person as per rule 37BA(2) (If applicable) Col (10)  |  [T5] Gross Amount (Col 11)  |  [U5] Head of Income (Col 12)  |  [V5] (Col 13)
r   6 : [M6] i) Income  |  [N6] ii) TDS  |  [P6] Income  |  [Q6] TDS  |  [R6] PAN  |  [S6] Aadhaar No.
r   7 : [E7] (Select)
r   8 : [E8] (Select)
r   9 : [E9] (Select)
r  10 : [E10] (Select)
r  11 : [E11] (Select)
r  13 : [D13] Total
r  16 : [D16] Note: Please enter total column 9 of above in 9b of Part B-TTI
r  17 : [C17] Schedule TDS2
r  18 : [C18] 15B2  |  [D18] Details of Tax Deducted at Source (TDS) on Income [As per Form 16B/16C/16D/16E furnished issued by D
r  19 : [D19] Sl. No  |  [E19] TDS credit in the name of (Col 2)  |  [F19] PAN Of Other Person(If TDS Credit related to other person)  |  [G19] Aadhaar of Other Person (if TDS credit related to other person)  |  [H19] PAN of the buyer/Tenant  |  [I19] Aadhaar of buyer/Tenant  |  [J19] Section under which TDS is deducted  |  [K19] Unclaimed TDS brought forward (b/f) (If TDS was deducted in previous year but was not claimed, detai  |  [M19] TDS of the current financial Year (TDS deducted during the FY 2025-26)  |  [P19] TDS credit being claimed this Year (only if corresponding Receipt is being offered for tax this year  |  [U19] Corresponding Receipt offered  |  [W19] TDS credit being carried forward
r  20 : [D20] (Col 1)  |  [E20] (Col 2)  |  [F20] (Col 3a)  |  [G20] (Col 3b)  |  [H20] (Col 4)  |  [K20] Fin. Year in which deducted (Col (5))  |  [L20] TDS b/f (Col 6)  |  [M20] Deducted in own hands (Col 7)  |  [N20] Deducted in the hands of any other person as per rule 37BA(2) (if applicable) Col (8) (if applicable  |  [P20] Claimed in own hands (Col 9)  |  [Q20] Claimed in the hands of any other person as per rule 37BA(2) (If applicable) Col (10)  |  [U20] Gross Amount (Col 11)  |  [V20] Head of Income (Col 12)  |  [W20] (Col 13)
r  21 : [N21] i) Income  |  [O21] ii) TDS  |  [Q21] Income  |  [R21] TDS  |  [S21] PAN  |  [T21] Aadhaar
r  22 : [E22] (Select)
r  23 : [E23] (Select)
r  24 : [E24] (Select)
r  25 : [E25] (Select)
r  26 : [E26] (Select)
r  28 : [D28] Total
r  31 : [D31] Note: Please enter total column 9 of above in 9b of Part B-TTI
```
