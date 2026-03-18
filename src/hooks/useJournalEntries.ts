'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  createJournalEntry,
  updateJournalEntry,
  deleteJournalEntry as deleteJournalEntryLocal,
  type NewJournalEntryInput,
} from '@/lib/offlineDb';
import { runEntryCodeMigrationIfNeeded } from '@/lib/migrateEntryCodes';
import { fetchJournalEntries, invalidateEntriesCache, type JournalEntry } from '@/lib/accounting/computeEngine';

interface UseJournalEntriesOptions {
  companyId: string;
  fromDate?: string;
  toDate?: string;
  voucherType?: string;
  accountName?: string;
  entryCode?: string;
  limit?: number;
  enabled?: boolean;
}

export function useJournalEntries(options: UseJournalEntriesOptions) {
  const { companyId, fromDate, toDate, voucherType, accountName, entryCode, limit, enabled = true } = options;
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!companyId || !enabled) return;
    runEntryCodeMigrationIfNeeded(companyId);
    setLoading(true);
    setError(null);
    try {
      const data = await fetchJournalEntries(companyId, {
        fromDate,
        toDate,
        voucherType,
        accountName,
        entryCode,
        limit,
      });
      setEntries(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch journal entries');
    } finally {
      setLoading(false);
    }
  }, [companyId, fromDate, toDate, voucherType, accountName, entryCode, limit, enabled]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const createEntry = async (entry: {
    company_id: string;
    entry_code: string;
    entry_date: string;
    voucher_type: string;
    voucher_number?: string;
    lines: JournalEntry['lines'];
    narration: string;
    book_period: string;
    is_opening?: boolean;
    is_closing?: boolean;
  }) => {
    const input: NewJournalEntryInput = {
      ...entry,
      voucher_number: entry.voucher_number ?? null,
      is_opening: entry.is_opening ?? false,
      is_closing: entry.is_closing ?? false,
    };

    const created = createJournalEntry(input);
    invalidateEntriesCache(companyId);
    await refresh();
    return created;
  };

  const updateEntry = async (id: string, updates: Partial<JournalEntry>) => {
    const updated = updateJournalEntry(id, updates);
    if (!updated) {
      throw new Error('Entry not found');
    }
    invalidateEntriesCache(companyId);
    await refresh();
    return updated;
  };

  const deleteEntry = async (id: string) => {
    deleteJournalEntryLocal(id);
    invalidateEntriesCache(companyId);
    await refresh();
  };

  return {
    entries,
    loading,
    error,
    refresh,
    createEntry,
    updateEntry,
    deleteEntry,
  };
}
