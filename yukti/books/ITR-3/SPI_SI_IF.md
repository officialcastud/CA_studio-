# The book of Schedules SPI · SI · IF — ITR-3, A.Y. 2026-27

Read row by row from the utility's **SPI - SI - IF** sheet (171 rows, three
schedules on one sheet), with the hidden-row flags and the helper columns, and
confirmed against `ScheduleSPI`, `ScheduleSI` and `ScheduleIF` in
`ITR-3_2026_Main_V1_1_schema.json`. Quotes are from the sheet and the schema,
not from memory.

## The shape

Three unrelated disclosures share one worksheet. **Schedule SPI** (rows 3-12)
is the clubbing table — income of specified persons (spouse, minor child etc.)
includable in the assessee's income, one row per person, six input columns and
a single total of amount included. **Schedule SI** (rows 16-121) is the
special-rate engine — one computed row per special-rate head, showing the code,
the rate, the income, the taxable income after the minimum-chargeable-to-tax
adjustment, and the tax thereon, with an edit-override switch. **Schedule IF**
(rows 122-134) lists the partnership firms in which you were a partner during
the previous year, one row per firm, with share of profit, interest,
remuneration and capital balance, plus four column totals.

---

## Part 1 · Schedule SPI — Income of specified persons

Header (row 3): *"Schedule SPI — Income of specified persons (spouse, minor
child etc.) includable in income of the assessee as per s[ection 64]."* One row
per specified person (rows 6-11, `Sl. No.` auto-increments `D7 = D6+1`).

### The items — `ScheduleSPI.SpecifiedPerson[]`

| Col | Field label | Type | Schema key | Rule / notes |
|---|---|---|---|---|
| 1 | Sl. No. | int | — | auto `D7 = D6+1` |
| 2 | Name of person | string | `SpecifiedPersonName` | **required**, maxLength 125 |
| 3 | PAN of person (optional) | string | `PANofSpecPerson` | optional |
| 4 | Aadhaar Number of the person | string | `AaadhaarOfSpecPerson` | optional |
| 5 | Relationship | string | `ReltnShip` | **required**, maxLength 50 |
| 6 | Amount (Rs) | int | `AmtIncluded` | **required**, max 99999999999999 |
| 7 | Head of Income in which included | string | `HeadIncIncluded` | **required**, enum BP/SA/HP/CG/OS/EI (dropdown, see Dropdowns) |

Total: `I12 = SUM(SPI.AmtIncluded)`.

---

## Part 2 · Schedule SI — Income chargeable to tax at special rates

Header (row 16): *"Schedule SI — Income chargeable to tax at special rates
(please see instructions No. 7 for rate of tax)."* Column headers (row 17):
`SPECIAL RATE` · `Sl. No.` · **Section** · **Special rate (%)** · **Income (i)**
· **Taxable Income after adjusting for Min Chargeable to Tax (ii)** · **Tax
thereon (iii)**. Above the table (row 15, hidden): a recalculate reminder.

### The items — `ScheduleSI.SplCodeRateTax[]`

Each live head is one array element: `SecCode` (the code, the sheet's helper
`O` column shown below), `SplRatePercent` (from `F`), `SplRateInc` (Income `G`),
`SplRateIncTax` (Tax `I`); `H` is the taxable income after adjustment. Rows are
computed and auto-populated — the only user input is the override switch
`EditAutopoulatedDetail` (row 120). Totals row 119: `G119 = SUM(SI.SplRateInc)`,
`H119 = SUM(SI.SplRateIncCalc)`, `I119 = SUM(SI.SplRateIncTax)`, exported as
`TotSplRateInc` and `TotSplRateIncTax` (**both required**).

Every visible special-rate row (`Sl. No.` auto-increments, e.g. `D19 = D18+1`):

| Row | Section (label) | Sheet code (col O) |
|---|---|---|
| 18 | 111- Tax on accumulated balance of recognized provident fund | `—` |
| 19 | Other source income chargeable under DTAA rates | `DTAAOS` |
| 21 | 111A - STCG on shares units on which STT paid as applicable. | `1A` |
| 23 | 112 - LTCG on Others | `—` |
| 26 | 112(1) (LTCG on listed securities/ units without indexation) | `—` |
| 28 | 112A - LTCG on sale of shares /units of equity oriented fund/units of business trust on which STT is | `2A` |
| 30 | 112(1)(c)(iii)- Long term capital gains on transfer of unlisted securities in the case of non-reside | `21ciii` |
| 31 | 115BB - Winnings from lotteries, crosswords puzzles, races including horse races, card games and oth | `5BB` |
| 32 | 115BBJ - Winnings from online games | `5BBJ` |
| 33 | 115AD(1)(ii) - Short term capital gains (other than on equity share or equity oriented mutual fund r | `5ADii` |
| 34 | 115BBF-Tax on income from patent (a) Income under head business or profession | `5BBF_BP` |
| 35 | 115BBG-Tax on Transfer of carbon credits (a) Income under head business or profession | `5BBG_BP` |
| 37 | 115AD(1)(b)(ii) - Proviso - Short term capital gains referred to in section 111A rws. 115AD by FII,  | `5AD1biip` |
| 38 | 115A(1)(a)(i)- Dividends from units purchased in foreign currency for non-residents | `5A1ai` |
| 39 | 115A(1)(a)(A) - Dividend received by non-resident (not being company) or foreign company from a unit | `5A1aA` |
| 40 | 115A(1)(a)(ii) - Interest received from govt/Indian Concerns received in Foreign Currency by non-res | `5A1aii` |
| 41 | 115A(1)(a)(iia) - Interest received by non-resident from infrastructure debt fund | `5A1aiia` |
| 42 | 115A(1) (a)(iiaa) - Income received by non-resident as referred in section 194LC(1) | `5A1aiiaa` |
| 43 | 115A(1)(a)(iiab) - Income received by non-resident as referred in section 194LD | `5A1aiiab` |
| 44 | 115A(1)(a)(iiac) - Income received by non-resident as referred in section 194LBA | `5A1aiiac` |
| 45 | 115A(1) (a)(iii) - Income from units purchased in foreign currency in case of non-residents | `5A1aiii` |
| 47 | 115A(1)(b)- Income from royalty or fees for technical services received from Government or Indian co | `5A1bA` |
| 48 | 115AC(1)(a) - Income by way of interest on bonds purchased in foreign currency -non-resident | `5AC1a` |
| 50 | 115AC(1)(c) - Long term capital gains arising from their transfer of bonds or GDR purchased in forei | `5AC1c` |
| 51 | 115ACA(1)(a) - Income by way of Dividends from GDR purchased in foreign currency in case of a reside | `5ACA1a` |
| 53 | 115ACA(1)(b) - Long term capital gains arising from the transfer of GDR purchased in foreign currenc | `5ACA1b` |
| 54 | 115AD(1)(i) - Income (other than dividend) received by an FII in respect of securities (other than u | `5AD1i` |
| 55 | 115AD(1)(i) - Income by way of Interest received by an FII in respect of bonds or government securit | `5AD1iP` |
| 58 | 115AD(1)(b)(iii) - Long term capital gains (other than on equity share or equity oriented mutual fun | `5ADiii` |
| 59 | 115AD(1)(b)(iii) Proviso- For NON-RESIDENTS from sale of equity share in a company or unit of equity | `5ADiiiP` |
| 60 | 115BBA - Income received by non-resident sportsmen or sports associations or entertainer | `5BBA` |
| 63 | 115BBE - Tax on income under section 68, 69, 69A, 69B, 69C or 69D. | `5BBE` |
| 64 | 115BBF-Tax on income from patent | `5BBF_XXXX` |
| 65 | (b) Income under head other sources | `5BBF` |
| 66 | 115BBG -Tax on income from transfer of carbon credits. | `5BBG_XXXX` |
| 67 | (b) Income under head other sources | `5BBG` |
| 68 | 115E(a) - Investment income of a non-resident Indian | `5Ea` |
| 72 | 115E(b) - Long term capital gains of a non-resident Indian on any foreign exchange asset | `5Eb` |
| 73 | STCG Chargeable at special rates in India as per DTAA | `STCGDTAA` |
| 74 | LTCG Chargeable at special rates in India as per DTAA | `LTCGDTAA` |
| 76 | Pass Through Income in the nature of Short Term Capital Gain chargeable @ 20% | `PTI_STCG20P` |
| 77 | Pass Through Income in the nature of Short Term Capital Gain chargeable @ 30% | `PTI_STCG30P` |
| 79 | Pass Through Income in the nature of Long Term Capital Gain chargeable @ 12.5% u/s 112A | `PTI_LTCG12_5P112A` |
| 81 | Pass Through Income in the nature of Long Term Capital Gain chargeable @ 12.5% other than u/s 112A | `PTI_LTCG12_5P` |
| 83 | PTI-115A(1)(a)(i)- Dividends from units purchase in foreign currency by non-residents | `PTI_5A1ai` |
| 84 | PTI- 115A(1)(a)(A)-proviso - Dividend received by non-resident (not being company) or foreign compan | `PTI_5A1aA` |
| 85 | PTI - 115A(1)(a)(ii)- Interest received from Govt./Indian Concerns in Forgeign currency by non-resid | `PTI_5A1aii` |
| 86 | PTI-115A(1)(a)(iia) - Interest received by non-resident from infrastructure debt fund | `PTI_5A1aiia` |
| 87 | PTI -115A(1)(a)(iiaa)- Income received by non-resident as referred in section 194LC(1) @ 5% | `PTI_5A1aiiaa` |
| 88 | PTI -115A(1)(a)(iiab)- Income received by non-resident as referred in section 194LD | `PTI_5A1aiiab` |
| 89 | PTI -115A(1)(a)(iiac)- Income received by non-resident as referred in section 194LBA | `PTI_5A1aiiac` |
| 90 | PTI -115A(1)(a)(iii)- Income from units of UTI purchased in foreign currency in the case of non-resi | `PTI_5A1aiii` |
| 91 | PTI -115A(1)(b)-Income from royalty or fees for technical services received from Government or India | `PTI_5A1bA` |
| 92 | PTI -115AC(1)(a)- Income by way of interest on bonds purchased in foreign currency - Non-residents | `PTI_5AC1a` |
| 93 | PTI -115ACA(1)(a)- Income from GDR purchased in foreign currency - resident | `PTI_5ACA1a` |
| 94 | PTI -115AD(1)(i)- Income (other than dividend) received by an FII in respect of securities (other th | `PTI_5AD1i` |
| 95 | PTI -115AD(1)(i)- Income by way of Interest received by an FII in respect of bonds or government sec | `PTI_5AD1iP` |
| 97 | PTI -115BBA- Income received by non-resident sportsmen or sports associations or entertainer | `PTI_5BBA` |
| 101 | PTI -115BBF- Tax on income from patent | `PTI_5BBF` |
| 102 | PTI - 115BBG- Tax on income from transfer of carbon credits. | `PTI_5BBG` |
| 103 | 115A(1)(a)(iiaa)- Income received by non-resident as referred in proviso to section 194LC(1) | `5A1aiiaaP` |
| 105 | 115A(1)(a)(iiaa) -Income received by non-resident as referred in second proviso to section 194LC(1) | `5A1aiiaa2P` |
| 106 | PTI -115A(1)(a)(iiaa)- Income received by non-resident as referred in proviso to section 194LC(1) | `PTI_5A1aiiaaP` |
| 108 | PTI - 115A(1)(a)(iiaa)- Income received by non-resident as referred in second proviso to section 194 | `PTI_5A1aiiaa2P` |
| 109 | PTI -115AD(1)(i)- Income being dividend received by an FII in respect of securities (other than unit | `5AD1iDiv` |
| 110 | 115AC(1)(b) - Income by way of dividend on GDR purchased in foreign currency - Non-residents | `PTI_5AD1iDiv` |
| 111 | 115AD(1)(i) - Income (being dividend) received by an FII in respect of securities (other than units  | `5AC1b` |
| 112 | PTI -115AC(1)(b) - Income by way of dividend on GDR purchased in foreign currency | `PTI_5AC1b` |
| 113 | PTI -115E(a)- Investment income of a non-resident Indian | `PTI_5Ea` |
| 114 | 115BBH- Income from transfer of Virtual Digital Assets | `xx` |
| 115 | a) Income under head business or profession | `5BBH_BP` |
| 116 | b) Income under head Capital Gain | `5BBH` |

`SecCode` schema enum (69 codes): 1, 1A, 21, 22, 21ciii, 2A, 5A1ai, 5A1aA, 5A1aii, 5A1aiia, 5A1aiiaa, 5A1aiiaaP, 5A1aiiaa2P, 5A1aiiab, 5A1aiiac, 5A1aiii, 5A1bA, 5AC1ab, 5AC1abD, 5AC1c, 5ACA1a, 5ACA1b, 5AD1i, 5AD1iDiv, 5AD1iP, 5ADii, 5AD1biip, 5ADiii, 5ADiiiP, 5BB, 5BBJ, 5BBA, 5BBH, 5BBH_BP, 5BBE, 5BBF, 5BBF_BP, 5BBG, 5BBG_BP, 5Ea, 5Eb, DTAASTCG, DTAALTCG, DTAAOS, PTI_STCG20P, PTI_STCG30P, PTI_LTCG12_5P112A, PTI_LTCG12_5P, PTI_5A1ai, PTI_5A1aA, PTI_5A1aii, PTI_5A1aiia, PTI_5A1aiiaa, PTI_5A1aiiaaP, PTI_5A1aiiaa2P, PTI_5A1aiiab, PTI_5A1aiiac, PTI_5A1aiii, PTI_5A1bA, PTI_5AC1ab, PTI_5AC1abD, PTI_5ACA1a, PTI_5AD1i, PTI_5AD1iDiv, PTI_5AD1iP, PTI_5BBA, PTI_5BBF, PTI_5BBG, PTI_5Ea.

`SplRatePercent` schema enum (12 values): 1, 5, 10, 15, 12.5, 20, 25, 30, 50,
60, 4, 9 (%).

---

## Part 3 · Schedule IF — Firms in which partner

Header (row 122): *"Schedule IF — Information regarding partnership firms in
which you are partner anytime during the previous year."* Row 123:
`FIRMS IN WHICH PARTNER` · `Number of firms in which you are partner`. One row
per firm (rows 126-131, `Sl.No.` auto-increments `E127 = E126+1`).

### The items — `ScheduleIF.PartnerFirmDetails[]`

| Col | Field label | Type | Schema key | Rule / notes |
|---|---|---|---|---|
| 1 | Sl.No. | int | — | auto `E127 = E126+1` |
| 2 | Name of the Firm | string | `FirmName` | **required**, maxLength 125 |
| 3 | PAN of the firm | string | `FirmPAN` | **required**, maxLength 10 |
| 4 | Whether the firm is Liable for Audit? (Y/ N) | string | `IsLiableToAudit` | dropdown (Select)/Y/N; `W126 = IF(H126="Y",1,0)` |
| 5 | Whether section 92E is applicable to firm? (Y/ N) | string | `Sec92EFirmFlag` | dropdown (Select)/Y/N |
| 6 | Percentage Share in the profit of the firm | number | `ProfitSharePercent` | **required**, 0-100 |
| 7 (i) | Amount of share in profit | int | `ProfitShareAmt` | **required**, max 99999999999999 |
| 8 (ii) | Amount of interest due or received | int | `IntrstAmtDueOrRecv` | optional, min 0 |
| 9 (iii) | Amount of remuneration due or received | int | `RemunernAmtDueOrRecv` | optional, min 0 |
| 10 (iv) | Capital balance as on 31st March in the firm | int | `FirmCapBalOn31Mar` | **required** |

Column totals (row 132): `K132 = SUM(IF.ProfitShareAmt)` → **`TotalProfitShareAmt`**
(required); `L132 = SUM(IF.IntrstAmtDueOrRecv)` → `TotalIntrstAmtDueOrRecv`;
`M132 = SUM(IF.RemunernAmtDueOrRecv)` → `TotalRemunernAmtDueOrRecv`;
`N132 = SUM(IF.FirmCapBalOn31Mar)` → **`TotalFirmCapBalOn31Mar`** (required).

---

## The rules the sheet computes

- **`I12 = SUM(SPI.AmtIncluded)`** — SPI total amount included. SPI does not add
  income itself; each amount is included under the head named in column 7 by the
  person entering it there. SPI is a disclosure.
- **`O4 = MIN(125000-P4-P6,H27)`**, **`P4 = MIN(125000,taxableInc112A)`** — the
  ₹1,25,000 exemption under 112A, shared across the 112A heads (row 4 helpers).
- **`O6 = MIN(125000-P4-P6-O4,H78)`**, **`P6 = MIN(125000-P4,taxableIncPTI_LTCG12)`**
  — the ₹1,25,000 carried to pass-through LTCG @ 12.5% u/s 112A (row 6).
- **`O7 = MIN(125000-P7,H57)`**, **`P7 = MIN(125000,H59)`** — the ₹1,25,000
  carried to the 115AD(1)(b)(iii) proviso head (row 7).
- **`I27 = ROUND(IF(H27>O4,(H27-O4)*F27/100,0),0)`**, **`I28 = ROUND(IF(taxableInc112A>P4,(taxableInc112A-P4)*F28/100,0),0)`**
  — 112A tax charged only on the gain above the ₹1,25,000 exemption.
- **`I78 = ROUND(IF(H78>O6,(H78-O6)*F78/100,0),0)`**, **`I79 = ROUND(IF(H79>P6,(H79-P6)*F79/100,0),0)`**,
  **`I57 = ROUND(IF(H57>O7,...),0)`**, **`I59 = ROUND(IF(H59>P7,...),0)`** — same
  ₹1,25,000 threshold applied to the PTI-112A and 115AD-proviso heads.
- **`I23 = MAX(0,ROUND((H23*F23/100)-LTCG.B1g_ImmpropertyB1e1c,0))`** and
  **`I25 = MAX(ROUND((H25*F25/100)-LTCG.B3h_Excess,0),0)`** — 112 tax reduced by
  the immovable-property / excess relief carried from Schedule CG.
- **Row-18 `I18 = os.TaxBenefitTotal`, `G18 = R18`, `H18 = SI_111`** — the 111
  accumulated-PF head takes its income and tax straight from Schedule OS.
- **The DTAA / NRI reduction** — most `R` helper cells (e.g. `R31`, `R32`, `R33`,
  `R39`, `R47`, `R60`, `R103`…) are `MAX(0, source − DTAA amount)` guarded by
  `IF(MID(sheet1.ResidentialStatus1,1,3)="NRI", …)`: each special income is
  passed after reducing the corresponding DTAA income.
- **`U19` basic-exemption slack** — `IF(...NRI...,0,IF(bacValue=1,400000,...))`:
  a resident's unused basic exemption (₹4,00,000 under the new regime, `bacValue=1`)
  feeds the min-chargeable adjustment; **nil for a non-resident**.
- **The exemption walk (helper cols U/W and the order in cols S/X)** — the slack
  is set off against capital-gain heads highest-rate first:
  `X50 1st-112-20%LTCG`, `X51 2nd-112Proviso-20%LTCG`, `X52 3rd-111A-20%STCG`,
  `X53 4th-PTI-20% STCG`, `X54 5th-111A-15%-STCG`, `X55 6th-PTI-15%-STCG`,
  `X56 7th-112-12.5% LTCG`, `X57 8th-112Proviso-12.5%LTCG`, `X59 9th-112A-12.5%-LTCG`,
  `X60 10th-PTI-12.5%-LTCG`, `X63 11th-112A-10%LTCG`, `X64 12th-PTI-10%LTCG`.
  The `U*/W*` pairs (e.g. `U41 = IF(U38<G22,MAX(0,(G22-U38)),0)`,
  `W41 = IF(U38<G22,0,(U38-G22))`) carry the remaining slack down that order.
- **`P121 = MAX(0,100000-H27)` (`Balance_exemption`)** and **`U22 = Sheet8b.TotalIncome-Sheet8b.IncChargeableTaxSplRates`** — inputs to the adjustment.
- **`I20 = ROUND(H20*F20/100,0)`** and the many `ROUND(H*F/100,0)` cells — plain
  rate × taxable income for the ordinary special-rate heads.
- **Totals** — SI row 119 `SUM(SI.SplRateInc/…Calc/…Tax)`; IF row 132 the four
  `SUM(IF.*)` column totals.
- **`W126 = IF(H126="Y",1,0)`** — IF audit flag reduced to a 0/1 marker.

### Helper-column notes (cols S/T/U/W/X — rules, not items)

These captions live in the sheet's off-screen helper columns and drive the
exemption walk above; they are notes, never input rows: `ExemptionUnderSI`
(col U18), `ExemptionAmt` (col T19), `Final Exemption Allowed` (col T38),
`Exemption Remaining after Set off` (cols W40 / S49), the regime note
*"3lac to 4lac changed for New tax regime"* (col W19), the maintenance stamp
*"Konda updated on 27-05-2026"* (col U48), `Balance_exemption` (col O121),
`partbSetoffInc` (col T22), the `DTAA` marker (col Q19), and the set-off
target captions `For 112`, `For 111A`, `For 112(proviso)`, `For 112A`,
`PTI 112A`, `FOR 112 Proviso`, `For 111A-20%`, `For 111A-15%`, `For PTI-20`,
`For PTI-15%`, `For PTI-20% LTCG`. The order captions in col X read
`1st-112-20%LTCG`, `2nd-112Proviso-20%LTCG`, `3rd-111A-20%STCG`,
`4th - PTI-20% STCG`, `5th-111A-15%-STCG`, `6th-PTI-15%-STCG`,
`7th-112-12.5% LTCG`, `8th-112Proviso-12.5%LTCG`, `9th-112A-12.5%-LTCG`,
`10th-PTI-12.5%-LTCG`, `11th-112A-10%LTCG`, `12th-PTI-10%LTCG`. The totals
caption in col F119 reads `Tax at Spl Rate`.

---

## Dropdowns

- **SPI col 7 — Head of Income in which included** (`J6:J11`): `(Select)`,
  `Business/Profession`, `Salary`, `House Property`, `Capital Gains`,
  `Other sources`, `Exempt Income`. (Schema `HeadIncIncluded` enum: BP, SA, HP,
  CG, OS, EI.)
- **SI override — "Do you want to edit the details auto-populated in table above ?"**
  (`I120`): `Yes`, `No`. (Schema `EditAutopoulatedDetail` enum: Y, N.)
- **IF col 4 — Whether the firm is Liable for Audit? (Y/ N)** (`H126:H131`):
  `(Select)`, `Y`, `N`.
- **IF col 5 — Whether section 92E is applicable to firm? (Y/ N)** (`I126:I131`):
  `(Select)`, `Y`, `N`.

---

## What repeats and what is one figure

- **Arrays (repeat):** `ScheduleSPI.SpecifiedPerson[]` (one per specified
  person, sheet allows rows 6-11); `ScheduleSI.SplCodeRateTax[]` (one per
  special-rate head that carries income, auto-populated);
  `ScheduleIF.PartnerFirmDetails[]` (one per firm, sheet allows rows 126-131).
- **Single figures:** SPI total `I12`; SI totals `TotSplRateInc`,
  `TotSplRateIncTax` and the switch `EditAutopoulatedDetail`; IF totals
  `TotalProfitShareAmt`, `TotalIntrstAmtDueOrRecv`, `TotalRemunernAmtDueOrRecv`,
  `TotalFirmCapBalOn31Mar`.

---

## Mandatory (schema `required` keys)

- **ScheduleSPI** — no top-level `required`; per array element:
  `SpecifiedPersonName`, `ReltnShip`, `AmtIncluded`, `HeadIncIncluded`.
- **ScheduleSI** — top-level `TotSplRateInc`, `TotSplRateIncTax`; per element:
  `SecCode`, `SplRatePercent`, `SplRateInc`, `SplRateIncTax`.
- **ScheduleIF** — top-level `TotalProfitShareAmt`, `TotalFirmCapBalOn31Mar`;
  per element: `FirmName`, `FirmPAN`, `ProfitSharePercent`, `ProfitShareAmt`,
  `FirmCapBalOn31Mar`.

---

## Hidden rows — not built

These rows are flagged `H` in the dump. They are **not items** — the utility
keeps them for its own calculations and never renders them for input. Reasons:
the SI `_BE` rows are pre-23-July-2024 ("before event") rate variants superseded
by the current-rate rows; the 10%/15%/20% pass-through slots and the
115BBC/115BBDA/FA/115E-asset rows carry no income for AY 2026-27; rows 152-171
are a lookup list of section codes.

**Row 15** — recalculate reminder (*"Please click on Recalculate initially, and
also subsequently if Gender, Date of Birth, Residential..."*), a note, not an
item.

SI hidden special-rate rows:

| Row | Section (label) | Sheet code (col O) |
|---|---|---|
| 20 | 111A - STCG on shares units on which STT paid where transfer was before 23rd July 2024 as applicable | `1A_BE` |
| 22 | 112 - LTCG on Others [where transfer / event was before 23rd July 2024 as applicable] | `21_BE` |
| 24 | 112 Proviso LTCG on listed securities/ units without indexation [where transfer was before 23rd July | `—` |
| 25 | 112 Proviso LTCG on listed securities/ units without indexation [where transfer was before 23rd July | `22_BE` |
| 27 | 112A - LTCG on sale of shares /units of equity oriented fund/units of business trust on which STT is | `2A_BE` |
| 29 | 112(1)(c)(iii)- Long term capital gains on transfer of unlisted securities in the case of non-reside | `21ciii_BE` |
| 36 | 115AD(1)(b)(ii) - Proviso - Short term capital gains referred to in section 111A rws. 115AD by FII,  | `5AD1biip_BE` |
| 46 | Para E II of Part I of Ist Sch of FA - Income from royalty or technical services - Non-domestic comp | `FA` |
| 49 | 115AC(1)(c) - Long term capital gains arising from their transfer of bonds or GDR purchased in forei | `5AC1c_BE` |
| 52 | 115ACA(1)(b) - Long term capital gains arising from the transfer of GDR purchased in foreign currenc | `5ACA1b_BE` |
| 56 | 115AD(1)(b)(iii) - Long term capital gains (other than on equity share or equity oriented mutual fun | `5ADiii` |
| 57 | 115AD(1)(b)(iii) Proviso- For NON-RESIDENTS from sale of equity share in a company or unit of equity | `5ADiiiP_BE` |
| 61 | 115BBC - Anonymous donations | `5BBC` |
| 62 | 115BBDA (Dividend income from domestic company exceeding Rs.10lakh) | `5BBDA` |
| 69 | 115E(a) - Long term capital gains of a non-resident Indian on any asset other than a specified asset | `5Eacg_BE` |
| 70 | 115E(a) - Long term capital gains of a non-resident Indian on any asset other than a specified asset | `5Eacg` |
| 71 | 115E(b) - Long term capital gains of a non-resident Indian on any foreign exchange asset [where tran | `5Eb_BE` |
| 75 | Pass Through Income in the nature of Short Term Capital Gain chargeable @ 15% | `PTI_STCG15P` |
| 78 | Pass Through Income in the nature of Long Term Capital Gain chargeable @ 10% u/s 112A | `PTI_LTCG10P112A` |
| 80 | Pass Through Income in the nature of Long Term Capital Gain chargeable @ 10% other than section 112A | `PTI_LTCG10P` |
| 82 | Pass Through Income in the nature of Long Term Capital Gain chargeable @ 20% | `PTI_LTCG20P` |
| 96 | PTI_115BB- Winnings from lotteries, crosswords puzzles, races including horse races, card games and  | `PTI_5BB` |
| 98 | PTI_115BBC- Anonymous donations | `PTI_5BBC` |
| 99 | PTI_115BBDA- (Dividend income from domestic company exceeding Rs.10lakh | `PTI_5BBDA` |
| 100 | PTI_115BBE- Income under section 68, 69, 69A, 69B, 69C or 69D | `PTI_5BBE` |
| 104 | 115A(1)(a)(iiac)- Distributed income being Dividend referred to in section 194LBA | `5A1aiiaci` |
| 107 | PTI_115A(1)(a)(iiac)- PTI - Distributed income being Dividend referred to in section 194LBA | `PTI_5A1aiiaci` |

**Rows 152-171** — hidden lookup column `J` holding bare section codes
(`5A1ai`, `5A1aii`, `5A1aiia`, `5A1aiiaa`, `5A1aiiab`, `5A1aiiac`, `5A1aiii`,
`FA`, `5A1bA`, `5A1bB`, `5AC1a`, `5ACA1a`, `5AD1i`, `5AD1iP`, `5BBA`, `5BBC`,
`5BBE`, `5Ea`, `1`, `5BB`) used by the auto-populate logic; not input rows.

---

## What this means for the build

1. **SPI is a plain input table** — six columns, head dropdown
   (BP/SA/HP/CG/OS/EI), rows 6-11, and a single sum `I12`. It only discloses who
   the clubbed income came from; the amount is taxed under the named head
   elsewhere.
2. **SI is a computed table** — one auto-populated row per live head in the
   sheet's order, exposing code, rate, income (`G`), income after the
   min-chargeable adjustment (`H`), and tax (`I`). The only user control is the
   override switch. Do **not** build the `_BE` / zero-income hidden rows.
3. **The engine must implement the ₹1,25,000 112A exemption share** (own 112A →
   PTI-112A → 115AD proviso) and the **twelve-step basic-exemption walk**,
   highest rate first, resident-only, capital-gain heads only.
4. **The DTAA/NRI reduction** applies per head before the special rate; residents
   reduce DTAA income irrespective of TRC, non-residents only when TRC = Yes.
5. **Part B-TTI reads `TotSplRateIncTax`** as the special-rate tax added to
   normal-rate tax; Part B-TI Sl.11 equals total of SI col (i).
6. **IF is an input table** — firm rows 126-131 with two Y/N dropdowns and the
   four column totals; IF totals cross-check Schedule P&L 14xi(b)/(c) and gate
   Schedule BP A5a (share of firm income cannot exceed IF profit share).
7. **Export** — `ScheduleSPI.SpecifiedPerson[]`; `ScheduleSI.SplCodeRateTax[]`
   with `TotSplRateInc`/`TotSplRateIncTax`/`EditAutopoulatedDetail`;
   `ScheduleIF.PartnerFirmDetails[]` with its four totals.
