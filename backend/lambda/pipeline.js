const https = require("https");

const GITHUB_OWNER = process.env.GITHUB_OWNER || "your-org";
const GITHUB_REPO = process.env.GITHUB_REPO || "GitSight";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json",
};

function makeGitHubRequest(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "api.github.com",
      path,
      method: "GET",
      headers: {
        "User-Agent": "GitSight-DevOps",
        Authorization: GITHUB_TOKEN ? `token ${GITHUB_TOKEN}` : "",
      },
    };

    https
      .get(options, (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          try {
            resolve(JSON.parse(data));
          } catch {
            resolve(null);
          }
        });
      })
      .on("error", reject);
  });
}

async function getWorkflowRuns() {
  try {
    const path = `/repos/${GITHUB_OWNER}/${GITHUB_REPO}/actions/runs?per_page=10`;
    const data = await makeGitHubRequest(path);

    if (!data || !data.workflow_runs) {
      return [];
    }

    return data.workflow_runs.map((run) => ({
      id: run.id.toString(),
      name: run.name,
      branch: run.head_branch,
      status: run.conclusion === "success" ? "success" : run.conclusion === "failure" ? "failure" : "in_progress",
      duration: Math.floor((new Date(run.updated_at) - new Date(run.created_at)) / 1000),
      timestamp: run.created_at,
      url: run.html_url,
    }));
  } catch (error) {
    console.error("Error fetching workflow runs:", error);
    return [];
  }
}

function getPipelineStages(builds) {
  if (builds.length === 0) {
    return [
      { name: "Developer Push", description: "Code pushed to GitHub", status: "pending" },
      { name: "CI/CD Execution", description: "GitHub Actions triggered", status: "pending" },
      { name: "Test Results", description: "Unit & integration tests", status: "pending" },
      { name: "Docker Image Build", description: "Container image build", status: "pending" },
      { name: "AWS Deployment", description: "Push to ECR & update Lambda/ECS", status: "pending" },
      { name: "Monitoring Activation", description: "Enable real-time monitoring", status: "pending" },
    ];
  }

  const latestBuild = builds[0];
  const stageMap = {
    success: "success",
    failure: "failed",
    in_progress: "running",
  };

  const baseStages = [
    { name: "Developer Push", description: "Code pushed to GitHub", status: "success" },
    { name: "CI/CD Execution", description: "GitHub Actions triggered", status: stageMap[latestBuild.status] },
  ];

  if (latestBuild.status === "success") {
    baseStages.push(
      { name: "Test Results", description: "Unit & integration tests", status: "success" },
      { name: "Docker Image Build", description: "Container image build", status: "success" },
      { name: "AWS Deployment", description: "Push to ECR & update Lambda/ECS", status: "success" },
      { name: "Monitoring Activation", description: "Enable real-time monitoring", status: "success" }
    );
  } else if (latestBuild.status === "failure") {
    baseStages.push(
      { name: "Test Results", description: "Unit & integration tests", status: "failed" },
      { name: "Docker Image Build", description: "Container image build", status: "pending" },
      { name: "AWS Deployment", description: "Push to ECR & update Lambda/ECS", status: "pending" },
      { name: "Monitoring Activation", description: "Enable real-time monitoring", status: "pending" }
    );
  } else {
    baseStages.push(
      { name: "Test Results", description: "Unit & integration tests", status: "running" },
      { name: "Docker Image Build", description: "Container image build", status: "pending" },
      { name: "AWS Deployment", description: "Push to ECR & update Lambda/ECS", status: "pending" },
      { name: "Monitoring Activation", description: "Enable real-time monitoring", status: "pending" }
    );
  }

  return baseStages;
}

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  try {
    const builds = await getWorkflowRuns();
    const stages = getPipelineStages(builds);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        builds,
        stages,
        lastUpdated: new Date().toISOString(),
      }),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: "Failed to fetch pipeline status" }),
    };
  }
};
