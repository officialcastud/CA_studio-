'use client';

import { useState, useEffect, useCallback } from 'react';
import { useCompany } from '@/hooks/useCompany';
import { PageHeader } from '@/components/layout/PageHeader';
import { ENTITY_TYPES } from '@/lib/constants/entityTypes';
import { getEntityConfig } from '@/lib/entityConfig';
import type { EntityType, EntityDetails } from '@/types/company';

type Tab = 'general' | 'financial-year' | 'chart-of-accounts' | 'book-closing' | 'export';

export default function SettingsPage() {
  const { company, companyId, loading: companyLoading, updateCompany } = useCompany();
  const [activeTab, setActiveTab] = useState<Tab>('general');

  // General settings state
  const [companyName, setCompanyName] = useState('');
  const [address, setAddress] = useState('');
  const [pan, setPan] = useState('');
  const [gstin, setGstin] = useState('');
  const [disclosureLevel, setDisclosureLevel] = useState<'I' | 'II' | 'III' | 'IV' | ''>('');

  // Financial Year
  const [fyStartMonth, setFyStartMonth] = useState('4'); // April

  // Book Closing
  const [closingDate, setClosingDate] = useState('');
  const [closingNarration, setClosingNarration] = useState('Being closing entries for the financial year');

  // Export preferences
  const [exportFormat, setExportFormat] = useState<'pdf' | 'excel' | 'csv'>('pdf');
  const [showJECodes, setShowJECodes] = useState(false);
  const [companyLogo, setCompanyLogo] = useState('');

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [exportSaveStatus, setExportSaveStatus] = useState<'idle' | 'saved'>('idle');

  // Initialize form from company once when company loads
  useEffect(() => {
    if (!company) return;
    setCompanyName(company.name);
    setAddress(company.entity_details?.address || '');
    setPan(company.entity_details?.pan || '');
    setGstin(company.gst_details?.gstin || '');
    const level = (company.entity_details as { disclosureLevel?: 'I' | 'II' | 'III' | 'IV' } | undefined)?.disclosureLevel;
    setDisclosureLevel(level || '');
  }, [company?.id]);

  const handleSaveGeneral = useCallback(async () => {
    if (!companyId || !company) return;
    setSaveStatus('saving');
    try {
      const entityDetails: EntityDetails = {
        ...company.entity_details,
        address: address || undefined,
        pan: pan || undefined,
        ...(disclosureLevel ? { disclosureLevel: disclosureLevel as 'I' | 'II' | 'III' | 'IV' } : {}),
      };
      await updateCompany({
        name: companyName.trim() || company.name,
        entity_details: entityDetails,
        gst_details: { ...company.gst_details, gstin: gstin.trim() || undefined },
      });
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  }, [companyId, company, companyName, address, pan, gstin, disclosureLevel, updateCompany]);

  const EXPORT_PREFS_KEY = 'ca_export_prefs_';
  useEffect(() => {
    if (!companyId || typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(EXPORT_PREFS_KEY + companyId);
      if (raw) {
        const p = JSON.parse(raw) as { exportFormat?: string; showJECodes?: boolean; companyLogo?: string };
        if (p.exportFormat && ['pdf', 'excel', 'csv'].includes(p.exportFormat)) setExportFormat(p.exportFormat as 'pdf' | 'excel' | 'csv');
        if (typeof p.showJECodes === 'boolean') setShowJECodes(p.showJECodes);
        if (typeof p.companyLogo === 'string') setCompanyLogo(p.companyLogo);
      }
    } catch {
      // ignore
    }
  }, [companyId]);

  const handleSaveExportPrefs = useCallback(() => {
    if (!companyId || typeof window === 'undefined') return;
    try {
      localStorage.setItem(EXPORT_PREFS_KEY + companyId, JSON.stringify({ exportFormat, showJECodes, companyLogo }));
      setExportSaveStatus('saved');
      setTimeout(() => setExportSaveStatus('idle'), 2000);
    } catch {
      // ignore
    }
  }, [companyId, exportFormat, showJECodes, companyLogo]);

  if (companyLoading || !company) {
    return <div className="flex items-center justify-center py-16"><div className="h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>;
  }

  const entityLabel = ENTITY_TYPES[company.entity_type as EntityType]?.label || company.entity_type;
  const entityConfig = getEntityConfig(company.entity_type);
  const showDisclosureLevel = entityConfig?.nav?.relatedPartyByLevel === true;

  const tabs: { key: Tab; label: string }[] = [
    { key: 'general', label: 'General' },
    { key: 'financial-year', label: 'Financial Year' },
    { key: 'chart-of-accounts', label: 'Chart of Accounts' },
    { key: 'book-closing', label: 'Book Closing' },
    { key: 'export', label: 'Export & Print' },
  ];

  return (
    <div>
      <PageHeader title="Settings" description={`${entityLabel} — company settings and configuration`} />

      {/* Tab selector */}
      <div className="mb-4 flex border border-gray-200 rounded-xl overflow-hidden w-fit flex-wrap">
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`px-4 py-2 text-sm whitespace-nowrap ${activeTab === tab.key ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}>{tab.label}</button>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {/* Tab: General */}
        {activeTab === 'general' && (
          <div className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-gray-900 mb-3">General Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Company / Entity Name</label><input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} className="w-full h-9 px-3 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
              <div><label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Entity Type</label><input type="text" value={entityLabel} readOnly className="w-full h-9 px-3 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-default" /></div>
              <div className="sm:col-span-2"><label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Address</label><textarea value={address} onChange={e => setAddress(e.target.value)} rows={2} className="w-full h-9 px-3 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y" /></div>
              <div><label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">PAN</label><input type="text" value={pan} onChange={e => setPan(e.target.value)} placeholder="AAAAA0000A" maxLength={10} className="w-full h-9 px-3 text-sm font-mono border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
              <div><label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">GSTIN</label><input type="text" value={gstin} onChange={e => setGstin(e.target.value)} placeholder="22AAAAA0000A1Z5" maxLength={15} className="w-full h-9 px-3 text-sm font-mono border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
            </div>
            <div className="pt-4 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Entity Configuration</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="bg-gray-50 rounded p-2"><span className="text-gray-500">ITR Form:</span> <span className="font-medium">{entityConfig.itrForm}</span></div>
                <div className="bg-gray-50 rounded p-2"><span className="text-gray-500">Audit Form:</span> <span className="font-medium">{entityConfig.nav.auditForm}</span></div>
                <div className="bg-gray-50 rounded p-2"><span className="text-gray-500">P&L Format:</span> <span className="font-medium">{entityConfig.nav.profitLossFormat}</span></div>
                <div className="bg-gray-50 rounded p-2"><span className="text-gray-500">BS Format:</span> <span className="font-medium">{entityConfig.nav.balanceSheetFormat}</span></div>
              </div>
              {showDisclosureLevel && (
                <div className="mt-3">
                  <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">ICAI disclosure level (non-corporate)</label>
                  <select value={disclosureLevel} onChange={e => setDisclosureLevel(e.target.value as 'I' | 'II' | 'III' | 'IV' | '')} className="w-full max-w-xs px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">— Not set —</option>
                    <option value="I">Level I (e.g. turnover &gt; ₹50 cr or borrowings &gt; ₹10 cr)</option>
                    <option value="II">Level II</option>
                    <option value="III">Level III</option>
                    <option value="IV">Level IV</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Level I or II enables Related Party, Accounting Policies, and AS Checklist in the nav.</p>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleSaveGeneral}
                disabled={saveStatus === 'saving'}
                className="px-6 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {saveStatus === 'saving' ? 'Saving…' : 'Save Changes'}
              </button>
              {saveStatus === 'saved' && <span className="text-sm text-green-600">Saved.</span>}
              {saveStatus === 'error' && <span className="text-sm text-red-600">Save failed.</span>}
            </div>
          </div>
        )}

        {/* Tab: Financial Year */}
        {activeTab === 'financial-year' && (
          <div className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-gray-900 mb-3">Financial Year Settings</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Financial Year Start Month</label>
                <select value={fyStartMonth} onChange={e => setFyStartMonth(e.target.value)} className="w-full h-9 px-3 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="1">January</option><option value="4">April (Default India)</option><option value="7">July</option><option value="10">October</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Current FY</label>
                <input type="text" value={company.financial_year_start || '—'} readOnly className="w-full h-9 px-3 text-sm font-mono border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-default" />
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-sm text-blue-700">
              <p className="font-medium">Note:</p>
              <p className="text-xs mt-1">In India, the standard financial year runs from April 1 to March 31. Changing the FY start month will affect all date-based computations.</p>
            </div>
          </div>
        )}

        {/* Tab: Chart of Accounts */}
        {activeTab === 'chart-of-accounts' && (
          <div className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-gray-900 mb-3">Chart of Accounts</h3>
            <p className="text-sm text-gray-500">Account groups are auto-created from journal entries. The system uses these standard groups:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {[
                { group: 'Assets', items: ['Cash & Cash Equivalents', 'Bank Balances', 'Trade Receivables', 'Tangible Fixed Assets', 'Non-current Investments', 'Inventories', 'Short-term Loans & Advances'] },
                { group: 'Liabilities', items: ['Trade Payables', 'Statutory Liabilities', 'Short-term Provisions', 'Long-term Borrowings', 'Short-term Borrowings'] },
                { group: 'Capital', items: ['Share Capital', 'Reserves & Surplus'] },
                { group: 'Revenue', items: ['Sales', 'Revenue', 'Direct Income', 'Indirect Income', 'Other Income'] },
                { group: 'Expenses', items: ['Purchases', 'Direct Expenses', 'Indirect Expenses', 'Office Expenses', 'Admin Expenses', 'Selling Expenses'] },
                { group: 'Tax', items: ['Finance Costs', 'Depreciation', 'Non-Operating Income'] },
              ].map(cat => (
                <div key={cat.group} className="border border-gray-200 rounded-xl p-3">
                  <p className="text-sm font-bold text-gray-800 mb-1">{cat.group}</p>
                  <ul className="text-xs text-gray-600 space-y-0.5">
                    {cat.items.map(item => <li key={item}>- {item}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab: Book Closing */}
        {activeTab === 'book-closing' && (
          <div className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-gray-900 mb-3">Book Closing & Year-End</h3>
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 text-sm text-yellow-700">
              <p className="font-medium">Warning:</p>
              <p className="text-xs mt-1">Book closing creates closing entries that transfer P&L balances to Capital/Reserves. This action should only be performed after all entries for the year are complete.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Closing Date</label><input type="date" value={closingDate} onChange={e => setClosingDate(e.target.value)} className="w-full h-9 px-3 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
              <div><label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Narration</label><input type="text" value={closingNarration} onChange={e => setClosingNarration(e.target.value)} className="w-full h-9 px-3 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Closing entries to be generated:</p>
              <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
                <li>Transfer all Revenue account balances to Trading / P&L A/c</li>
                <li>Transfer all Expense account balances to Trading / P&L A/c</li>
                <li>Transfer Net Profit/Loss to Capital / Reserves account</li>
                <li>Close all nominal accounts (zero balance)</li>
              </ul>
            </div>
            <div className="flex gap-3 pt-2">
              <button className="px-6 py-2 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 transition-colors">Generate Closing Entries</button>
              <button className="px-6 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">Preview First</button>
            </div>
          </div>
        )}

        {/* Tab: Export & Print */}
        {activeTab === 'export' && (
          <div className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-gray-900 mb-3">Export & Print Preferences</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Default Export Format</label>
                <div className="flex border border-gray-200 rounded-xl overflow-hidden w-fit">
                  {(['pdf', 'excel', 'csv'] as const).map(fmt => (
                    <button key={fmt} onClick={() => setExportFormat(fmt)} className={`px-4 py-1.5 text-sm uppercase ${exportFormat === fmt ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}>{fmt}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Show JE Codes in Exports</label>
                <button onClick={() => setShowJECodes(!showJECodes)} className={`px-4 py-1.5 rounded text-sm ${showJECodes ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>{showJECodes ? 'Yes (not recommended)' : 'No (recommended)'}</button>
                <p className="text-xs text-gray-400 mt-1">JE-XXXX codes are internal and should not appear in PDF/Excel/CSV exports.</p>
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Company Logo URL (for PDF header)</label>
              <input type="text" value={companyLogo} onChange={e => setCompanyLogo(e.target.value)} placeholder="https://..." className="w-full max-w-md px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="flex items-center gap-3">
              <button type="button" onClick={handleSaveExportPrefs} className="px-6 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">
                Save Preferences
              </button>
              {exportSaveStatus === 'saved' && <span className="text-sm text-green-600">Saved.</span>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
