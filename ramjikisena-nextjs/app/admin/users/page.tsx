'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Users, Crown, Sparkles, BarChart3, Search, Trophy, User, MapPin, Phone, Calendar } from 'lucide-react';

interface UserType {
  _id: string;
  username: string;
  name: string;
  city: string;
  contact: string;
  role: string;
  rank: number;
  totalCount: number;
  mala: number;
  joiningDate: string;
}

export default function UsersManagement() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('joiningDate');

  useEffect(() => {
    fetchUsers();
  }, [search, sortBy]);

  const fetchUsers = async () => {
    try {
      let url = `/api/admin/users?sortBy=${sortBy}`;
      if (search) url += `&search=${search}`;
      const response = await api.get(url);
      const data = await response.json();
      if (data.success) setUsers(data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
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

  return (
    <div>
      {/* Header */}
      <div className="mb-8 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
            <Users className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-4xl font-bold mb-2">User Management</h1>
            <p className="text-blue-100">Manage all registered users on the platform</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-blue-100 hover:shadow-xl hover:scale-105 transition-all">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-gray-500 text-sm font-medium">Total Users</p>
          </div>
          <p className="text-4xl font-bold text-blue-600">{users.length}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-orange-100 hover:shadow-xl hover:scale-105 transition-all">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Crown className="w-6 h-6 text-orange-600" />
            </div>
            <p className="text-gray-500 text-sm font-medium">Admins</p>
          </div>
          <p className="text-4xl font-bold text-orange-600">
            {users.filter(u => u.role === 'admin').length}
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-red-100 hover:shadow-xl hover:scale-105 transition-all">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-red-600" />
            </div>
            <p className="text-gray-500 text-sm font-medium">Total Ram Naam</p>
          </div>
          <p className="text-4xl font-bold text-red-600">
            {users.reduce((sum, u) => sum + u.totalCount, 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-purple-100 hover:shadow-xl hover:scale-105 transition-all">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-gray-500 text-sm font-medium">Avg Ram Naam</p>
          </div>
          <p className="text-4xl font-bold text-purple-600">
            {users.length > 0
              ? Math.round(users.reduce((sum, u) => sum + u.totalCount, 0) / users.length)
              : 0}
          </p>
        </div>
      </div>

      {/* Search and Sort */}
      <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border-2 border-blue-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, username, or city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-6 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-semibold"
          >
            <option value="joiningDate">Sort by Join Date</option>
            <option value="totalCount">Sort by Ram Naam Count</option>
            <option value="rank">Sort by Rank</option>
            <option value="name">Sort by Name</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-blue-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold">
                  <div className="flex items-center gap-2"><Trophy className="w-4 h-4" /> Rank</div>
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold">
                  <div className="flex items-center gap-2"><User className="w-4 h-4" /> User</div>
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold">
                  <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /> City</div>
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold">
                  <div className="flex items-center gap-2"><Phone className="w-4 h-4" /> Contact</div>
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold">
                  <div className="flex items-center gap-2"><Sparkles className="w-4 h-4" /> Ram Naam</div>
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold">
                  <div className="flex items-center gap-2"><BarChart3 className="w-4 h-4" /> Mala</div>
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold">
                  <div className="flex items-center gap-2"><Crown className="w-4 h-4" /> Role</div>
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold">
                  <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /> Joined</div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center justify-center w-8 h-8 bg-orange-100 text-orange-600 rounded-full font-bold text-sm">
                      {user.rank}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-800">{user.name}</p>
                    <p className="text-sm text-gray-500">@{user.username}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{user.city}</td>
                  <td className="px-6 py-4 text-gray-600">{user.contact}</td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-orange-600">{user.totalCount.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{user.mala}</td>
                  <td className="px-6 py-4">
                    {user.role === 'admin' ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 text-xs rounded-full font-semibold">
                        <Crown className="w-3 h-3" /> Admin
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-semibold">
                        <User className="w-3 h-3" /> User
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(user.joiningDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && (
          <div className="p-12 text-center">
            <Users className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-3xl font-bold text-gray-800 mb-3">No Users Found</h3>
            <p className="text-gray-600 text-lg">Try adjusting your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
