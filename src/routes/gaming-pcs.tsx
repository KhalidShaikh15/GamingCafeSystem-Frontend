import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Gamepad2, RefreshCw, MonitorOff, SearchX } from "lucide-react";

import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { AppShell } from "@/components/layout/AppShell";
import { PCCard, type PC } from "@/components/cafe/PCCard";
import { StartSessionModal } from "@/components/cafe/StartSessionModal";
import { ExtendSessionModal } from "@/components/modals/extend-session-modal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import {
  startSession,
  endSession,
  extendSession,
  restartPc,
  shutdownPc,
  wakePc,
} from "@/api/api";

import { useGamingPcs } from "@/hooks/useGamingPcs";

export const Route = createFileRoute("/gaming-pcs")({
  head: () => ({
    meta: [
      {
        title: "Gaming PCs — CafeOps",
      },
      {
        name: "description",
        content:
          "Control every gaming station in your cafe: start, extend, end, restart or shut down PCs.",
      },
    ],
  }),
  component: GamingPCsPage,
});

const FILTERS = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "locked", label: "Locked" },
  { key: "starting", label: "Starting" },
  { key: "offline", label: "Offline" },
] as const;

function GamingPCsPage() {
  const [filter, setFilter] =
    useState<(typeof FILTERS)[number]["key"]>("all");

  const [modalPC, setModalPC] = useState<PC | null>(null);
  const [open, setOpen] = useState(false);

  const {
    pcs: backendPcs,
    loading,
    refresh,
  } = useGamingPcs();

  // Local-only UI feedback for the Refresh button. Does not alter refresh()
  // itself or the hook's own loading semantics — just wraps the existing
  // call so the button can show a spinner while it resolves.
  const [refreshing, setRefreshing] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedPc, setSelectedPc] = useState<PC | null>(null);

  const [extendOpen, setExtendOpen] = useState(false);
  const [extendPC, setExtendPC] = useState<PC | null>(null);

  const [restartOpen, setRestartOpen] = useState(false);
  const [restartTarget, setRestartTarget] = useState<PC | null>(null);

  const [shutdownOpen, setShutdownOpen] = useState(false);
  const [shutdownTarget, setShutdownTarget] = useState<PC | null>(null);

  const [wakeOpen, setWakeOpen] = useState(false);
  const [wakeTarget, setWakeTarget] = useState<PC | null>(null);

  const pcs: PC[] = backendPcs
    .filter(
      (pc) =>
        filter === "all" ||
        pc.status === filter
    )
    .map((pc) => ({
      id: pc.pcId,
      name: pc.pcId,
      status: pc.status,
      endTime: pc.endTime
        ? new Date(pc.endTime)
        : null,
    }));

  // Derived purely from the real backendPcs feed — no invented figures.
  const statusCounts = {
    all: backendPcs.length,
    active: backendPcs.filter((pc) => pc.status === "active").length,
    locked: backendPcs.filter((pc) => pc.status === "locked").length,
    starting: backendPcs.filter((pc) => pc.status === "starting").length,
    offline: backendPcs.filter((pc) => pc.status === "offline").length,
  };

  const hasAnyPcs = backendPcs.length > 0;
  const hasFilteredResults = pcs.length > 0;

  const handleRefreshClick = async () => {
    setRefreshing(true);
    try {
      await refresh();
    } finally {
      setRefreshing(false);
    }
  };

  const openStartModal = (pc: PC) => {
    setModalPC(pc);
    setOpen(true);
  };

  const openExtendModal = (pc: PC) => {
    setExtendPC(pc);
    setExtendOpen(true);
  };

  const handleStartSession = async (
    pc: PC,
    minutes: number
  ) => {
    try {
      await startSession(pc.id, minutes);

      setOpen(false);

      console.log(
        "Session started successfully"
      );
    } catch (error) {
      console.error(
        "Failed to start session",
        error
      );

      alert("Failed to start session.");
    }
  };

  const handleExtendSession = async (
    pc: PC,
    minutes: number
  ) => {
    try {
      await extendSession(pc.id, minutes);

      setExtendOpen(false);
      setExtendPC(null);

      console.log(
        "Session extended successfully"
      );
    } catch (error) {
      console.error(
        "Failed to extend session",
        error
      );

      alert("Failed to extend session.");
    }
  };

  const handleEndSession = (pc: PC) => {
    console.log(
      "End button clicked",
      pc
    );

    setSelectedPc(pc);
    setConfirmOpen(true);
  };

  const confirmEndSession = async () => {
    if (!selectedPc) {
      return;
    }

    try {
      await endSession(selectedPc.id);

      console.log(
        "Session ended successfully"
      );
    } catch (error) {
      console.error(
        "Failed to end session",
        error
      );

      alert("Failed to end session.");
    } finally {
      setConfirmOpen(false);
      setSelectedPc(null);
    }
  };

  const handleRestart = (pc: PC) => {
    setRestartTarget(pc);
    setRestartOpen(true);
  };

  const confirmRestart = async () => {
    if (!restartTarget) {
      return;
    }

    try {
      await restartPc(
        restartTarget.id
      );

      console.log(
        "Restart request sent successfully."
      );
    } catch (error) {
      console.error(
        "Failed to restart PC:",
        error
      );

      alert("Failed to restart PC.");
    } finally {
      setRestartOpen(false);
      setRestartTarget(null);
    }
  };

  const handleShutdown = (pc: PC) => {
    setShutdownTarget(pc);
    setShutdownOpen(true);
  };

  const confirmShutdown = async () => {
    if (!shutdownTarget) {
      return;
    }

    try {
      await shutdownPc(
        shutdownTarget.id
      );

      console.log(
        "Shutdown request sent successfully."
      );
    } catch (error) {
      console.error(
        "Failed to shut down PC:",
        error
      );

      alert("Failed to shut down PC.");
    } finally {
      setShutdownOpen(false);
      setShutdownTarget(null);
    }
  };

  const handleWake = (pc: PC) => {
    setWakeTarget(pc);
    setWakeOpen(true);
  };

  const confirmWake = async () => {
    if (!wakeTarget) {
      return;
    }

    try {
      await wakePc(
        wakeTarget.id
      );

      console.log(
        "Wake request sent successfully."
      );
    } catch (error) {
      console.error(
        "Failed to wake PC:",
        error
      );

      alert("Failed to wake PC.");
    } finally {
      setWakeOpen(false);
      setWakeTarget(null);
    }
  };

  return (
    <AppShell>
      <div className="relative isolate">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div
            className="absolute -top-28 -left-20 h-96 w-96 rounded-full opacity-25 blur-3xl"
            style={{ background: "radial-gradient(circle, var(--primary) 0%, transparent 70%)" }}
          />
          <div
            className="absolute top-20 -right-24 h-[28rem] w-[28rem] rounded-full opacity-20 blur-3xl"
            style={{ background: "radial-gradient(circle, oklch(0.55 0.2 300) 0%, transparent 70%)" }}
          />
          <div
            className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full opacity-[0.12] blur-3xl"
            style={{ background: "radial-gradient(circle, var(--success) 0%, transparent 70%)" }}
          />
        </div>

        <div className="space-y-7">

          {/* Header */}

          <div className="flex items-center justify-between gap-4">

            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-xl grid place-items-center border border-primary/30 bg-primary/10 text-primary shrink-0">
                <Gamepad2 className="h-5 w-5" />
              </div>

              <div>
                <h1 className="text-3xl font-display font-bold tracking-tight leading-none">
                  Gaming PCs
                </h1>

                <p className="text-muted-foreground mt-1.5 text-sm">
                  Control every station in real time
                  {hasAnyPcs && (
                    <>
                      {" "}· <span className="tabular-nums font-medium text-foreground">{statusCounts.all}</span> station{statusCounts.all === 1 ? "" : "s"}
                    </>
                  )}
                </p>
              </div>
            </div>

          </div>

          {/* Filters + Actions */}

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

            <div className="flex items-center gap-1 rounded-lg border border-border glass-surface p-1 flex-wrap">

              {FILTERS.map((filterOption) => (
                <button
                  key={filterOption.key}
                  onClick={() =>
                    setFilter(filterOption.key)
                  }
                  className={cn(
                    "px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 flex items-center gap-1.5",
                    filter === filterOption.key
                      ? "bg-primary text-primary-foreground shadow-[0_0_12px_-2px_var(--primary)]"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {filterOption.label}
                  <span
                    className={cn(
                      "text-[10px] tabular-nums px-1.5 py-0.5 rounded",
                      filter === filterOption.key
                        ? "bg-primary-foreground/20"
                        : "bg-border/60"
                    )}
                  >
                    {statusCounts[filterOption.key]}
                  </span>
                </button>
              ))}

            </div>

            <div className="flex items-center gap-2">

              <Button
                variant="outline"
                size="sm"
                onClick={handleRefreshClick}
                disabled={refreshing || loading}
              >
                <RefreshCw className={cn("h-4 w-4", (refreshing || loading) && "animate-spin")} />
                Refresh
              </Button>

            </div>

          </div>

          {/* Gaming PCs */}

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="glass-surface rounded-xl border border-border p-5 flex flex-col gap-4 h-[220px] animate-pulse"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-xl bg-border/60" />
                      <div className="space-y-2">
                        <div className="h-4 w-16 rounded bg-border/60" />
                        <div className="h-2.5 w-20 rounded bg-border/40" />
                      </div>
                    </div>
                    <div className="h-5 w-16 rounded bg-border/50" />
                  </div>
                  <div className="h-px w-full bg-border/40" />
                  <div className="h-9 w-full rounded-lg bg-border/40" />
                  <div className="grid grid-cols-2 gap-2 mt-auto">
                    <div className="h-8 rounded-md bg-border/40" />
                    <div className="h-8 rounded-md bg-border/40" />
                  </div>
                </div>
              ))}
            </div>
          ) : !hasAnyPcs ? (
            <div className="glass-surface border border-border rounded-xl px-6 py-16 flex flex-col items-center text-center gap-3">
              <div className="h-14 w-14 rounded-xl grid place-items-center border border-border bg-background/40 text-muted-foreground">
                <MonitorOff className="h-6 w-6" />
              </div>
              <h2 className="font-display font-bold text-lg">No PCs configured yet</h2>
              <p className="text-sm text-muted-foreground max-w-sm">
                Once gaming stations are added to your cafe, they'll appear here for you to monitor and control.
              </p>
            </div>
          ) : !hasFilteredResults ? (
            <div className="glass-surface border border-border rounded-xl px-6 py-16 flex flex-col items-center text-center gap-3">
              <div className="h-14 w-14 rounded-xl grid place-items-center border border-border bg-background/40 text-muted-foreground">
                <SearchX className="h-6 w-6" />
              </div>
              <h2 className="font-display font-bold text-lg">No PCs match this filter</h2>
              <p className="text-sm text-muted-foreground max-w-sm">
                No stations are currently in the "{FILTERS.find((f) => f.key === filter)?.label}" state.
              </p>
              <Button variant="outline" size="sm" onClick={() => setFilter("all")}>
                Show all stations
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">

              {pcs.map((pc) => (
                <PCCard
                  key={pc.id}
                  pc={pc}
                  onStart={openStartModal}
                  onExtend={openExtendModal}
                  onEnd={handleEndSession}
                  onRestart={handleRestart}
                  onShutdown={handleShutdown}
                  onWake={handleWake}
                />
              ))}

            </div>
          )}

        </div>
      </div>

      {/* Start Session */}

      <StartSessionModal
        pc={modalPC}
        open={open}
        onOpenChange={setOpen}
        onStart={handleStartSession}
      />

      {/* Extend Session */}

      <ExtendSessionModal
        pc={extendPC}
        open={extendOpen}
        onOpenChange={setExtendOpen}
        onExtend={handleExtendSession}
      />

      {/* End Session */}

      <ConfirmDialog
        open={confirmOpen}
        title="End Session"
        description={
          selectedPc
            ? `Are you sure you want to end the session for ${selectedPc.name}?`
            : ""
        }
        confirmText="End Session"
        cancelText="Cancel"
        onConfirm={confirmEndSession}
        onCancel={() => {
          setConfirmOpen(false);
          setSelectedPc(null);
        }}
      />

      {/* Restart PC */}

      <ConfirmDialog
        open={restartOpen}
        title="Restart PC"
        description={
          restartTarget
            ? `Are you sure you want to restart ${restartTarget.name}? This will immediately restart the computer.`
            : ""
        }
        confirmText="Restart"
        cancelText="Cancel"
        onConfirm={confirmRestart}
        onCancel={() => {
          setRestartOpen(false);
          setRestartTarget(null);
        }}
      />

      {/* Shutdown PC */}

      <ConfirmDialog
        open={shutdownOpen}
        title="Shutdown PC"
        description={
          shutdownTarget
            ? `Are you sure you want to shut down ${shutdownTarget.name}? This will immediately power off the computer.`
            : ""
        }
        confirmText="Shutdown"
        cancelText="Cancel"
        onConfirm={confirmShutdown}
        onCancel={() => {
          setShutdownOpen(false);
          setShutdownTarget(null);
        }}
      />

      {/* Wake PC */}

      <ConfirmDialog
        open={wakeOpen}
        title="Wake PC"
        description={
          wakeTarget
            ? `Are you sure you want to wake ${wakeTarget.name}?`
            : ""
        }
        confirmText="Wake"
        cancelText="Cancel"
        onConfirm={confirmWake}
        onCancel={() => {
          setWakeOpen(false);
          setWakeTarget(null);
        }}
      />

    </AppShell>
  );
}
