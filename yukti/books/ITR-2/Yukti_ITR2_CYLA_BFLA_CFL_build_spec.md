# CYLA · BFLA · CFL — the build specification, from the ITR-2 utility's own code

Every rule below is taken from the utility's formulas on the **CYLA – BFLA**
and **CFL** sheets, the **House Property** helper cells they read, and the VBA
that auto-fills and validates them. The cell references are given so each
rule can be checked against the workbook. Nothing is taken from any other
form.

---

## 1 · The inputs the chain reads

| Named cell | Formula in the utility | What it is |
|---|---|---|
| `cyla.TotHPlossCurYr` (G6) | `ABS(MIN(HP.TotalIncomeChargeableUnHP, 0))` | this year's house-property loss, in full |
| `HP.REStwolakh` (HP N74) | `IF(bacValue=1, 0, MAX(HP.TotalIncomeChargeableUnHP, −200000))` | the part of that loss CYLA may use — **capped at ₹2,00,000; nil under the new regime** |
| `HP.REMloss` (HP N75) | `MAX(0, −HP.TotalIncomeChargeableUnHP − 200000)` | the part above ₹2,00,000 — goes straight to CFL |
| `cyla.TotOthSrcLossNoRaceHorse` (I6) | `ABS(MIN(os.BalanceNoRaceHorse, 0))` | this year's other-sources loss at normal rates |
| the eleven income cells (column F) | `MAX(0, …)` of each head's own schedule | income only if positive |
| `bacValue` | 1 = new regime, 2 = old | |

The six capital-gain income cells read **Table E of Schedule CG after its own
set-off** — `IHLA.E…_CurrYrCapGain` — so a capital loss never enters CYLA; it
was already set inside CG and its unused part goes to CFL.

---

## 2 · Schedule CYLA — the algorithm

### The eleven rows, in the order the utility fills them

The utility keeps a running "loss remaining" per column (the S chain for the
house-property loss, the U chain for the other-sources loss) and walks the
rows in a fixed order, at each row taking
`MIN(loss remaining, income of that row − whatever the other loss already took)`.

**House-property loss — order of set-off** (from the S/O formula chain):

| Order | Row | Formula |
|---|---|---|
| 1 | Salaries | `O8 = IF(S6 < income − OSsetoff, S6, income − OSsetoff)` |
| 2 | Net income from other sources at normal rates | `O22 = IF(S12 < income, S12, income)` |
| 3 | Profit from race horses | `O23 = IF(S22 < income − OSsetoff, S22, …)` |
| 4 | Short-term at 30% | `O15 = IF(S23 < income − OSsetoff, S23, …)` |
| 5 | Short-term at applicable rates | `O16 = IF(S15 < …)` |
| 6 | Short-term at 20% | VBA — *"STCG 20% newly added 19 Feb 25"* — `slotRem = MAX(0, income − OSsetoff − HPsetoff)`; take `MIN(setOffRem, slotRem)` |
| 7 | Long-term at 12.5% | VBA — *"LTCG 12.5% newly added 26 Feb 25"* — same pattern |
| 8 | Short-term at DTAA rates | same |
| 9 | Long-term at DTAA rates | same |
| 10 | Other sources at DTAA rates | same |

**Not a target:** the house-property row itself — `HP.IncCYLA` has no
`HPlossCurYrSetoff` field in the schema.

**Other-sources loss — order of set-off** (from the U/Q chain):

| Order | Row | Formula |
|---|---|---|
| 1 | **Profit from race horses** | `Q23 = IF(U6 < income, U6, income)` — the closest head goes first |
| 2 | Salaries | `Q8 = IF(U23 < income, U23, income)` |
| 3 | House property | `Q9 = IF(U8 < income, U8, income)` |
| 4 | Short-term at 30% | `Q15 = IF(U12 < income, U12, income)` |
| 5 | Short-term at applicable rates | `Q16 = IF(U15 < …)` |
| 6–10 | the Feb-25 slots and the DTAA rows | VBA, same pattern |

**Not a target:** the other-sources row itself — `OthSrcExclRaceHorse.IncCYLA`
has no `OthSrcLossNoRaceHorseSetoff` field.

### The totals

| Row | Formula | Meaning |
|---|---|---|
| xiii — total house-property loss set off | `G25 = MIN(SUM(G8, G12:G17, G19, G21:G24), cyla.TotHPlossCurYr, 200000)` | **never more than ₹2,00,000** |
| xiii — total other-sources loss set off | `I25 = SUM(I8:I12, I14:I17, I19, I21:I24)` | no cap |
| xiv — house-property loss remaining | `G26 = IF(bacValue=1, 0, IF(TotHPlossCurYrSetoff < 200000, MAX(0, (capped loss − G25) + HP.REMloss), HP.REMloss))` | what goes to CFL: the unabsorbed part of the capped loss plus the excess over ₹2 lakh — **nil under the new regime** |
| xiv — other-sources loss remaining | `I26 = MAX(0, TotOthSrcLoss − I25)` | shown, but **not carried** — there is no OS column in CFL; it lapses |
| column 5 on every row | `income − HPsetoff − OSsetoff`, rounded | feeds BFLA column 1 |

### The regime rule, exactly as the utility has it

Under the new regime (`bacValue = 1`):
- `HP.REStwolakh` is 0 → nothing is available to CYLA → **no set-off against any head**
- `G26` is 0 → **nothing carries to CFL either**

The utility's formulas give a new-regime house-property loss no path forward.
Yukti follows the utility.

### The override

`EditAutopoulatedDetail` Y/N. On Y the set-off cells become typeable and the
VBA validators run: each cell ≤ 14 digits, digits only; the row's set-off ≤ its
income; the column total ≤ the loss available (and ≤ ₹2,00,000 for house
property).

---

## 3 · Schedule BFLA — the algorithm

### The inputs

| Named cell | Source | What it is |
|---|---|---|
| column 1 on every row | `= column 5 of CYLA` (`F34 = J8` etc.) | income after current-year set-off |
| `totofbfloss.HPLossCF8` (CFL G22) | `SUM(G6:G21)` | brought-forward house-property loss, all eight years |
| `totofbfloss.STCGLossCF8` (CFL O22) | `SUM(O6:O21)` | brought-forward short-term capital loss |
| `totofbfloss.LTCGLossCF8` (CFL R22) | `SUM(R6:R21)` | brought-forward long-term capital loss |
| `totofbfloss.OthSrcLossRaceHorseCF8` (CFL U22) | `SUM(U16:U21)` | brought-forward race-horse loss, the live years only |

### Which loss goes where — from the formulas and the schema

| Brought-forward loss | Set against | Formula |
|---|---|---|
| House property | **house-property income only** | `O35 = IF(S35 < HP income, S35, HP income)` |
| Short-term capital | short-term at 30% first, then applicable, then 20%, then DTAA; **then the long-term slots, after the long-term loss has had them** | `O41 = IF(S41 < stcg30, …)`; `W41 = S41 − used`; `O42 = IF(W41 < stcgApp, …)`; the LTCG rows use the nested `AJ41 / AQ41 / AI48 / AK48` helpers |
| Long-term capital | **long-term at 12.5% and long-term DTAA only** | the `AJ/AK` helpers: LTCL goes first against each long-term slot; what is left of the slot may then take short-term loss |
| Race horses | **race-horse income only** | `O49 = IF(S49 < income, S49, income)` |

**No brought-forward loss against salary, other sources at normal rates, or
other sources at DTAA rates** — those rows compute `I = F` with no set-off
column (`I34 = F34`, `I50 = MAX(0, F50 − H50 − 0)` where H is the hidden
depreciation column).

**Oldest first** is implicit — the totals come from CFL where the earliest live
year is the first row, and the lapse rule in CFL (below) is what enforces it.

### The three validators the VBA runs on an override

| Validator | Rule | Message |
|---|---|---|
| `ValidateBFLA_STCG_MorethanCFL_STCG` | the set-off against short-term gains ≤ the short-term loss brought forward | *"Losses set off cannot be more than the losses brought forward from previous years in Schedule CFL."* |
| `ValidateBFLA_LTCG_Limit_CFL` | the set-off against long-term gains ≤ short-term **plus** long-term loss brought forward | same message |
| `ValidateBFLA_Maximum_losses_Notset_Total` | if loss is still available **and** income is still standing, the return is refused | *"Maximum losses has not been setoff"* |

The third one matters most: the utility does not let a person carry forward a
loss they could have used this year.

### The totals

| Row | Formula |
|---|---|
| xii — total brought-forward loss set off | `G51 = SUM(G35:G38, G40:G43, G45, G47:G50)` |
| xiii — income remaining after set-off | `I52 = SUM(I34:I50)` → **this is gross total income** |

---

## 4 · Schedule CFL — the algorithm

### The table

Eight live years, one row each, the older rows hidden:

| Row | Year | Columns live |
|---|---|---|
| i | 2018-19 | HP · STCL · LTCL |
| ii | 2019-20 | HP · STCL · LTCL |
| iii | 2020-21 | HP · STCL · LTCL |
| iv | 2021-22 | HP · STCL · LTCL |
| v | 2022-23 | HP · STCL · LTCL · race horses |
| vi | 2023-24 | HP · STCL · LTCL · race horses |
| vii | 2024-25 | HP · STCL · LTCL · race horses |
| viii | 2025-26 | HP · STCL · LTCL · race horses |

Per row the person enters the **date of filing** and the loss figures. The
`I = G + H` and `Q = O + P` formulas on each row are the hidden business
columns summing — nil on ITR-2.

### The four computed rows

| Row | Formula | Meaning |
|---|---|---|
| ix — total of earlier-year losses | `G22 = SUM(G6:G21)`, `O22`, `R22`, `U22 = SUM(U16:U21)` | brought forward, per column |
| x — adjustment in BFLA | `adjtotloss.*` — what BFLA used, per column | |
| xi — current-year losses | `G24 = sheet16.BalHPlossCurYrAftSetoff` (CYLA xiv) · `O24 = Σ Table E's unabsorbed short-term loss columns` · `R24 = Σ Table E's unabsorbed long-term loss columns` · `U24 = ABS(MIN(os.BalanceOwnRaceHorse, 0))` | assembled, not typed |
| xii — carried forward | see the lapse rule | |

### The lapse rule — the one thing the sheet does not say in words

`G25 = IF(CFL_HP_Normal_2018 > adjtotloss.HPLossCF9,
          MAX(0, total − CFL_HP_Normal_2018 + current),
          MAX(0, total − adjtotloss.HPLossCF9 + current))`

In words: **the 2018-19 loss is the eighth year. Whatever BFLA did not use of it
lapses.** So carried forward = total brought in − MAX(what BFLA used, the
2018-19 loss) + this year's loss. The same formula runs for short-term (`O25`)
and long-term (`R25`).

For race horses (`U25`) the same rule runs on **2022-23** — the fourth year —
because that column's window is four years.

---

## 5 · The chain, end to end

```
Schedule HP  ──── loss ──┐
                         │  capped 2L (old) / nil (new)        excess over 2L
Schedule OS  ── loss ────┤                                          │
                         ▼                                          │
                       CYLA  ── sets against the 11 heads ──► column 5 ──► BFLA col 1
                         │                                                    │
                    remaining HP ─────────────────────────────────────────────┼──► CFL row xi
                    remaining OS ──► lapses                                   │
                                                                              │
Schedule CG Table E ── unabsorbed STCL / LTCL ────────────────────────────────┼──► CFL row xi
Schedule OS 8e ── race-horse loss ────────────────────────────────────────────┘

CFL rows i–viii (brought forward) ──► totals ──► BFLA col 2 ──► BFLA col 4 ──► GROSS TOTAL INCOME
                                                     │
                                          what BFLA used ──► CFL row x
                                          the 8th / 4th year unused ──► lapses
                                          CFL row xii ──► next year's CFL
```

---

## 6 · What the person types, and what they do not

**Typed:**
- CFL — per year that had a loss: date of filing, and the figures in the live
  columns
- the two override switches on CYLA and BFLA, and the cells they unlock

**Everything else is computed** — the eleven income cells, both set-off
matrices, the CYLA and BFLA totals, CFL rows ix to xii.

---

## 7 · The build

1. **Engine — `engLoss()` rewritten to this document.** The eleven-row set; the
   two ordered walks for the two current-year losses with a running remaining
   per column; the ₹2,00,000 cap and the new-regime nil from `HP.REStwolakh`;
   the excess over 2 lakh straight to CFL; BFLA with HP→HP, STCL→short then
   long, LTCL→long only, race→race, the LTCL-first rule on the long slots; the
   CFL totals, the BFLA adjustment, the assembled current-year row, and the
   lapse rule on 2018-19 and 2022-23.
2. **Screen — one section, three parts in order.** CYLA as a matrix with the
   two loss columns, disallowed cells greyed, the override switch. BFLA as a
   matrix with one brought-forward column, the three rows without it greyed,
   the override switch, and the three validator messages shown live. CFL as the
   eight-year table with the date column required on any row with a loss, the
   race-horse column only on the last four rows, and rows ix–xii computed.
3. **Export** — `ScheduleCYLA` and `ScheduleBFLA` with every live row's object
   on the schema's keys and `EditAutopoulatedDetail`; `ScheduleCFL` with a year
   object for each year that carries a loss and the four summary objects.
   Validated against the schema before the file is written.
