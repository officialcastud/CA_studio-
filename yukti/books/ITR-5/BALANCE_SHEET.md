# The book of Part A-BS — Balance Sheet · ITR-5, A.Y. 2026-27

Read row by row from the utility's **BALANCE_SHEET** sheet (rows 3–130, one
hidden), with the hidden-row flag, the L/J-column formulas, the numeric
validations, and confirmed against schema block **PARTA_BS**.

Sheet header (r3, full text from `sources/ITR-5/utility/xl/sharedStrings.xml`):
*"Balance Sheet as on 31st March, 2026 OR DATE OF DISSOLUTION (fill items A and
B in a case where regular books of accounts are maintained, otherwise fill item
C)."*

---

## 1 · When it applies · mandatory

**Balance Sheet particulars are mandatory** for a firm/AOP/BOI etc. filing
ITR-5 that carries on business or profession — either the **regular books**
statement (parts A + B) **or** the **No-account case** (part C).

- `rules.json` n=249 (cat A): *"Balance sheet particulars at 'Regular books of
  accounts' or at 'No accounts' (S.No C) is mandatory."*
- `rules.json` n=10 (cat A): *"Assessee are required to fill in No books of
  accounts in Balance sheet and P&L if 'whether you have maintained the …'"* —
  i.e. part C is the path when regular books are **not** maintained.
- VBA defect check (`sources/ITR-5/vba_text.txt` l.1588): *"Field no. 5 Sources
  of funds (1c + 2c + 3 + 4iii) and field no. C … in 'schedule Balance sheet' is
  equal to zero AND Income chargeable under 'Profits and Gains from Business or
  Profession' at Sl.No D in Schedule BP is greater than 1.2 lakh → Please ensure
  that the relevant fields of Profit & Loss and Balance Sheet are filled else
  Return of Income may be treated as defective u/s 139(9)."*

The schema requires blocks `FundSrc` and `FundApply`; `NoBooksOfAccBS` is the
alternate (not in the schema `required` list).

---

## 2 · The shape — three parts

| Part | Sheet ref | What it is | Kind |
|---|---|---|---|
| **A** | r4–r37, `FundSrc` | Sources of funds — five numbered heads | figures |
| **B** | r38–r125, `FundApply` | Application of funds — five numbered heads | figures |
| **C** | r126–r130, `NoBooksOfAccBS` | No-account case — four figures | figures |

Everything is a rupee figure in the **J column** (the input amount) with
running totals in the **L/K columns**. No repeating tables — every line is one
figure. Part A and Part B are the regular-books statement; Part C is filled
instead when books are not maintained.

---

## 3 · Part A — Sources of funds (`FundSrc`)

| Sl. | Sheet ref | Field | Type | Schema key (`PARTA_BS.`) | Rule |
|---|---|---|---|---|---|
| 1a | r6 K6 `a` | Partners' / members' capital | figure | `FundSrc.PartnerOrMemberFund.PartnerOrMemberCap` | may be negative (min −99999999999999) |
| 1b | r7 | Reserves and Surplus (head) | | | |
| 1bi | r8 I8 `bi` | Revaluation Reserve | figure | `FundSrc.PartnerOrMemberFund.ResrNSurp.RevResr` | |
| 1bii | r9 I9 `bii` | Capital Reserve | figure | `FundSrc.PartnerOrMemberFund.ResrNSurp.CapResr` | |
| 1biii | r10 I10 `biii` | Statutory Reserve | figure | `FundSrc.PartnerOrMemberFund.ResrNSurp.StatResr` | |
| 1biv | r11 I11 `biv` | Any other Reserve | figure | `FundSrc.PartnerOrMemberFund.ResrNSurp.OthResr` | |
| 1bv | r12 I12 `bv` | Credit balance of Profit and loss account | figure | `FundSrc.PartnerOrMemberFund.ResrNSurp.CreditBalOfPLAccount` | |
| 1bvi | r13 K13 `bvi` | Total (bi + bii + biii + biv + bv) | computed | `FundSrc.PartnerOrMemberFund.ResrNSurp.TotResrNSurp` | `L13 = SUM(J8:J12)` |
| 1c | r14 K14 `1c` | Total partners'/ members' fund (a + bvi) | computed | `FundSrc.PartnerOrMemberFund.TotPartnerOrMemberFund` | `L14 = BS.TotResrNSurp + BS.PartnerOrMemberCap`; may be negative |
| 2a | r16 | Secured loans (head) | | | |
| 2ai | r17 I17 `ai` | Foreign Currency Loans | figure | `FundSrc.LoanFunds.SecrLoan.ForeignCurrLoan` | |
| 2aii | r18 | Rupee Loans (head) | | | |
| 2aiiA | r19 I19 `iiA` | From Banks | figure | `FundSrc.LoanFunds.SecrLoan.RupeeLoan.FrmBank` | |
| 2aiiB | r20 I20 `iiB` | From others | figure | `FundSrc.LoanFunds.SecrLoan.RupeeLoan.FrmOthrs` | |
| 2aiiC | r21 I21 `iiC` | Total ( iiA + iiB) | computed | `FundSrc.LoanFunds.SecrLoan.RupeeLoan.TotRupeeLoan` | `J21 = SUM(J19:J20)` |
| 2aiii | r22 K22 `aiii` | Total secured loans (ai + iiC) | computed | `FundSrc.LoanFunds.SecrLoan.TotSecrLoan` | `L22 = BS.ForeignCurrLoan + BS.TotRupeeLoan` |
| 2b | r23 | Unsecured loans (including Deposits) (head) | | | |
| 2bi | r24 I24 `bi` | Foreign Currency Loans | figure | `FundSrc.LoanFunds.UnsecrLoan.ForeignCurrencyLoans` | |
| 2bii | r25 | Rupee Loans (head) | | | |
| 2biiA | r26 I26 `iiA` | From Banks | figure | `FundSrc.LoanFunds.UnsecrLoan.RupeeLoan.FrmBank` | |
| 2biiB | r27 I27 `iiB` | From persons specified in section 40A(2)(b) of the I. T. Act | figure | `FundSrc.LoanFunds.UnsecrLoan.RupeeLoan.FrmPersonSpcfdUs40A2b` | |
| 2biiC | r28 I28 `iiC` | From others | figure | `FundSrc.LoanFunds.UnsecrLoan.RupeeLoan.FrmOthrs` | |
| 2biiD | r29 I29 `iiD` | Total Rupee Loans ( iiA + iiB + iiC) | computed | `FundSrc.LoanFunds.UnsecrLoan.RupeeLoan.TotRupeeLoan` | `J29 = SUM(J26:J28)` |
| 2biii | r30 K30 `biii` | Total unsecured loans (bi + iiD) | computed | `FundSrc.LoanFunds.UnsecrLoan.TotUnSecrLoan` | `L30 = BSUnSec.TotRupeeLoan + BSUnSec.ForeignCurrencyLoans` |
| 2c | r31 K31 `2c` | Total Loan Funds (aiii + biii) | computed | `FundSrc.LoanFunds.TotLoanFund` | `L31 = BS.TotUnSecrLoan + BS.TotSecrLoan` |
| 3 | r32 | Deferred tax liability | figure | `FundSrc.DeferredTax` | |
| 4 | r33 | Advances (head) | | | |
| 4i | r34 I34 `i` | From persons specified in section 40A(2)(b) of the I. T. Act | figure | `FundSrc.Advances.FrmPersonSpcfdUs40A2b` | |
| 4ii | r35 I35 `ii` | From Others | figure | `FundSrc.Advances.FrmOthers` | |
| 4iii | r36 K36 `4iii` | Total Advances (i + ii) | computed | `FundSrc.Advances.TotalAdvances` | `L36 = SUM(J34:J35)` |
| 5 | r37 | Sources of funds (1c + 2c + 3 + 4iii) | computed | `FundSrc.TotFundSrc` | `L37 = BS.DeferredTax + BS.TotLoanFund + BS.TotPartnerOrMemberFund + BSAdv.TotalAdvances`; may be negative |

---

## 4 · Part B — Application of funds (`FundApply`)

| Sl. | Sheet ref | Field | Type | Schema key (`PARTA_BS.`) | Rule |
|---|---|---|---|---|---|
| 1 | r39 | Fixed assets (head) | | | |
| 1a | r40 I40 `1a` | Gross: Block | figure | `FundApply.FixedAsset.GrossBlock` | schema note: *"Gross Block will include value of land."* |
| 1b | r41 I41 `1b` | Depreciation | figure | `FundApply.FixedAsset.Depreciation` | |
| 1c | r42 I42 `1c` | Net Block (a – b) | computed | `FundApply.FixedAsset.NetBlock` | `J42 = MAX(J40 − J41, 0)` — floored at 0 |
| 1d | r43 I43 `1d` | Capital work-in-progress | figure | `FundApply.FixedAsset.CapWrkProg` | |
| 1e | r44 K44 `1e` | Total (1c + 1d) | computed | `FundApply.FixedAsset.TotFixedAsset` | `L44 = J42 + J43` |
| 2a | r46 | Long-term investments (head) | | | |
| 2ai | r47 I47 `i` | Investment in property | figure | `FundApply.Investments.LongTermInv.InvInProperty` | |
| 2aii | r48 | Equity instruments (head) | | | |
| 2aiiA | r49 I49 `A` | Listed equities | figure | `FundApply.Investments.LongTermInv.EquityInstruments.ListedEquities` | |
| 2aiiB | r50 I50 `B` | Unlisted equities | figure | `FundApply.Investments.LongTermInv.EquityInstruments.UnListedEquities` | |
| 2aiiC | r51 I51 `iiC` | Total | computed | `FundApply.Investments.LongTermInv.EquityInstruments.Total` | `J51 = BS.ListedEquities + BS.UnListedEquities` |
| 2aiii | r52 I52 `iii` | Preference Shares | figure | `FundApply.Investments.LongTermInv.PreferenceShares` | |
| 2aiv | r53 I53 `iv` | Government or trust securities | figure | `FundApply.Investments.LongTermInv.GovtOrTrustSecurities` | |
| 2av | r54 I54 `v` | Debenture or bonds | figure | `FundApply.Investments.LongTermInv.DebenturesOrBonds` | |
| 2avi | r55 I55 `vi` | Mutual Funds | figure | `FundApply.Investments.LongTermInv.MutualFunds` | |
| 2avii | r56 I56 `vii` | Others | figure | `FundApply.Investments.LongTermInv.Others` | |
| 2aviii | r57 K57 `aviii` | Total Long-term investments (i + iiC + iii + iv + v + vi + vii) | computed | `FundApply.Investments.LongTermInv.TotLongTermInv` | `L57 = SUM(J52:J56) + BS.Total + BS.InvInProperty` |
| 2b | r58 | Short-term investments (head) | | | |
| 2bi | r59 | Equity instruments (head) | | | |
| 2biA | r60 I60 `A` | Listed equities | figure | `FundApply.Investments.ShortTermInv.EquityInstruments.ListedEquities` | |
| 2biB | r61 I61 `B` | Unlisted equities | figure | `FundApply.Investments.ShortTermInv.EquityInstruments.UnListedEquities` | |
| 2biC | r62 I62 `iC` | Total | computed | `FundApply.Investments.ShortTermInv.EquityInstruments.Total` | `J62 = BSS.UnListedEquities + BSS.ListedEquities` |
| 2bii | r63 I63 `ii` | Preference Shares | figure | `FundApply.Investments.ShortTermInv.PreferenceShares` | |
| 2biii | r64 I64 `iii` | Government or trust securities | figure | `FundApply.Investments.ShortTermInv.GovtOrTrustSecurities` | |
| 2biv | r65 I65 `iv` | Debenture or bonds | figure | `FundApply.Investments.ShortTermInv.DebenturesOrBonds` | |
| 2bv | r66 I66 `v` | Mutual Funds | figure | `FundApply.Investments.ShortTermInv.MutualFunds` | |
| 2bvi | r67 I67 `vi` | Others | figure | `FundApply.Investments.ShortTermInv.Others` | |
| 2bvii | r68 K68 `bvii` | Total Short-term investments (iC + ii + iii + iv + v + vi) | computed | `FundApply.Investments.ShortTermInv.TotShortTermInv` | `L68 = SUM(J63:J67) + BSS.Total` |
| 2c | r69 K69 `2c` | Total investments (aviii + bvii) | computed | `FundApply.Investments.TotInvestments` | `L69 = L68 + L57` |
| 3a | r71 | Current assets (head) | | | |
| 3ai | r72 | Inventories (head) | | | |
| 3aiA | r73 I73 `iA` | Raw materials | figure | `FundApply.CurrAssetLoanAdv.CurrAsset.Inventories.RawMatl` | |
| 3aiB | r74 I74 `iB` | Work in progress | figure | `FundApply.CurrAssetLoanAdv.CurrAsset.Inventories.WorkInProgress` | |
| 3aiC | r75 I75 `iC` | Finished Goods | figure | `FundApply.CurrAssetLoanAdv.CurrAsset.Inventories.FinOrTradGood` | |
| 3aiD | r76 I76 `iD` | Stock-in-trade (in respect of goods acquired for trading) | figure | `FundApply.CurrAssetLoanAdv.CurrAsset.Inventories.StkInTrade` | |
| 3aiE | r77 I77 `iE` | Stores/consumables including packing material | figure | `FundApply.CurrAssetLoanAdv.CurrAsset.Inventories.StoresConsumables` | |
| 3aiF | r78 I78 `iF` | Loose tools | figure | `FundApply.CurrAssetLoanAdv.CurrAsset.Inventories.LooseTools` | |
| 3aiG | r79 I79 `iG` | Others | figure | `FundApply.CurrAssetLoanAdv.CurrAsset.Inventories.Others` | |
| 3aiH | r80 K80 `iH` | Total (iA + iB + iC + iD + iE + iF + iG) | computed | `FundApply.CurrAssetLoanAdv.CurrAsset.Inventories.TotInventries` | `L80 = SUM(J73:J79)` |
| 3aii | r81 | Sundry Debtors (head) | | | |
| 3aiiA | r82 I82 `A` | Outstanding for more than one year | figure | `FundApply.CurrAssetLoanAdv.CurrAsset.SundryDebtorDtls.OutstandindMorethanOneYr` | |
| 3aiiB | r83 I83 `B` | Others | figure | `FundApply.CurrAssetLoanAdv.CurrAsset.SundryDebtorDtls.Others` | |
| 3aiiC | r84 K84 `iiC` | Total Sundry Debtors | computed | `FundApply.CurrAssetLoanAdv.CurrAsset.SundryDebtorDtls.TotalSundryDebtors` | `L84 = SUM(J82:J83)` |
| 3aiii | r85 | Cash and Bank Balances (head) | | | |
| 3aiiiA | r86 I86 `iiiA` | Balance with banks | figure | `FundApply.CurrAssetLoanAdv.CurrAsset.CashOrBankBal.BankBal` | |
| 3aiiiB | r87 I87 `iiiB` | Cash-in-hand | figure | `FundApply.CurrAssetLoanAdv.CurrAsset.CashOrBankBal.CashinHand` | |
| 3aiiiC | r88 I88 `iiiC` | Others | figure | `FundApply.CurrAssetLoanAdv.CurrAsset.CashOrBankBal.Others` | |
| 3aiiiD | r89 K89 `iiiD` | Total Cash and cash equivalents (iiiA + iiiB + iiiC) | computed | `FundApply.CurrAssetLoanAdv.CurrAsset.CashOrBankBal.TotCashOrBankBal` | `L89 = J87 + J86 + J88` |
| 3aiv | r90 K90 `aiv` | Other Current Assets | figure | `FundApply.CurrAssetLoanAdv.CurrAsset.OthCurrAsset` | |
| 3av | r91 K91 `av` | Total current assets (iH + iiC + iiiD + aiv) | computed | `FundApply.CurrAssetLoanAdv.CurrAsset.TotCurrAsset` | `L91 = BS.TotCashOrBankBal + BS.SundryDebtors + BS.TotInventries + BS.OthCurrAsset` |
| 3b | r92 | Loans and advances (head) | | | |
| 3bi | r93 I93 `bi` | Advances recoverable in cash or in kind or for value to be received | figure | `FundApply.CurrAssetLoanAdv.LoanAdv.AdvRecoverable` | |
| 3bii | r94 I94 `bii` | Deposits, loans and advances to corporates and others | figure | `FundApply.CurrAssetLoanAdv.LoanAdv.Deposits` | |
| 3biii | r95 I95 `biii` | Balance with Revenue Authorities | figure | `FundApply.CurrAssetLoanAdv.LoanAdv.BalWithRevAuth` | |
| 3biv | r96 K96 `biv` | Total (bi + bii + biii) | computed | `FundApply.CurrAssetLoanAdv.LoanAdv.TotLoanAdv` | `L96 = SUM(J93:J95)` |
| 3bv | r97 | Loans and advances included in biv which is (head) | | | |
| 3bv·a | r98 I98 `a` | for the purpose of business or profession | figure | `FundApply.CurrAssetLoanAdv.LoanAdv.LoanAdvIncluded.PurposeOFBusOrProf` | |
| 3bv·b | r99 I99 `b` | not for the purpose of business or profession | figure | `FundApply.CurrAssetLoanAdv.LoanAdv.LoanAdvIncluded.NotForPurposeOFBusOrProf` | |
| 3c | r100 K100 `3c` | Total (av + biv) | computed | `FundApply.CurrAssetLoanAdv.TotCurrAssetLoanAdv` | `L100 = BS.TotLoanAdv + BS.TotCurrAsset` |
| 3d | r101 | Current liabilities and provisions (head) | | | |
| 3di | r102 | Current liabilities (head) | | | |
| 3diA | r103 | Sundry Creditors (head) | | | |
| 3diA·1 | r104 | Outstanding for more than one year | figure | `FundApply.CurrAssetLoanAdv.CurrLiabilitiesProv.CurrLiabilities.SundryCreditorDtls.OutstandindMorethanOneYr` | |
| 3diA·2 | r105 | Others | figure | `FundApply.CurrAssetLoanAdv.CurrLiabilitiesProv.CurrLiabilities.SundryCreditorDtls.Others` | |
| 3diA·3 | r106 I106 `A3` | Total(1+2) | computed | `FundApply.CurrAssetLoanAdv.CurrLiabilitiesProv.CurrLiabilities.SundryCreditorDtls.TotalSundryCreditors` | `J106 = SUM(J104:J105)` |
| 3diB | r107 I107 `iB` | Liability for Leased Assets | figure | `FundApply.CurrAssetLoanAdv.CurrLiabilitiesProv.CurrLiabilities.LiabForLeasedAsset` | |
| 3diC | r108 I108 `iC` | Interest Accrued and due on borrowings | figure | `FundApply.CurrAssetLoanAdv.CurrLiabilitiesProv.CurrLiabilities.AccrIntonLeasedAsset` | schema key name reads *"LeasedAsset"* but the sheet label is *Interest Accrued and due on borrowings* — map verbatim |
| 3diD | r109 I109 `iD` | Interest accrued but not due on borrowings | figure | `FundApply.CurrAssetLoanAdv.CurrLiabilitiesProv.CurrLiabilities.AccrIntNotDue` | |
| 3diE | r110 I110 `iE` | Income received in advance | figure | `FundApply.CurrAssetLoanAdv.CurrLiabilitiesProv.CurrLiabilities.IncRecvdInAdv` | |
| 3diF | r111 I111 `iF` | Other payables | figure | `FundApply.CurrAssetLoanAdv.CurrLiabilitiesProv.CurrLiabilities.OtherPayables` | |
| 3diG | r112 K112 `iG` | Total (A3 + iB + iC + iD + iE + iF) | computed | `FundApply.CurrAssetLoanAdv.CurrLiabilitiesProv.CurrLiabilities.TotCurrLiabilities` | `L112 = SUM(J106:J111)` |
| 3dii | r113 | Provisions (head) | | | |
| 3diiA | r114 I114 `iiA` | Provision for Income Tax | figure | `FundApply.CurrAssetLoanAdv.CurrLiabilitiesProv.Provisions.ITProvision` | |
| 3diiB | r116 I116 `iiB` | Provision for Leave encashment/Superannuation/ Gratuity | figure | `FundApply.CurrAssetLoanAdv.CurrLiabilitiesProv.Provisions.ELSuperAnnGratProvision` | occupies the visible `iiB` slot (r115 Wealth Tax is hidden) |
| 3diiC | r117 I117 `iiC` | Other Provisions | figure | `FundApply.CurrAssetLoanAdv.CurrLiabilitiesProv.Provisions.OthProvision` | |
| 3diiD | r118 K118 `iiE` | Total (iiA + iiB + iiC) | computed | `FundApply.CurrAssetLoanAdv.CurrLiabilitiesProv.Provisions.TotProvisions` | `L118 = SUM(J114:J117)` |
| 3diii | r119 K119 `diii` | Total (iG + iiD) | computed | `FundApply.CurrAssetLoanAdv.CurrLiabilitiesProv.TotCurrLiabilitiesProvision` | `L119 = BS.TotProvisions + BS.TotCurrLiabilities` |
| 3e | r120 K120 `3e` | Net current assets (3c – diii) | computed | `FundApply.CurrAssetLoanAdv.NetCurrAsset` | `L120 = BS.TotCurrAssetLoanAdv − BS.TotCurrLiabilitiesProvision`; schema note *"Current Asset − current liabilities can be negative"* (min −99999999999999) |
| 4a | r121 I121 `4a` | Miscellaneous expenditure not written off or adjusted | figure | `FundApply.MiscAdjust.MiscExpndr` | |
| 4b | r122 I122 `4b` | Deferred tax asset | figure | `FundApply.MiscAdjust.DefTaxAsset` | |
| 4c | r123 I123 `4c` | Debit balance in Profit and loss account/ accumulated balance | figure | `FundApply.MiscAdjust.AccumultedLosses` | |
| 4d | r124 K124 `4d` | Total (4a + 4b + 4c) | computed | `FundApply.MiscAdjust.TotMiscAdjust` | `L124 = SUM(J121:J123)` |
| 5 | r125 | Total, application of funds (1e + 2c + 3e + 4d) | computed | `FundApply.TotFundApply` | `L125 = BS.TotMiscAdjust + BS.NetCurrAsset + BS.TotInvestments + BS.TotFixedAsset`; may be negative |

---

## 5 · Part C — No-account case (`NoBooksOfAccBS`)

Header (r126): *"In a case where regular books of account of business or
profession are not maintained, furnish the following information as on 31st day
of March, 2026, in respect of business or profession."* Schema note on the
block: *"Enter only if No books of accounts are maintained."*

| Sl. | Sheet ref | Field | Type | Schema key (`PARTA_BS.`) |
|---|---|---|---|---|
| C1 | r127 K127 | Amount of total sundry debtors | figure | `NoBooksOfAccBS.TotSundryDbtAmt` |
| C2 | r128 K128 | Amount of total sundry creditors | figure | `NoBooksOfAccBS.TotSundryCrdAmt` |
| C3 | r129 K129 | Amount of total stock-in-trade | figure | `NoBooksOfAccBS.TotStkInTradAmt` |
| C4 | r130 K130 | Amount of the cash balance | figure | `NoBooksOfAccBS.CashBalAmt` |

---

## 6 · The rules the sheet computes (with cell references)

**Balance-of-the-sheet rule** — `rules.json` n=81 (cat A): *"'Sources of funds'
should match with 'Total application of funds' in Balance sheet."* → `L37` (5)
must equal `L125` (5).

**Total subtotals** — each is a rule from a formula or a `rules.json` A-rule:
- n=82: sl no **1c** = **1a + 1bvi** → `L14 = BS.TotResrNSurp + BS.PartnerOrMemberCap` (r14); and 1bvi `L13 = SUM(J8:J12)` (r13).
- n=83: sl no **2c** = **aiii + biii** → `L31 = BS.TotUnSecrLoan + BS.TotSecrLoan` (r31). Secured `L22 = BS.ForeignCurrLoan + BS.TotRupeeLoan` (r22); its rupee `J21 = SUM(J19:J20)` (r21). Unsecured `L30 = BSUnSec.TotRupeeLoan + BSUnSec.ForeignCurrencyLoans` (r30); its rupee `J29 = SUM(J26:J28)` (r29).
- Advances 4iii `L36 = SUM(J34:J35)` (r36).
- n=84: sl no **5** (Sources) = **1c + 2c + 3 + 4iii** → `L37 = BS.DeferredTax + BS.TotLoanFund + BS.TotPartnerOrMemberFund + BSAdv.TotalAdvances` (r37).
- n=85: sl no **2c** (Investments) = **aviii + bvii** → `L69 = L68 + L57` (r69). Long-term `L57 = SUM(J52:J56) + BS.Total + BS.InvInProperty` (r57); short-term `L68 = SUM(J63:J67) + BSS.Total` (r68); equity totals `J51`, `J62`.
- n=86: sl no **3av** (Total current assets) = **iH + iiC + iiiD + aiv** → `L91 = BS.TotCashOrBankBal + BS.SundryDebtors + BS.TotInventries + BS.OthCurrAsset` (r91). Component totals: iH `L80 = SUM(J73:J79)`, iiC `L84 = SUM(J82:J83)`, iiiD `L89 = J87 + J86 + J88`.
- Fixed assets: Net Block `J42 = MAX(J40 − J41, 0)` (r42, floored at 0); 1e `L44 = J42 + J43` (r44).
- Loans & advances 3biv `L96 = SUM(J93:J95)` (r96); 3c `L100 = BS.TotLoanAdv + BS.TotCurrAsset` (r100).
- Current liabilities & provisions: sundry creditors A3 `J106 = SUM(J104:J105)` (r106); iG `L112 = SUM(J106:J111)` (r112); provisions iiE `L118 = SUM(J114:J117)` (r118); diii `L119 = BS.TotProvisions + BS.TotCurrLiabilities` (r119).
- n=87: sl no **3e** (Net current assets) = **3c − 3diii** → `L120 = BS.TotCurrAssetLoanAdv − BS.TotCurrLiabilitiesProvision` (r120).
- Misc 4d `L124 = SUM(J121:J123)` (r124).
- n=88: sl no **5** (Application) = **1e + 2c + 3e + 4d** → `L125 = BS.TotMiscAdjust + BS.NetCurrAsset + BS.TotInvestments + BS.TotFixedAsset` (r125).

**Numeric validation** — all 87 input/total cells carry a *"greater than or
equal to 0"* validation (`dropdowns` source `0`, no value list), i.e. figures
are non-negative — **except** the four fields the schema allows negative:
`PartnerOrMemberCap` (1a), `TotPartnerOrMemberFund` (1c), `TotFundSrc` (5-source),
`NetCurrAsset` (3e) and `TotFundApply` (5-apply).

**Defect trap (139(9))** — VBA: if Sources-of-funds (5) **and** No-account C
are both zero while Schedule BP Sl.No D income > ₹1.2 lakh, the utility warns
the return may be defective. Build this as a cross-schedule warning against
Schedule BP.

---

## 7 · Dropdowns

**None.** All 87 data validations on this sheet are numeric range checks
(`source: "0"`, `values: null`) — i.e. `>= 0` guards, not value lists. There is
no selectable enum anywhere on Part A-BS.

---

## 8 · What repeats and what is one figure

**Nothing repeats.** Every line is a single figure or a single computed total.
There are no unlimited tables and no add-row rows. Part A, Part B and Part C are
each a fixed set of lines.

---

## 9 · Mandatory

Schema `PARTA_BS` `required: ['FundSrc', 'FundApply']` — the regular-books
statement (Parts A + B) is the mandatory structure. `NoBooksOfAccBS` is **not**
in `required`: it is the alternate filled when books are not maintained.

At the return level (`rules.json` n=249, n=10): a business/profession filer
must fill **either** the regular-books Balance Sheet (A + B) **or** the
No-account case (C). Filling neither, while business income is present, is a
139(9) defect (VBA trap in §6).

---

## 10 · Hidden rows — not built

| Row | Label | Sl. | Why excluded |
|---|---|---|---|
| **r115 (H)** | Provision for Wealth Tax | (would be iiB) | Hidden in the utility (Wealth Tax abolished). It has **no live schema key** — Provisions has only `ITProvision`, `ELSuperAnnGratProvision`, `OthProvision`, `TotProvisions`. The visible `iiB` slot is taken by r116 (Leave encashment/Superannuation/Gratuity). Do not build. |

No other hidden rows on this sheet.

---

## 11 · What this means for the build

1. **Three exclusive blocks.** Render Sources (A) + Application (B) as the
   regular-books path, and No-account (C) as the alternate. `FundSrc` and
   `FundApply` are the mandatory blocks; write `NoBooksOfAccBS` only when the
   filer has no books.
2. **All totals are computed, green and untypeable** — subtotals via `SUM`
   ranges (bvi, iiC, iiD, iH, iiC-debtors, biv, A3, iG, iiE, 4d) and head totals
   via the `BS.` / `BSS.` / `BSUnSec.` / `BSAdv.` schema references (1c, aiii,
   biii, 2c-loan, 4iii, 5-source, aviii, bvii, 2c-inv, av, 3c, diii, 3e,
   5-apply). Net Block is `MAX(gross − depreciation, 0)`.
3. **Non-negative everywhere except five signed fields** — `PartnerOrMemberCap`,
   `TotPartnerOrMemberFund`, `TotFundSrc`, `NetCurrAsset`, `TotFundApply` may go
   negative; every other cell is `>= 0`.
4. **The balancing check** — Sources (5) must equal Application (5) (n=81); the
   sub-totals (n=82–88) must each hold. Encode as validations.
5. **139(9) trap** — if both Source-5 and No-account-C are zero while Schedule
   BP Sl.No D > ₹1.2 lakh, warn the user (cross-schedule, from BP).
6. **Never build r115** (Provision for Wealth Tax) — hidden, no schema key.
7. **No dropdowns** — every field is a rupee number box.
8. **Export** — `PARTA_BS.FundSrc` and `PARTA_BS.FundApply` always when the
   regular-books statement is written; `PARTA_BS.NoBooksOfAccBS` when the
   No-account case is used instead.
