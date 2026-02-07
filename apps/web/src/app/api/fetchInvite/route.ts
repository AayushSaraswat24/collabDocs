import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import {prisma,CollaborationInviteStatus} from "@collabdoc/db"

export async function GET(request:NextRequest){
    try{

        const session=await getServerSession(authOptions);

        if(!session || !session.user.id){
            return NextResponse.json({
              success: false,
              message: "Unauthorized"
            }, { status: 401 });
        }

        const invites=await prisma.collaborationInvite.findMany({
            where:{
                inviteeId:session.user.id,
                status:CollaborationInviteStatus.PENDING
            },
            select:{
                id:true,
                inviterId:true,
                role:true,

                document:{
                    select:{
                        name:true,
                    }
                },

                inviter:{
                    select:{
                        name:true,
                        email:true,
                        image:true,
                    }
                }
            }
        })

        if(!invites){
            return NextResponse.json({
              success: false,
              message: "No invites found"
            }, { status: 200 });
        }

        return NextResponse.json({
          success: true,
          message: "Invites fetched successfully",
          data: invites
        }, { status: 200 });

    }catch(error){
        console.error('Error fetching invites:', error);
        return NextResponse.json({
          success: false,
          message: "internal server error"
        }, { status: 500 });
    }
}