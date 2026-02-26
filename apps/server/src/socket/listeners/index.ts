import { Server, Socket } from "socket.io";
import { registerDocumentHandlers } from "./document.listeners";
import {removeUser} from "../../services/document.service";


export function registerConnectionHandlers(io: Server) {
  io.on("connection", (socket: Socket) => {
    console.log(" New socket connected:", {
      socketId: socket.id,
      userId: socket.data.userId,
    });
    
    
    registerDocumentHandlers(io,socket);

    socket.on("disconnect",async () => {
      const {documentId,userId} = socket.data;
      console.log(`Socket disconnected for user ${userId} from document ${documentId}`);
      if(!documentId) return ;

      removeUser(documentId,socket.id);
      
    });


  });


}
