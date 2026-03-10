const AWS = require('aws-sdk');

const dynamodb = new AWS.DynamoDB.DocumentClient({ region: process.env.AWS_REGION });
const TABLE_NAME = process.env.DYNAMODB_TABLE || 'GitSightMetrics-dev';

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  };

  try {
    // Scan DynamoDB for top developers
    const result = await dynamodb.scan({
      TableName: TABLE_NAME,
      Limit: 100
    }).promise();

    // Group by username and get latest score
    const developerMap = {};
    result.Items.forEach(item => {
      if (!developerMap[item.username] || new Date(item.timestamp) > new Date(developerMap[item.username].timestamp)) {
        developerMap[item.username] = item;
      }
    });

    // Convert to array and sort by score
    const developers = Object.values(developerMap)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map(dev => ({
        username: dev.username,
        score: dev.score,
        commits: dev.commits,
        mergedPR: dev.mergedPR
      }));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(developers)
    };
  } catch (error) {
    console.error('Leaderboard error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: 'Failed to fetch leaderboard' })
    };
  }
};
