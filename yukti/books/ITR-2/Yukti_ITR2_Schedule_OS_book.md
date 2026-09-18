# The book of Schedule OS — Income from Other Sources · ITR-2, A.Y. 2026-27

Read row by row from the utility's **OS** sheet (124 rows, with the hidden-row
flags) and confirmed against the CBDT ITR-2 schema's `ScheduleOS`. Nothing here
is invented; every item number, label, dropdown and rule is the department's own.

---

## 1 · The shape — nine items and a quarterly table

Schedule OS is one continuous computation, numbered 1 to 9, followed by a table
of when the income arose. It is not a list of income types; it is a **working**
that starts with gross income at normal rates, adds income at special rates,
takes off section-57 deductions, and lands on one figure that goes to Part B-TI.

| Item | What it is | Kind |
|---|---|---|
| **1** | Gross income chargeable at normal rates — 1a to 1e | five heads, most with sub-lines |
| **2** | Income chargeable at special rates — 2a to 2f | seven heads |
| **3** | Deductions under section 57 | four lines with rules |
| **4** | Amounts not deductible under section 58 | one figure |
| **5** | Profits chargeable under section 59 | one figure |
| **5a** | Income claimed for relief under 89A | one figure |
| **6** | **Net income at normal rates** — 1 − 3 + 4 + 5 − 5a | computed; a loss goes to CYLA |
| **7** | Income from other sources, other than race horses — 2 + 6 | computed |
| **8** | Income from owning and maintaining race horses — 8a to 8e | a separate five-line working |
| **9** | **Income under the head — 7 + 8e** | computed; 8e taken as nil if negative |
| **10** | Information about accrual or receipt | a quarterly table, 11 rows |

Where ITR-1 has one flat list of ten natures, ITR-2 has this structure — because
ITR-2 carries income taxed at **special rates** (lottery, unexplained credits,
115A dividends), income from **race horses** with its own loss rule, section-57
deductions with **conditions**, and the **89A** retirement-account income that
ITR-1 tucked into salary.

The sheet's closing note applies to the whole schedule: *"Please include the
income of the specified persons (spouse, minor child, etc.) referred to in
Schedule SPI while computing the income under this head."*

---

## 2 · Item 1 — Gross income chargeable at normal rates

**1 = 1a + 1b + 1c + 1d + 1e** — computed.

### 1a · Dividends, gross — ai + aii + aiii

| Item | Field | Note |
|---|---|---|
| **1a(i)** | Dividend income, other than (ii) and (iii) | the ordinary dividend |
| **1a(ii)** | Dividend income under section 2(22)(e) | deemed dividend — loan or advance by a closely-held company to a substantial shareholder |
| **1a(iii)** | Dividend income under section 2(22)(f) | buy-back of shares treated as dividend — *this is the one that unlocks the buy-back capital loss A(A) / B(A) in Schedule CG* |
| **1a** | Total — **computed** | |

### 1b · Interest, gross — nine sub-lines

| Item | Field |
|---|---|
| **1b(i)** | From savings bank |
| **1b(ii)** | From deposit — bank, post office, co-operative |
| **1b(iii)** | From income-tax refund |
| **1b(iv)** | In the nature of pass-through income or loss |
| **1b(v)** | Interest accrued on provident-fund contributions, taxable under the **first** proviso to 10(11) |
| **1b(vi)** | — under the **second** proviso to 10(11) |
| **1b(vii)** | — under the **first** proviso to 10(12) |
| **1b(viii)** | — under the **second** proviso to 10(12) |
| **1b(ix)** | Others, including interest from companies, NBFCs and HFCs |
| **1b** | Total — **computed** |

The four provident-fund lines are the ₹2.5 lakh / ₹5 lakh contribution-cap
rule: interest on contributions above the cap is taxable, and the form wants it
split by which proviso and which section (statutory PF under 10(11), recognised
PF under 10(12)).

### 1c · Rental income from machinery, plants, buildings — gross
One figure. *Unlocks the depreciation deduction at 3b.*

### 1d · Income under section 56(2)(x) — gifts and undervalued transfers

**1d = di + dii + diii + div + dv** — computed.

| Item | Field |
|---|---|
| **1d(i)** | Aggregate value of sum of money received without consideration |
| **1d(ii)** | Immovable property received without consideration — stamp duty value |
| **1d(iii)** | Immovable property received for inadequate consideration — stamp duty value **in excess of** the consideration |
| **1d(iv)** | Any other property received without consideration — fair market value |
| **1d(v)** | Any other property for inadequate consideration — fair market value **in excess of** the consideration |

### 1e · Any other income — a table, nature and amount

The sheet gives five **fixed** natures with their own rows, then free rows:

| Row | Nature | Note |
|---|---|---|
| — | **Family pension** | *unlocks the 57(iia) deduction at 3a(ii)* |
| — | Income from a retirement benefit account in a **notified country** under 89A | with three country lines — **2a United States · 2b United Kingdom · 2c Canada** |
| — | Income from a retirement benefit account in a **country other than** a notified country | |
| — | Income taxable this year on which relief under 89A was claimed in an **earlier** year | |
| — | Any specified sum received by a unit holder from a business trust — section 56(2)(xii) | |
| — | Any sum received under a life insurance policy, including bonus — section 56(2)(xiii) | the new high-premium-policy rule |
| **free rows** | Sl. No · Nature · Amount | the schema's `OthersIncDtls`, unlimited |

This is where ITR-2 puts the **89A** income that ITR-1's salary schedule carried.
On ITR-2 it lives in Other Sources.

---

## 3 · Item 2 — Income chargeable at special rates

**2 = 2a(i) + 2a(ii) + 2b + 2c + 2d + 2e + 2f** — computed. *Nothing in item 3
may be deducted against 2a, 2b or 2d.*

### 2a(i) · Winnings from lotteries, crossword puzzles, races, card games — section 115BB
One figure. 30%.

### 2a(ii) · Winnings from online games — section 115BBJ
One figure. 30%. *(The sheet has an older two-line version — gross winnings and
a Rule 133 adjustment — **hidden**; only the single figure is live.)*

### 2b · Income under section 115BBE — the unexplained heads

**2b = bi + … + bvi** — computed. 60%, plus 25% surcharge.

| Item | Field |
|---|---|
| **2b(i)** | Cash credits — section 68 |
| **2b(ii)** | Unexplained investments — section 69 |
| **2b(iii)** | Unexplained money — section 69A |
| **2b(iv)** | Undisclosed investments — section 69B |
| **2b(v)** | Unexplained expenditure — section 69C |
| **2b(vi)** | Amount borrowed or repaid on hundi — section 69D |

### 2c · Accumulated balance of recognised provident fund taxable under section 111
A **table**, 3 rows shipped, addable:

| Column |
|---|
| Assessment year — dropdown |
| Income benefit |
| Tax benefit |
| **Total** — computed |

### 2d · Any other income chargeable at a special rate — total of di to dxx
A **table**, nature from a **21-item dropdown**, amount:

| Code | Nature |
|---|---|
| 5A1ai | 115A(1)(a)(i) — dividends, interest and units bought in foreign currency |
| 5A1aA | 115A(1)(a)(A) — non-resident's dividend from an IFSC unit |
| 5A1aii | 115A(1)(a)(ii) — interest from government or Indian concerns in foreign currency |
| 5A1aiia | 115A(1)(a)(iia) — interest from an infrastructure debt fund |
| 5A1aiiaa | 115A(1)(a)(iiaa) — interest under 194LC(1) |
| 5A1aiiaaP | — under the proviso to 194LC(1) |
| 5A1aiiaa2P | — non-resident, second proviso to 194LC(1) |
| 5A1aiiab | 115A(1)(a)(iiab) — interest under 194LD |
| 5A1aiiac | 115A(1)(a)(iiac) — interest under 194LBA |
| 5A1aiii | 115A(1)(a)(iii) — UTI units bought in foreign currency |
| 5A1bA | 115A(1)(b)(A) and (B) — royalty and technical services |
| 5AC1ab | 115AC(1)(a) — non-resident's interest on foreign-currency bonds |
| 5AC1abD | 115AC(1)(b) — non-resident's dividend on GDRs |
| 5ACA1a | 115ACA(1)(a) — resident's income from GDRs |
| 5AD1i | 115AD(1)(i) — FII's income other than dividend on securities |
| 5AD1iP | 115AD(1)(i) — FII's income on bonds and government securities under 194LD |
| 5AD1iDiv | 115AD(1)(i) — FII's dividend on securities |
| 5BBA | 115BBA — non-resident sportsmen and sports associations |
| 5BBF | 115BBF — income from a patent |
| 5BBG | 115BBG — transfer of carbon credits |
| 5Ea | 115E(a) — non-resident Indian's investment income |

Rows addable, unlimited. The schema's `OthersGrossDtls`.

### 2e · Pass-through income in the nature of other sources, at special rates
The **same 21-item dropdown**, same table shape. The schema's `PTIOthersGrossDtls`.

### 2f · Amount included in 1 and 2 above, claimed at special rates under a DTAA
Non-residents only. A **table**, 6 rows shipped, addable. The sheet shows nine
columns; the JSON needs **ten fields**, because what the sheet calls "Item No."
is two things in the schema:

| Column | Schema field | Notes |
|---|---|---|
| Amount of income | `DTAAamt` ★ | |
| **Item of this schedule** in which it is included | `NatureOfIncome` ★ | dropdown of **9**: 1ai · 1aiii · 1b · 1c · 1d · 2ai · 2aii · 2d · 2e |
| **Section of the Act** it falls under | `ItemNoincl` ★ | dropdown of **49** codes — 56(2)(i) dividends · 56(2)(i) 2(22)(f) dividends · 56(2) interest · 56(2)(iii) rent · 56(2)(x) · the 21 special-rate natures of 2d · 115BB · 115BBJ · and a `PTI_` twin of each special-rate nature for pass-through |
| Country name | `CountryName` ★ | |
| Country code | `CountryCodeExcludingIndia` ★ | 250-code dropdown, India excluded |
| Article of the DTAA | `DTAAarticle` ★ | |
| Rate as per treaty — NIL if not chargeable | `RateAsPerTreaty` ★ | number |
| Whether a TRC was obtained | `TaxRescertifiedFlag` | Y / N |
| Rate as per the Act | `RateAsPerITAct` ★ | number |
| Applicable rate — the lower of the two | `ApplicableRate` | **computed** |

★ = required on every row. The 49-code `ItemNoincl` list is the one that ties a
DTAA claim to its section — the same code family as the 2d/2e nature dropdowns,
plus the 56(2) heads, plus a `PTI_` prefix for pass-through. Build the two
dropdowns as two columns, not one.

---

## 4 · Item 3 — Deductions under section 57

*"Other than those relating to income chargeable at special rates under 2a, 2b
and 2d."* Four lines, each with a condition the form states outright:

| Item | Field | Condition |
|---|---|---|
| **3a(i)** | Expenses or deductions other than a(ii) | in the case of income other than family pension |
| **3a(ii)** | Deduction under section 57(iia) | **family pension only** — a third of the pension, capped at ₹25,000 (new regime) or ₹15,000 (old) |
| **3b** | Depreciation | **available only if income is offered at 1c** — machinery, plant, buildings |
| **3c** | Interest expenditure under section 57(i) | **available only if income is offered at 1a(i) or 1a(ii)** — the dividend lines |
| | *Interest expenditure claimed* | what the person enters |
| **3c(i)** | *Eligible amount — computed* | **capped at 20% of the dividend income** in 1a(i) + 1a(ii) — the schema carries both `UsrIntExp57` (claimed) and `IntExp57` (eligible) |
| **3d** | Total | **computed** |

Two of these are the ones that catch people: interest on money borrowed to buy
shares is deductible only against the dividend, and only to 20% of it; and
depreciation is deductible only where there is rental income from plant or
buildings under this head.

---

## 5 · Items 4, 5, 5a — the adjustments

| Item | Field |
|---|---|
| **4** | Amounts not deductible under section 58 — added back |
| **5** | Profits chargeable to tax under section 59 — recovery of an amount earlier allowed |
| **5a** | Income claimed for relief from taxation under section 89A — taken off |

---

## 6 · Items 6 and 7 — the net at normal rates

| Item | Working |
|---|---|
| **6** | Net income at normal rates = **1 (after reducing the DTAA portion) − 3 + 4 + 5 − 5a**. *If negative, the figure goes to 3(i) of Schedule CYLA* — a loss under this head is set against other heads there. |
| **7** | Income from other sources, other than race horses = **2 + 6**, *taking 6 as nil if negative* |

That "6 as nil if negative" is the rule that stops an other-sources loss from
eating special-rate income like lottery winnings inside the schedule — the loss
goes out to CYLA instead.

---

## 7 · Item 8 — Owning and maintaining race horses

A separate five-line working, because its loss is ring-fenced:

| Item | Field |
|---|---|
| **8a** | Receipts |
| **8b** | Deductions under section 57 — in relation to 8a only |
| **8c** | Amounts not deductible under section 58 |
| **8d** | Profits chargeable under section 59 |
| **8e** | Balance = **8a − 8b + 8c + 8d** — *if negative, the figure goes to 6(xi) of Schedule CFL* |

A race-horse loss cannot be set against anything else; it carries forward on its
own line in CFL, for four years, against race-horse income only.

---

## 8 · Item 9 — Income under the head

**9 = 7 + 8e, taking 8e as nil if negative.** This is the figure that goes to
Part B-TI. The schema calls it `IncChargeable`.

---

## 9 · Item 10 — Information about accrual or receipt

The quarterly table, for interest under 234C. Five date columns — up to 15/6 ·
16/6–15/9 · 16/9–15/12 · 16/12–15/3 · 16/3–31/3 — and eleven rows, of which one
is hidden:

| Row | Income | Schema key |
|---|---|---|
| 1 | Winnings from lotteries, crossword puzzles, races, games, gambling, betting — 115BB | `IncFrmLottery` ★ |
| 2 | Winnings from online games — 115BBJ | `IncFrmOnGames` |
| 3(a) | Dividend income in 1a(i) | `DividendIncUs115BBDA` ★ |
| 3(b) | Dividend income in 1a(iii) — the 2(22)(f) buy-back dividend | `DividendIncUs115BBDAaiii` ★ |
| 4 | Dividend under 115A(1)(a)(i) at 20%, including pass-through | `DividendIncUs115A1ai` ★ |
| 5 | Dividend under the proviso to 115A(1)(a)(A) at 10%, including pass-through | `DividendIncUs115A1aA` |
| 6 | Dividend under 115AC at 10% | `DividendIncUs115AC` ★ |
| 7 | Dividend under 115ACA(1)(a) at 10%, including pass-through | `DividendIncUs115ACA` ★ |
| — | *Dividend under 115A(1)(a)(iiac) at 10% — **hidden***  | — |
| 8 | Dividend under 115AD(1)(i) at 20%, other than 115AB units | `DividendIncUs115AD1i` ★ |
| 9 | Income from a retirement benefit account in a notified country under 89A — the taxable portion after relief | `NOT89A` ★ |
| 10 | Dividend income taxable at DTAA rates | `DividendDTAA` ★ |

★ = the schema makes it **required** — eight of the ten live rows must be present
in the JSON even at zero, which is why this table cannot be left out.

Every row is typeable — the person enters the quarter each amount arose in.

---

## 10 · What repeats and what does not

| Where | Repeatable? |
|---|---|
| 1e — any other income, free rows | **yes**, unlimited (`OthersIncDtls`) |
| 1e — the 89A notified-country lines | fixed: US, UK, Canada |
| 2c — accumulated PF | **yes**, 3 shipped, addable |
| 2d — special-rate natures | **yes**, unlimited, from the 21-item list |
| 2e — pass-through special-rate | **yes**, unlimited, same list |
| 2f — DTAA claims | **yes**, 6 shipped, addable — ten fields per row, eight required |
| Everything else in 1, 2, 3, 4, 5, 8 | **one figure each** |
| Item 10 — quarterly table | fixed rows, five cells each |

---

## 11 · What is mandatory

From the schema's `required` lists:

**On `IncOthThanOwnRaceHorse`** — gross at normal rates · dividend gross ·
interest gross and its savings, deposit, refund, pass-through and others lines ·
rent · the 56(2)(x) total and all five sub-lines · family pension · the 89A
notified-country total · any other income · the special-rates total · 115BB ·
115BBE and its six sub-lines · accumulated PF totals · 2d total · 2e total ·
deductions (expenses, 57(iia), depreciation, total) · balance.

**On `ScheduleOS` itself** — `IncChargeable` (item 9) and the eight starred
quarterly rows.

Everything the schema marks optional — the 2(22)(e)/(f) dividends, the four PF
proviso lines, the 89A other-country and prior-year lines, 115BBJ, the 56(2)(xii)
and (xiii) sums, section 58 and 59, the interest-expenditure pair, the race-horse
block — is written only when it carries a value.

---

## 12 · What ITR-2's Other Sources has that ITR-1's does not

| | ITR-1 | ITR-2 |
|---|---|---|
| Dividend | one figure | split into ordinary, 2(22)(e) deemed, 2(22)(f) buy-back |
| Interest | one line per nature | nine lines including the four PF proviso lines |
| Gifts under 56(2)(x) | absent | five sub-lines |
| Special rates | absent — the form cannot carry them | lottery, online games, 115BBE, 115A family, DTAA |
| Section 57 | 57(iia) only | four lines with the 20% cap on interest and the depreciation condition |
| Sections 58, 59 | absent | present |
| Race horses | absent | a separate working with its own loss rule |
| 89A | in salary | in other sources, with the notified-country split |
| Quarterly table | dividend only | ten rows |

---

## 13 · What this means for the build

1. **Item 1 is a figures block** — 1a with three sub-lines, 1b with nine, 1c one,
   1d with five, 1e a fixed list plus a free table. Totals computed.
2. **Item 2 is a figures block with three tables** — 2a(i), 2a(ii), 2b's six lines
   as figures; 2c, 2d, 2e, 2f as tables with their dropdowns. 2f only for a
   non-resident.
3. **Item 3 enforces its conditions live** — 57(iia) only if family pension is
   entered; depreciation only if 1c is entered; interest only if 1a(i) or 1a(ii)
   is entered, and the eligible amount capped at 20% of them, shown alongside
   what was claimed.
4. **Items 6 to 9 are computed**, with the two nil-if-negative rules and the
   two routings — a normal-rate loss to CYLA, a race-horse loss to CFL.
5. **Item 8 is its own card**, off by default.
6. **Item 10 is an editable matrix** — auto-filled where the amounts are known,
   every cell typeable, each row checked against its source figure.
7. **The buy-back dividend at 1a(iii)** should unlock A(A) and B(A) in Schedule
   CG, and the check should say so when a buy-back loss is claimed without it.
