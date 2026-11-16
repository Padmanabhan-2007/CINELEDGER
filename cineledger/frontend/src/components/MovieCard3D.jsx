import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Ticket, ArrowUpRight, Sparkles, Play } from 'lucide-react';

export default function MovieCard3D({ film, onBookNow, onWatchTrailer }) {
  const cardRef = useRef(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -12; // tilt angle
    const rotateY = ((x - centerX) / centerX) * 12;

    setRotation({ x: rotateX, y: rotateY });
    setGlare({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.35,
    });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
    setGlare({ x: 50, y: 50, opacity: 0 });
  };

  const ratingScore = film.ratingScore || (film.releaseYear >= 2024 ? '9.1' : '8.9');

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="perspective-1000 group relative transition-transform duration-300 ease-out"
    >
      <div
        className="relative bg-[#161913] border border-[#262C21] hover:border-[#B88750]/60 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 preserve-3d"
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) translateZ(0)`,
          boxShadow: rotation.x !== 0 ? '0 20px 40px rgba(0,0,0,0.6), 0 0 25px rgba(184,135,80,0.18)' : '0 10px 30px rgba(0,0,0,0.4)',
        }}
      >
        {/* Dynamic Specular Glare */}
        <div
          className="absolute inset-0 pointer-events-none z-30 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255, 230, 180, ${glare.opacity}) 0%, transparent 60%)`,
          }}
        />

        {/* Poster Wrapper */}
        <div className="relative aspect-[2/3] w-full overflow-hidden bg-[#10120E]">
          <img
            src={film.posterUrl}
            alt={film.title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
            loading="lazy"
          />

          {/* Cinematic Vignette Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#141712] via-[#141712]/30 to-transparent opacity-90 group-hover:opacity-75 transition-opacity" />
          <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-[#0A0B08]/80 to-transparent pointer-events-none" />

          {/* Top Floating Badges */}
          <div className="absolute top-3 inset-x-3 flex items-center justify-between z-20">
            <span className="px-2.5 py-1 rounded-md bg-[#0F120E]/85 backdrop-blur-md border border-[#2E3528] text-[10px] font-mono font-bold text-[#E5A955] flex items-center gap-1 shadow-md">
              <Star size={12} className="fill-[#E5A955] text-[#E5A955]" />
              <span>{ratingScore}</span>
            </span>

            <span className="px-2 py-0.5 rounded bg-[#294A3C]/90 backdrop-blur-md border border-[#B88750]/40 text-[10px] font-mono font-semibold text-[#F7F5F0] tracking-wider uppercase shadow-md">
              {film.rating || 'PG-13'}
            </span>
          </div>

          {/* Format Chips on Hover */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center gap-1.5 z-20 flex-wrap">
            <span className="px-2 py-0.5 rounded bg-[#1A1F16]/90 backdrop-blur-md border border-[#B88750]/30 text-[9px] font-mono text-[#D4A76A]">
              IMAX 4K
            </span>
            <span className="px-2 py-0.5 rounded bg-[#1A1F16]/90 backdrop-blur-md border border-[#2E3528] text-[9px] font-mono text-[#C8CCC3]">
              Dolby Atmos
            </span>
          </div>

          {/* Hover Play Trailer Overlay Button */}
          {onWatchTrailer && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onWatchTrailer(film);
              }}
              className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-[#E5A955]/90 text-[#11130F] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100 shadow-xl shadow-[#E5A955]/30 z-20 hover:bg-[#FFE4B0]"
              title="Watch Preview"
            >
              <Play size={20} className="fill-current ml-0.5" />
            </button>
          )}
        </div>

        {/* Content Section */}
        <div className="p-4 space-y-2.5 relative z-20">
          <div>
            <div className="flex items-center justify-between text-[11px] font-mono text-[#8E948A] mb-1">
              <span>{film.genre?.split('/')[0]?.trim() || 'Epic Drama'}</span>
              <span className="flex items-center gap-1">
                <Clock size={11} className="text-[#B88750]" />
                {film.durationMinutes || 150}m
              </span>
            </div>

            <h3 className="font-serif font-bold text-base text-[#F7F5F0] group-hover:text-[#E5A955] transition-colors line-clamp-1">
              {film.title}
            </h3>
          </div>

          <p className="text-xs text-[#8E948A] line-clamp-2 leading-relaxed">
            {film.synopsis || 'Experience monumental theatrical storytelling across premium large-format screens.'}
          </p>

          {/* Action CTAs */}
          <div className="pt-2 flex items-center gap-2">
            <button
              onClick={() => onBookNow(film)}
              className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-[#B88750] to-[#8C6233] hover:from-[#E5A955] hover:to-[#B88750] text-[#11130F] font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-[#B88750]/20 transition-all transform active:scale-95"
            >
              <Ticket size={13} className="stroke-[2.5]" />
              <span>Book Seats</span>
            </button>

            <Link
              to={`/app/films/${film.id}`}
              className="p-2 rounded-xl bg-[#1D221A] hover:bg-[#283024] border border-[#2E3528] text-[#C8CCC3] hover:text-[#F7F5F0] transition-colors"
              title="View Master Details"
            >
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

