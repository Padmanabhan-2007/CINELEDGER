import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Clapperboard, Lock, Mail, ArrowRight, UserCheck, AlertCircle, Sparkles, Film, Ticket, Armchair, ChevronLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import CinemaPosterScene from '../components/3d/CinemaPosterScene';

export default function CinemaholicLoginPage() {
  const { cinemaholicLogin, switchDemoAudience } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('audience@cinemaholic.com');
  const [password, setPassword] = useState('Password@123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await cinemaholicLogin(username, password);
      navigate('/cinemaholic/dashboard');
    } catch (err) {
      setError(err?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAudienceLogin = async (personaKey) => {
    setError('');
    setLoading(true);
    try {
      await switchDemoAudience(personaKey);
      navigate('/cinemaholic/dashboard');
    } catch (err) {
      setError(err?.message || 'Failed to authenticate audience demo user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 sm:p-8 bg-[#14100E] text-[#F4EDE1] overflow-hidden select-none">
      {/* Ambient warm theatrical glows */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#C18C55]/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#E5B982]/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Glassmorphic Container */}
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 rounded-3xl overflow-hidden border border-[#C18C55]/30 shadow-[0_24px_80px_rgba(0,0,0,0.8)] bg-[#1C1714]/85 backdrop-blur-2xl z-10">
        
        {/* Left Side: 3D Cinema Experience Showcase */}
        <div className="lg:col-span-5 relative min-h-[360px] lg:min-h-[640px] overflow-hidden bg-gradient-to-br from-[#291F18] via-[#1E1713] to-[#120E0C] flex flex-col justify-between p-8 sm:p-10 text-[#F4EDE1]">
          {/* 3D Poster Scene Background */}
          <div className="absolute inset-0 opacity-40 pointer-events-auto">
            <CinemaPosterScene compact={true} />
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-[#14100E] via-transparent to-[#14100E]/80 pointer-events-none" />

          {/* Top Brand & Gateway Navigation */}
          <div className="relative z-10 space-y-4">
            <Link
              to="/cinemaholic"
              className="inline-flex items-center gap-1.5 text-xs text-[#C18C55] hover:text-[#E5B982] transition-colors font-medium"
            >
              <ChevronLeft size={14} />
              <span>Back to Cinemaholic</span>
            </Link>

            <div className="flex items-center gap-3 pt-2">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#C18C55] to-[#8C5D2B] flex items-center justify-center shadow-lg shadow-[#C18C55]/30 text-[#14100E]">
                <Clapperboard size={22} className="text-[#14100E]" />
              </div>
              <div>
                <span className="font-serif text-2xl font-bold tracking-tight text-white">
                  CINEMA<span className="text-[#C18C55]">HOLIC</span>
                </span>
                <span className="block text-[10px] font-mono tracking-widest text-[#D4AF37] uppercase">
                  Audience Portal
                </span>
              </div>
            </div>
          </div>

          {/* Center Theatrical Message */}
          <div className="relative z-10 space-y-3.5 my-auto py-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C18C55]/20 border border-[#C18C55]/40 text-xs text-[#E5B982] font-mono">
              <Sparkles size={13} />
              <span>PREMIUM MOVIEGOER SUITE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white leading-tight">
              Your Seat is Waiting. <br />
              <span className="italic font-normal text-[#C18C55]">Experience Cinema in 3D.</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#A89D93] leading-relaxed">
              Step inside the auditorium with exact-seat screen sightlines, holographic tickets, Dolby Atmos sound simulations, and verified community reviews.
            </p>
          </div>

          {/* Bottom Badges */}
          <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-[#817366]">
            <div className="flex items-center gap-1.5">
              <Ticket size={14} className="text-[#C18C55]" />
              <span>3D Digital Passes</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Armchair size={14} className="text-[#10B981]" />
              <span>252 Stadium Seats</span>
            </div>
          </div>
        </div>

        {/* Right Side: Audience Sign In Form */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center bg-[#17120F]/95">
          <div className="max-w-md w-full mx-auto space-y-6">
            
            {/* Header */}
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-[#C18C55]/20 text-[#C18C55] border border-[#C18C55]/30 mb-2">
                Moviegoer Sign In
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">Welcome Back</h3>
              <p className="text-xs sm:text-sm text-[#817366] mt-1">
                Sign in to manage your tickets, watchlist, and verified ratings
              </p>
            </div>

            {/* Quick Demo Audience Personas */}
            <div className="p-3.5 rounded-2xl bg-white/5 border border-[#C18C55]/25">
              <div className="flex items-center gap-2 mb-2.5 text-xs font-mono font-semibold text-[#E5B982] tracking-wider uppercase">
                <UserCheck size={14} />
                <span>Instant Moviegoer Access:</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => handleDemoAudienceLogin('AARAV')}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-[#C18C55]/20 border border-white/10 hover:border-[#C18C55] text-left transition-all group"
                >
                  <p className="font-semibold text-white group-hover:text-[#E5B982]">Aarav Sharma</p>
                  <p className="text-[10px] text-[#C18C55] font-mono">VIP Premiere Club</p>
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoAudienceLogin('ROHAN')}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-[#C18C55]/20 border border-white/10 hover:border-[#C18C55] text-left transition-all group"
                >
                  <p className="font-semibold text-white group-hover:text-[#E5B982]">Rohan Verma</p>
                  <p className="text-[10px] text-[#A89D93] font-mono">Gold Class Recliner</p>
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoAudienceLogin('PRIYA')}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-[#C18C55]/20 border border-white/10 hover:border-[#C18C55] text-left transition-all group"
                >
                  <p className="font-semibold text-white group-hover:text-[#E5B982]">Priya K.</p>
                  <p className="text-[10px] text-[#D4AF37] font-mono">Director’s Cut Club</p>
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoAudienceLogin('ANANYA')}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-[#C18C55]/20 border border-white/10 hover:border-[#C18C55] text-left transition-all group"
                >
                  <p className="font-semibold text-white group-hover:text-[#E5B982]">Ananya D.</p>
                  <p className="text-[10px] text-[#34D399] font-mono">IMAX Enthusiast</p>
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-xl bg-[#E67E22]/15 border border-[#E67E22]/40 text-[#E67E22] text-xs flex items-center gap-2">
                <AlertCircle size={15} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#A89D93] mb-1.5 font-medium">
                  Email or Username
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 pl-11 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C18C55]/50 focus:border-[#C18C55] transition-all"
                    placeholder="audience@cinemaholic.com"
                  />
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#817366]" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-[#A89D93] font-medium">
                    Password
                  </label>
                  <span className="text-xs text-[#817366] font-mono">Default: Password@123</span>
                </div>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 pl-11 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C18C55]/50 focus:border-[#C18C55] transition-all"
                    placeholder="••••••••"
                  />
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#817366]" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 mt-2 rounded-xl bg-gradient-to-r from-[#C18C55] to-[#A87442] hover:from-[#D4AF37] hover:to-[#B58049] text-[#14100E] font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg shadow-[#C18C55]/20 hover:shadow-[#C18C55]/30 active:scale-[0.99] transition-all disabled:opacity-50"
              >
                {loading ? (
                  <span>Signing In...</span>
                ) : (
                  <>
                    <span>Enter Cinemaholic</span>
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </form>

            {/* Bottom Register & Switcher Links */}
            <div className="pt-2 flex flex-col items-center gap-2.5 text-xs text-[#817366]">
              <div>
                Don't have a moviegoer account?{' '}
                <Link to="/cinemaholic/signup" className="text-[#C18C55] font-semibold hover:text-[#E5B982] underline">
                  Join Cinemaholic Free
                </Link>
              </div>

              <div className="pt-2 border-t border-white/5 w-full text-center">
                <Link to="/" className="text-[11px] text-[#817366] hover:text-[#C18C55] transition-colors">
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
