#!/usr/bin/env pwsh

param(
    [string]$Environment = "dev",
    [string]$Region = "us-east-1"
)

if ($env:AWS_REGION) {
    $Region = $env:AWS_REGION
}

Write-Host "🚀 Deploying GitSight Lambdas to $Environment environment..." -ForegroundColor Green

Set-Location "$PSScriptRoot\lambda"

npm install --production

# Deploy API Handler
Write-Host "📤 Deploying API Handler..." -ForegroundColor Yellow
Compress-Archive -Path api-handler.js,node_modules -DestinationPath api-handler.zip -Force
aws lambda update-function-code --function-name "gitsight-api-handler-$Environment" --zip-file fileb://api-handler.zip --region $Region
Remove-Item api-handler.zip

# Deploy Collector
Write-Host "📤 Deploying Collector..." -ForegroundColor Yellow
Compress-Archive -Path collector.js,node_modules -DestinationPath collector.zip -Force
aws lambda update-function-code --function-name "github-collector-$Environment" --zip-file fileb://collector.zip --region $Region
Remove-Item collector.zip

# Deploy Metrics
Write-Host "📤 Deploying Metrics..." -ForegroundColor Yellow
Compress-Archive -Path metrics.js,node_modules -DestinationPath metrics.zip -Force
aws lambda update-function-code --function-name "gitsight-metrics-$Environment" --zip-file fileb://metrics.zip --region $Region
Remove-Item metrics.zip

# Deploy Leaderboard
Write-Host "📤 Deploying Leaderboard..." -ForegroundColor Yellow
Compress-Archive -Path leaderboard.js,node_modules -DestinationPath leaderboard.zip -Force
aws lambda update-function-code --function-name "gitsight-leaderboard-$Environment" --zip-file fileb://leaderboard.zip --region $Region
Remove-Item leaderboard.zip

Write-Host "✅ Deployment complete!" -ForegroundColor Green
