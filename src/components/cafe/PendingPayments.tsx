import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { collectPayment } from "@/api/api";
import type { PendingPayment } from "@/api/api";

interface PendingPaymentsProps {
  payments: PendingPayment[];
}

export function PendingPayments({
  payments,
}: PendingPaymentsProps) {

  if (payments.length === 0) {
    return null;
  }

  const handleCollectPayment = async (sessionId: number) => {

    try {

      await collectPayment(sessionId);

      console.log("Payment collected.");

    } catch (error) {

      console.error("Failed to collect payment", error);

      alert("Failed to collect payment.");

    }

  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Payments</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">

        {payments.map((payment) => (

          <div
            key={payment.id}
            className="border rounded-lg p-4 flex items-center justify-between"
          >
            <div>
              <h3 className="font-semibold text-lg">
                {payment.pcId}
              </h3>

              <p className="text-sm text-muted-foreground">
                Duration: {payment.actualMinutes} min
              </p>

              <p className="text-sm text-muted-foreground">
                Gaming Charge: ₹{payment.gamingCharge}
              </p>

              <p className="font-semibold mt-2">
                Total: ₹{payment.gamingCharge}
              </p>
            </div>

            <Button
              onClick={() => handleCollectPayment(payment.id)}
            >
              Collect Payment
            </Button>

          </div>

        ))}

      </CardContent>
    </Card>
  );

}