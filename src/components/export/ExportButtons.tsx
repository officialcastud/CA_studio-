'use client';

import { useState } from 'react';
import { FileText, FileSpreadsheet, FileDown, Loader2 } from 'lucide-react';
import { exportToPDF, exportToExcel, exportToCSV, type ExportColumn } from './exportUtils';

interface ExportButtonsProps {
  title: string;
  companyName: string;
  entityType: string;
  dateRange: string;
  columns: ExportColumn[];
  data: Record<string, any>[];
  pdfOrientation?: 'portrait' | 'landscape';
  includeSignatureBlock?: boolean;
}

export function ExportButtons({
  title, companyName, entityType, dateRange,
  columns, data, pdfOrientation, includeSignatureBlock,
}: ExportButtonsProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const handle = async (type: string, fn: () => Promise<void> | void) => {
    setLoading(type);
    try { await fn(); } finally { setLoading(null); }
  };

  const btnClass = "inline-flex items-center gap-1.5 h-7 px-2.5 text-xs font-medium border border-gray-200 rounded-md bg-white text-gray-600 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 disabled:opacity-50 transition-colors";

  return (
    <div className="flex items-center gap-1">
      <button
        className={btnClass}
        disabled={!!loading}
        onClick={() => handle('pdf', () => exportToPDF(title, companyName, entityType, dateRange, columns, data, { orientation: pdfOrientation, includeSignatureBlock }))}
      >
        {loading === 'pdf' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <FileText className="h-3.5 w-3.5" />}
        PDF
      </button>
      <button
        className={btnClass}
        disabled={!!loading}
        onClick={() => handle('excel', () => exportToExcel(title, columns, data))}
      >
        {loading === 'excel' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <FileSpreadsheet className="h-3.5 w-3.5" />}
        Excel
      </button>
      <button
        className={btnClass}
        disabled={!!loading}
        onClick={() => handle('csv', () => exportToCSV(columns, data, title.replace(/\s+/g, '_')))}
      >
        {loading === 'csv' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <FileDown className="h-3.5 w-3.5" />}
        CSV
      </button>
    </div>
  );
}
