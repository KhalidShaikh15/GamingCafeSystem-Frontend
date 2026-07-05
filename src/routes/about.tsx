import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Gamepad2, Server, Users, Code, Shield } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — CafeOps" },
      { name: "description", content: "Software information, version and license." },
    ],
  }),
  component: AboutPage,
});

const info = [
  { icon: Gamepad2, label: "Application", value: "CafeOps — Gaming Cafe Manager" },
  { icon: Code,     label: "Version",     value: "1.0.0" },
  { icon: Server,   label: "Backend",     value: "Connected", accent: "text-success" },
  { icon: Users,    label: "Connected Agents", value: "12 / 12" },
  { icon: Code,     label: "Developer",   value: "CafeOps Studio" },
  { icon: Shield,   label: "License",     value: "Commercial — Single Venue" },
];

function AboutPage() {
  return (
    <AppShell>
      <div className="max-w-2xl mx-auto card-surface p-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-14 w-14 rounded-xl grid place-items-center bg-primary/15 text-primary border border-primary/30 glow-primary">
            <Gamepad2 className="h-7 w-7" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold">CafeOps</h2>
            <p className="text-sm text-muted-foreground">Premium control panel for gaming cafe owners</p>
          </div>
        </div>

        <dl className="divide-y divide-border">
          {info.map((row) => {
            const Icon = row.icon;
            return (
              <div key={row.label} className="py-3.5 flex items-center gap-4">
                <Icon className="h-4 w-4 text-muted-foreground" />
                <dt className="text-sm text-muted-foreground w-48">{row.label}</dt>
                <dd className={`text-sm font-medium ${row.accent ?? ""}`}>{row.value}</dd>
              </div>
            );
          })}
        </dl>

        <p className="mt-8 text-xs text-muted-foreground">
          © 2026 CafeOps. All rights reserved. Version 1 focuses on station control; billing and reports will arrive in a future release.
        </p>
      </div>
    </AppShell>
  );
}
