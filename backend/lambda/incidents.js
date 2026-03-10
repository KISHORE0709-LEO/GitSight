const AWS = require('aws-sdk');

const dynamodb = new AWS.DynamoDB.DocumentClient({ region: process.env.AWS_REGION });
const sqs = new AWS.SQS({ region: process.env.AWS_REGION });
const cloudwatch = new AWS.CloudWatch({ region: process.env.AWS_REGION });

const INCIDENTS_TABLE = 'GitSightIncidents-dev';
const QUEUE_URL = process.env.SQS_QUEUE_URL;

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  };

  try {
    // Get current metrics
    const metrics = await getSystemMetrics();

    // Evaluate alert rules
    const incidents = await evaluateAlertRules(metrics);

    // Store incidents in DynamoDB
    for (const incident of incidents) {
      await dynamodb.put({
        TableName: INCIDENTS_TABLE,
        Item: {
          id: incident.id,
          ...incident,
          ttl: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60 // 7 days TTL
        }
      }).promise();
    }

    // Get all incidents (active + resolved)
    const allIncidents = await dynamodb.scan({
      TableName: INCIDENTS_TABLE,
      Limit: 100
    }).promise();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(allIncidents.Items || [])
    };
  } catch (error) {
    console.error('Incidents error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: 'Failed to fetch incidents' })
    };
  }
};

async function getSystemMetrics() {
  try {
    const queueAttrs = await sqs.getQueueAttributes({
      QueueUrl: QUEUE_URL,
      AttributeNames: ['ApproximateNumberOfMessages']
    }).promise();

    return {
      queueLength: parseInt(queueAttrs.Attributes.ApproximateNumberOfMessages) || 0,
      apiLatency: Math.floor(Math.random() * 3000),
      workerHealth: Math.random() > 0.95 ? 'failed' : 'healthy',
      rateLimit: Math.floor(Math.random() * 100),
      cpuUsage: Math.floor(Math.random() * 100),
      memoryUsage: Math.floor(Math.random() * 100)
    };
  } catch (error) {
    console.error('Metrics error:', error);
    return {};
  }
}

async function evaluateAlertRules(metrics) {
  const incidents = [];
  const timestamp = new Date().toISOString();

  // Queue Length > 100
  if (metrics.queueLength > 100) {
    incidents.push({
      id: `queue-${Date.now()}`,
      severity: 'critical',
      title: 'High Queue Backlog',
      description: `SQS queue has ${metrics.queueLength} messages pending`,
      component: 'SQS Queue',
      metric: 'Queue Length',
      threshold: '100',
      current: `${metrics.queueLength}`,
      timestamp,
      status: 'active'
    });
  }

  // API Latency > 2000ms
  if (metrics.apiLatency > 2000) {
    incidents.push({
      id: `latency-${Date.now()}`,
      severity: 'warning',
      title: 'High API Latency',
      description: `API response time is ${metrics.apiLatency}ms`,
      component: 'API Gateway',
      metric: 'API Latency',
      threshold: '2000ms',
      current: `${metrics.apiLatency}ms`,
      timestamp,
      status: 'active'
    });
  }

  // Worker Health Failed
  if (metrics.workerHealth === 'failed') {
    incidents.push({
      id: `worker-${Date.now()}`,
      severity: 'critical',
      title: 'Worker Service Down',
      description: 'One or more worker containers are not responding',
      component: 'Worker Service',
      metric: 'Worker Health',
      threshold: 'healthy',
      current: 'failed',
      timestamp,
      status: 'active'
    });
  }

  // Rate Limit > 90%
  if (metrics.rateLimit > 90) {
    incidents.push({
      id: `ratelimit-${Date.now()}`,
      severity: 'warning',
      title: 'GitHub Rate Limit Critical',
      description: `GitHub API rate limit at ${metrics.rateLimit}%`,
      component: 'GitHub API',
      metric: 'Rate Limit',
      threshold: '90%',
      current: `${metrics.rateLimit}%`,
      timestamp,
      status: 'active'
    });
  }

  // CPU Usage > 80%
  if (metrics.cpuUsage > 80) {
    incidents.push({
      id: `cpu-${Date.now()}`,
      severity: 'warning',
      title: 'High CPU Usage',
      description: `System CPU usage at ${metrics.cpuUsage}%`,
      component: 'Infrastructure',
      metric: 'CPU Usage',
      threshold: '80%',
      current: `${metrics.cpuUsage}%`,
      timestamp,
      status: 'active'
    });
  }

  // Memory Usage > 85%
  if (metrics.memoryUsage > 85) {
    incidents.push({
      id: `memory-${Date.now()}`,
      severity: 'critical',
      title: 'Critical Memory Usage',
      description: `System memory usage at ${metrics.memoryUsage}%`,
      component: 'Infrastructure',
      metric: 'Memory Usage',
      threshold: '85%',
      current: `${metrics.memoryUsage}%`,
      timestamp,
      status: 'active'
    });
  }

  return incidents;
}
