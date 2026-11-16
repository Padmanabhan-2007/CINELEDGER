import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Sparkles,
  Ticket,
  Armchair,
  Star,
  ShieldCheck,
  ChevronRight,
  Play,
  Film,
  Building2,
  ThumbsUp,
  Flame,
  Clock,
  Compass,
} from 'lucide-react';
import { POSTER_COLLECTION } from '../data/posterManifest';

export default function CinemaholicLandingPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('ALL');

  // Featured Now Showing movies
  const nowShowing = POSTER_COLLECTION.slice(0, 8);
  const upcomingFilms = POSTER_COLLECTION.slice(8, 14);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/cinemaholic/movies?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/cinemaholic/movies');
    }
  };

  return (
    <div className="min-h-screen bg-[#F4EDE1] text-[#29211D]">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 border-b border-[#C18C55]/20 bg-gradient-to-b from-[#EFE6D7] to-[#F4EDE1]">
        {/* Subtle decorative glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#C18C55]/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-10">
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C18C55]/15 border border-[#C18C55]/30 text-xs font-semibold text-[#8C5D2B] mb-5 tracking-wide shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#C18C55]" />
              <span>THE NEXT-GEN THEATRICAL EXPERIENCE</span>
            </div>

            <h1 className="font-serif font-extrabold text-4xl sm:text-6xl text-[#29211D] tracking-tight leading-[1.1] mb-5">
              Book. Watch. Review. <br />
              <span className="text-[#C18C55]">All in One Place.</span>
            </h1>

            <p className="text-base sm:text-lg text-[#817366] leading-relaxed mb-8">
              Discover blockbusters, explore premium auditoriums, experience immersive 3D seat booking with real-time screen sightline simulation, and share authentic community ratings.
            </p>

            {/* Quick Search & Format Filter Bar */}
            <form
              onSubmit={handleSearchSubmit}
              className="bg-white/80 backdrop-blur-md p-2 rounded-2xl border border-[#C18C55]/30 shadow-xl flex flex-col sm:flex-row items-center gap-2 max-w-2xl mx-auto mb-6"
            >
              <div className="flex items-center gap-2.5 px-3 flex-1 w-full">
                <Search className="w-5 h-5 text-[#C18C55]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search movies, genres, directors (e.g. Kalki, Nolan, Dune)..."
                  className="w-full bg-transparent text-sm text-[#29211D] placeholder-[#817366] focus:outline-none py-1.5"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#C18C55] to-[#A87442] hover:from-[#B58049] hover:to-[#996535] text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Find Showtimes</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Action CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold">
              <Link
                to="/cinemaholic/book/1"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#29211D] text-[#FBF8F2] hover:bg-[#3D332F] shadow-md transition-all"
              >
                <Armchair className="w-4 h-4 text-[#C18C55]" />
                <span>Launch Live 3D Booking</span>
              </Link>
              <Link
                to="/cinemaholic/theatres"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/70 hover:bg-white text-[#29211D] border border-[#C18C55]/30 shadow-sm transition-all"
              >
                <Building2 className="w-4 h-4 text-[#C18C55]" />
                <span>Browse Theatres</span>
              </Link>
              <Link
                to="/cinemaholic/community"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/70 hover:bg-white text-[#29211D] border border-[#C18C55]/30 shadow-sm transition-all"
              >
                <Star className="w-4 h-4 text-[#C18C55]" />
                <span>5-Tier Reviews</span>
              </Link>
            </div>
          </div>

          {/* Interactive Poster Showcase Carousel Row */}
          <div className="relative mt-8 pt-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#CE5818]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#817366]">
                  Trending Theatrical Releases
                </span>
              </div>
              <Link
                to="/cinemaholic/movies"
                className="text-xs font-semibold text-[#C18C55] hover:text-[#8C5D2B] flex items-center gap-1"
              >
                <span>View All 20 Films</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
              {nowShowing.map((movie, idx) => (
                <div
                  key={movie.id}
                  onClick={() => navigate(`/cinemaholic/movies/${idx + 1}`)}
                  className="group cursor-pointer flex flex-col transition-all duration-200"
                >
                  <div className="relative aspect-[2/3] rounded-2xl overflow-hidden bg-[#29211D] shadow-md group-hover:shadow-2xl group-hover:-translate-y-1.5 transition-all duration-200 border border-white/20">
                    <img
                      src={movie.path}
                      alt={movie.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2.5">
                      <span className="inline-block px-2 py-0.5 rounded bg-[#C18C55] text-[#14100E] font-bold text-[9px] uppercase tracking-wider self-start mb-1">
                        Book 3D
                      </span>
                    </div>
                  </div>
                  <h3 className="font-semibold text-xs text-[#29211D] mt-2 truncate group-hover:text-[#C18C55] transition-colors">
                    {movie.title}
                  </h3>
                  <p className="text-[10px] text-[#817366] truncate">{movie.genre}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Feature Highlight: Live 3D Auditorium Seat Booking */}
      <section className="py-20 bg-[#29211D] text-[#FBF8F2] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Description */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C18C55]/20 border border-[#C18C55]/40 text-xs font-semibold text-[#C18C55]">
                <Armchair className="w-3.5 h-3.5" />
                <span>SIGNATURE INNOVATION</span>
              </div>

              <h2 className="font-serif font-bold text-3xl sm:text-4xl text-white leading-tight">
                Step Inside the Theatre Before You Book.
              </h2>

              <p className="text-sm text-[#F4EDE1]/80 leading-relaxed">
                Never get stuck with a neck-strain seat again. Cinemaholic’s proprietary WebGL auditorium simulation lets you inspect the entire cinema in 3D, select your seat, and instantly preview the exact screen angle, distance, and sightline.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-[#C18C55]/20 text-[#C18C55] flex items-center justify-center shrink-0 mt-0.5">
                    <Compass className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-white">Exact-Seat Virtual Eye Simulation</h3>
                    <p className="text-[11px] text-[#817366]">
                      Flies camera to seated human eye level (1.15m elevation) facing the curved screen center.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-[#34D399]/20 text-[#34D399] flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-white">10-Minute Concurrency-Safe Hold Lock</h3>
                    <p className="text-[11px] text-[#817366]">
                      Pessimistic database reservation locks your seats for 10 minutes while you checkout.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-[#C18C55]/20 text-[#C18C55] flex items-center justify-center shrink-0 mt-0.5">
                    <Ticket className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-white">3D Holographic Foil Digital Tickets</h3>
                    <p className="text-[11px] text-[#817366]">
                      Interactive 3D admission pass with gyroscope/mouse tilt, QR verification, and barcode.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  to="/cinemaholic/book/1"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#C18C55] to-[#A87442] hover:from-[#B58049] hover:to-[#996535] text-[#14100E] font-bold text-xs uppercase tracking-wider shadow-xl transition-all"
                >
                  <Armchair className="w-4 h-4" />
                  <span>Launch 3D Theatre Booking</span>
                </Link>
              </div>
            </div>

            {/* Right Interactive Preview Card */}
            <div className="lg:col-span-7">
              <div className="relative rounded-3xl overflow-hidden bg-[#161210] border border-[#C18C55]/40 shadow-2xl p-6">
                <div className="aspect-[16/10] rounded-2xl bg-gradient-to-b from-[#221B18] to-[#120F0D] border border-white/10 flex flex-col items-center justify-center p-8 text-center relative overflow-hidden group">
                  {/* Decorative screen curve representation */}
                  <div className="w-3/4 h-2 bg-gradient-to-r from-transparent via-[#C18C55] to-transparent rounded-full shadow-[0_0_25px_#C18C55] mb-8" />

                  <div className="space-y-4 max-w-sm z-10">
                    <div className="w-16 h-16 rounded-2xl bg-[#C18C55]/20 border border-[#C18C55] flex items-center justify-center mx-auto text-[#C18C55]">
                      <Armchair className="w-8 h-8" />
                    </div>
                    <h3 className="font-serif font-bold text-lg text-white">
                      Auditorium 1 — IMAX Laser
                    </h3>
                    <p className="text-xs text-[#817366]">
                      88 Ergonomic Seats • 3 Tiers (Classic, Prime, Recliner) • 16m Curved Silver Screen
                    </p>

                    <Link
                      to="/cinemaholic/book/1"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C18C55] hover:bg-[#B58049] text-[#14100E] font-bold text-xs uppercase tracking-wider shadow-md transition-all"
                    >
                      <span>Explore Seats in 3D</span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>

                  {/* Corner Telemetry Badges */}
                  <div className="absolute top-4 left-4 px-2.5 py-1 rounded-lg bg-black/60 border border-white/10 text-[10px] text-[#C18C55] font-mono">
                    FOV: 55° • Elevation: 1.15m
                  </div>
                  <div className="absolute bottom-4 right-4 px-2.5 py-1 rounded-lg bg-[#34D399]/20 border border-[#34D399]/40 text-[10px] text-[#34D399] font-mono">
                    Screen Distance: 13.5m
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Community 5-Tier Review System Showcase */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C18C55]/15 border border-[#C18C55]/30 text-xs font-semibold text-[#8C5D2B] mb-3">
            <Star className="w-3.5 h-3.5 text-[#C18C55]" />
            <span>COMMUNITY-VERIFIED CONSENSUS</span>
          </div>
          <h2 className="font-serif font-bold text-3xl text-[#29211D]">
            Cinema Reviews, Without The Noise.
          </h2>
          <p className="text-xs text-[#817366] mt-2">
            No confusing decimals or bots. Cinemaholic aggregates real moviegoer sentiment into 5 definitive theatrical tiers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
          {[
            { tier: 'PERFECTION', color: 'border-[#C18C55] bg-[#C18C55]/10 text-[#8C5D2B]', score: '5 / 5', desc: 'Masterpiece. Immediate big-screen requirement in premium format.' },
            { tier: 'GOOD', color: 'border-[#34D399] bg-[#34D399]/10 text-[#059669]', score: '4 / 5', desc: 'Compelling cinema. Great pacing, sound, and visual craft.' },
            { tier: 'AVERAGE', color: 'border-[#60A5FA] bg-[#60A5FA]/10 text-[#2563EB]', score: '3 / 5', desc: 'Decent watch. Has high points but notable pacing flaws.' },
            { tier: 'TIMEPASS', color: 'border-[#F59E0B] bg-[#F59E0B]/10 text-[#D97706]', score: '2 / 5', desc: 'Fun with friends. Grab popcorn, leave your brain at home.' },
            { tier: 'SKIP', color: 'border-[#EF4444] bg-[#EF4444]/10 text-[#DC2626]', score: '1 / 5', desc: 'Save your money. Wait for streaming or avoid altogether.' },
          ].map((item) => (
            <div
              key={item.tier}
              className={`p-5 rounded-2xl border ${item.color} shadow-sm flex flex-col justify-between`}
            >
              <div>
                <span className="text-[10px] font-bold tracking-widest uppercase opacity-75">
                  Rating Tier
                </span>
                <h3 className="font-serif font-bold text-lg mt-0.5">{item.tier}</h3>
                <span className="font-mono text-xs font-semibold block mt-1">{item.score}</span>
              </div>
              <p className="text-xs opacity-90 mt-4 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/cinemaholic/community"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-white/80 border border-[#C18C55]/30 text-xs font-semibold text-[#29211D] shadow-sm transition-all"
          >
            <span>Read Verified Buyer Reviews</span>
            <ChevronRight className="w-4 h-4 text-[#C18C55]" />
          </Link>
        </div>
      </section>

      {/* 4. Final Booking CTA */}
      <section className="py-16 bg-[#29211D] text-[#FBF8F2] border-t border-[#C18C55]/30">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-5">
          <h2 className="font-serif font-bold text-3xl sm:text-4xl text-white">
            Ready to Experience Cinema in 3D?
          </h2>
          <p className="text-sm text-[#817366] max-w-xl mx-auto">
            Choose your movie, pick your auditorium, preview your sightline, and secure your seats with instant confirmation.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/cinemaholic/movies"
              className="px-6 py-3.5 rounded-xl bg-[#C18C55] hover:bg-[#B58049] text-[#14100E] font-bold text-xs uppercase tracking-wider shadow-lg transition-all flex items-center gap-2"
            >
              <Ticket className="w-4 h-4" />
              <span>Explore All Movies</span>
            </Link>
            <Link
              to="/cinemaholic/book/1"
              className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs transition-all flex items-center gap-2"
            >
              <Armchair className="w-4 h-4 text-[#C18C55]" />
              <span>Try Live 3D Auditorium</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

