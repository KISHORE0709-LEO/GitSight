# DevOps Implementation Checklist

## Pre-Deployment

### Prerequisites
- [ ] GitHub repository with admin access
- [ ] AWS account with appropriate permissions
- [ ] GitHub token with `repo` scope
- [ ] AWS CLI installed and configured
- [ ] Node.js 18+ installed
- [ ] Docker installed (for local testing)

### Documentation Review
- [ ] Read DEVOPS_INDEX.md
- [ ] Read DEVOPS_QUICK_REFERENCE.md
- [ ] Read DEVOPS_SETUP.md
- [ ] Understand architecture diagram
- [ ] Review pipeline stages

## AWS Setup

### IAM Configuration
- [ ] Create OIDC provider for GitHub Actions
  ```bash
  aws iam create-open-id-connect-provider \
    --url https://token.actions.githubusercontent.com \
    --client-id-list sts.amazonaws.com \
    --thumbprint-list 6938fd4d98bab03faadb97b34396831e3780aea1
  ```

- [ ] Create IAM role for GitHub Actions
  ```bash
  aws iam create-role \
    --role-name GitHubActionsRole \
    --assume-role-policy-document file://trust-policy.json
  ```

- [ ] Attach required policies
  - [ ] AmazonEC2ContainerRegistryPowerUser
  - [ ] AWSLambda_FullAccess
  - [ ] AmazonECS_FullAccess
  - [ ] CloudWatchFullAccess

### ECR Setup
- [ ] Create ECR repository
  ```bash
  aws ecr create-repository --repository-name gitsight-worker
  ```

- [ ] Verify repository created
  ```bash
  aws ecr describe-repositories --repository-names gitsight-worker
  ```

### CloudFormation Deployment
- [ ] Validate template
  ```bash
  aws cloudformation validate-template \
    --template-body file://backend/infrastructure.yml
  ```

- [ ] Create stack
  ```bash
  aws cloudformation create-stack \
    --stack-name gitsight-dev \
    --template-body file://backend/infrastructure.yml \
    --parameters ParameterKey=Environment,ParameterValue=dev \
    --capabilities CAPABILITY_NAMED_IAM
  ```

- [ ] Wait for stack creation to complete
  ```bash
  aws cloudformation wait stack-create-complete \
    --stack-name gitsight-dev
  ```

- [ ] Verify stack outputs
  ```bash
  aws cloudformation describe-stacks \
    --stack-name gitsight-dev \
    --query 'Stacks[0].Outputs'
  ```

### Lambda Verification
- [ ] Verify Lambda functions created
  ```bash
  aws lambda list-functions --query 'Functions[?contains(FunctionName, `gitsight`)]'
  ```

- [ ] Check pipeline function exists
  ```bash
  aws lambda get-function --function-name gitsight-pipeline-dev
  ```

- [ ] Verify environment variables
  ```bash
  aws lambda get-function-configuration \
    --function-name gitsight-pipeline-dev
  ```

### API Gateway Verification
- [ ] Get API Gateway ID
  ```bash
  aws apigatewayv2 get-apis --query 'Items[?Name==`gitsight-api-dev`]'
  ```

- [ ] Verify routes
  ```bash
  aws apigatewayv2 get-routes --api-id <api-id>
  ```

- [ ] Test pipeline endpoint
  ```bash
  curl https://<api-id>.execute-api.us-east-1.amazonaws.com/pipeline/status
  ```

## GitHub Configuration

### Secrets Setup
- [ ] Add AWS_ROLE_ARN secret
  - Go to Settings → Secrets and variables → Actions
  - Click "New repository secret"
  - Name: `AWS_ROLE_ARN`
  - Value: `arn:aws:iam::ACCOUNT_ID:role/GitHubActionsRole`

- [ ] Add API_GATEWAY_ID secret
  - Name: `API_GATEWAY_ID`
  - Value: Your API Gateway ID

### Workflow Verification
- [ ] Verify workflow file exists
  ```bash
  ls -la .github/workflows/ci-cd.yml
  ```

- [ ] Check workflow syntax
  ```bash
  # Use GitHub's workflow validator or review manually
  ```

- [ ] Enable workflow
  - Go to Actions tab
  - Click "I understand my workflows, go ahead and enable them"

### Branch Protection (Optional)
- [ ] Set up branch protection for main
  - Go to Settings → Branches
  - Add rule for `main`
  - Require pull request reviews
  - Require status checks to pass
  - Require branches to be up to date

## Frontend Setup

### Environment Configuration
- [ ] Create .env.local file
  ```bash
  echo "VITE_API_GATEWAY_URL=https://<api-id>.execute-api.us-east-1.amazonaws.com" > .env.local
  ```

- [ ] Verify environment variable
  ```bash
  cat .env.local
  ```

### Dependencies
- [ ] Install dependencies
  ```bash
  npm install
  ```

- [ ] Verify DevOps page exists
  ```bash
  ls -la src/pages/DevOps.tsx
  ```

### Local Testing
- [ ] Start development server
  ```bash
  npm run dev
  ```

- [ ] Navigate to DevOps page
  - Open http://localhost:8080/devops
  - Verify page loads without errors

- [ ] Check console for errors
  - Open browser DevTools
  - Check Console tab for errors
  - Check Network tab for API calls

## Backend Setup

### Lambda Deployment
- [ ] Navigate to lambda directory
  ```bash
  cd backend/lambda
  ```

- [ ] Install dependencies
  ```bash
  npm install
  ```

- [ ] Create deployment package
  ```bash
  zip -r pipeline.zip pipeline.js node_modules/
  ```

- [ ] Deploy to Lambda
  ```bash
  aws lambda update-function-code \
    --function-name gitsight-pipeline-dev \
    --zip-file fileb://pipeline.zip
  ```

- [ ] Verify deployment
  ```bash
  aws lambda get-function --function-name gitsight-pipeline-dev
  ```

### Environment Variables
- [ ] Set Lambda environment variables
  ```bash
  aws lambda update-function-configuration \
    --function-name gitsight-pipeline-dev \
    --environment Variables={GITHUB_OWNER=your-org,GITHUB_REPO=GitSight,GITHUB_TOKEN=your_token}
  ```

- [ ] Verify environment variables
  ```bash
  aws lambda get-function-configuration \
    --function-name gitsight-pipeline-dev \
    --query 'Environment.Variables'
  ```

## Testing

### API Testing
- [ ] Test pipeline endpoint
  ```bash
  curl https://<api-id>.execute-api.us-east-1.amazonaws.com/pipeline/status
  ```

- [ ] Verify response format
  - Check for `builds` array
  - Check for `stages` array
  - Check for `lastUpdated` timestamp

- [ ] Test with GitHub token
  ```bash
  # Set GITHUB_TOKEN in Lambda environment
  # Re-test endpoint
  ```

### Frontend Testing
- [ ] Load DevOps page
  - Navigate to http://localhost:8080/devops
  - Verify page loads without errors

- [ ] Check pipeline visualization
  - Verify 6 stages display
  - Check status colors
  - Verify animations work

- [ ] Check recent builds
  - Verify builds list displays
  - Check build information (branch, duration, timestamp)
  - Verify GitHub Actions links work

- [ ] Check auto-refresh
  - Wait 10 seconds
  - Verify data updates
  - Check console for API calls

- [ ] Test error handling
  - Temporarily disable API
  - Verify error message displays
  - Verify page doesn't crash

### GitHub Actions Testing
- [ ] Trigger workflow manually
  ```bash
  git push origin main
  ```

- [ ] Monitor workflow execution
  - Go to Actions tab
  - Click on workflow run
  - Watch jobs execute

- [ ] Verify each job
  - [ ] Test job completes
  - [ ] Docker build job completes
  - [ ] Lambda deploy job completes
  - [ ] ECS deploy job completes
  - [ ] Monitoring job completes

- [ ] Check workflow logs
  - Click on each job
  - Review logs for errors
  - Verify all steps passed

## Monitoring

### CloudWatch Setup
- [ ] Verify CloudWatch logs created
  ```bash
  aws logs describe-log-groups --query 'logGroups[?contains(logGroupName, `gitsight`)]'
  ```

- [ ] Check Lambda logs
  ```bash
  aws logs tail /aws/lambda/gitsight-pipeline-dev --follow
  ```

- [ ] Verify CloudWatch alarms
  ```bash
  aws cloudwatch describe-alarms --query 'MetricAlarms[?contains(AlarmName, `gitsight`)]'
  ```

### Metrics Verification
- [ ] Check Lambda metrics
  ```bash
  aws cloudwatch get-metric-statistics \
    --namespace AWS/Lambda \
    --metric-name Invocations \
    --dimensions Name=FunctionName,Value=gitsight-pipeline-dev \
    --start-time 2024-01-01T00:00:00Z \
    --end-time 2024-01-02T00:00:00Z \
    --period 3600 \
    --statistics Sum
  ```

- [ ] Monitor API Gateway metrics
  - Go to CloudWatch dashboard
  - Check API Gateway metrics
  - Verify request count and latency

## Documentation

### Verification
- [ ] DEVOPS_INDEX.md exists and is readable
- [ ] DEVOPS_SETUP.md exists and is complete
- [ ] DEVOPS_IMPLEMENTATION.md exists and is detailed
- [ ] DEVOPS_QUICK_REFERENCE.md exists and is helpful
- [ ] DEVOPS_FILES_SUMMARY.md exists and is accurate
- [ ] .github/ENVIRONMENTS.md exists and is configured

### Review
- [ ] All documentation is up to date
- [ ] All links are working
- [ ] All code examples are correct
- [ ] All configuration values are accurate

## Post-Deployment

### Verification
- [ ] DevOps page loads successfully
- [ ] Pipeline status displays correctly
- [ ] Recent builds list shows data
- [ ] Auto-refresh works every 10 seconds
- [ ] GitHub Actions links are clickable
- [ ] Error handling works properly
- [ ] Mobile responsive design works
- [ ] Dark mode styling applies

### Performance
- [ ] Frontend load time < 2 seconds
- [ ] API response time < 1 second
- [ ] Pipeline status updates every 10 seconds
- [ ] No console errors
- [ ] No network errors

### Security
- [ ] No hardcoded credentials
- [ ] GitHub token stored as secret
- [ ] IAM roles have least privilege
- [ ] CORS properly configured
- [ ] Input validation enabled
- [ ] Audit logging enabled

## Optimization

### Performance Tuning
- [ ] Adjust refresh interval if needed
- [ ] Optimize GitHub API queries
- [ ] Cache pipeline stages
- [ ] Monitor Lambda execution time
- [ ] Review CloudWatch metrics

### Cost Optimization
- [ ] Monitor GitHub Actions usage
- [ ] Review AWS costs
- [ ] Optimize Lambda memory
- [ ] Clean up unused resources
- [ ] Set up billing alerts

## Troubleshooting

### Common Issues
- [ ] Pipeline status not updating
  - Check GitHub token
  - Verify Lambda environment variables
  - Check API Gateway route

- [ ] Docker build fails
  - Verify ECR repository
  - Check IAM permissions
  - Verify Dockerfile

- [ ] Lambda deployment fails
  - Verify Lambda functions exist
  - Check IAM permissions
  - Verify zip files

- [ ] ECS update fails
  - Verify ECS cluster exists
  - Check IAM permissions
  - Verify task definition

### Debugging
- [ ] Check GitHub Actions logs
- [ ] Check Lambda logs in CloudWatch
- [ ] Check API Gateway logs
- [ ] Check browser console
- [ ] Check network requests

## Final Verification

### Complete Checklist
- [ ] All prerequisites met
- [ ] AWS infrastructure deployed
- [ ] GitHub configured
- [ ] Frontend working
- [ ] Backend deployed
- [ ] Tests passing
- [ ] Monitoring active
- [ ] Documentation complete
- [ ] Performance acceptable
- [ ] Security verified

### Sign-Off
- [ ] DevOps implementation complete
- [ ] All tests passing
- [ ] Documentation reviewed
- [ ] Team trained
- [ ] Ready for production

## Next Steps

1. **Monitor**: Watch pipeline execution
2. **Optimize**: Adjust based on performance
3. **Scale**: Add more stages if needed
4. **Integrate**: Connect with other tools
5. **Automate**: Add more automation

## Support

For issues:
1. Check DEVOPS_QUICK_REFERENCE.md
2. Review DEVOPS_SETUP.md troubleshooting
3. Check GitHub Actions logs
4. Review AWS CloudWatch logs
5. Consult DEVOPS_IMPLEMENTATION.md

---

**Checklist Version**: 1.0
**Last Updated**: 2024
**Status**: Ready for Use
