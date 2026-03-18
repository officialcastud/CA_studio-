'use client';

import { useState } from 'react';
import { useCompany } from '@/hooks/useCompany';
import { useJournalEntries } from '@/hooks/useJournalEntries';
import { PageHeader } from '@/components/layout/PageHeader';
import { RegisterFormat } from '@/components/formats/RegisterFormat';
import { DateRangeFilter } from '@/components/export/DateRangeFilter';
import { ExportButtons } from '@/components/export/ExportButtons';
import { getCurrentFY } from '@/lib/utils/dateUtils';
import { ENTITY_TYPES } from '@/lib/constants/entityTypes';
import type { EntityType } from '@/types/company';

export default function BillsReceivablePage() {
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

  // Filter entries involving Bills Receivable account
  const brEntries = entries.filter(e =>
    e.lines.some(l => l.account_group === 'Trade Receivables' && l.account_name.toLowerCase().includes('bills receivable') || l.account_group === 'Bills Receivable' || l.account_name.toLowerCase().includes('bills receivable'))
  );

  const tableData = brEntries.map(e => {
    let drawer = '', amount = 0;
    for (const l of e.lines) {
      if (l.account_group === 'Bills Receivable' || l.account_name.toLowerCase().includes('bills receivable')) {
        amount = l.debit || l.credit || 0;
      } else if (l.account_group === 'Trade Receivables' || l.account_group === 'Sundry Debtors') {
        drawer = l.account_name;
      }
    }
    return {
      date: e.entry_date,
      drawer,
      amount,
      status: 'Outstanding',
      narration: e.narration,
      jf: e.entry_code,
    };
  });

  const columns = [
    { header: 'Date', key: 'date' },
    { header: 'Drawer', key: 'drawer' },
    { header: 'J.F.', key: 'jf' },
    { header: 'Amount (₹)', key: 'amount', align: 'right' as const, isMono: true },
    { header: 'Status', key: 'status', align: 'center' as const },
    { header: 'Narration', key: 'narration' },
  ];

  const totals = { amount: tableData.reduce((s, r) => s + r.amount, 0) };

  return (
    <div>
      <PageHeader title="Bills Receivable" description="Register of bills of exchange received">
        <div className="flex flex-col gap-2 items-end">
          <DateRangeFilter fromDate={fromDate} toDate={toDate} onDateChange={(f, t) => { setFromDate(f); setToDate(t); }} />
          <ExportButtons title="Bills Receivable" companyName={company.name} entityType={entityLabel} dateRange={`${fromDate} to ${toDate}`} columns={columns} data={tableData} />
        </div>
      </PageHeader>
      {loading ? (
        <div className="flex items-center justify-center py-16"><div className="h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <RegisterFormat
          title="Bills Receivable Register"
          subtitle={`${fromDate} to ${toDate}`}
          companyName={company.name}
          columns={columns}
          data={tableData}
          totals={totals}
          emptyMessage="No bills receivable entries found."
          linkColumns={[
            {
              key: 'jf',
              getHref: (row) =>
                companyId ? `/company/${companyId}/journal?entryCode=${row.jf}` : '#',
            },
            {
              key: 'drawer',
              getHref: (row) =>
                companyId && row.drawer
                  ? `/company/${companyId}/debtors?account=${encodeURIComponent(row.drawer)}`
                  : '#',
            },
          ]}
        />
      )}
    </div>
  );
}
