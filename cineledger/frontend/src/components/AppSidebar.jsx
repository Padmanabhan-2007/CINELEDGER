import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Film,
  Building2,
  FileCheck2,
  UploadCloud,
  Receipt,
  AlertOctagon,
  BarChart3,
  ShieldCheck,
  Users2,
  User,
  Settings,
  Clapperboard,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AppSidebar() {
  const { user, logout } = useAuth();

  const navItems = [
    { label: 'Overview', path: '/app/dashboard', icon: LayoutDashboard },
    { label: 'Films', path: '/app/films', icon: Film },
    { label: 'Cinemas', path: '/app/cinemas', icon: Building2 },
    { label: 'Reconciliations', path: '/app/reconciliations', icon: FileCheck2 },
    { label: 'Imports', path: '/app/imports', icon: UploadCloud },
    { label: 'Settlements', path: '/app/settlements', icon: Receipt },
    { label: 'Disputes', path: '/app/disputes', icon: AlertOctagon },
    { label: 'Reports', path: '/app/reports', icon: BarChart3 },
    { label: 'Audit Ledger', path: '/app/audit-log', icon: ShieldCheck, badge: 'SHA-256' },
  ];

  const secondaryNavItems = [
    { label: 'Team', path: '/app/team', icon: Users2 },
    { label: 'Profile', path: '/app/profile', icon: User },
    { label: 'Settings', path: '/app/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#FBF8F2] border-r border-[rgba(129,115,102,0.18)] flex flex-col justify-between h-screen sticky top-0 z-40 select-none shadow-sm">
      <div className="overflow-y-auto">
        {/* Brand Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-[rgba(129,115,102,0.16)] bg-white/60">
          <Link to="/app/dashboard" className="flex items-center gap-2.5 text-decoration-none">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#CC9861] to-[#C18C55] flex items-center justify-center shadow-sm">
              <Clapperboard size={16} className="text-white" />
            </div>
            <div>
              <span className="font-serif font-extrabold text-base text-[#29211D] tracking-wide">
                Cine<span className="text-[#C18C55]">Ledger</span>
              </span>
              <p className="text-[9px] uppercase font-mono tracking-widest text-[#817366] -mt-1">
                INDUSTRY PORTAL
              </p>
            </div>
          </Link>
          <Link
            to="/"
            title="Return to CineLedger Gateway"
            className="text-[10px] font-mono font-semibold px-2 py-1 rounded-md bg-[#F4EDE1] text-[#817366] hover:text-[#29211D] hover:bg-[#EAE1D3] transition-colors"
          >
            Gateway
          </Link>
        </div>

        {/* Primary Navigation */}
        <div className="py-4 px-3 space-y-1">
          <p className="px-3 pb-2 text-[10px] uppercase font-mono tracking-wider text-[#817366] font-semibold">
            Operations
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                    isActive
                      ? 'bg-white text-[#29211D] font-semibold shadow-sm border border-[rgba(193,140,85,0.45)]'
                      : 'text-[#817366] hover:bg-[#F4EDE1]/80 hover:text-[#29211D]'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon
                    size={16}
                    className="transition-transform group-hover:scale-110 text-[#C18C55]"
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded-full bg-[#C18C55]/14 text-[#8C5E2E] border border-[#C18C55]/30">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Secondary Navigation */}
        <div className="pt-2 px-3 space-y-1 border-t border-[rgba(129,115,102,0.14)]">
          <p className="px-3 pb-2 text-[10px] uppercase font-mono tracking-wider text-[#817366] font-semibold">
            Governance
          </p>
          {secondaryNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-white text-[#29211D] font-semibold border border-[rgba(193,140,85,0.45)]'
                      : 'text-[#817366] hover:bg-[#F4EDE1]/80 hover:text-[#29211D]'
                  }`
                }
              >
                <Icon size={16} className="text-[#817366]" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* User Session Footer */}
      <div className="p-3 border-t border-[rgba(129,115,102,0.16)] bg-white/70">
        <div className="p-2.5 rounded-xl bg-[#FBF8F2] border border-[rgba(129,115,102,0.18)] flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#657B65] to-[#4F624F] text-white flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-sm">
              {user?.fullName?.charAt(0) || 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-[#29211D] truncate">
                {user?.fullName || 'Alexander Vance'}
              </p>
              <p className="text-[10px] font-mono text-[#C18C55] uppercase tracking-wider font-semibold">
                {user?.role || 'ANALYST'}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            title="Log Out"
            className="p-1.5 rounded-lg hover:bg-[#F4EDE1] text-[#817366] hover:text-[#B8755C] transition-colors"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
}
