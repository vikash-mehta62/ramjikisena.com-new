'use client';

import { useEffect, useState, useMemo } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import { 
  Church, FileText, MapPin, Sparkles, Smartphone, Phone, Star, 
  Pencil, Trash2, Plus, X, Eye, Calendar, ExternalLink, Clock, 
  ShieldCheck, CheckCircle2, Car, Compass, Info, Globe, Mail, 
  Search, ShieldAlert, RefreshCw
} from 'lucide-react';
import ImageUploader from '@/components/ImageUploader';
import MandirImage from '@/components/MandirImage';
import AdminPagination from '@/components/AdminPagination';

interface Mandir {
  _id: string;
  name: string;
  description: string;
  history?: string;
  significance?: string;
  templeType?: string;
  architecture?: string;
  builtYear?: string;
  languages?: string[];
  videos?: string[];
  location: {
    address?: string;
    city: string;
    state: string;
    pincode?: string;
    coordinates?: { lat: number; lng: number };
  };
  timing?: {
    opening: string;
    closing: string;
    aarti?: Array<{ name: string; time: string } | string>;
    specialTimings?: string;
    specialDays?: Array<{ day: string; opening: string; closing: string; note: string }>;
  };
  contact?: { phone?: string; email?: string; website?: string };
  photos?: string[];
  deity?: { main?: string; others?: string[] };
  visitInfo?: {
    bestTimeToVisit?: string;
    dressCode?: string;
    entryFee?: string;
    photographyAllowed?: boolean;
    mobileAllowed?: boolean;
    shoeStand?: boolean;
    annualVisitors?: string;
    donationInfo?: string;
    trustName?: string;
    managedBy?: string;
  };
  facilities?: {
    parking?: boolean; prasad?: boolean; accommodation?: boolean;
    wheelchairAccessible?: boolean; restrooms?: boolean; drinkingWater?: boolean;
    cloakroom?: boolean; medicalAid?: boolean; foodStalls?: boolean;
  };
  socialMedia?: { facebook?: string; instagram?: string; youtube?: string; twitter?: string };
  averageRating: number;
  reviews: any[];
  createdAt: string;
  source?: string;
  sourceId?: string;
  verificationStatus?: 'verified' | 'unverified' | 'needs_review' | string;
  timingsVerified?: boolean;
  submittedBy?: { name?: string; email?: string };
}

export default function AdminMandirs() {
  const [mandirs, setMandirs] = useState<Mandir[]>([]);
  const [pendingMandirs, setPendingMandirs] = useState<Mandir[]>([]);
  const [activeTab, setActiveTab] = useState<'approved' | 'pending'>('approved');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [viewingMandir, setViewingMandir] = useState<Mandir | null>(null);
  const [previewPhotoIndex, setPreviewPhotoIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('all');
  const [mandirPage, setMandirPage] = useState(1);
  const [mandirLimit, setMandirLimit] = useState(10);
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
    'socialMedia.twitter': '',
    // NEW FIELDS
    'significance': '',
    'templeType': 'Other',
    'architecture': '',
    'builtYear': '',
    'languages': '',
    'videos': '',
    'location.pincode': '',
    'timing.specialTimings': '',
    'visitInfo.mobileAllowed': true,
    'visitInfo.shoeStand': true,
    'visitInfo.annualVisitors': '',
    'facilities.cloakroom': false,
    'facilities.medicalAid': false,
    'facilities.foodStalls': false,
  });
  const [photoUrl, setPhotoUrl] = useState('');

  useEffect(() => {
    fetchMandirs();
  }, []);

  const fetchMandirs = async () => {
    try {
      const [approvedRes, pendingRes] = await Promise.all([
        api.get('/api/admin/mandirs'),
        api.get('/api/admin/mandirs/pending'),
      ]);
      const approvedData = await approvedRes.json();
      const pendingData = await pendingRes.json();
      if (approvedData.success) setMandirs(approvedData.mandirs);
      if (pendingData.success) {
        setPendingMandirs(pendingData.mandirs);
        if (pendingData.mandirs.length === 0 && approvedData.mandirs?.length > 0) {
          setActiveTab('approved');
        }
      }
    } catch (error) {
      console.error('Error fetching mandirs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Distinct cities list for filter
  const citiesList = useMemo(() => {
    const set = new Set<string>();
    mandirs.forEach((m) => {
      if (m.location?.city) set.add(m.location.city);
    });
    return Array.from(set).sort();
  }, [mandirs]);

  // Filtered approved mandirs
  const filteredMandirs = useMemo(() => {
    return mandirs.filter((m) => {
      const matchesCity = cityFilter === 'all' || m.location?.city === cityFilter;
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch = !query || 
        m.name?.toLowerCase().includes(query) ||
        m.location?.city?.toLowerCase().includes(query) ||
        m.location?.state?.toLowerCase().includes(query) ||
        m.deity?.main?.toLowerCase().includes(query) ||
        m.description?.toLowerCase().includes(query);
      return matchesCity && matchesSearch;
    });
  }, [mandirs, cityFilter, searchQuery]);

  // Reset page when search, city or tab changes
  useEffect(() => {
    setMandirPage(1);
  }, [searchQuery, cityFilter, activeTab]);

  // Client-side paginated mandirs slice
  const paginatedMandirs = useMemo(() => {
    const start = (mandirPage - 1) * mandirLimit;
    return filteredMandirs.slice(start, start + mandirLimit);
  }, [filteredMandirs, mandirPage, mandirLimit]);

  const totalMandirPages = Math.max(1, Math.ceil(filteredMandirs.length / mandirLimit));

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
        significance: formData['significance'],
        templeType: formData['templeType'],
        architecture: formData['architecture'],
        builtYear: formData['builtYear'],
        languages: formData['languages'] ? formData['languages'].split(',').map((s: string) => s.trim()).filter(Boolean) : [],
        videos: formData['videos'] ? formData['videos'].split(',').map((s: string) => s.trim()).filter(Boolean) : [],
        location: {
          address: formData['location.address'],
          city: formData['location.city'],
          state: formData['location.state'],
          pincode: formData['location.pincode'],
          coordinates: formData['location.coordinates.lat'] && formData['location.coordinates.lng'] ? {
            lat: parseFloat(formData['location.coordinates.lat']),
            lng: parseFloat(formData['location.coordinates.lng'])
          } : undefined
        },
        timing: {
          opening: formData['timing.opening'],
          closing: formData['timing.closing'],
          aarti: aartiTimes,
          specialTimings: formData['timing.specialTimings'],
        },
        contact: {
          phone: formData['contact.phone'],
          email: formData['contact.email'],
          website: formData['contact.website']
        },
        photos: formData.photos,
        deity: {
          main: formData['deity.main'],
          others: deityOthers
        },
        visitInfo: {
          bestTimeToVisit: formData['visitInfo.bestTimeToVisit'],
          dressCode: formData['visitInfo.dressCode'],
          entryFee: formData['visitInfo.entryFee'],
          photographyAllowed: formData['visitInfo.photographyAllowed'],
          mobileAllowed: formData['visitInfo.mobileAllowed'],
          shoeStand: formData['visitInfo.shoeStand'],
          annualVisitors: formData['visitInfo.annualVisitors'],
        },
        facilities: {
          parking: formData['facilities.parking'],
          prasad: formData['facilities.prasad'],
          accommodation: formData['facilities.accommodation'],
          wheelchairAccessible: formData['facilities.wheelchairAccessible'],
          restrooms: formData['facilities.restrooms'],
          drinkingWater: formData['facilities.drinkingWater'],
          cloakroom: formData['facilities.cloakroom'],
          medicalAid: formData['facilities.medicalAid'],
          foodStalls: formData['facilities.foodStalls'],
        },
        socialMedia: {
          facebook: formData['socialMedia.facebook'],
          instagram: formData['socialMedia.instagram'],
          youtube: formData['socialMedia.youtube'],
          twitter: formData['socialMedia.twitter']
        },
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
      'socialMedia.twitter': '',
      'significance': '',
      'templeType': 'Other',
      'architecture': '',
      'builtYear': '',
      'languages': '',
      'videos': '',
      'location.pincode': '',
      'timing.specialTimings': '',
      'visitInfo.mobileAllowed': true,
      'visitInfo.shoeStand': true,
      'visitInfo.annualVisitors': '',
      'facilities.cloakroom': false,
      'facilities.medicalAid': false,
      'facilities.foodStalls': false,
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
      'timing.aarti': mandir.timing?.aarti 
        ? (Array.isArray(mandir.timing.aarti) 
            ? mandir.timing.aarti.map((a: any) => typeof a === 'object' ? `${a.name || ''}: ${a.time || ''}`.trim() : a).join(', ') 
            : String(mandir.timing.aarti))
        : '',
      'contact.phone': mandir.contact?.phone || '',
      'contact.email': mandir.contact?.email || '',
      'contact.website': mandir.contact?.website || '',
      photos: mandir.photos || [],
      // NEW FIELDS
      'deity.main': mandir.deity?.main || '',
      'deity.others': Array.isArray(mandir.deity?.others) ? mandir.deity.others.join(', ') : '',
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
      'socialMedia.twitter': mandir.socialMedia?.twitter || '',
      'significance': (mandir as any).significance || '',
      'templeType': (mandir as any).templeType || 'Other',
      'architecture': (mandir as any).architecture || '',
      'builtYear': (mandir as any).builtYear || '',
      'languages': (mandir as any).languages?.join(', ') || '',
      'videos': (mandir as any).videos?.join(', ') || '',
      'location.pincode': mandir.location?.pincode || '',
      'timing.specialTimings': mandir.timing?.specialTimings || '',
      'visitInfo.mobileAllowed': mandir.visitInfo?.mobileAllowed ?? true,
      'visitInfo.shoeStand': mandir.visitInfo?.shoeStand ?? true,
      'visitInfo.annualVisitors': mandir.visitInfo?.annualVisitors || '',
      'facilities.cloakroom': mandir.facilities?.cloakroom || false,
      'facilities.medicalAid': mandir.facilities?.medicalAid || false,
      'facilities.foodStalls': mandir.facilities?.foodStalls || false,
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

  const handleApprove = async (id: string) => {
    try {
      const res = await api.put(`/api/admin/mandirs/${id}/approve`, {});
      const data = await res.json();
      if (data.success) { alert('✅ Mandir approved!'); fetchMandirs(); }
    } catch { alert('Error approving mandir'); }
  };

  const handleReject = async (id: string) => {
    const reason = prompt('Rejection reason (optional):') || '';
    try {
      const res = await api.put(`/api/admin/mandirs/${id}/reject`, { reason });
      const data = await res.json();
      if (data.success) { alert('Mandir rejected.'); fetchMandirs(); }
    } catch { alert('Error rejecting mandir'); }
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
      {/* Premium Header Banner */}
      <div className="bg-slate-900 border border-white/10 rounded-[2rem] p-6 sm:p-8 text-white relative overflow-hidden shadow-2xl mb-6">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-lg shadow-orange-500/20 text-white font-bold flex-shrink-0">
              <Church className="w-7 h-7" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-white/10 text-orange-300 text-[11px] font-black uppercase tracking-wider mb-1">
                Sacred Temples & Pilgrimage
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">मंदिर प्रबंधन (Mandir Management)</h1>
              <p className="text-sm text-slate-300 mt-0.5">संपूर्ण भारत के पावन तीर्थ, मंदिर विवरण, दर्शन समय एवं सुविधाएं</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={fetchMandirs}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-bold transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              रिफ्रेश
            </button>
            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold rounded-xl text-xs shadow-lg shadow-orange-500/20 transition-all hover:scale-105 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> नया मंदिर जोड़ें (Add Mandir)
            </button>
          </div>
        </div>
      </div>

      {/* Global Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div
          onClick={() => setActiveTab('approved')}
          className={`cursor-pointer bg-white rounded-2xl p-5 border transition-all ${
            activeTab === 'approved' ? 'border-slate-900 shadow-md ring-2 ring-slate-900/10' : 'border-slate-100 shadow-sm hover:shadow-md'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">स्वीकृत मंदिर (Approved)</span>
            <div className="w-9 h-9 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900">{mandirs.length.toLocaleString()}</p>
          <span className="text-[11px] text-slate-400 font-medium">प्रकाशित एवं सक्रिय मंदिर</span>
        </div>

        <div
          onClick={() => setActiveTab('pending')}
          className={`cursor-pointer bg-white rounded-2xl p-5 border transition-all ${
            activeTab === 'pending' ? 'border-amber-500 shadow-md ring-2 ring-amber-500/10' : 'border-slate-100 shadow-sm hover:shadow-md'
          } ${pendingMandirs.length > 0 ? 'bg-amber-50/30' : ''}`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-amber-800">लंबित समीक्षा (Pending)</span>
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl sm:text-3xl font-black text-amber-600">{pendingMandirs.length.toLocaleString()}</p>
            {pendingMandirs.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-black animate-pulse">
                समीक्षा करें
              </span>
            )}
          </div>
          <span className="text-[11px] text-slate-400 font-medium">उपयोगकर्ता सबमिशन</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">सक्रिय शहर (Cities Covered)</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900">{citiesList.length.toLocaleString()}</p>
          <span className="text-[11px] text-slate-400 font-medium">विभिन्न नगर एवं तीर्थ क्षेत्र</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">सत्यापित मंदिर (Verified)</span>
            <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900">
            {mandirs.filter((m) => m.verificationStatus === 'verified').length.toLocaleString()}
          </p>
          <span className="text-[11px] text-slate-400 font-medium">प्रमाणित जानकारी युक्त</span>
        </div>
      </div>

      {/* Add / Edit Mandir Popup Modal */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) resetForm();
          }}
        >
          <div className="relative w-full max-w-5xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-orange-200 my-auto max-h-[96vh] sm:max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header Bar */}
            <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-red-600 text-white p-4 sm:p-6 flex items-center justify-between border-b border-orange-500/30 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-xl sm:text-2xl shadow-inner flex-shrink-0">
                  {editingId ? '✏️' : '🛕'}
                </div>
                <div>
                  <h2 className="text-lg sm:text-2xl font-black flex items-center gap-2">
                    {editingId ? 'Edit Mandir Details' : 'Add New Mandir'}
                  </h2>
                  <p className="text-orange-100 text-xs sm:text-sm line-clamp-1">
                    {editingId ? `Editing: ${formData.name || 'Mandir Details'}` : 'Fill in the structured fields below to add a temple'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={resetForm}
                className="p-2 sm:p-2.5 rounded-full bg-black/20 hover:bg-black/40 text-white transition-all hover:scale-110 flex-shrink-0"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Form Body */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto flex flex-col">
              <div className="p-5 sm:p-7 space-y-6 flex-1 bg-gray-50/70">
                {/* 1. Basic Information Grid */}
                <div className="bg-white rounded-2xl p-5 sm:p-6 border border-orange-200 shadow-xs space-y-4">
                  <h3 className="text-base font-bold text-orange-800 flex items-center gap-2 border-b border-orange-100 pb-3">
                    <FileText className="w-5 h-5 text-orange-600" />
                    <span>प्राथमिक विवरण (Basic Information)</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-8">
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        Mandir Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-50 focus:bg-white border-2 border-gray-200 focus:border-orange-500 rounded-xl text-sm transition-colors"
                        placeholder="e.g., Shri Ram Janmabhoomi Mandir"
                      />
                    </div>

                    <div className="md:col-span-4">
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        Temple Type
                      </label>
                      <select
                        value={formData['templeType']}
                        onChange={(e) => setFormData({ ...formData, templeType: e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-50 focus:bg-white border-2 border-gray-200 focus:border-orange-500 rounded-xl text-sm font-semibold transition-colors"
                      >
                        {['Other', 'Jyotirlinga', 'Shakti Peeth', 'Char Dham', 'Divya Desam', 'Ashtavinayak', 'Historic', 'Local', 'Teerth'].map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>

                    <div className="md:col-span-12">
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        Description (संक्षिप्त परिचय)
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-50 focus:bg-white border-2 border-gray-200 focus:border-orange-500 rounded-xl text-sm transition-colors"
                        rows={3}
                        placeholder="मंदिर का संक्षिप्त परिचय एवं मुख्य विशेषताएं..."
                      />
                    </div>

                    <div className="md:col-span-6">
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        History (इतिहास)
                      </label>
                      <textarea
                        value={formData.history}
                        onChange={(e) => setFormData({ ...formData, history: e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-50 focus:bg-white border-2 border-gray-200 focus:border-orange-500 rounded-xl text-sm transition-colors"
                        rows={3}
                        placeholder="मंदिर का ऐतिहासिक विवरण, निर्माण काल..."
                      />
                    </div>

                    <div className="md:col-span-6">
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        Significance / Why Famous (धार्मिक महत्व)
                      </label>
                      <textarea
                        value={formData['significance']}
                        onChange={(e) => setFormData({ ...formData, significance: e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-50 focus:bg-white border-2 border-gray-200 focus:border-orange-500 rounded-xl text-sm transition-colors"
                        rows={3}
                        placeholder="धार्मिक मान्यता, क्यों प्रसिद्ध है..."
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Location & Geographic Grid */}
                <div className="bg-white rounded-2xl p-5 sm:p-6 border border-blue-200 shadow-xs space-y-4">
                  <h3 className="text-base font-bold text-blue-800 flex items-center gap-2 border-b border-blue-100 pb-3">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <span>स्थान व मार्ग दर्शन (Location & Coordinates)</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-4">
                    <div className="md:col-span-6 sm:col-span-2">
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        Full Address (पूरा पता)
                      </label>
                      <input
                        type="text"
                        value={formData['location.address']}
                        onChange={(e) => setFormData({ ...formData, 'location.address': e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-50 focus:bg-white border-2 border-gray-200 focus:border-blue-500 rounded-xl text-sm transition-colors"
                        placeholder="गली, मार्ग, क्षेत्र या लैंडमार्क"
                      />
                    </div>

                    <div className="md:col-span-3 sm:col-span-1">
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        City (शहर) *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData['location.city']}
                        onChange={(e) => setFormData({ ...formData, 'location.city': e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-50 focus:bg-white border-2 border-gray-200 focus:border-blue-500 rounded-xl text-sm transition-colors"
                        placeholder="e.g., Bhopal, Indore, Ayodhya"
                      />
                    </div>

                    <div className="md:col-span-3 sm:col-span-1">
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        State (राज्य) *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData['location.state']}
                        onChange={(e) => setFormData({ ...formData, 'location.state': e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-50 focus:bg-white border-2 border-gray-200 focus:border-blue-500 rounded-xl text-sm transition-colors"
                        placeholder="e.g., Madhya Pradesh"
                      />
                    </div>

                    <div className="md:col-span-4 sm:col-span-1">
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        PIN Code
                      </label>
                      <input
                        type="text"
                        value={formData['location.pincode']}
                        onChange={(e) => setFormData({ ...formData, 'location.pincode': e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-50 focus:bg-white border-2 border-gray-200 focus:border-blue-500 rounded-xl text-sm transition-colors"
                        placeholder="e.g., 462001"
                      />
                    </div>

                    <div className="md:col-span-4 sm:col-span-1">
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        Latitude (Google Maps GPS)
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={formData['location.coordinates.lat']}
                        onChange={(e) => setFormData({ ...formData, 'location.coordinates.lat': e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-50 focus:bg-white border-2 border-gray-200 focus:border-blue-500 rounded-xl text-sm font-mono transition-colors"
                        placeholder="e.g., 23.2312"
                      />
                    </div>

                    <div className="md:col-span-4 sm:col-span-2">
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        Longitude (Google Maps GPS)
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={formData['location.coordinates.lng']}
                        onChange={(e) => setFormData({ ...formData, 'location.coordinates.lng': e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-50 focus:bg-white border-2 border-gray-200 focus:border-blue-500 rounded-xl text-sm font-mono transition-colors"
                        placeholder="e.g., 77.4082"
                      />
                    </div>

                    <div className="md:col-span-12 bg-blue-50/80 border border-blue-200/80 rounded-xl p-3 flex items-start gap-2.5 text-xs text-blue-800">
                      <Compass className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span>
                        <strong>GPS Coordinates Tip:</strong> Google Maps par Mandir search karke right-click karein aur Latitude & Longitude copy karke yahan paste karein. Isse pilgrims ko exact navigation milega.
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3. Timings & Aarti Grid */}
                <div className="bg-white rounded-2xl p-5 sm:p-6 border border-amber-200 shadow-xs space-y-4">
                  <h3 className="text-base font-bold text-amber-900 flex items-center gap-2 border-b border-amber-100 pb-3">
                    <Clock className="w-5 h-5 text-amber-600" />
                    <span>दर्शन एवं आरती समय (Timings & Aarti Schedule)</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-4">
                    <div className="md:col-span-3 sm:col-span-1">
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        Opening Time (खुलने का समय)
                      </label>
                      <input
                        type="text"
                        value={formData['timing.opening']}
                        onChange={(e) => setFormData({ ...formData, 'timing.opening': e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-50 focus:bg-white border-2 border-gray-200 focus:border-amber-500 rounded-xl text-sm transition-colors"
                        placeholder="e.g., 05:00 AM"
                      />
                    </div>

                    <div className="md:col-span-3 sm:col-span-1">
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        Closing Time (बंद होने का समय)
                      </label>
                      <input
                        type="text"
                        value={formData['timing.closing']}
                        onChange={(e) => setFormData({ ...formData, 'timing.closing': e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-50 focus:bg-white border-2 border-gray-200 focus:border-amber-500 rounded-xl text-sm transition-colors"
                        placeholder="e.g., 10:00 PM"
                      />
                    </div>

                    <div className="md:col-span-6 sm:col-span-2">
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        Special Timings Note (विशेष समय / दोपहर विश्राम)
                      </label>
                      <input
                        type="text"
                        value={formData['timing.specialTimings']}
                        onChange={(e) => setFormData({ ...formData, 'timing.specialTimings': e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-50 focus:bg-white border-2 border-gray-200 focus:border-amber-500 rounded-xl text-sm transition-colors"
                        placeholder="e.g., 12:30 PM से 04:00 PM तक पट बंद रहते हैं"
                      />
                    </div>

                    <div className="md:col-span-12">
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        Aarti Schedule (आरती समय - अल्पविराम / Comma separated)
                      </label>
                      <input
                        type="text"
                        value={formData['timing.aarti']}
                        onChange={(e) => setFormData({ ...formData, 'timing.aarti': e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-50 focus:bg-white border-2 border-gray-200 focus:border-amber-500 rounded-xl text-sm transition-colors"
                        placeholder="e.g., मंगला आरती: 05:30 AM, भोग आरती: 12:00 PM, संध्या आरती: 07:30 PM, शयन आरती: 09:30 PM"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Deity & Architecture Grid */}
                <div className="bg-white rounded-2xl p-5 sm:p-6 border border-yellow-200 shadow-xs space-y-4">
                  <h3 className="text-base font-bold text-yellow-900 flex items-center gap-2 border-b border-yellow-100 pb-3">
                    <Sparkles className="w-5 h-5 text-yellow-600" />
                    <span>देवी-देवता एवं वास्तुकला (Deities & Architecture)</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-4">
                    <div className="md:col-span-6 sm:col-span-1">
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        Main Deity (मुख्य देव)
                      </label>
                      <input
                        type="text"
                        value={formData['deity.main']}
                        onChange={(e) => setFormData({ ...formData, 'deity.main': e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-50 focus:bg-white border-2 border-gray-200 focus:border-yellow-500 rounded-xl text-sm transition-colors"
                        placeholder="e.g., भगवान श्री राम, महादेव शिव, संकटमोचन हनुमान"
                      />
                    </div>

                    <div className="md:col-span-6 sm:col-span-1">
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        Other Deities (अन्य देवी-देवता - Comma separated)
                      </label>
                      <input
                        type="text"
                        value={formData['deity.others']}
                        onChange={(e) => setFormData({ ...formData, 'deity.others': e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-50 focus:bg-white border-2 border-gray-200 focus:border-yellow-500 rounded-xl text-sm transition-colors"
                        placeholder="e.g., माता सीता, लक्ष्मण जी, गणेश जी, कार्तिकेय जी"
                      />
                    </div>

                    <div className="md:col-span-4 sm:col-span-1">
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        Architecture Style (स्थापत्य शैली)
                      </label>
                      <input
                        type="text"
                        value={formData['architecture']}
                        onChange={(e) => setFormData({ ...formData, architecture: e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-50 focus:bg-white border-2 border-gray-200 focus:border-yellow-500 rounded-xl text-sm transition-colors"
                        placeholder="e.g., नागर शैली (Nagara), Dravidian, भूमिज"
                      />
                    </div>

                    <div className="md:col-span-4 sm:col-span-1">
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        Built Year / Century (निर्माण काल)
                      </label>
                      <input
                        type="text"
                        value={formData['builtYear']}
                        onChange={(e) => setFormData({ ...formData, builtYear: e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-50 focus:bg-white border-2 border-gray-200 focus:border-yellow-500 rounded-xl text-sm transition-colors"
                        placeholder="e.g., 11वीं शताब्दी, राजा भोज कालीन, 1964"
                      />
                    </div>

                    <div className="md:col-span-4 sm:col-span-2">
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        Languages (बोली जाने वाली भाषाएं)
                      </label>
                      <input
                        type="text"
                        value={formData['languages']}
                        onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-50 focus:bg-white border-2 border-gray-200 focus:border-yellow-500 rounded-xl text-sm transition-colors"
                        placeholder="e.g., हिन्दी, संस्कृत, मालवी, बुंदेली"
                      />
                    </div>
                  </div>
                </div>

                {/* 5. Photos & Media Grid */}
                <div className="bg-white rounded-2xl p-5 sm:p-6 border border-pink-200 shadow-xs space-y-4">
                  <h3 className="text-base font-bold text-pink-900 flex items-center gap-2 border-b border-pink-100 pb-3">
                    <span className="text-xl">📸</span>
                    <span>मंदिर फोटोज़ एवं मीडिया (Temple Photos & Videos)</span>
                  </h3>

                  {/* Cloudinary Image Uploader */}
                  <div className="bg-pink-50/60 rounded-xl p-4 border border-pink-200">
                    <ImageUploader
                      label="📸 Cloudinary Upload (Multiple Photos Allowed)"
                      value={formData.photos}
                      onChange={(v) => setFormData({ ...formData, photos: v as string[] })}
                      multiple
                      folder="mandirs"
                    />
                  </div>

                  {/* Manual URL Input Bar */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      या Photo URL सीधे जोड़ें (Direct Image URL)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={photoUrl}
                        onChange={(e) => setPhotoUrl(e.target.value)}
                        placeholder="https://example.com/temple-photo.jpg"
                        className="flex-1 px-4 py-2.5 bg-gray-50 focus:bg-white border-2 border-gray-200 focus:border-pink-500 rounded-xl text-sm transition-colors"
                      />
                      <button
                        type="button"
                        onClick={addPhoto}
                        className="px-5 py-2.5 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-xl text-sm transition-all shadow-sm"
                      >
                        + Add URL
                      </button>
                    </div>
                  </div>

                  {/* Photos Preview Grid */}
                  {formData.photos.length > 0 && (
                    <div>
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">
                        Uploaded Photos ({formData.photos.length}):
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                        {formData.photos.map((url, idx) => (
                          <div key={idx} className="relative group rounded-xl overflow-hidden aspect-square border-2 border-pink-200 bg-gray-100 shadow-xs">
                            <img src={url} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => removePhoto(idx)}
                              className="absolute top-1 right-1 bg-red-600/90 hover:bg-red-700 text-white rounded-full p-1 shadow transition-all opacity-90 group-hover:opacity-100"
                              title="Remove Photo"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                            <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] font-bold px-1 rounded">
                              #{idx + 1}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Videos Embed Input */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      YouTube Video Embed URLs (Comma separated)
                    </label>
                    <input
                      type="text"
                      value={formData['videos']}
                      onChange={(e) => setFormData({ ...formData, videos: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 focus:bg-white border-2 border-gray-200 focus:border-pink-500 rounded-xl text-sm transition-colors"
                      placeholder="https://www.youtube.com/embed/..."
                    />
                  </div>
                </div>

                {/* 6. Visit Guidelines & Rules Grid */}
                <div className="bg-white rounded-2xl p-5 sm:p-6 border border-indigo-200 shadow-xs space-y-4">
                  <h3 className="text-base font-bold text-indigo-900 flex items-center gap-2 border-b border-indigo-100 pb-3">
                    <Info className="w-5 h-5 text-indigo-600" />
                    <span>दर्शन नियम एवं दिशानिर्देश (Visit Guidelines)</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-4">
                    <div className="md:col-span-4 sm:col-span-1">
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        Best Time to Visit (दर्शन का सर्वोत्तम समय)
                      </label>
                      <input
                        type="text"
                        value={formData['visitInfo.bestTimeToVisit']}
                        onChange={(e) => setFormData({ ...formData, 'visitInfo.bestTimeToVisit': e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-50 focus:bg-white border-2 border-gray-200 focus:border-indigo-500 rounded-xl text-sm transition-colors"
                        placeholder="e.g., अक्टूबर से मार्च, प्रातः 6-8 बजे"
                      />
                    </div>

                    <div className="md:col-span-4 sm:col-span-1">
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        Entry Fee (प्रवेश शुल्क)
                      </label>
                      <input
                        type="text"
                        value={formData['visitInfo.entryFee']}
                        onChange={(e) => setFormData({ ...formData, 'visitInfo.entryFee': e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-50 focus:bg-white border-2 border-gray-200 focus:border-indigo-500 rounded-xl text-sm transition-colors"
                        placeholder="e.g., निःशुल्क (Free) / वीआईपी पास: ₹100"
                      />
                    </div>

                    <div className="md:col-span-4 sm:col-span-2">
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        Dress Code (वेशभूषा नियम)
                      </label>
                      <input
                        type="text"
                        value={formData['visitInfo.dressCode']}
                        onChange={(e) => setFormData({ ...formData, 'visitInfo.dressCode': e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-50 focus:bg-white border-2 border-gray-200 focus:border-indigo-500 rounded-xl text-sm transition-colors"
                        placeholder="e.g., पारंपरिक वस्त्र, शालीन परिधान"
                      />
                    </div>

                    <div className="md:col-span-12">
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        Annual Visitors (वार्षिक श्रद्धालु संख्या)
                      </label>
                      <input
                        type="text"
                        value={formData['visitInfo.annualVisitors']}
                        onChange={(e) => setFormData({ ...formData, 'visitInfo.annualVisitors': e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-50 focus:bg-white border-2 border-gray-200 focus:border-indigo-500 rounded-xl text-sm transition-colors"
                        placeholder="e.g., 25 लाख+ श्रद्धालु प्रतिवर्ष"
                      />
                    </div>

                    {/* Checkbox Permission Cards Grid */}
                    <div className="md:col-span-12 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                      <label
                        htmlFor="photographyAllowed"
                        className={`p-3.5 rounded-xl border-2 cursor-pointer flex items-center gap-3 transition-all ${
                          formData['visitInfo.photographyAllowed']
                            ? 'bg-indigo-50/80 border-indigo-400 text-indigo-900 font-bold'
                            : 'bg-gray-50 border-gray-200 text-gray-500'
                        }`}
                      >
                        <input
                          type="checkbox"
                          id="photographyAllowed"
                          checked={formData['visitInfo.photographyAllowed']}
                          onChange={(e) => setFormData({ ...formData, 'visitInfo.photographyAllowed': e.target.checked })}
                          className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                        />
                        <span className="text-sm">📸 Photography Allowed</span>
                      </label>

                      <label
                        htmlFor="mobileAllowed"
                        className={`p-3.5 rounded-xl border-2 cursor-pointer flex items-center gap-3 transition-all ${
                          formData['visitInfo.mobileAllowed']
                            ? 'bg-indigo-50/80 border-indigo-400 text-indigo-900 font-bold'
                            : 'bg-gray-50 border-gray-200 text-gray-500'
                        }`}
                      >
                        <input
                          type="checkbox"
                          id="mobileAllowed"
                          checked={formData['visitInfo.mobileAllowed'] as boolean}
                          onChange={(e) => setFormData({ ...formData, 'visitInfo.mobileAllowed': e.target.checked })}
                          className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                        />
                        <span className="text-sm">📱 Mobile Allowed</span>
                      </label>

                      <label
                        htmlFor="shoeStand"
                        className={`p-3.5 rounded-xl border-2 cursor-pointer flex items-center gap-3 transition-all ${
                          formData['visitInfo.shoeStand']
                            ? 'bg-indigo-50/80 border-indigo-400 text-indigo-900 font-bold'
                            : 'bg-gray-50 border-gray-200 text-gray-500'
                        }`}
                      >
                        <input
                          type="checkbox"
                          id="shoeStand"
                          checked={formData['visitInfo.shoeStand'] as boolean}
                          onChange={(e) => setFormData({ ...formData, 'visitInfo.shoeStand': e.target.checked })}
                          className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                        />
                        <span className="text-sm">👞 Shoe Stand Available</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* 7. Facilities Toggle Grid */}
                <div className="bg-white rounded-2xl p-5 sm:p-6 border border-emerald-200 shadow-xs space-y-4">
                  <h3 className="text-base font-bold text-emerald-900 flex items-center gap-2 border-b border-emerald-100 pb-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>दर्शनार्थी सुविधाएं (Facilities Available - Click to Toggle)</span>
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-3">
                    {[
                      { id: 'facilities.parking', label: 'Parking (पार्किंग)', icon: '🅿️' },
                      { id: 'facilities.prasad', label: 'Prasad (प्रसाद वितरण)', icon: '🍬' },
                      { id: 'facilities.accommodation', label: 'Dharamshala / Stay', icon: '🏨' },
                      { id: 'facilities.wheelchairAccessible', label: 'Wheelchair Access', icon: '♿' },
                      { id: 'facilities.restrooms', label: 'Restrooms (शौचालय)', icon: '🚻' },
                      { id: 'facilities.drinkingWater', label: 'Drinking Water (पेयजल)', icon: '💧' },
                      { id: 'facilities.cloakroom', label: 'Cloakroom (सामान कक्ष)', icon: '🛅' },
                      { id: 'facilities.medicalAid', label: 'Medical Aid (प्राथमिक उपचार)', icon: '🏥' },
                      { id: 'facilities.foodStalls', label: 'Food Stalls / Canteen', icon: '🍲' },
                    ].map((item) => {
                      const isChecked = Boolean((formData as any)[item.id]);
                      return (
                        <label
                          key={item.id}
                          htmlFor={item.id}
                          className={`p-3.5 rounded-xl border-2 cursor-pointer flex items-center gap-3 transition-all select-none ${
                            isChecked
                              ? 'bg-emerald-50/90 border-emerald-400 text-emerald-900 font-bold shadow-xs'
                              : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'
                          }`}
                        >
                          <input
                            type="checkbox"
                            id={item.id}
                            checked={isChecked}
                            onChange={(e) => setFormData({ ...formData, [item.id]: e.target.checked })}
                            className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                          />
                          <span className="text-base">{item.icon}</span>
                          <span className="text-xs sm:text-sm">{item.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* 8. Contact & Social Media Grid */}
                <div className="bg-white rounded-2xl p-5 sm:p-6 border border-cyan-200 shadow-xs space-y-4">
                  <h3 className="text-base font-bold text-cyan-900 flex items-center gap-2 border-b border-cyan-100 pb-3">
                    <Phone className="w-5 h-5 text-cyan-600" />
                    <span>संपर्क व सोशल मीडिया (Contact & Social Links)</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-4">
                    <div className="md:col-span-4 sm:col-span-1">
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData['contact.phone']}
                        onChange={(e) => setFormData({ ...formData, 'contact.phone': e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-50 focus:bg-white border-2 border-gray-200 focus:border-cyan-500 rounded-xl text-sm transition-colors"
                        placeholder="e.g., +91 755 2441234"
                      />
                    </div>

                    <div className="md:col-span-4 sm:col-span-1">
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={formData['contact.email']}
                        onChange={(e) => setFormData({ ...formData, 'contact.email': e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-50 focus:bg-white border-2 border-gray-200 focus:border-cyan-500 rounded-xl text-sm transition-colors"
                        placeholder="e.g., trust@mandir.org"
                      />
                    </div>

                    <div className="md:col-span-4 sm:col-span-2">
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        Official Website
                      </label>
                      <input
                        type="url"
                        value={formData['contact.website']}
                        onChange={(e) => setFormData({ ...formData, 'contact.website': e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-50 focus:bg-white border-2 border-gray-200 focus:border-cyan-500 rounded-xl text-sm transition-colors"
                        placeholder="e.g., https://mandir.org"
                      />
                    </div>

                    <div className="md:col-span-3 sm:col-span-1">
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        Facebook
                      </label>
                      <input
                        type="url"
                        value={formData['socialMedia.facebook']}
                        onChange={(e) => setFormData({ ...formData, 'socialMedia.facebook': e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-50 focus:bg-white border-2 border-gray-200 focus:border-cyan-500 rounded-xl text-sm transition-colors"
                        placeholder="https://facebook.com/..."
                      />
                    </div>

                    <div className="md:col-span-3 sm:col-span-1">
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        Instagram
                      </label>
                      <input
                        type="url"
                        value={formData['socialMedia.instagram']}
                        onChange={(e) => setFormData({ ...formData, 'socialMedia.instagram': e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-50 focus:bg-white border-2 border-gray-200 focus:border-cyan-500 rounded-xl text-sm transition-colors"
                        placeholder="https://instagram.com/..."
                      />
                    </div>

                    <div className="md:col-span-3 sm:col-span-1">
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        YouTube
                      </label>
                      <input
                        type="url"
                        value={formData['socialMedia.youtube']}
                        onChange={(e) => setFormData({ ...formData, 'socialMedia.youtube': e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-50 focus:bg-white border-2 border-gray-200 focus:border-cyan-500 rounded-xl text-sm transition-colors"
                        placeholder="https://youtube.com/@..."
                      />
                    </div>

                    <div className="md:col-span-3 sm:col-span-1">
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        Twitter / X
                      </label>
                      <input
                        type="url"
                        value={formData['socialMedia.twitter']}
                        onChange={(e) => setFormData({ ...formData, 'socialMedia.twitter': e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-50 focus:bg-white border-2 border-gray-200 focus:border-cyan-500 rounded-xl text-sm transition-colors"
                        placeholder="https://x.com/..."
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Sticky Footer Bar */}
              <div className="bg-white border-t border-gray-200 p-3 sm:p-4 md:p-5 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3 flex-shrink-0">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-sm transition-all text-center"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={uploading}
                  className="px-8 py-3 bg-gradient-to-r from-orange-500 via-amber-600 to-red-600 text-white rounded-xl font-bold text-sm sm:text-base hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md inline-flex items-center justify-center gap-2 text-center"
                >
                  {uploading ? (
                    'Saving...'
                  ) : editingId ? (
                    <><Pencil className="w-4 h-4" /> Update Mandir</>
                  ) : (
                    <><Plus className="w-4 h-4" /> Create Mandir</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Search and Filters Bar */}
      <div className="bg-white rounded-2xl p-5 mb-8 shadow-md border-2 border-orange-100 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, deity, city or state..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-8 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-bold"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">सभी शहर (All Cities - {mandirs.length})</option>
            {citiesList.map((city) => (
              <option key={city} value={city}>
                {city} ({mandirs.filter((m) => m.location?.city === city).length})
              </option>
            ))}
          </select>

          <div className="text-xs sm:text-sm font-bold text-orange-800 bg-orange-100 px-3.5 py-2 rounded-xl whitespace-nowrap">
            {activeTab === 'approved' ? (
              <>Showing: <span className="font-extrabold text-orange-900">{filteredMandirs.length}</span> / {mandirs.length}</>
            ) : (
              <>Pending: <span className="font-extrabold text-orange-900">{pendingMandirs.length}</span></>
            )}
          </div>
        </div>
      </div>

      {/* Mandirs List */}
      {/* Pending Mandirs Tab */}
      {activeTab === 'pending' && (
        pendingMandirs.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center border-2 border-orange-200">
            <Church className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">कोई Pending Mandir नहीं</h3>
            <p className="text-gray-500">सभी submissions review हो चुकी हैं।</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {pendingMandirs.map((mandir: any) => (
              <div key={mandir._id} className="bg-white rounded-2xl shadow-lg p-5 sm:p-6 border-2 border-yellow-200 flex flex-col sm:flex-row gap-5 items-start">
                {/* Photo Thumbnail */}
                <div
                  onClick={() => { setViewingMandir(mandir); setPreviewPhotoIndex(0); }}
                  className="w-full sm:w-32 sm:h-32 h-44 rounded-xl overflow-hidden flex-shrink-0 shadow-md border border-yellow-300 relative group cursor-pointer bg-amber-900"
                >
                  <MandirImage
                    src={mandir.photos?.[0]}
                    alt={mandir.name}
                    templeName={mandir.name}
                    cityName={mandir.location?.city}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {mandir.photos && mandir.photos.length > 0 && (
                    <div className="absolute bottom-1.5 right-1.5 bg-black/70 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow">
                      📷 {mandir.photos.length}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-xs font-black bg-yellow-100 text-yellow-700 px-2.5 py-0.5 rounded-full">⏳ PENDING REVIEW</span>
                    {mandir.submittedBy && (
                      <span className="text-xs text-gray-500">by {mandir.submittedBy.name} ({mandir.submittedBy.email})</span>
                    )}
                  </div>
                  <h3
                    onClick={() => { setViewingMandir(mandir); setPreviewPhotoIndex(0); }}
                    className="text-xl font-bold text-orange-700 hover:text-orange-800 cursor-pointer hover:underline"
                  >
                    {mandir.name}
                  </h3>
                  <p className="text-sm text-gray-500">{mandir.location?.city}, {mandir.location?.state}</p>
                  {mandir.description && <p className="text-sm text-gray-600 mt-1 line-clamp-2">{mandir.description}</p>}
                  {mandir.deity?.main && <p className="text-xs text-orange-600 font-semibold mt-1">🛕 {mandir.deity.main}</p>}
                  <p className="text-xs text-gray-400 mt-1">{new Date(mandir.createdAt).toLocaleDateString('hi-IN')}</p>
                </div>

                <div className="flex flex-row sm:flex-col gap-2 flex-shrink-0 w-full sm:w-auto justify-end pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                  <button
                    onClick={() => { setViewingMandir(mandir); setPreviewPhotoIndex(0); }}
                    className="px-4 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-xl font-bold text-sm hover:bg-blue-100 transition-all inline-flex items-center justify-center gap-1.5 flex-1 sm:flex-none"
                  >
                    <Eye className="w-4 h-4" /> View
                  </button>
                  <button
                    onClick={() => handleApprove(mandir._id)}
                    className="px-4 py-2 bg-green-600 text-white rounded-xl font-bold text-sm hover:bg-green-700 transition-all inline-flex items-center justify-center gap-1.5 flex-1 sm:flex-none"
                  >
                    ✅ Approve
                  </button>
                  <button
                    onClick={() => handleReject(mandir._id)}
                    className="px-4 py-2 bg-red-100 text-red-600 rounded-xl font-bold text-sm hover:bg-red-200 transition-all inline-flex items-center justify-center gap-1.5 flex-1 sm:flex-none"
                  >
                    ❌ Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Approved Mandirs Tab */}
      {activeTab === 'approved' && (mandirs.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center border-2 border-orange-200">
          <Church className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <h3 className="text-3xl font-bold text-gray-800 mb-3">No Mandirs Yet</h3>
          <p className="text-gray-600 text-lg">Click "Add Mandir" to create your first mandir.</p>
        </div>
      ) : filteredMandirs.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center border-2 border-orange-200">
          <Search className="w-16 h-16 text-gray-300 mx-auto mb-3" />
          <h3 className="text-2xl font-bold text-gray-800 mb-2">No Matching Mandirs Found</h3>
          <p className="text-gray-500 mb-4">Try clearing your search query or city filter.</p>
          <button
            onClick={() => { setSearchQuery(''); setCityFilter('all'); }}
            className="px-5 py-2.5 bg-orange-600 text-white rounded-xl font-bold text-sm hover:bg-orange-700 transition-all cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5">
            {paginatedMandirs.map((mandir) => (
              <div
                key={mandir._id}
                className="bg-white rounded-2xl shadow-lg p-5 sm:p-6 hover:shadow-2xl transition-all border-2 border-orange-100 flex flex-col md:flex-row gap-5 items-start"
              >
                {/* Photo Thumbnail */}
                <div
                  onClick={() => { setViewingMandir(mandir); setPreviewPhotoIndex(0); }}
                  className="w-full md:w-40 md:h-40 sm:w-36 sm:h-36 h-48 rounded-2xl overflow-hidden flex-shrink-0 shadow-md border-2 border-orange-200 relative group cursor-pointer bg-gradient-to-br from-amber-900 to-orange-950"
                >
                  <MandirImage
                    src={mandir.photos?.[0]}
                    alt={mandir.name}
                    templeName={mandir.name}
                    cityName={mandir.location?.city}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />

                  {/* Photo Count or Sacred Indicator */}
                  {mandir.photos && mandir.photos.length > 0 ? (
                    <div className="absolute bottom-2 right-2 bg-black/75 backdrop-blur-xs text-white text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow">
                      📷 {mandir.photos.length}
                    </div>
                  ) : (
                    <div className="absolute bottom-2 right-2 bg-amber-950/80 backdrop-blur-xs text-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow border border-amber-500/30">
                      पवित्र स्थल
                    </div>
                  )}

                  {/* Verification Badge on thumbnail */}
                  {mandir.verificationStatus === 'verified' && (
                    <div className="absolute top-2 left-2 bg-emerald-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow backdrop-blur-xs">
                      ✓ Verified
                    </div>
                  )}
                </div>

                {/* Mandir Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2.5 mb-2">
                    <h3
                      onClick={() => { setViewingMandir(mandir); setPreviewPhotoIndex(0); }}
                      className="text-xl sm:text-2xl font-bold text-orange-700 hover:text-orange-900 cursor-pointer hover:underline transition-colors"
                    >
                      {mandir.name}
                    </h3>
                    <div className="flex items-center gap-1 bg-yellow-100 px-2.5 py-0.5 rounded-full text-xs font-bold text-yellow-800">
                      <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                      <span>{mandir.averageRating > 0 ? mandir.averageRating.toFixed(1) : 'New'}</span>
                    </div>
                    {mandir.templeType && (
                      <span className="bg-orange-100 text-orange-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                        {mandir.templeType}
                      </span>
                    )}
                  </div>

                  {mandir.deity?.main && (
                    <p className="text-xs sm:text-sm font-bold text-amber-800 mb-2 flex flex-wrap items-center gap-1.5">
                      <span>🛕 मुख्य देव: {mandir.deity.main}</span>
                      {mandir.deity.others && mandir.deity.others.length > 0 && (
                        <span className="text-gray-500 font-normal">
                          ({mandir.deity.others.slice(0, 3).join(', ')}{mandir.deity.others.length > 3 ? '...' : ''})
                        </span>
                      )}
                    </p>
                  )}

                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {mandir.description || 'No description provided'}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-gray-500">
                    <span className="flex items-center gap-1 text-gray-700 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-orange-600" /> {mandir.location.city}, {mandir.location.state}
                    </span>
                    {mandir.timing?.opening && (
                      <span className="flex items-center gap-1 text-gray-600">
                        <Clock className="w-3.5 h-3.5 text-amber-600" /> {mandir.timing.opening} - {mandir.timing.closing}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-gray-400" /> {mandir.reviews?.length || 0} reviews
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" /> {new Date(mandir.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex sm:flex-row md:flex-col lg:flex-row gap-2 flex-shrink-0 w-full md:w-auto justify-end pt-3 md:pt-0 border-t md:border-t-0 border-gray-100">
                  <button
                    onClick={() => { setViewingMandir(mandir); setPreviewPhotoIndex(0); }}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all text-sm font-semibold flex-1 sm:flex-none cursor-pointer"
                    title="View complete details in popup"
                  >
                    <Eye className="w-4 h-4" /> View
                  </button>
                  <button
                    onClick={() => handleEdit(mandir)}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all text-sm font-semibold flex-1 sm:flex-none cursor-pointer"
                  >
                    <Pencil className="w-4 h-4" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(mandir._id)}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all text-sm font-semibold flex-1 sm:flex-none cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          <AdminPagination
            page={mandirPage}
            totalPages={totalMandirPages}
            total={filteredMandirs.length}
            limit={mandirLimit}
            onPageChange={(p) => setMandirPage(p)}
            onLimitChange={(l) => {
              setMandirLimit(l);
              setMandirPage(1);
            }}
            limitOptions={[5, 10, 20, 50, 100]}
            itemName="मंदिर"
          />
        </>
      ))}

      {/* View Mandir Details Popup Modal */}
      {viewingMandir && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) setViewingMandir(null);
          }}
        >
          <div className="relative w-full max-w-4xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-orange-200 my-auto max-h-[96vh] sm:max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
            
            {/* Floating Close Button Top Right (Always visible, stays fixed while content scrolls) */}
            <button
              onClick={() => setViewingMandir(null)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30 p-2 sm:p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md border border-white/25 transition-all shadow-xl hover:scale-110"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Scrollable Container (Hero Photo Banner AND Content scroll together smoothly) */}
            <div className="overflow-y-auto flex-1 flex flex-col">
              {/* Modal Hero Banner & Gallery */}
              <div className="relative flex-shrink-0">
                <div className="relative h-48 sm:h-64 md:h-80 w-full bg-gradient-to-br from-amber-900 to-orange-950 overflow-hidden">
                  <MandirImage
                    src={viewingMandir.photos?.[previewPhotoIndex] || viewingMandir.photos?.[0]}
                    alt={viewingMandir.name}
                    templeName={viewingMandir.name}
                    cityName={viewingMandir.location?.city}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/30 pointer-events-none" />

                  {/* Floating Badges */}
                  <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex flex-wrap items-center gap-1.5 sm:gap-2 z-10 pr-12">
                    <span className="px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold text-white bg-black/60 backdrop-blur-md border border-white/20">
                      🛕 {viewingMandir.templeType || 'Mandir'}
                    </span>
                    {viewingMandir.verificationStatus === 'verified' ? (
                      <span className="px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold text-white bg-emerald-600/90 backdrop-blur-md flex items-center gap-1 shadow">
                        <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Verified
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold text-white bg-amber-600/90 backdrop-blur-md flex items-center gap-1 shadow">
                        <ShieldAlert className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Listed
                      </span>
                    )}
                    {viewingMandir.timing?.opening && (
                      <span className="px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold text-white bg-orange-600/80 backdrop-blur-md flex items-center gap-1 shadow">
                        <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> {viewingMandir.timing.opening} - {viewingMandir.timing.closing}
                      </span>
                    )}
                  </div>

                  {/* Title & Location Overlay */}
                  <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 z-10 text-white">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white drop-shadow-lg tracking-tight">
                        {viewingMandir.name}
                      </h2>
                      <div className="flex items-center gap-1 bg-yellow-400 text-yellow-950 font-bold px-2 py-0.5 rounded-full text-[11px] sm:text-xs shadow">
                        <Star className="w-3 h-3 fill-yellow-950" />
                        {viewingMandir.averageRating > 0 ? viewingMandir.averageRating.toFixed(1) : 'New'}
                      </div>
                    </div>
                    <p className="text-amber-200 text-xs sm:text-sm font-medium flex items-center gap-1.5 drop-shadow">
                      <MapPin className="w-3.5 h-3.5 text-amber-300 flex-shrink-0" />
                      <span>{viewingMandir.location?.city}, {viewingMandir.location?.state}</span>
                      {viewingMandir.location?.address && <span className="opacity-90 line-clamp-1">• {viewingMandir.location.address}</span>}
                    </p>
                  </div>
                </div>

                {/* Multi-Photo Thumbnails Ribbon */}
                {viewingMandir.photos && viewingMandir.photos.length > 1 && (
                  <div className="bg-amber-950 px-3 sm:px-4 py-2 flex items-center gap-2 overflow-x-auto border-t border-amber-800">
                    <span className="text-[10px] sm:text-[11px] font-bold text-amber-200 uppercase tracking-wider whitespace-nowrap">
                      Photos ({viewingMandir.photos.length}):
                    </span>
                    {viewingMandir.photos.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setPreviewPhotoIndex(idx)}
                        className={`w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                          previewPhotoIndex === idx ? 'border-amber-400 scale-105 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt={`${viewingMandir.name} ${idx + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Modal Body Content (Scrolls with the photo banner) */}
              <div className="p-4 sm:p-6 md:p-8 space-y-5 sm:space-y-6 flex-1 text-gray-800 bg-gray-50/50">
                {/* Deity & Timings Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Deity Card */}
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 shadow-xs">
                    <h4 className="text-xs font-black text-amber-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <span>🛕</span> मुख्य एवं अन्य देवी-देवता (Deities)
                    </h4>
                    <div className="space-y-1.5">
                      <p className="text-sm font-bold text-gray-800">
                        मुख्य देव: <span className="text-orange-700">{viewingMandir.deity?.main || 'भगवान श्री राम'}</span>
                      </p>
                      {viewingMandir.deity?.others && viewingMandir.deity.others.length > 0 && (
                        <div>
                          <span className="text-xs text-gray-500 font-semibold block mb-1">अन्य देव:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {viewingMandir.deity.others.map((d, i) => (
                              <span key={i} className="text-xs bg-white text-gray-700 font-semibold px-2 py-0.5 rounded-md border border-amber-200">
                                {d}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Timings & Aarti Card */}
                  <div className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-2xl p-4 shadow-xs">
                    <h4 className="text-xs font-black text-orange-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-orange-600" /> दर्शन एवं आरती समय (Timings)
                    </h4>
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-gray-800">
                        दर्शन: <span className="text-orange-700">{viewingMandir.timing?.opening || 'N/A'} - {viewingMandir.timing?.closing || 'N/A'}</span>
                      </p>
                      {viewingMandir.timing?.aarti && (
                        <p className="text-xs text-gray-600">
                          आरती: {Array.isArray(viewingMandir.timing.aarti)
                            ? viewingMandir.timing.aarti.map((a: any) => typeof a === 'object' ? `${a.name}: ${a.time}` : a).join(' | ')
                            : viewingMandir.timing.aarti}
                        </p>
                      )}
                      {viewingMandir.timing?.specialTimings && (
                        <p className="text-xs text-amber-800 italic">
                          विशेष: {viewingMandir.timing.specialTimings}
                        </p>
                      )}
                      <p className="text-[11px] font-semibold text-gray-500 pt-1">
                        {viewingMandir.timingsVerified ? '✅ Mandir Trust द्वारा सत्यापित' : 'ℹ️ सामान्य दर्शन समय'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                {viewingMandir.description && (
                  <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs">
                    <h4 className="text-xs font-black text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Info className="w-4 h-4 text-orange-600" /> परिचय एवं विवरण (Description)
                    </h4>
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                      {viewingMandir.description}
                    </p>
                  </div>
                )}

                {/* History & Significance */}
                {(viewingMandir.history || viewingMandir.significance) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {viewingMandir.history && (
                      <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs">
                        <h4 className="text-xs font-black text-amber-800 uppercase tracking-wider mb-2">
                          📜 इतिहास (History)
                        </h4>
                        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                          {viewingMandir.history}
                        </p>
                      </div>
                    )}
                    {viewingMandir.significance && (
                      <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs">
                        <h4 className="text-xs font-black text-orange-800 uppercase tracking-wider mb-2">
                          ✨ धार्मिक महत्व (Significance)
                        </h4>
                        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                          {viewingMandir.significance}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Location & Navigation */}
                <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs">
                  <h4 className="text-xs font-black text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-red-600" /> स्थान व मार्ग दर्शन (Location & Coordinates)
                  </h4>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="text-sm text-gray-700 space-y-0.5">
                      <p><span className="font-semibold">पता:</span> {viewingMandir.location?.address || 'उपलब्ध नहीं'}</p>
                      <p>
                        <span className="font-semibold">शहर / राज्य:</span> {viewingMandir.location?.city}, {viewingMandir.location?.state}{' '}
                        {viewingMandir.location?.pincode ? `(${viewingMandir.location.pincode})` : ''}
                      </p>
                      {viewingMandir.location?.coordinates && (
                        <p className="text-xs text-gray-500 font-mono">
                          GPS: {viewingMandir.location.coordinates.lat?.toFixed(5)}, {viewingMandir.location.coordinates.lng?.toFixed(5)}
                        </p>
                      )}
                    </div>
                    {viewingMandir.location?.coordinates?.lat && viewingMandir.location?.coordinates?.lng && (
                      <a
                        href={`https://www.google.com/maps?q=${viewingMandir.location.coordinates.lat},${viewingMandir.location.coordinates.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-xl font-bold text-xs sm:text-sm transition-all self-start sm:self-center"
                      >
                        <Compass className="w-4 h-4" /> Google Maps पर देखें
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Visit Info & Facilities */}
                <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs space-y-4">
                  <h4 className="text-xs font-black text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Car className="w-4 h-4 text-green-600" /> दर्शन सुविधाएं (Facilities & Visit Info)
                  </h4>

                  {/* Facilities Pills */}
                  {viewingMandir.facilities && (
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(viewingMandir.facilities).map(([key, val]) => (
                        <span
                          key={key}
                          className={`text-xs px-3 py-1 rounded-full font-semibold flex items-center gap-1.5 ${
                            val ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-gray-100 text-gray-400'
                          }`}
                        >
                          <span>{val ? '✓' : '✕'}</span>
                          {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Visit Details */}
                  {viewingMandir.visitInfo && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-gray-100 text-xs">
                      {viewingMandir.visitInfo.bestTimeToVisit && (
                        <div>
                          <span className="text-gray-400 block font-medium">Best Time:</span>
                          <span className="font-bold text-gray-800">{viewingMandir.visitInfo.bestTimeToVisit}</span>
                        </div>
                      )}
                      {viewingMandir.visitInfo.dressCode && (
                        <div>
                          <span className="text-gray-400 block font-medium">Dress Code:</span>
                          <span className="font-bold text-gray-800">{viewingMandir.visitInfo.dressCode}</span>
                        </div>
                      )}
                      {viewingMandir.visitInfo.entryFee && (
                        <div>
                          <span className="text-gray-400 block font-medium">Entry Fee:</span>
                          <span className="font-bold text-gray-800">{viewingMandir.visitInfo.entryFee}</span>
                        </div>
                      )}
                      <div>
                        <span className="text-gray-400 block font-medium">Photography:</span>
                        <span className="font-bold text-gray-800">{viewingMandir.visitInfo.photographyAllowed ? 'अनुमति है' : 'प्रतिबंधित'}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Contact & Audit Info */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs text-gray-500 border-t border-gray-200">
                  <div className="flex items-center gap-4">
                    {viewingMandir.contact?.phone && (
                      <span className="flex items-center gap-1 text-gray-700">
                        <Phone className="w-3.5 h-3.5 text-gray-400" /> {viewingMandir.contact.phone}
                      </span>
                    )}
                    {viewingMandir.contact?.website && (
                      <a
                        href={viewingMandir.contact.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-blue-600 hover:underline"
                      >
                        <Globe className="w-3.5 h-3.5" /> Website
                      </a>
                    )}
                  </div>
                  <div className="text-right text-[11px] text-gray-400">
                    <span>ID: {viewingMandir._id}</span>
                    {viewingMandir.source && <span> • Source: {viewingMandir.source}</span>}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Sticky Footer Bar */}
            <div className="bg-white border-t border-gray-200 p-3 sm:p-4 md:p-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3 flex-shrink-0 shadow-md">
              <Link
                href={`/mandirs/${viewingMandir._id}`}
                target="_blank"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-xs sm:text-sm hover:shadow-lg hover:scale-105 transition-all text-center"
              >
                <ExternalLink className="w-4 h-4" /> Open Public Page
              </Link>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const m = viewingMandir;
                    setViewingMandir(null);
                    handleEdit(m);
                  }}
                  className="inline-flex items-center justify-center gap-1.5 px-4 sm:px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-bold text-xs sm:text-sm hover:shadow-lg hover:scale-105 transition-all flex-1 sm:flex-none text-center"
                >
                  <Pencil className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Edit Mandir
                </button>
                <button
                  onClick={() => setViewingMandir(null)}
                  className="px-4 sm:px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-xs sm:text-sm transition-all flex-1 sm:flex-none text-center"
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
