import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import {prisma} from "@collabdoc/db"

export async function POST(request:NextRequest){
    try{
        const session=await getServerSession(authOptions);

        if(!session || !session.user?.email){
            return NextResponse.json({
              success: false,
              message: "Unauthorized"
            }, { status: 401 });
        }

        const user=await prisma.user.findUnique({
            where:{email:session.user.email },
            select:{id:true}
        })

        if(!user){
            return NextResponse.json({
              success: false,
              message: "User not found"
            }, { status: 404 });
        }

        const {name}=await request.json();

        if (!name || typeof name !== "string" || name.trim().length === 0) {
            return NextResponse.json(
                { success: false, message: "Document name is required" },
                { status: 400 }
            );
        }

        const normalizedName=name.trim();

        const documentCount=await prisma.document.count({
            where:{ownerId:user.id}
        })

        if(documentCount>=15){
            return NextResponse.json({
              success: false,
              message: "Document limit reached. Delete old ones to create new."
            }, { status: 403 });
        }
        
        const existingDoc=await prisma.document.findFirst({
            where:{
                ownerId:user.id,
                name:normalizedName
            }
        })

        if(existingDoc){
            return NextResponse.json({
              success: false,
              message: "Document with same name already exists"
            }, { status: 409 });
        }


        const document=await prisma.$transaction(async (tx)=>{
            const doc=await tx.document.create({
                data:{
                    name:normalizedName,
                    ownerId:user.id,
                    content:""
                }
            });

            await tx.collaboration.create({
                data:{
                    documentId:doc.id,
                    userId:user.id,
                    role:"WRITE"
                }
            });

            return doc;
        })

        return NextResponse.json({
          success: true,
          message: "Document created successfully",
          document
        }, { status: 201 });

    }catch(error){
        console.error("Error creating document:", error);
        return NextResponse.json({
          success: false,
          message: "internal server error"
        }, { status: 500 });
    }
}