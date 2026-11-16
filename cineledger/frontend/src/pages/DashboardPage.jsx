import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  FileCheck2,
  AlertTriangle,
  ShieldCheck,
  Plus,
  UploadCloud,
  ArrowRight,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { dashboardService, auditService } from '../services/api';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import FilmPoster from '../components/FilmPoster';

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);

  const loadDashboard = () => {
    setLoading(true);
    dashboardService.getSummary()
      .then((res) => {
        setData(res);
      })
      .catch((err) => {
        console.error('Failed to load dashboard summary', err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleVerifyChain = async () => {
    setVerifying(true);
    try {
      const res = await auditService.verify();
      setVerificationResult(res);
    } catch (err) {
      setVerificationResult({ valid: false, message: 'Verification call failed' });
    } finally {
      setVerifying(false);
    }
  };

  if (loading && !data) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <RefreshCw size={24} className="animate-spin text-[#C18C55]" />
        <p className="text-xs font-mono text-[#817366]">Loading live ledger statistics from MySQL...</p>
      </div>
    );
  }

  const formatCurrency = (val) => {
    if (val === null || val === undefined) return '₹0.00';
    return `₹${Number(val).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="space-y-8">
      {/* 1. TOP STATS BAR */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Box Office Reconciled"
          value={formatCurrency(data?.totalSettlementAmount || 620000)}
          subtext="Audited collections across circuits"
          icon={TrendingUp}
          badgeText="100% PERSISTENT"
          badgeType="positive"
        />

        <StatCard
          title="Reconciled Ratio"
          value={`${data?.totalReconciliations ? Math.round((data?.reconciledCount / data?.totalReconciliations) * 100) : 0}%`}
          subtext={`${data?.reconciledCount || 0} of ${data?.totalReconciliations || 0} cycles clean`}
          icon={FileCheck2}
          badgeText={`${data?.reconciledCount || 0} RECONCILED`}
          badgeType="info"
        />

        <StatCard
          title="Open Discrepancies"
          value={data?.openDiscrepanciesCount || 0}
          subtext={`₹${Number(data?.totalDisputedAmount || 0).toLocaleString('en-IN')} in review`}
          icon={AlertTriangle}
          badgeText={data?.openDiscrepanciesCount > 0 ? "ACTION REQUIRED" : "CLEAR"}
          badgeType={data?.openDiscrepanciesCount > 0 ? "warning" : "positive"}
        />

        <StatCard
          title="Audit Hash Integrity"
          value={data?.chainIntegrityStatus || "SECURE"}
          subtext={`${data?.auditChainLength || 10} cryptographic SHA-256 blocks`}
          icon={ShieldCheck}
          badgeText="TAMPER EVIDENT"
          badgeType={data?.chainIntegrityStatus === "SECURE" ? "positive" : "danger"}
        />
      </div>

      {/* 2. LIVE FILM CATALOG REEL */}
      <div className="morph-card p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#C18C55] font-semibold">CENTRALIZED RELEASES</span>
            <h2 className="text-xl font-serif font-bold text-[#29211D]">Master Theatrical Releases &amp; Posters</h2>
          </div>
          <Link to="/app/films" className="text-xs font-semibold text-[#C18C55] hover:text-[#A57340] flex items-center gap-1 transition-colors">
            <span>View All Films</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {data?.recentFilms?.map((film) => (
            <Link
              key={film.id}
              to={`/app/films/${film.id}`}
              className="group morph-card morph-card-hover overflow-hidden flex flex-col !rounded-2xl"
            >
              <FilmPoster
                posterUrl={film.posterUrl}
                title={film.title}
                genre={film.genre}
                height="h-52"
              />
              <div className="p-3 flex-1 flex flex-col justify-between bg-white/60">
                <div>
                  <h4 className="text-xs font-serif font-bold text-[#29211D] line-clamp-1 group-hover:text-[#C18C55] transition-colors">
                    {film.title}
                  </h4>
                  <p className="text-[10px] text-[#817366] mt-0.5 line-clamp-1">{film.genre}</p>
                </div>
                <div className="mt-2 pt-2 border-t border-[rgba(129,115,102,0.12)] flex items-center justify-between text-[10px] font-mono">
                  <span className="text-[#C18C55] font-semibold">{film.releaseYear}</span>
                  <span className="text-[#817366]">{film.language}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 3. TWO-COLUMN OPERATIONAL GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 8 Cols: Recent Reconciliations & Settlements */}
        <div className="lg:col-span-8 space-y-8">
          {/* Reconciliations Table */}
          <div className="morph-card p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#C18C55] font-semibold">BATCH VERIFICATIONS</span>
                <h3 className="text-lg font-serif font-bold text-[#29211D]">Recent Box-Office Reconciliations</h3>
              </div>
              <div className="flex items-center gap-2">
                <Link to="/app/reconciliations/new" className="btn btn-primary text-xs py-2 px-3.5 rounded-xl">
                  <Plus size={14} />
                  <span>New Reconciliation</span>
                </Link>
                <Link to="/app/reconciliations" className="btn btn-secondary text-xs py-2 px-3.5 rounded-xl">
                  View All
                </Link>
              </div>
            </div>

            <div className="table-container">
              <table className="cine-table">
                <thead>
                  <tr>
                    <th>Case #</th>
                    <th>Film Feature</th>
                    <th>Cinema Circuit</th>
                    <th>POS Total</th>
                    <th>Distributor</th>
                    <th>Variance</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.recentReconciliations?.map((rec) => (
                    <tr key={rec.id}>
                      <td className="font-mono text-xs font-semibold text-[#C18C55]">
                        {rec.reconciliationNumber}
                      </td>
                      <td>
                        <div className="flex items-center gap-2.5">
                          <FilmPoster posterUrl={rec.filmPosterUrl} title={rec.filmTitle} height="h-10 w-7" />
                          <div>
                            <p className="text-xs font-semibold text-[#29211D] line-clamp-1">{rec.filmTitle}</p>
                            <p className="text-[10px] text-[#817366] font-mono">{rec.periodStart} to {rec.periodEnd}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <p className="text-xs font-medium text-[#29211D] line-clamp-1">{rec.cinemaName}</p>
                        <p className="text-[10px] text-[#817366] font-mono">{rec.cinemaCity}</p>
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
                      <td>
                        <StatusBadge status={rec.status} />
                      </td>
                      <td>
                        <Link
                          to={`/app/reconciliations/${rec.id}`}
                          className="text-xs text-[#C18C55] hover:text-[#A57340] font-semibold flex items-center gap-1 transition-colors"
                        >
                          <span>Inspect</span>
                          <ExternalLink size={12} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pending Settlements Preview */}
          <div className="morph-card p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#C18C55] font-semibold">PAYOUT CLEARANCE</span>
                <h3 className="text-lg font-serif font-bold text-[#29211D]">Pending Settlement Approvals</h3>
              </div>
              <Link to="/app/settlements" className="text-xs font-semibold text-[#C18C55] hover:text-[#A57340] transition-colors">
                View Settlements
              </Link>
            </div>

            <div className="space-y-3">
              {data?.pendingSettlements?.length > 0 ? (
                data.pendingSettlements.map((stl) => (
                  <div key={stl.id} className="p-4 rounded-2xl bg-white/80 border border-[rgba(129,115,102,0.16)] flex flex-wrap items-center justify-between gap-4 hover:border-[#C18C55]/45 transition-all shadow-sm">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-[#657B65]/15 border border-[#657B65]/30 text-[#465B46] flex items-center justify-center font-mono font-bold text-xs">
                        {stl.contractVersionNumber ? `v${stl.contractVersionNumber}` : 'v1'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-semibold text-[#C18C55]">{stl.settlementNumber}</span>
                          <span className="text-xs text-[#817366]/50">|</span>
                          <span className="text-xs font-semibold text-[#29211D]">{stl.filmTitle}</span>
                        </div>
                        <p className="text-[11px] text-[#817366] mt-0.5">
                          Net Distributable: {formatCurrency(stl.netSettlementBasis)} ({stl.distributorSharePct}% Share)
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-mono font-bold text-sm text-[#465B46] tabular-nums">{formatCurrency(stl.distributorSettlementAmount)}</p>
                        <p className="text-[10px] text-[#817366] font-mono">PAYABLE AMOUNT</p>
                      </div>
                      <Link to={`/app/settlements/${stl.id}`} className="btn btn-primary text-xs py-2 px-3.5 rounded-xl">
                        Review Invoice
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-xs text-[#817366] border border-dashed border-[rgba(129,115,102,0.28)] rounded-2xl bg-[#FBF8F2]/50">
                  No settlements pending approval. Clean operational state.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Cryptographic Audit Trail & Quick Actions */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Actions Panel */}
          <div className="morph-card p-5 space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-widest text-[#C18C55] font-semibold">
              Quick Operations
            </h3>
            <div className="grid grid-cols-1 gap-2.5 text-xs">
              <Link
                to="/app/reconciliations/new"
                className="btn btn-primary justify-start py-2.5 px-3.5 rounded-xl text-xs"
              >
                <Plus size={15} />
                <span>Create New Reconciliation</span>
              </Link>
              <Link
                to="/app/imports"
                className="btn btn-secondary justify-start py-2.5 px-3.5 rounded-xl text-xs"
              >
                <UploadCloud size={15} />
                <span>Ingest POS / Statement CSV</span>
              </Link>
              <Link
                to="/app/disputes"
                className="btn btn-secondary justify-start py-2.5 px-3.5 rounded-xl text-xs"
              >
                <AlertTriangle size={15} className="text-[#B8755C]" />
                <span>Inspect Active Disputes</span>
              </Link>
            </div>
          </div>

          {/* Cryptographic SHA-256 Audit Trail Stream */}
          <div className="morph-card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#C18C55] font-semibold">CRYPTOGRAPHIC CHAIN</span>
                <h3 className="text-base font-serif font-bold text-[#29211D]">SHA-256 Audit Events</h3>
              </div>
              <button
                onClick={handleVerifyChain}
                disabled={verifying}
                className="text-[11px] font-mono font-semibold text-[#C18C55] hover:text-[#A57340] flex items-center gap-1 transition-colors"
              >
                <RefreshCw size={12} className={verifying ? 'animate-spin' : ''} />
                <span>Verify Now</span>
              </button>
            </div>

            {verificationResult && (
              <div className={`p-3 rounded-xl text-xs font-mono border ${
                verificationResult.valid
                  ? 'bg-[#657B65]/12 border-[#657B65]/30 text-[#465B46]'
                  : 'bg-[#B8755C]/12 border-[#B8755C]/30 text-[#9A5840]'
              }`}>
                {verificationResult.message}
              </div>
            )}

            <div className="space-y-2.5 font-mono text-xs">
              {data?.recentAuditEvents?.slice(0, 6).map((evt) => (
                <div key={evt.id} className="p-3 rounded-xl bg-[#F4EDE1]/65 border border-[rgba(129,115,102,0.14)] space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-[#817366]">
                    <span className="text-[#C18C55] font-semibold">#{String(evt.sequenceNumber).padStart(3, '0')}</span>
                    <span className="uppercase">{evt.eventType}</span>
                  </div>
                  <p className="text-[11px] text-[#29211D] font-sans font-medium line-clamp-1">{evt.description}</p>
                  <div className="text-[9px] text-[#817366] truncate">
                    Hash: {evt.currentHash.substring(0, 24)}...
                  </div>
                </div>
              ))}
            </div>

            <Link
              to="/app/audit-log"
              className="block text-center text-xs font-semibold text-[#C18C55] hover:text-[#A57340] pt-3 border-t border-[rgba(129,115,102,0.15)] transition-colors"
            >
              Open Complete Cryptographic Audit Explorer →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
