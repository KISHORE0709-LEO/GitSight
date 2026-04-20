# 🧪 Quick Test Guide

## Start Development Server

```bash
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:8080/
  ➜  press h + enter to show help
```

## Test 1: DevOps Page

1. Go to http://localhost:8080/devops
2. You should see:
   - ✅ Pipeline stages (6 stages)
   - ✅ Recent builds list
   - ✅ Pipeline configuration
   - ✅ Deployment environment info
   - ❌ NO "Configuration Error" message

## Test 2: Analyze Page

1. Go to http://localhost:8080/analyze
2. Enter GitHub username: `octocat`
3. Click "Analyze"
4. You should see:
   - ✅ Loading spinner
   - ✅ Metrics (Commits, Merged PRs, etc.)
   - ✅ Weekly activity chart
   - ✅ Developer rank and trend
   - ❌ NO errors

## Test 3: Check Network Requests

1. Open DevTools (F12)
2. Go to Network tab
3. Go to DevOps page
4. You should see:
   - ✅ Request to `/pipeline/status`
   - ✅ Response status: 200
   - ✅ Response contains `builds` and `stages`

## Test 4: Check Console

1. Open DevTools (F12)
2. Go to Console tab
3. You should see:
   - ✅ NO errors
   - ✅ NO warnings about missing env vars

## If Tests Fail

### DevOps Page Shows Error

**Error**: "Unable to connect to pipeline service"

**Solution**:
1. Check if API Gateway is running
2. Check if Lambda function is deployed
3. Check browser console for errors (F12)

### Analyze Page Shows Error

**Error**: "Failed to analyze user"

**Solution**:
1. Check if Lambda function is deployed
2. Check if GitHub username is valid
3. Check browser console for errors (F12)

### Network Requests Fail

**Error**: 404 or 500 status

**Solution**:
1. Verify API Gateway URL in vite.config.ts
2. Verify Lambda functions are deployed
3. Check AWS CloudWatch logs

## Success Checklist

- [ ] DevOps page loads without errors
- [ ] Pipeline stages display correctly
- [ ] Recent builds list shows data
- [ ] Analyze page loads without errors
- [ ] Can enter GitHub username
- [ ] Can click Analyze button
- [ ] Results display correctly
- [ ] No console errors
- [ ] Network requests succeed (200 status)

## Quick Commands

```bash
# Start dev server
npm run dev

# Test DevOps page
# Go to http://localhost:8080/devops

# Test Analyze page
# Go to http://localhost:8080/analyze
# Enter: octocat
# Click: Analyze

# Check console
# F12 → Console tab

# Check network
# F12 → Network tab
```

---

**Status**: ✅ **READY TO TEST**
