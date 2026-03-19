'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { BarChart3, Users, Church, Scroll, Sparkles, Calendar, FileText, Clock, Home, LogOut, ChevronLeft, ChevronRight, Crown, DollarSign } from 'lucide-react';

interface SidebarLink {
  href: string;
  label: string;
  icon: React.ReactNode;
}

interface DashboardSidebarProps {
  role: 'admin' | 'pandit';
  userName: string;
  userPhoto?: string;
}

export default function DashboardSidebar({ role, userName, userPhoto }: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const adminLinks: SidebarLink[] = [
    { href: '/admin/admin-dashboard', label: 'Dashboard', icon: <BarChart3 className="w-5 h-5" /> },
    { href: '/admin/users', label: 'All Users', icon: <Users className="w-5 h-5" /> },
    { href: '/admin/admin-mandirs', label: 'Mandirs', icon: <Church className="w-5 h-5" /> },
    { href: '/admin/admin-katha-vachaks', label: 'Katha Vachaks', icon: <Scroll className="w-5 h-5" /> },
    { href: '/admin/admin-pandits', label: 'Pandits', icon: <Sparkles className="w-5 h-5" /> },
    { href: '/admin/admin-bookings', label: 'Bookings', icon: <Calendar className="w-5 h-5" /> },
    { href: '/admin/admin-blogs', label: 'All Blogs', icon: <FileText className="w-5 h-5" /> },
    { href: '/admin/admin-blogs/pending', label: 'Pending Blogs', icon: <Clock className="w-5 h-5" /> },
    { href: '/admin/admin-samagri', label: 'Samagri', icon: <span className="text-base">🪔</span> },
  ];

  const panditLinks: SidebarLink[] = [
    { href: '/pandit/dashboard', label: 'Dashboard', icon: <BarChart3 className="w-5 h-5" /> },
    { href: '/pandit/bookings', label: 'Bookings', icon: <Calendar className="w-5 h-5" /> },
    { href: '/pandit/profile', label: 'My Profile', icon: <Users className="w-5 h-5" /> },
    { href: '/pandit/earnings', label: 'Earnings', icon: <DollarSign className="w-5 h-5" /> },
  ];

  const links = role === 'admin' ? adminLinks : panditLinks;

  const handleLogout = () => {
    if (role === 'admin') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.push('/login');
    } else {
      localStorage.removeItem('panditToken');
      localStorage.removeItem('pandit');
      router.push('/pandit/login');
    }
  };

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="lg:hidden fixed top-24 left-4 z-50 w-12 h-12 bg-orange-500 text-white rounded-xl shadow-lg flex items-center justify-center"
      >
        {collapsed ? '→' : '←'}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-orange-600 to-red-700 text-white transition-all duration-300 z-40 ${
          collapsed ? '-translate-x-full lg:translate-x-0 lg:w-20' : 'translate-x-0 w-72'
        }`}
      >
        <div className="flex flex-col h-full">
          
          {/* Header */}
          <div className="p-6 border-b border-white/20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                {userPhoto ? (
                  <img src={userPhoto} alt={userName} className="w-full h-full rounded-full object-cover" />
                ) : (
                  role === 'admin' ? <Crown className="w-6 h-6 text-orange-600" /> : <Sparkles className="w-6 h-6 text-orange-600" />
                )}
              </div>
              {!collapsed && (
                <div className="overflow-hidden">
                  <p className="font-bold text-sm text-orange-100">
                    {role === 'admin' ? 'Admin' : 'Pandit Ji'}
                  </p>
                  <p className="font-black text-white truncate">{userName}</p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto py-6 px-3">
            <div className="space-y-2">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all group ${
                    isActive(link.href)
                      ? 'bg-white text-orange-600 shadow-lg'
                      : 'text-white hover:bg-white/10'
                  }`}
                  title={collapsed ? link.label : ''}
                >
                  <span className="flex-shrink-0">{link.icon}</span>
                  {!collapsed && (
                    <span className="font-bold">{link.label}</span>
                  )}
                </Link>
              ))}
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-white/20 space-y-2">
            <Link
              href="/"
              className="flex items-center gap-4 px-4 py-3 rounded-xl text-white hover:bg-white/10 transition-all"
              title={collapsed ? 'Home' : ''}
            >
              <Home className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="font-bold">Home</span>}
            </Link>
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-4 px-4 py-3 rounded-xl bg-red-500 hover:bg-red-600 transition-all"
              title={collapsed ? 'Logout' : ''}
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="font-bold">Logout</span>}
            </button>

            {/* Collapse Toggle (Desktop) */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex w-full items-center justify-center py-2 text-white/60 hover:text-white transition-colors"
            >
              {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {!collapsed && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setCollapsed(true)}
        />
      )}
    </>
  );
}
