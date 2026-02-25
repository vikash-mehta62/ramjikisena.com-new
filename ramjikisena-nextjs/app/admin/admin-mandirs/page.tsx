'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';

interface Mandir {
  _id: string;
  name: string;
  description: string;
  history?: string;
  location: {
    address?: string;
    city: string;
    state: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  timing?: {
    opening: string;
    closing: string;
    aarti?: string[];
  };
  contact?: {
    phone?: string;
    email?: string;
    website?: string;
  };
  photos?: string[];
  // NEW FIELDS
  deity?: {
    main?: string;
    others?: string[];
  };
  visitInfo?: {
    bestTimeToVisit?: string;
    dressCode?: string;
    entryFee?: string;
    photographyAllowed?: boolean;
  };
  facilities?: {
    parking?: boolean;
    prasad?: boolean;
    accommodation?: boolean;
    wheelchairAccessible?: boolean;
    restrooms?: boolean;
    drinkingWater?: boolean;
  };
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    twitter?: string;
  };
  averageRating: number;
  reviews: any[];
  createdAt: string;
}

export default function AdminMandirs() {
  const [mandirs, setMandirs] = useState<Mandir[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    history: '',
    'location.address': '',
    'location.city': '',
    'location.state': '',
    'location.coordinates.lat': '',
    'location.coordinates.lng': '',
    'timing.opening': '',
    'timing.closing': '',
    'timing.aarti': '',
    'contact.phone': '',
    'contact.email': '',
    'contact.website': '',
    photos: [] as string[],
    // NEW FIELDS
    'deity.main': '',
    'deity.others': '',
    'visitInfo.bestTimeToVisit': '',
    'visitInfo.dressCode': '',
    'visitInfo.entryFee': '',
    'visitInfo.photographyAllowed': true,
    'facilities.parking': false,
    'facilities.prasad': false,
    'facilities.accommodation': false,
    'facilities.wheelchairAccessible': false,
    'facilities.restrooms': false,
    'facilities.drinkingWater': false,
    'socialMedia.facebook': '',
    'socialMedia.instagram': '',
    'socialMedia.youtube': '',
    'socialMedia.twitter': ''
  });
  const [photoUrl, setPhotoUrl] = useState('');

  useEffect(() => {
    fetchMandirs();
  }, []);

  const fetchMandirs = async () => {
    try {
      const response = await api.get('/api/admin/mandirs');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Convert aarti times string to array
      const aartiTimes = formData['timing.aarti']
        .split(',')
        .map(time => time.trim())
        .filter(time => time.length > 0);

      // Convert deity others string to array
      const deityOthers = formData['deity.others']
        .split(',')
        .map(deity => deity.trim())
        .filter(deity => deity.length > 0);

      // Convert flat form data to nested object
      const mandirData: any = {
        name: formData.name,
        description: formData.description,
        history: formData.history,
        location: {
          address: formData['location.address'],
          city: formData['location.city'],
          state: formData['location.state'],
          coordinates: formData['location.coordinates.lat'] && formData['location.coordinates.lng'] ? {
            lat: parseFloat(formData['location.coordinates.lat']),
            lng: parseFloat(formData['location.coordinates.lng'])
          } : undefined
        },
        timing: {
          opening: formData['timing.opening'],
          closing: formData['timing.closing'],
          aarti: aartiTimes
        },
        contact: {
          phone: formData['contact.phone'],
          email: formData['contact.email'],
          website: formData['contact.website']
        },
        photos: formData.photos,
        // NEW FIELDS
        deity: {
          main: formData['deity.main'],
          others: deityOthers
        },
        visitInfo: {
          bestTimeToVisit: formData['visitInfo.bestTimeToVisit'],
          dressCode: formData['visitInfo.dressCode'],
          entryFee: formData['visitInfo.entryFee'],
          photographyAllowed: formData['visitInfo.photographyAllowed']
        },
        facilities: {
          parking: formData['facilities.parking'],
          prasad: formData['facilities.prasad'],
          accommodation: formData['facilities.accommodation'],
          wheelchairAccessible: formData['facilities.wheelchairAccessible'],
          restrooms: formData['facilities.restrooms'],
          drinkingWater: formData['facilities.drinkingWater']
        },
        socialMedia: {
          facebook: formData['socialMedia.facebook'],
          instagram: formData['socialMedia.instagram'],
          youtube: formData['socialMedia.youtube'],
          twitter: formData['socialMedia.twitter']
        }
      };

      const url = editingId ? `/api/admin/mandirs/${editingId}` : '/api/admin/mandirs';
      const method = editingId ? 'PUT' : 'POST';
      
      const response = await (editingId 
        ? api.put(url, mandirData)
        : api.post(url, mandirData));
      const data = await response.json();

      if (data.success) {
        alert(editingId ? '✅ Mandir updated successfully!' : '✅ Mandir created successfully!');
        resetForm();
        fetchMandirs();
      } else {
        alert(data.message || `Failed to ${editingId ? 'update' : 'create'} mandir`);
      }
    } catch (error) {
      alert(`Error ${editingId ? 'updating' : 'creating'} mandir`);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      name: '',
      description: '',
      history: '',
      'location.address': '',
      'location.city': '',
      'location.state': '',
      'location.coordinates.lat': '',
      'location.coordinates.lng': '',
      'timing.opening': '',
      'timing.closing': '',
      'timing.aarti': '',
      'contact.phone': '',
      'contact.email': '',
      'contact.website': '',
      photos: [],
      'deity.main': '',
      'deity.others': '',
      'visitInfo.bestTimeToVisit': '',
      'visitInfo.dressCode': '',
      'visitInfo.entryFee': '',
      'visitInfo.photographyAllowed': true,
      'facilities.parking': false,
      'facilities.prasad': false,
      'facilities.accommodation': false,
      'facilities.wheelchairAccessible': false,
      'facilities.restrooms': false,
      'facilities.drinkingWater': false,
      'socialMedia.facebook': '',
      'socialMedia.instagram': '',
      'socialMedia.youtube': '',
      'socialMedia.twitter': ''
    });
    setPhotoUrl('');
  };

  const handleEdit = (mandir: Mandir) => {
    setEditingId(mandir._id);
    setFormData({
      name: mandir.name,
      description: mandir.description || '',
      history: mandir.history || '',
      'location.address': mandir.location.address || '',
      'location.city': mandir.location.city,
      'location.state': mandir.location.state,
      'location.coordinates.lat': mandir.location.coordinates?.lat?.toString() || '',
      'location.coordinates.lng': mandir.location.coordinates?.lng?.toString() || '',
      'timing.opening': mandir.timing?.opening || '',
      'timing.closing': mandir.timing?.closing || '',
      'timing.aarti': mandir.timing?.aarti?.join(', ') || '',
      'contact.phone': mandir.contact?.phone || '',
      'contact.email': mandir.contact?.email || '',
      'contact.website': mandir.contact?.website || '',
      photos: mandir.photos || [],
      // NEW FIELDS
      'deity.main': mandir.deity?.main || '',
      'deity.others': mandir.deity?.others?.join(', ') || '',
      'visitInfo.bestTimeToVisit': mandir.visitInfo?.bestTimeToVisit || '',
      'visitInfo.dressCode': mandir.visitInfo?.dressCode || '',
      'visitInfo.entryFee': mandir.visitInfo?.entryFee || '',
      'visitInfo.photographyAllowed': mandir.visitInfo?.photographyAllowed ?? true,
      'facilities.parking': mandir.facilities?.parking || false,
      'facilities.prasad': mandir.facilities?.prasad || false,
      'facilities.accommodation': mandir.facilities?.accommodation || false,
      'facilities.wheelchairAccessible': mandir.facilities?.wheelchairAccessible || false,
      'facilities.restrooms': mandir.facilities?.restrooms || false,
      'facilities.drinkingWater': mandir.facilities?.drinkingWater || false,
      'socialMedia.facebook': mandir.socialMedia?.facebook || '',
      'socialMedia.instagram': mandir.socialMedia?.instagram || '',
      'socialMedia.youtube': mandir.socialMedia?.youtube || '',
      'socialMedia.twitter': mandir.socialMedia?.twitter || ''
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const uploadToCloudinary = async (file: File) => {
    try {
      setUploading(true);
      
      const formData = new FormData();
      formData.append('image', file);

      // Get token from localStorage
      const token = localStorage.getItem('token');
      const headers: any = {};
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // Don't set Content-Type header - let browser set it with boundary
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload/image?folder=mandirs`, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: formData
      });

      const data = await response.json();
      
      if (data.success && data.url) {
        return data.url;
      } else {
        throw new Error(data.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('❌ Failed to upload image. Please try again.');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    const url = await uploadToCloudinary(file);
    if (url) {
      setFormData({
        ...formData,
        photos: [...formData.photos, url]
      });
      alert('✅ Image uploaded successfully!');
    }
  };

  const addPhoto = () => {
    if (photoUrl.trim()) {
      setFormData({
        ...formData,
        photos: [...formData.photos, photoUrl.trim()]
      });
      setPhotoUrl('');
    }
  };

  const removePhoto = (index: number) => {
    setFormData({
      ...formData,
      photos: formData.photos.filter((_, i) => i !== index)
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this mandir?')) return;

    try {
      const response = await api.delete(`/api/admin/mandirs/${id}`);
      const data = await response.json();

      if (data.success) {
        alert('✅ Mandir deleted successfully!');
        fetchMandirs();
      }
    } catch (error) {
      alert('Error deleting mandir');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8 bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
              <span className="text-4xl">🛕</span>
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">Mandir Management</h1>
              <p className="text-orange-100">Manage all mandirs on the platform</p>
            </div>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowForm(!showForm);
            }}
            className="px-6 py-3 bg-white text-orange-600 rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all"
          >
            {showForm ? '❌ Cancel' : '➕ Add Mandir'}
          </button>
        </div>
      </div>

      {/* Add/Edit Mandir Form */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border-2 border-orange-200">
          <h2 className="text-2xl font-bold text-orange-700 mb-6">
            {editingId ? '✏️ Edit Mandir' : '➕ Add New Mandir'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="bg-orange-50 rounded-xl p-6 border-2 border-orange-200">
              <h3 className="text-xl font-bold text-orange-700 mb-4">📝 Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-semibold mb-2">Mandir Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="e.g., Ram Mandir Ayodhya"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-semibold mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    rows={3}
                    placeholder="Brief description of the mandir..."
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-semibold mb-2">History</label>
                  <textarea
                    value={formData.history}
                    onChange={(e) => setFormData({...formData, history: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    rows={4}
                    placeholder="Historical information about the mandir..."
                  />
                </div>
              </div>
            </div>

            {/* Location Information */}
            <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
              <h3 className="text-xl font-bold text-blue-700 mb-4">📍 Location Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-semibold mb-2">Full Address</label>
                  <input
                    type="text"
                    value={formData['location.address']}
                    onChange={(e) => setFormData({...formData, 'location.address': e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Complete address with street, area, etc."
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">City *</label>
                  <input
                    type="text"
                    required
                    value={formData['location.city']}
                    onChange={(e) => setFormData({...formData, 'location.city': e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Ayodhya"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">State *</label>
                  <input
                    type="text"
                    required
                    value={formData['location.state']}
                    onChange={(e) => setFormData({...formData, 'location.state': e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Uttar Pradesh"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Latitude (for Google Maps)</label>
                  <input
                    type="number"
                    step="any"
                    value={formData['location.coordinates.lat']}
                    onChange={(e) => setFormData({...formData, 'location.coordinates.lat': e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 26.7922"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Longitude (for Google Maps)</label>
                  <input
                    type="number"
                    step="any"
                    value={formData['location.coordinates.lng']}
                    onChange={(e) => setFormData({...formData, 'location.coordinates.lng': e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 82.1998"
                  />
                </div>
                <div className="md:col-span-2 bg-blue-100 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">
                    💡 <strong>Tip:</strong> To get coordinates, search your mandir on Google Maps, right-click on the location, and copy the coordinates.
                  </p>
                </div>
              </div>
            </div>

            {/* Timing Information */}
            <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200">
              <h3 className="text-xl font-bold text-green-700 mb-4">🕐 Timing Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Opening Time</label>
                  <input
                    type="time"
                    value={formData['timing.opening']}
                    onChange={(e) => setFormData({...formData, 'timing.opening': e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Closing Time</label>
                  <input
                    type="time"
                    value={formData['timing.closing']}
                    onChange={(e) => setFormData({...formData, 'timing.closing': e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-semibold mb-2">Aarti Times (comma separated)</label>
                  <input
                    type="text"
                    value={formData['timing.aarti']}
                    onChange={(e) => setFormData({...formData, 'timing.aarti': e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., 6:00 AM, 12:00 PM, 7:00 PM"
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-purple-50 rounded-xl p-6 border-2 border-purple-200">
              <h3 className="text-xl font-bold text-purple-700 mb-4">📞 Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={formData['contact.phone']}
                    onChange={(e) => setFormData({...formData, 'contact.phone': e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., +91 1234567890"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Email</label>
                  <input
                    type="email"
                    value={formData['contact.email']}
                    onChange={(e) => setFormData({...formData, 'contact.email': e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., info@mandir.com"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-semibold mb-2">Website</label>
                  <input
                    type="url"
                    value={formData['contact.website']}
                    onChange={(e) => setFormData({...formData, 'contact.website': e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., https://www.mandir.com"
                  />
                </div>
              </div>
            </div>

            {/* Photo URLs */}
            <div className="bg-pink-50 rounded-xl p-6 border-2 border-pink-200">
              <h3 className="text-xl font-bold text-pink-700 mb-4">📸 Mandir Photos</h3>
              <div className="space-y-4">
                {/* Cloudinary Upload */}
                <div className="bg-pink-100 p-4 rounded-lg border-2 border-pink-300">
                  <label className="block text-pink-800 font-semibold mb-2">
                    📤 Upload Image (Cloudinary)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    className="w-full px-4 py-3 border-2 border-pink-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white"
                  />
                  {uploading && (
                    <p className="text-sm text-pink-600 mt-2 flex items-center gap-2">
                      <span className="animate-spin">⏳</span> Uploading image...
                    </p>
                  )}
                  <p className="text-xs text-pink-700 mt-2">
                    Max size: 5MB | Supported: JPG, PNG, WEBP
                  </p>
                </div>

                {/* OR Divider */}
                <div className="flex items-center gap-4">
                  <div className="flex-1 border-t-2 border-gray-300"></div>
                  <span className="text-gray-500 font-semibold">OR</span>
                  <div className="flex-1 border-t-2 border-gray-300"></div>
                </div>

                {/* Manual URL Input */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    🔗 Add Image URL Manually
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={photoUrl}
                      onChange={(e) => setPhotoUrl(e.target.value)}
                      className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
                    />
                    <button
                      type="button"
                      onClick={addPhoto}
                      className="px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition"
                    >
                      ➕ Add
                    </button>
                  </div>
                </div>

                {/* Photo Gallery */}
                {formData.photos.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 font-semibold">Added Photos ({formData.photos.length}):</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {formData.photos.map((photo, index) => (
                        <div key={index} className="relative group">
                          <img 
                            src={photo} 
                            alt={`Photo ${index + 1}`} 
                            className="w-full h-32 object-cover rounded-lg border-2 border-pink-200"
                          />
                          <button
                            type="button"
                            onClick={() => removePhoto(index)}
                            className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition opacity-0 group-hover:opacity-100"
                          >
                            ❌
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-pink-100 p-4 rounded-lg">
                  <p className="text-sm text-pink-800">
                    💡 <strong>Tip:</strong> You can either upload images directly (recommended) or paste image URLs from external sources.
                  </p>
                </div>
              </div>
            </div>

            {/* Deity Information */}
            <div className="bg-yellow-50 rounded-xl p-6 border-2 border-yellow-200">
              <h3 className="text-xl font-bold text-yellow-700 mb-4">🕉️ Deity Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-semibold mb-2">Main Deity</label>
                  <input
                    type="text"
                    value={formData['deity.main']}
                    onChange={(e) => setFormData({...formData, 'deity.main': e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="e.g., Shri Ram, Shri Krishna, Shiv Ji"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-semibold mb-2">Other Deities (comma separated)</label>
                  <input
                    type="text"
                    value={formData['deity.others']}
                    onChange={(e) => setFormData({...formData, 'deity.others': e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="e.g., Sita Mata, Lakshman Ji, Hanuman Ji"
                  />
                </div>
              </div>
            </div>

            {/* Visit Information */}
            <div className="bg-indigo-50 rounded-xl p-6 border-2 border-indigo-200">
              <h3 className="text-xl font-bold text-indigo-700 mb-4">ℹ️ Visit Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Best Time to Visit</label>
                  <input
                    type="text"
                    value={formData['visitInfo.bestTimeToVisit']}
                    onChange={(e) => setFormData({...formData, 'visitInfo.bestTimeToVisit': e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="e.g., Morning 6-8 AM, Evening 5-7 PM"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Entry Fee</label>
                  <input
                    type="text"
                    value={formData['visitInfo.entryFee']}
                    onChange={(e) => setFormData({...formData, 'visitInfo.entryFee': e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="e.g., Free, ₹50, ₹100"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Dress Code</label>
                  <input
                    type="text"
                    value={formData['visitInfo.dressCode']}
                    onChange={(e) => setFormData({...formData, 'visitInfo.dressCode': e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="e.g., Traditional attire preferred, Modest clothing"
                  />
                </div>
                <div className="flex items-center gap-3 p-4 bg-indigo-100 rounded-xl">
                  <input
                    type="checkbox"
                    id="photographyAllowed"
                    checked={formData['visitInfo.photographyAllowed']}
                    onChange={(e) => setFormData({...formData, 'visitInfo.photographyAllowed': e.target.checked})}
                    className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                  />
                  <label htmlFor="photographyAllowed" className="text-gray-700 font-semibold cursor-pointer">
                    📸 Photography Allowed
                  </label>
                </div>
              </div>
            </div>

            {/* Facilities */}
            <div className="bg-teal-50 rounded-xl p-6 border-2 border-teal-200">
              <h3 className="text-xl font-bold text-teal-700 mb-4">🏢 Facilities Available</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-4 bg-white rounded-xl border-2 border-teal-100">
                  <input
                    type="checkbox"
                    id="parking"
                    checked={formData['facilities.parking']}
                    onChange={(e) => setFormData({...formData, 'facilities.parking': e.target.checked})}
                    className="w-5 h-5 text-teal-600 rounded focus:ring-2 focus:ring-teal-500"
                  />
                  <label htmlFor="parking" className="text-gray-700 font-semibold cursor-pointer">
                    🅿️ Parking
                  </label>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white rounded-xl border-2 border-teal-100">
                  <input
                    type="checkbox"
                    id="prasad"
                    checked={formData['facilities.prasad']}
                    onChange={(e) => setFormData({...formData, 'facilities.prasad': e.target.checked})}
                    className="w-5 h-5 text-teal-600 rounded focus:ring-2 focus:ring-teal-500"
                  />
                  <label htmlFor="prasad" className="text-gray-700 font-semibold cursor-pointer">
                    🍬 Prasad
                  </label>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white rounded-xl border-2 border-teal-100">
                  <input
                    type="checkbox"
                    id="accommodation"
                    checked={formData['facilities.accommodation']}
                    onChange={(e) => setFormData({...formData, 'facilities.accommodation': e.target.checked})}
                    className="w-5 h-5 text-teal-600 rounded focus:ring-2 focus:ring-teal-500"
                  />
                  <label htmlFor="accommodation" className="text-gray-700 font-semibold cursor-pointer">
                    🏨 Accommodation
                  </label>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white rounded-xl border-2 border-teal-100">
                  <input
                    type="checkbox"
                    id="wheelchair"
                    checked={formData['facilities.wheelchairAccessible']}
                    onChange={(e) => setFormData({...formData, 'facilities.wheelchairAccessible': e.target.checked})}
                    className="w-5 h-5 text-teal-600 rounded focus:ring-2 focus:ring-teal-500"
                  />
                  <label htmlFor="wheelchair" className="text-gray-700 font-semibold cursor-pointer">
                    ♿ Wheelchair Access
                  </label>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white rounded-xl border-2 border-teal-100">
                  <input
                    type="checkbox"
                    id="restrooms"
                    checked={formData['facilities.restrooms']}
                    onChange={(e) => setFormData({...formData, 'facilities.restrooms': e.target.checked})}
                    className="w-5 h-5 text-teal-600 rounded focus:ring-2 focus:ring-teal-500"
                  />
                  <label htmlFor="restrooms" className="text-gray-700 font-semibold cursor-pointer">
                    🚻 Restrooms
                  </label>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white rounded-xl border-2 border-teal-100">
                  <input
                    type="checkbox"
                    id="drinkingWater"
                    checked={formData['facilities.drinkingWater']}
                    onChange={(e) => setFormData({...formData, 'facilities.drinkingWater': e.target.checked})}
                    className="w-5 h-5 text-teal-600 rounded focus:ring-2 focus:ring-teal-500"
                  />
                  <label htmlFor="drinkingWater" className="text-gray-700 font-semibold cursor-pointer">
                    💧 Drinking Water
                  </label>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-cyan-50 rounded-xl p-6 border-2 border-cyan-200">
              <h3 className="text-xl font-bold text-cyan-700 mb-4">📱 Social Media Links</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Facebook</label>
                  <input
                    type="url"
                    value={formData['socialMedia.facebook']}
                    onChange={(e) => setFormData({...formData, 'socialMedia.facebook': e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="https://facebook.com/mandir"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Instagram</label>
                  <input
                    type="url"
                    value={formData['socialMedia.instagram']}
                    onChange={(e) => setFormData({...formData, 'socialMedia.instagram': e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="https://instagram.com/mandir"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">YouTube</label>
                  <input
                    type="url"
                    value={formData['socialMedia.youtube']}
                    onChange={(e) => setFormData({...formData, 'socialMedia.youtube': e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="https://youtube.com/@mandir"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Twitter</label>
                  <input
                    type="url"
                    value={formData['socialMedia.twitter']}
                    onChange={(e) => setFormData({...formData, 'socialMedia.twitter': e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="https://twitter.com/mandir"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={uploading}
              className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? '⏳ Uploading...' : (editingId ? '✅ Update Mandir' : '✅ Create Mandir')}
            </button>
          </form>
        </div>
      )}

      {/* Stats */}
      <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-2xl p-6 mb-8 border-2 border-orange-300">
        <p className="text-orange-800 text-lg">
          <span className="font-bold text-2xl">{mandirs.length}</span> mandir{mandirs.length !== 1 ? 's' : ''} in database
        </p>
      </div>

      {/* Mandirs List */}
      {mandirs.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center border-2 border-orange-200">
          <span className="text-8xl mb-4 block">🛕</span>
          <h3 className="text-3xl font-bold text-gray-800 mb-3">No Mandirs Yet</h3>
          <p className="text-gray-600 text-lg">Click "Add Mandir" to create your first mandir.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {mandirs.map((mandir) => (
            <div key={mandir._id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all border-2 border-orange-100">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-bold text-orange-700">{mandir.name}</h3>
                    <div className="flex items-center gap-1 bg-yellow-100 px-3 py-1 rounded-full">
                      <span className="text-yellow-600">⭐</span>
                      <span className="font-bold text-yellow-700">
                        {mandir.averageRating > 0 ? mandir.averageRating.toFixed(1) : 'New'}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-3">{mandir.description || 'No description'}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>📍 {mandir.location.city}, {mandir.location.state}</span>
                    <span>💬 {mandir.reviews.length} reviews</span>
                    <span>📅 {new Date(mandir.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex gap-3 ml-4">
                  <Link
                    href={`/mandirs/${mandir._id}`}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all text-sm font-semibold"
                  >
                    👁️ View
                  </Link>
                  <button
                    onClick={() => handleEdit(mandir)}
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all text-sm font-semibold"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(mandir._id)}
                    className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all text-sm font-semibold"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
