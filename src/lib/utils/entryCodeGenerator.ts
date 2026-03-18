/**
 * Short journal folio (J.F.) codes: 4 characters, case-sensitive alphanumeric.
 * Charset: a-z, A-Z, 0-9 → 62^4 ≈ 14.7M unique codes per company.
 */

import { listJournalEntries } from '@/lib/offlineDb';

const CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

function randomChar(): string {
  return CHARS[Math.floor(Math.random() * CHARS.length)];
}

/** Returns one random 4-char code (a-z, A-Z, 0-9). */
export function generateShortEntryCode(): string {
  return randomChar() + randomChar() + randomChar() + randomChar();
}

/** Returns a 4-char code not in the given set; caller should add it to the set after use. */
export function generateUniqueShortEntryCode(existing: Set<string>): string {
  for (let i = 0; i < 50; i++) {
    const code = generateShortEntryCode();
    if (!existing.has(code)) return code;
  }
  return generateShortEntryCode().slice(0, 3) + String(Math.floor(Math.random() * 10));
}

/**
 * Returns a 4-char code unique among existing journal entry_codes for the company.
 */
export function generateUniqueEntryCode(companyId: string): string {
  const existing = new Set(
    listJournalEntries(companyId).map((e) => e.entry_code)
  );
  return generateUniqueShortEntryCode(existing);
}
