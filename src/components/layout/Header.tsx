import { Link } from 'react-router-dom';
import { ChevronLeft, Settings, Menu, Layers, ChevronRight } from 'lucide-react';
import { useCompany } from '@/hooks/useCompany';
import { ENTITY_TYPES, type EntityType } from '@/lib/constants/entityTypes';

interface HeaderProps {
  onMenuToggle?: () => void;
}

export function Header({ onMenuToggle }: HeaderProps) {
  const { company, loading } = useCompany();

  if (loading) {
    return (
      <header className="h-11 bg-white border-b border-gray-200 flex items-center px-4 gap-3 shrink-0 z-30">
        <div className="h-4 w-56 bg-gray-100 rounded animate-pulse" />
      </header>
    );
  }

  if (!company) return null;

  const meta = ENTITY_TYPES[company.entity_type as EntityType];

  return (
    <header className="h-11 bg-white border-b border-gray-200 flex items-center px-3 gap-2 shrink-0 z-30 sticky top-0">
      {/* Menu toggle */}
      {onMenuToggle && (
        <button
          onClick={onMenuToggle}
          className="p-1.5 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors shrink-0"
        >
          <Menu className="h-4 w-4" />
        </button>
      )}

      {/* Companies breadcrumb */}
      <Link
        to="/companies"
        className="p-1.5 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors shrink-0"
        title="All Companies"
      >
        <Layers className="h-3.5 w-3.5" />
      </Link>

      <ChevronRight className="h-3 w-3 text-gray-300 shrink-0" />

      {/* Company name */}
      <span className="text-sm font-semibold text-gray-800 truncate max-w-[180px] sm:max-w-xs">
        {company.name}
      </span>

      {/* Entity badge */}
      <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-semibold shrink-0 border border-blue-100">
        {meta?.shortLabel ?? company.entity_type}
      </span>

      <div className="flex-1" />

      {/* Settings */}
      <Link
        to={`/company/${company.id}/settings`}
        className="p-1.5 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
        title="Settings"
      >
        <Settings className="h-3.5 w-3.5" />
      </Link>
    </header>
  );
}
