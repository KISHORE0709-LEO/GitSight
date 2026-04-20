const AWS = require('aws-sdk');

const cloudwatch = new AWS.CloudWatchLogs({ region: process.env.AWS_REGION });
const dynamodb = new AWS.DynamoDB.DocumentClient({ region: process.env.AWS_REGION });

const LOG_GROUPS = [
  '/aws/lambda/gitsight-api-handler-dev',
  '/aws/lambda/github-collector-dev',
  '/aws/lambda/gitsight-metrics-dev',
  '/aws/lambda/gitsight-leaderboard-dev',
  '/aws/lambda/gitsight-incidents-dev'
];

const LOGS_TABLE = 'GitSightLogs-dev';

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  };

  try {
    const level = event.queryStringParameters?.level || '';
    
    // Fetch logs from DynamoDB (in-memory log store)
    const result = await dynamodb.scan({
      TableName: LOGS_TABLE,
      Limit: 100,
      ScanIndexForward: false
    }).promise();

    let logs = result.Items || [];

    // Filter by level if specified
    if (level) {
      logs = logs.filter(log => log.level === level);
    }

    // Sort by timestamp descending
    logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(logs.slice(0, 100))
    };
  } catch (error) {
    console.error('Logs error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: 'Failed to fetch logs' })
    };
  }
};
