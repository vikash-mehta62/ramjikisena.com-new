# Cloudinary Setup Guide - COMPLETE! ✅

## ✅ Your Credentials (Already Configured)
- **Cloud Name**: `dsvotvxhq`
- **API Key**: `886837389255772`
- **Folder**: `INEXT - RAM-JI-Ki-SENA`

## 🚨 IMPORTANT: Create Upload Preset

You need to create an **unsigned upload preset** in Cloudinary:

### Step-by-Step:
1. Go to https://cloudinary.com/console
2. Login with your account
3. Click on **Settings** (gear icon) → **Upload**
4. Scroll down to **Upload presets** section
5. Click **Add upload preset**
6. Configure:
   - **Preset name**: `ramjikisena_unsigned`
   - **Signing Mode**: Select **"Unsigned"** (IMPORTANT!)
   - **Folder**: `INEXT - RAM-JI-Ki-SENA/mandirs`
   - **Unique filename**: Enable (recommended)
7. Click **Save**

## ✅ Environment Variables (Already Set)

### Backend (.env)
```env
CLOUDINARY_CLOUD_NAME=dsvotvxhq
CLOUDINARY_API_KEY=886837389255772
CLOUDINARY_API_SECRET=aW_hpmUewFUAoQmLvfhaI7Aw12M
CLOUDINARY_FOLDER=INEXT - RAM-JI-Ki-SENA
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dsvotvxhq
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=ramjikisena_unsigned
```

## 🔄 Restart Development Server
```bash
# Stop current server (Ctrl+C)
cd ramjikisena-nextjs
npm run dev
```

## 🎯 How to Use:
1. Go to **Admin Panel** → **Mandirs**
2. Click **Add Mandir** or **Edit** existing
3. In **Photos** section:
   - Click **"Choose File"** to upload from computer
   - Image will automatically upload to Cloudinary
   - OR paste image URL manually
4. Click **Create/Update Mandir**

## ✨ Features:
- ✅ Direct upload from browser
- ✅ Automatic image optimization
- ✅ Fast CDN delivery
- ✅ Edit mandir details
- ✅ Multiple photos per mandir
- ✅ Photo preview before saving

## 🐛 Troubleshooting:
- **"Cloudinary not configured"**: Restart dev server
- **Upload fails**: Check if upload preset is created and set to "Unsigned"
- **403 Error**: Verify preset name is exactly `ramjikisena_unsigned`

## 📊 Your Free Tier:
- Storage: 25 GB
- Bandwidth: 25 GB/month
- Perfect for temple website!

## 🎉 Ready to Use!
Everything is configured. Just create the upload preset and restart the server!
