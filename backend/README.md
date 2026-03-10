# GitSight Backend - Serverless Architecture

## Architecture

```
Frontend → API Gateway → Lambda (API Handler) → Lambda (Collector) → SQS → Worker → DynamoDB
```

**Fully serverless, no Express server needed!**

## Quick Deploy

### 1. Deploy Infrastructure
```bash
aws cloudformation create-stack \
  --stack-name gitsight-dev \
  --template-body file://infrastructure.yml \
  --capabilities CAPABILITY_IAM

aws cloudformation wait stack-create-complete --stack-name gitsight-dev
```

### 2. Get API Gateway URL
```bash
aws cloudformation describe-stacks \
  --stack-name gitsight-dev \
  --query 'Stacks[0].Outputs[?OutputKey==`ApiEndpoint`].OutputValue' \
  --output text
```

### 3. Deploy Lambda Functions
```bash
chmod +x deploy-lambdas.sh
./deploy-lambdas.sh dev
```

### 4. Configure Frontend
```bash
# Create .env.local in project root
echo "VITE_API_GATEWAY_URL=https://your-api-id.execute-api.us-east-1.amazonaws.com" > ../.env.local
```

### 5. Start Worker
```bash
cd worker
docker build -t gitsight-worker .
docker run -d --name gitsight-worker --env-file ../.env gitsight-worker
```

### 6. Run Frontend
```bash
cd ../..
npm run dev
```

## Components

### API Gateway
- HTTP API with CORS
- Route: `POST /api/analyze`
- Invokes API Handler Lambda

### Lambda: API Handler
- Validates GitHub username
- Invokes Collector Lambda
- Returns results

### Lambda: Collector
- Fetches GitHub data
- Pushes to SQS queue

### Worker (Docker)
- Polls SQS
- Calculates metrics
- Stores in DynamoDB

## Testing

```bash
curl -X POST https://your-api-id.execute-api.us-east-1.amazonaws.com/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"username":"octocat"}'
```

## Cost
- API Gateway: $1 per million requests
- Lambda: $0.20 per million requests
- SQS: First 1M free
- DynamoDB: ~$1.25 per million writes
- **Total: <$5/month**

## Monitoring
```bash
# API Handler logs
aws logs tail /aws/lambda/gitsight-api-handler-dev --follow

# Collector logs
aws logs tail /aws/lambda/github-collector-dev --follow

# Worker logs
docker logs -f gitsight-worker
```
