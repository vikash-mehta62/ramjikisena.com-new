'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, User, History, Users, BookOpen,
  PenSquare, Calendar, ShoppingBag, Home, LogOut,
  ChevronLeft, ChevronRight, Menu, X, MessageSquare
} from 'lucide-react';

interface SidebarLink {
  href: string;
  label: string;
  icon: React.ReactNode;
}

interface UserSidebarProps {
  userName: string;
  userPhoto?: string;
  rank?: number;
}

export default function UserSidebar({ userName, userPhoto, rank }: UserSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const links: SidebarLink[] = [
    { href: '/dashboard',    label: 'Dashboard',       icon: <LayoutDashboard className="w-5 h-5" /> },
    { href: '/profile',      label: 'My Profile',      icon: <User className="w-5 h-5" /> },
    { href: '/history',      label: 'Lekhan History',  icon: <History className="w-5 h-5" /> },
    { href: '/devotees',     label: 'All Devotees',    icon: <Users className="w-5 h-5" /> },
    { href: '/my-bookings',  label: 'My Bookings',     icon: <Calendar className="w-5 h-5" /> },
    { href: '/blogs',        label: 'Blogs',           icon: <BookOpen className="w-5 h-5" /> },
    { href: '/my-blogs',     label: 'My Blogs',        icon: <PenSquare className="w-5 h-5" /> },
    { href: '/my-orders',    label: 'My Orders',       icon: <ShoppingBag className="w-5 h-5" /> },
    { href: '/community',    label: 'Community',       icon: <MessageSquare className="w-5 h-5" /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const isActive = (href: string) => pathname === href;

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className={`p-5 border-b border-white/10 ${collapsed ? 'px-3' : ''}`}>
        <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-10 h-10 rounded-2xl bg-orange-500/20 border border-orange-400/30 flex items-center justify-center flex-shrink-0 overflow-hidden">
            {userPhoto ? (
              <img src={userPhoto} alt={userName} className="w-full h-full object-cover rounded-2xl" />
            ) : (
              <span className="text-lg font-black text-orange-300">
                {userName?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            )}
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">
                {rank ? `Rank #${rank}` : 'Devotee'}
              </p>
              <p className="font-black text-white text-sm truncate">{userName}</p>
            </div>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {!collapsed && (
          <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] px-3 mb-2">Menu</p>
        )}
        {links.map((link) => {
          const active = isActive(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              title={collapsed ? link.label : ''}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all group relative ${
                active
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                  : 'text-white/60 hover:bg-white/10 hover:text-white'
              } ${collapsed ? 'justify-center' : ''}`}
            >
              <span className="flex-shrink-0">{link.icon}</span>
              {!collapsed && (
                <span className="text-sm font-bold">{link.label}</span>
              )}
              {active && !collapsed && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/70" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className={`p-3 border-t border-white/10 space-y-1 ${collapsed ? 'px-2' : ''}`}>
        <Link
          href="/"
          onClick={() => setMobileOpen(false)}
          title={collapsed ? 'Home' : ''}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-2xl text-white/60 hover:bg-white/10 hover:text-white transition-all ${collapsed ? 'justify-center' : ''}`}
        >
          <Home className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="text-sm font-bold">Home</span>}
        </Link>
        <button
          onClick={handleLogout}
          title={collapsed ? 'Logout' : ''}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl bg-red-500/20 text-red-300 hover:bg-red-500 hover:text-white transition-all ${collapsed ? 'justify-center' : ''}`}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="text-sm font-bold">Logout</span>}
        </button>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex w-full items-center justify-center py-2 text-white/30 hover:text-white transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 w-11 h-11 bg-slate-900 text-white rounded-2xl shadow-xl flex items-center justify-center border border-white/10"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex fixed left-0 top-0 h-screen flex-col bg-slate-900 border-r border-white/5 transition-all duration-300 z-40 ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.aside
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed left-0 top-0 h-screen w-72 bg-slate-900 border-r border-white/5 z-50 flex flex-col"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 bg-white/10 rounded-xl flex items-center justify-center text-white hover:bg-white/20 transition-all"
              >
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
