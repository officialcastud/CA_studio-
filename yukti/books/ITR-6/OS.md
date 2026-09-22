# The book of Schedule OS — Income from Other Sources · ITR-6, A.Y. 2026-27

Read row by row from the utility's **OS** sheet (104 rows, hidden-row flags read)
and confirmed against the CBDT ITR-6 schema's `ScheduleOS` block and the ITR-6
validation-rules document (rules 462–500, plus the cross-schedule rules 39, 200,
201, 231, 433, 500, 518, 519, 524, 525, 561, 612, 613, 616, 624, 630, 631). Nothing
here is invented; every item number is the rules document's own, every schema key is
the department's, every dropdown is the utility's own list.

This is a **company** return. Where ITR-2's Schedule OS carries the family-pension
line, the 89A retirement-benefit-account split (US/UK/Canada), the four provident-fund
proviso interest lines and the life-insurance 56(2)(xiii) line, ITR-6 **does not** —
a company has none of these. So ITR-6's Schedule OS is the same working shape but
**leaner in three places** and **renumbered in one** (§14 sets out the differences).

---

## 1 · The shape — nine items and a quarterly table

Schedule OS is one continuous computation, numbered 1 to 9, followed by item 10, a
table of when the income arose. It is a **working**: gross income at normal rates,
plus income at special rates, minus section-57 deductions, plus/minus the 58/59
adjustments, landing on one figure that goes to Part B-TI.

| Item | What it is | Kind | Sheet row(s) |
|---|---|---|---|
| **1** | Gross income chargeable at normal applicable rates — 1a to 1e | five heads, most with sub-lines | 4–24 |
| **2** | Income chargeable at special rates — 2ai to 2e | six heads | 29–70 |
| **3** | Deductions under section 57 (3a, 3b, 3c, 3d) | four lines with conditions | 72–78 |
| **4** | Amounts not deductible under section 58 | one figure | 79 |
| **5** | Profits chargeable to tax under section 59 | one figure | 80 |
| **6** | **Net income at normal rates** — 1 (after DTAA) − 3 + 4 + 5 | computed; a loss goes to CYLA 4i | 81 |
| **7** | Income from other sources, other than race horses — 2 + 6 | computed; 6 as nil if negative | 82 |
| **8** | Income from the activity of owning race horses — 8a to 8e | a separate five-line working | 83–88 |
| **9** | **Income under the head — 7 + 8e** | computed; 8e as nil if negative | 89 |
| **10** | Information about accrual/receipt of income | a quarterly matrix, 10 live rows | 90–104 |

> **Note ITR-6 has no item "5a".** ITR-2's item 5a (income claimed for relief under
> 89A) does not exist in ITR-6; item 6's formula on this sheet is `1(after reducing
> income related to DTAA portion) − 3 + 4 + 5`, with no 89A subtraction (rule 471).

The closing note (row 104): *"The total of all the quarters of Dividend Income should
be equal to [1ai (Dividend Income (other than in 1a(ii)) − DTAA of Dividend in 2e
subject to Resident and TRC flags − System calculated value of Interest expenditure
u/s 57(1) attributable to sl.no.1ai and 1aii] of Schedule OS"* (rule 475).

The whole schedule maps to the schema block **`ScheduleOS`**, whose top-level shape is:
`IncOthThanOwnRaceHorse{…}` (items 1–7), `TotOthSrcNoRaceHorse` (item 7),
`IncFromOwnHorse{…}` (item 8), `IncChargeableFrmOthSrc` (item 9), and the ten
quarterly break-up blocks (item 10).

---

## 2 · Item 1 — Gross income chargeable at normal applicable rates

**1 = 1a + 1b + 1c + 1d + 1e** — computed (rule 463; sheet `J4 =
SUM(os.DividendGross, os.InterestGross, os.RentFromMachPlantBldgs, os.Totalsec56,
os.TotalAnyOtherIncome)`). Schema total key: `GrossIncChrgblTaxAtAppRate`.

| Item | Sheet label | Type | Schema key (under `IncOthThanOwnRaceHorse`) | Notes |
|---|---|---|---|---|
| **1** | Gross Income chargeable to tax at normal applicable rates (1a+ 1b+ 1c+ 1d+1e) | computed | `GrossIncChrgblTaxAtAppRate` | 1a+1b+1c+1d+1e |

### 1a · Dividends, Gross (ai+aii+aiii) — computed (rule 489; `J5`)

| Item | Sheet label | Type | Schema key | Notes |
|---|---|---|---|---|
| **1a** | Dividends Gross (ai+aii+aiii) | computed | `DividendGross` | 1a(i)+1a(ii)+1a(iii) |
| **1a(i)** | Dividend income [other than (ii) and (iii)] | number | `DividendOthThan22e` | ordinary dividend |
| **1a(ii)** | Dividend income u/s 2(22)( e) | number | `Dividend22e` | deemed dividend — loan/advance by a closely-held company |
| **1a(iii)** | Dividend income u/s 2(22)(f) | number | `Dividend22f` | buy-back treated as dividend — *unlocks the buy-back capital loss A(A)/B(A) in Schedule CG; rules 433 & 500 require this line be filled if a buy-back loss is claimed in CG* |

### 1b · Interest, Gross (bi + bii + biii + biv + bv) — computed (`J9`)

**Only five interest sub-lines in ITR-6** — there are no provident-fund proviso lines
(ITR-2's 1b(v)–(viii)). Schema total key: `InterestGross`.

| Item | Sheet label | Type | Schema key | Notes |
|---|---|---|---|---|
| **1b** | Interest, Gross(bi + bii + biii + biv+bv) | computed | `InterestGross` | bi+bii+biii+biv+bv |
| **1b(i)** | From Savings Bank | number | `IntrstFrmSavingBank` | |
| **1b(ii)** | From Deposit (Bank/ Post Office/ Co-operative Society) | number | `IntrstFrmTermDeposit` | |
| **1b(iii)** | From Income Tax refund | number | `IntrstFrmIncmTaxRefund` | |
| **1b(iv)** | In the nature of Pass through income/loss | number | `NatofPassThrghIncome` | |
| **1b(v)** | Others including interest from Companies, NBFCs & HFCs | number | `IntrstFrmOthers` | |

> **Source inconsistency (flag):** validation rule 474 states *"Sl. No. 1b should be
> equal to sum of (bi + bii + biii + biv + bv + bvi)"* — six lines. The utility sheet
> header (`Interest, Gross(bi + bii + biii + biv+bv)`) and the schema (five keys,
> `IntrstFrmSavingBank … IntrstFrmOthers`) both carry **five**. Utility + schema agree
> on five; the rule text appears to carry a stale sixth term (the rule string in
> `rules.json` runs straight on into the item-10 rule, i.e. it is a parse merge). Booked
> as **five** lines per the two agreeing sources; noted per the seventeen-rules note 17.

### 1c · Rental income from machinery, plants, buildings

| Item | Sheet label | Type | Schema key | Notes |
|---|---|---|---|---|
| **1c** | Rental income from machinery, plants, buildings, etc., Gross | number | `RentFromMachPlantBldgs` | *unlocks the depreciation deduction at 3b (rule 465)* |

### 1d · Income of the nature referred to in section 56(2)(x) — computed (rule 470; `J16`)

**1d = 1di + 1dii + 1diii + 1div + 1dv.** Schema total key: `Tot562x`.

| Item | Sheet label | Type | Schema key | Notes |
|---|---|---|---|---|
| **1d** | Income of the nature referred to in section 56(2)(x) which is chargeable to tax (di + dii + diii + div + dv) | computed | `Tot562x` | |
| **1d(i)** | Aggregate value of sum of money received without consideration | number | `Aggrtvaluewithoutcons562x` | |
| **1d(ii)** | In case immovable property is received without consideration, stamp duty value of property | number | `Immovpropwithoutcons562x` | |
| **1d(iii)** | In case immovable property is received for inadequate consideration, stamp duty value of property in excess of such consideration | number | `Immovpropinadeqcons562x` | |
| **1d(iv)** | In case any other property is received without consideration, fair market value of property | number | `Anyotherpropwithoutcons562x` | |
| **1d(v)** | In case any other property is received for inadequate consideration, fair market value of property in excess of such consideration | number | `Anyotherpropinadeqcons562x` | |

### 1e · Any other income (please specify nature) — computed (`J22 = MAX(0, SUM(os.OtherSections, os.Business56))`)

ITR-6's 1e is **lean**: one fixed row (business-trust 56(2)(xii)) plus a free table.
There is no family-pension row, no 89A notified-country lines, no 56(2)(xiii)
life-insurance line (all of which ITR-2 carries).

| Item | Sheet label | Type | Schema key | Notes |
|---|---|---|---|---|
| **1e** | Any other income (please specify nature) | computed total | `AnyOtherIncome` | free rows + business trust |
| **1e — fixed row 24** | Any specified sum received by a unit holder from a business trust during the previous year as referred to in section 56(2)(xii) | number | `SumRecdPrYrBusTRU562xii` | optional; one fixed row |
| **1e — free table** | SL.NO. · Nature · Amount | repeatable | `OthersInc.OthersIncDtls[]` → `OthNatOfInc` (string), `OthAmount` (integer) | unlimited rows |

---

## 3 · Item 2 — Income chargeable at special rates

**2 = 2ai + 2aii + 2b + 2c + 2d + 2e** (elements related to Sl. No. 1) — computed
(rule 472; sheet `J29 = MAX(0, SUM(os.WinLottRacePuzz, os.WinOnlineGame,
os.Total115BE, os.IncomeBenefitTotal, os.Total562Tax, os.TotalPassThroughIncome,
OS.DTAA6))`). Schema total key: `IncChargeableSpecialRates`. *Nothing in item 3 may be
deducted against 2a, 2b, 2c, 2d or 2e (sheet row 72 header).*

> **ITR-6 renumbering — the accumulated-PF sub-schedule is hidden.** The utility rows
> 39–43, *"Accumulated balance of recognised provident fund taxable u/s 111"* (a
> SL.NO./Assessment-Year/Income-Benefit/Tax-Benefit table), are **hidden** (`r39H`–
> `r43H`) — a company has no such balance. It carries **no schema key** and is **not
> built** (see §12). Because it is hidden, the visible special-rate lettering runs
> ai, aii, b, **c, d, e** — so ITR-6's 2c/2d/2e are ITR-2's 2d/2e/2f. The
> `os.IncomeBenefitTotal` term still sits in the `J29` formula but resolves to nil.

### 2a — winnings

| Item | Sheet label | Type | Schema key | Notes |
|---|---|---|---|---|
| **2a(i)** | Winnings from Lotteries, crossword puzzles, races, card games etc chargeable u/s 115BB | number | `LtryPzzlChrgblUs115BB` | 30% (rule 476 ties it to quarterly row 1; rule 612 to Schedule SI) |
| **2a(ii)** | Income by way of winnings from Online games chargeable u/s 115BBJ | number | `IncChrgblUs115BBJ` | 30% (rule 477; rule 624 to SI) |

### 2b · Income chargeable u/s 115BBE — computed (rule 497; `J32`)

**2b = bi + bii + biii + biv + bv + bvi.** 60% + 25% surcharge. Schema total:
`IncChrgblUs115BBE`. (Rule 613 ties 2b to Schedule SI 115BBE.)

| Item | Sheet label | Type | Schema key |
|---|---|---|---|
| **2b(i)** | Cash credits u/s 68 | number | `CashCreditsUs68` |
| **2b(ii)** | Unexplained investments u/s 69 | number | `UnExplndInvstmntsUs69` |
| **2b(iii)** | Unexplained money etc. u/s 69A | number | `UnExplndMoneyUs69A` |
| **2b(iv)** | Undisclosed investments etc. u/s 69B | number | `UnDsclsdInvstmntsUs69B` |
| **2b(v)** | Unexplained expenditure etc. u/s 69C | number | `UnExplndExpndtrUs69C` |
| **2b(vi)** | Amount borrowed or repaid on hundi u/s 69D | number | `AmtBrwdRepaidOnHundiUs69D` |

### 2c · Any other income chargeable at special rate — computed (rule 494; `J46 = SUM(os.SourceAmount)`)

A **table**: SL.NO. · Nature (a residential-status-dependent section-code dropdown) ·
Amount. Rows addable. Schema total: `OthersGross`; rows: `OthersGrossDtls[]` →
`SourceDescription` (string, the section code), `SourceAmount` (integer). Helper
columns S47 "OS Section", T47 "Os Value", X47 "OS Section Code" flag which rows are
filled. (Rule 631: the amount must equal the corresponding dropdown in Schedule SI.)

The Nature dropdown (`H48:H55`, source `IF(IsForeignResident, SI_OSSECTIONCODES_RES_FC,
IF(IsForeignNRI, SI_OSSECTIONCODES_NRI_FC, IF(status=NRI, SI_OSSECTIONCODES_NRI,
SI_OSSECTIONCODES_RES)))`) is **one of four lists chosen by residential status** — see
Appendix B. For a resident domestic company the list is `SI_OSSECTIONCODES_RES` (9
values). Being an `IF()`-driven validation, it does not resolve to a flat list for the
gate; the full lists are booked in Appendix B for completeness.

### 2d · Pass through income (PTI) at special rates — computed (rules 469 & 487; `J58 = SUM(os.PTIAmount)`)

Same table shape as 2c, with the **PTI section-code** dropdown. Schema total:
`PassThrIncOSChrgblSplRate`; rows: `PTIOthersGrossDtls[]` → `SourceDescription`
(string), `SourceAmount` (integer). Helper columns S59 "PTIsec", T59 "PTIvalue",
U59 "PTI SecCode". Dropdown `H60:H62` (source `IF(IsForeignResident, OS.PTIResFC,
IF(IsForeignNRI, OS.PTINRI, IF(status=NRI, OS.PTINRI, OS.PTIRes)))`) — the PTI lists in
Appendix B. (Rule 630: amount must equal the corresponding SI dropdown.)

### 2e · Amount included in 1 and 2 above claimed at DTAA rates — the DTAA table (rule 495)

*"Amount included in 1 and 2 above, which is claimed as chargeable at special rates
or not chargeable to tax in India as per DTAA (total of column (2) of table below)
(Applicable for non-residents only)."* Schema total: `IncChargblSplRateOS.
TotalAmtTaxUsDTAASchOs`; rows: `IncChargblSplRateOS.NRIOsDTAA.NRIDTAADtlsSchOS[]`. A
non-resident-only table, 4 rows shipped, addable. `J65 = IF(status=NRI,
SUMIF(os.TRC,"Yes",os.Amount_income), SUM(os.Amount_income))` — for an NRI only
TRC-Yes rows count.

The sheet shows nine columns (row 66); the JSON carries **ten fields**, because the
sheet's "Item No." and "Section of I.T. Act" are two schema fields, and the applicable
rate is computed:

| # | Sheet column (row 66) | Schema field | Req | Notes |
|---|---|---|---|---|
| (1) | Sl. No | — | | serial |
| (2) | Amount of income | `DTAAamt` | ★ | |
| (3) | Item No. 1ai, 1aiii to 1d, 2a , 2c & 2d in which included | `NatureOfIncome` | ★ | 9-value dropdown, Appendix C |
| (4) | Country name and code | `CountryName` ★ + `CountryCodeExcludingIndia` ★ | ★ | dropdown `Country_Less_India`, 250 codes, India excluded — Appendix A |
| (5) | Article of DTAA | `DTAAarticle` | ★ | |
| (6) | Rate as per Treaty (enter NIL, if not chargeable) | `RateAsPerTreaty` | ★ | number |
| (7) | Whether TRC obtained? | `TaxRescertifiedFlag` | | (Select)/Yes/No → Y/N |
| (8) | Section of I.T. Act | `SecITAct` | ★ | 54-code schema dropdown, Appendix C |
| (9) | Rate as per I.T. Act | `RateAsPerITAct` | ★ | number |
| (10) | Applicable rate [lower of (6) or (9)] | `ApplicableRate` | | **computed** — `L67 = IF(ResidentialCheck="NR", IF(MID(I67,1,1)="Y", MIN(H67,K67), ""), MIN(H67,K67))` |

★ = required on every row.

Per-item DTAA caps (rules 480–487): the sum of column-2 amounts against each item may
not exceed that item's own figure — 1a(i) (rule 481), 1b (482), 1d (484), 2a(i) (485),
2a(ii) (480), 2c (486), 2d (487). Rule 524 feeds 2e to CYLA; rule 616 to Schedule SI.

---

## 4 · Item 3 — Deductions under section 57

Row 72 header: *"Deductions under section 57:- (other than those relating to income
chargeable at special rate under 2a, 2b , 2c, 2d & 2e)."* **3d = 3a + 3b + 3c**
(rule 464; `J78 = os.Expenses + os.Depreciation + os.amountinterestexpenditure`).

| Item | Sheet label | Type | Schema key (under `Deductions`) | Condition |
|---|---|---|---|---|
| **3a** | Expenses / deductions (Other than entered in C) | number | `Expenses` | rule 496 — the corresponding income must be offered under this head |
| **3b** | Depreciation (available only if income offered in 1c of "schedule OS") | number | `Depreciation` | **restricted to the 1c figure** (rule 465) |
| **3c** | Interest expenditure on dividend u/s 57(1 ) (only if income offered in 1a(i) and/or 1a(ii)) | | | dividend interest only |
| — | Interest expenditure claimed | number | `UsrIntExp57` | what the person enters |
| **3c** | Eligible amount of interest expenditure u/s 57(1)- Computed Value | computed | `IntExp57` | **capped at 20% of (1a(i) + 1a(ii))** (rule 493); `U81 = os.expenditureClaimed − MIN(os.expenditureClaimed, os.DividendGrossaii)` |
| **3d** | Total | computed | `TotDeductions` | 3a + 3b + 3c |

> Note: `Expenses`, `UsrIntExp57`, `IntExp57` are schema-optional; `Depreciation` and
> `TotDeductions` are required. Deductions at 3d (and 8b) are disallowed if 115BAB
> lower-tax benefit is opted (rule 488).

---

## 5 · Items 4, 5 — the adjustments

| Item | Sheet label | Type | Schema key | Notes |
|---|---|---|---|---|
| **4** | Amounts not deductible u/s 58 | number | `AmtNotDeductibleUs58` | added back (optional) |
| **5** | Profits chargeable to tax u/s 59 | number | `ProfitChargTaxUs59` | recovery earlier allowed (optional) |

---

## 6 · Items 6 and 7 — the net at normal rates

| Item | Sheet label | Working / schema | Notes |
|---|---|---|---|
| **6** | Net Income from other sources chargeable at normal applicable rates [1(after reducing income related to DTAA portion)-3+4+5 (If negative take the figure to 4i of schedule CYLA)] | `BalanceNoRaceHorse`; `L81 = os.GrossIncomeChargeableToTax − OS.DTAA6 − os.TotDeductions + os.Amountus58 + os.Profitus59` (rule 471) | *if negative → **4i of Schedule CYLA*** (rule 518 feeds item 6 to CYLA 1xiii) |
| **7** | Income from other sources (other than from owning & maintaining race horses) (2+6) (enter 6 as nil, if negative) | `TotOthSrcNoRaceHorse`; `L82 = MAX(0, IF(os.BalanceNoRaceHorse>0, SUM(2, 6), 2))` (rule 466) | 2 + 6, taking 6 as nil if negative |

The "6 as nil if negative" rule stops an other-sources loss from eating special-rate
income inside the schedule — the loss routes out to CYLA (row 81 label; rule 525: a
normal OS loss is set off first against race-horse profit and OS-DTAA-special income).

---

## 7 · Item 8 — Owning and maintaining race horses

A separate five-line working (schema group `IncFromOwnHorse`), because its loss is
ring-fenced. **8e = 8a − 8b + 8c + 8d** (rule 467; `L88`).

| Item | Sheet label | Type | Schema key | Notes |
|---|---|---|---|---|
| **8a** | Receipts | number | `Receipts` | |
| **8b** | Deductions under section 57 in relation to 8a only | number | `DeductSec57` | |
| **8c** | Amounts not deductible u/s 58 | number | `AmtNotDeductibleUs58` | optional |
| **8d** | Profits chargeable to tax u/s 59 | number | `ProfitChargTaxUs59` | optional |
| **8e** | Balance (8a - 8b + 8c + 8d). (if negative take the figure to 11xvii of Schedule CFL) | computed | `BalanceOwnRaceHorse` | *if negative → carry to CFL* |

> **Source inconsistency (flag):** the sheet's 8e label says the loss goes to
> **"11xvii of Schedule CFL"**; validation rule 561 says *"Current year loss from
> owning & maintaining race horses at Sl. No. **11xix** in schedule CFL should be equal
> to sl. No 8e of Sch OS"*. The two disagree on the CFL row (11xvii vs 11xix). Booked
> as a cross-feed to CFL with the discrepancy flagged; the CFL book/section owner must
> reconcile. Rule 519 additionally feeds 8e to CYLA 1xiv. A race-horse loss carries
> forward on its own line for four years, against race-horse income only.

---

## 8 · Item 9 — Income under the head

**9 = 7 + 8e, taking 8e as nil if negative** (rule 468; `L89 = MAX(0, SUM(
os.TotOthSrcNoRaceHorse, MAX(0, os.BalanceOwnRaceHorse)))`). Schema key:
`IncChargeableFrmOthSrc`. This is the figure that goes to Part B-TI.

| Item | Sheet label | Schema key |
|---|---|---|
| **9** | Income under the head "Income from other sources" (7+ 8e) (take 8e as nil if negative) | `IncChargeableFrmOthSrc` |

---

## 9 · Item 10 — Information about accrual/receipt of income (the quarterly break-up)

Row 90: *"Information about accrual/receipt of income from Other Sources."* A matrix
(row 91 headers): Sl No · Other Source Income · five date columns — **Upto 15/6 (i)** ·
From 16/6 to 15/9 (ii) · From 16/9 to 15/12 (iii) · From 16/12 to 15/3 (iv) · From 16/3
to 31/3 (v). Ten **live** rows, two hidden. Each live row is a schema block with a
`DateRange` of five integer fields: `Upto15Of6`, `Up16Of6To15Of9`, `Up16Of9To15Of12`,
`Up16Of12To15Of3`, `Up16Of3To31Of3` (all required). Every cell is typeable.

| Row | Sheet label | Schema block | Tie-back rule |
|---|---|---|---|
| 1 | Winnings from lotteries, crossword puzzles, races, games, gambling, betting etc. referred to in section 2(24)(ix) | `IncFrmLottery` | = 2ai (rule 476) |
| 2 | Income by way of winnings from Online games chargeable u/s 115BBJ | `IncFrmOnGames` | = 2aii (rule 477) |
| 3(a) | Dividend Income referred in 1a(i) | `DividendIncUs115BBDA` | = 1a(i) − DTAA − adj 57(1) exp (rule 475) |
| 3(b) | Dividend Income referred in 1a(iii) | `DividendIncUs115BBDAaiii` | = 1a(iii) − DTAA of 1a(iii) subject to TRC (rule 499) |
| 4 | Dividend Income u/s 115A(1)(a)(i) other than first proviso to section 115A(1)(a)(A) @ 20% ( Including PTI Income) | `DividendIncUs115A1ai` | = dividend selected at 2c and 2d (rule 479) |
| 5 | Dividend income under proviso to sec 115A(1)(a)(A) @10% (Including PTI Income) | `DividendIncUs115A1aA` | IFSC-unit proviso dividend (rule 478) |
| 6 | Dividend Income u/s 115AC @ 10% (Including PTI Income) | `DividendIncUs115AC` | = 2c and 2d (rule 490) |
| 7 | Dividend Income (other than units referred to in section 115AB) received by a FII u/s 115AD(1)(i) @ 20% (Including PTI Income) | `DividendIncUs115AD1iDiv` | FII @20% (rule 491) |
| 8 | Dividend Income (other than units referred to in section 115AB) received by a specified fund u/s 115AD(1)(i) @ 10% (Including PTI Income) | `DividendIncUs115AD1IBd` | specified fund @10% (rule 492) |
| 9 | Dividend income chargeable at DTAA rates | `DividendDTAA` | DTAA dividend |

Each block's five columns: **Upto15Of6 · Up16Of6To15Of9 · Up16Of9To15Of12 ·
Up16Of12To15Of3 · Up16Of3To31Of3.**

> **ITR-6's quarterly rows differ from ITR-2's.** ITR-6 has **two** 115AD(1)(i)
> dividend rows — a FII @20% (`DividendIncUs115AD1iDiv`) and a specified-fund @10%
> (`DividendIncUs115AD1IBd`) — and has **no** `DividendIncUs115ACA` (resident GDR) row
> and **no** `NOT89A` row (both of which ITR-2 carries), consistent with a company that
> has no 89A retirement-account income.

**Hidden quarterly rows (not built):**

| Sheet row | Label | Why hidden |
|---|---|---|
| `r99H` | Dividend Income u/s 115BBD @ 15% (Including PTI Income) | hidden in the utility — 115BBD (Indian company's dividend from a specified foreign company) sunset; no schema key |
| `r102H` | Dividend received from a unit in an International Financial Services Centre, as referred to in sub-section (1A) of section 80LA chargeable under proviso to section 115A(1)(a)(A) @ 10% (Including PTI Income) | hidden — folded into row 5 (`DividendIncUs115A1aA`); no separate schema key |

---

## 10 · What repeats and what does not

| Where | Repeatable? |
|---|---|
| 1e — free "any other income" rows (`OthersIncDtls`) | **yes**, unlimited |
| 1e — business-trust 56(2)(xii) | fixed, one line |
| 2c — any other special-rate income (`OthersGrossDtls`) | **yes**, addable (9 shipped rows on sheet) |
| 2d — PTI special-rate (`PTIOthersGrossDtls`) | **yes**, addable (3 shipped rows) |
| 2e — DTAA claims (`NRIDTAADtlsSchOS`) | **yes**, 4 shipped, addable — ten fields per row |
| Everything else in 1, 2, 3, 4, 5, 8 | **one figure each** |
| Item 10 — quarterly matrix | fixed rows, five cells each |

---

## 11 · What is mandatory (from the schema `required` lists)

**On `IncOthThanOwnRaceHorse`** (all required): `GrossIncChrgblTaxAtAppRate`,
`DividendGross`, `DividendOthThan22e`, `Dividend22e`, `Dividend22f`, `InterestGross`,
`IntrstFrmSavingBank`, `IntrstFrmTermDeposit`, `IntrstFrmIncmTaxRefund`,
`NatofPassThrghIncome`, `IntrstFrmOthers`, `RentFromMachPlantBldgs`, `Tot562x`,
`Aggrtvaluewithoutcons562x`, `Immovpropwithoutcons562x`, `Immovpropinadeqcons562x`,
`Anyotherpropwithoutcons562x`, `Anyotherpropinadeqcons562x`, `AnyOtherIncome`,
`IncChargeableSpecialRates`, `LtryPzzlChrgblUs115BB`, `IncChrgblUs115BBE`,
`CashCreditsUs68`, `UnExplndInvstmntsUs69`, `UnExplndMoneyUs69A`,
`UnDsclsdInvstmntsUs69B`, `UnExplndExpndtrUs69C`, `AmtBrwdRepaidOnHundiUs69D`,
`OthersGross`, `PassThrIncOSChrgblSplRate`, `TotalAmtTaxUsDTAASchOs` (under
`IncChargblSplRateOS`), `Depreciation` and `TotDeductions` (under `Deductions`),
`BalanceNoRaceHorse`; and on the array rows: `OthNatOfInc`, `OthAmount`
(OthersIncDtls); `SourceDescription`, `SourceAmount` (OthersGrossDtls);
`SourceDescription` (PTIOthersGrossDtls); and on `NRIDTAADtlsSchOS[]` — `DTAAamt`,
`NatureOfIncome`, `CountryName`, `CountryCodeExcludingIndia`, `DTAAarticle`,
`RateAsPerTreaty`, `SecITAct`, `RateAsPerITAct`.

**On `ScheduleOS` root:** `TotOthSrcNoRaceHorse`; `Receipts`, `DeductSec57`,
`BalanceOwnRaceHorse` (under `IncFromOwnHorse`); `IncChargeableFrmOthSrc`; and every
`DateRange` leaf (`Upto15Of6`, `Up16Of6To15Of9`, `Up16Of9To15Of12`,
`Up16Of12To15Of3`, `Up16Of3To31Of3`) of all ten quarterly blocks — `IncFrmLottery`,
`IncFrmOnGames`, `DividendIncUs115BBDA`, `DividendIncUs115BBDAaiii`,
`DividendIncUs115A1ai`, `DividendIncUs115A1aA`, `DividendIncUs115AC`,
`DividendIncUs115AD1iDiv`, `DividendIncUs115AD1IBd`, `DividendDTAA`.

**Written only when carrying a value (schema-optional):** `SumRecdPrYrBusTRU562xii`,
`IncChrgblUs115BBJ`, `SourceAmount` (PTIOthersGrossDtls), `TaxRescertifiedFlag` &
`ApplicableRate` (NRIDTAADtlsSchOS), `Expenses`, `UsrIntExp57`, `IntExp57`,
`AmtNotDeductibleUs58`, `ProfitChargTaxUs59` (both the OS and the race-horse copies).

---

## 12 · Hidden rows — listed, not built

| Sheet rows | Content | Reason (not built) |
|---|---|---|
| `r39H`–`r43H` | 2c *Accumulated balance of recognised provident fund taxable u/s 111* — SL.NO./Assessment Year/Income Benefit/Tax Benefit table with a Total (`J39 = SUM(OS.TotIncBenefit)`) | Hidden in the utility; no `ScheduleOS` schema key. A company has no recognised-PF accumulated balance under 111. Its AY dropdown (Appendix B) and helper cells are read but excluded. |
| `r99H` | Quarterly *Dividend Income u/s 115BBD @ 15%* | Hidden; 115BBD concession sunset; no schema key |
| `r102H` | Quarterly *Dividend from an IFSC unit u/s 80LA(1A) under proviso to 115A(1)(a)(A) @ 10%* | Hidden; folded into `DividendIncUs115A1aA`; no separate schema key |

Nothing else on the sheet is hidden. All other rows above are live.

---

## 13 · Cross-sheet feeds

**Out of Schedule OS:**
- Item 6 (`BalanceNoRaceHorse`, if a loss) → **Schedule CYLA 4i / 1xiii** (sheet row 81; rules 518, 525).
- Item 8e (`BalanceOwnRaceHorse`) → **Schedule CYLA 1xiv** (rule 519) and, if a loss, → **Schedule CFL** (sheet: 11xvii; rule 561: 11xix — *flagged inconsistency*).
- Item 2e (OS DTAA special) → **Schedule CYLA** OS-DTAA line (rule 524) and **Schedule SI** (rule 616).
- Item 2a → **Schedule SI** 115BB / 115BBJ (rules 612, 624, after reducing DTAA).
- Item 2b → **Schedule SI** 115BBE (rule 613).
- Item 2c / 2d dropdown amounts → **Schedule SI** matching special-rate lines (rules 630, 631).
- Item 9 (`IncChargeableFrmOthSrc`) → **Part B-TI** (income under the head other sources).

**Into Schedule OS:**
- Dividend income reduced in **Schedule BP** A3c / P&L 14(iii) must be offered here (rules 200, 201).
- **Schedule CG** buy-back loss (A(A)/B(A)) requires 1a(iii) to be filled (rules 433, 500).
- **Part A-General** "Whether FPI?" must be Yes to offer 115AD(1)(i) income here (rule 39).
- Non-resident restrictions: cannot offer 115BBF (rules 231, 462, 498).

---

## 14 · What ITR-6's Other Sources has that ITR-2's does not — and what it drops

| | ITR-2 | ITR-6 |
|---|---|---|
| Interest lines | nine (incl. 4 PF proviso lines) | **five** (bi–bv); **no PF proviso lines** |
| 1e any-other-income | family pension + 89A US/UK/Canada + prior-year 89A + 56(2)(xii) + 56(2)(xiii) + free rows | **only 56(2)(xii) business trust + free rows** |
| Item 5a (89A relief reduction) | present | **absent** |
| Accumulated-PF special-rate (u/s 111) | live at 2c | **hidden, not built** |
| Special-rate lettering | 2c=accPF, 2d=other, 2e=PTI, **2f=DTAA** | **2c=other, 2d=PTI, 2e=DTAA** (accPF hidden shifts letters up) |
| Quarterly rows | 115ACA + NOT89A | **two 115AD(1)(i) rows (FII @20% + specified fund @10%); no 115ACA, no NOT89A** |
| Item-6 loss routes to | CYLA 3(i) | **CYLA 4i** |

---

## 15 · What this means for the build

1. **Item 1 is a figures block** — 1a (3 sub-lines), 1b (**5** sub-lines), 1c (one),
   1d (5 sub-lines), 1e (fixed 56(2)(xii) row + free table). Totals computed.
2. **Item 2 is a figures block with three tables** — 2a(i), 2a(ii), 2b's six lines as
   figures; 2c (`OthersGrossDtls`), 2d (`PTIOthersGrossDtls`), 2e (`NRIDTAADtlsSchOS`,
   non-resident only). Do **not** build the hidden accumulated-PF sub-schedule.
3. **Item 3 enforces its conditions live** — depreciation ≤ 1c; interest expenditure
   only if 1a(i)/1a(ii), eligible amount capped at 20% of (1a(i)+1a(ii)).
4. **Items 6–9 are computed**, with the two nil-if-negative rules and the two routings
   — a normal-rate loss to CYLA 4i, a race-horse loss to CFL.
5. **Item 8 is its own card**, off by default.
6. **Item 10 is an editable 10-row × 5-column matrix**, every cell typeable, each row
   checked against its source figure by its tie-back rule.
7. **The buy-back dividend at 1a(iii)** unlocks A(A)/B(A) in Schedule CG; the check
   must say so when a buy-back loss is claimed without it (rules 433, 500).
8. **DTAA field naming:** ITR-6 uses `SecITAct` (not ITR-2's `ItemNoincl`) for the
   "Section of I.T. Act" column, and `NatureOfIncome` for "Item No.".

---

## Appendix A — Country dropdown (`Country_Less_India`, 250 codes, India excluded)

Column (4) "Country name and code" of the 2e DTAA table (`F67:F70`). Value format
`code-NAME`:

(Select), 93-AFGHANISTAN, 1001-ALAND ISLANDS, 355-ALBANIA, 213-ALGERIA, 684-AMERICAN SAMOA, 376-ANDORRA, 244-ANGOLA, 1264-ANGUILLA, 1010-ANTARCTICA, 1268-ANTIGUA AND BARBUDA, 54-ARGENTINA, 374-ARMENIA, 297-ARUBA, 61-AUSTRALIA, 43-AUSTRIA, 994-AZERBAIJAN, 1242-BAHAMAS, 973-BAHRAIN, 880-BANGLADESH, 1246-BARBADOS, 375-BELARUS, 32-BELGIUM, 501-BELIZE, 229-BENIN, 1441-BERMUDA, 975-BHUTAN, 591-BOLIVIA (PLURINATIONAL STATE OF), 1002-BONAIRE, SINT EUSTATIUS AND SABA, 387-BOSNIA AND HERZEGOVINA, 267-BOTSWANA, 1003-BOUVET ISLAND, 55-BRAZIL, 1014-BRITISH INDIAN OCEAN TERRITORY, 673-BRUNEI DARUSSALAM, 359-BULGARIA, 226-BURKINA FASO, 257-BURUNDI, 238-CABO VERDE, 855-CAMBODIA, 237-CAMEROON, 1-CANADA, 1345-CAYMAN ISLANDS, 236-CENTRAL AFRICAN REPUBLIC, 235-CHAD, 56-CHILE, 86-CHINA, 9-CHRISTMAS ISLAND, 672-COCOS (KEELING) ISLANDS, 57-COLOMBIA, 270-COMOROS, 242-CONGO, 243-CONGO (DEMOCRATIC REPUBLIC OF THE), 682-COOK ISLANDS, 506-COSTA RICA, 225-COTE DIVOIRE, 385-CROATIA, 53-CUBA, 1015-CURACAO, 357-CYPRUS, 420-CZECHIA, 45-DENMARK, 253-DJIBOUTI, 1767-DOMINICA, 1809-DOMINICAN REPUBLIC, 593-ECUADOR, 20-EGYPT, 503-EL SALVADOR, 240-EQUATORIAL GUINEA, 291-ERITREA, 372-ESTONIA, 251-ETHIOPIA, 500-FALKLAND ISLANDS (MALVINAS), 298-FAROE ISLANDS, 679-FIJI, 358-FINLAND, 33-FRANCE, 594-FRENCH GUIANA, 689-FRENCH POLYNESIA, 1004-FRENCH SOUTHERN TERRITORIES, 241-GABON, 220-GAMBIA, 995-GEORGIA, 49-GERMANY, 233-GHANA, 350-GIBRALTAR, 30-GREECE, 299-GREENLAND, 1473-GRENADA, 590-GUADELOUPE, 1671-GUAM, 502-GUATEMALA, 1481-GUERNSEY, 224-GUINEA, 245-GUINEA-BISSAU, 592-GUYANA, 509-HAITI, 1005-HEARD ISLAND AND MCDONALD ISLANDS, 6-HOLY SEE, 504-HONDURAS, 852-HONG KONG, 36-HUNGARY, 354-ICELAND, 62-INDONESIA, 98-IRAN (ISLAMIC REPUBLIC OF), 964-IRAQ, 353-IRELAND, 1624-ISLE OF MAN, 972-ISRAEL, 5-ITALY, 1876-JAMAICA, 81-JAPAN, 1534-JERSEY, 962-JORDAN, 7-KAZAKHSTAN, 254-KENYA, 686-KIRIBATI, 850-KOREA (DEMOCRATIC PEOPLES REPUBLIC OF), 82-KOREA (REPUBLIC OF), 965-KUWAIT, 996-KYRGYZSTAN, 856-LAO PEOPLES DEMOCRATIC REPUBLIC, 371-LATVIA, 961-LEBANON, 266-LESOTHO, 231-LIBERIA, 218-LIBYA, 423-LIECHTENSTEIN, 370-LITHUANIA, 352-LUXEMBOURG, 853-MACAO, 389-MACEDONIA (THE FORMER YUGOSLAV REPUBLIC OF), 261-MADAGASCAR, 265-MALAWI, 60-MALAYSIA, 960-MALDIVES, 223-MALI, 356-MALTA, 692-MARSHALL ISLANDS, 596-MARTINIQUE, 222-MAURITANIA, 230-MAURITIUS, 269-MAYOTTE, 52-MEXICO, 691-MICRONESIA (FEDERATED STATES OF), 373-MOLDOVA (REPUBLIC OF), 377-MONACO, 976-MONGOLIA, 382-MONTENEGRO, 1664-MONTSERRAT, 212-MOROCCO, 258-MOZAMBIQUE, 95-MYANMAR, 264-NAMIBIA, 674-NAURU, 977-NEPAL, 31-NETHERLANDS, 687-NEW CALEDONIA, 64-NEW ZEALAND, 505-NICARAGUA, 227-NIGER, 234-NIGERIA, 683-NIUE, 15-NORFOLK ISLAND, 1670-NORTHERN MARIANA ISLANDS, 47-NORWAY, 968-OMAN, 92-PAKISTAN, 680-PALAU, 970-PALESTINE, STATE OF, 507-PANAMA, 675-PAPUA NEW GUINEA, 595-PARAGUAY, 51-PERU, 63-PHILIPPINES, 1011-PITCAIRN, 48-POLAND, 14-PORTUGAL, 1787-PUERTO RICO, 974-QATAR, 262-REUNION, 40-ROMANIA, 8-RUSSIAN FEDERATION, 250-RWANDA, 1006-SAINT BARTHELEMY, 290-SAINT HELENA, ASCENSION AND TRISTAN DA CUNHA, 1869-SAINT KITTS AND NEVIS, 1758-SAINT LUCIA, 1007-SAINT MARTIN (FRENCH PART), 508-SAINT PIERRE AND MIQUELON, 1784-SAINT VINCENT AND THE GRENADINES, 685-SAMOA, 378-SAN MARINO, 239-SAO TOME AND PRINCIPE, 966-SAUDI ARABIA, 221-SENEGAL, 381-SERBIA, 248-SEYCHELLES, 232-SIERRA LEONE, 65-SINGAPORE, 1721-SINT MAARTEN (DUTCH PART), 421-SLOVAKIA, 386-SLOVENIA, 677-SOLOMON ISLANDS, 252-SOMALIA, 28-SOUTH AFRICA, 1008-SOUTH GEORGIA AND THE SOUTH SANDWICH ISLANDS, 211-SOUTH SUDAN, 35-SPAIN, 94-SRI LANKA, 249-SUDAN, 597-SURINAME, 1012-SVALBARD AND JAN MAYEN, 268-SWAZILAND, 46-SWEDEN, 41-SWITZERLAND, 963-SYRIAN ARAB REPUBLIC, 886-TAIWAN, 992-TAJIKISTAN, 255-TANZANIA, UNITED REPUBLIC OF, 66-THAILAND, 670-TIMOR-LESTE(EAST TIMOR), 228-TOGO, 690-TOKELAU, 676-TONGA, 1868-TRINIDAD AND TOBAGO, 216-TUNISIA, 90-TURKEY, 993-TURKMENISTAN, 1649-TURKS AND CAICOS ISLANDS, 688-TUVALU, 256-UGANDA, 380-UKRAINE, 971-UNITED ARAB EMIRATES, 44-UNITED KINGDOM OF GREAT BRITAIN AND NORTHERN IRELAND, 2-UNITED STATES OF AMERICA, 1009-UNITED STATES MINOR OUTLYING ISLANDS, 598-URUGUAY, 998-UZBEKISTAN, 678-VANUATU, 58-VENEZUELA (BOLIVARIAN REPUBLIC OF), 84-VIET NAM, 1284-VIRGIN ISLANDS (BRITISH), 1340-VIRGIN ISLANDS (U.S.), 681-WALLIS AND FUTUNA, 1013-WESTERN SAHARA, 967-YEMEN, 260-ZAMBIA, 263-ZIMBABWE, 9999-OTHERS.

---

## Appendix B — Special-rate & PTI section-code dropdowns (2c and 2d), and the hidden AY list

### Whether TRC obtained? (`I67:I70`, 2e col 7): (Select), Yes, No.

### Hidden accumulated-PF Assessment-Year list (`G41:G42`, rows 39–43, not built): (Select), 2014-15, 2015-16, 2016-17, 2017-18, 2018-19.

### 2c "Any other income chargeable at special rate" — Nature dropdown, chosen by residential status

**`SI_OSSECTIONCODES_RES` (resident, 9):**
- (Select)
- 5AD1i-Income (other than dividend) received by an FII in respect of securities (other than units referred to in section115AB) [S.115AD(1)(i)]
- 5AD1iP-Income received by an FII in respect of bonds or government securities referred to in section 194LD [S.115AD(1)(i)]
- 5BBF-Income from patent
- 5BBG-Income by way of Transfer of carbon credits[S.115BBG]
- 5AD1iDiv- Income (being dividend) received by an FII in respect of securities (other than units referred to in section 115AB) - chargeable u/s 115AD(1)(i)
- 5A1aA-Dividend received from IFSC unit as referred to in sub-section (1A) of section 80LA
- 5AD1IBd- Income (being dividend) received by a specified fund in respect of securities (other than units referred to in section 115AB) - chargeable u/s 115AD(1)(i)
- 5AD1IB- Income (other than dividend) received by a specified fund in respect of securities (other than units referred to in section 115AB) - chargeable u/s 115AD(1)(i)

**`SI_OSSECTIONCODES_RES_FC` (resident foreign-company, 6):** (Select); 5AD1i…; 5AD1iP…; 5BBF-Income from patent; 5BBG-Income by way of Transfer of carbon credits[S.115BBG]; 5AD1iDiv-… (same wordings as above).

**`SI_OSSECTIONCODES_NRI` (non-resident, 23):**
- (Select)
- 5A1ai- Dividends received by foreign company chargeable u/s 115A(1)(a)(i) other than first proviso to section 115A(1)(a)(A)
- 5A1aA-Dividend received from IFSC unit as referred to in sub-section (1A) of section 80LA
- 5A1aii-Interest received from govt/Indian Concerns received in Foreign Currency
- 5A1aiia-Interest received by non-resident from infrastructure debt fund [S.115A(1)(a)(iia)]
- 5A1aiiaa-Income received by non-resident as referred in section 194LC [S.115A(1)(a)(iiaa)]
- 5A1aiiab-Income received by non-resident as referred in section 194LD [S.115A(1)(a)(iiab)]
- 5A1aiiac-Income received by non-resident as referred in section 194LBA [S.115A(1)(a)(iiac)]
- 5A1aiii-Income from units purchased in foreign currency in the case of non-residents [S.115A(1)(a)(iii)]
- FA-Income from royalty where agreement entered between 31.3.1961 to 31.3.1976 and income from fees for technical services where agreement entered between 29.2.1964 and 31.3.1976 and agreement is approved by the Central Government. : [Para EII of Part I of first schedule of Finance Act]
- 5A1b-Income from royalty or fees for technical services received from Government or Indian concern - chargeable u/s 115A(1)(b) : [S.115A(1)(b)]
- 5AB1a-Income received in respect of units purchased in foreign currency by an off-shore fund
- 5AC1a-Income by way of interest from bonds purchased in foreign currency by non-residents
- 5AD1i-Income (other than dividend) received by an FII in respect of securities (other than units referred to in section115AB) [S.115AD(1)(i)]
- 5AD1iP-Income received by an FII in respect of bonds or government securities referred to in section 194LD [S.115AD(1)(i)]
- 5BBA-Income received by non-resident sportsmen or sports associations or entertainer [S.115BBA]
- 5BBG-Income by way of Transfer of carbon credits[S.115BBG]
- 5A1aiiaaP- Income received by non-resident as referred in proviso to section 194LC(1)
- 5AC1b-Income by way of dividend from GDRs purchased in foreign currency by non-residents - chargeable u/s 115AC
- 5AD1iDiv- Income (being dividend) received by an FII in respect of securities (other than units referred to in section 115AB) - chargeable u/s 115AD(1)(i)
- 5AD1IBd- Income (being dividend) received by a specified fund in respect of securities (other than units referred to in section 115AB) - chargeable u/s 115AD(1)(i)
- 5AD1IB- Income (other than dividend) received by a specified fund in respect of securities (other than units referred to in section 115AB) - chargeable u/s 115AD(1)(i)
- 115A(1)(a)(iiaa)- Income received by non-resident as referred in second proviso to section 194LC(1)

**`SI_OSSECTIONCODES_NRI_FC` (non-resident foreign-company, 23):** the same 23 codes as `SI_OSSECTIONCODES_NRI` above (wordings identical bar minor "194LC(1)" punctuation on the 194LC line and 5A1ai without the leading space), including 5A1ai, 5A1aii, 5A1aiia, 5A1aiiaa, 5A1aiiab, 5A1aiiac, 5A1aiii, FA, 5A1b, 5AB1a, 5AC1a, 5AD1i, 5AD1iP, 5BBA, 5BBG, 5A1aiiaaP, 5AC1b, 5AD1iDiv, 5AD1IBd, 5AD1IB, 5A1aA, 115A(1)(a)(iiaa)- second proviso to 194LC(1).

### 2d "Pass through income at special rates" — PTI Nature dropdown, chosen by residential status

**`OS.PTIRes` (resident, 9):** (Select); PTI_5AD1i…; PTI_5AD1iP…; PTI_5BBF-Income from patent; PTI_5BBG-Income by way of Transfer of carbon credits [S.115BBG]; PTI_5AD1iDiv-…; PTI_5AD1IBd-…; PTI_5AD1IB-…; PTI_5A1aA- Dividend received from IFSC unit as referred to in sub-section (1A) of section 80LA.

**`OS.PTIResFC` (resident foreign-company, 6):** (Select); PTI_5AD1i…; PTI_5AD1iP…; PTI_5BBF-Income from patent; PTI_5BBG-Income by way of Transfer of carbon credits [S.115BBG]; PTI_5AD1iDiv-….

**`OS.PTINRI` (non-resident, 23):** (Select); PTI_5A1ai; PTI_5A1aii; PTI_5A1aiia; PTI_5A1aiiaa; PTI_5A1aiiab; PTI_5A1aiiac; PTI_5A1aiii; PTI_FA; PTI_5A1b; PTI_5AB1a; PTI_5AC1a; PTI_5AD1i; PTI_5AD1iP; PTI_5BBA; PTI_5BBG; PTI_5A1aiiaaP; PTI_5AC1b; PTI_5AD1iDiv; PTI_5AD1IBd; PTI_5AD1IB; PTI_5A1aA-PTI - Dividend received from IFSC unit as referred to in sub-section (1A) of section 80LA; PTI_115A(1)(a)(iiaa)- Income received by non-resident as referred in second proviso to section 194LC(1).

---

## Appendix C — the 2e DTAA table dropdowns

### "Item No." column (`E67:E70` → `NatureOfIncome`)

Utility list `OS.2fITEMNo` (10, incl. Select): (Select), 1ai, 1aiii, 1b, 1c, 1d, 2ai,
2aii, 2c, 2d. When interest (1b) is negative the utility uses `OS.2fITEMNonegative`
(drops 1b): (Select), 1ai, 1aiii, 1c, 1d, 2ai, 2aii, 2c, 2d. Schema enum
`NatureOfIncome` (9): 1ai, 1aiii, 1b, 1c, 1d, 2ai, 2aii, 2c, 2d.

### "Section of I.T. Act" column (`J67:J70` → `SecITAct`)

The utility validation is residential-status driven (`OS_DTTA_Drpdown` for residents,
48 items; `OS_DTTA_Drpdown_NRI` for non-residents, 28 items). The **schema enum
`SecITAct`** is the filed set (54 codes, code → description):

56i (56(2)(i)- Dividends), 56 (56(2)- Interest), 56i_f (56(2)(i)- Dividends u/s
2(22)(f)), 562iii (56(2)(iii)-Rental income from machinery, plants, buildings etc.),
562x (56(2)(x) - Income under section 56(2)(x)), 5A1ai, 5A1aA, 5A1aii, 5A1aiia,
5A1aiiaa, 5A1aiiab, 5A1aiiac, 5A1aiii, FA, 5A1bA, 5AB1a, 5AC1ab, 5AC1abD, 5AD1i,
5AD1iP, 5BBA, 5BBG (Tax on Transfer of carbon credits), 5BB (Winnings from lotteries,
crossword puzzles etc), 5BBJ (Income by way of winnings from Online games chargeable),
5BBF (Tax on income from patent), 5A1aiiaaP (proviso to 194LC(1)), 5A1aiiaa2P (second
proviso to 194LC(1)), 5AD1iDiv, 5AD1IBd, 5AD1IB, and the `PTI_` twin of each special-
rate code: PTI_5A1ai, PTI_5A1aA, PTI_5A1aii, PTI_5A1aiia, PTI_5A1aiiaa, PTI_5A1aiiab,
PTI_5A1aiiac, PTI_5A1aiii, PTI_FA, PTI_5A1bA, PTI_5AB1a, PTI_5AC1ab, PTI_5AC1abD,
PTI_5AD1i, PTI_5AD1iP, PTI_5BBA, PTI_5BBG, PTI_5BB, PTI_5BBF, PTI_5A1aiiaaP,
PTI_5A1aiiaa2P, PTI_5AD1iDiv, PTI_5AD1IBd, PTI_5AD1IB.

The resident utility list `OS_DTTA_Drpdown` additionally spells the 56(2) heads as
`56(2)(i)-Dividends`, `56(2)-Interest`, `56(2)(iii)-Rental income from machinery,
plants, buildings etc.,`, `56(2)(x)-Income under section 56(2)(x).`, and `5BB-Winnings
from lotteries, crossword puzzles etc.[S.115BB]`, `5BBJ-Income by way of winnings from
Online games chargeable u/s 115BBJ`; the non-resident list `OS_DTTA_Drpdown_NRI` adds
`5BBD-Tax on dividend received by an Indian company from specified foreign
company[S.115BBD]` and its `PTI_5BBD` twin.

The fixed business-trust row's helper dropdown (`H24`, source `IF(IsForeignResident,
OS_DTTA_Drpdown_NRI, …)`) reuses these same section-code lists.

---

## Appendix D — source artefacts read in the OS sheet (stray helper cells)

The utility file carries build-residue comment/marker cells in the OS sheet's helper
columns (not part of the return, read per note 9 "read the whole header"): a date-stamp
`Sadineni_10_10_2025` (Q2); reviewer markers `Sadineni AY 2025-26` (U21, R95, R97) and
`Malli removed @ on 30/07/2026` (U36); and a stray backtick in N69. These are noted,
not built — no schema key, no screen field. The large helper columns S–AD hold the
utility's own SUMIF/`IF(MID(sheet1.ResidentialStatus1,…))` cross-total formulas (the
DTAA/TRC apportionment method) summarised in §3 and §9 above.
