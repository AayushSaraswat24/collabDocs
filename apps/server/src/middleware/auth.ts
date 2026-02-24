// middleware for express . diff from socket middleware .

import { Request,Response,NextFunction } from "express";
import { prisma } from "@collabdoc/db";

export async function authenticate(req:Request,res:Response,next:NextFunction){
    try{
        const cookieHeader= req.headers.cookie;

        if(!cookieHeader){
            return res.status(401).json({success:false,message:"No cookies"});
        }

        const cookies = Object.fromEntries(
          cookieHeader.split("; ").map((c) => c.split("="))
        );

        const sessionToken =
        cookies["next-auth.session-token"] ||
        cookies["__Secure-next-auth.session-token"];

        if (!sessionToken) {
            return res
                .status(401)
                .json({ success: false, message: "No session token" });
        }

        const session = await prisma.session.findUnique({
            where: { sessionToken },
            include:{
                user:{
                    select:{
                    id:true,
                    name:true
                  }
                }
            }
        });

        if (!session || session.expires < new Date()) {
            return res
                .status(401)
                .json({ success: false, message: "Session expired" });
        }

        if(!session.user.id || !session.user.name){
            return res
                .status(401)
                .json({ success: false, message: "User not found" });
        }

        req.userId = session.user.id;
        req.userName = session.user.name;
        next();

    }catch(error){
        console.error("Authentication error:",error);
        return res.status(500).json({success:false,message:"Internal server error"});
    }
}