#!/usr/bin/env node

/**
 * GitSight - Auto Setup Environment Variables
 * This script fetches AWS API Gateway URL and updates .env.local
 * Works on Windows, Mac, and Linux
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  log('', 'reset');
  log(title, 'green');
  log('='.repeat(title.length), 'green');
  log('', 'reset');
}

function executeCommand(command) {
  try {
    return execSync(command, { encoding: 'utf-8', stdio: 'pipe' }).trim();
  } catch (error) {
    return null;
  }
}

async function main() {
  logSection('🚀 GitSight Environment Setup');

  // Check if AWS CLI is installed
  log('Checking AWS CLI...', 'cyan');
  const awsVersion = executeCommand('aws --version');
  
  if (!awsVersion) {
    log('❌ AWS CLI is not installed.', 'red');
    log('   https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html', 'yellow');
    process.exit(1);
  }
  
  log(`✅ AWS CLI found: ${awsVersion}`, 'green');

  // Check if AWS credentials are configured
  log('Checking AWS credentials...', 'cyan');
  const identity = executeCommand('aws sts get-caller-identity --query "Account" --output text');
  
  if (!identity) {
    log('❌ AWS credentials are not configured.', 'red');
    log('   Run: aws configure', 'yellow');
    process.exit(1);
  }
  
  log(`✅ AWS credentials configured (Account: ${identity})`, 'green');
  log('', 'reset');

  // Get API Gateway URL
  log('📡 Fetching API Gateway URL...', 'cyan');
  const apiGatewayUrl = executeCommand('aws apigatewayv2 get-apis --query "Items[0].ApiEndpoint" --output text');
  
  if (!apiGatewayUrl || apiGatewayUrl === 'None') {
    log('❌ No API Gateway found. Please deploy CloudFormation stack first.', 'red');
    log('   Run: cd backend && aws cloudformation create-stack --stack-name gitsight-dev --template-body file://infrastructure.yml --capabilities CAPABILITY_NAMED_IAM', 'yellow');
    process.exit(1);
  }
  
  log(`✅ API Gateway URL: ${apiGatewayUrl}`, 'green');
  log('', 'reset');

  // Create or update .env.local
  const envFile = '.env.local';
  const envContent = `VITE_API_GATEWAY_URL=${apiGatewayUrl}`;

  log(`📝 Updating ${envFile}...`, 'cyan');

  try {
    const envPath = path.join(process.cwd(), envFile);
    
    if (fs.existsSync(envPath)) {
      // Read existing file
      let fileContent = fs.readFileSync(envPath, 'utf-8');
      
      if (fileContent.includes('VITE_API_GATEWAY_URL')) {
        // Update existing variable
        fileContent = fileContent.replace(
          /VITE_API_GATEWAY_URL=.*/,
          envContent
        );
        fs.writeFileSync(envPath, fileContent);
        log('✅ Updated existing VITE_API_GATEWAY_URL', 'green');
      } else {
        // Append new variable
        if (!fileContent.endsWith('\n')) {
          fileContent += '\n';
        }
        fs.appendFileSync(envPath, envContent + '\n');
        log('✅ Added VITE_API_GATEWAY_URL', 'green');
      }
    } else {
      // Create new .env.local file
      fs.writeFileSync(envPath, envContent + '\n');
      log(`✅ Created ${envFile}`, 'green');
    }
  } catch (error) {
    log(`❌ Error updating ${envFile}: ${error.message}`, 'red');
    process.exit(1);
  }

  log('', 'reset');
  log(`📋 Current ${envFile}:`, 'cyan');
  log('---', 'gray');
  
  try {
    const envPath = path.join(process.cwd(), envFile);
    const content = fs.readFileSync(envPath, 'utf-8');
    console.log(content);
  } catch (error) {
    log(`Error reading ${envFile}`, 'red');
  }
  
  log('---', 'gray');
  log('', 'reset');

  log('✅ Setup complete!', 'green');
  log('', 'reset');
  log('Next steps:', 'yellow');
  log('1. Run: npm run dev', 'white');
  log('2. Go to http://localhost:8080/analyze', 'white');
  log('3. Enter a GitHub username and click Analyze', 'white');
  log('', 'reset');
}

main().catch((error) => {
  log(`❌ Error: ${error.message}`, 'red');
  process.exit(1);
});
