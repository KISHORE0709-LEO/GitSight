import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  variant?: "default" | "primary" | "accent" | "warning";
}

const variantStyles = {
  default: "border-border hover:border-muted-foreground/20",
  primary: "border-primary/20 hover:border-primary/40 box-glow-primary",
  accent: "border-accent/20 hover:border-accent/40 box-glow-accent",
  warning: "border-warning/20 hover:border-warning/40 box-glow-warning",
};

const iconVariantStyles = {
  default: "bg-secondary text-muted-foreground",
  primary: "bg-primary/10 text-primary border border-primary/20",
  accent: "bg-accent/10 text-accent border border-accent/20",
  warning: "bg-warning/10 text-warning border border-warning/20",
};

export function MetricCard({ title, value, subtitle, icon: Icon, trend, trendValue, variant = "default" }: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.3 }}
      className={`rounded-xl border card-shine p-5 transition-all duration-300 ${variantStyles[variant]}`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-[11px] font-mono text-muted-foreground uppercase tracking-widest">{title}</p>
          <p className="text-3xl font-bold font-mono text-foreground tracking-tight">{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          {trendValue && (
            <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono ${trend === "up" ? "bg-primary/10 text-primary" : trend === "down" ? "bg-destructive/10 text-destructive" : "bg-secondary text-muted-foreground"}`}>
              {trend === "up" ? "↑" : trend === "down" ? "↓" : "●"} {trendValue}
            </div>
          )}
        </div>
        <div className={`p-2.5 rounded-xl ${iconVariantStyles[variant]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </motion.div>
  );
}
