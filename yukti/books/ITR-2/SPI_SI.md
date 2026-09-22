# The book of Schedules SPI · SI — ITR-2, A.Y. 2026-27

Read row by row from the utility's **SPI – SI** sheet (175 rows, one sheet for
both), with the hidden-row flags and the helper columns, and confirmed against
`ScheduleSPI` and `ScheduleSI`.

---

## Part 1 · Schedule SPI — Income of specified persons includable in the assessee's income

*"Income of specified persons (spouse, minor child etc.) includable in income
of the assessee, as per section 64."* The clubbing schedule. One row per
person per head:

| Column | Field | Rule |
|---|---|---|
| 1 | Sl. No. | |
| 2 | **Name of person** | required, max 125 |
| 3 | PAN of person | optional |
| 4 | Aadhaar of person | optional |
| 5 | **Relationship** | required, free text, max 50 — spouse, minor son, minor daughter, daughter-in-law, and so on |
| 6 | **Amount** | required |
| 7 | **Head of income in which included** | required — dropdown: **SA · HP · CG · OS · EI** |

Schema: `ScheduleSPI.SpecifiedPerson[]` — `SpecifiedPersonName`,
`PANofSpecPerson`, `AaadhaarOfSpecPerson`, `ReltnShip`, `AmtIncluded`,
`HeadIncIncluded`. Unlimited rows. No totals — the schedule is a disclosure.

### The rule

The amount is **not added by this schedule**. It is included in the head named
in column 7 — in Schedule S, HP, CG, OS or EI — *by the person entering it
there*, and Schedule SPI only says who it came from and why. The OS book's
closing note and the HP book both point here. The ₹1,500 exemption per minor
child under 10(32) is taken in EI, not here.

### The check worth having

For every row, the head in column 7 should carry at least that amount. Yukti
can warn when it does not.

---

## Part 2 · Schedule SI — Income chargeable to tax at special rates

*"Income chargeable to tax at special rates (please see instructions No. 9 for
rate of tax)."* The sheet's own note above it: *"Please click on Recalculate
initially, and also subsequently if Gender, Date of Birth or Residential Status
is changed"* — because the basic-exemption adjustment below depends on all
three.

### The shape

One row per special-rate head, five columns:

| Column | Field | Kind |
|---|---|---|
| Sl. No. | | |
| **Section** | the head, with its code | fixed list |
| **Special rate (%)** | | fixed per head |
| **Income (i)** | from the head's own schedule | computed |
| **Taxable income after adjusting for minimum chargeable to tax** | see the rule below | computed |
| **Tax thereon (ii)** | rate × taxable income | computed |
| Total | `TotSplRateInc`, `TotSplRateIncTax` | required |

And the override switch — *"Do you want to edit the details auto-populated in
table above?"* — `EditAutopoulatedDetail`.

### The live heads on ITR-2

The sheet ships **113 rows** and hides 27. The rows that are hidden are the
**pre-23-July-2024 rate rows** (`_BE` suffix in the helper column — "before
event"), the business-head twins of 115BBF/115BBG, 115BBC, 115BBDA, and the
15% / 10% / 20% pass-through slots. The live heads, in the sheet's order:

| Code | Section | Rate |
|---|---|---|
| 1 | 111 — accumulated balance of recognised PF | as computed in OS 2c |
| DTAAOS | Other-sources income at DTAA rates | treaty rate |
| 1A | 111A — STCG on equity with STT | 20 |
| 21 | 112 — LTCG on others, *after taking into account ΣB1h of Schedule CG* | 12.5 |
| 22 | 112(1) — LTCG on listed securities or units | 12.5 |
| 2A | 112A — LTCG on equity with STT | 12.5, above ₹1,25,000 |
| 21ciii | 112(1)(c)(iii) — LTCG on unlisted securities, non-resident | 12.5 |
| 5BB | 115BB — lotteries, puzzles, races, card games | 30 |
| 5BBJ | 115BBJ — online games | 30 |
| 5ADii | 115AD(1)(ii) — FII short-term, other than 111A | 30 |
| 5AD1biip | 115AD(1)(b)(ii) proviso — FII short-term under 111A | 20 |
| 5A1ai | 115A(1)(a)(i) — dividends and units in foreign currency | 20 |
| 5A1aA | 115A(1)(a)(A) — dividend from an IFSC unit | 10 |
| 5A1aii | 115A(1)(a)(ii) — interest in foreign currency | 20 |
| 5A1aiia | 115A(1)(a)(iia) — infrastructure debt fund | 5 |
| 5A1aiiaa | 115A(1)(a)(iiaa) — 194LC(1) | 5 |
| 5A1aiiab | 115A(1)(a)(iiab) — 194LD | 5 |
| 5A1aiiac | 115A(1)(a)(iiac) — 194LBA | 5 |
| 5A1aiii | 115A(1)(a)(iii) — UTI units in foreign currency | 20 |
| 5A1bA | 115A(1)(b) — royalty and technical services | 20 |
| 5AC1ab | 115AC(1)(a) — bonds in foreign currency, non-resident | 10 |
| 5AC1c | 115AC(1)(c) — LTCG on those bonds or GDRs | 10 |
| 5ACA1a | 115ACA(1)(a) — GDR dividends, resident | 10 |
| 5ACA1b | 115ACA(1)(b) — LTCG on GDRs, resident | 10 |
| 5AD1i | 115AD(1)(i) — FII income other than dividend | 20 |
| 5AD1iP | 115AD(1)(i) — FII interest under 194LD | 5 |
| 5ADiiiP | 115AD(1)(b)(iii) proviso — FII LTCG under 112A | 12.5 |
| 5BBA | 115BBA — non-resident sportsmen | 20 |
| 5BBE | 115BBE — sections 68 to 69D | 60 |
| 5BBF | 115BBF — patent | 10 |
| 5BBG | 115BBG — carbon credits | 10 |
| 5Ea | 115E(a) — NRI investment income | 20 |
| 5Eb | 115E(b) — NRI LTCG on a foreign-exchange asset | 10 |
| DTAASTCG | STCG at DTAA rates | treaty |
| DTAALTCG | LTCG at DTAA rates | treaty |
| PTI_STCG20P · PTI_STCG30P | pass-through STCG | 20 · 30 |
| PTI_LTCG12_5P112A · PTI_LTCG12_5P | pass-through LTCG | 12.5 |
| PTI_5A1ai … PTI_5Ea | the pass-through twin of each 115A/AC/ACA/AD/BB/E head | as the head |
| 5A1aiiaaP · 5A1aiiaa2P · 5A1aiiaci | the 194LC proviso, second proviso, and 194LBA dividend sub-cases | 4 · 9 · 10 |
| 5AD1iDiv · 5AC1abD | FII dividend on securities · dividend on GDRs | 20 · 10 |
| 5BBH · PTI_115BBH | virtual digital assets, and its pass-through | 30 |

The schema's enum carries **66 codes** and **12 rates** — 1, 4, 5, 9, 10, 12.5,
15, 20, 25, 30, 50, 60.

### The rule the sheet computes — the basic-exemption adjustment

Column H, *"Taxable income after adjusting for minimum chargeable to tax"*, is
the proviso to sections 111A, 112 and 112A: **a resident individual or HUF
whose normal-rate income falls short of the basic exemption limit may set the
shortfall against long-term and short-term capital gains** before the special
rate is applied.

The helper columns S and X give the **order** in which the utility applies the
shortfall, and it is fixed:

| Order | Applied to |
|---|---|
| 1st | 112 — LTCG at 20% (pre-July) |
| 2nd | 112 proviso — 20% |
| 3rd | 111A — STCG at 20% |
| 4th | pass-through STCG at 20% |
| 5th | 111A — STCG at 15% (pre-July) |
| 6th | pass-through STCG at 15% |
| 7th | 112 — LTCG at 12.5% |
| 8th | 112 proviso — 12.5% |
| 9th | **112A — LTCG at 12.5%** |
| 10th | pass-through LTCG at 12.5% |
| 11th | 112A — 10% (pre-July) |
| 12th | pass-through LTCG at 10% |

Highest rate first, so the shortfall saves the most tax. Only the capital-gain
heads take it — lottery, 115BBE and the 115A family never do. And it applies
**only to a resident**; the helper column `Balance_exemption` is nil for a
non-resident.

### The ₹1,25,000 under 112A

Row 1's helper formula settles how the exemption is shared:

```
112A          : MIN(125000 − P3 − P5, H27)
112A-PTI      : MIN(125000 − P3 − P5 − O3, H77)
115AD proviso : MIN(125000 − P6, H57)
```

One ₹1,25,000, applied first to the person's own 112A gain, then to the
pass-through 112A gain, then to the FII's 115AD-proviso gain — each taking what
is left. It is applied to the **income** column in SI (so the taxable income is
the excess), which is why the CG book calls it a relief in the tax and SI shows
it as a reduced base. The two views agree.

### What feeds each row

| Row | From |
|---|---|
| 1 | Schedule OS 2c — accumulated PF |
| 1A · 5AD1biip | Schedule CG A3(i) and A3(ii) — after Table E |
| 21 · 22 · 21ciii · 2A · 5AC1c · 5ACA1b · 5ADiiiP · 5Eb | Schedule CG B1 to B9 — after Table E, by rate slot |
| 5BB · 5BBJ · 5BBE · 5BBF · 5BBG | Schedule OS 2a(i), 2a(ii), 2b, and the 2d rows |
| 5A1ai … 5Ea · 5AD1i … 5AC1abD | Schedule OS 2d — one row per nature entered |
| PTI_* | Schedule PTI, and OS 2e |
| DTAAOS · DTAASTCG · DTAALTCG | OS 2f and CG A9 / B12 — the amounts at the special treaty rate |
| 5BBH · PTI_115BBH | Schedule VDA and PTI |

### What is mandatory

`TotSplRateInc` and `TotSplRateIncTax`. On every row present: `SecCode`,
`SplRatePercent`, `SplRateInc`, `SplRateIncTax`.

### What repeats

Nothing is typed. The rows appear for the heads that carry income. The person's
only input is the override switch.

---

## What this means for the build

1. **SPI is a table** — six columns, the head dropdown SA/HP/CG/OS/EI, unlimited
   rows, with a warning where the named head does not carry the amount.
2. **SI is a computed table** — one row per live head with income, in the
   sheet's order, showing code, rate, income, income after the exemption
   adjustment, tax. The override switch.
3. **The engine gets the basic-exemption walk** — the twelve-step order, for a
   resident only, against capital-gain heads only. And the three-way share of
   the ₹1,25,000.
4. **The tax engine reads SI** — `TotSplRateIncTax` is the special-rate tax that
   Part B-TTI adds to the normal-rate tax. Today the tax engine has its own
   eleven-head list; it should read the same rows SI shows.
5. **Export** — `ScheduleSPI.SpecifiedPerson[]`; `ScheduleSI.SplCodeRateTax[]`
   with the two totals and the switch.
