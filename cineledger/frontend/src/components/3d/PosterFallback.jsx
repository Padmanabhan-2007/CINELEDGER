import React, { useState } from 'react';
import { POSTER_COLLECTION } from '../../data/posterManifest';

function FallbackPosterTile({ poster, onSelect }) {
  const [errored, setErrored] = useState(false);

  return (
    <button
      type="button"
      onClick={() => onSelect && onSelect(poster)}
      className="group relative w-28 sm:w-36 aspect-[2/3] rounded-xl overflow-hidden flex-shrink-0 border border-[#C18C55]/30 shadow-md transition-transform duration-300 hover:-translate-y-1.5 hover:scale-105 text-left"
      style={{
        background: `linear-gradient(155deg, ${poster.palette?.[0] || '#29211D'}, ${poster.palette?.[1] || '#817366'})`,
      }}
    >
      {!errored ? (
        <img
          src={poster.path}
          alt={poster.title}
          loading="lazy"
          onError={() => setErrored(true)}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full p-2.5 flex flex-col justify-between text-[#FBF8F2]">
          <span className="text-[9px] font-mono uppercase tracking-widest text-[#D6A876]">{poster.year}</span>
          <div>
            <p className="font-serif font-bold text-xs leading-tight">{poster.title}</p>
            <p className="text-[9px] opacity-80 mt-0.5">{poster.genre}</p>
          </div>
        </div>
      )}
    </button>
  );
}

export default function PosterFallback({ onSelectPoster }) {
  const rows = [
    POSTER_COLLECTION.slice(0, 7),
    POSTER_COLLECTION.slice(7, 14),
    POSTER_COLLECTION.slice(13, 20),
  ];

  return (
    <div
      className="w-full h-full overflow-hidden flex flex-col justify-center gap-4 select-none opacity-85"
      style={{
        transform: 'perspective(1100px) rotateY(-12deg) rotateZ(-5deg) scale(1.12)',
      }}
      aria-label="Curated Theatrical Poster Archive"
    >
      {rows.map((row, idx) => (
        <div
          key={idx}
          className="flex gap-4 justify-center"
          style={{
            transform: `translateX(${idx % 2 === 0 ? '-24px' : '24px'})`,
          }}
        >
          {[...row, ...row.slice(0, 3)].map((poster, i) => (
            <FallbackPosterTile key={`${poster.id}-${i}`} poster={poster} onSelect={onSelectPoster} />
          ))}
        </div>
      ))}
    </div>
  );
}

