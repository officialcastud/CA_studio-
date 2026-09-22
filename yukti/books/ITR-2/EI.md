# The book of Schedule EI — Exempt income · ITR-2, A.Y. 2026-27

Read row by row from the utility's **EI** sheet (1013 rows, of which forty
carry labels), with the hidden-row flags, and confirmed against `ScheduleEI`.

*"Details of exempt income — income not to be included in total income or not
chargeable to tax."* Nothing here is taxed; but two lines here **affect the
tax** — net agricultural income is added for rate purposes, and the pass-through
exempt line reconciles to Schedule PTI.

---

## 1 · The shape — five numbered lines and three tables

| Line | Field | Kind |
|---|---|---|
| **1** | Interest income | one figure |
| — | *Dividend from a domestic company up to ₹10 lakh* | **hidden** — dividend is taxable now |
| — | *LTCG with STT* | **hidden** — taxable under 112A now |
| **2** | Agricultural income — the working, i to v | figures + a table |
| — | *Share in the profit of a firm, AOP, BOI* | **hidden** — business |
| **3** | Other exempt income, including exempt income of a minor child | a table |
| **4** | Income claimed as not chargeable to tax under a DTAA — non-residents | a table |
| **5** | Pass-through income claimed as not chargeable — from Schedule PTI | one figure |
| **6** | **Total (1 + 2 + 3 + 4 + 5)** | computed — `TotalExemptInc` |

---

## 2 · Line 2 — Agricultural income

| Item | Field | Rule |
|---|---|---|
| **2(i)** | Gross agricultural receipts — other than income to be excluded under rule 7A, 7B or 8 | |
| **2(ii)** | Expenditure incurred on agriculture | |
| **2(iii)** | Unabsorbed agricultural loss of the previous eight assessment years | |
| — | *Portion under rule 7, 7A, 7B(1), 7B(1A) and 8* | **hidden** — the tea/coffee/rubber composite-income rules are business |
| **2(iv)** | **Net agricultural income for the year (i − ii − iii) — enter nil if loss** | computed — `NetAgriIncOrOthrIncRule7`, **required** |

**2(v)** — *"In case the net agricultural income for the year exceeds ₹5 lakh,
please furnish the following details"* — a table, one row per parcel of land,
**required when 2(iv) > ₹5,00,000**:

| Column | Field | Options |
|---|---|---|
| a | **Name of district** in which the land is located, **with PIN code** | text + 6-digit PIN |
| b | **Measurement of the land, in acres** | number |
| c | **Owned or held on lease** | **O — owned · H — held on lease** |
| d | **Irrigated or rain-fed** | **IRG — irrigated · RF — rain-fed** |

Schema: `ExcNetAgriInc.ExcNetAgriIncDtls[]` — `NameOfDistrict`, `PinCode`,
`MeasurementOfLand`, `AgriLandOwnedFlag`, `AgriLandIrrigatedFlag`, all required
per row.

### The rate effect

Net agricultural income above ₹5,000, where non-agricultural total income is
above the basic exemption, is **added to total income for the purpose of
computing the rate**, and the tax on the exemption limit plus the agricultural
income is then deducted — the partial-integration rule. Part B-TI carries it as
`NetAgricultureIncomeOrOtherIncomeForRate`, and Part B-TTI's line 1 works the
rebate. On the new regime the same rule applies.

---

## 3 · Line 3 — Other exempt income

A table, unlimited rows, driven by **two dropdowns**:

| Column | Field | Options |
|---|---|---|
| Sl. No. | | |
| **Category** | nine | see below |
| **Sub-category** | fifty-two — filtered by the category | see below |
| Description | free text, max 125 | |
| **Amount** | required | |
| Total other exempt income | computed — `Others`, **required** |

### The nine categories

| Code | Category |
|---|---|
| AGRI | Agricultural and related incomes |
| GOVC | Compensation or other sums received from government or approved entities |
| ISI | Income from specified investments |
| SSRA | Specified sums received by armed-forces personnel |
| SRSC | Sums received by senior citizens or minors |
| SRST | Sums received by specified categories of taxpayers |
| SRPC | Sums received from policies or contributions — LIC, NPS, PF, Sukanya Samriddhi |
| OTH | Other incomes |
| OTHN | Other exempt income for non-residents |

### The fifty-two sub-categories, by category

**AGRI** — 10(30) Tea Board subsidy · 10(31) rubber, coffee, tea replantation subsidy · 10(37) capital gains on compulsory acquisition of urban agricultural land

**GOVC** — 10(10BB) Bhopal Gas Leak Disaster payments · 10(10BC) disaster compensation from Central or State Government or a local authority · 10(17A) award instituted by Government · 10(12AB) lump sum under the notified scheme

**ISI** — 10(15) interest on specified securities and investments · 10(23FBB) unit holder's income from an investment fund under 115UB · 10(23FD) unit holder's income from a business trust · 10(35) income from specified mutual funds · 10(35A) distributed income from a securitisation trust under 115TA · 10(23FBC) income of a unit holder from a specified fund · 10(33) transfer of a unit of the Unit Scheme 1964 · 10(4B) interest on specified savings certificates · 10(4C) interest on rupee-denominated bonds · 10(4E) non-deliverable forwards and ODIs with an IFSC banking unit · 10(36) LTCG on certain listed shares from a public issue · 10(37A) capital gains on transfer of a specified capital asset

**SSRA** — 10(12C) Agniveer Corpus Fund · 10(18) pension of a gallantry-award winner · 10(19) armed-forces family pension on death in operational duty · DMD defence medical disability pension

**SRSC** — 10(32) minor child's income, the ₹1,500 exemption · 10(43) reverse-mortgage payments to a senior citizen

**SRST** — 10(19A) annual value of one palace of an ex-ruler · 10(26) income of a member of a Scheduled Tribe in a specified area · 10(26AAA) income of a Sikkimese · and the remaining specified-taxpayer clauses in the utility's list

**SRPC** — 10(10D) life insurance proceeds · 10(11) statutory provident fund · 10(12) recognised provident fund · 10(11A) Sukanya Samriddhi · 10(12A) NPS withdrawal at closure · 10(12B) NPS partial withdrawal · 10(13) approved superannuation fund

**OTH** — the general clause, with a description

**OTHN** — the non-resident clauses — 10(4)(ii) NRE account interest · 10(15)(iv) specified interest · and the rest of the utility's non-resident list

The schema's `SubCategory` enum carries all fifty-two codes; the build filters
them by the chosen category exactly as the utility's dependent dropdown does.

---

## 4 · Line 4 — Income claimed as not chargeable under a DTAA

Non-residents only. A table, unlimited rows:

| Column | Field | Rule |
|---|---|---|
| Sl. No. | | |
| **Amount of income** | required | |
| **Nature of income** | required, free text, max 75 | |
| **Country name** | required, max 55 | |
| **Country code** | required — the 249-code list, **India excluded** | |
| **Article of the DTAA** | required, max 16 | |
| **Head of income** | required — **SA · HP · CG · OS** | |
| **Whether a TRC was obtained** | required — Y / N | |
| Total income from DTAA claimed as not chargeable | computed — `IncNotChrgblToTax`, **required** |

Schema: `IncNotChrgblAsPerDTAA.IncNotChrgblAsPerDTAADtls[]` — `AmountOfIncome`,
`NatureOfIncome`, `CountryName`, `CountryCodeExcludingIndia`, `ArticleOfDTAA`,
`HeadOfIncome`, `TRCFlag`.

This is the *not chargeable at all* case. The *chargeable at a special treaty
rate* case is in Schedule OS 2f and Schedule CG A9 / B12, and in Schedule SI —
not here.

---

## 5 · Line 5 — Pass-through income claimed as not chargeable

One figure — `PassThrIncNotChrgblTax` — the exempt line from Schedule PTI
(row iv of each block, 10(23FBB) and the two "specify" rows).

---

## 6 · What is mandatory

`NetAgriIncOrOthrIncRule7`, `Others`, `IncNotChrgblToTax`, `TotalExemptInc` —
the four computed totals, present even at zero whenever the schedule is
written. On every row of the three tables, the columns marked above.

## 7 · What repeats

The land table (when agricultural income exceeds ₹5 lakh), the other-exempt
table, the DTAA table — all unlimited.

---

## 8 · What ITR-2's EI has that ITR-1's does not

| | ITR-1 | ITR-2 |
|---|---|---|
| Agricultural income | up to ₹5,000, one figure | the full working with expenditure and unabsorbed loss, and the land table above ₹5 lakh |
| Other exempt income | a short category list | nine categories, fifty-two sub-categories, dependent dropdowns |
| DTAA not-chargeable | absent | the seven-column table |
| Pass-through exempt | absent | line 5 |

---

## 9 · What this means for the build

1. **Line 2 is a small working** — three inputs, net computed and floored at
   nil, and the land table appearing only above ₹5 lakh with its two
   dropdowns.
2. **Line 3 is the two-dropdown table** — category first, sub-category
   filtered from it, as the utility does.
3. **Line 4 is the DTAA table**, non-residents only, with the India-excluded
   country list and the SA/HP/CG/OS head.
4. **Line 5 reads Schedule PTI**.
5. **The rate effect** — net agricultural income feeds Part B-TI's
   for-rate line and Part B-TTI's rebate on it.
6. **Export** — `ScheduleEI` with the four required totals, and each table
   only when it has rows.
