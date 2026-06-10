/**
 * Bulk Private Limited — CSV Import Pipeline (Phase C)
 *
 * Parses bank statement CSVs and seeds:
 *   - suspense_transactions (one per row, status=UNALLOCATED)
 *   - ledger_entries for the bank side (DR on RECEIPT, CR on PAYMENT)
 *
 * Auto-detects common Indian bank statement column layouts.
 * Uses SheetJS (already installed as 'xlsx').
 */

import * as XLSX from 'xlsx';
import type { ImportResult, SuspenseTransaction, BulkLedgerEntry } from './types';
import { bulkInsertSuspense, bulkInsertLedgerEntries, appendAuditLog, upsertLedgerAccount } from './bulkDb';
import { round2 } from './bulkLedger';

// ── Column detection ──────────────────────────────────────────────────────────

const DATE_ALIASES = ['date', 'txn date', 'transaction date', 'value date', 'posting date', 'tran date'];
const NARRATION_ALIASES = ['narration', 'description', 'particulars', 'remarks', 'details', 'transaction remarks', 'tran remarks'];
const REF_ALIASES = ['reference', 'ref no', 'reference no', 'chq/ref number', 'chq no', 'ref', 'cheque no', 'utr'];
const DEBIT_ALIASES = ['debit', 'withdrawal', 'withdrawals', 'debit amount', 'dr amount', 'dr', 'payment'];
const CREDIT_ALIASES = ['credit', 'deposit', 'deposits', 'credit amount', 'cr amount', 'cr', 'receipt'];
const BALANCE_ALIASES = ['balance', 'closing balance', 'running balance', 'available balance'];

function findCol(headers: string[], aliases: string[]): number {
  const lower = headers.map((h) => h.toLowerCase().trim());
  for (const alias of aliases) {
    const idx = lower.findIndex((h) => h.includes(alias));
    if (idx >= 0) return idx;
  }
  return -1;
}

function parseAmount(val: string | number | null | undefined): number {
  if (val == null || val === '') return 0;
  const str = String(val).replace(/[₹,\s]/g, '').trim();
  const n = parseFloat(str);
  return isNaN(n) ? 0 : round2(Math.abs(n));
}

function parseDate(val: string | number | null | undefined): string | null {
  if (!val) return null;
  // SheetJS with cellDates:true returns Date objects as strings already
  const str = String(val).trim();
  // Try to extract date from various formats
  const patterns = [
    /^(\d{4})-(\d{2})-(\d{2})/, // YYYY-MM-DD
    /^(\d{2})\/(\d{2})\/(\d{4})/, // DD/MM/YYYY
    /^(\d{2})-(\d{2})-(\d{4})/, // DD-MM-YYYY
    /^(\d{2})-(\w{3})-(\d{4})/i, // DD-Mon-YYYY
    /^(\d{2})\/(\d{2})\/(\d{2})$/, // DD/MM/YY
  ];

  for (const pat of patterns) {
    const m = str.match(pat);
    if (!m) continue;
    try {
      const d = new Date(str);
      if (!isNaN(d.getTime())) {
        return d.toISOString().split('T')[0];
      }
    } catch {
      // ignore
    }
  }

  // Fallback: just try Date constructor
  try {
    const d = new Date(str);
    if (!isNaN(d.getTime())) return d.toISOString().split('T')[0];
  } catch {
    // ignore
  }
  return null;
}

// ── Main import function ──────────────────────────────────────────────────────

export async function importBankCSV(
  companyId: string,
  fy: string,
  file: File,
): Promise<ImportResult> {
  const arrayBuffer = await file.arrayBuffer();
  const wb = XLSX.read(new Uint8Array(arrayBuffer), {
    type: 'array',
    cellDates: false, // keep as strings for flexible date parsing
    raw: false,
  });

  // Use first sheet
  const sheetName = wb.SheetNames[0];
  const ws = wb.Sheets[sheetName];

  const rows = XLSX.utils.sheet_to_json<string[]>(ws, {
    header: 1,
    defval: '',
    raw: false,
  }) as string[][];

  // Find the header row (first row with recognisable column names)
  let headerRowIdx = 0;
  let headers: string[] = [];
  for (let i = 0; i < Math.min(10, rows.length); i++) {
    const row = rows[i];
    const h = row.map((c) => String(c ?? '').toLowerCase().trim());
    if (
      findCol(h as string[], DATE_ALIASES) >= 0 ||
      findCol(h as string[], NARRATION_ALIASES) >= 0
    ) {
      headerRowIdx = i;
      headers = row.map((c) => String(c ?? ''));
      break;
    }
  }

  if (headers.length === 0) {
    // Fallback: just use first row as headers
    headers = (rows[0] ?? []).map((c) => String(c ?? ''));
    headerRowIdx = 0;
  }

  const dateCol = findCol(headers, DATE_ALIASES);
  const narCol = findCol(headers, NARRATION_ALIASES);
  const refCol = findCol(headers, REF_ALIASES);
  const drCol = findCol(headers, DEBIT_ALIASES);
  const crCol = findCol(headers, CREDIT_ALIASES);

  if (narCol < 0 && drCol < 0 && crCol < 0) {
    throw new Error(
      'Could not detect bank statement columns. Please ensure your CSV has headers like Date, Narration/Description, Debit/Withdrawal, Credit/Deposit.',
    );
  }

  // Ensure bank ledger account exists
  const bankAccount = upsertLedgerAccount(companyId, {
    name: 'Bank Account',
    group: 'Bank Accounts',
    accountType: 'asset',
    createdBy: 'MANUAL',
  });

  const batchId = crypto.randomUUID();
  const suspenseRows: SuspenseTransaction[] = [];
  const bankEntries: BulkLedgerEntry[] = [];
  const now = new Date().toISOString();

  let rowsImported = 0;
  let totalPayments = 0;
  let totalReceipts = 0;

  const dataRows = rows.slice(headerRowIdx + 1);

  dataRows.forEach((row, idx) => {
    // Skip completely empty rows
    if (!row || row.every((c) => String(c ?? '').trim() === '')) return;

    const narration = narCol >= 0 ? String(row[narCol] ?? '').trim() : '';
    const drAmt = drCol >= 0 ? parseAmount(row[drCol]) : 0;
    const crAmt = crCol >= 0 ? parseAmount(row[crCol]) : 0;
    const dateStr = dateCol >= 0 ? parseDate(row[dateCol]) : null;
    const refNo = refCol >= 0 ? String(row[refCol] ?? '').trim() : '';

    // Skip rows where both debit and credit are zero (might be balance row etc.)
    if (drAmt === 0 && crAmt === 0) return;

    const amount = drAmt > 0 ? drAmt : crAmt;
    const direction = drAmt > 0 ? 'PAYMENT' : 'RECEIPT';

    const suspenseId = crypto.randomUUID();

    suspenseRows.push({
      id: suspenseId,
      companyId,
      fy,
      batchId,
      txnDate: dateStr,
      narration: narration || `Row ${headerRowIdx + idx + 2}`,
      referenceNo: refNo,
      amount,
      direction,
      status: 'UNALLOCATED',
      allocatedLedgerId: null,
      allocatedBy: null,
      allocationKeyword: null,
      allocatedAt: null,
      originalRowNumber: headerRowIdx + idx + 2,
      createdAt: now,
    });

    // Bank side entry
    // PAYMENT = money out of bank → Bank CR
    // RECEIPT = money into bank → Bank DR
    bankEntries.push({
      id: crypto.randomUUID(),
      companyId,
      fy,
      ledgerAccountId: bankAccount.id,
      txnDate: dateStr,
      narration: narration || `Row ${headerRowIdx + idx + 2}`,
      referenceNo: refNo,
      amount,
      side: direction === 'PAYMENT' ? 'CR' : 'DR',
      source: 'BULK_CSV',
      suspenseId,
      batchId,
      allocatedBy: null,
      allocationKeyword: null,
      createdAt: now,
    });

    if (direction === 'PAYMENT') totalPayments = round2(totalPayments + amount);
    else totalReceipts = round2(totalReceipts + amount);
    rowsImported++;
  });

  if (rowsImported === 0) {
    throw new Error('No valid transaction rows found in the CSV. Please check the file format.');
  }

  // Bulk insert
  bulkInsertSuspense(companyId, suspenseRows);
  bulkInsertLedgerEntries(companyId, bankEntries);

  appendAuditLog(companyId, {
    actor: 'MANUAL',
    action: 'import_csv',
    detail: {
      fileName: file.name,
      batchId,
      rowsImported,
      totalPayments,
      totalReceipts,
      fy,
    },
  });

  return { batchId, rowsImported, totalPayments, totalReceipts };
}
