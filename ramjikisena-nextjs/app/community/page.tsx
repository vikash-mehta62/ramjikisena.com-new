'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Heart, MessageCircle, Share2, MoreHorizontal, Send, Image as ImageIcon, X, MapPin, Filter, Users, Globe, Flag, Loader2, Trash2, AlertTriangle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import ImageUploader from '@/components/ImageUploader';
import api from '@/lib/api';

// ── Types ────────────────────────────────────────────────────────────────────
interface Author { _id: string; name: string; username: string; city: string; profileImage?: string; }
interface Comment { _id: string; user: Author; text: string; createdAt: string; }
interface Post {
  _id: string; author: Author; text: string; images: string[];
  category: string; city: string; state: string;
  likesCount: number; commentsCount: number; sharesCount: number;
  isLiked: boolean; isFollowing: boolean;
  comments: Comment[]; createdAt: string;
}

const CATEGORIES = ['General', 'Pooja', 'Katha', 'Bhandara', 'Bhajan', 'Temple'];
const CAT_EMOJI: Record<string, string> = { General: '🙏', Pooja: '🪔', Katha: '📖', Bhandara: '🍛', Bhajan: '🎵', Temple: '🛕' };

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

// ── Avatar ───────────────────────────────────────────────────────────────────
function Avatar({ user, size = 'md' }: { user: Author; size?: 'sm' | 'md' | 'lg' }) {
  const s = size === 'sm' ? 'w-8 h-8 text-sm' : size === 'lg' ? 'w-14 h-14 text-xl' : 'w-10 h-10 text-base';
  return user.profileImage ? (
    <img src={user.profileImage} alt={user.name} className={`${s} rounded-full object-cover flex-shrink-0`} />
  ) : (
    <div className={`${s} rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-bold flex-shrink-0`}>
      {user.name[0].toUpperCase()}
    </div>
  );
}

// ── Create Post Box ───────────────────────────────────────────────────────────
function CreatePost({ currentUser, onPost }: { currentUser: any; onPost: (p: Post) => void }) {
  const [text, setText] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [category, setCategory] = useState('General');
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [posting, setPosting] = useState(false);

  const submit = async () => {
    if (!text.trim() && images.length === 0) return;
    setPosting(true);
    try {
      const res = await api.post('/api/community/posts', { text, images, category });
      const data = await res.json();
      if (data.success) {
        onPost(data.post);
        setText(''); setImages([]); setCategory('General'); setShowImageUpload(false);
      }
    } catch (e) { console.error(e); }
    finally { setPosting(false); }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-orange-100 p-5 mb-4">
      <div className="flex gap-3">
        <Avatar user={currentUser} size="md" />
        <div className="flex-1">
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="🙏 अपना अनुभव साझा करें... (Share your spiritual experience)"
            rows={3}
            className="w-full resize-none border-2 border-gray-100 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-orange-400 transition-colors text-sm"
          />

          {/* Category pills */}
          <div className="flex gap-2 mt-2 flex-wrap">
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setCategory(c)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${category === c ? 'bg-orange-600 text-white' : 'bg-orange-50 text-orange-700 hover:bg-orange-100'}`}>
                {CAT_EMOJI[c]} {c}
              </button>
            ))}
          </div>

          {/* Image upload toggle */}
          {showImageUpload && (
            <div className="mt-3">
              <ImageUploader value={images} onChange={v => setImages(v as string[])} multiple folder="community" label="" />
            </div>
          )}

          <div className="flex items-center justify-between mt-3">
            <button onClick={() => setShowImageUpload(!showImageUpload)}
              className={`flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-lg transition-all ${showImageUpload ? 'bg-orange-100 text-orange-700' : 'text-gray-500 hover:bg-gray-100'}`}>
              <ImageIcon className="w-4 h-4" />
              {images.length > 0 ? `${images.length} photo${images.length > 1 ? 's' : ''}` : 'Photo'}
            </button>
            <button onClick={submit} disabled={posting || (!text.trim() && images.length === 0)}
              className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-red-600 text-white px-5 py-2 rounded-xl font-bold text-sm hover:shadow-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed">
              {posting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Single Post Card ──────────────────────────────────────────────────────────
function PostCard({ post, currentUserId, onUpdate, onDelete }: {
  post: Post; currentUserId: string;
  onUpdate: (id: string, changes: Partial<Post>) => void;
  onDelete: (id: string) => void;
}) {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commenting, setCommenting] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (menuRef.current && !menuRef.current.contains(e.target as Node)) setShowMenu(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLike = async () => {
    onUpdate(post._id, { isLiked: !post.isLiked, likesCount: post.isLiked ? post.likesCount - 1 : post.likesCount + 1 });
    try { await api.post(`/api/community/posts/${post._id}/like`); }
    catch { onUpdate(post._id, { isLiked: post.isLiked, likesCount: post.likesCount }); }
  };

  const handleFollow = async () => {
    onUpdate(post._id, { isFollowing: !post.isFollowing });
    try { await api.post(`/api/community/follow/${post.author._id}`); }
    catch { onUpdate(post._id, { isFollowing: post.isFollowing }); }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/community#${post._id}`;
    try { await navigator.clipboard.writeText(url); alert('Link copied!'); }
    catch { alert(url); }
    await api.post(`/api/community/posts/${post._id}/share`);
    onUpdate(post._id, { sharesCount: post.sharesCount + 1 });
  };

  const handleComment = async () => {
    if (!commentText.trim()) return;
    setCommenting(true);
    try {
      const res = await api.post(`/api/community/posts/${post._id}/comment`, { text: commentText });
      const data = await res.json();
      if (data.success) {
        onUpdate(post._id, { comments: [...post.comments, data.comment], commentsCount: data.commentsCount });
        setCommentText('');
      }
    } catch (e) { console.error(e); }
    finally { setCommenting(false); }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const res = await api.delete(`/api/community/posts/${post._id}/comment/${commentId}`);
      const data = await res.json();
      if (data.success) {
        onUpdate(post._id, { comments: post.comments.filter(c => c._id !== commentId), commentsCount: data.commentsCount });
      }
    } catch (e) { console.error(e); }
  };

  const handleReport = async () => {
    setShowMenu(false);
    if (!confirm('Report this post?')) return;
    await api.post(`/api/community/posts/${post._id}/report`);
    alert('Post reported. Thank you!');
  };

  const handleDelete = async () => {
    setShowMenu(false);
    if (!confirm('Delete this post?')) return;
    try {
      const res = await api.delete(`/api/community/posts/${post._id}`);
      const data = await res.json();
      if (data.success) onDelete(post._id);
    } catch (e) { console.error(e); }
  };

  const isOwn = post.author._id === currentUserId;

  return (
    <div id={post._id} className="bg-white rounded-2xl shadow-md border border-orange-100 overflow-hidden mb-4 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between p-4 pb-3">
        <div className="flex items-center gap-3">
          <Link href={`/community/${post.author.username}`}>
            <Avatar user={post.author} />
          </Link>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <Link href={`/community/${post.author.username}`} className="font-bold text-gray-900 text-sm hover:text-orange-600 transition-colors">{post.author.name}</Link>
              <span className="text-gray-400 text-xs">@{post.author.username}</span>
              {post.author.city && (
                <span className="flex items-center gap-0.5 text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                  <MapPin className="w-3 h-3" />{post.author.city}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-gray-400">{timeAgo(post.createdAt)}</span>
              <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-medium">
                {CAT_EMOJI[post.category]} {post.category}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isOwn && (
            <button onClick={handleFollow}
              className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all ${post.isFollowing ? 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600' : 'bg-orange-600 text-white hover:bg-orange-700'}`}>
              {post.isFollowing ? 'Following' : '+ Follow'}
            </button>
          )}
          <div className="relative" ref={menuRef}>
            <button onClick={() => setShowMenu(!showMenu)} className="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
              <MoreHorizontal className="w-4 h-4 text-gray-500" />
            </button>
            {showMenu && (
              <div className="absolute right-0 top-8 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-20 w-40">
                {isOwn ? (
                  <button onClick={handleDelete} className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                    <Trash2 className="w-4 h-4" /> Delete Post
                  </button>
                ) : (
                  <button onClick={handleReport} className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    <AlertTriangle className="w-4 h-4" /> Report
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Text */}
      {post.text && <p className="px-4 pb-3 text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">{post.text}</p>}

      {/* Images */}
      {post.images.length > 0 && (
        <div className="relative">
          <img src={post.images[imgIdx]} alt="post" className="w-full max-h-96 object-cover" />
          {post.images.length > 1 && (
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
              {post.images.map((_, i) => (
                <button key={i} onClick={() => setImgIdx(i)}
                  className={`w-2 h-2 rounded-full transition-all ${i === imgIdx ? 'bg-white scale-125' : 'bg-white/60'}`} />
              ))}
            </div>
          )}
          {post.images.length > 1 && imgIdx < post.images.length - 1 && (
            <button onClick={() => setImgIdx(i => i + 1)} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 text-white rounded-full flex items-center justify-center hover:bg-black/60">›</button>
          )}
          {post.images.length > 1 && imgIdx > 0 && (
            <button onClick={() => setImgIdx(i => i - 1)} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 text-white rounded-full flex items-center justify-center hover:bg-black/60">‹</button>
          )}
        </div>
      )}

      {/* Action Bar */}
      <div className="px-4 py-3 flex items-center gap-1 border-t border-gray-50">
        <button onClick={handleLike}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-105 ${post.isLiked ? 'text-red-500 bg-red-50' : 'text-gray-500 hover:bg-gray-100'}`}>
          <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-red-500' : ''}`} />
          {post.likesCount > 0 && <span>{post.likesCount}</span>}
        </button>
        <button onClick={() => setShowComments(!showComments)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${showComments ? 'text-orange-600 bg-orange-50' : 'text-gray-500 hover:bg-gray-100'}`}>
          <MessageCircle className="w-4 h-4" />
          {post.commentsCount > 0 && <span>{post.commentsCount}</span>}
        </button>
        <button onClick={handleShare}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-100 transition-all">
          <Share2 className="w-4 h-4" />
          {post.sharesCount > 0 && <span>{post.sharesCount}</span>}
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="border-t border-gray-100 px-4 py-3 space-y-3">
          {post.comments.length === 0 && <p className="text-xs text-gray-400 text-center py-2">No comments yet. Be the first!</p>}
          {post.comments.map(c => (
            <div key={c._id} className="flex gap-2.5 group">
              <Avatar user={c.user} size="sm" />
              <div className="flex-1 bg-gray-50 rounded-xl px-3 py-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-800">{c.user.name}</span>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-400">{timeAgo(c.createdAt)}</span>
                    {c.user._id === currentUserId && (
                      <button onClick={() => handleDeleteComment(c._id)} className="opacity-0 group-hover:opacity-100 p-0.5 text-red-400 hover:text-red-600 transition-all">
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-700 mt-0.5">{c.text}</p>
              </div>
            </div>
          ))}
          {/* Comment input */}
          <div className="flex gap-2 pt-1">
            <input value={commentText} onChange={e => setCommentText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleComment()}
              placeholder="Write a comment..."
              className="flex-1 bg-gray-100 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all" />
            <button onClick={handleComment} disabled={commenting || !commentText.trim()}
              className="w-9 h-9 bg-orange-600 text-white rounded-xl flex items-center justify-center hover:bg-orange-700 transition-all disabled:opacity-40">
              {commenting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function CommunityPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [cities, setCities] = useState<string[]>([]);

  // Filters
  const [feedFilter, setFeedFilter] = useState<'all' | 'following'>('all');
  const [cityFilter, setCityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }
    const userStr = localStorage.getItem('user');
    if (userStr) setCurrentUser(JSON.parse(userStr));
    fetchCities();
  }, []);

  useEffect(() => {
    if (!currentUser) return;
    setPosts([]); setPage(1); setHasMore(true);
    fetchPosts(1, true);
  }, [feedFilter, cityFilter, categoryFilter, currentUser]);

  // Infinite scroll
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loadingMore) loadMore();
    }, { threshold: 0.1 });
    if (loadMoreRef.current) observerRef.current.observe(loadMoreRef.current);
    return () => observerRef.current?.disconnect();
  }, [hasMore, loadingMore, page]);

  const fetchCities = async () => {
    try {
      const res = await api.get('/api/community/cities');
      const data = await res.json();
      if (data.success) setCities(data.cities);
    } catch (e) {}
  };

  const fetchPosts = async (p: number, reset = false) => {
    if (reset) setLoading(true); else setLoadingMore(true);
    try {
      const params = new URLSearchParams({
        page: String(p), limit: '10', filter: feedFilter,
        ...(cityFilter !== 'all' && { city: cityFilter }),
        ...(categoryFilter !== 'all' && { category: categoryFilter }),
      });
      const res = await api.get(`/api/community/posts?${params}`);
      const data = await res.json();
      if (data.success) {
        setPosts(prev => reset ? data.posts : [...prev, ...data.posts]);
        setHasMore(data.hasMore);
        setPage(p);
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); setLoadingMore(false); }
  };

  const loadMore = () => { if (!loadingMore && hasMore) fetchPosts(page + 1); };

  const handleNewPost = (post: Post) => setPosts(prev => [post, ...prev]);

  const handleUpdate = (id: string, changes: Partial<Post>) => {
    setPosts(prev => prev.map(p => p._id === id ? { ...p, ...changes } : p));
  };

  const handleDelete = (id: string) => setPosts(prev => prev.filter(p => p._id !== id));

  if (!currentUser) return null;

  return (
    <>
      <Navbar />
      <div className="h-20"></div>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">

        {/* Hero */}
        <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-8 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl font-black mb-1">🙏 Community Feed</h1>
            <p className="text-orange-100">भक्तों के साथ अपने अनुभव साझा करें</p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-6">

          {/* Filter Bar */}
          <div className="bg-white rounded-2xl shadow-md border border-orange-100 p-4 mb-4 space-y-3">
            {/* Feed type */}
            <div className="flex gap-2">
              <button onClick={() => setFeedFilter('all')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all ${feedFilter === 'all' ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-orange-50'}`}>
                <Globe className="w-4 h-4" /> All Posts
              </button>
              <button onClick={() => setFeedFilter('following')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all ${feedFilter === 'following' ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-orange-50'}`}>
                <Users className="w-4 h-4" /> Following
              </button>
            </div>

            {/* City + Category filters */}
            <div className="flex gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 bg-orange-50 rounded-xl px-3 py-1.5">
                <MapPin className="w-3.5 h-3.5 text-orange-600" />
                <select value={cityFilter} onChange={e => setCityFilter(e.target.value)}
                  className="bg-transparent text-sm font-semibold text-orange-700 focus:outline-none cursor-pointer">
                  <option value="all">All Cities</option>
                  {cities.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-1.5 bg-orange-50 rounded-xl px-3 py-1.5">
                <Filter className="w-3.5 h-3.5 text-orange-600" />
                <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}
                  className="bg-transparent text-sm font-semibold text-orange-700 focus:outline-none cursor-pointer">
                  <option value="all">All Categories</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{CAT_EMOJI[c]} {c}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Create Post */}
          <CreatePost currentUser={currentUser} onPost={handleNewPost} />

          {/* Posts */}
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-2xl shadow-md border border-orange-100 p-5 animate-pulse">
                  <div className="flex gap-3 mb-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-gray-200 rounded w-1/3" />
                      <div className="h-2 bg-gray-100 rounded w-1/4" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-100 rounded" />
                    <div className="h-3 bg-gray-100 rounded w-4/5" />
                  </div>
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-md p-12 text-center border border-orange-100">
              <div className="text-6xl mb-4">🙏</div>
              <p className="text-gray-500 text-lg font-medium mb-2">
                {feedFilter === 'following' ? 'Follow some devotees to see their posts' : 'No posts yet'}
              </p>
              <p className="text-gray-400 text-sm">Be the first to share your spiritual experience!</p>
            </div>
          ) : (
            <>
              {posts.map(post => (
                <PostCard key={post._id} post={post} currentUserId={currentUser._id}
                  onUpdate={handleUpdate} onDelete={handleDelete} />
              ))}
              {/* Infinite scroll trigger */}
              <div ref={loadMoreRef} className="py-4 text-center">
                {loadingMore && <Loader2 className="w-6 h-6 text-orange-500 animate-spin mx-auto" />}
                {!hasMore && posts.length > 0 && <p className="text-gray-400 text-sm">🙏 You've seen all posts</p>}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
