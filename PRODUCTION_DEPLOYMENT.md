# Production Deployment Guide

## Backend (Express Server) Configuration

### Environment Variables (.env)
```env
NODE_ENV=production
DB_CONNECTION_STRING=your_mongodb_connection
EXPRESS_SESSION_SECRET=your_secret_key
JWT_SECRET_KEY=your_jwt_secret
PORT=3100

# Cloudinary
CLOUDINARY_CLOUD_NAME=dsvotvxhq
CLOUDINARY_API_KEY=886837389255772
CLOUDINARY_API_SECRET=aW_hpmUewFUAoQmLvfhaI7Aw12M
CLOUDINARY_FOLDER=INEXT - RAM-JI-Ki-SENA
```

### Important Settings for Production:

1. **CORS Configuration** (app.js)
   - Add your production domain to allowed origins
   - Current: `https://ramjikisena-com-new.vercel.app`

2. **Cookie Settings** (routes/api.js)
   - `secure: true` - HTTPS only
   - `sameSite: 'none'` - Cross-domain cookies
   - `httpOnly: true` - Security

3. **Session Configuration** (app.js)
   - Secure cookies in production
   - Cross-site support

## Frontend (Next.js) Configuration

### Environment Variables (.env.local)
```env
NEXT_PUBLIC_API_URL=https://your-backend-domain.com

# Cloudinary (if using client-side upload)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dsvotvxhq
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=ramjikisena_unsigned
```

## Common Login Issues & Solutions

### Issue 1: Cookies Not Being Set
**Cause:** Cross-domain cookie restrictions
**Solution:**
- Backend must use `sameSite: 'none'` and `secure: true`
- Frontend must use `credentials: 'include'` in fetch
- Both must be on HTTPS

### Issue 2: CORS Errors
**Cause:** Frontend domain not in CORS whitelist
**Solution:**
- Add frontend domain to CORS origins in app.js
- Ensure `credentials: true` in CORS config

### Issue 3: 401 Unauthorized After Login
**Cause:** Cookie not being sent with requests
**Solution:**
- Check `credentials: 'include'` in all API calls
- Verify cookie domain settings
- Check browser console for cookie warnings

## Deployment Checklist

### Backend (Railway/Render/Heroku)
- [ ] Set NODE_ENV=production
- [ ] Add all environment variables
- [ ] Update CORS origins with frontend URL
- [ ] Ensure MongoDB connection string is correct
- [ ] Test /api/login endpoint

### Frontend (Vercel/Netlify)
- [ ] Set NEXT_PUBLIC_API_URL to backend URL
- [ ] Build and deploy
- [ ] Test login flow
- [ ] Check browser console for errors
- [ ] Verify cookies in DevTools

## Testing Production Login

1. **Open Browser DevTools**
   - Go to Application/Storage tab
   - Check Cookies section

2. **Try Login**
   - Enter credentials
   - Submit form

3. **Check Response**
   - Network tab → Check /api/login response
   - Should return success: true
   - Cookie should be set

4. **Verify Cookie**
   - Name: `token`
   - Domain: Your backend domain
   - Secure: ✓ (if HTTPS)
   - HttpOnly: ✓
   - SameSite: None (for cross-domain)

## Troubleshooting Commands

### Check Backend Health
```bash
curl https://your-backend.com/api/login -X POST \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test"}' \
  --cookie-jar cookies.txt
```

### Check Cookie Settings
```bash
curl -I https://your-backend.com/api/login
```

## Important Notes

1. **HTTPS Required**: Both frontend and backend must use HTTPS for secure cookies
2. **Domain Matching**: Cookie domain must match backend domain
3. **SameSite=None**: Required for cross-domain cookies (frontend on Vercel, backend on Railway)
4. **Credentials**: Always use `credentials: 'include'` in fetch calls

## Support

If login still not working:
1. Check browser console for errors
2. Check Network tab for failed requests
3. Verify environment variables are set
4. Test backend endpoint directly with Postman
5. Check backend logs for errors
