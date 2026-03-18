/**
 * Per-company account name list for the dropdown.
 *
 * Behaviour:
 *   - No query  → show BASIC_COA (77 accounts) + previously used accounts from journal entries
 *   - Typing    → search full 520 MASTER_COA + journal entries; basic results listed first
 *   - New name  → AccountComboBox shows "Create new account" option → classification dialog
 */

import { listJournalEntries } from '@/lib/offlineDb';
import { MASTER_COA } from '@/lib/masterCOA';
import { BASIC_COA, BASIC_COA_SET } from '@/lib/basicCOA';

export function normalizeAccountName(name: string): string {
  return name.trim().replace(/\s+/g, ' ');
}

function keyOf(name: string): string {
  return normalizeAccountName(name).toLowerCase();
}

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

/** Names from journal entries for this company (user-created). */
function getJournalAccountNames(companyId: string): string[] {
  if (!isBrowser() || !companyId) return [];
  const names: string[] = [];
  const seen = new Set<string>();
  for (const entry of listJournalEntries(companyId)) {
    for (const line of entry.lines) {
      const normalized = normalizeAccountName(line.account_name || '');
      const key = normalized.toLowerCase();
      if (!normalized || seen.has(key)) continue;
      seen.add(key);
      names.push(normalized);
    }
  }
  return names;
}

/** Full 520 names from MASTER_COA as a lookup set. */
const MASTER_COA_SET = new Set(MASTER_COA.map(a => a.name.toLowerCase()));
const MASTER_COA_NAME_BY_KEY = new Map(MASTER_COA.map(a => [keyOf(a.name), a.name] as const));

/**
 * If an account already exists (in master COA or this company's used accounts),
 * return the canonical existing name; otherwise return null.
 *
 * Canonicalization is case-insensitive and whitespace-insensitive.
 */
export function findExistingAccountName(companyId: string, name: string): string | null {
  const key = keyOf(name);
  if (!key) return null;

  const master = MASTER_COA_NAME_BY_KEY.get(key);
  if (master) return master;

  for (const used of getJournalAccountNames(companyId)) {
    if (keyOf(used) === key) return used;
  }

  return null;
}

/**
 * Returns accounts to show in the dropdown.
 *
 * @param companyId  — company whose journal entries are merged in
 * @param query      — current search string (empty = show basic list)
 * @returns { basic: string[], extended: string[], isNew: boolean }
 *   basic    — matches within the 77 basic accounts + used journal accounts
 *   extended — additional matches from the full 520 (shown after a divider)
 *   isNew    — true when query is non-empty and not found anywhere
 */
export function searchAccounts(
  companyId: string,
  query: string
): { basic: string[]; extended: string[]; isNew: boolean } {
  const journalNames = getJournalAccountNames(companyId);
  const q = query.trim().toLowerCase();

  if (!q) {
    // No query: show basic + previously used journal accounts (deduped)
    const usedSet = new Set(BASIC_COA_SET);
    const usedBasic = [...BASIC_COA];
    const extraJournal: string[] = [];
    for (const name of journalNames) {
      if (!usedSet.has(name.toLowerCase())) {
        usedSet.add(name.toLowerCase());
        extraJournal.push(name);
      }
    }
    return {
      basic: [...usedBasic, ...extraJournal.sort((a, b) => a.localeCompare(b))],
      extended: [],
      isNew: false,
    };
  }

  // With query: search everything
  const basicMatches: string[] = [];
  const extendedMatches: string[] = [];
  const seen = new Set<string>();

  // 1. Basic COA matches ordered by relevance:
  //    exact match → prefix match → contains (using BASIC_COA's natural order)
  const basicExact: string[] = [];
  const basicPrefix: string[] = [];
  const basicContains: string[] = [];
  for (const name of BASIC_COA) {
    const lc = name.toLowerCase();
    if (!lc.includes(q)) continue;
    if (lc === q) basicExact.push(name);
    else if (lc.startsWith(q)) basicPrefix.push(name);
    else basicContains.push(name);
    seen.add(lc);
  }
  basicMatches.push(...basicExact, ...basicPrefix, ...basicContains);

  // 2. Journal account matches (used by this company) – same exact→prefix→contains ordering
  const journalExact: string[] = [];
  const journalPrefix: string[] = [];
  const journalContains: string[] = [];
  for (const name of journalNames) {
    const lc = name.toLowerCase();
    if (seen.has(lc) || !lc.includes(q)) continue;
    if (lc === q) journalExact.push(name);
    else if (lc.startsWith(q)) journalPrefix.push(name);
    else journalContains.push(name);
    seen.add(lc);
  }
  basicMatches.push(...journalExact, ...journalPrefix, ...journalContains);

  // 3. Full MASTER_COA matches (not already in basic), same relevance ordering
  const masterExact: string[] = [];
  const masterPrefix: string[] = [];
  const masterContains: string[] = [];
  for (const account of MASTER_COA) {
    const lc = account.name.toLowerCase();
    if (seen.has(lc) || !lc.includes(q)) continue;
    if (lc === q) masterExact.push(account.name);
    else if (lc.startsWith(q)) masterPrefix.push(account.name);
    else masterContains.push(account.name);
    seen.add(lc);
  }
  extendedMatches.push(...masterExact, ...masterPrefix, ...masterContains);

  const totalMatches = basicMatches.length + extendedMatches.length;
  // "New account" should be offered whenever the canonical name doesn't already exist
  const hasExisting = !!findExistingAccountName(companyId, query);
  const isNew = q.length > 0 && !hasExisting;

  return { basic: basicMatches, extended: extendedMatches, isNew };
}

/** Legacy: returns a flat sorted list of all account names (used by export etc.) */
export function getAccountNames(companyId: string): string[] {
  const names = new Map<string, string>();
  for (const a of MASTER_COA) names.set(a.name.toLowerCase(), a.name);
  if (isBrowser() && companyId) {
    for (const entry of listJournalEntries(companyId)) {
      for (const line of entry.lines) {
        const t = (line.account_name || '').trim();
        if (t && !names.has(t.toLowerCase())) names.set(t.toLowerCase(), t);
      }
    }
  }
  return [...names.values()].sort((a, b) => a.localeCompare(b));
}

/** True when a name is in the 520 master list. */
export function isKnownAccount(name: string): boolean {
  return MASTER_COA_SET.has(name.trim().toLowerCase());
}

/** Returns the master account metadata for a given name, or null. */
export function getMasterAccount(name: string) {
  return MASTER_COA.find(a => a.name.toLowerCase() === name.trim().toLowerCase()) ?? null;
}
