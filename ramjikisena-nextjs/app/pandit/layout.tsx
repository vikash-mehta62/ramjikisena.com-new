'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import DashboardSidebar from '@/components/DashboardSidebar';

export default function PanditLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [panditInfo, setPanditInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Skip auth check for login/register pages
    if (pathname.includes('/login') || pathname.includes('/register')) {
      setLoading(false);
      return;
    }

    const token = localStorage.getItem('panditToken');
    const pandit = localStorage.getItem('pandit');

    if (!token || !pandit) {
      router.push('/pandit/login');
      return;
    }

    try {
      setPanditInfo(JSON.parse(pandit));
    } catch (e) {
      router.push('/pandit/login');
      return;
    }

    setLoading(false);
  }, [pathname]);

  // Show loading for protected routes
  if (loading && !pathname.includes('/login') && !pathname.includes('/register')) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">🕉️</div>
          <p className="text-orange-900 font-bold">Loading...</p>
        </div>
      </div>
    );
  }

  // No sidebar for login/register pages
  if (pathname.includes('/login') || pathname.includes('/register')) {
    return <>{children}</>;
  }

  // Dashboard layout with sidebar
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
      <DashboardSidebar
        role="pandit"
        userName={panditInfo?.name || 'Pandit Ji'}
        userPhoto={panditInfo?.photo}
      />
      
      {/* Main Content */}
      <div className="lg:ml-72 transition-all duration-300">
        <div className="p-4 md:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
