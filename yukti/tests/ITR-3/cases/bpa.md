# bpa — hand-traced case (Business, Part A accounts)

Section `bpa`, compute order 20. Blocks: ManufacturingAccount, TradingAccount,
PARTA_PL, PARTA_BS, PARTA_OI, PARTA_QD, ScheduleGST, PartA_GEN2 (NatOfBus).

## Regime note
No item in Part A accounts is closed by the new regime (REGIME.md: "all income
heads and their computation stay open"). The engine and renderer behave
identically for `S.fs.optout="No"` (new) and `="Yes"` (old); verified both.

## Head roll-up note
`S.C.bpa.income = 0`. Part A accounts feed **Schedule BP** (section `bp`), which
computes the PGBP head (`IncChrgUnHdProftGain`) and rolls it into GTI. Setting
`bpa.income` to the P&L/presumptive figure would double-count against `bp`, so
bpa contributes nothing directly and instead exposes feeds on `S.C.bpa.*`
(grossProfitTrading, pbt, presAD/presADA/presAE, costOfGoodsPrdcd,
factoryDepreciation, specNet, nrNet, noBooksProfit, incm40B, tot43BNowAllow,
profTaxUs41, priorPeriod, …).

## Case: small trader, regular books (new regime)

Inputs
- Trading: Sale of goods 10,00,000; Other operating revenue "Scrap" 50,000;
  Closing stock 2,00,000; Opening stock 1,50,000; Purchases 6,00,000;
  Carriage inward 20,000; Power & fuel 10,000; Other direct expense "misc" 5,000.
- P&L: Other income Rent 30,000; Salaries & wages 80,000; Freight 10,000;
  Depreciation 25,000.
- Balance sheet: Proprietor's capital 5,00,000; Gross block 3,00,000,
  Depreciation 50,000; Cash-in-hand 2,50,000.

### Trading Account (Trading_Account.md)
- 4A(iiic) OperatingRevenueTotal = 50,000 = Σ other operating revenue.  (K14)
- 4A(iv)  SalesGrossReceiptsTotal = 10,00,000 + 0 + 50,000 = **10,50,000**.  (N15)
- 4D      TotRevenueFrmOperations = 10,50,000 + 0 (profession) + 0 (4Cix) = 10,50,000.  (N27)
- credits TardingAccTotCred = 10,50,000 + 2,00,000 = **12,50,000**.  (N29)
- 9iii    DirectExpensesTotal = 5,000 (other direct).  (K41)
- 8       DirectExpenses = 20,000 + 10,000 + 5,000 = **35,000**.  (N32)
- 10xii   duties on purchases = 0.  (N54)
- 11      GoodsCostPrdcdFrmMA = 0 (no manufacturing account).  (N55)
- 12      GrossProfitFrmBusProf = 12,50,000 − 1,50,000 − 6,00,000 − 35,000 − 0 − 0
          = **4,65,000**.  (N56 = credits − 6 − 7 − 8 − 10xii − 11)

### Profit & Loss (Profit_and_Loss.md)
- 13 GrossProfitTrnsfFrmTrdAcc = 4,65,000 + 12b(0) + 12d(0) = **4,65,000**.  (L4)
- 14xii TotOthIncome = Rent 30,000 (all other heads 0) = **30,000**.  (L27)
- 15 TotCreditsToPL = 4,65,000 + 30,000 = **4,95,000**.  (L28)
- 50 PBIDTA = 4,95,000 − (Freight 10,000 + SalsWages 80,000) = **4,05,000**.  (L127)
- 53 PBT = 4,05,000 − interest 0 − depreciation 25,000 = **3,80,000**.  (L133)

### Balance Sheet (Part_A_BS.md)
- 5 TotFundSrc = PropCap 5,00,000 + loans 0 + deferred 0 + advances 0 = **5,00,000**.  (L31)
- Net block = MAX(0, 3,00,000 − 50,000) = 2,50,000.  (J35)
- Total current assets = cash 2,50,000.  (L63)
- 6 TotFundApply = 2,50,000 (fixed) + 0 (inv) + 2,50,000 (net current) + 0 = **5,00,000**.  (L89)
- A52 cross-check: 5,00,000 == 5,00,000 → balances (no error).

### Feeds / export
- `S.C.bpa.income = 0`; `grossProfitTrading = 4,65,000`; `pbt = 3,80,000`.
- Export: `TradingAccount.GrossProfitFrmBusProf = 465000`,
  `PARTA_PL.DebitsToPL.PBT = 380000` (typeof number), `PARTA_BS.FundSrc.TotFundSrc = 500000`;
  `ManufacturingAccount` omitted (no data); array amounts coerced to integers.
- `chkBpa()` returns [] for this clean, balanced case.
- Round-trip (exp → imp → exp) is byte-identical for TradingAccount, PARTA_PL, PARTA_BS.

Every figure above was reproduced to the rupee by `engBpa()` (traced via a node
VM harness against the assembled file). `node --check` passes.
