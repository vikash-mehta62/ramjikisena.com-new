'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';

interface Mandir {
  _id: string;
  name: string;
  description: string;
  history: string;
  location: {
    address: string;
    city: string;
    state: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  timing: {
    opening: string;
    closing: string;
    aarti: string[];
  };
  contact: {
    phone: string;
    email: string;
    website: string;
  };
  photos: string[];
  reviews: Array<{
    _id: string;
    user: {
      name: string;
      username: string;
    };
    rating: number;
    text: string;
    createdAt: string;
  }>;
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

  useEffect(() => {
    if (params.id) {
      fetchMandir();
    }
  }, [params.id]);

  const fetchMandir = async () => {
    try {
      const response = await api.get(`/api/mandirs/${params.id}`);
      const data = await response.json();
      
      if (data.success) {
        setMandir(data.mandir);
      }
    } catch (error) {
      console.error('Error fetching mandir:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await api.post(`/api/mandirs/${params.id}/review`, {
        rating,
        text: reviewText
      });
      const data = await response.json();

      if (data.success) {
        alert('✅ Review submitted successfully!');
        setReviewText('');
        setRating(5);
        fetchMandir(); // Refresh to show new review
      } else {
        alert(data.message || 'Failed to submit review');
      }
    } catch (error) {
      alert('Error submitting review. Please login first.');
    } finally {
      setSubmitting(false);
    }
  };

  const getDirections = () => {
    if (mandir?.location.coordinates) {
      const { lat, lng } = mandir.location.coordinates;
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🛕</div>
          <p className="text-xl text-orange-700">Loading Mandir Details...</p>
        </div>
      </div>
    );
  }

  if (!mandir) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <span className="text-8xl mb-4 block">❌</span>
          <h3 className="text-3xl font-bold text-gray-800 mb-3">Mandir Not Found</h3>
          <Link href="/mandirs" className="text-orange-600 hover:underline">
            ← Back to Mandirs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-red-50 relative ram-naam-bg">
      {/* Decorative Om Symbols */}
      <div className="om-symbol" style={{ top: '10%', left: '5%' }}>ॐ</div>
      <div className="om-symbol" style={{ top: '60%', right: '5%' }}>ॐ</div>

      {/* Header */}
      <header className="bg-gradient-to-r from-orange-600 via-red-600 to-orange-700 text-white py-6 shadow-lg relative z-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-4">
            <Link href="/mandirs" className="inline-flex items-center gap-2 hover:underline">
              ← Back to Mandirs
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/" className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition">
                🏠 Home
              </Link>
              <Link href="/dashboard" className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition">
                📊 Dashboard
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
              <span className="text-4xl">🛕</span>
            </div>
            <div>
              <h1 className="text-4xl font-bold divine-glow">{mandir.name}</h1>
              <p className="text-orange-100">
                {mandir.location.city}, {mandir.location.state}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Photo Gallery */}
          {mandir.photos && mandir.photos.length > 0 && (
            <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 border-4 divine-border">
              <h2 className="text-2xl font-bold text-orange-700 mb-4">📸 Photo Gallery</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {mandir.photos.map((photo, index) => (
                  <div key={index} className="relative h-64 rounded-xl overflow-hidden shadow-lg group">
                    <img 
                      src={photo} 
                      alt={`${mandir.name} - Photo ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rating and Actions */}
          <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 border-4 divine-border">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-yellow-100 px-6 py-3 rounded-xl">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl">⭐</span>
                    <span className="text-3xl font-bold text-yellow-700">
                      {mandir.averageRating > 0 ? mandir.averageRating.toFixed(1) : 'New'}
                    </span>
                  </div>
                  <p className="text-sm text-yellow-600 text-center">
                    {mandir.reviews.length} review{mandir.reviews.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                {mandir.location.coordinates && (
                  <>
                    <button
                      onClick={getDirections}
                      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all"
                    >
                      🗺️ Get Directions
                    </button>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${mandir.location.coordinates.lat},${mandir.location.coordinates.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all"
                    >
                      📍 View on Map
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          {mandir.description && (
            <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 border-2 border-orange-200">
              <h2 className="text-2xl font-bold text-orange-700 mb-4">📖 About</h2>
              <p className="text-gray-700 leading-relaxed">{mandir.description}</p>
            </div>
          )}

          {/* History */}
          {mandir.history && (
            <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 border-2 border-orange-200">
              <h2 className="text-2xl font-bold text-orange-700 mb-4">🏛️ History</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{mandir.history}</p>
            </div>
          )}

          {/* Location & Timing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Location */}
            <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 border-2 border-orange-200">
              <h2 className="text-2xl font-bold text-orange-700 mb-4">📍 Location</h2>
              <div className="space-y-2">
                {mandir.location.address && (
                  <p className="text-gray-700">{mandir.location.address}</p>
                )}
                <p className="text-gray-700">{mandir.location.city}, {mandir.location.state}</p>
              </div>
            </div>

            {/* Timing */}
            {mandir.timing && (
              <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 border-2 border-orange-200">
                <h2 className="text-2xl font-bold text-orange-700 mb-4">🕐 Timing</h2>
                <div className="space-y-2">
                  <p className="text-gray-700">
                    <span className="font-semibold">Opening:</span> {mandir.timing.opening}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Closing:</span> {mandir.timing.closing}
                  </p>
                  {mandir.timing.aarti && mandir.timing.aarti.length > 0 && (
                    <div>
                      <p className="font-semibold text-gray-700 mb-1">Aarti Times:</p>
                      {mandir.timing.aarti.map((time, idx) => (
                        <p key={idx} className="text-gray-600 ml-4">• {time}</p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Contact */}
          {(mandir.contact.phone || mandir.contact.email || mandir.contact.website) && (
            <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 border-2 border-orange-200">
              <h2 className="text-2xl font-bold text-orange-700 mb-4">📞 Contact</h2>
              <div className="space-y-2">
                {mandir.contact.phone && (
                  <p className="text-gray-700">
                    <span className="font-semibold">Phone:</span> {mandir.contact.phone}
                  </p>
                )}
                {mandir.contact.email && (
                  <p className="text-gray-700">
                    <span className="font-semibold">Email:</span> {mandir.contact.email}
                  </p>
                )}
                {mandir.contact.website && (
                  <p className="text-gray-700">
                    <span className="font-semibold">Website:</span>{' '}
                    <a href={mandir.contact.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {mandir.contact.website}
                    </a>
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Add Review */}
          <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 border-2 border-orange-200">
            <h2 className="text-2xl font-bold text-orange-700 mb-4">✍️ Write a Review</h2>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`text-4xl transition ${
                        star <= rating ? 'text-yellow-500' : 'text-gray-300'
                      }`}
                    >
                      ⭐
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Your Review (Optional)</label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  rows={4}
                  placeholder="Share your experience..."
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50"
              >
                {submitting ? '⏳ Submitting...' : '✅ Submit Review'}
              </button>
            </form>
          </div>

          {/* Reviews */}
          {mandir.reviews.length > 0 && (
            <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 border-2 border-orange-200">
              <h2 className="text-2xl font-bold text-orange-700 mb-4">
                💬 Reviews ({mandir.reviews.length})
              </h2>
              <div className="space-y-4">
                {mandir.reviews.map((review) => (
                  <div key={review._id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-bold text-gray-800">{review.user.name}</p>
                        <p className="text-sm text-gray-500">@{review.user.username}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <span key={i} className="text-yellow-500">⭐</span>
                        ))}
                      </div>
                    </div>
                    {review.text && (
                      <p className="text-gray-700 mt-2">{review.text}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-orange-600 via-red-600 to-orange-700 text-white py-8 mt-16 relative z-10">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-3">
            <p className="text-2xl font-bold divine-glow">🕉️ राम राम 🕉️</p>
            <p className="text-sm">© 2024 Ramji Ki Sena - All Rights Reserved</p>
            <p className="text-xs text-orange-200">जय श्री राम | जय हनुमान</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
