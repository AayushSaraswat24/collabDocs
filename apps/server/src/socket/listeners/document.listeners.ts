import { Server, Socket } from "socket.io";
import { prisma } from "@collabdoc/db";
import {Role} from "@collabdoc/db";
import { bufferDocumentUpdate } from "../../realtime/documentBuffer";
import { kickUserFromRoom } from "../room.utils";
import { addUser, getActiveUsers } from "../../realtime/activeUsers";

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

      addUser(documentId,userId);
      
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

    // once user joined a room my socket have userId ,userName , role ,documentId

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


socket.on("document:kick",async ({targetUserId})=>{

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
    socket.emit("document:kick:error",{ 
      message:"ONLY OWNER CAN KICK USERS", 
    });
    return ;
  }

  await prisma.collaboration.deleteMany({
    where:{
      documentId,
      userId:targetUserId,
    }
  })

  kickUserFromRoom(io, documentId, targetUserId);

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
