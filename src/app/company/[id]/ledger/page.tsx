'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useCompany } from '@/hooks/useCompany';
import { useJournalEntries } from '@/hooks/useJournalEntries';
import { PageHeader } from '@/components/layout/PageHeader';
import { TAccountFormat } from '@/components/formats/TAccountFormat';
import { RegisterFormat } from '@/components/formats/RegisterFormat';
import { DateRangeFilter } from '@/components/export/DateRangeFilter';
import { ExportButtons } from '@/components/export/ExportButtons';
import { exportElementAsImagePDF } from '@/components/export/exportUtils';
import { ManualEntryDialog } from '@/components/entries/ManualEntryDialog';
import { getCurrentFY } from '@/lib/utils/dateUtils';
import { formatIndianCurrency } from '@/lib/utils/currencyFormat';
import { ENTITY_TYPES } from '@/lib/constants/entityTypes';
import { computeAllBalances } from '@/lib/accounting/computeEngine';
import { computeLedger, computeLedgerTFormat } from '@/lib/accounting/ledgerCompute';
import type { EntityType } from '@/types/company';
import { listJournalEntries } from '@/lib/offlineDb';

type ViewMode = 'list' | 'running' | 'tformat';

type TRow = {
  date: string;
  particulars: string;
  jf: string;
  amount: number | '';
  _rowClass?: string;
};

export default function LedgerPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { company, companyId, loading: companyLoading } = useCompany();
  const fy = getCurrentFY();
  const [fromDate, setFromDate] = useState(fy.start);
  const [toDate, setToDate] = useState(fy.end);
  const initialAccount = searchParams.get('account');
  const viewParam = searchParams.get('view') as ViewMode | null;

  // Map URL to initial view:
  // - No account => list
  // - account + view=running/tformat => that view
  // - account with no/invalid view => tformat
  const initialView: ViewMode =
    !initialAccount ? 'list' : viewParam === 'running' || viewParam === 'tformat' ? viewParam : 'tformat';

  const [selectedAccount, setSelectedAccount] = useState<string | null>(initialAccount);
  const [viewMode, setViewMode] = useState<ViewMode>(initialView);
  const [showNewEntry, setShowNewEntry] = useState(false);
  const detailRef = useRef<HTMLDivElement | null>(null);

  const { entries, loading, createEntry } = useJournalEntries({
    companyId: companyId || '',
    fromDate,
    toDate,
    enabled: !!companyId,
  });

  const balances = useMemo(() => computeAllBalances(entries), [entries]);

  const allRange = useMemo(() => {
    if (!companyId) return null;
    const all = listJournalEntries(companyId);
    if (!all.length) return null;
    return { from: all[0].entry_date, to: all[all.length - 1].entry_date };
  }, [companyId, entries]);

  // Always compute these (hooks must not be conditional)
  const ledgerRows = useMemo(
    () => (selectedAccount ? computeLedger(entries, selectedAccount) : []),
    [entries, selectedAccount]
  );
  const tFormat = useMemo(
    () => (selectedAccount ? computeLedgerTFormat(entries, selectedAccount) : { debitSide: [], creditSide: [] }),
    [entries, selectedAccount]
  );

  const toMonthKey = (isoDate: string) => isoDate.slice(0, 7); // YYYY-MM
  const listMonthsInRange = (startIso: string, endIso: string, fallbackRows: { date: string }[]): string[] => {
    const start = new Date(`${startIso}T00:00:00`);
    const end = new Date(`${endIso}T00:00:00`);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      const set = new Set<string>();
      fallbackRows.forEach((r) => set.add(toMonthKey(r.date)));
      return [...set].sort();
    }
    const cur = new Date(start.getFullYear(), start.getMonth(), 1);
    const endMonth = new Date(end.getFullYear(), end.getMonth(), 1);
    const out: string[] = [];
    while (cur <= endMonth) {
      out.push(`${cur.getFullYear()}-${String(cur.getMonth() + 1).padStart(2, '0')}`);
      cur.setMonth(cur.getMonth() + 1);
    }
    return out;
  };

  const monthlyT = useMemo((): { leftData: TRow[]; rightData: TRow[] } => {
    if (!selectedAccount) return { leftData: [], rightData: [] };

    const months = listMonthsInRange(fromDate, toDate, ledgerRows);
    const isSingleMonthRange = months.length === 1;
    let opening = 0; // Dr positive, Cr negative
    const leftAll: TRow[] = [];
    const rightAll: TRow[] = [];

    const blankRow = (): TRow => ({ date: '', particulars: '\u00A0', jf: '', amount: '' });

    for (const ym of months) {
      const [yy, mm] = ym.split('-').map((x) => parseInt(x, 10));
      const openingDate = `${ym}-01`;
      const lastDay = yy && mm ? new Date(yy, mm, 0).getDate() : 28;
      const closingDate = `${ym}-${String(lastDay).padStart(2, '0')}`;

      const monthDebits = tFormat.debitSide.filter((r) => toMonthKey(r.date) === ym);
      const monthCredits = tFormat.creditSide.filter((r) => toMonthKey(r.date) === ym);

      const monthDebitTotal = monthDebits.reduce((s, r) => s + (r.debit || 0), 0);
      const monthCreditTotal = monthCredits.reduce((s, r) => s + (r.credit || 0), 0);
      const closing = opening + monthDebitTotal - monthCreditTotal;

      // Skip visually empty months with no postings and unchanged balance
      // when viewing a multi-month range. For a single-month filter, still show
      // the month with b/d and c/d.
      if (!isSingleMonthRange && monthDebitTotal === 0 && monthCreditTotal === 0 && opening === closing) {
        // Carry the same opening into next loop without rendering this month.
        opening = closing;
        continue;
      }

      const leftMonth: TRow[] = [];
      const rightMonth: TRow[] = [];

      // 1) Opening balance brought down (b/d)
      if (opening > 0) leftMonth.push({ date: openingDate, particulars: 'To Balance b/d', jf: '', amount: opening });
      else if (opening < 0) rightMonth.push({ date: openingDate, particulars: 'By Balance b/d', jf: '', amount: Math.abs(opening) });

      // 2) Month transactions
      monthDebits.forEach((r) => leftMonth.push({ date: r.date, particulars: `To ${r.particulars}`, jf: r.entry_code, amount: r.debit || '' }));
      monthCredits.forEach((r) => rightMonth.push({ date: r.date, particulars: `By ${r.particulars}`, jf: r.entry_code, amount: r.credit || '' }));

      // Keep both sides row-aligned before c/d line
      const maxRows = Math.max(leftMonth.length, rightMonth.length);
      while (leftMonth.length < maxRows) leftMonth.push(blankRow());
      while (rightMonth.length < maxRows) rightMonth.push(blankRow());

      // 3) Balance carried down (c/d) on opposite side
      //    Debit closing => By Balance c/d on Cr side
      //    Credit closing => To Balance c/d on Dr side
      if (closing > 0) {
        rightMonth.push({ date: closingDate, particulars: 'By Balance c/d', jf: '', amount: closing });
        leftMonth.push(blankRow());
      } else if (closing < 0) {
        leftMonth.push({ date: closingDate, particulars: 'To Balance c/d', jf: '', amount: Math.abs(closing) });
        rightMonth.push(blankRow());
      } else {
        leftMonth.push(blankRow());
        rightMonth.push(blankRow());
      }

      // 4) Monthly total after c/d (must tally: Dr total = Cr total)
      const debitBeforeCd = (opening > 0 ? opening : 0) + monthDebitTotal;
      const creditBeforeCd = (opening < 0 ? Math.abs(opening) : 0) + monthCreditTotal;
      const equalTotal = Math.max(debitBeforeCd, creditBeforeCd);

      leftMonth.push({ date: '', particulars: 'Total', jf: '', amount: equalTotal, _rowClass: 'bg-gray-100 font-semibold' });
      rightMonth.push({ date: '', particulars: 'Total', jf: '', amount: equalTotal, _rowClass: 'bg-gray-100 font-semibold' });

      // Ensure both sides remain same length after total row
      const maxAfter = Math.max(leftMonth.length, rightMonth.length);
      while (leftMonth.length < maxAfter) leftMonth.push(blankRow());
      while (rightMonth.length < maxAfter) rightMonth.push(blankRow());

      leftAll.push(...leftMonth);
      rightAll.push(...rightMonth);
      opening = closing;
    }

    return { leftData: leftAll, rightData: rightAll };
  }, [selectedAccount, fromDate, toDate, ledgerRows, tFormat]);

  // Keep selectedAccount and viewMode in sync with URL if user edits it directly.
  useEffect(() => {
    const acc = searchParams.get('account');
    const v = searchParams.get('view') as ViewMode | null;

    if (!acc) {
      // No account in URL => list view
      setSelectedAccount(null);
      setViewMode('list');
      return;
    }

    setSelectedAccount(acc);
    if (v === 'running' || v === 'tformat') {
      setViewMode(v);
    } else {
      setViewMode('tformat');
    }
  }, [searchParams]);

  if (companyLoading || !company) {
    return <div className="flex items-center justify-center py-16"><div className="h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>;
  }

  const entityLabel = ENTITY_TYPES[company.entity_type as EntityType]?.label || company.entity_type;

  const handleSave = async (entry: Parameters<typeof createEntry>[0]) => {
    const created = await createEntry(entry);
    // Expand date range so newly added future/back-dated entries are visible
    if (entry.entry_date < fromDate) setFromDate(entry.entry_date);
    if (entry.entry_date > toDate) setToDate(entry.entry_date);
    return created;
  };

  // List view: all account balances
  if (!selectedAccount) {
    const listColumns = [
      { header: 'S.No', key: 'sno', width: 'w-16' },
      { header: 'Account Name', key: 'account_name' },
      { header: 'Debit (₹)', key: 'total_debit', align: 'right' as const, isMono: true },
      { header: 'Credit (₹)', key: 'total_credit', align: 'right' as const, isMono: true },
      { header: 'Balance (₹)', key: 'balance_display', align: 'right' as const, isMono: true },
    ];

    const listData = balances.map((b, i) => ({
      sno: i + 1,
      account_name: b.account_name,
      total_debit: b.total_debit,
      total_credit: b.total_credit,
      balance_display: `${formatIndianCurrency(b.balance)} ${b.balance_type}`,
    }));

    return (
      <div>
        <PageHeader title="Ledger" description="All ledger accounts">
          <div className="flex flex-col gap-2 items-end">
            <DateRangeFilter
              fromDate={fromDate}
              toDate={toDate}
              onDateChange={(f, t) => { setFromDate(f); setToDate(t); }}
              allRange={allRange}
            />
            <div className="flex items-center gap-2">
              <button onClick={() => setShowNewEntry(true)} className="inline-flex items-center gap-1.5 h-8 px-3 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Plus className="h-3.5 w-3.5" /> New Entry
              </button>
              <ExportButtons title="Ledger Accounts" companyName={company.name} entityType={entityLabel} dateRange={`${fromDate} to ${toDate}`} columns={listColumns} data={listData} />
            </div>
          </div>
        </PageHeader>
        {loading ? (
          <div className="flex items-center justify-center py-16"><div className="h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="text-center py-3 border-b border-gray-200 bg-gray-50/50">
              <p className="text-[11px] text-gray-400 uppercase tracking-wide">{company.name}</p>
              <h3 className="text-base font-bold text-gray-900 mt-0.5">Ledger Accounts</h3>
              <p className="text-xs text-gray-400 mt-0.5">{fromDate} to {toDate}</p>
            </div>
            {balances.length === 0 ? (
              <div className="text-center py-14"><p className="text-sm text-gray-400">No ledger accounts found. Create journal entries first.</p></div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="sticky top-0">
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-3 py-2.5 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider w-14">S.No</th>
                      <th className="px-3 py-2.5 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Account Name</th>
                      <th className="px-3 py-2.5 text-right text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Debit (₹)</th>
                      <th className="px-3 py-2.5 text-right text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Credit (₹)</th>
                      <th className="px-3 py-2.5 text-right text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Balance (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {balances.map((b, i) => (
                      <tr
                        key={b.account_name}
                        className={`border-b border-gray-100 hover:bg-blue-50/40 cursor-pointer transition-colors ${i % 2 === 1 ? 'bg-gray-50/30' : ''}`}
                        onClick={() => {
                          setSelectedAccount(b.account_name);
                          setViewMode('tformat');
                          setSearchParams({ account: b.account_name, view: 'tformat' });
                        }}
                      >
                        <td className="px-3 py-2 text-xs text-gray-400">{i + 1}</td>
                        <td className="px-3 py-2 font-medium text-blue-600 text-sm">{b.account_name}</td>
                        <td className="px-3 py-2 text-right font-mono text-[13px] tabular-nums text-dr">{b.total_debit > 0 ? formatIndianCurrency(b.total_debit) : ''}</td>
                        <td className="px-3 py-2 text-right font-mono text-[13px] tabular-nums text-cr">{b.total_credit > 0 ? formatIndianCurrency(b.total_credit) : ''}</td>
                        <td className={`px-3 py-2 text-right font-mono text-[13px] tabular-nums font-semibold ${b.balance_type === 'Dr' ? 'text-dr' : 'text-cr'}`}>
                          {formatIndianCurrency(b.balance)} <span className="text-[10px] text-gray-400">{b.balance_type}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        <ManualEntryDialog
          open={showNewEntry}
          onOpenChange={setShowNewEntry}
          companyId={companyId || ''}
          onSave={handleSave}
        />
      </div>
    );
  }

  const runningColumns = [
    { header: 'Date', key: 'date' },
    { header: 'Particulars', key: 'particulars' },
    { header: 'Voucher Type', key: 'voucher_type' },
    { header: 'Debit (₹)', key: 'debit', align: 'right' as const, isMono: true },
    { header: 'Credit (₹)', key: 'credit', align: 'right' as const, isMono: true },
    { header: 'Balance (₹)', key: 'balance_display', align: 'right' as const, isMono: true },
  ];

  const runningData = ledgerRows.map(r => ({
    ...r,
    balance_display: `${formatIndianCurrency(r.running_balance)} ${r.balance_type}`,
  }));

  const totalDebit = ledgerRows.reduce((s, r) => s + r.debit, 0);
  const totalCredit = ledgerRows.reduce((s, r) => s + r.credit, 0);

  return (
    <div>
      <PageHeader title={`Ledger: ${selectedAccount}`} description="Account ledger detail">
        <div className="flex flex-col gap-2 items-end">
          <div className="flex gap-2">
            <button
              onClick={() => {
                setSelectedAccount(null);
                setViewMode('list');
                setSearchParams({});
              }}
              className="px-3 py-1.5 text-sm border border-gray-200 rounded-xl hover:bg-gray-50"
            >
              Back to List
            </button>
            <div className="flex border border-gray-200 rounded-xl overflow-hidden">
              {(['running', 'tformat'] as ViewMode[]).map(mode => (
                <button
                  key={mode}
                  onClick={() => {
                    setViewMode(mode);
                    if (selectedAccount) {
                      setSearchParams({ account: selectedAccount, view: mode });
                    }
                  }}
                  className={`px-3 py-1.5 text-sm ${
                    viewMode === mode ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {mode === 'running' ? 'Running Balance' : 'T-Format'}
                </button>
              ))}
            </div>
          </div>
          <DateRangeFilter
            fromDate={fromDate}
            toDate={toDate}
            onDateChange={(f, t) => { setFromDate(f); setToDate(t); }}
            allRange={allRange}
          />
          <ExportButtons
            title={`Ledger - ${selectedAccount}`}
            companyName={company.name}
            entityType={entityLabel}
            dateRange={`${fromDate} to ${toDate}`}
            columns={runningColumns}
            data={runningData}
            onPdf={() =>
              exportElementAsImagePDF({
                element: detailRef.current,
                title: `Ledger - ${selectedAccount} (${viewMode === 'tformat' ? 'T-Format' : 'Running'})`,
                orientation: viewMode === 'tformat' ? 'landscape' : 'portrait',
              })
            }
          />
        </div>
      </PageHeader>

      {loading ? (
        <div className="flex items-center justify-center py-16"><div className="h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>
      ) : viewMode === 'tformat' ? (
        <div ref={detailRef}>
          <TAccountFormat
            title={`${selectedAccount} Account`}
            subtitle={`${fromDate} to ${toDate}`}
            companyName={company.name}
            leftLabel="Dr."
            rightLabel="Cr."
            leftColumns={[
              { header: 'Date', key: 'date', width: 'w-[20%]' },
              { header: 'Particulars', key: 'particulars', width: 'w-[42%]' },
              { header: 'J.F.', key: 'jf', width: 'w-[13%]' },
              { header: 'Amount (₹)', key: 'amount', align: 'right', width: 'w-[25%]' },
            ]}
            rightColumns={[
              { header: 'Date', key: 'date', width: 'w-[20%]' },
              { header: 'Particulars', key: 'particulars', width: 'w-[42%]' },
              { header: 'J.F.', key: 'jf', width: 'w-[13%]' },
              { header: 'Amount (₹)', key: 'amount', align: 'right', width: 'w-[25%]' },
            ]}
            leftData={monthlyT.leftData}
            rightData={monthlyT.rightData}
            leftTotal={totalDebit}
            rightTotal={totalCredit}
            showFooterTotals={false}
            linkColumnKey="jf"
            getRowHref={(row) =>
              row.jf && companyId ? `/company/${companyId}/journal?entryCode=${row.jf}` : '#'
            }
          />
        </div>
      ) : (
        <div ref={detailRef}>
          <RegisterFormat
            title={`${selectedAccount} — Ledger`}
            subtitle={`${fromDate} to ${toDate}`}
            companyName={company.name}
            columns={runningColumns}
            data={runningData}
            totals={{ debit: totalDebit, credit: totalCredit }}
            emptyMessage="No transactions found for this account."
          />
        </div>
      )}

      <ManualEntryDialog
        open={showNewEntry}
        onOpenChange={setShowNewEntry}
        companyId={companyId || ''}
        onSave={handleSave}
      />
    </div>
  );
}
