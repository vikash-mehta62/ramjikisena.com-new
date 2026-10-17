'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Home, Flame, BookOpen, Users, User } from 'lucide-react';
import { requestGlobalNavigation } from '@/lib/jaapContext';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  const handleNav = (href: string) => {
    requestGlobalNavigation(href, (target) => {
      router.push(target);
    });
  };

  const navItems = [
    { label: 'Home', href: '/', icon: Home, activeCheck: (p: string) => p === '/' },
    { label: 'Jaap', href: '/#jaap', icon: Flame, activeCheck: () => false },
    { label: 'Blogs', href: '/blogs', icon: BookOpen, activeCheck: (p: string) => p.startsWith('/blogs') || p === '/glory' },
    { label: 'Community', href: '/community', icon: Users, activeCheck: (p: string) => p === '/community' || p === '/forum' },
    { label: 'Profile', href: '/dashboard', icon: User, activeCheck: (p: string) => p.startsWith('/dashboard') || p.startsWith('/admin') || p.startsWith('/pandit') },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-orange-100 shadow-[0_-4px_20px_rgba(234,88,12,0.08)] px-2 py-1.5 flex items-center justify-around safe-area-inset-bottom">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = item.activeCheck(pathname);
        return (
          <button
            key={item.label}
            onClick={() => handleNav(item.href)}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all ${
              isActive
                ? 'text-orange-600 font-black'
                : 'text-slate-500 hover:text-orange-500 font-medium'
            }`}
          >
            <div
              className={`w-9 h-7 rounded-full flex items-center justify-center transition-all ${
                isActive ? 'bg-orange-100/80 text-orange-600' : ''
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
