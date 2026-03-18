'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCompany } from '@/hooks/useCompany';
import { useJournalEntries } from '@/hooks/useJournalEntries';
import { PageHeader } from '@/components/layout/PageHeader';
import { CashFlowAs3Format } from '@/components/formats/CashFlowAs3Format';
import { DateRangeFilter } from '@/components/export/DateRangeFilter';
import { ExportButtons } from '@/components/export/ExportButtons';
import { getCurrentFY } from '@/lib/utils/dateUtils';
import { ENTITY_TYPES } from '@/lib/constants/entityTypes';
import { computeTradingAccount } from '@/lib/accounting/tradingAccountCompute';
import { computeProfitLoss } from '@/lib/accounting/profitLossCompute';
import { computeCashFlow } from '@/lib/accounting/cashFlowCompute';
import type { EntityType } from '@/types/company';

export default function CashFlowPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { company, companyId, loading: companyLoading } = useCompany();
  const fy = getCurrentFY();
  const [fromDate, setFromDate] = useState(fy.start);
  const [toDate, setToDate] = useState(fy.end);
  const initialFormat =
    (searchParams.get('method') as 'direct' | 'indirect' | null) ?? 'indirect';
  const [format, setFormat] = useState<'direct' | 'indirect'>(initialFormat);

  useEffect(() => {
    const urlFormat = (searchParams.get('method') as 'direct' | 'indirect' | null) ?? 'indirect';
    setFormat(urlFormat);
  }, [searchParams]);

  const { entries, loading } = useJournalEntries({
    companyId: companyId || '',
    fromDate,
    toDate,
    enabled: !!companyId,
  });

  const tradingAccount = useMemo(() => computeTradingAccount(entries), [entries]);
  const profitLoss = useMemo(() => computeProfitLoss(entries, tradingAccount.grossProfit), [entries, tradingAccount.grossProfit]);
  const cashFlow = useMemo(() => computeCashFlow(entries, profitLoss.netProfit), [entries, profitLoss.netProfit]);

  if (companyLoading || !company) {
    return <div className="flex items-center justify-center py-16"><div className="h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>;
  }

  const entityLabel = ENTITY_TYPES[company.entity_type as EntityType]?.label || company.entity_type;

  const as3Rows = useMemo(() => {
    const r: Parameters<typeof CashFlowAs3Format>[0]['rows'] = [];
    if (format === 'direct') {
      // Presentation-only: direct method headings as per AS 3 format.
      r.push({ label: 'A. CASH FLOWS FROM OPERATING ACTIVITIES', isHeading: true });
      r.push({ label: 'Cash receipts from customers / sale of goods & services', subAmount: null, total: null });
      r.push({ label: 'Cash receipts from royalties, fees, commissions, etc.', subAmount: null, total: null });
      r.push({ label: 'Cash paid to suppliers for goods and services', subAmount: null, total: null });
      r.push({ label: 'Cash paid to and on behalf of employees', subAmount: null, total: null });
      r.push({ label: 'Cash generated from operations', total: cashFlow.operating.total, isBold: true });
      r.push({ label: 'Income taxes paid (net of refunds)', total: null });
      r.push({ label: 'NET CASH FROM / (USED IN) OPERATING ACTIVITIES (A)', total: cashFlow.operating.total, isBold: true });
    } else {
      r.push({ label: 'A. CASH FLOWS FROM OPERATING ACTIVITIES', isHeading: true });
      const netProfitRow = cashFlow.operating.items.find(i => i.label.toLowerCase().includes('net profit'));
      r.push({
        label: 'Net Profit / (Loss) before Tax and Extraordinary Items',
        total: netProfitRow?.amount ?? profitLoss.netProfit,
        isBold: true,
      });
      r.push({ label: 'Adjustments for non-cash / non-operating items:', isHeading: false, isBold: true });
      for (const it of cashFlow.operating.items) {
        if (it.label.toLowerCase().includes('net profit')) continue;
        r.push({ label: it.label, subAmount: it.amount });
      }
      r.push({ label: 'Cash Generated from Operations', total: cashFlow.operating.total, isBold: true });
      r.push({ label: 'NET CASH FROM / (USED IN) OPERATING ACTIVITIES (A)', total: cashFlow.operating.total, isBold: true });
    }

    r.push({ label: '', isHeading: false });
    r.push({ label: 'B. CASH FLOWS FROM INVESTING ACTIVITIES', isHeading: true });
    for (const it of cashFlow.investing.items) r.push({ label: it.label, subAmount: it.amount });
    r.push({ label: 'NET CASH FROM / (USED IN) INVESTING ACTIVITIES (B)', total: cashFlow.investing.total, isBold: true });

    r.push({ label: '', isHeading: false });
    r.push({ label: 'C. CASH FLOWS FROM FINANCING ACTIVITIES', isHeading: true });
    for (const it of cashFlow.financing.items) r.push({ label: it.label, subAmount: it.amount });
    r.push({ label: 'NET CASH FROM / (USED IN) FINANCING ACTIVITIES (C)', total: cashFlow.financing.total, isBold: true });

    r.push({ label: '', isHeading: false });
    r.push({ label: 'NET CHANGE IN CASH & CASH EQUIVALENTS (A+B+C)', total: cashFlow.netChange, isBold: true });
    r.push({ label: 'Net increase / (decrease) in Cash & Cash Equivalents', total: cashFlow.netChange, isBold: true });
    r.push({ label: 'Cash & Cash Equivalents — Opening Balance', total: cashFlow.openingCash });
    r.push({ label: 'CASH & CASH EQUIVALENTS — CLOSING BALANCE', total: cashFlow.closingCash, isBold: true });
    return r;
  }, [cashFlow, format, profitLoss.netProfit]);

  const exportColumns = [
    { header: 'Section', key: 'section' },
    { header: 'Particulars', key: 'label' },
    { header: 'Amount (₹)', key: 'amount', align: 'right' as const, isMono: true },
  ];

  const exportData = [
    ...cashFlow.operating.items.map(i => ({ section: 'Operating', label: i.label, amount: i.amount })),
    { section: 'Operating', label: 'Net Cash from Operating Activities', amount: cashFlow.operating.total },
    ...cashFlow.investing.items.map(i => ({ section: 'Investing', label: i.label, amount: i.amount })),
    { section: 'Investing', label: 'Net Cash from Investing Activities', amount: cashFlow.investing.total },
    ...cashFlow.financing.items.map(i => ({ section: 'Financing', label: i.label, amount: i.amount })),
    { section: 'Financing', label: 'Net Cash from Financing Activities', amount: cashFlow.financing.total },
    { section: 'Summary', label: 'Net Change in Cash', amount: cashFlow.netChange },
    { section: 'Summary', label: 'Opening Cash', amount: cashFlow.openingCash },
    { section: 'Summary', label: 'Closing Cash', amount: cashFlow.closingCash },
  ];

  return (
    <div>
      <PageHeader title="Cash Flow Statement" description="Cash flows from Operating, Investing & Financing activities">
        <div className="flex flex-col gap-2 items-end">
          <DateRangeFilter fromDate={fromDate} toDate={toDate} onDateChange={(f, t) => { setFromDate(f); setToDate(t); }} />
          <div className="flex items-center gap-2">
            <div className="flex border border-gray-200 rounded-xl overflow-hidden text-xs">
              {(['direct', 'indirect'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => {
                    setFormat(m);
                    const next = new URLSearchParams(searchParams);
                    next.set('method', m);
                    setSearchParams(next);
                  }}
                  className={`px-3 py-1.5 ${
                    format === m ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {m === 'direct' ? 'Format A – Direct' : 'Format B – Indirect'}
                </button>
              ))}
            </div>
          <ExportButtons title="Cash Flow Statement" companyName={company.name} entityType={entityLabel} dateRange={`${fromDate} to ${toDate}`} columns={exportColumns} data={exportData} />
          </div>
        </div>
      </PageHeader>

      {loading ? (
        <div className="flex items-center justify-center py-16"><div className="h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>
      ) : entries.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <p className="text-sm text-gray-400">No entries found. Create journal entries to generate a Cash Flow Statement.</p>
        </div>
      ) : (
        <CashFlowAs3Format
          companyName={company.name}
          period={`For the year ended ${toDate}`}
          methodLabel={format === 'direct' ? 'Direct Method' : 'Indirect Method'}
          rows={as3Rows}
          schedule={{
            title: 'SCHEDULE — Components of Cash & Cash Equivalents',
            items: [
              { label: 'Cash on hand', currentYear: cashFlow.cashComponents?.cashOnHand ?? 0, previousYear: null },
              { label: 'Balances with banks', currentYear: cashFlow.cashComponents?.bankBalances ?? 0, previousYear: null },
              { label: 'TOTAL Cash & Cash Equivalents', currentYear: cashFlow.closingCash, previousYear: null },
            ],
          }}
        />
      )}
    </div>
  );
}
