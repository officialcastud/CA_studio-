'use client';

import { useState, useRef, useEffect } from 'react';
import { FileText, FileSpreadsheet, FileDown, Loader2, Download } from 'lucide-react';
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
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('mousedown', onPointerDown);
    window.addEventListener('keydown', onEscape);
    return () => {
      window.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('keydown', onEscape);
    };
  }, [isOpen]);

  const handle = async (type: string, fn: () => Promise<void> | void) => {
    setLoading(type);
    setIsOpen(false);
    try { await fn(); } finally { setLoading(null); }
  };

  const btnClass = "w-full h-8 px-2 text-left text-xs text-gray-700 hover:bg-gray-50 rounded flex items-center gap-2 disabled:opacity-40";

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(v => !v)}
        className="inline-flex items-center justify-center h-7 w-7 border border-gray-200 rounded-lg text-gray-500 hover:text-gray-700 hover:border-gray-300 bg-white transition-colors"
        title="Download / Export"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-1 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-1">
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
      )}
    </div>
  );
}
