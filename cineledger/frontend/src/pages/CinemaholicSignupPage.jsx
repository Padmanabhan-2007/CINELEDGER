import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Clapperboard, Lock, Mail, User, Phone, ArrowRight, AlertCircle, Sparkles, Film, Ticket, Armchair, ChevronLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import CinemaPosterScene from '../components/3d/CinemaPosterScene';

export default function CinemaholicSignupPage() {
  const { cinemaholicSignup } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    preferredFormat: 'IMAX 4K Dual Laser',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await cinemaholicSignup({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        phone: formData.phone,
        preferredFormat: formData.preferredFormat,
        membershipTier: 'VIP Premiere Club',
      });
      navigate('/cinemaholic/movies');
    } catch (err) {
      setError(err?.message || 'Failed to create your Cinemaholic account. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 sm:p-8 bg-[#14100E] text-[#F4EDE1] overflow-hidden select-none">
      {/* Ambient warm theatrical glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#C18C55]/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#E5B982]/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Glassmorphic Container */}
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 rounded-3xl overflow-hidden border border-[#C18C55]/30 shadow-[0_24px_80px_rgba(0,0,0,0.8)] bg-[#1C1714]/85 backdrop-blur-2xl z-10">
        
        {/* Left Side: Cinemaholic Perks Showcase */}
        <div className="lg:col-span-5 relative min-h-[360px] lg:min-h-[680px] overflow-hidden bg-gradient-to-br from-[#291F18] via-[#1E1713] to-[#120E0C] flex flex-col justify-between p-8 sm:p-10 text-[#F4EDE1]">
          {/* 3D Poster Background */}
          <div className="absolute inset-0 opacity-40 pointer-events-auto">
            <CinemaPosterScene compact={true} />
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-[#14100E] via-transparent to-[#14100E]/80 pointer-events-none" />

          {/* Top Brand */}
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
                  VIP Moviegoer Network
                </span>
              </div>
            </div>
          </div>

          {/* Center Text & Perks */}
          <div className="relative z-10 space-y-4 my-auto py-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C18C55]/20 border border-[#C18C55]/40 text-xs text-[#E5B982] font-mono">
              <Sparkles size={13} />
              <span>JOIN THE AUDIENCE SUITE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white leading-tight">
              Unlock the Future of Cinema Booking.
            </h2>
            <ul className="space-y-2.5 text-xs text-[#A89D93]">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                <span>Real-time 3D & 2D 252-seat auditorium spatial booking</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C18C55]" />
                <span>Exact eye-level screen distance and viewing angle preview</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E5B982]" />
                <span>Holographic 3D digital collectible wallet passes</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#34D399]" />
                <span>5-Tier verified buyer community ratings</span>
              </li>
            </ul>
          </div>

          {/* Bottom Badges */}
          <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-[#817366]">
            <div className="flex items-center gap-1.5">
              <Ticket size={14} className="text-[#C18C55]" />
              <span>Free Membership</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Armchair size={14} className="text-[#10B981]" />
              <span>Zero Convenience Lock</span>
            </div>
          </div>
        </div>

        {/* Right Side: Registration Form */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center bg-[#17120F]/95">
          <div className="max-w-md w-full mx-auto space-y-5">
            
            {/* Header */}
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-[#C18C55]/20 text-[#C18C55] border border-[#C18C55]/30 mb-2">
                Audience Registration
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">Create Your Account</h3>
              <p className="text-xs sm:text-sm text-[#817366] mt-1">
                Join thousands of film lovers reserving premier cinema sightlines
              </p>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="p-3 rounded-xl bg-[#E67E22]/15 border border-[#E67E22]/40 text-[#E67E22] text-xs flex items-center gap-2">
                <AlertCircle size={15} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#A89D93] mb-1 font-medium">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-4 py-2.5 pl-11 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C18C55]/50 focus:border-[#C18C55] transition-all"
                    placeholder="Rohan Verma"
                  />
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#817366]" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#A89D93] mb-1 font-medium">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2.5 pl-10 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C18C55]/50 focus:border-[#C18C55] transition-all"
                      placeholder="rohan@example.com"
                    />
                    <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#817366]" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#A89D93] mb-1 font-medium">
                    Mobile Number
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2.5 pl-10 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C18C55]/50 focus:border-[#C18C55] transition-all"
                      placeholder="9876543210"
                    />
                    <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#817366]" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#A89D93] mb-1 font-medium">
                  Preferred Cinema Experience
                </label>
                <select
                  value={formData.preferredFormat}
                  onChange={(e) => setFormData({ ...formData, preferredFormat: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#221B17] border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C18C55]/50 focus:border-[#C18C55] transition-all"
                >
                  <option value="IMAX 4K Dual Laser">IMAX 4K Dual Laser Giant Screen</option>
                  <option value="Dolby Atmos 12-Channel">Dolby Atmos 12-Channel Immersive Sound</option>
                  <option value="PVR Royale Recliner Lounge">PVR Royale Recliner Lounge (VIP Suites)</option>
                  <option value="4DX Motion Sensory">4DX Motion & Atmospheric FX</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#A89D93] mb-1 font-medium">
                  Create Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-2.5 pl-11 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C18C55]/50 focus:border-[#C18C55] transition-all"
                    placeholder="••••••••"
                  />
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#817366]" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 mt-1 rounded-xl bg-gradient-to-r from-[#C18C55] to-[#A87442] hover:from-[#D4AF37] hover:to-[#B58049] text-[#14100E] font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg shadow-[#C18C55]/20 hover:shadow-[#C18C55]/30 active:scale-[0.99] transition-all disabled:opacity-50"
              >
                {loading ? (
                  <span>Creating Your VIP Profile...</span>
                ) : (
                  <>
                    <span>Complete Registration</span>
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </form>

            {/* Bottom Login Link */}
            <div className="pt-2 flex flex-col items-center gap-2 text-xs text-[#817366]">
              <div>
                Already have a moviegoer account?{' '}
                <Link to="/cinemaholic/login" className="text-[#C18C55] font-semibold hover:text-[#E5B982] underline">
                  Sign in here
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
