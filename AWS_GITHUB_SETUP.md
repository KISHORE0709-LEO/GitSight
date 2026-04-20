# AWS Setup Guide for GitSight GitHub Actions Deployment

## Prerequisites
- AWS Account with admin access
- AWS CLI installed locally

## Step 1: Create IAM Role for GitHub Actions

### 1.1 Create Trust Policy (save as `trust-policy.json`)
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::YOUR_AWS_ACCOUNT_ID:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
        },
        "StringLike": {
          "token.actions.githubusercontent.com:sub": "repo:YOUR_GITHUB_USERNAME/GitSight:ref:refs/heads/main"
        }
      }
    }
  ]
}
```

### 1.2 Create Permission Policy (save as `permissions-policy.json`)
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "lambda:UpdateFunctionCode",
        "lambda:GetFunction",
        "lambda:CreateFunction"
      ],
      "Resource": "arn:aws:lambda:us-east-1:YOUR_AWS_ACCOUNT_ID:function:gitsight-*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "ecr:GetAuthorizationToken",
        "ecr:BatchCheckLayerAvailability",
        "ecr:GetDownloadUrlForLayer",
        "ecr:PutImage",
        "ecr:InitiateLayerUpload",
        "ecr:UploadLayerPart",
        "ecr:CompleteLayerUpload"
      ],
      "Resource": "arn:aws:ecr:us-east-1:YOUR_AWS_ACCOUNT_ID:repository/gitsight-*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "ecs:UpdateService",
        "ecs:DescribeServices"
      ],
      "Resource": "arn:aws:ecs:us-east-1:YOUR_AWS_ACCOUNT_ID:service/gitsight-cluster/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "cloudwatch:PutMetricAlarm",
        "cloudwatch:DescribeAlarms"
      ],
      "Resource": "*"
    }
  ]
}
```

## Step 2: Set Up OIDC Provider in AWS

Run these AWS CLI commands:

```bash
# 1. Get your AWS Account ID
aws sts get-caller-identity --query Account --output text

# 2. Create OIDC Provider (run once)
aws iam create-open-id-connect-provider \
  --url https://token.actions.githubusercontent.com \
  --client-id-list sts.amazonaws.com \
  --thumbprint-list 6938fd4d98bab03faadb97b34396831e3780aea1

# 3. Create the IAM role
aws iam create-role \
  --role-name GitHubActionsRole \
  --assume-role-policy-document file://trust-policy.json

# 4. Attach permissions policy
aws iam put-role-policy \
  --role-name GitHubActionsRole \
  --policy-name GitHubActionsPolicy \
  --policy-document file://permissions-policy.json

# 5. Get the role ARN
aws iam get-role --role-name GitHubActionsRole --query 'Role.Arn' --output text
```

## Step 3: Add GitHub Secrets

1. Go to your GitHub repository
2. Settings → Secrets and variables → Actions
3. Add these secrets:

| Secret Name | Value |
|------------|-------|
| `AWS_ROLE_ARN` | The ARN from Step 2 (arn:aws:iam::YOUR_ACCOUNT_ID:role/GitHubActionsRole) |
| `API_GATEWAY_ID` | Your API Gateway ID (optional, for monitoring) |

## Step 4: Create AWS Resources (CloudFormation)

Deploy the infrastructure:

```bash
# 1. Navigate to backend
cd backend

# 2. Deploy CloudFormation stack
aws cloudformation create-stack \
  --stack-name gitsight-dev \
  --template-body file://infrastructure.yml \
  --capabilities CAPABILITY_NAMED_IAM \
  --region us-east-1

# 3. Wait for stack creation
aws cloudformation wait stack-create-complete \
  --stack-name gitsight-dev \
  --region us-east-1

# 4. Get outputs
aws cloudformation describe-stacks \
  --stack-name gitsight-dev \
  --query 'Stacks[0].Outputs' \
  --region us-east-1
```

## Step 5: Create ECR Repository

```bash
# Create ECR repository for Docker images
aws ecr create-repository \
  --repository-name gitsight-worker \
  --region us-east-1
```

## Step 6: Create ECS Cluster (Optional, for workers)

```bash
# Create ECS cluster
aws ecs create-cluster --cluster-name gitsight-cluster --region us-east-1

# Create task definition (you'll need to customize this)
aws ecs register-task-definition \
  --family gitsight-worker \
  --network-mode awsvpc \
  --requires-compatibilities FARGATE \
  --cpu 256 \
  --memory 512 \
  --container-definitions file://task-definition.json
```

## Step 7: Uncomment GitHub Actions Workflow

Edit `.github/workflows/ci-cd.yml` and uncomment the AWS deployment jobs:
- `docker-build`
- `deploy-lambda`
- `deploy-ecs`
- `monitoring`

## Step 8: Push to Main Branch

```bash
git add .
git commit -m "Enable AWS deployment"
git push origin main
```

The GitHub Actions workflow will now:
1. ✅ Run tests and linting
2. ✅ Build Docker image and push to ECR
3. ✅ Deploy Lambda functions
4. ✅ Update ECS service
5. ✅ Enable CloudWatch monitoring

## Troubleshooting

### "Credentials could not be loaded"
- Check that `AWS_ROLE_ARN` secret is set correctly
- Verify OIDC provider is created
- Check trust policy has correct GitHub repo

### "Permission denied" errors
- Verify permissions policy is attached to role
- Check resource ARNs match your AWS account ID

### Lambda deployment fails
- Ensure Lambda functions exist (created by CloudFormation)
- Check function names match in workflow

## Cost Estimate
- Lambda: ~$0.20 per 1M requests
- DynamoDB: ~$1.25 per million writes
- ECR: ~$0.10 per GB stored
- **Total**: ~$5-10/month for moderate usage

## Next Steps
1. Complete all AWS setup steps above
2. Uncomment AWS jobs in workflow
3. Push to main branch
4. Monitor GitHub Actions for successful deployment
5. Check AWS Console to verify resources are created

Need help with any step? Let me know! 🚀
