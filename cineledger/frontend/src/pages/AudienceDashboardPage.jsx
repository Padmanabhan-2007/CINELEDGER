import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Ticket,
  Star,
  Heart,
  Armchair,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  QrCode,
  ShieldCheck,
  ChevronRight,
  Trash2,
} from 'lucide-react';
import { audienceBookingService, audienceWatchlistService, communityReviewService } from '../services/api';
import { POSTER_COLLECTION } from '../data/posterManifest';
import DigitalTicket3D from '../components/DigitalTicket3D';
import GoldenEmbersCanvas from '../components/3d/particles/GoldenEmbersCanvas';
import { useAuth } from '../context/AuthContext';

export default function AudienceDashboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('bookings'); // 'bookings' | 'reviews' | 'watchlist'
  const [activeTicketModal, setActiveTicketModal] = useState(null);

  // Data States
  const [bookings, setBookings] = useState([
    {
      id: 1,
      bookingReference: 'CLG-892144',
      filmTitle: 'Kalki 2898 AD',
      cinemaName: 'PVR INOX Palladium Lower Parel',
      screenName: 'Screen 1 — IMAX Laser',
      showDateTime: 'Today, 06:45 PM',
      seats: ['E6', 'E7'],
      totalAmount: 856.0,
      posterUrl: '/assets/posters/kalki.png',
      qrCode: 'CLG-892144-IMAX',
      status: 'CONFIRMED',
    },
    {
      id: 2,
      bookingReference: 'CLG-315890',
      filmTitle: 'Interstellar',
      cinemaName: 'Cinepolis Nexus Mall Koramangala',
      screenName: 'Screen 2 — Dolby Atmos',
      showDateTime: 'Nov 16, 03:30 PM',
      seats: ['F10'],
      totalAmount: 448.4,
      posterUrl: '/assets/posters/interstellar.png',
      qrCode: 'CLG-315890-ATMOS',
      status: 'CONFIRMED',
    },
  ]);

  const [reviews, setReviews] = useState([
    {
      id: 1,
      filmTitle: 'Kalki 2898 AD',
      rating: 'PERFECTION',
      title: 'A towering visual benchmark for Indian cinema',
      content: 'Watched in IMAX 4K Dual Laser at Palladium. The world-building in Kasi and the Complex is magnificent.',
      helpfulCount: 52,
      createdAt: 'Yesterday',
    },
  ]);

  const [watchlist, setWatchlist] = useState([
    POSTER_COLLECTION[0], // Interstellar
    POSTER_COLLECTION[3], // Dune
    POSTER_COLLECTION[4], // Dune 2
  ]);

  useEffect(() => {
    async function loadData() {
      try {
        const [myBookings, myReviews, myWatchlist] = await Promise.all([
          audienceBookingService.getMyBookings(),
          communityReviewService.getMyReviews(),
          audienceWatchlistService.getAll(),
        ]);
        if (Array.isArray(myBookings) && myBookings.length > 0) setBookings(myBookings);
        if (Array.isArray(myReviews) && myReviews.length > 0) setReviews(myReviews);
      } catch (err) {
        console.warn('Dashboard fetch notice:', err);
      }
    }
    loadData();
  }, []);

  const handleCancelBooking = async (bookingRef) => {
    if (!window.confirm(`Are you sure you want to cancel booking ${bookingRef}?`)) return;
    try {
      await audienceBookingService.cancelBooking(bookingRef);
      setBookings((prev) => prev.filter((b) => b.bookingReference !== bookingRef));
    } catch (err) {
      setBookings((prev) => prev.filter((b) => b.bookingReference !== bookingRef));
    }
  };

  const handleRemoveWatchlist = async (filmId) => {
    try {
      await audienceWatchlistService.remove(filmId);
      setWatchlist((prev) => prev.filter((_, idx) => idx + 1 !== filmId));
    } catch (err) {
      setWatchlist((prev) => prev.filter((_, idx) => idx + 1 !== filmId));
    }
  };

  return (
    <div className="min-h-screen bg-[#F4EDE1] text-[#29211D] py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        {/* Profile Card Header */}
        <div className="bg-[#29211D] text-[#FBF8F2] rounded-3xl p-6 sm:p-8 border border-[#C18C55]/30 shadow-xl mb-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#C18C55] to-[#E5B582] flex items-center justify-center text-[#29211D] font-serif font-black text-2xl shadow-md">
              {user?.fullName?.charAt(0) || 'A'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif font-bold text-2xl text-white">
                  {user?.fullName || 'Audience Member'}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#C18C55] text-[#14100E]">
                  ROLE_AUDIENCE
                </span>
              </div>
              <p className="text-xs text-[#817366] mt-0.5">
                {user?.email || 'audience@cinemaholic.com'} • CineLedger 2.0 Ecosystem
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/cinemaholic/movies"
              className="px-4 py-2.5 rounded-xl bg-[#C18C55] hover:bg-[#B58049] text-[#14100E] text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
            >
              <Ticket className="w-4 h-4" />
              <span>Book Tickets</span>
            </Link>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 border-b border-[#C18C55]/20 pb-4 mb-6">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'bookings'
                ? 'bg-[#29211D] text-white shadow-md'
                : 'bg-white/60 text-[#817366] hover:bg-white hover:text-[#29211D]'
            }`}
          >
            <Ticket className="w-4 h-4 text-[#C18C55]" />
            <span>My Bookings ({bookings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'reviews'
                ? 'bg-[#29211D] text-white shadow-md'
                : 'bg-white/60 text-[#817366] hover:bg-white hover:text-[#29211D]'
            }`}
          >
            <Star className="w-4 h-4 text-[#C18C55]" />
            <span>My Reviews ({reviews.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('watchlist')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'watchlist'
                ? 'bg-[#29211D] text-white shadow-md'
                : 'bg-white/60 text-[#817366] hover:bg-white hover:text-[#29211D]'
            }`}
          >
            <Heart className="w-4 h-4 text-[#EF4444]" />
            <span>Watchlist ({watchlist.length})</span>
          </button>
        </div>

        {/* Tab 1: Bookings */}
        {activeTab === 'bookings' && (
          <div className="space-y-4">
            {bookings.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-[#C18C55]/20 p-8 text-[#817366]">
                <Armchair className="w-10 h-10 mx-auto text-[#C18C55] opacity-40 mb-2" />
                <p className="text-sm font-semibold text-[#29211D]">No bookings yet</p>
                <p className="text-xs mt-1">Explore our 20 curated master titles and select your seats in 3D.</p>
                <Link
                  to="/cinemaholic/movies"
                  className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#C18C55] text-[#14100E] text-xs font-bold"
                >
                  Book Tickets
                </Link>
              </div>
            ) : (
              bookings.map((b) => (
                <div
                  key={b.id || b.bookingReference}
                  className="bg-white rounded-3xl p-6 border border-[#C18C55]/20 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={b.posterUrl || '/assets/posters/kalki.png'}
                      alt={b.filmTitle}
                      className="w-16 h-24 object-cover rounded-xl shadow-sm border border-black/10 shrink-0"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#C18C55]">
                          {b.bookingReference}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#34D399]/20 text-[#059669]">
                          CONFIRMED
                        </span>
                      </div>
                      <h2 className="font-serif font-bold text-lg text-[#29211D]">{b.filmTitle}</h2>
                      <p className="text-xs text-[#817366]">
                        {b.cinemaName} • {b.screenName}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-[#817366] pt-1">
                        <span>Show: {b.showDateTime}</span>
                        <span>•</span>
                        <span>Seats: <strong className="text-[#29211D]">{Array.isArray(b.seats) ? b.seats.join(', ') : b.seats}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end md:self-auto">
                    <button
                      onClick={() => setActiveTicketModal(b)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#29211D] hover:bg-[#3D332F] text-white text-xs font-bold transition-all shadow-sm"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#C18C55]" />
                      <span>View 3D Holographic Ticket</span>
                    </button>

                    <button
                      onClick={() => handleCancelBooking(b.bookingReference)}
                      className="p-2 rounded-xl text-[#817366] hover:text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors"
                      title="Cancel Booking"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: Reviews */}
        {activeTab === 'reviews' && (
          <div className="space-y-4">
            {reviews.map((r) => (
              <div
                key={r.id}
                className="bg-white rounded-3xl p-6 border border-[#C18C55]/20 shadow-sm space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-[#29211D]">{r.filmTitle}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-[#C18C55]/20 text-[#8C5D2B] border border-[#C18C55]">
                    {r.rating}
                  </span>
                </div>
                <h3 className="font-semibold text-xs text-[#29211D]">{r.title}</h3>
                <p className="text-xs text-[#817366]">{r.content}</p>
                <div className="pt-2 text-[11px] text-[#817366] flex justify-between">
                  <span>{r.createdAt}</span>
                  <span>{r.helpfulCount || 0} users found this helpful</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Watchlist */}
        {activeTab === 'watchlist' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {watchlist.map((m, idx) => (
              <div
                key={m.id}
                className="bg-white rounded-3xl overflow-hidden border border-[#C18C55]/20 shadow-sm flex flex-col justify-between"
              >
                <div className="relative aspect-[2/3]">
                  <img src={m.path} alt={m.title} className="w-full h-full object-cover" />
                  <button
                    onClick={() => handleRemoveWatchlist(idx + 1)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-black/60 text-white hover:text-[#EF4444]"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-serif font-bold text-sm text-[#29211D]">{m.title}</h3>
                    <p className="text-[11px] text-[#817366]">{m.genre}</p>
                  </div>
                  <Link
                    to={`/cinemaholic/book/${idx + 1}`}
                    className="px-3 py-1.5 rounded-xl bg-[#29211D] text-white text-xs font-bold"
                  >
                    Book
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3D Ticket Modal with Golden Embers Background */}
      {activeTicketModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fadeIn overflow-y-auto">
          <GoldenEmbersCanvas particleCount={40} />
          <div className="relative z-10 max-w-md w-full flex flex-col items-center">
            <DigitalTicket3D
              booking={activeTicketModal}
              onClose={() => setActiveTicketModal(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

