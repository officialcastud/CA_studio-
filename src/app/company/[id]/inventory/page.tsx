import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useCompany } from '@/hooks/useCompany';
import { useJournalEntries } from '@/hooks/useJournalEntries';
import { PageHeader } from '@/components/layout/PageHeader';
import { DateRangeFilter } from '@/components/export/DateRangeFilter';
import { ExportButtons } from '@/components/export/ExportButtons';
import { getCurrentFY } from '@/lib/utils/dateUtils';
import { formatIndianCurrency } from '@/lib/utils/currencyFormat';
import { ENTITY_TYPES } from '@/lib/constants/entityTypes';
import { computeInventorySummary } from '@/lib/accounting/inventoryCompute';
import type { EntityType } from '@/types/company';

export default function InventoryPage() {
  const { company, companyId, loading: companyLoading } = useCompany();
  const fy = getCurrentFY();
  const [fromDate, setFromDate] = useState(fy.start);
  const [toDate, setToDate] = useState(fy.end);
  const [method, setMethod] = useState<'fifo' | 'weighted_average'>('weighted_average');

  const { entries, loading } = useJournalEntries({
    companyId: companyId || '',
    fromDate,
    toDate,
    enabled: !!companyId,
  });

  const items = useMemo(() => computeInventorySummary(entries, method), [entries, method]);

  if (companyLoading || !company) {
    return <div className="flex items-center justify-center py-16"><div className="h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>;
  }

  const entityLabel = ENTITY_TYPES[company.entity_type as EntityType]?.label || company.entity_type;
  const totalOpening = items.reduce((s, r) => s + r.openingValue, 0);
  const totalPurchases = items.reduce((s, r) => s + r.purchasedValue, 0);
  const totalSales = items.reduce((s, r) => s + r.soldValue, 0);
  const totalClosing = items.reduce((s, r) => s + r.closingValue, 0);

  const columns = [
    { header: 'S.No', key: 'sno' },
    { header: 'Item', key: 'itemName' },
    { header: 'Opening (₹)', key: 'openingValue', align: 'right' as const, isMono: true },
    { header: 'Purchases (₹)', key: 'purchasedValue', align: 'right' as const, isMono: true },
    { header: 'Sales (₹)', key: 'soldValue', align: 'right' as const, isMono: true },
    { header: 'Closing (₹)', key: 'closingValue', align: 'right' as const, isMono: true },
  ];

  const data = items.map((r, i) => ({ sno: i + 1, ...r }));

  const subModules = [
    { href: 'inventory/bin-card', label: 'Bin Card', desc: 'Quantity-wise stock movement for each item' },
    { href: 'inventory/stores-ledger', label: 'Stores Ledger', desc: 'Quantity + value ledger (FIFO / Weighted Average)' },
    { href: 'inventory/cost-sheet', label: 'Cost Sheet', desc: 'Product costing — material, labour, overheads' },
  ];

  return (
    <div>
      <PageHeader title="Stock Summary" description="Inventory summary — opening, purchases, sales, closing stock">
        <div className="flex flex-col gap-2 items-end">
          <div className="flex border border-gray-200 rounded-xl overflow-hidden">
            {([['weighted_average', 'Weighted Avg'], ['fifo', 'FIFO']] as const).map(([val, label]) => (
              <button key={val} onClick={() => setMethod(val)} className={`px-3 py-1.5 text-sm ${method === val ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}>{label}</button>
            ))}
          </div>
          <DateRangeFilter fromDate={fromDate} toDate={toDate} onDateChange={(f, t) => { setFromDate(f); setToDate(t); }} />
          <ExportButtons title="Stock Summary" companyName={company.name} entityType={entityLabel} dateRange={`${fromDate} to ${toDate}`} columns={columns} data={data} />
        </div>
      </PageHeader>

      {/* Sub-modules nav */}
      <div className="mb-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
        {subModules.map(m => (
          <Link key={m.href} to={`/company/${companyId}/${m.href}`} className="bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-500 hover:shadow-sm transition-all">
            <h4 className="text-sm font-bold text-gray-900">{m.label}</h4>
            <p className="text-xs text-gray-500 mt-1">{m.desc}</p>
          </Link>
        ))}
      </div>

      {!loading && items.length > 0 && (
        <div className="mb-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
            <p className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">Opening Stock</p>
            <p className="text-lg font-bold font-mono text-gray-700">{formatIndianCurrency(totalOpening)}</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
            <p className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">Purchases</p>
            <p className="text-lg font-bold font-mono text-blue-700">{formatIndianCurrency(totalPurchases)}</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <p className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">Sales</p>
            <p className="text-lg font-bold font-mono text-red-700">{formatIndianCurrency(totalSales)}</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3">
            <p className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">Closing Stock</p>
            <p className="text-lg font-bold font-mono text-green-700">{formatIndianCurrency(totalClosing)}</p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16"><div className="h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>
      ) : items.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <p className="text-sm text-gray-400">No inventory items found. Create journal entries with Stock-in-Trade / Purchases / Sales accounts to populate this summary.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="text-center py-3 border-b border-gray-200 bg-gray-50/50">
            <p className="text-[11px] text-gray-400 uppercase tracking-wide">{company.name}</p>
            <h3 className="text-base font-bold text-gray-900 mt-0.5">Stock Summary — {method === 'fifo' ? 'FIFO' : 'Weighted Average'}</h3>
            <p className="text-xs text-gray-400 mt-0.5">{fromDate} to {toDate}</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0">
                <tr className="bg-gray-50 border-b border-gray-200">
                  {columns.map(col => (
                    <th key={col.key} className={`px-3 py-2.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wider ${col.align === 'right' ? 'text-right' : 'text-left'}`}>{col.header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map((r, i) => (
                  <tr key={r.itemName} className="border-b border-gray-100">
                    <td className="px-3 py-2 text-xs text-gray-400">{i + 1}</td>
                    <td className="px-3 py-2 font-medium text-gray-900">{r.itemName}</td>
                    <td className="px-3 py-2 text-right font-mono text-[13px] tabular-nums">{formatIndianCurrency(r.openingValue)}</td>
                    <td className="px-3 py-2 text-right font-mono text-[13px] tabular-nums">{formatIndianCurrency(r.purchasedValue)}</td>
                    <td className="px-3 py-2 text-right font-mono text-[13px] tabular-nums">{formatIndianCurrency(r.soldValue)}</td>
                    <td className="px-3 py-2 text-right font-mono text-[13px] tabular-nums font-semibold">{formatIndianCurrency(r.closingValue)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-50 border-t-2 border-gray-300 font-bold">
                  <td className="px-3 py-2" colSpan={2}>Total</td>
                  <td className="px-3 py-2 text-right font-mono">{formatIndianCurrency(totalOpening)}</td>
                  <td className="px-3 py-2 text-right font-mono">{formatIndianCurrency(totalPurchases)}</td>
                  <td className="px-3 py-2 text-right font-mono">{formatIndianCurrency(totalSales)}</td>
                  <td className="px-3 py-2 text-right font-mono">{formatIndianCurrency(totalClosing)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
