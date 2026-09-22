# The book of Part A — Trading Account (Ind AS) · ITR-6, A.Y. 2026-27

Read row by row from the utility's **Part A-Trading Account Indas** sheet
(62 rows) and confirmed against the CBDT ITR-6 schema's `TradingAccountIndAS`.
Nothing here is invented; every label, item letter, dropdown and rule is the
department's own. This is the **Ind-AS** variant of the Trading Account, shown to
a company whose accounts are drawn up under the Indian Accounting Standards. Its
line structure matches the regular Trading Account; only the sheet, the schema
block and the "-Ind As" cross-reference suffix differ.

---

## 1 · Why this sheet exists and what it computes

The Trading Account is the middle of the three cost statements. It takes revenue
from operations (sales of goods and services, other operating revenues, duties
and taxes received, gross receipts from profession) plus closing stock of
finished goods on the credit side; and opening stock, purchases, direct
expenses, duties and taxes paid, and the cost of goods produced carried in from
the Manufacturing Account on the debit side. The balancing figure is the
**Gross Profit / Loss transferred to the Statement of Profit and Loss** (item 12).
Below it sit four speculative-trading lines — intraday and futures & options
turnover and income (12a–12d) — that also feed the P&L.

---

## 2 · The shape — credits, debits, and the gross profit

| Item | What it is | Kind |
|---|---|---|
| **4A** | Sales/Gross receipts of business (Ai sale of goods, Aii sale of services, Aiiic other operating revenues, Aiv total) | figures + table + computed |
| **4B** | Gross receipts from Profession | figure |
| **4C** | Duties, taxes and cess received or receivable (Ci–Cviii, Cix total) | figures + computed |
| **4D** | Total Revenue from operations (Aiv + B + Cix) | computed |
| **5** | Closing Stock of Finished Goods | figure |
| **6** | Total of credits to Trading Account (4D + 5) | computed |
| **7** | Opening Stock of Finished Goods | figure |
| **8** | Purchases (net of refunds and duty or tax, if any) | figure |
| **9** | Direct Expenses (9i + 9ii + 9iii) | figures + table + computed |
| **10** | Duties and taxes, paid or payable (10i–10xi, 10xii total) | figures + computed |
| **11** | Cost of goods produced – Transferred from Manufacturing Account | fed-in figure |
| **12** | Gross Profit/Loss from Business/Profession – transferred to Statement of Profit and Loss | computed |
| **12a–12d** | Intraday and Futures & Options turnover and income | figures |

---

## 3 · Credits — items 4A to 6

| Item | Label (verbatim) | Type | Schema key | Formula / derivation | Hidden? |
|---|---|---|---|---|---|
| **4A** | Sales/ Gross receipts of business (net of returns and refunds and duty or tax, if any) | group | — | — | no |
| **4Ai** | Sale of goods | integer ≥0 | `SaleOfGoods` | entered | no |
| **4Aii** | Sale of services | integer ≥0 | `SaleOfServices` | entered | no |
| **4Aiii** | Other operating revenues (specify nature and amount) | table | `OtherOperatingRevenueDtls[]` | Sl No · Nature of other operating revenue · Amount | no |
| — table col | Nature of other operating revenue | string | `OtherOperatingRevenueDtls[].OperatingRevenueName` | entered per row | no |
| — table col | Amount | integer | `OtherOperatingRevenueDtls[].OperatingRevenueAmt` | entered per row | no |
| **4Aiiic** | Total (iiia+iiib) | computed | `OperatingRevenueTotal` | sum of the table (rule A75) | no |
| **4Aiv** | Total(i+ii+iiic) | computed | `SalesGrossReceiptsTotal` | Ai + Aii + Aiiic (rule A76) | no |
| **4B** | Gross receipts from Profession | integer ≥0 | `GrossRcptFromProfession` | entered | no |
| **4C** | Duties, taxes and cess received or receivable in respect of goods and services sold or supplied | group | `ExciseCustomsVAT` | — | no |
| **4Ci** | Union Excise duties | integer ≥0 | `ExciseCustomsVAT.UnionExciseDuty` | entered | no |
| **4Cii** | Service Tax | integer ≥0 | `ExciseCustomsVAT.ServiceTax` | entered | no |
| **4Ciii** | VAT/ Sales tax | integer ≥0 | `ExciseCustomsVAT.VATorSaleTax` | entered | no |
| **4Civ** | Central Goods & Service Tax (CGST) | integer ≥0 | `ExciseCustomsVAT.CentralGoodServiceTax` | entered | no |
| **4Cv** | State Goods & Services Tax (SGST) | integer ≥0 | `ExciseCustomsVAT.StateGoodServiceTax` | entered | no |
| **4Cvi** | Integrated Goods & Services Tax (IGST) | integer ≥0 | `ExciseCustomsVAT.IntegratedGoodServiceTax` | entered | no |
| **4Cvii** | Union Territory Goods & Services Tax (UTGST) | integer ≥0 | `ExciseCustomsVAT.UnionTerrGoodServiceTax` | entered | no |
| **4Cviii** | Any other duty, tax and cess | integer ≥0 | `ExciseCustomsVAT.OthDutyTaxCess` | entered | no |
| **4Cix** | Total (i + ii + iii + iv +v+ vi+vii+viii) | computed | `ExciseCustomsVAT.TotExciseCustomsVAT` | Ci..Cviii (rule A77) | no |
| **4D** | Total Revenue from operations (Aiv + B +Cix) | computed | `TotRevenueFrmOperations` | Aiv + B + Cix (rule A78) | no |
| **5** | Closing Stock of Finished Goods | integer ≥0 | `ClsngStckOfFinishedStcks` | entered | no |
| **6** | Total of credits to Trading Account (4D + 5 ) | computed | `TardingAccTotCred` | 4D + 5 (rule A72; schema key spelled `Tarding`) | no |

---

## 4 · Debits — items 7 to 11

| Item | Label (verbatim) | Type | Schema key | Formula / derivation | Hidden? |
|---|---|---|---|---|---|
| **7** | Opening Stock of Finished Goods | integer ≥0 | `OpngStckOfFinishedStcks` | entered | no |
| **8** | Purchases (net of refunds and duty or tax, if any) | integer ≥0 | `Purchases` | entered | no |
| **9** | Direct Expenses (9i + 9ii + 9iii) | computed | `DirectExpenses` | 9i + 9ii + 9iii (rule A79) | no |
| **9i** | Carriage inward | integer ≥0 | `CarriageInward` | entered | no |
| **9ii** | Power and fuel | integer ≥0 | `PowerAndFuel` | entered | no |
| **9iii** | Other direct expenses | table + total | `TotOthDirectExpenses` | total of the table below | no |
| — table hdr | Nature of direct expenses | string | `OtherDirectExpenses[].NatureOfDirectExpense` | entered per row | no |
| — table col | Amount | integer | `OtherDirectExpenses[].Amount` | entered per row | no |
| **10** | Duties and taxes, paid or payable, in respect of goods and services purchased | group | `DutyTaxPay.ExciseCustomsVAT` | — | no |
| **10i** | Custom duty | integer ≥0 | `DutyTaxPay.ExciseCustomsVAT.CustomDuty` | entered | no |
| **10ii** | Counter veiling duty | integer ≥0 | `DutyTaxPay.ExciseCustomsVAT.CounterVailDuty` | entered | no |
| **10iii** | Special additional duty | integer ≥0 | `DutyTaxPay.ExciseCustomsVAT.SplAddDuty` | entered | no |
| **10iv** | Union excise duty | integer ≥0 | `DutyTaxPay.ExciseCustomsVAT.UnionExciseDuty` | entered | no |
| **10v** | Service Tax | integer ≥0 | `DutyTaxPay.ExciseCustomsVAT.ServiceTax` | entered | no |
| **10vi** | VAT/ Sales tax | integer ≥0 | `DutyTaxPay.ExciseCustomsVAT.VATorSaleTax` | entered | no |
| **10vii** | Central Goods & Service Tax (CGST) | integer ≥0 | `DutyTaxPay.ExciseCustomsVAT.CentralGoodServiceTax` | entered | no |
| **10viii** | State Goods & Services Tax (SGST) | integer ≥0 | `DutyTaxPay.ExciseCustomsVAT.StateGoodServiceTax` | entered | no |
| **10ix** | Integrated Goods & Services Tax (IGST) | integer ≥0 | `DutyTaxPay.ExciseCustomsVAT.IntegratedGoodServiceTax` | entered | no |
| **10x** | Union Territory Goods & Services Tax (UTGST) | integer ≥0 | `DutyTaxPay.ExciseCustomsVAT.UnionTerrGoodServiceTax` | entered | no |
| **10xi** | Any other tax, paid or payable | integer ≥0 | `DutyTaxPay.ExciseCustomsVAT.OthDutyTaxCess` | entered | no |
| **10xii** | Total (10i + 10ii + 10iii + 10iv + 10v + 10vi + 10vii + 10viii + 10ix + 10x+10xi) | computed | `DutyTaxPay.ExciseCustomsVAT.TotExciseCustomsVAT` | Ci..xi (rule A80) | no |
| **11** | Cost of goods produced – Transferred from Manufacturing Account | fed-in | `GoodsCostPrdcdFrmMA` | = item 3 of Manufacturing Account Ind AS (rule A71) | no |

---

## 5 · Gross profit and the speculative-trading lines — item 12

| Item | Label (verbatim) | Type | Schema key | Formula / derivation | Hidden? |
|---|---|---|---|---|---|
| **12** | Gross Profit/Loss from Business/Profession - transferred to Statement of Profit and Loss (6-7-8-9-10...) | computed | `GrossProfitFrmBusProf` | 6 − 7 − 8 − 9 − 10xii − 11 (rule A81) | no |
| **12a** | Turnover from Intraday Trading | integer ≥0 | `IntradayTradingTurnOver` | entered | no |
| **12b** | Income from Intraday Trading - transferred to Statement of Profit and Loss | integer | `IntradayTradingIncome` | entered (may be negative) | no |
| **12c** | Turnover from Futures & Options Trading | integer ≥0 | `TurnoverFutureTrd` | entered | no |
| **12d** | Income from Futures & Options Trading – transferred to Statement of Profit and Loss | integer | `IncomeFutureTrd` | entered (may be negative; rule A74) | no |

---

## 6 · Enums / dropdowns

**None with a value list.** The only data-validations are numeric bounds
(0 or −99,999,999,999,999 to 99,999,999,999,999) and character limits (50 chars
on the two "Nature" free-text columns, 125 on their amounts). There are no
picklists on this sheet.

---

## 7 · The rules the sheet computes (from the rules document)

| Rule | What it asserts |
|---|---|
| **A75** | 4Aiii(c) = 4Aiii(a) + 4Aiii(b) — the other-operating-revenue table total |
| **A76** | 4A(iv) total (i + ii + iiic) = 4A(i) + 4A(ii) + 4A(iiic) |
| **A77** | 4A(Cix) = 4Ci + 4Cii + 4Ciii + 4Civ + 4Cv + 4Cvi + 4Cvii + 4Cviii |
| **A78** | 4D Total Revenue from operations = Aiv + B + Cix |
| **A79** | Direct Expenses item 9 = 9i + 9ii + 9iii |
| **A80** | Item 10 Total = 10i + 10ii + … + 10xi |
| **A71** | Item 11 (Cost of goods produced) = item 3 of the Manufacturing Account (Ind AS) |
| **A72** | Item 6 (total of credits) = 4D + 5 |
| **A81** | Item 12 gross profit = 6 − 7 − 8 − 9 − 10xii − 11 |
| **A74** | Income from Futures & Options Trading transferred to P&L must reconcile with the P&L |

---

## 8 · Cross-sheet feeds

| Direction | Feed |
|---|---|
| **in** | Item 11 ← Manufacturing Account (Ind AS) item 3 "Cost of Goods Produced" |
| **out** | Item 12 (Gross Profit) → Statement of Profit and Loss (Ind AS) item 1, "Gross profit transferred from Trading Account (12+12b+12d)" |
| **out** | Items 12b and 12d (intraday and F&O income) → Statement of Profit and Loss credits, alongside gross profit |

---

## 9 · What repeats, what is mandatory

- **Repeatable:** the two free tables — Other operating revenues (`OtherOperatingRevenueDtls[]`)
  and Other direct expenses (`OtherDirectExpenses[]`), rows addable.
- Everything else is a single figure per line.
- Schema `required` on `TradingAccountIndAS`: the computed totals
  `OperatingRevenueTotal`, `SalesGrossReceiptsTotal`, `GrossRcptFromProfession`,
  the four GST lines under `ExciseCustomsVAT` with `TotExciseCustomsVAT`,
  `TotRevenueFrmOperations`, `TardingAccTotCred`, `OpngStckOfFinishedStcks`,
  `Purchases`, `CarriageInward`, `PowerAndFuel`, `TotOthDirectExpenses`, and
  `GrossProfitFrmBusProf`; the table rows require their name and amount when
  present. Optional lines (`SaleOfGoods`, `SaleOfServices`, `DirectExpenses`, the
  whole `DutyTaxPay` block, the four 12a–12d lines) are written only when carrying
  a value.

---

## 10 · Hidden rows

**None.** All content rows are visible; the addable-table template rows (10–13
and 37–40) carry no labels and are the blank rows the "add row" control clones.

---

## 11 · What this means for the build

1. Two computed sub-totals with free tables (4Aiii other operating revenues,
   9iii other direct expenses); render "add row" for each and total them.
2. Item 11 is a **fed line** from the Manufacturing Account Ind AS — show it as
   fed, not typed.
3. Item 12 is the balancing figure and may be negative (a gross loss); it and the
   two F&O/intraday income lines (12b, 12d) may go negative and feed the P&L.
4. Mind the schema's spelling `TardingAccTotCred` (transposed) — the export key
   must match it exactly.
