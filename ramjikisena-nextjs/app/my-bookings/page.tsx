'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface Booking {
  _id: string;
  pandit: {
    _id: string;
    name: string;
    photo: string;
    contact: {
      phone: string;
    };
  };
  poojaType: string;
  poojaDate: string;
  poojaTime: string;
  status: string;
  location: {
    address: string;
    city: string;
  };
  price: number;
  createdAt: string;
}

export default function MyBookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchBookings();
  }, [filter]);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const url = filter === 'all'
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/bookings/my-bookings`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/bookings/my-bookings?status=${filter}`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setBookings(data.bookings);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-300';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-300';
      case 'cancelled': return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const formatTime = (time: string) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="h-20 md:h-20"></div>
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin text-6xl mb-4">🕉️</div>
            <p className="text-orange-900 font-bold">Loading Bookings...</p>
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
        <div className="container mx-auto max-w-6xl">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-black text-orange-900 mb-2">My Bookings</h1>
            <p className="text-gray-600">Manage your pandit bookings</p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl p-4 mb-6 shadow-lg border-2 border-orange-100">
            <div className="flex flex-wrap gap-3">
              {['all', 'pending', 'confirmed', 'completed', 'rejected', 'cancelled'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-6 py-2 rounded-xl font-bold transition-all ${
                    filter === status
                      ? 'bg-orange-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Bookings List */}
          {bookings.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center shadow-xl border-2 border-orange-100">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-xl font-black text-orange-900 mb-2">No Bookings Found</h3>
              <p className="text-gray-600 mb-6">
                {filter === 'all'
                  ? 'You haven\'t made any bookings yet'
                  : `No ${filter} bookings found`}
              </p>
              <Link
                href="/pandits"
                className="inline-block px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold rounded-xl hover:shadow-lg transition-all"
              >
                Book a Pandit
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking._id}
                  className="bg-white rounded-2xl p-6 shadow-lg border-2 border-orange-100 hover:border-orange-300 transition-all"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Pandit Info */}
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-orange-200 to-red-200 flex-shrink-0">
                        {booking.pandit.photo ? (
                          <img src={booking.pandit.photo} alt={booking.pandit.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-3xl">🕉️</div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-black text-orange-900">{booking.poojaType}</h3>
                          <span className={`px-3 py-1 text-xs font-bold rounded-full border ${getStatusColor(booking.status)}`}>
                            {booking.status.toUpperCase()}
                          </span>
                        </div>
                        <p className="font-bold text-gray-700 mb-1">{booking.pandit.name}</p>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>📅 {new Date(booking.poojaDate).toLocaleDateString('en-IN')} at {formatTime(booking.poojaTime)}</p>
                          <p>📍 {booking.location.city}</p>
                          <p>💰 ₹{booking.price.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 justify-center">
                      <button
                        onClick={() => setSelectedBooking(booking)}
                        className="px-6 py-2 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-colors text-center text-sm"
                      >
                        View Details
                      </button>
                      <Link
                        href={`/pandits/${booking.pandit._id}`}
                        className="px-6 py-2 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition-colors text-center text-sm"
                      >
                        View Pandit
                      </Link>
                      {booking.pandit.contact.phone && (
                        <a
                          href={`tel:${booking.pandit.contact.phone}`}
                          className="px-6 py-2 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-colors text-center text-sm"
                        >
                          📞 Call
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-red-600 text-white p-6 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black">Booking Details</h2>
                <button onClick={() => setSelectedBooking(null)} className="text-3xl hover:scale-110 transition-transform">×</button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Status */}
              <div className="text-center">
                <span className={`inline-block px-6 py-3 text-lg font-bold rounded-full border-2 ${getStatusColor(selectedBooking.status)}`}>
                  {selectedBooking.status.toUpperCase()}
                </span>
              </div>

              {/* Pandit Info */}
              <div className="bg-orange-50 rounded-2xl p-6 border-2 border-orange-200">
                <h3 className="font-bold text-orange-900 mb-4">Pandit Information</h3>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-orange-200 to-red-200">
                    {selectedBooking.pandit.photo ? (
                      <img src={selectedBooking.pandit.photo} alt={selectedBooking.pandit.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl">🕉️</div>
                    )}
                  </div>
                  <div>
                    <p className="text-xl font-black text-orange-900">{selectedBooking.pandit.name}</p>
                    <p className="text-gray-600">📞 {selectedBooking.pandit.contact.phone}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Link
                    href={`/pandits/${selectedBooking.pandit._id}`}
                    className="flex-1 py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-colors text-center"
                  >
                    View Profile
                  </Link>
                  <a
                    href={`tel:${selectedBooking.pandit.contact.phone}`}
                    className="flex-1 py-3 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-colors text-center"
                  >
                    📞 Call
                  </a>
                </div>
              </div>

              {/* Pooja Details */}
              <div className="bg-blue-50 rounded-2xl p-6 border-2 border-blue-200">
                <h3 className="font-bold text-blue-900 mb-4">Pooja Details</h3>
                <div className="space-y-3 text-gray-700">
                  <div className="flex justify-between">
                    <span className="font-bold">Pooja Type:</span>
                    <span>{selectedBooking.poojaType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold">Date:</span>
                    <span>{new Date(selectedBooking.poojaDate).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold">Time:</span>
                    <span>{formatTime(selectedBooking.poojaTime)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold">Amount:</span>
                    <span className="text-xl font-black text-green-600">₹{selectedBooking.price.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="bg-green-50 rounded-2xl p-6 border-2 border-green-200">
                <h3 className="font-bold text-green-900 mb-4">Location</h3>
                <div className="space-y-2 text-gray-700">
                  <p><span className="font-bold">Address:</span> {selectedBooking.location.address}</p>
                  <p><span className="font-bold">City:</span> {selectedBooking.location.city}</p>
                </div>
              </div>

              {/* Booking Info */}
              <div className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-200">
                <h3 className="font-bold text-gray-900 mb-4">Booking Information</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><span className="font-bold">Booking ID:</span> {selectedBooking._id}</p>
                  <p><span className="font-bold">Booked On:</span> {new Date(selectedBooking.createdAt).toLocaleDateString('en-IN')} at {new Date(selectedBooking.createdAt).toLocaleTimeString('en-IN')}</p>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setSelectedBooking(null)}
                className="w-full py-4 bg-gray-200 text-gray-800 font-bold rounded-xl hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}
