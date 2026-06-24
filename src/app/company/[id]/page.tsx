import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen, Scale, TrendingUp, Building2, Calculator,
  Receipt, Wallet, ArrowRight, ShieldCheck, FileText,
  Users, Package, ArrowRightLeft,
} from 'lucide-react';
import { useCompany } from '@/hooks/useCompany';
import { useEntityConfig } from '@/hooks/useEntityConfig';
import { useJournalEntries } from '@/hooks/useJournalEntries';
import { ENTITY_TYPES, type EntityType } from '@/lib/constants/entityTypes';
import { computeAllBalances } from '@/lib/accounting/computeEngine';
import { computeTradingAccount } from '@/lib/accounting/tradingAccountCompute';
import { computeProfitLoss } from '@/lib/accounting/profitLossCompute';
import { formatIndianCurrency } from '@/lib/utils/currencyFormat';
import { getCurrentFY } from '@/lib/utils/dateUtils';

function shortINR(num: number): string {
  const abs = Math.abs(num);
  const sign = num < 0 ? '-' : '';
  if (abs >= 1_00_00_000) return `${sign}₹${(abs / 1_00_00_000).toFixed(2)} Cr`;
  if (abs >= 1_00_000)    return `${sign}₹${(abs / 1_00_000).toFixed(2)} L`;
  if (abs >= 1_000)       return `${sign}₹${(abs / 1_000).toFixed(1)} K`;
  return `${sign}₹${abs.toFixed(0)}`;
}

export default function CompanyOverviewPage() {
  const { company, companyId, loading } = useCompany();
  const { config } = useEntityConfig();
  const fy = getCurrentFY();

  const { entries, loading: entriesLoading } = useJournalEntries({
    companyId: companyId || '',
    fromDate: fy.start,
    toDate: fy.end,
    enabled: !!companyId,
  });

  const balances    = useMemo(() => computeAllBalances(entries), [entries]);
  const trading     = useMemo(() => computeTradingAccount(entries), [entries]);
  const pl          = useMemo(() => computeProfitLoss(entries, trading.grossProfit), [entries, trading.grossProfit]);

  const cashBalance = useMemo(() => {
    const cashAndBank = balances.filter(b =>
      b.account_group === 'cash_and_bank' ||
      b.account_name.toLowerCase().includes('cash') ||
      b.account_name.toLowerCase().includes('bank')
    );
    return cashAndBank.reduce((sum, b) =>
      sum + (b.balance_type === 'Dr' ? b.balance : -b.balance), 0
    );
  }, [balances]);

  const totalDebtors = useMemo(() =>
    balances
      .filter(b => b.nature === 'asset' && (
        b.account_name.toLowerCase().includes('debtor') ||
        b.account_name.toLowerCase().includes('receivable')
      ))
      .reduce((s, b) => s + b.balance, 0),
  [balances]);

  const totalCreditors = useMemo(() =>
    balances
      .filter(b => b.nature === 'liability' && (
        b.account_name.toLowerCase().includes('creditor') ||
        b.account_name.toLowerCase().includes('payable')
      ))
      .reduce((s, b) => s + b.balance, 0),
  [balances]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!company) {
    return <div className="text-center py-20 text-red-500 text-sm">Company not found</div>;
  }

  const entityMeta = ENTITY_TYPES[company.entity_type as EntityType];
  const netProfit  = pl.netProfit;
  const isProfit   = netProfit >= 0;

  return (
    <div className="space-y-5">

      {/* ── Company header ── */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{company.name}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-[11px] font-semibold border border-blue-100">
                {entityMeta?.label ?? company.entity_type}
              </span>
              <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-[11px] font-semibold">
                {entityMeta?.itrForm}
              </span>
              <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-[11px] font-semibold">
                {company.accounting_method === 'mercantile' ? 'Accrual' : 'Cash'} Basis
              </span>
              {company.gst_status !== 'unregistered' && (
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full text-[11px] font-semibold border border-emerald-100">
                  GST {company.gst_status === 'composition' ? 'Composition' : 'Regular'}
                </span>
              )}
            </div>
          </div>
          <Link
            to={`/company/${companyId}/settings`}
            className="text-xs text-gray-500 hover:text-blue-600 transition-colors border border-gray-200 rounded-xl px-3 py-1.5 hover:border-blue-300"
          >
            Settings
          </Link>
        </div>

        {/* Identity details */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-100">
          {company.entity_details?.pan && (
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">PAN</p>
              <p className="text-sm font-mono font-semibold text-gray-800">{company.entity_details.pan}</p>
            </div>
          )}
          {company.gst_details?.gstin && (
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">GSTIN</p>
              <p className="text-sm font-mono font-semibold text-gray-800">{company.gst_details.gstin}</p>
            </div>
          )}
          {(company.entity_details as any)?.cin && (
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">CIN</p>
              <p className="text-sm font-mono font-semibold text-gray-800">{(company.entity_details as any).cin}</p>
            </div>
          )}
          {company.entity_details?.state && (
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">State</p>
              <p className="text-sm font-semibold text-gray-800">{company.entity_details.state}</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Key metrics ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Journal entries */}
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Journal Entries</p>
          <p className="text-2xl font-bold text-gray-900 font-mono">
            {entriesLoading ? '—' : entries.length}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">This FY</p>
        </div>

        {/* Cash & Bank */}
        <div className={`bg-white border rounded-xl p-4 ${cashBalance < 0 ? 'border-red-200' : 'border-gray-200'}`}>
          <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Cash & Bank</p>
          <p className={`text-2xl font-bold font-mono ${cashBalance < 0 ? 'text-red-600' : 'text-gray-900'}`}>
            {entriesLoading ? '—' : shortINR(cashBalance)}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">Net balance</p>
        </div>

        {/* Net Profit / Loss */}
        <div className={`bg-white border rounded-xl p-4 ${isProfit ? 'border-gray-200' : 'border-red-200'}`}>
          <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">
            {isProfit ? 'Net Profit' : 'Net Loss'}
          </p>
          <p className={`text-2xl font-bold font-mono ${isProfit ? 'text-emerald-600' : 'text-red-600'}`}>
            {entriesLoading ? '—' : shortINR(Math.abs(netProfit))}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">This FY</p>
        </div>

        {/* Accounts */}
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Active Accounts</p>
          <p className="text-2xl font-bold text-gray-900 font-mono">
            {entriesLoading ? '—' : balances.length}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">Ledger accounts</p>
        </div>
      </div>

      {/* ── Debtors / Creditors (only if non-zero) ── */}
      {(totalDebtors > 0 || totalCreditors > 0) && (
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Debtors (Receivable)</p>
            <p className="text-xl font-bold text-blue-600 font-mono">{shortINR(totalDebtors)}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Creditors (Payable)</p>
            <p className="text-xl font-bold text-amber-600 font-mono">{shortINR(totalCreditors)}</p>
          </div>
        </div>
      )}

    </div>
  );
}
