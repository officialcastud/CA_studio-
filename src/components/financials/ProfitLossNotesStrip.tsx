'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { formatIndianCurrency } from '@/lib/utils/currencyFormat';
import type { LedgerBreakdown } from '@/lib/accounting/profitLossCompute';
import { ExportButtons } from '@/components/export/ExportButtons';
import { exportElementAsImagePDF } from '@/components/export/exportUtils';

interface ProfitLossNotesStripProps {
  companyName: string;
  entityLabel: string;
  period: string;
  visible: boolean;
  revenueFromOperations: number;
  revenueBreakdown?: LedgerBreakdown[];
  otherIncomeBreakdown?: LedgerBreakdown[];
  costOfMaterialsBreakdown?: LedgerBreakdown[];
  changesInInventoriesBreakdown?: LedgerBreakdown[];
  employeeBenefitsBreakdown?: LedgerBreakdown[];
  financeCostsBreakdown?: LedgerBreakdown[];
  depreciationBreakdown?: LedgerBreakdown[];
  otherExpensesBreakdown?: LedgerBreakdown[];
}

const NOTES = [
  { no: 1, title: 'Revenue from Operations' },
  { no: 2, title: 'Other Income' },
  { no: 3, title: 'Cost of Materials Consumed' },
  { no: 4, title: 'Changes in Inventories' },
  { no: 5, title: 'Employee Benefits Expense' },
  { no: 6, title: 'Finance Costs' },
  { no: 7, title: 'Depreciation & Amortisation' },
  { no: 8, title: 'Other Expenses' },
];

function NoteTable({ rows, total, totalLabel }: {
  rows: LedgerBreakdown[];
  total: number;
  totalLabel: string;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="px-3 py-2.5 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Particulars</th>
            <th className="px-3 py-2.5 text-right text-[11px] font-semibold text-gray-500 uppercase tracking-wider w-40">Current Year (₹)</th>
            <th className="px-3 py-2.5 text-right text-[11px] font-semibold text-gray-500 uppercase tracking-wider w-40">Previous Year (₹)</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={3} className="px-3 py-6 text-center text-sm text-gray-400">
                No ledger entries found for this note.
              </td>
            </tr>
          ) : (
            rows.map((r, i) => (
              <tr key={i} className="border-b border-gray-100 hover:bg-gray-50/50">
                <td className="px-3 py-2 text-gray-700">{r.name}</td>
                <td className="px-3 py-2 text-right font-mono text-[13px] tabular-nums text-gray-800">
                  {r.amount < 0 ? `(${formatIndianCurrency(Math.abs(r.amount))})` : formatIndianCurrency(r.amount)}
                </td>
                <td className="px-3 py-2 text-right font-mono text-[13px] text-gray-400">—</td>
              </tr>
            ))
          )}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-gray-300 bg-gray-50">
            <td className="px-3 py-2.5 font-semibold text-gray-900">{totalLabel}</td>
            <td className="px-3 py-2.5 text-right font-mono font-bold text-[13px] text-gray-900">
              {total < 0 ? `(${formatIndianCurrency(Math.abs(total))})` : formatIndianCurrency(total)}
            </td>
            <td className="px-3 py-2.5 text-right font-mono text-gray-400">—</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export function ProfitLossNotesStrip(props: ProfitLossNotesStripProps) {
  const [openNote, setOpenNote] = React.useState<number | null>(null);
  const noteRef = React.useRef<HTMLDivElement | null>(null);
  if (!props.visible) return null;

  function getBreakdown(no: number): { rows: LedgerBreakdown[]; total: number; totalLabel: string } {
    switch (no) {
      case 1: return { rows: props.revenueBreakdown ?? [], total: props.revenueFromOperations, totalLabel: 'Revenue from Operations (Net)' };
      case 2: { const r = props.otherIncomeBreakdown ?? []; return { rows: r, total: r.reduce((s, x) => s + x.amount, 0), totalLabel: 'Total Other Income' }; }
      case 3: { const r = props.costOfMaterialsBreakdown ?? []; return { rows: r, total: r.reduce((s, x) => s + x.amount, 0), totalLabel: 'Cost of Materials Consumed' }; }
      case 4: { const r = props.changesInInventoriesBreakdown ?? []; return { rows: r, total: r.reduce((s, x) => s + x.amount, 0), totalLabel: 'Changes in Inventories' }; }
      case 5: { const r = props.employeeBenefitsBreakdown ?? []; return { rows: r, total: r.reduce((s, x) => s + x.amount, 0), totalLabel: 'Total Employee Benefits Expense' }; }
      case 6: { const r = props.financeCostsBreakdown ?? []; return { rows: r, total: r.reduce((s, x) => s + x.amount, 0), totalLabel: 'Total Finance Costs' }; }
      case 7: { const r = props.depreciationBreakdown ?? []; return { rows: r, total: r.reduce((s, x) => s + x.amount, 0), totalLabel: 'Depreciation & Amortisation' }; }
      case 8: { const r = props.otherExpensesBreakdown ?? []; return { rows: r, total: r.reduce((s, x) => s + x.amount, 0), totalLabel: 'Total Other Expenses' }; }
      default: return { rows: [], total: 0, totalLabel: '' };
    }
  }

  const noteData = openNote ? getBreakdown(openNote) : null;
  const activeNote = openNote ? NOTES.find(n => n.no === openNote) : null;

  return (
    <>
      <div className="mt-5">
        <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Notes to Statement of Profit and Loss</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2">
          {NOTES.map(note => (
            <button
              key={note.no}
              type="button"
              onClick={() => setOpenNote(note.no)}
              className="group p-3 bg-white border border-dashed border-gray-300 rounded-xl hover:border-blue-400 hover:bg-blue-50/50 transition-all text-center"
            >
              <div className="text-[11px] font-bold text-gray-700 group-hover:text-blue-700">Note {note.no}</div>
              <div className="text-[10px] text-gray-400 mt-0.5 line-clamp-2 leading-tight">{note.title}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Modal */}
      {openNote !== null && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setOpenNote(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
              <h3 className="text-base font-bold text-gray-900">
                Note {openNote} — {activeNote?.title}
              </h3>
              <div className="flex items-center gap-2">
                {noteData && activeNote && (
                  <ExportButtons
                    title={`Note ${openNote} — ${activeNote.title}`}
                    companyName={props.companyName}
                    entityType={props.entityLabel}
                    dateRange={props.period}
                    columns={[
                      { header: 'Particulars', key: 'name' },
                      { header: 'Amount (₹)', key: 'amount', align: 'right' as const },
                    ]}
                    data={[
                      ...noteData.rows.map(r => ({ name: r.name, amount: r.amount })),
                      { name: noteData.totalLabel, amount: noteData.total },
                    ]}
                    onPdf={() =>
                      exportElementAsImagePDF({
                        element: noteRef.current,
                        title: `Note ${openNote} — ${activeNote.title}`,
                        orientation: 'portrait',
                      })
                    }
                  />
                )}
                <button
                  onClick={() => setOpenNote(null)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {noteData && (
                <div ref={noteRef}>
                  <NoteTable rows={noteData.rows} total={noteData.total} totalLabel={noteData.totalLabel} />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
