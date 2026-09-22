# The book of Schedule SI — ITR-7, A.Y. 2026-27

Read row by row from the utility's **Schedule SI** sheet, with the hidden-row
flags, the helper columns (M "Section Code", N "Section Code" live twin, Q "col
2 calc", R "Order", S "Max Value of Exemption", T "Part B TI(25-22)", U
"Exemption Value", V "Setoff"/"Col 2 Calc", W "First 4 row sum") and the per-cell
formulas, and confirmed against schema block `ScheduleSI` and the section map
(`Schedule SI` → section **si** → block `ScheduleSI`).

Section on screen: **si**. On ITR-7 this section carries three sheets —
`Schedule SI`, `Schedule 115TD` and `Schedule 115BBI`; this book covers
Schedule SI, which backs the block **ScheduleSI**.

> The sheet's `rows` count in `sheet_map.json` is a spurious Excel max-row
> (~1,048,566). The live content is the special-rate table (rows 2–94) plus the
> override switch (row 96). Only the live rows the dump emits are booked here.

---

## 1 · Purpose and shape

*"Schedule SI — Income chargeable to tax at special rates."* (Row 3: *"Income
chargeable to tax at special rates (Schedule SI to be enabled mandatorily and
need to flow"*.) One row per special-rate head that carries income, showing the
head's section code, its statutory rate (%), the income (fed from OS / CG / BP),
the taxable income after the minimum-chargeable-to-tax adjustment, and the tax
thereon. Nothing on this sheet is typed by the filer — every income figure is
fed from another schedule; the only input is the override switch at the foot
(row 96).

The table columns (row 5 header):

| Col | Header | Kind | Schema |
|---|---|---|---|
| C | SPECIAL RATE (band label, row 4) | fixed | — |
| D | **Sl. No.** (`Serial no's auto filled`) | auto | — |
| E | **Section** (description of the head) | fixed label | *(→ `SecCode`)* |
| F | **Special rate (%)** | fixed per head | `SplRatePercent` |
| G | **Income (i)** | computed, fed | `SplRateInc` |
| H | **Taxable Income after adjusting for Min Chargeable to Tax** | computed | *(not filed — see §5)* |
| I | **Tax thereon (ii)** | computed | `SplRateIncTax` |
| L | Section Code (helper) | code | *(→ `SecCode`)* |
| M | Section Code — `_BE` twin (helper) | code | — |
| N | Section Code — live twin (helper) | code | — |

**Note (row 2):** *"(Note: If no entry is made in first row then other rows will
not be considered)"*.

**Helper columns (off-screen, right of the table):** Q4 **"col 2 calc"**, S4
**"Max Value of Exemption"**, T4 **"Part B TI(25-22)"**, U4 **"Exemption
Value"**, V4 **"Setoff"**; R5 **"Order"**, V5 **"Col 2 Calc"**, W5 **"First 4
row sum of col 1"**, W6 **"First 4 row sum of col 2"** — the ordered
basic-exemption-shortfall walk (§5). Q3 label **"Individual & HUF"** flags that
the machinery is inherited from the individual/HUF utility. Read the helper
columns — they are the rule.

Total row (**r94**): `G94 = Σ SplRateInc` → **`TotSplRateInc`**; `I94 = Σ
SplRateIncTax` → **`TotSplRateIncTax`**.

Override switch (**r96**): **"Do you want to edit the details auto-populated in
table above ?"** → `EditAutopoulatedDetail`, a Yes/No dropdown (cell I96 default
**No**).

---

## 2 · The rows — code, feed, hidden

Every live row's code (column N / M helper, and the `SecCode` enum §3) names a
special-rate head. `_BE` rows are the **pre-23-July-2024 rate twins** ("before
event", helper column M) and are all **hidden**; other hidden rows are
older/superseded slots. "H" = hidden.

| r | Sl | Code (N / M) | Hidden | Label / section (column E) |
|---|---|---|---|---|
| 6 | 1a | `1A_BE` | **H** | 111A - STCG on shares units on which STT paid where transfer was before 23rd July 2024 |
| 7 | — | `1A` | | 111A - STCG on shares units on which STT paid |
| 8 | 2a | `5AD1biiP_BE` | **H** | 115AD(1)(b)(ii) Proviso - STCG referred to in 111A rws 115AD by FII [before 23 Jul 2024] |
| 9 | — | `5AD1biiP` | | 115AD(1)(b)(ii) Proviso - STCG referred to in section 111A rws 115AD by FII |
| 10 | — | `5ADii` | | 115AD(1)(ii) - STCG (other than on equity share/equity oriented mutual fund) |
| 11 | 4a | `22_BE` | **H** | Proviso to 112(1) LTCG on listed securities/units with indexation [before 23 Jul 2024] |
| 12 | — | `22` | | 112(1) (LTCG on listed securities/ units) |
| 13 | 5a | `21ciii_BE` | **H** | 112(1)(c)(iii) LTCG for non-resident on unlisted securities [before 23 Jul 2024] |
| 14 | — | `21ciii` | | 112(1)(c)(iii) - LTCG on transfer of unlisted securities, non-resident |
| 15 | 6a | `5AC1c_BE` | **H** | 115AC(1)(c) - LTCG for non-resident on bonds/GDR [before 23 Jul 2024] |
| 16 | — | `5AC1c` | | 115AC(1)(c) - LTCG for non-resident on bonds/GDR |
| 17 | 7a | `21_BE` | **H** | 112 - LTCG on Others [before 23 Jul 2024] |
| 18 | — | `21` | | 112 - LTCG on Others |
| 19 | 8a | `2A_BE` | **H** | 112A - LTCG on shares/units of equity oriented fund/business trust on which STT paid [before 23 Jul 2024] |
| 20 | — | `5B` | **H** | 115B (Profits and gains of life insurance business) |
| 21 | — | `2A` | | 112A - LTCG on shares/units of equity oriented fund/business trust on which STT paid |
| 22 | — | `5ADiii` | | 115AD(1)(b)(iii) - LTCG (other than on equity share/equity oriented mutual fund) |
| 23 | 10a | `5AB1b_BE` | **H** | 115AB(1)(b) - LTCG for non-resident on units referred in 115AB [before 23 Jul 2024] |
| 24 | — | `5AB1b` | | 115AB(1)(b) - LTCG for non-resident on units referred in section 115AB |
| 25 | 11a | `5ADiiiP_BE` | **H** | 115AD(1)(b)(iii) Proviso - NON-RESIDENTS, sale of equity/units [before 23 Jul 2024] |
| 26 | — | `5ADiiiP` | | 115AD(1)(b)(iii) Proviso - For NON-RESIDENTS from sale of equity share/unit of equity oriented fund |
| 27 | — | `DTAASTCG` | | STCG chargeable at special rates in India as per DTAA |
| 28 | — | `DTAALTCG` | | LTCG Chargeable at special rates in India as per DTAA |
| 29 | — | `5AC1ab`* | | 115AC (interest received by non-resident from bonds/GDR purchased in foreign currency) |
| 30 | — | `5AC1abD`* | | 115AC (Dividend received by non-resident from bonds/GDR purchased in foreign currency) |
| 31 | — | `5BB` | | 115BB - Winnings from lotteries, puzzles, races, games etc u/s 115BB |
| 32 | — | `5BBDA` | **H** | 115BBDA (Dividend Income from domestic company that exceeds Rs.10 Lakh) |
| 33 | — | `5BBJ` | | 115BBJ - Winnings from online games |
| 34 | — | `5BBE` | | 115BBE (Income under section 68, 69, 69A, 69B, 69C or 69D) |
| 35 | — | `DTAAOS` | | Income from other sources chargeable at special rates in India as per DTAA |
| 36 | — | `5A1aiiaa2P` | | 115A(1)(a)(iiaa) proviso - Income received by non-resident, second proviso to 194LC(1) |
| 37 | — | `PTI_STCG15P` | **H** | Pass Through Income - Short Term Capital Gain chargeable @ 15% |
| 38 | — | `PTI_STCG20P` | | Pass Through Income - Short Term Capital Gain chargeable @ 20% |
| 39 | — | `PTI_STCG30P` | | Pass through Income - Short Term Capital Gain chargeable @ 30% |
| 40 | — | `PTI_LTCG10P112A` | **H** | Pass Through Income - Long Term Capital Gain chargeable @ 10% u/s 112A |
| 41 | — | `PTI_LTCG12_5P112A` | | Pass Through Income - Long Term Capital Gain chargeable @ 12.5% u/s 112A |
| 42 | — | `PTI_LTCG20P` | **H** | Pass Through Income - Long Term Capital Gain chargeable @ 20% |
| 43 | — | *(none)* | **H** | Pass Through Income - Short Term Capital Gain chargeable @ 15% - Not required Post consolidation |
| 44 | — | *(111)* | **H** | 111 - Tax on accumulated balance of recognised PF |
| 45 | — | `PTI_LTCG10P` | **H** | Pass through Income - Long Term Capital Gain chargeable @ 10% other than section 112A |
| 46 | — | `PTI_LTCG12_5P` | | Pass Through Income - Long Term Capital Gain chargeable @ 12.5% other than u/s 112A |
| 47 | — | `5A1ai` | | 115A(1)(a)(i) - Dividends received by non-resident (not being company)/foreign company |
| 48 | — | `5A1aii` | | 115A(1)(a)(ii) - Interest received from govt/Indian Concerns received in Foreign Currency |
| 49 | — | `FA` | **H** | Para E II of Part I of 1st Schedule of FA - royalty or technical services - Non Domestic |
| 50 | — | `5A1aiia` | | 115A(1)(a)(iia) - Interest from Infrastructure Debt Fund |
| 51 | — | `5A1aiiaa` | | 115A(1)(a)(iiaa) - Income received by non-resident as referred in section 194LC(1) |
| 52 | — | `5A1aiii` | | 115A(1)(a)(iii) - Income received in respect of units of UTI purchased in foreign currency |
| 53 | — | `5A1bA` | | 115A(1)(b) - Income from royalty or fees for technical services from Government/Indian concern |
| 54 | — | `5AB1a` | **H** | 115AB(1)(a) - Income in respect of units - off-shore fund |
| 55 | — | `5BBA` | | 115BBA - Income received by non-residents sportsmen or sports associations |
| 56 | — | `5BBD` | | 115BBD - Tax on dividend of an Indian company from specified foreign company |
| 57 | — | `5AD1i` | | 115AD(1)(i) - Income (other than dividend) received by an FII in respect of securities |
| 58 | — | `5AD1iP` | | 115AD(1)(i) - Income by way of Interest received by an FII in respect of bonds/government securities |
| 59 | — | `5AC1ab` | | 115AC(1)(a) - Income by way of interest on bonds purchased in foreign currency, non-resident |
| 60 | — | `5A1aiiab` | | 115A(1)(a)(iiab) - Interest as per Sec. 194LD |
| 61 | — | `5A1aiiac` | | 115A(1)(a)(iiac) - Interest as per Sec. 194LBA |
| 62 | — | `PTI_5A1ai` | | PTI-115A(1)(a)(i) - Dividends received by non-resident (not being company)/foreign company |
| 63 | — | `PTI_5A1aii` | | PTI-115A(1)(a)(ii) - Interest received from govt/Indian Concerns received in Foreign Currency |
| 64 | — | `PTI_5A1aiia` | | PTI-115A(1)(a)(iia) - Interest from Infrastructure Debt Fund |
| 65 | — | `PTI_5A1aiiaa` | | PTI-115A(1)(a)(iiaa) - Income received by non-resident as referred in section 194LC(1) |
| 66 | — | `PTI_5A1aiiab` | | PTI-115A(1)(a)(iiab) - Interest as per Sec. 194LD |
| 67 | — | `PTI_5A1aiiac` | | PTI-115A(1)(a)(iiac) - Interest as per Sec. 194LBA |
| 68 | — | `PTI_5A1aiii` | | PTI-115A(1)(a)(iii) - Income received in respect of units of UTI purchased in foreign currency |
| 69 | — | `PTI_FA` | **H** | PTI - Para E II of Part I of 1st Schedule of FA - royalty or technical services - Non Domestic |
| 70 | — | `PTI_5A1bA` | | PTI-115A(1)(b) - Income from royalty or fees for technical services from Government/Indian concern |
| 71 | — | `PTI_5AC1ab` | | PTI-115AC(1)(a) - Income by way of interest from bonds purchased in foreign currency, non-resident |
| 72 | — | `PTI_5AD1i` | | PTI-115AD(1)(i) - Income (other than dividend) received by an FII in respect of securities |
| 73 | — | `PTI_5AD1iP` | | PTI-115AD(1)(i) - Income received by an FII in respect of bonds/government securities (194LD) |
| 74 | — | `PTI_5BBA` | | PTI-115BBA - Income received by non-residents sportsmen or sports associations |
| 75 | — | `PTI_5BBD` | **H** | PTI-115BBD - Tax on dividend of an Indian company from specified foreign company |
| 76 | — | `PTI_5BBDA` | **H** | PTI-115BBDA - Dividend Income from domestic company exceeding 10Lakh |
| 77 | — | `PTI_5AB1a` | **H** | PTI-115AB(1)(a) - Income in respect of units - off-shore fund |
| 78 | — | `5A1aiiaaP` | | 115A(1)(a)(iiaa) proviso - Income received by non-resident, proviso to section 194LC(1) |
| 79 | — | `5A1aiiaci` | **H** | 115A(1)(a)(iiac) - Distributed income being Dividend referred to in section 194LBA |
| 80 | — | `PTI_5A1aiiaaP` | | PTI-115A(1)(a)(iiaa) proviso - Income received by non-resident, proviso to section 194LC(1) |
| 81 | — | `PTI_5A1aiiaci` | **H** | PTI_115A(1)(a)(iiac) - Distributed income being Dividend referred to in section 194LBA |
| 82 | — | `5AD1iDiv` | | 115AD(1)(i) - Income (being dividend) received by an FII in respect of securities |
| 83 | — | `PTI_5AD1iDiv` | | PTI-115AD(1)(i) - Income (being dividend) received by an FII in respect of securities |
| 84 | — | `5AC1abD` | | 115AC(1)(b) - Income by way of dividend on GDR purchased in foreign currency, non-residents |
| 85 | — | `5A1aA` | | 115A(1)(a)(A) - Dividend received by non-resident/foreign company from a unit in an IFSC |
| 86 | — | `PTI_5AC1abD` | | PTI-115AC(1)(b) - Income by way of dividend on GDRs purchased in foreign currency, non-residents |
| 87 | — | `5BBC` | | 115BBC - Anonymous Donations in certain cases |
| 88 | — | `PTI_5BBC` | | PTI-115BBC - Anonymous Donations in certain cases |
| 89 | — | `PTI_5A1aA` | | PTI-115A(1)(a)(A) proviso - Dividend received by non-resident/foreign company from a unit in an IFSC |
| 90 | — | *(group header)* | | 115BBH (Tax on Income from Virtual Digital asset) |
| 91 | — | `5BBHi` | | (A) Income under head business or profession |
| 92 | — | `5BBHii` | | (B) Income under head Capital Gain |
| 93 | — | `PTI_5A1aiiaa2P` | | PTI-115A(1)(a)(iiaa) proviso - Income received by non-resident, second proviso to 194LC(1) |
| 94 | — | Total | | **Total** — `TotSplRateInc` / `TotSplRateIncTax` |

\* Rows 29 and 30 carry helper code `NA` on the sheet (column N reads `NA`);
they are the 115AC interest / 115AC-GDR-dividend heads and export as the enum
codes `5AC1ab` / `5AC1abD` respectively (§8, mismatch note).

**Feed summary:** as on ITR-6, every income figure (column G) is drawn from
another schedule — the capital-gain heads (111A, 112, 112(1), 112(1)(c)(iii),
112A, 115AB(1)(b), 115AC(1)(c), 115AD STCG/LTCG & proviso, STCG/LTCG-DTAA and
the pass-through CG rows) from **Schedule CG**; the 115A / 115AC-dividend /
115AD-dividend family, 115BB, 115BBJ, 115BBA, 115BBC, 115BBE, 115BBD, 115BBDA,
OS-DTAA and every `PTI_*` other-sources twin from **Schedule OS**; the life
insurance (115B), patent/carbon/VDA business parts from **Schedule BP**. On
ITR-7 the anonymous-donation head **115BBC** (rows 87/88) is the characteristic
one — a trust's anonymous donations taxed at 30%.

---

## 3 · The section-code enum — `ScheduleSI.SplCodeRateTax[].SecCode` (60 codes)

Every filed row's `SecCode` is a member of this enum. Reproduced verbatim in
**Appendix C**. The codes, in enum order: `1A`, `5ADii`, `22`, `21ciii`,
`5AB1b`, `5AC1c`, `5ADiii`, `21`, `2A`, `5ADiiiP`, `5AC1ab`, `5AC1abD`, `5A1aA`,
`5BB`, `5BBE`, `DTAASTCG`, `DTAALTCG`, `DTAAOS`, `PTI_STCG20P`, `PTI_STCG30P`,
`PTI_LTCG12_5P112A`, `PTI_LTCG12_5P`, `5A1ai`, `5A1aii`, `5A1aiia`, `5A1aiiaa`,
`5A1aiii`, `5A1bA`, `5B`, `5BBA`, `5BBC`, `5BBJ`, `5AD1i`, `5BBHi`, `5BBHii`,
`5AD1iP`, `5A1aiiab`, `5A1aiiac`, `5AD1biiP`, `PTI_5A1ai`, `PTI_5A1aA`,
`PTI_5A1aii`, `PTI_5A1aiia`, `PTI_5A1aiiaa`, `PTI_5A1aiiab`, `PTI_5A1aiiac`,
`PTI_5A1aiii`, `PTI_5A1bA`, `PTI_5AC1ab`, `PTI_5AC1abD`, `PTI_5AD1i`,
`PTI_5AD1iP`, `PTI_5BBA`, `PTI_5BBC`, `5AD1iDiv`, `5A1aiiaaP`, `5A1aiiaa2P`,
`PTI_5AD1iDiv`, `PTI_5A1aiiaaP`, `PTI_5A1aiiaa2P`.

### Rate enum — `ScheduleSI.SplCodeRateTax[].SplRatePercent` (11 values)

`1`, `4`, `5`, `9`, `10`, `12.5`, `15`, `20`, `25`, `30`, `60`.

(Each live row's rate is fixed per head in column F. The rate is filed as
`SplRatePercent`.)

### Override switch — `ScheduleSI.EditAutopoulatedDetail`

Row 96 dropdown (cell I96), values **Yes / No**; default **No**. When set to
**Yes** it unlocks the auto-populated table for manual edit.

---

## 4 · The tax column (I) — how tax thereon is computed

The base rule: `I = ROUND(G × F/100, 0)` — taxable income (after the min-charge
adjustment) times the special rate (column F) — for every head **except**:

- **OS-DTAA / STCG-DTAA / LTCG-DTAA** (rows 27, 28, 35): tax at the treaty rate,
  not income × the displayed rate; column I carries the treaty-computed tax and
  the tax cannot be null when the income is > 0.
- **112A @ 12.5%** (row 21), **PTI-112A @ 12.5%** (row 41) and
  **115AD(1)(b)(iii) proviso @ 12.5%** (row 26): the first ₹1,25,000 is exempt
  (§5), so `I = ROUND(IF(G > exempt, (G − exempt) × rate/100, 0), 0)`.

---

## 5 · The "minimum chargeable to tax" adjustment (column H) and the ₹1,25,000

Column **H** ("Taxable Income after adjusting for Min Chargeable to Tax") is the
income after the basic-exemption-shortfall walk carried in helper columns S
("Max Value of Exemption"), T ("Part B TI(25-22)"), U ("Exemption Value"), V
("Setoff"/"Col 2 Calc"), R ("Order") and W ("First 4 row sum"). On an ITR-7
filer (a trust/institution, not an individual claiming basic exemption) the
threshold used by this walk yields no reduction, so **column H equals column G
for every row**; the machinery is inherited from the individual/HUF utility
(the Q3 label reads *"Individual & HUF"*) and is inert here. Column H
(`taxable income after adjusting for min chargeable to tax`) has **no schema
key** and is not filed — only G (`SplRateInc`) and I (`SplRateIncTax`) are.

**The ₹1,25,000 exemption under 112A does apply** (a per-provision exemption,
not the basic exemption). It is applied in the tax column: one ₹1,25,000 is
applied first to the assessee's own 112A gain (row 21) then to the pass-through
112A gain (row 41), and the 115AD(1)(b)(iii)-proviso gain (row 26) gets its own
separate ₹1,25,000. It reduces the tax base in column I, not the income in
column G.

---

## 6 · Cross-sheet feeds

### In (income into column G)
Each head's income is fed from its own schedule — **CG** for the capital-gain
and pass-through-CG heads, **OS** for the 115A/115AC/115AD-dividend/115BB/
115BBJ/115BBA/**115BBC**/115BBE/115BBD/115BBDA family and every `PTI_*`-OS
twin, **BP** for 115B and the VDA/patent/carbon business parts; the DTAA rows
(27, 28, 35) net treaty income from CG A9 / CG B11 / OS.

### Out
| To | What |
|---|---|
| **Schedule BFLA** | Σ Income (i) of SI reconciles to the BFLA line items |
| **Part B-TI** | total special income = total of SI Col. (i), `TotSplRateInc` (G94) |
| **Part B-TTI** | special-rate tax = total of SI Col. (ii), `TotSplRateIncTax` (I94) |

---

## 7 · What the schema marks and mandatory

Block `ScheduleSI` (present only when special income exists):

```
ScheduleSI
  SplCodeRateTax[]                 array (one entry per head carrying income)
    * SecCode          string   (enum §3)
    * SplRatePercent   number   (enum §3; = column F)
    * SplRateInc       integer  (= column G income)
    * SplRateIncTax    integer  (= column I tax)
  * TotSplRateInc      integer   (= G94)
  * TotSplRateIncTax   integer   (= I94)
  EditAutopoulatedDetail string  (Yes/No; override switch, not required)
```

`*` = required. On every array entry: `SecCode`, `SplRatePercent`,
`SplRateInc`, `SplRateIncTax`. `TotSplRateInc` and `TotSplRateIncTax` are
required at block level. Column H (taxable income after adjusting for min
chargeable to tax) has no schema key. Full leaf list in **Appendix B**.

---

## 8 · Inconsistencies noted (sheet code vs schema enum)

1. **Rows 29 / 30** carry helper code `NA` on the sheet; they are the 115AC
   interest and 115AC-GDR-dividend heads and file the enum codes `5AC1ab` /
   `5AC1abD`. Rows 43, 44, 49 (hidden), 79/81 (hidden) also carry `NA` in the
   helper column.
2. **115BBH sub-rows (91/92)** are `5BBHi` (business/profession) and `5BBHii`
   (capital gain) — the two VDA codes in the enum.
3. **DTAA rows (27/28/35)** file the enum codes `DTAASTCG` / `DTAALTCG` /
   `DTAAOS`.
4. Enum, not the display label, is authoritative for the filed `SecCode`.

---

## 9 · Hidden rows (not built)

`_BE` pre-23-July-2024 rate twins: r6 (`1A_BE`), r8 (`5AD1biiP_BE`), r11
(`22_BE`), r13 (`21ciii_BE`), r15 (`5AC1c_BE`), r17 (`21_BE`), r19 (`2A_BE`),
r23 (`5AB1b_BE`), r25 (`5ADiiiP_BE`). Also r20 (`5B`), r32 (`5BBDA`), r37
(`PTI_STCG15P`), r40 (`PTI_LTCG10P112A`), r42 (`PTI_LTCG20P`), r43 (PTI STCG 15%
"Not required Post consolidation"), r44 (111 accumulated PF), r45
(`PTI_LTCG10P`), r49 (`FA`), r54 (`5AB1a`), r69 (`PTI_FA`), r75 (`PTI_5BBD`),
r76 (`PTI_5BBDA`), r77 (`PTI_5AB1a`), r79 (`5A1aiiaci`), r81 (`PTI_5A1aiiaci`).
Superseded/inactive slots; not built.

---

## 10 · What this means for the build

1. **SI is a fully computed table** — one row per live head that carries income;
   each row = code (from the enum §3), rate (column F), income (fed from
   OS/CG/BP), tax (`income × rate`, with the DTAA and 112A ₹1,25,000
   exceptions). No manual entry except the override switch.
2. **Column H = column G on ITR-7** — the min-charge machinery is inert; export
   only leaves G (`SplRateInc`) and I (`SplRateIncTax`).
3. **The ₹1,25,000 under 112A** applies in the tax column (§5).
4. **Map helper/display codes to enum codes on export** (§8).
5. **The tax engine reads SI** — `TotSplRateIncTax` (I94) is the special-rate
   tax added at Part B-TTI; `TotSplRateInc` (G94) feeds Part B-TI. Export
   `ScheduleSI.SplCodeRateTax[]` (SecCode, SplRatePercent, SplRateInc,
   SplRateIncTax) with `TotSplRateInc`, `TotSplRateIncTax` and
   `EditAutopoulatedDetail`, writing the block only when a head carries income.

---

## Appendix A · Every live row, verbatim (dump)

```
r   2 : [C2] (Note: If no entry is made in first row then other rows will not be considered)
r   3 : [C3] Schedule SI  |  [E3] Income chargeable to tax at special rates (Schedule SI to be enabled mandatorily and need to flow Js  |  [Q3] Individual & HUF
r   4 : [C4] SPECIAL RATE  |  [Q4] col 2 calc  |  [S4] Max Value of Exemption  |  [T4] Part B TI(25-22)  |  [U4] Exemption Value  |  [V4] Setoff
r   5 : [D5] Sl. No.  |  [E5] Section  |  [F5] Special rate (%)  |  [G5] Income (i)  |  [H5] Taxable Income after adjusting for Min Chargeable to Tax  |  [I5] Tax thereon (ii)  |  [L5] Section Code  |  [R5] Order  |  [V5] Col 2 Calc  |  [W5] First 4 row sum of col 1
r   6H: [D6] 1a  |  [E6] 111A - STCG on shares units on which STT paid where transfer was before 23rd July 2024 as applicable  |  [M6] 1A_BE  |  [N6] NA  |  [W6] First 4 row sum of col 2
r   7 : [E7] 111A - STCG on shares units on which STT paid.  |  [N7] 1A
r   8H: [D8] 2a  |  [E8] 115AD(1)(b)(ii) - Proviso - Short term capital gains referred to in section 111A rws. 115AD by FII,   |  [M8] 5AD1biiP_BE  |  [N8] NA
r   9 : [E9] 115AD(1)(b)(ii) - Proviso - Short term capital gains referred to in section 111A rws. 115AD by FII.  |  [N9] 5AD1biiP
r  10 : [E10] 115AD(1)(ii) - Short term capital gains (other than on equity share or equity oriented mutual fund r  |  [N10] 5ADii
r  11H: [D11] 4a  |  [E11] Proviso to 112(1) LTCG on listed securities/ units with indexation [where transfer was before 23rd J  |  [M11] 22_BE  |  [N11] NA
r  12 : [E12] 112(1) (LTCG on listed securities/ units)
r  13H: [D13] 5a  |  [E13] 112(1)(c)(iii) (LTCG for non-resident on unlisted securities or other than Listed debentures) [where  |  [M13] 21ciii_BE  |  [N13] NA
r  14 : [E14] 112(1)(c)(iii)- Long term capital gains on transfer of unlisted securities in the case of non-reside  |  [N14] 21ciii
r  15H: [D15] 6a  |  [E15] 115AC(1)(c)-(LTCG for non-resident on bonds/GDR) ) [where transfer was before 23rd July 2024 as appl  |  [M15] 5AC1c_BE  |  [N15] NA
r  16 : [E16] 115AC(1)(c)-(LTCG for non-resident on bonds/GDR)  |  [N16] 5AC1c
r  17H: [D17] 7a  |  [E17] 112 - LTCG on Others [where transfer / event was before 23rd July 2024 as applicable]  |  [M17] 21_BE  |  [N17] NA
r  18 : [E18] 112 - LTCG on Others
r  19H: [D19] 8a  |  [E19] 112A - LTCG on sale of shares /units of equity oriented fund/units of business trust on which STT is  |  [M19] 2A_BE  |  [N19] NA
r  20H: [E20] 115B (Profits and gains of life insurance business)  |  [N20] 5B
r  21 : [E21] 112A - LTCG on sale of shares /units of equity oriented fund/units of business trust on which STT is  |  [N21] 2A
r  22 : [E22] 115AD(1)(b)(iii) - Long term capital gains (other than on equity share or equity oriented mutual fun  |  [N22] 5ADiii
r  23H: [D23] 10a  |  [E23] 115AB(1)(b)-(LTCG for non-resident on units referred in section115AB) where transfer was before 23rd  |  [M23] 5AB1b_BE  |  [N23] NA
r  24 : [E24] 115AB(1)(b)- (LTCG for non-resident on units referred in section115AB)  |  [N24] 5AB1b
r  25H: [D25] 11a  |  [E25] 115AD(1)(b)(iii) Proviso- For NON-RESIDENTS from sale of equity share in a company or unit of equity  |  [M25] 5ADiiiP_BE  |  [N25] NA
r  26 : [E26] 115AD(1)(b)(iii) Proviso- For NON-RESIDENTS from sale of equity share in a company or unit of equity  |  [N26] 5ADiiiP
r  27 : [E27] STCG chargeable at special rates in India as per DTAA  |  [N27] DTAASTCG
r  28 : [E28] LTCG Chargeable at special rates in India as per DTAA  |  [N28] DTAALTCG
r  29 : [E29] 115AC (Income by way interest received by non-resident from bonds or GDR purchased in foreign curren  |  [N29] NA
r  30 : [E30] 115AC (Income by way of Dividend received by non-resident from bonds or GDR purchased in foreign cur  |  [N30] NA
r  31 : [E31] 115BB-Winnings from lotteries, puzzles, races, games etc u/s 115BB  |  [N31] 5BB
r  32H: [E32] 115BBDA (Dividend Income from domestic company that exceeds Rs.10 Lakh)  |  [N32] 5BBDA
r  33 : [E33] 115BBJ - Winnings from online games  |  [N33] 5BBJ
r  34 : [E34] 115BBE (Income under section 68, 69, 69A, 69B, 69C or 69D)  |  [N34] 5BBE
r  35 : [E35] Income from other sources chargeable at special rates in India as per DTAA  |  [N35] DTAAOS
r  36 : [E36] 115A(1) (a)(iiaa) proviso - Income received by non-resident as referred in second proviso to section  |  [N36] 5A1aiiaa2P
r  37H: [E37] Pass Through Income in the nature of Short Term Capital Gain chargeable @ 15%  |  [M37] PTI_STCG15P  |  [N37] NA
r  38 : [E38] Pass Through Income in the nature of Short Term Capital Gain chargeable @ 20%  |  [N38] PTI_STCG20P
r  39 : [E39] Pass through Income in the nature of Short Term Capital Gain chargeable @ 30%  |  [N39] PTI_STCG30P
r  40H: [E40] Pass Through Income in the nature of Long Term Capital Gain chargeable @ 10% us 112A  |  [M40] PTI_LTCG10P112A  |  [N40] NA
r  41 : [E41] Pass Through Income in the nature of Long Term Capital Gain chargeable @ 12.5% u/s 112A  |  [N41] PTI_LTCG12_5P112A
r  42H: [E42] Pass Through Income in the nature of Long Term Capital Gain chargeable @ 20%  |  [M42] PTI_LTCG20P  |  [N42] NA
r  43H: [E43] Pass Through Income in the nature of Short Term Capital Gain chargeable @ 15% - Not required Post co
r  44H: [E44] 111-Tax on accumulated balance of recognised PF
r  45H: [E45] Pass through Income in the nature of Long Term Capital Gain chargeable @ 10% other than section 112A  |  [M45] PTI_LTCG10P  |  [N45] NA
r  46 : [E46] Pass Through Income in the nature of Long Term Capital Gain chargeable @ 12.5% other than u/s 112A  |  [N46] PTI_LTCG12_5P
r  47 : [E47] 115A(1)(a)(i)- Dividends received by non-resident (not being company) or foreign company chargeable   |  [N47] 5A1ai
r  48 : [E48] 115A(1)(a)(ii)- Interest received from govt/Indian Concerns received in Foreign Currency  |  [N48] 5A1aii
r  49H: [E49] Para E II of Part I of 1st Schedule of FA - Income from royalty or technical services - Non Domestic  |  [N49] FA
r  50 : [E50] 115A(1) (a)(iia) -Interest from Infrastructure Debt Fund  |  [N50] 5A1aiia
r  51 : [E51] 115A(1) (a)(iiaa) - Income received by non-resident as referred in section 194LC(1)  |  [N51] 5A1aiiaa
r  52 : [E52] 115A(1) (a)(iii) -Income received in respect of units of UTI purchased in foreign currency  |  [N52] 5A1aiii
r  53 : [E53] 115A(1)(b)- Income from royalty or fees for technical services received from Government or Indian co  |  [N53] 5A1bA
r  54H: [E54] 115AB(1)(a)- Income in respect of units - off - shore fund  |  [N54] 5AB1a
r  55 : [E55] 115BBA -Income received by non-residents sportsmen or sports associations  |  [N55] 5BBA
r  56 : [E56] 115BBD- Tax on dividend of an Indian company from specified foreign company  |  [N56] 5BBD
r  57 : [E57] 115AD(1)(i) -Income (other than dividend) received by an FII in respect of securities (other than un  |  [N57] 5AD1i
r  58 : [E58] 115AD(1)(i) -Income by way of Interest received by an FII in respect of bonds or government securiti  |  [N58] 5AD1iP
r  59 : [E59] 115AC(1)(a) - Income by way of interest on bonds purchased in foreign currency -non-resident  |  [N59] 5AC1ab
r  60 : [E60] 115A(1) (a)(iiab) -Interest as per Sec. 194LD  |  [N60] 5A1aiiab
r  61 : [E61] 115A(1) (a)(iiac) -Interest as per Sec. 194LBA  |  [N61] 5A1aiiac
r  62 : [E62] PTI-115A(1)(a)(i)-Dividends received by non-resident (not being a company) or a foreign company char  |  [N62] PTI_5A1ai
r  63 : [E63] PTI-115A(1)(a)(ii)- Interest received from govt/Indian Concerns received in Foreign Currency  |  [N63] PTI_5A1aii
r  64 : [E64] PTI-115A(1) (a)(iia) -Interest from Infrastructure Debt Fund  |  [N64] PTI_5A1aiia
r  65 : [E65] PTI-115A(1) (a)(iiaa) -Income received by non-resident as referred in section 194LC (1)  |  [N65] PTI_5A1aiiaa
r  66 : [E66] PTI-115A(1) (a)(iiab) -Interest as per Sec. 194LD  |  [N66] PTI_5A1aiiab
r  67 : [E67] PTI-115A(1) (a)(iiac) -Interest as per Sec. 194LBA  |  [N67] PTI_5A1aiiac
r  68 : [E68] PTI-115A(1) (a)(iii) -Income received in respect of units of UTI purchased in foreign currency  |  [N68] PTI_5A1aiii
r  69H: [E69] PTI -Para E II of Part I of 1st Schedule of FA - Income from royalty or technical services - Non Dom  |  [N69] PTI_FA
r  70 : [E70] PTI-115A(1)(b)- Income from royalty or fees for technical services received from Government or India  |  [N70] PTI_5A1bA
r  71 : [E71] PTI-115AC(1)(a) - Income by way of interest from bonds purchased in foreign currency - non-resident  |  [N71] PTI_5AC1ab
r  72 : [E72] PTI-115AD(1)(i) -Income (other than dividend) received by an FII in respect of securities (other tha  |  [N72] PTI_5AD1i
r  73 : [E73] PTI-115AD(1)(i) - Income received by an FII in respect of bonds or government securities referred to  |  [N73] PTI_5AD1iP
r  74 : [E74] PTI-115BBA - Income received by non-residents sportsmen or sports associations  |  [N74] PTI_5BBA
r  75H: [E75] PTI -115BBD- Tax on dividend of an Indian company from specified foreign company  |  [N75] PTI_5BBD
r  76H: [E76] PTI-115BBDA - Dividend Income from domestic company exceeding 10Lakh  |  [N76] PTI_5BBDA
r  77H: [E77] PTI -115AB(1)(a)- Income in respect of units - off - shore fund  |  [N77] PTI_5AB1a
r  78 : [E78] 115A(1) (a)(iiaa) proviso - Income received by non-resident as referred in proviso to section 194LC(  |  [N78] 5A1aiiaaP
r  79H: [E79] 115A(1)(a)(iiac)- Distributed income being Dividend referred to in section 194LBA  |  [N79] NA
r  80 : [E80] PTI-115A(1) (a)(iiaa) proviso - Income received by non-resident as referred in proviso to section 19  |  [N80] PTI_5A1aiiaaP
r  81H: [E81] PTI_115A(1)(a)(iiac)- PTI - Distributed income being Dividend referred to in section 194LBA  |  [N81] NA
r  82 : [E82] 115AD(1)(i)- Income (being dividend) received by an FII in respect of securities (other than units r  |  [N82] 5AD1iDiv
r  83 : [E83] PTI-115AD(1)(i)- PTI-Income (being dividend) received by an FII in respect of securities (other than  |  [N83] PTI_5AD1iDiv
r  84 : [E84] 115AC(1)(b) - Income by way of dividend on GDR purchased in foreign currency - Non-residents  |  [N84] 5AC1abD
r  85 : [E85] 115A(1)(a)(A)-Dividend received by non-resident (not being a company) or a foreign company, from a u  |  [N85] 5A1aA
r  86 : [E86] PTI_115AC(1)(b)-Income by way of dividend GDRs purchased in foreign currency by non-residents  |  [N86] PTI_5AC1abD
r  87 : [E87] 115BBC-Anonymous Donations in certain cases  |  [N87] 5BBC
r  88 : [E88] PTI-115BBC-Anonymous Donations in certain cases  |  [N88] PTI_5BBC
r  89 : [E89] PTI- 115A(1)(a)(A)-proviso - Dividend received by non-resident (not being company) or foreign compan  |  [N89] PTI_5A1aA
r  90 : [E90] 115BBH (Tax on Income from Virtual Digital asset)
r  91 : [E91] (A) Income under head business or profession  |  [N91] 5BBHi
r  92 : [E92] (B) Income under head Capital Gain  |  [N92] 5BBHii
r  93 : [E93] PTI-115A(1) (a)(iiaa) proviso - Income received by non-resident as referred in second proviso to sec  |  [N93] PTI_5A1aiiaa2P
r  94 : [E94] Total
r  96 : [C96] Do you want to edit the details auto-populated in table above ?  |  [I96] No
```

## Appendix B · Schema leaves — block `ScheduleSI` (`*` = required)

```
  SplCodeRateTax[] array
* SplCodeRateTax[].SecCode string
* SplCodeRateTax[].SplRatePercent number
* SplCodeRateTax[].SplRateInc integer
* SplCodeRateTax[].SplRateIncTax integer
* TotSplRateInc integer
* TotSplRateIncTax integer
  EditAutopoulatedDetail string
```

## Appendix C · The `SecCode` enum, verbatim (60 members)

```
1A          111A - STCG on shares units on which STT paid
5ADii       115AD(1)(ii) - Short term capital gains (other than on equity share or equity oriented mutual fund)
22          112(1) (LTCG on listed securities/ units)
21ciii      112(1)(c)(iii)- Long term capital gains on transfer of unlisted securities in the case of non-residents
5AB1b       115AB(1)(b) -(LTCG for non-resident on units referred in section115AB)
5AC1c       115AC (LTCG for non-resident on bonds/GDR)
5ADiii      115AD(i)(iii)- Long term capital gains (other than on equity share or equity oriented mutual fund)
21          112 - LTCG on Others
2A          112A - LTCG on sale of shares /units of equity oriented fund/units of business trust on which STT is paid
5ADiiiP     115AD(1)(b)(iii) Proviso- For NON-RESIDENTS from sale of equity share in a company or unit of equity oriented fund
5AC1ab      115AC(1)(a) - Income by way of interest on bonds purchased in foreign currency - non-resident
5AC1abD     115AC(1)(b) - Income by way of Dividend on GDRs purchased in foreign currency - non-resident
5A1aA       115A(1)(a)(A)- Dividend received by non resident (Not being company) or foreign company from a unit in an International Financial Services Centre
5BB         5BB
5BBE        115BBE - Tax on income referred to in sections 68 or 69 or 69A or 69B or 69C or 69D
DTAASTCG    STCGDTAARate - STCG Chargeable at special rates in India as per DTAA
DTAALTCG    LTCGDTAARate - LTCG Chargeable at special rates in India as per DTAA
DTAAOS      OSDTAARate - Other source income chargeable under DTAA rates
PTI_STCG20P Pass Through Income in the nature of Short Term Capital Gain chargeable @ 20%
PTI_STCG30P Pass Through Income in the nature of Short Term Capital Gain chargeable @ 30%
PTI_LTCG12_5P112A Pass Through Income in the nature of Long Term Capital Gain chargeable @ 12.5% u/s 112A
PTI_LTCG12_5P Pass Through Income in the nature of Long Term Capital Gain chargeable @ 12.5% other than u/s 112A
5A1ai       115A(1)(a)(i)- Dividends received by non-resident (not being company) or foreign company
5A1aii      115A(1)(a)(ii)- Interest received from govt/Indian Concerns recived in Foreign Currency
5A1aiia     115A(1) (a)(iia) -Interest from Infrastructure Debt Fund
5A1aiiaa    115A(1) (a)(iiaa) -Interest as per Sec. 194LC
5A1aiii     115A(1) (a)(iii) - Income received in respect of units of UTI purchased in Foreign Currency
5A1bA       115A(1)(b)- Income from royalty or fees for technical services received from Government or Indian concern
5B          115B (Profits and gains of life insurance business)
5BBA        115BBA - Income received by non-residents sportsmen or sports associations
5BBC        115BBC - Anonymous donations
5BBJ        115BBJ - Income by way of winnings from Online games chargeable
5AD1i       115AD(1)(i) -Income received by an FII in respect of securities (other than units as per Sec 115AB)
5BBHi       115BBH(i) - Tax on Income from Virtual Digital Asset (Income under head business or profession)
5BBHii      115BBH(ii) - Tax on Income from Virtual Digital Asset (Income under head Capital Gain)
5AD1iP      115AD(1)(i) -Income received by an FII in respect of bonds or government securities as per Sec 194LD
5A1aiiab    115A(1) (a)(iiab) -Interest as per Sec. 194LD
5A1aiiac    115A(1)(a)(iiac)-Interest as per Sec. 194LBA
5AD1biiP    115AD(1)(b)(ii) - Proviso - Short term capital gains referred to in section 111A rws. 115AD by FII
PTI_5A1ai   PTI-115A(1)(a)(i)- Dividends received by non-resident (not being company) or foreign company
PTI_5A1aA   PTI-115A(1)(a)(A) Dividend received by non resident from a unit in an International Financial Services Centre
PTI_5A1aii  PTI - Interest received in the case of non-residents
PTI_5A1aiia PTI - Interest received by non-resident from infrastructure debt fund
PTI_5A1aiiaa PTI - Income received by non-resident as referred in section 194LC
PTI_5A1aiiab PTI - Income received by non-resident as referred in section 194LD
PTI_5A1aiiac PTI - Income received by non-resident as referred in section 194LBA
PTI_5A1aiii PTI - Income from units purchased in foreign currency in the case of non-residents
PTI_5A1bA   PTI-115A(1)(b) Income from royalty or fees for technical services received from Government or Indian concern
PTI_5AC1ab  PTI-115AC(1)(a) -Income by way of interest on bonds purchased in foreign currency - non-resident
PTI_5AC1abD PTI-115AC(1)(b) - Income by way of Dividend on GDRs purchased in foreign currency - non-resident
PTI_5AD1i   PTI-115AD(1)(i) -Income received by an FII in respect of securities (other than units as per Sec 115AB)
PTI_5AD1iP  PTI-115AD(1)(i) -Income received by an FII in respect of bonds or government securities as per Sec 194LD
PTI_5BBA    PTI-115BBA - Income received by non-residents sportsmen or sports associations or entertainer
PTI_5BBC    PTI - 115BBC - Anonymous donations
5AD1iDiv    115AD(1)(i) - Income (being dividend) received by an FII in respect of securities
5A1aiiaaP   115A(1) (a)(iiaa) -Interest referred to in section 194LC(1P) - chargeable u/s 115A(1)(a)(iiaa) @4 %
5A1aiiaa2P  115A(1)(a)(iiaa)- Income received by non-resident as referred in second proviso to section 194LC(1)
PTI_5AD1iDiv PTI-115AD(1)(i) - Income (being dividend) received by an FII in respect of securities
PTI_5A1aiiaaP PTI-115A(1) (a)(iiaa) -Interest referred to in section 194LC(1P) - chargeable u/s 115A(1)(a)(iiaa) @4 %
PTI_5A1aiiaa2P PTI_115A(1)(a)(iiaa)- Income received by non-resident as referred in second proviso to section 194LC(1)
```

## Appendix D · Dropdowns

The only value-list dropdown on the sheet is the override switch:

- **Row 96 / cell I96** — `EditAutopoulatedDetail`: **Yes**, **No** (default
  **No**). (Cells E8:E19, E21:E22, E24:E26, E46 carry the same `"Yes,No"`
  data-validation source but no on-screen head value; they are the auto-fill
  guards.)

All other data-validations on the sheet (`F6:F91` source `200`, `G*`/`H*`/`I*`
source `0`, `E47:E77` source `125`) are numeric/length format constraints, not
enumerations.
