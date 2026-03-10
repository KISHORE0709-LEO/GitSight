# GitSight - Serverless Architecture

## System Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                         │
│                                                             │
│  • Username Input                                           │
│  • Loading States                                           │
│  • Metric Display                                           │
│  • Charts                                                   │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ POST /api/analyze
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                  AWS API GATEWAY                            │
│                                                             │
│  • HTTP API with CORS                                       │
│  • Route: POST /api/analyze                                 │
│  • Auto-scaling                                             │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ Invoke
                     ▼
┌─────────────────────────────────────────────────────────────┐
│            LAMBDA: API Handler                              │
│                                                             │
│  • Validate GitHub username                                 │
│  • Invoke Collector Lambda                                  │
│  • Return response                                          │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ Invoke
                     ▼
┌─────────────────────────────────────────────────────────────┐
│            LAMBDA: Collector                                │
│                                                             │
│  • Fetch GitHub commits                                     │
│  • Fetch GitHub PRs                                         │
│  • Push to SQS                                              │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ SendMessage
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                   AWS SQS QUEUE                             │
│                                                             │
│  • Async processing                                         │
│  • Decoupling                                               │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ ReceiveMessage
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              WORKER (Docker)                                │
│                                                             │
│  • Poll SQS                                                 │
│  • Calculate metrics                                        │
│  • Store in DynamoDB                                        │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ PutItem
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                 AWS DYNAMODB                                │
│                                                             │
│  • Metrics storage                                          │
│  • TTL enabled                                              │
└─────────────────────────────────────────────────────────────┘
```

## Components

| Component | Type | Purpose |
|-----------|------|---------|
| Frontend | React SPA | User interface |
| API Gateway | AWS HTTP API | Request routing |
| API Handler | Lambda | Request validation |
| Collector | Lambda | GitHub data fetching |
| SQS Queue | AWS SQS | Async messaging |
| Worker | Docker | Metrics calculation |
| DynamoDB | AWS NoSQL | Data storage |

## Data Flow

1. User enters username → Frontend
2. Frontend → API Gateway (`POST /api/analyze`)
3. API Gateway → Lambda (API Handler)
4. API Handler validates user → GitHub API
5. API Handler → Lambda (Collector)
6. Collector fetches data → GitHub API
7. Collector → SQS Queue
8. Worker polls → SQS Queue
9. Worker calculates metrics
10. Worker → DynamoDB
11. Results → Frontend

## Serverless Benefits

- ✅ **No servers to manage**
- ✅ **Auto-scaling** (API Gateway + Lambda)
- ✅ **Pay per request** (no idle costs)
- ✅ **High availability** (AWS managed)
- ✅ **Global edge** (API Gateway)
- ✅ **Built-in monitoring** (CloudWatch)

## Cost Breakdown

| Service | Pricing | Monthly (1000 users) |
|---------|---------|---------------------|
| API Gateway | $1/million | $0.10 |
| Lambda (API) | $0.20/million | $0.02 |
| Lambda (Collector) | $0.20/million | $0.02 |
| SQS | First 1M free | $0.00 |
| DynamoDB | $1.25/million writes | $0.13 |
| **Total** | | **<$1/month** |

## Scalability

- API Gateway: Handles 10,000 requests/second
- Lambda: Auto-scales to 1000 concurrent executions
- SQS: Unlimited throughput
- DynamoDB: On-demand auto-scaling
- Worker: Scale containers horizontally

## Security

- API Gateway: HTTPS only, CORS configured
- Lambda: IAM roles, least privilege
- SQS: Encrypted at rest
- DynamoDB: Encrypted at rest
- No credentials in code
