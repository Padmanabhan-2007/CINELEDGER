import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Check,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  Ticket,
  CreditCard,
  RotateCcw
} from 'lucide-react';
import DigitalTicket3D from './DigitalTicket3D';

export default function SeatSelectionModal({ film, isOpen, onClose }) {
  if (!isOpen || !film) return null;

  // Step state: 1 = Date/Time/Seats, 2 = Summary, 3 = Digital Ticket
  const [step, setStep] = useState(1);

  // Selection states
  const [selectedDate, setSelectedDate] = useState('TODAY, 06 Nov');
  const [selectedTime, setSelectedTime] = useState('06:45 PM');
  const [selectedCinema, setSelectedCinema] = useState('PVR ICON Phoenix Palladium');
  const [selectedFormat, setSelectedFormat] = useState('IMAX 4K Laser');
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookingConfirmedData, setBookingConfirmedData] = useState(null);

  // Available Dates
  const dates = [
    { label: 'TODAY', day: '06', month: 'Nov', full: 'TODAY, 06 Nov' },
    { label: 'FRI', day: '07', month: 'Nov', full: 'FRI, 07 Nov' },
    { label: 'SAT', day: '08', month: 'Nov', full: 'SAT, 08 Nov' },
    { label: 'SUN', day: '09', month: 'Nov', full: 'SUN, 09 Nov' },
    { label: 'MON', day: '10', month: 'Nov', full: 'MON, 10 Nov' },
    { label: 'TUE', day: '11', month: 'Nov', full: 'TUE, 11 Nov' },
  ];

  // Available Theatres
  const cinemas = [
    { name: 'PVR ICON Phoenix Palladium', screen: 'Screen 1 (IMAX Laser)', city: 'Mumbai' },
    { name: 'INOX Megaplex Inorbit Mall', screen: 'Screen 4 (Dolby Atmos)', city: 'Mumbai' },
    { name: 'PVR Director\'s Cut Ambience Mall', screen: 'Lounge 1 (RGB Laser)', city: 'New Delhi' },
    { name: 'Cinepolis Nexus Forum Mall', screen: 'Screen 2 (Macro XE)', city: 'Bengaluru' },
  ];

  // Available Showtimes
  const showtimes = [
    { time: '10:30 AM', tier: 'Morning', discount: '₹50 OFF' },
    { time: '02:15 PM', tier: 'Matinee', format: 'IMAX 3D' },
    { time: '06:45 PM', tier: 'Prime', highlight: true, format: 'IMAX 4K' },
    { time: '10:15 PM', tier: 'Late Night', format: 'Dolby Atmos' },
  ];

  // Seat Configuration
  // Rows: A-B (Recliner, ₹750), C-E (Prime Club, ₹450), F-H (Classic, ₹320)
  const rows = [
    { id: 'A', type: 'Recliner Lounge', price: 750, seats: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
    { id: 'B', type: 'Recliner Lounge', price: 750, seats: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
    { id: 'C', type: 'Prime Club', price: 450, seats: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
    { id: 'D', type: 'Prime Club', price: 450, seats: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
    { id: 'E', type: 'Prime Club', price: 450, seats: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
    { id: 'F', type: 'Classic Standard', price: 320, seats: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
    { id: 'G', type: 'Classic Standard', price: 320, seats: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
    { id: 'H', type: 'Classic Standard', price: 320, seats: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
  ];

  // Pre-booked / reserved seat keys to simulate a bustling live theatre
  const bookedSeats = new Set(['A3', 'A4', 'C6', 'C7', 'D5', 'D6', 'D7', 'E8', 'F4', 'G9', 'G10']);

  const toggleSeat = (seatKey, price, type) => {
    if (bookedSeats.has(seatKey)) return;

    setSelectedSeats((prev) => {
      const exists = prev.find((s) => s.key === seatKey);
      if (exists) {
        return prev.filter((s) => s.key !== seatKey);
      } else {
        if (prev.length >= 8) {
          alert('Maximum 8 tickets per booking');
          return prev;
        }
        return [...prev, { key: seatKey, price, type }];
      }
    });
  };

  // Financial Breakdown Calculations
  const seatSubtotal = selectedSeats.reduce((sum, s) => sum + s.price, 0);
  const gstTax = Math.round(seatSubtotal * 0.18 * 100) / 100;
  const convenienceFee = selectedSeats.length > 0 ? selectedSeats.length * 25.0 : 0.0;
  const grandTotal = Math.round((seatSubtotal + gstTax + convenienceFee) * 100) / 100;

  const handleConfirmBooking = () => {
    // 1. Trigger Confetti
    try {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#E5A955', '#B88750', '#294A3C', '#F7F5F0', '#FFE4B0'],
      });
    } catch (e) {
      // ignore
    }

    // 2. Prepare Digital Ticket Data
    const bookingRef = `CLG-${Math.floor(100000 + Math.random() * 900000)}`;
    const ticketData = {
      bookingReference: bookingRef,
      filmTitle: film.title,
      posterUrl: film.posterUrl,
      cinemaName: selectedCinema,
      screenName: 'Screen 1 (IMAX Laser)',
      format: selectedFormat,
      showDate: selectedDate,
      showTime: selectedTime,
      seats: selectedSeats.map((s) => s.key),
      seatCount: selectedSeats.length,
      totalAmount: grandTotal,
    };

    // Save to localStorage for persistence
    try {
      const existing = JSON.parse(localStorage.getItem('cineledger_user_bookings') || '[]');
      existing.unshift(ticketData);
      localStorage.setItem('cineledger_user_bookings', JSON.stringify(existing));
    } catch (e) {
      // ignore
    }

    setBookingConfirmedData(ticketData);
    setStep(3); // Go to Digital Ticket
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-[#131610] border border-[#2A3124] rounded-3xl shadow-2xl overflow-hidden my-auto">
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-[#1C2117] hover:bg-[#283022] text-[#8E948A] hover:text-[#F7F5F0] transition-colors z-30"
          title="Close"
        >
          <X size={18} />
        </button>

        {/* STEP 1: DATE, SHOWTIME & SEAT SELECTION */}
        {step === 1 && (
          <div className="p-6 sm:p-8 space-y-6">
            {/* Header: Movie & Format Details */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-[#22281D]">
              <div className="flex items-center gap-4">
                <img
                  src={film.posterUrl}
                  alt={film.title}
                  className="w-14 h-20 object-cover rounded-xl border border-[#B88750]/40 shadow-md"
                />
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-[#D4A76A]">
                    <span className="font-bold">{film.rating || 'U/A'}</span>
                    <span>•</span>
                    <span>{film.durationMinutes || 150} mins</span>
                    <span>•</span>
                    <span className="text-[#8E948A]">{film.genre || 'Action / Drama'}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#F7F5F0] leading-tight mt-0.5">
                    {film.title}
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <select
                      value={selectedCinema}
                      onChange={(e) => setSelectedCinema(e.target.value)}
                      className="bg-[#1A1F16] border border-[#2E3528] text-xs text-[#F7F5F0] rounded-lg px-2.5 py-1 outline-none font-medium"
                    >
                      {cinemas.map((c) => (
                        <option key={c.name} value={c.name}>
                          {c.name} ({c.city})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Progress Steps Indicator */}
              <div className="flex items-center gap-2 text-xs font-mono self-end sm:self-auto">
                <span className="px-2.5 py-1 rounded-full bg-[#E5A955] text-[#11130F] font-bold">1. Seats</span>
                <span className="text-[#383F32]">→</span>
                <span className="text-[#72776F]">2. Summary</span>
                <span className="text-[#383F32]">→</span>
                <span className="text-[#72776F]">3. Pass</span>
              </div>
            </div>

            {/* Horizontal Date Picker */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-[#8E948A] tracking-wider flex items-center gap-1.5">
                <Calendar size={13} className="text-[#B88750]" />
                <span>Select Screening Date</span>
              </label>
              <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none">
                {dates.map((d) => {
                  const isSelected = selectedDate === d.full;
                  return (
                    <button
                      key={d.full}
                      onClick={() => setSelectedDate(d.full)}
                      className={`flex flex-col items-center justify-center min-w-[70px] py-2 px-3 rounded-xl border text-center transition-all ${
                        isSelected
                          ? 'bg-gradient-to-b from-[#B88750] to-[#8C6233] border-[#FFD485] text-[#11130F] font-bold shadow-md shadow-[#B88750]/30 scale-105'
                          : 'bg-[#181D14] border-[#262D20] text-[#8E948A] hover:border-[#384230] hover:text-[#F7F5F0]'
                      }`}
                    >
                      <span className="text-[10px] font-mono tracking-wider">{d.label}</span>
                      <span className="text-lg font-bold">{d.day}</span>
                      <span className="text-[10px] font-mono">{d.month}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Showtime Selection Chips */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-[#8E948A] tracking-wider flex items-center gap-1.5">
                <Clock size={13} className="text-[#B88750]" />
                <span>Select Session & Format</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {showtimes.map((st) => {
                  const isSelected = selectedTime === st.time;
                  return (
                    <button
                      key={st.time}
                      onClick={() => setSelectedTime(st.time)}
                      className={`p-3 rounded-xl border text-left transition-all relative ${
                        isSelected
                          ? 'bg-[#294A3C]/40 border-[#B88750] shadow-sm text-[#F7F5F0]'
                          : 'bg-[#181D14] border-[#262D20] text-[#8E948A] hover:border-[#384230] hover:text-[#F7F5F0]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-[#F7F5F0]">{st.time}</span>
                        {isSelected && <Check size={14} className="text-[#E5A955]" />}
                      </div>
                      <div className="text-[10px] font-mono text-[#D4A76A] mt-0.5">{st.tier}</div>
                      {st.format && (
                        <span className="inline-block mt-1 text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#131610] border border-[#2E3528] text-[#8E948A]">
                          {st.format}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CURVED 3D CINEMA SCREEN & LIGHT BEAM */}
            <div className="pt-4 text-center">
              <div className="relative max-w-lg mx-auto mb-8">
                {/* Screen Curved Beam */}
                <div className="cinema-screen-curve w-full mx-auto" />
                <div className="cinema-light-beam w-full h-12 mx-auto" />
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#D4A76A] -mt-3">
                  All Eyes This Way — IMAX Laser Projection
                </p>
              </div>

              {/* SEAT GRID */}
              <div className="space-y-2.5 overflow-x-auto pb-4 max-w-xl mx-auto select-none">
                {rows.map((row) => (
                  <div key={row.id} className="flex items-center justify-center gap-1.5 min-w-[360px]">
                    {/* Row Letter */}
                    <span className="w-5 text-[11px] font-mono font-bold text-[#72776F]">{row.id}</span>

                    {/* Left Block */}
                    <div className="flex gap-1.5">
                      {row.seats.slice(0, row.seats.length / 2).map((num) => {
                        const seatKey = `${row.id}${num}`;
                        const isBooked = bookedSeats.has(seatKey);
                        const isSelected = selectedSeats.some((s) => s.key === seatKey);
                        const isVip = row.type.includes('Recliner');

                        return (
                          <button
                            key={seatKey}
                            onClick={() => toggleSeat(seatKey, row.price, row.type)}
                            disabled={isBooked}
                            title={`${seatKey} • ${row.type} (₹${row.price})`}
                            className={`cinema-seat w-6 sm:w-7 h-6 sm:h-7 rounded-md text-[9px] font-mono font-semibold flex items-center justify-center ${
                              isBooked
                                ? 'seat-booked'
                                : isSelected
                                ? 'seat-selected'
                                : isVip
                                ? 'seat-available seat-vip'
                                : 'seat-available'
                            }`}
                          >
                            {num}
                          </button>
                        );
                      })}
                    </div>

                    {/* Center Aisle Gap */}
                    <div className="w-4 sm:w-6" />

                    {/* Right Block */}
                    <div className="flex gap-1.5">
                      {row.seats.slice(row.seats.length / 2).map((num) => {
                        const seatKey = `${row.id}${num}`;
                        const isBooked = bookedSeats.has(seatKey);
                        const isSelected = selectedSeats.some((s) => s.key === seatKey);
                        const isVip = row.type.includes('Recliner');

                        return (
                          <button
                            key={seatKey}
                            onClick={() => toggleSeat(seatKey, row.price, row.type)}
                            disabled={isBooked}
                            title={`${seatKey} • ${row.type} (₹${row.price})`}
                            className={`cinema-seat w-6 sm:w-7 h-6 sm:h-7 rounded-md text-[9px] font-mono font-semibold flex items-center justify-center ${
                              isBooked
                                ? 'seat-booked'
                                : isSelected
                                ? 'seat-selected'
                                : isVip
                                ? 'seat-available seat-vip'
                                : 'seat-available'
                            }`}
                          >
                            {num}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Seat Legend */}
              <div className="flex flex-wrap items-center justify-center gap-5 text-xs text-[#8E948A] pt-3 border-t border-[#1F241A]">
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded-sm seat-available" />
                  <span>Available</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded-sm bg-[#E5A955] border border-[#FFD485]" />
                  <span className="text-[#F7F5F0]">Selected</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded-sm seat-booked" />
                  <span>Reserved</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded-sm seat-available border-[#B88750]" />
                  <span className="text-[#D4A76A]">VIP Recliner (₹750)</span>
                </div>
              </div>
            </div>

            {/* Bottom Checkout Action Bar */}
            <div className="pt-4 border-t border-[#22281D] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-mono text-[#8E948A]">
                  Seats Selected: <span className="text-[#F7F5F0] font-bold">{selectedSeats.length > 0 ? selectedSeats.map((s) => s.key).join(', ') : 'None'}</span>
                </p>
                <p className="text-xl font-bold font-mono text-[#E5A955]">
                  ₹{grandTotal.toFixed(2)}{' '}
                  <span className="text-xs font-normal text-[#8E948A] font-sans">(inc. taxes)</span>
                </p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={onClose}
                  className="btn btn-secondary text-xs py-2.5 px-4 rounded-xl flex-1 sm:flex-none"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setStep(2)}
                  disabled={selectedSeats.length === 0}
                  className="btn btn-primary text-xs py-2.5 px-6 rounded-xl flex items-center justify-center gap-2 flex-1 sm:flex-none disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-[#B88750]/20"
                >
                  <span>Review Booking</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: BOOKING SUMMARY & PAYMENT PREVIEW */}
        {step === 2 && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#22281D]">
              <div>
                <h2 className="text-2xl font-serif font-bold text-[#F7F5F0]">Order Summary</h2>
                <p className="text-xs text-[#8E948A]">Review your theatrical admission details before confirmation</p>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-[#72776F]">1. Seats</span>
                <span className="text-[#383F32]">→</span>
                <span className="px-2.5 py-1 rounded-full bg-[#E5A955] text-[#11130F] font-bold">2. Summary</span>
                <span className="text-[#383F32]">→</span>
                <span className="text-[#72776F]">3. Pass</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Left Column: Film Summary Card */}
              <div className="md:col-span-5 bg-[#171B14] border border-[#272E21] p-5 rounded-2xl flex gap-4">
                <img
                  src={film.posterUrl}
                  alt={film.title}
                  className="w-24 h-36 object-cover rounded-xl border border-[#B88750]/40 shadow-lg"
                />
                <div className="space-y-1.5 flex-1 min-w-0">
                  <span className="px-2 py-0.5 rounded bg-[#294A3C] text-[10px] font-mono text-[#E5A955] font-semibold">
                    {selectedFormat}
                  </span>
                  <h3 className="font-serif font-bold text-lg text-[#F7F5F0] truncate">{film.title}</h3>
                  <p className="text-xs text-[#8E948A] truncate">{selectedCinema}</p>
                  <p className="text-xs font-mono text-[#D4A76A]">Screen 1 (IMAX Laser)</p>
                  <div className="pt-2 text-xs text-[#C8CCC3] space-y-0.5">
                    <p>📅 {selectedDate}</p>
                    <p>⏰ {selectedTime}</p>
                  </div>
                </div>
              </div>

              {/* Right Column: Financial Waterfall Breakdown */}
              <div className="md:col-span-7 bg-[#171B14] border border-[#272E21] p-5 rounded-2xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#242B1E]">
                  <span className="text-xs font-semibold text-[#F7F5F0]">Selected Seats ({selectedSeats.length})</span>
                  <div className="flex gap-1.5 flex-wrap">
                    {selectedSeats.map((s) => (
                      <span key={s.key} className="px-2 py-0.5 rounded bg-[#E5A955]/20 text-[#E5A955] border border-[#B88750]/40 text-xs font-mono font-bold">
                        {s.key}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-[#8E948A]">
                    <span>Ticket Admissions Subtotal</span>
                    <span className="font-mono text-[#F7F5F0]">₹{seatSubtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[#8E948A]">
                    <span>Goods & Services Tax (GST @ 18.00%)</span>
                    <span className="font-mono text-[#F7F5F0]">₹{gstTax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[#8E948A]">
                    <span>Ticketing Gateway & Convenience Fee</span>
                    <span className="font-mono text-[#F7F5F0]">₹{convenienceFee.toFixed(2)}</span>
                  </div>
                  <div className="pt-2 border-t border-[#242B1E] flex justify-between items-center text-sm">
                    <span className="font-semibold text-[#F7F5F0]">Grand Total Payable</span>
                    <span className="font-mono font-bold text-xl text-[#E5A955]">₹{grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                <div className="p-3 bg-[#11130E] border border-[#22281C] rounded-xl flex items-center gap-2.5 text-[11px] text-[#8E948A]">
                  <ShieldCheck size={16} className="text-[#E5A955] flex-shrink-0" />
                  <span>Your booking generates an immutable SHA-256 cryptographic ticket pass anchored in the box-office ledger.</span>
                </div>
              </div>
            </div>

            {/* Step 2 Actions */}
            <div className="pt-4 border-t border-[#22281D] flex items-center justify-between">
              <button
                onClick={() => setStep(1)}
                className="btn btn-secondary text-xs py-2.5 px-4 rounded-xl flex items-center gap-1.5"
              >
                <RotateCcw size={13} />
                <span>Change Seats</span>
              </button>

              <button
                onClick={handleConfirmBooking}
                className="btn btn-primary text-xs py-3 px-8 rounded-xl font-bold flex items-center gap-2 shadow-xl shadow-[#B88750]/30"
              >
                <CreditCard size={15} />
                <span>Confirm & Generate 3D Pass</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: DIGITAL TICKET 3D CONFIRMATION */}
        {step === 3 && bookingConfirmedData && (
          <div className="p-6 sm:p-8 space-y-4">
            <div className="text-center space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/50 border border-emerald-700/60 text-xs font-mono text-emerald-300">
                <Sparkles size={13} />
                <span>Booking Confirmed & Cryptographically Anchored</span>
              </div>
              <h2 className="text-2xl font-serif font-bold text-[#F7F5F0]">
                Your Cinematic Admission Pass is Ready!
              </h2>
            </div>

            {/* 3D Interactive Ticket Component */}
            <DigitalTicket3D
              booking={bookingConfirmedData}
              onClose={onClose}
            />
          </div>
        )}
      </div>
    </div>
  );
}

