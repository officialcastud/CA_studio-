'use client';

import { useState, useMemo } from 'react';
import { useCompany } from '@/hooks/useCompany';
import { useJournalEntries } from '@/hooks/useJournalEntries';
import { PageHeader } from '@/components/layout/PageHeader';
import { DateRangeFilter } from '@/components/export/DateRangeFilter';
import { ExportButtons } from '@/components/export/ExportButtons';
import { getCurrentFY } from '@/lib/utils/dateUtils';
import { formatIndianCurrency } from '@/lib/utils/currencyFormat';
import { ENTITY_TYPES } from '@/lib/constants/entityTypes';
import { computeGSTR1 } from '@/lib/accounting/gstCompute';
import type { GSTRegisterRow } from '@/lib/accounting/gstCompute';
import type { EntityType } from '@/types/company';

function GSTTable({ title, rows, columns }: { title: string; rows: GSTRegisterRow[]; columns: { header: string; key: string; align?: 'right'; isMono?: boolean }[] }) {
  if (rows.length === 0) return null;
  const totals = {
    taxableValue: rows.reduce((s, r) => s + r.taxableValue, 0),
    cgst: rows.reduce((s, r) => s + r.cgst, 0),
    sgst: rows.reduce((s, r) => s + r.sgst, 0),
    igst: rows.reduce((s, r) => s + r.igst, 0),
    invoiceTotal: rows.reduce((s, r) => s + r.invoiceTotal, 0),
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="px-4 py-2 border-b border-gray-200 bg-gray-50">
        <h4 className="text-sm font-bold text-gray-800">{title}</h4>
        <p className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">{rows.length} invoice{rows.length !== 1 ? 's' : ''}</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-3 py-2.5 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">S.No</th>
              {columns.map(col => (
                <th key={col.key} className={`px-3 py-2.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap ${col.align === 'right' ? 'text-right' : 'text-left'}`}>{col.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={`${r.date}-${i}`} className="border-b border-gray-100">
                <td className="px-3 py-2 text-xs text-gray-400">{i + 1}</td>
                <td className="px-3 py-1.5 whitespace-nowrap">{r.date}</td>
                <td className="px-3 py-2">{r.voucherNumber}</td>
                <td className="px-3 py-2 font-medium">{r.partyName || '—'}</td>
                <td className="px-3 py-2 font-mono text-xs">{r.gstin || '—'}</td>
                <td className="px-3 py-2 text-right font-mono text-[13px] tabular-nums">{formatIndianCurrency(r.taxableValue)}</td>
                <td className="px-3 py-2 text-right font-mono text-[13px] tabular-nums">{r.cgst > 0 ? formatIndianCurrency(r.cgst) : '—'}</td>
                <td className="px-3 py-2 text-right font-mono text-[13px] tabular-nums">{r.sgst > 0 ? formatIndianCurrency(r.sgst) : '—'}</td>
                <td className="px-3 py-2 text-right font-mono text-[13px] tabular-nums">{r.igst > 0 ? formatIndianCurrency(r.igst) : '—'}</td>
                <td className="px-3 py-2 text-right font-mono text-[13px] tabular-nums font-semibold">{formatIndianCurrency(r.invoiceTotal)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-50 border-t-2 border-gray-300 font-bold">
              <td className="px-3 py-2" colSpan={5}>Total</td>
              <td className="px-3 py-2 text-right font-mono">{formatIndianCurrency(totals.taxableValue)}</td>
              <td className="px-3 py-2 text-right font-mono">{formatIndianCurrency(totals.cgst)}</td>
              <td className="px-3 py-2 text-right font-mono">{formatIndianCurrency(totals.sgst)}</td>
              <td className="px-3 py-2 text-right font-mono">{formatIndianCurrency(totals.igst)}</td>
              <td className="px-3 py-2 text-right font-mono">{formatIndianCurrency(totals.invoiceTotal)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

export default function GSTR1Page() {
  const { company, companyId, loading: companyLoading } = useCompany();
  const fy = getCurrentFY();
  const [fromDate, setFromDate] = useState(fy.start);
  const [toDate, setToDate] = useState(fy.end);

  const { entries, loading } = useJournalEntries({
    companyId: companyId || '',
    fromDate,
    toDate,
    enabled: !!companyId,
  });

  const gstr1 = useMemo(() => computeGSTR1(entries), [entries]);

  if (companyLoading || !company) {
    return <div className="flex items-center justify-center py-16"><div className="h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>;
  }

  const entityLabel = ENTITY_TYPES[company.entity_type as EntityType]?.label || company.entity_type;
  const totalGST = gstr1.totalCGST + gstr1.totalSGST + gstr1.totalIGST;

  const tableCols = [
    { header: 'Date', key: 'date' },
    { header: 'Invoice No.', key: 'voucherNumber' },
    { header: 'Party', key: 'partyName' },
    { header: 'GSTIN', key: 'gstin' },
    { header: 'Taxable (₹)', key: 'taxableValue', align: 'right' as const, isMono: true },
    { header: 'CGST (₹)', key: 'cgst', align: 'right' as const, isMono: true },
    { header: 'SGST (₹)', key: 'sgst', align: 'right' as const, isMono: true },
    { header: 'IGST (₹)', key: 'igst', align: 'right' as const, isMono: true },
    { header: 'Total (₹)', key: 'invoiceTotal', align: 'right' as const, isMono: true },
  ];

  const allRows = [...gstr1.b2b, ...gstr1.b2c];
  const exportData = allRows.map((r, i) => ({ sno: i + 1, type: gstr1.b2b.includes(r) ? 'B2B' : 'B2C', ...r }));

  return (
    <div>
      <PageHeader title="GSTR-1 Data Preparation" description="Outward supply data for GSTR-1 filing">
        <div className="flex flex-col gap-2 items-end">
          <DateRangeFilter fromDate={fromDate} toDate={toDate} onDateChange={(f, t) => { setFromDate(f); setToDate(t); }} />
          <ExportButtons title="GSTR-1 Data" companyName={company.name} entityType={entityLabel} dateRange={`${fromDate} to ${toDate}`} columns={[{ header: 'S.No', key: 'sno' }, { header: 'Type', key: 'type' }, ...tableCols]} data={exportData} />
        </div>
      </PageHeader>

      {!loading && allRows.length > 0 && (
        <div className="mb-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
            <p className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">Taxable Value</p>
            <p className="text-lg font-bold font-mono text-blue-700">{formatIndianCurrency(gstr1.totalTaxableValue)}</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
            <p className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">CGST + SGST</p>
            <p className="text-lg font-bold font-mono text-blue-700">{formatIndianCurrency(gstr1.totalCGST + gstr1.totalSGST)}</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
            <p className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">IGST</p>
            <p className="text-lg font-bold font-mono text-blue-700">{formatIndianCurrency(gstr1.totalIGST)}</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3">
            <p className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">Total Output Tax</p>
            <p className="text-lg font-bold font-mono text-green-700">{formatIndianCurrency(totalGST)}</p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16"><div className="h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>
      ) : allRows.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <p className="text-sm text-gray-400">No sales entries found. Create SLS voucher type journal entries with Output CGST/SGST/IGST accounts.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <GSTTable title="Table 4 — B2B Supplies (to registered persons)" rows={gstr1.b2b} columns={tableCols} />
          <GSTTable title="Table 7 — B2C Supplies (to unregistered persons)" rows={gstr1.b2c} columns={tableCols} />
        </div>
      )}
    </div>
  );
}
