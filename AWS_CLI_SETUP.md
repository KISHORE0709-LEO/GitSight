# AWS CLI Setup for Windows

## Install AWS CLI

### Option 1: MSI Installer (Recommended)
1. Download: https://awscli.amazonaws.com/AWSCLIV2.msi
2. Run the installer
3. Restart PowerShell

### Option 2: Winget
```powershell
winget install Amazon.AWSCLI
```

### Option 3: Chocolatey
```powershell
choco install awscli
```

## Verify Installation
```powershell
aws --version
```

## Configure AWS CLI

```powershell
aws configure
```

Enter:
- **AWS Access Key ID**: Your access key
- **AWS Secret Access Key**: Your secret key
- **Default region**: us-east-1
- **Default output format**: json

## Get AWS Credentials

1. Go to AWS Console: https://console.aws.amazon.com
2. Click your name (top right) → Security credentials
3. Scroll to "Access keys"
4. Click "Create access key"
5. Copy the Access Key ID and Secret Access Key

## Test AWS CLI

```powershell
aws sts get-caller-identity
```

Should return your AWS account info.

## Now Deploy GitSight

```powershell
cd backend
aws cloudformation create-stack --stack-name gitsight-dev --template-body file://infrastructure.yml --capabilities CAPABILITY_IAM
```
