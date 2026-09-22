# ITR-5 leaf-coverage check — AREA = accounts

Blocks audited: `PARTA_BS` (all balance-sheet variants), `PARTA_PL`, `ManufacturingAccount`,
`TradingAccount`, `PARTA_OI`, `PARTA_QD`, `PARTA_OL`.

Schema: `sources/ITR-5/ITR-5_2026_Main_V1_1_schema.json` (leaves enumerated by walking
`properties` / `items` with `$ref` + `allOf` resolved; a leaf = a property with no nested
`properties`/`items`). Software: `forms/ITR-5/Yukti_ITR5.html`, built from
`forms/ITR-5/src/70_sec_bs.js`, `70_sec_pl.js`, `70_sec_oi.js`. The shipped HTML was verified
to contain the `secBs()` / `secPl()` / `secOi()` bodies byte-for-byte, so the src evidence below
is evidence about the shipped form.

## Verdict

**463 leaves. 370 INPUT, 93 COMPUTED, 0 NA, 0 ORPHAN.** Every schema leaf in these blocks has a
home. There are no required-leaf orphans and no optional-leaf orphans.

Two things the CEO still needs to act on are reported at the bottom: `PARTA_OL` does not exist in
the ITR-5 schema at all (§5), and two export paths can drop *row-required* leaves out of otherwise
valid grid rows (§6). Neither is an ORPHAN under the brief's definition — the fields are on screen —
but §6 will produce schema-invalid JSON in ordinary use.

## 1 · Counts per bucket

| bucket | count |
| --- | --- |
| INPUT | 370 |
| COMPUTED | 93 |
| NA | 0 |
| ORPHAN | 0 |
| **total** | **463** |

Per block:

| block | leaves | INPUT | COMPUTED | NA | ORPHAN | required¹ |
| --- | --- | --- | --- | --- | --- | --- |
| `PARTA_BS` | 98 | 69 | 29 | 0 | 0 | 94 |
| `ManufacturingAccount` | 21 | 15 | 6 | 0 | 0 | 6 |
| `TradingAccount` | 45 | 35 | 10 | 0 | 0 | 9 |
| `PARTA_PL` | 171 | 135 | 36 | 0 | 0 | 137 |
| `PARTA_OI` | 103 | 91 | 12 | 0 | 0 | 87 |
| `PARTA_QD` | 25 | 25 | 0 | 0 | 0 | 21 |
| `PARTA_OL` | — | — | — | — | — | block not in the ITR-5 schema (§5) |

¹ required column legend, used throughout:

- **YES** — required from the ITR-5 root: the block is in `ITR5.required` and every ancestor is in
  its parent's `required[]`. These must be present in every filed return. All 207 such leaves
  (94 in `PARTA_BS`, 113 in `PARTA_PL`) are carried by `SKEL` in `forms/ITR-5/src/10_state.js`,
  verified leaf-by-leaf: `requiredMissingFromSKEL = 0` for both blocks.
- **block-REQ** — required within its own optional block, i.e. mandatory once that block is emitted.
- **row-REQ** — listed in the array item's `required[]`, i.e. mandatory once that row is emitted.
- **no** — optional.

## 2 · How each bucket was proved

- **INPUT** — a screen widget writes the state path. `inp(p)` and `sel(p)` emit
  `data-p="<p>"` (`Yukti_ITR5.html:17387` and `:17392`); `grid(key,cols,…)` emits
  `data-p="<key>.<i>.<colKey>"` per row (`:17399`). Section helpers: `ri()`/`rsel()` prefix the
  section root (`bs.` / `pl.` / `oi.`), so a `ri(label,"X")` in `70_sec_bs.js` is
  `data-p="bs.X"`. Helper-generated rows were expanded, not guessed: the `trip()` helper
  (`70_sec_pl.js:418`) and the seven `OI_*.forEach(…=>ri(…))` loops (`70_sec_oi.js:198-241`).
- **COMPUTED** — the engine writes the leaf. Every green `rc()` cell in these three sections was
  matched against a real writer: `St()` in `engBs` / `engPl` / `engOi`, or the grid `t:"calc"`
  column. **0 of the 93 computed cells lack an in-file writer** — there is no "green cell that
  nothing ever fills" anywhere in these blocks.
- **Export reachability** — checked separately from data entry, because a field on screen that the
  export never writes is still an orphan in practice:
  - `expBs` (`70_sec_bs.js:390`) deep-copies `S.bs.FundSrc`/`FundApply` over `j.PARTA_BS`
    (seeded from `SKEL`), plus `NoBooksOfAccBS` when it carries data.
  - `expPl` (`70_sec_pl.js:599`) merges `S.pl.mfg`/`trd`/`pl` over `PL_MFG_REQ` / `PL_TRD_REQ` /
    `SKEL.PARTA_PL`. `PL_MFG_REQ` and `PL_TRD_REQ` were diffed against the schema's
    locally-required leaves: **exact match** for ManufacturingAccount (6/6) and a superset for
    TradingAccount (5 required + 2 harmless sub-object totals).
  - `expOi` (`70_sec_oi.js:330`) is explicit `put()` calls, so it was enumerated and diffed against
    the schema: **103 PARTA_OI leaves, 103 covered, 0 missing.**

## 3.1 · PARTA_BS — Balance Sheet (all variants: FundSrc / FundApply / NoBooksOfAccBS)

State root `S.bs`; section file `forms/ITR-5/src/70_sec_bs.js`.

| leaf | schema path | required? | bucket | evidence |
| --- | --- | --- | --- | --- |
| `PartnerOrMemberCap` | `PARTA_BS/FundSrc/PartnerOrMemberFund/PartnerOrMemberCap` | **YES** | INPUT | data-p="bs.FundSrc.PartnerOrMemberFund.PartnerOrMemberCap" |
| `RevResr` | `PARTA_BS/FundSrc/PartnerOrMemberFund/ResrNSurp/RevResr` | **YES** | INPUT | data-p="bs.FundSrc.PartnerOrMemberFund.ResrNSurp.RevResr" |
| `CapResr` | `PARTA_BS/FundSrc/PartnerOrMemberFund/ResrNSurp/CapResr` | **YES** | INPUT | data-p="bs.FundSrc.PartnerOrMemberFund.ResrNSurp.CapResr" |
| `StatResr` | `PARTA_BS/FundSrc/PartnerOrMemberFund/ResrNSurp/StatResr` | **YES** | INPUT | data-p="bs.FundSrc.PartnerOrMemberFund.ResrNSurp.StatResr" |
| `OthResr` | `PARTA_BS/FundSrc/PartnerOrMemberFund/ResrNSurp/OthResr` | **YES** | INPUT | data-p="bs.FundSrc.PartnerOrMemberFund.ResrNSurp.OthResr" |
| `CreditBalOfPLAccount` | `PARTA_BS/FundSrc/PartnerOrMemberFund/ResrNSurp/CreditBalOfPLAccount` | **YES** | INPUT | data-p="bs.FundSrc.PartnerOrMemberFund.ResrNSurp.CreditBalOfPLAccount" |
| `TotResrNSurp` | `PARTA_BS/FundSrc/PartnerOrMemberFund/ResrNSurp/TotResrNSurp` | **YES** | COMPUTED | engine St("FundSrc.PartnerOrMemberFund.ResrNSurp.TotResrNSurp") / rc() green cell |
| `TotPartnerOrMemberFund` | `PARTA_BS/FundSrc/PartnerOrMemberFund/TotPartnerOrMemberFund` | **YES** | COMPUTED | engine St("FundSrc.PartnerOrMemberFund.TotPartnerOrMemberFund") / rc() green cell |
| `ForeignCurrLoan` | `PARTA_BS/FundSrc/LoanFunds/SecrLoan/ForeignCurrLoan` | **YES** | INPUT | data-p="bs.FundSrc.LoanFunds.SecrLoan.ForeignCurrLoan" |
| `FrmBank` | `PARTA_BS/FundSrc/LoanFunds/SecrLoan/RupeeLoan/FrmBank` | **YES** | INPUT | data-p="bs.FundSrc.LoanFunds.SecrLoan.RupeeLoan.FrmBank" |
| `FrmOthrs` | `PARTA_BS/FundSrc/LoanFunds/SecrLoan/RupeeLoan/FrmOthrs` | **YES** | INPUT | data-p="bs.FundSrc.LoanFunds.SecrLoan.RupeeLoan.FrmOthrs" |
| `TotRupeeLoan` | `PARTA_BS/FundSrc/LoanFunds/SecrLoan/RupeeLoan/TotRupeeLoan` | **YES** | COMPUTED | engine St("FundSrc.LoanFunds.SecrLoan.RupeeLoan.TotRupeeLoan") / rc() green cell |
| `TotSecrLoan` | `PARTA_BS/FundSrc/LoanFunds/SecrLoan/TotSecrLoan` | **YES** | COMPUTED | engine St("FundSrc.LoanFunds.SecrLoan.TotSecrLoan") / rc() green cell |
| `ForeignCurrencyLoans` | `PARTA_BS/FundSrc/LoanFunds/UnsecrLoan/ForeignCurrencyLoans` | **YES** | INPUT | data-p="bs.FundSrc.LoanFunds.UnsecrLoan.ForeignCurrencyLoans" |
| `FrmBank` | `PARTA_BS/FundSrc/LoanFunds/UnsecrLoan/RupeeLoan/FrmBank` | **YES** | INPUT | data-p="bs.FundSrc.LoanFunds.UnsecrLoan.RupeeLoan.FrmBank" |
| `FrmPersonSpcfdUs40A2b` | `PARTA_BS/FundSrc/LoanFunds/UnsecrLoan/RupeeLoan/FrmPersonSpcfdUs40A2b` | **YES** | INPUT | data-p="bs.FundSrc.LoanFunds.UnsecrLoan.RupeeLoan.FrmPersonSpcfdUs40A2b" |
| `FrmOthrs` | `PARTA_BS/FundSrc/LoanFunds/UnsecrLoan/RupeeLoan/FrmOthrs` | **YES** | INPUT | data-p="bs.FundSrc.LoanFunds.UnsecrLoan.RupeeLoan.FrmOthrs" |
| `TotRupeeLoan` | `PARTA_BS/FundSrc/LoanFunds/UnsecrLoan/RupeeLoan/TotRupeeLoan` | **YES** | COMPUTED | engine St("FundSrc.LoanFunds.UnsecrLoan.RupeeLoan.TotRupeeLoan") / rc() green cell |
| `TotUnSecrLoan` | `PARTA_BS/FundSrc/LoanFunds/UnsecrLoan/TotUnSecrLoan` | **YES** | COMPUTED | engine St("FundSrc.LoanFunds.UnsecrLoan.TotUnSecrLoan") / rc() green cell |
| `TotLoanFund` | `PARTA_BS/FundSrc/LoanFunds/TotLoanFund` | **YES** | COMPUTED | engine St("FundSrc.LoanFunds.TotLoanFund") / rc() green cell |
| `DeferredTax` | `PARTA_BS/FundSrc/DeferredTax` | **YES** | INPUT | data-p="bs.FundSrc.DeferredTax" |
| `FrmPersonSpcfdUs40A2b` | `PARTA_BS/FundSrc/Advances/FrmPersonSpcfdUs40A2b` | **YES** | INPUT | data-p="bs.FundSrc.Advances.FrmPersonSpcfdUs40A2b" |
| `FrmOthers` | `PARTA_BS/FundSrc/Advances/FrmOthers` | **YES** | INPUT | data-p="bs.FundSrc.Advances.FrmOthers" |
| `TotalAdvances` | `PARTA_BS/FundSrc/Advances/TotalAdvances` | **YES** | COMPUTED | engine St("FundSrc.Advances.TotalAdvances") / rc() green cell |
| `TotFundSrc` | `PARTA_BS/FundSrc/TotFundSrc` | **YES** | COMPUTED | engine St("FundSrc.TotFundSrc") / rc() green cell |
| `GrossBlock` | `PARTA_BS/FundApply/FixedAsset/GrossBlock` | **YES** | INPUT | data-p="bs.FundApply.FixedAsset.GrossBlock" |
| `Depreciation` | `PARTA_BS/FundApply/FixedAsset/Depreciation` | **YES** | INPUT | data-p="bs.FundApply.FixedAsset.Depreciation" |
| `NetBlock` | `PARTA_BS/FundApply/FixedAsset/NetBlock` | **YES** | COMPUTED | engine St("FundApply.FixedAsset.NetBlock") / rc() green cell |
| `CapWrkProg` | `PARTA_BS/FundApply/FixedAsset/CapWrkProg` | **YES** | INPUT | data-p="bs.FundApply.FixedAsset.CapWrkProg" |
| `TotFixedAsset` | `PARTA_BS/FundApply/FixedAsset/TotFixedAsset` | **YES** | COMPUTED | engine St("FundApply.FixedAsset.TotFixedAsset") / rc() green cell |
| `InvInProperty` | `PARTA_BS/FundApply/Investments/LongTermInv/InvInProperty` | **YES** | INPUT | data-p="bs.FundApply.Investments.LongTermInv.InvInProperty" |
| `ListedEquities` | `PARTA_BS/FundApply/Investments/LongTermInv/EquityInstruments/ListedEquities` | **YES** | INPUT | data-p="bs.FundApply.Investments.LongTermInv.EquityInstruments.ListedEquities" |
| `UnListedEquities` | `PARTA_BS/FundApply/Investments/LongTermInv/EquityInstruments/UnListedEquities` | **YES** | INPUT | data-p="bs.FundApply.Investments.LongTermInv.EquityInstruments.UnListedEquities" |
| `Total` | `PARTA_BS/FundApply/Investments/LongTermInv/EquityInstruments/Total` | **YES** | COMPUTED | engine St("FundApply.Investments.LongTermInv.EquityInstruments.Total") / rc() green cell |
| `PreferenceShares` | `PARTA_BS/FundApply/Investments/LongTermInv/PreferenceShares` | **YES** | INPUT | data-p="bs.FundApply.Investments.LongTermInv.PreferenceShares" |
| `GovtOrTrustSecurities` | `PARTA_BS/FundApply/Investments/LongTermInv/GovtOrTrustSecurities` | **YES** | INPUT | data-p="bs.FundApply.Investments.LongTermInv.GovtOrTrustSecurities" |
| `DebenturesOrBonds` | `PARTA_BS/FundApply/Investments/LongTermInv/DebenturesOrBonds` | **YES** | INPUT | data-p="bs.FundApply.Investments.LongTermInv.DebenturesOrBonds" |
| `MutualFunds` | `PARTA_BS/FundApply/Investments/LongTermInv/MutualFunds` | **YES** | INPUT | data-p="bs.FundApply.Investments.LongTermInv.MutualFunds" |
| `Others` | `PARTA_BS/FundApply/Investments/LongTermInv/Others` | **YES** | INPUT | data-p="bs.FundApply.Investments.LongTermInv.Others" |
| `TotLongTermInv` | `PARTA_BS/FundApply/Investments/LongTermInv/TotLongTermInv` | **YES** | COMPUTED | engine St("FundApply.Investments.LongTermInv.TotLongTermInv") / rc() green cell |
| `ListedEquities` | `PARTA_BS/FundApply/Investments/ShortTermInv/EquityInstruments/ListedEquities` | **YES** | INPUT | data-p="bs.FundApply.Investments.ShortTermInv.EquityInstruments.ListedEquities" |
| `UnListedEquities` | `PARTA_BS/FundApply/Investments/ShortTermInv/EquityInstruments/UnListedEquities` | **YES** | INPUT | data-p="bs.FundApply.Investments.ShortTermInv.EquityInstruments.UnListedEquities" |
| `Total` | `PARTA_BS/FundApply/Investments/ShortTermInv/EquityInstruments/Total` | **YES** | COMPUTED | engine St("FundApply.Investments.ShortTermInv.EquityInstruments.Total") / rc() green cell |
| `PreferenceShares` | `PARTA_BS/FundApply/Investments/ShortTermInv/PreferenceShares` | **YES** | INPUT | data-p="bs.FundApply.Investments.ShortTermInv.PreferenceShares" |
| `GovtOrTrustSecurities` | `PARTA_BS/FundApply/Investments/ShortTermInv/GovtOrTrustSecurities` | **YES** | INPUT | data-p="bs.FundApply.Investments.ShortTermInv.GovtOrTrustSecurities" |
| `DebenturesOrBonds` | `PARTA_BS/FundApply/Investments/ShortTermInv/DebenturesOrBonds` | **YES** | INPUT | data-p="bs.FundApply.Investments.ShortTermInv.DebenturesOrBonds" |
| `MutualFunds` | `PARTA_BS/FundApply/Investments/ShortTermInv/MutualFunds` | **YES** | INPUT | data-p="bs.FundApply.Investments.ShortTermInv.MutualFunds" |
| `Others` | `PARTA_BS/FundApply/Investments/ShortTermInv/Others` | **YES** | INPUT | data-p="bs.FundApply.Investments.ShortTermInv.Others" |
| `TotShortTermInv` | `PARTA_BS/FundApply/Investments/ShortTermInv/TotShortTermInv` | **YES** | COMPUTED | engine St("FundApply.Investments.ShortTermInv.TotShortTermInv") / rc() green cell |
| `TotInvestments` | `PARTA_BS/FundApply/Investments/TotInvestments` | **YES** | COMPUTED | engine St("FundApply.Investments.TotInvestments") / rc() green cell |
| `RawMatl` | `PARTA_BS/FundApply/CurrAssetLoanAdv/CurrAsset/Inventories/RawMatl` | **YES** | INPUT | data-p="bs.FundApply.CurrAssetLoanAdv.CurrAsset.Inventories.RawMatl" |
| `WorkInProgress` | `PARTA_BS/FundApply/CurrAssetLoanAdv/CurrAsset/Inventories/WorkInProgress` | **YES** | INPUT | data-p="bs.FundApply.CurrAssetLoanAdv.CurrAsset.Inventories.WorkInProgress" |
| `FinOrTradGood` | `PARTA_BS/FundApply/CurrAssetLoanAdv/CurrAsset/Inventories/FinOrTradGood` | **YES** | INPUT | data-p="bs.FundApply.CurrAssetLoanAdv.CurrAsset.Inventories.FinOrTradGood" |
| `StkInTrade` | `PARTA_BS/FundApply/CurrAssetLoanAdv/CurrAsset/Inventories/StkInTrade` | **YES** | INPUT | data-p="bs.FundApply.CurrAssetLoanAdv.CurrAsset.Inventories.StkInTrade" |
| `StoresConsumables` | `PARTA_BS/FundApply/CurrAssetLoanAdv/CurrAsset/Inventories/StoresConsumables` | **YES** | INPUT | data-p="bs.FundApply.CurrAssetLoanAdv.CurrAsset.Inventories.StoresConsumables" |
| `LooseTools` | `PARTA_BS/FundApply/CurrAssetLoanAdv/CurrAsset/Inventories/LooseTools` | **YES** | INPUT | data-p="bs.FundApply.CurrAssetLoanAdv.CurrAsset.Inventories.LooseTools" |
| `Others` | `PARTA_BS/FundApply/CurrAssetLoanAdv/CurrAsset/Inventories/Others` | **YES** | INPUT | data-p="bs.FundApply.CurrAssetLoanAdv.CurrAsset.Inventories.Others" |
| `TotInventries` | `PARTA_BS/FundApply/CurrAssetLoanAdv/CurrAsset/Inventories/TotInventries` | **YES** | COMPUTED | engine St("FundApply.CurrAssetLoanAdv.CurrAsset.Inventories.TotInventries") / rc() green cell |
| `OutstandindMorethanOneYr` | `PARTA_BS/FundApply/CurrAssetLoanAdv/CurrAsset/SundryDebtorDtls/OutstandindMorethanOneYr` | **YES** | INPUT | data-p="bs.FundApply.CurrAssetLoanAdv.CurrAsset.SundryDebtorDtls.OutstandindMorethanOneYr" |
| `Others` | `PARTA_BS/FundApply/CurrAssetLoanAdv/CurrAsset/SundryDebtorDtls/Others` | **YES** | INPUT | data-p="bs.FundApply.CurrAssetLoanAdv.CurrAsset.SundryDebtorDtls.Others" |
| `TotalSundryDebtors` | `PARTA_BS/FundApply/CurrAssetLoanAdv/CurrAsset/SundryDebtorDtls/TotalSundryDebtors` | **YES** | COMPUTED | engine St("FundApply.CurrAssetLoanAdv.CurrAsset.SundryDebtorDtls.TotalSundryDebtors") / rc() green cell |
| `BankBal` | `PARTA_BS/FundApply/CurrAssetLoanAdv/CurrAsset/CashOrBankBal/BankBal` | **YES** | INPUT | data-p="bs.FundApply.CurrAssetLoanAdv.CurrAsset.CashOrBankBal.BankBal" |
| `CashinHand` | `PARTA_BS/FundApply/CurrAssetLoanAdv/CurrAsset/CashOrBankBal/CashinHand` | **YES** | INPUT | data-p="bs.FundApply.CurrAssetLoanAdv.CurrAsset.CashOrBankBal.CashinHand" |
| `Others` | `PARTA_BS/FundApply/CurrAssetLoanAdv/CurrAsset/CashOrBankBal/Others` | **YES** | INPUT | data-p="bs.FundApply.CurrAssetLoanAdv.CurrAsset.CashOrBankBal.Others" |
| `TotCashOrBankBal` | `PARTA_BS/FundApply/CurrAssetLoanAdv/CurrAsset/CashOrBankBal/TotCashOrBankBal` | **YES** | COMPUTED | engine St("FundApply.CurrAssetLoanAdv.CurrAsset.CashOrBankBal.TotCashOrBankBal") / rc() green cell |
| `OthCurrAsset` | `PARTA_BS/FundApply/CurrAssetLoanAdv/CurrAsset/OthCurrAsset` | **YES** | INPUT | data-p="bs.FundApply.CurrAssetLoanAdv.CurrAsset.OthCurrAsset" |
| `TotCurrAsset` | `PARTA_BS/FundApply/CurrAssetLoanAdv/CurrAsset/TotCurrAsset` | **YES** | COMPUTED | engine St("FundApply.CurrAssetLoanAdv.CurrAsset.TotCurrAsset") / rc() green cell |
| `AdvRecoverable` | `PARTA_BS/FundApply/CurrAssetLoanAdv/LoanAdv/AdvRecoverable` | **YES** | INPUT | data-p="bs.FundApply.CurrAssetLoanAdv.LoanAdv.AdvRecoverable" |
| `Deposits` | `PARTA_BS/FundApply/CurrAssetLoanAdv/LoanAdv/Deposits` | **YES** | INPUT | data-p="bs.FundApply.CurrAssetLoanAdv.LoanAdv.Deposits" |
| `BalWithRevAuth` | `PARTA_BS/FundApply/CurrAssetLoanAdv/LoanAdv/BalWithRevAuth` | **YES** | INPUT | data-p="bs.FundApply.CurrAssetLoanAdv.LoanAdv.BalWithRevAuth" |
| `TotLoanAdv` | `PARTA_BS/FundApply/CurrAssetLoanAdv/LoanAdv/TotLoanAdv` | **YES** | COMPUTED | engine St("FundApply.CurrAssetLoanAdv.LoanAdv.TotLoanAdv") / rc() green cell |
| `PurposeOFBusOrProf` | `PARTA_BS/FundApply/CurrAssetLoanAdv/LoanAdv/LoanAdvIncluded/PurposeOFBusOrProf` | **YES** | INPUT | data-p="bs.FundApply.CurrAssetLoanAdv.LoanAdv.LoanAdvIncluded.PurposeOFBusOrProf" |
| `NotForPurposeOFBusOrProf` | `PARTA_BS/FundApply/CurrAssetLoanAdv/LoanAdv/LoanAdvIncluded/NotForPurposeOFBusOrProf` | **YES** | INPUT | data-p="bs.FundApply.CurrAssetLoanAdv.LoanAdv.LoanAdvIncluded.NotForPurposeOFBusOrProf" |
| `TotCurrAssetLoanAdv` | `PARTA_BS/FundApply/CurrAssetLoanAdv/TotCurrAssetLoanAdv` | **YES** | COMPUTED | engine St("FundApply.CurrAssetLoanAdv.TotCurrAssetLoanAdv") / rc() green cell |
| `OutstandindMorethanOneYr` | `PARTA_BS/FundApply/CurrAssetLoanAdv/CurrLiabilitiesProv/CurrLiabilities/SundryCreditorDtls/OutstandindMorethanOneYr` | **YES** | INPUT | data-p="bs.FundApply.CurrAssetLoanAdv.CurrLiabilitiesProv.CurrLiabilities.SundryCreditorDtls.OutstandindMorethanOneYr" |
| `Others` | `PARTA_BS/FundApply/CurrAssetLoanAdv/CurrLiabilitiesProv/CurrLiabilities/SundryCreditorDtls/Others` | **YES** | INPUT | data-p="bs.FundApply.CurrAssetLoanAdv.CurrLiabilitiesProv.CurrLiabilities.SundryCreditorDtls.Others" |
| `TotalSundryCreditors` | `PARTA_BS/FundApply/CurrAssetLoanAdv/CurrLiabilitiesProv/CurrLiabilities/SundryCreditorDtls/TotalSundryCreditors` | **YES** | COMPUTED | engine St("FundApply.CurrAssetLoanAdv.CurrLiabilitiesProv.CurrLiabilities.SundryCreditorDtls.TotalSundryCreditors") / rc() green cell |
| `LiabForLeasedAsset` | `PARTA_BS/FundApply/CurrAssetLoanAdv/CurrLiabilitiesProv/CurrLiabilities/LiabForLeasedAsset` | **YES** | INPUT | data-p="bs.FundApply.CurrAssetLoanAdv.CurrLiabilitiesProv.CurrLiabilities.LiabForLeasedAsset" |
| `AccrIntonLeasedAsset` | `PARTA_BS/FundApply/CurrAssetLoanAdv/CurrLiabilitiesProv/CurrLiabilities/AccrIntonLeasedAsset` | **YES** | INPUT | data-p="bs.FundApply.CurrAssetLoanAdv.CurrLiabilitiesProv.CurrLiabilities.AccrIntonLeasedAsset" |
| `AccrIntNotDue` | `PARTA_BS/FundApply/CurrAssetLoanAdv/CurrLiabilitiesProv/CurrLiabilities/AccrIntNotDue` | **YES** | INPUT | data-p="bs.FundApply.CurrAssetLoanAdv.CurrLiabilitiesProv.CurrLiabilities.AccrIntNotDue" |
| `IncRecvdInAdv` | `PARTA_BS/FundApply/CurrAssetLoanAdv/CurrLiabilitiesProv/CurrLiabilities/IncRecvdInAdv` | **YES** | INPUT | data-p="bs.FundApply.CurrAssetLoanAdv.CurrLiabilitiesProv.CurrLiabilities.IncRecvdInAdv" |
| `OtherPayables` | `PARTA_BS/FundApply/CurrAssetLoanAdv/CurrLiabilitiesProv/CurrLiabilities/OtherPayables` | **YES** | INPUT | data-p="bs.FundApply.CurrAssetLoanAdv.CurrLiabilitiesProv.CurrLiabilities.OtherPayables" |
| `TotCurrLiabilities` | `PARTA_BS/FundApply/CurrAssetLoanAdv/CurrLiabilitiesProv/CurrLiabilities/TotCurrLiabilities` | **YES** | COMPUTED | engine St("FundApply.CurrAssetLoanAdv.CurrLiabilitiesProv.CurrLiabilities.TotCurrLiabilities") / rc() green cell |
| `ITProvision` | `PARTA_BS/FundApply/CurrAssetLoanAdv/CurrLiabilitiesProv/Provisions/ITProvision` | **YES** | INPUT | data-p="bs.FundApply.CurrAssetLoanAdv.CurrLiabilitiesProv.Provisions.ITProvision" |
| `ELSuperAnnGratProvision` | `PARTA_BS/FundApply/CurrAssetLoanAdv/CurrLiabilitiesProv/Provisions/ELSuperAnnGratProvision` | **YES** | INPUT | data-p="bs.FundApply.CurrAssetLoanAdv.CurrLiabilitiesProv.Provisions.ELSuperAnnGratProvision" |
| `OthProvision` | `PARTA_BS/FundApply/CurrAssetLoanAdv/CurrLiabilitiesProv/Provisions/OthProvision` | **YES** | INPUT | data-p="bs.FundApply.CurrAssetLoanAdv.CurrLiabilitiesProv.Provisions.OthProvision" |
| `TotProvisions` | `PARTA_BS/FundApply/CurrAssetLoanAdv/CurrLiabilitiesProv/Provisions/TotProvisions` | **YES** | COMPUTED | engine St("FundApply.CurrAssetLoanAdv.CurrLiabilitiesProv.Provisions.TotProvisions") / rc() green cell |
| `TotCurrLiabilitiesProvision` | `PARTA_BS/FundApply/CurrAssetLoanAdv/CurrLiabilitiesProv/TotCurrLiabilitiesProvision` | **YES** | COMPUTED | engine St("FundApply.CurrAssetLoanAdv.CurrLiabilitiesProv.TotCurrLiabilitiesProvision") / rc() green cell |
| `NetCurrAsset` | `PARTA_BS/FundApply/CurrAssetLoanAdv/NetCurrAsset` | **YES** | COMPUTED | engine St("FundApply.CurrAssetLoanAdv.NetCurrAsset") / rc() green cell |
| `MiscExpndr` | `PARTA_BS/FundApply/MiscAdjust/MiscExpndr` | **YES** | INPUT | data-p="bs.FundApply.MiscAdjust.MiscExpndr" |
| `DefTaxAsset` | `PARTA_BS/FundApply/MiscAdjust/DefTaxAsset` | **YES** | INPUT | data-p="bs.FundApply.MiscAdjust.DefTaxAsset" |
| `AccumultedLosses` | `PARTA_BS/FundApply/MiscAdjust/AccumultedLosses` | **YES** | INPUT | data-p="bs.FundApply.MiscAdjust.AccumultedLosses" |
| `TotMiscAdjust` | `PARTA_BS/FundApply/MiscAdjust/TotMiscAdjust` | **YES** | COMPUTED | engine St("FundApply.MiscAdjust.TotMiscAdjust") / rc() green cell |
| `TotFundApply` | `PARTA_BS/FundApply/TotFundApply` | **YES** | COMPUTED | engine St("FundApply.TotFundApply") / rc() green cell |
| `TotSundryDbtAmt` | `PARTA_BS/NoBooksOfAccBS/TotSundryDbtAmt` | no | INPUT | data-p="bs.NoBooksOfAccBS.TotSundryDbtAmt" |
| `TotSundryCrdAmt` | `PARTA_BS/NoBooksOfAccBS/TotSundryCrdAmt` | no | INPUT | data-p="bs.NoBooksOfAccBS.TotSundryCrdAmt" |
| `TotStkInTradAmt` | `PARTA_BS/NoBooksOfAccBS/TotStkInTradAmt` | no | INPUT | data-p="bs.NoBooksOfAccBS.TotStkInTradAmt" |
| `CashBalAmt` | `PARTA_BS/NoBooksOfAccBS/CashBalAmt` | no | INPUT | data-p="bs.NoBooksOfAccBS.CashBalAmt" |

## 3.2 · ManufacturingAccount

State root `S.pl`; section file `forms/ITR-5/src/70_sec_pl.js`.

| leaf | schema path | required? | bucket | evidence |
| --- | --- | --- | --- | --- |
| `OpngStckRawMat` | `ManufacturingAccount/OpeningInventory/OpngStckRawMat` | no | INPUT | data-p="pl.mfg.OpeningInventory.OpngStckRawMat" |
| `OpngStckWrkinPrgrs` | `ManufacturingAccount/OpeningInventory/OpngStckWrkinPrgrs` | no | INPUT | data-p="pl.mfg.OpeningInventory.OpngStckWrkinPrgrs" |
| `OpngInvntryTotal` | `ManufacturingAccount/OpeningInventory/OpngInvntryTotal` | block-REQ | COMPUTED | engine St("mfg.OpeningInventory.OpngInvntryTotal") / rc() green cell |
| `Purchases` | `ManufacturingAccount/OpeningInventory/Purchases` | no | INPUT | data-p="pl.mfg.OpeningInventory.Purchases" |
| `DirectWages` | `ManufacturingAccount/OpeningInventory/DirectWages` | no | INPUT | data-p="pl.mfg.OpeningInventory.DirectWages" |
| `DirectExpenses` | `ManufacturingAccount/OpeningInventory/DirectExpenses` | block-REQ | COMPUTED | engine St("mfg.OpeningInventory.DirectExpenses") / rc() green cell |
| `CarriageInward` | `ManufacturingAccount/OpeningInventory/CarriageInward` | no | INPUT | data-p="pl.mfg.OpeningInventory.CarriageInward" |
| `PowerAndFuel` | `ManufacturingAccount/OpeningInventory/PowerAndFuel` | no | INPUT | data-p="pl.mfg.OpeningInventory.PowerAndFuel" |
| `OthDirectExpenses` | `ManufacturingAccount/OpeningInventory/OthDirectExpenses` | no | INPUT | data-p="pl.mfg.OpeningInventory.OthDirectExpenses" |
| `IndirectWages` | `ManufacturingAccount/OpeningInventory/IndirectWages` | no | INPUT | data-p="pl.mfg.OpeningInventory.IndirectWages" |
| `FactoryRentAndRates` | `ManufacturingAccount/OpeningInventory/FactoryRentAndRates` | no | INPUT | data-p="pl.mfg.OpeningInventory.FactoryRentAndRates" |
| `FactoryInsurance` | `ManufacturingAccount/OpeningInventory/FactoryInsurance` | no | INPUT | data-p="pl.mfg.OpeningInventory.FactoryInsurance" |
| `FactoryFuelAndPower` | `ManufacturingAccount/OpeningInventory/FactoryFuelAndPower` | no | INPUT | data-p="pl.mfg.OpeningInventory.FactoryFuelAndPower" |
| `FactoryGeneralExpenses` | `ManufacturingAccount/OpeningInventory/FactoryGeneralExpenses` | no | INPUT | data-p="pl.mfg.OpeningInventory.FactoryGeneralExpenses" |
| `DeprctnOfFactoryMachinery` | `ManufacturingAccount/OpeningInventory/DeprctnOfFactoryMachinery` | no | INPUT | data-p="pl.mfg.OpeningInventory.DeprctnOfFactoryMachinery" |
| `TotalFactoryOverheads` | `ManufacturingAccount/OpeningInventory/TotalFactoryOverheads` | block-REQ | COMPUTED | engine St("mfg.OpeningInventory.TotalFactoryOverheads") / rc() green cell |
| `TotalDebtsManfctrngAcc` | `ManufacturingAccount/OpeningInventory/TotalDebtsManfctrngAcc` | block-REQ | COMPUTED | engine St("mfg.OpeningInventory.TotalDebtsManfctrngAcc") / rc() green cell |
| `ClsngStckRawMaterial` | `ManufacturingAccount/ClosingStock/ClsngStckRawMaterial` | no | INPUT | data-p="pl.mfg.ClosingStock.ClsngStckRawMaterial" |
| `ClsngStckWrkInPrgrs` | `ManufacturingAccount/ClosingStock/ClsngStckWrkInPrgrs` | no | INPUT | data-p="pl.mfg.ClosingStock.ClsngStckWrkInPrgrs" |
| `ClsngStckTotal` | `ManufacturingAccount/ClosingStock/ClsngStckTotal` | block-REQ | COMPUTED | engine St("mfg.ClosingStock.ClsngStckTotal") / rc() green cell |
| `CostOfGoodsPrdcd` | `ManufacturingAccount/CostOfGoodsPrdcd` | block-REQ | COMPUTED | engine St("mfg.CostOfGoodsPrdcd") / rc() green cell |

## 3.3 · TradingAccount

State root `S.pl`; section file `forms/ITR-5/src/70_sec_pl.js`.

| leaf | schema path | required? | bucket | evidence |
| --- | --- | --- | --- | --- |
| `SaleOfGoods` | `TradingAccount/SaleOfGoods` | no | INPUT | data-p="pl.trd.SaleOfGoods" |
| `SaleOfServices` | `TradingAccount/SaleOfServices` | no | INPUT | data-p="pl.trd.SaleOfServices" |
| `OperatingRevenueName` | `TradingAccount/OtherOperatingRevenueDtls[]/OperatingRevenueName` | row-REQ | INPUT | grid("pl.trd.OtherOperatingRevenueDtls") col OperatingRevenueName (t:txt) -> data-p="pl.trd.OtherOperatingRevenueDtls.<i>.OperatingRevenueName" |
| `OperatingRevenueAmt` | `TradingAccount/OtherOperatingRevenueDtls[]/OperatingRevenueAmt` | row-REQ | INPUT | grid("pl.trd.OtherOperatingRevenueDtls") col OperatingRevenueAmt (t:num) -> data-p="pl.trd.OtherOperatingRevenueDtls.<i>.OperatingRevenueAmt" |
| `OperatingRevenueTotal` | `TradingAccount/OperatingRevenueTotal` | block-REQ | COMPUTED | engine St("trd.OperatingRevenueTotal") / rc() green cell |
| `SalesGrossReceiptsTotal` | `TradingAccount/SalesGrossReceiptsTotal` | no | COMPUTED | engine St("trd.SalesGrossReceiptsTotal") / rc() green cell |
| `GrossRcptFromProfession` | `TradingAccount/GrossRcptFromProfession` | no | INPUT | data-p="pl.trd.GrossRcptFromProfession" |
| `UnionExciseDuty` | `TradingAccount/ExciseCustomsVAT/UnionExciseDuty` | no | INPUT | data-p="pl.trd.ExciseCustomsVAT.UnionExciseDuty" |
| `ServiceTax` | `TradingAccount/ExciseCustomsVAT/ServiceTax` | no | INPUT | data-p="pl.trd.ExciseCustomsVAT.ServiceTax" |
| `VATorSaleTax` | `TradingAccount/ExciseCustomsVAT/VATorSaleTax` | no | INPUT | data-p="pl.trd.ExciseCustomsVAT.VATorSaleTax" |
| `CentralGoodServiceTax` | `TradingAccount/ExciseCustomsVAT/CentralGoodServiceTax` | no | INPUT | data-p="pl.trd.ExciseCustomsVAT.CentralGoodServiceTax" |
| `StateGoodServiceTax` | `TradingAccount/ExciseCustomsVAT/StateGoodServiceTax` | no | INPUT | data-p="pl.trd.ExciseCustomsVAT.StateGoodServiceTax" |
| `IntegratedGoodServiceTax` | `TradingAccount/ExciseCustomsVAT/IntegratedGoodServiceTax` | no | INPUT | data-p="pl.trd.ExciseCustomsVAT.IntegratedGoodServiceTax" |
| `UnionTerrGoodServiceTax` | `TradingAccount/ExciseCustomsVAT/UnionTerrGoodServiceTax` | no | INPUT | data-p="pl.trd.ExciseCustomsVAT.UnionTerrGoodServiceTax" |
| `OthDutyTaxCess` | `TradingAccount/ExciseCustomsVAT/OthDutyTaxCess` | no | INPUT | data-p="pl.trd.ExciseCustomsVAT.OthDutyTaxCess" |
| `TotExciseCustomsVAT` | `TradingAccount/ExciseCustomsVAT/TotExciseCustomsVAT` | no | COMPUTED | engine St("trd.ExciseCustomsVAT.TotExciseCustomsVAT") / rc() green cell |
| `TotRevenueFrmOperations` | `TradingAccount/TotRevenueFrmOperations` | block-REQ | COMPUTED | engine St("trd.TotRevenueFrmOperations") / rc() green cell |
| `ClsngStckOfFinishedStcks` | `TradingAccount/ClsngStckOfFinishedStcks` | no | INPUT | data-p="pl.trd.ClsngStckOfFinishedStcks" |
| `TardingAccTotCred` | `TradingAccount/TardingAccTotCred` | block-REQ | COMPUTED | engine St("trd.TardingAccTotCred") / rc() green cell |
| `OpngStckOfFinishedStcks` | `TradingAccount/OpngStckOfFinishedStcks` | no | INPUT | data-p="pl.trd.OpngStckOfFinishedStcks" |
| `Purchases` | `TradingAccount/Purchases` | no | INPUT | data-p="pl.trd.Purchases" |
| `DirectExpenses` | `TradingAccount/DirectExpenses` | no | COMPUTED | engine St("trd.DirectExpenses") / rc() green cell |
| `CarriageInward` | `TradingAccount/CarriageInward` | no | INPUT | data-p="pl.trd.CarriageInward" |
| `PowerAndFuel` | `TradingAccount/PowerAndFuel` | no | INPUT | data-p="pl.trd.PowerAndFuel" |
| `NatureOfDirectExpense` | `TradingAccount/OtherDirectExpenses[]/NatureOfDirectExpense` | row-REQ | INPUT | grid("pl.trd.OtherDirectExpenses") col NatureOfDirectExpense (t:txt) -> data-p="pl.trd.OtherDirectExpenses.<i>.NatureOfDirectExpense" |
| `Amount` | `TradingAccount/OtherDirectExpenses[]/Amount` | row-REQ | INPUT | grid("pl.trd.OtherDirectExpenses") col Amount (t:num) -> data-p="pl.trd.OtherDirectExpenses.<i>.Amount" |
| `DirectExpensesTotal` | `TradingAccount/DirectExpensesTotal` | block-REQ | COMPUTED | engine St("trd.DirectExpensesTotal") / rc() green cell |
| `CustomDuty` | `TradingAccount/DutyTaxPay/ExciseCustomsVAT/CustomDuty` | no | INPUT | data-p="pl.trd.DutyTaxPay.ExciseCustomsVAT.CustomDuty" |
| `CounterVailDuty` | `TradingAccount/DutyTaxPay/ExciseCustomsVAT/CounterVailDuty` | no | INPUT | data-p="pl.trd.DutyTaxPay.ExciseCustomsVAT.CounterVailDuty" |
| `SplAddDuty` | `TradingAccount/DutyTaxPay/ExciseCustomsVAT/SplAddDuty` | no | INPUT | data-p="pl.trd.DutyTaxPay.ExciseCustomsVAT.SplAddDuty" |
| `UnionExciseDuty` | `TradingAccount/DutyTaxPay/ExciseCustomsVAT/UnionExciseDuty` | no | INPUT | data-p="pl.trd.DutyTaxPay.ExciseCustomsVAT.UnionExciseDuty" |
| `ServiceTax` | `TradingAccount/DutyTaxPay/ExciseCustomsVAT/ServiceTax` | no | INPUT | data-p="pl.trd.DutyTaxPay.ExciseCustomsVAT.ServiceTax" |
| `VATorSaleTax` | `TradingAccount/DutyTaxPay/ExciseCustomsVAT/VATorSaleTax` | no | INPUT | data-p="pl.trd.DutyTaxPay.ExciseCustomsVAT.VATorSaleTax" |
| `CentralGoodServiceTax` | `TradingAccount/DutyTaxPay/ExciseCustomsVAT/CentralGoodServiceTax` | no | INPUT | data-p="pl.trd.DutyTaxPay.ExciseCustomsVAT.CentralGoodServiceTax" |
| `StateGoodServiceTax` | `TradingAccount/DutyTaxPay/ExciseCustomsVAT/StateGoodServiceTax` | no | INPUT | data-p="pl.trd.DutyTaxPay.ExciseCustomsVAT.StateGoodServiceTax" |
| `IntegratedGoodServiceTax` | `TradingAccount/DutyTaxPay/ExciseCustomsVAT/IntegratedGoodServiceTax` | no | INPUT | data-p="pl.trd.DutyTaxPay.ExciseCustomsVAT.IntegratedGoodServiceTax" |
| `UnionTerrGoodServiceTax` | `TradingAccount/DutyTaxPay/ExciseCustomsVAT/UnionTerrGoodServiceTax` | no | INPUT | data-p="pl.trd.DutyTaxPay.ExciseCustomsVAT.UnionTerrGoodServiceTax" |
| `OthDutyTaxCess` | `TradingAccount/DutyTaxPay/ExciseCustomsVAT/OthDutyTaxCess` | no | INPUT | data-p="pl.trd.DutyTaxPay.ExciseCustomsVAT.OthDutyTaxCess" |
| `TotExciseCustomsVAT` | `TradingAccount/DutyTaxPay/ExciseCustomsVAT/TotExciseCustomsVAT` | no | COMPUTED | engine St("trd.DutyTaxPay.ExciseCustomsVAT.TotExciseCustomsVAT") / rc() green cell |
| `GoodsCostPrdcdFrmMA` | `TradingAccount/GoodsCostPrdcdFrmMA` | no | COMPUTED | engine St("trd.GoodsCostPrdcdFrmMA") / rc() green cell |
| `GrossProfitFrmBusProf` | `TradingAccount/GrossProfitFrmBusProf` | block-REQ | COMPUTED | engine St("trd.GrossProfitFrmBusProf") / rc() green cell |
| `IntradayTradingTurnOver` | `TradingAccount/IntradayTradingTurnOver` | no | INPUT | data-p="pl.trd.IntradayTradingTurnOver" |
| `IntradayTradingIncome` | `TradingAccount/IntradayTradingIncome` | no | INPUT | data-p="pl.trd.IntradayTradingIncome" |
| `TurnoverFutureTrd` | `TradingAccount/TurnoverFutureTrd` | no | INPUT | data-p="pl.trd.TurnoverFutureTrd" |
| `IncomeFutureTrd` | `TradingAccount/IncomeFutureTrd` | no | INPUT | data-p="pl.trd.IncomeFutureTrd" |

## 3.4 · PARTA_PL — Profit & Loss (regular books · presumptive · no-account · non-resident)

State root `S.pl`; section file `forms/ITR-5/src/70_sec_pl.js`.

| leaf | schema path | required? | bucket | evidence |
| --- | --- | --- | --- | --- |
| `GrossProfitTrnsfFrmTrdAcc` | `PARTA_PL/CreditsToPL/GrossProfitTrnsfFrmTrdAcc` | no | COMPUTED | engine St("pl.CreditsToPL.GrossProfitTrnsfFrmTrdAcc") / rc() green cell |
| `RentInc` | `PARTA_PL/CreditsToPL/OthIncome/RentInc` | **YES** | INPUT | data-p="pl.pl.CreditsToPL.OthIncome.RentInc" |
| `Comissions` | `PARTA_PL/CreditsToPL/OthIncome/Comissions` | **YES** | INPUT | data-p="pl.pl.CreditsToPL.OthIncome.Comissions" |
| `Dividends` | `PARTA_PL/CreditsToPL/OthIncome/Dividends` | **YES** | INPUT | data-p="pl.pl.CreditsToPL.OthIncome.Dividends" |
| `InterestInc` | `PARTA_PL/CreditsToPL/OthIncome/InterestInc` | **YES** | INPUT | data-p="pl.pl.CreditsToPL.OthIncome.InterestInc" |
| `ProfitOnSaleFixedAsset` | `PARTA_PL/CreditsToPL/OthIncome/ProfitOnSaleFixedAsset` | **YES** | INPUT | data-p="pl.pl.CreditsToPL.OthIncome.ProfitOnSaleFixedAsset" |
| `ProfitOnInvChrSTT` | `PARTA_PL/CreditsToPL/OthIncome/ProfitOnInvChrSTT` | **YES** | INPUT | data-p="pl.pl.CreditsToPL.OthIncome.ProfitOnInvChrSTT" |
| `ProfitOnOthInv` | `PARTA_PL/CreditsToPL/OthIncome/ProfitOnOthInv` | **YES** | INPUT | data-p="pl.pl.CreditsToPL.OthIncome.ProfitOnOthInv" |
| `ProfitOnCurrFluct` | `PARTA_PL/CreditsToPL/OthIncome/ProfitOnCurrFluct` | **YES** | INPUT | data-p="pl.pl.CreditsToPL.OthIncome.ProfitOnCurrFluct" |
| `ProfitOnCnvInvntryToCapAsst` | `PARTA_PL/CreditsToPL/OthIncome/ProfitOnCnvInvntryToCapAsst` | **YES** | INPUT | data-p="pl.pl.CreditsToPL.OthIncome.ProfitOnCnvInvntryToCapAsst" |
| `ProfitOnAgriIncome` | `PARTA_PL/CreditsToPL/OthIncome/ProfitOnAgriIncome` | **YES** | INPUT | data-p="pl.pl.CreditsToPL.OthIncome.ProfitOnAgriIncome" |
| `NatureOfIncome` | `PARTA_PL/CreditsToPL/OthIncome/OtherIncDtls[]/NatureOfIncome` | row-REQ | INPUT | grid("pl.pl.CreditsToPL.OthIncome.OtherIncDtls") col NatureOfIncome (t:txt) -> data-p="pl.pl.CreditsToPL.OthIncome.OtherIncDtls.<i>.NatureOfIncome" |
| `Amount` | `PARTA_PL/CreditsToPL/OthIncome/OtherIncDtls[]/Amount` | row-REQ | INPUT | grid("pl.pl.CreditsToPL.OthIncome.OtherIncDtls") col Amount (t:num) -> data-p="pl.pl.CreditsToPL.OthIncome.OtherIncDtls.<i>.Amount" |
| `MiscOthIncome` | `PARTA_PL/CreditsToPL/OthIncome/MiscOthIncome` | **YES** | COMPUTED | engine St("pl.CreditsToPL.OthIncome.MiscOthIncome") / rc() green cell |
| `AmtofInterest` | `PARTA_PL/CreditsToPL/OthIncome/AmtofInterest` | no | INPUT | data-p="pl.pl.CreditsToPL.OthIncome.AmtofInterest" |
| `TotOthIncome` | `PARTA_PL/CreditsToPL/OthIncome/TotOthIncome` | **YES** | COMPUTED | engine St("pl.CreditsToPL.OthIncome.TotOthIncome") / rc() green cell |
| `LiabilityWrittenBack` | `PARTA_PL/CreditsToPL/OthIncome/LiabilityWrittenBack` | no | INPUT | data-p="pl.pl.CreditsToPL.OthIncome.LiabilityWrittenBack" |
| `TotCreditsToPL` | `PARTA_PL/CreditsToPL/TotCreditsToPL` | **YES** | COMPUTED | engine St("pl.CreditsToPL.TotCreditsToPL") / rc() green cell |
| `Freight` | `PARTA_PL/DebitsToPL/DebitPlAcnt/Freight` | **YES** | INPUT | data-p="pl.pl.DebitsToPL.DebitPlAcnt.Freight" |
| `ConsumptionOfStores` | `PARTA_PL/DebitsToPL/DebitPlAcnt/ConsumptionOfStores` | **YES** | INPUT | data-p="pl.pl.DebitsToPL.DebitPlAcnt.ConsumptionOfStores" |
| `PowerFuel` | `PARTA_PL/DebitsToPL/DebitPlAcnt/PowerFuel` | **YES** | INPUT | data-p="pl.pl.DebitsToPL.DebitPlAcnt.PowerFuel" |
| `RentExpdr` | `PARTA_PL/DebitsToPL/DebitPlAcnt/RentExpdr` | **YES** | INPUT | data-p="pl.pl.DebitsToPL.DebitPlAcnt.RentExpdr" |
| `RepairsBldg` | `PARTA_PL/DebitsToPL/DebitPlAcnt/RepairsBldg` | **YES** | INPUT | data-p="pl.pl.DebitsToPL.DebitPlAcnt.RepairsBldg" |
| `RepairMach` | `PARTA_PL/DebitsToPL/DebitPlAcnt/RepairMach` | **YES** | INPUT | data-p="pl.pl.DebitsToPL.DebitPlAcnt.RepairMach" |
| `SalsWages` | `PARTA_PL/DebitsToPL/DebitPlAcnt/EmployeeComp/SalsWages` | **YES** | INPUT | data-p="pl.pl.DebitsToPL.DebitPlAcnt.EmployeeComp.SalsWages" |
| `Bonus` | `PARTA_PL/DebitsToPL/DebitPlAcnt/EmployeeComp/Bonus` | **YES** | INPUT | data-p="pl.pl.DebitsToPL.DebitPlAcnt.EmployeeComp.Bonus" |
| `MedExpReimb` | `PARTA_PL/DebitsToPL/DebitPlAcnt/EmployeeComp/MedExpReimb` | **YES** | INPUT | data-p="pl.pl.DebitsToPL.DebitPlAcnt.EmployeeComp.MedExpReimb" |
| `LeaveEncash` | `PARTA_PL/DebitsToPL/DebitPlAcnt/EmployeeComp/LeaveEncash` | **YES** | INPUT | data-p="pl.pl.DebitsToPL.DebitPlAcnt.EmployeeComp.LeaveEncash" |
| `LeaveTravelBenft` | `PARTA_PL/DebitsToPL/DebitPlAcnt/EmployeeComp/LeaveTravelBenft` | **YES** | INPUT | data-p="pl.pl.DebitsToPL.DebitPlAcnt.EmployeeComp.LeaveTravelBenft" |
| `ContToSuperAnnFund` | `PARTA_PL/DebitsToPL/DebitPlAcnt/EmployeeComp/ContToSuperAnnFund` | **YES** | INPUT | data-p="pl.pl.DebitsToPL.DebitPlAcnt.EmployeeComp.ContToSuperAnnFund" |
| `ContToPF` | `PARTA_PL/DebitsToPL/DebitPlAcnt/EmployeeComp/ContToPF` | **YES** | INPUT | data-p="pl.pl.DebitsToPL.DebitPlAcnt.EmployeeComp.ContToPF" |
| `ContToGratFund` | `PARTA_PL/DebitsToPL/DebitPlAcnt/EmployeeComp/ContToGratFund` | **YES** | INPUT | data-p="pl.pl.DebitsToPL.DebitPlAcnt.EmployeeComp.ContToGratFund" |
| `ContToOthFund` | `PARTA_PL/DebitsToPL/DebitPlAcnt/EmployeeComp/ContToOthFund` | **YES** | INPUT | data-p="pl.pl.DebitsToPL.DebitPlAcnt.EmployeeComp.ContToOthFund" |
| `OthEmpBenftExpdr` | `PARTA_PL/DebitsToPL/DebitPlAcnt/EmployeeComp/OthEmpBenftExpdr` | **YES** | INPUT | data-p="pl.pl.DebitsToPL.DebitPlAcnt.EmployeeComp.OthEmpBenftExpdr" |
| `TotEmployeeComp` | `PARTA_PL/DebitsToPL/DebitPlAcnt/EmployeeComp/TotEmployeeComp` | **YES** | COMPUTED | engine St("pl.DebitsToPL.DebitPlAcnt.EmployeeComp.TotEmployeeComp") / rc() green cell |
| `AnyCompPaidToNonRes` | `PARTA_PL/DebitsToPL/DebitPlAcnt/EmployeeComp/AnyCompPaidToNonRes` | no | INPUT | data-p="pl.pl.DebitsToPL.DebitPlAcnt.EmployeeComp.AnyCompPaidToNonRes" |
| `AmtPaidToNonRes` | `PARTA_PL/DebitsToPL/DebitPlAcnt/EmployeeComp/AmtPaidToNonRes` | no | INPUT | data-p="pl.pl.DebitsToPL.DebitPlAcnt.EmployeeComp.AmtPaidToNonRes" |
| `MedInsur` | `PARTA_PL/DebitsToPL/DebitPlAcnt/Insurances/MedInsur` | **YES** | INPUT | data-p="pl.pl.DebitsToPL.DebitPlAcnt.Insurances.MedInsur" |
| `LifeInsur` | `PARTA_PL/DebitsToPL/DebitPlAcnt/Insurances/LifeInsur` | **YES** | INPUT | data-p="pl.pl.DebitsToPL.DebitPlAcnt.Insurances.LifeInsur" |
| `KeyManInsur` | `PARTA_PL/DebitsToPL/DebitPlAcnt/Insurances/KeyManInsur` | **YES** | INPUT | data-p="pl.pl.DebitsToPL.DebitPlAcnt.Insurances.KeyManInsur" |
| `OthInsur` | `PARTA_PL/DebitsToPL/DebitPlAcnt/Insurances/OthInsur` | **YES** | INPUT | data-p="pl.pl.DebitsToPL.DebitPlAcnt.Insurances.OthInsur" |
| `TotInsurances` | `PARTA_PL/DebitsToPL/DebitPlAcnt/Insurances/TotInsurances` | **YES** | COMPUTED | engine St("pl.DebitsToPL.DebitPlAcnt.Insurances.TotInsurances") / rc() green cell |
| `StaffWelfareExp` | `PARTA_PL/DebitsToPL/DebitPlAcnt/StaffWelfareExp` | **YES** | INPUT | data-p="pl.pl.DebitsToPL.DebitPlAcnt.StaffWelfareExp" |
| `Entertainment` | `PARTA_PL/DebitsToPL/DebitPlAcnt/Entertainment` | **YES** | INPUT | data-p="pl.pl.DebitsToPL.DebitPlAcnt.Entertainment" |
| `Hospitality` | `PARTA_PL/DebitsToPL/DebitPlAcnt/Hospitality` | **YES** | INPUT | data-p="pl.pl.DebitsToPL.DebitPlAcnt.Hospitality" |
| `Conference` | `PARTA_PL/DebitsToPL/DebitPlAcnt/Conference` | **YES** | INPUT | data-p="pl.pl.DebitsToPL.DebitPlAcnt.Conference" |
| `SalePromoExp` | `PARTA_PL/DebitsToPL/DebitPlAcnt/SalePromoExp` | **YES** | INPUT | data-p="pl.pl.DebitsToPL.DebitPlAcnt.SalePromoExp" |
| `Advertisement` | `PARTA_PL/DebitsToPL/DebitPlAcnt/Advertisement` | **YES** | INPUT | data-p="pl.pl.DebitsToPL.DebitPlAcnt.Advertisement" |
| `NonResOtherCompany` | `PARTA_PL/DebitsToPL/DebitPlAcnt/CommissionExpdrDtls/NonResOtherCompany` | **YES** | INPUT | data-p="pl.pl.DebitsToPL.DebitPlAcnt.CommissionExpdrDtls.NonResOtherCompany" |
| `Others` | `PARTA_PL/DebitsToPL/DebitPlAcnt/CommissionExpdrDtls/Others` | **YES** | INPUT | data-p="pl.pl.DebitsToPL.DebitPlAcnt.CommissionExpdrDtls.Others" |
| `Total` | `PARTA_PL/DebitsToPL/DebitPlAcnt/CommissionExpdrDtls/Total` | **YES** | COMPUTED | engine St("pl.DebitsToPL.DebitPlAcnt.CommissionExpdrDtls.Total") / rc() green cell |
| `NonResOtherCompany` | `PARTA_PL/DebitsToPL/DebitPlAcnt/RoyalityDtls/NonResOtherCompany` | **YES** | INPUT | data-p="pl.pl.DebitsToPL.DebitPlAcnt.RoyalityDtls.NonResOtherCompany" |
| `Others` | `PARTA_PL/DebitsToPL/DebitPlAcnt/RoyalityDtls/Others` | **YES** | INPUT | data-p="pl.pl.DebitsToPL.DebitPlAcnt.RoyalityDtls.Others" |
| `Total` | `PARTA_PL/DebitsToPL/DebitPlAcnt/RoyalityDtls/Total` | **YES** | COMPUTED | engine St("pl.DebitsToPL.DebitPlAcnt.RoyalityDtls.Total") / rc() green cell |
| `NonResOtherCompany` | `PARTA_PL/DebitsToPL/DebitPlAcnt/ProfessionalConstDtls/NonResOtherCompany` | **YES** | INPUT | data-p="pl.pl.DebitsToPL.DebitPlAcnt.ProfessionalConstDtls.NonResOtherCompany" |
| `Others` | `PARTA_PL/DebitsToPL/DebitPlAcnt/ProfessionalConstDtls/Others` | **YES** | INPUT | data-p="pl.pl.DebitsToPL.DebitPlAcnt.ProfessionalConstDtls.Others" |
| `Total` | `PARTA_PL/DebitsToPL/DebitPlAcnt/ProfessionalConstDtls/Total` | **YES** | COMPUTED | engine St("pl.DebitsToPL.DebitPlAcnt.ProfessionalConstDtls.Total") / rc() green cell |
| `HotelBoardLodge` | `PARTA_PL/DebitsToPL/DebitPlAcnt/HotelBoardLodge` | **YES** | INPUT | data-p="pl.pl.DebitsToPL.DebitPlAcnt.HotelBoardLodge" |
| `TravelExp` | `PARTA_PL/DebitsToPL/DebitPlAcnt/TravelExp` | **YES** | INPUT | data-p="pl.pl.DebitsToPL.DebitPlAcnt.TravelExp" |
| `ForeignTravelExp` | `PARTA_PL/DebitsToPL/DebitPlAcnt/ForeignTravelExp` | **YES** | INPUT | data-p="pl.pl.DebitsToPL.DebitPlAcnt.ForeignTravelExp" |
| `ConveyanceExp` | `PARTA_PL/DebitsToPL/DebitPlAcnt/ConveyanceExp` | **YES** | INPUT | data-p="pl.pl.DebitsToPL.DebitPlAcnt.ConveyanceExp" |
| `TelephoneExp` | `PARTA_PL/DebitsToPL/DebitPlAcnt/TelephoneExp` | **YES** | INPUT | data-p="pl.pl.DebitsToPL.DebitPlAcnt.TelephoneExp" |
| `GuestHouseExp` | `PARTA_PL/DebitsToPL/DebitPlAcnt/GuestHouseExp` | **YES** | INPUT | data-p="pl.pl.DebitsToPL.DebitPlAcnt.GuestHouseExp" |
| `ClubExp` | `PARTA_PL/DebitsToPL/DebitPlAcnt/ClubExp` | **YES** | INPUT | data-p="pl.pl.DebitsToPL.DebitPlAcnt.ClubExp" |
| `FestivalCelebExp` | `PARTA_PL/DebitsToPL/DebitPlAcnt/FestivalCelebExp` | **YES** | INPUT | data-p="pl.pl.DebitsToPL.DebitPlAcnt.FestivalCelebExp" |
| `Scholarship` | `PARTA_PL/DebitsToPL/DebitPlAcnt/Scholarship` | **YES** | INPUT | data-p="pl.pl.DebitsToPL.DebitPlAcnt.Scholarship" |
| `Gift` | `PARTA_PL/DebitsToPL/DebitPlAcnt/Gift` | **YES** | INPUT | data-p="pl.pl.DebitsToPL.DebitPlAcnt.Gift" |
| `Donation` | `PARTA_PL/DebitsToPL/DebitPlAcnt/Donation` | **YES** | INPUT | data-p="pl.pl.DebitsToPL.DebitPlAcnt.Donation" |
| `UnionExciseDuty` | `PARTA_PL/DebitsToPL/DebitPlAcnt/RatesTaxesPays/ExciseCustomsVAT/UnionExciseDuty` | **YES** | INPUT | data-p="pl.pl.DebitsToPL.DebitPlAcnt.RatesTaxesPays.ExciseCustomsVAT.UnionExciseDuty" |
| `ServiceTax` | `PARTA_PL/DebitsToPL/DebitPlAcnt/RatesTaxesPays/ExciseCustomsVAT/ServiceTax` | **YES** | INPUT | data-p="pl.pl.DebitsToPL.DebitPlAcnt.RatesTaxesPays.ExciseCustomsVAT.ServiceTax" |
| `VATorSaleTax` | `PARTA_PL/DebitsToPL/DebitPlAcnt/RatesTaxesPays/ExciseCustomsVAT/VATorSaleTax` | **YES** | INPUT | data-p="pl.pl.DebitsToPL.DebitPlAcnt.RatesTaxesPays.ExciseCustomsVAT.VATorSaleTax" |
| `Cess` | `PARTA_PL/DebitsToPL/DebitPlAcnt/RatesTaxesPays/ExciseCustomsVAT/Cess` | no | INPUT | data-p="pl.pl.DebitsToPL.DebitPlAcnt.RatesTaxesPays.ExciseCustomsVAT.Cess" |
| `CentralGoodServiceTax` | `PARTA_PL/DebitsToPL/DebitPlAcnt/RatesTaxesPays/ExciseCustomsVAT/CentralGoodServiceTax` | **YES** | INPUT | data-p="pl.pl.DebitsToPL.DebitPlAcnt.RatesTaxesPays.ExciseCustomsVAT.CentralGoodServiceTax" |
| `StateGoodServiceTax` | `PARTA_PL/DebitsToPL/DebitPlAcnt/RatesTaxesPays/ExciseCustomsVAT/StateGoodServiceTax` | **YES** | INPUT | data-p="pl.pl.DebitsToPL.DebitPlAcnt.RatesTaxesPays.ExciseCustomsVAT.StateGoodServiceTax" |
| `IntegratedGoodServiceTax` | `PARTA_PL/DebitsToPL/DebitPlAcnt/RatesTaxesPays/ExciseCustomsVAT/IntegratedGoodServiceTax` | **YES** | INPUT | data-p="pl.pl.DebitsToPL.DebitPlAcnt.RatesTaxesPays.ExciseCustomsVAT.IntegratedGoodServiceTax" |
| `UnionTerrGoodServiceTax` | `PARTA_PL/DebitsToPL/DebitPlAcnt/RatesTaxesPays/ExciseCustomsVAT/UnionTerrGoodServiceTax` | **YES** | INPUT | data-p="pl.pl.DebitsToPL.DebitPlAcnt.RatesTaxesPays.ExciseCustomsVAT.UnionTerrGoodServiceTax" |
| `OthDutyTaxCess` | `PARTA_PL/DebitsToPL/DebitPlAcnt/RatesTaxesPays/ExciseCustomsVAT/OthDutyTaxCess` | **YES** | INPUT | data-p="pl.pl.DebitsToPL.DebitPlAcnt.RatesTaxesPays.ExciseCustomsVAT.OthDutyTaxCess" |
| `TotExciseCustomsVAT` | `PARTA_PL/DebitsToPL/DebitPlAcnt/RatesTaxesPays/ExciseCustomsVAT/TotExciseCustomsVAT` | **YES** | COMPUTED | engine St("pl.DebitsToPL.DebitPlAcnt.RatesTaxesPays.ExciseCustomsVAT.TotExciseCustomsVAT") / rc() green cell |
| `AuditFee` | `PARTA_PL/DebitsToPL/DebitPlAcnt/AuditFee` | **YES** | INPUT | data-p="pl.pl.DebitsToPL.DebitPlAcnt.AuditFee" |
| `SalRemuneration` | `PARTA_PL/DebitsToPL/DebitPlAcnt/SalRemuneration` | **YES** | INPUT | data-p="pl.pl.DebitsToPL.DebitPlAcnt.SalRemuneration" |
| `ExpenseNature` | `PARTA_PL/DebitsToPL/DebitPlAcnt/OtherExpensesDtls[]/ExpenseNature` | row-REQ | INPUT | grid("pl.pl.DebitsToPL.DebitPlAcnt.OtherExpensesDtls") col ExpenseNature (t:txt) -> data-p="pl.pl.DebitsToPL.DebitPlAcnt.OtherExpensesDtls.<i>.ExpenseNature" |
| `Amount` | `PARTA_PL/DebitsToPL/DebitPlAcnt/OtherExpensesDtls[]/Amount` | row-REQ | INPUT | grid("pl.pl.DebitsToPL.DebitPlAcnt.OtherExpensesDtls") col Amount (t:num) -> data-p="pl.pl.DebitsToPL.DebitPlAcnt.OtherExpensesDtls.<i>.Amount" |
| `OtherExpenses` | `PARTA_PL/DebitsToPL/DebitPlAcnt/OtherExpenses` | **YES** | COMPUTED | engine St("pl.DebitsToPL.DebitPlAcnt.OtherExpenses") / rc() green cell |
| `PAN` | `PARTA_PL/DebitsToPL/DebitPlAcnt/BadDebtDtls/BadDebtAmtDtls[]/PAN` | row-REQ | INPUT | grid("pl.pl.DebitsToPL.DebitPlAcnt.BadDebtDtls.BadDebtAmtDtls") col PAN (t:txt) -> data-p="pl.pl.DebitsToPL.DebitPlAcnt.BadDebtDtls.BadDebtAmtDtls.<i>.PAN" |
| `Aadhaar` | `PARTA_PL/DebitsToPL/DebitPlAcnt/BadDebtDtls/BadDebtAmtDtls[]/Aadhaar` | no | INPUT | grid("pl.pl.DebitsToPL.DebitPlAcnt.BadDebtDtls.BadDebtAmtDtls") col Aadhaar (t:txt) -> data-p="pl.pl.DebitsToPL.DebitPlAcnt.BadDebtDtls.BadDebtAmtDtls.<i>.Aadhaar" |
| `Amount` | `PARTA_PL/DebitsToPL/DebitPlAcnt/BadDebtDtls/BadDebtAmtDtls[]/Amount` | row-REQ | INPUT | grid("pl.pl.DebitsToPL.DebitPlAcnt.BadDebtDtls.BadDebtAmtDtls") col Amount (t:num) -> data-p="pl.pl.DebitsToPL.DebitPlAcnt.BadDebtDtls.BadDebtAmtDtls.<i>.Amount" |
| `BadDebtAmtDtlsTotal` | `PARTA_PL/DebitsToPL/DebitPlAcnt/BadDebtDtls/BadDebtAmtDtlsTotal` | **YES** | COMPUTED | engine St("pl.DebitsToPL.DebitPlAcnt.BadDebtDtls.BadDebtAmtDtlsTotal") / rc() green cell |
| `Name` | `PARTA_PL/DebitsToPL/DebitPlAcnt/BadDebtDtls/OthersPANNotAvlblDtl[]/Name` | row-REQ | INPUT | grid("pl.pl.DebitsToPL.DebitPlAcnt.BadDebtDtls.OthersPANNotAvlblDtl") col Name (t:txt) -> data-p="pl.pl.DebitsToPL.DebitPlAcnt.BadDebtDtls.OthersPANNotAvlblDtl.<i>.Name" |
| `FlatDoorBlockNumber` | `PARTA_PL/DebitsToPL/DebitPlAcnt/BadDebtDtls/OthersPANNotAvlblDtl[]/FlatDoorBlockNumber` | row-REQ | INPUT | grid("pl.pl.DebitsToPL.DebitPlAcnt.BadDebtDtls.OthersPANNotAvlblDtl") col FlatDoorBlockNumber (t:txt) -> data-p="pl.pl.DebitsToPL.DebitPlAcnt.BadDebtDtls.OthersPANNotAvlblDtl.<i>.FlatDoorBlockNumber" |
| `PremisesBuildingName` | `PARTA_PL/DebitsToPL/DebitPlAcnt/BadDebtDtls/OthersPANNotAvlblDtl[]/PremisesBuildingName` | no | INPUT | grid("pl.pl.DebitsToPL.DebitPlAcnt.BadDebtDtls.OthersPANNotAvlblDtl") col PremisesBuildingName (t:txt) -> data-p="pl.pl.DebitsToPL.DebitPlAcnt.BadDebtDtls.OthersPANNotAvlblDtl.<i>.PremisesBuildingName" |
| `RoadStreetPostOffice` | `PARTA_PL/DebitsToPL/DebitPlAcnt/BadDebtDtls/OthersPANNotAvlblDtl[]/RoadStreetPostOffice` | no | INPUT | grid("pl.pl.DebitsToPL.DebitPlAcnt.BadDebtDtls.OthersPANNotAvlblDtl") col RoadStreetPostOffice (t:txt) -> data-p="pl.pl.DebitsToPL.DebitPlAcnt.BadDebtDtls.OthersPANNotAvlblDtl.<i>.RoadStreetPostOffice" |
| `AreaLocality` | `PARTA_PL/DebitsToPL/DebitPlAcnt/BadDebtDtls/OthersPANNotAvlblDtl[]/AreaLocality` | row-REQ | INPUT | grid("pl.pl.DebitsToPL.DebitPlAcnt.BadDebtDtls.OthersPANNotAvlblDtl") col AreaLocality (t:txt) -> data-p="pl.pl.DebitsToPL.DebitPlAcnt.BadDebtDtls.OthersPANNotAvlblDtl.<i>.AreaLocality" |
| `TownCityDistrict` | `PARTA_PL/DebitsToPL/DebitPlAcnt/BadDebtDtls/OthersPANNotAvlblDtl[]/TownCityDistrict` | row-REQ | INPUT | grid("pl.pl.DebitsToPL.DebitPlAcnt.BadDebtDtls.OthersPANNotAvlblDtl") col TownCityDistrict (t:txt) -> data-p="pl.pl.DebitsToPL.DebitPlAcnt.BadDebtDtls.OthersPANNotAvlblDtl.<i>.TownCityDistrict" |
| `StateCode` | `PARTA_PL/DebitsToPL/DebitPlAcnt/BadDebtDtls/OthersPANNotAvlblDtl[]/StateCode` | row-REQ | INPUT | grid("pl.pl.DebitsToPL.DebitPlAcnt.BadDebtDtls.OthersPANNotAvlblDtl") col StateCode (t:sel) -> data-p="pl.pl.DebitsToPL.DebitPlAcnt.BadDebtDtls.OthersPANNotAvlblDtl.<i>.StateCode" |
| `CountryCode` | `PARTA_PL/DebitsToPL/DebitPlAcnt/BadDebtDtls/OthersPANNotAvlblDtl[]/CountryCode` | row-REQ | INPUT | grid("pl.pl.DebitsToPL.DebitPlAcnt.BadDebtDtls.OthersPANNotAvlblDtl") col CountryCode (t:sel) -> data-p="pl.pl.DebitsToPL.DebitPlAcnt.BadDebtDtls.OthersPANNotAvlblDtl.<i>.CountryCode" |
| `PinCode` | `PARTA_PL/DebitsToPL/DebitPlAcnt/BadDebtDtls/OthersPANNotAvlblDtl[]/PinCode` | no | INPUT | grid("pl.pl.DebitsToPL.DebitPlAcnt.BadDebtDtls.OthersPANNotAvlblDtl") col PinCode (t:num) -> data-p="pl.pl.DebitsToPL.DebitPlAcnt.BadDebtDtls.OthersPANNotAvlblDtl.<i>.PinCode" |
| `ZipCode` | `PARTA_PL/DebitsToPL/DebitPlAcnt/BadDebtDtls/OthersPANNotAvlblDtl[]/ZipCode` | no | INPUT | grid("pl.pl.DebitsToPL.DebitPlAcnt.BadDebtDtls.OthersPANNotAvlblDtl") col ZipCode (t:txt) -> data-p="pl.pl.DebitsToPL.DebitPlAcnt.BadDebtDtls.OthersPANNotAvlblDtl.<i>.ZipCode" |
| `Amount` | `PARTA_PL/DebitsToPL/DebitPlAcnt/BadDebtDtls/OthersPANNotAvlblDtl[]/Amount` | row-REQ | INPUT | grid("pl.pl.DebitsToPL.DebitPlAcnt.BadDebtDtls.OthersPANNotAvlblDtl") col Amount (t:num) -> data-p="pl.pl.DebitsToPL.DebitPlAcnt.BadDebtDtls.OthersPANNotAvlblDtl.<i>.Amount" |
| `OthersPANNotAvlblDtlTotal` | `PARTA_PL/DebitsToPL/DebitPlAcnt/BadDebtDtls/OthersPANNotAvlblDtlTotal` | **YES** | COMPUTED | engine St("pl.DebitsToPL.DebitPlAcnt.BadDebtDtls.OthersPANNotAvlblDtlTotal") / rc() green cell |
| `OthersAmtLt1Lakh` | `PARTA_PL/DebitsToPL/DebitPlAcnt/BadDebtDtls/OthersAmtLt1Lakh` | **YES** | INPUT | data-p="pl.pl.DebitsToPL.DebitPlAcnt.BadDebtDtls.OthersAmtLt1Lakh" |
| `BadDebt` | `PARTA_PL/DebitsToPL/DebitPlAcnt/BadDebtDtls/BadDebt` | **YES** | COMPUTED | engine St("pl.DebitsToPL.DebitPlAcnt.BadDebtDtls.BadDebt") / rc() green cell |
| `ProvForBadDoubtDebt` | `PARTA_PL/DebitsToPL/DebitPlAcnt/ProvForBadDoubtDebt` | **YES** | INPUT | data-p="pl.pl.DebitsToPL.DebitPlAcnt.ProvForBadDoubtDebt" |
| `OthProvisionsExpdr` | `PARTA_PL/DebitsToPL/DebitPlAcnt/OthProvisionsExpdr` | **YES** | INPUT | data-p="pl.pl.DebitsToPL.DebitPlAcnt.OthProvisionsExpdr" |
| `PBIDTA` | `PARTA_PL/DebitsToPL/DebitPlAcnt/PBIDTA` | **YES** | COMPUTED | engine St("pl.DebitsToPL.DebitPlAcnt.PBIDTA") / rc() green cell |
| `NonResOtherCompany` | `PARTA_PL/DebitsToPL/DebitPlAcnt/InterestExpdrtDtls/NonResOtherCompany` | **YES** | INPUT | data-p="pl.pl.DebitsToPL.DebitPlAcnt.InterestExpdrtDtls.NonResOtherCompany" |
| `Others` | `PARTA_PL/DebitsToPL/DebitPlAcnt/InterestExpdrtDtls/Others` | **YES** | INPUT | data-p="pl.pl.DebitsToPL.DebitPlAcnt.InterestExpdrtDtls.Others" |
| `ResPartners` | `PARTA_PL/DebitsToPL/DebitPlAcnt/InterestExpdrtDtls/ResPartners` | **YES** | INPUT | data-p="pl.pl.DebitsToPL.DebitPlAcnt.InterestExpdrtDtls.ResPartners" |
| `ResOthers` | `PARTA_PL/DebitsToPL/DebitPlAcnt/InterestExpdrtDtls/ResOthers` | **YES** | INPUT | data-p="pl.pl.DebitsToPL.DebitPlAcnt.InterestExpdrtDtls.ResOthers" |
| `InterestExpdr` | `PARTA_PL/DebitsToPL/DebitPlAcnt/InterestExpdrtDtls/InterestExpdr` | **YES** | COMPUTED | engine St("pl.DebitsToPL.DebitPlAcnt.InterestExpdrtDtls.InterestExpdr") / rc() green cell |
| `DepreciationAmort` | `PARTA_PL/DebitsToPL/DebitPlAcnt/DepreciationAmort` | **YES** | INPUT | data-p="pl.pl.DebitsToPL.DebitPlAcnt.DepreciationAmort" |
| `PBT` | `PARTA_PL/DebitsToPL/DebitPlAcnt/PBT` | **YES** | COMPUTED | engine St("pl.DebitsToPL.DebitPlAcnt.PBT") / rc() green cell |
| `ProvForCurrTax` | `PARTA_PL/DebitsToPL/TaxProvAppr/ProvForCurrTax` | **YES** | INPUT | data-p="pl.pl.DebitsToPL.TaxProvAppr.ProvForCurrTax" |
| `ProvDefTax` | `PARTA_PL/DebitsToPL/TaxProvAppr/ProvDefTax` | **YES** | INPUT | data-p="pl.pl.DebitsToPL.TaxProvAppr.ProvDefTax" |
| `ProfitAfterTax` | `PARTA_PL/DebitsToPL/TaxProvAppr/ProfitAfterTax` | **YES** | COMPUTED | engine St("pl.DebitsToPL.TaxProvAppr.ProfitAfterTax") / rc() green cell |
| `BalBFPrevYr` | `PARTA_PL/DebitsToPL/TaxProvAppr/BalBFPrevYr` | **YES** | INPUT | data-p="pl.pl.DebitsToPL.TaxProvAppr.BalBFPrevYr" |
| `AmtAvlAppr` | `PARTA_PL/DebitsToPL/TaxProvAppr/AmtAvlAppr` | **YES** | COMPUTED | engine St("pl.DebitsToPL.TaxProvAppr.AmtAvlAppr") / rc() green cell |
| `TrfToReserves` | `PARTA_PL/DebitsToPL/TaxProvAppr/Appropriations/TrfToReserves` | **YES** | INPUT | data-p="pl.pl.DebitsToPL.TaxProvAppr.Appropriations.TrfToReserves" |
| `PartnerAccBalTrf` | `PARTA_PL/DebitsToPL/TaxProvAppr/PartnerAccBalTrf` | **YES** | COMPUTED | engine St("pl.DebitsToPL.TaxProvAppr.PartnerAccBalTrf") / rc() green cell |
| `NameOfBusiness` | `PARTA_PL/NatOfBus44AD[]/NameOfBusiness` | row-REQ | INPUT | grid("pl.pl.NatOfBus44AD") col NameOfBusiness (t:txt) -> data-p="pl.pl.NatOfBus44AD.<i>.NameOfBusiness" |
| `CodeAD` | `PARTA_PL/NatOfBus44AD[]/CodeAD` | row-REQ | INPUT | grid("pl.pl.NatOfBus44AD") col CodeAD (t:sel) -> data-p="pl.pl.NatOfBus44AD.<i>.CodeAD" |
| `Description` | `PARTA_PL/NatOfBus44AD[]/Description` | no | INPUT | grid("pl.pl.NatOfBus44AD") col Description (t:txt) -> data-p="pl.pl.NatOfBus44AD.<i>.Description" |
| `GrsTrnOverOrReceipt` | `PARTA_PL/PersumptiveInc44AD/GrsTrnOverOrReceipt` | **YES** | COMPUTED | engine St("pl.PersumptiveInc44AD.GrsTrnOverOrReceipt") / rc() green cell |
| `GrsTrnOverBank` | `PARTA_PL/PersumptiveInc44AD/GrsTrnOverBank` | no | INPUT | data-p="pl.pl.PersumptiveInc44AD.GrsTrnOverBank" |
| `GrsTotalTrnOverInCash` | `PARTA_PL/PersumptiveInc44AD/GrsTotalTrnOverInCash` | no | INPUT | data-p="pl.pl.PersumptiveInc44AD.GrsTotalTrnOverInCash" |
| `GrsTrnOverAnyOthMode` | `PARTA_PL/PersumptiveInc44AD/GrsTrnOverAnyOthMode` | no | INPUT | data-p="pl.pl.PersumptiveInc44AD.GrsTrnOverAnyOthMode" |
| `TotPersumptiveInc44AD` | `PARTA_PL/PersumptiveInc44AD/TotPersumptiveInc44AD` | **YES** | COMPUTED | engine St("pl.PersumptiveInc44AD.TotPersumptiveInc44AD") / rc() green cell |
| `PersumptiveInc44AD6Per` | `PARTA_PL/PersumptiveInc44AD/PersumptiveInc44AD6Per` | no | INPUT | data-p="pl.pl.PersumptiveInc44AD.PersumptiveInc44AD6Per" |
| `PersumptiveInc44AD8Per` | `PARTA_PL/PersumptiveInc44AD/PersumptiveInc44AD8Per` | no | INPUT | data-p="pl.pl.PersumptiveInc44AD.PersumptiveInc44AD8Per" |
| `NameOfBusiness` | `PARTA_PL/NatOfBus44ADA[]/NameOfBusiness` | row-REQ | INPUT | grid("pl.pl.NatOfBus44ADA") col NameOfBusiness (t:txt) -> data-p="pl.pl.NatOfBus44ADA.<i>.NameOfBusiness" |
| `CodeADA` | `PARTA_PL/NatOfBus44ADA[]/CodeADA` | row-REQ | INPUT | grid("pl.pl.NatOfBus44ADA") col CodeADA (t:sel) -> data-p="pl.pl.NatOfBus44ADA.<i>.CodeADA" |
| `Description` | `PARTA_PL/NatOfBus44ADA[]/Description` | no | INPUT | grid("pl.pl.NatOfBus44ADA") col Description (t:txt) -> data-p="pl.pl.NatOfBus44ADA.<i>.Description" |
| `GrsReceipt` | `PARTA_PL/PersumptiveInc44ADA/GrsReceipt` | **YES** | COMPUTED | engine St("pl.PersumptiveInc44ADA.GrsReceipt") / rc() green cell |
| `GrsTrnOverBank44ADA` | `PARTA_PL/PersumptiveInc44ADA/GrsTrnOverBank44ADA` | no | INPUT | data-p="pl.pl.PersumptiveInc44ADA.GrsTrnOverBank44ADA" |
| `GrsTotalTrnOverInCash44ADA` | `PARTA_PL/PersumptiveInc44ADA/GrsTotalTrnOverInCash44ADA` | no | INPUT | data-p="pl.pl.PersumptiveInc44ADA.GrsTotalTrnOverInCash44ADA" |
| `GrsTrnOverAnyOthMode44ADA` | `PARTA_PL/PersumptiveInc44ADA/GrsTrnOverAnyOthMode44ADA` | no | INPUT | data-p="pl.pl.PersumptiveInc44ADA.GrsTrnOverAnyOthMode44ADA" |
| `TotPersumptiveInc44ADA` | `PARTA_PL/PersumptiveInc44ADA/TotPersumptiveInc44ADA` | no | INPUT | data-p="pl.pl.PersumptiveInc44ADA.TotPersumptiveInc44ADA" |
| `NameOfBusiness` | `PARTA_PL/NatOfBus44AE[]/NameOfBusiness` | row-REQ | INPUT | grid("pl.pl.NatOfBus44AE") col NameOfBusiness (t:txt) -> data-p="pl.pl.NatOfBus44AE.<i>.NameOfBusiness" |
| `CodeAE` | `PARTA_PL/NatOfBus44AE[]/CodeAE` | row-REQ | INPUT | grid("pl.pl.NatOfBus44AE") col CodeAE (t:sel) -> data-p="pl.pl.NatOfBus44AE.<i>.CodeAE" |
| `Description` | `PARTA_PL/NatOfBus44AE[]/Description` | no | INPUT | grid("pl.pl.NatOfBus44AE") col Description (t:txt) -> data-p="pl.pl.NatOfBus44AE.<i>.Description" |
| `RegNumberGoodsCarriage` | `PARTA_PL/GoodsDtlsUs44AE[]/RegNumberGoodsCarriage` | row-REQ | INPUT | grid("pl.pl.GoodsDtlsUs44AE") col RegNumberGoodsCarriage (t:txt) -> data-p="pl.pl.GoodsDtlsUs44AE.<i>.RegNumberGoodsCarriage" |
| `OwnedLeasedHiredFlag` | `PARTA_PL/GoodsDtlsUs44AE[]/OwnedLeasedHiredFlag` | row-REQ | INPUT | grid("pl.pl.GoodsDtlsUs44AE") col OwnedLeasedHiredFlag (t:sel) -> data-p="pl.pl.GoodsDtlsUs44AE.<i>.OwnedLeasedHiredFlag" |
| `TonnageCapacity` | `PARTA_PL/GoodsDtlsUs44AE[]/TonnageCapacity` | row-REQ | INPUT | grid("pl.pl.GoodsDtlsUs44AE") col TonnageCapacity (t:num) -> data-p="pl.pl.GoodsDtlsUs44AE.<i>.TonnageCapacity" |
| `HoldingPeriod` | `PARTA_PL/GoodsDtlsUs44AE[]/HoldingPeriod` | row-REQ | INPUT | grid("pl.pl.GoodsDtlsUs44AE") col HoldingPeriod (t:num) -> data-p="pl.pl.GoodsDtlsUs44AE.<i>.HoldingPeriod" |
| `PresumptiveIncome` | `PARTA_PL/GoodsDtlsUs44AE[]/PresumptiveIncome` | row-REQ | COMPUTED | grid("pl.pl.GoodsDtlsUs44AE") col PresumptiveIncome (t:calc) -> data-p="pl.pl.GoodsDtlsUs44AE.<i>.PresumptiveIncome" |
| `TotalNumOfMonths` | `PARTA_PL/TotalNumOfMonths` | no | COMPUTED | engine St("pl.TotalNumOfMonths") / rc() green cell |
| `TotalPrsumptvIncUs44EGoods` | `PARTA_PL/TotalPrsumptvIncUs44EGoods` | no | COMPUTED | engine St("pl.TotalPrsumptvIncUs44EGoods") / rc() green cell |
| `TotalPrsumptvIncGCUs44E` | `PARTA_PL/TotalPrsumptvIncGCUs44E` | no | COMPUTED | engine St("pl.TotalPrsumptvIncGCUs44E") / rc() green cell |
| `SalRemrtnToPartnerFirm` | `PARTA_PL/SalRemrtnToPartnerFirm` | no | INPUT | data-p="pl.pl.SalRemrtnToPartnerFirm" |
| `TotalPrsumptvIncUs44E` | `PARTA_PL/TotalPrsumptvIncUs44E` | **YES** | COMPUTED | engine St("pl.TotalPrsumptvIncUs44E") / rc() green cell |
| `GrossReceipt` | `PARTA_PL/NoBooksOfAccPL/GrossReceipt` | **YES** | COMPUTED | engine St("pl.NoBooksOfAccPL.GrossReceipt") / rc() green cell |
| `GrsRcptAccPayeeOrBankMode` | `PARTA_PL/NoBooksOfAccPL/GrsRcptAccPayeeOrBankMode` | **YES** | INPUT | data-p="pl.pl.NoBooksOfAccPL.GrsRcptAccPayeeOrBankMode" |
| `GrsRcptOtherMode` | `PARTA_PL/NoBooksOfAccPL/GrsRcptOtherMode` | **YES** | INPUT | data-p="pl.pl.NoBooksOfAccPL.GrsRcptOtherMode" |
| `GrossProfit` | `PARTA_PL/NoBooksOfAccPL/GrossProfit` | **YES** | INPUT | data-p="pl.pl.NoBooksOfAccPL.GrossProfit" |
| `Expenses` | `PARTA_PL/NoBooksOfAccPL/Expenses` | **YES** | INPUT | data-p="pl.pl.NoBooksOfAccPL.Expenses" |
| `NetProfit` | `PARTA_PL/NoBooksOfAccPL/NetProfit` | **YES** | COMPUTED | engine St("pl.NoBooksOfAccPL.NetProfit") / rc() green cell |
| `GrossReceiptPrf` | `PARTA_PL/NoBooksOfAccPL/GrossReceiptPrf` | **YES** | COMPUTED | engine St("pl.NoBooksOfAccPL.GrossReceiptPrf") / rc() green cell |
| `GrsRcptAccPayeeOrBankModePrf` | `PARTA_PL/NoBooksOfAccPL/GrsRcptAccPayeeOrBankModePrf` | **YES** | INPUT | data-p="pl.pl.NoBooksOfAccPL.GrsRcptAccPayeeOrBankModePrf" |
| `GrsRcptOtherModePrf` | `PARTA_PL/NoBooksOfAccPL/GrsRcptOtherModePrf` | **YES** | INPUT | data-p="pl.pl.NoBooksOfAccPL.GrsRcptOtherModePrf" |
| `GrossProfitPrf` | `PARTA_PL/NoBooksOfAccPL/GrossProfitPrf` | **YES** | INPUT | data-p="pl.pl.NoBooksOfAccPL.GrossProfitPrf" |
| `ExpensesPrf` | `PARTA_PL/NoBooksOfAccPL/ExpensesPrf` | **YES** | INPUT | data-p="pl.pl.NoBooksOfAccPL.ExpensesPrf" |
| `NetProfitPrf` | `PARTA_PL/NoBooksOfAccPL/NetProfitPrf` | **YES** | COMPUTED | engine St("pl.NoBooksOfAccPL.NetProfitPrf") / rc() green cell |
| `TotBusinessProfession` | `PARTA_PL/NoBooksOfAccPL/TotBusinessProfession` | **YES** | COMPUTED | engine St("pl.NoBooksOfAccPL.TotBusinessProfession") / rc() green cell |
| `TurnverFrmSpecActivity` | `PARTA_PL/TurnverFrmSpecActivity` | **YES** | INPUT | data-p="pl.pl.TurnverFrmSpecActivity" |
| `GrossProfit` | `PARTA_PL/GrossProfit` | no | INPUT | data-p="pl.pl.GrossProfit" |
| `Expenditure` | `PARTA_PL/Expenditure` | no | INPUT | data-p="pl.pl.Expenditure" |
| `NetIncomeFrmSpecActivity` | `PARTA_PL/NetIncomeFrmSpecActivity` | **YES** | COMPUTED | engine St("pl.NetIncomeFrmSpecActivity") / rc() green cell |
| `Section` | `PARTA_PL/NonResidentPLDetails[]/Section` | no | INPUT | grid("pl.pl.NonResidentPLDetails") col Section (t:sel) -> data-p="pl.pl.NonResidentPLDetails.<i>.Section" |
| `GrossReceipt` | `PARTA_PL/NonResidentPLDetails[]/GrossReceipt` | no | INPUT | grid("pl.pl.NonResidentPLDetails") col GrossReceipt (t:num) -> data-p="pl.pl.NonResidentPLDetails.<i>.GrossReceipt" |
| `NetProfit` | `PARTA_PL/NonResidentPLDetails[]/NetProfit` | no | INPUT | grid("pl.pl.NonResidentPLDetails") col NetProfit (t:num) -> data-p="pl.pl.NonResidentPLDetails.<i>.NetProfit" |
| `GrossReceipt` | `PARTA_PL/NonResidentPL/GrossReceipt` | no | COMPUTED | engine St("pl.NonResidentPL.GrossReceipt") / rc() green cell |
| `NetProfit` | `PARTA_PL/NonResidentPL/NetProfit` | no | COMPUTED | engine St("pl.NonResidentPL.NetProfit") / rc() green cell |

## 3.5 · PARTA_OI — Other Information

State root `S.oi`; section file `forms/ITR-5/src/70_sec_oi.js`.

| leaf | schema path | required? | bucket | evidence |
| --- | --- | --- | --- | --- |
| `MethodOfAcct` | `PARTA_OI/MethodOfAcct` | block-REQ | INPUT | data-p="oi.MethodOfAcct" |
| `ChangeInAcctMethFlg` | `PARTA_OI/ChangeInAcctMethFlg` | block-REQ | INPUT | data-p="oi.ChangeInAcctMethFlg" |
| `ProfDeviatDueAcctMeth` | `PARTA_OI/ProfDeviatDueAcctMeth` | block-REQ | COMPUTED | engine St("ProfDeviatDueAcctMeth") / rc() green cell |
| `DecProOrIncLossUs145_2` | `PARTA_OI/DecProOrIncLossUs145_2` | block-REQ | COMPUTED | engine St("DecProOrIncLossUs145_2") / rc() green cell |
| `ValRawMaterial` | `PARTA_OI/MethodOfValClgStk/ValRawMaterial` | no | INPUT | data-p="oi.MethodOfValClgStk.ValRawMaterial" |
| `ValFinishedGoods` | `PARTA_OI/MethodOfValClgStk/ValFinishedGoods` | no | INPUT | data-p="oi.MethodOfValClgStk.ValFinishedGoods" |
| `ChngStockValMetFlg` | `PARTA_OI/MethodOfValClgStk/ChngStockValMetFlg` | no | INPUT | data-p="oi.MethodOfValClgStk.ChngStockValMetFlg" |
| `EffectOnPL` | `PARTA_OI/MethodOfValClgStk/EffectOnPL` | no | INPUT | data-p="oi.MethodOfValClgStk.EffectOnPL" |
| `DecProOrIncLossUs145_A` | `PARTA_OI/MethodOfValClgStk/DecProOrIncLossUs145_A` | no | INPUT | data-p="oi.MethodOfValClgStk.DecProOrIncLossUs145_A" |
| `Section28Items` | `PARTA_OI/NoCredToPLAmt/Section28Items` | block-REQ | INPUT | data-p="oi.NoCredToPLAmt.Section28Items" |
| `ProformaCreditsDue` | `PARTA_OI/NoCredToPLAmt/ProformaCreditsDue` | block-REQ | INPUT | data-p="oi.NoCredToPLAmt.ProformaCreditsDue" |
| `PrevYrEscalClaim` | `PARTA_OI/NoCredToPLAmt/PrevYrEscalClaim` | block-REQ | INPUT | data-p="oi.NoCredToPLAmt.PrevYrEscalClaim" |
| `OthItemInc` | `PARTA_OI/NoCredToPLAmt/OthItemInc` | block-REQ | INPUT | data-p="oi.NoCredToPLAmt.OthItemInc" |
| `CapReceipt` | `PARTA_OI/NoCredToPLAmt/CapReceipt` | block-REQ | INPUT | data-p="oi.NoCredToPLAmt.CapReceipt" |
| `TotNoCredToPLAmt` | `PARTA_OI/NoCredToPLAmt/TotNoCredToPLAmt` | block-REQ | COMPUTED | engine St("NoCredToPLAmt.TotNoCredToPLAmt") / rc() green cell |
| `StkInsurPrem` | `PARTA_OI/AmtDisallUs36/StkInsurPrem` | block-REQ | INPUT | data-p="oi.AmtDisallUs36.StkInsurPrem" |
| `EmpHealthInsurPrem` | `PARTA_OI/AmtDisallUs36/EmpHealthInsurPrem` | block-REQ | INPUT | data-p="oi.AmtDisallUs36.EmpHealthInsurPrem" |
| `EmpBonusCommSum` | `PARTA_OI/AmtDisallUs36/EmpBonusCommSum` | block-REQ | INPUT | data-p="oi.AmtDisallUs36.EmpBonusCommSum" |
| `IntOnBorrCap` | `PARTA_OI/AmtDisallUs36/IntOnBorrCap` | block-REQ | INPUT | data-p="oi.AmtDisallUs36.IntOnBorrCap" |
| `ZeroCoupBondDisc` | `PARTA_OI/AmtDisallUs36/ZeroCoupBondDisc` | block-REQ | INPUT | data-p="oi.AmtDisallUs36.ZeroCoupBondDisc" |
| `RecogPFContribAmt` | `PARTA_OI/AmtDisallUs36/RecogPFContribAmt` | block-REQ | INPUT | data-p="oi.AmtDisallUs36.RecogPFContribAmt" |
| `AppSuperAnnFundAmt` | `PARTA_OI/AmtDisallUs36/AppSuperAnnFundAmt` | block-REQ | INPUT | data-p="oi.AmtDisallUs36.AppSuperAnnFundAmt" |
| `PensionSchemeSec80CCD` | `PARTA_OI/AmtDisallUs36/PensionSchemeSec80CCD` | block-REQ | INPUT | data-p="oi.AmtDisallUs36.PensionSchemeSec80CCD" |
| `AppGratFundAmt` | `PARTA_OI/AmtDisallUs36/AppGratFundAmt` | block-REQ | INPUT | data-p="oi.AmtDisallUs36.AppGratFundAmt" |
| `OthFundAmt` | `PARTA_OI/AmtDisallUs36/OthFundAmt` | block-REQ | INPUT | data-p="oi.AmtDisallUs36.OthFundAmt" |
| `EmpContributionCredits` | `PARTA_OI/AmtDisallUs36/EmpContributionCredits` | block-REQ | INPUT | data-p="oi.AmtDisallUs36.EmpContributionCredits" |
| `BadDebtDoubtAmt` | `PARTA_OI/AmtDisallUs36/BadDebtDoubtAmt` | block-REQ | INPUT | data-p="oi.AmtDisallUs36.BadDebtDoubtAmt" |
| `BadDebtDoubtProvn` | `PARTA_OI/AmtDisallUs36/BadDebtDoubtProvn` | block-REQ | INPUT | data-p="oi.AmtDisallUs36.BadDebtDoubtProvn" |
| `SpecResrvTranfr` | `PARTA_OI/AmtDisallUs36/SpecResrvTranfr` | block-REQ | INPUT | data-p="oi.AmtDisallUs36.SpecResrvTranfr" |
| `FamPlanPromoExp` | `PARTA_OI/AmtDisallUs36/FamPlanPromoExp` | block-REQ | INPUT | data-p="oi.AmtDisallUs36.FamPlanPromoExp" |
| `SecuritiesPaidAmt` | `PARTA_OI/AmtDisallUs36/SecuritiesPaidAmt` | block-REQ | INPUT | data-p="oi.AmtDisallUs36.SecuritiesPaidAmt" |
| `MrktLossOthExpLossICDS` | `PARTA_OI/AmtDisallUs36/MrktLossOthExpLossICDS` | block-REQ | INPUT | data-p="oi.AmtDisallUs36.MrktLossOthExpLossICDS" |
| `ExpGovtApprovedSugarPrice` | `PARTA_OI/AmtDisallUs36/ExpGovtApprovedSugarPrice` | block-REQ | INPUT | data-p="oi.AmtDisallUs36.ExpGovtApprovedSugarPrice" |
| `AnyOthDisallowance` | `PARTA_OI/AmtDisallUs36/AnyOthDisallowance` | block-REQ | INPUT | data-p="oi.AmtDisallUs36.AnyOthDisallowance" |
| `TotAmtDisallUs36` | `PARTA_OI/AmtDisallUs36/TotAmtDisallUs36` | block-REQ | COMPUTED | engine St("AmtDisallUs36.TotAmtDisallUs36") / rc() green cell |
| `DeployedInIndia` | `PARTA_OI/AmtDisallUs36/NoOfEmployeesEmployed/DeployedInIndia` | no | INPUT | data-p="oi.AmtDisallUs36.NoOfEmployeesEmployed.DeployedInIndia" |
| `DeployedOutSideIndia` | `PARTA_OI/AmtDisallUs36/NoOfEmployeesEmployed/DeployedOutSideIndia` | no | INPUT | data-p="oi.AmtDisallUs36.NoOfEmployeesEmployed.DeployedOutSideIndia" |
| `Total` | `PARTA_OI/AmtDisallUs36/NoOfEmployeesEmployed/Total` | no | COMPUTED | engine St("AmtDisallUs36.NoOfEmployeesEmployed.Total") / rc() green cell |
| `CapitalNatureExp` | `PARTA_OI/AmtDisallUs37/CapitalNatureExp` | block-REQ | INPUT | data-p="oi.AmtDisallUs37.CapitalNatureExp" |
| `PersonalExp` | `PARTA_OI/AmtDisallUs37/PersonalExp` | block-REQ | INPUT | data-p="oi.AmtDisallUs37.PersonalExp" |
| `BusOrProfessnExp` | `PARTA_OI/AmtDisallUs37/BusOrProfessnExp` | block-REQ | INPUT | data-p="oi.AmtDisallUs37.BusOrProfessnExp" |
| `PoliticPartyExp` | `PARTA_OI/AmtDisallUs37/PoliticPartyExp` | block-REQ | INPUT | data-p="oi.AmtDisallUs37.PoliticPartyExp" |
| `LawVoilatPenalExp` | `PARTA_OI/AmtDisallUs37/LawVoilatPenalExp` | block-REQ | INPUT | data-p="oi.AmtDisallUs37.LawVoilatPenalExp" |
| `OthPenalFineExp` | `PARTA_OI/AmtDisallUs37/OthPenalFineExp` | block-REQ | INPUT | data-p="oi.AmtDisallUs37.OthPenalFineExp" |
| `OffenceExp` | `PARTA_OI/AmtDisallUs37/OffenceExp` | block-REQ | INPUT | data-p="oi.AmtDisallUs37.OffenceExp" |
| `ContigentLiability` | `PARTA_OI/AmtDisallUs37/ContigentLiability` | block-REQ | INPUT | data-p="oi.AmtDisallUs37.ContigentLiability" |
| `OthAmtNotAllowUs37` | `PARTA_OI/AmtDisallUs37/OthAmtNotAllowUs37` | block-REQ | INPUT | data-p="oi.AmtDisallUs37.OthAmtNotAllowUs37" |
| `TotAmtDisallUs37` | `PARTA_OI/AmtDisallUs37/TotAmtDisallUs37` | block-REQ | COMPUTED | engine St("AmtDisallUs37.TotAmtDisallUs37") / rc() green cell |
| `NonCompChapXVIIBAmt` | `PARTA_OI/AmtDisallUs40/NonCompChapXVIIBAmt` | block-REQ | INPUT | data-p="oi.AmtDisallUs40.NonCompChapXVIIBAmt" |
| `NonComp40aiiChapXVIIBAmt` | `PARTA_OI/AmtDisallUs40/NonComp40aiiChapXVIIBAmt` | block-REQ | INPUT | data-p="oi.AmtDisallUs40.NonComp40aiiChapXVIIBAmt" |
| `NonComp40aibChapXVIIBAmt` | `PARTA_OI/AmtDisallUs40/NonComp40aibChapXVIIBAmt` | block-REQ | INPUT | data-p="oi.AmtDisallUs40.NonComp40aibChapXVIIBAmt" |
| `NonComp40aiiiChapXVIIBAmt` | `PARTA_OI/AmtDisallUs40/NonComp40aiiiChapXVIIBAmt` | block-REQ | INPUT | data-p="oi.AmtDisallUs40.NonComp40aiiiChapXVIIBAmt" |
| `TaxAmtOnProfits` | `PARTA_OI/AmtDisallUs40/TaxAmtOnProfits` | block-REQ | INPUT | data-p="oi.AmtDisallUs40.TaxAmtOnProfits" |
| `WTAmt` | `PARTA_OI/AmtDisallUs40/WTAmt` | block-REQ | INPUT | data-p="oi.AmtDisallUs40.WTAmt" |
| `RolyatyOrServiceFee` | `PARTA_OI/AmtDisallUs40/RolyatyOrServiceFee` | block-REQ | INPUT | data-p="oi.AmtDisallUs40.RolyatyOrServiceFee" |
| `IntSalBonPartner` | `PARTA_OI/AmtDisallUs40/IntSalBonPartner` | block-REQ | INPUT | data-p="oi.AmtDisallUs40.IntSalBonPartner" |
| `AnyOthDisallowance` | `PARTA_OI/AmtDisallUs40/AnyOthDisallowance` | block-REQ | INPUT | data-p="oi.AmtDisallUs40.AnyOthDisallowance" |
| `TotAmtDisallUs40` | `PARTA_OI/AmtDisallUs40/TotAmtDisallUs40` | block-REQ | COMPUTED | engine St("AmtDisallUs40.TotAmtDisallUs40") / rc() green cell |
| `AnyAmtOfSec40AllowPrevYr` | `PARTA_OI/AmtDisallUs40/AnyAmtOfSec40AllowPrevYr` | block-REQ | INPUT | data-p="oi.AmtDisallUs40.AnyAmtOfSec40AllowPrevYr" |
| `AmtPaidUs40A2b` | `PARTA_OI/AmtDisallUs40A/AmtPaidUs40A2b` | block-REQ | INPUT | data-p="oi.AmtDisallUs40A.AmtPaidUs40A2b" |
| `AmtGT20kCash` | `PARTA_OI/AmtDisallUs40A/AmtGT20kCash` | block-REQ | INPUT | data-p="oi.AmtDisallUs40A.AmtGT20kCash" |
| `ProvPmtGrat` | `PARTA_OI/AmtDisallUs40A/ProvPmtGrat` | block-REQ | INPUT | data-p="oi.AmtDisallUs40A.ProvPmtGrat" |
| `ContToSetupTrust` | `PARTA_OI/AmtDisallUs40A/ContToSetupTrust` | block-REQ | INPUT | data-p="oi.AmtDisallUs40A.ContToSetupTrust" |
| `AnyOthDisallowance` | `PARTA_OI/AmtDisallUs40A/AnyOthDisallowance` | block-REQ | INPUT | data-p="oi.AmtDisallUs40A.AnyOthDisallowance" |
| `TotAmtDisallUs40A` | `PARTA_OI/AmtDisallUs40A/TotAmtDisallUs40A` | block-REQ | COMPUTED | engine St("AmtDisallUs40A.TotAmtDisallUs40A") / rc() green cell |
| `TaxDutyCesAmt` | `PARTA_OI/AmtDisallUs43BPyNowAll/AmtUs43B/TaxDutyCesAmt` | block-REQ | INPUT | data-p="oi.AmtDisallUs43BPyNowAll.AmtUs43B.TaxDutyCesAmt" |
| `ContToEmpPFSFGF` | `PARTA_OI/AmtDisallUs43BPyNowAll/AmtUs43B/ContToEmpPFSFGF` | block-REQ | INPUT | data-p="oi.AmtDisallUs43BPyNowAll.AmtUs43B.ContToEmpPFSFGF" |
| `EmpBonusComm` | `PARTA_OI/AmtDisallUs43BPyNowAll/AmtUs43B/EmpBonusComm` | block-REQ | INPUT | data-p="oi.AmtDisallUs43BPyNowAll.AmtUs43B.EmpBonusComm" |
| `IntPayaleToFI` | `PARTA_OI/AmtDisallUs43BPyNowAll/AmtUs43B/IntPayaleToFI` | block-REQ | INPUT | data-p="oi.AmtDisallUs43BPyNowAll.AmtUs43B.IntPayaleToFI" |
| `SumPayaleLoanBrToFinComp` | `PARTA_OI/AmtDisallUs43BPyNowAll/AmtUs43B/SumPayaleLoanBrToFinComp` | block-REQ | INPUT | data-p="oi.AmtDisallUs43BPyNowAll.AmtUs43B.SumPayaleLoanBrToFinComp" |
| `IntPayaleToFISchBank` | `PARTA_OI/AmtDisallUs43BPyNowAll/AmtUs43B/IntPayaleToFISchBank` | block-REQ | INPUT | data-p="oi.AmtDisallUs43BPyNowAll.AmtUs43B.IntPayaleToFISchBank" |
| `LeaveEncashPayable` | `PARTA_OI/AmtDisallUs43BPyNowAll/AmtUs43B/LeaveEncashPayable` | block-REQ | INPUT | data-p="oi.AmtDisallUs43BPyNowAll.AmtUs43B.LeaveEncashPayable" |
| `RailwayAsstsPyble` | `PARTA_OI/AmtDisallUs43BPyNowAll/AmtUs43B/RailwayAsstsPyble` | no | INPUT | data-p="oi.AmtDisallUs43BPyNowAll.AmtUs43B.RailwayAsstsPyble" |
| `MSEPayable` | `PARTA_OI/AmtDisallUs43BPyNowAll/AmtUs43B/MSEPayable` | no | INPUT | data-p="oi.AmtDisallUs43BPyNowAll.AmtUs43B.MSEPayable" |
| `TotAmtUs43b` | `PARTA_OI/AmtDisallUs43BPyNowAll/AmtUs43B/TotAmtUs43b` | block-REQ | COMPUTED | engine St("AmtDisallUs43BPyNowAll.AmtUs43B.TotAmtUs43b") / rc() green cell |
| `TaxDutyCesAmt` | `PARTA_OI/AmtDisall43B/AmtUs43B/TaxDutyCesAmt` | block-REQ | INPUT | data-p="oi.AmtDisall43B.AmtUs43B.TaxDutyCesAmt" |
| `ContToEmpPFSFGF` | `PARTA_OI/AmtDisall43B/AmtUs43B/ContToEmpPFSFGF` | block-REQ | INPUT | data-p="oi.AmtDisall43B.AmtUs43B.ContToEmpPFSFGF" |
| `EmpBonusComm` | `PARTA_OI/AmtDisall43B/AmtUs43B/EmpBonusComm` | block-REQ | INPUT | data-p="oi.AmtDisall43B.AmtUs43B.EmpBonusComm" |
| `IntPayaleToFI` | `PARTA_OI/AmtDisall43B/AmtUs43B/IntPayaleToFI` | block-REQ | INPUT | data-p="oi.AmtDisall43B.AmtUs43B.IntPayaleToFI" |
| `SumPayaleLoanBrToFinComp` | `PARTA_OI/AmtDisall43B/AmtUs43B/SumPayaleLoanBrToFinComp` | block-REQ | INPUT | data-p="oi.AmtDisall43B.AmtUs43B.SumPayaleLoanBrToFinComp" |
| `IntPayaleToFISchBank` | `PARTA_OI/AmtDisall43B/AmtUs43B/IntPayaleToFISchBank` | block-REQ | INPUT | data-p="oi.AmtDisall43B.AmtUs43B.IntPayaleToFISchBank" |
| `LeaveEncashPayable` | `PARTA_OI/AmtDisall43B/AmtUs43B/LeaveEncashPayable` | block-REQ | INPUT | data-p="oi.AmtDisall43B.AmtUs43B.LeaveEncashPayable" |
| `RailwayAsstsPyble` | `PARTA_OI/AmtDisall43B/AmtUs43B/RailwayAsstsPyble` | no | INPUT | data-p="oi.AmtDisall43B.AmtUs43B.RailwayAsstsPyble" |
| `MSEPayable` | `PARTA_OI/AmtDisall43B/AmtUs43B/MSEPayable` | no | INPUT | data-p="oi.AmtDisall43B.AmtUs43B.MSEPayable" |
| `TotAmtUs43b` | `PARTA_OI/AmtDisall43B/AmtUs43B/TotAmtUs43b` | block-REQ | COMPUTED | engine St("AmtDisall43B.AmtUs43B.TotAmtUs43b") / rc() green cell |
| `UnionExciseDuty` | `PARTA_OI/AmtExciseCustomsVATOutstanding/ExciseCustomsVAT/UnionExciseDuty` | block-REQ | INPUT | data-p="oi.AmtExciseCustomsVATOutstanding.ExciseCustomsVAT.UnionExciseDuty" |
| `ServiceTax` | `PARTA_OI/AmtExciseCustomsVATOutstanding/ExciseCustomsVAT/ServiceTax` | block-REQ | INPUT | data-p="oi.AmtExciseCustomsVATOutstanding.ExciseCustomsVAT.ServiceTax" |
| `VATorSaleTax` | `PARTA_OI/AmtExciseCustomsVATOutstanding/ExciseCustomsVAT/VATorSaleTax` | block-REQ | INPUT | data-p="oi.AmtExciseCustomsVATOutstanding.ExciseCustomsVAT.VATorSaleTax" |
| `CentralGoodServiceTax` | `PARTA_OI/AmtExciseCustomsVATOutstanding/ExciseCustomsVAT/CentralGoodServiceTax` | block-REQ | INPUT | data-p="oi.AmtExciseCustomsVATOutstanding.ExciseCustomsVAT.CentralGoodServiceTax" |
| `StateGoodServiceTax` | `PARTA_OI/AmtExciseCustomsVATOutstanding/ExciseCustomsVAT/StateGoodServiceTax` | block-REQ | INPUT | data-p="oi.AmtExciseCustomsVATOutstanding.ExciseCustomsVAT.StateGoodServiceTax" |
| `IntegratedGoodServiceTax` | `PARTA_OI/AmtExciseCustomsVATOutstanding/ExciseCustomsVAT/IntegratedGoodServiceTax` | block-REQ | INPUT | data-p="oi.AmtExciseCustomsVATOutstanding.ExciseCustomsVAT.IntegratedGoodServiceTax" |
| `UnionTerrGoodServiceTax` | `PARTA_OI/AmtExciseCustomsVATOutstanding/ExciseCustomsVAT/UnionTerrGoodServiceTax` | block-REQ | INPUT | data-p="oi.AmtExciseCustomsVATOutstanding.ExciseCustomsVAT.UnionTerrGoodServiceTax" |
| `OthDutyTaxCess` | `PARTA_OI/AmtExciseCustomsVATOutstanding/ExciseCustomsVAT/OthDutyTaxCess` | block-REQ | INPUT | data-p="oi.AmtExciseCustomsVATOutstanding.ExciseCustomsVAT.OthDutyTaxCess" |
| `TotExciseCustomsVAT` | `PARTA_OI/AmtExciseCustomsVATOutstanding/ExciseCustomsVAT/TotExciseCustomsVAT` | block-REQ | COMPUTED | engine St("AmtExciseCustomsVATOutstanding.ExciseCustomsVAT.TotExciseCustomsVAT") / rc() green cell |
| `DeemedProfUs33ABs` | `PARTA_OI/DeemedProfUs33ABs` | block-REQ | COMPUTED | engine St("DeemedProfUs33ABs") / rc() green cell |
| `DeemedProfUs33AB` | `PARTA_OI/DeemedProfUs33AB` | no | INPUT | data-p="oi.DeemedProfUs33AB" |
| `DeemedProfUs33ABA` | `PARTA_OI/DeemedProfUs33ABA` | no | INPUT | data-p="oi.DeemedProfUs33ABA" |
| `DeemedProfUs33AC` | `PARTA_OI/DeemedProfUs33AC` | no | INPUT | data-p="oi.DeemedProfUs33AC" |
| `ProfTaxAmtUs41` | `PARTA_OI/ProfTaxAmtUs41` | block-REQ | INPUT | data-p="oi.ProfTaxAmtUs41" |
| `PriorAmtIncCrDrPL` | `PARTA_OI/PriorAmtIncCrDrPL` | block-REQ | INPUT | data-p="oi.PriorAmtIncCrDrPL" |
| `AmountOfExpDisAllwUs14A` | `PARTA_OI/AmountOfExpDisAllwUs14A` | block-REQ | INPUT | data-p="oi.AmountOfExpDisAllwUs14A" |
| `InterestDisAllowUs23SMEAct` | `PARTA_OI/InterestDisAllowUs23SMEAct` | no | INPUT | data-p="oi.InterestDisAllowUs23SMEAct" |
| `ScheduleTPSAFlg` | `PARTA_OI/ScheduleTPSAFlg` | block-REQ | INPUT | data-p="oi.ScheduleTPSAFlg" |

## 3.6 · PARTA_QD — Quantitative Details

State root `S.qd`; section file `forms/ITR-5/src/70_sec_oi.js`.

| leaf | schema path | required? | bucket | evidence |
| --- | --- | --- | --- | --- |
| `ItemName` | `PARTA_QD/TradingConcern/QuantitDet[]/ItemName` | row-REQ | INPUT | grid("qd.trd") col ItemName (t:txt) -> data-p="qd.trd.<i>.ItemName" |
| `UnitOfMeasure` | `PARTA_QD/TradingConcern/QuantitDet[]/UnitOfMeasure` | row-REQ | INPUT | grid("qd.trd") col UnitOfMeasure (t:sel) -> data-p="qd.trd.<i>.UnitOfMeasure" |
| `OpeningStock` | `PARTA_QD/TradingConcern/QuantitDet[]/OpeningStock` | row-REQ | INPUT | grid("qd.trd") col OpeningStock (t:num) -> data-p="qd.trd.<i>.OpeningStock" |
| `PurchaseQty` | `PARTA_QD/TradingConcern/QuantitDet[]/PurchaseQty` | row-REQ | INPUT | grid("qd.trd") col PurchaseQty (t:num) -> data-p="qd.trd.<i>.PurchaseQty" |
| `SaleQty` | `PARTA_QD/TradingConcern/QuantitDet[]/SaleQty` | row-REQ | INPUT | grid("qd.trd") col SaleQty (t:num) -> data-p="qd.trd.<i>.SaleQty" |
| `ClgStock` | `PARTA_QD/TradingConcern/QuantitDet[]/ClgStock` | row-REQ | INPUT | grid("qd.trd") col ClgStock (t:num) -> data-p="qd.trd.<i>.ClgStock" |
| `AnyShortExces` | `PARTA_QD/TradingConcern/QuantitDet[]/AnyShortExces` | row-REQ | INPUT | grid("qd.trd") col AnyShortExces (t:num) -> data-p="qd.trd.<i>.AnyShortExces" |
| `ItemName` | `PARTA_QD/ManfactrConcern/RawMaterial/QuantitDet[]/ItemName` | row-REQ | INPUT | grid("qd.raw") col ItemName (t:txt) -> data-p="qd.raw.<i>.ItemName" |
| `UnitOfMeasure` | `PARTA_QD/ManfactrConcern/RawMaterial/QuantitDet[]/UnitOfMeasure` | row-REQ | INPUT | grid("qd.raw") col UnitOfMeasure (t:sel) -> data-p="qd.raw.<i>.UnitOfMeasure" |
| `OpeningStock` | `PARTA_QD/ManfactrConcern/RawMaterial/QuantitDet[]/OpeningStock` | row-REQ | INPUT | grid("qd.raw") col OpeningStock (t:num) -> data-p="qd.raw.<i>.OpeningStock" |
| `PurchaseQty` | `PARTA_QD/ManfactrConcern/RawMaterial/QuantitDet[]/PurchaseQty` | row-REQ | INPUT | grid("qd.raw") col PurchaseQty (t:num) -> data-p="qd.raw.<i>.PurchaseQty" |
| `PrevYrConsum` | `PARTA_QD/ManfactrConcern/RawMaterial/QuantitDet[]/PrevYrConsum` | no | INPUT | grid("qd.raw") col PrevYrConsum (t:num) -> data-p="qd.raw.<i>.PrevYrConsum" |
| `SaleQty` | `PARTA_QD/ManfactrConcern/RawMaterial/QuantitDet[]/SaleQty` | row-REQ | INPUT | grid("qd.raw") col SaleQty (t:num) -> data-p="qd.raw.<i>.SaleQty" |
| `ClgStock` | `PARTA_QD/ManfactrConcern/RawMaterial/QuantitDet[]/ClgStock` | row-REQ | INPUT | grid("qd.raw") col ClgStock (t:num) -> data-p="qd.raw.<i>.ClgStock" |
| `yldFinisProd` | `PARTA_QD/ManfactrConcern/RawMaterial/QuantitDet[]/yldFinisProd` | no | INPUT | grid("qd.raw") col yldFinisProd (t:num) -> data-p="qd.raw.<i>.yldFinisProd" |
| `PercentYld` | `PARTA_QD/ManfactrConcern/RawMaterial/QuantitDet[]/PercentYld` | no | INPUT | grid("qd.raw") col PercentYld (t:num) -> data-p="qd.raw.<i>.PercentYld" |
| `AnyShortExces` | `PARTA_QD/ManfactrConcern/RawMaterial/QuantitDet[]/AnyShortExces` | row-REQ | INPUT | grid("qd.raw") col AnyShortExces (t:num) -> data-p="qd.raw.<i>.AnyShortExces" |
| `ItemName` | `PARTA_QD/ManfactrConcern/FinishrByProd/QuantitDet[]/ItemName` | row-REQ | INPUT | grid("qd.fin") col ItemName (t:txt) -> data-p="qd.fin.<i>.ItemName" |
| `UnitOfMeasure` | `PARTA_QD/ManfactrConcern/FinishrByProd/QuantitDet[]/UnitOfMeasure` | row-REQ | INPUT | grid("qd.fin") col UnitOfMeasure (t:sel) -> data-p="qd.fin.<i>.UnitOfMeasure" |
| `OpeningStock` | `PARTA_QD/ManfactrConcern/FinishrByProd/QuantitDet[]/OpeningStock` | row-REQ | INPUT | grid("qd.fin") col OpeningStock (t:num) -> data-p="qd.fin.<i>.OpeningStock" |
| `PurchaseQty` | `PARTA_QD/ManfactrConcern/FinishrByProd/QuantitDet[]/PurchaseQty` | row-REQ | INPUT | grid("qd.fin") col PurchaseQty (t:num) -> data-p="qd.fin.<i>.PurchaseQty" |
| `PrevyrManfact` | `PARTA_QD/ManfactrConcern/FinishrByProd/QuantitDet[]/PrevyrManfact` | no | INPUT | grid("qd.fin") col PrevyrManfact (t:num) -> data-p="qd.fin.<i>.PrevyrManfact" |
| `SaleQty` | `PARTA_QD/ManfactrConcern/FinishrByProd/QuantitDet[]/SaleQty` | row-REQ | INPUT | grid("qd.fin") col SaleQty (t:num) -> data-p="qd.fin.<i>.SaleQty" |
| `ClgStock` | `PARTA_QD/ManfactrConcern/FinishrByProd/QuantitDet[]/ClgStock` | row-REQ | INPUT | grid("qd.fin") col ClgStock (t:num) -> data-p="qd.fin.<i>.ClgStock" |
| `AnyShortExces` | `PARTA_QD/ManfactrConcern/FinishrByProd/QuantitDet[]/AnyShortExces` | row-REQ | INPUT | grid("qd.fin") col AnyShortExces (t:num) -> data-p="qd.fin.<i>.AnyShortExces" |

## 4 · ORPHANS

**None.** No leaf in `PARTA_BS`, `PARTA_PL`, `ManufacturingAccount`, `TradingAccount`,
`PARTA_OI` or `PARTA_QD` is unreachable: all 463 are either typed on screen or computed by the
engine and written by the export.

Required-leaf orphans: **0** — the case the brief calls critical does not occur in these blocks.

## 5 · `PARTA_OL` does not exist in the ITR-5 schema

`PARTA_OL` was on the assignment list but there is no such block. `ITR5.properties` contains
exactly four `PARTA_*` blocks — `PARTA_BS`, `PARTA_PL`, `PARTA_OI`, `PARTA_QD` — and a grep for
`"PARTA_OL"` across the whole schema returns nothing. `ITR5.required` is
`[CreationInfo, Form_ITR5, PartA_GEN1, PartA_GEN2, PARTA_BS, PARTA_PL, CorpScheduleBP, PartB-TI,
PartB_TTI, Verification]` — `PARTA_OL` is not there either.

Nothing is missing from the software: there are zero leaves to cover. The block is an ITR-6/7
concept that ITR-5 does not carry. It should be struck from the block list so a later audit does
not re-open it.

## 6 · Export-completeness defects on row-required leaves (NOT orphans — act on these)

These leaves are correctly classified INPUT: the user can type them. The defect is that the export
can drop them from a row the user did fill, producing a row that violates the array item's
`required[]`. The portal rejects the JSON; the leaf census does not catch this, so it is reported
separately.

### 6a · Quantitative Details rows lose every untouched required column

`_oiNode(o)` (`70_sec_oi.js:318`) copies **only the keys already present on the row object**:
`for(const k in o){const cv=_oiVal(k,o[k]); if(cv!==undefined)out[k]=cv;}`.

A new grid row is seeded `{}` — the `data-add` handler's `SEED` map
(`Yukti_ITR5.html:17540`) has no entry for `qd.trd` / `qd.raw` / `qd.fin`, and its suffix fallback
(`trd` / `raw` / `fin`) has none either. A key only comes into existence when `commit()`
(`:17488`) fires, and `commit()` fires on the `input` event — i.e. only for fields the user
actually types into. Rendering a blank input does not create the key.

So a user who adds a trading-concern item, names it, picks a unit and leaves *Shortage/excess*
blank — the normal case, since it is usually nil — exports
`{"ItemName":"Steel","UnitOfMeasure":"109",…}` with `AnyShortExces` **absent**, against
`TradingConcernQD.required = [ItemName, UnitOfMeasure, OpeningStock, PurchaseQty, SaleQty,
ClgStock, AnyShortExces]`. Same for all three grids (`RawMaterialQD`, `FinishrByProdQD`).

`chkOi()` (`70_sec_oi.js:435`) does not catch it: it validates `ItemName` length/characters and
that `UnitOfMeasure` is set, plus `PercentYld` range — none of the five numeric required columns.

Fix: seed QD rows with all required keys at 0/"" in the `SEED` map, or have `_qdArr` fill the
item's required keys before `_oiNode`.

### 6b · P&L grid rows drop required leaves whose value is zero

`_plNode` (`70_sec_pl.js:580`) drops any leaf that coerces to `0` or `""`:
`else{const cv=_plLeaf(k,v); if(cv!==undefined&&cv!==0)out[k]=cv;}`. For scalar optional leaves
that is correct. For **array rows it is not**, because the row keys are required:

| array | required row keys that vanish at 0 / blank |
| --- | --- |
| `TradingAccount/OtherOperatingRevenueDtls[]` | `OperatingRevenueAmt` |
| `TradingAccount/OtherDirectExpenses[]` | `Amount` |
| `PARTA_PL/CreditsToPL/OthIncome/OtherIncDtls[]` | `Amount` |
| `PARTA_PL/DebitsToPL/DebitPlAcnt/OtherExpensesDtls[]` | `Amount` |
| `PARTA_PL/DebitsToPL/DebitPlAcnt/BadDebtDtls/BadDebtAmtDtls[]` | `PAN`, `Amount` |
| `PARTA_PL/DebitsToPL/DebitPlAcnt/BadDebtDtls/OthersPANNotAvlblDtl[]` | `Name`, `FlatDoorBlockNumber`, `AreaLocality`, `TownCityDistrict`, `StateCode`, `CountryCode`, `Amount` |
| `PARTA_PL/NatOfBus44AD[]` / `44ADA[]` / `44AE[]` | `NameOfBusiness`, `CodeAD`/`CodeADA`/`CodeAE` |
| `PARTA_PL/GoodsDtlsUs44AE[]` | `TonnageCapacity`, `HoldingPeriod`, `PresumptiveIncome` |

`GoodsDtlsUs44AE` is the sharpest case: `PresumptiveIncome` is computed
(`70_sec_pl.js:189`, `set("pl."+p("GoodsDtlsUs44AE")+"."+i+".PresumptiveIncome", R(pi))`) and is
row-required, but a carriage row entered before the tonnage/months are typed computes `pi = 0`,
and `_plNode` then deletes the required key. `chkPl()` (`70_sec_pl.js:631`) checks duplicate
registration numbers and the 120-month cap, but never that a row carries its required keys.

Fix: exempt array rows from the `cv!==0` drop, or fill the item's `required[]` after `_plNode`.

## 7 · Book rows with no schema leaf (the inverse of an orphan — for completeness)

Two rows exist in the CBDT utility but have no leaf anywhere in the schema, so they are outside
this census. Both are already handled deliberately and documented in the section sources:

- **Part A-BS r115, "Provision for Wealth Tax"** — hidden in the utility, no schema key.
  `books/ITR-5/BALANCE_SHEET.md:263` and `:287` ("Never build r115 — hidden, no schema key");
  `Provisions` carries only `ITProvision`, `ELSuperAnnGratProvision`, `OthProvision`,
  `TotProvisions`, confirmed against the schema. Correctly not built (`70_sec_bs.js` header note).
- **Part A-OI row 9e, MTM / other expected loss u/s 40A(13)** — `books/ITR-5/PART_A_OI.md:128`
  and `:258`: `AmtDisallUs40A` has six keys for seven visible lines. The form omits the row and
  excludes it from the 9g total (`70_sec_oi.js:222`, `OI_40A` = 5 keys, plus an on-screen note
  saying so). **Worth a CEO decision:** the utility's 9g is `SUM(J70:J75)` and *does* include
  J74, so for an assessee with a 40A(13) MTM loss the form's 9g will be lower than the utility's.
  The book flags this "for the form-builder / schema owner" and it has not been resolved.

## 8 · Method / reproducibility

1. Leaves enumerated from the schema with `$ref` and `allOf` resolved and cycle guarding
   (the schema uses 858 `$ref` and 397 `allOf`; no `oneOf`/`anyOf`/`patternProperties`).
2. For each leaf the schema path was mapped to its state path — `S.bs` mirrors `PARTA_BS`,
   `S.pl.mfg`/`S.pl.trd`/`S.pl.pl` mirror `ManufacturingAccount`/`TradingAccount`/`PARTA_PL`,
   `S.oi` mirrors `PARTA_OI`, `S.qd.trd`/`raw`/`fin` hold the `PARTA_QD` grids — then searched
   for a writer in the section source.
3. Every non-literal path argument in all `ri()` / `rc()` / `rsel()` / `trip()` call sites was
   enumerated and resolved by hand (local `const d` / `rt` / `tp` prefixes, the `p()` wrapper in
   `engPl`, and the `OI_*` loop arrays), so no leaf was classified on a partial regex match.
4. Cross-section feeds were confirmed to have a real producer, not just a consumer: PARTA_OI 3a/3b
   read `S.C.icds`, published by `70_sec_bp.js:226`, with the ordering documented at
   `90_wiring.js:31`.

