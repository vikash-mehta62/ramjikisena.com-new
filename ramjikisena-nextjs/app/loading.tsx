// Shown instantly while a page is being fetched, so a click never feels stuck
export default function Loading() {
  return (
    <div className="fixed inset-0 z-[90] flex flex-col items-center justify-center bg-[#FFFCF7]/85 backdrop-blur-sm" role="status" aria-live="polite">
      <div className="relative w-20 h-20">
        <span className="absolute inset-0 rounded-full border-4 border-orange-100" />
        <span className="absolute inset-0 rounded-full border-4 border-transparent border-t-orange-500 border-r-amber-400 animate-spin" />
        <span className="absolute inset-0 flex items-center justify-center text-3xl font-serif text-orange-600">ॐ</span>
      </div>
      <p className="mt-4 font-display text-2xl text-orange-600">जय श्री राम</p>
      <span className="sr-only">पृष्ठ लोड हो रहा है</span>
    </div>
  );
}
