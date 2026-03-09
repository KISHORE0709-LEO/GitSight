import { Layout } from "@/components/Layout";
import { MetricCard } from "@/components/MetricCard";
import { Activity, Clock, Layers, Cpu, Wifi, Database } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from "recharts";

const latencyData = Array.from({ length: 20 }, (_, i) => ({
  time: `${i}:00`,
  latency: Math.floor(Math.random() * 80 + 20),
}));

const queueData = Array.from({ length: 20 }, (_, i) => ({
  time: `${i}:00`,
  backlog: Math.floor(Math.random() * 50),
}));

const leaderboard = [
  { name: "alice", score: 342, commits: 89 },
  { name: "bob", score: 287, commits: 72 },
  { name: "charlie", score: 245, commits: 61 },
  { name: "diana", score: 198, commits: 48 },
  { name: "eve", score: 167, commits: 39 },
];

const chartTooltipStyle = {
  contentStyle: { background: "hsl(220 18% 10%)", border: "1px solid hsl(220 16% 18%)", borderRadius: 8, fontFamily: "JetBrains Mono", fontSize: 12 },
  labelStyle: { color: "hsl(210 20% 92%)" },
};

export default function Dashboard() {
  return (
    <Layout>
      <div className="px-6 py-10 max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Observability Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Real-time system metrics and performance monitoring</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard icon={Clock} title="Avg Latency" value="45ms" trend="down" trendValue="-12ms" variant="primary" />
          <MetricCard icon={Layers} title="Queue Backlog" value="12" trend="down" trendValue="-8" variant="accent" />
          <MetricCard icon={Cpu} title="CPU Usage" value="34%" trend="neutral" trendValue="Stable" />
          <MetricCard icon={Wifi} title="API Rate" value="847/min" trend="up" trendValue="+52/min" variant="primary" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-4">Worker Processing Latency (ms)</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={latencyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 16% 18%)" />
                <XAxis dataKey="time" tick={{ fill: "hsl(215 15% 55%)", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} />
                <YAxis tick={{ fill: "hsl(215 15% 55%)", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} />
                <Tooltip {...chartTooltipStyle} />
                <Line type="monotone" dataKey="latency" stroke="hsl(142 70% 50%)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-4">Queue Backlog</h3>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={queueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 16% 18%)" />
                <XAxis dataKey="time" tick={{ fill: "hsl(215 15% 55%)", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} />
                <YAxis tick={{ fill: "hsl(215 15% 55%)", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} />
                <Tooltip {...chartTooltipStyle} />
                <Area type="monotone" dataKey="backlog" stroke="hsl(185 70% 50%)" fill="hsl(185 70% 50% / 0.15)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-4">Developer Leaderboard</h3>
          <div className="space-y-2">
            {leaderboard.map((dev, i) => (
              <div key={dev.name} className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-secondary/50 transition-colors">
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-mono font-bold ${i === 0 ? "text-warning" : i === 1 ? "text-muted-foreground" : i === 2 ? "text-accent" : "text-muted-foreground"}`}>
                    #{i + 1}
                  </span>
                  <span className="text-sm font-mono text-foreground">@{dev.name}</span>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-xs font-mono text-muted-foreground">{dev.commits} commits</span>
                  <span className="text-sm font-mono font-bold text-primary">{dev.score}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
