import { createFileRoute } from "@tanstack/react-router";
import { Monitor, PlayCircle, Lock, PowerOff } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { TopStatCard } from "@/components/cafe/TopStatCard";
import { ActivityTimeline, type ActivityItem } from "@/components/cafe/ActivityTimeline";
import { MOCK_PCS } from "@/lib/mock-pcs";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — CafeOps" },
      { name: "description", content: "Live overview of connected PCs, active sessions and recent activity." },
    ],
  }),
  component: DashboardPage,
});

const activity: ActivityItem[] = [
  { time: "10:30", message: "PC-03 Connected",        tone: "success" },
  { time: "10:34", message: "PC-02 Session Started",  tone: "primary" },
  { time: "10:52", message: "PC-01 Session Ended",    tone: "warning" },
  { time: "11:15", message: "PC-07 Locked",           tone: "primary" },
  { time: "11:22", message: "PC-05 Offline",          tone: "danger" },
  { time: "11:40", message: "PC-08 Session Extended", tone: "primary" },
];

function DashboardPage() {
  const connected = MOCK_PCS.filter((p) => p.status !== "offline").length;
  const active = MOCK_PCS.filter((p) => p.status === "active").length;
  const locked = MOCK_PCS.filter((p) => p.status === "locked").length;
  const offline = MOCK_PCS.filter((p) => p.status === "offline").length;

  return (
    <AppShell>
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <TopStatCard label="Connected PCs" value={connected} icon={Monitor}    tone="primary" hint={`${MOCK_PCS.length} stations total`} />
          <TopStatCard label="Active Sessions" value={active}  icon={PlayCircle} tone="success" hint="Live now" />
          <TopStatCard label="Locked PCs"    value={locked}    icon={Lock}       tone="warning" hint="Awaiting start" />
          <TopStatCard label="Offline PCs"   value={offline}   icon={PowerOff}   tone="danger"  hint="Need attention" />
        </div>

        <div className="card-surface p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display text-lg font-bold">Recent Activity</h2>
              <p className="text-xs text-muted-foreground">Latest events across all stations</p>
            </div>
            <span className="text-xs text-muted-foreground font-mono">Live feed</span>
          </div>
          <ActivityTimeline items={activity} />
        </div>
      </div>
    </AppShell>
  );
}
