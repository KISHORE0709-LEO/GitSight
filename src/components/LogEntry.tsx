interface LogEntryProps {
  level: "INFO" | "WARNING" | "ERROR" | "DEBUG";
  message: string;
  timestamp: string;
}

const levelColors = {
  INFO: "text-primary",
  WARNING: "text-warning",
  ERROR: "text-destructive",
  DEBUG: "text-accent",
};

export function LogEntry({ level, message, timestamp }: LogEntryProps) {
  return (
    <div className="flex items-start gap-3 py-1.5 font-mono text-xs border-b border-border/50 hover:bg-secondary/50 px-3 transition-colors">
      <span className="text-muted-foreground shrink-0">{timestamp}</span>
      <span className={`font-bold shrink-0 w-16 ${levelColors[level]}`}>[{level}]</span>
      <span className="text-foreground/80">{message}</span>
    </div>
  );
}
