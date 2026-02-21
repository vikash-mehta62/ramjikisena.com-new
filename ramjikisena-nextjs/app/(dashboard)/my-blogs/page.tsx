'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Blog {
  _id: string;
  title: string;
  content: string;
  category: string;
  likes: string[];
  comments: any[];
  published: boolean;
  approved: boolean;
  createdAt: string;
}

export default function MyBlogsPage() {
  const router = useRouter();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyBlogs();
  }, []);

  const fetchMyBlogs = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blogs/my/posts`, {
        credentials: 'include',
      });

      if (!res.ok) {
        router.push('/login');
        return;
      }

      const data = await res.json();
      
      if (data.success) {
        setBlogs(data.blogs);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching my blogs:', error);
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const truncateContent = (content: string, maxLength: number = 100) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📝</div>
          <p className="text-xl text-orange-700">Loading your blogs...</p>
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
                <span className="text-2xl">📝</span>
              </div>
              <h1 className="text-2xl font-bold">My Blogs</h1>
            </div>
            <div className="flex gap-3">
              <Link href="/blogs/create" className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg transition">
                ✍️ Write New
              </Link>
              <Link href="/dashboard" className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition">
                ← Back
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {blogs.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center border-2 border-orange-200">
              <div className="text-6xl mb-4">📝</div>
              <h2 className="text-2xl font-bold text-gray-700 mb-2">No blogs yet</h2>
              <p className="text-gray-500 mb-6">Start sharing your spiritual experiences!</p>
              <Link href="/blogs/create" className="inline-block px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold rounded-lg hover:shadow-lg transition">
                Write Your First Blog
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {blogs.map((blog) => (
                <div
                  key={blog._id}
                  className="bg-white rounded-xl shadow-lg p-6 border-2 border-orange-200 hover:shadow-xl transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">
                          {blog.category}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDate(blog.createdAt)}
                        </span>
                        {blog.approved ? (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                            ✅ Approved
                          </span>
                        ) : (
                          <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                            ⏳ Pending Approval
                          </span>
                        )}
                      </div>
                      <h3 className="text-2xl font-bold text-orange-700 mb-2">
                        {blog.title}
                      </h3>
                      <p className="text-gray-600 mb-3">
                        {truncateContent(blog.content)}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>❤️ {blog.likes.length} Likes</span>
                        <span>💬 {blog.comments.length} Comments</span>
                      </div>
                    </div>
                    {blog.approved && (
                      <Link
                        href={`/blogs/${blog._id}`}
                        className="ml-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
                      >
                        View
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
