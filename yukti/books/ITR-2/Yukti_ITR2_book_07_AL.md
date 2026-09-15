# The book of Schedule AL — Assets and liabilities at the end of the year · ITR-2, A.Y. 2026-27

Read row by row from the utility's **AL** sheet (38 rows), with the hidden-row
flags, and confirmed against `ScheduleAL`.

*"Assets and liabilities at the end of the year (other than those included in
Part A-BS) — applicable in a case where total income exceeds ₹1 crore."* On
ITR-2 there is no Part A-BS, so this is the whole statement.

---

## 1 · When it applies

**Total income above ₹1,00,00,000.** Below that the schedule may be left off;
above it the utility refuses the return without it. The gate is on **total
income** (after Chapter VI-A), not gross.

---

## 2 · The shape — three parts

| Part | What it is | Kind |
|---|---|---|
| **A** | Immovable assets — one row per property | table, unlimited |
| **B** | Movable assets — eight fixed lines | figures |
| *C* | *Interest in the assets of a firm or AOP* | **hidden** — business; not on ITR-2 |
| **C** | Liabilities in relation to the assets at A + B | one figure |

Everything is at **cost**, in rupees — the sheet says so on every amount
column. Not market value.

---

## 3 · Part A — Immovable assets

The opening question: *"Do you own any immovable asset?"* — on Yes, one row
per property:

| Column | Field | Rule |
|---|---|---|
| 1 | Sl. No. | |
| 2 | **Description** | required, max 25 — *"flat", "plot", "house"* |
| 3 | **Address** — nine parts | flat/door/block (required) · premises · road · locality (required) · town (required) · **state** (required, 38 codes) · **country** (required, 250 codes) · PIN · ZIP |
| 4 | **Amount — cost**, in rupees | required |

Schema: `ScheduleAL.ImmovableDetails[]` — `Description`, `AddressAL{ResidenceNo,
ResidenceName, RoadOrStreet, LocalityOrArea, CityOrTownOrDistrict, StateCode,
CountryCode, PinCode, ZipCode}`, `Amount`. A property abroad takes country and
ZIP; one in India takes state and PIN.

### Cross-checks worth having

Every property in **Schedule HP** should appear here at cost. Every foreign
immovable property in **Schedule FA table C** should appear here too, at the
same cost. The department reconciles all three.

---

## 4 · Part B — Movable assets

Eight fixed lines, each an amount at cost:

| Sl. | Line | Schema key |
|---|---|---|
| (i) | **Jewellery, bullion etc.** | `JewelleryBullionEtc` |
| (ii) | **Archaeological collections, drawings, paintings, sculpture or any work of art** | `ArchCollDrawPaintSulpArt` |
| (iii) | **Vehicles, yachts, boats and aircraft** | `VehiclYachtsBoatsAircrafts` |
| (iv) | Financial assets — heading | |
| (iv)(a) | **Bank, including all deposits** | `DepositsInBank` |
| (iv)(b) | **Shares and securities** | `SharesAndSecurities` |
| (iv)(c) | **Insurance policies** | `InsurancePolicies` |
| (iv)(d) | **Loans and advances given** | `LoansAndAdvancesGiven` |
| (iv)(e) | **Cash in hand** | `CashInHand` |

Schema: `ScheduleAL.MovableAsset{…}` — **all eight required** when the schedule
is present, at zero if nil.

### Cross-checks worth having

Bank deposits here against the accounts in Part B-TTI's bank table and Schedule
FA A1. Shares and securities against Schedule CG's holdings, the unlisted-share
table in Part A General, and Schedule FA A3. Insurance policies against the 80D
and 80C schedules.

---

## 5 · Part C — Liabilities

One figure: **liabilities in relation to the assets at A and B** —
`LiabilityInRelatAssets`, required. Loans taken to buy the assets above — the
housing loans in Schedule HP's 24(b) tables are the obvious source.

---

## 6 · What is mandatory

`MovableAsset` with all eight lines, and `LiabilityInRelatAssets`. On every
immovable row, description, the required address parts, and the amount.

## 7 · What repeats

The immovable table, unlimited. Nothing else.

---

## 8 · What this means for the build

1. **The gate** — the card is mandatory above ₹1 crore of total income and
   the check says so; below it, optional.
2. **Part A is a table** with the nine-part address (state+PIN or country+ZIP)
   and cost.
3. **Part B is eight fixed lines.** Part C one line.
4. **Three cross-checks** — HP properties and FA table C against Part A;
   FA A1 and the bank table against B(iv)(a); FA A3 and the unlisted-share
   table against B(iv)(b) — as warnings, since cost and value differ.
5. **Export** — `ScheduleAL` with all eight movable lines and the liability
   figure whenever it is written, and the immovable array when it has rows.
