import React, { useState, useEffect, useRef } from 'react';
import { UploadCloud, RefreshCw, AlertTriangle, CheckCircle2, XCircle, Download } from 'lucide-react';
import { reconciliationService } from '../services/api';

export default function ImportsPage() {
  const [reconciliations, setReconciliations] = useState([]);
  const [selectedRecon, setSelectedRecon] = useState('');
  const [reportType, setReportType] = useState('THEATRE_POS');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [error, setError] = useState('');
  const fileRef = useRef(null);

  useEffect(() => {
    reconciliationService.getAll()
      .then((res) => setReconciliations(Array.isArray(res) ? res : []))
      .catch((err) => console.error('Failed to load reconciliations', err))
      .finally(() => setLoading(false));
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!selectedRecon) {
      setError('Please select a reconciliation cycle first.');
      return;
    }
    if (!file.name.endsWith('.csv')) {
      setError('Only .csv files are supported.');
      return;
    }
    setUploading(true);
    setError('');
    setUploadResult(null);
    try {
      const result = await reconciliationService.uploadCsv(selectedRecon, file, reportType);
      setUploadResult(result);
    } catch (err) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const fakeEvent = { target: { files: [file] } };
      handleUpload(fakeEvent);
    }
  };

  const sampleCsvContent = `transaction_id,date,film_title,screen,ticket_type,amount,quantity,refund
TXN-001,2026-03-15,Dune: Part Two,Screen 1,REGULAR,250.00,2,false
TXN-002,2026-03-15,Dune: Part Two,Screen 1,PREMIUM,450.00,1,false
TXN-003,2026-03-15,Dune: Part Two,Screen 2,REGULAR,250.00,3,false
TXN-004,2026-03-16,Dune: Part Two,Screen 1,COMPLIMENTARY,0.00,2,false
TXN-005,2026-03-16,Dune: Part Two,Screen 2,REGULAR,250.00,1,true`;

  const downloadSampleCsv = () => {
    const blob = new Blob([sampleCsvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cineledger_sample_import.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#C18C55] font-semibold">DATA INGESTION</span>
          <h2 className="text-2xl font-serif font-bold text-[#29211D]">Multi-Source Data Ingestion</h2>
          <p className="text-xs text-[#817366] mt-0.5">Upload theatre POS exports, distributor statements, and ticket-level transaction datasets</p>
        </div>
        <button onClick={downloadSampleCsv} className="btn btn-secondary text-xs py-2 px-3.5 rounded-xl flex items-center gap-1.5 self-start font-semibold">
          <Download size={14} className="text-[#C18C55]" /> Download Sample CSV
        </button>
      </div>

      {/* Configuration */}
      <div className="morph-card p-6 space-y-4">
        <h3 className="font-serif font-bold text-lg text-[#29211D]">Ingestion Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label className="form-label">Target Reconciliation</label>
            <select className="form-select" value={selectedRecon} onChange={(e) => { setSelectedRecon(e.target.value); setError(''); }}>
              <option value="">— Select a reconciliation cycle —</option>
              {reconciliations.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.reconciliationNumber} — {r.filmTitle} ({r.periodStart} to {r.periodEnd})
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Report Type</label>
            <select className="form-select" value={reportType} onChange={(e) => setReportType(e.target.value)}>
              <option value="THEATRE_POS">Theatre POS Export</option>
              <option value="DISTRIBUTOR_EDI">Distributor Statement</option>
              <option value="TICKET_LEVEL">Ticket-Level Transactions</option>
            </select>
          </div>
        </div>
      </div>

      {/* Upload Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
        onDrop={handleDrop}
        className="morph-card border-2 border-dashed border-[rgba(129,115,102,0.3)] hover:border-[#C18C55] rounded-3xl p-12 text-center transition-all cursor-pointer group bg-[#FBF8F2]/60"
        onClick={() => fileRef.current?.click()}
      >
        <input ref={fileRef} type="file" accept=".csv" onChange={handleUpload} className="hidden" />
        {uploading ? (
          <div className="space-y-3">
            <RefreshCw size={36} className="mx-auto text-[#C18C55] animate-spin" />
            <p className="font-serif font-bold text-lg text-[#29211D]">Processing Upload...</p>
            <p className="text-xs text-[#817366]">Parsing rows, validating checksums, and calculating variances</p>
          </div>
        ) : (
          <div className="space-y-3">
            <UploadCloud size={40} className="mx-auto text-[#817366] group-hover:text-[#C18C55] transition-colors" />
            <p className="font-serif font-bold text-lg text-[#29211D]">Drag &amp; Drop CSV File</p>
            <p className="text-xs text-[#817366]">or click to browse filesystem · Supported format: .csv · Max 10MB</p>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="p-3.5 rounded-xl bg-[#B8755C]/10 border border-[#B8755C]/30 flex items-center gap-2 text-xs text-[#9A5840]">
          <AlertTriangle size={15} /> <span>{error}</span>
        </div>
      )}

      {/* Upload Result */}
      {uploadResult && (
        <div className="morph-card p-6 space-y-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-[#657B65]" />
            <h3 className="font-serif font-bold text-lg text-[#29211D]">Import Complete</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
            <div className="p-4 rounded-2xl bg-[#F4EDE1]/60 border border-[rgba(129,115,102,0.16)] text-center">
              <p className="text-[10px] uppercase font-mono tracking-wider text-[#817366] font-semibold">Total Rows</p>
              <p className="text-xl font-mono font-bold text-[#29211D] mt-1 tabular-nums">{uploadResult.totalRows || 0}</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#F4EDE1]/60 border border-[rgba(129,115,102,0.16)] text-center">
              <p className="text-[10px] uppercase font-mono tracking-wider text-[#817366] font-semibold">Valid</p>
              <p className="text-xl font-mono font-bold text-[#465B46] mt-1 tabular-nums">{uploadResult.validRows || 0}</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#F4EDE1]/60 border border-[rgba(129,115,102,0.16)] text-center">
              <p className="text-[10px] uppercase font-mono tracking-wider text-[#817366] font-semibold">Errors</p>
              <p className="text-xl font-mono font-bold text-[#9A5840] mt-1 tabular-nums">{uploadResult.errorRows || 0}</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#F4EDE1]/60 border border-[rgba(129,115,102,0.16)] text-center">
              <p className="text-[10px] uppercase font-mono tracking-wider text-[#817366] font-semibold">Duplicates</p>
              <p className="text-xl font-mono font-bold text-[#9E6E3B] mt-1 tabular-nums">{uploadResult.duplicateRows || 0}</p>
            </div>
          </div>
          {uploadResult.errors && uploadResult.errors.length > 0 && (
            <div className="space-y-2 pt-2">
              <p className="text-xs font-semibold text-[#9A5840]">Row-Level Errors:</p>
              <div className="max-h-48 overflow-y-auto space-y-1">
                {uploadResult.errors.map((err, i) => (
                  <div key={i} className="flex items-start gap-2 text-[11px] text-[#9A5840] bg-[#B8755C]/10 border border-[#B8755C]/20 rounded-xl p-2.5">
                    <XCircle size={13} className="flex-shrink-0 mt-0.5" />
                    <span>Row {err.row || i + 1}: {err.message}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Template Info */}
      <div className="morph-card p-6 space-y-3">
        <h3 className="font-serif font-bold text-lg text-[#29211D]">Expected CSV Schema</h3>
        <p className="text-xs text-[#817366]">All source reports must adhere to standard columns for automated validation and hash verification.</p>
        <div className="overflow-x-auto rounded-xl border border-[rgba(129,115,102,0.18)]">
          <pre className="text-xs font-mono text-[#29211D] p-4 bg-[#F4EDE1]/80 whitespace-pre overflow-x-auto">
{sampleCsvContent}
          </pre>
        </div>
        <div className="flex flex-wrap gap-2 pt-1">
          {['transaction_id', 'date', 'film_title', 'screen', 'ticket_type', 'amount', 'quantity', 'refund'].map((col) => (
            <span key={col} className="text-[10px] font-mono px-2.5 py-1 rounded-lg bg-white border border-[rgba(129,115,102,0.2)] text-[#9E6E3B] font-semibold">
              {col}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
