# The book of Schedule AL — Assets and Liabilities at the end of the year · ITR-3, A.Y. 2026-27

Read row by row from the utility's **AL** sheet, with the hidden-row flags, the
formulas, and the dropdowns, and confirmed against the schema block `ScheduleAL`.

*"Schedule AL — Assets and Liabilities at the end of the year (other than those
included in Part A-BS) (applicable in a case where total income exceeds the
threshold)."* On ITR-3 the sheet has **four parts A, B, C, D**: unlike ITR-2,
the *Interest held in the assets of a firm or AOP as a partner or member* part
(Part C) is a **visible, live** table here, and the liabilities line (Part D) is
*"in relation to Assets at (A + B + C)"*.

---

## The shape

Four parts. Part **A** immovable assets (an unlimited table, one row per
property). Part **B** movable assets (eight fixed lines, plus a "Financial
asset" heading). Part **C** interest held in the assets of a firm or AOP as a
partner or member (an unlimited table). Part **D** one figure — liabilities in
relation to the assets at A + B + C. Every amount is at **cost**, in rupees.

---

## The items

Header rows verbatim: Part A [D6] *Sl. No (1) · Description (2) · Address (3) · Amount (cost) in Rs. (4)*; Part B [D15] *Sl. No (1) · Description (2) · Amount (cost) in Rs. (3)*; Part C [D26] *Sl. No (1) · Name of the firm(s)/ AOP(s) (2) · Address of the firm(s)/ AOP(s) (3) · PAN of the firm/ AOP (4) · Assessee’s investment in the firm/ AOP on cost basis (5)*.

### Part A — Details of immovable asset  (`ScheduleAL.ImmovableDetails[]`)

Opening question row [D4] **A** — *"Do you own any immovable asset?"* [J4]
dropdown. On Yes, one row per property under [D5] *"Details of immovable
asset"*:

| Sheet col | Field label (row) | Type | Schema key | Rule / notes |
|---|---|---|---|---|
| (1) | **Sl. No** [D6] | serial | — | auto: `[D9]=D8+1`, `[D10]=D9+1`, `[D11]=D10+1` |
| (2) | **Description** [E6] | text | `ImmovableDetails[].Description` | required; maxLength 25 (cells E8:E11 limit 25) |
| (3) | **Address** [F6] — nine parts below | object | `ImmovableDetails[].AddressAL` | required |
| | **Flat/Door/Block No.** [F7] | text | `AddressAL.ResidenceNo` | required; max 50 |
| | **Name of Premises/Building/Village** [G7] | text | `AddressAL.ResidenceName` | optional; max 50 |
| | **Road/Street/Post Office** [H7] | text | `AddressAL.RoadOrStreet` | optional; max 50 |
| | **Area/locality** [I7] | text | `AddressAL.LocalityOrArea` | required; max 50 |
| | **Town/City/District** [J7] | text | `AddressAL.CityOrTownOrDistrict` | required; max 50 |
| | **State** [K7] | enum | `AddressAL.StateCode` | required; 38 codes (see Dropdowns) |
| | **Country** [L7] | enum | `AddressAL.CountryCode` | required; 250 codes; max 4 |
| | **Pin code** [M7] | integer | `AddressAL.PinCode` | 100000–999999; mandatory when Country is India |
| | **Zipcode** [N7] | text | `AddressAL.ZipCode` | max 8; mandatory when Country is foreign |
| (4) | **Amount (cost) in Rs.** [O6] | integer | `ImmovableDetails[].Amount` | required; 0 to 99999999999999 (14 digits) |

### Part B — Details of movable asset  (`ScheduleAL.MovableAsset`)

Row [D14] **B** *"Details of movable asset"*; header row [D15] *Sl. No (1) /
Description (2) / Amount (cost) in Rs. (3)*. Eight fixed lines (each an amount at
cost, 14 digits max, non-negative). All eight keys are **required** when the
schedule is present — enter zeros if nil.

| Sl. | Field label (row) | Schema key |
|---|---|---|
| (i) | **Jewellery, bullion etc.** [E16] | `MovableAsset.JewelleryBullionEtc` |
| (ii) | **Archaeological collections, drawings, painting, sculpture or any work of art** [E17] | `MovableAsset.ArchCollDrawPaintSulpArt` |
| (iii) | **Vehicles, yachts, boats and aircrafts** [E18] | `MovableAsset.VehiclYachtsBoatsAircrafts` |
| (iv) | **Financial asset** [E19] — heading only | — |
| (iv)(a) | **Bank (including all deposits)** [E20] | `MovableAsset.DepositsInBank` |
| (iv)(b) | **Shares and securities** [E21] | `MovableAsset.SharesAndSecurities` |
| (iv)(c) | **Insurance policies** [E22] | `MovableAsset.InsurancePolicies` |
| (iv)(d) | **Loans and advances given** [E23] | `MovableAsset.LoansAndAdvancesGiven` |
| (iv)(e) | **Cash in hand** [E24] | `MovableAsset.CashInHand` |

### Part C — Interest held in the assets of a firm or AOP  (`ScheduleAL.InterestHeldInaAsset[]`)

Row [D25] **C** — *"Do you have any Interest held in the assets of a firm or
association of persons (AOP) as a partner or member"* [M25] dropdown; the flag
maps to `InterstAOPFlag` (**required**). On Yes, one row per firm/AOP under the
header [D26]:

| Sheet col | Field label (row) | Type | Schema key | Rule / notes |
|---|---|---|---|---|
| (1) | **Sl. No** [D26] | serial | — | auto: `[D29]=D28+1`, `[D30]=D29+1`, `[D31]=D30+1` |
| (2) | **Name of the firm(s)/ AOP(s)** [E26] | text | `InterestHeldInaAsset[].NameOfFirm` | required; max 50 (cells E28:E31 limit 50) |
| (3) | **Address of the firm(s)/ AOP(s)** [F26] — nine parts below | object | `InterestHeldInaAsset[].AddressAL` | required |
| | **Flat/Door/Block No.** [F27] | text | `AddressAL.ResidenceNo` | required; max 50 |
| | **Name of Premises/Building/Village** [G27] | text | `AddressAL.ResidenceName` | optional; max 50 |
| | **Road/Street/Post Office** [H27] | text | `AddressAL.RoadOrStreet` | optional; max 50 |
| | **Area/locality** [I27] | text | `AddressAL.LocalityOrArea` | required; max 50 |
| | **Town/City/District** [J27] | text | `AddressAL.CityOrTownOrDistrict` | required; max 50 |
| | **State** [K27] | enum | `AddressAL.StateCode` | required; 38 codes |
| | **Country** [L27] | enum | `AddressAL.CountryCode` | required; 250 codes; max 4 |
| | **Pin code** [M27] | integer | `AddressAL.PinCode` | 100000–999999 |
| | **Zipcode** [N27] | text | `AddressAL.ZipCode` | max 8 |
| (4) | **PAN of the firm/ AOP** [O26] | text | `InterestHeldInaAsset[].PanOfFirm` | required |
| (5) | **Assessee’s investment in the firm/ AOP on cost basis** [P26] | integer | `InterestHeldInaAsset[].AssesseInvestment` | required; 0 to 14 digits (cells P28:P31) |

### Part D — Liabilities

| Sheet ref | Field label (row) | Type | Schema key | Rule / notes |
|---|---|---|---|---|
| **D** | **Liabilities in relation to Assets at (A + B + C)** [D34]/[E34] | integer | `LiabilityInRelatAssets` | **required**; 0 to 99999999999999 (14 digits); cell O34 |

---

## The rules the sheet computes

- **Immovable Sl. No auto-increments** — `[D9]=D8+1`, `[D10]=D9+1`, `[D11]=D10+1`.
- **Firm/AOP Sl. No auto-increments** — `[D29]=D28+1`, `[D30]=D29+1`, `[D31]=D30+1`.
- **Applicability (rules.json n=905, cat A):** *"Total Income is greater than Rs. 1 crore then Schedule AL is required to be filled."* The VBA gate uses `If (TotalIncome_PARTBTI > 5000000 ...)` — i.e. it prompts the Part A / Part C dropdown selection and the amount fields once total income exceeds Rs. 50,00,000. Both thresholds are quoted from source verbatim; the rules document (1 crore) governs the filing requirement.
- **Dropdown-not-blank (VBA):** *"Please select an option from the dropdown in schedule AL"* — *"Do you own any immovable asset? is Mandatory"* [J4] and the Interest-held flag [M25] must be chosen when income exceeds the threshold.
- **Part B / D non-blank (VBA):** *"Please fill the amount fields at Point B or / and Point D. If not applicable, enter zeros."*
- **Immovable completeness (VBA):** *"Atleast one details of immovable asset requires"* / *"Details of immovable asset: Please fill all the details"* when the answer is Yes; Description, Flat/Door/Block No., Area/locality, Town/City/District, State, Country, and Amount are each *Mandatory* per row.
- **Pin vs Zip (VBA):** Pin Code is *Mandatory* and *cannot exceed 6 digits* when the address is in India; Zip Code is *Mandatory* and *cannot exceed 8 digits* when the country is foreign (`99-Foreign`); characters `< > & ' "` are not allowed in ZipCode.
- **Country/State mapping (VBA):** *"Country and State mapping of Address for immovable asset ... is Invalid"* — an Indian state (not 99) requires Country India (91); state 99-Foreign requires a non-India country.
- **Amount validation (VBA):** every amount in Movable Asset (Jewellery/bullion etc.; Archaeological collections, drawings, painting, sculpture or any work of art; Vehicles, yachts, boats and aircrafts; bank including all deposits; shares and securities; Insurance policies; Loans and advances given; Cash in hand) and the Liability in relation to Assets *"should be Numeric, Non Negative, not exceeding 14 digits."*
- **XML mapping (VBA):** Part A maps to `SchAL.A.*` (Description, Address_Flat/Village/Road/Area/City/State/Country/Pin/Zip, Amount); Part C maps to `SchAL.C.*` (Name, Address_*, PAN, Investment).

---

## Dropdowns

**A — Do you own any immovable asset? [J4]:** (Select), Yes, No.

**C — Interest held in a firm/AOP flag [M25]:** (Select), Yes, No.
(The utility shows Yes/No; the schema `InterstAOPFlag` stores the enum **Y** / **N**.)

**State [K8:K11, K28:K31]** — 38 values (37 states/UTs + Foreign):

(Select), 01-ANDAMAN AND NICOBAR ISLANDS, 02-ANDHRA PRADESH, 03-ARUNACHAL PRADESH, 04-ASSAM, 05-BIHAR, 06-CHANDIGARH, 07-Dadra Nagar and Haveli, 08-Daman and Diu, 09-DELHI, 10-GOA, 11-GUJARAT, 12-HARYANA, 13-HIMACHAL PRADESH, 14-JAMMU AND KASHMIR, 15-KARNATAKA, 16-KERALA, 17-LAKHSWADEEP, 18-MADHYA PRADESH, 19-MAHARASHTRA, 20-MANIPUR, 21-MEGHALAYA, 22-MIZORAM, 23-NAGALAND, 24-ODISHA, 25-PUDUCHERRY, 26-PUNJAB, 27-RAJASTHAN, 28-SIKKIM, 29-TAMIL NADU, 30-TRIPURA, 31-UTTAR PRADESH, 32-WEST BENGAL, 33-CHHATTISGARH, 34-UTTARAKHAND, 35-JHARKHAND, 36-TELANGANA, 37-LADAKH, 99-Foreign

**Country [L8:L11, L28:L31]** — 250 values:

(Select), 93-AFGHANISTAN, 1001-ALAND ISLANDS, 355-ALBANIA, 213-ALGERIA, 684-AMERICAN SAMOA, 376-ANDORRA, 244-ANGOLA, 1264-ANGUILLA, 1010-ANTARCTICA, 1268-ANTIGUA AND BARBUDA, 54-ARGENTINA, 374-ARMENIA, 297-ARUBA, 61-AUSTRALIA, 43-AUSTRIA, 994-AZERBAIJAN, 1242-BAHAMAS, 973-BAHRAIN, 880-BANGLADESH, 1246-BARBADOS, 375-BELARUS, 32-BELGIUM, 501-BELIZE, 229-BENIN, 1441-BERMUDA, 975-BHUTAN, 591-BOLIVIA (PLURINATIONAL STATE OF), 1002-BONAIRE, SINT EUSTATIUS AND SABA, 387-BOSNIA AND HERZEGOVINA, 267-BOTSWANA, 1003-BOUVET ISLAND, 55-BRAZIL, 1014-BRITISH INDIAN OCEAN TERRITORY, 673-BRUNEI DARUSSALAM, 359-BULGARIA, 226-BURKINA FASO, 257-BURUNDI, 238-CABO VERDE, 855-CAMBODIA, 237-CAMEROON, 1-CANADA, 1345-CAYMAN ISLANDS, 236-CENTRAL AFRICAN REPUBLIC, 235-CHAD, 56-CHILE, 86-CHINA, 9-CHRISTMAS ISLAND, 672-COCOS (KEELING) ISLANDS, 57-COLOMBIA, 270-COMOROS, 242-CONGO, 243-CONGO (DEMOCRATIC REPUBLIC OF THE), 682-COOK ISLANDS, 506-COSTA RICA, 225-COTE DIVOIRE, 385-CROATIA, 53-CUBA, 1015-CURACAO, 357-CYPRUS, 420-CZECHIA, 45-DENMARK, 253-DJIBOUTI, 1767-DOMINICA, 1809-DOMINICAN REPUBLIC, 593-ECUADOR, 20-EGYPT, 503-EL SALVADOR, 240-EQUATORIAL GUINEA, 291-ERITREA, 372-ESTONIA, 251-ETHIOPIA, 500-FALKLAND ISLANDS (MALVINAS), 298-FAROE ISLANDS, 679-FIJI, 358-FINLAND, 33-FRANCE, 594-FRENCH GUIANA, 689-FRENCH POLYNESIA, 1004-FRENCH SOUTHERN TERRITORIES, 241-GABON, 220-GAMBIA, 995-GEORGIA, 49-GERMANY, 233-GHANA, 350-GIBRALTAR, 30-GREECE, 299-GREENLAND, 1473-GRENADA, 590-GUADELOUPE, 1671-GUAM, 502-GUATEMALA, 1481-GUERNSEY, 224-GUINEA, 245-GUINEA-BISSAU, 592-GUYANA, 509-HAITI, 1005-HEARD ISLAND AND MCDONALD ISLANDS, 6-HOLY SEE, 504-HONDURAS, 852-HONG KONG, 36-HUNGARY, 354-ICELAND, 91-INDIA, 62-INDONESIA, 98-IRAN (ISLAMIC REPUBLIC OF), 964-IRAQ, 353-IRELAND, 1624-ISLE OF MAN, 972-ISRAEL, 5-ITALY, 1876-JAMAICA, 81-JAPAN, 1534-JERSEY, 962-JORDAN, 7-KAZAKHSTAN, 254-KENYA, 686-KIRIBATI, 850-KOREA (DEMOCRATIC PEOPLES REPUBLIC OF), 82-KOREA (REPUBLIC OF), 965-KUWAIT, 996-KYRGYZSTAN, 856-LAO PEOPLES DEMOCRATIC REPUBLIC, 371-LATVIA, 961-LEBANON, 266-LESOTHO, 231-LIBERIA, 218-LIBYA, 423-LIECHTENSTEIN, 370-LITHUANIA, 352-LUXEMBOURG, 853-MACAO, 389-MACEDONIA (THE FORMER YUGOSLAV REPUBLIC OF), 261-MADAGASCAR, 265-MALAWI, 60-MALAYSIA, 960-MALDIVES, 223-MALI, 356-MALTA, 692-MARSHALL ISLANDS, 596-MARTINIQUE, 222-MAURITANIA, 230-MAURITIUS, 269-MAYOTTE, 52-MEXICO, 691-MICRONESIA (FEDERATED STATES OF), 373-MOLDOVA (REPUBLIC OF), 377-MONACO, 976-MONGOLIA, 382-MONTENEGRO, 1664-MONTSERRAT, 212-MOROCCO, 258-MOZAMBIQUE, 95-MYANMAR, 264-NAMIBIA, 674-NAURU, 977-NEPAL, 31-NETHERLANDS, 687-NEW CALEDONIA, 64-NEW ZEALAND, 505-NICARAGUA, 227-NIGER, 234-NIGERIA, 683-NIUE, 15-NORFOLK ISLAND, 1670-NORTHERN MARIANA ISLANDS, 47-NORWAY, 968-OMAN, 92-PAKISTAN, 680-PALAU, 970-PALESTINE, STATE OF, 507-PANAMA, 675-PAPUA NEW GUINEA, 595-PARAGUAY, 51-PERU, 63-PHILIPPINES, 1011-PITCAIRN, 48-POLAND, 14-PORTUGAL, 1787-PUERTO RICO, 974-QATAR, 262-REUNION, 40-ROMANIA, 8-RUSSIAN FEDERATION, 250-RWANDA, 1006-SAINT BARTHELEMY, 290-SAINT HELENA, ASCENSION AND TRISTAN DA CUNHA, 1869-SAINT KITTS AND NEVIS, 1758-SAINT LUCIA, 1007-SAINT MARTIN (FRENCH PART), 508-SAINT PIERRE AND MIQUELON, 1784-SAINT VINCENT AND THE GRENADINES, 685-SAMOA, 378-SAN MARINO, 239-SAO TOME AND PRINCIPE, 966-SAUDI ARABIA, 221-SENEGAL, 381-SERBIA, 248-SEYCHELLES, 232-SIERRA LEONE, 65-SINGAPORE, 1721-SINT MAARTEN (DUTCH PART), 421-SLOVAKIA, 386-SLOVENIA, 677-SOLOMON ISLANDS, 252-SOMALIA, 28-SOUTH AFRICA, 1008-SOUTH GEORGIA AND THE SOUTH SANDWICH ISLANDS, 211-SOUTH SUDAN, 35-SPAIN, 94-SRI LANKA, 249-SUDAN, 597-SURINAME, 1012-SVALBARD AND JAN MAYEN, 268-SWAZILAND, 46-SWEDEN, 41-SWITZERLAND, 963-SYRIAN ARAB REPUBLIC, 886-TAIWAN, 992-TAJIKISTAN, 255-TANZANIA, UNITED REPUBLIC OF, 66-THAILAND, 670-TIMOR-LESTE(EAST TIMOR), 228-TOGO, 690-TOKELAU, 676-TONGA, 1868-TRINIDAD AND TOBAGO, 216-TUNISIA, 90-TURKEY, 993-TURKMENISTAN, 1649-TURKS AND CAICOS ISLANDS, 688-TUVALU, 256-UGANDA, 380-UKRAINE, 971-UNITED ARAB EMIRATES, 44-UNITED KINGDOM OF GREAT BRITAIN AND NORTHERN IRELAND, 2-UNITED STATES OF AMERICA, 1009-UNITED STATES MINOR OUTLYING ISLANDS, 598-URUGUAY, 998-UZBEKISTAN, 678-VANUATU, 58-VENEZUELA (BOLIVARIAN REPUBLIC OF), 84-VIET NAM, 1284-VIRGIN ISLANDS (BRITISH), 1340-VIRGIN ISLANDS (U.S.), 681-WALLIS AND FUTUNA, 967-YEMEN, 263-ZIMBABWE, 260-ZAMBIA, 1013-WESTERN SAHARA, 9999-OTHERS

---

## What repeats and what is one figure

- **Arrays (unlimited):** `ImmovableDetails[]` (Part A) and `InterestHeldInaAsset[]` (Part C) — one row per property / per firm-AOP; the sheet lays out four visible template rows each (rows 8–11 and 28–31) but the schema array is unbounded.
- **Fixed block (one figure each):** the eight `MovableAsset` lines (Part B).
- **Single figures:** `InterstAOPFlag` (Part C flag), and `LiabilityInRelatAssets` (Part D).

---

## Mandatory

Schema `required` on `ScheduleAL`: **`MovableAsset`**, **`InterstAOPFlag`**,
**`LiabilityInRelatAssets`**. Within `MovableAsset`, all eight lines are required
(`DepositsInBank`, `SharesAndSecurities`, `InsurancePolicies`,
`LoansAndAdvancesGiven`, `CashInHand`, `JewelleryBullionEtc`,
`ArchCollDrawPaintSulpArt`, `VehiclYachtsBoatsAircrafts`) — enter zeros if nil.
On each immovable row: `Description`, `AddressAL.ResidenceNo`,
`AddressAL.LocalityOrArea`, `AddressAL.CityOrTownOrDistrict`,
`AddressAL.StateCode`, `AddressAL.CountryCode`, `Amount`. On each firm/AOP row:
`NameOfFirm`, the same required address parts, `PanOfFirm`, `AssesseInvestment`.

---

## Hidden rows — not built

| Row | Cell | Content | Why excluded |
|---|---|---|---|
| 113 | [N113] | **91-INDIA** | Hidden helper constant (default country value used by the address country/state validation); not a form item — never rendered. |

No labelled Part A/B/C/D row is hidden; all four parts are visible and built.

---

## What this means for the build

1. **Applicability gate** — mandatory when total income exceeds the threshold:
   the rules document says Rs. 1 crore (n=905); the VBA prompts at Rs. 50 lakh
   (`> 5000000`). Encode per the rule text (1 crore) for the filing requirement,
   but keep the card available/optional below it.
2. **Part A is an unlimited table** with Description (max 25), the nine-part
   address (state+Pin for India, country+Zip for foreign, with the
   country/state mapping check), and Amount at cost.
3. **Part C is a second unlimited table** (this is new vs ITR-2, where it was
   hidden): Name of firm/AOP, the same nine-part address, PAN, and investment on
   cost basis. Its flag `InterstAOPFlag` (Y/N) is required.
4. **Part B is eight fixed lines** under a "Financial asset" heading; all
   required, zero if nil, 14-digit non-negative amounts.
5. **Part D is one line** — liabilities in relation to Assets at (A + B + C),
   required, 14-digit non-negative.
6. **Cross-checks worth having (warnings):** immovable properties against
   Schedule HP and Schedule FA (foreign) at cost; bank deposits against Part
   B-TTI bank table and FA A1; shares/securities against Schedule CG and the
   unlisted-share table; the firm/AOP interest in Part C against Schedule IF /
   partner details. Cost differs from value, so these are warnings only.
7. **Export** — `ScheduleAL` with all eight `MovableAsset` lines, the
   `InterstAOPFlag`, and `LiabilityInRelatAssets` always; `ImmovableDetails[]`
   and `InterestHeldInaAsset[]` arrays only when they have rows.
