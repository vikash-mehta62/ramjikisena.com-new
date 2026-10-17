'use client';

import { useEffect, useState, useCallback } from 'react';
import api from '@/lib/api';
import AdminPagination from '@/components/AdminPagination';
import {
  Users, Crown, Sparkles, BarChart3, Search, Trophy,
  User, MapPin, Phone, Calendar, Eye, X, Shield, RefreshCw
} from 'lucide-react';

interface UserType {
  _id: string;
  username: string;
  name: string;
  city: string;
  contact: string;
  role: string;
  rank?: number;
  totalCount: number;
  mala: number;
  joiningDate?: string;
  createdAt?: string;
  profileImage?: string;
}

interface StatsType {
  totalUsers: number;
  totalAdmins: number;
  totalStaff: number;
  totalJaap: number;
}

export default function UsersManagement() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [sortBy, setSortBy] = useState('joiningDate');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [stats, setStats] = useState<StatsType>({
    totalUsers: 0,
    totalAdmins: 0,
    totalStaff: 0,
    totalJaap: 0
  });

  // Modal State
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      let url = `/api/admin/users?page=${page}&limit=${limit}&sortBy=${sortBy}`;
      if (search.trim()) url += `&search=${encodeURIComponent(search.trim())}`;
      if (roleFilter !== 'all') url += `&role=${encodeURIComponent(roleFilter)}`;

      const response = await api.get(url);
      const data = await response.json();
      if (data.success) {
        setUsers(data.users || []);
        if (data.pagination) {
          setTotalPages(data.pagination.totalPages || 1);
          setTotalCount(data.pagination.total || 0);
        }
        if (data.stats) {
          setStats(data.stats);
        }
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, roleFilter, sortBy]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const handleRoleChange = (role: string) => {
    setRoleFilter(role);
    setPage(1);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Premium Header Banner */}
      <div className="bg-slate-900 border border-white/10 rounded-[2rem] p-6 sm:p-8 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-lg shadow-orange-500/20 text-white font-bold flex-shrink-0">
              <Users className="w-7 h-7" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-white/10 text-orange-300 text-[11px] font-black uppercase tracking-wider mb-1">
                Directory & Devotees
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">उपयोगकर्ता प्रबंधन (Users)</h1>
              <p className="text-sm text-slate-300 mt-0.5">सभी पंजीकृत भक्तों, साधकों व व्यवस्थापकों का विवरण</p>
            </div>
          </div>
          <button
            onClick={() => fetchUsers()}
            disabled={loading}
            className="self-start md:self-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-bold transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            रिफ्रेश (Refresh)
          </button>
        </div>
      </div>

      {/* Global Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">कुल भक्त (Users)</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900">{stats.totalUsers.toLocaleString()}</p>
          <span className="text-[11px] text-slate-400 font-medium">पंजीकृत साधक</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">एडमिनिस्ट्रेटर (Admins)</span>
            <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <Crown className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-orange-600">{stats.totalAdmins.toLocaleString()}</p>
          <span className="text-[11px] text-slate-400 font-medium">पूर्ण अधिकार प्राप्त</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">स्टाफ सदस्य (Staff)</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-amber-600">{stats.totalStaff.toLocaleString()}</p>
          <span className="text-[11px] text-slate-400 font-medium">मॉडरेटर व सहायक</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">कुल राम नाम जाप</span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-rose-600">{stats.totalJaap.toLocaleString()}</p>
          <span className="text-[11px] text-slate-400 font-medium">प्लेटफ़ॉर्म पर संचित जाप</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="नाम, यूज़रनेम, फ़ोन नंबर या शहर से खोजें..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"
            />
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
            <select
              value={roleFilter}
              onChange={(e) => handleRoleChange(e.target.value)}
              className="flex-1 sm:flex-none px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">सभी भूमिकाएँ (All Roles)</option>
              <option value="admin">एडमिन (Admin)</option>
              <option value="staff">स्टाफ (Staff)</option>
              <option value="user">भक्त (User)</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
              className="flex-1 sm:flex-none px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="joiningDate">जुड़ने की तिथि (Newest First)</option>
              <option value="totalCount">जाप संख्या अनुसार (Top Jaap)</option>
              <option value="name">नाम (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[750px]">
            <thead>
              <tr className="bg-slate-900 text-white text-[11px] font-black uppercase tracking-wider">
                <th className="py-3.5 px-4">रैंक / ID</th>
                <th className="py-3.5 px-4">उपयोगकर्ता (User)</th>
                <th className="py-3.5 px-4">शहर (City)</th>
                <th className="py-3.5 px-4">संपर्क (Contact)</th>
                <th className="py-3.5 px-4">राम नाम जाप</th>
                <th className="py-3.5 px-4">माला</th>
                <th className="py-3.5 px-4">रोल (Role)</th>
                <th className="py-3.5 px-4">रजिस्ट्रेशन तिथि</th>
                <th className="py-3.5 px-4 text-right">विवरण</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400 font-medium">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mb-2" />
                    <p>डेटा लोड हो रहा है...</p>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <Users className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                    <p className="font-bold text-sm text-slate-600">कोई उपयोगकर्ता नहीं मिला</p>
                    <p className="text-xs">फ़िल्टर या खोज बदल कर पुनः प्रयास करें</p>
                  </td>
                </tr>
              ) : (
                users.map((u, idx) => (
                  <tr key={u._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-black text-slate-700">
                      {u.rank ? (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-orange-100 text-orange-700 font-black text-xs">
                          #{u.rank}
                        </span>
                      ) : (
                        <span className="text-slate-400">#{(page - 1) * limit + idx + 1}</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-black text-xs uppercase flex-shrink-0">
                          {u.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{u.name}</p>
                          <p className="text-[11px] text-slate-400 font-medium">@{u.username || 'user'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-medium">
                      {u.city ? (
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" /> {u.city}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">उपलब्ध नहीं</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                      {u.contact || '—'}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-black text-orange-600">
                        {(u.totalCount || 0).toLocaleString()}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-700">
                      {(u.mala || 0).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      {u.role === 'admin' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-100 text-orange-700 font-bold text-[10px]">
                          <Crown className="w-3 h-3" /> Admin
                        </span>
                      ) : u.role === 'staff' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px]">
                          <Shield className="w-3 h-3" /> Staff
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px]">
                          <User className="w-3 h-3" /> Devotee
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-500 text-[11px]">
                      {u.joiningDate || u.createdAt
                        ? new Date(u.joiningDate || u.createdAt!).toLocaleDateString('hi-IN', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })
                        : '—'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedUser(u)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-700 font-bold text-[11px] transition-all shadow-sm"
                      >
                        <Eye className="w-3 h-3" /> देखें
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Server-Side Pagination */}
        <div className="p-4 border-t border-slate-100">
          <AdminPagination
            page={page}
            totalPages={totalPages}
            total={totalCount}
            limit={limit}
            onPageChange={(p) => setPage(p)}
            onLimitChange={(l) => { setLimit(l); setPage(1); }}
            itemName="उपयोगकर्ता"
          />
        </div>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] overflow-hidden shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200 flex flex-col my-auto">
            {/* Modal Header */}
            <div className="bg-slate-900 p-5 sm:p-6 text-white relative flex-shrink-0">
              <button
                onClick={() => setSelectedUser(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-orange-500/20 border border-orange-500/40 text-orange-400 flex items-center justify-center text-xl sm:text-2xl font-black flex-shrink-0">
                  {selectedUser.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-white">{selectedUser.name}</h3>
                  <p className="text-xs text-slate-300 font-medium">@{selectedUser.username || 'user'}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-white/10 text-orange-300 text-[10px] font-bold uppercase">
                      {selectedUser.role}
                    </span>
                    {selectedUser.rank && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                        रैंक #{selectedUser.rank}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-4 sm:space-y-5 text-sm flex-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <span className="text-[11px] font-bold text-slate-400 block mb-1">फ़ोन / संपर्क</span>
                  <div className="flex items-center gap-2 text-slate-800 font-bold">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{selectedUser.contact || 'उपलब्ध नहीं'}</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <span className="text-[11px] font-bold text-slate-400 block mb-1">शहर / स्थान</span>
                  <div className="flex items-center gap-2 text-slate-800 font-bold">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{selectedUser.city || 'उपलब्ध नहीं'}</span>
                  </div>
                </div>
              </div>

              {/* Spiritual Progress */}
              <div className="bg-orange-50/60 border border-orange-100 rounded-2xl p-4">
                <p className="text-xs font-black text-orange-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-orange-600" /> आध्यात्मिक प्रगति (Spiritual Stats)
                </p>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-white rounded-xl p-2.5 border border-orange-100">
                    <span className="text-[10px] text-slate-400 font-bold block">कुल जाप</span>
                    <span className="text-base font-black text-orange-600">
                      {(selectedUser.totalCount || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="bg-white rounded-xl p-2.5 border border-orange-100">
                    <span className="text-[10px] text-slate-400 font-bold block">माला फेरा</span>
                    <span className="text-base font-black text-slate-800">
                      {(selectedUser.mala || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="bg-white rounded-xl p-2.5 border border-orange-100">
                    <span className="text-[10px] text-slate-400 font-bold block">ग्लोबल रैंक</span>
                    <span className="text-base font-black text-amber-600">
                      {selectedUser.rank ? `#${selectedUser.rank}` : '—'}
                    </span>
                  </div>
                </div>
              </div>

              {/* System Info */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-2 text-xs">
                <div className="flex justify-between items-center text-slate-600">
                  <span className="text-slate-400">यूज़र ID:</span>
                  <span className="font-mono text-[11px] text-slate-700">{selectedUser._id}</span>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span className="text-slate-400">रजिस्ट्रेशन तिथि:</span>
                  <span className="font-medium text-slate-700">
                    {selectedUser.joiningDate || selectedUser.createdAt
                      ? new Date(selectedUser.joiningDate || selectedUser.createdAt!).toLocaleString('hi-IN')
                      : 'उपलब्ध नहीं'}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setSelectedUser(null)}
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors"
                >
                  बंद करें (Close)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
