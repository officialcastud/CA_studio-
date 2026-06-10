'use client';

import { useEffect, useMemo, useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { DocumentWizard } from '@/components/invoices/document-wizard';
import { useCompany } from '@/hooks/useCompany';
import { INDIAN_STATES_BY_NAME } from '@/lib/constants/indianStates';
import {
  deletePurchaseInvoice,
  getStateCodeFromGSTIN,
  listPurchaseInvoices,
  type PurchaseInvoice,
  type PurchaseBucket,
} from '@/lib/accounting/gstInvoices';


function inr(n: number): string {
  return n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function compactInvoiceNo(no: string): string {
  if (no.startsWith('PUR-')) return `↓ ${no.slice(4)}`;
  if (no.startsWith('SLS-')) return `↑ ${no.slice(4)}`;
  return no;
}

export default function PurchaseRegisterPage() {
  const { company, companyId, loading } = useCompany();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingPurchase, setEditingPurchase] = useState<PurchaseInvoice | null>(null);
  const [tick, setTick] = useState(0);

  const companyGstin = company?.gst_details?.gstin || '';
  const companyStateName = company?.entity_details?.state || '';
  const sellerStateCode = companyGstin
    ? getStateCodeFromGSTIN(companyGstin)
    : (companyStateName ? INDIAN_STATES_BY_NAME[companyStateName.toLowerCase()]?.gstCode : null);

  const rows = useMemo(() => (companyId ? listPurchaseInvoices(companyId) : []), [companyId, tick]);
  const totals = useMemo(
    () =>
      rows.reduce(
        (a, r) => ({
          taxable: a.taxable + r.taxable_value,
          cgst: a.cgst + r.cgst,
          sgst: a.sgst + r.sgst,
          igst: a.igst + r.igst,
          total: a.total + r.total,
        }),
        { taxable: 0, cgst: 0, sgst: 0, igst: 0, total: 0 },
      ),
    [rows],
  );

  if (loading || !company || !companyId) {
    return <div className="flex items-center justify-center py-16"><div className="h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-4">
      <PageHeader title="Purchase Invoices" description="Manage your inward supplies and purchases">
        <button
          onClick={() => {
            setEditingPurchase(null);
            setIsCreateOpen(true);
          }}
          className="h-9 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700"
        >
          + New Purchase
        </button>
      </PageHeader>

      {isCreateOpen && (
        <DocumentWizard
          mode="purchase_invoice"
          companyId={companyId}
          sellerStateCode={sellerStateCode || undefined}
          initialPurchase={editingPurchase}
          onClose={() => { setIsCreateOpen(false); setEditingPurchase(null); }}
          onSave={() => setTick((x) => x + 1)}
        />
      )}

      {/* ── Summary cards ── */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        <div className="rounded-lg border border-gray-200 bg-white p-3">
          <p className="text-xs text-gray-500">Taxable Value</p>
          <p className="text-sm font-semibold">{inr(totals.taxable)}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-3">
          <p className="text-xs text-gray-500">CGST</p>
          <p className="text-sm font-semibold">{inr(totals.cgst)}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-3">
          <p className="text-xs text-gray-500">SGST</p>
          <p className="text-sm font-semibold">{inr(totals.sgst)}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-3">
          <p className="text-xs text-gray-500">IGST</p>
          <p className="text-sm font-semibold">{inr(totals.igst)}</p>
        </div>
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
          <p className="text-xs text-blue-700">Total Value</p>
          <p className="text-sm font-semibold text-blue-800">{inr(totals.total)}</p>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="flex items-center justify-between border-b border-gray-100 px-3 py-2">
          <h3 className="text-sm font-semibold text-gray-800">Purchase Transactions</h3>
          <p className="text-xs text-gray-500">Showing {rows.length} entries</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-xs">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase text-gray-500">No</th>
                <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase text-gray-500">Date</th>
                <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase text-gray-500">Bucket</th>
                <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase text-gray-500">Vendor</th>
                <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase text-gray-500">GSTIN</th>
                <th className="px-3 py-2 text-center text-[11px] font-semibold uppercase text-gray-500">ITC</th>
                <th className="px-3 py-2 text-right text-[11px] font-semibold uppercase text-gray-500">Taxable</th>
                <th className="px-3 py-2 text-right text-[11px] font-semibold uppercase text-gray-500">GST</th>
                <th className="px-3 py-2 text-right text-[11px] font-semibold uppercase text-gray-500">Total</th>
                <th className="w-20 px-3 py-2 text-right text-[11px] font-semibold uppercase text-gray-500"></th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr><td colSpan={10} className="px-3 py-10 text-center text-xs text-gray-500">No purchase invoices yet. Click "+ New Purchase" to create one.</td></tr>
              ) : rows.map((r) => {
                const gstTotal = r.cgst + r.sgst + r.igst;
                return (
                  <tr key={r.id} className="border-t border-gray-100 hover:bg-gray-50/50">
                    <td className="px-3 py-2 font-mono text-[11px]">{compactInvoiceNo(r.invoice_no)}</td>
                    <td className="px-3 py-2 text-[11px]">{r.invoice_date}</td>
                    <td className="px-3 py-2">
                      <span className="rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-semibold text-blue-700">{r.bucket}</span>
                    </td>
                    <td className="max-w-[180px] truncate px-3 py-2 text-[11px] font-medium text-gray-800">{r.vendor_name}</td>
                    <td className="px-3 py-2 font-mono text-[11px] text-gray-500">{r.vendor_gstin || '—'}</td>
                    <td className="px-3 py-2 text-center">
                      <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${r.itc_eligible ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                        {r.itc_eligible ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-right font-mono text-[11px]">{inr(r.taxable_value)}</td>
                    <td className="px-3 py-2 text-right font-mono text-[11px] text-gray-500">{inr(gstTotal)}</td>
                    <td className="px-3 py-2 text-right font-mono text-[11px] font-semibold">{inr(r.total)}</td>
                    <td className="px-3 py-2 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button title="Edit" onClick={() => { setEditingPurchase(r); setIsCreateOpen(true); }} className="rounded border border-blue-200 px-1.5 py-0.5 text-[11px] font-semibold text-blue-600 hover:bg-blue-50">Edit</button>
                        <button title="Delete" onClick={() => { deletePurchaseInvoice(r.id); setTick((x) => x + 1); }} className="rounded border border-red-200 px-1.5 py-0.5 text-[11px] font-semibold text-red-600 hover:bg-red-50">Del</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
