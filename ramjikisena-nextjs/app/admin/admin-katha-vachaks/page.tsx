'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';

interface LiveKatha {
  _id?: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  startDate: string;
  endDate: string;
  liveLink: string;
  kathaType: string;
  isActive: boolean;
}

interface KathaVachak {
  _id: string;
  name: string;
  photo: string;
  photos?: string[];
  experience: number;
  specialization: string;
  description: string;
  contact: {
    phone?: string;
    email?: string;
    whatsapp?: string;
  };
  liveKathas: LiveKatha[];
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

export default function AdminKathaVachaks() {
  const [kathaVachaks, setKathaVachaks] = useState<KathaVachak[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    photo: '',
    photos: [] as string[],
    experience: 0,
    specialization: '',
    description: '',
    'contact.phone': '',
    'contact.email': '',
    'contact.whatsapp': '',
    'socialMedia.facebook': '',
    'socialMedia.instagram': '',
    'socialMedia.youtube': '',
    'socialMedia.twitter': ''
  });
  const [liveKathas, setLiveKathas] = useState<LiveKatha[]>([]);
  const [photoUrl, setPhotoUrl] = useState('');

  useEffect(() => {
    fetchKathaVachaks();
  }, []);

  const fetchKathaVachaks = async () => {
    try {
      const response = await api.get('/api/admin/katha-vachaks');
      const data = await response.json();
      if (data.success) setKathaVachaks(data.kathaVachaks);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const kathaVachakData: any = {
        name: formData.name,
        photo: formData.photo,
        photos: formData.photos,
        experience: formData.experience,
        specialization: formData.specialization,
        description: formData.description,
        contact: {
          phone: formData['contact.phone'],
          email: formData['contact.email'],
          whatsapp: formData['contact.whatsapp']
        },
        liveKathas: liveKathas,
        socialMedia: {
          facebook: formData['socialMedia.facebook'],
          instagram: formData['socialMedia.instagram'],
          youtube: formData['socialMedia.youtube'],
          twitter: formData['socialMedia.twitter']
        }
      };

      const url = editingId ? `/api/admin/katha-vachaks/${editingId}` : '/api/admin/katha-vachaks';
      const method = editingId ? 'PUT' : 'POST';
      const response = await (editingId ? api.put(url, kathaVachakData) : api.post(url, kathaVachakData));
      const data = await response.json();

      if (data.success) {
        alert(editingId ? '✅ Updated!' : '✅ Created!');
        resetForm();
        fetchKathaVachaks();
      }
    } catch (error) {
      alert('Error saving Katha Vachak');
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      name: '',
      photo: '',
      photos: [],
      experience: 0,
      specialization: '',
      description: '',
      'contact.phone': '',
      'contact.email': '',
      'contact.whatsapp': '',
      'socialMedia.facebook': '',
      'socialMedia.instagram': '',
      'socialMedia.youtube': '',
      'socialMedia.twitter': ''
    });
    setLiveKathas([]);
    setPhotoUrl('');
  };

  const handleEdit = (kv: KathaVachak) => {
    setEditingId(kv._id);
    
    // Migrate old photo to photos array if photos is empty
    let photosArray = kv.photos || [];
    if (photosArray.length === 0 && kv.photo) {
      photosArray = [kv.photo];
    }
    
    // Convert live kathas dates to YYYY-MM-DD format for date inputs
    const formattedLiveKathas = (kv.liveKathas || []).map(katha => ({
      ...katha,
      startDate: katha.startDate ? new Date(katha.startDate).toISOString().split('T')[0] : '',
      endDate: katha.endDate ? new Date(katha.endDate).toISOString().split('T')[0] : ''
    }));
    
    setFormData({
      name: kv.name,
      photo: kv.photo || '',
      photos: photosArray,
      experience: kv.experience,
      specialization: kv.specialization || '',
      description: kv.description || '',
      'contact.phone': kv.contact?.phone || '',
      'contact.email': kv.contact?.email || '',
      'contact.whatsapp': kv.contact?.whatsapp || '',
      'socialMedia.facebook': kv.socialMedia?.facebook || '',
      'socialMedia.instagram': kv.socialMedia?.instagram || '',
      'socialMedia.youtube': kv.socialMedia?.youtube || '',
      'socialMedia.twitter': kv.socialMedia?.twitter || ''
    });
    setLiveKathas(formattedLiveKathas);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const uploadToCloudinary = async (file: File) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('image', file);
      const token = localStorage.getItem('token');
      const headers: any = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload/image?folder=katha-vachaks`, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: formData
      });

      const data = await response.json();
      if (data.success && data.url) return data.url;
      throw new Error(data.message || 'Upload failed');
    } catch (error) {
      alert('❌ Upload failed');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }
    const url = await uploadToCloudinary(file);
    if (url) {
      setFormData({ ...formData, photos: [...formData.photos, url] });
      alert('✅ Image uploaded!');
    }
  };

  const addPhotoUrl = () => {
    if (photoUrl.trim()) {
      setFormData({ ...formData, photos: [...formData.photos, photoUrl.trim()] });
      setPhotoUrl('');
    }
  };

  const removePhoto = (index: number) => {
    setFormData({ ...formData, photos: formData.photos.filter((_, i) => i !== index) });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      const response = await api.delete(`/api/admin/katha-vachaks/${id}`);
      const data = await response.json();
      if (data.success) {
        alert('✅ Deleted!');
        fetchKathaVachaks();
      }
    } catch (error) {
      alert('Error deleting');
    }
  };

  const addLiveKatha = () => {
    setLiveKathas([...liveKathas, {
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      country: 'India',
      pincode: '',
      startDate: '',
      endDate: '',
      liveLink: '',
      kathaType: '',
      isActive: true
    }]);
  };

  const removeLiveKatha = (index: number) => {
    setLiveKathas(liveKathas.filter((_, i) => i !== index));
  };

  const updateLiveKatha = (index: number, field: string, value: any) => {
    const updated = [...liveKathas];
    (updated[index] as any)[field] = value;
    setLiveKathas(updated);
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div className="mb-8 bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
              <span className="text-4xl">📿</span>
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">Katha Vachak Management</h1>
              <p className="text-orange-100">Manage all Katha Vachaks</p>
            </div>
          </div>
          <button
            onClick={() => { resetForm(); setShowForm(!showForm); }}
            className="px-6 py-3 bg-white text-orange-600 rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all"
          >
            {showForm ? '❌ Cancel' : '➕ Add Katha Vachak'}
          </button>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border-2 border-orange-200">
          <h2 className="text-2xl font-bold text-orange-700 mb-6">
            {editingId ? '✏️ Edit Katha Vachak' : '➕ Add New Katha Vachak'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="bg-orange-50 rounded-xl p-6 border-2 border-orange-200">
              <h3 className="text-xl font-bold text-orange-700 mb-4">📝 Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-semibold mb-2">Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500"
                    placeholder="e.g., Pandit Ramesh Sharma"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Experience (Years) *</label>
                  <input
                    type="number"
                    required
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500"
                    placeholder="e.g., 15"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Specialization</label>
                  <input
                    type="text"
                    value={formData.specialization}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500"
                    placeholder="e.g., Ramayan, Bhagwat"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-semibold mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500"
                    rows={4}
                    placeholder="Brief description..."
                  />
                </div>
              </div>
            </div>

            {/* Photo Upload */}
            <div className="bg-pink-50 rounded-xl p-6 border-2 border-pink-200">
              <h3 className="text-xl font-bold text-pink-700 mb-4">📸 Photos</h3>
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
                      placeholder="Enter image URL"
                    />
                    <button
                      type="button"
                      onClick={addPhotoUrl}
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
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-purple-50 rounded-xl p-6 border-2 border-purple-200">
              <h3 className="text-xl font-bold text-purple-700 mb-4">📞 Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Phone</label>
                  <input
                    type="tel"
                    value={formData['contact.phone']}
                    onChange={(e) => setFormData({ ...formData, 'contact.phone': e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                    placeholder="+91 1234567890"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">WhatsApp</label>
                  <input
                    type="tel"
                    value={formData['contact.whatsapp']}
                    onChange={(e) => setFormData({ ...formData, 'contact.whatsapp': e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                    placeholder="+91 1234567890"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-semibold mb-2">Email</label>
                  <input
                    type="email"
                    value={formData['contact.email']}
                    onChange={(e) => setFormData({ ...formData, 'contact.email': e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                    placeholder="email@example.com"
                  />
                </div>
              </div>
            </div>

            {/* Live Kathas */}
            <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-green-700">📅 Live Katha Events</h3>
                <button
                  type="button"
                  onClick={addLiveKatha}
                  className="px-4 py-2 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700"
                >
                  ➕ Add Event
                </button>
              </div>
              {liveKathas.length === 0 && (
                <p className="text-gray-500 text-center py-4">No events added yet</p>
              )}
              {liveKathas.map((katha, index) => (
                <div key={index} className="bg-white rounded-xl p-6 mb-4 border-2 border-green-100">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-bold text-gray-800">Event #{index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeLiveKatha(index)}
                      className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600"
                    >
                      🗑️ Remove
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-gray-700 font-semibold mb-2">Katha Type</label>
                      <input
                        type="text"
                        value={katha.kathaType}
                        onChange={(e) => updateLiveKatha(index, 'kathaType', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl"
                        placeholder="e.g., Ramayan Katha, Bhagwat Katha"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Address Line 1</label>
                      <input
                        type="text"
                        value={katha.addressLine1}
                        onChange={(e) => updateLiveKatha(index, 'addressLine1', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl"
                        placeholder="Street address"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Address Line 2</label>
                      <input
                        type="text"
                        value={katha.addressLine2}
                        onChange={(e) => updateLiveKatha(index, 'addressLine2', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl"
                        placeholder="Area, landmark"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">City</label>
                      <input
                        type="text"
                        value={katha.city}
                        onChange={(e) => updateLiveKatha(index, 'city', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl"
                        placeholder="City"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">State</label>
                      <input
                        type="text"
                        value={katha.state}
                        onChange={(e) => updateLiveKatha(index, 'state', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl"
                        placeholder="State"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Pincode</label>
                      <input
                        type="text"
                        value={katha.pincode}
                        onChange={(e) => updateLiveKatha(index, 'pincode', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl"
                        placeholder="123456"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Start Date</label>
                      <input
                        type="date"
                        value={katha.startDate}
                        onChange={(e) => updateLiveKatha(index, 'startDate', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">End Date</label>
                      <input
                        type="date"
                        value={katha.endDate}
                        onChange={(e) => updateLiveKatha(index, 'endDate', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-gray-700 font-semibold mb-2">Live Stream Link (Optional)</label>
                      <input
                        type="url"
                        value={katha.liveLink}
                        onChange={(e) => updateLiveKatha(index, 'liveLink', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl"
                        placeholder="https://youtube.com/live/..."
                      />
                    </div>
                    <div className="md:col-span-2 flex items-center gap-3 p-4 bg-green-100 rounded-xl">
                      <input
                        type="checkbox"
                        checked={katha.isActive}
                        onChange={(e) => updateLiveKatha(index, 'isActive', e.target.checked)}
                        className="w-5 h-5 text-green-600 rounded"
                      />
                      <label className="text-gray-700 font-semibold">Event is Active</label>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Social Media */}
            <div className="bg-cyan-50 rounded-xl p-6 border-2 border-cyan-200">
              <h3 className="text-xl font-bold text-cyan-700 mb-4">📱 Social Media</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Facebook</label>
                  <input
                    type="url"
                    value={formData['socialMedia.facebook']}
                    onChange={(e) => setFormData({ ...formData, 'socialMedia.facebook': e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl"
                    placeholder="https://facebook.com/..."
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Instagram</label>
                  <input
                    type="url"
                    value={formData['socialMedia.instagram']}
                    onChange={(e) => setFormData({ ...formData, 'socialMedia.instagram': e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl"
                    placeholder="https://instagram.com/..."
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">YouTube</label>
                  <input
                    type="url"
                    value={formData['socialMedia.youtube']}
                    onChange={(e) => setFormData({ ...formData, 'socialMedia.youtube': e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl"
                    placeholder="https://youtube.com/@..."
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Twitter</label>
                  <input
                    type="url"
                    value={formData['socialMedia.twitter']}
                    onChange={(e) => setFormData({ ...formData, 'socialMedia.twitter': e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl"
                    placeholder="https://twitter.com/..."
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={uploading}
              className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50"
            >
              {uploading ? '⏳ Uploading...' : (editingId ? '✅ Update' : '✅ Create')}
            </button>
          </form>
        </div>
      )}

      {/* Stats */}
      <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-2xl p-6 mb-8 border-2 border-orange-300">
        <p className="text-orange-800 text-lg">
          <span className="font-bold text-2xl">{kathaVachaks.length}</span> Katha Vachak{kathaVachaks.length !== 1 ? 's' : ''} in database
        </p>
      </div>

      {/* List */}
      {kathaVachaks.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center border-2 border-orange-200">
          <span className="text-8xl mb-4 block">📿</span>
          <h3 className="text-3xl font-bold text-gray-800 mb-3">No Katha Vachaks Yet</h3>
          <p className="text-gray-600 text-lg">Click "Add Katha Vachak" to create your first entry.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {kathaVachaks.map((kv) => (
            <div key={kv._id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all border-2 border-orange-100">
              <div className="flex items-start justify-between">
                <div className="flex gap-4 flex-1">
                  {kv.photo && (
                    <img src={kv.photo} alt={kv.name} className="w-20 h-20 rounded-full object-cover border-2 border-orange-200" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-bold text-orange-700">{kv.name}</h3>
                      <div className="flex items-center gap-1 bg-yellow-100 px-3 py-1 rounded-full">
                        <span className="text-yellow-600">⭐</span>
                        <span className="font-bold text-yellow-700">
                          {kv.averageRating > 0 ? kv.averageRating.toFixed(1) : 'New'}
                        </span>
                      </div>
                    </div>
                    <p className="text-orange-600 font-semibold mb-2">{kv.specialization}</p>
                    <p className="text-gray-600 mb-3">{kv.description || 'No description'}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>🎯 {kv.experience} years exp</span>
                      <span>💬 {kv.reviews.length} reviews</span>
                      <span>📅 {kv.liveKathas.length} events</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 ml-4">
                  <Link
                    href={`/katha-vachaks/${kv._id}`}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all text-sm font-semibold"
                  >
                    👁️ View
                  </Link>
                  <button
                    onClick={() => handleEdit(kv)}
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all text-sm font-semibold"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(kv._id)}
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
