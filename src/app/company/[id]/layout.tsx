import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { ErrorBoundary } from '@/components/layout/ErrorBoundary';
import { CompanyProvider } from '@/contexts/CompanyContext';

export default function CompanyLayout() {
  // Sidebar starts open by default; can be toggled via header icon on all screen sizes.
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <CompanyProvider>
      <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
        <Header onMenuToggle={() => setSidebarOpen((open) => !open)} />
        <div className="flex flex-1 min-h-0">
          {/* Mobile overlay when sidebar is open */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/30 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Sidebar container: slides on mobile, collapses/expands width on desktop */}
          <div
            className={`fixed lg:static z-50 lg:z-auto h-full transition-[transform,width] duration-200 overflow-hidden flex flex-col
              ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
              lg:translate-x-0
              ${sidebarOpen ? 'lg:w-52' : 'lg:w-0'}
            `}
          >
            <Sidebar />
          </div>

          <main className="flex-1 min-h-0 overflow-auto p-4 sm:p-6 min-w-0">
            <ErrorBoundary>
              <Outlet />
            </ErrorBoundary>
          </main>
        </div>
      </div>
    </CompanyProvider>
  );
}
