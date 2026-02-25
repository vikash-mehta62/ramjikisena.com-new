# 🔄 Data Sync Strategy - User & Pandit Models

## Architecture Overview

```
┌─────────────────────────────────────────┐
│         User Model (Primary)            │
│  Purpose: Authentication & Basic Info   │
│  ─────────────────────────────────────  │
│  - username (phone)                     │
│  - password (hashed)                    │
│  - name                                 │
│  - contact (phone)                      │
│  - city                                 │
│  - role: 'user' | 'admin' | 'pandit'    │
│  - email                                │
└─────────────────┬───────────────────────┘
                  │
                  │ Reference: user._id
                  │
        ┌─────────▼──────────┐
        │                    │
┌───────▼────────┐  ┌────────▼──────────┐
│  Pandit Model  │  │  Regular User     │
│  (Extended)    │  │  (Extended)       │
│  ─────────────│  │  ─────────────    │
│  - services    │  │  - ramCount       │
│  - bookings    │  │  - blogs          │
│  - reviews     │  │  - devotee data   │
│  - earnings    │  │                   │
│  - location    │  │                   │
│  - photos      │  │                   │
└────────────────┘  └───────────────────┘
```

## Why Two Models?

### User Model (Authentication Layer)
- **Purpose**: Single authentication system for all users
- **Contains**: Login credentials, basic info, role
- **Used for**: Login, JWT tokens, role-based access

### Pandit Model (Business Layer)
- **Purpose**: Pandit-specific business data
- **Contains**: Services, bookings, reviews, earnings
- **Used for**: Booking system, profile display, business logic

## Data Sync Rules

### Fields That Must Stay Synced

| Field | User Model | Pandit Model | Sync Direction |
|-------|-----------|--------------|----------------|
| Name | `name` | `name` | Both ways |
| Phone | `contact` | `contact.phone` | Both ways |
| City | `city` | `location.city` | Both ways |
| Email | `email` | `contact.email` | Pandit → User |

### When Sync Happens

#### 1. Registration (Pandit → User)
```javascript
// Create user first
const user = await userModel.create({
  username: phone,
  name: name,
  contact: phone,
  city: city,
  role: 'pandit'
});

// Then create pandit with reference
const pandit = await Pandit.create({
  name: name,
  contact: { phone, email },
  location: { city, state },
  user: user._id  // Reference
});
```

#### 2. Profile Update (Pandit → User)
```javascript
// Update pandit
const pandit = await Pandit.findByIdAndUpdate(panditId, updates);

// Sync to user
const userUpdates = {};
if (updates.name) userUpdates.name = updates.name;
if (updates.contact?.phone) userUpdates.contact = updates.contact.phone;
if (updates.location?.city) userUpdates.city = updates.location.city;

await userModel.findByIdAndUpdate(userId, userUpdates);
```

#### 3. User Profile Update (User → Pandit)
```javascript
// If user updates their profile and they're a pandit
if (user.role === 'pandit') {
  const pandit = await Pandit.findOne({ user: user._id });
  if (pandit) {
    await Pandit.findByIdAndUpdate(pandit._id, {
      name: user.name,
      'contact.phone': user.contact,
      'location.city': user.city
    });
  }
}
```

## Implementation Status

### ✅ Implemented
1. Registration sync (User + Pandit creation)
2. Pandit profile update → User sync
3. Default values for averageRating, totalBookings
4. Safe null checks in frontend

### ⏳ To Implement
1. User profile update → Pandit sync
2. Webhook/event system for automatic sync
3. Sync validation middleware
4. Conflict resolution strategy

## Code Locations

### Registration Sync
**File**: `routes/panditAuth.js`
```javascript
router.post('/register', async (req, res) => {
  // Creates both User and Pandit
  // Line ~45-75
});
```

### Profile Update Sync
**File**: `routes/panditDashboard.js`
```javascript
router.put('/profile', async (req, res) => {
  // Updates Pandit then syncs to User
  // Line ~280-320
});
```

### Frontend Safe Access
**File**: `ramjikisena-nextjs/app/pandit/dashboard/page.tsx`
```typescript
// Safe null checks
{pandit?.averageRating ? pandit.averageRating.toFixed(1) : '0.0'}
```

## Best Practices

### 1. Always Use Transactions (Future)
```javascript
const session = await mongoose.startSession();
session.startTransaction();
try {
  await User.updateOne({...}, { session });
  await Pandit.updateOne({...}, { session });
  await session.commitTransaction();
} catch (error) {
  await session.abortTransaction();
  throw error;
}
```

### 2. Validation Before Sync
```javascript
// Validate data before syncing
if (updates.contact?.phone) {
  if (!/^\d{10}$/.test(updates.contact.phone)) {
    throw new Error('Invalid phone number');
  }
}
```

### 3. Audit Trail
```javascript
// Log all sync operations
console.log('Syncing pandit to user:', {
  panditId,
  userId,
  fields: Object.keys(userUpdates)
});
```

## Common Issues & Solutions

### Issue 1: Undefined Fields
**Problem**: `pandit.averageRating.toFixed()` fails
**Solution**: Use optional chaining and defaults
```typescript
{pandit?.averageRating?.toFixed(1) ?? '0.0'}
```

### Issue 2: Stale Data
**Problem**: User sees old data after update
**Solution**: Update localStorage after sync
```javascript
localStorage.setItem('pandit', JSON.stringify(updatedPandit));
```

### Issue 3: Duplicate Phone Numbers
**Problem**: Same phone in User and Pandit
**Solution**: Unique index on User.contact
```javascript
userSchema.index({ contact: 1 }, { unique: true });
```

## Future Enhancements

### 1. Event-Driven Sync
```javascript
// Emit events on changes
panditSchema.post('save', function(doc) {
  eventEmitter.emit('pandit:updated', doc);
});

// Listen and sync
eventEmitter.on('pandit:updated', async (pandit) => {
  await syncToUser(pandit);
});
```

### 2. Sync Queue (For Scale)
```javascript
// Add to queue instead of immediate sync
await syncQueue.add('pandit-to-user', {
  panditId,
  userId,
  updates
});
```

### 3. Conflict Resolution
```javascript
// Last-write-wins strategy
const lastModified = Math.max(
  user.updatedAt,
  pandit.updatedAt
);
```

## Testing Checklist

- [ ] Register pandit → Check both User and Pandit created
- [ ] Update pandit name → Check User.name updated
- [ ] Update pandit phone → Check User.contact updated
- [ ] Update pandit city → Check User.city updated
- [ ] Login as pandit → Check correct data loaded
- [ ] Dashboard displays → No undefined errors

## Summary

**Why this approach?**
- Single authentication system
- Role-based access control
- Separation of concerns (auth vs business)
- Scalable for future features

**Key principle**: User model is the source of truth for authentication, Pandit model is the source of truth for business data. Sync keeps them consistent.

---

**Status**: Basic sync implemented ✅ | Advanced features pending ⏳
