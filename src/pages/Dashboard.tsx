import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { MetricCard } from "@/components/MetricCard";
import { Clock, Layers, Cpu, Wifi, Crown, AlertCircle, CheckCircle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from "recharts";

interface SystemMetrics {
  latency: number;
  queueBacklog: number;
  cpuUsage: number;
  apiRate: number;
  workerHealth: string;
  uptime: string;
  activeIncidents: number;
}

interface Developer {
  username: string;
  score: number;
  commits: number;
  mergedPR: number;
}

interface ChartData {
  time: string;
  value: number;
}

const chartTooltipStyle = {
  contentStyle: { background: "hsl(222 20% 8%)", border: "1px solid hsl(222 16% 14%)", borderRadius: 12, fontFamily: "JetBrains Mono", fontSize: 12 },
  labelStyle: { color: "hsl(210 40% 96%)" },
};

export default function Dashboard() {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [latencyHistory, setLatencyHistory] = useState<ChartData[]>([]);
  const [queueHistory, setQueueHistory] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const [metricsRes, devsRes] = await Promise.all([
          fetch(`/api/metrics/system`),
          fetch(`/api/developers/top`)
        ]);

        if (metricsRes.ok) {
          const data = await metricsRes.json();
          setMetrics(data);
          
          // Add to history
          setLatencyHistory(prev => [...prev.slice(-19), { time: new Date().toLocaleTimeString(), value: data.latency }]);
          setQueueHistory(prev => [...prev.slice(-19), { time: new Date().toLocaleTimeString(), value: data.queueBacklog }]);
        }

        if (devsRes.ok) {
          const data = await devsRes.json();
          setDevelopers(data);
        }

        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch metrics:', error);
        setLoading(false);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  if (loading && !metrics) {
    return (
      <Layout>
        <div className="px-6 py-10 max-w-6xl mx-auto">
          <p className="text-muted-foreground">Loading metrics...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="px-6 py-10 max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Observability Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Real-time system metrics and performance monitoring</p>
        </div>

        {/* System Status Header */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl border border-border bg-card">
          <div className="flex items-center gap-3">
            <div className={`h-3 w-3 rounded-full ${metrics?.workerHealth === 'healthy' ? 'bg-green-500' : 'bg-red-500'}`} />
            <div>
              <p className="text-xs font-mono text-muted-foreground uppercase">Worker Health</p>
              <p className="text-sm font-bold text-foreground capitalize">{metrics?.workerHealth || 'Unknown'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Layers className="h-4 w-4 text-primary" />
            <div>
              <p className="text-xs font-mono text-muted-foreground uppercase">Queue Messages</p>
              <p className="text-sm font-bold text-foreground">{metrics?.queueBacklog || 0}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className={metrics?.activeIncidents === 0 ? 'text-green-500' : 'text-red-500'}>
              {metrics?.activeIncidents === 0 ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            </div>
            <div>
              <p className="text-xs font-mono text-muted-foreground uppercase">Active Incidents</p>
              <p className="text-sm font-bold text-foreground">{metrics?.activeIncidents || 0}</p>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard icon={Clock} title="Avg Latency" value={`${metrics?.latency || 0}ms`} variant="primary" />
          <MetricCard icon={Layers} title="Queue Backlog" value={metrics?.queueBacklog || 0} variant="accent" />
          <MetricCard icon={Cpu} title="CPU Usage" value={`${metrics?.cpuUsage || 0}%`} />
          <MetricCard icon={Wifi} title="API Rate" value={`${metrics?.apiRate || 0}/min`} variant="primary" />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-xl border border-border card-shine p-6">
            <h3 className="text-xs font-mono text-primary uppercase tracking-[0.2em] font-bold mb-6">Worker Processing Latency (ms)</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={latencyHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 16% 14%)" />
                <XAxis dataKey="time" tick={{ fill: "hsl(215 15% 50%)", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "hsl(215 15% 50%)", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                <Tooltip {...chartTooltipStyle} />
                <Line type="monotone" dataKey="value" stroke="hsl(142 70% 45%)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-xl border border-border card-shine p-6">
            <h3 className="text-xs font-mono text-primary uppercase tracking-[0.2em] font-bold mb-6">Queue Backlog</h3>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={queueHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 16% 14%)" />
                <XAxis dataKey="time" tick={{ fill: "hsl(215 15% 50%)", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "hsl(215 15% 50%)", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                <Tooltip {...chartTooltipStyle} />
                <Area type="monotone" dataKey="value" stroke="hsl(185 70% 45%)" fill="hsl(185 70% 45% / 0.1)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Developer Leaderboard */}
        <div className="rounded-xl border border-border card-shine p-6">
          <h3 className="text-xs font-mono text-primary uppercase tracking-[0.2em] font-bold mb-6">Developer Leaderboard</h3>
          <div className="space-y-1">
            {developers.length > 0 ? (
              developers.map((dev, i) => (
                <div key={dev.username} className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-secondary/50 transition-all group">
                  <div className="flex items-center gap-4">
                    <span className={`text-sm font-mono font-bold w-6 text-center ${i === 0 ? "text-warning" : i === 1 ? "text-muted-foreground" : i === 2 ? "text-accent" : "text-muted-foreground/60"}`}>
                      {i === 0 ? <Crown className="h-4 w-4 text-warning inline" /> : `#${i + 1}`}
                    </span>
                    <div className="h-8 w-8 rounded-lg bg-secondary border border-border flex items-center justify-center">
                      <span className="text-xs font-mono font-bold text-foreground">{dev.username[0].toUpperCase()}</span>
                    </div>
                    <span className="text-sm font-mono text-foreground group-hover:text-primary transition-colors">@{dev.username}</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="text-xs font-mono text-muted-foreground">{dev.commits} commits</span>
                    <span className="text-sm font-mono font-bold text-primary tabular-nums">{dev.score}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground py-4">No developers yet</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
