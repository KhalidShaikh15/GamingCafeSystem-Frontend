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