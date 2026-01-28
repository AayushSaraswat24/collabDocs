import { Server } from "socket.io";
import type { Server as HttpServer } from "http";
import { registerConnectionHandlers } from "./listeners/index";
import { socketAuthMiddleware } from "./middleware/auth.middleware";

let io: Server | null = null;

export function setupSocket(httpServer: HttpServer) {
  if (io) {
    console.log("⚠️ Socket.io already initialized");
    return io;
  }

  io = new Server(httpServer, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL,
      credentials: true,
    },
  });

  //Middleware
  io.use(socketAuthMiddleware);

  registerConnectionHandlers(io);

  console.log("✅ Socket.io initialized");
  return io;
}

export function getIO(): Server {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
}
