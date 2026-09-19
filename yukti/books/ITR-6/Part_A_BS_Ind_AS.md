# The book of Part A — Balance Sheet (Ind AS) · ITR-6, A.Y. 2026-27

Read row by row from the utility's **Part A-BS - Ind AS** sheet (260 rows, with
the hidden-row flags) and confirmed against the CBDT ITR-6 schema's
`PARTA_BSIndAS`. Nothing here is invented; every label, item letter and rule is
the department's own. This is the **Ind-AS** Balance Sheet — the Schedule III,
Division II presentation used by a company whose financial statements are drawn up
under the Indian Accounting Standards. It replaces the regular Balance Sheet for
such a company; the "financial statements drawn up under Ind AS" flag in Part A –
General (rule A14) decides which of the two is shown.

---

The sheet's own heading: *Balance Sheet as on 31st day of March, 2026 or as on
the date of business combination [applicable for a company whose financial
statements are drawn up in compliance with the Ind AS].*

## 1 · Why this sheet is different from the regular Balance Sheet

The Ind-AS balance sheet uses the Division-II vocabulary: **Equity** (share
capital + other equity, with retained earnings) instead of "Share holder's
funds"; **Financial Liabilities** and **Financial Assets** with their Ind-AS
line items (bonds/debentures split into foreign currency and rupee, biological
assets, investment property, current maturities of long-term debt); and
"Property, Plant and Equipment" with gross block, depreciation and **impairment
losses**. The two-sided identity is the same — Total Equity and Liabilities =
Total Assets — but the classification follows Ind AS.

---

## 2 · The shape — two sides

| Side | Blocks | Schema root |
|---|---|---|
| **I · Equity and Liabilities** | 1 Equity (share capital + other equity); 2A Non-current liabilities; 2B Current liabilities; total 1C+2A+2B | `EquityAndLiablities` |
| **II · Assets** | Non-current assets (PPE, investment property, goodwill, intangibles, biological assets, financial assets); Current assets (inventories, financial assets, tax assets, other); Total | `Assets` |

The schema nests the whole assets side (except current assets) under
`Assets.NonCurrAssets.PropertyPlantEquip` — a naming quirk to write exactly:
`PropertyPlantEquip` there holds not only PPE but investment property, goodwill,
intangibles, biological assets and all non-current financial assets. Current
assets sit under `Assets.CurrentAssets`.

---

## 3 · Side I · Equity — items 1A to 1C

| Item | Label (verbatim) | Type | Schema key (under `EquityAndLiablities.Equity`) | Hidden? |
|---|---|---|---|---|
| **1A** | Equity share capital | group | `EquityShareCapital` | no |
| **1Ai** | Authorised | integer | `EquityShareCapital.Authorised` | no |
| **1Aii** | Issued, Subscribed and fully Paid up | integer | `EquityShareCapital.IssuedSubsPaidUp` | no |
| **1Aiii** | Subscribed but not fully paid | integer | `EquityShareCapital.SubscribedNotFullyPaid` | no |
| **1Aiv** | Total (Aii + Aiii) | computed | `EquityShareCapital.TotShareCapital` | no |
| **1B** | Other Equity | group | `OtherEquityReserv` | no |
| **1Bi** | Other Reserves | group | — | no |
| **1Bia** | Capital Redemption Reserve | integer | `OtherEquityReserv.CapRedempResr` | no |
| **1Bib** | Debenture Redemption Reserve | integer | `OtherEquityReserv.DebunRedResr` | no |
| **1Bic** | Share options outstanding amount | integer | `OtherEquityReserv.ShareOptOSAmount` | no |
| **1Bid** | Other (specify nature and amount) — table | table | `OtherEquityReserv.OtherResrvDtls[]` (`OthersDesc`, `OthersAmount`), total `OthersTotal` | no |
| **1Bie** | Total other reserves (ia + ib + ic + id) | computed | `OtherEquityReserv.TotalOtherResrv` | no |
| **1Bii** | Retained earnings (Debit balance of statement of P&L to be shown as –ve figure) | integer | `OtherEquityReserv.RetainedEarngs` | no |
| **1Biii** | Total (Bie + ii) (Debit balance to be shown as –ve figure) | computed | `OtherEquityReserv.TotResrNRetEar` | no |
| **1C** | Total Equity (Aiv + Biii) | computed | `OtherEquityReserv.TotalEquity` | no |

Rule **A58**: 1Aiv = Aii + Aiii. Rule **A59**: 1C = Aiv + Biii.

---

## 4 · Side I · Non-current liabilities — item 2A

Schema root `EquityAndLiablities.Liabilities.NonCurrLiabilities`.

| Item | Label (verbatim) | Type | Schema key | Hidden? |
|---|---|---|---|---|
| **I** | Financial Liabilities | group | `FinancialLiabilities` | no |
| a | Bonds or debentures | group | `FinancialLiabilities.BondsDebentures` | no |
| a1 | Foreign currency | integer | `FinancialLiabilities.BondsDebentures.ForeignCurrency` | no |
| a2 | Rupee | integer | `FinancialLiabilities.BondsDebentures.Rupee` | no |
| a3 | Total (1 + 2) | computed | `FinancialLiabilities.BondsDebentures.Total` | no |
| b | Term loans | group | `FinancialLiabilities.TermLoans` | no |
| b1 | Foreign currency | integer | `FinancialLiabilities.TermLoans.ForeignCurrency` | no |
| — | Rupee loans → From Banks | integer | `FinancialLiabilities.TermLoans.RupeeLoans.FromBanks` | no |
| — | From others | integer | `FinancialLiabilities.TermLoans.RupeeLoans.FromOthers` | no |
| b2 | Total (i + ii) | computed | `FinancialLiabilities.TermLoans.RupeeLoans.Total` | no |
| b3 | Total Term loans (b1 + b2) | computed | `FinancialLiabilities.TermLoans.TotalTermLoans` | no |
| c | Deferred payment liabilities | integer | `FinancialLiabilities.DeferredPymtLiabilities` | no |
| d | Deposits | integer | `FinancialLiabilities.Deposits` | no |
| e | Loans from related parties (see instructions) | integer | `FinancialLiabilities.LoansReltdParties` | no |
| f | Long term maturities of finance lease obligations | integer | `FinancialLiabilities.LongTermMaturities` | no |
| g | Liability component of compound financial instruments | integer | `FinancialLiabilities.LiabilityComp` | no |
| h | Other loans | integer | `FinancialLiabilities.OtherLoans` | no |
| i | Total borrowings (a3 + b3 + c + d + e + f + g + h) | computed | `FinancialLiabilities.TotalLTBorrowings` | no |
| j | Trade Payables | integer | `FinancialLiabilities.TradePayables` | no |
| k | Other financial liabilities (Other than those specified in II under provisions) | integer | `FinancialLiabilities.OtherFinancialLiab` | no |
| **II** | Provisions | group | `Provisions` | no |
| IIa | Provision for employee benefits | integer | `Provisions.ProvEmpBenefits` | no |
| IIb | Others (specify nature) — table | table | `Provisions.OthersProvisions[]` (`OthersDesc`, `OthersAmount`), total `OthersTotal` | no |
| IIc | Total Provisions | computed | `Provisions.TotalProvisions` | no |
| **III** | Deferred tax liabilities (net) | integer | `DefrdTaxCurrLiabilites` | no |
| **IV** | Other non-current liabilities | group | `OtherNonCurLiabilites` | no |
| IVa | Advances | integer | `OtherNonCurLiabilites.Advances` | no |
| IVb | Others (specify nature) — table | table | `OtherNonCurLiabilites.OthersNonCurrLiab[]` (`OthersDesc`, `OthersAmount`), total `OthersTotal` | no |
| IVc | Total Other non-current liabilities | computed | `OtherNonCurLiabilites.TotalOthNonCurrLiab` | no |
| **2A** | Total Non-Current Liabilities (Ii + Ij + Ik + IIC + III + IVc) | computed | `TotalNonCurrLiab` | no |

Rule **A60**: 2A = Ii + Ij + Ik + IIC + III + IVc.

---

## 5 · Side I · Current liabilities — item 2B

Schema root `EquityAndLiablities.Liabilities.CurrentLiabilities`.

| Item | Label (verbatim) | Type | Schema key | Hidden? |
|---|---|---|---|---|
| **I** | Financial Liabilities | group | `FinancialLiabBorrowings` | no |
| i | Borrowings → Loans repayable on demand → From Banks | integer | `FinancialLiabBorrowings.LoansRepaybleOnDemand.FromBanks` | no |
| — | From Other parties | integer | `FinancialLiabBorrowings.LoansRepaybleOnDemand.FrmOtherParties` | no |
| — | Total Loans repayable on demand (1 + 2) | computed | `FinancialLiabBorrowings.LoansRepaybleOnDemand.TotLoansRepaybleOnDemand` | no |
| b | Loans from related parties | integer | `FinancialLiabBorrowings.LoansFrmRelatedParties` | no |
| c | Deposits | integer | `FinancialLiabBorrowings.Deposits` | no |
| d | Other loans (specify nature) — table | table | `FinancialLiabBorrowings.BrwngOtherLoans[]` (`OthersDesc`, `OthersAmount`), total `OthersTotal` | no |
| — | Total Borrowings (a3 + b + c + d) | computed | `FinancialLiabBorrowings.TotalBorrowings` | no |
| ii | Trade payables | integer | `FinancialLiabBorrowings.TradePayables` | no |
| iii | Other financial liabilities | group | `OthFinancialLiabilities` | no |
| a | Current maturities of long-term debt | integer | `OthFinancialLiabilities.CurrMatOnLTDebt` | no |
| b | Current maturities of finance lease obligations | integer | `OthFinancialLiabilities.CurrMatFinanceOblg` | no |
| c | Interest accrued | integer | `OthFinancialLiabilities.AccrInterest` | no |
| d | Unpaid dividends | integer | `OthFinancialLiabilities.UnpaidDividend` | no |
| e | Application money received for allotment of securities to the extent refundable and interest accrued | integer | `OthFinancialLiabilities.AppMonyRecvdAllotSecurities` | no |
| f | Unpaid matured deposits and interest accrued thereon | integer | `OthFinancialLiabilities.UnpaidMatDeposits` | no |
| g | Unpaid matured debentures and interest accrued thereon | integer | `OthFinancialLiabilities.UnpaidMatureDebenture` | no |
| h | Others (specify nature) — table | table | `OthFinancialLiabilities.OthPayables[]` (`OthersDesc`, `OthersAmount`), total `OthersTotal` | no |
| Iiii | Total Other financial liabilities (a + b +c +d +e +f +g+ h) | computed | `OthFinancialLiabilities.TotOthFinancialLiab` | no |
| Iiv | Total Financial Liabilities (Ii + Iii + Iiii) | computed | `TottalFinancialLiab` (schema doubles the "t") | no |
| **II** | Other Current liabilities | group | `OtherCuurLiabilities` (schema doubles the "u") | no |
| a | Revenue received in advance | integer | `OtherCuurLiabilities.RevenueRecvdAdvance` | no |
| b | Other advances (specify nature) — table | table | `OtherCuurLiabilities.OtherAdvance[]` (`OthersDesc`, `OthersAmount`), total `OthersAdvTotal` | no |
| c | Others (specify nature) — table | table | `OtherCuurLiabilities.Others[]` (`OthersDesc`, `OthersAmount`), total `OthersTotal` | no |
| IId | Total Other current liabilities (a + b+ c) | computed | `OtherCuurLiabilities.TotalOthCurrLiab` | no |
| **III** | Provisions | group | `Provosions` (schema misspells "Provisions") | no |
| a | Provision for employee benefits | integer | `Provosions.ProvosionEmpBenft` | no |
| b | Others (specify nature) — table | table | `Provosions.OthersProvisions[]` (`OthersDesc`, `OthersAmount`), total `OthersTotal` | no |
| IIIc | Total provisions (a + b) | computed | `Provosions.TotalProvosions` | no |
| **IV** | Current Tax Liabilities (Net) | integer | `CurrTaxLiabilities` | no |
| **2B** | Total Current liabilities (Iiv + IId + IIIc+ IV) | computed | `TotalCurrentLiab` | no |
| **1(I)** | Total Equity and liabilities (1C + 2A +2B) | computed | `TotalEquityLiab` | no |

Rule **A61**: Total of equity and liabilities = 1C + 2A + 2B.

---

## 6 · Side II · Non-current assets

Schema root `Assets.NonCurrAssets.PropertyPlantEquip` (the quirk: everything below
lives under this key).

| Item | Label (verbatim) | Type | Schema key | Hidden? |
|---|---|---|---|---|
| **A** | Property, Plant and Equipment → a Gross block | integer | `PropertyPlantEquip.GrossBlock` | no |
| Ab | Depreciation | integer | `PropertyPlantEquip.Depreciation` | no |
| Ac | Impairment losses | integer | `PropertyPlantEquip.ImpairmentLosses` | no |
| Ad | Net block (a – b - c) | computed | `PropertyPlantEquip.NetBlock` | no |
| **B** | Capital work-in-progress | integer | `PropertyPlantEquip.CapWrkProg` | no |
| **C** | Investment Property → a Gross block | integer | `PropertyPlantEquip.InvstPropGrossBlock` | no |
| Cb | Depreciation | integer | `PropertyPlantEquip.InvstPropDepreciation` | no |
| Cc | Impairment losses | integer | `PropertyPlantEquip.InvstPropImprLosses` | no |
| Cd | Net block (a – b - c) | computed | `PropertyPlantEquip.InvstPropNetBlock` | no |
| **D** | Goodwill → a Gross block | integer | `PropertyPlantEquip.GoodWlGrossBlock` | no |
| Db | Impairment losses | integer | `PropertyPlantEquip.GoodWlImprLosses` | no |
| Dc | Net block (a – b ) | computed | `PropertyPlantEquip.GoodWlNetBlock` | no |
| **E** | Other Intangible Assets → a Gross block | integer | `PropertyPlantEquip.OthIntAstGrossBlock` | no |
| Eb | Amortization | integer | `PropertyPlantEquip.OthIntAstAmortisation` | no |
| Ec | Impairment losses | integer | `PropertyPlantEquip.OthIntAstImprLosses` | no |
| Ed | Net block (a – b - c) | computed | `PropertyPlantEquip.OthIntAstNetBlock` | no |
| **F** | Intangible assets under development | integer | `PropertyPlantEquip.IntAstUndrDevlpmnt` | no |
| **G** | Biological assets other than bearer plants → a Gross block | integer | `PropertyPlantEquip.BioAstGrossBlock` | no |
| Gb | Impairment losses | integer | `PropertyPlantEquip.BioAstImprLosses` | no |
| Gc | Net block (a – b ) | computed | `PropertyPlantEquip.BioAstNetBlock` | no |

### Non-current Financial Assets (`PropertyPlantEquip.FinancialAssets`)

| Item | Label (verbatim) | Schema key |
|---|---|---|
| HI i a | Listed equities | `FinancialAssets.Investments.ListedEquities` |
| HI i b | Unlisted equities | `FinancialAssets.Investments.UnListedEquities` |
| HI ic | Total (ia + ib) | `FinancialAssets.Investments.Total` |
| HI ii | Investments in Preference shares | `FinancialAssets.Investments.InvstPrfShares` |
| HI iii | Investments in Government or trust securities | `FinancialAssets.Investments.InvstGovtTrust` |
| HI iv | Investments in Debenture or bonds | `FinancialAssets.Investments.InvstInDebenture` |
| HI v | Investments in Mutual funds | `FinancialAssets.Investments.InvstInMutualFunds` |
| HI vi | Investments in Partnership firms | `FinancialAssets.Investments.InvstInPartnershpFirm` |
| HI vii | Others Investments (specify nature) — table | `FinancialAssets.Investments.OtherInvestment[]` (`OthersDesc`, `OthersAmount`), total `OthersTotal` |
| HI | Total non-current investments (ic + ii + iii + iv + v + vi + vii) | `FinancialAssets.Investments.TotalNonCurrentInvst` |
| HII a | Secured, considered good | `FinancialAssets.TradeReceivables.SecuredConsGoods` |
| HII b | Unsecured, considered good | `FinancialAssets.TradeReceivables.UnSecuredConsGoods` |
| HII c | Doubtful | `FinancialAssets.TradeReceivables.Doubtful` |
| HII | Total Trade receivables | `FinancialAssets.TradeReceivables.TotalTradeReceivbls` |
| HIII i | Security deposits | `FinancialAssets.Loans.SecurityDepsts` |
| HIII ii | Loans to related parties | `FinancialAssets.Loans.LoansRltdParties` |
| HIII iii | Other loans (specify nature) — table | `FinancialAssets.Loans.OtherLoans[]` (`OthersDesc`, `OthersAmount`), total `OthersTotal` |
| HIII | Total Loans (i + ii + iii) | `FinancialAssets.Loans.TotalLoans` |
| HIII va | for the purpose of business or profession | `FinancialAssets.Loans.LoansBPPurpose` |
| HIII vb | not for the purpose of business or profession | `FinancialAssets.Loans.LoansNotBPPurpose` |
| HIII vc | given to shareholder, being the beneficial owner of share, or to any concern or on behalf/ benefit of such shareholder | `FinancialAssets.Loans.LoansToShrHolders` |
| HIV i | Bank Deposits with more than 12 months maturity | `FinancialAssets.OtherFinacialAssets.BankDeposits` |
| HIV ii | Others | `FinancialAssets.OtherFinacialAssets.OtherDeposits` |
| HIV | Total of Other Financial Assets (i + ii) | `FinancialAssets.OtherFinacialAssets.TotalOthFinancialAsst` |
| **I** | Deferred Tax Assets (Net) | `FinancialAssets.OtherFinacialAssets.DefrdTaxAsst` |
| J i | Capital Advances | `FinancialAssets.OtherNonCurrentAssets.CapitalAdvanc` |
| J ii | Advances other than capital advances | `FinancialAssets.OtherNonCurrentAssets.AdvancOthCapital` |
| J iii | Others (specify nature) — table | `FinancialAssets.OtherNonCurrentAssets.OtherNonCurrAsst[]` (`OthersDesc`, `OthersAmount`), total `OthersTotal` |
| J | Total non-current assets (i + ii + iii) | `FinancialAssets.OtherNonCurrentAssets.TotalNonCurrAsst` |
| J v | Non-current assets included in J above which is due from shareholder, being the beneficial owner of share, or any concern or on behalf/benefit of such shareholder | `FinancialAssets.OtherNonCurrentAssets.NonCurrAsstDueShrHldr` |
| — | Total Non-current assets (Ad + B + Cd + Dc + Ed + F + Gc + HI + HII + HIII + HIV + I + J) | `FinancialAssets.TotalNonCurrntAsst` |

Rule **A62**: Total non-current assets = Ad + B + Cd + Dc + Ed + F + Gc + HI + HII + HIII + HIV + I + J.

---

## 7 · Side II · Current assets

Schema root `Assets.CurrentAssets`.

| Item | Label (verbatim) | Schema key |
|---|---|---|
| A i | Raw materials | `Inventories.RawMaterials` |
| A ii | Work-in-progress | `Inventories.WorkInProgress` |
| A iii | Finished goods | `Inventories.FinishedGoods` |
| A iv | Stock-in-trade (in respect of goods acquired for trading) | `Inventories.StockInTrade` |
| A v | Stores and spares | `Inventories.StoresSpares` |
| A vi | Loose tools | `Inventories.LooseTools` |
| A vii | Others | `Inventories.Others` |
| 2A | Total Inventories (i + ii + iii + iv + v + vi + vii) | `Inventories.TotalInventories` |
| B I i a | Listed equities | `FinancialAssets.Investments.ListedEquities` |
| B I i b | Unlisted equities | `FinancialAssets.Investments.UnListedEquities` |
| B I ic | Total (ia + ib) | `FinancialAssets.Investments.Total` |
| B I ii | Investment in Preference shares | `FinancialAssets.Investments.InvstPrfShares` |
| B I iii | Investment in government or trust securities | `FinancialAssets.Investments.InvstGovtTrust` |
| B I iv | Investment in debentures or bonds | `FinancialAssets.Investments.InvstInDebenture` |
| B I v | Investment in Mutual funds | `FinancialAssets.Investments.InvstInMutualFunds` |
| B I vi | Investment in partnership firms | `FinancialAssets.Investments.InvstInPartnershpFirm` |
| B I vii | Other Investments | `FinancialAssets.Investments.OtherInvestment` (a single figure here, not a table) |
| B I | Total Current investments (ic + ii + iii + iv + v + vi + vii) | `FinancialAssets.Investments.TotalCurrentInvst` |
| B II i | Secured, considered good | `FinancialAssets.TradeReceivables.SecuredConsGoods` |
| B II ii | Unsecured, considered good | `FinancialAssets.TradeReceivables.UnSecuredConsGoods` |
| B II iii | Doubtful | `FinancialAssets.TradeReceivables.Doubtful` |
| B II | Total Trade receivables (i + ii + iii) | `FinancialAssets.TradeReceivables.TotalTradeReceivbls` |
| B III i | Balances with Banks (of the nature of cash and cash equivalents) | `FinancialAssets.CashEquivalents.BalancesWithBanks` |
| B III ii | Cheque, drafts in hand | `FinancialAssets.CashEquivalents.ChequeDraftsInHand` |
| B III iii | Cash on hand | `FinancialAssets.CashEquivalents.CashOnHand` |
| B III iv | Others (specify nature) — table | `FinancialAssets.CashEquivalents.OtherCashDtls[]` (`OthersDesc`, `OthersAmount`), total `OthersTotal` |
| B III | Total Cash and cash equivalents (i + ii + iii + iv) | `FinancialAssets.CashEquivalents.TotalCashEquivalents` |
| B IV | Bank Balances other than III above | `FinancialAssets.CashEquivalents.BankBalanceOther` |
| B V i | Security Deposits | `FinancialAssets.Loans.SecurityDepsts` |
| B V ii | Loans to related parties | `FinancialAssets.Loans.LoansRltdParties` |
| B V iii | Others(specify nature) — table | `FinancialAssets.Loans.OtherLoans[]` (`OthersDesc`, `OthersAmount`), total `OthersTotal` |
| B V | Total loans (i + ii + iii) | `FinancialAssets.Loans.TotalLoans` |
| B V va | for the purpose of business or profession | `FinancialAssets.Loans.LoansBPPurpose` |
| B V vb | not for the purpose of business or profession | `FinancialAssets.Loans.LoansNotBPPurpose` |
| B V vc | given to a shareholder, being the beneficial owner of share, or to any concern or on behalf/ benefit of such shareholder | `FinancialAssets.Loans.LoansToShrHolders` |
| B VI | Other Financial Assets | `FinancialAssets.OtherFinancialAsst` |
| 2B | Total Financial Assets (I + II + III + IV + V + VI) | `FinancialAssets.TotalFinancialAsst` |
| **C** | Current Tax Assets (Net) | `FinancialAssets.CurrentTaxAsst` |
| D i | Advances other than capital advances | `FinancialAssets.OtherCurrentAssets.AdvancOthCapital` |
| D ii | Others(specify nature) — table | `FinancialAssets.OtherCurrentAssets.OthersCurrentAssts[]` (`OthersDesc`, `OthersAmount`), total `OthersTotal` |
| 2D | Total (other current assets) | `FinancialAssets.OtherCurrentAssets.TotalOthCurrentAsst` |
| — | Total Current assets (2A + 2B + 2C + 2D) | `FinancialAssets.OtherCurrentAssets.TotalCurrAsst` |
| **II** | Total Assets (1 + 2) | `TotalAssets` |

Rule **A63**: Total current assets = 2A + 2B + 2C + 2D.

---

## 8 · Enums / dropdowns

**None.** Every cell is a numeric entry or a computed total (0 to
99,999,999,999,999; retained earnings and a few net-block lines allow a negative
down to −99,999,999,999,999). The free-text "Others (specify nature)" columns are
50-character strings. There are no picklists on this sheet.

---

## 9 · The rules the sheet computes

| Rule | What it asserts |
|---|---|
| **A14** | If "No" to "financial statements drawn up under Ind AS" in Part A – General, this Ind-AS balance sheet does not apply (the regular BS does) |
| **A58** | 1Aiv = Aii + Aiii |
| **A59** | 1C = Aiv + Biii |
| **A60** | Total non-current liabilities = Ii + Ij + Ik + IIC + III + IVc |
| **A61** | Total equity and liabilities = 1C + 2A + 2B |
| **A62** | Total non-current assets = Ad + B + Cd + Dc + Ed + F + Gc + HI + HII + HIII + HIV + I + J |
| **A63** | Total current assets = II(2A + 2B + 2C + 2D) |
| identity | Total Equity and liabilities (item I) = Total Assets (item II) |

---

## 10 · Cross-sheet feeds

| Direction | Feed |
|---|---|
| trigger | Part A – General "financial statements drawn up under Ind AS" = Yes selects this sheet over the regular Balance Sheet (rule A14) |
| reconcile | Inventories tie to the Trading/Manufacturing Accounts (Ind AS); retained earnings tie to the closing balance carried from the Statement of Profit and Loss (Ind AS) |
| reconcile | Loans given to shareholders (HIII vc / B V vc) feed the deemed-dividend disclosure |

The balance sheet does not itself feed Part B-TI; income flows through the P&L →
Schedule BP.

---

## 11 · What repeats, what is mandatory

- **Repeatable:** every "Others (specify nature)" line is a free table — the
  reserves (`OtherResrvDtls[]`), the several `OthersProvisions[]` /
  `OthersNonCurrLiab[]` / `BrwngOtherLoans[]` / `OthPayables[]` / `OtherAdvance[]`
  / `Others[]` / `OtherInvestment[]` (non-current only) / `OtherLoans[]` /
  `OtherNonCurrAsst[]` / `OtherCashDtls[]` / `OthersCurrentAssts[]` blocks. In the
  **current** investments block, "Other Investments" is a single figure
  (`OtherInvestment`), not a table.
- The schema marks the great majority of leaves as required, so the block is
  written in full for an Ind-AS company; the free-table sub-totals and the
  `OthersDesc`/`OthersAmount` rows are written only when a table has entries.

---

## 12 · Hidden rows — the "no-account case" (rows 252–257)

These rows are **hidden** on the sheet and are **not built**; they belong to the
non-Ind-AS balance sheet's no-account case and have **no key** in
`PARTA_BSIndAS`:

| Row (hidden) | Item | Label |
|---|---|---|
| 253 | III | In a case where regular books of account of business or profession are not maintained – (furnish the following information) |
| 254 | IIIa | Amount of total sundry debtors |
| 255 | IIIb | Amount of total sundry creditors |
| 256 | IIIc | Amount of total stock-in-trade |
| 257 | IIId | Amount of the cash balance |

Logged as excluded (hidden, no schema key on the Ind-AS block).

---

## 13 · What this means for the build

1. It is the largest figures block in the return; render it as the two-sided
   Schedule III (Division II) statement with computed sub-totals green and
   untypeable.
2. Write the assets side under the `Assets.NonCurrAssets.PropertyPlantEquip`
   umbrella and current assets under `Assets.CurrentAssets` exactly as the schema
   nests them — this is the single most error-prone place.
3. Mind the schema's misspellings: `TottalFinancialLiab`, `OtherCuurLiabilities`,
   `Provosions`/`ProvosionEmpBenft`/`TotalProvosions`, `DefrdTaxCurrLiabilites`,
   `TotalNonCurrntAsst`, `OtherFinacialAssets`.
4. Enforce the six arithmetic rules (A58–A63) and the grand identity Total Equity
   and Liabilities = Total Assets.
5. Retained earnings and the net-block lines may be negative; everything else ≥ 0.
6. Do not build the hidden no-account rows 252–257.
