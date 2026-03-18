'use client';

import { getCurrentFY } from '@/lib/utils/dateUtils';

interface DateRangeFilterProps {
  fromDate: string;
  toDate: string;
  onDateChange: (from: string, to: string) => void;
  allRange?: { from: string; to: string } | null;
}

export function DateRangeFilter({ fromDate, toDate, onDateChange, allRange }: DateRangeFilterProps) {
  const today = new Date().toISOString().split('T')[0];

  const presets = [
    {
      label: 'This Month',
      getRange: () => {
        const now = new Date();
        return {
          from: new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0],
          to: today,
        };
      },
    },
    {
      label: 'This Quarter',
      getRange: () => {
        const now = new Date();
        const qMonth = Math.floor(now.getMonth() / 3) * 3;
        return {
          from: new Date(now.getFullYear(), qMonth, 1).toISOString().split('T')[0],
          to: today,
        };
      },
    },
    {
      label: 'This FY',
      getRange: () => {
        const fy = getCurrentFY();
        return { from: fy.start, to: fy.end };
      },
    },
    {
      label: 'Last FY',
      getRange: () => {
        const now = new Date();
        const y = now.getMonth() < 3 ? now.getFullYear() - 2 : now.getFullYear() - 1;
        return { from: `${y}-04-01`, to: `${y + 1}-03-31` };
      },
    },
    ...(allRange ? [{ label: 'All', getRange: () => allRange }] : []),
  ];

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-gray-400">From</span>
        <input
          type="date"
          value={fromDate}
          onChange={e => onDateChange(e.target.value, toDate)}
          className="h-7 px-2 text-xs border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-gray-400">To</span>
        <input
          type="date"
          value={toDate}
          onChange={e => onDateChange(fromDate, e.target.value)}
          className="h-7 px-2 text-xs border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div className="flex items-center gap-1">
        {presets.map(preset => (
          <button
            key={preset.label}
            onClick={() => { const { from, to } = preset.getRange(); onDateChange(from, to); }}
            className="h-7 px-2 text-xs text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  );
}
