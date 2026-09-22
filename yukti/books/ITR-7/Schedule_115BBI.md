# The book of Schedule 115BBI — ITR-7, A.Y. 2026-27

Read row by row from the utility's **Schedule 115BBI** sheet, with the dropdowns
and the cell formulas, and confirmed against the schema block `Schedule115BBI`
and the section map (`Schedule 115BBI` → section **si** → block
`Schedule115BBI`). Item numbers (1–6, Total) are taken from the sheet's row
order and the schema.

---

## Schedule 115BBI — Specified income of certain institutions under section 115BBI

*"Schedule 115BBI — Specified income of certain institutions under section
115BBI."* Section 115BBI charges the **specified income** of a trust or
institution registered under section 12AA/12AB or approved under section
10(23C) to tax at a flat **30%** (no deduction of expenditure or allowance
against it). "Specified income" is the income that has fallen out of exemption
for a defined default — deemed income, income applied outside the objects,
accumulation in excess of the permitted 15%, and the like. ITR-7 is the return
of such institutions, so this schedule collects each limb of specified income
and totals it; the total is the base on which the 30% is charged.

## 1 · Purpose and shape

The schedule is a short list of specified-income limbs (Sl. No. 1–6) followed by
a total. Each limb is an amount typed by the filer; the total is computed.

| Row/Cell | Sl | Label (column D) | Type | Schema key |
|---|---|---|---|---|
| D4 | 1 | **Deemed income referred in Explanation 4 to the third proviso to section 10(23C) or section 11(3)** | integer | `DeemedIncSec1023C_113` |
| D5 | 2 | **Deemed income referred under section 11(1B)** | integer | `DeemedIncSec111B` |
| D6 | 3 | **Income which is deemed to be income under the twenty-first proviso to Section 10(23C) or which is not excluded from the total income as per section 13(1)(c)** | integer | `IncDeemedSec131c` |
| D7 | 4 | **Income which is not exempt under section 10(23C) on account of violation of clause (b) of the third proviso of section 10(23C) or which is not excluded from the total income as per section 13(1)(d)** | integer | `IncNotExemptSec131d` |
| D8 | 5 | **Income which is not excluded from the total income as per section 11(1)(c)** | integer | `IncNotExcludedSec111c` |
| D9 | 6 | **Income accumulated or set apart in excess of fifteen per cent of the income where such accumulation is not allowed under any specific provision of this Act** | integer | `IncAccInExcess` |
| D10 | Total | **Total (total of Sl.No. 1 to 6)** | computed = Σ 1..6 | `Total` |

## 2 · The law / computation

- Section 115BBI taxes the aggregate of the six specified-income limbs at a flat
  **30%**, with no deduction for expenditure/allowance and no set-off of loss
  against that income.
- Each limb (Sl. No. 1–6) is a typed amount. The six limbs correspond to the
  statutory heads of specified income: deemed income under Explanation 4 to the
  third proviso to 10(23C) / section 11(3) (limb 1); deemed income under
  11(1B) (limb 2); income deemed under the twenty-first proviso to 10(23C) or
  not excluded per 13(1)(c) (limb 3); income not exempt under 10(23C) for
  violation of clause (b) of the third proviso, or not excluded per 13(1)(d)
  (limb 4); income not excluded per 11(1)(c) (limb 5); and income accumulated or
  set apart in excess of fifteen per cent where such accumulation is not allowed
  (limb 6).
- **Item Total** "Total (total of Sl.No. 1 to 6)" = D4 + D5 + D6 + D7 + D8 + D9
  (`Total`). This total is the 115BBI specified income feeding the special-rate
  tax computation (Part B-TTI / the tax engine charges it at 30%).

## 3 · The dropdowns

The sheet carries **no value-list dropdowns**. The data-validations on the
amount cells (`K4:M5`, `K6:M8`, `K9:M10` — source `0`) are numeric-format
constraints, not enumerations.

## 4 · Hidden rows

None (`hidden_rows` = 0 in `sheet_map.json`). All six limbs and the total are
visible.

## 5 · Cross-sheet feeds

| Flows | To |
|---|---|
| item **Total** `Total` | the special-rate tax computation — the 115BBI specified income charged at 30% into Part B-TTI |

## 6 · Schema — block `Schedule115BBI`

Every leaf is marked **required** in the schema (each of the six limbs and the
Total). The block is written when the institution has specified income under
section 115BBI; when present, all seven integer leaves must be filled (zero
where a limb does not apply). Full leaf list in **Appendix B**.

## 7 · What this means for the build

A short typed card: six specified-income amounts (Sl. No. 1–6), each an integer,
and a computed, untypeable Total = Σ of the six. The Total feeds the 30% 115BBI
charge into the tax computation. All seven leaves are required once the block is
present. No dropdowns, no repeating table, no hidden rows.

---

## Appendix A · Every live row, verbatim (dump)

```
r   3 : [C3] Schedule 115BBI  |  [D3] Specified income of certain institutions under section 115BBI
r   4 : [D4] Deemed income referred in Explanation 4 to the third proviso to section 10(23C) or section 11(3)
r   5 : [D5] Deemed income referred under section 11(1B)
r   6 : [D6] Income which is deemed to be income under the twenty-first proviso to Section 10(23C) or which is no
r   7 : [D7] Income which is not exempt under section 10(23C) on account of violation of clause (b) of the third
r   8 : [D8] Income which is not excluded from the total income as per section 11(1)(c )
r   9 : [D9] Income accumulated or set apart in excess of fifteen per cent of the income where such accumulation
r  10 : [D10] Total (total of Sl.No. 1 to 6)
```

Full labels (from sharedStrings, truncated on screen):
- **Sl. 3 (D6):** *"Income which is deemed to be income under the twenty-first
  proviso to Section 10(23C) or which is not excluded from the total income as
  per section 13(1)(c)."*
- **Sl. 4 (D7):** *"Income which is not exempt under section 10(23C) on account
  of violation of clause (b) of the third proviso of section 10(23C) or which is
  not excluded from the total income as per section 13(1)(d)."*
- **Sl. 6 (D9):** *"Income accumulated or set apart in excess of fifteen per
  cent of the income where such accumulation is not allowed under any specific
  provision of this Act."*

## Appendix B · Schema leaves — block `Schedule115BBI` (`*` = required)

```
* DeemedIncSec1023C_113 integer
* DeemedIncSec111B integer
* IncDeemedSec131c integer
* IncNotExemptSec131d integer
* IncNotExcludedSec111c integer
* IncAccInExcess integer
* Total integer
```

## Appendix C · Dropdowns

No value-list dropdowns. Data-validation constraints only: `K4:M5`, `K6:M8`,
`K9:M10` source `0` (numeric).
