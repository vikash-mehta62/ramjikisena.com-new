'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Bell, Send, Plus, Trash2, Users, FileText, Image as ImageIcon,
  Link as LinkIcon, RefreshCw, X, Search, Check, AlertCircle, Smartphone,
  Radio, CheckCircle2, UserCheck
} from 'lucide-react';
import ImageUploader from '@/components/ImageUploader';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3101';

interface NotificationCounts {
  totalDevices: number;
  devotees: number;
  pandits: number;
  astrologers: number;
  kathavachaks: number;
  guests: number;
  topicsCount: number;
}

interface NotificationItem {
  _id: string;
  title: string;
  body: string;
  imageUrl?: string;
  createdAt: string;
  data?: {
    targetType?: string;
    targetTopic?: string;
    link?: string;
    successCount?: number;
    failureCount?: number;
  };
}

interface TopicItem {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  subscriberCount: number;
}

interface SubscriberUser {
  _id: string;
  name: string;
  email?: string;
  contact?: string;
  phone?: string;
  role: string;
}

export default function PushNotificationsAdminPage() {
  const formRef = useRef<HTMLDivElement>(null);

  // Tabs: 'send' | 'topics'
  const [activeTab, setActiveTab] = useState<'send' | 'topics'>('send');

  // Loading states
  const [countsLoading, setCountsLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [topicsLoading, setTopicsLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Data states
  const [counts, setCounts] = useState<NotificationCounts>({
    totalDevices: 0,
    devotees: 0,
    pandits: 0,
    astrologers: 0,
    kathavachaks: 0,
    guests: 0,
    topicsCount: 0
  });
  const [manualHistory, setManualHistory] = useState<NotificationItem[]>([]);
  const [topics, setTopics] = useState<TopicItem[]>([]);

  // Send Form State
  const [targetType, setTargetType] = useState<string>('all'); // 'all', 'user', 'pandit', 'astrologer', 'kathavachak', 'topic'
  const [selectedTopicSlug, setSelectedTopicSlug] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [body, setBody] = useState<string>('');
  const [link, setLink] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');

  // Topic Creation Form State
  const [newTopicName, setNewTopicName] = useState<string>('');
  const [newTopicDesc, setNewTopicDesc] = useState<string>('');

  // Topic Subscriber Management Modal State
  const [selectedTopic, setSelectedTopic] = useState<TopicItem | null>(null);
  const [subscribers, setSubscribers] = useState<SubscriberUser[]>([]);
  const [availableUsers, setAvailableUsers] = useState<SubscriberUser[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [subscribersLoading, setSubscribersLoading] = useState<boolean>(false);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const getAuthHeaders = (): HeadersInit => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
  };

  const fetchCounts = async () => {
    setCountsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/notifications/admin/counts`, {
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success && data.counts) {
        setCounts({
          totalDevices: data.counts.totalDevices || 0,
          devotees: data.counts.devotees || 0,
          pandits: data.counts.pandits || 0,
          astrologers: data.counts.astrologers || 0,
          kathavachaks: data.counts.kathavachaks || 0,
          guests: data.counts.guests || 0,
          topicsCount: data.counts.topicsCount || 0
        });
      }
    } catch (e: any) {
      console.error('Error fetching counts:', e);
    } finally {
      setCountsLoading(false);
    }
  };

  const fetchHistory = async () => {
    setHistoryLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/notifications/manual-history`, {
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.history)) {
        setManualHistory(data.history);
      }
    } catch (e: any) {
      console.error('Error fetching history:', e);
    } finally {
      setHistoryLoading(false);
    }
  };

  const fetchTopics = async () => {
    setTopicsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/notifications/topics`, {
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.topics)) {
        setTopics(data.topics);
        if (data.topics.length > 0 && !selectedTopicSlug) {
          setSelectedTopicSlug(data.topics[0].slug);
        }
      }
    } catch (e: any) {
      console.error('Error fetching topics:', e);
    } finally {
      setTopicsLoading(false);
    }
  };

  useEffect(() => {
    fetchCounts();
    fetchHistory();
    fetchTopics();
  }, []);

  // Send Manual Push Notification
  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      showToast('शीर्षक (Title) और संदेश (Body) अनिवार्य हैं', 'error');
      return;
    }
    if (targetType === 'topic' && !selectedTopicSlug) {
      showToast('कृपया लक्षित विषय (Topic) चुनें', 'error');
      return;
    }

    setSending(true);
    try {
      const res = await fetch(`${API_URL}/api/notifications/send-manual`, {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify({
          targetType,
          targetTopic: targetType === 'topic' ? selectedTopicSlug : undefined,
          title: title.trim(),
          body: body.trim(),
          link: link.trim() || undefined,
          imageUrl: imageUrl || undefined
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast('पुश नोटिफिकेशन सफलतापूर्वक भेजा गया!', 'success');
        setTitle('');
        setBody('');
        setLink('');
        setImageUrl('');
        fetchHistory();
        fetchCounts();
      } else {
        showToast(data.message || 'पुश नोटिफिकेशन भेजने में विफल', 'error');
      }
    } catch (err: any) {
      showToast('सर्वर से संपर्क नहीं हो पाया: ' + err.message, 'error');
    } finally {
      setSending(false);
    }
  };

  // Create Topic handler
  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopicName.trim()) {
      showToast('विषय का नाम अनिवार्य है', 'error');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/notifications/topics`, {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify({
          name: newTopicName.trim(),
          description: newTopicDesc.trim()
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast('नया विषय सफलतापूर्वक बनाया गया!', 'success');
        setNewTopicName('');
        setNewTopicDesc('');
        fetchTopics();
        fetchCounts();
      } else {
        showToast(data.message || 'विषय बनाने में विफल', 'error');
      }
    } catch (err: any) {
      showToast('सर्वर एरर: ' + err.message, 'error');
    }
  };

  // Delete Topic handler
  const handleDeleteTopic = async (topicId: string) => {
    if (!confirm('क्या आप वाकई इस विषय को हटाना चाहते हैं? इसके सभी सदस्य स्वतः अनसब्सक्राइब हो जाएँगे।')) return;

    try {
      const res = await fetch(`${API_URL}/api/notifications/topics/${topicId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success) {
        showToast('विषय हटा दिया गया', 'success');
        fetchTopics();
        fetchCounts();
      } else {
        showToast(data.message || 'विषय हटाने में विफल', 'error');
      }
    } catch (err: any) {
      showToast('सर्वर एरर: ' + err.message, 'error');
    }
  };

  // Autofill form for resend
  const handleResend = (historyItem: NotificationItem) => {
    setTargetType(historyItem.data?.targetType || 'all');
    if (historyItem.data?.targetType === 'topic') {
      setSelectedTopicSlug(historyItem.data?.targetTopic || '');
    }
    setTitle(historyItem.title || '');
    setBody(historyItem.body || '');
    setLink(historyItem.data?.link || '');
    setImageUrl(historyItem.imageUrl || '');

    formRef.current?.scrollIntoView({ behavior: 'smooth' });
    showToast('संदेश विवरण फॉर्म में भर दिया गया है', 'success');
  };

  // Fetch Topic Subscribers
  const fetchTopicSubscribers = async (topic: TopicItem) => {
    setSelectedTopic(topic);
    setSubscribersLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/notifications/topics/${topic.slug}/subscribers`, {
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success) {
        setSubscribers(data.subscribers || []);
        setAvailableUsers(data.availableUsers || []);
      }
    } catch (e: any) {
      console.error(e);
      showToast('सब्सक्राइबर्स लोड करने में विफल', 'error');
    } finally {
      setSubscribersLoading(false);
    }
  };

  // Subscribe user to topic
  const handleSubscribe = async (userId: string) => {
    if (!selectedTopic) return;
    try {
      const res = await fetch(`${API_URL}/api/notifications/topics/${selectedTopic.slug}/subscribe`, {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify({ userId })
      });
      const data = await res.json();
      if (data.success) {
        showToast('यूज़र को विषय से जोड़ दिया गया', 'success');
        fetchTopicSubscribers(selectedTopic);
        fetchTopics();
      } else {
        showToast(data.message || 'जोड़ने में विफल', 'error');
      }
    } catch (err: any) {
      showToast('सर्वर एरर: ' + err.message, 'error');
    }
  };

  // Unsubscribe user from topic
  const handleUnsubscribe = async (userId: string) => {
    if (!selectedTopic) return;
    try {
      const res = await fetch(`${API_URL}/api/notifications/topics/${selectedTopic.slug}/unsubscribe`, {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify({ userId })
      });
      const data = await res.json();
      if (data.success) {
        showToast('यूज़र को हटा दिया गया', 'success');
        fetchTopicSubscribers(selectedTopic);
        fetchTopics();
      } else {
        showToast(data.message || 'हटाने में विफल', 'error');
      }
    } catch (err: any) {
      showToast('सर्वर एरर: ' + err.message, 'error');
    }
  };

  const filteredAvailableUsers = availableUsers.filter(u =>
    u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.phone?.includes(searchQuery) ||
    u.contact?.includes(searchQuery) ||
    u.role?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full space-y-8 max-w-7xl mx-auto pb-16">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-sm font-bold text-white transition-all transform animate-bounce ${
            toast.type === 'success' ? 'bg-emerald-600 shadow-emerald-200' : 'bg-rose-600 shadow-rose-200'
          }`}
        >
          {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          {toast.message}
        </div>
      )}

      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 rounded-3xl p-6 md:p-8 text-white shadow-xl shadow-orange-900/10 relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 space-y-1">
          <div className="flex items-center gap-2 text-amber-200 text-xs font-black uppercase tracking-widest">
            <Radio className="w-4 h-4 animate-pulse" />
            <span>FCM Broadcast Center</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">पुश नोटिफिकेशन (Push Notifications)</h1>
          <p className="text-amber-100 text-sm max-w-xl">
            भक्तों, पंडितों, ज्योतिषियों और पंजीकृत डिवाइसों पर तत्काल आध्यात्मिक संदेश, आरती अपडेट व सूचनाएं भेजें।
          </p>
        </div>

        <button
          onClick={() => {
            fetchCounts();
            fetchHistory();
            fetchTopics();
          }}
          className="relative z-10 self-start md:self-auto flex items-center gap-2 px-4 py-2.5 bg-white/15 hover:bg-white/25 active:scale-95 border border-white/20 rounded-2xl font-bold text-xs backdrop-blur-md transition-all shadow-sm"
        >
          <RefreshCw className={`w-4 h-4 ${countsLoading || historyLoading ? 'animate-spin' : ''}`} />
          <span>रिफ्रेश आंकड़े</span>
        </button>
      </div>

      {/* Live Device Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-white rounded-2xl p-4 border border-orange-100 shadow-sm hover:shadow-md transition-all">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">कुल डिवाइस</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{countsLoading ? '...' : counts.totalDevices}</p>
          <span className="text-[10px] text-orange-600 font-semibold">सभी पंजीकृत डिवाइस</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-orange-100 shadow-sm hover:shadow-md transition-all">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">भक्तगण (Devotees)</p>
          <p className="text-2xl font-black text-amber-600 mt-1">{countsLoading ? '...' : counts.devotees}</p>
          <span className="text-[10px] text-gray-500 font-medium">सत्यापित उपयोगकर्ता</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-orange-100 shadow-sm hover:shadow-md transition-all">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">पंडित जी (Pandits)</p>
          <p className="text-2xl font-black text-orange-600 mt-1">{countsLoading ? '...' : counts.pandits}</p>
          <span className="text-[10px] text-gray-500 font-medium">पूजन पुरोहित</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-orange-100 shadow-sm hover:shadow-md transition-all">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">ज्योतिषी (Astrologers)</p>
          <p className="text-2xl font-black text-indigo-600 mt-1">{countsLoading ? '...' : counts.astrologers}</p>
          <span className="text-[10px] text-gray-500 font-medium">परामर्शदाता</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-orange-100 shadow-sm hover:shadow-md transition-all">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">कथावाचक</p>
          <p className="text-2xl font-black text-amber-700 mt-1">{countsLoading ? '...' : counts.kathavachaks}</p>
          <span className="text-[10px] text-gray-500 font-medium">प्रवचन वक्ता</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-orange-100 shadow-sm hover:shadow-md transition-all">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">विषय (Topics)</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">{countsLoading ? '...' : counts.topicsCount}</p>
          <span className="text-[10px] text-emerald-700 font-medium">सक्रिय ग्रुप्स</span>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('send')}
          className={`py-3.5 px-6 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'send'
              ? 'border-orange-600 text-orange-600'
              : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'
          }`}
        >
          <Send className="w-4 h-4" />
          <span>पुश नोटिफिकेशन भेजें (Send Broadcast)</span>
        </button>
        <button
          onClick={() => setActiveTab('topics')}
          className={`py-3.5 px-6 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'topics'
              ? 'border-orange-600 text-orange-600'
              : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>विषय व श्रोता समूह (Notification Topics)</span>
        </button>
      </div>

      {/* Tab Content 1: Send Push Notification */}
      {activeTab === 'send' && (
        <div className="space-y-8" ref={formRef}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Column */}
            <div className="lg:col-span-2 bg-white rounded-3xl border border-orange-100 shadow-sm p-6 md:p-8 space-y-6">
              <div>
                <h3 className="text-lg font-black text-slate-900">नया पुश नोटिफिकेशन तैयार करें</h3>
                <p className="text-xs text-gray-500 mt-1">
                  सभी क्षेत्रों को ध्यानपूर्वक भरें। यह संदेश तत्काल सभी सक्रिय उपयोगकर्ताओं को प्राप्त होगा।
                </p>
              </div>

              <form onSubmit={handleSendNotification} className="space-y-6">
                {/* Target Selection */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-2.5">
                    लक्षित दर्शक (Target Audience) *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setTargetType('all')}
                      className={`p-3.5 rounded-2xl border text-left text-xs transition-all flex flex-col justify-between ${
                        targetType === 'all'
                          ? 'border-orange-500 bg-orange-50/60 text-orange-950 ring-2 ring-orange-500/20 font-bold'
                          : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <span className="font-bold text-sm">सभी डिवाइस</span>
                      <span className="text-[11px] text-orange-600 font-black mt-2">
                        {countsLoading ? '...' : `${counts.totalDevices} सक्रिय`}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTargetType('user')}
                      className={`p-3.5 rounded-2xl border text-left text-xs transition-all flex flex-col justify-between ${
                        targetType === 'user'
                          ? 'border-orange-500 bg-orange-50/60 text-orange-950 ring-2 ring-orange-500/20 font-bold'
                          : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <span className="font-bold text-sm">भक्तगण (Devotees)</span>
                      <span className="text-[11px] text-orange-600 font-black mt-2">
                        {countsLoading ? '...' : `${counts.devotees} सक्रिय`}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTargetType('pandit')}
                      className={`p-3.5 rounded-2xl border text-left text-xs transition-all flex flex-col justify-between ${
                        targetType === 'pandit'
                          ? 'border-orange-500 bg-orange-50/60 text-orange-950 ring-2 ring-orange-500/20 font-bold'
                          : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <span className="font-bold text-sm">पंडित जी (Pandits)</span>
                      <span className="text-[11px] text-orange-600 font-black mt-2">
                        {countsLoading ? '...' : `${counts.pandits} सक्रिय`}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTargetType('astrologer')}
                      className={`p-3.5 rounded-2xl border text-left text-xs transition-all flex flex-col justify-between ${
                        targetType === 'astrologer'
                          ? 'border-orange-500 bg-orange-50/60 text-orange-950 ring-2 ring-orange-500/20 font-bold'
                          : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <span className="font-bold text-sm">ज्योतिषी (Astrologers)</span>
                      <span className="text-[11px] text-orange-600 font-black mt-2">
                        {countsLoading ? '...' : `${counts.astrologers} सक्रिय`}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTargetType('kathavachak')}
                      className={`p-3.5 rounded-2xl border text-left text-xs transition-all flex flex-col justify-between ${
                        targetType === 'kathavachak'
                          ? 'border-orange-500 bg-orange-50/60 text-orange-950 ring-2 ring-orange-500/20 font-bold'
                          : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <span className="font-bold text-sm">कथावाचक</span>
                      <span className="text-[11px] text-orange-600 font-black mt-2">
                        {countsLoading ? '...' : `${counts.kathavachaks} सक्रिय`}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTargetType('topic')}
                      className={`p-3.5 rounded-2xl border text-left text-xs transition-all flex flex-col justify-between ${
                        targetType === 'topic'
                          ? 'border-orange-500 bg-orange-50/60 text-orange-950 ring-2 ring-orange-500/20 font-bold'
                          : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <span className="font-bold text-sm">विषय अनुसार (Topic)</span>
                      <span className="text-[11px] text-orange-600 font-black mt-2">
                        {countsLoading ? '...' : `${counts.topicsCount} विषय`}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Topic Dropdown if targetType is topic */}
                {targetType === 'topic' && (
                  <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-200">
                    <label className="block text-xs font-black uppercase tracking-wider text-amber-900 mb-1.5">
                      लक्षित विषय चुनें (Select Topic) *
                    </label>
                    <select
                      value={selectedTopicSlug}
                      onChange={(e) => setSelectedTopicSlug(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-amber-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm font-semibold text-slate-800"
                    >
                      <option value="">-- विषय का चयन करें --</option>
                      {topics.map(t => (
                        <option key={t.slug} value={t.slug}>
                          {t.name} ({t.subscriberCount} सदस्य)
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Title */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-gray-600 mb-1.5">
                    अधिसूचना शीर्षक (Notification Title) *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="उदा. 🚩 आज शाम 7:00 बजे विशेष रामार्चा पूजा एवं आरती!"
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm font-medium"
                  />
                </div>

                {/* Message Body */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-gray-600 mb-1.5">
                    अधिसूचना संदेश (Notification Message) *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="संदेश का मुख्य विवरण यहाँ लिखें... जैसे: प्रभु श्री राम जी के पावन आशीर्वाद हेतु अभी दर्शन करें व नाम जाप में भाग लें।"
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm font-medium resize-none"
                  />
                </div>

                {/* Action / Redirection Link */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-gray-600 mb-1.5">
                    क्लिक करने पर खुलने वाला लिंक (Optional Action URL)
                  </label>
                  <div className="relative">
                    <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={link}
                      onChange={(e) => setLink(e.target.value)}
                      placeholder="उदा. /#jaap या /blogs या https://ramjikisena.com/puja"
                      className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm font-medium"
                    />
                  </div>
                </div>

                {/* Image URL / Uploader */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-gray-600 mb-2">
                    अधिसूचना फोटो (Notification Banner Image - Optional)
                  </label>
                  <div className="space-y-3">
                    <ImageUploader
                      value={imageUrl}
                      onChange={(url) => setImageUrl(typeof url === 'string' ? url : url[0] || '')}
                      folder="notifications"
                      label="फोटो अपलोड करें (S3)"
                    />
                    <div className="relative">
                      <input
                        type="text"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="या सीधा इमेज URL दर्ज करें..."
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 text-xs font-mono text-gray-600"
                      />
                      {imageUrl && (
                        <button
                          type="button"
                          onClick={() => setImageUrl('')}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-red-500"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Send Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 disabled:opacity-50 text-white font-black text-sm rounded-2xl shadow-lg shadow-orange-600/20 transition-all active:scale-[0.99]"
                  >
                    <Send className="w-4 h-4" />
                    {sending ? 'पुश नोटिफिकेशन भेजा जा रहा है...' : 'अभी पुश नोटिफिकेशन प्रसारित करें'}
                  </button>
                </div>
              </form>
            </div>

            {/* Preview Column (Mobile Mockup) */}
            <div className="bg-white rounded-3xl border border-orange-100 shadow-sm p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Smartphone className="w-5 h-5 text-orange-600" />
                  <h3 className="text-base font-black text-slate-900">मोबाइल पूर्वावलोकन (Preview)</h3>
                </div>
                <p className="text-xs text-gray-400 mb-6">उपयोगकर्ता के फोन पर नोटिफिकेशन ऐसा दिखाई देगा</p>

                {/* Phone Shell */}
                <div className="border-[7px] border-slate-900 rounded-[38px] bg-slate-950 p-3 shadow-2xl aspect-[9/16] w-full max-w-[280px] mx-auto relative overflow-hidden flex flex-col justify-start pt-14">
                  {/* Speaker Notch */}
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-4 bg-black rounded-full z-10 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-slate-900 mr-2" />
                    <div className="w-2 h-2 rounded-full bg-slate-800" />
                  </div>

                  {/* Notification Card */}
                  <div className="bg-white/95 backdrop-blur-md rounded-2xl p-3.5 shadow-xl border border-white/40 space-y-2">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-1.5">
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 bg-gradient-to-tr from-orange-600 to-amber-500 rounded-md flex items-center justify-center text-[9px] text-white font-black shadow-sm">
                          🚩
                        </div>
                        <span className="text-[10px] font-black text-slate-900 tracking-tight">राम जी की सेना</span>
                      </div>
                      <span className="text-[8px] font-semibold text-gray-400">अभी • 1m</span>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-xs font-black text-slate-950 leading-tight">
                        {title || '🚩 विशेष राम नाम संदेश'}
                      </h4>
                      <p className="text-[10px] text-slate-600 line-clamp-3 leading-relaxed">
                        {body || 'यह वह स्थान है जहाँ आपके द्वारा भेजा गया संदेश मोबाइल स्क्रीन पर दिखाई देगा।'}
                      </p>
                    </div>

                    {imageUrl && (
                      <div className="mt-2 rounded-xl overflow-hidden border border-gray-100 bg-gray-50 max-h-[90px] flex items-center justify-center">
                        <img src={imageUrl} alt="Notification Preview" className="max-h-[90px] w-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-orange-50/60 rounded-2xl p-4 border border-orange-100 text-xs text-orange-950 space-y-1">
                <p className="font-bold">💡 महत्वपूर्ण निर्देश:</p>
                <p className="text-[11px] text-orange-800 leading-relaxed">
                  उपयोगकर्ता द्वारा नोटिफिकेशन पर क्लिक करते ही दिया गया लिंक सीधे उनके ब्राउज़र या ऐप में खुल जाएगा।
                </p>
              </div>
            </div>
          </div>

          {/* Broadcast History Table */}
          <div className="bg-white rounded-3xl border border-orange-100 shadow-sm p-6 md:p-8 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-900">प्रसारण इतिहास (Broadcast History)</h3>
                <p className="text-xs text-gray-500 mt-0.5">पहले भेजे गए मैनुअल पुश नोटिफिकेशन के परिणाम एवं रिकॉर्ड्स</p>
              </div>
              <button
                onClick={fetchHistory}
                className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-500"
                title="रिफ्रेश करें"
              >
                <RefreshCw className={`w-4 h-4 ${historyLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider bg-gray-50/60">
                    <th className="py-3.5 px-4 rounded-l-xl">लक्षित समूह</th>
                    <th className="py-3.5 px-4">शीर्षक</th>
                    <th className="py-3.5 px-4">संदेश</th>
                    <th className="py-3.5 px-4">फोटो</th>
                    <th className="py-3.5 px-4">FCM परिणाम</th>
                    <th className="py-3.5 px-4">भेजने का समय</th>
                    <th className="py-3.5 px-4 rounded-r-xl text-center">क्रिया</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {manualHistory.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-gray-400">
                        अभी तक कोई नोटिफिकेशन इतिहास उपलब्ध नहीं है
                      </td>
                    </tr>
                  ) : (
                    manualHistory.map((item) => (
                      <tr key={item._id} className="hover:bg-orange-50/30 transition-all text-slate-700">
                        <td className="py-4 px-4 font-bold">
                          <span className="px-2.5 py-1 bg-orange-100 text-orange-800 font-black rounded-lg text-[10px] uppercase">
                            {item.data?.targetType === 'topic' ? `विषय: ${item.data?.targetTopic}` : item.data?.targetType || 'all'}
                          </span>
                        </td>
                        <td className="py-4 px-4 font-bold text-slate-950 max-w-[180px] truncate">{item.title}</td>
                        <td className="py-4 px-4 max-w-[240px] truncate text-slate-600" title={item.body}>{item.body}</td>
                        <td className="py-4 px-4">
                          {item.imageUrl ? (
                            <img src={item.imageUrl} alt="Notification" className="w-8 h-8 rounded-lg object-cover border border-gray-100" />
                          ) : (
                            <span className="text-gray-300">-</span>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-emerald-600 font-bold">✓ {item.data?.successCount || 0} सफल</span>
                            {(item.data?.failureCount || 0) > 0 && (
                              <span className="text-rose-500 font-bold">✗ {item.data?.failureCount} असफल</span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-500 whitespace-nowrap">
                          {new Date(item.createdAt).toLocaleDateString('hi-IN')} {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="py-4 px-4 text-center">
                          <button
                            onClick={() => handleResend(item)}
                            className="px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-700 font-bold rounded-xl transition-all border border-orange-200"
                          >
                            पुनः भेजें
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 2: Topics Management */}
      {activeTab === 'topics' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Create Topic Form */}
            <div className="bg-white rounded-3xl border border-orange-100 shadow-sm p-6 md:p-8 h-fit space-y-4">
              <div>
                <h3 className="text-lg font-black text-slate-900">नया विषय (Topic) बनाएं</h3>
                <p className="text-xs text-gray-500 mt-1">श्रोताओं को विशेष समूह में बाँटने हेतु विषय बनाएं</p>
              </div>

              <form onSubmit={handleCreateTopic} className="space-y-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-gray-600 mb-1.5">
                    विषय का नाम (Topic Name) *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTopicName}
                    onChange={(e) => setNewTopicName(e.target.value)}
                    placeholder="उदा. दैनिक आरती व दर्शन अपडेट्स"
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-gray-600 mb-1.5">
                    विवरण (Description - Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={newTopicDesc}
                    onChange={(e) => setNewTopicDesc(e.target.value)}
                    placeholder="इस विषय में किस प्रकार के संदेश भेजे जाएंगे..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 text-sm resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold rounded-2xl transition-all shadow-md shadow-orange-600/20 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  विषय जोड़ें
                </button>
              </form>
            </div>

            {/* Topics List Table */}
            <div className="lg:col-span-2 bg-white rounded-3xl border border-orange-100 shadow-sm p-6 md:p-8 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-slate-900">सक्रिय विषय सूची (Topic Channels)</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Firebase FCM द्वारा डिवाइस स्वतः सिंक होते हैं</p>
                </div>
                <button
                  onClick={fetchTopics}
                  className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-500"
                >
                  <RefreshCw className={`w-4 h-4 ${topicsLoading ? 'animate-spin' : ''}`} />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider bg-gray-50/60">
                      <th className="py-3 px-4 rounded-l-xl">विषय का नाम</th>
                      <th className="py-3 px-4">FCM Slug</th>
                      <th className="py-3 px-4">विवरण</th>
                      <th className="py-3 px-4">सदस्य</th>
                      <th className="py-3 px-4 rounded-r-xl text-center">क्रिया</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {topics.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-gray-400">
                          अभी तक कोई विषय नहीं बनाया गया है
                        </td>
                      </tr>
                    ) : (
                      topics.map((topic) => (
                        <tr key={topic._id} className="hover:bg-orange-50/30 transition-all text-slate-700">
                          <td className="py-4 px-4 font-black text-slate-900">{topic.name}</td>
                          <td className="py-4 px-4">
                            <span className="font-mono bg-orange-50 text-orange-800 px-2.5 py-1 rounded-lg text-[11px] font-bold">
                              {topic.slug}
                            </span>
                          </td>
                          <td className="py-4 px-4 max-w-[180px] truncate text-slate-500" title={topic.description}>
                            {topic.description || '-'}
                          </td>
                          <td className="py-4 px-4">
                            <span className="font-black text-amber-700">{topic.subscriberCount} डिवाइस</span>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => fetchTopicSubscribers(topic)}
                                className="px-3 py-1.5 bg-gray-100 hover:bg-orange-50 text-slate-700 hover:text-orange-700 font-bold rounded-xl transition-all"
                              >
                                सदस्य प्रबंध
                              </button>
                              <button
                                onClick={() => handleDeleteTopic(topic._id)}
                                className="p-1.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl transition-all"
                                title="विषय हटाएं"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Topic Subscriber Management Modal */}
          {selectedTopic && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
              <div className="bg-white rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh] border border-orange-100">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-orange-600 to-amber-600 text-white">
                  <div>
                    <h3 className="font-black text-lg">सदस्य प्रबंधन (Topic Subscribers)</h3>
                    <p className="text-xs text-orange-100">
                      विषय: <strong>{selectedTopic.name}</strong> ({selectedTopic.slug})
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedTopic(null)}
                    className="p-1.5 hover:bg-white/20 rounded-full transition-all text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Content Panel */}
                <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[320px]">
                  {/* Left Side: Subscribed Users */}
                  <div className="border border-orange-100 rounded-2xl p-4 flex flex-col bg-orange-50/20">
                    <h4 className="font-black text-slate-900 mb-3 flex items-center justify-between text-xs uppercase tracking-wider">
                      <span>जुड़े हुए सदस्य (Subscribed)</span>
                      <span className="px-2 py-0.5 bg-orange-200 text-orange-900 rounded-full font-black text-[11px]">
                        {subscribers.length}
                      </span>
                    </h4>

                    <div className="flex-1 overflow-y-auto space-y-2 max-h-[300px] pr-1">
                      {subscribersLoading ? (
                        <div className="text-center text-xs text-gray-400 py-6">लोड हो रहा है...</div>
                      ) : subscribers.length === 0 ? (
                        <div className="text-center text-xs text-gray-400 py-8">इस विषय में कोई सदस्य नहीं है।</div>
                      ) : (
                        subscribers.map((u) => (
                          <div
                            key={u._id}
                            className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100 hover:border-orange-200 shadow-xs transition-all"
                          >
                            <div className="min-w-0 pr-2">
                              <p className="text-xs font-black text-slate-900 truncate">{u.name}</p>
                              <p className="text-[10px] text-gray-400 truncate">
                                {u.email || u.contact || u.phone || 'कोई ईमेल नहीं'} • <span className="font-semibold text-orange-600">{u.role}</span>
                              </p>
                            </div>
                            <button
                              onClick={() => handleUnsubscribe(u._id)}
                              className="text-[10px] font-bold text-red-500 hover:bg-red-50 px-2 py-1 rounded-lg border border-red-200 flex-shrink-0"
                            >
                              हटाएं
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Right Side: Available Users to Add */}
                  <div className="border border-gray-100 rounded-2xl p-4 flex flex-col">
                    <h4 className="font-black text-slate-900 mb-3 text-xs uppercase tracking-wider">
                      नया सदस्य जोड़ें (Add Devotee)
                    </h4>

                    {/* Search Box */}
                    <div className="relative mb-3">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="नाम, ईमेल या भूमिका से खोजें..."
                        className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 text-xs"
                      />
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-2 max-h-[250px] pr-1">
                      {subscribersLoading ? (
                        <div className="text-center text-xs text-gray-400 py-6">लोड हो रहा है...</div>
                      ) : filteredAvailableUsers.length === 0 ? (
                        <div className="text-center text-xs text-gray-400 py-8">कोई उपलब्ध यूज़र नहीं मिला।</div>
                      ) : (
                        filteredAvailableUsers.map((u) => (
                          <div
                            key={u._id}
                            className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl border border-gray-100 hover:bg-orange-50/50 hover:border-orange-200 transition-all"
                          >
                            <div className="min-w-0 pr-2">
                              <p className="text-xs font-bold text-slate-900 truncate">{u.name}</p>
                              <p className="text-[10px] text-gray-400 truncate">
                                {u.email || u.contact || u.phone || '-'} • <span className="font-semibold text-orange-600">{u.role}</span>
                              </p>
                            </div>
                            <button
                              onClick={() => handleSubscribe(u._id)}
                              className="text-[10px] font-bold text-orange-600 hover:bg-orange-100 px-2.5 py-1 rounded-lg flex items-center gap-1 border border-orange-200 flex-shrink-0"
                            >
                              <Plus className="w-3 h-3" /> जोड़ें
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
                  <button
                    onClick={() => setSelectedTopic(null)}
                    className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-all shadow-sm"
                  >
                    पूर्ण (Close)
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
