import type { DocumentMode } from '../types';
import type { InvoiceV2Draft } from '@/lib/accounting/gstInvoices';
import { STATE_CODES } from '@/lib/accounting/gstInvoices';
import { WIZARD_CONFIG } from '../config';
import type { PurchaseFields } from '../useDocumentState';

interface SalesPartyProps {
  kind: 'sales';
  invoice: InvoiceV2Draft;
  updateInvoice: (u: Partial<InvoiceV2Draft>) => void;
  handleGstinChange: (value: string) => void;
  gstinError: string | null;
  mode: DocumentMode;
}

interface PurchasePartyProps {
  kind: 'purchase';
  fields: PurchaseFields;
  updateField: <K extends keyof PurchaseFields>(key: K, value: PurchaseFields[K]) => void;
  mode: DocumentMode;
}

type PartySectionProps = SalesPartyProps | PurchasePartyProps;

export function PartySection(props: PartySectionProps) {
  const config = WIZARD_CONFIG[props.mode];

  if (props.kind === 'sales') {
    const { invoice, updateInvoice, handleGstinChange, gstinError } = props;
    return (
      <fieldset className="rounded-lg border border-gray-200 p-4">
        <legend className="px-2 text-[11px] font-semibold uppercase tracking-wide text-gray-500">{config.partyLabel}</legend>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <label>
            <span className="mb-1 block text-[11px] font-semibold text-gray-500">{config.partyLabel} Name *</span>
            <input
              value={invoice.buyer_name}
              onChange={(e) => updateInvoice({ buyer_name: e.target.value })}
              className="h-8 w-full rounded-lg border border-gray-300 px-3 text-xs font-semibold"
              placeholder={`${config.partyLabel} name`}
            />
          </label>
          <label>
            <span className="mb-1 block text-[11px] font-semibold text-gray-500">GSTIN</span>
            <input
              value={invoice.buyer_gstin || ''}
              onChange={(e) => handleGstinChange(e.target.value)}
              className={`h-8 w-full rounded-lg border px-3 font-mono text-xs uppercase ${gstinError ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
              maxLength={15}
              placeholder="Auto-detects B2B / B2C"
            />
            {gstinError && <span className="text-[10px] text-red-600">{gstinError}</span>}
          </label>
          <label>
            <span className="mb-1 block text-[11px] font-semibold text-gray-500">Place of Supply *</span>
            <select
              value={invoice.place_of_supply}
              onChange={(e) => {
                const code = e.target.value;
                updateInvoice({
                  place_of_supply: code,
                  buyer_state_code: code,
                  buyer_state: STATE_CODES[code] || '',
                });
              }}
              className="h-8 w-full rounded-lg border border-gray-300 px-3 text-xs"
            >
              <option value="">Select state</option>
              {Object.entries(STATE_CODES).map(([code, name]) => (
                <option key={code} value={code}>{code} — {name}</option>
              ))}
            </select>
          </label>
        </div>
      </fieldset>
    );
  }

  // Purchase party
  const { fields, updateField, mode } = props;
  const needsGstin = mode === 'purchase_return' || fields.bucket === 'B2B' || fields.bucket === 'CDNR';
  return (
    <fieldset className="rounded-lg border border-gray-200 p-4">
      <legend className="px-2 text-[11px] font-semibold uppercase tracking-wide text-gray-500">{config.partyLabel}</legend>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <label>
          <span className="mb-1 block text-[11px] font-semibold text-gray-500">{config.partyLabel} Name *</span>
          <input value={fields.vendorName} onChange={(e) => updateField('vendorName', e.target.value)} className="h-8 w-full rounded-lg border border-gray-300 px-3 text-xs font-semibold" placeholder="Supplier name" />
        </label>
        <label>
          <span className="mb-1 block text-[11px] font-semibold text-gray-500">GSTIN {needsGstin ? '*' : ''}</span>
          <input value={fields.vendorGstin} onChange={(e) => updateField('vendorGstin', e.target.value.toUpperCase())} className="h-8 w-full rounded-lg border border-gray-300 px-3 font-mono text-xs font-semibold uppercase" placeholder="27ABCDE1234F1Z5" maxLength={15} />
        </label>
        <label>
          <span className="mb-1 block text-[11px] font-semibold text-gray-500">Place of Supply *</span>
          <input value={fields.posState} onChange={(e) => updateField('posState', e.target.value)} className="h-8 w-full rounded-lg border border-gray-300 px-3 text-xs font-semibold" placeholder="Karnataka" />
        </label>
      </div>
    </fieldset>
  );
}
