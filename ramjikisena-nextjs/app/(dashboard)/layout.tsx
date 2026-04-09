'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import UserSidebar from '@/components/UserSidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (!token) {
      router.push('/login');
      return;
    }

    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        if (userData.role === 'admin') {
          router.push('/admin/admin-dashboard');
          return;
        }
        setUser(userData);
      } catch (e) {
        router.push('/login');
        return;
      }
    }

    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#fdf6ee]">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-orange-700 font-bold">जय श्री राम...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdf6ee]">
      <UserSidebar
        userName={user?.name || 'Devotee'}
        userPhoto={user?.photo}
        rank={user?.rank}
      />
      <div className="lg:ml-64 transition-all duration-300">
        <div className="p-4 md:p-8 pt-16 lg:pt-8">
          {children}
        </div>
      </div>
    </div>
  );
}
