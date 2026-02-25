'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { panditFetch } from '@/lib/panditAuth';

interface Booking {
  _id: string;
  poojaType: string;
  poojaDate: string;
  poojaTime: string;
  duration: string;
  status: string;
  user: {
    name: string;
    contact: string;
    city: string;
  };
  location: {
    address: string;
    city: string;
    state: string;
    pincode: string;
    landmark: string;
  };
  requirements: {
    samagriNeeded: boolean;
    numberOfPeople: number;
    specialInstructions: string;
    language: string;
  };
  price: number;
  platformFee: number;
  totalAmount: number;
  createdAt: string;
}

export default function PanditBookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('panditToken');
    if (!token) {
      router.push('/pandit/login');
      return;
    }
    fetchBookings();
  }, [filter]);

  const fetchBookings = async () => {
    try {
      const url = filter === 'all' 
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/pandit-dashboard/bookings`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/pandit-dashboard/bookings?status=${filter}`;
      
      const response = await panditFetch(url);
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

  const handleUpdateStatus = async (bookingId: string, newStatus: string) => {
    if (!confirm(`Are you sure you want to ${newStatus} this booking?`)) {
      return;
    }

    setUpdating(true);
    try {
      const token = localStorage.getItem('panditToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pandit-dashboard/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.json();

      if (data.success) {
        alert(`Booking ${newStatus} successfully!`);
        setSelectedBooking(null);
        fetchBookings(); // Refresh the list
      } else {
        alert(data.message || 'Failed to update booking');
      }
    } catch (error) {
      console.error('Error updating booking:', error);
      alert('Something went wrong');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">🕉️</div>
          <p className="text-orange-900 font-bold">Loading Bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-orange-900 mb-2">All Bookings</h1>
            <p className="text-gray-600">Manage your pooja bookings</p>
          </div>
          <Link
            href="/pandit/dashboard"
            className="px-6 py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-all"
          >
            ← Dashboard
          </Link>
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
            <p className="text-gray-600">
              {filter === 'all' 
                ? 'You have no bookings yet' 
                : `No ${filter} bookings found`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white rounded-2xl p-6 shadow-lg border-2 border-orange-100 hover:border-orange-300 transition-all"
              >
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-black text-orange-900">{booking.poojaType}</h3>
                      <span className={`px-3 py-1 text-xs font-bold rounded-full border ${getStatusColor(booking.status)}`}>
                        {booking.status.toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div className="space-y-2">
                        <p><span className="font-bold">Date:</span> {new Date(booking.poojaDate).toLocaleDateString('en-IN')}</p>
                        <p><span className="font-bold">Time:</span> {formatTime(booking.poojaTime)}</p>
                        <p><span className="font-bold">Amount:</span> ₹{booking.price.toLocaleString()}</p>
                      </div>
                      <div className="space-y-2">
                        <p><span className="font-bold">User:</span> {booking.user.name}</p>
                        <p><span className="font-bold">Contact:</span> {booking.user.contact}</p>
                        <p><span className="font-bold">Location:</span> {booking.location.city}</p>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setSelectedBooking(booking)}
                    className="px-6 py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-all whitespace-nowrap"
                  >
                    View Details →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full my-8 max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-red-600 text-white p-6 rounded-t-3xl z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black">Booking Details</h2>
                  <p className="text-orange-100 mt-1">#{selectedBooking._id.slice(-8)}</p>
                </div>
                <button 
                  onClick={() => setSelectedBooking(null)} 
                  className="text-3xl hover:scale-110 transition-transform"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Status Badge */}
              <div className="text-center">
                <span className={`inline-block px-6 py-3 text-lg font-bold rounded-full border-2 ${getStatusColor(selectedBooking.status)}`}>
                  {selectedBooking.status.toUpperCase()}
                </span>
              </div>

              {/* User Information */}
              <div className="bg-blue-50 rounded-2xl p-6 border-2 border-blue-200">
                <h3 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
                  <span>👤</span> User Information
                </h3>
                <div className="space-y-2 text-gray-700">
                  <p><span className="font-bold">Name:</span> {selectedBooking.user.name}</p>
                  <p><span className="font-bold">Contact:</span> {selectedBooking.user.contact}</p>
                  <p><span className="font-bold">City:</span> {selectedBooking.user.city}</p>
                </div>
                <div className="flex gap-3 mt-4">
                  <a
                    href={`tel:${selectedBooking.user.contact}`}
                    className="flex-1 py-3 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-colors text-center"
                  >
                    📞 Call
                  </a>
                  <a
                    href={`https://wa.me/${selectedBooking.user.contact}`}
                    target="_blank"
                    className="flex-1 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors text-center"
                  >
                    💬 WhatsApp
                  </a>
                </div>
              </div>

              {/* Pooja Details */}
              <div className="bg-orange-50 rounded-2xl p-6 border-2 border-orange-200">
                <h3 className="font-bold text-orange-900 mb-4 flex items-center gap-2">
                  <span>🕉️</span> Pooja Details
                </h3>
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
                  {selectedBooking.duration && (
                    <div className="flex justify-between">
                      <span className="font-bold">Duration:</span>
                      <span>{selectedBooking.duration}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="font-bold">Booked On:</span>
                    <span>{new Date(selectedBooking.createdAt).toLocaleDateString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="bg-green-50 rounded-2xl p-6 border-2 border-green-200">
                <h3 className="font-bold text-green-900 mb-4 flex items-center gap-2">
                  <span>📍</span> Location
                </h3>
                <div className="space-y-2 text-gray-700">
                  <p><span className="font-bold">Address:</span> {selectedBooking.location.address}</p>
                  <p><span className="font-bold">City:</span> {selectedBooking.location.city}</p>
                  <p><span className="font-bold">State:</span> {selectedBooking.location.state}</p>
                  {selectedBooking.location.pincode && (
                    <p><span className="font-bold">Pincode:</span> {selectedBooking.location.pincode}</p>
                  )}
                  {selectedBooking.location.landmark && (
                    <p><span className="font-bold">Landmark:</span> {selectedBooking.location.landmark}</p>
                  )}
                </div>
              </div>

              {/* Requirements */}
              {selectedBooking.requirements && (
                <div className="bg-purple-50 rounded-2xl p-6 border-2 border-purple-200">
                  <h3 className="font-bold text-purple-900 mb-4 flex items-center gap-2">
                    <span>📋</span> Requirements
                  </h3>
                  <div className="space-y-2 text-gray-700">
                    {selectedBooking.requirements.language && (
                      <p><span className="font-bold">Language:</span> {selectedBooking.requirements.language}</p>
                    )}
                    {selectedBooking.requirements.numberOfPeople > 0 && (
                      <p><span className="font-bold">Number of People:</span> {selectedBooking.requirements.numberOfPeople}</p>
                    )}
                    <p><span className="font-bold">Samagri Needed:</span> {selectedBooking.requirements.samagriNeeded ? 'Yes' : 'No'}</p>
                    {selectedBooking.requirements.specialInstructions && (
                      <div>
                        <p className="font-bold mb-1">Special Instructions:</p>
                        <p className="bg-white p-3 rounded-lg">{selectedBooking.requirements.specialInstructions}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Payment Details */}
              <div className="bg-yellow-50 rounded-2xl p-6 border-2 border-yellow-200">
                <h3 className="font-bold text-yellow-900 mb-4 flex items-center gap-2">
                  <span>💰</span> Payment Details
                </h3>
                <div className="space-y-3 text-gray-700">
                  <div className="flex justify-between">
                    <span className="font-bold">Service Amount:</span>
                    <span>₹{selectedBooking.price.toLocaleString()}</span>
                  </div>
                  {selectedBooking.platformFee > 0 && (
                    <div className="flex justify-between">
                      <span className="font-bold">Platform Fee:</span>
                      <span>₹{selectedBooking.platformFee.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg border-t-2 border-yellow-300 pt-3">
                    <span className="font-black">Total Amount:</span>
                    <span className="font-black text-green-600">₹{selectedBooking.totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {selectedBooking.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleUpdateStatus(selectedBooking._id, 'confirmed')}
                      disabled={updating}
                      className="w-full py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-black rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                    >
                      {updating ? 'Updating...' : '✅ Accept Booking'}
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedBooking._id, 'rejected')}
                      disabled={updating}
                      className="w-full py-4 bg-gradient-to-r from-red-500 to-red-600 text-white font-black rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                    >
                      {updating ? 'Updating...' : '❌ Reject Booking'}
                    </button>
                  </>
                )}
                
                {selectedBooking.status === 'confirmed' && (
                  <button
                    onClick={() => handleUpdateStatus(selectedBooking._id, 'completed')}
                    disabled={updating}
                    className="w-full py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-black rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                  >
                    {updating ? 'Updating...' : '✓ Mark as Completed'}
                  </button>
                )}

                <button
                  onClick={() => setSelectedBooking(null)}
                  className="w-full py-4 bg-gray-200 text-gray-800 font-bold rounded-xl hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
