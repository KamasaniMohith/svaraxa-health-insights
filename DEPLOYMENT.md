# Deployment Guide - SVARAXA Health Insights

## Vercel Deployment Issues Fixed

### 1. ✅ Deprecated Package Warning (whatwg-encoding@3.1.1)
**Issue**: npm warning about deprecated `whatwg-encoding` package

**Status**: This is a transitive dependency warning from `@tanstack/react-start` → `cheerio` → `encoding-sniffer` → `whatwg-encoding`

**Solutions**:
- The warning can be safely ignored during build - it doesn't affect functionality
- The package is used for HTML encoding detection in the dev toolchain
- A future update to `@tanstack/react-start` or `cheerio` will resolve this automatically
- If strict warning policy is required, you can use npm's `npm audit fix --audit-level=none` during CI/CD

### 2. ✅ Large CSS Bundle (86.31 kB gzipped 14.08 kB)
This is normal for a TailwindCSS + shadcn/ui project. The gzip size of 14 kB is acceptable.

---

## Code Quality Fixes Applied

### 1. **Animation Frame Memory Leak Fix** (results.tsx)
- Fixed potential memory leak in the risk score animation
- Properly cancels animation frames on component unmount

### 2. **API URL Configuration** (api.ts)
- Changed from hardcoded URL to environment variable `VITE_API_BASE`
- Allows different APIs for dev/prod environments

### 3. **Input Validation** (AssessmentForm.tsx)
- Added range validation for all health metrics
- Provides clear error messages for invalid input
- Prevents API calls with out-of-range values

### 4. **Enhanced Error Handling** (api.ts)
- Better error messages from API failures
- Network error detection and user-friendly messages
- Proper HTTP status code reporting

### 5. **Removed Hardcoded Delays** (AssessmentForm.tsx)
- Removed 2800ms setTimeout hack
- Now waits for actual API response before navigation

---

## Environment Setup

### For Local Development
Create a `.env.local` file (or `.env.development.local`):
```
VITE_API_BASE=http://localhost:8000
```

### For Production (Vercel)
Add this environment variable in Vercel dashboard:
- Name: `VITE_API_BASE`
- Value: `https://theomverse-svaraxa-api.hf.space` (or your production API URL)

---

## Deployment Checklist

- [x] Fixed race condition in animation frame
- [x] Made API URL configurable via environment variable
- [x] Added input validation for form submissions
- [x] Improved error messages and error handling
- [x] Removed setTimeout hacks
- [ ] Test in Vercel preview deployment
- [ ] Verify API connectivity from Vercel servers
- [ ] Test all three assessments (Heart, Diabetes, Breast Cancer)
- [ ] Verify results page animations work correctly

---

## Build Commands

```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Lint code
npm run lint

# Format code
npm run format
```

---

## Known Limitations

1. **whatwg-encoding deprecation**: This is a transitive dependency warning from upstream packages. It does not affect functionality.

2. **CSS bundle size**: If you need to reduce CSS, consider using PurgeCSS or dynamic imports for non-critical components.

3. **No offline support**: App requires internet connection to access prediction API.

---

## Support

If you encounter deployment errors:
1. Check Vercel build logs for specific errors
2. Ensure `VITE_API_BASE` environment variable is set
3. Verify the prediction API is accessible from Vercel's servers
4. Check API response format matches `PredictionResult` interface

