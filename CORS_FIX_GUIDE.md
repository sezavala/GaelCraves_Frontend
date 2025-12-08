# 🚨 CORS ERROR FIX - Production

## Problem
Your app is calling the **OLD backend URL** which doesn't have CORS configured for your frontend:
- ❌ Old Backend: `https://gaelcraves-backend-7a6e5c03f69a.herokuapp.com`
- ✅ New Backend: `https://gaelcraves-backend-256f85b120e2.herokuapp.com`

## Root Cause
The Heroku environment variable `API_BASE` is pointing to the old backend URL, overriding your code defaults.

## Fix Steps

### Step 1: Update Heroku Environment Variable

```bash
# Set the correct backend URL on Heroku frontend app
heroku config:set API_BASE=https://gaelcraves-backend-256f85b120e2.herokuapp.com --app gaelcraves-frontend-7a6e5c03f69a

# Verify it's set correctly
heroku config:get API_BASE --app gaelcraves-frontend-7a6e5c03f69a
```

### Step 2: Update Backend CORS Configuration

Make sure the NEW backend allows your frontend URL. Update `SecurityConfig.java`:

```java
cfg.setAllowedOrigins(List.of(
    "http://localhost:8081",
    "http://localhost:3000",
    "http://localhost:19006",
    "https://gaelcraves-frontend-7a6e5c03f69a.herokuapp.com",  // ✅ Your frontend URL
    allowedOrigin
));
```

Then set the backend environment variable:

```bash
heroku config:set FRONTEND_ORIGIN=https://gaelcraves-frontend-7a6e5c03f69a.herokuapp.com --app gaelcraves-backend-256f85b120e2

# Verify
heroku config --app gaelcraves-backend-256f85b120e2
```

### Step 3: Deploy Frontend Changes

```bash
cd GaelCraves_Frontend

# Commit the app.config.js and googleAuth.ts changes
git add app.config.js auth/googleAuth.ts
git commit -m "Update API_BASE to new backend URL"

# Push to Heroku
git push heroku main

# Watch the deployment
heroku logs --tail --app gaelcraves-frontend-7a6e5c03f69a
```

### Step 4: Deploy Backend (if CORS wasn't configured)

```bash
cd GaelCravings_Backend

# Make sure SecurityConfig.java has the frontend URL in CORS
git add src/main/java/com/gaelcraves/project3/GaelCravings_Backend/Auth/SecurityConfig.java
git commit -m "Add frontend URL to CORS allowed origins"

# Push to Heroku
git push heroku main

# Watch the deployment
heroku logs --tail --app gaelcraves-backend-256f85b120e2
```

### Step 5: Restart Both Apps

```bash
# Restart frontend to pick up new environment variable
heroku restart --app gaelcraves-frontend-7a6e5c03f69a

# Restart backend to apply CORS changes
heroku restart --app gaelcraves-backend-256f85b120e2
```

### Step 6: Clear Browser Cache

In your browser at `https://gaelcraves-frontend-7a6e5c03f69a.herokuapp.com`:

1. Open DevTools (F12)
2. Go to Application tab
3. Clear Storage → Clear site data
4. Or: Right-click refresh button → Empty Cache and Hard Reload

## Verification

### Check Environment Variables

```bash
# Frontend should show NEW backend URL
heroku config:get API_BASE --app gaelcraves-frontend-7a6e5c03f69a
# Expected: https://gaelcraves-backend-256f85b120e2.herokuapp.com

# Backend should show frontend URL
heroku config:get FRONTEND_ORIGIN --app gaelcraves-backend-256f85b120e2
# Expected: https://gaelcraves-frontend-7a6e5c03f69a.herokuapp.com
```

### Test CORS

```bash
curl -H "Origin: https://gaelcraves-frontend-7a6e5c03f69a.herokuapp.com" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://gaelcraves-backend-256f85b120e2.herokuapp.com/api/users/login \
     -v
```

Should see:
```
< Access-Control-Allow-Origin: https://gaelcraves-frontend-7a6e5c03f69a.herokuapp.com
< Access-Control-Allow-Methods: GET,POST,PUT,PATCH,DELETE,OPTIONS
< Access-Control-Allow-Credentials: true
```

### Test Login

1. Go to: https://gaelcraves-frontend-7a6e5c03f69a.herokuapp.com/login
2. Open browser console (F12)
3. Try logging in
4. Check Network tab:
   - ✅ Should call: `https://gaelcraves-backend-256f85b120e2.herokuapp.com/api/users/login`
   - ❌ Should NOT call: `https://gaelcraves-backend-7a6e5c03f69a.herokuapp.com/...`
5. Should see no CORS errors
6. Login should succeed

## Files Modified

### Frontend:
- ✅ `app.config.js` - Default API_BASE updated
- ✅ `auth/googleAuth.ts` - Default API_BASE updated
- ✅ `.env` - Already has correct URL

### Backend:
- ⚠️ `SecurityConfig.java` - Verify frontend URL is in CORS allowed origins

## Quick Commands Reference

```bash
# Set frontend env var
heroku config:set API_BASE=https://gaelcraves-backend-256f85b120e2.herokuapp.com --app gaelcraves-frontend-7a6e5c03f69a

# Set backend env var
heroku config:set FRONTEND_ORIGIN=https://gaelcraves-frontend-7a6e5c03f69a.herokuapp.com --app gaelcraves-backend-256f85b120e2

# Deploy frontend
cd GaelCraves_Frontend && git push heroku main

# Deploy backend
cd GaelCravings_Backend && git push heroku main

# Restart both
heroku restart --app gaelcraves-frontend-7a6e5c03f69a
heroku restart --app gaelcraves-backend-256f85b120e2

# Check logs
heroku logs --tail --app gaelcraves-frontend-7a6e5c03f69a
heroku logs --tail --app gaelcraves-backend-256f85b120e2
```

## Troubleshooting

### If still seeing old backend URL in errors:

1. **Clear Heroku build cache**:
```bash
heroku repo:purge_cache --app gaelcraves-frontend-7a6e5c03f69a
git commit --allow-empty -m "Rebuild"
git push heroku main
```

2. **Check what API_BASE the app is using**:
   - Open https://gaelcraves-frontend-7a6e5c03f69a.herokuapp.com
   - Open browser console
   - Should see logs like:
   ```
   [googleAuth] API_BASE= https://gaelcraves-backend-256f85b120e2.herokuapp.com
   🌐 Environment: production
   📡 API Base URL: https://gaelcraves-backend-256f85b120e2.herokuapp.com/api
   ```

3. **If still wrong, double-check Heroku config**:
```bash
heroku config --app gaelcraves-frontend-7a6e5c03f69a | grep API_BASE
```

### If CORS error persists after fixing URL:

1. **Verify backend CORS config**:
```bash
heroku logs --tail --app gaelcraves-backend-256f85b120e2
```
Look for CORS-related logs

2. **Check backend code**:
   - SecurityConfig.java must have frontend URL in allowed origins
   - Must have `cfg.setAllowCredentials(true)`
   - Must have OPTIONS in allowed methods

3. **Test backend directly**:
```bash
curl https://gaelcraves-backend-256f85b120e2.herokuapp.com/api/users/login \
  -X POST \
  -H "Content-Type: application/json" \
  -H "Origin: https://gaelcraves-frontend-7a6e5c03f69a.herokuapp.com" \
  -d '{"email":"test@test.com","password":"test"}' \
  -v
```

---

**Priority**: 🔥 HIGH - Fix immediately to restore login functionality  
**Impact**: Login, Google Auth, and all API calls currently broken  
**Estimated Time**: 5-10 minutes once env vars are set correctly
