# CA Software (Vaarta) — agent briefing

**Read this file first. Do not re-scan the whole repo every session.**

---

## How Claude should work here

1. **Read only what the task needs:**
   - This file (always)
   - `src/entities/README.md` (entity roadmap)
   - **Active entity spec:** `src/entities/private-limited/SPEC.md` (Phase 1 — only entity with a full module today)
2. **Do not** re-explore `src/app/company/[id]/` route-by-route unless the task is routing/UI-wide.
3. **Do not** start other entity folders (`llp/`, `trust/`, …) until Private Limited Phase 1 is done.
4. **Plan before code:** state which layer you touch (`entityConfig` nav vs `entities/` domain vs shared journal).
5. Small diffs; `npm run lint` after TS changes.

---

## What we are building

Indian **CA bookkeeping** app (offline-first, browser `localStorage`). Per **company** with a legal **entity type** (`pvt_ltd`, `partnership`, `trust`, …).

- **Shared core:** journal, registers UI, P&L/BS computes, GST, AI agent, exports.
- **Per entity type:** own folder under `src/entities/<name>/` + own `src/lib/entityConfig/<name>.ts` nav spec.

**Product strategy:** build **Private Limited first**, completely and in detail; then clone the pattern for other types.

---

## Build plan (entity-first)

| Phase | Focus | Spec file |
|-------|--------|-----------|
| **1 — NOW** | Private Limited (`pvt_ltd`) | `src/entities/private-limited/SPEC.md` |
| 2 | OPC | (create `entities/opc/SPEC.md` when started) |
| 3 | Public Ltd | … |
| 4–12 | LLP, partnership, sole prop, HUF, trust, society, Sec 8, AOP/BOI, cooperative | See `src/entities/README.md` |

Full table: **`src/entities/README.md`**.

---

## Architecture (two layers per entity)

```
company.entity_type
        │
        ├─► lib/entityConfig/pvtLtd.ts     … which screens appear (Sidebar)
        │
        └─► entities/private-limited/      … laws, classification, compliance, IFC, registers
                init.ts → upsertEntityData(companyId, 'pvt_ltd', section, data)
                usePvtLtdData.ts           … React access (pattern for other entities)
```

**Journal (all entities):** `offlineDb` → `journal_entries` · hook `useJournalEntries` · sync `journalSync.ts`  
**Do not** put journal rows inside `entities/private-limited/`.

---

## Stack & run (unchanged facts)

- **Vite + React 19 + React Router** — not Next.js (`README.md` is wrong).
- App root: `the restarted version/claude/`
- Dev: `npm run dev` → **http://localhost:1066**
- AI local: `GEMINI_API_KEY` or `VITE_GEMINI_API_KEY` in `.env`
- Same host always (`localhost` vs `127.0.0.1` = different data).

---

## Shared core — pointers only

| Concern | Location |
|---------|----------|
| Companies + journal + entity_data | `src/lib/offlineDb.ts` (`ca_offline_db_v2`) |
| List/filter journal | `useJournalEntries` → `fetchJournalEntries` (no stale cache) |
| Manual entry | `src/components/entries/ManualEntryDialog.tsx` · `parseManualAmount` |
| AI entries | `src/app/company/[id]/ai/page.tsx` · persist with `company.id` |
| Entity init on create | `src/entities/initEntity.ts` |
| Entity type labels | `src/lib/constants/entityTypes.ts` |
| Routes | `src/routes.tsx` |

---

## Pvt Ltd — what exists today

**Folder:** `src/entities/private-limited/`

| Submodule | Purpose |
|-----------|---------|
| `classification/` | Size, Ind AS, audit flags, filings |
| `compliance/` | Compliance calendar |
| `ifc/` | IFC/ICFR package |
| `registers/` | Statutory registers metadata |
| `filings/` | Filing trackers |
| `audit/` | DRS / CARO flags |
| `schedule-iii/` | Notes, ratios, disclosures |
| `init.ts` | Seeds all `entity_data` sections |

**Detail:** `src/entities/private-limited/SPEC.md`.

---

## Demo / legacy data (removed)

- **Do not** call `ensureVarataxSeedData()` on startup (was injecting ~500 demo journal rows).
- One-time cleanup: `purgeLegacyAppDataOnce()` in `main.tsx` removes old `localStorage` keys and Varatax demo seed company.
- Re-run cleanup: delete browser key `ca_legacy_data_purged_v2` and refresh.

---

## Agent rules (short)

- Hooks before any conditional `return`.
- Journal writes: `company.id` as `company_id`; emit sync events.
- Balance tolerance UI ≈ `validation.ts` (₹0.05).
- Nav change → `entityConfig` file; law/compliance change → `entities/` folder.
- No new dependencies without ask.

---

## User phrases

| Says | Means |
|------|--------|
| “Connect journal and AI” | Same `offlineDb`; `useJournalEntries` refresh; same `company_id` |
| “Build pvt ltd” / “private limited” | Phase 1 only — read `private-limited/SPEC.md` |
| “Add LLP feature” | **Stop** — LLP is Phase 4; confirm user wants to pause Phase 1 |

---

## Workspace root

Parent folder has GST PDFs, Excel, zips — not the app. App code only under `the restarted version/claude/`.
