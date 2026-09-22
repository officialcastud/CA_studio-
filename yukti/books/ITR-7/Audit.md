# The book of Audit Information (Audit) — ITR-7, A.Y. 2026-27

Read row by row from the utility's **Audit** sheet (rows 3–65, with the
hidden-row flags and dropdowns) and confirmed against the CBDT ITR-7 schema
block **`PartA_GEN2`** (the "Other details / audit / members" block). Every
label, code and dropdown below is the department's own; nothing is invented.
Item numbers (A27–A29) are the department's own numbering carried on the sheet.

> **Source split, flagged.** `PartA_GEN2` has three physical homes. Its
> **audit** part (A27 income-tax audit, A28 other-Act audit) and its
> **members / author-founder / contribution** part (A29) are on **this** Audit
> sheet. But its **`OtherDetailsFor7`** part — the section 2(15) test, change in
> activities, first-return flag and the 22nd-proviso/13(10) flags — has its live
> rows on the **PI** sheet (rows 91–146), not here. See §5. All of `PartA_GEN2`
> is reproduced in Appendix 1 because Gate 3 for this sheet checks every required
> `PartA_GEN2` key, and because the section-builder for this block takes this book
> as its sole input.

---

## 1 · What this sheet is for

ITR-7 is filed by trusts, institutions, political parties, research bodies,
universities and other exemption claimants. Their exemption survives only if
their accounts are audited and their controlling persons are disclosed. This
sheet collects exactly that:

| Item | What it asks |
|---|---|
| **A27** | audit **under the Income-tax Act** — liability, the section under which liable, whether audited by an accountant, and the auditor / report particulars |
| **A28** | audit **under any Act other than the Income-tax Act** — the Act, section and date of the report |
| **A29(i)** | particulars of persons who are **members in the AOP** on 31 March 2026 |
| **A29(ii)** | particulars of the **Author(s)/Founder(s)/Settlor(s)/Trustee(s)/Manager(s)** etc.: A (individuals), B (non-individual persons and their beneficial owners), C (large contributors u/s 13(3)(b)), D (relatives / HUF-linked persons) |

The hidden rows 3–10 are an older section-92E audit micro-block (liability u/s
92E, date of audit, auditor name/membership, firm PAN, report dates) that the
utility keeps but does not build on this sheet.

---

## 2 · The shape — the blocks on this sheet

| # | Block | Kind | Schema key (`PartA_GEN2`) | Shown? |
|---|---|---|---|---|
| 1 | **(A27) Income-tax audit** | ask + card | `LiableSec44ABflg`, `AuditDetails[]` | yes; card opens on Yes |
| 2 | **(A28) Audit under any other Act** | ask + table | `LiableAnyOthThnINTActflg`, `LiableAnyOthThnINTActDetails[]` | yes; table opens on Yes |
| 3 | **(A29 i) Members of the AOP** | table | `PartnerOrMemberInfo[]` | when status is AOP/BOI |
| 4 | **(A29 ii A) Authors/Founders/Trustees (individuals)** | table | `AuthorFounderDtls5percent[]` | yes |
| 5 | **(A29 ii B) Non-individual such persons + beneficial owners** | table | `AuthorFounderDtls5percentNonInd[]` | yes |
| 6 | **(A29 ii C) Large contributors u/s 13(3)(b)** | table | `ContributionUs13_3bDtls[]` | yes |
| 7 | **(A29 ii D) Relatives / HUF-linked persons** | table | `ContributionHUFDtls[]` | yes |
| — | **(elsewhere) Other details — 2(15), change, first return, 13(10)** | ask | `OtherDetailsFor7.*` | on **PI** rows 91–146 |

---

## 3 · Block by block — the live rows

Types: **T** text, **D** date `DD/MM/YYYY`, **N** number/integer, **E** enum
(dropdown, values in §4), **F** flag Yes/No.

### Block 1 · (A27) Audit under the Income-tax Act (rows 12–21)

| Item | Label (verbatim) | Type | Schema key |
|---|---|---|---|
| **A27 (i)** | Are you liable for audit under the Income-tax Act? If yes, furnish following information | E | `LiableSec44ABflg` (required) — Yes/No |
| **A27 (ii)** | Section under which you are liable for audit (specify section). Please mention date of audit report | E | `AuditDetails[].AuditedSection` (required) — `AuditSection`: 10(23C)(iv)/(v)/(vi)/(via) / 12A(1)(b) / 92E / Others |
| — | Others Section Name (Enter in case, if the above section is "Others") | T | `AuditDetails[].OtherSectionDesc` |
| — | Whether the accounts have been audited by an accountant? | E | `AuditDetails[].AuditFlag` (required) — Yes/No |
| **a** | Name of the auditor (proprietorship/ firm) | T | `AuditDetails[].AudFrmName` |
| **b** | Permanent Account Number (PAN) of the proprietorship/ firm | T | `AuditDetails[].AudFrmPAN` |
| — | Aadhaar Number of the proprietorship | N | `AuditDetails[].AudFrmAadhaar` |
| **c** | Date of furnishing of the audit report | D | `AuditDetails[].AuditReportFurnishDate` |
| **d** | Acknowledgement number of the audit report | N | `AuditDetails[].AckNumAudtRpt` |

### Block 2 · (A28) Audit under any Act other than the Income-tax Act (rows 26–31)

| Item | Label (verbatim) | Type | Schema key |
|---|---|---|---|
| **A28 (i)** | If liable to audit under any Act other than the Income-tax Act, mention the Act, section and date | E | `LiableAnyOthThnINTActflg` (required) — Yes/No |
| — | Act | E | `LiableAnyOthThnINTActDetails[].AuditedAct` (required) — `ACT_Description`, §4 |
| — | Description | T | `LiableAnyOthThnINTActDetails[].AuditedActOther` |
| — | Section | T | `LiableAnyOthThnINTActDetails[].AuditedSection` (required) |
| — | Date | D | `LiableAnyOthThnINTActDetails[].DateOfAudit` (required) |

### Block 3 · (A29 i) Members in the AOP on 31 March 2026 (rows 36–42)

Row 36: *"(A29)(i). Particulars of persons who are members in the AOP on 31st day
of March, 2026 (to be filled ...)"* → `PartnerOrMemberInfo[]`.

| Col | Label (verbatim) | Type | Schema key |
|---|---|---|---|
| 1 | Sl.No. | — | — |
| 2 | Name | T | `PartnerOrMemberInfo[].PartnerOrMemberName` (required) |
| 3 | Address | T | `PartnerOrMemberInfo[].AddressDetailWithZipCode.AddrDetail` (required) |
| — | City | T | `...AddressDetailWithZipCode.CityOrTownOrDistrict` (required) |
| — | State | E | `...AddressDetailWithZipCode.StateCode` (required) — `State`, §4 |
| — | Country | E | `...AddressDetailWithZipCode.CountryCode` (required) — `Country`, §4 |
| — | Pin Code | N | `...AddressDetailWithZipCode.PinCode` |
| — | Zip Code | T | `...AddressDetailWithZipCode.ZipCode` |
| 4 | Percentage of share (if determinate) | N | `PartnerOrMemberInfo[].SharePercentage` |
| 5 | PAN | T | `PartnerOrMemberInfo[].PAN` |
| 6 | Aadhaar Number | T | `PartnerOrMemberInfo[].AadhaarCardNo` |
| 7 | Status | E | `PartnerOrMemberInfo[].Status` (required) — INDIVIDUAL / HUF / FIRM / LLP / DOMESTIC_COMPANY / FOREIGN_COMPANY / CO_OPERATIVE_SOCIETY / LOCAL_AUTHORITY / TRUST / AOP_BOI / ANY_OTHER_AJP |

### Block 4 · (A29 ii A) Authors/Founders/Settlors/Trustees — individuals (rows 45–50)

Row 46: *"A. Details of all the Author(s)/ Founder(s)/ Settlor(s)/Trustee(s)/
Members of society/Members of the Governing Council ..."* →
`AuthorFounderDtls5percent[]`.

| Col | Label (verbatim) | Type | Schema key |
|---|---|---|---|
| — | Name | T | `AuthorFounderDtls5percent[].Name` (required) |
| — | Relation | E | `AuthorFounderDtls5percent[].Relation` (required) — `Audit_Gii_Relation`, §4 |
| — | Percentage Of shareholding in case of shareholder | N | `AuthorFounderDtls5percent[].ShareHoldingPercentage` (required) |
| — | Whether Resident of India? | E | `AuthorFounderDtls5percent[].ResidentOfIndia` (required) — Yes/No |
| — | Type of Identification (Select from drop down) | E | `AuthorFounderDtls5percent[].IDCode` — `Audit_UIN`, §4 |
| — | Identification Number | T | `AuthorFounderDtls5percent[].UniqueIdentNumber` |
| — | Address | T | `AuthorFounderDtls5percent[].Address` (required) |
| — | Mobile number | N | `AuthorFounderDtls5percent[].MobileNo` (required) |
| — | E-mail address | T | `AuthorFounderDtls5percent[].EmailAddress` (required) |

### Block 5 · (A29 ii B) Where such person is not an individual (rows 52–56)

Row 52: *"B. In case if any of persons (as mentioned in row A above) is not an
individual then provide the following ..."* → `AuthorFounderDtls5percentNonInd[]`.

| Col | Label (verbatim) | Type | Schema key |
|---|---|---|---|
| — | Name | T | `AuthorFounderDtls5percentNonInd[].Name` (required) |
| — | Whether Resident of India? | E | `AuthorFounderDtls5percentNonInd[].ResidentOfIndia` (required) — Yes/No |
| — | Type of Identification (Select from drop down) | E | `AuthorFounderDtls5percentNonInd[].IDCode` — `Audit_UIN`, §4 |
| — | Identification Number | T | `AuthorFounderDtls5percentNonInd[].UniqueIdentNumber` |
| — | Address | T | `AuthorFounderDtls5percentNonInd[].Address` (required) |
| — | Percentage of beneficial ownership | N | `AuthorFounderDtls5percentNonInd[].BeneficialPercentage` (required) |

### Block 6 · (A29 ii C) Large contributors u/s 13(3)(b) (rows 58–62)

Row 58: *"C. Name(s) of the person(s) whose total contribution to the trust or
institution, during the relevant ... year ..."* → `ContributionUs13_3bDtls[]`.

| Col | Label (verbatim) | Type | Schema key |
|---|---|---|---|
| — | Name | T | `ContributionUs13_3bDtls[].Name` (required) |
| — | Address | T | `ContributionUs13_3bDtls[].Address` (required) |
| — | PAN | T | `ContributionUs13_3bDtls[].PAN` |
| — | Aadhaar Number | T | `ContributionUs13_3bDtls[].AadhaarCardNo` |

### Block 7 · (A29 ii D) Relatives / HUF-linked persons (rows 64–68)

Row 64: *"D. Name(s) of relative(s) of author(s), founder(s), member(s),
trustee(s), manager(s), and where any such ..."* → `ContributionHUFDtls[]`.

| Col | Label (verbatim) | Type | Schema key |
|---|---|---|---|
| — | Name | T | `ContributionHUFDtls[].Name` (required) |
| — | Address | T | `ContributionHUFDtls[].Address` (required) |
| — | PAN | T | `ContributionHUFDtls[].PAN` |
| — | Aadhaar Number | T | `ContributionHUFDtls[].AadhaarCardNo` |

---

## 4 · Dropdown / enum lists (every value, verbatim)

**Yes/No flags** (`(Select), Yes, No`) — rows 12, 16, 26, and the
"Whether Resident of India?" cells (rows 49–50, 55–56).

**(A27 ii) Section under which liable for audit — `sheet1.AuditSection`** (J14) —
`(Select)`, `10(23C)(iv)`, `10(23C)(v)`, `10(23C)(vi)`, `10(23C)(via)`,
`12A(1)(b)`, `92E`, `Others`.

**(A28) Act — `ACT_Description`** (E28) — `(Select)`,
`Foreign Contribution Regulation Act, 2010`, `Companies Act, 2013`,
`Indian Trust Act, 1882`, `Society Registration Act, 1860`,
`Banking Regulation Act, 1949`, `Central Excise Act,1944`,
`Central Sales Tax Act, 1956`, `Central Goods and Services Tax Act, 2017`,
`Charitable and Religious Trust Act, 1920`, `Electricity Act, 2003`,
`Employees Provident Fund and Miscellaneous Provisions Act, 1952`,
`Foreign Exchange Management Act, 1999`,
`Government Superannuation Fund Act, 1956`,
`Integrated Goods and Services Tax Act, 2017`,
`Limited Liability Partnership Act, 2008`, `Payment of Gratuity Act, 1972`,
`SEBI Act, 1992`, `Securities Contract (Regulation) Act, 1956`,
`State Goods and Services Tax Act, 2017`,
`Union Territories Goods and Services Tax Act, 2017`, `Others Any other law`.

**(A29 i) Status — member status** (O39) — `(Select)`, `INDIVIDUAL`, `HUF`,
`FIRM`, `LLP`, `DOMESTIC_COMPANY`, `FOREIGN_COMPANY`, `CO_OPERATIVE_SOCIETY`,
`LOCAL_AUTHORITY`, `TRUST`, `AOP_BOI`, `ANY_OTHER_AJP`.

**(A29 ii A) Relation — `Audit_Gii_Relation`** (F49) — `(Select)`, `Author`,
`Founder`, `Settlor`, `Trustee`, `Members of society`,
`Members of the Governing Council`, `Director`,
`Shareholders holding 5 per cent. or more of shareholding`, `Office Bearer`,
`Principal Officer`, `Person Competent to verify`, `Principal Secretary`,
`Secretary`, `Chief Executive Officer`, `Chief Financial Officer`, `Manager`,
`Representative Assessee`, `Any other Principal Officer`, `Managing director`,
`Authorised signatory`.

**Type of Identification — `Audit_UIN`** (I49 / G55) — `(Select)`, `PAN`,
`Aadhaar`,
`Taxpayer Identification Number of the country where the person resides`,
`Passport number`, `Elector's photo identity number`,
`Driving License number`, `Ration card number`.

### 4a · State codes (`State`, 38 values, member address)

(Select), 01-ANDAMAN AND NICOBAR ISLANDS, 02-ANDHRA PRADESH,
03-ARUNACHAL PRADESH, 04-ASSAM, 05-BIHAR, 06-CHANDIGARH,
07-DADRA NAGAR AND HAVELI, 08-DAMAN AND DIU, 09-DELHI, 10-GOA, 11-GUJARAT,
12-HARYANA, 13-HIMACHAL PRADESH, 14-JAMMU AND KASHMIR, 15-KARNATAKA, 16-KERALA,
17-LAKHSWADEEP, 18-MADHYA PRADESH, 19-MAHARASHTRA, 20-MANIPUR, 21-MEGHALAYA,
22-MIZORAM, 23-NAGALAND, 24-ODISHA, 25-PUDUCHERRY, 26-PUNJAB, 27-RAJASTHAN,
28-SIKKIM, 29-TAMILNADU, 30-TRIPURA, 31-UTTAR PRADESH, 32-WEST BENGAL,
33-CHHATISHGARH, 34-UTTARAKHAND, 35-JHARKHAND, 36-TELANGANA, 37-LADAKH,
99-FOREIGN.

### 4b · Country/Region codes (`Country`, 250 values)

(Select), 93-AFGHANISTAN, 1001-ALAND ISLANDS, 355-ALBANIA, 213-ALGERIA, 684-AMERICAN SAMOA, 376-ANDORRA, 244-ANGOLA, 1264-ANGUILLA, 1010-ANTARCTICA, 1268-ANTIGUA AND BARBUDA, 54-ARGENTINA, 374-ARMENIA, 297-ARUBA, 61-AUSTRALIA, 43-AUSTRIA, 994-AZERBAIJAN, 1242-BAHAMAS, 973-BAHRAIN, 880-BANGLADESH, 1246-BARBADOS, 375-BELARUS, 32-BELGIUM, 501-BELIZE, 229-BENIN, 1441-BERMUDA, 975-BHUTAN, 591-BOLIVIA (PLURINATIONAL STATE OF), 1002-BONAIRE, SINT EUSTATIUS AND SABA, 387-BOSNIA AND HERZEGOVINA, 267-BOTSWANA, 1003-BOUVET ISLAND, 55-BRAZIL, 1014-BRITISH INDIAN OCEAN TERRITORY, 673-BRUNEI DARUSSALAM, 359-BULGARIA, 226-BURKINA FASO, 257-BURUNDI, 238-CABO VERDE, 855-CAMBODIA, 237-CAMEROON, 1-CANADA, 1345-CAYMAN ISLANDS, 236-CENTRAL AFRICAN REPUBLIC, 235-CHAD, 56-CHILE, 86-CHINA, 9-CHRISTMAS ISLAND, 672-COCOS (KEELING) ISLANDS, 57-COLOMBIA, 270-COMOROS, 242-CONGO, 243-CONGO (DEMOCRATIC REPUBLIC OF THE), 682-COOK ISLANDS, 506-COSTA RICA, 225-COTE DIVOIRE, 385-CROATIA, 53-CUBA, 1015-CURACAO, 357-CYPRUS, 420-CZECHIA, 45-DENMARK, 253-DJIBOUTI, 1767-DOMINICA, 1809-DOMINICAN REPUBLIC, 593-ECUADOR, 20-EGYPT, 503-EL SALVADOR, 240-EQUATORIAL GUINEA, 291-ERITREA, 372-ESTONIA, 251-ETHIOPIA, 500-FALKLAND ISLANDS (MALVINAS), 298-FAROE ISLANDS, 679-FIJI, 358-FINLAND, 33-FRANCE, 594-FRENCH GUIANA, 689-FRENCH POLYNESIA, 1004-FRENCH SOUTHERN TERRITORIES, 241-GABON, 220-GAMBIA, 995-GEORGIA, 49-GERMANY, 233-GHANA, 350-GIBRALTAR, 30-GREECE, 299-GREENLAND, 1473-GRENADA, 590-GUADELOUPE, 1671-GUAM, 502-GUATEMALA, 1481-GUERNSEY, 224-GUINEA, 245-GUINEA-BISSAU, 592-GUYANA, 509-HAITI, 1005-HEARD ISLAND AND MCDONALD ISLANDS, 6-HOLY SEE, 504-HONDURAS, 852-HONG KONG, 36-HUNGARY, 354-ICELAND, 91-INDIA, 62-INDONESIA, 98-IRAN (ISLAMIC REPUBLIC OF), 964-IRAQ, 353-IRELAND, 1624-ISLE OF MAN, 972-ISRAEL, 5-ITALY, 1876-JAMAICA, 81-JAPAN, 1534-JERSEY, 962-JORDAN, 7-KAZAKHSTAN, 254-KENYA, 686-KIRIBATI, 850-KOREA (DEMOCRATIC PEOPLES REPUBLIC OF), 82-KOREA (REPUBLIC OF), 965-KUWAIT, 996-KYRGYZSTAN, 856-LAO PEOPLES DEMOCRATIC REPUBLIC, 371-LATVIA, 961-LEBANON, 266-LESOTHO, 231-LIBERIA, 218-LIBYA, 423-LIECHTENSTEIN, 370-LITHUANIA, 352-LUXEMBOURG, 853-MACAO, 389-MACEDONIA (THE FORMER YUGOSLAV REPUBLIC OF), 261-MADAGASCAR, 265-MALAWI, 60-MALAYSIA, 960-MALDIVES, 223-MALI, 356-MALTA, 692-MARSHALL ISLANDS, 596-MARTINIQUE, 222-MAURITANIA, 230-MAURITIUS, 269-MAYOTTE, 52-MEXICO, 691-MICRONESIA (FEDERATED STATES OF), 373-MOLDOVA (REPUBLIC OF), 377-MONACO, 976-MONGOLIA, 382-MONTENEGRO, 1664-MONTSERRAT, 212-MOROCCO, 258-MOZAMBIQUE, 95-MYANMAR, 264-NAMIBIA, 674-NAURU, 977-NEPAL, 31-NETHERLANDS, 687-NEW CALEDONIA, 64-NEW ZEALAND, 505-NICARAGUA, 227-NIGER, 234-NIGERIA, 683-NIUE, 15-NORFOLK ISLAND, 1670-NORTHERN MARIANA ISLANDS, 47-NORWAY, 968-OMAN, 92-PAKISTAN, 680-PALAU, 970-PALESTINE, STATE OF, 507-PANAMA, 675-PAPUA NEW GUINEA, 595-PARAGUAY, 51-PERU, 63-PHILIPPINES, 1011-PITCAIRN, 48-POLAND, 14-PORTUGAL, 1787-PUERTO RICO, 974-QATAR, 262-REUNION, 40-ROMANIA, 8-RUSSIAN FEDERATION, 250-RWANDA, 1006-SAINT BARTHELEMY, 290-SAINT HELENA, ASCENSION AND TRISTAN DA CUNHA, 1869-SAINT KITTS AND NEVIS, 1758-SAINT LUCIA, 1007-SAINT MARTIN (FRENCH PART), 508-SAINT PIERRE AND MIQUELON, 1784-SAINT VINCENT AND THE GRENADINES, 685-SAMOA, 378-SAN MARINO, 239-SAO TOME AND PRINCIPE, 966-SAUDI ARABIA, 221-SENEGAL, 381-SERBIA, 248-SEYCHELLES, 232-SIERRA LEONE, 65-SINGAPORE, 1721-SINT MAARTEN (DUTCH PART), 421-SLOVAKIA, 386-SLOVENIA, 677-SOLOMON ISLANDS, 252-SOMALIA, 28-SOUTH AFRICA, 1008-SOUTH GEORGIA AND THE SOUTH SANDWICH ISLANDS, 211-SOUTH SUDAN, 35-SPAIN, 94-SRI LANKA, 249-SUDAN, 597-SURINAME, 1012-SVALBARD AND JAN MAYEN, 268-SWAZILAND, 46-SWEDEN, 41-SWITZERLAND, 963-SYRIAN ARAB REPUBLIC, 886-TAIWAN, PROVINCE OF CHINA[A], 992-TAJIKISTAN, 255-TANZANIA, UNITED REPUBLIC OF, 66-THAILAND, 670-TIMOR-LESTE(EAST TIMOR), 228-TOGO, 690-TOKELAU, 676-TONGA, 1868-TRINIDAD AND TOBAGO, 216-TUNISIA, 90-TURKEY, 993-TURKMENISTAN, 1649-TURKS AND CAICOS ISLANDS, 688-TUVALU, 256-UGANDA, 380-UKRAINE, 971-UNITED ARAB EMIRATES, 44-UNITED KINGDOM OF GREAT BRITAIN AND NORTHERN IRELAND, 2-UNITED STATES OF AMERICA, 1009-UNITED STATES MINOR OUTLYING ISLANDS, 598-URUGUAY, 998-UZBEKISTAN, 678-VANUATU, 58-VENEZUELA (BOLIVARIAN REPUBLIC OF), 84-VIET NAM, 1284-VIRGIN ISLANDS (BRITISH), 1340-VIRGIN ISLANDS (U.S.), 681-WALLIS AND FUTUNA, 1013-WESTERN SAHARA, 967-YEMEN, 260-ZAMBIA, 263-ZIMBABWE, 9999-OTHERS.

---

## 5 · `OtherDetailsFor7` — the part of this block that lives on the PI sheet

The `OtherDetailsFor7` fields of `PartA_GEN2` are **required** schema keys of
this block, but their live rows (A23 section 2(15) test, A24 change in
activities, A25 first return, A26 22nd-proviso/13(10)) are on the **PI** sheet
(rows 91–146), documented there in Block 9. Repeated here because this book is
the sole input for the `PartA_GEN2` builder:

| Item | Meaning | Schema key |
|---|---|---|
| A23 i | charitable purpose of advancement of general public utility | `OtherDetailsFor7.OtherDetailsUs2_15.CharitablePurposeOfGeneralPublic` |
| A23 ai | activity in the nature of trade, commerce or business (proviso to 2(15)) | `...OtherDetailsUs2_15.ActivityNature2_15` |
| A23 aii | percentage of receipt from such activity | `...OtherDetailsUs2_15.PercntNatureOfTrade` |
| A23 bi | activity of rendering service in relation to trade/commerce | `...OtherDetailsUs2_15.ActivityRendering2_15` |
| A23 bii | percentage of receipt from such activity | `...OtherDetailsUs2_15.PercntAnyTrade` |
| A23 ii | aggregate annual receipts of the institution | `...AggAnnualRecptsofInst[]` — `NameOfTheInstitution` (req), `AggregateAnnualReceipts` (req) |
| A24 i | change in objects/activities during the year | `OtherDetailsFor7.ChangeInActivitiesDuringYr` |
| A24 A | date of such change | `OtherDetailsFor7.DateOfChange` |
| A24 B | fresh registration applied u/s 12A | `OtherDetailsFor7.FreshRegSec12A` |
| A24 C | fresh registration granted u/s 12AA/12AB | `OtherDetailsFor7.FreshRegGrantedUs12AA` |
| A24 D | date of fresh registration | `OtherDetailsFor7.DateOfFreshReg` |
| A25 | first return flag | `OtherDetailsFor7.FirstReturnFlag` (required) |
| A26 | 22nd proviso to 10(23C) / section 13(10) applicable | `OtherDetailsFor7.ProvisionsSec1310Applcbl` (required) |
| A26 a | proviso to clause (15) of section 2 applicable | `OtherDetailsFor7.Clause15Sec2ProvisioFlag` |
| A26 b | tenth-proviso clause (a) / sub-clause (i) 12A conditions | `OtherDetailsFor7.SubClauseiSec12AViolateFlag` |
| A26 c | tenth-proviso clause (b) / sub-clause (ii) 12A conditions | `OtherDetailsFor7.SubClauseiiSec12AViolateFlag` |
| A26 d | twentieth proviso to 10(23C) / clause (ba) of 12A(1) | `OtherDetailsFor7.SubSec1Sec12AViolateFlag` |

---

## 6 · The law / computation substance the builder must encode

1. **Audit is a pre-condition of exemption.** For a 12A/12AB-registered trust or
   a 10(23C) institution above the threshold, the accounts must be audited and
   the report (Form 10B/10BB) furnished before the due date. `LiableSec44ABflg`
   Yes ⇒ the `AuditDetails[]` card (section, audited-by-accountant flag, auditor
   name, firm PAN/Aadhaar, date of furnishing, acknowledgement number) becomes
   mandatory. `AuditedSection` picks the provision (10(23C)(iv)/(v)/(vi)/(via),
   12A(1)(b), 92E, Others) under which the audit is required.
2. **Other-Act audit (A28).** `LiableAnyOthThnINTActflg` Yes ⇒ the
   `LiableAnyOthThnINTActDetails[]` table (Act, description, section, date) is
   mandatory — e.g. FCRA, Companies Act, a State/Central GST Act, LLP Act.
3. **Governance disclosure (A29).** The AOP-member table applies when the status
   is AOP/BOI; `SharePercentage` "if determinate" feeds the s.167B rate logic.
   The author/founder/trustee tables (A, B, C, D) are the section 13(3)
   "interested persons" universe — a benefit to any of them triggers section
   13(1)(c)/(d) and loss of exemption; the non-individual table adds beneficial
   ownership, and C/D capture large contributors and their relatives.
4. **`OtherDetailsFor7` (2(15)/13(10))** encodes the anti-abuse tests described
   in §5: general-public-utility bodies lose "charitable purpose" if
   trade/commerce receipts exceed the statutory percentage, and a violation of
   registration conditions triggers section 13(10) / the 22nd proviso to
   10(23C).
5. **Dates are `DD/MM/YYYY`** — audit report furnishing, other-Act audit date,
   change, fresh registration.

---

## Appendix 1 · Every schema leaf of block `PartA_GEN2` (full paths)
`*` = required.
```
* OtherDetailsFor7.OtherDetailsUs2_15.CharitablePurposeOfGeneralPublic string
  OtherDetailsFor7.OtherDetailsUs2_15.ActivityNature2_15 string
  OtherDetailsFor7.OtherDetailsUs2_15.PercntNatureOfTrade number
  OtherDetailsFor7.OtherDetailsUs2_15.ActivityRendering2_15 string
  OtherDetailsFor7.OtherDetailsUs2_15.PercntAnyTrade number
  OtherDetailsFor7.OtherDetailsUs2_15.AggAnnualRecptsofInst[] array
* OtherDetailsFor7.OtherDetailsUs2_15.AggAnnualRecptsofInst[].NameOfTheInstitution string
* OtherDetailsFor7.OtherDetailsUs2_15.AggAnnualRecptsofInst[].AggregateAnnualReceipts integer
  OtherDetailsFor7.ChangeInActivitiesDuringYr string
  OtherDetailsFor7.DateOfChange string
  OtherDetailsFor7.FreshRegSec12A string
  OtherDetailsFor7.FreshRegGrantedUs12AA string
  OtherDetailsFor7.DateOfFreshReg string
* OtherDetailsFor7.FirstReturnFlag string
* OtherDetailsFor7.ProvisionsSec1310Applcbl string
  OtherDetailsFor7.Clause15Sec2ProvisioFlag string
  OtherDetailsFor7.SubClauseiSec12AViolateFlag string
  OtherDetailsFor7.SubClauseiiSec12AViolateFlag string
  OtherDetailsFor7.SubSec1Sec12AViolateFlag string
* LiableSec44ABflg string
  AuditDetails[] array
* AuditDetails[].AuditedSection string
* AuditDetails[].AuditFlag string
  AuditDetails[].AudFrmName string
  AuditDetails[].AudFrmPAN string
  AuditDetails[].AudFrmAadhaar string
  AuditDetails[].AuditReportFurnishDate string
  AuditDetails[].AckNumAudtRpt integer
  AuditDetails[].OtherSectionDesc string
* LiableAnyOthThnINTActflg string
  LiableAnyOthThnINTActDetails[] array
* LiableAnyOthThnINTActDetails[].AuditedAct string
  LiableAnyOthThnINTActDetails[].AuditedActOther string
* LiableAnyOthThnINTActDetails[].AuditedSection string
* LiableAnyOthThnINTActDetails[].DateOfAudit string
  PartnerOrMemberInfo[] array
* PartnerOrMemberInfo[].PartnerOrMemberName string
* PartnerOrMemberInfo[].AddressDetailWithZipCode.AddrDetail string
* PartnerOrMemberInfo[].AddressDetailWithZipCode.CityOrTownOrDistrict string
* PartnerOrMemberInfo[].AddressDetailWithZipCode.StateCode string
* PartnerOrMemberInfo[].AddressDetailWithZipCode.CountryCode string
  PartnerOrMemberInfo[].AddressDetailWithZipCode.PinCode integer
  PartnerOrMemberInfo[].AddressDetailWithZipCode.ZipCode string
  PartnerOrMemberInfo[].SharePercentage number
  PartnerOrMemberInfo[].PAN string
  PartnerOrMemberInfo[].AadhaarCardNo string
* PartnerOrMemberInfo[].Status string
  AuthorFounderDtls5percent[] array
* AuthorFounderDtls5percent[].Name string
* AuthorFounderDtls5percent[].Relation string
* AuthorFounderDtls5percent[].ShareHoldingPercentage number
* AuthorFounderDtls5percent[].ResidentOfIndia string
  AuthorFounderDtls5percent[].UniqueIdentNumber string
  AuthorFounderDtls5percent[].IDCode string
* AuthorFounderDtls5percent[].Address string
* AuthorFounderDtls5percent[].MobileNo integer
* AuthorFounderDtls5percent[].EmailAddress string
  AuthorFounderDtls5percentNonInd[] array
* AuthorFounderDtls5percentNonInd[].Name string
* AuthorFounderDtls5percentNonInd[].ResidentOfIndia string
  AuthorFounderDtls5percentNonInd[].UniqueIdentNumber string
  AuthorFounderDtls5percentNonInd[].IDCode string
* AuthorFounderDtls5percentNonInd[].Address string
* AuthorFounderDtls5percentNonInd[].BeneficialPercentage number
  ContributionUs13_3bDtls[] array
* ContributionUs13_3bDtls[].Name string
* ContributionUs13_3bDtls[].Address string
  ContributionUs13_3bDtls[].PAN string
  ContributionUs13_3bDtls[].AadhaarCardNo string
  ContributionHUFDtls[] array
* ContributionHUFDtls[].Name string
* ContributionHUFDtls[].Address string
  ContributionHUFDtls[].PAN string
  ContributionHUFDtls[].AadhaarCardNo string
```

---

## Appendix 2 · Every live row of the sheet, verbatim
Rows flagged `H` are hidden (read, not built).
```
[D3]H H1. Are you liable for Audit u/s 92E?  |  [E3] No  |  [F3] If yes, furnish following information-
[E4]H Date of Audit (DD/MM/YYYY)  |  [S4] No
[E5]H Name of the auditor signing the audit report
[E6]H Membership no. of the auditor
[E7]H Name of the auditor (proprietorship/ firm)
[E8]H Permanent Account Number (PAN) of the proprietorship/ firm
[E9]H Date of audit report
[E10]H Date of furnishing of the audit report (DD/MM/YYYY)
[D12] (A27)(i). Are you liable for audit under the Income-tax Act? If yes, furnish following information  |  [J12] (Select)
[C14] AUDIT INFORMATION  |  [D14] (ii)  |  [E14] Section under which you are liable for audit (specify section).Please mention date of audit report
[E15] Others Section Name (Enter in case ,if the above section is "Others")
[E16] Whether the accounts have been audited by an accountant?
[D17] a  |  [E17] Name of the auditor (proprietorship/ firm)
[D18] b  |  [E18] Permanent Account Number (PAN) of the proprietorship/ firm
[E19] Aadhaar Number of the proprietorship
[D20] c  |  [E20] Date of furnishing of the audit report
[D21] d  |  [E21] Acknowledgement number of the audit report
[D26] (A28)(i). If liable to audit under any Act other than the Income-tax Act, mention the Act, section a  |  [J26] (Select)
[D27] Sl.No.  |  [E27] Act  |  [F27] Description  |  [G27] Section  |  [H27] Date
[D36] (A29)(i). Particulars of persons who are members in the AOP on 31st day of March, 2026 (to be filled
[D37] Sl.No. (1)  |  [E37] Name (2)  |  [F37] Address (3)  |  [L37] Percentage of share (if determinate) (4)  |  [M37] PAN (5)  |  [N37] Aadhaar Number (6)  |  [O37] Status (7)
[F38] Address  |  [G38] City  |  [H38] State  |  [I38] Country  |  [J38] Pin Code  |  [K38] Zip Code
[D45] (A29)(ii). Particulars regarding the Author(s) / Founder(s) / Trustee(s) / Manager(s) etc., of the T
[D46] A. Details of all the Author (s)/ Founder (s)/ Settlor (s)/Trustee (s)/ Members of society/Members o
[D47] Sl.No.  |  [E47] Name  |  [F47] Relation  |  [G47] Percentage Of shareholding in case of shareholder  |  [H47] Whether Resident of India?  |  [I47] Type of Identification (Select from drop down)  |  [J47] Identification Number  |  [K47] Address  |  [Q47] Mobile number  |  [R47] E-mail address
[D52] B. In case if any of persons (as mentioned in row A above) is not an individual then provide the fol
[D53] Sl. No.  |  [E53] Name  |  [F53] Whether Resident of India?  |  [G53] Type of Identification (Select from drop down)  |  [H53] Identification Number  |  [I53] Address  |  [O53] Percentage of beneficial ownership
[D58] C. Name(s) of the person(s) whose total contribution to the trust or institution, during the relevan
[D59] Sl. No.  |  [E59] Name  |  [F59] Address  |  [L59] PAN  |  [M59] Aadhaar Number
[D64] D. Name(s) of relative(s) of author(s), founder(s),member(s),trustee(s), manager(s),and where any su
[D65] Sl. No.  |  [E65] Name  |  [F65] Address  |  [L65] PAN  |  [M65] Aadhaar Number
```

---

## Appendix 3 · Every dropdown value (verbatim)
```
J-flags "(Select),Yes,No" => (Select) | Yes | No
sheet1.AuditSection => (Select) | 10(23C)(iv) | 10(23C)(v) | 10(23C)(vi) | 10(23C)(via) | 12A(1)(b) | 92E | Others
member status => (Select) | INDIVIDUAL | HUF | FIRM | LLP | DOMESTIC_COMPANY | FOREIGN_COMPANY | CO_OPERATIVE_SOCIETY | LOCAL_AUTHORITY | TRUST | AOP_BOI | ANY_OTHER_AJP
ACT_Description => (Select) | Foreign Contribution Regulation Act, 2010 | Companies Act, 2013 | Indian Trust Act, 1882 | Society Registration Act, 1860 | Banking Regulation Act, 1949 | Central Excise Act,1944 | Central Sales Tax Act, 1956 | Central Goods and Services Tax Act, 2017 | Charitable and Religious Trust Act, 1920 | Electricity Act, 2003 | Employees Provident Fund and Miscellaneous Provisions Act, 1952 | Foreign Exchange Management Act, 1999 | Government Superannuation Fund Act, 1956 | Integrated Goods and Services Tax Act, 2017 | Limited Liability Partnership Act, 2008 | Payment of Gratuity Act, 1972 | SEBI Act, 1992 | Securities Contract (Regulation) Act, 1956 | State Goods and Services Tax Act, 2017 | Union Territories Goods and Services Tax Act, 2017 | Others Any other law
Audit_Gii_Relation => (Select) | Author | Founder | Settlor | Trustee | Members of society | Members of the Governing Council | Director | Shareholders holding 5 per cent. or more of shareholding | Office Bearer | Principal Officer | Person Competent to verify | Principal Secretary | Secretary | Chief Executive Officer | Chief Financial Officer | Manager | Representative Assessee | Any other Principal Officer | Managing director | Authorised signatory
Audit_UIN => (Select) | PAN | Aadhaar | Taxpayer Identification Number of the country where the person resides | Passport number | Elector's photo identity number | Driving License number | Ration card number
State => (see §4a — 38 values, (Select) … 99-FOREIGN)
Country => (see §4b — 250 values, (Select) … 9999-OTHERS)
```
