# Vercel Deployment Guide

## Issues Fixed

### 1. Analyze Page Not Working in Vercel
**Problem**: The Analyze page was calling `/api/analyze` which doesn't work in Vercel (no backend server).

**Solution**: Updated to use `VITE_API_GATEWAY_URL` environment variable pointing to AWS API Gateway.

### 2. DevOps Page Showing "Unable to connect to pipeline service"
**Problem**: Same issue - calling `/pipeline/status` without full API Gateway URL.

**Solution**: Updated to use `VITE_API_GATEWAY_URL` environment variable.

## Vercel Environment Setup

### Step 1: Get Your API Gateway URL

From AWS Console:
```bash
aws apigatewayv2 get-apis --query 'Items[?Name==`gitsight-api-dev`].ApiEndpoint' --output text
```

Or from CloudFormation outputs:
```bash
aws cloudformation describe-stacks \
  --stack-name gitsight-dev \
  --query 'Stacks[0].Outputs[?OutputKey==`ApiEndpoint`].OutputValue' \
  --output text
```

Example: `https://abc123xyz.execute-api.us-east-1.amazonaws.com`

### Step 2: Add Environment Variable to Vercel

**Option A: Via Vercel Dashboard**
1. Go to Vercel project settings
2. Click "Environment Variables"
3. Add new variable:
   - Name: `VITE_API_GATEWAY_URL`
   - Value: `https://your-api-id.execute-api.us-east-1.amazonaws.com`
   - Environments: Production, Preview, Development

**Option B: Via Vercel CLI**
```bash
vercel env add VITE_API_GATEWAY_URL
# Enter: https://your-api-id.execute-api.us-east-1.amazonaws.com
```

### Step 3: Redeploy

```bash
# Option 1: Push to trigger redeploy
git push origin main

# Option 2: Manual redeploy
vercel --prod
```

## Local Development Setup

### .env.local File

Create `.env.local` in project root:

```bash
VITE_API_GATEWAY_URL=https://your-api-id.execute-api.us-east-1.amazonaws.com
```

### Test Locally

```bash
npm run dev
# Navigate to http://localhost:8080/analyze
# Enter a GitHub username and click Analyze
```

## API Gateway CORS Configuration

Make sure your API Gateway has CORS enabled:

```bash
aws apigatewayv2 update-api \
  --api-id your-api-id \
  --cors-configuration \
    AllowOrigins=https://your-vercel-domain.vercel.app,http://localhost:8080 \
    AllowMethods=GET,POST,OPTIONS \
    AllowHeaders=Content-Type
```

Or in CloudFormation (already configured):

```yaml
CorsConfiguration:
  AllowOrigins:
    - '*'
  AllowMethods:
    - POST
    - GET
    - OPTIONS
  AllowHeaders:
    - Content-Type
```

## Troubleshooting

### "Unable to connect to pipeline service" on DevOps page

**Check 1**: Verify environment variable is set
```bash
# In Vercel dashboard, check Environment Variables
# Should show: VITE_API_GATEWAY_URL = https://...
```

**Check 2**: Verify API Gateway is accessible
```bash
curl https://your-api-id.execute-api.us-east-1.amazonaws.com/pipeline/status
```

**Check 3**: Check browser console for errors
- Open DevTools (F12)
- Go to Console tab
- Look for fetch errors
- Check Network tab for failed requests

### Analyze page returns 404

**Check 1**: Verify Lambda function exists
```bash
aws lambda get-function --function-name gitsight-api-handler-dev
```

**Check 2**: Verify API Gateway route
```bash
aws apigatewayv2 get-routes --api-id your-api-id
# Should show: POST /api/analyze
```

**Check 3**: Test API directly
```bash
curl -X POST https://your-api-id.execute-api.us-east-1.amazonaws.com/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"username":"octocat"}'
```

### CORS errors

**Error**: `Access to XMLHttpRequest blocked by CORS policy`

**Solution**: Update API Gateway CORS:
```bash
aws apigatewayv2 update-api \
  --api-id your-api-id \
  --cors-configuration \
    AllowOrigins=https://your-vercel-domain.vercel.app \
    AllowMethods=GET,POST,OPTIONS \
    AllowHeaders=Content-Type
```

## Vercel Build Configuration

### vercel.json (Optional)

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "env": {
    "VITE_API_GATEWAY_URL": "@vite_api_gateway_url"
  }
}
```

### Environment Variable Reference

In `vercel.json`, reference secrets:
```json
"env": {
  "VITE_API_GATEWAY_URL": "@api_gateway_url"
}
```

Then set in Vercel dashboard as secret.

## Testing After Deployment

### 1. Test Analyze Page
- Go to `https://your-vercel-domain.vercel.app/analyze`
- Enter GitHub username (e.g., "octocat")
- Click Analyze
- Should show metrics and chart

### 2. Test DevOps Page
- Go to `https://your-vercel-domain.vercel.app/devops`
- Should show pipeline stages and recent builds
- Should auto-refresh every 10 seconds

### 3. Check Network Requests
- Open DevTools (F12)
- Go to Network tab
- Perform an action (Analyze or navigate to DevOps)
- Should see successful requests to API Gateway

## Production Checklist

- [ ] API Gateway URL added to Vercel environment variables
- [ ] CORS configured in API Gateway
- [ ] Lambda functions deployed and working
- [ ] Vercel project redeployed after adding env vars
- [ ] Analyze page works with GitHub username
- [ ] DevOps page shows pipeline status
- [ ] No console errors in browser
- [ ] Network requests succeed (200 status)

## Environment Variables Summary

| Variable | Value | Where |
|----------|-------|-------|
| VITE_API_GATEWAY_URL | https://your-api-id.execute-api.us-east-1.amazonaws.com | Vercel + .env.local |

## Quick Reference

### Get API Gateway URL
```bash
aws apigatewayv2 get-apis --query 'Items[0].ApiEndpoint' --output text
```

### Set Vercel Env Var
```bash
vercel env add VITE_API_GATEWAY_URL
```

### Test API
```bash
curl https://your-api-id.execute-api.us-east-1.amazonaws.com/api/analyze \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"username":"octocat"}'
```

### Redeploy
```bash
git push origin main
# or
vercel --prod
```

## Support

If issues persist:
1. Check Vercel deployment logs
2. Check AWS Lambda logs
3. Check browser console errors
4. Verify API Gateway is accessible
5. Verify CORS configuration
6. Test API directly with curl
