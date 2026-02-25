'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
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
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

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

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="h-20 md:h-20"></div>
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin text-6xl mb-4">🕉️</div>
            <p className="text-orange-900 font-bold">Loading...</p>
          </div>
        </div>
      </>
    );
  }

  if (!pandit) {
    return (
      <>
        <Navbar />
        <div className="h-20 md:h-20"></div>
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-2xl font-black text-orange-900 mb-4">Pandit Not Found</h2>
            <Link href="/pandits" className="px-6 py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600">
              Back to Pandits
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="h-20 md:h-20"></div>
      
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 py-8 px-4">
        <div className="container mx-auto max-w-7xl">
          
          {/* Back Button */}
          <Link href="/pandits" className="inline-flex items-center gap-2 text-orange-600 font-bold hover:text-orange-700 mb-6">
            ← Back to Pandits
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column - Profile */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Header Card */}
              <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-orange-100">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Photo */}
                  <div className="flex-shrink-0">
                    <div className="w-40 h-40 rounded-full overflow-hidden bg-gradient-to-br from-orange-200 to-red-200 border-4 border-white shadow-xl">
                      {pandit.photo ? (
                        <img src={pandit.photo} alt={pandit.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-6xl">🕉️</div>
                      )}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
                      <div>
                        <h1 className="text-3xl font-black text-orange-900 mb-2">{pandit.name}</h1>
                        <p className="text-gray-600">@{pandit.username}</p>
                      </div>
                      {pandit.isVerified && (
                        <span className="px-4 py-2 bg-green-500 text-white rounded-full text-sm font-bold flex items-center gap-2">
                          ✓ Verified Pandit
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-6 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-yellow-500 text-2xl">⭐</span>
                        <span className="text-2xl font-black text-gray-800">{pandit.averageRating.toFixed(1)}</span>
                        <span className="text-gray-500">({pandit.reviews.length} reviews)</span>
                      </div>
                      <div className="text-gray-600">
                        <span className="font-bold">{pandit.completedBookings}</span> completed bookings
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <span>📍</span>
                        <span>{pandit.location.city}, {pandit.location.state}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>📚</span>
                        <span>{pandit.experience} years experience</span>
                      </div>
                      {pandit.qualification && (
                        <div className="flex items-center gap-2">
                          <span>🎓</span>
                          <span>{pandit.qualification}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <span>🗣️</span>
                        <span>{pandit.languages.join(', ')}</span>
                      </div>
                    </div>

                    {pandit.description && (
                      <p className="mt-4 text-gray-700">{pandit.description}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Specializations */}
              {pandit.specialization.length > 0 && (
                <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-orange-100">
                  <h2 className="text-2xl font-black text-orange-900 mb-4">Specializations</h2>
                  <div className="flex flex-wrap gap-3">
                    {pandit.specialization.map((spec, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-orange-100 text-orange-700 rounded-full font-bold"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* About */}
              {pandit.about && (
                <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-orange-100">
                  <h2 className="text-2xl font-black text-orange-900 mb-4">About</h2>
                  <p className="text-gray-700 whitespace-pre-line">{pandit.about}</p>
                </div>
              )}

              {/* Photo Gallery */}
              {pandit.photos && pandit.photos.length > 0 && (
                <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-orange-100">
                  <h2 className="text-2xl font-black text-orange-900 mb-4">Gallery</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {pandit.photos.map((photo, index) => (
                      <div
                        key={index}
                        onClick={() => setSelectedPhotoIndex(index)}
                        className="aspect-square rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-transform"
                      >
                        <img src={photo} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reviews */}
              {pandit.reviews.length > 0 && (
                <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-orange-100">
                  <h2 className="text-2xl font-black text-orange-900 mb-6">Reviews</h2>
                  <div className="space-y-4">
                    {pandit.reviews.map((review, index) => (
                      <div key={index} className="border-b border-gray-200 pb-4 last:border-0">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="font-bold text-gray-800">{review.user.name}</p>
                            <p className="text-sm text-gray-500">@{review.user.username}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={i < review.rating ? 'text-yellow-500' : 'text-gray-300'}>
                                ⭐
                              </span>
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-700">{review.text}</p>
                        <p className="text-xs text-gray-400 mt-2">
                          {new Date(review.createdAt).toLocaleDateString('en-IN')}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Services & Booking */}
            <div className="space-y-6">
              
              {/* Contact Card */}
              <div className="bg-white rounded-3xl p-6 shadow-xl border-2 border-orange-100 sticky top-24">
                <h3 className="text-xl font-black text-orange-900 mb-4">Contact Information</h3>
                <div className="space-y-3 text-sm">
                  {pandit.contact.phone && (
                    <a href={`tel:${pandit.contact.phone}`} className="flex items-center gap-3 p-3 bg-green-50 rounded-xl hover:bg-green-100 transition-colors">
                      <span className="text-2xl">📞</span>
                      <span className="font-bold text-green-700">{pandit.contact.phone}</span>
                    </a>
                  )}
                  {pandit.contact.whatsapp && (
                    <a href={`https://wa.me/${pandit.contact.whatsapp}`} target="_blank" className="flex items-center gap-3 p-3 bg-green-50 rounded-xl hover:bg-green-100 transition-colors">
                      <span className="text-2xl">💬</span>
                      <span className="font-bold text-green-700">WhatsApp</span>
                    </a>
                  )}
                  {pandit.contact.email && (
                    <a href={`mailto:${pandit.contact.email}`} className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
                      <span className="text-2xl">📧</span>
                      <span className="font-bold text-blue-700">{pandit.contact.email}</span>
                    </a>
                  )}
                </div>

                {/* Quick Book Button */}
                <button
                  onClick={() => handleBookNow()}
                  className="w-full mt-6 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white font-black rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
                >
                  📅 Book Now
                </button>
              </div>

              {/* Services */}
              {pandit.services && pandit.services.length > 0 && (
                <div className="bg-white rounded-3xl p-6 shadow-xl border-2 border-orange-100">
                  <h3 className="text-xl font-black text-orange-900 mb-4">Services & Pricing</h3>
                  <div className="space-y-3">
                    {pandit.services.map((service) => (
                      <div key={service._id} className="border-2 border-gray-100 rounded-xl p-4 hover:border-orange-200 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-bold text-gray-800">{service.poojaType}</h4>
                          <span className="text-lg font-black text-orange-600">₹{service.price.toLocaleString()}</span>
                        </div>
                        {service.duration && (
                          <p className="text-sm text-gray-500 mb-2">⏱️ {service.duration}</p>
                        )}
                        {service.description && (
                          <p className="text-sm text-gray-600 mb-3">{service.description}</p>
                        )}
                        <button
                          onClick={() => handleBookNow(service)}
                          className="w-full py-2 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 transition-colors text-sm"
                        >
                          Book This Service
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

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
    </>
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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full my-8 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-red-600 text-white p-6 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black">Book Pandit Ji</h2>
            <button onClick={onClose} className="text-3xl hover:scale-110 transition-transform">×</button>
          </div>
          <p className="text-orange-100 mt-2">{pandit.name}</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Pooja Details */}
          <div>
            <h3 className="font-bold text-orange-900 mb-3">Pooja Details</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Pooja Type *</label>
                <input
                  type="text"
                  value={formData.poojaType}
                  onChange={(e) => setFormData({ ...formData, poojaType: e.target.value })}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Language</label>
                <select
                  value={formData.language}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
                >
                  {pandit.languages.map((lang: string) => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Date *</label>
                <input
                  type="date"
                  value={formData.poojaDate}
                  onChange={(e) => setFormData({ ...formData, poojaDate: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Time *</label>
                <input
                  type="time"
                  value={formData.poojaTime}
                  onChange={(e) => setFormData({ ...formData, poojaTime: e.target.value })}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <h3 className="font-bold text-orange-900 mb-3">Location</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Full Address *"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
              />
              <div className="grid md:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="City *"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="State *"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Pincode"
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
                />
              </div>
              <input
                type="text"
                placeholder="Landmark"
                value={formData.landmark}
                onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Additional Details */}
          <div>
            <h3 className="font-bold text-orange-900 mb-3">Additional Details</h3>
            <div className="space-y-4">
              <input
                type="number"
                placeholder="Number of People"
                value={formData.numberOfPeople}
                onChange={(e) => setFormData({ ...formData, numberOfPeople: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
              />
              <textarea
                placeholder="Special Instructions"
                value={formData.specialInstructions}
                onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none resize-none"
              />
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.samagriNeeded}
                  onChange={(e) => setFormData({ ...formData, samagriNeeded: e.target.checked })}
                  className="w-5 h-5"
                />
                <span className="font-bold text-gray-700">I need Pooja Samagri</span>
              </label>
            </div>
          </div>

          {/* Price */}
          {service && (
            <div className="bg-orange-50 rounded-xl p-4 border-2 border-orange-200">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-700">Total Amount:</span>
                <span className="text-2xl font-black text-orange-600">₹{service.price.toLocaleString()}</span>
              </div>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white font-black rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
          >
            {loading ? 'Sending Request...' : 'Confirm Booking'}
          </button>
        </form>
      </div>
    </div>
  );
}
