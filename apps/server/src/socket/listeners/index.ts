import { Server, Socket } from "socket.io";


export function registerConnectionHandlers(io: Server) {
  io.on("connection", (socket: Socket) => {
    console.log("🔌 New socket connected:", socket.id);


    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected:", socket.id);
    });
  });
}
