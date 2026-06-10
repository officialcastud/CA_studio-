'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { ChevronDown, Plus, X, Search } from 'lucide-react';
import { searchAccounts, getMasterAccount, findExistingAccountName, normalizeAccountName } from '@/lib/chartOfAccounts';
import { LEDGER_GROUPS, getGroupByScheduleIII } from '@/lib/coa';
import type { PrimaryGroup, JournalNature } from '@/lib/coa';

// ─── New Account Dialog ───────────────────────────────────────────────────────
// Single "Under" selector — 26 Tally-style groups instead of 4+50 confusing sub-groups

interface NewAccountDialogProps {
  name: string;
  onConfirm: (name: string, primaryGroup: PrimaryGroup, subGroup: string) => void;
  onCancel: () => void;
}

const GROUP_SECTION_LABELS: Partial<Record<PrimaryGroup, string>> = {
  'Capital & Liabilities': 'CAPITAL & LIABILITIES',
  'Assets': 'ASSETS',
  'Income': 'INCOME',
  'Expenses': 'EXPENSES',
};

function NewAccountDialog({ name, onConfirm, onCancel }: NewAccountDialogProps) {
  const [selectedId, setSelectedId] = useState('indirect_expenses');
  const [groupSearch, setGroupSearch] = useState('');

  const selected = LEDGER_GROUPS.find((g) => g.id === selectedId) ?? LEDGER_GROUPS[0];

  const filteredGroups = useMemo(() => {
    const q = groupSearch.toLowerCase();
    if (!q) return LEDGER_GROUPS;
    return LEDGER_GROUPS.filter(
      (g) => g.label.toLowerCase().includes(q) || g.description.toLowerCase().includes(q),
    );
  }, [groupSearch]);

  // Group by primaryGroup for section headers
  const sections: { pg: PrimaryGroup; groups: typeof LEDGER_GROUPS }[] = [];
  const seenPg = new Set<PrimaryGroup>();
  for (const g of filteredGroups) {
    if (!seenPg.has(g.primaryGroup)) {
      seenPg.add(g.primaryGroup);
      sections.push({ pg: g.primaryGroup, groups: [] });
    }
    sections[sections.length - 1].groups.push(g);
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        {/* Header */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-gray-200">
          <div>
            <h3 className="text-sm font-bold text-gray-900">Create New Account</h3>
            <p className="text-xs text-gray-400 mt-0.5">Select which group this account falls under</p>
          </div>
          <button onClick={onCancel} className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-5 pt-4 pb-2">
          {/* Account name */}
          <div className="mb-4">
            <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Account Name</p>
            <div className="h-9 px-3 flex items-center text-sm font-semibold text-gray-900 bg-blue-50 border border-blue-200 rounded-lg">
              {name}
            </div>
          </div>

          {/* Under — single selector with search */}
          <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Under (Account Group)</p>

          {/* Search */}
          <div className="relative mb-2">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <input
              value={groupSearch}
              onChange={(e) => setGroupSearch(e.target.value)}
              placeholder="Search groups…"
              className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Group list */}
          <div className="max-h-52 overflow-y-auto border border-gray-200 rounded-lg">
            {sections.map(({ pg, groups }) => (
              <div key={pg}>
                <div className="px-2.5 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 sticky top-0 border-b border-gray-100">
                  {GROUP_SECTION_LABELS[pg]}
                </div>
                {groups.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setSelectedId(g.id)}
                    className={`w-full text-left px-3 py-2 flex items-start gap-2 transition-colors border-b border-gray-50 last:border-0 ${
                      selectedId === g.id ? 'bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className={`w-3 h-3 rounded-full border-2 mt-0.5 shrink-0 flex items-center justify-center ${
                      selectedId === g.id ? 'border-blue-500' : 'border-gray-300'
                    }`}>
                      {selectedId === g.id && <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
                    </div>
                    <div className="min-w-0">
                      <p className={`text-sm font-medium ${selectedId === g.id ? 'text-blue-700' : 'text-gray-800'}`}>
                        {g.label}
                      </p>
                      <p className="text-[11px] text-gray-400 truncate">{g.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            ))}
            {sections.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">No groups match your search</p>
            )}
          </div>

          {/* Preview of selected */}
          {selected && (
            <div className="mt-3 flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-[11px] text-gray-500">
                <span className="font-semibold text-gray-700">{selected.label}</span>
                {' → '}
                <span className="font-mono">{selected.scheduleIII}</span>
                {' · '}
                <span className="capitalize">{selected.nature}</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-gray-200 mt-2">
          <button onClick={onCancel} className="h-9 px-4 text-sm font-medium border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50">
            Cancel
          </button>
          <button
            onClick={() => selected && onConfirm(name, selected.primaryGroup, selected.scheduleIII)}
            disabled={!selected}
            className="inline-flex items-center gap-1.5 h-9 px-4 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
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
    const group = getGroupByScheduleIII(sg);
    const nature: JournalNature = group?.nature ?? 'expense';
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

            {/* Extended accounts — COA defaults */}
            {extended.length > 0 && (
              <>
                <div className="px-2 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 border-y border-gray-100 sticky top-0">
                  {basic.length > 0 ? 'Standard Accounts' : 'Suggested Accounts'}
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
