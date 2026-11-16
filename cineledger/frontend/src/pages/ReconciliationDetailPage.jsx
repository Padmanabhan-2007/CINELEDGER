import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Upload, Play, AlertTriangle, RefreshCw,
  ExternalLink, Receipt, MessageSquare, ArrowLeft,
  Shield
} from 'lucide-react';
import { reconciliationService, settlementService, disputeService } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import FilmPoster from '../components/FilmPoster';
import Modal from '../components/Modal';

export default function ReconciliationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recon, setRecon] = useState(null);
  const [discrepancies, setDiscrepancies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadType, setUploadType] = useState('THEATRE_POS');
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [selectedDiscrepancy, setSelectedDiscrepancy] = useState(null);
  const [disputeReason, setDisputeReason] = useState('');
  const [creatingDispute, setCreatingDispute] = useState(false);
  const [actionError, setActionError] = useState('');
  const [tab, setTab] = useState('overview');

  const load = async () => {
    try {
      setLoading(true);
      const data = await reconciliationService.getById(id);
      setRecon(data);
      try {
        const disc = await reconciliationService.getDiscrepancies(id);
        setDiscrepancies(Array.isArray(disc) ? disc : []);
      } catch { setDiscrepancies([]); }
    } catch (err) {
      console.error('Failed to load reconciliation', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setActionError('');
    try {
      await reconciliationService.uploadCsv(id, file, uploadType);
      await load();
    } catch (err) {
      setActionError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleRun = async () => {
    setRunning(true);
    setActionError('');
    try {
      await reconciliationService.run(id);
      await load();
    } catch (err) {
      setActionError(err.message || 'Reconciliation run failed');
    } finally {
      setRunning(false);
    }
  };

  const handleCalculateSettlement = async () => {
    setActionError('');
    try {
      const result = await settlementService.calculate(id, recon?.contractId || null);
      navigate(`/app/settlements/${result.id || result}`);
    } catch (err) {
      setActionError(err.message || 'Settlement calculation failed');
    }
  };

  const handleCreateDispute = async () => {
    if (!selectedDiscrepancy || !disputeReason.trim()) return;
    setCreatingDispute(true);
    try {
      await disputeService.create({
        reconciliationId: Number(id),
        discrepancyId: selectedDiscrepancy.id,
        reason: disputeReason,
        amountInQuestion: selectedDiscrepancy.varianceAmount || selectedDiscrepancy.amount || 0,
      });
      setShowDisputeModal(false);
      setDisputeReason('');
      setSelectedDiscrepancy(null);
      await load();
    } catch (err) {
      setActionError(err.message || 'Failed to create dispute');
    } finally {
      setCreatingDispute(false);
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
        <p className="text-xs font-mono text-[#817366]">Loading reconciliation workbench...</p>
      </div>
    );
  }

  if (!recon) {
    return (
      <div className="morph-card p-12 text-center space-y-3">
        <AlertTriangle size={32} className="text-[#B8755C] mx-auto" />
        <p className="text-sm font-semibold text-[#29211D]">Reconciliation not found.</p>
        <Link to="/app/reconciliations" className="btn btn-secondary text-xs">← Back to Reconciliations</Link>
      </div>
    );
  }

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'sources', label: 'Source Reports' },
    { key: 'discrepancies', label: `Discrepancies (${discrepancies.length})` },
    { key: 'settlement', label: 'Settlement' },
  ];

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Link to="/app/reconciliations" className="text-xs font-semibold text-[#817366] hover:text-[#C18C55] flex items-center gap-1 transition-colors">
        <ArrowLeft size={13} /> Back to Reconciliations
      </Link>

      {/* Header */}
      <div className="morph-card p-6 flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="flex items-start gap-4">
          <FilmPoster posterUrl={recon.filmPosterUrl} title={recon.filmTitle} height="h-24 w-16" className="shadow-md shrink-0" />
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#C18C55] font-bold">{recon.reconciliationNumber}</span>
            <h2 className="text-2xl font-serif font-bold text-[#29211D]">{recon.filmTitle}</h2>
            <p className="text-xs text-[#817366] mt-0.5">{recon.cinemaName} · {recon.cinemaCity} · {recon.periodStart} to {recon.periodEnd}</p>
            <div className="mt-2"><StatusBadge status={recon.status} /></div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button onClick={handleRun} disabled={running} className="btn btn-forest text-xs py-2 px-3.5 rounded-xl flex items-center gap-1.5">
            {running ? <RefreshCw size={14} className="animate-spin" /> : <Play size={14} />}
            {running ? 'Running Engine...' : 'Run Reconciliation'}
          </button>
          <button onClick={handleCalculateSettlement} className="btn btn-primary text-xs py-2 px-3.5 rounded-xl flex items-center gap-1.5">
            <Receipt size={14} /> Calculate Settlement
          </button>
        </div>
      </div>

      {/* Action Error */}
      {actionError && (
        <div className="p-3.5 rounded-xl bg-[#B8755C]/10 border border-[#B8755C]/30 flex items-center gap-2 text-xs text-[#9A5840]">
          <AlertTriangle size={15} />
          <span>{actionError}</span>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="morph-card p-4">
          <p className="text-[10px] uppercase font-mono tracking-wider text-[#817366] font-semibold">Theatre POS Total</p>
          <p className="text-xl font-mono font-bold text-[#29211D] mt-1 tabular-nums">{fmt(recon.totalPosAmount)}</p>
        </div>
        <div className="morph-card p-4">
          <p className="text-[10px] uppercase font-mono tracking-wider text-[#817366] font-semibold">Distributor Statement</p>
          <p className="text-xl font-mono font-bold text-[#817366] mt-1 tabular-nums">{fmt(recon.totalDistributorAmount)}</p>
        </div>
        <div className="morph-card p-4">
          <p className="text-[10px] uppercase font-mono tracking-wider text-[#817366] font-semibold">Net Variance</p>
          <p className={`text-xl font-mono font-bold mt-1 tabular-nums ${Number(recon.totalVariance) > 0 ? 'text-[#B8755C]' : Number(recon.totalVariance) < 0 ? 'text-[#B8755C]' : 'text-[#657B65]'}`}>
            {fmt(recon.totalVariance)}
          </p>
        </div>
        <div className="morph-card p-4">
          <p className="text-[10px] uppercase font-mono tracking-wider text-[#817366] font-semibold">Discrepancies</p>
          <p className="text-xl font-mono font-bold text-[#9E6E3B] mt-1 tabular-nums">{recon.discrepancyCount || discrepancies.length}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 morph-card p-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              tab === t.key
                ? 'bg-gradient-to-r from-[#C18C55] to-[#996D3D] text-white shadow-sm'
                : 'text-[#817366] hover:bg-white/80 hover:text-[#29211D]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="morph-card p-6 shadow-sm min-h-[300px]">
        {tab === 'overview' && (
          <div className="space-y-4">
            <h3 className="font-serif font-bold text-lg text-[#29211D]">Reconciliation Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-[#F4EDE1]/60 border border-[rgba(129,115,102,0.16)] space-y-1">
                <p className="text-[10px] uppercase font-mono tracking-wider text-[#817366] font-semibold">Film Title</p>
                <p className="font-serif font-bold text-[#29211D]">{recon.filmTitle}</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#F4EDE1]/60 border border-[rgba(129,115,102,0.16)] space-y-1">
                <p className="text-[10px] uppercase font-mono tracking-wider text-[#817366] font-semibold">Cinema Venue</p>
                <p className="font-serif font-bold text-[#29211D]">{recon.cinemaName}</p>
                <p className="text-[10px] font-mono text-[#817366]">{recon.cinemaCity}</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#F4EDE1]/60 border border-[rgba(129,115,102,0.16)] space-y-1">
                <p className="text-[10px] uppercase font-mono tracking-wider text-[#817366] font-semibold">Bound Contract</p>
                <p className="font-serif font-bold text-[#29211D]">{recon.contractNumber || 'Not Bound'}</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#F4EDE1]/60 border border-[rgba(129,115,102,0.16)] space-y-1">
                <p className="text-[10px] uppercase font-mono tracking-wider text-[#817366] font-semibold">Source Reports</p>
                <p className="font-serif font-bold text-[#29211D]">{recon.sourceReportCount || 0} files ingested</p>
              </div>
            </div>
          </div>
        )}

        {tab === 'sources' && (
          <div className="space-y-4">
            <h3 className="font-serif font-bold text-lg text-[#29211D]">Source Report Uploads</h3>
            {/* Upload Area */}
            <div className="p-8 rounded-2xl border-2 border-dashed border-[rgba(129,115,102,0.28)] hover:border-[#C18C55]/60 bg-[#FBF8F2]/60 transition-all text-center space-y-3">
              <Upload size={32} className="mx-auto text-[#C18C55]" />
              <p className="text-sm font-semibold text-[#29211D]">Upload CSV Source Reports</p>
              <p className="text-xs text-[#817366]">Theatre POS exports, distributor statement files, or ticket-level transaction datasets</p>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <select
                  value={uploadType}
                  onChange={(e) => setUploadType(e.target.value)}
                  className="form-select text-xs py-2 px-3 w-auto"
                >
                  <option value="THEATRE_POS">Theatre POS</option>
                  <option value="DISTRIBUTOR_EDI">Distributor Statement</option>
                  <option value="TICKET_LEVEL">Ticket-Level Stream</option>
                </select>
                <label className="btn btn-primary text-xs py-2 px-4 cursor-pointer rounded-xl">
                  <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
                  {uploading ? <><RefreshCw size={13} className="animate-spin" /> Uploading...</> : <><Upload size={13} /> Select CSV File</>}
                </label>
              </div>
            </div>
            {/* Source Reports List */}
            {recon.sourceReports && recon.sourceReports.length > 0 && (
              <div className="table-container mt-4">
                <table className="cine-table">
                  <thead>
                    <tr>
                      <th>Report</th>
                      <th>Type</th>
                      <th>Rows</th>
                      <th>Valid</th>
                      <th>Errors</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recon.sourceReports.map((sr) => (
                      <tr key={sr.id}>
                        <td className="text-xs font-mono font-semibold text-[#C18C55]">{sr.filename}</td>
                        <td className="text-xs text-[#817366]">{sr.reportType}</td>
                        <td className="text-xs font-mono tabular-nums">{sr.totalRows}</td>
                        <td className="text-xs font-mono text-[#465B46] font-semibold tabular-nums">{sr.validRows}</td>
                        <td className="text-xs font-mono text-[#9A5840] font-semibold tabular-nums">{sr.errorRows || 0}</td>
                        <td><StatusBadge status={sr.status || 'PROCESSED'} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {tab === 'discrepancies' && (
          <div className="space-y-4">
            <h3 className="font-serif font-bold text-lg text-[#29211D]">Detected Discrepancies</h3>
            {discrepancies.length === 0 ? (
              <div className="text-center py-12 space-y-2">
                <Shield size={36} className="mx-auto text-[#657B65]" />
                <p className="font-serif font-bold text-base text-[#29211D]">No Discrepancies Detected</p>
                <p className="text-xs text-[#817366]">Run the reconciliation engine above to cross-examine POS and distributor datasets.</p>
              </div>
            ) : (
              <div className="table-container">
                <table className="cine-table">
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Transaction ID</th>
                      <th>POS Amount</th>
                      <th>Distributor Amount</th>
                      <th>Variance</th>
                      <th>Explanation</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {discrepancies.map((d) => (
                      <tr key={d.id}>
                        <td>
                          <span className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full ${
                            d.type === 'AMOUNT_MISMATCH' ? 'bg-[#B8755C]/15 text-[#9A5840] border border-[#B8755C]/30' :
                            d.type === 'DUPLICATE_TRANSACTION' ? 'bg-[#C18C55]/15 text-[#8C5E2E] border border-[#C18C55]/30' :
                            'bg-[#657B65]/15 text-[#465B46] border border-[#657B65]/30'
                          }`}>
                            {d.type?.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="font-mono text-xs font-semibold text-[#C18C55]">{d.transactionId || d.reference || '—'}</td>
                        <td className="font-mono text-xs text-[#29211D] tabular-nums">{fmt(d.posAmount)}</td>
                        <td className="font-mono text-xs text-[#817366] tabular-nums">{fmt(d.distributorAmount)}</td>
                        <td className={`font-mono text-xs font-bold tabular-nums ${Number(d.varianceAmount) > 0 ? 'text-[#B8755C]' : 'text-[#657B65]'}`}>
                          {fmt(d.varianceAmount)}
                        </td>
                        <td className="text-xs text-[#817366] max-w-xs truncate">{d.explanation || d.description || '—'}</td>
                        <td>
                          <button
                            onClick={() => { setSelectedDiscrepancy(d); setShowDisputeModal(true); }}
                            className="btn btn-outline-brass text-[11px] py-1 px-2.5 rounded-lg flex items-center gap-1"
                          >
                            <MessageSquare size={12} /> Dispute
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {tab === 'settlement' && (
          <div className="space-y-4 text-center py-12">
            <Receipt size={36} className="mx-auto text-[#C18C55]" />
            <h3 className="font-serif font-bold text-lg text-[#29211D]">Contract Settlement Calculation</h3>
            <p className="text-xs text-[#817366]">Execute automated deduction waterfall and distributor split rules.</p>
            <button onClick={handleCalculateSettlement} className="btn btn-primary text-xs inline-flex items-center gap-1.5 mt-2">
              <Receipt size={14} /> Calculate Settlement
            </button>
            {recon.settlementId && (
              <div className="mt-4">
                <Link to={`/app/settlements/${recon.settlementId}`} className="btn btn-secondary text-xs inline-flex items-center gap-1.5">
                  <ExternalLink size={12} /> View Existing Settlement
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Dispute Modal */}
      <Modal
        isOpen={showDisputeModal}
        onClose={() => setShowDisputeModal(false)}
        title="Open Dispute Case"
        subtitle={selectedDiscrepancy ? `Disputing: ${selectedDiscrepancy.type?.replace(/_/g, ' ')} · ${fmt(selectedDiscrepancy.varianceAmount)}` : ''}
      >
        <div className="space-y-4">
          <div className="form-group">
            <label className="form-label">Dispute Reason</label>
            <textarea
              className="form-textarea"
              rows={4}
              placeholder="Describe the grounds for this dispute..."
              value={disputeReason}
              onChange={(e) => setDisputeReason(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2.5 pt-2">
            <button onClick={() => setShowDisputeModal(false)} className="btn btn-secondary text-xs">Cancel</button>
            <button
              onClick={handleCreateDispute}
              disabled={creatingDispute || !disputeReason.trim()}
              className="btn btn-primary text-xs flex items-center gap-1.5"
            >
              {creatingDispute ? <RefreshCw size={13} className="animate-spin" /> : <AlertTriangle size={13} />}
              <span>{creatingDispute ? 'Creating...' : 'Open Dispute'}</span>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
