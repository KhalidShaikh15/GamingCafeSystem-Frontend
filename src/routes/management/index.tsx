import { AppShell } from "@/components/layout/AppShell";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  DollarSign,
  UtensilsCrossed,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/management/")({
  component: ManagementPage,
});

function ManagementPage() {
  return (
    <AppShell>
      <div className="max-w-7xl mx-auto space-y-8">

        <div>
          <h1 className="text-3xl font-bold">
            Business Configuration
          </h1>

          <p className="text-muted-foreground mt-2">
            Configure how your gaming cafe operates.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">

          {/* Gaming Pricing */}

          <Card>
            <CardContent className="p-6 space-y-5">

              <div className="flex items-center gap-4">

                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>

                <div>
                  <h2 className="text-xl font-semibold">
                    Gaming Pricing
                  </h2>

                  <p className="text-muted-foreground">
                    Configure gaming billing rates.
                  </p>
                </div>

              </div>

              <Button asChild className="w-full">
                <Link to="/management/pricing">
                  Configure
                </Link>
              </Button>

            </CardContent>
          </Card>


          {/* Food & Beverage */}

          <Card>
            <CardContent className="p-6 space-y-5">

              <div className="flex items-center gap-4">

                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <UtensilsCrossed className="h-6 w-6 text-primary" />
                </div>

                <div>
                  <h2 className="text-xl font-semibold">
                    Food & Beverage
                  </h2>

                  <p className="text-muted-foreground">
                    Configure food operations and partner commissions.
                  </p>
                </div>

              </div>

              <Button asChild className="w-full">
                <Link to="/management/food">
                  Configure
                </Link>
              </Button>

            </CardContent>
          </Card>

        </div>

      </div>
    </AppShell>
  );
}