'use client';

import React, { useRef, useEffect, useState } from 'react';
import { formatIndianCurrency } from '@/lib/utils/currencyFormat';
import { Package, X } from 'lucide-react';
import type { InventorySubLine } from '@/types/journal';
import { summarizeInventorySubLines, computeInventorySubLine } from '@/lib/accounting/inventoryJournal';

interface JournalEntryDisplayLine {
  accountName: string;
  isDebit: boolean;
  amount: number;
  inventorySubLines?: InventorySubLine[];
  tdsSection?: string;
  tdsRate?: number;
  tcsSection?: string;
  tcsRate?: number;
}
interface JournalEntryDisplay {
  entryCode: string;
  date: string;
  lines: JournalEntryDisplayLine[];
  narration: string;
  voucherType: string;
}

interface JournalFormatProps {
  companyName: string;
  period: string;
  entries: JournalEntryDisplay[];
  highlightEntryCode?: string;
  emptyMessage?: string;
}

function VoucherPopup({
  entry,
  companyName,
  onClose,
}: {
  entry: JournalEntryDisplay;
  companyName: string;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/40 z-[80] flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-blue-600" />
            <div className="text-sm font-bold text-gray-900">Journal Voucher</div>
            <div className="text-xs font-mono font-semibold text-blue-600">{entry.entryCode}</div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1 overflow-auto p-5">
          <JournalVoucherPreview entry={entry} companyName={companyName} />
        </div>
        <div className="px-5 py-3 border-t border-gray-200 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="h-8 px-3 text-xs font-semibold border border-gray-200 rounded-lg hover:bg-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

const VTYPE_CLASS: Record<string, string> = {
  JRN: 'vtype-JRN', SLS: 'vtype-SLS', PUR: 'vtype-PUR',
  RCT: 'vtype-RCT', PMT: 'vtype-PMT', CNT: 'vtype-CNT',
  DN:  'vtype-DN',  CN:  'vtype-CN',  PAY: 'vtype-PAY',
};

const VTYPE_LABEL: Record<string, string> = {
  JRN: 'Journal', SLS: 'Sales', PUR: 'Purchase',
  RCT: 'Receipt', PMT: 'Payment', CNT: 'Contra',
  DN: 'Debit Note', CN: 'Credit Note', PAY: 'Payroll',
};

// ── Inventory detail popup ────────────────────────────────────────────────────
function InventoryPopup({ subLines, onClose }: { subLines: InventorySubLine[]; onClose: () => void }) {
  const summary = summarizeInventorySubLines(subLines);
  return (
    <div className="fixed inset-0 bg-black/40 z-[70] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-blue-600" />
            <h3 className="text-sm font-bold text-gray-900">Inventory Items</h3>
            <span className="text-xs text-gray-400">{subLines.length} item{subLines.length !== 1 ? 's' : ''}</span>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1 overflow-auto">
          <table className="w-full text-xs">
            <thead className="sticky top-0 bg-gray-50 border-b border-gray-200">
              <tr>
                {['Item / Description', 'HSN / SAC', 'Unit', 'Qty', 'Rate (₹)', 'Disc %', 'CGST %', 'SGST %', 'IGST %', 'Amount (₹)', 'Tax (₹)', 'Total (₹)'].map(h => (
                  <th key={h} className={`px-2.5 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap ${h.endsWith('(₹)') || h === 'Qty' || h.endsWith('%') ? 'text-right' : 'text-left'}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {subLines.map((sub, i) => {
                const c = computeInventorySubLine(sub);
                const taxTotal = c.cgst_amount + c.sgst_amount + c.igst_amount;
                return (
                  <tr key={i} className={`border-b border-gray-100 ${i % 2 === 1 ? 'bg-gray-50/40' : ''}`}>
                    <td className="px-2.5 py-2 font-medium text-gray-900">{sub.inventory_name || '—'}</td>
                    <td className="px-2.5 py-2 font-mono text-gray-600 uppercase">{sub.hsn_sac || '—'}</td>
                    <td className="px-2.5 py-2 text-gray-600">{sub.unit || '—'}</td>
                    <td className="px-2.5 py-2 text-right font-mono tabular-nums">{sub.qty}</td>
                    <td className="px-2.5 py-2 text-right font-mono tabular-nums">{formatIndianCurrency(sub.rate)}</td>
                    <td className="px-2.5 py-2 text-right font-mono tabular-nums text-gray-500">{sub.discount_percent ? `${sub.discount_percent}%` : '—'}</td>
                    <td className="px-2.5 py-2 text-right font-mono tabular-nums text-gray-500">{sub.cgst_percent ? `${sub.cgst_percent}%` : '—'}</td>
                    <td className="px-2.5 py-2 text-right font-mono tabular-nums text-gray-500">{sub.sgst_percent ? `${sub.sgst_percent}%` : '—'}</td>
                    <td className="px-2.5 py-2 text-right font-mono tabular-nums text-gray-500">{sub.igst_percent ? `${sub.igst_percent}%` : '—'}</td>
                    <td className="px-2.5 py-2 text-right font-mono tabular-nums">{formatIndianCurrency(c.amount)}</td>
                    <td className="px-2.5 py-2 text-right font-mono tabular-nums text-amber-600">{taxTotal > 0 ? formatIndianCurrency(taxTotal) : '—'}</td>
                    <td className="px-2.5 py-2 text-right font-mono tabular-nums font-semibold text-gray-900">{formatIndianCurrency(c.final_amount)}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-gray-300 bg-gray-50">
                <td colSpan={9} className="px-2.5 py-2 text-xs font-semibold text-gray-600">Totals</td>
                <td className="px-2.5 py-2 text-right font-mono font-semibold tabular-nums">{formatIndianCurrency(summary.taxableTotal)}</td>
                <td className="px-2.5 py-2 text-right font-mono font-semibold tabular-nums text-amber-600">
                  {formatIndianCurrency(summary.cgstTotal + summary.sgstTotal + summary.igstTotal)}
                </td>
                <td className="px-2.5 py-2 text-right font-mono font-bold tabular-nums text-gray-900">{formatIndianCurrency(summary.finalTotal)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}

export function JournalFormat({
  companyName, period, entries,
  highlightEntryCode, emptyMessage = 'No journal entries found for this period.',
}: JournalFormatProps) {
  const [inventoryPopup, setInventoryPopup] = useState<InventorySubLine[] | null>(null);
  const scrollToRef = useRef<HTMLTableRowElement | null>(null);
  const code = (highlightEntryCode ?? '').trim();
  const highlightIndex = code
    ? entries.findIndex(e => e.entryCode.includes(code))
    : -1;

  useEffect(() => {
    if (highlightIndex >= 0 && scrollToRef.current) {
      scrollToRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [highlightIndex, code]);

  // Build LF map
  const allAccounts = new Set<string>();
  for (const e of entries) for (const l of e.lines) allAccounts.add(l.accountName);
  const folioMap = new Map<string, number>();
  [...allAccounts].sort().forEach((acc, i) => folioMap.set(acc, i + 1));

  if (entries.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-14 text-center">
        <p className="text-sm text-gray-400">{emptyMessage}</p>
      </div>
    );
  }

  let totalDebit = 0, totalCredit = 0;
  for (const e of entries) for (const l of e.lines) {
    if (l.isDebit) totalDebit += l.amount; else totalCredit += l.amount;
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="text-center py-3 border-b border-gray-200 bg-gray-50/50">
        <p className="text-[11px] text-gray-400 uppercase tracking-wide">{companyName}</p>
        <h3 className="text-base font-bold text-gray-900 mt-0.5">JOURNAL</h3>
        <p className="text-xs text-gray-400 mt-0.5">{period}</p>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="px-3 py-2.5 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider w-24 border-r border-gray-100">Date</th>
            <th className="px-3 py-2.5 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider border-r border-gray-100">Particulars</th>
            <th className="px-3 py-2.5 text-center text-[11px] font-semibold text-gray-500 uppercase tracking-wider w-10 border-r border-gray-100">LF</th>
            <th className="px-3 py-2.5 text-right text-[11px] font-semibold text-gray-500 uppercase tracking-wider w-32 border-r border-gray-100">Debit (₹)</th>
            <th className="px-3 py-2.5 text-right text-[11px] font-semibold text-gray-500 uppercase tracking-wider w-32">Credit (₹)</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, ei) => {
            const isHighlighted = ei === highlightIndex;
            const hlClass = isHighlighted ? 'bg-yellow-50' : '';

            return (
              <React.Fragment key={ei}>
                {entry.lines.map((line, li) => (
                  <tr
                    key={`${ei}-${li}`}
                    ref={isHighlighted && li === 0 ? scrollToRef : undefined}
                    className={`border-b border-gray-100 ${hlClass} hover:bg-blue-50/20 transition-colors`}
                  >
                    {li === 0 && (
                      <td
                        className="px-3 py-2 align-top border-r border-gray-100"
                        rowSpan={entry.lines.length + 1}
                      >
                        <div className="text-xs text-gray-500 whitespace-nowrap">{entry.date}</div>
                        <div className="mt-1">
                          <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold ${VTYPE_CLASS[entry.voucherType] ?? 'vtype-JRN'}`}>
                            {VTYPE_LABEL[entry.voucherType] ?? entry.voucherType}
                          </span>
                        </div>
                        <div className="mt-1 text-[10px] font-mono font-semibold text-blue-600">{entry.entryCode}</div>
                      </td>
                    )}
                    <td className={`px-3 py-2 border-r border-gray-100 ${!line.isDebit ? 'pl-8' : ''}`}>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {/* Inventory items button */}
                        {line.inventorySubLines && line.inventorySubLines.length > 0 && (
                          <button
                            onClick={() => setInventoryPopup(line.inventorySubLines!)}
                            className="inline-flex items-center gap-1 h-5 px-1.5 text-[10px] font-semibold rounded-full border border-blue-300 text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors shrink-0"
                            title="View inventory items"
                          >
                            <Package className="h-2.5 w-2.5" />
                            {line.inventorySubLines.length}
                          </button>
                        )}
                        {/* TDS badge */}
                        {line.tdsSection && (
                          <span className="inline-flex items-center h-5 px-1.5 text-[10px] font-semibold rounded-full border border-orange-300 text-orange-700 bg-orange-50 shrink-0" title={`TDS u/s ${line.tdsSection} @ ${line.tdsRate ?? '?'}%`}>
                            TDS {line.tdsSection}
                          </span>
                        )}
                        {/* TCS badge */}
                        {line.tcsSection && (
                          <span className="inline-flex items-center h-5 px-1.5 text-[10px] font-semibold rounded-full border border-purple-300 text-purple-700 bg-purple-50 shrink-0" title={`TCS u/s ${line.tcsSection} @ ${line.tcsRate ?? '?'}%`}>
                            TCS {line.tcsSection}
                          </span>
                        )}
                        {line.isDebit ? (
                          <span className="font-medium text-gray-900">
                            {line.accountName} A/c
                            <span className="ml-2 text-xs font-normal text-gray-400">Dr.</span>
                          </span>
                        ) : (
                          <span className="text-gray-600">
                            To {line.accountName} A/c
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-2 text-center text-[11px] text-gray-400 border-r border-gray-100">
                      {folioMap.get(line.accountName) ?? ''}
                    </td>
                    <td className="px-3 py-2 text-right font-mono text-[13px] tabular-nums border-r border-gray-100 text-dr">
                      {line.isDebit ? formatIndianCurrency(line.amount) : ''}
                    </td>
                    <td className="px-3 py-2 text-right font-mono text-[13px] tabular-nums text-cr">
                      {!line.isDebit ? formatIndianCurrency(line.amount) : ''}
                    </td>
                  </tr>
                ))}
                {/* Narration row */}
                <tr className={`border-b-2 border-gray-200 ${hlClass}`}>
                  <td className="px-3 py-1.5 pl-8 text-xs text-gray-400 italic border-r border-gray-100" colSpan={4}>
                    ({entry.narration || 'No narration'})
                  </td>
                </tr>
              </React.Fragment>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="bg-gray-50 border-t-2 border-gray-300">
            <td className="px-3 py-2.5 border-r border-gray-100" />
            <td className="px-3 py-2.5 font-bold text-gray-900 text-sm border-r border-gray-100">Total</td>
            <td className="px-3 py-2.5 border-r border-gray-100" />
            <td className="px-3 py-2.5 text-right font-mono font-bold text-[13px] text-dr border-r border-gray-100">
              {formatIndianCurrency(totalDebit)}
            </td>
            <td className="px-3 py-2.5 text-right font-mono font-bold text-[13px] text-cr">
              {formatIndianCurrency(totalCredit)}
            </td>
          </tr>
        </tfoot>
      </table>

      {inventoryPopup && (
        <InventoryPopup subLines={inventoryPopup} onClose={() => setInventoryPopup(null)} />
      )}
    </div>
  );
}
