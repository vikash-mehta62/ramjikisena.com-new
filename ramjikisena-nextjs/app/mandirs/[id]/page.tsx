'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Clock, Phone, Globe, Mail, Star, 
  ArrowLeft, Home, LayoutDashboard, Navigation, 
  Camera, History, MessageSquare, Send, Info,
  Calendar, Heart, Share2, ExternalLink
} from 'lucide-react';

// --- Interfaces ---
interface Mandir {
  _id: string; 
  name: string; 
  description: string; 
  history: string;
  location: { 
    address: string; 
    city: string; 
    state: string; 
    coordinates?: { lat: number; lng: number } 
  };
  timing: { 
    opening: string; 
    closing: string; 
    aarti: string[] 
  };
  contact: { 
    phone: string; 
    email: string; 
    website: string 
  };
  photos: string[];
  // NEW FIELDS
  deity?: {
    main?: string;
    others?: string[];
  };
  visitInfo?: {
    bestTimeToVisit?: string;
    dressCode?: string;
    entryFee?: string;
    photographyAllowed?: boolean;
  };
  facilities?: {
    parking?: boolean;
    prasad?: boolean;
    accommodation?: boolean;
    wheelchairAccessible?: boolean;
    restrooms?: boolean;
    drinkingWater?: boolean;
  };
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
    createdAt: string 
  }>;
  averageRating: number;
}

export default function PublicMandirDetail() {
  const params = useParams();
  const [mandir, setMandir] = useState<Mandir | null>(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (params.id) fetchMandir();
  }, [params.id]);

  const fetchMandir = async () => {
    try {
      const response = await api.get(`/api/mandirs/${params.id}`);
      const data = await response.json();
      if (data.success) setMandir(data.mandir);
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
      const response = await api.post(`/api/mandirs/${params.id}/review`, { rating, text: reviewText });
      const data = await response.json();
      if (data.success) {
        setReviewText('');
        setRating(5);
        fetchMandir();
      }
    } catch (error) {
      alert('Kripya pehle login karein.');
    } finally {
      setSubmitting(false);
    }
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
      <p className="text-orange-600 font-medium animate-pulse">Shree Ram...</p>
    </div>
  );

  if (!mandir) return <div className="text-center p-20">Mandir nahi mila.</div>;

  return (
    <div className="min-h-screen bg-[#FFFBF2] text-slate-800 selection:bg-orange-200">
      
      {/* 1. STICKY NAV */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-orange-100 px-4 py-3">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/mandirs" className="flex items-center gap-2 text-orange-600 font-semibold hover:opacity-70 transition">
            <ArrowLeft size={18} /> Back to List
          </Link>
          <div className="flex gap-4">
             <Link href="/" className="p-2 hover:bg-orange-50 rounded-full transition text-slate-600"><Home size={20} /></Link>
             <Link href="/dashboard" className="p-2 hover:bg-orange-50 rounded-full transition text-slate-600"><LayoutDashboard size={20} /></Link>
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <div className="relative h-[40vh] md:h-[50vh] overflow-hidden bg-slate-900">
        <img 
          src={mandir.photos[0] || 'https://images.unsplash.com/photo-1590059536214-6a6839674092'} 
          className="w-full h-full object-cover opacity-60 scale-105" 
          alt="Mandir Banner"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FFFBF2] via-transparent to-black/20" />
        <div className="absolute bottom-10 left-0 w-full">
          <div className="container mx-auto px-4">
            <motion.div 
              initial={{ y: 30, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }}
              className="max-w-4xl"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">Divine Place</span>
                <div className="flex items-center gap-1 text-yellow-400 bg-black/30 backdrop-blur-md px-2 py-1 rounded-lg">
                  <Star size={14} fill="currentColor" />
                  <span className="text-sm font-bold">{mandir.averageRating.toFixed(1)}</span>
                </div>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-slate-900 drop-shadow-sm">{mandir.name}</h1>
              <p className="flex items-center gap-2 text-slate-700 mt-2 font-medium">
                <MapPin size={20} className="text-orange-600" /> {mandir.location.address}, {mandir.location.city}
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* 3. GRID CONTENT */}
      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: INFORMATION (8 Columns) */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* About Card */}
            <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="bg-white rounded-[2rem] p-8 shadow-sm border border-orange-50">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-800">
                <Info className="text-orange-500" /> Mandir Darshan
              </h2>
              <p className="text-slate-600 leading-relaxed text-lg">{mandir.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="flex gap-4 p-4 bg-orange-50/50 rounded-2xl">
                  <Clock className="text-orange-600 shrink-0" />
                  <div>
                    <h4 className="font-bold text-slate-800">Open Hours</h4>
                    <p className="text-sm text-slate-600">{mandir.timing.opening} - {mandir.timing.closing}</p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 bg-orange-50/50 rounded-2xl">
                  <Calendar className="text-orange-600 shrink-0" />
                  <div>
                    <h4 className="font-bold text-slate-800">Aarti Timing</h4>
                    <p className="text-sm text-slate-600">{mandir.timing.aarti.join(' • ')}</p>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Deity Information */}
            {mandir.deity?.main && (
              <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-[2rem] p-8 shadow-sm border-2 border-yellow-200">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-orange-800">
                  🕉️ Deity Information
                </h2>
                <div className="space-y-4">
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-yellow-300">
                    <h3 className="text-lg font-bold text-orange-700 mb-2">Main Deity</h3>
                    <p className="text-2xl font-bold text-slate-800">{mandir.deity.main}</p>
                  </div>
                  {mandir.deity.others && mandir.deity.others.length > 0 && (
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-yellow-300">
                      <h3 className="text-lg font-bold text-orange-700 mb-3">Other Deities</h3>
                      <div className="flex flex-wrap gap-2">
                        {mandir.deity.others.map((deity, i) => (
                          <span key={i} className="px-4 py-2 bg-gradient-to-r from-orange-100 to-yellow-100 text-orange-800 rounded-full text-sm font-semibold border border-orange-200">
                            {deity}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.section>
            )}

            {/* Visit Information */}
            {(mandir.visitInfo?.bestTimeToVisit || mandir.visitInfo?.dressCode || mandir.visitInfo?.entryFee) && (
              <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="bg-white rounded-[2rem] p-8 shadow-sm border border-indigo-100">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-indigo-700">
                  ℹ️ Visit Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mandir.visitInfo.bestTimeToVisit && (
                    <div className="flex gap-4 p-4 bg-indigo-50 rounded-xl border border-indigo-200">
                      <Clock className="text-indigo-600 shrink-0" size={24} />
                      <div>
                        <h4 className="font-bold text-slate-800 mb-1">Best Time to Visit</h4>
                        <p className="text-sm text-slate-600">{mandir.visitInfo.bestTimeToVisit}</p>
                      </div>
                    </div>
                  )}
                  {mandir.visitInfo.entryFee && (
                    <div className="flex gap-4 p-4 bg-indigo-50 rounded-xl border border-indigo-200">
                      <span className="text-2xl shrink-0">💰</span>
                      <div>
                        <h4 className="font-bold text-slate-800 mb-1">Entry Fee</h4>
                        <p className="text-sm text-slate-600">{mandir.visitInfo.entryFee}</p>
                      </div>
                    </div>
                  )}
                  {mandir.visitInfo.dressCode && (
                    <div className="flex gap-4 p-4 bg-indigo-50 rounded-xl border border-indigo-200">
                      <span className="text-2xl shrink-0">👔</span>
                      <div>
                        <h4 className="font-bold text-slate-800 mb-1">Dress Code</h4>
                        <p className="text-sm text-slate-600">{mandir.visitInfo.dressCode}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex gap-4 p-4 bg-indigo-50 rounded-xl border border-indigo-200">
                    <span className="text-2xl shrink-0">📸</span>
                    <div>
                      <h4 className="font-bold text-slate-800 mb-1">Photography</h4>
                      <p className="text-sm text-slate-600">
                        {mandir.visitInfo.photographyAllowed !== false ? 'Allowed' : 'Not Allowed'}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.section>
            )}

            {/* Facilities */}
            {mandir.facilities && Object.values(mandir.facilities).some(v => v) && (
              <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-[2rem] p-8 shadow-sm border-2 border-teal-200">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-teal-700">
                  🏢 Facilities Available
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {mandir.facilities.parking && (
                    <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-teal-200">
                      <span className="text-2xl">🅿️</span>
                      <span className="font-semibold text-slate-700">Parking</span>
                    </div>
                  )}
                  {mandir.facilities.prasad && (
                    <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-teal-200">
                      <span className="text-2xl">🍬</span>
                      <span className="font-semibold text-slate-700">Prasad</span>
                    </div>
                  )}
                  {mandir.facilities.accommodation && (
                    <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-teal-200">
                      <span className="text-2xl">🏨</span>
                      <span className="font-semibold text-slate-700">Accommodation</span>
                    </div>
                  )}
                  {mandir.facilities.wheelchairAccessible && (
                    <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-teal-200">
                      <span className="text-2xl">♿</span>
                      <span className="font-semibold text-slate-700">Wheelchair Access</span>
                    </div>
                  )}
                  {mandir.facilities.restrooms && (
                    <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-teal-200">
                      <span className="text-2xl">🚻</span>
                      <span className="font-semibold text-slate-700">Restrooms</span>
                    </div>
                  )}
                  {mandir.facilities.drinkingWater && (
                    <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-teal-200">
                      <span className="text-2xl">💧</span>
                      <span className="font-semibold text-slate-700">Drinking Water</span>
                    </div>
                  )}
                </div>
              </motion.section>
            )}

            {/* Gallery Section */}
            {mandir.photos?.length > 0 && (
              <section>
                <h3 className="text-xl font-bold mb-4 px-2">Divine Gallery</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {mandir.photos.map((img, i) => (
                    <motion.div 
                      whileHover={{ scale: 1.02 }} 
                      key={i} 
                      className="aspect-square rounded-3xl overflow-hidden shadow-md"
                    >
                      <img src={img} className="w-full h-full object-cover" alt="Gallery" />
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* History Card */}
            <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="bg-orange-900 text-orange-50 rounded-[2.5rem] p-10 shadow-xl relative overflow-hidden">
               <History className="absolute -right-10 -top-10 w-64 h-64 opacity-5" />
               <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <History className="text-orange-400" /> Aitihasik Mahatva (History)
              </h2>
              <p className="text-orange-100/80 leading-relaxed italic text-lg whitespace-pre-line">
                "{mandir.history}"
              </p>
            </motion.section>

            {/* Reviews Section */}
            <section className="bg-white rounded-[2rem] p-8 shadow-sm border border-orange-50">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <MessageSquare className="text-orange-500" /> Devotee Reviews
                </h2>
                <span className="text-slate-400 text-sm font-medium">{mandir.reviews.length} total</span>
              </div>
              <div className="space-y-6">
                {mandir.reviews.map((rev) => (
                  <div key={rev._id} className="group border-b border-slate-50 pb-6 last:border-none">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-bold">
                        {rev.user.name[0]}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{rev.user.name}</p>
                        <div className="flex text-yellow-500"><Star size={12} fill="currentColor" /> {rev.rating}</div>
                      </div>
                    </div>
                    <p className="text-slate-600 pl-13 italic">"{rev.text}"</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Social Media Links */}
            {mandir.socialMedia && (mandir.socialMedia.facebook || mandir.socialMedia.instagram || mandir.socialMedia.youtube || mandir.socialMedia.twitter) && (
              <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-[2rem] p-8 shadow-sm border-2 border-cyan-200">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-cyan-700">
                  📱 Connect With Us
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {mandir.socialMedia.facebook && (
                    <a 
                      href={mandir.socialMedia.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 bg-white hover:bg-blue-50 rounded-xl border border-cyan-200 transition-all hover:scale-105 hover:shadow-md"
                    >
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                        f
                      </div>
                      <span className="font-semibold text-slate-700">Facebook</span>
                    </a>
                  )}
                  {mandir.socialMedia.instagram && (
                    <a 
                      href={mandir.socialMedia.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 bg-white hover:bg-pink-50 rounded-xl border border-cyan-200 transition-all hover:scale-105 hover:shadow-md"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                        📷
                      </div>
                      <span className="font-semibold text-slate-700">Instagram</span>
                    </a>
                  )}
                  {mandir.socialMedia.youtube && (
                    <a 
                      href={mandir.socialMedia.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 bg-white hover:bg-red-50 rounded-xl border border-cyan-200 transition-all hover:scale-105 hover:shadow-md"
                    >
                      <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white font-bold">
                        ▶
                      </div>
                      <span className="font-semibold text-slate-700">YouTube</span>
                    </a>
                  )}
                  {mandir.socialMedia.twitter && (
                    <a 
                      href={mandir.socialMedia.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 bg-white hover:bg-sky-50 rounded-xl border border-cyan-200 transition-all hover:scale-105 hover:shadow-md"
                    >
                      <div className="w-10 h-10 bg-sky-500 rounded-full flex items-center justify-center text-white font-bold">
                        𝕏
                      </div>
                      <span className="font-semibold text-slate-700">Twitter</span>
                    </a>
                  )}
                </div>
              </motion.section>
            )}
          </div>

          {/* RIGHT: ACTIONS (4 Columns) */}
          <aside className="lg:col-span-4 space-y-6">
            
            {/* Quick Actions Card */}
            <div className="bg-white rounded-[2rem] p-6 shadow-lg border border-orange-50 sticky top-24">
              <div className="text-center mb-8">
                 <p className="text-slate-400 text-sm mb-1 uppercase tracking-tighter">Current Rating</p>
                 <h2 className="text-5xl font-black text-slate-800">{mandir.averageRating.toFixed(1)}</h2>
                 <div className="flex justify-center gap-1 text-yellow-500 mt-2">
                    {[...Array(5)].map((_, i) => <Star key={i} size={20} fill={i < Math.round(mandir.averageRating) ? "currentColor" : "none"} />)}
                 </div>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={() => window.open(`http://googleusercontent.com/maps.google.com/3{mandir.location.coordinates?.lat},${mandir.location.coordinates?.lng}`)}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-orange-200 transition-all active:scale-95"
                >
                  <Navigation size={20} /> Get Path to Mandir
                </button>
                <div className="grid grid-cols-2 gap-3">
                  <a href={`tel:${mandir.contact.phone}`} className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl text-slate-600 hover:bg-orange-50 transition">
                    <Phone size={20} className="mb-1" /> <span className="text-xs font-bold">Call Now</span>
                  </a>
                  <button className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl text-slate-600 hover:bg-orange-50 transition">
                    <Share2 size={20} className="mb-1" /> <span className="text-xs font-bold">Share</span>
                  </button>
                </div>
              </div>

              {/* Add Review Form */}
              <div className="mt-10 pt-8 border-t border-slate-100">
                <h4 className="font-bold mb-4 text-slate-800">Your Experience</h4>
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div className="flex gap-2 justify-between px-2">
                    {[1,2,3,4,5].map(s => (
                      <button key={s} type="button" onClick={() => setRating(s)} className={`transition-all ${s <= rating ? 'text-yellow-500 scale-125' : 'text-slate-300'}`}>
                        <Star size={24} fill={s <= rating ? "currentColor" : "none"} />
                      </button>
                    ))}
                  </div>
                  <textarea 
                    value={reviewText} onChange={(e)=>setReviewText(e.target.value)}
                    className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-orange-500 min-h-[100px]"
                    placeholder="Mandir ke baare mein kuch likhein..."
                  />
                  <button 
                    disabled={submitting}
                    className="w-full bg-slate-900 text-white py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-black transition"
                  >
                    {submitting ? "Processing..." : <><Send size={18} /> Submit Review</>}
                  </button>
                </form>
              </div>
            </div>

          </aside>
        </div>
      </main>

      {/* 4. FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-16 mt-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-black text-orange-500 mb-4">🕉️ राम राम 🕉️</h2>
          <p className="max-w-md mx-auto mb-8 text-slate-500 italic">"Siyavar Ramachandra ki Jai! Mandir Darshan portal aapki bhakti yatra ko suvidhajanaka banata hai."</p>
          <div className="flex justify-center gap-6 mb-8 text-sm uppercase tracking-widest font-bold">
            <Link href="/" className="hover:text-white transition">Home</Link>
            <Link href="/mandirs" className="hover:text-white transition">Temples</Link>
            <Link href="/dashboard" className="hover:text-white transition">Profile</Link>
          </div>
          <p className="text-xs">© 2026 Ramji Ki Sena. Made with Bhakti & Code.</p>
        </div>
      </footer>
    </div>
  );
}