import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, Globe, Shield, ArrowLeft, Plus, ExternalLink, RefreshCw } from 'lucide-react';
import { filmService, reconciliationService, contractService } from '../services/api';
import FilmPoster from '../components/FilmPoster';
import StatusBadge from '../components/StatusBadge';

export default function FilmDetailPage() {
  const { id } = useParams();
  const [film, setFilm] = useState(null);
  const [reconciliations, setReconciliations] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      filmService.getById(id),
      reconciliationService.getAll(),
      contractService.getAll(),
    ])
      .then(([filmRes, reconRes, contractRes]) => {
        setFilm(filmRes);
        setReconciliations(reconRes.filter((r) => String(r.filmId) === String(id)));
        setContracts(contractRes.filter((c) => String(c.filmId) === String(id)));
      })
      .catch((err) => console.error('Failed to load film detail', err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-2">
        <RefreshCw size={22} className="animate-spin text-[#C18C55]" />
        <p className="text-xs font-mono text-[#817366]">Loading film master profile...</p>
      </div>
    );
  }

  if (!film) {
    return (
      <div className="morph-card p-12 text-center space-y-3">
        <h2 className="text-xl font-serif font-bold text-[#29211D]">Film Not Found</h2>
        <Link to="/app/films" className="btn btn-secondary text-xs">Return to Catalog</Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <Link to="/app/films" className="inline-flex items-center gap-2 text-xs font-semibold text-[#817366] hover:text-[#C18C55] transition-colors">
        <ArrowLeft size={14} />
        <span>Back to Film Catalog</span>
      </Link>

      {/* Film Header Banner */}
      <div className="morph-card p-6 lg:p-8 flex flex-col md:flex-row gap-8 items-start">
        <FilmPoster
          posterUrl={film.posterUrl}
          title={film.title}
          genre={film.genre}
          height="h-72 w-52"
          className="shadow-xl shrink-0"
        />

        <div className="flex-1 space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <span className="text-[#C18C55] font-bold">{film.code}</span>
            <span className="text-[#817366]">•</span>
            <span className="bg-[#F4EDE1] text-[#9E6E3B] border border-[rgba(193,140,85,0.28)] px-2.5 py-0.5 rounded-md font-semibold">{film.rating}</span>
            <span className="text-[#817366]">•</span>
            <span className="text-[#817366]">{film.genre}</span>
          </div>

          <h1 className="text-3xl lg:text-4xl font-serif font-bold text-[#29211D] tracking-tight">
            {film.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-xs text-[#29211D] pt-1 font-medium">
            <span className="flex items-center gap-1.5"><Calendar size={14} className="text-[#C18C55]" /> Release: {film.releaseYear}</span>
            <span className="flex items-center gap-1.5"><Clock size={14} className="text-[#C18C55]" /> Runtime: {film.durationMinutes} min</span>
            <span className="flex items-center gap-1.5"><Globe size={14} className="text-[#C18C55]" /> Audio: {film.language}</span>
            <span className="flex items-center gap-1.5"><Shield size={14} className="text-[#C18C55]" /> Studio: {film.distributorName || 'Warner Bros.'}</span>
          </div>

          <p className="text-sm text-[#817366] leading-relaxed pt-2">
            {film.synopsis || 'No synopsis provided for this theatrical title.'}
          </p>

          <div className="pt-3 flex gap-3">
            <Link
              to="/app/reconciliations/new"
              className="btn btn-primary text-xs py-2.5 px-4 rounded-xl"
            >
              <Plus size={14} />
              <span>Launch Reconciliation For Title</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Linked Contracts & Reconciliation History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Reconciliations Table */}
        <div className="lg:col-span-8 morph-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif font-bold text-lg text-[#29211D]">
              Theatrical Reconciliations ({reconciliations.length})
            </h3>
            <Link to="/app/reconciliations/new" className="text-xs font-semibold text-[#C18C55] hover:text-[#A57340] flex items-center gap-1 transition-colors">
              <Plus size={13} />
              <span>Add Cycle</span>
            </Link>
          </div>

          {reconciliations.length === 0 ? (
            <p className="text-xs text-[#817366] py-6 text-center">No reconciliation cycles have been initiated for this title yet.</p>
          ) : (
            <div className="table-container">
              <table className="cine-table">
                <thead>
                  <tr>
                    <th>Case #</th>
                    <th>Cinema Circuit</th>
                    <th>POS Gross</th>
                    <th>Variance</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {reconciliations.map((rec) => (
                    <tr key={rec.id}>
                      <td className="font-mono text-xs font-semibold text-[#C18C55]">{rec.reconciliationNumber}</td>
                      <td className="text-xs font-medium text-[#29211D]">{rec.cinemaName}</td>
                      <td className="font-mono text-xs tabular-nums">₹{Number(rec.totalPosAmount).toLocaleString('en-IN')}</td>
                      <td className={`font-mono text-xs font-bold tabular-nums ${Number(rec.totalVariance) > 0 ? 'text-[#B8755C]' : 'text-[#657B65]'}`}>
                        ₹{Number(rec.totalVariance).toLocaleString('en-IN')}
                      </td>
                      <td><StatusBadge status={rec.status} /></td>
                      <td>
                        <Link to={`/app/reconciliations/${rec.id}`} className="text-xs font-semibold text-[#C18C55] hover:text-[#A57340] flex items-center gap-1 transition-colors">
                          <span>Inspect</span>
                          <ExternalLink size={12} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Linked Master Agreements */}
        <div className="lg:col-span-4 morph-card p-6 space-y-4">
          <h3 className="font-serif font-bold text-lg text-[#29211D]">Exhibition Contracts</h3>
          {contracts.length === 0 ? (
            <p className="text-xs text-[#817366]">No executed contracts associated with this title.</p>
          ) : (
            <div className="space-y-3">
              {contracts.map((c) => (
                <div key={c.id} className="p-4 rounded-2xl bg-[#F4EDE1]/65 border border-[rgba(129,115,102,0.16)] space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-semibold text-[#C18C55]">{c.contractNumber}</span>
                    <span className="text-[10px] bg-[#657B65]/15 border border-[#657B65]/30 px-2 py-0.5 rounded-full text-[#465B46] font-semibold">{c.status}</span>
                  </div>
                  <p className="text-xs font-semibold text-[#29211D]">{c.title}</p>
                  <p className="text-[11px] text-[#817366]">
                    Basis: <strong className="text-[#29211D]">{c.settlementBasis}</strong>
                  </p>
                  <div className="pt-1 text-[11px] font-mono text-[#9E6E3B] font-semibold flex justify-between border-t border-[rgba(129,115,102,0.12)]">
                    <span>Distributor: {c.distributorSharePercentage}%</span>
                    <span>Exhibitor: {c.exhibitorSharePercentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
