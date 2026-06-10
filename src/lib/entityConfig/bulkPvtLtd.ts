import type { EntityConfig } from './index';

export const bulkPvtLtdConfig: EntityConfig = {
  entityType: 'bulk_pvt_ltd',
  label: 'Bulk Private Limited',
  itrForm: 'ITR-6',
  taxAuditForm: '3CA',
  nav: {
    // Bulk mode: primary entry is via the Bulk Workspace, not journal
    journal: false,
    cashBook: false,
    pettyCash: false,
    purchaseRegister: 'never',
    salesRegister: 'never',
    purchaseReturns: 'never',
    salesReturns: 'never',
    billsReceivable: false,
    billsPayable: false,

    // Ledgers — useful for viewing after classification
    ledger: false,
    debtors: false,
    creditors: false,
    fixedAssets: false,
    investments: 'never',
    loans: 'never',

    // Financial Statements — generated from bulk ledger_entries
    trialBalance: true,
    tradingAccount: 'conditional',
    profitLoss: true,
    profitLossFormat: 'schedule_iii',
    plAppropriation: false,
    balanceSheet: true,
    balanceSheetFormat: 'schedule_iii',
    cashFlowStatement: 'never',
    fundsFlowStatement: 'never',
    incomeExpenditure: false,
    receiptsPayments: false,

    // Special accounts
    partnersCapital: false,
    revaluation: false,
    realisation: false,
    shareCapital: true,
    debentures: 'never',
    kartaCapital: false,
    fundAccounts: false,
    incompleteRecords: false,
    memberRegister: false,

    // Tax & Compliance
    gst: 'conditional',
    incomeTax: true,
    tdsRegister: 'conditional',
    tcsRegister: 'never',
    advanceTax: true,
    deferredTax: true,
    brs: false,
    depreciation: false,

    // Audit
    audit: 'always',
    auditForm: '3CA',

    // Inventory
    inventory: 'never',

    // Misc
    payroll: 'never',
    segmentReporting: false,
    relatedParty: true,
    accountingPolicies: true,
    asChecklist: true,
    fcra: 'never',
    applicationCheck: false,
    form10b: false,
    llpForms: false,

    // Analysis
    ratioAnalysis: true,
    bsNotes: true,
    taxComputation: true,
    msmeDisclosure: true,
    contingentLiabilities: true,

    // Company-specific
    directorsReport: true,
    caro: true,
    costRecords: 'never',
    formN: false,

    // Vouchers — disabled in bulk mode
    salesInvoice: false,
    purchaseVoucher: false,
    paymentVoucher: false,
    receiptVoucher: false,
    debitNote: false,
    creditNote: false,

    // Bulk workspace flag
    bulkWorkspace: true,
  },
};
