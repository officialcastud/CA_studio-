'use client';

import { useState } from 'react';
import { useCompany } from '@/hooks/useCompany';
import { useJournalEntries } from '@/hooks/useJournalEntries';
import { PageHeader } from '@/components/layout/PageHeader';
import { InventoryRegisterFormat } from '@/components/formats/InventoryRegisterFormat';
import { DateRangeFilter } from '@/components/export/DateRangeFilter';
import { ExportButtons } from '@/components/export/ExportButtons';
import { getCurrentFY } from '@/lib/utils/dateUtils';
import { ENTITY_TYPES } from '@/lib/constants/entityTypes';
import { buildInventoryRegisterRows, getInventoryRegisterTotals } from '@/lib/accounting/inventoryRegisterCompute';
import type { EntityType } from '@/types/company';

export default function SalesReturnsPage() {
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

  if (companyLoading || !company) {
    return <div className="flex items-center justify-center py-16"><div className="h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>;
  }

  const entityLabel = ENTITY_TYPES[company.entity_type as EntityType]?.label || company.entity_type;

  const registerRows = buildInventoryRegisterRows(entries, 'CN');
  const totals = getInventoryRegisterTotals(registerRows);
  const exportData = registerRows.map((row) => ({
    date: row.date,
    jf: row.jf,
    particulars: row.particulars,
    qty: row.qty,
    rate: row.rate,
    discount: `${row.discountAmount.toFixed(2)} / ${row.discountPercent.toFixed(2)}%`,
    taxable_amount: row.taxableAmount,
    cgst: `${row.cgstAmount.toFixed(2)} / ${row.cgstPercent.toFixed(2)}%`,
    sgst: `${row.sgstAmount.toFixed(2)} / ${row.sgstPercent.toFixed(2)}%`,
    igst: `${row.igstAmount.toFixed(2)} / ${row.igstPercent.toFixed(2)}%`,
    final_amount: row.finalAmount,
  }));
  const exportColumns = [
    { header: 'Date', key: 'date' },
    { header: 'J.F.', key: 'jf' },
    { header: 'Particulars', key: 'particulars' },
    { header: 'Qty', key: 'qty', align: 'right' as const },
    { header: 'Rate', key: 'rate', align: 'right' as const },
    { header: 'Discount', key: 'discount' },
    { header: 'Taxable Amount', key: 'taxable_amount', align: 'right' as const },
    { header: 'CGST', key: 'cgst' },
    { header: 'SGST', key: 'sgst' },
    { header: 'IGST', key: 'igst' },
    { header: 'Final Amount', key: 'final_amount', align: 'right' as const },
  ];

  return (
    <div>
      <PageHeader title="Sales Returns" description="Credit Notes issued">
        <div className="flex flex-col gap-2 items-end">
          <DateRangeFilter fromDate={fromDate} toDate={toDate} onDateChange={(f, t) => { setFromDate(f); setToDate(t); }} />
          <ExportButtons title="Sales Returns" companyName={company.name} entityType={entityLabel} dateRange={`${fromDate} to ${toDate}`} columns={exportColumns} data={exportData} />
        </div>
      </PageHeader>
      {loading ? (
        <div className="flex items-center justify-center py-16"><div className="h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <InventoryRegisterFormat
          title="Sales Return Register"
          subtitle={`${fromDate} to ${toDate}`}
          companyName={company.name}
          data={registerRows}
          totals={totals}
          emptyMessage="No sales return entries found."
          getJfHref={(jf) =>
            companyId ? `/company/${companyId}/journal?entryCode=${jf}` : '#'
          }
        />
      )}
    </div>
  );
}
