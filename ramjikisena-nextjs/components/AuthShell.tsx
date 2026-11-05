import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Loader2, LucideIcon } from 'lucide-react';
import { InputHTMLAttributes, ReactNode } from 'react';

interface AuthShellProps {
  kicker: string;
  title: ReactNode;
  sub?: string;
  children: ReactNode;
  /** Extra content under the form card (switch links, partner banners) */
  below?: ReactNode;
  /** Wider card for long forms */
  wide?: boolean;
  sideImage?: string;
  sideQuote?: string;
  sideAuthor?: string;
}

// Split auth layout: Ayodhya darshan panel on the left (desktop), cream form card on the right
export default function AuthShell({
  kicker,
  title,
  sub,
  children,
  below,
  wide = false,
  sideImage = '/images/hero-mobile-ramji.webp',
  sideQuote = 'रामनाम मनुष्य को शांति, शक्ति और सही मार्ग दिखाता है',
  sideAuthor = 'संत तुलसीदास',
}: AuthShellProps) {
  return (
    <div className="min-h-screen bg-[#FFFCF7] lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      {/* Darshan panel */}
      <aside className="relative h-56 sm:h-72 lg:h-auto lg:min-h-screen overflow-hidden">
        <Image src={sideImage} alt="प्रभु श्री राम" fill priority sizes="(max-width:1024px) 100vw, 42vw" className="object-cover object-[center_18%] hero-kenburns" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FFFCF7] via-black/10 to-black/20 lg:bg-gradient-to-t lg:from-[#2A0C03]/90 lg:via-[#3B1205]/30 lg:to-transparent" />

        <Link href="/" className="absolute top-4 left-4 z-10 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur text-orange-700 text-xs font-bold shadow-sm hover:bg-white">
          <ArrowLeft className="w-3.5 h-3.5" /> मुख्य पृष्ठ
        </Link>

        <div className="hidden lg:block absolute bottom-0 inset-x-0 p-10 xl:p-14 text-white">
          <p className="font-display text-5xl xl:text-6xl text-amber-300 leading-tight drop-shadow">जय श्री राम</p>
          <p className="mt-4 text-xl xl:text-2xl font-serif leading-relaxed max-w-md">“{sideQuote}”</p>
          <p className="mt-2 text-sm text-amber-100/80">— {sideAuthor}</p>
        </div>
      </aside>

      {/* Form side */}
      <main className="relative flex items-start lg:items-center justify-center px-4 sm:px-6 pb-12 lg:py-12 -mt-16 lg:mt-0">
        <span className="hidden lg:block absolute right-6 top-10 text-[220px] leading-none font-serif text-orange-500/[0.05] select-none pointer-events-none">ॐ</span>
        <div className={`relative w-full ${wide ? 'max-w-2xl' : 'max-w-md'}`}>
          <Link href="/" className="hero-in flex items-center gap-2.5 mb-5 w-fit pl-1.5 pr-4 py-1.5 rounded-2xl bg-white/95 shadow-md lg:p-0 lg:bg-transparent lg:shadow-none">
            <span className="relative w-10 h-10 rounded-xl overflow-hidden border border-[#D4AF37]/60 shadow-md bg-white">
              <Image src="/images/ramjikisena_logo.webp" alt="" fill sizes="40px" className="object-cover" />
            </span>
            <span className="font-serif font-black leading-[1.05] text-orange-600 text-lg">Jai Shri<br />Ram Naam</span>
          </Link>

          <div className="hero-in d1 rounded-3xl bg-white border border-orange-100 shadow-xl shadow-orange-900/5 p-6 sm:p-8">
            <span className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] uppercase text-orange-600 mb-2">
              <span className="text-sm">🪷</span>{kicker}
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-black text-[#3D2A1E] leading-tight">{title}</h1>
            {sub && <p className="text-sm text-slate-600 mt-1.5">{sub}</p>}
            <span className="block h-1 w-14 rounded-full bg-gradient-to-r from-orange-500 to-amber-400 mt-3 mb-6" />
            {children}
          </div>

          {below && <div className="hero-in d2 mt-5 space-y-4">{below}</div>}
        </div>
      </main>
    </div>
  );
}

interface AuthFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: LucideIcon;
  /** Element shown at the right edge of the input, e.g. a show-password toggle */
  trailing?: ReactNode;
  hint?: string;
}

export function AuthField({ label, icon: Icon, trailing, hint, className = '', ...input }: AuthFieldProps) {
  return (
    <div>
      <label className="block text-xs font-bold text-slate-700 mb-1.5">{label}</label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-500 pointer-events-none" />}
        <input
          {...input}
          className={`w-full ${Icon ? 'pl-10' : 'pl-3.5'} ${trailing ? 'pr-11' : 'pr-3.5'} py-3 rounded-xl bg-orange-50/40 border border-orange-200 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition-colors ${className}`}
        />
        {trailing && <div className="absolute right-3 top-1/2 -translate-y-1/2">{trailing}</div>}
      </div>
      {hint && <p className="text-xs text-slate-500 mt-1.5">{hint}</p>}
    </div>
  );
}

export function AuthError({ children }: { children: ReactNode }) {
  return (
    <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-semibold flex items-center gap-2">
      <span>⚠️</span><span>{children}</span>
    </div>
  );
}

export function AuthSubmit({ loading, loadingText = 'कृपया प्रतीक्षा करें...', children, disabled }: {
  loading: boolean;
  loadingText?: string;
  children: ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={loading || disabled}
      className="btn-shine w-full mt-2 py-3.5 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-sm shadow-divine flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {loading ? <><Loader2 className="w-4 h-4 animate-spin" />{loadingText}</> : children}
    </button>
  );
}

/** Soft banner linking to another portal (pandit / astrologer / devotee) */
export function AuthSwitch({ icon, title, sub, href, cta }: { icon: ReactNode; title: string; sub: string; href: string; cta: string }) {
  return (
    <div className="p-4 rounded-2xl bg-gradient-to-r from-[#FFE9D2] to-[#FFF3E6] border border-orange-200 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <span className="w-10 h-10 rounded-xl bg-white border border-orange-200 flex items-center justify-center shrink-0 text-orange-600">{icon}</span>
        <div className="min-w-0">
          <p className="text-sm font-bold text-slate-900 truncate">{title}</p>
          <p className="text-xs text-slate-500 truncate">{sub}</p>
        </div>
      </div>
      <Link href={href} className="shrink-0 px-4 py-2 rounded-full bg-white hover:bg-orange-50 border border-orange-300 text-orange-700 text-xs font-bold">
        {cta}
      </Link>
    </div>
  );
}
