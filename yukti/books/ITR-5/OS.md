# The book of Schedule OS — Income from Other Sources · ITR-5, A.Y. 2026-27

Read row by row from the utility's **OS** sheet (schema block `ScheduleOS`),
with its hidden-row flags, formulas and dropdowns, and cross-checked against the
CBDT ITR-5 schema and `books/ITR-5/rules.json`. Every item number, label,
dropdown value and rule below is the department's own; nothing is invented.
Item numbers are taken from the rules document and the sheet's own lettering,
not from counting rows.

ITR-5 is filed by firms, LLPs, AOPs, BOIs, artificial juridical persons,
business trusts, investment funds and estates — **not individuals**. So this
Schedule OS is the ITR-2/ITR-3 machinery **stripped of the individual-only
lines**: there is **no 89A retirement-account block, no family-pension
deduction (57(iia)), no provident-fund-proviso interest lines (1b(v)–(ix)),
no section 111 accumulated-PF table, and no 56(2)(xiii) life-insurance line.**
What remains is the special-rate engine (115BB, 115BBJ, 115BBE, other special
rates, PTI, DTAA), the section-57/58/59 deductions, the race-horse working, and
the quarterly accrual table.

---

## The shape

Schedule OS is one continuous computation, numbered 1 to 9, followed by a
quarterly accrual/receipt table (item 10). It is not a flat list of income
types: it starts with **gross income at normal rates** (item 1), adds **income
at special rates** (item 2), takes off **section 57 deductions** (item 3), adds
back **amounts not deductible u/s 58** (item 4) and **profits chargeable u/s 59**
(item 5), lands on **net normal-rate income** (item 6), then **income other than
race horses** (item 7 = 2 + 6), a separate **race-horse working** (item 8,
8a–8e) and finally **income under the head** (item 9 = 7 + 8e).

Item 2 (special rates) is itself six sub-items — **2a(i)** 115BB lottery,
**2a(ii)** 115BBJ online games, **2b** 115BBE unexplained credits, **2c** any
other special-rate income, **2d** PTI special-rate income, and **2e** the DTAA
table (the sheet letters the DTAA table **2e**; some documents call the DTAA
table "2f" — on ITR-5 it is item 2e, the last sub-item of 2). The header at r30
reads *"Income chargeable at special rates (2ai+2aii+ 2b+ 2c+ 2d + 2e related to
sl.no.1)"*.

| Item | What it is | Kind |
|---|---|---|
| **1** | Gross income chargeable at normal rates — 1a to 1e | five heads, most with sub-lines |
| **2** | Income chargeable at special rates — 2a(i), 2a(ii), 2b, 2c, 2d, 2e | six sub-items |
| **3** | Deductions under section 57 — 3a, 3b, 3c, 3d | working with caps |
| **4** | Amounts not deductible u/s 58 | one figure |
| **5** | Profits chargeable u/s 59 | one figure |
| **6** | **Net income at normal rates** — 1 − 3 + 4 + 5 − DTAA(1) | computed; a loss goes to CYLA |
| **7** | Income from other sources, other than race horses — 2 + 6 | computed |
| **8** | Income from owning and maintaining race horses — 8a to 8e | separate five-line working |
| **9** | **Income under the head** — 7 + 8e | computed; 8e taken as nil if negative |
| **10** | Information about accrual/receipt | a quarterly table |

The sheet's closing note applies to the whole schedule: *"Please include the
income of the specified persons referred to in Schedule SPI while computing the
income under this head."*

---

## The items

### Block `ScheduleOS` — Income from Other Sources

Item numbers per the sheet's lettering and `rules.json`;
`IncOthThanOwnRaceHorse` (abbreviated `IOTORH` below) is the parent object for
items 1–7. ★ marks a schema-`required` key (see the **Mandatory** section for
the complete list).

| Sl. | Field label (sheet) | Type | Schema key | Rule / notes · cell |
|---|---|---|---|---|
| **1** | Gross Income chargeable to tax at normal applicable rates (1a+ 1b+ 1c+ 1d + 1e) | int | `IOTORH.GrossIncChrgblTaxAtAppRate` ★ | computed P4 = SUM(N5,N9,N15,N16,N22); rule 471 |
| **1a** | Dividends Gross (ai +aii+aiii) | int | `IOTORH.DividendGross` ★ | computed N5 = DividendGrossai+aii+aiii; rule 495: 1a = 1a(i)+1a(ii)+1a(iii) |
| **1a(i)** | Dividend income [other than (ii) and (iii)] | int | `IOTORH.DividendOthThan22e` ★ | ordinary dividend; feeds 3c interest cap |
| **1a(ii)** | Dividend income u/s 2(22)(e) | int | `IOTORH.Dividend22e` ★ | deemed dividend (loan/advance by closely-held co.) |
| **1a(iii)** | Dividend income u/s 2(22)(f) | int | `IOTORH.Dividend22f` | buy-back treated as dividend; rule 446: mandatory if a buy-back capital loss is shown at A(A)/B(A) of Schedule CG |
| **1b** | Interest, Gross (bi + bii + biii + biv + bv) | int | `IOTORH.InterestGross` ★ | computed N9 = SUM(N10:N14); rule 490: 1b = bi+bii+biii+biv+bv |
| **1b(i)** | i) From Savings bank | int | `IOTORH.IntrstFrmSavingBank` ★ | |
| **1b(ii)** | ii) From Deposits (Bank/ Post Office/ Co-operative Society) | int | `IOTORH.IntrstFrmTermDeposit` ★ | |
| **1b(iii)** | iii) From Income Tax refund | int | `IOTORH.IntrstFrmIncmTaxRefund` ★ | |
| **1b(iv)** | iv) In the nature of Pass through income/ loss | int | `IOTORH.NatofPassThrghIncome` ★ | may be negative (cell N13 min −99999999999999) |
| **1b(v)** | v) Others including interest from companies, NBFCs and HFCs | int | `IOTORH.IntrstFrmOthers` ★ | |
| **1c** | Rental income from machinery, plants, buildings, etc., Gross | int | `IOTORH.RentFromMachPlantBldgs` ★ | unlocks 3b depreciation; rule 473 |
| **1d** | Income of the nature referred to in section 56(2)(x) which is chargeable to tax (di + dii + diii + div + dv) | int | `IOTORH.Tot562x` ★ | computed N16 = SUM(N17:N21); rule 478 |
| **1d(i)** | i) Aggregate value of sum of money received without consideration | int | `IOTORH.Aggrtvaluewithoutcons562x` ★ | |
| **1d(ii)** | ii) In case immovable property is received without consideration, stamp duty value of property | int | `IOTORH.Immovpropwithoutcons562x` ★ | |
| **1d(iii)** | iii) In case immovable property is received for inadequate consideration, stamp duty value of property | int | `IOTORH.Immovpropinadeqcons562x` ★ | stamp value in excess of consideration |
| **1d(iv)** | iv) In case any other property is received without consideration, fair market value of property | int | `IOTORH.Anyotherpropwithoutcons562x` ★ | |
| **1d(v)** | v) In case any other property is received for inadequate consideration, Fair market value of property | int | `IOTORH.Anyotherpropinadeqcons562x` ★ | FMV in excess of consideration |
| **1e** | Any other income (please specify nature) | int | `IOTORH.AnyOtherIncome` ★ | computed N22 = SUM(AnyotherAmount, Business56); drives the table + fixed line below |
| **1e — fixed** | Any specified sum received by a unit holder from a business trust during the previous year as referred to in section 56(2)(xii) | int | `IOTORH.SumRecdPrYrBusTRU562xii` | fixed line r24 (feeds N22 via `os.Business56`) |
| **1e — table** | Sl. No. / Nature / Amount | array | `IOTORH.OthersInc.OthersIncDtls[]` | user-entered any-other-income rows (r23, r25–29) |
| — | Nature | string | `…OthersIncDtls[].OthNatOfInc` ★ | maxLength 50 |
| — | Amount | int | `…OthersIncDtls[].OthAmount` ★ | |
| **2** | Income chargeable at special rates (2ai+2aii+ 2b+ 2c+ 2d + 2e related to sl.no.1) | int | `IOTORH.IncChargeableSpecialRates` ★ | computed P30 = MAX(0, SUM(N31,N35,N36,N43,N52, DTAA parts)); rule 489 |
| **2a(i)** | Winnings from lotteries, crossword puzzles, races, card games etc. chargeable u/s 115BB | int | `IOTORH.LtryPzzlChrgblUs115BB` ★ | 30%; r31 |
| **2a(ii)** | Income by way of winning from online game chargeable u/s 115BBJ | int | `IOTORH.IncChrgblUs115BBJ` | 30%; visible line r35 (the older two-line gross/Rule-133 version at r32–34 is hidden — see Hidden rows) |
| **2b** | Income chargeable u/s 115BBE (bi + bii + biii + biv+ bv + bvi) | int | `IOTORH.IncChrgblUs115BBE` ★ | computed N36 = SUM(N37:N42); rule 500 |
| **2b(i)** | i) Cash credits u/s 68 | int | `IOTORH.CashCreditsUs68` ★ | |
| **2b(ii)** | ii) Unexplained investments u/s 69 | int | `IOTORH.UnExplndInvstmntsUs69` ★ | |
| **2b(iii)** | iii) Unexplained money etc. u/s 69A | int | `IOTORH.UnExplndMoneyUs69A` ★ | |
| **2b(iv)** | iv) Undisclosed investments etc. u/s 69B | int | `IOTORH.UnDsclsdInvstmntsUs69B` ★ | |
| **2b(v)** | v) Unexplained expenditure etc. u/s 69C | int | `IOTORH.UnExplndExpndtrUs69C` ★ | |
| **2b(vi)** | vi) Amount borrowed or repaid on hundi u/s 69D | int | `IOTORH.AmtBrwdRepaidOnHundiUs69D` ★ | |
| **2c** | Any other income chargeable at special rate (total of ci to cxxiii) | int | `IOTORH.OthersGross` ★ | computed N43 = SUM(SourceAmount); rules 486, 493 |
| **2c — table** | Sl. No. / Nature / Amount / OS Section Code | array | `IOTORH.OthersGrossDtls[]` | r44–50; Nature is the OS special-rate dropdown (`SI_OSSECTIONCODES_RES`/`_NRI` by residential status); section code parsed by `S45 = MID(G45,1,SEARCH("-",G45)-1)` and `VLOOKUP(…,OS_LOOKUP,…)` |
| — | Nature | string | `…OthersGrossDtls[].SourceDescription` ★ | dropdown — full code list below |
| — | Amount | int | `…OthersGrossDtls[].SourceAmount` ★ | |
| **2d** | Pass through income in the nature of income from other sources claimed as chargeable at special rates | int | `IOTORH.PassThrIncOSChrgblSplRate` ★ | computed N52 = SUM(PTIAmount); rule 477 |
| **2d — table** | Sl. No. / Nature / Amount / PTI Section Code | array | `IOTORH.PTIOthersGrossDtls[]` | r53–56; Nature is the PTI dropdown (`PTI_RES_OS_Dropdown`/`PTI_NRI_OS_Dropdown`); code via `VLOOKUP(…,PTI_OS_LOOKUP,…)` |
| — | Nature | string | `…PTIOthersGrossDtls[].SourceDescription` ★ | dropdown — full code list below |
| — | Amount | int | `…PTIOthersGrossDtls[].SourceAmount` ★ | |
| **2e** | Amount included in 1 and 2 above, which is claimed as chargeable at special rates in India as per DTAA (total of column (2) of table below) | int | `IOTORH.IncChargblSplRateOS.TotalAmtTaxUsDTAASchOs` ★ | computed N58 = IF(NRI, SUMIF(TRC,"Yes",amount), SUM(amount)) |
| **2e — table** | Sl.No / Amount of income / Item No. in which included / Country name & code / Article of DTAA / Rate as per Treaty / Whether TRC obtained / Section of I.T. Act / Rate as per I.T. Act / Applicable rate [lower of (6) or (9)] | array | `…IncChargblSplRateOS.NRIOsDTAA.NRIDTAADtlsSchOS[]` | r59 headers, r60–65 rows; keys below |
| — | Amount of income (Col 2) | int | `…NRIDTAADtlsSchOS[].DTAAamt` ★ | rules 480–487 cap Col-2 sums to the parent 1ai/1b/1c/1d/2a/2c/2d fields |
| — | Item No. 1ai, 1aiii, 1b to 1d to No. 2a to 2d in which included (Col 3) | string | `…NRIDTAADtlsSchOS[].NatureOfIncome` ★ | dropdown G60: `1ai,1aiii,1b,1c,1d,2ai,2aii,2c,2d` |
| — | Item No. / section of DTAA table | string | `…NRIDTAADtlsSchOS[].ItemNoincl` ★ | dropdown L60 (`OS_DTTA_Drpdown_RES`/`_NRI`); `S60 = MID(L60,1,SEARCH("-",L60)-1)`, special-cased for `56(2)(i)-Dividend u/s 2(22)(f)` → `56(2)(i)_f`; full code list below |
| — | Country name (Col 4) | string | `…NRIDTAADtlsSchOS[].CountryName` ★ | |
| — | Country code (excluding India) (Col 4) | string | `…NRIDTAADtlsSchOS[].CountryCodeExcludingIndia` ★ | ~250-code dropdown (`cmb_TRFA.Country`); full list below |
| — | Article of DTAA (Col 5) | string | `…NRIDTAADtlsSchOS[].DTAAarticle` ★ | |
| — | Rate as per Treaty (enter NIL, if not chargeable) (Col 6) | number | `…NRIDTAADtlsSchOS[].RateAsPerTreaty` ★ | |
| — | Whether TRC obtained? (Col 7) | string | `…NRIDTAADtlsSchOS[].TaxRescertifiedFlag` | dropdown K60: `(Select),Yes,No` |
| — | Rate as per I.T. Act (Col 9) | number | `…NRIDTAADtlsSchOS[].RateAsPerITAct` ★ | |
| — | Applicable rate [lower of (6) or (9)] (Col 10) | number | `…NRIDTAADtlsSchOS[].ApplicableRate` | computed N60 = IF(NRI, IF(TRC starts "Y", MIN(J60,M60), ""), MIN(J60,M60)); rule 488 |
| **3** | Deductions under section 57 (other than those relating to income chargeable at special rate under 2) | object | `IOTORH.Deductions` | r67 header |
| **3a** | A — Expenses / Deductions other than "C" | int | `IOTORH.Deductions.Expenses` | r68 |
| **3b** | B — Depreciation (available only if income offered in 1c of "schedule OS") | int | `IOTORH.Deductions.Depreciation` ★ | r70; rule 473: allowed only if 1c > 0 |
| **3c** | C — Interest expenditure on dividend u/s 57(1) (available only if income offered in 1a(i) and / or 1a(ii))-entered value | int | `IOTORH.Deductions.UsrIntExp57` | r71/72 entered value; rule 492 |
| **3c(i)** | C(i) — Eligible amount of interest expenditure-computed value | int | `IOTORH.Deductions.IntExp57` | r73; rules 494–495: capped at 20% of dividend income included in total income, recomputed & restricted |
| **3d** | d — Total | int | `IOTORH.Deductions.TotDeductions` ★ | computed N74 = Depreciation + Expenses + amountinterestexpenditure; rule 472: 3d = 3a+3b+3c |
| **4** | Amounts not deductible u/s 58 | int | `IOTORH.AmtNotDeductibleUs58` | r75 |
| **5** | Profits chargeable to tax u/s 59 | int | `IOTORH.ProfitChargTaxUs59` | r76 |
| **6** | Net Income from other sources chargeable at normal applicable rates 1 (after reducing income related to DTAA portion) -3+4+5 (If negative take the figure to 4i of schedule CYLA) | int | `IOTORH.BalanceNoRaceHorse` ★ | computed P77 = Gross − TotDeductions + MAX(0,58) + 59 − DTAA(1); rules 487–488, 507 |
| **7** | Income from other sources (other than from owning and maintaining race horses) (2 + 6) (enter 6 as nil, if negative) | int | `TotOthSrcNoRaceHorse` ★ | computed P78 = MAX(0,BalanceNoRaceHorse) + IncChargeableSpecialRates; rule 474 |
| **8** | Income from the activity of owning race horses | object | `IncFromOwnHorse` | r79 header |
| **8a** | a — Receipts | int | `IncFromOwnHorse.Receipts` ★ | r80 |
| **8b** | b — Deductions under section 57 in relation to receipts at 8a only | int | `IncFromOwnHorse.DeductSec57` ★ | r81 |
| **8c** | c — Amounts not deductible u/s 58 | int | `IncFromOwnHorse.AmtNotDeductibleUs58` | r82 |
| **8d** | d — Profits chargeable to tax u/s 59 | int | `IncFromOwnHorse.ProfitChargTaxUs59` | r83 |
| **8e** | e — Balance (8a - 8b + 8c + 8d). (if negative take the figure to 11xvii of Schedule CFL) | int | `IncFromOwnHorse.BalanceOwnRaceHorse` ★ | computed P84 = Receipts − DeductSec57 + 58 + 59; rule 475 |
| **9** | Income under the head "Income from other sources" (7+ 8e) (take 8e as nil if negative) | int | `IncChargeableFrmOthSrc` ★ | computed P85 = TotOthSrcNoRaceHorse + MAX(0,BalanceOwnRaceHorse); rule 476 |

### Item 10 — Information about accrual/receipt of income from Other Sources

A quarterly table (r86–99). Each live row carries five date-range columns
(the schema `DateRange` object): **Upto15Of6** (Upto 15/6), **Up16Of6To15Of9**
(16/6–15/9), **Up16Of9To15Of12** (16/9–15/12), **Up16Of12To15Of3**
(16/12–15/3), **Up16Of3To31Of3** (16/3–31/3). The quarterly split must
reconcile back to the annual figures (rules 491, 496–503).

| Row | Other Source Income (sheet label) | Schema object (`.DateRange.*`) | Reconciles to |
|---|---|---|---|
| r90 | Income by way of winnings from lotteries, crossword puzzles, races, games, gambling, betting etc. referred u/s 115BB | `IncFrmLottery` | 2a(i) — rule 491 |
| r91 | Income by way of winnings from online games u/s 115BBJ | `IncFrmOnGames` | 2a(ii) — rules 501–502 |
| r92 (3a) | Dividend Income referred in Sl. No 1a(i) | `DividendIncUs115BBDA` | 1a(i) |
| r93 (3b) | Dividend Income referred in Sl. No. 1a(iii) | `DividendIncUs115BBDAaiii` | 1a(iii) — rule 503 |
| r94 | Dividend Income u/s 115A(1)(a)(i) other than first proviso to section 115A(1)(a)(A) @ 20% ( Including PTI Income) | `DividendIncUs115A1ai` | 2c & 2d — rule 496 |
| r95 | Dividend income under proviso to sec 115A(1)(a)(A) @10% (Including PTI Income) | `DividendIncUs115A1aA` | 2c & 2d — rule 502 |
| r96 | Dividend Income u/s 115AC @ 10% (Including PTI Income) | `DividendIncUs115AC` | 2c & 2d — rule 497 |
| r97 | Dividend Income (other than units referred to in section 115AB) received by a FII u/s 115AD(1)(i) @ 20% (Including PTI Income) | `DividendIncUs115AD1iDiv` | 2c & 2d — rules 498–499 |
| r98 | Dividend Income (other than units referred to in section 115AB) received by a specified fund u/s 115AD(1)(i) @ 10% (Including PTI Income) | `DividendIncUs115AD1IBd` | 2c & 2d — rules 499–500 |
| r99 | Dividend income taxable at DTAA rates | `DividendDTAA` | 2e DTAA dividends |

---

## The rules the sheet computes (with cell references)

Totals and caps the utility computes itself — the build must reproduce these,
not accept free entry:

- **1 (P4)** `= SUM(N5, N9, N15, N16, N22)` — gross normal-rate income = 1a+1b+1c+1d+1e (rule 471).
- **1a (N5)** `= DividendGrossai + DividendGrossaii + DividendGrossaiii` (rule 495).
- **1b (N9)** `= SUM(N10:N14)` — bi+bii+biii+biv+bv (rule 490). N13 (biv) may be negative.
- **1d (N16)** `= SUM(N17:N21)` — di+dii+diii+div+dv (rule 478).
- **1e (N22)** `= SUM(os.AnyotherAmount, os.Business56)` — table rows + the 56(2)(xii) fixed line.
- **2 (P30)** `= MAX(0, SUM(N31, N35, N36, N43, N52, DTAA_56I_OS, DTAA_56i_f_OS, DTAA_56_OS, DTAA_562iii_OS, DTAA_562x_OS))` — special-rate total, floored at 0 (rule 489); `= 2a(i)+2a(ii)+2b+2c+2d+2e` elements related to Sl. 1.
- **2b (N36)** `= SUM(N37:N42)` — 68+69+69A+69B+69C+69D (rule 500).
- **2c (N43)** `= SUM(os.SourceAmount)` — sum of the OS special-rate table amounts (rules 486, 493).
- **2d (N52)** `= SUM(os.PTIAmount)` — sum of the PTI table amounts (rule 477).
- **2e (N58)** `= IF(Residentialstatuscheck="NRI", SUMIF(os.TRC,"Yes",os.Amount_income), SUM(os.Amount_income))` — for an NRI only DTAA rows with TRC="Yes" count.
- **2e Applicable rate (N60)** `= IF(NRI, IF(MID(K60,1,1)="Y", MIN(J60,M60), ""), MIN(J60,M60))` — Col 10 is the lower of treaty rate (Col 6) and I.T. Act rate (Col 9); for an NRI it is blank unless TRC obtained (rule 488).
- **3c(i) eligible interest (r73)** — capped at **20% of the dividend income included in total income**; if the entered 3c exceeds the cap it is recomputed and restricted (rules 494–495). 3c available only if dividend declared at 1a(i)/1a(ii) (rule 492).
- **3d (N74)** `= os.Depreciation + os.Expenses + os.amountinterestexpenditure` — 3a+3b+3c (rule 472).
- **6 (P77)** `= GrossIncChrgblTaxAtAppRate − TotDeductions + MAX(0, Amountus58) + Profitus59 − DTAA(1 portion)` — net normal-rate income; if negative goes to CYLA 4i (rule 487).
- **7 (P78)** `= MAX(0, BalanceNoRaceHorse) + IncChargeableSpecialRates` — 2 + 6, 6 taken as nil if negative (rule 474).
- **8e (P84)** `= Receipts − DeductSec57 + Amountus58_2 + Profitus59_2` — 8a−8b+8c+8d; if negative goes to Schedule CFL 11xvii (rule 475).
- **9 (P85)** `= TotOthSrcNoRaceHorse + MAX(0, BalanceOwnRaceHorse)` — 7 + 8e, 8e taken as nil if negative (rule 476).
- **DTAA amount caps (rules 480–487)** — in table 2e, the sum of Col-2 "Amount of income" for each item code (1ai, 1b, 1c, 1d, 2a, 2c, 2d) must not exceed the corresponding parent field.
- **Residency gate** — the whole special-rate/DTAA behaviour switches on `T3 = IF(MID(sheet1.ResidentialStatus1,1,3)="RES","RES","NRI")`; the 2c/2d/2e Nature dropdowns and 2e's TRC logic differ for RES vs NRI.
- **115BBF (rules 249, 479)** — income under section 115BBF (patent) in Schedule OS/BP can be claimed only by a **Resident**; a non-resident showing 115BBF is flagged.
- **Cross-schedule (rule 446)** — 1a(iii) dividend u/s 2(22)(f) is mandatory when a buy-back capital loss appears at A(A)/B(A) of Schedule CG.

---

## Dropdowns (every value)

**2e — Item No. in which included (Col 3), cell G60:G65** — dropdown `"(Select),1ai,1aiii,1b,1c,1d,2ai,2aii,2c,2d"`:

`(Select)`, `1ai`, `1aiii`, `1b`, `1c`, `1d`, `2ai`, `2aii`, `2c`, `2d`

**2e — Whether TRC obtained? (Col 7), cell K60:K65** — dropdown `"(Select),Yes,No"`:

`(Select)`, `Yes`, `No`

**2e — Country name, code (Col 4), cell H60:H65** — named range `cmb_TRFA.Country` (~250 values, `NAME:code`):

`(Select)`, `AFGHANISTAN:93`, `ALAND ISLANDS:1001`, `ALBANIA:355`, `ALGERIA:213`, `AMERICAN SAMOA:684`, `ANDORRA:376`, `ANGOLA:244`, `ANGUILLA:1264`, `ANTARCTICA:1010`, `ANTIGUA AND BARBUDA:1268`, `ARGENTINA:54`, `ARMENIA:374`, `ARUBA:297`, `AUSTRALIA:61`, `AUSTRIA:43`, `AZERBAIJAN:994`, `BAHAMAS:1242`, `BAHRAIN:973`, `BANGLADESH:880`, `BARBADOS:1246`, `BELARUS:375`, `BELGIUM:32`, `BELIZE:501`, `BENIN:229`, `BERMUDA:1441`, `BHUTAN:975`, `BOLIVIA (PLURINATIONAL STATE OF):591`, `BONAIRE, SINT EUSTATIUS AND SABA:1002`, `BOSNIA AND HERZEGOVINA:387`, `BOTSWANA:267`, `BOUVET ISLAND:1003`, `BRAZIL:55`, `BRITISH INDIAN OCEAN TERRITORY:1014`, `BRUNEI DARUSSALAM:673`, `BULGARIA:359`, `BURKINA FASO:226`, `BURUNDI:257`, `CABO VERDE:238`, `CAMBODIA:855`, `CAMEROON:237`, `CANADA:1`, `CAYMAN ISLANDS:1345`, `CENTRAL AFRICAN REPUBLIC:236`, `CHAD:235`, `CHILE:56`, `CHINA:86`, `CHRISTMAS ISLAND:9`, `COCOS (KEELING) ISLANDS:672`, `COLOMBIA:57`, `COMOROS:270`, `CONGO:242`, `CONGO (DEMOCRATIC REPUBLIC OF THE):243`, `COOK ISLANDS:682`, `COSTA RICA:506`, `COTE DIVOIRE:225`, `CROATIA:385`, `CUBA:53`, `CURACAO:1015`, `CYPRUS:357`, `CZECHIA:420`, `DENMARK:45`, `DJIBOUTI:253`, `DOMINICA:1767`, `DOMINICAN REPUBLIC:1809`, `ECUADOR:593`, `EGYPT:20`, `EL SALVADOR:503`, `EQUATORIAL GUINEA:240`, `ERITREA:291`, `ESTONIA:372`, `ETHIOPIA:251`, `FALKLAND ISLANDS (MALVINAS):500`, `FAROE ISLANDS:298`, `FIJI:679`, `FINLAND:358`, `FRANCE:33`, `FRENCH GUIANA:594`, `FRENCH POLYNESIA:689`, `FRENCH SOUTHERN TERRITORIES:1004`, `GABON:241`, `GAMBIA:220`, `GEORGIA:995`, `GERMANY:49`, `GHANA:233`, `GIBRALTAR:350`, `GREECE:30`, `GREENLAND:299`, `GRENADA:1473`, `GUADELOUPE:590`, `GUAM:1671`, `GUATEMALA:502`, `GUERNSEY:1481`, `GUINEA:224`, `GUINEA-BISSAU:245`, `GUYANA:592`, `HAITI:509`, `HEARD ISLAND AND MCDONALD ISLANDS:1005`, `HOLY SEE:6`, `HONDURAS:504`, `HONG KONG:852`, `HUNGARY:36`, `ICELAND:354`, `INDONESIA:62`, `IRAN (ISLAMIC REPUBLIC OF):98`, `IRAQ:964`, `IRELAND:353`, `ISLE OF MAN:1624`, `ISRAEL:972`, `ITALY:5`, `JAMAICA:1876`, `JAPAN:81`, `JERSEY:1534`, `JORDAN:962`, `KAZAKHSTAN:7`, `KENYA:254`, `KIRIBATI:686`, `KOREA (DEMOCRATIC PEOPLES REPUBLIC OF):850`, `KOREA (REPUBLIC OF):82`, `KUWAIT:965`, `KYRGYZSTAN:996`, `LAO PEOPLES DEMOCRATIC REPUBLIC:856`, `LATVIA:371`, `LEBANON:961`, `LESOTHO:266`, `LIBERIA:231`, `LIBYA:218`, `LIECHTENSTEIN:423`, `LITHUANIA:370`, `LUXEMBOURG:352`, `MACAO:853`, `MACEDONIA (THE FORMER YUGOSLAV REPUBLIC OF):389`, `MADAGASCAR:261`, `MALAWI:265`, `MALAYSIA:60`, `MALDIVES:960`, `MALI:223`, `MALTA:356`, `MARSHALL ISLANDS:692`, `MARTINIQUE:596`, `MAURITANIA:222`, `MAURITIUS:230`, `MAYOTTE:269`, `MEXICO:52`, `MICRONESIA (FEDERATED STATES OF):691`, `MOLDOVA (REPUBLIC OF):373`, `MONACO:377`, `MONGOLIA:976`, `MONTENEGRO:382`, `MONTSERRAT:1664`, `MOROCCO:212`, `MOZAMBIQUE:258`, `MYANMAR:95`, `NAMIBIA:264`, `NAURU:674`, `NEPAL:977`, `NETHERLANDS:31`, `NEW CALEDONIA:687`, `NEW ZEALAND:64`, `NICARAGUA:505`, `NIGER:227`, `NIGERIA:234`, `NIUE:683`, `NORFOLK ISLAND:15`, `NORTHERN MARIANA ISLANDS:1670`, `NORWAY:47`, `OMAN:968`, `PAKISTAN:92`, `PALAU:680`, `PALESTINE, STATE OF:970`, `PANAMA:507`, `PAPUA NEW GUINEA:675`, `PARAGUAY:595`, `PERU:51`, `PHILIPPINES:63`, `PITCAIRN:1011`, `POLAND:48`, `PORTUGAL:14`, `PUERTO RICO:1787`, `QATAR:974`, `REUNION:262`, `ROMANIA:40`, `RUSSIAN FEDERATION:8`, `RWANDA:250`, `SAINT BARTHELEMY:1006`, `SAINT HELENA, ASCENSION AND TRISTAN DA CUNHA:290`, `SAINT KITTS AND NEVIS:1869`, `SAINT LUCIA:1758`, `SAINT MARTIN (FRENCH PART):1007`, `SAINT PIERRE AND MIQUELON:508`, `SAINT VINCENT AND THE GRENADINES:1784`, `SAMOA:685`, `SAN MARINO:378`, `SAO TOME AND PRINCIPE:239`, `SAUDI ARABIA:966`, `SENEGAL:221`, `SERBIA:381`, `SEYCHELLES:248`, `SIERRA LEONE:232`, `SINGAPORE:65`, `SINT MAARTEN (DUTCH PART):1721`, `SLOVAKIA:421`, `SLOVENIA:386`, `SOLOMON ISLANDS:677`, `SOMALIA:252`, `SOUTH AFRICA:28`, `SOUTH GEORGIA AND THE SOUTH SANDWICH ISLANDS:1008`, `SOUTH SUDAN:211`, `SPAIN:35`, `SRI LANKA:94`, `SUDAN:249`, `SURINAME:597`, `SVALBARD AND JAN MAYEN:1012`, `SWAZILAND:268`, `SWEDEN:46`, `SWITZERLAND:41`, `SYRIAN ARAB REPUBLIC:963`, `TAIWAN, PROVINCE OF CHINA[A]:886`, `TAJIKISTAN:992`, `TANZANIA, UNITED REPUBLIC OF:255`, `THAILAND:66`, `TIMOR-LESTE(EAST TIMOR):670`, `TOGO:228`, `TOKELAU:690`, `TONGA:676`, `TRINIDAD AND TOBAGO:1868`, `TUNISIA:216`, `TURKEY:90`, `TURKMENISTAN:993`, `TURKS AND CAICOS ISLANDS:1649`, `TUVALU:688`, `UGANDA:256`, `UKRAINE:380`, `UNITED ARAB EMIRATES:971`, `UNITED KINGDOM OF GREAT BRITAIN AND NORTHERN IRELAND:44`, `UNITED STATES OF AMERICA:2`, `UNITED STATES MINOR OUTLYING ISLANDS:1009`, `URUGUAY:598`, `UZBEKISTAN:998`, `VANUATU:678`, `VENEZUELA (BOLIVARIAN REPUBLIC OF):58`, `VIET NAM:84`, `VIRGIN ISLANDS (BRITISH):1284`, `VIRGIN ISLANDS (U.S.):1340`, `WALLIS AND FUTUNA:681`, `WESTERN SAHARA:1013`, `YEMEN:967`, `ZAMBIA:260`, `ZIMBABWE:263`, `OTHERS:9999`

**2c — Nature / OS Section Code, cell G45:L50** — named range `SI_OSSECTIONCODES_RES` (Resident) / `SI_OSSECTIONCODES_NRI` (NRI), chosen by residential status. The values (from schema enum `OthersGrossDtls[].SourceDescription`):

| Code | Description |
|---|---|
| `5A1ai` | 115A(1)(a)(i)- Dividends interest and income from units purchase in foreign currency |
| `5A1aA` | 115A(1)(a)(A)- Dividend in the case of non-resident received from a unit in an International Financial Services Centre |
| `5A1aii` | 115A(1)(a)(ii)- Interest received from govt/Indian Concerns recived in Foreign Currency |
| `5A1aiia` | 115A(1) (a)(iia) -Interest from Infrastructure Debt Fund |
| `5A1aiiaa` | 115A(1) (a)(iiaa) -Interest as per Sec. 194LC(1) |
| `5A1aiiab` | 115A(1) (a)(iiab) -Interest as per Sec. 194LD |
| `5A1aiiac` | 115A(1)(a)(iiac) -Interest as per Sec. 194LBA |
| `5A1aiii` | 115A(1) (a)(iii) - Income received in respect of units of UTI purchased in Foreign Currency |
| `5A1bA` | 115A(1)(b)(A) & 115A(1)(b)(B)- Income from royalty or fees for technical services received from Government or Indian con |
| `5AC1ab` | 115AC(1)(a) - Income by way of interest on bonds purchased in foreign currency - non-resident |
| `5AC1abD` | 115AC(1)(b) - Income by way of Dividend on GDRs purchased in foreign currency - non-resident |
| `5AD1i` | 115AD(1)(i) -Income (other than Dividend) received by an FII in respect of securities (other than units as per Sec 115AB |
| `5AD1iP` | 115AD(1)(i) -Income received by an FII in respect of bonds or government securities as per Sec 194LD |
| `5BBA` | 115BBA - Tax on non-residents sportsmen or sports associations |
| `5BBF` | 115BBF - Tax on income from patent |
| `5BBG` | 115BBG - Tax on income from transfer of carbon credits |
| `5Ea` | 115E(a) -Investment Income of a Non-Resident Indian -chargeable u/s 115E |
| `5AB1a` | 115AB(1)(a) - Income in respect of units - off -shore fund |
| `5A1aiiaaP` | 115A(1) (a)(iiaa) -Interest as referred in proviso to section 194LC(1) |
| `5A1aiiaaSP` | 115A(1) (a)(iiaa)-Income received by non-resident as referred in second proviso to section 194LC(1) |
| `5AD1iDiv` | 115AD(1)(i) - Income (being dividend) received by an FII in respect of securities (other than units referred to in secti |
| `5AD1IBd` | 115AD(1)(i)(B) - Income (being dividend) received by a specified fund in respect of securities (other than units referre |
| `5AD1IB` | 115AD(1)(i)(B) - Income (other than dividend) received by a specified fund in respect of securities (other than units re |

**2d — Nature / PTI Section Code, cell G54:L56** — named range `PTI_RES_OS_Dropdown` (Resident) / `PTI_NRI_OS_Dropdown` (NRI). The values (from schema enum `PTIOthersGrossDtls[].SourceDescription`):

| Code | Description |
|---|---|
| `PTI_5A1ai` | PTI-115A(1)(a)(i)- Dividends interest and income from units purchase in foreign currency |
| `PTI_5A1aA` | PTI-115A(1)(a)(A)- PTI-Dividends in the case of non-residents received from a unit in an International Financial Service |
| `PTI_5A1aii` | PTI-115A(1)(a)(ii)- Interest received from govt/Indian Concerns received in Foreign Currency |
| `PTI_5A1aiia` | PTI-115A(1) (a)(iia) -Interest from Infrastructure Debt Fund |
| `PTI_5A1aiiaa` | PTI-115A(1) (a)(iiaa) -Interest as per Sec. 194LC(1) |
| `PTI_5A1aiiab` | PTI-115A(1) (a)(iiab) -Interest as per Sec. 194LD |
| `PTI_5A1aiiac` | PTI-115A(1) (a)(iiac) -Interest as per Sec. 194LBA |
| `PTI_5A1aiii` | PTI-115A(1) (a)(iii) -Income received in respect of units of UTI purchased in foreign currency |
| `PTI_5A1bA` | PTI-115A(1)(b)(A) & PTI-115A(1)(b)(B)- Income from royalty or fees for technical services received from Government or In |
| `PTI_5AC1ab` | PTI-115AC(1)(a) -Income by way of interest on bonds purchased in foreign currency - non-resident |
| `PTI_5AC1abD` | PTI-115AC(1)(b) - Income by way of Dividend on GDRs purchased in foreign currency - non-resident |
| `PTI_5AD1i` | PTI-115AD(1)(i) -Income (other than Dividend) received by an FII in respect of securities (other than units as per Sec 1 |
| `PTI_5AD1iP` | PTI-115AD(1)(i) -Income received by an FII in respect of bonds or government securities as per Sec 194LD |
| `PTI_5BBA` | PTI-115BBA - Tax on non-residents sportsmen or sports associations |
| `PTI_5BBF` | PTI-115BBF - Tax on income from patent |
| `PTI_5BBG` | PTI-115BBG - Tax on income from transfer of carbon credits |
| `PTI_5Ea` | PTI-115E(a)-Investment Income of a Non-Resident Indian -chargeable u/s 115E |
| `PTI_5AB1a` | PTI-115AB(1)(a) - Income in respect of units - off -shore fund |
| `PTI_5A1aiiaaP` | PTI-115A(1) (a)(iiaa) - Interest as referred in proviso to section 194LC(1) |
| `PTI_5A1aiiaaSP` | PTI-115A(1) (a)(iiaa) - Income received by non-resident as referred in second proviso to section 194LC(1) |
| `PTI_5AD1iDiv` | PTI-115AD(1)(i) - Income (being dividend) received by an FII in respect of securities (other than units referred to in s |
| `PTI_5AD1IBd` | PTI- 115AD(1)(i)(B) - PTI- Income (being dividend) received by a specified fund in respect of securities (other than uni |
| `PTI_5AD1IB` | PTI-115AD(1)(i)(B) - PTI- Income (other than dividend) received by a specified fund in respect of securities (other than |

**2e — Section of I.T. Act (Col 8), cell L60:L65** — named range `OS_DTTA_Drpdown_RES` (Resident) / `OS_DTTA_Drpdown_NRI` (NRI). The values (from schema enum `NRIDTAADtlsSchOS[].ItemNoincl`):

| Code | Description |
|---|---|
| `56i` | 56(2)(i)- Dividends |
| `56i_f` | 56(2)(i)- Dividends u/s 2(22)(f) |
| `56` | 56(2)- Interest |
| `562iii` | 56(2)(iii)-Rental income from machinery, plants, buildings etc. |
| `562x` | 56(2)(x) - Income under section 56(2)(x) |
| `5A1ai` | 115A(1)(a)(i)- Dividends interest and income from units purchase in foreign currency, |
| `5A1aA` | 115A(1)(a)(A)- Dividend in the case of non-resident received from a unit in an International Financial Services Centre |
| `5A1aii` | 115A(1)(a)(ii)- Interest received from govt/Indian Concerns recived in Foreign Currency, |
| `5A1aiia` | 115A(1) (a)(iia) -Interest from Infrastructure Debt Fund, |
| `5A1aiiaa` | 115A(1) (a)(iiaa) -Interest as per Sec. 194LC(1), |
| `5A1aiiab` | 115A(1) (a)(iiab) -Interest as per Sec. 194LD, |
| `5A1aiiac` | 115A(1)(a)(iiac) -Interest as per Sec. 194LBA, |
| `5A1aiii` | 115A(1) (a)(iii) - Income received in respect of units of UTI purchased in Foreign Currency, |
| `5A1bA` | 115A(1)(b)(A)- Income from royalty or fees for technical services received from Government or Indian concern -chargeable |
| `5AB1a` | 115AB(1)(a) - Income in respect of units - off -shore fund, |
| `5AC1ab` | 115AC(1)(a) - Income by way of interest on bonds purchased in foreign currency - non-resident |
| `5AC1abD` | 115AC(1)(b) - Income by way of Dividend on GDRs purchased in foreign currency - non-resident |
| `5AD1i` | 115AD(1)(i) -Income (other than dividend) received by an FII in respect of securities (other than units as per Sec 115AB |
| `5AD1iP` | 115AD(1)(i) -Income received by an FII in respect of bonds or government securities as per Sec 194LD , |
| `5BBA` | 115BBA - Tax on non-residents sportsmen or sports associations |
| `5BBG` | Tax on Transfer of corbon credits |
| `5Ea` | 115E(a) - Investment Income of a Non-Resident Indian chargeable u/s 115E, |
| `5BB` | Winnings from lotteries, crossword puzzles etc. |
| `5BBJ` | 115BBJ - Winnings from online games |
| `5BBF` | Tax on income from patent |
| `5A1aiiaaP` | 115A(1) (a)(iiaa) -Interest as referred in proviso to section 194LC(1) |
| `5A1aiiaaSP` | 115A(1) (a)(iiaa)-Income received by non-resident as referred in second proviso to section 194LC(1) |
| `5AD1iDiv` | PTI-115AD(1)(i) - Income (being dividend) received by an FII in respect of securities (other than units referred to in s |
| `PTI_5A1ai` | PTI - Dividends in the case of non-residents |
| `PTI_5A1aA` | PTI- Proviso to 115A(1)(a)(A) -Dividends in the case of non-residents received from a unit in an International Financial |
| `PTI_5A1aii` | PTI - Interest received in the case of non-residents |
| `PTI_5A1aiia` | PTI - Interest received by non-resident from infrastructure debt fund |
| `PTI_5A1aiiaa` | PTI - Income received by non-resident as referred in section 194LC(1) |
| `PTI_5A1aiiab` | PTI - Income received by non-resident as referred in section 194LD |
| `PTI_5A1aiiac` | PTI - Income received by non-resident as referred in section 194LBA |
| `PTI_5A1aiii` | PTI - Income from units purchased in foreign currency in the case of non-residents |
| `PTI_5A1bA` | PTI - PTI-Income from royalty or fees for technical services received from Government or Indian concern -chargeable u/s  |
| `PTI_5AB1a` | PTI - 115AB(1)(a) - Income in respect of units - off -shore fund, |
| `PTI_5AC1ab` | PTI-115AC(1)(a) -Income by way of interest on bonds purchased in foreign currency - non-resident |
| `PTI_5AC1abD` | PTI-115AC(1)(b) - Income by way of Dividend on GDRs purchased in foreign currency - non-resident |
| `PTI_5AD1i` | PTI-115AD(1)(i) -Income(other than dividend) received by an FII in respect of securities (other than units as per Sec 11 |
| `PTI_5AD1iP` | PTI-115AD(1)(i) -Income received by an FII in respect of bonds or government securities as per Sec 194LD |
| `PTI_5BBA` | PTI-115BBA - Tax on non-residents sportsmen or sports associations |
| `PTI_5BBG` | PTI-115BBG - Tax on income from transfer of carbon credits |
| `PTI_5Ea` | PTI -115E(a) - Investment Income of a Non-Resident Indian chargeable u/s 115E, |
| `PTI_5BBF` | PTI-Tax on income from patent |
| `PTI_5A1aiiaaP` | PTI-115A(1) (a)(iiaa) - Interest as referred in proviso to section 194LC(1) |
| `PTI_5A1aiiaaSP` | PTI-115A(1) (a)(iiaa) - Income received by non-resident as referred in second proviso to section 194LC(1) |
| `PTI_5AD1iDiv` | PTI-115AD(1)(i) - Income (being dividend) received by an FII in respect of securities (other than units referred to in s |
| `5AD1IBd` | 115AD(1)(i)(B) - Income (being dividend) received by a specified fund in respect of securities (other than units referre |
| `5AD1IB` | 115AD(1)(i)(B) - Income (other than dividend) received by a specified fund in respect of securities (other than units re |
| `PTI_5AD1IBd` | PTI- 115AD(1)(i)(B) - PTI- Income (being dividend) received by a specified fund in respect of securities (other than uni |
| `PTI_5AD1IB` | PTI-115AD(1)(i)(B) - PTI- Income (other than dividend) received by a specified fund in respect of securities (other than |

> The 2c/2d/2e Nature/Section dropdowns are utility named ranges resolved at
> runtime via `IF(MID(sheet1.ResidentialStatus1,1,3)="NRI", …_NRI, …_RES)`, so
> `dump.py --dropdowns` returns them as unresolved (`values: null`). The lists
> above are their authoritative values, taken from `enums.json` for the matching
> schema keys.

---

## What repeats and what is one figure

**Repeating (arrays — unlimited rows in schema, the sheet shows a starter block):**

- **1e — Any other income** → `IOTORH.OthersInc.OthersIncDtls[]` (Nature + Amount).
- **2c — Any other special-rate income** → `IOTORH.OthersGrossDtls[]` (Nature/section code + Amount); sheet shows 6 starter rows r45–50.
- **2d — PTI special-rate income** → `IOTORH.PTIOthersGrossDtls[]`; sheet shows 3 starter rows r54–56.
- **2e — DTAA** → `…IncChargblSplRateOS.NRIOsDTAA.NRIDTAADtlsSchOS[]`; sheet shows 6 starter rows r60–65.

**One figure each (single scalars):** every numbered/lettered line — 1, 1a, 1a(i)–(iii), 1b, 1b(i)–(v), 1c, 1d, 1d(i)–(v), 1e, the 56(2)(xii) fixed line, 2, 2a(i), 2a(ii), 2b, 2b(i)–(vi), 2c total, 2d total, 2e total, 3a, 3b, 3c, 3c(i), 3d, 4, 5, 6, 7, 8a–8e, 9.

**One quarterly object each** (item 10): `IncFrmLottery`, `IncFrmOnGames`,
`DividendIncUs115BBDA`, `DividendIncUs115BBDAaiii`, `DividendIncUs115A1ai`,
`DividendIncUs115A1aA`, `DividendIncUs115AC`, `DividendIncUs115AD1iDiv`,
`DividendIncUs115AD1IBd`, `DividendDTAA` — each a single `DateRange` with five
date-range fields, not a repeat.

---

## Mandatory (schema `required`)

The schema marks 102 leaves `required`. The scalar/whole-schedule ones:
`GrossIncChrgblTaxAtAppRate`, `DividendGross`, `DividendOthThan22e`,
`Dividend22e`, `InterestGross`, `IntrstFrmSavingBank`, `IntrstFrmTermDeposit`,
`IntrstFrmIncmTaxRefund`, `NatofPassThrghIncome`, `IntrstFrmOthers`,
`RentFromMachPlantBldgs`, `Tot562x`, `Aggrtvaluewithoutcons562x`,
`Immovpropwithoutcons562x`, `Immovpropinadeqcons562x`,
`Anyotherpropwithoutcons562x`, `Anyotherpropinadeqcons562x`, `AnyOtherIncome`,
`IncChargeableSpecialRates`, `LtryPzzlChrgblUs115BB`, `IncChrgblUs115BBE`,
`CashCreditsUs68`, `UnExplndInvstmntsUs69`, `UnExplndMoneyUs69A`,
`UnDsclsdInvstmntsUs69B`, `UnExplndExpndtrUs69C`, `AmtBrwdRepaidOnHundiUs69D`,
`OthersGross`, `PassThrIncOSChrgblSplRate`, `TotalAmtTaxUsDTAASchOs`,
`Depreciation`, `TotDeductions`, `BalanceNoRaceHorse`, `TotOthSrcNoRaceHorse`,
`Receipts`, `DeductSec57`, `BalanceOwnRaceHorse`, `IncChargeableFrmOthSrc`.

Array-element required keys (mandatory **only when the parent array has a row**):
`OthersIncDtls[].OthNatOfInc`, `OthersIncDtls[].OthAmount`;
`OthersGrossDtls[].SourceDescription`, `OthersGrossDtls[].SourceAmount`;
`PTIOthersGrossDtls[].SourceDescription`, `PTIOthersGrossDtls[].SourceAmount`;
and in `NRIDTAADtlsSchOS[]`: `DTAAamt`, `NatureOfIncome`, `CountryName`,
`CountryCodeExcludingIndia`, `DTAAarticle`, `RateAsPerTreaty`, `ItemNoincl`,
`RateAsPerITAct`.

The five `DateRange` fields — `Upto15Of6`, `Up16Of6To15Of9`,
`Up16Of9To15Of12`, `Up16Of12To15Of3`, `Up16Of3To31Of3` — are required on **each
of the ten** item-10 quarterly objects (that is the bulk of the 102 count).

Not required (optional): `Dividend22f`, `SumRecdPrYrBusTRU562xii`,
`IncChrgblUs115BBJ`, `Deductions.Expenses`, `Deductions.UsrIntExp57`,
`Deductions.IntExp57`, `AmtNotDeductibleUs58`, `ProfitChargTaxUs59` (both the
main and race-horse copies), `ApplicableRate`, `TaxRescertifiedFlag`.

---

## Hidden rows — not built

These carry the H flag in the utility and must **not** be built as inputs:

- **r32 / r33 / r34** — the older two-line version of 2a(ii) online-game income:
  *"Income by way of winning from online game chargeable u/s 115BBJ"* with
  *"(i) Gross winnings from online games"* and *"(ii) Adjustment as per Rule
  133"*. Only the single visible figure at **r35** (`IncChrgblUs115BBJ`) is live.
- **r69** — *"a(ii) Deduction u/s 57 (iia) (in case of family pension only)"*
  (`3aii`). Hidden on ITR-5 because a firm/AOP/BOI has no family pension; the
  57(iia) deduction does not apply.
- **r89** — *"Dividend Income"* — a hidden aggregate line at the top of the
  item-10 quarterly table; the live dividend breakdown is r92–r99.

(The item-10 rows r92/r93 also carry the sheet's `3a`/`3b` internal lettering;
that is the utility's own working, not a separate schema field.)

### Developer-annotation cells (not form fields — ignored)

The utility carries maintenance notes in far-right helper columns (T/U/V) that
are not part of the return and are not built: *"As per Aayushi Dev by
Sadineni_14_07_2025"* (r2), *"For AY 2025-26 added by shrutika"* and *"added by
shrutika"* (r58/r94), and *"by Sai for AY 2025-26"* (r92/r95). These are
version/author stamps left by the developers (Aayushi, Sadineni, Sai, shrutika)
for AY 2025-26 and later; they hold no taxpayer data.

---

## What this means for the build

- **Item 1, 2, 3d, 6, 7, 8e, 9 are computed** — render them read-only and drive
  them from their formulas (P4, N5, N9, N16, N22, P30, N36, N43, N52, N58, N74,
  P77, P78, P84, P85). Do not accept free entry into a total.
- **Only inputs**: the leaf figures (1a(i)–(iii), 1b(i)–(v), 1c, 1d(i)–(v), the
  1e table + 56(2)(xii) line, 2a(i), 2a(ii), 2b(i)–(vi), the 2c/2d/2e tables,
  3a, 3b, 3c-entered, 4, 5, 8a–8d) and the item-10 quarterly cells.
- **Residency drives the special-rate machinery.** Read `ResidentialStatus1`
  from Part A-General and switch the 2c/2d/2e Nature/Section dropdowns
  (`_RES` vs `_NRI` ranges) and 2e's TRC-gated inclusion (N58, N60) accordingly.
- **Enforce the caps**: 3c(i) ≤ 20% of dividend income (recompute & restrict);
  3b only when 1c > 0; 3c only when dividend at 1a(i)/1a(ii); each 2e Col-2
  amount ≤ its parent field (rules 480–487); 2 floored at 0; 6/8e may be
  negative and flow to CYLA/CFL.
- **Item 10 reconciliations are hard validations** — the quarterly break-ups
  must equal their annual figures (rules 491, 496–503). Build the ten quarterly
  objects with the five date-range fields each and cross-check on save.
- **Cross-schedule wiring**: item 6 loss → CYLA 4i; 8e loss → CFL 11xvii; 1a(iii)
  ↔ Schedule CG buy-back loss (rule 446); item 9 → Part B-TI. 115BBF only for
  residents (rules 249, 479).
- **Do not build the hidden rows** (r32–34, r69, r89).
