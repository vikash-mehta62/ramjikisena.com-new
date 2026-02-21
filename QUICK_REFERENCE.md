# 🚀 Quick Reference - Ramji Ki Sena

## 🎯 Quick Start

### Start Backend
```bash
npm run dev
```
Port: 3100

### Start Frontend
```bash
cd ramjikisena-nextjs
npm run dev
```
Port: 3000

### Create Admin
```bash
node scripts/createAdmin.js
```
Username: `admin` | Password: `admin123`

---

## 🔗 Important URLs

### User URLs
- Home: http://localhost:3000
- Login: http://localhost:3000/login
- Dashboard: http://localhost:3000/dashboard
- Blogs: http://localhost:3000/blogs
- Mandirs: http://localhost:3000/mandirs

### Admin URLs
- Dashboard: http://localhost:3000/admin/admin-dashboard
- Pending Blogs: http://localhost:3000/admin/admin-blogs/pending
- All Blogs: http://localhost:3000/admin/admin-blogs
- Users: http://localhost:3000/admin/users
- Mandirs: http://localhost:3000/admin/admin-mandirs

---

## 📁 Key Files

### Backend
```
routes/index.js         - Main routes
routes/admin.js         - Admin APIs
routes/mandir.js        - Mandir APIs
routes/blog.js          - Blog model
routes/users.js         - User model
models/Mandir.js        - Mandir model
```

### Frontend
```
app/(admin)/layout.tsx                  - Admin layout
app/(admin)/admin-dashboard/page.tsx    - Admin dashboard
app/(dashboard)/dashboard/page.tsx      - User dashboard
app/(dashboard)/mandirs/page.tsx        - Mandir listing
lib/api.ts                              - API helper
```

---

## 🎨 Color Scheme

```
Primary:    Orange (#FF6B35, #FF8C00)
Secondary:  Red (#DC143C, #B22222)
Accent:     Yellow (#FFD700, #FFA500)
Background: Orange-50 → Red-50 → Yellow-50
```

---

## 🔑 Admin Credentials

```
Username: admin
Password: admin123
```

⚠️ Change in production!

---

## 📊 Features

### User Features
- ✅ Ram Naam counting
- ✅ Leaderboard
- ✅ Blog system
- ✅ Mandir directory
- ✅ Reviews & ratings
- ✅ Profile management

### Admin Features
- ✅ Dashboard analytics
- ✅ Blog approval
- ✅ User management
- ✅ Mandir management
- ✅ Statistics

---

## 🐛 Common Issues

### Port Already in Use
```bash
# Kill process on port 3000
npx kill-port 3000

# Kill process on port 3100
npx kill-port 3100
```

### MongoDB Connection Error
Check `.env` file:
```
DB_CONNECTION_STRING=mongodb+srv://...
```

### Admin Access Denied
Run:
```bash
node scripts/createAdmin.js
```

---

## 📝 Quick Commands

### Backend
```bash
npm install              # Install dependencies
npm run dev             # Start dev server
npm start               # Start production
```

### Frontend
```bash
cd ramjikisena-nextjs
npm install             # Install dependencies
npm run dev            # Start dev server
npm run build          # Build for production
```

---

## 🎯 Testing Flow

1. **Start servers** (backend + frontend)
2. **Create admin** (run script)
3. **Login as admin**
4. **Create test blog** (as user)
5. **Approve blog** (as admin)
6. **Create mandir** (as admin)
7. **Add review** (as user)

---

## 📞 Need Help?

Check these files:
- `PHASE4_COMPLETE_FINAL.md` - Complete guide
- `ADMIN_PANEL_UI_COMPLETE.md` - Admin UI
- `PHASE4B_MANDIR_COMPLETE.md` - Mandir feature
- `.kiro/specs/` - All specifications

---

## 🚩 Jai Shri Ram!

**Everything is ready to use!** 🎉
