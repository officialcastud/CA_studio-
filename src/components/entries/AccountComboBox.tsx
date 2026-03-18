'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, Plus, X } from 'lucide-react';
import { searchAccounts, getMasterAccount, findExistingAccountName, normalizeAccountName } from '@/lib/chartOfAccounts';
import { MASTER_COA } from '@/lib/masterCOA';
import type { PrimaryGroup, JournalNature } from '@/lib/masterCOA';

// ─── Sub-groups per primary group ────────────────────────────────────────────
const PG_SUBGROUPS: Record<PrimaryGroup, string[]> = {
  'Capital & Liabilities': [
    'Share Capital', 'Reserves & Surplus', 'Long-term Borrowings',
    'Deferred Tax Liability', 'Other Long-term Liabilities', 'Long-term Provisions',
    'Short-term Borrowings', 'Trade Payables', 'Other Current Liabilities',
    'Statutory Liabilities', 'Short-term Provisions', 'GST — Output Tax',
    'GST — RCM', 'GST — Advances', 'Money received against share warrants',
  ],
  'Assets': [
    'Deferred Tax Asset', 'Tangible Fixed Assets', 'Accumulated Depreciation',
    'Capital Work in Progress', 'Intangible Assets', 'Accumulated Amortisation',
    'Non-current Investments', 'Long-term Loans & Advances', 'Other Non-current Assets',
    'Current Investments', 'Inventories', 'Trade Receivables',
    'Cash & Cash Equivalents', 'Bank Balances', 'Cash Equivalents',
    'Short-term Loans & Advances', 'Other Current Assets',
    'GST — Input Tax Credit', 'GST — RCM', 'GST — Refund',
    'GST — Reconciliation', 'GST — Legacy', 'Suspense & Clearing',
  ],
  'Income': ['Revenue from Operations', 'Other Income'],
  'Expenses': [
    'Cost of Materials Consumed', 'Changes in Inventories',
    'Purchases of Stock-in-Trade', 'Direct Expenses', 'Employee Benefits Expense',
    'Finance Costs', 'Depreciation & Amortisation',
    'Other Expenses — Administration', 'Other Expenses — Selling',
    'Other Expenses — Write-offs', 'Tax Expense', 'Exceptional Items',
    'Other Expenses', 'GST — ITC',
  ],
};

const PG_NATURE: Record<PrimaryGroup, JournalNature> = {
  'Capital & Liabilities': 'liability',
  'Assets': 'asset',
  'Income': 'revenue',
  'Expenses': 'expense',
};

// ─── New Account Dialog ───────────────────────────────────────────────────────
interface NewAccountDialogProps {
  name: string;
  onConfirm: (name: string, primaryGroup: PrimaryGroup, subGroup: string) => void;
  onCancel: () => void;
}

function NewAccountDialog({ name, onConfirm, onCancel }: NewAccountDialogProps) {
  const [pg, setPg] = useState<PrimaryGroup>('Expenses');
  const [sg, setSg] = useState('Other Expenses — Administration');

  const subGroups = PG_SUBGROUPS[pg] ?? [];
  const nature = PG_NATURE[pg];

  useEffect(() => {
    setSg(PG_SUBGROUPS[pg]?.[0] ?? '');
  }, [pg]);

  return (
    <div className="fixed inset-0 bg-black/40 z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-gray-200">
          <div>
            <h3 className="text-sm font-bold text-gray-900">New Account</h3>
            <p className="text-xs text-gray-400 mt-0.5">Classify this account before using it</p>
          </div>
          <button onClick={onCancel} className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-5 py-4 space-y-4">
          {/* Account name (read-only) */}
          <div>
            <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Account Name</label>
            <div className="h-9 px-3 flex items-center text-sm font-medium text-gray-900 bg-gray-50 border border-gray-200 rounded-lg">
              {name}
            </div>
          </div>

          {/* Primary Group */}
          <div>
            <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Primary Group</label>
            <div className="grid grid-cols-2 gap-2">
              {(['Capital & Liabilities', 'Assets', 'Income', 'Expenses'] as PrimaryGroup[]).map(p => (
                <label key={p} className={`flex items-center gap-2 p-2.5 rounded-xl border-2 cursor-pointer transition-all text-xs font-medium ${
                  pg === p ? 'border-blue-500 bg-blue-50 text-blue-800' : 'border-gray-200 text-gray-700 hover:border-gray-300'
                }`}>
                  <input type="radio" className="sr-only" checked={pg === p} onChange={() => setPg(p)} />
                  <div className={`w-3 h-3 rounded-full border-2 flex items-center justify-center shrink-0 ${pg === p ? 'border-blue-500' : 'border-gray-300'}`}>
                    {pg === p && <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
                  </div>
                  {p}
                </label>
              ))}
            </div>
            <p className="text-[11px] text-gray-400 mt-1.5">
              Nature: <span className="font-semibold text-gray-600">{nature}</span>
            </p>
          </div>

          {/* Sub-group */}
          <div>
            <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Sub-group</label>
            <select
              value={sg}
              onChange={e => setSg(e.target.value)}
              className="w-full h-9 px-3 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {subGroups.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-gray-200">
          <button onClick={onCancel} className="h-9 px-4 text-sm font-medium border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button
            onClick={() => onConfirm(name, pg, sg)}
            disabled={!sg}
            className="inline-flex items-center gap-1.5 h-9 px-4 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Account
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── AccountComboBox ──────────────────────────────────────────────────────────
interface AccountComboBoxProps {
  companyId: string;
  value: string;
  onChange: (name: string, meta?: { primaryGroup: PrimaryGroup; subGroup: string; nature: JournalNature }) => void;
  placeholder?: string;
  className?: string;
}

export function AccountComboBox({
  companyId,
  value,
  onChange,
  placeholder = 'Account name...',
  className = '',
}: AccountComboBoxProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(value);
  const [highlightIdx, setHighlightIdx] = useState(-1);
  const [pendingNew, setPendingNew] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const { basic, extended, isNew } = useMemo(
    () => searchAccounts(companyId, search),
    [companyId, search]
  );

  const allVisible = useMemo(() => [...basic, ...extended], [basic, extended]);

  useEffect(() => { setSearch(value); }, [value]);
  useEffect(() => { setHighlightIdx(-1); }, [search]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        inputRef.current && !inputRef.current.contains(e.target as Node) &&
        listRef.current && !listRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const selectName = (name: string) => {
    const master = getMasterAccount(name);
    if (master) {
      onChange(name, { primaryGroup: master.primaryGroup, subGroup: master.subGroup, nature: master.nature });
    } else {
      onChange(name);
    }
    setSearch(name);
    setOpen(false);
  };

  const handleNewAccount = (name: string, pg: PrimaryGroup, sg: string) => {
    const normalized = normalizeAccountName(name);
    const existing = findExistingAccountName(companyId, normalized);
    if (existing) {
      selectName(existing);
      setPendingNew(null);
      return;
    }
    const nature = PG_NATURE[pg];
    onChange(normalized, { primaryGroup: pg, subGroup: sg, nature });
    setSearch(normalized);
    setPendingNew(null);
    setOpen(false);
  };

  const hasQuery = search.trim().length > 0;
  const hasNewRow = isNew && hasQuery;
  const showDropdown = open && (allVisible.length > 0 || hasNewRow);

  return (
    <>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={search}
          onFocus={() => setOpen(true)}
          onChange={e => {
            setSearch(e.target.value);
            onChange(e.target.value);
            setOpen(true);
          }}
          onKeyDown={e => {
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              setOpen(true);
              const optionCount = allVisible.length + (hasNewRow ? 1 : 0);
              setHighlightIdx(p => Math.min(p + 1, optionCount - 1));
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              setHighlightIdx(p => Math.max(p - 1, -1));
            } else if (e.key === 'Enter') {
              e.preventDefault();
              const optionCount = allVisible.length + (hasNewRow ? 1 : 0);
              if (highlightIdx >= 0 && highlightIdx < optionCount) {
                if (hasNewRow && highlightIdx === 0) {
                  const normalized = normalizeAccountName(search);
                  const existing = findExistingAccountName(companyId, normalized);
                  if (existing) {
                    selectName(existing);
                  } else {
                    setPendingNew(normalized);
                  }
                  setOpen(false);
                } else {
                  const indexInList = highlightIdx - (hasNewRow ? 1 : 0);
                  if (indexInList >= 0 && indexInList < allVisible.length) {
                    selectName(allVisible[indexInList]);
                    setOpen(false);
                  }
                }
              } else if (!hasNewRow) {
                setOpen(false);
              }
            } else if (e.key === 'Escape') {
              setOpen(false);
            }
          }}
          placeholder={placeholder}
          className={`w-full border border-gray-200 rounded-lg px-2 pr-6 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 ${className}`}
          autoComplete="off"
        />
        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400 pointer-events-none" />

        {showDropdown && (
          <div
            ref={listRef}
            className="absolute z-50 top-full left-0 right-0 mt-0.5 max-h-56 overflow-auto bg-white border border-gray-200 rounded-xl shadow-lg"
          >
            {/* Create new (always on top when applicable) */}
            {hasNewRow && (
              <div
                onMouseDown={e => {
                  e.preventDefault();
                  const normalized = normalizeAccountName(search);
                  const existing = findExistingAccountName(companyId, normalized);
                  if (existing) {
                    selectName(existing);
                  } else {
                    setPendingNew(normalized);
                    setOpen(false);
                  }
                }}
                className="flex items-center gap-2 px-2.5 py-2 cursor-pointer border-b border-gray-100 text-blue-700 bg-blue-50"
              >
                <Plus className="h-3.5 w-3.5 shrink-0" />
                <span className="text-sm font-medium">
                  Create "<span className="font-semibold">{search.trim()}</span>"
                </span>
              </div>
            )}

            {/* Basic accounts */}
            {basic.length > 0 && (
              <>
                {hasQuery && (
                  <div className="px-2 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 border-b border-gray-100 sticky top-0">
                    Common Accounts
                  </div>
                )}
                {basic.map((name, i) => (
                  <div
                    key={name}
                    onMouseDown={e => { e.preventDefault(); selectName(name); }}
                    onMouseEnter={() => setHighlightIdx((hasNewRow ? 1 : 0) + i)}
                    className={`px-2.5 py-1.5 cursor-pointer text-sm truncate ${
                      ((hasNewRow ? 1 : 0) + i) === highlightIdx ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50 text-gray-800'
                    }`}
                  >
                    {name}
                  </div>
                ))}
              </>
            )}

            {/* Extended accounts from full 520 */}
            {extended.length > 0 && (
              <>
                <div className="px-2 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 border-y border-gray-100 sticky top-0">
                  All Accounts
                </div>
                {extended.map((name, i) => {
                  const idx = (hasNewRow ? 1 : 0) + basic.length + i;
                  return (
                    <div
                      key={name}
                      onMouseDown={e => { e.preventDefault(); selectName(name); }}
                      onMouseEnter={() => setHighlightIdx(idx)}
                      className={`px-2.5 py-1.5 cursor-pointer text-sm truncate text-gray-500 ${
                        idx === highlightIdx ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'
                      }`}
                    >
                      {name}
                    </div>
                  );
                })}
              </>
            )}

          </div>
        )}
      </div>

      {/* New Account Classification Dialog */}
      {pendingNew && (
        <NewAccountDialog
          name={pendingNew}
          onConfirm={handleNewAccount}
          onCancel={() => setPendingNew(null)}
        />
      )}
    </>
  );
}
