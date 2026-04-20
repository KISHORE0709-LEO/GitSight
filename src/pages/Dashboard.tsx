import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { MetricCard } from "@/components/MetricCard";
import { useAnalysis } from "@/context/AnalysisContext";
import { Clock, Layers, Cpu, Wifi, Crown, AlertCircle, CheckCircle, TrendingUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area, BarChart, Bar } from "recharts";
import { mockApi } from "@/services/mockApi";

import type { AnalysisResult, SystemMetrics, Developer } from "@/services/mockApi";

const chartTooltipStyle = {
  contentStyle: { background: "hsl(222 20% 8%)", border: "1px solid hsl(222 16% 14%)", borderRadius: 12, fontFamily: "JetBrains Mono", fontSize: 12 },
  labelStyle: { color: "hsl(210 40% 96%)" },
};

export default function Dashboard() {
  const { analyzedUsername } = useAnalysis();
  const [userMetrics, setUserMetrics] = useState<AnalysisResult | null>(null);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics | null>(null);
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!analyzedUsername) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const [userData, sysData, leaderData] = await Promise.all([
          mockApi.analyzeUser(analyzedUsername),
          mockApi.getSystemMetrics(),
          mockApi.getLeaderboard(),
        ]);

        setUserMetrics(userData);
        setSystemMetrics(sysData);
        setDevelopers(leaderData);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    };

    fetchData();
  }, [analyzedUsername]);

  if (!analyzedUsername) {
    return (
      <Layout>
        <div className="px-6 py-10 max-w-6xl mx-auto">
          <div className="rounded-lg border border-border bg-card p-8 text-center">
            <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-foreground font-bold">No User Analyzed</p>
            <p className="text-sm text-muted-foreground mt-1">Go to the Analyze page and enter a GitHub username to view their dashboard</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <div className="px-6 py-10 max-w-6xl mx-auto">
          <p className="text-muted-foreground">Loading dashboard for @{analyzedUsername}...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="px-6 py-10 max-w-6xl mx-auto">
          <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
            <p className="text-destructive">{error}</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="px-6 py-10 max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard for @{analyzedUsername}</h1>
          <p className="text-sm text-muted-foreground mt-1">Developer metrics and productivity analysis</p>
        </div>

        {/* User Metrics Summary */}
        {userMetrics && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <MetricCard icon={TrendingUp} title="Commits" value={userMetrics.commits} variant="primary" />
              <MetricCard icon={CheckCircle} title="Merged PRs" value={userMetrics.mergedPR} variant="accent" />
              <MetricCard icon={AlertCircle} title="Rejected PRs" value={userMetrics.rejectedPR} variant="warning" />
              <MetricCard icon={Crown} title="Score" value={userMetrics.score} variant="primary" />
              <MetricCard icon={Layers} title="Repositories" value={userMetrics.repositories || 0} />
            </div>

            {/* Weekly Activity Chart */}
            <div className="rounded-xl border border-border card-shine p-6">
              <h3 className="text-xs font-mono text-primary uppercase tracking-[0.2em] font-bold mb-6">Weekly Commit Activity</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={userMetrics.weeklyActivity}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 16% 14%)" />
                  <XAxis dataKey="day" tick={{ fill: "hsl(215 15% 50%)", fontSize: 11, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "hsl(215 15% 50%)", fontSize: 11, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                  <Tooltip {...chartTooltipStyle} />
                  <Bar dataKey="commits" fill="hsl(142 70% 45%)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="rounded-xl border border-border card-shine p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">Score Breakdown</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                  <span className="text-sm font-mono text-foreground">Commits × 1</span>
                  <span className="text-sm font-bold text-primary">{userMetrics.commits}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                  <span className="text-sm font-mono text-foreground">Merged PRs × 5</span>
                  <span className="text-sm font-bold text-primary">{userMetrics.mergedPR * 5}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                  <span className="text-sm font-mono text-foreground">Rejected PRs × -2</span>
                  <span className="text-sm font-bold text-destructive">{userMetrics.rejectedPR * -2}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border border-primary/20 bg-primary/5">
                  <span className="text-sm font-mono font-bold text-foreground">Total Score</span>
                  <span className="text-lg font-bold text-primary">{userMetrics.score}</span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* System Status */}
        {systemMetrics && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl border border-border bg-card">
              <div className="flex items-center gap-3">
                <div className={`h-3 w-3 rounded-full ${systemMetrics.workerHealth === 'healthy' ? 'bg-green-500' : 'bg-red-500'}`} />
                <div>
                  <p className="text-xs font-mono text-muted-foreground uppercase">Worker Health</p>
                  <p className="text-sm font-bold text-foreground capitalize">{systemMetrics.workerHealth}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Layers className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-xs font-mono text-muted-foreground uppercase">Queue Messages</p>
                  <p className="text-sm font-bold text-foreground">{systemMetrics.queueBacklog}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className={systemMetrics.activeIncidents === 0 ? 'text-green-500' : 'text-red-500'}>
                  {systemMetrics.activeIncidents === 0 ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                </div>
                <div>
                  <p className="text-xs font-mono text-muted-foreground uppercase">Active Incidents</p>
                  <p className="text-sm font-bold text-foreground">{systemMetrics.activeIncidents}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard icon={Clock} title="Avg Latency" value={`${systemMetrics.latency}ms`} variant="primary" />
              <MetricCard icon={Layers} title="Queue Backlog" value={systemMetrics.queueBacklog} variant="accent" />
              <MetricCard icon={Cpu} title="CPU Usage" value={`${systemMetrics.cpuUsage}%`} />
              <MetricCard icon={Wifi} title="API Rate" value={`${systemMetrics.apiRate}/min`} variant="primary" />
            </div>
          </>
        )}

        {/* Developer Leaderboard */}
        {developers.length > 0 && (
          <div className="rounded-xl border border-border card-shine p-6">
            <h3 className="text-xs font-mono text-primary uppercase tracking-[0.2em] font-bold mb-6">Developer Leaderboard</h3>
            <div className="space-y-1">
              {developers.map((dev, i) => (
                <div key={dev.username} className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-secondary/50 transition-all group">
                  <div className="flex items-center gap-4">
                    <span className={`text-sm font-mono font-bold w-6 text-center ${i === 0 ? "text-warning" : i === 1 ? "text-muted-foreground" : i === 2 ? "text-accent" : "text-muted-foreground/60"}`}>
                      {i === 0 ? <Crown className="h-4 w-4 text-warning inline" /> : `#${i + 1}`}
                    </span>
                    <div className="h-8 w-8 rounded-lg bg-secondary border border-border flex items-center justify-center">
                      <span className="text-xs font-mono font-bold text-foreground">{dev.username[0].toUpperCase()}</span>
                    </div>
                    <span className={`text-sm font-mono text-foreground group-hover:text-primary transition-colors ${dev.username === analyzedUsername ? "font-bold text-primary" : ""}`}>
                      @{dev.username}
                    </span>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="text-xs font-mono text-muted-foreground">{dev.commits} commits</span>
                    <span className="text-sm font-mono font-bold text-primary tabular-nums">{dev.score}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
