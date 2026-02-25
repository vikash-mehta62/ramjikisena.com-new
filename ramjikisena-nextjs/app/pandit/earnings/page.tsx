'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { panditFetch } from '@/lib/panditAuth';

interface Booking {
  _id: string;
  poojaType: string;
  completedAt: string;
  price: number;
  user: {
    name: string;
  };
}

export default function PanditEarningsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('panditToken');
    if (!token) {
      router.push('/pandit/login');
      return;
    }
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      let url = `${process.env.NEXT_PUBLIC_API_URL}/api/pandit-dashboard/earnings`;
      
      if (dateRange.startDate && dateRange.endDate) {
        url += `?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`;
      }
      
      const response = await panditFetch(url);
      const data = await response.json();
      
      if (data.success) {
        setBookings(data.bookings);
        setTotalEarnings(data.totalEarnings);
      }
    } catch (error) {
      console.error('Error fetching earnings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    setLoading(true);
    fetchEarnings();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">🕉️</div>
          <p className="text-orange-900 font-bold">Loading Earnings...</p>
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
            <h1 className="text-3xl font-black text-orange-900 mb-2">Earnings Report</h1>
            <p className="text-gray-600">Track your completed bookings and earnings</p>
          </div>
          <Link
            href="/pandit/dashboard"
            className="px-6 py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-all"
          >
            ← Dashboard
          </Link>
        </div>

        {/* Total Earnings Card */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl p-8 mb-8 shadow-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 mb-2 font-bold">Total Earnings</p>
              <h2 className="text-5xl font-black">₹{totalEarnings.toLocaleString()}</h2>
              <p className="text-green-100 mt-2">{bookings.length} completed bookings</p>
            </div>
            <div className="text-7xl">💰</div>
          </div>
        </div>

        {/* Date Filter */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-lg border-2 border-orange-100">
          <h3 className="text-lg font-bold text-orange-900 mb-4">Filter by Date Range</h3>
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-bold text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
              />
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-bold text-gray-700 mb-2">End Date</label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
              />
            </div>
            <button
              onClick={handleFilter}
              className="px-8 py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-all"
            >
              Apply Filter
            </button>
            <button
              onClick={() => {
                setDateRange({ startDate: '', endDate: '' });
                setLoading(true);
                fetchEarnings();
              }}
              className="px-8 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-all"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Earnings List */}
        <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-orange-100">
          <h2 className="text-2xl font-black text-orange-900 mb-6">Completed Bookings</h2>

          {bookings.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-xl font-black text-orange-900 mb-2">No Earnings Yet</h3>
              <p className="text-gray-600">Complete bookings to see your earnings here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking._id}
                  className="border-2 border-gray-100 rounded-2xl p-6 hover:border-orange-200 transition-all"
                >
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-black text-orange-900 mb-2">{booking.poojaType}</h3>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p><span className="font-bold">User:</span> {booking.user.name}</p>
                        <p><span className="font-bold">Completed:</span> {new Date(booking.completedAt).toLocaleDateString('en-IN')}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-black text-green-600">₹{booking.price.toLocaleString()}</div>
                      <div className="text-xs text-gray-500 mt-1">Earned</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
