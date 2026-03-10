import { Layout } from "@/components/Layout";
import { FlowDiagram } from "@/components/FlowDiagram";
import { motion } from "framer-motion";
import { Shield, RefreshCw, Layers } from "lucide-react";

const mainFlow = [
  { label: "GitHub API", description: "REST API for developer activity data" },
  { label: "Data Collector (AWS Lambda)", description: "Serverless function fetches commits, PRs" },
  { label: "Message Queue (AWS SQS)", description: "Decoupled async processing" },
  { label: "Worker Services (Docker)", description: "Containerized metric processors" },
  { label: "Retry + Logging Layer", description: "Fault-tolerant with centralized logs" },
  { label: "DynamoDB (Metrics Storage)", description: "NoSQL storage for computed metrics" },
  { label: "REST API Service", description: "Serves processed metrics" },
  { label: "Prometheus Metrics", description: "Time-series monitoring data" },
  { label: "Grafana Dashboard", description: "Visualization and alerting" },
  { label: "Incident Detection & Alerts", description: "Automated anomaly detection" },
];

const reliabilityFlow = [
  { label: "Chaos Script", description: "Triggers simulated failures" },
  { label: "Simulated Worker Failure", description: "Container killed or API errors" },
  { label: "Auto Recovery", description: "Health checks + restart policies" },
];

const principles = [
  { icon: Shield, title: "Fault Tolerance", description: "Retry mechanisms with exponential backoff. Failed API calls retry up to 3 times before logging." },
  { icon: RefreshCw, title: "Self-Healing", description: "Docker health checks auto-restart failed containers. Queue processing resumes automatically." },
  { icon: Layers, title: "Decoupled Services", description: "SQS queues isolate failures. Collector, workers, and API operate independently." },
];

export default function Architecture() {
  return (
    <Layout>
      <div className="px-6 py-10 max-w-6xl mx-auto space-y-10">
        <div>
          <h1 className="text-2xl font-bold text-foreground">System Architecture</h1>
          <p className="text-sm text-muted-foreground mt-1">Event-driven cloud-native processing pipeline</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-xl border border-border card-shine p-6">
            <FlowDiagram steps={mainFlow} title="Main Processing Pipeline" />
          </div>
          <div className="space-y-6">
            <div className="rounded-xl border border-border card-shine p-6">
              <FlowDiagram steps={reliabilityFlow} title="Reliability Testing Layer" />
            </div>
            <div className="space-y-3">
              {principles.map((p, i) => (
                <motion.div
                  key={p.title}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-xl border border-border card-shine p-5 flex items-start gap-4 hover:border-primary/20 transition-all"
                >
                  <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 shrink-0">
                    <p.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">{p.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{p.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
