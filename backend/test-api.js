#!/usr/bin/env node

/**
 * GitSight API Test Script
 * Tests the /api/analyze endpoint
 */

const axios = require('axios');

const API_URL = process.env.API_URL || 'http://localhost:3001';
const TEST_USERNAME = process.env.TEST_USERNAME || 'octocat';

async function testAnalyzeEndpoint() {
  console.log('🧪 Testing GitSight API...\n');
  console.log(`API URL: ${API_URL}`);
  console.log(`Test Username: ${TEST_USERNAME}\n`);

  try {
    console.log('📡 Sending request...');
    const startTime = Date.now();

    const response = await axios.post(`${API_URL}/api/analyze`, {
      username: TEST_USERNAME
    });

    const duration = Date.now() - startTime;

    console.log('✅ Success!\n');
    console.log('Response:');
    console.log(JSON.stringify(response.data, null, 2));
    console.log(`\n⏱️  Duration: ${duration}ms`);

  } catch (error) {
    console.log('❌ Error!\n');
    
    if (error.response) {
      console.log(`Status: ${error.response.status}`);
      console.log(`Message: ${error.response.data.message || 'Unknown error'}`);
    } else if (error.request) {
      console.log('No response received from server');
      console.log('Make sure the API server is running on port 3001');
    } else {
      console.log(`Error: ${error.message}`);
    }
  }
}

async function testHealthEndpoint() {
  console.log('\n🏥 Testing health endpoint...');
  
  try {
    const response = await axios.get(`${API_URL}/health`);
    console.log('✅ Health check passed');
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log('❌ Health check failed');
    console.log('API server may not be running');
  }
}

async function runTests() {
  await testHealthEndpoint();
  await testAnalyzeEndpoint();
  console.log('\n✨ Tests complete!\n');
}

runTests();
