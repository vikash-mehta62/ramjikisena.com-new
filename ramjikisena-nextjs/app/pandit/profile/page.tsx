'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { panditFetch, getPanditInfo } from '@/lib/panditAuth';

export default function PanditProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [panditData, setPanditData] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    experience: '',
    specialization: '',
    languages: '',
    qualification: '',
    description: '',
    about: '',
    city: '',
    state: '',
    address: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('panditToken');
    if (!token) {
      router.push('/pandit/login');
      return;
    }
    
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await panditFetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pandit-dashboard/profile`);
      const data = await response.json();
      
      if (data.success) {
        const pandit = data.pandit;
        setPanditData(pandit);
        setFormData({
          name: pandit.name || '',
          email: pandit.contact?.email || '',
          phone: pandit.contact?.phone || '',
          experience: pandit.experience?.toString() || '',
          specialization: pandit.specialization?.join(', ') || '',
          languages: pandit.languages?.join(', ') || '',
          qualification: pandit.qualification || '',
          description: pandit.description || '',
          about: pandit.about || '',
          city: pandit.location?.city || '',
          state: pandit.location?.state || '',
          address: pandit.location?.address || ''
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('photo', file);

      const token = localStorage.getItem('panditToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pandit-dashboard/upload-photo`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Profile photo updated successfully!');
        setPanditData(data.pandit);
        
        // Update localStorage
        const currentPandit = getPanditInfo();
        if (currentPandit) {
          currentPandit.photo = data.photo;
          localStorage.setItem('pandit', JSON.stringify(currentPandit));
        }
      } else {
        setMessage(data.message || 'Failed to upload photo');
      }
    } catch (error) {
      setMessage('Error uploading photo');
      console.error('Upload error:', error);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handlePhotosUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingPhotos(true);
    setMessage('');

    try {
      const formData = new FormData();
      Array.from(files).forEach(file => {
        formData.append('photos', file);
      });

      const token = localStorage.getItem('panditToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pandit-dashboard/upload-photos`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setMessage(data.message);
        setPanditData(data.pandit);
      } else {
        setMessage(data.message || 'Failed to upload photos');
      }
    } catch (error) {
      setMessage('Error uploading photos');
      console.error('Upload error:', error);
    } finally {
      setUploadingPhotos(false);
    }
  };

  const handleDeletePhoto = async (index: number) => {
    if (!confirm('Delete this photo?')) return;

    try {
      const response = await panditFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/pandit-dashboard/photos/${index}`,
        { method: 'DELETE' }
      );

      const data = await response.json();

      if (data.success) {
        setMessage('Photo deleted successfully');
        setPanditData(data.pandit);
      } else {
        setMessage(data.message || 'Failed to delete photo');
      }
    } catch (error) {
      setMessage('Error deleting photo');
      console.error('Delete error:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const updateData = {
        name: formData.name,
        contact: {
          email: formData.email,
          phone: formData.phone
        },
        experience: parseInt(formData.experience) || 0,
        specialization: formData.specialization.split(',').map(s => s.trim()).filter(s => s),
        languages: formData.languages.split(',').map(l => l.trim()).filter(l => l),
        qualification: formData.qualification,
        description: formData.description,
        about: formData.about,
        location: {
          city: formData.city,
          state: formData.state,
          address: formData.address
        }
      };

      const response = await panditFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/pandit-dashboard/profile`,
        {
          method: 'PUT',
          body: JSON.stringify(updateData)
        }
      );

      const data = await response.json();

      if (data.success) {
        setMessage('Profile updated successfully!');
        
        // Update localStorage
        const currentPandit = getPanditInfo();
        if (currentPandit) {
          const updatedPandit = { ...currentPandit, ...data.pandit };
          localStorage.setItem('pandit', JSON.stringify(updatedPandit));
        }
      } else {
        setMessage(data.message || 'Failed to update profile');
      }
    } catch (error) {
      setMessage('Something went wrong. Please try again.');
      console.error('Update error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-orange-900 mb-2">My Profile</h1>
            <p className="text-gray-600">Update your profile information</p>
          </div>
          <Link
            href="/pandit/dashboard"
            className="px-6 py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-all"
          >
            ← Dashboard
          </Link>
        </div>

        {/* Form */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-orange-100">
          {message && (
            <div className={`mb-6 p-4 rounded-xl text-sm font-bold ${
              message.includes('success') 
                ? 'bg-green-50 border border-green-200 text-green-700' 
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              {message}
            </div>
          )}

          {/* Profile Photo Section */}
          <div className="space-y-4 mb-8">
            <h3 className="text-lg font-bold text-orange-900 border-b-2 border-orange-200 pb-2">
              Profile Photo
            </h3>
            
            <div className="flex items-center gap-6">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-orange-200 to-red-200 flex items-center justify-center">
                {panditData?.photo ? (
                  <img src={panditData.photo} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-5xl">🕉️</span>
                )}
              </div>
              
              <div>
                <label className="px-6 py-3 bg-orange-500 text-white rounded-xl font-bold cursor-pointer hover:bg-orange-600 transition-all inline-block">
                  {uploadingPhoto ? 'Uploading...' : 'Upload Photo'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    disabled={uploadingPhoto}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-gray-500 mt-2">JPG, PNG or WEBP (Max 5MB)</p>
              </div>
            </div>
          </div>

          {/* Gallery Photos Section */}
          <div className="space-y-4 mb-8">
            <h3 className="text-lg font-bold text-orange-900 border-b-2 border-orange-200 pb-2">
              Gallery Photos
            </h3>
            
            <div>
              <label className="px-6 py-3 bg-blue-500 text-white rounded-xl font-bold cursor-pointer hover:bg-blue-600 transition-all inline-block">
                {uploadingPhotos ? 'Uploading...' : 'Upload Photos'}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotosUpload}
                  disabled={uploadingPhotos}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-gray-500 mt-2">Select multiple photos (Max 10 at a time)</p>
            </div>

            {panditData?.photos && panditData.photos.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {panditData.photos.map((photo: string, index: number) => (
                  <div key={index} className="relative group">
                    <img
                      src={photo}
                      alt={`Gallery ${index + 1}`}
                      className="w-full h-32 object-cover rounded-xl"
                    />
                    <button
                      onClick={() => handleDeletePhoto(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-orange-900 border-b-2 border-orange-200 pb-2">
                Basic Information
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Professional Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-orange-900 border-b-2 border-orange-200 pb-2">
                Professional Details
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Experience (Years)</label>
                  <input
                    type="number"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Qualification</label>
                  <input
                    type="text"
                    value={formData.qualification}
                    onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                    placeholder="e.g., Shastri, Acharya"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Specialization</label>
                <input
                  type="text"
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  placeholder="Comma separated (e.g., Vedic Rituals, Marriage, Griha Pravesh)"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Languages</label>
                <input
                  type="text"
                  value={formData.languages}
                  onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
                  placeholder="Comma separated (e.g., Hindi, Sanskrit, English)"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-orange-900 border-b-2 border-orange-200 pb-2">
                Location
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">State</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
                />
              </div>
            </div>

            {/* About */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-orange-900 border-b-2 border-orange-200 pb-2">
                About You
              </h3>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Short Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  placeholder="Brief description about your services"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Detailed About</label>
                <textarea
                  value={formData.about}
                  onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                  rows={5}
                  placeholder="Detailed information about your experience and expertise"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none resize-none"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white font-black rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
