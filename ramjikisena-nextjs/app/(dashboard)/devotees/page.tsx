'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const getAuthHeaders = (): HeadersInit => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

interface User {
  _id: string; name: string; rank: number; totalCount: number;
  dailyCounts: Array<{ date: string; count: number }>;
}

export default function AllDevoteesPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [filtered, setFiltered] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/devotees`, {
      headers: getAuthHeaders(), credentials: 'include',
    }).then(res => {
      if (!res.ok) { router.push('/login'); return null; }
      return res.json();
    }).then(data => {
      if (data?.success) { setUsers(data.users); setFiltered(data.users); }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleSearch = (q: string) => {
    setSearch(q);
    setFiltered(q.trim() ? users.filter(u => u.name.toLowerCase().includes(q.toLowerCase())) : users);
  };

  const getTodayCount = (u: User) => {
    if (!u.dailyCounts?.length) return 0;
    const today = new Date().toDateString();
    const last = u.dailyCounts[u.dailyCounts.length - 1];
    return new Date(last.date).toDateString() === today ? last.count : 0;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">

      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900">All Devotees</h1>
        <p className="text-slate-500 text-sm mt-1">Sabhi bhakton ki list dekhein</p>
      </div>

      {/* Search + Count */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border-2 border-orange-100 flex flex-col sm:flex-row gap-3 items-center">
        <input
          type="text"
          value={search}
          onChange={e => handleSearch(e.target.value)}
          placeholder="Search devotees by name..."
          className="flex-1 w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none text-sm"
        />
        <span className="text-sm font-bold text-slate-500 whitespace-nowrap">
          {filtered.length} devotees
        </span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border-2 border-orange-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
              <tr>
                {['Rank', 'Name', "Today's Count", 'Total Count'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-sm font-black">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-10 text-center text-slate-400 font-semibold">
                    No devotees found
                  </td>
                </tr>
              ) : (
                filtered.map((u, i) => (
                  <tr key={u._id} className={`border-b hover:bg-orange-50 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                    <td className="px-5 py-3 font-black text-red-500">#{u.rank}</td>
                    <td className="px-5 py-3 font-bold text-slate-800">{u.name}</td>
                    <td className="px-5 py-3 font-bold text-blue-600">{getTodayCount(u)}</td>
                    <td className="px-5 py-3 font-black text-green-600">{u.totalCount}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
