import { createFileRoute } from "@tanstack/react-router";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { useCallback, useEffect, useState } from "react";
import { startSession, endSession, extendSession, restartPc, shutdownPc,} from "@/api/backend";
import { AppShell } from "@/components/layout/AppShell";
import { PCCard, type PC } from "@/components/cafe/PCCard";
import { StartSessionModal } from "@/components/cafe/StartSessionModal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useGamingPcs } from "@/hooks/useGamingPcs";
import { ExtendSessionModal } from "@/components/modals/extend-session-modal";

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

function getRemainingMinutes(endTime: string | null): number | null {
  if (!endTime) return null;

  const diff = new Date(endTime).getTime() - Date.now();

  if (diff <= 0) return 0;

  return Math.ceil(diff / 60000);
}

function GamingPCsPage() {
  const [filter, setFilter] =
    useState<(typeof FILTERS)[number]["key"]>("all");

  const [modalPC, setModalPC] = useState<PC | null>(null);
  const [open, setOpen] = useState(false);

  const { pcs: backendPcs, loading, refresh } = useGamingPcs();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedPc, setSelectedPc] = useState<PC | null>(null);
  const [extendOpen, setExtendOpen] = useState(false);
  const [extendPC, setExtendPC] = useState<PC | null>(null);
  const [restartOpen, setRestartOpen] = useState(false);
  const [restartTarget, setRestartTarget] = useState<PC | null>(null);
  const [shutdownOpen, setShutdownOpen] = useState(false);
  const [shutdownTarget, setShutdownTarget] = useState<PC | null>(null);

  const openExtendModal = (pc: PC) => {
  setExtendPC(pc);
  setExtendOpen(true);
};

  const pcs: PC[] = backendPcs
    .filter((pc) => filter === "all" || pc.status === filter)
    .map((pc) => ({
      id: pc.pcId,
      name: pc.pcId,
      status: pc.status,
      endTime: pc.endTime ? new Date(pc.endTime) : null,// We'll replace this with endTime in the next step
    }));

  const openStartModal = (pc: PC) => {
    setModalPC(pc);
    setOpen(true);
  };

  const handleStartSession = async (pc: PC, minutes: number) => {
  try {
    await startSession(pc.id, minutes);

    setOpen(false);

    console.log("Session started successfully");
  } catch (error) {
    console.error("Failed to start session", error);

    alert("Failed to start session.");
  }
};

const handleRestart = (pc: PC) => {
  setRestartTarget(pc);
  setRestartOpen(true);
};


const confirmRestart = async () => {
  if (!restartTarget) return;

  try {
    await restartPc(restartTarget.id);

    console.log("Restart request sent successfully.");
  } catch (error) {
    console.error("Failed to restart PC:", error);

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
  if (!shutdownTarget) return;

  try {
    await shutdownPc(shutdownTarget.id);

    console.log("Shutdown request sent successfully.");
  } catch (error) {
    console.error("Failed to shut down PC:", error);

    alert("Failed to shut down PC.");
  } finally {
    setShutdownOpen(false);
    setShutdownTarget(null);
  }
};

const handleExtendSession = async (pc: PC, minutes: number) => {
  try {
    await extendSession(pc.id, minutes);

    console.log("Session extended successfully");
  } catch (error) {
    console.error("Failed to extend session", error);

    alert("Failed to extend session.");
  }
};


const confirmEndSession = async () => {
  if (!selectedPc) return;

  try {
    await endSession(selectedPc.id);

    console.log("Session ended successfully");
  } catch (error) {
    console.error("Failed to end session", error);

    alert("Failed to end session.");
  } finally {
    setConfirmOpen(false);
    setSelectedPc(null);
  }
};

const handleEndSession = (pc: PC) => {
  console.log("End button clicked", pc);

  setSelectedPc(pc);
  setConfirmOpen(true);

};
const noop = () => {};

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
                  filter === f.key
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {f.label}
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
                onWake={noop}
              />
            ))}
          </div>
        )}
      </div>
      <ExtendSessionModal
      pc={extendPC}
      open={extendOpen}
      onOpenChange={setExtendOpen}
      onExtend={handleExtendSession}
    />

      <StartSessionModal
        pc={modalPC}
        open={open}
        onOpenChange={setOpen}
        onStart={handleStartSession}
      />
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


    </AppShell>
  );
}