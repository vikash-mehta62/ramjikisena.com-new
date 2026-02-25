'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  MapPin, Phone, Mail, Star, ArrowLeft, Home, LayoutDashboard,
  MessageSquare, Send, Calendar, Radio, ExternalLink, Award, Clock
} from 'lucide-react';

interface KathaVachak {
  _id: string;
  name: string;
  photo: string;
  photos?: string[];
  experience: number;
  specialization: string;
  description: string;
  contact: {
    phone?: string;
    email?: string;
    whatsapp?: string;
  };
  liveKathas: Array<{
    _id: string;
    addressLine1?: string;
    addressLine2?: string;
    city: string;
    state: string;
    country: string;
    pincode?: string;
    startDate: string;
    endDate: string;
    liveLink?: string;
    kathaType: string;
    isActive: boolean;
  }>;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    twitter?: string;
  };
  reviews: Array<{
    _id: string;
    user: { name: string; username: string };
    rating: number;
    text: string;
    createdAt: string;
  }>;
  averageRating: number;
}

export default function KathaVachakDetail() {
  const params = useParams();
  const [kathaVachak, setKathaVachak] = useState<KathaVachak | null>(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (params.id) fetchKathaVachak();
  }, [params.id]);

  const fetchKathaVachak = async () => {
    try {
      const response = await api.get(`/api/katha-vachaks/${params.id}`);
      const data = await response.json();
      if (data.success) setKathaVachak(data.kathaVachak);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await api.post(`/api/katha-vachaks/${params.id}/review`, {
        rating,
        text: reviewText
      });
      const data = await response.json();
      if (data.success) {
        setReviewText('');
        setRating(5);
        fetchKathaVachak();
        alert('✅ Review submitted successfully!');
      }
    } catch (error) {
      alert('Kripya pehle login karein.');
    } finally {
      setSubmitting(false);
    }
  };

  const getCurrentLiveKatha = () => {
    if (!kathaVachak) return null;
    const now = new Date();
    return kathaVachak.liveKathas.find(katha => {
      if (!katha.isActive) return false;
      const start = new Date(katha.startDate);
      
      // If no end date, consider it ongoing (live)
      if (!katha.endDate) {
        return start <= now;
      }
      
      const end = new Date(katha.endDate);
      return start <= now && end >= now;
    });
  };

  const getUpcomingKathas = () => {
    if (!kathaVachak) return [];
    const now = new Date();
    return kathaVachak.liveKathas
      .filter(katha => {
        if (!katha.isActive) return false;
        const start = new Date(katha.startDate);
        return start > now;
      })
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  };

  const getYouTubeVideoId = (url: string) => {
    if (!url) return null;
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/live\/([^&\n?#]+)/
    ];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  if (loading) return (
    <div className="min-h-screen bg-orange-50 flex flex-col items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
        className="text-7xl mb-4"
      >
        🕉️
      </motion.div>
      <p className="text-orange-600 font-medium animate-pulse">Loading...</p>
    </div>
  );

  if (!kathaVachak) return <div className="text-center p-20">Katha Vachak not found.</div>;

  const currentLive = getCurrentLiveKatha();
  const upcomingKathas = getUpcomingKathas();

  return (
    <div className="min-h-screen bg-[#FFFBF2] text-slate-800">
      {/* Sticky Nav */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-orange-100 px-4 py-3">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/katha-vachaks" className="flex items-center gap-2 text-orange-600 font-semibold hover:opacity-70 transition">
            <ArrowLeft size={18} /> Back to List
          </Link>
          <div className="flex gap-4">
            <Link href="/" className="p-2 hover:bg-orange-50 rounded-full transition text-slate-600">
              <Home size={20} />
            </Link>
            <Link href="/dashboard" className="p-2 hover:bg-orange-50 rounded-full transition text-slate-600">
              <LayoutDashboard size={20} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative h-[40vh] md:h-[50vh] overflow-hidden bg-gradient-to-br from-orange-900 to-red-900">
        {kathaVachak.photo ? (
          <img
            src={kathaVachak.photo}
            className="w-full h-full object-cover opacity-40 scale-105"
            alt={kathaVachak.name}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-9xl opacity-20">🙏</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#FFFBF2] via-transparent to-black/20" />
        <div className="absolute bottom-10 left-0 w-full">
          <div className="container mx-auto px-4">
            <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="max-w-4xl">
              <div className="flex items-center gap-3 mb-3">
                {currentLive && (
                  <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-2 animate-pulse">
                    <Radio size={12} /> LIVE NOW
                  </span>
                )}
                <div className="flex items-center gap-1 text-yellow-400 bg-black/30 backdrop-blur-md px-2 py-1 rounded-lg">
                  <Star size={14} fill="currentColor" />
                  <span className="text-sm font-bold">{kathaVachak.averageRating.toFixed(1)}</span>
                </div>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-slate-900 drop-shadow-sm">
                {kathaVachak.name}
              </h1>
              <p className="text-orange-700 mt-2 font-bold text-xl">
                {kathaVachak.specialization || 'Katha Vachak'}
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-10">
            {/* About */}
            <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="bg-white rounded-[2rem] p-8 shadow-sm border border-orange-50">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-800">
                📖 About
              </h2>
              <p className="text-slate-600 leading-relaxed text-lg mb-6">{kathaVachak.description}</p>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Award className="text-orange-600" size={24} />
                  <div>
                    <p className="text-sm text-slate-500">Experience</p>
                    <p className="font-bold text-slate-800">{kathaVachak.experience} Years</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="text-orange-600" size={24} />
                  <div>
                    <p className="text-sm text-slate-500">Reviews</p>
                    <p className="font-bold text-slate-800">{kathaVachak.reviews.length}</p>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Current Live Katha */}
            {currentLive && (
              <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="bg-gradient-to-br from-red-50 to-orange-50 rounded-[2rem] p-8 shadow-lg border-2 border-red-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <h2 className="text-2xl font-bold text-red-700">🔴 LIVE KATHA NOW</h2>
                </div>
                <div className="bg-white rounded-xl p-6 space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-4">{currentLive.kathaType}</h3>
                    
                    {/* Location */}
                    <div className="flex items-start gap-3 text-slate-600 mb-4 p-4 bg-orange-50 rounded-xl">
                      <MapPin size={20} className="shrink-0 mt-1 text-orange-600" />
                      <div>
                        <p className="font-semibold text-slate-700 mb-1">Location:</p>
                        {currentLive.addressLine1 && <p>{currentLive.addressLine1}</p>}
                        {currentLive.addressLine2 && <p>{currentLive.addressLine2}</p>}
                        <p className="font-bold text-slate-800">{currentLive.city}, {currentLive.state}, {currentLive.country}</p>
                        {currentLive.pincode && <p className="text-sm text-slate-500">PIN: {currentLive.pincode}</p>}
                      </div>
                    </div>

                    {/* Dates */}
                    <div className="flex items-start gap-3 text-slate-600 p-4 bg-blue-50 rounded-xl">
                      <Calendar size={20} className="shrink-0 mt-1 text-blue-600" />
                      <div className="flex-1">
                        <p className="font-semibold text-slate-700 mb-2">Duration:</p>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-slate-500 uppercase mb-1">Start Date</p>
                            <p className="font-bold text-green-700">
                              {currentLive.startDate ? formatDate(currentLive.startDate) : 'Not specified'}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 uppercase mb-1">End Date</p>
                            <p className="font-bold text-red-700">
                              {currentLive.endDate ? formatDate(currentLive.endDate) : 'Ongoing'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* YouTube Embed or Link */}
                  {currentLive.liveLink && (() => {
                    const videoId = getYouTubeVideoId(currentLive.liveLink);
                    if (videoId) {
                      return (
                        <div className="space-y-3">
                          <p className="font-semibold text-slate-700 flex items-center gap-2">
                            <span className="text-red-600">▶</span> Live Stream:
                          </p>
                          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                            <iframe
                              className="absolute top-0 left-0 w-full h-full rounded-xl"
                              src={`https://www.youtube.com/embed/${videoId}?autoplay=0`}
                              title="Live Katha Stream"
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          </div>
                        </div>
                      );
                    } else {
                      return (
                        <a
                          href={currentLive.liveLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 w-full bg-red-600 text-white py-4 rounded-xl font-bold hover:bg-red-700 transition-all hover:scale-105"
                        >
                          <ExternalLink size={20} /> Watch Live Stream
                        </a>
                      );
                    }
                  })()}
                </div>
              </motion.section>
            )}

            {/* Upcoming Kathas */}
            {upcomingKathas.length > 0 && (
              <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="bg-white rounded-[2rem] p-8 shadow-sm border border-orange-50">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-slate-800">
                  <Calendar className="text-orange-600" /> Upcoming Kathas ({upcomingKathas.length})
                </h2>
                <div className="space-y-4">
                  {upcomingKathas.map((katha) => (
                    <div key={katha._id} className="p-6 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl border-2 border-orange-200 hover:shadow-md transition-all">
                      <h3 className="text-lg font-bold text-slate-800 mb-4">{katha.kathaType}</h3>
                      <div className="space-y-3 text-sm">
                        {/* Location */}
                        <div className="flex items-start gap-3">
                          <MapPin size={18} className="shrink-0 mt-1 text-orange-600" />
                          <div>
                            <p className="font-semibold text-slate-700">Location:</p>
                            {katha.addressLine1 && <p className="text-slate-600">{katha.addressLine1}</p>}
                            {katha.addressLine2 && <p className="text-slate-600">{katha.addressLine2}</p>}
                            <p className="font-bold text-slate-800">{katha.city}, {katha.state}</p>
                            {katha.pincode && <p className="text-slate-500">PIN: {katha.pincode}</p>}
                          </div>
                        </div>
                        
                        {/* Dates */}
                        <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                          <Clock size={18} className="shrink-0 mt-1 text-blue-600" />
                          <div className="flex-1">
                            <p className="font-semibold text-slate-700 mb-2">Schedule:</p>
                            <div className="flex gap-4">
                              <div>
                                <p className="text-xs text-slate-500 uppercase">Start</p>
                                <p className="font-bold text-green-700">
                                  {katha.startDate ? formatDate(katha.startDate) : 'TBA'}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-slate-500 uppercase">End</p>
                                <p className="font-bold text-red-700">
                                  {katha.endDate ? formatDate(katha.endDate) : 'TBA'}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Live Link */}
                        {katha.liveLink && (
                          <a
                            href={katha.liveLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
                          >
                            <ExternalLink size={16} />
                            <span>Stream Link Available</span>
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Photos Gallery */}
            {((kathaVachak.photos && kathaVachak.photos.length > 0) || kathaVachak.photo) && (
              <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="bg-white rounded-[2rem] p-8 shadow-sm border border-orange-50">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-slate-800">
                  📸 Photo Gallery
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {/* Show photos array */}
                  {kathaVachak.photos && kathaVachak.photos.map((photo, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      className="aspect-square rounded-2xl overflow-hidden shadow-md border-2 border-orange-100 hover:border-orange-300 transition-all"
                    >
                      <img
                        src={photo}
                        alt={`${kathaVachak.name} - Photo ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  ))}
                  {/* Show old photo field if photos array is empty */}
                  {(!kathaVachak.photos || kathaVachak.photos.length === 0) && kathaVachak.photo && (
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="aspect-square rounded-2xl overflow-hidden shadow-md border-2 border-orange-100 hover:border-orange-300 transition-all"
                    >
                      <img
                        src={kathaVachak.photo}
                        alt={kathaVachak.name}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  )}
                </div>
              </motion.section>
            )}

            {/* Reviews */}
            <section className="bg-white rounded-[2rem] p-8 shadow-sm border border-orange-50">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <MessageSquare className="text-orange-500" /> Reviews
                </h2>
                <span className="text-slate-400 text-sm font-medium">{kathaVachak.reviews.length} total</span>
              </div>
              <div className="space-y-6">
                {kathaVachak.reviews.map((rev) => (
                  <div key={rev._id} className="border-b border-slate-50 pb-6 last:border-none">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-bold">
                        {rev.user.name[0]}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{rev.user.name}</p>
                        <div className="flex text-yellow-500">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={12} fill={i < rev.rating ? "currentColor" : "none"} />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-slate-600 pl-13 italic">"{rev.text}"</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Social Media */}
            {kathaVachak.socialMedia && Object.values(kathaVachak.socialMedia).some(v => v) && (
              <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-[2rem] p-8 shadow-sm border-2 border-cyan-200">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-cyan-700">
                  📱 Connect
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {kathaVachak.socialMedia.facebook && (
                    <a href={kathaVachak.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-white hover:bg-blue-50 rounded-xl border border-cyan-200 transition-all hover:scale-105">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">f</div>
                      <span className="font-semibold text-slate-700">Facebook</span>
                    </a>
                  )}
                  {kathaVachak.socialMedia.instagram && (
                    <a href={kathaVachak.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-white hover:bg-pink-50 rounded-xl border border-cyan-200 transition-all hover:scale-105">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">📷</div>
                      <span className="font-semibold text-slate-700">Instagram</span>
                    </a>
                  )}
                  {kathaVachak.socialMedia.youtube && (
                    <a href={kathaVachak.socialMedia.youtube} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-white hover:bg-red-50 rounded-xl border border-cyan-200 transition-all hover:scale-105">
                      <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white font-bold">▶</div>
                      <span className="font-semibold text-slate-700">YouTube</span>
                    </a>
                  )}
                  {kathaVachak.socialMedia.twitter && (
                    <a href={kathaVachak.socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-white hover:bg-sky-50 rounded-xl border border-cyan-200 transition-all hover:scale-105">
                      <div className="w-10 h-10 bg-sky-500 rounded-full flex items-center justify-center text-white font-bold">𝕏</div>
                      <span className="font-semibold text-slate-700">Twitter</span>
                    </a>
                  )}
                </div>
              </motion.section>
            )}
          </div>

          {/* Right Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-[2rem] p-6 shadow-lg border border-orange-50 sticky top-24">
              <div className="text-center mb-8">
                <p className="text-slate-400 text-sm mb-1 uppercase tracking-tighter">Rating</p>
                <h2 className="text-5xl font-black text-slate-800">{kathaVachak.averageRating.toFixed(1)}</h2>
                <div className="flex justify-center gap-1 text-yellow-500 mt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={20} fill={i < Math.round(kathaVachak.averageRating) ? "currentColor" : "none"} />
                  ))}
                </div>
              </div>

              {/* Contact */}
              <div className="space-y-3 mb-8">
                {kathaVachak.contact.phone && (
                  <a href={`tel:${kathaVachak.contact.phone}`} className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl hover:bg-orange-50 transition">
                    <Phone size={20} className="text-orange-600" />
                    <div>
                      <p className="text-xs text-slate-500">Phone</p>
                      <p className="font-semibold text-slate-800">{kathaVachak.contact.phone}</p>
                    </div>
                  </a>
                )}
                {kathaVachak.contact.email && (
                  <a href={`mailto:${kathaVachak.contact.email}`} className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl hover:bg-orange-50 transition">
                    <Mail size={20} className="text-orange-600" />
                    <div>
                      <p className="text-xs text-slate-500">Email</p>
                      <p className="font-semibold text-slate-800 text-sm">{kathaVachak.contact.email}</p>
                    </div>
                  </a>
                )}
              </div>

              {/* Add Review */}
              <div className="pt-8 border-t border-slate-100">
                <h4 className="font-bold mb-4 text-slate-800">Leave a Review</h4>
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div className="flex gap-2 justify-between px-2">
                    {[1, 2, 3, 4, 5].map(s => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setRating(s)}
                        className={`transition-all ${s <= rating ? 'text-yellow-500 scale-125' : 'text-slate-300'}`}
                      >
                        <Star size={24} fill={s <= rating ? "currentColor" : "none"} />
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-orange-500 min-h-[100px]"
                    placeholder="Share your experience..."
                  />
                  <button
                    disabled={submitting}
                    className="w-full bg-slate-900 text-white py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-black transition"
                  >
                    {submitting ? "Submitting..." : <><Send size={18} /> Submit Review</>}
                  </button>
                </form>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-16 mt-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-black text-orange-500 mb-4">🕉️ राम राम 🕉️</h2>
          <p className="text-xs">© 2026 Ramji Ki Sena. Made with Bhakti & Code.</p>
        </div>
      </footer>
    </div>
  );
}
