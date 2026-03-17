"use client";

import { useEffect, useState } from "react";
import {
  connectSocket,
  releaseSocketConnection,
  retainSocketConnection,
  socket,
} from "@/lib/socket";

export type SocketStatus =
  | "connecting"
  | "connected"
  | "error"
  | "disconnected";

export function UseSocketConnection() {
  const [status, setStatus] = useState<SocketStatus>(
    socket.connected ? "connected" : "connecting"
  );

  useEffect(() => {
    let mounted = true;
    retainSocketConnection();

    const onConnect = () => setStatus("connected");
    const onDisconnect = () => {
      setStatus("disconnected");
    };
    const onConnectError = () => setStatus("error");

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);

    if (socket.connected) {
      setStatus("connected");
    } else {
      setStatus("connecting");
      connectSocket().catch(() => {
        if (mounted) {
          setStatus("error");
        }
      });
    }

    return () => {
      mounted = false;
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
      releaseSocketConnection();
    };
  }, []);

  return status;
}
