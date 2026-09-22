# The book of Part A — Trading Account · ITR-6, A.Y. 2026-27

Read row by row from the utility's **Part A-Trading Account** sheet (66 rows,
none hidden) with its formulas, and confirmed against the CBDT ITR-6 schema
block **`TradingAccount`** (`ITRForm:PARTA_TradingAccount`). Every label, item
number and formula below is the department's own.

The sheet's own heading (G3): *"Part A-Trading Account — Trading Account for the
financial year 2025-26 (fill items 4 to 12d in a case where regular books of
account are maintained, otherwise fill items 61 to 62 as applicable)."*

---

## 1 · Why the Trading Account exists on ITR-6

The Trading Account sits between the Manufacturing Account and the Statement of
Profit and Loss. Its **credits** are the revenue from operations (sales, gross
receipts from profession, duties collected) plus the closing stock of finished
goods; its **debits** are opening stock, purchases, direct expenses, duties
paid, and the **Cost of Goods Produced transferred from the Manufacturing
Account**. The balancing figure — **Gross Profit** — is transferred up to the
Statement of Profit and Loss. The sheet also carries a small intraday /
futures-and-options trading appendix (12a–12d) whose income is transferred
directly to the P&L.

Nothing on this sheet is hidden. Every row is live.

---

## 2 · The shape

| Side | Items | What it holds |
|---|---|---|
| **Credits** | 4 (A–D), 5 | Revenue from operations, closing stock of finished stock |
| **Debits** | 6, 7, 8, 9 (i–iii), 10 (i–xi), 11 | Opening stock, purchases, direct expenses, duties paid, cost of goods produced from Manufacturing |
| **Balancing** | 12 | Gross Profit transferred to P&L |
| **Appendix** | 12a–12d | Intraday and F&O turnover and income |

---

## 3 · Row by row

All amounts are integers (rupees). Computed rows are green and untypeable and
carry the sheet's own formula.

### Credits — Revenue from operations (item 4)

| Item | Row | Label | Type | Schema key (under `TradingAccount`) | Formula / derivation |
|---|---|---|---|---|---|
| **4A** | 5 | **Sales/ Gross receipts of business** (net of returns and refunds and duty or tax, if any) | group | | |
| 4Ai | 6 | Sale of goods | figure | `SaleOfGoods` | entered |
| 4Aii | 7 | Sale of services | figure | `SaleOfServices` | entered |
| 4Aiii | 8 | Other operating revenues (specify nature and amount) | **table** | `OtherOperatingRevenueDtls[]` | rows addable |
| — | 9 | (table header) Sl No · Nature of other operating revenue · Amount | — | `OtherOperatingRevenueDtls[].OperatingRevenueName` *(req)*, `OtherOperatingRevenueDtls[].OperatingRevenueAmt` *(req)* | per row |
| 4Aiiic | 14 | **Total (iiia + iiib)** | computed | `OperatingRevenueTotal` *(req)* | `SUM(TradingAcc_RevenueAmount)` |
| 4Aiv | 15 | **Total (i + ii + iiic)** | computed | `SalesGrossReceiptsTotal` *(req)* | `SUM(SaleOfGoods, SaleOfServices, OperatingRevenueTotal)` |
| **4B** | 16 | **Gross receipts from Profession** | figure | `GrossRcptFromProfession` | entered |
| **4C** | 17 | **Duties, taxes and cess received or receivable** in respect of goods and services sold or supplied | group | under `ExciseCustomsVAT` | |
| 4Ci | 18 | Union Excise duties | figure | `ExciseCustomsVAT.UnionExciseDuty` | entered |
| 4Cii | 19 | Service Tax | figure | `ExciseCustomsVAT.ServiceTax` | entered |
| 4Ciii | 20 | VAT/ Sales tax | figure | `ExciseCustomsVAT.VATorSaleTax` | entered |
| 4Civ | 21 | Central Goods & Service Tax (CGST) | figure | `ExciseCustomsVAT.CentralGoodServiceTax` | entered |
| 4Cv | 22 | State Goods & Services Tax (SGST) | figure | `ExciseCustomsVAT.StateGoodServiceTax` | entered |
| 4Cvi | 23 | Integrated Goods & Services Tax (IGST) | figure | `ExciseCustomsVAT.IntegratedGoodServiceTax` | entered |
| 4Cvii | 24 | Union Territory Goods & Services Tax (UTGST) | figure | `ExciseCustomsVAT.UnionTerrGoodServiceTax` | entered |
| 4Cviii | 25 | Any other duty, tax and cess | figure | `ExciseCustomsVAT.OthDutyTaxCess` | entered |
| 4Cix | 26 | **Total (i + ii + iii + iv + v + vi + vii + viii)** | computed | `ExciseCustomsVAT.TotExciseCustomsVAT` *(req)* | `SUM(UnionExciseDuty, ServiceTax, VATorSaleTax, CGST, SGST, IGST, UTGST, OthDutyTaxCess)` |
| **4D** | 27 | **Total Revenue from operations (Aiv + B + Cix)** | computed | `TotRevenueFrmOperations` *(req)* | `SUM(SalesGrossReceiptsTotal, GrossRcptFromProfession, TotExciseCustomsVAT)` |

### Credits — Closing stock (item 5) and total credits

| Item | Row | Label | Type | Schema key | Formula |
|---|---|---|---|---|---|
| **5** | 28 | Closing Stock of Finished Stocks | figure | `ClsngStckOfFinishedStcks` | entered |
| **6** | 29 | **Total of credits to Trading Account (4D + 5)** | computed | `TardingAccTotCred` *(req)* | `SUM(TotRevenueFrmOperations, ClsngStckOfFinishedStcks)` |

### Debits

| Item | Row | Label | Type | Schema key | Formula |
|---|---|---|---|---|---|
| **7** | 30 | Opening Stock of Finished Goods | figure | `OpngStckOfFinishedStcks` | entered |
| **8** | 31 | Purchases (net of refunds and duty or tax, if any) | figure | `Purchases` | entered |
| **9** | 32 | **Direct Expenses (9i + 9ii + 9iii)** | computed | `DirectExpenses` | `SUM(CarriageInward, PowerAndFuel, SUM(OtherDirectExpenses[].Amount))` |
| 9i | 33 | Carriage inward | figure | `CarriageInward` | entered |
| 9ii | 34 | Power and fuel | figure | `PowerAndFuel` | entered |
| 9iii | 35 | Other direct expenses | **table** | `OtherDirectExpenses[]` | rows addable |
| — | 36 | (table header) Sl No · Nature of direct expenses · Amount | — | `OtherDirectExpenses[].NatureOfDirectExpense` *(req)*, `OtherDirectExpenses[].Amount` *(req)* | per row |
| — | 41 | Total (of the other-direct-expenses table) | computed | `TotOthDirectExpenses` | `MAX(0, SUM(OtherDirectExpenses[].Amount))` |
| **10** | 42 | **Duties and taxes, paid or payable, in respect of goods and services purchased** | group | under `DutyTaxPay.ExciseCustomsVAT` | |
| 10i | 43 | Custom duty | figure | `DutyTaxPay.ExciseCustomsVAT.CustomDuty` | entered |
| 10ii | 44 | Counter veiling duty | figure | `DutyTaxPay.ExciseCustomsVAT.CounterVailDuty` | entered |
| 10iii | 45 | Special additional duty | figure | `DutyTaxPay.ExciseCustomsVAT.SplAddDuty` | entered |
| 10iv | 46 | Union excise duty | figure | `DutyTaxPay.ExciseCustomsVAT.UnionExciseDuty` | entered |
| 10v | 47 | Service Tax | figure | `DutyTaxPay.ExciseCustomsVAT.ServiceTax` | entered |
| 10vi | 48 | VAT/ Sales tax | figure | `DutyTaxPay.ExciseCustomsVAT.VATorSaleTax` | entered |
| 10vii | 49 | Central Goods & Service Tax (CGST) | figure | `DutyTaxPay.ExciseCustomsVAT.CentralGoodServiceTax` | entered |
| 10viii | 50 | State Goods & Services Tax (SGST) | figure | `DutyTaxPay.ExciseCustomsVAT.StateGoodServiceTax` | entered |
| 10ix | 51 | Integrated Goods & Services Tax (IGST) | figure | `DutyTaxPay.ExciseCustomsVAT.IntegratedGoodServiceTax` | entered |
| 10x | 52 | Union Territory Goods & Services Tax (UTGST) | figure | `DutyTaxPay.ExciseCustomsVAT.UnionTerrGoodServiceTax` | entered |
| 10xi | 53 | Any other tax, paid or payable | figure | `DutyTaxPay.ExciseCustomsVAT.OthDutyTaxCess` | entered |
| 10xii | 54 | **Total (10i + 10ii + … + 10xi)** | computed | `DutyTaxPay.ExciseCustomsVAT.TotExciseCustomsVAT` *(req)* | `SUM(CustomDuty, CounterVailDuty, SplAddDuty, UnionExciseDuty, ServiceTax, VATorSaleTax, CGST, SGST, IGST, UTGST, OthDutyTaxCess)` |
| **11** | 55 | **Cost of goods produced – Transferred from Manufacturing Account** | fed | `GoodsCostPrdcdFrmMA` | `= ManuFactureAcc_CostOfGoodsProduced` |

### Balancing figure (item 12)

| Item | Row | Label | Type | Schema key | Formula |
|---|---|---|---|---|---|
| **12** | 56 | **Gross Profit from Business/Profession — transferred to statement of Profit and Loss (6 − 7 − 8 − 9 − 10xii − 11)** | computed | `GrossProfitFrmBusProf` *(req)* | `TardingAccTotCred − OpngStckOfFinishedGoods − Purchases − DirectExpenses − TotExciseCustomsVAT(DutyTaxPay) − GoodsCostPrdcdFrmMA` |

### Intraday and Futures & Options appendix (12a–12d)

| Item | Row | Label | Type | Schema key | Formula |
|---|---|---|---|---|---|
| 12a | 57 | Turnover from Intraday Trading | figure | `IntradayTradingTurnOver` | entered |
| 12b | 58 | Income from Intraday Trading — transferred to statement of Profit and Loss | figure | `IntradayTradingIncome` | entered / transferred to P&L |
| 12c | 59 | Turnover from Futures & Options Trading | figure | `TurnoverFutureTrd` | entered |
| 12d | 60 | Income from Futures & Options Trading — transferred to Profit and Loss account | figure | `IncomeFutureTrd` | entered / transferred to P&L |

---

## 4 · The dropdowns

There are **no enumerated (list) dropdowns** on this sheet. Every input cell
carries only a numeric data-validation: minimum 0 on the ordinary amount cells,
a signed limit `-99999999999999` on the transfer rows (55, 56) and on the
intraday/F&O income rows (58, 60), and small format limits (max length 125 on
the "Nature of direct expenses"/"Nature of other operating revenue" text cells,
50 on their Sl-No cells). No value list is seeded from `enums.json`.

---

## 5 · Hidden rows

**None.** All 66 rows are visible; nothing is excluded.

---

## 6 · The rules the sheet computes (from its cells)

- **4Aiiic** `N14 = SUM(TradingAcc_RevenueAmount)` — the other-operating-revenue table total.
- **4Aiv** `N15 = SUM(TradingAcc_SalesOfGoods, TradingAcc_SalesOfServices, TradingAcc_RevenueTotal)`.
- **4Cix** `N26 = SUM(TradingAcc_UnionExciseDuties, TradingAcc_ServiceTax, TradingAcc_VatOrSalesTax, TradingAcc_CGST, TradingAcc_SGST, TradingAcc_IGST, TradingAcc_UTGST, TradingAcc_OtherDutyTaxCess)`.
- **4D** `N27 = SUM(TradingAcc_TotalOfSalesOrGross, TradingAcc_GrossRecieptsFromProfession, TradingAcc_TotalDutiesTaxes)`.
- **6** `N29 = SUM(TradingAcc_TotalRevenueFromOperations, TradingAcc_ClosingStockOfFinishedStocks)`.
- **9** `N32 = SUM(TradingAcc_CarriageInward, TradingAcc_PowerAndFuel, SUM(TradingAcc_OtherDirectAmount))`.
- **9iii table total** `K41 = MAX(0, SUM(TradingAcc_OtherDirectAmount))`.
- **10xii** `N54 = SUM(TradingAcc_CustomDuty, TradingAcc_CounterVeilingDuty, TradingAcc_SpecialAdditionalDuty, …)`.
- **11** `N55 = ManuFactureAcc_CostOfGoodsProduced` — fed from the Manufacturing Account.
- **12** `N56 = TradingAcc_TotalOfCreditsToTradingAccount − TradingAcc_OpeningStockOfFinishedGoods − TradingAcc_Purchases − TradingAcc_DirectExpenses − TradingAcc_TotalDutiesTaxesPaid − ManuFactureAcc_CostOfGoodsProduced`.

Direct expenses (item 9) exists both as a header total and, in the schema, as a
computed `DirectExpenses` leaf; the "other direct expenses" table drives its
third component through `TotOthDirectExpenses`.

---

## 7 · Cross-sheet feeds

- **In ←** the **Manufacturing Account**: item 11 `GoodsCostPrdcdFrmMA` = its
  `CostOfGoodsPrdcd`. Compute the Manufacturing Account first.
- **Out →** the **Statement of Profit and Loss**: item 12 Gross Profit
  (`GrossProfitFrmBusProf`) is transferred to P&L item 13 ("Gross profit
  transferred from Trading Account (12 + 12b + 12d)", cell
  `L29 = TradingAcc_GrossProfitOrLoss + TradingAcc_GrossProfitOrLossb + FO_TradingAcc_GrossProfitOrLossD`),
  together with the intraday income (12b) and the F&O income (12d).

The Ind-AS variant is a separate sheet (`Part A-Trading Account Indas`) and is
not part of this block.

---

## 8 · What the schema marks mandatory

Required leaves: `OperatingRevenueName`, `OperatingRevenueAmt`,
`OperatingRevenueTotal`, `SalesGrossReceiptsTotal`, `TotRevenueFrmOperations`,
`TardingAccTotCred`, `NatureOfDirectExpense`, `Amount` (of the direct-expenses
row), `TotExciseCustomsVAT` (both the credit-side item 4Cix and the debit-side
item 10xii under `DutyTaxPay`), and `GrossProfitFrmBusProf`. The two detail
tables (`OtherOperatingRevenueDtls[]`, `OtherDirectExpenses[]`) make their own
row fields mandatory once a row exists. Every leaf listed in §3 belongs to
`TradingAccount`; no live row is excluded.

---

## 9 · What this means for the build

1. **Two-sided figures block with two repeatable tables** — other operating
   revenue (4Aiii) and other direct expenses (9iii), each Sl-No / Nature /
   Amount, rows addable.
2. **Every subtotal computed** — 4Aiiic, 4Aiv, 4Cix, 4D, 6, 9, 10xii, 12 carry
   the §6 formulas; the filer types only the leaf inputs.
3. **Item 11 is fed, not entered** — show Cost of Goods Produced as a fed line
   from the Manufacturing Account; compute order is Manufacturing → Trading.
4. **Gross Profit (12) flows out** to the P&L along with the intraday (12b) and
   F&O (12d) income; wire all three transfers.
5. **No enums** — numeric minimums and text-length limits only.
