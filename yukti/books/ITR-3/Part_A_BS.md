# Part A - BS

Sheet: **Part A - BS** (`sheet6.xml`, VBA codename/module `PartA_BS` / `Sheet3`) · Section: **bpa** · Schema block: **PARTA_BS** · Source: `python3 tools/dump.py --form ITR-3 --sheet "Part A - BS"` (and `--formulas`, `--dropdowns`, `--schema PARTA_BS`, `--leaves PARTA_BS`), `books/ITR-3/rules.json`, `sources/ITR-3/vba_text.txt`.

## The shape

Row 3 titles the sheet exactly: "Part A-BS" / **"BALANCE SHEET AS ON 31ST DAY OF MARCH, 2026 OR AS ON THE DATE OF CLOSURE OF BUSINESS AS APPLICABLE OF THE PROPRIETORY BUSINESS OR PROFESSION"**. It is the ITR-3 balance sheet of a proprietary business or profession — the "Profits and Gains of Business or Profession" head has no ITR-2 equivalent, so this sheet is built only here. The sheet carries one schema block, `PARTA_BS`, made of three sibling objects that mirror the sheet's own three printed headings: `FundSrc` (rows 4-31, "SOURCES OF FUNDS": proprietor's fund, loan funds, deferred tax liability, advances), `FundApply` (rows 32-89, "APPLICATION OF FUNDS": fixed assets, investments, current assets/loans/advances net of current liabilities and provisions, and miscellaneous adjustments), and `NoBooksOfAccBS` (rows 90-94, "NO ACCOUNT CASE": four summary figures used instead of a full balance sheet when regular books of account are not maintained). Every one of the block's 70 leaves is a single rupee figure — nothing on this sheet repeats — and the two grand totals (`TotFundSrc` at row 31 and `TotFundApply` at row 89) must reconcile with each other.

## The items

Type shorthand used below (from `--schema PARTA_BS`): **N0** = integer, minimum 0, maximum 99999999999999; **N±** = integer, maximum 99999999999999, no minimum stated (negative allowed); **N±u** = integer with no min/max stated at all (an unbounded computed rollup); **hdg** = a group heading printed on the sheet that is not itself a schema leaf.

#### Sources of Funds — schema object `FundSrc` (required; rows 4-31)

| Row | Item | Field label | Type | Schema key | Notes |
|---|---|---|---|---|---|
| 4 | — | SOURCES OF FUNDS / Proprietor's fund | hdg | — | section title + top item "1" heading |
| 5 | a | Proprietor's capital | N± | `PropCap` | entry cell, no minimum — can be negative |
| 6 | b | Reserves and Surplus | hdg | — | heading for bi-bv |
| 7 | bi | Revaluation Reserve | N0 | `RevResr` | |
| 8 | bii | Capital Reserve | N0 | `CapResr` | |
| 9 | biii | Statutory Reserve | N0 | `StatResr` | |
| 10 | biv | Any other Reserve | N0 | `OthResr` | |
| 11 | bv | Total (bi + bii + biii + biv) | N0 | `TotResrNSurp` | computed — L11 |
| 12 | 1c | Total proprietor's fund (a + bv) | N± | `TotPropFund` | computed — L12; rule A53 |
| 13 | — | Loan funds | hdg | — | top item "2" heading |
| 14 | a | Secured loans | hdg | — | heading for ai-aiii |
| 15 | ai | Foreign Currency Loans | N0 | `ForeignCurrLoan` | |
| 16 | ii | Rupee Loans | hdg | — | heading for iiA-iiC |
| 17 | iiA | From Banks | N0 | `FrmBank` | secured, rupee loans |
| 18 | iiB | From others | N0 | `FrmOthrs` | secured, rupee loans |
| 19 | iiC | Total ( iiA + iiB) | N0 | `TotRupeeLoan` | computed — J19 |
| 20 | aiii | Total (ai + iiC) | N0 | `TotSecrLoan` | computed — L20 |
| 21 | b | Unsecured loans (including deposits) | hdg | — | heading for bi-biii |
| 22 | bi | From Banks | N0 | `FrmBank` | unsecured — same key name as row 17, different path |
| 23 | bii | From others | N0 | `FrmOthrs` | unsecured — same key name as row 18, different path |
| 24 | biii | Total (bi + bii) | N0 | `TotUnSecrLoan` | computed — L24 |
| 25 | 2c | Total Loan Funds (aiii + biii) | N0 | `TotLoanFund` | computed — L25; rule A54 |
| 26 | — | Deferred tax liability | N0 | `DeferredTax` | top item "3", single figure |
| 27 | — | Advances | hdg | — | top item "4" heading |
| 28 | 4i | From persons specified in section 40A(2)(b) of the I. T. Act | N0 | `FromPrsn` | not required (component) |
| 29 | 4ii | From others | N0 | `FromOthers` | not required (component) |
| 30 | 4iii | Total Advances (i + ii) | N0 | `TotalAdvances` | computed — L30 (named ranges); rule A60; required although its components are not |
| 31 | — | Sources of funds (1c + 2c +3+4iii) | N± | `TotFundSrc` | computed — L31; rule A55; cross-checked against `TotFundApply`, rule A52 |

#### Application of Funds — schema object `FundApply` (required; rows 32-89; row 79 hidden, see "Hidden rows")

| Row | Item | Field label | Type | Schema key | Notes |
|---|---|---|---|---|---|
| 32 | — | APPLICATION OF FUNDS / Fixed assets | hdg | — | section title + top item "1" heading |
| 33 | 1a | Gross: Block | N0 | `GrossBlock` | |
| 34 | 1b | Depreciation | N0 | `Depreciation` | |
| 35 | 1c | Net Block (1a – 1b) | N0 | `NetBlock` | computed — J35 = MAX(0, GrossBlock − Depreciation), floored at 0 |
| 36 | 1d | Capital work-in-progress | N0 | `CapWrkProg` | |
| 37 | 1e | Total (1c + 1d) | N0 | `TotFixedAsset` | computed — L37 |
| 38 | — | Investments | hdg | — | top item "2" heading |
| 39 | a | Long-term investments | hdg | — | heading for ai-aiii |
| 40 | ai | Government and other Securities - Quoted | N0 | `GovtOthSecQuoted` | |
| 41 | aii | Government and other Securities – Unquoted | N0 | `GovOthSecUnQoted` | |
| 42 | aiii | Total (ai + aii) | N0 | `TotLongTermInv` | computed — L42 |
| 43 | b | Short-Term investments | hdg | — | heading for bi-biv; schema object is `TradeInv` |
| 44 | bi | Equity Shares, including share application money | N0 | `EquityShares` | |
| 45 | bii | Preference Shares | N0 | `PreferShares` | |
| 46 | biii | Debenture | N0 | `Debenture` | |
| 47 | biv | Total (bi + bii + biii) | N0 | `TotTradeInv` | computed — L47 |
| 48 | 2c | Total investments (aiii + biv) | N0 | `TotInvestments` | computed — L48; rule A56 |
| 49 | — | Current assets, loans and advances | hdg | — | top item "3" heading |
| 50 | a | Current assets | hdg | — | |
| 51 | i | Inventories | hdg | — | heading for iA-iE |
| 52 | iA | Stores/consumables including packing material | N0 | `StoresConsumables` | |
| 53 | iB | Raw materials | N0 | `RawMatl` | |
| 54 | iC | Stock-in-process | N0 | `StkInProcess` | |
| 55 | iD | Finished Goods/Traded Goods | N0 | `FinOrTradGood` | |
| 56 | iE | Total (iA + iB + iC + iD) | N0 | `TotInventries` | computed — L56 |
| 57 | aii | Sundry Debtors | N0 | `SndryDebtors` | |
| 58 | iii | Cash and Bank Balances | hdg | — | heading for iiiA-iiiC |
| 59 | iiiA | Cash-in-hand | N0 | `CashinHand` | |
| 60 | iiiB | Balance with bank | N±u | `BankBal` | no schema bound; sheet floor −99999999999999 — can be negative (e.g. overdraft) |
| 61 | iiiC | Total (iiiA + iiiB) | N±u | `TotCashOrBankBal` | computed — L61; no schema bound |
| 62 | aiv | Other Current Assets | N0 | `OthCurrAsset` | |
| 63 | av | Total current assets (iE + aii + iiiC + aiv) | N±u | `TotCurrAsset` | computed — L63; rule A57; no schema bound |
| 64 | b | Loans and advances | hdg | — | heading for bi-biv |
| 65 | bi | Advances recoverable in cash or in kind or for value to be received | N0 | `AdvRecoverable` | |
| 66 | bii | Deposits, loans and advances to corporates and others | N0 | `Deposits` | |
| 67 | biii | Balance with Revenue Authorities | N0 | `BalWithRevAuth` | |
| 68 | biv | Total (bi + bii + biii) | N0 | `TotLoanAdv` | computed — L68 |
| 69 | 3c | Total of current assets, loans and advances (av + biv) | N±u | `TotCurrAssetLoanAdv` | computed — L69; no schema bound |
| 70 | d | Current liabilities and provisions | hdg | — | heading for i-iii |
| 71 | i | Current liabilities | hdg | — | heading for iA-iE |
| 72 | iA | Sundry Creditors | N0 | `SundryCred` | |
| 73 | iB | Liability for Leased Assets | N0 | `LiabForLeasedAsset` | |
| 74 | iC | Interest Accrued on above | N0 | `AccrIntonLeasedAsset` | |
| 75 | iD | Interest accrued but not due on loans | N0 | `AccrIntNotDue` | |
| 76 | iE | Total (iA + iB + iC + iD) | N0 | `TotCurrLiabilities` | computed — L76 |
| 77 | ii | Provisions | hdg | — | heading for iiA-iiD; row 79 (iiB, hidden) is skipped here — see "Hidden rows" |
| 78 | iiA | Provision for Income Tax | N0 | `ITProvision` | |
| 80 | iiB | Provision for Leave encashment/Superannuation/Gratuity | N0 | `ELSuperAnnGratProvision` | visible row re-uses letter "iiB" — the hidden row 79 also prints "B" |
| 81 | iiC | Other Provisions | N0 | `OthProvision` | |
| 82 | iiD | Total (iiA + iiB + iiC ) | N0 | `TotProvisions` | computed — L82 = SUM(J78,J80,J81), skips hidden J79 |
| 83 | diii | Total (iE + iiD) | N0 | `TotCurrLiabilitiesProvision` | computed — L83 |
| 84 | 3e | Net current assets (3c – diii) | N±u | `NetCurrAsset` | computed — L84; rule A58; schema note "Current Asset-current liabilities can be negative" |
| 85 | 4a | Miscellaneous expenditure not written off or adjusted | N0 | `MiscExpndr` | |
| 86 | 4b | Deferred tax asset | N0 | `DefTaxAsset` | |
| 87 | 4c | Profit and loss account / Accumulated balance | N0 | `AccumaltedLosses` | |
| 88 | 4d | Total (4a + 4b + 4c) | N0 | `TotMiscAdjust` | computed — L88 |
| 89 | — | Total, application of funds (1e + 2c + 3e +4d) | N±u | `TotFundApply` | computed — L89; rule A59; cross-checked against `TotFundSrc`, rule A52 |

#### No Account Case — schema object `NoBooksOfAccBS` (optional; rows 90-94)

| Row | Item | Field label | Type | Schema key | Notes |
|---|---|---|---|---|---|
| 90 | — | NO ACCOUNT CASE — "In a case where regular books of account of business or profession are not maintained - (furnish the following information as on 31st day of March, 2026, in respect of business or profession)" | hdg | — | section heading; applicability under rules A283/B3/D9 below |
| 91 | 6a | Amount of total sundry debtors | N0 | `TotSundryDbtAmt` | not required (used only in the no-books case) |
| 92 | 6b | Amount of total sundry creditors | N0 | `TotSundryCrdAmt` | not required |
| 93 | 6c | Amount of total stock-in-trade | N0 | `TotStkInTradAmt` | not required |
| 94 | 6d | Amount of the cash balance | N0 | `CashBalAmt` | not required |

## The rules the sheet computes

Arithmetic (from `--formulas`; every total on this sheet is a live formula, not a typed cell):
- **L11** `= SUM(J7,J8,J9,J10)` — Total Reserves and Surplus (bv) = RevResr + CapResr + StatResr + OthResr.
- **L12** `= SUM(L5,L11)` — Total proprietor's fund (1c) = PropCap + TotResrNSurp. Matches rules.json **A53**: "Total of Proprietor's fund" should be equal to sum of "Proprietor's Capital" and "Total Reserve and surplus".
- **J19** `= SUM(J17,J18)` — Total Rupee Loans (iiC) = FrmBank + FrmOthrs.
- **L20** `= SUM(J15,J19)` — Total secured loans (aiii) = ForeignCurrLoan + TotRupeeLoan.
- **L24** `= SUM(J22,J23)` — Total unsecured loans (biii).
- **L25** `= SUM(L20,L24)` — Total Loan Funds (2c). Matches **A54**: "Total Loan Funds" should be equal to sum of "Secured Loans" and "Unsecured Loans".
- **L30** `= SUM(PartA_BS_AdvancesFromPerson,PartA_BS_AdvancesFromothers)` — Total Advances (4iii), via named ranges. Matches **A60**: "Total of Advances" should be equal to sum of "From persons specified in section 40A(2)(b)..." and "From others".
- **L31** `= SUM(L12,L25,L26,PartA_BS_AdvancesTotal)` — Sources of funds = TotPropFund + TotLoanFund + DeferredTax + TotalAdvances. Matches **A55**: "Total of sources of funds" should be equal to sum of Proprietor's fund, Loan Funds, Deferred Tax Liability and Advances.
- **J35** `= MAX(0,(sheet2.GrossBlock-sheet2.Depreciation))` — Net Block (1c), a genuine cap: never allowed to go negative even where Depreciation exceeds Gross Block. (`sheet2.` / `sheet3.` are the sheet's own internal named-range prefixes — both resolve to cells on this same "Part A - BS" sheet, not to another visible sheet.)
- **L37** `= SUM(J35,J36)` — Total Fixed Assets (1e) = NetBlock + CapWrkProg.
- **L42** `= SUM(J40,J41)` — Total long-term investments (aiii).
- **L47** `= SUM(J44,J45,J46)` — Total short-term investments (biv).
- **L48** `= SUM(L42,L47)` — Total investments (2c). Matches **A56**: "Total of investments" should be equal to sum of Long term Investments and Short term Investments.
- **L56** `= SUM(J52,J53,J54,J55)` — Total inventories (iE).
- **L61** `= SUM(J59,J60)` — Total cash and bank balances (iiiC).
- **L63** `= SUM(L56,L57,L61,L62)` — Total current assets (av). Matches **A57**: "Total of current assets" should be equal to sum of inventories, sundry debtors, sum of cash and bank balances and other current assets.
- **L68** `= SUM(J65,J66,J67)` — Total loans and advances (biv).
- **L69** `= SUM(L63,L68)` — Total current assets, loans and advances (3c).
- **L76** `= SUM(J72,J73,J74,J75)` — Total current liabilities (iE).
- **L82** `= SUM(J78,J80,J81)` — Total provisions (iiD): only three terms — the hidden Wealth Tax row (J79) is deliberately excluded even though the printed label reads "iiA + iiB + iiC".
- **L83** `= SUM(L76,L82)` — Total current liabilities and provisions (diii).
- **L84** `= (sheet3.TotCurrAssetLoanAdv-sheet3.TotCurrLiabilitiesProvision)` — Net current assets (3e). Matches **A58**: "Total of net current assets" should be equal to difference between "Total of current assets, loans and advances" and "Total current liabilities and provisions". Explicitly allowed to be negative.
- **L88** `= SUM(J85,J86,J87)` — Total Miscellaneous adjustments (4d).
- **L89** `= SUM(L37,L48,L84,L88)` — Total, application of funds. Matches **A59**: "Total of application of funds" should be equal to sum of Total Fixed Assets, Total Investments, Total Current assets, loans and advances and Total Miscellaneous expenditure.

Cross-check between the two grand totals — rules.json **A52**: "In Schedule Part A BS, 'Sources of funds' should match with 'Total application of funds'" (L31 must equal L89). `vba_text.txt` carries the live (AY-2026) validator behind this, a **critical, blocking** message comparing named ranges `sheet2.TotFundSrc` (L31) and `sheet3.TotFundApply` (L89): *"Sources of funds must be equal to Application of Funds in Schedule Balance Sheet"*.

Applicability of the whole sheet / of its two alternative blocks:
- **A51**: "If Assessee is liable for audit u/s 44AB then Part A BS and Part A P&L should be filled."
- **B4**: "If assessee is liable for audit u/s 92E then Part A BS and Part A P&L should be filled."
- **B3**: "Income from 'Profits and Gains from Business or Profession' is greater than Rs. 2.50 lakh then Balance sheet should be filled."
- **D9**: "Taxpayer having income under the head 'Profits and gains of Business or Profession', Balance Sheet and Profit and Loss Account has to be filled as required in explanation (d) under section139(9) read with section 44AA."
- **A283**: "In Schedule BP, If Sum of amount entered in 'S.No 35(i) (Sec 44AD) + S.No 35(ii) (Sec 44ADA) + S.No 35(iii) (Sec 44AE)' is greater than '0' then Balance sheet particulars for either 'Regular books of accounts' or particulars for 'No accounts case' is mandatory" — i.e. rows 4-89 (`FundSrc`/`FundApply`) and rows 90-94 (`NoBooksOfAccBS`) are alternatives, not both compulsory.
- `vba_text.txt` gives the two live user-facing messages that police this pairing, both **warnings** (non-blocking), keyed off `sheet2.TotFundSrc`/`sheet3.TotFundApply` (the regular-books totals) and the `NoAccountsCase` range group:
  - Both blank: *"Warning message: Field no. 5 'Sources of funds(1c + 2c + 3 + 4)' and field no.6 'In a case where regular books of account of business or profession are not maintained -(furnish the following information as on 31st day of March, 2026, in respect of business or profession).' in schedule Balance sheet is equal to zero And 'Income chargeable under the head 'Profits and Gains from Business or Profession' at Sl.No D in Schedule BP is greater than 2.50 Lakh."*
  - Both filled: *"Warning :: You have filled Both Balance Sheet and No Accounts[Case]"* (checked via `CmdValidate_BS_Click` / `ValidateBS_All` → `ValidateFunds_BS` / `ValidateNoAccounts_BS`).

Data-validation numeric bounds (from `--dropdowns`, which for this sheet returns only numeric minimums, no picklists — see "Dropdowns" below):
- Minimum **0** on essentially every entry and sub-total cell (J-column entries and their L-column totals throughout both `FundSrc` and `FundApply`, plus all four `NoBooksOfAccBS` cells L91:L94) — matches the schema's `(minimum 0)` leaves one-for-one.
- Minimum **-99999999999999** (i.e. effectively unrestricted negative) on: `PropCap` (L5), `TotPropFund` (L12), `TotFundSrc` (L31, cell named L89 in the export but see note*), `BankBal` (J60), `TotCashOrBankBal` (L61), `TotCurrAsset` (L63), `TotCurrAssetLoanAdv` (L69), `NetCurrAsset` (L84) and `TotFundApply` (L89) — matches every schema leaf that carries no `minimum` annotation.

*(The raw validation dump groups cells `L5 L89` together under one minimum entry and `L12 J60 L69 L61 L63 L84` under another; both groups carry the same −99999999999999 floor, i.e. every total/entry that the schema leaves unbounded on the low side.)*

## Dropdowns

`python3 tools/dump.py --form ITR-3 --dropdowns "Part A - BS"` returns **4 data-validation groups, and none of them is a picklist** — every `values` field is `null`, i.e. this sheet has no Yes/No or "(Select)" dropdown anywhere; its only data validation is a numeric floor on specific cells (the group members and bounds are listed above, under "The rules the sheet computes → Data-validation numeric bounds"). In full, the four raw groups are:
1. cells `L5 L89`, minimum `-99999999999999`.
2. cells `L91:L94 J22:J23 L20 J17:J19 J15 L11 J7:J10 L67:L68 J65:J67 J59 L56:L57 J52:J55 L47:L48 J44:J46 L42 J40:J41 L37 J33:J36 L62 L76 J74:J75 L82:L83 J78:J81 L88 J85:J87 L24:L26 L28:L31`, minimum `0`.
3. cells `L12 J60 L69 L61 L63 L84`, minimum `-99999999999999`.
4. cells `J72:J73`, minimum `0`.

## What repeats and what is one figure

Nothing repeats. `--leaves PARTA_BS` returns 70 leaves and not one of them carries a `[]` — `FundSrc`, `FundApply` and `NoBooksOfAccBS` are all plain nested objects, so every figure on this sheet (from `PropCap` down to `CashBalAmt`) is entered once, for the year, as a single scalar. There is no add-row grid anywhere on Part A - BS.

## Mandatory

Schema-level `required` on block `PARTA_BS` itself is exactly `["FundSrc", "FundApply"]` — `NoBooksOfAccBS` as a whole is optional (filled only in the no-account case; see rule A283 above). Within `FundSrc`/`FundApply`, `--leaves PARTA_BS` marks 64 of the 70 leaves individually required (`*`):

`PropCap`, `RevResr`, `CapResr`, `StatResr`, `OthResr`, `TotResrNSurp`, `TotPropFund`, `ForeignCurrLoan`, `FrmBank` (both occurrences), `FrmOthrs` (both occurrences), `TotRupeeLoan`, `TotSecrLoan`, `TotUnSecrLoan`, `TotLoanFund`, `DeferredTax`, `TotalAdvances`, `TotFundSrc`, `GrossBlock`, `Depreciation`, `NetBlock`, `CapWrkProg`, `TotFixedAsset`, `GovtOthSecQuoted`, `GovOthSecUnQoted`, `TotLongTermInv`, `EquityShares`, `PreferShares`, `Debenture`, `TotTradeInv`, `TotInvestments`, `StoresConsumables`, `RawMatl`, `StkInProcess`, `FinOrTradGood`, `TotInventries`, `SndryDebtors`, `CashinHand`, `BankBal`, `TotCashOrBankBal`, `OthCurrAsset`, `TotCurrAsset`, `AdvRecoverable`, `Deposits`, `BalWithRevAuth`, `TotLoanAdv`, `TotCurrAssetLoanAdv`, `SundryCred`, `LiabForLeasedAsset`, `AccrIntonLeasedAsset`, `AccrIntNotDue`, `TotCurrLiabilities`, `ITProvision`, `ELSuperAnnGratProvision`, `OthProvision`, `TotProvisions`, `TotCurrLiabilitiesProvision`, `NetCurrAsset`, `MiscExpndr`, `DefTaxAsset`, `AccumaltedLosses`, `TotMiscAdjust`, `TotFundApply`.

The 6 leaves **not** individually required: `FromPrsn` and `FromOthers` (row 28-29, the two components of Advances — even though their own total `TotalAdvances` is required), and all four `NoBooksOfAccBS` leaves `TotSundryDbtAmt`, `TotSundryCrdAmt`, `TotStkInTradAmt`, `CashBalAmt` (rows 91-94, applicable only in the no-account case).

## Hidden rows — not built

- **Row 79** — `[G79] B | [H79] Provision for Wealth Tax | [I79] iiB`. Not built. Wealth-tax was abolished (the Wealth-tax Act ceased from AY 2016-17); the utility keeps the row physically on the sheet but hidden. The current `PARTA_BS` schema's `Provisions` object carries no `WTProvision` leaf at all — only `ITProvision`, `ELSuperAnnGratProvision`, `OthProvision`, `TotProvisions` — and the sheet's own total-provisions formula **L82** `= SUM(J78,J80,J81)` deliberately skips J79, even though the printed label on row 82 reads "Total (iiA + iiB + iiC)". `vba_text.txt` shows the export code still resolves a legacy named range `sheet2.WTProvision` (defaulted to 0 when blank) into an `<ITRForm:WTProvision>` XML tag, but that tag sits outside the current JSON schema and outside this build.

## What this means for the build

- Every field here is a fixed, non-repeating rupee cell — no add-row grid, no array to render (see "What repeats").
- Treat every "Total" leaf as computed, not typed: wire each one to the formula cited in "The rules the sheet computes" (cell for cell), the way the utility's own J/L columns already do.
- Clamp only `NetBlock` (row 35) at zero via `MAX(0, GrossBlock − Depreciation)`. Do **not** clamp the leaves the schema leaves unbounded on the low side — `PropCap`, `TotPropFund`, `TotFundSrc`, `BankBal`, `TotCashOrBankBal`, `TotCurrAsset`, `TotCurrAssetLoanAdv`, `NetCurrAsset`, `TotFundApply` — all of them can legitimately go negative (a capital deficit, an overdraft, or a net current liability).
- Before submit, cross-check `TotFundSrc` (row 31) == `TotFundApply` (row 89) and block on mismatch — the utility's own check (rule A52) is `vbCritical`, not a soft warning.
- `FrmBank`/`FrmOthrs` exist twice in the schema (once under `SecrLoan.RupeeLoan` for rows 17-18, once directly under `UnsecrLoan` for rows 22-23) — keep the two paths distinct; they are not the same field even though the leaf name repeats.
- Let the regular-books block (`FundSrc`/`FundApply`, rows 4-89) and the no-account-case block (`NoBooksOfAccBS`, rows 90-94) coexist rather than forcing mutual exclusivity: the utility itself allows both to be filled together and only warns — once if both are zero while Schedule BP income exceeds Rs 2.50 lakh (quoted above), and separately if both are non-zero at once ("You have filled Both Balance Sheet and No Accounts…"). Reproduce both as non-blocking warnings, gated by rules A283/B3/D9/A51/B4 for when each block actually applies.
- Do not add an input for row 79 (Provision for Wealth Tax) — it is hidden, has no schema leaf, and is already excluded from the `TotProvisions` (L82) sum.
- The `sheet2.`/`sheet3.`/`PartA_BS_Advances…` prefixes seen in the formulas are this sheet's own internal named-range naming, not references to another visible sheet — no cross-sheet plumbing is needed to compute anything on Part A - BS itself.
