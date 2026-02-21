'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Blog {
  _id: string;
  title: string;
  content: string;
  category: string;
  author: {
    name: string;
    username: string;
  };
  likes: string[];
  comments: any[];
  createdAt: string;
}

export default function BlogsPage() {
  const router = useRouter();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blogs`);
      const data = await res.json();
      
      if (data.success) {
        setBlogs(data.blogs);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching blogs:', error);
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

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📝</div>
          <p className="text-xl text-orange-700">Loading blogs...</p>
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
              <h1 className="text-2xl font-bold">Spiritual Blogs</h1>
            </div>
            <div className="flex gap-3">
              <Link href="/blogs/create" className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg transition">
                ✍️ Write Blog
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
              <p className="text-gray-500 mb-6">Be the first to share your spiritual experience!</p>
              <Link href="/blogs/create" className="inline-block px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold rounded-lg hover:shadow-lg transition">
                Write First Blog
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((blog) => (
                <Link
                  key={blog._id}
                  href={`/blogs/${blog._id}`}
                  className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-orange-200 hover:shadow-2xl transition group"
                >
                  <div className="h-40 bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center text-6xl">
                    📖
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">
                        {blog.category}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDate(blog.createdAt)}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-orange-700 mb-2 group-hover:text-orange-800 transition">
                      {blog.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">
                      {truncateContent(blog.content)}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>By {blog.author.name}</span>
                      <div className="flex gap-3">
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
      </main>
    </div>
  );
}
