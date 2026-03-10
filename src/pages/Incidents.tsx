import { Layout } from "@/components/Layout";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle, Clock, XCircle, Shield } from "lucide-react";

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
  critical: { icon: XCircle, color: "text-destructive", border: "border-destructive/20", bg: "bg-destructive/5" },
  warning: { icon: AlertTriangle, color: "text-warning", border: "border-warning/20", bg: "bg-warning/5" },
  resolved: { icon: CheckCircle, color: "text-primary", border: "border-primary/20", bg: "bg-primary/5" },
};

function IncidentCard({ incident, index }: { incident: typeof activeIncidents[0]; index: number }) {
  const config = severityConfig[incident.severity as keyof typeof severityConfig];
  const Icon = config.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`rounded-xl border ${config.border} ${config.bg} p-5 hover:brightness-110 transition-all`}
    >
      <div className="flex items-start gap-3.5">
        <div className={`p-2 rounded-lg ${config.bg}`}>
          <Icon className={`h-4 w-4 ${config.color}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-mono text-muted-foreground/60 font-bold">{incident.id}</span>
            <span className="text-[10px] font-mono text-muted-foreground flex items-center gap-1 shrink-0">
              <Clock className="h-3 w-3" /> {incident.time}
            </span>
          </div>
          <h3 className="text-sm font-bold text-foreground mt-1.5">{incident.title}</h3>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{incident.description}</p>
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

        <div className="rounded-xl border border-warning/20 bg-warning/5 p-5 flex items-start gap-3.5">
          <div className="p-2 rounded-lg bg-warning/10 shrink-0">
            <AlertTriangle className="h-4 w-4 text-warning" />
          </div>
          <div>
            <span className="text-sm font-mono font-bold text-warning">{activeIncidents.length} Active Incidents</span>
            <p className="text-xs text-muted-foreground mt-0.5">Automated detection rules are monitoring system health</p>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-xs font-mono text-primary uppercase tracking-[0.2em] font-bold">Active</h2>
          {activeIncidents.map((inc, i) => <IncidentCard key={inc.id} incident={inc} index={i} />)}
        </div>

        <div className="space-y-3">
          <h2 className="text-xs font-mono text-muted-foreground uppercase tracking-[0.2em] font-bold">Resolved</h2>
          {resolvedIncidents.map((inc, i) => <IncidentCard key={inc.id} incident={inc} index={i} />)}
        </div>

        <div className="rounded-xl border border-border card-shine p-6">
          <div className="flex items-center gap-2 mb-5">
            <Shield className="h-4 w-4 text-primary" />
            <h3 className="text-xs font-mono text-primary uppercase tracking-[0.2em] font-bold">Detection Rules</h3>
          </div>
          <div className="space-y-3 font-mono text-xs">
            {[
              { condition: "queue_length > 100", alert: "Queue backlog high", level: "text-warning" },
              { condition: "api_latency > 2000ms", alert: "High API latency", level: "text-warning" },
              { condition: "worker_health = failed", alert: "Worker down", level: "text-destructive" },
              { condition: "rate_limit > 90%", alert: "Rate limit approaching", level: "text-warning" },
            ].map((rule, i) => (
              <div key={i} className="flex items-center gap-3 py-2 px-3 rounded-lg bg-secondary/30 text-foreground/80">
                <span className="text-primary font-bold">IF</span>
                <span className="flex-1">{rule.condition}</span>
                <span className={`font-bold ${rule.level}`}>→ ALERT</span>
                <span className="text-muted-foreground">"{rule.alert}"</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
