# The book of the TDS sheet — Schedule TDS 1 (15B1) · Schedule TDS 2 (15B2) · Schedule TCS (15C) · ITR-5, A.Y. 2026-27

Read row by row from the utility's **TDS** sheet (73 rows, 10 hidden) with the
hidden-row flags, its formulas and its dropdowns, and confirmed against the
schema blocks named in `books/ITR-5/section_map.json` for this sheet —
`ScheduleTDS2`, `ScheduleTDS3` and `ScheduleTCS`. Item lettering and codes are
taken from the sheet's own item column (`15B1`, `15B2`, `15C`) and from the
rule texts in `books/ITR-5/rules.json`. Nothing here is carried over from
ITR-3 — the ITR-5 TCS schema keys differ.

> Sheet note (row 3, `C3`): *"Note : In the TDS schedule, wherever possible,
> head of income has been pre-filled based on TDS section."*

**The one mapping to keep straight:** the sheet's own display labels are off by
one from the schema block names.

| Sheet label (visible) | Sheet code | Sheet rows | Schema block | Deductor identified by |
|---|---|---|---|---|
| **Schedule TDS 1** | 15B1 | 5–15 | **`ScheduleTDS2`** | **TAN** of the Deductor (Form 16A) |
| **Schedule TDS 2** | 15B2 | 19–29 | **`ScheduleTDS3`** | **PAN / Aadhaar** of buyer / tenant / deductor (Form 16B/16C/16D/16E) |
| **SCHEDULE TCS** | 15C | 33–42 | **`ScheduleTCS`** | **TAN** of the Collector (Form 27D) |

ITR-5 has **no salary TDS block** (no `ScheduleTDS1` / Form 16 table) — the
firm/LLP/AOP/BOI has no salary income. An older six-column TCS table (rows
54–63) sits on the sheet **hidden** and is not built.

---

## The shape

Three **visible** tables, each repeatable and unlimited (one row per
deductor/collector per section), each ending in a total the schema requires
even at zero.

- **Schedule TDS 1 — 15B1** (`ScheduleTDS2`): TDS on income **other than salary**
  per **Form 16A**, deductor identified by **TAN**. Rows 5–15.
- **Schedule TDS 2 — 15B2** (`ScheduleTDS3`): TDS per **Form 16B / 16C / 16D /
  16E**, where the deductor is a buyer/tenant/deductor identified by **PAN or
  Aadhaar**, not TAN. Rows 19–29.
- **Schedule TCS — 15C** (`ScheduleTCS`): tax collected at source per **Form
  27D**, collector identified by **TAN**. Rows 33–42.

Each table splits every credit three ways in time and two ways by whose hands:
**Unclaimed TDS/TCS brought forward (b/f)** from an earlier year, **TDS/TCS of
the current financial year (deducted/collected during FY 2025-26)**, and the
amount **being claimed this year**; and within claiming, **own hands** vs. the
**hands of any other person as per rule 37BA(2)** (TDS) / **rule 37-I(1)**
(TCS). What is neither b/f nor claimed this year is **carried forward** (a
computed column). The two TDS "claimed in own hands" totals (col 9) feed **Sl.
No. 10b of Part B-TTI**; the TCS "claimed in own hands" total (col 7(i)) feeds
**Sl. No. 10c of Part B-TTI**.

---

## The items

### Schedule TDS 1 — item 15B1 · Details of Tax Deducted at Source on Income [As per Form 16 A issued by Deductor(s)]

`ScheduleTDS2.TDSOthThanSalaryDtls[]` — one row per deductor per section. TAN-based.

| Sheet col | Field label | Type | Schema key | Rule / notes |
|---|---|---|---|---|
| (Col 1) | Sl. No. | computed | — | row number, `E10=E9+1` … `E13=E12+1` |
| (Col 2) | TDS credit relating to self /other person [other person as per rule 37BA(2)] | string | `TDSOthThanSalaryDtls[].TDSCreditName` | **required**; enum **S, O**; dropdown `(Select)` / `Self` / `Other person` (`F9:F13`) |
| (Col 3a) | PAN of Other Person (if TDS credit related to other person) | string | `TDSOthThanSalaryDtls[].PANofOtherPerson` | needed when col 2 = Other person (`G9:G13`) |
| (Col 3b) | Aadhaar No. of Other Person (if TDS credit related to other person) | string | `TDSOthThanSalaryDtls[].AadhaarOfOtherPerson` | alternative to PAN (`H9:H13`) |
| (Col 4) | Tax Deduction Account Number (TAN) of the Deductor | string | `TDSOthThanSalaryDtls[].TANOfDeductor` | **required** (`I9:I13`) |
| — | Section under which TDS is deducted | string | `TDSOthThanSalaryDtls[].TDSSection` | **required**; dropdown of 57 codes = `TDS_Section_List_1` (`J9:J13`); enum stores the short code (e.g. `94A`) |
| Fin. Year in which deducted (Col 5) | Financial Year in which TDS is deducted | integer | `TDSOthThanSalaryDtls[].DeductedYr` | dropdown `2008-09 … 2024-25`; enum 2008–2024 — for brought-forward credit (`K9:K13`) |
| TDS b/f (Col 6) | Unclaimed TDS brought forward (b/f) | integer | `TDSOthThanSalaryDtls[].BroughtFwdTDSAmt` | credit from an earlier year (`L9:L13`) |
| Deducted in own hands (Col 7) | TDS of the current financial Year (TDS deducted during the FY 2025-26) — Deducted in own hands | integer | `TDSOthThanSalaryDtls[].TaxDeductCreditDtls.TaxDeductedOwnHands` | (`M9:M13`) |
| Col 8 — Income | Deducted in the hands of any other person as per rule 37BA(2) (if applicable) — Income | integer | `TDSOthThanSalaryDtls[].TaxDeductCreditDtls.TaxDeductedIncome` | (`N9:N13`) |
| Col 8 — TDS | Deducted in the hands of any other person as per rule 37BA(2) (if applicable) — TDS | integer | `TDSOthThanSalaryDtls[].TaxDeductCreditDtls.TaxDeductedTDS` | (`O9:O13`) |
| Claimed in own hands (Col 9) | TDS credit being claimed this Year (only if corresponding receipt is being offered for tax this year) — Claimed in own hands | integer | `TDSOthThanSalaryDtls[].TaxDeductCreditDtls.TaxClaimedOwnHands` | **required**; totalled at `P14` |
| Col 10 — Income | Claimed in the hands of any other person as per rule 37BA(2) (if applicable) — Income | integer | `TDSOthThanSalaryDtls[].TaxDeductCreditDtls.TaxClaimedIncome` | (`Q9:Q13`) |
| Col 10 — TDS | Claimed in the hands of any other person as per rule 37BA(2) (if applicable) — TDS | integer | `TDSOthThanSalaryDtls[].TaxDeductCreditDtls.TaxClaimedTDS` | (`R9:R13`) |
| Col 10 — PAN | Claimed in the hands of any other person — PAN | string | `TDSOthThanSalaryDtls[].TaxDeductCreditDtls.TaxClaimedSpouseOthPrsnPAN` | (`S9:S13`) |
| Col 10 — Aadhaar No. | Claimed in the hands of any other person — Aadhaar | string | `TDSOthThanSalaryDtls[].TaxDeductCreditDtls.SpouseOthPrsnAadhaar` | (`T9:T13`) |
| Gross Amount (Col 11) | Corresponding Receipt / Withdrawals offered — Gross Amount | integer | `TDSOthThanSalaryDtls[].GrossAmount` | (`U9:U13`) |
| Head of Income (Col 12) | Head of Income | string | `TDSOthThanSalaryDtls[].HeadOfIncome` | enum **HP, BP, CG, OS, EI, NA**; dropdown of 6 values (`V9:V13`); the `NA` value is *"Not Applicable ( only in case TDS is deducted u/s 194N)"* |
| TDS credit being carried forward (Col 13) | TDS credit being carried forward | computed integer | `TDSOthThanSalaryDtls[].AmtCarriedFwd` | **required**; `W9=MAX(0,L9+M9+O9-P9-R9)` (see rules) |
| Total | Total (of col 9) | computed | `TotalTDSonOthThanSals` | `P14=SUM(TDS2.ClaimedInOwnHands)` |

Note under the table (row 15, `F15`): *"Please enter total of column 9 in 10b
of Part B- TTI."*

### Schedule TDS 2 — item 15B2 · Details of Tax Deducted at Source (TDS) on Income [As per Form 16B/16C/16D/16E furnished issued by Deductor(s)]

`ScheduleTDS3.TDS3onOthThanSalDtls[]` — the buyer / tenant / deductor is
identified by **PAN or Aadhaar**, not TAN.

| Sheet col | Field label | Type | Schema key | Rule / notes |
|---|---|---|---|---|
| (Col 1) | Sl. No. | computed | — | `E24=E23+1` … `E27=E26+1` |
| (Col 2) | TDS credit relating to self /other person [other person as per rule 37BA(2)] | string | `TDS3onOthThanSalDtls[].TDSCreditName` | **required**; enum **S, O**; dropdown `(Select)` / `Self` / `Other person` (`F23:F27`) |
| (Col 3a) | PAN of Other Person (if TDS credit related to other person) | string | `TDS3onOthThanSalDtls[].PANofOtherPerson` | when col 2 = Other person (`G23:G27`) |
| (Col 3b) | Aadhaar No. of Other Person (if TDS credit related to other person) | string | `TDS3onOthThanSalDtls[].AadhaarOfOtherPerson` | alternative to PAN (`H23:H27`) |
| (Col 4a) | PAN of the buyer/Tenant / Deductor | string | `TDS3onOthThanSalDtls[].PANOfBuyerTenant` | **required** — replaces the TAN (`I23:I27`) |
| (Col 4b) | Aadhaar of the buyer/Tenant/ Deductor | string | `TDS3onOthThanSalDtls[].AadhaarOfBuyerTenant` | alternative to the PAN of the buyer/tenant (`J23:J27`) |
| — | Section under which TDS is deducted | string | `TDS3onOthThanSalDtls[].TDSSection` | **required**; same 57-code `TDS_Section_List_1` dropdown (`K23:K27`) |
| Fin. Year in which deducted (Col 5) | Financial Year in which TDS is deducted | integer | `TDS3onOthThanSalDtls[].DeductedYr` | dropdown `2008-09 … 2024-25`; enum 2008–2024 (`L23:L27`) |
| TDS b/f (Col 6) | Unclaimed TDS brought forward (b/f) | integer | `TDS3onOthThanSalDtls[].BroughtFwdTDSAmt` | (`M23:M27`) |
| Deducted in own hands (Col 7) | TDS of the current financial Year (TDS deducted during the FY 2025-26) — Deducted in own hands | integer | `TDS3onOthThanSalDtls[].TaxDeductCreditDtls.TaxDeductedOwnHands` | (`N23:N27`) |
| Col 8 — Income | Deducted in the hands of any other person as per rule 37BA(2) (if applicable) — Income | integer | `TDS3onOthThanSalDtls[].TaxDeductCreditDtls.TaxDeductedIncome` | (`O23:O27`) |
| Col 8 — TDS | Deducted in the hands of any other person as per rule 37BA(2) (if applicable) — TDS | integer | `TDS3onOthThanSalDtls[].TaxDeductCreditDtls.TaxDeductedTDS` | (`P23:P27`) |
| Claimed in own hands (Col 9) | TDS credit being claimed this Year (only if corresponding income is being offered for tax this year) — Claimed in own hands | integer | `TDS3onOthThanSalDtls[].TaxDeductCreditDtls.TaxClaimedOwnHands` | **required**; totalled at `Q28` |
| Col 10 — Income | Claimed in the hands of any other person as per rule 37BA(2) (if applicable) — Income | integer | `TDS3onOthThanSalDtls[].TaxDeductCreditDtls.TaxClaimedIncome` | (`R23:R27`) |
| Col 10 — TDS | Claimed in the hands of any other person as per rule 37BA(2) (if applicable) — TDS | integer | `TDS3onOthThanSalDtls[].TaxDeductCreditDtls.TaxClaimedTDS` | (`S23:S27`) |
| Col 10 — PAN | Claimed in the hands of any other person — PAN | string | `TDS3onOthThanSalDtls[].TaxDeductCreditDtls.TaxClaimedSpouseOthPrsnPAN` | (`T23:T27`) |
| Col 10 — Aadhaar No. | Claimed in the hands of any other person — Aadhaar | string | `TDS3onOthThanSalDtls[].TaxDeductCreditDtls.SpouseOthPrsnAadhaar` | (`U23:U27`) |
| Gross Amount (Col 11) | Corresponding Receipt / Withdrawals offered — Gross Amount | integer | `TDS3onOthThanSalDtls[].GrossAmount` | (`V23:V27`) |
| Head of Income (Col 12) | Head of Income | string | `TDS3onOthThanSalDtls[].HeadOfIncome` | enum **HP, BP, CG, OS, EI** (no NA); dropdown of 6 values (`W23:W27`) |
| TDS credit being carried forward (Col 13) | TDS credit being carried forward | computed integer | `TDS3onOthThanSalDtls[].AmtCarriedFwd` | **required**; `X23=MAX(0,M23+N23+P23-Q23-S23)` |
| Total | Total (of col 9) | computed | `TotalTDS3OnOthThanSal` | `Q28=SUM(TDS3.ClaimedInOwnHands)` |

Note under the table (row 29, `F29`): *"Please enter total of column 9 in 10b
of Part B- TTI."*

### Schedule TCS — item 15C · Details of Tax Collected at Source (TCS) [As per Form 27D issued by the Collector(s)]

`ScheduleTCS.TCSDetails[]` — one row per collector. TAN-based. Note the schema
nests the collector identity under `EmployerOrDeductorOrCollectDetl`, the
current-year figures under `TCSCurrFYDtls`, and the claimed figures under
`TCSClaimedThisYearDtls`.

| Sheet col | Field label | Type | Schema key | Rule / notes |
|---|---|---|---|---|
| (Col 1) | Sl. No. | computed | — | `E38=E37+1` … `E40` |
| (Col 2(i)) | TCS credit relating to self /other person [other person as per rule 37I(1)] | string | `TCSDetails[].EmployerOrDeductorOrCollectDetl.TCSCreditName` | enum **S, O**; dropdown `(Select)` / `Self` / `Other Person` (`F37:F40`) |
| (Col 2(ii)) | Tax Deduction and Tax Collection Account Number of the Collector | string | `TCSDetails[].EmployerOrDeductorOrCollectDetl.TAN` | **required** (`G37:G40`) |
| (Col 3) | PAN of Other person (if TCS credit related to other person) | string | `TCSDetails[].EmployerOrDeductorOrCollectDetl.PANofOtherPerson` | when col 2(i) = Other Person (`H37:H40`) |
| Financial year in which TCS is collected (Col 4) | Financial year in which TCS is collected | integer | `TCSDetails[].DeductedYr` | dropdown `2008-09 … 2024-25`; enum 2008–2024 (`I37:I40`) |
| Amount b/f (Col 5) | Unclaimed TCS brought forward (b/f) — Amount b/f | integer | `TCSDetails[].BroughtFwdTCSAmt` | (`J37:J40`) |
| Collected in own hands (Col 6(i)) | TCS of the current Financial Year (Tax collected during 2025-26) — Collected in own hands | integer | `TCSDetails[].TCSCurrFYDtls.TCSAmtCollOwnHands` | **required (own-hands current-year)** (`K37:K40`) |
| Collected in the hands of any other person as per rule 37i(1) (if applicable) (Col 6(ii)) | Collected in the hands of any other person | integer | `TCSDetails[].TCSCurrFYDtls.TCSAmtCollOthrHands` | (`L37:L40`) |
| Claimed in own hands (Col 7(i)) | TCS credit being claimed this year — Claimed in own hands | integer | `TCSDetails[].TCSClaimedThisYearDtls.TCSAmtCollOwnHands` | **required (own-hands claimed)**; totalled at `M41` |
| Col 7(ii) — TCS | Claimed in hands of any other person as per rule 37i(1) (if applicable) — TCS | integer | `TCSDetails[].TCSClaimedThisYearDtls.TCSAmtCollOthrHands.TaxClaimedTCS` | (`N37:N40`) |
| Col 7(ii) — PAN / Aadhar No. | Claimed in hands of any other person — PAN / Aadhaar No. | string | `TCSDetails[].TCSClaimedThisYearDtls.TCSAmtCollOthrHands.PANOfOthrPrsn` | (`O37:O40`) |
| (Col 8) | TCS credit being carry forward | computed integer | `TCSDetails[].AmtCarriedFwd` | **required**; `P37=MAX(0,J37+K37+L37-M37-N37)` |
| Total | Total (of col 7(i)) | computed | `TotalSchTCS` | `M41=SUM(TCS1.ClaimedOwnHands)` |

Note under the table (row 42, `F42`): *"Please enter total of column 7(i) of
Schedule-TCS in 10c of Part B-TTI."*

---

## The rules the sheet computes

- **Sl. No. auto-increment** — each table's serial column steps by one:
  `E10=E9+1`, `E11=E10+1`, `E12=E11+1`, `E13=E12+1` (TDS 1);
  `E24=E23+1 … E27=E26+1` (TDS 2); `E38=E37+1 … E40=E39+1` (TCS).
- **TDS 1 — TDS credit carried forward (col 13, `W9:W13`)** —
  `W9=MAX(0,L9+M9+O9-P9-R9)`: brought-forward b/f (`L`, col 6) + deducted in own
  hands (`M`, col 7) + deducted-in-other-hands **TDS** (`O`, col 8 TDS) − claimed
  in own hands (`P`, col 9) − claimed-in-other-hands **TDS** (`R`, col 10 TDS),
  floored at 0. Matches rule text *"column 13, 'TDS credit being carried
  forward' should be equal to column 6 + 7 + 8 - 9 - 10"*.
- **TDS 2 — TDS credit carried forward (col 13, `X23:X27`)** —
  `X23=MAX(0,M23+N23+P23-Q23-S23)`: b/f (`M`) + deducted own (`N`) +
  deducted-other TDS (`P`) − claimed own (`Q`) − claimed-other TDS (`S`),
  floored at 0.
- **TCS — TCS credit carried forward (col 8, `P37:P40`)** —
  `P37=MAX(0,J37+K37+L37-M37-N37)`: b/f (`J`, col 5) + collected own (`K`, col
  6(i)) + collected-other (`L`, col 6(ii)) − claimed own (`M`, col 7(i)) −
  claimed-other (`N`, col 7(ii)), floored at 0. Matches *"column 8, 'TCS credit
  being carried forward' should be equal to column 5 + column 6 - column 7"*.
- **Totals (each = SUM of the "claimed in own hands" column):**
  `P14=SUM(TDS2.ClaimedInOwnHands)` → `TotalTDSonOthThanSals`;
  `Q28=SUM(TDS3.ClaimedInOwnHands)` → `TotalTDS3OnOthThanSal`;
  `M41=SUM(TCS1.ClaimedOwnHands)` → `TotalSchTCS`.

Category-A validation rules from `books/ITR-5/rules.json` that bear on this sheet:

- **A847** — year of tax deduction must be selected if brought-forward TDS/TCS
  is provided (Sch TDS 1 / TDS 2 / TCS).
- **A848 / A849** — total of col 9 "Claimed in own hands" must equal the Total
  field (Sch TDS 1 / Sch TDS 2).
- **A850** — if TDS is claimed, the corresponding receipt/income must be offered
  for taxation.
- **A851 / A852** — "Unclaimed TDS brought forward" and "TDS of current FY"
  must be in different rows; col 9 claimed cannot exceed col 11 gross (except
  194N).
- **A853 / A854** — if TDS is claimed in col 9, "Gross Amount (Col 11)" and
  "Head of Income (Col 12)" are mandatory (except 194N for TDS 1).
- **A855 / A856** — if credit relates to another person, PAN of other person is
  mandatory, and the TAN of Deductor / PAN of buyer/tenant must be filled.
- **A857** — col 13 carried forward = col 6 + 7 + 8 − 9 − 10.
- **A858 / A859** — col 2 dropdown and the "Section under which TDS is deducted"
  selection are mandatory.
- **A860** — Sch TCS total of col 7(i) must equal the sum of individual values.
- **A861** — Sch TCS: unclaimed b/f and current-FY TCS cannot be in the same row.
- **A862 / A863** — Sch TCS: claimed (own + other) cannot exceed b/f + collected
  (own + other); other-person PAN required when credit relates to / is claimed
  in another person's hands.
- **A864 / A865** — Sch TCS: col 2(i) dropdown selection and the collector's Tax
  Deduction and Tax Collection Account Number are mandatory.
- **A866** — Sch TCS col 8 carried forward = col 5 + col 6 − col 7.
- **Return-level:** in Part B-TTI, 10b "TDS" = total claimed of TDS 1 + TDS 2,
  and 10c "TCS" = TCS Total; TCS credit in another person's hands is allowed
  only if that other person declares it in their own Schedule TCS.

---

## Dropdowns (every value)

**Self / Other person — TDS credit relating to (`F9:F13`, `F23:F27`)** — source
`"(Select), Self, Other person"`:
`(Select)`, `Self`, `Other person`.

**Self / Other Person — TCS credit relating to (`F37:F40`)** — source
`"(Select), Self, Other Person"`:
`(Select)`, `Self`, `Other Person`.

**Financial Year in which TDS/TCS deducted/collected (`K9:K13`, `L23:L27`,
`I37:I40`)** — source is a 17-value literal list:
`(Select)`, `2008-09`, `2009-10`, `2010-11`, `2011-12`, `2012-13`, `2013-14`,
`2014-15`, `2015-16`, `2016-17`, `2017-18`, `2018-19`, `2019-20`, `2020-21`,
`2021-22`, `2022-23`, `2023-24`, `2024-25`. (Schema `DeductedYr` enum stores the
start year as an integer 2008–2024, max 2024, min 2008.)

**Head of Income — TDS 1 (`V9:V13`)** — 6 values:
`(Select)`, `Income from House Property`, `Income from Business and Profession`,
`Income from Capital Gains`, `Income from Other Sources`, `Exempt Income`,
`Not Applicable ( only in case TDS is deducted u/s 194N)`.
(Schema enum: `HP`, `BP`, `CG`, `OS`, `EI`, `NA`.)

**Head of Income — TDS 2 (`W23:W27`)** — 6 values (no "Not Applicable"):
`(Select)`, `Income from House Property`, `Income from Business and Profession`,
`Income from Capital Gains`, `Income from Other Sources`, `Exempt Income`.
(Schema enum: `HP`, `BP`, `CG`, `OS`, `EI`.)

**Section under which TDS is deducted — `TDS_Section_List_1` (`J9:J13` for TDS 1,
`K23:K27` for TDS 2)** — 57 values (dropdown text · schema code):

- `(Select)`
- `193-Interest on Securities` · `193`
- `194-Dividends` · `194`
- `194A-Interest other than 'Interest on securities'` · `94A`
- `194B-Winning from lottery or crossword puzzle` · `94B`
- `194BA-Winnings from online games` · `94BA`
- `194BB-Winning from horse race` · `4BB`
- `194C-Payments to contractors and sub-contractors` · `94C`
- `194D-Insurance commission` · `94D`
- `194DA-Payment in respect of life insurance policy` · `4DA`
- `194E-Payments to non-resident sportsmen or sports associations` · `94E`
- `194EE-Payments in respect of deposits under National Savings` · `4EE`
- `194F-Payments on account of repurchase of units by Mutual Fund or Unit Trust of India`
- `194G-Commission, price, etc. on sale of lottery tickets`
- `194H-Commission or brokerage`
- `194I(a)-Rent on hiring of plant and machinery`
- `194I(b)-Rent on other than plant and machinery`
- `194IA-TDS on Sale of immovable property`
- `194IB-Payment of rent by certain individuals or Hindu undivided`
- `194IC-Payment under specified agreement`
- `194J(a)-Fees for technical services`
- `194J(b)-Fees for professional  services or royalty etc`
- `194K-Income payable to a resident assessee in respect of units of a specified mutual fund or of the units of the Unit Trust of India`
- `194LA-Payment of compensation on acquisition of certain immovable`
- `194LB-Income by way of Interest from Infrastructure Debt fund`
- `194LC-194LC (2)(i) and (ia) Income under clause (i) and (ia) of sub-section (2) of section 194LC`
- `194LC-194LC (2)(ib) Income under clause (ib) of sub-section (2) of section 194LC`
- `194LC-194LC (2)(ic) Income under clause (ic) of sub-section (2) of section 194LC`
- `194LBA(a)-Certain income in the form of interest from units of a business trust to a resident unit holder`
- `194LBA(b)-Certain income in the form of dividend from units of a business trust to a resident unit holder`
- `194LBA(a)-194LBA(a) income referred to in section 10(23FC)(a) from units of a business trust-NR`
- `194LBA(b)-194LBA(b) Income referred to in section 10(23FC)(b) from units of a business trust-NR`
- `194LBA(c)-194LBA(c) Income referred to in section 10(23FCA) from units of a business trust-NR`
- `194LBB-Income in respect of units of investment fund`
- `194R-Benefits or perquisites of business or profession`
- `194S-Payment of consideration for transfer of virtual digital asset by persons other than specified persons`
- `Proviso to section 194B-Winnings from lotteries and crossword puzzles where consideration is made in kind or cash is not sufficient to meet the tax liability and tax has been paid before such winnings are released`
- `First Proviso to sub-section(1) of section 194R-Benefits or perquisites of business or profession where such benefit is provided in kind or where part in cash is not sufficient to meet tax liability and tax required to be deducted is paid before such benefit is released`
- `Proviso to sub- section(1) of section 194S-Payment for transfer of virtual digital asset where payment is in kind or in exchange of another virtual digital asset and tax required to be deducted is paid before such payment is released`
- `194LBC-Income in respect of investment in securitization trust`
- `194LD-TDS on interest on bonds / government securities`
- `194M-Payment of certain sums by certain individuals or HUF`
- `194N-Payment of certain amounts in cash other than cases covered by first proviso or third proviso`
- `194N -First Proviso Payment of certain amounts in cash to non-filers except in case of co-operativesocieties`
- `194N -Third Proviso Payment of certain amounts in cash to co-operative societies not covered by first proviso`
- `194N-First Proviso read with Third Proviso Payment of certain amount in cash to non-filers being co-operative societies`
- `194O-Payment of certain sums by e-commerce operator to e-commerce participant.`
- `194P-Deduction of tax in case of specified senior citizen`
- `194Q-Deduction of tax at source on payment of certain sum for purchase of goods`
- `195-Other sums payable to a non-resident`
- `196A-Income in respect of units of non-residents`
- `196B-Payments in respect of units to an offshore fund`
- `196C-Income from foreign currency bonds or shares of Indian`
- `196D-Income of foreign institutional investors from securities`
- `196D(1A)-Income of specified fund from securities`
- `194BA(2)-Sub-section (2) of section 194BA Net Winnings from online games where the net winnings are made in kind or cash is not sufficient to meet the tax liability and tax has been paid before such net winnings are released`
- `194T-Payments to partners of firms`

(The schema `TDSSection` enum for both `ScheduleTDS2` and `ScheduleTDS3` holds
these as short codes — `193`, `194`, `94A`, `94B`, `94BA`, `4BB`, `94C`, `94D`,
`4DA`, `94E`, `4EE`, `4F`, `94G`, `94H` … `94T` — 56 codes, the list above minus
`(Select)`.)

---

## What repeats and what is one figure

- **Repeats** (one array row per deductor/collector per section, unlimited):
  the entire body of each table —
  `ScheduleTDS2.TDSOthThanSalaryDtls[]`,
  `ScheduleTDS3.TDS3onOthThanSalDtls[]`,
  `ScheduleTCS.TCSDetails[]`.
- **One figure** (a single scalar total per block):
  `TotalTDSonOthThanSals` (`P14`), `TotalTDS3OnOthThanSal` (`Q28`),
  `TotalSchTCS` (`M41`) — each the SUM of that block's "claimed in own hands"
  column, and each **required** even when the table is empty (report 0).
- **Computed per row** (do not collect from the user): the Sl. No. column and
  the col-13 / col-8 "carried forward" columns.

---

## Mandatory (from the schema `required`)

- **`ScheduleTDS2`** — block requires `TotalTDSonOthThanSals`. Each array row
  requires `TDSCreditName`, `TDSSection`, `TANOfDeductor`, the
  `TaxDeductCreditDtls` object with `TaxClaimedOwnHands`, and `AmtCarriedFwd`.
- **`ScheduleTDS3`** — block requires `TotalTDS3OnOthThanSal`. Each array row
  requires `TDSCreditName`, `PANOfBuyerTenant`, `TDSSection`, the
  `TaxDeductCreditDtls` object with `TaxClaimedOwnHands`, and `AmtCarriedFwd`.
- **`ScheduleTCS`** — block requires `TotalSchTCS`. Each array row requires the
  `EmployerOrDeductorOrCollectDetl` object with `TAN`,
  `TCSCurrFYDtls.TCSAmtCollOwnHands`,
  `TCSClaimedThisYearDtls.TCSAmtCollOwnHands`, and `AmtCarriedFwd`.

All amount fields are integers, minimum 0, maximum 99999999999999.

---

## Hidden rows — not built

The whole legacy TCS table at **rows 54–63 is hidden (`H`)** and is not built.
It is an older six-column "TCS ON INCOME" layout (item `15C`, header *"Details
of Tax Collected at Source [As per Form 27D issued by the Collector(s)]"*)
superseded by the visible Schedule TCS at rows 33–42:

- `r54H` `C54=15C`, `F54` "Details of Tax Collected at Source [As per Form 27D issued by the Collector(s)]"
- `r55H` `C55` "TCS ON INCOME"; column headers: `F55` Tax Deduction and Tax Collection Account Number of the collector, `G55` Name of the Collector, `H55` Unclaimed TCS brought forward (b/f), `J55` TCS of the current fin. year (tax collected during FY 2021-22), `K55` amount being claimed this year, `L55` amount being carried forward
- `r56H` `H56` Financial year in which TCS is collected, `I56` Amount b/f
- `r57H` column-number row (Col 1 … Col 8)
- `r58H–r61H` data rows — `L58=MAX(0,I58+J58-K58)` (carried-forward formula)
- `r62H` `H62` Total, `K62=SUM(TCS.AmtTCSClaimedThisYear)`
- `r63H` NOTE "Please enter total of column (7) of Schedule-TCS in 10c of Part B-TTI"

Its `sheet_map.json` schema keys (`TCS.TAN` = `F58:F61`,
`TCS.EmployerOrDeductorOrCollecterName` = `G58:G61`, `TCS.DeductedYear` =
`H58:H61`, `TCS.BroughtFwdTDSAmt` = `I58:I61`, `TCS.TotalTCS` = `J58:J61`,
`TCS.AmtTCSClaimedThisYear` = `K58:K61`, `TCS.AmtCarriedFwd` = `L58:L61`,
`TCS.Total` = `K62`) and its named `SCH_TCS` = `TDS!$C$54` are **not** listed in
`section_map.json` for this sheet (only `ScheduleTDS2`, `ScheduleTDS3`,
`ScheduleTCS` are), so this block is not built. Its hidden year dropdown
(`H58:H61` = `(Select),2020,2019,…,2008`) and buffer dropdowns (`F58:F61`,
`G58:G61`, `I58:I61`, `J58:J61`, `K58:K61`) are likewise not built.

---

## What this means for the build

- Build **three** repeatable tables. Watch the label/schema offset: the sheet's
  **"Schedule TDS 1" (15B1) is schema `ScheduleTDS2`** (TAN-based, Form 16A),
  the sheet's **"Schedule TDS 2" (15B2) is schema `ScheduleTDS3`** (PAN/Aadhaar
  of buyer/tenant, Form 16B/16C/16D/16E), and **"Schedule TCS" (15C) is schema
  `ScheduleTCS`**.
- There is **no salary-TDS table** in ITR-5.
- Do **not** collect the Sl. No. or the "credit being carried forward" columns
  from the user — they are computed: carried-forward = `MAX(0, b/f +
  deducted/collected(own) + deducted/collected(other) − claimed(own) −
  claimed(other))`.
- Each block's **Total is the SUM of only the "claimed in own hands" column**
  (col 9 for TDS, col 7(i) for TCS), and each Total is required even at zero.
- The credit is split brought-forward vs. current-FY vs. carried-forward, and
  own-hands vs. other-person's-hands; carry every one of those cells — the
  carry-forward formula and the department's cap rules (A857, A862, A866) depend
  on all of them.
- For TDS the other-person / rule-37BA(2) columns store both an **Income** and a
  **TDS** figure (cols 8 and 10) plus PAN and Aadhaar; for TCS the
  other-person / rule-37I(1) column (col 7(ii)) stores a **TCS** figure plus a
  single PAN/Aadhaar.
- Feed the TDS "claimed in own hands" totals to **Part B-TTI 10b** and the TCS
  "claimed in own hands" total to **Part B-TTI 10c**.
- Do **not** build the hidden legacy TCS table (rows 54–63).
