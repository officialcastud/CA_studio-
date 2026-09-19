# The book of Schedules TR + FA — tax relief and foreign assets · ITR-6, A.Y. 2026-27

Read row by row from the utility's **TR_FA** sheet (`sheet57.xml`, 890 rows,
763 hidden — the two schedules TR and FA share one sheet; rows 7–255 are the
hidden country-name reference list for the TR dropdown), with the hidden-row
flags, and confirmed against the schema blocks **`ScheduleTR1`** and
**`ScheduleFA`** and the validation-rules document.

Two schedules on one sheet, two different jobs:

| Schedule | Question | Rows |
|---|---|---|
| **TR** | Summary of the relief claimed for tax paid outside India | 3–265 |
| **FA** | Every foreign asset held, and income from any source outside India | 267–380 |

> Both are *"available only in case of resident"* (TR) / applicable to a
> resident (FA). This is a company return; the residential status is the
> company's.

---

## Part A · Schedule TR — Summary of tax relief claimed (`ScheduleTR1`)

Row 4 (D4): **TR** — *"Summary of tax relief claimed for taxes paid outside
India(available only in case of resident)"*. Row 5 (D5): *"Details of Tax relief
claimed"*. Row 3 note (C3): *"(Note : If no entry is made in the Country/Region
Code column, then other columns will not be considered…)"* — the country code is
again the key of the row.

One row per country, **generated from Schedule FSI**.

### The items — the per-country table (row 6 headers)

| Sheet col | Item / lettering | Label (verbatim) | Type / enum | Schema key | Derivation | Hidden? |
|---|---|---|---|---|---|---|
| E | (a) | Country/Region Code (a) | dropdown — country list (`cmb_TRFA.Country`) | `CountryCodeExcludingIndia` (+ `CountryName`) | from FSI | rows 7–255 hidden (reference list) |
| F | (b) | Taxpayer Identification Number (b) | text, max 16 | `TaxIdentificationNo` | from FSI | no |
| G | (c) | Total taxes paid outside India (total of (c) of Schedule FSI in respect of each country) (c) | integer (₹), computed | `TaxPaidOutsideIndia` | sum of FSI col (c) for that country | no |
| H | (d) | Total tax relief available (total of (e) of Schedule FSI in respect of each country) (d) | integer (₹), computed | `TaxReliefOutsideIndia` | sum of FSI col (e) for that country | no |
| I | (e) | Section under which relief claimed (90, 90A or 91) (e) | dropdown — 90 · 90A · 91 | `ReliefClaimedUsSection` | typed | no |

### The four summary lines (rows 262–265)

| Row | Label (verbatim) | Type | Schema key | Derivation |
|---|---|---|---|---|
| 262 | Total Tax relief available in respect of Country/Region where DTAA is applicable (section 90/90A) | integer (₹), computed | `TaxReliefOutsideIndiaDTAA` | sum of (d) where section = 90 or 90A |
| 263 | Total Tax relief available in respect of Country/Region where DTAA is not applicable (section 91) | integer (₹), computed | `TaxReliefOutsideIndiaNotDTAA` | sum of (d) where section = 91 |
| 264 | Whether any tax paid outside India, on which tax relief was allowed in India, has been refunded/credited by the foreign tax authority during the year? | dropdown — YES · NO | `TaxPaidOutsideIndFlg` | typed |
| 265 (E) | Amount of tax refunded | integer (₹) | `AmtTaxRefunded` | typed when YES |
| 265 (G) | b) Assessment year in which tax relief allowed in India | text (AY) | `AssmtYrTaxRelief` | typed when YES |

Plus the block totals: `TotalTaxOutsideIndia` (total of column (c) across
countries) and `TotalTaxReliefOutsideIndia` (total of column (d) across
countries).

> **ITR-6 schema difference — read, do not port:** the grand total of taxes paid
> is `TotalTaxOutsideIndia` on this form (ITR-2 names it `TotalTaxPaidOutsideIndia`).
> Use this form's key.

### What the schema marks mandatory (`ScheduleTR1`)

`ScheduleTR[]` — required: `CountryName`, `CountryCodeExcludingIndia`,
`TaxIdentificationNo`, `TaxPaidOutsideIndia`, `TaxReliefOutsideIndia`
(`ReliefClaimedUsSection` optional). Block-level required: `TotalTaxOutsideIndia`,
`TotalTaxReliefOutsideIndia`, `TaxReliefOutsideIndiaDTAA`,
`TaxReliefOutsideIndiaNotDTAA`. Optional: `TaxPaidOutsideIndFlg`,
`AmtTaxRefunded`, `AssmtYrTaxRelief`.

### Cross-sheet feeds — TR

- **In:** columns (c) and (d) are the per-country totals of Schedule FSI's
  columns (c) and (e); TIN and country from FSI.
- **Out:** `TaxReliefOutsideIndiaDTAA` (90/90A) and `TaxReliefOutsideIndiaNotDTAA`
  (91) go to **Part B-TTI** as two separate relief lines. The refund flag
  (264/265) is a clawback: relief allowed earlier on foreign tax later refunded
  must be given up (the AY names when it was allowed).

---

## Part B · Schedule FA — foreign assets and income from any source outside India (`ScheduleFA`)

Row 267 (D267): **FA** — *"Schedule FA Details of foreign assets and Income from
any source outside India"*. Nine tables, A1–A4, B, C, D, E, F, G. Each table
ships four blank rows visible (e.g. rows 272–275) with a hidden `Total:` row; the
VBA adds more rows on demand — **every table is unlimited**.

Two things unlike an income schedule:

- **It runs on the calendar year.** The table headers say *"held … at any time
  during the calendar year"* (ending 31 December 2025) — peak and closing
  balances are for that period, not the financial year.
- **It is a disclosure, not an income schedule.** From table B onward each row
  asks whether the income is taxable in the company's hands and *where in this
  return it has been offered* — schedule and item number. FA does not add income;
  it points to where the income already is.

### A1 · Foreign Depository Accounts — `DetailsForiegnBank[]` (rows 269–270)

Header row 269: *"Details of Foreign Depository Accounts held (including any
beneficial interest) at any time during the [calendar year]"*.

| Col | # | Label (verbatim) | Type / enum | Schema key |
|---|---|---|---|---|
| E | 2 | Country/Region Name and Code | dropdown (`Country_WithoutIndia`, code-NAME) | `CountryCodeExcludingIndia` + `CountryName` |
| F | 3 | Name of financial institution | text, max 125 | `Bankname` |
| G | 4 | Address of financial institution | text, max 200 | `AddressOfBank` |
| H | 5 | ZIP Code | text, max 8 | `ZipCode` |
| I | 6 | Account Number | text, max 34 | `ForeignAccountNumber` |
| J | 7 | Status | dropdown — OWNER · BENEFICIAL_OWNER · BENEFICIARY | `OwnerStatus` |
| K | 8 | Account opening date | date DD/MM/YYYY | `AccOpenDate` |
| L | 9 | Peak Balance During the Period | integer (₹) | `PeakBalanceDuringYear` |
| M | 10 | Closing balance | integer (₹) | `ClosingBalance` |
| N | 11 | Gross interest paid/credited to the account during the period | integer (₹) | `IntrstAccured` |

### A2 · Foreign Custodial Accounts — `DtlsForeignCustodialAcc[]` (rows 278–280)

Header row 278: *"Details of Foreign Custodial Accounts held (including any
beneficial interest) at any time during the [calendar year]"*. Columns 2–10 as
A1, then:

| Col | # | Label (verbatim) | Type / enum | Schema key |
|---|---|---|---|---|
| F | 3 | Name of financial institution | text, max 125 | `FinancialInstName` |
| G | 4 | Address of financial institution | text, max 200 | `FinancialInstAddress` |
| I | 6 | Account Number | text, max 34 | `AccountNumber` |
| J | 7 | Status | dropdown — OWNER · BENEFICIAL_OWNER · BENEFICIARY | `Status` |
| L | 9 | Peak Balance During the Period | integer (₹) | `PeakBalanceDuringPeriod` |
| M | 10 | Closing balance | integer (₹) | `ClosingBalance` |
| N | 11 | Gross amount paid/credited to the account during the period | integer (₹) | `GrossAmtPaidCredited` |
| N | 11a | Nature | dropdown (`SchFA_Nature`) | `NatureOfAmount` |
| O | 11b | Amount | integer (₹) | (the amount for `GrossAmtPaidCredited`) |

`ZipCode`, `AccOpenDate`, `CountryName`, `CountryCodeExcludingIndia` as A1.

### A3 · Foreign Equity and Debt Interest — `DtlsForeignEquityDebtInterest[]` (rows 287–288)

Header row 287: *"Details of Foreign Equity and Debt Interest held (including any
beneficial interest) in any entity [during the calendar year]"*.

| Col | # | Label (verbatim) | Type / enum | Schema key |
|---|---|---|---|---|
| E | 2 | Country/Region Name and Code | dropdown (`Country_WithoutIndia`) | `CountryCodeExcludingIndia` + `CountryName` |
| F | 3 | Name of entity | text | `NameOfEntity` |
| G | 4 | Address of entity | text | `AddressOfEntity` |
| H | 5 | ZIP Code | text | `ZipCode` |
| I | 6 | Nature of entity | text | `NatureOfEntity` |
| J | 7 | Date of acquiring the interest | date | `InterestAcquiringDate` |
| K | 8 | Initial value of the investment | integer (₹) | `InitialValOfInvstmnt` |
| L | 9 | Peak value of investment during the period | integer (₹) | `PeakBalanceDuringPeriod` |
| M | 10 | Closing balance value | integer (₹) | `ClosingBalance` |
| N | 11 | Total gross amount paid/credited with respect to the holding during the period | integer (₹) | `TotGrossAmtPaidCredited` |
| O | 12 | Total gross proceeds from sale or redemption of investment during the period | integer (₹) | `TotGrossProceeds` |

### A4 · Foreign Cash Value Insurance / Annuity Contract — `DtlsForeignCashValueInsurance[]` (rows 296–297)

Header row 296: *"Details of Foreign Cash Value Insurance Contract or Annuity
Contract held (including any beneficial [interest] …)"*.

| Col | # | Label (verbatim) | Type / enum | Schema key |
|---|---|---|---|---|
| E | 2 | Country/Region Name and Code | dropdown (`Country_WithoutIndia`) | `CountryCodeExcludingIndia` + `CountryName` |
| F | 3 | Name of financial institution in which insurance contract held | text | `FinancialInstName` |
| G | 4 | Address of financial institution | text | `FinancialInstAddress` |
| H | 5 | ZIP Code | text | `ZipCode` |
| I | 6 | Date of contract | date | `ContractDate` |
| J | 7 | The cash value or surrender value of the contract | integer (₹) | `CashValOrSurrenderVal` |
| K | 8 | Total gross amount paid/credited with respect to the contract during the period. | integer (₹) | `TotGrossAmtPaidCredited` |

### B · Financial Interest in any Entity — `DetailsFinancialInterest[]` (rows 305–307)

Header row 305: *"Details of Financial Interest in any Entity held (including any
beneficial interest) at any time during [the calendar year]"*.

| Col | # | Label (verbatim) | Type / enum | Schema key |
|---|---|---|---|---|
| E | 2(a) | Country/Region Name and Code | dropdown (`cmb_TRFA.Country`, NAME:code) | `CountryCodeExcludingIndia` + `CountryName` |
| F | 2(b) | Zip Code | text | `ZipCode` |
| G | 3 | Nature of entity | text | `NatureOfEntity` (optional) |
| H | 4(a) | Name of the Entity | text | `NameOfEntity` |
| I | 4(b) | Address of the Entity | text | `AddressOfEntity` |
| J | 5 | Nature of Interest | dropdown — DIRECT · BENEFICIAL_OWNER · BENEFICIARY | `NatureOfInt` |
| K | 6 | Date since held | date | `DateHeld` |
| L | 7 | Total Investment (at cost) (in rupees) | integer (₹) | `TotalInvestment` |
| M | 8 | Income accrued from such Interest | integer (₹) | `IncFromInt` |
| N | 9 | Nature of Income | text | `NatureOfInc` |
| O | 10 | Income taxable and offered in this return — Amount | integer (₹) | `IncTaxAmt` |
| P | 11 | Schedule where offered | dropdown (`SchFA_ScheduleOffered`) | `IncTaxSch` |
| Q | 12 | Item number of schedule | text | `IncTaxSchNo` |

### C · Immovable property — `DetailsImmovableProperty[]` (rows 318–320)

Header row 318: *"Details of immovable property held (including any beneficial
interest) at any time during the calend[ar year]"*.

| Col | # | Label (verbatim) | Type / enum | Schema key |
|---|---|---|---|---|
| E | 2(a) | Country/Region Name and Code | dropdown (`cmb_TRFA.Country`) | `CountryCodeExcludingIndia` + `CountryName` |
| F | 2(b) | Zip Code | text | `ZipCode` |
| G | 3 | Address of the Property | text | `AddressOfProperty` (optional) |
| H | 4 | Ownership- Direct/ Beneficial owner/ Beneficiary | dropdown — DIRECT · BENEFICIAL_OWNER · BENEFICIARY | `Ownership` |
| I | 5 | Date of acquisition | date | `DateOfAcq` |
| J | 6 | Total Investment (at cost) (in rupees) | integer (₹) | `TotalInvestment` |
| K | 7 | Income derived from the property | integer (₹) | `IncDrvProperty` |
| L | 8 | Nature of Income | text | `NatureOfInc` |
| M | 9 | Income taxable and offered in this return — Amount | integer (₹) | `IncTaxAmt` |
| N | 10 | Schedule where offered | dropdown (`SchFA_ScheduleOffered`) | `IncTaxSch` |
| O | 11 | Item number of schedule | text | `IncTaxSchNo` |

### D · Any other Capital Asset — `DetailsOthAssets[]` (rows 331–333)

Header row 331: *"Details of any other Capital Asset held (including any
beneficial interest) at any time during the c[alendar year]"*. As C, but column 3
is **Nature of Asset** (`NatureOfAsset`) in place of the address, and income is
**Income derived from the asset** (`IncDrvAsset`). Ownership dropdown DIRECT ·
BENEFICIAL_OWNER · BENEFICIARY; schedule-offered and item number as C
(`IncTaxAmt`, `IncTaxSch`, `IncTaxSchNo`).

### E · Accounts with signing authority — `DetailsOfAccntsHvngSigningAuth[]` (rows 344–346)

Header row 344: *"Details of account(s) in which you have signing authority held
(including any beneficial interest) [during the calendar year]"* — accounts not
already in A to D.

| Col | # | Label (verbatim) | Type / enum | Schema key |
|---|---|---|---|---|
| E | 2 | Name of the Institution in which the account is held (Note : If no entry is made in this column, the other columns will not be considered) | text | `NameOfInstitution` |
| F | 3(a) | Address of the Institution | text | `AddressOfInstitution` |
| G | 3(b) | Country/Region Name & Code | dropdown (`cmb_TRFA.Country`) | `CountryCodeExcludingIndia` + `CountryName` |
| H | 3(c) | Zip Code | text | `ZipCode` |
| I | 4 | Name of the Account Holder | text | `NameMentionedInAccnt` |
| J | 5 | Account Number | text | `InstitutionAccountNumber` |
| K | 6 | Peak Balance/Investment / during the year (in rupees) | integer (₹) | `PeakBalanceOrInvestment` |
| L | 7 | Whether income accrued is taxable in your hands? | dropdown — Yes · No | `IncAccuredTaxFlag` |
| M | 8 | If (7) is yes, Income accrued in the account | integer (₹) | `IncAccuredInAcc` (optional) |
| N | 9 | If (7) is yes, Income offered in this return — Amount | integer (₹) | `IncOfferedAmt` (optional) |
| O | 10 | Schedule where offered | dropdown (`SchFA_ScheduleOffered`) | `IncOfferedSch` (optional) |
| P | 11 | Item number of schedule | text | `IncOfferedSchNo` (optional) |

### F · Trusts outside India — `DetailsOfTrustOutIndiaTrustee[]` (rows 358–360)

Header row 358: *"Details of trusts, created under the laws of a Country/Region
outside India, in which you are a trus[tee, beneficiary or settlor]"*.

| Col | # | Label (verbatim) | Type / enum | Schema key |
|---|---|---|---|---|
| E | 2(a) | Country/Region Name & Code | dropdown (`cmb_TRFA.Country`) | `CountryCodeExcludingIndia` + `CountryName` |
| F | 2(b) | Zip Code | text | `ZipCode` |
| G | 3 | Name of the trust | text | `NameOfTrust` |
| H | 3(a) | Address of the trust | text | `AddressOfTrust` |
| I | 4 | Name of trustees | text | `NameOfOtherTrustees` |
| J | 4(a) | Address of trustees | text | `AddressOfOtherTrustees` |
| K | 5 | Name of Settlor | text | `NameOfSettlor` |
| L | 5(a) | Address of Settlor | text | `AddressOfSettlor` |
| M | 6 | Name of Beneficiaries | text | `NameOfBeneficiaries` |
| N | 6(a) | Address of Beneficiaries | text | `AddressOfBeneficiaries` |
| O | 7 | Date since position held | date | `DateHeld` |
| P | 8 | Whether income derived is taxable in your hands? | dropdown — Yes · No | `IncDrvTaxFlag` |
| Q | 9 | If (8) is yes, Income derived from the trust | integer (₹) | `IncDrvFromTrust` (optional) |
| R | 10 | If (8) is yes, Income offered in this return — Amount | integer (₹) | `IncOfferedAmt` (optional) |
| S | 11 | Schedule where offered | dropdown (`SchFA_ScheduleOffered`) | `IncOfferedSch` (optional) |
| T | 12 | Item number of schedule | text | `IncOfferedSchNo` (optional) |

### G · Any other income from a source outside India — `DetailsOfOthSourcesIncOutsideIndia[]` (rows 369–371)

Header row 369: *"Details of any other income derived from any source outside
India which is not included in,- (i) ite[ms A to F …]"* and not under a business
head.

| Col | # | Label (verbatim) | Type / enum | Schema key |
|---|---|---|---|---|
| E | 2(a) | Country/Region Name & Code | dropdown (`cmb_TRFA.Country`) | `CountryCodeExcludingIndia` + `CountryName` |
| F | 2(b) | Zip Code | text | `ZipCode` |
| G | 3(a) | Name of the person from whom derived | text | `NameOfPerson` |
| H | 3(b) | Address of the person from whom derived | text | `AddressOfPerson` |
| I | 4 | Income derived | integer (₹) | `IncDerived` (optional) |
| J | 5 | Nature of income | text | `NatureOfInc` |
| K | 6 | Whether taxable in your hands? | dropdown — Yes · No | `IncDrvTaxFlag` |
| L | 7 | If (6) is yes, Income offered in this return — Amount | integer (₹) | `IncOfferedAmt` (optional) |
| M | 8 | Schedule where offered | dropdown (`SchFA_ScheduleOffered`) | `IncOfferedSch` (optional) |
| N | 9 | Item number of schedule | text | `IncOfferedSchNo` (optional) |

Closing note (row 380): *"Note:- Please refer to the instructions for filling out
this schedule"*.

### The rules — FA

- **Calendar year** 1 January – 31 December 2025 for "held at any time" and for
  peak/closing balances (not the financial year).
- **Every table is unlimited** — four visible rows per table, a hidden `Total:`
  row, and the VBA adds more.
- **Values in rupees**, converted at the telegraphic-transfer buying rate on the
  relevant date (the instructions' rule; the utility does not convert).
- **Beneficial interest counts** — every header says *"including any beneficial
  interest"*.
- The `NameOfInstitution` note on E and the country-code notes are the key of the
  row: no entry there and the other columns are ignored.
- A resident with nothing to declare leaves FA out entirely; every table array is
  optional at the top level.

### What the schema marks mandatory (`ScheduleFA`)

All nine arrays are optional at the `ScheduleFA` level. Within a row that exists,
the required leaves are: the country name and code, the identifying/name/address
columns, the balance/value/date columns, and the status/nature dropdowns —
`Bankname`, `AddressOfBank`, `ForeignAccountNumber`, `OwnerStatus`,
`PeakBalanceDuringYear`, `ClosingBalance`, `IntrstAccured` (A1);
`FinancialInstName`, `FinancialInstAddress`, `AccountNumber`, `Status`,
`PeakBalanceDuringPeriod`, `GrossAmtPaidCredited`, `NatureOfAmount` (A2);
`NameOfEntity`, `AddressOfEntity`, `NatureOfEntity`, `InterestAcquiringDate`,
`InitialValOfInvstmnt`, `TotGrossAmtPaidCredited`, `TotGrossProceeds` (A3);
`ContractDate`, `CashValOrSurrenderVal` (A4); `NatureOfInt`, `DateHeld`,
`TotalInvestment`, `IncFromInt`, `NatureOfInc`, `IncTaxAmt`, `IncTaxSch`,
`IncTaxSchNo` (B); `Ownership`, `DateOfAcq`, `IncDrvProperty` (C);
`NatureOfAsset`, `IncDrvAsset` (D); `NameOfInstitution`, `AddressOfInstitution`,
`NameMentionedInAccnt`, `InstitutionAccountNumber`, `PeakBalanceOrInvestment`,
`IncAccuredTaxFlag` (E); `NameOfTrust`, `AddressOfTrust`, `NameOfOtherTrustees`,
`AddressOfOtherTrustees`, `NameOfSettlor`, `AddressOfSettlor`,
`NameOfBeneficiaries`, `AddressOfBeneficiaries`, `IncDrvTaxFlag` (F);
`NameOfPerson`, `AddressOfPerson`, `NatureOfInc`, `IncDrvTaxFlag` (G). The
"where offered" leaves are required in B/C/D (`IncTaxSch`, `IncTaxSchNo`) and
optional in E/F/G (`IncOfferedSch`, `IncOfferedSchNo`).

### Cross-sheet feeds — FA

- **In (pointer only):** the "Schedule where offered" / "Item number of schedule"
  columns point at where the income already sits in the return — House Property,
  Business, Capital Gains, Other Sources, Exempt Income, or "No Income during the
  year". FA adds no income.
- **Out:** nothing computed feeds another schedule; FA is a standalone
  disclosure. Export writes only the tables that have rows.

---

## What this means for the build

1. **TR** — generated from FSI, one row per country: country + TIN from FSI, (c)
   and (d) the per-country FSI totals, the 90/90A/91 dropdown, then the two DTAA
   totals (`TaxReliefOutsideIndiaDTAA`, `TaxReliefOutsideIndiaNotDTAA`) and the
   grand totals (`TotalTaxOutsideIndia`, `TotalTaxReliefOutsideIndia`); the
   YES/NO refund clawback with amount and AY. The two DTAA totals feed Part
   B-TTI. **Use `TotalTaxOutsideIndia`, not the ITR-2 key.**
2. **FA** — nine repeatable tables, every column, on the **calendar year**; the
   "where offered" columns pointing at a schedule and item number; export only
   the tables with rows.
3. Note the two distinct country-code enums: **`cmb_TRFA.Country`** (NAME:code) on
   TR and FA tables B/C/D/E/F/G, and **`Country_WithoutIndia`** (code-NAME) on FA
   tables A1/A2/A3/A4 — the same countries, two string formats; seed each field
   from its own list.

---

## Enums

### FA nature of amount — `SchFA_Nature` (A2 col 11a)

`(Select)` · Interest · Dividend · Proceeds from sale or redemption of financial assets · Other income · No Amount paid/credited

### FA schedule where offered — `SchFA_ScheduleOffered` (B/C/D/E/F/G)

`(Select)` · House Property · Business · Capital Gains · Other Sources · Exempt
Income · No Income during the year

### Section under which relief claimed — TR col (e), cells I7:I255

`(Select)` · 90 · 90A · 91

### Status / ownership dropdowns

- A1/A2 **Status** — `(Select)` · OWNER · BENEFICIAL_OWNER · BENEFICIARY
- B **Nature of Interest**, C/D **Ownership** — `(Select)` · DIRECT ·
  BENEFICIAL_OWNER · BENEFICIARY

### Yes/No flags

- TR refund flag (J264) — `(Select)` · YES · NO
- FA "taxable in your hands?" (E/F/G) — `(Select)` · Yes · No

### Country/Region code — `cmb_TRFA.Country` (TR col (a); FA B/C/D/E/F/G)

India excluded. Format **`NAME:code`**, 249 countries plus `(Select)` and
`OTHERS:9999`:


```
(Select)
AFGHANISTAN:93
ALAND ISLANDS:1001
ALBANIA:355
ALGERIA:213
AMERICAN SAMOA:684
ANDORRA:376
ANGOLA:244
ANGUILLA:1264
ANTARCTICA:1010
ANTIGUA AND BARBUDA:1268
ARGENTINA:54
ARMENIA:374
ARUBA:297
AUSTRALIA:61
AUSTRIA:43
AZERBAIJAN:994
BAHAMAS:1242
BAHRAIN:973
BANGLADESH:880
BARBADOS:1246
BELARUS:375
BELGIUM:32
BELIZE:501
BENIN:229
BERMUDA:1441
BHUTAN:975
BOLIVIA (PLURINATIONAL STATE OF):591
BONAIRE, SINT EUSTATIUS AND SABA:1002
BOSNIA AND HERZEGOVINA:387
BOTSWANA:267
BOUVET ISLAND:1003
BRAZIL:55
BRITISH INDIAN OCEAN TERRITORY:1014
BRUNEI DARUSSALAM:673
BULGARIA:359
BURKINA FASO:226
BURUNDI:257
CABO VERDE:238
CAMBODIA:855
CAMEROON:237
CANADA:1
CAYMAN ISLANDS:1345
CENTRAL AFRICAN REPUBLIC:236
CHAD:235
CHILE:56
CHINA:86
CHRISTMAS ISLAND:9
COCOS (KEELING) ISLANDS:672
COLOMBIA:57
COMOROS:270
CONGO:242
CONGO (DEMOCRATIC REPUBLIC OF THE):243
COOK ISLANDS:682
COSTA RICA:506
COTE DIVOIRE:225
CROATIA:385
CUBA:53
CURACAO:1015
CYPRUS:357
CZECHIA:420
DENMARK:45
DJIBOUTI:253
DOMINICA:1767
DOMINICAN REPUBLIC:1809
ECUADOR:593
EGYPT:20
EL SALVADOR:503
EQUATORIAL GUINEA:240
ERITREA:291
ESTONIA:372
ETHIOPIA:251
FALKLAND ISLANDS (MALVINAS):500
FAROE ISLANDS:298
FIJI:679
FINLAND:358
FRANCE:33
FRENCH GUIANA:594
FRENCH POLYNESIA:689
FRENCH SOUTHERN TERRITORIES:1004
GABON:241
GAMBIA:220
GEORGIA:995
GERMANY:49
GHANA:233
GIBRALTAR:350
GREECE:30
GREENLAND:299
GRENADA:1473
GUADELOUPE:590
GUAM:1671
GUATEMALA:502
GUERNSEY:1481
GUINEA:224
GUINEA-BISSAU:245
GUYANA:592
HAITI:509
HEARD ISLAND AND MCDONALD ISLANDS:1005
HOLY SEE:6
HONDURAS:504
HONG KONG:852
HUNGARY:36
ICELAND:354
INDONESIA:62
IRAN (ISLAMIC REPUBLIC OF):98
IRAQ:964
IRELAND:353
ISLE OF MAN:1624
ISRAEL:972
ITALY:5
JAMAICA:1876
JAPAN:81
JERSEY:1534
JORDAN:962
KAZAKHSTAN:7
KENYA:254
KIRIBATI:686
KOREA (DEMOCRATIC PEOPLES REPUBLIC OF):850
KOREA (REPUBLIC OF):82
KUWAIT:965
KYRGYZSTAN:996
LAO PEOPLES DEMOCRATIC REPUBLIC:856
LATVIA:371
LEBANON:961
LESOTHO:266
LIBERIA:231
LIBYA:218
LIECHTENSTEIN:423
LITHUANIA:370
LUXEMBOURG:352
MACAO:853
MACEDONIA (THE FORMER YUGOSLAV REPUBLIC OF):389
MADAGASCAR:261
MALAWI:265
MALAYSIA:60
MALDIVES:960
MALI:223
MALTA:356
MARSHALL ISLANDS:692
MARTINIQUE:596
MAURITANIA:222
MAURITIUS:230
MAYOTTE:269
MEXICO:52
MICRONESIA (FEDERATED STATES OF):691
MOLDOVA (REPUBLIC OF):373
MONACO:377
MONGOLIA:976
MONTENEGRO:382
MONTSERRAT:1664
MOROCCO:212
MOZAMBIQUE:258
MYANMAR:95
NAMIBIA:264
NAURU:674
NEPAL:977
NETHERLANDS:31
NEW CALEDONIA:687
NEW ZEALAND:64
NICARAGUA:505
NIGER:227
NIGERIA:234
NIUE:683
NORFOLK ISLAND:15
NORTHERN MARIANA ISLANDS:1670
NORWAY:47
OMAN:968
PAKISTAN:92
PALAU:680
PALESTINE, STATE OF:970
PANAMA:507
PAPUA NEW GUINEA:675
PARAGUAY:595
PERU:51
PHILIPPINES:63
PITCAIRN:1011
POLAND:48
PORTUGAL:14
PUERTO RICO:1787
QATAR:974
REUNION:262
ROMANIA:40
RUSSIAN FEDERATION:8
RWANDA:250
SAINT BARTHELEMY:1006
SAINT HELENA, ASCENSION AND TRISTAN DA CUNHA:290
SAINT KITTS AND NEVIS:1869
SAINT LUCIA:1758
SAINT MARTIN (FRENCH PART):1007
SAINT PIERRE AND MIQUELON:508
SAINT VINCENT AND THE GRENADINES:1784
SAMOA:685
SAN MARINO:378
SAO TOME AND PRINCIPE:239
SAUDI ARABIA:966
SENEGAL:221
SERBIA:381
SEYCHELLES:248
SIERRA LEONE:232
SINGAPORE:65
SINT MAARTEN (DUTCH PART):1721
SLOVAKIA:421
SLOVENIA:386
SOLOMON ISLANDS:677
SOMALIA:252
SOUTH AFRICA:28
SOUTH GEORGIA AND THE SOUTH SANDWICH ISLANDS:1008
SOUTH SUDAN:211
SPAIN:35
SRI LANKA:94
SUDAN:249
SURINAME:597
SVALBARD AND JAN MAYEN:1012
SWAZILAND:268
SWEDEN:46
SWITZERLAND:41
SYRIAN ARAB REPUBLIC:963
TAIWAN, PROVINCE OF CHINA[A]:886
TAJIKISTAN:992
TANZANIA, UNITED REPUBLIC OF:255
THAILAND:66
TIMOR-LESTE(EAST TIMOR):670
TOGO:228
TOKELAU:690
TONGA:676
TRINIDAD AND TOBAGO:1868
TUNISIA:216
TURKEY:90
TURKMENISTAN:993
TURKS AND CAICOS ISLANDS:1649
TUVALU:688
UGANDA:256
UKRAINE:380
UNITED ARAB EMIRATES:971
UNITED KINGDOM OF GREAT BRITAIN AND NORTHERN IRELAND:44
UNITED STATES OF AMERICA:2
UNITED STATES MINOR OUTLYING ISLANDS:1009
URUGUAY:598
UZBEKISTAN:998
VANUATU:678
VENEZUELA (BOLIVARIAN REPUBLIC OF):58
VIET NAM:84
VIRGIN ISLANDS (BRITISH):1284
VIRGIN ISLANDS (U.S.):1340
WALLIS AND FUTUNA:681
WESTERN SAHARA:1013
YEMEN:967
ZAMBIA:260
ZIMBABWE:263
OTHERS:9999
```

### Country/Region code — `Country_WithoutIndia` (FA A1/A2/A3/A4)

India excluded. Format **`code-NAME`**, 249 countries plus `(Select)` and `9999-OTHERS`:

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
886-TAIWAN
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
