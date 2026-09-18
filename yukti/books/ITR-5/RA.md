# Schedule RA — Donations to research associations etc. (deduction u/s 35)

Form: **ITR-5**, A.Y. 2026-27. Sheet: **RA**. Section: `ded`. Block: **Schedule80RA**.
Source: `python tools/dump.py --form ITR-5 --sheet "RA"` (rows / --formulas / --dropdowns) and `--schema Schedule80RA` / `--leaves Schedule80RA`; rules from `books/ITR-5/rules.json`; named ranges + XML tag names from `sources/ITR-5/vba_text.txt`; ESR CheckRA linkage cross-read from `books/ITR-5/ESR.md`.

## The shape

Schedule RA is a **repeating detail table** — one row per donee — that sits behind Schedule ESR's **CheckRA** flag. It is the list of donations to research associations etc. for which deduction is claimed under **section 35(1)(ii) / 35(1)(iia) / 35(1)(iii) / 35(2AA)**.

Header `[C3]` = "Schedule RA"; `[E3]` (verbatim): **"Details of donations to research associations etc. [deduction under sections 35(1)(ii) or 35(1)(iia) or 35(1)(iii) or 35(2AA)]"**.

Column header row is split across `[D4]..[K4]` and a sub-header `[K5]..[N5]`:
- `[D4]` **Sl.No** — auto-numbered (`D7=D6+1`), not an input.
- `[E4]` **Name of Donee**
- `[F4]` **Address**
- `[G4]` **City or Town or District**
- `[H4]` **State Code**
- `[I4]` **Pincode**
- `[J4]` **PAN of the donee**
- `[K4]` **Amount of donation**, split into four sub-columns: `[K5]` **Donation in cash**, `[L5]` **Donation in other mode**, `[M5]` **Total Donation**, `[N5]` **Eligible Amount of Donation**.

Data-entry rows are **6-9** (utility ships 4 blank rows; the schema array is unbounded — "add row"). Row **11** = **"Total Donation"** totals. Row **13** = a Note. No hidden rows.

## The items

### Block `Schedule80RA` → array `DonationDtlsRsrchAssctn[]` (one object per donee row 6-9)

| Col (cell) | Field | Type | Schema key (`DonationDtlsRsrchAssctn[].…`) | Rule / dropdown |
|---|---|---|---|---|
| D (D6:D9) | Sl.No | auto int | — (not in schema) | `D7=D6+1` auto-number |
| E (E6:E9) | Name of Donee | string ≤125 | `NameOfDonee` | required; named range `Name_of_Donee_RA` |
| F (F6:F9) | Address | string ≤200 | `AddressDetail.AddrDetail` | required; `Address_RA` |
| G (G6:G9) | City or Town or District | string ≤50 | `AddressDetail.CityOrTownOrDistrict` | required; `City_Town_District_RA` |
| H (H6:H9) | State Code | enum(37) | `AddressDetail.StateCode` | required; dropdown `StateWithoutForeign`; `State_Code_RA` |
| I (I6:I9) | Pincode | int 100000-999999 | `AddressDetail.PinCode` | required; `Pincode_RA` |
| J (J6:J9) | PAN of the donee | string | `DoneePAN` | required; `PAN_of_donee_RA` |
| K (K6:K9) | Donation in cash | int 0-99999999999999 | `DonationAmtCash` | `Donation_cash_RA` |
| L (L6:L9) | Donation in other mode | int 0-99999999999999 | `DonationAmtOtherMode` | `Donation_other_RA` |
| M (M6:M9) | Total Donation | int 0-99999999999999 | `DonationAmt` | **required**; computed `M6=MAX(SUM(K6,L6),0)`; `Donation_total_RA` |
| N (N6:N9) | Eligible Amount of Donation | int 0-99999999999999 | `EligibleDonationAmt` | input; `Donation_Eligible_RA` |

### Block `Schedule80RA` → totals (row 11 — one figure each, not repeated)

| Cell | Field | Type | Schema key | Formula |
|---|---|---|---|---|
| K11 | Total donation in cash | int | `TotalDonationAmtCash80RA` | `SUM(Donation_cash_RA)` |
| L11 | Total donation in other mode | int | `TotalDonationAmtOtherMode80RA` | `SUM(Donation_other_RA)` |
| M11 | Total Donation | int | `TotalDonationsUs80RA` | `SUM(Donation_total_RA)` |
| N11 | Total Eligible Amount | int | `TotalEligibleDonationAmt80RA` | `SUM(Donation_Eligible_RA)` |

XML output tags (from `vba_text.txt`): `DoneeDetail` wraps `DoneeName`, `DoneePAN`, `AddressDetail{AddrDetail, CityOrTownOrDistrict, StateCode, PinCode}`, `DonationAmtCash`, `DonationAmtOtherMode`, `DonationAmt`, `DonationElgAmt`.

## The rules the sheet computes (with cell references)

- **Per-row Total Donation = max(0, cash + other mode)** — `[M6]= MAX(SUM(K6,L6),0)`, pattern repeats `M6:M9`. Maps `DonationAmt = max(0, DonationAmtCash + DonationAmtOtherMode)`. rules.json **A620**: *"Schedule RA, total donation should be equal to donation in cash + donation in other mode"*.
- **Total cash** — `[K11]= SUM(Donation_cash_RA)` → `TotalDonationAmtCash80RA`. rules.json **A621**: *"total donation in cash should be equal to the bifurcation of donation in cash"*.
- **Total other mode** — `[L11]= SUM(Donation_other_RA)` → `TotalDonationAmtOtherMode80RA`. rules.json **A622**: *"total donation in other mode should be equal to the bifurcation of donation in other than cash"*.
- **Total donation** — `[M11]= SUM(Donation_total_RA)` → `TotalDonationsUs80RA`. rules.json **A623**: *"Total donation should be equal to bifurcation of total donation"*.
- **Total eligible** — `[N11]= SUM(Donation_Eligible_RA)` → `TotalEligibleDonationAmt80RA`.
- **Auto Sl.No** — `[D7]= D6+1` (repeats D7:D9).

## Tie to Schedule ESR (the CheckRA flag)

Whole schedule is **greyed off / enabled** by Schedule ESR. Note `[C13]` (verbatim): *"Note-In case any deduction is claimed under sections 35(1)(ii) or 35(1)(iia) or 35(1)(iii) or 35(2AA) at COLUMN 3 in Schedule ESR then at least one row is mandatory in Schedule RA otherwise whole schedule should be greyed off."*

Column 3 of ESR = `[F4]` "Amount of deduction allowable (3)". The trigger rows in ESR are `35(1)(ii)` (Sl. ii, F6), `35(1)(iia)` (Sl. iii, F7), `35(1)(iii)` (Sl. iv, F8), `35(2AA)` (Sl. vi, F10). ESR's `CheckRA` flag `[K3]` fires TRUE when the sum of those cells' allowable/debited amounts > 0 (see `books/ITR-5/ESR.md`). When TRUE → at least one RA donee row is mandatory; when FALSE → RA greyed off.

## Dropdowns

- **`[H6:H9]` State Code → named range `StateWithoutForeign`** (37 values): `(Select)`, `01-Andaman and Nicobar Islands`, `02-Andhra Pradesh`, `03-Arunachal Pradesh`, `04-Assam`, `05-Bihar`, `06-Chandigarh`, `07-Dadra Nagar and Haveli`, `08-Daman and Diu`, `09-Delhi`, `10-Goa`, `11-Gujarat`, `12-Haryana`, `13-Himachal Pradesh`, `14-Jammu and Kashmir`, `15-Karnataka`, `16-Kerala`, `17-Lakshadweep`, `18-Madhya Pradesh`, `19-Maharashtra`, `20-Manipur`, `21-Meghalaya`, `22-Mizoram`, `23-Nagaland`, `24-Odisha`, `25-Puducherry`, `26-Punjab`, `27-Rajasthan`, `28-Sikkim`, `29-Tamil Nadu`, `30-Tripura`, `31-Uttar Pradesh`, `32-West Bengal`, `33-Chattisgarh`, `34-Uttarakhand`, `35-Jharkhand`, `36-Telangana`, `37-Ladakh`. Schema `StateCode` enum carries the 37 numeric codes (`01`..`37`).

No other list dropdowns. The remaining data-validations on E/F/G/I/J/K/L/N (`source` values 125/200/50/6/10/0) are text-length / numeric-format validations (matching schema maxLength/min-max), **not** value pick-lists.

## What repeats and what is one figure

- **Repeats** (array `DonationDtlsRsrchAssctn[]`, one object per donee, rows 6-9 in utility, unbounded in schema): Name, Address, City/Town/District, State Code, Pincode, PAN, Donation cash / other mode / total / eligible.
- **One figure** (schedule totals, row 11): `TotalDonationAmtCash80RA`, `TotalDonationAmtOtherMode80RA`, `TotalDonationsUs80RA`, `TotalEligibleDonationAmt80RA`.

## Mandatory

- **Block-level `required`** (schema): `TotalDonationsUs80RA`.
- **Per array item `required`** (`*` in leaves): `NameOfDonee`, `AddressDetail.AddrDetail`, `AddressDetail.CityOrTownOrDistrict`, `AddressDetail.StateCode`, `AddressDetail.PinCode`, `DoneePAN`, `DonationAmt`.
- **Conditional**: at least one array row is mandatory when ESR `CheckRA` = TRUE (see ESR tie above); otherwise the whole schedule is greyed off / optional.
- Not required by schema: `DonationAmtCash`, `DonationAmtOtherMode`, `EligibleDonationAmt`, and the other three totals.

## Hidden rows — not built

**None.** No row in the RA sheet is marked `H` in the utility dump. (Rows 10 and 12 are blank spacers between data rows 6-9, the total row 11, and the note row 13 — not hidden data rows.)

## What this means for the build

- Build a **repeating donee table** bound to `DonationDtlsRsrchAssctn[]` with the 10 field columns above; auto-number Sl.No; enforce the State dropdown (`StateWithoutForeign` → code `01`..`37`), Pincode 100000-999999, PAN format, and integer amounts 0-99999999999999.
- **Compute `DonationAmt` = max(0, `DonationAmtCash` + `DonationAmtOtherMode`)** per row (A620); do not accept it as free input even though schema marks it required.
- Compute the four **row-11 totals** as sums across rows (A621/A622/A623); `TotalDonationsUs80RA` is the block-required total.
- **Enable/grey the whole schedule from Schedule ESR**: show + require ≥1 row iff ESR CheckRA is TRUE (any of 35(1)(ii)/(iia)/(iii)/(2AA) amounts entered in ESR col 3 / debited col 2); else grey off and emit nothing.
- Per-item required fields (Name, full Address incl. State+Pincode, PAN, DonationAmt) must be validated on any populated row.
