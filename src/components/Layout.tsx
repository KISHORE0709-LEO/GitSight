import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Activity, Server, Layers, AlertTriangle } from "lucide-react";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-h-screen">
          <header className="h-14 flex items-center border-b border-border bg-card/80 backdrop-blur-xl sticky top-0 z-50">
            <SidebarTrigger className="ml-3 text-muted-foreground hover:text-primary transition-colors" />
            <div className="ml-3 flex items-center gap-2.5">
              <div className="relative">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <div className="absolute inset-0 h-2 w-2 rounded-full bg-primary animate-ping opacity-40" />
              </div>
              <span className="text-xs font-mono text-primary font-bold tracking-wide">SYSTEM ONLINE</span>
            </div>
            <div className="ml-auto mr-4 hidden lg:flex items-center gap-1">
              <StatusPill icon={Server} label="Workers" value="3 healthy" color="primary" />
              <div className="h-4 w-px bg-border mx-1" />
              <StatusPill icon={Layers} label="Queue" value="12 msgs" color="accent" />
              <div className="h-4 w-px bg-border mx-1" />
              <StatusPill icon={AlertTriangle} label="Incidents" value="2 active" color="warning" />
              <div className="h-4 w-px bg-border mx-1" />
              <StatusPill icon={Activity} label="Uptime" value="99.97%" color="primary" />
            </div>
          </header>
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function StatusPill({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: string; color: "primary" | "accent" | "warning" }) {
  const dotColor = color === "primary" ? "bg-primary" : color === "accent" ? "bg-accent" : "bg-warning";
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-secondary/50 border border-border/50">
      <div className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />
      <span className="text-[10px] font-mono text-muted-foreground">{label}:</span>
      <span className="text-[10px] font-mono text-foreground font-medium">{value}</span>
    </div>
  );
}
