# DevOps Quick Reference

## Accessing the DevOps Dashboard

Navigate to: `http://localhost:8080/devops`

## What You'll See

### Pipeline Stages (6 stages)
1. **Developer Push** - Code committed and pushed to GitHub
2. **CI/CD Execution** - GitHub Actions workflow triggered
3. **Test Results** - Unit tests, linting, and build verification
4. **Docker Image Build** - Container image created and tagged
5. **AWS Deployment** - Lambda and ECS services updated
6. **Monitoring Activation** - CloudWatch alarms and incident monitoring enabled

### Recent Builds
- Latest 10 workflow runs from GitHub Actions
- Shows branch, status, duration, and timestamp
- Click the external link icon to view full GitHub Actions run

### Pipeline Configuration
- YAML workflow definition
- Shows all jobs and steps
- Reference for understanding automation

### Deployment Environment
- AWS Region: us-east-1
- ECR Repository: gitsight-worker
- Lambda Functions: api-handler, collector, metrics, pipeline
- ECS Service: gitsight-worker-service

## How to Trigger a Deployment

### Option 1: Push to Main Branch
```bash
git add .
git commit -m "Your changes"
git push origin main
```

This triggers:
- Tests (all branches)
- Docker build (main only)
- Lambda deployment (main only)
- ECS deployment (main only)
- Monitoring activation (main only)

### Option 2: Create a Pull Request
```bash
git checkout -b feature/your-feature
git add .
git commit -m "Your changes"
git push origin feature/your-feature
```

Then create PR to main. This triggers:
- Tests only (no deployment)

## Monitoring Pipeline Execution

### In GitHub
1. Go to repository → Actions tab
2. Click on the workflow run
3. View logs for each job

### In GitSight DevOps Page
1. Navigate to `/devops`
2. Check "Recent Builds" section
3. Click external link to view GitHub Actions run
4. Page auto-refreshes every 10 seconds

### In AWS Console
1. CloudFormation → Stacks → gitsight-dev
2. Lambda → Functions → gitsight-pipeline-dev
3. CloudWatch → Logs → /aws/lambda/gitsight-pipeline-dev

## Common Issues & Solutions

### Build Fails at Test Stage
**Problem**: `npm test` fails
**Solution**:
```bash
npm install
npm test
# Fix failing tests locally before pushing
```

### Docker Build Fails
**Problem**: Docker image build fails
**Solution**:
```bash
cd backend/worker
docker build -t gitsight-worker .
# Fix Dockerfile issues
```

### Lambda Deployment Fails
**Problem**: Lambda function update fails
**Solution**:
```bash
# Verify function exists
aws lambda list-functions --query 'Functions[?contains(FunctionName, `gitsight`)]'

# Check IAM permissions
aws iam get-role --role-name GitHubActionsRole
```

### Pipeline Status Not Updating
**Problem**: DevOps page shows no builds
**Solution**:
1. Check GitHub token has `repo` scope
2. Verify Lambda environment variables:
   ```bash
   aws lambda get-function-configuration \
     --function-name gitsight-pipeline-dev
   ```
3. Check API Gateway route:
   ```bash
   aws apigatewayv2 get-routes \
     --api-id your-api-id
   ```

## Environment Variables

### Frontend (.env.local)
```
VITE_API_GATEWAY_URL=https://your-api-id.execute-api.us-east-1.amazonaws.com
```

### Backend (backend/.env)
```
AWS_REGION=us-east-1
GITHUB_OWNER=your-org
GITHUB_REPO=GitSight
GITHUB_TOKEN=your_github_token
```

### GitHub Secrets
```
AWS_ROLE_ARN=arn:aws:iam::ACCOUNT_ID:role/GitHubActionsRole
API_GATEWAY_ID=your-api-gateway-id
```

## Useful Commands

### View Pipeline Status
```bash
curl https://your-api-id.execute-api.us-east-1.amazonaws.com/pipeline/status
```

### Deploy Lambda Function
```bash
cd backend/lambda
npm install
zip -r pipeline.zip pipeline.js node_modules/
aws lambda update-function-code \
  --function-name gitsight-pipeline-dev \
  --zip-file fileb://pipeline.zip
```

### View Lambda Logs
```bash
aws logs tail /aws/lambda/gitsight-pipeline-dev --follow
```

### Check GitHub Actions Workflow
```bash
gh run list --repo your-org/GitSight
gh run view <run-id> --repo your-org/GitSight
```

### Trigger Manual Workflow (if configured)
```bash
gh workflow run ci-cd.yml --repo your-org/GitSight
```

## Performance Tips

- Keep test suite fast (<5 minutes)
- Optimize Docker image size
- Use caching in GitHub Actions
- Monitor Lambda execution time
- Check CloudWatch metrics regularly

## Security Reminders

- Never commit secrets to repository
- Use GitHub Secrets for sensitive data
- Rotate GitHub tokens regularly
- Review IAM permissions quarterly
- Enable audit logging
- Use OIDC for AWS authentication

## Documentation Links

- [Full Setup Guide](DEVOPS_SETUP.md)
- [Implementation Details](DEVOPS_IMPLEMENTATION.md)
- [GitHub Environments](/.github/ENVIRONMENTS.md)
- [GitHub Actions Workflow](/.github/workflows/ci-cd.yml)
- [Pipeline Lambda](backend/lambda/pipeline.js)
- [Infrastructure Template](backend/infrastructure.yml)

## Support

For issues or questions:
1. Check troubleshooting section above
2. Review GitHub Actions logs
3. Check AWS CloudWatch logs
4. Consult full documentation
5. Contact DevOps team

## Key Metrics

- **Test Duration**: ~2-3 minutes
- **Docker Build**: ~3-5 minutes
- **Lambda Deploy**: ~1-2 minutes
- **ECS Deploy**: ~2-3 minutes
- **Total Pipeline**: ~10-15 minutes

## Cost Tracking

Monitor costs via:
- AWS Billing Dashboard
- GitHub Actions usage
- CloudWatch metrics
- Cost Explorer

**Estimated monthly cost**: <$10 for moderate usage

## Next Steps

1. Push code to main branch
2. Monitor in GitHub Actions
3. View results in DevOps page
4. Check CloudWatch metrics
5. Review deployment logs
