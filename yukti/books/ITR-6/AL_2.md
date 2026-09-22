# The book of Schedule AL-2 — Assets and liabilities of a start-up · ITR-6, A.Y. 2026-27

Read row by row from the utility's **AL-2** sheet (rows 3-78, nine parts A-I),
with the hidden-row flags, the dropdowns and the formulas, and confirmed against
the schema block **`ScheduleAL.AsstLiabilitiesStartUps`**.

*"Assets and liabilities as at the end of the year (applicable for start-ups
only)."* Row **D4** — *"If you are a start-up which has filed declaration in
Form-2 under para 5 of DPIIT notification dated 19.02.2019, please furnish the
following information for the period from the date of incorporation upto end of
the year"* — sets the scope: unlike AL-1's year-movement view, AL-2 reports
**since incorporation**, with a *"Whether transferred"* flag on the asset tables.

> **One block, two sheets.** `ScheduleAL` backs **both** AL-2 (this book,
> `AsstLiabilitiesStartUps`) and **AL-1** (`AsstLiabilitiesUnlistedCompany`,
> booked separately). The section map maps both sheets to `ScheduleAL`, so §11
> below carries the whole block's leaf keys, including the AL-1 (unlisted-company)
> object, for completeness. This sheet fills only the **start-up** object.

---

## 1 · When it applies

**A DPIIT-recognised start-up** that has filed the Form-2 declaration under para
5 of the notification dated 19.02.2019. The gating question is row **D5** —
*"Do you have Assets and liabilities as at the end of the year as mentioned in
Schedule AL-2?"* — answered by the dropdown at **J5** (**(Select) / Yes / No**),
filed as `AsstLiabilitiesStartUps.ALStartUpsFlag` (enum **N / Y**). All amounts
are in rupees, at cost. A start-up files **AL-2, not AL-1**.

---

## 2 · The shape — nine parts, "since incorporation"

| Part | Label (verbatim) | Schema array |
|---|---|---|
| **A** | Details of building or land appurtenant there to, or both, being a residential house | `DtlsBldLandResHouseSU[]` |
| **B** | Details of land or building or both not being in the nature of residential house | `DtlsBldLandNotResHouseSU[]` |
| **C** | Details of Loans & Advances made since incorporation (If lending of money is not assessee's substantial business) | `DtlsLoansAdvancesSU[]` |
| **D** | Details of capital contribution made to any other entity since incorporation | `DtlsCapitalContributionSU[]` |
| **E** | Details of acquisition of shares and securities | `DtlsAcqustSharesSecuritiesSU[]` |
| **F** | Details of motor vehicle, aircraft, yacht or other mode of transport, the actual cost of which exceeds ten lakh rupees acquired since incorporation | `DtlsVehiclestransportSU[]` |
| **G** | Details of Jewellery acquired since incorporation | `DtlsJewelleryAcquiredSU[]` |
| **H** | Details of archaeological collections, drawings, paintings, sculptures, any work of art or bullion acquired since incorporation | `DtlsArchaeologicalCollctSU[]` |
| **I** | Details of liabilities — loans, deposits and advances taken from a person other than financial institution | `DtlsLiabilitiesSU[]` |

Every table is **unlimited** (four seed rows each). No total row, no derivation —
each cell is entered. The asset tables (A, B, E, F, G, H) each carry a
**Whether transferred** flag and an **If Yes date of transfer** date.

---

## 3 · Part A — Residential house / land (`DtlsBldLandResHouseSU[]`)

Header row 7; data rows 9-12.

| Col | Label (verbatim) | Type / enum | Schema key | Req |
|---|---|---|---|---|
| C7 | Sl.No. | serial | — | — |
| D7 | Address | text (max 200) | `Address` | yes |
| E7 | Pin code | integer | `PinCode` | yes |
| F7 | Date of acquisition | date DD/MM/YYYY | `AcquisitionDate` | yes |
| G7 | Cost of acquisition | integer | `AcquisitionCost` | yes |
| H7 | Purpose for which used (dropdown to be provided) | enum `AL.Purpose` | `Purpose` | yes |
| I7 | Whether transferred on or before the end of the previous year | enum Yes/No | `TransferFlag` | yes |
| J7 / R7 | If Yes date of transfer | date | `TransferDate` | when transferred |

## 4 · Part B — Non-residential land or building (`DtlsBldLandNotResHouseSU[]`)

Header row 16; data rows 18-21.

| Col | Label (verbatim) | Type / enum | Schema key | Req |
|---|---|---|---|---|
| D16 | Address | text (max 200) | `Address` | yes |
| E16 | Pin code | integer | `PinCode` | yes |
| F16 | Date of acquisition | date | `AcquisitionDate` | yes |
| G16 | Cost of acquisition Rs. | integer | `AcquisitionCost` | yes |
| H16 | Purpose for which used | enum `AL1B.PurposeDrp` | `Purpose` | yes |
| I16 | Whether transferred | enum Yes/No | `TransferFlag` | yes |
| J16 | If Yes date of transfer | date | `TransferDate` | when transferred |

## 5 · Part C — Loans & advances made since incorporation (`DtlsLoansAdvancesSU[]`)

Header row 25; data rows 26-29.

| Col | Label (verbatim) | Type / enum | Schema key | Req |
|---|---|---|---|---|
| D25 | Name of the person | text (max 125) | `PersonName` | yes |
| E25 | PAN | PAN | `PAN` | yes |
| F25 | Date on which loans and advances has been made | date | `LoansAdvancesDate` | yes |
| G25 | Amount of loans and advances | integer | `AmtLoansAdvances` | yes |
| H25 | Amount received | integer | `Amount` | yes |
| I25 | Whether loans and advances has been repaid | enum Yes/No | `LoansAdvancesFlag` | yes |
| J25 | If Yes date of such repayment | date | `RepaymentDate` | when repaid |
| K25 | Closing balance as at the end of the previous year, if any | integer | `ClosingBalance` | yes |
| L25 | Rate of interest, if any | number | `InterestRate` | yes |

## 6 · Part D — Capital contribution to any other entity (`DtlsCapitalContributionSU[]`)

Header row 33; data rows 34-37.

| Col | Label (verbatim) | Schema key | Req |
|---|---|---|---|
| D33 | Name of entity | `EntityName` | yes |
| E33 | PAN | `PAN` | yes |
| F33 | Date on which capital contribution has been made | `CapitalContributionDate` | yes |
| G33 | Amount of contribution | `AmtContribution` | yes |
| H33 | Amount withdrawn, if any | `AmtWithdrawn` | yes |
| I33 | Amount of profit/loss/ dividend/ interest debited or credited during the year | `AmtprofitLossDividend` | yes |
| J33 | Closing balance as at the end of the previous year, if any | `ClosingBalance` | yes |

## 7 · Part E — Acquisition of shares and securities (`DtlsAcqustSharesSecuritiesSU[]`)

Header row 41; data rows 42-45.

| Col | Label (verbatim) | Type / enum | Schema key | Req |
|---|---|---|---|---|
| D41 | Name of company/entity | text (max 125) | `EntityCompanyName` | yes |
| E41 | PAN | PAN | `PAN` | yes |
| F41 | Type of shares/securities | enum (7 values) | `SharesSecuritiesType` | yes |
| G41 | Others | text (max 50) | `SharesSecuritiesTypeOthers` | when Others |
| H41 | Number of shares/securities acquired | integer | `NumSharesSecuritiesAcq` | yes |
| I41 | Cost of acquisition | number | `AcquisitionCost` | yes |
| J41 | Date of acquisition | date | `AcquisitionDate` | yes |
| K41 | Whether transferred | enum Yes/No | `TransferFlag` | yes |
| L41 | If Yes date of transfer | date | `TransferDate` | when transferred |
| M41 | Closing balance as at the end of the previous year, if any | integer | `ClosingBalance` | yes |

## 8 · Part F — Motor vehicle, aircraft, yacht etc. (`DtlsVehiclestransportSU[]`)

Header row 49; data rows 50-53. *Actual cost exceeding ten lakh rupees, acquired
since incorporation.*

| Col | Label (verbatim) | Type / enum | Schema key | Req |
|---|---|---|---|---|
| D49 | Particulars of asset | enum (Motor Vehicle/Aircraft/Yacht/Others) | `AssetParticulars` | yes |
| E49 | Others | text | `AssetParticularsOthers` | |
| F49 | Registration number of vehicle | text | `RegNumVehicle` | yes |
| G49 | Cost of acquisition | integer | `AcquisitionCost` | yes |
| H49 | Date of acquisition | date | `AcquisitionDate` | yes |
| I49 | Purpose for which used | enum `AL2H.Drpdwn` | `Purpose` | yes |
| J49 | Whether transferred | enum Yes/No | `TransferFlag` | yes |
| K49 | If Yes date of transfer | date | `TransferDate` | when transferred |

## 9 · Part G — Jewellery acquired since incorporation (`DtlsJewelleryAcquiredSU[]`)

Header row 57; data rows 58-61. This array has **no "Others" free-text** leaf.

| Col | Label (verbatim) | Type / enum | Schema key | Req |
|---|---|---|---|---|
| D57 | Particulars of asset | enum (jewellery, 6 values) | `AssetParticulars` | yes |
| E57 | Quantity | integer | `Quantity` | yes |
| F57 | Cost of acquisition | integer | `AcquisitionCost` | yes |
| G57 | Date of acquisition | date | `AcquisitionDate` | yes |
| H57 | Purpose for which used | enum (Stock in trade / Investment) | `Purpose` | yes |
| I57 | Whether transferred | enum Yes/No | `TransferFlag` | yes |
| J57 | If Yes date of transfer | date | `TransferDate` | when transferred |
| K57 | Closing balance as at the end of the previous year, if any | integer | `ClosingBalance` | yes |

## 10 · Part H — Archaeological collections / art / bullion (`DtlsArchaeologicalCollctSU[]`)

Header row 65; data rows 66-69.

| Col | Label (verbatim) | Type / enum | Schema key | Req |
|---|---|---|---|---|
| D65 | Particulars of asset | enum `AL2HDropDown` | `AssetParticulars` | yes |
| E65 | Others | text | `AssetParticularsOthers` | |
| F65 | Quantity | integer | `Quantity` | yes |
| G65 | Cost of acquisition | integer | `AcquisitionCost` | yes |
| H65 | Date of acquisition | date | `AcquisitionDate` | yes |
| I65 | Purpose for which used | enum (Stock in trade / Investment) | `Purpose` | yes |
| J65 | Whether transferred | enum Yes/No | `TransferFlag` | yes |
| K65 | If Yes date of transfer | date | `TransferDate` | when transferred |
| L65 | Closing balance as at the end of the previous year, if any | integer | `ClosingBalance` | yes |

## 10b · Part I — Liabilities (`DtlsLiabilitiesSU[]`)

Header rows 73-74; data rows 75-78. Row D72 **Details of liabilities**; row D73
**Details of loans, deposits and advances taken from a person other than
financial institution**.

| Col | Label (verbatim) | Schema key | Req |
|---|---|---|---|
| D74 | Name of the person | `PersonName` | yes |
| E74 | PAN | `PAN` | yes |
| F74 | Opening Balance | `OpeningBalance` | yes |
| G74 | Amount received | `AmountReceived` | yes |
| H74 | Amount paid | `AmountPaid` | yes |
| I74 | Interest debited if any | `InterestCredited` | yes |
| J74 | Closing balance | `ClosingBalance` | yes |
| K74 | Rate of interest (%) | `InterestRate` (number) | yes |

---

## 11 · The dropdowns (every list on the sheet, with all its values)

**`AL.Purpose`** — Part A purpose (H9:H12) → `Purpose`:

| Value | Code |
|---|---|
| (Select) | — |
| Guest House | GH |
| Director Quarter | DQ |
| Director Use | DU |
| Staff Quarters | SQ |
| Own Office | OO |
| Renting | RE |
| Leasing | LE |
| Stock in trade | ST |
| Investment | IN |
| `Persons who were beneficial owners of shares holding not less than 10% of the voting power at any time of the previous year` | BO |

**`AL1B.PurposeDrp`** — Part B purpose (H18:H21) → `Purpose`:
(Select), Own Office (OO), Factory (FA), Warehouse (WH), Godown (GD), Renting
(RE), Leasing (LE), Stock in trade (ST), Investment (IN), `Persons who were beneficial owners of shares holding not less than 10% of the voting power at any time of the previous year` (BO).

**Type of shares/securities** (Part E, F42:F45) → `SharesSecuritiesType`:
(Select), Bonds (BN), Debentures (DB), Derivatives (DE), Equity Shares (ES),
Preference Shares (PS), Bonus Shares (BS), Others (OT).

**Vehicle particulars** (Part F, D50:D53) → `AssetParticulars`:
(Select), Motor Vehicle (M), Aircraft (A), Yacht (Y), Others (O).

**`AL2H.Drpdwn`** — Part F purpose (I50:I53) → `Purpose`:
(Select), Own Business Use (OU), Employees Use (EU), Directors Use (DU), Stock in
trade (ST), Investment (IN), Renting (RE), Leasing (LE), `Persons who were beneficial owners of shares holding not less than 10% of the voting power at any time of the previous year` (BO).

**Jewellery particulars** (Part G, D58:D61) → `AssetParticulars`:
(Select), Gold Jewellery (GJ), Silver Jewellery (SJ), Platinum Jewellery (PJ),
Diamond Jewellery (DJ), `Other precious metal Jewellery` (OMJ), `Other precious stone Jewellery` (OSJ).

**`AL2HDropDown`** — Part H particulars (D66:D69) → `AssetParticulars`:
(Select), Archaeological Collections (AC), Drawings (DR), Paintings (PA),
Sculptures (SC), Work of Art (WA), Bullion (BN), Others (OT).

**Jewellery purpose** (Part G, H58:H61) → `Purpose`:
(Select), Stock in trade (ST), Investment (IN).

**Art purpose** (Part H, I66:I69) → `Purpose`:
(Select), Stock in trade (ST), Investment (IN). *(source list I66 writes
" Stock in trade" with a leading space.)*

**Whether transferred / repaid / applicability** (I9:I12, I18:I21, I26:I29,
K42:K45, J50:J53, I58:I61, J66:J69, J5) → `TransferFlag` / `LoansAdvancesFlag` /
`ALStartUpsFlag`: (Select), Yes, No.

---

## 12 · The schema block `ScheduleAL` — every leaf key (coverage)

`*` = required within a row of its array.

### `AsstLiabilitiesStartUps` (this sheet, AL-2)

`ALStartUpsFlag` (N/Y). Arrays and their row leaves:

- `DtlsBldLandResHouseSU[]`, `DtlsBldLandNotResHouseSU[]`: `Address`*, `PinCode`*, `AcquisitionDate`*, `AcquisitionCost`*, `Purpose`*, `TransferFlag`*, `TransferDate`.
- `DtlsLoansAdvancesSU[]`: `PersonName`*, `PAN`*, `LoansAdvancesDate`*, `AmtLoansAdvances`*, `Amount`*, `LoansAdvancesFlag`*, `RepaymentDate`, `ClosingBalance`*, `InterestRate`*.
- `DtlsCapitalContributionSU[]`: `EntityName`*, `PAN`*, `CapitalContributionDate`*, `AmtContribution`*, `AmtWithdrawn`*, `AmtprofitLossDividend`*, `ClosingBalance`*.
- `DtlsAcqustSharesSecuritiesSU[]`: `EntityCompanyName`*, `PAN`*, `SharesSecuritiesType`*, `SharesSecuritiesTypeOthers`, `NumSharesSecuritiesAcq`*, `AcquisitionCost`*, `AcquisitionDate`*, `TransferFlag`*, `TransferDate`, `ClosingBalance`*.
- `DtlsVehiclestransportSU[]`: `AssetParticulars`*, `AssetParticularsOthers`, `RegNumVehicle`*, `AcquisitionCost`*, `AcquisitionDate`*, `Purpose`*, `TransferFlag`*, `TransferDate`.
- `DtlsJewelleryAcquiredSU[]`: `AssetParticulars`*, `Quantity`*, `AcquisitionCost`*, `AcquisitionDate`*, `Purpose`*, `TransferFlag`*, `TransferDate`, `ClosingBalance`*.
- `DtlsArchaeologicalCollctSU[]`: `AssetParticulars`*, `AssetParticularsOthers`, `Quantity`*, `AcquisitionCost`*, `AcquisitionDate`*, `Purpose`*, `TransferFlag`*, `TransferDate`, `ClosingBalance`*.
- `DtlsLiabilitiesSU[]`: `PersonName`*, `PAN`*, `OpeningBalance`*, `AmountReceived`*, `AmountPaid`*, `InterestCredited`*, `ClosingBalance`*, `InterestRate`*.

### `AsstLiabilitiesUnlistedCompany` (sibling — filed from Schedule AL-1, listed here for the shared block)

`ALUnlistedCompanyFlag` (N/Y). Arrays and their row leaves:

- `DtlsBldLandResHouseUC[]`, `DtlsBldLandNotResHouseUC[]`: `Address`*, `PinCode`*, `AcquisitionDate`*, `AcquisitionCost`*, `Purpose`*.
- `DtlsListedEquitySharesUC[]`: `OpenBalNumberOfShares`*, `OpenBalShareType`*, `OpenBalAcquisitionCost`*, `ShrsAcqNumberOfShares`, `ShrsAcqShareType`, `ShrsAcqAcquisitionCost`, `ShrsTrsNumberOfShares`, `ShrsTrsShareType`, `ShrsTrsSaleConsdr`, `ClBalNumberOfShares`, `ClBalShareType`, `ClBalAcquisitionCost`.
- `DtlsUnListedEquitySharesUC[]`: `CompanyName`*, `PAN`*, `OpenBalNumberOfShares`*, `OpenBalAcquisitionCost`*, `ShrsAcqNumberOfShares`, `SubscriptionPurchaseDate`, `FaceValuePerShare`, `IssuePricePerShare`, `PurchasePricePerShare`, `ShrsTrsNumberOfShares`, `SaleConsideration`, `ClBalNumberOfShares`*, `ClBalAcquisitionCost`*.
- `DtlsOtherSecuritiesUC[]`: `SecuritiesType`*, `SecuritiesTypeOthers`, `ListedUnlistedFlag`*, `OpenBalNumberOfSecurities`*, `OpenBalAcquisitionCost`*, `ShrsAcqNumberOfSecurities`, `SubscriptionPurchaseDate`, `FaceValuePerShare`, `IssuePriceSecurity`, `PurchasePricePerSecurity`, `ShrsTrsNumberOfSecurities`, `SaleConsideration`, `ClBalNumberOfSecurities`*, `ClBalAcquisitionCost`*.
- `DtlsCapitalContributionOthEntityUC[]`: `EntityName`*, `PAN`*, `OpeningBalance`*, `AmtContributedDrgTheYr`*, `AmtWithdrawnDrgTheYr`*, `AmtprofitLossDividend`*, `ClosingBalance`*.
- `DtlsLoansAdvancesUC[]`, `DtlsLiabilitiesUC[]`: `PersonName`*, `PAN`*, `OpeningBalance`*, `AmountReceived`*, `AmountPaid`*, `InterestCredited`*, `ClosingBalance`*, `InterestRate`*.
- `DtlsVehiclestransportUC[]`: `AssetParticulars`*, `AssetParticularsOthers`, `RegNumVehicle`*, `AcquisitionCost`*, `AcquisitionDate`*, `Purpose`*.
- `DtlsJewelleryArchCollectionsUC[]`: `AssetParticulars`*, `AssetParticularsOthers`, `Quantity`*, `AcquisitionCost`*, `AcquisitionDate`*, `Purpose`*.

Every live label on the AL-2 sheet has a schema key under
`AsstLiabilitiesStartUps`; nothing on the sheet is excluded for want of a key.

---

## 13 · Cross-sheet feeds in / out

- **No numeric feed** to Part B-TI / Part B-TTI — AL-2 is a disclosure schedule;
  it computes nothing and is fed by nothing.
- **Part E (acquisition of shares and securities)** and the DPIIT / angel-tax
  position should agree with the shareholding shown in **Schedule SH-2**.
- **Parts A / B (immovable)** should reconcile with **Schedule HP** and the
  Balance Sheet — at cost, so a warning, not a hard rule.
- Liabilities in **Part I** should reconcile with the Balance Sheet's
  borrowings from non-institutional lenders.

## 14 · What is mandatory · what repeats

- `ALStartUpsFlag` (N/Y); within each row the columns marked required above.
  Each asset table carries `TransferFlag` (required) with `TransferDate` filled
  only when transferred; Part C carries `LoansAdvancesFlag` with `RepaymentDate`
  filled only when repaid.
- **Every one of the nine tables repeats, unlimited.** No fixed single-figure
  lines and no totals on this sheet.

## 15 · Hidden rows

Two hidden rows carry only a helper tag and are **not built**:

| Row | Cell | Text | Reason |
|---|---|---|---|
| r8 | J8 | 7(i) | hidden helper reference under Part A — not a filed field |
| r17 | J17 | 7(i) | hidden helper reference under Part B — not a filed field |

No live label is lost to these; every visible column has a schema key.

## 16 · What this means for the build

1. **Nine "since incorporation" tables under one gate (`al` section).** Render
   each as an unlimited card behind the `ALStartUpsFlag` (J5 Yes/No) gate.
2. **Transferred flag + date on every asset table** (A, B, E, F, G, H) — show
   the transfer-date field only when "Whether transferred" = Yes; Part C shows
   the repayment date only when "Whether ... repaid" = Yes.
3. **Purpose / particulars enums differ per part** — Part A `AL.Purpose`, Part B
   `AL1B.PurposeDrp`, Part F `AL2H.Drpdwn`, jewellery (6 values), art
   `AL2HDropDown`; seed each from its own list.
4. **Everything at cost, in rupees**; no computed cell — every field is entered.
5. **Export** — `ScheduleAL.AsstLiabilitiesStartUps` with the flag and each
   non-empty array; the unlisted-company object is written only by Schedule AL-1.
