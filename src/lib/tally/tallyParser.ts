// ============================================================================
// Tally viewer — parse a Tally XML export and derive Trial Balance, Balance
// Sheet, P&L and Ledger reports for a chosen period.
//
// Tally export: Gateway of Tally → Display More Reports → (any report / Day Book
// / List of Accounts) → Alt+E (Export) → format "XML". The file contains GROUP &
// LEDGER masters and VOUCHER transactions.
//
// Sign convention used here:
//   • Internal signed balance: +ve = Debit, −ve = Credit.
//   • Voucher line: ISDEEMEDPOSITIVE = "Yes" → Debit, else Credit; value = |AMOUNT|.
//   • OPENINGBALANCE: Tally exports debit balances as negative → internal = −raw.
// ============================================================================

export type TallyNature = 'asset' | 'liability' | 'income' | 'expense' | 'unknown';

export interface TallyGroup { name: string; parent: string }
export interface TallyLedger { name: string; parent: string; opening: number /* internal signed */ }
export interface TallyVoucherLine { ledger: string; debit: number; credit: number }
export interface TallyVoucher {
  date: string;          // yyyy-mm-dd
  type: string;
  number: string;
  narration: string;
  lines: TallyVoucherLine[];
}
export interface TallyDataset {
  fileName: string;
  importedAt: string;
  groups: TallyGroup[];
  ledgers: TallyLedger[];
  vouchers: TallyVoucher[];
  minDate: string;
  maxDate: string;
}

// ── helpers ─────────────────────────────────────────────────────────────────
const num = (s: string | null | undefined): number => {
  if (!s) return 0;
  const v = parseFloat(String(s).replace(/,/g, '').trim());
  return Number.isFinite(v) ? v : 0;
};

const tallyDate = (s: string | null | undefined): string => {
  const d = (s || '').trim();
  if (/^\d{8}$/.test(d)) return `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}`;
  if (/^\d{4}-\d{2}-\d{2}/.test(d)) return d.slice(0, 10);
  return d;
};

const firstText = (el: Element, tag: string): string => {
  const found = el.getElementsByTagName(tag)[0];
  return found?.textContent?.trim() ?? '';
};

// ── parse ───────────────────────────────────────────────────────────────────
export function parseTallyXml(xmlText: string, fileName = 'tally.xml'): TallyDataset {
  const doc = new DOMParser().parseFromString(xmlText, 'text/xml');
  if (doc.getElementsByTagName('parsererror').length) {
    throw new Error('Could not parse the file — make sure it is a Tally XML export.');
  }

  const groups: TallyGroup[] = [];
  for (const g of Array.from(doc.getElementsByTagName('GROUP'))) {
    const name = (g.getAttribute('NAME') || firstText(g, 'NAME')).trim();
    if (!name) continue;
    groups.push({ name, parent: firstText(g, 'PARENT') });
  }

  const ledgers: TallyLedger[] = [];
  for (const l of Array.from(doc.getElementsByTagName('LEDGER'))) {
    const name = (l.getAttribute('NAME') || firstText(l, 'NAME')).trim();
    if (!name) continue;
    ledgers.push({ name, parent: firstText(l, 'PARENT'), opening: -num(firstText(l, 'OPENINGBALANCE')) });
  }

  const vouchers: TallyVoucher[] = [];
  let minDate = '';
  let maxDate = '';
  for (const v of Array.from(doc.getElementsByTagName('VOUCHER'))) {
    const date = tallyDate(firstText(v, 'DATE'));
    const type = firstText(v, 'VOUCHERTYPENAME') || v.getAttribute('VCHTYPE') || '';
    const number = firstText(v, 'VOUCHERNUMBER');
    const narration = firstText(v, 'NARRATION');

    const entryEls = [
      ...Array.from(v.getElementsByTagName('ALLLEDGERENTRIES.LIST')),
      ...Array.from(v.getElementsByTagName('LEDGERENTRIES.LIST')),
    ];
    const lines: TallyVoucherLine[] = [];
    for (const e of entryEls) {
      const ledger = firstText(e, 'LEDGERNAME');
      if (!ledger) continue;
      const isDebit = firstText(e, 'ISDEEMEDPOSITIVE').toLowerCase() === 'yes';
      const amount = Math.abs(num(firstText(e, 'AMOUNT')));
      if (amount === 0) continue;
      lines.push({ ledger, debit: isDebit ? amount : 0, credit: isDebit ? 0 : amount });
    }
    if (!lines.length) continue;

    vouchers.push({ date, type, number, narration, lines });
    if (date) {
      if (!minDate || date < minDate) minDate = date;
      if (!maxDate || date > maxDate) maxDate = date;
    }
  }

  return {
    fileName,
    importedAt: new Date().toISOString(),
    groups,
    ledgers,
    vouchers,
    minDate,
    maxDate,
  };
}

/** Merge two parsed exports (e.g. a masters XML + a day-book XML) into one. */
export function mergeTallyDatasets(a: TallyDataset, b: TallyDataset): TallyDataset {
  const groups = [...a.groups];
  const gseen = new Set(a.groups.map((g) => g.name.toLowerCase()));
  for (const g of b.groups) if (!gseen.has(g.name.toLowerCase())) { groups.push(g); gseen.add(g.name.toLowerCase()); }

  const ledgers = [...a.ledgers];
  const lseen = new Set(a.ledgers.map((l) => l.name.toLowerCase()));
  for (const l of b.ledgers) if (!lseen.has(l.name.toLowerCase())) { ledgers.push(l); lseen.add(l.name.toLowerCase()); }

  const vouchers = [...a.vouchers, ...b.vouchers];
  const dates = vouchers.map((v) => v.date).filter(Boolean).sort();
  return {
    fileName: a.fileName === b.fileName ? a.fileName : `${a.fileName} + ${b.fileName}`,
    importedAt: a.importedAt,
    groups, ledgers, vouchers,
    minDate: dates[0] ?? a.minDate ?? b.minDate,
    maxDate: dates[dates.length - 1] ?? a.maxDate ?? b.maxDate,
  };
}

// ── group/nature classification ─────────────────────────────────────────────
const PRIMARY_GROUP_NATURE: Record<string, TallyNature> = {
  'capital account': 'liability', 'reserves & surplus': 'liability', 'reserves and surplus': 'liability',
  'loans (liability)': 'liability', 'secured loans': 'liability', 'unsecured loans': 'liability',
  'bank od a/c': 'liability', 'bank occ a/c': 'liability', 'duties & taxes': 'liability', 'duties and taxes': 'liability',
  'provisions': 'liability', 'current liabilities': 'liability', 'sundry creditors': 'liability', 'branch / divisions': 'liability',
  'fixed assets': 'asset', 'investments': 'asset', 'current assets': 'asset', 'bank accounts': 'asset',
  'cash-in-hand': 'asset', 'deposits (asset)': 'asset', 'loans & advances (asset)': 'asset', 'loans and advances (asset)': 'asset',
  'stock-in-hand': 'asset', 'sundry debtors': 'asset', 'misc. expenses (asset)': 'asset', 'miscellaneous expenses (asset)': 'asset',
  'suspense a/c': 'asset',
  'sales accounts': 'income', 'direct incomes': 'income', 'income (direct)': 'income', 'indirect incomes': 'income', 'income (indirect)': 'income',
  'purchase accounts': 'expense', 'direct expenses': 'expense', 'expenses (direct)': 'expense', 'indirect expenses': 'expense', 'expenses (indirect)': 'expense',
};

function keywordNature(name: string): TallyNature {
  const n = name.toLowerCase();
  if (/debtor|receivable/.test(n)) return 'asset';
  if (/creditor|payable/.test(n)) return 'liability';
  if (/duties|tax|provision|capital|reserve|loan/.test(n)) return 'liability';
  if (/sales|revenue|interest received|discount received|indirect income|direct income/.test(n)) return 'income';
  if (/purchase|expense|cost|salary|wages|rent|freight/.test(n)) return 'expense';
  if (/cash|bank|stock|inventory|asset|deposit|advance/.test(n)) return 'asset';
  return 'unknown';
}

/** Resolve a ledger to a primary-group nature by walking up the group chain. */
export function natureOf(ds: TallyDataset, parentGroup: string): TallyNature {
  const groupParent = new Map(ds.groups.map((g) => [g.name.toLowerCase(), g.parent]));
  let cur = parentGroup;
  const seen = new Set<string>();
  while (cur && !seen.has(cur.toLowerCase())) {
    seen.add(cur.toLowerCase());
    const hit = PRIMARY_GROUP_NATURE[cur.toLowerCase()];
    if (hit) return hit;
    const next = groupParent.get(cur.toLowerCase());
    if (!next) break;
    cur = next;
  }
  return keywordNature(parentGroup);
}

// ── balances & flows ─────────────────────────────────────────────────────────
export interface LedgerBalance { name: string; group: string; nature: TallyNature; signed: number }

/** Closing signed balance (+Dr / −Cr) for every ledger as at `toDate` (inclusive). */
export function ledgerBalancesAsAt(ds: TallyDataset, toDate: string): LedgerBalance[] {
  const map = new Map<string, LedgerBalance>();
  const ensure = (name: string) => {
    const key = name.toLowerCase();
    let row = map.get(key);
    if (!row) {
      const led = ds.ledgers.find((l) => l.name.toLowerCase() === key);
      const group = led?.parent ?? '';
      row = { name: led?.name ?? name, group, nature: natureOf(ds, group), signed: led?.opening ?? 0 };
      map.set(key, row);
    }
    return row;
  };
  // seed all masters (so zero-movement ledgers still show their opening)
  ds.ledgers.forEach((l) => ensure(l.name));
  for (const v of ds.vouchers) {
    if (toDate && v.date && v.date > toDate) continue;
    for (const ln of v.lines) ensure(ln.ledger).signed += ln.debit - ln.credit;
  }
  return Array.from(map.values());
}

export interface TBRow { name: string; debit: number; credit: number }
export interface TrialBalance { rows: TBRow[]; totalDebit: number; totalCredit: number }

export function computeTallyTrialBalance(ds: TallyDataset, toDate: string): TrialBalance {
  const rows = ledgerBalancesAsAt(ds, toDate)
    .filter((b) => Math.abs(b.signed) > 0.005)
    .map((b) => ({ name: b.name, debit: b.signed > 0 ? b.signed : 0, credit: b.signed < 0 ? -b.signed : 0 }))
    .sort((a, b) => a.name.localeCompare(b.name));
  return {
    rows,
    totalDebit: rows.reduce((s, r) => s + r.debit, 0),
    totalCredit: rows.reduce((s, r) => s + r.credit, 0),
  };
}

export interface PLLine { name: string; amount: number }
export interface ProfitLoss { income: PLLine[]; expenses: PLLine[]; totalIncome: number; totalExpense: number; netProfit: number }

/** P&L for the period [fromDate, toDate] from income/expense ledger flows. */
export function computeTallyProfitLoss(ds: TallyDataset, fromDate: string, toDate: string): ProfitLoss {
  const flow = new Map<string, { nature: TallyNature; signed: number }>();
  const natureFor = (name: string) => {
    const led = ds.ledgers.find((l) => l.name.toLowerCase() === name.toLowerCase());
    return natureOf(ds, led?.parent ?? name);
  };
  for (const v of ds.vouchers) {
    if (fromDate && v.date && v.date < fromDate) continue;
    if (toDate && v.date && v.date > toDate) continue;
    for (const ln of v.lines) {
      const key = ln.ledger.toLowerCase();
      const e = flow.get(key) ?? { nature: natureFor(ln.ledger), signed: 0 };
      e.signed += ln.debit - ln.credit;
      flow.set(key, e);
    }
  }
  const income: PLLine[] = [];
  const expenses: PLLine[] = [];
  for (const [key, e] of flow) {
    const name = ds.ledgers.find((l) => l.name.toLowerCase() === key)?.name ?? key;
    if (e.nature === 'income' && Math.abs(e.signed) > 0.005) income.push({ name, amount: -e.signed }); // Cr = income
    else if (e.nature === 'expense' && Math.abs(e.signed) > 0.005) expenses.push({ name, amount: e.signed }); // Dr = expense
  }
  income.sort((a, b) => b.amount - a.amount);
  expenses.sort((a, b) => b.amount - a.amount);
  const totalIncome = income.reduce((s, r) => s + r.amount, 0);
  const totalExpense = expenses.reduce((s, r) => s + r.amount, 0);
  return { income, expenses, totalIncome, totalExpense, netProfit: totalIncome - totalExpense };
}

export interface BSLine { name: string; amount: number }
export interface BalanceSheet {
  assets: BSLine[]; liabilities: BSLine[];
  totalAssets: number; totalLiabilities: number;
  netProfit: number; balanced: boolean;
}

/** Balance Sheet as at `toDate` (net profit up to that date folded into capital). */
export function computeTallyBalanceSheet(ds: TallyDataset, toDate: string): BalanceSheet {
  const balances = ledgerBalancesAsAt(ds, toDate);
  const assets: BSLine[] = [];
  const liabilities: BSLine[] = [];
  for (const b of balances) {
    if (Math.abs(b.signed) < 0.005) continue;
    if (b.nature === 'asset') assets.push({ name: b.name, amount: b.signed });
    else if (b.nature === 'liability') liabilities.push({ name: b.name, amount: -b.signed });
    else if (b.nature === 'unknown') {
      // fall back on the sign: Dr → asset, Cr → liability
      if (b.signed > 0) assets.push({ name: b.name, amount: b.signed });
      else liabilities.push({ name: b.name, amount: -b.signed });
    }
  }
  // net profit (cumulative income − expense up to toDate) → goes to capital side
  const pl = computeTallyProfitLoss(ds, '', toDate);
  const netProfit = pl.netProfit;
  liabilities.push({ name: netProfit >= 0 ? 'Profit for the period (to Capital)' : 'Loss for the period (to Capital)', amount: netProfit });

  assets.sort((a, b) => b.amount - a.amount);
  liabilities.sort((a, b) => b.amount - a.amount);
  const totalAssets = assets.reduce((s, r) => s + r.amount, 0);
  const totalLiabilities = liabilities.reduce((s, r) => s + r.amount, 0);
  return {
    assets, liabilities, totalAssets, totalLiabilities, netProfit,
    balanced: Math.abs(totalAssets - totalLiabilities) < 1,
  };
}

export interface LedgerTxn { date: string; type: string; number: string; narration: string; debit: number; credit: number; running: number }
export interface LedgerReport { name: string; group: string; opening: number; transactions: LedgerTxn[]; closing: number }

/** Per-ledger statement: opening as at fromDate, then transactions in [from,to]. */
export function computeTallyLedger(ds: TallyDataset, ledgerName: string, fromDate: string, toDate: string): LedgerReport {
  const led = ds.ledgers.find((l) => l.name.toLowerCase() === ledgerName.toLowerCase());
  let opening = led?.opening ?? 0;
  // add movements strictly before fromDate to the opening
  for (const v of ds.vouchers) {
    if (!v.date || (fromDate && v.date >= fromDate)) continue;
    for (const ln of v.lines) if (ln.ledger.toLowerCase() === ledgerName.toLowerCase()) opening += ln.debit - ln.credit;
  }
  const transactions: LedgerTxn[] = [];
  let running = opening;
  const inRange = ds.vouchers
    .filter((v) => v.date && (!fromDate || v.date >= fromDate) && (!toDate || v.date <= toDate))
    .sort((a, b) => a.date.localeCompare(b.date));
  for (const v of inRange) {
    for (const ln of v.lines) {
      if (ln.ledger.toLowerCase() !== ledgerName.toLowerCase()) continue;
      running += ln.debit - ln.credit;
      transactions.push({ date: v.date, type: v.type, number: v.number, narration: v.narration, debit: ln.debit, credit: ln.credit, running });
    }
  }
  return { name: led?.name ?? ledgerName, group: led?.parent ?? '', opening, transactions, closing: running };
}

// ── persistence (localStorage, per company) ──────────────────────────────────
const key = (companyId: string) => `tally_import_${companyId}`;

export function saveTallyDataset(companyId: string, ds: TallyDataset): boolean {
  try {
    localStorage.setItem(key(companyId), JSON.stringify(ds));
    return true;
  } catch {
    return false; // quota exceeded — caller keeps it in memory only
  }
}

export function loadTallyDataset(companyId: string): TallyDataset | null {
  try {
    const raw = localStorage.getItem(key(companyId));
    return raw ? (JSON.parse(raw) as TallyDataset) : null;
  } catch {
    return null;
  }
}

export function clearTallyDataset(companyId: string): void {
  try { localStorage.removeItem(key(companyId)); } catch { /* ignore */ }
}
