import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, RefreshCw, AlertTriangle, CheckCircle2, FileText } from 'lucide-react';
import { settlementService } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import FilmPoster from '../components/FilmPoster';

export default function SettlementDetailPage() {
  const { id } = useParams();
  const [settlement, setSettlement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      const data = await settlementService.getById(id);
      setSettlement(data);
    } catch (err) {
      console.error('Failed to load settlement', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  const handleApprove = async () => {
    setApproving(true);
    setError('');
    try {
      await settlementService.approve(id, `PAY-${Date.now()}`);
      await load();
    } catch (err) {
      setError(err.message || 'Approval failed');
    } finally {
      setApproving(false);
    }
  };

  const fmt = (val) => {
    if (val === null || val === undefined) return '₹0.00';
    return `₹${Number(val).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-2">
        <RefreshCw size={22} className="animate-spin text-[#C18C55]" />
        <p className="text-xs font-mono text-[#817366]">Loading settlement voucher...</p>
      </div>
    );
  }

  if (!settlement) {
    return (
      <div className="morph-card p-12 text-center space-y-3">
        <AlertTriangle size={32} className="text-[#B8755C] mx-auto" />
        <p className="text-sm font-semibold text-[#29211D]">Settlement not found.</p>
        <Link to="/app/settlements" className="btn btn-secondary text-xs">← Back to Settlements</Link>
      </div>
    );
  }

  const lineItems = settlement.lineItems || [];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <Link to="/app/settlements" className="text-xs font-semibold text-[#817366] hover:text-[#C18C55] flex items-center gap-1 transition-colors">
        <ArrowLeft size={13} /> Back to Settlements
      </Link>

      {/* Settlement Voucher Header */}
      <div className="morph-card overflow-hidden">
        <div className="p-6 sm:p-8 border-b border-[rgba(129,115,102,0.16)] bg-gradient-to-r from-[#FBF8F2] to-[#F4EDE1]">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <FilmPoster posterUrl={settlement.filmPosterUrl} title={settlement.filmTitle} height="h-24 w-16" className="shadow-md shrink-0" />
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#C18C55] font-bold">SETTLEMENT VOUCHER</span>
                <h2 className="text-2xl font-serif font-bold text-[#29211D]">
                  {settlement.settlementNumber || `STL-${settlement.id}`}
                </h2>
                <p className="text-xs text-[#817366] mt-0.5">
                  {settlement.filmTitle} · {settlement.cinemaName || '—'} · {settlement.periodStart} to {settlement.periodEnd}
                </p>
                <div className="mt-2"><StatusBadge status={settlement.status} /></div>
              </div>
            </div>
            <div className="flex gap-2">
              {settlement.status !== 'APPROVED' && settlement.status !== 'SETTLED' && (
                <button onClick={handleApprove} disabled={approving} className="btn btn-primary text-xs py-2.5 px-4 rounded-xl flex items-center gap-1.5">
                  {approving ? <RefreshCw size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                  {approving ? 'Approving...' : 'Approve Payout'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="m-6 p-3.5 rounded-xl bg-[#B8755C]/10 border border-[#B8755C]/30 flex items-center gap-2 text-xs text-[#9A5840]">
            <AlertTriangle size={15} /> {error}
          </div>
        )}

        {/* Contract Info */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-[rgba(129,115,102,0.14)] bg-white/40">
          <div className="p-4 rounded-2xl bg-[#F4EDE1]/65 border border-[rgba(129,115,102,0.16)]">
            <p className="text-[10px] uppercase font-mono tracking-wider text-[#817366] font-semibold">Contract</p>
            <p className="font-serif font-bold text-[#29211D] mt-1">{settlement.contractNumber || 'Standard'}</p>
            <p className="text-[10px] text-[#817366] font-mono">Version: {settlement.contractVersion || 'v1'}</p>
          </div>
          <div className="p-4 rounded-2xl bg-[#F4EDE1]/65 border border-[rgba(129,115,102,0.16)]">
            <p className="text-[10px] uppercase font-mono tracking-wider text-[#817366] font-semibold">Revenue Share</p>
            <p className="font-serif font-bold text-[#9E6E3B] text-xl mt-1 tabular-nums">{settlement.revenueSharePercent || settlement.sharePercentage || '—'}%</p>
          </div>
          <div className="p-4 rounded-2xl bg-[#F4EDE1]/65 border border-[rgba(129,115,102,0.16)]">
            <p className="text-[10px] uppercase font-mono tracking-wider text-[#817366] font-semibold">Rounding Policy</p>
            <p className="font-serif font-bold text-[#29211D] mt-1">{settlement.roundingPolicy || 'HALF_UP'}</p>
            <p className="text-[10px] text-[#817366] font-mono">Scale: 2 decimal places</p>
          </div>
        </div>

        {/* Line Items */}
        <div className="p-6 space-y-4">
          <h3 className="font-serif font-bold text-lg text-[#29211D]">Financial Waterfall Breakdown</h3>

          <div className="table-container">
            <table className="cine-table">
              <thead>
                <tr>
                  <th>Line Item</th>
                  <th style={{ textAlign: 'right' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {/* Settlement Basis */}
                <tr>
                  <td className="text-sm font-semibold text-[#29211D]">Settlement Basis (Gross Box-Office Collection)</td>
                  <td className="font-mono text-sm font-bold text-[#29211D] text-right tabular-nums">{fmt(settlement.settlementBasis || settlement.grossRevenue)}</td>
                </tr>
                {/* Dynamic line items */}
                {lineItems.map((item, i) => (
                  <tr key={i}>
                    <td className="text-xs text-[#29211D]">
                      {item.description || item.label}
                      {item.percentage && <span className="text-[#C18C55] font-semibold ml-1">({item.percentage}%)</span>}
                    </td>
                    <td className={`font-mono text-xs font-semibold text-right tabular-nums ${Number(item.amount) < 0 ? 'text-[#9A5840]' : 'text-[#817366]'}`}>
                      {Number(item.amount) < 0 ? `(${fmt(Math.abs(item.amount))})` : fmt(item.amount)}
                    </td>
                  </tr>
                ))}
                {/* Show defaults if no line items */}
                {lineItems.length === 0 && (
                  <>
                    <tr>
                      <td className="text-xs text-[#29211D]">
                        Revenue Share @ {settlement.revenueSharePercent || settlement.sharePercentage || '—'}%
                      </td>
                      <td className="font-mono text-xs font-medium text-[#29211D] text-right tabular-nums">
                        {fmt(settlement.revenueShareAmount || settlement.shareAmount)}
                      </td>
                    </tr>
                    {settlement.gstAmount && Number(settlement.gstAmount) !== 0 && (
                      <tr>
                        <td className="text-xs text-[#29211D]">GST Deduction</td>
                        <td className="font-mono text-xs font-medium text-[#9A5840] text-right tabular-nums">({fmt(settlement.gstAmount)})</td>
                      </tr>
                    )}
                    {settlement.tdsAmount && Number(settlement.tdsAmount) !== 0 && (
                      <tr>
                        <td className="text-xs text-[#29211D]">TDS Deduction</td>
                        <td className="font-mono text-xs font-medium text-[#9A5840] text-right tabular-nums">({fmt(settlement.tdsAmount)})</td>
                      </tr>
                    )}
                  </>
                )}
                {/* Final Amount */}
                <tr className="border-t-2 border-[#C18C55]/40 bg-[#F4EDE1]/45">
                  <td className="font-serif font-bold text-base text-[#29211D]">Net Payable Amount</td>
                  <td className="font-mono text-lg font-bold text-[#465B46] text-right tabular-nums">
                    {fmt(settlement.netPayable || settlement.finalAmount)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Approval Info */}
        {settlement.approvedBy && (
          <div className="px-6 pb-6">
            <div className="p-4 rounded-2xl bg-[#657B65]/12 border border-[#657B65]/30 flex items-center gap-3">
              <CheckCircle2 size={20} className="text-[#465B46] flex-shrink-0" />
              <div>
                <p className="text-xs font-bold text-[#465B46]">Approved by {settlement.approvedBy}</p>
                <p className="text-[11px] text-[#817366] font-mono">{settlement.approvedAt} · Payment Ref: {settlement.paymentReference || '—'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Related Reconciliation */}
        {settlement.reconciliationId && (
          <div className="px-6 pb-6">
            <Link
              to={`/app/reconciliations/${settlement.reconciliationId}`}
              className="p-3.5 rounded-2xl bg-white/80 border border-[rgba(129,115,102,0.18)] hover:border-[#C18C55] transition-all text-xs font-semibold text-[#29211D] flex items-center gap-2 shadow-sm"
            >
              <FileText size={15} className="text-[#C18C55]" />
              <span>View Related Reconciliation Case</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
