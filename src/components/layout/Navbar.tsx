import { Bell, Search } from "lucide-react";
import { useRouterState } from "@tanstack/react-router";

const titles: Record<string, { title: string; subtitle: string }> = {
  "/dashboard": { title: "Dashboard", subtitle: "Live overview of your gaming cafe" },
  "/gaming-pcs": { title: "Gaming PCs", subtitle: "Control every station in real time" },
  "/sessions": { title: "Sessions", subtitle: "Active and recent gaming sessions" },
  "/logs": { title: "Logs", subtitle: "System activity and troubleshooting" },
  "/about": { title: "About", subtitle: "Software information" },
};

export function Navbar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const meta = titles[pathname] ?? titles["/gaming-pcs"];

  return (
    <header className="h-16 border-b border-border bg-secondary/60 backdrop-blur px-6 flex items-center gap-4">
      <div className="flex-1 min-w-0">
        <h1 className="text-lg font-bold leading-tight">{meta.title}</h1>
        <p className="text-xs text-muted-foreground truncate">{meta.subtitle}</p>
      </div>
      <div className="hidden md:flex items-center gap-2 h-9 px-3 rounded-md bg-background/60 border border-border text-sm text-muted-foreground w-72">
        <Search className="h-4 w-4" />
        <span>Search PC, session…</span>
      </div>
      <button className="h-9 w-9 grid place-items-center rounded-md border border-border bg-background/60 hover:bg-accent transition-colors relative">
        <Bell className="h-4 w-4" />
        <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-warning" />
      </button>
      <div className="h-9 px-3 rounded-md border border-border bg-background/60 hidden sm:flex items-center gap-2 text-xs">
        <span className="status-dot bg-success animate-pulse" />
        <span className="text-muted-foreground">Backend</span>
        <span className="font-medium">Connected</span>
      </div>
    </header>
  );
}
