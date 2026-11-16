import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Film,
  Star,
  ThumbsUp,
  Armchair,
  Share2,
  Heart,
  Sparkles,
  CheckCircle2,
  Building2,
  ChevronRight,
  MessageSquare,
} from 'lucide-react';
import { POSTER_COLLECTION } from '../data/posterManifest';
import { communityReviewService, audienceWatchlistService } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function MovieDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const filmIdx = Math.max(0, parseInt(id, 10) - 1 || 0);
  const film = POSTER_COLLECTION[filmIdx % POSTER_COLLECTION.length];

  const [inWatchlist, setInWatchlist] = useState(false);
  const [distribution, setDistribution] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState('PERFECTION');
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewBody, setReviewBody] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Load reviews & distribution
  useEffect(() => {
    let mounted = true;
    async function loadCommunityData() {
      try {
        const [dist, revs] = await Promise.all([
          communityReviewService.getDistribution(id),
          communityReviewService.getByFilm(id),
        ]);
        if (!mounted) return;
        setDistribution(dist);
        setReviews(revs || []);
      } catch (err) {
        console.warn('Reviews API notice:', err);
        // Fallback default consensus scorecard
        setDistribution({
          totalReviews: 124,
          ratingScore: 9.2,
          consensusRating: 'PERFECTION',
          perfectionPercent: 68,
          goodPercent: 22,
          averagePercent: 7,
          timepassPercent: 2,
          skipPercent: 1,
        });
        setReviews([
          {
            id: 1,
            authorName: 'Arjun Mehta',
            rating: 'PERFECTION',
            verifiedBuyer: true,
            title: 'An absolute audio-visual masterclass in IMAX Laser',
            content: 'The scale, sound design, and cinematography make this a must-watch in a premium auditorium. Recliner seats in Row E were phenomenal.',
            helpfulCount: 38,
            createdAt: '2 days ago',
          },
          {
            id: 2,
            authorName: 'Priya Sharma',
            rating: 'GOOD',
            verifiedBuyer: true,
            title: 'Great cinematic ambition with jaw-dropping set pieces',
            content: 'Loved the visual effects and the world-building. Pacing dips slightly in the middle hour, but the climax completely delivers.',
            helpfulCount: 19,
            createdAt: '4 days ago',
          },
        ]);
      }
    }

    loadCommunityData();
    return () => {
      mounted = false;
    };
  }, [id]);

  const handleVoteHelpful = async (reviewId) => {
    try {
      await communityReviewService.voteHelpful(reviewId);
      setReviews((prev) =>
        prev.map((r) => (r.id === reviewId ? { ...r, helpfulCount: (r.helpfulCount || 0) + 1 } : r))
      );
    } catch (err) {
      setReviews((prev) =>
        prev.map((r) => (r.id === reviewId ? { ...r, helpfulCount: (r.helpfulCount || 0) + 1 } : r))
      );
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      setSubmittingReview(true);
      const payload = {
        filmId: parseInt(id, 10),
        rating: selectedRating,
        title: reviewTitle,
        content: reviewBody,
      };
      await communityReviewService.createReview(payload);
      setReviews((prev) => [
        {
          id: Date.now(),
          authorName: user?.fullName || 'You (Audience)',
          rating: selectedRating,
          verifiedBuyer: true,
          title: reviewTitle,
          content: reviewBody,
          helpfulCount: 0,
          createdAt: 'Just now',
        },
        ...prev,
      ]);
      setIsReviewModalOpen(false);
      setReviewTitle('');
      setReviewBody('');
    } catch (err) {
      console.error('Failed to submit review:', err);
      // Fallback local update
      setReviews((prev) => [
        {
          id: Date.now(),
          authorName: user?.fullName || 'You (Audience)',
          rating: selectedRating,
          verifiedBuyer: true,
          title: reviewTitle,
          content: reviewBody,
          helpfulCount: 0,
          createdAt: 'Just now',
        },
        ...prev,
      ]);
      setIsReviewModalOpen(false);
      setReviewTitle('');
      setReviewBody('');
    } finally {
      setSubmittingReview(false);
    }
  };

  // Mock Theatres & Showtimes
  const partnerTheatres = [
    {
      id: 1,
      cinemaName: 'PVR INOX Palladium Lower Parel',
      city: 'Mumbai',
      screen: 'Screen 1 — IMAX Laser',
      format: 'IMAX 4K Dual Laser',
      showtimes: [
        { id: 1, time: '10:30 AM', price: 350 },
        { id: 2, time: '02:15 PM', price: 420 },
        { id: 3, time: '06:45 PM', price: 550 },
        { id: 4, time: '10:30 PM', price: 480 },
      ],
    },
    {
      id: 2,
      cinemaName: 'Cinepolis Nexus Mall Koramangala',
      city: 'Bengaluru',
      screen: 'Screen 2 — Dolby Atmos',
      format: 'Dolby Atmos 12-Channel',
      showtimes: [
        { id: 5, time: '11:00 AM', price: 320 },
        { id: 6, time: '03:30 PM', price: 380 },
        { id: 7, time: '07:15 PM', price: 490 },
      ],
    },
    {
      id: 3,
      cinemaName: 'PVR Director’s Cut Ambience Mall',
      city: 'Delhi NCR',
      screen: 'Screen 1 — VIP Recliner Suite',
      format: 'Director’s Cut Laser',
      showtimes: [
        { id: 8, time: '01:00 PM', price: 650 },
        { id: 9, time: '05:45 PM', price: 750 },
        { id: 10, time: '09:30 PM', price: 700 },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#F4EDE1] text-[#29211D] pb-20">
      {/* 1. Backdrop Hero Banner */}
      <div className="relative bg-[#1C1714] text-[#FBF8F2] pt-8 pb-16 border-b border-[#C18C55]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#C18C55] hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Movies</span>
          </button>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Poster Thumbnail */}
            <div className="md:col-span-4 lg:col-span-3">
              <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/20 aspect-[2/3] bg-black">
                <img
                  src={film.path}
                  alt={film.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Film Overview */}
            <div className="md:col-span-8 lg:col-span-9 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-[#C18C55] text-[#14100E] text-xs font-bold uppercase tracking-wider">
                  Now Showing
                </span>
                <span className="px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold">
                  IMAX 4K Dual Laser
                </span>
                <span className="px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold">
                  {film.rating || 'U/A 13+'}
                </span>
              </div>

              <h1 className="font-serif font-bold text-3xl sm:text-5xl text-white tracking-tight">
                {film.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs text-[#817366]">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#C18C55]" />
                  <span>Release: {film.year}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#C18C55]" />
                  <span>Runtime: 2 hrs 48 mins</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <Film className="w-4 h-4 text-[#C18C55]" />
                  <span>Genre: {film.genre}</span>
                </div>
              </div>

              <p className="text-sm text-[#F4EDE1]/85 leading-relaxed max-w-3xl pt-2">
                Directed by <strong>{film.director}</strong>. Set in an expansive cinematic universe, this theatrical masterwork combines breathtaking cinematography, heart-pounding auditory soundscapes, and tour-de-force performances designed exclusively for modern auditoriums.
              </p>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-wrap items-center gap-3">
                <Link
                  to={`/cinemaholic/book/${id}`}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#C18C55] to-[#A87442] hover:from-[#B58049] hover:to-[#996535] text-[#14100E] font-bold text-xs uppercase tracking-wider shadow-lg transition-all"
                >
                  <Armchair className="w-4 h-4" />
                  <span>Book Live 3D Seats</span>
                </Link>

                <button
                  onClick={() => setIsReviewModalOpen(true)}
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-all border border-white/10"
                >
                  <Star className="w-4 h-4 text-[#C18C55]" />
                  <span>Write a Review</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Body: Showtimes & 5-Tier Consensus Breakdown */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Available Theatres & Showtimes (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#C18C55]/20">
            <div>
              <h2 className="font-serif font-bold text-2xl text-[#29211D]">
                Select Theatrical Showtime
              </h2>
              <p className="text-xs text-[#817366] mt-0.5">
                Choose an auditorium to launch the live 3D seat preview workbench.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {partnerTheatres.map((theatre) => (
              <div
                key={theatre.id}
                className="bg-white rounded-3xl p-6 border border-[#C18C55]/20 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div>
                    <h3 className="font-serif font-bold text-base text-[#29211D]">
                      {theatre.cinemaName}
                    </h3>
                    <p className="text-xs text-[#817366]">
                      {theatre.city} • <span className="font-medium text-[#C18C55]">{theatre.screen}</span>
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#C18C55]/15 text-[#8C5D2B] border border-[#C18C55]/30">
                    {theatre.format}
                  </span>
                </div>

                {/* Showtimes Pills */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  {theatre.showtimes.map((st) => (
                    <Link
                      key={st.id}
                      to={`/cinemaholic/book/${st.id}`}
                      className="group/st px-4 py-2.5 rounded-xl border border-[#C18C55]/30 bg-[#F4EDE1]/40 hover:bg-[#29211D] hover:border-[#29211D] transition-all flex flex-col items-center shadow-xs"
                    >
                      <span className="text-xs font-bold text-[#29211D] group-hover/st:text-white transition-colors">
                        {st.time}
                      </span>
                      <span className="text-[10px] text-[#817366] group-hover/st:text-[#C18C55] font-mono transition-colors">
                        from ₹{st.price}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Community Reviews Feed */}
          <div className="pt-8">
            <div className="flex items-center justify-between pb-4 border-b border-[#C18C55]/20 mb-6">
              <h2 className="font-serif font-bold text-xl text-[#29211D]">
                Audience Reviews ({reviews.length})
              </h2>
              <button
                onClick={() => setIsReviewModalOpen(true)}
                className="text-xs font-semibold text-[#C18C55] hover:underline"
              >
                + Add Your Opinion
              </button>
            </div>

            <div className="space-y-4">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-white rounded-2xl p-5 border border-[#C18C55]/20 shadow-sm"
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-[#29211D]">{rev.authorName}</span>
                      {rev.verifiedBuyer && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#34D399]/20 text-[#059669] text-[9px] font-bold">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          <span>Verified Buyer</span>
                        </span>
                      )}
                    </div>

                    {/* Rating Tier Pill */}
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                        rev.rating === 'PERFECTION'
                          ? 'bg-[#C18C55]/20 text-[#8C5D2B]'
                          : rev.rating === 'GOOD'
                          ? 'bg-[#34D399]/20 text-[#059669]'
                          : 'bg-[#60A5FA]/20 text-[#2563EB]'
                      }`}
                    >
                      {rev.rating}
                    </span>
                  </div>

                  <h3 className="font-semibold text-xs text-[#29211D] mb-1">{rev.title}</h3>
                  <p className="text-xs text-[#817366] leading-relaxed">{rev.content}</p>

                  <div className="mt-3 pt-2 border-t border-[#F4EDE1] flex items-center justify-between text-[11px] text-[#817366]">
                    <span>{rev.createdAt}</span>
                    <button
                      onClick={() => handleVoteHelpful(rev.id)}
                      className="inline-flex items-center gap-1.5 hover:text-[#C18C55] transition-colors"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>Helpful ({rev.helpfulCount || 0})</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: 5-Tier Consensus Scorecard (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#29211D] text-[#FBF8F2] rounded-3xl p-6 border border-[#C18C55]/30 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <span className="text-xs font-bold uppercase tracking-wider text-[#C18C55]">
                Audience Consensus
              </span>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-[#C18C55] text-[#14100E]">
                {distribution?.consensusRating || 'PERFECTION'}
              </span>
            </div>

            <div className="text-center py-6">
              <span className="font-serif font-black text-5xl text-white">
                {distribution?.ratingScore || '9.2'}
              </span>
              <span className="text-xs text-[#817366] block mt-1">
                out of 10 ({distribution?.totalReviews || 124} verified ratings)
              </span>
            </div>

            {/* Distribution Percentage Bars */}
            <div className="space-y-3 pt-2 border-t border-white/10 text-xs">
              {[
                { label: 'PERFECTION (5/5)', pct: distribution?.perfectionPercent || 68, color: 'bg-[#C18C55]' },
                { label: 'GOOD (4/5)', pct: distribution?.goodPercent || 22, color: 'bg-[#34D399]' },
                { label: 'AVERAGE (3/5)', pct: distribution?.averagePercent || 7, color: 'bg-[#60A5FA]' },
                { label: 'TIMEPASS (2/5)', pct: distribution?.timepassPercent || 2, color: 'bg-[#F59E0B]' },
                { label: 'SKIP (1/5)', pct: distribution?.skipPercent || 1, color: 'bg-[#EF4444]' },
              ].map((tier) => (
                <div key={tier.label}>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-[#F4EDE1]/80">{tier.label}</span>
                    <span className="font-mono text-white">{tier.pct}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${tier.color}`}
                      style={{ width: `${tier.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#1C1714] border border-[#C18C55]/40 rounded-3xl max-w-lg w-full p-6 text-[#F4EDE1] shadow-2xl">
            <h3 className="font-serif font-bold text-xl text-white mb-1">Rate & Review Film</h3>
            <p className="text-xs text-[#817366] mb-6">
              Share your genuine feedback for {film.title}.
            </p>

            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#C18C55] mb-2">
                  Select 5-Tier Rating
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {['PERFECTION', 'GOOD', 'AVERAGE', 'TIMEPASS', 'SKIP'].map((rate) => (
                    <button
                      key={rate}
                      type="button"
                      onClick={() => setSelectedRating(rate)}
                      className={`py-2 px-1 text-[10px] font-bold rounded-xl border text-center transition-all ${
                        selectedRating === rate
                          ? 'bg-[#C18C55] text-[#14100E] border-[#C18C55]'
                          : 'bg-white/5 border-white/10 text-[#817366] hover:text-white'
                      }`}
                    >
                      {rate}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#C18C55] mb-1">Headline</label>
                <input
                  type="text"
                  required
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  placeholder="e.g. Masterclass in sound and scale"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#C18C55]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#C18C55] mb-1">Detailed Review</label>
                <textarea
                  rows={4}
                  required
                  value={reviewBody}
                  onChange={(e) => setReviewBody(e.target.value)}
                  placeholder="What worked best? How was the auditorium sound and projection?"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#C18C55]"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/10 text-xs font-medium text-[#F4EDE1]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="px-6 py-2.5 rounded-xl bg-[#C18C55] text-[#14100E] text-xs font-bold uppercase tracking-wider shadow-md"
                >
                  {submittingReview ? 'Submitting...' : 'Post Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

