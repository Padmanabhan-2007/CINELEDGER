import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Film, Search, Plus, RefreshCw, Calendar, Clock, Globe } from 'lucide-react';
import { filmService } from '../services/api';
import FilmPoster from '../components/FilmPoster';
import Modal from '../components/Modal';

export default function FilmsPage() {
  const [films, setFilms] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [newFilm, setNewFilm] = useState({
    title: '',
    originalTitle: '',
    code: '',
    releaseYear: 2026,
    durationMinutes: 145,
    language: 'English',
    rating: 'PG-13',
    genre: 'Sci-Fi / Action',
    posterUrl: '/assets/posters/dune-part-two.png',
    synopsis: '',
    distributorId: 1,
    status: 'ACTIVE',
  });

  const loadFilms = () => {
    setLoading(true);
    filmService.getAll(search)
      .then((res) => setFilms(res))
      .catch((err) => console.error('Failed to load films', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadFilms();
    }, 250);
    return () => clearTimeout(timer);
  }, [search]);

  const handleCreateFilm = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await filmService.create(newFilm);
      setIsModalOpen(false);
      loadFilms();
      setNewFilm({
        title: '',
        originalTitle: '',
        code: '',
        releaseYear: 2026,
        durationMinutes: 145,
        language: 'English',
        rating: 'PG-13',
        genre: 'Sci-Fi / Action',
        posterUrl: '/assets/posters/dune-part-two.png',
        synopsis: '',
        distributorId: 1,
        status: 'ACTIVE',
      });
    } catch (err) {
      setError(err?.message || 'Failed to register film');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#C18C55] font-semibold">MASTER TITLES</span>
          <h2 className="text-2xl font-serif font-bold text-[#29211D]">Theatrical Film Catalog</h2>
          <p className="text-xs text-[#817366] mt-0.5">Centralized master films with authorized poster artwork and active reconciliation ties</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary text-xs py-2.5 px-4 rounded-xl self-start sm:self-auto"
        >
          <Plus size={15} />
          <span>Register New Title</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="morph-card flex flex-col sm:flex-row items-center justify-between gap-4 p-3.5">
        <div className="relative w-full sm:w-96">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, genre or language..."
            className="form-input pl-9 py-2 text-xs"
          />
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#817366]" />
        </div>
        <div className="text-xs font-mono text-[#817366]">
          Showing <strong className="text-[#29211D]">{films.length}</strong> master theatrical features
        </div>
      </div>

      {/* Films Grid */}
      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center gap-2">
          <RefreshCw size={22} className="animate-spin text-[#C18C55]" />
          <p className="text-xs font-mono text-[#817366]">Fetching catalog from Spring Boot API...</p>
        </div>
      ) : films.length === 0 ? (
        <div className="morph-card p-12 text-center space-y-3">
          <Film size={36} className="mx-auto text-[#817366]" />
          <h3 className="font-serif font-bold text-lg text-[#29211D]">No Films Found</h3>
          <p className="text-xs text-[#817366]">No theatrical releases match your search query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {films.map((film) => (
            <Link
              key={film.id}
              to={`/app/films/${film.id}`}
              className="group morph-card morph-card-hover overflow-hidden flex flex-col"
            >
              <FilmPoster
                posterUrl={film.posterUrl}
                title={film.title}
                genre={film.genre}
                height="h-64"
              />
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3 bg-white/70">
                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#C18C55] mb-1">
                    <span className="font-semibold">{film.code}</span>
                    <span className="bg-[#F4EDE1] px-2 py-0.5 rounded-md text-[#9E6E3B] border border-[rgba(193,140,85,0.28)] font-semibold">{film.rating}</span>
                  </div>
                  <h3 className="font-serif font-bold text-base text-[#29211D] group-hover:text-[#C18C55] transition-colors line-clamp-1">
                    {film.title}
                  </h3>
                  <p className="text-xs text-[#817366] mt-1 line-clamp-1">{film.genre}</p>
                </div>

                <div className="pt-3 border-t border-[rgba(129,115,102,0.14)] space-y-2 text-xs text-[#29211D]">
                  <div className="flex items-center justify-between text-[11px] text-[#817366]">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} className="text-[#C18C55]" />
                      <span>{film.releaseYear}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} className="text-[#C18C55]" />
                      <span>{film.durationMinutes} min</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Globe size={12} className="text-[#C18C55]" />
                      <span>{film.language}</span>
                    </span>
                  </div>

                  <div className="pt-1 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-[#817366]">Active Reconciliations:</span>
                    <span className="font-bold text-[#C18C55]">{film.activeReconciliationsCount || 0}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Register Film Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Register Theatrical Master Film"
        subtitle="Associate persistent authorized artwork and release identifiers"
      >
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-[#B8755C]/10 border border-[#B8755C]/30 text-[#9A5840] text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleCreateFilm} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Film Title</label>
              <input
                type="text"
                required
                value={newFilm.title}
                onChange={(e) => setNewFilm({ ...newFilm, title: e.target.value })}
                className="form-input"
                placeholder="e.g. Dune: Part Two"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Film Master Code</label>
              <input
                type="text"
                required
                value={newFilm.code}
                onChange={(e) => setNewFilm({ ...newFilm, code: e.target.value })}
                className="form-input"
                placeholder="e.g. FLM-2026-007"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="form-group">
              <label className="form-label">Release Year</label>
              <input
                type="number"
                required
                value={newFilm.releaseYear}
                onChange={(e) => setNewFilm({ ...newFilm, releaseYear: Number(e.target.value) })}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Runtime (min)</label>
              <input
                type="number"
                required
                value={newFilm.durationMinutes}
                onChange={(e) => setNewFilm({ ...newFilm, durationMinutes: Number(e.target.value) })}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Language</label>
              <input
                type="text"
                required
                value={newFilm.language}
                onChange={(e) => setNewFilm({ ...newFilm, language: e.target.value })}
                className="form-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Genre</label>
              <input
                type="text"
                required
                value={newFilm.genre}
                onChange={(e) => setNewFilm({ ...newFilm, genre: e.target.value })}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Censor Rating</label>
              <select
                value={newFilm.rating}
                onChange={(e) => setNewFilm({ ...newFilm, rating: e.target.value })}
                className="form-select"
              >
                <option value="PG-13">PG-13</option>
                <option value="U/A">U/A</option>
                <option value="R">R</option>
                <option value="A">A</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Authorized Poster Asset Path or URL</label>
            <input
              type="text"
              required
              value={newFilm.posterUrl}
              onChange={(e) => setNewFilm({ ...newFilm, posterUrl: e.target.value })}
              className="form-input font-mono text-xs"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Synopsis</label>
            <textarea
              rows={3}
              value={newFilm.synopsis}
              onChange={(e) => setNewFilm({ ...newFilm, synopsis: e.target.value })}
              className="form-textarea text-xs"
              placeholder="Theatrical release plot overview..."
            />
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="btn btn-secondary text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary text-xs"
            >
              {submitting ? 'Persisting to MySQL...' : 'Save Title to Catalog'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
