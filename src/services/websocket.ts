type PcsUpdatedCallback = () => void;

let socket: WebSocket | null = null;

const listeners = new Set<PcsUpdatedCallback>();

export function connectDashboardSocket(
  callback: PcsUpdatedCallback
) {
  // Register the callback
  listeners.add(callback);

  // Reuse the existing socket
  if (socket) {
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

      listeners.forEach(listener => listener());

    }
  };

  socket.onclose = () => {

    console.log("Dashboard WebSocket Closed");

    socket = null;

  };

  return socket;
}

export function disconnectDashboardSocket(
  callback: PcsUpdatedCallback
) {

  listeners.delete(callback);

}