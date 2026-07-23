import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type { PC } from "@/components/cafe/PCCard";

interface ExtendSessionModalProps {
  pc: PC | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExtend: (pc: PC, minutes: number) => void;
}

const QUICK_EXTENSIONS = [15, 30, 60, 120];

export function ExtendSessionModal({
  pc,
  open,
  onOpenChange,
  onExtend,
}: ExtendSessionModalProps) {
  const [minutes, setMinutes] = useState(30);

  useEffect(() => {
    if (open) {
      setMinutes(30);
    }
  }, [open]);

  const handleExtend = () => {
    if (!pc) return;

    if (minutes <= 0) {
      alert("Please enter a valid duration.");
      return;
    }

    onExtend(pc, minutes);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Extend Session</DialogTitle>
          <DialogDescription>
            {pc
              ? `Add more time to ${pc.id}.`
              : "Add more time to the current session."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <Label className="mb-2 block">Quick Add</Label>

            <div className="grid grid-cols-2 gap-2">
              {QUICK_EXTENSIONS.map((value) => (
                <Button
                  key={value}
                  type="button"
                  variant="outline"
                  onClick={() => setMinutes(value)}
                >
                  {value >= 60
                    ? `+${value / 60} Hour${value === 60 ? "" : "s"}`
                    : `+${value} Minutes`}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="minutes">Additional Minutes</Label>

            <Input
              id="minutes"
              type="number"
              min={1}
              value={minutes}
              onChange={(e) =>
                setMinutes(Number(e.target.value))
              }
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>

          <Button onClick={handleExtend}>
            Extend Session
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}