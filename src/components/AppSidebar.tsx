import {
  Home, Search, BarChart3, AlertTriangle, FileText, Zap, Network, GitBranch
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useAnalysis } from "@/context/AnalysisContext";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function AppSidebar() {
  const { state } = useSidebar();
  const { analyzedUsername } = useAnalysis();
  const collapsed = state === "collapsed";

  const items = [
    { title: "Home", url: "/", icon: Home },
    { title: "Analyze", url: "/analyze", icon: Search },
    { title: "Dashboard", url: "/dashboard", icon: BarChart3 },
    { title: "Incidents", url: "/incidents", icon: AlertTriangle },
    { title: "Logs", url: "/logs", icon: FileText },
    { title: "Chaos", url: "/chaos", icon: Zap },
    { title: "Architecture", url: "/architecture", icon: Network },
    { title: "DevOps", url: "/devops", icon: GitBranch },
  ];

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarContent>
        <div className="p-4 border-b border-border">
          {!collapsed && (
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/30 flex items-center justify-center">
                <Network className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h2 className="text-sm font-extrabold text-foreground font-mono tracking-wider">GHOPS</h2>
                <p className="text-[10px] text-muted-foreground font-mono">v2.4.1 • Observability</p>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="flex justify-center">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/30 flex items-center justify-center">
                <Network className="h-4 w-4 text-primary" />
              </div>
            </div>
          )}
        </div>

        {analyzedUsername && !collapsed && (
          <div className="px-4 py-3 border-b border-border">
            <p className="text-[10px] font-mono text-muted-foreground/60 tracking-[0.2em] uppercase mb-1">Analyzed User</p>
            <p className="text-sm font-bold text-primary font-mono">@{analyzedUsername}</p>
          </div>
        )}

        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-mono text-muted-foreground/60 tracking-[0.2em]">
            NAVIGATION
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className="hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-all rounded-lg"
                      activeClassName="bg-primary/10 text-primary font-medium border border-primary/20"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span className="text-sm font-mono">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {analyzedUsername && !collapsed && (
          <div className="px-4 py-3 border-t border-border mt-4">
            <p className="text-[10px] font-mono text-muted-foreground/60 tracking-[0.2em] uppercase mb-2">Current Analysis</p>
            <div className="space-y-1">
              <p className="text-xs font-mono text-primary">Dashboard: @{analyzedUsername}</p>
              <p className="text-xs font-mono text-primary">Incidents: @{analyzedUsername}</p>
              <p className="text-xs font-mono text-primary">Logs: @{analyzedUsername}</p>
              <p className="text-xs font-mono text-primary">Chaos: @{analyzedUsername}</p>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
