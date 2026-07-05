import type { PC } from "@/components/cafe/PCCard";

// UI-only placeholder data. Replace with backend feed.
export const MOCK_PCS: PC[] = [
  { id: "01", name: "PC-01", status: "active",   remainingMinutes: 47 },
  { id: "02", name: "PC-02", status: "active",   remainingMinutes: 112 },
  { id: "03", name: "PC-03", status: "locked",   remainingMinutes: null },
  { id: "04", name: "PC-04", status: "starting", remainingMinutes: null },
  { id: "05", name: "PC-05", status: "offline",  remainingMinutes: null },
  { id: "06", name: "PC-06", status: "active",   remainingMinutes: 8 },
  { id: "07", name: "PC-07", status: "locked",   remainingMinutes: null },
  { id: "08", name: "PC-08", status: "active",   remainingMinutes: 63 },
  { id: "09", name: "PC-09", status: "offline",  remainingMinutes: null },
  { id: "10", name: "PC-10", status: "locked",   remainingMinutes: null },
  { id: "11", name: "PC-11", status: "active",   remainingMinutes: 22 },
  { id: "12", name: "PC-12", status: "locked",   remainingMinutes: null },
];
