import type { DocumentMode } from '../types';
import type { InvoiceV2Draft, DocType } from '@/lib/accounting/gstInvoices';
import { DOC_TYPE_OPTIONS } from '@/lib/accounting/gstInvoices';
import type { PurchaseFields } from '../useDocumentState';

interface SalesHeaderProps {
  kind: 'sales';
  invoice: InvoiceV2Draft;
  updateInvoice: (u: Partial<InvoiceV2Draft>) => void;
  mode: DocumentMode;
}

interface PurchaseHeaderProps {
  kind: 'purchase';
  fields: PurchaseFields;
  updateField: <K extends keyof PurchaseFields>(key: K, value: PurchaseFields[K]) => void;
  mode: DocumentMode;
}

type HeaderSectionProps = SalesHeaderProps | PurchaseHeaderProps;

export function HeaderSection(props: HeaderSectionProps) {
  if (props.kind === 'sales') {
    const { invoice, updateInvoice, mode } = props;
    return (
      <fieldset className="rounded-lg border border-gray-200 p-4">
        <legend className="px-2 text-[11px] font-semibold uppercase tracking-wide text-gray-500">Header</legend>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <label>
            <span className="mb-1 block text-[11px] font-semibold text-gray-500">
              {mode === 'sales_return' ? 'CN No' : 'Invoice No'} *
            </span>
            <input
              value={invoice.invoice_no}
              onChange={(e) => updateInvoice({ invoice_no: e.target.value })}
              className="h-8 w-full rounded-lg border border-gray-300 px-3 text-xs font-semibold"
              placeholder={mode === 'sales_return' ? 'e.g. CN-001' : 'e.g. INV-001'}
            />
          </label>
          <label>
            <span className="mb-1 block text-[11px] font-semibold text-gray-500">Date *</span>
            <input
              type="date"
              value={invoice.invoice_date}
              onChange={(e) => updateInvoice({ invoice_date: e.target.value, period: e.target.value.slice(0, 7) })}
              className="h-8 w-full rounded-lg border border-gray-300 px-3 text-xs"
            />
          </label>
          {/* Document Type dropdown removed to enforce simple invoicing */}
        </div>
      </fieldset>
    );
  }

  // Purchase header
  const { fields, updateField, mode } = props;
  return (
    <fieldset className="rounded-lg border border-gray-200 p-4">
      <legend className="px-2 text-[11px] font-semibold uppercase tracking-wide text-gray-500">Header</legend>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <label>
          <span className="mb-1 block text-[11px] font-semibold text-gray-500">Date *</span>
          <input type="date" value={fields.invoiceDate} onChange={(e) => updateField('invoiceDate', e.target.value)} className="h-8 w-full rounded-lg border border-gray-300 px-3 text-xs font-semibold" />
        </label>
        <label>
          <span className="mb-1 block text-[11px] font-semibold text-gray-500">Vendor Invoice No *</span>
          <input value={fields.vendorInvoiceNo} onChange={(e) => updateField('vendorInvoiceNo', e.target.value)} className="h-8 w-full rounded-lg border border-gray-300 px-3 text-xs font-semibold" placeholder="e.g. GST/2024/0042" />
        </label>
        {mode === 'purchase_invoice' && (
          <label>
            <span className="mb-1 block text-[11px] font-semibold text-gray-500">Supply Type</span>
            <select value={fields.supplyType} onChange={(e) => updateField('supplyType', e.target.value as 'intra' | 'inter')} className="h-8 w-full rounded-lg border border-gray-300 px-3 text-xs font-semibold">
              <option value="intra">Intra-state (CGST+SGST)</option>
              <option value="inter">Inter-state (IGST)</option>
            </select>
          </label>
        )}
      </div>
    </fieldset>
  );
}
