'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authApi, User } from '@/lib/auth';
import {
  History, Users, BookOpen, PenSquare, Calendar,
  ShoppingBag, MessageSquare, User as UserIcon,
  TrendingUp, Award, Flame, ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';

interface Booking {
  _id: string;
  poojaType: string;
  poojaDate: string;
  status: string;
  pandit: { name: string };
}

const quickLinks = [
  { href: '/history',        label: 'Lekhan History',  emoji: '📊', icon: <History className="w-5 h-5" />,      color: 'from-purple-500 to-purple-600',  bg: 'bg-purple-50',  border: 'border-purple-200' },
  { href: '/devotees',       label: 'All Devotees',    emoji: '👥', icon: <Users className="w-5 h-5" />,         color: 'from-orange-500 to-orange-600',  bg: 'bg-orange-50',  border: 'border-orange-200' },
  { href: '/my-bookings',    label: 'My Bookings',     emoji: '📅', icon: <Calendar className="w-5 h-5" />,      color: 'from-blue-500 to-blue-600',      bg: 'bg-blue-50',    border: 'border-blue-200' },
  { href: '/blogs',          label: 'Blogs',           emoji: '📖', icon: <BookOpen className="w-5 h-5" />,      color: 'from-green-500 to-green-600',    bg: 'bg-green-50',   border: 'border-green-200' },
  { href: '/my-blogs',       label: 'My Blogs',        emoji: '✍️', icon: <PenSquare className="w-5 h-5" />,     color: 'from-teal-500 to-teal-600',      bg: 'bg-teal-50',    border: 'border-teal-200' },
  { href: '/my-orders',      label: 'My Orders',       emoji: '📦', icon: <ShoppingBag className="w-5 h-5" />,   color: 'from-yellow-500 to-yellow-600',  bg: 'bg-yellow-50',  border: 'border-yellow-200' },
  { href: '/community',      label: 'Community',       emoji: '🤝', icon: <MessageSquare className="w-5 h-5" />, color: 'from-pink-500 to-pink-600',      bg: 'bg-pink-50',    border: 'border-pink-200' },
  { href: '/profile',        label: 'My Profile',      emoji: '👤', icon: <UserIcon className="w-5 h-5" />,      color: 'from-slate-500 to-slate-600',    bg: 'bg-slate-50',   border: 'border-slate-200' },
];

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authApi.getCurrentUser().then(userData => {
      if (!userData) { router.push('/login'); return; }
      setUser(userData);
      setLoading(false);
      fetchRecentBookings();
    }).catch(() => router.push('/login'));
  }, []);

  const fetchRecentBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings/my-bookings`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setRecentBookings(data.bookings.slice(0, 3));
    } catch {}
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':   return 'bg-yellow-100 text-yellow-700';
      case 'confirmed': return 'bg-green-100 text-green-700';
      case 'completed': return 'bg-blue-100 text-blue-700';
      case 'rejected':  return 'bg-red-100 text-red-700';
      default:          return 'bg-gray-100 text-gray-700';
    }
  };

  const todayCount = () => {
    if (!user?.dailyCounts?.length) return 0;
    const today = new Date().toDateString();
    const last = user.dailyCounts[user.dailyCounts.length - 1];
    return new Date(last.date).toDateString() === today ? last.count : 0;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-orange-700 font-bold">जय श्री राम...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">

      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-orange-500 to-red-600 rounded-3xl p-6 text-white shadow-xl"
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-orange-100 text-sm font-semibold mb-1">🙏 जय श्री राम</p>
            <h1 className="text-2xl md:text-3xl font-black">
              Welcome, {user?.name}!
            </h1>
            <p className="text-orange-100 text-sm mt-1">
              {todayCount() > 0
                ? `आज ${todayCount()} राम नाम लिखे 🔥 — बढ़िया!`
                : 'आपकी आध्यात्मिक यात्रा जारी है'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center text-2xl font-black">
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Rank',        value: `#${user?.rank || '-'}`,          icon: <Award className="w-5 h-5" />,     color: 'text-orange-600', bg: 'bg-orange-50',  border: 'border-orange-200' },
          { label: 'Total Jaap',  value: user?.totalCount || 0,             icon: <TrendingUp className="w-5 h-5" />, color: 'text-red-600',    bg: 'bg-red-50',     border: 'border-red-200' },
          { label: 'Total Mala',  value: Number(user?.mala || 0).toFixed(1), icon: <span className="text-lg">📿</span>, color: 'text-purple-600', bg: 'bg-purple-50',  border: 'border-purple-200' },
          { label: "Today's Jaap", value: todayCount(),                     icon: <Flame className="w-5 h-5" />,     color: 'text-blue-600',   bg: 'bg-blue-50',    border: 'border-blue-200' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`${stat.bg} border-2 ${stat.border} rounded-2xl p-4 text-center`}
          >
            <div className={`flex justify-center mb-2 ${stat.color}`}>{stat.icon}</div>
            <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
            <p className="text-xs font-bold text-slate-500 mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-3">Quick Access</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickLinks.map(({ href, label, emoji, bg, border }, i) => (
            <motion.div
              key={href}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 }}
            >
              <Link
                href={href}
                className={`${bg} border-2 ${border} rounded-2xl p-4 flex flex-col items-center gap-2 hover:shadow-md transition-all group text-center`}
              >
                <span className="text-2xl">{emoji}</span>
                <span className="text-xs font-bold text-slate-700 group-hover:text-slate-900">{label}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Bookings */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest">Recent Bookings</h2>
          <Link href="/my-bookings" className="text-xs font-bold text-orange-500 hover:text-orange-600 flex items-center gap-1">
            View All <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        {recentBookings.length === 0 ? (
          <div className="bg-white border-2 border-orange-100 rounded-2xl p-8 text-center">
            <div className="text-4xl mb-3">📅</div>
            <p className="text-slate-500 font-semibold mb-1">No bookings yet</p>
            <p className="text-slate-400 text-sm mb-4">Book a pandit for your next pooja</p>
            <Link
              href="/pandits"
              className="inline-block px-6 py-2.5 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold rounded-xl text-sm hover:shadow-lg transition-all"
            >
              Book a Pandit
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentBookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white border-2 border-orange-100 rounded-2xl p-4 flex items-center justify-between hover:border-orange-300 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-xl">🕉️</div>
                  <div>
                    <p className="font-bold text-slate-800">{booking.poojaType}</p>
                    <p className="text-sm text-slate-500">
                      {booking.pandit?.name} · {new Date(booking.poojaDate).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${getStatusColor(booking.status)}`}>
                  {booking.status}
                </span>
              </div>
            ))}
            <Link
              href="/my-bookings"
              className="block w-full text-center py-3 bg-orange-50 border-2 border-orange-200 rounded-2xl text-orange-600 font-bold text-sm hover:bg-orange-100 transition-all"
            >
              View All Bookings →
            </Link>
          </div>
        )}
      </div>

      {/* Naam Jaap CTA */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-3xl p-6 text-white flex items-center justify-between flex-wrap gap-4">
        <div>
          <p className="text-slate-400 text-sm mb-1">राम नाम लेखन</p>
          <h3 className="text-xl font-black">Start Today's Jaap</h3>
          <p className="text-slate-400 text-sm mt-1">Homepage par jaake naam jaap karein</p>
        </div>
        <Link
          href="/"
          className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-2xl transition-all shadow-lg shadow-orange-500/30 text-sm"
        >
          🙏 Go to Jaap
        </Link>
      </div>

    </div>
  );
}
