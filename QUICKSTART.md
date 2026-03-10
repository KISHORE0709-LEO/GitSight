# GitSight - Serverless Quick Start

## ✅ What's Different

**No Express server!** Pure serverless architecture:
- API Gateway handles HTTP requests
- Lambda functions process logic
- Worker containers process queue
- DynamoDB stores data

## 🚀 Deploy in 5 Steps

### Step 1: Deploy AWS Infrastructure
```bash
cd backend
aws cloudformation create-stack \
  --stack-name gitsight-dev \
  --template-body file://infrastructure.yml \
  --capabilities CAPABILITY_IAM

# Wait 5-10 minutes
aws cloudformation wait stack-create-complete --stack-name gitsight-dev
```

### Step 2: Get API Gateway URL
```bash
aws cloudformation describe-stacks \
  --stack-name gitsight-dev \
  --query 'Stacks[0].Outputs[?OutputKey==`ApiEndpoint`].OutputValue' \
  --output text
```

Copy the URL (e.g., `https://abc123.execute-api.us-east-1.amazonaws.com`)

### Step 3: Deploy Lambda Functions
```bash
chmod +x deploy-lambdas.sh
./deploy-lambdas.sh dev
```

### Step 4: Configure Environment
```bash
# Create .env for worker
cp .env.example .env
# Edit .env with AWS credentials and SQS/DynamoDB URLs

# Create .env.local for frontend
cd ..
echo "VITE_API_GATEWAY_URL=https://your-api-id.execute-api.us-east-1.amazonaws.com" > .env.local
```

### Step 5: Start Services
```bash
# Start worker
cd backend/worker
docker build -t gitsight-worker .
docker run -d --name gitsight-worker --env-file ../.env gitsight-worker

# Start frontend
cd ../..
npm run dev
```

Visit: http://localhost:8080/analyze

## 🧪 Test

```bash
curl -X POST https://your-api-id.execute-api.us-east-1.amazonaws.com/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"username":"octocat"}'
```

## 📊 Architecture

```
User → Frontend → API Gateway → Lambda (API Handler)
                                      ↓
                              Lambda (Collector)
                                      ↓
                                  SQS Queue
                                      ↓
                              Worker (Docker)
                                      ↓
                                  DynamoDB
```

## 💰 Cost

- API Gateway: $1/million requests
- Lambda: $0.20/million requests  
- SQS: First 1M free
- DynamoDB: ~$1.25/million writes
- **Total: <$5/month**

## 🔍 Monitor

```bash
# API logs
aws logs tail /aws/lambda/gitsight-api-handler-dev --follow

# Collector logs
aws logs tail /aws/lambda/github-collector-dev --follow

# Worker logs
docker logs -f gitsight-worker
```

## ✨ Benefits

- ✅ No server to manage
- ✅ Auto-scaling
- ✅ Pay per request
- ✅ High availability
- ✅ Cloud-native
