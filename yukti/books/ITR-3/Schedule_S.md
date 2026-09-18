# The book of Schedule S — ITR-3, A.Y. 2026-27

Read row by row from the utility's **Schedule S** sheet (rows 3–80, plus one
hidden helper row at 104), with the hidden-row flags, the helper columns and the
formula column, and confirmed against schema block `ScheduleS`. Source of item
numbering: `books/ITR-3/rules.json` (validation-rule text) and the sheet's own
lettering in column I/K/D.

---

## The shape

Schedule S is *"Details of Income from Salary"* — the salary head. It repeats a
full employer block (name, nature, address, and a `Salarys` object of Gross
salary 1a–1f) once **per employer** (the sheet ships two visible employer
blocks, rows 4–28 and 30–54, and the schema array `Salaries[]` is unbounded),
then a single set of summary rows for **all employers together**: Total gross
salary (2), relief u/s 89A, allowances exempt u/s 10 (3) with the HRA 10(13A)
sub-table, Net salary (4), Deduction u/s 16 (5) and Income chargeable under the
head Salaries (6). *"Fields marked in RED must not be left Blank."*

---

## The items

### Employer block — repeats once per employer (schema array `Salaries[]`)

| Sheet cell/no. | Field label | Type | Schema key | Rule / notes |
|---|---|---|---|---|
| D4 / D30 | Name of Employer | string | `Salaries[].NameOfEmployer` | required, maxLength 125 |
| H4 / H30 | Nature of employer | enum | `Salaries[].NatureOfEmployment` | required; dropdown `EmpCategory` |
| K4 / K30 | TAN of Employer (mandatory if tax is deducted) | string | `Salaries[].TANofEmployer` | optional |
| D5 / D31 | Address of employer | string | `Salaries[].AddressDetail.AddrDetail` | required, maxLength 200 |
| J5 / J31 | Town/City | string | `Salaries[].AddressDetail.CityOrTownOrDistrict` | required, maxLength 50 |
| D6 / D32 | State | enum | `Salaries[].AddressDetail.StateCode` | required; dropdown `State` |
| K5 / K31 | Pincode / Pin code | integer | `Salaries[].AddressDetail.PinCode` | 100000–999999 |
| L5 / L31 | Zip code | string | `Salaries[].AddressDetail.ZipCode` | maxLength 8 |
| E7 / E33 | Gross Salary (1a + 1b + 1c + 1d + 1e + 1f) | integer | `Salaries[].Salarys.GrossSalary` | required; = 1a+1b+1c+1d+1e+1f |
| 1a (I8/I34) | a — Salary as per section 17(1) | integer | `Salaries[].Salarys.Salary` | required |
| 1a rows (Sl no / Nature of salary / Description / Amount) | Nature of salary breakup | array | `Salaries[].Salarys.NatureOfSalary.OthersIncDtls[]` → `NatureDesc`, `OthNatOfInc`, `OthAmount` | dropdown `salarydropdown1` |
| 1b (I13/I39) | b — Value of perquisites as per section 17(2) | integer | `Salaries[].Salarys.ValueOfPerquisites` | required |
| 1b rows (Sl no / Nature of perquisites / Description / Amount) | Perquisites breakup | array | `Salaries[].Salarys.NatureOfPerquisites.OthersIncDtls[]` → `NatureDesc`, `OthNatOfInc`, `OthAmount` | dropdown `salarydropdown2` |
| 1c (I18/I44) | c — Profit in lieu of salary as per section 17(3) | integer | `Salaries[].Salarys.ProfitsinLieuOfSalary` | required |
| 1c rows (Sl no / Nature of Profit in lieu of Salary / Description / Amount) | Profit-in-lieu breakup | array | `Salaries[].Salarys.NatureOfProfitInLieuOfSalary.OthersIncDtls[]` → `NatureDesc`, `OthNatOfInc`, `OthAmount` | dropdown `salarydropdown3` |
| 1d (I22/I48) | d — Income from retirement benefit account maintained in a notified country u/s 89A | integer | `Salaries[].Salarys.IncomeNotified89A` | optional |
| 1d rows (Sl no / Country / Amount) | Notified-country breakup | array | `Salaries[].Salarys.IncomeNotified89AType[]` → `NOT89ACountrycode`, `NOT89AAmount` | Country dropdown: United States of America, United Kingdom of Great Britain and Northern Ireland, Canada |
| 1e (I27/I53) | e — Income from retirement benefit account maintained in a Country other than notified country u/s 89A | integer | `Salaries[].Salarys.IncomeNotifiedOther89A` | optional |
| 1f (I28/I54) | f — Income taxable during the previous year on which relief u/s 89A was claimed in any earlier previous year | integer | `Salaries[].Salarys.IncomeNotifiedPrYr89A` | optional |

### Summary block — one figure for all employers together

| Sheet cell/no. | Field label | Type | Schema key | Rule / notes |
|---|---|---|---|---|
| E57 | Total gross salary from all employers | integer | `TotalGrossSalary` | **required**; = sum of each employer's Gross Salary |
| D58 / K58 (3a) | Income claimed for relief from taxation u/s 89A | integer | `Increliefus89A` | optional; Net Salary formula (E75) calls it "2a" |
| E59 | Less : allowances to the extent exempt u/s 10 | integer | `AllwncExtentExemptUs10` | **required**; = sum of all the dropdowns |
| rows 60–64 (Sl.No / Nature of Exempt Allowance / Description / Amount) | Exempt-allowance breakup | array | `AllwncExemptUs10.AllwncExemptUs10Dtls[]` → `SalNatureDesc`, `SalOthNatOfInc`, `SalOthAmount` | dropdown `AllowanceBACYes`; same dropdown may be selected more than once |
| E66 | Sec 10(13A)-Allowance to meet expenditure incurred on house rent | integer | (feeds `AllwncExemptUs10`) | = `Sch10of13A_ElgiblExmptAllwnce10of13A` |
| E67 / D67 | Section 10(13A) — House rent allowance(HRA) | object | `Section10_13A` | HRA computation sub-table |
| E68 | Place of Residence | enum | `Section10_13A.Placeofwork` | dropdown: 1. Metro / 2. Non-Metro |
| E69 | Actual HRA received (A) | integer | `Section10_13A.ActlHRARecv` | required |
| E70 | Actual Rent paid | integer | `Section10_13A.ActlRentPaid` | required |
| E71 | Details of Salary as per Section 17(1) | integer | `Section10_13A.DtlsSalUsSec171` | required |
| E72 | Actual rent paid-10% of salary (B) (3-10% of 4) | integer | `Section10_13A.ActlRentPaid10Per` | required |
| E73 | 50% /40% of salary (C) | integer | `Section10_13A.Sal40Or50Per` | required |
| E74 | Eligible Exempt Allowance u/s 10(13A) | integer | `Section10_13A.EligbleExmpAllwncUs13A` | required |
| E75 | Net Salary (2– 2a - 3) | integer | `NetSalary` | **required** |
| E76 | Deduction u/s 16 (5a + 5b + 5c) | integer | `DeductionUS16` | **required**; = 5a+5b+5c |
| 5a (I77) | a — Standard deduction u/s 16(ia) | integer | `DeductionUnderSection16ia` | **required**; max 75000 |
| 5b (I78) | b — Entertainment allowance u/s 16(ii) | integer | `EntertainmntalwncUs16ii` | **required**; max 5000 |
| 5c (I79) | c — Professional tax u/s 16(iii) | integer | `ProfessionalTaxUs16iii` | **required**; max 5000 |
| E80 | Income chargeable under the Head 'Salaries' (4 - 5) | integer | `TotIncUnderHeadSalaries` | **required**; = Net Salary − Deduction u/s 16 |

---

## The rules the sheet computes

- **[E7 / E33] Gross Salary** = 1a + 1b + 1c + 1d + 1e + 1f (per employer). Rule: *"In Schedule S, Sl.no 1 Gross Salary (1a + 1b + 1c +1d+1e+1f) should be equal to the sum of Sl.no 1a+1b+1c +1d+1e+1f."*
- **[Q7 / Q33]** `SUMIF(Salary.ValueSection1, "Stock options allotted or transferred by employer being an eligible start-up ...")` — helper that isolates the deferred-ESOP perquisite line.
- **[E57] Total gross salary** = sum of each employer's gross. Rule: *"Sl.No. 2 Total Gross Salary(from all employers) should be sum of Sl.No. 1 +2+3…."*
- **[L59]** Allowances exempt u/s 10 `= SUM(Salary.Amount1, Sheet39.HRA)` — sum of the 10-series dropdowns plus the HRA table output. Rule: *"Sl.No. 3 Allowances to the extent exempt u/s 10 should be equal to the sum of all the dropdowns."*
- **[J66] Sec 10(13A) allowance** `= Sch10of13A_ElgiblExmptAllwnce10of13A`.
- **[J69] Actual HRA received** `= IF(bacValue=1, 0, MAX(0, HRA_SAL))` — HRA exemption is **nil under the new regime** (`bacValue=1`).
- **[J72] Actual rent paid − 10% of salary** `= ROUND(Sch10of13A_ActlRentpaid − (Sch10of13A_DetlsofSalpersec17of1 * 10%), 0)`.
- **[J74] Eligible exempt allowance u/s 10(13A)** `= MAX(MIN(Sch10of13A_ActlHRArecivedA, Sch10of13A_Actlrentpaid10persalaryB, Sch10of13A_50Por40Pofsalary), …)` — the classic minimum-of-three HRA cap. Rules 1020/1025: HRA not more than rent paid less 10% of basic+DA, and not more than 50% (metro) / 40% (non-metro) of basic+DA.
- **[L75] Net Salary** `= MAX(0, (Tempgross − SAL.ExemptUSectionOth1 − Increliefus89A))` i.e. 2 − 2a − 3. Rule: *"Sl. No. 4 Net Salary should be output of Sl.No. 2 - 2a - 3."*
- **[L76] Deduction u/s 16** `= SUM(SAL.DeductionUnder6Section1, SAL.Entertainment_allowance_1, SAL.DeductionUnderSection1)` = 5a+5b+5c.
- **[J77] Standard deduction u/s 16(ia)** `= MIN(SAL.Netsalary1, IF(bacValue=2, 50000, IF(bacValue=1, 75000, )))` — ₹75,000 under new regime (`bacValue=1`), ₹50,000 under old (`bacValue=2`), capped at net salary. Schema caps `DeductionUnderSection16ia` at 75000.
- **[L80] Income chargeable under Salaries** `= MAX(0, (SAL.Netsalary1 − SAL.Deduction1))` = 4 − 5. Rule: *"Sl.no. 6 Income chargeable under Salaries should be output of Sl.No. 4- 5."*
- Serial-number helpers `[F11]=F10+1`, `[F16]=1+F15`, `[I62]=I61+1` etc. simply auto-number breakup rows.
- Other validation-rule caps carried by the schedule: gratuity 10(10) ≤ ₹20 lakh (PSU/Others) or ₹25 lakh (CG/SG); 10(10B)(ii) and 10(10C) ≤ ₹5,00,000; entertainment allowance 16(ii) only for CG/SG/PSU, capped at ₹5,000 or 1/5th of basic; relief u/s 89A at 2a cannot be claimed if 1d is zero; one country cannot be selected twice under 1d; Schedule Salary must be blank if HUF status.

---

## Dropdowns

- **Nature of employer** (`EmpCategory`, cells H4/H30 via J4/J30): (Select); Central Government; State Government; Public Sector Undertaking; CG-Pensioners; SG-Pensioners; PSU-Pensioners; Others-Pensioners; OTHERS. Schema enum `NatureOfEmployment`: CGOV, SGOV, PSU, PE, PESG, PEPS, PEO, OTH.
- **State** (`State`, cells H6/H32): (Select); 01-ANDAMAN AND NICOBAR ISLANDS; 02-ANDHRA PRADESH; 03-ARUNACHAL PRADESH; 04-ASSAM; 05-BIHAR; 06-CHANDIGARH; 07-Dadra Nagar and Haveli; 08-Daman and Diu; 09-DELHI; 10-GOA; 11-GUJARAT; 12-HARYANA; 13-HIMACHAL PRADESH; 14-JAMMU AND KASHMIR; 15-KARNATAKA; 16-KERALA; 17-LAKHSWADEEP; 18-MADHYA PRADESH; 19-MAHARASHTRA; 20-MANIPUR; 21-MEGHALAYA; 22-MIZORAM; 23-NAGALAND; 24-ODISHA; 25-PUDUCHERRY; 26-PUNJAB; 27-RAJASTHAN; 28-SIKKIM; 29-TAMIL NADU; 30-TRIPURA; 31-UTTAR PRADESH; 32-WEST BENGAL; 33-CHHATTISGARH; 34-UTTARAKHAND; 35-JHARKHAND; 36-TELANGANA; 37-LADAKH; 99-Foreign. Schema enum `StateCode`: 01–37, 99.
- **Nature of salary — 1a** (`salarydropdown1`, cells G10:G12/G36:G38): (Select); Basic Salary; Dearness Allowance(DA); Conveyance Allowance; House Rent Allowance(HRA); Leave Travel Allowance(LTA); Children Education Allowance(CEA); Other Allowance; The contribution made  by the Employer  towards  pension scheme as referred under section 80CCD; Amount deemed to be income under rule 6 of Part-A of Fourth Schedule; Amount deemed to be income under rule 11(4) of Part-A of Fourth Schedule; Annuity or pension; Commuted Pension; Gratuity; Fees/ commission; Advance of salary; Leave Encashment; Contribution made by the central government towards Agnipath scheme as referred  under section 80CCH; Others.
- **Nature of perquisites — 1b** (`salarydropdown2`, cells G15:G17/G41:G43): (Select); Accommodation; Cars / Other Automotive; Sweeper, gardener, watchman or personal attendant; Gas, electricity, water; Interest free or concessional loans; Holiday expenses; Free or concessional travel; Free meals; Free education; Gifts, vouchers, etc.; Credit card expenses; Club expenses; Use of movable assets by employees; Transfer of assets to employee; Value of any other benefit/amenity/service/privilege; Stock options allotted or transferred by employer being an eligible start-up referred to in section 80-IAC-Tax to be defered; Stock options (non-qualified options) other than ESOP in col 16 above.; Contribution by employer to fund and scheme taxable under section 17(2)(vii); Annual accretion by way of interest, dividend etc. to the balance at the credit of fund and scheme referred to in section 17(2)(vii) and taxable under section 17(2)(viia); Other benefits or amenities; Stock options allotted or transferred by employer being an eligible start-up referred to in section 80-IAC-Tax not to be defered.
- **Nature of Profit in lieu of Salary — 1c** (`salarydropdown3`, cells G20:G21/G46:G47): (Select); Compensation due/received by an assessee from his employer or former employer in connection with the  termination of his employment or modification thereto; Any payment due/received by an assessee from his employer or a former employer or from a provident or other fund, sum received under Keyman Insurance Policy including Bonus thereto; Any amount due/received by assessee from any person before joining or after cessation of employment with that person; Any Other.
- **Country — 1d** (cells G24:G26/G50:G52): United States of America; United Kingdom of Great Britain and Northern Ireland; Canada. Schema enum `NOT89ACountrycode`: US, UK, CA.
- **Nature of Exempt Allowance — 3** (`AllowanceBACYes`, cells G61:G64): (Select); Sec 10(6)-Remuneration received as an official, by whatever name called, of an embassy, high commission etc; Sec 10(7)-Allowances or perquisites paid or allowed as such outside India by the Government to a citizen of India for rendering service outside India; Sec 10(10)-Death-cum-retirement gratuity received; Sec 10(10A)-Commuted value of pension received; Sec 10(10AA)-Earned leave encashment on Retirement; Sec 10(10B) First proviso - Compensation limit notified by CG in the Official Gazette; Sec 10(10B) Second proviso - Compensation under scheme approved by the Central Government; Sec 10(10C)-Amount received/receivable on voluntary retirement or termination of service; Sec 10(10CC)-Tax paid by employer on non-monetary perquisite; Sec 10(14)(i)-Allowances referred in sub-clauses (a) to (c) of sub-rule (1) in Rule 2BB; Sec 10(14)(ii)-Transport allowance granted to certain physically handicapped assessee. Schema enum `SalNatureDesc` (17): 10(5), 10(6), 10(7), 10(10), 10(10A), 10(10AA), 10(10B)(i), 10(10B)(ii), 10(10C), 10(10CC), 10(13A), 10(14)(i), 10(14)(ii), 10(14)(i)(115BAC), 10(14)(ii)(115BAC), EIC, 10(17).
- **Place of Residence — 10(13A)** (cell J68): (Select); 1. Metro; 2. Non-Metro. Schema enum `Placeofwork`: 1, 2.

---

## What repeats and what is one figure

- **Repeats (arrays):** the whole employer block — `Salaries[]` (two visible on the sheet, unbounded in schema). Inside each employer, the four breakup grids repeat: `NatureOfSalary.OthersIncDtls[]` (1a), `NatureOfPerquisites.OthersIncDtls[]` (1b), `NatureOfProfitInLieuOfSalary.OthersIncDtls[]` (1c), and `IncomeNotified89AType[]` (1d country/amount). The exempt-allowance grid `AllwncExemptUs10.AllwncExemptUs10Dtls[]` (rows 60–64) also repeats.
- **One figure (single):** everything in the summary block — `TotalGrossSalary`, `Increliefus89A`, `AllwncExtentExemptUs10`, the entire `Section10_13A` HRA object, `NetSalary`, `DeductionUS16`, `DeductionUnderSection16ia`, `EntertainmntalwncUs16ii`, `ProfessionalTaxUs16iii`, `TotIncUnderHeadSalaries`.

---

## Mandatory

Schema `required` at `ScheduleS` root: `TotalGrossSalary`, `AllwncExtentExemptUs10`, `NetSalary`, `DeductionUS16`, `DeductionUnderSection16ia`, `EntertainmntalwncUs16ii`, `ProfessionalTaxUs16iii`, `TotIncUnderHeadSalaries`. Within each `Salaries[]` element: `NameOfEmployer`, `NatureOfEmployment`, `AddressDetail` (and within it `AddrDetail`, `CityOrTownOrDistrict`, `StateCode`), `Salarys` (and within it `GrossSalary`, `Salary`, `ValueOfPerquisites`, `ProfitsinLieuOfSalary`). Within breakup rows: `NatureDesc` and `OthAmount`; within 1d: `NOT89ACountrycode`, `NOT89AAmount`. Within `AllwncExemptUs10Dtls[]`: `SalNatureDesc`, `SalOthAmount`. Within `Section10_13A`: `Placeofwork`, `ActlHRARecv`, `ActlRentPaid`, `DtlsSalUsSec171`, `ActlRentPaid10Per`, `Sal40Or50Per`, `EligbleExmpAllwncUs13A`.

---

## Hidden rows — not built

| Row | Cell/content | Why hidden |
|---|---|---|
| 104 (H) | [G104] `aaa` | Off-schedule helper stub; not a schedule item, never rendered. |

(No other rows in the visible 3–80 range are flagged `H`. Breakup data-entry rows 10–12, 15–17, 20–21, 23–28, 36–38, 41–43, 46–47, 49–54, 61–64 are visible input rows driven by the arrays above, not hidden.)

---

## What this means for the build

- Render **one repeatable employer card** bound to `Salaries[]`; do not hard-code two — the sheet just pre-draws two, the schema is unbounded. Each card holds the 1a/1b/1c breakup grids, the 1d country grid, and scalar 1e/1f.
- **Gross Salary (1)** and **Total gross salary (2)** are computed, not entered — 1 = sum of 1a–1f per employer, 2 = sum over employers. Lock them.
- The **10(13A) HRA sub-table** is a self-contained calculator: exemption = min(actual HRA, rent paid − 10% of basic+DA, 50%/40% of basic+DA), and **forced to 0 under the new regime** (`bacValue=1`). Wire `Placeofwork` (metro vs non-metro) into the 50%/40% branch.
- **Standard deduction 16(ia)** flips on regime: ₹75,000 (new) / ₹50,000 (old), capped at net salary; schema hard-caps 75000. **16(ii)** and **16(iii)** cap at ₹5,000 each, and 16(ii) only for CG/SG/PSU employers.
- Note the label/formula mismatch: the relief-u/s-89A line is lettered **3a** on the sheet (D58/K58) but the Net Salary formula (E75) references it as **"2a"** — schema key is `Increliefus89A`. Relief cannot be claimed unless 1d (`IncomeNotified89A`) is non-zero.
- The exempt-allowance dropdown (`AllowanceBACYes`) lists only the old-regime-eligible sections; the schema enum `SalNatureDesc` carries the fuller 17-value set (including 10(5), 10(13A), the 115BAC variants, EIC, 10(17)). The same section may be picked more than once.


## Additional visible rows — verbatim from the sheet (completeness)
Rows present on the utility sheet and captured here verbatim so every visible label is in the book:

- Salary as per section 17(1)
- 50% /40% of salary (C)
- Net Salary (2– 2a - 3)
- Deduction u/s 16 (5a + 5b + 5c)
- Professional tax u/s 16(iii)
