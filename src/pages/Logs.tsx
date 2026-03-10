import { useState } from "react";
import { Layout } from "@/components/Layout";
import { LogEntry } from "@/components/LogEntry";
import { Terminal } from "lucide-react";

const allLogs = [
  { level: "INFO" as const, message: "System initialized. All services healthy.", timestamp: "14:32:01" },
  { level: "INFO" as const, message: "Fetching GitHub activity for @alice", timestamp: "14:32:05" },
  { level: "INFO" as const, message: "Queue message received. Processing batch #847", timestamp: "14:32:06" },
  { level: "DEBUG" as const, message: "Worker-2 heartbeat received", timestamp: "14:32:08" },
  { level: "INFO" as const, message: "Score calculated for @alice: 342", timestamp: "14:32:10" },
  { level: "WARNING" as const, message: "Retry attempt 1/3 for GitHub API call", timestamp: "14:32:15" },
  { level: "INFO" as const, message: "GitHub API call succeeded on retry", timestamp: "14:32:17" },
  { level: "INFO" as const, message: "Processing queue message for @bob", timestamp: "14:32:20" },
  { level: "INFO" as const, message: "DynamoDB write successful. Batch #847 stored.", timestamp: "14:32:22" },
  { level: "WARNING" as const, message: "Queue backlog increasing. Current length: 78", timestamp: "14:32:30" },
  { level: "INFO" as const, message: "Worker-3 scaled up. Processing resumed.", timestamp: "14:32:32" },
  { level: "ERROR" as const, message: "GitHub API rate limit exceeded. Backing off 60s.", timestamp: "14:32:45" },
  { level: "INFO" as const, message: "Worker-1 processing @charlie activity", timestamp: "14:33:00" },
  { level: "DEBUG" as const, message: "Prometheus metrics scraped. 12 series exported.", timestamp: "14:33:05" },
  { level: "INFO" as const, message: "Score calculated for @charlie: 245", timestamp: "14:33:08" },
  { level: "INFO" as const, message: "Worker restarted successfully after health check failure", timestamp: "14:33:15" },
  { level: "INFO" as const, message: "Queue backlog normalized. Length: 4", timestamp: "14:33:20" },
];

export default function Logs() {
  const [filter, setFilter] = useState<string>("ALL");
  const filters = ["ALL", "INFO", "WARNING", "ERROR", "DEBUG"];
  const filtered = filter === "ALL" ? allLogs : allLogs.filter((l) => l.level === filter);

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
          <h1 className="text-2xl font-bold text-foreground">System Logs</h1>
          <p className="text-sm text-muted-foreground mt-1">Centralized logging for debugging and monitoring</p>
        </div>

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
            {filtered.map((log, i) => (
              <LogEntry key={i} {...log} />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
