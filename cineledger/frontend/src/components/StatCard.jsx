import React from 'react';

export default function StatCard({
  title,
  value,
  subtext,
  icon: Icon,
  badgeText,
  badgeType = 'neutral',
}) {
  const badgeClasses = {
    positive: 'bg-[#657B65]/12 text-[#465B46] border border-[#657B65]/30',
    warning: 'bg-[#B8755C]/14 text-[#8D4932] border border-[#B8755C]/30',
    danger: 'bg-[#B8755C]/22 text-[#80331C] border border-[#B8755C]/45',
    info: 'bg-[#C18C55]/14 text-[#8C5E2E] border border-[#C18C55]/30',
    neutral: 'bg-[rgba(129,115,102,0.12)] text-[#817366] border border-[rgba(129,115,102,0.24)]',
  };

  return (
    <div className="morph-card morph-card-hover p-6 relative overflow-hidden group">
      {/* Subtle top warm shimmer line */}
      <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-[#C18C55]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#817366] font-mono">
            {title}
          </p>
          <h3 className="text-2xl sm:text-3xl font-bold font-mono text-[#29211D] tracking-tight tabular-nums">
            {value}
          </h3>
          {subtext && <p className="text-xs text-[#817366] pt-0.5">{subtext}</p>}
        </div>
        {Icon && (
          <div className="p-3 rounded-xl bg-white border border-[rgba(129,115,102,0.2)] text-[#C18C55] shadow-sm group-hover:border-[#C18C55]/50 group-hover:shadow transition-all duration-300">
            <Icon size={20} />
          </div>
        )}
      </div>

      {badgeText && (
        <div className="mt-4 pt-3 border-t border-[rgba(129,115,102,0.14)] flex items-center justify-between">
          <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${badgeClasses[badgeType] || badgeClasses.neutral}`}>
            {badgeText}
          </span>
          <span className="text-[10px] text-[#817366] font-mono uppercase tracking-wider">LIVE SYNC</span>
        </div>
      )}
    </div>
  );
}
