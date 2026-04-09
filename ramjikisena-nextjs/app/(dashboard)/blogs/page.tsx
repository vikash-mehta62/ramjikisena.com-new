'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Blog {
  _id: string; title: string; content: string; category: string;
  author: { name: string; username: string };
  likes: string[]; comments: any[]; createdAt: string;
}

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blogs`)
      .then(r => r.json())
      .then(d => { if (d.success) setBlogs(d.blogs); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  const truncate = (s: string, n = 120) => s.length <= n ? s : s.slice(0, n) + '...';

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl space-y-6">

      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Spiritual Blogs</h1>
          <p className="text-slate-500 text-sm mt-1">Spiritual experiences padhein aur share karein</p>
        </div>
        <Link
          href="/blogs/create"
          className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold rounded-xl text-sm hover:shadow-lg transition-all"
        >
          ✍️ Write Blog
        </Link>
      </div>

      {/* Blogs Grid */}
      {blogs.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border-2 border-orange-100">
          <div className="text-5xl mb-3">📝</div>
          <h2 className="text-lg font-black text-slate-700 mb-2">No blogs yet</h2>
          <p className="text-slate-500 text-sm mb-5">Pehle blog likhne wale banein!</p>
          <Link href="/blogs/create"
            className="inline-block px-6 py-2.5 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold rounded-xl text-sm hover:shadow-lg transition-all">
            Write First Blog
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {blogs.map(blog => (
            <Link
              key={blog._id}
              href={`/blogs/${blog._id}`}
              className="bg-white rounded-2xl shadow-sm border-2 border-orange-100 hover:border-orange-300 hover:shadow-md transition-all group overflow-hidden"
            >
              <div className="h-32 bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center text-5xl">
                📖
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-lg font-bold">
                    {blog.category}
                  </span>
                  <span className="text-xs text-slate-400">{formatDate(blog.createdAt)}</span>
                </div>
                <h3 className="font-black text-slate-800 mb-1.5 group-hover:text-orange-600 transition-colors line-clamp-2">
                  {blog.title}
                </h3>
                <p className="text-slate-500 text-xs mb-3 line-clamp-2">{truncate(blog.content)}</p>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold">{blog.author.name}</span>
                  <div className="flex gap-2">
                    <span>❤️ {blog.likes.length}</span>
                    <span>💬 {blog.comments.length}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
