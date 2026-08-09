import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

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
  getPendingPayments,
  collectPayment,
  type PendingPayment,
} from "@/api/api";

const API_URL = "http://localhost:5000";

export const Route = createFileRoute("/billing")({
  component: BillingPage,
});

function BillingPage() {
  const [payments, setPayments] = useState<PendingPayment[]>([]);
  const [loading, setLoading] = useState(true);

  const [collectingId, setCollectingId] =
    useState<number | null>(null);

  const [foodLoadingId, setFoodLoadingId] =
    useState<number | null>(null);

  const [foodForms, setFoodForms] = useState<
    Record<
      number,
      {
        itemName: string;
        unitPrice: string;
        quantity: string;
      }
    >
  >({});

  useEffect(() => {
    loadPayments();
  }, []);

  async function loadPayments() {
    try {
      setLoading(true);

      const data = await getPendingPayments();

      setPayments(data);
    } catch (error) {
      console.error(error);

      alert("Failed to load pending payments.");
    } finally {
      setLoading(false);
    }
  }

  function getFoodForm(sessionId: number) {
    return (
      foodForms[sessionId] ?? {
        itemName: "",
        unitPrice: "",
        quantity: "1",
      }
    );
  }

  function updateFoodForm(
    sessionId: number,
    field: "itemName" | "unitPrice" | "quantity",
    value: string
  ) {
    setFoodForms((current) => ({
      ...current,
      [sessionId]: {
        ...getFoodForm(sessionId),
        [field]: value,
      },
    }));
  }

  async function addFood(sessionId: number) {
    const form = getFoodForm(sessionId);

    const itemName = form.itemName.trim();
    const unitPrice = Number(form.unitPrice);
    const quantity = Number(form.quantity);

    if (!itemName) {
      alert("Enter the food item name.");
      return;
    }

    if (!unitPrice || unitPrice <= 0) {
      alert("Enter a valid food price.");
      return;
    }

    if (!quantity || quantity <= 0) {
      alert("Enter a valid quantity.");
      return;
    }

    try {
      setFoodLoadingId(sessionId);

      const response = await fetch(
        `${API_URL}/food-sales`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sessionId,
            itemName,
            unitPrice,
            quantity,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();

        throw new Error(
          errorData.error ||
            "Failed to add food item."
        );
      }

      setFoodForms((current) => ({
        ...current,
        [sessionId]: {
          itemName: "",
          unitPrice: "",
          quantity: "1",
        },
      }));

      await loadPayments();

    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to add food item."
      );
    } finally {
      setFoodLoadingId(null);
    }
  }

  async function handleCollectPayment(
    sessionId: number
  ) {
    try {
      setCollectingId(sessionId);

      await collectPayment(sessionId);

      await loadPayments();

      alert("Payment collected successfully!");

    } catch (error) {
      console.error(error);

      alert("Failed to collect payment.");

    } finally {
      setCollectingId(null);
    }
  }

  function calculateFoodTotal(
    payment: PendingPayment
  ) {
    return payment.foodSales.reduce(
      (total, sale) =>
        total + sale.grossAmount,
      0
    );
  }

  function calculateCommission(
    payment: PendingPayment
  ) {
    return payment.foodSales.reduce(
      (total, sale) =>
        total + sale.commissionAmount,
      0
    );
  }

  function calculateGrandTotal(
    payment: PendingPayment
  ) {
    return (
      payment.gamingCharge +
      calculateFoodTotal(payment)
    );
  }

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto space-y-8">

        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Billing
          </h1>

          <p className="text-muted-foreground mt-2">
            Review pending payments, add food items,
            and collect customer payments.
          </p>
        </div>

        {loading ? (
          <Card>
            <CardContent className="p-6">
              Loading pending payments...
            </CardContent>
          </Card>
        ) : payments.length === 0 ? (
          <Card>
            <CardContent className="p-10 text-center">

              <h2 className="text-lg font-semibold">
                No Pending Payments
              </h2>

              <p className="text-sm text-muted-foreground mt-2">
                There are currently no gaming sessions
                waiting for payment.
              </p>

            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">

            {payments.map((payment) => {

              const foodTotal =
                calculateFoodTotal(payment);

              const commission =
                calculateCommission(payment);

              const grandTotal =
                calculateGrandTotal(payment);

              return (
                <Card key={payment.id}>

                  <CardHeader>
                    <CardTitle>
                      {payment.pcId}
                    </CardTitle>

                    <p className="text-sm text-muted-foreground">
                      Session #{payment.id}
                    </p>
                  </CardHeader>

                  <CardContent className="space-y-6">

                    {/* Gaming */}

                    <div>

                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Gaming
                        </span>

                        <span className="font-medium">
                          ₹
                          {payment.gamingCharge.toFixed(
                            2
                          )}
                        </span>
                      </div>

                    </div>

                    {/* Food */}

                    <div className="border-t pt-5">

                      <h3 className="font-semibold mb-3">
                        Food & Beverage
                      </h3>

                      {payment.foodSales.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                          No food added yet.
                        </p>
                      ) : (
                        <div className="space-y-2">

                          {payment.foodSales.map(
                            (sale) => (
                              <div
                                key={sale.id}
                                className="flex justify-between text-sm"
                              >

                                <span>
                                  {sale.itemName} ×{" "}
                                  {sale.quantity}
                                </span>

                                <span>
                                  ₹
                                  {sale.grossAmount.toFixed(
                                    2
                                  )}
                                </span>

                              </div>
                            )
                          )}

                        </div>
                      )}

                    </div>

                    {/* Add Food */}

                    <div className="border rounded-lg p-4 space-y-3">

                      <h4 className="text-sm font-semibold">
                        Add Food
                      </h4>

                      <Input
                        placeholder="Food item name"
                        value={
                          getFoodForm(payment.id)
                            .itemName
                        }
                        onChange={(e) =>
                          updateFoodForm(
                            payment.id,
                            "itemName",
                            e.target.value
                          )
                        }
                      />

                      <div className="grid grid-cols-2 gap-3">

                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="Price"
                          value={
                            getFoodForm(payment.id)
                              .unitPrice
                          }
                          onChange={(e) =>
                            updateFoodForm(
                              payment.id,
                              "unitPrice",
                              e.target.value
                            )
                          }
                        />

                        <Input
                          type="number"
                          min="1"
                          step="1"
                          placeholder="Quantity"
                          value={
                            getFoodForm(payment.id)
                              .quantity
                          }
                          onChange={(e) =>
                            updateFoodForm(
                              payment.id,
                              "quantity",
                              e.target.value
                            )
                          }
                        />

                      </div>

                      <Button
                        className="w-full"
                        onClick={() =>
                          addFood(payment.id)
                        }
                        disabled={
                          foodLoadingId ===
                          payment.id
                        }
                      >
                        {foodLoadingId ===
                        payment.id
                          ? "Adding..."
                          : "+ Add Food"}
                      </Button>

                    </div>

                    {/* Summary */}

                    <div className="border-t pt-5 space-y-3">

  <div className="flex justify-between">
    <span className="text-muted-foreground">
      Gaming
    </span>

    <span>
      ₹{payment.gamingCharge.toFixed(2)}
    </span>
  </div>

  <div className="flex justify-between">
    <span className="text-muted-foreground">
      Food Sales
    </span>

    <span>
      ₹{foodTotal.toFixed(2)}
    </span>
  </div>

  <div className="flex justify-between">
    <span className="text-muted-foreground">
      Partner Commission
    </span>

    <span>
      ₹{commission.toFixed(2)}
    </span>
  </div>

  <div className="flex justify-between">
    <span className="text-muted-foreground">
      Café Food Revenue
    </span>

    <span>
      ₹{(foodTotal - commission).toFixed(2)}
    </span>
  </div>

  <div className="border-t pt-3 flex justify-between text-lg font-bold">
    <span>
      Customer Total
    </span>

    <span>
      ₹{grandTotal.toFixed(2)}
    </span>
  </div>

</div>

                    {/* Collect */}

                    <Button
                      className="w-full"
                      onClick={() =>
                        handleCollectPayment(
                          payment.id
                        )
                      }
                      disabled={
                        collectingId ===
                        payment.id
                      }
                    >
                      {collectingId === payment.id
                        ? "Collecting..."
                        : "Collect Payment"}
                    </Button>

                  </CardContent>

                </Card>
              );
            })}

          </div>
        )}

      </div>
    </AppShell>
  );
}