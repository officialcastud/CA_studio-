'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useCompany } from '@/hooks/useCompany';
import { useJournalEntries } from '@/hooks/useJournalEntries';
import { PageHeader } from '@/components/layout/PageHeader';
import { RegisterFormat } from '@/components/formats/RegisterFormat';
import { AgeingFormat } from '@/components/formats/AgeingFormat';
import { DateRangeFilter } from '@/components/export/DateRangeFilter';
import { ExportButtons } from '@/components/export/ExportButtons';
import { ManualEntryDialog } from '@/components/entries/ManualEntryDialog';
import { getCurrentFY } from '@/lib/utils/dateUtils';
import { formatIndianCurrency } from '@/lib/utils/currencyFormat';
import { ENTITY_TYPES } from '@/lib/constants/entityTypes';
import { computeAllBalances } from '@/lib/accounting/computeEngine';
import { computeLedger } from '@/lib/accounting/ledgerCompute';
import { computeCreditorAgeing } from '@/lib/accounting/ageingCompute';
import type { EntityType } from '@/types/company';

type ViewTab = 'summary' | 'ageing';

export default function CreditorsPage() {
  const { company, companyId, loading: companyLoading } = useCompany();
  const fy = getCurrentFY();
  const [fromDate, setFromDate] = useState(fy.start);
  const [toDate, setToDate] = useState(fy.end);
  const [activeTab, setActiveTab] = useState<ViewTab>('summary');
  const [selectedCreditor, setSelectedCreditor] = useState<string | null>(null);
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { entries, loading, createEntry } = useJournalEntries({
    companyId: companyId || '',
    fromDate,
    toDate,
    enabled: !!companyId,
  });

  const balances = useMemo(() => computeAllBalances(entries), [entries]);
  const creditorBalances = useMemo(() => balances.filter(b => b.account_group === 'Trade Payables' || b.account_group === 'Sundry Creditors'), [balances]);
  const ageingData = useMemo(() => computeCreditorAgeing(entries, toDate), [entries, toDate]);

  // Auto-open specific creditor ledger when ?account=Name is present
  useEffect(() => {
    const accountFromUrl = searchParams.get('account');
    if (accountFromUrl) {
      setSelectedCreditor(accountFromUrl);
    }
  }, [searchParams]);

  if (companyLoading || !company) {
    return <div className="flex items-center justify-center py-16"><div className="h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>;
  }

  const entityLabel = ENTITY_TYPES[company.entity_type as EntityType]?.label || company.entity_type;

  // If a creditor is selected, show their ledger
  if (selectedCreditor) {
    const ledgerRows = computeLedger(entries, selectedCreditor);
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
        <PageHeader title={`Creditor: ${selectedCreditor}`} description="Creditor ledger detail">
          <div className="flex flex-col gap-2 items-end">
            <button
              onClick={() => {
                setSelectedCreditor(null);
                const params = new URLSearchParams(searchParams);
                params.delete('account');
                navigate({ search: params.toString() ? `?${params.toString()}` : '' }, { replace: true });
              }}
              className="px-3 py-1.5 text-sm border border-gray-200 rounded-xl hover:bg-gray-50"
            >
              Back to Creditors
            </button>
            <DateRangeFilter fromDate={fromDate} toDate={toDate} onDateChange={(f, t) => { setFromDate(f); setToDate(t); }} />
            <ExportButtons title={`Creditor Ledger - ${selectedCreditor}`} companyName={company.name} entityType={entityLabel} dateRange={`${fromDate} to ${toDate}`} columns={runningColumns} data={runningData} />
          </div>
        </PageHeader>
        {loading ? (
          <div className="flex items-center justify-center py-16"><div className="h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>
        ) : (
          <RegisterFormat title={`${selectedCreditor} — Ledger`} subtitle={`${fromDate} to ${toDate}`} companyName={company.name} columns={runningColumns} data={runningData} totals={{ debit: totalDebit, credit: totalCredit }} emptyMessage="No transactions found." />
        )}
      </div>
    );
  }

  const summaryColumns = [
    { header: 'S.No', key: 'sno' },
    { header: 'Creditor Name', key: 'account_name' },
    { header: 'Debit (₹)', key: 'total_debit', align: 'right' as const, isMono: true },
    { header: 'Credit (₹)', key: 'total_credit', align: 'right' as const, isMono: true },
    { header: 'Balance (₹)', key: 'balance', align: 'right' as const, isMono: true },
    { header: 'Type', key: 'balance_type', align: 'center' as const },
  ];

  const summaryData = creditorBalances.map((b, i) => ({
    sno: i + 1,
    account_name: b.account_name,
    total_debit: b.total_debit,
    total_credit: b.total_credit,
    balance: b.balance,
    balance_type: b.balance_type,
  }));

  const totalOutstanding = creditorBalances.reduce((s, b) => s + (b.balance_type === 'Cr' ? b.balance : -b.balance), 0);

  const tabs: { key: ViewTab; label: string }[] = [
    { key: 'summary', label: 'Summary' },
    { key: 'ageing', label: 'Ageing Analysis' },
  ];

  return (
    <div>
      <PageHeader title="Creditors Ledger" description="Sundry Creditors with ageing analysis">
        <div className="flex flex-col gap-2 items-end">
          <DateRangeFilter fromDate={fromDate} toDate={toDate} onDateChange={(f, t) => { setFromDate(f); setToDate(t); }} />
          <div className="flex items-center gap-2">
            <button onClick={() => setShowNewEntry(true)} className="inline-flex items-center gap-1.5 h-8 px-3 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="h-3.5 w-3.5" /> New Entry
            </button>
            <ExportButtons title="Creditors Ledger" companyName={company.name} entityType={entityLabel} dateRange={`${fromDate} to ${toDate}`} columns={summaryColumns} data={summaryData} />
          </div>
        </div>
      </PageHeader>

      <div className="flex gap-1 mb-4 border-b border-gray-200">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
              activeTab === tab.key ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16"><div className="h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>
      ) : activeTab === 'ageing' ? (
        <AgeingFormat
          title="Creditors Ageing Analysis"
          companyName={company.name}
          asAtDate={toDate}
          data={ageingData}
          emptyMessage="No outstanding creditor balances found."
        />
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="text-center py-3 border-b border-gray-200 bg-gray-50/50">
            <p className="text-[11px] text-gray-400 uppercase tracking-wide">{company.name}</p>
            <h3 className="text-base font-bold text-gray-900 mt-0.5">Sundry Creditors</h3>
            <p className="text-xs text-gray-400 mt-0.5">{fromDate} to {toDate}</p>
          </div>
          {creditorBalances.length === 0 ? (
            <div className="text-center py-14"><p className="text-sm text-gray-400">No creditor accounts found.</p></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0">
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-3 py-2.5 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider w-16">S.No</th>
                    <th className="px-3 py-2.5 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Creditor Name</th>
                    <th className="px-3 py-2.5 text-right text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Debit (₹)</th>
                    <th className="px-3 py-2.5 text-right text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Credit (₹)</th>
                    <th className="px-3 py-2.5 text-right text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Balance (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {creditorBalances.map((b, i) => (
                    <tr
                      key={b.account_name}
                      className="border-b border-gray-100 hover:bg-blue-50 cursor-pointer"
                      onClick={() => setSelectedCreditor(b.account_name)}
                    >
                      <td className="px-3 py-2 text-xs text-gray-400">{i + 1}</td>
                      <td className="px-3 py-2 font-medium text-blue-600">{b.account_name}</td>
                      <td className="px-3 py-2 text-right font-mono text-[13px] tabular-nums">{b.total_debit > 0 ? formatIndianCurrency(b.total_debit) : ''}</td>
                      <td className="px-3 py-2 text-right font-mono text-[13px] tabular-nums">{b.total_credit > 0 ? formatIndianCurrency(b.total_credit) : ''}</td>
                      <td className="px-3 py-2 text-right font-mono text-[13px] tabular-nums font-semibold">{formatIndianCurrency(b.balance)} {b.balance_type}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-50 border-t-2 border-gray-300 font-bold">
                    <td className="px-3 py-2" colSpan={4}>Total Outstanding</td>
                    <td className="px-3 py-2 text-right font-mono">{formatIndianCurrency(Math.abs(totalOutstanding))} {totalOutstanding >= 0 ? 'Cr' : 'Dr'}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>
      )}

      <ManualEntryDialog
        open={showNewEntry}
        onOpenChange={setShowNewEntry}
        companyId={companyId || ''}
        onSave={createEntry}
        defaultVoucherType="Purchase"
      />
    </div>
  );
}
