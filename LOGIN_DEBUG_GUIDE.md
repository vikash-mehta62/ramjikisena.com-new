# Login Debug Guide - Production Issue

## Current Status
- ✅ Login API working (returns success: true)
- ✅ User data returned correctly
- ❌ Cookie not being set/sent in subsequent requests

## Debug Steps

### 1. Check Cookie in Browser
1. Open DevTools → Application/Storage → Cookies
2. Look for domain: `your-backend-domain.com`
3. Check if `token` cookie exists

**If Cookie NOT Found:**
- Backend not setting cookie properly
- CORS issue
- Domain mismatch

**If Cookie Found but NOT Sent:**
- Frontend not sending `credentials: 'include'`
- SameSite policy blocking

### 2. Check Network Tab
1. Go to Network tab
2. Click on `/api/login` request
3. Check Response Headers:
   ```
   Set-Cookie: token=xxx; Path=/; HttpOnly; Secure; SameSite=None
   ```

**If Set-Cookie header missing:**
- Backend cookie not being set
- Check backend logs

### 3. Check CORS Headers
In `/api/login` response, verify:
```
Access-Control-Allow-Origin: https://ramjikisena-com-new.vercel.app
Access-Control-Allow-Credentials: true
```

**If missing:**
- CORS not configured properly
- Frontend domain not in whitelist

## Quick Fixes

### Fix 1: Update Backend CORS (app.js)
```javascript
app.use(cors({
  origin: [
    'https://ramjikisena.com',
    'https://ramjikisena-com-new.vercel.app',
    'http://localhost:3000',
    'http://localhost:3001'
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### Fix 2: Verify Environment Variable
Check backend `.env`:
```env
NODE_ENV=production
```

### Fix 3: Test Cookie Manually
```bash
curl -X POST https://your-backend.com/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test"}' \
  -c cookies.txt -v
```

Check if `Set-Cookie` header appears in response.

### Fix 4: Alternative - Use LocalStorage (Temporary)
If cookies not working, use localStorage:

**Backend (routes/api.js):**
```javascript
return res.json({ 
  success: true, 
  message: 'Login successful',
  token: token, // Send token in response
  user: {...},
  redirect: '...'
});
```

**Frontend (lib/auth.ts):**
```typescript
login: async (username: string, password: string) => {
  const res = await fetch(`${API_URL}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();
  
  // Store token in localStorage as fallback
  if (data.success && data.token) {
    localStorage.setItem('token', data.token);
  }
  
  return data;
},
```

## Common Issues & Solutions

### Issue: "Cookie blocked by SameSite policy"
**Solution:** Backend must set `SameSite=None` and `Secure=true`

### Issue: "Cookie not sent with requests"
**Solution:** Frontend must use `credentials: 'include'` in all fetch calls

### Issue: "CORS error"
**Solution:** Add frontend domain to CORS whitelist

### Issue: "Cookie domain mismatch"
**Solution:** Don't set domain in cookie options, let it default

## Production Checklist

- [ ] Backend has `NODE_ENV=production`
- [ ] CORS includes frontend URL
- [ ] Cookie has `Secure=true`
- [ ] Cookie has `SameSite=None`
- [ ] Frontend uses `credentials: 'include'`
- [ ] Both frontend and backend on HTTPS
- [ ] No browser extensions blocking cookies

## Test Command
```bash
# Test from command line
curl -X POST https://your-backend.com/api/login \
  -H "Content-Type: application/json" \
  -H "Origin: https://ramjikisena-com-new.vercel.app" \
  -d '{"username":"ChandraSS","password":"your_password"}' \
  -v 2>&1 | grep -i "set-cookie"
```

Should show:
```
< set-cookie: token=xxx; Path=/; HttpOnly; Secure; SameSite=None
```

## If Still Not Working

1. **Check Backend Logs** - Any errors?
2. **Try Different Browser** - Chrome vs Firefox
3. **Disable Browser Extensions** - Ad blockers can block cookies
4. **Check Railway/Render Logs** - Backend deployment logs
5. **Verify HTTPS** - Both must be HTTPS for Secure cookies

## Contact Support
If issue persists, provide:
1. Screenshot of Network tab (login request)
2. Screenshot of Application tab (Cookies)
3. Backend logs during login
4. Browser console errors
