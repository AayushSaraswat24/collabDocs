import { Server, Socket } from "socket.io";
import { prisma } from "@collabdoc/db";
import {Role} from "@collabdoc/db";
import { kickUserFromRoom } from "../room.utils";
import * as Y from "yjs"
import { applyYjsUpdate, loadDocument ,getActiveUsers , addUser, removeUser, removeUserByUserId} from "../../services/document.service";

export function registerDocumentHandlers(io: Server, socket: Socket) {


  socket.on( "document:join",async ({ documentId ,clientId}, ack) => {
    try{

      const userId = socket.data.userId;
      
      if (!documentId || !clientId) {
        return ack({ ok: false, error: "DOCUMENT_ID_OR_CLIENT_ID_MISSING" });
      }
      
      if(!userId || !socket.data.userName){
        return ack({ ok: false, error: "UNAUTHORIZED UserId missing" });
      }
      
      const documentData=await prisma.document.findUnique({
        where:{id:documentId}
      })
      
      
      if(!documentData){
        return ack({ ok: false, error: "DOCUMENT_NOT_FOUND" });
      }
      
      const collaboration = await prisma.collaboration.findFirst({
        where: { userId, documentId },
      });
      
      if (!collaboration) {
        return ack({ ok: false, error: "ACCESS_DENIED" });
      }

      const state= await loadDocument(documentId);
      const update=Y.encodeStateAsUpdate(state.ydoc);

      socket.join(documentId);
      
      socket.data.documentId = documentId;
      socket.data.role = collaboration.role;
      socket.data.yClientID=clientId;
      
      addUser(documentId,userId,socket.id);
      
      socket.to(documentId).emit("document:userJoined",{name:socket.data.userName});
      
      return ack({
        ok: true,
        documentId,
        role: collaboration.role,
        isOwner:documentData.ownerId===userId,
        name:documentData.name,
        content: Array.from(update),
      });

    }catch(error){
        
      console.error("Error in document:join:", {
        userId: socket.data.userId,
        documentId,
        error: error instanceof Error ? error.message : error
      });

      return ack({ 
        ok: false, 
        error: "INTERNAL_ERROR" 
      });

    }

    }

  );

  // webSocket support binary update directly send without base64 encoding .
  socket.on("yjs:update",(update:Uint8Array)=>{
    const {documentId,role}=socket.data;

    if(!documentId || role!==Role.WRITE){
      return ;
    }

    if(!update){
      return;
    }

    const success=applyYjsUpdate(documentId,update);

    if(!success){
      return;
    }

    // emitting to client update listener as socket is directional .
    socket.to(documentId).emit("yjs:update",Buffer.from(update));
  })

  
socket.on("document:kick",async ({targetUserId},ack)=>{

  try{

    if(!targetUserId){
      console.log("targetUserId : ", targetUserId);
      return ack({
        ok:false,
        error:"TARGET_USER_ID_REQUIRED",
      });
    }

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
    
    if(targetUserId === document.ownerId){
      return ack({
        ok:false,
        error:"OWNER_CANNOT_BE_KICKED",
      });
    }

    await prisma.collaboration.deleteMany({
      where:{
        documentId,
        userId:targetUserId,
      }
    })
    
    await prisma.collaborationInvite.deleteMany({
      where:{
        documentId:documentId,
        inviteeId:targetUserId,
      }
    })

    kickUserFromRoom(io, documentId, targetUserId);
    removeUserByUserId(documentId,targetUserId);

    return ack({
      ok:true,
    });

  }catch(error){
    console.error("Error in document:kick:", {
      userId: socket.data.userId,
      documentId: socket.data.documentId,
      error: error instanceof Error ? error.message : error
    });

    return ack({
      ok: false,
      error: "INTERNAL_ERROR",
    })
  }

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

 socket.on("document:awareness", (update) => {
   const { documentId } = socket.data
   if (!documentId) return

   socket.to(documentId).emit("document:awareness", update) 
})

  socket.on("document:leave",({documentId}) =>{

    removeUser(documentId,socket.id);
    socket.leave(documentId);
    delete socket.data.documentId;
    delete socket.data.role;
  })


}

