import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Clapperboard, ShieldCheck, ArrowUpRight, Lock, Database, Code } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F4EDE1] text-[#29211D] selection:bg-[#C18C55]/25 selection:text-[#29211D]">
      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>

      {/* Warm Luxury Editorial Footer */}
      <footer className="bg-[#FBF8F2] border-t border-[rgba(129,115,102,0.2)] pt-16 pb-12 mt-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-12 border-b border-[rgba(129,115,102,0.18)]">
            {/* Column 1: Brand */}
            <div className="space-y-4 md:col-span-1">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#CC9861] to-[#C18C55] flex items-center justify-center shadow-md">
                  <Clapperboard size={16} className="text-white" />
                </div>
                <span className="font-serif font-extrabold text-lg text-[#29211D] tracking-wide">
                  Cine<span className="text-[#C18C55]">Ledger</span>
                </span>
              </div>
              <p className="text-xs text-[#817366] leading-relaxed">
                Every movie has a story. Every collection has a number. Every number has a story to tell.
                Bringing financial clarity, intelligent reconciliation, and complete transparency to the cinema distribution ecosystem.
              </p>
              <div className="flex items-center gap-2 text-xs font-mono text-[#A57340]">
                <ShieldCheck size={14} className="text-[#657B65]" />
                <span>SHA-256 Tamper-Evident Chain</span>
              </div>
            </div>

            {/* Column 2: Platform Architecture */}
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-[#A57340] font-semibold mb-4">
                Platform Architecture
              </p>
              <ul className="space-y-2.5 text-xs text-[#817366]">
                <li><Link to="/app/reconciliations" className="hover:text-[#29211D] transition-colors">Intelligent Reconciliation</Link></li>
                <li><Link to="/app/imports" className="hover:text-[#29211D] transition-colors">Box Office Data Import</Link></li>
                <li><Link to="/app/settlements" className="hover:text-[#29211D] transition-colors">Settlement Waterfall</Link></li>
                <li><Link to="/app/disputes" className="hover:text-[#29211D] transition-colors">Dispute Resolution Workbench</Link></li>
                <li><Link to="/app/audit-log" className="hover:text-[#29211D] transition-colors">Cryptographic Audit Ledger</Link></li>
              </ul>
            </div>

            {/* Column 3: Theatrical Stakeholders */}
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-[#A57340] font-semibold mb-4">
                Theatrical Ecosystem
              </p>
              <ul className="space-y-2.5 text-xs text-[#817366]">
                <li className="text-[#29211D] font-medium">Film Studios & Producers</li>
                <li>Theatrical Distributors</li>
                <li>Multiplex & Circuit Exhibitors</li>
                <li>Single-Screen Operators</li>
                <li>Media Assurance & Forensic Auditors</li>
              </ul>
            </div>

            {/* Column 4: Quick Launch Workbench */}
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-[#A57340] font-semibold mb-4">
                Enterprise Access
              </p>
              <p className="text-xs text-[#817366] mb-4 leading-relaxed">
                Access the multi-circuit production demonstration environment populated with live catalog titles and audit records.
              </p>
              <Link
                to="/app/dashboard"
                className="btn btn-primary text-xs w-full justify-between"
              >
                <span>Enter Workspace</span>
                <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#817366] gap-4">
            <p>© 2026 CineLedger Financial Technologies Inc. All box-office rights & formulas reserved.</p>
            <div className="flex gap-6 font-mono text-[11px] text-[#817366]">
              <span className="flex items-center gap-1"><Code size={11} /> Spring Boot 3.3.4</span>
              <span className="flex items-center gap-1"><Database size={11} /> MySQL 8.0 Persistence</span>
              <span className="flex items-center gap-1"><Lock size={11} /> React Three Fiber 3D</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
