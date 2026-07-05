import { cn } from "@/lib/utils";

export interface ActivityItem {
  time: string;
  message: string;
  tone?: "primary" | "success" | "warning" | "danger" | "muted";
}

const toneClass: Record<NonNullable<ActivityItem["tone"]>, string> = {
  primary: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-destructive",
  muted: "bg-muted-foreground",
};

export function ActivityTimeline({ items }: { items: ActivityItem[] }) {
  return (
    <ol className="relative pl-6">
      <span className="absolute left-2 top-2 bottom-2 w-px bg-border" />
      {items.map((it, i) => (
        <li key={i} className="relative py-3 flex items-start gap-4">
          <span className={cn("absolute left-[3px] top-[18px] h-3 w-3 rounded-full ring-4 ring-background", toneClass[it.tone ?? "muted"])} />
          <div className="w-14 shrink-0 text-xs font-mono text-muted-foreground pt-0.5 pl-4">{it.time}</div>
          <div className="text-sm font-medium">{it.message}</div>
        </li>
      ))}
    </ol>
  );
}
