import React, { useState } from 'react';
import {
  Star,
  ThumbsUp,
  Sparkles,
  Filter,
  CheckCircle2,
  MessageSquare,
  Armchair,
  Film,
} from 'lucide-react';
import { POSTER_COLLECTION } from '../data/posterManifest';
import { communityReviewService } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function CommunityReviewsPage() {
  const { user } = useAuth();
  const [selectedTier, setSelectedTier] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formFilmId, setFormFilmId] = useState(1);
  const [formRating, setFormRating] = useState('PERFECTION');
  const [formTitle, setFormTitle] = useState('');
  const [formContent, setFormContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [reviews, setReviews] = useState([
    {
      id: 1,
      filmTitle: 'Kalki 2898 AD',
      authorName: 'Vikramaditya S.',
      rating: 'PERFECTION',
      verifiedBuyer: true,
      title: 'A towering visual benchmark for Indian cinema',
      content: 'Watched in IMAX 4K Dual Laser at Palladium. The world-building in Kasi and the Complex is magnificent. Sound design in the climax battle shook the recliners.',
      helpfulCount: 52,
      createdAt: 'Yesterday',
    },
    {
      id: 2,
      filmTitle: 'Interstellar',
      authorName: 'Dr. Anita Roy',
      rating: 'PERFECTION',
      verifiedBuyer: true,
      title: 'Unrivaled 70mm emotional journey',
      content: 'Zimmer’s organ crescendos in a proper Dolby Atmos auditorium remain a religious experience. Row F middle seats provided the optimal sightline.',
      helpfulCount: 44,
      createdAt: '3 days ago',
    },
    {
      id: 3,
      filmTitle: 'Dune: Part Two',
      authorName: 'Rohan Mehra',
      rating: 'GOOD',
      verifiedBuyer: true,
      title: 'Monolithic scale and thunderous sound',
      content: 'The sand-worm riding sequence alone is worth the ticket price. Greig Fraser’s infrared photography looks stunning on a silver laser screen.',
      helpfulCount: 29,
      createdAt: '5 days ago',
    },
    {
      id: 4,
      filmTitle: 'Avatar: The Way of Water',
      authorName: 'Sneha Patel',
      rating: 'AVERAGE',
      verifiedBuyer: true,
      title: 'Visually peerless 3D, narrative is predictable',
      content: 'The HFR 3D underwater sequences are breathtaking engineering, though the story feels repetitive in the second act. Prime seats recommended.',
      helpfulCount: 16,
      createdAt: '1 week ago',
    },
  ]);

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

  const handleCreateReview = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const chosenFilm = POSTER_COLLECTION[formFilmId - 1] || POSTER_COLLECTION[0];
      await communityReviewService.createReview({
        filmId: formFilmId,
        rating: formRating,
        title: formTitle,
        content: formContent,
      });

      setReviews((prev) => [
        {
          id: Date.now(),
          filmTitle: chosenFilm.title,
          authorName: user?.fullName || 'You (Audience)',
          rating: formRating,
          verifiedBuyer: true,
          title: formTitle,
          content: formContent,
          helpfulCount: 0,
          createdAt: 'Just now',
        },
        ...prev,
      ]);

      setIsModalOpen(false);
      setFormTitle('');
      setFormContent('');
    } catch (err) {
      console.warn('Submission notice:', err);
      const chosenFilm = POSTER_COLLECTION[formFilmId - 1] || POSTER_COLLECTION[0];
      setReviews((prev) => [
        {
          id: Date.now(),
          filmTitle: chosenFilm.title,
          authorName: user?.fullName || 'You (Audience)',
          rating: formRating,
          verifiedBuyer: true,
          title: formTitle,
          content: formContent,
          helpfulCount: 0,
          createdAt: 'Just now',
        },
        ...prev,
      ]);
      setIsModalOpen(false);
      setFormTitle('');
      setFormContent('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const tiers = ['ALL', 'PERFECTION', 'GOOD', 'AVERAGE', 'TIMEPASS', 'SKIP'];

  const filteredReviews = reviews.filter((r) => {
    if (selectedTier === 'ALL') return true;
    return r.rating === selectedTier;
  });

  return (
    <div className="min-h-screen bg-[#F4EDE1] text-[#29211D] py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#C18C55] mb-1">
              <Star className="w-3.5 h-3.5" />
              <span>THE 5-TIER OPINION FEED</span>
            </div>
            <h1 className="font-serif font-extrabold text-3xl sm:text-4xl text-[#29211D]">
              Community Movie Reviews
            </h1>
            <p className="text-xs text-[#817366] mt-1">
              Decisive consensus ratings from verified moviegoers across premium auditoriums.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-3 rounded-xl bg-[#29211D] hover:bg-[#3D332F] text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all self-start sm:self-auto"
          >
            + Post a Review
          </button>
        </div>

        {/* Tier Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6">
          {tiers.map((tier) => (
            <button
              key={tier}
              onClick={() => setSelectedTier(tier)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                selectedTier === tier
                  ? 'bg-[#C18C55] text-white shadow-sm'
                  : 'bg-white/80 text-[#817366] hover:bg-white hover:text-[#29211D] border border-[#C18C55]/20'
              }`}
            >
              {tier}
            </button>
          ))}
        </div>

        {/* Reviews Feed */}
        <div className="space-y-4">
          {filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-3xl p-6 border border-[#C18C55]/20 shadow-sm space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-[#29211D]">{rev.authorName}</span>
                  {rev.verifiedBuyer && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#34D399]/20 text-[#059669] text-[10px] font-bold">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Verified Ticket Holder</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#817366] font-medium">{rev.filmTitle}</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                      rev.rating === 'PERFECTION'
                        ? 'bg-[#C18C55]/20 text-[#8C5D2B] border border-[#C18C55]'
                        : rev.rating === 'GOOD'
                        ? 'bg-[#34D399]/20 text-[#059669] border border-[#34D399]'
                        : 'bg-[#60A5FA]/20 text-[#2563EB] border border-[#60A5FA]'
                    }`}
                  >
                    {rev.rating}
                  </span>
                </div>
              </div>

              <h2 className="font-serif font-bold text-base text-[#29211D]">{rev.title}</h2>
              <p className="text-xs text-[#817366] leading-relaxed">{rev.content}</p>

              <div className="pt-2 border-t border-[#F4EDE1] flex items-center justify-between text-xs text-[#817366]">
                <span>{rev.createdAt}</span>
                <button
                  onClick={() => handleVoteHelpful(rev.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F4EDE1]/40 hover:bg-[#C18C55]/15 text-[#29211D] text-xs font-semibold transition-colors"
                >
                  <ThumbsUp className="w-3.5 h-3.5 text-[#C18C55]" />
                  <span>Helpful ({rev.helpfulCount || 0})</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#1C1714] border border-[#C18C55]/40 rounded-3xl max-w-lg w-full p-6 text-[#F4EDE1] shadow-2xl">
            <h3 className="font-serif font-bold text-xl text-white mb-1">Write an Audience Review</h3>
            <p className="text-xs text-[#817366] mb-6">
              Give your honest verdict to help fellow cinemaholics choose.
            </p>

            <form onSubmit={handleCreateReview} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#C18C55] mb-1">Select Film</label>
                <select
                  value={formFilmId}
                  onChange={(e) => setFormFilmId(parseInt(e.target.value, 10))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#C18C55]"
                >
                  {POSTER_COLLECTION.map((m, idx) => (
                    <option key={m.id} value={idx + 1} className="bg-[#1C1714]">
                      {m.title} ({m.year})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#C18C55] mb-2">5-Tier Rating</label>
                <div className="grid grid-cols-5 gap-1.5">
                  {['PERFECTION', 'GOOD', 'AVERAGE', 'TIMEPASS', 'SKIP'].map((rate) => (
                    <button
                      key={rate}
                      type="button"
                      onClick={() => setFormRating(rate)}
                      className={`py-2 px-1 text-[10px] font-bold rounded-xl border text-center transition-all ${
                        formRating === rate
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
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. A visual triumph in laser IMAX"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#C18C55]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#C18C55] mb-1">Review</label>
                <textarea
                  rows={4}
                  required
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  placeholder="Write your review..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#C18C55]"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/10 text-xs font-medium text-[#F4EDE1]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-[#C18C55] text-[#14100E] text-xs font-bold uppercase tracking-wider shadow-md"
                >
                  {isSubmitting ? 'Posting...' : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

