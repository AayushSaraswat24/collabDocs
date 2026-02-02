import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import {prisma,CollaborationInviteStatus} from "@collabdoc/db";

export async function POST(request:NextRequest){
    try{
        const session=await getServerSession(authOptions);

        if(!session || !session.user.id){
            return NextResponse.json({
              success: false,
              message: "Unauthorized"
            }, { status: 401 });
        }

        const {inviteId,isAccepted=false}=await request.json();

        if(!inviteId){
            return NextResponse.json({
              success: false,
              message: "Invite ID is required"
            }, { status: 400 });
        }
        
        const colloborationInvite=await prisma.collaborationInvite.findUnique({
            where:{
                id:inviteId
            }
        });

        if(!colloborationInvite){
            return NextResponse.json({
              success: false,
              message: "Invite not found"
            }, { status: 404 });
        }

        if(colloborationInvite.inviteeId!==session.user.id || colloborationInvite.status!==CollaborationInviteStatus.PENDING){
            return NextResponse.json({
              success: false,
              message: "invite doesn't exist"
            }, { status: 404 });
        }

        await prisma.$transaction(async (tx)=>{
           const updatedInvite = await tx.collaborationInvite.update({
                where:{
                    id:inviteId
                },
                data:{
                    status:isAccepted ? CollaborationInviteStatus.ACCEPTED : CollaborationInviteStatus.DECLINED
                }
            })

            if(isAccepted){
                await tx.collaboration.create({
                    data:{
                        documentId:updatedInvite.documentId,
                        userId:updatedInvite.inviteeId,
                        role:updatedInvite.role
                    }
                })
            }
        })

        return NextResponse.json({
          success: true,
          message: "invite processed successfully"
        }, { status: 200 });

    }catch(error){
        console.error("Error accepting invite:", error);
        return NextResponse.json({
          success: false,
          message: "internal server error",
        }, { status: 500 });
    }
}

