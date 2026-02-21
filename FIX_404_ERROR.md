# 🔧 Fix 404 Error - Admin Dashboard

## Problem
```
GET http://localhost:3000/admin/admin-dashboard 404 (Not Found)
```

## Root Cause
Next.js cache issue after renaming folders. Frontend needs complete restart with cache clear.

---

## ✅ Solution - Complete Restart

### Step 1: Stop Frontend
```bash
# In ramjikisena-nextjs terminal
# Press Ctrl+C to stop
```

### Step 2: Clear Next.js Cache
```bash
cd ramjikisena-nextjs

# Delete .next folder (cache)
Remove-Item -Recurse -Force .next

# Also clear node_modules/.cache if exists
Remove-Item -Recurse -Force node_modules/.cache -ErrorAction SilentlyContinue
```

### Step 3: Restart Frontend
```bash
npm run dev
```

### Step 4: Hard Refresh Browser
```
Chrome/Edge: Ctrl + Shift + R
Or: Ctrl + F5
```

---

## 🎯 Alternative: PowerShell Commands

Run these commands in PowerShell:

```powershell
# Navigate to frontend
cd D:\MY\ramjikisena\ramjikisena-nextjs

# Stop any running process on port 3000
npx kill-port 3000

# Delete cache
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue

# Restart
npm run dev
```

---

## 🧪 Verify It Works

### Test URLs:
1. http://localhost:3000/login
2. Login as admin
3. Should redirect to: http://localhost:3000/admin/admin-dashboard
4. Page should load ✅

### If Still 404:
Check these:

1. **Folder exists?**
```bash
ls app/(admin)/admin-dashboard/
# Should show: page.tsx
```

2. **File has content?**
```bash
cat app/(admin)/admin-dashboard/page.tsx
# Should show React component
```

3. **No syntax errors?**
```bash
npm run build
# Check for errors
```

---

## 🔍 Debug Steps

### 1. Check Folder Structure
```
app/(admin)/
├── admin-dashboard/
│   └── page.tsx          ✅ Must exist
├── admin-blogs/
│   ├── page.tsx
│   └── pending/
│       └── page.tsx
├── admin-mandirs/
│   └── page.tsx
├── users/
│   └── page.tsx
└── layout.tsx
```

### 2. Check Layout File
File: `app/(admin)/layout.tsx`

Navigation should have:
```typescript
{ href: '/admin/admin-dashboard', label: 'Dashboard', icon: '📊' }
```

### 3. Check Page File
File: `app/(admin)/admin-dashboard/page.tsx`

Should start with:
```typescript
'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function AdminDashboard() {
  // ...
}
```

---

## 🚀 Quick Fix Script

Create file: `fix-admin.ps1`

```powershell
# Stop frontend
Write-Host "Stopping frontend..." -ForegroundColor Yellow
npx kill-port 3000

# Clear cache
Write-Host "Clearing cache..." -ForegroundColor Yellow
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force node_modules/.cache -ErrorAction SilentlyContinue

# Restart
Write-Host "Restarting frontend..." -ForegroundColor Green
npm run dev
```

Run:
```bash
cd ramjikisena-nextjs
.\fix-admin.ps1
```

---

## ✅ Expected Result

After restart:
1. ✅ No 404 errors
2. ✅ Admin dashboard loads
3. ✅ All admin pages work
4. ✅ Navigation works

---

## 🚩 Jai Shri Ram!

**Just restart with cache clear - problem solved!** 🎉
