import React from 'react';
import { Eye, Check, Armchair, Sparkles } from 'lucide-react';

export default function SeatMap2DFallback({
  seats = [],
  selectedSeats = [],
  onSelectSeat,
  onPreviewSeat,
}) {
  const selectedSeatIds = (selectedSeats || []).map((s) =>
    typeof s === 'object' && s !== null ? s.id : s
  );

  // Helper to extract row label reliably
  const getSeatRow = (seat) => {
    if (!seat) return '';
    const raw = seat.rowLabel || seat.rowIdentifier || (seat.seatCode ? seat.seatCode.charAt(0) : '');
    return String(raw).toUpperCase().trim();
  };

  // 14 Stadium Rows ordered from Front (closest to screen) to Back (Recliners)
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P'];

  const seatsByRow = rows.reduce((acc, row) => {
    acc[row] = seats
      .filter((s) => getSeatRow(s) === row)
      .sort((a, b) => (a.seatNumber || 0) - (b.seatNumber || 0));
    return acc;
  }, {});

  const getTierInfo = (rowLetter) => {
    if (['P', 'N', 'M'].includes(rowLetter)) {
      return { name: 'PVR Royale Recliner Lounge (VIP)', price: '₹550', color: 'text-[#E5B982]' };
    }
    if (['L', 'K', 'J', 'H', 'G', 'F', 'E'].includes(rowLetter)) {
      return { name: 'PVR Prime (Dolby Atmos Club)', price: '₹380', color: 'text-[#C18C55]' };
    }
    return { name: 'PVR Classic (Silver Tier)', price: '₹280', color: 'text-[#A89D93]' };
  };

  return (
    <div className="w-full max-w-5xl bg-[#171210] rounded-3xl p-4 sm:p-8 text-[#F4EDE1] shadow-2xl border border-[#C18C55]/30 flex flex-col items-center select-none overflow-hidden">
      {/* 1. Curved Screen Visual Representation */}
      <div className="w-full max-w-3xl mb-6 flex flex-col items-center">
        <div className="w-full h-3.5 bg-gradient-to-r from-transparent via-[#C18C55] to-transparent rounded-full shadow-[0_0_30px_#C18C55]" />
        <div className="flex items-center gap-2 mt-2">
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          <p className="text-xs uppercase tracking-[0.25em] text-[#E5B982] font-bold">
            Curved 20m All-Laser Silver Projection Screen (252 Seats)
          </p>
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
        </div>
        <p className="text-[10px] text-[#817366] uppercase tracking-wider mt-0.5">▼ ALL EYES TOWARDS SCREEN ▼</p>
      </div>

      {/* 2. Seating Rows Grid (Scrollable for smaller screens) */}
      <div className="w-full overflow-x-auto py-2 flex flex-col items-center custom-scrollbar">
        <div className="min-w-[760px] space-y-2.5 px-4">
          {/* Architectural Section & Aisle Headers */}
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#C18C55]/70 pb-2 border-b border-white/10 px-6">
            <span className="w-28 text-left">← Left Wing (1-4)</span>
            <span className="text-[10px] text-[#C18C55] font-mono tracking-widest px-2 py-0.5 rounded bg-white/5">LEFT AISLE</span>
            <span className="text-center font-bold text-[#E5B982]">Center Grand Tier (5-14)</span>
            <span className="text-[10px] text-[#C18C55] font-mono tracking-widest px-2 py-0.5 rounded bg-white/5">RIGHT AISLE</span>
            <span className="w-28 text-right">Right Wing (15-18) →</span>
          </div>

          {rows.map((row) => {
            const rowSeats = seatsByRow[row] || [];
            if (rowSeats.length === 0) return null;

            const tier = getTierInfo(row);
            const isTierHeaderRow = row === 'A' || row === 'E' || row === 'M';

            // Split into 3 sections: Left Wing (1-4), Center Grand Tier (5-14), Right Wing (15-18)
            const leftWing = rowSeats.slice(0, 4);
            const centerTier = rowSeats.slice(4, 14);
            const rightWing = rowSeats.slice(14, 18);

            return (
              <div key={row} className="w-full flex flex-col items-center">
                {/* Tier Group Heading */}
                {isTierHeaderRow && (
                  <div className="w-full flex items-center justify-between pb-1 pt-3 mb-2 border-b border-white/10 text-xs">
                    <span className={`font-bold tracking-wider ${tier.color}`}>
                      {tier.name}
                    </span>
                    <span className="font-mono text-[#F4EDE1]/80 font-semibold">{tier.price}</span>
                  </div>
                )}

                <div className="flex items-center justify-center gap-2.5 w-full">
                  {/* Left Row Label */}
                  <span className="w-5 text-xs font-bold text-[#C18C55] text-center">{row}</span>

                  {/* Left Wing (Seats 1 to 4) */}
                  <div className="flex items-center gap-1.5">
                    {leftWing.map((seat) => renderSeatButton(seat))}
                  </div>

                  {/* Left Illuminated Aisle Gap */}
                  <div className="w-5 sm:w-6 flex items-center justify-center">
                    <div className="w-0.5 h-6 bg-[#C18C55]/20 rounded-full" />
                  </div>

                  {/* Center Grand Tier (Seats 5 to 14) */}
                  <div className="flex items-center gap-1.5">
                    {centerTier.map((seat) => renderSeatButton(seat))}
                  </div>

                  {/* Right Illuminated Aisle Gap */}
                  <div className="w-5 sm:w-6 flex items-center justify-center">
                    <div className="w-0.5 h-6 bg-[#C18C55]/20 rounded-full" />
                  </div>

                  {/* Right Wing (Seats 15 to 18) */}
                  <div className="flex items-center gap-1.5">
                    {rightWing.map((seat) => renderSeatButton(seat))}
                  </div>

                  {/* Right Row Label */}
                  <span className="w-5 text-xs font-bold text-[#C18C55] text-center">{row}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Seating Legend */}
      <div className="mt-8 pt-5 border-t border-white/10 w-full flex flex-wrap items-center justify-between gap-4 text-xs text-[#817366]">
        <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-md bg-[#241F1D] border border-white/10" />
            <span className="text-[#A89D93]">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-md bg-[#10B981] shadow-[0_0_8px_#10B981]" />
            <span className="text-[#10B981] font-semibold">Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-md bg-[#241F1D] text-[#554A44] line-through flex items-center justify-center text-[10px] font-bold">
              X
            </span>
            <span className="text-[#73675D]">Booked</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-md bg-[#D35400]/30 border border-[#D35400]" />
            <span className="text-[#E67E22]">Held</span>
          </div>
        </div>

        <p className="text-[11px] text-[#C18C55] font-medium flex items-center gap-1.5">
          <Eye className="w-3.5 h-3.5" />
          <span>Click the eye icon to preview virtual camera sightline from that seat!</span>
        </p>
      </div>
    </div>
  );

  function renderSeatButton(seat) {
    const isSelected = selectedSeatIds.includes(seat.id);
    const isBooked = seat.status === 'BOOKED';
    const isHeld = seat.status === 'HELD';

    return (
      <div key={seat.id} className="relative group">
        <button
          disabled={isBooked}
          onClick={() => onSelectSeat(seat)}
          title={`${seat.seatCode} • ${seat.tier} • ₹${seat.price}`}
          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-[10px] font-mono font-bold flex items-center justify-center transition-all ${
            isSelected
              ? 'bg-[#10B981] text-black shadow-[0_0_12px_#10B981] scale-105 z-10'
              : isBooked
              ? 'bg-[#221C1A] text-[#52443F] border border-white/5 cursor-not-allowed line-through'
              : isHeld
              ? 'bg-[#D35400]/20 border border-[#D35400] text-[#E67E22] cursor-not-allowed'
              : seat.tier === 'RECLINER'
              ? 'bg-[#3D1E14] hover:bg-[#5A2C1D] text-[#E5B982] border border-[#C18C55]/40 hover:scale-105'
              : seat.tier === 'PRIME'
              ? 'bg-[#2E241E] hover:bg-[#45362C] text-[#F4EDE1] border border-[#C18C55]/30 hover:scale-105'
              : 'bg-[#221D1A] hover:bg-[#332B27] text-[#A89D93] border border-white/10 hover:scale-105'
          }`}
        >
          {isSelected ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : seat.seatNumber}
        </button>

        {/* Hover Eye Sightline Preview Icon Button */}
        {!isBooked && onPreviewSeat && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPreviewSeat(seat);
            }}
            title="Preview Screen View from this Seat"
            className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#C18C55] hover:bg-white text-[#14100E] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center shadow-md z-20"
          >
            <Eye className="w-2.5 h-2.5" />
          </button>
        )}
      </div>
    );
  }
}
