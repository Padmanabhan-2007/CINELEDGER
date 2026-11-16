import React from 'react';
import { Users2, Building, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function TeamPage() {
  const { user, switchDemoUser } = useAuth();

  const organizations = [
    { name: 'Warner Bros. Discovery', type: 'STUDIO', code: 'WB-STUDIO', contact: 'boxoffice@wb.com', status: 'VERIFIED' },
    { name: 'Reliance Entertainment', type: 'DISTRIBUTOR', code: 'REL-DIST', contact: 'theatrical@reliance.com', status: 'VERIFIED' },
    { name: 'PVR INOX Limited', type: 'EXHIBITOR_CHAIN', code: 'PVR-INOX', contact: 'settlements@pvrinox.com', status: 'VERIFIED' },
    { name: 'Cinepolis India', type: 'EXHIBITOR_CHAIN', code: 'CINEPOLIS', contact: 'ops@cinepolis.com', status: 'VERIFIED' },
    { name: 'Deloitte Media Assurance', type: 'AUDIT_FIRM', code: 'DELOITTE', contact: 'audit@deloitte.com', status: 'VERIFIED' },
  ];

  const demoStakeholders = [
    { role: 'ADMIN', name: 'Alexander Vance', org: 'Warner Bros. Discovery', email: 'admin@cineledger.io', permissions: 'Full platform administration & key anchoring' },
    { role: 'ANALYST', name: 'Priya Sharma', org: 'PVR INOX Limited', email: 'analyst@cineledger.io', permissions: 'Run reconciliations, flag variances & draft settlements' },
    { role: 'AUDITOR', name: 'Marcus Sterling', org: 'Deloitte Media Assurance', email: 'auditor@cineledger.io', permissions: 'Cryptographic SHA-256 validation & payout sign-off' },
    { role: 'DISTRIBUTOR', name: 'David Chen', org: 'Warner Bros. Discovery', email: 'distributor@cineledger.io', permissions: 'Submit distributor statements & approve terms' },
    { role: 'EXHIBITOR', name: 'Kavita Rao', org: 'PVR INOX Limited', email: 'exhibitor@cineledger.io', permissions: 'Upload theater POS feeds & dispute reviews' },
  ];

  return (
    <div className="space-y-6">
      <div className="morph-card p-6">
        <div className="flex items-center gap-2 text-[#C18C55]">
          <Users2 size={18} />
          <span className="text-[11px] font-mono uppercase tracking-widest font-semibold">Stakeholder Ecosystem</span>
        </div>
        <h1 className="text-2xl font-serif font-bold text-[#29211D] mt-1">Multi-Circuit Organizations &amp; Access Governance</h1>
        <p className="text-xs text-[#817366] mt-1">
          Permission-segregated multi-tenant topology ensuring studios, distributors, exhibitors, and assurance auditors operate with complete data privacy.
        </p>
      </div>

      {/* Quick Role Switcher Banner */}
      <div className="morph-card p-6 border-[#C18C55]/30">
        <p className="text-xs font-mono uppercase text-[#C18C55] font-semibold mb-3 tracking-wider">Simulate Stakeholder Perspective</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          {demoStakeholders.map((s) => (
            <button
              key={s.role}
              onClick={() => switchDemoUser(s.role)}
              className={`p-3.5 rounded-2xl border text-left transition-all ${
                user?.role === s.role
                  ? 'bg-[#C18C55]/15 border-[#C18C55] shadow-md shadow-[#C18C55]/10'
                  : 'bg-white/70 border-[rgba(129,115,102,0.16)] hover:border-[#C18C55]/45'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase text-[#9E6E3B]">{s.role}</span>
                {user?.role === s.role && <CheckCircle2 size={14} className="text-[#465B46]" />}
              </div>
              <p className="text-xs font-bold text-[#29211D] mt-1 truncate">{s.name}</p>
              <p className="text-[10px] text-[#817366] truncate">{s.org}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Organizations Table */}
      <div className="morph-card overflow-hidden p-6">
        <div className="pb-4 mb-4 border-b border-[rgba(129,115,102,0.14)]">
          <span className="text-base font-serif font-bold text-[#29211D]">Registered Multi-Circuit Organizations</span>
        </div>
        <div className="table-container">
          <table className="cine-table">
            <thead>
              <tr>
                <th>Organization Name</th>
                <th>Entity Type</th>
                <th>System Code</th>
                <th>Direct Contact</th>
                <th style={{ textAlign: 'right' }}>Verification</th>
              </tr>
            </thead>
            <tbody>
              {organizations.map((org) => (
                <tr key={org.code}>
                  <td className="font-semibold text-xs text-[#29211D] flex items-center gap-2">
                    <Building size={15} className="text-[#C18C55]" />
                    <span>{org.name}</span>
                  </td>
                  <td>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-[#F4EDE1] text-[#817366] border border-[rgba(129,115,102,0.2)] font-semibold">
                      {org.type}
                    </span>
                  </td>
                  <td className="font-mono text-xs font-semibold text-[#C18C55]">{org.code}</td>
                  <td className="font-mono text-xs text-[#817366]">{org.contact}</td>
                  <td className="text-right">
                    <span className="text-[11px] text-[#465B46] font-mono font-semibold inline-flex items-center justify-end gap-1">
                      <CheckCircle2 size={13} />
                      <span>{org.status}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
