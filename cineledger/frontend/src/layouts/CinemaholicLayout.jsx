import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import CinemaholicNavbar from '../components/CinemaholicNavbar';
import { Clapperboard, Sparkles, ShieldCheck, Heart } from 'lucide-react';

export default function CinemaholicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F4EDE1] text-[#29211D] font-sans antialiased selection:bg-[#C18C55]/30 selection:text-[#29211D]">
      {/* Translucent Floating Navigation */}
      <CinemaholicNavbar />

      {/* Main Cinemaholic Viewport */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Cinemaholic Footer */}
      <footer className="bg-[#29211D] text-[#FBF8F2] pt-14 pb-8 border-t border-[#C18C55]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-white/10">
            {/* Col 1: Brand & Tagline */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-9 h-9 rounded-lg bg-[#C18C55] flex items-center justify-center text-[#29211D] font-bold shadow-md">
                  <Clapperboard className="w-5 h-5" />
                </div>
                <span className="font-serif font-bold text-xl tracking-tight text-white">
                  CINEMA<span className="text-[#C18C55]">HOLIC</span>
                </span>
              </div>
              <p className="text-xs text-[#817366] leading-relaxed mb-4">
                The next-generation cinema ecosystem. Real-time 3D auditorium booking, exact-seat perspective camera simulation, and community-verified ratings.
              </p>
              <div className="flex items-center gap-2 text-xs text-[#C18C55]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Powered by CineLedger FinTech</span>
              </div>
            </div>

            {/* Col 2: Experiences */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-[#C18C55] mb-3">Experiences</h4>
              <ul className="space-y-2 text-xs text-[#F4EDE1]/80">
                <li><Link to="/cinemaholic/movies" className="hover:text-white transition-colors">IMAX 4K Dual Laser</Link></li>
                <li><Link to="/cinemaholic/movies" className="hover:text-white transition-colors">Dolby Atmos 12-Channel</Link></li>
                <li><Link to="/cinemaholic/movies" className="hover:text-white transition-colors">3D Laser Projection</Link></li>
                <li><Link to="/cinemaholic/theatres" className="hover:text-white transition-colors">Director’s Cut VIP Lounges</Link></li>
                <li><Link to="/cinemaholic/movies" className="hover:text-white transition-colors">Recliner Stadium Tier</Link></li>
              </ul>
            </div>

            {/* Col 3: Community */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-[#C18C55] mb-3">Community</h4>
              <ul className="space-y-2 text-xs text-[#F4EDE1]/80">
                <li><Link to="/cinemaholic/community" className="hover:text-white transition-colors">5-Tier Movie Ratings</Link></li>
                <li><Link to="/cinemaholic/community" className="hover:text-white transition-colors">Verified Buyer Reviews</Link></li>
                <li><Link to="/cinemaholic/dashboard" className="hover:text-white transition-colors">3D Digital Holographic Tickets</Link></li>
                <li><Link to="/cinemaholic/dashboard" className="hover:text-white transition-colors">Personal Watchlist</Link></li>
              </ul>
            </div>

            {/* Col 4: VIP Moviegoer Club & Account */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-[#C18C55] mb-3">VIP Moviegoer Suite</h4>
              <p className="text-xs text-[#817366] mb-3 leading-relaxed">
                Join the Cinemaholic Premiere Club for zero booking fee surcharges and priority IMAX seat reservation access.
              </p>
              <div className="flex flex-col gap-2">
                <Link
                  to="/cinemaholic/login"
                  className="inline-flex items-center justify-between px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-[#C18C55]/40 text-xs font-medium text-[#F4EDE1] transition-all"
                >
                  <span>Sign In to Cinemaholic</span>
                  <span className="text-[#C18C55]">→</span>
                </Link>
                <Link
                  to="/"
                  className="text-[11px] text-[#817366] hover:text-[#C18C55] transition-colors"
                >
                  ← Return to CineLedger Gateway
                </Link>
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#817366]">
            <p>© 2026 CineLedger Systems. All rights reserved. Cinemaholic is a registered trademark.</p>
            <div className="flex items-center gap-4">
              <span>Warm Luxury Modern Morphism</span>
              <span>•</span>
              <span>WebGL Spatial Coordinates</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

