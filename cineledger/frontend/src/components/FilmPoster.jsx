import React, { useState } from 'react';
import { Film } from 'lucide-react';
import { resolvePosterAsset } from '../data/posterManifest';

export default function FilmPoster({
  posterUrl,
  title = 'Cinema Feature',
  genre = 'Theatrical Release',
  className = '',
  height = 'h-48',
}) {
  const [hasError, setHasError] = useState(false);

  // Resolve locally curated genuine poster PNG if posterUrl is external or matched by title
  const resolvedSrc = resolvePosterAsset(title, posterUrl);

  return (
    <div className={`relative overflow-hidden rounded-xl bg-[#FBF8F2] border border-[rgba(129,115,102,0.22)] shadow-sm group flex-shrink-0 ${height} ${className}`}>
      {!hasError && (resolvedSrc || posterUrl) ? (
        <img
          src={hasError ? resolvedSrc : (resolvedSrc || posterUrl)}
          alt={title}
          onError={() => setHasError(true)}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full flex flex-col justify-between p-3.5 bg-gradient-to-br from-[#EDE3D2] via-[#FBF8F2] to-[#F4EDE1] text-[#29211D]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] tracking-widest text-[#C18C55] uppercase font-mono font-bold">CINEMA</span>
            <Film size={14} className="text-[#C18C55]" />
          </div>
          <div className="my-auto text-center py-2">
            <p className="text-xs font-serif font-bold line-clamp-2 text-[#29211D]">{title}</p>
            <p className="text-[10px] text-[#817366] mt-1 line-clamp-1">{genre}</p>
          </div>
          <div className="border-t border-[rgba(129,115,102,0.18)] pt-1 text-center">
            <span className="text-[9px] text-[#C18C55] font-mono">DCI 4K MASTER</span>
          </div>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-[#29211D]/45 via-transparent to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}
