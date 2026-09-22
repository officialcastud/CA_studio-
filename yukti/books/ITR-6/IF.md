# The book of Schedule IF — ITR-6, A.Y. 2026-27

Read row by row from the utility's **IF** sheet (8 rows, all visible), with the
hidden-row flags, the dropdowns and the cell formulas, and confirmed against the
schema block `ScheduleIF`. Item numbers are taken from the ITR-6 validation-rules
document (rules 33, 827, B10), never from counting rows.

---

## Schedule IF — Information regarding investment in unincorporated entities

*"Schedule IF — Information regarding investment in unincorporated entities."*
A company files this schedule when it is a **partner in a firm** or holds an
investment in any other **unincorporated entity** (partnership firm, LLP, AOP,
BOI). It discloses, for each such entity, the company's percentage share, its
share of the entity's profit, the interest due or received on its capital, and
its capital balance in the entity as on 31st March. The share of profit itself is
generally exempt in the company's hands (it was taxed in the firm's hands), while
the interest is business income — so the schedule is the source disclosure that
Schedule BP item **A5a** (share of income from firm) reconciles against.

### The shape — one repeatable block, the table of entities

**Header line**

| Row/Cell | Field | Rule |
|---|---|---|
| C1 | **Information regarding investment in unincorporated entities** | schedule title |
| B2 | **Number of entities in which investment is held** | count of the rows below; the VBA extends the table beyond the three shipped rows |

**The table — one row per entity, unlimited (three rows shipped, VBA adds more):**

| Col | Item | Label | Type / enum | Schema key |
|---|---|---|---|---|
| B (r3) | Sl.No. | **Sl.No.** | serial | — |
| C | — | **Name of the entity** | text, max 125, required | `FirmName` |
| D–E | — | **Type of the entity** | text, max 125, required | `FirmType` |
| F | — | **PAN of the entity** | PAN, max 10, required | `FirmPAN` |
| G | — | **Whether the entity is liable for audit?(Yes/No)** | dropdown **(Select) / Yes / No** | `IsLiableToAudit` |
| H | — | **Whether section 92E is applicable to entity? (Yes/No)** | dropdown **(Select) / Yes / No** | `Sec92EFirmFlag` |
| I | — | **Percentage Share in the profit of the entity** | number 0–100, required | `ProfitSharePercent` |
| J | i | **Amount of share in the profit** | integer, required | `ProfitShareAmt` |
| K | ii | **Amount of interest due or received** | integer ≥ 0 | `IntrstAmtDueOrRecv` |
| L | iii | **Capital balance as on 31st March in the entity** | integer, required | `FirmCapBalOn31Mar` |
| B8 | — | **Total amount of share in profit** | computed = Σ column J | `TotalProfitShareAmt` |

The column heads J/K/L carry the item numbers **i / ii / iii** (row 4 of the
sheet). There is a companion total for the capital-balance column,
`TotalFirmCapBalOn31Mar`, computed as Σ column L (the schema marks it required
alongside `TotalProfitShareAmt`, though the display sheet only prints the profit
total on row 8).

### The dropdowns

| Column | Values |
|---|---|
| G — liable for audit | **(Select)**, **Yes**, **No** |
| H — section 92E applicable | **(Select)**, **Yes**, **No** |

### Schema

`ScheduleIF` — `PartnerFirmDetails[]` (one object per entity) with `FirmName`,
`FirmType`, `FirmPAN`, `IsLiableToAudit`, `Sec92EFirmFlag`, `ProfitSharePercent`,
`ProfitShareAmt`, `IntrstAmtDueOrRecv`, `FirmCapBalOn31Mar`; then the two totals
`TotalProfitShareAmt` and `TotalFirmCapBalOn31Mar`.

Required on each entity object: `FirmName`, `FirmType`, `FirmPAN`,
`ProfitSharePercent`, `ProfitShareAmt`, `FirmCapBalOn31Mar`. `IsLiableToAudit`,
`Sec92EFirmFlag` and `IntrstAmtDueOrRecv` are optional. The block's own required
leaves are `TotalProfitShareAmt` and `TotalFirmCapBalOn31Mar`.

### The rules the sheet carries

- **B8 = Σ J** (`TotalProfitShareAmt`) — the total of "Amount of share in the
  profit" across all entities.
- **`TotalFirmCapBalOn31Mar` = Σ L** — total capital balance as on 31st March.
- Rule **B10**: the total of the "Amount of interest due or received" column must
  equal item **14xi(b)** of the statement of Profit and Loss (the interest
  received from firms credited in the P&L).
- Rule **827** (Category A): in Schedule BP, Sl. No. **A5a** — Share of income
  from firm(s) — or **A5b** — Share of income from AOP/BOI — cannot be more than
  the **"Amount of share in the profits"** column of Schedule IF.
- Rule **33** (Category A): if the due date **30th November** is selected in Part
  A-General, Schedule IF information (or the audit details) must be filled — a
  company with a firm interest that triggers the audit-case due date must
  disclose the interest here.

### Cross-sheet feeds

| Flows | To |
|---|---|
| `TotalProfitShareAmt` / per-entity `ProfitShareAmt` | Schedule BP item **A5a / A5b** (share of income from firm / AOP-BOI) — capped by rule 827 |
| Σ `IntrstAmtDueOrRecv` | statement of P&L item **14xi(b)** — reconciled by rule B10 |
| existence of a firm interest | Part A-General audit-case due date (rule 33) |

### What is mandatory

Per entity: the name, type, PAN, percentage share, amount of share in profit and
the 31st-March capital balance. Block totals `TotalProfitShareAmt` and
`TotalFirmCapBalOn31Mar` are always written.

### Hidden rows

None. Every row of the IF sheet (1–8) is visible.

### What this means for the build

A single repeatable table: eight per-row fields (two of them Yes/No dropdowns,
the rest text/number), with the two column totals computed and untypeable. A
check that BP A5a/A5b does not exceed the profit-share column (rule 827) and that
the interest total ties to P&L 14xi(b) (rule B10). Export
`ScheduleIF.PartnerFirmDetails[]` only when at least one entity is entered, with
both totals present even at zero.
