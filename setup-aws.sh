#!/bin/bash

# GitSight AWS Setup Script
# This script automates AWS setup for GitHub Actions deployment

set -e

echo "🚀 GitSight AWS Setup"
echo "===================="
echo ""

# Get AWS Account ID
echo "📋 Getting AWS Account ID..."
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
echo "✅ AWS Account ID: $AWS_ACCOUNT_ID"
echo ""

# Get GitHub info
echo "📝 Enter your GitHub information:"
read -p "GitHub Username: " GITHUB_USERNAME
read -p "GitHub Repository (default: GitSight): " GITHUB_REPO
GITHUB_REPO=${GITHUB_REPO:-GitSight}
echo ""

# Create trust policy
echo "🔐 Creating trust policy..."
cat > trust-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::${AWS_ACCOUNT_ID}:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
        },
        "StringLike": {
          "token.actions.githubusercontent.com:sub": "repo:${GITHUB_USERNAME}/${GITHUB_REPO}:ref:refs/heads/main"
        }
      }
    }
  ]
}
EOF
echo "✅ Trust policy created"
echo ""

# Create permissions policy
echo "🔑 Creating permissions policy..."
cat > permissions-policy.json << EOF
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
      "Resource": "arn:aws:lambda:us-east-1:${AWS_ACCOUNT_ID}:function:gitsight-*"
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
      "Resource": "arn:aws:ecr:us-east-1:${AWS_ACCOUNT_ID}:repository/gitsight-*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "ecs:UpdateService",
        "ecs:DescribeServices"
      ],
      "Resource": "arn:aws:ecs:us-east-1:${AWS_ACCOUNT_ID}:service/gitsight-cluster/*"
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
EOF
echo "✅ Permissions policy created"
echo ""

# Create OIDC Provider
echo "🔗 Creating OIDC Provider..."
aws iam create-open-id-connect-provider \
  --url https://token.actions.githubusercontent.com \
  --client-id-list sts.amazonaws.com \
  --thumbprint-list 6938fd4d98bab03faadb97b34396831e3780aea1 2>/dev/null || echo "⚠️  OIDC Provider already exists"
echo "✅ OIDC Provider ready"
echo ""

# Create IAM Role
echo "👤 Creating IAM Role..."
aws iam create-role \
  --role-name GitHubActionsRole \
  --assume-role-policy-document file://trust-policy.json 2>/dev/null || echo "⚠️  Role already exists"
echo "✅ IAM Role created"
echo ""

# Attach permissions
echo "📌 Attaching permissions..."
aws iam put-role-policy \
  --role-name GitHubActionsRole \
  --policy-name GitHubActionsPolicy \
  --policy-document file://permissions-policy.json
echo "✅ Permissions attached"
echo ""

# Get role ARN
echo "🔍 Getting Role ARN..."
ROLE_ARN=$(aws iam get-role --role-name GitHubActionsRole --query 'Role.Arn' --output text)
echo "✅ Role ARN: $ROLE_ARN"
echo ""

# Create ECR Repository
echo "🐳 Creating ECR Repository..."
aws ecr create-repository \
  --repository-name gitsight-worker \
  --region us-east-1 2>/dev/null || echo "⚠️  Repository already exists"
echo "✅ ECR Repository ready"
echo ""

# Deploy CloudFormation Stack
echo "🏗️  Deploying CloudFormation Stack..."
cd backend
aws cloudformation create-stack \
  --stack-name gitsight-dev \
  --template-body file://infrastructure.yml \
  --capabilities CAPABILITY_NAMED_IAM \
  --region us-east-1 2>/dev/null || echo "⚠️  Stack already exists"
echo "✅ CloudFormation Stack deployed"
echo ""

# Wait for stack
echo "⏳ Waiting for stack creation (this may take a few minutes)..."
aws cloudformation wait stack-create-complete \
  --stack-name gitsight-dev \
  --region us-east-1 2>/dev/null || echo "⚠️  Stack already complete"
echo "✅ Stack ready"
echo ""

# Get stack outputs
echo "📊 Stack Outputs:"
aws cloudformation describe-stacks \
  --stack-name gitsight-dev \
  --query 'Stacks[0].Outputs' \
  --region us-east-1 || echo "⚠️  Could not retrieve outputs"
echo ""

# Summary
echo "✨ Setup Complete!"
echo "=================="
echo ""
echo "📋 Next Steps:"
echo "1. Go to GitHub: https://github.com/$GITHUB_USERNAME/$GITHUB_REPO/settings/secrets/actions"
echo "2. Add secret: AWS_ROLE_ARN = $ROLE_ARN"
echo "3. (Optional) Add secret: API_GATEWAY_ID = <your-api-gateway-id>"
echo "4. Push to main branch to trigger deployment"
echo ""
echo "🔗 AWS Role ARN (copy this):"
echo "$ROLE_ARN"
echo ""
echo "📚 For more info, see: AWS_GITHUB_SETUP.md"
echo ""

# Cleanup
rm -f trust-policy.json permissions-policy.json
cd ..

echo "✅ Done!"
