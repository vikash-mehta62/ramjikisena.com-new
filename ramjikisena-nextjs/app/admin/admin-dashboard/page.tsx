'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBlogs: 0,
    pendingBlogs: 0,
    approvedBlogs: 0,
    totalRamNaam: 0,
    recentUsers: 0,
    recentBlogs: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/api/admin/dashboard');
      const data = await response.json();
      
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: '👥',
      color: 'from-blue-500 to-blue-600',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Total Blogs',
      value: stats.totalBlogs,
      icon: '📚',
      color: 'from-purple-500 to-purple-600',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Pending Blogs',
      value: stats.pendingBlogs,
      icon: '⏳',
      color: 'from-yellow-500 to-yellow-600',
      textColor: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Approved Blogs',
      value: stats.approvedBlogs,
      icon: '✅',
      color: 'from-green-500 to-green-600',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Total Ram Naam',
      value: stats.totalRamNaam.toLocaleString(),
      icon: '🙏',
      color: 'from-orange-500 to-red-600',
      textColor: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'New Users (7 days)',
      value: stats.recentUsers,
      icon: '🆕',
      color: 'from-teal-500 to-teal-600',
      textColor: 'text-teal-600',
      bgColor: 'bg-teal-50'
    },
    {
      title: 'New Blogs (7 days)',
      value: stats.recentBlogs,
      icon: '📝',
      color: 'from-pink-500 to-pink-600',
      textColor: 'text-pink-600',
      bgColor: 'bg-pink-50'
    },
    {
      title: 'Avg Ram Naam/User',
      value: stats.totalUsers > 0 ? Math.round(stats.totalRamNaam / stats.totalUsers) : 0,
      icon: '📊',
      color: 'from-indigo-500 to-indigo-600',
      textColor: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    }
  ];

  return (
    <div>
      {/* Header with Gradient */}
      <div className="mb-8 bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
            <span className="text-4xl">👑</span>
          </div>
          <div>
            <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-orange-100">Welcome to Ramji Ki Sena Admin Panel - Jai Shri Ram! 🚩</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-6 border-2 border-orange-100 hover:border-orange-300 hover:scale-105 transform"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${card.bgColor} p-4 rounded-xl shadow-md`}>
                <span className="text-4xl">{card.icon}</span>
              </div>
            </div>
            <h3 className="text-gray-500 text-sm font-medium mb-2">{card.title}</h3>
            <p className={`text-4xl font-bold ${card.textColor}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border-2 border-orange-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <span>⚡</span> Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <a
            href="/admin/admin-blogs/pending"
            className="flex items-center p-6 bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-xl hover:shadow-2xl hover:scale-105 transition-all"
          >
            <span className="text-4xl mr-4">📝</span>
            <div>
              <p className="font-bold text-lg">Review Blogs</p>
              <p className="text-sm opacity-90">{stats.pendingBlogs} pending approval</p>
            </div>
          </a>

          <a
            href="/admin/users"
            className="flex items-center p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-2xl hover:scale-105 transition-all"
          >
            <span className="text-4xl mr-4">👥</span>
            <div>
              <p className="font-bold text-lg">Manage Users</p>
              <p className="text-sm opacity-90">{stats.totalUsers} total users</p>
            </div>
          </a>

          <a
            href="/admin/admin-blogs"
            className="flex items-center p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl hover:shadow-2xl hover:scale-105 transition-all"
          >
            <span className="text-4xl mr-4">📚</span>
            <div>
              <p className="font-bold text-lg">All Blogs</p>
              <p className="text-sm opacity-90">{stats.totalBlogs} total blogs</p>
            </div>
          </a>
        </div>
      </div>

      {/* Platform Health */}
      <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-orange-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <span>💪</span> Platform Health
        </h2>
        <div className="space-y-6">
          <div>
            <div className="flex justify-between mb-3">
              <span className="text-gray-700 font-medium">Blog Approval Rate</span>
              <span className="font-bold text-green-600 text-lg">
                {stats.totalBlogs > 0
                  ? Math.round((stats.approvedBlogs / stats.totalBlogs) * 100)
                  : 0}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 shadow-inner">
              <div
                className="bg-gradient-to-r from-green-500 to-green-600 h-4 rounded-full shadow-lg transition-all"
                style={{
                  width: `${
                    stats.totalBlogs > 0
                      ? (stats.approvedBlogs / stats.totalBlogs) * 100
                      : 0
                  }%`
                }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-3">
              <span className="text-gray-700 font-medium">User Engagement</span>
              <span className="font-bold text-orange-600 text-lg">
                {stats.totalUsers > 0 && stats.totalRamNaam > 0 ? 'High 🔥' : 'Growing 📈'}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 shadow-inner">
              <div
                className="bg-gradient-to-r from-orange-500 to-red-600 h-4 rounded-full shadow-lg"
                style={{ width: '85%' }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-3">
              <span className="text-gray-700 font-medium">Content Growth (7 days)</span>
              <span className="font-bold text-purple-600 text-lg">
                +{stats.recentBlogs} blogs
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 shadow-inner">
              <div
                className="bg-gradient-to-r from-purple-500 to-purple-600 h-4 rounded-full shadow-lg"
                style={{ width: '70%' }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
