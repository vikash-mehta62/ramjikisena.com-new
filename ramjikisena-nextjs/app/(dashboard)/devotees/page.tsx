'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Flag, Sparkles } from 'lucide-react';

const getAuthHeaders = (): HeadersInit => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

interface User {
  _id: string;
  name: string;
  rank: number;
  totalCount: number;
  dailyCounts: Array<{
    date: string;
    count: number;
  }>;
}

export default function AllDevoteesPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDevotees();
  }, []);

  const fetchDevotees = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/devotees`, {
        headers: getAuthHeaders(),
        credentials: 'include',
      });

      if (!res.ok) {
        router.push('/login');
        return;
      }

      const data = await res.json();
      if (data.success) {
        setUsers(data.users);
        setFilteredUsers(data.users);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching devotees:', error);
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user =>
        user.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  };

  const getTodayCount = (user: User) => {
    if (!user.dailyCounts || user.dailyCounts.length === 0) return 0;
    
    const today = new Date().toDateString();
    const lastEntry = user.dailyCounts[user.dailyCounts.length - 1];
    const lastDate = new Date(lastEntry.date).toDateString();
    
    return lastDate === today ? lastEntry.count : 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="w-16 h-16 text-orange-500 mx-auto mb-4" />
          <p className="text-xl text-orange-700">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-4 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <Flag className="w-6 h-6 text-orange-600" />
              </div>
              <h1 className="text-2xl font-bold">All Devotees</h1>
            </div>
            <Link href="/dashboard" className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition">
              ← Back
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Search Box */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-orange-200">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search devotees by name..."
              className="w-full px-4 py-3 border-2 border-orange-300 rounded-lg focus:outline-none focus:border-orange-500 text-lg"
            />
          </div>

          {/* Stats */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-orange-200">
            <h2 className="text-2xl font-bold text-orange-700 mb-2">
              Total Devotees: {filteredUsers.length}
            </h2>
            <p className="text-gray-600">Showing all registered devotees</p>
          </div>

          {/* Devotees Table */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-orange-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left">Rank</th>
                    <th className="px-6 py-4 text-left">Name</th>
                    <th className="px-6 py-4 text-left">Today's Count</th>
                    <th className="px-6 py-4 text-left">Total Count</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                        No devotees found
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user, index) => (
                      <tr
                        key={user._id}
                        className={`border-b hover:bg-orange-50 transition ${
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                        }`}
                      >
                        <td className="px-6 py-4 font-semibold text-red-600">
                          {user.rank}
                        </td>
                        <td className="px-6 py-4 font-medium text-orange-700">
                          {user.name}
                        </td>
                        <td className="px-6 py-4 text-blue-600 font-semibold">
                          {getTodayCount(user)}
                        </td>
                        <td className="px-6 py-4 text-green-600 font-bold">
                          {user.totalCount}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
