import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Clapperboard, ArrowRight, ShieldCheck, Sparkles, Menu, X, Film } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { isAuthenticated, user } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: 'Platform', href: '#platform' },
    { label: 'Capabilities', href: '#capabilities' },
    { label: 'Workflow', href: '#how-it-works' },
    { label: 'Intelligence', href: '#financial-intelligence' },
    { label: 'Security', href: '#security' },
  ];

  return (
    <header className="fixed top-0 inset-x-0 z-50 flex justify-center px-4 sm:px-6 pt-3 sm:pt-4 transition-all duration-300">
      <nav
        className={`w-full max-w-7xl rounded-2xl px-5 sm:px-7 h-16 sm:h-18 flex items-center justify-between transition-all duration-300 ${
          scrolled
            ? 'morph-glass-float bg-[#FBF8F2]/90 shadow-lg border-[rgba(129,115,102,0.22)]'
            : 'bg-[#FBF8F2]/75 backdrop-blur-md border border-[rgba(129,115,102,0.18)] shadow-sm'
        }`}
      >
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group text-decoration-none">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#CC9861] to-[#C18C55] flex items-center justify-center shadow-md shadow-[#C18C55]/25 group-hover:scale-105 transition-transform">
            <Clapperboard size={18} className="text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif font-extrabold text-lg sm:text-xl text-[#29211D] tracking-wide">
              Cine<span className="text-[#C18C55]">Ledger</span>
            </span>
            <span className="text-[9px] uppercase font-mono tracking-widest text-[#817366] -mt-1 hidden sm:inline">
              CINEMATIC FINTECH
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-7 text-xs font-semibold uppercase tracking-wider text-[#817366]">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="hover:text-[#C18C55] transition-colors"
            >
              {link.label}
            </a>
          ))}
          <Link
            to="/cinemaholic"
            className="text-[#C18C55] hover:text-[#A57340] font-mono normal-case tracking-normal flex items-center gap-1"
          >
            <Film size={13} />
            <span>Cinemaholic Portal</span>
          </Link>
          <Link
            to="/industry/login"
            className="text-[#657B65] hover:text-[#4B5E4B] font-mono normal-case tracking-normal flex items-center gap-1"
          >
            <ShieldCheck size={13} />
            <span>Industry Portal</span>
          </Link>
        </div>

        {/* Right CTA Actions: Dual Portals */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Cinemaholic Portal CTA */}
          <Link
            to="/cinemaholic"
            className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-[#29211D] to-[#1C1613] text-white hover:text-[#C18C55] text-xs font-semibold shadow-sm hover:shadow transition-all border border-[#C18C55]/30"
          >
            <Film size={13} className="text-[#C18C55]" />
            <span>Cinemaholic</span>
          </Link>

          {/* Industry Portal CTA */}
          <Link
            to={isAuthenticated ? "/app/dashboard" : "/industry/login"}
            className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-[#C18C55] to-[#996D3D] text-white text-xs font-semibold shadow-sm hover:shadow transition-all"
          >
            <ShieldCheck size={13} />
            <span>{isAuthenticated ? 'Industry' : 'Industry Sign In'}</span>
            <ArrowRight size={12} />
          </Link>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-[#29211D] hover:bg-[#EDE3D2] transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-20 inset-x-4 sm:inset-x-6 p-5 rounded-2xl bg-[#FBF8F2] border border-[rgba(129,115,102,0.22)] shadow-xl flex flex-col gap-3 text-sm font-semibold text-[#29211D]">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded-lg hover:bg-[#F4EDE1] transition-colors"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-2 border-t border-[rgba(129,115,102,0.18)] flex gap-2">
            <Link to="/login" className="btn btn-secondary text-xs flex-1">
              Sign In
            </Link>
            <Link to="/app/dashboard" className="btn btn-primary text-xs flex-1">
              Workbench
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
