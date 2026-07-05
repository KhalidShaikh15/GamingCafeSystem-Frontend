import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, Monitor } from "lucide-react";
import type { PC } from "./PCCard";

interface Props {
  pc: PC | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStart?: (pc: PC, minutes: number) => void;
}

export function StartSessionModal({ pc, open, onOpenChange, onStart }: Props) {
  const [duration, setDuration] = useState("60");
  const [custom, setCustom] = useState("");

  const handleStart = () => {
    if (!pc) return;
    const minutes = duration === "custom" ? parseInt(custom || "0", 10) : parseInt(duration, 10);
    onStart?.(pc, minutes);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="h-11 w-11 rounded-lg grid place-items-center bg-primary/15 text-primary border border-primary/30 mb-2">
            <Monitor className="h-5 w-5" />
          </div>
          <DialogTitle className="font-display text-xl">Start Session</DialogTitle>
          <DialogDescription>
            Launch a new gaming session on{" "}
            <span className="font-semibold text-foreground">{pc?.name ?? "—"}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Gaming Station</Label>
            <div className="h-10 px-3 rounded-md bg-background/60 border border-border flex items-center text-sm font-medium">
              {pc?.name ?? "—"}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Session Duration</Label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 Minutes</SelectItem>
                <SelectItem value="60">60 Minutes</SelectItem>
                <SelectItem value="90">90 Minutes</SelectItem>
                <SelectItem value="120">120 Minutes</SelectItem>
                <SelectItem value="custom">Custom Duration</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {duration === "custom" && (
            <div className="space-y-2">
              <Label>Custom Minutes</Label>
              <Input
                type="number"
                min={1}
                placeholder="e.g. 45"
                value={custom}
                onChange={(e) => setCustom(e.target.value)}
              />
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleStart}>
            <Play className="h-4 w-4" /> Start
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
