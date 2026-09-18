# The book of Part A — General · ITR-2, A.Y. 2026-27

Read row by row from the utility's **PART A – General** sheet (97 rows) and
confirmed against the CBDT ITR-2 schema's `PartA_GEN1`. Nothing here is
invented; every label, code and dropdown is the department's own.

---

## 1 · Why ITR-2's General is different from ITR-1's

ITR-1 asks who you are and where you live. ITR-2 asks all of that and then
asks **why you are on ITR-2 at all** — and every one of those reasons is a
question with its own particulars:

| The reason | What ITR-2 asks for it |
|---|---|
| You may be a non-resident | residential status, **which condition** makes you so, every jurisdiction you were resident in with its TIN, days in India this year and in the last four |
| You may be an HUF | status I / H, date of formation instead of birth |
| You may be a director | every company, its type, PAN, listed or not, your DIN |
| You may hold unlisted shares | every company, opening and closing holdings, everything acquired and transferred in the year |
| You may be a partner | every firm and its PAN |
| You may be a foreign portfolio investor | the SEBI registration number |
| You may live under the Portuguese Civil Code | Schedule 5A |
| A representative may be filing for you | their name, email, mobile, capacity, address, PAN, Aadhaar |
| Your refund may be ₹50 crore or more | a Legal Entity Identifier |

In ITR-1 those were the eight eligibility questions whose only answer was
"then use ITR-2". In ITR-2 each one opens a sub-form.

---

## 2 · The shape — nine blocks

| # | Block | Kind | Always shown? |
|---|---|---|---|
| 1 | **Personal information** | figures | yes |
| 2 | **Addresses** — primary and secondary | figures | yes |
| 3 | **Communication** — email, mobile, phone | figures | yes |
| 4 | **Filing** — section, notice, revised-return particulars | ask + figures | yes |
| 5 | **Residential status** and its conditions | ask + table | yes; the sub-form depends on the answer |
| 6 | **Regime** — 115BAC(6) option and Form 10-IE | ask | yes |
| 7 | **Seventh proviso** to 139(1) | ask, seven flags | yes, collapsed |
| 8 | **Other particulars** — Aadhaar, 115H, 5A, passport, FPI, representative, LEI, PE | mixed | yes; sub-forms open on Yes |
| 9 | **Directorships · Unlisted shares · Partnerships** | three tables | yes; each opens on Yes |

---

## 3 · Block by block

### Block 1 · Personal information

| Field | Rule |
|---|---|
| First name · Middle name · **Last name** | last name (or HUF name) is the mandatory one — the schema calls it `SurNameOrOrgName` |
| **PAN** | ten characters; 4th letter **P** for an individual, **H** for an HUF |
| **Status** | dropdown: I — Individual, H — HUF |
| **Date of birth / formation** | `DD/MM/YYYY`; must be on or before 31 March 2026; for an HUF it is the date of formation |

### Block 2 · Addresses

The sheet's own heading: *"Addresses to be provided for communication purposes."*

**Primary address** — Flat/Door/Block No · Name of premises/building/village ·
Road/Street/Post Office · Area/Locality · Town/City/District · **State**
(38 codes) · **Country/Region** (250 codes) · PIN code · Zip code (when abroad).

**Is the secondary address the same as the primary?** — Yes/No. On **No** the
same nine fields open again. The schema carries this as `SecondaryAdd` plus an
`AlternateAddress` block.

For a **non-resident** the country is not 91 and the Zip code replaces the PIN.

### Block 3 · Communication

Primary email · secondary email · **primary mobile** with country code ·
secondary mobile · STD/ISD code and residential or office phone.

### Block 4 · Filing

| Field | Options / rule |
|---|---|
| **Filed under section** | 11 — 139(1) on or before the due date · 12 — 139(4) belated · 13 — 142(1) · 14 — 148 · 16 — 153C · 17 — 139(5) revised · 18 — 139(9) defective · 19 — 92CD modified · 20 — 119(2)(b) after condonation |
| Filed in response to a notice under section | the section of the notice, where 13/14/16/18 |
| **If revised, defective or modified** — receipt number and date of the original return | both required for 17, 18, 19 |
| **If in response to a notice** — unique number / DIN and its date | both required for 13, 14, 16, 18, 20 |
| If under 92CD — date of the advance pricing agreement | |
| Due date under 139(1) | **31/07/2026**, fixed by the form |

The sheet carries one instruction worth keeping visible: *a corrected return
filed against a 139(9) notice on a return that was itself filed under 139(8A)
has to select 139(8A) again.*

### Block 5 · Residential status — the block ITR-1 does not have

**Residential status in India** — dropdown: RES · NOR · NRI.

**Conditions for residential status** — *individuals only* — one of nine:

| Code | The condition, as the form states it |
|---|---|
| 1 | In India for 182 days or more during the year — section 6(1)(a) |
| 2 | In India for 60 days or more during the year and 365 days or more within the 4 preceding years — section 6(1)(c) |
| 3 | Non-resident in India in 9 of the 10 preceding years — section 6(6)(a) |
| 4 | In India for 729 days or less during the 7 preceding years — section 6(6)(a) |
| 5 | A non-resident during the year |
| 6 | Citizen or person of Indian origin on a visit, income other than foreign sources over ₹15 lakh, in India 120 to 181 days — section 6(6)(c) |
| 7 | Citizen with income other than foreign sources over ₹15 lakh, not liable to tax anywhere else by domicile or residence — section 6(6)(d) with 6(1A) |
| 8 | Citizen who left India as crew of an Indian ship, in India 182 days or more and 365 or more in the preceding 4 years — Explanation 1(a) to 6(1)(c) |
| 9 | (as listed in the utility) |

Codes 1, 2 and 8 make the person **resident and ordinarily resident**; 3 and 4
make them **resident but not ordinarily resident**; 5, 6 and 7 make them
**non-resident**. The two answers have to agree.

**For a non-resident, two more things open:**

**(i) Jurisdictions of residence during the year** — a table, rows addable:

| Column |
|---|
| Jurisdiction of residence — country dropdown, 250 codes |
| Taxpayer Identification Number in that jurisdiction |

**(ii) For a citizen of India or a person of Indian origin:**

| Field |
|---|
| Total period of stay in India during the year, in days |
| Total period of stay in India during the 4 preceding years, in days |

These two numbers are what conditions 2, 6 and 8 turn on, so they are asked
rather than inferred.

**And at the very end of the sheet, for a non-resident only:**
*"Is there a permanent establishment in India?"* — Yes/No.

### Block 6 · Regime

*"Do you wish to exercise the option under section 115BAC(6) of opting out of
the new tax regime? (default is No)"*

| Field | Rule |
|---|---|
| **Option for the current assessment year** | dropdown; the default is the new regime |
| Date of filing of Form 10-IE | `DD/MM/YYYY` — *only where business or professional income exists, which it does not on ITR-2; the field is present but not needed here* |
| Acknowledgement number of Form 10-IE | as above |

For ITR-2 the option is exercised in the return itself; the sheet's note says
so. Form 10-IE / 10-IEA belongs to ITR-3 and ITR-4.

### Block 7 · Seventh proviso to section 139(1)

*"Are you filing a return of income under the seventh proviso to section
139(1) but otherwise not required to furnish a return?"* — Yes/No.

On Yes, three flags with an amount each:

| Flag | Amount |
|---|---|
| Deposited over ₹1 crore in one or more current accounts | the amount |
| Spent over ₹2 lakh on foreign travel, for yourself or another | the amount |
| Spent over ₹1 lakh on electricity | the amount |

Then **clause (iv)** — *"Are you required to file under other conditions
prescribed under clause (iv)?"* — Yes/No, and on Yes a table of which condition
and the amount:

| Code | Condition |
|---|---|
| 1 | Sales, turnover or gross receipts in business over ₹60 lakh |
| 2 | Gross receipts in profession over ₹10 lakh |
| — | TDS and TCS in the year of ₹25,000 or more (₹50,000 for a senior citizen) |
| — | Deposits in savings accounts of ₹50 lakh or more |

### Block 8 · Other particulars

| Field | Rule |
|---|---|
| **Aadhaar number** | 12 digits, individuals only |
| Aadhaar enrolment id | 28 digits, only where the number is not yet allotted; *all the digits of the enrolment id and the date and time of enrolment* |
| **Benefit under section 115H?** | Yes/No — a resident who was a non-resident Indian in an earlier year and wants the concessional rates to continue on foreign-exchange assets |
| **Governed by the Portuguese Civil Code under section 5A?** | Yes/No — Goa, Dadra & Nagar Haveli, Daman & Diu; on Yes, Schedule 5A applies |
| Passport number | individuals, if available |
| **Are you an FPI?** | Yes/No; on Yes the **SEBI registration number** |
| **Filed by a representative assessee?** | Yes/No; on Yes: name · email · contact number · **capacity** (dropdown) · address · PAN · Aadhaar of the representative |
| **Legal Entity Identifier** | LEI number and valid-upto date, `DD/MM/YYYY` — **mandatory where the refund is ₹50 crore or more** |
| Permanent establishment in India | non-residents only, Yes/No |

### Block 9 · Directorships, unlisted shares, partnerships

Three questions, each opening a table on Yes.

**Director in a company at any time during the year?**

| Column | Options |
|---|---|
| Name of company | |
| Type of company | D — Domestic, F — Foreign |
| PAN | optional for a foreign company |
| Shares listed or unlisted | L / U |
| Director Identification Number | |

**Partner in a firm?**

| Column |
|---|
| Name of the firm |
| PAN |

**Held unlisted equity shares at any time during the year?** — the widest table
in Part A, one row per company:

| Group | Columns |
|---|---|
| Company | name · type (D / F) · PAN |
| Opening balance | number of shares · cost of acquisition |
| Acquired during the year | number · date of subscription or purchase · face value per share · issue price per share (fresh issue) · purchase price per share (bought from a holder) |
| Transferred during the year | number · sale consideration |
| Closing balance | number of shares · cost of acquisition |

Rows are addable. The schema makes the opening and closing balances mandatory
on every row, and the acquisition and transfer columns optional.

---

## 4 · What is mandatory, and what only opens on Yes

**Always mandatory** — the schema's `required` on `PersonalInfo` and
`FilingStatus`:

last name · PAN · status · date of birth · flat/door/block · locality · city ·
state · country · mobile with country code · email · secondary-address flag ·
filed-under section · regime option · seventh-proviso flag · residential status
· FPI flag · unlisted-shares flag · due date.

**Mandatory only when the switch is Yes:**

- revised / in-response-to-notice → receipt number and date, or DIN and date
- non-resident → conditions, jurisdictions with TINs, days in India, PE
- seventh proviso → the three flags and amounts, clause (iv) table
- FPI → SEBI number
- representative → all seven particulars
- director / partner / unlisted shares → every row's required columns
- refund ≥ ₹50 crore → LEI

Same all-or-nothing rule as the section-80 cards: off contributes nothing to
the JSON, on makes every field inside mandatory.

---

## 5 · How many can be added

| Table | Repeatable |
|---|---|
| Jurisdictions of residence | yes, unlimited |
| Clause (iv) conditions | yes |
| Directorships | yes, unlimited |
| Partnerships | yes, unlimited |
| Unlisted shareholdings | yes, unlimited — one row per company |
| Secondary address | one only |
| Representative | one only |

---

## 6 · What this means for the build

1. **Status drives the form.** Individual shows first/middle/last, date of
   birth, Aadhaar, passport, the nine residential conditions. HUF shows one name,
   date of formation, and hides the individual-only questions.
2. **Residential status drives three things** — the conditions dropdown, the
   non-resident sub-form (jurisdictions, days, PE), and, elsewhere in the return,
   which capital-gains heads and which Chapter VI-A deductions are open.
3. **Filing section drives the particulars** — revised wants a receipt and a
   date, a notice wants a DIN and a date, nothing else does.
4. **Every Yes/No opens a card** — seventh proviso, FPI, representative,
   director, partner, unlisted shares, LEI. Off is one line.
5. **The unlisted-shares table is the one to get right** — it is wide, every row
   has two mandatory pairs (opening and closing), and it is the thing the
   department cross-checks against the company's own filings.
6. **Dates are `DD/MM/YYYY` everywhere** — birth, original return, notice,
   Form 10-IE, subscription, LEI validity.
