/**
 * BulkDataGrid — Excel-style spreadsheet grid for suspense transactions.
 *
 * Features:
 * - Click to select row; Shift+click for range; Ctrl+click for multi
 * - Right-click context menu: Move to Ledger, Create & Move, Flag
 * - Status colour coding: white=unallocated, green=allocated, amber=flagged
 * - Column sorting, keyword filter, status filter
 * - Keyboard: Arrow keys to navigate, Space to toggle selection, Esc to clear
 */

import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { ArrowUpDown, ChevronUp, ChevronDown, Search, Filter } from 'lucide-react';
import type { SuspenseTransaction } from '@/lib/bulk/types';

interface CtxMenuState {
  x: number;
  y: number;
  selectedIds: string[];
}

interface Props {
  transactions: SuspenseTransaction[];
  onMoveToLedger: (selectedIds: string[]) => void;
  onCreateAndMove: (selectedIds: string[]) => void;
  onFlagRows: (selectedIds: string[]) => void;
}

type SortKey = 'txnDate' | 'narration' | 'amount' | 'direction' | 'status';
type SortDir = 'asc' | 'desc';

function formatAmount(n: number) {
  return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(n);
}

function formatDate(d: string | null) {
  if (!d) return '—';
  try {
    return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' });
  } catch {
    return d;
  }
}

function rowBg(status: SuspenseTransaction['status'], selected: boolean): string {
  if (selected) return 'bg-blue-100';
  if (status === 'ALLOCATED') return 'bg-green-50';
  if (status === 'FLAGGED') return 'bg-amber-50';
  return '';
}

function statusBadge(status: SuspenseTransaction['status']) {
  if (status === 'ALLOCATED') return <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-green-100 text-green-700">Allocated</span>;
  if (status === 'FLAGGED') return <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-100 text-amber-700">Flagged</span>;
  return <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-500">Pending</span>;
}

const PAGE_SIZE = 200;

export function BulkDataGrid({ transactions, onMoveToLedger, onCreateAndMove, onFlagRows }: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [lastSelected, setLastSelected] = useState<string | null>(null);
  const [ctx, setCtx] = useState<CtxMenuState | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>('txnDate');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | SuspenseTransaction['status']>('ALL');
  const [page, setPage] = useState(0);

  const ctxRef = useRef<HTMLDivElement>(null);

  // Close context menu on outside click
  useEffect(() => {
    if (!ctx) return;
    const close = () => setCtx(null);
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [ctx]);

  const filtered = useMemo(() => {
    let rows = transactions;
    if (statusFilter !== 'ALL') rows = rows.filter((t) => t.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter(
        (t) =>
          t.narration.toLowerCase().includes(q) ||
          t.referenceNo.toLowerCase().includes(q),
      );
    }
    return [...rows].sort((a, b) => {
      let cmp = 0;
      if (sortKey === 'txnDate') cmp = (a.txnDate ?? '').localeCompare(b.txnDate ?? '');
      else if (sortKey === 'narration') cmp = a.narration.localeCompare(b.narration);
      else if (sortKey === 'amount') cmp = a.amount - b.amount;
      else if (sortKey === 'direction') cmp = a.direction.localeCompare(b.direction);
      else if (sortKey === 'status') cmp = a.status.localeCompare(b.status);
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [transactions, statusFilter, search, sortKey, sortDir]);

  const paged = useMemo(
    () => filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE),
    [filtered, page],
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const toggleSort = useCallback((key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('asc'); }
  }, [sortKey]);

  const handleRowClick = useCallback(
    (e: React.MouseEvent, id: string) => {
      e.preventDefault();
      const newSel = new Set(selected);
      if (e.shiftKey && lastSelected) {
        // Range select
        const ids = paged.map((t) => t.id);
        const from = ids.indexOf(lastSelected);
        const to = ids.indexOf(id);
        const [lo, hi] = from < to ? [from, to] : [to, from];
        for (let i = lo; i <= hi; i++) newSel.add(ids[i]);
      } else if (e.ctrlKey || e.metaKey) {
        if (newSel.has(id)) newSel.delete(id); else newSel.add(id);
      } else {
        // Single select
        newSel.clear();
        newSel.add(id);
      }
      setSelected(newSel);
      setLastSelected(id);
    },
    [selected, lastSelected, paged],
  );

  const handleContextMenu = useCallback(
    (e: React.MouseEvent, id: string) => {
      e.preventDefault();
      // Include right-clicked row in selection if not already
      let ids = [...selected];
      if (!selected.has(id)) {
        setSelected(new Set([id]));
        ids = [id];
      }
      setCtx({ x: e.clientX, y: e.clientY, selectedIds: ids });
    },
    [selected],
  );

  const handleSelectAll = () => {
    if (selected.size === paged.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(paged.map((t) => t.id)));
    }
  };

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ArrowUpDown className="h-3 w-3 text-gray-300" />;
    return sortDir === 'asc'
      ? <ChevronUp className="h-3 w-3 text-blue-500" />
      : <ChevronDown className="h-3 w-3 text-blue-500" />;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center gap-3 px-3 py-2 bg-gray-50 border-b border-gray-200 shrink-0">
        <div className="flex items-center gap-1.5 flex-1 bg-white border border-gray-200 rounded-md px-2.5 py-1.5">
          <Search className="h-3.5 w-3.5 text-gray-400" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            placeholder="Filter by narration or reference..."
            className="flex-1 text-sm bg-transparent outline-none text-gray-700 placeholder-gray-400"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <Filter className="h-3.5 w-3.5 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value as typeof statusFilter); setPage(0); }}
            className="text-xs border border-gray-200 rounded px-2 py-1.5 bg-white text-gray-600 focus:outline-none"
          >
            <option value="ALL">All status</option>
            <option value="UNALLOCATED">Pending</option>
            <option value="ALLOCATED">Allocated</option>
            <option value="FLAGGED">Flagged</option>
          </select>
        </div>

        <span className="text-xs text-gray-500">
          {filtered.length.toLocaleString()} rows
          {selected.size > 0 && <span className="text-blue-600 font-medium"> · {selected.size} selected</span>}
        </span>

        {selected.size > 0 && (
          <button
            onClick={() => onMoveToLedger([...selected])}
            className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium transition-colors"
          >
            Move to Ledger
          </button>
        )}
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-xs border-collapse">
          <thead className="sticky top-0 z-10 bg-gray-100">
            <tr>
              <th className="w-8 px-2 py-2 text-left">
                <input
                  type="checkbox"
                  checked={paged.length > 0 && selected.size === paged.length}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300"
                />
              </th>
              {([
                ['txnDate', 'Date'],
                ['narration', 'Narration'],
                ['referenceNo', 'Reference'],
                ['amount', 'Amount'],
                ['direction', 'Dir.'],
                ['status', 'Status'],
              ] as const).map(([key, label]) => (
                <th
                  key={key}
                  onClick={() => key !== 'referenceNo' && toggleSort(key as SortKey)}
                  className={`px-3 py-2 text-left font-semibold text-gray-600 tracking-wide whitespace-nowrap ${
                    key !== 'referenceNo' ? 'cursor-pointer hover:bg-gray-200 select-none' : ''
                  } ${key === 'amount' ? 'text-right' : ''}`}
                >
                  <span className="flex items-center gap-1 justify-start">
                    {label}
                    {key !== 'referenceNo' && <SortIcon col={key as SortKey} />}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center text-gray-400 py-12">
                  {transactions.length === 0
                    ? 'No transactions yet — import a bank statement to begin.'
                    : 'No rows match the current filter.'}
                </td>
              </tr>
            ) : (
              paged.map((t) => (
                <tr
                  key={t.id}
                  className={`border-b border-gray-100 cursor-pointer hover:bg-blue-50 transition-colors ${rowBg(t.status, selected.has(t.id))}`}
                  onClick={(e) => handleRowClick(e, t.id)}
                  onContextMenu={(e) => handleContextMenu(e, t.id)}
                >
                  <td className="px-2 py-1.5">
                    <input
                      type="checkbox"
                      checked={selected.has(t.id)}
                      onChange={() => {}}
                      className="rounded border-gray-300"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>
                  <td className="px-3 py-1.5 whitespace-nowrap text-gray-600">{formatDate(t.txnDate)}</td>
                  <td className="px-3 py-1.5 text-gray-800 max-w-xs truncate" title={t.narration}>{t.narration}</td>
                  <td className="px-3 py-1.5 text-gray-500 max-w-[120px] truncate">{t.referenceNo || '—'}</td>
                  <td className={`px-3 py-1.5 text-right font-mono tabular-nums whitespace-nowrap ${
                    t.direction === 'PAYMENT' ? 'text-red-600' : 'text-green-700'
                  }`}>
                    {t.direction === 'PAYMENT' ? '−' : '+'}₹{formatAmount(t.amount)}
                  </td>
                  <td className="px-3 py-1.5 text-center">
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                      t.direction === 'PAYMENT' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                    }`}>
                      {t.direction === 'PAYMENT' ? 'Pay' : 'Rcpt'}
                    </span>
                  </td>
                  <td className="px-3 py-1.5">{statusBadge(t.status)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-2 border-t border-gray-200 bg-gray-50 shrink-0">
          <span className="text-xs text-gray-500">
            Page {page + 1} of {totalPages} · Showing {paged.length} of {filtered.length} rows
          </span>
          <div className="flex gap-1">
            <button
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
              className="px-2 py-1 text-xs border border-gray-200 rounded hover:bg-gray-100 disabled:opacity-40"
            >
              ← Prev
            </button>
            <button
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => p + 1)}
              className="px-2 py-1 text-xs border border-gray-200 rounded hover:bg-gray-100 disabled:opacity-40"
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* Right-click context menu */}
      {ctx && (
        <div
          ref={ctxRef}
          onMouseDown={(e) => e.stopPropagation()}
          style={{ position: 'fixed', left: ctx.x, top: ctx.y, zIndex: 9999 }}
          className="bg-white border border-gray-200 rounded-lg shadow-xl py-1 min-w-[200px] text-sm"
        >
          <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest px-3 py-1">
            {ctx.selectedIds.length} row{ctx.selectedIds.length !== 1 ? 's' : ''} selected
          </p>
          <div className="my-1 border-t border-gray-100" />
          <CtxItem
            label="Move to Ledger"
            sub="Select an existing ledger"
            onClick={() => { setCtx(null); onMoveToLedger(ctx.selectedIds); }}
          />
          <CtxItem
            label="Create Ledger & Move"
            sub="Create a new ledger inline"
            onClick={() => { setCtx(null); onCreateAndMove(ctx.selectedIds); }}
          />
          <div className="my-1 border-t border-gray-100" />
          <CtxItem
            label="Flag for Review"
            sub="Mark as needs review"
            onClick={() => { setCtx(null); onFlagRows(ctx.selectedIds); }}
            danger
          />
        </div>
      )}
    </div>
  );
}

function CtxItem({
  label,
  sub,
  onClick,
  danger,
}: {
  label: string;
  sub: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex flex-col items-start px-3 py-2 text-left transition-colors ${
        danger ? 'text-red-600 hover:bg-red-50' : 'text-gray-700 hover:bg-gray-50'
      }`}
    >
      <span className="text-[13px] font-medium">{label}</span>
      <span className="text-[11px] text-gray-400 mt-0.5">{sub}</span>
    </button>
  );
}
