import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";

import { AppShell } from "@/components/layout/AppShell";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  getFoodSettings,
  updateFoodSettings,
  type FoodSettings,
} from "@/api/api";

export const Route = createFileRoute("/management/food")({
  component: FoodSettingsPage,
});

function FoodSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [settings, setSettings] = useState<FoodSettings>({
    id: 1,
    businessModel: "IN_HOUSE",
    commissionType: "PERCENTAGE",
    commissionValue: 0,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      const data = await getFoodSettings();

      setSettings(data);
    } catch (error) {
      console.error(error);

      alert("Failed to load food settings.");
    } finally {
      setLoading(false);
    }
  }

  async function saveSettings() {
    try {
      setSaving(true);

      await updateFoodSettings({
        businessModel: settings.businessModel,
        commissionType: settings.commissionType,
        commissionValue:
          settings.businessModel === "IN_HOUSE"
            ? 0
            : settings.commissionValue,
      });

      alert("Food settings saved successfully!");
    } catch (error) {
      console.error(error);

      alert("Failed to save food settings.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <AppShell>
        <div className="max-w-7xl mx-auto">
          Loading...
        </div>
      </AppShell>
    );
  }

  const isPartner =
    settings.businessModel === "PARTNER";

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Back to Management */}

        <div>
          <Link
            to="/management"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Management
          </Link>

          <h1 className="text-3xl font-bold">
            Food & Beverage
          </h1>

          <p className="text-muted-foreground mt-2">
            Configure how food sales and partner commissions work.
          </p>
        </div>

        {/* Food Settings */}

        <Card>
          <CardHeader>
            <CardTitle>
              Food Business Model
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">

            {/* Food Operation */}

            <div>
              <label className="block text-sm font-medium mb-2">
                Food Operation
              </label>

              <select
                className="w-full h-10 rounded-md border bg-background px-3"
                value={settings.businessModel}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    businessModel:
                      e.target.value as
                        | "IN_HOUSE"
                        | "PARTNER",
                  })
                }
              >
                <option value="IN_HOUSE">
                  In-house Café
                </option>

                <option value="PARTNER">
                  Partner Café / Food Vendor
                </option>
              </select>

              <p className="text-xs text-muted-foreground mt-2">
                Choose whether the food operation belongs to your
                café or an external food partner.
              </p>
            </div>

            {/* Partner Settings */}

            {isPartner && (
              <>
                {/* Commission Type */}

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Commission Type
                  </label>

                  <select
                    className="w-full h-10 rounded-md border bg-background px-3"
                    value={settings.commissionType}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        commissionType:
                          e.target.value as
                            | "PERCENTAGE"
                            | "FIXED",
                      })
                    }
                  >
                    <option value="PERCENTAGE">
                      Percentage
                    </option>

                    <option value="FIXED">
                      Fixed Amount
                    </option>
                  </select>
                </div>

                {/* Commission */}

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Commission
                  </label>

                  <div className="relative">
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={settings.commissionValue}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          commissionValue:
                            Number(e.target.value),
                        })
                      }
                    />
                  </div>

                  <p className="text-xs text-muted-foreground mt-2">
                    {settings.commissionType ===
                    "PERCENTAGE"
                      ? "Example: enter 20 for a 20% commission."
                      : "Enter the fixed commission amount per food sale."}
                  </p>
                </div>
              </>
            )}

            {/* In-house Message */}

            {!isPartner && (
              <div className="rounded-md border border-primary/20 bg-primary/5 p-4">
                <p className="text-sm font-medium">
                  In-house food operation
                </p>

                <p className="text-xs text-muted-foreground mt-1">
                  No external commission will be deducted from
                  food revenue.
                </p>
              </div>
            )}

            {/* Save */}

            <Button
              className="w-full"
              onClick={saveSettings}
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : "Save Food Settings"}
            </Button>

          </CardContent>
        </Card>

      </div>
    </AppShell>
  );
}