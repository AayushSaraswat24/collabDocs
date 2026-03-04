import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import {prisma} from "@collabdoc/db"
import  {Role} from "@collabdoc/db";

export async function POST(request:NextRequest){
    try{
        const session=await getServerSession(authOptions);
        if(!session || !session.user.id){
            return NextResponse.json({
              success: false,
              message: "Unauthorized"
            }, { status: 401 });
        }

        const req= await request.json();
        const {update:base64,docId,name=null}=req;

        if(!base64 || !docId){
            return NextResponse.json({
              success: false,
              message: "Missing required feilds"
            }, { status: 400 });
        }
        // whole crdt state for versioning .
        const update=Buffer.from(base64,'base64');
        
        const role= await prisma.collaboration.findUnique({
            where:{
                 userId_documentId:{
                    userId:session.user.id,
                    documentId:docId
                }
                },
                select:{
                    id:true,
                    role:true
                }
        })

        if(!role || role.role !== Role.WRITE ){
            return NextResponse.json({
              success: false,
              message: "Unauthorized to access document"
            }, { status: 403 });
        }

        await prisma.$transaction(async (tx) => {

            // raw query to lock the document row to prevent race conditions, other transactions trying to save version for same document will wait until lock is released.
            await tx.$executeRaw`
                SELECT id FROM "Document"
                WHERE id = ${docId}
                FOR UPDATE
            `;

            
            await tx.documentVersion.create({
                data: {
                documentId: docId,
                name: name ?? null,
                content: update
                }
            });

            // Keep only latest 10
            const versions = await tx.documentVersion.findMany({
                where: { documentId: docId },
                orderBy: { createdAt: "desc" },
                skip: 10,
                select: { id: true }
            });

            if (versions.length > 0) {
                await tx.documentVersion.deleteMany({
                where: {
                    id: { in: versions.map(v => v.id) }
                }
                });
            }
        });


        return NextResponse.json({
          success: true,
          message: "Document version saved successfully"
        }, { status: 200 });

    }catch(error){  
        console.error("Error saving document version:", error);
        return NextResponse.json({
          success: false,
          message: "internal server error"
        }, { status: 500 });
    }
}

