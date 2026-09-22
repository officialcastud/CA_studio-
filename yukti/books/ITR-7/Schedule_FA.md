# The book of Schedule FA — foreign assets and income from any source outside India · ITR-7, A.Y. 2026-27

Read row by row from the utility's **Schedule FA** sheet, with the hidden-row
flags, and confirmed against the schema block **`ScheduleFA`** and the
validation-rules document. This is the ITR-7 form. Nine tables — **A1, A2, A3,
A4, B, C, D, E, F, G**. Each table ships several blank rows visible with a hidden
`Total:` row; the VBA adds more rows on demand — **every table is unlimited**.

Row 3 (D3): **FA** — *"Details of Foreign Assets and Income from any source
outside India"*. Row 2 (C2): *"(Note: If no entry is made in first row then other
rows will not be considered)."* Row 4 (D4): *"NOTE : This Schedule is not
Applicable for NRI (Non Resident Indians) as per Residential Status."*

Two things unlike an income schedule:

- **It runs on the calendar year.** Every table header says *"held … at any time
  during the relevant Calendar Year ending as on 31st December 2025"* — peak and
  closing balances are for that period, not the financial year.
- **It is a disclosure, not an income schedule.** From table B onward each row
  asks whether the income is taxable in the person's hands and *where in this
  return it has been offered* — schedule and item number. FA does not add income;
  it points to where the income already is.

> **One country-code format on ITR-7 FA.** Every country dropdown on this sheet —
> A1/A2/A3/A4 and B/C/D/E/F/G — uses **`Country_WithoutIndia`** in the
> **`code-NAME`** format (e.g. `93-AFGHANISTAN`). There is no `NAME:code` list on
> this sheet. Seed every country field from the one `Country_WithoutIndia` list.

## The tables

### A1 · Foreign Depository Accounts — `DetailsForiegnBank[]` (header row 5, cols row 6, data rows 8–13)

*"Details of Foreign Depository Accounts held (including any beneficial interest)
at any time during the relevant Calendar Year ending as on 31st December 2025."*

| Col | # | Label (verbatim) | Type / enum | Schema key |
|---|---|---|---|---|
| E | 2 & 3 | Country Name and Code | dropdown (`Country_WithoutIndia`, code-NAME) | `CountryCodeExcludingIndia` + `CountryName` |
| F | 4 | Name of financial institution | text | `Bankname` |
| G | 5 | Address of financial institution | text | `AddressOfBank` |
| H | 6 | ZIP Code | text | `ZipCode` |
| I | 7 | Account Number | text | `ForeignAccountNumber` |
| J | 8 | Status | dropdown — OWNER · BENEFICIAL_OWNER · BENIFICIARY | `OwnerStatus` |
| K | 9 | Account opening date | date | `AccOpenDate` |
| L | 10 | Peak Balance During the Period | integer (₹) | `PeakBalanceDuringYear` |
| M | 11 | Closing balance | integer (₹) | `ClosingBalance` |
| N | 12 | Gross interest paid/credited to the account during the period | integer (₹) | `IntrstAccured` |

### A2 · Foreign Custodial Accounts — `DtlsForeignCustodialAcc[]` (header row 19, cols rows 20–21, data rows 22–27)

*"Details of Foreign Custodial Accounts held (including any beneficial interest)
at any time during the relevant Calendar Year ending as on 31st December 2025."*

| Col | # | Label (verbatim) | Type / enum | Schema key |
|---|---|---|---|---|
| E | 2 & 3 | Country Name and Code | dropdown (`Country_WithoutIndia`) | `CountryCodeExcludingIndia` + `CountryName` |
| F | 4 | Name of financial institution | text | `FinancialInstName` |
| G | 5 | Address of financial institution | text | `FinancialInstAddress` |
| H | 6 | ZIP Code | text | `ZipCode` |
| I | 7 | Account Number | text | `AccountNumber` |
| J | 8 | Status | dropdown — OWNER · BENEFICIAL_OWNER · BENIFICIARY | `Status` |
| K | 9 | Account opening date | date | `AccOpenDate` |
| L | 10 | Peak Balance During the Period | integer (₹) | `PeakBalanceDuringPeriod` |
| M | 11 | Closing balance | integer (₹) | `ClosingBalance` |
| N | 12 | Gross amount paid/credited to the account during the period | integer (₹) | `GrossAmtPaidCredited` |
| N | 12a | Nature of Amount | dropdown (`SchFA_Nature`) | `NatureOfAmount` |
| O | 12b | Amount | integer (₹) | (the amount for `GrossAmtPaidCredited`) |

### A3 · Foreign Equity and Debt Interest — `DtlsForeignEquityDebtInterest[]` (header row 33, cols row 34, data rows 36–41)

*"Details of Foreign Equity and Debt Interest held (including any beneficial
interest) in any entity at any time during the relevant Calendar Year ending as on
31st December 2025."*

| Col | # | Label (verbatim) | Type / enum | Schema key |
|---|---|---|---|---|
| E | 2 & 3 | Country Name and Code | dropdown (`Country_WithoutIndia`) | `CountryCodeExcludingIndia` + `CountryName` |
| F | 4 | Name of entity | text | `NameOfEntity` |
| G | 5 | Address of entity | text | `AddressOfEntity` |
| H | 6 | ZIP Code | text | `ZipCode` |
| I | 7 | Nature of entity | text | `NatureOfEntity` |
| J | 8 | Date of acquiring the interest | date | `InterestAcquiringDate` |
| K | 9 | Initial value of the investment | integer (₹) | `InitialValOfInvstmnt` |
| L | 10 | Peak value of investment during the Period | integer (₹) | `PeakBalanceDuringPeriod` |
| M | 11 | Closing balance | integer (₹) | `ClosingBalance` |
| N | 12 | Total gross amount paid/credited with respect to the holding during the period | integer (₹) | `TotGrossAmtPaidCredited` |
| O | 13 | Total gross proceeds from sale or redemption of investment during the period | integer (₹) | `TotGrossProceeds` |

### A4 · Foreign Cash Value Insurance / Annuity Contract — `DtlsForeignCashValueInsurance[]` (header row 47, cols row 48, data rows 50–55)

*"Details of Foreign Cash Value Insurance Contract or Annuity Contract held
(including any beneficial interest) at any time during the relevant Calendar Year
ending as on 31st December 2025."*

| Col | # | Label (verbatim) | Type / enum | Schema key |
|---|---|---|---|---|
| E | 2 & 3 | Country Name and Code | dropdown (`Country_WithoutIndia`) | `CountryCodeExcludingIndia` + `CountryName` |
| F | 4 | Name of financial institution in which insurance contract held | text | `FinancialInstName` |
| G | 5 | Address of financial institution | text | `FinancialInstAddress` |
| H | 6 | ZIP Code | text | `ZipCode` |
| I | 7 | Date of contract | date | `ContractDate` |
| J | 8 | The cash value or surrender value of the contract | integer (₹) | `CashValOrSurrenderVal` |
| K | 9 | Total gross amount paid/credited with respect to the contract during the period. | integer (₹) | `TotGrossAmtPaidCredited` |

### B · Financial Interest in any Entity — `DetailsFinancialInterest[]` (header row 61, cols rows 62–63, data rows 64–69)

*"Details of Financial Interest in any Entity held (including any beneficial
interest) at any time during the relevant Calendar Year ending as on 31st December
2025."*

| Col | # | Label (verbatim) | Type / enum | Schema key |
|---|---|---|---|---|
| E | 2(a) | Country Name and Code | dropdown (`Country_WithoutIndia`) | `CountryCodeExcludingIndia` + `CountryName` |
| F | 2(b) | Zip Code | text | `ZipCode` |
| G | 3 | Nature of entity | text | `NatureOfEntity` |
| H | 4 | Name of the Entity | text | `NameOfEntity` |
| I | — | Address of the Entity | text | `AddressOfEntity` |
| J | 5 | Nature of Interest | dropdown — DIRECT · BENEFICIAL_OWNER · BENIFICIARY | `NatureOfInt` |
| K | 6 | Date since held | date | `DateHeld` |
| L | 7 | Total Investment (at cost) (in rupees) | integer (₹) | `TotalInvestment` |
| M | 8 | Income accrued from such Interest | integer (₹) | `IncFromInt` |
| N | 9 | Nature of Income | text | `NatureOfInc` |
| O | 10 | Income taxable and offered in this return — Amount | integer (₹) | `IncTaxAmt` |
| P | 11 | Schedule where offered | dropdown (`DropdownFA_B`) | `IncTaxSch` |
| Q | 12 | Item number of schedule | text | `IncTaxSchNo` |

### C · Immovable property — `DetailsImmovableProperty[]` (header row 76, cols rows 77–78, data rows 79–84)

*"Details of immovable property held (including any beneficial interest) at any
time during the relevant Calendar Year ending as on 31st December 2025."*

| Col | # | Label (verbatim) | Type / enum | Schema key |
|---|---|---|---|---|
| E | 2(a) | Country Name and Code | dropdown (`Country_WithoutIndia`) | `CountryCodeExcludingIndia` + `CountryName` |
| F | 2(b) | Zip Code | text | `ZipCode` |
| G | 3 | Address of the Property | text | `AddressOfProperty` |
| H | 4 | Ownership- Direct/ Beneficial owner/ Beneficiary | dropdown — DIRECT · BENEFICIAL_OWNER · BENIFICIARY | `Ownership` |
| I | 5 | Date of acquisition | date | `DateOfAcq` |
| J | 6 | Total Investment (at cost) (in rupees) | integer (₹) | `TotalInvestment` |
| K | 7 | Income derived from the property | integer (₹) | `IncDrvProperty` |
| L | 8 | Nature of Income | text | `NatureOfInc` |
| M | 9 | Income taxable and offered in this return — Amount | integer (₹) | `IncTaxAmt` |
| N | 10 | Schedule where offered | dropdown (`DropdownFA_B`) | `IncTaxSch` |
| O | 11 | Item number of schedule | text | `IncTaxSchNo` |

### D · Any other Capital Asset — `DetailsOthAssets[]` (header row 91, cols rows 92–93, data rows 94–99)

*"Details of any other Capital Asset held (including any beneficial interest) at
any time during the relevant Calendar Year ending as on 31st December 2025."* As C,
but column 3 is **Nature of Asset** (`NatureOfAsset`) in place of the address, and
income is **Income derived from the asset** (`IncDrvAsset`).

| Col | # | Label (verbatim) | Type / enum | Schema key |
|---|---|---|---|---|
| E | 2(a) | Country Name and Code | dropdown (`Country_WithoutIndia`) | `CountryCodeExcludingIndia` + `CountryName` |
| F | 2(b) | Zip Code | text | `ZipCode` |
| G | 3 | Nature of Asset | text | `NatureOfAsset` |
| H | 4 | Ownership- Direct/ Beneficial owner/ Beneficiary | dropdown — DIRECT · BENEFICIAL_OWNER · BENIFICIARY | `Ownership` |
| I | 5 | Date of acquisition | date | `DateOfAcq` |
| J | 6 | Total Investment (at cost) (in rupees) | integer (₹) | `TotalInvestment` |
| K | 7 | Income derived from the asset | integer (₹) | `IncDrvAsset` |
| L | 8 | Nature of Income | text | `NatureOfInc` |
| M | 9 | Income taxable and offered in this return — Amount | integer (₹) | `IncTaxAmt` |
| N | 10 | Schedule where offered | dropdown (`DropdownFA_B`) | `IncTaxSch` |
| O | 11 | Item number of schedule | text | `IncTaxSchNo` |

### E · Accounts with signing authority — `DetailsOfAccntsHvngSigningAuth[]` (header row 107, cols rows 108–109, data rows 110–115)

*"Details of account(s) in which you have signing authority held (including any
beneficial interest) at any time during the relevant Calendar Year ending as on
31st December 2025 and which has not been included in A to D above."*

| Col | # | Label (verbatim) | Type / enum | Schema key |
|---|---|---|---|---|
| E | 2(a) | Name of the Institution in which the account is held | text | `NameOfInstitution` |
| F | 2(b) | Address of the Institution | text | `AddressOfInstitution` |
| G | 3(a) | Country Name and Code | dropdown (`Country_WithoutIndia`) | `CountryCodeExcludingIndia` + `CountryName` |
| H | 3(b) | Zip Code | text | `ZipCode` |
| I | 4 | Name of the account holder | text | `NameMentionedInAccnt` |
| J | 5 | Account Number | text | `InstitutionAccountNumber` |
| K | 6 | Peak Balance/Investment during the year (in rupees) | integer (₹) | `PeakBalanceOrInvestment` |
| L | 7 | Whether income accrued is taxable in your hands? | dropdown — Yes · No | `IncAccuredTaxFlag` |
| M | 8 | If (7) is yes, Income accrued in the account | integer (₹) | `IncAccuredInAcc` (optional) |
| N | 9 | If (7) is yes, Income offered in this return — Amount | integer (₹) | `IncOfferedAmt` (optional) |
| O | 10 | Schedule where offered | dropdown (`DropdownFA_B`) | `IncOfferedSch` (optional) |
| P | 11 | Item number of schedule | text | `IncOfferedSchNo` (optional) |

### F · Trusts outside India — `DetailsOfTrustOutIndiaTrustee[]` (header row 122, cols rows 123–124, data rows 125–130)

*"Details of trusts, created under the laws of a country outside India, in which
you are a trustee, beneficiary or settlor."*

| Col | # | Label (verbatim) | Type / enum | Schema key |
|---|---|---|---|---|
| E | 2(a) | Country Name and Code | dropdown (`Country_WithoutIndia`) | `CountryCodeExcludingIndia` + `CountryName` |
| F | 2(b) | Zip Code | text | `ZipCode` |
| G | 3(a) | Name of the trust | text | `NameOfTrust` |
| H | 3(b) | Address of the trust | text | `AddressOfTrust` |
| I | 4(a) | Name of trustees | text | `NameOfOtherTrustees` |
| J | 4(b) | Address of trustees | text | `AddressOfOtherTrustees` |
| K | 5(a) | Name of Settlor | text | `NameOfSettlor` |
| L | 5(b) | Address of Settlor | text | `AddressOfSettlor` |
| M | 6(a) | Name of Beneficiaries | text | `NameOfBeneficiaries` |
| N | 6(b) | Address of Beneficiaries | text | `AddressOfBeneficiaries` |
| O | 7 | Date since position held | date | `DateHeld` |
| P | 8 | Whether income derived is taxable in your hands? | dropdown — Yes · No | `IncDrvTaxFlag` |
| Q | 9 | If (8) is yes, Income derived in the account | integer (₹) | `IncDrvFromTrust` (optional) |
| R | 10 | If (8) is yes, Income offered in this return — Amount | integer (₹) | `IncOfferedAmt` (optional) |
| S | 11 | Schedule where offered | dropdown (`DropdownFA_B`) | `IncOfferedSch` (optional) |
| T | 12 | Item number of schedule | text | `IncOfferedSchNo` (optional) |

### G · Any other income from a source outside India — `DetailsOfOthSourcesIncOutsideIndia[]` (header row 134, cols rows 135–136, data rows 137–142)

*"Details of any other income derived from any source outside India which is not
included in,- (i) items A to F above and, (ii) income under the head business or
profession."*

| Col | # | Label (verbatim) | Type / enum | Schema key |
|---|---|---|---|---|
| E | 2(a) | Country Name and Code | dropdown (`Country_WithoutIndia`) | `CountryCodeExcludingIndia` + `CountryName` |
| F | 2(b) | Zip Code | text | `ZipCode` |
| G | 3(a) | Name of the person from whom derived | text | `NameOfPerson` |
| H | 3(b) | Address of the person from whom derived | text | `AddressOfPerson` |
| I | 4 | Income derived | integer (₹) | `IncDerived` (optional) |
| J | 5 | Nature of income | text | `NatureOfInc` |
| K | 6 | Whether taxable in your hands? | dropdown — Yes · No | `IncDrvTaxFlag` |
| L | 7 | If (6) is yes, Income offered in this return — Amount | integer (₹) | `IncOfferedAmt` (optional) |
| M | 8 | Schedule where offered | dropdown (`DropdownFA_B`) | `IncOfferedSch` (optional) |
| N | 9 | Item number of schedule | text | `IncOfferedSchNo` (optional) |

## The rules — FA

- **Calendar year** 1 January – 31 December 2025 for "held at any time" and for
  peak/closing balances (not the financial year).
- **Every table is unlimited** — several visible rows per table, a hidden `Total:`
  row, and the VBA adds more.
- **Values in rupees**, converted at the telegraphic-transfer buying rate on the
  relevant date (the instructions' rule; the utility does not convert).
- **Beneficial interest counts** — every header says *"including any beneficial
  interest"*.
- The first-row / name-of-institution / country-code notes are the key of the row:
  no entry there and the other columns are ignored.
- A resident with nothing to declare leaves FA out entirely; every table array is
  optional at the top level. **Not applicable for NRI.**

## What the schema marks mandatory (`ScheduleFA`)

All nine arrays are optional at the `ScheduleFA` level. Within a row that exists,
the required leaves are: the country name and code, the identifying/name/address
columns, the balance/value/date columns, and the status/nature dropdowns —
`Bankname`, `AddressOfBank`, `ZipCode`, `ForeignAccountNumber`, `OwnerStatus`,
`AccOpenDate`, `PeakBalanceDuringYear`, `ClosingBalance`, `IntrstAccured` (A1);
`FinancialInstName`, `FinancialInstAddress`, `ZipCode`, `AccountNumber`, `Status`,
`AccOpenDate`, `PeakBalanceDuringPeriod`, `ClosingBalance`, `NatureOfAmount`,
`GrossAmtPaidCredited` (A2); `NameOfEntity`, `AddressOfEntity`, `ZipCode`,
`NatureOfEntity`, `InterestAcquiringDate`, `InitialValOfInvstmnt`,
`PeakBalanceDuringPeriod`, `ClosingBalance`, `TotGrossAmtPaidCredited`,
`TotGrossProceeds` (A3); `FinancialInstName`, `FinancialInstAddress`, `ZipCode`,
`ContractDate`, `CashValOrSurrenderVal`, `TotGrossAmtPaidCredited` (A4); `ZipCode`,
`NatureOfEntity`, `NameOfEntity`, `AddressOfEntity`, `NatureOfInt`, `DateHeld`,
`TotalInvestment`, `IncFromInt`, `NatureOfInc`, `IncTaxAmt`, `IncTaxSch`,
`IncTaxSchNo` (B); `ZipCode`, `AddressOfProperty`, `Ownership`, `DateOfAcq`,
`TotalInvestment`, `IncDrvProperty`, `NatureOfInc`, `IncTaxAmt`, `IncTaxSch`,
`IncTaxSchNo` (C); `ZipCode`, `NatureOfAsset`, `Ownership`, `DateOfAcq`,
`TotalInvestment`, `IncDrvAsset`, `NatureOfInc`, `IncTaxAmt`, `IncTaxSch`,
`IncTaxSchNo` (D); `NameOfInstitution`, `AddressOfInstitution`, `ZipCode`,
`NameMentionedInAccnt`, `InstitutionAccountNumber`, `PeakBalanceOrInvestment`,
`IncAccuredTaxFlag` (E, with `IncAccuredInAcc`, `IncOfferedAmt`, `IncOfferedSch`,
`IncOfferedSchNo` optional); `ZipCode`, `NameOfTrust`, `AddressOfTrust`,
`NameOfOtherTrustees`, `AddressOfOtherTrustees`, `NameOfSettlor`, `AddressOfSettlor`,
`NameOfBeneficiaries`, `AddressOfBeneficiaries`, `DateHeld`, `IncDrvTaxFlag` (F,
with `IncDrvFromTrust`, `IncOfferedAmt`, `IncOfferedSch`, `IncOfferedSchNo`
optional); `ZipCode`, `NameOfPerson`, `AddressOfPerson`, `NatureOfInc`,
`IncDrvTaxFlag` (G, with `IncDerived`, `IncOfferedAmt`, `IncOfferedSch`,
`IncOfferedSchNo` optional).

## Cross-sheet feeds — FA

- **In (pointer only):** the "Schedule where offered" / "Item number of schedule"
  columns point at where the income already sits in the return — House Property,
  Business, Capital Gains, Other sources, Exempt Income, or "No Income during the
  year". FA adds no income.
- **Out:** nothing computed feeds another schedule; FA is a standalone disclosure.
  Export writes only the tables that have rows.

## What it means for the build

1. **FA (`ScheduleFA`)** — nine repeatable tables, every column, on the **calendar
   year**; the "where offered" columns pointing at a schedule and item number;
   export only the tables with rows.
2. **One country enum** — `Country_WithoutIndia` (code-NAME) seeds every country
   field on the sheet (A1/A2/A3/A4 and B/C/D/E/F/G).

---

## Appendix A — every live-row (non-hidden) label (verbatim)

```
r2   : [C2] (Note: If no entry is made in first row then other rows will not be considered)
r3   : [C3] FA  |  [D3] Details of Foreign Assets and Income from any source outside India
r4   : [D4] NOTE : This Schedule is not Applicable for NRI (Non Resident Indians) as per Residential Status
r5   : [C5] A1  |  [D5] Details of Foreign Depository Accounts held (including any beneficial interest) at any time during the relevant Calendar Year ending as on 31st December 2025
r6   : [D6] Sl. No. 1  |  [E6] Country Name and Code 2 and 3  |  [F6] Name of financial institution 4  |  [G6] Address of financial institution 5  |  [H6] ZIP Code 6  |  [I6] Account Number 7  |  [J6] Status 8  |  [K6] Account opening date 9  |  [L6] Peak Balance During the Period 10  |  [M6] Closing balance 11  |  [N6] Gross interest paid/credited to the account during the period 12
r19  : [C19] A2  |  [D19] Details of Foreign Custodial Accounts held (including any beneficial interest) at any time during the relevant Calendar Year ending as on 31st December 2025
r20  : [D20] Sl. No. 1  |  [E20] Country Name and Code 2 and 3  |  [F20] Name of financial institution 4  |  [G20] Address of financial institution 5  |  [H20] ZIP Code 6  |  [I20] Account Number 7  |  [J20] Status 8  |  [K20] Account opening date 9  |  [L20] Peak Balance During the Period 10  |  [M20] Closing balance 11  |  [N20] Gross amount paid/credited to the account during the period
r21  : [N21] Nature of Amount 12a  |  [O21] Amount 12b
r33  : [C33] A3  |  [D33] Details of Foreign Equity and Debt Interest held (including any beneficial interest) in any entity at any time during the relevant Calendar Year ending as on 31st December 2025
r34  : [D34] Sl. No. 1  |  [E34] Country Name and Code 2 and 3  |  [F34] Name of entity 4  |  [G34] Address of entity 5  |  [H34] ZIP Code 6  |  [I34] Nature of entity 7  |  [J34] Date of acquiring the interest 8  |  [K34] Initial value of the investment 9  |  [L34] Peak value of investment during the Period 10  |  [M34] Closing balance 11  |  [N34] Total gross amount paid/credited with respect to the holding during the period 12  |  [O34] Total gross proceeds from sale or redemption of investment during the period 13
r47  : [C47] A4  |  [D47] Details of Foreign Cash Value Insurance Contract or Annuity Contract held (including any beneficial interest) at any time during the relevant Calendar Year ending as on 31st December 2025
r48  : [D48] Sl. No. 1  |  [E48] Country Name and Code 2 and 3  |  [F48] Name of financial institution in which insurance contract held 4  |  [G48] Address of financial institution 5  |  [H48] ZIP Code 6  |  [I48] Date of contract 7  |  [J48] The cash value or surrender value of the contract 8  |  [K48] Total gross amount paid/credited with respect to the contract during the period. 9
r61  : [C61] B  |  [D61] Details of Financial Interest in any Entity held (including any beneficial interest) at any time during the relevant Calendar Year ending as on 31st December 2025
r62  : [D62] Sl. No 1  |  [E62] Country Name and Code 2(a)  |  [F62] Zip Code 2(b)  |  [G62] Nature of entity 3  |  [H62] Name of the Entity 4  |  [I62] Address of the Entity  |  [J62] Nature of Interest 5  |  [K62] Date since held 6  |  [L62] Total Investment (at cost) (in rupees) 7  |  [M62] Income accrued from such Interest 8  |  [N62] Nature of Income 9  |  [O62] Income taxable and offered in this return
r63  : [O63] Amount 10  |  [P63] Schedule where offered 11  |  [Q63] Item number of schedule 12
r76  : [C76] C  |  [D76] Details of immovable property held (including any beneficial interest) at any time during the relevant Calendar Year ending as on 31st December 2025
r77  : [D77] Sl. No 1  |  [E77] Country Name and Code 2(a)  |  [F77] Zip Code 2(b)  |  [G77] Address of the Property 3  |  [H77] Ownership- Direct/ Beneficial owner/ Beneficiary 4  |  [I77] Date of acquisition 5  |  [J77] Total Investment (at cost) (in rupees) 6  |  [K77] Income derived from the property 7  |  [L77] Nature of Income 8  |  [M77] Income taxable and offered in this return
r78  : [M78] Amount 9  |  [N78] Schedule where offered 10  |  [O78] Item number of schedule 11
r91  : [C91] D  |  [D91] Details of any other Capital Asset held (including any beneficial interest) at any time during the relevant Calendar Year ending as on 31st December 2025
r92  : [D92] Sl. No 1  |  [E92] Country Name and Code 2(a)  |  [F92] Zip Code 2(b)  |  [G92] Nature of Asset 3  |  [H92] Ownership- Direct/ Beneficial owner/ Beneficiary 4  |  [I92] Date of acquisition 5  |  [J92] Total Investment (at cost) (in rupees) 6  |  [K92] Income derived from the asset 7  |  [L92] Nature of Income 8  |  [M92] Income taxable and offered in this return
r93  : [M93] Amount 9  |  [N93] Schedule where offered 10  |  [O93] Item number of schedule 11
r107 : [C107] E  |  [D107] Details of account(s) in which you have signing authority held (including any beneficial interest) at any time during the relevant Calendar Year ending as on 31st December 2025 and which has not been included in A to D above.
r108 : [D108] Sl. No 1  |  [E108] Name of the Institution in which the account is held 2(a)  |  [F108] Address of the Institution 2(b)  |  [G108] Country Name and Code 3(a)  |  [H108] Zip Code 3(b)  |  [I108] Name of the account holder 4  |  [J108] Account Number 5  |  [K108] Peak Balance/Investment during the year (in rupees) 6  |  [L108] Whether income accrued is taxable in your hands? 7  |  [M108] If (7) is yes, Income accrued in the account 8  |  [N108] If (7) is yes, Income offered in this return
r109 : [N109] Amount 9  |  [O109] Schedule where offered 10  |  [P109] Item number of schedule 11
r122 : [C122] F  |  [D122] Details of trusts, created under the laws of a country outside India, in which you are a trustee, beneficiary or settlor
r123 : [D123] Sl. No 1  |  [E123] Country Name and Code 2(a)  |  [F123] Zip Code 2(b)  |  [G123] Name of the trust 3(a)  |  [H123] Address of the trust 3(b)  |  [I123] Name of trustees 4(a)  |  [J123] Address of trustees 4(b)  |  [K123] Name of Settlor 5(a)  |  [L123] Address of Settlor 5(b)  |  [M123] Name of Beneficiaries 6(a)  |  [N123] Address of Beneficiaries 6(b)  |  [O123] Date since position held 7  |  [P123] Whether income derived is taxable in your hands? 8  |  [Q123] If (8) is yes, Income derived in the account 9  |  [R123] If (8) is yes, Income offered in this return
r124 : [R124] Amount 10  |  [S124] Schedule where offered 11  |  [T124] Item number of schedule 12
r134 : [C134] G  |  [D134] Details of any other income derived from any source outside India which is not included in,- (i) items A to F above and, (ii) income under the head business or profession
r135 : [D135] Sl. No 1  |  [E135] Country Name and Code 2(a)  |  [F135] Zip Code 2(b)  |  [G135] Name of the person from whom derived 3(a)  |  [H135] Address of the person from whom derived 3(b)  |  [I135] Income derived 4  |  [J135] Nature of income 5  |  [K135] Whether taxable in your hands? 6  |  [L135] If (6) is yes, Income offered in this return
r136 : [L136] Amount 7  |  [M136] Schedule where offered 8  |  [N136] Item number of schedule 9
```

## Appendix B — every schema leaf of `ScheduleFA` (`*` = required within a row)

```
  DetailsForiegnBank[] array
* DetailsForiegnBank[].CountryName string
* DetailsForiegnBank[].CountryCodeExcludingIndia string
* DetailsForiegnBank[].Bankname string
* DetailsForiegnBank[].AddressOfBank string
* DetailsForiegnBank[].ZipCode string
* DetailsForiegnBank[].ForeignAccountNumber string
* DetailsForiegnBank[].OwnerStatus string
* DetailsForiegnBank[].AccOpenDate string
* DetailsForiegnBank[].PeakBalanceDuringYear integer
* DetailsForiegnBank[].ClosingBalance integer
* DetailsForiegnBank[].IntrstAccured integer
  DtlsForeignCustodialAcc[] array
* DtlsForeignCustodialAcc[].CountryName string
* DtlsForeignCustodialAcc[].CountryCodeExcludingIndia string
* DtlsForeignCustodialAcc[].FinancialInstName string
* DtlsForeignCustodialAcc[].FinancialInstAddress string
* DtlsForeignCustodialAcc[].ZipCode string
* DtlsForeignCustodialAcc[].AccountNumber string
* DtlsForeignCustodialAcc[].Status string
* DtlsForeignCustodialAcc[].AccOpenDate string
* DtlsForeignCustodialAcc[].PeakBalanceDuringPeriod integer
* DtlsForeignCustodialAcc[].ClosingBalance integer
* DtlsForeignCustodialAcc[].NatureOfAmount string
* DtlsForeignCustodialAcc[].GrossAmtPaidCredited integer
  DtlsForeignEquityDebtInterest[] array
* DtlsForeignEquityDebtInterest[].CountryName string
* DtlsForeignEquityDebtInterest[].CountryCodeExcludingIndia string
* DtlsForeignEquityDebtInterest[].NameOfEntity string
* DtlsForeignEquityDebtInterest[].AddressOfEntity string
* DtlsForeignEquityDebtInterest[].ZipCode string
* DtlsForeignEquityDebtInterest[].NatureOfEntity string
* DtlsForeignEquityDebtInterest[].InterestAcquiringDate string
* DtlsForeignEquityDebtInterest[].InitialValOfInvstmnt integer
* DtlsForeignEquityDebtInterest[].PeakBalanceDuringPeriod integer
* DtlsForeignEquityDebtInterest[].ClosingBalance integer
* DtlsForeignEquityDebtInterest[].TotGrossAmtPaidCredited integer
* DtlsForeignEquityDebtInterest[].TotGrossProceeds integer
  DtlsForeignCashValueInsurance[] array
* DtlsForeignCashValueInsurance[].CountryName string
* DtlsForeignCashValueInsurance[].CountryCodeExcludingIndia string
* DtlsForeignCashValueInsurance[].FinancialInstName string
* DtlsForeignCashValueInsurance[].FinancialInstAddress string
* DtlsForeignCashValueInsurance[].ZipCode string
* DtlsForeignCashValueInsurance[].ContractDate string
* DtlsForeignCashValueInsurance[].CashValOrSurrenderVal integer
* DtlsForeignCashValueInsurance[].TotGrossAmtPaidCredited integer
  DetailsFinancialInterest[] array
* DetailsFinancialInterest[].CountryName string
* DetailsFinancialInterest[].CountryCodeExcludingIndia string
* DetailsFinancialInterest[].ZipCode string
* DetailsFinancialInterest[].NatureOfEntity string
* DetailsFinancialInterest[].NameOfEntity string
* DetailsFinancialInterest[].AddressOfEntity string
* DetailsFinancialInterest[].NatureOfInt string
* DetailsFinancialInterest[].DateHeld string
* DetailsFinancialInterest[].TotalInvestment integer
* DetailsFinancialInterest[].IncFromInt integer
* DetailsFinancialInterest[].NatureOfInc string
* DetailsFinancialInterest[].IncTaxAmt integer
* DetailsFinancialInterest[].IncTaxSch string
* DetailsFinancialInterest[].IncTaxSchNo string
  DetailsImmovableProperty[] array
* DetailsImmovableProperty[].CountryName string
* DetailsImmovableProperty[].CountryCodeExcludingIndia string
* DetailsImmovableProperty[].ZipCode string
* DetailsImmovableProperty[].AddressOfProperty string
* DetailsImmovableProperty[].Ownership string
* DetailsImmovableProperty[].DateOfAcq string
* DetailsImmovableProperty[].TotalInvestment integer
* DetailsImmovableProperty[].IncDrvProperty integer
* DetailsImmovableProperty[].NatureOfInc string
* DetailsImmovableProperty[].IncTaxAmt integer
* DetailsImmovableProperty[].IncTaxSch string
* DetailsImmovableProperty[].IncTaxSchNo string
  DetailsOthAssets[] array
* DetailsOthAssets[].CountryName string
* DetailsOthAssets[].CountryCodeExcludingIndia string
* DetailsOthAssets[].ZipCode string
* DetailsOthAssets[].NatureOfAsset string
* DetailsOthAssets[].Ownership string
* DetailsOthAssets[].DateOfAcq string
* DetailsOthAssets[].TotalInvestment integer
* DetailsOthAssets[].IncDrvAsset integer
* DetailsOthAssets[].NatureOfInc string
* DetailsOthAssets[].IncTaxAmt integer
* DetailsOthAssets[].IncTaxSch string
* DetailsOthAssets[].IncTaxSchNo string
  DetailsOfAccntsHvngSigningAuth[] array
* DetailsOfAccntsHvngSigningAuth[].NameOfInstitution string
* DetailsOfAccntsHvngSigningAuth[].AddressOfInstitution string
* DetailsOfAccntsHvngSigningAuth[].CountryName string
* DetailsOfAccntsHvngSigningAuth[].CountryCodeExcludingIndia string
* DetailsOfAccntsHvngSigningAuth[].ZipCode string
* DetailsOfAccntsHvngSigningAuth[].NameMentionedInAccnt string
* DetailsOfAccntsHvngSigningAuth[].InstitutionAccountNumber string
* DetailsOfAccntsHvngSigningAuth[].PeakBalanceOrInvestment integer
* DetailsOfAccntsHvngSigningAuth[].IncAccuredTaxFlag string
  DetailsOfAccntsHvngSigningAuth[].IncAccuredInAcc integer
  DetailsOfAccntsHvngSigningAuth[].IncOfferedAmt integer
  DetailsOfAccntsHvngSigningAuth[].IncOfferedSch string
  DetailsOfAccntsHvngSigningAuth[].IncOfferedSchNo string
  DetailsOfTrustOutIndiaTrustee[] array
* DetailsOfTrustOutIndiaTrustee[].CountryName string
* DetailsOfTrustOutIndiaTrustee[].CountryCodeExcludingIndia string
* DetailsOfTrustOutIndiaTrustee[].ZipCode string
* DetailsOfTrustOutIndiaTrustee[].NameOfTrust string
* DetailsOfTrustOutIndiaTrustee[].AddressOfTrust string
* DetailsOfTrustOutIndiaTrustee[].NameOfOtherTrustees string
* DetailsOfTrustOutIndiaTrustee[].AddressOfOtherTrustees string
* DetailsOfTrustOutIndiaTrustee[].NameOfSettlor string
* DetailsOfTrustOutIndiaTrustee[].AddressOfSettlor string
* DetailsOfTrustOutIndiaTrustee[].NameOfBeneficiaries string
* DetailsOfTrustOutIndiaTrustee[].AddressOfBeneficiaries string
* DetailsOfTrustOutIndiaTrustee[].DateHeld string
* DetailsOfTrustOutIndiaTrustee[].IncDrvTaxFlag string
  DetailsOfTrustOutIndiaTrustee[].IncDrvFromTrust integer
  DetailsOfTrustOutIndiaTrustee[].IncOfferedAmt integer
  DetailsOfTrustOutIndiaTrustee[].IncOfferedSch string
  DetailsOfTrustOutIndiaTrustee[].IncOfferedSchNo string
  DetailsOfOthSourcesIncOutsideIndia[] array
* DetailsOfOthSourcesIncOutsideIndia[].CountryName string
* DetailsOfOthSourcesIncOutsideIndia[].CountryCodeExcludingIndia string
* DetailsOfOthSourcesIncOutsideIndia[].ZipCode string
* DetailsOfOthSourcesIncOutsideIndia[].NameOfPerson string
* DetailsOfOthSourcesIncOutsideIndia[].AddressOfPerson string
  DetailsOfOthSourcesIncOutsideIndia[].IncDerived integer
* DetailsOfOthSourcesIncOutsideIndia[].NatureOfInc string
* DetailsOfOthSourcesIncOutsideIndia[].IncDrvTaxFlag string
  DetailsOfOthSourcesIncOutsideIndia[].IncOfferedAmt integer
  DetailsOfOthSourcesIncOutsideIndia[].IncOfferedSch string
  DetailsOfOthSourcesIncOutsideIndia[].IncOfferedSchNo string
```

## Appendix C — dropdown values (verbatim)

### Status — A1/A2 (cells J8:J13, J22:J27)

```
(Select)
OWNER
BENEFICIAL_OWNER
BENIFICIARY
```

### Nature of Amount — A2 col 12a `SchFA_Nature` (cells N22:N27)

```
(Select)
Interest
Dividend
Proceeds from sale or redemption of financial assets
Other income
No amount paid/credited
```

### Nature of Interest (B) / Ownership (C, D) (cells J64:J69, H79:H84, H94:H99)

```
(Select)
DIRECT
BENEFICIAL_OWNER
BENIFICIARY
```

### Whether taxable in your hands? — E/F/G (cells L110:L115, P125:P130, K137:K142)

```
(Select)
Yes
No
```

### Schedule where offered — `DropdownFA_B` (B/C/D/E/F/G)

```
(Select)
House Property
Business
Capital Gains
Other sources
Exempt Income
No Income during the year
```

### Country/Region code — `Country_WithoutIndia` (every country field on the sheet)

India excluded. Format **`code-NAME`**, 250 entries (including the leading
`(Select)` and trailing `9999-OTHERS`):

```
(Select)
93-AFGHANISTAN
1001-ALAND ISLANDS
355-ALBANIA
213-ALGERIA
684-AMERICAN SAMOA
376-ANDORRA
244-ANGOLA
1264-ANGUILLA
1010-ANTARCTICA
1268-ANTIGUA AND BARBUDA
54-ARGENTINA
374-ARMENIA
297-ARUBA
61-AUSTRALIA
43-AUSTRIA
994-AZERBAIJAN
1242-BAHAMAS
973-BAHRAIN
880-BANGLADESH
1246-BARBADOS
375-BELARUS
32-BELGIUM
501-BELIZE
229-BENIN
1441-BERMUDA
975-BHUTAN
591-BOLIVIA (PLURINATIONAL STATE OF)
1002-BONAIRE, SINT EUSTATIUS AND SABA
387-BOSNIA AND HERZEGOVINA
267-BOTSWANA
1003-BOUVET ISLAND
55-BRAZIL
1014-BRITISH INDIAN OCEAN TERRITORY
673-BRUNEI DARUSSALAM
359-BULGARIA
226-BURKINA FASO
257-BURUNDI
238-CABO VERDE
855-CAMBODIA
237-CAMEROON
1-CANADA
1345-CAYMAN ISLANDS
236-CENTRAL AFRICAN REPUBLIC
235-CHAD
56-CHILE
86-CHINA
9-CHRISTMAS ISLAND
672-COCOS (KEELING) ISLANDS
57-COLOMBIA
270-COMOROS
242-CONGO
243-CONGO (DEMOCRATIC REPUBLIC OF THE)
682-COOK ISLANDS
506-COSTA RICA
225-COTE DIVOIRE
385-CROATIA
53-CUBA
1015-CURACAO
357-CYPRUS
420-CZECHIA
45-DENMARK
253-DJIBOUTI
1767-DOMINICA
1809-DOMINICAN REPUBLIC
593-ECUADOR
20-EGYPT
503-EL SALVADOR
240-EQUATORIAL GUINEA
291-ERITREA
372-ESTONIA
251-ETHIOPIA
500-FALKLAND ISLANDS (MALVINAS)
298-FAROE ISLANDS
679-FIJI
358-FINLAND
33-FRANCE
594-FRENCH GUIANA
689-FRENCH POLYNESIA
1004-FRENCH SOUTHERN TERRITORIES
241-GABON
220-GAMBIA
995-GEORGIA
49-GERMANY
233-GHANA
350-GIBRALTAR
30-GREECE
299-GREENLAND
1473-GRENADA
590-GUADELOUPE
1671-GUAM
502-GUATEMALA
1481-GUERNSEY
224-GUINEA
245-GUINEA-BISSAU
592-GUYANA
509-HAITI
1005-HEARD ISLAND AND MCDONALD ISLANDS
6-HOLY SEE
504-HONDURAS
852-HONG KONG
36-HUNGARY
354-ICELAND
62-INDONESIA
98-IRAN (ISLAMIC REPUBLIC OF)
964-IRAQ
353-IRELAND
1624-ISLE OF MAN
972-ISRAEL
5-ITALY
1876-JAMAICA
81-JAPAN
1534-JERSEY
962-JORDAN
7-KAZAKHSTAN
254-KENYA
686-KIRIBATI
850-KOREA (DEMOCRATIC PEOPLES REPUBLIC OF)
82-KOREA (REPUBLIC OF)
965-KUWAIT
996-KYRGYZSTAN
856-LAO PEOPLES DEMOCRATIC REPUBLIC
371-LATVIA
961-LEBANON
266-LESOTHO
231-LIBERIA
218-LIBYA
423-LIECHTENSTEIN
370-LITHUANIA
352-LUXEMBOURG
853-MACAO
389-MACEDONIA (THE FORMER YUGOSLAV REPUBLIC OF)
261-MADAGASCAR
265-MALAWI
60-MALAYSIA
960-MALDIVES
223-MALI
356-MALTA
692-MARSHALL ISLANDS
596-MARTINIQUE
222-MAURITANIA
230-MAURITIUS
269-MAYOTTE
52-MEXICO
691-MICRONESIA (FEDERATED STATES OF)
373-MOLDOVA (REPUBLIC OF)
377-MONACO
976-MONGOLIA
382-MONTENEGRO
1664-MONTSERRAT
212-MOROCCO
258-MOZAMBIQUE
95-MYANMAR
264-NAMIBIA
674-NAURU
977-NEPAL
31-NETHERLANDS
687-NEW CALEDONIA
64-NEW ZEALAND
505-NICARAGUA
227-NIGER
234-NIGERIA
683-NIUE
15-NORFOLK ISLAND
1670-NORTHERN MARIANA ISLANDS
47-NORWAY
968-OMAN
92-PAKISTAN
680-PALAU
970-PALESTINE, STATE OF
507-PANAMA
675-PAPUA NEW GUINEA
595-PARAGUAY
51-PERU
63-PHILIPPINES
1011-PITCAIRN
48-POLAND
14-PORTUGAL
1787-PUERTO RICO
974-QATAR
262-REUNION
40-ROMANIA
8-RUSSIAN FEDERATION
250-RWANDA
1006-SAINT BARTHELEMY
290-SAINT HELENA, ASCENSION AND TRISTAN DA CUNHA
1869-SAINT KITTS AND NEVIS
1758-SAINT LUCIA
1007-SAINT MARTIN (FRENCH PART)
508-SAINT PIERRE AND MIQUELON
1784-SAINT VINCENT AND THE GRENADINES
685-SAMOA
378-SAN MARINO
239-SAO TOME AND PRINCIPE
966-SAUDI ARABIA
221-SENEGAL
381-SERBIA
248-SEYCHELLES
232-SIERRA LEONE
65-SINGAPORE
1721-SINT MAARTEN (DUTCH PART)
421-SLOVAKIA
386-SLOVENIA
677-SOLOMON ISLANDS
252-SOMALIA
28-SOUTH AFRICA
1008-SOUTH GEORGIA AND THE SOUTH SANDWICH ISLANDS
211-SOUTH SUDAN
35-SPAIN
94-SRI LANKA
249-SUDAN
597-SURINAME
1012-SVALBARD AND JAN MAYEN
268-SWAZILAND
46-SWEDEN
41-SWITZERLAND
963-SYRIAN ARAB REPUBLIC
886-TAIWAN, PROVINCE OF CHINA[A]
992-TAJIKISTAN
255-TANZANIA, UNITED REPUBLIC OF
66-THAILAND
670-TIMOR-LESTE(EAST TIMOR)
228-TOGO
690-TOKELAU
676-TONGA
1868-TRINIDAD AND TOBAGO
216-TUNISIA
90-TURKEY
993-TURKMENISTAN
1649-TURKS AND CAICOS ISLANDS
688-TUVALU
256-UGANDA
380-UKRAINE
971-UNITED ARAB EMIRATES
44-UNITED KINGDOM OF GREAT BRITAIN AND NORTHERN IRELAND
2-UNITED STATES OF AMERICA
1009-UNITED STATES MINOR OUTLYING ISLANDS
598-URUGUAY
998-UZBEKISTAN
678-VANUATU
58-VENEZUELA (BOLIVARIAN REPUBLIC OF)
84-VIET NAM
1284-VIRGIN ISLANDS (BRITISH)
1340-VIRGIN ISLANDS (U.S.)
681-WALLIS AND FUTUNA
1013-WESTERN SAHARA
967-YEMEN
260-ZAMBIA
263-ZIMBABWE
9999-OTHERS
```
