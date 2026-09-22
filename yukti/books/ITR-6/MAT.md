# The book of Schedule MAT — ITR-6, A.Y. 2026-27

Read from the utility's **MAT** sheet (`sheet51.xml`, **visible**, 55 rows,
**0 hidden rows**), with every column header, the data-validation lists, the
cell formulas and the helper columns, confirmed against the schema block
`ScheduleMAT` and the validation-rules document (Schedule MAT, serials 665–676;
Part B feeds 745, 768, 771; Category D 5–6).

Schedule MAT is the **company-specific Minimum Alternate Tax under section
115JB** — *"Computation of Minimum Alternate Tax payable under section 115JB"*.
It is ITR-6's counterpart to the AMT (s.115JC) that ITR-5 and ITR-2 carry:
where AMT works off *adjusted total income*, MAT works off **book profit** — the
profit after tax in the company's statement of profit and loss, adjusted up and
down by a long, fixed list of add-backs and deductions, then taxed at the MAT
rate. The credit for MAT paid above normal tax is Schedule MATC (a separate
book).

---

## 1 · When MAT applies on ITR-6

- **Only a domestic company** fills Schedule MAT/MATC — rule 685: *"In Part-A
  General, if Type of Company is selected as 'Domestic company' then Schedule
  MAT/MATC are to be filled."* The applicability is driven off Part A-General's
  company-type / `DomesticCompFlg` flag (helper `Y35 = MID(sheet1.DomesticCompFlg,1,1)`).
- **Not applicable if the company opts for the concessional regime** under
  section **115BAA or 115BAB** — rule 674: *"As per section 115JB assessee is
  not liable to compute MAT, if opting for tax regime under section 115BAA or
  115BAB."* This is enforced in the sheet itself: both the deemed-income line
  (`J50`) and the tax line (`J53`) return **0** when
  `MID(sheet1.NRI_115BA_1,9,6)` is `"115BAA"` or `"115BAB"`.
- **Book profit must be positive** — the tax line is nil where deemed total
  income (item 9) is `<= 0`.

So the MAT population on ITR-6: a **domestic company on the old/normal regime**
(not 115BAA/115BAB) with a positive book profit.

The **MAT rate** is **15%** on ordinary book profit, and a concessional **9%**
on the portion of book profit deemed to arise from **units located in an IFSC**
(item 9a). Surcharge and cess on the MAT are applied in Part B-TTI (line 1a–1d),
not on this sheet.

---

## 2 · The three opening questions — items 1, 2, 3

| Item | Sheet cell | Label | Type / enum | Schema key | Hidden? |
|---|---|---|---|---|---|
| **1** | E4 · dropdown J4 | Whether the statement of profit and loss is prepared in accordance with the provisions of Parts II of Schedule III to the Companies Act, 2013 (If yes, write '1', if no write '2') | dropdown **(Select) / 1 / 2** | `PLAcntPrepSchedVICompAct` | no |
| **2** | E5 · dropdown J5 | If 1 is no, whether statement of profit and loss is prepared in accordance with the provisions of the Act governing such company (if Yes, write '1', if no write '2') | dropdown **(Select) / 1 / 2** | `PLAcctFlg` *(schema-optional)* | no |
| **3** | E6 · dropdown J6 | Whether, for the statement of profit and loss referred to in item 1 above, the same accounting policies, accounting standards and same method and rates for calculating depreciation have been followed as have been adopted for preparing accounts laid before the company at its annual general body meeting? (If yes, write '1', if no write '2') | dropdown **(Select) / 1 / 2** | `PLAcntPrepAsperAGM` | no |

The dropdown list on **J4:J6** is `(Select), 1, 2` — the same three values on all
three questions. These three flags drive the internal case matrix (helper
columns `Cond1/Cond2/Cond3`, cases 1–12 in `M33:T35`) that the utility uses to
decide messages/paths; they do **not** change the arithmetic of book profit.

---

## 3 · Item 4 — profit after tax

| Item | Sheet cell | Label | Type | Schema key | Derivation |
|---|---|---|---|---|---|
| **4** | E7 | Profit after tax as shown in the statement of profit and loss (enter item 56 of Part A-P&L) / (enter item 56 of Part A-P&L Ind AS) (as applicable) | integer, **may be negative** (min −99999999999999) | `ProfAfterTaxPLAcnt` | Fed from **Sl. No. 56 of Part A-P&L** (or Part A-P&L Ind AS). Rule 676: *"Sl. No. 4 … 'Profit after tax as shown in the Profit and Loss Account' should be equal to Sl. No. 56 – Part A-P&L / Part A-P&L-Ind AS."* |

This is the only line of the schedule that may carry a negative value.

---

## 4 · Item 5 — Additions (if debited to the statement of profit and loss)

All add-back leaves are **schema-required, minimum 0** (non-negative). Each row is
a typed input on column H; the total is computed.

| Item | Sheet cell | Label | Schema key |
|---|---|---|---|
| 5a | F9 | Income-tax paid or payable or its provision including the amount of deferred tax and the provision thereof | `Additions.ITPaidInclDefTax` |
| 5b | F10 | Reserve (except reserve under section 33AC) | `Additions.ResvrNo33AC` |
| 5c | F11 | Provisions for unascertained liability | `Additions.ProvUncertainLiab` |
| 5d | F12 | Provisions for losses of subsidiary companies | `Additions.ProvLossOfSubsComp` |
| 5e | F13 | Dividend paid or proposed | `Additions.DividendPaidOrProposed` |
| 5f | F14 | Expenditure related to exempt income under sections 10, 11 or 12 [exempt income excludes income exempt under section 10(38)] | `Additions.ExpendExempIncUs10s` |
| 5g | F15 | Expenditure related to share in income of AOP/ BOI on which no income-tax is payable as per section 86 | `Additions.ExpAopBoi` |
| 5h | F16 | Expenditure in case of foreign company referred to in clause (fb) of explanation 1 to section 115JB | `Additions.ExpClauseFb` |
| 5i | F17 | Notional loss on transfer of certain capital assets or units referred to in clause (fc) of explanation 1 to section 115JB | `Additions.NotLossClauseFc` |
| 5j | F18 | Expenditure relatable to income by way of royalty in respect of patent chargeable to tax u/s 115BBF | `Additions.NotLossUs115bbf` |
| 5k | F19 | Depreciation attributable to revaluation of assets | `Additions.DepreciatAttribToRevalAsset` |
| 5l | F20 | Gain on transfer of units referred to in clause (k) of explanation 1 to section 115JB | `Additions.GainClauseK` |
| 5m | F21 | Others (including residual unadjusted items and provision for diminution in the value of any asset) | `Additions.Others` |
| **5n** | F22 · `J22 = SUM(H9:H21)` | Total additions (5a+5b+5c+5d+5e+5f+5g+5h+5i+5j+5k+5l+5m) | `Additions.TotAdditions` |

**Rules on item 5:**
- Rule 669: *5n = sum of 5a to 5m.*
- Rule 671: *5a should be the minimum of Sl. No. 54 & 55 of Schedule P&L and the value entered at 5a* — i.e. the income-tax add-back is capped at the P&L's own income-tax + deferred-tax figures.

---

## 5 · Item 6 — Deductions

All deduction leaves are **schema-required, minimum 0** except `LossTrnsClauseiig`
(6h), which is schema-optional. Typed on column H; total computed.

| Item | Sheet cell | Label | Schema key |
|---|---|---|---|
| 6a | F24 | Amount withdrawn from reserve or provisions if credited to statement of profit and loss | `Deducts.AmtWithdrawFromResvrIfCredPL` |
| 6b | F25 | Income exempt under sections 10, 11 or 12 [exempt income excludes income exempt under section 10(38)] | `Deducts.IncExempIncUs10s` |
| 6c | F26 | Amount withdrawn from revaluation reserve and credited to statement of profit and loss to the extent it does not exceed the amount of depreciation attributable to revaluation of asset | `Deducts.AmtWithdrawFromResvrIfCredPLNoAttrib` |
| 6d | F27 | Share in income of AOP/ BOI on which no income-tax is payable as per section 86 credited to statement of profit and loss | `Deducts.ShareIncAopBoi` |
| 6e | F28 | Income in case of foreign company referred to in clause (iid) of explanation 1 to section 115JB | `Deducts.IncClauseiid` |
| 6f | F29 | Notional gain on transfer of certain capital assets or units referred to in clause (iie) of explanation 1 to section 115JB | `Deducts.NotGainClauseiie` |
| 6g | F30 | Loss on transfer of units referred to in clause (iif) of explanation 1 to section 115JB | `Deducts.LossTrnsClauseiif` |
| 6h | F31 | Income by way of royalty referred to in clause (iig) of explanation 1 to section 115JB | `Deducts.LossTrnsClauseiig` *(schema-optional; **name mismatch** — see §11)* |
| 6i | F32 | Loss brought forward or unabsorbed depreciation whichever is less or both as may be applicable | `Deducts.UnAbsorbedDepreciat` |
| 6j | F33 | Profit of sick industrial company till net worth is equal to or exceeds accumulated losses | `Deducts.ProSickIndustryOrExcedAccumLos` |
| 6k | F34 | Others (including residual unadjusted items and the amount of deferred tax credited to P&L A/c) | `Deducts.Others` |
| **6l** | F35 · `H35 = SUM(H24:H34)` | Total deductions (6a+6b+6c+6d+6e+6f+6g+6h+6i+6j+6k) | `Deducts.TotDeducts` |

**Rule 670:** *6l = sum of 6a to 6k.*

---

## 6 · Item 7 — Book profit under section 115JB

| Item | Sheet cell | Label | Schema key | Formula |
|---|---|---|---|---|
| **7** | E36 · `J36` | Book profit under section 115JB (4 + 5n – 6l) | `BookProfUs115JB` | `J36 = -MAT.TotDeducts + MAT.ProfAfterTaxPLAcnt + MAT.TotAdditions` = **item 4 + 5n − 6l** |

**Rule 667:** *The value at field (7) should be equal to sum of Sl. No. (4 + 5n – 6l).*

---

## 7 · Item 8 — Ind-AS adjustments (sub-sections 2A to 2C of 115JB)

| Item | Sheet cell | Label | Type / enum | Schema key |
|---|---|---|---|---|
| **8** (heading) | E37 | Whether the financial statements of the company are drawn up in compliance to the Indian Accounting Standards (Ind-AS) specified in Annexure to the Companies (Indian Accounting Standards) Rules, 2015. If yes, furnish the details below | flag enum **Y / N** (`J37 = sheet1.FinancialStatement`) | `FinancialStamentFlag` *(schema-optional)* |

### 8A — Additions to book profit under sub-sections (2A) to (2C) — heading E38

All four inputs and the total are **schema-required, minimum 0**.

| Item | Sheet cell | Label | Schema key |
|---|---|---|---|
| 8Aa | F39 | Amounts credited to other comprehensive income in statement of profit & loss under the head "items that will not be reclassified to profit & loss" | `AdditionsProfUs115JB.AmountsCredited` |
| 8Ab | F40 | Amounts debited to the statement of profit & loss on distribution of non-cash assets to shareholders in a demerger | `AdditionsProfUs115JB.AmountsDebited` |
| 8Ac | F41 | One fifth of the transition amount as referred to in section 115JB (2C) (if applicable) | `AdditionsProfUs115JB.OneFifthTransitionAmt` |
| 8Ad | F42 | Others (including residual adjustment) | `AdditionsProfUs115JB.OthersInclResidualAdjust` |
| **8Ae** | F43 · `H43 = MAX(0, SUM(8a,8b,8c,8d))` | Total additions (8a + 8b + 8c + 8d) | `AdditionsProfUs115JB.TotalAdditions` |

**Rule 672:** *8A.e = sum of 8Aa to 8Ad.*

### 8B — Deductions from book profit under sub-sections (2A) to (2C) — heading E44

All four inputs and the total are **schema-required, minimum 0**.

| Item | Sheet cell | Label | Schema key |
|---|---|---|---|
| 8f | F45 | Amounts debited to other comprehensive income in statement of profit & loss under the head "items that will not be reclassified to profit & loss" | `DeductionsProfUs115JB.AmountsCredited` *(name mismatch — see §11)* |
| 8g | F46 | Amounts credited to the statement of profit & loss on distribution of non-cash assets to shareholders in a demerger | `DeductionsProfUs115JB.AmountsDebited` *(name mismatch — see §11)* |
| 8h | F47 | One fifth of the transition amount as referred to in section 115JB (2C) (if applicable) | `DeductionsProfUs115JB.OneFifthTransitionAmt` |
| 8i | F48 | Others (including residual adjustment) | `DeductionsProfUs115JB.OthersInclResidualAdjust` |
| **8Bj** | F49 · `H49 = MAX(0, SUM(8f,8g,8h,8i))` | Total deductions (8f + 8g + 8h + 8i) | `DeductionsProfUs115JB.TotalAdditions` *(schema names the deductions total `TotalAdditions`)* |

**Rule 673:** *8B.j = sum of 8f to 8i.*

---

## 8 · Item 9 — Deemed total income, and its 9a / 9b split

| Item | Sheet cell | Label | Schema key | Formula |
|---|---|---|---|---|
| **9** | E50 · `J50` | Deemed total income under section 115JB (7 + 8e – 8j) | `DeemedTotalIncUs115JB` | `J50 = IF(115BAA/115BAB, 0, SUM(BookProfUs115JB, Total8e) − Total8j)` = **item 7 + 8e − 8j**, or **0** under the concessional regime |
| **9a** | E51 (D51 "9a") · helper col | Deemed total income from Units located in IFSC, if any | `DeemedTotalIncUs115JBIFSC` | the portion of item 9 attributable to IFSC units — taxed at 9% |
| **9b** | E52 (D52 "9b") · `J52` | Deemed total income from other Units (9 – 9a) | `DeemedTotalIncUs115JBOther` | `J52 = MAT.Total9 − MAT.Total9a` = **item 9 − 9a** — taxed at 15% |

**Rule 668:** *Item 9 = sum of (7 + 8e – 8j).*
**Rule 675:** *9b = (9 − 9a).*
**Rule 745 (feed out):** Part B-TI's deemed income under 115JB = **Sl. No. 9 of Schedule MAT**.

---

## 9 · Item 10 — Tax payable under section 115JB

| Item | Sheet cell | Label | Schema key | Formula |
|---|---|---|---|---|
| **10** | E53 · `J53` | Tax payable under section 115JB [9% of (9a) + 15% of (9b)] | `TaxPayableUs115JB` | `J53 = IF(Total9<=0, 0, IF(115BAA/115BAB, 0, MAX(ROUND(Total9aNew + Total9bNew, 0), 0)))` = **9% × 9a + 15% × 9b**, nil where book profit ≤ 0 or the concessional regime applies |

The **rate split** is confirmed by the helper columns (`M49:R52`): the 9a slice
carries `0.09`, the 9b slice `0.15`. The IFSC/other split and its surcharge
thresholds (10cr / 5cr / 2cr / 1cr / 50L, helper columns `N47:R52`) are used
only to compute surcharge in Part B-TTI, not here.

**Feeds out:**
- Rule 771: Part B-TTI point **1a** (Tax payable on deemed total income under
  115JB) = **Sl. No. 10 of Schedule MAT**.
- Rule 768: Part B-TTI point 3 (Gross tax payable) = **higher of** 1d (total tax
  on deemed income u/s 115JB, i.e. MAT + surcharge + cess) **or** 2f (gross tax
  liability under normal provisions). MAT bites only when it is the higher.
- Rule 774: 1d "Total Tax Payable on Deemed Total Income u/s 115JB" = Tax on
  deemed income (item 10) + surcharge + cess. This 1d figure is what feeds
  Schedule MATC item 1.

---

## 10 · Dropdowns on this sheet

| Cells | Values |
|---|---|
| J4, J5, J6 | **(Select)**, 1, 2 |

All other data-validation ranges on MAT (H9:H21, H24:H34, H39:H42, H45:H48, and
the computed cells) are numeric-only with no value list.

---

## 11 · What is mandatory · what repeats · hidden rows

**Schema-required leaves** (block written when MAT arises): the three opening
flags `PLAcntPrepSchedVICompAct` and `PLAcntPrepAsperAGM` (item 2 `PLAcctFlg` is
optional), `ProfAfterTaxPLAcnt`, all thirteen `Additions.*` add-backs + total,
all eleven `Deducts.*` deductions + total (6h `LossTrnsClauseiig` optional),
`BookProfUs115JB`, all five `AdditionsProfUs115JB.*`, all five
`DeductionsProfUs115JB.*`, `DeemedTotalIncUs115JB`, `DeemedTotalIncUs115JBIFSC`,
`DeemedTotalIncUs115JBOther`, `TaxPayableUs115JB`. `FinancialStamentFlag`
(item 8 heading) is optional.

**What repeats:** nothing — Schedule MAT is a single fixed set of lines, no
arrays.

**Hidden rows:** **none** on this sheet — all 55 rows are visible.

**Cross-source observations (report):**
1. **Schema name vs. label mismatch, item 6h.** Schema key `Deducts.LossTrnsClauseiig`
   ("loss on transfer") but the label at F31 (6h) reads *"Income by way of
   royalty referred to in clause (iig)"*. The key name is stale from an earlier
   layout; the filed value belongs to the royalty-income line.
2. **Schema name vs. label mismatch, items 8f / 8g.** Schema `DeductionsProfUs115JB.AmountsCredited`
   backs the label *"Amounts **debited** to other comprehensive income"* (8f), and
   `AmountsDebited` backs *"Amounts **credited** to the P&L on distribution…"*
   (8g). The credited/debited words are swapped between key name and label —
   map by position (8f → `AmountsCredited`, 8g → `AmountsDebited`), not by the
   English word.
3. **Deductions-total formula reference bug in the utility.** `H49` reads
   `MAX(0, SUM(MAT.Comp8f, MAT.Profit8g, MAT.115JB8h, MAT.Others8h))` — it sums
   `Others8h` twice and never references the 8i "Others" input. Per rule 673 the
   correct total is 8f + 8g + 8h + 8i; the engine must sum 8i, not 8h twice.
4. The schema names the **8B deductions total** `DeductionsProfUs115JB.TotalAdditions`
   ("Additions") though it is the deductions total; filed as-is.

---

## 12 · Cross-sheet feeds

**In:**
- Item 4 `ProfAfterTaxPLAcnt` ← **Part A-P&L / Part A-P&L Ind AS, Sl. No. 56**.
- Item 5a capped by **Schedule P&L Sl. No. 54 & 55** (income-tax + deferred tax).
- Regime flag `sheet1.NRI_115BA_1` (115BAA/115BAB → whole schedule nil),
  IFSC flag `sheet1.NRI_IFSC_1`, domestic-company flag `sheet1.DomesticCompFlg`,
  Ind-AS flag `sheet1.FinancialStatement` — all from **Part A-General**.

**Out:**
- Item 9 → **Part B-TI** deemed income u/s 115JB (rule 745).
- Item 10 → **Part B-TTI 1a**; 1d (10 + surcharge + cess) → **Schedule MATC item 1** (rule 771, 774).
- Part B-TTI 3 = higher of 1d (MAT) or 2f (normal) (rule 768).

---

## 13 · What this means for the build

1. **Build every one of the 55 visible rows** — the three opening flags, item 4,
   the thirteen 5-additions + total, the eleven 6-deductions + total, item 7,
   the Ind-AS flag and the 8A/8B blocks + totals, item 9 with its 9a/9b split,
   and item 10. No rows are hidden or excluded.
2. **The three regime/company gates.** Compute the whole schedule to zero when
   Part A-General says 115BAA/115BAB; only show/file MAT for a **domestic
   company** on the normal regime; the tax line is nil when book profit ≤ 0.
3. **Engine, from this sheet's cells:** 5n = Σ5a–5m; 6l = Σ6a–6k; 7 = 4 + 5n − 6l;
   8Ae = max(0, Σ8Aa–8Ad); 8Bj = max(0, Σ8f–8i) **(sum 8i, not 8h twice — the
   utility's H49 is wrong)**; 9 = 7 + 8e − 8j; 9b = 9 − 9a; 10 = 9%·9a + 15%·9b.
4. **Rate:** 15% general, 9% on the IFSC slice (9a).
5. **Feeds:** pull item 4 from P&L 56 and cap 5a at P&L 54+55; push item 9 to
   Part B-TI and item 10 to Part B-TTI 1a; the 1d total (with surcharge and cess)
   is what MATC item 1 reads back.
6. **Export** `ScheduleMAT` whenever MAT is computed (domestic company, normal
   regime, positive book profit).
