'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3, Users, Church, Scroll, Sparkles, Calendar,
  FileText, Clock, Home, LogOut, ChevronLeft, ChevronRight,
  Crown, DollarSign, Menu, X
} from 'lucide-react';

interface SidebarLink { href: string; label: string; icon: React.ReactNode; badge?: number; }
interface DashboardSidebarProps { role: 'admin' | 'pandit'; userName: string; userPhoto?: string; }

export default function DashboardSidebar({ role, userName, userPhoto }: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const adminLinks: SidebarLink[] = [
    { href: '/admin/admin-dashboard', label: 'Dashboard', icon: <BarChart3 className="w-5 h-5" /> },
    { href: '/admin/users', label: 'All Users', icon: <Users className="w-5 h-5" /> },
    { href: '/admin/admin-mandirs', label: 'Mandirs', icon: <Church className="w-5 h-5" /> },
    { href: '/admin/admin-katha-vachaks', label: 'Katha Vachaks', icon: <Scroll className="w-5 h-5" /> },
    { href: '/admin/admin-pandits', label: 'Pandits', icon: <Sparkles className="w-5 h-5" /> },
    { href: '/admin/admin-bookings', label: 'Bookings', icon: <Calendar className="w-5 h-5" /> },
    { href: '/admin/admin-blogs', label: 'All Blogs', icon: <FileText className="w-5 h-5" /> },
    { href: '/admin/admin-blogs/pending', label: 'Pending Blogs', icon: <Clock className="w-5 h-5" /> },
    { href: '/admin/admin-samagri', label: 'Samagri', icon: <span className="text-base leading-none">🪔</span> },
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

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className={`p-5 border-b border-white/10 ${collapsed ? 'px-3' : ''}`}>
        <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0 overflow-hidden">
            {userPhoto ? (
              <img src={userPhoto} alt={userName} className="w-full h-full object-cover" />
            ) : role === 'admin' ? (
              <Crown className="w-5 h-5 text-orange-300" />
            ) : (
              <Sparkles className="w-5 h-5 text-orange-300" />
            )}
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="text-[10px] font-black text-white/50 uppercase tracking-widest">
                {role === 'admin' ? 'Admin Panel' : 'Pandit Portal'}
              </p>
              <p className="font-black text-white text-sm truncate">{userName}</p>
            </div>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {!collapsed && (
          <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] px-3 mb-2">Navigation</p>
        )}
        {links.map((link) => {
          const active = isActive(link.href);
          return (
            <Link key={link.href} href={link.href}
              onClick={() => setMobileOpen(false)}
              title={collapsed ? link.label : ''}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all group relative ${
                active
                  ? 'bg-white text-slate-900 shadow-lg shadow-black/20'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              } ${collapsed ? 'justify-center' : ''}`}>
              <span className={`flex-shrink-0 ${active ? 'text-orange-600' : ''}`}>{link.icon}</span>
              {!collapsed && (
                <span className={`text-sm font-bold ${active ? 'text-slate-900' : ''}`}>{link.label}</span>
              )}
              {active && !collapsed && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-orange-500" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className={`p-3 border-t border-white/10 space-y-1 ${collapsed ? 'px-2' : ''}`}>
        <Link href="/" onClick={() => setMobileOpen(false)}
          title={collapsed ? 'Home' : ''}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-2xl text-white/70 hover:bg-white/10 hover:text-white transition-all ${collapsed ? 'justify-center' : ''}`}>
          <Home className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="text-sm font-bold">Home</span>}
        </Link>
        <button onClick={handleLogout}
          title={collapsed ? 'Logout' : ''}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl bg-red-500/20 text-red-300 hover:bg-red-500 hover:text-white transition-all ${collapsed ? 'justify-center' : ''}`}>
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="text-sm font-bold">Logout</span>}
        </button>
        <button onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex w-full items-center justify-center py-2 text-white/30 hover:text-white transition-colors">
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle button */}
      <button onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 w-11 h-11 bg-slate-900 text-white rounded-2xl shadow-xl flex items-center justify-center border border-white/10">
        <Menu className="w-5 h-5" />
      </button>

      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex fixed left-0 top-0 h-screen flex-col bg-slate-900 border-r border-white/5 transition-all duration-300 z-40 ${collapsed ? 'w-20' : 'w-64'}`}>
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40" />
            <motion.aside
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed left-0 top-0 h-screen w-72 bg-slate-900 border-r border-white/5 z-50 flex flex-col">
              <button onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 bg-white/10 rounded-xl flex items-center justify-center text-white hover:bg-white/20 transition-all">
                <X className="w-4 h-4" />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
