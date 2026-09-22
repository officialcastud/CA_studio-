# The book of Verification — the declaration, the bank accounts and the refund — ITR-6, A.Y. 2026-27

Read row by row from the utility's **Verification** sheet (12 rows, 1 hidden),
and from the bank-and-refund rows at the foot of the **PARTB - TI - TTI** sheet
(rows 91–121), with the hidden-row flags, and confirmed against the schema's
`Verification` block and the `PartB_TTI.Refund` block.

This is the last section a company fills — who signs the return, in what
capacity, and where a refund is to be credited. The section is called **bank**
because it holds two things that travel together: the person's *declaration*
(the `Verification` schema block) and the *bank-account + refund* details (the
`PartB_TTI.Refund.BankAccountDtls` block, which the utility paints at the foot
of the Part B-TTI sheet but which belongs, on Yukti, in this section).

---

## 1 · The shape — one declaration, one bank block, one foreign-asset question

| Part | On the sheet | Schema block | Repeats? |
|---|---|---|---|
| **The declaration** | Verification sheet, rows 3–9 | `Verification.Declaration` | one figure |
| **Do you have a bank account in India** | Part B-TTI, row 99 | `PartB_TTI.Refund.BankAccountDtls.BankDtlsFlag` | one figure |
| **Bank accounts held in India** | Part B-TTI, rows 100–114 | `…AddtnlBankDetails[]` | one row per account |
| **Foreign bank account (non-residents' option)** | Part B-TTI, rows 115–116 | `…ForeignBankDetails[]` | one row per account |
| **The refund figure** | Part B-TTI, rows 91–92 | `PartB_TTI.Refund.RefundDue` | one figure |
| **The foreign-asset question** | Part B-TTI, row 121 | `PartB_TTI.AssetOutsideIndiaFlg` | one figure |

The refund figure, `AssetOutsideIndiaFlg` and the tax-liability lines are the
subject of the **Part B-TI · Part B-TTI** book (the *tax* section); they are
named here only because the refund is credited into the bank block that this
section owns.

---

## 2 · The declaration — Verification sheet, row by row

The whole sheet is the declaration text with three fillable boxes. There are no
item numbers in the rules document for these — they are the closing verification
that every ITR carries.

| Row | Cell | Label (verbatim) | Fillable box | Type / enum | Schema key |
|---|---|---|---|---|---|
| 3 | C3 | **Verification** | — | heading | — |
| 4 | C4 | I, (full name in block letters), | full name of the signatory | string, max 125 | `Declaration.AssesseeVerName` |
| 4 | E4 | son/ daughter of | father's name | string, max 125 | `Declaration.FatherName` |
| 5 | C5 | solemnly declare that to the best of my knowledge and belief, the information given in the return and the schedules there to is correct and complete is in accordance with the provisions of the Income-tax Act, 1961 | — | fixed declaration text | — |
| 6 | C6 | I further declare that I am making this return in my capacity as | capacity of the signatory | dropdown — see §3 | `Declaration.Capacity` |
| 6 | E6 | and I am also competent to make this return and verify it | — | fixed declaration text | — |
| 7 | C7 | I am holding permanent account number | PAN of the signatory | string (PAN) | `Declaration.AssesseeVerPAN` |
| 7 | E7 | (if allotted) (Please see instruction) | — | fixed note | — |
| 8 | C8 | Place | place of signing | string, max 50 | `Declaration.Place` |
| 8 | E8 | Date | date of signing | date `DD/MM/YYYY` → `YYYY-MM-DD` | `Declaration.Date` |
| 9 | C9 | Note: 1. Submission date is the system date of e-Filing portal of Income Tax Department. The same is available in the Acknowledgement/ITR-V generated after submission of return. 2. Verification Date is the date of e-Verification at e-Filing portal of Income Tax Department or the date of receipt of ITR-V at CPC, Bengaluru. The same will be available in View Returns/Forms option of e-Filing portal. In case of e-Verification, it is available in Acknowledgement. | — | fixed note | — |

`Verification.Declaration` is a **required** object; every one of its six leaves
— `AssesseeVerName`, `FatherName`, `AssesseeVerPAN`, `Capacity`, `Place`,
`Date` — is required.

**Hidden row.** Row 65536 is hidden (`hidden="1"`), an empty spacer row with no
content and no cell — **not built, not a data row**; it is the sheet's trailing
formatting row only.

**The Date cell has a formula.** `F8 = CONCATENATE(IF(DAY(TODAY())<10,"0",""),
DAY(TODAY()),"/",IF(MONTH(TODAY())<10,"0",""),MONTH(TODAY()),…)` — the utility
pre-fills the date box with today's date in `DD/MM/YYYY`. It is editable; the
export writes `YYYY-MM-DD`.

---

## 3 · The Capacity dropdown (cell D6, `Ver.Capacity`)

The one dropdown on the sheet. Six codes; the utility shows the description, the
schema stores the code.

| Display value | Schema code |
|---|---|
| **(Select)** | — (blank default) |
| **Managing Director** | `MD` |
| **Director** | `DR` |
| **Official liquidator/Resolution Professional under NCLT** | `OL` |
| **Representative assessee** | `RA` |
| **Principal Officer** | `PO` |
| **Authorised Signatory** | `AS` |

`Declaration.Capacity` enum: `MD, DR, OL, RA, PO, AS`.

**The Representative-assessee rule (A 867 / A 868).** If the capacity chosen is
*Representative assessee* (`RA`), then in Part A General the *name, capacity,
address and PAN/Aadhaar of the representative* become mandatory. And for a
domestic company, the **PAN entered at Verification must match one of the PANs
entered at "Key persons"** in Part A General.

---

## 4 · The bank-account block — Part B-TTI rows 99–114 → `PartB_TTI.Refund.BankAccountDtls`

**Do you have a bank account in India** (row 99) — Yes / No. Schema:
`BankAccountDtls.BankDtlsFlag`, enum **Y / N**.

**Details of all Bank Accounts held in India at any time during the previous
year (excluding dormant accounts)** (row 100) — one repeatable row per account
(`AddtnlBankDetails[]`):

| Col (row 107) | Field | Type / enum | Schema key |
|---|---|---|---|
| G107 | **IFS Code of the Bank** | string, 11 chars (see rule A 765 / A 386) | `IFSCCode` |
| H107 | **Name of the Bank** | string, max 125 | `BankName` |
| J107 | **Account Number** | string, max 20 | `BankAccountNo` |
| K107 | **Type of account** | dropdown — see enum below | `AccountType` |
| L107 | **Select Account for refund credit (tick at least one account √)** | true / false | `UseForRefund` |

**Account-type enum** (`AccountType`, codes `CA, CC, OD, NRO, CGAS, OTH`) — note
there is no *savings* type, because ITR-6 is a company:

| Code | Meaning |
|---|---|
| `CA` | Current Account |
| `CC` | Cash Credit Account |
| `OD` | Over draft account |
| `NRO` | Non Resident Account |
| `CGAS` | Capital Gains Accounts Scheme |
| `OTH` | Other |

`UseForRefund` enum: **true / false** — at least one account must be ticked for
refund credit.

**The sheet's own notes** (rows 108, 114): *"Please validate Schedule CG before
importing Bank details."* · *"All bank accounts held at any time are to be
reported, except dormant A/c."* · *"In case multiple accounts are selected, the
refund will be credited to one of the validated accounts after processing the
return."* And the placeholder for no account (row 102): *IFSC = NNNN0NNNNNN,
Name of Bank = NOT APPLICABLE, Account No. = NA999.*

**The hidden older layout.** Rows 93–95 (the single-account `E93/E94/D95` "Enter
your bank account number / IFS Code / Type of account" boxes) and rows 101–106
(the split "a. Bank Account in which refund shall be credited" / "b. Other Bank
account details" tables) are **hidden** superseded layouts — not built; the live
table is the one at row 107.

---

## 5 · Foreign bank account — Part B-TTI rows 115–116 → `…ForeignBankDetails[]`

*"Non-residents, at their option, furnish the details of one foreign bank
account"* (row 115). One repeatable row (`ForeignBankDetails[]`):

| Col (row 116) | Field | Type / enum | Schema key |
|---|---|---|---|
| G116 | **SWIFT Code** | string, max 30 | `SWIFTCode` |
| H116 | **Name of the Bank** | string, max 125 | `BankName` |
| J116 | **Country of Location** | dropdown — 250 country codes | `CountryCode` |
| L116 | **IBAN** | string, max 40 | `IBAN` |

`CountryCode` is the 250-value country enum (code → name, e.g. `93` →
AFGHANISTAN, `61` → AUSTRALIA, `86` → CHINA) shared with the address and FA
schedules.

---

## 6 · The refund figure and the foreign-asset question (feeds, not owned here)

- **REFUND — Amount payable (9−10e) / Refund (if 10e is greater than 9)**
  (Part B-TTI rows 91–92): `PartB_TTI.Refund.RefundDue` — computed in the *tax*
  section, credited into the bank block above. Required even at zero.
- **Do you at any time during the previous year hold, as beneficial owner,
  beneficiary or otherwise, any asset located outside India; or have signing
  authority in any account located outside India; or have income from any
  source outside India** (row 121): `PartB_TTI.AssetOutsideIndiaFlg`, enum
  **YES / NO**. YES makes Schedule FA required.

---

## 7 · Cross-sheet feeds

**In:**
- `Declaration.AssesseeVerPAN` is checked against the PANs at "Key persons" in
  Part A General for a domestic company (rule A 868).
- `RefundDue` is fed from Part B-TTI's liability computation (`AggregateTax
  Interest` less `TotalTaxesPaid`).

**Out:**
- The chosen refund account (`UseForRefund = true`) is where CPC credits any
  refund arising from Part B-TTI.
- `AssetOutsideIndiaFlg = YES` triggers Schedule FA.
- LEI details in Part A General become mandatory when `RefundDue` ≥ ₹50 crore
  (rule B 27).

---

## 8 · What is mandatory

| Block | Required |
|---|---|
| `Verification.Declaration` | the whole object — `AssesseeVerName`, `FatherName`, `AssesseeVerPAN`, `Capacity`, `Place`, `Date` |
| `PartB_TTI.Refund` | `RefundDue`, and `BankAccountDtls` |
| `BankAccountDtls` | `BankDtlsFlag`; each `AddtnlBankDetails[]` row needs `IFSCCode`, `BankName`, `BankAccountNo`, `AccountType`, `UseForRefund` |
| `ForeignBankDetails[]` (if given) | `SWIFTCode`, `BankName`, `CountryCode`, `IBAN` |
| `PartB_TTI.AssetOutsideIndiaFlg` | required |

---

## 9 · The rules the section carries

| Serial | Cat | Rule |
|---|---|---|
| A 765 | A | IFSC under "Bank Details" should tally with the RBI database (external check — cannot be verified offline; note it). |
| A 386 | A | IFS code must not be blank; **IFSC exactly 11 characters — first 4 alphabets, 5th character zero (0), last 6 numeric or alphabets**. |
| A 867 | A | If Verification capacity is *Representative assessee*, the representative's name, capacity, address and PAN/Aadhaar in Part A General are mandatory. |
| A 868 | A | For a domestic company, the PAN at Verification must match a PAN at "Key persons". |
| B 27 | B | LEI details (Part A General, Sl. r) are mandatory if `RefundDue` ≥ ₹50 crore. |

Rule A 765 is **external** (RBI database) and cannot be checked offline — flag it
as a notice, do not block the export on it.

---

## 10 · What ITR-6 has that a simpler form does not

- The **Capacity** dropdown is company-specific: Managing Director, Director,
  Official liquidator/Resolution Professional under NCLT, Representative
  assessee, Principal Officer, Authorised Signatory — not the individual's
  "self / karta" list.
- The **account-type** list has **no savings account** — only Current, Cash
  Credit, Overdraft, NRO, Capital Gains Accounts Scheme, Other.
- The **PAN-at-Verification must match a Key-person PAN** cross-check (A 868) is
  a company rule with no counterpart on the individual forms.

---

## 11 · What this means for the build

1. **The declaration as five boxes** — full name, father's name, capacity
   (dropdown), PAN, place, date — the date box pre-filled with today's date and
   editable, exported `YYYY-MM-DD`.
2. **The Capacity dropdown from the enum** — six codes, description shown, code
   stored; the `RA` branch opens the representative fields in Part A General.
3. **The bank block as a repeatable table** — IFSC (11-char format check),
   name, account number, type (dropdown, no savings), and the refund tick with
   *at least one* enforced; the foreign-account table behind the non-resident
   option.
4. **Row 65536 not built** — hidden spacer; the hidden single-account and split
   refund-account layouts (rows 93–95, 101–106) not built either.
5. **The IFSC-vs-RBI and Key-person-PAN checks** as live rules (A 765 as an
   external notice, A 868 blocking); LEI mandatory above ₹50 crore refund.
6. **Export** — the whole `Declaration` object; `Refund.RefundDue`,
   `BankDtlsFlag`, every `AddtnlBankDetails[]` row, `ForeignBankDetails[]` when
   given; `AssetOutsideIndiaFlg`.
