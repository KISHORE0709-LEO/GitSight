interface LogEntryProps {
  level: "INFO" | "WARNING" | "ERROR" | "DEBUG";
  message: string;
  timestamp: string;
}

const levelConfig = {
  INFO: { color: "text-primary", bg: "bg-primary/5", badge: "bg-primary/10 text-primary border-primary/20" },
  WARNING: { color: "text-warning", bg: "bg-warning/5", badge: "bg-warning/10 text-warning border-warning/20" },
  ERROR: { color: "text-destructive", bg: "bg-destructive/5", badge: "bg-destructive/10 text-destructive border-destructive/20" },
  DEBUG: { color: "text-accent", bg: "bg-accent/5", badge: "bg-accent/10 text-accent border-accent/20" },
};

export function LogEntry({ level, message, timestamp }: LogEntryProps) {
  const config = levelConfig[level];
  return (
    <div className={`flex items-start gap-3 py-2 font-mono text-xs border-b border-border/30 hover:${config.bg} px-4 transition-colors group`}>
      <span className="text-muted-foreground/60 shrink-0 group-hover:text-muted-foreground transition-colors">{timestamp}</span>
      <span className={`shrink-0 px-1.5 py-0.5 rounded text-[10px] font-bold border ${config.badge}`}>
        {level}
      </span>
      <span className="text-foreground/70 group-hover:text-foreground/90 transition-colors">{message}</span>
    </div>
  );
}
