import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { StatusBadge } from "@/components/cafe/StatusBadge";
import { Button } from "@/components/ui/button";
import { MOCK_PCS } from "@/lib/mock-pcs";
import { Clock, Square, Info } from "lucide-react";

export const Route = createFileRoute("/sessions")({
  head: () => ({
    meta: [
      { title: "Sessions — CafeOps" },
      { name: "description", content: "Active and recent gaming sessions across all PCs." },
    ],
  }),
  component: SessionsPage,
});

function formatMins(m: number | null) {
  if (m == null) return "--";
  const h = Math.floor(m / 60);
  return h > 0 ? `${h}h ${(m % 60).toString().padStart(2, "0")}m` : `${m}m`;
}

function SessionsPage() {
  const sessions = MOCK_PCS.filter((p) => p.status === "active" || p.status === "locked").map((p, i) => ({
    ...p,
    startTime: p.status === "active" ? `${9 + (i % 6)}:${(i * 7 % 60).toString().padStart(2, "0")}` : "—",
  }));

  return (
    <AppShell>
      <div className="max-w-[1400px] mx-auto card-surface overflow-hidden">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-bold">All Sessions</h2>
            <p className="text-xs text-muted-foreground">{sessions.length} sessions</p>
          </div>
          <Button variant="outline" size="sm">Export</Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/60 border-b border-border">
              <tr className="text-left text-xs uppercase tracking-widest text-muted-foreground">
                <th className="px-5 py-3 font-medium">PC</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Start Time</th>
                <th className="px-5 py-3 font-medium">Remaining</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((s) => (
                <tr key={s.id} className="border-b border-border/60 hover:bg-accent/40 transition-colors">
                  <td className="px-5 py-3.5 font-semibold">{s.name}</td>
                  <td className="px-5 py-3.5"><StatusBadge status={s.status} /></td>
                  <td className="px-5 py-3.5 font-mono text-muted-foreground">{s.startTime}</td>
                  <td className="px-5 py-3.5 font-mono tabular-nums">{formatMins(s.remainingMinutes)}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="secondary" disabled={s.status !== "active"}>
                        <Clock className="h-3.5 w-3.5" /> Extend
                      </Button>
                      <Button size="sm" variant="destructive" disabled={s.status !== "active"}>
                        <Square className="h-3.5 w-3.5" /> End
                      </Button>
                      <Button size="sm" variant="outline">
                        <Info className="h-3.5 w-3.5" /> Details
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
