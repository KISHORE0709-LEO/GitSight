const AWS = require('aws-sdk');
const https = require('https');

const lambda = new AWS.Lambda({ region: process.env.AWS_REGION });

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    let body;

    if (typeof event.body === "string") {
      body = JSON.parse(event.body);
    } else {
      body = event.body || {};
    }

    const { username } = body;

    if (!username) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'Username is required' })
      };
    }

    // Validate GitHub user
    const userExists = await checkGitHubUser(username);
    if (!userExists) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ message: 'GitHub user not found' })
      };
    }

    // Invoke collector Lambda
    const result = await lambda.invoke({
      FunctionName: process.env.LAMBDA_COLLECTOR_NAME,
      InvocationType: 'RequestResponse',
      Payload: JSON.stringify({ username })
    }).promise();

    const response = JSON.parse(result.Payload || "{}");

    if (response.statusCode === 200) {
      const collectorData = JSON.parse(response.body);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(collectorData)
      };
    }

    return {
      statusCode: response.statusCode || 500,
      headers,
      body: JSON.stringify({ message: 'Analysis failed' })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: 'Failed to analyze user' })
    };
  }
};

function checkGitHubUser(username) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'api.github.com',
      path: `/users/${username}`,
      headers: { 'User-Agent': 'GitSight-App' }
    };

    https.get(options, (res) => resolve(res.statusCode === 200))
      .on('error', () => resolve(false));
  });
}
