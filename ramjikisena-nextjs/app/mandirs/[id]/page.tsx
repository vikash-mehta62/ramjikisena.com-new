'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import {
  MapPin, Clock, Phone, Star, Navigation, History, MessageSquare,
  Send, Info, Calendar, Share2, Globe, Camera, Accessibility,
  Car, Droplets, Utensils, BedDouble, ShieldPlus, ShoppingBag,
  Building2, Users, Video, ExternalLink
} from 'lucide-react';
import Navbar from '@/components/Navbar';

interface Mandir {
  _id: string; name: string; description: string; history: string; significance?: string;
  templeType?: string; architecture?: string; builtYear?: string; languages?: string[];
  location: { address: string; city: string; state: string; pincode?: string; country?: string; coordinates?: { lat: number; lng: number } };
  timing: {
    opening: string; closing: string;
    aarti: Array<{ name: string; time: string } | string>;
    specialTimings?: string;
    specialDays?: Array<{ day: string; opening: string; closing: string; note: string }>;
  };
  contact: { phone: string; email: string; website: string };
  photos: string[]; videos?: string[];
  deity?: { main?: string; others?: string[] };
  festivals?: Array<{ name: string; month: string; description: string }>;
  visitInfo?: {
    bestTimeToVisit?: string; dressCode?: string; entryFee?: string;
    photographyAllowed?: boolean; mobileAllowed?: boolean; shoeStand?: boolean;
    annualVisitors?: string; donationInfo?: string; trustName?: string; managedBy?: string;
  };
  facilities?: { parking?: boolean; prasad?: boolean; accommodation?: boolean; wheelchairAccessible?: boolean; restrooms?: boolean; drinkingWater?: boolean; cloakroom?: boolean; medicalAid?: boolean; foodStalls?: boolean };
  nearbyAttractions?: Array<{ name: string; distance: string; type: string }>;
  socialMedia?: { facebook?: string; instagram?: string; youtube?: string; twitter?: string };
  reviews: Array<{ _id: string; user: { name: string; username: string }; rating: number; text: string; createdAt: string }>;
  averageRating: number;
}

export default function PublicMandirDetail() {
  const params = useParams();
  const router = useRouter();
  const [mandir, setMandir] = useState<Mandir | null>(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [activePhoto, setActivePhoto] = useState(0);
  const [user, setUser] = useState<{ name: string; _id: string } | null>(null);
  const [visitType, setVisitType] = useState<'visited' | 'planning' | ''>('');
  const [visitNote, setVisitNote] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    if (params.id) fetchMandir();
    const u = localStorage.getItem('user');
    if (u) setUser(JSON.parse(u));
  }, [params.id]);

  const fetchMandir = async () => {
    try {
      const res = await api.get(`/api/mandirs/${params.id}`);
      const data = await res.json();
      if (data.success) setMandir(data.mandir);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { router.push('/login'); return; }
    setSubmitting(true);
    try {
      const res = await api.post(`/api/mandirs/${params.id}/review`, { rating, text: reviewText });
      const data = await res.json();
      if (data.success) {
        setReviewText(''); setRating(5); setReviewSuccess(true);
        fetchMandir();
        setTimeout(() => setReviewSuccess(false), 3000);
      } else { alert(data.message || 'Error submitting review'); }
    } catch { alert('Kripya pehle login karein.'); }
    finally { setSubmitting(false); }
  };

  const handleShare = () => {
    if (navigator.share) navigator.share({ title: mandir?.name, url: window.location.href });
    else navigator.clipboard.writeText(window.location.href).then(() => alert('Link copied!'));
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#FFFAF3]">
      <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!mandir) return <div className="text-center p-20 text-slate-500">Mandir nahi mila.</div>;

  const facilityList = [
    { key: 'parking' as const, label: 'Parking', icon: Car },
    { key: 'prasad' as const, label: 'Prasad', icon: ShoppingBag },
    { key: 'accommodation' as const, label: 'Accommodation', icon: BedDouble },
    { key: 'wheelchairAccessible' as const, label: 'Wheelchair', icon: Accessibility },
    { key: 'restrooms' as const, label: 'Restrooms', icon: Users },
    { key: 'drinkingWater' as const, label: 'Drinking Water', icon: Droplets },
    { key: 'cloakroom' as const, label: 'Cloakroom', icon: ShieldPlus },
    { key: 'medicalAid' as const, label: 'Medical Aid', icon: ShieldPlus },
    { key: 'foodStalls' as const, label: 'Food Stalls', icon: Utensils },
  ];

  const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
    <motion.section initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      className={`bg-white rounded-[2rem] border border-orange-100 shadow-sm p-6 md:p-8 ${className}`}>
      {children}
    </motion.section>
  );

  const SectionTitle = ({ icon, title }: { icon: React.ReactNode; title: string }) => (
    <h2 className="text-xl font-black text-slate-900 mb-5 flex items-center gap-2">{icon}{title}</h2>
  );

  const InfoChip = ({ emoji, label, value }: { emoji: string; label: string; value: string }) => (
    <div className="flex gap-3 p-4 bg-orange-50 rounded-2xl">
      <span className="text-xl shrink-0">{emoji}</span>
      <div><p className="font-black text-slate-800 text-sm">{label}</p><p className="text-sm text-slate-500 mt-0.5">{value}</p></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FFFAF3] text-slate-800 antialiased">
      <Navbar showAuthButtons={true} />
      <div className="h-20" />

      {/* Hero with photo gallery */}
      <div className="relative h-[50vh] overflow-hidden bg-slate-900">
        <img src={mandir.photos[activePhoto] || 'https://images.unsplash.com/photo-1590059536214-6a6839674092'}
          className="w-full h-full object-cover opacity-60 transition-all duration-500" alt={mandir.name} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        {/* Photo thumbnails */}
        {mandir.photos.length > 1 && (
          <div className="absolute bottom-24 left-4 flex gap-2">
            {mandir.photos.slice(0, 5).map((p, i) => (
              <button key={i} onClick={() => setActivePhoto(i)}
                className={`w-10 h-10 rounded-xl overflow-hidden border-2 transition-all ${activePhoto === i ? 'border-orange-400 scale-110' : 'border-white/30'}`}>
                <img src={p} className="w-full h-full object-cover" alt="" />
              </button>
            ))}
          </div>
        )}
        <div className="absolute bottom-6 left-0 w-full px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              {mandir.templeType && mandir.templeType !== 'Other' && (
                <span className="bg-orange-600 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest">{mandir.templeType}</span>
              )}
              <div className="flex items-center gap-1 bg-white/10 backdrop-blur-md px-3 py-1 rounded-xl border border-white/20">
                <Star size={13} className="fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-black text-white">{mandir.averageRating.toFixed(1)}</span>
              </div>
              {mandir.visitInfo?.annualVisitors && (
                <span className="bg-white/10 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-xl border border-white/20">
                  👥 {mandir.visitInfo.annualVisitors} visitors/year
                </span>
              )}
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white drop-shadow">{mandir.name}</h1>
            <p className="flex items-center gap-2 text-white/80 mt-1 font-medium text-sm">
              <MapPin size={14} className="text-orange-400" />
              {[mandir.location.address, mandir.location.city, mandir.location.state, mandir.location.pincode].filter(Boolean).join(', ')}
            </p>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">

            {/* Quick Info Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { emoji: '🏛️', label: 'Architecture', value: mandir.architecture || '—' },
                { emoji: '📅', label: 'Built', value: mandir.builtYear || '—' },
                { emoji: '💰', label: 'Entry Fee', value: mandir.visitInfo?.entryFee || 'Free' },
                { emoji: '🕐', label: 'Timings', value: mandir.timing.opening && mandir.timing.closing ? `${mandir.timing.opening} – ${mandir.timing.closing}` : '—' },
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-2xl p-4 border border-orange-100 text-center shadow-sm">
                  <p className="text-2xl mb-1">{item.emoji}</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</p>
                  <p className="text-sm font-black text-slate-800 mt-0.5 truncate">{item.value}</p>
                </div>
              ))}
            </div>

            {/* About */}
            <Card>
              <SectionTitle icon={<Info size={20} className="text-orange-600" />} title="मंदिर परिचय" />
              {mandir.description && <p className="text-slate-600 leading-relaxed mb-4">{mandir.description}</p>}
              {mandir.significance && (
                <div className="bg-orange-50 border-l-4 border-orange-500 rounded-r-2xl p-4">
                  <p className="text-xs font-black text-orange-600 uppercase tracking-widest mb-1">धार्मिक महत्व</p>
                  <p className="text-slate-700 text-sm leading-relaxed">{mandir.significance}</p>
                </div>
              )}
              {mandir.timing.aarti?.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs font-black text-orange-600 uppercase tracking-widest mb-3 flex items-center gap-1">
                    🔔 आरती समय
                  </p>
                  <div className="grid md:grid-cols-2 gap-2">
                    {mandir.timing.aarti.map((a, i) => {
                      const name = typeof a === 'string' ? a : a.name;
                      const time = typeof a === 'string' ? '' : a.time;
                      return (
                        <div key={i} className="flex items-center justify-between px-4 py-2.5 bg-orange-50 rounded-2xl border border-orange-100">
                          <div className="flex items-center gap-2">
                            <span className="text-orange-500">🪔</span>
                            <span className="text-sm font-black text-slate-800">{name || `Aarti ${i+1}`}</span>
                          </div>
                          {time && <span className="text-sm font-bold text-orange-600 bg-orange-100 px-2.5 py-0.5 rounded-full">{time}</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              {mandir.timing.specialTimings && (
                <div className="mt-3 flex gap-3 p-4 bg-yellow-50 rounded-2xl border border-yellow-100">
                  <span className="text-xl shrink-0">⚠️</span>
                  <div><p className="font-black text-slate-800 text-sm">Special Timings</p>
                    <p className="text-sm text-slate-500 mt-0.5">{mandir.timing.specialTimings}</p></div>
                </div>
              )}
              {/* Special Days */}
              {mandir.timing.specialDays && mandir.timing.specialDays.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs font-black text-orange-600 uppercase tracking-widest mb-3">📅 विशेष दिन</p>
                  <div className="space-y-2">
                    {mandir.timing.specialDays.map((d, i) => (
                      <div key={i} className="flex items-center justify-between px-4 py-2.5 bg-blue-50 rounded-2xl border border-blue-100">
                        <span className="text-sm font-black text-slate-800">{d.day}</span>
                        <div className="text-right">
                          {(d.opening || d.closing) && (
                            <p className="text-sm font-bold text-blue-700">{d.opening}{d.opening && d.closing ? ' – ' : ''}{d.closing}</p>
                          )}
                          {d.note && <p className="text-xs text-slate-500">{d.note}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>

            {/* Deity */}
            {mandir.deity?.main && (
              <Card className="border-l-4 border-l-orange-500">
                <SectionTitle icon="🕉️" title="देवता जानकारी" />
                <p className="text-xs font-black text-orange-600 uppercase tracking-widest mb-1">मुख्य देवता</p>
                <p className="text-2xl font-black text-slate-800 mb-4">{mandir.deity.main}</p>
                {mandir.deity.others && mandir.deity.others.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {mandir.deity.others.map((d, i) => (
                      <span key={i} className="px-3 py-1.5 bg-orange-50 text-orange-700 rounded-full text-sm font-black border border-orange-100">{d}</span>
                    ))}
                  </div>
                )}
              </Card>
            )}

            {/* Visit Info */}
            {mandir.visitInfo && Object.values(mandir.visitInfo).some(v => v) && (
              <Card className="border-l-4 border-l-blue-400">
                <SectionTitle icon={<Info size={20} className="text-blue-600" />} title="यात्रा जानकारी" />
                <div className="grid md:grid-cols-2 gap-3">
                  {mandir.visitInfo.bestTimeToVisit && <InfoChip emoji="🌅" label="Best Time to Visit" value={mandir.visitInfo.bestTimeToVisit} />}
                  {mandir.visitInfo.entryFee && <InfoChip emoji="💰" label="Entry Fee" value={mandir.visitInfo.entryFee} />}
                  {mandir.visitInfo.dressCode && <InfoChip emoji="👔" label="Dress Code" value={mandir.visitInfo.dressCode} />}
                  {mandir.visitInfo.annualVisitors && <InfoChip emoji="👥" label="Annual Visitors" value={mandir.visitInfo.annualVisitors} />}
                  <InfoChip emoji="📸" label="Photography" value={mandir.visitInfo.photographyAllowed !== false ? 'Allowed' : 'Not Allowed'} />
                  <InfoChip emoji="📱" label="Mobile Phones" value={mandir.visitInfo.mobileAllowed !== false ? 'Allowed' : 'Not Allowed'} />
                  {mandir.visitInfo.shoeStand !== undefined && <InfoChip emoji="👟" label="Shoe Stand" value={mandir.visitInfo.shoeStand ? 'Available' : 'Not Available'} />}
                  {(mandir.visitInfo as any).trustName && <InfoChip emoji="🏛️" label="Trust / Committee" value={(mandir.visitInfo as any).trustName} />}
                  {(mandir.visitInfo as any).managedBy && <InfoChip emoji="🏢" label="Managed By" value={(mandir.visitInfo as any).managedBy} />}
                  {(mandir.visitInfo as any).donationInfo && (
                    <div className="md:col-span-2 flex gap-3 p-4 bg-orange-50 rounded-2xl">
                      <span className="text-xl shrink-0">🙏</span>
                      <div><p className="font-black text-slate-800 text-sm">Donation Info</p>
                        <p className="text-sm text-slate-500 mt-0.5">{(mandir.visitInfo as any).donationInfo}</p></div>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Facilities */}
            {mandir.facilities && Object.values(mandir.facilities).some(v => v) && (
              <Card className="border-l-4 border-l-teal-500">
                <SectionTitle icon={<Building2 size={20} className="text-teal-600" />} title="सुविधाएं" />
                <div className="flex flex-wrap gap-3">
                  {facilityList.filter(f => mandir.facilities![f.key]).map(f => (
                    <span key={f.key} className="flex items-center gap-2 px-4 py-2 bg-teal-50 border border-teal-100 rounded-full text-sm font-black text-slate-700">
                      <f.icon size={14} className="text-teal-600" /> {f.label}
                    </span>
                  ))}
                </div>
              </Card>
            )}

            {/* Festivals */}
            {mandir.festivals && mandir.festivals.length > 0 && (
              <Card className="border-l-4 border-l-purple-400">
                <SectionTitle icon={<Calendar size={20} className="text-purple-600" />} title="प्रमुख त्योहार" />
                <div className="space-y-3">
                  {mandir.festivals.map((f, i) => (
                    <div key={i} className="flex gap-4 p-4 bg-purple-50 rounded-2xl border border-purple-100">
                      <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white font-black text-sm shrink-0">{i + 1}</div>
                      <div>
                        <p className="font-black text-slate-800">{f.name}</p>
                        {f.month && <p className="text-xs text-purple-600 font-bold">{f.month}</p>}
                        {f.description && <p className="text-sm text-slate-500 mt-1">{f.description}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Gallery */}
            {mandir.photos?.length > 0 && (
              <Card>
                <SectionTitle icon={<Camera size={20} className="text-pink-600" />} title="फोटो गैलरी" />
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {mandir.photos.map((img, i) => (
                    <div key={i} onClick={() => setActivePhoto(i)}
                      className="rounded-2xl overflow-hidden aspect-square cursor-pointer hover:opacity-90 transition-opacity">
                      <img src={img} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" alt="Gallery" />
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Videos */}
            {mandir.videos && mandir.videos.length > 0 && (
              <Card>
                <SectionTitle icon={<Video size={20} className="text-red-600" />} title="वीडियो" />
                <div className="grid md:grid-cols-2 gap-4">
                  {mandir.videos.map((v, i) => (
                    <div key={i} className="rounded-2xl overflow-hidden aspect-video bg-slate-100">
                      <iframe src={v} className="w-full h-full" allowFullScreen title={`Video ${i + 1}`} />
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* History */}
            {mandir.history && (
              <motion.section initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="bg-slate-900 rounded-[2rem] p-6 md:p-8 relative overflow-hidden">
                <History className="absolute -right-8 -top-8 w-48 h-48 opacity-5" />
                <h2 className="text-xl font-black text-orange-400 mb-5 flex items-center gap-2">
                  <History size={20} /> ऐतिहासिक महत्व
                </h2>
                <p className="text-orange-100/80 leading-relaxed italic whitespace-pre-line">&quot;{mandir.history}&quot;</p>
              </motion.section>
            )}

            {/* Nearby Attractions */}
            {mandir.nearbyAttractions && mandir.nearbyAttractions.length > 0 && (
              <Card className="border-l-4 border-l-green-400">
                <SectionTitle icon={<MapPin size={20} className="text-green-600" />} title="आस-पास के स्थान" />
                <div className="space-y-2">
                  {mandir.nearbyAttractions.map((a, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-green-50 rounded-2xl border border-green-100">
                      <div>
                        <p className="font-black text-slate-800 text-sm">{a.name}</p>
                        <p className="text-xs text-slate-500">{a.type}</p>
                      </div>
                      <span className="text-xs font-black text-green-700 bg-green-100 px-3 py-1 rounded-full">{a.distance}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Languages */}
            {mandir.languages && mandir.languages.length > 0 && (
              <Card>
                <SectionTitle icon={<Globe size={20} className="text-indigo-600" />} title="भाषाएं" />
                <div className="flex flex-wrap gap-2">
                  {mandir.languages.map((l, i) => (
                    <span key={i} className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-black border border-indigo-100">{l}</span>
                  ))}
                </div>
              </Card>
            )}

            {/* Reviews */}
            <Card>
              <div id="reviews" className="flex justify-between items-center mb-5">
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <MessageSquare size={20} className="text-orange-600" /> भक्तों के अनुभव
                </h2>
                <span className="text-xs font-black text-slate-400">{mandir.reviews.length} reviews</span>
              </div>

              {/* Write Review — inline in main content */}
              <div className="mb-6 pb-6 border-b border-orange-100">
                {user ? (
                  <form onSubmit={handleSubmitReview} className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-orange-600 flex items-center justify-center text-white font-black text-sm shrink-0">
                        {user.name[0]?.toUpperCase()}
                      </div>
                      <p className="text-sm font-black text-slate-700">{user.name} के रूप में review लिखें</p>
                    </div>
                    {/* Star Rating */}
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map(s => (
                        <button key={s} type="button" onClick={() => setRating(s)}
                          className={`transition-all ${s <= rating ? 'text-yellow-500 scale-110' : 'text-slate-300'}`}>
                          <Star size={26} fill={s <= rating ? 'currentColor' : 'none'} />
                        </button>
                      ))}
                      <span className="ml-2 text-sm font-black text-slate-500 self-center">
                        {['','बहुत बुरा','बुरा','ठीक है','अच्छा','बहुत अच्छा'][rating]}
                      </span>
                    </div>
                    {/* Visit Type */}
                    <div className="flex gap-2">
                      {[{v:'visited',label:'✅ मैंने दर्शन किए'},{v:'planning',label:'📅 जाने की योजना है'}].map(opt => (
                        <button key={opt.v} type="button" onClick={() => setVisitType(visitType === opt.v ? '' : opt.v as any)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${visitType === opt.v ? 'bg-orange-600 text-white' : 'bg-orange-50 text-orange-700 border border-orange-200'}`}>
                          {opt.label}
                        </button>
                      ))}
                    </div>
                    <textarea value={reviewText} onChange={e => setReviewText(e.target.value)}
                      className="w-full bg-orange-50 border border-orange-100 rounded-2xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 min-h-[90px] resize-none"
                      placeholder="मंदिर के बारे में अपना अनुभव लिखें... आरती कैसी थी, माहौल कैसा था, क्या खास लगा?" />
                    {visitNote !== undefined && visitType && (
                      <input value={visitNote} onChange={e => setVisitNote(e.target.value)}
                        className="w-full bg-orange-50 border border-orange-100 rounded-2xl px-3 py-2 text-sm focus:outline-none"
                        placeholder={visitType === 'visited' ? 'कब गए थे? (optional)' : 'कब जाने का plan है? (optional)'} />
                    )}
                    {reviewSuccess && (
                      <div className="flex items-center gap-2 text-green-600 text-sm font-black bg-green-50 px-4 py-2 rounded-xl">
                        ✅ आपका review सफलतापूर्वक submit हो गया!
                      </div>
                    )}
                    <button disabled={submitting}
                      className="w-full bg-orange-600 text-white rounded-2xl font-black py-3 flex items-center justify-center gap-2 hover:bg-orange-700 transition-all active:scale-95 disabled:opacity-60">
                      {submitting ? 'Submit हो रहा है...' : <><Send size={16} /> Review Submit करें</>}
                    </button>
                  </form>
                ) : (
                  <div className="bg-orange-50 rounded-2xl p-5 text-center border border-orange-100">
                    <p className="text-2xl mb-2">🙏</p>
                    <p className="font-black text-slate-800 mb-1">Review लिखने के लिए Login करें</p>
                    <p className="text-sm text-slate-500 mb-4">अपना अनुभव साझा करें और दूसरे भक्तों की मदद करें</p>
                    <div className="flex gap-3 justify-center">
                      <button onClick={() => router.push('/login')}
                        className="px-5 py-2.5 rounded-xl font-black text-sm bg-orange-600 text-white hover:bg-orange-700 transition-all">
                        Login करें
                      </button>
                      <button onClick={() => router.push('/register')}
                        className="px-5 py-2.5 rounded-xl font-black text-sm bg-white text-orange-600 border border-orange-200 hover:bg-orange-50 transition-all">
                        Register करें
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Reviews List */}
              {mandir.reviews.length === 0 ? (
                <p className="text-slate-400 text-sm text-center py-4">अभी तक कोई review नहीं। पहले review लिखें!</p>
              ) : (
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
                        <span className="ml-auto text-xs text-slate-400">{new Date(rev.createdAt).toLocaleDateString('hi-IN')}</span>
                      </div>
                      {rev.text && <p className="text-slate-600 text-sm italic pl-12">&quot;{rev.text}&quot;</p>}
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Social Media */}
            {mandir.socialMedia && Object.values(mandir.socialMedia).some(v => v) && (
              <Card className="border-l-4 border-l-blue-400">
                <SectionTitle icon={<Globe size={20} className="text-blue-600" />} title="सोशल मीडिया" />
                <div className="grid grid-cols-2 gap-3">
                  {mandir.socialMedia.facebook && (
                    <a href={mandir.socialMedia.facebook} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-2xl border border-blue-100 transition-all">
                      <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white font-black text-sm">f</div>
                      <span className="font-black text-slate-700 text-sm">Facebook</span>
                    </a>
                  )}
                  {mandir.socialMedia.instagram && (
                    <a href={mandir.socialMedia.instagram} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 bg-pink-50 hover:bg-pink-100 rounded-2xl border border-pink-100 transition-all">
                      <div className="w-9 h-9 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white text-sm">📷</div>
                      <span className="font-black text-slate-700 text-sm">Instagram</span>
                    </a>
                  )}
                  {mandir.socialMedia.youtube && (
                    <a href={mandir.socialMedia.youtube} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 bg-red-50 hover:bg-red-100 rounded-2xl border border-red-100 transition-all">
                      <div className="w-9 h-9 bg-red-600 rounded-full flex items-center justify-center text-white font-black text-sm">▶</div>
                      <span className="font-black text-slate-700 text-sm">YouTube</span>
                    </a>
                  )}
                  {mandir.socialMedia.twitter && (
                    <a href={mandir.socialMedia.twitter} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 bg-sky-50 hover:bg-sky-100 rounded-2xl border border-sky-100 transition-all">
                      <div className="w-9 h-9 bg-sky-500 rounded-full flex items-center justify-center text-white font-black text-sm">𝕏</div>
                      <span className="font-black text-slate-700 text-sm">Twitter</span>
                    </a>
                  )}
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-4">
            {/* Rating + Actions */}
            <div className="bg-white rounded-[2rem] border border-orange-100 shadow-sm p-6 sticky top-24">
              <div className="text-center mb-5 pb-5 border-b border-orange-50">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Rating</p>
                <h2 className="text-5xl font-black text-slate-900">{mandir.averageRating.toFixed(1)}</h2>
                <div className="flex justify-center gap-1 text-yellow-500 mt-2">
                  {[...Array(5)].map((_, i) => <Star key={i} size={18} fill={i < Math.round(mandir.averageRating) ? 'currentColor' : 'none'} />)}
                </div>
                <p className="text-xs text-slate-400 mt-1">{mandir.reviews.length} reviews</p>
              </div>

              <div className="space-y-3 mb-5">
                <button onClick={() => window.open(`https://maps.google.com/?q=${mandir.location.coordinates?.lat},${mandir.location.coordinates?.lng}`)}
                  className="w-full bg-orange-600 text-white rounded-2xl font-black py-3.5 flex items-center justify-center gap-2 hover:bg-orange-700 transition-all active:scale-95">
                  <Navigation size={18} /> Get Directions
                </button>
                <div className="grid grid-cols-3 gap-2">
                  {mandir.contact.phone && (
                    <a href={`tel:${mandir.contact.phone}`} className="flex flex-col items-center justify-center p-3 bg-orange-50 rounded-2xl text-orange-600 hover:bg-orange-100 transition font-black text-xs gap-1">
                      <Phone size={16} /> Call
                    </a>
                  )}
                  {mandir.contact.website && (
                    <a href={mandir.contact.website} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center p-3 bg-orange-50 rounded-2xl text-orange-600 hover:bg-orange-100 transition font-black text-xs gap-1">
                      <ExternalLink size={16} /> Website
                    </a>
                  )}
                  <button onClick={handleShare} className="flex flex-col items-center justify-center p-3 bg-orange-50 rounded-2xl text-orange-600 hover:bg-orange-100 transition font-black text-xs gap-1">
                    <Share2 size={16} /> Share
                  </button>
                </div>
              </div>

              {/* Quick Info */}
              {(mandir.location.city || mandir.location.state) && (
                <div className="space-y-2 mb-5 pb-5 border-b border-orange-50">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Location</p>
                  <p className="text-sm font-bold text-slate-700">{[mandir.location.city, mandir.location.state, mandir.location.country].filter(Boolean).join(', ')}</p>
                  {mandir.location.pincode && <p className="text-xs text-slate-400">PIN: {mandir.location.pincode}</p>}
                </div>
              )}

              {/* Write Review / Login CTA */}
              <div className="pt-5 border-t border-orange-50">
                {user ? (
                  <div className="text-center">
                    <div className="w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center text-white font-black mx-auto mb-2">
                      {user.name[0]?.toUpperCase()}
                    </div>
                    <p className="text-sm font-black text-slate-800">{user.name}</p>
                    <p className="text-xs text-slate-400 mb-3">Logged in as devotee</p>
                    <a href="#reviews" className="block w-full text-center bg-orange-600 text-white rounded-2xl font-black py-2.5 text-sm hover:bg-orange-700 transition-all">
                      ✍️ Review लिखें
                    </a>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-sm font-black text-slate-700 mb-1">Review लिखने के लिए</p>
                    <p className="text-xs text-slate-400 mb-3">Login करें और अपना अनुभव साझा करें</p>
                    <button onClick={() => router.push('/login')}
                      className="w-full bg-orange-600 text-white rounded-2xl font-black py-2.5 text-sm hover:bg-orange-700 transition-all">
                      🙏 Login करें
                    </button>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      </main>

      <footer className="py-10 text-center border-t border-orange-100 mt-10">
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.8em]">🙏 जय श्री राम 🙏</p>
      </footer>
    </div>
  );
}
