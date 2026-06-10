import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createCompany as createCompanyLocal, createInitialBookPeriod } from '@/lib/offlineDb';
import { initEntityData } from '@/entities/initEntity';
import { WizardSteps } from '@/components/company/WizardSteps';
import { ENTITY_TYPES, type EntityType } from '@/lib/constants/entityTypes';
import { INDIAN_STATES } from '@/lib/constants/indianStates';
import { toast } from 'sonner';
import { ArrowLeft, ArrowRight, Check, Plus, Trash2 } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

const STEPS = ['Entity', 'Details', 'Business', 'Tax', 'Inventory', 'Review'];

const BUSINESS_NATURES = [
  'Trading','Manufacturing','Service','Professional',
  'Commission Agent','Contractor','Transport','Real Estate',
  'Agriculture','Education','Healthcare','IT/Software',
];

type WizardData = {
  entity_type: string;
  name: string; pan: string; address: string; city: string;
  state: string; pincode: string; phone: string; email: string;
  partners: { name: string; capitalAmount: number; profitSharingRatio: number; salary: number }[];
  capitalMethod: 'fixed' | 'fluctuating';
  cin: string; authorizedCapital: number; paidUpCapital: number; faceValuePerShare: number;
  kartaName: string; registrationNumber: string;
  business_nature: string[]; accounting_method: 'mercantile' | 'cash';
  financial_year_start: string;
  gst_status: 'unregistered' | 'regular' | 'composition'; gstin: string;
  tds_applicable: boolean; tcs_applicable: boolean;
  inventory_enabled: boolean; valuation_method: 'fifo' | 'weighted_average';
};

const defaultData: WizardData = {
  entity_type: '', name: '', pan: '', address: '', city: '', state: '', pincode: '', phone: '', email: '',
  partners: [{ name: '', capitalAmount: 0, profitSharingRatio: 50, salary: 0 }, { name: '', capitalAmount: 0, profitSharingRatio: 50, salary: 0 }],
  capitalMethod: 'fluctuating', cin: '', authorizedCapital: 0, paidUpCapital: 0, faceValuePerShare: 10,
  kartaName: '', registrationNumber: '', business_nature: [], accounting_method: 'mercantile',
  financial_year_start: 'april', gst_status: 'unregistered', gstin: '',
  tds_applicable: false, tcs_applicable: false, inventory_enabled: false, valuation_method: 'weighted_average',
};

// ─── Shared field components ──────────────────────────────────────────────────
const Field = ({ label, children, span2 }: { label: string; children: React.ReactNode; span2?: boolean }) => (
  <div className={span2 ? 'sm:col-span-2' : ''}>
    <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">{label}</label>
    {children}
  </div>
);

const inp = "w-full h-9 px-3 text-sm border border-gray-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-300";

export default function CreateCompanyPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<WizardData>(defaultData);
  const [saving, setSaving] = useState(false);

  const upd = (f: Partial<WizardData>) => setData(p => ({ ...p, ...f }));
  const isPartnership = data.entity_type === 'partnership' || data.entity_type === 'llp';
  const isCompany = ['opc','pvt_ltd','public_ltd','section8'].includes(data.entity_type);
  const isHUF = data.entity_type === 'huf';
  const isTrust = ['trust','society'].includes(data.entity_type);

  const canNext = () => {
    if (step === 0) return !!data.entity_type;
    if (step === 1) return !!data.name.trim();
    if (step === 2) return data.business_nature.length > 0;
    return true;
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const entityDetails: Record<string, unknown> = {
        pan: data.pan, address: data.address, city: data.city,
        state: data.state, pincode: data.pincode, phone: data.phone, email: data.email,
      };
      if (isPartnership) { entityDetails.partners = data.partners.filter(p => p.name); entityDetails.capitalMethod = data.capitalMethod; }
      if (isCompany) { entityDetails.cin = data.cin; entityDetails.shareCapital = { authorizedCapital: data.authorizedCapital, paidUpCapital: data.paidUpCapital, faceValuePerShare: data.faceValuePerShare, totalShares: data.paidUpCapital / (data.faceValuePerShare || 10), issuedCapital: data.paidUpCapital, subscribedCapital: data.paidUpCapital }; }
      if (isHUF) entityDetails.kartaName = data.kartaName;
      if (isTrust) entityDetails.registrationNumber = data.registrationNumber;
      const gstDetails: Record<string, unknown> = {};
      if (data.gst_status !== 'unregistered') { gstDetails.gstin = data.gstin; gstDetails.gstScheme = data.gst_status; }

      const company = createCompanyLocal({
        name: data.name, entity_type: data.entity_type as EntityType,
        entity_details: entityDetails as any, business_nature: data.business_nature,
        inventory_enabled: data.inventory_enabled,
        inventory_config: { valuationMethod: data.valuation_method, pettyCashThreshold: 5000 },
        gst_status: data.gst_status, gst_details: gstDetails as any,
        tds_applicable: data.tds_applicable, tcs_applicable: data.tcs_applicable,
        accounting_method: data.accounting_method, financial_year_start: data.financial_year_start,
      });
      createInitialBookPeriod(company.id);
      initEntityData(company);
      toast.success('Company created successfully!');
      navigate(`/company/${company.id}`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to create company');
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-3">
          <Link to="/companies" className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-base font-bold text-gray-900">Create New Company</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        <WizardSteps steps={STEPS} currentStep={step} />

        <div className="bg-white border border-gray-200 rounded-xl p-6 mt-6">

          {/* ── Step 0: Entity Type ── */}
          {step === 0 && (
            <div>
              <h2 className="text-base font-bold text-gray-900 mb-1">Select Entity Type</h2>
              <p className="text-xs text-gray-400 mb-5">Choose the legal structure of the business.</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {Object.entries(ENTITY_TYPES).map(([key, config]) => {
                  const Icon = (LucideIcons as any)[config.icon] || LucideIcons.Building2;
                  const active = data.entity_type === key;
                  return (
                    <button key={key} onClick={() => upd({ entity_type: key })}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${active ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300 bg-white'}`}>
                      <Icon className={`h-5 w-5 mb-2 ${active ? 'text-blue-600' : 'text-gray-400'}`} />
                      <p className="font-semibold text-sm text-gray-900">{config.shortLabel}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{config.itrForm}</p>
                      {active && <p className="text-[11px] text-blue-600 mt-1 font-medium">{config.label}</p>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Step 1: Details ── */}
          {step === 1 && (
            <div>
              <h2 className="text-base font-bold text-gray-900 mb-1">Company Details</h2>
              <p className="text-xs text-gray-400 mb-5">Basic information about the business.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Business Name *" span2><input className={inp} value={data.name} onChange={e => upd({ name: e.target.value })} placeholder="e.g. Sharma Traders" /></Field>
                <Field label="PAN"><input className={`${inp} font-mono uppercase`} value={data.pan} onChange={e => upd({ pan: e.target.value.toUpperCase() })} placeholder="ABCDE1234F" maxLength={10} /></Field>
                <Field label="Email"><input className={inp} type="email" value={data.email} onChange={e => upd({ email: e.target.value })} placeholder="contact@business.com" /></Field>
                <Field label="Phone"><input className={inp} value={data.phone} onChange={e => upd({ phone: e.target.value })} placeholder="9876543210" /></Field>
                <Field label="State">
                  <select className={inp} value={data.state} onChange={e => upd({ state: e.target.value })}>
                    <option value="">Select State</option>
                    {INDIAN_STATES.map((s: any) => <option key={s.code ?? s} value={s.name ?? s}>{s.name ?? s}</option>)}
                  </select>
                </Field>
                <Field label="City"><input className={inp} value={data.city} onChange={e => upd({ city: e.target.value })} /></Field>
                <Field label="Pincode"><input className={`${inp} font-mono`} value={data.pincode} onChange={e => upd({ pincode: e.target.value })} maxLength={6} /></Field>
                <Field label="Address" span2><input className={inp} value={data.address} onChange={e => upd({ address: e.target.value })} /></Field>

                {/* Financial Year Start */}
                <Field label="Financial Year Start" span2>
                  <div className="flex gap-3">
                    {[['april','Apr – Mar (Standard)'],['january','Jan – Dec'],['july','Jul – Jun']].map(([v,l]) => (
                      <label key={v} className={`flex-1 flex items-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${data.financial_year_start === v ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                        <input type="radio" className="sr-only" checked={data.financial_year_start === v} onChange={() => upd({ financial_year_start: v })} />
                        <div className={`w-3 h-3 rounded-full border-2 flex items-center justify-center ${data.financial_year_start === v ? 'border-blue-500' : 'border-gray-300'}`}>
                          {data.financial_year_start === v && <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
                        </div>
                        <span className="text-xs font-medium text-gray-700">{l}</span>
                      </label>
                    ))}
                  </div>
                </Field>
              </div>

              {/* Partnership partners */}
              {isPartnership && (
                <div className="border border-gray-200 rounded-xl p-4 mt-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-800">Partners</h3>
                    <button onClick={() => upd({ partners: [...data.partners, { name:'', capitalAmount:0, profitSharingRatio:0, salary:0 }] })}
                      className="inline-flex items-center gap-1 h-7 px-2.5 text-xs font-medium border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <Plus className="h-3 w-3" /> Add Partner
                    </button>
                  </div>
                  <div className="grid grid-cols-4 gap-2 mb-1.5">
                    {['Name','Capital (₹)','PSR (%)','Salary PA'].map(h => (
                      <span key={h} className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-1">{h}</span>
                    ))}
                  </div>
                  {data.partners.map((p, i) => (
                    <div key={i} className="grid grid-cols-4 gap-2 mb-2 items-center">
                      <input className={inp} value={p.name} onChange={e => { const ps=[...data.partners]; ps[i]={...ps[i],name:e.target.value}; upd({partners:ps}); }} placeholder={`Partner ${i+1}`} />
                      <input className={`${inp} font-mono`} type="number" value={p.capitalAmount||''} onChange={e => { const ps=[...data.partners]; ps[i]={...ps[i],capitalAmount:+e.target.value}; upd({partners:ps}); }} />
                      <input className={`${inp} font-mono`} type="number" value={p.profitSharingRatio||''} onChange={e => { const ps=[...data.partners]; ps[i]={...ps[i],profitSharingRatio:+e.target.value}; upd({partners:ps}); }} />
                      <div className="flex gap-1">
                        <input className={`${inp} font-mono flex-1`} type="number" value={p.salary||''} onChange={e => { const ps=[...data.partners]; ps[i]={...ps[i],salary:+e.target.value}; upd({partners:ps}); }} />
                        {data.partners.length > 2 && <button onClick={() => upd({ partners: data.partners.filter((_,j) => j!==i) })} className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors"><Trash2 className="h-3.5 w-3.5" /></button>}
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
                    <span className="text-xs font-semibold text-gray-500">Capital Method:</span>
                    {(['fixed','fluctuating'] as const).map(m => (
                      <label key={m} className="flex items-center gap-1.5 cursor-pointer">
                        <input type="radio" className="accent-blue-600" checked={data.capitalMethod===m} onChange={() => upd({ capitalMethod:m })} />
                        <span className="text-xs capitalize text-gray-700">{m}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Company fields */}
              {isCompany && (
                <div className="border border-gray-200 rounded-xl p-4 mt-5">
                  <h3 className="text-sm font-semibold text-gray-800 mb-3">Company Details</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="CIN"><input className={`${inp} font-mono uppercase`} value={data.cin} onChange={e => upd({ cin:e.target.value.toUpperCase() })} placeholder="U12345KA2024PTC123456" /></Field>
                    <Field label="Face Value / Share (₹)"><input className={`${inp} font-mono`} type="number" value={data.faceValuePerShare||''} onChange={e => upd({ faceValuePerShare:+e.target.value })} /></Field>
                    <Field label="Authorised Capital (₹)"><input className={`${inp} font-mono`} type="number" value={data.authorizedCapital||''} onChange={e => upd({ authorizedCapital:+e.target.value })} /></Field>
                    <Field label="Paid-up Capital (₹)"><input className={`${inp} font-mono`} type="number" value={data.paidUpCapital||''} onChange={e => upd({ paidUpCapital:+e.target.value })} /></Field>
                  </div>
                </div>
              )}

              {/* HUF */}
              {isHUF && (
                <div className="mt-5">
                  <Field label="Karta Name"><input className={inp} value={data.kartaName} onChange={e => upd({ kartaName:e.target.value })} /></Field>
                </div>
              )}

              {/* Trust/Society */}
              {isTrust && (
                <div className="mt-5">
                  <Field label="Registration Number"><input className={inp} value={data.registrationNumber} onChange={e => upd({ registrationNumber:e.target.value })} /></Field>
                </div>
              )}
            </div>
          )}

          {/* ── Step 2: Business Nature ── */}
          {step === 2 && (
            <div>
              <h2 className="text-base font-bold text-gray-900 mb-1">Business Nature & Accounting</h2>
              <p className="text-xs text-gray-400 mb-5">Select all that apply. At least one required.</p>
              <div className="mb-5">
                <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Nature of Business</p>
                <div className="flex flex-wrap gap-2">
                  {BUSINESS_NATURES.map(n => {
                    const active = data.business_nature.includes(n);
                    return (
                      <button key={n} onClick={() => upd({ business_nature: active ? data.business_nature.filter(x=>x!==n) : [...data.business_nature,n] })}
                        className={`h-8 px-3 text-xs font-semibold rounded-lg border transition-all ${active ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}>
                        {n}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Accounting Method</p>
                <div className="flex gap-3">
                  {[
                    ['mercantile','Mercantile (Accrual)','Income & expenses recorded when earned/incurred'],
                    ['cash','Cash Basis','Recorded when cash is received or paid'],
                  ].map(([v,l,d]) => (
                    <label key={v} className={`flex-1 flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${data.accounting_method===v ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input type="radio" className="sr-only" checked={data.accounting_method===v} onChange={() => upd({ accounting_method:v as any })} />
                      <div className={`mt-0.5 w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center shrink-0 ${data.accounting_method===v ? 'border-blue-500' : 'border-gray-300'}`}>
                        {data.accounting_method===v && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{l}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{d}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Step 3: Tax ── */}
          {step === 3 && (
            <div>
              <h2 className="text-base font-bold text-gray-900 mb-1">Tax Configuration</h2>
              <p className="text-xs text-gray-400 mb-5">GST status and TDS/TCS applicability.</p>
              <div className="mb-5">
                <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">GST Status</p>
                <div className="flex gap-3">
                  {[
                    ['unregistered','Unregistered'],
                    ['regular','Regular'],
                    ['composition','Composition'],
                  ].map(([v,l]) => (
                    <label key={v} className={`flex-1 flex items-center gap-2.5 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${data.gst_status===v ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input type="radio" className="sr-only" checked={data.gst_status===v} onChange={() => upd({ gst_status:v as any })} />
                      <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center shrink-0 ${data.gst_status===v ? 'border-blue-500' : 'border-gray-300'}`}>
                        {data.gst_status===v && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                      </div>
                      <span className="text-sm font-medium text-gray-800">{l}</span>
                    </label>
                  ))}
                </div>
              </div>
              {data.gst_status !== 'unregistered' && (
                <div className="mb-5">
                  <Field label="GSTIN">
                    <input className={`${inp} font-mono uppercase`} value={data.gstin} onChange={e => upd({ gstin:e.target.value.toUpperCase() })} placeholder="29AAAAA0000A1Z5" maxLength={15} />
                  </Field>
                </div>
              )}
              <div className="flex gap-3">
                {[
                  ['tds_applicable','TDS Applicable','Tax deducted at source'],
                  ['tcs_applicable','TCS Applicable','Tax collected at source'],
                ].map(([k,l,d]) => (
                  <label key={k} className={`flex-1 flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${data[k] ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input type="checkbox" className="mt-0.5 w-4 h-4 rounded border-gray-300 accent-blue-600" checked={!!data[k]} onChange={e => upd({ [k]:e.target.checked } as any)} />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{l}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{d}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* ── Step 4: Inventory ── */}
          {step === 4 && (
            <div>
              <h2 className="text-base font-bold text-gray-900 mb-1">Inventory Settings</h2>
              <p className="text-xs text-gray-400 mb-5">Enable if this business tracks stock/inventory.</p>
              <label className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all mb-4 ${data.inventory_enabled ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                <input type="checkbox" className="mt-0.5 w-4 h-4 rounded border-gray-300 accent-blue-600" checked={data.inventory_enabled} onChange={e => upd({ inventory_enabled:e.target.checked })} />
                <div>
                  <p className="text-sm font-semibold text-gray-900">Enable Inventory Tracking</p>
                  <p className="text-xs text-gray-400 mt-0.5">Purchase & sales entries will automatically update stock levels</p>
                </div>
              </label>
              {data.inventory_enabled && (
                <div>
                  <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Valuation Method</p>
                  <div className="flex gap-3">
                    {[
                      ['weighted_average','Weighted Average','Cost averaged over all units purchased'],
                      ['fifo','FIFO','First In, First Out — oldest stock sold first'],
                    ].map(([v,l,d]) => (
                      <label key={v} className={`flex-1 flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${data.valuation_method===v ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                        <input type="radio" className="sr-only" checked={data.valuation_method===v} onChange={() => upd({ valuation_method:v as any })} />
                        <div className={`mt-0.5 w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center shrink-0 ${data.valuation_method===v ? 'border-blue-500' : 'border-gray-300'}`}>
                          {data.valuation_method===v && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{l}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{d}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Step 5: Review ── */}
          {step === 5 && (
            <div>
              <h2 className="text-base font-bold text-gray-900 mb-1">Review & Create</h2>
              <p className="text-xs text-gray-400 mb-5">Verify all details before creating the company.</p>
              <div className="bg-gray-50 rounded-xl p-5 space-y-2.5">
                {[
                  ['Entity Type', ENTITY_TYPES[data.entity_type as EntityType]?.label ?? '—'],
                  ['Name', data.name || '—'],
                  ['PAN', data.pan || '—'],
                  ['State', data.state || '—'],
                  ['Financial Year', data.financial_year_start === 'april' ? 'Apr–Mar' : data.financial_year_start === 'july' ? 'Jul–Jun' : 'Jan–Dec'],
                  ['Business Nature', data.business_nature.join(', ') || '—'],
                  ['Accounting', data.accounting_method === 'mercantile' ? 'Mercantile (Accrual)' : 'Cash Basis'],
                  ['GST Status', `${data.gst_status}${data.gstin ? ` — ${data.gstin}` : ''}`],
                  ['TDS', data.tds_applicable ? 'Applicable' : 'Not applicable'],
                  ['TCS', data.tcs_applicable ? 'Applicable' : 'Not applicable'],
                  ['Inventory', data.inventory_enabled ? `Enabled (${data.valuation_method === 'fifo' ? 'FIFO' : 'Weighted Avg'})` : 'Disabled'],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between text-sm border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                    <span className="text-gray-500">{label}</span>
                    <span className="font-medium text-gray-900 text-right ml-4">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Navigation ── */}
          <div className="flex items-center justify-between mt-6 pt-5 border-t border-gray-100">
            <button onClick={() => setStep(s => s - 1)} disabled={step === 0}
              className="inline-flex items-center gap-1.5 h-9 px-4 text-sm font-medium border border-gray-200 rounded-lg bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 transition-colors">
              <ArrowLeft className="h-3.5 w-3.5" /> Back
            </button>
            {step < 5 ? (
              <button onClick={() => setStep(s => s + 1)} disabled={!canNext()}
                className="inline-flex items-center gap-1.5 h-9 px-4 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-40 transition-colors">
                Continue <ArrowRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button onClick={handleSave} disabled={saving}
                className="inline-flex items-center gap-1.5 h-9 px-5 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors">
                {saving
                  ? <><div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Creating…</>
                  : <><Check className="h-4 w-4" /> Create Company</>}
              </button>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
