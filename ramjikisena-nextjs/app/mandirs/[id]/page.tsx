'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import { MapPin, Clock, Phone, Star, Navigation, History, MessageSquare, Send, Info, Calendar, Share2 } from 'lucide-react';
import Navbar from '@/components/Navbar';

interface Mandir {
  _id: string; name: string; description: string; history: string;
  location: { address: string; city: string; state: string; coordinates?: { lat: number; lng: number } };
  timing: { opening: string; closing: string; aarti: string[] };
  contact: { phone: string; email: string; website: string };
  photos: string[];
  deity?: { main?: string; others?: string[] };
  visitInfo?: { bestTimeToVisit?: string; dressCode?: string; entryFee?: string; photographyAllowed?: boolean };
  facilities?: { parking?: boolean; prasad?: boolean; accommodation?: boolean; wheelchairAccessible?: boolean; restrooms?: boolean; drinkingWater?: boolean };
  socialMedia?: { facebook?: string; instagram?: string; youtube?: string; twitter?: string };
  reviews: Array<{ _id: string; user: { name: string; username: string }; rating: number; text: string; createdAt: string }>;
  averageRating: number;
}

export default function PublicMandirDetail() {
  const params = useParams();
  const [mandir, setMandir] = useState<Mandir | null>(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { if (params.id) fetchMandir(); }, [params.id]);

  const fetchMandir = async () => {
    try {
      const res = await api.get(`/api/mandirs/${params.id}`);
      const data = await res.json();
      if (data.success) setMandir(data.mandir);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault(); setSubmitting(true);
    try {
      const res = await api.post(`/api/mandirs/${params.id}/review`, { rating, text: reviewText });
      const data = await res.json();
      if (data.success) { setReviewText(''); setRating(5); fetchMandir(); }
    } catch { alert('Kripya pehle login karein.'); }
    finally { setSubmitting(false); }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#FFFAF3]">
      <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!mandir) return <div className="text-center p-20 text-slate-500">Mandir nahi mila.</div>;

  const facilityList = [
    { key: 'parking' as const, label: 'Parking', emoji: '🅿️' },
    { key: 'prasad' as const, label: 'Prasad', emoji: '🍬' },
    { key: 'accommodation' as const, label: 'Accommodation', emoji: '🏨' },
    { key: 'wheelchairAccessible' as const, label: 'Wheelchair', emoji: '♿' },
    { key: 'restrooms' as const, label: 'Restrooms', emoji: '🚻' },
    { key: 'drinkingWater' as const, label: 'Drinking Water', emoji: '💧' },
  ];

  return (
    <div className="min-h-screen bg-[#FFFAF3] text-slate-800 antialiased selection:bg-orange-200">
      <Navbar showAuthButtons={true} />
      <div className="h-20" />

      {/* Hero */}
      <div className="relative h-[45vh] overflow-hidden bg-slate-900">
        <img src={mandir.photos[0] || 'https://images.unsplash.com/photo-1590059536214-6a6839674092'} className="w-full h-full object-cover opacity-50" alt={mandir.name} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-8 left-0 w-full px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-3">
              <span className="bg-orange-600 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest">Divine Place</span>
              <div className="flex items-center gap-1 bg-white/10 backdrop-blur-md px-3 py-1 rounded-xl border border-white/20">
                <Star size={13} className="fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-black text-white">{mandir.averageRating.toFixed(1)}</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white drop-shadow">{mandir.name}</h1>
            <p className="flex items-center gap-2 text-white/80 mt-2 font-medium text-sm">
              <MapPin size={15} className="text-orange-400" /> {mandir.location.address}, {mandir.location.city}
            </p>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">

            {/* About */}
            <motion.section initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="bg-white rounded-[2rem] border border-orange-100 shadow-sm p-6 md:p-8">
              <h2 className="text-xl font-black text-slate-900 mb-5 flex items-center gap-2">
                <Info size={20} className="text-orange-600" /> Mandir Darshan
              </h2>
              <p className="text-slate-600 leading-relaxed">{mandir.description}</p>
              <div className="grid md:grid-cols-2 gap-4 mt-6">
                <div className="flex gap-3 p-4 bg-orange-50 rounded-2xl">
                  <Clock size={18} className="text-orange-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-black text-slate-800 text-sm">Open Hours</p>
                    <p className="text-sm text-slate-500 mt-0.5">{mandir.timing.opening} – {mandir.timing.closing}</p>
                  </div>
                </div>
                <div className="flex gap-3 p-4 bg-orange-50 rounded-2xl">
                  <Calendar size={18} className="text-orange-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-black text-slate-800 text-sm">Aarti Timing</p>
                    <p className="text-sm text-slate-500 mt-0.5">{mandir.timing.aarti.join(' • ')}</p>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Deity */}
            {mandir.deity?.main && (
              <motion.section initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="bg-white rounded-[2rem] border border-orange-100 border-l-4 border-l-orange-500 shadow-sm p-6 md:p-8">
                <h2 className="text-xl font-black text-slate-900 mb-5">🕉️ Deity Information</h2>
                <p className="text-xs font-black text-orange-600 uppercase tracking-widest mb-1">Main Deity</p>
                <p className="text-2xl font-black text-slate-800 mb-4">{mandir.deity.main}</p>
                {mandir.deity.others && mandir.deity.others.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {mandir.deity.others.map((d, i) => (
                      <span key={i} className="px-3 py-1.5 bg-orange-50 text-orange-700 rounded-full text-sm font-black border border-orange-100">{d}</span>
                    ))}
                  </div>
                )}
              </motion.section>
            )}

            {/* Visit Info */}
            {(mandir.visitInfo?.bestTimeToVisit || mandir.visitInfo?.dressCode || mandir.visitInfo?.entryFee) && (
              <motion.section initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="bg-white rounded-[2rem] border border-orange-100 border-l-4 border-l-slate-400 shadow-sm p-6 md:p-8">
                <h2 className="text-xl font-black text-slate-900 mb-5">ℹ️ Visit Information</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {mandir.visitInfo!.bestTimeToVisit && (
                    <div className="flex gap-3 p-4 bg-orange-50 rounded-2xl">
                      <Clock size={18} className="text-orange-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-black text-slate-800 text-sm">Best Time</p>
                        <p className="text-sm text-slate-500 mt-0.5">{mandir.visitInfo!.bestTimeToVisit}</p>
                      </div>
                    </div>
                  )}
                  {mandir.visitInfo!.entryFee && (
                    <div className="flex gap-3 p-4 bg-orange-50 rounded-2xl">
                      <span className="text-xl shrink-0">💰</span>
                      <div>
                        <p className="font-black text-slate-800 text-sm">Entry Fee</p>
                        <p className="text-sm text-slate-500 mt-0.5">{mandir.visitInfo!.entryFee}</p>
                      </div>
                    </div>
                  )}
                  {mandir.visitInfo!.dressCode && (
                    <div className="flex gap-3 p-4 bg-orange-50 rounded-2xl">
                      <span className="text-xl shrink-0">👔</span>
                      <div>
                        <p className="font-black text-slate-800 text-sm">Dress Code</p>
                        <p className="text-sm text-slate-500 mt-0.5">{mandir.visitInfo!.dressCode}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex gap-3 p-4 bg-orange-50 rounded-2xl">
                    <span className="text-xl shrink-0">📸</span>
                    <div>
                      <p className="font-black text-slate-800 text-sm">Photography</p>
                      <p className="text-sm text-slate-500 mt-0.5">{mandir.visitInfo!.photographyAllowed !== false ? 'Allowed' : 'Not Allowed'}</p>
                    </div>
                  </div>
                </div>
              </motion.section>
            )}

            {/* Facilities */}
            {mandir.facilities && Object.values(mandir.facilities).some(v => v) && (
              <motion.section initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="bg-white rounded-[2rem] border border-orange-100 border-l-4 border-l-teal-500 shadow-sm p-6 md:p-8">
                <h2 className="text-xl font-black text-slate-900 mb-5">🏢 Facilities</h2>
                <div className="flex flex-wrap gap-3">
                  {facilityList.filter(f => mandir.facilities![f.key]).map(f => (
                    <span key={f.key} className="flex items-center gap-2 px-4 py-2 bg-orange-50 border border-orange-100 rounded-full text-sm font-black text-slate-700">
                      {f.emoji} {f.label}
                    </span>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Gallery */}
            {mandir.photos?.length > 0 && (
              <motion.section initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="bg-white rounded-[2rem] border border-orange-100 shadow-sm p-6 md:p-8">
                <h2 className="text-xl font-black text-slate-900 mb-5">📸 Divine Gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {mandir.photos.map((img, i) => (
                    <div key={i} className="rounded-2xl overflow-hidden aspect-square">
                      <img src={img} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" alt="Gallery" />
                    </div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* History */}
            <motion.section initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="bg-slate-900 rounded-[2rem] p-6 md:p-8 relative overflow-hidden">
              <History className="absolute -right-8 -top-8 w-48 h-48 opacity-5" />
              <h2 className="text-xl font-black text-orange-400 mb-5 flex items-center gap-2">
                <History size={20} /> Aitihasik Mahatva
              </h2>
              <p className="text-orange-100/80 leading-relaxed italic whitespace-pre-line">&quot;{mandir.history}&quot;</p>
            </motion.section>

            {/* Reviews */}
            <motion.section initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="bg-white rounded-[2rem] border border-orange-100 shadow-sm p-6 md:p-8">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <MessageSquare size={20} className="text-orange-600" /> Devotee Reviews
                </h2>
                <span className="text-xs font-black text-slate-400">{mandir.reviews.length} total</span>
              </div>
              <div className="space-y-5">
                {mandir.reviews.map(rev => (
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

            {/* Social */}
            {mandir.socialMedia && Object.values(mandir.socialMedia).some(v => v) && (
              <motion.section initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="bg-white rounded-[2rem] border border-orange-100 border-l-4 border-l-blue-400 shadow-sm p-6 md:p-8">
                <h2 className="text-xl font-black text-slate-900 mb-5">📱 Connect With Us</h2>
                <div className="grid grid-cols-2 gap-3">
                  {mandir.socialMedia.facebook && (
                    <a href={mandir.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-orange-50 hover:bg-orange-100 rounded-2xl border border-orange-100 transition-all">
                      <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white font-black text-sm">f</div>
                      <span className="font-black text-slate-700 text-sm">Facebook</span>
                    </a>
                  )}
                  {mandir.socialMedia.instagram && (
                    <a href={mandir.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-orange-50 hover:bg-orange-100 rounded-2xl border border-orange-100 transition-all">
                      <div className="w-9 h-9 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white text-sm">📷</div>
                      <span className="font-black text-slate-700 text-sm">Instagram</span>
                    </a>
                  )}
                  {mandir.socialMedia.youtube && (
                    <a href={mandir.socialMedia.youtube} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-orange-50 hover:bg-orange-100 rounded-2xl border border-orange-100 transition-all">
                      <div className="w-9 h-9 bg-red-600 rounded-full flex items-center justify-center text-white font-black text-sm">▶</div>
                      <span className="font-black text-slate-700 text-sm">YouTube</span>
                    </a>
                  )}
                  {mandir.socialMedia.twitter && (
                    <a href={mandir.socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-orange-50 hover:bg-orange-100 rounded-2xl border border-orange-100 transition-all">
                      <div className="w-9 h-9 bg-sky-500 rounded-full flex items-center justify-center text-white font-black text-sm">𝕏</div>
                      <span className="font-black text-slate-700 text-sm">Twitter</span>
                    </a>
                  )}
                </div>
              </motion.section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4">
            <div className="bg-white rounded-[2rem] border border-orange-100 shadow-sm p-6 sticky top-24">
              <div className="text-center mb-6 pb-6 border-b border-orange-50">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Rating</p>
                <h2 className="text-5xl font-black text-slate-900">{mandir.averageRating.toFixed(1)}</h2>
                <div className="flex justify-center gap-1 text-yellow-500 mt-2">
                  {[...Array(5)].map((_, i) => <Star key={i} size={18} fill={i < Math.round(mandir.averageRating) ? 'currentColor' : 'none'} />)}
                </div>
                <p className="text-xs text-slate-400 mt-1">{mandir.reviews.length} reviews</p>
              </div>
              <div className="space-y-3 mb-6">
                <button onClick={() => window.open(`https://maps.google.com/?q=${mandir.location.coordinates?.lat},${mandir.location.coordinates?.lng}`)}
                  className="w-full bg-orange-600 text-white rounded-2xl font-black py-3.5 flex items-center justify-center gap-2 hover:bg-orange-700 transition-all active:scale-95">
                  <Navigation size={18} /> Get Directions
                </button>
                <div className="grid grid-cols-2 gap-3">
                  <a href={`tel:${mandir.contact.phone}`} className="flex flex-col items-center justify-center p-3.5 bg-orange-50 rounded-2xl text-orange-600 hover:bg-orange-100 transition font-black text-xs gap-1">
                    <Phone size={18} /> Call Now
                  </a>
                  <button className="flex flex-col items-center justify-center p-3.5 bg-orange-50 rounded-2xl text-orange-600 hover:bg-orange-100 transition font-black text-xs gap-1">
                    <Share2 size={18} /> Share
                  </button>
                </div>
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
                    placeholder="Mandir ke baare mein kuch likhein..." />
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
