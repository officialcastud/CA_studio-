import type { JournalEntry } from './computeEngine';

export interface GSTRegisterRow {
  date: string;
  voucherNumber: string;
  partyName: string;
  gstin: string;
  taxableValue: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalGst: number;
  invoiceTotal: number;
}

export interface GSTR1Summary {
  b2b: GSTRegisterRow[];
  b2c: GSTRegisterRow[];
  totalTaxableValue: number;
  totalCGST: number;
  totalSGST: number;
  totalIGST: number;
}

export interface GSTR3BSummary {
  outwardSupplies: { taxableValue: number; cgst: number; sgst: number; igst: number };
  itcAvailed: { cgst: number; sgst: number; igst: number };
  netTaxPayable: { cgst: number; sgst: number; igst: number };
}

export interface ITCRegisterRow {
  date: string;
  supplierName: string;
  gstin: string;
  invoiceNumber: string;
  cgst: number;
  sgst: number;
  igst: number;
  total: number;
  status: 'available' | 'reversed' | 'blocked';
}

const REVENUE_SUBGROUPS = ['Revenue from Operations'];
const DEBTOR_SUBGROUPS = ['Trade Receivables'];
const CREDITOR_SUBGROUPS = ['Trade Payables'];
const GST_OUTPUT_SUBGROUPS = ['GST — Output Tax'];
const GST_INPUT_SUBGROUPS = ['GST — Input Tax Credit'];
const GST_RCM_SUBGROUPS = ['GST — RCM'];

export function computeGSTR1(entries: JournalEntry[]): GSTR1Summary {
  const b2b: GSTRegisterRow[] = [];
  const b2c: GSTRegisterRow[] = [];

  const salesEntries = entries.filter(e => e.voucher_type === 'SLS');

  for (const entry of salesEntries) {
    let taxableValue = 0, cgst = 0, sgst = 0, igst = 0;
    let partyName = '';

    for (const line of entry.lines) {
      if (REVENUE_SUBGROUPS.includes(line.account_group)) {
        taxableValue += line.credit || 0;
      } else if (line.account_name.toLowerCase().includes('output cgst') || (GST_OUTPUT_SUBGROUPS.includes(line.account_group) && line.account_name.toLowerCase().includes('cgst'))) {
        cgst += line.credit || 0;
      } else if (line.account_name.toLowerCase().includes('output sgst') || (GST_OUTPUT_SUBGROUPS.includes(line.account_group) && line.account_name.toLowerCase().includes('sgst'))) {
        sgst += line.credit || 0;
      } else if (line.account_name.toLowerCase().includes('igst') || (GST_OUTPUT_SUBGROUPS.includes(line.account_group) && line.account_name.toLowerCase().includes('igst'))) {
        igst += line.credit || 0;
      } else if (DEBTOR_SUBGROUPS.includes(line.account_group)) {
        partyName = line.account_name;
      }
    }

    if (taxableValue > 0) {
      const gstin = entry.party_gstin ?? '';
      const row: GSTRegisterRow = {
        date: entry.entry_date,
        voucherNumber: entry.voucher_number || entry.entry_code,
        partyName, gstin,
        taxableValue, cgst, sgst, igst,
        totalGst: cgst + sgst + igst,
        invoiceTotal: taxableValue + cgst + sgst + igst,
      };
      (partyName ? b2b : b2c).push(row);
    }
  }

  const allRows = [...b2b, ...b2c];
  return {
    b2b, b2c,
    totalTaxableValue: allRows.reduce((s, r) => s + r.taxableValue, 0),
    totalCGST: allRows.reduce((s, r) => s + r.cgst, 0),
    totalSGST: allRows.reduce((s, r) => s + r.sgst, 0),
    totalIGST: allRows.reduce((s, r) => s + r.igst, 0),
  };
}

export function computeGSTR3B(entries: JournalEntry[]): GSTR3BSummary {
  const gstr1 = computeGSTR1(entries);

  let itcCGST = 0, itcSGST = 0, itcIGST = 0;
  const purchaseEntries = entries.filter(e => e.voucher_type === 'PUR');

  for (const entry of purchaseEntries) {
    for (const line of entry.lines) {
      const name = line.account_name.toLowerCase();
      const isInputGroup = GST_INPUT_SUBGROUPS.includes(line.account_group);
      if (name.includes('input cgst') || (isInputGroup && name.includes('cgst'))) itcCGST += line.debit || 0;
      else if (name.includes('input sgst') || (isInputGroup && name.includes('sgst'))) itcSGST += line.debit || 0;
      else if (name.includes('input igst') || (isInputGroup && name.includes('igst'))) itcIGST += line.debit || 0;
    }
  }

  let rcmCGST = 0, rcmSGST = 0, rcmIGST = 0;
  for (const entry of entries) {
    for (const line of entry.lines) {
      if (!GST_RCM_SUBGROUPS.includes(line.account_group)) continue;
      const name = line.account_name.toLowerCase();
      const amt = line.credit || 0;
      if (name.includes('cgst')) rcmCGST += amt;
      else if (name.includes('sgst')) rcmSGST += amt;
      else if (name.includes('igst')) rcmIGST += amt;
    }
  }

  return {
    outwardSupplies: { taxableValue: gstr1.totalTaxableValue, cgst: gstr1.totalCGST, sgst: gstr1.totalSGST, igst: gstr1.totalIGST },
    itcAvailed: { cgst: itcCGST, sgst: itcSGST, igst: itcIGST },
    netTaxPayable: {
      cgst: gstr1.totalCGST - itcCGST + rcmCGST,
      sgst: gstr1.totalSGST - itcSGST + rcmSGST,
      igst: gstr1.totalIGST - itcIGST + rcmIGST,
    },
  };
}

export function computeITCRegister(entries: JournalEntry[]): ITCRegisterRow[] {
  const rows: ITCRegisterRow[] = [];
  const purchaseEntries = entries.filter(e => e.voucher_type === 'PUR');

  for (const entry of purchaseEntries) {
    let cgst = 0, sgst = 0, igst = 0;
    let supplierName = '';

    for (const line of entry.lines) {
      const name = line.account_name.toLowerCase();
      const isInputGroup = GST_INPUT_SUBGROUPS.includes(line.account_group);
      if (name.includes('input cgst') || (isInputGroup && name.includes('cgst'))) cgst += line.debit || 0;
      else if (name.includes('input sgst') || (isInputGroup && name.includes('sgst'))) sgst += line.debit || 0;
      else if (name.includes('input igst') || (isInputGroup && name.includes('igst'))) igst += line.debit || 0;
      else if (CREDITOR_SUBGROUPS.includes(line.account_group)) supplierName = line.account_name;
    }

    if (cgst > 0 || sgst > 0 || igst > 0) {
      const gstin = entry.party_gstin ?? '';
      rows.push({
        date: entry.entry_date, supplierName, gstin,
        invoiceNumber: entry.voucher_number || entry.entry_code,
        cgst, sgst, igst, total: cgst + sgst + igst, status: 'available',
      });
    }
  }
  return rows;
}

export interface HSNSummaryRow {
  hsnCode: string;
  description: string;
  taxableValue: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalTax: number;
}

/** HSN-wise summary for GSTR-1 / reporting. Uses line.hsn_code when present; else grouped under "N/A". */
export function computeHSNSummary(entries: JournalEntry[]): HSNSummaryRow[] {
  const byHsn = new Map<string, { taxableValue: number; cgst: number; sgst: number; igst: number }>();

  const salesEntries = entries.filter(e => e.voucher_type === 'SLS');
  for (const entry of salesEntries) {
    let taxableValue = 0, cgst = 0, sgst = 0, igst = 0;
    let hsnCode = 'N/A';
    for (const line of entry.lines) {
      if (REVENUE_SUBGROUPS.includes(line.account_group)) {
        taxableValue += line.credit || 0;
        if (line.hsn_code) hsnCode = line.hsn_code;
      } else if (GST_OUTPUT_SUBGROUPS.includes(line.account_group) || line.account_name.toLowerCase().includes('output')) {
        const name = line.account_name.toLowerCase();
        const amt = line.credit || 0;
        if (name.includes('cgst')) cgst += amt;
        else if (name.includes('sgst')) sgst += amt;
        else if (name.includes('igst')) igst += amt;
      }
    }
    if (taxableValue > 0 || cgst > 0 || sgst > 0 || igst > 0) {
      const key = hsnCode;
      const cur = byHsn.get(key) ?? { taxableValue: 0, cgst: 0, sgst: 0, igst: 0 };
      cur.taxableValue += taxableValue;
      cur.cgst += cgst;
      cur.sgst += sgst;
      cur.igst += igst;
      byHsn.set(key, cur);
    }
  }

  return Array.from(byHsn.entries()).map(([hsnCode, v]) => ({
    hsnCode,
    description: hsnCode === 'N/A' ? 'Not specified' : `HSN ${hsnCode}`,
    taxableValue: v.taxableValue,
    cgst: v.cgst,
    sgst: v.sgst,
    igst: v.igst,
    totalTax: v.cgst + v.sgst + v.igst,
  }));
}

export interface GSTReconciliationRow {
  invoiceNumber: string;
  invoiceDate: string;
  supplierGstin: string;
  taxableValue: number;
  taxAmount: number;
  bookValue: number;
  bookTax: number;
  matchStatus: 'matched' | 'mismatch' | 'not_in_2b' | 'extra_in_2b';
}

/** Placeholder for GSTR-2A/2B vs books reconciliation. Pass external 2B data when available. */
export function computeGSTReconciliation(
  entries: JournalEntry[],
  _gstr2BData?: { invoiceNumber: string; taxableValue: number; taxAmount: number }[]
): GSTReconciliationRow[] {
  const purchaseEntries = entries.filter(e => e.voucher_type === 'PUR');
  const rows: GSTReconciliationRow[] = [];
  for (const entry of purchaseEntries) {
    let taxableValue = 0, taxAmount = 0;
    for (const line of entry.lines) {
      if (CREDITOR_SUBGROUPS.includes(line.account_group)) taxableValue += line.credit || line.debit || 0;
      if (GST_INPUT_SUBGROUPS.includes(line.account_group)) taxAmount += line.debit || 0;
    }
    if (taxableValue > 0 || taxAmount > 0) {
      rows.push({
        invoiceNumber: entry.voucher_number || entry.entry_code,
        invoiceDate: entry.entry_date,
        supplierGstin: entry.party_gstin ?? '',
        taxableValue,
        taxAmount,
        bookValue: taxableValue,
        bookTax: taxAmount,
        matchStatus: _gstr2BData ? 'matched' : 'not_in_2b',
      });
    }
  }
  return rows;
}
