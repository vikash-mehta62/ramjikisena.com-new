# Phase 4 - Implementation Guide

## Overview

This guide provides step-by-step instructions for implementing Phase 4 features in Ramji Ki Sena platform. Follow this sequence for optimal development flow.

## Prerequisites

- Phase 3 completed (Blog system working)
- Backend running on port 3100
- Next.js frontend running on port 3000
- MongoDB connected
- Admin user created in database

## Implementation Sequence

### Week 1-2: Admin Panel (Phase 4A)

#### Step 1: Backend - Admin Middleware
**File:** `routes/middleware/adminAuth.js`

```javascript
// Create admin authentication middleware
const adminAuth = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Admin access required' });
  }
};
```

#### Step 2: Backend - Admin Routes
**File:** `routes/admin.js`

Create admin-specific routes:
- GET `/api/admin/dashboard` - Analytics
- GET `/api/admin/blogs/pending` - Pending blogs
- POST `/api/admin/blogs/:id/approve` - Approve blog
- POST `/api/admin/blogs/:id/reject` - Reject blog
- GET `/api/admin/users` - All users
- POST `/api/admin/announcements` - Create announcement

#### Step 3: Backend - Announcement Model
**File:** `models/Announcement.js`

```javascript
const announcementSchema = new mongoose.Schema({
  title: String,
  content: String,
  type: { type: String, enum: ['info', 'warning', 'success'] },
  active: { type: Boolean, default: true },
  expiryDate: Date,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});
```

#### Step 4: Frontend - Admin Layout
**File:** `ramjikisena-nextjs/app/(admin)/layout.tsx`

Create admin layout with:
- Admin sidebar navigation
- Role verification
- Admin-only access control

#### Step 5: Frontend - Admin Dashboard
**File:** `ramjikisena-nextjs/app/(admin)/dashboard/page.tsx`

Display:
- Total users count
- Total blogs (approved/pending)
- Total Ram Naam count
- Recent activity feed
- Quick action buttons

#### Step 6: Frontend - Blog Approval Page
**File:** `ramjikisena-nextjs/app/(admin)/blogs/pending/page.tsx`

Features:
- List all pending blogs
- Preview blog content
- Approve/Reject buttons
- Bulk actions

#### Step 7: Frontend - User Management
**File:** `ramjikisena-nextjs/app/(admin)/users/page.tsx`

Features:
- User list with search
- User statistics
- View user details
- Export to Excel

#### Step 8: Frontend - Announcements
**File:** `ramjikisena-nextjs/app/(admin)/announcements/page.tsx`

Features:
- Create announcement form
- Active announcements list
- Edit/Delete announcements
- Set expiry dates

### Week 3-4: Mandir Directory (Phase 4B)

#### Step 1: Backend - Mandir Model
**File:** `models/Mandir.js`

```javascript
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
```

#### Step 2: Backend - Mandir Routes
**File:** `routes/mandir.js`

Create routes:
- GET `/api/mandirs` - All mandirs
- GET `/api/mandirs/:id` - Single mandir
- POST `/api/mandirs` - Create (admin only)
- PUT `/api/mandirs/:id` - Update (admin only)
- DELETE `/api/mandirs/:id` - Delete (admin only)
- POST `/api/mandirs/:id/review` - Add review
- GET `/api/mandirs/nearby` - GPS-based search

#### Step 3: Frontend - Mandir Listing
**File:** `ramjikisena-nextjs/app/(dashboard)/mandirs/page.tsx`

Features:
- Grid view of mandirs
- Search bar
- City/State filters
- Nearby button (GPS)
- Pagination

#### Step 4: Frontend - Mandir Detail
**File:** `ramjikisena-nextjs/app/(dashboard)/mandirs/[id]/page.tsx`

Features:
- Full mandir information
- Photo gallery
- Google Maps integration
- Reviews section
- Add review form
- Get directions button

#### Step 5: Frontend - Admin Mandir Management
**File:** `ramjikisena-nextjs/app/(admin)/mandirs/page.tsx`

Features:
- Add new mandir form
- Edit existing mandirs
- Delete mandirs
- Photo upload
- Location picker

#### Step 6: Integration - Google Maps API
**File:** `.env.local`

Add:
```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key
```

Implement:
- Map display component
- Location search
- Distance calculation
- Directions link

## Testing Checklist

### Admin Panel Testing

- [ ] Admin can login and access admin dashboard
- [ ] Non-admin users cannot access admin routes
- [ ] Dashboard shows correct statistics
- [ ] Admin can approve blogs
- [ ] Admin can reject blogs
- [ ] Admin can view all users
- [ ] Admin can create announcements
- [ ] Announcements display on user pages
- [ ] Expired announcements auto-hide

### Mandir Directory Testing

- [ ] Users can view all mandirs
- [ ] Search filters mandirs correctly
- [ ] City/State filters work
- [ ] Mandir detail page displays all info
- [ ] Google Maps shows correct location
- [ ] Users can add reviews
- [ ] Rating updates correctly
- [ ] GPS finds nearby mandirs
- [ ] Admin can add new mandirs
- [ ] Admin can edit mandirs
- [ ] Admin can delete mandirs

## Database Seeding

### Create Admin User

```javascript
// Run in MongoDB shell or create seed script
db.users.updateOne(
  { username: 'admin' },
  { $set: { role: 'admin' } }
);
```

### Seed Sample Mandirs

```javascript
// Create seed script: scripts/seedMandirs.js
const sampleMandirs = [
  {
    name: 'Ram Mandir Ayodhya',
    city: 'Ayodhya',
    state: 'Uttar Pradesh',
    location: { coordinates: { lat: 26.7922, lng: 82.1998 } }
  },
  {
    name: 'Kashi Vishwanath',
    city: 'Varanasi',
    state: 'Uttar Pradesh',
    location: { coordinates: { lat: 25.3109, lng: 83.0107 } }
  }
];
```

## API Documentation

### Admin Endpoints

```
GET    /api/admin/dashboard
Response: { totalUsers, totalBlogs, pendingBlogs, totalRamNaam }

GET    /api/admin/blogs/pending
Response: [{ _id, title, author, category, createdAt }]

POST   /api/admin/blogs/:id/approve
Body: {}
Response: { message: 'Blog approved' }

POST   /api/admin/announcements
Body: { title, content, type, expiryDate }
Response: { announcement }
```

### Mandir Endpoints

```
GET    /api/mandirs
Query: ?city=Delhi&search=Ram
Response: [{ _id, name, city, photos, averageRating }]

GET    /api/mandirs/:id
Response: { mandir with full details }

POST   /api/mandirs/:id/review
Body: { rating, text }
Response: { message: 'Review added' }

GET    /api/mandirs/nearby
Query: ?lat=28.6139&lng=77.2090&radius=10
Response: [{ mandir, distance }]
```

## Deployment Checklist

- [ ] Environment variables set
- [ ] Google Maps API key configured
- [ ] Payment gateway credentials (for future)
- [ ] Database indexes created
- [ ] Admin user created
- [ ] Sample data seeded
- [ ] All tests passing
- [ ] Error handling implemented
- [ ] Loading states added
- [ ] Mobile responsive
- [ ] SEO metadata added

## Performance Optimization

### Backend
- Add database indexes on frequently queried fields
- Implement caching for mandir listings
- Optimize image uploads (compression)
- Add pagination to all list endpoints

### Frontend
- Lazy load images
- Implement infinite scroll
- Cache API responses
- Optimize bundle size
- Add loading skeletons

## Security Considerations

- Validate all admin routes with middleware
- Sanitize user inputs
- Implement rate limiting
- Secure file uploads
- Validate coordinates for GPS
- Prevent SQL injection in search
- Add CSRF protection

## Next Steps After Phase 4

1. User testing and feedback
2. Bug fixes and polish
3. Performance optimization
4. Phase 5: Helping System
5. Phase 6: Event Management
6. Phase 7: Donation System

---

**Ready to start?** Begin with Admin Panel Week 1!
