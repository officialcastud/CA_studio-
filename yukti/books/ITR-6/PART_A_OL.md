# The book of Part A — OL (company under liquidation) · ITR-6, A.Y. 2026-27

Read row by row from the utility's **PART-A OL** sheet (53 rows) and confirmed
against the CBDT ITR-6 schema's `PARTA_OL`. Nothing here is invented; every
label, item letter, dropdown and rule is the department's own.

---

## 1 · Why this sheet exists and what it computes

Part A – OL is the **Receipt and payment account of company under liquidation**.
A company in liquidation does not present a normal Balance Sheet and P&L; instead
the liquidator reports the cash movements — the opening balance of cash and bank,
what was received (interest, dividend, sale of assets, realisation of debtors,
other receipts) and what was paid (repayment of secured and unsecured loans, to
creditors, commission, other payments) — ending on the closing balance. Per rule
**A174**, this schedule is mandatory when the assessee is a company under
liquidation, and it substitutes for the Balance Sheet / Manufacturing / Trading /
P&L sheets in that case.

It is a pure cash statement: three totals of opening balance, receipts and
payments, and the two grand totals that must tie.

---

## 2 · The shape — opening balance, receipts, payments, closing balance

| Item | What it is | Kind |
|---|---|---|
| **1** | Opening balance (i cash in hand, ii bank, iii total) | figures + computed |
| **2** | Receipts (2i–2vi) | figures + two tables + computed |
| **3** | Total of opening balance and receipts | computed |
| **4** | Payments (4i–4vi) | figures + a table + computed |
| **5** | Closing balance (5i cash in hand, 5ii bank, 5iii total) | figures + computed |
| **6** | Total of closing balance and payments (4vi + 5iii) | computed |

---

## 3 · Opening balance and receipts — items 1 and 2

| Item | Label (verbatim) | Type | Schema key | Formula / derivation | Hidden? |
|---|---|---|---|---|---|
| **1** | Opening balance | group | `OpeningBal` | — | no |
| **1i** | Cash in hand | integer ≥0 | `OpeningBal.CashInHand` | entered | no |
| **1ii** | Bank | integer ≥0 | `OpeningBal.CashInBank` | entered | no |
| **1iii** | Total opening balance (i + ii) | computed | `OpeningBal.TotalOpenBal` | 1i + 1ii | no |
| **2** | Receipts | group | `Receipts` | — | no |
| **2i** | Interest | integer ≥0 | `Receipts.Interest` | entered | no |
| **2ii** | Dividend | integer ≥0 | `Receipts.Dividend` | entered | no |
| **2iii** | Sale of assets (pls. specify nature and amount) | table | `Receipts.SaleOfAssets.SaleOfAssetsDtls[]` | Sl.No · Nature · Amount | no |
| — table col | Nature | string | `Receipts.SaleOfAssets.SaleOfAssetsDtls[].OthNatOfInc` | entered per row | no |
| — table col | Amount | integer | `Receipts.SaleOfAssets.SaleOfAssetsDtls[].OthAmount` | entered per row | no |
| **2iiib** | Total (of sale of assets) | computed | `Receipts.TotalSaleofAssets` | sum of the 2iii table | no |
| **2iv** | Realization of dues/debtors | integer ≥0 | `Receipts.RlznDuesDebtors` | entered | no |
| **2v** | Others (pls. specify whether revenue/capital, nature and amount) | table | `Receipts.OthersIncRec.OthersIncDtls[]` | Sl.No · Nature of receipt · Whether revenue/capital · Amount | no |
| — table col | Nature of receipt | string | `Receipts.OthersIncRec.OthersIncDtls[].OthNatOfInc` | entered per row | no |
| — table col | Whether revenue/capital | enum | `Receipts.OthersIncRec.OthersIncDtls[].TypeOfIncome` | dropdown (see §6) | no |
| — table col | Amount | integer | `Receipts.OthersIncRec.OthersIncDtls[].OthAmount` | entered per row | no |
| **2vb** | Total of other receipts | computed | `Receipts.TotOthersReceiptsOnly` | sum of the 2v table | no |
| **2vi** | Total receipts (2i + 2ii + 2iiib+ 2iv + 2vb) | computed | `Receipts.TotalOfReceipts` | 2i + 2ii + 2iiib + 2iv + 2vb | no |
| **3** | Total of opening balance and receipts | computed | `TotalOpenReceipts` | 1iii + 2vi | no |

---

## 4 · Payments, closing balance — items 4, 5, 6

| Item | Label (verbatim) | Type | Schema key | Formula / derivation | Hidden? |
|---|---|---|---|---|---|
| **4** | Payments | group | `Payments` | — | no |
| **4i** | Repayment of secured loan | integer ≥0 | `Payments.RepaymentSecuredloan` | entered | no |
| **4ii** | Repayment of unsecured loan | integer ≥0 | `Payments.RepaymentUnsecuredloan` | entered | no |
| **4iii** | Repayment to creditors | integer ≥0 | `Payments.RepaymentCreditors` | entered | no |
| **4iv** | Commission | integer ≥0 | `Payments.Commission` | entered | no |
| **4v** | Others (pls. specify) | table | `Payments.OthersPayments.OthersPaymentsDtls[]` | Sl.No · Nature of payment · Amount | no |
| — table col | Nature of payment | string | `Payments.OthersPayments.OthersPaymentsDtls[].OthNatOfInc` | entered per row | no |
| — table col | Amount | integer | `Payments.OthersPayments.OthersPaymentsDtls[].OthAmount` | entered per row | no |
| **4vb** | Total of other payments | computed | `Payments.TotalOthersPayments` | sum of the 4v table | no |
| **4vi** | Total payments (4i + 4ii + 4iii + 4iv + 4vb) | computed | `Payments.TotalPayments` | 4i + 4ii + 4iii + 4iv + 4vb | no |
| **5** | Closing balance | group | `ClosingStock` | — | no |
| **5i** | Cash in hand | integer ≥0 | `ClosingStock.CashInHand` | entered | no |
| **5ii** | Bank | integer ≥0 | `ClosingStock.CashInBank` | entered | no |
| **5iii** | Total of closing balance (5i + 5ii) | computed | `ClosingStock.TotalClBal` | 5i + 5ii | no |
| **6** | Total of closing balance and payments (4vi + 5iii) | computed | `TotalClPaymnts` | 4vi + 5iii | no |

Note the schema names the closing-balance object `ClosingStock` (a carried-over
name), not "ClosingBal" — write the key exactly.

---

## 5 · Cross-check the two grand totals

The account balances when **item 3 (opening + receipts) = item 6 (payments +
closing)**. That is the receipt-and-payment identity for a liquidation account;
the build should surface it as a live check.

---

## 6 · Enums / dropdowns

One dropdown, on the "Others" receipts table (item 2v), column **Whether
revenue/capital** (`TypeOfIncome`):

| Value |
|---|
| (Select) |
| Revenue |
| Capital |

No other cell on the sheet has a picklist; all remaining validations are numeric
bounds (0 or −99,999,999,999,999 to the 14-digit maximum) or a 50-character limit
on the "Nature" free-text columns.

The header cell **"Count of Entries"** (column P, row 4) is a utility helper that
displays how many rows each table currently holds; it is not a filed field.

---

## 7 · Cross-sheet feeds

| Direction | Feed |
|---|---|
| trigger | Part A – General: when the company is **under liquidation**, this schedule becomes mandatory (rule A174) and the regular BS / Manufacturing / Trading / P&L are not required |
| in | The closing balance ties to the company's own cash and bank records; there is no automatic feed from another schedule |

There is no feed to Part B-TI: a liquidation receipt-and-payment account reports
cash movements, not taxable income.

---

## 8 · What repeats, what is mandatory

- **Repeatable:** the three free tables — Sale of assets (`SaleOfAssetsDtls[]`),
  Others receipts (`OthersIncDtls[]`), Others payments (`OthersPaymentsDtls[]`),
  rows addable.
- Everything else is a single figure per line.
- The schema marks essentially every total and line on `PARTA_OL` as required
  (the block is either present in full or absent); write the whole block when the
  company is under liquidation.

---

## 9 · Hidden rows

**None.** All content rows are visible; the blank rows inside the three tables
(13–17, 22–24, 37–39) are the addable-row templates.

---

## 10 · What this means for the build

1. Render it only when Part A – General flags the company as under liquidation;
   otherwise the regular financial-statement sheets apply.
2. Three "add row" tables; the "Others" receipts table alone carries the
   revenue/capital dropdown.
3. Two grand totals (items 3 and 6) must equal; show the balancing check.
4. Use the schema's exact key names, including `ClosingStock` for the closing
   balance object and `TotOthersReceiptsOnly` / `TotalClPaymnts`.
