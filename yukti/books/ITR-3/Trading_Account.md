# Trading Account (Part A-Trading Account) — ITR-3

## The shape
Part A-Trading Account is the ITR-3-only credit/debit statement for the financial year 2025-26 (items 4 to 12d, filled in a case where regular books of account are maintained). Credits are Revenue from operations (item 4) plus Closing Stock (item 5); debits are Opening Stock (6), Purchases (7), Direct Expenses (8), Duties and taxes on purchases (9/10), and Cost of goods produced transferred from the Manufacturing Account (11); the residue is Gross Profit (item 12) transferred to the Profit and Loss account. Items 12a–12d capture Intraday and Futures & Options turnover and income separately. Two nature-and-amount arrays repeat (other operating revenues, other direct expenses); every other figure is a single value.

## The items

### Block: TradingAccount

| Item | Field label | Type | Schema key | Rule / notes |
|---|---|---|---|---|
| 4 | Revenue from operations | header | — | Section header, item 4 |
| 4A | Sales/ Gross receipts of business (net of returns and refunds and duty or tax, if any) | header | SalesGrossReceiptsTotal | Aiv total below |
| 4A(i) | Sale of goods | integer | SaleOfGoods | min 0 |
| 4A(ii) | Sale of services | integer | SaleOfServices | min 0 |
| 4A(iii) | Other operating revenues (specify nature and amount) | array header | OtherOperatingRevenueDtls[] | Sl.No. / Nature / Amount rows; repeats |
| 4A(iii) | Nature | string | OtherOperatingRevenueDtls[].OperatingRevenueName | required in each row, maxLength 125 |
| 4A(iii) | Amount | integer | OtherOperatingRevenueDtls[].OperatingRevenueAmt | required in each row, min 0 |
| 4A(iiic) | Total (iiia+iiib) | integer | OperatingRevenueTotal | required; K14 = SUM of the array amounts |
| 4A(iv) | Total(i+ii+iiic) | integer | SalesGrossReceiptsTotal | required; N15 (Aiv) |
| 4B | Gross receipts from Profession | integer | GrossRcptFromProfession | item B |
| 4C | Duties, taxes and cess received or receivable in respect of goods and services sold or supplied | header | ExciseCustomsVAT | object |
| 4C(i) | Union Excise duties | integer | ExciseCustomsVAT.UnionExciseDuty | min 0 |
| 4C(ii) | Service Tax | integer | ExciseCustomsVAT.ServiceTax | min 0 |
| 4C(iii) | VAT/ Sales tax | integer | ExciseCustomsVAT.VATorSaleTax | min 0 |
| 4C(iv) | Central Goods & Service Tax (CGST) | integer | ExciseCustomsVAT.CentralGoodServiceTax | min 0 |
| 4C(v) | State Goods & Services Tax (SGST) | integer | ExciseCustomsVAT.StateGoodServiceTax | min 0 |
| 4C(vi) | Integrated Goods & Services Tax (IGST) | integer | ExciseCustomsVAT.IntegratedGoodServiceTax | min 0 |
| 4C(vii) | Union Territory Goods & Services Tax (UTGST) | integer | ExciseCustomsVAT.UnionTerrGoodServiceTax | min 0 |
| 4C(viii) | Any other duty, tax and cess | integer | ExciseCustomsVAT.OthDutyTaxCess | min 0 |
| 4C(ix) | Total (i + ii + iii + iv +v+ vi+vii+viii) | integer | ExciseCustomsVAT.TotExciseCustomsVAT | required; N26 (4Cix) |
| 4D | Total Revenue from operations (Aiv + B +Cix) | integer | TotRevenueFrmOperations | required; N27 (4D) |
| 5 | Closing Stock of Finished Stocks | integer | ClsngStckOfFinishedStcks | min 0 |
| — | Total of credits to Trading Account (4D + 5 ) | integer | TardingAccTotCred | required; N29 |
| 6 | Opening Stock of Finished Goods | integer | OpngStckOfFinishedStcks | min 0 |
| 7 | Purchases (net of refunds and duty or tax, if any) | integer | Purchases | min 0 |
| 8 | Direct Expenses (9i + 9ii + 9iii) Note: Row can be added as per the nature of Direct Expenses | integer | DirectExpenses | required; N32 |
| 8(i) | Carriage inward | integer | CarriageInward | min 0 |
| 8(ii) | Power and fuel | integer | PowerAndFuel | min 0 |
| 8(iii) | Other direct expenses | array header | OtherIncDtls[] | Sl.No. / Nature of direct expenses / Amount rows; repeats |
| 8(iii) | Nature of direct expenses | string | OtherIncDtls[].NatureOfIncome | required in each row, maxLength 125 |
| 8(iii) | Amount | integer | OtherIncDtls[].Amount | required in each row |
| 9iii | Total | integer | DirectExpensesTotal | K41 = SUM of the other-direct-expenses array |
| 9/10 | Duties and taxes, paid or payable, in respect of goods and services purchased | header | DutyTaxPay.ExciseCustomsVAT | object |
| 10(i) | Custom duty | integer | DutyTaxPay.ExciseCustomsVAT.CustomDuty | min 0 |
| 10(ii) | Counter veiling duty | integer | DutyTaxPay.ExciseCustomsVAT.CounterVailDuty | min 0 |
| 10(iii) | Special additional duty | integer | DutyTaxPay.ExciseCustomsVAT.SplAddDuty | min 0 |
| 10(iv) | Union excise duty | integer | DutyTaxPay.ExciseCustomsVAT.UnionExciseDuty | min 0 |
| 10(v) | Service Tax | integer | DutyTaxPay.ExciseCustomsVAT.ServiceTax | min 0 |
| 10(vi) | VAT/ Sales tax | integer | DutyTaxPay.ExciseCustomsVAT.VATorSaleTax | min 0 |
| 10(vii) | Central Goods & Service Tax (CGST) | integer | DutyTaxPay.ExciseCustomsVAT.CentralGoodServiceTax | min 0 |
| 10(viii) | State Goods & Services Tax (SGST) | integer | DutyTaxPay.ExciseCustomsVAT.StateGoodServiceTax | min 0 |
| 10(ix) | Integrated Goods & Services Tax (IGST) | integer | DutyTaxPay.ExciseCustomsVAT.IntegratedGoodServiceTax | min 0 |
| 10(x) | Union Territory Goods & Services Tax (UTGST) | integer | DutyTaxPay.ExciseCustomsVAT.UnionTerrGoodServiceTax | min 0 |
| 10(xi) | Any other tax, paid or payable | integer | DutyTaxPay.ExciseCustomsVAT.OthDutyTaxCess | min 0 |
| 10(xii) | Total (10i + 10ii + 10iii + 10iv + 10v + 10vi + 10vii + 10viii + 10ix + 10x+10xi) | integer | DutyTaxPay.ExciseCustomsVAT.TotExciseCustomsVAT | required; N54 (10xii) |
| 11 | Cost of goods produced – Transferred from Manufacturing Account | integer | GoodsCostPrdcdFrmMA | N55 = ManuFactureAcc_CostOfGoodsProduced |
| 12 | Gross Profit from Business/Profession - transferred to Profit and Loss account (6-7-8-9-10xii-11) | integer | GrossProfitFrmBusProf | N56 |
| 12a | Turnover from Intraday Trading | integer | TurnoverIntradayTrd | min 0 |
| 12b | Income from Intraday Trading - transferred to Profit and Loss account | integer | IncomeIntradayTrd | not more than 12a |
| 12c | Turnover from Futures & Options Trading | integer | TurnoverFutureTrd | min 0 |
| 12d | Income from Futures & Options Trading - transferred to Profit and Loss account | integer | IncomeFutureTrd | not more than 12c |

## The rules the sheet computes
- **K14** `= SUM(TradingAcc_RevenueAmount)` — Total of other operating revenues (item 4A iiic), from the array amount rows.
- **N15 (Aiv)** `= SUM(TradingAcc_SalesOfGoods, TradingAcc_SalesOfServices, TradingAcc_RevenueTotal)` — Sl.No. 4A(iv) = 4A(i)+4A(ii)+4A(iiic).
- **N26 (4Cix)** `= SUM(TradingAcc_UnionExciseDuties, TradingAcc_ServiceTax, TradingAcc_VatOrSalesTax, TradingAcc_CGST, ...)` — Sl.No. 4C(ix) = total of 4Ci..4Cviii.
- **N27 (4D)** `= SUM(TradingAcc_TotalOfSalesOrGross, TradingAcc_GrossRecieptsFromProfession, TradingAcc_TotalDutiesTaxes...)` — Total Revenue from operations = Aiv + B + Cix.
- **N29** `= SUM(TradingAcc_TotalRevenueFromOperations, TradingAcc_ClosingStockOfFinishedStocks)` — Total of credits to Trading Account = 4D + 5.
- **N32** `= SUM(TradingAcc_CarriageInward, TradingAcc_PowerAndFuel, SUM(TradingAcc_OtherDirectAmount))` — Total Direct Expenses = carriage inward + power and fuel + other direct expenses.
- **K41** `= SUM(TradingAcc_OtherDirectAmount)` — Total of other direct expenses (item 9iii).
- **N54 (10xii)** `= SUM(TradingAcc_CustomDuty, TradingAcc_CounterVeilingDuty, TradingAcc_SpecialAdditionalDuty, ...)` — Total duties/taxes on purchases = 10i..10xi.
- **N55** `= ManuFactureAcc_CostOfGoodsProduced` — Cost of goods produced pulled from the Manufacturing Account (cross-sheet).
- **N56** `= TradingAcc_TotalOfCreditsToTradingAccount - TradingAcc_OpeningStockOfFinishedGoods - TradingAcc_Purchases - ...` — Gross Profit = credits − (6 − 7 − 8 − 9 − 10xii − 11); item 12.
- **F11** `= F10+1` and **F38** `= F37+1` — auto-increment Sl.No. for the two nature/amount array templates.
- Validation (from rules.json): 12b must not exceed 12a; 12d must not exceed 12c; Sl.No. 13 (Gross profit transferred) = 12 + 12b + 12d; negative signs allowed only in Sl.No. 11 and/or 12; other-operating-revenue total must be consistent with individual rows; if turnover > Rs. 10 crores (or profession receipts > 75/50 lakhs) audit u/s 44AB is required.

## Dropdowns
None. The sheet carries no enumerated dropdown lists — every data-validation on this sheet is a numeric bound (minimum 0, maximum 99999999999999 / -99999999999999) or a text length limit (125 characters on the Nature fields). There are no list-type dropdowns to enumerate.

## What repeats and what is one figure
- **Repeats (arrays):** `OtherOperatingRevenueDtls[]` — item 4A(iii) other operating revenues (Sl.No. / Nature / Amount); `OtherIncDtls[]` — item 8(iii) other direct expenses (Sl.No. / Nature of direct expenses / Amount).
- **One figure (single):** everything else — 4A(i), 4A(ii), the 4A(iv)/4C/4D totals, closing stock (5), credits total, opening stock (6), purchases (7), direct expenses total (8), the 10i–10xii duties block, cost of goods produced (11), gross profit (12), and 12a–12d.

## Mandatory
Schema `required` keys for block TradingAccount: **OperatingRevenueTotal**, **SalesGrossReceiptsTotal**, **TotRevenueFrmOperations**, **TardingAccTotCred**, **DirectExpenses**. Within each array row the required keys are OperatingRevenueName + OperatingRevenueAmt (revenues) and NatureOfIncome + Amount (direct expenses); within each duty object TotExciseCustomsVAT is required.

## Hidden rows — not built
None. No row in this sheet carries the hidden (`H`) flag. Rows 10–13 and 37–40 are not hidden labelled items — they are the blank template/spacer rows that back the two nature-and-amount arrays (the `F=F+1` auto-increment lives on rows 11 and 38); they are represented by the `OtherOperatingRevenueDtls[]` and `OtherIncDtls[]` arrays, not as standalone items.

## What this means for the build
- Build item 4 down to 12d as one credit/debit statement; credits = 4D (item 4) + Closing Stock (item 5); debits = items 6 through 11; Gross Profit (item 12, key GrossProfitFrmBusProf) is the computed residue and is one of the two cells where a negative value is allowed (the other is item 11, GoodsCostPrdcdFrmMA).
- Wire the computed cells green/untypeable: OperatingRevenueTotal (K14), SalesGrossReceiptsTotal (N15), TotExciseCustomsVAT (N26), TotRevenueFrmOperations (N27), TardingAccTotCred (N29), DirectExpenses (N32), DirectExpensesTotal (K41), DutyTaxPay TotExciseCustomsVAT (N54), and GrossProfitFrmBusProf (N56).
- Pull item 11 (GoodsCostPrdcdFrmMA) from the Manufacturing Account sheet — do not let the user type it directly; it mirrors ManuFactureAcc_CostOfGoodsProduced.
- Enforce 12b ≤ 12a and 12d ≤ 12c at input; feed 12b (IncomeIntradayTrd) into Schedule BP speculative business and 12+12b+12d into the P&L gross-profit-transferred line per rules.json.
- Two "add row" arrays need the dustbin and a running Sl.No.; each row is Nature (string, 125 chars) + Amount (integer). Keep the DutyTaxPay object nested exactly one level under DutyTaxPay.ExciseCustomsVAT so the 10i–10xii keys land correctly.
