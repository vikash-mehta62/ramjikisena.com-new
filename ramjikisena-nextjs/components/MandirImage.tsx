'use client';

import React, { useState } from 'react';

interface MandirImageProps {
  src?: string;
  alt: string;
  className?: string;
  templeName?: string;
  cityName?: string;
}

export default function MandirImage({
  src,
  alt,
  className = '',
  templeName,
  cityName,
}: MandirImageProps) {
  const [hasError, setHasError] = useState(false);

  // If no source or error occurred, show the sacred devotional placeholder
  if (!src || hasError) {
    return (
      <div
        className={`w-full h-full relative overflow-hidden flex flex-col items-center justify-center select-none text-center p-4 bg-gradient-to-br from-amber-600 via-orange-700 to-amber-950 text-white ${className}`}
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 30%, rgba(254, 243, 199, 0.25) 0%, transparent 60%),
            linear-gradient(135deg, #b45309 0%, #9a3412 50%, #451a03 100%)
          `,
        }}
      >
        {/* Subtle decorative background pattern */}
        <div className="absolute inset-0 opacity-10 flex items-center justify-center pointer-events-none">
          <svg viewBox="0 0 100 100" className="w-full h-full fill-white">
            <circle cx="50" cy="50" r="40" stroke="white" strokeWidth="1" fill="none" />
            <polygon points="50,15 85,75 15,75" stroke="white" strokeWidth="1" fill="none" />
            <polygon points="50,85 85,25 15,25" stroke="white" strokeWidth="1" fill="none" />
          </svg>
        </div>

        {/* Sacred Mandir Icon */}
        <div className="relative z-10 w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center text-3xl md:text-4xl shadow-inner mb-2">
          🛕
        </div>

        {/* City and Sacred Badge */}
        <div className="relative z-10">
          <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-400/25 border border-amber-300/40 text-amber-100 text-[9px] md:text-[11px] font-bold tracking-widest uppercase">
            {cityName || 'पवित्र तीर्थ स्थल'}
          </span>
          {templeName && (
            <p className="text-white/90 text-xs md:text-sm font-black line-clamp-1 mt-1 drop-shadow-sm px-2">
              {templeName}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setHasError(true)}
      className={className}
      loading="lazy"
    />
  );
}
