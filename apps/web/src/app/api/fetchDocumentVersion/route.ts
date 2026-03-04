import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import {prisma} from "@collabdoc/db"


export async function POST(request:NextRequest){
    try{
        const session = await getServerSession(authOptions);
        if(!session || !session.user.id){
            return NextResponse.json({
              success: false,
              message: "Unauthorized"
            }, { status: 401 });
        }

        const {documentId}=await request.json();
        if(!documentId){
            return NextResponse.json({
              success: false,
              message: "documentId is required"
            }, { status: 400 });
        }

        const collab= await prisma.collaboration.findUnique({
            where:{
                 userId_documentId:{
                    userId:session.user.id,
                    documentId:documentId
                }
                },
                select:{
                    id:true,
                }
        })

        if(!collab){
            return NextResponse.json({
              success: false,
              message: "Unauthorized to access document"
            }, { status: 403 });
        }

        const document=await prisma.document.findUnique({
            where:{
                id:documentId
            },
            select:{
                id:true,
                ownerId:true,
                documentVersions:{
                    select:{
                     id:true,
                     name:true,
                     createdAt:true,
                    },
                    orderBy:{
                        createdAt:"desc"
                    }
                }
            }
        })
        
        if(!document){
            return NextResponse.json({
              success: false,
              message: "Document not found"
            }, { status: 404 });
        }

        return NextResponse.json({
          success: true,
          message: "Document versions fetched successfully",
          documentVersion:document.documentVersions
        }, { status: 200 });

    }catch(error){
        console.error(error);
        return NextResponse.json({
          success: false,
          message: "internal server error"
        }, { status: 500 });
    }
}