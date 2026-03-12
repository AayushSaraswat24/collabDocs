"use client";

import { useEffect, useState } from "react";
import { socket } from "@/lib/socket";

export type SocketStatus =
  | "connecting"
  | "connected"
  | "error"
  | "disconnected";

export function UseSocketConnection() {
  const [status, setStatus] = useState<SocketStatus>("connecting");

  useEffect(() => {

    if(!socket.connected){
      socket.connect();
    }

    const onConnect = () => setStatus("connected");
    const onDisconnect = () =>{
      setStatus("disconnected");
    }
    const onConnectError = () => setStatus("error");

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
      socket.disconnect();
    };
  }, []);

  return status;
}
