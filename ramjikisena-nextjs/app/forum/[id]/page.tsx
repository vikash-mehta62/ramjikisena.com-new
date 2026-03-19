'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Heart, MessageSquare, Eye, CheckCircle2, Loader2, Send, Trash2, Pin } from 'lucide-react';
import Navbar from '@/components/Navbar';
import api from '@/lib/api';

const CAT_EMOJI: Record<string, string> = {
  'Puja Help': '🪔', 'Shastra Questions': '📖', 'Bhajan & Kirtan': '🎵',
  'Mandir Info': '🛕', 'Festivals': '🎊', 'General': '🙏'
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

interface Reply {
  _id: string;
  author: { _id: string; name: string; username: string; profileImage?: string };
  text: string;
  likes: string[];
  isLiked: boolean;
  isAccepted: boolean;
  createdAt: string;
}

interface ForumThread {
  _id: string;
  title: string;
  body: string;
  category: string;
  tags: string[];
  views: number;
  likes: string[];
  isLiked: boolean;
  isSolved: boolean;
  isPinned: boolean;
  author: { _id: string; name: string; username: string; profileImage?: string; city?: string };
  replies: Reply[];
  createdAt: string;
}

export default function ForumThreadPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [thread, setThread] = useState<ForumThread | null>(null);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState('');
  const [replying, setReplying] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }
    const u = localStorage.getItem('user');
    if (u) setCurrentUser(JSON.parse(u));
  }, []);

  useEffect(() => {
    if (!id || !currentUser) return;
    api.get(`/api/forum/${id}`)
      .then(r => r.json())
      .then(data => {
        if (data.success) setThread(data.post);
        else router.push('/forum');
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id, currentUser]);

  const handleLikeThread = async () => {
    if (!thread) return;
    const next = {
      ...thread,
      isLiked: !thread.isLiked,
      likes: thread.isLiked ? thread.likes.slice(0, -1) : [...thread.likes, currentUser._id],
    };
    setThread(next);
    try { await api.post(`/api/forum/${id}/like`); }
    catch { setThread(thread); }
  };

  const handleLikeReply = async (reply: Reply) => {
    if (!thread) return;
    setThread(t => t ? {
      ...t,
      replies: t.replies.map(r => r._id === reply._id
        ? { ...r, isLiked: !r.isLiked, likes: r.isLiked ? r.likes.slice(0, -1) : [...r.likes, currentUser._id] }
        : r),
    } : t);
    try { await api.post(`/api/forum/${id}/reply/${reply._id}/like`); }
    catch { setThread(t => t ? { ...t, replies: t.replies.map(r => r._id === reply._id ? reply : r) } : t); }
  };

  const handleReply = async () => {
    if (!replyText.trim() || !thread) return;
    setReplying(true);
    try {
      const res = await api.post(`/api/forum/${id}/reply`, { text: replyText });
      const data = await res.json();
      if (data.success) {
        setThread(t => t ? { ...t, replies: [...t.replies, data.reply] } : t);
        setReplyText('');
      }
    } catch (e) { console.error(e); }
    finally { setReplying(false); }
  };

  const handleSolve = async () => {
    if (!thread) return;
    try {
      const res = await api.patch(`/api/forum/${id}/solve`, {});
      const data = await res.json();
      if (data.success) setThread(t => t ? { ...t, isSolved: data.isSolved } : t);
    } catch (e) { console.error(e); }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this thread?')) return;
    try {
      const res = await api.delete(`/api/forum/${id}`);
      const data = await res.json();
      if (data.success) router.push('/forum');
    } catch (e) { console.error(e); }
  };

  if (loading || !currentUser) {
    return (
      <>
        <Navbar />
        <div className="h-20" />
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
        </div>
      </>
    );
  }

  if (!thread) return null;

  const isAuthor = thread.author._id === currentUser._id;

  return (
    <>
      <Navbar />
      <div className="h-20" />
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        <div className="max-w-3xl mx-auto px-4 py-6">

          <button onClick={() => router.push('/forum')} className="flex items-center gap-2 text-sm text-orange-700 font-bold mb-5 hover:underline">
            <ArrowLeft className="w-4 h-4" /> Back to Forum
          </button>

          {/* Thread */}
          <div className="bg-white rounded-2xl border border-orange-100 shadow-md p-5 mb-4">
            <div className="flex items-start gap-3 mb-4">
              <Avatar user={thread.author} size="md" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  {thread.isPinned && <Pin className="w-3.5 h-3.5 text-orange-500" />}
                  {thread.isSolved && (
                    <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">
                      <CheckCircle2 className="w-3 h-3" /> Solved
                    </span>
                  )}
                  <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-medium">
                    {CAT_EMOJI[thread.category]} {thread.category}
                  </span>
                </div>
                <h1 className="text-xl font-black text-gray-900 leading-snug">{thread.title}</h1>
                <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                  <Link href={`/community/${thread.author.username}`} className="font-semibold text-gray-600 hover:text-orange-600">
                    {thread.author.name}
                  </Link>
                  {thread.author.city && <span>· {thread.author.city}</span>}
                  <span>· {timeAgo(thread.createdAt)}</span>
                </div>
              </div>
              {isAuthor && (
                <button onClick={handleDelete} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors flex-shrink-0">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap mb-4">{thread.body}</p>

            {thread.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {thread.tags.map(t => (
                  <span key={t} className="text-xs bg-orange-50 text-orange-600 px-2.5 py-1 rounded-full font-medium">#{t}</span>
                ))}
              </div>
            )}

            <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
              <button onClick={handleLikeThread}
                className={`flex items-center gap-1.5 text-sm font-semibold transition-all hover:scale-110 ${thread.isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-400'}`}>
                <Heart className={`w-4 h-4 ${thread.isLiked ? 'fill-red-500' : ''}`} />
                {thread.likes.length}
              </button>
              <span className="flex items-center gap-1.5 text-sm text-gray-400">
                <MessageSquare className="w-4 h-4" />{thread.replies.length} replies
              </span>
              <span className="flex items-center gap-1.5 text-sm text-gray-400">
                <Eye className="w-4 h-4" />{thread.views}
              </span>
              {isAuthor && (
                <button onClick={handleSolve}
                  className={`ml-auto flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full transition-all ${thread.isSolved ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-700'}`}>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {thread.isSolved ? 'Mark Unsolved' : 'Mark Solved'}
                </button>
              )}
            </div>
          </div>

          {/* Replies */}
          <div className="space-y-3 mb-4">
            <h2 className="font-black text-gray-700 text-sm px-1">{thread.replies.length} Replies</h2>
            {thread.replies.map(reply => (
              <div key={reply._id} className={`bg-white rounded-2xl border shadow-sm p-4 ${reply.isAccepted ? 'border-green-300' : 'border-orange-100'}`}>
                <div className="flex items-start gap-3">
                  <Avatar user={reply.author} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Link href={`/community/${reply.author.username}`} className="text-sm font-bold text-gray-800 hover:text-orange-600">
                        {reply.author.name}
                      </Link>
                      {reply.isAccepted && (
                        <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">
                          <CheckCircle2 className="w-3 h-3" /> Accepted
                        </span>
                      )}
                      <span className="text-xs text-gray-400 ml-auto">{timeAgo(reply.createdAt)}</span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{reply.text}</p>
                    <button onClick={() => handleLikeReply(reply)}
                      className={`flex items-center gap-1 text-xs mt-2 font-semibold transition-all hover:scale-110 ${reply.isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-400'}`}>
                      <Heart className={`w-3.5 h-3.5 ${reply.isLiked ? 'fill-red-500' : ''}`} />
                      {reply.likes.length}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Reply input */}
          <div className="bg-white rounded-2xl border border-orange-100 shadow-md p-4">
            <h3 className="font-bold text-gray-700 text-sm mb-3">Your Reply</h3>
            <textarea value={replyText} onChange={e => setReplyText(e.target.value)} rows={4}
              placeholder="Share your knowledge or guidance... 🙏"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none mb-3" />
            <button onClick={handleReply} disabled={replying || !replyText.trim()}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-60 text-sm">
              {replying ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Post Reply
            </button>
          </div>

        </div>
      </div>
    </>
  );
}
