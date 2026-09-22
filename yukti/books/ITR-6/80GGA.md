# The book of Schedule 80GGA — Donations for scientific research or rural development · ITR-6, A.Y. 2026-27

Read row by row from the utility's **80GGA** sheet (16 rows, no hidden rows) and
confirmed against the CBDT ITR-6 schema's `Schedule80GGA`. Every clause, label,
dropdown and formula below is the department's own.

---

## 1 · Purpose — donee list for the 80GGA payment deduction

Schedule 80GGA holds the **donee-by-donee detail of donations made for
scientific research or rural development** deductible under section 80GGA. The
consolidated figure it produces feeds **Schedule VI-A Part B, item c (80GGA)**.
It is a payment-side deduction: the sheet's title reads *"Details of donations
for scientific research or rural development."*

The key eligibility gate — stated in the validation rules and enforced through
Schedule VI-A — is that **80GGA is allowed only to an assessee having no
business income** (rules A836, and the VI-A formula `IF(Sheet8b.TotProfBusGain<>0,0,…)`).
For a company with business income the deduction collapses to zero.

---

## 2 · The grid — one row per donee

| Sheet col | Field | Type / rule | Schema key |
|---|---|---|---|
| D | Sl. No. | auto (`D7 = D6+1`) — sequence only | — |
| E | Relevant Clause under which deduction is claimed | **dropdown**, 8 clauses (see §4) | `DonationDtlsSciRsrchRuralDev[].RelevantClauseUndrDedClaimed` |
| F | Name of Donee | text, max 125 | `…NameOfDonee` |
| G | Address | text, max 200 | `…AddressDetail.AddrDetail` |
| H | City Or Town Or District | text, max 50 | `…AddressDetail.CityOrTownOrDistrict` |
| I | State | **dropdown**, 38-state list (see §5) | `…AddressDetail.StateCode` |
| J | PIN Code | integer, 100000–999999 | `…AddressDetail.PinCode` |
| K | PAN of Donee | PAN string | `…DoneePAN` |
| L | Date of Cash Donation | date | *(no schema leaf — see §7)* |
| M | Amount of Donation — **Donation in Cash** | integer ≥ 0 | `…DonationAmtCash` |
| N | Amount of Donation — **Donation in Other Mode** | integer ≥ 0 | `…DonationAmtOtherMode` |
| O | Amount of Donation — **Total Donation** | **computed** `O6 = MAX(SUM(M6,N6),0)` | `…DonationAmt` |
| P | Eligible Amount of Donation | **computed** (see §3) | `…EligibleDonationAmt` |

The "Amount of Donation" header (M–O) splits into **Donation in Cash**,
**Donation in Other Mode** and **Total Donation**, mirroring row 5.

---

## 3 · The formulas — the ₹2,000 cash cap and the total line

Per row, two computed cells carry the rules:

| Cell | Formula | Meaning |
|---|---|---|
| O6 | `MAX(SUM(M6,N6),0)` | Total Donation = cash + other mode, floored at 0 |
| P6 | `MIN(SUM(IF(M6>U6,0,M6),N6),TotalPendingIncome)` | **Eligible amount** — cash above the cap is dropped, and the result is capped at pending income |
| U6 | `IF(M6=0,0,2000)` | the **₹2,000 cash cap** helper — any cash donation over ₹2,000 is disallowed |

The `IF(M6>U6,0,M6)` term is the cap in action: if the cash donation exceeds
₹2,000, the *whole* cash amount is treated as ineligible (only the other-mode
part survives). Validation rule **A820** states it plainly: *amount donated in
cash should not exceed Rs. 2000.*

The total line (row 11):

| Cell | Item | Formula | Schema key |
|---|---|---|---|
| M11 | Total — donation in cash | `SUM(Donation_cash_80GGA)` | `TotalDonationAmtCash80GGA` |
| N11 | Total — donation in other mode | `SUM(Donation_other_80GGA)` | `TotalDonationAmtOtherMode80GGA` |
| O11 | Total Donation | `IF(VIA80GGAL=1,0,SUM(Donation_total_80GGA))` | `TotalDonationsUs80GGA` |
| P11 | Total eligible amount | `IF(VIA80GGAL=1,0,MIN(SUM(Donation_Eligible_80GGA)))` | `TotalEligibleDonationAmt80GGA` |

The `IF(VIA80GGAL=1,0,…)` gate zeroes the totals when the VI-A lock flag says
80GGA is not available (i.e. business income exists). Related rules: **A818**
(Total Donation = cash + other mode), **A819** (Total Donation = sum of i + ii),
**A821** (donee PAN ≠ assessee PAN / PAN at verification), **A822** (if 80GGA is
claimed in Sch VI-A, details must be provided here).

---

## 4 · Dropdown — Relevant Clause (named range `Sch80GGA.RelevantClause`, 8 clauses + placeholder)

Column E carries the clause under which the payment qualifies. The schema stores
one of eight codes — `80GGA2a, 80GGA2aa, 80GGA2b, 80GGA2bb, 80GGA2c, 80GGA2cc,
80GGA2d, 80GGA2e` — shown to the filer as these exact strings:

- (Select)
- 80GGA(2)(a)-Sum paid to Research Association or University, college or other institution for Scientific Research
- 80GGA(2)(aa)-Sum paid to Research Association or University, college or other institution for Social science or Statistical Research
- 80GGA(2)(b)-Sum paid to an association or institution for Rural Development
- 80GGA(2)(bb)-Sum paid to PSU or Local Authority or  an association or institution approved by the National Committee for carrying out any eligible project
- 80GGA(2)(c)-Sum paid to an association or institution for Conservation of Natural Resources or for afforestation
- 80GGA(2)(cc)-Sum paid for Afforestation, to the funds, which are notified by Central Govt.
- 80GGA(2)(d)-Sum paid for Rural Development to the funds, which are notified by Central Govt.
- 80GGA(2)(e)-Sum paid to National Urban Poverty Eradication Fund as setup and notified by Central Govt.

---

## 5 · Dropdown — State (named range `Sch80GGA.States`, 38 values)

Column I is a **different state list** from the one Schedule RA and 80G use: it
has 38 entries, splits Dadra Nagar Haveli from Daman and Diu, and spells
"Chhattisgarh" with a double 'h'. Exact values:

- (Select)
- 01-Andaman and Nicobar islands
- 02-Andhra Pradesh
- 03-Arunachal Pradesh
- 04-Assam
- 05-Bihar
- 06-Chandigarh
- 33-Chhattisgarh
- 07-Dadra Nagar and Haveli
- 08-Daman and Diu
- 09-Delhi
- 10-Goa
- 11-Gujarat
- 12-Haryana
- 13-Himachal Pradesh
- 14-Jammu and Kashmir
- 35-Jharkhand
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
- 36-Telangana
- 30-Tripura
- 31-Uttar Pradesh
- 34-Uttarakhand
- 32-West Bengal
- 37-Ladakh

**Inconsistency to note:** this `Sch80GGA.States` list (38 values) is *not* the
same as the `StateWithoutForeign` list (37 values) used on Schedule RA and 80G in
the very same section. They differ in how the union territories are named
("07-Dadra Nagar and Haveli" + "08-Daman and Diu" here vs a single "07-The Dadra
And Nagar Haveli And Daman And Diu" there) and in the spelling of Chhattisgarh.
Build each sheet's state control from its own named range — do not share one list.

---

## 6 · Cross-sheet feeds

| Direction | What | Where |
|---|---|---|
| **In** | `VIA80GGAL` lock flag, `TotalPendingIncome` | from Schedule VI-A / Part B-TI |
| **Out** | `TotalEligibleDonationAmt80GGA` | Schedule VI-A Part B item **c (80GGA)**, `I50`/`K50` |

---

## 7 · What is mandatory (schema `required`)

On `Schedule80GGA`: **`TotalDonationAmtCash80GGA`, `TotalDonationAmtOtherMode80GGA`,
`TotalDonationsUs80GGA`, `TotalEligibleDonationAmt80GGA`** — all four totals.

On each `DonationDtlsSciRsrchRuralDev` row, the schema requires every field:
`RelevantClauseUndrDedClaimed`, `NameOfDonee`, `AddressDetail.AddrDetail`,
`AddressDetail.CityOrTownOrDistrict`, `AddressDetail.StateCode`,
`AddressDetail.PinCode`, `DoneePAN`, `DonationAmtCash`, `DonationAmtOtherMode`,
`DonationAmt`, `EligibleDonationAmt`.

**Excluded row — no schema key:** the sheet's column **L "Date of Cash Donation"**
has no corresponding leaf in `Schedule80GGA`; it is a data-entry aid on the sheet
that is not filed to the return. It is captured on screen but not exported (log
it as excluded: *utility column with no schema key*).

---

## 8 · What repeats and what does not

| Where | Repeatable? |
|---|---|
| Donee rows (D6:P10) | **yes** — 5 shipped, addable (`DonationDtlsSciRsrchRuralDev`) |
| Total line (row 11) | one figure each — computed |

---

## 9 · What ITR-6 has here that ITR-2 does not

ITR-2 routes 80GGA through Schedule VI-A but does **not** condition it on the
absence of business income (an individual's 80GGA is not business-gated the same
way). On ITR-6 the deduction is **switched off entirely when the company has
business income** — the VI-A formula and rule A836 enforce it — so the schedule
is present but its total is frequently zeroed.

---

## 10 · What this means for the build

1. **One repeatable grid**, 5 rows shipped, add/delete.
2. **Total, eligible and the ₹2,000 cash cap are computed** and untypeable —
   cash over ₹2,000 drops out of the eligible amount entirely.
3. **Two dropdowns** — the 8-clause Relevant Clause list and the 38-value
   `Sch80GGA.States` list; build the state control from *this* sheet's range.
4. **Gate the totals on `VIA80GGAL`** — zero when business income disallows 80GGA.
5. **Do not export "Date of Cash Donation"** — it has no schema key.
