'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function PendingBlogsRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/admin-blogs?tab=pending');
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8">
      <Loader2 className="w-8 h-8 text-orange-500 animate-spin mb-3" />
      <p className="text-sm font-bold text-slate-700">ब्लॉग प्रबंधन पोर्टल पर पुनः निर्देशित किया जा रहा है...</p>
      <p className="text-xs text-slate-400 mt-1">Redirecting to unified blogs management...</p>
    </div>
  );
}
