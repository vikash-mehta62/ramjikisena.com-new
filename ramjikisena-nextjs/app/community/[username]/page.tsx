'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
  MapPin, Grid3X3, Heart, MessageCircle,
  ArrowLeft, Loader2, X, Users, Send, Trash2
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import api from '@/lib/api';

// ── Types ─────────────────────────────────────────────────────────────────────
interface ProfileUser {
  _id: string; name: string; username: string; city?: string;
  profileImage?: string; totalCount?: number; mala?: number;
  rank?: number; joiningDate?: string; role?: string;
  followersCount: number; followingCount: number; postsCount: number;
  isFollowing: boolean; isOwnProfile: boolean;
}
interface Author { _id: string; name: string; username: string; city?: string; profileImage?: string; }
interface Comment { _id: string; user: Author; text: string; createdAt: string; }
interface Post {
  _id: string; author: Author; text: string; images: string[];
  category: string; city: string; likesCount: number; commentsCount: number;
  sharesCount: number; isLiked: boolean; comments: Comment[]; createdAt: string;
}
interface ListUser {
  _id: string; name: string; username: string; city?: string;
  profileImage?: string; totalCount?: number; rank?: number; isFollowing: boolean;
}

const CAT_EMOJI: Record<string, string> = {
  General: '🙏', Pooja: '🪔', Katha: '📖', Bhandara: '🍛', Bhajan: '🎵', Temple: '🛕'
};

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function Avatar({ user, size = 'md' }: { user: { name: string; profileImage?: string }; size?: 'sm' | 'md' | 'lg' | 'xl' }) {
  const s = {
    sm: 'w-8 h-8 text-sm', md: 'w-10 h-10 text-base',
    lg: 'w-16 h-16 text-2xl', xl: 'w-24 h-24 text-4xl'
  }[size];
  const ring = size === 'xl' ? 'ring-4 ring-orange-300' : size === 'lg' ? 'ring-3 ring-orange-200' : '';
  return user.profileImage ? (
    <img src={user.profileImage} alt={user.name} className={`${s} ${ring} rounded-full object-cover flex-shrink-0`} />
  ) : (
    <div className={`${s} ${ring} rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-black flex-shrink-0`}>
      {user.name[0].toUpperCase()}
    </div>
  );
}

// ── User List Modal (Followers / Following) ───────────────────────────────────
function UserListModal({ title, users, currentUserId, onClose }: {
  title: string; users: ListUser[]; currentUserId: string; onClose: () => void;
}) {
  const [list, setList] = useState(users);

  const toggle = async (u: ListUser) => {
    if (u._id === currentUserId) return;
    try {
      const res = await api.post(`/api/community/follow/${u._id}`);
      const data = await res.json();
      if (data.success) setList(prev => prev.map(x => x._id === u._id ? { ...x, isFollowing: data.following } : x));
    } catch (e) { console.error(e); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-sm max-h-[70vh] flex flex-col shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="font-black text-gray-900 text-lg">{title}</h3>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 p-3 space-y-1">
          {list.length === 0 && (
            <div className="text-center py-10 text-gray-400">
              <Users className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p className="text-sm">No users yet</p>
            </div>
          )}
          {list.map(u => (
            <div key={u._id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-orange-50 transition-colors">
              <Link href={`/community/${u.username}`} onClick={onClose}>
                <Avatar user={u} size="md" />
              </Link>
              <div className="flex-1 min-w-0">
                <Link href={`/community/${u.username}`} onClick={onClose}>
                  <p className="font-bold text-gray-900 text-sm truncate hover:text-orange-600">{u.name}</p>
                  <p className="text-xs text-gray-400">@{u.username}</p>
                </Link>
                {u.city && (
                  <p className="text-xs text-orange-600 flex items-center gap-0.5 mt-0.5">
                    <MapPin className="w-3 h-3" />{u.city}
                  </p>
                )}
              </div>
              {u._id !== currentUserId && (
                <button onClick={() => toggle(u)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all flex-shrink-0 ${u.isFollowing ? 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600' : 'bg-orange-600 text-white hover:bg-orange-700'}`}>
                  {u.isFollowing ? 'Following' : 'Follow'}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Post Detail Modal ─────────────────────────────────────────────────────────
function PostModal({ post, currentUserId, onClose, onUpdate, onDelete }: {
  post: Post; currentUserId: string; onClose: () => void;
  onUpdate: (id: string, changes: Partial<Post>) => void;
  onDelete: (id: string) => void;
}) {
  const [imgIdx, setImgIdx] = useState(0);
  const [commentText, setCommentText] = useState('');
  const [commenting, setCommenting] = useState(false);
  const [localPost, setLocalPost] = useState(post);

  const sync = (changes: Partial<Post>) => {
    setLocalPost(p => ({ ...p, ...changes }));
    onUpdate(post._id, changes);
  };

  const handleLike = async () => {
    const next = { isLiked: !localPost.isLiked, likesCount: localPost.isLiked ? localPost.likesCount - 1 : localPost.likesCount + 1 };
    sync(next);
    try { await api.post(`/api/community/posts/${post._id}/like`); }
    catch { sync({ isLiked: post.isLiked, likesCount: post.likesCount }); }
  };

  const handleComment = async () => {
    if (!commentText.trim()) return;
    setCommenting(true);
    try {
      const res = await api.post(`/api/community/posts/${post._id}/comment`, { text: commentText });
      const data = await res.json();
      if (data.success) {
        sync({ comments: [...localPost.comments, data.comment], commentsCount: data.commentsCount });
        setCommentText('');
      }
    } catch (e) { console.error(e); }
    finally { setCommenting(false); }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this post?')) return;
    try {
      const res = await api.delete(`/api/community/posts/${post._id}`);
      const data = await res.json();
      if (data.success) { onDelete(post._id); onClose(); }
    } catch (e) { console.error(e); }
  };

  const isOwn = localPost.author._id === currentUserId;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col md:flex-row shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Image panel */}
        {localPost.images.length > 0 && (
          <div className="relative bg-black md:w-1/2 flex-shrink-0 flex items-center justify-center min-h-[220px]">
            <img src={localPost.images[imgIdx]} alt="post" className="max-h-[55vh] md:max-h-[90vh] w-full object-contain" />
            {localPost.images.length > 1 && (
              <>
                {imgIdx > 0 && (
                  <button onClick={() => setImgIdx(i => i - 1)} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center text-lg">‹</button>
                )}
                {imgIdx < localPost.images.length - 1 && (
                  <button onClick={() => setImgIdx(i => i + 1)} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center text-lg">›</button>
                )}
                <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                  {localPost.images.map((_, i) => (
                    <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === imgIdx ? 'bg-white' : 'bg-white/40'}`} />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Right panel */}
        <div className="flex flex-col flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 flex-shrink-0">
            <div className="flex items-center gap-3">
              <Avatar user={localPost.author} size="sm" />
              <div>
                <Link href={`/community/${localPost.author.username}`} onClick={onClose} className="font-bold text-sm text-gray-900 hover:text-orange-600">{localPost.author.name}</Link>
                <p className="text-xs text-gray-400">@{localPost.author.username}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {isOwn && (
                <button onClick={handleDelete} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Caption + comments */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {localPost.text && (
              <div className="flex gap-2.5">
                <Avatar user={localPost.author} size="sm" />
                <div className="bg-gray-50 rounded-xl px-3 py-2 flex-1">
                  <p className="text-xs font-bold text-gray-800">{localPost.author.name}</p>
                  <p className="text-sm text-gray-700 mt-0.5 whitespace-pre-wrap">{localPost.text}</p>
                  <p className="text-xs text-gray-400 mt-1">{timeAgo(localPost.createdAt)}</p>
                </div>
              </div>
            )}
            {localPost.comments.filter(c => c.user).map(c => (
              <div key={c._id} className="flex gap-2.5">
                <Avatar user={c.user} size="sm" />
                <div className="bg-gray-50 rounded-xl px-3 py-2 flex-1">
                  <p className="text-xs font-bold text-gray-800">{c.user.name}</p>
                  <p className="text-sm text-gray-700 mt-0.5">{c.text}</p>
                  <p className="text-xs text-gray-400 mt-1">{timeAgo(c.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Actions + comment input */}
          <div className="border-t border-gray-100 px-4 py-3 flex-shrink-0">
            <div className="flex items-center gap-3 mb-3">
              <button onClick={handleLike} className={`flex items-center gap-1.5 text-sm font-semibold transition-all hover:scale-110 ${localPost.isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-400'}`}>
                <Heart className={`w-5 h-5 ${localPost.isLiked ? 'fill-red-500' : ''}`} />
                {localPost.likesCount > 0 && <span>{localPost.likesCount}</span>}
              </button>
              <span className="flex items-center gap-1.5 text-sm text-gray-400">
                <MessageCircle className="w-5 h-5" />
                {localPost.commentsCount}
              </span>
              <span className="text-xs text-gray-400 ml-auto">{timeAgo(localPost.createdAt)}</span>
            </div>
            <div className="flex gap-2">
              <input
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleComment()}
                placeholder="Add a comment..."
                className="flex-1 bg-gray-100 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <button onClick={handleComment} disabled={commenting || !commentText.trim()}
                className="w-9 h-9 bg-orange-600 text-white rounded-xl flex items-center justify-center hover:bg-orange-700 disabled:opacity-40">
                {commenting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Profile Page ─────────────────────────────────────────────────────────
export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const username = params?.username as string;

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [profile, setProfile] = useState<ProfileUser | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // Modals
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [modal, setModal] = useState<'followers' | 'following' | null>(null);
  const [modalUsers, setModalUsers] = useState<ListUser[]>([]);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }
    const u = localStorage.getItem('user');
    if (u) setCurrentUser(JSON.parse(u));
  }, []);

  useEffect(() => {
    if (!username || !currentUser) return;
    fetchProfile();
    fetchPosts(1, true);
  }, [username, currentUser]);

  const fetchProfile = async () => {
    setLoadingProfile(true);
    try {
      const res = await api.get(`/api/community/profile/${username}`);
      const data = await res.json();
      if (data.success) setProfile(data.user);
      else router.push('/community');
    } catch (e) { console.error(e); }
    finally { setLoadingProfile(false); }
  };

  const fetchPosts = async (p: number, reset = false) => {
    if (reset) setLoadingPosts(true); else setLoadingMore(true);
    try {
      const res = await api.get(`/api/community/profile/${username}/posts?page=${p}&limit=12`);
      const data = await res.json();
      if (data.success) {
        setPosts(prev => reset ? data.posts : [...prev, ...data.posts]);
        setHasMore(data.hasMore);
        setPage(p);
      }
    } catch (e) { console.error(e); }
    finally { setLoadingPosts(false); setLoadingMore(false); }
  };

  const handleFollow = async () => {
    if (!profile) return;
    setFollowLoading(true);
    try {
      const res = await api.post(`/api/community/follow/${profile._id}`);
      const data = await res.json();
      if (data.success) {
        setProfile(p => p ? {
          ...p,
          isFollowing: data.following,
          followersCount: data.following ? p.followersCount + 1 : p.followersCount - 1
        } : p);
      }
    } catch (e) { console.error(e); }
    finally { setFollowLoading(false); }
  };

  const openModal = async (type: 'followers' | 'following') => {
    setModal(type);
    setModalLoading(true);
    try {
      const res = await api.get(`/api/community/profile/${username}/${type}`);
      const data = await res.json();
      if (data.success) setModalUsers(data[type] || []);
    } catch (e) { console.error(e); }
    finally { setModalLoading(false); }
  };

  const handlePostUpdate = (id: string, changes: Partial<Post>) => {
    setPosts(prev => prev.map(p => p._id === id ? { ...p, ...changes } : p));
    if (selectedPost?._id === id) setSelectedPost(p => p ? { ...p, ...changes } : p);
  };

  const handlePostDelete = (id: string) => {
    setPosts(prev => prev.filter(p => p._id !== id));
    setProfile(p => p ? { ...p, postsCount: Math.max(0, p.postsCount - 1) } : p);
    setSelectedPost(null);
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  if (!currentUser || loadingProfile) {
    return (
      <>
        <Navbar />
        <div className="h-20" />
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-10 h-10 text-orange-500 animate-spin mx-auto mb-3" />
            <p className="text-gray-500 font-medium">Loading profile...</p>
          </div>
        </div>
      </>
    );
  }

  if (!profile) return null;

  const rankEmoji = (rank?: number) => {
    if (!rank) return '🌱';
    if (rank <= 10) return '👑';
    if (rank <= 50) return '🏆';
    if (rank <= 100) return '⭐';
    return '🙏';
  };

  return (
    <>
      <Navbar />
      <div className="h-20" />
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">

        {/* Cover / Hero */}
        <div className="bg-gradient-to-r from-orange-600 via-red-600 to-orange-700 h-40 md:h-52 relative">
          <div className="absolute inset-0 opacity-20"
            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}
          />
          {/* Back button */}
          <button onClick={() => router.back()} className="absolute top-4 left-4 w-9 h-9 bg-white/20 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Card */}
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg border border-orange-100 -mt-16 relative z-10 p-5 md:p-6">

            {/* Avatar + Follow row */}
            <div className="flex items-end justify-between mb-4">
              <div className="-mt-16 md:-mt-20">
                <Avatar user={profile} size="xl" />
              </div>
              {!profile.isOwnProfile ? (
                <button onClick={handleFollow} disabled={followLoading}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${profile.isFollowing ? 'bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600' : 'bg-gradient-to-r from-orange-600 to-red-600 text-white hover:shadow-lg hover:scale-105'} disabled:opacity-60`}>
                  {followLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {profile.isFollowing ? 'Following ✓' : '+ Follow'}
                </button>
              ) : (
                <Link href="/profile" className="px-5 py-2.5 rounded-xl font-bold text-sm bg-gray-100 text-gray-700 hover:bg-orange-50 hover:text-orange-700 transition-all">
                  Edit Profile
                </Link>
              )}
            </div>

            {/* Name + username */}
            <div className="mb-3">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-black text-gray-900">{profile.name}</h1>
                {profile.role === 'admin' && (
                  <span className="text-xs bg-orange-600 text-white px-2 py-0.5 rounded-full font-bold">Admin</span>
                )}
                {profile.rank && profile.rank <= 10 && (
                  <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-bold">👑 Top Devotee</span>
                )}
              </div>
              <p className="text-gray-500 text-sm">@{profile.username}</p>
              {profile.city && (
                <p className="flex items-center gap-1 text-sm text-orange-600 mt-1">
                  <MapPin className="w-4 h-4" />{profile.city}
                </p>
              )}
              {profile.joiningDate && (
                <p className="text-xs text-gray-400 mt-1">
                  Joined {new Date(profile.joiningDate).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                </p>
              )}
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="text-center py-3 bg-orange-50 rounded-xl">
                <p className="text-xl font-black text-gray-900">{profile.postsCount}</p>
                <p className="text-xs text-gray-500 font-medium">Posts</p>
              </div>
              <button onClick={() => openModal('followers')} className="text-center py-3 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors cursor-pointer">
                <p className="text-xl font-black text-gray-900">{profile.followersCount}</p>
                <p className="text-xs text-gray-500 font-medium">Followers</p>
              </button>
              <button onClick={() => openModal('following')} className="text-center py-3 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors cursor-pointer">
                <p className="text-xl font-black text-gray-900">{profile.followingCount}</p>
                <p className="text-xs text-gray-500 font-medium">Following</p>
              </button>
            </div>

            {/* Spiritual stats */}
            {(profile.totalCount !== undefined || profile.mala !== undefined || profile.rank !== undefined) && (
              <div className="grid grid-cols-3 gap-2 p-3 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-100">
                <div className="text-center">
                  <p className="text-lg font-black text-orange-700">{(profile.totalCount || 0).toLocaleString('en-IN')}</p>
                  <p className="text-xs text-gray-500">Naam Count</p>
                </div>
                <div className="text-center border-x border-orange-200">
                  <p className="text-lg font-black text-orange-700">{profile.mala || 0}</p>
                  <p className="text-xs text-gray-500">Mala</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-black text-orange-700">{rankEmoji(profile.rank)} #{profile.rank || '—'}</p>
                  <p className="text-xs text-gray-500">Rank</p>
                </div>
              </div>
            )}
          </div>

          {/* Posts Grid */}
          <div className="mt-4 mb-8">
            <div className="flex items-center gap-2 mb-3 px-1">
              <Grid3X3 className="w-4 h-4 text-orange-600" />
              <span className="font-bold text-gray-700 text-sm">Posts</span>
            </div>

            {loadingPosts ? (
              <div className="grid grid-cols-3 gap-1">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="aspect-square bg-gray-200 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : posts.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-md p-12 text-center border border-orange-100">
                <div className="text-5xl mb-3">🙏</div>
                <p className="text-gray-500 font-medium">No posts yet</p>
                {profile.isOwnProfile && (
                  <Link href="/community" className="mt-3 inline-block text-sm text-orange-600 font-bold hover:underline">
                    Share your first post →
                  </Link>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-3 gap-1">
                  {posts.map(post => (
                    <button key={post._id} onClick={() => setSelectedPost(post)}
                      className="aspect-square relative group rounded-lg overflow-hidden bg-gradient-to-br from-orange-100 to-amber-100 hover:opacity-90 transition-opacity">
                      {post.images.length > 0 ? (
                        <img src={post.images[0]} alt="post" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center p-2">
                          <p className="text-xs text-gray-600 text-center line-clamp-4 leading-relaxed">{post.text}</p>
                        </div>
                      )}
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
                        <span className="flex items-center gap-1 text-white text-sm font-bold">
                          <Heart className="w-4 h-4 fill-white" />{post.likesCount}
                        </span>
                        <span className="flex items-center gap-1 text-white text-sm font-bold">
                          <MessageCircle className="w-4 h-4 fill-white" />{post.commentsCount}
                        </span>
                      </div>
                      {/* Multiple images indicator */}
                      {post.images.length > 1 && (
                        <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-black/50 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">{post.images.length}</span>
                        </div>
                      )}
                      {/* Category badge */}
                      <div className="absolute bottom-1 left-1 text-sm">{CAT_EMOJI[post.category] || '🙏'}</div>
                    </button>
                  ))}
                </div>

                {/* Load more */}
                {hasMore && (
                  <div className="text-center mt-4">
                    <button onClick={() => fetchPosts(page + 1)} disabled={loadingMore}
                      className="px-6 py-2.5 bg-white border-2 border-orange-200 text-orange-700 font-bold rounded-xl hover:bg-orange-50 transition-all disabled:opacity-50 flex items-center gap-2 mx-auto">
                      {loadingMore ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                      Load more posts
                    </button>
                  </div>
                )}
                {!hasMore && posts.length > 0 && (
                  <p className="text-center text-gray-400 text-sm mt-4">🙏 All posts loaded</p>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Post Detail Modal */}
      {selectedPost && (
        <PostModal
          post={selectedPost}
          currentUserId={currentUser._id}
          onClose={() => setSelectedPost(null)}
          onUpdate={handlePostUpdate}
          onDelete={handlePostDelete}
        />
      )}

      {/* Followers / Following Modal */}
      {modal && (
        modalLoading ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <Loader2 className="w-10 h-10 text-white animate-spin" />
          </div>
        ) : (
          <UserListModal
            title={modal === 'followers' ? `Followers (${profile.followersCount})` : `Following (${profile.followingCount})`}
            users={modalUsers}
            currentUserId={currentUser._id}
            onClose={() => setModal(null)}
          />
        )
      )}
    </>
  );
}
