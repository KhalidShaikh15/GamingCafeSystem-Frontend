import { useCallback, useEffect, useState } from "react";
import { BackendPC, getPcs } from "@/api/backend";
import { connectDashboardSocket } from "@/services/websocket";

export function useGamingPcs() {
  const [pcs, setPcs] = useState<BackendPC[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPcs = useCallback(async () => {
    try {
      const data = await getPcs();
      setPcs(data);
    } catch (error) {
      console.error("Failed to load PCs", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPcs();

    connectDashboardSocket(() => {
      loadPcs();
    });
  }, [loadPcs]);

  return {
    pcs,
    loading,
    refresh: loadPcs,
  };
}