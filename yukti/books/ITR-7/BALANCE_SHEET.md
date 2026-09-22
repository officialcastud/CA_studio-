# The book of Part A — Balance Sheet · ITR-7, A.Y. 2026-27

Read row by row from the utility's **BALANCE SHEET** sheet (rows 3–59, four
hidden) and confirmed against the CBDT ITR-7 schema block **`PARTA_BS`**
(`ITRForm:PartA_BS`). Every label, item letter and formula below is the
department's own.

The sheet's own heading (F3): *"Consolidated Balance Sheet as on 31st day of
March, 2026 [to be mandatorily filled in by all persons filing ITR-7]."* This is
the fund-accounting balance sheet of a charitable/religious trust or institution
— **Sources of Funds** on one side (own corpus funds + loans + advances),
**Application of Funds** on the other (fixed assets + investments + net current
assets) — not the Schedule III company balance sheet of ITR-6. Nothing here is
invented; Appendix 2 reproduces every schema leaf, Appendix 3 every live row
verbatim.

---

## 1 · Why this is the widest financial statement on ITR-7

It is the whole financial position of the trust on one page, in the two halves
of the fund-accounting equation that must be equal:

| Half | Item | Groups |
|---|---|---|
| **A — Sources of Funds** | A | 1 Own Funds (corpus) · 2 Loan and Borrowings · 3 Advances |
| **B — Application of Funds** | B | 1 Fixed assets · 2 Investments · 3 Current assets, loans and advances (net) · 4 Accumulated balance / other reserve |

The two half-totals — **Sources of funds** (row 24) and **Total application of
funds** (row 57) — are the figures the department reconciles, and the corpus
lines feed **Schedule R** and **Schedule J**.

Four rows (31–34, the itemised Investments sub-lines) are hidden and must not be
built (see §4).

---

## 2 · Part A — Sources of Funds

All amounts are integers (rupees). Computed rows carry the sheet's own formula.
Schema paths are under `PARTA_BS.SourcesOfFund`.

### 1 · Own Funds

| Item | Row | Label | Type | Schema key (under `SourcesOfFund.OwnFund`) | Formula |
|---|---|---|---|---|---|
| **1a** | 6 | Corpus out of the donations received for renovation or repair of places notified u/s 80G(2)(b) on or after 01.04.2020 | figure | `Corpus80G` | entered |
| **1b** | 7 | Other corpus received on or after 01.04.2021 | figure | `OtherCorpus` | entered |
| **1c** | 8 | Corpus other than (a) and (b) | figure | `AccumulatedInc` | entered |
| **1d** | 9 | Income accumulated under third proviso to clause (23C) of section 10 or section 11(2) | figure | `AccumulatedIncUS10_11` | entered |
| **1e** | 10 | Balance Amount of deemed Income being exemption claimed in earlier years on account of deemed application and required to be applied in FY 2026-27 onwards | figure | `BalDeemedInc` | entered |
| **1f** | 11 | Any other reserve (Specify the nature) | group | `OtherReserve[]` | |
| 1f (rows) | 12–15 | SrNo · Specify the nature · Amount | table | `OtherReserve[].Nature`, `OtherReserve[].Amount` | entered |
| **1fiii** | 16 | Total | computed | `TotalOtherReserve` | sum of the OtherReserve amounts |
| **1g** | 18 | Total fund (a+ b+c+d+e+f) | computed | `TotalFund` | `Corpus80G + OtherCorpus + AccumulatedInc + AccumulatedIncUS10_11 + BalDeemedInc + TotalOtherReserve` |

### 2 · Loan and Borrowings

| Item | Row | Label | Type | Schema key (under `SourcesOfFund.LongTermBorrowings`) | Formula |
|---|---|---|---|---|---|
| **2a** | 20 | Secured loans | figure | `SecuredLoan` | entered |
| **2b** | 21 | Unsecured loans (including Deposits) | figure | `UnSecuredLoan` | entered |
| **2c** | 22 | Total Loan Funds (a+ b) | computed | `TotalLoanFund` | `SecuredLoan + UnSecuredLoan` |

### 3 · Advances and the sources total

| Item | Row | Label | Type | Schema key (under `SourcesOfFund`) | Formula |
|---|---|---|---|---|---|
| **3** | 23 | Advances | figure | `Advances` | entered |
| **A** | 24 | Sources of funds (1g + 2c + 3) | computed | `TotSourceFund` | `TotalFund + TotalLoanFund + Advances` |

---

## 3 · Part B — Application of Funds

Schema paths are under `PARTA_BS.ApplicationOfFunds`.

### 1 · Fixed assets

| Item | Row | Label | Type | Schema key (under `ApplicationOfFunds.FixedAsset`) | Formula |
|---|---|---|---|---|---|
| **1a** | 27 | Gross Fixed Assets | figure | `GrossBlock` | entered |
| **1b** | 28 | Depreciation | figure | `Depreciation` | entered |
| **1c** | 29 | Net Fixed Assets (1a - 1b) | computed | `NetBlock` | `GrossBlock − Depreciation` |

### 2 · Investments

| Item | Row | Label | Type | Schema key | Note |
|---|---|---|---|---|---|
| **2** | 30 | Investments | group header | `ApplicationOfFunds.Investements` | the single total; the itemised sub-lines below are hidden |
| 2a | 31 | Investments | figure | (hidden) | not built |
| 2b | 32 | Investment out of other corpus | figure | (hidden) | not built |
| 2c | 33 | Other investments | figure | (hidden) | not built |
| 2— | 34 | Investments kept in modes other than specified u/s 11(5) | figure | (hidden) | not built |

### 3 · Current assets, loans and advances

| Item | Row | Label | Type | Schema key (under `ApplicationOfFunds.CurrentAssetsLoanAdv`) | Formula |
|---|---|---|---|---|---|
| **3a** | 36 | Current assets | group | `CurrentAssets` | |
| 3a i | 37 | Inventories | figure | `CurrentAssets.Inventory` | entered |
| 3a ii | 38 | Sundry Debtors | figure | `CurrentAssets.SundryDebtor` | entered |
| 3a iii | 39 | Cash and Bank Balances | group | `CurrentAssets.CashNCashEquivalents` | |
| 3a iiiA | 40 | Balance with banks | figure | `CashNCashEquivalents.BalWithBanks` | entered |
| 3a iiiB | 41 | Cash-in-hand | figure | `CashNCashEquivalents.CashInHand` | entered |
| 3a iiiC | 42 | Others | figure | `CashNCashEquivalents.Others` | entered |
| 3a iiiD | 43 | Total Cash and cash equivalents (iiiA + iiiB + iiiC) | computed | `CashNCashEquivalents.TotCashNCashEquivalents` | `BalWithBanks + CashInHand + Others` |
| 3a iv | 44 | Other Current Assets | figure | `CurrentAssets.OtherCurrAssets` | entered |
| 3a v | 45 | Total current assets (i +ii + iiiD + iv) | computed | `CurrentAssets.TotCurrAssets` | `Inventory + SundryDebtor + TotCashNCashEquivalents + OtherCurrAssets` |
| **3b** | 46 | Loans and advances | figure | `LoansandAdvances` | entered |
| **3c** | 47 | Total (av + b) | computed | `Total` | `TotCurrAssets + LoansandAdvances` |
| **3d** | 48 | Current liabilities and provisions | group | `CurrLiabilitiesProviosions` | |
| 3d i | 49 | Current liabilities | group | `CurrLiabilitiesProviosions.CurrLiability` | |
| 3d iA | 50 | Sundry Creditors | figure | `CurrLiability.SundryCreditor` | entered |
| 3d iB | 51 | Other payables | figure | `CurrLiability.OtherPayable` | entered |
| 3d iC | 52 | Total (A + B) | computed | `CurrLiability.TotalCurrLiabilitiesProviosions` | `SundryCreditor + OtherPayable` |
| 3d ii | 53 | Provisions | figure | `CurrLiabilitiesProviosions.Provisions` | entered |
| 3d iii | 54 | Total (iC + ii) | computed | `CurrLiabilitiesProviosions.TotCurrLiabilitiesandprovisions` | `TotalCurrLiabilitiesProviosions + Provisions` |
| **3e** | 55 | Net Current Assets (3c – 3diii) | computed | `NetCurrAssets` | `Total − TotCurrLiabilitiesandprovisions` |

### 4 · Accumulated balance and the application total

| Item | Row | Label | Type | Schema key (under `ApplicationOfFunds`) | Formula |
|---|---|---|---|---|---|
| **4** | 56 | Accumulated balance/ Any other reserve (deficit ) | figure | `AccBalAnyOthRes` | entered |
| **B** | 57 | Total application of funds (1+2+3e+4) | computed | `TotalApplicationOfFunds` | `NetBlock + Investements + NetCurrAssets + AccBalAnyOthRes` |
| memo | 58 | Out of 5, Investment made in modes specified u/s 11(5) | figure | `OutOf5InvModesUS11_5` | entered |
| memo | 59 | Out of 5, Investment made in modes other than specified u/s 11(5) | figure | `OutOf5InvModesOthUS11_5` | entered |

---

## 4 · Hidden rows — not built

Four rows are hidden on the sheet and are **excluded** (they carry no live schema
key; the single `ApplicationOfFunds.Investements` leaf holds the investments
figure):

| Row | Label | Reason it is hidden |
|---|---|---|
| 31 | a — Investments | itemised sub-line collapsed into the single `Investements` leaf |
| 32 | b — Investment out of other corpus | same |
| 33 | c — Other investments | same |
| 34 | Investments kept in modes other than specified u/s 11(5) | same |

Nothing is lost by not building them; the visible **Investments** header (row 30)
maps to the `Investements` figure.

---

## 5 · The dropdowns

There are **no enumerated (list) dropdowns** on this sheet. Every input cell
carries only a numeric data-validation: minimum 0 on ordinary amount cells, a
signed limit (`-9999999999999` on row 57, `-99999999999999` on rows 55, 47,
43/45) on the net/total rows that may be negative, and `50`/`300` format limits
on the reserve Sl-No / nature cells. No value list is seeded from `enums.json`.

---

## 6 · The rules the sheet computes (the balancing identity)

The whole sheet is a chain of totals up to the two half-totals, which the
department requires to be **equal**:

```
Sources of funds (row 24, A)  =  Total application of funds (row 57, B)
```

`row 24 = TotalFund + TotalLoanFund + Advances`; `row 57 = NetBlock +
Investements + NetCurrAssets + AccBalAnyOthRes`. Net Fixed Assets is
`GrossBlock − Depreciation` (row 29); Net Current Assets is `Total (3c) −
TotCurrLiabilitiesandprovisions (3diii)` (row 55); everything else is a straight
sum of its sub-lines.

---

## 7 · Cross-sheet feeds

- **Out →** the three corpus lines (**1a** Corpus80G, **1b** OtherCorpus, **1c**
  the corpus-other figure) are the "as per Balance sheet" side of **Schedule R**,
  reconciled against the closing corpus of **Schedule J** block A1.
- **Out →** the investment memo lines (rows 58–59, the 11(5) / non-11(5) split)
  correspond to Schedule J block B.
- **In ←** figures are entered from the trust's books of account; no other
  schedule computes into the Balance Sheet.

---

## 8 · What the schema marks mandatory

Almost every leaf of `PARTA_BS` is `required` — a figure (zero acceptable) on
every corpus line, every total, and every current-asset/liability line. The
only non-required leaves are `ApplicationOfFunds.Investements`,
`ApplicationOfFunds.AccBalAnyOthRes`, `OutOf5InvModesUS11_5` and
`OutOf5InvModesOthUS11_5`. The one repeatable table is
`OwnFund.OtherReserve[]` (`.Nature` + `.Amount`). The full leaf list, with the
required flag, is in Appendix 2.

---

## Appendix 1 · Heading, verbatim

```
[C3] Part A-BS  |  [F3] Consolidated Balance Sheet as on 31st day of March, 2026 [to be mandatorily filled in by all persons filing ITR-7]
```

---

## Appendix 2 · Every schema leaf of block `PARTA_BS` (full paths)
`*` = required.
```
* SourcesOfFund.OwnFund.Corpus80G integer
* SourcesOfFund.OwnFund.OtherCorpus integer
* SourcesOfFund.OwnFund.AccumulatedInc integer
* SourcesOfFund.OwnFund.AccumulatedIncUS10_11 integer
* SourcesOfFund.OwnFund.BalDeemedInc integer
  SourcesOfFund.OwnFund.OtherReserve[] array
* SourcesOfFund.OwnFund.OtherReserve[].Nature string
* SourcesOfFund.OwnFund.OtherReserve[].Amount integer
* SourcesOfFund.OwnFund.TotalOtherReserve integer
* SourcesOfFund.OwnFund.TotalFund integer
* SourcesOfFund.LongTermBorrowings.SecuredLoan integer
* SourcesOfFund.LongTermBorrowings.UnSecuredLoan integer
* SourcesOfFund.LongTermBorrowings.TotalLoanFund integer
* SourcesOfFund.Advances integer
* SourcesOfFund.TotSourceFund integer
* ApplicationOfFunds.FixedAsset.GrossBlock integer
* ApplicationOfFunds.FixedAsset.Depreciation integer
* ApplicationOfFunds.FixedAsset.NetBlock integer
  ApplicationOfFunds.Investements integer
* ApplicationOfFunds.CurrentAssetsLoanAdv.CurrentAssets.Inventory integer
* ApplicationOfFunds.CurrentAssetsLoanAdv.CurrentAssets.SundryDebtor integer
* ApplicationOfFunds.CurrentAssetsLoanAdv.CurrentAssets.CashNCashEquivalents.BalWithBanks integer
* ApplicationOfFunds.CurrentAssetsLoanAdv.CurrentAssets.CashNCashEquivalents.CashInHand integer
* ApplicationOfFunds.CurrentAssetsLoanAdv.CurrentAssets.CashNCashEquivalents.Others integer
* ApplicationOfFunds.CurrentAssetsLoanAdv.CurrentAssets.CashNCashEquivalents.TotCashNCashEquivalents integer
* ApplicationOfFunds.CurrentAssetsLoanAdv.CurrentAssets.OtherCurrAssets integer
* ApplicationOfFunds.CurrentAssetsLoanAdv.CurrentAssets.TotCurrAssets integer
* ApplicationOfFunds.CurrentAssetsLoanAdv.LoansandAdvances integer
* ApplicationOfFunds.CurrentAssetsLoanAdv.Total integer
* ApplicationOfFunds.CurrentAssetsLoanAdv.CurrLiabilitiesProviosions.CurrLiability.SundryCreditor integer
* ApplicationOfFunds.CurrentAssetsLoanAdv.CurrLiabilitiesProviosions.CurrLiability.OtherPayable integer
* ApplicationOfFunds.CurrentAssetsLoanAdv.CurrLiabilitiesProviosions.CurrLiability.TotalCurrLiabilitiesProviosions integer
* ApplicationOfFunds.CurrentAssetsLoanAdv.CurrLiabilitiesProviosions.Provisions integer
* ApplicationOfFunds.CurrentAssetsLoanAdv.CurrLiabilitiesProviosions.TotCurrLiabilitiesandprovisions integer
* ApplicationOfFunds.CurrentAssetsLoanAdv.NetCurrAssets integer
  ApplicationOfFunds.AccBalAnyOthRes integer
* ApplicationOfFunds.TotalApplicationOfFunds integer
  ApplicationOfFunds.OutOf5InvModesUS11_5 integer
  ApplicationOfFunds.OutOf5InvModesOthUS11_5 integer
```

---

## Appendix 3 · Every live row of the sheet, verbatim
(Rows 31–34 are hidden — shown for completeness, not built.)
```
[C3] Part A-BS  |  [F3] Consolidated Balance Sheet as on 31st day of March, 2026 [to be mandatorily filled in by all persons filing ITR-7]
[D4] A  |  [E4] Sources of Funds
[E5] Own Funds
[E6] a  |  [F6] Corpus out of the donations received for renovation or repair of places notified u/s 80G(2)(b) on or after 01.04.2020  |  [K6] 1a
[E7] b  |  [F7] Other corpus received on or after 01.04.2021  |  [K7] 1b
[E8] c  |  [F8] Corpus other than (a) and (b)  |  [K8] 1c
[E9] d  |  [F9] Income accumulated under third proviso to clause (23C) of section 10 or section 11(2)  |  [K9] 1d
[E10] e  |  [F10] Balance Amount of deemed Income being exemption claimed in earlier years on account of deemed application and required to be applied in FY 2026-27 onwards  |  [K10] 1e
[E11] f  |  [F11] Any other reserve (Specify the nature)
[F12] SrNo  |  [G12] Specify the nature  |  [J12] Amount
[F16] iii  |  [G16] Total  |  [K16] fiii
[E18] g  |  [F18] Total fund (a+ b+c+d+e+f)  |  [K18] 1g
[E19] Loan and Borrowings
[E20] a  |  [F20] Secured loans  |  [I20] a
[E21] b  |  [F21] Unsecured loans (including Deposits)  |  [I21] b
[E22] c  |  [F22] Total Loan Funds (a+ b)  |  [K22] 2c
[E23] Advances
[E24] Sources of funds (1g + 2c +3 )
[D25] B  |  [E25] Application of funds
[E26] Fixed assets
[E27] a  |  [F27] Gross Fixed Assets  |  [K27] 1a
[E28] b  |  [F28] Depreciation  |  [K28] 1b
[E29] c  |  [F29] Net Fixed Assets (1a - 1b)  |  [K29] 1c
[E30] Investments
[E31] a  |  [F31] Investments  |  [I31] a                                    (hidden)
[E32] b  |  [F32] Investment out of other corpus  |  [I32] b                  (hidden)
[E33] c  |  [F33] Other investments  |  [I33] c                              (hidden)
[E34] Investments kept in modes other than specified u/s 11(5)               (hidden)
[E35] Current assets, loans and advances
[E36] a  |  [F36] Current assets
[F37] i  |  [G37] Inventories  |  [K37] i
[F38] ii  |  [G38] Sundry Debtors  |  [K38] ii
[F39] iii  |  [G39] Cash and Bank Balances
[G40] A  |  [H40] Balance with banks  |  [I40] iiiA
[G41] B  |  [H41] Cash-in-hand  |  [I41] iiiB
[G42] C  |  [H42] Others  |  [I42] iiiC
[G43] D  |  [H43] Total Cash and cash equivalents (iiiA + iiiB + iiiC)  |  [K43] iiiD
[F44] iv  |  [G44] Other Current Assets  |  [K44] iv
[F45] v  |  [G45] Total current assets (i +ii + iiiD + iv)  |  [K45] av
[E46] b  |  [F46] Loans and advances  |  [K46] b
[E47] c  |  [F47] Total (av + b)  |  [K47] c
[E48] d  |  [F48] Current liabilities and provisions
[F49] i  |  [G49] Current liabilities
[G50] A  |  [H50] Sundry Creditors  |  [I50] A
[G51] B  |  [H51] Other payables  |  [I51] B
[G52] C  |  [H52] Total (A + B)  |  [I52] iC
[F53] ii  |  [G53] Provisions  |  [I53] ii
[F54] iii  |  [G54] Total (iC + ii)  |  [K54] 3diii
[E55] e  |  [F55] Net Current Assets (3c – 3diii)  |  [K55] 3e
[E56] Accumulated balance/ Any other reserve (deficit )
[E57] Total application of funds (1+2+3e+4)
[E58] Out of 5, Investment made in modes specified u/s 11(5)
[E59] Out of 5, Investment made in modes other than specified u/s 11(5)
```
