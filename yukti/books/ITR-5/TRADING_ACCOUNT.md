# Trading Account (Part A-Trading Account) — ITR-5

## The shape
Part A-Trading Account is the credit/debit statement for the financial year 2025-26 (row 3: "Trading Account for the financial year 2025-26 (fill items 4 to 12 in a case where regular books of account are maintained)"). It is a single block, `TradingAccount`, mapped from `section_map.json` (section `pl`).

**Credits of Trading Account** (rows 4–28): Revenue from operations (item 4 = 4A Sales/gross receipts + 4B Gross receipts from Profession + 4C Duties/taxes received + 4D total) plus Closing Stock of Finished Goods (item 5); their sum is the Total of credits to Trading Account (item 6, `4D + 5`).

**Debits to Trading Account** (rows 29–54): Opening Stock (item 7), Purchases (item 8), Direct Expenses (item 9 = carriage inward + power and fuel + other direct expenses), Duties and taxes paid/payable on purchases (item 10), and Cost of goods produced transferred from the Manufacturing Account (item 11). The residue is Gross Profit (item 12), transferred to the Profit and Loss account (`6 − 7 − 8 − 9 − 10xii − 11`).

**Intraday / F&O** (rows 55–58): items 12a–12d capture Intraday Trading and Futures & Options turnover and income separately.

Two "specify nature and amount" arrays repeat (other operating revenues; other direct expenses); every other line is a single figure.

## The items

### Block: TradingAccount

| Item | Field label (verbatim from sheet) | Type | Schema key | Rule / notes |
|---|---|---|---|---|
| 4 | Revenue from operations | header | — | Section header (E4) |
| 4A | Sales/ Gross receipts of business (net of returns and refunds and duty or tax, if any | header | SalesGrossReceiptsTotal | E5/F5; Aiv total sits at row 14 |
| 4A(i) | Sale of goods | integer | SaleOfGoods | G6; min 0, max 99999999999999 |
| 4A(ii) | Sale of Services | integer | SaleOfServices | G7; min 0, max 99999999999999 |
| 4A(iii) | Other operating revenues (specify nature and amount) | array header | OtherOperatingRevenueDtls[] | G8; Sl. No. / Nature / Amount rows (row 9 headers); repeats |
| 4A(iii) | Nature of other operating revenue | string | OtherOperatingRevenueDtls[].OperatingRevenueName | H9; required per row; maxLength 50 (H10:H11 validation = 50) |
| 4A(iii) | Amount | integer | OtherOperatingRevenueDtls[].OperatingRevenueAmt | J9; required per row; min 0 |
| 4A(iii) | Total | integer | OperatingRevenueTotal | F12; required; **J12 = SUM(TradingAcc_RevenueAmount)** |
| 4A(iv) | Total (i + ii + iii) | integer | SalesGrossReceiptsTotal | G14/K14 "Aiv"; **L14 = SUM(TradingAcc_SalesOfGoods, TradingAcc_SalesOfServices, SUM(TradingAcc_RevenueAmount))** |
| 4B | Gross receipts from Profession | integer | GrossRcptFromProfession | F15/K15 "B"; min 0 |
| 4C | Duties, taxes and cess, received or receivable, in respect of goods and services sold or supplied | header | ExciseCustomsVAT | F16; object |
| 4C(i) | Union Excise duties | integer | ExciseCustomsVAT.UnionExciseDuty | G17; min 0 (J17 default 0) |
| 4C(ii) | Service tax | integer | ExciseCustomsVAT.ServiceTax | G18; min 0 (J18 default 0) |
| 4C(iii) | VAT/ Sales tax | integer | ExciseCustomsVAT.VATorSaleTax | G19; min 0 (J19 default 0) |
| 4C(iv) | Central Goods & Service Tax (CGST) | integer | ExciseCustomsVAT.CentralGoodServiceTax | G20; min 0 (J20 default 0) |
| 4C(v) | State Goods & Services Tax (SGST) | integer | ExciseCustomsVAT.StateGoodServiceTax | G21; min 0 (J21 default 0) |
| 4C(vi) | Integrated Goods & Services Tax (IGST) | integer | ExciseCustomsVAT.IntegratedGoodServiceTax | G22; min 0 (J22 default 0) |
| 4C(vii) | Union Territory Goods & Services Tax (UTGST) | integer | ExciseCustomsVAT.UnionTerrGoodServiceTax | G23; min 0 (J23 default 0) |
| 4C(viii) | Any other duty, tax and cess | integer | ExciseCustomsVAT.OthDutyTaxCess | G24; min 0 (J24 default 0) |
| 4C(ix) | Total (i+ii+iii+iv+v+vi+vii+viii) | integer | ExciseCustomsVAT.TotExciseCustomsVAT | G25/K25 "Cix"; required; **L25 = SUM(J17:J24)** |
| 4D | Total Revenue from operations (Aiv + B+ Cix) | integer | TotRevenueFrmOperations | F26/K26 "4D"; required; **L26 = TradingAcc_RevenueTotal + TradingAcc_GrossRecieptsFromProfession + TradingAcc_TotalDutiesTaxesCess** |
| 5 | Closing Stock of Finished Goods | integer | ClsngStckOfFinishedStcks | E27; min 0 |
| 6 | Total of credits to Trading Account (4D + 5 ) | integer | TardingAccTotCred | E28; required; **L28 = TradingAcc_TotalRevenueFromOperations + TradingAcc_ClosingStockOfFinishedStocks** |
| 7 | Opening Stock of Finished Goods | integer | OpngStckOfFinishedStcks | E29; min 0 |
| 8 | Purchases (net of refunds and duty or tax, if any) | integer | Purchases | E30; min 0 |
| 9 | Direct Expenses (9i + 9ii + 9iii) | integer | DirectExpenses | E31; **L31 = SUM(TradingAcc_CarriageInward, TradingAcc_PowerAndFuel, SUM(TradingAcc_OtherDirectAmount))** |
| 9(i) | Carriage inward | integer | CarriageInward | F32; min 0 |
| 9(ii) | Power and fuel | integer | PowerAndFuel | F33; min 0 |
| 9(iii) | Other direct expenses | array header | OtherDirectExpenses[] | F34; Sl. No. / Nature of direct expense / Amount rows (row 35 headers); repeats |
| 9(iii) | Nature of direct expense | string | OtherDirectExpenses[].NatureOfDirectExpense | H35; required per row; maxLength 125 (H36:H37 validation = 125) |
| 9(iii) | Amount | integer | OtherDirectExpenses[].Amount | J35; required per row; min 0 |
| 9(iii) | Total | integer | DirectExpensesTotal | I38; required; **J38 = SUM(TradingAcc_OtherDirectAmount)** |
| 10 | Duties and taxes, paid or payable, in respect of goods and services purchased | header | DutyTaxPay.ExciseCustomsVAT | E40; object |
| 10(i) | Custom duty | integer | DutyTaxPay.ExciseCustomsVAT.CustomDuty | F41; min 0 |
| 10(ii) | Counter veiling duty | integer | DutyTaxPay.ExciseCustomsVAT.CounterVailDuty | F42; min 0 |
| 10(iii) | Special additional duty | integer | DutyTaxPay.ExciseCustomsVAT.SplAddDuty | F43; min 0 |
| 10(iv) | Union excise duty | integer | DutyTaxPay.ExciseCustomsVAT.UnionExciseDuty | F44; min 0 |
| 10(v) | Service Tax | integer | DutyTaxPay.ExciseCustomsVAT.ServiceTax | F45; min 0 |
| 10(vi) | VAT/ Sales tax | integer | DutyTaxPay.ExciseCustomsVAT.VATorSaleTax | F46; min 0 |
| 10(vii) | Central Goods & Service Tax (CGST) | integer | DutyTaxPay.ExciseCustomsVAT.CentralGoodServiceTax | F47; min 0 |
| 10(viii) | State Goods & Services Tax (SGST) | integer | DutyTaxPay.ExciseCustomsVAT.StateGoodServiceTax | F48; min 0 |
| 10(ix) | Integrated Goods & Services Tax (IGST) | integer | DutyTaxPay.ExciseCustomsVAT.IntegratedGoodServiceTax | F49; min 0 |
| 10(x) | Union Territory Goods & Services Tax (UTGST) | integer | DutyTaxPay.ExciseCustomsVAT.UnionTerrGoodServiceTax | F50; min 0 |
| 10(xi) | Any other tax, paid or payable | integer | DutyTaxPay.ExciseCustomsVAT.OthDutyTaxCess | F51; min 0 |
| 10(xii) | Total (10i + 10ii + 10iii + 10iv + 10v + 10vi + 10vii + 10viii + 10ix + 10x+10xi) | integer | DutyTaxPay.ExciseCustomsVAT.TotExciseCustomsVAT | F52/K52 "10xii"; required; **L52 = SUM(J41:J51)** |
| 11 | Cost of goods produced – Transferred from Manufacturing Account | integer | GoodsCostPrdcdFrmMA | E53; **L53 = ManuFactureAcc_CostOfGoodsProduced** (cross-sheet); min −99999999999999 |
| 12 | Gross Profit from Business/Profession - transferred to Profit and Loss account (6-7-8-9-10xii-11) | integer | GrossProfitFrmBusProf | E54; required; **L54 = TradingAcc_TotalOfCreditsToTradingAccount − TradingAcc_OpeningStockOfFinishedGoods − TradingAcc_Purchase…** (= 6 − 7 − 8 − 9 − 10xii − 11); min −99999999999999 |
| 12a | Turnover from Intraday Trading | integer | IntradayTradingTurnOver | D55/E55/K55 "12a"; min 0 (L55 = 0) |
| 12b | Income from Intraday Trading - transferred to Profit and Loss account | integer | IntradayTradingIncome | D56/E56/K56 "12b"; must not exceed 12a; min −99999999999999 (L56 lower bound) |
| 12c | Turnover from Futures & Options Trading | integer | TurnoverFutureTrd | D57/E57/K57 "12c"; min 0 (L57 = 0) |
| 12d | Income from Futures & Options Trading - transferred to Statement of Profit and Loss account | integer | IncomeFutureTrd | D58/E58/K58 "12d"; must not exceed 12c; min −99999999999999 (L58 lower bound) |

## The rules the sheet computes
Every formula below carries a rule and its cell reference (from `--formulas`):

- **J12** `= SUM(TradingAcc_RevenueAmount)` — Total of other operating revenues (item 4A iii), summed across the array Amount rows → `OperatingRevenueTotal`.
- **L14 (Aiv)** `= SUM(TradingAcc_SalesOfGoods, TradingAcc_SalesOfServices, SUM(TradingAcc_RevenueAmount))` — Sl.No. 4A(iv) = 4A(i) + 4A(ii) + 4A(iii total) → `SalesGrossReceiptsTotal`.
- **L25 (Cix)** `= SUM(J17:J24)` — Sl.No. 4C(ix) = total of 4Ci..4Cviii → `ExciseCustomsVAT.TotExciseCustomsVAT`.
- **L26 (4D)** `= TradingAcc_RevenueTotal + TradingAcc_GrossRecieptsFromProfession + TradingAcc_TotalDutiesTaxesCess` — Total Revenue from operations = Aiv + B + Cix → `TotRevenueFrmOperations`.
- **L28 (item 6)** `= TradingAcc_TotalRevenueFromOperations + TradingAcc_ClosingStockOfFinishedStocks` — Total of credits to Trading Account = 4D + 5 → `TardingAccTotCred`.
- **L31 (item 9)** `= SUM(TradingAcc_CarriageInward, TradingAcc_PowerAndFuel, SUM(TradingAcc_OtherDirectAmount))` — Direct Expenses = 9i + 9ii + 9iii → `DirectExpenses`.
- **J38 (item 9iii)** `= SUM(TradingAcc_OtherDirectAmount)` — Total of other direct expenses array → `DirectExpensesTotal`.
- **L52 (10xii)** `= SUM(J41:J51)` — Total duties/taxes on purchases = 10i..10xi → `DutyTaxPay.ExciseCustomsVAT.TotExciseCustomsVAT`.
- **L53 (item 11)** `= ManuFactureAcc_CostOfGoodsProduced` — Cost of goods produced pulled from the Manufacturing Account (cross-sheet) → `GoodsCostPrdcdFrmMA`.
- **L54 (item 12)** `= TradingAcc_TotalOfCreditsToTradingAccount − TradingAcc_OpeningStockOfFinishedGoods − TradingAcc_Purchase…` — Gross Profit = 6 − 7 − 8 − 9 − 10xii − 11 → `GrossProfitFrmBusProf`.
- **I10** `= 1`, **G11** `= G10+1`, **I11** `= I10+1` — auto-increment Sl.No. for the other-operating-revenues array template.
- **I36** `= 1`, **G37** `= G36+1`, **I37** `= I36+1` — auto-increment Sl.No. for the other-direct-expenses array template.

Cross-checks from `books/ITR-5/rules.json` (validators, not sheet formulas):
- 4A(iiic) must equal 4Aiii(a) + 4Aiii(b); 4A(iv) must equal 4A(i)+4A(ii)+4A(iiic).
- 4C(ix) must equal 4Ci+…+4Cviii; 4D must equal Aiv + B + Cix.
- Item 6 (Total of credits) must equal 4D + 5; item 9 total must equal 9i+9ii+9iii; item 10 total must equal 10i+…+10xi.
- Item 12 (Gross Profit) must equal 6 − 7 − 8 − 9 − 10xii − 11.
- **Negative values are not allowed other than in Sl.No. 11 and/or 12** (matches the schema: only `GoodsCostPrdcdFrmMA`, `GrossProfitFrmBusProf`, `IntradayTradingIncome`, `IncomeFutureTrd` allow the −99999999999999 lower bound; every other figure has min 0).
- Sl.No. 11 must equal Sl.No. 3 of Part A-Manufacturing Account.
- 12b must not exceed 12a; 12d must not exceed 12c.
- Sl.No. 13 in Part A-P&L = 12 + 12b + 12d of the Trading Account.

## Dropdowns
None. Every data-validation on this sheet (from `--dropdowns`) has `values: null` — they are numeric bounds or text-length limits, not enumerated lists:
- Numeric minimum 0 on the amount cells (J17–J24, L15, L25:L26, J6:J7, L14, J10:J11, J42:J51, J41, J37:J38, J32:J33, J36, L27, L29, L30, L55, L57).
- Numeric minimum −99999999999999 on L56 (12b income) and L58 (12d income).
- Text max-length: H10:H11 and H38 = 50 (other-operating-revenue Nature); H36:H37 = 125 (nature of direct expense).

There are no list-type dropdowns to enumerate on this sheet.

## What repeats and what is one figure
- **Repeats (arrays):** `OtherOperatingRevenueDtls[]` — item 4A(iii), other operating revenues (Sl. No. / Nature of other operating revenue / Amount; rows 9–11 template); `OtherDirectExpenses[]` — item 9(iii), other direct expenses (Sl. No. / Nature of direct expense / Amount; rows 35–37 template).
- **One figure (single value):** everything else — 4A(i), 4A(ii); the 4A(iv)/4C(ix)/4D totals; closing stock (5); credits total (6); opening stock (7); purchases (8); direct-expenses total (9); the 10i–10xii duties block; cost of goods produced (11); gross profit (12); and 12a–12d.

## Mandatory
Schema `required` keys for block `TradingAccount`: **DirectExpensesTotal**, **OperatingRevenueTotal**, **TotRevenueFrmOperations**, **TardingAccTotCred**, **GrossProfitFrmBusProf**.

Nested required keys (from `--leaves`, marked `*`): within `OtherOperatingRevenueDtls[]` each row requires `OperatingRevenueName` + `OperatingRevenueAmt`; within `OtherDirectExpenses[]` each row requires `NatureOfDirectExpense` + `Amount`; each `ExciseCustomsVAT` object (both the credits one and `DutyTaxPay.ExciseCustomsVAT`) requires `TotExciseCustomsVAT`.

## Hidden rows — not built
None. No row on this sheet carries the hidden (`H`) flag — every row in `--dump` prints as `r NNN :` (visible), none as `r NNNH:`. Rows 10–11 and 36–37 are not hidden items; they are the blank template rows backing the two nature-and-amount arrays (the `+1` Sl.No. auto-increments live on rows 11 and 37), represented by `OtherOperatingRevenueDtls[]` and `OtherDirectExpenses[]`, not as standalone items.

## What this means for the build
- Build item 4 down to 12d as one credits/debits statement. Credits (rows 4–28) = 4D (item 4) + Closing Stock (item 5), summed into item 6 (`TardingAccTotCred`). Debits (rows 29–54) = items 7 through 11. Gross Profit (item 12, `GrossProfitFrmBusProf`) is the computed residue.
- Wire the computed cells green / untypeable: `OperatingRevenueTotal` (J12), `SalesGrossReceiptsTotal` (L14), `ExciseCustomsVAT.TotExciseCustomsVAT` (L25), `TotRevenueFrmOperations` (L26), `TardingAccTotCred` (L28), `DirectExpenses` (L31), `DirectExpensesTotal` (J38), `DutyTaxPay.ExciseCustomsVAT.TotExciseCustomsVAT` (L52), and `GrossProfitFrmBusProf` (L54).
- Pull item 11 (`GoodsCostPrdcdFrmMA`, L53) from the Manufacturing Account sheet — do not let the user type it directly; it mirrors `ManuFactureAcc_CostOfGoodsProduced` and must equal Sl.No. 3 of Part A-Manufacturing Account.
- Allow negatives only on items 11 and 12 (`GoodsCostPrdcdFrmMA`, `GrossProfitFrmBusProf`) and on 12b/12d (`IntradayTradingIncome`, `IncomeFutureTrd`); enforce min 0 everywhere else.
- Enforce 12b ≤ 12a and 12d ≤ 12c at input; feed 12b into Schedule BP speculative income and 12 + 12b + 12d into the P&L "gross profit transferred" line (Sl.No. 13) per `rules.json`.
- Two "add row" arrays need the add/delete control and a running Sl.No.: each row is Nature (string — 50 chars for revenues, 125 chars for direct expenses) + Amount (integer, min 0). Keep the `DutyTaxPay` object nested exactly one level under `DutyTaxPay.ExciseCustomsVAT` so the 10i–10xii keys land correctly, distinct from the credits-side `ExciseCustomsVAT`.
- Note the ITR-5 numbering differs from ITR-3: here Direct Expenses is item 9 and Duties/taxes on purchases is item 10, and both `DirectExpenses` (item-9 grand total, L31) and `DirectExpensesTotal` (item-9iii array total, J38) exist as separate keys — the array total is the one marked `required`.
