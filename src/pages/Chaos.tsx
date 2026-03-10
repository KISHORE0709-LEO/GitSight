import { useState } from "react";
import { Layout } from "@/components/Layout";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Server, Wifi, RefreshCw, CheckCircle, AlertTriangle, Terminal } from "lucide-react";

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
                {result.responses.length === 6 && (
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">
                    <CheckCircle className="h-3 w-3 text-primary" />
                    <span className="text-[10px] font-mono text-primary font-bold">RECOVERED</span>
                  </div>
                )}
              </div>
              <div className="p-5 font-mono text-xs space-y-2">
                {result.responses.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex items-center gap-2.5 ${msg.includes("✓") ? "text-primary" : msg.includes("fail") || msg.includes("stop") || msg.includes("503") ? "text-destructive" : msg.includes("Retry") || msg.includes("increasing") ? "text-warning" : "text-foreground/80"}`}
                  >
                    <span className="text-muted-foreground/40 select-none">❯</span> {msg}
                  </motion.div>
                ))}
                {running && result.responses.length < 6 && ri === results.length - 1 && (
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
