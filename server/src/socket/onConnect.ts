import { Server, Socket } from "socket.io";
import { SOCKET_EVENTS } from "./events.js";
import { onDisconnect } from "./onDisconnect.js";
import {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
} from "./interfaces.js";

export const ioOnConnect = (
  io: Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >
) => {
  io.on(
    SOCKET_EVENTS.CONNECT,
    (
      socket: Socket<
        ClientToServerEvents,
        ServerToClientEvents,
        InterServerEvents,
        SocketData
      >
    ) => {
      console.log(`Socket connected: ${socket.id}`);

      // Join User Room for personal notifications
      if (socket.data.user) {
        socket.join(`user:${socket.data.user._id.toString()}`);
      }

      // Join Document Room
      socket.on(SOCKET_EVENTS.JOIN_DOCUMENT, async (documentId: string) => {
        // Force user to be authenticated
        const user = socket.data.user;
        if (!user) {
          socket.emit("error", { message: "Unauthorized" });
          return;
        }

        socket.join(documentId);
        // Track which doc we are in
        socket.data.documentID = documentId;
        socket.data.hasUnsavedChanges = false;

        console.log(
          `Socket ${socket.id} (User: ${user.email}) joined document: ${documentId}`
        );

        // Notify global listeners (Collaborators on Dashboard)
        try {
          // We need dynamic import if not top-level, or just use Mongoose
          const { DocumentModel } = await import("../models/MDocument.js");
          const doc = await DocumentModel.findById(documentId);
          if (doc) {
            const collaborators = [doc.owner, ...doc.collaborators];
            collaborators.forEach((collabId) => {
              if (collabId.toString() !== user._id.toString()) {
                io.to(`user:${collabId.toString()}`).emit("doc-activity", {
                  documentId: doc._id,
                  title: doc.title,
                  user: {
                    id: user._id,
                    email: user.email,
                    firstName: user.personalInformation?.firstName,
                  },
                  status: "viewing",
                });
              }
            });
          }
        } catch (e) {
          console.error("Error broadcasting join activity", e);
        }

        // ... existing presence logic ...
        const set = io.sockets.adapter.rooms.get(documentId);
        if (set) {
          const clients = Array.from(set);
          const activeUsers = clients.map((clientId) => {
            const s = io.sockets.sockets.get(clientId);
            const sUser = s?.data.user;
            return {
              socketId: clientId,
              userId: sUser?._id.toString() || "",
              email: sUser?.email || "",
              firstName: sUser?.personalInformation?.firstName,
              profilePicture: sUser?.personalInformation?.profilePicture,
              color: "#" + Math.floor(Math.random() * 16777215).toString(16),
            };
          });

          // Emit current active users to the new joiner
          socket.emit("active-users", activeUsers);

          // Broadcast new user to others
          socket.to(documentId).emit(SOCKET_EVENTS.JOIN_DOCUMENT, {
            socketId: socket.id,
            userId: user._id.toString(),
            email: user.email,
            firstName: user.personalInformation?.firstName,
            profilePicture: user.personalInformation?.profilePicture,
            color: "#" + Math.floor(Math.random() * 16777215).toString(16),
          });
        }
      });

      // Handle Text Updates
      socket.on(
        SOCKET_EVENTS.TEXT_UPDATE,
        (data: { documentId: string; operation: any }) => {
          const { documentId, operation } = data;

          // Mark session as dirty since we are typing
          socket.data.hasUnsavedChanges = true;

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
    }
  );
};
