import { Socket, Server } from "socket.io";
import { SOCKET_EVENTS } from "./events.js";
import { onDisconnect } from "./onDisconnect.js";

export const ioOnConnect = (io: Server) => {
  io.on(SOCKET_EVENTS.CONNECT, (socket: Socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // Join Document Room
    socket.on(SOCKET_EVENTS.JOIN_DOCUMENT, (documentId: string) => {
      socket.join(documentId);
      console.log(`Socket ${socket.id} joined document: ${documentId}`);

      // Optional: Emit to room that user joined (for presence)
      socket
        .to(documentId)
        .emit(SOCKET_EVENTS.JOIN_DOCUMENT, { userId: socket.id });
    });

    // Handle Text Updates
    socket.on(
      SOCKET_EVENTS.TEXT_UPDATE,
      (data: { documentId: string; operation: any }) => {
        const { documentId, operation } = data;
        // Broadcast to all other clients in the room
        socket.to(documentId).emit(SOCKET_EVENTS.TEXT_UPDATE, operation);
      }
    );

    // Handle Cursor Moves
    socket.on(
      SOCKET_EVENTS.CURSOR_MOVE,
      (data: { documentId: string; range: any }) => {
        const { documentId, range } = data;
        // Broadcast to all other clients in the room
        socket
          .to(documentId)
          .emit(SOCKET_EVENTS.CURSOR_MOVE, { userId: socket.id, range });
      }
    );

    // Handle Disconnect
    onDisconnect(socket, io);
  });
};
