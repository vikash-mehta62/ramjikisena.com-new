'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

interface Blog {
  _id: string;
  title: string;
  content: string;
  category: string;
  author: {
    name: string;
    username: string;
    city: string;
  };
  createdAt: string;
  likes: string[];
  comments: any[];
}

export default function PendingBlogs() {
  const router = useRouter();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchPendingBlogs();
  }, []);

  const fetchPendingBlogs = async () => {
    try {
      const response = await api.get('/api/admin/blogs/pending');
      if (response.data.success) {
        setBlogs(response.data.blogs);
      }
    } catch (error: any) {
      console.error('Error fetching blogs:', error);
      if (error.response?.status === 403) {
        alert('Admin access required');
        router.push('/dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (blogId: string) => {
    if (!confirm('Are you sure you want to approve this blog?')) return;

    setProcessing(true);
    try {
      const response = await api.post(`/api/admin/blogs/${blogId}/approve`);
      if (response.data.success) {
        alert('Blog approved successfully!');
        setBlogs(blogs.filter(b => b._id !== blogId));
        setSelectedBlog(null);
      }
    } catch (error) {
      console.error('Error approving blog:', error);
      alert('Failed to approve blog');
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async (blogId: string) => {
    if (!confirm('Are you sure you want to reject and delete this blog? This action cannot be undone.')) return;

    setProcessing(true);
    try {
      const response = await api.post(`/api/admin/blogs/${blogId}/reject`);
      if (response.data.success) {
        alert('Blog rejected and deleted successfully');
        setBlogs(blogs.filter(b => b._id !== blogId));
        setSelectedBlog(null);
      }
    } catch (error) {
      console.error('Error rejecting blog:', error);
      alert('Failed to reject blog');
    } finally {
      setProcessing(false);
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
      {/* Header with Gradient */}
      <div className="mb-8 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
            <span className="text-4xl">📝</span>
          </div>
          <div>
            <h1 className="text-4xl font-bold mb-2">Pending Blogs</h1>
            <p className="text-yellow-100">Review and approve user-submitted blogs</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-xl p-6 mb-6 shadow-lg">
        <div className="flex items-center gap-3">
          <span className="text-4xl">⏳</span>
          <p className="text-yellow-800 text-lg">
            <span className="font-bold text-2xl">{blogs.length}</span> blog{blogs.length !== 1 ? 's' : ''} waiting for approval
          </p>
        </div>
      </div>

      {blogs.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center border-2 border-green-200">
          <span className="text-8xl mb-4 block">✅</span>
          <h3 className="text-3xl font-bold text-green-600 mb-3">All Caught Up!</h3>
          <p className="text-gray-600 text-lg">No pending blogs to review at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Blog List */}
          <div className="space-y-4">
            {blogs.map((blog) => (
              <div
                key={blog._id}
                className={`bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition ${
                  selectedBlog?._id === blog._id ? 'ring-2 ring-orange-500' : ''
                }`}
                onClick={() => setSelectedBlog(blog)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800 mb-1">{blog.title}</h3>
                    <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                      {blog.category}
                    </span>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{blog.content}</p>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-500">
                    <span className="mr-4">👤 {blog.author.name}</span>
                    <span>📍 {blog.author.city}</span>
                  </div>
                  <span className="text-gray-400">
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Blog Preview & Actions */}
          <div className="lg:sticky lg:top-8 h-fit">
            {selectedBlog ? (
              <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-orange-200">
                <h2 className="text-3xl font-bold text-orange-600 mb-6 flex items-center gap-2">
                  <span>👁️</span> Blog Preview
                </h2>

                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">{selectedBlog.title}</h3>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full">
                      {selectedBlog.category}
                    </span>
                    <span className="text-gray-500 text-sm">
                      {new Date(selectedBlog.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-xl mb-4 border-2 border-orange-200">
                    <p className="text-sm text-orange-600 font-semibold mb-2">✍️ Author</p>
                    <p className="font-bold text-lg text-gray-800">{selectedBlog.author.name}</p>
                    <p className="text-sm text-gray-600">@{selectedBlog.author.username}</p>
                    <p className="text-sm text-gray-600">📍 {selectedBlog.author.city}</p>
                  </div>

                  <div className="prose max-w-none">
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedBlog.content}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={() => handleApprove(selectedBlog._id)}
                    disabled={processing}
                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {processing ? '⏳ Processing...' : '✅ Approve Blog'}
                  </button>
                  <button
                    onClick={() => handleReject(selectedBlog._id)}
                    disabled={processing}
                    className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {processing ? '⏳ Processing...' : '❌ Reject Blog'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-xl p-12 text-center border-2 border-orange-200">
                <span className="text-8xl mb-4 block">👈</span>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Select a Blog</h3>
                <p className="text-gray-600">Click on a blog from the list to preview and review</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
