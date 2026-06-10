import type { PurchaseFields } from '../useDocumentState';
import type { DocumentMode } from '../types';
import { WIZARD_CONFIG, PURCHASE_BUCKETS } from '../config';

interface PurchaseItemSectionProps {
  fields: PurchaseFields;
  updateField: <K extends keyof PurchaseFields>(key: K, value: PurchaseFields[K]) => void;
  mode: DocumentMode;
}

export function PurchaseItemSection({ fields, updateField, mode }: PurchaseItemSectionProps) {
  return (
    <fieldset className="rounded-lg border border-gray-200 p-4">
      <legend className="px-2 text-[11px] font-semibold uppercase tracking-wide text-gray-500">Item &amp; Tax</legend>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {mode === 'purchase_invoice' && (
          <label>
            <span className="mb-1 block text-[11px] font-semibold text-gray-500">Bucket</span>
            <select value={fields.bucket} onChange={(e) => updateField('bucket', e.target.value as any)} className="h-8 w-full rounded-lg border border-gray-300 px-3 text-xs font-semibold">
              {PURCHASE_BUCKETS.map((b) => <option key={b.code} value={b.code}>{b.label}</option>)}
            </select>
          </label>
        )}
        <label className="md:col-span-2">
          <span className="mb-1 block text-[11px] font-semibold text-gray-500">Description</span>
          <input value={fields.itemDescription} onChange={(e) => updateField('itemDescription', e.target.value)} className="h-8 w-full rounded-lg border border-gray-300 px-3 text-xs font-semibold" placeholder="e.g. Steel Rod 10mm" />
        </label>
        <label>
          <span className="mb-1 block text-[11px] font-semibold text-gray-500">HSN / SAC</span>
          <input value={fields.itemHsn} onChange={(e) => updateField('itemHsn', e.target.value)} className="h-8 w-full rounded-lg border border-gray-300 px-3 font-mono text-xs font-semibold" placeholder="7207" />
        </label>
        <label>
          <span className="mb-1 block text-[11px] font-semibold text-gray-500">Qty</span>
          <input type="number" value={fields.itemQty} onChange={(e) => updateField('itemQty', e.target.value)} className="h-8 w-full rounded-lg border border-gray-300 px-3 font-mono text-xs font-semibold text-right" min={0} />
        </label>
        <label>
          <span className="mb-1 block text-[11px] font-semibold text-gray-500">Rate</span>
          <input type="number" value={fields.itemRate} onChange={(e) => updateField('itemRate', e.target.value)} className="h-8 w-full rounded-lg border border-gray-300 px-3 font-mono text-xs font-semibold text-right" min={0} />
        </label>
        <label>
          <span className="mb-1 block text-[11px] font-semibold text-gray-500">Taxable Value *</span>
          <input type="number" value={fields.taxable} onChange={(e) => updateField('taxable', e.target.value)} className="h-8 w-full rounded-lg border border-gray-300 px-3 font-mono text-xs font-semibold text-right" />
        </label>
        <label>
          <span className="mb-1 block text-[11px] font-semibold text-gray-500">GST %</span>
          <input type="number" value={fields.gstRate} onChange={(e) => updateField('gstRate', e.target.value)} className="h-8 w-full rounded-lg border border-gray-300 px-3 font-mono text-xs font-semibold text-right" min={0} />
        </label>
      </div>
    </fieldset>
  );
}
