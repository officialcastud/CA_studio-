# The book of Part A — Balance Sheet · ITR-6, A.Y. 2026-27

Read row by row from the utility's **BALANCE SHEET** sheet (197 rows, 3 hidden)
with its formulas, and confirmed against the CBDT ITR-6 schema block
**`PARTA_BSFor6FrmAY13`** (`ITRForm:PartA_BS`). Every label, item letter and
formula below is the department's own.

The sheet's own heading (F3): *"BALANCE SHEET AS ON 31ST DAY OF MARCH, 2026 OR
AS ON THE DATE OF AMALGAMATION."* The sheet is the Schedule III (non-Ind-AS)
balance sheet a company files; the Ind-AS balance sheet is a separate sheet
(`Part A-BS - Ind AS`) and a separate block.

---

## 1 · Why the Balance Sheet is the widest financial statement on ITR-6

It is the whole of a company's financial position on one page, in the two
statutory halves that must be equal:

| Half | Roman | Groups |
|---|---|---|
| **I — Equity and Liabilities** | I | 1 Shareholder's fund · 2 Share application money pending allotment · 3 Non-current liabilities · 4 Current liabilities |
| **II — Assets** | II | 1 Non-current assets · 2 Current assets |

Every group has a computed total, and the two half-totals — **Total Equity and
liabilities** (row 99) and **Total Assets** (row 192) — are the figures the
department reconciles against the P&L's carried balance and against Schedule OI.

Three rows are hidden and must not be built (see §4).

---

## 2 · Part I — Equity and Liabilities

All amounts are integers (rupees). Computed rows are green and untypeable and
carry the sheet's own formula. Schema paths are under
`PARTA_BSFor6FrmAY13.EquityAndLiablities` (the schema spells the node
"EquityAndLiablities").

### 1 · Shareholder's fund

| Item | Row | Label | Type | Schema key (under `EquityAndLiablities.ShareHolderFund`) | Formula |
|---|---|---|---|---|---|
| **1A** | 6 | Share capital | group | `ShareCapital` | |
| 1Ai | 7 | Authorized | figure | `ShareCapital.Authorised` | entered |
| 1Aii | 8 | Issued, Subscribed and fully Paid up | figure | `ShareCapital.IssuedSubsPaidUp` | entered |
| 1Aiii | 9 | Subscribed but not fully paid | figure | `ShareCapital.SubscribedNotFullyPaid` | entered |
| 1Aiv | 10 | **Total (Aii + Aiii)** | computed | `ShareCapital.TotShareCapital` | `SUM(IssuedSubsPaidUp, SubscribedNotFullyPaid)` |
| **1B** | 11 | Reserves and Surplus | group | `ResrNSurp` | |
| 1Bi | 12 | Capital Reserve | figure | `ResrNSurp.CapResr` | entered |
| 1Bii | 13 | Capital Redemption Reserve | figure | `ResrNSurp.CapRedempResr` | entered |
| 1Biii | 14 | Securities Premium Reserve | figure | `ResrNSurp.SecurPremResr` | entered |
| 1Biv | 15 | Debenture Redemption Reserve | figure | `ResrNSurp.DebunRedResr` | entered |
| 1Bv | 16 | Revaluation Reserve | figure | `ResrNSurp.RevResr` | entered |
| 1Bvi | 17 | Share options outstanding amount | figure | `ResrNSurp.ShareOptOSAmount` | entered |
| 1Bvii | 18–21 | Other reserve (specify nature and amount) → **Total** | **table** + computed | `ResrNSurp.OtherResrvDtls[]` (`.Nature`, `.Amount`), total `ResrNSurp.OtherResrvTotal` | `L21 = SUM(BS1B.Amount)` |
| 1Bviii | 23 | Surplus i.e. Balance in statement of profit and loss (Debit balance to be shown as −ve figure) | figure | `ResrNSurp.PLAccount` | entered / fed from P&L |
| 1Bix | 24 | **Total (Bi + … + Bviii)** (Debit balance to be shown as −ve figure) | computed | `ResrNSurp.TotResrNSurp` | `SUM(L12:L23) − OtherResrvTotal` |
| **1C** | 25 | Money received against share warrants | figure | `MoneyRecvdAgainstShares` | entered |
| **1D** | 26 | **Total Shareholder's fund (Aiv + Bix + 1C)** | computed | `TotShareHolderFund` | `MoneyRecvdAgainstShares + TotResrNSurp + TotShareCapital` |

### 2 · Share application money pending allotment

| Item | Row | Label | Type | Schema key (under `EquityAndLiablities.ShareAppMoneyAllot`) | Formula |
|---|---|---|---|---|---|
| 2i | 28 | Pending for less than one year | figure | `PendingLtOneYr` | entered |
| 2ii | 29 | Pending for more than one year | figure | `PendingMtOneYr` | entered |
| 2iii | 30 | **Total (i + ii)** | computed | `Total` | `SUM(L28:L29)` |

### 3 · Non-current liabilities

| Item | Row | Label | Type | Schema key (under `EquityAndLiablities.NonCurrLiabilities`) | Formula |
|---|---|---|---|---|---|
| **3A** | 32 | Long-term borrowings | group | `LongTermBorrowings` | |
| 3Ai | 33–36 | Bonds/ debentures → Foreign currency / Rupee / **Total (ia + ib)** | figures + computed | `LongTermBorrowings.BondsDebentures.ForeignCurrency`, `.Rupee`, `.Total` | `SUM(L34:L35)` |
| 3Aii | 37–43 | Term loans → Foreign currency / Rupee loans (From Banks, From others, Total b1+b2) / **Total Term loans** | figures + computed | `LongTermBorrowings.TermLoans.ForeignCurrency`, `.RupeeLoans.FromBanks`, `.RupeeLoans.FromOthers`, `.RupeeLoans.Total`, `.TotalTermLoans` | RupeeLoans.Total `SUM(L40:L41)`; TotalTermLoans `= RupeeLoans.Total + ForeignCurrency` |
| 3Aiii | 44 | Deferred payment liabilities | figure | `LongTermBorrowings.DeferredPymtLiabilities` | entered |
| 3Aiv | 45 | Deposits from related parties | figure | `LongTermBorrowings.DepositsFrmRelatedParties` | entered |
| 3Av | 46 | Other deposits | figure | `LongTermBorrowings.OtherDeposits` | entered |
| 3Avi | 47 | Loans and advances from related parties | figure | `LongTermBorrowings.LoansAndAdv` | entered |
| 3Avii | 48 | Other loans and advances | figure | `LongTermBorrowings.OthersLoanAdv` | entered |
| 3Aviii | 49 | Long term maturities of finance lease obligations | figure | `LongTermBorrowings.LongTermMaturities` | entered |
| 3Aix | 50 | **Total Long term borrowings (ic + iic + iii + … + viii)** | computed | `LongTermBorrowings.TotalLTBorrowings` | `SUM(N43:N49) + BS3A.Total` |
| **3B** | 51 | Deferred tax liabilities (net) | figure | `NetDefferedTaxLiability` | entered |
| **3C** | 52–55 | Other long-term liabilities → Trade payables / Others / **Total** | figures + computed | `OthLongTermLiablities.TradePayables`, `.Others`, `.TotalOthLtLiabilities` | `SUM(L53:L54)` |
| **3D** | 56–59 | Long-term provisions → Provision for employee benefits / Others / **Total** | figures + computed | `LongTermProvisions.ProvEmpBenefits`, `.Others`, `.Total` | `SUM(L57:L58)` |
| **3E** | 60 | **Total Non-current liabilities (3A + 3B + 3C + 3D)** | computed | `TotalNonCurrLiabilites` | `SUM(N50:N51) + TotalOthLtLiabilities + BS3D.Total` |

### 4 · Current liabilities

| Item | Row | Label | Type | Schema key (under `EquityAndLiablities.CurrentLiabilities`) | Formula |
|---|---|---|---|---|---|
| **4A** | 62 | Short-term borrowings | group | `ShortTrmBorrowings` | |
| 4Ai | 63–68 | Loans repayable on demand → From Banks / From Non-Banking Finance Companies / From other financial institutions / From others / **Total** | figures + computed | `ShortTrmBorrowings.LoansRepaybleOnDemand.FromBanks`, `.FrmNonBanking`, `.OthFinanceInst`, `.Others`, `.TotLoansRepaybleOnDemand` | `SUM(L64:L67)` |
| 4Aii | 69 | Deposits from related parties | figure | `ShortTrmBorrowings.DepositsFrmRelatedParties` | entered |
| 4Aiii | 70 | Loans and advances from related parties | figure | `ShortTrmBorrowings.LoansAndAdv` | entered |
| 4Aiv | 71 | Other loans and advances | figure | `ShortTrmBorrowings.OthLoansAndAdv` | entered |
| 4Av | 72 | Other deposits | figure | `ShortTrmBorrowings.OthDeposits` | entered |
| 4Avi | 73 | **Total Short-term borrowings (ie + ii + iii + iv + v)** | computed | `ShortTrmBorrowings.TotShortTrmBorrowings` | `SUM(N68:N72)` |
| **4B** | 74–77 | Trade payables → Outstanding for more than 1 year / Others / **Total** | figures + computed | `TradePayables.OSMoreThanOneYr`, `.Others`, `.TotalTradePayables` | `SUM(L75:L76)` |
| **4C** | 78 | Other current liabilities | group | `OthCurrLiabilities` | |
| 4Ci | 79 | Current maturities of long-term debt | figure | `OthCurrLiabilities.CurrMatOnLTDebt` | entered |
| 4Cii | 80 | Current maturities of finance lease obligations | figure | `OthCurrLiabilities.CurrMatFinanceOblg` | entered |
| 4Ciii | 81 | Interest accrued but not due on borrowings | figure | `OthCurrLiabilities.AccrInterestNotDue` | entered |
| 4Civ | 82 | Interest accrued and due on borrowings | figure | `OthCurrLiabilities.AccrInterest` | entered |
| 4Cv | 83 | Income received in advance | figure | `OthCurrLiabilities.IncRecvdAdvance` | entered |
| 4Cvi | 84 | Unpaid dividends | figure | `OthCurrLiabilities.UnpaidDividend` | entered |
| 4Cvii | 85 | Application money received for allotment of securities and due for refund and interest accrued | figure | `OthCurrLiabilities.AppMonyRecvdAllotSecurities` | entered |
| 4Cviii | 86 | Unpaid matured deposits and interest accrued thereon | figure | `OthCurrLiabilities.UnpaidMatDeposits` | entered |
| 4Cix | 87 | Unpaid matured debentures and interest accrued thereon | figure | `OthCurrLiabilities.UnpaidMatureDebenture` | entered |
| 4Cx | 88 | Other payables | figure | `OthCurrLiabilities.OthPayables` | entered |
| 4Cxi | 89 | **Total Other current liabilities (i + ii + … + x)** | computed | `OthCurrLiabilities.TotOthCurrLiabilities` | `SUM(L79:L88)` |
| **4D** | 90 | Short-term provisions | group | `ShortTermProv` | |
| 4Di | 91 | Provision for employee benefit | figure | `ShortTermProv.EmpBenefitProv` | entered |
| 4Dii | 92 | Provision for Income-tax | figure | `ShortTermProv.ITProvision` | entered |
| 4D— | 94 | Proposed Dividend | figure | `ShortTermProv.ProposedDividend` | entered |
| 4D— | 95 | Tax on dividend | figure | `ShortTermProv.TaxOnDividend` | entered |
| 4Dv | 96 | Other | figure | `ShortTermProv.OthProvision` | entered |
| 4Dvi | 97 | **Total Short-term provisions (i + ii + iii + iv + v)** | computed | `ShortTermProv.TotShortTermProvisions` | `SUM(L91:L96)` |
| **4E** | 98 | **Total Current liabilities (4Avi + 4Biii + 4Cxi + 4Dvi)** | computed | `TotCurrLiabilitiesProvision` | `TotShortTermProvisions + TotOthCurrLiabilities + TotalTradePayables + TotShortTrmBorrowings` |
| **I** | 99 | **Total Equity and liabilities (1D + 2 + 3E + 4E)** | computed | `TotEquityAndLiabilities` | `MAX(0, TotCurrLiabilitiesProvision + TotalNonCurrLiabilites + ShareAppMoneyAllot.Total + TotShareHolderFund)` |

*(Row 75 shares the caption C75 "SOURCES OF FUNDS", a section band; the live
label on that row is 4Bi "Outstanding for more than 1 year".)*

---

## 3 · Part II — Assets

Schema paths are under `PARTA_BSFor6FrmAY13.Assets`.

### 1 · Non-current assets

| Item | Row | Label | Type | Schema key (under `Assets.NonCurrAssets`) | Formula |
|---|---|---|---|---|---|
| **1A** | 102 | Fixed assets | group | `FixedAsset` | |
| 1Ai | 103–107 | Tangible assets → Gross block / Depreciation / Impairment losses / **Net block (ia − ib − ic)** | figures + computed | `FixedAsset.Tangible.GrossBlock`, `.Depreciation`, `.ImpairmentLosses`, `.NetBlock` | `MAX(0, GrossBlock − Depreciation − ImpairmentLosses)` |
| 1Aii | 108–112 | Intangible assets → Gross block / Amortization / Impairment losses / **Net block (iia − iib − iic)** | figures + computed | `FixedAsset.InTangible.GrossBlock`, `.Amortization`, `.ImpairmentLosses`, `.NetBlock` | `MAX(0, GrossBlock − Amortization − ImpairmentLosses)` |
| 1Aiii | 113 | Capital work-in-progress | figure | `FixedAsset.CapWrkProg` | entered |
| 1Aiv | 114 | Intangible assets under development | figure | `FixedAsset.IntangibleAssetUnDev` | entered |
| 1Av | 115 | **Total Fixed assets (id + iid + iii + iv)** | computed | `FixedAsset.TotFixedAsset` | `SUM(L112:L114) + Tangible.NetBlock` |
| **1B** | 116 | Non-current investments | group | `NonCurrInvstmnts` | |
| 1Bi | 117 | Investment in property | figure | `NonCurrInvstmnts.InvInProperty` | entered |
| 1Bii | 118–121 | Investments in Equity instruments → Listed equities / Unlisted equities / **Total (iia + iib)** | figures + computed | `NonCurrInvstmnts.EquityInstruments.ListedEquities`, `.UnListedEquities`, `.Total` | `SUM(L119:L120)` |
| 1Biii | 122 | Investments in Preference shares | figure | `NonCurrInvstmnts.PreferenceShares` | entered |
| 1Biv | 123 | Investments in Government or trust securities | figure | `NonCurrInvstmnts.GovtOrTrustSecurities` | entered |
| 1Bv | 124 | Investments in Debenture or bonds | figure | `NonCurrInvstmnts.DebenturesOrBonds` | entered |
| 1Bvi | 125 | Investments in Mutual funds | figure | `NonCurrInvstmnts.MutualFunds` | entered |
| 1Bvii | 126 | Investments in Partnership firms | figure | `NonCurrInvstmnts.InvstmntInPrtnrShipFirm` | entered |
| 1Bviii | 127 | Others Investments | figure | `NonCurrInvstmnts.OtherInvstmnts` | entered |
| 1Bix | 128 | **Total Non-current investments (i + iic + iii + … + viii)** | computed | `NonCurrInvstmnts.TotNonCurrInvstmnts` | `SUM(L121:L127) + InvInProperty` |
| **1C** | 129 | Deferred tax assets (Net) | figure | `NetDeferredTaxAssets` | entered |
| **1D** | 130 | Long-term loans and advances | group | `LongTrmLoanAdv` | |
| 1Di | 131 | Capital advances | figure | `LongTrmLoanAdv.CapitalAdv` | entered |
| 1Dii | 132 | Security deposits | figure | `LongTrmLoanAdv.SecurityDeposits` | entered |
| 1Diii | 133 | Loans and advances to related parties | figure | `LongTrmLoanAdv.LoanAdvRelatedParties` | entered |
| 1Div | 134 | Other Loans and advances | figure | `LongTrmLoanAdv.OthLoanAdv` | entered |
| 1Dv | 135 | **Total Long-term loans and advances (i + ii + iii + iv)** | computed | `LongTrmLoanAdv.TotLTLoanAdv` | `SUM(L131:L134)` |
| 1Dvi | 136–139 | Long-term loans and advances included in Dv which is → (a) for the purpose of business or profession / (b) not for the purpose of business or profession / (c) given to shareholder, being the beneficial owner of share, or to any concern or on behalf/ benefit of such shareholder u/s 2(22)(e) | figures | `LongTrmLoanAdv.LTLoanAdvDtls.BusOrProf`, `.NotForBusOrProf`, `.ShareHolderUs2_22` | entered |
| **1E** | 140 | Other non-current assets | group | `OthNonCurrAssets` | |
| 1Ei | 141–145 | Long-term trade receivables → Secured, considered good / Unsecured, considered good / Doubtful / **Total (ia + ib + ic)** | figures + computed | `OthNonCurrAssets.LTTradeReceivables.Secured`, `.Unsecured`, `.Doubtful`, `.TotOthNonCurrAssets` | `SUM(L142:L144)` |
| 1Eii | 146 | Others | figure | `OthNonCurrAssets.Others` | entered |
| 1Eiii | 147 | **Total (id + ii)** | computed | `OthNonCurrAssets.Total` | `Others + TotOthNonCurrAssets` |
| 1Eiv | 148 | Non-current assets included in Eiii which is due from shareholder, being the beneficial owner of share, or from any concern or on behalf/ benefit of such shareholder u/s 2(22)(e) | figure | `OthNonCurrAssets.NonCurrAssetUs2_22` | entered |
| **1F** | 149 | **Total Non-current assets (Av + Bix + C + Dv + Eiii)** | computed | `TotNonCurrAssets` | `OthNonCurrAssets.Total + TotLTLoanAdv + TotFixedAsset + TotNonCurrInvstmnts + NetDeferredTaxAssets` |

### 2 · Current assets

| Item | Row | Label | Type | Schema key (under `Assets.CurrentAssets`) | Formula |
|---|---|---|---|---|---|
| **2A** | 151 | Current investments | group | `CurrInvstmnts` | |
| 2Ai | 152–155 | Investment in Equity instruments → Listed equities / Unlisted equities / **Total (ia + ib)** | figures + computed | `CurrInvstmnts.EquityInstruments.ListedEquities`, `.UnListedEquities`, `.Total` | `SUM(L153:L154)` |
| 2Aii | 156 | Investment in Preference shares | figure | `CurrInvstmnts.PreferenceShares` | entered |
| 2Aiii | 157 | Investment in government or trust securities | figure | `CurrInvstmnts.GovtOrTrustSecurities` | entered |
| 2Aiv | 158 | Investment in debentures or bonds | figure | `CurrInvstmnts.DebenturesOrBonds` | entered |
| 2Av | 159 | Investment in Mutual funds | figure | `CurrInvstmnts.MutualFunds` | entered |
| 2Avi | 160 | Investment in partnership firms | figure | `CurrInvstmnts.InvstmntInPrtnrShipFirm` | entered |
| 2Avii | 161 | Other investment | figure | `CurrInvstmnts.OtherInvstmnts` | entered |
| 2Aviii | 162 | **Total Current investments (ic + ii + iii + … + vii)** | computed | `CurrInvstmnts.TotCurrInvstmnts` | `SUM(L155:L161)` |
| **2B** | 163 | Inventories | group | `Inventories` | |
| 2Bi | 164 | Raw materials | figure | `Inventories.RawMatl` | entered |
| 2Bii | 165 | Work-in-progress | figure | `Inventories.WorkInProgress` | entered |
| 2Biii | 166 | Finished goods | figure | `Inventories.FinOrTradGood` | entered |
| 2Biv | 167 | Stock-in-trade (in respect of goods acquired for trading) | figure | `Inventories.StkInTrade` | entered |
| 2Bv | 168 | Stores and spares | figure | `Inventories.StoresConsumables` | entered |
| 2Bvi | 169 | Loose tools | figure | `Inventories.LooseTools` | entered |
| 2Bvii | 170 | Others | figure | `Inventories.Others` | entered |
| 2Bviii | 171 | **Total Inventories (i + ii + … + vii)** | computed | `Inventories.TotInventries` | `SUM(L164:L170)` |
| **2C** | 172–175 | Trade receivables → Outstanding for more than 6 months / Others / **Total** | figures + computed | `TradeReceivables.OSMoreThanSixMonths`, `.Others`, `.TotalTradeReceivables` | `SUM(L173:L174)` |
| **2D** | 176 | Cash and cash equivalents | group | `CashNCashEquivalents` | |
| 2Di | 177 | Balances with Banks | figure | `CashNCashEquivalents.BalWithBanks` | entered |
| 2Dii | 178 | Cheques, drafts in hand | figure | `CashNCashEquivalents.ChequesDrafts` | entered |
| 2Diii | 179 | Cash in hand | figure | `CashNCashEquivalents.CashInHand` | entered |
| 2Div | 180 | Others | figure | `CashNCashEquivalents.Others` | entered |
| 2Dv | 181 | **Total Cash and cash equivalents (i + ii + iii + iv)** | computed | `CashNCashEquivalents.TotCashNCashEquivalents` | `SUM(L177:L180)` |
| **2E** | 182 | Short-term loans and advances | group | `TotShortTermLoanAdv` | |
| 2Ei | 183 | Loans and advances to related parties | figure | `TotShortTermLoanAdv.LoanAdv` | entered |
| 2Eii | 184 | Others | figure | `TotShortTermLoanAdv.Others` | entered |
| 2Eiii | 185 | **Total Short-term loans and advances (i + ii)** | computed | `TotShortTermLoanAdv.TotShrtTermLoans` | `SUM(L183:L184)` |
| 2Eiv | 186–189 | Short-term loans and advances included in Eiii which is → (a) for the purpose of business or profession / (b) not for the purpose of business or profession / (c) given to a shareholder, being the beneficial owner of share, or to any concern or on behalf/ benefit of such shareholder u/s 2(22)(e) | figures | `TotShortTermLoanAdv.STLoanAdvDtls.BusOrProf`, `.NotForBusOrProf`, `.ShareHolderUs2_22` | entered |
| **2F** | 190 | Other current assets | figure | `OtherCurrAssets` | entered |
| **2G** | 191 | **Total Current assets (Aviii + Bviii + Ciii + Dv + Eiii + F)** | computed | `TotCurrAssets` | `OtherCurrAssets + TotShrtTermLoans + TotCashNCashEquivalents + TotalTradeReceivables + TotInventries + TotCurrInvstmnts` |
| **II** | 192 | **Total Assets (1F + 2G)** | computed | `TotalAssets` | `TotCurrAssets + TotNonCurrAssets` |

---

## 4 · Hidden rows — not built

Three rows are hidden on the sheet; the utility carries them for legacy
reasons and they are **excluded** (seventeen-mistakes rule 1):

| Row | Label | Reason it is hidden |
|---|---|---|
| 93 | Provision for Wealth-tax | Wealth-tax abolished (A.Y. 2016-17); the row is retained but hidden, and has no live schema key. |
| (2 further blank rows) | — | spacer rows with no content and no key |

None of the three has a schema leaf, so nothing is lost by not building them.

---

## 5 · The dropdowns

There are **no enumerated (list) dropdowns** on this sheet. Every input cell
carries only a numeric data-validation: minimum 0 on ordinary amount cells, a
signed limit `-99999999999999` on the P&L-balance and reserves rows (21, 23,
24, 89) that may be negative, and `1`/`0` format limits on the other-reserve
Sl-No cells. No value list is seeded from `enums.json`.

---

## 6 · The rules the sheet computes (the balancing identity)

The whole sheet is a chain of `SUM` totals up to the two half-totals, which the
department requires to be **equal**:

```
Total Equity and liabilities (row 99, I)  =  Total Assets (row 192, II)
```

`row 99 = MAX(0, TotShareHolderFund + ShareAppMoneyAllot.Total +
TotalNonCurrLiabilites + TotCurrLiabilitiesProvision)`; `row 192 =
TotNonCurrAssets + TotCurrAssets`. The `MAX(0, …)` on row 99 and on the two
fixed-asset net-block rows (107, 112) is the only non-additive rule; everything
else is a straight sum of its sub-lines, as listed in §§2–3.

Net block is floored: `id = MAX(0, GrossBlock − Depreciation − ImpairmentLosses)`
for tangibles (row 107) and `iid = MAX(0, GrossBlock − Amortization −
ImpairmentLosses)` for intangibles (row 112).

---

## 7 · Cross-sheet feeds

- **In ←** the **Statement of Profit and Loss**: item 1Bviii "Surplus i.e.
  Balance in statement of profit and loss" (`ResrNSurp.PLAccount`) is the P&L's
  "Balance carried to balance sheet" (P&L item 60). Debit balance shown as a
  negative figure.
- **In ←** the depreciation schedules feed the fixed-asset gross/dep/net blocks
  in a fully filled return, but on the sheet these are entered figures.
- **Out →** nothing computes off the Balance Sheet directly; the department
  cross-checks its totals against Schedule OI, Schedule BP, and the P&L.

The Ind-AS balance sheet (`Part A-BS - Ind AS`) is a separate sheet and block;
this book is only the non-Ind-AS `PARTA_BSFor6FrmAY13`.

---

## 8 · What the schema marks mandatory

Almost every leaf of `PARTA_BSFor6FrmAY13` is `required` — the schema demands a
figure (zero is acceptable) on every line and every total, so a company that has
no reserves still files `ResrNSurp` with zeros. The two array details
(`OtherResrvDtls[]` with `.Nature` + `.Amount`) are the only repeatable rows.
The full leaf list, with the required flag, is in the appendix (§10). Every live
row in §§2–3 maps to a leaf; the only unbacked live label is the hidden
Wealth-tax row (§4), which is excluded.

---

## 9 · What this means for the build

1. **Two halves that must foot to the same figure** — Equity & Liabilities (I,
   row 99) equals Assets (II, row 192); surface the identity as a check.
2. **Deeply nested groups, all computed totals** — every A/B/C/D group has a
   `SUM` total, every half has a total, and the fixed-asset net blocks are
   `MAX(0, gross − dep/amort − impairment)`.
3. **One repeatable table** — Other reserves (1Bvii), Nature + Amount, rows
   addable; everything else is a single figure.
4. **1Bviii is fed from the P&L** — the surplus line is the P&L's carried
   balance; a debit balance is a negative figure.
5. **The 2(22)(e) sub-lines (1Dvi, 2Eiv)** — the "included in … which is"
   break-downs are informational figures under the loan/advance totals; build
   them as read-only sub-details, not new totals.
6. **Wealth-tax row is hidden** — do not build row 93; it has no key.

---

## 10 · Appendix — every schema leaf of `PARTA_BSFor6FrmAY13`

The complete leaf list of the block (path · type · `*`=required), for build
coverage. Each maps to a row in §§2–3.

- * `EquityAndLiablities.ShareHolderFund.ShareCapital.Authorised` — integer
- * `EquityAndLiablities.ShareHolderFund.ShareCapital.IssuedSubsPaidUp` — integer
- * `EquityAndLiablities.ShareHolderFund.ShareCapital.SubscribedNotFullyPaid` — integer
- * `EquityAndLiablities.ShareHolderFund.ShareCapital.TotShareCapital` — integer
- * `EquityAndLiablities.ShareHolderFund.ResrNSurp.CapResr` — integer
- * `EquityAndLiablities.ShareHolderFund.ResrNSurp.CapRedempResr` — integer
- * `EquityAndLiablities.ShareHolderFund.ResrNSurp.SecurPremResr` — integer
- * `EquityAndLiablities.ShareHolderFund.ResrNSurp.DebunRedResr` — integer
- * `EquityAndLiablities.ShareHolderFund.ResrNSurp.RevResr` — integer
- * `EquityAndLiablities.ShareHolderFund.ResrNSurp.ShareOptOSAmount` — integer
-   `EquityAndLiablities.ShareHolderFund.ResrNSurp.OtherResrvDtls[]` — array
- * `EquityAndLiablities.ShareHolderFund.ResrNSurp.OtherResrvDtls[].Nature` — string
- * `EquityAndLiablities.ShareHolderFund.ResrNSurp.OtherResrvDtls[].Amount` — integer
- * `EquityAndLiablities.ShareHolderFund.ResrNSurp.OtherResrvTotal` — integer
- * `EquityAndLiablities.ShareHolderFund.ResrNSurp.PLAccount` — integer
- * `EquityAndLiablities.ShareHolderFund.ResrNSurp.TotResrNSurp` — integer
- * `EquityAndLiablities.ShareHolderFund.MoneyRecvdAgainstShares` — integer
- * `EquityAndLiablities.ShareHolderFund.TotShareHolderFund` — integer
- * `EquityAndLiablities.ShareAppMoneyAllot.PendingLtOneYr` — integer
- * `EquityAndLiablities.ShareAppMoneyAllot.PendingMtOneYr` — integer
- * `EquityAndLiablities.ShareAppMoneyAllot.Total` — integer
- * `EquityAndLiablities.NonCurrLiabilities.LongTermBorrowings.BondsDebentures.ForeignCurrency` — integer
- * `EquityAndLiablities.NonCurrLiabilities.LongTermBorrowings.BondsDebentures.Rupee` — integer
- * `EquityAndLiablities.NonCurrLiabilities.LongTermBorrowings.BondsDebentures.Total` — integer
- * `EquityAndLiablities.NonCurrLiabilities.LongTermBorrowings.TermLoans.ForeignCurrency` — integer
- * `EquityAndLiablities.NonCurrLiabilities.LongTermBorrowings.TermLoans.RupeeLoans.FromBanks` — integer
- * `EquityAndLiablities.NonCurrLiabilities.LongTermBorrowings.TermLoans.RupeeLoans.FromOthers` — integer
- * `EquityAndLiablities.NonCurrLiabilities.LongTermBorrowings.TermLoans.RupeeLoans.Total` — integer
- * `EquityAndLiablities.NonCurrLiabilities.LongTermBorrowings.TermLoans.TotalTermLoans` — integer
- * `EquityAndLiablities.NonCurrLiabilities.LongTermBorrowings.DeferredPymtLiabilities` — integer
- * `EquityAndLiablities.NonCurrLiabilities.LongTermBorrowings.DepositsFrmRelatedParties` — integer
- * `EquityAndLiablities.NonCurrLiabilities.LongTermBorrowings.OtherDeposits` — integer
- * `EquityAndLiablities.NonCurrLiabilities.LongTermBorrowings.LoansAndAdv` — integer
- * `EquityAndLiablities.NonCurrLiabilities.LongTermBorrowings.OthersLoanAdv` — integer
- * `EquityAndLiablities.NonCurrLiabilities.LongTermBorrowings.LongTermMaturities` — integer
- * `EquityAndLiablities.NonCurrLiabilities.LongTermBorrowings.TotalLTBorrowings` — integer
- * `EquityAndLiablities.NonCurrLiabilities.NetDefferedTaxLiability` — integer
- * `EquityAndLiablities.NonCurrLiabilities.OthLongTermLiablities.TradePayables` — integer
- * `EquityAndLiablities.NonCurrLiabilities.OthLongTermLiablities.Others` — integer
- * `EquityAndLiablities.NonCurrLiabilities.OthLongTermLiablities.TotalOthLtLiabilities` — integer
- * `EquityAndLiablities.NonCurrLiabilities.LongTermProvisions.ProvEmpBenefits` — integer
- * `EquityAndLiablities.NonCurrLiabilities.LongTermProvisions.Others` — integer
- * `EquityAndLiablities.NonCurrLiabilities.LongTermProvisions.Total` — integer
- * `EquityAndLiablities.NonCurrLiabilities.TotalNonCurrLiabilites` — integer
- * `EquityAndLiablities.CurrentLiabilities.ShortTrmBorrowings.LoansRepaybleOnDemand.FromBanks` — integer
- * `EquityAndLiablities.CurrentLiabilities.ShortTrmBorrowings.LoansRepaybleOnDemand.FrmNonBanking` — integer
- * `EquityAndLiablities.CurrentLiabilities.ShortTrmBorrowings.LoansRepaybleOnDemand.OthFinanceInst` — integer
- * `EquityAndLiablities.CurrentLiabilities.ShortTrmBorrowings.LoansRepaybleOnDemand.Others` — integer
- * `EquityAndLiablities.CurrentLiabilities.ShortTrmBorrowings.LoansRepaybleOnDemand.TotLoansRepaybleOnDemand` — integer
- * `EquityAndLiablities.CurrentLiabilities.ShortTrmBorrowings.DepositsFrmRelatedParties` — integer
- * `EquityAndLiablities.CurrentLiabilities.ShortTrmBorrowings.LoansAndAdv` — integer
- * `EquityAndLiablities.CurrentLiabilities.ShortTrmBorrowings.OthLoansAndAdv` — integer
- * `EquityAndLiablities.CurrentLiabilities.ShortTrmBorrowings.OthDeposits` — integer
- * `EquityAndLiablities.CurrentLiabilities.ShortTrmBorrowings.TotShortTrmBorrowings` — integer
- * `EquityAndLiablities.CurrentLiabilities.TradePayables.OSMoreThanOneYr` — integer
- * `EquityAndLiablities.CurrentLiabilities.TradePayables.Others` — integer
- * `EquityAndLiablities.CurrentLiabilities.TradePayables.TotalTradePayables` — integer
- * `EquityAndLiablities.CurrentLiabilities.OthCurrLiabilities.CurrMatOnLTDebt` — integer
- * `EquityAndLiablities.CurrentLiabilities.OthCurrLiabilities.CurrMatFinanceOblg` — integer
- * `EquityAndLiablities.CurrentLiabilities.OthCurrLiabilities.AccrInterestNotDue` — integer
- * `EquityAndLiablities.CurrentLiabilities.OthCurrLiabilities.AccrInterest` — integer
- * `EquityAndLiablities.CurrentLiabilities.OthCurrLiabilities.IncRecvdAdvance` — integer
- * `EquityAndLiablities.CurrentLiabilities.OthCurrLiabilities.UnpaidDividend` — integer
- * `EquityAndLiablities.CurrentLiabilities.OthCurrLiabilities.AppMonyRecvdAllotSecurities` — integer
- * `EquityAndLiablities.CurrentLiabilities.OthCurrLiabilities.UnpaidMatDeposits` — integer
- * `EquityAndLiablities.CurrentLiabilities.OthCurrLiabilities.UnpaidMatureDebenture` — integer
- * `EquityAndLiablities.CurrentLiabilities.OthCurrLiabilities.OthPayables` — integer
- * `EquityAndLiablities.CurrentLiabilities.OthCurrLiabilities.TotOthCurrLiabilities` — integer
- * `EquityAndLiablities.CurrentLiabilities.ShortTermProv.EmpBenefitProv` — integer
- * `EquityAndLiablities.CurrentLiabilities.ShortTermProv.ITProvision` — integer
- * `EquityAndLiablities.CurrentLiabilities.ShortTermProv.ProposedDividend` — integer
- * `EquityAndLiablities.CurrentLiabilities.ShortTermProv.TaxOnDividend` — integer
- * `EquityAndLiablities.CurrentLiabilities.ShortTermProv.OthProvision` — integer
- * `EquityAndLiablities.CurrentLiabilities.ShortTermProv.TotShortTermProvisions` — integer
- * `EquityAndLiablities.CurrentLiabilities.TotCurrLiabilitiesProvision` — integer
- * `EquityAndLiablities.TotEquityAndLiabilities` — integer
- * `Assets.NonCurrAssets.FixedAsset.Tangible.GrossBlock` — integer
- * `Assets.NonCurrAssets.FixedAsset.Tangible.Depreciation` — integer
- * `Assets.NonCurrAssets.FixedAsset.Tangible.ImpairmentLosses` — integer
- * `Assets.NonCurrAssets.FixedAsset.Tangible.NetBlock` — integer
- * `Assets.NonCurrAssets.FixedAsset.InTangible.GrossBlock` — integer
- * `Assets.NonCurrAssets.FixedAsset.InTangible.Amortization` — integer
- * `Assets.NonCurrAssets.FixedAsset.InTangible.ImpairmentLosses` — integer
- * `Assets.NonCurrAssets.FixedAsset.InTangible.NetBlock` — integer
- * `Assets.NonCurrAssets.FixedAsset.CapWrkProg` — integer
- * `Assets.NonCurrAssets.FixedAsset.IntangibleAssetUnDev` — integer
- * `Assets.NonCurrAssets.FixedAsset.TotFixedAsset` — integer
- * `Assets.NonCurrAssets.NonCurrInvstmnts.InvInProperty` — integer
- * `Assets.NonCurrAssets.NonCurrInvstmnts.EquityInstruments.ListedEquities` — integer
- * `Assets.NonCurrAssets.NonCurrInvstmnts.EquityInstruments.UnListedEquities` — integer
- * `Assets.NonCurrAssets.NonCurrInvstmnts.EquityInstruments.Total` — integer
- * `Assets.NonCurrAssets.NonCurrInvstmnts.PreferenceShares` — integer
- * `Assets.NonCurrAssets.NonCurrInvstmnts.GovtOrTrustSecurities` — integer
- * `Assets.NonCurrAssets.NonCurrInvstmnts.DebenturesOrBonds` — integer
- * `Assets.NonCurrAssets.NonCurrInvstmnts.MutualFunds` — integer
- * `Assets.NonCurrAssets.NonCurrInvstmnts.InvstmntInPrtnrShipFirm` — integer
- * `Assets.NonCurrAssets.NonCurrInvstmnts.OtherInvstmnts` — integer
- * `Assets.NonCurrAssets.NonCurrInvstmnts.TotNonCurrInvstmnts` — integer
- * `Assets.NonCurrAssets.NetDeferredTaxAssets` — integer
- * `Assets.NonCurrAssets.LongTrmLoanAdv.CapitalAdv` — integer
- * `Assets.NonCurrAssets.LongTrmLoanAdv.SecurityDeposits` — integer
- * `Assets.NonCurrAssets.LongTrmLoanAdv.LoanAdvRelatedParties` — integer
- * `Assets.NonCurrAssets.LongTrmLoanAdv.OthLoanAdv` — integer
- * `Assets.NonCurrAssets.LongTrmLoanAdv.TotLTLoanAdv` — integer
- * `Assets.NonCurrAssets.LongTrmLoanAdv.LTLoanAdvDtls.BusOrProf` — integer
- * `Assets.NonCurrAssets.LongTrmLoanAdv.LTLoanAdvDtls.NotForBusOrProf` — integer
- * `Assets.NonCurrAssets.LongTrmLoanAdv.LTLoanAdvDtls.ShareHolderUs2_22` — integer
- * `Assets.NonCurrAssets.OthNonCurrAssets.LTTradeReceivables.Secured` — integer
- * `Assets.NonCurrAssets.OthNonCurrAssets.LTTradeReceivables.Unsecured` — integer
- * `Assets.NonCurrAssets.OthNonCurrAssets.LTTradeReceivables.Doubtful` — integer
- * `Assets.NonCurrAssets.OthNonCurrAssets.LTTradeReceivables.TotOthNonCurrAssets` — integer
- * `Assets.NonCurrAssets.OthNonCurrAssets.Others` — integer
- * `Assets.NonCurrAssets.OthNonCurrAssets.Total` — integer
- * `Assets.NonCurrAssets.OthNonCurrAssets.NonCurrAssetUs2_22` — integer
- * `Assets.NonCurrAssets.TotNonCurrAssets` — integer
- * `Assets.CurrentAssets.CurrInvstmnts.EquityInstruments.ListedEquities` — integer
- * `Assets.CurrentAssets.CurrInvstmnts.EquityInstruments.UnListedEquities` — integer
- * `Assets.CurrentAssets.CurrInvstmnts.EquityInstruments.Total` — integer
- * `Assets.CurrentAssets.CurrInvstmnts.PreferenceShares` — integer
- * `Assets.CurrentAssets.CurrInvstmnts.GovtOrTrustSecurities` — integer
- * `Assets.CurrentAssets.CurrInvstmnts.DebenturesOrBonds` — integer
- * `Assets.CurrentAssets.CurrInvstmnts.MutualFunds` — integer
- * `Assets.CurrentAssets.CurrInvstmnts.InvstmntInPrtnrShipFirm` — integer
- * `Assets.CurrentAssets.CurrInvstmnts.OtherInvstmnts` — integer
- * `Assets.CurrentAssets.CurrInvstmnts.TotCurrInvstmnts` — integer
- * `Assets.CurrentAssets.Inventories.RawMatl` — integer
- * `Assets.CurrentAssets.Inventories.WorkInProgress` — integer
- * `Assets.CurrentAssets.Inventories.FinOrTradGood` — integer
- * `Assets.CurrentAssets.Inventories.StkInTrade` — integer
- * `Assets.CurrentAssets.Inventories.StoresConsumables` — integer
- * `Assets.CurrentAssets.Inventories.LooseTools` — integer
- * `Assets.CurrentAssets.Inventories.Others` — integer
- * `Assets.CurrentAssets.Inventories.TotInventries` — integer
- * `Assets.CurrentAssets.TradeReceivables.OSMoreThanSixMonths` — integer
- * `Assets.CurrentAssets.TradeReceivables.Others` — integer
- * `Assets.CurrentAssets.TradeReceivables.TotalTradeReceivables` — integer
- * `Assets.CurrentAssets.CashNCashEquivalents.BalWithBanks` — integer
- * `Assets.CurrentAssets.CashNCashEquivalents.ChequesDrafts` — integer
- * `Assets.CurrentAssets.CashNCashEquivalents.CashInHand` — integer
- * `Assets.CurrentAssets.CashNCashEquivalents.Others` — integer
- * `Assets.CurrentAssets.CashNCashEquivalents.TotCashNCashEquivalents` — integer
- * `Assets.CurrentAssets.TotShortTermLoanAdv.LoanAdv` — integer
- * `Assets.CurrentAssets.TotShortTermLoanAdv.Others` — integer
- * `Assets.CurrentAssets.TotShortTermLoanAdv.TotShrtTermLoans` — integer
- * `Assets.CurrentAssets.TotShortTermLoanAdv.STLoanAdvDtls.BusOrProf` — integer
- * `Assets.CurrentAssets.TotShortTermLoanAdv.STLoanAdvDtls.NotForBusOrProf` — integer
- * `Assets.CurrentAssets.TotShortTermLoanAdv.STLoanAdvDtls.ShareHolderUs2_22` — integer
- * `Assets.CurrentAssets.OtherCurrAssets` — integer
- * `Assets.CurrentAssets.TotCurrAssets` — integer
- * `TotalAssets` — integer
