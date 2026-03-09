import { useState } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { MetricCard } from "@/components/MetricCard";
import { GitCommit, GitPullRequest, GitMerge, XCircle, Trophy, Search } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const mockData = {
  username: "octocat",
  commits: 142,
  mergedPR: 28,
  rejectedPR: 3,
  score: 142 * 1 + 28 * 5 - 3 * 2,
  weeklyActivity: [
    { day: "Mon", commits: 8 },
    { day: "Tue", commits: 12 },
    { day: "Wed", commits: 5 },
    { day: "Thu", commits: 18 },
    { day: "Fri", commits: 14 },
    { day: "Sat", commits: 3 },
    { day: "Sun", commits: 1 },
  ],
};

export default function Analyze() {
  const [username, setUsername] = useState("");
  const [analyzed, setAnalyzed] = useState(false);

  const handleAnalyze = () => {
    if (username.trim()) setAnalyzed(true);
  };

  return (
    <Layout>
      <div className="px-6 py-10 max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Developer Analysis</h1>
          <p className="text-sm text-muted-foreground mt-1">Analyze GitHub activity and productivity scores</p>
        </div>

        <div className="flex gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Enter GitHub username..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-card border border-border text-foreground font-mono text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
            />
          </div>
          <button
            onClick={handleAnalyze}
            className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-mono text-sm font-bold hover:bg-primary/90 transition-colors"
          >
            Analyze
          </button>
        </div>

        {analyzed && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                <span className="text-lg font-bold font-mono text-primary">
                  {username[0]?.toUpperCase()}
                </span>
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground font-mono">@{username}</h2>
                <p className="text-xs text-muted-foreground">Last 30 days activity</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <MetricCard icon={GitCommit} title="Commits" value={mockData.commits} variant="primary" />
              <MetricCard icon={GitMerge} title="Merged PRs" value={mockData.mergedPR} variant="accent" />
              <MetricCard icon={XCircle} title="Rejected PRs" value={mockData.rejectedPR} variant="warning" />
              <MetricCard icon={Trophy} title="Productivity Score" value={mockData.score} variant="primary" />
              <MetricCard icon={GitPullRequest} title="Total PRs" value={mockData.mergedPR + mockData.rejectedPR} />
            </div>

            <div className="p-4 rounded-lg border border-border bg-card font-mono text-xs text-muted-foreground">
              <span className="text-primary">score</span> = (commits × 1) + (merged_pr × 5) - (rejected_pr × 2) = <span className="text-foreground font-bold">{mockData.score}</span>
            </div>

            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-4">Weekly Commit Activity</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={mockData.weeklyActivity}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 16% 18%)" />
                  <XAxis dataKey="day" tick={{ fill: "hsl(215 15% 55%)", fontSize: 12, fontFamily: "JetBrains Mono" }} axisLine={false} />
                  <YAxis tick={{ fill: "hsl(215 15% 55%)", fontSize: 12, fontFamily: "JetBrains Mono" }} axisLine={false} />
                  <Tooltip
                    contentStyle={{ background: "hsl(220 18% 10%)", border: "1px solid hsl(220 16% 18%)", borderRadius: 8, fontFamily: "JetBrains Mono", fontSize: 12 }}
                    labelStyle={{ color: "hsl(210 20% 92%)" }}
                  />
                  <Bar dataKey="commits" fill="hsl(142 70% 50%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}
      </div>
    </Layout>
  );
}
