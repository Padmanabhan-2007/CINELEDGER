import React from 'react';
import { Shield, Key, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl space-y-6">
      <div className="morph-card p-6 flex items-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#C18C55] to-[#996D3D] text-white flex items-center justify-center font-serif font-bold text-2xl shadow-lg shadow-[#C18C55]/25">
          {user?.fullName?.charAt(0) || 'U'}
        </div>
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#29211D]">{user?.fullName || 'Active Analyst'}</h1>
          <p className="text-xs font-mono font-semibold text-[#C18C55] uppercase tracking-wider mt-0.5">{user?.role || 'ANALYST'} SESSION</p>
          <p className="text-xs text-[#817366] mt-1">{user?.email || 'analyst@cineledger.io'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="morph-card p-6 space-y-4">
          <h3 className="text-base font-serif font-bold text-[#29211D] flex items-center gap-2">
            <Shield size={17} className="text-[#C18C55]" />
            <span>Assigned Security Credentials</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-[#F4EDE1]/60 border border-[rgba(129,115,102,0.14)]">
              <p className="text-[#817366] font-medium">System Identifier</p>
              <p className="font-mono font-bold text-[#29211D] mt-0.5">USR-ID-{user?.id || 1}</p>
            </div>
            <div className="p-3 rounded-xl bg-[#F4EDE1]/60 border border-[rgba(129,115,102,0.14)]">
              <p className="text-[#817366] font-medium">Active Permission Scope</p>
              <p className="font-mono font-bold text-[#C18C55] mt-0.5">ROLE_{user?.role || 'ANALYST'}</p>
            </div>
            <div className="p-3 rounded-xl bg-[#F4EDE1]/60 border border-[rgba(129,115,102,0.14)]">
              <p className="text-[#817366] font-medium">Authentication Protocol</p>
              <p className="font-mono text-[#817366] mt-0.5">Stateless HMAC-SHA256 JWT Token</p>
            </div>
          </div>
        </div>

        <div className="morph-card p-6 space-y-4">
          <h3 className="text-base font-serif font-bold text-[#29211D] flex items-center gap-2">
            <Key size={17} className="text-[#C18C55]" />
            <span>Audit Trail Signature</span>
          </h3>
          <p className="text-xs text-[#817366] leading-relaxed">
            All actions performed in this session are cryptographically stamped with your account identity and embedded into the immutable CineLedger SHA-256 block sequence.
          </p>
          <div className="p-3.5 bg-[#657B65]/12 border border-[#657B65]/30 rounded-xl text-xs font-mono font-semibold text-[#465B46] flex items-center gap-2">
            <CheckCircle2 size={15} />
            <span>Digital Audit Signature Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
