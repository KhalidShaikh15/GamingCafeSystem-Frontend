import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  getSettings,
  updateSettings,
  type Settings,
} from "@/api/api";

export const Route = createFileRoute("/management/pricing")({
  component: PricingPage,
});

function PricingPage() {
  const [loading, setLoading] = useState(true);

  const [settings, setSettings] = useState<Settings>({
    id: 1,
    cafeName: "",
    billingType: "PER_MINUTE",
    gamingRate: 2,
    currency: "INR",
  });

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      const data = await getSettings();
      setSettings(data);
    } catch (error) {
      console.error(error);
      alert("Failed to load settings.");
    } finally {
      setLoading(false);
    }
  }

  async function saveSettings() {
    try {
      await updateSettings({
        cafeName: settings.cafeName,
        billingType: settings.billingType,
        gamingRate: settings.gamingRate,
        currency: settings.currency,
      });

      alert("Settings saved successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to save settings.");
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      <div>
        <h1 className="text-3xl font-bold">
          Gaming Pricing
        </h1>

        <p className="text-muted-foreground mt-2">
          Configure how gaming sessions are billed.
        </p>
      </div>

      <Card>

        <CardHeader>
          <CardTitle>
            General Settings
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">

          <div>
            <label className="block text-sm font-medium mb-2">
              Cafe Name
            </label>

            <Input
              value={settings.cafeName}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  cafeName: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Currency
            </label>

            <Input
              value={settings.currency}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  currency: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Billing Type
            </label>

            <select
              className="w-full rounded-md border bg-background h-10 px-3"
              value={settings.billingType}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  billingType: e.target.value as
                    | "PER_MINUTE"
                    | "PER_HOUR",
                })
              }
            >
              <option value="PER_MINUTE">
                Per Minute
              </option>

              <option value="PER_HOUR">
                Per Hour
              </option>

            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Gaming Rate
            </label>

            <Input
              type="number"
              value={settings.gamingRate}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  gamingRate: Number(e.target.value),
                })
              }
            />
          </div>

          <Button
            className="w-full"
            onClick={saveSettings}
          >
            Save Settings
          </Button>

        </CardContent>

      </Card>

    </div>
  );
}