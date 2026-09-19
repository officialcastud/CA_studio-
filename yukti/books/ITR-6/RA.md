# The book of Schedule RA — Donations to research associations · ITR-6, A.Y. 2026-27

Read row by row from the utility's **RA** sheet (14 rows, no hidden rows) and
confirmed against the CBDT ITR-6 schema's `Schedule80RA`. Every item number,
label, dropdown and formula below is the department's own; nothing is invented.

---

## 1 · Purpose — the donee list behind the 80GGA scientific-research claim

Schedule RA is the **donee-by-donee list of donations to research associations,
universities, colleges and institutions** under sections **35(1)(ii), 35(1)(iia),
35(1)(iii) and 35(2AA)**. It is the evidence table that sits behind the payments
routed through Schedule 80GGA / Chapter VI-A: where 80GGA carries the *figure*,
Schedule RA names *who received it*. It is one flat grid — a header, up to five
donee rows shipped (addable), and a computed total line. It carries no lettered
items of its own; the department cross-checks the total here against the
donation total in 80GGA and against the 35(1) weighted-deduction claim in the
profit-and-loss adjustments.

The sheet's own title states the scope outright: *"Details of donations to
research associations etc. [deduction under sections 35(1)(ii) or 35(1)(iia) or
35(1)(iii) or 35(2AA)]"*.

---

## 2 · The grid — one row per donee

| Sheet col | Field | Type / rule | Schema key |
|---|---|---|---|
| D | Sl. No. | auto (`D7 = D6+1`) — sequence only, not filed | — |
| E | Name of donee | text, max 125 | `DonationDtlsRsrchAssctn[].NameOfDonee` |
| F | Address | text, max 200 | `DonationDtlsRsrchAssctn[].AddressDetail.AddrDetail` |
| G | City Or Town Or District | text, max 50 | `…AddressDetail.CityOrTownOrDistrict` |
| H | State | **dropdown** — 37-state list (see §4) | `…AddressDetail.StateCode` |
| I | Pin Code | integer, 100000–999999 | `…AddressDetail.PinCode` |
| J | PAN of the donee | PAN string | `DonationDtlsRsrchAssctn[].DoneePAN` |
| K | Amount of donation — **Donation in cash** | integer ≥ 0 | `DonationDtlsRsrchAssctn[].DonationAmtCash` |
| L | Amount of donation — **Donation in other mode** | integer ≥ 0 | `DonationDtlsRsrchAssctn[].DonationAmtOtherMode` |
| M | Amount of donation — **Total Donation** | **computed** `M6 = SUM(K6,L6)` | `DonationDtlsRsrchAssctn[].DonationAmt` |
| N | Eligible Amount of Donation | user/derived | `DonationDtlsRsrchAssctn[].EligibleDonationAmt` |

The "Amount of donation" header (col K–M) splits over three sub-columns —
**Donation in cash**, **Donation in other mode**, and their **Total Donation** —
exactly as the sheet lays them out in row 5.

---

## 3 · The total line (row 11) and its formulas

| Sheet cell | Item | Formula | Schema key |
|---|---|---|---|
| K11 | Total — donation in cash | `MAX(SUM(Donation_cash_RA),0)` | `TotalDonationAmtCash80RA` |
| L11 | Total — donation in other mode | `MAX(SUM(Donation_other_RA),0)` | `TotalDonationAmtOtherMode80RA` |
| M11 | **Total Donation** | `MAX(SUM(Donation_total_RA),0)` | `TotalDonationsUs80RA` |
| N11 | Total eligible amount | `MAX(SUM(Donation_Eligible_RA),0)` | `TotalEligibleDonationAmt80RA` |

Each total is a `MAX(SUM(...),0)` over the named range of that column across the
donee rows, so the totals can never go negative. These four totals are the
figures the schema **requires** on `Schedule80RA`.

The validation-rules document ties them together (serials A332–A335):
- **A332** — Total Donation must equal donation in cash + donation in other mode.
- **A333** — total donation in cash must equal the bifurcation of donation in cash.
- **A334** — total donation in other mode must equal the bifurcation of donation in other than cash.
- **A335** — Total Donation must equal the bifurcation of total donation.

---

## 4 · The one dropdown — State (named range `StateWithoutForeign`, 37 values)

Column H on every donee row (H6 and H7:H10) is the state list. It is
**foreign-excluded** (a domestic donee only) and carries these exact values,
starting with the `(Select)` placeholder:

- (Select)
- 01-Andaman and Nicobar islands
- 02-Andhra Pradesh
- 03-Arunachal Pradesh
- 04-Assam
- 05-Bihar
- 06-Chandigarh
- 07-The Dadra And Nagar Haveli And Daman And Diu
- 09-Delhi
- 10-Goa
- 11-Gujarat
- 12-Haryana
- 13-Himachal Pradesh
- 14-Jammu and Kashmir
- 15-Karnataka
- 16-Kerala
- 17-Lakshadweep
- 18-Madhya Pradesh
- 19-Maharashtra
- 20-Manipur
- 21-Meghalaya
- 22-Mizoram
- 23-Nagaland
- 24-Odisha
- 25-Puducherry
- 26-Punjab
- 27-Rajasthan
- 28-Sikkim
- 29-Tamil Nadu
- 30-Tripura
- 31-Uttar Pradesh
- 32-West Bengal
- 33-Chattisgarh
- 34-Uttarakhand
- 35-Jharkhand
- 36-Telangana
- 37-Ladakh

Note the spelling the ITR-6 utility uses here — **"07-The Dadra And Nagar
Haveli And Daman And Diu"** as one combined entry, and **"33-Chattisgarh"** (one
't') — which differs from the `Sch80GGA.States` list used on the 80GGA sheet.
The stored value is the code (the schema's `StateCode` is the two-digit prefix).

---

## 5 · Cross-sheet feeds

| Direction | What | Where |
|---|---|---|
| **In** | Donee rows and amounts | typed by the filer on this sheet |
| **Out** | Total donation / eligible amount | supports the 80GGA (scientific research/rural development) donation total and the 35(1)/35(2AA) weighted-deduction adjustment in the business computation |

Schedule RA has **no dependants on screen other than validation** — it is a
supporting register. Its totals must reconcile with the 80GGA schedule for the
same donees.

---

## 6 · What is mandatory (schema `required`)

On `Schedule80RA` itself: **`TotalDonationAmtCash80RA`, `TotalDonationAmtOtherMode80RA`,
`TotalDonationsUs80RA`, `TotalEligibleDonationAmt80RA`** — all four totals, present
even at zero.

On each `DonationDtlsRsrchAssctn` row, the schema requires: `NameOfDonee`,
`AddressDetail.AddrDetail`, `AddressDetail.CityOrTownOrDistrict`,
`AddressDetail.StateCode`, `AddressDetail.PinCode`, `DoneePAN`, `DonationAmt`,
`EligibleDonationAmt`. The two split amounts — `DonationAmtCash` and
`DonationAmtOtherMode` — are optional at schema level (written when non-zero),
even though the sheet always computes their total.

---

## 7 · What repeats and what does not

| Where | Repeatable? |
|---|---|
| Donee rows (D6:N10) | **yes** — 5 shipped, addable, unlimited (`DonationDtlsRsrchAssctn`) |
| Total line (row 11) | one figure each — computed |

---

## 8 · What ITR-6 has here that ITR-2 does not

ITR-2 has **no Schedule RA at all** — an individual cannot claim the section
35 scientific-research weighted deduction. Schedule RA is a **business/company
schedule**, present because ITR-6 carries the 35(1)(ii)/(iia)/(iii)/(2AA)
research-donation deduction inside the profit computation and needs the donee
register to support it.

---

## 9 · What this means for the build

1. **One repeatable grid**, 5 rows shipped, add/delete like every donee card.
2. **Total Donation per row is computed** (`cash + other`), untypeable and green;
   the four column totals at row 11 are computed as `MAX(SUM,0)`.
3. **State is a dropdown** from `StateWithoutForeign` — build it from that named
   range, not from the 80GGA list (the spellings differ).
4. **Reconcile with 80GGA** — the RA total feeds the same donations the 80GGA
   figure represents; a check should fire if the two disagree.
5. **Export all four totals even at zero**, since the schema marks them required.
