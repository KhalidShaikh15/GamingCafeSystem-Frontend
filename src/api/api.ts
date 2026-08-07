export interface BackendPC {
  pcId: string;
  connected: boolean;
  status: "active" | "locked";
  endTime: string | null;
}

const API_URL = "http://localhost:5000";

export async function getPcs(): Promise<BackendPC[]> {
  const response = await fetch(`${API_URL}/pcs`);

  if (!response.ok) {
    throw new Error("Failed to fetch PCs");
  }

  return response.json();
}

export async function startSession(
  pcId: string,
  durationMinutes: number
) {
  const response = await fetch(`${API_URL}/start-session`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      pcId,
      durationMinutes,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to start session");
  }

  return response.json();
}

export async function endSession(pcId: string) {
  const response = await fetch(`${API_URL}/end-session`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      pcId,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to end session");
  }

  return response.json();
}

export async function extendSession(
  pcId: string,
  durationMinutes: number
) {
  const response = await fetch(`${API_URL}/extend-session`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      pcId,
      durationMinutes,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to extend session");
  }

  return response.json();
}

export async function restartPc(pcId: string) {
  const response = await fetch(`${API_URL}/restart`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      pcId,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to restart PC");
  }

  return response.json();
}

export async function shutdownPc(pcId: string) {
  const response = await fetch(`${API_URL}/shutdown`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      pcId,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to shut down PC");
  }

  return response.json();
}

export async function wakePc(pcId: string) {
  const response = await fetch(`${API_URL}/wake`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      pcId,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to wake PC");
  }

  return response.json();
}

export interface PendingPayment {
  id: number;
  pcId: string;
  startTime: string;
  endTime: string | null;
  plannedMinutes: number;
  actualMinutes: number | null;
  gamingCharge: number;
  status: string;
}

export async function getPendingPayments(): Promise<PendingPayment[]> {

  const response = await fetch(`${API_URL}/pending-payments`);

  if (!response.ok) {
    throw new Error("Failed to fetch pending payments");
  }

  return response.json();

}

export async function collectPayment(sessionId: number) {

  const response = await fetch(`${API_URL}/collect-payment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sessionId,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to collect payment");
  }

  return response.json();

}

export interface Settings {

  id: number;

  cafeName: string;

  billingType: "PER_MINUTE" | "PER_HOUR";

  gamingRate: number;

  currency: string;

}

export async function getSettings(): Promise<Settings> {

  const response = await fetch(`${API_URL}/settings`);

  if (!response.ok) {
    throw new Error("Failed to fetch settings");
  }

  return response.json();

}

export async function updateSettings(
  settings: Omit<Settings, "id">
) {

  const response = await fetch(`${API_URL}/settings`, {

    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(settings),

  });

  if (!response.ok) {
    throw new Error("Failed to save settings");
  }

  return response.json();

}