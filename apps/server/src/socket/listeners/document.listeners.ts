import { Server, Socket } from "socket.io";
import { prisma } from "@collabdoc/db";
import {Role} from "@collabdoc/db";
import { kickUserFromRoom } from "../room.utils";
import { addUser, getActiveUsers } from "../../realtime/activeUsers";
import * as Y from "yjs"
import { attachPersistence } from "../../realtime/documentPersistence";

export const yDocs=new Map<string,Y.Doc>();

export function registerDocumentHandlers(io: Server, socket: Socket) {


  socket.on( "document:join",async ({ documentId }, ack) => {
      const userId = socket.data.userId;

      if (!documentId) {
        return ack({ ok: false, error: "DOCUMENT_ID_REQUIRED" });
      }

      if(!userId || !socket.data.userName){
        return ack({ ok: false, error: "UNAUTHORIZED UserId missing" });
      }

      const collaboration = await prisma.collaboration.findFirst({
        where: { userId, documentId },
      });

      if (!collaboration) {
        return ack({ ok: false, error: "ACCESS_DENIED" });
      }

          
      const documentData=await prisma.document.findUnique({
        where:{id:documentId}
      })

      
      if(!documentData){
        return ack({ ok: false, error: "DOCUMENT_NOT_FOUND" });
      }
      
      let ydoc=yDocs.get(documentId);

      if(!ydoc){
        ydoc=new Y.Doc();

        if(documentData.content){
          Y.applyUpdate(ydoc,documentData.content);
        }
        // attach the event listener on ydoc for yjs update .
        attachPersistence(documentId,ydoc);
        yDocs.set(documentId,ydoc);
      }

      socket.join(documentId);

      socket.data.documentId = documentId;
      socket.data.role = collaboration.role;

      addUser(documentId,userId);
      
      socket.to(documentId).emit("document:userJoined",{name:socket.data.userName});

      return ack({
        ok: true,
        documentId,
        role: collaboration.role,
        isOwner:documentData.ownerId===userId,
        name:documentData.name,
        content: documentData.content ? Buffer.from(documentData.content).toString("base64") : null,
      });
    }

  );

  // webSocket support binary update directly send without base64 encoding .
  socket.on("yjs:update",(update:Uint8Array)=>{
    const {documentId,role}=socket.data;

    if(!documentId || role!==Role.WRITE){
      return ;
    }

    const ydoc=yDocs.get(documentId);
    if(!ydoc) return;

    Y.applyUpdate(ydoc,update);

    // emitting to client update listener as socket is directional .
    socket.to(documentId).emit("yjs:update",update);
  })

  
  socket.on("document:cursor", ({ index }) => {
    const { documentId, userId, userName ,role} = socket.data;
    if (!documentId) return;

    if(role!==Role.WRITE){
      return ;
    }

    socket.to(documentId).emit("document:cursor", {
      userId,
      userName,
      index,
    });
});


socket.on("document:kick",async ({targetUserId},ack)=>{

  const {documentId,userId,role}=socket.data;

  if(role===Role.READ){
    return ;
  }

  if(!documentId || !userId){
    return ;
  }

  const document=await prisma.document.findUnique({
    where:{id:documentId},
    select:{ownerId:true},
  });

  if(!document || document.ownerId!==userId){
    return ack({
      ok:false,
      error:"ONLY OWNER CAN KICK USERS",
    });
  }

  await prisma.collaboration.deleteMany({
    where:{
      documentId,
      userId:targetUserId,
    }
  })

  kickUserFromRoom(io, documentId, targetUserId);
  socket.to(documentId).emit("document:userKicked",{userId:targetUserId});

})

  socket.on("document:get:activeUsers" , async(req,ack) =>{
    const {documentId,userId}=socket.data;

    if(!documentId || !userId ){
      return ack({
        ok:false,
        error:"UNAUTHORIZED"
      });
    }

  const collaboration=await prisma.collaboration.findMany({
    where:{
      documentId,
    },
    include:{
      user:{
        select:{
          id:true,
          name:true,
          email:true,
        }
      },
    },
  })

  if (collaboration.length === 0) {
    return ack({ ok: false, error: "FORBIDDEN" });
  }

   const activeUsers=getActiveUsers(documentId);
  
   const users=collaboration.map((collab)=>({
    id:collab.user.id,
    name:collab.user.name,
    email:collab.user.email,
    isActive:activeUsers.has(collab.user.id),
   }))


   return ack({
    ok: true,
    users,
  });

  })



}
