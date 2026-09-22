# EI — Schedule EI (ITR-5, A.Y. 2026-27)

Block: `ScheduleEI` · Sheet tab: **EI** · Section: `ei` (per `section_map.json`).
Header: **Schedule - EI** ([C3]) — **Details of Exempt Income (Income not to be included in Total Income or not chargeable to tax)** ([F3]).

Everything below is quoted from `tools/dump.py` (rows, `--formulas`, `--dropdowns`, `--schema/--leaves ScheduleEI`), the utility worksheet `sheet45.xml`, `sources/ITR-5/vba_text.txt`, and `books/ITR-5/rules.json`. Nothing is from memory.

---

## The shape

Schedule EI is a flat list of six numbered exempt-income lines that add up to one grand total, plus two embedded add-more tables and one agricultural-income working:

1. **Interest Income** — one figure ([E4] label, value cell **J4**).
2. **Agricultural income** working — five sub-lines (i–v, rows 6–10) that compute **Net Agricultural income for the year**, followed by an add-more **land-details table** (item vi, rows 11–15) that opens only when net agri income exceeds Rs.5 lakh.
3. **Other exempt income** — an add-more table of Category / Sub-Category / Description / Amount (rows 27–31), totalled at **Total** ([E38], **J38**).
4. **Income claimed as not chargeable to tax as per DTAA** (non-residents only) — an add-more table (rows 40–43), totalled at [D44] (**J44**).
5. **Pass through income claimed as not chargeable to tax (Schedule PTI)** — one figure ([E46], **J46**).
6. **Total (1 + 2 + 3 + 4 + 5)** — the grand total ([E47], **J47**), schema `TotalExemptInc`.

There is also a **hidden Dividend Income** row (row 5, **H**) and several **hidden legacy pass-through / other-exempt blocks** (rows 18–25, 33–37, all **H**) — see "Hidden rows — not built". The live sheet numbers the DTAA line as "4" and pass-through as "5" in the [E47] formula caption "(1 + 2 + 3 + 4 + 5)"; the rules.json texts number Interest=1, Agriculture=2, Other exempt=3, so this book uses the sheet's own lettering (i–vi) for the agri working and the rules' sl.no. numbering (1,2,2i–2vi,3,4,5) for the lines.

Most lines are **one figure**; three areas **repeat** (land-details table, other-exempt table, DTAA table) — see "What repeats and what is one figure".

---

## The items

`*` marks schema-required (from `--leaves ScheduleEI`). Every schema key below appears verbatim.

### Line 1 — Interest Income

| Sl.no | Cell | Field label ([dump]) | Type | Schema key | Rule |
|---|---|---|---|---|---|
| 1 | E4 / **J4** | **Interest Income** | integer ≥0, ≤14 digits | `InterestInc` | Plain entry; feeds the grand total J47. |

### Line 2 — Agricultural income working (items i–vi)

| Sl.no | Cell | Field label ([dump]) | Type | Schema key | Rule |
|---|---|---|---|---|---|
| 2 i | E6/F6 / **J6** | **Gross Agricultural receipts (other than income to be excluded under rule 7A, 7B or 8 of I.T. Rules)** | integer ≥0 | `GrossAgriRecpt` (named cell `Sheet20.scei.GrossAgri`) | Entry. |
| 2 ii | E7/F7 / **J7** | **Expenditure incurred on agriculture** | integer ≥0 | `ExpIncAgri` (named `Sheet20.scei.ExpenditureAgri`) | Entry; subtracted in J10. |
| 2 iii | E8/F8 / **J8** | **Unabsorbed agricultural loss of previous eight assessment years** | integer ≥0 | `UnabAgriLossPrev8` (named `Sheet20.scei.UnabsorbedAgri`) | Entry; subtracted in J10. VBA validator: "Unabsorbed agricultural loss should not be greater than 14 digits in Sheet EI" / "must contain only digits from 0 to 9". |
| 2 iv | E9/F9 / **J9** | **Agricultural income portion relating to Rule 7, 7A, 7B(1), 7B(1A) and 8 (from Sl. No. 38 of Sch. BP)** | integer ≥0 | `NetAgriIncRelateToRule7` (named `Sheet20.scei.AgriculturalIncome`) | **Computed** `J9 = MAX(0, sheet12.BalIncDeemedFrmAgri)` — pulled from Sl.No.38 of Schedule BP (rule 3675: value at 2iv "should be equal to Sl. No. 38 of Sch. BP"). |
| 2 v | E10/F10 / **J10** | **Net Agricultural income for the year (i – ii – iii + iv) (enter nil if loss)** | integer ≥0 | `NetAgriIncOrOthrIncRule7` (named `Sheet20.scei.NetAgriIncOrOthrIncRule7`) | **Computed** `J10 = MAX(SUM(Sheet20.scei.GrossAgri, -Sheet20.scei.ExpenditureAgri, -Sheet20.scei.UnabsorbedAgri, Sheet20.scei.AgriculturalIncome), 0)`. Rule 3670: "value at '2v' … should be equal to 2(i – ii – iii + iv)". |
| 2 vi | F11 | **In case the net agricultural income for the year exceeds Rs.5 lakh, please furnish the following details** (land-details table below) | table | `ExcNetAgriInc.ExcNetAgriIncDtls[]` | Opens when 2v > Rs.5,00,000 (rule 3685). |

**Land-details table (item vi, rows 12–15) — repeats, `ExcNetAgriInc.ExcNetAgriIncDtls[]`:**

| Col | Cell | Column header ([dump]) | Type | Schema key |
|---|---|---|---|---|
| — | E12 | **Sl.No** | auto (`E15 = E14+1`) | — |
| F/G | F13/G13, F14/G14 | **Name of district along with pin code in which agricultural land is located** — sub-cols **Name of district** / **Pin code** | string ≤125 / integer 100000–999999 | *`ExcNetAgriInc.ExcNetAgriIncDtls[].NameOfDistrict`, *`…PinCode` |
| H | H12 / H14 | **Measurement of agricultural land in Acre** | number ≤14 digits | *`ExcNetAgriInc.ExcNetAgriIncDtls[].MeasurementOfLand` |
| I | I12 / I14 | **Whether the agricultural land is owned or held on lease** | dropdown → enum O, H | *`ExcNetAgriInc.ExcNetAgriIncDtls[].AgriLandOwnedFlag` |
| J | J12 / J14 | **Whether the agricultural land is irrigated or rain-fed** | dropdown → enum IRG, RF | *`ExcNetAgriInc.ExcNetAgriIncDtls[].AgriLandIrrigatedFlag` |

### Line 3 — Other exempt income (rows 27–31) — repeats, `OthersInc.OthersIncDtls[]`

Row 17 label: **Other exempt income**. Table headers (row 27): **Category** / **Sub-Category** / **Description** / **Amount**.

| Col | Cell | Header ([dump]) | Type | Schema key |
|---|---|---|---|---|
| E | E27 | **Sl.No** | auto (`E29 = E28+1`, E30, E31) | — |
| F | F27 / F28–F31 | **Category** | dropdown | `OthersInc.OthersIncDtls[].Category` (enum AGRI, GOVC, ISI, SSRA, SRSC, SRST, SRPC, OTH, OTHN, ICSB, IOI) |
| G | G27 / G28–G31 | **Sub-Category** | dropdown | `OthersInc.OthersIncDtls[].SubCategory` |
| H | H27 / H28–H31 | **Description** | string ≤125 | `OthersInc.OthersIncDtls[].Description` |
| I | I27 / I28–I31 | **Amount** | integer ≥0 | *`OthersInc.OthersIncDtls[].OthAmount` |
| — | E38 / **J38** | **Total** | computed | `Others` (named total `Sheet20.OthersIncomeTotal`) |

`Others` [integer] holds line-3 total: **`J38 = SUM(NatureOfIncome3aNewAmt)`** — rule 3680: "total of Other exempt income at sl.no.3 should be equal to value entered in individual columns."

### Line 4 — DTAA (rows 40–43, non-residents only) — repeats, `IncNotChrgblAsPerDTAA.IncNotChrgblAsPerDTAADtls[]`

Row 40 label: **Income claimed as not chargeable to tax as per DTAA (Applicable for non-residents only)**. Table headers (row 41): **Sl.No / Amount of income / Nature of income / Country name & Code / Article of DTAA / Head of Income / Whether TRC obtained (Y/N)**.

| Col | Cell | Header ([dump]) | Type | Schema key |
|---|---|---|---|---|
| D | D41 | **Sl.No** | auto (`D43 = D42+1`) | — |
| E | E41 / E42 | **Amount of income** | integer ≥0 | *`IncNotChrgblAsPerDTAA.IncNotChrgblAsPerDTAADtls[].AmountOfIncome` |
| F | F41 / F42 | **Nature of income** | string ≤75 | `IncNotChrgblAsPerDTAA.IncNotChrgblAsPerDTAADtls[].NatureOfIncome` |
| G | G41 / G42 | **Country name & Code** | string ≤55 / dropdown code | *`…CountryName`, *`…CountryCodeExcludingIndia` |
| H | H41 / H42 | **Article of DTAA** | string ≤16 | `IncNotChrgblAsPerDTAA.IncNotChrgblAsPerDTAADtls[].ArticleOfDTAA` |
| I | I41 / I42 | **Head of Income** | dropdown → enum HP, BP, CG, OS | *`IncNotChrgblAsPerDTAA.IncNotChrgblAsPerDTAADtls[].HeadOfIncome` |
| J | J41 / J42 | **Whether TRC obtained (Y/N)** | dropdown → enum Y, N | `IncNotChrgblAsPerDTAA.IncNotChrgblAsPerDTAADtls[].TRCFlag` |
| — | D44 / **J44** | **Total Income from DTAA claimed as not chargeable to tax** | computed | `IncChrgblAsPerDTAA` (named total `Sheet20_DTAA_AmountOfIncome`) |

`IncChrgblAsPerDTAA` [integer] holds line-4 total: **`J44 = SUM(Sheet20_DTAA_AmountOfIncome)`**.

### Line 5 — Pass through income

| Sl.no | Cell | Field label ([dump]) | Type | Schema key | Rule |
|---|---|---|---|---|---|
| 5 | E46 / **J46** | **Pass through income claimed as not chargeable to tax (Schedule PTI)** | integer ≥0 | `PassThrIncNotChrgblTax` | Rule 3660: "sl.no.5 should be equal to amount in sl.no.1(iv)(a+b+c) of Schedule PTI". |

### Line 6 — Total

| Sl.no | Cell | Field label ([dump]) | Type | Schema key | Rule |
|---|---|---|---|---|---|
| 6 | E47 / **J47** | **Total (1 + 2 + 3 + 4 + 5)** | integer ≥0, **required** | *`TotalExemptInc` | **Computed** — see below. Rule 3665: "Value at '6' 'Total' should be equal to (1 + 2 + 3 + 4 + 5)". |

---

## The rules the sheet computes (with cell references)

- **J9** (`NetAgriIncRelateToRule7`, item 2iv) `= MAX(0, sheet12.BalIncDeemedFrmAgri)` — floored at 0; sourced from Sl.No.38 of Schedule BP.
- **J10** (`NetAgriIncOrOthrIncRule7`, item 2v, net agri income) `= MAX(SUM(Sheet20.scei.GrossAgri, -Sheet20.scei.ExpenditureAgri, -Sheet20.scei.UnabsorbedAgri, Sheet20.scei.AgriculturalIncome), 0)` — i − ii − iii + iv, floored at 0 (enter nil if loss).
- **J38** (`Others`, line-3 total) `= SUM(NatureOfIncome3aNewAmt)` — sum of the other-exempt Amount column.
- **J44** (`IncChrgblAsPerDTAA`, line-4 total) `= SUM(Sheet20_DTAA_AmountOfIncome)` — sum of the DTAA Amount-of-income column.
- **J47** (`TotalExemptInc`, grand total) `= MAX(0, SUM(Sheet20.scei.InterestInc, Sheet20.scei.DividendInc, Sheet20.scei.NetAgriIncOrOthrIncRule7, Sheet20.OthersIncomeTotal, Sheet20.scei.DTAA, Sheet20.scei.PassThroughIncome))` — i.e. Interest + (hidden Dividend) + Net-agri + Other-exempt + DTAA + Pass-through, floored at 0.
- **Sl.No auto-increment:** `E15 = E14+1` (land table), `E29/E30/E31 = prev+1` (other-exempt), `D43 = D42+1` (DTAA).

**Net-agri-income working and its rate-purpose add-back:** the net agricultural income (item 2v, `NetAgriIncOrOthrIncRule7`, J10) is exempt from tax but is **added back for rate purposes**. Per `rules.json` line 4025/4030: *"Part B-TI value at Sl.no.15 'Net agricultural income/any other income for rate purpose' should be equal to value of Sl.no.2v of Schedule EI if 2v > 5000."* So J10 flows to Part B-TI Sl.15 (rate purpose) whenever net agri income exceeds Rs.5,000. Separately, if 2v > Rs.5,00,000 the **land-details table (2vi)** becomes mandatory (rule 3685).

**rules.json texts for Schedule EI (grep):**
- 3660 — sl.no.5 = Schedule PTI 1(iv)(a+b+c).
- 3665 — Total(6) = 1+2+3+4+5.
- 3670 — 2v = 2(i – ii – iii + iv).
- 3675 — 2iv = Sl.No.38 of Sch. BP.
- 3680 — total Other exempt income (3) = sum of individual columns.
- 3685 — if 2v > 500000, land details table (2vi) must be provided.
- 3690 — same exemption dropdown in Sl.No.3 must not be selected more than once.
- 3695/3700 — 10(23BBH) (Prasar Bharati) only by PAN "AAAJP0288R".
- 3700 — 10(4)(i), 10(4C), 10(4E), 10(4F), 10(4G), 10(6B), 10(6BB), 10(6D), 10(8A), 10(15A) cannot be reported by Residents.
- 3705/3710 — Description mandatory where amount > 0 and sub-category is "Income exempt as per CBDT Circular", "Income exempt as per CBDT Notification" or "Receipts not in the nature of income".
- 3710 — Category and sub-category mandatory when amount > 0.
- 3715/3720 — Description not required for other sub-categories.
- 4025/4030 — 2v flows to Part B-TI Sl.15 (rate purpose) if 2v > 5000.
- 1055 — amount reduced in BP A5 cannot exceed income offered in Schedule EI.

---

## Dropdowns (every value)

**I14:I15 — `AgriLandOwnedFlag` (Whether the agricultural land is owned or held on lease)** → enum O, H:
- (Select)
- Owned → **O**
- Held on Lease → **H**

**J14:J15 — `AgriLandIrrigatedFlag` (Whether the agricultural land is irrigated or rain-fed)** → enum IRG, RF:
- (Select)
- Irrigated → **IRG**
- Rain-fed → **RF**

**I42:I43 — `HeadOfIncome` (Head of Income)** → enum HP, BP, CG, OS:
- (Select)
- House Property → **HP**
- Business and Profession → **BP**
- Capital Gain → **CG**
- Other sources → **OS**

**J42:J43 — `TRCFlag` (Whether TRC obtained)** → enum Y, N:
- (Select)
- Yes → **Y**
- No → **N**

**F29:F31 — `Category` (other-exempt, source `PART4_Nature_TP`, non-resident variant):**

- (Select)
- Agricultural  & related incomes
- Compensation/other sums received by government or other approved entities
- Income from other investments
- Income from specified Investments
- Incomes of certain specified bodies
- Other Exempt Income for Non Residents
- Other Incomes
- Specified sums received by armed forces personnel
- Sums received from policies/contributions such as LIC/NPS/PF/Sukanya Samriddhi Yojana

**F28 — `Category`, resident variant:** the cell F28 source is `IF(sheet1.ResidentialStatus1="RES-Resident", PART4_Nature_TP_Res, PART4_Nature_TP)`. The resident list (`PART4_Nature_TP_Res`, DB!HN2:HN10) is the same nine values **minus** "Other Exempt Income for Non Residents":
- (Select)
- Agricultural  & related incomes
- Compensation/other sums received by government or other approved entities
- Income from other investments
- Income from specified Investments
- Incomes of certain specified bodies
- Other Incomes
- Specified sums received by armed forces personnel
- Sums received from policies/contributions such as LIC/NPS/PF/Sukanya Samriddhi Yojana

**G28:G31 — `SubCategory` (other-exempt, source `PART4_Sub_Category`) — full live list:**

- `(Select)`
- `10(10D)-Any sum received under a life insurance policy, including the sum allocated by way of bonus on such policy except sum as mentioned in sub-clause (a) to (d) of Sec.10(10D)`
- `10(15)-Interest on specified securities/investments`
- `10(15A)-Lease payments for foreign aircraft`
- `10(17A)-Award instituted by Government`
- `10(20)-Income of local authorities`
- `10(21)-Income of approved research associations`
- `10(22B)-Income of specified news agencies`
- `10(23A)-Income of professional regulatory bodies`
- `10(23AA)-Sum received by any person on behalf of any Fund established by the armed forces`
- `10(23AAA)-Income of approved employee welfare funds`
- `10(23AAB)-Income of approved pension funds`
- `10(23B)-Income of approved khadi institution`
- `10(23BB)-Income of State khadi authorities`
- `10(23BBA)-Religious and charitable trust board income`
- `10(23BBB)-Income of European Economic Community`
- `10(23BBC)-Any income of the SAARC Fund for Regional Projects set up by Colombo Declaration`
- `10(23BBE)-Income of the Insurance Regulatory and Development Authority`
- `10(23BBG)-Income of Central Electricity Regulatory Commission`
- `10(23BBH)-Income of the Prasar Bharati (Broadcasting Corporation of India)`
- `10(23C)-Income of specified funds/educational/medical/charitable institutions`
- `10(23D)-Income of specified Mutual Funds`
- `10(23DA)-Income of securitisation trusts`
- `10(23EA)-Contributions received from recognised stock exchanges`
- `10(23EC)-Income of specific Investor protection fund`
- `10(23ED)-Income of a business trust's unit holder under specific circumstances`
- `10(23EE)-Specified income of Core settlement guarantee fund`
- `10(23F)-Dividends or long-term capital gains of a venture capital fund or a venture capital company from investments made by way of equity shares in a venture capital undertaking`
- `10(23FA)-Dividends, other than dividends referred to in section 115-O, or long-term capital gains of a venture capital fund or a venture capital company from investments made by way of equity shares in a venture capital undertaking`
- `10(23FB)-Income of Venture Capital Company/Fund from investment in Venture Capital undertaking`
- `10(23FBA)-Any income of an  Investment Fund`
- `10(23FBB)-income referred to in section 115UB, accruing or arising to, or received by, a unit holder of an investment fund`
- `10(23FBC)-Any income from a unit holder from a specified fund or on transfer of units in a specified fund`
- `10(23FC)-Business Trust—interest/dividend from SPV`
- `10(23FCA)-Business Trust-Real estate investment-renting, leasing or letting out`
- `10(23FD)-Unit holder income from Business Trust (certain parts)`
- `10(23FE)-Specified sovereign wealth/pension funds—income from infrastructure investments`
- `10(23FF)-Capital Gains on transfer of shares from wholly owned special purpose vehicle to the resultant fund in relocation`
- `10(24)-Income of registered Trade Union or association of registered Union`
- `10(25)-Sum received by trustees on behalf of approved superannuation, gratuity, or pension funds`
- `10(25A)-Income under Employees' State Insurance Fund`
- `10(26AAB)-Income of agricultural market committees`
- `10(26B)-Income promoting the interest of the SC/ST`
- `10(26BB)-Income promoting interest of the Minority Community`
- `10(26BBB)-Income of ex‑servicemen welfare corporations`
- `10(27)-Income of SC/ST cooperative societies`
- `10(29A)-Income accruing or arising to specific commodity boards`
- `10(2A)-Partner’s share in firm/LLP`
- `10(30)-subsidy received from or through the Tea Board`
- `10(31)-Subsidy received for Rubber/Coffee/Tea  replantation, replacement, rejuvenation etc.`
- `10(33)-Income from transfer of capital asset being a unit of the Unit Scheme, 1964`
- `10(34B)-Income of a Unit of any International Financial Services Centre, primarily engaged in the business of leasing of an aircraft`
- `10(35)-Income from specified Mutual Funds`
- `10(36)-LTCG on certain listed shares (public issue)`
- `10(39)-Specified income from international sports events`
- `10(4)(i)-Interest on specified bonds`
- `10(42)-Specified income of treaty‑based international bodies`
- `10(44)-Income of New Pension System Trust`
- `10(46A)-Income of notified statutory authorities`
- `10(46B)-Specific tax exemption for NCGTC`
- `10(48D)-Income of infrastructure financing institutions`
- `10(48E)-Income of RBI‑licensed development finance institutions`
- `10(4C)-Interest on Rupee denominated bonds (specific window)`
- `10(4D)-Income of specified fund (IFSC) on certain transfers/securities`
- `10(4E)-Non-deliverable forwards/ODI/OTC with IFSC OBU`
- `10(4F)-Royalty/interest on lease of aircraft/ship by IFSC unit`
- `10(4G)-Portfolio income managed in IFSC OBU accruing outside India`
- `10(4H)-Income from business of leasing of an aircraft`
- `10(6B)-Tax paid under Govt/international agreements (non-salary)`
- `10(6BB)-Tax paid on consideration for aircraft/engine leases (approved by CG)`
- `10(6D)-Royalty/FTS to non-resident for services to NTRO`
- `10(8A)-Remuneration or any other income of Consultant`
- `Income exempt as per CBDT Circular`
- `Income exempt as per CBDT Notification`
- `Receipts not in the nature of income`

**G42:G43 — `CountryCodeExcludingIndia` (Country name & Code, DTAA) — full list (code-COUNTRY):**

- `(select)`
- `93-AFGHANISTAN`
- `1001-ALAND ISLANDS`
- `355-ALBANIA`
- `213-ALGERIA`
- `684-AMERICAN SAMOA`
- `376-ANDORRA`
- `244-ANGOLA`
- `1264-ANGUILLA`
- `1010-ANTARCTICA`
- `1268-ANTIGUA AND BARBUDA`
- `54-ARGENTINA`
- `374-ARMENIA`
- `297-ARUBA`
- `61-AUSTRALIA`
- `43-AUSTRIA`
- `994-AZERBAIJAN`
- `1242-BAHAMAS`
- `973-BAHRAIN`
- `880-BANGLADESH`
- `1246-BARBADOS`
- `375-BELARUS`
- `32-BELGIUM`
- `501-BELIZE`
- `229-BENIN`
- `1441-BERMUDA`
- `975-BHUTAN`
- `591-BOLIVIA (PLURINATIONAL STATE OF)`
- `1002-BONAIRE, SINT EUSTATIUS AND SABA`
- `387-BOSNIA AND HERZEGOVINA`
- `267-BOTSWANA`
- `1003-BOUVET ISLAND`
- `55-BRAZIL`
- `1014-BRITISH INDIAN OCEAN TERRITORY`
- `673-BRUNEI DARUSSALAM`
- `359-BULGARIA`
- `226-BURKINA FASO`
- `257-BURUNDI`
- `238-CABO VERDE`
- `855-CAMBODIA`
- `237-CAMEROON`
- `1-CANADA`
- `1345-CAYMAN ISLANDS`
- `236-CENTRAL AFRICAN REPUBLIC`
- `235-CHAD`
- `56-CHILE`
- `86-CHINA`
- `9-CHRISTMAS ISLAND`
- `672-COCOS (KEELING) ISLANDS`
- `57-COLOMBIA`
- `270-COMOROS`
- `242-CONGO`
- `243-CONGO (DEMOCRATIC REPUBLIC OF THE)`
- `682-COOK ISLANDS`
- `506-COSTA RICA`
- `225-COTE DIVOIRE`
- `385-CROATIA`
- `53-CUBA`
- `1015-CURACAO`
- `357-CYPRUS`
- `420-CZECHIA`
- `45-DENMARK`
- `253-DJIBOUTI`
- `1767-DOMINICA`
- `1809-DOMINICAN REPUBLIC`
- `593-ECUADOR`
- `20-EGYPT`
- `503-EL SALVADOR`
- `240-EQUATORIAL GUINEA`
- `291-ERITREA`
- `372-ESTONIA`
- `251-ETHIOPIA`
- `500-FALKLAND ISLANDS (MALVINAS)`
- `298-FAROE ISLANDS`
- `679-FIJI`
- `358-FINLAND`
- `33-FRANCE`
- `594-FRENCH GUIANA`
- `689-FRENCH POLYNESIA`
- `1004-FRENCH SOUTHERN TERRITORIES`
- `241-GABON`
- `220-GAMBIA`
- `995-GEORGIA`
- `49-GERMANY`
- `233-GHANA`
- `350-GIBRALTAR`
- `30-GREECE`
- `299-GREENLAND`
- `1473-GRENADA`
- `590-GUADELOUPE`
- `1671-GUAM`
- `502-GUATEMALA`
- `1481-GUERNSEY`
- `224-GUINEA`
- `245-GUINEA-BISSAU`
- `592-GUYANA`
- `509-HAITI`
- `1005-HEARD ISLAND AND MCDONALD ISLANDS`
- `6-HOLY SEE`
- `504-HONDURAS`
- `852-HONG KONG`
- `36-HUNGARY`
- `354-ICELAND`
- `91-INDIA`
- `62-INDONESIA`
- `98-IRAN (ISLAMIC REPUBLIC OF)`
- `964-IRAQ`
- `353-IRELAND`
- `1624-ISLE OF MAN`
- `972-ISRAEL`
- `5-ITALY`
- `1876-JAMAICA`
- `81-JAPAN`
- `1534-JERSEY`
- `962-JORDAN`
- `7-KAZAKHSTAN`
- `254-KENYA`
- `686-KIRIBATI`
- `850-KOREA (DEMOCRATIC PEOPLES REPUBLIC OF)`
- `82-KOREA (REPUBLIC OF)`
- `965-KUWAIT`
- `996-KYRGYZSTAN`
- `856-LAO PEOPLES DEMOCRATIC REPUBLIC`
- `371-LATVIA`
- `961-LEBANON`
- `266-LESOTHO`
- `231-LIBERIA`
- `218-LIBYA`
- `423-LIECHTENSTEIN`
- `370-LITHUANIA`
- `352-LUXEMBOURG`
- `853-MACAO`
- `389-MACEDONIA (THE FORMER YUGOSLAV REPUBLIC OF)`
- `261-MADAGASCAR`
- `265-MALAWI`
- `60-MALAYSIA`
- `960-MALDIVES`
- `223-MALI`
- `356-MALTA`
- `692-MARSHALL ISLANDS`
- `596-MARTINIQUE`
- `222-MAURITANIA`
- `230-MAURITIUS`
- `269-MAYOTTE`
- `52-MEXICO`
- `691-MICRONESIA (FEDERATED STATES OF)`
- `373-MOLDOVA (REPUBLIC OF)`
- `377-MONACO`
- `976-MONGOLIA`
- `382-MONTENEGRO`
- `1664-MONTSERRAT`
- `212-MOROCCO`
- `258-MOZAMBIQUE`
- `95-MYANMAR`
- `264-NAMIBIA`
- `674-NAURU`
- `977-NEPAL`
- `31-NETHERLANDS`
- `687-NEW CALEDONIA`
- `64-NEW ZEALAND`
- `505-NICARAGUA`
- `227-NIGER`
- `234-NIGERIA`
- `683-NIUE`
- `15-NORFOLK ISLAND`
- `1670-NORTHERN MARIANA ISLANDS`
- `47-NORWAY`
- `968-OMAN`
- `92-PAKISTAN`
- `680-PALAU`
- `970-PALESTINE, STATE OF`
- `507-PANAMA`
- `675-PAPUA NEW GUINEA`
- `595-PARAGUAY`
- `51-PERU`
- `63-PHILIPPINES`
- `1011-PITCAIRN`
- `48-POLAND`
- `14-PORTUGAL`
- `1787-PUERTO RICO`
- `974-QATAR`
- `262-REUNION`
- `40-ROMANIA`
- `8-RUSSIAN FEDERATION`
- `250-RWANDA`
- `1006-SAINT BARTHELEMY`
- `290-SAINT HELENA, ASCENSION AND TRISTAN DA CUNHA`
- `1869-SAINT KITTS AND NEVIS`
- `1758-SAINT LUCIA`
- `1007-SAINT MARTIN (FRENCH PART)`
- `508-SAINT PIERRE AND MIQUELON`
- `1784-SAINT VINCENT AND THE GRENADINES`
- `685-SAMOA`
- `378-SAN MARINO`
- `239-SAO TOME AND PRINCIPE`
- `966-SAUDI ARABIA`
- `221-SENEGAL`
- `381-SERBIA`
- `248-SEYCHELLES`
- `232-SIERRA LEONE`
- `65-SINGAPORE`
- `1721-SINT MAARTEN (DUTCH PART)`
- `421-SLOVAKIA`
- `386-SLOVENIA`
- `677-SOLOMON ISLANDS`
- `252-SOMALIA`
- `28-SOUTH AFRICA`
- `1008-SOUTH GEORGIA AND THE SOUTH SANDWICH ISLANDS`
- `211-SOUTH SUDAN`
- `35-SPAIN`
- `94-SRI LANKA`
- `249-SUDAN`
- `597-SURINAME`
- `1012-SVALBARD AND JAN MAYEN`
- `268-SWAZILAND`
- `46-SWEDEN`
- `41-SWITZERLAND`
- `963-SYRIAN ARAB REPUBLIC`
- `886-TAIWAN, PROVINCE OF CHINA[A]`
- `992-TAJIKISTAN`
- `255-TANZANIA, UNITED REPUBLIC OF`
- `66-THAILAND`
- `670-TIMOR-LESTE(EAST TIMOR)`
- `228-TOGO`
- `690-TOKELAU`
- `676-TONGA`
- `1868-TRINIDAD AND TOBAGO`
- `216-TUNISIA`
- `90-TURKEY`
- `993-TURKMENISTAN`
- `1649-TURKS AND CAICOS ISLANDS`
- `688-TUVALU`
- `256-UGANDA`
- `380-UKRAINE`
- `971-UNITED ARAB EMIRATES`
- `44-UNITED KINGDOM OF GREAT BRITAIN AND NORTHERN IRELAND`
- `2-UNITED STATES OF AMERICA`
- `1009-UNITED STATES MINOR OUTLYING ISLANDS`
- `598-URUGUAY`
- `998-UZBEKISTAN`
- `678-VANUATU`
- `58-VENEZUELA (BOLIVARIAN REPUBLIC OF)`
- `84-VIET NAM`
- `1284-VIRGIN ISLANDS (BRITISH)`
- `1340-VIRGIN ISLANDS (U.S.)`
- `681-WALLIS AND FUTUNA`
- `1013-WESTERN SAHARA`
- `967-YEMEN`
- `260-ZAMBIA`
- `263-ZIMBABWE`
- `9999-OTHERS`

**Non-value (numeric/named) validations present on the sheet** (source shown, no explicit value list — `tools/dump.py --dropdowns`): J4, J5, J6, J7, J8:J9, J10, J46, J47, J34:J38, J27:J31, J19:J25, G19:G25, G36:G37 (source "0" = numeric); F36:F37 F24:F25, F42:F43 (source "75" = maxlen); F14:F15 (125), G14:G15 (100000), H14:H15 (0), H28:H31 (125), H42:H43 (16), I28:I31 (0), E42:E43 (0), J18 (10).

**H25 — hidden row dropdown** (Form Filled, rows 24–25 legacy block) → (Select), Form 10-IK, Form 10-IG. This lives on a **hidden** row (25H) — not built.

---

## What repeats and what is one figure

**Repeats (add-more tables):**
- **Land-details table** — `ExcNetAgriInc.ExcNetAgriIncDtls[]` (rows 12–15; Sl.No auto `E15 = E14+1`).
- **Other exempt income table** — `OthersInc.OthersIncDtls[]` (rows 28–31; `E29 = E28+1`, E30, E31).
- **DTAA table** — `IncNotChrgblAsPerDTAA.IncNotChrgblAsPerDTAADtls[]` (rows 42–43; `D43 = D42+1`).

**One figure each:** Interest Income (J4); each agri working sub-line i–v (J6, J7, J8, J9, J10); Other-exempt Total `Others` (J38); DTAA Total `IncChrgblAsPerDTAA` (J44); Pass through income `PassThrIncNotChrgblTax` (J46); grand Total `TotalExemptInc` (J47).

---

## Mandatory

Schema `required` at block level: **`TotalExemptInc`** only.

Per-row array items carry their own required leaves (marked `*` in `--leaves`), enforced only when a row exists:
- Land-details row: `NameOfDistrict`, `PinCode`, `MeasurementOfLand`, `AgriLandOwnedFlag`, `AgriLandIrrigatedFlag`.
- Other-exempt row: `OthAmount` (and, per rules 3705–3715, `Category`+`SubCategory` when amount > 0, plus `Description` for the three "CBDT Circular / Notification / Receipts not in the nature of income" sub-categories).
- DTAA row: `AmountOfIncome`, `CountryName`, `CountryCodeExcludingIndia`, `HeadOfIncome`.

All monetary fields are integer, minimum 0, maximum 99999999999999 (14 digits); `MeasurementOfLand` is a number; `PinCode` is 100000–999999.

---

## Hidden rows — not built

These rows are marked **H** by `tools/dump.py` and must not be built as items:

- **Row 5H** — [E5] **Dividend Income** (`DividendInc`, named `Sheet20.scei.DividendInc`). Referenced in the J47 total formula but the row itself is hidden and `DividendInc` is **not** in the `ScheduleEI` schema leaves — legacy carry-in, not an entry field.
- **Rows 18H–25H** — legacy "Other exempt income" pass-through block: [E18] Sl.No / Nature of Income / Acknowledgement Number / Form Filled / Date of Form Filed / Amount, with fixed section rows [F19] 10(23FB), [F20] 10(23FBA), [F21] 10(23FC), [F22] 10(23FCA), [F23] 10(23FE), [F24] 10(23FF) (Form 10-II), [F25] 10(4D) (dropdown Form 10-IK / Form 10-IG). Superseded by the live Category/Sub-Category table (rows 27–31).
- **Rows 33H–37H** — legacy [D33] 3b [E33] "Other exempt income (Enter nature of income)"; [E34] Sl.No / Nature of Income / Amount; [F35] Dividend Income; auto rows E36/E37.

---

## What this means for the build

- Build **five live entry/computed lines + three add-more tables** under `ScheduleEI`. Do **not** build the hidden Dividend row or the hidden legacy blocks (rows 5, 18–25, 33–37).
- **Only `TotalExemptInc` is block-required** — always write it, even when zero, computed as `J47 = MAX(0, Interest + Dividend(hidden→0) + NetAgri(2v) + OtherExempt(3) + DTAA(4) + PassThrough(5))`.
- **Compute, don't collect:** J9 (from Sch BP Sl.38), J10 (i−ii−iii+iv, floored 0), J38 (Σ other-exempt amounts), J44 (Σ DTAA amounts), J47 (grand total). Only J4, J6, J7, J8 and J46 and the table cells are user entry.
- **Conditional table (2vi):** show/require the land-details table only when net agri income (J10) > Rs.5,00,000 (rule 3685). Feed J10 to **Part B-TI Sl.15** (net agri income for rate purpose) when J10 > Rs.5,000 (rule 4025) — the agri rate-purpose add-back.
- **Cross-schedule ties to honour:** 2iv = Sch BP Sl.38 (3675); line 5 = Sch PTI 1(iv)(a+b+c) (3660); Other-exempt Description mandatory for the three CBDT sub-categories (3705); no duplicate exemption sub-category (3690); residency-gated sub-sections (3700); 10(23BBH) PAN-gated (3695).
- **Dropdowns to wire:** owned/lease (O/H), irrigated/rain-fed (IRG/RF), DTAA head (HP/BP/CG/OS), TRC (Y/N), Country code list, Category (resident vs non-resident variant on F28 via `ResidentialStatus1`), Sub-Category (`PART4_Sub_Category`).
