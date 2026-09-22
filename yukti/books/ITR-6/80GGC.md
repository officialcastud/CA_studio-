# The book of Schedule 80GGC — ITR-6, A.Y. 2026-27

Read row by row from the utility's **80GGC** sheet, and confirmed against the
CBDT ITR-6 schema (`Schedule80GGC`) and the validation-rules document. Section
80GGC is the deduction for **contributions to political parties or an electoral
trust** by any person other than a local authority / an artificial juridical
person wholly or partly funded by government; on ITR-6 it captures the company's
non-80GGB political contributions. The schedule proves each contribution.

---

## 1 · The shape of the schedule

One table, headed **Schedule 80GGC — Details of contributions made to political
parties**. The utility gives live entry rows (9–12), a Total row (14), and a
*"(Do not delete blank rows)"* note (15). Column heads sit on rows 6–8 (row 6
names, row 7 cash/other/total sub-heads, row 8 the roman item letters i–x).

| Roman | Column head (rows 6–7) | Cell |
|---|---|---|
| (i) | Sl.No | D |
| (ii) | Date | E |
| (iii) | Amount of contribition — **Contribution in cash** | F |
| (iv) | Amount of contribition — **Contribution in other mode** | G |
| (v) | Amount of contribition — **Total Contribution** | H |
| (vi) | **Eligible Amount of Contribution** | I |
| (vii) | **Name of the political party** | J |
| (viii) | **PAN of the political party** | K |
| (ix) | **Transaction Reference number_incase of UPI transfer** | L |
| (x) | **IFS code of Bank** | M |

---

## 2 · The items, row by row

| Item | Label | Type | Schema key | Formula / derivation | Hidden? |
|---|---|---|---|---|---|
| (i) | Sl.No | auto int | (index of `Schedule80GGCDetails[]`) | `D10 = D9+1` | no |
| (ii) | Date | date `DD/MM/YYYY` | `DonationDate` | date of contribution | no |
| (iii) | Contribution in cash | amount ≥ 0 | `DonationAmtCash` | column F input | no |
| (iv) | Contribution in other mode | amount ≥ 0 | `DonationAmtOtherMode` | column G input | no |
| (v) | Total Contribution | computed | `DonationAmt` | `H = MAX(SUM(F,G),0)` | no |
| (vi) | Eligible Amount of Contribution | computed | `EligibleDonationAmt` | `I = MIN(SUM(IF(F>0,0,F),G), GTI_limit)` — see §4 | no |
| (vii) | Name of the political party | text (max 125) | `PoliticalPartyName` | column J | no |
| (viii) | PAN of the political party | PAN | `PoliticalPartyPAN` | column K | no |
| (ix) | Transaction Reference number_incase of UPI transfer | text (max 50) | `TransactionRefNum` | column L | no |
| (x) | IFS code of Bank | text (max 11) | `IFSCCode` | column M | no |

### Totals (row 14, required schema keys)

| Label | Schema key | Formula |
|---|---|---|
| Total Contribution — cash | `TotalDonationAmtCash80GGC` | `SUM(Donationincash_80GGC)` (F14) |
| Total Contribution — other mode | `TotalDonationAmtOtherMode80GGC` | `SUM(Donationinothermode_80GGC)` (G14) |
| Total Contribution — total | `TotalDonationsUs80GGC` | `SUM(…)`, forced to 0 under 115BAA/115BAB (H14) |
| Total eligible amount | `TotalEligibleDonationAmt80GGC` | `SUM(…)`, forced to 0 under 115BAA/115BAB (I14) |

Row 15 note: *"(Do not delete blank rows)"* — the blank rows are the array
template; deleting them breaks the SUM ranges.

There are **no dropdown lists with fixed enum values** on this sheet (column
validations are number/date/named-range formats). A large **bank-code helper
list** sits off to the right in columns **AC/AD** (rows 1–226, e.g. `ABHY →
ABHYUDAYA COOPERATIVE BANK LIMITED`, `SBIN → STATE BANK OF INDIA`; rows 201–226
are hidden). It is a lookup for the IFS-code column, **not a filed row** — no
schema key backs it, so it is not booked as data, only noted here.

---

## 3 · Cross-sheet feeds

**In**: `GTI_limit` (Gross Total Income, Part B-TI) caps the eligible amount;
`sheet1.NRI_115BA_1` and `Section115CurrA…` (Part A General regime flags) force
the totals to 0 under the concessional regimes.

**Out**: `Schedule80GGC.Schedule80GGCDetails[]` and the four totals; the eligible
total feeds **Schedule VI-A Part B** item **section 80GGC** (rule A835/A836:
VI-A Sl. No. 1 = 80G + 80GGB + 80GGA + 80GGC).

---

## 4 · The rules the sheet enforces

- **A589** — if (iii) *Contribution in cash* > 0, then (iv), (vi), (ix) and (x)
  are not required (cash earns no deduction). The eligible formula
  `MIN(SUM(IF(F>0,0,F),G),GTI_limit)` **drops the cash column** — only other-mode
  contributions are eligible.
- **A590** — (x) Total must equal (iii) cash + (iv) other mode.
- **A591 / A592 / A593** — totals A/B/C must equal the column sums of iii / iv / x.
- **A594** — if Gross Total Income is zero, eligible amount (D) cannot exceed 0.
- **A595** — if 80GGC is claimed in Sch VI-A, this schedule is mandatory.
- **A596** — deduction allowed only for contributions made **01.04.2025 to
  31.03.2026** (A.Y. 2026-27).
- **A597** — if "contribution in other mode" > 0, the Transaction Reference
  number and IFS code of Bank are mandatory.
- **A598** — Name and PAN of the political party are necessary to claim 80GGC.
- **A588** — if 115BAB / 115BA is selected in Part A General, Schedule 80GGC is
  not to be filled (totals forced to 0).

---

## 5 · What this means for the build

1. A repeatable table of the ten columns above → `Schedule80GGCDetails[]`.
2. Compute (v) Total = max(cash + other, 0); (vi) Eligible = min(other-mode only,
   GTI) — **cash is never eligible**.
3. Totals row = column sums, zeroed under 115BAA/115BAB.
4. Live checks: name + PAN mandatory; if other-mode > 0 then ref-number + IFS
   code mandatory; date within FY 2025-26; mandatory when 80GGC claimed in VI-A.
5. The AC/AD bank-code list is a helper lookup, not a filed field.
