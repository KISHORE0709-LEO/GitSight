#!/bin/bash

# GitSight - Auto Setup Environment Variables
# This script fetches AWS API Gateway URL and updates .env.local

set -e

echo "🚀 GitSight Environment Setup"
echo "=============================="
echo ""

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI is not installed. Please install it first."
    echo "   https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html"
    exit 1
fi

# Check if AWS credentials are configured
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS credentials are not configured."
    echo "   Run: aws configure"
    exit 1
fi

echo "✅ AWS CLI found and configured"
echo ""

# Get API Gateway URL
echo "📡 Fetching API Gateway URL..."
API_GATEWAY_URL=$(aws apigatewayv2 get-apis --query 'Items[0].ApiEndpoint' --output text 2>/dev/null)

if [ -z "$API_GATEWAY_URL" ] || [ "$API_GATEWAY_URL" = "None" ]; then
    echo "❌ No API Gateway found. Please deploy CloudFormation stack first."
    echo "   Run: cd backend && aws cloudformation create-stack --stack-name gitsight-dev --template-body file://infrastructure.yml --capabilities CAPABILITY_NAMED_IAM"
    exit 1
fi

echo "✅ API Gateway URL: $API_GATEWAY_URL"
echo ""

# Create or update .env.local
ENV_FILE=".env.local"

echo "📝 Updating $ENV_FILE..."

# Check if .env.local exists
if [ -f "$ENV_FILE" ]; then
    # Check if VITE_API_GATEWAY_URL already exists
    if grep -q "VITE_API_GATEWAY_URL" "$ENV_FILE"; then
        # Update existing variable
        sed -i.bak "s|VITE_API_GATEWAY_URL=.*|VITE_API_GATEWAY_URL=$API_GATEWAY_URL|" "$ENV_FILE"
        echo "✅ Updated existing VITE_API_GATEWAY_URL"
    else
        # Append new variable
        echo "VITE_API_GATEWAY_URL=$API_GATEWAY_URL" >> "$ENV_FILE"
        echo "✅ Added VITE_API_GATEWAY_URL"
    fi
else
    # Create new .env.local file
    echo "VITE_API_GATEWAY_URL=$API_GATEWAY_URL" > "$ENV_FILE"
    echo "✅ Created $ENV_FILE"
fi

echo ""
echo "📋 Current .env.local:"
echo "---"
cat "$ENV_FILE"
echo "---"
echo ""

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Run: npm run dev"
echo "2. Go to http://localhost:8080/analyze"
echo "3. Enter a GitHub username and click Analyze"
echo ""
