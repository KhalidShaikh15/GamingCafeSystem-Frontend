import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";

export const Route = createFileRoute("/reports")({
  component: ReportsPage,
});

function ReportsPage() {
  return (
    <AppShell>
      <div className="space-y-4 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold">Reports</h1>

        <p className="text-muted-foreground">
          Revenue reports will appear here.
        </p>
      </div>
    </AppShell>
  );
}