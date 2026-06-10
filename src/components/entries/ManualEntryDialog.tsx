'use client';

import { useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import { formatIndianCurrency } from '@/lib/utils/currencyFormat';
import { generateUniqueEntryCode } from '@/lib/utils/entryCodeGenerator';
import { AccountComboBox } from '@/components/entries/AccountComboBox';
import type { InventorySubLine, JournalLine } from '@/types/journal';
import {
  emptyInventorySubLine,
  expandManualJournalLines,
  getAutoGstPreviewLines,
  getExpandedTotals,
  getPreviewAmountForLine,
  getResolvedClassification,
  isInventorySensitiveAccount,
  summarizeInventorySubLines,
  type ManualDraftLine,
} from '@/lib/accounting/inventoryJournal';

/** Same codes as journal filter (PUR, SLS, etc.) so entries show in Purchase/Sales views. */
const VOUCHER_TYPES: { label: string; value: string }[] = [
  { label: 'Journal', value: 'JRN' },
  { label: 'Sales', value: 'SLS' },
  { label: 'Purchase', value: 'PUR' },
  { label: 'Receipt', value: 'RCT' },
  { label: 'Payment', value: 'PMT' },
  { label: 'Contra', value: 'CNT' },
  { label: 'Debit Note', value: 'DN' },
  { label: 'Credit Note', value: 'CN' },
];

function normalizeVoucherType(defaultType: string): string {
  const byLabel = VOUCHER_TYPES.find(t => t.label.toLowerCase() === defaultType.toLowerCase());
  if (byLabel) return byLabel.value;
  const byValue = VOUCHER_TYPES.find(t => t.value === defaultType);
  return byValue ? byValue.value : 'JRN';
}

interface LineItem {
  account_name: string;
  debit: string;
  credit: string;
  inventory_sub_lines?: InventorySubLine[];
}

type Nature = 'asset' | 'liability' | 'capital' | 'revenue' | 'expense';

interface ManualEntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companyId: string;
  onSave: (entry: {
    company_id: string;
    entry_code: string;
    entry_date: string;
    voucher_type: string;
    voucher_number?: string;
    lines: JournalLine[];
    narration: string;
    book_period: string;
    is_opening?: boolean;
    is_closing?: boolean;
  }) => Promise<any>;
  defaultVoucherType?: string;
  defaultLines?: Partial<LineItem>[];
}

const emptyLine = (): LineItem => ({
  account_name: '',
  debit: '',
  credit: '',
});

export function ManualEntryDialog({
  open,
  onOpenChange,
  companyId,
  onSave,
  defaultVoucherType = 'Journal',
  defaultLines,
}: ManualEntryDialogProps) {
  const today = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(today);
  const [voucherType, setVoucherType] = useState(() => normalizeVoucherType(defaultVoucherType));
  const [narration, setNarration] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const initialLines = defaultLines
    ? defaultLines.map(dl => ({ ...emptyLine(), ...dl }))
    : [emptyLine(), emptyLine()];
  const [lines, setLines] = useState<LineItem[]>(initialLines);

  const updateLine = (idx: number, field: keyof LineItem, value: string) => {
    setLines(prev => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], [field]: value };
      return updated;
    });
  };

  const handleAccountNameChange = (
    idx: number,
    name: string,
    meta?: { primaryGroup: string; subGroup: string; nature: Nature }
  ) => {
    setLines((prev) => {
      const updated = [...prev];
      const current = updated[idx];
      const resolved = meta
        ? { subGroup: meta.subGroup, nature: meta.nature as JournalLine['nature'] }
        : getResolvedClassification(name, { voucherType, companyId });
      updated[idx] = {
        ...current,
        account_name: name,
        ...(resolved
          ? { account_group: resolved.subGroup, nature: resolved.nature }
          : {}),
        inventory_sub_lines: isInventorySensitiveAccount(name) ? current.inventory_sub_lines : undefined,
      };
      return updated;
    });
  };

  const updateInventorySubLine = (
    lineIdx: number,
    subIdx: number,
    field: keyof InventorySubLine,
    value: string
  ) => {
    setLines((prev) => {
      const updated = [...prev];
      const parent = { ...updated[lineIdx] };
      const subLines = [...(parent.inventory_sub_lines ?? [emptyInventorySubLine()])];
      const current = { ...subLines[subIdx] };

      const numericFields: Array<keyof InventorySubLine> = [
        'qty',
        'rate',
        'discount_percent',
        'cgst_percent',
        'sgst_percent',
        'igst_percent',
      ];

      (current as InventorySubLine)[field] = numericFields.includes(field)
        ? (parseFloat(value) || 0) as never
        : (value as never);
      subLines[subIdx] = current;
      parent.inventory_sub_lines = subLines;
      updated[lineIdx] = parent;
      return updated;
    });
  };

  const addInventorySubLine = (lineIdx: number) => {
    setLines((prev) => {
      const updated = [...prev];
      const parent = { ...updated[lineIdx] };
      parent.inventory_sub_lines = [...(parent.inventory_sub_lines ?? []), emptyInventorySubLine()];
      updated[lineIdx] = parent;
      return updated;
    });
  };

  const removeInventorySubLine = (lineIdx: number, subIdx: number) => {
    setLines((prev) => {
      const updated = [...prev];
      const parent = { ...updated[lineIdx] };
      const subLines = [...(parent.inventory_sub_lines ?? [])];
      if (subLines.length <= 1) return prev;
      parent.inventory_sub_lines = subLines.filter((_, i) => i !== subIdx);
      updated[lineIdx] = parent;
      return updated;
    });
  };

  const addLine = () => setLines(prev => [...prev, emptyLine()]);

  const removeLine = (idx: number) => {
    if (lines.length <= 2) return;
    setLines(prev => prev.filter((_, i) => i !== idx));
  };

  const expandedTotals = getExpandedTotals(lines as ManualDraftLine[], { voucherType, companyId });
  const totalDebit = expandedTotals.debit;
  const totalCredit = expandedTotals.credit;
  const round2 = (n: number) => Math.round(n * 100) / 100;
  const rd = round2(totalDebit);
  const rc = round2(totalCredit);
  const BALANCE_TOLERANCE = 0.05;
  const hasMovement = Math.max(rd, rc) > 0.0001;
  const isBalanced = hasMovement && Math.abs(rd - rc) <= BALANCE_TOLERANCE;

  const resetForm = () => {
    setDate(today);
    setVoucherType(normalizeVoucherType(defaultVoucherType));
    setNarration('');
    setLines(defaultLines ? defaultLines.map(dl => ({ ...emptyLine(), ...dl })) : [emptyLine(), emptyLine()]);
    setError('');
  };

  const handleClose = () => {
    if (saving) return;
    onOpenChange(false);
  };

  const handleSave = async () => {
    const validLines = expandManualJournalLines(lines as import('@/lib/accounting/inventoryJournal').ManualDraftLine[], { voucherType, companyId });
    if (validLines.length < 2) {
      setError('At least 2 lines with amounts required');
      return;
    }
    if (!isBalanced) {
      setError(
        `Dr (${formatIndianCurrency(rd)}) ≠ Cr (${formatIndianCurrency(rc)}). Difference: ${formatIndianCurrency(Math.abs(rd - rc))}`,
      );
      return;
    }
    if (!date) {
      setError('Date is required');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const entryCode = generateUniqueEntryCode(companyId);
      const d = new Date(date);
      const month = d.getMonth();
      const year = d.getFullYear();
      const fyStartYear = month < 3 ? year - 1 : year;
      const bookPeriod = `${fyStartYear}-${fyStartYear + 1}`;

      await onSave({
        company_id: companyId,
        entry_code: entryCode,
        entry_date: date,
        voucher_type: voucherType,
        lines: validLines,
        narration: narration.trim(),
        book_period: bookPeriod,
      });

      resetForm();
      onOpenChange(false);
    } catch (err: any) {
      setError(err.message || 'Failed to save entry');
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >

        {/* ── TITLE BAR ── */}
        <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-b border-gray-200 rounded-t-xl shrink-0">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Entry Voucher</span>
          <button
            onClick={handleClose}
            disabled={saving}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors disabled:opacity-40"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* ── SCROLLABLE BODY ── */}
        <div className="flex-1 overflow-y-auto">

          {/* Date row */}
          <div className="flex items-center justify-between px-5 py-2.5 border-b border-gray-100">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Date</span>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="h-8 w-44 px-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Entries table */}
          <div className="px-5 pt-4 pb-2">

            {/* Column headers */}
            <div className="grid grid-cols-[1fr_100px_100px_28px] gap-2 mb-2 pb-1.5 border-b border-gray-300">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Particulars</span>
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider text-right">Dr (₹)</span>
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider text-right">Cr (₹)</span>
              <span />
            </div>

            {/* Lines */}
            {lines.map((line, idx) => {
              const clarification = line.account_name.trim()
                ? getResolvedClassification(line.account_name, { voucherType, companyId })
                : null;
              const inventoryCapable = isInventorySensitiveAccount(line.account_name);
              const inventoryEnabled = (line.inventory_sub_lines?.length ?? 0) > 0;
              return (
                <div key={idx} className="space-y-1.5 mb-2.5">
                  <div className="grid grid-cols-[1fr_100px_100px_28px] gap-2 items-center">
                    <AccountComboBox
                      companyId={companyId}
                      value={line.account_name}
                      onChange={(name: string, meta?: any) => handleAccountNameChange(idx, name, meta)}
                      placeholder="Account name..."
                      className="h-8 text-sm"
                    />
                    <input
                      type="number"
                      value={inventoryEnabled ? getPreviewAmountForLine(line).debit.toFixed(2) : line.debit}
                      onChange={e => {
                        if (inventoryEnabled) return;
                        updateLine(idx, 'debit', e.target.value);
                        if (e.target.value) updateLine(idx, 'credit', '');
                      }}
                      placeholder="0.00"
                      className="w-full h-8 px-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-right font-mono"
                      min="0"
                      step="0.01"
                      readOnly={inventoryEnabled}
                    />
                    <input
                      type="number"
                      value={inventoryEnabled ? getPreviewAmountForLine(line).credit.toFixed(2) : line.credit}
                      onChange={e => {
                        if (inventoryEnabled) return;
                        updateLine(idx, 'credit', e.target.value);
                        if (e.target.value) updateLine(idx, 'debit', '');
                      }}
                      placeholder="0.00"
                      className="w-full h-8 px-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-right font-mono"
                      min="0"
                      step="0.01"
                      readOnly={inventoryEnabled}
                    />
                    <button
                      onClick={() => removeLine(idx)}
                      disabled={lines.length <= 2}
                      className="h-8 w-7 flex items-center justify-center text-gray-300 hover:text-red-500 disabled:opacity-30 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {clarification && (
                    <div className="ml-1 px-2 py-1 rounded bg-gray-50 border border-gray-100 text-[11px] text-gray-500">
                      <span className="font-semibold text-gray-700">{clarification.subGroup}</span>
                      <span className="mx-1.5 text-gray-300">·</span>
                      <span className="capitalize">{clarification.nature}</span>
                      <span className="mx-1.5 text-gray-300">·</span>
                      <span>{clarification.primaryGroup}</span>
                    </div>
                  )}

                  {inventoryCapable && !inventoryEnabled && (
                    <div className="ml-4 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setLines((prev) => prev.map((l, i) => i === idx ? { ...l, inventory_sub_lines: [emptyInventorySubLine()] } : l));
                        }}
                        className="inline-flex items-center gap-1 h-7 px-2.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Plus className="h-3.5 w-3.5" /> Add item-wise details (optional)
                      </button>
                      <span className="text-xs text-gray-400">
                        If you don't add items, you can enter the amount directly.
                      </span>
                    </div>
                  )}

                  {inventoryEnabled && (
                    <div className="ml-4 rounded-xl border border-dashed border-blue-200 bg-blue-50/40 p-3 space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                          Inventory details (amount auto-calculated)
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setLines((prev) => prev.map((l, i) => i === idx ? { ...l, inventory_sub_lines: undefined } : l));
                          }}
                          className="text-xs font-medium text-gray-500 hover:text-gray-800 hover:underline"
                        >
                          Remove item details (enter amount manually)
                        </button>
                      </div>
                      <div className="grid grid-cols-[1.6fr_72px_72px_70px_80px_72px_72px_72px_72px_88px_88px_32px] gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider px-0.5">
                        <span>Item / Description</span>
                        <span>HSN / SAC</span>
                        <span>Unit</span>
                        <span className="text-right">Qty</span>
                        <span className="text-right">Rate (₹)</span>
                        <span className="text-right">Disc %</span>
                        <span className="text-right">CGST %</span>
                        <span className="text-right">SGST %</span>
                        <span className="text-right">IGST %</span>
                        <span className="text-right">Amount (₹)</span>
                        <span className="text-right">Taxable (₹)</span>
                        <span />
                      </div>

                      {(line.inventory_sub_lines ?? []).map((sub, subIdx) => {
                        const computed = summarizeInventorySubLines([sub]).subLines[0];
                        const inp = "w-full h-7 px-1.5 text-xs border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-gray-300";
                        const inpR = `${inp} text-right font-mono`;
                        return (
                          <div key={subIdx} className="grid grid-cols-[1.6fr_72px_72px_70px_80px_72px_72px_72px_72px_88px_88px_32px] gap-1.5 items-center">
                            <input value={sub.inventory_name} onChange={e => updateInventorySubLine(idx, subIdx, 'inventory_name', e.target.value)} placeholder="Item name" className={inp} />
                            <input value={sub.hsn_sac ?? ''} onChange={e => updateInventorySubLine(idx, subIdx, 'hsn_sac', e.target.value)} placeholder="HSN/SAC" className={`${inp} font-mono uppercase`} maxLength={8} />
                            <input value={sub.unit} onChange={e => updateInventorySubLine(idx, subIdx, 'unit', e.target.value)} placeholder="Nos/Kg…" className={inp} />
                            <input type="number" value={sub.qty} onChange={e => updateInventorySubLine(idx, subIdx, 'qty', e.target.value)} className={inpR} min="0" step="0.01" />
                            <input type="number" value={sub.rate} onChange={e => updateInventorySubLine(idx, subIdx, 'rate', e.target.value)} className={inpR} min="0" step="0.01" />
                            <input type="number" value={sub.discount_percent} onChange={e => updateInventorySubLine(idx, subIdx, 'discount_percent', e.target.value)} className={inpR} min="0" step="0.01" />
                            <input type="number" value={sub.cgst_percent} onChange={e => updateInventorySubLine(idx, subIdx, 'cgst_percent', e.target.value)} className={inpR} min="0" step="0.01" />
                            <input type="number" value={sub.sgst_percent} onChange={e => updateInventorySubLine(idx, subIdx, 'sgst_percent', e.target.value)} className={inpR} min="0" step="0.01" />
                            <input type="number" value={sub.igst_percent} onChange={e => updateInventorySubLine(idx, subIdx, 'igst_percent', e.target.value)} className={inpR} min="0" step="0.01" />
                            <div className="text-right font-mono text-xs text-gray-600">{formatIndianCurrency(computed?.amount ?? 0)}</div>
                            <div className="text-right font-mono text-xs font-semibold text-gray-900">{formatIndianCurrency(computed?.taxable_amount ?? 0)}</div>
                            <button
                              onClick={() => removeInventorySubLine(idx, subIdx)}
                              disabled={(line.inventory_sub_lines ?? []).length <= 1}
                              className="h-7 w-7 flex items-center justify-center text-gray-400 hover:text-red-500 disabled:opacity-30 transition-colors"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        );
                      })}

                      <div className="flex items-center justify-between pt-1">
                        <button onClick={() => addInventorySubLine(idx)} className="inline-flex items-center gap-1 h-7 px-2.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Plus className="h-3.5 w-3.5" /> Add Item
                        </button>
                        <div className="text-xs text-right space-y-0.5 text-gray-600">
                          {(() => {
                            const summary = summarizeInventorySubLines(line.inventory_sub_lines ?? []);
                            return (
                              <>
                                <div>Taxable: <span className="font-mono font-semibold text-gray-900">{formatIndianCurrency(summary.taxableTotal)}</span></div>
                                <div className="text-gray-400">
                                  CGST <span className="font-mono">{formatIndianCurrency(summary.cgstTotal)}</span>
                                  {' · '}SGST <span className="font-mono">{formatIndianCurrency(summary.sgstTotal)}</span>
                                  {' · '}IGST <span className="font-mono">{formatIndianCurrency(summary.igstTotal)}</span>
                                </div>
                                <div>Final Total: <span className="font-mono font-bold text-gray-900">{formatIndianCurrency(summary.finalTotal)}</span></div>
                              </>
                            );
                          })()}
                        </div>
                      </div>

                      {getAutoGstPreviewLines(line).length > 0 && (
                        <div className="space-y-1 border-t border-blue-100 pt-2">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Auto GST Lines</p>
                          {getAutoGstPreviewLines(line).map((gstLine) => (
                            <div key={gstLine.account_name} className="grid grid-cols-[1fr_100px_100px] gap-2 text-xs items-center">
                              <span className="text-gray-700">{gstLine.account_name}</span>
                              <span className="text-right font-mono text-dr">{gstLine.debit ? formatIndianCurrency(gstLine.debit) : ''}</span>
                              <span className="text-right font-mono text-cr">{gstLine.credit ? formatIndianCurrency(gstLine.credit) : ''}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Add line */}
            <button onClick={addLine} className="mt-1 inline-flex items-center gap-1 h-7 px-2.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              <Plus className="h-3.5 w-3.5" /> Add Line
            </button>

            {/* Totals — double underline, traditional Indian style */}
            <div className="grid grid-cols-[1fr_100px_100px_28px] gap-2 items-center border-t-2 border-double border-gray-400 pt-2 mt-3">
              <span className="text-sm font-bold text-gray-800">Total</span>
              <span className={`text-sm text-right font-mono font-bold ${isBalanced ? 'text-green-700' : 'text-red-600'}`}>
                {formatIndianCurrency(rd)}
              </span>
              <span className={`text-sm text-right font-mono font-bold ${isBalanced ? 'text-green-700' : 'text-red-600'}`}>
                {formatIndianCurrency(rc)}
              </span>
              <span />
            </div>
          </div>

          {/* Narration — at bottom, traditional Indian accounting style */}
          <div className="px-5 pt-3 pb-5 border-t border-gray-100">
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
              Narration
            </label>
            <textarea
              value={narration}
              onChange={e => setNarration(e.target.value)}
              placeholder="Being — describe this entry (e.g., Being salary paid for March 2024)"
              rows={2}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none placeholder:text-gray-300"
            />
          </div>
        </div>

        {/* ── FOOTER ── */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-200 bg-gray-50 rounded-b-xl shrink-0">
          <div>
            {error && <p className="text-xs text-red-600">{error}</p>}
            {!error && isBalanced && (
              <p className="text-xs text-green-600 font-medium">✓ Entry balanced</p>
            )}
            {!error && !isBalanced && hasMovement && (
              <p className="text-xs text-amber-600">
                Difference: {formatIndianCurrency(Math.abs(rd - rc))} ({rd > rc ? 'Dr excess' : 'Cr excess'})
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleClose}
              disabled={saving}
              className="h-9 px-4 text-sm font-medium border border-gray-200 rounded-lg bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !isBalanced}
              className="inline-flex items-center gap-1.5 h-9 px-5 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {saving
                ? <><div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Saving…</>
                : 'Post Entry'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
