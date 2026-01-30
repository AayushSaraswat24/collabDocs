import { Server, Socket } from "socket.io";
import { registerDocumentHandlers } from "./document.listeners";
import { flushAndClearDocument } from "../../realtime/documentBuffer";
import { removeUser } from "../../realtime/activeUsers";

export function registerConnectionHandlers(io: Server) {
  io.on("connection", (socket: Socket) => {
    console.log(" New socket connected:", {
      socketId: socket.id,
      userId: socket.data.userId,
    });
    
    
    registerDocumentHandlers(io,socket);

    socket.on("disconnect",async () => {
      const {documentId,userId} = socket.data;

      if(!documentId) return ;

      const room=io.sockets.adapter.rooms.get(documentId);

      removeUser(documentId,userId);

      if(room && room.size>0){
        return ;
      }

      await flushAndClearDocument(documentId);
    
    });


  });


}
