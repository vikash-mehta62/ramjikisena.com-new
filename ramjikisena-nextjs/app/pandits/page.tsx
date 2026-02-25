'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

interface Pandit {
  _id: string;
  name: string;
  photo: string;
  experience: number;
  specialization: string[];
  location: {
    city: string;
    state: string;
  };
  averageRating: number;
  totalBookings: number;
  description: string;
  isVerified: boolean;
}

export default function PanditsPage() {
  const [pandits, setPandits] = useState<Pandit[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    city: '',
    state: '',
    specialization: ''
  });

  useEffect(() => {
    fetchPandits();
  }, [filters]);

  const fetchPandits = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.city) params.append('city', filters.city);
      if (filters.state) params.append('state', filters.state);
      if (filters.specialization) params.append('specialization', filters.specialization);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pandits?${params}`);
      const data = await response.json();

      if (data.success) {
        setPandits(data.pandits);
      }
    } catch (error) {
      console.error('Error fetching pandits:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="h-20 md:h-20"></div>
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin text-6xl mb-4">🕉️</div>
            <p className="text-orange-900 font-bold">Loading Pandits...</p>
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
          
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-black text-orange-900 mb-4">
              🕉️ Find Your Pandit Ji
            </h1>
            <p className="text-lg text-gray-600">
              Book experienced pandits for your pooja and ceremonies
            </p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-3xl p-6 mb-8 shadow-xl border-2 border-orange-100">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="text"
                placeholder="Search by name..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
              />
              <input
                type="text"
                placeholder="City"
                value={filters.city}
                onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
              />
              <input
                type="text"
                placeholder="State"
                value={filters.state}
                onChange={(e) => setFilters({ ...filters, state: e.target.value })}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Specialization"
                value={filters.specialization}
                onChange={(e) => setFilters({ ...filters, specialization: e.target.value })}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Pandits Grid */}
          {pandits.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center shadow-xl border-2 border-orange-100">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-black text-orange-900 mb-2">No Pandits Found</h3>
              <p className="text-gray-600">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pandits.map((pandit) => (
                <Link
                  key={pandit._id}
                  href={`/pandits/${pandit._id}`}
                  className="bg-white rounded-3xl overflow-hidden shadow-lg border-2 border-orange-100 hover:border-orange-300 hover:shadow-2xl transition-all group"
                >
                  {/* Photo */}
                  <div className="relative h-64 bg-gradient-to-br from-orange-200 to-red-200">
                    {pandit.photo ? (
                      <img
                        src={pandit.photo}
                        alt={pandit.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-8xl">
                        🕉️
                      </div>
                    )}
                    {pandit.isVerified && (
                      <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        ✓ Verified
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-black text-orange-900 mb-2 group-hover:text-orange-600 transition-colors">
                      {pandit.name}
                    </h3>

                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-yellow-500">⭐</span>
                      <span className="font-bold text-gray-700">
                        {pandit.averageRating.toFixed(1)}
                      </span>
                      <span className="text-gray-500 text-sm">
                        ({pandit.totalBookings} bookings)
                      </span>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <p className="flex items-center gap-2">
                        <span>📍</span>
                        {pandit.location.city}, {pandit.location.state}
                      </p>
                      <p className="flex items-center gap-2">
                        <span>📚</span>
                        {pandit.experience} years experience
                      </p>
                    </div>

                    {pandit.specialization.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {pandit.specialization.slice(0, 3).map((spec, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold"
                          >
                            {spec}
                          </span>
                        ))}
                        {pandit.specialization.length > 3 && (
                          <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold">
                            +{pandit.specialization.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    {pandit.description && (
                      <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                        {pandit.description}
                      </p>
                    )}

                    <button className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold rounded-xl hover:shadow-lg transition-all group-hover:-translate-y-0.5">
                      View Profile & Book →
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
