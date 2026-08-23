import { Monitor, Play, Clock, Square, RotateCw, Power, Wifi } from "lucide-react";
import { StatusBadge, type PCStatus } from "./StatusBadge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface PC {
  id: string;
  name: string;
  status: PCStatus;
  endTime: Date | null;
}

interface Props {
  pc: PC;
  onStart?: (pc: PC) => void;
  onExtend?: (pc: PC) => void;
  onEnd?: (pc: PC) => void;
  onRestart?: (pc: PC) => void;
  onShutdown?: (pc: PC) => void;
  onWake?: (pc: PC) => void;
}

function formatEndTime(endTime: Date | null) {
  if (!endTime) return "--";

  return endTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ── State-driven visual language ────────────────────────────────────────
// Everything below is purely presentational. It does not determine which
// statuses exist, which actions are enabled, or any callback behavior —
// see the can* flags and JSX further down, which are unchanged in logic.

interface StateVisual {
  border: string; // gradient background for the border ring, inline style
  glow: string; // box-shadow, inline style
  surface: string; // gradient background for the card body, inline style
  iconChip: string; // Tailwind classes
  iconGlow?: string; // box-shadow, inline style
  dormant?: boolean; // slightly desaturated/denser treatment (offline)
}

const stateVisuals: Record<PCStatus, StateVisual> = {
  active: {
    border:
      "linear-gradient(135deg, color-mix(in oklch, var(--success) 85%, transparent), color-mix(in oklch, var(--success) 30%, transparent) 45%, color-mix(in oklch, var(--primary) 20%, transparent) 100%)",
    glow:
      "0 0 32px -6px color-mix(in oklch, var(--success) 45%, transparent), 0 12px 28px -14px rgba(0,0,0,0.65)",
    surface:
      "linear-gradient(160deg, color-mix(in oklch, var(--card) 90%, white 3%), color-mix(in oklch, var(--card) 75%, var(--success) 8%))",
    iconChip: "bg-success/15 border-success/40 text-success",
    iconGlow: "0 0 16px -3px color-mix(in oklch, var(--success) 60%, transparent)",
  },
  locked: {
    border:
      "linear-gradient(135deg, color-mix(in oklch, var(--primary) 70%, transparent), color-mix(in oklch, var(--primary) 22%, transparent) 55%, transparent 100%)",
    glow:
      "0 0 22px -8px color-mix(in oklch, var(--primary) 35%, transparent), 0 12px 28px -14px rgba(0,0,0,0.65)",
    surface:
      "linear-gradient(160deg, color-mix(in oklch, var(--card) 90%, white 3%), var(--card))",
    iconChip: "bg-primary/15 border-primary/40 text-primary",
  },
  starting: {
    border:
      "linear-gradient(135deg, color-mix(in oklch, var(--warning) 80%, transparent), color-mix(in oklch, oklch(0.55 0.2 300) 55%, transparent) 50%, color-mix(in oklch, var(--primary) 40%, transparent) 100%)",
    glow:
      "0 0 30px -6px color-mix(in oklch, var(--warning) 40%, transparent), 0 12px 28px -14px rgba(0,0,0,0.65)",
    surface:
      "linear-gradient(160deg, color-mix(in oklch, var(--card) 90%, white 3%), color-mix(in oklch, var(--card) 75%, var(--warning) 6%))",
    iconChip: "bg-warning/15 border-warning/40 text-warning",
    iconGlow: "0 0 16px -3px color-mix(in oklch, var(--warning) 55%, transparent)",
  },
  offline: {
    // Sophisticated "cooling ember" atmosphere — muted rust/orange, not alarm-red.
    border:
      "linear-gradient(135deg, color-mix(in oklch, var(--ember) 75%, transparent), color-mix(in oklch, var(--destructive) 18%, transparent) 55%, transparent 100%)",
    glow:
      "0 0 24px -8px color-mix(in oklch, var(--ember) 45%, transparent), 0 12px 28px -14px rgba(0,0,0,0.7)",
    surface:
      "linear-gradient(160deg, color-mix(in oklch, var(--card) 85%, var(--ember) 7%), color-mix(in oklch, var(--card) 68%, black 12%))",
    iconChip: "bg-[color-mix(in_oklch,var(--ember)_15%,transparent)] border-[color-mix(in_oklch,var(--ember)_40%,transparent)]",
    dormant: true,
  },
};

export function PCCard({ pc, onStart, onExtend, onEnd, onRestart, onShutdown, onWake }: Props) {
  const isOffline = pc.status === "offline";
  const isStarting = pc.status === "starting";
  const isActive = pc.status === "active";

  const canStart = pc.status === "locked";
  const canEnd = pc.status === "active";
  const canExtend = pc.status === "active";
  const canRestart = pc.status !== "offline";
  const canShutdown = pc.status !== "offline";
  const canWake = pc.status === "offline";

  // Which single action is the "primary" move for this state — purely a
  // visual promotion, does not change which buttons are enabled.
  const primaryAction: "start" | "wake" | "extend" | null = canStart
    ? "start"
    : canWake
    ? "wake"
    : isActive
    ? "extend"
    : null;

  const v = stateVisuals[pc.status];

  return (
    <div
      className={cn(
        "relative rounded-xl p-[2px] transition-all duration-300 hover:-translate-y-1",
        isStarting && "animate-station-shimmer"
      )}
      style={{ background: v.border, boxShadow: v.glow }}
    >
      <div
        className={cn(
          "glass-surface rounded-[10px] p-5 flex flex-col gap-4 h-full relative overflow-hidden transition-all duration-300",
          v.dormant && "saturate-[0.85]"
        )}
        style={{ background: v.surface }}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={cn(
                "h-12 w-12 rounded-xl grid place-items-center border shrink-0",
                v.iconChip
              )}
              style={{
                boxShadow: v.iconGlow
                  ? `${v.iconGlow}, inset 0 1px 0 0 rgba(255,255,255,0.06)`
                  : "inset 0 1px 0 0 rgba(255,255,255,0.06)",
              }}
            >
              <Monitor className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="font-display font-bold text-xl leading-none tracking-tight truncate">
                {pc.name}
              </div>
              <div className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground mt-1.5">
                Station {pc.id}
              </div>
            </div>
          </div>
          <StatusBadge status={pc.status} className="shrink-0" />
        </div>

        <div className="h-px w-full bg-gradient-to-r from-border via-border/40 to-transparent" />

        {/* End Time readout */}
        <div className="flex items-center justify-between bg-background/50 border border-border rounded-lg px-3 py-2.5">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            End Time
          </div>
          <div
            className={cn(
              "font-mono font-semibold text-base tabular-nums",
              isActive && "text-success"
            )}
          >
            {formatEndTime(pc.endTime)}
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2 mt-auto">
          {isOffline ? (
            <Button
              size="sm"
              variant="secondary"
              className={cn(
                "col-span-2 font-semibold transition-all",
                primaryAction === "wake" &&
                  "shadow-[0_0_18px_-4px_color-mix(in_oklch,var(--ember)_55%,transparent)] ring-1 ring-[color-mix(in_oklch,var(--ember)_45%,transparent)]"
              )}
              disabled={!canWake}
              onClick={() => onWake?.(pc)}
            >
              <Wifi className="h-4 w-4" /> Wake
            </Button>
          ) : (
            <>
              <Button
                size="sm"
                className={cn(
                  "font-semibold transition-all",
                  primaryAction === "start" &&
                    "shadow-[0_0_18px_-4px_var(--primary)] ring-1 ring-primary/50"
                )}
                disabled={!canStart}
                onClick={() => onStart?.(pc)}
              >
                <Play className="h-4 w-4" /> Start
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className={cn(
                  "font-semibold transition-all",
                  primaryAction === "extend" &&
                    "shadow-[0_0_18px_-4px_var(--success)] ring-1 ring-success/40"
                )}
                disabled={!canExtend}
                onClick={() => onExtend?.(pc)}
              >
                <Clock className="h-4 w-4" /> Extend
              </Button>
              <Button size="sm" variant="destructive" disabled={!canEnd} onClick={() => onEnd?.(pc)}>
                <Square className="h-4 w-4" /> End
              </Button>
              <Button size="sm" variant="outline" disabled={!canRestart} onClick={() => onRestart?.(pc)}>
                <RotateCw className="h-4 w-4" /> Restart
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="col-span-2"
                disabled={!canShutdown}
                onClick={() => onShutdown?.(pc)}
              >
                <Power className="h-4 w-4" /> Shutdown
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
