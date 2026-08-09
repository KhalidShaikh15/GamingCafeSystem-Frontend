import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";

export const Route = createFileRoute("/management/_layout")({
  component: ManagementLayout,
});

function ManagementLayout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}