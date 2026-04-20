import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { LogEntry } from "@/components/LogEntry";
import { useAnalysis } from "@/context/AnalysisContext";
import { Terminal, RefreshCw, AlertCircle } from "lucide-react";

interface Log {
  level: "INFO" | "WARNING" | "ERROR" | "DEBUG";
  message: string;
  timestamp: string;
  service?: string;
}

export default function Logs() {
  const { analyzedUsername } = useAnalysis();
  const [logs, setLogs] = useState<Log[]>([]);
  const [filter, setFilter] = useState<string>("ALL");
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const filters = ["ALL", "INFO", "WARNING", "ERROR", "DEBUG"];

  useEffect(() => {
    const fetchLogs = async () => {
      if (!analyzedUsername) {
        setLoading(false);
        return;
      }

      try {
        const level = filter === "ALL" ? "" : filter;
        const response = await fetch(`/api/logs?username=${analyzedUsername}&level=${level}`);
        if (response.ok) {
          const data = await response.json();
          setLogs(data);
          setError(null);
        }
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch logs:', err);
        setError('Failed to load logs');
        setLoading(false);
      }
    };

    fetchLogs();
    
    if (autoRefresh) {
      const interval = setInterval(fetchLogs, 3000);
      return () => clearInterval(interval);
    }
  }, [filter, autoRefresh, analyzedUsername]);

  if (!analyzedUsername) {
    return (
      <Layout>
        <div className="px-6 py-10 max-w-6xl mx-auto">
          <div className="rounded-lg border border-border bg-card p-8 text-center">
            <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-foreground font-bold">No User Analyzed</p>
            <p className="text-sm text-muted-foreground mt-1">Go to the Analyze page and enter a GitHub username to view their logs</p>
          </div>
        </div>
      </Layout>
    );
  }

  const filtered = filter === "ALL" ? logs : logs.filter((l) => l.level === filter);

  const filterColors: Record<string, string> = {
    ALL: "primary",
    INFO: "primary",
    WARNING: "warning",
    ERROR: "destructive",
    DEBUG: "accent",
  };

  return (
    <Layout>
      <div className="px-6 py-10 max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Logs for @{analyzedUsername}</h1>
          <p className="text-sm text-muted-foreground mt-1">Centralized logging for debugging and monitoring</p>
        </div>

        {error && (
          <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
            <p className="text-destructive">{error}</p>
          </div>
        )}

        <div className="flex gap-2 items-center justify-between">
          <div className="flex gap-2">
            {filters.map((f) => {
              const isActive = filter === f;
              return (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                    isActive
                      ? `bg-${filterColors[f]}/10 text-${filterColors[f]} border border-${filterColors[f]}/30`
                      : "bg-secondary/50 text-muted-foreground border border-border hover:text-foreground hover:border-muted-foreground/30"
                  }`}
                >
                  {f}
                </button>
              );
            })}
          </div>
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-2 ${
              autoRefresh
                ? "bg-primary/10 text-primary border border-primary/30"
                : "bg-secondary/50 text-muted-foreground border border-border"
            }`}
          >
            <RefreshCw className={`h-3 w-3 ${autoRefresh ? "animate-spin" : ""}`} />
            {autoRefresh ? "Live" : "Paused"}
          </button>
        </div>

        <div className="rounded-xl border border-border card-shine overflow-hidden">
          <div className="px-4 py-3 border-b border-border bg-secondary/30 flex items-center gap-2.5">
            <Terminal className="h-3.5 w-3.5 text-primary" />
            <div className="relative">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <div className="absolute inset-0 h-2 w-2 rounded-full bg-primary animate-ping opacity-40" />
            </div>
            <span className="text-[10px] font-mono text-muted-foreground tracking-wider">LIVE LOG STREAM</span>
            <span className="ml-auto text-[10px] font-mono text-muted-foreground/50">{filtered.length} entries</span>
          </div>
          <div className="max-h-[600px] overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-muted-foreground">Loading logs for @{analyzedUsername}...</div>
            ) : filtered.length > 0 ? (
              filtered.map((log, i) => (
                <LogEntry key={i} {...log} />
              ))
            ) : (
              <div className="p-4 text-center text-muted-foreground">No logs found for @{analyzedUsername}</div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
