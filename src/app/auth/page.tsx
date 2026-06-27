import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Building2, Briefcase, BookOpen, Users, ShieldCheck, Check, ArrowRight } from 'lucide-react';

// Access mode is chosen here and persisted; the sidebar reads it (no selector there).
const ACCESS_MODE_KEY = 'ca_access_mode';
type AccessMode = 'professional' | 'business';

const PROFESSIONAL_FEATURES = [
  'Journal, Cash Book & Ledger Accounts',
  'Trial Balance & Schedule III financials',
  'Profit & Loss, Balance Sheet & Notes',
  'Cash Flow & Funds Flow statements',
  'GST — GSTR-1, GSTR-3B, ITC, E-way Bill',
  'Income Tax, TDS & TCS registers',
  'Advance Tax & Deferred Tax',
  'Depreciation & Fixed Assets',
  'Audit, CARO & Directors’ Report',
  'Bank Reconciliation & Bank Import',
  'Tally import (XML / JSON / PDF)',
  'Ratio Analysis & special accounts',
];

const BUSINESS_FEATURES = [
  'Sales & Purchase Registers',
  'Sales & Purchase Returns',
  'Bills Receivable & Bills Payable',
  'GST filing & summaries',
  'Bank Accounts',
  'Bank Statement Importer',
  'Cash Flow Statement',
];

export default function AuthPage() {
  const navigate = useNavigate();

  const selectProfile = (mode: AccessMode) => {
    try { localStorage.setItem(ACCESS_MODE_KEY, mode); } catch { /* ignore */ }
    toast.success(`Continuing as ${mode === 'professional' ? 'Professional' : 'Business'}`);
    navigate('/companies');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 lg:p-8">
      <div className="w-full max-w-5xl space-y-6">

        {/* ── Part 1: deep-teal hero banner ── */}
        <div className="hero p-8 sm:p-10">
          <div className="pointer-events-none absolute -right-16 top-10 h-56 w-56 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute right-10 top-8 text-white/10 text-5xl leading-none select-none">★</div>

          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <span className="icon-badge icon-badge-sm"><BookOpen className="h-4 w-4" /></span>
                <span className="text-lg font-extrabold tracking-tight">CA Studio</span>
              </div>
              <p className="hero-muted text-sm font-semibold mb-2">Online Accounting Suite</p>
              <h1 className="text-3xl sm:text-4xl font-extrabold leading-[1.1] tracking-tight">
                <span className="hero-accent">Creating</span> a Better<br />Future through Books
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {['#5B9BFF', '#16A34A', '#D97706'].map((c) => (
                  <span key={c} className="h-9 w-9 rounded-full border-2 border-[var(--hero)] flex items-center justify-center text-white" style={{ background: c }}>
                    <Users className="h-4 w-4" />
                  </span>
                ))}
              </div>
              <span className="hero-muted text-sm font-medium">12k + Happy<br />Professionals</span>
            </div>
          </div>
        </div>

        {/* ── Part 2: choose profile ── */}
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-gray-900">Choose your workspace</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Select the profile that fits you — it tailors the menu to what you need.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <ProfileCard
              icon={<Building2 className="h-5 w-5" />}
              title="Professional"
              subtitle="For Chartered Accountants & accountants"
              features={PROFESSIONAL_FEATURES}
              onSelect={() => selectProfile('professional')}
            />
            <ProfileCard
              icon={<Briefcase className="h-5 w-5" />}
              title="Businessman"
              subtitle="For business owners & traders"
              features={BUSINESS_FEATURES}
              onSelect={() => selectProfile('business')}
            />
          </div>

          <p className="text-center text-xs text-gray-400 mt-5">
            Running in offline mode — your data is stored locally
          </p>
        </div>

      </div>
    </div>
  );
}

function ProfileCard({
  icon, title, subtitle, features, onSelect,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  features: string[];
  onSelect: () => void;
}) {
  return (
    <div className="stat-card !p-0 flex flex-col h-[460px] overflow-hidden">
      {/* Title — Professional / Businessman */}
      <div className="flex items-center gap-3 p-5 border-b border-gray-100">
        <span className="icon-badge"><span className="text-white">{icon}</span></span>
        <div className="min-w-0">
          <h3 className="text-lg font-extrabold tracking-tight text-gray-900 leading-tight">{title}</h3>
          <p className="text-xs text-gray-500 truncate">{subtitle}</p>
        </div>
      </div>

      {/* Key points — scrolls inside the card when there are many */}
      <div className="flex-1 min-h-0 overflow-y-auto p-5">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2.5">What you get</p>
        <ul className="space-y-2.5">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-sm text-gray-700">
              <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <Check className="h-3 w-3" />
              </span>
              <span className="leading-snug">{f}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Select */}
      <div className="p-4 border-t border-gray-100">
        <button onClick={onSelect} className="btn-pill-primary w-full">
          Select
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
