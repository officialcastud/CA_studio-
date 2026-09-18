# Taxes Paid and Verification — ITR-4 (A.Y. 2026-27)

## The shape
This is the closing sheet of ITR-4. It gathers the tax-payment totals pulled from other schedules (Advance Tax, Self-Assessment Tax, TDS, TCS), computes the balance payable or the refund, reports exempt income for information only, reports the sub-₹1.25 lakh LTCG u/s 112A that is not chargeable, captures the bank-account details used for refund credit, and carries the assessee's verification declaration plus any Tax Return Preparer (TRP) details. All white cells are calculated — they are picked up from other schedules and are not to be entered here. In ITR-4 there is no Schedule HP (house-property data lives inside IncomeDeductions/PropertyDetails) and business income is presumptive (44AD/44ADA/44AE); this sheet only consumes the resulting totals.

## The items

### Block: TaxPaid (Taxes Paid — rows D13–D18, and payable)
| Sheet no. | Field label | Type | Schema key | Rule / notes |
|---|---|---|---|---|
| D13 | Total Advance Tax Paid (from Schedule IT) | integer (computed) | TaxesPaid.AdvanceTax | = IT.AT (H4); white/calculated |
| D14 | Total Self-Assessment Tax Paid (from Schedule IT) | integer (computed) | TaxesPaid.SelfAssessmentTax | = IT.SAT (H5); white/calculated |
| D15 | Total TDS Claimed (total of column 4 of Schedule-TDS1 and column 6 of Schedule-TDS2(i) and TDS 2(ii)) | integer (computed) | TaxesPaid.TDS | = SUM(TDSal.TotalTDSSal, TDS2i.Sum, TDS2ii.Sum) (H6) |
| D16 | Total TCS Collected (total of column (5) of Schedule-TCS) | integer (computed) | TaxesPaid.TCS | = SUM(TCS.AmtTCSClaimedThisYear) (H7); TCS Required for ITR4 |
| D17 | Total Taxes Paid (D13+ D14 + D15 + D16) | integer (computed) | TaxesPaid.TotalTaxesPaid | = SUM(H4:H7) (I8) |
| D18 | Amount payable (D12 – D17, If D12 > D17) | integer (computed) | BalTaxPayable | = ROUND(MAX(0, IncD.TotTaxPlusIntrstPay − IncD.TotalTaxesPaid), −1) (I9) |

### Block: Refund (row D19 + bank accounts table)
| Sheet no. | Field label | Type | Schema key | Rule / notes |
|---|---|---|---|---|
| D19 | Refund (D17 – D12, If D17 > D12) | integer (computed) | RefundDue | = ROUND(MAX(0, IncD.TotalTaxesPaid − IncD.TotTaxPlusIntrstPay), −1) (I10) |
| D21 | Details of all Bank Account Details held in India at any time during the previous year (excluding dormant accounts) | object | BankAccountDtls | Bank details container |
| (table) | — repeating bank rows — | array | BankAccountDtls.AddtnlBankDetails[] | one row per account |
| col: IFS Code of the bank | text | BankAccountDtls.AddtnlBankDetails[].IFSCCode | Bank name auto-filled by VLOOKUP on IFSC (O31/O32) |
| col: Name of the Bank | text (maxLength 125) | BankAccountDtls.AddtnlBankDetails[].BankName | |
| col: Account Number | text (maxLength 20) | BankAccountDtls.AddtnlBankDetails[].BankAccountNo | |
| col: Type of Account | enum | BankAccountDtls.AddtnlBankDetails[].AccountType | SB, CA, CC, OD, NRO, OTH |
| col: Select Account for Refund Credit | enum true/false | BankAccountDtls.AddtnlBankDetails[].UseForRefund | Minimum one account selected for refund credit |

Sl.No. is a serial for the table (not a schema leaf).

### Block: TaxExmpIntIncDtls (D20 — Exempt Income for reporting purpose)
| Sheet no. | Field label | Type | Schema key | Rule / notes |
|---|---|---|---|---|
| D20 | Exempt Income only for Reporting Purpose (If agricultural income is more than Rs.5,000/-, use ITR 3/5) and Income on which no tax is payable | object | OthersInc | Reporting only, not taxed |
| (table) | — repeating exempt-income rows: Category / Sub-Category / Description / Amount — | array | OthersInc.OthersIncDtls[] | one row per exempt item |
| col: Category | enum | OthersInc.OthersIncDtls[].Category | AGRI, GOVC, ISI, SSRA, SRSC, SRST, SRPC, OTH |
| col: Sub-Category | enum | OthersInc.OthersIncDtls[].SubCategory | see Sub-Category enum below |
| col: Description | text (maxLength 125) | OthersInc.OthersIncDtls[].Description | |
| col: Amount | integer | OthersInc.OthersIncDtls[].OthAmount | required within row |
| Total (row 17) | Total of exempt amounts | integer | OthersInc.OthersTotalTaxExe | = SUM(Sheet5.Amount) (I17) |

### Block: LTCG112A (D20(a) — LTCG u/s 112A not chargeable)
| Sheet no. | Field label | Type | Schema key | Rule / notes |
|---|---|---|---|---|
| D20(a) | Long Term capital gains u/s 112A not chargeable to Income-tax | group header | — | |
| i | Total sale consideration | integer | TotSaleCnsdrn | |
| ii | Total cost of acquisition | integer | TotCstAcqisn | |
| iii | Long term capital gains as per sec 112A | integer (max 125000) | LongCap112A | = IF(MAX(0, IncD.Sale_LTCG − IncD.Cost_LTCG) > 125000, 0, MAX(0, IncD.Sale_LTCG − IncD.Cost_LTCG)) (I21) |

### Block: Verification (row D22 area — VERIFICATION)
| Sheet cell | Field label | Type | Schema key | Rule / notes |
|---|---|---|---|---|
| C41 | I, [name] son/daughter of | text (maxLength 125) | Declaration.AssesseeVerName | Declaring assessee name |
| H41 | son/daughter of [father name] | text (maxLength 125) | Declaration.FatherName | |
| C44 | I am holding permanent account number | text | Declaration.AssesseeVerPAN | PAN of the person verifying |
| I43 | I further declare that I am making returns in my capacity as … and I am also competent to make this return and verify it | enum | Capacity | S, R, K, P (Self/Representative/Karta/Partner) |
| C45 | Place | text (maxLength 50) | Place | |
| G45 | Date (System Date) | date (computed) | — | = CONCATENATE(day/month/year of TODAY()) (H45); system date, not a schema leaf |

The verification cell A41 carries the e-verification code token `adpak4.701005120` (the utility's stored e-filing/verification identifier string), shown beside the declaration.

The declaration text: "solemnly declare that to the best of my knowledge and belief, the information given in the return is correct and complete and is in accordance with the provisions of the Income-tax Act, 1961".

### Block: TaxReturnPreparer (B23 / B24 — TRP details)
| Sheet no. | Field label | Type | Schema key | Rule / notes |
|---|---|---|---|---|
| B23 | If the return has been prepared by a Tax Return Preparer (TRP) give further details as below | group header | — | |
| C48 | TRP PIN (10 Digit) | text | IdentificationNoOfTRP | |
| G48 | Name of TRP | text (maxLength 125) | NameOfTRP | |
| B24 | Amount to be paid to TRP | integer | ReImbFrmGov | Reimbursement from Government (optional) |

## The rules the sheet computes
- **H4**: `= IT.AT` — Total Advance Tax Paid pulled from Schedule IT.
- **H5**: `= IT.SAT` — Total Self-Assessment Tax Paid pulled from Schedule IT.
- **H6**: `= SUM(TDSal.TotalTDSSal, TDS2i.Sum, TDS2ii.Sum)` — Total TDS Claimed = TDS1 col 4 + TDS2(i) col 6 + TDS2(ii).
- **H7**: `= SUM(TCS.AmtTCSClaimedThisYear)` — Total TCS Collected from Schedule TCS col 5.
- **I8**: `= SUM(H4:H7)` — Total Taxes Paid = D13 + D14 + D15 + D16.
- **I9**: `= ROUND(MAX(0, IncD.TotTaxPlusIntrstPay − IncD.TotalTaxesPaid), −1)` — Amount payable, only if D12 > D17, rounded to nearest ₹10.
- **I10**: `= ROUND(MAX(0, IncD.TotalTaxesPaid − IncD.TotTaxPlusIntrstPay), −1)` — Refund, only if D17 > D12, rounded to nearest ₹10.
- **I17**: `= SUM(Sheet5.Amount)` — Total exempt income (D20 table total).
- **I21**: `= IF((MAX(0,(IncD.Sale_LTCG − IncD.Cost_LTCG))) > 125000, 0, MAX(0,(IncD.Sale_LTCG − IncD.Cost_LTCG)))` — LTCG u/s 112A as per sec 112A; capped so that gains above ₹1,25,000 return 0 (schema also caps LongCap112A at maximum 125000).
- **G13:G14**: `= IF(bacValue=1, PART4_Nature_TP_bacYes, PART4_Nature_TP)` — the Category/Nature picker list switches on whether a bank account exists.
- **N13/N14/P13/P14/Q13**: SUMIFS/SUMIF helper columns that aggregate Sheet5 exempt amounts by Nature (e.g. Statutory Provident Fund, Sec 10(38), Agricultural & related incomes) — helper columns, not entered fields.
- **O31 / O32 / N28**: `= IF(F<>"", VLOOKUP(MID(F,1,4), IFSC_BankName, 2, FALSE))` — auto-populate Name of Bank from the first 4 chars of the IFSC.
- **H45**: `= CONCATENATE(...)` — builds the verification Date from TODAY() in DD/MM/YYYY form (system date).

## Dropdowns

**Do you have a bank account in India (row 23, hidden)** [I23]: `(Select)`, `YES`, `NO`. (Non-residents claiming refund with no bank account in India may select NO.)

**Capacity — "making returns in my capacity as"** [I43], schema enum S/R/K/P: `(Select)`, `Self`, `Representative`, `Karta`, `Partner`.

**Type of Account (bank table)** [H45 list = SchBA.TypeofAccount_list], schema enum SB/CA/CC/OD/NRO/OTH: `(Select)`, `Savings Account`, `Current Account`, `Cash Credit Account`, `Over draft account`, `Non Resident Account`, `Other`.

**Exempt-income Sub-Category (Others dropdown)** [H14 = Othe_dropdown]: `(Select)`, `10(2)-Member’s share from HUF`, `10(16)-Scholarships for education`, `Income exempt as per CBDT Circular`, `Income exempt as per CBDT Notification`, `Receipts not in the nature of income`.

**Country (attached to the hidden non-resident bank sub-table, [H37] = Country list):**
(Select), 93-AFGHANISTAN, 1001-ALAND ISLANDS, 355-ALBANIA, 213-ALGERIA, 684-AMERICAN SAMOA, 376-ANDORRA, 244-ANGOLA, 1264-ANGUILLA, 1010-ANTARCTICA, 1268-ANTIGUA AND BARBUDA, 54-ARGENTINA, 374-ARMENIA, 297-ARUBA, 61-AUSTRALIA, 43-AUSTRIA, 994-AZERBAIJAN, 1242-BAHAMAS, 973-BAHRAIN, 880-BANGLADESH, 1246-BARBADOS, 375-BELARUS, 32-BELGIUM, 501-BELIZE, 229-BENIN, 1441-BERMUDA, 975-BHUTAN, 591-BOLIVIA (PLURINATIONAL STATE OF), 1002-BONAIRE, SINT EUSTATIUS AND SABA, 387-BOSNIA AND HERZEGOVINA, 267-BOTSWANA, 1003-BOUVET ISLAND, 55-BRAZIL, 1014-BRITISH INDIAN OCEAN TERRITORY, 673-BRUNEI DARUSSALAM, 359-BULGARIA, 226-BURKINA FASO, 257-BURUNDI, 238-CABO VERDE, 855-CAMBODIA, 237-CAMEROON, 1-CANADA, 1345-CAYMAN ISLANDS, 236-CENTRAL AFRICAN REPUBLIC, 235-CHAD, 56-CHILE, 86-CHINA, 9-CHRISTMAS ISLAND, 672-COCOS (KEELING) ISLANDS, 57-COLOMBIA, 270-COMOROS, 242-CONGO, 243-CONGO (DEMOCRATIC REPUBLIC OF THE), 682-COOK ISLANDS, 506-COSTA RICA, 225-CÔTE D'IVOIRE, 385-CROATIA, 53-CUBA, 1015-CURAÇAO, 357-CYPRUS, 420-CZECHIA, 45-DENMARK, 253-DJIBOUTI, 1767-DOMINICA, 1809-DOMINICAN REPUBLIC, 593-ECUADOR, 20-EGYPT, 503-EL SALVADOR, 240-EQUATORIAL GUINEA, 291-ERITREA, 372-ESTONIA, 251-ETHIOPIA, 500-FALKLAND ISLANDS (MALVINAS), 298-FAROE ISLANDS, 679-FIJI, 358-FINLAND, 33-FRANCE, 594-FRENCH GUIANA, 689-FRENCH POLYNESIA, 1004-FRENCH SOUTHERN TERRITORIES, 241-GABON, 220-GAMBIA, 995-GEORGIA, 49-GERMANY, 233-GHANA, 350-GIBRALTAR, 30-GREECE, 299-GREENLAND, 1473-GRENADA, 590-GUADELOUPE, 1671-GUAM, 502-GUATEMALA, 1481-GUERNSEY, 224-GUINEA, 245-GUINEA-BISSAU, 592-GUYANA, 509-HAITI, 1005-HEARD ISLAND AND MCDONALD ISLANDS, 6-HOLY SEE, 504-HONDURAS, 852-HONG KONG, 36-HUNGARY, 354-ICELAND, 91-INDIA, 62-INDONESIA, 98-IRAN (ISLAMIC REPUBLIC OF), 964-IRAQ, 353-IRELAND, 1624-ISLE OF MAN, 972-ISRAEL, 5-ITALY, 1876-JAMAICA, 81-JAPAN, 1534-JERSEY, 962-JORDAN, 7-KAZAKHSTAN, 254-KENYA, 686-KIRIBATI, 850-KOREA (DEMOCRATIC PEOPLE'S REPUBLIC OF), 82-KOREA (REPUBLIC OF), 965-KUWAIT, 996-KYRGYZSTAN, 856-LAO PEOPLE'S DEMOCRATIC REPUBLIC, 371-LATVIA, 961-LEBANON, 266-LESOTHO, 231-LIBERIA, 218-LIBYA, 423-LIECHTENSTEIN, 370-LITHUANIA, 352-LUXEMBOURG, 853-MACAO, 389-MACEDONIA (THE FORMER YUGOSLAV REPUBLIC OF), 261-MADAGASCAR, 265-MALAWI, 60-MALAYSIA, 960-MALDIVES, 223-MALI, 356-MALTA, 692-MARSHALL ISLANDS, 596-MARTINIQUE, 222-MAURITANIA, 230-MAURITIUS, 269-MAYOTTE, 52-MEXICO, 691-MICRONESIA (FEDERATED STATES OF), 373-MOLDOVA (REPUBLIC OF), 377-MONACO, 976-MONGOLIA, 382-MONTENEGRO, 1664-MONTSERRAT, 212-MOROCCO, 258-MOZAMBIQUE, 95-MYANMAR, 264-NAMIBIA, 674-NAURU, 977-NEPAL, 31-NETHERLANDS, 687-NEW CALEDONIA, 64-NEW ZEALAND, 505-NICARAGUA, 227-NIGER, 234-NIGERIA, 683-NIUE, 15-NORFOLK ISLAND, 1670-NORTHERN MARIANA ISLANDS, 47-NORWAY, 968-OMAN, 92-PAKISTAN, 680-PALAU, 970-PALESTINE, STATE OF, 507-PANAMA, 675-PAPUA NEW GUINEA, 595-PARAGUAY, 51-PERU, 63-PHILIPPINES, 1011-PITCAIRN, 48-POLAND, 14-PORTUGAL, 1787-PUERTO RICO, 974-QATAR, 262-RÉUNION, 40-ROMANIA, 8-RUSSIAN FEDERATION, 250-RWANDA, 1006-SAINT BARTHÉLEMY, 290-SAINT HELENA, ASCENSION AND TRISTAN DA CUNHA, 1869-SAINT KITTS AND NEVIS, 1758-SAINT LUCIA, 1007-SAINT MARTIN (FRENCH PART), 508-SAINT PIERRE AND MIQUELON, 1784-SAINT VINCENT AND THE GRENADINES, 685-SAMOA, 378-SAN MARINO, 239-SAO TOME AND PRINCIPE, 966-SAUDI ARABIA, 221-SENEGAL, 381-SERBIA, 248-SEYCHELLES, 232-SIERRA LEONE, 65-SINGAPORE, 1721-SINT MAARTEN (DUTCH PART), 421-SLOVAKIA, 386-SLOVENIA, 677-SOLOMON ISLANDS, 252-SOMALIA, 28-SOUTH AFRICA, 1008-SOUTH GEORGIA AND THE SOUTH SANDWICH ISLANDS, 211-SOUTH SUDAN, 35-SPAIN, 94-SRI LANKA, 249-SUDAN, 597-SURINAME, 1012-SVALBARD AND JAN MAYEN, 268-SWAZILAND, 46-SWEDEN, 41-SWITZERLAND, 963-SYRIAN ARAB REPUBLIC, 886-TAIWAN, 992-TAJIKISTAN, 255-TANZANIA, UNITED REPUBLIC OF, 66-THAILAND, 670-TIMOR-LESTE (EAST TIMOR), 228-TOGO, 690-TOKELAU, 676-TONGA, 1868-TRINIDAD AND TOBAGO, 216-TUNISIA, 90-TURKEY, 993-TURKMENISTAN, 1649-TURKS AND CAICOS ISLANDS, 688-TUVALU, 256-UGANDA, 380-UKRAINE, 971-UNITED ARAB EMIRATES, 44-UNITED KINGDOM OF GREAT BRITAIN AND NORTHERN IRELAND, 2-UNITED STATES OF AMERICA, 1009-UNITED STATES MINOR OUTLYING ISLANDS, 598-URUGUAY, 998-UZBEKISTAN, 678-VANUATU, 58-VENEZUELA (BOLIVARIAN REPUBLIC OF), 84-VIET NAM, 1284-VIRGIN ISLANDS (BRITISH), 1340-VIRGIN ISLANDS (U.S.), 681-WALLIS AND FUTUNA, 1013-WESTERN SAHARA, 967-YEMEN, 260-ZAMBIA, 263-ZIMBABWE, 9999-OTHERS.

### Schema enum lists (from the schema, not utility dropdowns)
- **Category** (OthersInc.OthersIncDtls[].Category): AGRI, GOVC, ISI, SSRA, SRSC, SRST, SRPC, OTH.
- **Sub-Category** (OthersInc.OthersIncDtls[].SubCategory), 38 values: 10(1), 10(30), 10(31), 10(10BB), 10(10BC), 10(17A), 10(12AB), 10(15), 10(23FBB), 10(23FD), 10(35), 10(35A), 10(12C), 10(18), 10(19), 10(23AA), DMD, 10(32), 10(43), 10(19A), 10(26), 10(26AAA), 10(10D), 10(11), 10(11A), 10(12), 10(12A), 10(12AA), 10(12B), 10(12BA), 10(13), 10(25), 10(44), 10(2), 10(16), Incmexmptcircular, Incmexmptnotification, Receiptnotincme.
- **AccountType** (BankAccountDtls.AddtnlBankDetails[].AccountType): SB, CA, CC, OD, NRO, OTH.
- **UseForRefund** (BankAccountDtls.AddtnlBankDetails[].UseForRefund): true, false.
- **Capacity**: S, R, K, P.

## What repeats and what is one figure
- **Single figures**: TaxesPaid.AdvanceTax, TaxesPaid.SelfAssessmentTax, TaxesPaid.TDS, TaxesPaid.TCS, TaxesPaid.TotalTaxesPaid, BalTaxPayable, RefundDue, OthersInc.OthersTotalTaxExe, TotSaleCnsdrn, TotCstAcqisn, LongCap112A, the whole Verification block (one person), and the TaxReturnPreparer block (one TRP).
- **Arrays (repeat, one row per item)**: BankAccountDtls.AddtnlBankDetails[] (one per bank account) and OthersInc.OthersIncDtls[] (one per exempt-income line).

## Mandatory
- **TaxPaid** (required): TaxesPaid (with all of AdvanceTax, TDS, TCS, SelfAssessmentTax, TotalTaxesPaid) and BalTaxPayable. TCS is explicitly Required for ITR4.
- **Refund** (required): RefundDue and BankAccountDtls; within each AddtnlBankDetails row: IFSCCode, BankName, BankAccountNo, AccountType, UseForRefund.
- **TaxExmpIntIncDtls**: block optional; within a row OthAmount is required and OthersTotalTaxExe is required when the block is present.
- **LTCG112A** (required): TotSaleCnsdrn, TotCstAcqisn, LongCap112A.
- **Verification** (required): Declaration (AssesseeVerName, FatherName, AssesseeVerPAN), Capacity, Place.
- **TaxReturnPreparer** (required if present): IdentificationNoOfTRP, NameOfTRP; ReImbFrmGov optional.

Utility rule: for the bank-account table and the exempt-income table, "If any one field is filled then entire row shall be mandatory". Minimum one bank account must be selected for refund credit.

## Hidden rows — not built
These rows carry `hidden` in the utility and are NOT rendered as items:
- **r23** — "Do you have a bank account in India (Non-residents claiming refund with no bank account in India may select NO)?" with YES/NO — hidden control; the built form always collects bank accounts, so this switch is not exposed. (Its dropdown values are listed above for completeness.)
- **r24** — "Total number of savings and current bank accounts held by you at any time during the previous year (excluding dormant accounts)." — hidden count field.
- **r25** — "Details of all Bank Accounts held in India … Note: If you do not have any bank account in India, enter the details as IFSC - NNNN0NNNNNN, Name of Bank - NOT APPLICABLE, Account No. - NA999." — hidden instruction header for the non-resident case.
- **r26** — "a)" — hidden sub-label.
- **r27** — hidden bank sub-table header (Sl.No., IFS Code of the Bank, Name of the Bank, Account Number) for the non-resident/no-account variant; the live table is at r30.
- **r38 / r39** — "If any one of the field is filled then entire row shall become mandatory in table" / "(Do not delete blank rows)" — hidden helper notes.
- **r46** — "PAN" — hidden label in the verification area.
Helper/computation columns (N13, N14, O13, O14, P13, P14, Q13, N28, O31, O32) are formula helpers, not screen items.

## What this means for the build
- All of D13–D19 are computed (white) — pull from Schedule IT (Advance/Self-Assessment), Schedule TDS1/TDS2(i)/TDS2(ii), Schedule TCS, and IncomeDeductions totals; do not accept manual entry. Amount payable and Refund are mutually exclusive (one is zero) and both round to the nearest ₹10 via ROUND(...,−1).
- Bank name should auto-fill from IFSC via VLOOKUP on the first four IFSC characters; keep it editable. Enforce AccountType enum SB/CA/CC/OD/NRO/OTH and require at least one row with UseForRefund = true.
- LTCG112A "as per sec 112A" is the sale-minus-cost gain, but only reported here up to ₹1,25,000; above that the reportable figure is 0 (schema max 125000). This is exempt/for-reporting, consistent with ITR-4 eligibility (total income excl. LTCG u/s 112A ≤ ₹50 lakh).
- The exempt-income (D20) table is report-only: agricultural income above ₹5,000 forces ITR-3/5, so ITR-4 caps it here. Category/Sub-Category are two linked dropdowns; each nature can be selected only once (validation).
- Verification: Capacity drives Part A General mandatories (Representative details required when capacity = Representative). Date is the system date in DD/MM/YYYY. Place is required.
- TRP block is optional and only for returns prepared by a Tax Return Preparer.
