# The book of Schedule 80GGB — ITR-6, A.Y. 2026-27

Read row by row from the utility's **80GGB** sheet, and confirmed against the
CBDT ITR-6 schema (`Schedule80GGB`) and the validation-rules document. Section
80GGB is the deduction for **contributions made by a company to political
parties or an electoral trust**; this schedule proves each contribution.

---

## 1 · The shape of the schedule

One table, headed **Schedule 80GGB — Details of contributions made by company to
political parties**. The utility gives five live entry rows (9–13), a Total row
(15), and a *"(Do not delete blank rows)"* note (16). The column heads sit on
rows 6–8 (row 6 the names, row 7 the cash/other/total sub-heads, row 8 the roman
item letters i–x).

| Roman | Column head (rows 6–7) | Cell |
|---|---|---|
| (i) | Sl.No | C |
| (ii) | Date | D |
| (iii) | Amount of contribition — **Contribution in cash** | E |
| (iv) | Amount of contribition — **Contribution in other mode** | F |
| (v) | Amount of contribition — **Total Contribution** | G |
| (vi) | **Eligible Amount of Contribution** | H |
| (vii) | **Name of the political party** | I |
| (viii) | **PAN of the political party** | J |
| (ix) | **Transaction Reference number_incase of UPI transfer** | K |
| (x) | **IFS code of Bank** | L |

---

## 2 · The items, row by row

| Item | Label | Type | Schema key | Formula / derivation | Hidden? |
|---|---|---|---|---|---|
| (i) | Sl.No | auto int | (index of `Schedule80GGBDetails[]`) | `C10 = C9+1` | no |
| (ii) | Date | date `DD/MM/YYYY` | `DonationDate` | date of contribution | no |
| (iii) | Contribution in cash | amount ≥ 0 | `DonationAmtCash` | column E input | no |
| (iv) | Contribution in other mode | amount ≥ 0 | `DonationAmtOtherMode` | column F input | no |
| (v) | Total Contribution | computed | `DonationAmt` | `G = MAX(SUM(E,F),0)` | no |
| (vi) | Eligible Amount of Contribution | computed | `EligibleDonationAmt` | `H = MIN(SUM(IF(E>0,0,E),F), GTI_limit)` — see §4 | no |
| (vii) | Name of the political party | text (max 125) | `PoliticalPartyName` | column I | no |
| (viii) | PAN of the political party | PAN | `PoliticalPartyPAN` | column J | no |
| (ix) | Transaction Reference number_incase of UPI transfer | text (max 50) | `TransactionRefNum` | column K | no |
| (x) | IFS code of Bank | text (max 11) | `IFSCCode` | column L | no |

### Totals (row 15, required schema keys)

| Label | Schema key | Formula |
|---|---|---|
| Total Contribution — cash | `TotalDonationAmtCash80GGB` | `SUM(Donationincash_80GGB)` (E15) |
| Total Contribution — other mode | `TotalDonationAmtOtherMode80GGB` | `SUM(Donationinothermode_80GGB)` (F15) |
| Total Contribution — total | `TotalDonationsUs80GGB` | `SUM(TotalDonation_…)`, forced to 0 under 115BAA/115BAB (G15) |
| Total eligible amount | `TotalEligibleDonationAmt80GGB` | `SUM(EligibleAmount…)`, forced to 0 under 115BAA/115BAB (H15) |

Row 16 note: *"(Do not delete blank rows)"* — the blank rows are the array
template; deleting them breaks the SUM ranges.

There are **no dropdown lists** with fixed values on this sheet (the column
validations are number/date/named-range formats, resolving to no enum).

---

## 3 · Cross-sheet feeds

**In**: `GTI_limit` (Gross Total Income, Part B-TI) caps the eligible amount;
`sheet1.NRI_115BA_1` (the 115BAA/115BAB regime flag from Part A General) forces
the totals to 0 under the concessional regimes.

**Out**: `Schedule80GGB.Schedule80GGBDetails[]` and the four totals; the eligible
total feeds **Schedule VI-A Part B** item **section 80GGB** (rule A835: VI-A
Sl. No. 1 = 80G + 80GGB + 80GGA + 80GGC).

---

## 4 · The rules the sheet enforces

- **A578** — if (iii) *Contribution in cash* > 0, then (iv), (vi), (ix) and (x)
  are not required (cash contributions earn no deduction, so eligible = 0). The
  eligible formula `MIN(SUM(IF(E>0,0,E),F),GTI_limit)` deliberately **drops the
  cash column** — only other-mode contributions are eligible.
- **A579** — (x) Total must equal (iii) cash + (iv) other mode.
- **A580 / A581 / A582** — the totals A/B/C must equal the column sums of iii / iv / x.
- **A583** — if Gross Total Income is zero, eligible amount (D) cannot exceed 0.
- **A584** — if 80GGB is claimed in Sch VI-A, this schedule is mandatory.
- **A585** — deduction allowed only for contributions made **01.04.2025 to
  31.03.2026** (A.Y. 2026-27).
- **A586** — if "contribution in other mode" > 0, the Transaction Reference
  number and IFSC code of Bank are mandatory.
- **A587** — Name and PAN of the political party are necessary to claim 80GGB.
- **A576** — if 115BAB / 115BAA is selected in Part A General, Schedule 80GGB is
  not required to be filled (totals forced to 0).

---

## 5 · What this means for the build

1. A repeatable table of the ten columns above → `Schedule80GGBDetails[]`.
2. Compute (v) Total = max(cash + other, 0); (vi) Eligible = min(other-mode only,
   GTI) — **cash is never eligible**.
3. Totals row = column sums, zeroed under 115BAA/115BAB.
4. Live checks: name + PAN mandatory; if other-mode > 0 then ref-number + IFSC
   mandatory; date within FY 2025-26; mandatory when 80GGB claimed in VI-A.
