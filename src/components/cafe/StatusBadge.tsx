import { cn } from "@/lib/utils";

export type PCStatus = "active" | "locked" | "starting" | "offline";

const map: Record<PCStatus, { label: string; dot: string; text: string; bg: string; border: string }> = {
  active:   { label: "Active",   dot: "bg-success",     text: "text-success",     bg: "bg-success/10",     border: "border-success/30" },
  locked:   { label: "Locked",   dot: "bg-primary",     text: "text-primary",     bg: "bg-primary/10",     border: "border-primary/30" },
  starting: { label: "Starting", dot: "bg-warning",     text: "text-warning",     bg: "bg-warning/10",     border: "border-warning/30" },
  offline:  { label: "Offline",  dot: "bg-destructive", text: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/30" },
};

export function StatusBadge({ status, className }: { status: PCStatus; className?: string }) {
  const s = map[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border", s.bg, s.text, s.border, className)}>
      <span className={cn("status-dot", s.dot, status === "active" && "animate-pulse")} />
      {s.label}
    </span>
  );
}
