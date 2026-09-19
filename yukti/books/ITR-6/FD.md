# The book of Schedule FD — ITR-6, A.Y. 2026-27

Read row by row from the utility's **FD** sheet, with the hidden-row flags, the
dropdowns and the cell formulas, and confirmed against the schema block
`ScheduleFD`. Item numbers (i, ii, iii, iv) are taken from the sheet's own
lettering, consistent with the ITR-6 validation-rules document.

---

## Schedule FD — Break-up of payments/receipts in foreign currency

*"Schedule FD — Break-up of payments/receipts in Foreign currency (to be filled
up by the assessee who is not liable to get accounts audited u/s 44AB)."* A
disclosure schedule for the **non-audit** company: the total of its foreign-
currency payments and receipts during the year, split between capital and revenue
account. A company liable to audit under section 44AB does not fill this schedule
(the auditor's report captures the same information). It adds nothing to income.

### The shape — four fixed rows, one amount column

| Col E rows | Item | Label (Foreign Currency Transaction) | Type | Schema key |
|---|---|---|---|---|
| E5 | i | **Payments made during the year on capital account** | integer | `PaymntMadeOnCapitalAcc` |
| E6 | ii | **Payments made during the year on revenue account** | integer | `PaymntMadeOnRevenueAcc` |
| E7 | iii | **Receipts during the year on capital account** | integer | `ReceiptsOnCapitalAcc` |
| E8 | iv | **Receipts during the year on revenue account** | integer | `ReceiptsOnRevenueAcc` |

**Column heads (row 4):** D4 **SL.NO**, E4 **Currency-wise Break-Up**, I4
**Amount (in Rs.)**. The four rows are fixed — capital/revenue × payment/receipt —
each a single rupee figure.

**Note (E9):** *"Please refer to instructions for filling out this schedule."*

### The dropdowns

The sheet carries no value-list dropdowns; the only validation (I4 amount
numeric) is a format constraint, not an enumeration. The "Currency-wise Break-Up"
column is descriptive on this ITR-6 sheet — the four fixed rupee lines are what is
filed.

### The rules the sheet carries

- Only the **non-audit** assessee (not liable under section 44AB) fills this
  schedule — stated in the schedule heading itself; an audited company leaves it
  blank.

No arithmetic/conditional rule in `rules.json` targets Schedule FD; there is no
total row on the sheet.

### Cross-sheet feeds

Purely a disclosure; it does not feed a total into Part B-TI. It corresponds to
the foreign-currency information a 44AB auditor would otherwise report.

### Hidden rows

None. All rows (3–9) of the FD sheet are visible.

### Schema

`ScheduleFD` — four required scalar leaves: `PaymntMadeOnCapitalAcc`,
`PaymntMadeOnRevenueAcc`, `ReceiptsOnCapitalAcc`, `ReceiptsOnRevenueAcc`. The
block is written for a non-audit company when any of the four is non-zero.

### What this means for the build

A four-line card, each a rupee figure, shown only for a non-audit filer. No
computed cells. Export `ScheduleFD` with all four leaves present when the block
applies.
