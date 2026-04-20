# ✅ Automatic Setup Scripts - Complete

## What Was Created

Three scripts to automatically fetch API Gateway URL and update `.env.local`:

### 1. **setup-env.js** (Recommended)
- **Platform**: Windows, Mac, Linux
- **Requirement**: Node.js (already installed)
- **Command**: `node setup-env.js`

### 2. **setup-env.sh**
- **Platform**: Mac, Linux
- **Requirement**: Bash
- **Command**: `chmod +x setup-env.sh && ./setup-env.sh`

### 3. **setup-env.ps1**
- **Platform**: Windows
- **Requirement**: PowerShell
- **Command**: `.\setup-env.ps1`

## How to Use

### Easiest Way (All Platforms)

```bash
node setup-env.js
```

### What It Does

```
1. Checks AWS CLI is installed
2. Verifies AWS credentials
3. Fetches API Gateway URL from AWS
4. Creates/updates .env.local
5. Shows the result
```

### Example Output

```
🚀 GitSight Environment Setup
==============================

✅ AWS CLI found: aws-cli/2.13.0
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

## Step-by-Step

### Step 1: Run Setup Script
```bash
node setup-env.js
```

### Step 2: Start Development
```bash
npm run dev
```

### Step 3: Test
- Go to http://localhost:8080/analyze
- Enter GitHub username
- Click Analyze
- ✅ Should work!

## What Gets Created

**File**: `.env.local`

**Content**:
```
VITE_API_GATEWAY_URL=https://your-api-id.execute-api.us-east-1.amazonaws.com
```

## Prerequisites

- ✅ AWS CLI installed
- ✅ AWS credentials configured (`aws configure`)
- ✅ CloudFormation stack deployed (`gitsight-dev`)

## Troubleshooting

### AWS CLI Not Found
```bash
# Install AWS CLI
brew install awscli  # Mac
choco install awscli # Windows
sudo apt-get install awscli # Linux
```

### AWS Credentials Not Configured
```bash
aws configure
# Enter your AWS Access Key ID
# Enter your AWS Secret Access Key
# Enter default region (us-east-1)
```

### No API Gateway Found
```bash
# Deploy CloudFormation stack
cd backend
aws cloudformation create-stack \
  --stack-name gitsight-dev \
  --template-body file://infrastructure.yml \
  --capabilities CAPABILITY_NAMED_IAM
```

## Files Created

| File | Purpose |
|------|---------|
| `setup-env.js` | Node.js script (all platforms) |
| `setup-env.sh` | Bash script (Mac/Linux) |
| `setup-env.ps1` | PowerShell script (Windows) |
| `SETUP_ENV_GUIDE.md` | Detailed guide |
| `QUICK_START_SETUP.md` | Quick start |

## Automation

### Add to package.json

```json
{
  "scripts": {
    "setup-env": "node setup-env.js",
    "dev": "npm run setup-env && vite"
  }
}
```

Then just run:
```bash
npm run dev
```

It will automatically set up the environment before starting!

## Manual Alternative

If scripts don't work:

```bash
# Get API Gateway URL
aws apigatewayv2 get-apis --query 'Items[0].ApiEndpoint' --output text

# Create .env.local
echo "VITE_API_GATEWAY_URL=https://your-api-id.execute-api.us-east-1.amazonaws.com" > .env.local

# Verify
cat .env.local
```

## Summary

✅ **Automatic setup** - One command to set everything up
✅ **Cross-platform** - Works on Windows, Mac, Linux
✅ **Error handling** - Checks prerequisites and gives helpful errors
✅ **No manual steps** - Fetches URL automatically from AWS

## Quick Reference

```bash
# Setup (one command)
node setup-env.js

# Develop
npm run dev

# Test
# Go to http://localhost:8080/analyze
# Enter GitHub username
# Click Analyze
```

---

**Status**: ✅ READY
**Next**: Run `node setup-env.js`
