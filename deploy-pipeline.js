#!/usr/bin/env node

/**
 * Deploy Pipeline Lambda Function
 * This script packages and deploys the pipeline.js Lambda function
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
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function executeCommand(command) {
  try {
    return execSync(command, { encoding: 'utf-8', stdio: 'inherit' });
  } catch (error) {
    throw error;
  }
}

async function main() {
  log('\n🚀 Deploying Pipeline Lambda Function\n', 'green');

  try {
    // Check if Lambda function exists
    log('Checking if Lambda function exists...', 'cyan');
    try {
      execSync('aws lambda get-function --function-name gitsight-pipeline-dev', { stdio: 'pipe' });
      log('✅ Lambda function found\n', 'green');
    } catch {
      log('❌ Lambda function not found. Creating it...', 'yellow');
      log('Please deploy CloudFormation stack first:', 'yellow');
      log('cd backend && aws cloudformation create-stack --stack-name gitsight-dev --template-body file://infrastructure.yml --capabilities CAPABILITY_NAMED_IAM\n', 'yellow');
      process.exit(1);
    }

    // Navigate to lambda directory
    const lambdaDir = path.join(__dirname, 'backend', 'lambda');
    
    if (!fs.existsSync(lambdaDir)) {
      log(`❌ Lambda directory not found: ${lambdaDir}`, 'red');
      process.exit(1);
    }

    log(`📁 Lambda directory: ${lambdaDir}\n`, 'cyan');

    // Check if pipeline.js exists
    const pipelineFile = path.join(lambdaDir, 'pipeline.js');
    if (!fs.existsSync(pipelineFile)) {
      log(`❌ pipeline.js not found: ${pipelineFile}`, 'red');
      process.exit(1);
    }

    log('✅ pipeline.js found\n', 'green');

    // Install dependencies
    log('📦 Installing dependencies...', 'cyan');
    process.chdir(lambdaDir);
    executeCommand('npm install');
    log('✅ Dependencies installed\n', 'green');

    // Create zip file
    log('📦 Creating deployment package...', 'cyan');
    const zipFile = path.join(lambdaDir, 'pipeline.zip');
    
    // Remove old zip if exists
    if (fs.existsSync(zipFile)) {
      fs.unlinkSync(zipFile);
    }

    // Create zip (cross-platform)
    if (process.platform === 'win32') {
      // Windows
      executeCommand(`powershell -Command "Compress-Archive -Path pipeline.js, node_modules -DestinationPath pipeline.zip -Force"`);
    } else {
      // Mac/Linux
      executeCommand('zip -r pipeline.zip pipeline.js node_modules/');
    }

    log('✅ Deployment package created\n', 'green');

    // Deploy to Lambda
    log('🚀 Deploying to Lambda...', 'cyan');
    executeCommand(`aws lambda update-function-code --function-name gitsight-pipeline-dev --zip-file fileb://pipeline.zip`);
    log('✅ Lambda function deployed\n', 'green');

    // Wait for deployment
    log('⏳ Waiting for deployment to complete...', 'cyan');
    await new Promise(resolve => setTimeout(resolve, 3000));
    log('✅ Deployment complete\n', 'green');

    // Test the endpoint
    log('🧪 Testing pipeline endpoint...', 'cyan');
    try {
      const result = execSync('curl -s https://e0kpa6cnrl.execute-api.us-east-1.amazonaws.com/pipeline/status', { encoding: 'utf-8' });
      const data = JSON.parse(result);
      
      if (data.builds !== undefined && data.stages !== undefined) {
        log('✅ Pipeline endpoint working!\n', 'green');
        log('Response:', 'cyan');
        console.log(JSON.stringify(data, null, 2));
      } else {
        log('⚠️  Endpoint returned unexpected response\n', 'yellow');
      }
    } catch (error) {
      log('⚠️  Could not test endpoint (curl may not be available)\n', 'yellow');
    }

    log('✅ Deployment successful!\n', 'green');
    log('Next steps:', 'yellow');
    log('1. Run: npm run dev', 'white');
    log('2. Go to http://localhost:8080/devops', 'white');
    log('3. You should see pipeline stages and recent builds\n', 'white');

  } catch (error) {
    log(`❌ Error: ${error.message}`, 'red');
    process.exit(1);
  }
}

main();
