'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Star,
  Award,
  Phone,
  MessageCircle,
  Calendar,
  Clock,
  UserCheck,
  CircleDot,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  Share2,
  HelpCircle,
  Send,
  X
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface Offering {
  _id?: string;
  title: string;
  description: string;
  fee: number;
  durationMinutes: number;
}

interface Review {
  _id?: string;
  userName: string;
  rating: number;
  comment: string;
  topic?: string;
  createdAt: string;
}

interface Astrologer {
  _id: string;
  name: string;
  username: string;
  photo?: string;
  tagline: string;
  about: string;
  contact: {
    phone: string;
    email: string;
    whatsapp: string;
  };
  location: {
    city: string;
    state: string;
    address?: string;
  };
  experience: number;
  specialties: string[];
  languages: string[];
  qualifications?: string;
  fee: number;
  averageRating: number;
  totalConsultations: number;
  isVerified: boolean;
  availabilityStatus: 'online' | 'busy' | 'offline';
  offerings?: Offering[];
  reviews?: Review[];
}

export default function AstrologerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const astroId = params?.id as string;

  const [astro, setAstro] = useState<Astrologer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Booking Modal State
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedOffering, setSelectedOffering] = useState<Offering | null>(null);

  // Review Modal State
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    userName: '',
    rating: 5,
    comment: '',
    topic: 'Personal Consultation'
  });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  // Booking Form State
  const [bookingForm, setBookingForm] = useState({
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    consultationType: 'Call' as 'Call' | 'WhatsApp' | 'In-Person',
    consultationDate: new Date().toISOString().split('T')[0],
    consultationTimeSlot: '11:00 AM - 12:00 PM',
    topic: 'सामान्य मार्गदर्शन (General Life Guidance)',
    dob: '',
    tob: '',
    pob: '',
    question: '',
  });
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<any>(null);

  const fetchAstrologer = async () => {
    if (!astroId) return;
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3101';
      const res = await fetch(`${apiUrl}/api/astrology/${astroId}`);
      const data = await res.json();
      if (data.success && data.astrologer) {
        setAstro(data.astrologer);
      } else {
        setError(data.message || 'Astrologer profile not found');
      }
    } catch (e) {
      console.error('Error fetching astrologer:', e);
      setError('सर्वर से संपर्क नहीं हो पाया।');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAstrologer();
  }, [astroId]);

  const handleOpenBooking = (offering?: Offering) => {
    if (offering) {
      setSelectedOffering(offering);
      setBookingForm(prev => ({
        ...prev,
        topic: offering.title
      }));
    } else {
      setSelectedOffering(null);
    }
    setBookingSuccess(null);
    setIsBookingOpen(true);
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!astro) return;

    setBookingSubmitting(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3101';
      const payload = {
        astrologerId: astro._id,
        clientName: bookingForm.clientName,
        clientPhone: bookingForm.clientPhone,
        clientEmail: bookingForm.clientEmail,
        consultationType: bookingForm.consultationType,
        serviceTitle: selectedOffering?.title || 'व्यक्तिगत परामर्श (Personal Consultation)',
        fee: selectedOffering?.fee || astro.fee || 501,
        consultationDate: bookingForm.consultationDate,
        consultationTimeSlot: bookingForm.consultationTimeSlot,
        birthDetails: {
          dob: bookingForm.dob,
          tob: bookingForm.tob,
          pob: bookingForm.pob,
        },
        topic: bookingForm.topic,
        question: bookingForm.question,
      };

      const res = await fetch(`${apiUrl}/api/astrology/consultation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        setBookingSuccess(data.consultation);
      } else {
        alert(data.message || 'परामर्श बुकिंग में त्रुटि हुई।');
      }
    } catch (err) {
      console.error('Booking error:', err);
      alert('नेटवर्क त्रुटि: कृपया पुनः प्रयास करें।');
    } finally {
      setBookingSubmitting(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!astro) return;

    setReviewSubmitting(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3101';
      const res = await fetch(`${apiUrl}/api/astrology/${astro._id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewForm)
      });
      const data = await res.json();
      if (data.success) {
        alert('आपकी समीक्षा के लिए धन्यवाद!');
        setIsReviewOpen(false);
        setReviewForm({ userName: '', rating: 5, comment: '', topic: 'Personal Consultation' });
        fetchAstrologer();
      } else {
        alert(data.message || 'समीक्षा जोड़ने में समस्या आई');
      }
    } catch (err) {
      console.error('Review submit error:', err);
      alert('समीक्षा सबमिट नहीं हो पाई।');
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-bold text-amber-900">ज्योतिषी विवरण लोड हो रहा है...</p>
        </div>
      </div>
    );
  }

  if (error || !astro) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-amber-100 text-center max-w-md w-full">
          <div className="text-5xl mb-3">🔮</div>
          <h2 className="text-xl font-black text-slate-800 mb-2">प्रोफाइल नहीं मिली</h2>
          <p className="text-slate-500 text-sm mb-6">{error || 'यह प्रोफाइल मौजूद नहीं है।'}</p>
          <Link
            href="/astrology"
            className="px-6 py-2.5 bg-amber-600 text-white rounded-xl font-bold text-sm hover:bg-amber-700 transition inline-block"
          >
            वापस डायरेक्टरी पर जाएं
          </Link>
        </div>
      </div>
    );
  }

  const isOnline = astro.availabilityStatus === 'online';

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-slate-800 antialiased">
      <Navbar />

      {/* Top Breadcrumb & Hero */}
      <div className="pt-24 pb-12 bg-gradient-to-b from-[#1b0902] via-[#2c1307] to-[#FDFBF7] text-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <Link
            href="/astrology"
            className="inline-flex items-center gap-1.5 text-xs text-amber-300/80 hover:text-amber-200 font-bold mb-6 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>सभी ज्योतिषी एवं टैरो रीडर्स</span>
          </Link>

          {/* Profile Card Header */}
          <div className="bg-white/10 backdrop-blur-xl border border-amber-200/20 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-8 shadow-2xl">
            {/* Avatar Photo */}
            <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-3xl overflow-hidden flex-shrink-0 border-2 border-amber-400/50 shadow-xl bg-slate-900">
              {astro.photo ? (
                <img src={astro.photo} alt={astro.name} className="w-full h-full object-cover object-top" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center">
                  <span className="text-6xl">🔮</span>
                </div>
              )}
              {isOnline && (
                <span className="absolute bottom-2 right-2 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white"></span>
                </span>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left min-w-0">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
                {astro.isVerified && (
                  <span className="bg-emerald-500 text-white text-[11px] font-black px-3 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm">
                    <UserCheck className="w-3.5 h-3.5" /> प्रमाणित ज्योतिषी
                  </span>
                )}
                <span className="bg-white/15 text-amber-200 text-[11px] font-bold px-3 py-0.5 rounded-full border border-white/20">
                  {isOnline ? '🟢 उपलब्ध (Online)' : '⚪ व्यस्त / ऑफलाइन'}
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight drop-shadow-md">
                {astro.name}
              </h1>
              <p className="text-sm sm:text-base text-amber-200/90 font-medium mt-1">
                {astro.tagline}
              </p>

              {/* Badges strip */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 sm:gap-6 mt-4 text-xs text-white/80">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-amber-400" />
                  <span>{astro.location?.city}, {astro.location?.state}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>{astro.experience}+ वर्ष अनुभव</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="font-black text-white">{astro.averageRating?.toFixed(1) || '5.0'}</span>
                  <span className="text-white/60">({astro.reviews?.length || 0} समीक्षाएं)</span>
                </div>
              </div>

              {/* Specialties Pills */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 mt-4">
                {astro.specialties?.map((s, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-400/20 text-amber-200 border border-amber-300/30"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Price & Primary CTA */}
            <div className="w-full md:w-auto flex md:flex-col items-center justify-between md:justify-center gap-3 p-4 rounded-2xl bg-white/10 border border-white/15 flex-shrink-0">
              <div className="text-left md:text-center">
                <span className="text-[10px] uppercase font-bold text-amber-200/70 block">परामर्श शुल्क</span>
                <span className="text-2xl sm:text-3xl font-black text-white">
                  ₹{astro.fee || 501}
                </span>
                <span className="text-[11px] text-white/60 block">/ 30 मिनट सत्र</span>
              </div>

              <button
                onClick={() => handleOpenBooking()}
                className="px-6 py-3.5 rounded-2xl font-black text-xs sm:text-sm text-slate-950 transition-all shadow-xl active:scale-95 flex items-center gap-2"
                style={{
                  background: 'linear-gradient(135deg, #f9e07a 0%, #d4920a 60%, #b8760a 100%)',
                }}
              >
                <Sparkles className="w-4 h-4" />
                <span>परामर्श बुक करें</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="container mx-auto px-4 max-w-6xl py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column (2 Cols) */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-amber-100">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 mb-3 flex items-center gap-2">
                <span>परिचय एवं अनुभव</span>
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {astro.about || 'अनुभवी वैदिक ज्योतिषी एवं परामर्शदाता।'}
              </p>

              {/* Languages & Qualifications */}
              <div className="grid sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-100 text-xs">
                <div>
                  <span className="font-black text-slate-400 uppercase tracking-wider block mb-1">परामर्श भाषाएं</span>
                  <p className="font-bold text-slate-800 text-sm">{astro.languages?.join(', ') || 'Hindi'}</p>
                </div>
                {astro.qualifications && (
                  <div>
                    <span className="font-black text-slate-400 uppercase tracking-wider block mb-1">शिक्षा / उपाधि</span>
                    <p className="font-bold text-slate-800 text-sm">{astro.qualifications}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Offerings / Services */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-amber-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg sm:text-xl font-black text-slate-900">
                  परामर्श सेवाएं एवं शुल्क (Services Offered)
                </h2>
                <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full">
                  {astro.offerings?.length || 0} सेवाएं
                </span>
              </div>

              <div className="space-y-4">
                {astro.offerings && astro.offerings.length > 0 ? (
                  astro.offerings.map((offering, idx) => (
                    <div
                      key={idx}
                      className="p-4 sm:p-5 rounded-2xl border border-amber-100 hover:border-amber-300 bg-amber-50/30 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-black text-slate-900 text-base">{offering.title}</h3>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {offering.durationMinutes || 30} मिनट
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                          {offering.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                        <div className="text-left sm:text-right">
                          <span className="text-xs text-slate-400 block font-semibold">शुल्क</span>
                          <span className="text-lg font-black text-amber-700">₹{offering.fee}</span>
                        </div>
                        <button
                          onClick={() => handleOpenBooking(offering)}
                          className="px-4 py-2 rounded-xl text-xs font-black bg-amber-600 text-white hover:bg-amber-700 transition shadow-sm active:scale-95"
                        >
                          बुक करें
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 rounded-2xl bg-amber-50/50 text-center text-xs text-slate-500">
                    सीधा व्यक्तिगत परामर्श सत्र उपलब्ध है (₹{astro.fee || 501})
                  </div>
                )}
              </div>
            </div>

            {/* Client Reviews Section */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-amber-100">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
                    <span>भक्तों की समीक्षाएं (Reviews)</span>
                    <span className="text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full font-black">
                      {astro.reviews?.length || 0}
                    </span>
                  </h2>
                </div>
                <button
                  onClick={() => setIsReviewOpen(true)}
                  className="px-4 py-2 rounded-xl text-xs font-black bg-slate-100 text-slate-700 hover:bg-amber-100 hover:text-amber-800 transition"
                >
                  + समीक्षा लिखें
                </button>
              </div>

              {astro.reviews && astro.reviews.length > 0 ? (
                <div className="space-y-4">
                  {astro.reviews.map((rev, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-amber-200 text-amber-900 font-black text-xs flex items-center justify-center">
                            {rev.userName ? rev.userName[0]?.toUpperCase() : 'U'}
                          </div>
                          <span className="font-black text-sm text-slate-800">{rev.userName}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < rev.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                      {rev.topic && (
                        <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded mt-2 inline-block">
                          {rev.topic}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-xs text-slate-400">
                  अभी तक कोई समीक्षा नहीं है। पहले व्यक्ति बनें जो परामर्श के बाद अनुभव साझा करे!
                </div>
              )}
            </div>
          </div>

          {/* Right Column / Sticky Quick Booking Card */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-xl border border-amber-200/80 sticky top-28">
              <div className="text-center pb-5 border-b border-slate-100">
                <span className="text-xs font-black uppercase tracking-widest text-amber-600">
                  सीधा परामर्श बुक करें
                </span>
                <div className="mt-2 flex items-baseline justify-center gap-1">
                  <span className="text-3xl font-black text-slate-900">₹{astro.fee || 501}</span>
                  <span className="text-xs text-slate-400 font-bold">/ सत्र</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  फोन कॉल या व्हाट्सएप द्वारा व्यक्तिगत परामर्श
                </p>
              </div>

              <div className="py-5 space-y-3 text-xs text-slate-600">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                    ✓
                  </div>
                  <span>100% गोपनीय एवं व्यक्तिगत चर्चा</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                    ✓
                  </div>
                  <span>जन्मपत्रिका / कुण्डली विश्लेषण</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                    ✓
                  </div>
                  <span>वैदिक उपाय एवं सरल समाधान</span>
                </div>
              </div>

              <button
                onClick={() => handleOpenBooking()}
                className="w-full py-4 rounded-2xl font-black text-sm text-slate-950 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                style={{
                  background: 'linear-gradient(135deg, #f9e07a 0%, #d4920a 60%, #b8760a 100%)',
                  boxShadow: '0 6px 20px rgba(212,146,10,0.3)',
                }}
              >
                <span>परामर्श फॉर्म भरें</span>
                <Sparkles className="w-4 h-4" />
              </button>

              {astro.contact?.whatsapp && (
                <a
                  href={`https://wa.me/91${astro.contact.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`नमस्ते पंडित जी, मुझे ramjikisena.com से आपका प्रोफाइल मिला। मैं परामर्श लेना चाहता हूँ।`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 w-full py-3 rounded-2xl font-bold text-xs text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>व्हाट्सएप पर संपर्क करें</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {isBookingOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-amber-100 relative my-auto overflow-hidden"
            >
              {/* Header */}
              <div className="p-5 sm:p-6 bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 text-white shrink-0 relative">
                <button
                  onClick={() => setIsBookingOpen(false)}
                  className="absolute right-4 top-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition"
                >
                  <X className="w-4 h-4" />
                </button>
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-200">
                  परामर्श अनुरोध फॉर्म
                </span>
                <h3 className="text-xl font-black mt-1">{astro.name} से परामर्श</h3>
                <p className="text-xs text-amber-100/80 mt-0.5">
                  {selectedOffering ? selectedOffering.title : 'व्यक्तिगत ज्योतिष सत्र'} • ₹{selectedOffering?.fee || astro.fee || 501}
                </p>
              </div>

              {/* Success Screen */}
              {bookingSuccess ? (
                <div className="p-6 sm:p-8 text-center space-y-4 overflow-y-auto flex-1">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-3xl">
                    ✓
                  </div>
                  <h4 className="text-xl font-black text-slate-900">परामर्श अनुरोध प्राप्त हुआ!</h4>
                  <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                    जय श्री राम! आपका अनुरोध ज्योतिषी जी के पास भेज दिया गया है। वे आपके दिए गए नंबर (<span className="font-bold">{bookingSuccess.clientPhone}</span>) पर जल्द ही संपर्क करेंगे।
                  </p>
                  <div className="bg-amber-50 rounded-2xl p-4 text-xs text-amber-900 font-semibold border border-amber-200/60 max-w-md mx-auto">
                    दिनांक: {new Date(bookingSuccess.consultationDate).toLocaleDateString('hi-IN')} • समय: {bookingSuccess.consultationTimeSlot}
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                    {astro.contact?.whatsapp && (
                      <a
                        href={`https://wa.me/91${astro.contact.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`जय श्री राम! मैंने ramjikisena.com पर परामर्श बुक किया है। नाम: ${bookingSuccess.clientName}, विषय: ${bookingSuccess.topic}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-3 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition flex items-center justify-center gap-2"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>सीधे व्हाट्सएप संदेश भेजें</span>
                      </a>
                    )}
                    <button
                      onClick={() => setIsBookingOpen(false)}
                      className="px-5 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition cursor-pointer"
                    >
                      पूर्ण करें (Close)
                    </button>
                  </div>
                </div>
              ) : (
                /* Booking Form */
                <form onSubmit={handleBookingSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
                  <div className="p-5 sm:p-6 space-y-4 text-xs overflow-y-auto flex-1">
                  {/* Client Info */}
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">आपका नाम (Full Name) *</label>
                      <input
                        type="text"
                        required
                        placeholder="उदा. राहुल शर्मा"
                        value={bookingForm.clientName}
                        onChange={(e) => setBookingForm({ ...bookingForm, clientName: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-semibold text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">मोबाइल नंबर (WhatsApp) *</label>
                      <input
                        type="tel"
                        required
                        placeholder="10 अंकों का मोबाइल नंबर"
                        value={bookingForm.clientPhone}
                        onChange={(e) => setBookingForm({ ...bookingForm, clientPhone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-semibold text-slate-800"
                      />
                    </div>
                  </div>

                  {/* Consultation Mode & Topic */}
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">परामर्श माध्यम (Mode)</label>
                      <select
                        value={bookingForm.consultationType}
                        onChange={(e: any) => setBookingForm({ ...bookingForm, consultationType: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-slate-800"
                      >
                        <option value="Call">📞 फोन कॉल (Voice Call)</option>
                        <option value="WhatsApp">💬 व्हाट्सएप कॉल / चैट</option>
                        <option value="In-Person">🏛️ प्रत्यक्ष मिलन (In-Person)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">परामर्श का मुख्य विषय (Topic)</label>
                      <select
                        value={bookingForm.topic}
                        onChange={(e) => setBookingForm({ ...bookingForm, topic: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-slate-800"
                      >
                        <option value="सामान्य मार्गदर्शन (General Life Guidance)">सामान्य मार्गदर्शन</option>
                        <option value="करियर एवं व्यापार (Career & Business)">करियर एवं व्यापार</option>
                        <option value="विवाह एवं प्रेम संबंध (Marriage & Kundli)">विवाह एवं प्रेम संबंध</option>
                        <option value="स्वास्थ्य एवं मानसिक शांति (Health)">स्वास्थ्य एवं मानसिक शांति</option>
                        <option value="टैरो कार्ड रीडिंग (Tarot Guidance)">टैरो कार्ड रीडिंग प्रश्न</option>
                        <option value="वास्तु शास्त्र (Vastu Guidance)">वास्तु शास्त्र परामर्श</option>
                        <option value="अन्य (Other Question)">अन्य प्रश्न</option>
                      </select>
                    </div>
                  </div>

                  {/* Date & Time Slot */}
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">दिनांक (Date) *</label>
                      <input
                        type="date"
                        required
                        min={new Date().toISOString().split('T')[0]}
                        value={bookingForm.consultationDate}
                        onChange={(e) => setBookingForm({ ...bookingForm, consultationDate: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">समय स्लॉट (Time Slot) *</label>
                      <select
                        value={bookingForm.consultationTimeSlot}
                        onChange={(e) => setBookingForm({ ...bookingForm, consultationTimeSlot: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-slate-800"
                      >
                        <option value="10:00 AM - 11:00 AM">प्रातः 10:00 AM - 11:00 AM</option>
                        <option value="11:00 AM - 12:00 PM">प्रातः 11:00 AM - 12:00 PM</option>
                        <option value="02:00 PM - 03:00 PM">दोपहर 02:00 PM - 03:00 PM</option>
                        <option value="04:00 PM - 05:00 PM">सायं 04:00 PM - 05:00 PM</option>
                        <option value="06:00 PM - 07:00 PM">सायं 06:00 PM - 07:00 PM</option>
                        <option value="08:00 PM - 09:00 PM">रात्रि 08:00 PM - 09:00 PM</option>
                      </select>
                    </div>
                  </div>

                  {/* Birth Details Box (Optional / Recommended for Kundli) */}
                  <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/60 space-y-2">
                    <span className="font-black text-amber-900 block">
                      📜 जन्म विवरण (कुण्डली विश्लेषण के लिए आवश्यक)
                    </span>
                    <div className="grid sm:grid-cols-3 gap-2">
                      <div>
                        <label className="text-[10px] font-bold text-slate-600 block mb-0.5">जन्म तिथि (DOB)</label>
                        <input
                          type="date"
                          value={bookingForm.dob}
                          onChange={(e) => setBookingForm({ ...bookingForm, dob: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-semibold text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-600 block mb-0.5">जन्म समय (TOB)</label>
                        <input
                          type="time"
                          value={bookingForm.tob}
                          onChange={(e) => setBookingForm({ ...bookingForm, tob: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-semibold text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-600 block mb-0.5">जन्म स्थान (शहर)</label>
                        <input
                          type="text"
                          placeholder="उदा. भोपाल, म.प्र."
                          value={bookingForm.pob}
                          onChange={(e) => setBookingForm({ ...bookingForm, pob: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-semibold text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Question */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      आपकी समस्या या प्रश्न का संक्षिप्त विवरण (Question)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="आप क्या पूछना चाहते हैं? जैसे: नौकरी कब लगेगी, विवाह में देरी, व्यापार वृद्धि आदि..."
                      value={bookingForm.question}
                      onChange={(e) => setBookingForm({ ...bookingForm, question: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium text-slate-800"
                    />
                  </div>

                  </div>

                  {/* Pinned Bottom Action Footer */}
                  <div className="p-4 sm:p-5 flex items-center justify-between border-t border-slate-100 bg-amber-50/40 shrink-0">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">शुल्क राशि</span>
                      <span className="text-base font-black text-amber-800">
                        ₹{selectedOffering?.fee || astro.fee || 501}
                      </span>
                    </div>

                    <button
                      type="submit"
                      disabled={bookingSubmitting}
                      className="px-6 py-3 rounded-xl font-black text-xs text-slate-950 transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
                      style={{
                        background: 'linear-gradient(135deg, #f9e07a 0%, #d4920a 60%, #b8760a 100%)',
                      }}
                    >
                      {bookingSubmitting ? 'अनुरोध भेजा जा रहा है...' : 'अनुरोध सबमिट करें 🙏'}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Review Modal */}
      <AnimatePresence>
        {isReviewOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-amber-100 relative my-auto max-h-[92vh] flex flex-col overflow-hidden"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0 mb-3">
                <div>
                  <h3 className="text-lg font-black text-slate-900">समीक्षा लिखें</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{astro.name} के साथ आपका अनुभव कैसा रहा?</p>
                </div>
                <button
                  onClick={() => setIsReviewOpen(false)}
                  className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleReviewSubmit} className="space-y-3.5 text-xs overflow-y-auto flex-1 pr-1">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">आपका नाम *</label>
                  <input
                    type="text"
                    required
                    placeholder="उदा. अमित पटेल"
                    value={reviewForm.userName}
                    onChange={(e) => setReviewForm({ ...reviewForm, userName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">रेटिंग (Rating) *</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                        className="p-1 hover:scale-110 transition"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= reviewForm.rating
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-200'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="font-bold text-slate-700 ml-2">{reviewForm.rating} / 5</span>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">आपकी प्रतिक्रिया / अनुभव *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="ज्योतिषी जी के मार्गदर्शन के बारे में अपना अनुभव बताएं..."
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-medium"
                  />
                </div>

                <button
                  type="submit"
                  disabled={reviewSubmitting}
                  className="w-full py-3 rounded-xl font-black text-xs bg-amber-600 text-white hover:bg-amber-700 transition"
                >
                  {reviewSubmitting ? 'सबमिट हो रहा है...' : 'समीक्षा सबमिट करें'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
