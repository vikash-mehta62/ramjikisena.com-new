'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import DashboardSidebar from '@/components/DashboardSidebar';
import { ShieldAlert, ArrowLeft, Shield } from 'lucide-react';

const ROUTE_PERMISSIONS: { prefix: string; key: string; label: string }[] = [
  { prefix: '/admin/admin-dashboard', key: 'dashboard', label: 'Dashboard' },
  { prefix: '/admin/admin-analytics', key: 'analytics', label: 'Visits & Analytics' },
  { prefix: '/admin/users', key: 'users', label: 'Users Management' },
  { prefix: '/admin/admin-staff', key: 'staff', label: 'Staff & Roles' },
  { prefix: '/admin/admin-mandirs', key: 'mandirs', label: 'Mandirs' },
  { prefix: '/admin/admin-katha-vachaks', key: 'kathaVachaks', label: 'Katha Vachaks' },
  { prefix: '/admin/admin-pandits', key: 'pandits', label: 'Pandits' },
  { prefix: '/admin/admin-astrology', key: 'astrology', label: 'Astrology & Tarot' },
  { prefix: '/admin/admin-bookings', key: 'bookings', label: 'Bookings' },
  { prefix: '/admin/admin-blogs', key: 'blogs', label: 'Blogs' },
  { prefix: '/admin/admin-samagri', key: 'samagri', label: 'Samagri' },
  { prefix: '/admin/admin-hero-slides', key: 'heroSlides', label: 'Hero Slides / बैनर' },
  { prefix: '/admin/admin-push-notifications', key: 'notifications', label: 'Push Notifications / पुश संदेश' },
  { prefix: '/admin/admin-services', key: 'services', label: 'Manage Services' },
  { prefix: '/admin/admin-inspirations', key: 'inspirations', label: 'Daily Inspirations' },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const userStr = localStorage.getItem('user');
      if (!userStr) {
        router.push('/login');
        return;
      }

      const userData = JSON.parse(userStr);
      if (userData.role !== 'admin' && userData.role !== 'staff' && userData.role !== 'subadmin') {
        router.push('/dashboard');
        return;
      }

      setUser(userData);
      setLoading(false);
    } catch (error) {
      console.error('Auth check error:', error);
      router.push('/login');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Admin Panel...</p>
        </div>
      </div>
    );
  }

  // Check staff route permission
  const isStaff = user?.role === 'staff' || user?.role === 'subadmin';
  const matchedRoute = ROUTE_PERMISSIONS.find(r => pathname.startsWith(r.prefix));
  const userPermissions = Array.isArray(user?.permissions) ? user.permissions : [];
  const isAccessDenied = isStaff && matchedRoute && !userPermissions.includes(matchedRoute.key);

  return (
    <div className="min-h-screen bg-[#FFFAF3]">
      <DashboardSidebar
        role={isStaff ? 'staff' : 'admin'}
        userName={user?.name || 'Admin'}
        userPhoto={user?.profileImage}
        permissions={userPermissions}
      />
      <div className="lg:ml-64 transition-all duration-300">
        <div className="p-4 md:p-8 pt-16 lg:pt-8">
          {isAccessDenied ? (
            <div className="max-w-xl mx-auto my-12 bg-white rounded-3xl p-8 border border-red-200/80 shadow-xl text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center mx-auto text-red-600 shadow-inner">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-black text-slate-900">
                पहुंच प्रतिबंधित है (Access Restricted)
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                आपके स्टाफ खाते के पास <span className="font-bold text-red-600">"{matchedRoute.label}"</span> अनुभाग को देखने की अनुमति नहीं है।
              </p>
              <p className="text-xs text-slate-400">
                यदि आपको इस मॉड्यूल की आवश्यकता है, तो कृपया मुख्य एडमिन से संपर्क करें ताकि वे आपको इसकी परमिशन दे सकें।
              </p>
              <div className="pt-4 flex justify-center gap-3">
                <Link
                  href="/admin/admin-dashboard"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-sm font-bold shadow-lg transition-all"
                >
                  <ArrowLeft className="w-4 h-4" /> मुख्य डैशबोर्ड पर जाएं
                </Link>
              </div>
            </div>
          ) : (
            children
          )}
        </div>
      </div>
    </div>
  );
}
