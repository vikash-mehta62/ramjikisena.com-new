'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Plus, Search, Eye, Pencil, Trash2, BookOpen, Clock,
  TrendingUp, Sparkles, AlertCircle, CheckCircle2, ChevronRight
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
  author: string;
  tags?: string[];
  featuredImage?: string;
  approved?: boolean;
}

const STATUS_BADGES: { [key: string]: { label: string; class: string } } = {
  published: { label: 'Published', class: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  draft:     { label: 'Draft',     class: 'bg-amber-50 text-amber-700 border-amber-200' },
  pending:   { label: 'Pending',   class: 'bg-yellow-50 text-yellow-800 border-yellow-300' },
  archived:  { label: 'Archived',  class: 'bg-slate-100 text-slate-600 border-slate-200' },
};

export default function AdminBlogsPage() {
  const router = useRouter();
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    draft: 0,
    archived: 0,
    views: 0,
  });

  useEffect(() => {
    fetchBlogs();
  }, [statusFilter]);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({ limit: '100' });
      if (statusFilter !== 'all') params.set('status', statusFilter);
      if (search) params.set('search', search);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3101'}/api/blogs/admin/all?${params}`, {
        headers: {
          Authorization: `Bearer ${token || ''}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setBlogs(data.blogs || []);
        if (data.stats) {
          setStats(data.stats);
        }
      }
    } catch (error) {
      console.error('Failed to load blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3101'}/api/blogs/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token || ''}` },
      });
      const data = await res.json();
      if (data.success) {
        setBlogs((prev) => prev.filter((b) => b._id !== id));
        fetchBlogs();
      } else {
        alert(data.message || 'Failed to delete blog');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete blog');
    }
  };

  const filtered = blogs.filter((b) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      b.title.toLowerCase().includes(q) ||
      (b.category && b.category.toLowerCase().includes(q)) ||
      (b.slug && b.slug.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 rounded-3xl p-6 md:p-8 text-white shadow-xl shadow-orange-500/10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center text-white shadow-inner">
            <BookOpen className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-black">ब्लॉग प्रबंधन (Blog Management)</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/20 text-white border border-white/30">
                SEO Pro
              </span>
            </div>
            <p className="text-orange-100 text-sm mt-1">
              Create, optimize and publish SEO-friendly spiritual articles and guides
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/admin-blogs/pending"
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition-all flex items-center gap-2"
          >
            <Clock className="w-4 h-4 text-amber-300" />
            Pending Submissions
          </Link>
          <button
            onClick={() => router.push('/admin/admin-blogs/new')}
            className="flex items-center gap-2 px-5 py-2.5 bg-white text-orange-700 hover:bg-orange-50 rounded-xl text-sm font-black shadow-lg shadow-black/10 transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4" /> New Blog Post
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Posts', value: stats.total, icon: BookOpen, color: 'text-purple-600', bg: 'bg-purple-50/80', border: 'border-purple-200/80' },
          { label: 'Published', value: stats.published, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50/80', border: 'border-emerald-200/80' },
          { label: 'Drafts', value: stats.draft, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50/80', border: 'border-amber-200/80' },
          { label: 'Total Views', value: stats.views.toLocaleString(), icon: Eye, color: 'text-orange-600', bg: 'bg-orange-50/80', border: 'border-orange-200/80' },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} border ${s.border} rounded-2xl p-5 shadow-sm hover:shadow-md transition-all`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{s.label}</span>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <p className={`text-2xl md:text-3xl font-black ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-4 flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title, category, slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchBlogs()}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition-all"
          />
        </div>

        {/* Status Filter */}
        <div className="flex gap-1 bg-slate-100/80 p-1 rounded-xl">
          {['all', 'published', 'draft', 'pending', 'archived'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                statusFilter === s
                  ? 'bg-white shadow text-slate-900'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <button
          onClick={() => router.push('/admin/admin-blogs/new')}
          className="flex items-center gap-2 px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-sm font-bold shadow-md shadow-orange-500/20 transition-all ml-auto"
        >
          <Plus className="w-4 h-4" /> Create Blog
        </button>
      </div>

      {/* Blog Table */}
      <div className="bg-white rounded-3xl border border-orange-100/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-sm font-semibold text-slate-500">Loading blog posts...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 px-4">
            <div className="w-16 h-16 rounded-3xl bg-orange-50 border border-orange-200 text-orange-500 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 opacity-60" />
            </div>
            <h3 className="text-lg font-black text-slate-800">No blog posts found</h3>
            <p className="text-slate-500 text-sm mt-1 max-w-sm mx-auto">
              {search || statusFilter !== 'all'
                ? 'Try clearing your search query or status filter.'
                : 'Start sharing divine spiritual articles and knowledge with devotees.'}
            </p>
            <button
              onClick={() => router.push('/admin/admin-blogs/new')}
              className="mt-5 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all"
            >
              Write First Blog Post
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-black uppercase tracking-wider text-slate-500">
                  <th className="px-5 py-3.5 text-left">Article</th>
                  <th className="px-4 py-3.5 text-left">Category</th>
                  <th className="px-4 py-3.5 text-left">Status</th>
                  <th className="px-4 py-3.5 text-left">Read Time</th>
                  <th className="px-4 py-3.5 text-right">Views</th>
                  <th className="px-4 py-3.5 text-left">Date</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((blog) => (
                  <tr key={blog._id} className="hover:bg-orange-50/30 transition-colors">
                    {/* Title + Thumbnail + Slug */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {blog.featuredImage ? (
                          <img
                            src={blog.featuredImage}
                            alt=""
                            className="w-12 h-12 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-lg flex-shrink-0">
                            🪔
                          </div>
                        )}
                        <div className="min-w-0 max-w-[320px]">
                          <p className="font-bold text-slate-900 truncate hover:text-orange-600 transition-colors">
                            {blog.title}
                          </p>
                          <p className="text-xs text-slate-400 font-mono truncate mt-0.5">
                            /blogs/{blog.slug}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-4">
                      <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-semibold bg-orange-50 text-orange-800 border border-orange-100">
                        {blog.category || 'General'}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-4">
                      {blog.approved === false ? (
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-black border uppercase tracking-wider bg-yellow-50 text-yellow-800 border-yellow-300">
                          Pending
                        </span>
                      ) : (
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-black border uppercase tracking-wider ${
                            STATUS_BADGES[blog.status]?.class || STATUS_BADGES.draft.class
                          }`}
                        >
                          {STATUS_BADGES[blog.status]?.label || blog.status}
                        </span>
                      )}
                    </td>

                    {/* Read Time */}
                    <td className="px-4 py-4 text-slate-600 text-xs font-medium">
                      {blog.readTime || 1} min
                    </td>

                    {/* Views */}
                    <td className="px-4 py-4 text-right font-black text-slate-800">
                      {(blog.views || 0).toLocaleString()}
                    </td>

                    {/* Date */}
                    <td className="px-4 py-4 text-xs text-slate-500 whitespace-nowrap">
                      {blog.publishedAt
                        ? new Date(blog.publishedAt).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })
                        : new Date(blog.createdAt).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {blog.status === 'published' && (
                          <Link
                            href={`/blogs/${blog.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            title="Preview Public Page"
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                        )}
                        <button
                          onClick={() => router.push(`/admin/admin-blogs/${blog._id}`)}
                          title="Edit Blog"
                          className="p-2 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(blog._id, blog.title)}
                          title="Delete Blog"
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
