import React, { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCompany } from '@/hooks/useCompany';
import { useEntityConfig } from '@/hooks/useEntityConfig';
import {
  BookOpen, Wallet, Coins, ClipboardList, ClipboardMinus,
  FileText, Users, Scale, TrendingUp, TrendingDown, BarChart3,
  Building2, ArrowRightLeft, Receipt, Briefcase, RefreshCw,
  Landmark, ScrollText, Home, PiggyBank, FileQuestion,
  ClipboardCheck, Building, Banknote, Calculator, FileSpreadsheet,
  IndianRupee, Clock, ArrowLeftRight, ShieldCheck, Globe, Percent,
  FileCheck, FileSignature, PieChart, Link2, CheckSquare, Package,
  Settings, Sparkles, type LucideIcon,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

interface NavGroup {
  heading: string;
  items: NavItem[];
}

export const Sidebar = React.memo(function Sidebar() {
  const { pathname } = useLocation();
  const { company, companyId, loading } = useCompany();
  const { config } = useEntityConfig();

  // Memoize groups — only recompute when config or companyId changes (NOT on pathname change)
  const groups = useMemo(() => {
    if (!config || !companyId) return null;

    const base = `/company/${companyId}`;
    const nav = config.nav;
    const g: NavGroup[] = [];

    // CORE
    g.push({
      heading: 'CORE',
      items: [
        ...(nav.journal ? [{ label: 'Journal', href: `${base}/journal`, icon: BookOpen }] : []),
        ...(nav.cashBook ? [{ label: 'Cash Book', href: `${base}/cash-book`, icon: Wallet }] : []),
        ...(nav.pettyCash ? [{ label: 'Petty Cash', href: `${base}/petty-cash`, icon: Coins }] : []),
      ],
    });

    // REGISTERS
    const registerItems: NavItem[] = [];
    if (nav.purchaseRegister !== 'never') registerItems.push({ label: 'Purchase', href: `${base}/purchase-register`, icon: ClipboardList });
    if (nav.salesRegister !== 'never') registerItems.push({ label: 'Sales', href: `${base}/sales-register`, icon: ClipboardList });
    if (nav.purchaseReturns !== 'never') registerItems.push({ label: 'Purchase Returns', href: `${base}/purchase-returns`, icon: ClipboardMinus });
    if (nav.salesReturns !== 'never') registerItems.push({ label: 'Sales Returns', href: `${base}/sales-returns`, icon: ClipboardMinus });
    if (nav.billsReceivable) registerItems.push({ label: 'Bills Receivable', href: `${base}/bills-receivable`, icon: FileText });
    if (nav.billsPayable) registerItems.push({ label: 'Bills Payable', href: `${base}/bills-payable`, icon: FileText });
    if (registerItems.length > 0) g.push({ heading: 'REGISTERS', items: registerItems });

    // LEDGERS
    const ledgerItems: NavItem[] = [];
    if (nav.ledger) ledgerItems.push({ label: 'Ledger Accounts', href: `${base}/ledger`, icon: BookOpen });
    if (nav.debtors) ledgerItems.push({ label: 'Debtors', href: `${base}/debtors`, icon: Users });
    if (nav.creditors) ledgerItems.push({ label: 'Creditors', href: `${base}/creditors`, icon: Users });
    if (ledgerItems.length > 0) g.push({ heading: 'LEDGERS', items: ledgerItems });

    // FINANCIAL STATEMENTS
    const fsItems: NavItem[] = [];
    if (nav.trialBalance) fsItems.push({ label: 'Trial Balance', href: `${base}/trial-balance`, icon: Scale });
    if (nav.tradingAccount !== 'never') {
      fsItems.push({ label: 'Trading Account', href: `${base}/trading-account`, icon: TrendingUp });
      fsItems.push({ label: 'COGS Working', href: `${base}/cogs-working`, icon: FileSpreadsheet });
    }
    if (nav.profitLoss) fsItems.push({ label: 'Profit & Loss', href: `${base}/profit-loss`, icon: BarChart3 });
    if (nav.plAppropriation) fsItems.push({ label: 'P&L Appropriation', href: `${base}/pl-appropriation`, icon: BarChart3 });
    if (nav.balanceSheet) {
      fsItems.push({ label: 'Balance Sheet', href: `${base}/balance-sheet`, icon: Building2 });
      if (nav.bsNotes) {
        fsItems.push({ label: 'Balance Sheet Notes', href: `${base}/bs-notes`, icon: FileText });
      }
    }
    if (nav.cashFlowStatement !== 'never') fsItems.push({ label: 'Cash Flow Statement', href: `${base}/cash-flow`, icon: ArrowRightLeft });
    if (nav.fundsFlowStatement !== 'never') fsItems.push({ label: 'Funds Flow Statement', href: `${base}/funds-flow`, icon: ArrowRightLeft });
    if (nav.ratioAnalysis) fsItems.push({ label: 'Ratio Analysis', href: `${base}/ratio-analysis`, icon: BarChart3 });
    if (nav.incomeExpenditure) fsItems.push({ label: 'Income & Expenditure', href: `${base}/income-expenditure`, icon: Receipt });
    if (nav.receiptsPayments) fsItems.push({ label: 'Receipts & Payments', href: `${base}/receipts-payments`, icon: Receipt });
    if (fsItems.length > 0) g.push({ heading: 'FINANCIAL STATEMENTS', items: fsItems });

    // SPECIAL ACCOUNTS
    const specialItems: NavItem[] = [];
    if (nav.partnersCapital) specialItems.push({ label: "Partners' Capital", href: `${base}/partners-capital`, icon: Briefcase });
    if (nav.revaluation) specialItems.push({ label: 'Revaluation Account', href: `${base}/revaluation`, icon: RefreshCw });
    if (nav.realisation) specialItems.push({ label: 'Realisation Account', href: `${base}/realisation`, icon: FileText });
    if (nav.shareCapital) specialItems.push({ label: 'Share Capital', href: `${base}/share-capital`, icon: Landmark });
    if (nav.debentures !== 'never') specialItems.push({ label: 'Debentures', href: `${base}/debentures`, icon: ScrollText });
    if (nav.kartaCapital) specialItems.push({ label: "Karta's Capital", href: `${base}/karta-capital`, icon: Home });
    if (nav.fundAccounts) specialItems.push({ label: 'Fund Accounts', href: `${base}/fund-accounts`, icon: PiggyBank });
    if (nav.incompleteRecords) specialItems.push({ label: 'Incomplete Records', href: `${base}/incomplete-records`, icon: FileQuestion });
    if (nav.memberRegister) specialItems.push({ label: 'Member Register', href: `${base}/member-register`, icon: ClipboardCheck });
    if (specialItems.length > 0) g.push({ heading: 'SPECIAL ACCOUNTS', items: specialItems });

    // ASSETS & DEPRECIATION
    const assetItems: NavItem[] = [];
    // Fixed Assets, Investments, Loans and Depreciation are hidden for now (future update).
    // if (nav.fixedAssets) assetItems.push({ label: 'Fixed Assets', href: `${base}/fixed-assets`, icon: Building });
    // if (nav.investments !== 'never') assetItems.push({ label: 'Investments', href: `${base}/investments`, icon: TrendingUp });
    // if (nav.loans !== 'never') assetItems.push({ label: 'Loans', href: `${base}/loans`, icon: Banknote });
    // if (nav.depreciation) assetItems.push({ label: 'Depreciation', href: `${base}/depreciation`, icon: TrendingDown });
    if (assetItems.length > 0) g.push({ heading: 'ASSETS & DEPRECIATION', items: assetItems });

    // TAX & COMPLIANCE
    const taxItems: NavItem[] = [];
    if (nav.gst !== 'never') taxItems.push({ label: 'GST', href: `${base}/gst`, icon: Receipt });
    if (nav.incomeTax || nav.taxComputation) {
      taxItems.push({
        label: nav.taxComputation ? 'Tax Computation' : 'Income Tax',
        href: `${base}/income-tax`,
        icon: Calculator,
      });
    }
    if (nav.tdsRegister !== 'never') taxItems.push({ label: 'TDS Register', href: `${base}/tds-register`, icon: FileSpreadsheet });
    if (nav.tcsRegister !== 'never') taxItems.push({ label: 'TCS Register', href: `${base}/tcs-register`, icon: FileSpreadsheet });
    if (nav.advanceTax) taxItems.push({ label: 'Advance Tax', href: `${base}/advance-tax`, icon: IndianRupee });
    if (nav.deferredTax) taxItems.push({ label: 'Deferred Tax', href: `${base}/deferred-tax`, icon: Clock });
    if (nav.brs) taxItems.push({ label: 'Bank Reconciliation', href: `${base}/brs`, icon: ArrowLeftRight });
    if (nav.msmeDisclosure) taxItems.push({ label: 'MSME Disclosure', href: `${base}/msme-disclosure`, icon: FileSpreadsheet });
    if (taxItems.length > 0) g.push({ heading: 'TAX & COMPLIANCE', items: taxItems });

    // AUDIT & REPORTS
    const auditItems: NavItem[] = [];
    if (nav.audit !== 'never') auditItems.push({ label: 'Audit', href: `${base}/audit`, icon: ShieldCheck });
    if (nav.fcra !== 'never') auditItems.push({ label: 'FCRA', href: `${base}/fcra`, icon: Globe });
    if (nav.applicationCheck) auditItems.push({ label: '85% Application', href: `${base}/application-check`, icon: Percent });
    if (nav.form10b) auditItems.push({ label: 'Form 10B', href: `${base}/form-10b`, icon: FileCheck });
    if (nav.llpForms) auditItems.push({ label: 'LLP Forms', href: `${base}/llp-forms`, icon: FileSignature });
    if (nav.segmentReporting) auditItems.push({ label: 'Segment Reporting', href: `${base}/segment-reporting`, icon: PieChart });
    const disclosureLevel = (company?.entity_details as { disclosureLevel?: 'I' | 'II' | 'III' | 'IV' } | undefined)?.disclosureLevel;
    const levelShowsDisclosure = disclosureLevel === 'I' || disclosureLevel === 'II';
    if (nav.relatedParty || (nav.relatedPartyByLevel && levelShowsDisclosure)) auditItems.push({ label: 'Related Party', href: `${base}/related-party`, icon: Link2 });
    if (nav.accountingPolicies || (nav.accountingPoliciesByLevel && levelShowsDisclosure)) auditItems.push({ label: 'Accounting Policies', href: `${base}/accounting-policies`, icon: FileText });
    if (nav.asChecklist || (nav.asChecklistByLevel && levelShowsDisclosure)) auditItems.push({ label: 'AS Checklist', href: `${base}/as-checklist`, icon: CheckSquare });
    if (nav.contingentLiabilities) auditItems.push({ label: 'Contingent Liabilities', href: `${base}/contingent-liabilities`, icon: FileText });
    if (nav.directorsReport) auditItems.push({ label: "Director's Report", href: `${base}/directors-report`, icon: FileText });
    if (nav.caro) auditItems.push({ label: 'CARO', href: `${base}/caro`, icon: CheckSquare });
    if (nav.formN) auditItems.push({ label: 'Form N', href: `${base}/form-n`, icon: FileText });
    if (auditItems.length > 0) g.push({ heading: 'AUDIT & REPORTS', items: auditItems });

    // INVENTORY
    if (nav.inventory !== 'never') {
      g.push({ heading: 'INVENTORY', items: [{ label: 'Inventory', href: `${base}/inventory`, icon: Package }] });
    }

    return g;
  }, [config, companyId, company]);

  if (loading || !groups) {
    return (
      <aside className="w-52 bg-white border-r border-gray-200 h-full shrink-0 flex flex-col min-h-0">
      <div className="p-3 space-y-2 flex-1 overflow-y-auto min-h-0">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-7 bg-gray-100 rounded-md animate-pulse" />
        ))}
      </div>
    </aside>
    );
  }

  const base = `/company/${companyId}`;

  return (
    <aside className="w-52 bg-white border-r border-gray-200 h-full shrink-0 flex flex-col min-h-0">
      <nav className="py-2 flex-1 overflow-y-auto min-h-0">
        {/* AI shortcut (top-level route, always visible) */}
        <div className="mb-2 px-1.5">
          {(() => {
            const href = `${base}/ai`;
            const isActive = pathname === href || pathname?.startsWith(href + '/');
            return (
              <Link
                to={href}
                className={`flex items-center gap-2.5 px-3 py-1.5 mx-0 rounded-md text-[13px] font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Sparkles className={`h-3.5 w-3.5 shrink-0 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                <span className="truncate">AI</span>
              </Link>
            );
          })()}
        </div>

        {groups.map((group) => (
          <div key={group.heading} className="mb-1">
            <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest px-3 py-1.5 mt-1">
              {group.heading}
            </p>
            {group.items.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center gap-2.5 px-3 py-1.5 mx-1.5 rounded-md text-[13px] font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <item.icon className={`h-3.5 w-3.5 shrink-0 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Settings fixed at bottom */}
      <div className="border-t border-gray-200 mt-1 pt-1 pb-2 shrink-0">
        <Link
          to={`${base}/settings`}
          className={`flex items-center gap-2.5 px-3 py-1.5 mx-1.5 rounded-md text-[13px] font-medium transition-colors ${
            pathname === `${base}/settings`
              ? 'bg-blue-50 text-blue-700'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          }`}
        >
          <Settings className={`h-3.5 w-3.5 shrink-0 ${pathname === `${base}/settings` ? 'text-blue-600' : 'text-gray-400'}`} />
          <span>Settings</span>
        </Link>
      </div>
    </aside>
  );
});
