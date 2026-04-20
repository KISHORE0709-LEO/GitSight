const AWS = require('aws-sdk');

const sqs = new AWS.SQS({ region: process.env.AWS_REGION });
const dynamodb = new AWS.DynamoDB.DocumentClient({ region: process.env.AWS_REGION });
const lambda = new AWS.Lambda({ region: process.env.AWS_REGION });

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  };

  try {
    const path = event.rawPath || event.path || '';
    
    // Support both /api/architecture/status and /api/system-components
    const components = await getComponentStatus();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(components)
    };
  } catch (error) {
    console.error('Architecture status error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: 'Failed to fetch architecture status' })
    };
  }
};

async function getComponentStatus() {
  const components = [];

  // GitHub API
  components.push({
    name: 'GitHub API',
    description: 'REST API for developer activity',
    status: 'healthy'
  });

  // Lambda Collector
  try {
    await lambda.getFunction({ FunctionName: process.env.LAMBDA_COLLECTOR_NAME }).promise();
    components.push({
      name: 'Lambda Collector',
      description: 'Serverless data fetcher',
      status: 'healthy'
    });
  } catch {
    components.push({
      name: 'Lambda Collector',
      description: 'Serverless data fetcher',
      status: 'unavailable'
    });
  }

  // SQS Queue
  try {
    const attrs = await sqs.getQueueAttributes({
      QueueUrl: process.env.SQS_QUEUE_URL,
      AttributeNames: ['ApproximateNumberOfMessages']
    }).promise();
    
    const backlog = parseInt(attrs.Attributes.ApproximateNumberOfMessages);
    components.push({
      name: 'SQS Queue',
      description: 'Async message processing',
      status: backlog > 100 ? 'degraded' : 'healthy'
    });
  } catch {
    components.push({
      name: 'SQS Queue',
      description: 'Async message processing',
      status: 'unavailable'
    });
  }

  // Worker Services
  components.push({
    name: 'Worker Services',
    description: 'Metric processors',
    status: 'healthy'
  });

  // Retry Layer
  components.push({
    name: 'Retry Layer',
    description: 'Fault tolerance',
    status: 'healthy'
  });

  // DynamoDB
  try {
    await dynamodb.scan({
      TableName: process.env.DYNAMODB_TABLE,
      Limit: 1
    }).promise();
    components.push({
      name: 'DynamoDB',
      description: 'Metrics storage',
      status: 'healthy'
    });
  } catch {
    components.push({
      name: 'DynamoDB',
      description: 'Metrics storage',
      status: 'unavailable'
    });
  }

  // REST API
  components.push({
    name: 'REST API',
    description: 'Results endpoint',
    status: 'healthy'
  });

  // Prometheus
  components.push({
    name: 'Prometheus',
    description: 'Monitoring system',
    status: 'healthy'
  });

  return components;
}
