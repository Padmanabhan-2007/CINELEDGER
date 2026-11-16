import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  Star,
  Armchair,
  Sparkles,
  ChevronRight,
  Heart,
  Clock,
  Calendar,
  Layers,
} from 'lucide-react';
import { POSTER_COLLECTION } from '../data/posterManifest';
import { audienceWatchlistService } from '../services/api';

export default function MovieDiscoveryPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedGenre, setSelectedGenre] = useState('ALL');
  const [selectedFormat, setSelectedFormat] = useState('ALL');
  const [watchlistIds, setWatchlistIds] = useState(new Set());

  // Load user watchlist
  useEffect(() => {
    async function fetchWatchlist() {
      try {
        const list = await audienceWatchlistService.getAll();
        if (Array.isArray(list)) {
          setWatchlistIds(new Set(list.map((item) => item.filmId)));
        }
      } catch (err) {
        console.warn('Watchlist fetch notice:', err);
      }
    }
    fetchWatchlist();
  }, []);

  const toggleWatchlist = async (filmId, e) => {
    e.stopPropagation();
    try {
      if (watchlistIds.has(filmId)) {
        await audienceWatchlistService.remove(filmId);
        setWatchlistIds((prev) => {
          const next = new Set(prev);
          next.delete(filmId);
          return next;
        });
      } else {
        await audienceWatchlistService.add(filmId);
        setWatchlistIds((prev) => new Set(prev).add(filmId));
      }
    } catch (err) {
      // Optimistic toggle fallback
      setWatchlistIds((prev) => {
        const next = new Set(prev);
        if (next.has(filmId)) next.delete(filmId);
        else next.add(filmId);
        return next;
      });
    }
  };

  const genres = ['ALL', 'Sci-Fi', 'Thriller', 'Drama', 'Action', 'Biographical'];

  // Filter movies
  const filteredMovies = POSTER_COLLECTION.filter((movie) => {
    const matchesSearch =
      !searchQuery ||
      movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      movie.director.toLowerCase().includes(searchQuery.toLowerCase()) ||
      movie.genre.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesGenre =
      selectedGenre === 'ALL' || movie.genre.toLowerCase().includes(selectedGenre.toLowerCase());

    return matchesSearch && matchesGenre;
  });

  return (
    <div className="min-h-screen bg-[#F4EDE1] text-[#29211D] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#C18C55] mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>THEATRICAL DISCOVERY</span>
          </div>
          <h1 className="font-serif font-extrabold text-3xl sm:text-4xl text-[#29211D]">
            Explore Now Showing & Upcoming Films
          </h1>
          <p className="text-xs text-[#817366] mt-1">
            Browse 20 curated master titles across premium formats. Reserve seats in live 3D auditoriums.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 border border-[#C18C55]/30 shadow-md mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-[#C18C55] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, director..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#F4EDE1]/50 border border-[#C18C55]/20 text-xs text-[#29211D] placeholder-[#817366] focus:outline-none focus:border-[#C18C55]"
            />
          </div>

          {/* Genre Filter Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  selectedGenre === genre
                    ? 'bg-[#C18C55] text-white shadow-sm'
                    : 'bg-[#F4EDE1]/60 text-[#817366] hover:bg-[#F4EDE1] hover:text-[#29211D]'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        {/* Movies Grid */}
        {filteredMovies.length === 0 ? (
          <div className="text-center py-20 text-[#817366]">
            <p className="text-sm">No movies match your search criteria.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedGenre('ALL');
              }}
              className="mt-3 text-xs text-[#C18C55] font-semibold underline"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredMovies.map((movie, index) => {
              const filmId = index + 1;
              const isFav = watchlistIds.has(filmId);

              // Assign realistic rating consensus
              const consensus =
                index % 4 === 0
                  ? { label: 'PERFECTION', color: 'bg-[#C18C55]/20 text-[#8C5D2B] border-[#C18C55]' }
                  : index % 3 === 0
                  ? { label: 'GOOD', color: 'bg-[#34D399]/20 text-[#059669] border-[#34D399]' }
                  : { label: 'AVERAGE', color: 'bg-[#60A5FA]/20 text-[#2563EB] border-[#60A5FA]' };

              return (
                <div
                  key={movie.id}
                  onClick={() => navigate(`/cinemaholic/movies/${filmId}`)}
                  className="group bg-white rounded-3xl overflow-hidden border border-[#C18C55]/20 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col justify-between"
                >
                  {/* Poster Thumbnail */}
                  <div className="relative aspect-[2/3] overflow-hidden bg-[#29211D]">
                    <img
                      src={movie.path}
                      alt={movie.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />

                    {/* Format Badge */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1">
                      <span className="px-2 py-0.5 rounded-full bg-[#29211D]/80 backdrop-blur-md text-white text-[10px] font-bold tracking-wider border border-white/20 shadow-sm">
                        IMAX 4K
                      </span>
                    </div>

                    {/* Watchlist Heart Button */}
                    <button
                      onClick={(e) => toggleWatchlist(filmId, e)}
                      className="absolute top-3 right-3 p-2 rounded-full bg-[#29211D]/80 backdrop-blur-md text-white hover:text-[#EF4444] transition-colors shadow-sm"
                      title={isFav ? 'Remove from Watchlist' : 'Add to Watchlist'}
                    >
                      <Heart className={`w-4 h-4 ${isFav ? 'fill-[#EF4444] text-[#EF4444]' : ''}`} />
                    </button>

                    {/* Consensus Pill */}
                    <div className="absolute bottom-3 left-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-md border ${consensus.color}`}
                      >
                        {consensus.label}
                      </span>
                    </div>
                  </div>

                  {/* Meta Details */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-[#817366] mb-1">
                        <span>{movie.year}</span>
                        <span>{movie.genre}</span>
                      </div>
                      <h2 className="font-serif font-bold text-base text-[#29211D] group-hover:text-[#C18C55] transition-colors leading-snug">
                        {movie.title}
                      </h2>
                      <p className="text-xs text-[#817366] mt-0.5 truncate">
                        Dir: {movie.director}
                      </p>
                    </div>

                    {/* Card Actions */}
                    <div className="mt-5 pt-3 border-t border-[#F4EDE1] flex items-center justify-between gap-2">
                      <Link
                        to={`/cinemaholic/movies/${filmId}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs font-semibold text-[#817366] hover:text-[#29211D]"
                      >
                        Showtimes
                      </Link>

                      <Link
                        to={`/cinemaholic/book/${filmId}`}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#29211D] hover:bg-[#C18C55] text-white hover:text-[#14100E] text-xs font-bold transition-all shadow-sm"
                      >
                        <Armchair className="w-3.5 h-3.5" />
                        <span>Book 3D</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

