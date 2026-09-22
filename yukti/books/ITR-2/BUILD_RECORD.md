# How Yukti ITR-2 was built — the complete record

Every step, in the order it happened, with the source it read, the tool that
did it, the check that verified it, and — where we got it wrong — the mistake
and the test that finally caught it. Written so the same process can be run
by a machine for ITR-1, 3, 4 and the rest.

---

## 0 · The inputs, and what each one is for

| Input | File | What it gives | What it cannot give |
|---|---|---|---|
| **The government utility** (Excel) | `ITR-2 Utility AY 2026-27 v1.4.xlsm` → unzipped to `i2/` | Every sheet's rows, labels, item numbers, dropdowns, **hidden-row flags**, formulas, and the VBA (auto-populate, validators, month counting) | Which rows apply to *this* form — you must read the hidden flag on every row |
| **The JSON schema** | `ITR-2_2026_Main_V1_2.json` (206 definitions) | The exact keys, enums, maxima, required lists, array limits — the only thing the portal actually reads | The meaning of a field, or which item on the sheet it corresponds to |
| **The validation rules** | `CBDT e-Filing ITR 2 Validation Rules AY 2026-27 v1.0.pdf` (764 A + 26 D) | Cross-schedule arithmetic, conditional presence, caps, the **official item numbering** (A1e, A2e, A3a …) | How to compute anything — only what must be true afterwards |
| **The form's instructions** (not used this time) | — | Legal rules the utility computes silently | — |

Three sources, three different truths. The utility says *what the sheet
shows*. The schema says *what the file must contain*. The rules say *what must
agree*. A build is correct only when all three are satisfied at once.

---

## 1 · The method — one loop, run per schedule

```
READ the sheet row by row (every column, hidden flags, dropdowns, formulas)
  → WRITE the book (a markdown document of every item, rule, repeat, enum)
    → VERIFY the book against the schema and the sheet, mechanically
      → BUILD from the book: state · engine · screen · export · import · checks
        → TEST: hand-computed case → Playwright → schema validation → rule replay → round-trip
          → FIX until zero errors on every gate
```

The book is the contract. Nothing was built from memory of the law; every
field came off a sheet row or a schema key with a reference back.

---

## 2 · The steps, in the order they were done

### Step 1 — Extract the utility
- `unzip` the `.xlsm` into `i2/`. Read `xl/workbook.xml` for the sheet list and
  `xl/_rels/workbook.xml.rels` for the sheet-name → file-name map.
- Build `dump.py`: for a sheet, print every row as `rN[H]: [cell] text | …`
  with **H marking a hidden row**, plus a `--formulas` mode that prints `<f>`
  cells, plus `tree(defname)` that walks a schema definition through its
  `$ref` / `allOf` chains and prints keys, types, enums, `required`, `maxItems`,
  `maxLength`.
- Extract the workbook's **named ranges** (`definedName`) — they are how one
  sheet's formulas refer to another's cells (`HP.REStwolakh`,
  `cyla.TotHPlossCurYr`, `IT_Sat_1`).
- Extract the **VBA** (`xl/vbaProject.bin`) as latin-1 text and grep it —
  compressed in places, but procedure names, validators, and comments
  ("NEWLY ADDED BY BINDU 19 Feb 25") are readable.

### Step 2 — Extract the schema
- Parse the JSON schema; resolve every definition; list the 46 top-level
  blocks with their `required` flags; generate a **required-key skeleton**
  (`SKEL`) so no required key can ever be missing from an export.
- Pull every enum with its description into `full_enums.json` (TDS sections,
  SI codes, EI sub-categories, country codes, nature-of-salary lists) — so no
  dropdown is ever hand-typed.

### Step 3 — Extract the rules
- `pdftotext -layout` first; when the number column defeated it, `pymupdf`
  word coordinates: numbers at x < 110 define row bands; text at x ≥ 110 is
  assigned to the band it falls in. Category switch on the page where
  "Category B/D" appears (page ≥ 40 — the contents page mentions it too).
- Result: `rules.json`, 764 A + 26 D, numbering continuous — verified.

### Step 4 — Design the shell (once, for all forms)
- One continuous sheet, left index, collapse/open at every level, maroon on
  white, red **label** text for mandatory, dates `DD/MM/YYYY` on the field
  and in every date column, dustbin to delete, all-or-nothing cards, computed
  cells green and untypeable, every override behind the sheet's own switch.
- Six renderers: `row`, `inp`/`sel`/`dte`, `grid`, `fold`, `card`, `blk`.
  State is one plain object `S`; `compute()` rebuilds `S.C.*` in one pass; the
  DOM is a projection. No server, no dependencies, one HTML file.

### Step 5 — Per schedule: read → book → verify → build → test
Done in this order, each one a full loop:

| # | Schedule | Sheet | Book file | What the sheet-read settled |
|---|---|---|---|---|
| 1 | Part A General | PART A – General | `PartA_General_book` | nine residential conditions, jurisdictions, unlisted-share table, LEI, PE |
| 2 | Schedule S | Schedule S | `build_plan` (salary section) | per-employer blocks, 89A country split; **later: the 17(1)/(2)/(3) nature breakups** |
| 3 | Schedule CG | CG (541 rows) | `Schedule_CG_book` | six parts; land repeatable, everything else aggregate; Part D per-section columns; Table E's three hidden versions; Table F editable |
| 4 | Schedule OS | OS (124 rows) | `Schedule_OS_book` | the 1-to-9 working; 57's three conditions and the 20% cap; the DTAA row's two classification fields |
| 5 | Schedule HP | House Property | `Schedule_HP_book` | the 24(b) loan table lives *inside* each property; HRA is in salary, not HP |
| 6 | Schedule VI-A + 80x | VI-A + eleven sub-sheets | `Deductions_verification` | 10AA is hidden — delete; `ub` has no schema key — delete; the 80D four-block form |
| 7 | CYLA · BFLA · CFL | CYLA – BFLA, CFL | `CYLA_BFLA_CFL_book` + **`build_spec`** | the eleven live rows; the **order** of set-off from the S/O and U/Q formula chains; the lapse rule in `G25` |
| 8 | Taxes paid | TDS, IT | `book_01` | TDS 2/3 are thirteen columns; TCS codes are 1/2; advance vs SAT is by date |
| 9 | SPI · SI | SPI – SI | `book_02` | the twelve-step exemption walk; the three-way ₹1.25L share |
| 10 | AMT · AMTC | AMT (hidden), AMTC | `book_03` | on ITR-2 only 80QQB/80RRB trigger AMT, above ₹20L |
| 11 | PTI · ESOP · 5A | PTI, ESOP, Sch 5A | `book_04` | PTI's share-of-loss column; ESOP's three events |
| 12 | EI | EI | `book_05` | nine categories, fifty-two sub-categories, dependent dropdown |
| 13 | FSI · TR · FA | FSI, TR_FA | `book_06` | FA has nine tables on the calendar year |
| 14 | AL | AL | `book_07` | mandatory above ₹1 crore |
| 15 | Part B-TI · TTI | Part B – TI TTI + hidden Tax Calculated | `book_08` | VI-A capped at GTI − special; agri for rate only above the exemption; 87A with marginal relief; two-component surcharge with cutoff comparison |
| 16 | Interest | Tax Calculated rows 1–16, 64–92, 94–289 | `book_09` + `Interest_verification` | 234B's monthly cycle with interest-first challans; 234C on cumulative quarterly income with a fifth slot; matchedSAT is SAT to the due date |

### Step 6 — The export (`buildITR2`)
- Start from the skeleton; `put()` every value onto the schema's key; write a
  block only when it carries a value; write every required total even at zero.
- Then the three gates that existed from the start: the working checks →
  the shape audit (`auditShape`: required keys present, nothing unexpected) →
  the arithmetic audit (`auditRules`: totals add up).

### Step 7 — The import (`importReturn`)
- The exact inverse of the export, all 45 blocks — so a return JSON from
  Yukti, from any other software, or the portal's prefill loads back into
  every field. Reconciliation where the JSON is coarser than the screen (B9's
  one deduction slot → the section Part D says).

### Step 8 — The rule engine (`runRules`)
- 429 of 764 Category A rules and 10 of 26 D, coded on the JSON, each with its
  serial. A stops the export; D lets it through with the list of forms that
  must follow. Also shown live in the verification section.

### Step 9 — The full test return
- `sudhir_state.js`: every schedule, every table, every card populated for
  one person. Exported; 45 of 46 blocks (the 46th is FII-only). Round-tripped
  through the working file and through the return JSON — byte-identical.

---

## 3 · The verification harness — what exists and what it proves

| Test | File | Proves |
|---|---|---|
| Syntax | `node --check` on the extracted `<script>` | the file parses |
| Hand computation | inline Python next to each Playwright run | the engine's figure equals the law's figure on a chosen case |
| Playwright scenario | `tt6` … `tt15.py` | load a state, paint, read `S.C.*`, click export, capture the file, catch page errors |
| Schema validation | `jsonschema.Draft4Validator` against the real schema | zero errors — the portal will *parse* it |
| Content audit | walk every array in the JSON | every table has rows; 58 arrays populated |
| Rule replay | `rules43.py` (the 43 reported) and `runRules` (429) | the portal will *accept* it |
| Round-trip | `rt.py`, `rt2.py`, `ui_rt.py` | save → open → re-export identical; return JSON → import → re-export identical; typed through the UI |
| Screenshots | `view` on `.png` | the screen shows what the book says |

Every fix in this project was followed by all of these. Nothing was declared
done on the strength of the code alone.

---

## 4 · The mistakes, and the check that catches each

This is the section an automation must be built around. Every one of these
was made by reading carefully and still getting it wrong.

| # | The mistake | How it happened | What caught it | The check to automate |
|---|---|---|---|---|
| 1 | **Slump sale read as A2/B2**, shifting every capital-gain head by one | the row was **hidden** and I read past the flag | the 43 portal errors; rules A573/574/163/164 give the composition | **never build a hidden row**; diff every head's item number against the rules document's numbering before building |
| 2 | Table E built on nine rate slots | three versions of the table on the sheet; two hidden | the schema has six slots | build only the live version; cross-check slot set against schema `required` |
| 3 | Part D given the same seven columns for every section | didn't read each section's row separately | schema errors on export | one column set per section, from its own row |
| 4 | CYLA/BFLA/CFL **ported from ITR-6** | reused an engine instead of reading the sheet | wrong slots, wrong rules (OS loss carried when it lapses) | **never port**; read the formulas and VBA of *this* form |
| 5 | The 17(1)/(2)/(3) nature breakups **never built** | they aren't visible items on the sheet; they're schema arrays | portal rules A32–34 | enumerate every schema array under a block and ask "where is this on screen?" |
| 6 | Section 10AA card built | the sheet is hidden; the key isn't in the schema | verification against the schema | every card must map to a schema key that exists for *this* form |
| 7 | `ub` "any other deductions" built | a live sheet row with **no schema key** | export could not carry it | a live row without a schema key cannot be filed — drop it and say so |
| 8 | Field written, then the object `return`ed before the next lines ran | ordinary coding slip in 80G | rule replay | rule engine on every export |
| 9 | Three stale export lines overwriting the AMT surcharge with zeros | a splice left old lines beneath new ones | reading the exported figures by hand | after every splice, grep for duplicate `put()` on the same key |
| 10 | B-TI capital-gain lines set to BFLA, then rules 565/566 encoded the same wrong way | assumption carried into the test | the rule's own text says Table E | encode a rule from its **text**, never from what the engine already does |
| 11 | Table F equal to Table E instead of BFLA | assumption | rules A577/578 | same |
| 12 | `matchedSAT` as SAT before *filing* instead of before the *due date* | assumed the case law, not the utility | reading the IT sheet's helper columns | read the helper columns; they encode the rule |
| 13 | 234C on whole-year tax instead of cumulative quarterly | didn't read rows 117–130 | verification against the Tax Calculated sheet | read the hidden computation sheet, not only the display sheet |
| 14 | Import only read PAN/name/address from a return JSON | the prefill reader was mistaken for an importer | user report | round-trip test: return JSON → import → re-export must be identical |
| 15 | The old regime allowed after the due date in test data | didn't know rule A21 | rules document | the rules document *before* the test data, not after |
| 16 | `DeductedYr` set on current-year TDS rows | didn't read the enum's range | schema | every enum's range read before seeding a default |
| 17 | 112A post-2018 rows carried shares and price | didn't read the sheet's column-6 header | rule A173 | headers are rules; read the whole header text |

The pattern: **every error was in a place where one source was read and the
other two weren't.** The utility without the schema (1, 3, 6, 7); the schema
without the rules (5, 10, 11); memory instead of the source (4, 12, 13, 15).

---

## 5 · What is reusable, unchanged, for the next form

- `dump.py` — sheet reader with hidden flags, formula mode, schema tree
- the rules-PDF parser (pymupdf coordinates)
- the shell: CSS, the six renderers, `paint`, the event system, save/open,
  the export gate, the rules panel
- `runRules` — the engine shape; the rule *bodies* are per form
- the test harness pattern: state file → Playwright → schema → rules → round-trip
- the book template: shape · items · rules · repeats · mandatory · diff vs
  ITR-1 · what it means for the build

What is **not** reusable: any engine. ITR-3's CYLA has the business rows;
ITR-1's has none. Each form's engine comes from its own sheet's formulas.

---

## 6 · The numbers

| | |
|---|---|
| sheets read row by row | 31 |
| books written | 12 |
| schema blocks built | 45 of 46 (the 46th is FII-only) |
| validation rules coded | 429 A + 10 D |
| Playwright test scripts | 15 |
| hand-verified computations | 14 cases |
| times zero-error status was reached and then broken by the next change | 9 |
| final state | zero schema errors · zero Category A · byte-identical round-trips |
