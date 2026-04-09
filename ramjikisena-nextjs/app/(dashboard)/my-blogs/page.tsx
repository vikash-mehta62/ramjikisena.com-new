'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Blog {
  _id: string; title: string; content: string; category: string;
  likes: string[]; comments: any[]; published: boolean; approved: boolean; createdAt: string;
}

export default function MyBlogsPage() {
  const router = useRouter();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blogs/my/posts`, {
      headers: { 'Authorization': `Bearer ${token}` },
      credentials: 'include',
    })
      .then(r => { if (r.status === 401) { router.push('/login'); return null; } return r.json(); })
      .then(d => { if (d?.success) setBlogs(d.blogs); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  const truncate = (s: string, n = 100) => s.length <= n ? s : s.slice(0, n) + '...';

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
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900">My Blogs</h1>
          <p className="text-slate-500 text-sm mt-1">Apne likhe blogs manage karein</p>
        </div>
        <Link
          href="/blogs/create"
          className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold rounded-xl text-sm hover:shadow-lg transition-all"
        >
          ✍️ Write New
        </Link>
      </div>

      {/* Blogs */}
      {blogs.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border-2 border-orange-100">
          <div className="text-5xl mb-3">📝</div>
          <h2 className="text-lg font-black text-slate-700 mb-2">No blogs yet</h2>
          <p className="text-slate-500 text-sm mb-5">Apna pehla spiritual blog likhein!</p>
          <Link href="/blogs/create"
            className="inline-block px-6 py-2.5 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold rounded-xl text-sm hover:shadow-lg transition-all">
            Write Your First Blog
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {blogs.map(blog => (
            <div key={blog._id} className="bg-white rounded-2xl p-5 shadow-sm border-2 border-orange-100 hover:border-orange-300 transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-lg font-bold">
                      {blog.category}
                    </span>
                    <span className="text-xs text-slate-400">{formatDate(blog.createdAt)}</span>
                    {blog.approved ? (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-lg font-bold">✅ Approved</span>
                    ) : (
                      <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-lg font-bold">⏳ Pending</span>
                    )}
                  </div>
                  <h3 className="font-black text-slate-800 mb-1.5">{blog.title}</h3>
                  <p className="text-slate-500 text-sm mb-3">{truncate(blog.content)}</p>
                  <div className="flex gap-4 text-sm text-slate-400">
                    <span>❤️ {blog.likes.length}</span>
                    <span>💬 {blog.comments.length}</span>
                  </div>
                </div>
                {blog.approved && (
                  <Link href={`/blogs/${blog._id}`}
                    className="px-4 py-2 bg-orange-500 text-white rounded-xl font-bold text-sm hover:bg-orange-600 transition-colors flex-shrink-0">
                    View
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
