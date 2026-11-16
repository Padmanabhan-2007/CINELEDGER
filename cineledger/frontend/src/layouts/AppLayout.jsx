import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AppSidebar from '../components/AppSidebar';
import AppNavbar from '../components/AppNavbar';

export default function AppLayout() {
  const location = useLocation();

  const getPageTitle = (path) => {
    if (path.includes('/app/films/')) return 'Film Master Detail';
    if (path === '/app/films') return 'Theatrical Film Catalog';
    if (path === '/app/cinemas') return 'Cinema Circuits & Screens';
    if (path === '/app/reconciliations/new') return 'New Reconciliation Workflow';
    if (path.includes('/app/reconciliations/')) return 'Reconciliation Workbench';
    if (path === '/app/reconciliations') return 'Box-Office Reconciliations';
    if (path === '/app/imports') return 'Multi-Source Data Ingestion';
    if (path.includes('/app/settlements/')) return 'Contract Settlement Voucher';
    if (path === '/app/settlements') return 'Contract-Aware Settlements';
    if (path.includes('/app/disputes/')) return 'Dispute Investigation Case';
    if (path === '/app/disputes') return 'Disputes & Variance Resolution';
    if (path === '/app/reports') return 'Financial Statements & Reports';
    if (path === '/app/audit-log') return 'Cryptographic SHA-256 Audit Trail';
    if (path === '/app/team') return 'Organizations & Stakeholder Team';
    if (path === '/app/profile') return 'User Profile & Permissions';
    if (path === '/app/settings') return 'Financial System Configuration';
    return 'Financial Overview & Dashboard';
  };

  const title = getPageTitle(location.pathname);

  return (
    <div className="min-h-screen flex bg-[#F4EDE1] text-[#29211D]">
      {/* Pinned Operational Sidebar */}
      <AppSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AppNavbar pageTitle={title} />
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
