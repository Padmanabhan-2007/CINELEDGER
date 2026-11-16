import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Clapperboard, Lock, Mail, ArrowRight, UserCheck, AlertCircle, ShieldCheck, Film, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import CinemaPosterScene from '../components/3d/CinemaPosterScene';

export default function LoginPage() {
  const { login, switchDemoUser } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('analyst@cineledger.io');
  const [password, setPassword] = useState('Password@123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(username, password);
      navigate('/app/dashboard');
    } catch (err) {
      setError(err?.message || 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (role) => {
    setError('');
    setLoading(true);
    try {
      await switchDemoUser(role);
      navigate('/app/dashboard');
    } catch (err) {
      setError(err?.message || 'Failed to authenticate demo user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 sm:p-8 bg-[#F4EDE1] overflow-hidden">
      {/* Background ambient warm glows */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#C18C55]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#657B65]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 rounded-3xl overflow-hidden border border-[rgba(129,115,102,0.22)] shadow-[0_24px_60px_-15px_rgba(41,33,29,0.12)] bg-white/70 backdrop-blur-xl z-10">
        
        {/* Left Side: 3D Poster Cinematic Showcase */}
        <div className="lg:col-span-6 relative min-h-[420px] lg:min-h-[700px] overflow-hidden bg-gradient-to-br from-[#29211D] via-[#3A3029] to-[#211A16] flex flex-col justify-between p-8 sm:p-12 text-[#F4EDE1]">
          {/* Real 3D interactive poster scene in background */}
          <div className="absolute inset-0 opacity-45 pointer-events-auto">
            <CinemaPosterScene compact={true} />
          </div>

          {/* Warm cinematic vignette overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#29211D] via-transparent to-[#29211D]/80 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#29211D]/30 to-[#29211D]/90 pointer-events-none" />

          {/* Header Brand Badge */}
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

          {/* Center Editorial Quote */}
          <div className="relative z-10 space-y-4 my-auto py-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-[#C18C55] font-mono">
              <Sparkles size={13} />
              <span>THEATRICAL RECONCILIATION ENGINE</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white leading-tight">
              Every collection has a number. <br />
              <span className="italic font-normal text-[#C18C55]">Every number has a story to tell.</span>
            </h2>
            <p className="text-sm text-[#F4EDE1]/80 max-w-md font-sans leading-relaxed">
              Empowering distributors and exhibitors with real-time box office verification, cryptographic ledger transparency, and automated multi-tier settlement waterfall calculations.
            </p>
          </div>

          {/* Bottom Trust Indicators */}
          <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between text-xs font-mono text-[#F4EDE1]/70">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-[#657B65]" />
              <span>SHA-256 Tamper Evident</span>
            </div>
            <div className="flex items-center gap-2">
              <Film size={16} className="text-[#C18C55]" />
              <span>20 Major Releases Verified</span>
            </div>
          </div>
        </div>

        {/* Right Side: Warm Morphism Authentication Panel */}
        <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-center bg-[#FBF8F2]/90 backdrop-blur-xl">
          <div className="max-w-md w-full mx-auto space-y-6">
            
            {/* Form Title */}
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-[#657B65]/15 text-[#3E523E] border border-[#657B65]/30 mb-2">
                B2B Enterprise Access
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#29211D]">Industry Portal Sign In</h3>
              <p className="text-sm text-[#817366] mt-1">Sign in to your enterprise box office ledger workspace</p>
            </div>

            {/* Demo Fast Login Personas */}
            <div className="p-4 rounded-2xl bg-white/70 border border-[rgba(129,115,102,0.18)] shadow-sm">
              <div className="flex items-center gap-2 mb-3 text-xs font-mono font-semibold text-[#C18C55] tracking-wider uppercase">
                <UserCheck size={14} />
                <span>Instant Demo Persona Access:</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => handleDemoLogin('ANALYST')}
                  className="p-2.5 rounded-xl bg-[#F4EDE1]/60 hover:bg-[#C18C55]/15 border border-[rgba(129,115,102,0.15)] hover:border-[#C18C55] text-left transition-all group"
                >
                  <p className="font-semibold text-[#29211D] group-hover:text-[#996D3D]">Priya Sharma</p>
                  <p className="text-[10px] text-[#817366] font-mono">Lead Analyst</p>
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoLogin('ADMIN')}
                  className="p-2.5 rounded-xl bg-[#F4EDE1]/60 hover:bg-[#C18C55]/15 border border-[rgba(129,115,102,0.15)] hover:border-[#C18C55] text-left transition-all group"
                >
                  <p className="font-semibold text-[#29211D] group-hover:text-[#996D3D]">Alexander Vance</p>
                  <p className="text-[10px] text-[#817366] font-mono">System Admin</p>
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoLogin('AUDITOR')}
                  className="p-2.5 rounded-xl bg-[#F4EDE1]/60 hover:bg-[#C18C55]/15 border border-[rgba(129,115,102,0.15)] hover:border-[#C18C55] text-left transition-all group"
                >
                  <p className="font-semibold text-[#29211D] group-hover:text-[#996D3D]">Marcus Sterling</p>
                  <p className="text-[10px] text-[#817366] font-mono">Assurance Auditor</p>
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoLogin('DISTRIBUTOR')}
                  className="p-2.5 rounded-xl bg-[#F4EDE1]/60 hover:bg-[#C18C55]/15 border border-[rgba(129,115,102,0.15)] hover:border-[#C18C55] text-left transition-all group"
                >
                  <p className="font-semibold text-[#29211D] group-hover:text-[#996D3D]">David Chen</p>
                  <p className="text-[10px] text-[#817366] font-mono">WB Distributor VP</p>
                </button>
              </div>
            </div>

            {/* Error banner */}
            {error && (
              <div className="p-3.5 rounded-xl bg-[#B8755C]/10 border border-[#B8755C]/30 text-[#B8755C] text-xs flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Standard Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#817366] mb-1.5 font-medium">
                  Email or Username
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 pl-11 rounded-xl bg-white border border-[rgba(129,115,102,0.25)] text-[#29211D] text-sm focus:outline-none focus:ring-2 focus:ring-[#C18C55]/50 focus:border-[#C18C55] transition-all shadow-inner"
                    placeholder="analyst@cineledger.io"
                  />
                  <Mail size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#817366]" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-[#817366] font-medium">
                    Password
                  </label>
                  <Link to="/forgot-password" className="text-xs text-[#C18C55] hover:text-[#996D3D] transition-colors font-medium">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 pl-11 rounded-xl bg-white border border-[rgba(129,115,102,0.25)] text-[#29211D] text-sm focus:outline-none focus:ring-2 focus:ring-[#C18C55]/50 focus:border-[#C18C55] transition-all shadow-inner"
                    placeholder="••••••••"
                  />
                  <Lock size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#817366]" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 mt-2 rounded-xl bg-gradient-to-r from-[#C18C55] to-[#996D3D] text-white font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg shadow-[#C18C55]/25 hover:shadow-xl hover:shadow-[#C18C55]/35 hover:brightness-105 active:scale-[0.99] transition-all disabled:opacity-50"
              >
                {loading ? (
                  <span>Authenticating with MySQL...</span>
                ) : (
                  <>
                    <span>Sign In to Workspace</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            {/* Bottom Register Link */}
            <div className="text-center text-xs text-[#817366] pt-2 space-y-2">
              <div>
                Don't have an enterprise account?{' '}
                <Link to="/industry/signup" className="text-[#C18C55] font-semibold hover:text-[#996D3D] underline">
                  Request access
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
