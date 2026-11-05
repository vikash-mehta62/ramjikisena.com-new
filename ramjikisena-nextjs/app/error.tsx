'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { RotateCcw, Home } from 'lucide-react';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#FFF3E2] to-[#FFFCF7] flex items-center justify-center px-4 py-16">
      <div className="max-w-md text-center">
        <p className="text-6xl">🙏</p>
        <h1 className="mt-4 text-2xl sm:text-3xl font-serif font-black text-[#3D2A1E]">कुछ गड़बड़ हो गई</h1>
        <p className="mt-3 text-slate-600">
          क्षमा करें, यह पृष्ठ अभी लोड नहीं हो पाया। कृपया दोबारा प्रयास करें।
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="btn-shine inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-sm shadow-divine cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" /> दोबारा प्रयास करें
          </button>
          <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-orange-700 border border-orange-300 font-bold text-sm hover:bg-orange-50">
            <Home className="w-4 h-4" /> मुख्य पृष्ठ
          </Link>
        </div>
      </div>
    </main>
  );
}
