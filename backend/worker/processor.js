const AWS = require('aws-sdk');
const axios = require('axios');

const sqs = new AWS.SQS({ region: process.env.AWS_REGION || 'us-east-1' });
const dynamodb = new AWS.DynamoDB.DocumentClient({ region: process.env.AWS_REGION || 'us-east-1' });

const QUEUE_URL = process.env.SQS_QUEUE_URL;
const TABLE_NAME = process.env.DYNAMODB_TABLE || 'GitSightMetrics';

async function processMessage(message) {
  const data = JSON.parse(message.Body);
  const { username, commits, mergedPR, rejectedPR } = data;

  // Calculate productivity score
  const score = commits * 1 + mergedPR * 5 - rejectedPR * 2;

  // Fetch weekly activity
  const weeklyActivity = await fetchWeeklyActivity(username);

  // Store in DynamoDB
  await dynamodb.put({
    TableName: TABLE_NAME,
    Item: {
      username,
      commits,
      mergedPR,
      rejectedPR,
      score,
      weeklyActivity,
      timestamp: new Date().toISOString(),
      ttl: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60 // 30 days TTL
    }
  }).promise();

  console.log(`Processed metrics for ${username}: score=${score}`);
}

async function fetchWeeklyActivity(username) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const activity = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dayName = days[date.getDay() === 0 ? 6 : date.getDay() - 1];

    try {
      const response = await axios.get(
        `https://api.github.com/search/commits?q=author:${username}+committer-date:${date.toISOString().split('T')[0]}`,
        { headers: { 'User-Agent': 'GitSight-App', 'Accept': 'application/vnd.github.cloak-preview' } }
      );
      activity.push({ day: dayName, commits: response.data.total_count || 0 });
    } catch {
      activity.push({ day: dayName, commits: 0 });
    }
  }

  return activity;
}

async function pollQueue() {
  while (true) {
    try {
      const result = await sqs.receiveMessage({
        QueueUrl: QUEUE_URL,
        MaxNumberOfMessages: 1,
        WaitTimeSeconds: 20
      }).promise();

      if (result.Messages) {
        for (const message of result.Messages) {
          await processMessage(message);
          await sqs.deleteMessage({
            QueueUrl: QUEUE_URL,
            ReceiptHandle: message.ReceiptHandle
          }).promise();
        }
      }
    } catch (error) {
      console.error('Worker error:', error);
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
}

console.log('Worker started, polling SQS...');
pollQueue();
