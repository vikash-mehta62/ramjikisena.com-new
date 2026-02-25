'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface PanditInfo {
  _id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  state: string;
  photo?: string;
  experience: number;
  specialization: string[];
  averageRating: number;
  totalBookings: number;
  isVerified: boolean;
  isActive: boolean;
}

interface Stats {
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  completedBookings: number;
  totalEarnings: number;
  averageRating: number;
  totalReviews: number;
}

interface Booking {
  _id: string;
  poojaType: string;
  poojaDate: string;
  poojaTime: string;
  status: string;
  user: {
    name: string;
    contact: string;
  };
  location: {
    address: string;
    city: string;
  };
  price: number;
}

export default function PanditDashboard() {
  const router = useRouter();
  const [pandit, setPandit] = useState<PanditInfo | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    checkAuth();
    fetchDashboardData();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('panditToken');
    const panditData = localStorage.getItem('pandit');
    
    if (!token || !panditData) {
      router.push('/pandit/login');
      return;
    }
    
    try {
      setPandit(JSON.parse(panditData));
    } catch (e) {
      router.push('/pandit/login');
    }
  };

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('panditToken');
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pandit-dashboard/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setStats(data.stats);
        setUpcomingBookings(data.upcomingBookings || []);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
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
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">🕉️</div>
          <p className="text-orange-900 font-bold">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-3xl p-8 mb-8 shadow-xl text-white">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-4xl shadow-lg">
                {pandit?.photo ? (
                  <img src={pandit.photo} alt={pandit.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  '🕉️'
                )}
              </div>
              <div>
                <h1 className="text-3xl font-black mb-1">
                  Namaste, {pandit?.name}
                </h1>
                <p className="text-orange-100">
                  {pandit?.city}, {pandit?.state}
                </p>
                <div className="flex items-center gap-3 mt-2">
                  {pandit?.isVerified ? (
                    <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                      ✓ Verified
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-yellow-500 text-white text-xs font-bold rounded-full">
                      ⏳ Pending Verification
                    </span>
                  )}
                  <span className="text-sm">⭐ {pandit?.averageRating ? pandit.averageRating.toFixed(1) : '0.0'} Rating</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Link
                href="/pandit/profile"
                className="px-6 py-3 bg-white text-orange-600 rounded-xl font-bold hover:bg-orange-50 transition-all"
              >
                Edit Profile
              </Link>
              <Link
                href="/"
                className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl font-bold hover:bg-white/30 transition-all"
              >
                Home
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-orange-100">
              <div className="text-4xl mb-2">📊</div>
              <div className="text-3xl font-black text-orange-900">{stats.totalBookings}</div>
              <div className="text-sm text-gray-600 font-bold">Total Bookings</div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-yellow-100">
              <div className="text-4xl mb-2">⏳</div>
              <div className="text-3xl font-black text-yellow-700">{stats.pendingBookings}</div>
              <div className="text-sm text-gray-600 font-bold">Pending Requests</div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-green-100">
              <div className="text-4xl mb-2">✅</div>
              <div className="text-3xl font-black text-green-700">{stats.completedBookings}</div>
              <div className="text-sm text-gray-600 font-bold">Completed</div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-blue-100">
              <div className="text-4xl mb-2">💰</div>
              <div className="text-3xl font-black text-blue-700">₹{stats.totalEarnings.toLocaleString()}</div>
              <div className="text-sm text-gray-600 font-bold">Total Earnings</div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            href="/pandit/bookings"
            className="bg-white rounded-2xl p-6 shadow-lg border-2 border-orange-100 hover:border-orange-300 transition-all group"
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">📅</div>
            <h3 className="text-xl font-black text-orange-900 mb-2">All Bookings</h3>
            <p className="text-sm text-gray-600">View and manage all your bookings</p>
          </Link>

          <Link
            href="/pandit/profile"
            className="bg-white rounded-2xl p-6 shadow-lg border-2 border-orange-100 hover:border-orange-300 transition-all group"
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">👤</div>
            <h3 className="text-xl font-black text-orange-900 mb-2">My Profile</h3>
            <p className="text-sm text-gray-600">Update your profile and services</p>
          </Link>

          <Link
            href="/pandit/earnings"
            className="bg-white rounded-2xl p-6 shadow-lg border-2 border-orange-100 hover:border-orange-300 transition-all group"
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">💵</div>
            <h3 className="text-xl font-black text-orange-900 mb-2">Earnings</h3>
            <p className="text-sm text-gray-600">View your earnings report</p>
          </Link>
        </div>

        {/* Upcoming Bookings */}
        <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-orange-100">
          <h2 className="text-2xl font-black text-orange-900 mb-6 flex items-center gap-3">
            <span>📋</span>
            Upcoming Bookings
          </h2>

          {upcomingBookings.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-gray-600 font-bold">No upcoming bookings</p>
              <p className="text-sm text-gray-500 mt-2">New bookings will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingBookings.map((booking) => (
                <div
                  key={booking._id}
                  className="border-2 border-gray-100 rounded-2xl p-6 hover:border-orange-200 transition-all"
                >
                  <div className="flex items-start justify-between flex-wrap gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-black text-orange-900">{booking.poojaType}</h3>
                        <span className={`px-3 py-1 text-xs font-bold rounded-full border ${getStatusColor(booking.status)}`}>
                          {booking.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="space-y-2 text-sm text-gray-600">
                        <p><span className="font-bold">Date:</span> {new Date(booking.poojaDate).toLocaleDateString('en-IN')} at {formatTime(booking.poojaTime)}</p>
                        <p><span className="font-bold">User:</span> {booking.user.name} ({booking.user.contact})</p>
                        <p><span className="font-bold">Location:</span> {booking.location.address}, {booking.location.city}</p>
                        <p><span className="font-bold">Amount:</span> ₹{booking.price}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedBooking(booking)}
                      className="px-6 py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-all"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick View Modal */}
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

              {/* Pooja Details */}
              <div className="bg-orange-50 rounded-2xl p-6 border-2 border-orange-200">
                <h3 className="font-bold text-orange-900 mb-4">Pooja Details</h3>
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

              {/* User Info */}
              <div className="bg-blue-50 rounded-2xl p-6 border-2 border-blue-200">
                <h3 className="font-bold text-blue-900 mb-4">User Information</h3>
                <div className="space-y-2 text-gray-700">
                  <p><span className="font-bold">Name:</span> {selectedBooking.user.name}</p>
                  <p><span className="font-bold">Contact:</span> {selectedBooking.user.contact}</p>
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

              {/* Location */}
              <div className="bg-green-50 rounded-2xl p-6 border-2 border-green-200">
                <h3 className="font-bold text-green-900 mb-4">Location</h3>
                <div className="space-y-2 text-gray-700">
                  <p><span className="font-bold">Address:</span> {selectedBooking.location.address}</p>
                  <p><span className="font-bold">City:</span> {selectedBooking.location.city}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <Link
                  href="/pandit/bookings"
                  className="block w-full py-4 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-colors text-center"
                >
                  View All Bookings
                </Link>
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
