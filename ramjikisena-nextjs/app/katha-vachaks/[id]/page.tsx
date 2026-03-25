'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Star, MessageSquare, Send, Calendar, Radio, ExternalLink, Award, Clock } from 'lucide-react';
import Navbar from '@/components/Navbar';

interface KathaVachak {
  _id: string; name: string; photo: string; photos?: string[];
  experience: number; specialization: string; description: string;
  contact: { phone?: string; email?: string; whatsapp?: string };
  liveKathas: Array<{
    _id: string; addressLine1?: string; addressLine2?: string;
    city: string; state: string; country: string; pincode?: string;
    startDate: string; endDate: string; liveLink?: string; kathaType: string; isActive: boolean;
  }>;
  socialMedia?: { facebook?: string; instagram?: string; youtube?: string; twitter?: string };
  reviews: Array<{ _id: string; user: { name: string; username: string }; rating: number; text: string; createdAt: string }>;
  averageRating: number;
}

export default function KathaVachakDetail() {
  const params = useParams();
  const [kathaVachak, setKathaVachak] = useState<KathaVachak | null>(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { if (params.id) fetchKathaVachak(); }, [params.id]);

  const fetchKathaVachak = async () => {
    try {
      const res = await api.get(`/api/katha-vachaks/${params.id}`);
      const data = await res.json();
      if (data.success) setKathaVachak(data.kathaVachak);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault(); setSubmitting(true);
    try {
      const res = await api.post(`/api/katha-vachaks/${params.id}/review`, { rating, text: reviewText });
      const data = await res.json();
      if (data.success) { setReviewText(''); setRating(5); fetchKathaVachak(); alert('Review submitted!'); }
    } catch { alert('Kripya pehle login karein.'); }
    finally { setSubmitting(false); }
  };

  const getCurrentLiveKatha = () => {
    if (!kathaVachak) return null;
    const now = new Date();
    return kathaVachak.liveKathas.find(k => {
      if (!k.isActive) return false;
      const start = new Date(k.startDate);
      if (!k.endDate) return start <= now;
      return start <= now && new Date(k.endDate) >= now;
    });
  };

  const getUpcomingKathas = () => {
    if (!kathaVachak) return [];
    const now = new Date();
    return kathaVachak.liveKathas
      .filter(k => k.isActive && new Date(k.startDate) > now)
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  };

  const getYouTubeVideoId = (url: string) => {
    if (!url) return null;
    const p1 = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
    const p2 = /youtube\.com\/live\/([^&\n?#]+)/;
    return (url.match(p1) || url.match(p2) || [])[1] || null;
  };

  const fmt = (d: string) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#FFFAF3]">
      <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!kathaVachak) return <div className="text-center p-20 text-slate-500">Katha Vachak not found.</div>;

  const currentLive = getCurrentLiveKatha();
  const upcoming = getUpcomingKathas();

  return (
    <div className="min-h-screen bg-[#FFFAF3] text-slate-800 antialiased selection:bg-orange-200">
      <Navbar showAuthButtons={true} />
      <div className="h-20" />

      {/* Hero */}
      <div className="relative h-[45vh] overflow-hidden bg-slate-900">
        {kathaVachak.photo
          ? <img src={kathaVachak.photo} className="w-full h-full object-cover opacity-50" alt={kathaVachak.name} />
          : <div className="w-full h-full flex items-center justify-center text-9xl opacity-10">🙏</div>
        }
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-8 left-0 w-full px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-3">
              {currentLive && (
                <span className="bg-red-500 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-2 animate-pulse">
                  <Radio size={12} /> LIVE NOW
                </span>
              )}
              <div className="flex items-center gap-1 bg-white/10 backdrop-blur-md px-3 py-1 rounded-xl border border-white/20">
                <Star size={13} className="fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-black text-white">{kathaVachak.averageRating.toFixed(1)}</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white drop-shadow">{kathaVachak.name}</h1>
            <p className="text-orange-300 mt-2 font-black text-sm uppercase tracking-widest">
              {kathaVachak.specialization || 'Katha Vachak'}
            </p>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">

            <motion.section initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="bg-white rounded-[2rem] border border-orange-100 shadow-sm p-6 md:p-8">
              <h2 className="text-xl font-black text-slate-900 mb-5">📖 About</h2>
              <p className="text-slate-600 leading-relaxed mb-6">{kathaVachak.description}</p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-2xl">
                  <Award className="text-orange-600" size={20} />
                  <div>
                    <p className="text-xs text-slate-500 font-black uppercase tracking-widest">Experience</p>
                    <p className="font-black text-slate-800">{kathaVachak.experience} Years</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-2xl">
                  <MessageSquare className="text-orange-600" size={20} />
                  <div>
                    <p className="text-xs text-slate-500 font-black uppercase tracking-widest">Reviews</p>
                    <p className="font-black text-slate-800">{kathaVachak.reviews.length}</p>
                  </div>
                </div>
              </div>
            </motion.section>

            {currentLive && (
              <motion.section initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="bg-white rounded-[2rem] border border-orange-100 border-l-4 border-l-red-500 shadow-sm p-6 md:p-8">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                  <h2 className="text-xl font-black text-red-600">🔴 LIVE KATHA NOW</h2>
                </div>
                <h3 className="text-lg font-black text-slate-800 mb-4">{currentLive.kathaType}</h3>
                <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-2xl mb-3">
                  <MapPin size={18} className="shrink-0 mt-0.5 text-orange-600" />
                  <div>
                    <p className="font-black text-slate-800 text-sm mb-1">Location</p>
                    {currentLive.addressLine1 && <p className="text-sm text-slate-600">{currentLive.addressLine1}</p>}
                    <p className="font-black text-slate-800 text-sm">{currentLive.city}, {currentLive.state}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-2xl mb-3">
                  <Calendar size={18} className="shrink-0 mt-0.5 text-orange-600" />
                  <div className="grid grid-cols-2 gap-4 flex-1">
                    <div>
                      <p className="text-xs text-slate-500 uppercase font-black">Start</p>
                      <p className="font-black text-green-700 text-sm">{currentLive.startDate ? fmt(currentLive.startDate) : 'TBD'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase font-black">End</p>
                      <p className="font-black text-red-700 text-sm">{currentLive.endDate ? fmt(currentLive.endDate) : 'Ongoing'}</p>
                    </div>
                  </div>
                </div>
                {currentLive.liveLink && (() => {
                  const vid = getYouTubeVideoId(currentLive.liveLink);
                  if (vid) return (
                    <div>
                      <p className="font-black text-slate-800 text-sm mb-2">🔴 Live Stream</p>
                      <div className="relative w-full rounded-2xl overflow-hidden" style={{ paddingBottom: '56.25%' }}>
                        <iframe className="absolute top-0 left-0 w-full h-full" src={`https://www.youtube.com/embed/${vid}?autoplay=0`} title="Live Katha" frameBorder="0" allowFullScreen />
                      </div>
                    </div>
                  );
                  return (
                    <a href={currentLive.liveLink} target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full bg-red-600 text-white py-3.5 rounded-2xl font-black hover:bg-red-700 transition-all active:scale-95">
                      <ExternalLink size={18} /> Watch Live Stream
                    </a>
                  );
                })()}
              </motion.section>
            )}

            {upcoming.length > 0 && (
              <motion.section initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="bg-white rounded-[2rem] border border-orange-100 shadow-sm p-6 md:p-8">
                <h2 className="text-xl font-black text-slate-900 mb-5 flex items-center gap-2">
                  <Calendar className="text-orange-600" size={20} /> Upcoming Kathas
                  <span className="ml-auto text-xs font-black text-slate-400">{upcoming.length} scheduled</span>
                </h2>
                <div className="space-y-4">
                  {upcoming.map(k => (
                    <div key={k._id} className="p-5 bg-orange-50 rounded-2xl border border-orange-100">
                      <h3 className="font-black text-slate-800 mb-3">{k.kathaType}</h3>
                      <div className="flex items-start gap-2 mb-2">
                        <MapPin size={15} className="shrink-0 mt-0.5 text-orange-600" />
                        <p className="font-black text-slate-700 text-sm">{k.city}, {k.state}</p>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock size={15} className="text-orange-600" />
                        <span className="text-green-700 font-black">{k.startDate ? fmt(k.startDate) : 'TBA'}</span>
                        <span className="text-slate-400">→</span>
                        <span className="text-red-700 font-black">{k.endDate ? fmt(k.endDate) : 'TBA'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}

            {((kathaVachak.photos && kathaVachak.photos.length > 0) || kathaVachak.photo) && (
              <motion.section initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="bg-white rounded-[2rem] border border-orange-100 shadow-sm p-6 md:p-8">
                <h2 className="text-xl font-black text-slate-900 mb-5">📸 Photo Gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {(kathaVachak.photos && kathaVachak.photos.length > 0 ? kathaVachak.photos : [kathaVachak.photo]).map((photo, i) => (
                    <div key={i} className="aspect-square rounded-2xl overflow-hidden">
                      <img src={photo} alt={`${kathaVachak.name} ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                    </div>
                  ))}
                </div>
              </motion.section>
            )}

            <motion.section initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="bg-white rounded-[2rem] border border-orange-100 shadow-sm p-6 md:p-8">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <MessageSquare size={20} className="text-orange-600" /> Reviews
                </h2>
                <span className="text-xs font-black text-slate-400">{kathaVachak.reviews.length} total</span>
              </div>
              <div className="space-y-5">
                {kathaVachak.reviews.map(rev => (
                  <div key={rev._id} className="border-b border-orange-50 pb-5 last:border-none">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-9 h-9 rounded-full bg-orange-600 flex items-center justify-center text-white font-black text-sm shrink-0">
                        {rev.user.name[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-black text-slate-800 text-sm">{rev.user.name}</p>
                        <div className="flex gap-0.5 text-yellow-500">
                          {[...Array(5)].map((_, i) => <Star key={i} size={11} fill={i < rev.rating ? 'currentColor' : 'none'} />)}
                        </div>
                      </div>
                    </div>
                    <p className="text-slate-600 text-sm italic pl-12">&quot;{rev.text}&quot;</p>
                  </div>
                ))}
              </div>
            </motion.section>

            {kathaVachak.socialMedia && Object.values(kathaVachak.socialMedia).some(v => v) && (
              <motion.section initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="bg-white rounded-[2rem] border border-orange-100 border-l-4 border-l-blue-400 shadow-sm p-6 md:p-8">
                <h2 className="text-xl font-black text-slate-900 mb-5">📱 Connect With Us</h2>
                <div className="grid grid-cols-2 gap-3">
                  {kathaVachak.socialMedia.facebook && (
                    <a href={kathaVachak.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-orange-50 hover:bg-orange-100 rounded-2xl border border-orange-100 transition-all">
                      <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white font-black text-sm">f</div>
                      <span className="font-black text-slate-700 text-sm">Facebook</span>
                    </a>
                  )}
                  {kathaVachak.socialMedia.instagram && (
                    <a href={kathaVachak.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-orange-50 hover:bg-orange-100 rounded-2xl border border-orange-100 transition-all">
                      <div className="w-9 h-9 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white text-sm">📷</div>
                      <span className="font-black text-slate-700 text-sm">Instagram</span>
                    </a>
                  )}
                  {kathaVachak.socialMedia.youtube && (
                    <a href={kathaVachak.socialMedia.youtube} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-orange-50 hover:bg-orange-100 rounded-2xl border border-orange-100 transition-all">
                      <div className="w-9 h-9 bg-red-600 rounded-full flex items-center justify-center text-white font-black text-sm">▶</div>
                      <span className="font-black text-slate-700 text-sm">YouTube</span>
                    </a>
                  )}
                  {kathaVachak.socialMedia.twitter && (
                    <a href={kathaVachak.socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-orange-50 hover:bg-orange-100 rounded-2xl border border-orange-100 transition-all">
                      <div className="w-9 h-9 bg-sky-500 rounded-full flex items-center justify-center text-white font-black text-sm">𝕏</div>
                      <span className="font-black text-slate-700 text-sm">Twitter</span>
                    </a>
                  )}
                </div>
              </motion.section>
            )}
          </div>

          <aside className="lg:col-span-4">
            <div className="bg-white rounded-[2rem] border border-orange-100 shadow-sm p-6 sticky top-24">
              <div className="text-center mb-6 pb-6 border-b border-orange-50">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Rating</p>
                <h2 className="text-5xl font-black text-slate-900">{kathaVachak.averageRating.toFixed(1)}</h2>
                <div className="flex justify-center gap-1 text-yellow-500 mt-2">
                  {[...Array(5)].map((_, i) => <Star key={i} size={18} fill={i < Math.round(kathaVachak.averageRating) ? 'currentColor' : 'none'} />)}
                </div>
                <p className="text-xs text-slate-400 mt-1">{kathaVachak.reviews.length} reviews</p>
              </div>
              <div className="space-y-3 mb-6">
                {kathaVachak.contact.phone && (
                  <a href={`tel:${kathaVachak.contact.phone}`} className="flex items-center gap-3 p-4 bg-orange-50 rounded-2xl hover:bg-orange-100 transition">
                    <Phone size={18} className="text-orange-600 shrink-0" />
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone</p>
                      <p className="font-black text-slate-800 text-sm">{kathaVachak.contact.phone}</p>
                    </div>
                  </a>
                )}
                {kathaVachak.contact.email && (
                  <a href={`mailto:${kathaVachak.contact.email}`} className="flex items-center gap-3 p-4 bg-orange-50 rounded-2xl hover:bg-orange-100 transition">
                    <Mail size={18} className="text-orange-600 shrink-0" />
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</p>
                      <p className="font-black text-slate-800 text-sm truncate">{kathaVachak.contact.email}</p>
                    </div>
                  </a>
                )}
              </div>
              <div className="pt-6 border-t border-orange-50">
                <h4 className="font-black text-slate-900 mb-4 text-sm">Your Experience</h4>
                <form onSubmit={handleSubmitReview} className="space-y-3">
                  <div className="flex gap-2 justify-center">
                    {[1,2,3,4,5].map(s => (
                      <button key={s} type="button" onClick={() => setRating(s)} className={`transition-all ${s <= rating ? 'text-yellow-500 scale-110' : 'text-slate-300'}`}>
                        <Star size={22} fill={s <= rating ? 'currentColor' : 'none'} />
                      </button>
                    ))}
                  </div>
                  <textarea value={reviewText} onChange={e => setReviewText(e.target.value)}
                    className="w-full bg-orange-50 border border-orange-100 rounded-2xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 min-h-[90px] resize-none"
                    placeholder="Share your experience..." />
                  <button disabled={submitting}
                    className="w-full bg-orange-600 text-white rounded-2xl font-black py-3 flex items-center justify-center gap-2 hover:bg-orange-700 transition-all active:scale-95 disabled:opacity-60">
                    {submitting ? 'Processing...' : <><Send size={16} /> Submit Review</>}
                  </button>
                </form>
              </div>
            </div>
          </aside>
        </div>
      </main>
      <footer className="py-12 text-center border-t border-orange-100 mt-10">
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.8em]">जय श्री राम</p>
      </footer>
    </div>
  );
}
