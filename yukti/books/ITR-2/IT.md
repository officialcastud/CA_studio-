# The book of Taxes Paid — Schedules TDS 1 · TDS 2 · TDS 3 · TCS · IT · ITR-2, A.Y. 2026-27

Read row by row from the utility's **TDS** sheet (161 rows) and **IT** sheet
(33 rows), with the hidden-row flags, and confirmed against the schema's
`ScheduleTDS1`, `ScheduleTDS2`, `ScheduleTDS3`, `ScheduleTCS` and `ScheduleIT`.

The sheet's opening note: *"In the TDS schedule, wherever possible, head of
income has been pre-filled based on the section under which TDS is deducted.
Please verify."*

---

## 1 · The shape — five tables, each feeding one line of Part B-TTI

| Table | Item on the sheet | What it is | Feeds |
|---|---|---|---|
| **TDS 1** | 20B | Tax deducted from **salary**, per Form 16 | Part B-TTI 15b |
| **TDS 2** | 20C(1) | Tax deducted on other income, per Form 16A / 16D | Part B-TTI 15b |
| **TDS 3** | 20C | Tax deducted under **194IA / 194IB / 194M / 194S**, per Form 16B / 16C / 16D / 16E | Part B-TTI 15b |
| **TCS** | D | Tax collected at source, per Form 27D | Part B-TTI 15c |
| **IT** | 17A | Advance tax and self-assessment tax challans | Part B-TTI 15a and 15d |

Every table is repeatable and unlimited. Every table ends in a total that the
schema marks required even at zero.

What ITR-2 adds over ITR-1, and it is the whole difference: **the credit can
belong to someone else, it can be brought forward from an earlier year, and it
can be carried forward to the next.** ITR-1's TDS 2 is four columns. ITR-2's is
thirteen.

---

## 2 · TDS 1 — Tax deducted at source from salary

*As per Form 16 issued by the employer(s).* One row per employer.

| Column | Field | Rule |
|---|---|---|
| 1 | Sl. No. | |
| 2 | **TAN of the employer** | required; four letters, five digits, one letter |
| 3 | **Name of employer** | required, max 125 |
| 4 | **Income chargeable under salaries** | required — should agree with the employer block in Schedule S |
| 5 | **Total tax deducted** | required |
| | Total | computed — `TotalTDSonSalaries` |

Schema: `ScheduleTDS1.TDSonSalary[]` with
`EmployerOrDeductorOrCollectDetl{TAN, EmployerOrDeductorOrCollecterName}`,
`IncChrgSal`, `TotalTDSSal`.

The note under the table: *"Please enter total of column 5 in 15b of Part
B-TTI."*

---

## 3 · TDS 2 — Tax deducted at source on income other than salary

*As per Form 16A issued, or Form 16D furnished, by the deductor(s).* One row
per deductor per section. Thirteen columns:

| Col | Field | Options / rule |
|---|---|---|
| 1 | Sl. No. | |
| 2 | **TDS credit relating to** | **S — Self · O — Other person** (spouse under section 5A, or any other person under rule 37BA(2)) |
| 3(i) | PAN of the other person | required when col 2 is O |
| 3(ii) | Aadhaar of the other person | alternative to PAN |
| 4 | **TAN of the deductor** | required |
| — | **Section under which TDS is deducted** | dropdown of **59 codes** — see §7 |
| 5 | Financial year in which TDS is deducted | dropdown, 2008 to 2024 — for brought-forward credit |
| 6 | **Unclaimed TDS brought forward** | credit from an earlier year not claimed then because the income was not offered then |
| 7 | TDS of the current year — **deducted in own hands** | |
| 8 | TDS of the current year — deducted in the hands of spouse under 5A or another person under rule 37BA(2) | two sub-columns: **income** and **TDS** |
| 9 | **TDS credit being claimed this year — in own hands** | required; *only if the corresponding income is being offered this year* |
| 10 | Claimed in the hands of spouse or other person | four sub-columns: **income · TDS · PAN · Aadhaar** of that person |
| 11 | **Corresponding receipt / withdrawals offered** — gross amount | |
| 12 | **Head of income** | dropdown: **HP · CG · OS · EI · NA** — pre-filled from the section |
| 13 | **TDS credit being carried forward** | required — what is deducted but not claimed this year |
| | Total | `TotalTDSonOthThanSals` |

Schema: `ScheduleTDS2.TDSOthThanSalaryDtls[]` — `TDSCreditName` (S/O),
`PANofOtherPerson`, `AadhaarOfOtherPerson`, `TANOfDeductor`, `TDSSection`,
`DeductedYr`, `BroughtFwdTDSAmt`, `TaxDeductCreditDtls{TaxDeductedOwnHands,
TaxDeductedIncome, TaxDeductedTDS, TaxClaimedOwnHands, TaxClaimedIncome,
TaxClaimedTDS, TaxClaimedSpouseOthPrsnPAN, SpouseOthPrsnAadhaar}`,
`GrossAmount`, `HeadOfIncome`, `AmtCarriedFwd`.

### The arithmetic the row enforces

**Deducted = claimed + carried forward.** Col 6 + col 7 + col 8(TDS) is the
credit available; col 9 + col 10(TDS) is what is claimed; col 13 is the rest.
The person cannot claim more than was deducted, and what is not claimed must be
carried, not dropped.

**Credit follows income.** Col 9 may be claimed only where the income in col 11
is offered this year under the head in col 12. The `EI` head is for income that
is exempt but had TDS — the credit is still claimable.

**The other-person case** is the rule 37BA(2) case: TDS deducted in the
spouse's name (or a joint holder's) on income that is actually the person's.
Col 2 = O, and the PAN or Aadhaar of that person is required.

The note under the table: *"Please enter total column 9 of above in 15b of
Part B-TTI."*

---

## 4 · TDS 3 — Tax deducted under 194IA, 194IB, 194M, 194S

*As per Form 16B / 16C / 16D / 16E furnished by the deductor.* These are the
sections where the **buyer or tenant** deducts — property purchase (194IA),
rent by an individual (194IB), contractor payments by an individual (194M),
virtual digital assets (194S). So the deductor has no TAN; they are identified
by **PAN**.

Same thirteen columns as TDS 2, with one substitution:

| Col | Field | Rule |
|---|---|---|
| 4 | **PAN of the buyer / tenant** | required — in place of the TAN |
| — | Aadhaar of the buyer / tenant | alternative |

And the head-of-income dropdown drops `NA`: **HP · CG · OS · EI**.

Schema: `ScheduleTDS3.TDS3onOthThanSalDtls[]` — as TDS 2 with
`PANOfBuyerTenant` and `AadhaarOfBuyerTenant` in place of `TANOfDeductor`.
Total `TotalTDS3OnOthThanSal`.

---

## 5 · TCS — Tax collected at source

*As per Form 27D issued by the collector(s).* One row per collector.

The sheet carries an **older six-column TCS table (17D) — hidden**; the live
table (item D) is the eleven-column one:

| Col | Field | Rule |
|---|---|---|
| 1 | Sl. No. | |
| 2(i) | **TCS credit relating to** | **1 — Self · 2 — Other person** (spouse under 5A / other under rule 37-I) — note the codes differ from TDS: `1`/`2`, not `S`/`O` |
| 2(ii) | **TAN of the collector** | required, max 10 |
| 3 | PAN of the other person | when 2(i) = 2 |
| 4 | Financial year in which TCS was collected | dropdown 2008–2024 |
| 5 | **Unclaimed TCS brought forward** | |
| 6(i) | TCS of the current year — collected in own hands | |
| 6(ii) | — collected in the hands of spouse or other person | |
| 7(i) | **TCS credit being claimed this year — own hands** | |
| 7(ii)(a) | — claimed in the hands of spouse or other person — TCS | |
| 7(ii)(b) | — PAN of that person | |
| 8 | **TCS credit being carried forward** | |
| | Total | `TotalSchTCS` |

Schema: `ScheduleTCS.TCS[]` — `TCSCreditOwner` (1/2), `PANOfSpouseOrOthrPrsn`,
`EmployerOrDeductorOrCollectTAN`, `DeductedYr`, `BroughtFwdTDSAmt`,
`TCSCurrFYDtls{TCSAmtCollOwnHand, TCSAmtCollSpouseOrOthrHand}`,
`TCSClaimedThisYearDtls{TCSAmtCollOwnHand, TCSAmtCollSpouseOrOthrHand,
PANOfSpouseOrOthrPrsn}`, `AmtCarriedFwd`.

The note: *"Please enter total of column 7(i) of Schedule-TCS in 10c of Part
B-TTI."*

---

## 6 · IT — Advance tax and self-assessment tax

*Details of payments of advance tax and self-assessment tax.* One row per
challan.

| Col | Field | Rule |
|---|---|---|
| 1 | Sl. No. | |
| 2 | **BSR code** | required — seven characters |
| 3 | **Date of deposit** | `DD/MM/YYYY`, required — the schema: *"on or after 2025-04-01"* |
| 4 | **Serial number of challan** | required, integer |
| 5 | **Amount** | required |
| | Total | `TotalTaxPayments` |

Schema: `ScheduleIT.TaxPayment[]` — `BSRCode`, `DateDep`, `SrlNoOfChaln`,
`Amt`.

### How the utility splits advance from self-assessment

The sheet does it **by date**, in a hidden helper column. The formula:

```
ExSat = IF(year(date) > 2025 [i.e. after 31 March 2026], "S" (self-assessment),
        else "A" (advance))
Advance tax = SUMIF(ExSat = "A", Amt)
```

So a challan dated **on or before 31 March 2026 is advance tax; after it is
self-assessment tax.** There is no dropdown to choose.

### The 234C quarter check

The same helper column places each advance-tax challan in its instalment
quarter from its date — up to 15 June · 16 June to 15 September · 16 September
to 15 December · 16 December to 15 March · after 15 March — which is what the
interest under 234C is worked from.

The note: *"Enter the totals of Advance tax and Self-Assessment tax in Sl. No.
15a and 15d of Part B-TTI."*

---

## 7 · The 59 TDS section codes

The dropdown on TDS 2 and TDS 3, code and meaning, from the schema's own
description:

| Code | Section |
|---|---|
| 92A | 192 — salary, government employees other than Indian Government |
| 92B | 192 — salary, employees other than government |
| 92C | 192 — salary, Indian Government employees |
| 192A | 192A — TDS on PF withdrawal |
| 193 | 193 — interest on securities |
| 194 | 194 — dividends |
| 94A | 194A — interest other than on securities |
| 94B | 194B — winnings from lottery or crossword puzzle |
| 94BA | 194BA — winnings from online games |
| 4BB | 194BB — winnings from horse race |
| 94C | 194C — payments to contractors |
| 94D | 194D — insurance commission |
| 4DA | 194DA — payment under a life insurance policy |
| 94E | 194E — non-resident sportsmen or associations |
| 4EE | 194EE — deposits under National Savings Scheme |
| 4F | 194F — repurchase of units by a mutual fund or UTI |
| 4G | 194G — commission on lottery tickets |
| 4H | 194H — commission or brokerage |
| 4-IA | 194I(a) — rent on plant and machinery |
| 4-IB | 194I(b) — rent on other than plant and machinery |
| 4IA | 194IA — sale of immovable property |
| 4IB | 194IB — rent by certain individuals or HUFs |
| 4IC | 194IC — payment under a specified agreement |
| 94J-A | 194J(a) — fees for technical services |
| 94J-B | 194J(b) — fees for professional services or royalty |
| 94K | 194K — income from units of a mutual fund or UTI |
| 4LA | 194LA — compensation on compulsory acquisition |
| 4LB | 194LB — interest from an infrastructure debt fund |
| 4LC1 · 4LC2 · 4LC3 | 194LC — interest to a non-resident by an Indian company, the three sub-cases |
| 4BA1 · 4BA2 | 194BA — the two sub-cases |
| LBA1 · LBA2 · LBA3 | 194LBA — income from a business trust, the three sub-cases |
| LBB | 194LBB — income from an investment fund |
| 94R | 194R — benefit or perquisite of business |
| 94S | 194S — virtual digital asset |
| 94B-P · 94R-P · 94S-P · 94BA-P | the proviso cases of 194B, 194R, 194S, 194BA |
| LBC | 194LBC — income from a securitisation trust |
| 4LD | 194LD — interest on bonds and government securities to an FII |
| 94M | 194M — contractor or professional payments by an individual |
| 94N · 94N-F · 94N-C · 94N-FT | 194N — cash withdrawal, and its sub-cases |
| 94O | 194O — e-commerce participants |
| 94P | 194P — specified senior citizens |
| 94Q | 194Q — purchase of goods |
| 195 | 195 — other sums to a non-resident |
| 96A · 96B · 96C · 96D · 96DA | 196A to 196DA — units, offshore funds, GDRs, FII securities, specified funds |

The head of income the utility pre-fills from the code: 4IA / 4-IA / 4-IB /
4IB → HP; 4IA on a sale, 94K, 96D → CG; 193, 194, 94A, 94B, 94BA, 4BB, 4DA,
4EE, 4LB, 4LD, LBA, LBB → OS; 94C, 94J, 94H, 94M → OS on ITR-2 (they would be
business on ITR-3).

---

## 8 · What is mandatory

| Table | Required on every row | Required on the table |
|---|---|---|
| TDS 1 | TAN, name, income, TDS | `TotalTDSonSalaries` |
| TDS 2 | credit-relating-to, TAN, section, claimed in own hands, carried forward | `TotalTDSonOthThanSals` |
| TDS 3 | credit-relating-to, PAN of buyer/tenant, section, claimed in own hands, carried forward | `TotalTDS3OnOthThanSal` |
| TCS | credit-relating-to, TAN of collector | `TotalSchTCS` |
| IT | BSR, date, serial, amount | `TotalTaxPayments` |

Plus: PAN or Aadhaar of the other person whenever credit-relating-to is O / 2.

---

## 9 · What repeats

Every table, unlimited. Nothing else.

---

## 10 · What this means for the build

1. **TDS 2 and TDS 3 grow from four columns to thirteen** — credit relating to
   self/other with the other person's PAN and Aadhaar, the financial year and
   brought-forward amount, deducted-in-own-hands and deducted-in-other's-hands
   (income and TDS), claimed-in-own-hands and claimed-in-other's-hands (income,
   TDS, PAN, Aadhaar), gross amount, head of income, carried forward.
2. **The row arithmetic is checked live** — deducted = claimed + carried; the
   other-person columns open only on O; the head pre-fills from the section
   and stays editable.
3. **TCS gets its eleven columns**, with the 1/2 codes, not S/O.
4. **IT stays four columns**, with the by-date split into advance and
   self-assessment and the 234C quarter placement — as today — and the
   schema's "on or after 1 April 2025" date rule enforced.
5. **The five totals feed Part B-TTI** — 15a advance, 15b the three TDS totals
   (claimed in own hands), 15c TCS claimed in own hands, 15d self-assessment.
6. **Export** — every row to its schema object, every total present even at
   zero.
