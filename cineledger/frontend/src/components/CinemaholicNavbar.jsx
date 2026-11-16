import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Film, Clapperboard, MapPin, MessageSquare, Ticket, User, ArrowRight, ShieldCheck, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function CinemaholicNavbar() {
  const location = useLocation();
  const { user, logout } = useAuth();

  const navLinks = [
    { label: 'Movies', path: '/cinemaholic/movies', icon: Film },
    { label: 'Theatres', path: '/cinemaholic/theatres', icon: MapPin },
    { label: 'Community', path: '/cinemaholic/community', icon: MessageSquare },
    { label: 'My Bookings', path: '/cinemaholic/dashboard', icon: Ticket },
  ];

  return (
    <header className="sticky top-0 z-50 px-4 sm:px-8 py-3 bg-[#FBF8F2]/90 backdrop-blur-md border-b border-[#C18C55]/20 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand */}
        <Link to="/cinemaholic" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C18C55] to-[#29211D] flex items-center justify-center text-[#FBF8F2] shadow-md group-hover:scale-105 transition-transform duration-300">
            <Clapperboard className="w-5 h-5 text-[#F4EDE1]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-serif font-bold text-xl tracking-tight text-[#29211D]">
                CINEMA<span className="text-[#C18C55]">HOLIC</span>
              </span>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-[#C18C55]/15 text-[#C18C55] border border-[#C18C55]/30">
                3D Live
              </span>
            </div>
            <p className="text-[11px] text-[#817366] -mt-0.5 hidden sm:block">
              Book. Watch. Review. Experience.
            </p>
          </div>
        </Link>

        {/* Navigation items */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname.startsWith(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-[#C18C55] text-white shadow-sm'
                    : 'text-[#29211D] hover:bg-[#F4EDE1] hover:text-[#C18C55]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#817366]'}`} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Action Right Area */}
        <div className="flex items-center gap-3">
          {/* Discrete Master Gateway Link */}
          <Link
            to="/"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#817366]/25 text-xs font-medium text-[#817366] hover:text-[#29211D] hover:border-[#C18C55] hover:bg-white/60 transition-colors"
            title="Return to CineLedger Gateway"
          >
            <span>← Gateway</span>
          </Link>

          {user ? (
            <div className="flex items-center gap-2">
              <Link
                to="/cinemaholic/dashboard"
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-[#C18C55]/30 hover:border-[#C18C55] text-sm text-[#29211D] shadow-sm transition-all"
              >
                <div className="w-6 h-6 rounded-full bg-[#C18C55]/20 text-[#C18C55] flex items-center justify-center font-bold text-xs">
                  {user.fullName ? user.fullName[0].toUpperCase() : 'U'}
                </div>
                <span className="font-medium hidden sm:inline">{user.fullName || 'Audience'}</span>
              </Link>
              <button
                onClick={logout}
                className="px-3 py-2 text-xs font-medium text-[#817366] hover:text-[#B8755C] transition-colors"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/cinemaholic/login"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#C18C55]/40 hover:border-[#C18C55] hover:bg-white/60 text-[#29211D] font-medium text-xs sm:text-sm transition-all"
              >
                <User className="w-4 h-4 text-[#C18C55]" />
                <span>Sign In</span>
              </Link>
              <Link
                to="/cinemaholic/signup"
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#C18C55] to-[#A87442] hover:from-[#B58049] hover:to-[#996535] text-white font-medium text-xs sm:text-sm shadow-md hover:shadow-lg transition-all"
              >
                <Ticket className="w-3.5 h-3.5" />
                <span>Join Free</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

