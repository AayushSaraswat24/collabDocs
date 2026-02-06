import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import {prisma} from "@collabdoc/db"

export async function DELETE(request:NextRequest){
    try{
        const session=await getServerSession(authOptions);

        if(!session || !session.user.id){
            return NextResponse.json({
              success: false,
              message: "Unauthorized"
            }, { status: 401 });
        }

        const {docId}=await request.json();

        if(!docId){
            return NextResponse.json({
              success: false,
              message: "Document ID is required"
            }, { status: 400 });
        }

        const document=await prisma.document.findUnique({
            where:{
                id:docId
            }
        });
        

        if(!document || document.ownerId !== session.user.id){
            return NextResponse.json({
              success: false,
              message: "Document not found"
            }, { status: 404 });
        }

        await prisma.document.delete({
            where:{
                id:docId
            }
        });

        return NextResponse.json({
          success: true,
          message: "Document deleted successfully"
        }, { status: 200 });

    }catch(error){
        console.log(`Error deleting document`,error);
        return NextResponse.json({
          success: false,
          message: "internal server error"
        }, { status: 500 });
    }
}