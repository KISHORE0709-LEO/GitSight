import { useState } from "react";
import { Layout } from "@/components/Layout";
import { motion, AnimatePresence } from "framer-motion";
import { useAnalysis } from "@/context/AnalysisContext";
import { Zap, Server, Wifi, RefreshCw, CheckCircle, AlertTriangle, Terminal } from "lucide-react";

interface ChaosEvent {
  message: string;
  type: "info" | "error" | "warning" | "success";
}

interface TestResult {
  action: string;
  events: ChaosEvent[];
  status: "running" | "recovered" | "failed";
}

export default function Chaos() {
  const { analyzedUsername } = useAnalysis();
  const [results, setResults] = useState<TestResult[]>([]);
  const [running, setRunning] = useState(false);

  const runTest = async (type: "worker" | "api") => {
    setRunning(true);
    const endpoint = type === "worker" ? "/api/chaos/worker-failure" : "/api/chaos/api-failure";
    const action = type === "worker" ? "Simulate Worker Failure" : "Simulate API Failure";

    const testResult: TestResult = {
      action,
      events: [],
      status: "running"
    };

    setResults((prev) => [...prev, testResult]);

    try {
      const response = await fetch(endpoint, { method: "POST" });
      const data = await response.json();

      if (data.events) {
        for (const event of data.events) {
          await new Promise(resolve => setTimeout(resolve, 600));
          setResults((prev) => {
            const updated = [...prev];
            const last = { ...updated[updated.length - 1] };
            last.events = [...last.events, event];
            updated[updated.length - 1] = last;
            return updated;
          });
        }
      }

      setResults((prev) => {
        const updated = [...prev];
        updated[updated.length - 1].status = data.recovered ? "recovered" : "failed";
        return updated;
      });
    } catch (error) {
      setResults((prev) => {
        const updated = [...prev];
        updated[updated.length - 1].events.push({
          message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
          type: "error"
        });
        updated[updated.length - 1].status = "failed";
        return updated;
      });
    }

    setRunning(false);
  };

  return (
    <Layout>
      <div className="px-6 py-10 max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {analyzedUsername ? `Chaos Testing for @${analyzedUsername}` : "Chaos Testing"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Simulate failures to validate system resilience</p>
        </div>

        {analyzedUsername && (
          <div className="p-4 rounded-xl border border-primary/20 bg-primary/5">
            <p className="text-sm font-mono text-primary">
              Testing resilience for: <span className="font-bold">@{analyzedUsername}</span>
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => !running && runTest("worker")}
            disabled={running}
            className="rounded-xl border border-border card-shine p-6 text-left hover:border-destructive/30 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="p-2.5 rounded-xl bg-destructive/10 border border-destructive/20 w-fit mb-4">
              <Server className="h-5 w-5 text-destructive group-hover:animate-pulse" />
            </div>
            <h3 className="text-base font-bold text-foreground">Simulate Worker Failure</h3>
            <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">Stop a worker container and test auto-recovery</p>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => !running && runTest("api")}
            disabled={running}
            className="rounded-xl border border-border card-shine p-6 text-left hover:border-warning/30 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="p-2.5 rounded-xl bg-warning/10 border border-warning/20 w-fit mb-4">
              <Wifi className="h-5 w-5 text-warning group-hover:animate-pulse" />
            </div>
            <h3 className="text-base font-bold text-foreground">Simulate API Failure</h3>
            <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">Trigger GitHub API errors and test retry mechanisms</p>
          </motion.button>
        </div>

        <AnimatePresence>
          {results.map((result, ri) => (
            <motion.div
              key={ri}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-border card-shine overflow-hidden"
            >
              <div className="px-5 py-3.5 border-b border-border bg-secondary/30 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Terminal className="h-4 w-4 text-primary" />
                  <span className="text-sm font-mono font-bold text-foreground">{result.action}</span>
                </div>
                {result.status === "recovered" && (
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">
                    <CheckCircle className="h-3 w-3 text-primary" />
                    <span className="text-[10px] font-mono text-primary font-bold">RECOVERED</span>
                  </div>
                )}
                {result.status === "failed" && (
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-destructive/10 border border-destructive/20">
                    <AlertTriangle className="h-3 w-3 text-destructive" />
                    <span className="text-[10px] font-mono text-destructive font-bold">FAILED</span>
                  </div>
                )}
              </div>
              <div className="p-5 font-mono text-xs space-y-2">
                {result.events.map((event, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex items-center gap-2.5 ${
                      event.type === "success" ? "text-primary" :
                      event.type === "error" ? "text-destructive" :
                      event.type === "warning" ? "text-warning" :
                      "text-foreground/80"
                    }`}
                  >
                    <span className="text-muted-foreground/40 select-none">❯</span> {event.message}
                  </motion.div>
                ))}
                {result.status === "running" && (
                  <div className="flex items-center gap-2.5 text-muted-foreground pt-1">
                    <RefreshCw className="h-3 w-3 animate-spin" />
                    <span className="animate-pulse">Processing...</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {results.length === 0 && (
          <div className="rounded-xl border border-dashed border-border/50 p-12 flex flex-col items-center justify-center text-center">
            <AlertTriangle className="h-8 w-8 text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground font-mono">No chaos tests run yet</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Click a test above to simulate a failure</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
