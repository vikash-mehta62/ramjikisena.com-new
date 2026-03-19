'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MessageSquare, Plus, Search, CheckCircle2, Pin, Eye, Heart, Loader2, X, Send } from 'lucide-react';
import Navbar from '@/components/Navbar';
import api from '@/lib/api';

const CATEGORIES = ['All', 'Puja Help', 'Shastra Questions', 'Bhajan & Kirtan', 'Mandir Info', 'Festivals', 'General'];

const CAT_EMOJI: Record<string, string> = {
  'Puja Help': '🪔', 'Shastra Questions': '📖', 'Bhajan & Kirtan': '🎵',
  'Mandir Info': '🛕', 'Festivals': '🎊', 'General': '🙏', 'All': '✨'
};

interface Thread {
  _id: string; title: string; category: string; tags: string[];
  views: number; likesCount: number; repliesCount: number;
  isSolved: boolean; isPinned: boolean; createdAt: string;
  author: { _id: string; name: string; username: string; profileImage?: string };
  isLiked: boolean;
}

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function Avatar({ user, size = 'sm' }: { user: { name: string; profileImage?: string }; size?: 'sm' | 'md' }) {
  const s = size === 'md' ? 'w-10 h-10 text-base' : 'w-8 h-8 text-sm';
  return user.profileImage ? (
    <img src={user.profileImage} alt={user.name} className={`${s} rounded-full object-cover flex-shrink-0`} />
  ) : (
    <div className={`${s} rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-black flex-shrink-0`}>
      {user.name[0].toUpperCase()}
    </div>
  );
}

// ── New Thread Modal ──────────────────────────────────────────────────────────
function NewThreadModal({ onClose, onCreated }: { onClose: () => void; onCreated: (t: Thread) => void }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState('General');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const addTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (t && !tags.includes(t) && tags.length < 5) { setTags(p => [...p, t]); setTagInput(''); }
  };

  const submit = async () => {
    if (!title.trim() || !body.trim()) { setError('Title and description are required'); return; }
    setLoading(true); setError('');
    try {
      const res = await api.post('/api/forum', { title, body, category, tags });
      const data = await res.json();
      if (data.success) { onCreated(data.post); onClose(); }
      else setError(data.message || 'Failed to create thread');
    } catch { setError('Something went wrong'); }
    finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="font-black text-gray-900 text-lg">Ask a Question 🙏</h3>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100"><X className="w-5 h-5 text-gray-500" /></button>
        </div>
        <div className="overflow-y-auto flex-1 p-5 space-y-4">
          {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
          <div>
            <label className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-1 block">Title *</label>
            <input value={title} onChange={e => setTitle(e.target.value)} maxLength={200}
              placeholder="What is your question?"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-1 block">Category *</label>
            <select value={category} onChange={e => setCategory(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white">
              {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-1 block">Description *</label>
            <textarea value={body} onChange={e => setBody(e.target.value)} rows={5}
              placeholder="Describe your question in detail..."
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none" />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-1 block">Tags (optional, max 5)</label>
            <div className="flex gap-2">
              <input value={tagInput} onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="Add tag and press Enter"
                className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
              <button onClick={addTag} className="px-3 py-2 bg-orange-100 text-orange-700 rounded-xl text-sm font-bold hover:bg-orange-200">Add</button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {tags.map(t => (
                  <span key={t} className="flex items-center gap-1 bg-orange-100 text-orange-700 text-xs px-2.5 py-1 rounded-full font-medium">
                    #{t}
                    <button onClick={() => setTags(p => p.filter(x => x !== t))} className="hover:text-red-600"><X className="w-3 h-3" /></button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="px-5 py-4 border-t border-gray-100">
          <button onClick={submit} disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-60 flex items-center justify-center gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Post Question
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Forum Page ───────────────────────────────────────────────────────────
export default function ForumPage() {
  const router = useRouter();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }
    const u = localStorage.getItem('user');
    if (u) setCurrentUser(JSON.parse(u));
  }, []);

  const fetchThreads = useCallback(async (cat: string, q: string, p: number, reset = false) => {
    if (reset) setLoading(true); else setLoadingMore(true);
    try {
      const params = new URLSearchParams({ page: String(p), limit: '15' });
      if (cat !== 'All') params.set('category', cat);
      if (q) params.set('search', q);
      const res = await api.get(`/api/forum?${params}`);
      const data = await res.json();
      if (data.success) {
        setThreads(prev => reset ? data.posts : [...prev, ...data.posts]);
        setHasMore(data.hasMore);
        setPage(p);
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); setLoadingMore(false); }
  }, []);

  useEffect(() => {
    if (!currentUser) return;
    fetchThreads(activeCategory, search, 1, true);
  }, [activeCategory, search, currentUser]);

  const handleSearch = () => { setSearch(searchInput); };

  const handleLike = async (thread: Thread) => {
    setThreads(prev => prev.map(t => t._id === thread._id
      ? { ...t, isLiked: !t.isLiked, likesCount: t.isLiked ? t.likesCount - 1 : t.likesCount + 1 }
      : t));
    try { await api.post(`/api/forum/${thread._id}/like`); }
    catch { setThreads(prev => prev.map(t => t._id === thread._id ? thread : t)); }
  };

  return (
    <>
      <Navbar />
      <div className="h-20" />
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 via-red-600 to-orange-700 py-10 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="text-5xl mb-3">🙏</div>
            <h1 className="text-3xl font-black text-white mb-2">Spiritual Help Forum</h1>
            <p className="text-orange-100 text-sm">Ask questions, share knowledge, seek guidance</p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-6">
          {/* Search + New Thread */}
          <div className="flex gap-3 mb-5">
            <div className="flex-1 flex gap-2 bg-white rounded-xl border border-orange-100 shadow-sm px-4 py-2.5 items-center">
              <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <input value={searchInput} onChange={e => setSearchInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                placeholder="Search threads..."
                className="flex-1 text-sm focus:outline-none bg-transparent" />
              {searchInput && (
                <button onClick={() => { setSearchInput(''); setSearch(''); }} className="text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button onClick={() => setShowNew(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold rounded-xl hover:shadow-lg transition-all text-sm flex-shrink-0">
              <Plus className="w-4 h-4" /> Ask
            </button>
          </div>

          {/* Category tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-5 scrollbar-hide">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all flex-shrink-0 ${activeCategory === cat ? 'bg-orange-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-orange-50 border border-orange-100'}`}>
                <span>{CAT_EMOJI[cat]}</span> {cat}
              </button>
            ))}
          </div>

          {/* Thread list */}
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
            </div>
          ) : threads.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-md p-12 text-center border border-orange-100">
              <div className="text-5xl mb-3">🙏</div>
              <p className="text-gray-500 font-medium">No threads yet in this category</p>
              <button onClick={() => setShowNew(true)} className="mt-4 text-sm text-orange-600 font-bold hover:underline">
                Be the first to ask →
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {threads.map(thread => (
                <Link key={thread._id} href={`/forum/${thread._id}`}
                  className="block bg-white rounded-2xl border border-orange-100 shadow-sm hover:shadow-md hover:border-orange-300 transition-all p-4 group">
                  <div className="flex items-start gap-3">
                    <Avatar user={thread.author} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        {thread.isPinned && <Pin className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />}
                        {thread.isSolved && <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />}
                        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-medium flex-shrink-0">
                          {CAT_EMOJI[thread.category]} {thread.category}
                        </span>
                      </div>
                      <h3 className="font-bold text-gray-900 text-sm leading-snug group-hover:text-orange-700 transition-colors line-clamp-2">
                        {thread.title}
                      </h3>
                      {thread.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {thread.tags.map(t => (
                            <span key={t} className="text-xs text-gray-400">#{t}</span>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                        <span className="font-medium text-gray-600">{thread.author.name}</span>
                        <span>{timeAgo(thread.createdAt)}</span>
                        <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{thread.views}</span>
                        <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" />{thread.repliesCount}</span>
                        <button onClick={e => { e.preventDefault(); handleLike(thread); }}
                          className={`flex items-center gap-1 transition-colors ${thread.isLiked ? 'text-red-500' : 'hover:text-red-400'}`}>
                          <Heart className={`w-3 h-3 ${thread.isLiked ? 'fill-red-500' : ''}`} />{thread.likesCount}
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}

              {hasMore && (
                <div className="text-center pt-2">
                  <button onClick={() => fetchThreads(activeCategory, search, page + 1)} disabled={loadingMore}
                    className="px-6 py-2.5 bg-white border-2 border-orange-200 text-orange-700 font-bold rounded-xl hover:bg-orange-50 transition-all disabled:opacity-50 flex items-center gap-2 mx-auto">
                    {loadingMore ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    Load more
                  </button>
                </div>
              )}
              {!hasMore && threads.length > 0 && (
                <p className="text-center text-gray-400 text-sm pt-2">🙏 All threads loaded</p>
              )}
            </div>
          )}
        </div>
      </div>

      {showNew && (
        <NewThreadModal
          onClose={() => setShowNew(false)}
          onCreated={t => setThreads(prev => [t as unknown as Thread, ...prev])}
        />
      )}
    </>
  );
}
