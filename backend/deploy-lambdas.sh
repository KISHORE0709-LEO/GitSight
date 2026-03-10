#!/bin/bash

set -e

ENVIRONMENT=${1:-dev}
REGION=${AWS_REGION:-us-east-1}

echo "🚀 Deploying GitSight Lambdas to $ENVIRONMENT environment..."

cd "$(dirname "$0")/lambda"

npm install --production

# Deploy API Handler
echo "📤 Deploying API Handler..."
zip -q -r api-handler.zip api-handler.js node_modules/
aws lambda update-function-code --function-name gitsight-api-handler-$ENVIRONMENT --zip-file fileb://api-handler.zip --region $REGION
rm api-handler.zip

# Deploy Collector
echo "📤 Deploying Collector..."
zip -q -r collector.zip collector.js node_modules/
aws lambda update-function-code --function-name github-collector-$ENVIRONMENT --zip-file fileb://collector.zip --region $REGION
rm collector.zip

# Deploy Metrics
echo "📤 Deploying Metrics..."
zip -q -r metrics.zip metrics.js node_modules/
aws lambda update-function-code --function-name gitsight-metrics-$ENVIRONMENT --zip-file fileb://metrics.zip --region $REGION
rm metrics.zip

# Deploy Leaderboard
echo "📤 Deploying Leaderboard..."
zip -q -r leaderboard.zip leaderboard.js node_modules/
aws lambda update-function-code --function-name gitsight-leaderboard-$ENVIRONMENT --zip-file fileb://leaderboard.zip --region $REGION
rm leaderboard.zip

echo "✅ Deployment complete!"
