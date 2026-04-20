# ⚡ Quick Start - Auto Setup

## One Command Setup

```bash
node setup-env.js
```

That's it! This will:
1. ✅ Check AWS CLI and credentials
2. ✅ Fetch your API Gateway URL
3. ✅ Create/update `.env.local`
4. ✅ Show you the result

## Then Run

```bash
npm run dev
```

## Test It

1. Go to http://localhost:8080/analyze
2. Enter GitHub username (e.g., "octocat")
3. Click Analyze
4. ✅ Should work!

## If You're on Windows

```powershell
.\setup-env.ps1
```

## If You're on Mac/Linux

```bash
chmod +x setup-env.sh
./setup-env.sh
```

## What Gets Created

**File**: `.env.local`

**Content**:
```
VITE_API_GATEWAY_URL=https://your-api-id.execute-api.us-east-1.amazonaws.com
```

## Troubleshooting

### "AWS CLI not found"
```bash
# Install AWS CLI
brew install awscli  # Mac
choco install awscli # Windows
sudo apt-get install awscli # Linux
```

### "AWS credentials not configured"
```bash
aws configure
# Enter your AWS Access Key ID and Secret Access Key
```

### "No API Gateway found"
```bash
# Deploy CloudFormation stack first
cd backend
aws cloudformation create-stack \
  --stack-name gitsight-dev \
  --template-body file://infrastructure.yml \
  --capabilities CAPABILITY_NAMED_IAM
```

## Done! 🎉

Your `.env.local` is now set up with the correct API Gateway URL.

Start developing:
```bash
npm run dev
```
