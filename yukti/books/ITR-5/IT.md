# IT — Schedule IT (Details of Advance Tax and Self-Assessment Tax Payments)

Form: ITR-5 · A.Y. 2026-27 · Sheet file `sheet53.xml` · Block: **ScheduleIT** · Section: `paid`
Source: `python tools/dump.py --form ITR-5 --sheet "IT"` (rows/--formulas/--dropdowns), `--schema/--leaves ScheduleIT`, `books/ITR-5/rules.json`, `sources/ITR-5/utility/xl/workbook.xml` (named ranges).

## The shape

Schedule IT (labelled **18A** at `[C15]`) is a single fixed-height challan grid: **six challan input rows (18–23)** followed by one **Total** row (24). Each challan row records one advance-tax / self-assessment-tax payment: BSR code, date of deposit, serial number of challan, and amount. The grid is the whole schedule — there is no header/summary split.

Row 15 `[E15]` = "Details Of Advance Tax and Self Assessment Tax Payments". Row 16 carries the column headers. Rows 18–23 are the data rows. Row 24 `[F24]` = "Total", `[H24]= SUM(IT.Amt)`. Row 25 `[E25]` is a note: "Enter the totals of Advance tax and Self-Assessment tax in Sl No. 10a & 10d of Part B-TTI".

Columns Q–AA on rows 1–17 are an off-to-the-side **helper region** ("Quarter Income Break up") that classifies each challan by its date of deposit into Advance Tax (AT) vs Self-Assessment Tax (SAT) and into quarters. Rows 1–11 of that region are hidden (see Hidden rows); rows 12–16 helper cells are on visible rows but off in columns U–AA. None of the helper cells are schema items — they feed Part B-TTI, not the ITR JSON.

## The items

### Block ScheduleIT — challan grid (rows 18–23, six repeats)

| Sheet col / label (row 16) | Field | Type | Schema key | Rule |
|---|---|---|---|---|
| `[D16]` Sl. No. | Serial number of the row | integer (auto) | *(none — presentation)* | `[D18]`=1 start; `[D19]= D18+1` … `[D23]= D22+1`. Auto-incremented, not sent. |
| `[E16]` BSR Code (E18:E23) | BSR code of bank branch | string | `TaxPayment[].BSRCode` | Data-validation source 7 (7-char BSR code). Note in `[E16]`: "BSR Code Must be filled to include the payment in the Total". Named range `IT.BSRCode` = E18:E23. |
| `[F16]` Date of Deposit (DD/MM/YYYY) (F18:F23) | Date challan deposited | string | `TaxPayment[].DateDep` | Data-validation source 10 (10-char date). Sheet stores **DD/MM/YYYY**; schema wants **YYYY-MM-DD** — convert on assembly. Named range `IT.DateDep` = F18:F23. |
| `[G16]` Serial Number of Challan (G18:G23) | Challan serial number | integer | `TaxPayment[].SrlNoOfChaln` | Data-validation source 5. Schema: maximum 99999, minimum 0. Named range `IT.SrlNoOfChaln` = G18:G23. |
| `[H16]` Amount (Rs) (H18:H23) | Amount paid | integer | `TaxPayment[].Amt` | Data-validation source 0 (numeric). Schema: maximum 99999999999999, minimum 0. Named range `IT.Amt` = H18:H23. |
| `[F24]` Total → `[H24]` | Total of all challan amounts | integer | `TotalTaxPayments` | `[H24]= SUM(IT.Amt)`. Named range `IT.Total` = H24. **Required.** |

Schema keys (`--leaves ScheduleIT`), all mapped above:
`TaxPayment[]` (array), `TaxPayment[].BSRCode`, `TaxPayment[].DateDep`, `TaxPayment[].SrlNoOfChaln`, `TaxPayment[].Amt`, `TotalTaxPayments`.

## The rules the sheet computes

- **Row total** — `[H24]= SUM(IT.Amt)` = SUM(H18:H23). This is `TotalTaxPayments`.
  Validation (rules.json n=843): *"Schedule IT In \"Schedule IT\" Total of all rows of Column 5 \"Amount\" should be equal to \"Total\" Field."*
- **BSR gate** — `[E16]`: *"BSR Code Must be filled to include the payment in the Total"* — a challan row is only counted when its BSR code is present. On assembly, emit a `TaxPayment` element only for rows that carry a BSR code (and amount).
- **Sl. No. auto-increment** — `[D19]= D18+1`, `[D20]= D19+1`, `[D21]= D20+1`, `[D22]= D21+1`, `[D23]= D22+1`. Presentation only; no schema field.
- **AT vs SAT classification (helper → Part B-TTI, not ScheduleIT JSON):**
  - `[Q18]= VALUE(MID(F18,7,4))` = deposit **year**, `[R18]= VALUE(MID(F18,1,2))` = **day**, `[S18]= VALUE(MID(F18,4,2))` = **month** (rows 18 & 23 shown; same pattern per row). Confirms F is DD/MM/YYYY.
  - `[T18]= IF(Q18>2026,2,IF(Q18>=2026,IF(S18>=4,2,1),1))` — flags each challan: 1 = Advance Tax (deposited on/before 31/03/2026), 2 = Self-Assessment Tax (deposited after 31/03/2026, i.e. FY beginning Apr-2026). Named range `IT.FormulaOfS` = T18:T23.
  - `[T15]= SUMIF(IT.FormulaOfS,"<2",IT.Amt)` = **Advance Tax total** (→ Part B-TTI 10a).
  - `[T16]= SUMIF(IT.FormulaOfS,">=2",IT.Amt)` = **Self-Assessment Tax total** (→ Part B-TTI 10d). Named range `IT.SAT` = T16.
  - Quarter split: `[U15/U14/U13/U12/U11]= SUMIF(FormulaofQ,"=1"/"=2"/…)` and the `V*`/`W*`/`X*` SUMIF ranges (`FormulaofSAT`, `FormulaOfExSAT`, `FormulaOfExSAT1`) build the quarter-wise / date-postponement breakup. `[R15]= MID(sheet1.StateCode1,1,2)` and `[R16]= IF(OR(R15="03","04","20","21","22","23","30"),FALSE,FALSE)` handle the TN/Pondicherry due-date case. All helper only.
- **Cross-schedule (rules.json, category A):**
  - n=822: Part B-TTI 10a "Advance tax" and 10d "Self Assessment Tax" should equal the sum of total Tax Paid in Schedule IT.
  - n=837/838/839: 10a = sum of IT tax paid with **date of deposit between 01/04/2025 and 31/03/2026**; Self-Assessment Tax = sum with **date of deposit after 31/03/2026** for A.Y. 2026-27.
  - n=831: Part B-TTI 10e Total Taxes Paid = Advance Tax + TDS + TCS + Self-assessment Tax.

## Dropdowns

**None.** The four data-validations on the input columns are input-format constraints, not value lists (`--dropdowns "IT"` returns `values: null` for every one):
- E18:E23 → source "7" (BSR code length)
- F18:F23 → source "10" (date length)
- G18:G23 → source "5" (serial)
- H18:H23 → source "0" (numeric amount)

## What repeats and what is one figure

- **Repeats:** the challan row — BSRCode, DateDep, SrlNoOfChaln, Amt — six fixed rows in the utility (18–23), emitted as the `TaxPayment[]` array (one element per filled row; schema array is otherwise unbounded).
- **One figure:** `TotalTaxPayments` = `[H24]` = SUM of all Amt.

## Mandatory

- Schema `required` on ScheduleIT: **`TotalTaxPayments`** only.
- Within each `TaxPayment` element, the leaves are marked `*` (required-if-present): `BSRCode`, `DateDep`, `SrlNoOfChaln`, `Amt` — all four must be present for any challan row that is emitted. The array itself is not required (a return with no advance/self-assessment tax paid omits it), but any row included must be complete, and BSR code is the gate for inclusion.

## Hidden rows — not built

Rows **1–11** are hidden (`hidden="1"` in sheet53.xml; 11 of 43 rows). They hold the "Quarter Income Break up" helper computation (`[T10]` "Quarter Income Break up") — SUMIF cells that split challans across quarters and AT/SAT/ExSAT buckets, e.g. `[V4]= SUMIF(FormulaofSAT,"=12",IT.Amt)`, `[W4]= SUMIF(FormulaofSAT,"=24",IT.Amt)`, … `[U11]= SUMIF(FormulaofQ,"=5",IT.Amt)`. None of these are ITR-5 schema fields. **Do not build.** (Rows 12–17 helper cells in columns U–AA are on visible rows but are the same helper machinery and likewise carry no schema key.)

**Helper note/example labels (rows 26–27, off-grid columns Q/U/V — presentation text only, not schema items):**
- `[Q26]` "Note:" · `[U26]` "Example:"
- `[Q27]` "EXSAT need to be changed in case if Date is need to be postponed."
- `[V26]` FormulaOfExSAT=IF(P16<=2018,IF(S16>1,IF(R16<4,R16+9,IF(AND(R16=8,Q16<=5),"A",R16-3)),0),R16+9)
- `[V27]` FormulaOfExSAT1=IF(P16<=2018,IF(S16>1,IF(AND(R16=9,Q16<=30),"B",R16-3),0),R16+9)

## What this means for the build

1. Build a repeating grid of up to six challan rows mapping E/F/G/H → `BSRCode`, `DateDep`, `SrlNoOfChaln`, `Amt`; emit a `TaxPayment` element only for rows that carry a BSR code (per the `[E16]` gate).
2. **Convert the date:** sheet input is DD/MM/YYYY; `DateDep` in JSON must be YYYY-MM-DD.
3. Set `TotalTaxPayments` = SUM of all `Amt` (mirror `[H24]`), and enforce total == sum-of-rows (rules.json n=843). It is the one required field.
4. Auto-number Sl. No. for display only — it is not a schema field.
5. The AT/SAT and quarter classification (columns Q–AA, hidden rows 1–11) is presentation/carry-over into Part B-TTI 10a/10d and is not part of this block's JSON — do not build it here. The date-of-deposit split for Part B-TTI (n=837/838/839) is: on/before 31/03/2026 → Advance tax (10a); after 31/03/2026 → Self-Assessment tax (10d).
6. Serial ≤ 99999; amounts are non-negative integers ≤ 99999999999999.
