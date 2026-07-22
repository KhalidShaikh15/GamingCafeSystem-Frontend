let socket: WebSocket | null = null;

export function connectDashboardSocket(
  onPcsUpdated: () => void
) {
  // Reuse existing connection
  if (socket && socket.readyState === WebSocket.OPEN) {
    return socket;
  }

  socket = new WebSocket("ws://localhost:5000");

  socket.onopen = () => {
    console.log("Dashboard WebSocket Connected");

    socket?.send(
      JSON.stringify({
        Type: "DASHBOARD_REGISTER",
      })
    );
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);

    console.log("Received:", data);

    if (data.Type === "PCS_UPDATED") {
      onPcsUpdated();
    }
  };

  socket.onclose = () => {
    console.log("Dashboard WebSocket Closed");
    socket = null;
  };

  return socket;
}