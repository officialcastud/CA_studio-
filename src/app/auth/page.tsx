import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Building2, BookOpen, Users, ArrowRight, ShieldCheck } from 'lucide-react';

export default function AuthPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'login' | 'signup'>('login');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Continuing in offline mode');
    navigate('/companies');
  };

  const inp = "w-full h-11 px-4 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-300";

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 lg:p-8">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">

        {/* ── Left: deep-teal hero ── */}
        <div className="hero hidden lg:flex flex-col justify-between p-10 min-h-[560px]">
          {/* decorative star + dashed ring, echoing the reference */}
          <div className="pointer-events-none absolute -right-16 top-20 h-56 w-56 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute right-10 top-10 text-white/10 text-5xl leading-none select-none">★</div>

          {/* brand */}
          <div className="relative flex items-center gap-2.5">
            <span className="icon-badge icon-badge-sm"><BookOpen className="h-4 w-4" /></span>
            <span className="text-lg font-extrabold tracking-tight">CA Studio</span>
          </div>

          {/* headline */}
          <div className="relative">
            <p className="hero-muted text-sm font-semibold mb-3">Online Accounting Suite</p>
            <h1 className="text-4xl xl:text-5xl font-extrabold leading-[1.1] tracking-tight">
              <span className="hero-accent">Creating</span> a Better<br />Future through Books
            </h1>
            <p className="hero-muted mt-4 max-w-sm text-sm leading-relaxed">
              Ledgers, GST, financial statements and Tally import — everything a practice needs, in one fast workspace.
            </p>

            {/* social proof */}
            <div className="mt-7 flex items-center gap-3">
              <div className="flex -space-x-2">
                {['#5B9BFF', '#16A34A', '#D97706'].map((c) => (
                  <span key={c} className="h-9 w-9 rounded-full border-2 border-[var(--hero)] flex items-center justify-center text-white text-xs font-bold" style={{ background: c }}>
                    <Users className="h-4 w-4" />
                  </span>
                ))}
              </div>
              <span className="hero-muted text-sm font-medium">12k + Happy Professionals</span>
            </div>
          </div>

          {/* floating stat cards */}
          <div className="relative grid grid-cols-2 gap-4">
            <div className="stat-card text-gray-900">
              <span className="icon-badge mb-2"><Building2 className="h-5 w-5" /></span>
              <p className="text-2xl font-extrabold">28k</p>
              <p className="text-xs text-gray-500 font-medium">Companies Managed</p>
            </div>
            <div className="stat-card text-gray-900">
              <span className="icon-badge mb-2"><ShieldCheck className="h-5 w-5" /></span>
              <p className="text-2xl font-extrabold">529+</p>
              <p className="text-xs text-gray-500 font-medium">Compliance Tools</p>
            </div>
          </div>
        </div>

        {/* ── Right: auth form ── */}
        <div className="flex items-center justify-center">
          <div className="w-full max-w-sm">
            {/* Logo (mobile-friendly) */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-2xl mb-4 shadow-[0_10px_24px_-10px_color-mix(in_srgb,var(--primary)_70%,transparent)]">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">Welcome back</h1>
              <p className="text-sm text-gray-400 mt-1">Professional accounting software for India</p>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-[0_18px_40px_-18px_rgba(8,40,48,0.20)]">
              {/* Tabs */}
              <div className="flex border-b border-gray-100">
                {(['login','signup'] as const).map(t => (
                  <button key={t} onClick={() => setTab(t)}
                    className={`flex-1 py-3.5 text-sm font-bold transition-colors ${tab === t ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-gray-500 hover:text-gray-700'}`}>
                    {t === 'login' ? 'Sign In' : 'Create Account'}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {tab === 'signup' && (
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Full Name</label>
                    <input className={inp} placeholder="Your name" />
                  </div>
                )}
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Email</label>
                  <input className={inp} type="email" placeholder="you@example.com" />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Password</label>
                  <input className={inp} type="password" placeholder="••••••••" />
                </div>
                {tab === 'signup' && (
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Confirm Password</label>
                    <input className={inp} type="password" placeholder="••••••••" />
                  </div>
                )}
                <button type="submit" className="btn-pill-primary w-full h-11 mt-2">
                  {tab === 'login' ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            </div>

            <p className="text-center text-xs text-gray-400 mt-5">
              Running in offline mode — your data is stored locally
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
