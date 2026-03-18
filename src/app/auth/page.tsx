import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Building2 } from 'lucide-react';

export default function AuthPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'login' | 'signup'>('login');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Continuing in offline mode');
    navigate('/companies');
  };

  const inp = "w-full h-10 px-3 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-300";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-xl mb-4">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">CA Accounting</h1>
          <p className="text-sm text-gray-400 mt-1">Professional accounting software for India</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            {(['login','signup'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`flex-1 py-3 text-sm font-semibold transition-colors ${tab === t ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-gray-500 hover:text-gray-700'}`}>
                {t === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {tab === 'signup' && (
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Full Name</label>
                <input className={inp} placeholder="Your name" />
              </div>
            )}
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Email</label>
              <input className={inp} type="email" placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Password</label>
              <input className={inp} type="password" placeholder="••••••••" />
            </div>
            {tab === 'signup' && (
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Confirm Password</label>
                <input className={inp} type="password" placeholder="••••••••" />
              </div>
            )}
            <button type="submit"
              className="w-full h-10 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors mt-2">
              {tab === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-5">
          Running in offline mode — your data is stored locally
        </p>
      </div>
    </div>
  );
}
