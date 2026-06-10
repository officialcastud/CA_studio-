 import type { InventorySubLine, JournalLine } from '@/types/journal';
import {
  classifyAccount,
  getClassificationWithClarification,
  getPrimaryGroupForSubGroup,
  MASTER_COA,
  type ClassificationWithClarification,
  type JournalNature,
  type MasterAccount,
} from '@/lib/masterCOA';
// keywordClassify and classifyNewParty were part of the removed AI layer.
// For now, inventory classification relies on the master COA and basic fallbacks only.

type FallbackNature = 'asset' | 'liability' | 'capital' | 'revenue' | 'expense';

/** Route all COA types: when classify + keyword + party miss, infer sub-group from name so every type routes correctly. */
function getSafeFallbackClassification(name: string): { subGroup: string; nature: FallbackNature } {
  const n = name.toLowerCase().trim();
  if (!n) return { subGroup: 'Other Expenses — Administration', nature: 'expense' };

  // ── Assets (specific sub-groups first) ──
  if (/\b(trade receivables?|sundry debtors?|debtors?|bills receivable)\b/i.test(n)) {
    return { subGroup: 'Trade Receivables', nature: 'asset' };
  }
  if (/\b(inventor(y|ies)|stock[- ]in[- ]trade|raw material|wip|finished goods|goods in transit)\b/i.test(n)) {
    return { subGroup: 'Inventories', nature: 'asset' };
  }
  if (/\b(cash|petty cash|cash in hand)\b/i.test(n) && !/bank/i.test(n)) {
    return { subGroup: 'Cash & Cash Equivalents', nature: 'asset' };
  }
  if (/\b(bank|current a\/c|savings a\/c|overdraft|cash credit)\b/i.test(n)) {
    return { subGroup: 'Bank Balances', nature: 'asset' };
  }
  if (/\b(fixed deposit|fd\b|recurring deposit)\b/i.test(n)) {
    return { subGroup: 'Cash Equivalents', nature: 'asset' };
  }
  if (/\b(accumulated depreciation|accum\.?\s*dep)\b/i.test(n)) {
    return { subGroup: 'Accumulated Depreciation', nature: 'asset' };
  }
  if (/\b(accumulated amortisation|accum\.?\s*amort)\b/i.test(n)) {
    return { subGroup: 'Accumulated Amortisation', nature: 'asset' };
  }
  if (/\b(land|building|plant|machinery|furniture|vehicle|computer|equipment)\b/i.test(n) && !/depreciation|expense/i.test(n)) {
    return { subGroup: 'Tangible Fixed Assets', nature: 'asset' };
  }
  if (/\b(goodwill|patent|trademark|copyright|software license)\b/i.test(n)) {
    return { subGroup: 'Intangible Assets', nature: 'asset' };
  }
  if (/\b(cwip|capital work in progress)\b/i.test(n)) {
    return { subGroup: 'Capital Work in Progress', nature: 'asset' };
  }
  if (/\b(investment)\b/i.test(n) && !/current\b/i.test(n)) {
    return { subGroup: 'Non-current Investments', nature: 'asset' };
  }
  if (/\b(advance given|loan given|prepaid|security deposit paid)\b/i.test(n)) {
    return { subGroup: 'Short-term Loans & Advances', nature: 'asset' };
  }
  if (/\b(input cgst|input sgst|input igst|gst.*input|itc)\b/i.test(n)) {
    return { subGroup: 'GST — Input Tax Credit', nature: 'asset' };
  }
  if (/\b(deferred tax asset|mat credit)\b/i.test(n)) {
    return { subGroup: 'Deferred Tax Asset', nature: 'asset' };
  }
  if (/\b(suspense|clearing)\b/i.test(n)) {
    return { subGroup: 'Suspense & Clearing', nature: 'asset' };
  }
  if (/\b(accrued revenue|unbilled|claims receivable)\b/i.test(n)) {
    return { subGroup: 'Other Current Assets', nature: 'asset' };
  }
  if (/\b(asset|receivable)\b/i.test(n)) {
    return { subGroup: 'Other Current Assets', nature: 'asset' };
  }

  // ── Liabilities (specific sub-groups first) ──
  if (/\b(trade payables?|sundry creditors?|trade creditors?|creditors?|bills payable)\b/i.test(n)) {
    return { subGroup: 'Trade Payables', nature: 'liability' };
  }
  if (/\b(term loan|debenture|long[- ]?term borrow)\b/i.test(n)) {
    return { subGroup: 'Long-term Borrowings', nature: 'liability' };
  }
  if (/\b(cash credit|overdraft|short[- ]?term borrow)\b/i.test(n)) {
    return { subGroup: 'Short-term Borrowings', nature: 'liability' };
  }
  if (/\b(provision for tax|provision for dividend|provision for audit)\b/i.test(n)) {
    return { subGroup: 'Short-term Provisions', nature: 'liability' };
  }
  if (/\b(provision for gratuity|provision for leave|provision for pension)\b/i.test(n)) {
    return { subGroup: 'Long-term Provisions', nature: 'liability' };
  }
  if (/\b(tds|tcs|pf payable|esi|income tax payable|statutory)\b/i.test(n)) {
    return { subGroup: 'Statutory Liabilities', nature: 'liability' };
  }
  if (/\b(output cgst|output sgst|output igst|gst.*output|gst payable)\b/i.test(n)) {
    return { subGroup: 'GST — Output Tax', nature: 'liability' };
  }
  if (/\b(deferred tax liability)\b/i.test(n)) {
    return { subGroup: 'Deferred Tax Liability', nature: 'liability' };
  }
  if (/\b(salary payable|wages payable|bonus payable|other current liab)\b/i.test(n)) {
    return { subGroup: 'Other Current Liabilities', nature: 'liability' };
  }
  if (/\b(borrowing|loan taken|advance received|payable)\b/i.test(n)) {
    return { subGroup: 'Other Current Liabilities', nature: 'liability' };
  }

  // ── Capital & reserves ──
  if (/\b(share capital|equity|capital account|reserves?|surplus)\b/i.test(n) && !/payable|expense/i.test(n)) {
    return { subGroup: 'Reserves & Surplus', nature: 'capital' };
  }
  if (/\b(capital|proprietor|partner.*capital)\b/i.test(n)) {
    return { subGroup: 'Share Capital', nature: 'capital' };
  }

  // ── Income ──
  if (/\b(sales?|revenue from operations)\b/i.test(n) && !/return|payable/i.test(n)) {
    return { subGroup: 'Revenue from Operations', nature: 'revenue' };
  }
  if (/\b(interest received|dividend received|rent received|other income)\b/i.test(n)) {
    return { subGroup: 'Other Income', nature: 'revenue' };
  }

  // ── Expenses (specific sub-groups) ──
  if (/\b(purchases?|cost of materials|raw material.*purchase)\b/i.test(n) && !/return/i.test(n)) {
    return { subGroup: 'Cost of Materials Consumed', nature: 'expense' };
  }
  if (/\b(opening stock|closing stock|changes in inventor)\b/i.test(n)) {
    return { subGroup: 'Changes in Inventories', nature: 'expense' };
  }
  if (/\b(direct expense|factory|manufacturing)\b/i.test(n)) {
    return { subGroup: 'Direct Expenses', nature: 'expense' };
  }
  if (/\b(salary|wages|employee benefit|pf|esi|gratuity)\b/i.test(n)) {
    return { subGroup: 'Employee Benefits Expense', nature: 'expense' };
  }
  if (/\b(interest paid|finance cost|bank charge)\b/i.test(n)) {
    return { subGroup: 'Finance Costs', nature: 'expense' };
  }
  if (/\b(depreciation|amortisation)\b/i.test(n)) {
    return { subGroup: 'Depreciation & Amortisation', nature: 'expense' };
  }
  if (/\b(tax expense|income tax expense|current tax)\b/i.test(n)) {
    return { subGroup: 'Tax Expense', nature: 'expense' };
  }
  if (/\b(advertisement|selling expense|commission.*sale)\b/i.test(n)) {
    return { subGroup: 'Other Expenses — Selling', nature: 'expense' };
  }
  if (/\b(bad debt|write[- ]?off|exceptional)\b/i.test(n)) {
    return { subGroup: 'Other Expenses — Write-offs', nature: 'expense' };
  }

  return { subGroup: 'Other Expenses — Administration', nature: 'expense' };
}

/** Resolve account name to classification + clarification (same pipeline as expandManualJournalLines). Use for manual & AI entry UI. */
export function getResolvedClassification(
  accountName: string,
  context?: { voucherType?: string; companyId?: string }
): ClassificationWithClarification | null {
  if (!accountName?.trim()) return null;
  const name = accountName.trim();

  const cls = classifyAccount(name);
  if (cls) return getClassificationWithClarification(cls);

  const fallback = getSafeFallbackClassification(name);
  return getClassificationWithClarification({
    subGroup: fallback.subGroup,
    primaryGroup: getPrimaryGroupForSubGroup(fallback.subGroup),
    nature: fallback.nature as JournalNature,
    contra: false,
  });
}

export interface InventorySubLineComputed extends InventorySubLine {
  amount: number;
  discount_amount: number;
  taxable_amount: number;
  cgst_amount: number;
  sgst_amount: number;
  igst_amount: number;
  final_amount: number;
}

export interface InventoryParentSummary {
  taxableTotal: number;
  cgstTotal: number;
  sgstTotal: number;
  igstTotal: number;
  finalTotal: number;
  subLines: InventorySubLineComputed[];
}

export interface ManualDraftLine {
  account_name: string;
  debit: string;
  credit: string;
  inventory_sub_lines?: InventorySubLine[];
  /** Optional explicit classification chosen by the user (New Account dialog or master pick). */
  account_group?: string;
  nature?: JournalLine['nature'];
  tds_section?: string;
  tds_rate?: string;
  tcs_section?: string;
  tcs_rate?: string;
}

/** Parse debit/credit from inputs; strips commas and ₹ so "1,00,000" parses correctly (parseFloat alone yields 1). */
export function parseManualAmount(input: string | number | undefined | null): number {
  if (input == null || input === '') return 0;
  if (typeof input === 'number') return Number.isFinite(input) ? input : 0;
  const s = String(input).replace(/[₹,\s]/g, '').trim();
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : 0;
}

const INVENTORY_SENSITIVE_ACCOUNTS = new Set([
  'purchase',
  'purchases',
  'sale',
  'sales',
  'purchase return',
  'purchase returns',
  'sales return',
  'sales returns',
  'stock-in-trade',
  'raw material',
  'work-in-progress',
  'finished goods',
  'opening stock',
  'closing stock',
  'cost of goods sold',
  'consumption of raw materials',
  'stores consumed',
  'stock shortage',
  'stock write-off',
  'abnormal loss',
  'stock excess',
]);

function normalized(name: string) {
  return name.trim().toLowerCase();
}

function canonicalAccount(name: string): string {
  const n = normalized(name);
  if (n === 'purchase' || n === 'purchases') return 'purchases';
  if (n === 'sale' || n === 'sales') return 'sales';
  if (n === 'purchase return' || n === 'purchase returns') return 'purchase returns';
  if (n === 'sales return' || n === 'sales returns') return 'sales returns';
  return n;
}

const INVENTORY_SENSITIVE_SUBGROUPS = new Set<string>([
  'Inventories',
  'Cost of Materials Consumed',
  'Changes in Inventories',
  'Purchases of Stock-in-Trade',
  'Direct Expenses',
  'Other Expenses — Write-offs',
]);

function findMasterAccountByName(name: string): MasterAccount | undefined {
  const trimmed = name.trim();
  let match = MASTER_COA.find((a) => a.name === trimmed);
  if (match) return match;
  const lower = trimmed.toLowerCase();
  match = MASTER_COA.find((a) => a.name.toLowerCase() === lower);
  return match;
}

export function isInventorySensitiveLine(accountName: string): boolean {
  const trimmed = accountName.trim();
  if (!trimmed) return false;

  const master = findMasterAccountByName(trimmed);
  if (master) {
    if (master.isInventorySensitive) return true;
    if (INVENTORY_SENSITIVE_SUBGROUPS.has(master.subGroup)) return true;
  }

  const cls = classifyAccount(trimmed);
  if (cls && INVENTORY_SENSITIVE_SUBGROUPS.has(cls.subGroup)) {
    return true;
  }

  const name = canonicalAccount(trimmed);
  return INVENTORY_SENSITIVE_ACCOUNTS.has(name);
}

// Backwards-compatible alias used by UI components like ManualEntryDialog.
export function isInventorySensitiveAccount(accountName: string): boolean {
  return isInventorySensitiveLine(accountName);
}

export function emptyInventorySubLine(): InventorySubLine {
  return {
    inventory_name: '',
    hsn_sac: '',
    unit: '',
    qty: 1,
    rate: 0,
    discount_percent: 0,
    cgst_percent: 0,
    sgst_percent: 0,
    igst_percent: 0,
  };
}

export function computeInventorySubLine(line: InventorySubLine): InventorySubLineComputed {
  const amount = (line.qty || 0) * (line.rate || 0);
  const discount_amount = amount * ((line.discount_percent || 0) / 100);
  const taxable_amount = amount - discount_amount;
  const cgst_amount = taxable_amount * ((line.cgst_percent || 0) / 100);
  const sgst_amount = taxable_amount * ((line.sgst_percent || 0) / 100);
  const igst_amount = taxable_amount * ((line.igst_percent || 0) / 100);
  const final_amount = taxable_amount + cgst_amount + sgst_amount + igst_amount;

  return {
    ...line,
    amount,
    discount_amount,
    taxable_amount,
    cgst_amount,
    sgst_amount,
    igst_amount,
    final_amount,
  };
}

export function summarizeInventorySubLines(subLines: InventorySubLine[] = []): InventoryParentSummary {
  const computed = subLines.map(computeInventorySubLine);
  return computed.reduce(
    (acc, line) => ({
      taxableTotal: acc.taxableTotal + line.taxable_amount,
      cgstTotal: acc.cgstTotal + line.cgst_amount,
      sgstTotal: acc.sgstTotal + line.sgst_amount,
      igstTotal: acc.igstTotal + line.igst_amount,
      finalTotal: acc.finalTotal + line.final_amount,
      subLines: [...acc.subLines, line],
    }),
    {
      taxableTotal: 0,
      cgstTotal: 0,
      sgstTotal: 0,
      igstTotal: 0,
      finalTotal: 0,
      subLines: [] as InventorySubLineComputed[],
    }
  );
}

function parentSideForAccount(accountName: string): 'debit' | 'credit' {
  const name = canonicalAccount(accountName);
  if (name === 'sales' || name === 'purchase returns') return 'credit';
  return 'debit';
}

function gstPrefixForAccount(accountName: string): 'Input' | 'Output' {
  const name = canonicalAccount(accountName);
  if (name === 'sales' || name === 'sales returns') return 'Output';
  return 'Input';
}

function gstSideForAccount(accountName: string): 'debit' | 'credit' {
  const name = canonicalAccount(accountName);
  if (name === 'sales' || name === 'purchase returns') return 'credit';
  return 'debit';
}

function lineGroup(accountName: string): string {
  const cls = classifyAccount(accountName);
  if (cls) return cls.subGroup;
  const name = canonicalAccount(accountName);
  if (name === 'purchases') return 'Cost of Materials Consumed';
  if (name === 'sales') return 'Revenue from Operations';
  if (name === 'purchase returns') return 'Cost of Materials Consumed';
  if (name === 'sales returns') return 'Revenue from Operations';
  if (name === 'stock-in-trade') return 'Inventories';
  return 'Unclassified';
}

function lineNature(accountName: string): JournalLine['nature'] {
  const cls = classifyAccount(accountName);
  if (cls) return cls.nature;
  const name = canonicalAccount(accountName);
  if (name === 'sales') return 'revenue';
  if (name === 'sales returns') return 'revenue';
  if (name === 'purchase returns') return 'expense';
  if (name === 'stock-in-trade' || name === 'raw material' || name === 'work-in-progress' || name === 'finished goods' || name === 'opening stock' || name === 'closing stock') {
    return 'asset';
  }
  return 'expense';
}

function makeLine(
  account_name: string,
  amount: number,
  side: 'debit' | 'credit',
  extra?: Partial<JournalLine>
): JournalLine {
  return {
    account_name,
    account_group: extra?.account_group ?? 'Auto',
    nature: extra?.nature ?? 'expense',
    debit: side === 'debit' ? amount : 0,
    credit: side === 'credit' ? amount : 0,
    inventory_sub_lines: extra?.inventory_sub_lines,
  };
}

export function expandManualJournalLines(
  lines: ManualDraftLine[],
  context?: { voucherType?: string; companyId?: string }
): JournalLine[] {
  const expanded: JournalLine[] = [];

  for (const line of lines) {
    const name = line.account_name.trim();
    if (!name) continue;

    const hasInventoryDetails = (line.inventory_sub_lines?.length ?? 0) > 0;
    if (isInventorySensitiveLine(name) && hasInventoryDetails) {
      const summary = summarizeInventorySubLines(line.inventory_sub_lines ?? []);
      const parentAmount = summary.taxableTotal;
      const parentSide = parentSideForAccount(name);
      expanded.push(
        makeLine(name, parentAmount, parentSide, {
          account_group: lineGroup(name),
          nature: lineNature(name),
          inventory_sub_lines: line.inventory_sub_lines ?? [],
        })
      );

      const gstPrefix = gstPrefixForAccount(name);
      const gstSide = gstSideForAccount(name);
      if (summary.cgstTotal > 0) {
        expanded.push(makeLine(`${gstPrefix} CGST`, summary.cgstTotal, gstSide, {
          account_group: 'Duties & Taxes',
          nature: gstPrefix === 'Input' ? 'asset' : 'liability',
        }));
      }
      if (summary.sgstTotal > 0) {
        expanded.push(makeLine(`${gstPrefix} SGST`, summary.sgstTotal, gstSide, {
          account_group: 'Duties & Taxes',
          nature: gstPrefix === 'Input' ? 'asset' : 'liability',
        }));
      }
      if (summary.igstTotal > 0) {
        expanded.push(makeLine(`${gstPrefix} IGST`, summary.igstTotal, gstSide, {
          account_group: 'Duties & Taxes',
          nature: gstPrefix === 'Input' ? 'asset' : 'liability',
        }));
      }
      continue;
    }

    const cls = classifyAccount(name);
    const fallback = getSafeFallbackClassification(name);
    const account_group = line.account_group ?? cls?.subGroup ?? fallback.subGroup;
    const nature = (line.nature ?? cls?.nature ?? fallback.nature) as JournalLine['nature'];
    expanded.push({
      account_name: name,
      account_group,
      nature,
      debit: parseManualAmount(line.debit),
      credit: parseManualAmount(line.credit),
      // Carry TDS/TCS metadata through to the persisted line
      ...(line.tds_section ? { tds_section: line.tds_section, tds_rate: parseFloat(line.tds_rate ?? '0') || undefined } : {}),
      ...(line.tcs_section ? { tcs_section: line.tcs_section, tcs_rate: parseFloat(line.tcs_rate ?? '0') || undefined } : {}),
    });
  }

  return expanded.filter((line) => line.debit > 0 || line.credit > 0);
}

export function getPreviewAmountForLine(line: ManualDraftLine): { debit: number; credit: number } {
  const hasInventoryDetails = (line.inventory_sub_lines?.length ?? 0) > 0;
  if (!isInventorySensitiveLine(line.account_name) || !hasInventoryDetails) {
    return {
      debit: parseManualAmount(line.debit),
      credit: parseManualAmount(line.credit),
    };
  }

  const summary = summarizeInventorySubLines(line.inventory_sub_lines ?? []);
  const side = parentSideForAccount(line.account_name);
  return {
    debit: side === 'debit' ? summary.taxableTotal : 0,
    credit: side === 'credit' ? summary.taxableTotal : 0,
  };
}

export function getAutoGstPreviewLines(line: ManualDraftLine): Array<{ account_name: string; debit: number; credit: number }> {
  const hasInventoryDetails = (line.inventory_sub_lines?.length ?? 0) > 0;
  if (!isInventorySensitiveLine(line.account_name) || !hasInventoryDetails) return [];
  const summary = summarizeInventorySubLines(line.inventory_sub_lines ?? []);
  const gstPrefix = gstPrefixForAccount(line.account_name);
  const gstSide = gstSideForAccount(line.account_name);

  const out: Array<{ account_name: string; debit: number; credit: number }> = [];
  const pushTax = (label: string, amount: number) => {
    if (amount <= 0) return;
    out.push({
      account_name: `${gstPrefix} ${label}`,
      debit: gstSide === 'debit' ? amount : 0,
      credit: gstSide === 'credit' ? amount : 0,
    });
  };

  pushTax('CGST', summary.cgstTotal);
  pushTax('SGST', summary.sgstTotal);
  pushTax('IGST', summary.igstTotal);
  return out;
}

export function getExpandedTotals(
  lines: ManualDraftLine[],
  context?: { voucherType?: string; companyId?: string }
): { debit: number; credit: number } {
  const expanded = expandManualJournalLines(lines, context);
  return expanded.reduce(
    (acc, line) => ({
      debit: acc.debit + (line.debit || 0),
      credit: acc.credit + (line.credit || 0),
    }),
    { debit: 0, credit: 0 }
  );
}

