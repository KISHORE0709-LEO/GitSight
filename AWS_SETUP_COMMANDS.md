# AWS Setup Commands for GitSight

## Step 1: Get Your AWS Account ID
```bash
aws sts get-caller-identity --query Account --output text
```
**Save this ID - you'll need it!**

---

## Step 2: Create OIDC Provider (Run Once)
```bash
aws iam create-open-id-connect-provider \
  --url https://token.actions.githubusercontent.com \
  --client-id-list sts.amazonaws.com \
  --thumbprint-list 6938fd4d98bab03faadb97b34396831e3780aea1
```

---

## Step 3: Create IAM Role for GitHub Actions

Replace `YOUR_AWS_ACCOUNT_ID` and `YOUR_GITHUB_USERNAME` with your actual values:

```bash
aws iam create-role \
  --role-name GitHubActionsRole \
  --assume-role-policy-document '{
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
  }'
```

---

## Step 4: Attach Permissions to Role

Replace `YOUR_AWS_ACCOUNT_ID`:

```bash
aws iam put-role-policy \
  --role-name GitHubActionsRole \
  --policy-name GitHubActionsPolicy \
  --policy-document '{
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
  }'
```

---

## Step 5: Get the Role ARN
```bash
aws iam get-role --role-name GitHubActionsRole --query 'Role.Arn' --output text
```
**Save this ARN - you need it for GitHub!**

---

## Step 6: Create ECR Repository
```bash
aws ecr create-repository \
  --repository-name gitsight-worker \
  --region us-east-1
```

---

## Step 7: Deploy CloudFormation Stack

```bash
cd backend

aws cloudformation create-stack \
  --stack-name gitsight-dev \
  --template-body file://infrastructure.yml \
  --capabilities CAPABILITY_NAMED_IAM \
  --region us-east-1
```

---

## Step 8: Wait for Stack to Complete
```bash
aws cloudformation wait stack-create-complete \
  --stack-name gitsight-dev \
  --region us-east-1
```

---

## Step 9: Get Stack Outputs
```bash
aws cloudformation describe-stacks \
  --stack-name gitsight-dev \
  --query 'Stacks[0].Outputs' \
  --region us-east-1
```

---

## Step 10: Add GitHub Secret

Go to: `https://github.com/YOUR_GITHUB_USERNAME/GitSight/settings/secrets/actions`

Click "New repository secret"

**Name:** `AWS_ROLE_ARN`
**Value:** (paste the ARN from Step 5)

Click "Add secret"

---

## Step 11: Push to GitHub

```bash
git add .
git commit -m "Enable AWS deployment"
git push origin main
```

---

## Done! ✅

Your GitHub Actions will now:
1. Run tests and linting
2. Build Docker image
3. Push to ECR
4. Deploy Lambda functions
5. Update ECS service
6. Enable CloudWatch monitoring

Check GitHub Actions tab to see the deployment progress!

---

## Troubleshooting

### If OIDC Provider already exists:
```bash
# Just continue to Step 3
```

### If Role already exists:
```bash
# Delete and recreate:
aws iam delete-role-policy --role-name GitHubActionsRole --policy-name GitHubActionsPolicy
aws iam delete-role --role-name GitHubActionsRole
# Then run Step 3 again
```

### If Stack already exists:
```bash
# Update instead:
aws cloudformation update-stack \
  --stack-name gitsight-dev \
  --template-body file://infrastructure.yml \
  --capabilities CAPABILITY_NAMED_IAM \
  --region us-east-1
```

### Check Lambda functions were created:
```bash
aws lambda list-functions --region us-east-1 | grep gitsight
```

### Check ECR repository:
```bash
aws ecr describe-repositories --region us-east-1
```

### Check CloudFormation stack status:
```bash
aws cloudformation describe-stacks --stack-name gitsight-dev --region us-east-1
```
