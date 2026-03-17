import { Server, Socket } from "socket.io";
import { registerDocumentHandlers } from "./document.listeners.js";
import {removeUser} from "../../services/document.service.js";


export function registerConnectionHandlers(io: Server) {
  io.on("connection", (socket: Socket) => {
    console.log(`${socket.id} connected for ${socket.data.userName}`)
    registerDocumentHandlers(io,socket);

    socket.on("disconnect",async () => {
      const {documentId,userId,yClientID ,wasKicked,userName} = socket.data;
      console.log(`Socket disconnected for user ${userId} from document ${documentId}`);
      if(!documentId || !yClientID) return ;

      removeUser(documentId,socket.id);

        if (wasKicked) {
         socket.to(documentId).emit("document:userKicked", { userName });
        } else {
          socket.to(documentId).emit("document:userLeft", { userName });
        }

      // awareness removal
      socket.to(documentId).emit("document:awareness:remove", {clientID:yClientID});
    });


  });


}
