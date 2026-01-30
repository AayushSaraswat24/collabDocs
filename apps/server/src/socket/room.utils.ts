import { Server } from "socket.io";

export function kickUserFromRoom(
  io: Server,
  documentId: string,
  targetUserId: string
) {
  const room = io.sockets.adapter.rooms.get(documentId);
  if (!room) return;

  for (const socketId of room) {
    const s = io.sockets.sockets.get(socketId);
    if (!s) continue;

    if (s.data.userId === targetUserId) {
      s.emit("document:kicked");
      s.leave(documentId);
      s.disconnect(true);
    }
  }
}
