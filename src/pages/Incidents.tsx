import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { useAnalysis } from "@/context/AnalysisContext";
import { AlertCircle, CheckCircle, Clock, Zap, Activity, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { mockApi } from "@/services/mockApi";

import type { Incident } from "@/services/mockApi";

const alertRules = [
  { id: "1", metric: "Queue Length", condition: ">", threshold: "100", severity: "critical" },
  { id: "2", metric: "API Latency", condition: ">", threshold: "2000ms", severity: "warning" },
  { id: "3", metric: "Worker Health", condition: "=", threshold: "failed", severity: "critical" },
  { id: "4", metric: "GitHub Rate Limit", condition: ">", threshold: "90%", severity: "warning" },
  { id: "5", metric: "CPU Usage", condition: ">", threshold: "80%", severity: "warning" },
  { id: "6", metric: "Memory Usage", condition: ">", threshold: "85%", severity: "critical" },
];

export default function Incidents() {
  const { analyzedUsername } = useAnalysis();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIncidents = async () => {
      if (!analyzedUsername) {
        setLoading(false);
        return;
      }

      try {
        const data = await mockApi.getIncidents(analyzedUsername);
        setIncidents(data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch incidents:', err);
        setError('Failed to load incidents');
        setLoading(false);
      }
    };

    fetchIncidents();
    const interval = setInterval(fetchIncidents, 10000);
    return () => clearInterval(interval);
  }, [analyzedUsername]);

  if (!analyzedUsername) {
    return (
      <Layout>
        <div className="px-6 py-10 max-w-6xl mx-auto">
          <div className="rounded-lg border border-border bg-card p-8 text-center">
            <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-foreground font-bold">No User Analyzed</p>
            <p className="text-sm text-muted-foreground mt-1">Go to the Analyze page and enter a GitHub username to view their incidents</p>
          </div>
        </div>
      </Layout>
    );
  }

  const activeIncidents = incidents.filter(i => i.status === 'active');
  const resolvedIncidents = incidents.filter(i => i.status === 'resolved');

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'warning': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      default: return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertCircle className="h-5 w-5" />;
      case 'warning': return <AlertTriangle className="h-5 w-5" />;
      default: return <Zap className="h-5 w-5" />;
    }
  };

  return (
    <Layout>
      <div className="px-6 py-10 max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Incidents for @{analyzedUsername}</h1>
          <p className="text-sm text-muted-foreground mt-1">Real-time operational alerts and anomaly detection</p>
        </div>

        {error && (
          <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
            <p className="text-destructive">{error}</p>
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-border bg-card">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-xs font-mono text-muted-foreground uppercase">Active Incidents</p>
                <p className="text-2xl font-bold text-foreground">{activeIncidents.length}</p>
              </div>
            </div>
          </div>
          <div className="p-4 rounded-xl border border-border bg-card">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-xs font-mono text-muted-foreground uppercase">Resolved</p>
                <p className="text-2xl font-bold text-foreground">{resolvedIncidents.length}</p>
              </div>
            </div>
          </div>
          <div className="p-4 rounded-xl border border-border bg-card">
            <div className="flex items-center gap-3">
              <Activity className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs font-mono text-muted-foreground uppercase">Alert Rules</p>
                <p className="text-2xl font-bold text-foreground">{alertRules.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Active Incidents */}
        <div className="rounded-xl border border-border card-shine p-6">
          <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            Active Incidents ({activeIncidents.length})
          </h2>
          <div className="space-y-3">
            {loading ? (
              <p className="text-sm text-muted-foreground">Loading incidents...</p>
            ) : activeIncidents.length > 0 ? (
              activeIncidents.map((incident) => (
                <motion.div
                  key={incident.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-lg border ${getSeverityColor(incident.severity)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      {getSeverityIcon(incident.severity)}
                      <div>
                        <p className="font-semibold text-foreground">{incident.title}</p>
                        <p className="text-sm text-muted-foreground mt-1">{incident.description}</p>
                        <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                          <span>Component: <span className="font-mono">{incident.component}</span></span>
                          <span>Metric: <span className="font-mono">{incident.metric}</span></span>
                          <span>Current: <span className="font-mono font-bold">{incident.current}</span></span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(incident.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground py-4">No active incidents</p>
            )}
          </div>
        </div>

        {/* Alert Rules */}
        <div className="rounded-xl border border-border card-shine p-6">
          <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Detection Rules
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-3 font-mono text-xs text-muted-foreground">Metric</th>
                  <th className="text-left py-2 px-3 font-mono text-xs text-muted-foreground">Condition</th>
                  <th className="text-left py-2 px-3 font-mono text-xs text-muted-foreground">Threshold</th>
                  <th className="text-left py-2 px-3 font-mono text-xs text-muted-foreground">Severity</th>
                </tr>
              </thead>
              <tbody>
                {alertRules.map((rule) => (
                  <tr key={rule.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                    <td className="py-3 px-3 font-mono text-foreground">{rule.metric}</td>
                    <td className="py-3 px-3 font-mono text-foreground">{rule.condition}</td>
                    <td className="py-3 px-3 font-mono text-foreground font-bold">{rule.threshold}</td>
                    <td className="py-3 px-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-mono ${getSeverityColor(rule.severity)}`}>
                        {getSeverityIcon(rule.severity)}
                        {rule.severity}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Resolved Incidents */}
        {resolvedIncidents.length > 0 && (
          <div className="rounded-xl border border-border card-shine p-6">
            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Resolved Incidents ({resolvedIncidents.length})
            </h2>
            <div className="space-y-2">
              {resolvedIncidents.map((incident) => (
                <div key={incident.id} className="p-3 rounded-lg border border-green-500/20 bg-green-500/5 text-sm text-muted-foreground">
                  <p>{incident.title} - Resolved at {new Date(incident.timestamp).toLocaleTimeString()}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
