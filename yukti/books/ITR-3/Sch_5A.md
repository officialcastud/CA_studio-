# The book of Schedule 5A — ITR-3, A.Y. 2026-27

Read row by row from the utility's **Sch 5A** sheet (rows 3–14), with the
hidden-row flags, and confirmed against schema block `Schedule5A2014`. This
schedule differs from ITR-2's: in ITR-3 the two spouse-audit questions (rows 7
and 8) and the **Business or profession** head (row 11) are **visible and
live** — ITR-3 is the business form.

## The shape

*"Information regarding apportionment of Receipts between spouses governed by
Portuguese Civil Code"* (row 3, [C3] Schedule 5A / [F3]). Section 5A: in Goa,
Dadra & Nagar Haveli and Daman & Diu, income other than salary is treated as
half the husband's and half the wife's. The schedule is a **single block** (not
repeatable) with five header fields for the spouse and a fixed four-head table
plus a computed Total row. It appears only where the Part A General answer *"Are
you governed by Portuguese Civil Code as per section 5A?"* is Yes.

## The items

### Header (Schedule5A2014)

| Row | Field label | Type | Schema key | Rule/notes |
|---|---|---|---|---|
| [D4] | Name of the Spouse | string | `NameOfSpouse` | required, maxLength 125 |
| [D5] | PAN of the Spouse | string | `PANOfSpouse` | required, maxLength 10 |
| [D6] | Aadhaar of the spouse | string | `AadhaarOfSpouse` | optional |
| [D7] | Whether books of accounts of spouse is audited u/s 44AB or under any other provisions (other than u/s 44AB) | string enum Y/N | `BooksSpouse44ABFlg` | dropdown [L7]: (Select), Yes, No |
| [D8] | Whether your spouse is liable for audit u/s 92E? or Whether your spouse is a partner of a firm which is liable for audit u/s 92E | string enum Y/N | `BooksSpouse92EFlg` | dropdown [L8]: (Select), Yes, No |

### The apportionment table (Schedule5A2014)

Column headers (row 9): [E9] Heads of Receipts (i) · [I9] Receipts received
under the head (ii) · [J9] Amount apportioned in the hands of the spouse (iii) ·
[K9] Amount of TDS deducted on income at (ii) (iv) · [L9] TDS Apportioned In the
hands of spouse (v).

| Row / item | Head of Receipts (i) | Schema object | Leaf keys (ii)–(v) |
|---|---|---|---|
| [E10] item 1 | House Property | `HPHeadIncome` | `IncRecvdUndHead`, `AmtApprndOfSpouse`, `AmtTDSDeducted`, `TDSApprndOfSpouse` |
| [E11] item 2 | Business or profession | `BusHeadIncome` | `IncRecvdUndHead`, `AmtApprndOfSpouse`, `AmtTDSDeducted`, `TDSApprndOfSpouse` |
| [E12] item 3 | Capital Gains | `CapGainHeadIncome` | `IncRecvdUndHead`, `AmtApprndOfSpouse`, `AmtTDSDeducted`, `TDSApprndOfSpouse` |
| [E13] item 4 | Other Sources | `OtherSourcesHeadIncome` | `IncRecvdUndHead`, `AmtApprndOfSpouse`, `AmtTDSDeducted`, `TDSApprndOfSpouse` |
| [E14] | Total (1+2+3+4) | `TotalHeadIncome` | `IncRecvdUndHead`, `AmtApprndOfSpouse`, `AmtTDSDeducted`, `TDSApprndOfSpouse` — all computed |

The four columns per head, in schema terms: column (ii) Receipts received under
the head → `IncRecvdUndHead`; column (iii) Amount apportioned in the hands of
the spouse → `AmtApprndOfSpouse`; column (iv) Amount of TDS deducted on income
at (ii) → `AmtTDSDeducted`; column (v) TDS Apportioned in the hands of spouse →
`TDSApprndOfSpouse`.

## The rules the sheet computes

- **[I14]** `= SUM(S5A_IncRecvdUndHeadHP, S5A_IncRecvdUndHeadBP, S5A_IncRecvdUndHeadCG, S5A_IncRecvdUndHeadOS)` — Total of column (ii), receipts under all four heads.
- **[J14]** `= SUM(S5A_HPHeadIncome, S5A_BusHeadIncome, S5A_CapGainHeadIncome, S5A_OtherSourcesHeadIncome)` — Total of column (iii), amount apportioned in the hands of the spouse.
- **[K14]** `= SUM(S5A_AmtTDSDeductedHP, S5A_AmtTDSDeductedBP, S5A_AmtTDSDeductedCG, S5A_AmtTDSDeductedOS)` — Total of column (iv), TDS deducted.
- **[L14]** `= SUM(S5A_TDSApprndOfSpouseHP, S5A_TDSApprndOfSpouseBP, S5A_TDSApprndOfSpouseCG, S5A_TDSApprndOfSpouseOS)` — Total of column (v), TDS apportioned to the spouse.
- Column-range constraints (from dropdown/validation ranges): columns (ii) and (iii) (cells `I10:I13 J10:J13`, `I14:J14`) allow a minimum of −99999999999999 (may be negative — a head can carry a loss); columns (iv) and (v) (cells `K10:K13 L10:L13`, `K14:L14`) have minimum 0 (TDS cannot be negative). Schema mirrors this: `AmtTDSDeducted` and `TDSApprndOfSpouse` carry `minimum 0`; all four leaves cap at `maximum 99999999999999`.

## Dropdowns

- **[L7]** (Whether books of accounts of spouse is audited u/s 44AB): `(Select)`, `Yes`, `No`.
- **[L8]** (Whether your spouse is liable for audit u/s 92E / partner of firm liable u/s 92E): `(Select)`, `Yes`, `No`.
- The other listed "dropdowns" (G4, G5, G6 sources 0/10/12; I/J/K/L ranges) are cell number-format / min-value validations, not value lists — no selectable values.

## What repeats and what is one figure

Schedule 5A is **one figure throughout — nothing repeats**. There is a single
spouse block: one name, one PAN, one Aadhaar, two audit flags, and exactly four
fixed head objects (`HPHeadIncome`, `BusHeadIncome`, `CapGainHeadIncome`,
`OtherSourcesHeadIncome`) plus one computed `TotalHeadIncome`. No arrays.

## Mandatory

Schema `required` on `Schedule5A2014`: `NameOfSpouse`, `PANOfSpouse`,
`HPHeadIncome`, `BusHeadIncome`, `CapGainHeadIncome`, `OtherSourcesHeadIncome`,
`TotalHeadIncome`. Within each head object, all four leaves are required:
`IncRecvdUndHead`, `AmtApprndOfSpouse`, `AmtTDSDeducted`, `TDSApprndOfSpouse`.
Optional: `AadhaarOfSpouse`, `BooksSpouse44ABFlg`, `BooksSpouse92EFlg`. In
short: everything except Aadhaar and the two audit flags, when the block is
present.

## Hidden rows — not built

None. Every row in the Sch 5A dump (rows 3–14) is visible — the utility prints
no `H` flag on this sheet. Note in particular that rows 7, 8 (spouse audit
questions) and row 11 (Business or profession), which are hidden on ITR-2, are
**live on ITR-3**.

## What this means for the build

1. Gate the whole schedule behind the Part A General answer "Are you governed
   by Portuguese Civil Code as per section 5A?" = Yes (rules.json: filled only
   when Yes; must not be filed when No).
2. Render one non-repeating card: five header fields (name, PAN, Aadhaar, the
   two Y/N audit dropdowns), then the four-head table with columns (ii)–(v) and
   a green, untypeable computed Total row [E14].
3. Column (ii) is the whole receipt under the head; column (iii) is the spouse's
   half; the person's own head schedules carry the other half. Salary is not
   apportioned — no salary row.
4. TDS in column (v) flows to the spouse; the person's Schedule TDS then carries
   the credit as relating to the other person (spouse under section 5A) with the
   spouse's PAN.
5. Export `Schedule5A2014` with all four head objects present (zero if nothing)
   plus `TotalHeadIncome`; map the two audit flags to `BooksSpouse44ABFlg` /
   `BooksSpouse92EFlg` as Y/N.
