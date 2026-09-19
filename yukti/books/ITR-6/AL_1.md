# The book of Schedule AL-1 — Assets and liabilities of an unlisted company · ITR-6, A.Y. 2026-27

Read row by row from the utility's **AL-1** sheet (rows 3-90, ten parts A-J),
with the hidden-row flags, the dropdowns and the formulas, and confirmed against
the schema block **`ScheduleAL.AsstLiabilitiesUnlistedCompany`**.

*"Assets and liabilities as at the end of the year (mandatorily required to be
filled up by an unlisted company) (other than a start-up for which Schedule AL-2
is to be filled up)."* This is a **company-only schedule** — ITR-2's Schedule AL
(three parts, individual assets) is a different, much smaller thing. AL-1 is an
opening-balance / acquired / transferred / closing-balance movement statement
across ten asset classes plus liabilities.

> **One block, two sheets.** `ScheduleAL` backs **both** AL-1 (this book,
> `AsstLiabilitiesUnlistedCompany`) and **AL-2** (`AsstLiabilitiesStartUps`,
> booked separately). The section map maps both sheets to `ScheduleAL`, so §12
> below carries the whole block's leaf keys, including the AL-2 (start-up)
> object, for completeness. This sheet fills only the **unlisted-company**
> object.

---

## 1 · When it applies

**Mandatory for an unlisted company** that is not a DPIIT start-up. The gating
question is row **D4** — *"Do you have Assets and liabilities as at the end of
the year as mentioned in Schedule AL-1?"* — answered by the dropdown at **H4**
(**(Select) / Yes / No**), filed as `AsstLiabilitiesUnlistedCompany.ALUnlistedCompanyFlag`
(enum **N / Y**). All amounts are in rupees, at **cost** (the amount columns say
"Cost of acquisition"), not market value.

---

## 2 · The shape — ten parts, each a movement table

| Part | Label (verbatim) | Schema array | Movement columns |
|---|---|---|---|
| **A** | Details of building or land appurtenant there to, or both, being a residential house | `DtlsBldLandResHouseUC[]` | single (address / cost / purpose) |
| **B** | Details of land or building or both not being in the nature of residential house | `DtlsBldLandNotResHouseUC[]` | single |
| **C** | Details of listed equity shares | `DtlsListedEquitySharesUC[]` | Open / Acquired / Transferred / Closing |
| **D** | Details of unlisted equity shares | `DtlsUnListedEquitySharesUC[]` | Open / Acquired / Transferred / Closing |
| **E** | Details of other securities | `DtlsOtherSecuritiesUC[]` | Open / Acquired / Transferred / Closing |
| **F** | Details of capital contribution to other entity | `DtlsCapitalContributionOthEntityUC[]` | Open / contributed / withdrawn / P&L / Closing |
| **G** | Details of Loans & Advances to any other concern (If money lending is not assessee's substantial business ) | `DtlsLoansAdvancesUC[]` | Open / received / paid / interest / Closing |
| **H** | Details of motor vehicle, aircraft, yacht or other mode of transport | `DtlsVehiclestransportUC[]` | single |
| **I** | Details of Jewellery, archaeological collections, drawings, paintings, sculptures, any work of art or bullion | `DtlsJewelleryArchCollectionsUC[]` | single |
| **J** | Details of liabilities — loans, deposits and advances taken from a person other than financial institution | `DtlsLiabilitiesUC[]` | Open / received / paid / interest / Closing |

Every table is **unlimited** (four seed rows each). There is **no total row and
no derivation** — each cell is entered; the amount cells are number-format
data-validations, not formulas.

---

## 3 · Part A — Residential house / land (`DtlsBldLandResHouseUC[]`)

Header row 6; data rows 8-11.

| Col | Label (verbatim) | Type / enum | Schema key | Req |
|---|---|---|---|---|
| C6 | SL.NO | serial | — | — |
| D6 | Address | text (max 200) | `Address` | yes |
| E6 | Pin code | integer | `PinCode` | yes |
| F6 | Date of acquisition | date DD/MM/YYYY | `AcquisitionDate` | yes |
| G6 | Cost of acquisition Rs. | integer | `AcquisitionCost` | yes |
| H6 | Purpose for which used | enum `AL.Purpose` | `Purpose` | yes |

## 4 · Part B — Non-residential land or building (`DtlsBldLandNotResHouseUC[]`)

Header row 16; data rows 17-20. Same five columns as A; the purpose list differs
(`AL1B.PurposeDrp`).

| Col | Label (verbatim) | Type / enum | Schema key | Req |
|---|---|---|---|---|
| D16 | Address | text (max 200) | `Address` | yes |
| E16 | Pin code | integer | `PinCode` | yes |
| F16 | Date of acquisition | date | `AcquisitionDate` | yes |
| G16 | Cost of acquisition Rs. | integer | `AcquisitionCost` | yes |
| H16 | Purpose for which used | enum `AL1B.PurposeDrp` | `Purpose` | yes |

## 5 · Part C — Listed equity shares (`DtlsListedEquitySharesUC[]`)

Header rows 25-26 (two-level). Data rows 27-30. Four movement blocks; share type
enum is **Equity Shares / Bonus Shares** only.

| Col | Label (verbatim) | Block | Schema key | Req |
|---|---|---|---|---|
| D26 | Number of shares | **Opening balance** | `OpenBalNumberOfShares` | yes |
| E26 | Type of share | Opening balance | `OpenBalShareType` (ES/BS) | yes |
| F26 | Cost of acquisition | Opening balance | `OpenBalAcquisitionCost` | yes |
| G26 | Number of shares | **Shares acquired during the year** | `ShrsAcqNumberOfShares` | |
| H26 | Type of share | Shares acquired during the year | `ShrsAcqShareType` (ES/BS) | |
| I26 | Cost of acquisition | Shares acquired during the year | `ShrsAcqAcquisitionCost` | |
| J26 | Number of shared | **Shares transferred during the year** | `ShrsTrsNumberOfShares` | |
| K26 | Type of share | Shares transferred during the year | `ShrsTrsShareType` (ES/BS) | |
| L26 | Sale consideration | Shares transferred during the year | `ShrsTrsSaleConsdr` | |
| M26 | Number of shares | **Closing balance** | `ClBalNumberOfShares` | |
| N26 | Type of share | Closing balance | `ClBalShareType` (ES/BS) | |
| O26 | Cost of acquisition | Closing balance | `ClBalAcquisitionCost` | |

(Column headers D25 **Opening balance**, G25 **Shares acquired during the year**,
J25 **Shares transferred during the year**, M25 **Closing balance**. The
utility label "Number of shared" at J26 is a typo in the source for
"Number of shares" — reproduced verbatim.)

## 6 · Part D — Unlisted equity shares (`DtlsUnListedEquitySharesUC[]`)

Header rows 34-35. Data rows 36-39. Adds company name/PAN and per-share pricing.

| Col | Label (verbatim) | Block | Schema key | Req |
|---|---|---|---|---|
| D34 | Name of company | — | `CompanyName` | yes |
| E34 | PAN | — | `PAN` | yes |
| F35 | Number of shares | **Opening balance** | `OpenBalNumberOfShares` | yes |
| G35 | Cost of acquisition | Opening balance | `OpenBalAcquisitionCost` | yes |
| H35 | Number of shares | **Shares acquired during the year** | `ShrsAcqNumberOfShares` | |
| I35 | Date of subscription / purchase | acquired | `SubscriptionPurchaseDate` | |
| J35 | Face value per share | acquired | `FaceValuePerShare` | |
| K35 | Issue price per share (in case of fresh issue) | acquired | `IssuePricePerShare` | |
| L35 | Purchase price per share (in case of purchase from existing shareholder) | acquired | `PurchasePricePerShare` | |
| M35 | Number of shared | **Shares transferred during the year** | `ShrsTrsNumberOfShares` | |
| N35 | Sale consideration | transferred | `SaleConsideration` | |
| O35 | Number of shares | **Closing balance** | `ClBalNumberOfShares` | yes |
| P35 | Cost of acquisition | Closing balance | `ClBalAcquisitionCost` | yes |

## 7 · Part E — Other securities (`DtlsOtherSecuritiesUC[]`)

Header rows 44-45. Data rows 46-49.

| Col | Label (verbatim) | Block | Schema key | Req |
|---|---|---|---|---|
| D44 | Type of securities | — | `SecuritiesType` (B/D/E/P/O) | yes |
| E44 | Others | — | `SecuritiesTypeOthers` | |
| F44 | Whether listed or unlisted | — | `ListedUnlistedFlag` (L/U) | yes |
| G45 | Number of securities | **Opening balance** | `OpenBalNumberOfSecurities` | yes |
| H45 | Cost of acquisition | Opening balance | `OpenBalAcquisitionCost` | yes |
| I45 | Number of securities | **Securities acquired during the year** | `ShrsAcqNumberOfSecurities` | |
| J45 | Date of subscription/ purchase | acquired | `SubscriptionPurchaseDate` | |
| K45 | Face value per share | acquired | `FaceValuePerShare` | |
| L45 | Issue price of security (in case of fresh issue) | acquired | `IssuePriceSecurity` | |
| M45 | Purchase price per security (in case of purchase from existing holder) | acquired | `PurchasePricePerSecurity` | |
| N45 | Number of securities | **Securities transferred during the year** | `ShrsTrsNumberOfSecurities` | |
| O45 | Sale consideration | transferred | `SaleConsideration` | |
| P45 | Number of securities | **Closing balance** | `ClBalNumberOfSecurities` | yes |
| Q45 | Cost of acquisition | Closing balance | `ClBalAcquisitionCost` | yes |

## 8 · Part F — Capital contribution to other entity (`DtlsCapitalContributionOthEntityUC[]`)

Header row 53; data rows 54-57.

| Col | Label (verbatim) | Schema key | Req |
|---|---|---|---|
| D53 | Name of entity | `EntityName` | yes |
| E53 | PAN | `PAN` | yes |
| F53 | Opening balance | `OpeningBalance` | yes |
| G53 | Amount contributed during the year | `AmtContributedDrgTheYr` | yes |
| H53 | Amount withdrawn during the year | `AmtWithdrawnDrgTheYr` | yes |
| I53 | Amount of profit/loss/ dividend/ interest debited or credited during the year | `AmtprofitLossDividend` | yes |
| J53 | Closing balance | `ClosingBalance` | yes |

## 9 · Part G — Loans & advances to any other concern (`DtlsLoansAdvancesUC[]`)

Header row 61; data rows 62-65. *"If money lending is not assessee's substantial
business."*

| Col | Label (verbatim) | Schema key | Req |
|---|---|---|---|
| D61 | Name of the person | `PersonName` | yes |
| E61 | PAN | `PAN` | yes |
| F61 | Opening Balance | `OpeningBalance` | yes |
| G61 | Amount received | `AmountReceived` | yes |
| H61 | Amount paid | `AmountPaid` | yes |
| I61 | Interest credited if any | `InterestCredited` | yes |
| J61 | Closing balance | `ClosingBalance` | yes |
| K61 | Rate of interest (%) | `InterestRate` (number) | yes |

## 10 · Part H — Motor vehicle, aircraft, yacht etc. (`DtlsVehiclestransportUC[]`)

Header row 69; data rows 70-73.

| Col | Label (verbatim) | Type / enum | Schema key | Req |
|---|---|---|---|---|
| D69 | Particulars of asset | enum (Motor Vehicle/Aircraft/Yacht/Others) | `AssetParticulars` | yes |
| E69 | Others (description) | text | `AssetParticularsOthers` | |
| F69 | Registration number of vehicle | text | `RegNumVehicle` | yes |
| G69 | Cost of acquisition | integer | `AcquisitionCost` | yes |
| H69 | Date of acquisition | date | `AcquisitionDate` | yes |
| I69 | Purpose for which used | enum `AL1I.PurposeDrp` | `Purpose` | yes |

## 11 · Part I — Jewellery / art / bullion (`DtlsJewelleryArchCollectionsUC[]`)

Header row 77; data rows 78-81.

| Col | Label (verbatim) | Type / enum | Schema key | Req |
|---|---|---|---|---|
| D77 | Particulars of asset | enum `AL1IDropDown` | `AssetParticulars` | yes |
| E77 | Description | text | `AssetParticularsOthers` | |
| F77 | Quantity | integer | `Quantity` | yes |
| G77 | Cost of acquisition | integer | `AcquisitionCost` | yes |
| H77 | Date of acquisition | date | `AcquisitionDate` | yes |
| I77 | Purpose of use | enum (Stock in trade / Investment) | `Purpose` | yes |

## 12b · Part J — Liabilities (`DtlsLiabilitiesUC[]`)

Header rows 85-86; data rows 87-90. Row D84 **Details of liabilities**; row D85
**Details of loans, deposits and advances taken from a person other than
financial institution**.

| Col | Label (verbatim) | Schema key | Req |
|---|---|---|---|
| D86 | Name of the person | `PersonName` | yes |
| E86 | PAN | `PAN` | yes |
| F86 | Opening Balance | `OpeningBalance` | yes |
| G86 | Amount received | `AmountReceived` | yes |
| H86 | Amount paid | `AmountPaid` | yes |
| I86 | Interest debited/paid if any | `InterestCredited` | yes |
| J86 | Closing balance | `ClosingBalance` | yes |
| K86 | Rate of interest (%) | `InterestRate` (number) | yes |

---

## 12 · The dropdowns (every list on the sheet, with all its values)

**`AL.Purpose`** — Part A purpose (H8:H11) → `Purpose`:

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
| Persons who were beneficial owners of shares holding not less than 10% of the voting power at any time of the previous year | BO |

**`AL1B.PurposeDrp`** — Part B purpose (H17:H20) → `Purpose`:
(Select), Own Office (OO), Factory (FA), Warehouse (WH), Godown (GD), Renting
(RE), Leasing (LE), Stock in trade (ST), Investment (IN), Persons who were
beneficial owners of shares holding not less than 10% of the voting power at any
time of the previous year (BO).

**Listed-shares share type** (Part C, E27:E30 / H27:H30 / K27:K30 / N27:N30) →
`*ShareType`: (Select), Equity Shares (ES), Bonus Shares (BS).

**Other-securities type** (Part E, D46:D49) → `SecuritiesType`:
(Select), Bonds (B), Debentures (D), Derivatives (E), Preference Shares (P),
Others (O). — *the source list writes " Preference Shares" with a leading space.*

**Whether listed or unlisted** (Part E, F46:F49) → `ListedUnlistedFlag`:
(Select), Listed (L), Unlisted (U).

**`AL1I.PurposeDrp`** — Part H purpose (I70:I73) → `Purpose`:
(Select), Own Business Use (OU), Employees Use (EU), Directors Use (DU), Stock in
trade (ST), Investment (IN), Renting (RE), Leasing (LE), Persons who were
beneficial owners of shares holding not less than 10% of the voting power at any
time of the previous year (BO).

**Vehicle particulars** (Part H, D70:D73) → `AssetParticulars`:
(Select), Motor Vehicle (M), Aircraft (A), Yacht (Y), Others (O).

**`AL1IDropDown`** — Jewellery/art particulars (Part I, D78:D81) → `AssetParticulars`:
(Select), Gold Jewellery (GJ), Silver Jewellery (SJ), Platinum Jewellery (PJ),
Diamond Jewellery (DJ), `Other precious metal Jewellery` (OMJ),
`Other precious stone Jewellery` (OSJ), Archaeological Collections (AC),
Drawings (DR), Paintings (PA), Sculptures (SC), Work of Art (WA), Bullion (BN),
Others (OT).

**Jewellery purpose** (Part I, I78:I81) → `Purpose`:
(Select), Stock in trade (ST), Investment (IN).

**Applicability gate** (H4, literal): (Select), Yes, No → `ALUnlistedCompanyFlag`
(filed N/Y).

---

## 13 · The schema block `ScheduleAL` — every leaf key (coverage)

`*` = required within a row of its array.

### `AsstLiabilitiesUnlistedCompany` (this sheet, AL-1)

`ALUnlistedCompanyFlag` (N/Y). Arrays and their row leaves:

- `DtlsBldLandResHouseUC[]`, `DtlsBldLandNotResHouseUC[]`: `Address`*, `PinCode`*, `AcquisitionDate`*, `AcquisitionCost`*, `Purpose`*.
- `DtlsListedEquitySharesUC[]`: `OpenBalNumberOfShares`*, `OpenBalShareType`*, `OpenBalAcquisitionCost`*, `ShrsAcqNumberOfShares`, `ShrsAcqShareType`, `ShrsAcqAcquisitionCost`, `ShrsTrsNumberOfShares`, `ShrsTrsShareType`, `ShrsTrsSaleConsdr`, `ClBalNumberOfShares`, `ClBalShareType`, `ClBalAcquisitionCost`.
- `DtlsUnListedEquitySharesUC[]`: `CompanyName`*, `PAN`*, `OpenBalNumberOfShares`*, `OpenBalAcquisitionCost`*, `ShrsAcqNumberOfShares`, `SubscriptionPurchaseDate`, `FaceValuePerShare`, `IssuePricePerShare`, `PurchasePricePerShare`, `ShrsTrsNumberOfShares`, `SaleConsideration`, `ClBalNumberOfShares`*, `ClBalAcquisitionCost`*.
- `DtlsOtherSecuritiesUC[]`: `SecuritiesType`*, `SecuritiesTypeOthers`, `ListedUnlistedFlag`*, `OpenBalNumberOfSecurities`*, `OpenBalAcquisitionCost`*, `ShrsAcqNumberOfSecurities`, `SubscriptionPurchaseDate`, `FaceValuePerShare`, `IssuePriceSecurity`, `PurchasePricePerSecurity`, `ShrsTrsNumberOfSecurities`, `SaleConsideration`, `ClBalNumberOfSecurities`*, `ClBalAcquisitionCost`*.
- `DtlsCapitalContributionOthEntityUC[]`: `EntityName`*, `PAN`*, `OpeningBalance`*, `AmtContributedDrgTheYr`*, `AmtWithdrawnDrgTheYr`*, `AmtprofitLossDividend`*, `ClosingBalance`*.
- `DtlsLoansAdvancesUC[]`, `DtlsLiabilitiesUC[]`: `PersonName`*, `PAN`*, `OpeningBalance`*, `AmountReceived`*, `AmountPaid`*, `InterestCredited`*, `ClosingBalance`*, `InterestRate`*.
- `DtlsVehiclestransportUC[]`: `AssetParticulars`*, `AssetParticularsOthers`, `RegNumVehicle`*, `AcquisitionCost`*, `AcquisitionDate`*, `Purpose`*.
- `DtlsJewelleryArchCollectionsUC[]`: `AssetParticulars`*, `AssetParticularsOthers`, `Quantity`*, `AcquisitionCost`*, `AcquisitionDate`*, `Purpose`*.

### `AsstLiabilitiesStartUps` (sibling — filed from Schedule AL-2, listed here for the shared block)

`ALStartUpsFlag` (N/Y). Arrays and their row leaves:

- `DtlsBldLandResHouseSU[]`, `DtlsBldLandNotResHouseSU[]`: `Address`*, `PinCode`*, `AcquisitionDate`*, `AcquisitionCost`*, `Purpose`*, `TransferFlag`*, `TransferDate`.
- `DtlsLoansAdvancesSU[]`: `PersonName`*, `PAN`*, `LoansAdvancesDate`*, `AmtLoansAdvances`*, `Amount`*, `LoansAdvancesFlag`*, `RepaymentDate`, `ClosingBalance`*, `InterestRate`*.
- `DtlsCapitalContributionSU[]`: `EntityName`*, `PAN`*, `CapitalContributionDate`*, `AmtContribution`*, `AmtWithdrawn`*, `AmtprofitLossDividend`*, `ClosingBalance`*.
- `DtlsAcqustSharesSecuritiesSU[]`: `EntityCompanyName`*, `PAN`*, `SharesSecuritiesType`*, `SharesSecuritiesTypeOthers`, `NumSharesSecuritiesAcq`*, `AcquisitionCost`*, `AcquisitionDate`*, `TransferFlag`*, `TransferDate`, `ClosingBalance`*.
- `DtlsVehiclestransportSU[]`: `AssetParticulars`*, `AssetParticularsOthers`, `RegNumVehicle`*, `AcquisitionCost`*, `AcquisitionDate`*, `Purpose`*, `TransferFlag`*, `TransferDate`.
- `DtlsJewelleryAcquiredSU[]`: `AssetParticulars`*, `Quantity`*, `AcquisitionCost`*, `AcquisitionDate`*, `Purpose`*, `TransferFlag`*, `TransferDate`, `ClosingBalance`*.
- `DtlsArchaeologicalCollctSU[]`: `AssetParticulars`*, `AssetParticularsOthers`, `Quantity`*, `AcquisitionCost`*, `AcquisitionDate`*, `Purpose`*, `TransferFlag`*, `TransferDate`, `ClosingBalance`*.
- `DtlsLiabilitiesSU[]`: `PersonName`*, `PAN`*, `OpeningBalance`*, `AmountReceived`*, `AmountPaid`*, `InterestCredited`*, `ClosingBalance`*, `InterestRate`*.

Every live label on the AL-1 sheet has a schema key under
`AsstLiabilitiesUnlistedCompany`; nothing on the sheet is excluded for want of a key.

---

## 14 · Cross-sheet feeds in / out

- **No numeric feed** to Part B-TI / Part B-TTI — AL-1 is a disclosure schedule;
  it computes nothing and is fed by nothing.
- **Part D (unlisted equity shares)** should reconcile with the unlisted-share
  holdings shown in **Part A-General** and, where sold, with **Schedule CG**.
- **Part A / B (immovable)** should reconcile with **Schedule HP** and the
  Balance Sheet's fixed-asset / investment blocks — at cost, so figures differ
  from any market value shown elsewhere; treat as a warning, not a hard rule.
- Liabilities in **Part J** should reconcile with the Balance Sheet's
  borrowings from non-institutional lenders.

## 15 · What is mandatory · what repeats

- `ALUnlistedCompanyFlag` (N/Y) for an unlisted company; within each row the
  columns marked required above. Opening/closing balances are required on the
  share/security/contribution/loan/liability tables; the acquired/transferred
  movement columns are optional (filled only when there was movement).
- **Every one of the ten tables repeats, unlimited.** No fixed single-figure
  lines and no totals on this sheet.

## 16 · Hidden rows

None. Every row of the AL-1 sheet in the applicable ranges is visible; the
utility hides nothing here. (Inter-table blank/formatting rows carry no label
and are not schema-backed.)

## 17 · What this means for the build

1. **Ten movement tables under one gate (`al` section).** Render each table as
   an unlimited card behind the `ALUnlistedCompanyFlag` (H4 Yes/No) gate.
2. **Four-block share/security tables** (C, D, E) carry Opening / Acquired /
   Transferred / Closing sub-columns — lay them out as grouped column headers,
   not one flat row.
3. **Purpose and particulars enums differ per part** — Part A `AL.Purpose`,
   Part B `AL1B.PurposeDrp`, Part H `AL1I.PurposeDrp`, jewellery `AL1IDropDown`;
   seed each from its own list.
4. **Everything at cost, in rupees**; no computed cell — every field is entered.
5. **Export** — `ScheduleAL.AsstLiabilitiesUnlistedCompany` with the flag and
   each non-empty array; the start-up object is written only by Schedule AL-2.
