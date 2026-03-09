import {
  Home, Search, BarChart3, AlertTriangle, FileText, Zap, Network, GitBranch
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

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

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarContent>
        <div className="p-4 border-b border-border">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <Network className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-foreground font-mono">GHOPS</h2>
                <p className="text-[10px] text-muted-foreground">Observability Platform</p>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="flex justify-center">
              <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <Network className="h-4 w-4 text-primary" />
              </div>
            </div>
          )}
        </div>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-mono text-muted-foreground tracking-widest">
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
                      className="hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                      activeClassName="bg-primary/10 text-primary font-medium box-glow-primary"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span className="text-sm">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
