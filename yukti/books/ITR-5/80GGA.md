# Schedule 80GGA — Details of donations for scientific research or rural development

Form: **ITR-5**, A.Y. 2026-27. Sheet: **80GGA**. Section: `ded`. Block: **Schedule80GGA**.
Source: `python tools/dump.py --form ITR-5 --sheet "80GGA"` (rows / `--formulas` / `--dropdowns "80GGA"`) and `--schema Schedule80GGA` / `--leaves Schedule80GGA`; enums from `books/ITR-5/enums.json`; rules from `books/ITR-5/rules.json` (items 591–595, 652, 654, 673); validator/XML text from `sources/ITR-5/vba_text.txt`.

## The shape

Schedule 80GGA is a **repeating donation table** — one row per donee — with a computed **Total Donations** footer. The utility ships **four donation rows** (rows 6–9, Sl. No. auto 1..4) plus a Total row (row 11). The header spans two rows: `[C3]` **"Schedule 80GGA"**, `[E3]` **"Details of donations for scientific research or rural development"**; then a column-header row 4 and a sub-header row 5 that splits "Amount of Donation" into cash / other mode / total.

Each donee row is a schema object under the array `DonationDtlsSciRsrchRuralDev`. The three column totals plus the eligible total sit at sheet level (row 11) and map to four sibling total keys. The eligible-amount column caps cash donations at Rs 2,000 and caps the total at `Total_Income`.

## The items

### Block `Schedule80GGA` → array `DonationDtlsSciRsrchRuralDev` (one object per donee row, rows 6–9)

| Col | Field (row 4/5 label) | Cell (r6) | Type | Schema key | Rule |
|---|---|---|---|---|---|
| D | Sl. No. | `[D6]` (=1, then `D7=D6+1`) | auto counter | *(none — presentation)* | auto-increments down the rows |
| E | Relevant Clause under which deduction is claimed | `[E6]` | dropdown | `RelevantClauseUndrDedClaimed` | mandatory; 8-value enum (see Dropdowns) |
| F | Name of Donee | `[F6]` | text (maxLength 125) | `NameOfDonee` | mandatory |
| G | Address | `[G6]` | text (maxLength 200) | `AddressDetail.AddrDetail` | mandatory |
| H | City or Town or District | `[H6]` | text (maxLength 50) | `AddressDetail.CityOrTownOrDistrict` | mandatory |
| I | State Code | `[I6]` | dropdown | `AddressDetail.StateCode` | mandatory; 37-state enum (no foreign) |
| J | Pincode | `[J6]` | integer (100000–999999) | `AddressDetail.PinCode` | mandatory; 6 digits, cannot begin with '0' |
| K | PAN of donee | `[K6]` | text | `DoneePAN` | mandatory; valid PAN; ≠ assessee/verification PAN |
| L | Date of Donation | `[L6]` | date | *(no schema leaf — sheet-only column)* | see hidden/unmapped note below |
| M | Amount of Donation — Donation in cash | `[M6]` | integer (0–99999999999999) | `DonationAmtCash` | optional |
| N | Amount of Donation — Donation in other mode | `[N6]` | integer (0–99999999999999) | `DonationAmtOtherMode` | optional |
| O | Amount of Donation — Total Donation | `[O6]` | integer computed | `DonationAmt` | mandatory; `= MAX(SUM(M6,N6),0)` |
| P | Eligible Amount of Donation | `[P6]` | integer computed | `EligibleDonationAmt` | `= MIN(SUM(IF(M6>S6,0,M6),N6),Total_Income)` |

**Full leaf paths (verbatim schema keys):**
- `DonationDtlsSciRsrchRuralDev[].RelevantClauseUndrDedClaimed` (string, required)
- `DonationDtlsSciRsrchRuralDev[].NameOfDonee` (string, required)
- `DonationDtlsSciRsrchRuralDev[].AddressDetail.AddrDetail` (string, required)
- `DonationDtlsSciRsrchRuralDev[].AddressDetail.CityOrTownOrDistrict` (string, required)
- `DonationDtlsSciRsrchRuralDev[].AddressDetail.StateCode` (string, required)
- `DonationDtlsSciRsrchRuralDev[].AddressDetail.PinCode` (integer, required)
- `DonationDtlsSciRsrchRuralDev[].DoneePAN` (string, required)
- `DonationDtlsSciRsrchRuralDev[].DonationAmtCash` (integer, optional)
- `DonationDtlsSciRsrchRuralDev[].DonationAmtOtherMode` (integer, optional)
- `DonationDtlsSciRsrchRuralDev[].DonationAmt` (integer, required)
- `DonationDtlsSciRsrchRuralDev[].EligibleDonationAmt` (integer, optional)

### Block `Schedule80GGA` → totals (row 11, "Total Donations")

| Field | Cell | Type | Schema key | Rule |
|---|---|---|---|---|
| Total — Donation in cash | `[M11]` | integer computed | `TotalDonationAmtCash80GGA` | `= SUM(Donation_cash_80GGA)` |
| Total — Donation in other mode | `[N11]` | integer computed | `TotalDonationAmtOtherMode80GGA` | `= SUM(Donation_other_80GGA)` |
| Total — Total Donation | `[O11]` | integer computed | `TotalDonationsUs80GGA` | `= SUM(Donation_total_80GGA)` — **required** |
| Total — Eligible Amount of Donation | `[P11]` | integer computed | `TotalEligibleDonationAmt80GGA` | `= SUM(Donation_Eligible_80GGA)` |

## The rules the sheet computes (with cell references)

- **Total Donation per row = max(0, cash + other mode)** — `[O6]= MAX(SUM(M6,N6),0)` (repeats `[O7]`,`[O8]`,`[O9]`). i.e. `DonationAmt = MAX(0, DonationAmtCash + DonationAmtOtherMode)`. Matches rules.json A591: *"In Sch 80GGA, Total Donation should be equal to the sum of Donation in Cash and Donation in other mode."* and A592: *"…should be equal to the sum of (i+ii)"*.
- **Cash cap of Rs 2,000 helper** — `[S6]= IF(M6=0,0,2000)` (present at `S6,S7,S9`; `S8` blank in dump but the `P8` formula still references `S8`). This is the eligible-cash ceiling used by the eligible-amount column.
- **Eligible Amount of Donation** — `[P6]= MIN(SUM(IF(M6>S6,0,M6),N6),Total_Income)`. Meaning: if cash (`M6`) exceeds Rs 2,000 (`S6`) the cash portion is dropped to 0 for eligibility (only "other mode" counts), the eligible amount is capped at `Total_Income`. Matches rules.json A593: *"In Sch 80GGA, Eligible Amount donated in cash should not exceed Rs. 2000"*. (Pattern repeats `[P7]`,`[P8]`,`[P9]`.)
- **Sl. No. auto-increment** — `[D7]= D6+1` (repeats down): the serial number is computed, not entered.
- **Column totals (row 11)** — `[M11]= SUM(Donation_cash_80GGA)`, `[N11]= SUM(Donation_other_80GGA)`, `[O11]= SUM(Donation_total_80GGA)`, `[P11]= SUM(Donation_Eligible_80GGA)` (the four named ranges are the `M6:M9` / `N6:N9` / `O6:O9` / `P6:P9` columns).
- **Donee PAN validation** (VBA, `sources/ITR-5/vba_text.txt`): *"PAN of donee … is Invalid. PAN format should be First 5 Alphabets, next 4 digits, then 1 Alphabet."* and *"Donee PAN cannot be assesse PAN or verification PAN."* Matches rules.json A594: *"In Sch 80GGA Donee PAN is same as \"Assesse PAN\" or \"PAN at Verification\""*.
- **Pincode validation** (VBA): *"Pin code of donee at Sr. No … must be 6 digits and cannot begin with '0'."* / *"cannot Contain Special Characters."*
- **Mandatory-field messages** (VBA): each of relevant clause, name of donee, address of donee, city/town/district of donee, state of donee, pin code of donee, PAN of donee is enforced *"at Sr. No …"*; and *"Enter the amount of donation either in field \"Donation in cash\" or \"Donation in other mode in schedule 80GGA\" at Sr. No …"* (donation amount is mandatory per filled row).
- **Cross-schedule (VI-A)** — rules.json A595: *"80GGA claimed in Sch VI A but details not provided in Schedule 80GGA"*; A673: *"Eligible amount of deduction claimed u/s 80GGA should not be more than user enterable amount"*; A654: *"Deduction u/s 80GGA will be allowed only to assessee having no business income"*. In `VI-A`, `scvia.Section80GGA` (`'VI-A'!$I$6`) is the user-entered claim and `scvia.Section80GGA_Calc` (`'VI-A'!$K$6`) the calculated eligible amount; the XML `<Section80GGA>` carries the total from this schedule.

## Dropdowns

**`[E6:E9]` Relevant Clause under which deduction is claimed** — named range `RelevantClause_80GGA`; schema enum values (`RelevantClauseUndrDedClaimed`): `80GGA2a`, `80GGA2aa`, `80GGA2b`, `80GGA2bb`, `80GGA2c`, `80GGA2cc`, `80GGA2d`, `80GGA2e`. Display list (8 + Select):
- `(Select)`
- `80GGA(2)(a)-Sum paid to Research Association or University, college or other institution for Scientific Research`
- `80GGA(2)(aa)-Sum paid to Research Association or University, college or other institution for Social science or Statistical Research`
- `80GGA(2)(b)-Sum paid to an association or institution for Rural Development`
- `80GGA(2)(bb)-Sum paid to PSU or Local Authority or  an association or institution approved by the National Committee for carrying out any eligible project`
- `80GGA(2)(c)-Sum paid to an association or institution for Conservation of Natural Resources or for afforestation`
- `80GGA(2)(cc)-Sum paid for Afforestation, to the funds, which are notified by Central Govt.`
- `80GGA(2)(d)-Sum paid for Rural Development to the funds, which are notified by Central Govt.`
- `80GGA(2)(e)-Sum paid to National Urban Poverty Eradication Fund as setup and notified by Central Govt.`

**`[I6:I9]` State Code** — named range `StateWithoutForeign` (no foreign option). Values:
- `(Select)`
- `01-Andaman and Nicobar Islands`
- `02-Andhra Pradesh`
- `03-Arunachal Pradesh`
- `04-Assam`
- `05-Bihar`
- `06-Chandigarh`
- `07-Dadra Nagar and Haveli`
- `08-Daman and Diu`
- `09-Delhi`
- `10-Goa`
- `11-Gujarat`
- `12-Haryana`
- `13-Himachal Pradesh`
- `14-Jammu and Kashmir`
- `15-Karnataka`
- `16-Kerala`
- `17-Lakshadweep`
- `18-Madhya Pradesh`
- `19-Maharashtra`
- `20-Manipur`
- `21-Meghalaya`
- `22-Mizoram`
- `23-Nagaland`
- `24-Odisha`
- `25-Puducherry`
- `26-Punjab`
- `27-Rajasthan`
- `28-Sikkim`
- `29-Tamil Nadu`
- `30-Tripura`
- `31-Uttar Pradesh`
- `32-West Bengal`
- `33-Chattisgarh`
- `34-Uttarakhand`
- `35-Jharkhand`
- `36-Telangana`
- `37-Ladakh`

**Other data-validated cells with no enumerated list** (source is a length limit, not a picklist): `[F6:F9]` name (125), `[G6:G9]` address (200), `[H6:H9]` city (50), `[J6:J9]` pincode (6), `[K6:K9]` PAN (10), `[L6:L9]` date (10), `[M6:N9]` amounts (0), `[N11:P11]` (0) — no values to enumerate.

## What repeats and what is one figure

- **Repeats:** the donee row (E..P) — array `DonationDtlsSciRsrchRuralDev[]`. Utility ships **4 rows** (r6–r9); the build should treat it as an add-row table.
- **One figure each:** the four row-11 totals — `TotalDonationAmtCash80GGA`, `TotalDonationAmtOtherMode80GGA`, `TotalDonationsUs80GGA`, `TotalEligibleDonationAmt80GGA` — each a single computed sum over the rows.

## Mandatory

From the schema `required`:
- Block-level: **`TotalDonationsUs80GGA`** (the only top-level required key).
- Per array element (`DonationDtlsSciRsrchRuralDev[]` required): `RelevantClauseUndrDedClaimed`, `NameOfDonee`, `AddressDetail` (and within it `AddrDetail`, `CityOrTownOrDistrict`, `StateCode`, `PinCode`), `DoneePAN`, `DonationAmt`.
- Optional per element: `DonationAmtCash`, `DonationAmtOtherMode`, `EligibleDonationAmt`. Optional totals: `TotalDonationAmtCash80GGA`, `TotalDonationAmtOtherMode80GGA`, `TotalEligibleDonationAmt80GGA`. (But VBA enforces that at least one of cash/other-mode is entered per filled row.)

## Hidden rows — not built

- No rows are marked **H** in the dump — the whole sheet is visible. Nothing to suppress.
- **`[C12]` `Button_80GGA`** (`'80GGA'!$C$12`) is the "add row" macro button — a UI control, not a data field; do not build it as an item.
- **Helper column `S` (`[S6]`,`[S7]`,`[S9]`)** — the `IF(M#=0,0,2000)` cash-cap helper. It is a calculation aid, not a form field and has no schema leaf; do not emit it.
- **Date of Donation `[L6:L9]`** (`Date_of_donation_80GGA`, `'80GGA'!$L$6:$L$8`) — present on the sheet as a visible column but **has no leaf under `Schedule80GGA`** in the schema (no `DateOfDonation` key); it is not exported to XML. Capture it in the UI if desired but it is not part of the schema mapping.

## What this means for the build

- Build one add-row table for `DonationDtlsSciRsrchRuralDev[]` with columns E..P; ship 4 blank rows to match the utility but allow add/remove.
- Sl. No. (`D`), Total Donation (`O`), Eligible Amount (`P`) and helper `S` are **computed** — do not accept input: `DonationAmt = max(0, cash + other)`, and `EligibleDonationAmt = min((cash>2000 ? 0 : cash) + other, Total_Income)`.
- Enforce mandatories per filled row (clause, name, address, city, state, pincode, PAN, and donation amount = at least one of cash/other). PAN: valid format and not equal to assessee/verification PAN. Pincode: 6 digits, not leading 0.
- Wire the four row-11 totals as `SUM` over the rows → `TotalDonationAmtCash80GGA` / `TotalDonationAmtOtherMode80GGA` / `TotalDonationsUs80GGA` (required) / `TotalEligibleDonationAmt80GGA`.
- Feed `TotalDonationsUs80GGA` / eligible total across to Schedule VI-A (`scvia.Section80GGA` / `scvia.Section80GGA_Calc`); the deduction is only allowed to an assessee with no business income (A654) and the VI-A eligible claim must not exceed the calculated amount (A673).
