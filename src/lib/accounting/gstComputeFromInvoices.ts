import type { InvoiceV2, PurchaseInvoice } from './gstInvoices';
import type { GSTR3BSummary, ITCRegisterRow } from './gstCompute';

/**
 * Compute GSTR-3B summary from invoice registers instead of journal entries.
 * Section 3.1 (Outward) from sales, Section 4 (ITC) from purchases, Section 5 (Net).
 */
export function computeGSTR3BFromInvoices(
  sales: InvoiceV2[],
  purchases: PurchaseInvoice[],
): GSTR3BSummary {
  // Section 3.1 — Outward supplies (exclude cancelled)
  const activeSales = sales.filter((s) => s.status !== 'CANCELLED');
  let outTxval = 0, outCgst = 0, outSgst = 0, outIgst = 0;
  for (const inv of activeSales) {
    outTxval += inv.total_taxable;
    outCgst += inv.total_cgst;
    outSgst += inv.total_sgst;
    outIgst += inv.total_igst;
  }

  // Section 4 — Eligible ITC from purchase invoices
  let itcCgst = 0, itcSgst = 0, itcIgst = 0;
  for (const p of purchases) {
    if (p.itc_eligible && (!p.itc_status || p.itc_status === 'ELIGIBLE_FULL' || p.itc_status === 'ELIGIBLE_PARTIAL')) {
      itcCgst += p.cgst;
      itcSgst += p.sgst;
      itcIgst += p.igst;
    }
  }

  return {
    outwardSupplies: {
      taxableValue: outTxval,
      cgst: outCgst,
      sgst: outSgst,
      igst: outIgst,
    },
    itcAvailed: {
      cgst: itcCgst,
      sgst: itcSgst,
      igst: itcIgst,
    },
    netTaxPayable: {
      cgst: outCgst - itcCgst,
      sgst: outSgst - itcSgst,
      igst: outIgst - itcIgst,
    },
  };
}

/**
 * Compute ITC register rows from purchase invoices.
 * Maps itc_status to available/blocked/reversed.
 */
export function computeITCFromPurchases(
  purchases: PurchaseInvoice[],
): ITCRegisterRow[] {
  const rows: ITCRegisterRow[] = [];
  for (const p of purchases) {
    const total = p.cgst + p.sgst + p.igst;
    if (total <= 0) continue;

    let status: 'available' | 'blocked' | 'reversed' = 'available';
    if (p.itc_status) {
      if (p.itc_status.startsWith('BLOCKED_') || p.itc_status.startsWith('INELIGIBLE_')) {
        status = 'blocked';
      } else if (p.itc_status.startsWith('REVERSED_')) {
        status = 'reversed';
      } else if (p.itc_status === 'PENDING_2B') {
        status = 'available'; // pending but not blocked
      }
    }
    if (!p.itc_eligible) {
      status = 'blocked';
    }

    rows.push({
      date: p.invoice_date,
      supplierName: p.vendor_name,
      gstin: p.vendor_gstin || '',
      invoiceNumber: p.invoice_no,
      cgst: p.cgst,
      sgst: p.sgst,
      igst: p.igst,
      total,
      status,
    });
  }
  return rows;
}
