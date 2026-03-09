import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { MetricCard } from "@/components/MetricCard";
import {
  GitCommit, GitPullRequest, Activity, Users, Server, Database,
  Shield, Zap, BarChart3, Network, ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: GitPullRequest,
    title: "Developer Analytics",
    description: "Track commits, PRs, and calculate productivity scores from GitHub activity.",
    link: "/analyze",
  },
  {
    icon: BarChart3,
    title: "Observability Dashboard",
    description: "Real-time metrics: latency, queue backlog, API rates, system health.",
    link: "/dashboard",
  },
  {
    icon: Shield,
    title: "Incident Detection",
    description: "Automated anomaly detection with alerting for queue backlogs and failures.",
    link: "/incidents",
  },
  {
    icon: Zap,
    title: "Chaos Engineering",
    description: "Simulate worker and API failures to validate system resilience.",
    link: "/chaos",
  },
  {
    icon: Network,
    title: "Cloud Architecture",
    description: "Event-driven pipeline: Lambda → SQS → Docker Workers → DynamoDB.",
    link: "/architecture",
  },
  {
    icon: Server,
    title: "CI/CD Pipeline",
    description: "Automated builds, tests, and deployments via GitHub Actions.",
    link: "/devops",
  },
];

export default function Index() {
  return (
    <Layout>
      <div className="relative">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 grid-bg opacity-50" />
          <div className="absolute inset-0 scanline pointer-events-none" />
          <div className="relative px-6 py-20 md:py-32 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-2 text-xs font-mono text-primary">
                <div className="h-2 w-2 rounded-full bg-primary animate-pulse-glow" />
                <span>CLOUD-NATIVE OBSERVABILITY PLATFORM</span>
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-foreground leading-[1.1]">
                GitHub Developer<br />
                <span className="text-glow-primary text-primary">Productivity</span> &<br />
                <span className="text-glow-accent text-accent">Reliability</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
                An event-driven system that analyzes developer activity, calculates productivity metrics, and provides system reliability monitoring through dashboards, alerts, and fault-tolerant processing.
              </p>
              <div className="flex flex-wrap gap-3 pt-4">
                <Link
                  to="/analyze"
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-mono text-sm font-bold hover:bg-primary/90 transition-colors box-glow-primary"
                >
                  Analyze Developer <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 border border-border bg-card text-foreground px-6 py-3 rounded-lg font-mono text-sm font-bold hover:bg-secondary transition-colors"
                >
                  View Dashboard
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Live Metrics */}
        <section className="px-6 pb-12 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard icon={GitCommit} title="Total Commits" value="12,847" trend="up" trendValue="+14% this week" variant="primary" />
            <MetricCard icon={GitPullRequest} title="PRs Merged" value="1,293" trend="up" trendValue="+8% this week" variant="accent" />
            <MetricCard icon={Users} title="Active Devs" value="47" trend="neutral" trendValue="Stable" />
            <MetricCard icon={Activity} title="System Uptime" value="99.97%" trend="up" trendValue="+0.02%" variant="primary" />
          </div>
        </section>

        {/* Features Grid */}
        <section className="px-6 pb-20 max-w-6xl mx-auto">
          <div className="mb-8">
            <h2 className="text-xs font-mono text-primary tracking-widest uppercase">Platform Capabilities</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
              >
                <Link
                  to={feature.link}
                  className="block group rounded-lg border border-border bg-card p-6 hover:border-primary/40 hover:box-glow-primary transition-all duration-300"
                >
                  <feature.icon className="h-8 w-8 text-primary mb-4" />
                  <h3 className="text-base font-bold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                  <div className="mt-4 flex items-center gap-1 text-xs font-mono text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    Explore <ArrowRight className="h-3 w-3" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Tech Stack */}
        <section className="px-6 pb-20 max-w-6xl mx-auto">
          <h2 className="text-xs font-mono text-primary tracking-widest uppercase mb-6">Tech Stack</h2>
          <div className="flex flex-wrap gap-2">
            {["Python", "Flask", "AWS Lambda", "AWS SQS", "DynamoDB", "Docker", "GitHub Actions", "Prometheus", "Grafana", "GitHub REST API"].map((tech) => (
              <span key={tech} className="px-3 py-1.5 rounded-md bg-secondary border border-border text-xs font-mono text-secondary-foreground">
                {tech}
              </span>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
}
