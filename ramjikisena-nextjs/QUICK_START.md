# ⚡ Quick Start - 2 Minutes Setup

## 🎯 Goal
Backend (Port 3100) + Frontend (Port 3000) dono chalana hai

---

## 📍 Step 1: Backend Start (Terminal 1)

```bash
# Root folder mein jao
cd D:\MY\ramjikisena

# Nodemon install (agar nahi hai)
npm install --save-dev nodemon

# Start backend
npm run dev
```

**✅ Success Message:**
```
Database connected successfully
```

**🌐 Backend URL:** http://localhost:3100

---

## 📍 Step 2: Frontend Start (Terminal 2)

```bash
# Next.js folder mein jao
cd D:\MY\ramjikisena\ramjikisena-nextjs

# Install dependencies (pehli baar)
npm install

# Start frontend
npm run dev
```

**✅ Success Message:**
```
✓ Ready in 2.5s
○ Local: http://localhost:3000
```

**🌐 Frontend URL:** http://localhost:3000

---

## 🎉 Done!

Ab browser mein jao:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3100

---

## 🧪 Quick Test

1. Open: http://localhost:3000
2. Click "रजिस्टर / Register"
3. Fill form and submit
4. Login with credentials
5. Start counting Ram Naam!

---

## 🐛 Problem?

### Backend not starting?
```bash
# Check if port 3100 is free
netstat -ano | findstr :3100
```

### Frontend not starting?
```bash
# Reinstall dependencies
cd ramjikisena-nextjs
rm -rf node_modules
npm install
```

### Can't connect?
- Check both servers are running
- Check .env.local has: `NEXT_PUBLIC_API_URL=http://localhost:3100`
- Check app.js has CORS for localhost:3000

---

## 📂 File Locations

```
D:\MY\ramjikisena\
├── app.js                    ← Backend main file
├── package.json              ← Backend dependencies
├── .env                      ← Backend config
│
└── ramjikisena-nextjs\
    ├── app\page.tsx          ← Frontend home
    ├── package.json          ← Frontend dependencies
    └── .env.local            ← Frontend config
```

---

## 🚩 Jai Shri Ram!

That's it! Bas 2 terminals, 2 commands, aur ready! 🎉
