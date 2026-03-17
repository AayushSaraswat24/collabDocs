import { io, Socket } from "socket.io-client";

export const socket: Socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
  withCredentials: true,
  autoConnect: false,
  transports: ["websocket"],
});

let activeSocketConsumers = 0;
let pendingDisconnectTimer: ReturnType<typeof setTimeout> | null = null;
let connectPromise: Promise<void> | null = null;

export function retainSocketConnection() {
  activeSocketConsumers += 1;

  if (pendingDisconnectTimer) {
    clearTimeout(pendingDisconnectTimer);
    pendingDisconnectTimer = null;
  }
}

export function releaseSocketConnection() {
  activeSocketConsumers = Math.max(0, activeSocketConsumers - 1);

  if (activeSocketConsumers > 0) return;

  // Defer disconnect so Strict Mode remounts can re-acquire without flapping.
  pendingDisconnectTimer = setTimeout(() => {
    pendingDisconnectTimer = null;

    if (activeSocketConsumers === 0 && (socket.connected || socket.active)) {
      socket.disconnect();
    }
  }, 0);
}

export async function connectSocket() {
  if (socket.connected) return;
  if (connectPromise) return connectPromise;

  connectPromise = (async () => {
    const res = await fetch("/api/sessionToken");
    const { token } = await res.json();

    socket.auth = {
      sessionToken: token,
    };

    if (!socket.connected) {
      socket.connect();
    }
  })().finally(() => {
    connectPromise = null;
  });

  return connectPromise;
}