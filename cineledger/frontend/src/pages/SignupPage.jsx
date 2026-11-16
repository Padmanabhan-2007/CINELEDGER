import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Clapperboard, Lock, Mail, User, Building, ArrowRight, AlertCircle, ShieldCheck, Sparkles, Film } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import CinemaPosterScene from '../components/3d/CinemaPosterScene';

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    fullName: '',
    role: 'ANALYST',
    organizationId: 1,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signup(formData);
      navigate('/app/dashboard');
    } catch (err) {
      setError(err?.message || 'Failed to create account. Check inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 sm:p-8 bg-[#F4EDE1] overflow-hidden">
      {/* Ambient warm glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#C18C55]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#657B65]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 rounded-3xl overflow-hidden border border-[rgba(129,115,102,0.22)] shadow-[0_24px_60px_-15px_rgba(41,33,29,0.12)] bg-white/70 backdrop-blur-xl z-10">
        
        {/* Left Side: 3D Poster Cinematic Environment */}
        <div className="lg:col-span-5 relative min-h-[380px] lg:min-h-[720px] overflow-hidden bg-gradient-to-br from-[#29211D] via-[#3A3029] to-[#211A16] flex flex-col justify-between p-8 sm:p-12 text-[#F4EDE1]">
          <div className="absolute inset-0 opacity-40 pointer-events-auto">
            <CinemaPosterScene compact={true} />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#29211D] via-transparent to-[#29211D]/80 pointer-events-none" />

          {/* Header Brand */}
          <div className="relative z-10 space-y-3">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs text-[#C18C55] hover:text-[#E5B982] transition-colors font-mono"
            >
              <span>← CineLedger Dual Gateway</span>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#C18C55] to-[#996D3D] flex items-center justify-center shadow-lg shadow-[#C18C55]/30">
                <Clapperboard size={22} className="text-[#29211D]" />
              </div>
              <div>
                <span className="font-serif text-2xl font-bold tracking-tight text-[#FBF8F2]">CineLedger</span>
                <span className="block text-[11px] font-mono tracking-widest text-[#C18C55] uppercase">Industry Portal</span>
              </div>
            </div>
          </div>

          {/* Center Text */}
          <div className="relative z-10 space-y-4 my-auto py-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-[#C18C55] font-mono">
              <Sparkles size={13} />
              <span>THEATRICAL ECOSYSTEM INTEGRATION</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white leading-snug">
              Unify box-office figures across studios, circuits, and audit firms.
            </h2>
            <p className="text-xs sm:text-sm text-[#F4EDE1]/80 leading-relaxed font-sans">
              Instant cryptographic verification for theatrical settlements, automated deductions, multi-party consensus, and discrepancy resolution workflows.
            </p>
          </div>

          {/* Bottom badge */}
          <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between text-xs font-mono text-[#F4EDE1]/70">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-[#657B65]" />
              <span>Cryptographic Consensus</span>
            </div>
            <div className="flex items-center gap-2">
              <Film size={16} className="text-[#C18C55]" />
              <span>Universal DTO Specs</span>
            </div>
          </div>
        </div>

        {/* Right Side: Warm Morphism Registration Form */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center bg-[#FBF8F2]/90 backdrop-blur-xl">
          <div className="max-w-xl w-full mx-auto space-y-6">
            <div>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#29211D]">Create Account</h3>
              <p className="text-sm text-[#817366] mt-1">Join the theatrical box-office financial reconciliation network</p>
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-[#B8755C]/10 border border-[#B8755C]/30 text-[#B8755C] text-xs flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#817366] mb-1.5 font-medium">
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-4 py-2.5 pl-10 rounded-xl bg-white border border-[rgba(129,115,102,0.25)] text-[#29211D] text-sm focus:outline-none focus:ring-2 focus:ring-[#C18C55]/50 focus:border-[#C18C55] transition-all shadow-inner"
                      placeholder="Marcus Vance"
                    />
                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#817366]" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#817366] mb-1.5 font-medium">
                    Username
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-[rgba(129,115,102,0.25)] text-[#29211D] text-sm focus:outline-none focus:ring-2 focus:ring-[#C18C55]/50 focus:border-[#C18C55] transition-all shadow-inner"
                    placeholder="mvance"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#817366] mb-1.5 font-medium">
                  Work Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 pl-10 rounded-xl bg-white border border-[rgba(129,115,102,0.25)] text-[#29211D] text-sm focus:outline-none focus:ring-2 focus:ring-[#C18C55]/50 focus:border-[#C18C55] transition-all shadow-inner"
                    placeholder="marcus@warnerbros.com"
                  />
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#817366]" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#817366] mb-1.5 font-medium">
                  Password (min 6 characters)
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-2.5 pl-10 rounded-xl bg-white border border-[rgba(129,115,102,0.25)] text-[#29211D] text-sm focus:outline-none focus:ring-2 focus:ring-[#C18C55]/50 focus:border-[#C18C55] transition-all shadow-inner"
                    placeholder="••••••••"
                  />
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#817366]" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#817366] mb-1.5 font-medium">
                    Stakeholder Role
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[rgba(129,115,102,0.25)] text-[#29211D] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#C18C55]/50 focus:border-[#C18C55] transition-all shadow-inner"
                  >
                    <option value="ANALYST">Reconciliation Analyst</option>
                    <option value="AUDITOR">Assurance Auditor</option>
                    <option value="DISTRIBUTOR">Distributor Representative</option>
                    <option value="EXHIBITOR">Cinema Circuit Operator</option>
                    <option value="ADMIN">System Administrator</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#817366] mb-1.5 font-medium">
                    Affiliated Organization
                  </label>
                  <select
                    value={formData.organizationId}
                    onChange={(e) => setFormData({ ...formData, organizationId: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[rgba(129,115,102,0.25)] text-[#29211D] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#C18C55]/50 focus:border-[#C18C55] transition-all shadow-inner"
                  >
                    <option value={1}>Warner Bros. Discovery (Studio)</option>
                    <option value={2}>Reliance Entertainment (Distributor)</option>
                    <option value={3}>PVR INOX Limited (Exhibitor)</option>
                    <option value={4}>Cinepolis India (Exhibitor)</option>
                    <option value={5}>Deloitte Media Assurance (Audit Firm)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 mt-2 rounded-xl bg-gradient-to-r from-[#C18C55] to-[#996D3D] text-white font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg shadow-[#C18C55]/25 hover:shadow-xl hover:shadow-[#C18C55]/35 hover:brightness-105 active:scale-[0.99] transition-all disabled:opacity-50"
              >
                {loading ? (
                  <span>Registering Account in MySQL...</span>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <div className="text-center text-xs text-[#817366] pt-2 space-y-2">
              <div>
                Already have an enterprise account?{' '}
                <Link to="/industry/login" className="text-[#C18C55] font-semibold hover:text-[#996D3D] underline">
                  Sign in
                </Link>
              </div>
              <div className="pt-2 border-t border-[rgba(129,115,102,0.15)]">
                <Link to="/" className="text-[11px] text-[#817366] hover:text-[#29211D] transition-colors">
                  ← Return to CineLedger Portal Selector
                </Link>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
