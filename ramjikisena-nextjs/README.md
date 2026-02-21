# Ramji Ki Sena - Next.js Frontend

Modern, responsive frontend for Ramji Ki Sena Ram Naam Lekhan application built with Next.js 14, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Modern UI/UX**: Clean, gradient-based design with smooth animations
- **Responsive**: Works perfectly on mobile, tablet, and desktop
- **Fast**: Built with Next.js 14 App Router for optimal performance
- **Type-Safe**: Full TypeScript support
- **Tailwind CSS**: Utility-first styling for rapid development

## 📋 Prerequisites

- Node.js 18+ installed
- Backend API running on `http://localhost:3100`

## 🛠️ Installation

1. Navigate to the Next.js project:
```bash
cd ramjikisena-nextjs
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file (already created):
```env
NEXT_PUBLIC_API_URL=http://localhost:3100
```

## 🏃 Running the Application

### Development Mode
```bash
npm run dev
```
Frontend will run on: `http://localhost:3000`

### Production Build
```bash
npm run build
npm start
```

## 📁 Project Structure

```
ramjikisena-nextjs/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/
│   │   └── dashboard/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
├── lib/
│   └── api.ts
├── public/
└── .env.local
```

## 🔗 API Integration

The frontend connects to the Node.js/Express backend running on port 3100. Make sure the backend is running before starting the frontend.

### Backend Setup
```bash
# In the root directory (not ramjikisena-nextjs)
npm install
npm run dev  # or npm start
```

## 🎨 Pages

- **Home** (`/`) - Landing page with information
- **Login** (`/login`) - User authentication
- **Register** (`/register`) - New user registration
- **Dashboard** (`/dashboard`) - Main Ram Naam counting interface
- **All Devotees** - View all registered users
- **Lekhan History** - View daily counting history

## 🔧 Configuration

### Port Configuration
- Frontend: Port 3000 (configured in package.json)
- Backend: Port 3100 (configured in .env.local)

### CORS Setup
Make sure your backend allows requests from `http://localhost:3000`:

```javascript
// In backend app.js
app.use(cors({
  origin: ['http://localhost:3000', 'https://ramjikisena.com'],
  credentials: true,
}));
```

## 🚀 Deployment

### Vercel (Recommended for Next.js)
```bash
npm install -g vercel
vercel
```

### Environment Variables for Production
Set `NEXT_PUBLIC_API_URL` to your production backend URL.

## 📝 Notes

- Backend must be running for authentication and data operations
- Cookies are used for session management (credentials: 'include')
- All API calls use the backend URL from environment variables

## 🙏 Credits

Built for Ramji Ki Sena - राम नाम लेखन platform
