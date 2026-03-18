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
import { computeITCRegister } from '@/lib/accounting/gstCompute';
import type { EntityType } from '@/types/company';

export default function ITCRegisterPage() {
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

  const itcRows = useMemo(() => computeITCRegister(entries), [entries]);

  if (companyLoading || !company) {
    return <div className="flex items-center justify-center py-16"><div className="h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>;
  }

  const entityLabel = ENTITY_TYPES[company.entity_type as EntityType]?.label || company.entity_type;
  const totalCGST = itcRows.reduce((s, r) => s + r.cgst, 0);
  const totalSGST = itcRows.reduce((s, r) => s + r.sgst, 0);
  const totalIGST = itcRows.reduce((s, r) => s + r.igst, 0);
  const totalITC = totalCGST + totalSGST + totalIGST;
  const eligible = itcRows.filter(r => r.status === 'available');
  const blocked = itcRows.filter(r => r.status === 'blocked');

  const columns = [
    { header: 'S.No', key: 'sno' },
    { header: 'Date', key: 'date' },
    { header: 'Supplier', key: 'supplierName' },
    { header: 'GSTIN', key: 'gstin' },
    { header: 'Invoice No.', key: 'invoiceNumber' },
    { header: 'CGST (₹)', key: 'cgst', align: 'right' as const, isMono: true },
    { header: 'SGST (₹)', key: 'sgst', align: 'right' as const, isMono: true },
    { header: 'IGST (₹)', key: 'igst', align: 'right' as const, isMono: true },
    { header: 'Total ITC (₹)', key: 'total', align: 'right' as const, isMono: true },
    { header: 'Status', key: 'status' },
  ];

  const data = itcRows.map((r, i) => ({ sno: i + 1, ...r }));

  return (
    <div>
      <PageHeader title="ITC Register" description="Input Tax Credit register — all GST credits from purchases">
        <div className="flex flex-col gap-2 items-end">
          <DateRangeFilter fromDate={fromDate} toDate={toDate} onDateChange={(f, t) => { setFromDate(f); setToDate(t); }} />
          <ExportButtons title="ITC Register" companyName={company.name} entityType={entityLabel} dateRange={`${fromDate} to ${toDate}`} columns={columns} data={data} />
        </div>
      </PageHeader>

      {!loading && itcRows.length > 0 && (
        <div className="mb-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
            <p className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">CGST ITC</p>
            <p className="text-lg font-bold font-mono text-blue-700">{formatIndianCurrency(totalCGST)}</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
            <p className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">SGST ITC</p>
            <p className="text-lg font-bold font-mono text-blue-700">{formatIndianCurrency(totalSGST)}</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
            <p className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">IGST ITC</p>
            <p className="text-lg font-bold font-mono text-blue-700">{formatIndianCurrency(totalIGST)}</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3">
            <p className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">Total ITC Available</p>
            <p className="text-lg font-bold font-mono text-green-700">{formatIndianCurrency(totalITC)}</p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16"><div className="h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>
      ) : itcRows.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <p className="text-sm text-gray-400">No ITC records found. Create purchase journal entries (PUR voucher type) with Input CGST/SGST/IGST accounts.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="text-center py-3 border-b border-gray-200 bg-gray-50/50">
            <p className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">{company.name} | GSTIN: {company.gst_details?.gstin || '—'}</p>
            <h3 className="text-sm font-bold text-gray-900">Input Tax Credit (ITC) Register</h3>
            <p className="text-xs text-gray-400 mt-0.5">{fromDate} to {toDate}</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0">
                <tr className="bg-gray-50 border-b border-gray-200">
                  {columns.map(col => (
                    <th key={col.key} className={`px-3 py-2.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap ${col.align === 'right' ? 'text-right' : 'text-left'}`}>{col.header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {itcRows.map((r, i) => (
                  <tr key={`${r.date}-${r.invoiceNumber}-${i}`} className="border-b border-gray-100">
                    <td className="px-3 py-2 text-xs text-gray-400">{i + 1}</td>
                    <td className="px-3 py-1.5 whitespace-nowrap">{r.date}</td>
                    <td className="px-3 py-2 font-medium text-gray-900">{r.supplierName || '—'}</td>
                    <td className="px-3 py-2 font-mono text-xs">{r.gstin || '—'}</td>
                    <td className="px-3 py-2">{r.invoiceNumber}</td>
                    <td className="px-3 py-2 text-right font-mono text-[13px] tabular-nums">{r.cgst > 0 ? formatIndianCurrency(r.cgst) : '—'}</td>
                    <td className="px-3 py-2 text-right font-mono text-[13px] tabular-nums">{r.sgst > 0 ? formatIndianCurrency(r.sgst) : '—'}</td>
                    <td className="px-3 py-2 text-right font-mono text-[13px] tabular-nums">{r.igst > 0 ? formatIndianCurrency(r.igst) : '—'}</td>
                    <td className="px-3 py-2 text-right font-mono text-[13px] tabular-nums font-semibold">{formatIndianCurrency(r.total)}</td>
                    <td className="px-3 py-2">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                        r.status === 'available' ? 'bg-green-100 text-green-700' :
                        r.status === 'blocked' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-50 border-t-2 border-gray-300 font-bold">
                  <td className="px-3 py-2" colSpan={5}>Total</td>
                  <td className="px-3 py-2 text-right font-mono">{formatIndianCurrency(totalCGST)}</td>
                  <td className="px-3 py-2 text-right font-mono">{formatIndianCurrency(totalSGST)}</td>
                  <td className="px-3 py-2 text-right font-mono">{formatIndianCurrency(totalIGST)}</td>
                  <td className="px-3 py-2 text-right font-mono">{formatIndianCurrency(totalITC)}</td>
                  <td className="px-3 py-2" />
                </tr>
              </tfoot>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-gray-200 bg-yellow-50 text-xs text-yellow-700">
            <p className="font-medium">Blocked Credits u/s 17(5):</p>
            <p>Motor vehicles (personal use), Food & beverages, Club membership, Health insurance, Beauty treatment, Personal consumption, Works contract (immovable property), Free samples.</p>
          </div>
        </div>
      )}
    </div>
  );
}
