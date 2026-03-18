'use client';

import { useState, useMemo, useRef } from 'react';
import { useCompany } from '@/hooks/useCompany';
import { useJournalEntries } from '@/hooks/useJournalEntries';
import { PageHeader } from '@/components/layout/PageHeader';
import { TAccountFormat } from '@/components/formats/TAccountFormat';
import { VerticalStatementFormat } from '@/components/formats/VerticalStatementFormat';
import { ProfitLossNotesStrip } from '@/components/financials/ProfitLossNotesStrip';
import { DateRangeFilter } from '@/components/export/DateRangeFilter';
import { ExportButtons } from '@/components/export/ExportButtons';
import { exportElementAsImagePDF } from '@/components/export/exportUtils';
import { getCurrentFY } from '@/lib/utils/dateUtils';
import { formatIndianCurrency } from '@/lib/utils/currencyFormat';
import { ENTITY_TYPES } from '@/lib/constants/entityTypes';
import { getEntityConfig } from '@/lib/entityConfig';
import { computeTradingAccount } from '@/lib/accounting/tradingAccountCompute';
import { computeProfitLoss, computeScheduleIIIPL } from '@/lib/accounting/profitLossCompute';
import type { EntityType } from '@/types/company';

export default function ProfitLossPage() {
  const { company, companyId, loading: companyLoading } = useCompany();
  const fy = getCurrentFY();
  const [fromDate, setFromDate] = useState(fy.start);
  const [toDate, setToDate] = useState(fy.end);
  const statementRef = useRef<HTMLDivElement | null>(null);

  const { entries, loading } = useJournalEntries({
    companyId: companyId || '',
    fromDate,
    toDate,
    enabled: !!companyId,
  });

  const tradingAccount = useMemo(() => computeTradingAccount(entries), [entries]);
  const profitLoss = useMemo(
    () => computeProfitLoss(entries, tradingAccount.grossProfit),
    [entries, tradingAccount.grossProfit]
  );
  const scheduleIII = useMemo(() => computeScheduleIIIPL(entries), [entries]);

  if (companyLoading || !company) {
    return <div className="flex items-center justify-center py-16"><div className="h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>;
  }

  const entityLabel = ENTITY_TYPES[company.entity_type as EntityType]?.label || company.entity_type;
  const entityConfig = getEntityConfig(company.entity_type);
  const isScheduleIII = entityConfig.nav.profitLossFormat === 'schedule_iii';

  const exportColumns = [
    { header: 'Side', key: 'side' },
    { header: 'Particulars', key: 'name' },
    { header: 'Amount (₹)', key: 'amount', align: 'right' as const, isMono: true },
  ];

  const exportData = isScheduleIII
    ? [
        { side: 'Revenue', name: 'Revenue from operations', amount: scheduleIII.revenueFromOperations },
        { side: 'Revenue', name: 'Other income', amount: scheduleIII.otherIncome },
        { side: 'Revenue', name: 'Total Revenue', amount: scheduleIII.totalRevenue },
        { side: 'Expense', name: 'Total Expenses', amount: scheduleIII.totalExpenses },
        { side: 'Profit', name: 'Profit before tax', amount: scheduleIII.profitBeforeTax },
        { side: 'Profit', name: 'Tax expense', amount: scheduleIII.taxExpense },
        { side: 'Profit', name: 'Profit after tax', amount: scheduleIII.profitAfterTax },
      ]
    : [
        ...profitLoss.debitItems.map(i => ({ side: 'Dr', name: i.name, amount: i.amount })),
        ...profitLoss.creditItems.map(i => ({ side: 'Cr', name: i.name, amount: i.amount })),
      ];

  const balancedTotal = Math.max(
    profitLoss.debitItems.reduce((s, i) => s + i.amount, 0),
    profitLoss.creditItems.reduce((s, i) => s + i.amount, 0)
  );

  const pl = scheduleIII;

  return (
    <div>
      <PageHeader
        title="Profit & Loss Account"
        description={isScheduleIII ? 'Statement of Profit and Loss (Schedule III)' : 'Traditional Profit & Loss Account'}
      >
        <div className="flex flex-col gap-2 items-end">
          <DateRangeFilter fromDate={fromDate} toDate={toDate} onDateChange={(f, t) => { setFromDate(f); setToDate(t); }} />
          <ExportButtons
            title="Profit & Loss"
            companyName={company.name}
            entityType={entityLabel}
            dateRange={`${fromDate} to ${toDate}`}
            columns={exportColumns}
            data={exportData}
            onPdf={() =>
              exportElementAsImagePDF({
                element: statementRef.current,
                title: 'Profit & Loss',
                orientation: 'portrait',
              })
            }
          />
        </div>
      </PageHeader>

      {!loading && entries.length > 0 && (
        <div className={
          (isScheduleIII ? scheduleIII.profitAfterTax : profitLoss.netProfit) >= 0
             ? "tally-ok" : "tally-err"}>
          {(isScheduleIII ? scheduleIII.profitAfterTax : profitLoss.netProfit) >= 0
            ? `Net Profit: ${formatIndianCurrency(isScheduleIII ? scheduleIII.profitAfterTax : profitLoss.netProfit)}`
            : `Net Loss: ${formatIndianCurrency(Math.abs(isScheduleIII ? scheduleIII.profitAfterTax : profitLoss.netProfit))}`}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16"><div className="h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>
      ) : isScheduleIII ? (
        <>
          <div ref={statementRef}>
            <VerticalStatementFormat
              title="Statement of Profit and Loss"
              companyName={company.name}
              period={`For the year ended ${toDate}`}
              showPreviousYear={true}
              sections={[
                {
                  heading: 'I. REVENUE FROM OPERATIONS',
                  indent: 0,
                  items: [{
                    label: 'Revenue from operations (Net)',
                    noteNo: '1',
                    currentYear: pl.revenueFromOperations,
                    previousYear: null,
                    isBold: true,
                  }],
                },
                {
                  heading: 'II. OTHER INCOME',
                  indent: 0,
                  items: [{
                    label: 'Other income',
                    noteNo: '2',
                    currentYear: pl.otherIncome,
                    previousYear: null,
                  }],
                },
                {
                  heading: 'III. TOTAL REVENUE (I + II)',
                  indent: 0,
                  items: [{
                    label: 'Total Revenue',
                    currentYear: pl.totalRevenue,
                    previousYear: null,
                    isBold: true,
                    isTotal: true,
                  }],
                },
                {
                  heading: 'IV. EXPENSES',
                  indent: 0,
                  items: [
                    { label: 'Cost of materials consumed', noteNo: '3', currentYear: pl.costOfMaterials, previousYear: null },
                    { label: 'Purchases of stock-in-trade', currentYear: pl.purchasesOfStockInTrade, previousYear: null },
                    { label: 'Changes in inventories of finished goods, WIP & stock-in-trade', noteNo: '4', currentYear: pl.changesInInventories, previousYear: null },
                    { label: 'Employee benefits expense', noteNo: '5', currentYear: pl.employeeBenefits, previousYear: null },
                    { label: 'Finance costs', noteNo: '6', currentYear: pl.financeCosts, previousYear: null },
                    { label: 'Depreciation and amortisation expense', noteNo: '7', currentYear: pl.depreciationAmortisation, previousYear: null },
                    { label: 'Other expenses', noteNo: '8', currentYear: pl.otherExpenses, previousYear: null },
                    { label: 'TOTAL EXPENSES (IV)', currentYear: pl.totalExpenses, previousYear: null, isBold: true, isTotal: true },
                  ],
                },
                {
                  heading: 'V. PROFIT BEFORE EXCEPTIONAL ITEMS AND TAX (III - IV)',
                  indent: 0,
                  items: [{
                    label: 'Profit before exceptional items and tax',
                    currentYear: pl.profitBeforeExceptionalAndTax,
                    previousYear: null,
                    isBold: true,
                    isTotal: true,
                  }],
                },
                {
                  heading: 'VI. Exceptional Items',
                  indent: 0,
                  items: [{ label: 'Exceptional items', currentYear: pl.exceptionalItems, previousYear: null }],
                },
                {
                  heading: 'VII. PROFIT BEFORE TAX (V - VI)',
                  indent: 0,
                  items: [{
                    label: 'Profit before tax',
                    currentYear: pl.profitBeforeTax,
                    previousYear: null,
                    isBold: true,
                    isTotal: true,
                  }],
                },
                {
                  heading: 'VIII. Tax Expense',
                  indent: 0,
                  items: pl.taxExpenseBreakdown.length > 0
                    ? pl.taxExpenseBreakdown.map(t => ({
                      label: t.name, currentYear: t.amount, previousYear: null,
                    }))
                    : [
                      { label: '(a) Current Tax', currentYear: 0, previousYear: null },
                      { label: '(b) Deferred Tax', currentYear: 0, previousYear: null },
                    ],
                },
                {
                  heading: 'IX. PROFIT / (LOSS) FOR THE YEAR (VII - VIII)',
                  indent: 0,
                  items: [{
                    label: pl.profitAfterTax >= 0 ? 'Profit for the year' : 'Loss for the year',
                    currentYear: pl.profitAfterTax,
                    previousYear: null,
                    isBold: true,
                    isTotal: true,
                  }],
                },
                {
                  heading: 'X. Other Comprehensive Income',
                  indent: 0,
                  items: [{ label: 'Other Comprehensive Income', currentYear: 0, previousYear: null }],
                },
                {
                  heading: 'XI. TOTAL COMPREHENSIVE INCOME',
                  indent: 0,
                  items: [{
                    label: 'Total Comprehensive Income',
                    currentYear: pl.profitAfterTax,
                    previousYear: null,
                    isBold: true,
                    isTotal: true,
                  }],
                },
                {
                  heading: 'XII. Earnings Per Share',
                  indent: 0,
                  items: [
                    { label: 'Basic EPS (₹)', currentYear: 0, previousYear: null },
                    { label: 'Diluted EPS (₹)', currentYear: 0, previousYear: null },
                  ],
                },
              ]}
            />
          </div>
          <ProfitLossNotesStrip
            visible={true}
            companyName={company.name}
            entityLabel={entityLabel}
            period={`${fromDate} to ${toDate}`}
            revenueFromOperations={pl.revenueFromOperations}
            revenueBreakdown={pl.revenueFromOperationsBreakdown}
            otherIncomeBreakdown={pl.otherIncomeBreakdown}
            costOfMaterialsBreakdown={pl.costOfMaterialsBreakdown}
            changesInInventoriesBreakdown={pl.changesInInventoriesBreakdown}
            employeeBenefitsBreakdown={pl.employeeBenefitsBreakdown}
            financeCostsBreakdown={pl.financeCostsBreakdown}
            depreciationBreakdown={pl.depreciationAmortisationBreakdown}
            otherExpensesBreakdown={pl.otherExpensesBreakdown}
          />
        </>
      ) : (
        <div ref={statementRef}>
          <TAccountFormat
            title="Profit & Loss Account"
            subtitle={`For the period ${fromDate} to ${toDate}`}
            companyName={company.name}
            leftLabel="Dr."
            rightLabel="Cr."
            leftColumns={[
              { header: 'Particulars', key: 'name' },
              { header: 'Amount (₹)', key: 'amount', align: 'right' },
            ]}
            rightColumns={[
              { header: 'Particulars', key: 'name' },
              { header: 'Amount (₹)', key: 'amount', align: 'right' },
            ]}
            leftData={profitLoss.debitItems}
            rightData={profitLoss.creditItems}
            leftTotal={balancedTotal}
            rightTotal={balancedTotal}
          />
        </div>
      )}
    </div>
  );
}
