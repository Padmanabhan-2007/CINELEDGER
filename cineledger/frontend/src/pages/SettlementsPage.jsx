import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Receipt, RefreshCw, ExternalLink, Search } from 'lucide-react';
import { settlementService } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import FilmPoster from '../components/FilmPoster';

export default function SettlementsPage() {
  const [settlements, setSettlements] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    settlementService.getAll()
      .then((res) => {
        const data = Array.isArray(res) ? res : [];
        setSettlements(data);
        setFiltered(data);
      })
      .catch((err) => console.error('Failed to load settlements', err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = settlements;
    if (statusFilter !== 'ALL') {
      result = result.filter((s) => s.status === statusFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((s) =>
        s.settlementNumber?.toLowerCase().includes(q) ||
        s.filmTitle?.toLowerCase().includes(q) ||
        s.cinemaName?.toLowerCase().includes(q)
      );
    }
    setFiltered(result);
  }, [search, statusFilter, settlements]);

  const fmt = (val) => {
    if (val === null || val === undefined) return '₹0.00';
    return `₹${Number(val).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const statusOptions = ['ALL', 'DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'SETTLED'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <span className="text-[11px] font-mono uppercase tracking-widest text-[#C18C55] font-semibold">FINANCIAL SETTLEMENTS</span>
        <h2 className="text-2xl font-serif font-bold text-[#29211D]">Contract-Aware Settlements</h2>
        <p className="text-xs text-[#817366] mt-0.5">Revenue-share calculations based on configured contract terms and reconciled source data</p>
      </div>

      {/* Filter Bar */}
      <div className="morph-card flex flex-col md:flex-row items-center justify-between gap-4 p-3.5">
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
              {st === 'ALL' ? 'All' : st.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-72">
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search settlements..." className="form-input pl-9 py-2 text-xs" />
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#817366]" />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center gap-2">
          <RefreshCw size={22} className="animate-spin text-[#C18C55]" />
          <p className="text-xs font-mono text-[#817366]">Loading settlements...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="morph-card p-12 text-center space-y-3">
          <Receipt size={36} className="mx-auto text-[#817366]" />
          <h3 className="font-serif font-bold text-lg text-[#29211D]">No Settlements Found</h3>
          <p className="text-xs text-[#817366]">Settlements are generated from reconciled data using configured contract terms.</p>
        </div>
      ) : (
        <div className="morph-card p-6 shadow-sm">
          <div className="table-container">
            <table className="cine-table">
              <thead>
                <tr>
                  <th>Settlement #</th>
                  <th>Film</th>
                  <th>Cinema</th>
                  <th>Period</th>
                  <th>Gross Revenue</th>
                  <th>Share %</th>
                  <th>Net Payable</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s.id}>
                    <td className="font-mono text-xs font-bold text-[#C18C55]">{s.settlementNumber || `STL-${s.id}`}</td>
                    <td>
                      <div className="flex items-center gap-2.5">
                        <FilmPoster posterUrl={s.filmPosterUrl} title={s.filmTitle} height="h-10 w-7" />
                        <p className="font-serif font-bold text-xs text-[#29211D] line-clamp-1">{s.filmTitle}</p>
                      </div>
                    </td>
                    <td className="text-xs font-medium text-[#29211D]">{s.cinemaName || '—'}</td>
                    <td className="font-mono text-xs text-[#817366] tabular-nums">{s.periodStart} to {s.periodEnd}</td>
                    <td className="font-mono text-xs font-medium text-[#29211D] tabular-nums">{fmt(s.grossRevenue || s.settlementBasis)}</td>
                    <td className="font-mono text-xs font-semibold text-[#9E6E3B] tabular-nums">{s.revenueSharePercent || s.sharePercentage || '—'}%</td>
                    <td className="font-mono text-xs font-bold text-[#465B46] tabular-nums">{fmt(s.netPayable || s.finalAmount)}</td>
                    <td><StatusBadge status={s.status} /></td>
                    <td>
                      <Link to={`/app/settlements/${s.id}`} className="btn btn-secondary text-xs py-1.5 px-3 rounded-xl flex items-center gap-1 font-semibold">
                        <span>View</span> <ExternalLink size={11} />
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
