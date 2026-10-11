'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import AdminPagination from '@/components/AdminPagination';
import {
  Plus, Search, Eye, Pencil, Trash2, BookOpen, Clock,
  TrendingUp, Sparkles, AlertCircle, CheckCircle2, XCircle,
  X, RefreshCw, User, MapPin, Tag, ExternalLink, ShieldCheck
} from 'lucide-react';

interface BlogItem {
  _id: string;
  title: string;
  slug: string;
  category: string;
  status: 'draft' | 'published' | 'archived';
  readTime: number;
  views: number;
  publishedAt?: string;
  createdAt: string;
  author: any; // string or object { name, username, city }
  tags?: string[];
  featuredImage?: string;
  shortDescription?: string;
  content?: string;
  approved?: boolean;
}

const STATUS_BADGES: { [key: string]: { label: string; class: string } } = {
  published: { label: 'प्रकाशित (Published)', class: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  draft:     { label: 'ड्राफ्ट (Draft)',     class: 'bg-slate-100 text-slate-700 border-slate-200' },
  pending:   { label: 'लंबित (Pending)',   class: 'bg-amber-50 text-amber-800 border-amber-300' },
  archived:  { label: 'अभिलेखागार (Archived)',  class: 'bg-slate-100 text-slate-600 border-slate-200' },
};

function AdminBlogsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'all';

  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'draft'>(
    initialTab === 'pending' ? 'pending' : initialTab === 'draft' ? 'draft' : initialTab === 'approved' ? 'approved' : 'all'
  );
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    draft: 0
  });

  // Modal State
  const [previewBlog, setPreviewBlog] = useState<BlogItem | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try {
      let url = `/api/admin/blogs?page=${page}&limit=${limit}`;
      if (activeTab !== 'all') url += `&status=${activeTab}`;
      if (search.trim()) url += `&search=${encodeURIComponent(search.trim())}`;

      const res = await api.get(url);
      const data = await res.json();
      if (data.success) {
        setBlogs(data.blogs || []);
        if (data.pagination) {
          setTotalPages(data.pagination.totalPages || 1);
          setTotalCount(data.pagination.total || 0);
        }
        if (data.stats) {
          setStats(data.stats);
        }
      }
    } catch (error) {
      console.error('Failed to load blogs:', error);
    } finally {
      setLoading(false);
    }
  }, [page, limit, activeTab, search]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const handleTabChange = (tab: 'all' | 'pending' | 'approved' | 'draft') => {
    setActiveTab(tab);
    setPage(1);
  };

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const handleApprove = async (blogId: string) => {
    if (!confirm('क्या आप इस ब्लॉग को स्वीकृत करके प्रकाशित करना चाहते हैं?')) return;
    setProcessingId(blogId);
    try {
      const res = await api.post(`/api/admin/blogs/${blogId}/approve`);
      const data = await res.json();
      if (data.success) {
        alert('ब्लॉग सफलतापूर्वक स्वीकृत और प्रकाशित किया गया!');
        if (previewBlog?._id === blogId) {
          setPreviewBlog(null);
        }
        fetchBlogs();
      } else {
        alert(data.message || 'कार्रवाई विफल रही');
      }
    } catch (error) {
      console.error('Approve error:', error);
      alert('ब्लॉग स्वीकृत करने में त्रुटि हुई');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (blogId: string) => {
    if (!confirm('क्या आप इस ब्लॉग को अस्वीकृत (हटाना) चाहते हैं? यह क्रिया वापस नहीं ली जा सकती।')) return;
    setProcessingId(blogId);
    try {
      const res = await api.post(`/api/admin/blogs/${blogId}/reject`);
      const data = await res.json();
      if (data.success) {
        alert('ब्लॉग अस्वीकृत और हटा दिया गया');
        if (previewBlog?._id === blogId) {
          setPreviewBlog(null);
        }
        fetchBlogs();
      } else {
        alert(data.message || 'कार्रवाई विफल रही');
      }
    } catch (error) {
      console.error('Reject error:', error);
      alert('अस्वीकृत करने में त्रुटि हुई');
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`क्या आप वाकई "${title}" को हटाना चाहते हैं?`)) return;
    setProcessingId(id);
    try {
      const res = await api.delete(`/api/admin/blogs/${id}`);
      const data = await res.json();
      if (data.success) {
        setBlogs((prev) => prev.filter((b) => b._id !== id));
        fetchBlogs();
      } else {
        alert(data.message || 'डिलीट करने में विफल');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('ब्लॉग डिलीट करने में विफल');
    } finally {
      setProcessingId(null);
    }
  };

  const getAuthorDisplay = (author: any) => {
    if (!author) return 'श्री राम जी की सेना';
    if (typeof author === 'string') return author;
    return author.name || author.username || 'उपयोगकर्ता';
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Premium Header Banner */}
      <div className="bg-slate-900 border border-white/10 rounded-[2rem] p-6 sm:p-8 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-lg shadow-orange-500/20 text-white font-bold flex-shrink-0">
              <BookOpen className="w-7 h-7" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-white/10 text-orange-300 text-[11px] font-black uppercase tracking-wider mb-1">
                Spiritual Content & Approvals
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">ब्लॉग एवं लेख प्रबंधन (Blogs)</h1>
              <p className="text-sm text-slate-300 mt-0.5">आध्यात्मिक लेखों की रचना, संपादन व उपयोगकर्ता स्वीकृति</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => fetchBlogs()}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-bold transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              रिफ्रेश
            </button>
            <button
              onClick={() => router.push('/admin/admin-blogs/new')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold rounded-xl text-xs shadow-lg shadow-orange-500/20 transition-all hover:scale-105"
            >
              <Plus className="w-4 h-4" /> नया ब्लॉग लिखें (New Blog)
            </button>
          </div>
        </div>
      </div>

      {/* Global Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => handleTabChange('all')}
          className={`cursor-pointer bg-white rounded-2xl p-5 border transition-all ${
            activeTab === 'all' ? 'border-slate-900 shadow-md ring-2 ring-slate-900/10' : 'border-slate-100 shadow-sm hover:shadow-md'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">कुल ब्लॉग (Total)</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900">{stats.total.toLocaleString()}</p>
          <span className="text-[11px] text-slate-400 font-medium">सभी आध्यात्मिक लेख</span>
        </div>

        <div
          onClick={() => handleTabChange('pending')}
          className={`cursor-pointer bg-white rounded-2xl p-5 border transition-all ${
            activeTab === 'pending' ? 'border-amber-500 shadow-md ring-2 ring-amber-500/10' : 'border-slate-100 shadow-sm hover:shadow-md'
          } ${stats.pending > 0 ? 'bg-amber-50/30' : ''}`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-amber-800">लंबित स्वीकृति (Pending)</span>
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl sm:text-3xl font-black text-amber-600">{stats.pending.toLocaleString()}</p>
            {stats.pending > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-black animate-pulse">
                ध्यान दें
              </span>
            )}
          </div>
          <span className="text-[11px] text-amber-700/80 font-medium">उपयोगकर्ता सबमिशन रिव्यू हेतु</span>
        </div>

        <div
          onClick={() => handleTabChange('approved')}
          className={`cursor-pointer bg-white rounded-2xl p-5 border transition-all ${
            activeTab === 'approved' ? 'border-emerald-600 shadow-md ring-2 ring-emerald-600/10' : 'border-slate-100 shadow-sm hover:shadow-md'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">प्रकाशित (Published)</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-600">{stats.approved.toLocaleString()}</p>
          <span className="text-[11px] text-slate-400 font-medium">लाइव लेख भक्तों हेतु</span>
        </div>

        <div
          onClick={() => handleTabChange('draft')}
          className={`cursor-pointer bg-white rounded-2xl p-5 border transition-all ${
            activeTab === 'draft' ? 'border-slate-700 shadow-md ring-2 ring-slate-700/10' : 'border-slate-100 shadow-sm hover:shadow-md'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">ड्राफ्ट्स (Drafts)</span>
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <Pencil className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-700">{stats.draft.toLocaleString()}</p>
          <span className="text-[11px] text-slate-400 font-medium">अप्रकाशित रचनाएँ</span>
        </div>
      </div>

      {/* Tabs & Search Navigation Bar */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Unified Sub-Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto p-1 bg-slate-100 rounded-xl no-scrollbar max-w-full">
            {[
              { id: 'all', label: 'सभी ब्लॉग (All)', count: stats.total },
              { id: 'pending', label: 'स्वीकृति हेतु लंबित (Pending)', count: stats.pending, highlight: true },
              { id: 'approved', label: 'प्रकाशित (Published)', count: stats.approved },
              { id: 'draft', label: 'ड्राफ्ट्स (Drafts)', count: stats.draft }
            ].map((tab) => {
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id as any)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex-shrink-0 ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                        isSelected
                          ? tab.highlight && stats.pending > 0
                            ? 'bg-amber-400 text-slate-900'
                            : 'bg-white/20 text-white'
                          : tab.highlight && stats.pending > 0
                          ? 'bg-amber-500 text-white animate-pulse'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[220px] flex-1 md:max-w-xs">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="शीर्षक, श्रेणी, या लेखक से खोजें..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"
            />
          </div>
        </div>
      </div>

      {/* Blogs Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[750px]">
            <thead>
              <tr className="bg-slate-900 text-white text-[11px] font-black uppercase tracking-wider">
                <th className="py-3.5 px-4">लेख / शीर्षक (Article)</th>
                <th className="py-3.5 px-4">श्रेणी (Category)</th>
                <th className="py-3.5 px-4">लेखक (Author)</th>
                <th className="py-3.5 px-4">स्थिति (Status)</th>
                <th className="py-3.5 px-4">समय व व्यूज</th>
                <th className="py-3.5 px-4">तिथि</th>
                <th className="py-3.5 px-4 text-right">कार्यवाही (Actions)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 font-medium">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mb-2" />
                    <p>ब्लॉग लोड हो रहे हैं...</p>
                  </td>
                </tr>
              ) : blogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <BookOpen className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                    <p className="font-bold text-sm text-slate-600">कोई ब्लॉग नहीं मिला</p>
                    <p className="text-xs">
                      {activeTab === 'pending'
                        ? 'कोई लंबित ब्लॉग समीक्षा हेतु उपलब्ध नहीं है।'
                        : 'खोज या फ़िल्टर बदल कर पुनः प्रयास करें।'}
                    </p>
                  </td>
                </tr>
              ) : (
                blogs.map((b) => {
                  const isPending = b.approved === false;
                  return (
                    <tr key={b._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          {b.featuredImage ? (
                            <img
                              src={b.featuredImage}
                              alt=""
                              className="w-11 h-11 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                            />
                          ) : (
                            <div className="w-11 h-11 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-base flex-shrink-0">
                              🪔
                            </div>
                          )}
                          <div className="min-w-0 max-w-[300px]">
                            <p
                              onClick={() => setPreviewBlog(b)}
                              className="font-bold text-slate-900 truncate hover:text-orange-600 cursor-pointer text-sm"
                            >
                              {b.title}
                            </p>
                            <p className="text-[11px] text-slate-400 font-mono truncate mt-0.5">
                              /blogs/{b.slug || b._id}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="inline-block px-2.5 py-1 rounded-lg text-[11px] font-bold bg-orange-50 text-orange-800 border border-orange-100">
                          {b.category || 'आध्यात्मिक'}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-slate-600 font-medium">
                        <div className="flex items-center gap-1.5">
                          <User className="w-3 h-3 text-slate-400" />
                          <span>{getAuthorDisplay(b.author)}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        {isPending ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black border uppercase tracking-wider bg-amber-50 text-amber-800 border-amber-300">
                            <Clock className="w-3 h-3 text-amber-600" /> Pending Approval
                          </span>
                        ) : (
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black border uppercase tracking-wider ${
                              STATUS_BADGES[b.status]?.class || STATUS_BADGES.draft.class
                            }`}
                          >
                            {STATUS_BADGES[b.status]?.label || b.status}
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-slate-600 font-medium text-[11px]">
                        <div>{b.readTime || 1} min read</div>
                        <div className="text-slate-400 font-mono">{(b.views || 0).toLocaleString()} views</div>
                      </td>

                      <td className="py-3 px-4 text-slate-500 text-[11px]">
                        {new Date(b.publishedAt || b.createdAt).toLocaleDateString('hi-IN', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Preview / View Details Modal Trigger */}
                          <button
                            onClick={() => setPreviewBlog(b)}
                            title="प्रीव्यू एवं पूर्ण विवरण"
                            className="p-1.5 bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-700 rounded-lg transition-all"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Quick Approve & Reject if Pending */}
                          {isPending && (
                            <>
                              <button
                                onClick={() => handleApprove(b._id)}
                                disabled={processingId === b._id}
                                title="स्वीकृत करें (Approve)"
                                className="p-1.5 bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 border border-emerald-200 rounded-lg transition-all"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleReject(b._id)}
                                disabled={processingId === b._id}
                                title="अस्वीकृत करें (Reject)"
                                className="p-1.5 bg-red-50 hover:bg-red-600 hover:text-white text-red-700 border border-red-200 rounded-lg transition-all"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}

                          {/* Edit */}
                          <button
                            onClick={() => router.push(`/admin/admin-blogs/${b._id}`)}
                            title="संपादित करें (Edit)"
                            className="p-1.5 bg-slate-100 hover:bg-orange-600 hover:text-white text-slate-600 rounded-lg transition-all"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>

                          {/* Public link if published */}
                          {b.status === 'published' && b.slug && (
                            <Link
                              href={`/blogs/${b.slug}`}
                              target="_blank"
                              rel="noreferrer"
                              title="पब्लिक पेज देखें"
                              className="p-1.5 bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-600 rounded-lg transition-all"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>
                          )}

                          {/* Delete */}
                          <button
                            onClick={() => handleDelete(b._id, b.title)}
                            disabled={processingId === b._id}
                            title="हटाएं (Delete)"
                            className="p-1.5 bg-slate-100 hover:bg-red-600 hover:text-white text-slate-500 rounded-lg transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
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
            itemName="ब्लॉग"
          />
        </div>
      </div>

      {/* Comprehensive Blog Preview / Details Modal */}
      {previewBlog && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-slate-100 flex flex-col my-8 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-slate-900 p-6 text-white relative flex-shrink-0">
              <button
                onClick={() => setPreviewBlog(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="pr-10">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-orange-300 text-[10px] font-bold uppercase tracking-wider">
                    {previewBlog.category || 'Blog Post'}
                  </span>
                  {previewBlog.approved === false ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                      लंबित स्वीकृति (Pending)
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                      {previewBlog.status}
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-black text-white leading-snug">{previewBlog.title}</h3>
                <p className="text-xs text-slate-300 mt-1 flex items-center gap-2">
                  <span>लेखक: {getAuthorDisplay(previewBlog.author)}</span>
                  <span>•</span>
                  <span>{new Date(previewBlog.createdAt).toLocaleDateString('hi-IN')}</span>
                </p>
              </div>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-sm">
              {/* Featured Image */}
              {previewBlog.featuredImage && (
                <div className="rounded-2xl overflow-hidden border border-slate-200 max-h-64">
                  <img
                    src={previewBlog.featuredImage}
                    alt={previewBlog.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Author & Meta Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 block mb-0.5">लेखक</span>
                  <span className="font-bold text-slate-800 text-xs">{getAuthorDisplay(previewBlog.author)}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 block mb-0.5">पढ़ने का समय</span>
                  <span className="font-bold text-slate-800 text-xs">{previewBlog.readTime || 1} मिनट</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 col-span-2 sm:col-span-1">
                  <span className="text-[10px] font-bold text-slate-400 block mb-0.5">व्यूज़ संख्या</span>
                  <span className="font-bold text-slate-800 text-xs">{(previewBlog.views || 0).toLocaleString()}</span>
                </div>
              </div>

              {/* Excerpt / Short Description */}
              {previewBlog.shortDescription && (
                <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-100 text-xs text-amber-900">
                  <span className="font-bold block mb-1">संक्षिप्त सारांश (Short Excerpt):</span>
                  <p>{previewBlog.shortDescription}</p>
                </div>
              )}

              {/* Full Article Content */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
                  पूर्ण सामग्री (Article Content)
                </h4>
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-700 max-h-80 overflow-y-auto leading-relaxed prose prose-sm max-w-none">
                  {previewBlog.content ? (
                    <div
                      dangerouslySetInnerHTML={{ __html: previewBlog.content }}
                    />
                  ) : (
                    <p className="text-slate-400 italic">कोई सामग्री उपलब्ध नहीं है।</p>
                  )}
                </div>
              </div>

              {/* Tags */}
              {previewBlog.tags && previewBlog.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {previewBlog.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-semibold"
                    >
                      <Tag className="w-2.5 h-2.5" /> {t}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Actions Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 flex-shrink-0">
              <div className="flex items-center gap-2">
                {previewBlog.approved === false && (
                  <>
                    <button
                      onClick={() => handleApprove(previewBlog._id)}
                      disabled={processingId === previewBlog._id}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1.5 shadow-sm"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> स्वीकृत करें (Approve)
                    </button>
                    <button
                      onClick={() => handleReject(previewBlog._id)}
                      disabled={processingId === previewBlog._id}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1.5 shadow-sm"
                    >
                      <XCircle className="w-3.5 h-3.5" /> अस्वीकृत करें (Reject)
                    </button>
                  </>
                )}
                <button
                  onClick={() => {
                    router.push(`/admin/admin-blogs/${previewBlog._id}`);
                  }}
                  className="px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1.5"
                >
                  <Pencil className="w-3.5 h-3.5" /> संपादित करें (Edit)
                </button>
              </div>

              <button
                onClick={() => setPreviewBlog(null)}
                className="px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 rounded-xl text-xs font-bold transition-colors"
              >
                बंद करें (Close)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminBlogsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-400">Loading blogs...</div>}>
      <AdminBlogsContent />
    </Suspense>
  );
}
