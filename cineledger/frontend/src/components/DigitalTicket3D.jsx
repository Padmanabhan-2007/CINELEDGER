import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import {
  Armchair,
  Calendar,
  CalendarPlus,
  CheckCircle2,
  Clock,
  MapPin,
  RotateCw,
  Share2,
  Smartphone,
  Sparkles,
  Ticket,
  ShieldCheck,
  Award,
  Zap,
} from 'lucide-react';
import { cinemaAudio } from '../utils/cinemaAudio';

const SPRING = { stiffness: 180, damping: 16, mass: 0.5 };

function formatSession(booking) {
  if (booking.showDateTime) {
    const d = new Date(booking.showDateTime);
    if (!Number.isNaN(d.getTime())) {
      return {
        date: d.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' }),
        time: d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        start: d,
      };
    }
  }
  return { date: booking.showDate || 'Today', time: booking.showTime || '06:45 PM', start: null };
}

const icsDate = (d) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

function downloadIcs({ booking, ref, seatList, start }) {
  cinemaAudio.playLaserScanBeep();
  const from = start || new Date();
  const to = new Date(from.getTime() + 3 * 60 * 60 * 1000);
  const body = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//CineLedger//Cinemaholic//EN',
    'BEGIN:VEVENT',
    `UID:${ref}@cineledger`,
    `DTSTAMP:${icsDate(new Date())}`,
    `DTSTART:${icsDate(from)}`,
    `DTEND:${icsDate(to)}`,
    `SUMMARY:${booking.filmTitle} (${seatList})`,
    `LOCATION:${booking.cinemaName || ''} ${booking.screenName || ''}`.trim(),
    `DESCRIPTION:Booking Ref: ${ref}. Reserved Seats: ${seatList}. Powered by CineLedger Cryptographic Ledger.`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
  const url = URL.createObjectURL(new Blob([body], { type: 'text/calendar' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = `${ref}.ics`;
  a.click();
  URL.revokeObjectURL(url);
}

// Background Running Movie Titles Marquee Rows
const RUNNING_FILMS_ROW_1 = [
  'KALKI 2898 AD',
  'INTERSTELLAR',
  'DUNE: PART TWO',
  'OPPENHEIMER',
  'INCEPTION',
  'THE DARK KNIGHT',
  'AVATAR: THE WAY OF WATER',
  'BLADE RUNNER 2049',
];

const RUNNING_FILMS_ROW_2 = [
  'IMAX 4K DUAL LASER',
  'DOLBY ATMOS 12-CHANNEL',
  '70MM LARGE FORMAT',
  'PVR GOLD CLASS RECLINER',
  'DIRECTOR’S CUT SUITE',
  'CINEMAHOLIC ECOSYSTEM',
];

const RUNNING_FILMS_ROW_3 = [
  'GLADIATOR II',
  'TENET',
  'THE MATRIX',
  'INTERSTELLAR',
  'KALKI 2898 AD',
  'DUNE',
  'OPPENHEIMER',
  'INCEPTION',
];

const RUNNING_FILMS_ROW_4 = [
  'OFFICIAL ADMISSION PASS',
  'VERIFIED TICKET HOLDER',
  'RESERVED SEAT SIGHTLINE',
  'GATE BARCODE VALIDATED',
  'HIGH DYNAMIC RANGE',
];

export default function DigitalTicket3D({ booking, onClose }) {
  const wrapRef = useRef(null);
  const [flipped, setFlipped] = useState(false);
  const [gyroState, setGyroState] = useState('idle');
  const [notice, setNotice] = useState('');
  const [selectedSeatIndex, setSelectedSeatIndex] = useState(-1); // -1 = All Seats

  const ref = useMemo(
    () => booking.bookingReference || `CLG-${Math.floor(100000 + Math.random() * 900000)}`,
    [booking.bookingReference],
  );

  const seatArray = useMemo(() => {
    if (Array.isArray(booking.seats)) return booking.seats;
    if (typeof booking.seats === 'string') return booking.seats.split(',').map((s) => s.trim());
    return ['A1'];
  }, [booking.seats]);

  const displayedSeat = selectedSeatIndex === -1 ? seatArray.join(', ') : seatArray[selectedSeatIndex];
  const session = formatSession(booking);
  const qrValue = booking.qrCode || `${ref}|${displayedSeat}|${booking.filmTitle}`;

  /* ---- pointer / gyro driven motion values (normalised 0..1) ---- */
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, SPRING);
  const sy = useSpring(py, SPRING);

  const rotateY = useTransform(sx, [0, 1], [-16, 16]);
  const rotateX = useTransform(sy, [0, 1], [16, -16]);
  const gx = useTransform(sx, [0, 1], [0, 100]);
  const gy = useTransform(sy, [0, 1], [0, 100]);

  // Advanced 24K Liquid Gold & Champagne Specular Sheen (Zero candy rainbow)
  const sheenAngle = useTransform(sx, [0, 1], [35, 145]);
  const goldSheen = useMotionTemplate`linear-gradient(${sheenAngle}deg, rgba(255,255,255,0) 0%, rgba(212,175,55,0.08) 25%, rgba(255,248,220,0.42) 50%, rgba(193,140,85,0.18) 75%, rgba(255,255,255,0) 100%)`;
  const specularGlare = useMotionTemplate`radial-gradient(circle 340px at ${gx}% ${gy}%, rgba(255,246,225,0.45) 0%, rgba(212,175,55,0.15) 38%, rgba(0,0,0,0) 70%)`;

  const shadowX = useTransform(sx, [0, 1], [24, -24]);
  const shadowY = useTransform(sy, [0, 1], [35, 15]);
  const shadow = useMotionTemplate`${shadowX}px ${shadowY}px 70px rgba(0,0,0,0.9), 0 0 50px rgba(193,140,85,0.3)`;

  const onPointerMove = useCallback(
    (e) => {
      if (gyroState === 'on' || !wrapRef.current) return;
      const r = wrapRef.current.getBoundingClientRect();
      px.set(Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)));
      py.set(Math.min(1, Math.max(0, (e.clientY - r.top) / r.height)));
    },
    [px, py, gyroState],
  );

  const onPointerLeave = useCallback(() => {
    if (gyroState === 'on') return;
    px.set(0.5);
    py.set(0.5);
  }, [px, py, gyroState]);

  /* ---- gyroscope (iOS / Android tilt) ---- */
  useEffect(() => {
    if (typeof window === 'undefined' || !('DeviceOrientationEvent' in window)) return;
    const needsPermission = typeof window.DeviceOrientationEvent.requestPermission === 'function';
    const coarse = window.matchMedia?.('(pointer: coarse)').matches;
    if (!coarse) return;
    setGyroState(needsPermission ? 'needs-permission' : 'on');
  }, []);

  useEffect(() => {
    if (gyroState !== 'on') return undefined;
    const handler = (e) => {
      if (e.gamma == null || e.beta == null) return;
      px.set(Math.min(1, Math.max(0, (e.gamma + 30) / 60)));
      py.set(Math.min(1, Math.max(0, (e.beta - 25) / 50)));
    };
    window.addEventListener('deviceorientation', handler);
    return () => window.removeEventListener('deviceorientation', handler);
  }, [gyroState, px, py]);

  const handleFlip = () => {
    cinemaAudio.playCardFlipWhoosh();
    setFlipped((f) => !f);
  };

  const enableGyro = async () => {
    try {
      const res = await window.DeviceOrientationEvent.requestPermission();
      setGyroState(res === 'granted' ? 'on' : 'idle');
    } catch {
      setGyroState('idle');
    }
  };

  const share = async () => {
    cinemaAudio.playLaserScanBeep();
    const text = `${booking.filmTitle} · ${session.date} ${session.time} · Seats ${displayedSeat} · Ref ${ref}`;
    try {
      if (navigator.share) await navigator.share({ title: 'My CineLedger VIP Pass', text });
      else {
        await navigator.clipboard.writeText(text);
        setNotice('VIP Ticket details copied to clipboard');
        setTimeout(() => setNotice(''), 2500);
      }
    } catch {}
  };

  return (
    <div className="relative w-full min-h-[620px] flex flex-col items-center justify-center p-3 sm:p-4 overflow-hidden select-none">
      {/* ------------------------------------------------------------- */}
      {/* BACKGROUND COMPONENT: RUNNING MOVIE TITLES LIKE LANDING PAGE */}
      {/* ------------------------------------------------------------- */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex flex-col justify-around py-4 z-0 opacity-25">
        <div className="clt-ticker-row clt-move-left whitespace-nowrap text-xs font-serif tracking-[0.25em] text-[#C18C55]">
          {[...RUNNING_FILMS_ROW_1, ...RUNNING_FILMS_ROW_1, ...RUNNING_FILMS_ROW_1].map((title, i) => (
            <span key={i} className="inline-block mx-4">
              {title} <span className="opacity-40">★</span>
            </span>
          ))}
        </div>

        <div className="clt-ticker-row clt-move-right whitespace-nowrap text-[11px] font-mono tracking-[0.2em] text-[#E5B982]">
          {[...RUNNING_FILMS_ROW_2, ...RUNNING_FILMS_ROW_2, ...RUNNING_FILMS_ROW_2].map((fmt, i) => (
            <span key={i} className="inline-block mx-4">
              {fmt} <span className="opacity-40">•</span>
            </span>
          ))}
        </div>

        <div className="clt-ticker-row clt-move-left-fast whitespace-nowrap text-xs font-serif tracking-[0.25em] text-[#C18C55]">
          {[...RUNNING_FILMS_ROW_3, ...RUNNING_FILMS_ROW_3, ...RUNNING_FILMS_ROW_3].map((title, i) => (
            <span key={i} className="inline-block mx-4">
              {title} <span className="opacity-40">★</span>
            </span>
          ))}
        </div>

        <div className="clt-ticker-row clt-move-right-slow whitespace-nowrap text-[10px] font-mono tracking-[0.22em] text-[#E5B982]">
          {[...RUNNING_FILMS_ROW_4, ...RUNNING_FILMS_ROW_4, ...RUNNING_FILMS_ROW_4].map((txt, i) => (
            <span key={i} className="inline-block mx-4">
              {txt} <span className="opacity-40">•</span>
            </span>
          ))}
        </div>

        <div className="clt-ticker-row clt-move-left whitespace-nowrap text-xs font-serif tracking-[0.25em] text-[#C18C55]">
          {[...RUNNING_FILMS_ROW_1, ...RUNNING_FILMS_ROW_1, ...RUNNING_FILMS_ROW_1].map((title, i) => (
            <span key={i} className="inline-block mx-4">
              {title} <span className="opacity-40">★</span>
            </span>
          ))}
        </div>
      </div>

      {/* Radial Vignette Mask so Center Ticket Stands Out Clearly */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background:
            'radial-gradient(ellipse 65% 65% at 50% 50%, rgba(14,11,9,0.2) 0%, rgba(14,11,9,0.88) 68%, rgba(14,11,9,0.98) 100%)',
        }}
      />

      {/* Styles for Perforations, Laser Scan & Foil */}
      <style>{`
        .clt-stage { perspective: 1200px; width: 100%; max-width: 25.5rem; touch-action: pan-y; position: relative; z-index: 10; }
        .clt-face {
          position: absolute; inset: 0; backface-visibility: hidden; -webkit-backface-visibility: hidden;
          border-radius: 1.5rem;
          background: linear-gradient(180deg, #1C1715 0%, #120E0D 55%, #0B0908 100%);
          border: 1px solid rgba(212, 175, 55, 0.45);
          box-shadow: 0 0 35px rgba(193, 140, 85, 0.22);
          transform-style: preserve-3d;
          --notch: 64%;
          -webkit-mask-image: radial-gradient(circle at 0 var(--notch), #0000 14px, #000 15px), radial-gradient(circle at 100% var(--notch), #0000 14px, #000 15px);
          -webkit-mask-composite: source-in;
          mask-image: radial-gradient(circle at 0 var(--notch), #0000 14px, #000 15px), radial-gradient(circle at 100% var(--notch), #0000 14px, #000 15px);
          mask-composite: intersect;
        }
        .clt-back { transform: rotateY(180deg); }
        .clt-foil {
          position: relative; overflow: hidden; border-radius: 1.5rem 1.5rem 0 0;
          background: linear-gradient(110deg, #6B4219 0%, #C18C55 25%, #FFF0D0 50%, #C18C55 75%, #6B4219 100%);
          border-bottom: 1px solid rgba(212, 175, 55, 0.5);
        }
        .clt-foil::after {
          content: ""; position: absolute; inset: 0;
          background: linear-gradient(105deg, transparent 35%, rgba(255, 255, 255, 0.85) 50%, transparent 65%);
          transform: translateX(-120%); animation: clt-sweep 3.5s ease-in-out infinite;
        }
        @keyframes clt-sweep { 0%, 35% { transform: translateX(-120%); } 70%, 100% { transform: translateX(120%); } }

        /* Glowing Laser Scanner Line Over Barcode */
        .clt-laser-line {
          position: absolute; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, transparent, #FFDF73 50%, transparent);
          box-shadow: 0 0 10px #D4AF37, 0 0 20px #C18C55;
          animation: clt-laser 2.4s ease-in-out infinite alternate;
        }
        @keyframes clt-laser {
          0% { top: 6%; opacity: 0.3; }
          50% { opacity: 1; }
          100% { top: 92%; opacity: 0.3; }
        }

        /* Running Movie Titles Keyframes */
        .clt-move-left { animation: clt-marquee-left 34s linear infinite; }
        .clt-move-left-fast { animation: clt-marquee-left 26s linear infinite; }
        .clt-move-right { animation: clt-marquee-right 38s linear infinite; }
        .clt-move-right-slow { animation: clt-marquee-right 46s linear infinite; }

        @keyframes clt-marquee-left {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        @keyframes clt-marquee-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }

        /* Perforation Stitching Line */
        .clt-perforation {
          border-top: 1.5px dashed rgba(212, 175, 55, 0.35);
          position: relative;
        }
        .clt-perforation::before, .clt-perforation::after {
          content: ""; position: absolute; top: -7px; width: 14px; height: 14px;
          border-radius: 50%; background: #14100E;
          box-shadow: inset 0 0 4px rgba(212, 175, 55, 0.5);
        }
        .clt-perforation::before { left: -22px; }
        .clt-perforation::after { right: -22px; }

        @media (prefers-reduced-motion: reduce) {
          .clt-foil::after, .clt-move-left, .clt-move-left-fast, .clt-move-right, .clt-move-right-slow, .clt-laser-line { animation: none; }
        }
      `}</style>

      {/* ------------------------------------------------------------- */}
      {/* MULTI-SEAT CAROUSEL SELECTOR (IF MULTIPLE SEATS BOOKED)       */}
      {/* ------------------------------------------------------------- */}
      {seatArray.length > 1 && (
        <div className="relative z-20 mb-3 flex items-center gap-1.5 p-1 rounded-2xl bg-[#1C1715]/90 border border-[#C18C55]/30 backdrop-blur-md shadow-xl">
          <button
            type="button"
            onClick={() => {
              cinemaAudio.playLaserScanBeep();
              setSelectedSeatIndex(-1);
            }}
            className={`px-3 py-1 rounded-xl text-[11px] font-bold tracking-wider uppercase transition-all ${
              selectedSeatIndex === -1
                ? 'bg-[#C18C55] text-[#14100E] shadow-md shadow-[#C18C55]/30'
                : 'text-[#A89D93] hover:text-white'
            }`}
          >
            All Seats ({seatArray.length})
          </button>
          {seatArray.map((st, idx) => (
            <button
              key={st}
              type="button"
              onClick={() => {
                cinemaAudio.playLaserScanBeep();
                setSelectedSeatIndex(idx);
              }}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-mono font-bold transition-all ${
                selectedSeatIndex === idx
                  ? 'bg-[#C18C55] text-[#14100E] shadow-md shadow-[#C18C55]/30'
                  : 'text-[#A89D93] hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 3D PERSPECTIVE CARD WITH 24K GOLD COLOR GRADING               */}
      {/* ------------------------------------------------------------- */}
      <div ref={wrapRef} className="clt-stage" onPointerMove={onPointerMove} onPointerLeave={onPointerLeave}>
        <motion.div
          initial={{ y: -70, rotateX: 30, opacity: 0, scale: 0.92 }}
          animate={{ y: 0, rotateX: 0, opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 140, damping: 16 }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          <motion.div
            style={{
              rotateX,
              rotateY,
              transformStyle: 'preserve-3d',
              boxShadow: shadow,
              borderRadius: '1.5rem',
            }}
            className="relative w-full"
          >
            {/* Flip Wrapper */}
            <motion.div
              animate={{ rotateY: flipped ? 180 : 0 }}
              transition={{ type: 'spring', stiffness: 95, damping: 14 }}
              style={{ transformStyle: 'preserve-3d', aspectRatio: '10 / 16' }}
              className="relative w-full"
            >
              {/* ---------------- FRONT: LUXURY CINEMA PASS ---------------- */}
              <div className="clt-face flex flex-col">
                {/* 24K Gold Foil Header Banner */}
                <div className="clt-foil p-3 text-center">
                  <div className="flex items-center justify-center gap-2 text-[#1A120A] text-xs uppercase font-extrabold tracking-widest">
                    <Sparkles size={13} className="fill-current text-[#4A2D11]" />
                    <span className="font-serif">Official Theatrical Admission Pass</span>
                    <Sparkles size={13} className="fill-current text-[#4A2D11]" />
                  </div>
                </div>

                <div className="p-5 sm:p-6 flex-1 flex flex-col gap-3.5" style={{ transformStyle: 'preserve-3d' }}>
                  {/* Poster & Title Banner with Pop-out 3D Effect */}
                  <div className="flex gap-4 items-center" style={{ transformStyle: 'preserve-3d' }}>
                    <div className="relative" style={{ transform: 'translateZ(42px)' }}>
                      <img
                        src={booking.posterUrl || '/assets/posters/kalki.png'}
                        alt={booking.filmTitle}
                        className="w-20 h-28 object-cover rounded-xl border border-[#C18C55]/60 shadow-2xl"
                        style={{
                          boxShadow: '0 18px 36px rgba(0,0,0,0.75), 0 0 20px rgba(193,140,85,0.3)',
                        }}
                      />
                      {/* Floating VIP Hologram Medallion Stamp */}
                      <div
                        className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-tr from-[#6B4219] via-[#FFF0D0] to-[#C18C55] p-0.5 shadow-lg flex items-center justify-center"
                        style={{ transform: 'translateZ(18px)' }}
                        title="Cinemaholic Certified 2026"
                      >
                        <div className="w-full h-full rounded-full bg-[#1C1715] flex items-center justify-center">
                          <Award size={14} className="text-[#C18C55]" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1 flex-1 min-w-0" style={{ transform: 'translateZ(24px)' }}>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#291F18] border border-[#C18C55]/50 text-[10px] font-bold text-[#E5B982] uppercase tracking-wider">
                        <Zap size={10} className="text-[#D4AF37]" />
                        {booking.format || booking.screenFormat || 'IMAX 4K Laser'}
                      </span>
                      <h2 className="font-serif font-bold text-lg sm:text-xl text-[#FBF8F2] truncate leading-tight pt-0.5">
                        {booking.filmTitle}
                      </h2>
                      <p className="text-xs text-[#A89D93] flex items-center gap-1 truncate">
                        <MapPin size={12} className="text-[#C18C55] shrink-0" />
                        <span className="truncate">{booking.cinemaName}</span>
                      </p>
                      <p className="text-[11px] text-[#C18C55] font-semibold">{booking.screenName}</p>
                    </div>
                  </div>

                  {/* Seat and Session Metadata Box */}
                  <div
                    className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-[#14100E] border border-[#C18C55]/25"
                    style={{ transform: 'translateZ(15px)' }}
                  >
                    <div>
                      <p className="text-[10px] text-[#817366] uppercase tracking-wider font-semibold">
                        Date & Showtime
                      </p>
                      <p className="text-xs font-semibold text-[#FBF8F2] flex items-center gap-1.5 mt-0.5">
                        <Calendar size={12} className="text-[#C18C55]" />
                        <span className="truncate">{session.date}</span>
                      </p>
                      <p className="text-xs text-[#E5B982] font-semibold flex items-center gap-1.5 mt-0.5">
                        <Clock size={12} className="text-[#C18C55]" />
                        <span>{session.time}</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-[#817366] uppercase tracking-wider font-semibold">
                        {selectedSeatIndex === -1 ? 'Auditorium Seats' : 'Selected Seat'}
                      </p>
                      <p className="text-sm font-bold text-[#FBF8F2] flex items-center gap-1.5 mt-0.5">
                        <Armchair size={13} className="text-[#10B981]" />
                        <span className="truncate font-mono text-[#E5B982]">{displayedSeat}</span>
                      </p>
                      <p className="text-[10px] text-[#A89D93] mt-0.5">
                        {selectedSeatIndex === -1
                          ? `${seatArray.length} Reserved Ticket(s)`
                          : `Pass 1 of ${seatArray.length}`}
                      </p>
                    </div>
                  </div>

                  {/* Perforation Divider Line */}
                  <div className="clt-perforation my-0.5" />

                  {/* Bottom Verification Footer with Laser-Scanned Barcode */}
                  <div
                    className="mt-auto pt-2 flex items-center justify-between"
                    style={{ transform: 'translateZ(20px)' }}
                  >
                    <div>
                      <p className="text-[9px] text-[#817366] uppercase tracking-wider font-semibold">
                        Admission Ledger Ref
                      </p>
                      <p className="font-mono text-sm sm:text-base font-bold text-[#E5B982] tracking-wider">{ref}</p>
                      <p className="text-[10px] text-[#10B981] font-semibold flex items-center gap-1 mt-0.5">
                        <ShieldCheck size={12} />
                        <span>Cryptographically Verified</span>
                      </p>
                    </div>

                    {/* QR Code with Live Laser Sweep Animation */}
                    <div className="relative w-16 h-16 rounded-xl bg-[#F7F1E4] p-1.5 border border-[#C18C55]/60 shadow-lg overflow-hidden group">
                      <QRCodeSVG value={qrValue} size={52} bgColor="#F7F1E4" fgColor="#14100E" level="M" />
                      <div className="clt-laser-line pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* 24K Liquid Gold Metallic Sheen (NO rainbow!) */}
                <motion.div
                  aria-hidden
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: goldSheen,
                    mixBlendMode: 'screen',
                    opacity: 0.65,
                    borderRadius: '1.5rem',
                  }}
                />
                <motion.div
                  aria-hidden
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: specularGlare,
                    mixBlendMode: 'screen',
                    borderRadius: '1.5rem',
                  }}
                />
              </div>

              {/* ---------------- BACK: SCANNABLE GATE ADMISSION ---------------- */}
              <div className="clt-face clt-back flex flex-col items-center justify-center gap-4 p-7 text-center">
                <div className="flex items-center gap-2 text-xs font-serif font-bold uppercase tracking-widest text-[#C18C55]">
                  <Sparkles size={14} />
                  <span>Gate Barcode Scanner</span>
                  <Sparkles size={14} />
                </div>

                {/* Large QR with Live Laser Scan Line */}
                <div className="relative rounded-2xl bg-[#F7F1E4] p-4 border-2 border-[#C18C55] shadow-2xl overflow-hidden">
                  <QRCodeSVG value={qrValue} size={180} bgColor="#F7F1E4" fgColor="#14100E" level="M" />
                  <div className="clt-laser-line pointer-events-none" />
                </div>

                <div>
                  <p className="font-mono text-lg font-bold text-[#E5B982] tracking-widest">{ref}</p>
                  <p className="text-xs text-[#10B981] font-semibold mt-0.5">Seat: {displayedSeat}</p>
                </div>

                <p className="text-[11px] leading-relaxed text-[#A89D93] max-w-[16rem]">
                  Valid at <strong>{booking.cinemaName}</strong>. Scan directly at turnstile sensor or present to cinema usher.
                </p>

                <motion.div
                  aria-hidden
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: specularGlare,
                    mixBlendMode: 'screen',
                    borderRadius: '1.5rem',
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* ACTION BUTTONS (ADD TO CALENDAR, FLIP, SHARE)                 */}
      {/* ------------------------------------------------------------- */}
      <div className="relative z-10 mt-6 flex flex-wrap items-center justify-center gap-2 max-w-sm w-full">
        <button
          type="button"
          onClick={handleFlip}
          className="flex-1 min-w-[6.5rem] py-2.5 px-3.5 rounded-xl bg-[#261E1A] hover:bg-[#382C26] border border-[#C18C55]/30 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95"
        >
          <RotateCw size={13} className="text-[#C18C55]" />
          <span>{flipped ? 'Front Card' : 'Flip to QR'}</span>
        </button>

        <button
          type="button"
          onClick={() => downloadIcs({ booking, ref, seatList: displayedSeat, start: session.start })}
          className="flex-1 min-w-[7.5rem] py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-[#C18C55] to-[#A87442] hover:from-[#B58049] hover:to-[#996535] text-[#14100E] text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-lg active:scale-95"
        >
          <CalendarPlus size={14} />
          <span>Add to Calendar</span>
        </button>

        <button
          type="button"
          onClick={share}
          className="py-2.5 px-3.5 rounded-xl bg-[#261E1A] hover:bg-[#382C26] border border-[#C18C55]/30 text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95"
        >
          <Share2 size={13} className="text-[#C18C55]" />
          <span>Share</span>
        </button>

        {gyroState === 'needs-permission' && (
          <button
            type="button"
            onClick={enableGyro}
            className="py-2.5 px-3.5 rounded-xl bg-[#261E1A] hover:bg-[#382C26] border border-[#C18C55]/30 text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
          >
            <Smartphone size={13} className="text-[#C18C55]" />
            <span>Enable Tilt</span>
          </button>
        )}

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 px-4 rounded-xl bg-transparent border border-white/15 text-[#F4EDE1] text-xs font-medium hover:bg-white/5 transition-colors mt-1"
          >
            Close
          </button>
        )}
      </div>

      <p className="h-4 mt-2 text-[11px] text-[#10B981] font-semibold" role="status" aria-live="polite">
        {notice}
      </p>
    </div>
  );
}
