const AWS = require('aws-sdk');
const https = require('https');

const sqs = new AWS.SQS({ region: process.env.AWS_REGION });
const QUEUE_URL = process.env.SQS_QUEUE_URL;

exports.handler = async (event) => {
  const { username } = event;

  try {
    // Fetch GitHub data
    const [commits, pullRequests, userInfo] = await Promise.all([
      fetchCommits(username),
      fetchPullRequests(username),
      fetchUserInfo(username)
    ]);

    const mergedPRs = pullRequests.filter(pr => pr.pull_request?.merged_at).length;
    const rejectedPRs = pullRequests.filter(pr => pr.state === 'closed' && !pr.pull_request?.merged_at).length;
    const totalCommits = commits.length;

    // Calculate score
    const score = totalCommits * 1 + mergedPRs * 5 - rejectedPRs * 2;

    // Get weekly activity
    const weeklyActivity = await getWeeklyActivity(username);

    const result = {
      username,
      commits: totalCommits,
      mergedPR: mergedPRs,
      rejectedPR: rejectedPRs,
      score,
      weeklyActivity,
      repositories: userInfo?.public_repos || 0,
      timestamp: new Date().toISOString()
    };

    // Push to SQS for async storage
    await sqs.sendMessage({
      QueueUrl: QUEUE_URL,
      MessageBody: JSON.stringify(result)
    }).promise();

    // Return results immediately to frontend
    return {
      statusCode: 200,
      body: JSON.stringify(result)
    };
  } catch (error) {
    console.error('Collector error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to collect GitHub data' })
    };
  }
};

function fetchUserInfo(username) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'api.github.com',
      path: `/users/${username}`,
      headers: { 'User-Agent': 'GitSight-App' }
    };

    https.get(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

function fetchCommits(username) {
  return new Promise((resolve) => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    const since = date.toISOString();

    const options = {
      hostname: 'api.github.com',
      path: `/search/commits?q=author:${username}+committer-date:>${since}`,
      headers: {
        'User-Agent': 'GitSight-App',
        'Accept': 'application/vnd.github.cloak-preview'
      }
    };

    https.get(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json.items || []);
        } catch (e) {
          resolve([]);
        }
      });
    }).on('error', () => resolve([]));
  });
}

function fetchPullRequests(username) {
  return new Promise((resolve) => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    const since = date.toISOString().split('T')[0];

    const options = {
      hostname: 'api.github.com',
      path: `/search/issues?q=author:${username}+type:pr+created:>=${since}`,
      headers: { 'User-Agent': 'GitSight-App' }
    };

    https.get(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json.items || []);
        } catch (e) {
          resolve([]);
        }
      });
    }).on('error', () => resolve([]));
  });
}

async function getWeeklyActivity(username) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const activity = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dayName = days[date.getDay()];
    const dateStr = date.toISOString().split('T')[0];

    const count = await new Promise((resolve) => {
      const options = {
        hostname: 'api.github.com',
        path: `/search/commits?q=author:${username}+committer-date:${dateStr}`,
        headers: {
          'User-Agent': 'GitSight-App',
          'Accept': 'application/vnd.github.cloak-preview'
        }
      };

      https.get(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            resolve(json.total_count || 0);
          } catch (e) {
            resolve(0);
          }
        });
      }).on('error', () => resolve(0));
    });

    activity.push({ day: dayName, commits: count });
  }

  return activity;
}
