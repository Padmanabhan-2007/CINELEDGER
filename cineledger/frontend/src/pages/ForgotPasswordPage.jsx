import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clapperboard, Mail, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 sm:p-8 bg-[#F4EDE1] overflow-hidden">
      {/* Background ambient warm glows */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#C18C55]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#657B65]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#C18C55] to-[#996D3D] flex items-center justify-center shadow-lg shadow-[#C18C55]/25 mx-auto">
            <Clapperboard size={24} className="text-[#29211D]" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-[#29211D]">Reset Password</h2>
          <p className="text-xs text-[#817366]">Enterprise cryptographic security and credential dispatch</p>
        </div>

        {/* Card */}
        <div className="bg-white/80 backdrop-blur-xl border border-[rgba(129,115,102,0.22)] rounded-3xl p-6 sm:p-8 shadow-[0_20px_50px_-12px_rgba(41,33,29,0.1)]">
          {submitted ? (
            <div className="text-center space-y-4 py-4">
              <div className="w-14 h-14 rounded-full bg-[#657B65]/15 border border-[#657B65]/30 text-[#657B65] flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 size={28} />
              </div>
              <h3 className="font-serif font-bold text-xl text-[#29211D]">Recovery Link Dispatched</h3>
              <p className="text-xs text-[#817366] leading-relaxed">
                If an authorized stakeholder account exists for <strong className="text-[#29211D]">{email}</strong>, you will receive an enterprise cryptographic password reset token shortly.
              </p>
              <div className="pt-2">
                <Link
                  to="/login"
                  className="w-full inline-flex items-center justify-center py-3 rounded-xl bg-gradient-to-r from-[#C18C55] to-[#996D3D] text-white text-xs font-semibold uppercase tracking-wider shadow-md hover:shadow-lg transition-all"
                >
                  Return to Sign In
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#817366] mb-1.5 font-medium">
                  Registered Work Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 pl-11 rounded-xl bg-white border border-[rgba(129,115,102,0.25)] text-[#29211D] text-sm focus:outline-none focus:ring-2 focus:ring-[#C18C55]/50 focus:border-[#C18C55] transition-all shadow-inner"
                    placeholder="analyst@cineledger.io"
                  />
                  <Mail size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#817366]" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 mt-2 rounded-xl bg-gradient-to-r from-[#C18C55] to-[#996D3D] text-white font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg shadow-[#C18C55]/25 hover:shadow-xl hover:shadow-[#C18C55]/35 hover:brightness-105 active:scale-[0.99] transition-all"
              >
                <span>Send Reset Link</span>
                <ArrowRight size={16} />
              </button>

              <div className="mt-4 text-center">
                <Link to="/login" className="text-xs text-[#817366] hover:text-[#C18C55] transition-colors">
                  Remember your password? <span className="text-[#C18C55] font-semibold underline">Sign in</span>
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
