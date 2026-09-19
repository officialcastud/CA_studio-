# The book of Schedule TDS · TCS — Tax deducted / collected at source (other than salary) · ITR-6, A.Y. 2026-27

Read row by row from the utility's **TDS** sheet (63 rows), with the hidden-row
flags, the dropdowns and the column-header conditions, and confirmed against the
schema's `ScheduleTDS2`, `ScheduleTDS3` and `ScheduleTCS`.

The sheet's opening note (B1): *"Note : In the TDS schedule, wherever possible,
head of income has been pre-filled based on TDS section under which TDS is
deducted. Please verify."*

**A company has no salary TDS.** So this sheet has **no salary (Form 16 /
TDS-1) table** — there is no `ScheduleTDS1` block for ITR-6. The IT (advance /
self-assessment) challans live on their own sheet, `books/ITR-6/IT.md`.

---

## 0 · The sheet-name ↔ schema-block offset — read this first

The utility labels three live tables on this sheet, and their **display names are
offset by one** from the schema blocks they back. Getting this wrong maps every
column to the wrong array.

| Sheet label / item no. | Rows | What it is (form furnished) | **Schema block** | Array |
|---|---|---|---|---|
| **Schedule TCS** · item **15C** | 15–28 | Tax Collected at Source, as per Form 27D | **`ScheduleTCS`** | `TCSDetails[]` |
| **Schedule TDS1** · item **15B1** | 34–47 | TDS on income **other than salary**, as per **Form 16A** issued by deductor(s) | **`ScheduleTDS2`** | `TDSOthThanSalaryDtls[]` |
| **Schedule TDS2** · item **15B2** | 49–63 | TDS as per **Form 16B/16C/16D/16E** (buyer/tenant deducts — 194IA/IB/M/S) | **`ScheduleTDS3`** | `TDS3onOthThanSalDtls[]` |

So: the sheet's *"Schedule TDS1"* (Form 16A) is the schema's **`ScheduleTDS2`**;
the sheet's *"Schedule TDS2"* (Form 16B/C/D/E) is the schema's **`ScheduleTDS3`**.
There is no `ScheduleTDS1` in ITR-6 (that block is the salary table, which
companies never file). The rules document confirms the mapping by content — rule
**A778** feeds Part B-TTI 10b from *"the sum of column 9 of Schedule TDS 1 &
Schedule TDS 2"* (the two other-than-salary tables above). The rules document is
internally inconsistent on the item letters: **A795** cites "15B1 / 15B2"
(matching the sheet cells C35 / C50), while **A790** cites "18B1 / 18B2" — a
typo; the sheet's own item numbers are **15B1, 15B2, 15C**, used here.

Rows **3–12 are hidden** (an older eight-column TCS table, item 15C) — **not
built**; the live TCS table is rows 15–28.

---

## 1 · The shape — three tables feeding Part B-TTI

| Table | Item | Feeds Part B-TTI |
|---|---|---|
| **Schedule TDS1** (schema `ScheduleTDS2`) | 15B1 | **10b** — total of column 9 "Claimed in own hands" (rule A778) |
| **Schedule TDS2** (schema `ScheduleTDS3`) | 15B2 | **10b** — total of column 9 "Claimed in own hands" (rule A778) |
| **Schedule TCS** (schema `ScheduleTCS`) | 15C | **10c** — total of column 7(i) "Claimed in own hands" (rules A777, A799) |

The Part B-TTI numbering is the ITR-6 numbering (**10b / 10c**), not ITR-2's
15b / 15c. Every table is repeatable and unlimited; every table's total is
schema-required even at zero.

Each row of the two TDS tables enforces **deducted = claimed + carried forward**
(rule **A798**: col 13 = col 6 + 7 + 8 − 9 − 10). The TCS row enforces the same
(rule **A805**: col 8 = col 5 + col 6 − col 7). Credit follows income — column 9
may be claimed only where the corresponding receipt (col 11) is offered under the
head of income (col 12) (rules A791, A792). The other-person case (rule
37BA(2) for TDS, rule 37-I for TCS) needs the PAN of that person (rules A794,
A802).

---

## 2 · Schedule TDS1 — TDS on income other than salary, Form 16A (schema `ScheduleTDS2`)

*Details of Tax Deducted at Source on Income [As per FORM 16A issued by
Deductor(s)]* (E34). Item **15B1**. One row per deductor per section. Thirteen
logical columns (the sheet splits some into sub-columns):

| Sheet col | Sheet cell | Field (label) | Options / rule | Schema key (`TDSOthThanSalaryDtls[]`) |
|---|---|---|---|---|
| 1 | D36 | Sl No (Col 1) | serial | — |
| 2 | E35 | **TDS credit relating to self /other person as per rule 37BA(2)** (Col 2) | dropdown **Self / Other Person** | `TDSCreditName` (S/O) |
| 3a | F35 | **PAN of Other Person (if TDS credit related to other person)** (Col 3a) | required when col 2 = Other Person | `PANofOtherPerson` |
| 3b | G35 | **Aadhaar No. Of Other Person (If TDS credit related to other person)** (Col 3b) | alternative to PAN | `AadhaarOfOtherPerson` |
| 4 | H35 | **Tax Deduction Account Number (TAN) of the Deductor** (Col 4) | required | `TANOfDeductor` |
| 4a | I35 | **Section under which TDS is deducted** (Col 4a) | dropdown — the section list, §6 | `TDSSection` |
| 5 | J36 | **Financial Year in which TDS is deducted** (Col 5) | dropdown 2024-25 … 2008-09 (b/f credit) | `DeductedYr` |
| 6 | J35 / K36 | **Unclaimed TDS brought forward (b/f)** — Amount b/f (Col 6) | b/f credit not claimed earlier | `BroughtFwdTDSAmt` |
| 7 | L35 / L36 | **TDS of the current financial Year (TDS deducted during the FY 2025-26)** — Deducted in own hands (Col 7) | | `TaxDeductCreditDtls.TaxDeductedOwnHands` |
| 8 | M36 | Deducted in the hands of any other person as per rule 37BA(2) (Col 8) — **Income** (M37) / **TDS** (N37) | two sub-columns | `TaxDeductCreditDtls.TaxDeductedIncome`, `TaxDeductCreditDtls.TaxDeductedTDS` |
| 9 | O35 / O36 | **TDS credit being claimed this Year (only if corresponding income is being offered for tax this year)** — Claimed in own hands (Col 9) | required to claim | `TaxDeductCreditDtls.TaxClaimedOwnHands` |
| 10 | P36 | Claimed in the hands of any other person as per rule 37BA(2) (Col 10) — **Income** (P37) / **TDS** (Q37) / **PAN of other person** (R37) / **Aadhaar No.** (S37) | four sub-columns | `TaxDeductCreditDtls.TaxClaimedIncome`, `TaxClaimedTDS`, `TaxClaimedSpouseOthPrsnPAN`, `SpouseOthPrsnAadhaar` |
| 11 | T35 / T37 | **Corresponding Receipt/withdrawals offered** — Gross Amount (T36, Col 11) | | `GrossAmount` |
| 12 | U36 / U37 | **Head of Income** (Col 12) | dropdown, §6 (pre-filled from the section, editable) | `HeadOfIncome` |
| 13 | V35 / V36 | **TDS credit out of (6), (7) or (8) being carried forward** (Col 13) | required | `AmtCarriedFwd` |
| — | (D45) | **Total** | computed | `TotalTDSonOthThanSals` |

`ScheduleTDS2` `required: [TotalTDSonOthThanSals]`. Per row, `TDSCreditName`,
`TANOfDeductor`, `TDSSection`, `TaxDeductCreditDtls.TaxClaimedOwnHands` and
`AmtCarriedFwd` are required (`TaxDeductCreditDtls` is a required object).

NOTE (D47): *"Please enter total of column 9 in 10b of Part B- TTI."*

---

## 3 · Schedule TDS2 — TDS under 194IA/IB/M/S, Form 16B/16C/16D/16E (schema `ScheduleTDS3`)

*Details of Tax Deducted at Source (TDS) on Income [As per Form 16B/16C/16D/16E
furnished issued by Deductor(s)]* (E49). Item **15B2**. These are the sections
where the **buyer or tenant** deducts (194IA sale of property, 194IB rent,
194M contractor/professional payments, 194S virtual digital asset), so the
deductor has **no TAN** — identified by **PAN of the buyer/tenant** instead.
Same thirteen columns as §2, with the deductor identity substituted:

| Sheet col | Sheet cell | Field (label) | Rule | Schema key (`TDS3onOthThanSalDtls[]`) |
|---|---|---|---|---|
| 1 | D51 | Sl No (Col 1) | serial | — |
| 2 | E50 | **TDS credit relating to Self/Other person as per Rule 37BA(2)** (Col 2) | dropdown Self / Other Person | `TDSCreditName` (S/O) |
| 3a | F50 | **PAN of Other Person (if TDS credit related to other person)** (Col 3a) | when col 2 = Other Person | `PANofOtherPerson` |
| 3b | G50 | **Aadhaar No. Of Other Person (If TDS credit related to other person)** (Col 3b) | alternative | `AadhaarOfOtherPerson` |
| 4a | H50 | **PAN of the buyer/Tenant** (Col 4a) | required — in place of TAN | `PANOfBuyerTenant` |
| 4b | I50 | **Aadhaar No of the buyer/tenant** (Col 4b) | alternative | `AadhaarOfBuyerTenant` |
| 4c | J50 | **Section under which TDS is deducted** (Col 4c) | dropdown, §6 | `TDSSection` |
| 5 | K51 | **Financial Year in which TDS is deducted** (Col 5) | dropdown 2024-25 … 2008-09 | `DeductedYr` |
| 6 | K50 / L51 | **Unclaimed TDS brought forward (b/f)** — Amount b/f (Col 6) | | `BroughtFwdTDSAmt` |
| 7 | M50 / M51 | **TDS of the current financial Year (TDS deducted during the FY 2025-26)** — Deducted in own hands (Col 7) | | `TaxDeductCreditDtls.TaxDeductedOwnHands` |
| 8 | N51 | Deducted in the hands of any other person as per rule 37BA(2) (Col 8) — **Income** (N52) / **TDS** (O52) | two sub-columns | `TaxDeductCreditDtls.TaxDeductedIncome`, `TaxDeductedTDS` |
| 9 | P50 / P51 | **TDS credit being claimed this Year (only if corresponding Receipt is being offered for tax this year)** — Claimed in own hands (Col 9) | required to claim | `TaxDeductCreditDtls.TaxClaimedOwnHands` |
| 10 | Q51 | Claimed in the hands of any other person as per rule 37BA(2) (Col 10) — **Income** (Q52) / **TDS** (R52) / **PAN of other person** (S52) / **Aadhaar** (T52) | four sub-columns | `TaxDeductCreditDtls.TaxClaimedIncome`, `TaxClaimedTDS`, `TaxClaimedSpouseOthPrsnPAN`, `SpouseOthPrsnAadhaar` |
| 11 | U50 / U51 | **Corresponding Receipt/withdrawals offered** — Gross Amount (Col 11) | | `GrossAmount` |
| 12 | V51 / V52 | **Head of Income** (Col 12) | dropdown, §6 (no "Not Applicable" here) | `HeadOfIncome` |
| 13 | W50 / W51 | **TDS credit out of (6), (7) or (8) being carried forward** (Col 13) | required | `AmtCarriedFwd` |
| — | (D61) | **Total** | computed | `TotalTDS3OnOthThanSal` |

`ScheduleTDS3` `required: [TotalTDS3OnOthThanSal]`. Per row, `TDSCreditName`,
`PANOfBuyerTenant`, `TDSSection`, `TaxDeductCreditDtls.TaxClaimedOwnHands` and
`AmtCarriedFwd` are required.

NOTE (D63): *"Please enter total of column 9 in 10b of Part B- TTI."*

---

## 4 · Schedule TCS — Tax Collected at Source, Form 27D (schema `ScheduleTCS`)

*Details of Tax Collected at Source (TCS) [As per Form 27D issued by the
Collector(s)]* (E15). Item **15C**. One row per collector. Note the credit-owner
codes are **Self / Other Person** (schema **S/O**) — the ITR-6 schema does
**not** use ITR-2's 1/2 codes here. "Other person" is under **rule 37i(1)**.

| Sheet col | Sheet cell | Field (label) | Rule | Schema key (`TCSDetails[]`) |
|---|---|---|---|---|
| 1 | D17 | Sl No (Col 1) | serial | — |
| 2i | E16 / E17 | **TCS credit relating to self/ other person [other person as per rule 37i(1)]** (Col 2i) | dropdown Self / Other Person | `EmployerOrDeductorOrCollectDetl.TCSCreditName` (S/O) |
| 2ii | F16 / F17 | **Tax Deduction and Tax Collection Account Number of the Collector** (Col 2ii) | required | `EmployerOrDeductorOrCollectDetl.TAN` |
| 3 | G16 / G17 | **PAN of Other person (if TCS credit related to other person)** (Col 3) | when col 2i = Other Person | `EmployerOrDeductorOrCollectDetl.PANofOtherPerson` |
| 4 | H17 | **Financial year in which TCS is collected** (Col 4) | dropdown 2024-25 … 2008-09 | `DeductedYr` |
| 5 | H16 / I17 | **Unclaimed TCS brought forward (b/f)** — Amount b/f (Col 5) | b/f credit | `BroughtFwdTCSAmt` |
| 6i | J16 / J17 | **TCS of the current financial Year (TCS deducted during the FY 2025-26)** — Collected in own hands (Col 6i) | | `TCSCurrFYDtls.TCSAmtCollOwnHands` |
| 6ii | K17 | Collected in the hands of any other person as per rule 37i(1) (Col 6ii) | | `TCSCurrFYDtls.TCSAmtCollOthrHands` |
| 7i | L16 / L17 | **TCS credit being claimed this year** — Claimed in own hands (Col 7i) | → Part B-TTI 10c | `TCSClaimedThisYearDtls.TCSAmtCollOwnHands` |
| 7ii | M17 | Claimed in hands of any other person as per rule 37i(1) (Col 7ii) — **TCS** (M18) / **PAN** (N18) | two sub-columns | `TCSClaimedThisYearDtls.TCSAmtCollOthrHands.TaxClaimedTCS`, `TCSClaimedThisYearDtls.TCSAmtCollOthrHands.PANOfOthrPrsn` |
| 8 | O16 / O17 | **TCS credit being carried forward** (Col 8) | required | `AmtCarriedFwd` |
| — | (D26) | **Total** | computed | `TotalSchTCS` |

`ScheduleTCS` `required: [TotalSchTCS]`. Per row, the collector's `TAN`,
`TCSCurrFYDtls.TCSAmtCollOwnHands`, `TCSClaimedThisYearDtls.TCSAmtCollOwnHands`
and `AmtCarriedFwd` are required (`EmployerOrDeductorOrCollectDetl` and
`TCSClaimedThisYearDtls` are required objects). Rule **A804**: the collector's
TAN must be provided. Rule **A805**: col 8 carried forward = col 5 + col 6 − col 7.

NOTE (D28): *"Please enter total of column 7(i) of Schedule-TCS in 10c of Part
B-TTI."*

### The hidden older TCS table (rows 3–12, item 15C) — not built

Rows 3–12 are an earlier eight-column TCS layout (C3 "15C"; E4 "SI. No.";
F4 "Tax Deduction and Tax Collection Account Number of the collector";
G4 "Name of the Collector"; H4 "Unclaimed TCS brought forward (b/f)";
J4 "TCS of the current financial Year (TCS deducted during the FY 2021-22)";
K4 "Amount out of (5) or (6) being claimed this Year"; L4 "Amount out of (5) or
(6) being carried forwarded"; NOTE G12 "Please enter total of column (7) in 10c
of Part B-TTI"). These rows are **hidden** and superseded by the live table at
rows 15–28 — **listed here as hidden, not built.**

---

## 5 · The row arithmetic (from the rules document)

- **A798** — Schedule TDS (both TDS1 and TDS2 tables), column 13 "TDS credit
  being carried forward" = column 6 + 7 + 8 − 9 − 10.
- **A788** — total of "TDS credit claimed this year" (col 9) = Σ individual rows.
- **A789** — unclaimed b/f (col 6) and current-FY TDS (col 7) must be in
  different rows.
- **A791 / A792** — col 9 claimed cannot exceed col 11 gross; if TDS is claimed,
  the corresponding income offered ("Gross Amount") and "Head of Income" must be
  filled.
- **A793** — TDS claimed from the other person cannot exceed TDS deducted on that
  person.
- **A794 / A802** — if credit relates to "other person", the PAN of the other
  person is mandatory.
- **A795 / A796** — TAN of the deductor / PAN of tenant or buyer must be filled.
- **A797** — the column-4a section dropdown must be selected; **A803** — the
  column-2(i) TCS dropdown must be selected.
- **A787** — year of tax deduction cannot be '0' / null where an entry exists.
- **A799** — TCS total col 7(i) = Σ rows; **A800** — TCS b/f (col 5) and current
  FY (col 6) in different rows; **A801** — TCS claimed cannot exceed b/f +
  collected; **A805** — col 8 = col 5 + col 6 − col 7.

---

## 6 · Dropdowns (verbatim — every value on the sheet)

Every value below is checked by Gate 3 against this book. The head-of-income is
pre-filled from the section (note B1) and stays editable.

### 6.1 · TDS/TCS credit relating to (E38:E43, E53:E59, E19:E24)

```
(Select)
Self
Other Person
```

### 6.2 · Head of Income — TDS1 (U38:U43, W38:W43 — `TDS2.HI`)

```
(Select)
Income from House Property
Income from Business & Profession
Income from Capital Gains
Income from Other Sources
Exempt Income
Not Applicable (only in case TDS is deducted u/s 194N)
```

### 6.3 · Head of Income — TDS2 (V53:V59 — `TDS3.HI`; drops "Not Applicable")

```
(Select)
Income from House Property
Income from Business & Profession
Income from Capital Gains
Income from Other Sources
Exempt Income
```

### 6.4 · Financial year of deduction / collection (H19:H24, J38:J43, K53:K59)

```
(Select)
2024-25
2023-24
2022-23
2021-22
2020-21
2019-20
2018-19
2017-18
2016-17
2015-16
2014-15
2013-14
2012-13
2011-12
2010-11
2009-10
2008-09
```

The hidden older TCS table's year dropdown (H11) offers a shorter list
(**(Select)**, 2020 … 2008); every one of those years is a leading value of a
row in the list above, and is covered here.

### 6.5 · Section under which TDS is deducted (I38:I43, J53:J59 — `TDS_Section_List_1`)

The sheet dropdown lists **57 sections** (plus **(Select)**) as descriptive
labels; the schema `TDSSection` enum files **56 codes**. The full descriptive
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
194T-Payments to partners of firms
195-Other sums payable to a non-resident
196A-Income in respect of units of non-residents
196B-Payments in respect of units to an offshore fund
196C-Income from foreign currency bonds or shares of Indian
196D-Income of foreign institutional investors from securities
196D(1A)-Income of specified fund from securities
```

**Source inconsistency (report):** the sheet dropdown offers 57 sections
including **194T — Payments to partners of firms** and **196D(1A)** (both new for
A.Y. 2026-27); the schema `TDSSection` enum (56 codes) includes both (`94T`,
`96DA`) but **also carries `94BA-P` (proviso to 194BA)**, which the sheet
dropdown does **not** offer. The schema stores short codes
(e.g. `193`, `94A`, `4-IA`, `4IA`, `94J-A`, `LBA1`, `94S-P`); the sheet stores
the descriptive strings above. The engine must map each descriptive label to its
schema code on export.

### 6.6 · Code ↔ label mapping (schema enum → sheet label)

| Schema code | Section |
|---|---|
| 193 | 193 — Interest on Securities |
| 194 | 194 — Dividends |
| 94A | 194A — Interest other than 'Interest on securities' |
| 94B | 194B — Winning from lottery or crossword puzzle |
| 94BA | 194BA — Winnings from online games |
| 4BB | 194BB — Winning from horse race |
| 94C | 194C — Payments to contractors and sub-contractors |
| 94D | 194D — Insurance commission |
| 4DA | 194DA — Payment in respect of life insurance policy |
| 94E | 194E — non-resident sportsmen or sports associations |
| 4EE | 194EE — deposits under National Savings |
| 4F | 194F — repurchase of units by Mutual Fund / UTI |
| 4G | 194G — commission on sale of lottery tickets |
| 4H | 194H — Commission or brokerage |
| 4-IA | 194I(a) — Rent on plant and machinery |
| 4-IB | 194I(b) — Rent on other than plant and machinery |
| 4IA | 194IA — sale of immovable property |
| 4IB | 194IB — rent by certain individuals or HUF |
| 4IC | 194IC — payment under specified agreement |
| 94J-A | 194J(a) — Fees for technical services |
| 94J-B | 194J(b) — Fees for professional services or royalty |
| 94K | 194K — units of a specified mutual fund / UTI |
| 4LA | 194LA — compensation on acquisition of immovable property |
| 4LB | 194LB — Interest from Infrastructure Debt fund |
| 4LC1 · 4LC2 · 4LC3 | 194LC — the three sub-clauses (2)(i)/(ia), (ib), (ic) |
| 4BA1 · 4BA2 | 194LBA(a)/(b) — business-trust interest / dividend, resident |
| LBA1 · LBA2 · LBA3 | 194LBA(a)/(b)/(c) — business-trust income, non-resident |
| LBB | 194LBB — units of investment fund |
| 94R · 94R-P | 194R — benefit or perquisite of business, and its proviso |
| 94S · 94S-P | 194S — virtual digital asset, and its proviso |
| 94B-P | Proviso to 194B — winnings in kind |
| 94BA-P | Proviso to 194BA (schema only — not offered on the sheet dropdown) |
| LBC | 194LBC — securitisation trust |
| 4LD | 194LD — interest on bonds / government securities |
| 94M | 194M — certain sums by individuals / HUF |
| 94N · 94N-F · 94N-C · 94N-FT | 194N — cash withdrawal and its proviso cases |
| 94O | 194O — e-commerce operator to participant |
| 94P | 194P — specified senior citizen |
| 94Q | 194Q — purchase of goods |
| 94T | 194T — Payments to partners of firms |
| 195 | 195 — other sums to a non-resident |
| 96A · 96B · 96C · 96D | 196A–196D — units, offshore funds, bonds/shares, FII securities |
| 96DA | 196D(1A) — income of specified fund from securities |

---

## 7 · What is mandatory

| Table | Required on every row | Required on the table |
|---|---|---|
| Schedule TDS1 (`ScheduleTDS2`) | `TDSCreditName`, `TANOfDeductor`, `TDSSection`, `TaxClaimedOwnHands`, `AmtCarriedFwd` | `TotalTDSonOthThanSals` |
| Schedule TDS2 (`ScheduleTDS3`) | `TDSCreditName`, `PANOfBuyerTenant`, `TDSSection`, `TaxClaimedOwnHands`, `AmtCarriedFwd` | `TotalTDS3OnOthThanSal` |
| Schedule TCS (`ScheduleTCS`) | `TAN`, `TCSCurrFYDtls.TCSAmtCollOwnHands`, `TCSClaimedThisYearDtls.TCSAmtCollOwnHands`, `AmtCarriedFwd` | `TotalSchTCS` |

Plus: PAN (or Aadhaar) of the other person whenever credit relates to "Other
Person"; head of income and gross amount whenever col 9 is claimed.

---

## 8 · What repeats

Every table (`TDSOthThanSalaryDtls[]`, `TDS3onOthThanSalDtls[]`, `TCSDetails[]`),
unlimited. Nothing else.

---

## 9 · Cross-sheet feeds

| Out of this sheet | Into |
|---|---|
| Σ column 9 of Schedule TDS1 + Schedule TDS2 (own hands) | Part B-TTI **10b** "TDS" (rule A778) |
| Σ column 7(i) of Schedule TCS (own hands) | Part B-TTI **10c** "TCS" (rules A777, A799) |
| Head of income per row | tags the TDS/TCS credit to its head (HP/BP/CG/OS/EI/NA) |

Part B-TTI **10e** = 10a + 10b + 10c + 10d (rule A764); 10a/10d are the advance
and self-assessment totals from `books/ITR-6/IT.md`.

---

## 10 · What this means for the build

1. **Three tables, offset from their blocks** — the sheet's "Schedule TDS1" →
   `ScheduleTDS2`, "Schedule TDS2" → `ScheduleTDS3`, "Schedule TCS" →
   `ScheduleTCS`. No salary (`ScheduleTDS1`) table exists for ITR-6.
2. **Thirteen columns each on the two TDS tables** — credit self/other with the
   other person's PAN and Aadhaar, the deductor's TAN (TDS1) or the buyer/tenant's
   PAN/Aadhaar (TDS2), the section, financial year, b/f amount,
   deducted-own/other (income + TDS), claimed-own/other (income + TDS + PAN +
   Aadhaar), gross amount, head of income, carried forward.
3. **TCS credit-owner is S/O** in the ITR-6 schema (not 1/2 as in ITR-2); its
   claimed-in-other-hands is a nested object (TCS + PAN).
4. **Row arithmetic checked live** — deducted = claimed + carried (A798, A805);
   the other-person columns open only on "Other Person"; head pre-fills from the
   section and stays editable.
5. **Feed 10b and 10c** of Part B-TTI (ITR-6 numbering), the three totals present
   even at zero.
6. **Export** — map each descriptive section label to its schema `TDSSection`
   code; write every row to its array; grep for duplicate writers after splicing.
