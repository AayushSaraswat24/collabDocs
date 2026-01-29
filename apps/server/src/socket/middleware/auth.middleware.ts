import type { Socket } from "socket.io";
import { prisma } from "@collabdoc/db";

export async function socketAuthMiddleware(
  socket: Socket,
  next: (err?: Error) => void
) {
  try {
    const cookieHeader = socket.request.headers.cookie;

    if (!cookieHeader) {
      return next(new Error("No cookies"));
    }


    const cookies = Object.fromEntries(
      cookieHeader.split("; ").map(c => c.split("="))
    );

    const sessionToken =
      cookies["next-auth.session-token"] ||
      cookies["__Secure-next-auth.session-token"];

    if (!sessionToken) {
      return next(new Error("No session token"));
    }

    const session = await prisma.session.findUnique({
      where: { sessionToken },
    });

    if (!session || session.expires < new Date()) {
      return next(new Error("Session expired"));
    }

    const user= await prisma.user.findUnique({
      where:{id:session.userId}
    });

    if(!user){
      return next(new Error("User not found"));
    }

    socket.data.userId = session.userId;
    socket.data.userName=user.name;

    next();
  } catch (error) {
    next(new Error("Unauthorized"));
  }
}
