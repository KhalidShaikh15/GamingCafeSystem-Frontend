import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

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
      <div className="space-y-6">

        {/* Header */}

        <div className="flex items-center justify-between gap-4">

          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Gaming PCs
            </h1>

            <p className="text-muted-foreground mt-1">
              Control every station in real time
            </p>
          </div>

        </div>

        {/* Filters + Actions */}

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

          <div className="flex items-center gap-1 rounded-lg border bg-card p-1">

            {FILTERS.map((filterOption) => (
              <button
                key={filterOption.key}
                onClick={() =>
                  setFilter(filterOption.key)
                }
                className={cn(
                  "px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                  filter === filterOption.key
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {filterOption.label}
              </button>
            ))}

          </div>

          <div className="flex items-center gap-2">

            <Button
              variant="outline"
              size="sm"
              onClick={refresh}
            >
              Refresh
            </Button>

            <Button size="sm">
              Broadcast Message
            </Button>

          </div>

        </div>

        {/* Gaming PCs */}

        {loading ? (
          <div className="text-center py-10 text-muted-foreground">
            Loading PCs...
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