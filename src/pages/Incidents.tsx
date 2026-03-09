import { Layout } from "@/components/Layout";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle, Clock, XCircle } from "lucide-react";

const activeIncidents = [
  { id: "INC-042", title: "Queue backlog exceeds threshold", severity: "warning", time: "2 min ago", description: "Queue length > 100. Possible worker slowdown." },
  { id: "INC-041", title: "GitHub API rate limit approaching", severity: "warning", time: "8 min ago", description: "Rate limit at 92%. Throttling may occur." },
];

const resolvedIncidents = [
  { id: "INC-040", title: "Worker container restarted", severity: "resolved", time: "1 hour ago", description: "Worker-3 auto-recovered after health check failure." },
  { id: "INC-039", title: "High API latency detected", severity: "resolved", time: "3 hours ago", description: "Latency spike resolved. Root cause: cold start." },
  { id: "INC-038", title: "DynamoDB throttling", severity: "resolved", time: "6 hours ago", description: "Write capacity auto-scaled to handle burst." },
];

const severityConfig = {
  critical: { icon: XCircle, color: "text-destructive", border: "border-destructive/30", bg: "bg-destructive/5" },
  warning: { icon: AlertTriangle, color: "text-warning", border: "border-warning/30", bg: "bg-warning/5" },
  resolved: { icon: CheckCircle, color: "text-primary", border: "border-primary/30", bg: "bg-primary/5" },
};

function IncidentCard({ incident }: { incident: typeof activeIncidents[0] }) {
  const config = severityConfig[incident.severity as keyof typeof severityConfig];
  const Icon = config.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-lg border ${config.border} ${config.bg} p-4`}
    >
      <div className="flex items-start gap-3">
        <Icon className={`h-5 w-5 mt-0.5 ${config.color}`} />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-muted-foreground">{incident.id}</span>
            <span className="text-xs font-mono text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" /> {incident.time}
            </span>
          </div>
          <h3 className="text-sm font-bold text-foreground mt-1">{incident.title}</h3>
          <p className="text-xs text-muted-foreground mt-1">{incident.description}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function Incidents() {
  return (
    <Layout>
      <div className="px-6 py-10 max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Incident Detection</h1>
          <p className="text-sm text-muted-foreground mt-1">Automated anomaly detection and alerting</p>
        </div>

        <div className="rounded-lg border border-warning/30 bg-warning/5 p-4">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="h-4 w-4 text-warning" />
            <span className="text-sm font-mono font-bold text-warning">{activeIncidents.length} Active Incidents</span>
          </div>
          <p className="text-xs text-muted-foreground">Automated detection rules are monitoring system health</p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Active</h2>
          {activeIncidents.map((inc) => <IncidentCard key={inc.id} incident={inc} />)}
        </div>

        <div className="space-y-3">
          <h2 className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Resolved</h2>
          {resolvedIncidents.map((inc) => <IncidentCard key={inc.id} incident={inc} />)}
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-4">Detection Rules</h3>
          <div className="space-y-2 font-mono text-xs">
            <div className="flex items-center gap-3 text-foreground/80">
              <span className="text-primary">IF</span> queue_length &gt; 100 <span className="text-warning">→ ALERT</span> "Queue backlog high"
            </div>
            <div className="flex items-center gap-3 text-foreground/80">
              <span className="text-primary">IF</span> api_latency &gt; 2000ms <span className="text-warning">→ ALERT</span> "High API latency"
            </div>
            <div className="flex items-center gap-3 text-foreground/80">
              <span className="text-primary">IF</span> worker_health = failed <span className="text-destructive">→ ALERT</span> "Worker down"
            </div>
            <div className="flex items-center gap-3 text-foreground/80">
              <span className="text-primary">IF</span> rate_limit &gt; 90% <span className="text-warning">→ ALERT</span> "Rate limit approaching"
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
