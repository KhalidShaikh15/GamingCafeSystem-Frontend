import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Monitor, Timer, ScrollText, Info, Gamepad2 } from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/gaming-pcs", label: "Gaming PCs", icon: Monitor },
  { to: "/sessions", label: "Sessions", icon: Timer },
  { to: "/logs", label: "Logs", icon: ScrollText },
  { to: "/about", label: "About", icon: Info },
] as const;

export function Sidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside className="hidden md:flex md:w-64 flex-col bg-sidebar border-r border-sidebar-border">
      <div className="h-16 flex items-center gap-2 px-5 border-b border-sidebar-border">
        <div className="h-9 w-9 rounded-md grid place-items-center bg-primary/15 text-primary glow-primary">
          <Gamepad2 className="h-5 w-5" />
        </div>
        <div className="leading-tight">
          <div className="font-display text-lg font-bold tracking-wide">CAFE<span className="text-primary">OPS</span></div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Control Panel</div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {nav.map((item) => {
          const active = pathname === item.to || (item.to !== "/dashboard" && pathname.startsWith(item.to));
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                active
                  ? "bg-primary/15 text-foreground border border-primary/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent"
              )}
            >
              <Icon className={cn("h-4 w-4", active && "text-primary")} />
              {item.label}
              {active && <span className="ml-auto status-dot bg-primary" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="status-dot bg-success animate-pulse" />
          Agent service online
        </div>
      </div>
    </aside>
  );
}
