# Schedule IF — Information regarding partnership firms in which the assessee is a partner

Form: **ITR-5**, A.Y. 2026-27. Sheet: **IF**. Section: `other`. Block: **ScheduleIF**.
Source: `python tools/dump.py --form ITR-5 --sheet "IF"` (rows / --formulas / --dropdowns) and `--schema ScheduleIF` / `--leaves ScheduleIF`; cell mappings from `books/ITR-5/sheet_map.json`; rules from `books/ITR-5/rules.json`.

## The shape

Schedule IF is a **repeating table** of the partnership firms / LLPs in which the assessee is a partner or member at any time during the year. Header `[E3]` reads (verbatim): **"Sch IF Information regarding partnership firm in which you are partner anytime during the year"**. Section title `[C4]` = **"FIRMS IN WHICH PARTNER"**.

Above the table sits one count field, `[D4]` **"Number of firms in which you are partner"** — the value is entered / held in cell **`IF!$L$4`** (schema key `PartnerInNumberOfFirms`).

The table has eight data columns, header row 5 (`[E5]..[L5]`), with a numbering sub-header row 6 (`[J6] i`, `[K6] ii`, `[L6] iii`), **four data rows (rows 7-10)**, and a **Total** row (row 11, `[D11] Total`). Serial numbers auto-increment: `[D8]= D7+1`, `[D9]= D8+1`, `[D10]= D9+1` (row 7 = Sl.No. 1).

Each data row is one entry of the schema array `PartnerFirmDetails[]`. The three amount columns (share in profit `J`, interest `K`, capital balance `L`) are summed into the Total row.

## The items

### Block `ScheduleIF` — count and totals

| Sheet ref | Field label (verbatim) | Type | Schema key | Rule / cell |
|---|---|---|---|---|
| `[D4]` / value at `[L4]` | Number of firms in which you are partner | input, integer | `PartnerInNumberOfFirms` | `IF!$L$4`; min 0, max 99999999999999; **required** |
| `[J11]` | Total — Amount of share in the profit | computed, integer | `TotalProfitShareAmt` | `[J11]= SUM(ProfitShareAmt)` → `IF!$J$11`; **required** |
| `[K11]` | Total — Amount of interest due or received | computed, integer | `TotalIntrstAmtDueOrRecv` (utility named range `TotalAmountInterestDue`) | `[K11]= SUM(AmountInterestDue)` → `IF!$K$11` |
| `[L11]` | Total — Capital balance on 31st March | computed, integer | `TotalFirmCapBalOn31Mar` | `[L11]= SUM(FirmCapBalOn31Mar)` → `IF!$L$11`; **required** |

### Block `ScheduleIF` → `PartnerFirmDetails[]` (repeating, one object per firm, rows 7-10)

| Col | Field label (verbatim, row 5) | Type | Schema key | Cell range | Constraints |
|---|---|---|---|---|---|
| D | Sl.No. | auto | (none — display only) | `D7:D10` | `D8=D7+1`, `D9=D8+1`, `D10=D9+1` |
| E | Name of the Firm | input, string | `FirmName` | `IF!$E$7:$E$10` | maxLength 125; **required** |
| F | PAN of the firm | input, string | `FirmPAN` | `IF!$F$7:$F$10` | **required** |
| G | Whether the firm is liable for audit? (Yes/No) | dropdown, string | `IsLiableToAudit` | `IF!$G$7:$G$10` | (Select)/Yes/No; **required** |
| H | Whether section 92E is applicable to firm? (Yes/ No) | dropdown, string | `Sec92EFirmFlag` | `IF!$H$7:$H$10` | (Select)/Yes/No; **required** |
| I | Percentage Share in the profit of the firm | input, number | `ProfitSharePercent` | `IF!$I$7:$I$10` | min 0, max 100; **required** |
| J (i) | Amount of share in the profit | input, integer | `ProfitShareAmt` | `IF!$J$7:$J$10` | min -99999999999999, max 99999999999999; **required** |
| K (ii) | Amount of interest due or received | input, integer | `IntrstAmtDueOrRecv` (utility named range `AmountInterestDue`) | `IF!$K$7:$K$10` | min 0, max 99999999999999 |
| L (iii) | Capital balance on 31st March in the firm | input, integer | `FirmCapBalOn31Mar` | `IF!$L$7:$L$10` | min -99999999999999, max 99999999999999; **required** |

**Full leaf paths (verbatim schema keys):**
- `PartnerInNumberOfFirms`
- `PartnerFirmDetails[].FirmName` / `.FirmPAN` / `.IsLiableToAudit` / `.Sec92EFirmFlag` / `.ProfitSharePercent` / `.ProfitShareAmt` / `.IntrstAmtDueOrRecv` / `.FirmCapBalOn31Mar`
- `TotalProfitShareAmt` / `TotalIntrstAmtDueOrRecv` / `TotalFirmCapBalOn31Mar`

Note the two names that differ between the utility's named range and the schema key: utility `AmountInterestDue` ↔ schema `IntrstAmtDueOrRecv`; utility `TotalAmountInterestDue` ↔ schema `TotalIntrstAmtDueOrRecv`.

## The rules the sheet computes (with cell references)

- **Total share in profit** — `[J11]= SUM(ProfitShareAmt)` (sums `IF!$J$7:$J$10`) → `TotalProfitShareAmt`.
- **Total interest due/received** — `[K11]= SUM(AmountInterestDue)` (sums `IF!$K$7:$K$10`) → `TotalIntrstAmtDueOrRecv`.
- **Total capital balance** — `[L11]= SUM(FirmCapBalOn31Mar)` (sums `IF!$L$7:$L$10`) → `TotalFirmCapBalOn31Mar`.
- **Sl.No. auto-increment** — `[D8]= D7+1`, `[D9]= D8+1`, `[D10]= D9+1` (row 7 is serial 1).

Cross-schedule validation rules (from `books/ITR-5/rules.json`):
- **cat A n731** (Schedule IF): *"In \"Schedule IF\" the Total of col \"Amount of share in the profit\" should be equal to sum of value entered in individual"* — i.e. `TotalProfitShareAmt` must equal the sum of the per-firm `ProfitShareAmt`.
- **cat B n55** (IF): *"In \"Schedule IF\", Total of Col \"Amount of interest due or received\" should be equal to Sl. No. 14xi(b) of Schedule Profit & Loss Account"* — `TotalIntrstAmtDueOrRecv` must tie to P&L 14xi(b).
- **cat A n56 / n57** (Part A-General): *"If Due date 31st October / 30th November is selected, kindly fill Schedule IF or Schedule 5A or audit details in Part A Gen"* — Schedule IF is one of the schedules that satisfy the audit-due-date requirement.

## Dropdowns

| Cells | Values | Schema key |
|---|---|---|
| `G7:G10` | `(Select)`, `Yes`, `No` | `IsLiableToAudit` |
| `H7:H10` | `(Select)`, `Yes`, `No` | `Sec92EFirmFlag` |

(Source `"(Select),Yes,No"`, cells `G7:H10`.) The remaining "dropdowns" reported for cells `E7:E10` (125), `F7:F10` (10), `I7:I10` (0), `J7:J10`/`L7:L10` (-99999999999999), `K7:K10` (0), `L4` (0) are **numeric/length validation constraints, not value lists** (their `values` are null).

## What repeats and what is one figure

- **Repeats:** the firm table `PartnerFirmDetails[]` — the utility provides **four rows (7-10)**, one object per firm (name, PAN, audit flag, 92E flag, % share, share amount, interest, capital balance).
- **One figure each:** the count `PartnerInNumberOfFirms` (`L4`), and the three column totals `TotalProfitShareAmt` (`J11`), `TotalIntrstAmtDueOrRecv` (`K11`), `TotalFirmCapBalOn31Mar` (`L11`).

## Mandatory

From the schema `required`:
- Block level: `PartnerInNumberOfFirms`, `TotalProfitShareAmt`, `TotalFirmCapBalOn31Mar`.
- Per firm object (`PartnerFirmDetails[]`): `FirmName`, `FirmPAN`, `IsLiableToAudit`, `Sec92EFirmFlag`, `ProfitSharePercent`, `ProfitShareAmt`, `FirmCapBalOn31Mar`.
- **Not required:** `PartnerFirmDetails` (the array itself), `IntrstAmtDueOrRecv`, `TotalIntrstAmtDueOrRecv`.

## Hidden rows — not built

**None.** No row of sheet IF is marked hidden (H) in the dump; rows 3-11 are all visible. Nothing is suppressed here.

## What this means for the build

- Build a repeating firm table of up to four rows (schema array `PartnerFirmDetails[]`), each with the eight input fields E-L; column D (Sl.No.) is display-only and auto-increments from 1.
- Wire two Yes/No dropdowns (columns G and H) with the `(Select)/Yes/No` list; store the chosen string in `IsLiableToAudit` and `Sec92EFirmFlag`.
- `ProfitSharePercent` is a percentage capped at 100; the three amount columns (`ProfitShareAmt`, `IntrstAmtDueOrRecv`, `FirmCapBalOn31Mar`) are integers, two of which (share amount, capital balance) may be negative.
- Compute the three totals as SUMs over the four rows and emit `TotalProfitShareAmt`, `TotalIntrstAmtDueOrRecv`, `TotalFirmCapBalOn31Mar`. Enforce that `TotalProfitShareAmt` equals the sum of per-firm shares (rule n731) and that `TotalIntrstAmtDueOrRecv` ties to P&L 14xi(b) (rule n55).
- Carry the count `PartnerInNumberOfFirms` from cell `L4` (label at `D4`); it is mandatory.
- Remember the named-range vs schema-key mismatch: utility `AmountInterestDue`→schema `IntrstAmtDueOrRecv`, and `TotalAmountInterestDue`→`TotalIntrstAmtDueOrRecv`.
