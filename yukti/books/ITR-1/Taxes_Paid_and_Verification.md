# The book of the Taxes Paid and Verification sheet — ITR-1 SAHAJ, A.Y. 2026-27

Read row by row from the utility's **Taxes Paid and Verification** sheet and
confirmed against the CBDT ITR-1 schema blocks **TaxPaid**, **Refund**,
**Verification** and **TaxPayments** (`section_map.json` → section `paid`;
`schema_tree.md` §10, §11, §12 and §18). This sheet closes the return: it totals
every category of tax already paid (**D12**), strikes the balance payable
(**D13**) or the refund (**D14**), collects the **bank account** details for the
refund, restates the reporting-only exempt income, and carries the **Verification**
declaration and the Tax-Return-Preparer block. Nothing here is invented; the
appendices list every schema leaf of the four mapped blocks, every live row
verbatim, and every dropdown value.

---

## 1 · Taxes paid — D12 (rows 3-10)

| Item | Label | Schema key |
|---|---|---|
| D12(a) | Total Advance Tax Paid (from item 21) | `TaxPaid.TaxesPaid.AdvanceTax` |
| D12(c) | Total TDS Claimed (Total from item 18 + item 19 + item 20) | `TaxPaid.TaxesPaid.TDS` |
| D12(d) | Total TCS Claimed (Total from item 22) | `TaxPaid.TaxesPaid.TCS` |
| D12(b) | Total Self Assessment Tax Paid (from item 21) | `TaxPaid.TaxesPaid.SelfAssessmentTax` |
| D12 | Total Taxes Paid D12(a+b+c+d) | `TaxPaid.TaxesPaid.TotalTaxesPaid` |
| D13 | Amount payable (D11−D12) (if D11>D12) | `TaxPaid.BalTaxPayable` |
| D14 | Refund (D12−D11) (if D12>D11) | `Refund.RefundDue` |

The four calculated fields (in white) are picked up from the other schedules —
advance tax and self-assessment tax from the **21 IT** challan table
(`TaxPayments`), TDS from items 18/19/20, TCS from item 22. D12 is their sum;
D13/D14 is the balance against **D11 Total Tax, Fee and Interest**.

## 2 · Bank accounts for refund (rows 11-12, 27-35)

**Enter your Bank Account number** and **IFS Code** for direct credit of any
refund. Then the schedule of **all Bank Accounts held in India** at any time
during the previous year (excluding dormant accounts): per row **IFS Code of the
Bank** (`AddtnlBankDetails[].IFSCCode`), **Name of the Bank**
(`AddtnlBankDetails[].BankName`), **Account Number**
(`AddtnlBankDetails[].BankAccountNo`), **Type of account**
(`AddtnlBankDetails[].AccountType`) and **Select Account for Refund Credit**
(`AddtnlBankDetails[].UseForRefund`). **Do you have a bank account in India** is
answered YES/NO. All bank accounts held at any time are reported, except dormant
accounts.

## 3 · Exempt income — reporting only (rows 13-26)

The reporting-only exempt-income grid (mirrors C3 on Income Details): Agriculture
Income (≤ Rs. 5000), Sec. 10(34) exempted dividend income, and an **Others** grid
with Nature of Income, Description (if 'Any Other' selected) and Amount, then the
**Total Amount**. This is for reporting purposes and income on which no tax is
payable.

## 4 · Verification (rows 42-52) and TRP (rows 49-60)

The **VERIFICATION** declaration: **I, (full name in block letters)**
(`Verification.Declaration.AssesseeVerName`), **son/daughter of**
(`Verification.Declaration.FatherName`), solemnly declare that to the best of my
knowledge and belief the information given in the return is correct and complete,
made **in my capacity as** (`Verification.Capacity`: Self / Representative),
**holding Permanent Account Number** (`Verification.Declaration.AssesseeVerPAN`),
**Date** (system date) and **Place** (`Verification.Place`).

If the return has been prepared by a **Tax Return Preparer (TRP)**: Identification
No. of TRP (`TaxReturnPreparer.IdentificationNoOfTRP`), Name of TRP
(`TaxReturnPreparer.NameOfTRP`) and, if the TRP is entitled to any reimbursement
from the Government, the amount thereof (`TaxReturnPreparer.ReImbFrmGov`).

## 5 · Cross-sheet feeds

**In:** D12(a)/(b) from `TaxPayments` (item 21 challans), D12(c) from the three
TDS tables, D12(d) from item 22 (TCS), D11 from the Income Details tax
computation. **Out:** `TaxPaid.BalTaxPayable` / `Refund.RefundDue` are the final
figures of the return; the bank block routes the refund; the Verification block
signs it.

---

## Appendix · Every schema leaf of the mapped blocks (full paths)
`*` = schema-required. Mapped blocks: TaxPaid, Refund, Verification, TaxPayments.
```
  -- TaxPaid --
* TaxPaid.TaxesPaid.AdvanceTax int
* TaxPaid.TaxesPaid.TDS int
* TaxPaid.TaxesPaid.TCS int
* TaxPaid.TaxesPaid.SelfAssessmentTax int
* TaxPaid.TaxesPaid.TotalTaxesPaid int
* TaxPaid.BalTaxPayable int
  -- Refund --
* Refund.RefundDue int
  Refund.BankAccountDtls.AddtnlBankDetails[].IFSCCode string
  Refund.BankAccountDtls.AddtnlBankDetails[].BankName string
  Refund.BankAccountDtls.AddtnlBankDetails[].BankAccountNo string
  Refund.BankAccountDtls.AddtnlBankDetails[].AccountType enum(AccountType)
  Refund.BankAccountDtls.AddtnlBankDetails[].UseForRefund bool
  -- Verification --
* Verification.Declaration.AssesseeVerName string
* Verification.Declaration.FatherName string
* Verification.Declaration.AssesseeVerPAN string
* Verification.Capacity enum(S/R)
* Verification.Place string
  -- TaxPayments (advance / self-assessment challans) --
  TaxPayments.TaxPayment[].BSRCode string
  TaxPayments.TaxPayment[].DateDep date
  TaxPayments.TaxPayment[].SrlNoOfChaln int
  TaxPayments.TaxPayment[].Amt int
* TaxPayments.TotalTaxPayments int
```

## Appendix · Every live row of the sheet, verbatim
```
r   3 : [C3] TAXES PAID  |  [E3] Total Taxes Paid PLEASE NOTE THAT CALCULATED FIELDS (IN WHITE) ARE PICKED UP FROM OTHER SCHEDULES AN
r   4 : [E4] D12(a)  |  [F4] Total Advance Tax Paid (from item 21)
r   5 : [E5] D12(c)  |  [F5] Total TDS Claimed (Total from item 18 + item 19 + item 20)
r   6 : [E6] D12(d)  |  [F6] Total TCS Claimed (Total from item 22)
r   7 : [E7] D12(b)  |  [F7] Total Self Assessment Tax Paid (from item 21)
r   8 : [D8] D12  |  [E8] Total Taxes Paid D12(a+b+c+d)
r   9 : [D9] D13  |  [E9] Amount payable (D11-D12) (if D11>D12)
r  10 : [D10] D14  |  [E10] Refund (D12-D11) (if D12>D11)
r  11H: [E11] Enter your Bank Account number (Refund if any will directly credited into Bank Account)
r  12H: [E12] IFS Code  |  [I12] (Select)
r  13H: [E13] Exempt income (For reporting Purposes)
r  14H: [E14] a
r  15H: [E15] b
r  16H: [E16] c  |  [F16] Others
r  17H: [F17] Sl.No  |  [G17] Nature of Income  |  [H17] Description ( If 'Any Other' selected)  |  [I17] Amount
r  18H: [G18] Agriculture Income (≤ Rs.5000)  |  [H18] NA
r  19H: [G19] Sec.10(34) (Exempted Dividend Income)  |  [H19] NA
r  20H: [G20] (Select)  |  [H20] NA
r  21H: [G21] (Select)  |  [H21] NA
r  22H: [G22] (Select)  |  [H22] NA
r  23H: [G23] (Select)  |  [H23] NA
r  26H: [E26] e  |  [F26] Total Amount
r  27H: [E27] Do you have a bank account in India (Non-residents claiming refund with no bank account in India may  |  [I27] YES
r  28H: [E28] Total number of savings and current bank accounts held by you at any time during the previous year (
r  29H: [E29] Provide the details below
r  30H: [E30] Details of all Bank Accounts held in India at any time during the previous year (excluding dormant a
r  31 : [D31] (i)  |  [E31] Details of all Bank Accounts held in India at any time during the previous year (excluding dormant a
r  32 : [E32] Sl.No.  |  [F32] IFS Code of the Bank  |  [G32] Name of the Bank  |  [H32] Account Number  |  [I32] Type of account  |  [J32] Select Account for Refund Credit
r  36 : [D36] Note:
r  37 : [D37] 1.All bank accounts held at any time are to be reported, except dormant A/c. 2. In case of multiple 
r  41H: [G41] (Do Not Delete Blank Rows)
r  42 : [C42] VERIFICATION
r  43 : [C43] I, (full name in block letters),  |  [H43] son/daughter of
r  45 : [C45] solemnly declare that to the best of my knowledge and belief, the information given in the return is
r  46 : [C46] of the Income-tax Act, 1961. I further declare that I am making this return in my capacity as  |  [H46] (Select)  |  [I46] and I am also competent to make
r  47 : [C47] this return and verify it.  |  [G47] I am holding Permanent Account Number
r  48 : [C48] Date (System Date)  |  [H48] Place
r  49 : [D49] If the return has been prepared by a Tax Return Preparer (TRP) give further details below:
r  50 : [D50] Identification No. of TRP  |  [H50] NAME OF TRP
r  51 : [D51] If TRP is entitled for any reimbursement from the Government, amount thereof
r  52 : [D52] NOTE : 1. Submission date is the system date of e-Filing portal of Income Tax Department. The same i
r  57H: [D57] If the return has been prepared by a Tax Return Preparer (TRP) give further details as below:
r  58H: [C58] Identification No of TRP  |  [G58] Name of TRP
r  60H: [D60] If TRP is entitled for any reimbursement from the Government, amount thereof (to be filled by TRP)
```

## Appendix · Every dropdown value, verbatim

**Cells `I12`** — source `"(Select),Savings,Current"` — 3 values:
```
(Select) | Savings | Current
```

**Cells `I27`** — source `"(Select),YES,NO"` — 3 values:
```
(Select) | YES | NO
```

**Cells `I33:I34`** — source `"(Select),Savings Account,Current Account,Cash Credit Account,Over draft account,Non Resident Account,Other"` — 7 values:
```
(Select) | Savings Account | Current Account | Cash Credit Account | Over draft account | Non Resident Account | Other
```

