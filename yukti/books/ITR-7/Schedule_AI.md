# The book of Schedule AI — Aggregate of Income Derived · ITR-7, A.Y. 2026-27

Read row by row from the utility's **AI** sheet (rows 3–23; no hidden rows) and
confirmed against the CBDT ITR-7 schema block **ScheduleAI**. This is the
**receipts side** of a trust or institution claiming exemption: the *Aggregate
of income derived during the previous year* **excluding** Voluntary
Contributions — the complement of Schedule VC. Per its head note it is *to be
filled by assessees claiming exemption u/s 11 and 12 or u/s 10(23C)(iv) or
10(23C)(v) or 10(23C)(vi) or 10(23C)(via)*. Nothing here is invented: Appendix 2
lists every schema leaf, Appendix 3 reproduces every live row verbatim.

---

## 1 · Purpose and shape

One fixed column of income categories (amount in column G/L, schema key echoed
in column M), plus a small sub-table for "any other income". The categories are:
receipts from main objects, receipts from incidental objects, rent, commission,
dividend income, interest income, agriculture income, net consideration on
transfer of capital asset, any other income (a Nature/Amount sub-table with its
own Total), and pass-through income. The schedule closes with an aggregate total.

Because voluntary contributions (donations) are captured separately in Schedule
VC, Schedule AI records **only the income derived from property held under trust
and the institution's operating receipts** — never the donations.

---

## 2 · The rows → schema map

| Row | Item | Label (verbatim) | Type | Schema key |
|---|---|---|---|---|
| 3 | — | Aggregate of income derived during the previous year excluding Voluntary contributions [to be filled by assesses claiming exemption u/s 11 and 12 or u/s 10(23C)(iv) or 10(23C)(v) or 10(23C)(vi) or 10(23C)(via)] | header | — |
| 4 | 1 | Receipts from main objects | integer | `RecptMainObj` |
| 5 | 2 | Receipts from incidental objects | integer | `RecptsIncidentalObj` |
| 6 | 3 | Rent | integer | `Rent` |
| 7 | 4 | Commission | integer | `Commission` |
| 8 | 5 | Dividend income | integer | `DividendIncome` |
| 9 | 6 | Interest income | integer | `InterestIncome` |
| 10 | 7 | Agriculture income | integer | `AgricultureIncome` |
| 11 | 8 | Net consideration on transfer of capital asset | integer | `NetConsdrnTrnsfrCapAsst` |
| 12 | 9 | Any other income (specify nature and amount) | sub-table header | `OthersInc.OthersIncDtls[]` |
| 13 | — | Sl. No. · Nature of the income · Amount | sub-table columns | `OthersInc.OthersIncDtls[].OthNatOfInc` · `OthersInc.OthersIncDtls[].OthAmount` |
| 19 | 9a | Pass through income (Fill schedule PTI) | integer | `PassThroughIncome` |
| 20 | — | Total | integer (computed) | `TotalofOtherIncomes` |
| 23 | — | Total(1+2+3+4+5+6+8+9) | integer (computed) | `TotalofAggregateIncomes` |

---

## 3 · The law and computation the section-builder must encode

**What Schedule AI is.** For a trust/institution the exemption under section 11
(or the corresponding 10(23C) clause) is computed on **income derived from
property held under trust**. Schedule AI aggregates that income by source so the
exemption / application-of-income working (Schedule ER, EC, Part BTI) has a
receipts base that **excludes voluntary contributions** (which live in Schedule
VC). The head note ties eligibility to exemption u/s 11 and 12 or u/s
10(23C)(iv)/(v)/(vi)/(via).

**The category lines (1–8).** Direct inputs:
- **1 Receipts from main objects** (`RecptMainObj`) — receipts from carrying out
  the primary charitable/religious objects.
- **2 Receipts from incidental objects** (`RecptsIncidentalObj`) — receipts from
  activities incidental to the main objects.
- **3 Rent** (`Rent`), **4 Commission** (`Commission`), **5 Dividend income**
  (`DividendIncome`), **6 Interest income** (`InterestIncome`), **7 Agriculture
  income** (`AgricultureIncome`), **8 Net consideration on transfer of capital
  asset** (`NetConsdrnTrnsfrCapAsst`).

**9 Any other income (the sub-table).** `OthersInc.OthersIncDtls[]` is an array;
each row carries **Nature of the income** (`OthNatOfInc`, text — required) and
**Amount** (`OthAmount`, integer — required). Row 20 **Total**
(`TotalofOtherIncomes`) sums the amounts of this sub-table together with **9a
Pass through income (Fill schedule PTI)** (`PassThroughIncome`), which is the
income passed through from an investment fund / business trust reported in
Schedule PTI.

**The aggregate total (row 23).** `TotalofAggregateIncomes` =
**Total(1+2+3+4+5+6+8+9)** — the sum of the category lines and the "any other
income" total. (The label's own arithmetic list is 1+2+3+4+5+6+8+9; line 7
Agriculture income, being exempt/rate-only, and the segregation of line 9 follow
the utility's own formula.)

**Cross-sheet feeds.** Schedule AI's aggregate is the income base carried to the
exemption and application-of-income schedules (ER/EC) and Part B-TI; its
pass-through line reconciles to Schedule PTI. It stands alongside Schedule VC
(voluntary contributions) — together they are the trust's full receipts side.

---

## 4 · Dropdowns

Schedule AI has **no value dropdowns** — every input is a numeric amount or the
free-text "Nature of the income". The dump reports only formatting sources with
null value lists.

---

## Appendix 1 · Dropdown values (verbatim)
```
(none — Schedule AI has no selectable dropdown lists; inputs are integer amounts or free text)
```

---

## Appendix 2 · Every schema leaf of block ScheduleAI (full paths)
`*` = required.
```
* RecptMainObj integer
* RecptsIncidentalObj integer
* Rent integer
* Commission integer
* DividendIncome integer
* InterestIncome integer
* AgricultureIncome integer
* NetConsdrnTrnsfrCapAsst integer
  OthersInc.OthersIncDtls[] array
* OthersInc.OthersIncDtls[].OthNatOfInc string
* OthersInc.OthersIncDtls[].OthAmount integer
* PassThroughIncome integer
* TotalofOtherIncomes integer
* TotalofAggregateIncomes integer
```

---

## Appendix 3 · Every live row of the sheet, verbatim
```
[D3] Schedule AI  |  [G3] Aggregate of income derived during the previous year excluding Voluntary contributions [to be filled by assesses claiming exemption u/s 11 and 12 or u/s 10(23C)(iv) or 10(23C)(v) or 10(23C)(vi) or 10(23C)(via)]
[G4] Receipts from main objects
[G5] Receipts from incidental objects
[G6] Rent
[G7] Commission
[G8] Dividend income
[G9] Interest income
[G10] Agriculture income
[G11] Net consideration on transfer of capital asset
[G12] Any other income (specify nature and amount)
[G13] Sl. No.  |  [H13] Nature of the income  |  [I13] Amount
[F19] 9a  |  [G19] Pass through income (Fill schedule PTI)  |  [L19] 9a
[G20] Total
[G23] Total(1+2+3+4+5+6+8+9)
```
