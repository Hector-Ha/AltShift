import { Socket, Server } from "socket.io";
import { SOCKET_EVENTS } from "./events.js";
import { DocumentModel } from "../models/MDocument.js";
import { NotificationModel } from "../models/MNotification.js";
import { NotificationType } from "../generated/graphql.js";
import { Types } from "mongoose";

export const onDisconnect = (socket: Socket, io: Server) => {
  socket.on(SOCKET_EVENTS.DISCONNECT, async () => {
    console.log(`Socket disconnected: ${socket.id}`);

    // Broadcast active presence
    if (socket.data.documentID && socket.data.user) {
      const docId = socket.data.documentID;
      const user = socket.data.user;

      try {
        const document = await DocumentModel.findById(docId);
        if (document) {
          const collaborators = [document.owner, ...document.collaborators];
          collaborators.forEach((collabId) => {
            if (collabId.toString() !== user._id.toString()) {
              io.to(`user:${collabId.toString()}`).emit("doc-activity", {
                documentId: document._id,
                title: document.title,
                user: {
                  id: user._id,
                  email: user.email,
                  firstName: user.personalInformation?.firstName,
                },
                status: "left",
              });
            }
          });
        }
      } catch (e) {
        console.error("Error broadcasting disconnect activity", e);
      }
    }

    // Notify about unsaved changes
    if (
      socket.data.documentID &&
      socket.data.hasUnsavedChanges &&
      socket.data.user
    ) {
      const docId = socket.data.documentID;
      const user = socket.data.user;

      console.log(
        `User ${user.email} left document ${docId} with changes. Generating notifications...`
      );

      try {
        const document = await DocumentModel.findById(docId);
        if (document) {
          const recipients = new Set<string>();
          if (document.owner.toString() !== user._id.toString()) {
            recipients.add(document.owner.toString());
          }
          document.collaborators.forEach((collab) => {
            if (collab.toString() !== user._id.toString()) {
              recipients.add(collab.toString());
            }
          });

          const notifications = Array.from(recipients).map((recipientId) => ({
            recipient: new Types.ObjectId(recipientId),
            sender: user._id,
            type: "DOCUMENT_UPDATE" as any,
            document: document._id,
            message: `${user.email} updated the document "${document.title}"`,
            read: false,
          }));

          if (notifications.length > 0) {
            const inserted = await NotificationModel.insertMany(notifications);
            console.log(`Created ${inserted.length} notifications.`);

            // Emit real-time notification to recipients
            inserted.forEach((notif) => {
              const recId = notif.recipient.toString();
              io.to(`user:${recId}`).emit("new-notification", notif);
            });
          }
        }
      } catch (error) {
        console.error("Error generating disconnect notification:", error);
      }
    }
  });
};
