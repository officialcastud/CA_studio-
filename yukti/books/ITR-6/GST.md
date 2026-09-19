# The book of Schedule GST — ITR-6, A.Y. 2026-27

Read row by row from the utility's **GST** sheet, with the hidden-row flags, the
dropdowns and the cell formulas, and confirmed against the schema block
`ScheduleGST`. Item references are taken from the ITR-6 validation-rules document
(rules 714–715), never from counting rows.

---

## Schedule GST — Turnover/gross receipt reported for GST

*"Schedule GST — INFORMATION REGARDING TURNOVER/GROSS RECEIPT REPORTED FOR GST."*
A disclosure schedule: for each GST registration the company holds, the annual
value of outward supplies it reported in the GST returns filed for the year. It
lets the department reconcile the turnover declared for income tax against the
turnover declared under GST. It adds nothing to income.

### The shape — one repeatable table, one row per GSTIN

| Col | Label | Type | Schema key |
|---|---|---|---|
| C4 | **Sl.No.** | serial | — |
| D4 | **GSTIN No(s).** | text, max 15 | `TurnoverGrsRcptForGSTIN[].GSTINNo` |
| E4 | **Annual value of outward supplies as per the GST return(s) filed** | integer | `TurnoverGrsRcptForGSTIN[].AmtTurnGrossRcptGSTIN` |

**Note (C10):** *"Note:-Please furnish the information above for each GSTIN No.
separately"* — one row per registration; a company with several GSTINs enters
each on its own line.

### The dropdowns

The sheet carries no value-list dropdowns; the validations (GSTIN length 15,
amount numeric) are length/format constraints, not enumerations.

### The rules the sheet carries

- Rule **714** (Category A): if "GSTIN No." is filled then "Annual Value of
  Outward Supplies as per the GST Return Filed" must also be filled.
- Rule **715** (Category A): if "Annual Value of Outward Supplies as per the GST
  Return Filed" is filled then "GSTIN No." must also be filled.

The two rules are the paired-mandatory rule for the row: neither column may be
entered without the other.

### Cross-sheet feeds

Purely a disclosure; it does not feed a total into Part B-TI. The GST turnover is
reconciled (by the instructions and the department) against the turnover/gross
receipts shown in the P&L / Part A-Trading Account.

### Hidden rows

None. Rows 3, 4 and 10 are visible; the entry rows (5–8) are the repeatable
table.

### Schema

`ScheduleGST.TurnoverGrsRcptForGSTIN[]` — one object per registration with
`GSTINNo` and `AmtTurnGrossRcptGSTIN`, both required on any object present. The
array is written only when at least one GSTIN is entered.

### What this means for the build

A single repeatable two-column table with the paired-mandatory check (rules
714/715). No total, no computed cell. Export
`ScheduleGST.TurnoverGrsRcptForGSTIN[]` only when a GSTIN is entered.
