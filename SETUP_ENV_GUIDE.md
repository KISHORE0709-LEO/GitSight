# Auto Setup Environment Variables

## Overview

Three scripts are provided to automatically fetch your AWS API Gateway URL and update `.env.local`:

1. **setup-env.js** - Node.js (Recommended - works on all platforms)
2. **setup-env.sh** - Bash (Mac/Linux)
3. **setup-env.ps1** - PowerShell (Windows)

## Prerequisites

- AWS CLI installed and configured
- AWS credentials set up
- CloudFormation stack deployed (`gitsight-dev`)

## Option 1: Node.js (Recommended - All Platforms)

### Usage

```bash
node setup-env.js
```

### What It Does

1. ✅ Checks if AWS CLI is installed
2. ✅ Verifies AWS credentials are configured
3. ✅ Fetches API Gateway URL from AWS
4. ✅ Creates or updates `.env.local` with `VITE_API_GATEWAY_URL`
5. ✅ Displays the updated `.env.local` file

### Example Output

```
🚀 GitSight Environment Setup
==============================

✅ AWS CLI found: aws-cli/2.13.0 Python/3.11.0
✅ AWS credentials configured (Account: 123456789012)

📡 Fetching API Gateway URL...
✅ API Gateway URL: https://abc123xyz.execute-api.us-east-1.amazonaws.com

📝 Updating .env.local...
✅ Created .env.local

📋 Current .env.local:
---
VITE_API_GATEWAY_URL=https://abc123xyz.execute-api.us-east-1.amazonaws.com
---

✅ Setup complete!

Next steps:
1. Run: npm run dev
2. Go to http://localhost:8080/analyze
3. Enter a GitHub username and click Analyze
```

## Option 2: Bash (Mac/Linux)

### Make Script Executable

```bash
chmod +x setup-env.sh
```

### Usage

```bash
./setup-env.sh
```

### What It Does

Same as Node.js version, but using bash commands.

## Option 3: PowerShell (Windows)

### Allow Script Execution

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Usage

```powershell
.\setup-env.ps1
```

### What It Does

Same as Node.js version, but using PowerShell commands.

## Troubleshooting

### "AWS CLI is not installed"

**Solution**: Install AWS CLI
```bash
# Mac
brew install awscli

# Windows
choco install awscli

# Linux
sudo apt-get install awscli
```

### "AWS credentials are not configured"

**Solution**: Configure AWS credentials
```bash
aws configure
# Enter your AWS Access Key ID
# Enter your AWS Secret Access Key
# Enter default region (us-east-1)
# Enter default output format (json)
```

### "No API Gateway found"

**Solution**: Deploy CloudFormation stack first
```bash
cd backend
aws cloudformation create-stack \
  --stack-name gitsight-dev \
  --template-body file://infrastructure.yml \
  --parameters ParameterKey=Environment,ParameterValue=dev \
  --capabilities CAPABILITY_NAMED_IAM
```

### "Error updating .env.local"

**Solution**: Check file permissions
```bash
# Make sure you have write permissions in the project directory
ls -la .env.local
chmod 644 .env.local
```

## Manual Alternative

If scripts don't work, you can do it manually:

### Step 1: Get API Gateway URL
```bash
aws apigatewayv2 get-apis --query 'Items[0].ApiEndpoint' --output text
```

### Step 2: Create .env.local
```bash
echo "VITE_API_GATEWAY_URL=https://your-api-id.execute-api.us-east-1.amazonaws.com" > .env.local
```

### Step 3: Verify
```bash
cat .env.local
```

## What Gets Updated

### Before
```
# .env.local doesn't exist or doesn't have VITE_API_GATEWAY_URL
```

### After
```
VITE_API_GATEWAY_URL=https://abc123xyz.execute-api.us-east-1.amazonaws.com
```

## Next Steps After Setup

1. **Start development server**
   ```bash
   npm run dev
   ```

2. **Test Analyze page**
   - Go to http://localhost:8080/analyze
   - Enter GitHub username (e.g., "octocat")
   - Click Analyze
   - Should show metrics and chart

3. **Test DevOps page**
   - Go to http://localhost:8080/devops
   - Should show pipeline stages and recent builds

## Vercel Deployment

After local setup works, deploy to Vercel:

### Step 1: Get API Gateway URL (if not already done)
```bash
aws apigatewayv2 get-apis --query 'Items[0].ApiEndpoint' --output text
```

### Step 2: Add to Vercel
```bash
vercel env add VITE_API_GATEWAY_URL
# Enter: https://your-api-id.execute-api.us-east-1.amazonaws.com
```

### Step 3: Redeploy
```bash
vercel --prod
```

## Automation

### Add to package.json

You can add the setup script to your `package.json`:

```json
{
  "scripts": {
    "setup-env": "node setup-env.js",
    "dev": "npm run setup-env && vite",
    "build": "vite build"
  }
}
```

Then just run:
```bash
npm run setup-env
```

Or automatically on dev:
```bash
npm run dev
```

## Script Comparison

| Feature | Node.js | Bash | PowerShell |
|---------|---------|------|-----------|
| Windows | ✅ | ❌ | ✅ |
| Mac | ✅ | ✅ | ❌ |
| Linux | ✅ | ✅ | ❌ |
| No Dependencies | ✅ | ✅ | ✅ |
| Recommended | ✅ | - | - |

## Summary

**Recommended**: Use `node setup-env.js` - works on all platforms!

```bash
# One command to set up everything
node setup-env.js
```

That's it! Your `.env.local` will be automatically created with the correct API Gateway URL.
