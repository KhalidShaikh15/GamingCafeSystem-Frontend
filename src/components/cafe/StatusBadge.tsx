import { Zap, Lock, Loader2, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";

export type PCStatus = "active" | "locked" | "starting" | "offline";

interface StatusVisual {
  label: string;
  Icon: typeof Zap;
  iconClass?: string;
  text: string;
  border: string;
  background: string; // gradient, applied via inline style
  glow?: string; // box-shadow, applied via inline style
  textColor?: string; // inline color override, used when a Tailwind color-mix() class isn't reliable
  borderColor?: string;
}

const map: Record<PCStatus, StatusVisual> = {
  active: {
    label: "Active",
    Icon: Zap,
    text: "text-success",
    border: "border-success/50",
    background:
      "linear-gradient(135deg, color-mix(in oklch, var(--success) 22%, transparent), color-mix(in oklch, var(--success) 6%, transparent))",
    glow: "0 0 10px -2px color-mix(in oklch, var(--success) 55%, transparent)",
  },
  locked: {
    label: "Locked",
    Icon: Lock,
    text: "text-primary",
    border: "border-primary/50",
    background:
      "linear-gradient(135deg, color-mix(in oklch, var(--primary) 20%, transparent), color-mix(in oklch, var(--primary) 5%, transparent))",
  },
  starting: {
    label: "Starting",
    Icon: Loader2,
    iconClass: "animate-spin",
    text: "text-warning",
    border: "border-warning/50",
    background:
      "linear-gradient(135deg, color-mix(in oklch, var(--warning) 22%, transparent), color-mix(in oklch, var(--warning) 6%, transparent))",
    glow: "0 0 10px -2px color-mix(in oklch, var(--warning) 55%, transparent)",
  },
  offline: {
    label: "Offline",
    Icon: WifiOff,
    text: "",
    border: "",
    textColor: "var(--ember)",
    borderColor: "color-mix(in oklch, var(--ember) 55%, transparent)",
    background:
      "linear-gradient(135deg, color-mix(in oklch, var(--ember) 24%, transparent), color-mix(in oklch, var(--ember) 6%, transparent))",
  },
};

export function StatusBadge({ status, className }: { status: PCStatus; className?: string }) {
  const s = map[status];
  const isAnimated = status === "active";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border",
        s.text,
        s.border,
        className
      )}
      style={{
        background: s.background,
        boxShadow: s.glow,
        color: s.textColor,
        borderColor: s.borderColor,
      }}
    >
      <s.Icon className={cn("h-3 w-3", s.iconClass, isAnimated && "animate-pulse")} />
      {s.label}
    </span>
  );
}
