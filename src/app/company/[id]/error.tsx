'use client';

export default function CompanyError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="bg-white border border-red-200 rounded-xl p-8 text-center m-6">
      <div className="text-red-400 mb-3">
        <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      </div>
      <h2 className="text-lg font-medium text-gray-700 mb-1">Something went wrong</h2>
      <p className="text-sm text-gray-500 mb-4">{error.message || 'An error occurred while loading this page.'}</p>
      <button onClick={() => reset()} className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">
        Try Again
      </button>
    </div>
  );
}
