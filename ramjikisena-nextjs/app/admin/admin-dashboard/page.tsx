'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Users, BookOpen, Clock, CheckCircle, Hand,
  UserPlus, FileText, BarChart3, Crown, ArrowRight, TrendingUp
} from 'lucide-react';
import api from '@/lib/api';

interface Stats {
  totalUsers: number;
  totalBlogs: number;
  pendingBlogs: number;
  approvedBlogs: number;
  totalRamNaam: number;
  recentUsers: number;
  recentBlogs: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0, totalBlogs: 0, pendingBlogs: 0,
    approvedBlogs: 0, totalRamNaam: 0, recentUsers: 0, recentBlogs: 0,
  });
  const [loading, setLoading] = useState(true);
  const [adminName, setAdminName] = useState('Admin');

  useEffect(() => {
    const u = localStorage.getItem('user');
    if (u) setAdminName(JSON.parse(u).name || 'Admin');
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('/api/admin/dashboard');
      const data = await res.json();
      if (data.success) setStats(data.stats);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const statCards = [
    { title: 'Total Users', value: stats.totalUsers, Icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
    { title: 'Total Blogs', value: stats.totalBlogs, Icon: BookOpen, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
    { title: 'Pending Blogs', value: stats.pendingBlogs, Icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-100' },
    { title: 'Approved Blogs', value: stats.approvedBlogs, Icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100' },
    { title: 'Total Ram Naam', value: stats.totalRamNaam.toLocaleString(), Icon: Hand, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100' },
    { title: 'New Users (7d)', value: stats.recentUsers, Icon: UserPlus, color: 'text-teal-600', bg: 'bg-teal-50', border: 'border-teal-100' },
    { title: 'New Blogs (7d)', value: stats.recentBlogs, Icon: FileText, color: 'text-pink-600', bg: 'bg-pink-50', border: 'border-pink-100' },
    { title: 'Avg Naam/User', value: stats.totalUsers > 0 ? Math.round(stats.totalRamNaam / stats.totalUsers).toLocaleString() : 0, Icon: BarChart3, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' },
  ];

  const quickActions = [
    { label: 'Review Pending Blogs', sub: `${stats.pendingBlogs} awaiting approval`, href: '/admin/admin-blogs/pending', color: 'from-yellow-500 to-amber-500', Icon: Clock },
    { label: 'Manage Users', sub: `${stats.totalUsers} total users`, href: '/admin/users', color: 'from-blue-500 to-blue-600', Icon: Users },
    { label: 'All Blogs', sub: `${stats.totalBlogs} total blogs`, href: '/admin/admin-blogs', color: 'from-purple-500 to-violet-600', Icon: BookOpen },
  ];

  const approvalRate = stats.totalBlogs > 0 ? Math.round((stats.approvedBlogs / stats.totalBlogs) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto space-y-6">

      {/* Welcome Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900 rounded-[2rem] p-6 md:p-8 flex items-center gap-5">
        <div className="w-14 h-14 bg-orange-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-orange-900/30">
          <Crown className="w-7 h-7 text-white" />
        </div>
        <div>
          <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.25em] mb-1">Admin Panel</p>
          <h1 className="text-2xl md:text-3xl font-black text-white leading-tight">
            नमस्ते, <span className="text-orange-400">{adminName}</span> 🙏
          </h1>
          <p className="text-white/50 text-sm font-bold mt-0.5">Jai Shri Ram Naam — Admin Dashboard</p>
        </div>
        <div className="ml-auto hidden md:flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-2xl">
          <TrendingUp className="w-4 h-4 text-green-400" />
          <span className="text-white/70 text-xs font-black">Platform Active</span>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {statCards.map((card, i) => (
          <motion.div key={card.title}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`bg-white rounded-[1.5rem] border ${card.border} shadow-sm hover:shadow-lg transition-all p-5`}>
            <div className={`w-10 h-10 ${card.bg} rounded-xl flex items-center justify-center mb-3`}>
              <card.Icon className={`w-5 h-5 ${card.color}`} />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{card.title}</p>
            <p className={`text-2xl md:text-3xl font-black ${card.color}`}>{card.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="bg-white rounded-[2rem] border border-orange-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-black text-slate-900">Quick Actions</h2>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Admin Tools</span>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href}
              className={`group flex items-center gap-4 p-5 bg-gradient-to-br ${action.color} text-white rounded-2xl hover:shadow-xl hover:-translate-y-0.5 transition-all`}>
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <action.Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-sm">{action.label}</p>
                <p className="text-white/70 text-xs font-bold">{action.sub}</p>
              </div>
              <ArrowRight className="w-4 h-4 opacity-60 group-hover:translate-x-1 transition-transform flex-shrink-0" />
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Platform Health */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="bg-white rounded-[2rem] border border-orange-100 shadow-sm p-6">
        <h2 className="text-lg font-black text-slate-900 mb-6">Platform Health</h2>
        <div className="space-y-5">
          {[
            { label: 'Blog Approval Rate', value: `${approvalRate}%`, pct: approvalRate, color: 'from-green-500 to-emerald-500', textColor: 'text-green-600' },
            { label: 'User Engagement', value: stats.totalRamNaam > 0 ? 'High 🔥' : 'Growing 📈', pct: 85, color: 'from-orange-500 to-red-500', textColor: 'text-orange-600' },
            { label: 'Content Growth (7d)', value: `+${stats.recentBlogs} blogs`, pct: 70, color: 'from-purple-500 to-violet-500', textColor: 'text-purple-600' },
          ].map((bar) => (
            <div key={bar.label}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-slate-600">{bar.label}</span>
                <span className={`text-sm font-black ${bar.textColor}`}>{bar.value}</span>
              </div>
              <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }} animate={{ width: `${bar.pct}%` }}
                  transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
                  className={`h-full bg-gradient-to-r ${bar.color} rounded-full`}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* All Admin Pages */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="bg-white rounded-[2rem] border border-orange-100 shadow-sm p-6">
        <h2 className="text-lg font-black text-slate-900 mb-5">All Sections</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {[
            { label: 'Users', href: '/admin/users', icon: '👥', color: 'bg-blue-50 text-blue-700 border-blue-100' },
            { label: 'Mandirs', href: '/admin/admin-mandirs', icon: '🛕', color: 'bg-orange-50 text-orange-700 border-orange-100' },
            { label: 'Katha Vachaks', href: '/admin/admin-katha-vachaks', icon: '📖', color: 'bg-purple-50 text-purple-700 border-purple-100' },
            { label: 'Samagri', href: '/admin/admin-samagri', icon: '🪔', color: 'bg-yellow-50 text-yellow-700 border-yellow-100' },
            { label: 'All Blogs', href: '/admin/admin-blogs', icon: '📝', color: 'bg-green-50 text-green-700 border-green-100' },
            { label: 'Pending Blogs', href: '/admin/admin-blogs/pending', icon: '⏳', color: 'bg-red-50 text-red-700 border-red-100' },
          ].map((item) => (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-3 p-4 rounded-2xl border ${item.color} hover:shadow-md transition-all group`}>
              <span className="text-xl">{item.icon}</span>
              <span className="text-sm font-black group-hover:underline">{item.label}</span>
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
