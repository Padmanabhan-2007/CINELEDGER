import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  RefreshCw,
  AlertTriangle,
  History,
  Lock,
  RotateCcw,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { auditService } from '../services/api';

export default function AuditLogPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState(null);
  const [actionMsg, setActionMsg] = useState(null);

  const loadEvents = () => {
    setLoading(true);
    auditService.getAll(true)
      .then((res) => {
        setEvents(res || []);
      })
      .catch((err) => console.error('Failed to load audit events', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleVerify = async () => {
    setVerifying(true);
    setActionMsg(null);
    try {
      const res = await auditService.verify();
      setVerifyResult(res);
      setActionMsg({
        type: res.valid ? 'success' : 'error',
        text: res.message || (res.valid ? 'Cryptographic SHA-256 chain is valid!' : 'Integrity check failed!')
      });
    } catch (err) {
      setActionMsg({ type: 'error', text: err.message || 'Verification request failed' });
    } finally {
      setVerifying(false);
    }
  };

  const handleTamperTest = async (eventId) => {
    try {
      await auditService.tamperTest(eventId, 'MALICIOUS_UNAUTHORIZED_MUTATION');
      setActionMsg({
        type: 'warning',
        text: `Tampered event #${eventId} for testing. Run "Verify Hash Chain" to see cryptographic detection in action.`
      });
      loadEvents();
    } catch (err) {
      setActionMsg({ type: 'error', text: err.message || 'Tamper simulation failed' });
    }
  };

  const handleRestoreChain = async () => {
    try {
      await auditService.restoreChain();
      setActionMsg({
        type: 'success',
        text: 'Audit chain restored and re-anchored successfully. All SHA-256 hashes recomputed.'
      });
      setVerifyResult(null);
      loadEvents();
    } catch (err) {
      setActionMsg({ type: 'error', text: err.message || 'Chain restoration failed' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="morph-card flex flex-col md:flex-row md:items-center justify-between gap-4 p-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[#C18C55]">
            <Lock size={18} />
            <span className="text-[11px] font-mono uppercase tracking-widest font-semibold">Cryptographic Audit Trail</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-[#29211D]">SHA-256 Hash-Chained Event Ledger</h1>
          <p className="text-xs text-[#817366] max-w-2xl">
            Every transaction, contract modification, and settlement approval is cryptographically anchored.
            Any unauthorized alteration immediately breaks the hash chain.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleVerify}
            disabled={verifying}
            className="btn btn-primary text-xs flex items-center gap-2 rounded-xl"
          >
            {verifying ? <RefreshCw size={14} className="animate-spin" /> : <ShieldCheck size={14} />}
            <span>Verify Hash Chain</span>
          </button>
          <button
            onClick={handleRestoreChain}
            className="btn btn-secondary text-xs flex items-center gap-1.5 rounded-xl"
            title="Recalculate hashes from genesis"
          >
            <RotateCcw size={13} />
            <span>Re-anchor Chain</span>
          </button>
        </div>
      </div>

      {/* Action Notification */}
      {actionMsg && (
        <div className={`p-4 rounded-2xl border flex items-center gap-3 text-xs font-medium ${
          actionMsg.type === 'success' ? 'bg-[#657B65]/12 border-[#657B65]/30 text-[#465B46]' :
          actionMsg.type === 'warning' ? 'bg-[#C18C55]/14 border-[#C18C55]/35 text-[#8C5E2E]' :
          'bg-[#B8755C]/12 border-[#B8755C]/30 text-[#9A5840]'
        }`}>
          {actionMsg.type === 'success' ? <CheckCircle2 size={18} /> :
           actionMsg.type === 'warning' ? <AlertTriangle size={18} /> : <XCircle size={18} />}
          <span>{actionMsg.text}</span>
        </div>
      )}

      {/* Verification Card */}
      {verifyResult && (
        <div className={`morph-card p-5 border-2 ${
          verifyResult.valid ? 'border-[#657B65]/45 bg-[#657B65]/10' : 'border-[#B8755C]/45 bg-[#B8755C]/10'
        }`}>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 font-serif font-bold text-base text-[#29211D]">
                {verifyResult.valid ? <ShieldCheck className="text-[#465B46]" size={20} /> : <ShieldAlert className="text-[#9A5840]" size={20} />}
                <span>{verifyResult.valid ? 'Cryptographic Chain Verified Intact' : 'Tamper Detected in Hash Chain!'}</span>
              </div>
              <p className="text-xs text-[#817366]">{verifyResult.message}</p>
            </div>
            <div className="text-right font-mono text-xs shrink-0">
              <span className="text-[#817366]">Events Checked:</span> <span className="font-bold text-[#29211D]">{verifyResult.totalEvents}</span>
              {verifyResult.brokenEventId && (
                <div className="text-[#9A5840] font-bold mt-1">Breach Event ID: #{verifyResult.brokenEventId}</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Events Table */}
      <div className="morph-card overflow-hidden p-6">
        <div className="pb-4 mb-4 border-b border-[rgba(129,115,102,0.14)] flex items-center justify-between">
          <div className="flex items-center gap-2 text-base font-serif font-bold text-[#29211D]">
            <History size={17} className="text-[#C18C55]" />
            <span>Audit Events ({events.length})</span>
          </div>
          <button onClick={loadEvents} className="text-xs font-semibold text-[#817366] hover:text-[#C18C55] flex items-center gap-1 transition-colors">
            <RefreshCw size={12} />
            <span>Refresh</span>
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs font-mono text-[#817366]">
            <RefreshCw size={20} className="animate-spin mx-auto mb-2 text-[#C18C55]" />
            Loading cryptographic audit entries...
          </div>
        ) : events.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#817366]">No audit events recorded yet.</div>
        ) : (
          <div className="table-container">
            <table className="cine-table">
              <thead>
                <tr>
                  <th>Seq</th>
                  <th>Timestamp</th>
                  <th>Actor / Role</th>
                  <th>Action</th>
                  <th>Target Entity</th>
                  <th>Description</th>
                  <th className="font-mono">SHA-256 Hash</th>
                  <th style={{ textAlign: 'right' }}>Forensic Test</th>
                </tr>
              </thead>
              <tbody>
                {events.map((evt) => (
                  <tr key={evt.id}>
                    <td className="font-mono font-bold text-xs text-[#C18C55]">#{evt.sequenceNumber}</td>
                    <td className="text-xs text-[#817366] whitespace-nowrap font-mono">
                      {new Date(evt.timestamp).toLocaleString()}
                    </td>
                    <td className="whitespace-nowrap">
                      <div className="font-semibold text-xs text-[#29211D]">{evt.actorUsername}</div>
                      <div className="text-[10px] text-[#817366] uppercase font-mono">{evt.actorRole}</div>
                    </td>
                    <td>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#F4EDE1] text-[#9E6E3B] border border-[rgba(193,140,85,0.28)] font-mono text-[10px] font-semibold uppercase">
                        {evt.eventType}
                      </span>
                    </td>
                    <td className="whitespace-nowrap font-mono text-[11px] text-[#817366]">
                      {evt.entityType} #{evt.entityId}
                    </td>
                    <td className="max-w-xs truncate text-xs text-[#29211D]" title={evt.description}>
                      {evt.description}
                    </td>
                    <td className="font-mono text-[10px] text-[#817366]" title={evt.currentHash}>
                      {evt.currentHash ? `${evt.currentHash.substring(0, 10)}...${evt.currentHash.substring(58)}` : 'N/A'}
                    </td>
                    <td className="text-right">
                      <button
                        onClick={() => handleTamperTest(evt.id)}
                        className="text-[11px] text-[#9A5840] hover:text-[#B8755C] font-mono font-semibold underline"
                        title="Simulate fraudulent tamper for forensic verification"
                      >
                        Tamper Test
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
