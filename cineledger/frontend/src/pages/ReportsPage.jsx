import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Download,
  RefreshCw,
} from 'lucide-react';
import { settlementService, reconciliationService, filmService } from '../services/api';
import StatusBadge from '../components/StatusBadge';

export default function ReportsPage() {
  const [settlements, setSettlements] = useState([]);
  const [films, setFilms] = useState([]);
  const [reconciliations, setReconciliations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      settlementService.getAll(),
      filmService.getAll(),
      reconciliationService.getAll(),
    ])
      .then(([stlRes, filmRes, reconRes]) => {
        setSettlements(stlRes || []);
        setFilms(filmRes || []);
        setReconciliations(reconRes || []);
      })
      .catch((err) => console.error('Failed to load reports data', err))
      .finally(() => setLoading(false));
  }, []);

  const totalGross = settlements.reduce((acc, s) => acc + (Number(s.grossBoxOffice) || 0), 0);
  const totalDeductions = settlements.reduce((acc, s) => acc + (Number(s.allowableDeductions) || 0), 0);
  const totalDistributorPayout = settlements.reduce((acc, s) => acc + (Number(s.distributorSettlementAmount) || 0), 0);
  const totalExhibitorRetention = settlements.reduce((acc, s) => acc + (Number(s.exhibitorSettlementAmount) || 0), 0);

  const formatCurrency = (amt) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amt || 0);
  };

  const handleExportCSV = () => {
    const headers = ['Settlement #', 'Period Start', 'Period End', 'Gross Box Office', 'Deductions', 'Net Distributable', 'Distributor Share', 'Status'];
    const rows = settlements.map(s => [
      s.settlementNumber,
      s.reportingPeriodStart,
      s.reportingPeriodEnd,
      s.grossBoxOffice,
      s.allowableDeductions,
      s.netSettlementBasis,
      s.distributorSettlementAmount,
      s.status
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CineLedger_Settlement_Summary_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="morph-card flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6">
        <div>
          <div className="flex items-center gap-2 text-[#C18C55]">
            <BarChart3 size={18} />
            <span className="text-[11px] font-mono uppercase tracking-widest font-semibold">Financial Statements</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-[#29211D] mt-0.5">Theatrical Box-Office Accounting &amp; Variance Statements</h1>
          <p className="text-xs text-[#817366] mt-0.5">
            Audited settlement schedules, gross-to-net waterfall deductions, and distributor remittances.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="btn btn-primary text-xs flex items-center gap-2 self-start sm:self-auto rounded-xl"
        >
          <Download size={14} />
          <span>Export Summary (CSV)</span>
        </button>
      </div>

      {/* Aggregate Waterfall KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="morph-card p-5">
          <p className="text-[11px] font-mono uppercase tracking-wider text-[#817366] font-semibold">Gross Box-Office Pool</p>
          <p className="text-2xl font-serif font-bold text-[#29211D] mt-1 tabular-nums">{formatCurrency(totalGross)}</p>
          <p className="text-[11px] text-[#817366] mt-2">Across {films.length} active releases &amp; {reconciliations.length} cycles</p>
        </div>

        <div className="morph-card p-5">
          <p className="text-[11px] font-mono uppercase tracking-wider text-[#817366] font-semibold">Total Deductions (GST + VPF)</p>
          <p className="text-2xl font-serif font-bold text-[#B8755C] mt-1 tabular-nums">{formatCurrency(totalDeductions)}</p>
          <p className="text-[11px] text-[#817366] mt-2">Statutory taxes and show-level fees</p>
        </div>

        <div className="morph-card p-5">
          <p className="text-[11px] font-mono uppercase tracking-wider text-[#817366] font-semibold">Distributor Payout Pool</p>
          <p className="text-2xl font-serif font-bold text-[#465B46] mt-1 tabular-nums">{formatCurrency(totalDistributorPayout)}</p>
          <p className="text-[11px] text-[#817366] mt-2">Contractual film rental settlement</p>
        </div>

        <div className="morph-card p-5">
          <p className="text-[11px] font-mono uppercase tracking-wider text-[#817366] font-semibold">Exhibitor Retention Share</p>
          <p className="text-2xl font-serif font-bold text-[#9E6E3B] mt-1 tabular-nums">{formatCurrency(totalExhibitorRetention)}</p>
          <p className="text-[11px] text-[#817366] mt-2">Retained theater operations revenue</p>
        </div>
      </div>

      {/* Statements Table */}
      <div className="morph-card overflow-hidden p-6">
        <div className="pb-4 mb-4 border-b border-[rgba(129,115,102,0.14)] flex items-center justify-between">
          <span className="text-base font-serif font-bold text-[#29211D]">Executed Settlement Vouchers</span>
          <span className="text-xs font-mono font-semibold text-[#817366]">{settlements.length} Vouchers</span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs font-mono text-[#817366]">
            <RefreshCw size={20} className="animate-spin mx-auto mb-2 text-[#C18C55]" />
            Compiling financial accounting reports...
          </div>
        ) : (
          <div className="table-container">
            <table className="cine-table">
              <thead>
                <tr>
                  <th>Voucher #</th>
                  <th>Period</th>
                  <th style={{ textAlign: 'right' }}>Gross Collections</th>
                  <th style={{ textAlign: 'right' }}>Deductions</th>
                  <th style={{ textAlign: 'right' }}>Net Distributable</th>
                  <th style={{ textAlign: 'right' }}>Distributor Payout</th>
                  <th style={{ textAlign: 'right' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {settlements.map((s) => (
                  <tr key={s.id}>
                    <td className="font-mono font-bold text-xs text-[#C18C55]">{s.settlementNumber}</td>
                    <td className="font-mono text-xs text-[#817366] tabular-nums">{s.reportingPeriodStart} to {s.reportingPeriodEnd}</td>
                    <td className="text-right font-mono text-xs font-medium text-[#29211D] tabular-nums">{formatCurrency(s.grossBoxOffice)}</td>
                    <td className="text-right font-mono text-xs font-semibold text-[#9A5840] tabular-nums">-{formatCurrency(s.allowableDeductions)}</td>
                    <td className="text-right font-mono text-xs font-semibold text-[#29211D] tabular-nums">{formatCurrency(s.netSettlementBasis)}</td>
                    <td className="text-right font-mono text-xs font-bold text-[#465B46] tabular-nums">{formatCurrency(s.distributorSettlementAmount)}</td>
                    <td className="text-right">
                      <StatusBadge status={s.status} />
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
