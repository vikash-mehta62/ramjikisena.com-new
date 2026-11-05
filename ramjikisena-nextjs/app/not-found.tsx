import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Home } from 'lucide-react';

export const metadata = {
  title: 'पृष्ठ नहीं मिला',
};

export default function NotFound() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#FFF3E2] to-[#FFFCF7] flex items-center justify-center px-4 py-16">
      <div className="absolute inset-y-0 right-0 w-full md:w-1/2 pointer-events-none" aria-hidden>
        <Image src="/images/hero-clean-bg.webp" alt="" fill sizes="50vw" className="object-cover object-[0%_55%] opacity-20 md:opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#FFF3E2] via-[#FFF3E2]/70 to-transparent" />
      </div>

      <div className="relative z-10 max-w-xl text-center">
        <p className="hero-in font-display text-[120px] sm:text-[160px] leading-none text-saffron-foil hero-title">४०४</p>
        <h1 className="hero-in d1 mt-2 text-2xl sm:text-3xl font-serif font-black text-[#3D2A1E]">यह पृष्ठ नहीं मिला</h1>
        <p className="hero-in d2 mt-3 text-slate-600">
          जिस पृष्ठ को आप ढूंढ रहे हैं वह हट गया है या उसका पता बदल गया है। चिंता न करें — राम नाम का मार्ग हमेशा खुला है।
        </p>
        <p className="hero-in d2 mt-4 font-serif text-orange-700">“राम नाम मनि दीप धरु जीह देहरीं द्वार”</p>
        <div className="hero-in d3 mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/" className="btn-shine inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-sm shadow-divine">
            <Home className="w-4 h-4" /> मुख्य पृष्ठ
          </Link>
          <Link href="/#jaap" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-orange-700 border border-orange-300 font-bold text-sm hover:bg-orange-50">
            राम नाम जप करें <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}
