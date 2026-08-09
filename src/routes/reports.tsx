import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  getAllFoodSales,
  type FoodSale,
} from "@/api/api";

export const Route = createFileRoute("/reports")({
  component: ReportsPage,
});

function ReportsPage() {
  const [foodSales, setFoodSales] = useState<FoodSale[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFoodSales();
  }, []);

  async function loadFoodSales() {
    try {
      setLoading(true);

      const data = await getAllFoodSales();

      setFoodSales(data);
    } catch (error) {
      console.error(error);

      alert("Failed to load food sales.");
    } finally {
      setLoading(false);
    }
  }

  const totalFoodSales = useMemo(() => {
    return foodSales.reduce(
      (total, sale) =>
        total + sale.grossAmount,
      0
    );
  }, [foodSales]);

  const totalCommission = useMemo(() => {
    return foodSales.reduce(
      (total, sale) =>
        total + sale.commissionAmount,
      0
    );
  }, [foodSales]);

  const totalCafeRevenue = useMemo(() => {
    return foodSales.reduce(
      (total, sale) =>
        total + sale.netAmount,
      0
    );
  }, [foodSales]);

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}

        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Reports
          </h1>

          <p className="text-muted-foreground mt-2">
            Review food sales, partner commissions,
            and café revenue.
          </p>
        </div>

        {loading ? (
          <Card>
            <CardContent className="p-6">
              Loading reports...
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Summary */}

            <div className="grid gap-6 md:grid-cols-4">

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">
                    Food Sales
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <p className="text-2xl font-bold">
                    ₹{totalFoodSales.toFixed(2)}
                  </p>

                  <p className="text-xs text-muted-foreground mt-1">
                    Gross food sales
                  </p>
                </CardContent>
              </Card>


              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">
                    Partner Commission
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <p className="text-2xl font-bold">
                    ₹{totalCommission.toFixed(2)}
                  </p>

                  <p className="text-xs text-muted-foreground mt-1">
                    Commission owed to partners
                  </p>
                </CardContent>
              </Card>


              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">
                    Café Revenue
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <p className="text-2xl font-bold">
                    ₹{totalCafeRevenue.toFixed(2)}
                  </p>

                  <p className="text-xs text-muted-foreground mt-1">
                    Net food revenue
                  </p>
                </CardContent>
              </Card>


              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">
                    Transactions
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <p className="text-2xl font-bold">
                    {foodSales.length}
                  </p>

                  <p className="text-xs text-muted-foreground mt-1">
                    Food transactions
                  </p>
                </CardContent>
              </Card>

            </div>


            {/* Food Sales History */}

            <Card>

              <CardHeader>
                <CardTitle>
                  Food Sales History
                </CardTitle>
              </CardHeader>

              <CardContent>

                {foodSales.length === 0 ? (
                  <div className="py-10 text-center">

                    <p className="font-medium">
                      No food sales yet
                    </p>

                    <p className="text-sm text-muted-foreground mt-1">
                      Food transactions will appear here
                      once they are added to a session.
                    </p>

                  </div>
                ) : (
                  <div className="overflow-x-auto">

                    <table className="w-full text-sm">

                      <thead>
                        <tr className="border-b">

                          <th className="text-left py-3 pr-4">
                            Date
                          </th>

                          <th className="text-left py-3 pr-4">
                            Session
                          </th>

                          <th className="text-left py-3 pr-4">
                            Item
                          </th>

                          <th className="text-right py-3 pr-4">
                            Qty
                          </th>

                          <th className="text-right py-3 pr-4">
                            Gross
                          </th>

                          <th className="text-right py-3 pr-4">
                            Commission
                          </th>

                          <th className="text-right py-3">
                            Café Revenue
                          </th>

                        </tr>
                      </thead>

                      <tbody>

                        {foodSales.map((sale) => (

                          <tr
                            key={sale.id}
                            className="border-b last:border-0"
                          >

                            <td className="py-3 pr-4 whitespace-nowrap">
                              {new Date(
                                sale.createdAt
                              ).toLocaleString()}
                            </td>

                            <td className="py-3 pr-4">
                              #{sale.sessionId}
                            </td>

                            <td className="py-3 pr-4 font-medium">
                              {sale.itemName}
                            </td>

                            <td className="py-3 pr-4 text-right">
                              {sale.quantity}
                            </td>

                            <td className="py-3 pr-4 text-right">
                              ₹
                              {sale.grossAmount.toFixed(
                                2
                              )}
                            </td>

                            <td className="py-3 pr-4 text-right">
                              ₹
                              {sale.commissionAmount.toFixed(
                                2
                              )}
                            </td>

                            <td className="py-3 text-right font-medium">
                              ₹
                              {sale.netAmount.toFixed(
                                2
                              )}
                            </td>

                          </tr>

                        ))}

                      </tbody>

                    </table>

                  </div>
                )}

              </CardContent>

            </Card>

          </>
        )}

      </div>
    </AppShell>
  );
}