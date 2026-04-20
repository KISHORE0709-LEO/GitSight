import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { motion } from "framer-motion";
import { useAnalysis } from "@/context/AnalysisContext";
import { Shield, RefreshCw, Layers, CheckCircle, AlertCircle, XCircle } from "lucide-react";

interface Component {
  name: string;
  description: string;
  status: "healthy" | "degraded" | "unavailable";
}

const components: Component[] = [
  { name: "GitHub API", description: "REST API for developer activity", status: "healthy" },
  { name: "Lambda Collector", description: "Serverless data fetcher", status: "healthy" },
  { name: "SQS Queue", description: "Async message processing", status: "healthy" },
  { name: "Worker Services", description: "Metric processors", status: "healthy" },
  { name: "Retry Layer", description: "Fault tolerance", status: "healthy" },
  { name: "DynamoDB", description: "Metrics storage", status: "healthy" },
  { name: "REST API", description: "Results endpoint", status: "healthy" },
  { name: "Prometheus", description: "Monitoring system", status: "healthy" },
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case "healthy":
      return <CheckCircle className="h-4 w-4 text-primary" />;
    case "degraded":
      return <AlertCircle className="h-4 w-4 text-warning" />;
    case "unavailable":
      return <XCircle className="h-4 w-4 text-destructive" />;
    default:
      return null;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "healthy":
      return "border-primary/20 bg-primary/5";
    case "degraded":
      return "border-warning/20 bg-warning/5";
    case "unavailable":
      return "border-destructive/20 bg-destructive/5";
    default:
      return "border-border";
  }
};

export default function Architecture() {
  const { analyzedUsername } = useAnalysis();
  const [componentStatus, setComponentStatus] = useState<Component[]>(components);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch(`/api/architecture/status`);
        if (response.ok) {
          const data = await response.json();
          setComponentStatus(data);
        }
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch architecture status:', error);
        setLoading(false);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const healthyCount = componentStatus.filter(c => c.status === "healthy").length;
  const degradedCount = componentStatus.filter(c => c.status === "degraded").length;
  const unavailableCount = componentStatus.filter(c => c.status === "unavailable").length;

  return (
    <Layout>
      <div className="px-6 py-10 max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {analyzedUsername ? `Architecture for @${analyzedUsername}` : "System Architecture"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Event-driven cloud-native processing pipeline with live component status</p>
        </div>

        {analyzedUsername && (
          <div className="p-4 rounded-xl border border-primary/20 bg-primary/5">
            <p className="text-sm font-mono text-primary">
              Showing architecture for: <span className="font-bold">@{analyzedUsername}</span>
            </p>
          </div>
        )}

        {/* System Health Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-primary/20 bg-primary/5">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs font-mono text-muted-foreground uppercase">Healthy</p>
                <p className="text-2xl font-bold text-foreground">{healthyCount}/{componentStatus.length}</p>
              </div>
            </div>
          </div>
          <div className="p-4 rounded-xl border border-warning/20 bg-warning/5">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-warning" />
              <div>
                <p className="text-xs font-mono text-muted-foreground uppercase">Degraded</p>
                <p className="text-2xl font-bold text-foreground">{degradedCount}</p>
              </div>
            </div>
          </div>
          <div className="p-4 rounded-xl border border-destructive/20 bg-destructive/5">
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-destructive" />
              <div>
                <p className="text-xs font-mono text-muted-foreground uppercase">Unavailable</p>
                <p className="text-2xl font-bold text-foreground">{unavailableCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Processing Pipeline */}
        <div className="rounded-xl border border-border card-shine p-6">
          <h2 className="text-lg font-bold text-foreground mb-6">Processing Pipeline</h2>
          <div className="space-y-3">
            {componentStatus.map((component, i) => (
              <motion.div
                key={component.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`p-4 rounded-lg border transition-all ${getStatusColor(component.status)}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(component.status)}
                    <div>
                      <p className="text-sm font-bold text-foreground">{component.name}</p>
                      <p className="text-xs text-muted-foreground">{component.description}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-mono font-bold uppercase ${
                    component.status === "healthy" ? "text-primary" :
                    component.status === "degraded" ? "text-warning" :
                    "text-destructive"
                  }`}>
                    {component.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Reliability Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl border border-border card-shine p-6">
            <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 w-fit mb-4">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-sm font-bold text-foreground">Fault Tolerance</h3>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">Retry mechanisms with exponential backoff. Failed API calls retry up to 3 times before logging.</p>
          </div>
          <div className="rounded-xl border border-border card-shine p-6">
            <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 w-fit mb-4">
              <RefreshCw className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-sm font-bold text-foreground">Self-Healing</h3>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">Docker health checks auto-restart failed containers. Queue processing resumes automatically.</p>
          </div>
          <div className="rounded-xl border border-border card-shine p-6">
            <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 w-fit mb-4">
              <Layers className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-sm font-bold text-foreground">Decoupled Services</h3>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">SQS queues isolate failures. Collector, workers, and API operate independently.</p>
          </div>
        </div>

        {/* Data Flow */}
        <div className="rounded-xl border border-border card-shine p-6">
          <h2 className="text-lg font-bold text-foreground mb-4">Event-Driven Data Flow</h2>
          <div className="font-mono text-xs text-muted-foreground space-y-2">
            <p>GitHub User Input</p>
            <p className="text-muted-foreground/50">↓</p>
            <p>Lambda Collector fetches commits & PRs</p>
            <p className="text-muted-foreground/50">↓</p>
            <p>SQS Queue receives job message</p>
            <p className="text-muted-foreground/50">↓</p>
            <p>Workers consume messages from queue</p>
            <p className="text-muted-foreground/50">↓</p>
            <p>Workers process GitHub data</p>
            <p className="text-muted-foreground/50">↓</p>
            <p>DynamoDB stores computed results</p>
            <p className="text-muted-foreground/50">↓</p>
            <p>REST API serves metrics to frontend</p>
            <p className="text-muted-foreground/50">↓</p>
            <p>Prometheus exports time-series data</p>
            <p className="text-muted-foreground/50">↓</p>
            <p>Metrics API aggregates system metrics</p>
            <p className="text-muted-foreground/50">↓</p>
            <p>Frontend Dashboard visualizes data</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
