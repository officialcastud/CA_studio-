/**
 * Basic COA — ~77 most-used accounts shown by default in the dropdown.
 * When user types, the full 520-account MASTER_COA is searched.
 * When user types something not in MASTER_COA, classification dialog is shown.
 */

export const BASIC_COA: string[] = [
  // Cash & Bank
  'Cash in Hand — Main / Head Office',
  'Petty Cash',
  'Current Account — Bank 1',
  'Current Account — Bank 2',
  'Savings Account',

  // Sales & Revenue
  'Sales — Domestic Products / Goods',
  'Sales — Services Rendered',
  'Sales — Traded Goods',
  'Sales Returns & Allowances',
  'Trade Discounts Allowed',
  'Other Operating Revenue',

  // Purchases & Cost
  'Purchases — Raw Materials (Domestic)',
  'Purchases — Traded Goods',
  'Purchase Returns',
  'Carriage Inward / Freight Inward',
  'Direct Labour / Manufacturing Wages',

  // Trade Debtors & Creditors
  'Debtors — Domestic (Trade)',
  'Debtors — Export (Foreign)',
  'Bills Receivable',
  'Trade Creditors — Domestic (Goods)',
  'Trade Creditors — Domestic (Services)',
  'Bills Payable',
  'Advance to Suppliers (Short-term)',
  'Advance from Customers (Short-term)',

  // Capital & Owners
  'Equity Share Capital',
  'Retained Earnings / Surplus in P&L',
  'General Reserve',
  'Drawings Account',
  'Securities Premium Reserve',

  // GST
  'CGST Output Tax Payable',
  'SGST / UTGST Output Tax Payable',
  'IGST Output Tax Payable',
  'CGST Input Tax Credit Receivable',
  'SGST / UTGST Input Tax Credit Receivable',
  'IGST Input Tax Credit Receivable',

  // TDS
  'TDS Payable — Sec 192 (Salary)',
  'TDS Payable — Sec 194C (Contractors)',
  'TDS Payable — Sec 194J (Professional Fees)',
  'TDS Receivable — Sec 194J (Professional Fees)',
  'TDS Receivable — Sec 194A (Interest)',

  // Common Expenses
  'Salaries & Wages',
  'Rent — Office',
  'Electricity & Power — Office',
  'Telephone & Internet — Office',
  'Printing & Stationery',
  'Legal & Professional Charges',
  'Advertisement & Publicity',
  'Freight Outward / Delivery Charges',
  'Discount Allowed',
  'Bank Charges & Commission',
  'Interest on Term Loans',
  'Interest on Working Capital / Cash Credit',
  'Depreciation — Tangible Assets',
  'Bad Debts Written Off',
  'Miscellaneous Administrative Expenses',

  // Common Income
  'Interest Income — Fixed Deposits',
  'Rent Received',
  'Discount Received',
  'Commission Received',
  'Miscellaneous Income',

  // Fixed Assets
  'Land — Freehold',
  'Buildings — Office',
  'Plant & Machinery',
  'Furniture & Fixtures',
  'Computers & IT Equipment',
  'Vehicles — Commercial',

  // Loans & Payables
  'Term Loans from Banks — Secured',
  'Cash Credit from Banks',
  'Overdraft from Banks',
  'Loans from Directors',
  'Outstanding Expenses Payable',
  'Salary Payable',

  // Tax & Statutory
  'Advance Income Tax Paid (Current Year)',
  'PF Payable (Employee + Employer)',
  'ESI Payable (Employee + Employer)',
  'Income Tax Payable',
  'Provision for Tax (Current Year)',
];

export const BASIC_COA_SET = new Set(BASIC_COA.map(n => n.toLowerCase()));
