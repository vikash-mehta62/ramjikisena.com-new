'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Star, MessageSquare, CheckCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';

interface Pandit {
  _id: string;
  name: string;
  username: string;
  photo: string;
  photos: string[];
  contact: {
    phone: string;
    email: string;
    whatsapp: string;
  };
  location: {
    city: string;
    state: string;
    address: string;
  };
  experience: number;
  specialization: string[];
  languages: string[];
  qualification: string;
  description: string;
  about: string;
  services: Array<{
    _id: string;
    poojaType: string;
    price: number;
    duration: string;
    description: string;
  }>;
  averageRating: number;
  totalBookings: number;
  completedBookings: number;
  reviews: Array<{
    user: {
      name: string;
      username: string;
    };
    rating: number;
    text: string;
    createdAt: string;
  }>;
  isVerified: boolean;
  socialMedia: {
    facebook: string;
    instagram: string;
    youtube: string;
    twitter: string;
  };
}

export default function PanditDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [pandit, setPandit] = useState<Pandit | null>(null);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);

  useEffect(() => {
    fetchPanditDetails();
  }, [params.id]);

  const fetchPanditDetails = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pandits/${params.id}`);
      const data = await response.json();
      if (data.success) {
        setPandit(data.pandit);
      }
    } catch (error) {
      console.error('Error fetching pandit:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = (service?: any) => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    setSelectedService(service);
    setShowBookingModal(true);
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#FFFAF3]">
      <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!pandit) return (
    <div className="h-screen flex items-center justify-center bg-[#FFFAF3]">
      <div className="text-center">
        <p className="text-slate-500 text-lg mb-4">Pandit not found.</p>
        <button onClick={() => router.push('/pandits')} className="px-6 py-3 bg-orange-600 text-white rounded-2xl font-black hover:bg-orange-700 transition">
          Back to Pandits
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FFFAF3] text-slate-800 antialiased selection:bg-orange-200">
      <Navbar showAuthButtons={true} />
      <div className="h-20" />

      {/* Hero */}
      <div className="relative h-[40vh] overflow-hidden bg-slate-900">
        {pandit.photo ? (
          <img src={pandit.photo} className="w-full h-full object-cover opacity-40" alt={pandit.name} />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-9xl opacity-10">🕉️</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-8 left-0 w-full px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-3">
              {pandit.isVerified && (
                <span className="bg-green-500 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1.5">
                  <CheckCircle size={12} /> Verified
                </span>
              )}
              <div className="flex items-center gap-1 bg-white/10 backdrop-blur-md px-3 py-1 rounded-xl border border-white/20">
                <Star size={13} className="fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-black text-white">{pandit.averageRating.toFixed(1)}</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white drop-shadow">{pandit.name}</h1>
            <p className="flex items-center gap-2 text-white/80 mt-2 font-medium text-sm">
              <MapPin size={15} className="text-orange-400" /> {pandit.location.city}, {pandit.location.state}
            </p>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">

            {/* Profile Card */}
            <motion.section initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="bg-white rounded-[2rem] border border-orange-100 shadow-sm p-6 md:p-8">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="shrink-0">
                  <div className="w-28 h-28 rounded-full overflow-hidden bg-orange-100 border-4 border-white shadow-lg">
                    {pandit.photo ? (
                      <img src={pandit.photo} alt={pandit.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl">🕉️</div>
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap mb-3">
                    <h2 className="text-2xl font-black text-slate-900">{pandit.name}</h2>
                    {pandit.isVerified && (
                      <span className="flex items-center gap-1 text-xs font-black text-green-600 bg-green-50 border border-green-100 px-2.5 py-1 rounded-full">
                        <CheckCircle size={11} /> Verified
                      </span>
                    )}
                  </div>
                  <p className="text-slate-500 text-sm mb-4">@{pandit.username}</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                    <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-2xl">
                      <span>📍</span><span className="font-black text-slate-700 text-xs">{pandit.location.city}</span>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-2xl">
                      <span>📚</span><span className="font-black text-slate-700 text-xs">{pandit.experience} yrs exp</span>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-2xl">
                      <span>✅</span><span className="font-black text-slate-700 text-xs">{pandit.completedBookings} bookings</span>
                    </div>
                    {pandit.qualification && (
                      <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-2xl">
                        <span>🎓</span><span className="font-black text-slate-700 text-xs">{pandit.qualification}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-2xl">
                      <span>🗣️</span><span className="font-black text-slate-700 text-xs">{pandit.languages.join(', ')}</span>
                    </div>
                  </div>
                  {pandit.description && (
                    <p className="mt-4 text-slate-600 text-sm leading-relaxed">{pandit.description}</p>
                  )}
                </div>
              </div>
            </motion.section>

            {/* Specializations */}
            {pandit.specialization.length > 0 && (
              <motion.section initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="bg-white rounded-[2rem] border border-orange-100 border-l-4 border-l-orange-500 shadow-sm p-6 md:p-8">
                <h2 className="text-xl font-black text-slate-900 mb-5">🙏 Specializations</h2>
                <div className="flex flex-wrap gap-2">
                  {pandit.specialization.map((spec, index) => (
                    <span key={index} className="px-4 py-2 bg-orange-50 text-orange-700 rounded-full text-sm font-black border border-orange-100">
                      {spec}
                    </span>
                  ))}
                </div>
              </motion.section>
            )}

            {/* About */}
            {pandit.about && (
              <motion.section initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="bg-white rounded-[2rem] border border-orange-100 shadow-sm p-6 md:p-8">
                <h2 className="text-xl font-black text-slate-900 mb-5">📖 About</h2>
                <p className="text-slate-600 leading-relaxed whitespace-pre-line">{pandit.about}</p>
              </motion.section>
            )}

            {/* Gallery */}
            {pandit.photos && pandit.photos.length > 0 && (
              <motion.section initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="bg-white rounded-[2rem] border border-orange-100 shadow-sm p-6 md:p-8">
                <h2 className="text-xl font-black text-slate-900 mb-5">📸 Gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {pandit.photos.map((photo, index) => (
                    <div key={index} className="aspect-square rounded-2xl overflow-hidden">
                      <img src={photo} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                    </div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Reviews */}
            {pandit.reviews.length > 0 && (
              <motion.section initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="bg-white rounded-[2rem] border border-orange-100 shadow-sm p-6 md:p-8">
                <div className="flex justify-between items-center mb-5">
                  <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <MessageSquare size={20} className="text-orange-600" /> Reviews
                  </h2>
                  <span className="text-xs font-black text-slate-400">{pandit.reviews.length} total</span>
                </div>
                <div className="space-y-5">
                  {pandit.reviews.map((review, index) => (
                    <div key={index} className="border-b border-orange-50 pb-5 last:border-none">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-9 h-9 rounded-full bg-orange-600 flex items-center justify-center text-white font-black text-sm shrink-0">
                          {review.user.name[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-black text-slate-800 text-sm">{review.user.name}</p>
                          <div className="flex gap-0.5 text-yellow-500">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={11} fill={i < review.rating ? 'currentColor' : 'none'} />
                            ))}
                          </div>
                        </div>
                        <span className="ml-auto text-xs text-slate-400">{new Date(review.createdAt).toLocaleDateString('en-IN')}</span>
                      </div>
                      <p className="text-slate-600 text-sm italic pl-12">"{review.text}"</p>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Services */}
            {pandit.services && pandit.services.length > 0 && (
              <motion.section initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="bg-white rounded-[2rem] border border-orange-100 border-l-4 border-l-teal-500 shadow-sm p-6 md:p-8">
                <h2 className="text-xl font-black text-slate-900 mb-5">🪔 Services & Pricing</h2>
                <div className="space-y-4">
                  {pandit.services.map((service) => (
                    <div key={service._id} className="p-5 bg-orange-50 rounded-2xl border border-orange-100">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-black text-slate-800">{service.poojaType}</h4>
                        <span className="text-lg font-black text-orange-600">₹{service.price.toLocaleString()}</span>
                      </div>
                      {service.duration && (
                        <p className="text-xs font-black text-slate-500 mb-2">⏱️ {service.duration}</p>
                      )}
                      {service.description && (
                        <p className="text-sm text-slate-600 mb-4">{service.description}</p>
                      )}
                      <button onClick={() => handleBookNow(service)}
                        className="w-full py-2.5 bg-orange-600 text-white font-black rounded-2xl hover:bg-orange-700 transition-all active:scale-95 text-sm">
                        Book This Service
                      </button>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4">
            <div className="bg-white rounded-[2rem] border border-orange-100 shadow-sm p-6 sticky top-24 space-y-4">
              <div className="text-center pb-6 border-b border-orange-50">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Rating</p>
                <h2 className="text-5xl font-black text-slate-900">{pandit.averageRating.toFixed(1)}</h2>
                <div className="flex justify-center gap-1 text-yellow-500 mt-2">
                  {[...Array(5)].map((_, i) => <Star key={i} size={18} fill={i < Math.round(pandit.averageRating) ? 'currentColor' : 'none'} />)}
                </div>
                <p className="text-xs text-slate-400 mt-1">{pandit.reviews.length} reviews</p>
              </div>

              <button onClick={() => handleBookNow()}
                className="w-full bg-orange-600 text-white rounded-2xl font-black py-4 flex items-center justify-center gap-2 hover:bg-orange-700 transition-all active:scale-95 text-base">
                📅 Book Now
              </button>

              <div className="space-y-3 pt-2">
                {pandit.contact.phone && (
                  <a href={`tel:${pandit.contact.phone}`}
                    className="flex items-center gap-3 p-4 bg-green-50 rounded-2xl hover:bg-green-100 transition border border-green-100">
                    <Phone size={18} className="text-green-600 shrink-0" />
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone</p>
                      <p className="font-black text-green-700 text-sm">{pandit.contact.phone}</p>
                    </div>
                  </a>
                )}
                {pandit.contact.whatsapp && (
                  <a href={`https://wa.me/${pandit.contact.whatsapp}`} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 bg-green-50 rounded-2xl hover:bg-green-100 transition border border-green-100">
                    <span className="text-xl shrink-0">💬</span>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">WhatsApp</p>
                      <p className="font-black text-green-700 text-sm">Chat Now</p>
                    </div>
                  </a>
                )}
                {pandit.contact.email && (
                  <a href={`mailto:${pandit.contact.email}`}
                    className="flex items-center gap-3 p-4 bg-blue-50 rounded-2xl hover:bg-blue-100 transition border border-blue-100">
                    <Mail size={18} className="text-blue-600 shrink-0" />
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</p>
                      <p className="font-black text-blue-700 text-sm truncate">{pandit.contact.email}</p>
                    </div>
                  </a>
                )}
              </div>
            </div>
          </aside>
        </div>
      </main>

      <footer className="py-12 text-center border-t border-orange-100 mt-10">
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.8em]">जय श्री राम</p>
      </footer>

      {/* Booking Modal */}
      {showBookingModal && (
        <BookingModal
          pandit={pandit}
          service={selectedService}
          onClose={() => {
            setShowBookingModal(false);
            setSelectedService(null);
          }}
        />
      )}
    </div>
  );
}

// Booking Modal Component
function BookingModal({ pandit, service, onClose }: any) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    poojaType: service?.poojaType || '',
    poojaDate: '',
    poojaTime: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',
    numberOfPeople: '',
    specialInstructions: '',
    language: 'Hindi',
    samagriNeeded: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          pandit: pandit._id,
          poojaType: formData.poojaType,
          poojaDate: formData.poojaDate,
          poojaTime: formData.poojaTime,
          duration: service?.duration || '',
          location: {
            address: formData.address,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode,
            landmark: formData.landmark
          },
          price: service?.price || 0,
          platformFee: 0,
          totalAmount: service?.price || 0,
          requirements: {
            samagriNeeded: formData.samagriNeeded,
            numberOfPeople: parseInt(formData.numberOfPeople) || 0,
            specialInstructions: formData.specialInstructions,
            language: formData.language
          }
        })
      });
      const data = await response.json();
      if (data.success) {
        alert('Booking request sent successfully! Pandit will confirm soon.');
        router.push('/my-bookings');
      } else {
        alert(data.message || 'Booking failed');
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-white border border-orange-100 rounded-2xl px-4 py-3 text-sm font-bold focus:border-orange-500 outline-none shadow-sm focus:ring-2 focus:ring-orange-200";

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[200] p-4">
      <div className="bg-white rounded-[2rem] max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl relative">
        {/* Fixed Header */}
        <div className="bg-orange-600 text-white p-6 rounded-t-[2rem] flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-xl font-black">Book Pandit Ji</h2>
            <p className="text-orange-100 text-sm mt-0.5">{pandit.name}</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center text-xl hover:bg-white/30 transition font-black">×</button>
        </div>
        {/* Scrollable Body */}
        <div className="overflow-y-auto flex-1 rounded-b-[2rem]">

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <h3 className="font-black text-slate-900 mb-3 text-sm uppercase tracking-widest text-orange-600">Pooja Details</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Pooja Type *</label>
                <input type="text" value={formData.poojaType} onChange={(e) => setFormData({ ...formData, poojaType: e.target.value })} required className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Language</label>
                <select value={formData.language} onChange={(e) => setFormData({ ...formData, language: e.target.value })} className={inputClass}>
                  {pandit.languages.map((lang: string) => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Date *</label>
                <input type="date" value={formData.poojaDate} onChange={(e) => setFormData({ ...formData, poojaDate: e.target.value })} min={new Date().toISOString().split('T')[0]} required className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Time *</label>
                <input type="time" value={formData.poojaTime} onChange={(e) => setFormData({ ...formData, poojaTime: e.target.value })} required className={inputClass} />
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-black text-slate-900 mb-3 text-sm uppercase tracking-widest text-orange-600">Location</h3>
            <div className="space-y-3">
              <input type="text" placeholder="Full Address *" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} required className={inputClass} />
              <div className="grid md:grid-cols-3 gap-3">
                <input type="text" placeholder="City *" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} required className={inputClass} />
                <input type="text" placeholder="State *" value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} required className={inputClass} />
                <input type="text" placeholder="Pincode" value={formData.pincode} onChange={(e) => setFormData({ ...formData, pincode: e.target.value })} className={inputClass} />
              </div>
              <input type="text" placeholder="Landmark" value={formData.landmark} onChange={(e) => setFormData({ ...formData, landmark: e.target.value })} className={inputClass} />
            </div>
          </div>

          <div>
            <h3 className="font-black text-slate-900 mb-3 text-sm uppercase tracking-widest text-orange-600">Additional Details</h3>
            <div className="space-y-3">
              <input type="number" placeholder="Number of People" value={formData.numberOfPeople} onChange={(e) => setFormData({ ...formData, numberOfPeople: e.target.value })} className={inputClass} />
              <textarea placeholder="Special Instructions" value={formData.specialInstructions} onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })} rows={3} className={`${inputClass} resize-none`} />
              <label className="flex items-center gap-3 cursor-pointer p-4 bg-orange-50 rounded-2xl border border-orange-100">
                <input type="checkbox" checked={formData.samagriNeeded} onChange={(e) => setFormData({ ...formData, samagriNeeded: e.target.checked })} className="w-5 h-5 accent-orange-600" />
                <span className="font-black text-slate-700 text-sm">I need Pooja Samagri</span>
              </label>
            </div>
          </div>

          {service && (
            <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100 flex items-center justify-between">
              <span className="font-black text-slate-700">Total Amount</span>
              <span className="text-2xl font-black text-orange-600">₹{service.price.toLocaleString()}</span>
            </div>
          )}

          <button type="submit" disabled={loading}
            className="w-full bg-orange-600 text-white rounded-2xl font-black py-4 hover:bg-orange-700 transition-all active:scale-95 disabled:opacity-60">
            {loading ? 'Sending Request...' : 'Confirm Booking'}
          </button>
        </form>
        </div>
      </div>
    </div>
  );
}
