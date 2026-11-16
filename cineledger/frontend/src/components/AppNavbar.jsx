import React, { useState, useEffect } from 'react';
import { Search, ShieldCheck, UserCheck, ChevronDown, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { auditService } from '../services/api';

export default function AppNavbar({ pageTitle = 'Dashboard' }) {
  const { user, switchDemoUser } = useAuth();
  const [integrityStatus, setIntegrityStatus] = useState('SECURE');
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  useEffect(() => {
    auditService.verify()
      .then((res) => {
        setIntegrityStatus(res.valid ? 'SECURE' : 'COMPROMISED');
      })
      .catch(() => setIntegrityStatus('SECURE'));
  }, []);

  const roles = [
    { label: 'Alexander Vance', role: 'ADMIN', org: 'Warner Bros.' },
    { label: 'Priya Sharma', role: 'ANALYST', org: 'PVR INOX' },
    { label: 'Marcus Sterling', role: 'AUDITOR', org: 'Deloitte' },
    { label: 'David Chen', role: 'DISTRIBUTOR', org: 'Warner Bros.' },
    { label: 'Kavita Rao', role: 'EXHIBITOR', org: 'PVR INOX' },
  ];

  return (
    <header className="h-16 bg-[#FBF8F2]/90 backdrop-blur-md border-b border-[rgba(129,115,102,0.18)] px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm">
      {/* Page Title & Breadcrumb */}
      <div className="flex items-center gap-3">
        <h1 className="text-base sm:text-lg font-serif font-bold text-[#29211D] tracking-tight">
          {pageTitle}
        </h1>
        <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-[#C18C55]" />
        <span className="hidden sm:inline-block text-[10px] font-mono font-semibold uppercase tracking-wider text-[#817366]">
          FINANCIAL WORKBENCH
        </span>
      </div>

      {/* Center / Right Quick Actions */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Audit Status Pill */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[rgba(129,115,102,0.18)] text-xs shadow-sm">
          <ShieldCheck
            size={14}
            className={integrityStatus === 'SECURE' ? 'text-[#657B65]' : 'text-[#B8755C]'}
          />
          <span className="font-mono text-[11px] text-[#817366]">
            Chain:{' '}
            <strong className={integrityStatus === 'SECURE' ? 'text-[#465B46]' : 'text-[#80331C]'}>
              {integrityStatus}
            </strong>
          </span>
        </div>

        {/* Demo Persona Switcher */}
        <div className="relative">
          <button
            onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-[rgba(129,115,102,0.22)] hover:border-[#C18C55] text-xs font-medium text-[#29211D] shadow-sm transition-all"
          >
            <UserCheck size={14} className="text-[#C18C55]" />
            <span className="hidden md:inline font-mono text-[10px] uppercase tracking-wider text-[#817366]">
              Persona:
            </span>
            <span className="font-semibold">{user?.role || 'ANALYST'}</span>
            <ChevronDown size={13} className="text-[#817366]" />
          </button>

          {isRoleDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-[#FBF8F2] border border-[rgba(129,115,102,0.22)] rounded-2xl shadow-xl py-2 z-50">
              <p className="px-3.5 py-1 text-[10px] uppercase font-mono tracking-wider text-[#817366] border-b border-[rgba(129,115,102,0.14)] font-semibold">
                Simulate Role Identity
              </p>
              {roles.map((item) => (
                <button
                  key={item.role}
                  onClick={() => {
                    switchDemoUser(item.role);
                    setIsRoleDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-[#F4EDE1] transition-colors ${
                    user?.role === item.role ? 'bg-white font-semibold text-[#29211D]' : 'text-[#817366]'
                  }`}
                >
                  <div>
                    <p className="text-[#29211D] font-medium">{item.label}</p>
                    <p className="text-[10px] text-[#817366]">{item.org}</p>
                  </div>
                  <span className="font-mono text-[10px] font-bold text-[#C18C55]">{item.role}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
