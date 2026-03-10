import { Layout } from "@/components/Layout";
import { MetricCard } from "@/components/MetricCard";
import { Clock, Layers, Cpu, Wifi, Crown } from "lucide-react";
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
  contentStyle: { background: "hsl(222 20% 8%)", border: "1px solid hsl(222 16% 14%)", borderRadius: 12, fontFamily: "JetBrains Mono", fontSize: 12 },
  labelStyle: { color: "hsl(210 40% 96%)" },
};

export default function Dashboard() {
  return (
    <Layout>
      <div className="px-6 py-10 max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Observability Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Real-time system metrics and performance monitoring</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard icon={Clock} title="Avg Latency" value="45ms" trend="down" trendValue="-12ms" variant="primary" />
          <MetricCard icon={Layers} title="Queue Backlog" value="12" trend="down" trendValue="-8" variant="accent" />
          <MetricCard icon={Cpu} title="CPU Usage" value="34%" trend="neutral" trendValue="Stable" />
          <MetricCard icon={Wifi} title="API Rate" value="847/min" trend="up" trendValue="+52/min" variant="primary" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-xl border border-border card-shine p-6">
            <h3 className="text-xs font-mono text-primary uppercase tracking-[0.2em] font-bold mb-6">Worker Processing Latency (ms)</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={latencyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 16% 14%)" />
                <XAxis dataKey="time" tick={{ fill: "hsl(215 15% 50%)", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "hsl(215 15% 50%)", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                <Tooltip {...chartTooltipStyle} />
                <Line type="monotone" dataKey="latency" stroke="hsl(142 70% 45%)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="rounded-xl border border-border card-shine p-6">
            <h3 className="text-xs font-mono text-primary uppercase tracking-[0.2em] font-bold mb-6">Queue Backlog</h3>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={queueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 16% 14%)" />
                <XAxis dataKey="time" tick={{ fill: "hsl(215 15% 50%)", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "hsl(215 15% 50%)", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                <Tooltip {...chartTooltipStyle} />
                <Area type="monotone" dataKey="backlog" stroke="hsl(185 70% 45%)" fill="hsl(185 70% 45% / 0.1)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-border card-shine p-6">
          <h3 className="text-xs font-mono text-primary uppercase tracking-[0.2em] font-bold mb-6">Developer Leaderboard</h3>
          <div className="space-y-1">
            {leaderboard.map((dev, i) => (
              <div key={dev.name} className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-secondary/50 transition-all group">
                <div className="flex items-center gap-4">
                  <span className={`text-sm font-mono font-bold w-6 text-center ${i === 0 ? "text-warning" : i === 1 ? "text-muted-foreground" : i === 2 ? "text-accent" : "text-muted-foreground/60"}`}>
                    {i === 0 ? <Crown className="h-4 w-4 text-warning inline" /> : `#${i + 1}`}
                  </span>
                  <div className="h-8 w-8 rounded-lg bg-secondary border border-border flex items-center justify-center">
                    <span className="text-xs font-mono font-bold text-foreground">{dev.name[0].toUpperCase()}</span>
                  </div>
                  <span className="text-sm font-mono text-foreground group-hover:text-primary transition-colors">@{dev.name}</span>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-xs font-mono text-muted-foreground">{dev.commits} commits</span>
                  <span className="text-sm font-mono font-bold text-primary tabular-nums">{dev.score}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
