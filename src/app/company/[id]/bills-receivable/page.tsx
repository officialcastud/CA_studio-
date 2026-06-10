'use client';

import { useMemo, useState } from 'react';
import { useCompany } from '@/hooks/useCompany';
import { PageHeader } from '@/components/layout/PageHeader';
import {
  listInvoicesV2,
  listSalesInvoices,
  type InvoiceV2,
  type SalesInvoice,
} from '@/lib/accounting/gstInvoices';

function inr(n: number): string {
  return n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/* ── Unified receivable row ── */
interface ReceivableRow {
  id: string;
  date: string;
  invoiceNo: string;
  party: string;
  partyGstin: string;
  totalAmount: number;
  amountReceived: number;
  pending: number;
  dueDate: string;
  paymentMode: string;
  items: string;
  isOverdue: boolean;
  overdueDays: number;
  source: 'v2' | 'legacy';
}

function daysOverdue(dueDate: string): number {
  if (!dueDate) return 0;
  const diff = Date.now() - new Date(dueDate).getTime();
  return diff > 0 ? Math.floor(diff / 86400000) : 0;
}

export default function BillsReceivablePage() {
  const { company, companyId, loading } = useCompany();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const rows = useMemo<ReceivableRow[]>(() => {
    if (!companyId) return [];

    const v2Rows: ReceivableRow[] = listInvoicesV2(companyId)
      .filter((inv) => inv.doc_type !== 'CREDIT_NOTE' && (inv.amount_pending ?? 0) > 0)
      .map((inv: InvoiceV2) => {
        const due = inv.due_date || '';
        const od = daysOverdue(due);
        return {
          id: inv.id,
          date: inv.invoice_date,
          invoiceNo: inv.invoice_no,
          party: inv.buyer_name,
          partyGstin: inv.buyer_gstin || '',
          totalAmount: inv.total_amount,
          amountReceived: inv.amount_received ?? 0,
          pending: inv.amount_pending ?? inv.total_amount,
          dueDate: due,
          paymentMode: inv.payment_mode || 'CREDIT',
          items: inv.items?.map((i) => i.description).filter(Boolean).join(', ') || '-',
          isOverdue: od > 0,
          overdueDays: od,
          source: 'v2',
        };
      });

    const legacyRows: ReceivableRow[] = listSalesInvoices(companyId)
      .filter((inv) => (inv.amount_pending ?? 0) > 0)
      .map((inv: SalesInvoice) => {
        const due = inv.due_date || '';
        const od = daysOverdue(due);
        return {
          id: inv.id,
          date: inv.invoice_date,
          invoiceNo: inv.invoice_no,
          party: inv.customer_name,
          partyGstin: inv.customer_gstin || '',
          totalAmount: inv.total,
          amountReceived: inv.amount_received ?? 0,
          pending: inv.amount_pending ?? inv.total,
          dueDate: due,
          paymentMode: inv.payment_mode || 'CREDIT',
          items: inv.narration || inv.hsn_code || '-',
          isOverdue: od > 0,
          overdueDays: od,
          source: 'legacy',
        };
      });

    return [...v2Rows, ...legacyRows].sort((a, b) => b.date.localeCompare(a.date));
  }, [companyId]);

  const selected = rows.find((r) => r.id === selectedId) || null;

  const totalPending = rows.reduce((s, r) => s + r.pending, 0);
  const overdue30 = rows.filter((r) => r.overdueDays > 30).reduce((s, r) => s + r.pending, 0);
  const overdueCount = rows.filter((r) => r.isOverdue).length;

  if (loading || !company || !companyId) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <PageHeader title="Bills Receivable" description="Outstanding customer invoices awaiting payment" />

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Total Pending</p>
          <p className="mt-1 font-mono text-2xl font-bold tabular-nums text-gray-900">
            <span className="text-sm text-gray-400">&#8377;</span>{inr(totalPending)}
          </p>
          <p className="mt-0.5 text-[11px] text-gray-500">{rows.length} invoice{rows.length !== 1 ? 's' : ''} outstanding</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Overdue &gt; 30 Days</p>
          <p className={`mt-1 font-mono text-2xl font-bold tabular-nums ${overdue30 > 0 ? 'text-red-600' : 'text-gray-900'}`}>
            <span className="text-sm text-gray-400">&#8377;</span>{inr(overdue30)}
          </p>
          <p className="mt-0.5 text-[11px] text-gray-500">Requires follow-up</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Overdue Invoices</p>
          <p className={`mt-1 font-mono text-2xl font-bold tabular-nums ${overdueCount > 0 ? 'text-amber-600' : 'text-gray-900'}`}>
            {overdueCount}
          </p>
          <p className="mt-0.5 text-[11px] text-gray-500">Past due date</p>
        </div>
      </div>

      {/* ── Main Table ── */}
      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-2.5">
          <h3 className="text-sm font-bold text-gray-800">Outstanding Receivables</h3>
          <span className="text-[11px] text-gray-400">{rows.length} entries</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-xs">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/80">
                <th className="px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">Date</th>
                <th className="px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">Invoice No</th>
                <th className="px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">Party</th>
                <th className="px-4 py-2.5 text-right text-[10px] font-bold uppercase tracking-widest text-gray-400">Pending</th>
                <th className="px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">Due Date</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-xs text-gray-400">
                    No outstanding receivables. All invoices are fully paid.
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr
                    key={r.id}
                    onClick={() => setSelectedId(r.id)}
                    className={`cursor-pointer border-t border-gray-50 transition-colors ${selectedId === r.id ? 'bg-blue-50/60' : 'hover:bg-gray-50/60'}`}
                  >
                    <td className="px-4 py-2.5 font-mono text-[11px] text-gray-600">{r.date}</td>
                    <td className="px-4 py-2.5 font-mono text-[11px] font-semibold text-gray-800">{r.invoiceNo}</td>
                    <td className="max-w-[200px] truncate px-4 py-2.5 text-[11px] font-medium text-gray-700">{r.party}</td>
                    <td className="px-4 py-2.5 text-right font-mono text-[11px] font-bold text-gray-900">{inr(r.pending)}</td>
                    <td className="px-4 py-2.5 text-[11px]">
                      {r.dueDate ? (
                        <span className={`inline-flex items-center gap-1 font-mono ${r.isOverdue ? 'font-semibold text-red-600' : 'text-gray-500'}`}>
                          {r.dueDate}
                          {r.isOverdue && (
                            <span className="rounded bg-red-50 px-1 py-px text-[9px] font-bold text-red-500">{r.overdueDays}d</span>
                          )}
                        </span>
                      ) : (
                        <span className="text-gray-300">-</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Slide-Out Drawer ── */}
      {selected && (
        <>
          <div className="fixed inset-0 z-40 bg-black/20" onClick={() => setSelectedId(null)} />
          <div className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-gray-200 bg-white shadow-2xl">
            {/* Drawer header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Invoice Details</p>
                <p className="mt-0.5 font-mono text-sm font-bold text-gray-900">{selected.invoiceNo}</p>
              </div>
              <button
                onClick={() => setSelectedId(null)}
                className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Drawer body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* Party info */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Customer</p>
                <p className="mt-1 text-sm font-semibold text-gray-900">{selected.party}</p>
                {selected.partyGstin && (
                  <p className="mt-0.5 font-mono text-[11px] text-gray-500">{selected.partyGstin}</p>
                )}
              </div>

              {/* Financial breakdown */}
              <div className="rounded-lg border border-gray-100 bg-gray-50/50 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-gray-500">Invoice Total</span>
                  <span className="font-mono text-[11px] font-semibold text-gray-900">{inr(selected.totalAmount)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-gray-500">Amount Received</span>
                  <span className="font-mono text-[11px] font-semibold text-emerald-600">{inr(selected.amountReceived)}</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-gray-700">Pending Balance</span>
                  <span className="font-mono text-sm font-bold text-gray-900">{inr(selected.pending)}</span>
                </div>
              </div>

              {/* Meta */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Invoice Date</p>
                  <p className="mt-0.5 font-mono text-[11px] font-semibold text-gray-700">{selected.date}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Due Date</p>
                  <p className={`mt-0.5 font-mono text-[11px] font-semibold ${selected.isOverdue ? 'text-red-600' : 'text-gray-700'}`}>
                    {selected.dueDate || '-'}
                    {selected.isOverdue && <span className="ml-1 text-[9px] text-red-500">({selected.overdueDays}d overdue)</span>}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Payment Mode</p>
                  <p className="mt-0.5 text-[11px] font-semibold text-gray-700">{selected.paymentMode}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</p>
                  <span className={`mt-0.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${selected.isOverdue ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-700'}`}>
                    {selected.isOverdue ? 'Overdue' : 'Pending'}
                  </span>
                </div>
              </div>

              {/* Items */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Items / Description</p>
                <p className="mt-1 text-[11px] leading-relaxed text-gray-600">{selected.items}</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
