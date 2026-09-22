# The book of Schedule OS — Income from Other Sources · ITR-3, A.Y. 2026-27

Read row by row from the utility's **OS** sheet (schema block `ScheduleOS`),
with its hidden-row flags, formulas and dropdowns, and cross-checked against the
CBDT ITR-3 schema and `books/ITR-3/rules.json`. Every item number, label,
dropdown value and rule below is the department's own; nothing is invented.
Item numbers are taken from the rules document, not from counting rows.

---

## The shape

Schedule OS is one continuous computation, numbered 1 to 9, followed by a
quarterly accrual/receipt table (item 10). It is not a flat list of income
types: it starts with **gross income at normal rates** (item 1), adds **income
at special rates** (item 2), takes off **section 57 deductions** (item 3), adds
back **amounts not deductible u/s 58** (item 4) and **profits chargeable u/s 59**
(item 5), reduces **89A relief** (item 5a), lands on **net normal-rate income**
(item 6), then **income other than race horses** (item 7), a separate **race-horse
working** (item 8, 8a–8e) and finally **income under the head** (item 9). ITR-3
carries the full special-rate machinery — 115BB lottery, 115BBJ online games,
115BBE unexplained credits, 111 accumulated PF, other special-rate sources, PTI
special-rate income, and the 2f DTAA table — plus race-horse income with its own
loss rule and the 89A retirement-account lines.

The sheet's closing note applies to the whole schedule: *"Please include the
income of the specified persons (spouse, minor child, etc.) referred to in
Schedule SPI while computing the income under this head."*

---

## The items

### Block `ScheduleOS` — Income from other Sources

Item numbers per rules.json; `IncOthThanOwnRaceHorse` (abbreviated `IOTORH`
below) is the parent object for items 1–7.

| Sl. | Field label | Type | Schema key | Rule / notes |
|---|---|---|---|---|
| **1** | Gross income chargeable to tax at normal applicable rates (1a + 1b + 1c + 1d + 1e) | int | `IOTORH.GrossIncChrgblTaxAtAppRate` | computed J4 = 1a+1b+1c+1d+1e |
| **1a** | Dividends, Gross (ai + aii + aiii) | int | `IOTORH.DividendGross` ★ | computed J5 |
| **1a(i)** | Dividend income [other than (ii) and (iii)] | int | `IOTORH.DividendOthThan22e` ★ | ordinary dividend |
| **1a(ii)** | Dividend income u/s 2(22)(e) | int | `IOTORH.Dividend22e` ★ | deemed dividend |
| **1a(iii)** | Dividend income u/s 2(22)(f) | int | `IOTORH.Dividend22f` | buy-back treated as dividend |
| **1b** | Interest Gross (bi + bii + biii + biv + bv + bvi + bvii + bviii + bix) | int | `IOTORH.InterestGross` ★ | computed J9 |
| **1b(i)** | From Savings Bank | int | `IOTORH.IntrstFrmSavingBank` ★ | |
| **1b(ii)** | From Deposit (Bank/ Post Office/ Co-operative Society) | int | `IOTORH.IntrstFrmTermDeposit` ★ | |
| **1b(iii)** | From Income Tax refund | int | `IOTORH.IntrstFrmIncmTaxRefund` ★ | |
| **1b(iv)** | In the nature of Pass through income\loss | int | `IOTORH.NatofPassThrghIncome` ★ | may be negative |
| **1b(v)** | Interest accrued on contributions to provident fund to the extent taxable as per first proviso to section 10(11) | int | `IOTORH.IntrstSec10XIFirstProviso` | |
| **1b(vi)** | Interest accrued on contributions to provident fund to the extent taxable as per Second proviso to section 10(11) | int | `IOTORH.IntrstSec10XISecondProviso` | |
| **1b(vii)** | Interest accrued on contributions to provident fund to the extent taxable as per first proviso to section 10(12) | int | `IOTORH.IntrstSec10XIIFirstProviso` | |
| **1b(viii)** | Interest accrued on contributions to provident fund to the extent taxable as per second proviso to section 10(12) | int | `IOTORH.IntrstSec10XIISecondProviso` | |
| **1b(ix)** | Others including interest from Companies, NBFCs & HFCs | int | `IOTORH.IntrstFrmOthers` ★ | |
| **1c** | Rental income from machinery, plants, buildings, etc., Gross | int | `IOTORH.RentFromMachPlantBldgs` ★ | |
| **1d** | Income of the nature referred to in section 56(2)(x) which is chargeable to tax (di + dii + diii + div + dv) | int | `IOTORH.Tot562x` ★ | computed J20 = MAX(0, di..dv) |
| **1d(i)** | Aggregate value of sum of money received without consideration | int | `IOTORH.Aggrtvaluewithoutcons562x` ★ | |
| **1d(ii)** | In case immovable property is received without consideration, stamp duty value of property | int | `IOTORH.Immovpropwithoutcons562x` ★ | |
| **1d(iii)** | In case immovable property is received for inadequate consideration, stamp duty value of property in excess of such consideration | int | `IOTORH.Immovpropinadeqcons562x` ★ | |
| **1d(iv)** | In case any other property is received without consideration, fair market value of property | int | `IOTORH.Anyotherpropwithoutcons562x` ★ | |
| **1d(v)** | In case any other property is received for inadequate consideration, fair market value of property in excess of such consideration | int | `IOTORH.Anyotherpropinadeqcons562x` ★ | |
| **1e** | Any other income (please specify nature) | int | `IOTORH.AnyOtherIncome` ★ | computed J26; drives the OthersInc table + fixed lines below |
| **1e — Family Pension** | Family Pension | int | `IOTORH.FamilyPension` ★ | fixed line under 1e |
| **1e — table** | Sl. No / Nature / Amount | array | `IOTORH.OthersInc.OthersIncDtls[]` | user-entered any-other-income rows |
| — | Nature | string | `…OthersIncDtls[].OthNatOfInc` ★ | maxLength 50 |
| — | Amount | int | `…OthersIncDtls[].OthAmount` ★ | |
| **1e — 89A notified** | Income from retirement benefit account maintained in a notified country u/s 89A | int | `IOTORH.IncomeNotified89AOS` | computed J29 = US+UK+CA |
| **2a** | United States of America | array elem | `IOTORH.IncomeNotified89ATypeOS[]` → `NOT89ACountrycode` = US ★, `NOT89AAmount` ★ | |
| **2b** | United Kingdom of Great Britain and Northern Ireland | array elem | `…NOT89ACountrycode` = UK ★ | |
| **2c** | Canada | array elem | `…NOT89ACountrycode` = CA ★ | enum: US, UK, CA |
| **1e — 89A other** | Income from retirement benefit account maintained in a country other than notified country u/s 89A | int | `IOTORH.IncomeNotifiedOther89AOS` | |
| **1e — 89A earlier PY** | Income taxable during the previous year on which relief u/s 89A was claimed in any earlier previous year | int | `IOTORH.IncomeNotifiedPrYr89AOS` | |
| **1e — 56(2)(xii)** | Any specified sum received by a unit holder from a business trust during the previous year referred to in section 56(2)(xii) | int | `IOTORH.SumRecdPrYrBusTRU562xii` | |
| **1e — 56(2)(xiii)** | Any sum is received, including the amount allocated by way of bonus, at any time during a previous year referred to in section 56(2)(xiii) | int | `IOTORH.SumRecdPrYrLifIns562xiii` | |
| **2** | Income chargeable at special rates (2ai + 2aii + 2b + 2c + 2d + 2e + 2f elements related to sl.no.1) | int | `IOTORH.IncChargeableSpecialRates` ★ | computed J40 |
| **2a(i)** | Winnings from lotteries, crossword puzzles, races, card games etc. chargeable u/s 115BB | int | `IOTORH.LtryPzzlChrgblUs115BB` ★ | |
| **2a(ii)** | Income by way of winnings from online games chargeable u/s 115BBJ | int | `IOTORH.IncChrgblUs115BBJ` | visible line r45 (hidden gross/adjustment feed it — see Hidden rows) |
| **2b** | Income chargeable u/s 115BBE (bi + bii + biii + biv + bv + bvi) | int | `IOTORH.IncChrgblUs115BBE` ★ | computed J46 = MAX(0, bi..bvi) |
| **2b(i)** | Cash credits u/s 68 | int | `IOTORH.CashCreditsUs68` ★ | |
| **2b(ii)** | Unexplained investments u/s 69 | int | `IOTORH.UnExplndInvstmntsUs69` ★ | |
| **2b(iii)** | Unexplained money etc. u/s 69A | int | `IOTORH.UnExplndMoneyUs69A` ★ | |
| **2b(iv)** | Undisclosed investments etc. u/s 69B | int | `IOTORH.UnDsclsdInvstmntsUs69B` ★ | |
| **2b(v)** | Unexplained expenditure etc. u/s 69C | int | `IOTORH.UnExplndExpndtrUs69C` ★ | |
| **2b(vi)** | Amount borrowed or repaid on hundi u/s 69D | int | `IOTORH.AmtBrwdRepaidOnHundiUs69D` ★ | |
| **2c** | Accumulated balance of recognised provident fund taxable u/s 111 | int/table | `IOTORH.TaxAccumulatedBalRecPF` | table: Sl./AY/Income Benefit/Tax Benefit |
| — | Assessment Year | string | `…TaxAccmltdBalRecPFDtls[].AssessmentYear` ★ | 26-value enum dropdown |
| — | Income Benefit | int | `…TaxAccmltdBalRecPFDtls[].IncomeBenefit` ★ | |
| — | Tax Benefit | int | `…TaxAccmltdBalRecPFDtls[].TaxBenefit` ★ | |
| — | Total (Income Benefit) | int | `…TaxAccumulatedBalRecPF.TotalIncomeBenefit` ★ | computed |
| — | Total (Tax Benefit) | int | `…TaxAccumulatedBalRecPF.TotalTaxBenefit` ★ | computed J59 |
| **2d** | Any other income chargeable at special rate (total of di to dxx) | int | `IOTORH.OthersGross` ★ | computed J60 = SUM(SourceAmount) |
| — | Sl. No / Nature / Amount | array | `IOTORH.OthersGrossDtls[]` → `SourceDescription`, `SourceAmount` | Nature is the NRI special-rate dropdown |
| **2e** | Pass through income in the nature of income from other sources claimed as chargeable at special rate | int | `IOTORH.PassThrIncOSChrgblSplRate` ★ | computed J69 = SUM(PTI amounts) |
| — | Sl. No / Nature / Amount | array | `IOTORH.PTIOthersGrossDtls[]` → `SourceDescription` ★, `SourceAmount` | Nature is the PTI NRI dropdown |
| **2f** | Amount included in 1 and 2 above, which is claimed as chargeable at special rates in India as per DTAA | int | `IOTORH.IncChargblSplRateOS.TotalAmtTaxUsDTAASchOs` ★ | computed N78 (SUMIF on TRC for NRI) |
| **2f — table** | Sl.No / Amount of income / Item No. / Country name & code / Article of DTAA / Rate as per Treaty / Whether TRC obtained (Y/N) / Section of I.T. Act / Rate as per I.T. Act / Applicable rate [lower of (6) or (9)] | array | `…IncChargblSplRateOS.NRIOsDTAA.NRIDTAADtlsSchOS[]` | see keys below |
| — | Amount of income | int | `…NRIDTAADtlsSchOS[].DTAAamt` ★ | |
| — | Item No.1ai, 1aiii, 1b to 2 in which included | string | `…NRIDTAADtlsSchOS[].ItemNoincl` ★ | dropdown: 1ai,1aiii,1b,1c,1d,2ai,2aii,2d,2e |
| — | Nature of income | string | `…NRIDTAADtlsSchOS[].NatureOfIncome` ★ | |
| — | Country name | string | `…NRIDTAADtlsSchOS[].CountryName` ★ | |
| — | Country code (excluding India) | string | `…NRIDTAADtlsSchOS[].CountryCodeExcludingIndia` ★ | 250-code dropdown |
| — | Article of DTAA | string | `…NRIDTAADtlsSchOS[].DTAAarticle` ★ | |
| — | Rate as per Treaty (enter NIL, if not chargeable) | number | `…NRIDTAADtlsSchOS[].RateAsPerTreaty` ★ | |
| — | Whether TRC obtained (Y/N) | string | `…NRIDTAADtlsSchOS[].TaxRescertifiedFlag` | dropdown Yes/No |
| — | Section of I.T. Act | string | `…NRIDTAADtlsSchOS[].RateAsPerITAct`* / section field | M-column INDIRECT list by residential status |
| — | Rate as per I.T. Act | number | `…NRIDTAADtlsSchOS[].RateAsPerITAct` ★ | |
| — | Applicable rate [lower of (6) or (9)] | number | `…NRIDTAADtlsSchOS[].ApplicableRate` | computed = lower of treaty / IT Act |
| **3** | Deductions under section 57 (other than those relating to income chargeable at special rates under 2) | object | `IOTORH.Deductions` | |
| **3a(i)** | Expenses / deductions other than "aii" (in case of other than family pension) | int | `IOTORH.Deductions.Expenses` | |
| **3a(ii)** | Deduction u/s 57 (iia) (in case of family pension only) | int | `IOTORH.Deductions.DeductionUs57iia` | computed J88 = MIN(1/3 family pension, 25000); max 25000 |
| **3b** | Depreciation | int | `IOTORH.Deductions.Depreciation` ★ | allowed only if income offered at 1c |
| **3c** | Interest expenditure u/s 57(i) [available only if income offered in 1a(i) and / or 1a(ii)] | int | `IOTORH.Deductions.UsrIntExp57` (claimed) / `IntExp57` (eligible) | eligible ≤ 20% of dividend |
| — | Interest expenditure claimed | int | `IOTORH.Deductions.UsrIntExp57` | user-entered |
| **3c(i)** | Eligible amount of interest expenditure u/s 57(1) – computed value | int | `IOTORH.Deductions.IntExp57` | computed |
| **3d** | Total | int | `IOTORH.Deductions.TotDeductions` ★ | computed J93 = 3ai+3aii+3b+3c |
| **4** | Amounts not deductible u/s 58 | int | `IOTORH.AmtNotDeductibleUs58` | |
| **5** | Profits chargeable to tax u/s 59 | int | `IOTORH.ProfitChargTaxUs59` | |
| **5a** | Income claimed for relief from taxation u/s 89A | int | `IOTORH.Increliefus89AOS` | |
| **6** | Net Income from other sources chargeable at normal applicable rates 1 (after reducing income related to DTAA and 89A) | int | (computed L97 into `BalanceNoRaceHorse` chain) | = 1 − 3 + 4 + 5 − 5a; a loss goes to CYLA |
| **7** | Income from other sources (other than from owning race horses) (2 + 6) (enter 6 as nil, if negative) | int | `IOTORH.BalanceNoRaceHorse` ★ | computed L98 |
| **7 total** | Income from other sources, other than owning race horses | int | `TotOthSrcNoRaceHorse` ★ | root-level total |
| **8** | Income from the activity of owning and maintaining race horses | object | `IncFromOwnHorse` | |
| **8a** | Receipts | int | `IncFromOwnHorse.Receipts` ★ | |
| **8b** | Deductions under section 57 in relation to receipts at 8a only | int | `IncFromOwnHorse.DeductSec57` ★ | |
| **8c** | Amounts not deductible u/s 58 | int | `IncFromOwnHorse.AmtNotDeductibleUs58` | |
| **8d** | Profits chargeable to tax u/s 59 | int | `IncFromOwnHorse.ProfitChargTaxUs59` | |
| **8e** | Balance (8a − 8b + 8c + 8d) (if negative take the figure to 10xii of Schedule CFL) | int | `IncFromOwnHorse.BalanceOwnRaceHorse` ★ | computed L104 |
| **9** | Income under the head "Income from other sources" (7 + 8e) (take 8e as nil if negative) | int | `IncChargeable` ★ | computed L105 |
| **10** | Information about accrual/receipt of income from Other Sources | table | (quarterly objects, below) | five date-range columns |

### Item 10 — quarterly accrual/receipt table

Each row is a schema object with a `DateRange` of five period leaves:
`Upto15Of6`, `Up16Of6To15Of9`, `Up16Of9To15Of12`, `Up16Of12To15Of3`,
`Up16Of3To31Of3` (the online-games and 115A(1)(a)(A) rows spell the second
period `Upto15Of9`). Columns: **Upto 15/6 (i)**, **From 16/6 to 15/9 (ii)**,
**From 16/9 to 15/12 (iii)**, **From 16/12 to 15/3 (iv)**, **From 16/3 to 31/3 (v)**.

| Sl. | Other Source Income | Schema object |
|---|---|---|
| — | Income by way of winnings from lotteries, crossword puzzles, races, games, gambling, betting etc. referred to in section 2(24)(ix) | `IncFrmLottery.DateRange` ★ |
| — | Income by way of winnings from online games u/s 115BBJ | `IncFrmOnGames.DateRange` |
| **3a** | Dividend Income referred in Sl. No. 1a(i) | `DividendIncUs115BBDA.DateRange` ★ |
| **3b** | Dividend Income referred in Sl. No. 1a(iii) | `DividendIncUs115BBDAaiii.DateRange` ★ |
| — | Dividend Income u/s 115A(1)(a)(i) other than as per proviso to sec 115A(1)(a)(A) @ 20% (Including PTI Income) | `DividendIncUs115A1ai.DateRange` ★ |
| — | Dividend Income as per proviso to sec 115A(1)(a)(A) @10% (Including PTI Income) | `DividendIncUs115A1aA.DateRange` |
| — | Dividend Income u/s 115AC @ 10% (Including PTI Income) | `DividendIncUs115AC.DateRange` ★ |
| — | Dividend Income u/s 115ACA (1)(a) @ 10% (Including PTI Income) | `DividendIncUs115ACA.DateRange` ★ |
| — | Dividend Income (other than units referred to in section 115AB) u/s 115AD(1)(i) @ 20% (Including PTI Income) | `DividendIncUs115AD1i.DateRange` ★ |
| — | Income from retirement benefit account maintained in a notified country u/s 89A but not claimed for relief | `NOT89A.DateRange` ★ |
| — | Dividend income taxable at DTAA rates | `DividendDTAA.DateRange` ★ |

Every `DateRange` leaf key — `Upto15Of6`, `Up16Of6To15Of9`, `Up16Of9To15Of12`,
`Up16Of12To15Of3`, `Up16Of3To31Of3`, `Upto15Of9` — is a required integer.

---

## The rules the sheet computes

- **J4** — 1 = `SUM(os.DividendGross, os.InterestGross, os.RentFromMachPlantBldgs, os.Totalsec56, os.TotalAnyOtherIncome)` — gross normal-rate income = 1a+1b+1c+1d+1e.
- **J5** — 1a = `os.DividendGrossai + os.DividendGrossaii + os.DividendGrossaiii`.
- **J9** — 1b = `SUM(os.SavingBank, os.TermDeposit, os.IncomeTaxRefund, os.PassThroughIncome, os.Others, IntrstSec10XIFP, …)` — nine interest sub-lines.
- **J20** — 1d = `MAX(0, (J21+J22+J23+J24+J25))` — 56(2)(x) total floored at zero.
- **J26** — 1e = `SUM(os.OtherSections) + os_FamilyPension + OSIncomeNotified89A + OSIncomeNotifiedOther89A + OSIncomeTaxablePrYr89A …`.
- **J29** — 89A notified = `OSIncomeNotified89A_AmountUS + _AmountUK + _AmountCan`.
- **J40** — 2 = `SUM(os.WinLottRacePuzz, os.WinOnlineGame, os.Total115BE, os.IncomeBenefitTotal, os.TotalChargeableSpecial…)`.
- **J46** — 2b = `MAX(0, (J47+J48+J49+J50+J51+J52))` — 115BBE total floored at zero.
- **J53 / J59** — 2c accumulated PF total = `SUM(os.IncomeBenefit)`; Total (F59) = `SUM(os.TaxBenefit, os.IncomeBenefit)`.
- **J60** — 2d = `SUM(os.SourceAmount)`.
- **J69** — 2e = `SUM(os.PTIAmount)`.
- **N78** — 2f = `IF(CountCheck=0,0, IF(Residentialstatuscheck="NRI", SUMIF(os.TRC,"Yes",os.Amount_income), SUM(os.Amount…)))` — DTAA amount counts only TRC="Yes" rows when the taxpayer is NRI (rule.json: DTAA benefit only for non-residents, and only if TRC flag Yes; for residents considered irrespective of TRC).
- **S79** — DTAA row count = `COUNTIF(os.DTAAcheck,"<>0")`.
- **J88** — 3a(ii) = `ROUNDUP(IF(os_FamilyPension>0, IF(bacValue=1, MIN(os_FamilyPension/3, 25000), IF(bacValue=2, MIN(os_FamilyPension/3, …))), …))` — family-pension deduction u/s 57(iia) = lower of 1/3 of family pension or ₹25,000; allowed only if family pension offered at 1e (rules.json line 2620). Schema caps `DeductionUs57iia` at maximum 25000.
- **J93** — 3d = `os.Expenses + os_Deduction57iia + os.Depreciation + os.amountinterestexpenditure`.
- **T95 / U95** — interest-expenditure eligibility working: `os.expenditureClaimed − MIN(os.expenditureClaimed, os.DividendGrossaii)`; eligible interest u/s 57(1) not more than 20% of dividend income (rules.json line 2645).
- **L97** — 6 (net normal-rate) = `os.GrossIncomeChargeableToTax − os.TotDeductions + os.AmountnotDed58 + os.Profit59 − DTAA_1a_OS − DTAA_1b_OS − …`.
- **L98** — 7 = `IF(L97<0, J40, J40+L97)` — item 2 + item 6, with 6 taken as nil if negative.
- **L104** — 8e = `os.Receipts − os.DeductSec57 + os.notDeductSec58 + os.ProfitSec59`; if negative goes to 10xii of Schedule CFL.
- **L105** — 9 = `SUM(os.TotOthSrcNoRaceHorse, MAX(0, os.BalanceOwnRaceHorse))` — 8e taken as nil if negative.
- **U101–W105** — NRI DTAA SUMIFS by `os.SectionAct` / `os.NatureOfIncome` / `os.TRC="Yes"`, gated on `MID(sheet1.ResidentialStatus1,1,3)="NRI"`.
- **T108:L119 SUM rows** — item-10 quarterly rows each total their five period cells (`SUM(H..:L..)`).
- Dividend-quarterly rule (rules.json line 2630): item-10 dividend break-up must equal 1a(i) less DTAA dividend and less system-calculated interest expenditure u/s 57 attributable to it.
- **Item totals** (rules.json): 1 = 1a+1b+1c+1d+1e; 1b = bi..bix; 1d = 1di..1dv; 2 = 2ai+2aii+2b+2c+2d+2e+2f; 3c(deduction) = 3ai+3aii+3b+3ci; 7 = 2+6; 8e = 8a−8b+8c+8d; 9 = 7+8e; 2e = sum of its dropdowns; 2f col 10 = lower of col 6 and col 9. For 2f, DTAA income considered for NRI only if TRC="Yes"; for residents irrespective of TRC. Where no 115H option exercised by a resident, tax benefits under the listed sections are not allowed (rules.json line 2640).

---

## Dropdowns

**Country name & code — 2f column "Country name & code" (I80:I84), 250 values** (source `FSI_newcountrycod`):

`(Select)`, `AFGHANISTAN:93`, `ALAND ISLANDS:1001`, `ALBANIA:355`, `ALGERIA:213`, `AMERICAN SAMOA:684`, `ANDORRA:376`, `ANGOLA:244`, `ANGUILLA:1264`, `ANTARCTICA:1010`, `ANTIGUA AND BARBUDA:1268`, `ARGENTINA:54`, `ARMENIA:374`, `ARUBA:297`, `AUSTRALIA:61`, `AUSTRIA:43`, `AZERBAIJAN:994`, `BAHAMAS:1242`, `BAHRAIN:973`, `BANGLADESH:880`, `BARBADOS:1246`, `BELARUS:375`, `BELGIUM:32`, `BELIZE:501`, `BENIN:229`, `BERMUDA:1441`, `BHUTAN:975`, `BOLIVIA (PLURINATIONAL STATE OF):591`, `BONAIRE, SINT EUSTATIUS AND SABA:1002`, `BOSNIA AND HERZEGOVINA:387`, `BOTSWANA:267`, `BOUVET ISLAND:1003`, `BRAZIL:55`, `BRITISH INDIAN OCEAN TERRITORY:1014`, `BRUNEI DARUSSALAM:673`, `BULGARIA:359`, `BURKINA FASO:226`, `BURUNDI:257`, `CABO VERDE:238`, `CAMBODIA:855`, `CAMEROON:237`, `CANADA:1`, `CAYMAN ISLANDS:1345`, `CENTRAL AFRICAN REPUBLIC:236`, `CHAD:235`, `CHILE:56`, `CHINA:86`, `CHRISTMAS ISLAND:9`, `COCOS (KEELING) ISLANDS:672`, `COLOMBIA:57`, `COMOROS:270`, `CONGO:242`, `CONGO (DEMOCRATIC REPUBLIC OF THE):243`, `COOK ISLANDS:682`, `COSTA RICA:506`, `COTE DIVOIRE:225`, `CROATIA:385`, `CUBA:53`, `CURACAO:1015`, `CYPRUS:357`, `CZECHIA:420`, `DENMARK:45`, `DJIBOUTI:253`, `DOMINICA:1767`, `DOMINICAN REPUBLIC:1809`, `ECUADOR:593`, `EGYPT:20`, `EL SALVADOR:503`, `EQUATORIAL GUINEA:240`, `ERITREA:291`, `ESTONIA:372`, `ETHIOPIA:251`, `FALKLAND ISLANDS (MALVINAS):500`, `FAROE ISLANDS:298`, `FIJI:679`, `FINLAND:358`, `FRANCE:33`, `FRENCH GUIANA:594`, `FRENCH POLYNESIA:689`, `FRENCH SOUTHERN TERRITORIES:1004`, `GABON:241`, `GAMBIA:220`, `GEORGIA:995`, `GERMANY:49`, `GHANA:233`, `GIBRALTAR:350`, `GREECE:30`, `GREENLAND:299`, `GRENADA:1473`, `GUADELOUPE:590`, `GUAM:1671`, `GUATEMALA:502`, `GUERNSEY:1481`, `GUINEA:224`, `GUINEA-BISSAU:245`, `GUYANA:592`, `HAITI:509`, `HEARD ISLAND AND MCDONALD ISLANDS:1005`, `HOLY SEE:6`, `HONDURAS:504`, `HONG KONG:852`, `HUNGARY:36`, `ICELAND:354`, `INDONESIA:62`, `IRAN (ISLAMIC REPUBLIC OF):98`, `IRAQ:964`, `IRELAND:353`, `ISLE OF MAN:1624`, `ISRAEL:972`, `ITALY:5`, `JAMAICA:1876`, `JAPAN:81`, `JERSEY:1534`, `JORDAN:962`, `KAZAKHSTAN:7`, `KENYA:254`, `KIRIBATI:686`, `KOREA (DEMOCRATIC PEOPLES REPUBLIC OF):850`, `KOREA (REPUBLIC OF):82`, `KUWAIT:965`, `KYRGYZSTAN:996`, `LAO PEOPLES DEMOCRATIC REPUBLIC:856`, `LATVIA:371`, `LEBANON:961`, `LESOTHO:266`, `LIBERIA:231`, `LIBYA:218`, `LIECHTENSTEIN:423`, `LITHUANIA:370`, `LUXEMBOURG:352`, `MACAO:853`, `MACEDONIA (THE FORMER YUGOSLAV REPUBLIC OF):389`, `MADAGASCAR:261`, `MALAWI:265`, `MALAYSIA:60`, `MALDIVES:960`, `MALI:223`, `MALTA:356`, `MARSHALL ISLANDS:692`, `MARTINIQUE:596`, `MAURITANIA:222`, `MAURITIUS:230`, `MAYOTTE:269`, `MEXICO:52`, `MICRONESIA (FEDERATED STATES OF):691`, `MOLDOVA (REPUBLIC OF):373`, `MONACO:377`, `MONGOLIA:976`, `MONTENEGRO:382`, `MONTSERRAT:1664`, `MOROCCO:212`, `MOZAMBIQUE:258`, `MYANMAR:95`, `NAMIBIA:264`, `NAURU:674`, `NEPAL:977`, `NETHERLANDS:31`, `NEW CALEDONIA:687`, `NEW ZEALAND:64`, `NICARAGUA:505`, `NIGER:227`, `NIGERIA:234`, `NIUE:683`, `NORFOLK ISLAND:15`, `NORTHERN MARIANA ISLANDS:1670`, `NORWAY:47`, `OMAN:968`, `PAKISTAN:92`, `PALAU:680`, `PALESTINE, STATE OF:970`, `PANAMA:507`, `PAPUA NEW GUINEA:675`, `PARAGUAY:595`, `PERU:51`, `PHILIPPINES:63`, `PITCAIRN:1011`, `POLAND:48`, `PORTUGAL:14`, `PUERTO RICO:1787`, `QATAR:974`, `REUNION:262`, `ROMANIA:40`, `RUSSIAN FEDERATION:8`, `RWANDA:250`, `SAINT BARTHELEMY:1006`, `SAINT HELENA, ASCENSION AND TRISTAN DA CUNHA:290`, `SAINT KITTS AND NEVIS:1869`, `SAINT LUCIA:1758`, `SAINT MARTIN (FRENCH PART):1007`, `SAINT PIERRE AND MIQUELON:508`, `SAINT VINCENT AND THE GRENADINES:1784`, `SAMOA:685`, `SAN MARINO:378`, `SAO TOME AND PRINCIPE:239`, `SAUDI ARABIA:966`, `SENEGAL:221`, `SERBIA:381`, `SEYCHELLES:248`, `SIERRA LEONE:232`, `SINGAPORE:65`, `SINT MAARTEN (DUTCH PART):1721`, `SLOVAKIA:421`, `SLOVENIA:386`, `SOLOMON ISLANDS:677`, `SOMALIA:252`, `SOUTH AFRICA:28`, `SOUTH GEORGIA AND THE SOUTH SANDWICH ISLANDS:1008`, `SOUTH SUDAN:211`, `SPAIN:35`, `SRI LANKA:94`, `SUDAN:249`, `SURINAME:597`, `SVALBARD AND JAN MAYEN:1012`, `SWAZILAND:268`, `SWEDEN:46`, `SWITZERLAND:41`, `SYRIAN ARAB REPUBLIC:963`, `TAIWAN, PROVINCE OF CHINA[A]:886`, `TAJIKISTAN:992`, `TANZANIA, UNITED REPUBLIC OF:255`, `THAILAND:66`, `TIMOR-LESTE (EAST TIMOR):670`, `TOGO:228`, `TOKELAU:690`, `TONGA:676`, `TRINIDAD AND TOBAGO:1868`, `TUNISIA:216`, `TURKEY:90`, `TURKMENISTAN:993`, `TURKS AND CAICOS ISLANDS:1649`, `TUVALU:688`, `UGANDA:256`, `UKRAINE:380`, `UNITED ARAB EMIRATES:971`, `UNITED KINGDOM OF GREAT BRITAIN AND NORTHERN IRELAND:44`, `UNITED STATES OF AMERICA:2`, `UNITED STATES MINOR OUTLYING ISLANDS:1009`, `URUGUAY:598`, `UZBEKISTAN:998`, `VANUATU:678`, `VENEZUELA (BOLIVARIAN REPUBLIC OF):58`, `VIET NAM:84`, `VIRGIN ISLANDS (BRITISH):1284`, `VIRGIN ISLANDS (U.S.):1340`, `WALLIS AND FUTUNA:681`, `WESTERN SAHARA:1013`, `YEMEN:967`, `ZAMBIA:260`, `ZIMBABWE:263`, `OTHERS:9999`

**Whether TRC obtained (Y/N) — 2f column (L80:L84):** `(Select)`, `Yes`, `No`

**Item No. in which included — 2f column and item-10 Sl. No. (H79 / L107 / J27):** `(Select)`, `1ai`, `1aiii`, `1b`, `1c`, `1d`, `2ai`, `2aii`, `2d`, `2e`

**Assessment Year — 2c accumulated-PF table (G55:G57), 26 years:** `(Select)`, `2000-01`, `2001-02`, `2002-03`, `2003-04`, `2004-05`, `2005-06`, `2006-07`, `2007-08`, `2008-09`, `2009-10`, `2010-11`, `2011-12`, `2012-13`, `2013-14`, `2014-15`, `2015-16`, `2016-17`, `2017-18`, `2018-19`, `2019-20`, `2020-21`, `2021-22`, `2022-23`, `2023-24`, `2024-25`, `2025-26`

**Nature — 2d 'Any other income chargeable at special rate' (G62:G66), NRI special-rate sections** (source `OS_NRI1`):

`(Select)`, `5A1ai - 115A(1)(a)(i) - Dividends received by non-resident (not being company) or foreign company chargeable u/s 115A(1)(a)(i) other than first  proviso to section  115A(1)(a)(A)`, `5A1aA - 115A(1)(a)(A) - Dividend received by non-resident (not being company) or foreign company from a unit in an International Financial Services Centre, as referred to in sub-section (1A) of section 80LA chargeable under proviso to section 115A(1)(a)(A)`, `5A1aii - 115A(1)(a)(ii) - Interest received in the case of non-residents`, `5A1aiia - 115A(1) (a)(iia) - Interest received by non-resident from infrastructure debt fund`, `5A1aiiaa - 115A(1) (a)(iiaa) - Interest as referred in section 194LC(1)`, `5A1aiiab - 115A(1) (a)(iiab) - Interest as per Sec. 194LD`, `5A1aiii - 115A(1) (a)(iii) - Income received in respect of units of UTI purchased in Foreign Currency`, `5A1bA - 115A(1)(b) - Income from royalty & technical services`, `5AC1a - 115AC(1)(a) - Income by way of interest  on bonds purchased in foreign currency`, `5BBA - 115BBA - Income Received by non - residents sportsmen or sports associations`, `5AC1b - 115AC1b - Income by way of Dividend on GDRs purchased in foreign currency - non-resident`, `5BBG - 115BBG - Income from Transfer of carbon credits`, `5Ea - 115E(a) - Investment income`, `5A1aiiaaP-Income received by non-resident as referred in proviso to section 194LC(1)`, `5A1aiiaa2P -Income received by non-resident as referred in second proviso to section 194LC(1)`, `5A1aiiac - 115A(1) (a)(iiac) -Interest as per Sec. 194LBA`

**Nature — 2e Pass-through special-rate income (G71:G76), PTI NRI sections** (source `OS_PTI_NRI1`):

`(Select)`, `PTI_115A(1)(a)(i)-Dividends received by non-resident (not being company) or foreign company chargeable u/s 115A(1)(a)(i) other than first provisio to 115A(1)(a)(A)`, `PTI_115A(1)(a)(A)-Dividend received by non-resident (not being company) or foreign company from a unit in an International Financial Services Centre, as referred to in sub-section (1A) of section 80LA chargeable under proviso to section 115A(1)(a)(A)`, `PTI_115A(1)(a)(ii)-Interest received from govt/Indian Concerns received in Foreign Currency`, `PTI_115A(1)(a)(iia)-Interest from Infrastructure Debt Fund`, `PTI_115A(1)(a)(iiaa)-Interest as referred in section 194LC(1)`, `PTI_115A(1)(a)(iiab)-Interest as per Sec. 194LD`, `PTI_115A(1)(a)(iii)-Income received in respect of  units of UTI purchased in foreign currency`, `PTI_115A(1)(b)-Income from royalty & technical services`, `PTI_115AC(1)(a)-Income by way of interest on bonds purchased in foreign currency - non-resident`, `PTI_115BBA-Income Received by non-residents sportsmen or sports associations`, `PTI_5AC1b-PTI -Income by way of Dividend on GDRs purchased in foreign currency - non-resident`, `PTI_115BBG-Income from transfer of carbon credits.`, `PTI_115E(a)-Investment income`, `5BBH - 115BBH - Income by way of transfer of Virtual Digital assets`, `PTI_5A1aiiaaP-PTI -Income received by non-resident as referred in proviso to section 194LC(1)`, `PTI_5A1aiiaa2P-PTI -Income received by non-resident as referred in second proviso to section 194LC(1)`, `PTI_115A(1)(a)(iiac)-Interest as per Sec. 194LBA`

The 2f **Section of I.T. Act** column (M80:M84) is an `INDIRECT` list that
resolves at runtime to one of `OSDTAA_Section_115H`, `OSDTAA_Section_RES` or
`OSDTAA_Section_NRI` depending on `Sheet1.115H` and residential status; its
member values are not statically resolvable from the sheet and are therefore not
enumerable here (rule 17 — not guessed).

---

## What repeats and what is one figure

**Arrays (repeat):**
- `IncOthThanOwnRaceHorse.OthersInc.OthersIncDtls[]` — 1e any-other-income rows (Nature + Amount).
- `IncOthThanOwnRaceHorse.IncomeNotified89ATypeOS[]` — 89A notified-country rows (US/UK/CA + amount).
- `IncOthThanOwnRaceHorse.TaxAccumulatedBalRecPF.TaxAccmltdBalRecPFDtls[]` — 2c accumulated-PF rows (AY + Income Benefit + Tax Benefit).
- `IncOthThanOwnRaceHorse.OthersGrossDtls[]` — 2d special-rate source rows.
- `IncOthThanOwnRaceHorse.PTIOthersGrossDtls[]` — 2e PTI special-rate rows.
- `IncOthThanOwnRaceHorse.IncChargblSplRateOS.NRIOsDTAA.NRIDTAADtlsSchOS[]` — 2f DTAA rows.

**Single figures (one each):** every numbered line 1 through 9 and its computed
totals, the `IncFromOwnHorse` race-horse block (8a–8e), `TotOthSrcNoRaceHorse`
and `IncChargeable`, and each item-10 quarterly `DateRange` object (one object
per income type, five period figures inside).

---

## Mandatory

Required keys at the block root (`ScheduleOS.required`): `TotOthSrcNoRaceHorse`,
`IncFrmLottery`, `DividendIncUs115BBDA`, `DividendIncUs115BBDAaiii`,
`DividendIncUs115A1ai`, `DividendIncUs115AC`, `DividendIncUs115ACA`,
`DividendIncUs115AD1i`, `NOT89A`, `DividendDTAA`, `IncChargeable`. Within the
sub-objects the schema further marks required (★ above) leaves including
`GrossIncChrgblTaxAtAppRate`, `DividendGross`, `DividendOthThan22e`,
`Dividend22e`, `InterestGross`, the four `IntrstFrm…` interest lines,
`NatofPassThrghIncome`, `RentFromMachPlantBldgs`, `Tot562x` and its five 56(2)(x)
sub-lines, `FamilyPension`, `AnyOtherIncome`, `OthNatOfInc`, `OthAmount`,
`NOT89ACountrycode`, `NOT89AAmount`, `IncChargeableSpecialRates`,
`LtryPzzlChrgblUs115BB`, `IncChrgblUs115BBE` and its six 68/69 lines
(`CashCreditsUs68`, `UnExplndInvstmntsUs69`, `UnExplndMoneyUs69A`,
`UnDsclsdInvstmntsUs69B`, `UnExplndExpndtrUs69C`, `AmtBrwdRepaidOnHundiUs69D`),
`AssessmentYear`, `IncomeBenefit`, `TaxBenefit`, `TotalIncomeBenefit`,
`TotalTaxBenefit`, `OthersGross`, `SourceDescription`,
`PassThrIncOSChrgblSplRate`, `TotalAmtTaxUsDTAASchOs`, the DTAA row leaves
(`DTAAamt`, `NatureOfIncome`, `CountryName`, `CountryCodeExcludingIndia`,
`DTAAarticle`, `RateAsPerTreaty`, `ItemNoincl`, `RateAsPerITAct`),
`Depreciation`, `TotDeductions`, `BalanceNoRaceHorse`, the race-horse
`Receipts`, `DeductSec57`, `BalanceOwnRaceHorse`, and every quarterly
`DateRange` period leaf.

---

## Hidden rows — not built

These rows are flagged **H** in the utility and must not be presented as items;
they are internal feeders that the visible line 2a(ii) (r45) already exposes:

- **r42 (H)** — `aii` "Income by way of winnings from online games chargeable u/s 115BBJ" — hidden duplicate/header of the online-games line; the *visible* line is r45 (mapped to `IncChrgblUs115BBJ`).
- **r43 (H)** — `i` "Gross winnings from online games" (2aii) — hidden gross-input feeder for the 115BBJ computation.
- **r44 (H)** — `ii` "Adjustment as per Rule 133" — hidden Rule-133 adjustment feeding the online-games net.
- **r116 (H)** — "Dividend Income u/s 115A(1)(a)(iiac) @ 10% (Including PTI Income)" — hidden quarterly-table dividend line not offered on screen (no schema DateRange object built for it).

No schema key is built from these hidden rows.

---

## What this means for the build

- Build item 1's five heads with their sub-lines: 1a (three dividend lines), 1b
  (nine interest lines including the four PF-proviso lines under 10(11)/10(12)),
  1c, 1d (five 56(2)(x) lines, total floored at zero via MAX), and 1e (family
  pension + the OthersInc array + the 89A fixed lines + the 56(2)(xii)/(xiii)
  lines). 1a, 1b, 1d and 1e are computed sums; make them green/untypeable.
- Item 2 needs the full special-rate machinery: 2a(i) 115BB, the *visible* 2a(ii)
  115BBJ (r45) only — do **not** surface the hidden r42/r43/r44 feeders — 2b
  115BBE with its six 68/69 lines (MAX-floored), 2c accumulated-PF table with the
  AY dropdown and its two computed totals, 2d and 2e source arrays driven by the
  NRI/PTI section dropdowns, and the 2f DTAA table with the 250-country dropdown,
  the item-number dropdown, TRC Yes/No and the INDIRECT section list.
- The 2f DTAA total and the NRI SUMIFS are gated on residential status = NRI and
  TRC = "Yes"; encode that gate (rules.json: residents get DTAA irrespective of
  TRC). Applicable rate (col 10) = lower of treaty rate (col 6) and IT-Act rate.
- Section-57 deductions carry conditions: 3a(ii) family-pension deduction =
  MIN(⅓ family pension, 25,000) and only if family pension is offered at 1e; 3b
  depreciation only if 1c rental income is offered; 3c interest expenditure ≤ 20%
  of dividend and only if income offered at 1a(i)/1a(ii). Enforce each.
- Race-horse block (item 8) is a separate working with its own 58/59 lines; a
  negative 8e is carried to Schedule CFL 10xii and 8e is taken as nil (not
  negative) when rolling into item 9. Item 6 negative rolls into CYLA.
- Item 10 is eleven quarterly rows, each a DateRange of five periods; the online-
  games and 115A(1)(a)(A) rows use `Upto15Of9` where the others use
  `Up16Of6To15Of9`. Quarterly dividend break-up must reconcile to 1a(i) net of
  DTAA and attributable 57 interest.
- Carry the schedule-wide SPI note (include specified persons' income).

---

## Helper and annotation columns (not form items)

These are internal spreadsheet helper/annotation cells, not fileable labels, and
carry no schema key; recorded here only for completeness (rule 8 — helper
columns are rules, read them):

- **T79** — developer note *"Newly added by Bindu as per BA Shubham"* against the 2f DTAA table.
- **X60** — *"OS Section"* tag on the 2d row.
- **X82** — *"os.BalanceNoRaceHorse"* (points item-7 balance into the totals chain).
- **X94 / S103 / S111** — *"For AY 2025-26"* / *"for AY 2025-26"* annotations against the not-deductible-58, race-horse 8d and item-10 3b rows.


## Additional visible rows — verbatim from the sheet (completeness)
Rows present on the utility sheet and captured here verbatim so every visible label is in the book:

- Dividend income u/s 2(22)(e)
- Dividend income u/s 2(22)(f)
- From Income Tax refund
- Income Benefit
- Amount of income
- Rate as per I.T. Act
- os.BalanceNoRaceHorse
- Depreciation
- For AY 2025-26
- for AY 2025-26
- Upto 15/6 (i)
