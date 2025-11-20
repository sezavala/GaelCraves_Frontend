# Logout and Token Expiration Fixes

## Summary
Fixed logout functionality and implemented token expiration checking to ensure users are automatically logged out when their JWT token expires.

## Changes Made

### 1. **authService.ts** ✅ (Already implemented)
- Added `isTokenExpired()` function to check JWT token expiration
- Added `logout()` function to clear localStorage
- Integrated token expiration check in login flow

### 2. **AuthContext.tsx** ✅ (Updated)
- Added token expiration check on app initialization
- When app loads, it now:
  - Reads user from localStorage
  - Decodes the JWT token
  - Checks if token has expired
  - Clears localStorage and prevents login if expired
  - Only sets user if token is still valid

### 3. **app/(tabs)/index.tsx** ✅ (Fixed)
- Fixed syntax error: Changed `useAuth` to `useAuth()`
- Implemented `handleLogout()` function that:
  - Calls the logout function from AuthContext
  - Shows success alert
  - Redirects to home tab
- Reorganized navigation to show:
  - LOGOUT button when user is logged in
  - LOGIN button when user is not logged in

## How It Works

### Token Expiration Check
1. **On App Load**: AuthContext checks if stored token is expired
2. **On Login**: authService validates token before accepting it
3. **JWT Decoding**: Extracts `exp` claim from token and compares with current time

### Logout Flow
1. User clicks LOGOUT button
2. `handleLogout()` is called
3. `logout()` from AuthContext clears user state
4. localStorage is cleared (`@user` and `@token`)
5. User is redirected to home
6. Success alert is shown

## Token Expiration
- Backend tokens expire after **24 hours** (defined in JwTService.java)
- Frontend now respects this expiration
- Users will be automatically logged out on app restart if token expired
- Users cannot login with an expired token

## Testing
1. **Test Logout**: 
   - Login as any user
   - Click LOGOUT button
   - Verify you're logged out and redirected

2. **Test Token Expiration**:
   - Login and save the user data
   - Manually expire the token in localStorage (or wait 24 hours)
   - Refresh the app
   - Verify you're automatically logged out

3. **Test Admin Tab**:
   - When logged out: Admin tab should be hidden
   - When logged in as regular user: Admin tab should be hidden
   - When logged in as admin: Admin tab should be visible

## Files Modified
- ✅ `services/authService.ts` - Token expiration logic
- ✅ `auth/AuthContext.tsx` - Token validation on load
- ✅ `app/(tabs)/index.tsx` - Logout button and handler
- ✅ `app/(tabs)/_layout.tsx` - Admin tab visibility logic

## Debug Logs
The following console logs will help you track the logout and token validation:
- `🔐 Token expired, clearing user` - Token was expired on app load
- `💾 User loaded from storage:` - Valid user restored from storage
- `🚪 User logged out` - User clicked logout
- `👋 Logging out user` - AuthContext processing logout
- `🗑️ User removed from storage` - localStorage cleared

## Next Steps
- Test the logout functionality thoroughly
- Verify admin tab only shows for admin users
- Consider adding a token refresh mechanism for better UX
- Add logout confirmation dialog if needed
