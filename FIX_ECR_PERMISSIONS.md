# Fix ECR Permissions - Run This Command

# Replace YOUR_AWS_ACCOUNT_ID with your actual AWS Account ID

aws iam put-role-policy \
  --role-name GitHubActionsRole \
  --policy-name GitHubActionsPolicy \
  --policy-document '{
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Action": [
          "ecr:GetAuthorizationToken"
        ],
        "Resource": "*"
      },
      {
        "Effect": "Allow",
        "Action": [
          "ecr:BatchCheckLayerAvailability",
          "ecr:GetDownloadUrlForLayer",
          "ecr:PutImage",
          "ecr:InitiateLayerUpload",
          "ecr:UploadLayerPart",
          "ecr:CompleteLayerUpload",
          "ecr:DescribeRepositories",
          "ecr:ListImages"
        ],
        "Resource": "arn:aws:ecr:us-east-1:YOUR_AWS_ACCOUNT_ID:repository/gitsight-*"
      },
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
