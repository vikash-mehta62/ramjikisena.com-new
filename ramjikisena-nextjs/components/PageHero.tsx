import Image from 'next/image';
import { ReactNode } from 'react';

interface PageHeroProps {
  kicker: string;
  title: ReactNode;
  sub?: string;
  /** Search bar, chips or buttons shown under the title */
  children?: ReactNode;
  align?: 'left' | 'center';
}

// Shared cream page header with a faint Ayodhya temple on the right, matching the homepage
export default function PageHero({ kicker, title, sub, children, align = 'left' }: PageHeroProps) {
  const centered = align === 'center';
  return (
    <header className="relative overflow-hidden bg-gradient-to-b from-[#FFF3E2] to-[#FFFCF7] border-b border-orange-100 pt-24 sm:pt-28 pb-8 sm:pb-10">
      <div className="absolute inset-y-0 right-0 w-full md:w-[55%] pointer-events-none overflow-hidden" aria-hidden>
        <Image
          src="/images/hero-clean-bg.webp"
          alt=""
          fill
          priority
          sizes="55vw"
          className="object-cover object-[0%_55%] scale-[1.9] origin-left opacity-25 md:opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#FFF3E2] via-[#FFF3E2]/70 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#FFFCF7] to-transparent" />
      </div>

      <div className={`container mx-auto px-4 sm:px-6 lg:px-10 max-w-7xl relative z-10 ${centered ? 'text-center' : ''}`}>
        <span className="hero-in inline-flex items-center gap-2 text-[11px] sm:text-xs font-bold tracking-[0.2em] uppercase text-orange-600 mb-2">
          <span className="text-sm">🪷</span>
          {kicker}
        </span>
        <h1 className="hero-in d1 text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-[#3D2A1E] leading-tight">
          {title}
        </h1>
        {sub && (
          <p className={`hero-in d2 text-sm sm:text-base text-slate-600 mt-2 max-w-xl ${centered ? 'mx-auto' : ''}`}>{sub}</p>
        )}
        <span className={`hero-in d2 block h-1 w-16 rounded-full bg-gradient-to-r from-orange-500 to-amber-400 mt-4 ${centered ? 'mx-auto' : ''}`} />
        {children && <div className="hero-in d3 mt-6">{children}</div>}
      </div>
    </header>
  );
}
