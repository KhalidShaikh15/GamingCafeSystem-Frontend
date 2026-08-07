import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";

export const Route = createFileRoute("/billing")({
  component: BillingPage,
});

function BillingPage() {
  return (
    <AppShell>
      <div className="space-y-4 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold">Billing</h1>

        <p className="text-muted-foreground">
          Billing features will appear here.
        </p>
      </div>
    </AppShell>
  );
}