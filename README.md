# GitSight - Developer Analytics Platform

A comprehensive developer analytics platform that analyzes GitHub activity and calculates productivity metrics using an event-driven architecture.

## 🚀 Features

- **Developer Analysis**: Enter any GitHub username to analyze their activity
- **Productivity Metrics**: Commits, Merged PRs, Rejected PRs, and calculated score
- **Visual Analytics**: Weekly commit activity charts
- **Event-Driven Architecture**: AWS Lambda, SQS, and DynamoDB
- **Async Processing**: Docker workers for scalable metric calculation
- **Real-time Updates**: Loading states and error handling

## 📋 Quick Links

- **[Quick Start Guide](QUICKSTART.md)** - Get started immediately
- **[Architecture Documentation](ARCHITECTURE.md)** - System design and data flow
- **[Backend Deployment Guide](backend/README.md)** - Full AWS setup
- **[Integration Summary](INTEGRATION_SUMMARY.md)** - What's been integrated

## 🏗️ Architecture

```
Frontend (React) → API Gateway → Lambda (API Handler) → Lambda (Collector) → SQS Queue → Worker (Docker) → DynamoDB
```

**Fully serverless - no Express server needed!**

### Components

1. **Frontend**: React + TypeScript + Tailwind CSS
2. **API Gateway**: AWS HTTP API with CORS
3. **Lambda (API Handler)**: Request validation and routing
4. **Lambda (Collector)**: Fetches GitHub data via REST API
5. **SQS Queue**: Async message processing
6. **Worker Service**: Docker containers for metric calculation
7. **DynamoDB**: Persistent metrics storage

## 🎯 Getting Started

### Frontend Only (Quick Test)

```bash
npm install
npm run dev
```

Visit: http://localhost:8080/analyze

### Full Stack (Production)

1. **Deploy AWS Infrastructure**:
   ```bash
   cd backend
   aws cloudformation create-stack \
     --stack-name gitsight-dev \
     --template-body file://infrastructure.yml \
     --capabilities CAPABILITY_IAM
   ```

2. **Deploy Lambda Functions**:
   ```bash
   # Linux/Mac
   chmod +x deploy-lambdas.sh
   ./deploy-lambdas.sh dev
   
   # Windows
   .\deploy-lambdas.ps1 -Environment dev
   ```

3. **Configure Frontend**:
   ```bash
   # Get API Gateway URL from CloudFormation outputs
   echo "VITE_API_GATEWAY_URL=https://your-api-id.execute-api.us-east-1.amazonaws.com" > .env.local
   ```

4. **Start Worker**:
   ```bash
   cd backend/worker
   docker build -t gitsight-worker .
   docker run -d --env-file ../.env gitsight-worker
   ```

5. **Run Frontend**:
   ```bash
   cd ../..
   npm run dev
   ```

See [backend/README.md](backend/README.md) for detailed instructions.

## 📊 How It Works

1. User enters GitHub username
2. Frontend sends request to API Gateway
3. API Gateway invokes API Handler Lambda
4. API Handler validates user and invokes Collector Lambda
5. Collector fetches commits and PRs from GitHub
6. Collector pushes job to SQS queue
7. Worker processes message and calculates:
   - `score = (commits × 1) + (merged_pr × 5) - (rejected_pr × 2)`
8. Worker stores results in DynamoDB
9. Frontend displays metrics and charts

## 🛠️ Technologies

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- shadcn-ui
- Recharts
- Framer Motion

### Backend
- Node.js 18
- AWS API Gateway
- AWS Lambda
- AWS SQS
- AWS DynamoDB
- Docker

### Infrastructure
- AWS CloudFormation
- Docker Compose
- GitHub REST API

## 📁 Project Structure

```
GitSight/
├── src/
│   ├── pages/
│   │   └── Analyze.tsx          # Main analysis page
│   └── components/
│       └── MetricCard.tsx       # Metric display component
│
├── backend/
│   ├── lambda/                  # AWS Lambda functions
│   │   ├── api-handler.js       # API Gateway handler
│   │   └── collector.js         # GitHub data collector
│   ├── worker/                  # Docker worker service
│   ├── infrastructure.yml       # CloudFormation template
│   └── deploy-lambdas.sh        # Lambda deployment script
│
├── QUICKSTART.md                # Quick start guide
├── ARCHITECTURE.md              # Architecture documentation
└── SERVERLESS_SUMMARY.md        # Serverless benefits
```

## 🧪 Testing

Test the API:
```bash
curl -X POST https://your-api-id.execute-api.us-east-1.amazonaws.com/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"username":"octocat"}'
```

Test with real GitHub users:
- `octocat` - GitHub's mascot
- `torvalds` - Linus Torvalds
- `gaearon` - Dan Abramov

## 🔧 Configuration

Create `.env.local` in project root:
```bash
VITE_API_GATEWAY_URL=https://your-api-id.execute-api.us-east-1.amazonaws.com
```

Create `backend/.env` for worker:
```bash
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
SQS_QUEUE_URL=your_queue_url
DYNAMODB_TABLE=GitSightMetrics-dev
```

## 📈 Metrics Calculated

- **Total Commits**: Last 30 days
- **Merged PRs**: Successfully merged pull requests
- **Rejected PRs**: Closed but not merged PRs
- **Productivity Score**: Weighted calculation
- **Weekly Activity**: Commit distribution by day

## 🚀 Deployment

### Frontend
- Deploy to Vercel, Netlify, or AWS Amplify
- Build: `npm run build`

### Backend
- Lambda: Deploy via CloudFormation
- Worker: Run on ECS Fargate or EC2 with Docker
- API Gateway: Automatically deployed

## 💰 Cost Estimate

- API Gateway: ~$1 per 1M requests
- Lambda: ~$0.20 per 1M requests
- SQS: First 1M requests free
- DynamoDB: ~$1.25 per million writes
- **Total**: <$5/month for moderate usage

**Serverless = Lower costs, no idle servers!**

## 🔒 Security

- Environment variables for credentials
- IAM roles with least privilege
- CORS enabled for API
- Input validation on all endpoints
- GitHub token for rate limit increases

## 📚 Documentation

- [Quick Start](QUICKSTART.md) - Get started fast
- [Architecture](ARCHITECTURE.md) - System design
- [Backend Setup](backend/README.md) - AWS deployment
- [Integration Summary](INTEGRATION_SUMMARY.md) - What's integrated

## 🤝 Contributing

This project was built with Lovable and can be edited via:
- Lovable IDE
- Local development
- GitHub Codespaces

## 📄 License

MIT License

---

## Original Lovable Project Info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID
