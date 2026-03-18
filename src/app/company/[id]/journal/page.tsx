'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Trash2, Search } from 'lucide-react';
import { useCompany } from '@/hooks/useCompany';
import { useJournalEntries } from '@/hooks/useJournalEntries';
import { PageHeader } from '@/components/layout/PageHeader';
import { JournalFormat } from '@/components/formats/JournalFormat';
import { DateRangeFilter } from '@/components/export/DateRangeFilter';
import { ExportButtons } from '@/components/export/ExportButtons';
import { ManualEntryDialog } from '@/components/entries/ManualEntryDialog';
import { getCurrentFY } from '@/lib/utils/dateUtils';
import { ENTITY_TYPES } from '@/lib/constants/entityTypes';
import { AlertBanner } from '@/components/layout/AlertBanner';
import { getJournalDateRange } from '@/lib/offlineDb';
import type { EntityType } from '@/types/company';

const VOUCHER_FILTERS = [
  { label: 'All', value: '' },
  { label: 'Journal', value: 'JRN' },
  { label: 'Sales', value: 'SLS' },
  { label: 'Purchase', value: 'PUR' },
  { label: 'Receipt', value: 'RCT' },
  { label: 'Payment', value: 'PMT' },
  { label: 'Contra', value: 'CNT' },
  { label: 'Debit Note', value: 'DN' },
  { label: 'Credit Note', value: 'CN' },
] as const;

export default function JournalPage() {
  const [searchParams] = useSearchParams();
  const { company, companyId, loading: companyLoading } = useCompany();
  const fy = getCurrentFY();
  const voucherFromUrl = searchParams.get('voucherType') ?? '';
  const entryCodeFromUrl = searchParams.get('entryCode') ?? '';
  const [fromDate, setFromDate] = useState(fy.start);
  const [toDate, setToDate] = useState(fy.end);
  const [voucherFilter, setVoucherFilter] = useState<string>(voucherFromUrl);
  const [accountFilter, setAccountFilter] = useState<string>('');
  const [entryCodeFilter, setEntryCodeFilter] = useState<string>(entryCodeFromUrl);
  const [showNewEntry, setShowNewEntry] = useState(false);

  useEffect(() => {
    setVoucherFilter(voucherFromUrl);
  }, [voucherFromUrl]);

  useEffect(() => {
    setEntryCodeFilter(entryCodeFromUrl);
  }, [entryCodeFromUrl]);

  const JOURNAL_PAGE_LIMIT = 500;
  const { entries, loading, createEntry, deleteEntry } = useJournalEntries({
    companyId: companyId || '',
    fromDate,
    toDate,
    voucherType: voucherFilter || undefined,
    accountName: accountFilter || undefined,
    limit: JOURNAL_PAGE_LIMIT,
    enabled: !!companyId,
  });

  if (companyLoading || !company) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const entityLabel = ENTITY_TYPES[company.entity_type as EntityType]?.label || company.entity_type;

  const allRange = useMemo(() => getJournalDateRange(companyId || ''), [companyId]);

  const journalEntries = entries.map(e => ({
    entryCode: e.entry_code,
    date: e.entry_date,
    lines: e.lines.map(l => ({
      accountName: l.account_name,
      isDebit: (l.debit || 0) > 0,
      amount: (l.debit || 0) > 0 ? l.debit : l.credit,
      inventorySubLines: l.inventory_sub_lines,
      tdsSection: l.tds_section,
      tdsRate: l.tds_rate,
      tcsSection: l.tcs_section,
      tcsRate: l.tcs_rate,
    })),
    narration: e.narration,
    voucherType: e.voucher_type,
  }));

  // Export data (without JE codes)
  const exportData = entries.flatMap(e =>
    e.lines.map(l => ({
      date: e.entry_date,
      particulars: l.account_name,
      voucher_type: e.voucher_type,
      debit: l.debit || 0,
      credit: l.credit || 0,
      narration: e.narration,
    }))
  );

  const exportColumns = [
    { header: 'Date', key: 'date' },
    { header: 'Particulars', key: 'particulars' },
    { header: 'Voucher Type', key: 'voucher_type' },
    { header: 'Debit (₹)', key: 'debit', align: 'right' as const },
    { header: 'Credit (₹)', key: 'credit', align: 'right' as const },
    { header: 'Narration', key: 'narration' },
  ];

  const handleSave = async (entry: Parameters<typeof createEntry>[0]) => {
    const created = await createEntry(entry);
    // Ensure the new entry is visible by expanding the date range if needed
    if (entry.entry_date < fromDate) setFromDate(entry.entry_date);
    if (entry.entry_date > toDate) setToDate(entry.entry_date);
    return created;
  };

  const handleDeleteAll = async () => {
    if (!entries.length) return;
    const confirmed = window.confirm(
      `This will permanently delete all ${entries.length} journal entries currently in view (for the selected date range and filters).\n\n` +
      `This action cannot be undone. Do you want to continue?`,
    );
    if (!confirmed) return;
    // Delete entries one by one via hook so cache + state stay consistent
    for (const e of entries) {
      // Best-effort; ignore individual failures
      // eslint-disable-next-line no-await-in-loop
      await deleteEntry(e.id);
    }
  };

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Sticky toolbar */}
      <div className="shrink-0 mb-4">
        <PageHeader title="Journal" description={`${entries.length} entr${entries.length === 1 ? 'y' : 'ies'} in view`}>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowNewEntry(true)}
              className="inline-flex items-center gap-1.5 h-8 px-3 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" /> New Entry
            </button>
            <button
              onClick={handleDeleteAll}
              disabled={loading || entries.length === 0}
              className="inline-flex items-center gap-1.5 h-8 px-3 text-xs font-semibold border border-red-200 text-red-600 rounded-lg hover:bg-red-50 disabled:opacity-40 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" /> Delete All (View)
            </button>
            <ExportButtons
              title="Journal"
              companyName={company.name}
              entityType={entityLabel}
              dateRange={`${fromDate} to ${toDate}`}
              columns={exportColumns}
              data={exportData}
            />
          </div>
        </PageHeader>

        {/* Filter bar */}
        <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 flex flex-wrap items-center gap-3">
          <DateRangeFilter
            fromDate={fromDate}
            toDate={toDate}
            onDateChange={(from, to) => { setFromDate(from); setToDate(to); }}
            allRange={allRange}
          />
          <div className="h-5 w-px bg-gray-200 hidden md:block" />
          {/* Voucher type pills */}
          <div className="flex items-center gap-1 flex-wrap">
            {VOUCHER_FILTERS.map(v => (
              <button
                key={v.value}
                onClick={() => setVoucherFilter(v.value)}
                className={`h-6 px-2.5 text-[11px] font-semibold rounded-full border transition-all ${
                  voucherFilter === v.value
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>
          <div className="h-5 w-px bg-gray-200 hidden md:block" />
          {/* Search inputs */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
              <input
                value={entryCodeFilter}
                onChange={e => setEntryCodeFilter(e.target.value)}
                placeholder="JE code…"
                maxLength={8}
                className="h-7 pl-7 pr-2 text-xs border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 w-28"
              />
            </div>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
              <input
                value={accountFilter}
                onChange={e => setAccountFilter(e.target.value)}
                placeholder="Account name…"
                className="h-7 pl-7 pr-2 text-xs border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 w-36"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 min-h-0 overflow-auto">
        {entries.length === JOURNAL_PAGE_LIMIT && (
          <AlertBanner type="info" title="Showing latest entries only" message={`Display is capped at ${JOURNAL_PAGE_LIMIT} entries. Narrow the date range or use filters to see a specific set.`} />
        )}
        {entries.some(e => e.entry_date < fy.start) && (
          <AlertBanner type="warning" title="Back-Dated Entries Detected" message="Some entries fall before the current financial year start." />
        )}

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <JournalFormat
            companyName={company.name}
            period={`${fromDate} to ${toDate}`}
            entries={journalEntries}
            highlightEntryCode={entryCodeFilter.trim() || undefined}
            emptyMessage="No journal entries yet. Use New Entry to create your first journal."
          />
        )}
      </div>

      <ManualEntryDialog
        open={showNewEntry}
        onOpenChange={setShowNewEntry}
        companyId={companyId || ''}
        onSave={handleSave}
      />
    </div>
  );
}
