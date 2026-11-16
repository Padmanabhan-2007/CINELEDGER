import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  ShieldAlert,
  XCircle,
  FileText,
} from 'lucide-react';

export default function StatusBadge({ status, size = 'sm' }) {
  if (!status) return null;

  const s = status.toUpperCase();

  const configs = {
    RECONCILED: {
      label: 'Reconciled',
      className: 'badge-reconciled',
      icon: CheckCircle2,
    },
    PARSED: {
      label: 'Parsed',
      className: 'badge-reconciled',
      icon: CheckCircle2,
    },
    ACTIVE: {
      label: 'Active',
      className: 'badge-reconciled',
      icon: CheckCircle2,
    },
    DISCREPANCIES_FOUND: {
      label: 'Discrepancies',
      className: 'badge-discrepancy',
      icon: AlertTriangle,
    },
    SETTLED: {
      label: 'Settled',
      className: 'badge-settled',
      icon: CheckCircle2,
    },
    PAID: {
      label: 'Paid',
      className: 'badge-settled',
      icon: CheckCircle2,
    },
    DRAFT: {
      label: 'Draft',
      className: 'badge-draft',
      icon: Clock,
    },
    PROCESSING: {
      label: 'Processing',
      className: 'badge-draft',
      icon: Clock,
    },
    PENDING_APPROVAL: {
      label: 'Pending Approval',
      className: 'badge-discrepancy',
      icon: Clock,
    },
    APPROVED: {
      label: 'Approved',
      className: 'badge-reconciled',
      icon: CheckCircle2,
    },
    OPEN: {
      label: 'Open',
      className: 'badge-dispute',
      icon: AlertTriangle,
    },
    IN_REVIEW: {
      label: 'In Review',
      className: 'badge-discrepancy',
      icon: Clock,
    },
    UNDER_REVIEW: {
      label: 'Under Review',
      className: 'badge-discrepancy',
      icon: Clock,
    },
    RESOLVED: {
      label: 'Resolved',
      className: 'badge-reconciled',
      icon: CheckCircle2,
    },
    REJECTED: {
      label: 'Rejected',
      className: 'badge-draft',
      icon: XCircle,
    },
    SECURE: {
      label: 'Integrity Verified',
      className: 'badge-reconciled',
      icon: ShieldCheck,
    },
    COMPROMISED: {
      label: 'Chain Compromised',
      className: 'badge-dispute',
      icon: ShieldAlert,
    },
  };

  const config = configs[s] || {
    label: status,
    className: 'badge-draft',
    icon: FileText,
  };

  const Icon = config.icon;

  return (
    <span className={`badge ${config.className}`}>
      <Icon size={size === 'sm' ? 12 : 14} />
      <span>{config.label}</span>
    </span>
  );
}
