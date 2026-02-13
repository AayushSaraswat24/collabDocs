import { Server, Socket } from "socket.io";
import { registerDocumentHandlers } from "./document.listeners";
import { flushAndDestroy } from "../../realtime/documentPersistence";
import { removeUser } from "../../realtime/activeUsers";
import { yDocs } from "./document.listeners";

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

      const ydoc=yDocs.get(documentId);

      if(ydoc){
        yDocs.delete(documentId);
        await flushAndDestroy(documentId,ydoc);
      }
    
    });


  });


}
