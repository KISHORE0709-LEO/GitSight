import { useState } from "react";
import { Layout } from "@/components/Layout";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Server, Wifi, RefreshCw, CheckCircle } from "lucide-react";

interface TestResult {
  action: string;
  responses: string[];
  status: "success" | "recovering";
}

export default function Chaos() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [running, setRunning] = useState(false);

  const runTest = (type: "worker" | "api") => {
    setRunning(true);
    const test: TestResult = type === "worker"
      ? {
          action: "Simulate Worker Failure",
          responses: ["Worker-2 stopped", "Queue backlog increasing...", "Health check failed", "Worker-2 restarted automatically", "Queue processing resumed", "System recovered ✓"],
          status: "success",
        }
      : {
          action: "Simulate API Failure",
          responses: ["GitHub API returning 503", "Retry attempt 1/3...", "Retry attempt 2/3...", "API recovered on attempt 2", "Processing resumed normally", "System recovered ✓"],
          status: "success",
        };

    setResults((prev) => [...prev, { ...test, responses: [] }]);
    test.responses.forEach((msg, i) => {
      setTimeout(() => {
        setResults((prev) => {
          const updated = [...prev];
          const last = { ...updated[updated.length - 1] };
          last.responses = [...last.responses, msg];
          updated[updated.length - 1] = last;
          return updated;
        });
        if (i === test.responses.length - 1) setRunning(false);
      }, (i + 1) * 600);
    });
  };

  return (
    <Layout>
      <div className="px-6 py-10 max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Chaos Testing</h1>
          <p className="text-sm text-muted-foreground mt-1">Simulate failures to validate system resilience</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => !running && runTest("worker")}
            disabled={running}
            className="rounded-lg border border-border bg-card p-6 text-left hover:border-destructive/40 transition-all group disabled:opacity-50"
          >
            <Server className="h-8 w-8 text-destructive mb-3 group-hover:animate-pulse" />
            <h3 className="text-base font-bold text-foreground">Simulate Worker Failure</h3>
            <p className="text-xs text-muted-foreground mt-1">Stop a worker container and test auto-recovery</p>
          </button>
          <button
            onClick={() => !running && runTest("api")}
            disabled={running}
            className="rounded-lg border border-border bg-card p-6 text-left hover:border-warning/40 transition-all group disabled:opacity-50"
          >
            <Wifi className="h-8 w-8 text-warning mb-3 group-hover:animate-pulse" />
            <h3 className="text-base font-bold text-foreground">Simulate API Failure</h3>
            <p className="text-xs text-muted-foreground mt-1">Trigger GitHub API errors and test retry mechanisms</p>
          </button>
        </div>

        <AnimatePresence>
          {results.map((result, ri) => (
            <motion.div
              key={ri}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg border border-border bg-card overflow-hidden"
            >
              <div className="px-4 py-3 border-b border-border bg-secondary/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-warning" />
                  <span className="text-sm font-mono font-bold text-foreground">{result.action}</span>
                </div>
                {result.responses.length === 6 && (
                  <CheckCircle className="h-4 w-4 text-primary" />
                )}
              </div>
              <div className="p-4 font-mono text-xs space-y-1.5">
                {result.responses.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`flex items-center gap-2 ${msg.includes("✓") ? "text-primary" : msg.includes("fail") || msg.includes("stop") || msg.includes("503") ? "text-destructive" : msg.includes("Retry") || msg.includes("increasing") ? "text-warning" : "text-foreground/80"}`}
                  >
                    <span className="text-muted-foreground">&gt;</span> {msg}
                  </motion.div>
                ))}
                {running && result.responses.length < 6 && ri === results.length - 1 && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <RefreshCw className="h-3 w-3 animate-spin" /> Processing...
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </Layout>
  );
}
