# ✅ API Base URL Updated

## Changes Made

### Frontend - Updated API_BASE URL
**Files Modified**:
1. ✅ `auth/googleAuth.ts` - Default API_BASE changed to new Heroku backend
2. ✅ `config/environment.ts` - Already had the correct production URL
3. ✅ `.env` - Already had the correct backend URL

**New Backend URL**: `https://gaelcraves-backend-256f85b120e2.herokuapp.com`

### Old vs New

**Before**:
```typescript
const API_BASE = extra.API_BASE || "http://localhost:8080";
```

**After**:
```typescript
const API_BASE = extra.API_BASE || "https://gaelcraves-backend-256f85b120e2.herokuapp.com";
```

## Important: Update Backend CORS

Your backend `SecurityConfig.java` currently has the backend URL in CORS allowed origins, but it should have the **frontend** URL. 

**Current (WRONG)**:
```java
cfg.setAllowedOrigins(List.of(
    "http://localhost:8081",
    "http://localhost:3000",
    "http://localhost:19006",
    "https://gaelcraves-backend-256f85b120e2.herokuapp.com",  // ❌ This is the backend URL
    allowedOrigin
));
```

**Should be**:
```java
cfg.setAllowedOrigins(List.of(
    "http://localhost:8081",
    "http://localhost:3000",
    "http://localhost:19006",
    "https://gaelcraves-frontend-7a6e5c03f69a.herokuapp.com",  // ✅ This is the frontend URL
    allowedOrigin
));
```

## Deployment Steps

### 1. Deploy Frontend (Already Done)
```bash
cd GaelCraves_Frontend
git add .
git commit -m "Update API_BASE to new Heroku backend URL"
git push heroku main
```

### 2. Fix and Deploy Backend (REQUIRED)
```bash
cd GaelCravings_Backend

# Fix the CORS allowed origin to use frontend URL
# Then deploy:
git add .
git commit -m "Fix CORS to allow frontend URL"
git push heroku main
```

### 3. Set Environment Variables on Heroku

**Frontend**:
```bash
heroku config:set API_BASE=https://gaelcraves-backend-256f85b120e2.herokuapp.com --app gaelcraves-frontend-7a6e5c03f69a
heroku config:set GOOGLE_WEB_CLIENT_ID="624682753251-1777mu4gr62ajtklkeod1j7hugvafjdb.apps.googleusercontent.com" --app gaelcraves-frontend-7a6e5c03f69a
```

**Backend**:
```bash
heroku config:set FRONTEND_ORIGIN=https://gaelcraves-frontend-7a6e5c03f69a.herokuapp.com --app gaelcraves-backend-256f85b120e2
```

## Testing

1. Visit: `https://gaelcraves-frontend-7a6e5c03f69a.herokuapp.com`
2. Try logging in with Google
3. Check browser console for API calls
4. Verify no CORS errors
5. Confirm LOGIN button changes to LOGOUT

## Common Issues

### If you see CORS errors:
```
Access to fetch at 'https://gaelcraves-backend-256f85b120e2.herokuapp.com/api/...' 
from origin 'https://gaelcraves-frontend-7a6e5c03f69a.herokuapp.com' 
has been blocked by CORS policy
```

**Solution**: Make sure backend SecurityConfig has the **frontend URL** in allowed origins, not the backend URL!

### If Google login doesn't work:
1. Check backend logs: `heroku logs --tail --app gaelcraves-backend-256f85b120e2`
2. Verify `/api/v1/auth/google` endpoint exists
3. Check Google Cloud Console - make sure Heroku URLs are in authorized origins

## Summary

✅ **Frontend API_BASE**: Updated to new backend URL  
⚠️ **Backend CORS**: Needs to be fixed to use frontend URL  
📝 **Environment Variables**: Set on Heroku after deployment  
🧪 **Testing**: Required after both deployments  

---

**Next Action**: Fix backend CORS configuration and deploy both services!
