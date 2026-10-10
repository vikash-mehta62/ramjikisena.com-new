'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Clock, BookOpen, PenSquare, Eye, Heart, Sparkles, ChevronRight } from 'lucide-react';

interface Blog {
  _id: string;
  title: string;
  slug: string;
  category: string;
  tags?: string[];
  shortDescription?: string;
  featuredImage?: string;
  featuredImageAlt?: string;
  author: string;
  readTime: number;
  publishedAt?: string;
  createdAt: string;
  views?: number;
  likes?: string[];
  authorUser?: {
    name: string;
    username: string;
    profileImage?: string;
  };
}

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [activeCategory, page]);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3101'}/api/blogs/categories`);
      const data = await res.json();
      if (data.success && Array.isArray(data.categories)) {
        setCategories(data.categories);
      }
    } catch (e) {
      console.error('Failed to fetch categories:', e);
    }
  };

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '9' });
      if (activeCategory !== 'all') params.set('category', activeCategory);
      if (search) params.set('search', search);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3101'}/api/blogs?${params}`);
      const data = await res.json();
      if (data.success) {
        setBlogs(data.blogs || []);
        setTotalPages(data.pages || 1);
      }
    } catch (e) {
      console.error('Failed to fetch blogs:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchBlogs();
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('hi-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-16">
      {/* Devotional Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-600 via-orange-600 to-red-700 text-white p-8 md:p-14 shadow-2xl shadow-orange-500/15 border border-amber-400/30">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-80 h-80 rounded-full bg-amber-400/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur border border-white/25 text-amber-100 text-xs font-black uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            श्री राम ज्ञान धारा एवं आलेख
          </div>
          <h1 className="text-3xl md:text-5xl font-black leading-tight tracking-tight">
            आध्यात्मिक ज्ञान, कथाएं एवं धर्म सूत्र
          </h1>
          <p className="text-orange-100 text-base md:text-lg leading-relaxed font-medium">
            सनातन संस्कृति, मंदिर महिमा, पूजा विधियों और राम नाम की महिमा पर आधारित प्रेरक एवं प्रामाणिक लेख पढ़ें।
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              href="/blogs/create"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-orange-700 hover:bg-orange-50 rounded-2xl text-sm font-black shadow-lg shadow-black/10 transition-all hover:scale-105"
            >
              <PenSquare className="w-4 h-4" /> अपना लेख लिखें (Write Blog)
            </Link>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-400" />
          <input
            type="text"
            placeholder="आलेख या विषय खोजें (Search spiritual articles)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-28 py-3.5 rounded-2xl border-2 border-orange-200/80 bg-white text-slate-800 text-sm focus:border-orange-500 focus:ring-4 focus:ring-orange-200/40 outline-none shadow-sm transition-all"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white rounded-xl text-xs font-bold shadow-md transition-all"
          >
            खोजें
          </button>
        </div>
      </form>

      {/* Categories Filter Tabs */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center">
          {['all', ...categories].map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setPage(1);
              }}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                activeCategory === cat
                  ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white border-orange-500 shadow-md shadow-orange-500/20 scale-105'
                  : 'bg-white text-slate-600 border-orange-100 hover:border-orange-300 hover:bg-orange-50/50'
              }`}
            >
              {cat === 'all' ? 'सभी आलेख (All Posts)' : cat}
            </button>
          ))}
        </div>
      )}

      {/* Blog Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-3xl overflow-hidden border border-orange-100 animate-pulse shadow-sm">
              <div className="aspect-[16/10] bg-orange-100/50" />
              <div className="p-6 space-y-3">
                <div className="h-4 bg-orange-100 rounded w-1/3" />
                <div className="h-6 bg-slate-200 rounded" />
                <div className="h-4 bg-slate-100 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-20 px-4 bg-white rounded-3xl border border-orange-100 shadow-sm max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center mx-auto mb-4 text-3xl">
            🪔
          </div>
          <h3 className="text-xl font-black text-slate-800">कोई आलेख नहीं मिला</h3>
          <p className="text-slate-500 text-sm mt-1">
            {search || activeCategory !== 'all'
              ? 'कृपया अन्य श्रेणी या खोज शब्द का प्रयास करें।'
              : 'पहला लेख लिखने वाले बनें और अन्य भक्तों से साझा करें।'}
          </p>
          <Link
            href="/blogs/create"
            className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all"
          >
            <PenSquare className="w-4 h-4" /> लेख लिखें
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <Link
              key={blog._id}
              href={`/blogs/${blog.slug || blog._id}`}
              className="group bg-white rounded-3xl overflow-hidden border border-orange-100/80 shadow-sm hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 hover:-translate-y-1.5 flex flex-col"
            >
              {/* Thumbnail */}
              <div className="aspect-[16/10] w-full overflow-hidden bg-gradient-to-br from-amber-50 to-orange-100 relative">
                {blog.featuredImage ? (
                  <img
                    src={blog.featuredImage}
                    alt={blog.featuredImageAlt || blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-5xl">
                    📖
                  </div>
                )}
                {/* Category Pill */}
                {blog.category && (
                  <span className="absolute top-3 left-3 text-[10px] font-black uppercase tracking-wider text-orange-800 bg-white/95 backdrop-blur px-3 py-1 rounded-full shadow-sm">
                    {blog.category}
                  </span>
                )}
              </div>

              {/* Body */}
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-3 text-xs text-slate-400 mb-2.5">
                  <span className="flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5 text-orange-500" />
                    {blog.readTime || 1} मिनट पठन
                  </span>
                  <span>•</span>
                  <span>{formatDate(blog.publishedAt || blog.createdAt)}</span>
                </div>

                <h2 className="font-black text-slate-900 text-lg leading-snug mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
                  {blog.title}
                </h2>

                {blog.shortDescription && (
                  <p className="text-slate-500 text-xs line-clamp-2 mb-4 leading-relaxed flex-1">
                    {blog.shortDescription}
                  </p>
                )}

                {/* Footer */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 mt-auto">
                  <span className="font-bold text-slate-700 truncate max-w-[150px]">
                    {blog.authorUser?.name || blog.author || 'श्री राम जी की सेना'}
                  </span>
                  <div className="flex items-center gap-3 text-slate-400 font-medium">
                    {typeof blog.views === 'number' && blog.views > 0 && (
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        {blog.views.toLocaleString()}
                      </span>
                    )}
                    {Array.isArray(blog.likes) && blog.likes.length > 0 && (
                      <span className="flex items-center gap-1 text-red-500">
                        <Heart className="w-3.5 h-3.5 fill-current" />
                        {blog.likes.length}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 pt-4">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
                page === i + 1
                  ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-md shadow-orange-500/20'
                  : 'bg-white text-slate-600 border border-orange-100 hover:border-orange-300'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
