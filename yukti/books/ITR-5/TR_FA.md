# TR_FA — Schedule TR1 (tax relief for tax paid outside India) + Schedule FA (foreign assets)

Sheet `TR_FA` of ITR-5 (A.Y. 2026-27). Section `foreign`. Two schema blocks: **ScheduleTR1** and **ScheduleFA** (per `books/ITR-5/section_map.json`).

Every cell reference, label, formula, dropdown and schema key below is quoted from `tools/dump.py` (rows / `--formulas` / `--dropdowns` / `--schema` / `--leaves`), from `books/ITR-5/rules.json`, and from `sources/ITR-5/vba_text.txt`. Nothing here is from memory.

---

## The shape

The sheet holds **two independent schedules stacked in one tab**:

- **Rows 3–15 = Schedule TR (block `ScheduleTR1`)** — "TR | Details Summary of tax relief claimed for Taxes Paid outside India (available only in case of resident)" (C4/D4). One repeating table (rows 7–8, extendable) of per-country tax paid / relief claimed outside India u/s 90/90A/91, four computed totals (rows 11–13), and a refund sub-question (rows 14–15). **Applies to residents only** (rule 774: "Schedule TR is not applicable for non resident").
- **Rows 17–121 = Schedule FA (block `ScheduleFA`)** — "Schedule FA | Details of Foreign Assets and Income from any source outside India" (C17/E17). **Ten** repeating tables, one per foreign-asset class (A1, A2, A3, A4, B, C, D, E, F, G), each keyed to a period "the calendar year ending as on 31st December, 2025". Mandatory when residency triggers it (rules 777, 840 — see Mandatory).

Note carried at C3: *"(Note : If no entry is made in the Country Code column, then other columns will not be considered for that row)"* — the Country Code cell is the row's gate; VBA (`vba_text.txt` §12149) makes `CountryName at Sr. No. … in Sheet TR_FA is mandatory`.

Both schedules feed Part B-TTI: rule 826 "6a Section 90/90A = sl.no.2 in Schedule TR", rule 827 "6b Section 91 = sl.no.3 in Schedule TR", rule 828 "6c Total = 90/90A + 91"; rule 777/840 "If sl.no.17 in Part B-TTI is Yes, Schedule FA is mandatory".

---

## BLOCK 1 — Schedule TR (`ScheduleTR1`)

### The items

**Repeating per-country table** (schema array `ScheduleTR[]`; sheet rows 7, 8 = SrNo D7, D8=`D7+1`, extendable). Header row 6.

| Sheet col / label (row 6) | Field | Type | Schema key | Rule / source |
|---|---|---|---|---|
| E — "Country Code (a)" | Country (name + code) | string | `ScheduleTR[].CountryName` **+** `ScheduleTR[].CountryCodeExcludingIndia` | Both required. E7 validation `source "0"` (typed entry, **not** a combobox). VBA: CountryName mandatory; "Country code as per schedule FSI and country code as per schedule TR does not match" (§12149/§12156) |
| F — "Tax Identification number (b)" | TIN | string | `ScheduleTR[].TaxIdentificationNo` | required (maxLength 75). VBA `TR_TIN` mandatory |
| G — "Total taxes paid outside India (total of ( c) of Schedule FSI in respect of each country) (c)" | Tax paid outside India | integer | `ScheduleTR[].TaxPaidOutsideIndia` | required, 0…99999999999999. Rule 775: Col c = total of Col C of Schedule FSI per country |
| H — "Total tax relief available (total of (e) of Schedule FSI in respect of each country) (d)" | Tax relief available | integer | `ScheduleTR[].TaxReliefOutsideIndia` | required, 0…99999999999999. Rule 776: Col d = total of Col e of Schedule FSI per country; rule 764: FSI relief = lower of tax paid abroad or tax payable |
| I — "Section under which relief claimed (specify 90, 90A or 91) (e)" | Section | string | `ScheduleTR[].ReliefClaimedUsSection` | optional; dropdown `(Select),90,90A,91` (I7:I8) |

**Total / summary lines (one figure each):**

| Sheet ref | Label | Field | Type | Schema key |
|---|---|---|---|---|
| F11/G11 | "Total" → Total taxes paid outside India | Total tax paid | integer | `TotalTaxOutsideIndia` (required) |
| H11 | Total tax relief available | Total relief | integer | `TotalTaxReliefOutsideIndia` (required) |
| E12/J12 | "Total Tax relief available in respect of country where DTAA is applicable (section 90/90A) (Part of total of 1(d))" | Relief where DTAA applies | integer | `TaxReliefOutsideIndiaDTAA` (required) |
| E13/J13 | "Total Tax relief available in respect of country where DTAA is not applicable (section 91) (Part of total of 1(d))" | Relief where DTAA does not apply | integer | `TaxReliefOutsideIndiaNotDTAA` (required) |
| E14/J14 | "Whether any tax paid outside India, on which tax relief was allowed in India, has been refunded/credited by the foreign tax authority during the year? If yes, provide the details below" | Refund flag | string | `TaxPaidOutsideIndFlg` (optional; enum YES,NO) |
| D15 "a" / E15 "Amount of tax refunded" / F15 | Amount of tax refunded | integer | `AmtTaxRefunded` (optional, 0…99999999999999) |
| G15 "b) Assessment year in which tax relief allowed in India" / J15 | AY in which relief allowed | string | `AssmtYrTaxRelief` (optional) |

### The rules the sheet computes (with cell refs)

- **G11** `= SUM(TR_TaxPaidOutsideIndia)` → `TotalTaxOutsideIndia`.
- **H11** `= SUM(TR_TaxReliefOutsideIndia)` → `TotalTaxReliefOutsideIndia`.
- **J12** `= SUM(TR_TaxReliefOutsideIndia) - TR_TaxReliefOutsideIndiaNotDTAA` → `TaxReliefOutsideIndiaDTAA` (relief for DTAA / s.90/90A). Rule 772: Sl.no.2 = total of 1(d) where section is 90/90A.
- **J13** `= SUMIF(TR_ReliefClaimedUsSection,"91",TR_TaxReliefOutsideIndia)` → `TaxReliefOutsideIndiaNotDTAA` (relief for s.91). Rule 773: Sl.no.3 = total of 1(d) where section is 91.
- Rule 773 also: **2+3 = total of column 1d** (`TaxReliefOutsideIndiaDTAA + TaxReliefOutsideIndiaNotDTAA = TotalTaxReliefOutsideIndia`).
- VBA (§12157/§12158): if `TR_TaxPaidOutsideIndFlg = YES`, must fill `AmtTaxRefunded` ("Enter the amount of Tax refunded") **and** `AssmtYrTaxRelief` ("Enter assessment year in which tax relief allowed in India"). AY format `YYYY-YY, eg 2023-24`, and "Assessment Year should be consecutive".
- Downstream (Part B-TTI): rule 826 6a = Sl.no.2 (J12); rule 827 6b = Sl.no.3 (J13); rule 828 6c = 6a+6b.

### Dropdowns (Schedule TR)

- **I7:I8** `Section under which relief claimed`: `(Select)`, `90`, `90A`, `91`.
- **J14** `Refund flag`: `(Select)`, `YES`, `NO`.
- E7/E8 Country Code, F/G/H amounts, J15 AY are typed entries (numeric/text dataValidations, no value list).

### What repeats and what is one figure — Schedule TR

- **Repeats:** `ScheduleTR[]` — per-country rows (utility ships rows 7–8; SrNo auto-increments `D8=D7+1`; schema array has no maxItems → extendable).
- **One figure:** `TotalTaxOutsideIndia`, `TotalTaxReliefOutsideIndia`, `TaxReliefOutsideIndiaDTAA`, `TaxReliefOutsideIndiaNotDTAA`, `TaxPaidOutsideIndFlg`, `AmtTaxRefunded`, `AssmtYrTaxRelief`.

### Mandatory — Schedule TR (schema `required`)

Block-level required: `TotalTaxOutsideIndia`, `TotalTaxReliefOutsideIndia`, `TaxReliefOutsideIndiaDTAA`, `TaxReliefOutsideIndiaNotDTAA`.
Per-row required: `CountryName`, `CountryCodeExcludingIndia`, `TaxIdentificationNo`, `TaxPaidOutsideIndia`, `TaxReliefOutsideIndia` (`ReliefClaimedUsSection` optional).
Conditional (VBA): `AmtTaxRefunded`, `AssmtYrTaxRelief` when `TaxPaidOutsideIndFlg = YES`.

---

## BLOCK 2 — Schedule FA (`ScheduleFA`)

Block-level `required`: **None** (each table is a separate optional array; fill only the classes you hold). Column labels below are quoted from each table's header row. Every column of every table is required per the schema (`*`) unless marked *optional*.

### A1 — `DetailsForiegnBank[]` — Details of Foreign Depository Accounts held (including any beneficial interest) at any time during the calendar year ending as on 31st December, 2025 (C18/D18)

Header row **19 is HIDDEN** (see Hidden rows). Data rows 21–24 (SrNo D22=`D21+1`…).

| Col / label (row 19) | Schema key | Type / rule |
|---|---|---|
| E "Country Name and Code 2" | `CountryName` + `CountryCodeExcludingIndia` | required; dropdown `cmb_TRFA.Country` (E21:E24) |
| F "Name of financial institution 3" | `Bankname` | required (maxLength 125) |
| G "Address of financial institution 4" | `AddressOfBank` | required (maxLength 200) |
| H "ZIP Code 5" | `ZipCode` | required (maxLength 8) |
| I "Account Number 6" | `ForeignAccountNumber` | required (maxLength 34) |
| J "Status 7" | `OwnerStatus` | required; dropdown `(Select),Owner,Beneficial owner,Beneficiary` → enum `OWNER/BENEFICIAL_OWNER/BENIFICIARY` |
| K "Account opening date 8" | `AccOpenDate` | required; date YYYY-MM-DD |
| L "Peak Balance During the Period 9" | `PeakBalanceDuringYear` | required; integer, min -99999999999999 |
| M "Closing balance 10" | `ClosingBalance` | required; integer, min -99999999999999 |
| N "Gross interest paid/credited to the account during the period 11" | `IntrstAccured` | required; integer, min 0 |

### A2 — `DtlsForeignCustodialAcc[]` — Details of Foreign Custodial Accounts held (including any beneficial interest) at any time during the calendar year ending as on 31st December, 2025 (C27/D27)

Header row 28 (visible); sub-header row 29 splits col N/O into "Nature 11a" / "Amount 11b". Data rows 30–33.

| Col / label | Schema key | Type / rule |
|---|---|---|
| E "Country Name and Code 2" | `CountryName` + `CountryCodeExcludingIndia` | required; dropdown `cmb_TRFA.Country` |
| F "Name of financial institution 3" | `FinancialInstName` | required (maxLength 125) |
| G "Address of financial institution 4" | `FinancialInstAddress` | required (maxLength 200) |
| H "ZIP Code 5" | `ZipCode` | required (maxLength 8) |
| I "Account Number 6" | `AccountNumber` | required (maxLength 34) |
| J "Status 7" | `Status` | required; dropdown `(Select),Owner,Beneficial owner,Beneficiary` → `OWNER/BENEFICIAL_OWNER/BENIFICIARY` |
| K "Account opening date 8" | `AccOpenDate` | required; date YYYY-MM-DD |
| L "Peak Balance During the Period 9" | `PeakBalanceDuringPeriod` | required; integer, min -99999999999999 |
| M "Closing balance 10" | `ClosingBalance` | required; integer, min -99999999999999 |
| N "Gross amount paid/credited to the account during the period" → "Nature 11a" | `NatureOfAmount` | required; dropdown (see below) → `INTEREST/DIVIDEND/SALEREDEEM/OTHINC/NOPAIDCRED` |
| O "Amount 11b" | `GrossAmtPaidCredited` | required; integer, min 0 |

### A3 — `DtlsForeignEquityDebtInterest[]` — Details of Foreign Equity and Debt Interest held (including any beneficial interest) in any entity at any time during the calendar year ending as on 31st December, 2025 (C36/D36)

Header row 37. Data rows 39–42.

| Col / label | Schema key | Type / rule |
|---|---|---|
| E "Country Name and Code 2" | `CountryName` + `CountryCodeExcludingIndia` | required; dropdown `cmb_TRFA.Country` |
| F "Name of entity 3" | `NameOfEntity` | required (maxLength 125) |
| G "Address of entity 4" | `AddressOfEntity` | required (maxLength 200) |
| H "ZIP Code 5" | `ZipCode` | required (maxLength 8) |
| I "Nature of entity 6" | `NatureOfEntity` | required (maxLength 34) |
| J "Date of acquiring the interest 7" | `InterestAcquiringDate` | required; date YYYY-MM-DD |
| K "Initial value of the investment 8" | `InitialValOfInvstmnt` | required; integer, min 0 |
| L "Peak value of investment during the period 9" | `PeakBalanceDuringPeriod` | required; integer, min -99999999999999 |
| M "Closing balance 10" | `ClosingBalance` | required; integer, min -99999999999999 |
| N "Total gross amount paid/credited with respect to the holding during the period 11" | `TotGrossAmtPaidCredited` | required; integer, min 0 |
| O "Total gross proceeds from sale or redemption of investment during the period 12" | `TotGrossProceeds` | required; integer, min 0 |

### A4 — `DtlsForeignCashValueInsurance[]` — Details of Foreign Cash Value Insurance Contract or Annuity Contract held (including any beneficial interest) at any time during the calendar year ending as on 31st December, 2025 (C45/D45)

Header row 46. Data rows 48–51.

| Col / label | Schema key | Type / rule |
|---|---|---|
| E "Country Name and Code 2" | `CountryName` + `CountryCodeExcludingIndia` | required; dropdown `cmb_TRFA.Country` |
| F "Name of financial institution in which insurance contract held 3" | `FinancialInstName` | required (maxLength 125) |
| G "Address of financial institution 4" | `FinancialInstAddress` | required (maxLength 200) |
| H "ZIP Code 5" | `ZipCode` | required (maxLength 8) |
| I "Date of contract 6" | `ContractDate` | required; date YYYY-MM-DD |
| J "The cash value or surrender value of the contract 7" | `CashValOrSurrenderVal` | required; integer, min 0 |
| K "Total gross amount paid/credited with respect to the contract during the period. 8" | `TotGrossAmtPaidCredited` | required; integer, min 0 |

### B — `DetailsFinancialInterest[]` — Details of Financial Interest in any Entity held (including any beneficial interest) at any time during the calendar year ending as on 31st December, 2025 (C54/D54)

Header row 55; sub-header row 56 (col O split: "Amount" / "Schedule where offered" / "Item number of schedule"); row 57 numbering "2(a) 2(b) 4(a) 4(b)". Data rows 58–61.

| Col / label | Schema key | Type / rule |
|---|---|---|
| E "Country Code and Name" | `CountryName` + `CountryCodeExcludingIndia` | required; dropdown `cmb_TRFA.Country` |
| F "Zip Code" | `ZipCode` | required (maxLength 8) |
| G "Nature of entity" | `NatureOfEntity` | *optional* (maxLength 100) |
| H "Name of the Entity" | `NameOfEntity` | required (maxLength 125) |
| I "Address of the Entity" | `AddressOfEntity` | required (maxLength 200) |
| J "Nature of Interest" | `NatureOfInt` | required; dropdown `FA_Ownership_Interest` → `DIRECT/BENEFICIAL_OWNER/BENIFICIARY` |
| K "Date since held" | `DateHeld` | required; date YYYY-MM-DD |
| L "Total Investment (at cost) (in rupees)" | `TotalInvestment` | required; integer, min 0 |
| M "Income accrued from such Interest" | `IncFromInt` | required; integer, min 0 |
| N "Nature of Income" | `NatureOfInc` | required (maxLength 100) |
| O "Interest taxable and offered in this return" → "Amount" | `IncTaxAmt` | required; integer |
| P "Schedule where offered" | `IncTaxSch` | required; dropdown → enum `OS/BU/CG/HP/EI/NI` |
| Q "Item number of schedule" | `IncTaxSchNo` | required (maxLength 50) |

### C — `DetailsImmovableProperty[]` — Details of Immovable Property held (including any beneficial interest) at any time during the calendar year ending as on 31st December, 2025 (C66/D66)

Header row 67; sub-header row 68 (col M: "Amount"/"Schedule where offered"/"Item number of schedule"); row 69 "2(a) 2(b)". Data rows 70–73.

| Col / label | Schema key | Type / rule |
|---|---|---|
| E "Country Code and Name" | `CountryName` + `CountryCodeExcludingIndia` | required; dropdown `cmb_TRFA.Country` |
| F "Zip Code" | `ZipCode` | required (maxLength 8) |
| G "Address of the Property" | `AddressOfProperty` | *optional* (maxLength 200) |
| H "Ownership- Direct/ Beneficial owner/ Beneficiary" | `Ownership` | required; dropdown `FA_Ownership_Interest` → `DIRECT/BENEFICIAL_OWNER/BENIFICIARY` |
| I "Date of acquisition" | `DateOfAcq` | required; date YYYY-MM-DD |
| J "Total Investment (at cost) (in rupees)" | `TotalInvestment` | required; integer, min 0 |
| K "Income derived from the property" | `IncDrvProperty` | required; integer, min 0 |
| L "Nature of Income" | `NatureOfInc` | required (maxLength 100) |
| M "Income taxable and offered in this return" → "Amount" | `IncTaxAmt` | required; integer |
| N "Schedule where offered" | `IncTaxSch` | required; dropdown → enum `OS/HP/CG/BU/EI/NI` |
| O "Item number of schedule" | `IncTaxSchNo` | required (maxLength 50) |

### D — `DetailsOthAssets[]` — Details of any other Capital Asset held (including any beneficial interest) at any time during the calendar year ending as on 31st December, 2025 (C79/D79)

Header row 80; sub-header row 81 (col M: "Amount"/"Schedule where offered"/"Item number of schedule"); row 82 "2(a) 2(b)". Data rows 83–86.

| Col / label | Schema key | Type / rule |
|---|---|---|
| E "Country Code and Name" | `CountryName` + `CountryCodeExcludingIndia` | required; dropdown `cmb_TRFA.Country` |
| F "Zip Code" | `ZipCode` | required (maxLength 8) |
| G "Nature of Asset" | `NatureOfAsset` | required (maxLength 100) |
| H "Ownership- Direct/ Beneficial owner/ Beneficiary" | `Ownership` | required; dropdown `FA_Ownership_Interest` → `DIRECT/BENEFICIAL_OWNER/BENIFICIARY` |
| I "Date of acquisition" | `DateOfAcq` | required; date YYYY-MM-DD |
| J "Total Investment (at cost) (in rupees)" | `TotalInvestment` | required; integer, min 0 |
| K "Income derived from the asset" | `IncDrvAsset` | required; integer, min 0 |
| L "Nature of Income" | `NatureOfInc` | required (maxLength 100) |
| M "Income taxable and offered in this return" → "Amount" | `IncTaxAmt` | required; integer |
| N "Schedule where offered" | `IncTaxSch` | required; dropdown → enum `HP/BU/CG/OS/EI/NI` |
| O "Item number of schedule" | `IncTaxSchNo` | required (maxLength 50) |

### E — `DetailsOfAccntsHvngSigningAuth[]` — Details of account(s) in which you have signing authority held (including any beneficial interest) at any time during the calendar year ending as on 31st December, 2025 and which has not been included in A to D above. (C91/D91)

Header row 92; sub-header row 93 (col N: "Amount"/"Schedule where offered"/"Item number of schedule"); row 94 "3(a) 3(b) 3(c)". Data rows 95–98.

| Col / label | Schema key | Type / rule |
|---|---|---|
| E "Name of the Institution in which the account is held" | `NameOfInstitution` | required (maxLength 125) |
| F "Address of the Institution" | `AddressOfInstitution` | required (maxLength 200) |
| G "Country Name & Code" | `CountryName` + `CountryCodeExcludingIndia` | required; dropdown `cmb_TRFA.Country` (G95:G98) |
| H "Zip Code" | `ZipCode` | required (maxLength 8) |
| I "Name of the Account Holder" | `NameMentionedInAccnt` | required (maxLength 125) |
| J "Account Number" | `InstitutionAccountNumber` | required (maxLength 34) |
| K "Peak Balance/Investment / during the year (in rupees)" | `PeakBalanceOrInvestment` | required; integer |
| L "Whether income accrued is taxable in your hands?" | `IncAccuredTaxFlag` | required; dropdown `(Select),Yes,No` → enum `Y/N` |
| M "If (7) is yes, Income accrued in the account" | `IncAccuredInAcc` | *optional*; integer, min 0 |
| N "If (7) is yes, Income offered in this return" → "Amount" | `IncOfferedAmt` | *optional*; integer, min 0 |
| O "Schedule where offered" | `IncOfferedSch` | *optional*; dropdown → enum `HP/BU/CG/OS/EI/NI` |
| P "Item number of schedule" | `IncOfferedSchNo` | *optional* (maxLength 50) |

### F — `DetailsOfTrustOutIndiaTrustee[]` — Details of trusts, created under the laws of a country outside India, in which you are a trustee, beneficiary or settlor (C103/D103)

Header row 104; sub-header row 105 (col R: "Amount"/"Schedule where offered"/"Item number of schedule"); row 106 "2(a) 2(b) 3(a) 4(a) 5(a) 6(a)". Data rows 107–110.

| Col / label | Schema key | Type / rule |
|---|---|---|
| E "Country Code and Name" | `CountryName` + `CountryCodeExcludingIndia` | required; dropdown `cmb_TRFA.Country` |
| F "Zip Code" | `ZipCode` | required (maxLength 8) |
| G "Name of the trust" | `NameOfTrust` | required (maxLength 125) |
| H "Address of the trust" | `AddressOfTrust` | required (maxLength 200) |
| I "Name of trustees" | `NameOfOtherTrustees` | required (maxLength 125) |
| J "Address of trustees" | `AddressOfOtherTrustees` | required (maxLength 200) |
| K "Name of Settlor" | `NameOfSettlor` | required (maxLength 125) |
| L "Address of Settlor" | `AddressOfSettlor` | required (maxLength 200) |
| M "Name of Beneficiaries" | `NameOfBeneficiaries` | required (maxLength 125) |
| N "Address of Beneficiaries" | `AddressOfBeneficiaries` | required (maxLength 200) |
| O "Date since position held" | `DateHeld` | required; date YYYY-MM-DD |
| P "Whether income derived is taxable in your hands?" | `IncDrvTaxFlag` | required; dropdown `(Select),Yes,No` → enum `Y/N` |
| Q "If (8) is yes, Income derived from the trust" | `IncDrvFromTrust` | *optional*; integer, min 0 |
| R "If (8) is yes, Income offered in this return" → "Amount" | `IncOfferedAmt` | *optional*; integer, min 0 |
| S "Schedule where offered" | `IncOfferedSch` | *optional*; dropdown → enum `HP/BU/CG/OS/EI/NI` |
| T "Item number of schedule" | `IncOfferedSchNo` | *optional* (maxLength 50) |

### G — `DetailsOfOthSourcesIncOutsideIndia[]` — Details of any other income derived from any source outside India (i) which is not included in items A to F above or (ii) income under the head business or profession (C114/D114)

Header row 115; sub-header row 116 (col L: "Amount"/"Schedule where offered"/"Item number of schedule"); row 117 "2(a) 2(b) 3(a) 3(b)". Data rows 118–121.

| Col / label | Schema key | Type / rule |
|---|---|---|
| E "Country Code and Name" | `CountryName` + `CountryCodeExcludingIndia` | required; dropdown `cmb_TRFA.Country` |
| F "Zip Code" | `ZipCode` | required (maxLength 8) |
| G "Name of person from whom derived" | `NameOfPerson` | required (maxLength 125) |
| H "Address of person from whom derived" | `AddressOfPerson` | required (maxLength 200) |
| I "Income derived" | `IncDerived` | *optional*; integer, min 0 |
| J "Nature of income" | `NatureOfInc` | required (maxLength 100) |
| K "Whether taxable in your hands?" | `IncDrvTaxFlag` | required; dropdown `(Select),Yes,No` → enum `Y/N` |
| L "If (6) is yes, Income offered in this return" → "Amount" | `IncOfferedAmt` | *optional*; integer, min 0 |
| M "Schedule where offered" | `IncOfferedSch` | *optional*; dropdown → enum `HP/BU/CG/OS/EI/NI` |
| N "Item number of schedule" | `IncOfferedSchNo` | *optional* (maxLength 50) |

### The rules the sheet computes (Schedule FA)

Schedule FA has **no arithmetic formulas** (no `=` cells in rows 17–121 except SrNo auto-increment `D_n = D_{n-1}+1` at rows 22–24, 31–33, 40–42, 49–51, 59–61, 71–73, 84–86, 96–98, 108–110, 119–121). All fields are entered. The gating rules are validation, not computation:

- C3 note / VBA §12149: an FA row is ignored if its Country Code is blank; `CountryName at Sr. No … in Sheet TR_FA is mandatory`.
- Rule 777 / 840: Schedule FA has to be filled / is mandatory if Sl.no.17 of Part B-TTI is "Yes"; rule 778: "Complete details of foreign assets should be provided in Schedule FA".
- Enum text→code mapping applied on export (VBA §15731): OTHER SOURCES→`OS`, HOUSE PROPERTY→`HP`, CAPITAL GAINS→`CG`, BUSINESS→`BU`, EXEMPT INCOME→`EI`, NO INCOME DURING THE YEAR→`NI`.

### Dropdowns (Schedule FA) — every value

- **`cmb_TRFA.Country`** (Country Name and Code; cells E21:E24, E30:E33, E39:E42, E48:E51, E58:E61, E70:E73, E83:E86, G95:G98, E107:E110, E118:E121) — 250 values (`NAME:code`):

`(Select)`, `AFGHANISTAN:93`, `ALAND ISLANDS:1001`, `ALBANIA:355`, `ALGERIA:213`, `AMERICAN SAMOA:684`, `ANDORRA:376`, `ANGOLA:244`, `ANGUILLA:1264`, `ANTARCTICA:1010`, `ANTIGUA AND BARBUDA:1268`, `ARGENTINA:54`, `ARMENIA:374`, `ARUBA:297`, `AUSTRALIA:61`, `AUSTRIA:43`, `AZERBAIJAN:994`, `BAHAMAS:1242`, `BAHRAIN:973`, `BANGLADESH:880`, `BARBADOS:1246`, `BELARUS:375`, `BELGIUM:32`, `BELIZE:501`, `BENIN:229`, `BERMUDA:1441`, `BHUTAN:975`, `BOLIVIA (PLURINATIONAL STATE OF):591`, `BONAIRE, SINT EUSTATIUS AND SABA:1002`, `BOSNIA AND HERZEGOVINA:387`, `BOTSWANA:267`, `BOUVET ISLAND:1003`, `BRAZIL:55`, `BRITISH INDIAN OCEAN TERRITORY:1014`, `BRUNEI DARUSSALAM:673`, `BULGARIA:359`, `BURKINA FASO:226`, `BURUNDI:257`, `CABO VERDE:238`, `CAMBODIA:855`, `CAMEROON:237`, `CANADA:1`, `CAYMAN ISLANDS:1345`, `CENTRAL AFRICAN REPUBLIC:236`, `CHAD:235`, `CHILE:56`, `CHINA:86`, `CHRISTMAS ISLAND:9`, `COCOS (KEELING) ISLANDS:672`, `COLOMBIA:57`, `COMOROS:270`, `CONGO:242`, `CONGO (DEMOCRATIC REPUBLIC OF THE):243`, `COOK ISLANDS:682`, `COSTA RICA:506`, `COTE DIVOIRE:225`, `CROATIA:385`, `CUBA:53`, `CURACAO:1015`, `CYPRUS:357`, `CZECHIA:420`, `DENMARK:45`, `DJIBOUTI:253`, `DOMINICA:1767`, `DOMINICAN REPUBLIC:1809`, `ECUADOR:593`, `EGYPT:20`, `EL SALVADOR:503`, `EQUATORIAL GUINEA:240`, `ERITREA:291`, `ESTONIA:372`, `ETHIOPIA:251`, `FALKLAND ISLANDS (MALVINAS):500`, `FAROE ISLANDS:298`, `FIJI:679`, `FINLAND:358`, `FRANCE:33`, `FRENCH GUIANA:594`, `FRENCH POLYNESIA:689`, `FRENCH SOUTHERN TERRITORIES:1004`, `GABON:241`, `GAMBIA:220`, `GEORGIA:995`, `GERMANY:49`, `GHANA:233`, `GIBRALTAR:350`, `GREECE:30`, `GREENLAND:299`, `GRENADA:1473`, `GUADELOUPE:590`, `GUAM:1671`, `GUATEMALA:502`, `GUERNSEY:1481`, `GUINEA:224`, `GUINEA-BISSAU:245`, `GUYANA:592`, `HAITI:509`, `HEARD ISLAND AND MCDONALD ISLANDS:1005`, `HOLY SEE:6`, `HONDURAS:504`, `HONG KONG:852`, `HUNGARY:36`, `ICELAND:354`, `INDONESIA:62`, `IRAN (ISLAMIC REPUBLIC OF):98`, `IRAQ:964`, `IRELAND:353`, `ISLE OF MAN:1624`, `ISRAEL:972`, `ITALY:5`, `JAMAICA:1876`, `JAPAN:81`, `JERSEY:1534`, `JORDAN:962`, `KAZAKHSTAN:7`, `KENYA:254`, `KIRIBATI:686`, `KOREA (DEMOCRATIC PEOPLES REPUBLIC OF):850`, `KOREA (REPUBLIC OF):82`, `KUWAIT:965`, `KYRGYZSTAN:996`, `LAO PEOPLES DEMOCRATIC REPUBLIC:856`, `LATVIA:371`, `LEBANON:961`, `LESOTHO:266`, `LIBERIA:231`, `LIBYA:218`, `LIECHTENSTEIN:423`, `LITHUANIA:370`, `LUXEMBOURG:352`, `MACAO:853`, `MACEDONIA (THE FORMER YUGOSLAV REPUBLIC OF):389`, `MADAGASCAR:261`, `MALAWI:265`, `MALAYSIA:60`, `MALDIVES:960`, `MALI:223`, `MALTA:356`, `MARSHALL ISLANDS:692`, `MARTINIQUE:596`, `MAURITANIA:222`, `MAURITIUS:230`, `MAYOTTE:269`, `MEXICO:52`, `MICRONESIA (FEDERATED STATES OF):691`, `MOLDOVA (REPUBLIC OF):373`, `MONACO:377`, `MONGOLIA:976`, `MONTENEGRO:382`, `MONTSERRAT:1664`, `MOROCCO:212`, `MOZAMBIQUE:258`, `MYANMAR:95`, `NAMIBIA:264`, `NAURU:674`, `NEPAL:977`, `NETHERLANDS:31`, `NEW CALEDONIA:687`, `NEW ZEALAND:64`, `NICARAGUA:505`, `NIGER:227`, `NIGERIA:234`, `NIUE:683`, `NORFOLK ISLAND:15`, `NORTHERN MARIANA ISLANDS:1670`, `NORWAY:47`, `OMAN:968`, `PAKISTAN:92`, `PALAU:680`, `PALESTINE, STATE OF:970`, `PANAMA:507`, `PAPUA NEW GUINEA:675`, `PARAGUAY:595`, `PERU:51`, `PHILIPPINES:63`, `PITCAIRN:1011`, `POLAND:48`, `PORTUGAL:14`, `PUERTO RICO:1787`, `QATAR:974`, `REUNION:262`, `ROMANIA:40`, `RUSSIAN FEDERATION:8`, `RWANDA:250`, `SAINT BARTHELEMY:1006`, `SAINT HELENA, ASCENSION AND TRISTAN DA CUNHA:290`, `SAINT KITTS AND NEVIS:1869`, `SAINT LUCIA:1758`, `SAINT MARTIN (FRENCH PART):1007`, `SAINT PIERRE AND MIQUELON:508`, `SAINT VINCENT AND THE GRENADINES:1784`, `SAMOA:685`, `SAN MARINO:378`, `SAO TOME AND PRINCIPE:239`, `SAUDI ARABIA:966`, `SENEGAL:221`, `SERBIA:381`, `SEYCHELLES:248`, `SIERRA LEONE:232`, `SINGAPORE:65`, `SINT MAARTEN (DUTCH PART):1721`, `SLOVAKIA:421`, `SLOVENIA:386`, `SOLOMON ISLANDS:677`, `SOMALIA:252`, `SOUTH AFRICA:28`, `SOUTH GEORGIA AND THE SOUTH SANDWICH ISLANDS:1008`, `SOUTH SUDAN:211`, `SPAIN:35`, `SRI LANKA:94`, `SUDAN:249`, `SURINAME:597`, `SVALBARD AND JAN MAYEN:1012`, `SWAZILAND:268`, `SWEDEN:46`, `SWITZERLAND:41`, `SYRIAN ARAB REPUBLIC:963`, `TAIWAN, PROVINCE OF CHINA[A]:886`, `TAJIKISTAN:992`, `TANZANIA, UNITED REPUBLIC OF:255`, `THAILAND:66`, `TIMOR-LESTE(EAST TIMOR):670`, `TOGO:228`, `TOKELAU:690`, `TONGA:676`, `TRINIDAD AND TOBAGO:1868`, `TUNISIA:216`, `TURKEY:90`, `TURKMENISTAN:993`, `TURKS AND CAICOS ISLANDS:1649`, `TUVALU:688`, `UGANDA:256`, `UKRAINE:380`, `UNITED ARAB EMIRATES:971`, `UNITED KINGDOM OF GREAT BRITAIN AND NORTHERN IRELAND:44`, `UNITED STATES OF AMERICA:2`, `UNITED STATES MINOR OUTLYING ISLANDS:1009`, `URUGUAY:598`, `UZBEKISTAN:998`, `VANUATU:678`, `VENEZUELA (BOLIVARIAN REPUBLIC OF):58`, `VIET NAM:84`, `VIRGIN ISLANDS (BRITISH):1284`, `VIRGIN ISLANDS (U.S.):1340`, `WALLIS AND FUTUNA:681`, `WESTERN SAHARA:1013`, `YEMEN:967`, `ZAMBIA:260`, `ZIMBABWE:263`, `OTHERS:9999`

- **Status** (A1 J21:J24, A2 J30:J33): `(Select)`, `Owner`, `Beneficial owner`, `Beneficiary`.
- **Nature of amount** (A2 N30:N33): `(Select)`, `Interest`, `Dividend`, `Proceeds from sale or redemption of financial assets`, `Other income`, `No amount paid/credited`.
- **`FA_Ownership_Interest`** (B Nature of Interest J58:J61; C Ownership H70:H73; D Ownership H83:H86): `(Select)`, `DIRECT`, `BENEFICIAL_OWNER`, `BENIFICIARY` (note the schema's misspelling `BENIFICIARY`).
- **Whether taxable** (E L95:L98; F P107:P110; G K118:K121): `(Select)`, `Yes`, `No`.
- **Schedule where offered** (B P58:P61; C N70:N73; D N83:N86; E O95:O98; F S107:S110; G M118:M121): `(Select)`, `House Property`, `Business`, `Capital Gains`, `Other sources`, `Exempt Income`, `No Income during the year`.

Non-dropdown dataValidations on FA cells (source is a bare number, no value list) enforce field length / numeric range only — e.g. `125`, `200`, `8`, `34`, `10`, `100`, `50` = maxLength; `-99999999999999` / `0` = number floor. They carry no picklist.

### What repeats and what is one figure — Schedule FA

- **Every FA class is a repeating array** (`DetailsForiegnBank[]`, `DtlsForeignCustodialAcc[]`, `DtlsForeignEquityDebtInterest[]`, `DtlsForeignCashValueInsurance[]`, `DetailsFinancialInterest[]`, `DetailsImmovableProperty[]`, `DetailsOthAssets[]`, `DetailsOfAccntsHvngSigningAuth[]`, `DetailsOfTrustOutIndiaTrustee[]`, `DetailsOfOthSourcesIncOutsideIndia[]`). The utility ships **4 template rows** per table (2 for TR); schema arrays declare **no maxItems** → extendable. SrNo auto-increments.
- **No single-figure totals** in Schedule FA.

### Mandatory — Schedule FA

Block `ScheduleFA` has **no `required`** at the top level; each array is optional (fill only classes held). Within a filled row, the `*` columns above are required by the schema; the four "If yes, income offered" tails (`IncAccuredInAcc`/`IncDrvFromTrust`/`IncDerived`, `IncOfferedAmt`, `IncOfferedSch`, `IncOfferedSchNo`) and `NatureOfEntity`(B)/`AddressOfProperty`(C) are optional. Whole-schedule mandatory is driven externally by rules 777/840 (Part B-TTI Sl.no.17 = Yes).

---

## Hidden rows — not built

- **Row 19 (`r 19H`)** — the A1 column-header row (`Sl. No. 1 | Country Name and Code 2 | Name of financial institution 3 | Address of financial institution 4 | ZIP Code 5 | Account Number 6 | Status 7 | Account opening date 8 | Peak Balance During the Period 9 | Closing balance 10 | Gross interest paid/credited to the account during the period 11`) is **hidden** in the utility. It is documented above (A1 table) for column meaning only; **do not build it as a UI row**. The A1 *data* rows 21–24 are visible and are built normally (this is the only hidden row on the sheet; every other block's header row — 28, 37, 46, 55, 67, 80, 92, 104, 115 — is visible).

---

## What this means for the build

- **Two separate sessions/screens** in one sheet. Schedule TR is **resident-only** (rule 774) — gate its visibility on residential status. Schedule FA visibility is driven by Part B-TTI Sl.no.17 (rules 777/840).
- **TR country field is a single typed cell** (E, validation `source "0"`, not the `cmb_TRFA.Country` combobox that FA uses) but the schema needs **both** `CountryName` and `CountryCodeExcludingIndia` — split the entered code into name+code on export (VBA emits both `<CountryName>` and `<CountryCode>` from `TR_Country`, §15717). Cross-check TR country code against Schedule FSI (VBA: "Country code as per schedule FSI and country code as per schedule TR does not match").
- **TR totals are computed, not entered:** wire G11=SUM(paid), H11=SUM(relief), J12=total relief − section-91 relief, J13=SUMIF(section=91, relief); enforce J12+J13=H11 and push J12→Part B-TTI 6a, J13→6b.
- **TR refund tail is conditional:** show/require `AmtTaxRefunded` + `AssmtYrTaxRelief` only when `TaxPaidOutsideIndFlg=YES`; validate AY as `YYYY-YY` and consecutive.
- **FA is all data entry, ten arrays, no math.** Each row's Country Code is the gate — a blank country code drops the whole row (C3 note). Every FA class shares `cmb_TRFA.Country` (name:code) for the country field.
- **Dropdown → enum mapping must be applied on write**, because display labels differ from schema codes: Status `Owner/Beneficial owner/Beneficiary`→`OWNER/BENEFICIAL_OWNER/BENIFICIARY`; Nature of amount `Interest/Dividend/Proceeds…/Other income/No amount paid/credited`→`INTEREST/DIVIDEND/SALEREDEEM/OTHINC/NOPAIDCRED`; ownership/interest `DIRECT/BENEFICIAL_OWNER/BENIFICIARY` (used directly); Yes/No→`Y/N`; Schedule where offered `House Property/Business/Capital Gains/Other sources/Exempt Income/No Income during the year`→`HP/BU/CG/OS/EI/NI`. Keep the schema's misspelling `BENIFICIARY`.
- **Do not build hidden row 19**; build A1 from its visible data rows using the documented column meanings.
