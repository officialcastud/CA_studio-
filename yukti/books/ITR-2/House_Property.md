# The book of Schedule HP — Income from House Property · ITR-2, A.Y. 2026-27

Read row by row from the utility's **House Property** sheet (75 rows, both
shipped blocks, every dropdown) and confirmed against the CBDT ITR-2 schema's
`ScheduleHP`. Nothing here is invented.

---

## 1 · The shape — one block per property, unlimited, then two lines

Schedule HP is a **repeating block**. The sheet ships two — 1A and 1B — and the
VBA adds more (`AddProperty`). The schema's `PropertyDetails` array is
**unlimited**. After the last block come two lines that apply to the whole
head.

| Part | What it is |
|---|---|
| **1A, 1B, 1C …** | one block per property — address, ownership, tenants, the rent working, the section 24(b) loan table, the property's income |
| **2** | pass-through income or loss under this head |
| **3** | **income under the head** — Σ1k + 2; *if negative, to 2(i) of Schedule CYLA* |

That is the whole schedule. There is no separate "Schedule 24(b)" — the loan
table sits **inside each property block**, one table per property. And the
house-rent-allowance working (Schedule EA 10(13A)) is **not part of HP at all**
on ITR-2; it belongs to salary.

ITR-1 capped this at two properties. ITR-2 does not.

---

## 2 · One property block, field by field

### Block header — the property

| Field | Type | Rule |
|---|---|---|
| **Address of property** | text, max 50 | required |
| **Town / City** | text, max 50 | required |
| **State** | dropdown, 38 codes | required |
| **Country** | dropdown, 250 codes | required |
| PIN code | 6 digits | for India |
| Zip code | text | for a property abroad |

### Ownership

| Field | Options | Rule |
|---|---|---|
| **Owner of the property** | SE — Self · MI — Minor · SP — Spouse · OT — Others | required |
| *If Others, specify* | text | opens on OT (`PropertyOwnerOther`) |
| **Is the property co-owned?** | Yes / No | required |
| **Your percentage share** | number, max 100 | required — 100 when not co-owned |

**Co-owners table** — opens on Yes, one row per other co-owner, **unlimited**:

| Column | Rule |
|---|---|
| Name of the other co-owner | required |
| PAN of the co-owner | 10 characters |
| Aadhaar of the co-owner | 12 digits |
| Percentage share | the shares across all co-owners, with your own, should total 100 |

### Type of house property

**Type** — dropdown: **Self Occupied · Let Out · Deemed Let Out**. The schema
codes are `S`, `L`, `D`. This one answer changes the whole working below it.

**Tenants table** — for a let-out property, one row per tenant, **unlimited**:

| Column | Rule |
|---|---|
| Name of the tenant | required |
| PAN of the tenant | if available |
| Aadhaar of the tenant | if available |
| PAN or TAN of the tenant | **if TDS credit is claimed** — needed to match Schedule TDS |

### The rent working — items a to k

| Item | Field | Kind | Rule |
|---|---|---|---|
| **a** | Gross rent received or receivable, or lettable value | amount | required; **nil for self-occupied** |
| **b** | The amount of rent which cannot be realised | amount | |
| **c** | Tax paid to local authorities | amount | |
| **d** | Total (1b + 1c) | **computed** | |
| **e** | Annual value (1a − 1d) — *nil if self-occupied etc. under section 23(2)* | **computed** | |
| **f** | Annual value of the property owned — **your percentage share × 1e** | **computed** | this is where the co-ownership share bites |
| **g** | 30% of 1f | **computed** | the standard deduction |
| **h** | Interest payable on borrowed capital | **computed from the 24(b) table** | *"Cannot exceed 2 lacs if not let out"* — the sheet says it on the line |
| **i** | Total (1g + 1h) | **computed** | |
| **j** | Arrears or unrealised rent received during the year, less 30% | amount | the person enters the amount received; 70% is taken |
| **k** | **Income from house property** — 1f − 1i + 1j | **computed** | for a self-occupied house, effectively 0 − 1h |

### Section 24(b) — interest on borrowed capital, one table per property

The table that feeds item h. 5 rows shipped per property (`i` to `vii` columns),
**unlimited**:

| Column | Rule |
|---|---|
| **Loan taken from** | dropdown: **Bank · Other than Bank** — schema `B` / `I` |
| **Name of the bank, institution or person** | required |
| **Loan account number** of the bank or institution, or a reference number | required |
| **Date of sanction of the loan** | `DD/MM/YYYY`, required |
| **Total amount of the loan** | required |
| **Loan outstanding as on the last date of the financial year** | required — i.e. on 31 March 2026 |
| **Interest on borrowed capital under section 24(b)** | required — the year's interest on this loan |
| **Total interest under 24(b)** | **computed** — Σ of the rows — this is item h |

Every column is required on every row: the schema's `Section24BDtls` item
marks all seven required. All-or-nothing, like the 80G donees.

---

## 3 · The rules the working enforces

### Self-occupied — section 23(2)
Annual value is **nil**, so a to g all come to nothing and the only figure is
the interest. The sheet's own note on item h: *"Cannot exceed 2 lacs if not let
out."* Under the old regime, interest on a self-occupied house is allowed up to
₹2,00,000, so 1k is at most a loss of ₹2,00,000. **Under the new regime,
section 115BAC(2) disallows it entirely** — 1k is nil.

Two properties may be self-occupied (section 23(4), from AY 2020-21); any
further self-occupied property is treated as **deemed let out**.

### Let out and deemed let out
The full working runs. No ceiling on interest against a let-out property. A
deemed-let-out property is one the person owns and does not occupy or let — the
notional rent is its lettable value.

### Co-ownership
Item f applies the share **after** the annual value is computed, so the rent,
unrealised rent and local taxes are entered **in full** for the property, and
the share is applied once. Interest at h is the person's own share of the
interest (the loan table is the person's own loans).

### The loss cap — section 71(3A)
A loss under this head (Σ1k + 2 negative) goes to **2(i) of Schedule CYLA**,
where it may be set against other heads **only up to ₹2,00,000** in the year;
the rest carries forward under CFL for eight years, against house-property
income only. Under the new regime the loss cannot be set against other heads at
all, and (per the ITR-1 utility's formula) does not reach gross total income.

---

## 4 · Item 2 — Pass-through income or loss

One figure. Income from a business trust or investment fund that is house
property in nature, from Schedule PTI.

## 5 · Item 3 — Income under the head

**Σ1k across all properties + 2.** The schema's `TotalIncomeChargeableUnHP` —
the only field the schema marks required on `ScheduleHP` itself. *If negative,
the figure goes to 2(i) of Schedule CYLA.*

---

## 6 · How many can be added

| Where | Repeatable? |
|---|---|
| **Property blocks** | **yes — unlimited** (the sheet ships 2, the VBA adds more, the schema has no maximum) |
| Co-owners inside a block | **yes, unlimited** |
| Tenants inside a block | **yes, unlimited** |
| Section 24(b) loans inside a block | **yes, unlimited** — 5 rows shipped |
| Item 2 pass-through | one figure |

---

## 7 · What is mandatory

**On every property** (the schema's `required` on a `PropertyDetails` item):
serial number · address · city · state · country · owner · co-owned flag ·
your share · type (S / L / D) · and in the rent working: annual lettable value ·
total of unrealised and tax · balance annual value · annual value of the
property owned · 30% · total deductions · income of the property.

**On every co-owner row:** serial and name.
**On every tenant row:** serial and name.
**On every loan row:** all seven columns.

**On the schedule:** `TotalIncomeChargeableUnHP`.

Everything else — PAN and Aadhaar of co-owners and tenants, the PAN/TAN for a
TDS claim, unrealised rent, local taxes, interest, arrears, pass-through — is
written only when it carries a value.

---

## 8 · What ITR-2's House Property has that ITR-1's does not

| | ITR-1 | ITR-2 |
|---|---|---|
| Number of properties | two | unlimited |
| Co-owners | share only | full table — name, PAN, Aadhaar, share of each |
| Tenants | name and PAN | name, PAN, Aadhaar, and PAN/TAN for a TDS claim |
| Interest | one figure | **a loan-by-loan table** per property — lender, account, sanction date, loan, outstanding, interest |
| Pass-through | absent | item 2 |
| Owner "Others" | no | with a specify field |
| Property abroad | no | country and zip code |

---

## 9 · What this means for the build

1. **One collapsible block per property, unlimited**, each with a dustbin, each
   collapsing to *"Property 1 — address · Let out · ₹45,600"*.
2. **Type drives the working** — self-occupied greys out a to g and shows only
   the interest with its ₹2 lakh ceiling (or nil under the new regime); let out
   and deemed let out run the full a to k.
3. **The 24(b) loan table lives inside the block**, all seven columns
   mandatory per row, summing into item h — no separate schedule.
4. **Co-owners and tenants are tables inside the block**, opening on the
   co-owned answer and the let-out type respectively.
5. **The share is applied at f, not at a** — rent and taxes entered in full.
6. **The loss goes to CYLA with the ₹2 lakh cap**, and the balance to CFL;
   under the new regime it goes nowhere.
7. **Third self-occupied property becomes deemed let out** — a check, not a
   silent recomputation.
8. **The HRA working is not here** — it stays in salary where the form puts it.
