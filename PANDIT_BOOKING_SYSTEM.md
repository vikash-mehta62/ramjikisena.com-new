# 🕉️ Pandit Booking System - Complete Documentation

## System Overview

Complete pandit booking system with:
- Pandit registration & profiles
- Service management
- Booking system
- Pandit dashboard
- User booking management
- Reviews & ratings

---

## 📊 Database Models

### 1. Pandit Model (`models/Pandit.js`)

**Fields:**
- Basic Info: name, photo, photos
- Contact: phone, email, whatsapp
- Professional: experience, specialization, languages, qualification
- Location: address, city, state, pincode, coordinates
- Services: array of {poojaType, price, duration, description}
- Availability: workingDays, workingHours
- Description & About
- Social Media links
- Reviews & Ratings
- Stats: totalBookings, completedBookings
- Status: isVerified, isActive
- User reference (linked to user account)

### 2. Booking Model (`models/Booking.js`)

**Fields:**
- user (ref to User)
- pandit (ref to Pandit)
- Booking Details: poojaType, poojaDate, poojaTime, duration
- Location: full address where pooja will be performed
- Pricing: price, platformFee, totalAmount
- Requirements: samagriNeeded, numberOfPeople, specialInstructions, language
- Status: pending, confirmed, rejected, completed, cancelled
- Payment: status, method, transactionId, paidAt
- Communication: userNotes, panditNotes
- Timestamps for all status changes
- Cancellation details
- Review status

---

## 🔌 API Endpoints

### Public Pandit Routes (`/api/pandits`)

#### GET `/api/pandits`
Get all pandits with filters
**Query Params:**
- search: Search by name/specialization
- city: Filter by city
- state: Filter by state
- specialization: Filter by specialization
- minRating: Minimum rating filter

**Response:**
```json
{
  "success": true,
  "pandits": [...]
}
```

#### GET `/api/pandits/:id`
Get single pandit details with reviews

#### GET `/api/pandits/:id/services`
Get pandit's services list

---

### Booking Routes (`/api/bookings`) - Requires Login

#### POST `/api/bookings`
Create new booking
**Body:**
```json
{
  "pandit": "panditId",
  "poojaType": "Griha Pravesh",
  "poojaDate": "2026-03-01",
  "poojaTime": "10:00 AM",
  "duration": "2 hours",
  "location": {
    "address": "123 Main St",
    "city": "Delhi",
    "state": "Delhi",
    "pincode": "110001"
  },
  "price": 5000,
  "platformFee": 500,
  "requirements": {
    "samagriNeeded": true,
    "numberOfPeople": 10,
    "language": "Hindi"
  }
}
```

#### GET `/api/bookings/my-bookings`
Get user's all bookings
**Query:** status (optional)

#### GET `/api/bookings/:id`
Get single booking details

#### POST `/api/bookings/:id/cancel`
Cancel booking
**Body:** { "cancellationReason": "..." }

#### POST `/api/bookings/:id/review`
Add review after completion
**Body:** { "rating": 5, "text": "..." }

---

### Pandit Dashboard Routes (`/api/pandit-dashboard`) - Requires Pandit Login

#### GET `/api/pandit-dashboard/stats`
Get dashboard statistics
**Response:**
```json
{
  "success": true,
  "stats": {
    "totalBookings": 50,
    "pendingBookings": 5,
    "confirmedBookings": 10,
    "completedBookings": 35,
    "totalEarnings": 175000,
    "averageRating": 4.5,
    "totalReviews": 30
  },
  "upcomingBookings": [...]
}
```

#### GET `/api/pandit-dashboard/bookings`
Get all bookings for pandit
**Query:** status, date

#### GET `/api/pandit-dashboard/bookings/:id`
Get single booking details

#### POST `/api/pandit-dashboard/bookings/:id/confirm`
Confirm pending booking
**Body:** { "panditNotes": "..." }

#### POST `/api/pandit-dashboard/bookings/:id/reject`
Reject pending booking
**Body:** { "panditNotes": "..." }

#### POST `/api/pandit-dashboard/bookings/:id/complete`
Mark booking as completed

#### GET `/api/pandit-dashboard/profile`
Get pandit profile

#### PUT `/api/pandit-dashboard/profile`
Update pandit profile

#### GET `/api/pandit-dashboard/earnings`
Get earnings report
**Query:** startDate, endDate

---

## 🎯 Booking Flow

### User Flow:
1. Browse pandits → Filter by location/specialization
2. View pandit profile → See services, reviews, ratings
3. Select service → Choose date, time, location
4. Create booking → Status: "pending"
5. Wait for confirmation
6. Booking confirmed → Status: "confirmed"
7. Pooja completed → Status: "completed"
8. Add review

### Pandit Flow:
1. Register as pandit
2. Setup profile → Add services, availability
3. Receive booking notification → Status: "pending"
4. Review booking details
5. Accept/Reject booking
6. If accepted → Status: "confirmed"
7. Perform pooja
8. Mark as completed → Status: "completed"
9. Receive payment

---

## 📱 Frontend Pages to Create

### User Side:
1. `/pandits` - Pandit listing page
2. `/pandits/[id]` - Pandit detail page
3. `/pandits/[id]/book` - Booking form page
4. `/my-bookings` - User's bookings list
5. `/my-bookings/[id]` - Booking detail page

### Pandit Side:
1. `/pandit/register` - Pandit registration
2. `/pandit/dashboard` - Dashboard with stats
3. `/pandit/bookings` - All bookings list
4. `/pandit/bookings/[id]` - Booking detail
5. `/pandit/profile` - Profile management
6. `/pandit/services` - Service management
7. `/pandit/earnings` - Earnings report

### Admin Side:
1. `/admin/admin-pandits` - Pandit management
2. `/admin/admin-bookings` - All bookings
3. `/admin/admin-pandit-verification` - Verify pandits

---

## 🔐 Authentication & Authorization

### Middleware:
- `isLoggedInAPI` - Check if user is logged in
- `isPandit` - Check if user is a pandit
- `adminAuth` - Check if user is admin

### User Roles:
- **User**: Can book pandits, view bookings
- **Pandit**: Can manage profile, accept/reject bookings
- **Admin**: Can manage all pandits and bookings

---

## 💰 Payment Integration (To be added)

### Payment Flow:
1. User creates booking
2. Payment gateway integration (Razorpay/Stripe)
3. Payment success → Booking confirmed
4. Payment failed → Booking cancelled
5. After completion → Release payment to pandit
6. Platform commission deduction

---

## 📊 Features Summary

✅ **Completed (Backend):**
- Pandit model with services
- Booking model with all statuses
- Public pandit listing & details
- Booking creation & management
- Pandit dashboard with stats
- Accept/Reject bookings
- Mark as completed
- Reviews & ratings
- Earnings tracking
- Pandit authentication (register/login/logout)

✅ **Completed (Frontend - Phase 1):**
- Navbar with User/Pandit dropdown menus
- Pandit Registration page with comprehensive form
- Pandit Login page
- Pandit Dashboard with stats and upcoming bookings
- Bookings Management page with filters
- Profile Management page
- Earnings Report page with date filters
- Authentication utility (panditAuth.ts)
- Token persistence in localStorage
- Separate auth flow for pandits vs users

⏳ **Pending (Frontend - Phase 2):**
- Public pandit listing page (`/pandits`)
- Pandit detail page (`/pandits/[id]`)
- Booking form page (`/pandits/[id]/book`)
- User bookings pages (`/my-bookings`)
- Booking detail page with actions (`/pandit/bookings/[id]`)
- Service management UI
- Photo upload functionality
- Admin pandit management pages
- Payment gateway integration
- Notification system
- Real-time updates

---

## 🚀 Next Steps (Phase 2)

1. Create public pandit listing with search/filters
2. Create pandit detail page with services display
3. Create booking form for users
4. Create user booking management pages
5. Create booking detail page with Accept/Reject/Complete actions
6. Add payment gateway integration (Razorpay/Stripe)
7. Add notification system
8. Add calendar for availability
9. Add admin panel for pandit management
10. Add pandit verification system
11. Add photo upload for pandits
12. Add booking confirmation emails/SMS
13. Add real-time booking updates

---

## 📝 Notes

- All routes are RESTful
- Proper error handling included
- Authentication required for sensitive operations
- Status tracking for bookings
- Review system after completion
- Earnings calculation for pandits
- Platform fee support
- Cancellation support with reasons
- Separate token management for pandits (panditToken)
- User-friendly authentication flow

---

**Status:** Backend Complete ✅ | Frontend Phase 1 Complete ✅ | Phase 2 Pending ⏳
