# The book of Schedule IE-2 — Income & Expenditure (regime 2) · ITR-7, A.Y. 2026-27

Read row by row from the utility's **IE-2** sheet (rows 3–11; no hidden rows) and
confirmed against the CBDT ITR-7 schema block **ScheduleIE_II**. This is the
**Income & Expenditure statement** for institutions where **only certain heads of
income are taxable and the other receipts are exempt** — sections **10(23A) and
10(24)**. Per its head note it is *Applicable for assessees claiming exemption
under sections 10(23A), 10(24)) {Where certain heads of income only are taxable
and other receipts reported in Row A below are exempt}*. Nothing is invented:
Appendix 2 lists every schema leaf, Appendix 3 reproduces every live row verbatim,
Appendix 1 the dropdown.

---

## 1 · Purpose and shape

Block **A** is the exempt-receipts statement (three figures, like IE-1). Block
**B** is a Yes/No gate: *do you have any income which is taxable?* and, if so, a
four-line checklist that routes each taxable head to its own schedule.

| Row | Item | Label (verbatim) | Type | Schema key |
|---|---|---|---|---|
| 3 | — | Income & Expenditure statement (Applicable for assessees claiming exemption under sections 10(23A), 10(24)) | header | — |
| 4 | A | Total receipts including any voluntary contribution (Excluding receipts falling under taxable heads to be reported as per Row B) | integer | `TotRcptVoluntaryContr` |
| 5 | — | Application of income towards object of the institution | integer | `AppIncTwrdsObjInstn` |
| 6 | — | Accumulation of income | integer | `AccmltnOfInc` |
| 7 | B | Do you have any income which is taxable? If Yes Please provide details | dropdown Yes/No | `AnyIncomeTaxable` |
| 8 | a | Income from House Property (If yes, Please fill Schedule HP) | dropdown Yes/No | `HPIncome` |
| 9 | b | Income from Business or Profession (if yes, Please fill Schedule BP) | dropdown Yes/No | `BPIncome` |
| 10 | c | Income from Capital gains (if yes, Please fill Schedule CG) | dropdown Yes/No | `CGIncome` |
| 11 | d | Income from other Sources (if yes, Please fill Schedule OS) | dropdown Yes/No | `OSIncome` |

---

## 2 · The law and computation the section-builder must encode

Sections **10(23A)** (income of a professional association/institution) and
**10(24)** (income of a registered trade union / association of registered trade
unions) exempt the entity's income **except** income chargeable under the heads
"Income from house property", "Income from other sources", and (for 10(24))
income from a business/capital gains. The IE-2 layout mirrors that carve-out:

**Block A — the exempt receipts statement.**
- **A Total receipts including any voluntary contribution** (`TotRcptVoluntaryContr`)
  — gross receipts inclusive of voluntary contributions, **excluding receipts
  falling under taxable heads to be reported as per Row B**.
- **Application of income towards object of the institution** (`AppIncTwrdsObjInstn`).
- **Accumulation of income** (`AccmltnOfInc`).

**Block B — the taxable-heads gate.**
- **B Do you have any income which is taxable?** (`AnyIncomeTaxable`) — a Yes/No
  master switch (required). If Yes, the four sub-lines identify which heads apply:
- **a Income from House Property** (`HPIncome`) → fill Schedule HP.
- **b Income from Business or Profession** (`BPIncome`) → fill Schedule BP.
- **c Income from Capital gains** (`CGIncome`) → fill Schedule CG.
- **d Income from other Sources** (`OSIncome`) → fill Schedule OS.

Each of a–d is a Yes/No dropdown; a "Yes" is a routing instruction that the
corresponding computational schedule must be filled and its income offered to
tax, while everything reported in Row A stays exempt under 10(23A)/10(24). The
master `AnyIncomeTaxable` is required; the four head flags are conditional on a
Yes.

---

## 3 · Dropdowns

Row 7 (N7) and rows 8–11 (N8:N11) share one Yes/No list: **(Select) · Yes · No**.
Rows 4–6 (N4:N6) carry only a formatting source with a null value list.

---

## Appendix 1 · Dropdown values (verbatim)
```
(Select)
Yes
No
```

---

## Appendix 2 · Every schema leaf of block ScheduleIE_II (full paths)
`*` = required.
```
* TotRcptVoluntaryContr integer
* AppIncTwrdsObjInstn integer
* AccmltnOfInc integer
* AnyIncomeTaxable string
  HPIncome string
  BPIncome string
  CGIncome string
  OSIncome string
```

---

## Appendix 3 · Every live row of the sheet, verbatim
```
[C3] Schedule IE-2  |  [E3] Income & Expenditure statement (Applicable for assessees claiming exemption under sections 10(23A), 10(24)) {Where certain heads of income only are taxable and other receipts reported in Row A below are exempt}
[C4] A  |  [E4] Total receipts including any voluntary contribution (Excluding receipts falling under taxable heads to be reported as per Row B)
[E5] Application of income towards object of the institution
[E6] Accumulation of income
[C7] B  |  [E7] Do you have any income which is taxable? If Yes Please provide details
[D8] a  |  [E8] Income from House Property (If yes, Please fill Schedule HP)
[D9] b  |  [E9] Income from Business or Profession (if yes, Please fill Schedule BP)
[D10] c  |  [E10] Income from Capital gains (if yes, Please fill Schedule CG)
[D11] d  |  [E11] Income from other Sources (if yes, Please fill Schedule OS)
```
