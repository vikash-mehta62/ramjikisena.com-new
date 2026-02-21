# Phase 4 - Quick Start Guide

## 🚀 Start Building in 5 Minutes

This guide gets you started with Phase 4 implementation immediately.

---

## Step 1: Choose Your Feature (30 seconds)

### Option A: Admin Panel (Recommended)
**Start here if:** You want to enable blog approval and content moderation

**Time:** 2 weeks
**Complexity:** Medium
**Impact:** High (enables platform management)

👉 **Jump to:** [Admin Panel Quick Start](#admin-panel-quick-start)

---

### Option B: Mandir Directory
**Start here if:** You want to add high-value user features first

**Time:** 2 weeks
**Complexity:** High (Google Maps)
**Impact:** Very High (major feature)

👉 **Jump to:** [Mandir Directory Quick Start](#mandir-directory-quick-start)

---

## Admin Panel Quick Start

### 1. Read the Spec (5 minutes)
```bash
# Open in your editor
code .kiro/specs/admin-panel/requirements.md
```

**Key Features:**
- Admin authentication
- Blog approval (approve/reject)
- User management
- Dashboard analytics
- Announcements

---

### 2. Create Admin User (2 minutes)

**Option A: MongoDB Shell**
```javascript
// Connect to your MongoDB
use ramnaambank

// Update existing user to admin
db.users.updateOne(
  { username: "admin" },
  { $set: { role: "admin" } }
)

// Or create new admin user
db.users.insertOne({
  username: "admin",
  name: "Admin User",
  password: "$2a$10$...", // Use bcrypt hash
  role: "admin",
  city: "Admin",
  contact: "9999999999",
  currCount: 0,
  totalCount: 0,
  rank: 0,
  joiningDate: new Date()
})
```

**Option B: Create Script**
```bash
# Create file: scripts/createAdmin.js
node scripts/createAdmin.js
```

---

### 3. Backend - Create Admin Middleware (5 minutes)

**File:** `routes/middleware/adminAuth.js`

```javascript
// Create this file
const adminAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  
  next();
};

module.exports = adminAuth;
```

---

### 4. Backend - Create Admin Routes (10 minutes)

**File:** `routes/admin.js`

```javascript
const express = require('express');
const router = express.Router();
const User = require('./users');
const Blog = require('./blog');
const adminAuth = require('./middleware/adminAuth');

// All routes require admin auth
router.use(adminAuth);

// Dashboard stats
router.get('/dashboard', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalBlogs = await Blog.countDocuments();
    const pendingBlogs = await Blog.countDocuments({ approved: false });
    const totalRamNaam = await User.aggregate([
      { $group: { _id: null, total: { $sum: '$totalCount' } } }
    ]);
    
    res.json({
      totalUsers,
      totalBlogs,
      pendingBlogs,
      totalRamNaam: totalRamNaam[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get pending blogs
router.get('/blogs/pending', async (req, res) => {
  try {
    const blogs = await Blog.find({ approved: false })
      .populate('author', 'name username')
      .sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Approve blog
router.post('/blogs/:id/approve', async (req, res) => {
  try {
    await Blog.findByIdAndUpdate(req.params.id, { approved: true });
    res.json({ message: 'Blog approved successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Reject blog
router.post('/blogs/:id/reject', async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: 'Blog rejected and deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ joiningDate: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

---

### 5. Backend - Register Admin Routes (2 minutes)

**File:** `routes/index.js`

```javascript
// Add this line
const adminRouter = require('./admin');

// Add this route (after authentication middleware)
router.use('/api/admin', isLoggedIn, adminRouter);
```

---

### 6. Frontend - Create Admin Layout (10 minutes)

**File:** `ramjikisena-nextjs/app/(admin)/layout.tsx`

```typescript
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is admin
    const checkAdmin = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user.role !== 'admin') {
          router.push('/dashboard');
          return;
        }

        setLoading(false);
      } catch (error) {
        router.push('/login');
      }
    };

    checkAdmin();
  }, [router]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="text-xl">Loading...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Sidebar */}
      <div className="flex">
        <aside className="w-64 bg-orange-600 text-white min-h-screen p-4">
          <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>
          <nav className="space-y-2">
            <Link href="/admin/dashboard" className="block p-2 hover:bg-orange-700 rounded">
              Dashboard
            </Link>
            <Link href="/admin/blogs/pending" className="block p-2 hover:bg-orange-700 rounded">
              Pending Blogs
            </Link>
            <Link href="/admin/users" className="block p-2 hover:bg-orange-700 rounded">
              Users
            </Link>
            <Link href="/dashboard" className="block p-2 hover:bg-orange-700 rounded">
              Back to User Dashboard
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
```

---

### 7. Frontend - Create Admin Dashboard (10 minutes)

**File:** `ramjikisena-nextjs/app/(admin)/dashboard/page.tsx`

```typescript
'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBlogs: 0,
    pendingBlogs: 0,
    totalRamNaam: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/api/admin/dashboard');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Total Users</h3>
          <p className="text-3xl font-bold text-orange-600">{stats.totalUsers}</p>
        </div>

        {/* Total Blogs */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Total Blogs</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.totalBlogs}</p>
        </div>

        {/* Pending Blogs */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Pending Blogs</h3>
          <p className="text-3xl font-bold text-yellow-600">{stats.pendingBlogs}</p>
        </div>

        {/* Total Ram Naam */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Total Ram Naam</h3>
          <p className="text-3xl font-bold text-red-600">{stats.totalRamNaam.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}
```

---

### 8. Test It! (5 minutes)

1. **Restart backend:**
```bash
# In root directory
npm run dev
```

2. **Login as admin:**
- Go to http://localhost:3000/login
- Login with admin credentials

3. **Access admin dashboard:**
- Go to http://localhost:3000/admin/dashboard
- You should see statistics!

---

## Mandir Directory Quick Start

### 1. Read the Spec (5 minutes)
```bash
code .kiro/specs/mandir-directory/requirements.md
```

**Key Features:**
- Mandir listing
- Search & filters
- Detail pages with maps
- Reviews & ratings
- GPS nearby search

---

### 2. Get Google Maps API Key (10 minutes)

1. Go to https://console.cloud.google.com/
2. Create new project or select existing
3. Enable "Maps JavaScript API"
4. Create API key
5. Add to `.env.local`:

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
```

---

### 3. Backend - Create Mandir Model (10 minutes)

**File:** `models/Mandir.js`

```javascript
const mongoose = require('mongoose');

const mandirSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  history: String,
  photos: [String],
  location: {
    address: String,
    city: String,
    state: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  timing: {
    opening: String,
    closing: String,
    aarti: [String]
  },
  contact: {
    phone: String,
    email: String,
    website: String
  },
  reviews: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, min: 1, max: 5 },
    text: String,
    createdAt: { type: Date, default: Date.now }
  }],
  averageRating: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Mandir', mandirSchema);
```

---

### 4. Backend - Create Mandir Routes (15 minutes)

**File:** `routes/mandir.js`

```javascript
const express = require('express');
const router = express.Router();
const Mandir = require('../models/Mandir');

// Get all mandirs
router.get('/', async (req, res) => {
  try {
    const { city, state, search } = req.query;
    let query = {};
    
    if (city) query['location.city'] = city;
    if (state) query['location.state'] = state;
    if (search) query.name = { $regex: search, $options: 'i' };
    
    const mandirs = await Mandir.find(query).select('-reviews');
    res.json(mandirs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single mandir
router.get('/:id', async (req, res) => {
  try {
    const mandir = await Mandir.findById(req.params.id)
      .populate('reviews.user', 'name username');
    res.json(mandir);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add review (requires auth)
router.post('/:id/review', async (req, res) => {
  try {
    const { rating, text } = req.body;
    const mandir = await Mandir.findById(req.params.id);
    
    mandir.reviews.push({
      user: req.user._id,
      rating,
      text
    });
    
    // Update average rating
    const totalRating = mandir.reviews.reduce((sum, r) => sum + r.rating, 0);
    mandir.averageRating = totalRating / mandir.reviews.length;
    
    await mandir.save();
    res.json({ message: 'Review added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

Register in `routes/index.js`:
```javascript
const mandirRouter = require('./mandir');
router.use('/api/mandirs', mandirRouter);
```

---

### 5. Test Backend (2 minutes)

Create a test mandir:
```bash
# Use MongoDB shell or Compass
db.mandirs.insertOne({
  name: "Ram Mandir Ayodhya",
  description: "Historic Ram Mandir",
  location: {
    city: "Ayodhya",
    state: "Uttar Pradesh",
    coordinates: { lat: 26.7922, lng: 82.1998 }
  },
  averageRating: 5,
  createdAt: new Date()
})
```

Test API:
```bash
curl http://localhost:3100/api/mandirs
```

---

### 6. Frontend - Create Mandir Listing (15 minutes)

**File:** `ramjikisena-nextjs/app/(dashboard)/mandirs/page.tsx`

```typescript
'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';

export default function MandirListing() {
  const [mandirs, setMandirs] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchMandirs();
  }, [search]);

  const fetchMandirs = async () => {
    try {
      const response = await api.get(`/api/mandirs?search=${search}`);
      setMandirs(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Mandir Directory</h1>

      {/* Search */}
      <input
        type="text"
        placeholder="Search mandirs..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-3 border rounded-lg mb-6"
      />

      {/* Mandir Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mandirs.map((mandir: any) => (
          <Link href={`/mandirs/${mandir._id}`} key={mandir._id}>
            <div className="bg-white rounded-lg shadow hover:shadow-lg transition p-4">
              <h3 className="text-xl font-bold">{mandir.name}</h3>
              <p className="text-gray-600">{mandir.location?.city}, {mandir.location?.state}</p>
              <div className="flex items-center mt-2">
                <span className="text-yellow-500">★</span>
                <span className="ml-1">{mandir.averageRating.toFixed(1)}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
```

---

### 7. Test It! (2 minutes)

1. Go to http://localhost:3000/mandirs
2. You should see the mandir list!
3. Search should work

---

## Next Steps

### For Admin Panel:
1. ✅ Create pending blogs page
2. ✅ Add approve/reject buttons
3. ✅ Create user management page
4. ✅ Add announcements feature

### For Mandir Directory:
1. ✅ Create mandir detail page
2. ✅ Add Google Maps
3. ✅ Implement review system
4. ✅ Add GPS nearby feature

---

## Need Help?

**Read detailed guides:**
- `.kiro/specs/phase4-implementation-guide.md` - Full guide
- `.kiro/specs/admin-panel/requirements.md` - Admin spec
- `.kiro/specs/mandir-directory/requirements.md` - Mandir spec

**Check examples:**
- Look at existing blog system code
- Follow same patterns

---

## 🚩 Jai Shri Ram!

You're now ready to start building Phase 4! Choose your path and start coding! 🚀
