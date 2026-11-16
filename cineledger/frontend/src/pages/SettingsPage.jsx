import React, { useState } from 'react';
import { Settings, Save, Shield, Percent, CheckCircle2 } from 'lucide-react';

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [config, setConfig] = useState({
    gstRate: 18.0,
    convenienceFeeRate: 2.5,
    defaultVpf: 500,
    discrepancyThreshold: 100,
    autoReconcileTolerance: 0.0,
    requireAuditorSignoff: true,
  });

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="morph-card p-6">
        <div className="flex items-center gap-2 text-[#C18C55]">
          <Settings size={18} />
          <span className="text-[11px] font-mono uppercase tracking-widest font-semibold">Configuration Workbench</span>
        </div>
        <h1 className="text-2xl font-serif font-bold text-[#29211D] mt-1">Financial Reconciliation Engine Settings</h1>
        <p className="text-xs text-[#817366] mt-1">
          Statutory tax standards, virtual print fee thresholds, and audit tolerance parameters.
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-2xl bg-[#657B65]/12 border border-[#657B65]/30 text-[#465B46] text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>Financial parameters updated and logged to audit chain.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <div className="morph-card p-6 space-y-4">
          <h3 className="text-base font-serif font-bold text-[#29211D] flex items-center gap-2">
            <Percent size={17} className="text-[#C18C55]" />
            <span>Statutory Tax &amp; Gateway Deductions</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="form-group">
              <label className="form-label">Standard GST Rate (%)</label>
              <input
                type="number"
                step="0.1"
                value={config.gstRate}
                onChange={(e) => setConfig({ ...config, gstRate: parseFloat(e.target.value) })}
                className="form-input font-mono text-xs"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Ticketing Convenience Fee (%)</label>
              <input
                type="number"
                step="0.1"
                value={config.convenienceFeeRate}
                onChange={(e) => setConfig({ ...config, convenienceFeeRate: parseFloat(e.target.value) })}
                className="form-input font-mono text-xs"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Virtual Print Fee (VPF ₹ / Show)</label>
              <input
                type="number"
                value={config.defaultVpf}
                onChange={(e) => setConfig({ ...config, defaultVpf: parseFloat(e.target.value) })}
                className="form-input font-mono text-xs"
              />
            </div>
          </div>
        </div>

        <div className="morph-card p-6 space-y-4">
          <h3 className="text-base font-serif font-bold text-[#29211D] flex items-center gap-2">
            <Shield size={17} className="text-[#C18C55]" />
            <span>Audit &amp; Discrepancy Tolerance Thresholds</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div className="form-group">
              <label className="form-label">Discrepancy Investigation Threshold (₹)</label>
              <input
                type="number"
                value={config.discrepancyThreshold}
                onChange={(e) => setConfig({ ...config, discrepancyThreshold: parseFloat(e.target.value) })}
                className="form-input font-mono text-xs"
              />
            </div>

            <div className="flex items-center gap-3 pt-4">
              <input
                type="checkbox"
                id="auditorSignoff"
                checked={config.requireAuditorSignoff}
                onChange={(e) => setConfig({ ...config, requireAuditorSignoff: e.target.checked })}
                className="accent-[#C18C55] w-4 h-4 rounded cursor-pointer"
              />
              <label htmlFor="auditorSignoff" className="text-xs font-medium text-[#29211D] cursor-pointer">
                Require Auditor SHA-256 signature before payout execution
              </label>
            </div>
          </div>
        </div>

        <button type="submit" className="btn btn-primary text-xs rounded-xl flex items-center gap-2">
          <Save size={14} />
          <span>Save Configuration Parameters</span>
        </button>
      </form>
    </div>
  );
}
