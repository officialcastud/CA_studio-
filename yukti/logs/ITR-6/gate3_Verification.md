# Gate 3 — ITR-6 · sheet "Verification" (section: bank)

- **Result:** GREEN (0 failing items)
- **Command:** `python3 tools/gates/gate.py --form ITR-6 --gate 3 --sheet "Verification"`
- **Book:** `books/ITR-6/Verification.md`
- **Schema block backing the sheet:** `Verification` (leaves: Declaration →
  AssesseeVerName, FatherName, AssesseeVerPAN, Capacity, Place, Date — all
  required, all present in book).
- **Live rows covered:** 7 (rows 3–9 of the Verification sheet). All labels present.
- **Dropdown covered:** cell D6 `Ver.Capacity` — all 7 display values present
  ((Select), Managing Director, Director, Official liquidator/Resolution
  Professional under NCLT, Representative assessee, Principal Officer,
  Authorised Signatory).
- **Hidden rows (not built):** row 65536 — empty hidden spacer row, no content.

## Also documented (task scope: section "bank" = declaration + bank + refund)

The bank-account + refund details live in the schema under `PartB_TTI.Refund`
(BankAccountDtls.AddtnlBankDetails[], ForeignBankDetails[], RefundDue) and are
painted by the utility at the foot of the **PARTB - TI - TTI** sheet (rows
91–121). They are documented in this book because the "bank" section owns them,
though gate 3 for the Verification sheet checks only the `Verification` block.
AccountType enum for ITR-6: CA, CC, OD, NRO, CGAS, OTH (no savings — company).

## Inconsistencies noted between the three sources

- **Rule A 765 is external** (IFSC must tally with the RBI database) — cannot be
  verified offline; flagged as a notice, not a blocking check.
- The utility carries **hidden superseded bank layouts** (Part B-TTI rows 93–95
  single-account boxes, rows 101–106 split refund/other tables) alongside the
  live table at row 107 — the hidden ones are logged as not built.
