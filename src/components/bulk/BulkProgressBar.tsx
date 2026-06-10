import type { BulkProgress } from '@/lib/bulk/types';

interface Props {
  progress: BulkProgress;
}

export function BulkProgressBar({ progress }: Props) {
  const { totalRows, allocated, remaining, completionPct } = progress;

  const barColor =
    completionPct === 100
      ? 'bg-green-500'
      : completionPct >= 75
        ? 'bg-blue-500'
        : completionPct >= 50
          ? 'bg-yellow-500'
          : 'bg-orange-500';

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-gray-700">
          Suspense Clearance Progress
        </span>
        <span
          className={`text-sm font-bold ${completionPct === 100 ? 'text-green-600' : 'text-gray-600'}`}
        >
          {completionPct}%
        </span>
      </div>

      <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden mb-3">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${completionPct}%` }}
        />
      </div>

      <div className="flex gap-6 text-xs text-gray-500">
        <span>
          <span className="font-semibold text-gray-700">{totalRows.toLocaleString()}</span> total
        </span>
        <span>
          <span className="font-semibold text-green-600">{allocated.toLocaleString()}</span> classified
        </span>
        <span>
          <span className="font-semibold text-orange-500">{remaining.toLocaleString()}</span> remaining
        </span>
      </div>

      {completionPct === 100 && (
        <div className="mt-3 text-xs text-green-700 bg-green-50 border border-green-200 rounded px-3 py-1.5 font-medium">
          All rows cleared — Trial Balance is ready to generate.
        </div>
      )}
    </div>
  );
}
