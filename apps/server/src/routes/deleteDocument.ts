import { Router } from "express";
import {prisma} from "@collabdoc/db"
import { destroyDocument } from "../services/document.service";
import { getIO } from "../socket/index";

const documentDeleteRouter=Router();

documentDeleteRouter.delete("/deleteDocument/:docId",async(req,res)=>{
    try{
        console.log("delete document req ")
        const { userId, userName } = req;
        if(!userId || !userName){
            res.status(401).json({success:false,message:"Unauthorized"});
            return 
        }

        const {docId}=req.params;
        if(!docId){
            res.status(400).json({success:false,message:"Document ID is required"});
            return 
        }

         const document=await prisma.document.findUnique({
            where:{
                id:docId
            }
        });
        

        if(!document || document.ownerId !== userId){
            res.status(404).json({
              success: false,
              message: "Document not found"
            });
            return;
        }

        
        await prisma.document.delete({
            where:{
                id:docId
            }
        });

        await destroyDocument(docId);

        const io=getIO();

        io.in(docId).disconnectSockets(true);

        res.status(200).json({
          success: true,
          message: "Document deleted successfully"
        });

    }catch(error){
        console.error(`Error deleting document`,error);
        res.status(500).json({
            success:false,
            message:"internal server error"
        })
    }

})
export default documentDeleteRouter;