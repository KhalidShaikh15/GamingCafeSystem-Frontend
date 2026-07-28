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

export function PCCard({ pc, onStart, onExtend, onEnd, onRestart, onShutdown, onWake }: Props) {
  const isActive = pc.status === "active";
  const isLocked = pc.status === "locked";
  const isOffline = pc.status === "offline";

  const accent =
    pc.status === "active" ? "before:bg-success" :
    pc.status === "locked" ? "before:bg-primary" :
    pc.status === "starting" ? "before:bg-warning" :
    "before:bg-destructive";
  const canStart = pc.status === "locked";
  const canEnd = pc.status === "active";
  const canExtend = pc.status === "active";
  const canRestart = pc.status !== "offline";
  const canShutdown = pc.status !== "offline";
  const canWake = pc.status === "offline";

  return (
    <div className={cn(
      "card-surface p-5 flex flex-col gap-4 relative overflow-hidden",
      "before:content-[''] before:absolute before:top-0 before:left-0 before:h-full before:w-1",
      accent
    )}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={cn(
            "h-11 w-11 rounded-lg grid place-items-center border",
            isActive && "bg-success/10 border-success/30 text-success",
            isLocked && "bg-primary/10 border-primary/30 text-primary",
            pc.status === "starting" && "bg-warning/10 border-warning/30 text-warning",
            isOffline && "bg-destructive/10 border-destructive/30 text-destructive"
          )}>
            <Monitor className="h-5 w-5" />
          </div>
          <div>
            <div className="font-display font-bold text-lg leading-none">{pc.name}</div>
            <div className="text-[11px] uppercase tracking-widest text-muted-foreground mt-1">Station {pc.id}</div>
          </div>
        </div>
        <StatusBadge status={pc.status} />
      </div>

      <div className="flex items-center justify-between bg-background/40 border border-border rounded-md px-3 py-2.5">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          End Time
        </div>
        <div className="font-mono font-semibold text-base tabular-nums">
          {formatEndTime(pc.endTime)}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {isOffline ? (
          <>
            <Button size="sm" variant="secondary" className="col-span-2" disabled={!canWake} onClick={() => onWake?.(pc)}>
              <Wifi className="h-4 w-4" /> Wake
            </Button>
          </>
        ) : (
          <>
            <Button size="sm" disabled={!canStart} onClick={() => onStart?.(pc)}>
              <Play className="h-4 w-4" /> Start
            </Button>
            <Button size="sm" variant="secondary" disabled={!canExtend} onClick={() => onExtend?.(pc)}>
              <Clock className="h-4 w-4" /> Extend
            </Button>
            <Button size="sm" variant="destructive" disabled={!canEnd} onClick={() => onEnd?.(pc)}>
              <Square className="h-4 w-4" /> End
            </Button>
            <Button size="sm" variant="outline" disabled={!canRestart} onClick={() => onRestart?.(pc)}>
              <RotateCw className="h-4 w-4" /> Restart
            </Button>
            <Button size="sm" variant="outline" className="col-span-2" disabled={!canShutdown} onClick={() => onShutdown?.(pc)}>
              <Power className="h-4 w-4" /> Shutdown
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
