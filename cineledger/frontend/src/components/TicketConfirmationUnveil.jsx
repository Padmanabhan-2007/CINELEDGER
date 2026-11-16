import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Volume2,
  VolumeX,
  Sparkles,
  ArrowRight,
  Armchair,
  Film,
  X,
  Award,
} from 'lucide-react';
import DigitalTicket3D from './DigitalTicket3D';
import GoldenEmbersCanvas from './3d/particles/GoldenEmbersCanvas';
import { cinemaAudio } from '../utils/cinemaAudio';

export default function TicketConfirmationUnveil({ booking, onClose, onGoToDashboard }) {
  const [stage, setStage] = useState('processing'); // 'processing' | 'unveiling' | 'revealed'
  const [isMuted, setIsMuted] = useState(cinemaAudio.isMuted());

  const seatList = Array.isArray(booking?.seats)
    ? booking.seats
    : typeof booking?.seats === 'string'
    ? booking.seats.split(',').map((s) => s.trim())
    : ['A1'];

  useEffect(() => {
    // Stage 1: Play initial cinematic sub-bass boom
    cinemaAudio.playCinematicBoom();

    // Stage 2: Trigger celebration chime and multi-cannon fireworks
    const t1 = setTimeout(() => {
      setStage('unveiling');
      cinemaAudio.playCelebrationChime();

      // Synchronized Grand Theatrical Confetti Cannons
      // Left Cannon
      confetti({
        particleCount: 80,
        angle: 60,
        spread: 70,
        origin: { x: 0.05, y: 0.85 },
        colors: ['#D4AF37', '#F5E6C8', '#FFFFFF', '#10B981', '#C18C55'],
        ticks: 280,
      });

      // Right Cannon
      confetti({
        particleCount: 80,
        angle: 120,
        spread: 70,
        origin: { x: 0.95, y: 0.85 },
        colors: ['#D4AF37', '#F5E6C8', '#FFFFFF', '#10B981', '#C18C55'],
        ticks: 280,
      });

      // Center High Altitude Starburst
      setTimeout(() => {
        confetti({
          particleCount: 90,
          spread: 100,
          origin: { x: 0.5, y: 0.35 },
          colors: ['#FFF0D0', '#D4AF37', '#E5B982'],
          shapes: ['circle'],
          scalar: 1.2,
          ticks: 320,
        });
      }, 250);
    }, 1100);

    // Stage 3: Fully transition to interactive ticket view
    const t2 = setTimeout(() => {
      setStage('revealed');
    }, 1600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const toggleSound = () => {
    const next = cinemaAudio.toggleMute();
    setIsMuted(next);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/90 backdrop-blur-xl animate-fadeIn select-none">
      {/* Interactive Golden Embers Canvas Background */}
      <GoldenEmbersCanvas particleCount={45} />

      {/* Top HUD Controls: Audio Mute & Close */}
      <div className="absolute top-4 right-4 z-50 flex items-center gap-2.5">
        <button
          onClick={toggleSound}
          className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-[#E5B982] backdrop-blur-md transition-all shadow-lg active:scale-95"
          title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
        >
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
        <button
          onClick={onClose}
          className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white backdrop-blur-md transition-all shadow-lg active:scale-95"
          title="Close Pass"
        >
          <X size={16} />
        </button>
      </div>

      {/* Cinematic Anamorphic Letterbox Bars */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-8 sm:h-12 bg-gradient-to-b from-black to-transparent z-40" />
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-8 sm:h-12 bg-gradient-to-t from-black to-transparent z-40" />

      {/* STAGE 1: CINEMATIC VERIFICATION SEQUENCE */}
      <AnimatePresence>
        {stage === 'processing' && (
          <motion.div
            key="processing"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.15, filter: 'blur(8px)' }}
            transition={{ duration: 0.45 }}
            className="flex flex-col items-center justify-center p-8 text-center z-30"
          >
            {/* Pulsing Golden Sonic Ring */}
            <div className="relative mb-6">
              <div className="absolute inset-0 -m-6 rounded-full border-2 border-[#D4AF37]/40 animate-ping" />
              <div className="absolute inset-0 -m-3 rounded-full border border-[#C18C55]/60 animate-pulse" />
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#6B4219] via-[#C18C55] to-[#FFF0D0] p-1 shadow-[0_0_40px_rgba(212,175,55,0.6)] flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-[#14100E] flex items-center justify-center">
                  <CheckCircle2 size={36} className="text-[#10B981] animate-bounce" />
                </div>
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#291F18] border border-[#C18C55]/50 text-[#E5B982] text-xs font-bold uppercase tracking-widest mb-2 shadow-lg">
              <Sparkles size={12} className="text-[#D4AF37]" />
              <span>CineLedger Security Verification</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-2">
              Payment Confirmed
            </h2>
            <p className="text-xs text-[#A89D93] max-w-sm mb-5">
              Cryptographic transaction verified on distributed cinema audit ledger.
            </p>

            {/* Reserved Seats Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {seatList.map((st, i) => (
                <motion.span
                  key={st}
                  initial={{ scale: 0, y: 10 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.08 }}
                  className="px-3 py-1 rounded-lg bg-[#C18C55]/20 border border-[#C18C55] text-white font-mono font-bold text-xs flex items-center gap-1.5 shadow-md"
                >
                  <Armchair size={12} className="text-[#10B981]" />
                  <span>Seat {st}</span>
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* STAGE 2 & 3: 3D HOLOGRAPHIC TICKET UNVEILING */}
      {(stage === 'unveiling' || stage === 'revealed') && (
        <motion.div
          key="ticket-view"
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-30 flex flex-col items-center max-w-lg w-full py-6 px-3"
        >
          {/* Volumetric Projector Light Cone from Top */}
          <div
            className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-96 opacity-35 z-0"
            style={{
              background: 'conic-gradient(from 180deg at 50% 0%, rgba(212,175,55,0.45) 0deg, transparent 40deg, transparent 320deg, rgba(212,175,55,0.45) 360deg)',
              filter: 'blur(20px)',
            }}
          />

          {/* Celebratory Banner */}
          <div className="mb-2 text-center relative z-20">
            <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-[#291F18]/90 border border-[#C18C55]/60 text-[#E5B982] text-[11px] font-bold uppercase tracking-widest shadow-xl">
              <Award size={12} className="text-[#D4AF37]" />
              <span>Official 3D Admission Hologram</span>
            </span>
          </div>

          {/* The 3D Ticket Pass */}
          <DigitalTicket3D booking={booking} />

          {/* Bottom Navigation CTA Buttons */}
          <div className="relative z-20 mt-4 flex items-center gap-3 w-full max-w-sm px-2">
            <button
              onClick={onGoToDashboard}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#C18C55] to-[#A87442] hover:from-[#B58049] hover:to-[#996535] text-[#14100E] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-[#C18C55]/20 transition-all active:scale-95"
            >
              <span>View in My Bookings</span>
              <ArrowRight size={14} />
            </button>
            <button
              onClick={onClose}
              className="py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-medium transition-all active:scale-95"
            >
              Back to Showtimes
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

