'use client';

import { useState, useMemo } from 'react';
import { useCompany } from '@/hooks/useCompany';
import { useJournalEntries } from '@/hooks/useJournalEntries';
import { PageHeader } from '@/components/layout/PageHeader';
import { TAccountFormat } from '@/components/formats/TAccountFormat';
import { VerticalStatementFormat } from '@/components/formats/VerticalStatementFormat';
import { DateRangeFilter } from '@/components/export/DateRangeFilter';
import { ExportButtons } from '@/components/export/ExportButtons';
import { getCurrentFY } from '@/lib/utils/dateUtils';
import { formatIndianCurrency } from '@/lib/utils/currencyFormat';
import { ENTITY_TYPES } from '@/lib/constants/entityTypes';
import { getEntityConfig } from '@/lib/entityConfig';
import { computeTradingAccount } from '@/lib/accounting/tradingAccountCompute';
import { computeProfitLoss } from '@/lib/accounting/profitLossCompute';
import { computeBalanceSheet, computeScheduleIIIBalanceSheet } from '@/lib/accounting/balanceSheetCompute';
import type { EntityType } from '@/types/company';

export default function BalanceSheetPage() {
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

  const tradingAccount = useMemo(() => computeTradingAccount(entries), [entries]);
  const profitLoss = useMemo(() => computeProfitLoss(entries, tradingAccount.grossProfit), [entries, tradingAccount.grossProfit]);

  if (companyLoading || !company) {
    return <div className="flex items-center justify-center py-16"><div className="h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>;
  }

  const entityLabel = ENTITY_TYPES[company.entity_type as EntityType]?.label || company.entity_type;
  const entityConfig = getEntityConfig(company.entity_type);
  const isScheduleIII = entityConfig.nav.balanceSheetFormat === 'schedule_iii';

  return (
    <div>
      <PageHeader title="Balance Sheet" description={isScheduleIII ? 'Balance Sheet (Schedule III)' : 'Traditional Balance Sheet'}>
        <div className="flex flex-col gap-2 items-end">
          <DateRangeFilter fromDate={fromDate} toDate={toDate} onDateChange={(f, t) => { setFromDate(f); setToDate(t); }} />
        </div>
      </PageHeader>

      {loading ? (
        <div className="flex items-center justify-center py-16"><div className="h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>
      ) : isScheduleIII ? (
        <ScheduleIIIView
          entries={entries}
          netProfit={profitLoss.netProfit}
          company={company}
          toDate={toDate}
          entityLabel={entityLabel}
        />
      ) : (
        <TraditionalView
          entries={entries}
          netProfit={profitLoss.netProfit}
          company={company}
          fromDate={fromDate}
          toDate={toDate}
          entityLabel={entityLabel}
        />
      )}
    </div>
  );
}

// Traditional T-format Balance Sheet (Liabilities | Assets)
function TraditionalView({
  entries,
  netProfit,
  company,
  fromDate,
  toDate,
  entityLabel,
}: {
  entries: any[];
  netProfit: number;
  company: any;
  fromDate: string;
  toDate: string;
  entityLabel: string;
}) {
  const bs = useMemo(() => computeBalanceSheet(entries, netProfit, 'traditional'), [entries, netProfit]);

  const leftColumns = [
    { header: 'Particulars', key: 'name' },
    { header: 'Amount (₹)', key: 'amount', align: 'right' as const },
  ];

  const rightColumns = [
    { header: 'Particulars', key: 'name' },
    { header: 'Amount (₹)', key: 'amount', align: 'right' as const },
  ];

  const exportColumns = [
    { header: 'Side', key: 'side' },
    { header: 'Particulars', key: 'name' },
    { header: 'Group', key: 'group' },
    { header: 'Amount (₹)', key: 'amount', align: 'right' as const, isMono: true },
  ];

  const exportData = [
    ...bs.liabilities.map(i => ({ side: 'Liabilities', name: i.name, group: i.group, amount: i.amount })),
    ...bs.assets.map(i => ({ side: 'Assets', name: i.name, group: i.group, amount: i.amount })),
  ];

  const balancedTotal = Math.max(bs.totalLiabilities, bs.totalAssets);

  return (
    <>
      {/* Balance indicator */}
      {entries.length > 0 && (
        <div className={
          bs.balanced
             ? "tally-ok" : "tally-err"}>
          {bs.balanced
            ? 'Balance Sheet is balanced — Liabilities equal Assets.'
            : `Balance Sheet does NOT balance — Difference: ${formatIndianCurrency(Math.abs(bs.totalLiabilities - bs.totalAssets))}`}
        </div>
      )}

      <div className="mb-4 flex justify-end">
        <ExportButtons title="Balance Sheet" companyName={company.name} entityType={entityLabel} dateRange={`As at ${toDate}`} columns={exportColumns} data={exportData} />
      </div>

      <TAccountFormat
        title="Balance Sheet"
        subtitle={`As at ${toDate}`}
        companyName={company.name}
        leftLabel="Liabilities"
        rightLabel="Assets"
        leftColumns={leftColumns}
        rightColumns={rightColumns}
        leftData={bs.liabilities}
        rightData={bs.assets}
        leftTotal={balancedTotal}
        rightTotal={balancedTotal}
      />
    </>
  );
}

// Schedule III Vertical Balance Sheet
function ScheduleIIIView({
  entries,
  netProfit,
  company,
  toDate,
  entityLabel,
}: {
  entries: any[];
  netProfit: number;
  company: any;
  toDate: string;
  entityLabel: string;
}) {
  const bs = useMemo(() => computeScheduleIIIBalanceSheet(entries, netProfit), [entries, netProfit]);

  const exportColumns = [
    { header: 'Section', key: 'section' },
    { header: 'Particulars', key: 'label' },
    { header: 'Note', key: 'noteRef' },
    { header: 'Current Year (₹)', key: 'currentYear', align: 'right' as const, isMono: true },
  ];

  const exportData = [
    ...bs.equityAndLiabilities.flatMap(sec =>
      sec.subheadings.map(sh => ({ section: sec.heading, label: sh.label, noteRef: sh.noteRef || '', currentYear: sh.currentYear }))
    ),
    ...bs.assets.flatMap(sec =>
      sec.subheadings.map(sh => ({ section: sec.heading, label: sh.label, noteRef: sh.noteRef || '', currentYear: sh.currentYear }))
    ),
  ];

  const sections = [
    // Equity & Liabilities side
    ...bs.equityAndLiabilities.map(sec => ({
      heading: sec.heading,
      indent: 1,
      items: [
        ...sec.subheadings.map(sh => ({
          label: sh.label,
          noteNo: sh.noteRef,
          currentYear: sh.currentYear,
          previousYear: sh.previousYear,
          indent: 1,
        })),
        {
          label: `Total ${sec.heading}`,
          currentYear: sec.total,
          previousYear: null,
          isBold: true,
          isTotal: true,
        },
      ],
    })),
    {
      heading: 'TOTAL EQUITY AND LIABILITIES',
      indent: 0,
      items: [{
        label: 'Total',
        currentYear: bs.totalEquityLiabilities,
        previousYear: null,
        isBold: true,
        isTotal: true,
      }],
    },
    // Assets side
    ...bs.assets.map(sec => ({
      heading: sec.heading,
      indent: 1,
      items: [
        ...sec.subheadings.map(sh => ({
          label: sh.label,
          noteNo: sh.noteRef,
          currentYear: sh.currentYear,
          previousYear: sh.previousYear,
          indent: 1,
        })),
        {
          label: `Total ${sec.heading}`,
          currentYear: sec.total,
          previousYear: null,
          isBold: true,
          isTotal: true,
        },
      ],
    })),
    {
      heading: 'TOTAL ASSETS',
      indent: 0,
      items: [{
        label: 'Total',
        currentYear: bs.totalAssets,
        previousYear: null,
        isBold: true,
        isTotal: true,
      }],
    },
  ];

  return (
    <>
      {/* Balance indicator */}
      {entries.length > 0 && (
        <div className={
          Math.abs(bs.totalEquityLiabilities - bs.totalAssets) < 0.01
             ? "tally-ok" : "tally-err"}>
          {Math.abs(bs.totalEquityLiabilities - bs.totalAssets) < 0.01
            ? 'Balance Sheet is balanced — Equity & Liabilities equal Assets.'
            : `Balance Sheet does NOT balance — Difference: ${formatIndianCurrency(Math.abs(bs.totalEquityLiabilities - bs.totalAssets))}`}
        </div>
      )}

      <div className="mb-4 flex justify-end">
        <ExportButtons title="Balance Sheet (Schedule III)" companyName={company.name} entityType={entityLabel} dateRange={`As at ${toDate}`} columns={exportColumns} data={exportData} />
      </div>

      <VerticalStatementFormat
        title="Balance Sheet"
        companyName={company.name}
        period={`As at ${toDate}`}
        sections={sections}
        showPreviousYear={false}
        signatureBlock={true}
      />
    </>
  );
}
