import { useCallback, useEffect, useState } from "react";
import {
  getPendingPayments,
  type PendingPayment,
} from "@/api/api";
import {
  connectDashboardSocket,
  disconnectDashboardSocket,
} from "@/services/websocket";

export function usePendingPayments() {

  const [payments, setPayments] = useState<PendingPayment[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPayments = useCallback(async () => {

    try {

      const data = await getPendingPayments();
      console.log("Pending payments:", data);

      setPayments(data);

    } catch (error) {

      console.error("Failed to load pending payments", error);

    } finally {

      setLoading(false);

    }

  }, []);

  useEffect(() => {

    loadPayments();

    connectDashboardSocket(loadPayments);

    return () => {

      disconnectDashboardSocket(loadPayments);

    };

  }, [loadPayments]);

  return {
    payments,
    loading,
    refresh: loadPayments,
  };

}