'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import { BookOpen, User, MapPin, Heart, MessageCircle, Eye, Trash2, CheckCircle, Clock, Calendar } from 'lucide-react';

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
  approved: boolean;
  likes: string[];
  comments: any[];
}

export default function AllBlogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'approved' | 'pending'>('all');

  useEffect(() => {
    fetchBlogs();
  }, [filter]);

  const fetchBlogs = async () => {
    try {
      let url = '/api/admin/blogs';
      if (filter === 'approved') url += '?status=approved';
      if (filter === 'pending') url += '?status=pending';

      const response = await api.get(url);
      const data = await response.json();
      if (data.success) {
        setBlogs(data.blogs);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (blogId: string) => {
    if (!confirm('Are you sure you want to delete this blog? This action cannot be undone.')) return;

    try {
      const response = await api.delete(`/api/admin/blogs/${blogId}`);
      const data = await response.json();
      if (data.success) {
        alert('Blog deleted successfully');
        setBlogs(blogs.filter(b => b._id !== blogId));
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
      alert('Failed to delete blog');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  const filteredBlogs = blogs;
  const approvedCount = blogs.filter(b => b.approved).length;
  const pendingCount = blogs.filter(b => !b.approved).length;

  return (
    <div>
      {/* Header with Gradient */}
      <div className="mb-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-purple-600" />
          </div>
          <div>
            <h1 className="text-4xl font-bold mb-2">All Blogs</h1>
            <p className="text-purple-100">Manage all blogs on the platform</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-2xl shadow-xl p-3 mb-6 flex gap-3 border-2 border-purple-100">
        <button
          onClick={() => setFilter('all')}
          className={`flex-1 py-3 px-6 rounded-xl font-bold text-lg transition-all ${
            filter === 'all'
              ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg scale-105'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          All ({blogs.length})
        </button>
        <button
          onClick={() => setFilter('approved')}
          className={`flex-1 py-3 px-6 rounded-xl font-bold text-lg transition-all ${
            filter === 'approved'
              ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg scale-105'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Approved ({approvedCount})
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`flex-1 py-3 px-6 rounded-xl font-bold text-lg transition-all ${
            filter === 'pending'
              ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg scale-105'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Pending ({pendingCount})
        </button>
      </div>

      {/* Blogs List */}
      {filteredBlogs.length === 0 ? (
        <div className="p-12 text-center border-2 border-purple-200">
          <BookOpen className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <h3 className="text-3xl font-bold text-gray-800 mb-3">No Blogs Found</h3>
          <p className="text-gray-600 text-lg">No blogs match the selected filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredBlogs.map((blog) => (
            <div key={blog._id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl hover:scale-105 transition-all border-2 border-purple-100">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-800">{blog.title}</h3>
                    {blog.approved ? (
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                        ✅ Approved
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                        ⏳ Pending
                      </span>
                    )}
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                      {blog.category}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{blog.content}</p>

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><User className="w-3 h-3" /> {blog.author.name} (@{blog.author.username})</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {blog.author.city}</span>
                    <span className="flex items-center gap-1"><Heart className="w-3 h-3" /> {blog.likes.length}</span>
                    <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" /> {blog.comments.length}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(blog.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex gap-3 ml-4">
                  {blog.approved && (
                    <Link
                      href={`/blogs/${blog._id}`}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all text-sm font-semibold"
                    >
                      <Eye className="w-4 h-4" /> View
                    </Link>
                  )}
                  <button
                    onClick={() => handleDelete(blog._id)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all text-sm font-semibold"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
