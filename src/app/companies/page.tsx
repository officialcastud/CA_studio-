import { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { listCompanies, deleteCompany } from '@/lib/offlineDb';
import { ENTITY_TYPES, type EntityType } from '@/lib/constants/entityTypes';
import { Plus, Search, Trash2, ArrowRight, Building2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Company } from '@/types/company';

const ENTITY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  sole_proprietorship: { bg: 'bg-blue-50',   text: 'text-blue-700',   border: 'border-blue-100' },
  partnership:        { bg: 'bg-violet-50',  text: 'text-violet-700', border: 'border-violet-100' },
  llp:                { bg: 'bg-indigo-50',  text: 'text-indigo-700', border: 'border-indigo-100' },
  opc:                { bg: 'bg-sky-50',     text: 'text-sky-700',    border: 'border-sky-100' },
  pvt_ltd:            { bg: 'bg-emerald-50', text: 'text-emerald-700',border: 'border-emerald-100' },
  public_ltd:         { bg: 'bg-teal-50',    text: 'text-teal-700',   border: 'border-teal-100' },
  huf:                { bg: 'bg-amber-50',   text: 'text-amber-700',  border: 'border-amber-100' },
  trust:              { bg: 'bg-orange-50',  text: 'text-orange-700', border: 'border-orange-100' },
  society:            { bg: 'bg-rose-50',    text: 'text-rose-700',   border: 'border-rose-100' },
  section8:           { bg: 'bg-pink-50',    text: 'text-pink-700',   border: 'border-pink-100' },
  aop_boi:            { bg: 'bg-lime-50',    text: 'text-lime-700',   border: 'border-lime-100' },
  cooperative:        { bg: 'bg-cyan-50',    text: 'text-cyan-700',   border: 'border-cyan-100' },
};

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');

  const load = () => {
    setCompanies(listCompanies());
    setLoading(false);
  };
  useEffect(load, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return companies.filter(c =>
      c.name.toLowerCase().includes(q) ||
      (ENTITY_TYPES[c.entity_type as EntityType]?.label ?? '').toLowerCase().includes(q) ||
      (c.entity_details?.pan ?? '').toLowerCase().includes(q)
    );
  }, [companies, search]);

  const handleDelete = (e: React.MouseEvent, company: Company) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm(`Delete "${company.name}"?\n\nAll journal entries for this company will be permanently deleted.`)) return;
    deleteCompany(company.id);
    load();
    toast.success(`${company.name} deleted`);
  };

  const fmtDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch { return ''; }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Header ── */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">CA Accounting</h1>
            <p className="text-xs text-gray-400 mt-0.5">Professional accounting software for India</p>
          </div>
          <Link
            to="/companies/create"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            New Company
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>

        ) : companies.length === 0 ? (
          /* ── Empty state ── */
          <div className="flex flex-col items-center justify-center py-28 text-center">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-5">
              <Building2 className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">No companies yet</h2>
            <p className="text-sm text-gray-500 mb-6 max-w-xs">
              Create your first company to start managing journal entries and financial statements.
            </p>
            <Link
              to="/companies/create"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Create First Company
            </Link>
          </div>

        ) : (
          <>
            {/* ── Toolbar ── */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  {filtered.length} {filtered.length === 1 ? 'Company' : 'Companies'}
                </p>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, entity type, PAN…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-9 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-lg w-72 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* ── Grid ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(company => {
                const meta   = ENTITY_TYPES[company.entity_type as EntityType];
                const colors = ENTITY_COLORS[company.entity_type] ?? { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200' };
                return (
                  <Link
                    key={company.id}
                    to={`/company/${company.id}`}
                    className="group bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-blue-200 transition-all duration-150 block"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate group-hover:text-blue-700 transition-colors text-sm">
                          {company.name}
                        </h3>
                        <span className={`inline-flex items-center mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${colors.bg} ${colors.text} ${colors.border}`}>
                          {meta?.shortLabel ?? company.entity_type}
                        </span>
                      </div>
                      <button
                        onClick={e => handleDelete(e, company)}
                        className="ml-2 p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                        title="Delete company"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="space-y-1 text-xs text-gray-500">
                      {company.entity_details?.pan && (
                        <div className="flex items-center gap-1.5">
                          <span className="text-gray-400 w-12 shrink-0">PAN</span>
                          <span className="font-mono font-medium text-gray-700">{company.entity_details.pan}</span>
                        </div>
                      )}
                      {company.gst_status !== 'unregistered' && company.gst_details?.gstin && (
                        <div className="flex items-center gap-1.5">
                          <span className="text-gray-400 w-12 shrink-0">GSTIN</span>
                          <span className="font-mono font-medium text-gray-700 truncate">{company.gst_details.gstin}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5">
                        <span className="text-gray-400 w-12 shrink-0">Method</span>
                        <span>{company.accounting_method === 'mercantile' ? 'Accrual (Mercantile)' : 'Cash Basis'}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                      <span className="text-[11px] text-gray-400">
                        {fmtDate(company.created_at)}
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 text-gray-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
