# The book of Schedule EI — Exempt income · ITR-3, A.Y. 2026-27

Read row by row from the utility's **EI** sheet, with the hidden-row flags,
the formulas and the dropdowns, and confirmed against the schema block
`ScheduleEI`.

*"Schedule EI — Details of Exempt Income (Income not to be included in total
income or not chargeable to tax)."* Nothing on this schedule is taxed; but one
line here **affects the tax** — the net agricultural income at Sl. No. 2 is
carried for rate purposes (partial integration), and two lines reconcile to
other schedules — item 2(iv) ties to Sl. No. 38 of Schedule BP, and item 5 (pass
through income) ties to Schedule PTI.

---

## The shape

Six numbered lines. Line 1 is one figure (interest income). Line 2 is the
agricultural-income working (i to vi) with a land table above ₹5 lakh. Line 3
is the other-exempt-income table with two dependent dropdowns. Line 4 is the
DTAA not-chargeable table for non-residents. Line 5 is the pass-through figure
from Schedule PTI. Line 6 is the computed total `1 + 2(v) + 3 + 4 + 5`.

---

## The items

### Block `ScheduleEI`

| Sl. no. | Field label | Type | Schema key | Rule / notes |
|---|---|---|---|---|
| **1** | Interest income (under EXEMPT INCOME) | one figure | `InterestInc` | |
| **2 i** | Gross Agricultural receipts (other than income to be excluded under rule 7A, 7B or 8 of I.T. Rules) | one figure | `GrossAgriRecpt` | |
| **2 ii** | Expenditure incurred on agriculture | one figure | `ExpIncAgri` | |
| **2 iii** | Unabsorbed agricultural loss of previous eight assessment years | one figure | `UnabAgriLossPrev8` | |
| **2 iv** | Agricultural income portion relating to Rule 7, 7A, 7B(1), 7B(1A) and 8 (from Sl. No. 38 of Sch. BP) | computed | `AgriIncRule7and8` | `= MAX(0, BP_BalanceOfIncome39)` |
| **2 v** | Net Agricultural income for the year (i – ii – iii + iv) (enter nil if loss) | computed, **required** | `NetAgriIncOrOthrIncRule7` | floored at nil |
| **2 vi** | In case the net agricultural income for the year exceeds Rs.5 lakhs, please furnish the following details — the land table | table (see below) | `ExcNetAgriInc.ExcNetAgriIncDtls[]` | required when 2(v) > ₹5,00,000 |
| **3** | Other exempt income, (including exempt income of minor child) (please specify) — the category table | table (see below) | `OthersInc.OthersIncDtls[]` | |
| **3 total** | Total (other exempt income) | computed | `Others` | `= SUM(EI.Amount)` |
| **4** | Income claimed as not chargeable to tax as per DTAA (Applicable for Non-residents only) — the DTAA table | table (see below) | `IncNotChrgblAsPerDTAA.IncNotChrgblAsPerDTAADtls[]` | |
| **4 total** | Total Income from DTAA claimed as not chargeable to tax | computed | `IncChrgblAsPerDTAA` | `= SUM(SCHEI_DTAA_AmountOfIncome)` |
| **5** | Pass through income claimed as not chargeable to tax (Schedule PTI) | one figure | `PassThrIncNotChrgblTax` | from Schedule PTI |
| **6** | Total (1 + 2(v) + 3 + 4 + 5) | computed, **required** | `TotalExemptInc` | |

### Line 2(vi) — the land table `ExcNetAgriInc.ExcNetAgriIncDtls[]`

| Column | Field label | Type | Schema key | Options |
|---|---|---|---|---|
| Sl. No. | | | | |
| a | Name of district along with pin code in which agricultural land is located — Name of district | text (max 125) | `NameOfDistrict` | required per row |
| a | Pin code | integer (6-digit) | `PinCode` | 100000–999999, required |
| b | Measurement of agricultural land in Acre | number | `MeasurementOfLand` | required |
| c | Whether the agricultural land is owned or held on lease | flag | `AgriLandOwnedFlag` | **O — Owned · H — Held on Lease** |
| d | Whether the agricultural land is irrigated or rain-fed | flag | `AgriLandIrrigatedFlag` | **IRG — Irrigated · RF — Rain-fed** |

### Line 3 — the other-exempt-income table `OthersInc.OthersIncDtls[]`

| Column | Field label | Type | Schema key | Notes |
|---|---|---|---|---|
| Sl.No. | | | | |
| Category | Category | dropdown (9) | `Category` | see Dropdowns |
| Sub-Category | Sub-Category | dropdown (63 enum / 57 in the list) | `SubCategory` | dependent on Category |
| Description | Description | text (max 125) | `Description` | |
| Amount | Amount | integer, **required** | `OthAmount` | |

### Line 4 — the DTAA table `IncNotChrgblAsPerDTAA.IncNotChrgblAsPerDTAADtls[]`

| Column | Field label | Type | Schema key | Notes |
|---|---|---|---|---|
| Sl. No. | | | | |
| Amount of Income | Amount of Income | integer, **required** | `AmountOfIncome` | |
| Nature of Income | Nature of Income | text (max 75) | `NatureOfIncome` | |
| Country name & code | Country name | text (max 55), **required** | `CountryName` | |
| Country name & code | Country code | dropdown, **required** | `CountryCodeExcludingIndia` | the 249-code list, India excluded |
| Article of DTAA | Article of DTAA | text (max 16) | `ArticleOfDTAA` | |
| Head of Income | Head of Income | dropdown (5), **required** | `HeadOfIncome` | **SA · HP · PG · CG · OS** |
| Whether TRC obtained | Whether TRC obtained | dropdown | `TRCFlag` | **Y · N** |

---

## The rules the sheet computes

- **`[J10]` = MAX(0, BP_BalanceOfIncome39)** — item 2(iv), the Rule 7/7A/7B/8
  agricultural portion, taken from Sl. No. 38 (A38, balance of income deemed to
  be from agriculture) of Schedule BP; floored at nil.
- **`[J11]`** — item 2(v), net agricultural income
  `= MAX(0, NetAgriIncOrOthrIncRule7 − ExpenditureOnAgriculture − UnabsorbedAgric…)`
  i.e. i − ii − iii + iv, floored at nil (enter nil if loss).
- **`[E17]` = E16+1, `[E18]` = E17+1, `[E19]` = E18+1** — running Sl. No. of the land table.
- **`[I27]` = SUM(EI.Amount)** — item 3 total, `Others`.
- **`[E24]` = E23+1, `[E25]`, `[E26]`** — running Sl. No. of the other-exempt table.
- **`[D33]` = D32+1, `[D34]`, `[D35]`** — running Sl. No. of the DTAA table.
- **`[J37]` = SUM(SCHEI_DTAA_AmountOfIncome)** — item 4 total, `IncChrgblAsPerDTAA`.
- **`[N38]` = SUM(0, InterestInc, DividendInc, NetAgriIncOrOthrIncRule7 …)** — the pass-through helper.
- **`[J39]` = MAX(0, SUM(InterestInc, DividendInc, NetAgriculturalIncome …))** —
  item 6 total, `TotalExemptInc` = 1 + 2(v) + 3 + 4 + 5, floored at nil.

Cross-sheet rules from `rules.json`: in Schedule Part B-TI, net agricultural
income for rate purpose must equal the value at Sl. No. 2 of Schedule EI; item
2(iv) must equal Sl. No. 38 of Schedule BP; item 5 pass-through must equal the
exempt income in Schedule PTI; when net agricultural income exceeds ₹5 lakh the
details of each agricultural land must be filled.

---

## Dropdowns

**Land — owned or held on lease** (`I16:I19`): `(Select)`, `Owned`, `Held on Lease`.

**Land — irrigated or rain-fed** (`J16:J19`): `(Select)`, `Irrigated`, `Rain-fed`.

**Other exempt income — Category** (`F23:F26`, source `Nature_TP1`): `(Select)`,
`Agricultural  & related incomes`,
`Compensation/other sums received by government or other approved entities`,
`Income from specified Investments`,
`Specified sums received by armed forces personnel`,
`Sums received by Senior Citizens/Minors`,
`Sums received by specified Category of Taxpayers`,
`Sums received from policies/contributions such as LIC/NPS/PF/Sukanya Samriddhi Yojana`,
`Other Incomes`.

**Other exempt income — Sub-Category** (`G23`, source `EI_SubCategoryDropdown1`, dependent on Category):
`(Select)`,
`10(30)-subsidy received from or through the Tea Board`,
`10(31)-Subsidy received for Rubber/Coffee/Tea  replantation, replacement, rejuvenation etc.`,
`10(37) Capital gains on compulsory acquisition of urban agricultural land`,
`10(10BB)-payments made under the Bhopal Gas Leak Disaster`,
`10(10BC)-amount from the Central/State Govt./local authority by way of compensation on account of any disaster`,
`10(17A)-Award instituted by Government`,
`10(12AB)-any sum received as lump sum amount as per clause (vi) of paragraph 2 of the notification number FX-1/3/2024-PR`,
`10(15)-Interest on specified securities/investments`,
`10(23FBB)-income referred to in section 115UB, accruing or arising to, or received by, a unit holder of an investment fund`,
`10(23FD)Unit holder income from Business Trust (certain parts)`,
`10(35)-Income from specified Mutual Funds`,
`10(35A)-distributed income referred to in section 115TA received from a securitisation trust`,
`10(23FBC) Any income from a unit holder from a specified fund or on transfer of units in a specified fund`,
`10(33) Income from transfer of capital asset being a unit of the Unit Scheme, 1964`,
`10(4B)-Interest on specified savings certificates`,
`10(4C)-Interest on Rupee denominated bonds (specific window)`,
`10(4E)-Non-deliverable forwards/ODI/OTC with IFSC OBU`,
`10(36)-LTCG on certain listed shares (public issue)`,
`10(37A)-any income chargeable under the head "Capital gains" in respect of transfer of a specified capital asset`,
`10(12C)-Agniveer Corpus Fund income`,
`10(18)-Pension received by winner of  "Param Vir Chakra" or "Maha Vir Chakra" or "Vir Chakra" or such other gallantry award`,
`10(19)-Armed Forces Family pension in case of death during operational duty`,
`Defense Medical Disability Pension`,
`10(32)-Minor child’s income—small exemption`,
`10(43)-Reverse mortgage—payments to senior citizens`,
`10(19A)-Annual value of one palace in occupation of ex-ruler`,
`10(26)-Any income as referred to in section 10(26)`,
`10(26AAA)-Any income as referred to in section 10(26AAA)`,
`10(10D)-Any sum received under a life insurance policy, including the sum allocated by way of bonus on such policy except sum as mentioned in sub-clause (a) to (d) of Sec.10(10D)`,
`10(11)-Statutory Provident Fund received`,
`10(11A)-Sum received from an account opened under the Sukanya Samriddhi Yojana`,
`10(12)-Recognized Provident Fund received`,
`10(12A)-Any payment from the National Pension System Trust to an assessee`,
`10(12AA)-any payment from the National Pension System Trust`,
`10(12B)-Any payment from the National Pension System Trust to an Central Govt. Employee`,
`10(12BA)-partial withdrawal made from the National Pension System`,
`10(13)-Approved superannuation fund received`,
`10(2)-Member’s share from HUF`,
`10(16)-Scholarships for education`,
`10(4)(ii)-NRE account interest`,
`10(2A)-Partner’s share in firm/LLP`,
`10(8)-Income of individuals on cooperative technical assistance programmes`,
`10(8A)-Remuneration or any other income of Consultant`,
`10(8B)-Income from tech assistance programme in accordance with an agreement entered into by the Central Government and the agency`,
`10(9)-Income of any family member of any individual accompanying him to India, which accrues or arises outside India`,
`Income exempt as per CBDT Circular`,
`Income exempt as per CBDT Notification`,
`Receipts not in the nature of income`,
`10(4)(i)-Interest on specified bonds`,
`10(4F)-Royalty/interest on lease of aircraft/ship by IFSC unit`,
`10(4G)-Portfolio income managed in IFSC OBU accruing outside India`,
`10(6B)-Tax paid under Govt/international agreements (non-salary)`,
`10(6D)-Royalty/FTS to non-resident for services to NTRO`,
`10(4H)-Income from business of leasing of an aircraft`,
`10(6BB)-Tax paid on consideration for aircraft/engine leases (approved by CG)`,
`10(23FF)-Capital Gains on transfer of shares from wholly owned special purpose vehicle to the resultant fund in relocation`.

The `SubCategory` schema enum carries **63 codes**: `10(30)`, `10(31)`, `10(37)`,
`10(10BB)`, `10(10BC)`, `10(17A)`, `10(12AB)`, `10(15)`, `10(23FBB)`, `10(23FD)`,
`10(35)`, `10(35A)`, `10(23FBC)`, `10(33)`, `10(4B)`, `10(4C)`, `10(4E)`,
`10(36)`, `10(37A)`, `10(12C)`, `10(18)`, `10(19)`, `10(23AA)`, `DMD`, `10(32)`,
`10(43)`, `10(19A)`, `10(26)`, `10(26AAA)`, `10(10D)`, `10(11)`, `10(11A)`,
`10(12)`, `10(12A)`, `10(12AA)`, `10(12B)`, `10(12BA)`, `10(13)`, `10(25)`,
`10(44)`, `10(2)`, `10(16)`, `10(4)(ii)`, `10(2A)`, `10(8)`, `10(8A)`, `10(8B)`,
`10(9)`, `10(4)(i)`, `10(4F)`, `10(4G)`, `10(6B)`, `10(6D)`, `10(4H)`, `10(6BB)`,
`10(23FF)`, `Incmexmptcircular`, `Incmexmptnotification`, `Receiptnotincme`,
`Anyother1`, `Anyother2`, `Anyother3`, `Anyother4`. The `Category` enum carries
the 9 codes `AGRI`, `GOVC`, `ISI`, `SSRA`, `SRSC`, `SRST`, `SRPC`, `OTH`, `OTHN`.
The build filters the sub-category list by the chosen category exactly as the
utility's dependent dropdown does.

**DTAA — Country name & code** (`G32:G35`, source `Country_NoIndia`): the
country code list, **India excluded**, the full list being:
`(Select)`, `93-AFGHANISTAN`, `1001-ALAND ISLANDS`, `355-ALBANIA`, `213-ALGERIA`, `684-AMERICAN SAMOA`, `376-ANDORRA`, `244-ANGOLA`, `1264-ANGUILLA`, `1010-ANTARCTICA`, `1268-ANTIGUA AND BARBUDA`, `54-ARGENTINA`, `374-ARMENIA`, `297-ARUBA`, `61-AUSTRALIA`, `43-AUSTRIA`, `994-AZERBAIJAN`, `1242-BAHAMAS`, `973-BAHRAIN`, `880-BANGLADESH`, `1246-BARBADOS`, `375-BELARUS`, `32-BELGIUM`, `501-BELIZE`, `229-BENIN`, `1441-BERMUDA`, `975-BHUTAN`, `591-BOLIVIA (PLURINATIONAL STATE OF)`, `1002-BONAIRE, SINT EUSTATIUS AND SABA`, `387-BOSNIA AND HERZEGOVINA`, `267-BOTSWANA`, `1003-BOUVET ISLAND`, `55-BRAZIL`, `1014-BRITISH INDIAN OCEAN TERRITORY`, `673-BRUNEI DARUSSALAM`, `359-BULGARIA`, `226-BURKINA FASO`, `257-BURUNDI`, `238-CABO VERDE`, `855-CAMBODIA`, `237-CAMEROON`, `1-CANADA`, `1345-CAYMAN ISLANDS`, `236-CENTRAL AFRICAN REPUBLIC`, `235-CHAD`, `56-CHILE`, `86-CHINA`, `9-CHRISTMAS ISLAND`, `672-COCOS (KEELING) ISLANDS`, `57-COLOMBIA`, `270-COMOROS`, `242-CONGO`, `243-CONGO (DEMOCRATIC REPUBLIC OF THE)`, `682-COOK ISLANDS`, `506-COSTA RICA`, `225-COTE DIVOIRE`, `385-CROATIA`, `53-CUBA`, `1015-CURACAO`, `357-CYPRUS`, `420-CZECHIA`, `45-DENMARK`, `253-DJIBOUTI`, `1767-DOMINICA`, `1809-DOMINICAN REPUBLIC`, `593-ECUADOR`, `20-EGYPT`, `503-EL SALVADOR`, `240-EQUATORIAL GUINEA`, `291-ERITREA`, `372-ESTONIA`, `251-ETHIOPIA`, `500-FALKLAND ISLANDS (MALVINAS)`, `298-FAROE ISLANDS`, `679-FIJI`, `358-FINLAND`, `33-FRANCE`, `594-FRENCH GUIANA`, `689-FRENCH POLYNESIA`, `1004-FRENCH SOUTHERN TERRITORIES`, `241-GABON`, `220-GAMBIA`, `995-GEORGIA`, `49-GERMANY`, `233-GHANA`, `350-GIBRALTAR`, `30-GREECE`, `299-GREENLAND`, `1473-GRENADA`, `590-GUADELOUPE`, `1671-GUAM`, `502-GUATEMALA`, `1481-GUERNSEY`, `224-GUINEA`, `245-GUINEA-BISSAU`, `592-GUYANA`, `509-HAITI`, `1005-HEARD ISLAND AND MCDONALD ISLANDS`, `6-HOLY SEE`, `504-HONDURAS`, `852-HONG KONG`, `36-HUNGARY`, `354-ICELAND`, `62-INDONESIA`, `98-IRAN (ISLAMIC REPUBLIC OF)`, `964-IRAQ`, `353-IRELAND`, `1624-ISLE OF MAN`, `972-ISRAEL`, `5-ITALY`, `1876-JAMAICA`, `81-JAPAN`, `1534-JERSEY`, `962-JORDAN`, `7-KAZAKHSTAN`, `254-KENYA`, `686-KIRIBATI`, `850-KOREA (DEMOCRATIC PEOPLES REPUBLIC OF)`, `82-KOREA (REPUBLIC OF)`, `965-KUWAIT`, `996-KYRGYZSTAN`, `856-LAO PEOPLES DEMOCRATIC REPUBLIC`, `371-LATVIA`, `961-LEBANON`, `266-LESOTHO`, `231-LIBERIA`, `218-LIBYA`, `423-LIECHTENSTEIN`, `370-LITHUANIA`, `352-LUXEMBOURG`, `853-MACAO`, `389-MACEDONIA (THE FORMER YUGOSLAV REPUBLIC OF)`, `261-MADAGASCAR`, `265-MALAWI`, `60-MALAYSIA`, `960-MALDIVES`, `223-MALI`, `356-MALTA`, `692-MARSHALL ISLANDS`, `596-MARTINIQUE`, `222-MAURITANIA`, `230-MAURITIUS`, `269-MAYOTTE`, `52-MEXICO`, `691-MICRONESIA (FEDERATED STATES OF)`, `373-MOLDOVA (REPUBLIC OF)`, `377-MONACO`, `976-MONGOLIA`, `382-MONTENEGRO`, `1664-MONTSERRAT`, `212-MOROCCO`, `258-MOZAMBIQUE`, `95-MYANMAR`, `264-NAMIBIA`, `674-NAURU`, `977-NEPAL`, `31-NETHERLANDS`, `687-NEW CALEDONIA`, `64-NEW ZEALAND`, `505-NICARAGUA`, `227-NIGER`, `234-NIGERIA`, `683-NIUE`, `15-NORFOLK ISLAND`, `1670-NORTHERN MARIANA ISLANDS`, `47-NORWAY`, `968-OMAN`, `92-PAKISTAN`, `680-PALAU`, `970-PALESTINE, STATE OF`, `507-PANAMA`, `675-PAPUA NEW GUINEA`, `595-PARAGUAY`, `51-PERU`, `63-PHILIPPINES`, `1011-PITCAIRN`, `48-POLAND`, `14-PORTUGAL`, `1787-PUERTO RICO`, `974-QATAR`, `262-REUNION`, `40-ROMANIA`, `8-RUSSIAN FEDERATION`, `250-RWANDA`, `1006-SAINT BARTHELEMY`, `290-SAINT HELENA, ASCENSION AND TRISTAN DA CUNHA`, `1869-SAINT KITTS AND NEVIS`, `1758-SAINT LUCIA`, `1007-SAINT MARTIN (FRENCH PART)`, `508-SAINT PIERRE AND MIQUELON`, `1784-SAINT VINCENT AND THE GRENADINES`, `685-SAMOA`, `378-SAN MARINO`, `239-SAO TOME AND PRINCIPE`, `966-SAUDI ARABIA`, `221-SENEGAL`, `381-SERBIA`, `248-SEYCHELLES`, `232-SIERRA LEONE`, `65-SINGAPORE`, `1721-SINT MAARTEN (DUTCH PART)`, `421-SLOVAKIA`, `386-SLOVENIA`, `677-SOLOMON ISLANDS`, `252-SOMALIA`, `28-SOUTH AFRICA`, `1008-SOUTH GEORGIA AND THE SOUTH SANDWICH ISLANDS`, `211-SOUTH SUDAN`, `35-SPAIN`, `94-SRI LANKA`, `249-SUDAN`, `597-SURINAME`, `1012-SVALBARD AND JAN MAYEN`, `268-SWAZILAND`, `46-SWEDEN`, `41-SWITZERLAND`, `963-SYRIAN ARAB REPUBLIC`, `886-TAIWAN`, `992-TAJIKISTAN`, `255-TANZANIA, UNITED REPUBLIC OF`, `66-THAILAND`, `670-TIMOR-LESTE(EAST TIMOR)`, `228-TOGO`, `690-TOKELAU`, `676-TONGA`, `1868-TRINIDAD AND TOBAGO`, `216-TUNISIA`, `90-TURKEY`, `993-TURKMENISTAN`, `1649-TURKS AND CAICOS ISLANDS`, `688-TUVALU`, `256-UGANDA`, `380-UKRAINE`, `971-UNITED ARAB EMIRATES`, `44-UNITED KINGDOM OF GREAT BRITAIN AND NORTHERN IRELAND`, `2-UNITED STATES OF AMERICA`, `1009-UNITED STATES MINOR OUTLYING ISLANDS`, `598-URUGUAY`, `998-UZBEKISTAN`, `678-VANUATU`, `58-VENEZUELA (BOLIVARIAN REPUBLIC OF)`, `84-VIET NAM`, `1284-VIRGIN ISLANDS (BRITISH)`, `1340-VIRGIN ISLANDS (U.S.)`, `681-WALLIS AND FUTUNA`, `1013-WESTERN SAHARA`, `260-ZAMBIA`, `9999-OTHERS` (stored in the schema enum `CountryCodeExcludingIndia`).

**DTAA — Head of Income** (`I32:I35`): `(Select)`, `Salary`, `House Property`,
`Profits &amp; Gains from Business &amp; Profession`, `Capital Gain`,
`Income from Other sources` — coded as `SA`, `HP`, `PG`, `CG`, `OS`.

**DTAA — Whether TRC obtained** (`J32:J35`): `(Select)`, `Yes`, `No` — coded `Y`, `N`.

---

## What repeats and what is one figure

- **One figure each**: line 1 `InterestInc`; line 2 inputs `GrossAgriRecpt`,
  `ExpIncAgri`, `UnabAgriLossPrev8`; computed `AgriIncRule7and8`,
  `NetAgriIncOrOthrIncRule7`, `Others`, `IncChrgblAsPerDTAA`; line 5
  `PassThrIncNotChrgblTax`; line 6 `TotalExemptInc`.
- **Arrays (repeating tables)**: the land table `ExcNetAgriIncDtls[]` (up to
  four rows on the sheet, unlimited on file, shown only when 2(v) > ₹5 lakh);
  the other-exempt table `OthersIncDtls[]`; the DTAA table
  `IncNotChrgblAsPerDTAADtls[]`.

---

## Mandatory

Schema `required` keys of the block: `TotalExemptInc` and
`NetAgriIncOrOthrIncRule7`. Within the arrays, each row requires
`NameOfDistrict`, `PinCode`, `MeasurementOfLand`, `AgriLandOwnedFlag`,
`AgriLandIrrigatedFlag` (land); `OthAmount` (other-exempt); `AmountOfIncome`,
`CountryName`, `CountryCodeExcludingIndia`, `HeadOfIncome` (DTAA). The two
required block totals are written even at zero whenever the schedule is present.

---

## Hidden rows — not built

| Row | Text | Why hidden |
|---|---|---|
| **r5 (H)** | Dividend income from domestic company (amount not exceeding Rs. 10 lakhs) | Dividend is taxable now; not an exempt line for A.Y. 2026-27. |
| **r6 (H)** | Long-term capital gains from transactions on which Securities Transaction Tax is paid | LTCG with STT is taxable under 112A now. |
| **r12 (H)** | Share in the profit of firm/AOP/BOI etc. | Business/partner share, handled elsewhere. |

None of these three is presented as an item.

---

## What this means for the build

1. **Line 2 is a working** — three inputs (i, ii, iii), item 2(iv) auto-pulled
   from Sch BP Sl. No. 38 (`MAX(0, BP_BalanceOfIncome39)`), net 2(v) computed as
   i − ii − iii + iv and floored at nil, and the land table (2(vi)) appearing
   only when 2(v) exceeds ₹5,00,000, each row carrying the O/H and IRG/RF flags
   and a 6-digit PIN.
2. **Line 3 is the two-dropdown table** — Category first, Sub-Category filtered
   from it exactly as the utility's dependent dropdown; `Others` = SUM of amounts.
3. **Line 4 is the DTAA table**, non-residents only, with the India-excluded
   country list, the SA/HP/PG/CG/OS head, and the Y/N TRC flag; total is
   `IncChrgblAsPerDTAA`.
4. **Line 5 reads Schedule PTI** into `PassThrIncNotChrgblTax`.
5. **The rate effect** — net agricultural income at Sl. No. 2 feeds Part B-TI's
   for-rate line and Part B-TTI's rebate on agricultural income (partial
   integration).
6. **Export** — `ScheduleEI` with the required totals `TotalExemptInc` and
   `NetAgriIncOrOthrIncRule7`, each table written only when it has rows.


## Additional visible rows — verbatim from the sheet (completeness)
Rows present on the utility sheet and captured here verbatim so every visible label is in the book:

- EXEMPT INCOME
- Interest income
- Sub-Category
- Amount of Income
- Nature of Income
- Head of Income
- Total (1 + 2(v) + 3 + 4 + 5)
