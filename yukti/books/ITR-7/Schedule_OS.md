# The book of Schedule OS — Income from Other Sources · ITR-7, A.Y. 2026-27

Read row by row from the utility's **Schedule OS** sheet and confirmed against the
CBDT ITR-7 schema block **ScheduleOS**. This is one continuous working: gross income
at normal rates, plus income at special rates, minus section-57 deductions,
plus/minus the 58/59 adjustments, landing on the figure that goes to Part B-TI.
Nothing here is invented; the appendices list every schema leaf, every live row
verbatim, and every dropdown value.

This is a **trust / institution** return (ITR-7). Its Schedule OS carries one line
the company form does not — item 1e's *"Income due to disallowance of exemption
under clauses of section 10"* (`IncDisallwnExmpUs10`, required) — and uses the field
names `ItemNoincl` (Section of I.T. Act) and `TotalOSGrossChargblSplRate` in the DTAA
table. Otherwise it is the same nine-item shape plus a quarterly matrix.

---

## 1 · The shape — nine items and a quarterly table

| Item | What it is | Kind | Sheet row(s) |
|---|---|---|---|
| **1** | Gross income chargeable to tax at normal applicable rates (1a+1b+1c+1d+1e) | five heads, most with sub-lines | 4–25 |
| **2** | Income chargeable at special rates (2ai+2aii+2b+2c+2d+2e) | six heads | 30–69 |
| **3** | Deductions under section 57 (3a, 3b, 3c, 3d) | four lines with conditions | 71–77 |
| **4** | Amounts not deductible u/s 58 | one figure | 78 |
| **5** | Profits chargeable to tax u/s 59 | one figure | 79 |
| **6** | Net income at normal rates — 1 (after DTAA) − 3 + 4 + 5 | computed; a loss goes to CYLA | 80 |
| **7** | Income from other sources, other than race horses (2 + 6) | computed; 6 as nil if negative | 81 |
| **8** | Income from owning & maintaining race horses (8a–8e) | a separate five-line working | 82–87 |
| **9** | Income under the head (7 + 8e) | computed; 8e as nil if negative | 88 |
| **10** | Information about accrual/receipt of income | a quarterly matrix, 9 live rows | 89–101 |

The whole schedule maps to schema block **`ScheduleOS`**, whose top-level shape is
`IncOthThanOwnRaceHorse{…}` (items 1–7), `TotOthSrcNoRaceHorse` (item 7),
`IncFromOwnHorse{…}` (item 8), `IncChargeableFrmOthSrc` (item 9), and the nine
quarterly break-up blocks (item 10).

---

## 2 · Item 1 — Gross income chargeable at normal applicable rates

**1 = 1a + 1b + 1c + 1d + 1e.** Schema total key: `GrossIncChrgblTaxAtAppRate`.

### 1a · Dividends, Gross (ai + aii + aiii)

| Item | Sheet label | Type | Schema key |
|---|---|---|---|
| **1a** | Dividends Gross (ai+aii+aiii) | computed | `DividendGross` |
| **1a(i)** | Dividend income [other than (ii) and (iii)] | number | `DividendOthThan22e` |
| **1a(ii)** | Dividend income u/s 2(22)(e) | number | `Dividend22e` |
| **1a(iii)** | Dividend income u/s 2(22)(f) | number | `Dividend22f` |

### 1b · Interest, Gross (bi + bii + biii + biv + bv)

Five interest sub-lines. Schema total key: `InterestGross`.

| Item | Sheet label | Type | Schema key |
|---|---|---|---|
| **1b** | Interest, Gross (bi + bii + biii + biv + bv) | computed | `InterestGross` |
| **1b(i)** | From Savings Bank | number | `IntrstFrmSavingBank` |
| **1b(ii)** | From Deposit (Bank/ Post Office/ Co-operative) | number | `IntrstFrmTermDeposit` |
| **1b(iii)** | From Income Tax refund | number | `IntrstFrmIncmTaxRefund` |
| **1b(iv)** | In the nature of Pass through income/Loss | number | `NatofPassThrghIncome` |
| **1b(v)** | others including interest from Companies, NBFCs & HFCs | number | `IntrstFrmOthers` |

### 1c · Rental income from machinery, plants, buildings

| Item | Sheet label | Type | Schema key |
|---|---|---|---|
| **1c** | Rental income from machinery, plants, buildings, etc., Gross | number | `RentFromMachPlantBldgs` |

*Unlocks the depreciation deduction at 3b.*

### 1d · Income referred to in section 56(2)(x)

**1d = 1di + 1dii + 1diii + 1div + 1dv.** Schema total key: `Tot562x`.

| Item | Sheet label | Type | Schema key |
|---|---|---|---|
| **1d** | Income of the nature referred to in section 56(2)(x) which is chargeable to tax (di + dii + diii + div + dv) | computed | `Tot562x` |
| **1d(i)** | Aggregate value of sum of money received without consideration | number | `Aggrtvaluewithoutcons562x` |
| **1d(ii)** | In case immovable property is received without consideration, stamp duty value of property | number | `Immovpropwithoutcons562x` |
| **1d(iii)** | In case immovable property is received for inadequate consideration, stamp duty value of property in excess of such consideration | number | `Immovpropinadeqcons562x` |
| **1d(iv)** | In case any other property is received without consideration, fair market value of property | number | `Anyotherpropwithoutcons562x` |
| **1d(v)** | In case any other property is received for inadequate consideration, fair market value of property in excess of such consideration | number | `Anyotherpropinadeqcons562x` |

### 1e · Any other income (please specify nature)

The ITR-7 1e block carries **two fixed rows** plus a free table:

| Item | Sheet label | Type | Schema key |
|---|---|---|---|
| **1e** | Any other income (please specify nature) | computed total | `AnyOtherIncome` |
| **1e — row 24** | Income due to disallowance of exemption under clauses of section 10 | number, **required** | `IncDisallwnExmpUs10` |
| **1e — row 25** | Any specified sum received by a unit holder from a business trust during the previous year chargeable u/s 56(2)(xii) | number | `SumRecdPrYrBusTRU562xii` |
| **1e — free table (rows 23…)** | Sl. No · Nature · Amount | repeatable | `OthersInc.OthersIncDtls[]` → `OthNatOfInc` (string), `OthAmount` (integer) |

The `IncDisallwnExmpUs10` line is ITR-7's own: where a trust loses an exemption under
a clause of section 10, the disallowed income is offered here.

---

## 3 · Item 2 — Income chargeable at special rates

**2 = 2ai + 2aii + 2b + 2c + 2d + 2e (related to Sl. No. 1).** Schema total key:
`IncChargeableSpecialRates`. *Nothing in item 3 may be deducted against 2a–2e.*

> **Hidden accumulated-PF sub-schedule.** The utility rows 40–47, *"Accumulated
> balance of recognised provident fund taxable u/s 111"* (a SL.NO./Assessment-Year/
> Income-Benefit/Tax-Benefit table), are **hidden** (`r40H`–`r47H`), carry **no schema
> key**, and are **not built**. Its Assessment-Year drop-down is reproduced in the
> appendix for completeness. Because it is hidden, the visible special-rate lettering
> runs ai, aii, b, **c, d, e**.

### 2a — winnings

| Item | Sheet label | Type | Schema key |
|---|---|---|---|
| **2a(i)** | Winnings from lotteries, crossword puzzles, races, card games etc. chargeable u/s 115BB | number | `LtryPzzlChrgblUs115BB` |
| **2a(ii)** | Winnings from online games chargeable u/s 115BBJ | number | `IncChrgblUs115BBJ` |

### 2b · Income chargeable u/s 115BBE

**2b = bi + bii + biii + biv + bv + bvi.** Schema total: `IncChrgblUs115BBE`.

| Item | Sheet label | Type | Schema key |
|---|---|---|---|
| **2b(i)** | Cash credits u/s 68 | number | `CashCreditsUs68` |
| **2b(ii)** | Unexplained investments u/s 69 | number | `UnExplndInvstmntsUs69` |
| **2b(iii)** | Unexplained money etc. u/s 69A | number | `UnExplndMoneyUs69A` |
| **2b(iv)** | Undisclosed investments etc. u/s 69B | number | `UnDsclsdInvstmntsUs69B` |
| **2b(v)** | Unexplained expenditure etc. u/s 69C | number | `UnExplndExpndtrUs69C` |
| **2b(vi)** | Amount borrowed or repaid on hundi u/s 69D | number | `AmtBrwdRepaidOnHundiUs69D` |

### 2c · Any other income chargeable at special rate

A **table**: Sl. No. · Nature (a residential-status-dependent section-code dropdown) ·
Amount. Rows addable. Schema total: `OthersGross`; rows: `OthersGrossDtls[]` →
`SourceDescription` (string, the section code), `SourceAmount` (integer). The Nature
dropdown (`H50:H53`, source `IF(sheet1.ResidentialStatus1="RES-Resident",
OS_Section_Normal_RES, OS_Section_Normal_NRI)`) is one of two lists chosen by
residential status; being `IF()`-driven it does not resolve to a flat gate list.

### 2d · Pass through income (PTI) at special rates

Same table shape as 2c, with the **PTI section-code** dropdown. Schema total:
`PassThrIncOSChrgblSplRate`; rows: `PTIOthersGrossDtls[]` → `SourceDescription`
(string, required), `SourceAmount` (integer). Dropdown `H57:H60`, source
`IF(sheet1.ResidentialStatus1="RES-Resident", OS_Section_PTI_RES, OS_Section_PTI_NRI)`.

### 2e · Amount claimed at DTAA rates — the DTAA table

*"Amount included in 1 and 2 above, which is claimed as chargeable at special rates
or not chargeable to tax in India as per DTAA"* (non-residents only). Schema total:
`IncChargblSplRateOS.TotalOSGrossChargblSplRate`; rows:
`IncChargblSplRateOS.NRIOsDTAA.NRIDTAADtlsSchOS[]`. Six rows shipped (rows 64–69),
addable.

| # | Sheet column (row 63) | Schema field | Req |
|---|---|---|---|
| 1 | Sl.No. | — | |
| 2 | Amount of income | `DTAAamt` | ★ |
| 3 | Item No. 1ai, 1aiii, 1b to 1d, 2a, 2c & 2d in which included | `NatureOfIncome` | ★ |
| 4 | Country name, code | `CountryName` ★ + `CountryCodeExcludingIndia` ★ | ★ |
| 5 | Article of DTAA | `DTAAarticle` | ★ |
| 6 | Rate as per Treaty (enter NIL, if not chargeable) | `RateAsPerTreaty` | ★ |
| 7 | Whether TRC obtained? | `TaxRescertifiedFlag` | |
| 8 | Section of I.T. Act | `ItemNoincl` | ★ |
| 9 | Rate as per I.T. Act | `RateAsPerITAct` | ★ |
| 10 | Applicable rate [lower of (6) or (9)] | `ApplicableRate` | (computed) |

★ = required on every row. The Item-No. dropdown (`I64:I69`) lists 1ai, 1a(iii), 1b,
1c, 1d, 2ai, 2aii, 2c, 2d; the Country dropdown (`J64:J69`) is the 250-code
`Country_Less_India` list (India excluded), format `NAME:code`; the TRC dropdown
(`M64:M69`) is (Select)/Yes/No; the Section-of-I.T.-Act dropdown (`N64:N69`) is
residential-status driven.

---

## 4 · Item 3 — Deductions under section 57

Row 71 header: *"Deductions under section 57:- (other than those relating to income
chargeable at special rate 2a, 2b, 2c, 2d & 2e)."* **3d = 3a + 3b + 3c.**

| Item | Sheet label | Type | Schema key (under `Deductions`) |
|---|---|---|---|
| **3a** | Expenses / Deductions (other than entered in c) | number | `Expenses` |
| **3b** | Depreciation (available only if income offered in 1c of "schedule OS") | number, **required** | `Depreciation` |
| **3c** | Interest expenditure u/s 57(1) (available only if income offered in 1a(i) and/or 1a(ii)) — Interest expenditure claimed -Entered Value | number | `UsrIntExp57` |
| **3c** | Eligible interest expenditure- Computed Value | computed | `IntExp57` |
| **3d** | Total | computed, **required** | `TotDeductions` |

Depreciation at 3b is **restricted to the 1c figure**; the eligible interest
expenditure at 3c is **capped at 20% of (1a(i) + 1a(ii))**.

---

## 5 · Items 4, 5 — the adjustments

| Item | Sheet label | Type | Schema key |
|---|---|---|---|
| **4** | Amounts not deductible u/s 58 | number | `AmtNotDeductibleUs58` |
| **5** | Profits chargeable to tax u/s 59 | number | `ProfitChargTaxUs59` |

---

## 6 · Items 6, 7 — the net at normal rates

| Item | Sheet label | Schema key |
|---|---|---|
| **6** | Net Income from other sources chargeable at normal applicable rates 1(after reducing income related to DTAA) − 3 + 4 + 5 (if negative take the figure to Schedule CYLA) | `BalanceNoRaceHorse` |
| **7** | Income from other sources (other than from owning race horses) (2+6) (enter 6 as nil if negative) | `TotOthSrcNoRaceHorse` |

The "6 as nil if negative" rule stops an other-sources loss from eating special-rate
income inside the schedule — the loss routes out to CYLA.

---

## 7 · Item 8 — Owning and maintaining race horses

A separate five-line working (schema group `IncFromOwnHorse`), because its loss is
ring-fenced. **8e = 8a − 8b + 8c + 8d.**

| Item | Sheet label | Type | Schema key |
|---|---|---|---|
| **8a** | Receipts | number | `Receipts` |
| **8b** | Deductions under section 57 in relation to receipts at 8a only | number | `DeductSec57` |
| **8c** | Amounts not deductible u/s 58 | number | `AmtNotDeductibleUs58` |
| **8d** | Profits chargeable to tax u/s 59 | number | `ProfitChargTaxUs59` |
| **8e** | Balance (8a − 8b + 8c + 8d) | computed | `BalanceOwnRaceHorse` |

A race-horse loss (8e negative) carries forward on its own line (to Schedule CFL),
against race-horse income only.

---

## 8 · Item 9 — Income under the head

**9 = 7 + 8e, taking 8e as nil if negative.** Schema key: `IncChargeableFrmOthSrc`.
This is the figure that goes to Part B-TI.

| Item | Sheet label | Schema key |
|---|---|---|
| **9** | Income under the head "Income from other sources" (7+8e) (take 8e as nil if negative) | `IncChargeableFrmOthSrc` |

---

## 9 · Item 10 — Information about accrual/receipt of income (the quarterly break-up)

Row 89: *"Information about accrual/receipt of income from Other Sources."* A matrix
(row 90 headers): Sl. No. · Other Source Income · five date columns — **Upto 15/6 (i)**
· From 16/6 to 15/9 (ii) · From 16/9 to 15/12 (iii) · From 16/12 to 15/3 (iv) · From
16/3 to 31/3 (v). **Nine live rows**, two hidden. Each live row is a schema block with
a `DateRange` of five integer fields (all required): `Upto15Of6`, `Up16Of6To15Of9`,
`Up16Of9To15Of12`, `Up16Of12To15Of3`, `Up16Of3To31Of3`.

| Sheet row | Sheet label | Schema block |
|---|---|---|
| 91 | Winnings from lotteries, crossword puzzles, races, games, gambling, betting etc. referred to in section 2(24)(ix) | `IncFrmLottery` |
| 92 | Winnings from Online games chargeable u/s 115BBJ | `IncFrmOnGames` |
| 93 (3a) | Dividend Income referred in 1a(i) | `DividendIncUs115BBDA` |
| 94 (3b) | Dividend Income referred in Sl. No. 1a(iii) | `DividendIncUs115BBDAaiii` |
| 95 | Dividend Income u/s 115A(1)(a)(i) other than as per proviso to section 115A(1)(a)(A) (Including PTI Income) | `DividendIncUs115A1ai` |
| 96 | Dividend income under proviso to section 115A(1)(a)(A) @ 10% (Including PTI Income) | `DividendIncUs115A1aA` |
| 97 | Dividend Income u/s 115AC @ 10% (Including PTI Income) | `DividendIncUs115AC` |
| 100 | Dividend Income (other than units referred to in section 115AB) u/s 115AD(1)(i) @ 20% (Including PTI Income) | `DividendIncUs115AD1iDiv` |
| 101 | Dividend income taxable at DTAA rates | `DividendDTAA` |

**Hidden quarterly rows (not built):**

| Sheet row | Label | Why hidden |
|---|---|---|
| `r98H` | Dividend Income u/s 115ACA (1)(a) @ 15% (Including PTI Income) | hidden in the utility; no schema key |
| `r99H` | Dividend Income u/s 115A(1)(a)(iiac) @ 10% (Including PTI Income) | hidden; no schema key |

---

## 10 · What is mandatory (from the schema `required` lists)

Required leaves are marked `*` in the appendix. On `IncOthThanOwnRaceHorse`:
`GrossIncChrgblTaxAtAppRate`, `DividendGross`, `InterestGross`,
`IntrstFrmSavingBank`, `IntrstFrmTermDeposit`, `IntrstFrmIncmTaxRefund`,
`NatofPassThrghIncome`, `IntrstFrmOthers`, `RentFromMachPlantBldgs`, `Tot562x` and its
five sub-lines, `IncDisallwnExmpUs10`, `AnyOtherIncome`, `IncChargeableSpecialRates`,
`LtryPzzlChrgblUs115BB`, `IncChrgblUs115BBE` and its six sub-lines, `OthersGross`,
`PassThrIncOSChrgblSplRate`, `TotalOSGrossChargblSplRate`, `Depreciation`,
`TotDeductions`, `BalanceNoRaceHorse`; on array rows `OthNatOfInc`, `OthAmount`,
`SourceDescription`, `SourceAmount`, and the DTAA row fields `DTAAamt`,
`NatureOfIncome`, `CountryName`, `CountryCodeExcludingIndia`, `DTAAarticle`,
`RateAsPerTreaty`, `ItemNoincl`, `RateAsPerITAct`. On `ScheduleOS` root:
`TotOthSrcNoRaceHorse`; `Receipts`, `DeductSec57`, `BalanceOwnRaceHorse`;
`IncChargeableFrmOthSrc`; and every `DateRange` leaf of all nine quarterly blocks.

Written only when carrying a value (schema-optional): `SumRecdPrYrBusTRU562xii`,
`IncChrgblUs115BBJ`, PTI `SourceAmount`, `TaxRescertifiedFlag`, `ApplicableRate`,
`Expenses`, `UsrIntExp57`, `IntExp57`, `AmtNotDeductibleUs58`, `ProfitChargTaxUs59`.

---

## 11 · Cross-sheet feeds

**Out of Schedule OS:**
- Item 6 (`BalanceNoRaceHorse`, if a loss) → **Schedule CYLA**.
- Item 8e (`BalanceOwnRaceHorse`) → **Schedule CYLA**, and if a loss → **Schedule CFL**.
- Item 2e (OS DTAA special) → **Schedule CYLA** and **Schedule SI**.
- Item 2a → **Schedule SI** 115BB / 115BBJ; item 2b → **Schedule SI** 115BBE.
- Item 2c / 2d dropdown amounts → **Schedule SI** matching special-rate lines.
- Item 9 (`IncChargeableFrmOthSrc`) → **Part B-TI** (income under the head other sources).

**Into Schedule OS:** dividend income reduced in Schedule BP must be offered here;
Schedule CG buy-back loss requires 1a(iii) filled; the 115AD(1)(i) FPI income requires
the FPI flag; non-resident restrictions apply.

---

## Appendix · Every schema leaf of block ScheduleOS (full paths)
`*` = required.
```
* IncOthThanOwnRaceHorse.GrossIncChrgblTaxAtAppRate integer
* IncOthThanOwnRaceHorse.DividendGross integer
  IncOthThanOwnRaceHorse.DividendOthThan22e integer
  IncOthThanOwnRaceHorse.Dividend22e integer
  IncOthThanOwnRaceHorse.Dividend22f integer
* IncOthThanOwnRaceHorse.InterestGross integer
* IncOthThanOwnRaceHorse.IntrstFrmSavingBank integer
* IncOthThanOwnRaceHorse.IntrstFrmTermDeposit integer
* IncOthThanOwnRaceHorse.IntrstFrmIncmTaxRefund integer
* IncOthThanOwnRaceHorse.NatofPassThrghIncome integer
* IncOthThanOwnRaceHorse.IntrstFrmOthers integer
* IncOthThanOwnRaceHorse.RentFromMachPlantBldgs integer
* IncOthThanOwnRaceHorse.Tot562x integer
* IncOthThanOwnRaceHorse.Aggrtvaluewithoutcons562x integer
* IncOthThanOwnRaceHorse.Immovpropwithoutcons562x integer
* IncOthThanOwnRaceHorse.Immovpropinadeqcons562x integer
* IncOthThanOwnRaceHorse.Anyotherpropwithoutcons562x integer
* IncOthThanOwnRaceHorse.Anyotherpropinadeqcons562x integer
* IncOthThanOwnRaceHorse.IncDisallwnExmpUs10 integer
  IncOthThanOwnRaceHorse.SumRecdPrYrBusTRU562xii integer
* IncOthThanOwnRaceHorse.AnyOtherIncome integer
  IncOthThanOwnRaceHorse.OthersInc.OthersIncDtls[] array
* IncOthThanOwnRaceHorse.OthersInc.OthersIncDtls[].OthNatOfInc string
* IncOthThanOwnRaceHorse.OthersInc.OthersIncDtls[].OthAmount integer
* IncOthThanOwnRaceHorse.IncChargeableSpecialRates integer
* IncOthThanOwnRaceHorse.LtryPzzlChrgblUs115BB integer
  IncOthThanOwnRaceHorse.IncChrgblUs115BBJ integer
* IncOthThanOwnRaceHorse.IncChrgblUs115BBE integer
* IncOthThanOwnRaceHorse.CashCreditsUs68 integer
* IncOthThanOwnRaceHorse.UnExplndInvstmntsUs69 integer
* IncOthThanOwnRaceHorse.UnExplndMoneyUs69A integer
* IncOthThanOwnRaceHorse.UnDsclsdInvstmntsUs69B integer
* IncOthThanOwnRaceHorse.UnExplndExpndtrUs69C integer
* IncOthThanOwnRaceHorse.AmtBrwdRepaidOnHundiUs69D integer
* IncOthThanOwnRaceHorse.OthersGross integer
  IncOthThanOwnRaceHorse.OthersGrossDtls[] array
* IncOthThanOwnRaceHorse.OthersGrossDtls[].SourceDescription string
* IncOthThanOwnRaceHorse.OthersGrossDtls[].SourceAmount integer
* IncOthThanOwnRaceHorse.PassThrIncOSChrgblSplRate integer
  IncOthThanOwnRaceHorse.PTIOthersGrossDtls[] array
* IncOthThanOwnRaceHorse.PTIOthersGrossDtls[].SourceDescription string
  IncOthThanOwnRaceHorse.PTIOthersGrossDtls[].SourceAmount integer
* IncOthThanOwnRaceHorse.IncChargblSplRateOS.TotalOSGrossChargblSplRate integer
  IncOthThanOwnRaceHorse.IncChargblSplRateOS.NRIOsDTAA.NRIDTAADtlsSchOS[] array
* IncOthThanOwnRaceHorse.IncChargblSplRateOS.NRIOsDTAA.NRIDTAADtlsSchOS[].DTAAamt integer
* IncOthThanOwnRaceHorse.IncChargblSplRateOS.NRIOsDTAA.NRIDTAADtlsSchOS[].NatureOfIncome string
* IncOthThanOwnRaceHorse.IncChargblSplRateOS.NRIOsDTAA.NRIDTAADtlsSchOS[].CountryName string
* IncOthThanOwnRaceHorse.IncChargblSplRateOS.NRIOsDTAA.NRIDTAADtlsSchOS[].CountryCodeExcludingIndia string
* IncOthThanOwnRaceHorse.IncChargblSplRateOS.NRIOsDTAA.NRIDTAADtlsSchOS[].DTAAarticle string
* IncOthThanOwnRaceHorse.IncChargblSplRateOS.NRIOsDTAA.NRIDTAADtlsSchOS[].RateAsPerTreaty number
  IncOthThanOwnRaceHorse.IncChargblSplRateOS.NRIOsDTAA.NRIDTAADtlsSchOS[].TaxRescertifiedFlag string
* IncOthThanOwnRaceHorse.IncChargblSplRateOS.NRIOsDTAA.NRIDTAADtlsSchOS[].ItemNoincl string
* IncOthThanOwnRaceHorse.IncChargblSplRateOS.NRIOsDTAA.NRIDTAADtlsSchOS[].RateAsPerITAct number
  IncOthThanOwnRaceHorse.IncChargblSplRateOS.NRIOsDTAA.NRIDTAADtlsSchOS[].ApplicableRate number
* IncOthThanOwnRaceHorse.Deductions.Expenses integer
* IncOthThanOwnRaceHorse.Deductions.Depreciation integer
  IncOthThanOwnRaceHorse.Deductions.UsrIntExp57 integer
  IncOthThanOwnRaceHorse.Deductions.IntExp57 integer
* IncOthThanOwnRaceHorse.Deductions.TotDeductions integer
  IncOthThanOwnRaceHorse.AmtNotDeductibleUs58 integer
  IncOthThanOwnRaceHorse.ProfitChargTaxUs59 integer
* IncOthThanOwnRaceHorse.BalanceNoRaceHorse integer
* TotOthSrcNoRaceHorse integer
* IncFromOwnHorse.Receipts integer
* IncFromOwnHorse.DeductSec57 integer
  IncFromOwnHorse.AmtNotDeductibleUs58 integer
  IncFromOwnHorse.ProfitChargTaxUs59 integer
* IncFromOwnHorse.BalanceOwnRaceHorse integer
* IncChargeableFrmOthSrc integer
* IncFrmLottery.DateRange.Upto15Of6 integer
* IncFrmLottery.DateRange.Up16Of6To15Of9 integer
* IncFrmLottery.DateRange.Up16Of9To15Of12 integer
* IncFrmLottery.DateRange.Up16Of12To15Of3 integer
* IncFrmLottery.DateRange.Up16Of3To31Of3 integer
* IncFrmOnGames.DateRange.Upto15Of6 integer
* IncFrmOnGames.DateRange.Up16Of6To15Of9 integer
* IncFrmOnGames.DateRange.Up16Of9To15Of12 integer
* IncFrmOnGames.DateRange.Up16Of12To15Of3 integer
* IncFrmOnGames.DateRange.Up16Of3To31Of3 integer
* DividendIncUs115BBDA.DateRange.Upto15Of6 integer
* DividendIncUs115BBDA.DateRange.Up16Of6To15Of9 integer
* DividendIncUs115BBDA.DateRange.Up16Of9To15Of12 integer
* DividendIncUs115BBDA.DateRange.Up16Of12To15Of3 integer
* DividendIncUs115BBDA.DateRange.Up16Of3To31Of3 integer
* DividendIncUs115A1ai.DateRange.Upto15Of6 integer
* DividendIncUs115A1ai.DateRange.Up16Of6To15Of9 integer
* DividendIncUs115A1ai.DateRange.Up16Of9To15Of12 integer
* DividendIncUs115A1ai.DateRange.Up16Of12To15Of3 integer
* DividendIncUs115A1ai.DateRange.Up16Of3To31Of3 integer
* DividendIncUs115BBDAaiii.DateRange.Upto15Of6 integer
* DividendIncUs115BBDAaiii.DateRange.Up16Of6To15Of9 integer
* DividendIncUs115BBDAaiii.DateRange.Up16Of9To15Of12 integer
* DividendIncUs115BBDAaiii.DateRange.Up16Of12To15Of3 integer
* DividendIncUs115BBDAaiii.DateRange.Up16Of3To31Of3 integer
* DividendIncUs115AC.DateRange.Upto15Of6 integer
* DividendIncUs115AC.DateRange.Up16Of6To15Of9 integer
* DividendIncUs115AC.DateRange.Up16Of9To15Of12 integer
* DividendIncUs115AC.DateRange.Up16Of12To15Of3 integer
* DividendIncUs115AC.DateRange.Up16Of3To31Of3 integer
* DividendIncUs115A1aA.DateRange.Upto15Of6 integer
* DividendIncUs115A1aA.DateRange.Up16Of6To15Of9 integer
* DividendIncUs115A1aA.DateRange.Up16Of9To15Of12 integer
* DividendIncUs115A1aA.DateRange.Up16Of12To15Of3 integer
* DividendIncUs115A1aA.DateRange.Up16Of3To31Of3 integer
* DividendIncUs115AD1iDiv.DateRange.Upto15Of6 integer
* DividendIncUs115AD1iDiv.DateRange.Up16Of6To15Of9 integer
* DividendIncUs115AD1iDiv.DateRange.Up16Of9To15Of12 integer
* DividendIncUs115AD1iDiv.DateRange.Up16Of12To15Of3 integer
* DividendIncUs115AD1iDiv.DateRange.Up16Of3To31Of3 integer
* DividendDTAA.DateRange.Upto15Of6 integer
* DividendDTAA.DateRange.Up16Of6To15Of9 integer
* DividendDTAA.DateRange.Up16Of9To15Of12 integer
* DividendDTAA.DateRange.Up16Of12To15Of3 integer
* DividendDTAA.DateRange.Up16Of3To31Of3 integer
```

## Appendix · Every live row of the sheet, verbatim
```
r   1 : [X1] OS PTI Match
r   3 : [C3] Schedule OS  |  [G3] Income from other sources
r   4 : [E4] Gross income chargeable to tax at normal applicable rates (1a+ 1b+ 1c+ 1d + 1e)  |  [W4] sadineni AY 2025-26
r   5 : [E5] a  |  [F5] Dividends Gross (ai+aii+aiii)  |  [O5] 1a
r   6 : [E6] ai  |  [F6] Dividend income [other than (ii) and (iii)]  |  [O6] 1ai
r   7 : [E7] aii  |  [F7] Dividend income u/s 2(22) (e)  |  [O7] 1aii
r   8 : [E8] aiii  |  [F8] Dividend income u/s 2(22)(f)  |  [O8] 1aiii
r   9 : [E9] b  |  [F9] Interest, Gross (bi + bii + biii + biv + bv)  |  [O9] 1b
r  10 : [F10] i  |  [H10] From Savings Bank  |  [O10] 1bi
r  11 : [F11] ii  |  [H11] From Deposit (Bank/ Post Office/ Co-operative)  |  [O11] 1bii
r  12 : [F12] iii  |  [H12] From Income Tax refund  |  [O12] 1biii
r  13 : [F13] iv  |  [H13] In the nature of Pass through income/Loss  |  [O13] 1biv
r  14 : [F14] v  |  [H14] others including interest from Companies, NBFCs & HFCs  |  [O14] 1bv
r  15 : [E15] c  |  [F15] Rental income from machinery, plants, buildings, etc., Gross  |  [O15] 1c
r  16 : [E16] d  |  [F16] Income of the nature referred to in section 56(2)(x) which is chargeable to tax (di + dii + diii + d  |  [O16] 1d
r  17 : [F17] i  |  [H17] Aggregate value of sum of money received without consideration  |  [O17] 1di
r  18 : [F18] ii  |  [H18] In case immovable property is received without consideration, stamp duty value of property  |  [O18] 1dii
r  19 : [F19] iii  |  [H19] In case immovable property is received for inadequate consideration, stamp duty value of property in  |  [O19] 1diii
r  20 : [F20] iv  |  [H20] In case any other property is received without consideration, fair market value of property  |  [O20] 1div
r  21 : [F21] v  |  [H21] In case any other property is received for inadequate consideration, fair market value of property i  |  [O21] 1dv
r  22 : [E22] e  |  [F22] Any other income (please specify nature)
r  23 : [F23] Sl. No  |  [H23] Nature  |  [K23] Amount
r  24 : [H24] Income due to disallowance of exemption under clauses of section 10
r  25 : [H25] Any specified sum received by a unit holder from a business trust during the previous year chargeabl
r  30 : [E30] Income chargeable at special rates (2ai + 2aii + 2b+ 2c+ 2d + 2e related to sl.no.1)]
r  31 : [E31] ai  |  [F31] Winnings from lotteries, crossword puzzles, races, card games etc. chargeable u/s 115BB  |  [O31] 2ai
r  32 : [E32] aii  |  [F32] Winnings from online games chargeable u/s 115BBJ  |  [O32] 2aii
r  33 : [E33] b  |  [F33] Income chargeable u/s 115BBE (bi + bii + biii + biv+ bv + bvi)  |  [O33] 2b
r  34 : [F34] i  |  [H34] Cash credits u/s 68  |  [O34] 2bi
r  35 : [F35] ii  |  [H35] Unexplained investments u/s 69  |  [O35] 2bii
r  36 : [F36] iii  |  [H36] Unexplained money etc. u/s 69A  |  [O36] 2biii
r  37 : [F37] iv  |  [H37] Undisclosed investments etc. u/s 69B  |  [O37] 2biv
r  38 : [F38] v  |  [H38] Unexplained expenditure etc. u/s 69C  |  [O38] 2bv
r  39 : [F39] vi  |  [H39] Amount borrowed or repaid on hundi u/s 69D  |  [O39] 2bvi
r  40H: [F40] Accumulated balance of recognised provident fund taxable u/s 111  |  [O40] 2c
r  41H: [F41] Sl. No  |  [H41] Assessment Year  |  [I41] Income Benefit  |  [J41] Tax Benefit
r  47H: [F47] Total
r  48 : [E48] c  |  [F48] Any other income chargeable at special rate (total of ci to cxiv)  |  [O48] 2c
r  49 : [F49] Sl. No.  |  [H49] Nature  |  [I49] Amount
r  50 : [H50] (Select)
r  51 : [H51] (Select)
r  52 : [H52] (Select)
r  53 : [H53] (Select)
r  55 : [E55] d  |  [F55] Pass through income in the nature of income from other sources claimed as chargeable at special rate  |  [O55] 2d
r  56 : [F56] Sl. No.  |  [H56] Nature  |  [I56] Amount
r  57 : [H57] (Select)
r  58 : [H58] (Select)
r  59 : [H59] (Select)
r  60 : [H60] (Select)
r  62 : [E62] e  |  [F62] Amount included in 1 and 2 above, which is claimed as chargeable at special rates or not chargeable   |  [O62] 2e
r  63 : [F63] Sl.No. 1  |  [H63] Amount of income 2  |  [I63] Item No.1ai, 1aiii ,1b to 1d, 2a, 2c & 2d in which included 3  |  [J63] Country name, code 4  |  [K63] Article of DTAA 5  |  [L63] Rate as per Treaty (enter NIL, if not chargeable) 6  |  [M63] Whether TRC obtained? 7  |  [N63] Section of I.T. Act 8  |  [O63] Rate as per I.T. Act 9  |  [P63] Applicable rate [lower of (6) or (9)] 10
r  64 : [I64] (Select)  |  [J64] (Select)  |  [M64] (Select)  |  [N64] (Select)
r  65 : [I65] (Select)  |  [J65] (Select)  |  [M65] (Select)  |  [N65] (Select)
r  66 : [I66] (Select)  |  [J66] (Select)  |  [M66] (Select)  |  [N66] (Select)
r  67 : [I67] (Select)  |  [J67] (Select)  |  [M67] (Select)  |  [N67] (Select)
r  68 : [I68] (Select)  |  [J68] (Select)  |  [M68] (Select)  |  [N68] (Select)
r  69 : [I69] (Select)  |  [J69] (Select)  |  [M69] (Select)  |  [N69] (Select)
r  71 : [E71] Deductions under section 57:- (other than those relating to income chargeable at special rate 2a, 2b
r  72 : [E72] a  |  [F72] Expenses / Deductions (other than entered in c)  |  [O72] 3a
r  73 : [E73] b  |  [F73] Depreciation (available only if income offered in 1c of "schedule OS")  |  [O73] 3b
r  74 : [E74] c  |  [F74] Interest expenditure u/s 57(1 ) (available only if income offered in 1a(i) and / or 1a(ii))
r  75 : [F75] Interest expenditure claimed -Entered Value
r  76 : [F76] Eligible interest expenditure- Computed Value  |  [O76] 3c
r  77 : [E77] d  |  [F77] Total  |  [O77] 3d
r  78 : [E78] Amounts not deductible u/s 58
r  79 : [E79] Profits chargeable to tax u/s 59
r  80 : [E80] Net Income from other sources chargeable at normal applicable rates 1(after reducing income related 
r  81 : [E81] Income from other sources (other than from owning race horses) (2+6) (enter 6 as nil if negative)
r  82 : [E82] Income from the activity of owning and maintaining race horses
r  83 : [E83] a  |  [F83] Receipts  |  [O83] 8a
r  84 : [E84] b  |  [F84] Deductions under section 57 in relation to receipts at 8a only  |  [O84] 8b
r  85 : [E85] c  |  [F85] Amounts not deductible u/s 58  |  [O85] 8c
r  86 : [E86] d  |  [F86] Profits chargeable to tax u/s 59  |  [O86] 8d
r  87 : [E87] e  |  [F87] Balance (8a - 8b + 8c + 8d)  |  [O87] 8e
r  88 : [E88] Income under the head “Income from other sources” (7+8e) (take 8e as nil if negative)
r  89 : [E89] Information about accrual/receipt of income from Other Sources
r  90 : [E90] Sl. No.  |  [G90] Other Source Income  |  [K90] Upto 15/6 (i)  |  [L90] From 16/6 to 15/9 (ii)  |  [M90] From 16/9 to 15/12 (iii)  |  [N90] From 16/12 to 15/3 (iv)  |  [O90] From 16/3 to 31/3 (v)
r  91 : [G91] Winnings from lotteries, crossword puzzles, races, games, gambling, betting etc. referred to in sect
r  92 : [G92] Winnings from Online games chargeable u/s 115BBJ
r  93 : [E93] 3a  |  [G93] Dividend Income referred in 1a(i)
r  94 : [E94] 3b  |  [G94] Dividend Income referred in Sl. No. 1a(iii)  |  [T94] sadineni AY 2025-26
r  95 : [G95] Dividend Income u/s 115A(1)(a)(i) other than as per proviso to section 115A(1)(a)(A) ( Including PTI  |  [S95] sadineni AY 2025-26
r  96 : [G96] Dividend income under proviso to section 115A(1)(a)(A) @ 10% (Including PTI Income)
r  97 : [G97] Dividend Income u/s 115AC @ 10% (Including PTI Income)
r  98H: [G98] Dividend Income u/s 115ACA (1)(a)@ 15% (Including PTI Income)
r  99H: [G99] Dividend Income u/s 115A(1)(a)(iiac) @ 10% (Including PTI Income)
r 100 : [G100] Dividend Income (other than units referred to in section 115AB) u/s 115AD(1)(i) @ 20% (Including PTI
r 101 : [G101] Dividend income taxable at DTAA rates
```

## Appendix · Every dropdown value, verbatim

**Cells `M64:M69`** (source `"(Select),Yes,No"`) — 3 values:
```
(Select) | Yes | No
```

**Cells `J64:J69`** (source `FSI_newcountrycod`) — 250 values:
```
(Select) | AFGHANISTAN:93 | ALAND ISLANDS:1001 | ALBANIA:355 | ALGERIA:213 | AMERICAN SAMOA:684 | ANDORRA:376 | ANGOLA:244 | ANGUILLA:1264 | ANTARCTICA:1010 | ANTIGUA AND BARBUDA:1268 | ARGENTINA:54 | ARMENIA:374 | ARUBA:297 | AUSTRALIA:61 | AUSTRIA:43 | AZERBAIJAN:994 | BAHAMAS:1242 | BAHRAIN:973 | BANGLADESH:880 | BARBADOS:1246 | BELARUS:375 | BELGIUM:32 | BELIZE:501 | BENIN:229 | BERMUDA:1441 | BHUTAN:975 | BOLIVIA (PLURINATIONAL STATE OF):591 | BONAIRE, SINT EUSTATIUS AND SABA:1002 | BOSNIA AND HERZEGOVINA:387 | BOTSWANA:267 | BOUVET ISLAND:1003 | BRAZIL:55 | BRITISH INDIAN OCEAN TERRITORY:1014 | BRUNEI DARUSSALAM:673 | BULGARIA:359 | BURKINA FASO:226 | BURUNDI:257 | CABO VERDE:238 | CAMBODIA:855 | CAMEROON:237 | CANADA:1 | CAYMAN ISLANDS:1345 | CENTRAL AFRICAN REPUBLIC:236 | CHAD:235 | CHILE:56 | CHINA:86 | CHRISTMAS ISLAND:9 | COCOS (KEELING) ISLANDS:672 | COLOMBIA:57 | COMOROS:270 | CONGO:242 | CONGO (DEMOCRATIC REPUBLIC OF THE):243 | COOK ISLANDS:682 | COSTA RICA:506 | COTE DIVOIRE:225 | CROATIA:385 | CUBA:53 | CURACAO:1015 | CYPRUS:357 | CZECHIA:420 | DENMARK:45 | DJIBOUTI:253 | DOMINICA:1767 | DOMINICAN REPUBLIC:1809 | ECUADOR:593 | EGYPT:20 | EL SALVADOR:503 | EQUATORIAL GUINEA:240 | ERITREA:291 | ESTONIA:372 | ETHIOPIA:251 | FALKLAND ISLANDS (MALVINAS):500 | FAROE ISLANDS:298 | FIJI:679 | FINLAND:358 | FRANCE:33 | FRENCH GUIANA:594 | FRENCH POLYNESIA:689 | FRENCH SOUTHERN TERRITORIES:1004 | GABON:241 | GAMBIA:220 | GEORGIA:995 | GERMANY:49 | GHANA:233 | GIBRALTAR:350 | GREECE:30 | GREENLAND:299 | GRENADA:1473 | GUADELOUPE:590 | GUAM:1671 | GUATEMALA:502 | GUERNSEY:1481 | GUINEA:224 | GUINEA-BISSAU:245 | GUYANA:592 | HAITI:509 | HEARD ISLAND AND MCDONALD ISLANDS:1005 | HOLY SEE:6 | HONDURAS:504 | HONG KONG:852 | HUNGARY:36 | ICELAND:354 | INDONESIA:62 | IRAN (ISLAMIC REPUBLIC OF):98 | IRAQ:964 | IRELAND:353 | ISLE OF MAN:1624 | ISRAEL:972 | ITALY:5 | JAMAICA:1876 | JAPAN:81 | JERSEY:1534 | JORDAN:962 | KAZAKHSTAN:7 | KENYA:254 | KIRIBATI:686 | KOREA (DEMOCRATIC PEOPLES REPUBLIC OF):850 | KOREA (REPUBLIC OF):82 | KUWAIT:965 | KYRGYZSTAN:996 | LAO PEOPLES DEMOCRATIC REPUBLIC:856 | LATVIA:371 | LEBANON:961 | LESOTHO:266 | LIBERIA:231 | LIBYA:218 | LIECHTENSTEIN:423 | LITHUANIA:370 | LUXEMBOURG:352 | MACAO:853 | MACEDONIA (THE FORMER YUGOSLAV REPUBLIC OF):389 | MADAGASCAR:261 | MALAWI:265 | MALAYSIA:60 | MALDIVES:960 | MALI:223 | MALTA:356 | MARSHALL ISLANDS:692 | MARTINIQUE:596 | MAURITANIA:222 | MAURITIUS:230 | MAYOTTE:269 | MEXICO:52 | MICRONESIA (FEDERATED STATES OF):691 | MOLDOVA (REPUBLIC OF):373 | MONACO:377 | MONGOLIA:976 | MONTENEGRO:382 | MONTSERRAT:1664 | MOROCCO:212 | MOZAMBIQUE:258 | MYANMAR:95 | NAMIBIA:264 | NAURU:674 | NEPAL:977 | NETHERLANDS:31 | NEW CALEDONIA:687 | NEW ZEALAND:64 | NICARAGUA:505 | NIGER:227 | NIGERIA:234 | NIUE:683 | NORFOLK ISLAND:15 | NORTHERN MARIANA ISLANDS:1670 | NORWAY:47 | OMAN:968 | PAKISTAN:92 | PALAU:680 | PALESTINE, STATE OF:970 | PANAMA:507 | PAPUA NEW GUINEA:675 | PARAGUAY:595 | PERU:51 | PHILIPPINES:63 | PITCAIRN:1011 | POLAND:48 | PORTUGAL:14 | PUERTO RICO:1787 | QATAR:974 | REUNION:262 | ROMANIA:40 | RUSSIAN FEDERATION:8 | RWANDA:250 | SAINT BARTHELEMY:1006 | SAINT HELENA, ASCENSION AND TRISTAN DA CUNHA:290 | SAINT KITTS AND NEVIS:1869 | SAINT LUCIA:1758 | SAINT MARTIN (FRENCH PART):1007 | SAINT PIERRE AND MIQUELON:508 | SAINT VINCENT AND THE GRENADINES:1784 | SAMOA:685 | SAN MARINO:378 | SAO TOME AND PRINCIPE:239 | SAUDI ARABIA:966 | SENEGAL:221 | SERBIA:381 | SEYCHELLES:248 | SIERRA LEONE:232 | SINGAPORE:65 | SINT MAARTEN (DUTCH PART):1721 | SLOVAKIA:421 | SLOVENIA:386 | SOLOMON ISLANDS:677 | SOMALIA:252 | SOUTH AFRICA:28 | SOUTH GEORGIA AND THE SOUTH SANDWICH ISLANDS:1008 | SOUTH SUDAN:211 | SPAIN:35 | SRI LANKA:94 | SUDAN:249 | SURINAME:597 | SVALBARD AND JAN MAYEN:1012 | SWAZILAND:268 | SWEDEN:46 | SWITZERLAND:41 | SYRIAN ARAB REPUBLIC:963 | TAIWAN, PROVINCE OF CHINA[A]:886 | TAJIKISTAN:992 | TANZANIA, UNITED REPUBLIC OF:255 | THAILAND:66 | TIMOR-LESTE (EAST TIMOR):670 | TOGO:228 | TOKELAU:690 | TONGA:676 | TRINIDAD AND TOBAGO:1868 | TUNISIA:216 | TURKEY:90 | TURKMENISTAN:993 | TURKS AND CAICOS ISLANDS:1649 | TUVALU:688 | UGANDA:256 | UKRAINE:380 | UNITED ARAB EMIRATES:971 | UNITED KINGDOM OF GREAT BRITAIN AND NORTHERN IRELAND:44 | UNITED STATES OF AMERICA:2 | UNITED STATES MINOR OUTLYING ISLANDS:1009 | URUGUAY:598 | UZBEKISTAN:998 | VANUATU:678 | VENEZUELA (BOLIVARIAN REPUBLIC OF):58 | VIET NAM:84 | VIRGIN ISLANDS (BRITISH):1284 | VIRGIN ISLANDS (U.S.):1340 | WALLIS AND FUTUNA:681 | WESTERN SAHARA:1013 | YEMEN:967 | ZAMBIA:260 | ZIMBABWE:263 | OTHERS:9999
```

**Cells `H42:H45`** (source `"(Select),2014-15,2015-16,2016-17,2017-18,2018-19"`) — 6 values:
```
(Select) | 2014-15 | 2015-16 | 2016-17 | 2017-18 | 2018-19
```

**Cells `I64:I69`** (source `"(Select),1ai,1a(iii),1b,1c,1d,2ai,2aii,2c,2d"`) — 10 values:
```
(Select) | 1ai | 1a(iii) | 1b | 1c | 1d | 2ai | 2aii | 2c | 2d
```
