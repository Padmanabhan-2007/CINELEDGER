import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileCheck2, Plus, Search, RefreshCw, ExternalLink } from 'lucide-react';
import { reconciliationService } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import FilmPoster from '../components/FilmPoster';

export default function ReconciliationsPage() {
  const [reconciliations, setReconciliations] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  const loadReconciliations = () => {
    setLoading(true);
    reconciliationService.getAll()
      .then((res) => {
        setReconciliations(res);
        setFiltered(res);
      })
      .catch((err) => console.error('Failed to load reconciliations', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadReconciliations();
  }, []);

  useEffect(() => {
    let result = reconciliations;

    if (statusFilter !== 'ALL') {
      result = result.filter((r) => r.status === statusFilter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((r) =>
        r.reconciliationNumber?.toLowerCase().includes(q) ||
        r.filmTitle?.toLowerCase().includes(q) ||
        r.cinemaName?.toLowerCase().includes(q)
      );
    }

    setFiltered(result);
  }, [search, statusFilter, reconciliations]);

  const formatCurrency = (val) => {
    if (val === null || val === undefined) return '₹0.00';
    return `₹${Number(val).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const statusOptions = ['ALL', 'DRAFT', 'DISCREPANCIES_FOUND', 'RECONCILED', 'SETTLED'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#C18C55] font-semibold">MULTI-SOURCE WORKBENCH</span>
          <h2 className="text-2xl font-serif font-bold text-[#29211D]">Box-Office Reconciliations</h2>
          <p className="text-xs text-[#817366] mt-0.5">Cross-examination of theatre POS collections against distributor statements</p>
        </div>
        <Link
          to="/app/reconciliations/new"
          className="btn btn-primary text-xs py-2.5 px-4 rounded-xl self-start sm:self-auto"
        >
          <Plus size={15} />
          <span>New Reconciliation Cycle</span>
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="morph-card flex flex-col md:flex-row items-center justify-between gap-4 p-3.5">
        {/* Status Pills */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {statusOptions.map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                statusFilter === st
                  ? 'bg-gradient-to-r from-[#C18C55] to-[#996D3D] text-white shadow-sm'
                  : 'bg-white/60 text-[#817366] border border-[rgba(129,115,102,0.16)] hover:bg-white hover:text-[#29211D]'
              }`}
            >
              {st === 'ALL' ? 'All Statuses' : st.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by case #, film, or cinema..."
            className="form-input pl-9 py-2 text-xs"
          />
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#817366]" />
        </div>
      </div>

      {/* Main Table */}
      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center gap-2">
          <RefreshCw size={22} className="animate-spin text-[#C18C55]" />
          <p className="text-xs font-mono text-[#817366]">Loading active reconciliations...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="morph-card p-12 text-center space-y-3">
          <FileCheck2 size={36} className="mx-auto text-[#817366]" />
          <h3 className="font-serif font-bold text-lg text-[#29211D]">No Reconciliations Found</h3>
          <p className="text-xs text-[#817366]">Try adjusting your filter or initiate a new reconciliation cycle.</p>
          <Link to="/app/reconciliations/new" className="btn btn-primary text-xs inline-flex items-center gap-1.5 mt-2">
            <Plus size={14} />
            <span>Start New Cycle</span>
          </Link>
        </div>
      ) : (
        <div className="morph-card p-6 shadow-sm">
          <div className="table-container">
            <table className="cine-table">
              <thead>
                <tr>
                  <th>Case #</th>
                  <th>Theatrical Feature</th>
                  <th>Cinema Circuit</th>
                  <th>Period</th>
                  <th>Reported POS</th>
                  <th>Distributor Statement</th>
                  <th>Variance</th>
                  <th>Discrepancies</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((rec) => (
                  <tr key={rec.id}>
                    <td className="font-mono text-xs font-bold text-[#C18C55]">
                      {rec.reconciliationNumber}
                    </td>
                    <td>
                      <div className="flex items-center gap-3">
                        <FilmPoster posterUrl={rec.filmPosterUrl} title={rec.filmTitle} height="h-12 w-8" />
                        <div>
                          <p className="font-serif font-bold text-xs text-[#29211D] line-clamp-1">{rec.filmTitle}</p>
                          <p className="text-[10px] text-[#817366] font-mono">{rec.contractNumber || 'Standard Contract'}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <p className="text-xs font-medium text-[#29211D] line-clamp-1">{rec.cinemaName}</p>
                      <p className="text-[10px] text-[#817366] font-mono">{rec.cinemaCity}</p>
                    </td>
                    <td className="font-mono text-xs text-[#817366] tabular-nums">
                      {rec.periodStart} to {rec.periodEnd}
                    </td>
                    <td className="font-mono text-xs font-medium text-[#29211D] tabular-nums">
                      {formatCurrency(rec.totalPosAmount)}
                    </td>
                    <td className="font-mono text-xs font-medium text-[#817366] tabular-nums">
                      {formatCurrency(rec.totalDistributorAmount)}
                    </td>
                    <td className={`font-mono text-xs font-bold tabular-nums ${Number(rec.totalVariance) > 0 ? 'text-[#B8755C]' : 'text-[#657B65]'}`}>
                      {formatCurrency(rec.totalVariance)}
                    </td>
                    <td className="font-mono text-xs text-center">
                      {rec.discrepancyCount > 0 ? (
                        <span className="px-2 py-0.5 rounded-full bg-[#B8755C]/15 text-[#9A5840] font-bold border border-[#B8755C]/30">
                          {rec.discrepancyCount}
                        </span>
                      ) : (
                        <span className="text-[#465B46] font-semibold">0</span>
                      )}
                    </td>
                    <td>
                      <StatusBadge status={rec.status} />
                    </td>
                    <td>
                      <Link
                        to={`/app/reconciliations/${rec.id}`}
                        className="btn btn-secondary text-xs py-1.5 px-3 rounded-xl flex items-center gap-1 font-semibold"
                      >
                        <span>Open Workbench</span>
                        <ExternalLink size={12} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
