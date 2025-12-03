# API Path Fix - Production Deployment

## Issue
Console errors on live system:
- `401 Unauthorized` on `/api/auth/me`
- `404 Not Found` on `/favicon.svg`
- `404 Not Found` on `/api/email/test`

## Root Cause
Hardcoded API paths without the base path `/minihackathon` in:
- `src/pages/Home.tsx` - Email test endpoint
- `src/pages/VerifyEmail.tsx` - Verify and resend endpoints
- `index.html` - Favicon path

## Fixes Applied

### 1. Favicon Path
**File:** `index.html`
```html
<!-- Before -->
<link rel="icon" type="image/svg+xml" href="./favicon.svg" />

<!-- After -->
<link rel="icon" type="image/svg+xml" href="/minihackathon/favicon.svg" />
```

### 2. Email Test Endpoint
**File:** `src/pages/Home.tsx`
```typescript
// Before
const res = await fetch("/api/email/test", {

// After
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';
const res = await fetch(`${apiBaseUrl}/api/email/test`, {
```

### 3. Email Verification Endpoints
**File:** `src/pages/VerifyEmail.tsx`
```typescript
// Before
const response = await fetch('/api/auth/verify-email', {
const response = await fetch('/api/auth/resend-verification', {

// After
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';
const response = await fetch(`${apiBaseUrl}/api/auth/verify-email`, {
const response = await fetch(`${apiBaseUrl}/api/auth/resend-verification`, {
```

## Deployment Steps

### 1. Rebuild the Frontend Container
```bash
cd /path/to/KonfiDayPlaner

# Stop the app container
docker-compose stop app

# Rebuild with no cache
docker-compose build --no-cache app

# Start the updated container
docker-compose up -d app
```

### 2. Verify the Fix
```bash
# Check the container is running
docker-compose ps

# Check the logs
docker-compose logs --tail=50 app

# Test the frontend
curl -I http://localhost:8080/minihackathon/
curl -I http://localhost:8080/minihackathon/favicon.svg
```

### 3. Test in Browser
1. Clear browser cache (Ctrl+Shift+Delete)
2. Navigate to `https://lu2adevelopment.de/minihackathon/`
3. Open DevTools Console (F12)
4. Verify no 404 errors
5. Test API calls:
   - Login should work
   - Email verification should work
   - Test email endpoint should work

## Environment Configuration

The `VITE_API_BASE_URL` is set in the Dockerfile:
```dockerfile
ARG VITE_API_BASE_URL=/minihackathon
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
```

This is baked into the build at build time, so changes require a rebuild.

## Quick Deployment Command

```bash
# Complete rebuild and deploy
docker-compose down app && \
docker-compose build --no-cache app && \
docker-compose up -d app

# Or rebuild all services
docker-compose down && \
docker-compose build --no-cache && \
docker-compose up -d
```

## Verification Checklist

After deployment:
- [ ] No 404 errors in console
- [ ] Favicon loads correctly
- [ ] `/api/auth/me` returns 200 or proper auth response
- [ ] Email test endpoint accessible
- [ ] Email verification works
- [ ] Login/signup functions properly

## Rollback (if needed)

```bash
# Stop current version
docker-compose stop app

# Use previous image
docker-compose up -d app

# Or rebuild from previous commit
git checkout <previous-commit>
docker-compose build app
docker-compose up -d app
```

## Notes

- All API calls now use `import.meta.env.VITE_API_BASE_URL` 
- Favicon path is now absolute with base path
- The `api.ts` helper already had this implemented correctly
- Direct fetch calls have been updated to match

## Testing Locally

To test these changes locally:

```bash
# Development (no base path)
npm run dev

# Production build with base path
npm run build
npm run preview
# Visit http://localhost:4173/minihackathon/
```
