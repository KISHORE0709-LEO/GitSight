# GitHub Actions Environment Configuration

## Environments

This project uses GitHub Environments for deployment configuration.

### Development Environment

**Settings:**
- Branch protection: `develop`
- Required reviewers: 1
- Deployment branches: `develop`

**Secrets:**
```
AWS_ROLE_ARN: arn:aws:iam::ACCOUNT_ID:role/GitHubActionsRole-dev
API_GATEWAY_ID: dev-api-gateway-id
```

### Production Environment

**Settings:**
- Branch protection: `main`
- Required reviewers: 2
- Deployment branches: `main`

**Secrets:**
```
AWS_ROLE_ARN: arn:aws:iam::ACCOUNT_ID:role/GitHubActionsRole-prod
API_GATEWAY_ID: prod-api-gateway-id
```

## Setup Instructions

### 1. Create GitHub Environments

Go to Settings → Environments and create:
- `development`
- `production`

### 2. Configure Branch Protection

For `main` branch:
- Require pull request reviews before merging
- Require status checks to pass
- Require branches to be up to date

For `develop` branch:
- Require pull request reviews before merging
- Require status checks to pass

### 3. Add Deployment Secrets

For each environment, add:

```bash
# Development
AWS_ROLE_ARN=arn:aws:iam::ACCOUNT_ID:role/GitHubActionsRole-dev
API_GATEWAY_ID=dev-api-id

# Production
AWS_ROLE_ARN=arn:aws:iam::ACCOUNT_ID:role/GitHubActionsRole-prod
API_GATEWAY_ID=prod-api-id
```

### 4. Configure OIDC Provider

Create OIDC identity provider in AWS:

```bash
aws iam create-open-id-connect-provider \
  --url https://token.actions.githubusercontent.com \
  --client-id-list sts.amazonaws.com \
  --thumbprint-list 6938fd4d98bab03faadb97b34396831e3780aea1
```

### 5. Create IAM Roles

For development:

```bash
aws iam create-role \
  --role-name GitHubActionsRole-dev \
  --assume-role-policy-document file://trust-policy-dev.json
```

For production:

```bash
aws iam create-role \
  --role-name GitHubActionsRole-prod \
  --assume-role-policy-document file://trust-policy-prod.json
```

## Workflow Triggers

- **Push to main**: Full deployment pipeline
- **Push to develop**: Test and build only
- **Pull requests**: Test only
- **Manual trigger**: Available via workflow_dispatch

## Deployment Strategy

### Development
- Automatic deployment on push to `develop`
- No approval required
- Faster feedback loop

### Production
- Requires pull request to `main`
- Requires 2 approvals
- Manual approval in GitHub Actions
- Rollback capability

## Monitoring

Monitor deployments via:
- GitHub Actions tab
- GitSight DevOps page
- AWS CloudWatch
- CloudFormation events

## Rollback Procedure

If deployment fails:

1. Check GitHub Actions logs
2. Review CloudFormation events
3. Rollback via AWS Console or CLI:

```bash
aws cloudformation cancel-update-stack \
  --stack-name gitsight-prod
```

Or redeploy previous version:

```bash
git revert HEAD
git push origin main
```

## Security Best Practices

- Use OIDC for authentication (no long-lived credentials)
- Rotate secrets regularly
- Use least privilege IAM policies
- Enable audit logging
- Review deployment logs
- Use branch protection rules
- Require code reviews before deployment
