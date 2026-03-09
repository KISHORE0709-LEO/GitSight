import { Layout } from "@/components/Layout";
import { FlowDiagram } from "@/components/FlowDiagram";
import { motion } from "framer-motion";
import { CheckCircle, Clock } from "lucide-react";

const cicdSteps = [
  { label: "Developer Push", description: "Code pushed to GitHub repository" },
  { label: "GitHub Actions CI/CD", description: "Automated pipeline triggered" },
  { label: "Run Tests", description: "Unit, integration, and lint checks" },
  { label: "Build Docker Images", description: "Containerize worker services" },
  { label: "Deploy to AWS", description: "Push to ECR, update Lambda & ECS" },
  { label: "Monitoring & Logging", description: "Prometheus scraping begins" },
];

const recentBuilds = [
  { id: "#247", branch: "main", status: "success", duration: "2m 14s", time: "5 min ago" },
  { id: "#246", branch: "feat/queue-retry", status: "success", duration: "2m 38s", time: "1 hour ago" },
  { id: "#245", branch: "fix/latency-spike", status: "success", duration: "1m 52s", time: "3 hours ago" },
  { id: "#244", branch: "feat/chaos-tests", status: "failed", duration: "1m 06s", time: "5 hours ago" },
  { id: "#243", branch: "main", status: "success", duration: "2m 21s", time: "8 hours ago" },
];

export default function DevOps() {
  return (
    <Layout>
      <div className="px-6 py-10 max-w-6xl mx-auto space-y-10">
        <div>
          <h1 className="text-2xl font-bold text-foreground">CI/CD Pipeline</h1>
          <p className="text-sm text-muted-foreground mt-1">Automated build, test, and deployment workflow</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="rounded-lg border border-border bg-card p-6">
            <FlowDiagram steps={cicdSteps} title="Deployment Pipeline" />
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-4">Recent Builds</h3>
            <div className="space-y-2">
              {recentBuilds.map((build, i) => (
                <motion.div
                  key={build.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between py-2.5 px-3 rounded-md hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {build.status === "success" ? (
                      <CheckCircle className="h-4 w-4 text-primary" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border-2 border-destructive flex items-center justify-center">
                        <div className="h-1.5 w-1.5 bg-destructive rounded-full" />
                      </div>
                    )}
                    <div>
                      <span className="text-sm font-mono text-foreground">{build.id}</span>
                      <span className="text-xs text-muted-foreground ml-2">{build.branch}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-mono text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {build.duration}
                    </span>
                    <span className="text-[10px] text-muted-foreground">{build.time}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-4">Pipeline Configuration</h3>
          <pre className="font-mono text-xs text-foreground/80 overflow-x-auto">
{`name: CI/CD Pipeline
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
        run: python -m pytest tests/
      - name: Build Docker Image
        run: docker build -t ghops-worker .
      - name: Push to ECR
        run: aws ecr push ghops-worker:latest
      - name: Deploy Lambda
        run: aws lambda update-function-code ...
      - name: Deploy Workers
        run: aws ecs update-service ...`}
          </pre>
        </div>
      </div>
    </Layout>
  );
}
