'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/auth';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    city: '',
    contact: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate contact
    if (!/^[0-9]{10}$/.test(formData.contact)) {
      setError('Contact number should be 10 digits');
      setLoading(false);
      return;
    }

    try {
      const result = await authApi.register(formData);

      if (result.success) {
        router.push('/dashboard');
      } else {
        setError(result.message || 'Registration failed');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-block w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg mb-4">
            <span className="text-4xl">🚩</span>
          </div>
          <h1 className="text-3xl font-bold text-orange-700">Ramji Ki Sena</h1>
          <p className="text-gray-600 mt-2">नये सदस्यता के लिए रजिस्टर करें</p>
        </div>

        {/* Register Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-orange-100">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            रजिस्टर / Register
          </h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                यूजर लॉगिन आइडी / Username
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                पूरा नाम / Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                शहर / City
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                मोबाइल नंबर / Mobile No.
              </label>
              <input
                type="tel"
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none transition"
                pattern="[0-9]{10}"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                पासवर्ड / Password
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none transition"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'रजिस्टर / Register'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              पहले से सदस्य हैं?{' '}
              <Link href="/login" className="text-orange-600 hover:text-orange-700 font-semibold">
                लॉगिन करें / Login
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-orange-600 hover:text-orange-700">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
