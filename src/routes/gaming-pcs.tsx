import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PCCard, type PC } from "@/components/cafe/PCCard";
import { StartSessionModal } from "@/components/cafe/StartSessionModal";
import { MOCK_PCS } from "@/lib/mock-pcs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/gaming-pcs")({
  head: () => ({
    meta: [
      { title: "Gaming PCs — CafeOps" },
      { name: "description", content: "Control every gaming station in your cafe: start, extend, end, restart or shut down PCs." },
    ],
  }),
  component: GamingPCsPage,
});

const FILTERS = [
  { key: "all",      label: "All" },
  { key: "active",   label: "Active" },
  { key: "locked",   label: "Locked" },
  { key: "starting", label: "Starting" },
  { key: "offline",  label: "Offline" },
] as const;

function GamingPCsPage() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["key"]>("all");
  const [modalPC, setModalPC] = useState<PC | null>(null);
  const [open, setOpen] = useState(false);

  const pcs = useMemo(
    () => (filter === "all" ? MOCK_PCS : MOCK_PCS.filter((p) => p.status === filter)),
    [filter]
  );

  const handleStart = (pc: PC) => { setModalPC(pc); setOpen(true); };
  const noop = () => { /* placeholder — connect to Express backend */ };

  return (
    <AppShell>
      <div className="space-y-6 max-w-[1400px] mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5 p-1 rounded-lg bg-secondary border border-border">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={cn(
                  "px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                  filter === f.key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">Refresh</Button>
            <Button size="sm">Broadcast Message</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {pcs.map((pc) => (
            <PCCard
              key={pc.id}
              pc={pc}
              onStart={handleStart}
              onExtend={noop}
              onEnd={noop}
              onRestart={noop}
              onShutdown={noop}
              onWake={noop}
            />
          ))}
        </div>
      </div>

      <StartSessionModal pc={modalPC} open={open} onOpenChange={setOpen} onStart={noop} />
    </AppShell>
  );
}
