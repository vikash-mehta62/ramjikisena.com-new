'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';

interface Mandir {
  _id: string;
  name: string;
  description: string;
  location: {
    city: string;
    state: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  photos: string[];
  averageRating: number;
  timing?: {
    opening: string;
    closing: string;
  };
}

export default function PublicMandirListing() {
  const [mandirs, setMandirs] = useState<Mandir[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [stateFilter, setStateFilter] = useState('');

  useEffect(() => {
    fetchMandirs();
  }, [search, cityFilter, stateFilter]);

  const fetchMandirs = async () => {
    try {
      let url = '/api/mandirs?';
      if (search) url += `search=${search}&`;
      if (cityFilter) url += `city=${cityFilter}&`;
      if (stateFilter) url += `state=${stateFilter}&`;

      const response = await api.get(url);
      const data = await response.json();
      
      if (data.success) {
        setMandirs(data.mandirs);
      }
    } catch (error) {
      console.error('Error fetching mandirs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🛕</div>
          <p className="text-xl text-orange-700">Loading Mandirs...</p>
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg">
                <span className="text-3xl">🛕</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold divine-glow">Mandir Directory</h1>
                <p className="text-sm text-orange-100">Discover temples across India</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition"
              >
                🏠 Home
              </Link>
              <Link
                href="/dashboard"
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition"
              >
                📊 Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Search and Filters */}
          <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 mb-8 border-4 divine-border">
            <h2 className="text-2xl font-bold text-orange-700 mb-4 flex items-center gap-2">
              <span>🔍</span> Search Mandirs
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl">🛕</span>
                <input
                  type="text"
                  placeholder="Search mandirs..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-14 pr-4 py-3 border-2 border-orange-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <input
                type="text"
                placeholder="Filter by city..."
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="w-full px-4 py-3 border-2 border-orange-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="Filter by state..."
                value={stateFilter}
                onChange={(e) => setStateFilter(e.target.value)}
                className="w-full px-4 py-3 border-2 border-orange-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            {(search || cityFilter || stateFilter) && (
              <button
                onClick={() => {
                  setSearch('');
                  setCityFilter('');
                  setStateFilter('');
                }}
                className="mt-4 px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:shadow-lg transition font-semibold"
              >
                Clear Filters
              </button>
            )}
          </div>

          {/* Stats */}
          <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-2xl p-6 mb-8 border-2 border-orange-300 shadow-lg">
            <p className="text-orange-800 text-lg flex items-center gap-2">
              <span className="text-3xl">🛕</span>
              <span className="font-bold text-2xl">{mandirs.length}</span> 
              <span>mandir{mandirs.length !== 1 ? 's' : ''} found</span>
            </p>
          </div>

          {/* Mandir Grid */}
          {mandirs.length === 0 ? (
            <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-12 text-center border-4 divine-border">
              <span className="text-8xl mb-4 block">🛕</span>
              <h3 className="text-3xl font-bold text-gray-800 mb-3">No Mandirs Found</h3>
              <p className="text-gray-600 text-lg">Try adjusting your search criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mandirs.map((mandir) => (
                <div key={mandir._id} className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg hover:shadow-2xl transition-all border-2 border-orange-200 hover:border-orange-400 overflow-hidden group">
                  {/* Mandir Image */}
                  {mandir.photos && mandir.photos.length > 0 ? (
                    <div className="relative h-48 w-full overflow-hidden">
                      <img 
                        src={mandir.photos[0]} 
                        alt={mandir.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-2 right-2 bg-yellow-100 px-3 py-1 rounded-full flex items-center gap-1">
                        <span className="text-yellow-600">⭐</span>
                        <span className="font-bold text-yellow-700">
                          {mandir.averageRating > 0 ? mandir.averageRating.toFixed(1) : 'New'}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="relative h-48 w-full bg-gradient-to-br from-orange-200 to-red-200 flex items-center justify-center">
                      <span className="text-8xl">🛕</span>
                      <div className="absolute top-2 right-2 bg-yellow-100 px-3 py-1 rounded-full flex items-center gap-1">
                        <span className="text-yellow-600">⭐</span>
                        <span className="font-bold text-yellow-700">
                          {mandir.averageRating > 0 ? mandir.averageRating.toFixed(1) : 'New'}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {/* Mandir Details */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-orange-700 mb-2 group-hover:text-orange-600">
                      {mandir.name}
                    </h3>

                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {mandir.description || 'A sacred place of worship'}
                    </p>

                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex items-center gap-2 text-gray-700">
                        <span>📍</span>
                        <span>{mandir.location.city}, {mandir.location.state}</span>
                      </div>
                      {mandir.timing && (
                        <div className="flex items-center gap-2 text-gray-700">
                          <span>🕐</span>
                          <span>{mandir.timing.opening} - {mandir.timing.closing}</span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Link 
                        href={`/mandirs/${mandir._id}`}
                        className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold text-center hover:shadow-lg transition"
                      >
                        View Details
                      </Link>
                      {mandir.location.coordinates && (
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${mandir.location.coordinates.lat},${mandir.location.coordinates.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition flex items-center justify-center"
                          title="Get Directions"
                        >
                          🗺️
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
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
