import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { ActivityTimeline, type ActivityItem } from "@/components/cafe/ActivityTimeline";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/logs")({
  head: () => ({
    meta: [
      { title: "Logs — CafeOps" },
      { name: "description", content: "System activity and troubleshooting log." },
    ],
  }),
  component: LogsPage,
});

const logs: ActivityItem[] = [
  { time: "11:20", message: "PC-01 Connected",           tone: "success" },
  { time: "11:25", message: "PC-01 Session Started (60m)", tone: "primary" },
  { time: "11:40", message: "PC-01 Session Ended",       tone: "warning" },
  { time: "11:41", message: "LOCK command sent to PC-01", tone: "primary" },
  { time: "11:58", message: "PC-05 Offline (heartbeat lost)", tone: "danger" },
  { time: "12:05", message: "Restart command sent to PC-04", tone: "warning" },
  { time: "12:08", message: "PC-04 Reconnected",         tone: "success" },
  { time: "12:14", message: "PC-08 Session Extended (30m)", tone: "primary" },
];

function LogsPage() {
  return (
    <AppShell>
      <div className="max-w-4xl mx-auto card-surface p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display text-lg font-bold">System Activity</h2>
            <p className="text-xs text-muted-foreground">Use this log to troubleshoot agents and stations</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Clear</Button>
            <Button size="sm">Export</Button>
          </div>
        </div>
        <ActivityTimeline items={logs} />
      </div>
    </AppShell>
  );
}
