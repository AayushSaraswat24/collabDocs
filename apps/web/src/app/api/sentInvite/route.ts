import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import {prisma,CollaborationInviteStatus} from "@collabdoc/db"

export async function POST(request:NextRequest){
    try{
        const session=await getServerSession(authOptions);
        if(!session || !session.user.id){
            return NextResponse.json({
              success: false,
              message: "Unauthorized"
            }, { status: 401 });
        }

        const {email, documentId }=await request.json();
        if(!email || !documentId){
            return NextResponse.json({
                success:false,
                message:"insufficient data"
            },{status:400});
        }

        const doc=await prisma.document.findUnique({
            where:{id:documentId}
        });

        if(!doc){
            return NextResponse.json({
              success: false,
              message: "Document not found"
            }, { status: 404 });
        }

        if(doc.ownerId!==session.user.id){
            return NextResponse.json({
              success: false,
              message: "Don't have permission to invite users to this document"
            }, { status: 403 });
        }


        const user=await prisma.user.findUnique({
            where:{email}
        });

        if(!user || session.user.id===user.id){
            return NextResponse.json({
              success: false,
              message: "User not found"
            }, { status: 404 });
        }

        const existingInvite=await prisma.collaborationInvite.findUnique({
            where:{
                inviteeId_documentId:{
                    inviteeId:user.id,
                    documentId
                }
            }
        })


        if(existingInvite?.status===CollaborationInviteStatus.ACCEPTED){
            return NextResponse.json({
              success: false,
              message: "User is already a collaborator"
            }, { status: 409 });
        }

        if (existingInvite?.status === CollaborationInviteStatus.PENDING) {
            return NextResponse.json(
                { success: true, message: "Invite already sent" },
                { status: 200 }
            );
        }

        await prisma.collaborationInvite.upsert({
             where:{
                inviteeId_documentId:{
                    inviteeId:user.id,
                    documentId
                }
            },

            update:{
                status:CollaborationInviteStatus.PENDING,
                inviterId:session.user.id,
            },

            create:{
                documentId,
                inviteeId:user.id,
                inviterId:session.user.id,
                status:CollaborationInviteStatus.PENDING,
            }
        })

        return NextResponse.json({
          success: true,
          message: "Invite sent successfully"
        }, { status: 200 });
        
    }catch(err){
        console.error("Error sending invite:", err);
        return NextResponse.json({
          success: false,
          message: "internal server error",
        }, { status: 500 });
    }
}