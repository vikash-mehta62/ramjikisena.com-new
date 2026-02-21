'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

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
      if (userData.role !== 'admin') {
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

  const navItems = [
    { href: '/admin/admin-dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/admin/admin-blogs/pending', label: 'Pending Blogs', icon: '📝' },
    { href: '/admin/admin-blogs', label: 'All Blogs', icon: '📚' },
    { href: '/admin/users', label: 'Users', icon: '👥' },
    { href: '/admin/admin-mandirs', label: 'Mandirs', icon: '🛕' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-72 bg-gradient-to-b from-orange-600 via-red-600 to-red-700 text-white min-h-screen fixed left-0 top-0 shadow-2xl">
          {/* Logo Section */}
          <div className="p-6 border-b border-orange-500/30">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                <span className="text-3xl">👑</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold">Admin Panel</h2>
                <p className="text-orange-100 text-xs">Ramji Ki Sena</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="mt-4 px-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-4 py-3 mb-2 rounded-xl transition-all ${
                  pathname === item.href 
                    ? 'bg-white text-orange-600 shadow-lg font-semibold' 
                    : 'hover:bg-orange-700/50 text-white'
                }`}
              >
                <span className="mr-3 text-2xl">{item.icon}</span>
                <span className="text-sm">{item.label}</span>
              </Link>
            ))}

            <div className="border-t border-orange-500/30 my-4"></div>

            <Link
              href="/dashboard"
              className="flex items-center px-4 py-3 mb-2 rounded-xl hover:bg-orange-700/50 transition-all text-white"
            >
              <span className="mr-3 text-2xl">🚩</span>
              <span className="text-sm">User Dashboard</span>
            </Link>

            <button
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                router.push('/login');
              }}
              className="flex items-center px-4 py-3 mb-2 rounded-xl hover:bg-red-700 transition-all w-full text-left text-white"
            >
              <span className="mr-3 text-2xl">🚪</span>
              <span className="text-sm">Logout</span>
            </button>
          </nav>

          {/* Admin Info */}
          {user && (
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-red-900 to-transparent">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <p className="text-xs text-orange-200 mb-1">Logged in as</p>
                <p className="font-bold text-lg">{user.name}</p>
                <p className="text-sm text-orange-200">@{user.username}</p>
                <div className="mt-2 pt-2 border-t border-white/20">
                  <span className="inline-block px-3 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full">
                    👑 ADMIN
                  </span>
                </div>
              </div>
            </div>
          )}
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-72 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
