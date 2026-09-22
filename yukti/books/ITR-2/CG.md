# The book of Schedule CG — ITR-2, A.Y. 2026-27

Read row by row from the utility's **CG** sheet (541 rows) and confirmed against
the CBDT ITR-2 schema. Nothing here is invented; every heading, item letter and
field is the department's own.

---

## 1 · The shape of the schedule

Schedule CG has **six parts**, lettered A to F. The three you see first are the
big ones; the last three are the "third one" you were asking about — the
working that turns the gains into a taxable figure.

| Part | What it is | What goes in it |
|---|---|---|
| **A** | **Short-term capital gains** | nine heads, A1 to A9, plus a buy-back loss line A(A) |
| **B** | **Long-term capital gains** | twelve heads, B1 to B12, plus a buy-back loss line B(A) |
| **C** | **Income under the head** | the summary — C1, C2, C3 |
| **D** | **Deductions claimed against capital gains** | one table per exemption section — 54, 54B, 54D, 54EC, 54EE, 54F, 54G, 54GB, 115F |
| **E** | **Set-off of current-year losses** | the matrix — each loss type against each gain type |
| **F** | **Accrual or receipt of capital gain** | the quarterly split, for interest under 234C |

So the "third part" is really **C + D + E + F** together. C is the conclusion.
D is where every exemption you claimed in A or B must be *proved* with dates
and particulars. E is where losses are set against gains. F is when the gain
arose.

Two things the sheet says at the top of A and B, and they matter:

- **Short-term sub-items A3 and A4 are not applicable for residents.** They are
  the non-resident heads and stay hidden for a resident.
- **Long-term sub-items B4, B5, B6 and B7 are not applicable for residents.**
  Same rule.

---

## 2 · Part A — Short-term capital gains, head by head

### A1 · From sale of land or building or both
*"Fill up details separately for each property"* — this is the one head that is
**repeatable**. The sheet keeps a **"Number of blocks"** counter and a whole new
block is added for each property.

Per property:

| Item | Field | Type |
|---|---|---|
| — | Date of purchase / acquisition | date DD/MM/YYYY |
| — | Date of sale / transfer | date DD/MM/YYYY |
| **a i** | Full value of consideration received or receivable | amount |
| **a ii** | Value of the property as per the stamp valuation authority | amount |
| **a iii** | Full value adopted under section 50C — *if (aii) does not exceed 1.10 times (ai), take (ai); otherwise take (aii)* | **computed** |
| **b i** | Cost of acquisition without indexation | amount |
| **b ii** | Cost of improvement without indexation | amount |
| **b iii** | Expenditure wholly and exclusively in connection with the transfer | amount |
| **b iv** | Total (bi + bii + biii) | **computed** |
| **c** | Balance (aiii − biv) | **computed** |
| **d** | Deduction under section 54B *(details in Part D)* | amount |
| **e** | Short-term capital gain on immovable property (1c − 1d) | **computed** |
| **f** | **Buyer details** — see below | table |

**f · Buyer table** — one row per buyer, **3 rows provided per block, rows can be added**:

| Column | Notes |
|---|---|
| Name of buyer | |
| PAN of buyer | mandatory if TDS was deducted under 194-IA, or if quoted in the documents |
| Aadhaar of buyer | alternative to PAN |
| Percentage share | |
| Amount | |
| Address of property | |
| State | dropdown, 38 codes |
| PIN code | |
| Country | dropdown |

The sheet's own note: *"In case of more than one buyer, please indicate the
respective percentage share and amount."*

### A2 · From slump sale
Single block, not repeatable.

| Item | Field |
|---|---|
| **a i** | Fair market value as per Rule 11UAE(2) |
| **a ii** | Fair market value as per Rule 11UAE(3) |
| **a iii** | Full value of consideration — the higher of ai or aii — **computed** |
| **b** | Net worth of the undertaking or division |
| **c** | Short-term gain from slump sale (2aiii − 2b) — **computed** |

### A3 · From sale of equity shares, equity-oriented MF units or units of a business trust, with STT paid
Two sub-heads. Both are single blocks.

**(i) Under section 111A — for everyone other than an FII:**

| Item | Field |
|---|---|
| **i a** | Full value of consideration |
| **i b i** | Cost of acquisition without indexation |
| **i b ii** | Cost of improvement without indexation |
| **i b iii** | Expenditure in connection with the transfer |
| **i b iv** | Total — **computed** |
| **i c** | Balance (a − biv) — **computed** |
| **i d** | Loss to be disallowed under section 94(7) or 94(8) — *dividend or bonus stripping: an asset bought within 3 months before the record date and sold within 3 or 9 months after* |
| **i e** | Short-term gain (2c + 2d) — **computed** |

**(ii) Under section 115AD(1)(b)(ii) — for an FII only.** Same eight fields, items
ii a to ii e. Hidden for a resident.

### A4 · For a non-resident who is not an FII — shares or debentures of an Indian company
*"To be computed with foreign-exchange adjustment under the first proviso to
section 48."* Hidden for a resident. Not a computation block — the person
enters the already-computed figures:

| Item | Field |
|---|---|
| **a** | STCG on transactions covered under 111A |
| **a i** | — where the transfer was before 23 July 2024 |
| **a ii** | — where the transfer was on or after 23 July 2024 |
| **b** | STCG on shares not covered in 3a, or on debentures |

### A5 · For a non-resident FII — securities under section 115AD (other than A3)
Hidden for a resident. Single block, and the first one to carry the **unquoted
shares** working:

| Item | Field |
|---|---|
| **a i a** | Full value of consideration received for unquoted shares |
| **a i b** | Fair market value of unquoted shares, determined in the prescribed manner |
| **a i c** | Full value adopted under section 50CA — the higher of a or b — **computed** |
| **a ii** | Full value of consideration for assets other than unquoted shares |
| **a iii** | Total (ic + ii) — **computed** |
| **b i–iv** | The four section-48 deductions and their total |
| **c** | Balance (aiii − biv) — **computed** |
| **d** | Loss disallowed under 94(7)/94(8) |
| **e** | Short-term gain (c + d) — **computed** |

### A6 · From sale of assets other than at A1 to A5
Single block. The general head. Same structure as A5 — unquoted-share working,
section-48 deductions, balance, 94(7)/(8) — **plus** three things A5 does not
have:

| Item | Field |
|---|---|
| **e** | Deemed short-term gain on depreciable assets — *item 6 of Schedule DCG* |
| **f i / ii / iii** | Deduction under section 54D / 54G / 54GA *(details in Part D)* |
| **e** (final) | STCG on other assets (5c + 5d + …) — **computed** |

### A7 · Amount deemed to be short-term capital gain
Two parts:

**a — unutilised capital gain from an earlier year that was put in a Capital
Gains Account Scheme** and has now fallen due. A small table:

| Column | Options |
|---|---|
| Previous year in which the asset was transferred | 2023-24, 2024-25 |
| Section under which deduction was claimed that year | 54B |
| New asset acquired or constructed — year | 2023, 2024, 2025 |
| Amount utilised out of the account | |
| Amount not used, now deemed income | |

**b — any other amount deemed to be a short-term gain.** One figure.

### A8 · Pass-through income in the nature of short-term capital gain
*"Fill up Schedule PTI."* Four rate slots — 15%, 20%, 30%, applicable rate.
Single figures each, summed.

### A9 · Amount of STCG claimed as not chargeable, or chargeable at a special
rate, under a DTAA
Non-residents only. A table, one row per claim:

| Column |
|---|
| Amount of income |
| Item A1 to A8 in which it is included — dropdown |
| Country name and code — dropdown |
| Article of the DTAA |
| Rate as per the treaty (enter NIL if not chargeable) |
| Whether a Tax Residency Certificate was obtained — Y/N |
| Section of the Income-tax Act |
| Rate as per the Act |
| Applicable rate — the lower — **computed** |

Two totals: **a** not chargeable at all, **b** chargeable at the special rate.

### A(A) · Capital loss on buy-back of shares
*"Can be claimed only if the corresponding dividend under 2(22)(f) is offered
in Schedule OS."* A three-row table, rate (20%, 30% or applicable) and amount.

### **A9 total** · Total short-term capital gain
`A1e + A2c + A3a + A3b + A4e + A5e + A6 + A7 − A8a + A(A)` — **computed**.

---

## 3 · Part B — Long-term capital gains, head by head

### B1 · From sale of land or building or both
**Repeatable, one block per property**, same "Number of blocks" mechanism as A1.
Richer than A1 because of indexation and the 23-July-2024 split:

| Item | Field |
|---|---|
| — | Date of purchase / acquisition |
| — | Date of sale / transfer |
| — | **Whether chargeable under section 45(5A)?** Yes/No — and if yes, the date of the completion certificate |
| **a i / ii / iii** | Consideration, stamp value, section-50C value — as in A1 |
| **b i** | Cost of acquisition **without** indexation |
| **b ii a** | Cost of acquisition **with** indexation — *residents only, for the second proviso to 112(1)(a), acquisition before 23 July 2024* |
| **b ii b** | **Cost of improvement — a table**, rows can be added: (a) cost without indexation · (b) year of improvement · (c) cost with indexation |
| | Total cost of improvement without indexation — **computed** |
| | Total cost of improvement with indexation — **computed** |
| **b iii** | Expenditure in connection with the transfer |
| **b iv** | Total (bi + Σ biib(a) + biii) — **computed** |
| **b iv a** | Total for the purpose of eiB (biia + Σ biib(c) + biii) — the indexed total — **computed** |
| **c** | Balance (aiii − biv) — **computed** |
| **c a** | Balance on the indexed basis (aiii − biva) — **computed** |
| **d i–dv** | Deductions under 54, 54B, 54EC, 54EE, 54F, 54GB *(details in Part D)* |
| **d** | Total deduction — **computed** |
| **e** | LTCG on immovable property (1c − 1d) — **computed** |
| **e(a)** | LTCG on the indexed basis (1ca − 1d) — **computed** |
| **e i (A)** | Tax under 112(1)(a)(ii)(B) — 1e × 12.5% — **computed** |
| **e i (B)** | Tax for the second proviso — 1ea × 20% — **computed** |
| **e ii** | **Excess amount to be ignored** — (A) − (B), residents only — **computed** |
| **f** | Buyer table — as A1, 3 rows, addable |

Then across all properties:

| Item | Field |
|---|---|
| **g** | Total LTCG on all immovable properties — **computed** |
| **g a** | — the part from transfers **before** 23 July 2024 |
| **g b** | — the part from transfers **on or after** 23 July 2024 |
| **h** | Total excess tax to be ignored — **computed** |

That before/after split is what lets the department apply 20% with indexation
to the old transfers and 12.5% without to the new ones — and give a resident the
better of the two on pre-July property.

### B2 · From slump sale
As A2 (11UAE(2), 11UAE(3), higher, net worth, balance) **plus** deductions under
54EC / 54EE / 54F and the net figure.

### B3 · Bonds and listed securities — two sub-heads
**(i) For residents — unlisted bonds or debentures**, other than capital-indexed
government bonds. Consideration, section-48 deductions, balance, deductions
under 54EC / 54EE / 54F, net.

**(ii) Listed securities (other than units) or zero-coupon bonds under section
112(1).** Carries both indexed and un-indexed cost, the before/after 23-July
split, and the **first-proviso-to-112(1) working**: tax at 20% with indexation
versus 10% without, and the excess to be ignored.

**(iii) GDR of an Indian company under section 115ACA** — residents only.

### B4 · Equity shares, equity-oriented fund units or business-trust units with STT — section 112A
Fed from **Schedule 112A** (the scrip-by-scrip sheet), column 14:

| Item | Field |
|---|---|
| **a** | LTCG under 112A — sum of column 14 |
| **a i / ii** | — split before / on or after 23 July 2024 |
| **b** | Deduction under 54F, split the same way |
| **c** | Net, split the same way — **computed** |

### B5 · For a non-resident — unlisted shares or listed debentures of an Indian company
Hidden for a resident. Computed without indexation, with a three-way split:
before 23 July (listed debentures) · before 23 July (other) · on or after
23 July. Deduction under 54F on each.

### B6 · For a non-resident — three sub-heads
Hidden for a resident. Each is the full unquoted-shares-plus-section-48 block:
- (i) unlisted securities under 112(1)(c)
- (ii) bonds or GDRs under 115AC
- (iii) securities by an FII under 115AD, other than those in B7

### B7 · For an FII or FPI — equity with STT under section 112A
Fed from **Schedule 115AD(1)(iii) proviso**, column 14, with the same
before/after split and 54F deduction as B4.

### B8 · For a non-resident Indian — foreign-exchange asset under Chapter XII-A
Hidden for a resident. LTCG under section 115F computed without indexation,
before/after split, deduction under 115F, and a separate line for LTCG on any
other asset under 115E.

### B9 · From sale of assets where B1 to B8 do not apply
The general long-term head. Unquoted-shares working, section-48 deductions,
balance, then deductions under **54D, 54EC, 54EE, 54F, 54G, 54GA**, and the net.

### B10 · Amount deemed to be long-term capital gain
Two parts, as A7:
- **a** — unutilised gain from an earlier year in a Capital Gains Account
  Scheme, now deemed income. Table: previous year, section claimed (54, 54B,
  54D, 54EC, 54F, 54G, 54GA, 54GB, 115F), year of acquisition, amount
  utilised, amount not used.
- **b** — any other amount deemed to be a long-term gain, split before/after
  23 July 2024.

### B11 · Pass-through income in the nature of long-term capital gain
From Schedule PTI. Five rate slots: 10% under 112A · 12.5% under 112A · 10%
other · 12.5% other · 20%.

### B12 · LTCG claimed as not chargeable, or at a special rate, under a DTAA
Non-residents only. The same nine-column table as A9, with totals **a** (not
chargeable) and **b** (special rate).

### B(A) · Capital loss on buy-back of shares — long-term at 12.5%
Same rule as A(A).

### **B12 total** · Total long-term capital gain chargeable under the Act
`B1g + B2e + B3c + B4c + B5e + B6c + B7c + B8e + B9 + B10 − B11a + B(A)` —
**computed**.

---

## 4 · Part C — Income under the head

| Item | Field |
|---|---|
| **C1** | Sum of capital-gain incomes — *8ii + 8iii + 8iv + 8v + 8vi + 8vii of Table E* — **computed** |
| **C2** | Income from transfer of virtual digital assets — *column 7 of Schedule VDA* |
| **C3** | **Income chargeable under the head "Capital Gains" (C1 + C2)** — **computed** |

C1 is taken *after* the set-off in Table E, not before. That ordering is the
whole point of E.

---

## 5 · Part D — Deductions claimed against capital gains

*"In case of deduction under 54 / 54B / 54EC / 54F / 115F, give the following
details."* Every exemption entered in A or B has to appear here with its
particulars. One table per section, **3 rows each, rows can be added**, plus a
Total. Then a consolidated table with **8 rows** (section dropdown per row).

| Section | Columns in its table |
|---|---|
| **54** | date of transfer of original asset · cost of new residential house · date of purchase or construction · amount deposited in CGAS before the due date · date of deposit · account number · IFSC · amount of deduction claimed |
| **54B** | same, with *cost of new agricultural land* |
| **54D** | date of acquisition of original asset · cost of new land or building for the industrial undertaking · date of purchase · CGAS deposit particulars · amount claimed |
| **54EC** | date of transfer · **amount invested in specified bonds — not exceeding fifty lakh rupees** · date of investment · amount claimed |
| **54EE** | date of transfer of original residential property · amount invested in specified assets · date of investment · amount claimed |
| **54F** | as 54 — new residential house from any other asset |
| **54G** | date of transfer from the urban area · cost and expenses of the new asset · date of purchase or construction · CGAS deposit particulars · amount claimed |
| **54GB** | date of transfer of original residential property · **PAN of the eligible company** · amount used to subscribe to its equity · date of subscription · amount the company used for the new asset · date the company acquired it · CGAS deposit particulars · amount claimed |
| **115F** | date of transfer of the original foreign-exchange asset · amount invested in the new specified asset or savings certificate · date of investment · amount claimed |
| **f** | **Total deduction claimed** — **computed** |

Every date here is `DD/MM/YYYY`.

---

## 6 · Part E — Set-off of current-year capital losses

*"Excluding amounts included in A8a and B12a which are not chargeable under a
DTAA."* One matrix. The rows are the gain types; the columns are the loss types.

**Rows (gains, filled only where positive):**

| Row | Type |
|---|---|
| **i** | *Capital loss to be set off — filled only where negative* |
| **ii** | Short-term gain at 15% |
| **iii** | Short-term gain at 20% |
| **iv** | Short-term gain at 30% |
| **v** | Short-term gain at the applicable rate |
| **vi** | Short-term gain at DTAA rates |
| **vii** | Long-term gain at 10% |
| **viii** | Long-term gain at 12.5% |
| **ix** | Long-term gain at 20% |
| **x** | Long-term gain at DTAA rates |
| **xi** | Total loss set off (ii + … + x) — **computed** |
| **xii** | Loss remaining after set-off (i − xi) — **computed** |

**Columns (losses):** short-term loss at 15%, 20%, 30%, applicable rate, DTAA
rate; long-term loss at 10%, 12.5%, 20%, DTAA rate. Then the gain remaining
after set-off.

The rule the matrix enforces: a short-term loss may be set against any gain; a
long-term loss only against a long-term gain; nothing against its own slot.

The sheet carries a Yes/No: *"Do you want to edit the detail auto-populated
above?"* — the utility fills E itself and lets you override.

---

## 7 · Part F — Accrual or receipt of capital gain

Five date columns: up to 15/6 · 16/6–15/9 · 16/9–15/12 · 16/12–15/3 · 16/3–31/3.

Ten rows, each *"enter value from Schedule BFLA"* — i.e. the **post-set-off**
figure:

| Row | Rate |
|---|---|
| Short-term at 15% | BFLA item 3iiia |
| Short-term at 20% | 3iii |
| Short-term at 30% | 3iv |
| Short-term at applicable rates | 3v |
| Short-term at DTAA rates | 3vi |
| Long-term at 10% | 3viia |
| Long-term at 12.5% | 3vii |
| Long-term at 20% | 3viii |
| Long-term at DTAA rates | 3viii |
| Virtual digital assets at 30% | Schedule SI item 16 |

The sheet's note: *"Table F shall be non-mandatory in case of an individual
resident senior citizen and super senior citizen"* — because they owe no
advance tax, so 234C does not arise.

---

## 8 · How many can be added, per head

| Head | Repeatable? | How |
|---|---|---|
| **A1 / B1 — land or building** | **Yes, unlimited** — one block per property | the sheet's "Number of blocks" counter; `AddBlockCall_STCGrptfrm` in the VBA |
| Buyer table inside each land block | **Yes** | 3 rows shipped, `AddRows` adds more |
| Improvement table inside each B1 block | **Yes** | rows addable |
| A2 / B2 — slump sale | No — one block, aggregate figures | |
| A3 — equity with STT | No — one block per sub-head (111A, 115AD) | aggregate across all trades |
| A4, A5, A6 — other short-term heads | No — one block each | aggregate |
| B3 to B9 — other long-term heads | No — one block each | aggregate |
| **B4 — equity under 112A** | fed from **Schedule 112A**, which is unlimited, scrip by scrip | |
| **B7 — FII equity** | fed from **Schedule 115AD(1)(iii) proviso**, unlimited | |
| A7a / B10a — unutilised CGAS deposits | table, rows addable | |
| A9 / B12 — DTAA claims | table, rows addable | |
| A(A) / B(A) — buy-back loss | 3 rows | |
| **Part D — each exemption section** | **Yes** — 3 rows shipped per section, addable | |

**The key structural fact:** only land/building is entered *property by property*.
Every other head is a **single aggregate block** — you sum all your trades of that
kind and enter the totals. The per-scrip detail for listed equity lives in
Schedule 112A, not in Schedule CG itself.

---

## 9 · What this means for the build

1. **Land and building** — A1 and B1 — are the only repeatable blocks, and B1
   needs the indexation, improvement table, 45(5A) question, before/after split
   and the excess-tax working. Each block collapses; a dustbin deletes it.
2. **Every other head is one block**, opened by the head's own switch. The
   fields are exactly the item letters above, in that order, with the computed
   lines shown green.
3. **Non-resident heads** — A3(ii), A4, A5, B5, B6, B7, B8 — appear only when
   residential status is non-resident.
4. **Part D** is generated from the exemptions claimed in A and B and asks for
   each one's particulars, section by section.
5. **Part E** is computed and shown as the matrix, with the override switch.
6. **Part F** is computed from the transfer dates, with the senior-citizen
   exemption.
7. **Part C** is the summary — C1 from E, C2 from VDA, C3 the result.
