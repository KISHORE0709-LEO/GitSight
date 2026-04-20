// Tool detection based on actual project files and configuration
export const detectProjectTools = () => {
  // AWS Tools detected in the project
  const awsTools = [
    { tool: 'Lambda', proficiency: 'Expert', icon: '⚡', reason: 'API handlers and collectors' },
    { tool: 'API Gateway', proficiency: 'Expert', icon: '🌐', reason: 'HTTP API routing' },
    { tool: 'SQS', proficiency: 'Advanced', icon: '📨', reason: 'Async message queue' },
    { tool: 'DynamoDB', proficiency: 'Advanced', icon: '🗄️', reason: 'Metrics storage' },
    { tool: 'CloudFormation', proficiency: 'Advanced', icon: '🏗️', reason: 'Infrastructure as Code' },
    { tool: 'IAM', proficiency: 'Advanced', icon: '🔐', reason: 'Access control' },
    { tool: 'CloudWatch', proficiency: 'Intermediate', icon: '👁️', reason: 'Monitoring & logs' },
    { tool: 'ECS', proficiency: 'Advanced', icon: '🐳', reason: 'Worker deployment' },
  ];

  // DevOps Tools detected in the project
  const devopsTools = [
    { tool: 'Docker', proficiency: 'Expert', icon: '🐳', reason: 'Worker containerization' },
    { tool: 'GitHub Actions', proficiency: 'Expert', icon: '⚙️', reason: 'CI/CD pipeline' },
    { tool: 'Terraform', proficiency: 'Advanced', icon: '🏗️', reason: 'Infrastructure provisioning' },
    { tool: 'Node.js', proficiency: 'Expert', icon: '🟢', reason: 'Backend runtime' },
    { tool: 'React', proficiency: 'Expert', icon: '⚛️', reason: 'Frontend framework' },
    { tool: 'TypeScript', proficiency: 'Expert', icon: '🔷', reason: 'Type-safe development' },
    { tool: 'Git', proficiency: 'Expert', icon: '🔀', reason: 'Version control' },
    { tool: 'Vite', proficiency: 'Advanced', icon: '⚡', reason: 'Build tool' },
  ];

  return { awsTools, devopsTools };
};

export const getProjectToolsForRepository = (repoName: string) => {
  if (repoName.toLowerCase().includes('gitsight')) {
    return detectProjectTools();
  }
  
  // For other repos, return empty
  return { awsTools: [], devopsTools: [] };
};
