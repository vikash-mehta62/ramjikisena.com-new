'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface DailyCount {
  date: string;
  count: number;
}

interface User {
  _id: string;
  name: string;
  username: string;
  totalCount: number;
  mala: number;
  dailyCounts: DailyCount[];
}

export default function LekhanHistoryPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/me`, {
        credentials: 'include',
      });

      if (!res.ok) {
        router.push('/login');
        return;
      }

      const data = await res.json();
      if (data.success) {
        setUser(data.user);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching history:', error);
      router.push('/login');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🙏</div>
          <p className="text-xl text-orange-700">Loading...</p>
        </div>
      </div>
    );
  }

  const sortedDailyCounts = user?.dailyCounts 
    ? [...user.dailyCounts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-4 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
              <h1 className="text-2xl font-bold">Lekhan History</h1>
            </div>
            <Link href="/dashboard" className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition">
              ← Back
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* User Stats */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-orange-200">
            <h2 className="text-2xl font-bold text-orange-700 mb-4">
              🙏 {user?.name}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-4 rounded-xl">
                <p className="text-sm text-gray-700">Total Count</p>
                <p className="text-3xl font-bold text-blue-700">{user?.totalCount || 0}</p>
              </div>
              <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-4 rounded-xl">
                <p className="text-sm text-gray-700">Total Mala</p>
                <p className="text-3xl font-bold text-purple-700">{user?.mala || 0}</p>
              </div>
              <div className="bg-gradient-to-br from-green-100 to-green-200 p-4 rounded-xl">
                <p className="text-sm text-gray-700">Total Days</p>
                <p className="text-3xl font-bold text-green-700">{sortedDailyCounts.length}</p>
              </div>
            </div>
          </div>

          {/* Daily History */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-orange-200">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-4">
              <h3 className="text-xl font-bold">Daily Ram Naam Count</h3>
            </div>
            
            <div className="p-6">
              {sortedDailyCounts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📝</div>
                  <p className="text-gray-500 text-lg">No history yet</p>
                  <p className="text-gray-400 mt-2">Start counting Ram Naam to see your history</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {sortedDailyCounts.map((entry, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl hover:shadow-md transition"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">
                            {formatDate(entry.date)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(entry.date).toLocaleDateString('en-IN', { weekday: 'long' })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-orange-600">
                          {entry.count}
                        </p>
                        <p className="text-sm text-gray-500">Ram Naam</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
