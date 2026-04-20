# DevOps CI/CD Pipeline Setup Guide

## Overview

The GitSight platform uses GitHub Actions for automated CI/CD with the following stages:
- **Test Results**: Unit tests, linting, and frontend build
- **Docker Image Build**: Build and push worker container to AWS ECR
- **AWS Deployment**: Update Lambda functions and ECS services
- **Monitoring Activation**: Enable CloudWatch alarms and incident monitoring

## Prerequisites

- GitHub repository with admin access
- AWS account with appropriate permissions
- GitHub token with repo access
- AWS IAM role for GitHub Actions (OIDC)

## Setup Instructions

### 1. Configure GitHub Secrets

Add the following secrets to your GitHub repository (Settings → Secrets and variables → Actions):

```
AWS_ROLE_ARN: arn:aws:iam::ACCOUNT_ID:role/GitHubActionsRole
API_GATEWAY_ID: your-api-gateway-id
```

### 2. Create AWS IAM Role for GitHub Actions

Create an IAM role with OIDC trust relationship:

```bash
aws iam create-role \
  --role-name GitHubActionsRole \
  --assume-role-policy-document '{
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Principal": {
          "Federated": "arn:aws:iam::ACCOUNT_ID:oidc-provider/token.actions.githubusercontent.com"
        },
        "Action": "sts:AssumeRoleWithWebIdentity",
        "Condition": {
          "StringEquals": {
            "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
          },
          "StringLike": {
            "token.actions.githubusercontent.com:sub": "repo:YOUR_ORG/GitSight:*"
          }
        }
      }
    ]
  }'
```

Attach policies:

```bash
aws iam attach-role-policy \
  --role-name GitHubActionsRole \
  --policy-arn arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryPowerUser

aws iam attach-role-policy \
  --role-name GitHubActionsRole \
  --policy-arn arn:aws:iam::aws:policy/AWSLambda_FullAccess

aws iam attach-role-policy \
  --role-name GitHubActionsRole \
  --policy-arn arn:aws:iam::aws:policy/AmazonECS_FullAccess

aws iam attach-role-policy \
  --role-name GitHubActionsRole \
  --policy-arn arn:aws:iam::aws:policy/CloudWatchFullAccess
```

### 3. Deploy Infrastructure

```bash
cd backend

aws cloudformation create-stack \
  --stack-name gitsight-dev \
  --template-body file://infrastructure.yml \
  --parameters ParameterKey=Environment,ParameterValue=dev \
  --capabilities CAPABILITY_NAMED_IAM
```

### 4. Configure GitHub Actions Workflow

The workflow file is located at `.github/workflows/ci-cd.yml` and includes:

- **Test Job**: Runs on all pushes and PRs
- **Docker Build Job**: Builds and pushes to ECR (main branch only)
- **Lambda Deploy Job**: Updates Lambda functions (main branch only)
- **ECS Deploy Job**: Updates worker services (main branch only)
- **Monitoring Job**: Enables CloudWatch alarms (main branch only)

### 5. Monitor Pipeline Execution

View pipeline status in the DevOps page:
- Navigate to `/devops` in the GitSight frontend
- Real-time build status from GitHub Actions
- Pipeline stage visualization
- Recent build history with duration and timestamps

## Pipeline Stages

### Developer Push
- Developer commits and pushes code to GitHub
- Triggers GitHub Actions workflow

### CI/CD Execution
- GitHub Actions runner starts
- Checks out code and sets up environment

### Test Results
- Runs `npm test` for unit tests
- Runs `npm run lint` for code quality
- Builds frontend with `npm run build`

### Docker Image Build
- Builds Docker image for worker service
- Tags with commit SHA and `latest`
- Pushes to AWS ECR

### AWS Deployment
- Packages Lambda functions
- Updates Lambda function code
- Updates ECS service with new container image

### Monitoring Activation
- Creates CloudWatch alarms for Lambda errors
- Triggers incident monitoring check
- Enables real-time observability

## Environment Variables

Set these in `backend/.env` for local testing:

```bash
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
GITHUB_OWNER=your-org
GITHUB_REPO=GitSight
GITHUB_TOKEN=your_github_token
```

## Troubleshooting

### Pipeline Status Not Updating

1. Verify GitHub token has `repo` scope
2. Check Lambda function environment variables
3. Ensure API Gateway route is correctly configured

### Docker Build Fails

1. Verify ECR repository exists: `aws ecr describe-repositories --repository-names gitsight-worker`
2. Check IAM permissions for ECR push
3. Verify Dockerfile is in `backend/worker/`

### Lambda Deployment Fails

1. Verify Lambda functions exist in AWS
2. Check IAM role has `lambda:UpdateFunctionCode` permission
3. Ensure zip files are created correctly

### ECS Update Fails

1. Verify ECS cluster and service exist
2. Check IAM role has `ecs:UpdateService` permission
3. Ensure task definition is registered

## Monitoring

Access the DevOps dashboard to:
- View real-time pipeline execution
- Check build history and status
- Monitor deployment environment
- Track pipeline configuration

## Cost Optimization

- GitHub Actions: Free for public repos, ~$0.008/minute for private
- AWS Lambda: First 1M requests free, then $0.20 per 1M
- ECR: $0.10 per GB stored, $0.09 per GB transferred
- CloudWatch: $0.30 per custom metric

**Estimated monthly cost**: <$10 for moderate usage

## Next Steps

1. Push code to main branch to trigger pipeline
2. Monitor execution in GitHub Actions tab
3. View results in GitSight DevOps page
4. Adjust workflow as needed for your requirements
