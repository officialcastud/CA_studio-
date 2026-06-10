/**
 * Bulk Workspace — Main page for the Bulk Private Limited entity workflow.
 *
 * Flow:
 * 1. Upload CSV → populates suspense + bank ledger
 * 2. View/filter/select suspense rows in the data grid
 * 3. Right-click → Move to Ledger (manual)
 * 4. Use CARP AI for keyword-based bulk classification
 * 5. When suspense = 0 → trial balance auto-generated
 */

import React, { useState, useCallback, useMemo } from 'react';
import { Upload, RefreshCw, Download, BarChart3 } from 'lucide-react';
import { useCompany } from '@/hooks/useCompany';
import { useNavigate } from 'react-router-dom';
import { BulkDataGrid } from '@/components/bulk/BulkDataGrid';
import { BulkProgressBar } from '@/components/bulk/BulkProgressBar';
import { ImportCSVModal } from '@/components/bulk/ImportCSVModal';
import { LedgerPickerModal } from '@/components/bulk/LedgerPickerModal';
import { CreateLedgerModal } from '@/components/bulk/CreateLedgerModal';
import { getSuspenseTransactions, getLedgerAccounts } from '@/lib/bulk/bulkDb';
import {
  getProgress,
  moveIdsToLedger,
  createLedger,
  flagSuspenseRows,
  listLedgerAccounts,
} from '@/lib/bulk/bulkLedger';
import type { ImportResult, BulkProgress } from '@/lib/bulk/types';
import { getCurrentFY } from '@/lib/utils/dateUtils';

function getFYLabel(): string {
  const fyObj = getCurrentFY();
  // Returns label like "2024-25" or falls back to computed string
  if (fyObj.label) return fyObj.label;
  const start = new Date(fyObj.start);
  const end = new Date(fyObj.end);
  return `${start.getFullYear()}-${String(end.getFullYear()).slice(-2)}`;
}

type Modal =
  | null
  | 'import'
  | 'ledger-picker'
  | 'create-ledger';

export default function BulkWorkspacePage() {
  const { company, companyId } = useCompany();
  const navigate = useNavigate();

  // Current FY label (e.g. "2024-25")
  const fy = getFYLabel();

  // Data state — re-read from localStorage on mutations
  const [refreshKey, setRefreshKey] = useState(0);
  const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  const transactions = useMemo(
    () => (companyId ? getSuspenseTransactions(companyId, fy) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [companyId, fy, refreshKey],
  );

  const ledgerAccounts = useMemo(
    () => (companyId ? getLedgerAccounts(companyId) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [companyId, refreshKey],
  );

  const progress: BulkProgress = useMemo(
    () =>
      companyId
        ? getProgress(companyId, fy)
        : { totalRows: 0, allocated: 0, remaining: 0, completionPct: 0, nextKeywords: [] },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [companyId, fy, refreshKey],
  );

  // Modal state
  const [modal, setModal] = useState<Modal>(null);
  const [pendingIds, setPendingIds] = useState<string[]>([]);

  // Import success handler
  const handleImportSuccess = useCallback(
    (_result: ImportResult) => {
      setModal(null);
      refresh();
    },
    [refresh],
  );

  // Move to ledger (from grid or context menu)
  const handleMoveRequest = useCallback((ids: string[]) => {
    setPendingIds(ids);
    setModal('ledger-picker');
  }, []);

  // Create & move (from grid context menu)
  const handleCreateAndMove = useCallback((ids: string[]) => {
    setPendingIds(ids);
    setModal('create-ledger');
  }, []);

  // Flag rows
  const handleFlagRows = useCallback(
    (ids: string[]) => {
      if (!companyId) return;
      flagSuspenseRows(companyId, ids);
      refresh();
    },
    [companyId, refresh],
  );

  // Confirm move from ledger picker
  const handleMoveConfirm = useCallback(
    (ledgerAccountId: string) => {
      if (!companyId) return;
      moveIdsToLedger(companyId, fy, pendingIds, ledgerAccountId, 'MANUAL');
      setModal(null);
      setPendingIds([]);
      refresh();
    },
    [companyId, fy, pendingIds, refresh],
  );

  // Confirm create new ledger
  const handleCreateLedgerConfirm = useCallback(
    (name: string, group: string, accountType: string) => {
      if (!companyId) return;
      const { ledgerAccount } = createLedger(companyId, name, group, accountType, 'MANUAL');
      if (pendingIds.length > 0) {
        moveIdsToLedger(companyId, fy, pendingIds, ledgerAccount.id, 'MANUAL');
        setPendingIds([]);
      }
      setModal(null);
      refresh();
    },
    [companyId, fy, pendingIds, refresh],
  );

  if (!company || !companyId) return null;

  const isEmpty = transactions.length === 0;

  return (
    <div className="flex flex-col h-full min-h-0 bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-900">Bulk Workspace</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {company.name} · FY {fy} · Bank statement importer
            </p>
          </div>
          <div className="flex items-center gap-2">
            {progress.completionPct === 100 && (
              <button
                onClick={() => navigate(`/company/${companyId}/trial-balance`)}
                className="flex items-center gap-2 px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                <BarChart3 className="h-4 w-4" />
                View Trial Balance
              </button>
            )}
            <button
              onClick={refresh}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
              title="Refresh"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
            <button
              onClick={() => setModal('import')}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Upload className="h-4 w-4" />
              Import Bank Statement
            </button>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      {!isEmpty && (
        <div className="px-6 py-3 shrink-0">
          <BulkProgressBar progress={progress} />
        </div>
      )}

      {/* Main content */}
      {isEmpty ? (
        /* Empty state */
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Upload className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Start with a Bank Statement
            </h2>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              Upload your client&apos;s bank statement CSV. The system will automatically
              parse every row into suspense. Then classify them into ledger accounts —
              manually or using the CARP AI assistant.
            </p>
            <button
              onClick={() => setModal('import')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Upload className="h-4 w-4" />
              Import Bank Statement CSV
            </button>
            <div className="mt-4 text-xs text-gray-400 space-y-1">
              <p>Supports all major Indian banks (HDFC, SBI, ICICI, Axis, Kotak, etc.)</p>
              <p>Auto-detects date, narration, debit, credit columns</p>
              <p>Works with 10,000+ row statements</p>
            </div>
          </div>
        </div>
      ) : (
        /* Data grid */
        <div className="flex-1 min-h-0 mx-6 mb-4 bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col">
          {/* Grid toolbar hint */}
          <div className="px-4 py-2 bg-blue-50 border-b border-blue-100 shrink-0 flex items-center justify-between">
            <p className="text-xs text-blue-700">
              <span className="font-semibold">Tip:</span> Select rows (Shift+click for range) → right-click → Move to Ledger. Or ask CARP to classify by keyword.
            </p>
            <button
              onClick={() => setModal('create-ledger')}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium"
            >
              + New Ledger
            </button>
          </div>

          <BulkDataGrid
            transactions={transactions}
            onMoveToLedger={handleMoveRequest}
            onCreateAndMove={handleCreateAndMove}
            onFlagRows={handleFlagRows}
          />
        </div>
      )}

      {/* Ledger count footer (when data present) */}
      {!isEmpty && (
        <div className="px-6 pb-3 shrink-0 flex items-center justify-between text-xs text-gray-500">
          <span>{ledgerAccounts.length} ledger account{ledgerAccounts.length !== 1 ? 's' : ''} created</span>
          <button
            onClick={() => setModal('create-ledger')}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            + Create ledger
          </button>
        </div>
      )}

      {/* Modals */}
      {modal === 'import' && (
        <ImportCSVModal
          companyId={companyId}
          fy={fy}
          onSuccess={handleImportSuccess}
          onClose={() => setModal(null)}
        />
      )}

      {modal === 'ledger-picker' && (
        <LedgerPickerModal
          ledgers={ledgerAccounts}
          selectedIds={pendingIds}
          rowCount={pendingIds.length}
          onConfirm={handleMoveConfirm}
          onCreateNew={() => setModal('create-ledger')}
          onClose={() => { setModal(null); setPendingIds([]); }}
        />
      )}

      {modal === 'create-ledger' && (
        <CreateLedgerModal
          onConfirm={handleCreateLedgerConfirm}
          onClose={() => { setModal(null); setPendingIds([]); }}
        />
      )}
    </div>
  );
}
