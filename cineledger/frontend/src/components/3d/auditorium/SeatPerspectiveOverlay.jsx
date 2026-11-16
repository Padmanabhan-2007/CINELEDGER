import React from 'react';
import { Eye, RotateCcw, Compass, Ruler, Sparkles, Sun, Moon, Video, Clapperboard } from 'lucide-react';
import { cinemaAudio } from '../../../utils/cinemaAudio';

export default function SeatPerspectiveOverlay({
  cameraMode,
  setCameraMode,
  activeSeat,
  lightingMode = 'SCREENING',
  setLightingMode,
  selectedCount = 0,
  onResetView,
  cinebotInfo = null,
}) {
  const isSeatView = cameraMode === 'SEAT_PERSPECTIVE' && activeSeat;
  const isStageView = cameraMode === 'STAGE_VIEW';
  const isTouring = cameraMode === 'CINEMA_TOUR';
  const isScreening = lightingMode === 'SCREENING';

  const toggleLighting = () => {
    cinemaAudio.playLaserScanBeep();
    if (setLightingMode) {
      setLightingMode(isScreening ? 'HOUSE_LIGHTS' : 'SCREENING');
    }
  };

  const toggleTour = () => {
    cinemaAudio.playCinematicBoom();
    if (isTouring) {
      setCameraMode('OVERVIEW');
    } else {
      setCameraMode('CINEMA_TOUR');
    }
  };

  const toggleStageView = () => {
    cinemaAudio.playLaserScanBeep();
    if (isStageView) {
      setCameraMode('OVERVIEW');
    } else {
      setCameraMode('STAGE_VIEW');
    }
  };

  return (
    <div className="pointer-events-none absolute inset-0 p-3 sm:p-6 flex flex-col justify-between z-20">
      {/* Cinebot Hollywood Director's HUD Bar */}
      {isTouring && (
        <div className="pointer-events-auto w-full max-w-xl mx-auto mb-2 flex flex-col gap-1.5 px-4 py-2 rounded-2xl bg-[#14100E]/95 backdrop-blur-md border border-[#E5B982]/40 shadow-2xl animate-fade-in text-center">
          <div className="flex items-center justify-between w-full text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              <span className="font-mono font-bold tracking-wider text-[#E5B982] uppercase text-[11px]">
                CINEBOT CRANE CAM
              </span>
            </div>
            <span className="font-semibold text-white/90 text-xs truncate max-w-[280px]">
              {cinebotInfo?.title || 'Hollywood Cinematic Tour'}
            </span>
            <button
              onClick={() => setCameraMode('OVERVIEW')}
              className="px-2.5 py-0.5 rounded-md bg-white/10 hover:bg-white/20 text-[11px] text-white/80 transition-all font-mono"
            >
              Exit Tour
            </button>
          </div>
          {/* 5-Act Animated Progress Bar */}
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#C18C55] via-[#E5B982] to-[#10B981] transition-all duration-300"
              style={{
                width: `${Math.min(
                  100,
                  Math.round((((cinebotInfo?.act || 1) - 1 + (cinebotInfo?.progress || 0)) / 5) * 100)
                )}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* 1. Top Bar: Viewport Status & Theatrical Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left: Viewport Status Badge */}
        <div className="pointer-events-auto flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-[#1C1714]/90 backdrop-blur-md border border-[#C18C55]/30 text-white shadow-xl">
          <div
            className={`w-2.5 h-2.5 rounded-full ${
              isSeatView
                ? 'bg-[#10B981] animate-pulse'
                : isStageView
                ? 'bg-[#D4AF37] animate-pulse'
                : isTouring
                ? 'bg-[#E5B982] animate-ping'
                : 'bg-[#C18C55]'
            }`}
          />
          <span className="text-xs font-semibold">
            {isSeatView
              ? `Live Sightline: Seat ${activeSeat.seatCode} (${activeSeat.tier})`
              : isStageView
              ? '🎭 Stage View: Looking back at all 252 seats from the screen'
              : isTouring
              ? '🚁 Cinematic Flythrough Tour Active'
              : 'Auditorium Overview (252 Seats • Click any seat to fly)'}
          </span>
        </div>

        {/* Right: Lighting Mode, Stage View & Cinema Tour Controls */}
        <div className="pointer-events-auto flex items-center gap-2">
          {/* Stage View Button (See all 252 seats from screen) */}
          <button
            onClick={toggleStageView}
            title="Stand on Screen Stage & Look at All 252 Seats"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all shadow-md active:scale-95 ${
              isStageView
                ? 'bg-[#D4AF37] border-[#D4AF37] text-[#14100E] font-bold shadow-[#D4AF37]/30'
                : 'bg-[#291F18]/90 border-[#C18C55]/50 text-[#E5B982] hover:bg-[#382B22]'
            }`}
          >
            <Clapperboard size={14} className={isStageView ? 'text-[#14100E]' : 'text-[#D4AF37]'} />
            <span>{isStageView ? 'Exit Stage' : 'Stage / Screen View'}</span>
          </button>

          {/* Lighting Mode Switcher */}
          <button
            onClick={toggleLighting}
            title={isScreening ? 'Turn on House Lights' : 'Switch to Dark Screening Mode'}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all shadow-md active:scale-95 ${
              isScreening
                ? 'bg-[#291F18]/90 border-[#C18C55]/50 text-[#E5B982] hover:bg-[#382B22]'
                : 'bg-[#FFF8E7]/90 border-[#D4AF37] text-[#14100E] hover:bg-white'
            }`}
          >
            {isScreening ? <Moon size={14} className="text-[#D4AF37]" /> : <Sun size={14} className="text-[#C18C55]" />}
            <span>{isScreening ? 'Screening Mode' : 'House Lights'}</span>
          </button>

          {/* Cinematic Flythrough Tour Button */}
          <button
            onClick={toggleTour}
            title="Start 3D Drone Flythrough"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-95 ${
              isTouring
                ? 'bg-[#10B981] border-[#10B981] text-[#14100E] animate-pulse'
                : 'bg-[#C18C55]/20 hover:bg-[#C18C55] hover:text-[#14100E] border-[#C18C55]/50 text-[#E5B982]'
            }`}
          >
            <Video size={14} />
            <span>{isTouring ? 'Exit Tour' : 'Cinema Tour'}</span>
          </button>

          {/* Optical Telemetry (Active when seated) */}
          {activeSeat && (
            <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-md border border-[#C18C55]/30 text-[#29211D] shadow-md text-xs">
              <div className="flex items-center gap-1 text-[#817366]">
                <Ruler className="w-3.5 h-3.5 text-[#C18C55]" />
                <span>
                  Dist: <strong className="text-[#29211D]">{activeSeat.distanceMeters || '14.5'}m</strong>
                </span>
              </div>
              <span className="text-gray-300">|</span>
              <div className="flex items-center gap-1 text-[#817366]">
                <Compass className="w-3.5 h-3.5 text-[#C18C55]" />
                <span>
                  Angle: <strong className="text-[#29211D]">{Math.abs(activeSeat.viewAngleDeg || 0)}°</strong>
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. Center Hint when Seated or in Stage View */}
      {isSeatView && (
        <div className="pointer-events-auto self-center -translate-y-4 flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-white/15 text-white text-[11px] shadow-2xl animate-fadeIn">
          <Eye className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Watching on 20m Curved Screen • Move cursor gently to look around • Click below to exit</span>
        </div>
      )}
      {isStageView && (
        <div className="pointer-events-auto self-center -translate-y-4 flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-[#D4AF37]/40 text-white text-[11px] shadow-2xl animate-fadeIn">
          <Eye className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Stage Vantage: Looking at all 252 stadium seats • Move mouse to inspect rows</span>
        </div>
      )}

      {/* 3. Bottom Floating Controls */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        {/* Tier Legend */}
        <div className="pointer-events-auto flex items-center gap-2.5 sm:gap-3 px-3.5 py-2 rounded-xl bg-[#1C1714]/90 backdrop-blur-md border border-white/10 text-white text-[11px] shadow-xl">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-[#73675D]" />
            <span>Classic ₹280</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-[#C18C55]" />
            <span>Prime ₹380</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-[#4E2416] border border-white/20" />
            <span>Recliner ₹550</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-[#10B981] shadow-[0_0_6px_#10B981]" />
            <span className="text-[#10B981] font-bold">Selected ({selectedCount})</span>
          </div>
        </div>

        {/* View Switcher Button */}
        {(activeSeat || isStageView) && (
          <div className="pointer-events-auto flex items-center gap-2">
            <button
              onClick={() => {
                if (onResetView) onResetView();
                else setCameraMode('OVERVIEW');
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#C18C55] hover:bg-[#B58049] text-[#14100E] text-xs font-bold uppercase tracking-wider shadow-xl transition-all active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Return to Room Overview</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
