# Schedule 80GGC — Details of contributions made to political parties (s.80GGC)

Block: `Schedule80GGC`. Section: `ded`. Sheet tab: `80GGC`.
Deduction for contributions made to a political party or electoral trust; only **non-cash** contributions are eligible, and it is **not allowed under the new tax regime**.

## The shape

- A header at `[C4]/[E4]` — *"Schedule 80GGC Details of contributions made to political parties"*.
- A two-row column header (`r6` + `r7`, `r7` splits the "Amount of contribution" column into cash / other-mode / total).
- **Five contribution rows, `r8:r12`** — one line per contribution (SI.No. i–v auto-numbered by `D9=D8+1`). This is the repeating array `Schedule80GGCDetails[]`.
- A **Total** row `r14` (`[D14] Total Contribution`) — four single-figure totals summing the five rows.
- Feeds Schedule VI-A: `scvia.Section80GGC` (`'VI-A'!$I$7`, user-enterable) and `scvia.Section80GGC_Calc` (`'VI-A'!$K$7`); `GTI_80GGC` = `'VI-A'!$T$3`.

## The items

### Block `Schedule80GGC` → array `Schedule80GGCDetails[]` (rows r8:r12, repeats up to 5)

| Sheet col (hdr) | Field | Type | Cells | Named range | Schema key | Rule |
|---|---|---|---|---|---|---|
| (i) `[D6]` | SI.No. | serial | D8:D12 | — | *(index, not stored)* | `D9=D8+1` auto-increment |
| (ii) `[E6]` | Date of Contribution | date `YYYY-MM-DD` | E8:E12 | `DateofDonation_80GGC` | `DonationDate` | must fall within the previous year (rule 589) |
| (iii) `[F7]` | Contribution in Cash | integer ≥0 | F8:F12 | `Donationincash_80GGC` | `DonationAmtCash` | enterable; **not eligible** (see I8) |
| (iv) `[G7]` | Contribution in Other Mode | integer ≥0 | G8:G12 | `Donationinothermode_80GGC` | `DonationAmtOtherMode` | enterable; the eligible portion |
| (v) `[H7]` | Total Contribution | integer ≥0 | H8:H12 | `TotalDonation_80GGC` | `DonationAmt` | computed `= MAX(SUM(F,G),0)` |
| (vi) `[I6]` | Eligible Amount of Contribution | integer ≥0 | I8:I12 | `EligibleAmountofDonation_80GGC` | `EligibleDonationAmt` | computed — non-cash only, capped at GTI |
| `[J6]` | Name of the political party | string maxLen 125 | J8:J12 | `Name_80GGC` | `PoliticalPartyName` | required to claim (rule 590) |
| `[K6]` | PAN of the political party | string (PAN) | K8:K12 | `Pan_80GGC` | `PoliticalPartyPAN` | required to claim (rule 590) |
| (vii) `[L6]` | Transaction Reference number for UPI transfer OR Cheque number/IMPS/NEFT/RTGS | string maxLen 50 | L8:L12 | `Chequeno_80GGC` | `TransactionRefNum` | required when other-mode > 0 (rules 582, 588) |
| (viii) `[M6]` | IFSC code of Bank | string maxLen 11 | M8:M12 | `IFSC_80GGC` | `IFSCCode` | required when other-mode > 0; validated vs RBI database (rule 4400 / n.881) |

### Block `Schedule80GGC` → totals (row r14, single figures)

| Sheet | Field | Type | Cell | Named range | Schema key |
|---|---|---|---|---|---|
| `[F14]` | Total contribution in cash | integer ≥0 | F14 | `Total_DonationInCash_80GGC` | `TotalDonationAmtCash80GGC` |
| `[G14]` | Total contribution in other mode | integer ≥0 | G14 | `Total_DonationInOtherMode_80GGC` | `TotalDonationAmtOtherMode80GGC` |
| `[H14]` `[D14] Total Contribution` | Total Contribution | integer ≥0 | H14 | `Total_Donation_80GGC` | `TotalDonationsUs80GGC` |
| `[I14]` | Total Eligible Amount of Contribution | integer ≥0 | I14 | `Total_Donation_Eligible_80GGC` | `TotalEligibleDonationAmt80GGC` |

## The rules the sheet computes (with cell references)

- **Total Contribution per row** `[H8]=MAX(SUM(F8,G8),0)` (same H9,H12; H10/H11 follow the pattern) — Total = cash + other-mode, floored at 0. (rules 584, 585: Total = cash + other mode = i + ii.)
- **Eligible Amount per row — the non-cash rule** `[I8]=MIN(SUM(IF(F8>0,0,F8),G8),Sheet8b.GrossTotalIncome)` (identical I9:I12). `IF(F>0,0,F)` forces the **cash** contribution to contribute **0** to the eligible amount, so only *Contribution in Other Mode* is eligible; the result is capped at Gross Total Income. (rule 586: eligible amount donated in cash must not be more than zero.)
- **Serial auto-increment** `[D9]=D8+1`.
- **Total cash** `[F14]=SUM(Donationincash_80GGC)`.
- **Total other mode** `[G14]=SUM(Donationinothermode_80GGC)`.
- **Total contribution** `[H14]=SUM(TotalDonation_80GGC)`.
- **Total eligible — new-regime block** `[I14]=IF(bacValue=1,0,SUM(EligibleAmountofDonation_80GGC))` — if the new tax regime is selected (`bacValue=1`) the eligible total is **0**; else it is the sum of column vi. (rules 581, 587.)

### Cross-schedule rules (from rules.json)

- **n.581** (cat A): If New tax regime is selected in Part A General, Schedule 80GGC is not required to be filled.
- **n.582** (cat A): If Sl. No. iii (cash) > 0, then Sl. No. iv, vii and viii are not required.
- **n.583** (cat A): If deduction u/s 80GGC is claimed in Sch VI-A sl. no. (a), it is mandatory to fill Schedule 80GGC.
- **n.584 / n.585** (cat A): Total Contribution must equal cash + other mode, and must equal (i + ii).
- **n.586** (cat A): Eligible Amount donated in cash must not be more than zero.
- **n.587** (cat A): Sl. No. D "Total Eligible Amount of Contribution" must equal total of column vi.
- **n.588** (cat A): If "Donation in other mode" > 0, details of such donation are required.
- **n.589** (cat A): Date of contribution must be within the previous year.
- **n.590** (cat A): Name and PAN of the political party are necessary to claim the deduction.
- **VI-A side** (n.870, n.910, n.970): eligible amount claimed u/s 80GGC must not exceed the user-enterable amount; not allowed for status "Local Authority" and "AJP"; subject to sl.no.9 − sl.no.10 of Part B-TI.
- **n.881 / n.4400**: IFSC under Bank Details in Sch 80GGC must match the RBI database (Primary Bank Account).

## Dropdowns

**No value-list dropdowns.** Every validation on this sheet is a length/format constraint with `values: null` — captured here for completeness:

- E8:E12 (date) — source `10`
- F8:F12, G8:G12, H8:H12, I8:I12, F14, G14, H14, I14:K14 — source `0` (numeric)
- K8:K12 (PAN) — source `10`
- L8:L12 (Transaction Ref / cheque no.) — source `50` (matches `TransactionRefNum` maxLength 50)
- M8:M12 (IFSC) — source `11` (matches `IFSCCode` maxLength 11)
- J8:J12 (party name) — source `145` *(note: schema `PoliticalPartyName` maxLength is 125; utility validation allows 145)*

## What repeats and what is one figure

- **Repeats:** `Schedule80GGCDetails[]` — rows r8:r12, up to 5 contribution lines (date, cash, other-mode, total, eligible, party name, PAN, transaction ref, IFSC).
- **One figure:** the four r14 totals — `TotalDonationAmtCash80GGC`, `TotalDonationAmtOtherMode80GGC`, `TotalDonationsUs80GGC`, `TotalEligibleDonationAmt80GGC`.

## Mandatory

From schema `required`:
- Block-level (r14): `TotalDonationAmtCash80GGC`, `TotalDonationAmtOtherMode80GGC`, `TotalDonationsUs80GGC`, `TotalEligibleDonationAmt80GGC`.
- Per array item: `DonationDate`, `DonationAmtCash`, `DonationAmtOtherMode`, `DonationAmt`, `EligibleDonationAmt`.
- Not schema-required but conditionally mandatory by validation rules: `PoliticalPartyName`, `PoliticalPartyPAN` (rule 590), `TransactionRefNum`, `IFSCCode` (rules 582 & 588, when other-mode > 0).

## Hidden rows — not built

**None.** All rows r4, r6, r7, r8–r12, r14 are visible (no `H` marker in the dump).

Dead named ranges to ignore (point at `#REF!` / removed columns, do not build):
- `NatureofTransaction_80GGC` → `'80GGC'!#REF!`
- `DI_Deduction_80GGC` → `#REF!`
- `DI_EligibleAmount_80GGC` → `#REF!`

## What this means for the build

- Build one repeating group of up to 5 rows mapping to `Schedule80GGCDetails[]`; auto-number the serial.
- **Cash is never eligible:** compute per-row `EligibleDonationAmt` from other-mode only (cash excluded), capped at Gross Total Income; `DonationAmt = cash + other-mode` (floored at 0).
- **New regime gate:** when `bacValue=1` (new tax regime selected in Part A General) suppress/zero the schedule — the eligible total forces to 0 and the schedule is not required.
- Require party Name + PAN to claim; require Transaction Ref + IFSC (with RBI IFSC validation) whenever a row has other-mode > 0, and skip iv/vii/viii when the row is cash-only.
- Roll the five rows into the four r14 totals and feed `scvia.Section80GGC` in Schedule VI-A (subject to the VI-A cap and status exclusions for Local Authority / AJP).
