import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Receipt, ChevronDown, ChevronUp, UtensilsCrossed, Monitor } from "lucide-react";

import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

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

  // UI-only: which session rows are expanded to show food detail / add-food.
  // Does not affect data fetching or any calculation below.
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());

  function toggleExpanded(sessionId: number) {
    setExpandedIds((current) => {
      const next = new Set(current);
      if (next.has(sessionId)) {
        next.delete(sessionId);
      } else {
        next.add(sessionId);
      }
      return next;
    });
  }

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
      <div className="relative isolate">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div
            className="absolute -top-24 -left-16 h-80 w-80 rounded-full opacity-[0.15] blur-3xl"
            style={{ background: "radial-gradient(circle, var(--primary) 0%, transparent 70%)" }}
          />
        </div>

        <div className="max-w-7xl mx-auto space-y-6">

          {/* Header */}

          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl grid place-items-center border border-primary/30 bg-primary/10 text-primary shrink-0">
              <Receipt className="h-5 w-5" />
            </div>

            <div>
              <h1 className="text-3xl font-display font-bold tracking-tight leading-none">
                Billing
              </h1>

              <p className="text-muted-foreground mt-1.5 text-sm">
                Review pending payments, add food items, and collect customer payments.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="glass-surface border border-border rounded-xl h-16 animate-pulse"
                />
              ))}
            </div>
          ) : payments.length === 0 ? (
            <div className="glass-surface border border-border rounded-xl px-6 py-16 flex flex-col items-center text-center gap-3">
              <div className="h-14 w-14 rounded-xl grid place-items-center border border-border bg-background/40 text-muted-foreground">
                <Receipt className="h-6 w-6" />
              </div>
              <h2 className="font-display font-bold text-lg">No Pending Payments</h2>
              <p className="text-sm text-muted-foreground max-w-sm">
                There are currently no gaming sessions waiting for payment.
              </p>
            </div>
          ) : (
            <div className="space-y-3">

              {payments.map((payment) => {

                const foodTotal = calculateFoodTotal(payment);
                const commission = calculateCommission(payment);
                const grandTotal = calculateGrandTotal(payment);
                const cafeFoodRevenue = foodTotal - commission;
                const isExpanded = expandedIds.has(payment.id);

                return (
                  <div
                    key={payment.id}
                    className="glass-surface border border-border rounded-xl overflow-hidden transition-colors"
                  >
                    {/* Row */}
                    <div className="flex flex-wrap items-center gap-4 px-5 py-4">

                      {/* Identity */}
                      <button
                        onClick={() => toggleExpanded(payment.id)}
                        className="flex items-center gap-3 min-w-[160px] text-left group"
                      >
                        <div className="h-10 w-10 rounded-lg grid place-items-center border border-border bg-background/50 text-muted-foreground shrink-0 group-hover:text-primary group-hover:border-primary/40 transition-colors">
                          <Monitor className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-display font-bold leading-none truncate">
                            {payment.pcId}
                          </div>
                          <div className="text-[11px] text-muted-foreground mt-1">
                            Session #{payment.id}
                          </div>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        ) : (
                          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        )}
                      </button>

                      {/* Compact figures */}
                      <div className="flex flex-1 flex-wrap items-center gap-x-6 gap-y-1">
                        <div className="min-w-[84px]">
                          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Gaming</div>
                          <div className="text-sm font-medium tabular-nums">₹{payment.gamingCharge.toFixed(2)}</div>
                        </div>
                        <div className="min-w-[84px]">
                          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Food</div>
                          <div className="text-sm font-medium tabular-nums">₹{foodTotal.toFixed(2)}</div>
                        </div>
                        <div className="min-w-[96px]">
                          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Commission</div>
                          <div className="text-sm font-medium tabular-nums">₹{commission.toFixed(2)}</div>
                        </div>
                        <div className="min-w-[104px]">
                          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Café Revenue</div>
                          <div className="text-sm font-medium tabular-nums">₹{cafeFoodRevenue.toFixed(2)}</div>
                        </div>
                      </div>

                      {/* Total + action */}
                      <div className="flex items-center gap-4 ml-auto">
                        <div className="text-right">
                          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Total</div>
                          <div className="text-lg font-display font-bold tabular-nums leading-none">
                            ₹{grandTotal.toFixed(2)}
                          </div>
                        </div>

                        <Button
                          size="sm"
                          className="shadow-[0_0_14px_-4px_var(--primary)]"
                          onClick={() => handleCollectPayment(payment.id)}
                          disabled={collectingId === payment.id}
                        >
                          {collectingId === payment.id ? "Collecting..." : "Collect Payment"}
                        </Button>
                      </div>

                    </div>

                    {/* Expandable detail */}
                    {isExpanded && (
                      <div className="border-t border-border px-5 py-4 space-y-4 bg-background/30">

                        {/* Food items */}
                        <div>
                          <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-1.5">
                            <UtensilsCrossed className="h-3.5 w-3.5" />
                            Food & Beverage
                          </h3>

                          {payment.foodSales.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No food added yet.</p>
                          ) : (
                            <div className="space-y-1.5">
                              {payment.foodSales.map((sale) => (
                                <div key={sale.id} className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">
                                    {sale.itemName} × {sale.quantity}
                                  </span>
                                  <span className="tabular-nums">₹{sale.grossAmount.toFixed(2)}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Add food — compact inline row */}
                        <div className="border border-border rounded-lg p-3 flex flex-wrap items-center gap-2">
                          <Input
                            placeholder="Food item name"
                            className="flex-1 min-w-[140px] h-9"
                            value={getFoodForm(payment.id).itemName}
                            onChange={(e) =>
                              updateFoodForm(payment.id, "itemName", e.target.value)
                            }
                          />
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="Price"
                            className="w-24 h-9"
                            value={getFoodForm(payment.id).unitPrice}
                            onChange={(e) =>
                              updateFoodForm(payment.id, "unitPrice", e.target.value)
                            }
                          />
                          <Input
                            type="number"
                            min="1"
                            step="1"
                            placeholder="Qty"
                            className="w-20 h-9"
                            value={getFoodForm(payment.id).quantity}
                            onChange={(e) =>
                              updateFoodForm(payment.id, "quantity", e.target.value)
                            }
                          />
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => addFood(payment.id)}
                            disabled={foodLoadingId === payment.id}
                          >
                            {foodLoadingId === payment.id ? "Adding..." : "+ Add"}
                          </Button>
                        </div>

                      </div>
                    )}

                  </div>
                );
              })}

            </div>
          )}

        </div>
      </div>
    </AppShell>
  );
}
