'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Clock, User, Tag, ChevronRight, ArrowLeft,
  ChevronDown, Heart, MessageCircle, Share2, Eye,
  Sparkles, CheckCircle2, Bookmark
} from 'lucide-react';

interface BlogDetail {
  _id: string;
  title: string;
  slug: string;
  category: string;
  tags?: string[];
  shortDescription?: string;
  content: string;
  author: string;
  authorUser?: {
    name: string;
    username: string;
    profileImage?: string;
  };
  featuredImage?: string;
  featuredImageAlt?: string;
  readTime: number;
  publishedAt?: string;
  createdAt: string;
  views: number;
  likes: string[];
  comments: Array<{
    _id?: string;
    user?: {
      name: string;
      username: string;
      profileImage?: string;
    };
    text: string;
    createdAt: string;
  }>;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
  };
  schemaMarkup?: {
    article?: boolean;
    faqPage?: boolean;
    breadcrumb?: boolean;
  };
  faqs?: Array<{ question: string; answer: string }>;
}

export default function SingleBlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slugOrId = (params?.id as string) || '';

  const [blog, setBlog] = useState<BlogDetail | null>(null);
  const [related, setRelated] = useState<BlogDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [liking, setLiking] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (slugOrId) {
      fetchBlog();
    }
  }, [slugOrId]);

  const fetchBlog = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3101'}/api/blogs/${slugOrId}`);
      const data = await res.json();
      if (data.success && data.blog) {
        setBlog(data.blog);
        // Fetch related articles from same category
        if (data.blog.category) {
          fetchRelated(data.blog.category, data.blog.slug || data.blog._id);
        }
      }
    } catch (e) {
      console.error('Fetch blog error:', e);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelated = async (category: string, currentId: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3101'}/api/blogs?category=${encodeURIComponent(
          category
        )}&limit=4`
      );
      const data = await res.json();
      if (data.success && Array.isArray(data.blogs)) {
        setRelated(data.blogs.filter((b: any) => b.slug !== currentId && b._id !== currentId).slice(0, 3));
      }
    } catch (e) {
      console.error('Fetch related blogs error:', e);
    }
  };

  const handleLike = async () => {
    if (!blog || liking) return;
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to like this blog post.');
      return;
    }

    setLiking(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3101'}/api/blogs/${blog._id}/like`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setBlog((p) => {
          if (!p) return null;
          const userObj = JSON.parse(localStorage.getItem('user') || '{}');
          const uid = userObj._id || 'temp';
          const newLikes = data.liked
            ? [...p.likes, uid]
            : p.likes.filter((id) => id !== uid);
          return { ...p, likes: newLikes };
        });
      }
    } catch (e) {
      console.error('Like error:', e);
    } finally {
      setLiking(false);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blog || !commentText.trim() || submittingComment) return;

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to leave a comment.');
      return;
    }

    setSubmittingComment(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3101'}/api/blogs/${blog._id}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: commentText }),
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.comments)) {
        setBlog((p) => (p ? { ...p, comments: data.comments } : null));
        setCommentText('');
      } else {
        alert(data.message || 'Failed to post comment');
      }
    } catch (e) {
      console.error('Comment error:', e);
      alert('Failed to post comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-bold text-slate-600">आलेख लोड हो रहा है...</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="text-center py-24 px-4 bg-white rounded-3xl border border-orange-100 shadow-sm max-w-lg mx-auto my-12">
        <div className="w-16 h-16 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center mx-auto mb-4 text-3xl">
          📖
        </div>
        <h2 className="text-2xl font-black text-slate-800">आलेख नहीं मिला (Blog Not Found)</h2>
        <p className="text-slate-500 text-sm mt-2 mb-6">
          यह आलेख उपलब्ध नहीं है या इसे हटा दिया गया है।
        </p>
        <Link
          href="/blogs"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> सभी आलेखों पर जाएं
        </Link>
      </div>
    );
  }

  // Schema Markup (JSON-LD)
  const schemas: any[] = [];
  if (blog.schemaMarkup?.article) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: blog.seo?.metaTitle || blog.title,
      description: blog.seo?.metaDescription || blog.shortDescription,
      image: blog.featuredImage,
      author: {
        '@type': 'Person',
        name: blog.authorUser?.name || blog.author || 'श्री राम जी की सेना',
      },
      datePublished: blog.publishedAt || blog.createdAt,
      dateModified: blog.publishedAt || blog.createdAt,
    });
  }

  if (blog.schemaMarkup?.faqPage && blog.faqs && blog.faqs.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: blog.faqs.map((f) => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: { '@type': 'Answer', text: f.answer },
      })),
    });
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Structured Data Script Tags */}
      {schemas.map((s, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}
        />
      ))}

      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-slate-400 flex-wrap">
        <Link href="/" className="hover:text-orange-600 transition-colors">
          मुख्य पृष्ठ (Home)
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/blogs" className="hover:text-orange-600 transition-colors">
          आध्यात्मिक ब्लॉग्स
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-700 font-bold truncate max-w-[240px]">{blog.title}</span>
      </nav>

      {/* Article Header */}
      <div className="bg-white rounded-3xl p-6 md:p-10 border border-orange-100/80 shadow-sm space-y-6">
        {/* Category Pill */}
        {blog.category && (
          <span className="inline-block px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-orange-100 text-orange-800">
            {blog.category}
          </span>
        )}

        {/* Title */}
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">
          {blog.title}
        </h1>

        {/* Short Summary */}
        {blog.shortDescription && (
          <p className="text-slate-600 text-base md:text-lg leading-relaxed border-l-4 border-orange-500 pl-4 bg-orange-50/40 py-2 rounded-r-xl">
            {blog.shortDescription}
          </p>
        )}

        {/* Meta Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 text-white font-bold flex items-center justify-center text-sm shadow-sm overflow-hidden">
              {blog.authorUser?.profileImage ? (
                <img src={blog.authorUser.profileImage} alt="" className="w-full h-full object-cover" />
              ) : (
                '🚩'
              )}
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm">
                {blog.authorUser?.name || blog.author || 'श्री राम जी की सेना'}
              </p>
              <div className="flex items-center gap-2 text-slate-400">
                <span>
                  {new Date(blog.publishedAt || blog.createdAt).toLocaleDateString('hi-IN', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-orange-500" />
                  {blog.readTime || 1} मिनट पठन
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-orange-50 text-slate-600 hover:text-orange-600 text-xs font-bold border border-slate-200 transition-all"
            >
              <Share2 className="w-3.5 h-3.5" />
              {copied ? 'कॉपी हो गया!' : 'शेयर करें'}
            </button>
            <button
              onClick={handleLike}
              disabled={liking}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-black border border-red-200 transition-all"
            >
              <Heart className="w-3.5 h-3.5 fill-current" />
              {blog.likes?.length || 0} Likes
            </button>
          </div>
        </div>
      </div>

      {/* Featured Image */}
      {blog.featuredImage && (
        <div className="rounded-3xl overflow-hidden shadow-lg border border-orange-100/80 bg-slate-100">
          <img
            src={blog.featuredImage}
            alt={blog.featuredImageAlt || blog.title}
            className="w-full max-h-[500px] object-cover mx-auto"
          />
        </div>
      )}

      {/* Article Content */}
      <article className="bg-white rounded-3xl p-6 md:p-12 border border-orange-100/80 shadow-sm">
        <div
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </article>

      {/* Tags */}
      {blog.tags && blog.tags.length > 0 && (
        <div className="bg-white rounded-3xl p-6 border border-orange-100/80 shadow-sm flex items-center gap-2 flex-wrap">
          <Tag className="w-4 h-4 text-orange-500 mr-1" />
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2">टैग:</span>
          {blog.tags.map((t) => (
            <span
              key={t}
              className="px-3 py-1 rounded-full text-xs font-bold bg-orange-50 text-orange-800 border border-orange-200"
            >
              #{t}
            </span>
          ))}
        </div>
      )}

      {/* Interactive FAQ Accordion */}
      {blog.faqs && blog.faqs.length > 0 && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-orange-100/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">❓</span>
            <h2 className="text-xl md:text-2xl font-black text-slate-900">
              अक्सर पूछे जाने वाले प्रश्न (FAQ)
            </h2>
          </div>

          <div className="space-y-3 pt-2">
            {blog.faqs.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div
                  key={i}
                  className="border border-orange-100 rounded-2xl overflow-hidden transition-all bg-orange-50/20"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full flex items-center justify-between p-4 text-left font-bold text-slate-900 text-sm hover:bg-orange-50/60 transition-colors"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-orange-500 transition-transform ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="p-4 pt-0 text-xs md:text-sm text-slate-600 leading-relaxed border-t border-orange-100/50 bg-white">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Related Articles */}
      {related.length > 0 && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-orange-500" /> संबंधित आलेख (Related Articles)
            </h3>
            <Link href="/blogs" className="text-xs font-bold text-orange-600 hover:underline">
              सभी देखें →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {related.map((r) => (
              <Link
                key={r._id}
                href={`/blogs/${r.slug || r._id}`}
                className="group bg-white rounded-2xl overflow-hidden border border-orange-100 p-4 shadow-sm hover:shadow-md transition-all flex flex-col"
              >
                {r.featuredImage ? (
                  <div className="aspect-[16/10] w-full rounded-xl overflow-hidden mb-3 bg-slate-100">
                    <img
                      src={r.featuredImage}
                      alt={r.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ) : (
                  <div className="aspect-[16/10] w-full rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center text-3xl mb-3">
                    📖
                  </div>
                )}
                <p className="font-bold text-slate-900 text-sm line-clamp-2 group-hover:text-orange-600 transition-colors mb-2">
                  {r.title}
                </p>
                <div className="mt-auto text-[11px] text-slate-400 flex items-center justify-between">
                  <span>{r.readTime || 1} मिनट</span>
                  <span>{r.category}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Devotee Comments Section */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-orange-100/80 shadow-sm space-y-6">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-orange-500" />
          <h3 className="text-xl font-black text-slate-900">
            भक्त टिप्पणियाँ (Comments) ({blog.comments?.length || 0})
          </h3>
        </div>

        {/* Add Comment */}
        <form onSubmit={handleComment} className="space-y-3">
          <textarea
            rows={3}
            placeholder="इस आलेख पर अपनी प्रतिक्रिया या विचार व्यक्त करें (Write a comment)..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="w-full p-4 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-orange-400 outline-none bg-slate-50/50"
          />
          <button
            type="submit"
            disabled={submittingComment || !commentText.trim()}
            className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white rounded-xl text-xs font-bold shadow-md disabled:opacity-50 transition-all"
          >
            {submittingComment ? 'पोस्ट हो रहा है...' : 'टिप्पणी भेजें'}
          </button>
        </form>

        {/* Comments List */}
        <div className="space-y-3 pt-2">
          {(!blog.comments || blog.comments.length === 0) ? (
            <p className="text-slate-400 text-xs italic text-center py-4">
              अभी कोई टिप्पणी नहीं है। पहली प्रतिक्रिया देने वाले बनें!
            </p>
          ) : (
            blog.comments.map((c, i) => (
              <div key={i} className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">
                    {c.user?.name || 'भक्त'}
                  </span>
                  <span className="text-slate-400 text-[11px]">
                    {new Date(c.createdAt).toLocaleDateString('hi-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <p className="text-xs md:text-sm text-slate-600 leading-relaxed">{c.text}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Back Button */}
      <div className="text-center pt-4">
        <Link
          href="/blogs"
          className="inline-flex items-center gap-2 text-sm font-bold text-orange-600 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> सभी आलेखों पर वापस जाएं (Back to Blogs)
        </Link>
      </div>
    </div>
  );
}
