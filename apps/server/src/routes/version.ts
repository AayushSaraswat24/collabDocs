import {Router} from "express";
import {prisma, Role} from "@collabdoc/db"
import { getIO } from "../socket/index.js";
import { revertDocument } from "../services/document.service.js";

const router=Router();

router.post("/revert",async (req,res) =>{
    try{
        console.log(`Getting revert req`)
        const { docId, versionId } = req.body;
        // directly attached to request from middleware .
        const { userId, userName } = req;
        console.log(`clearing checks`)
        if(!userId || !userName){
            res.status(401).json({success:false,message:"Unauthorized"});
            return 
        }

        if(!docId || !versionId){
            res.status(400).json({success:false,message:"Missing fields"});
            return 
        }

        const document=await prisma.document.findUnique({
            where:{id:docId},
            select:{
                id:true,
                collaborations:{
                    where:{userId},
                    select:{role:true}
                },
                documentVersions:{
                    where:{id:versionId},
                    select:{content:true}
                }
            }
            
        })

        if(!document || document.documentVersions.length === 0){
            res.status(404).json({success:false,message:"Document or version not found"});
            return 
        }

        if(document.collaborations.length ===0 || document.collaborations[0].role !== Role.WRITE){
            res.status(403).json({success:false,message:"Forbidden"});
            return ;
        }
        
        const versionContent=new Uint8Array(document.documentVersions[0].content);

        const newDoc=await revertDocument(docId,versionContent);

        if(!newDoc){
            res.status(500).json({success:false,message:"Failed to revert document"});
            return 
        }


        await prisma.documentVersion.delete({
            where:{id:versionId}
        })

        const io=getIO();

        io.to(docId).emit("documentReverted",{
            userName,
        })

        res.status(200).json({success:true,message:"Document reverted successfully"});

    }catch(error){
        console.error(error);
        res.status(500).json({success:false,message:"Internal Server Error"});
    }
})

export default router;