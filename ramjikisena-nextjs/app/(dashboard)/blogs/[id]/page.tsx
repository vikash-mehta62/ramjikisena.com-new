'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

interface Blog {
  _id: string;
  title: string;
  content: string;
  category: string;
  author: {
    _id: string;
    name: string;
    username: string;
  };
  likes: string[];
  comments: Array<{
    _id: string;
    user: {
      name: string;
      username: string;
    };
    text: string;
    createdAt: string;
  }>;
  createdAt: string;
}

export default function BlogDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [commenting, setCommenting] = useState(false);
  const [liking, setLiking] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchBlog();
    }
  }, [params.id]);

  const fetchBlog = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blogs/${params.id}`);
      const data = await res.json();
      
      if (data.success) {
        setBlog(data.blog);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching blog:', error);
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (liking) return;
    setLiking(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blogs/${params.id}/like`, {
        method: 'POST',
        credentials: 'include',
      });

      const data = await res.json();

      if (data.success) {
        fetchBlog(); // Refresh blog data
      }
    } catch (error) {
      console.error('Error liking blog:', error);
    } finally {
      setLiking(false);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || commenting) return;

    setCommenting(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blogs/${params.id}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ text: commentText }),
      });

      const data = await res.json();

      if (data.success) {
        setCommentText('');
        fetchBlog(); // Refresh blog data
      }
    } catch (error) {
      console.error('Error commenting:', error);
    } finally {
      setCommenting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📖</div>
          <p className="text-xl text-orange-700">Loading blog...</p>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <p className="text-xl text-gray-700">Blog not found</p>
          <Link href="/blogs" className="mt-4 inline-block text-orange-600 hover:text-orange-700">
            ← Back to Blogs
          </Link>
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
                <span className="text-2xl">📖</span>
              </div>
              <h1 className="text-2xl font-bold">Blog</h1>
            </div>
            <Link href="/blogs" className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition">
              ← Back
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Blog Content */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-orange-200">
            {/* Category & Date */}
            <div className="flex items-center justify-between mb-4">
              <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                {blog.category}
              </span>
              <span className="text-gray-500 text-sm">
                {formatDate(blog.createdAt)}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold text-orange-700 mb-4">
              {blog.title}
            </h1>

            {/* Author */}
            <div className="flex items-center gap-3 mb-6 pb-6 border-b">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-2xl">
                👤
              </div>
              <div>
                <p className="font-semibold text-gray-800">{blog.author.name}</p>
                <p className="text-sm text-gray-500">@{blog.author.username}</p>
              </div>
            </div>

            {/* Content */}
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-lg">
                {blog.content}
              </p>
            </div>

            {/* Like Button */}
            <div className="mt-8 pt-6 border-t">
              <button
                onClick={handleLike}
                disabled={liking}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-lg hover:shadow-lg transition disabled:opacity-50"
              >
                <span className="text-2xl">❤️</span>
                <span className="font-semibold">{blog.likes.length} Likes</span>
              </button>
            </div>
          </div>

          {/* Comments Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-orange-200">
            <h2 className="text-2xl font-bold text-orange-700 mb-6">
              💬 Comments ({blog.comments.length})
            </h2>

            {/* Add Comment Form */}
            <form onSubmit={handleComment} className="mb-6">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                rows={3}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none mb-3"
              />
              <button
                type="submit"
                disabled={commenting || !commentText.trim()}
                className="px-6 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50"
              >
                {commenting ? 'Posting...' : 'Post Comment'}
              </button>
            </form>

            {/* Comments List */}
            <div className="space-y-4">
              {blog.comments.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No comments yet. Be the first to comment!</p>
              ) : (
                blog.comments.map((comment) => (
                  <div key={comment._id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                        👤
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-semibold text-gray-800">{comment.user.name}</p>
                          <span className="text-xs text-gray-500">
                            {formatDate(comment.createdAt)}
                          </span>
                        </div>
                        <p className="text-gray-700">{comment.text}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
