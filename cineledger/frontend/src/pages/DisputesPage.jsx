import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AlertOctagon, RefreshCw, Search, ExternalLink, MessageSquare } from 'lucide-react';
import { disputeService } from '../services/api';
import StatusBadge from '../components/StatusBadge';

export default function DisputesPage() {
  const [disputes, setDisputes] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    disputeService.getAll()
      .then((res) => {
        const data = Array.isArray(res) ? res : [];
        setDisputes(data);
        setFiltered(data);
      })
      .catch((err) => console.error('Failed to load disputes', err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = disputes;
    if (statusFilter !== 'ALL') {
      result = result.filter((d) => d.status === statusFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((d) =>
        d.disputeNumber?.toLowerCase().includes(q) ||
        d.reason?.toLowerCase().includes(q) ||
        d.type?.toLowerCase().includes(q)
      );
    }
    setFiltered(result);
  }, [search, statusFilter, disputes]);

  const fmt = (val) => {
    if (val === null || val === undefined) return '₹0.00';
    return `₹${Number(val).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const statusOptions = ['ALL', 'OPEN', 'IN_REVIEW', 'RESOLVED', 'REJECTED'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <span className="text-[11px] font-mono uppercase tracking-widest text-[#C18C55] font-semibold">CASE MANAGEMENT</span>
        <h2 className="text-2xl font-serif font-bold text-[#29211D]">Disputes &amp; Variance Resolution</h2>
        <p className="text-xs text-[#817366] mt-0.5">Investigation cases for unresolved discrepancies between exhibition and distribution parties</p>
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
              {st === 'ALL' ? 'All Cases' : st.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-72">
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search disputes..." className="form-input pl-9 py-2 text-xs" />
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#817366]" />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center gap-2">
          <RefreshCw size={22} className="animate-spin text-[#C18C55]" />
          <p className="text-xs font-mono text-[#817366]">Loading dispute cases...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="morph-card p-12 text-center space-y-3">
          <AlertOctagon size={36} className="mx-auto text-[#817366]" />
          <h3 className="font-serif font-bold text-lg text-[#29211D]">No Active Disputes</h3>
          <p className="text-xs text-[#817366]">Dispute cases are created from the reconciliation workbench when discrepancies are contested.</p>
        </div>
      ) : (
        <div className="morph-card p-6 shadow-sm">
          <div className="table-container">
            <table className="cine-table">
              <thead>
                <tr>
                  <th>Case #</th>
                  <th>Type</th>
                  <th>Reason</th>
                  <th>Amount in Question</th>
                  <th>Filed By</th>
                  <th>Filed On</th>
                  <th>Comments</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((d) => (
                  <tr key={d.id}>
                    <td className="font-mono text-xs font-bold text-[#C18C55]">{d.disputeNumber || `DSP-${d.id}`}</td>
                    <td>
                      <span className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-[#B8755C]/15 text-[#9A5840] border border-[#B8755C]/30">
                        {d.type?.replace(/_/g, ' ') || 'VARIANCE'}
                      </span>
                    </td>
                    <td className="text-xs text-[#29211D] max-w-xs truncate">{d.reason || '—'}</td>
                    <td className="font-mono text-xs font-bold text-[#B8755C] tabular-nums">{fmt(d.amountInQuestion)}</td>
                    <td className="text-xs text-[#817366]">{d.filedBy || d.createdBy || '—'}</td>
                    <td className="font-mono text-xs text-[#817366]">{d.createdAt ? new Date(d.createdAt).toLocaleDateString() : '—'}</td>
                    <td className="text-xs text-center">
                      <span className="inline-flex items-center gap-1 text-[#817366] font-mono">
                        <MessageSquare size={12} className="text-[#C18C55]" /> {d.commentCount || 0}
                      </span>
                    </td>
                    <td><StatusBadge status={d.status} /></td>
                    <td>
                      <Link to={`/app/disputes/${d.id}`} className="btn btn-secondary text-xs py-1.5 px-3 rounded-xl flex items-center gap-1 font-semibold">
                        <span>Investigate</span> <ExternalLink size={11} />
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
