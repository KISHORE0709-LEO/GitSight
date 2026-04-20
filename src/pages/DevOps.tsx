import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { motion } from "framer-motion";
import { CheckCircle, Clock, XCircle, Loader2, AlertCircle, ExternalLink } from "lucide-react";

interface Build {
  id: string;
  name: string;
  branch: string;
  status: "success" | "failure" | "in_progress";
  duration: number;
  timestamp: string;
  url: string;
}

interface PipelineStage {
  name: string;
  description: string;
  status: "pending" | "running" | "success" | "failed";
}

const pipelineStages: PipelineStage[] = [
  { name: "Developer Push", description: "Code pushed to GitHub", status: "success" },
  { name: "CI/CD Execution", description: "GitHub Actions triggered", status: "success" },
  { name: "Test Results", description: "Unit & integration tests", status: "success" },
  { name: "Docker Image Build", description: "Container image build", status: "success" },
  { name: "AWS Deployment", description: "Push to ECR & update Lambda/ECS", status: "success" },
  { name: "Monitoring Activation", description: "Enable real-time monitoring", status: "success" },
];

export default function DevOps() {
  const [builds, setBuilds] = useState<Build[]>([]);
  const [loading, setLoading] = useState(true);
  const [stages, setStages] = useState<PipelineStage[]>(pipelineStages);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPipelineData = async () => {
      try {
        // Use relative path - Vite proxy will handle it
        const response = await fetch('/pipeline/status');
        
        if (response.ok) {
          const data = await response.json();
          setBuilds(data.builds || []);
          setStages(data.stages || pipelineStages);
          setError(null);
        } else {
          setError(`Failed to fetch pipeline data: ${response.statusText}`);
        }
      } catch (err) {
        console.error("Failed to fetch pipeline data:", err);
        setError("Unable to connect to pipeline service. Make sure your API Gateway is running.");
      } finally {
        setLoading(false);
      }
    };

    fetchPipelineData();
    const interval = setInterval(fetchPipelineData, 10000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-primary" />;
      case "failure":
      case "failed":
        return <XCircle className="h-4 w-4 text-destructive" />;
      case "in_progress":
      case "running":
        return <Loader2 className="h-4 w-4 text-warning animate-spin" />;
      default:
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "border-primary/20 bg-primary/5";
      case "failure":
      case "failed":
        return "border-destructive/20 bg-destructive/5";
      case "in_progress":
      case "running":
        return "border-warning/20 bg-warning/5";
      default:
        return "border-border";
    }
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ${seconds % 60}s`;
  };

  return (
    <Layout>
      <div className="px-6 py-10 max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">CI/CD Pipeline</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Automated build, test, and deployment workflow
          </p>
        </div>

        {error && (
          <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 flex items-center gap-3">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <div>
              <p className="text-sm font-semibold text-destructive">Connection Error</p>
              <p className="text-xs text-destructive/80 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Pipeline Stages */}
        <div className="rounded-xl border border-border card-shine p-6">
          <h2 className="text-lg font-bold text-foreground mb-6">Deployment Pipeline</h2>
          <div className="space-y-3">
            {stages.map((stage, i) => (
              <motion.div
                key={stage.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`p-4 rounded-lg border transition-all ${getStatusColor(stage.status)}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(stage.status)}
                    <div>
                      <p className="text-sm font-bold text-foreground">{stage.name}</p>
                      <p className="text-xs text-muted-foreground">{stage.description}</p>
                    </div>
                  </div>
                  <span
                    className={`text-xs font-mono font-bold uppercase ${
                      stage.status === "success"
                        ? "text-primary"
                        : stage.status === "failed"
                          ? "text-destructive"
                          : stage.status === "running"
                            ? "text-warning"
                            : "text-muted-foreground"
                    }`}
                  >
                    {stage.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recent Builds */}
        <div className="rounded-xl border border-border card-shine p-6">
          <h2 className="text-lg font-bold text-foreground mb-6">Recent Builds</h2>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 text-primary animate-spin" />
            </div>
          ) : builds.length > 0 ? (
            <div className="space-y-1">
              {builds.map((build, i) => (
                <motion.div
                  key={build.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between py-3 px-3 rounded-lg hover:bg-secondary/50 transition-all group"
                >
                  <div className="flex items-center gap-3 flex-1">
                    {build.status === "success" ? (
                      <CheckCircle className="h-4 w-4 text-primary" />
                    ) : build.status === "failure" ? (
                      <XCircle className="h-4 w-4 text-destructive" />
                    ) : (
                      <Loader2 className="h-4 w-4 text-warning animate-spin" />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono text-foreground font-bold">
                          {build.name}
                        </span>
                        <span className="text-xs text-muted-foreground px-1.5 py-0.5 rounded bg-secondary/80 border border-border">
                          {build.branch}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">{build.id}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-mono text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {formatDuration(build.duration)}
                    </span>
                    <span className="text-[10px] text-muted-foreground/60">
                      {new Date(build.timestamp).toLocaleString()}
                    </span>
                    <a
                      href={build.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ExternalLink className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">No builds found</p>
          )}
        </div>

        {/* Pipeline Configuration */}
        <div className="rounded-xl border border-border card-shine p-6">
          <h2 className="text-lg font-bold text-foreground mb-4">Pipeline Configuration</h2>
          <div className="rounded-lg bg-background/50 border border-border p-5 overflow-x-auto">
            <pre className="font-mono text-xs text-foreground/80 leading-relaxed">
              {`name: GitSight CI/CD
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run Tests
        run: npm test
      - name: Build Docker Image
        run: docker build -t gitsight-worker .
      - name: Push to ECR
        run: aws ecr push gitsight-worker:latest
      - name: Deploy Lambda
        run: aws lambda update-function-code ...
      - name: Deploy Workers
        run: aws ecs update-service ...`}
            </pre>
          </div>
        </div>

        {/* Deployment Environment */}
        <div className="rounded-xl border border-border card-shine p-6">
          <h2 className="text-lg font-bold text-foreground mb-4">Deployment Environment</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg bg-background/50 border border-border p-4">
              <p className="text-xs font-mono text-muted-foreground mb-2">AWS Region</p>
              <p className="text-sm font-bold text-foreground">us-east-1</p>
            </div>
            <div className="rounded-lg bg-background/50 border border-border p-4">
              <p className="text-xs font-mono text-muted-foreground mb-2">ECR Repository</p>
              <p className="text-sm font-bold text-foreground">gitsight-worker</p>
            </div>
            <div className="rounded-lg bg-background/50 border border-border p-4">
              <p className="text-xs font-mono text-muted-foreground mb-2">Lambda Functions</p>
              <p className="text-sm font-bold text-foreground">api-handler, collector, metrics</p>
            </div>
            <div className="rounded-lg bg-background/50 border border-border p-4">
              <p className="text-xs font-mono text-muted-foreground mb-2">ECS Service</p>
              <p className="text-sm font-bold text-foreground">gitsight-worker-service</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
