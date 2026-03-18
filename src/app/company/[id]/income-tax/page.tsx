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
import { computeAllBalances } from '@/lib/accounting/computeEngine';
import { computeTDSRegister } from '@/lib/accounting/tdsCompute';
import { getEntityConfig } from '@/lib/entityConfig';
import type { EntityType } from '@/types/company';

// Entity types that use company flat-rate taxation (not slab)
const COMPANY_ENTITIES = ['pvt_ltd', 'public_ltd', 'opc', 'section8'];

// Individual/HUF slab rates (AY 2025-26 Old Regime)
const OLD_SLABS = [
  { upto: 250000, rate: 0 },
  { upto: 500000, rate: 5 },
  { upto: 1000000, rate: 20 },
  { upto: Infinity, rate: 30 },
];

// New Regime (Sec 115BAC) slab rates
const NEW_SLABS = [
  { upto: 300000, rate: 0 },
  { upto: 700000, rate: 5 },
  { upto: 1000000, rate: 10 },
  { upto: 1200000, rate: 15 },
  { upto: 1500000, rate: 20 },
  { upto: Infinity, rate: 30 },
];

function computeSlabTax(income: number, slabs: typeof OLD_SLABS): number {
  if (income <= 0) return 0;
  let tax = 0;
  let prev = 0;
  for (const slab of slabs) {
    if (income <= prev) break;
    const taxable = Math.min(income, slab.upto) - prev;
    tax += taxable * slab.rate / 100;
    prev = slab.upto;
  }
  return Math.round(tax);
}

function computeCompanyTax(income: number, rate: number): number {
  if (income <= 0) return 0;
  return Math.round(income * rate / 100);
}

export default function IncomeTaxPage() {
  const { company, companyId, loading: companyLoading } = useCompany();
  const fy = getCurrentFY();
  const [fromDate, setFromDate] = useState(fy.start);
  const [toDate, setToDate] = useState(fy.end);

  // Regime selection
  const isCompany = company ? COMPANY_ENTITIES.includes(company.entity_type) : false;
  const [regime, setRegime] = useState<'old' | 'new'>('old');
  const [companyRate, setCompanyRate] = useState<'30' | '25' | '22' | '15'>('22');

  // User-entered adjustments
  const [disallowances, setDisallowances] = useState<{ label: string; amount: string }[]>([
    { label: 'Depreciation as per books (add back)', amount: '' },
    { label: 'Penalty / Fine for violation of law', amount: '' },
    { label: 'Cash payments > Rs.10,000 (Sec 40A(3))', amount: '' },
    { label: 'Delayed statutory payments (Sec 43B)', amount: '' },
  ]);
  const [deductions, setDeductions] = useState<{ label: string; amount: string }[]>([
    { label: 'Depreciation as per Income Tax Act (Sec 32)', amount: '' },
    { label: 'Income exempt under IT but credited to P&L', amount: '' },
  ]);
  const [chapterVIA, setChapterVIA] = useState<{ label: string; amount: string }[]>([
    { label: '80C (LIC, PPF, ELSS etc.) — max Rs.1,50,000', amount: '' },
    { label: '80D (Medical Insurance)', amount: '' },
    { label: '80E (Education Loan Interest)', amount: '' },
    { label: '80G (Donations)', amount: '' },
  ]);
  const [advanceTaxPaid, setAdvanceTaxPaid] = useState('');

  const { entries, loading } = useJournalEntries({
    companyId: companyId || '',
    fromDate,
    toDate,
    enabled: !!companyId,
  });

  // Auto-compute net profit from P&L
  const netProfit = useMemo(() => {
    const balances = computeAllBalances(entries);
    const expenseGroups = ['Direct Expenses', 'Indirect Expenses', 'Office Expenses', 'Admin Expenses',
      'Selling Expenses', 'Finance Costs', 'Depreciation', 'Cost of Goods Sold', 'Purchases'];
    const revenueGroups = ['Sales', 'Revenue', 'Direct Income', 'Indirect Income', 'Other Income', 'Non-Operating Income'];
    let totalRevenue = 0;
    let totalExpense = 0;
    for (const b of balances) {
      if (revenueGroups.includes(b.account_group)) totalRevenue += b.balance;
      if (expenseGroups.includes(b.account_group)) totalExpense += b.balance;
    }
    return totalRevenue - totalExpense;
  }, [entries]);

  // TDS credit from register
  const tdsCredit = useMemo(() => {
    const tds = computeTDSRegister(entries);
    return tds.reduce((s, r) => s + r.tdsAmount, 0);
  }, [entries]);

  // TCS credit
  const tcsCredit = useMemo(() => {
    let total = 0;
    for (const entry of entries) {
      for (const line of entry.lines) {
        if (line.account_name.toLowerCase().includes('tcs') && (line.account_group === 'Statutory Liabilities' || line.account_group === 'Duties & Taxes')) {
          total += line.credit || 0;
        }
      }
    }
    return total;
  }, [entries]);

  // Advance tax from entries
  const advanceTaxFromEntries = useMemo(() => {
    let total = 0;
    for (const entry of entries) {
      for (const line of entry.lines) {
        if ((line.account_name.toLowerCase().includes('advance tax') ||
             line.account_name.toLowerCase().includes('advance income tax')) && line.debit > 0) {
          total += line.debit;
        }
      }
    }
    return total;
  }, [entries]);

  if (companyLoading || !company) {
    return <div className="flex items-center justify-center py-16"><div className="h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>;
  }

  const entityLabel = ENTITY_TYPES[company.entity_type as EntityType]?.label || company.entity_type;
  const entityConfig = getEntityConfig(company.entity_type);
  const itrForm = entityConfig.itrForm;

  // Computations
  const totalDisallowances = disallowances.reduce((s, d) => s + (parseFloat(d.amount) || 0), 0);
  const totalDeductions = deductions.reduce((s, d) => s + (parseFloat(d.amount) || 0), 0);
  const pgbpIncome = netProfit + totalDisallowances - totalDeductions;
  const grossTotalIncome = Math.max(pgbpIncome, 0);
  const totalChapterVIA = regime === 'old' ? chapterVIA.reduce((s, d) => s + (parseFloat(d.amount) || 0), 0) : 0;
  const taxableIncome = Math.max(grossTotalIncome - totalChapterVIA, 0);

  // Tax computation
  let baseTax = 0;
  let taxRateLabel = '';
  if (isCompany) {
    const rate = parseFloat(companyRate);
    baseTax = computeCompanyTax(taxableIncome, rate);
    taxRateLabel = `@ ${rate}%`;
  } else {
    const slabs = regime === 'old' ? OLD_SLABS : NEW_SLABS;
    baseTax = computeSlabTax(taxableIncome, slabs);
    taxRateLabel = regime === 'old' ? '(Old Regime Slabs)' : '(New Regime Slabs)';
  }

  // Surcharge (simplified)
  let surchargeRate = 0;
  if (isCompany) {
    if (taxableIncome > 100000000) surchargeRate = 12;
    else if (taxableIncome > 10000000) surchargeRate = 7;
  } else {
    if (taxableIncome > 50000000) surchargeRate = 37;
    else if (taxableIncome > 20000000) surchargeRate = 25;
    else if (taxableIncome > 10000000) surchargeRate = 15;
    else if (taxableIncome > 5000000) surchargeRate = 10;
  }
  const surcharge = Math.round(baseTax * surchargeRate / 100);
  const cessBase = baseTax + surcharge;
  const cess = Math.round(cessBase * 4 / 100); // Health & Education Cess
  const totalTax = baseTax + surcharge + cess;

  const advTaxPaidManual = parseFloat(advanceTaxPaid) || 0;
  const totalAdvanceTax = advTaxPaidManual || advanceTaxFromEntries;
  const taxPayable = totalTax - totalAdvanceTax - tdsCredit - tcsCredit;

  const exportColumns = [
    { header: 'Particulars', key: 'label' },
    { header: 'Amount (₹)', key: 'amount', align: 'right' as const, isMono: true },
  ];

  const exportData = [
    { label: 'Net Profit as per P&L', amount: netProfit },
    { label: 'Add: Disallowances', amount: totalDisallowances },
    { label: 'Less: IT Deductions', amount: -totalDeductions },
    { label: 'PGBP Income', amount: pgbpIncome },
    { label: 'Gross Total Income', amount: grossTotalIncome },
    { label: 'Less: Chapter VI-A Deductions', amount: -totalChapterVIA },
    { label: 'Total Taxable Income', amount: taxableIncome },
    { label: `Tax ${taxRateLabel}`, amount: baseTax },
    { label: `Surcharge @ ${surchargeRate}%`, amount: surcharge },
    { label: 'Health & Education Cess @ 4%', amount: cess },
    { label: 'Total Tax Liability', amount: totalTax },
    { label: 'Less: Advance Tax Paid', amount: -totalAdvanceTax },
    { label: 'Less: TDS Credit', amount: -tdsCredit },
    { label: 'Less: TCS Credit', amount: -tcsCredit },
    { label: taxPayable >= 0 ? 'Tax Payable' : 'Refund Due', amount: taxPayable },
  ];

  const updateAdjustment = (
    list: { label: string; amount: string }[],
    setter: (v: { label: string; amount: string }[]) => void,
    index: number,
    value: string
  ) => {
    const updated = [...list];
    updated[index] = { ...updated[index], amount: value };
    setter(updated);
  };

  const addRow = (
    list: { label: string; amount: string }[],
    setter: (v: { label: string; amount: string }[]) => void,
  ) => {
    setter([...list, { label: '', amount: '' }]);
  };

  return (
    <div>
      <PageHeader title="Income Tax Computation" description={`Working paper for ${isCompany ? company.entity_type === 'section8' ? 'ITR-7' : 'ITR-6' : itrForm || 'ITR'} preparation`}>
        <div className="flex flex-col gap-2 items-end">
          <DateRangeFilter fromDate={fromDate} toDate={toDate} onDateChange={(f, t) => { setFromDate(f); setToDate(t); }} />
          <ExportButtons title="Income Tax Computation" companyName={company.name} entityType={entityLabel} dateRange={`AY ${parseInt(toDate.split('-')[0]) + 1}-${(parseInt(toDate.split('-')[0]) + 2).toString().slice(-2)}`} columns={exportColumns} data={exportData} />
        </div>
      </PageHeader>

      {loading ? (
        <div className="flex items-center justify-center py-16"><div className="h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="space-y-4">
          {/* Regime / Rate selector */}
          <div className="bg-white border border-gray-200 rounded-xl px-4 py-3">
            <div className="flex flex-wrap gap-4 items-center">
              {isCompany ? (
                <>
                  <span className="text-sm font-medium text-gray-700">Tax Rate:</span>
                  <div className="flex border border-gray-200 rounded-xl overflow-hidden">
                    {[
                      { val: '30', label: '30% (Old)' },
                      { val: '25', label: '25% (<₹400Cr)' },
                      { val: '22', label: '22% (115BAA)' },
                      { val: '15', label: '15% (115BAB)' },
                    ].map(opt => (
                      <button
                        key={opt.val}
                        onClick={() => setCompanyRate(opt.val as typeof companyRate)}
                        className={`px-3 py-1.5 text-sm ${companyRate === opt.val ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <span className="text-sm font-medium text-gray-700">Tax Regime:</span>
                  <div className="flex border border-gray-200 rounded-xl overflow-hidden">
                    <button onClick={() => setRegime('old')} className={`px-4 py-1.5 text-sm ${regime === 'old' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}>Old Regime</button>
                    <button onClick={() => setRegime('new')} className={`px-4 py-1.5 text-sm ${regime === 'new' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}>New Regime (115BAC)</button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Main computation */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="text-center py-3 border-b border-gray-200 bg-gray-50/50">
              <p className="text-[11px] text-gray-400 uppercase tracking-wide">{company.name} · PAN: {company.entity_details?.pan || '—'}</p>
              <h3 className="text-sm font-bold text-gray-900">Computation of Total Income and Tax Liability</h3>
              <p className="text-xs text-gray-400 mt-0.5">Assessment Year {parseInt(toDate.split('-')[0]) + 1}-{(parseInt(toDate.split('-')[0]) + 2).toString().slice(-2)}</p>
            </div>

            <div className="p-6 space-y-6">
              {/* Section 1: Net Profit */}
              <div>
                <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 border-b border-gray-100 pb-1.5">INCOME FROM BUSINESS / PROFESSION</h4>
                <div className="flex justify-between items-center py-1.5">
                  <span className="text-sm text-gray-700">Net Profit as per Statement of Profit & Loss</span>
                  <span className={`text-sm font-mono font-semibold ${netProfit >= 0 ? 'text-green-700' : 'text-red-600'}`}>
                    {formatIndianCurrency(Math.abs(netProfit))} {netProfit < 0 ? '(Loss)' : ''}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mb-3">(Auto-computed from journal entries)</p>

                {/* Disallowances */}
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mt-4 mb-1.5">Add: Expenses disallowed under Income Tax</p>
                {disallowances.map((d, i) => (
                  <div key={i} className="flex gap-2 items-center mb-1">
                    <input
                      type="text"
                      value={d.label}
                      onChange={e => {
                        const updated = [...disallowances];
                        updated[i] = { ...updated[i], label: e.target.value };
                        setDisallowances(updated);
                      }}
                      className="flex-1 px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Description"
                    />
                    <input
                      type="number"
                      value={d.amount}
                      onChange={e => updateAdjustment(disallowances, setDisallowances, i, e.target.value)}
                      className="w-36 px-2 py-1 text-sm text-right font-mono border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="0"
                    />
                  </div>
                ))}
                <button onClick={() => addRow(disallowances, setDisallowances)} className="text-xs text-blue-600 hover:underline mt-1">+ Add disallowance</button>

                {/* Deductions */}
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mt-4 mb-1.5">Less: Income/Deductions allowable under IT</p>
                {deductions.map((d, i) => (
                  <div key={i} className="flex gap-2 items-center mb-1">
                    <input
                      type="text"
                      value={d.label}
                      onChange={e => {
                        const updated = [...deductions];
                        updated[i] = { ...updated[i], label: e.target.value };
                        setDeductions(updated);
                      }}
                      className="flex-1 px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Description"
                    />
                    <input
                      type="number"
                      value={d.amount}
                      onChange={e => updateAdjustment(deductions, setDeductions, i, e.target.value)}
                      className="w-36 px-2 py-1 text-sm text-right font-mono border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="0"
                    />
                  </div>
                ))}
                <button onClick={() => addRow(deductions, setDeductions)} className="text-xs text-blue-600 hover:underline mt-1">+ Add deduction</button>

                {/* PGBP */}
                <div className="flex justify-between items-center py-2 mt-3 border-t border-gray-200 font-bold">
                  <span className="text-sm">Income under head &quot;PGBP&quot;</span>
                  <span className="text-sm font-mono">{formatIndianCurrency(pgbpIncome)}</span>
                </div>
              </div>

              {/* Section 2: Gross Total Income */}
              <div>
                <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 border-b border-gray-100 pb-1.5">GROSS TOTAL INCOME</h4>
                <div className="flex justify-between items-center py-1.5 font-bold">
                  <span className="text-sm">Gross Total Income</span>
                  <span className="text-sm font-mono">{formatIndianCurrency(grossTotalIncome)}</span>
                </div>
              </div>

              {/* Section 3: Chapter VI-A (Old regime only for individuals) */}
              {(!isCompany && regime === 'old') && (
                <div>
                  <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 border-b border-gray-100 pb-1.5">DEDUCTIONS UNDER CHAPTER VI-A</h4>
                  {chapterVIA.map((d, i) => (
                    <div key={i} className="flex gap-2 items-center mb-1">
                      <input
                        type="text"
                        value={d.label}
                        onChange={e => {
                          const updated = [...chapterVIA];
                          updated[i] = { ...updated[i], label: e.target.value };
                          setChapterVIA(updated);
                        }}
                        className="flex-1 px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Section"
                      />
                      <input
                        type="number"
                        value={d.amount}
                        onChange={e => updateAdjustment(chapterVIA, setChapterVIA, i, e.target.value)}
                        className="w-36 px-2 py-1 text-sm text-right font-mono border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="0"
                      />
                    </div>
                  ))}
                  <button onClick={() => addRow(chapterVIA, setChapterVIA)} className="text-xs text-blue-600 hover:underline mt-1">+ Add deduction</button>
                  <div className="flex justify-between items-center py-1.5 mt-2 border-t border-gray-200 font-medium">
                    <span className="text-sm">Total Chapter VI-A Deductions</span>
                    <span className="text-sm font-mono">({formatIndianCurrency(totalChapterVIA)})</span>
                  </div>
                </div>
              )}

              {regime === 'new' && !isCompany && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-2">
                  <p className="text-sm text-yellow-700">New Regime (Sec 115BAC): Chapter VI-A deductions (except 80CCD(2)) are NOT available.</p>
                </div>
              )}

              {/* Section 4: Taxable Income */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-blue-800">TOTAL TAXABLE INCOME</span>
                  <span className="text-lg font-bold font-mono text-blue-700">{formatIndianCurrency(taxableIncome)}</span>
                </div>
              </div>

              {/* Section 5: Tax Computation */}
              <div>
                <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 border-b border-gray-100 pb-1.5">TAX COMPUTATION</h4>
                <div className="space-y-1">
                  <div className="flex justify-between items-center py-1">
                    <span className="text-sm text-gray-700">Tax on Total Income {taxRateLabel}</span>
                    <span className="text-sm font-mono">{formatIndianCurrency(baseTax)}</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-sm text-gray-700">Add: Surcharge @ {surchargeRate}%</span>
                    <span className="text-sm font-mono">{formatIndianCurrency(surcharge)}</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-sm text-gray-700">Add: Health & Education Cess @ 4%</span>
                    <span className="text-sm font-mono">{formatIndianCurrency(cess)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-t border-gray-200 font-bold">
                    <span className="text-sm">TOTAL TAX LIABILITY</span>
                    <span className="text-sm font-mono">{formatIndianCurrency(totalTax)}</span>
                  </div>
                </div>
              </div>

              {/* Section 6: Credits */}
              <div>
                <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 border-b border-gray-100 pb-1.5">LESS: TAX CREDITS</h4>
                <div className="space-y-1">
                  <div className="flex justify-between items-center py-1">
                    <div className="flex-1">
                      <span className="text-sm text-gray-700">Advance Tax Paid</span>
                      {advanceTaxFromEntries > 0 && !advanceTaxPaid && (
                        <span className="text-xs text-gray-400 ml-2">(auto from entries)</span>
                      )}
                    </div>
                    <input
                      type="number"
                      value={advanceTaxPaid || (advanceTaxFromEntries > 0 ? advanceTaxFromEntries.toString() : '')}
                      onChange={e => setAdvanceTaxPaid(e.target.value)}
                      className="w-36 px-2 py-1 text-sm text-right font-mono border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="0"
                    />
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-sm text-gray-700">TDS Credit</span>
                    <span className="text-sm font-mono">({formatIndianCurrency(tdsCredit)})</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-sm text-gray-700">TCS Credit</span>
                    <span className="text-sm font-mono">({formatIndianCurrency(tcsCredit)})</span>
                  </div>
                </div>
              </div>

              {/* Final result */}
              <div className={`rounded-xl px-4 py-3 border ${taxPayable >= 0 ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
                <div className="flex justify-between items-center">
                  <span className={`text-sm font-bold ${taxPayable >= 0 ? 'text-red-800' : 'text-green-800'}`}>
                    {taxPayable >= 0 ? 'NET TAX PAYABLE' : 'REFUND DUE'}
                  </span>
                  <span className={`text-xl font-bold font-mono ${taxPayable >= 0 ? 'text-red-700' : 'text-green-700'}`}>
                    {formatIndianCurrency(Math.abs(taxPayable))}
                  </span>
                </div>
              </div>

              {/* Slab table for individuals */}
              {!isCompany && (
                <div className="mt-4">
                  <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Tax Slab Rates — {regime === 'old' ? 'Old Regime' : 'New Regime (115BAC)'}</h4>
                  <table className="w-full text-sm border border-gray-200 rounded overflow-hidden">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-3 py-2 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Income Slab</th>
                        <th className="px-3 py-2 text-right text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(regime === 'old' ? OLD_SLABS : NEW_SLABS).map((slab, i, arr) => (
                        <tr key={i} className="border-b border-gray-100">
                          <td className="px-3 py-1 text-gray-700">
                            {i === 0 ? `Upto ${formatIndianCurrency(slab.upto)}` :
                             slab.upto === Infinity ? `Above ${formatIndianCurrency(arr[i - 1].upto)}` :
                             `${formatIndianCurrency(arr[i - 1].upto + 1)} to ${formatIndianCurrency(slab.upto)}`}
                          </td>
                          <td className="px-3 py-1 text-right font-mono">{slab.rate}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Note */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-sm text-blue-700">
                <p className="font-medium">This is a WORKING PAPER</p>
                <p className="mt-1 text-xs">Not filed directly. Used to prepare {isCompany ? 'ITR-6' : itrForm || 'ITR'}. User must verify all disallowances and deductions. Consult a tax professional for accuracy.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
