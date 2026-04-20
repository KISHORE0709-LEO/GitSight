# Quick Fix Reference Card

## 🔴 Problems You Had

1. **Analyze page didn't work in Vercel**
2. **DevOps page showed "Unable to connect to pipeline service"**
3. **Question: Are navigation items hardcoded?** → YES, they are

## 🟢 Solutions Applied

### Problem 1 & 2: API Calls Not Working in Vercel

**Root Cause**: Using relative paths (`/api/analyze`, `/pipeline/status`) instead of full API Gateway URL

**Fix**: Updated both pages to use environment variable

```typescript
const apiUrl = import.meta.env.VITE_API_GATEWAY_URL || '';
const endpoint = apiUrl ? `${apiUrl}/api/analyze` : `/api/analyze`;
```

### Problem 3: Navigation Items

**Answer**: Navigation items are **hardcoded static** in `AppSidebar.tsx`

They're application-wide features, not user-specific.

## 📋 Setup Steps

### 1. Get API Gateway URL
```bash
aws apigatewayv2 get-apis --query 'Items[0].ApiEndpoint' --output text
```

### 2. Add to Vercel
- Vercel Dashboard → Settings → Environment Variables
- Name: `VITE_API_GATEWAY_URL`
- Value: `https://your-api-id.execute-api.us-east-1.amazonaws.com`

### 3. Redeploy
```bash
git push origin main
```

### 4. Test
- Go to `/analyze`
- Enter GitHub username
- Click Analyze
- ✅ Should work!

## 🏠 Local Development

Create `.env.local`:
```bash
VITE_API_GATEWAY_URL=https://your-api-id.execute-api.us-east-1.amazonaws.com
```

Then:
```bash
npm run dev
```

## 📝 Files Changed

| File | Change |
|------|--------|
| `src/pages/Analyze.tsx` | Added API Gateway URL support |
| `src/pages/DevOps.tsx` | Added API Gateway URL support |

## 📚 New Documentation

| File | Purpose |
|------|---------|
| `VERCEL_DEPLOYMENT.md` | Complete Vercel setup guide |
| `NAVIGATION_CLARIFICATION.md` | Explains navigation structure |
| `FIXES_APPLIED.md` | Detailed fix summary |

## ✅ Verification

After setup, check:
- [ ] Analyze page works with GitHub username
- [ ] DevOps page shows pipeline status
- [ ] No console errors
- [ ] Network requests succeed

## 🆘 If Still Not Working

1. **Check environment variable is set**
   ```bash
   # In Vercel dashboard, verify VITE_API_GATEWAY_URL exists
   ```

2. **Test API directly**
   ```bash
   curl https://your-api-id.execute-api.us-east-1.amazonaws.com/api/analyze \
     -X POST \
     -H "Content-Type: application/json" \
     -d '{"username":"octocat"}'
   ```

3. **Check browser console**
   - F12 → Console tab
   - Look for fetch errors

4. **Verify CORS**
   ```bash
   aws apigatewayv2 get-apis --api-id your-api-id
   ```

## 🎯 Key Points

✅ **Analyze page** - Now uses full API Gateway URL
✅ **DevOps page** - Now uses full API Gateway URL
✅ **Navigation** - Hardcoded static items (by design)
✅ **Environment variable** - `VITE_API_GATEWAY_URL`
✅ **Vercel setup** - Add env var and redeploy

## 📞 Quick Commands

```bash
# Get API Gateway URL
aws apigatewayv2 get-apis --query 'Items[0].ApiEndpoint' --output text

# Set Vercel env var
vercel env add VITE_API_GATEWAY_URL

# Redeploy
vercel --prod

# Test API
curl https://your-api-id.execute-api.us-east-1.amazonaws.com/api/analyze \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"username":"octocat"}'
```

---

**Status**: ✅ All issues fixed and documented
