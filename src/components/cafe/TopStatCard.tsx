import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  label: string;
  value: number | string;
  icon: LucideIcon;
  tone?: "primary" | "success" | "warning" | "danger";
  hint?: string;
}

const tones: Record<NonNullable<Props["tone"]>, string> = {
  primary: "text-primary bg-primary/10 border-primary/20",
  success: "text-success bg-success/10 border-success/20",
  warning: "text-warning bg-warning/10 border-warning/20",
  danger:  "text-destructive bg-destructive/10 border-destructive/20",
};

export function TopStatCard({ label, value, icon: Icon, tone = "primary", hint }: Props) {
  return (
    <div className="card-surface p-5 flex items-start gap-4 relative overflow-hidden">
      <div className={cn("h-12 w-12 rounded-lg grid place-items-center border", tones[tone])}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
        <div className="text-3xl font-display font-bold mt-1">{value}</div>
        {hint && <div className="text-xs text-muted-foreground mt-1">{hint}</div>}
      </div>
    </div>
  );
}
