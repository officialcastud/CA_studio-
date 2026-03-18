import { Link } from 'react-router-dom';
import { useCompany } from '@/hooks/useCompany';
import { PageHeader } from '@/components/layout/PageHeader';
import { AlertBanner } from '@/components/layout/AlertBanner';
import { getGSTMidYearDate } from '@/lib/utils/edgeCases';

const gstModules = [
  { href: 'gst/itc-register', label: 'ITC Register', desc: 'Input Tax Credit register from purchase entries' },
  { href: 'gst/gstr1', label: 'GSTR-1 Data', desc: 'Outward supply data — B2B / B2C summary' },
  { href: 'gst/gstr3b', label: 'GSTR-3B Working', desc: 'Monthly return working — output tax vs ITC' },
  { href: 'gst/eway-bill', label: 'e-Way Bill Register', desc: 'Goods movement register for consignments > ₹50,000' },
];

export default function GSTPage() {
  const { company, companyId, loading } = useCompany();

  if (loading || !company) {
    return <div className="flex items-center justify-center py-16"><div className="h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>;
  }

  if (company.gst_status === 'unregistered') {
    return (
      <div>
        <PageHeader title="GST" description="Goods and Services Tax" />
        <AlertBanner type="info" title="GST Not Applicable" message="This entity is not registered under GST. GST modules are not available for unregistered entities." />
      </div>
    );
  }

  const midYearDate = getGSTMidYearDate(company);

  return (
    <div>
      <PageHeader title="GST" description="Goods and Services Tax — registers and return workings" />

      {midYearDate && (
        <AlertBanner type="warning" title="Mid-Year GST Registration" message={`This entity was registered under GST on ${midYearDate}, which is after the financial year start. GST computations will only include transactions from the registration date onwards.`} />
      )}

      {company.gst_status === 'composition' && (
        <AlertBanner type="info" title="Composition Scheme" message={`This entity is under the GST Composition Scheme (Rate: ${company.gst_details?.compositionRate || 1}%). ITC is not available under composition scheme.`} />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {gstModules.map(m => (
          <Link key={m.href} to={`/company/${companyId}/${m.href}`} className="bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-500 hover:shadow-sm transition-all">
            <h3 className="text-base font-bold text-gray-900">{m.label}</h3>
            <p className="text-xs text-gray-400 mt-0.5">{m.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
