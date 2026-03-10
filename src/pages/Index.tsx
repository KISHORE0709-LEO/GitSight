import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { MetricCard } from "@/components/MetricCard";
import {
  GitCommit, GitPullRequest, Activity, Users, Server, Database,
  Shield, Zap, BarChart3, Network, ArrowRight, Terminal
} from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  { icon: GitPullRequest, title: "Developer Analytics", description: "Track commits, PRs, and calculate productivity scores from GitHub activity.", link: "/analyze" },
  { icon: BarChart3, title: "Observability Dashboard", description: "Real-time metrics: latency, queue backlog, API rates, system health.", link: "/dashboard" },
  { icon: Shield, title: "Incident Detection", description: "Automated anomaly detection with alerting for queue backlogs and failures.", link: "/incidents" },
  { icon: Zap, title: "Chaos Engineering", description: "Simulate worker and API failures to validate system resilience.", link: "/chaos" },
  { icon: Network, title: "Cloud Architecture", description: "Event-driven pipeline: Lambda → SQS → Docker Workers → DynamoDB.", link: "/architecture" },
  { icon: Server, title: "CI/CD Pipeline", description: "Automated builds, tests, and deployments via GitHub Actions.", link: "/devops" },
];

const techStack = [
  { name: "Python", category: "backend" },
  { name: "Flask", category: "backend" },
  { name: "AWS Lambda", category: "cloud" },
  { name: "AWS SQS", category: "cloud" },
  { name: "DynamoDB", category: "cloud" },
  { name: "Docker", category: "devops" },
  { name: "GitHub Actions", category: "devops" },
  { name: "Prometheus", category: "monitoring" },
  { name: "Grafana", category: "monitoring" },
  { name: "GitHub REST API", category: "backend" },
];

export default function Index() {
  return (
    <Layout>
      <div className="relative">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 hero-gradient" />
          <div className="absolute inset-0 grid-bg" />
          <div className="absolute inset-0 scanline pointer-events-none" />
          <div className="relative px-6 py-24 md:py-36 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="space-y-8"
            >
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20"
              >
                <Terminal className="h-3 w-3 text-primary" />
                <span className="text-[11px] font-mono text-primary font-bold tracking-wider">CLOUD-NATIVE OBSERVABILITY PLATFORM</span>
              </motion.div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-foreground leading-[1.05]">
                GitHub Developer<br />
                <span className="text-glow-primary text-primary">Productivity</span> &<br />
                <span className="text-glow-accent text-accent">Reliability</span>
              </h1>

              <p className="text-base md:text-lg text-muted-foreground max-w-xl leading-relaxed">
                An event-driven system that analyzes developer activity, calculates productivity metrics, and provides system reliability monitoring through dashboards, alerts, and fault-tolerant processing.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  to="/analyze"
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-7 py-3.5 rounded-xl font-mono text-sm font-bold hover:bg-primary/90 transition-all box-glow-primary hover:scale-[1.02] active:scale-[0.98]"
                >
                  Analyze Developer <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 border border-border bg-card/80 text-foreground px-7 py-3.5 rounded-xl font-mono text-sm font-bold hover:bg-secondary hover:border-muted-foreground/20 transition-all"
                >
                  View Dashboard
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Live Metrics */}
        <section className="px-6 pb-16 max-w-6xl mx-auto -mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard icon={GitCommit} title="Total Commits" value="12,847" trend="up" trendValue="+14% this week" variant="primary" />
            <MetricCard icon={GitPullRequest} title="PRs Merged" value="1,293" trend="up" trendValue="+8% this week" variant="accent" />
            <MetricCard icon={Users} title="Active Devs" value="47" trend="neutral" trendValue="Stable" />
            <MetricCard icon={Activity} title="System Uptime" value="99.97%" trend="up" trendValue="+0.02%" variant="primary" />
          </div>
        </section>

        {/* Features Grid */}
        <section className="px-6 pb-20 max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-10"
          >
            <h2 className="text-xs font-mono text-primary tracking-[0.2em] uppercase font-bold">Platform Capabilities</h2>
            <p className="text-sm text-muted-foreground mt-2">Everything you need for developer observability and reliability engineering</p>
          </motion.div>
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
                  className="block group rounded-xl border border-border card-shine p-6 hover:border-primary/30 transition-all duration-300 hover:box-glow-primary"
                >
                  <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 w-fit mb-4 group-hover:bg-primary/15 transition-colors">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-base font-bold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                  <div className="mt-4 flex items-center gap-1 text-xs font-mono text-primary opacity-0 group-hover:opacity-100 transition-all translate-x-0 group-hover:translate-x-1">
                    Explore <ArrowRight className="h-3 w-3" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Tech Stack */}
        <section className="px-6 pb-24 max-w-6xl mx-auto">
          <h2 className="text-xs font-mono text-primary tracking-[0.2em] uppercase font-bold mb-6">Tech Stack</h2>
          <div className="flex flex-wrap gap-2">
            {techStack.map((tech, i) => (
              <motion.span
                key={tech.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.04 }}
                className="px-4 py-2 rounded-lg bg-secondary/80 border border-border text-xs font-mono text-secondary-foreground hover:border-primary/30 hover:text-primary transition-all cursor-default"
              >
                {tech.name}
              </motion.span>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
}
