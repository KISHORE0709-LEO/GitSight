const AWS = require('aws-sdk');

const sqs = new AWS.SQS({ region: process.env.AWS_REGION });
const ecs = new AWS.ECS({ region: process.env.AWS_REGION });

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  };

  try {
    const path = event.rawPath || event.path || '';
    const isWorkerFailure = path.includes('worker-failure');

    if (isWorkerFailure) {
      return await simulateWorkerFailure(headers);
    } else {
      return await simulateApiFailure(headers);
    }
  } catch (error) {
    console.error('Chaos error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: 'Chaos simulation failed', error: error.message })
    };
  }
};

async function simulateWorkerFailure(headers) {
  const events = [
    { message: 'Worker-2 stopped', type: 'error' },
    { message: 'Queue backlog increasing...', type: 'warning' },
    { message: 'Health check failed', type: 'error' },
    { message: 'Auto-recovery triggered', type: 'warning' },
    { message: 'Worker-2 restarted successfully', type: 'success' },
    { message: 'Queue processing resumed', type: 'success' }
  ];

  // Simulate queue backlog increase
  try {
    const queueAttrs = await sqs.getQueueAttributes({
      QueueUrl: process.env.SQS_QUEUE_URL,
      AttributeNames: ['ApproximateNumberOfMessages']
    }).promise();
    
    const currentBacklog = parseInt(queueAttrs.Attributes.ApproximateNumberOfMessages);
    events.push({ message: `Queue backlog: ${currentBacklog} → ${currentBacklog + 50}`, type: 'warning' });
  } catch (e) {
    console.error('Queue check failed:', e);
  }

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      events,
      recovered: true,
      recoveryTime: '~5 seconds'
    })
  };
}

async function simulateApiFailure(headers) {
  const events = [
    { message: 'GitHub API returning 503 Service Unavailable', type: 'error' },
    { message: 'Retry attempt 1/3 with exponential backoff', type: 'warning' },
    { message: 'Waiting 2 seconds before retry...', type: 'info' },
    { message: 'Retry attempt 2/3', type: 'warning' },
    { message: 'GitHub API recovered', type: 'success' },
    { message: 'Processing resumed normally', type: 'success' }
  ];

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      events,
      recovered: true,
      recoveryTime: '~4 seconds',
      retryAttempts: 2
    })
  };
}
