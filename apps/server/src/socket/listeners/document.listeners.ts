import { Server, Socket } from "socket.io";
import { prisma } from "@collabdoc/db";
import {Role} from "@collabdoc/db";
import { bufferDocumentUpdate } from "../../realtime/documentBuffer";

export function registerDocumentHandlers(io: Server, socket: Socket) {


  socket.on( "document:join",async ({ documentId }, ack) => {
      const userId = socket.data.userId;

      if (!documentId) {
        return ack({ ok: false, error: "DOCUMENT_ID_REQUIRED" });
      }

      if(!userId){
        return ack({ ok: false, error: "UNAUTHORIZED UserId missing" });
      }

      const collaboration = await prisma.collaboration.findFirst({
        where: { userId, documentId },
      });

      if (!collaboration) {
        return ack({ ok: false, error: "ACCESS_DENIED" });
      }

      socket.data.documentId = documentId;
      socket.data.role = collaboration.role;

      socket.join(documentId);

      const documentData=await prisma.document.findUnique({
        where:{id:documentId}
      })

      if(!documentData){
        return ack({ ok: false, error: "DOCUMENT_NOT_FOUND" });
      }

      return ack({
        ok: true,
        documentId,
        role: collaboration.role,
        isOwner:documentData.ownerId===userId,
        content: documentData.content ,
        name:documentData.name,
      });
    }

  );

  socket.on("document:update",({content})=>{
    const {documentId,userId,role,userName}=socket.data;

    if(!documentId || !userId || !role || !userName){
      return ;
    }

    if(role!==Role.WRITE){
      return ;
    }

    socket.to(documentId).emit("document:update:content",{
      content,
      updatedBy:userName,

    })

    bufferDocumentUpdate(documentId,content);
  })

  
}
