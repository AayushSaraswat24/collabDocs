import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import {prisma} from "@collabdoc/db"


export async function GET(request:NextRequest){
    try{
        const session=await getServerSession(authOptions);

        if(!session || !session.user.id){
            return NextResponse.json({
              success: false,
              message: "Unauthorized"
            }, { status: 401 });
        }

        const collaborations=await prisma.collaboration.findMany({
            where:{
                userId: session.user.id
            },
            include:{
                document:{
                    select:{
                        id:true,
                        name:true,
                        ownerId:true,
                }
            }
            }
        });

        const documents=collaborations.map((collab)=> ({
            id:collab.document.id,
            name:collab.document.name,
            isOwner:collab.document.ownerId===session.user.id,
        }));

        return NextResponse.json({
            success:true,
            documents,
            user:session.user,
            message:"Documents fetched successfully"
        },{status:200});


    }catch(error){
        console.error("Error fetching document:", error);
        return NextResponse.json({
          success: false,
          message: "internal server error",
        }, { status: 500 });
    }
}