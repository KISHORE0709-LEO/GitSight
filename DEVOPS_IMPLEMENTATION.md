# GitSight DevOps Implementation Summary

## Overview

The GitSight platform now includes a comprehensive CI/CD pipeline monitoring dashboard that provides real-time visibility into automated build, test, and deployment workflows. The DevOps page displays live pipeline execution data from GitHub Actions and AWS services.

## What Was Implemented

### 1. Frontend DevOps Page (`src/pages/DevOps.tsx`)

**Features:**
- Real-time pipeline status fetching from backend API
- Visual pipeline stage display (6 stages)
- Recent builds list with status, branch, duration, and timestamps
- Links to GitHub Actions workflow runs
- Pipeline configuration display
- Deployment environment information
- Auto-refresh every 10 seconds
- Error handling and loading states

**Pipeline Stages:**
1. Developer Push - Code pushed to GitHub
2. CI/CD Execution - GitHub Actions triggered
3. Test Results - Unit & integration tests
4. Docker Image Build - Container image build
5. AWS Deployment - Push to ECR & update Lambda/ECS
6. Monitoring Activation - Enable real-time monitoring

### 2. Backend Pipeline Lambda (`backend/lambda/pipeline.js`)

**Functionality:**
- Fetches real GitHub Actions workflow runs via GitHub API
- Maps workflow data to build objects with:
  - Build ID and name
  - Branch name
  - Status (success, failure, in_progress)
  - Duration in seconds
  - Timestamp
  - GitHub Actions URL
- Determines pipeline stage status based on latest build
- Returns structured JSON response

**API Endpoint:**
```
GET /pipeline/status
```

**Response:**
```json
{
  "builds": [
    {
      "id": "1234567890",
      "name": "GitSight CI/CD",
      "branch": "main",
      "status": "success",
      "duration": 245,
      "timestamp": "2024-01-15T10:30:00Z",
      "url": "https://github.com/org/repo/actions/runs/1234567890"
    }
  ],
  "stages": [
    {
      "name": "Developer Push",
      "description": "Code pushed to GitHub",
      "status": "success"
    }
  ],
  "lastUpdated": "2024-01-15T10:35:00Z"
}
```

### 3. GitHub Actions Workflow (`.github/workflows/ci-cd.yml`)

**Jobs:**
- **test**: Runs on all pushes and PRs
  - Setup Node.js 18
  - Install dependencies
  - Run linter
  - Run unit tests
  - Build frontend

- **docker-build**: Runs on main branch after tests pass
  - Configure AWS credentials via OIDC
  - Login to Amazon ECR
  - Build Docker image
  - Push to ECR with SHA and latest tags

- **deploy-lambda**: Runs on main branch after docker-build
  - Package Lambda functions
  - Update function code for:
    - api-handler
    - collector
    - metrics
    - pipeline

- **deploy-ecs**: Runs on main branch after docker-build
  - Update ECS service with force-new-deployment

- **monitoring**: Runs on main branch after deployments
  - Create CloudWatch alarms
  - Trigger incident monitoring

### 4. CloudFormation Infrastructure Updates

**New Resources:**
- `PipelineIntegration`: API Gateway integration for pipeline Lambda
- `PipelineRoute`: GET /pipeline/status route
- `PipelineFunction`: Lambda function for pipeline status
- `PipelineInvokePermission`: Permission for API Gateway to invoke pipeline Lambda

**Environment Variables:**
- `GITHUB_OWNER`: GitHub organization/owner
- `GITHUB_REPO`: GitHub repository name
- `GITHUB_TOKEN`: GitHub personal access token (optional, for higher rate limits)

### 5. Documentation

**Files Created:**
- `DEVOPS_SETUP.md`: Complete setup guide with prerequisites and troubleshooting
- `.github/ENVIRONMENTS.md`: GitHub Actions environment configuration
- This summary document

## How It Works

### Data Flow

```
1. Developer pushes code to GitHub
   ↓
2. GitHub Actions workflow triggers
   ↓
3. Tests run, Docker image builds, Lambda/ECS deploy
   ↓
4. Frontend DevOps page calls /pipeline/status endpoint
   ↓
5. Pipeline Lambda fetches GitHub Actions workflow runs
   ↓
6. Returns structured build data and pipeline stages
   ↓
7. Frontend displays real-time pipeline status
```

### Real-Time Updates

- Frontend polls `/pipeline/status` every 10 seconds
- Displays latest 10 workflow runs
- Shows current pipeline stage status
- Updates build list with latest execution data
- Handles errors gracefully with fallback UI

## Configuration

### Environment Variables

**Frontend (.env.local):**
```
VITE_API_GATEWAY_URL=https://your-api-id.execute-api.us-east-1.amazonaws.com
```

**Backend (backend/.env):**
```
AWS_REGION=us-east-1
GITHUB_OWNER=your-org
GITHUB_REPO=GitSight
GITHUB_TOKEN=your_github_token (optional)
```

### GitHub Secrets

Add to repository Settings → Secrets and variables → Actions:
```
AWS_ROLE_ARN=arn:aws:iam::ACCOUNT_ID:role/GitHubActionsRole
API_GATEWAY_ID=your-api-gateway-id
```

## Deployment Steps

### 1. Deploy Infrastructure

```bash
cd backend
aws cloudformation create-stack \
  --stack-name gitsight-dev \
  --template-body file://infrastructure.yml \
  --parameters ParameterKey=Environment,ParameterValue=dev \
  --capabilities CAPABILITY_NAMED_IAM
```

### 2. Deploy Lambda Functions

```bash
cd backend/lambda
npm install
zip -r pipeline.zip pipeline.js node_modules/
aws lambda update-function-code \
  --function-name gitsight-pipeline-dev \
  --zip-file fileb://pipeline.zip
```

### 3. Configure GitHub Actions

- Add AWS_ROLE_ARN and API_GATEWAY_ID secrets
- Ensure OIDC provider is configured in AWS
- Push code to main branch to trigger workflow

### 4. Access DevOps Page

Navigate to `http://localhost:8080/devops` to view the pipeline dashboard.

## Features

### Pipeline Visualization
- 6-stage pipeline with status indicators
- Color-coded status (success, failed, running, pending)
- Animated transitions
- Real-time updates

### Build History
- Recent 10 builds displayed
- Branch name and commit ID
- Build duration
- Execution timestamp
- Direct link to GitHub Actions run
- Status icons with animations

### Pipeline Configuration
- YAML workflow configuration displayed
- Shows all pipeline jobs and steps
- Helps understand automation flow

### Deployment Environment
- AWS Region
- ECR Repository
- Lambda Functions
- ECS Service
- Provides infrastructure context

## Monitoring & Observability

### CloudWatch Integration
- Lambda error alarms
- Execution duration metrics
- Failure rate tracking
- Custom metrics

### Incident Management
- Automatic incident creation on deployment failures
- Real-time alerts
- Deployment status tracking

### Logs
- GitHub Actions logs
- Lambda execution logs
- CloudFormation events
- All accessible via AWS Console

## Cost Estimation

- **GitHub Actions**: Free for public repos, ~$0.008/min for private
- **AWS Lambda**: First 1M requests free, then $0.20/1M
- **ECR**: $0.10/GB stored, $0.09/GB transferred
- **CloudWatch**: $0.30 per custom metric

**Total estimated cost**: <$10/month for moderate usage

## Troubleshooting

### Pipeline Status Not Updating
1. Check GitHub token has `repo` scope
2. Verify Lambda environment variables
3. Ensure API Gateway route is configured

### Docker Build Fails
1. Verify ECR repository exists
2. Check IAM permissions
3. Ensure Dockerfile is in `backend/worker/`

### Lambda Deployment Fails
1. Verify Lambda functions exist
2. Check IAM role permissions
3. Ensure zip files are created

### ECS Update Fails
1. Verify ECS cluster and service exist
2. Check IAM permissions
3. Ensure task definition is registered

## Next Steps

1. **Deploy Infrastructure**: Run CloudFormation stack
2. **Configure GitHub**: Add secrets and OIDC provider
3. **Push Code**: Trigger workflow on main branch
4. **Monitor**: View pipeline in DevOps page
5. **Optimize**: Adjust workflow based on needs

## Architecture Diagram

```
GitHub Repository
    ↓
GitHub Actions Workflow
    ├─ Test Job
    ├─ Docker Build Job
    ├─ Lambda Deploy Job
    ├─ ECS Deploy Job
    └─ Monitoring Job
    ↓
AWS Services
    ├─ ECR (Container Registry)
    ├─ Lambda (API Handler, Collector, Metrics, Pipeline)
    ├─ ECS (Worker Service)
    ├─ CloudWatch (Monitoring)
    └─ DynamoDB (Metrics Storage)
    ↓
Frontend DevOps Page
    ├─ Pipeline Status API
    ├─ Build History
    ├─ Stage Visualization
    └─ Environment Info
```

## Security Considerations

- OIDC authentication (no long-lived credentials)
- IAM roles with least privilege
- GitHub token stored as secret
- CORS enabled for API Gateway
- Input validation on all endpoints
- Audit logging enabled

## Performance Optimization

- 10-second refresh interval (configurable)
- Efficient GitHub API queries
- Caching of pipeline stages
- Minimal payload size
- Error handling prevents UI blocking

## Future Enhancements

- Webhook-based real-time updates (instead of polling)
- Deployment rollback capability
- Custom pipeline stages
- Build artifact storage
- Performance metrics dashboard
- Deployment history analytics
- Integration with Slack/Teams notifications
