// Mock API service with real GitHub data fallback
export interface AnalysisResult {
  username: string;
  commits: number;
  mergedPR: number;
  rejectedPR: number;
  score: number;
  weeklyActivity: { day: string; commits: number }[];
  repositories: number;
  followers: number;
  following: number;
  publicGists: number;
  createdAt: string;
  topLanguages: { language: string; percentage: number }[];
  recentRepos: { name: string; stars: number; language: string }[];
  awsTools: { tool: string; proficiency: string; icon: string }[];
  devopsTools: { tool: string; proficiency: string; icon: string }[];
}

export interface SystemMetrics {
  latency: number;
  queueBacklog: number;
  cpuUsage: number;
  apiRate: number;
  workerHealth: string;
  uptime: string;
  activeIncidents: number;
  lastUpdated: string;
}

export interface Developer {
  username: string;
  score: number;
  commits: number;
  mergedPR: number;
  rank: number;
}

export interface Incident {
  id: string;
  severity: "critical" | "warning" | "info";
  title: string;
  description: string;
  component: string;
  timestamp: string;
  status: "active" | "resolved";
  metric: string;
  threshold: string;
  current: string;
}

const GITHUB_API = 'https://api.github.com';

const awsToolsList = [
  { tool: 'Lambda', proficiency: 'Expert', icon: '⚡' },
  { tool: 'EC2', proficiency: 'Advanced', icon: '🖥️' },
  { tool: 'S3', proficiency: 'Expert', icon: '📦' },
  { tool: 'DynamoDB', proficiency: 'Intermediate', icon: '🗄️' },
  { tool: 'RDS', proficiency: 'Advanced', icon: '🗃️' },
  { tool: 'CloudFormation', proficiency: 'Expert', icon: '🏗️' },
  { tool: 'API Gateway', proficiency: 'Advanced', icon: '🌐' },
  { tool: 'SQS', proficiency: 'Intermediate', icon: '📨' },
  { tool: 'SNS', proficiency: 'Intermediate', icon: '📢' },
  { tool: 'CloudWatch', proficiency: 'Advanced', icon: '👁️' },
  { tool: 'IAM', proficiency: 'Expert', icon: '🔐' },
  { tool: 'ECS', proficiency: 'Advanced', icon: '🐳' },
];

const devopsToolsList = [
  { tool: 'Docker', proficiency: 'Expert', icon: '🐳' },
  { tool: 'Kubernetes', proficiency: 'Advanced', icon: '☸️' },
  { tool: 'GitHub Actions', proficiency: 'Expert', icon: '⚙️' },
  { tool: 'Jenkins', proficiency: 'Advanced', icon: '🔧' },
  { tool: 'Terraform', proficiency: 'Expert', icon: '🏗️' },
  { tool: 'Ansible', proficiency: 'Intermediate', icon: '🤖' },
  { tool: 'Prometheus', proficiency: 'Advanced', icon: '📊' },
  { tool: 'Grafana', proficiency: 'Advanced', icon: '📈' },
  { tool: 'ELK Stack', proficiency: 'Intermediate', icon: '📝' },
  { tool: 'Git', proficiency: 'Expert', icon: '🔀' },
  { tool: 'Linux', proficiency: 'Expert', icon: '🐧' },
  { tool: 'Nginx', proficiency: 'Advanced', icon: '⚙️' },
];

const getRandomTools = (toolsList: any[], count: number) => {
  const shuffled = [...toolsList].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

const generateWeeklyActivity = () => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days.map(day => ({
    day,
    commits: Math.floor(Math.random() * 15) + 2
  }));
};

const generateTopLanguages = () => {
  const languages = ['JavaScript', 'TypeScript', 'Python', 'Go', 'Rust', 'Java'];
  const selected = languages.slice(0, Math.floor(Math.random() * 3) + 2);
  let remaining = 100;
  return selected.map((lang, i) => {
    const percentage = i === selected.length - 1 ? remaining : Math.floor(Math.random() * 40) + 10;
    remaining -= percentage;
    return { language: lang, percentage };
  });
};

const generateRecentRepos = (username: string) => {
  const repos = [
    { name: `${username}/awesome-project`, stars: Math.floor(Math.random() * 500) + 50, language: 'TypeScript' },
    { name: `${username}/api-service`, stars: Math.floor(Math.random() * 300) + 20, language: 'Go' },
    { name: `${username}/cli-tool`, stars: Math.floor(Math.random() * 200) + 10, language: 'Rust' },
  ];
  return repos;
};

const fetchGitHubUser = async (username: string) => {
  try {
    const res = await fetch(`${GITHUB_API}/users/${username}`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
};

const fetchGitHubRepos = async (username: string) => {
  try {
    const res = await fetch(`${GITHUB_API}/users/${username}/repos?sort=stars&per_page=6`);
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
};

const calculateLanguageStats = (repos: any[]) => {
  const langMap: { [key: string]: number } = {};
  repos.forEach(repo => {
    if (repo.language) {
      langMap[repo.language] = (langMap[repo.language] || 0) + 1;
    }
  });
  
  const total = Object.values(langMap).reduce((a, b) => a + b, 0) || 1;
  return Object.entries(langMap)
    .map(([lang, count]) => ({
      language: lang,
      percentage: Math.round((count as number / total) * 100)
    }))
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 5);
};

const formatRecentRepos = (repos: any[]) => {
  return repos.slice(0, 3).map(repo => ({
    name: repo.full_name,
    stars: repo.stargazers_count || 0,
    language: repo.language || 'Unknown'
  }));
};

export const mockApi = {
  async analyzeUser(username: string): Promise<AnalysisResult> {
    await new Promise(resolve => setTimeout(resolve, 500));

    // Fetch real GitHub data
    const [userInfo, repos] = await Promise.all([
      fetchGitHubUser(username),
      fetchGitHubRepos(username)
    ]);

    if (!userInfo) {
      throw new Error('User not found on GitHub');
    }

    // Use real data where available, fallback to generated data
    const commits = Math.floor(Math.random() * 200) + 50;
    const mergedPR = Math.floor(Math.random() * 30) + 5;
    const rejectedPR = Math.floor(Math.random() * 10) + 1;
    const score = commits * 1 + mergedPR * 5 - rejectedPR * 2;

    return {
      username: userInfo.login,
      commits,
      mergedPR,
      rejectedPR,
      score,
      weeklyActivity: generateWeeklyActivity(),
      repositories: userInfo.public_repos || 0,
      followers: userInfo.followers || 0,
      following: userInfo.following || 0,
      publicGists: userInfo.public_gists || 0,
      createdAt: userInfo.created_at || new Date().toISOString(),
      topLanguages: repos.length > 0 ? calculateLanguageStats(repos) : generateTopLanguages(),
      recentRepos: repos.length > 0 ? formatRecentRepos(repos) : generateRecentRepos(username),
      awsTools: getRandomTools(awsToolsList, 5),
      devopsTools: getRandomTools(devopsToolsList, 5),
    };
  },

  async getSystemMetrics(): Promise<SystemMetrics> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return {
      latency: Math.floor(Math.random() * 500) + 50,
      queueBacklog: Math.floor(Math.random() * 50),
      cpuUsage: Math.floor(Math.random() * 60) + 20,
      apiRate: Math.floor(Math.random() * 100) + 30,
      workerHealth: Math.random() > 0.1 ? 'healthy' : 'degraded',
      uptime: `${Math.floor(Math.random() * 30) + 1}d ${Math.floor(Math.random() * 24)}h`,
      activeIncidents: Math.random() > 0.7 ? Math.floor(Math.random() * 3) : 0,
      lastUpdated: new Date().toISOString(),
    };
  },

  async getLeaderboard(): Promise<Developer[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const developers = ['octocat', 'torvalds', 'gaearon', 'dhh', 'antirez', 'bnoordhuis'];
    
    const leaderboard = await Promise.all(
      developers.map(async (username, i) => {
        const userInfo = await fetchGitHubUser(username);
        const commits = Math.floor(Math.random() * 300) + 100 - i * 20;
        const mergedPR = Math.floor(Math.random() * 50) + 20 - i * 3;
        const score = commits * 1 + mergedPR * 5;
        
        return {
          username: userInfo?.login || username,
          score,
          commits,
          mergedPR,
          rank: i + 1,
        };
      })
    );
    
    return leaderboard.sort((a, b) => b.score - a.score);
  },

  async getIncidents(username: string): Promise<Incident[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const incidents: Incident[] = [];
    
    if (Math.random() > 0.6) {
      incidents.push({
        id: '1',
        severity: 'warning',
        title: 'High API Latency Detected',
        description: `API response time exceeded threshold for user ${username}`,
        component: 'API Gateway',
        timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
        status: 'active',
        metric: 'Response Time',
        threshold: '2000ms',
        current: `${Math.floor(Math.random() * 1000) + 2500}ms`,
      });
    }

    if (Math.random() > 0.8) {
      incidents.push({
        id: '2',
        severity: 'info',
        title: 'Queue Processing Delay',
        description: 'SQS queue processing slower than expected',
        component: 'Worker Service',
        timestamp: new Date(Date.now() - 10 * 60000).toISOString(),
        status: 'active',
        metric: 'Queue Latency',
        threshold: '5s',
        current: `${Math.floor(Math.random() * 3) + 6}s`,
      });
    }

    return incidents;
  },
};
