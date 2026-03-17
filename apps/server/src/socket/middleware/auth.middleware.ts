import type { Socket } from "socket.io";
import { prisma } from "@collabdoc/db";

export async function socketAuthMiddleware(
  socket: Socket,
  next: (err?: Error) => void
) {
  try {

    const sessionToken= socket.handshake.auth.sessionToken;
    console.log(`socket middleware sessionToken ${sessionToken}`)
    
    if (!sessionToken) {
      return next(new Error("No session token"));
    }

    const session = await prisma.session.findUnique({
      where: { sessionToken },
      include: { user: true }
    });

    if (!session || session.expires < new Date()) {
      return next(new Error("Session expired"));
    }

    socket.data.userId = session.userId;
    socket.data.userName=session.user.name;
    console.log(`socket middleware pass`)
    next();
  } catch (error) {
    console.error("Socket authentication error:", error);
    next(new Error("Unauthorized"));
  }
}
