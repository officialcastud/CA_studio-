/**
 * Auto-generate journal entries from sales/purchase invoices & returns.
 *
 * Called after DocumentWizard saves a new invoice so that
 * financial statements (Ledger, Trial Balance, P&L, BS) stay in sync
 * with GST records without manual JE creation.
 */

import type { InvoiceV2 } from '@/lib/accounting/gstInvoices';
import type { PurchaseInvoice } from '@/lib/accounting/gstInvoices';
import type { JournalLine } from '@/types/journal';
import { createJournalEntry, type NewJournalEntryInput } from '@/lib/offlineDb';
import { generateUniqueEntryCode } from '@/lib/utils/entryCodeGenerator';

// ── Account constants ──

const ACCT = {
  // Asset
  debtors:     { name: 'Debtors — Domestic (Trade)',               group: 'Trade Receivables',          nature: 'asset' as const },
  cash:        { name: 'Cash in Hand — Main / Head Office',        group: 'Cash and Cash Equivalents',  nature: 'asset' as const },
  cgstItc:     { name: 'CGST Input Tax Credit Receivable',         group: 'GST — Input Tax Credit',     nature: 'asset' as const },
  sgstItc:     { name: 'SGST / UTGST Input Tax Credit Receivable', group: 'GST — Input Tax Credit',     nature: 'asset' as const },
  igstItc:     { name: 'IGST Input Tax Credit Receivable',         group: 'GST — Input Tax Credit',     nature: 'asset' as const },
  // Liability
  creditors:   { name: 'Trade Creditors — Domestic (Goods)',       group: 'Trade Payables',             nature: 'liability' as const },
  cgstOutput:  { name: 'CGST Output Tax Payable',                  group: 'GST — Output Tax',           nature: 'liability' as const },
  sgstOutput:  { name: 'SGST / UTGST Output Tax Payable',          group: 'GST — Output Tax',           nature: 'liability' as const },
  igstOutput:  { name: 'IGST Output Tax Payable',                  group: 'GST — Output Tax',           nature: 'liability' as const },
  // Revenue
  sales:       { name: 'Sales — Domestic Products / Goods',        group: 'Revenue from Operations',    nature: 'revenue' as const },
  salesReturn: { name: 'Sales Returns & Allowances',               group: 'Revenue from Operations',    nature: 'revenue' as const },
  // Expense
  purchases:   { name: 'Purchases — Traded Goods',                 group: 'Purchases of Stock-in-Trade', nature: 'expense' as const },
  purchReturn: { name: 'Purchase Returns',                         group: 'Cost of Materials Consumed',  nature: 'expense' as const },
} as const;

// ── Helpers ──

function line(acct: { name: string; group: string; nature: JournalLine['nature'] }, debit: number, credit: number): JournalLine {
  return { account_name: acct.name, account_group: acct.group, nature: acct.nature, debit, credit };
}

/** Derive book period string from a YYYY-MM-DD date. */
function toBookPeriod(dateStr: string): string {
  const [y, m] = dateStr.split('-').map(Number);
  const fyStart = m >= 4 ? y : y - 1;
  return `FY ${fyStart}-${String(fyStart + 1).slice(2)}`;
}

// ── Sales ──

/**
 * Create a journal entry for a newly saved sales invoice or credit note.
 * Returns the JE id on success, or null if skipped (zero-amount / error).
 */
export function createSalesJournalEntry(companyId: string, invoice: InvoiceV2): string | null {
  if (!invoice.total_amount) return null;

  const isCreditNote = invoice.doc_type === 'CREDIT_NOTE';
  const voucherType = isCreditNote ? 'CN' : 'SLS';

  // For credit/partial: use party name so Debtors page shows per-party outstanding
  // For cash/online: use Cash account (no receivable created)
  const isCash = invoice.payment_mode === 'CASH' || invoice.payment_mode === 'ONLINE';
  const debitAcct = isCash
    ? ACCT.cash
    : { name: invoice.buyer_name || 'Debtors — Domestic (Trade)', group: 'Trade Receivables', nature: 'asset' as const };

  const lines: JournalLine[] = [];

  if (!isCreditNote) {
    // ── Normal sale: DR Debtors/Cash, CR Sales + GST ──
    lines.push(line(debitAcct, invoice.total_amount, 0));
    if (invoice.items && invoice.items.length > 0) {
      invoice.items.forEach(item => {
        if (item.taxable_value > 0) {
          const salesAcctName = item.description?.trim() || ACCT.sales.name;
          lines.push(line({ name: salesAcctName, group: ACCT.sales.group, nature: ACCT.sales.nature }, 0, item.taxable_value));
        }
      });
    } else {
      lines.push(line(ACCT.sales, 0, invoice.total_taxable));
    }
    if (invoice.total_cgst > 0) lines.push(line(ACCT.cgstOutput, 0, invoice.total_cgst));
    if (invoice.total_sgst > 0) lines.push(line(ACCT.sgstOutput, 0, invoice.total_sgst));
    if (invoice.total_igst > 0) lines.push(line(ACCT.igstOutput, 0, invoice.total_igst));
  } else {
    // ── Credit note: DR Sales Returns + GST, CR Debtors/Cash ──
    if (invoice.items && invoice.items.length > 0) {
      invoice.items.forEach(item => {
        if (item.taxable_value > 0) {
          const salesReturnAcctName = item.description?.trim() || ACCT.salesReturn.name;
          lines.push(line({ name: salesReturnAcctName, group: ACCT.salesReturn.group, nature: ACCT.salesReturn.nature }, item.taxable_value, 0));
        }
      });
    } else {
      lines.push(line(ACCT.salesReturn, invoice.total_taxable, 0));
    }
    if (invoice.total_cgst > 0) lines.push(line(ACCT.cgstOutput, invoice.total_cgst, 0));
    if (invoice.total_sgst > 0) lines.push(line(ACCT.sgstOutput, invoice.total_sgst, 0));
    if (invoice.total_igst > 0) lines.push(line(ACCT.igstOutput, invoice.total_igst, 0));
    lines.push(line(debitAcct, 0, invoice.total_amount));
  }

  const narration = isCreditNote
    ? `Credit Note ${invoice.invoice_no} — ${invoice.buyer_name || 'Consumer'}`
    : `Sales Invoice ${invoice.invoice_no} — ${invoice.buyer_name || 'Consumer'}`;

  try {
    const entry = createJournalEntry({
      company_id: companyId,
      entry_code: generateUniqueEntryCode(companyId, voucherType),
      entry_date: invoice.invoice_date,
      voucher_type: voucherType,
      voucher_number: invoice.invoice_no,
      lines,
      narration,
      book_period: toBookPeriod(invoice.invoice_date),
    } satisfies NewJournalEntryInput);
    return entry.id;
  } catch {
    console.error('[invoiceJournalSync] Failed to create sales JE for', invoice.invoice_no);
    return null;
  }
}

// ── Purchase ──

/**
 * Create a journal entry for a newly saved purchase invoice or debit note.
 * Returns the JE id on success, or null if skipped (zero-amount / error).
 */
export function createPurchaseJournalEntry(companyId: string, purchase: PurchaseInvoice): string | null {
  if (!purchase.total) return null;

  const isDebitNote = purchase.bucket === 'CDNR';
  const voucherType = isDebitNote ? 'DN' : 'PUR';

  // For credit/partial: use party name so Creditors page shows per-party outstanding
  // For cash/online: use Cash account (no payable created)
  const isCash = purchase.payment_mode === 'CASH' || purchase.payment_mode === 'ONLINE';
  const creditAcct = isCash
    ? ACCT.cash
    : { name: purchase.vendor_name || 'Trade Creditors — Domestic (Goods)', group: 'Trade Payables', nature: 'liability' as const };

  const lines: JournalLine[] = [];

  // When ITC is not eligible, the purchase amount includes tax
  const purchaseAmount = purchase.itc_eligible ? purchase.taxable_value : purchase.total;

  if (!isDebitNote) {
    // ── Normal purchase: DR Purchases + ITC, CR Creditors/Cash ──
    const purchaseAcctName = purchase.item_description?.trim() || ACCT.purchases.name;
    lines.push(line({ name: purchaseAcctName, group: ACCT.purchases.group, nature: ACCT.purchases.nature }, purchaseAmount, 0));
    if (purchase.itc_eligible) {
      if (purchase.cgst > 0) lines.push(line(ACCT.cgstItc, purchase.cgst, 0));
      if (purchase.sgst > 0) lines.push(line(ACCT.sgstItc, purchase.sgst, 0));
      if (purchase.igst > 0) lines.push(line(ACCT.igstItc, purchase.igst, 0));
    }
    lines.push(line(creditAcct, 0, purchase.total));
  } else {
    // ── Debit note: DR Creditors/Cash, CR Purchases + ITC ──
    lines.push(line(creditAcct, purchase.total, 0));
    const purchReturnAcctName = purchase.item_description?.trim() || ACCT.purchReturn.name;
    lines.push(line({ name: purchReturnAcctName, group: ACCT.purchReturn.group, nature: ACCT.purchReturn.nature }, 0, purchaseAmount));
    if (purchase.itc_eligible) {
      if (purchase.cgst > 0) lines.push(line(ACCT.cgstItc, 0, purchase.cgst));
      if (purchase.sgst > 0) lines.push(line(ACCT.sgstItc, 0, purchase.sgst));
      if (purchase.igst > 0) lines.push(line(ACCT.igstItc, 0, purchase.igst));
    }
  }

  const narration = isDebitNote
    ? `Debit Note ${purchase.invoice_no} — ${purchase.vendor_name}`
    : `Purchase Invoice ${purchase.invoice_no} — ${purchase.vendor_name}`;

  try {
    const entry = createJournalEntry({
      company_id: companyId,
      entry_code: generateUniqueEntryCode(companyId, voucherType),
      entry_date: purchase.invoice_date,
      voucher_type: voucherType,
      voucher_number: purchase.invoice_no,
      lines,
      narration,
      book_period: toBookPeriod(purchase.invoice_date),
    } satisfies NewJournalEntryInput);
    return entry.id;
  } catch {
    console.error('[invoiceJournalSync] Failed to create purchase JE for', purchase.invoice_no);
    return null;
  }
}
