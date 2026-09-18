# The book of Schedule TR · Schedule FA — the foreign relief and foreign assets sheet · ITR-3, A.Y. 2026-27

## The shape

One utility sheet, **TR_FA**, carries two schedules stacked one above the other: **Schedule TR** (rows 3–16) — the summary of tax relief claimed for taxes paid outside India — and **Schedule FA** (rows 19–163) — the details of foreign assets and income from any source outside India. TR is one small table of countries plus three follow-up figures and a refund question; FA is nine independent tables (A1, A2, A3, A4, B, C, D, E, F, G), each an unlimited array with a hidden `Total:` row. The sheet's opening note warns that *if no entry is made in the Country Code column, then other columns will not be considered for that row*, and FA carries the standing note that *this Schedule is not Applicable for NRI (Non Resident Indians) as per Residential Status*.

## The items

### Schedule TR (ScheduleTR1) — Summary of tax relief claimed for taxes paid outside India

Row 6 is the header; rows 7–10 are the four shipped country rows (Sl.No. auto-increments via `=D7+1`); row 11 is the Total; rows 13, 14 and 16 are the follow-up figures and the refund question.

| Item | Field label | Type | Schema key | Rule / notes |
|---|---|---|---|---|
| 1(a) | Country Code (a) | dropdown | `ScheduleTR[].CountryCodeExcludingIndia` | 249-code list, India excluded; also `ScheduleTR[].CountryName` |
| 1(b) | Taxpayer Identification Number (b) | string | `ScheduleTR[].TaxIdentificationNo` | max 75 |
| 1(c) | Total taxes paid outside India (total of (c) of Schedule FSI in respect of each country) (c) | integer | `ScheduleTR[].TaxPaidOutsideIndia` | from FSI per country |
| 1(d) | Total tax relief available (total of (e) of Schedule FSI in respect of each country) (d) | integer | `ScheduleTR[].TaxReliefOutsideIndia` | from FSI per country |
| 1(e) | Section under which relief claimed (specify 90, 90A or 91) (e) | dropdown | `ScheduleTR[].ReliefClaimedUsSection` | 90 / 90A / 91 |
| 1 Total (c) | Total taxes paid outside India | computed | `TotalTaxPaidOutsideIndia` | `SUM(TR_TaxPaidOutsideIndia)` |
| 1 Total (d) | Total tax relief available | computed | `TotalTaxReliefOutsideIndia` | `SUM(TR_TaxReliefOutsideIndia)` |
| 2 | Total Tax relief available in respect of country where DTAA is applicable (section 90/90A) (Part of total of 1(d)) | computed | `TaxReliefOutsideIndiaDTAA` | MAX(total − not-DTAA, 0) |
| 3 | Total Tax relief available in respect of country where DTAA is not applicable (section 91) (Part of total of 1(d)) | computed | `TaxReliefOutsideIndiaNotDTAA` | SUMIF section = 91 |
| 4 | Whether any tax paid outside India, on which tax relief was allowed in India, has been refunded/credited by the foreign tax authority during the year? If yes, provide the details below | dropdown | `TaxPaidOutsideIndFlg` | (Select) / YES / NO |
| 4a | Amount of tax refunded | integer | `AmtTaxRefunded` | |
| 4b | Assessment year in which tax relief allowed in India | string | `AssmtYrTaxRelief` | |

### Schedule FA (ScheduleFA) — Details of Foreign Assets and Income from any source outside India

**A1 — Details of Foreign Depository Accounts held (including any beneficial interest) at any time during the calendar year ending as on 31st December, 2025** — array `DetailsForiegnBank[]` (header row 22, data rows 24–29, hidden Total: row 31).

| Col | Field label | Schema key |
|---|---|---|
| 1 | Sl.No. | — |
| 2&3 | Country Name and Code | `CountryName`, `CountryCodeExcludingIndia` |
| 4 | Name of financial institution | `Bankname` |
| 5 | Address of financial institution | `AddressOfBank` |
| 6 | ZIP Code | `ZipCode` |
| 7 | Account Number | `ForeignAccountNumber` |
| 8 | Status | `OwnerStatus` — OWNER / BENEFICIAL_OWNER / BENIFICIARY |
| 9 | Account opening date | `AccOpenDate` |
| 10 | Peak Balance During the Period (in rupees) | `PeakBalanceDuringYear` |
| 11 | Closing balance | `ClosingBalance` |
| 12 | Gross interest paid/credited to the account during the period | `IntrstAccured` |

**A2 — Details of Foreign Custodial Accounts held (including any beneficial interest) at any time during the calendar year ending as on 31st December, 2025** — array `DtlsForeignCustodialAcc[]` (header rows 36–37, data 38–43, hidden Total: row 45).

| Col | Field label | Schema key |
|---|---|---|
| 2&3 | Country Name and Code | `CountryName`, `CountryCodeExcludingIndia` |
| 4 | Name of financial institution | `FinancialInstName` |
| 5 | Address of financial institution | `FinancialInstAddress` |
| 6 | ZIP Code | `ZipCode` |
| 6 | Account Number | `AccountNumber` |
| 8 | Status | `Status` — OWNER / BENEFICIAL_OWNER / BENIFICIARY |
| 8 | Account opening date | `AccOpenDate` |
| 9 | Peak Balance During the Period | `PeakBalanceDuringPeriod` |
| 10 | Closing balance | `ClosingBalance` |
| 11a | Nature of Amount | `NatureOfAmount` |
| 11b | Amount / Gross amount paid/credited to the account during the period | `GrossAmtPaidCredited` |

**A3 — Details of Foreign Equity and Debt Interest held (including any beneficial interest) in any entity at any time during the calendar year ending as on 31st December, 2025** — array `DtlsForeignEquityDebtInterest[]` (header row 50, data 52–57, hidden Total: row 59).

| Col | Field label | Schema key |
|---|---|---|
| 2 | Country Name and Code | `CountryName`, `CountryCodeExcludingIndia` |
| 3 | Name of entity | `NameOfEntity` |
| 4 | Address of entity | `AddressOfEntity` |
| 5 | ZIP Code | `ZipCode` |
| 6 | Nature of entity | `NatureOfEntity` |
| 7 | Date of acquiring the interest | `InterestAcquiringDate` |
| 8 | Initial value of the investment | `InitialValOfInvstmnt` |
| 9 | Peak value of investment during the Period | `PeakBalanceDuringPeriod` |
| 10 | Closing balance | `ClosingBalance` |
| 11 | Total gross amount paid/credited with respect to the holding during the period | `TotGrossAmtPaidCredited` |
| 12 | Total gross proceeds from sale or redemption of investment during the period | `TotGrossProceeds` |

**A4 — Details of Foreign Cash Value Insurance Contract or Annuity Contract held (including any beneficial interest) at any time during the calendar year ending as on 31st December, 2025** — array `DtlsForeignCashValueInsurance[]` (header row 64, data 66–71).

| Col | Field label | Schema key |
|---|---|---|
| 2 | Country Name and Code | `CountryName`, `CountryCodeExcludingIndia` |
| 3 | Name of financial institution in which insurance contract held | `FinancialInstName` |
| 4 | Address of financial institution | `FinancialInstAddress` |
| 5 | ZIP Code | `ZipCode` |
| 6 | Date of contract | `ContractDate` |
| 7 | The cash value or surrender value of the contract | `CashValOrSurrenderVal` |
| 8 | Total gross amount paid/credited with respect to the contract during the period | `TotGrossAmtPaidCredited` |

**B — Details of Financial Interest in any Entity held (including any beneficial interest) at any time during the calendar year ending as on 31st December, 2025** — array `DetailsFinancialInterest[]` (header rows 79–80, data 81–86, hidden Total: row 88).

| Col | Field label | Schema key |
|---|---|---|
| 2(a) | Country Name and Code | `CountryName`, `CountryCodeExcludingIndia` |
| 2(b) | Zip Code | `ZipCode` |
| 3 | Nature of entity | `NatureOfEntity` |
| 4(a) | Name of the Entity | `NameOfEntity` |
| 4(b) | Address of the Entity | `AddressOfEntity` |
| 5 | Nature of Interest- Direct/ Beneficial owner/ Beneficiary | `NatureOfInt` — DIRECT / BENEFICIAL_OWNER / BENIFICIARY |
| 6 | Date since held | `DateHeld` |
| 7 | Total Investment (at cost) (in rupees) | `TotalInvestment` |
| 8 | Income accrued from such Interest | `IncFromInt` |
| 9 | Nature of Income | `NatureOfInc` |
| 10 | Income taxable and offered in this return — Amount | `IncTaxAmt` |
| 11 | Schedule where offered | `IncTaxSch` |
| 12 | Item number of schedule | `IncTaxSchNo` |

**C — Details of Immovable Property held (including any beneficial interest) at any time during the calendar year ending as on 31st December, 2025** — array `DetailsImmovableProperty[]` (header rows 94–95, data 96–101, hidden Total: row 103).

| Col | Field label | Schema key |
|---|---|---|
| 2(a) | Country Name & Code | `CountryName`, `CountryCodeExcludingIndia` |
| 2(b) | Zip Code | `ZipCode` |
| 3 | Address of the Property | `AddressOfProperty` |
| 4 | Ownership- Direct/ Beneficial owner/ Beneficiary | `Ownership` — DIRECT / BENEFICIAL_OWNER / BENIFICIARY |
| 5 | Date of acquisition | `DateOfAcq` |
| 6 | Total Investment (at cost) (in rupees) | `TotalInvestment` |
| 7 | Income derived from the property | `IncDrvProperty` |
| 8 | Nature of Income | `NatureOfInc` |
| 9 | Amount (income taxable and offered in this return) | `IncTaxAmt` |
| 10 | Schedule where offered | `IncTaxSch` |
| 11 | Item number of schedule | `IncTaxSchNo` |

**D — Details of any other Capital Asset held (including any beneficial interest) at any time during the calendar year ending as on 31st December, 2025** — array `DetailsOthAssets[]` (header rows 109–110, data 111–116, hidden Total: row 118).

| Col | Field label | Schema key |
|---|---|---|
| 2(a) | Country Name & Code | `CountryName`, `CountryCodeExcludingIndia` |
| 2(b) | Zip Code | `ZipCode` |
| 3 | Nature of Asset | `NatureOfAsset` |
| 4 | Ownership- Direct/ Beneficial owner/ Beneficiary | `Ownership` — DIRECT / BENEFICIAL_OWNER / BENIFICIARY |
| 5 | Date of acquisition | `DateOfAcq` |
| 6 | Total Investment (at cost) (in rupees) | `TotalInvestment` |
| 7 | Income derived from the asset | `IncDrvAsset` |
| 8 | Nature of Income | `NatureOfInc` |
| 9 | Amount (income taxable and offered in this return) | `IncTaxAmt` |
| 10 | Schedule where offered | `IncTaxSch` |
| 11 | Item number of schedule | `IncTaxSchNo` |

**E — Details of account(s) in which you have signing authority held (including any beneficial interest) at any time during the calendar year ending as on 31st December, 2025 and which has not been included in A to D above** — array `DetailsOfAccntsHvngSigningAuth[]` (header rows 125–126, data 127–132, hidden Total: row 134). The column note: *if no entry is made in this column, then other columns will not be considered for that row*.

| Col | Field label | Schema key |
|---|---|---|
| 2 | Name of the Institution in which the account is held | `NameOfInstitution` |
| 3(a) | Address of the Institution | `AddressOfInstitution` |
| 3(b) | Country Name & Code | `CountryName`, `CountryCodeExcludingIndia` |
| 3(c) | Zip Code | `ZipCode` |
| 4 | Name of the Account Holder | `NameMentionedInAccnt` |
| 5 | Account Number | `InstitutionAccountNumber` |
| 6 | Peak Balance/Investment during the year (in rupees) | `PeakBalanceOrInvestment` |
| 7 | Whether income accrued is taxable in your hands? | `IncAccuredTaxFlag` — Yes / No |
| 8 | If (7) is yes, Income accrued in the account | `IncAccuredInAcc` |
| 9 | If (7) is yes, Income offered in this return — Amount | `IncOfferedAmt` |
| 10 | Schedule where offered | `IncOfferedSch` |
| 11 | Item number of schedule | `IncOfferedSchNo` |

**F — Details of trusts, created under the laws of a country outside India, in which you are a trustee, beneficiary or settlor** — array `DetailsOfTrustOutIndiaTrustee[]` (header rows 140–141, data 142–147).

| Col | Field label | Schema key |
|---|---|---|
| 2(a) | Country Name & Code | `CountryName`, `CountryCodeExcludingIndia` |
| 2(b) | Zip Code | `ZipCode` |
| 3 | Name of the trust | `NameOfTrust` |
| 3(a) | Address of the trust | `AddressOfTrust` |
| 4 | Name of trustees | `NameOfOtherTrustees` |
| 4(a) | Address of trustees | `AddressOfOtherTrustees` |
| 5 | Name of Settlor | `NameOfSettlor` |
| 5(a) | Address of Settlor | `AddressOfSettlor` |
| 6 | Name of Beneficiaries | `NameOfBeneficiaries` |
| 6(a) | Address of Beneficiaries | `AddressOfBeneficiaries` |
| 7 | Date since position held | `DateHeld` |
| 8 | Whether income derived is taxable in your hands? | `IncDrvTaxFlag` — Yes / No |
| 9 | If (8) is yes, Income derived from the trust | `IncDrvFromTrust` |
| 10 | If (8) is yes, Income offered in this return — Amount | `IncOfferedAmt` |
| 11 | Schedule where offered | `IncOfferedSch` |
| 12 | Item number of schedule | `IncOfferedSchNo` |

**G — Details of any other income derived from any source outside India- (i) which is not included in items A to F above or, (ii) income under the head business or profession** — array `DetailsOfOthSourcesIncOutsideIndia[]` (header rows 152–153, data 154–159).

| Col | Field label | Schema key |
|---|---|---|
| 2(a) | Country Name & Code | `CountryName`, `CountryCodeExcludingIndia` |
| 2(b) | Zip Code | `ZipCode` |
| 3(a) | Name of the Person | `NameOfPerson` |
| 3(b) | Address of the Person | `AddressOfPerson` |
| 4 | Income derived | `IncDerived` |
| 5 | Nature of income | `NatureOfInc` |
| 6 | Whether taxable in your hands? | `IncDrvTaxFlag` — Yes / No |
| 7 | If (6) is yes, Income offered in this return — Amount | `IncOfferedAmt` |
| 8 | Schedule where offered | `IncOfferedSch` |
| 9 | Item number of schedule | `IncOfferedSchNo` |

## The rules the sheet computes

- **[G11]** `= SUM(TR_TaxPaidOutsideIndia)` — TR total of taxes paid outside India (column c), into `TotalTaxPaidOutsideIndia`.
- **[H11]** `= SUM(TR_TaxReliefOutsideIndia)` — TR total of tax relief available (column d), into `TotalTaxReliefOutsideIndia`.
- **[J13]** `= MAX(TR_TotalTaxReliefOutsideIndia - TR_TaxReliefOutsideIndiaNotDTAA, 0)` — DTAA-country relief (section 90/90A) = total relief minus the non-DTAA (91) part, floored at 0.
- **[J14]** `= SUMIF(TR_ReliefClaimedUsSection, "91", TR_TaxReliefOutsideIndia)` — non-DTAA relief = sum of column (d) wherever section 91 is selected in column (e).
- **[D8/D9/D10]** `= D7+1` (and likewise the Sl.No. auto-increments in every FA table, e.g. `=D24+1`) — serial numbers are generated, not entered.
- **[L31]** `= SUM(FA_A1_PeakBal)` — A1 hidden Total: of peak balance.
- **[L45]** `= SUM(FA_A2_PeakBal)` — A2 hidden Total: of peak balance.
- **[L59]** `= SUM(FA_A3_PeakBal)` — A3 hidden Total: of peak value.
- **[G103]** `= SUM(FA_C_TotalInv)` — C hidden Total: of total investment.
- Cross-schedule rules from rules.json: TR field 2 (DTAA 90/90A) must equal the sum of column 1(d) where 1(e) is 90/90A; TR Sl.No. 3 (non-DTAA) must equal total of column (d) where 91 is selected; TR 2+3 must equal total of column 1(d); TR column (c) must equal total of column (c) of Schedule FSI per country; Schedule TR is not applicable if residential status is non-resident; Schedule FA has to be filled if Sl.No.14 of Part B-TTI is selected as Yes.

## Dropdowns

- **Section under which relief claimed** `[I7:I10]`: (Select), 90, 90A, 91
- **TR refund flag** `[J15]`: (Select), YES, NO
- **A1 / A2 owner status** `[J24:J29, J38:J43]`: (Select), OWNER, BENEFICIAL_OWNER, BENIFICIARY
- **B / C / D nature of interest / ownership** `[J81:J86, H96:H101, H111:H116]`: (Select), DIRECT, BENEFICIAL_OWNER, BENIFICIARY
- **A2 Nature of Amount** `[N38:N43]` (SchFA_Nature): (Select), Interest, Dividend, Proceeds from sale or redemption of financial assets, No Amount paid/credited, Other income
- **Schedule where offered** `[DropdownFA_E: P81, N96, N111, O127, S142, M154]`: (Select), Salary, House Property, Business, Exempt Income, No Income during the year, Capital Gains, Other sources
- **E / F taxable flag** `[L127:L132, P142:P147]`: (Select), Yes, No
- **G taxable flag** `[K154:K159]`: (Select), Yes, No
- **Country Name & Code** `[Country_NoIndia]` — India excluded, used in TR column (a) and every FA country column (248 entries):

(Select), 93-AFGHANISTAN, 1001-ALAND ISLANDS, 355-ALBANIA, 213-ALGERIA, 684-AMERICAN SAMOA, 376-ANDORRA, 244-ANGOLA, 1264-ANGUILLA, 1010-ANTARCTICA, 1268-ANTIGUA AND BARBUDA, 54-ARGENTINA, 374-ARMENIA, 297-ARUBA, 61-AUSTRALIA, 43-AUSTRIA, 994-AZERBAIJAN, 1242-BAHAMAS, 973-BAHRAIN, 880-BANGLADESH, 1246-BARBADOS, 375-BELARUS, 32-BELGIUM, 501-BELIZE, 229-BENIN, 1441-BERMUDA, 975-BHUTAN, 591-BOLIVIA (PLURINATIONAL STATE OF), 1002-BONAIRE, SINT EUSTATIUS AND SABA, 387-BOSNIA AND HERZEGOVINA, 267-BOTSWANA, 1003-BOUVET ISLAND, 55-BRAZIL, 1014-BRITISH INDIAN OCEAN TERRITORY, 673-BRUNEI DARUSSALAM, 359-BULGARIA, 226-BURKINA FASO, 257-BURUNDI, 238-CABO VERDE, 855-CAMBODIA, 237-CAMEROON, 1-CANADA, 1345-CAYMAN ISLANDS, 236-CENTRAL AFRICAN REPUBLIC, 235-CHAD, 56-CHILE, 86-CHINA, 9-CHRISTMAS ISLAND, 672-COCOS (KEELING) ISLANDS, 57-COLOMBIA, 270-COMOROS, 242-CONGO, 243-CONGO (DEMOCRATIC REPUBLIC OF THE), 682-COOK ISLANDS, 506-COSTA RICA, 225-COTE DIVOIRE, 385-CROATIA, 53-CUBA, 1015-CURACAO, 357-CYPRUS, 420-CZECHIA, 45-DENMARK, 253-DJIBOUTI, 1767-DOMINICA, 1809-DOMINICAN REPUBLIC, 593-ECUADOR, 20-EGYPT, 503-EL SALVADOR, 240-EQUATORIAL GUINEA, 291-ERITREA, 372-ESTONIA, 251-ETHIOPIA, 500-FALKLAND ISLANDS (MALVINAS), 298-FAROE ISLANDS, 679-FIJI, 358-FINLAND, 33-FRANCE, 594-FRENCH GUIANA, 689-FRENCH POLYNESIA, 1004-FRENCH SOUTHERN TERRITORIES, 241-GABON, 220-GAMBIA, 995-GEORGIA, 49-GERMANY, 233-GHANA, 350-GIBRALTAR, 30-GREECE, 299-GREENLAND, 1473-GRENADA, 590-GUADELOUPE, 1671-GUAM, 502-GUATEMALA, 1481-GUERNSEY, 224-GUINEA, 245-GUINEA-BISSAU, 592-GUYANA, 509-HAITI, 1005-HEARD ISLAND AND MCDONALD ISLANDS, 6-HOLY SEE, 504-HONDURAS, 852-HONG KONG, 36-HUNGARY, 354-ICELAND, 62-INDONESIA, 98-IRAN (ISLAMIC REPUBLIC OF), 964-IRAQ, 353-IRELAND, 1624-ISLE OF MAN, 972-ISRAEL, 5-ITALY, 1876-JAMAICA, 81-JAPAN, 1534-JERSEY, 962-JORDAN, 7-KAZAKHSTAN, 254-KENYA, 686-KIRIBATI, 850-KOREA (DEMOCRATIC PEOPLES REPUBLIC OF), 82-KOREA (REPUBLIC OF), 965-KUWAIT, 996-KYRGYZSTAN, 856-LAO PEOPLES DEMOCRATIC REPUBLIC, 371-LATVIA, 961-LEBANON, 266-LESOTHO, 231-LIBERIA, 218-LIBYA, 423-LIECHTENSTEIN, 370-LITHUANIA, 352-LUXEMBOURG, 853-MACAO, 389-MACEDONIA (THE FORMER YUGOSLAV REPUBLIC OF), 261-MADAGASCAR, 265-MALAWI, 60-MALAYSIA, 960-MALDIVES, 223-MALI, 356-MALTA, 692-MARSHALL ISLANDS, 596-MARTINIQUE, 222-MAURITANIA, 230-MAURITIUS, 269-MAYOTTE, 52-MEXICO, 691-MICRONESIA (FEDERATED STATES OF), 373-MOLDOVA (REPUBLIC OF), 377-MONACO, 976-MONGOLIA, 382-MONTENEGRO, 1664-MONTSERRAT, 212-MOROCCO, 258-MOZAMBIQUE, 95-MYANMAR, 264-NAMIBIA, 674-NAURU, 977-NEPAL, 31-NETHERLANDS, 687-NEW CALEDONIA, 64-NEW ZEALAND, 505-NICARAGUA, 227-NIGER, 234-NIGERIA, 683-NIUE, 15-NORFOLK ISLAND, 1670-NORTHERN MARIANA ISLANDS, 47-NORWAY, 968-OMAN, 92-PAKISTAN, 680-PALAU, 970-PALESTINE, STATE OF, 507-PANAMA, 675-PAPUA NEW GUINEA, 595-PARAGUAY, 51-PERU, 63-PHILIPPINES, 1011-PITCAIRN, 48-POLAND, 14-PORTUGAL, 1787-PUERTO RICO, 974-QATAR, 262-REUNION, 40-ROMANIA, 8-RUSSIAN FEDERATION, 250-RWANDA, 1006-SAINT BARTHELEMY, 290-SAINT HELENA, ASCENSION AND TRISTAN DA CUNHA, 1869-SAINT KITTS AND NEVIS, 1758-SAINT LUCIA, 1007-SAINT MARTIN (FRENCH PART), 508-SAINT PIERRE AND MIQUELON, 1784-SAINT VINCENT AND THE GRENADINES, 685-SAMOA, 378-SAN MARINO, 239-SAO TOME AND PRINCIPE, 966-SAUDI ARABIA, 221-SENEGAL, 381-SERBIA, 248-SEYCHELLES, 232-SIERRA LEONE, 65-SINGAPORE, 1721-SINT MAARTEN (DUTCH PART), 421-SLOVAKIA, 386-SLOVENIA, 677-SOLOMON ISLANDS, 252-SOMALIA, 28-SOUTH AFRICA, 1008-SOUTH GEORGIA AND THE SOUTH SANDWICH ISLANDS, 211-SOUTH SUDAN, 35-SPAIN, 94-SRI LANKA, 249-SUDAN, 597-SURINAME, 1012-SVALBARD AND JAN MAYEN, 268-SWAZILAND, 46-SWEDEN, 41-SWITZERLAND, 963-SYRIAN ARAB REPUBLIC, 886-TAIWAN, 992-TAJIKISTAN, 255-TANZANIA, UNITED REPUBLIC OF, 66-THAILAND, 670-TIMOR-LESTE(EAST TIMOR), 228-TOGO, 690-TOKELAU, 676-TONGA, 1868-TRINIDAD AND TOBAGO, 216-TUNISIA, 90-TURKEY, 993-TURKMENISTAN, 1649-TURKS AND CAICOS ISLANDS, 688-TUVALU, 256-UGANDA, 380-UKRAINE, 971-UNITED ARAB EMIRATES, 44-UNITED KINGDOM OF GREAT BRITAIN AND NORTHERN IRELAND, 2-UNITED STATES OF AMERICA, 1009-UNITED STATES MINOR OUTLYING ISLANDS, 598-URUGUAY, 998-UZBEKISTAN, 678-VANUATU, 58-VENEZUELA (BOLIVARIAN REPUBLIC OF), 84-VIET NAM, 1284-VIRGIN ISLANDS (BRITISH), 1340-VIRGIN ISLANDS (U.S.), 681-WALLIS AND FUTUNA, 1013-WESTERN SAHARA, 260-ZAMBIA, 9999-OTHERS



## What repeats and what is one figure

- **Arrays (repeating rows):** TR country table `ScheduleTR[]`; and every FA table — `DetailsForiegnBank[]` (A1), `DtlsForeignCustodialAcc[]` (A2), `DtlsForeignEquityDebtInterest[]` (A3), `DtlsForeignCashValueInsurance[]` (A4), `DetailsFinancialInterest[]` (B), `DetailsImmovableProperty[]` (C), `DetailsOthAssets[]` (D), `DetailsOfAccntsHvngSigningAuth[]` (E), `DetailsOfTrustOutIndiaTrustee[]` (F), `DetailsOfOthSourcesIncOutsideIndia[]` (G). Each ships a handful of rows and the VBA adds more; the sheet's `Total:` rows are hidden.
- **Single figures (one value each):** TR's `TotalTaxPaidOutsideIndia`, `TotalTaxReliefOutsideIndia`, `TaxReliefOutsideIndiaDTAA`, `TaxReliefOutsideIndiaNotDTAA`, and the refund block `TaxPaidOutsideIndFlg`, `AmtTaxRefunded`, `AssmtYrTaxRelief`.

## Mandatory

- **ScheduleTR1 required:** `TotalTaxPaidOutsideIndia`, `TotalTaxReliefOutsideIndia`, `TaxReliefOutsideIndiaDTAA`, `TaxReliefOutsideIndiaNotDTAA`. Per `ScheduleTR[]` row: `CountryName`, `CountryCodeExcludingIndia`, `TaxIdentificationNo`, `TaxPaidOutsideIndia`, `TaxReliefOutsideIndia` (with `ReliefClaimedUsSection` optional).
- **ScheduleFA:** the block is optional at the top level (`required: None`), but within each populated row the starred keys above are required — e.g. A1's `Bankname`, `AddressOfBank`, `ForeignAccountNumber`, `OwnerStatus`, `AccOpenDate`, `PeakBalanceDuringYear`, `ClosingBalance`, `IntrstAccured`; the "Income offered" sub-keys `IncOfferedAmt`, `IncOfferedSch`, `IncOfferedSchNo`, `IncAccuredInAcc`, `IncDrvFromTrust`, `IncDerived` are optional (filled only when the taxable flag is Yes).

## Hidden rows — not built

These `Total:` rows are hidden in the utility (they hold a SUM formula, not an item to enter); they are computed footers, never presented as items:

- **r31 (H)** `[C31] Total:` — A1 peak-balance total, `=SUM(FA_A1_PeakBal)`.
- **r45 (H)** `[C45] Total:` — A2 peak-balance total, `=SUM(FA_A2_PeakBal)`.
- **r59 (H)** `[C59] Total:` — A3 peak-value total, `=SUM(FA_A3_PeakBal)`.
- **r88 (H)** `[C88] Total:` — B total footer.
- **r103 (H)** `[C103] Total:` — C total investment, `=SUM(FA_C_TotalInv)`.
- **r118 (H)** `[C118] Total:` — D total footer.
- **r134 (H)** `[C134] Total:` — E total footer.

(A4, F and G ship no hidden Total: row.)

## What this means for the build

**Closing NOTE (r163):** *Please refer to instructions for filling out this schedule. In case of an individual, not being an Indian citizen, who is in India on a business, employment or student visa, an asset acquired during any previous year in which he was non-resident is not mandatory to be reported in this schedule if no income is derived from that asset during the current previous year.*

1. **Schedule TR** — a repeatable country table generated from FSI: country code, TIN, taxes paid (c) and relief available (d) pulled per country, plus the 90/90A/91 dropdown in (e). Compute the two totals (SUM), the DTAA part as MAX(total − non-DTAA, 0) and the non-DTAA part as SUMIF section=91; feed both to Part B-TTI's relief lines. Add the refund question (YES/NO) with amount refunded and assessment year. Gate the whole schedule off for non-residents.
2. **Schedule FA** — build all **nine** tables (A1–A4, B, C, D, E, F, G), each unlimited, every column typed, with the "where offered" columns (amount, schedule dropdown, item number) on B, C, D, E, F, G. Gate FA to resident-and-ordinarily-resident only (not NRI, not RNOR); the calendar-year window is 1 Jan – 31 Dec 2025.
3. **Note to surface:** the country-code note (blank code = row ignored) and the closing NOTE — *an individual, not being an Indian citizen, in India on a business, employment or student visa need not report an asset acquired while non-resident if no income is derived from it in the current year*.
4. **Export** — `ScheduleTR1` with the four required totals and the country array; `ScheduleFA` with only the tables that actually have rows.


## Additional visible rows — verbatim from the sheet (completeness)
Rows present on the utility sheet and captured here verbatim so every visible label is in the book:

- Zip Code 2(b)
- Nature of Income 9
- Nature of Income 8
- Zip Code 3(c)
- Income derived 4
- Nature of income 5
