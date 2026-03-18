export type AccountNature = 'asset' | 'liability' | 'capital' | 'revenue' | 'expense';

export type BalanceSheetGroup =
  | 'Capital Accounts'
  | 'Current Liabilities'
  | 'Non-Current Liabilities'
  | 'Current Assets'
  | 'Fixed Assets'
  | 'Non-Current Assets'
  | 'Direct Expenses'
  | 'Indirect Expenses'
  | 'Direct Income'
  | 'Indirect Income';

export interface AccountGroup {
  name: string;
  parentGroup: string;
  nature: AccountNature;
  balanceSheetGroup: BalanceSheetGroup | null;
}

export const ACCOUNT_GROUPS: AccountGroup[] = [
  // ──────────────────────────────────────────────
  // Capital Accounts
  // ──────────────────────────────────────────────
  { name: 'Capital Account', parentGroup: 'Capital Accounts', nature: 'capital', balanceSheetGroup: 'Capital Accounts' },
  { name: 'Drawings Account', parentGroup: 'Capital Accounts', nature: 'capital', balanceSheetGroup: 'Capital Accounts' },
  { name: "Partners' Capital Account", parentGroup: 'Capital Accounts', nature: 'capital', balanceSheetGroup: 'Capital Accounts' },
  { name: 'Share Capital', parentGroup: 'Capital Accounts', nature: 'capital', balanceSheetGroup: 'Capital Accounts' },
  { name: 'Reserves & Surplus', parentGroup: 'Capital Accounts', nature: 'capital', balanceSheetGroup: 'Capital Accounts' },
  { name: 'Securities Premium', parentGroup: 'Capital Accounts', nature: 'capital', balanceSheetGroup: 'Capital Accounts' },

  // ──────────────────────────────────────────────
  // Current Liabilities
  // ──────────────────────────────────────────────
  { name: 'Sundry Creditors', parentGroup: 'Current Liabilities', nature: 'liability', balanceSheetGroup: 'Current Liabilities' },
  { name: 'Bills Payable', parentGroup: 'Current Liabilities', nature: 'liability', balanceSheetGroup: 'Current Liabilities' },
  { name: 'Outstanding Expenses', parentGroup: 'Current Liabilities', nature: 'liability', balanceSheetGroup: 'Current Liabilities' },
  { name: 'Income Received in Advance', parentGroup: 'Current Liabilities', nature: 'liability', balanceSheetGroup: 'Current Liabilities' },
  { name: 'Duties & Taxes', parentGroup: 'Current Liabilities', nature: 'liability', balanceSheetGroup: 'Current Liabilities' },
  { name: 'Output CGST', parentGroup: 'Duties & Taxes', nature: 'liability', balanceSheetGroup: 'Current Liabilities' },
  { name: 'Output SGST', parentGroup: 'Duties & Taxes', nature: 'liability', balanceSheetGroup: 'Current Liabilities' },
  { name: 'Output IGST', parentGroup: 'Duties & Taxes', nature: 'liability', balanceSheetGroup: 'Current Liabilities' },
  { name: 'TDS Payable', parentGroup: 'Duties & Taxes', nature: 'liability', balanceSheetGroup: 'Current Liabilities' },
  { name: 'TCS Payable', parentGroup: 'Duties & Taxes', nature: 'liability', balanceSheetGroup: 'Current Liabilities' },
  { name: 'GST Payable', parentGroup: 'Duties & Taxes', nature: 'liability', balanceSheetGroup: 'Current Liabilities' },
  { name: 'Professional Tax Payable', parentGroup: 'Duties & Taxes', nature: 'liability', balanceSheetGroup: 'Current Liabilities' },
  { name: 'Provident Fund Payable', parentGroup: 'Duties & Taxes', nature: 'liability', balanceSheetGroup: 'Current Liabilities' },
  { name: 'ESI Payable', parentGroup: 'Duties & Taxes', nature: 'liability', balanceSheetGroup: 'Current Liabilities' },
  { name: 'Short-term Borrowings', parentGroup: 'Current Liabilities', nature: 'liability', balanceSheetGroup: 'Current Liabilities' },
  { name: 'Advance from Customers', parentGroup: 'Current Liabilities', nature: 'liability', balanceSheetGroup: 'Current Liabilities' },

  // ──────────────────────────────────────────────
  // Non-Current Liabilities
  // ──────────────────────────────────────────────
  { name: 'Long-term Borrowings', parentGroup: 'Non-Current Liabilities', nature: 'liability', balanceSheetGroup: 'Non-Current Liabilities' },
  { name: 'Bank Loan', parentGroup: 'Non-Current Liabilities', nature: 'liability', balanceSheetGroup: 'Non-Current Liabilities' },
  { name: 'Mortgage Loan', parentGroup: 'Non-Current Liabilities', nature: 'liability', balanceSheetGroup: 'Non-Current Liabilities' },
  { name: 'Debentures', parentGroup: 'Non-Current Liabilities', nature: 'liability', balanceSheetGroup: 'Non-Current Liabilities' },

  // ──────────────────────────────────────────────
  // Current Assets
  // ──────────────────────────────────────────────
  { name: 'Cash Account', parentGroup: 'Current Assets', nature: 'asset', balanceSheetGroup: 'Current Assets' },
  { name: 'Bank Account', parentGroup: 'Current Assets', nature: 'asset', balanceSheetGroup: 'Current Assets' },
  { name: 'Sundry Debtors', parentGroup: 'Current Assets', nature: 'asset', balanceSheetGroup: 'Current Assets' },
  { name: 'Bills Receivable', parentGroup: 'Current Assets', nature: 'asset', balanceSheetGroup: 'Current Assets' },
  { name: 'Closing Stock', parentGroup: 'Current Assets', nature: 'asset', balanceSheetGroup: 'Current Assets' },
  { name: 'Prepaid Expenses', parentGroup: 'Current Assets', nature: 'asset', balanceSheetGroup: 'Current Assets' },
  { name: 'Accrued Income', parentGroup: 'Current Assets', nature: 'asset', balanceSheetGroup: 'Current Assets' },
  { name: 'Short-term Investments', parentGroup: 'Current Assets', nature: 'asset', balanceSheetGroup: 'Current Assets' },
  { name: 'Input CGST', parentGroup: 'Current Assets', nature: 'asset', balanceSheetGroup: 'Current Assets' },
  { name: 'Input SGST', parentGroup: 'Current Assets', nature: 'asset', balanceSheetGroup: 'Current Assets' },
  { name: 'Input IGST', parentGroup: 'Current Assets', nature: 'asset', balanceSheetGroup: 'Current Assets' },
  { name: 'TDS Receivable', parentGroup: 'Current Assets', nature: 'asset', balanceSheetGroup: 'Current Assets' },
  { name: 'Advance to Suppliers', parentGroup: 'Current Assets', nature: 'asset', balanceSheetGroup: 'Current Assets' },

  // ──────────────────────────────────────────────
  // Non-Current / Fixed Assets
  // ──────────────────────────────────────────────
  { name: 'Land & Building', parentGroup: 'Fixed Assets', nature: 'asset', balanceSheetGroup: 'Fixed Assets' },
  { name: 'Plant & Machinery', parentGroup: 'Fixed Assets', nature: 'asset', balanceSheetGroup: 'Fixed Assets' },
  { name: 'Furniture & Fixtures', parentGroup: 'Fixed Assets', nature: 'asset', balanceSheetGroup: 'Fixed Assets' },
  { name: 'Vehicles', parentGroup: 'Fixed Assets', nature: 'asset', balanceSheetGroup: 'Fixed Assets' },
  { name: 'Computers & IT Equipment', parentGroup: 'Fixed Assets', nature: 'asset', balanceSheetGroup: 'Fixed Assets' },
  { name: 'Office Equipment', parentGroup: 'Fixed Assets', nature: 'asset', balanceSheetGroup: 'Fixed Assets' },
  { name: 'Goodwill', parentGroup: 'Non-Current Assets', nature: 'asset', balanceSheetGroup: 'Non-Current Assets' },
  { name: 'Investments', parentGroup: 'Non-Current Assets', nature: 'asset', balanceSheetGroup: 'Non-Current Assets' },
  { name: 'Patents & Trademarks', parentGroup: 'Non-Current Assets', nature: 'asset', balanceSheetGroup: 'Non-Current Assets' },
  { name: 'Accumulated Depreciation', parentGroup: 'Fixed Assets', nature: 'asset', balanceSheetGroup: 'Fixed Assets' },

  // ──────────────────────────────────────────────
  // Direct Expenses
  // ──────────────────────────────────────────────
  { name: 'Opening Stock', parentGroup: 'Direct Expenses', nature: 'expense', balanceSheetGroup: 'Direct Expenses' },
  { name: 'Purchases', parentGroup: 'Direct Expenses', nature: 'expense', balanceSheetGroup: 'Direct Expenses' },
  { name: 'Purchase Returns', parentGroup: 'Direct Expenses', nature: 'expense', balanceSheetGroup: 'Direct Expenses' },
  { name: 'Wages', parentGroup: 'Direct Expenses', nature: 'expense', balanceSheetGroup: 'Direct Expenses' },
  { name: 'Carriage Inward', parentGroup: 'Direct Expenses', nature: 'expense', balanceSheetGroup: 'Direct Expenses' },
  { name: 'Factory Rent', parentGroup: 'Direct Expenses', nature: 'expense', balanceSheetGroup: 'Direct Expenses' },
  { name: 'Power & Fuel', parentGroup: 'Direct Expenses', nature: 'expense', balanceSheetGroup: 'Direct Expenses' },
  { name: 'Manufacturing Expenses', parentGroup: 'Direct Expenses', nature: 'expense', balanceSheetGroup: 'Direct Expenses' },
  { name: 'Customs Duty', parentGroup: 'Direct Expenses', nature: 'expense', balanceSheetGroup: 'Direct Expenses' },
  { name: 'Freight Inward', parentGroup: 'Direct Expenses', nature: 'expense', balanceSheetGroup: 'Direct Expenses' },

  // ──────────────────────────────────────────────
  // Indirect Expenses
  // ──────────────────────────────────────────────
  { name: 'Salaries', parentGroup: 'Indirect Expenses', nature: 'expense', balanceSheetGroup: 'Indirect Expenses' },
  { name: 'Rent', parentGroup: 'Indirect Expenses', nature: 'expense', balanceSheetGroup: 'Indirect Expenses' },
  { name: 'Insurance', parentGroup: 'Indirect Expenses', nature: 'expense', balanceSheetGroup: 'Indirect Expenses' },
  { name: 'Depreciation', parentGroup: 'Indirect Expenses', nature: 'expense', balanceSheetGroup: 'Indirect Expenses' },
  { name: 'Advertising & Marketing', parentGroup: 'Indirect Expenses', nature: 'expense', balanceSheetGroup: 'Indirect Expenses' },
  { name: 'Bad Debts', parentGroup: 'Indirect Expenses', nature: 'expense', balanceSheetGroup: 'Indirect Expenses' },
  { name: 'Interest Paid', parentGroup: 'Indirect Expenses', nature: 'expense', balanceSheetGroup: 'Indirect Expenses' },
  { name: 'Discount Allowed', parentGroup: 'Indirect Expenses', nature: 'expense', balanceSheetGroup: 'Indirect Expenses' },
  { name: 'Office Expenses', parentGroup: 'Indirect Expenses', nature: 'expense', balanceSheetGroup: 'Indirect Expenses' },
  { name: 'Audit Fees', parentGroup: 'Indirect Expenses', nature: 'expense', balanceSheetGroup: 'Indirect Expenses' },
  { name: 'Legal & Professional Fees', parentGroup: 'Indirect Expenses', nature: 'expense', balanceSheetGroup: 'Indirect Expenses' },
  { name: 'Telephone & Internet', parentGroup: 'Indirect Expenses', nature: 'expense', balanceSheetGroup: 'Indirect Expenses' },
  { name: 'Printing & Stationery', parentGroup: 'Indirect Expenses', nature: 'expense', balanceSheetGroup: 'Indirect Expenses' },
  { name: 'Postage & Courier', parentGroup: 'Indirect Expenses', nature: 'expense', balanceSheetGroup: 'Indirect Expenses' },
  { name: 'Travelling & Conveyance', parentGroup: 'Indirect Expenses', nature: 'expense', balanceSheetGroup: 'Indirect Expenses' },
  { name: 'Repairs & Maintenance', parentGroup: 'Indirect Expenses', nature: 'expense', balanceSheetGroup: 'Indirect Expenses' },
  { name: 'Bank Charges', parentGroup: 'Indirect Expenses', nature: 'expense', balanceSheetGroup: 'Indirect Expenses' },
  { name: 'Electricity Charges', parentGroup: 'Indirect Expenses', nature: 'expense', balanceSheetGroup: 'Indirect Expenses' },
  { name: 'Carriage Outward', parentGroup: 'Indirect Expenses', nature: 'expense', balanceSheetGroup: 'Indirect Expenses' },
  { name: 'Commission Paid', parentGroup: 'Indirect Expenses', nature: 'expense', balanceSheetGroup: 'Indirect Expenses' },
  { name: 'Donation & Charity', parentGroup: 'Indirect Expenses', nature: 'expense', balanceSheetGroup: 'Indirect Expenses' },
  { name: 'Miscellaneous Expenses', parentGroup: 'Indirect Expenses', nature: 'expense', balanceSheetGroup: 'Indirect Expenses' },
  { name: 'Loss on Sale of Asset', parentGroup: 'Indirect Expenses', nature: 'expense', balanceSheetGroup: 'Indirect Expenses' },
  { name: 'Round Off', parentGroup: 'Indirect Expenses', nature: 'expense', balanceSheetGroup: 'Indirect Expenses' },

  // ──────────────────────────────────────────────
  // Direct Income / Revenue
  // ──────────────────────────────────────────────
  { name: 'Sales', parentGroup: 'Direct Income', nature: 'revenue', balanceSheetGroup: 'Direct Income' },
  { name: 'Sales Returns', parentGroup: 'Direct Income', nature: 'revenue', balanceSheetGroup: 'Direct Income' },
  { name: 'Closing Stock (Revenue)', parentGroup: 'Direct Income', nature: 'revenue', balanceSheetGroup: 'Direct Income' },

  // ──────────────────────────────────────────────
  // Indirect Income
  // ──────────────────────────────────────────────
  { name: 'Interest Received', parentGroup: 'Indirect Income', nature: 'revenue', balanceSheetGroup: 'Indirect Income' },
  { name: 'Commission Received', parentGroup: 'Indirect Income', nature: 'revenue', balanceSheetGroup: 'Indirect Income' },
  { name: 'Discount Received', parentGroup: 'Indirect Income', nature: 'revenue', balanceSheetGroup: 'Indirect Income' },
  { name: 'Rent Received', parentGroup: 'Indirect Income', nature: 'revenue', balanceSheetGroup: 'Indirect Income' },
  { name: 'Bad Debts Recovered', parentGroup: 'Indirect Income', nature: 'revenue', balanceSheetGroup: 'Indirect Income' },
  { name: 'Dividend Income', parentGroup: 'Indirect Income', nature: 'revenue', balanceSheetGroup: 'Indirect Income' },
  { name: 'Profit on Sale of Asset', parentGroup: 'Indirect Income', nature: 'revenue', balanceSheetGroup: 'Indirect Income' },
  { name: 'Miscellaneous Income', parentGroup: 'Indirect Income', nature: 'revenue', balanceSheetGroup: 'Indirect Income' },
];

/**
 * Pre-built lookup map for O(1) account group retrieval by name.
 * Keys are stored in lowercase for case-insensitive matching.
 */
const accountGroupMap: Map<string, AccountGroup> = new Map(
  ACCOUNT_GROUPS.map((group) => [group.name.toLowerCase(), group]),
);

/**
 * Look up an account group by name (case-insensitive).
 * Returns `undefined` if no matching group is found.
 */
export function getAccountGroup(accountName: string): AccountGroup | undefined {
  return accountGroupMap.get(accountName.toLowerCase());
}
