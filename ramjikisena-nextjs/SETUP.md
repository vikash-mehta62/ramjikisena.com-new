# 🚀 Quick Setup Guide - Ramji Ki Sena

## Step 1: Backend Setup (Node.js/Express)

```bash
# Root directory mein (D:\MY\ramjikisena)
cd D:\MY\ramjikisena

# Install nodemon (agar nahi hai)
npm install --save-dev nodemon

# Backend start karo
npm run dev
```

Backend will run on: **http://localhost:3100**

## Step 2: Frontend Setup (Next.js)

```bash
# Next.js folder mein jao
cd ramjikisena-nextjs

# Dependencies install karo (agar nahi kiya)
npm install

# Frontend start karo
npm run dev
```

Frontend will run on: **http://localhost:3000**

## ✅ Verification

1. Backend check karo: http://localhost:3100/login
2. Frontend check karo: http://localhost:3000
3. Register/Login test karo

## 🎯 Features Implemented

### Frontend (Next.js + Tailwind)
- ✅ Modern, responsive UI
- ✅ Home page with gradient design
- ✅ Login page
- ✅ Register page
- ✅ Dashboard with Ram Naam counting
- ✅ Real-time count updates
- ✅ Beautiful animations
- ✅ Mobile-friendly

### Backend (Node.js + Express)
- ✅ User authentication (JWT)
- ✅ Ram Naam counting system
- ✅ Daily count tracking
- ✅ Ranking system
- ✅ MongoDB database
- ✅ Admin panel
- ✅ Excel export

## 🔧 Configuration

### Backend (.env)
```env
DB_CONNECTION_STRING = "mongodb+srv://..."
EXPRESS_SESSION_SECRET = vikash
PORT = 3100
JWT_SECRET_KEY = mysecretkey
EXPIRE = 365d
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3100
```

## 📱 Pages

| Page | URL | Description |
|------|-----|-------------|
| Home | `/` | Landing page |
| Login | `/login` | User login |
| Register | `/register` | New user registration |
| Dashboard | `/dashboard` | Ram Naam counting interface |

## 🎨 Design Features

- **Gradient backgrounds**: Orange, red, yellow theme
- **Smooth animations**: Hover effects, scale transitions
- **Card-based layout**: Modern, clean design
- **Responsive grid**: Works on all screen sizes
- **Custom scrollbar**: Themed scrollbar
- **Loading states**: Beautiful loading animations

## 🐛 Troubleshooting

### Backend not connecting?
- Check if MongoDB is accessible
- Verify PORT 3100 is free
- Check .env file exists

### Frontend not loading?
- Check if backend is running on 3100
- Verify .env.local has correct API_URL
- Clear browser cache

### CORS errors?
- Backend app.js already updated with localhost:3000
- Check credentials: 'include' in fetch calls

## 📝 Next Steps

1. ✅ Backend running
2. ✅ Frontend running
3. 🔄 Test registration
4. 🔄 Test login
5. 🔄 Test Ram Naam counting
6. 🔄 Test save functionality

## 🙏 Jai Shri Ram!
