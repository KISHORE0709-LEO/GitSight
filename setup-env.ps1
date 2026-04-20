# GitSight - Auto Setup Environment Variables (Windows)
# This script fetches AWS API Gateway URL and updates .env.local

Write-Host "🚀 GitSight Environment Setup" -ForegroundColor Green
Write-Host "==============================" -ForegroundColor Green
Write-Host ""

# Check if AWS CLI is installed
try {
    $awsVersion = aws --version 2>$null
    Write-Host "✅ AWS CLI found: $awsVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ AWS CLI is not installed." -ForegroundColor Red
    Write-Host "   https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html" -ForegroundColor Yellow
    exit 1
}

# Check if AWS credentials are configured
try {
    $identity = aws sts get-caller-identity 2>$null | ConvertFrom-Json
    Write-Host "✅ AWS credentials configured (Account: $($identity.Account))" -ForegroundColor Green
} catch {
    Write-Host "❌ AWS credentials are not configured." -ForegroundColor Red
    Write-Host "   Run: aws configure" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Get API Gateway URL
Write-Host "📡 Fetching API Gateway URL..." -ForegroundColor Cyan

try {
    $apiGatewayUrl = aws apigatewayv2 get-apis --query 'Items[0].ApiEndpoint' --output text 2>$null
    
    if ([string]::IsNullOrEmpty($apiGatewayUrl) -or $apiGatewayUrl -eq "None") {
        Write-Host "❌ No API Gateway found. Please deploy CloudFormation stack first." -ForegroundColor Red
        Write-Host "   Run: cd backend && aws cloudformation create-stack --stack-name gitsight-dev --template-body file://infrastructure.yml --capabilities CAPABILITY_NAMED_IAM" -ForegroundColor Yellow
        exit 1
    }
    
    Write-Host "✅ API Gateway URL: $apiGatewayUrl" -ForegroundColor Green
} catch {
    Write-Host "❌ Error fetching API Gateway URL: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Create or update .env.local
$envFile = ".env.local"
$envContent = "VITE_API_GATEWAY_URL=$apiGatewayUrl"

Write-Host "📝 Updating $envFile..." -ForegroundColor Cyan

try {
    if (Test-Path $envFile) {
        # Check if VITE_API_GATEWAY_URL already exists
        $fileContent = Get-Content $envFile -Raw
        
        if ($fileContent -match "VITE_API_GATEWAY_URL") {
            # Update existing variable
            $fileContent = $fileContent -replace "VITE_API_GATEWAY_URL=.*", $envContent
            Set-Content -Path $envFile -Value $fileContent -NoNewline
            Write-Host "✅ Updated existing VITE_API_GATEWAY_URL" -ForegroundColor Green
        } else {
            # Append new variable
            Add-Content -Path $envFile -Value "`n$envContent"
            Write-Host "✅ Added VITE_API_GATEWAY_URL" -ForegroundColor Green
        }
    } else {
        # Create new .env.local file
        Set-Content -Path $envFile -Value $envContent
        Write-Host "✅ Created $envFile" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Error updating $envFile : $_" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📋 Current $envFile :" -ForegroundColor Cyan
Write-Host "---" -ForegroundColor Gray
Get-Content $envFile
Write-Host "---" -ForegroundColor Gray
Write-Host ""

Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Run: npm run dev" -ForegroundColor White
Write-Host "2. Go to http://localhost:8080/analyze" -ForegroundColor White
Write-Host "3. Enter a GitHub username and click Analyze" -ForegroundColor White
Write-Host ""
