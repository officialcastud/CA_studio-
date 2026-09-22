# The book of Schedules FSI · TR · FA — the foreign block · ITR-2, A.Y. 2026-27

Read row by row from the utility's **FSI** sheet (43 rows) and **TR_FA** sheet
(170 rows, both schedules on one sheet), with the hidden-row flags, and
confirmed against `ScheduleFSI`, `ScheduleTR1` and `ScheduleFA`.

Three schedules, three different questions:

| Schedule | Question | Who |
|---|---|---|
| **FSI** | Income earned outside India that is in this return — and tax paid there | **residents** — *"available only in case of resident"* |
| **TR** | Summary of the relief claimed for that foreign tax | residents |
| **FA** | Every foreign asset held, whether or not it earned anything | **residents and ordinarily resident only** — *"not applicable for NRI"*, and not for RNOR |

---

## Part 1 · Schedule FSI — Income from outside India and tax relief

*"Details of income from outside India and tax relief (available only in case
of resident)."* One block per **country**, four fixed rows per block, the sheet
ships four blocks and the VBA adds more (`Block Count`).

The sheet's note on the country column: *"If no entry is made in this column,
then other columns will not be considered."*

### Per country

| Field | Rule |
|---|---|
| **Country code** | required — the 249-code list, India excluded |
| **Taxpayer identification number** in that country | required, max 75 |

Then a row per head:

| Sl. | Head (a) | Income from outside India, included in Part B-TI (b) | Tax paid outside India (c) | Tax payable on it in India under normal provisions (d) | Tax relief available in India (e) = **lower of (c) and (d)** | Relevant article of the DTAA, if relief under 90 or 90A (f) |
|---|---|---|---|---|---|---|
| i | Salary | | | | computed | |
| ii | House property | | | | computed | |
| iii | Capital gains | | | | computed | |
| iv | Other sources | | | | computed | |
| | **Total** | computed | computed | computed | computed | |

Schema: `ScheduleFSI.ScheduleFSIDtls[]` — `CountryName`,
`CountryCodeExcludingIndia`, `TaxIdentificationNo`, then `IncFromSal`,
`IncFromHP`, `IncCapGain`, `IncOthSrc`, `TotalCountryWise`, each
`{IncFrmOutsideInd, TaxPaidOutsideInd, TaxPayableinInd, TaxReliefinInd,
DTAAReliefUs90or90A}`. All four heads and the total are required per country.

### The rules

- Column (b) is income that is **already in the return** under that head — FSI
  does not add it; it identifies it.
- Column (d), tax payable in India, is the Indian tax on that slice at the
  person's average rate — the utility computes it as *(income × total Indian
  tax ÷ total income)*.
- Column (e) is the relief: **the lower of foreign tax and Indian tax** on the
  same income — the section 90 / 91 rule.
- Column (f) matters for TR: relief under 90 or 90A needs the treaty article;
  relief under 91 (no treaty) does not.

### What is mandatory

Per country: code, TIN, and all five objects.

---

## Part 2 · Schedule TR — Summary of tax relief claimed

*"Summary of tax relief claimed for taxes paid outside India (available in
case of resident)."* One row per country, **taken from FSI**:

| Column | Field | Source |
|---|---|---|
| a | **Country code** | from FSI |
| b | **Taxpayer identification number** | from FSI |
| c | **Total taxes paid outside India** — total of (c) in FSI for that country | computed |
| d | **Total tax relief available** — total of (e) in FSI for that country | computed |
| e | **Tax relief claimed under section** — **90 · 90A · 91** | dropdown |
| | Total | computed |

Then four lines:

| Field | Rule |
|---|---|
| **Total tax relief available where a DTAA applies — sections 90 and 90A** | computed — `TaxReliefOutsideIndiaDTAA` |
| **Total tax relief available where no DTAA applies — section 91** | computed — `TaxReliefOutsideIndiaNotDTAA` |
| **Whether any tax paid outside India, on which relief was allowed in India, has been refunded or credited by the foreign authority during the year?** | Yes / No |
| a — amount of tax refunded · b — assessment year in which the relief was allowed in India | when Yes |

Schema: `ScheduleTR1.ScheduleTR[]` — `CountryName`, `CountryCodeExcludingIndia`,
`TaxIdentificationNo`, `TaxPaidOutsideIndia`, `TaxReliefOutsideIndia`,
`ReliefClaimedUsSection`; then `TotalTaxPaidOutsideIndia`,
`TotalTaxReliefOutsideIndia`, `TaxReliefOutsideIndiaDTAA`,
`TaxReliefOutsideIndiaNotDTAA` (all four required), `TaxPaidOutsideIndFlg`
(YES/NO), `AmtTaxRefunded`, `AssmtYrTaxRelief`.

### Where it goes

The two relief totals go to **Part B-TTI** — relief under 90/90A and relief
under 91 are two separate lines there, and the utility's `TaxRelief` object
carries both. The refund flag is a clawback: relief allowed earlier on tax that
came back has to be given up.

---

## Part 3 · Schedule FA — Foreign assets and income from any source outside India

*"Details of foreign assets and income from any source outside India."* The
sheet's first note: **"This schedule is not applicable for NRI as per
residential status"** — and the closing note adds that it is for a person who
is *resident and ordinarily resident*.

Two things about FA that are unlike every other schedule:

**It runs on the calendar year.** *"Held at any time during the calendar year
ending as on 31st December 2025"* — not the financial year. Peak and closing
balances are as at that period.

**It is a disclosure, not an income schedule.** Every table asks whether the
income from the asset is taxable in the person's hands and, if so, *where in
this return it has been offered* — schedule and item number. FA does not add
income; it points to where the income already is.

### The nine tables — every column

**A1 · Foreign depository accounts** (bank accounts)

| Col | Field | Rule |
|---|---|---|
| 2 | Country name and code | required |
| 3 | Name of the financial institution | max 125 |
| 4 | Address | max 200 |
| 5 | ZIP code | max 8 |
| 6 | Account number | max 34 |
| 7 | **Status** | **OWNER · BENEFICIAL_OWNER · BENIFICIARY** |
| 8 | Account opening date | `DD/MM/YYYY` |
| 9 | **Peak balance during the period**, in rupees | |
| 10 | **Closing balance** | |
| 11 | **Gross interest paid or credited** during the period | |

**A2 · Foreign custodial accounts** — as A1, with column 11 as *gross amount
paid or credited* split into **nature — I interest · D dividend · S proceeds
from sale or redemption · O other · N none** — and the amount.

**A3 · Foreign equity and debt interest**

| Col | Field |
|---|---|
| 2 | Country name and code |
| 3 | Name of the entity |
| 4 | Address of the entity |
| 5 | ZIP code |
| 6 | Nature of the entity |
| 7 | Date of acquiring the interest |
| 8 | **Initial value of the investment** |
| 9 | **Peak value** during the period |
| 10 | **Closing balance** |
| 11 | Total gross amount paid or credited on the holding during the period |
| 12 | Total gross proceeds from sale or redemption during the period |

**A4 · Foreign cash-value insurance or annuity contract**

| Col | Field |
|---|---|
| 2 | Country name and code |
| 3 | Name of the financial institution holding the contract |
| 4 | Address |
| 5 | ZIP code |
| 6 | Date of contract |
| 7 | **Cash value or surrender value** of the contract |
| 8 | Total gross amount paid or credited on the contract during the period |

**B · Financial interest in any entity**

| Col | Field |
|---|---|
| 2(a)/(b) | Country name and code · ZIP |
| 3 | Nature of the entity |
| 4(a)/(b) | Name · address of the entity |
| 5 | **Nature of interest** — **DIRECT · BENEFICIAL_OWNER · BENIFICIARY** |
| 6 | Date since held |
| 7 | **Total investment at cost**, in rupees |
| 8 | Income accrued from the interest |
| 9 | Nature of that income |
| 10–12 | **Income taxable and offered in this return** — amount · **schedule where offered (SA · HP · CG · OS · EI · NI)** · item number of the schedule |

**C · Immovable property**

| Col | Field |
|---|---|
| 2(a)/(b) | Country name and code · ZIP |
| 3 | Address of the property |
| 4 | **Ownership** — DIRECT · BENEFICIAL_OWNER · BENIFICIARY |
| 5 | Date of acquisition |
| 6 | **Total investment at cost** |
| 7 | Income derived from the property |
| 8 | Nature of income |
| 9–11 | Amount offered · schedule · item number |

**D · Any other capital asset** — as C, with *nature of asset* in place of
the address.

**E · Accounts in which the person has signing authority** — and which are
not in A to D:

| Col | Field |
|---|---|
| 2 | Name of the institution |
| 3(a)/(b)/(c) | Address · country name and code · ZIP |
| 4 | Name of the account holder |
| 5 | Account number |
| 6 | **Peak balance or investment during the year** |
| 7 | **Whether income accrued is taxable in your hands?** — Y/N |
| 8 | If yes, income accrued in the account |
| 9–11 | If yes, amount offered · schedule · item number |

**F · Trusts created under the laws of a country outside India** in which the
person is a trustee, beneficiary or settlor:

| Col | Field |
|---|---|
| 2(a)/(b) | Country name and code · ZIP |
| 3/3(a) | Name · address of the trust |
| 4/4(a) | Name · address of the other trustees |
| 5/5(a) | Name · address of the settlor |
| 6/6(a) | Name · address of the beneficiaries |
| 7 | Date since the position was held |
| 8 | **Whether income derived is taxable in your hands?** — Y/N |
| 9 | If yes, income derived |
| 10–12 | If yes, amount offered · schedule · item number |

**G · Any other income derived from any source outside India** not included
in A to F and not under a business head:

| Col | Field |
|---|---|
| 2(a)/(b) | Country name and code · ZIP |
| 3(a)/(b) | Name · address of the person from whom derived |
| 4 | Income derived |
| 5 | Nature of income |
| 6 | **Whether taxable in your hands?** — Y/N |
| 7–9 | If yes, amount offered · schedule · item number |

Schema: `ScheduleFA` — `DetailsForiegnBank[]` (A1),
`DtlsForeignCustodialAcc[]` (A2), `DtlsForeignEquityDebtInterest[]` (A3),
`DtlsForeignCashValueInsurance[]` (A4), `DetailsFinancialInterest[]` (B),
`DetailsImmovableProperty[]` (C), `DetailsOthAssets[]` (D),
`DetailsOfAccntsHvngSigningAuth[]` (E), `DetailsOfTrustOutIndiaTrustee[]` (F),
and the table-G array. Every column marked required above is required per row.
The schedule-offered dropdown is **SA · HP · CG · OS · EI · NI** — NI for
"not in this return".

### The rules

- **Calendar year 2025**, 1 January to 31 December, for "held at any time" and
  for peak and closing.
- **Every table is unlimited.** The sheet ships several rows per table
  (`Total:` rows hidden) and the VBA adds more.
- **Values in rupees**, converted at the telegraphic-transfer buying rate on
  the relevant date — the instructions' rule; the utility does not convert.
- **Beneficial interest counts** — every table says *"including any beneficial
  interest"*.
- A resident with nothing to declare leaves FA out entirely; the block is
  optional at the top level.

### What ITR-2's FA has that Yukti built today

Yukti has three tables — bank, equity, immovable. The form has **nine**. A2
custodial, A4 insurance, B financial interest, D other assets, E signing
authority, F trusts and G other income are missing, and the "where offered"
columns are missing from the ones that exist.

---

## What this means for the build

1. **FSI** — a repeatable country block: code and TIN, then the four fixed head
   rows with (b) (c) (d) (f) typed and (e) computed as the lower; (d) worked at
   the average rate from the tax engine; the total row.
2. **TR** — generated from FSI, one row per country, with the 90/90A/91
   dropdown and the two computed totals; the refund clawback question. The two
   totals to Part B-TTI's relief lines.
3. **FA** — nine tables, every column, gated to a resident and ordinarily
   resident; each table's "where offered" pointing at a schedule and item; the
   calendar-year note on the section.
4. **Export** — `ScheduleFSI.ScheduleFSIDtls[]` with all five objects per
   country; `ScheduleTR1` with the four required totals; `ScheduleFA` with only
   the tables that have rows.
