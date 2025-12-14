import { Types } from "mongoose";
import { DocumentModel } from "../../../models/MDocument.js";
import { UserModel } from "../../../models/MUser.js";
import { MutationResolvers } from "../../../generated/graphql.js";
import { NotificationModel } from "../../../models/MNotification.js";
import { NotificationType } from "../../../interfaces/INotification.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");
import mammoth from "mammoth";

const documentMutationResolvers: MutationResolvers = {
  createDocument: async (_, { input }, context) => {
    if (!context.user) throw new Error("Not Authenticated");

    const newDocument = new DocumentModel({
      ...input,
      content: input.content || "",
      owner: context.user._id,
      collaborators: [],
    });

    const result = await newDocument.save();
    return result;
  },

  createDocumentWithAI: async (_, { prompt, attachments }, context) => {
    if (!context.user) throw new Error("Not Authenticated");

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) throw new Error("AI Service missing configuration");

    // Parse Attachments
    let contextText = "";
    if (attachments && attachments.length > 0) {
      for (const file of attachments) {
        try {
          // content is base64 string
          const buffer = Buffer.from(file.content, "base64");
          let extractedText = "";

          if (file.mimeType === "application/pdf") {
            try {
              // Dynamic require to prevent startup crash if module has issues
              const pdf = require("pdf-parse");
              const data = await pdf(buffer);
              extractedText = data.text;
            } catch (e) {
              console.error("PDF Parse Error:", e);
              extractedText = "[Error parsing PDF: Library issue]";
            }
          } else if (
            file.mimeType ===
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          ) {
            const result = await mammoth.extractRawText({ buffer });
            extractedText = result.value;
          } else if (
            file.mimeType === "text/plain" ||
            file.mimeType === "text/markdown"
          ) {
            extractedText = buffer.toString("utf-8");
          }

          if (extractedText && extractedText.trim().length > 0) {
            contextText += `\n\n--- Attachment: ${
              file.name
            } ---\n${extractedText.substring(0, 100000)}`; // Simple safety cap
          }
        } catch (err: any) {
          console.error(`Failed to parse attachment ${file.name}:`, err);
          contextText += `\n\n[Error parsing attachment ${file.name}]\n`;
        }
      }
    }

    try {
      const systemContent =
        "You are a helpful assistant that generates detailed document content. Return only the content in Markdown format. Do not include introductory text like 'Here is the document:'.";
      const userContent = contextText
        ? `${prompt}\n\nAdditional Context from files:${contextText}`
        : prompt;

      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            messages: [
              {
                role: "system",
                content: systemContent,
              },
              {
                role: "user",
                content: userContent,
              },
            ],
            model: "llama-3.1-8b-instant",
          }),
        }
      );

      if (!response.ok) {
        const errText = await response.text();
        console.error("Groq API Error:", errText);
        throw new Error("Failed to generate content");
      }

      const data: any = await response.json();
      const content = data.choices[0]?.message?.content || "";

      // Simple title extraction
      let title = "AI Generated Document";
      const firstLine = content.split("\n")[0];
      if (firstLine && firstLine.length < 60) {
        title = firstLine.replace(/^[#\s]+/, "").trim();
      }

      const newDocument = new DocumentModel({
        title,
        content,
        owner: context.user._id,
        visibility: "PRIVATE",
        isPublic: false,
        collaborators: [],
      });

      return await newDocument.save();
    } catch (error) {
      console.error("AI Generation Error:", error);
      throw new Error("AI Generation failed");
    }
  },

  updateDocument: async (_, { documentID, input }, context) => {
    if (!context.user) throw new Error("Not Authenticated");

    const document = await DocumentModel.findById(documentID);
    if (!document) throw new Error("Document not found");

    const isOwner = document.owner.toString() === context.user._id.toString();
    const isCollaborator = document.collaborators.some(
      (c) => c.toString() === context.user._id.toString()
    );

    // Metadata updates: Only owner can update title/visibility/delete. Collaborators can update content?
    // User request: "[ ] Update a document ... Metadata ... [1] Title [1] Content ... [ ] Document Status ... [1] Is Favorite"
    // Assuming collaborators can edit content. Owner can edit everything.

    if (input.title || input.visibility) {
      if (!isOwner) throw new Error("Not Authorized to update metadata");
      if (input.title) document.title = input.title;
      if (input.visibility) {
        document.visibility = input.visibility;
        // Sync deprecated field
        document.isPublic = input.visibility === "PUBLIC";
      }
    }

    if (input.content) {
      if (!isOwner && !isCollaborator)
        throw new Error("Not Authorized to update content");
      document.content = input.content;
    }

    if (typeof input.isFavorite === "boolean") {
      // isFavorite is a User-side property.
      const user = await UserModel.findById(context.user._id);
      if (user) {
        if (input.isFavorite) {
          const alreadyFavorite = user.isFavorite.some(
            (id: Types.ObjectId) => id.toString() === documentID
          );
          if (!alreadyFavorite) {
            user.isFavorite.push(new Types.ObjectId(documentID));
          }
        } else {
          user.isFavorite = user.isFavorite.filter(
            (id: Types.ObjectId) => id.toString() !== documentID
          );
        }
        await user.save();
      }
    }

    const result = await document.save();

    // Removed explicit notification on every save/update to favor session-based notifications (on disconnect).
    // NOTIFICATION: Document Update handled by socket onDisconnect if changes occurred.

    return result;
  },
  // Delete
  deleteDocument: async (_, { documentID }, context) => {
    if (!context.user) throw new Error("Not Authenticated");
    const document = await DocumentModel.findById(documentID);
    if (!document) throw new Error("Document not found");
    if (document.owner.toString() !== context.user._id.toString())
      throw new Error("Not Authorized");

    document.deletedAt = new Date();
    await document.save();

    // NOTIFICATION: Document Delete
    // Notify collaborators
    const recipients = document.collaborators.filter(
      (c) => c.toString() !== context.user._id.toString()
    );

    const notifications = recipients.map((recipientId) => ({
      recipient: recipientId,
      sender: context.user._id,
      type: NotificationType.DOCUMENT_DELETE,
      document: document._id,
      message: `${context.user.email} deleted the document "${document.title}"`,
      read: false,
    }));

    if (notifications.length > 0) {
      await NotificationModel.insertMany(notifications);
    }

    return document.deletedAt;
  },

  restoreDocument: async (_, { documentID }, context) => {
    if (!context.user) throw new Error("Not Authenticated");
    const document = await DocumentModel.findById(documentID);
    if (!document) throw new Error("Document not found");
    if (document.owner.toString() !== context.user._id.toString())
      throw new Error("Not Authorized");

    document.deletedAt = undefined;
    await document.save();
    return document;
  },

  hardDeleteDocument: async (_, { documentID }, context) => {
    if (!context.user) throw new Error("Not Authenticated");
    const document = await DocumentModel.findById(documentID);
    if (!document) throw new Error("Document not found");
    if (document.owner.toString() !== context.user._id.toString())
      throw new Error("Not Authorized");

    await DocumentModel.findByIdAndDelete(documentID);
    return true;
  },

  // Collaboration
  addCollaborator: async (_, { documentID, userID }, context) => {
    if (!context.user) throw new Error("Not Authenticated");
    const document = await DocumentModel.findById(documentID);
    if (!document) throw new Error("Document not found");
    if (document.owner.toString() !== context.user._id.toString())
      throw new Error("Not Authorized");

    // Check if presumably already invited or collaborator
    if (document.collaborators.some((c) => c.toString() === userID))
      return document;
    if (document.invitations.some((i) => i.toString() === userID))
      return document;

    document.invitations.push(new Types.ObjectId(userID));
    await document.save();

    // NOTIFICATION: Document Invite
    await NotificationModel.create({
      recipient: new Types.ObjectId(userID),
      sender: context.user._id,
      type: NotificationType.DOCUMENT_INVITE,
      document: document._id,
      message: `${context.user.email} invited you to edit "${document.title}"`,
      read: false,
    });

    return document;
  },

  removeCollaborator: async (_, { documentID, userID }, context) => {
    if (!context.user) throw new Error("Not Authenticated");
    const document = await DocumentModel.findById(documentID);
    if (!document) throw new Error("Document not found");
    if (document.owner.toString() !== context.user._id.toString())
      throw new Error("Not Authorized");

    document.collaborators = document.collaborators.filter(
      (id) => id.toString() !== userID
    );
    document.invitations = document.invitations.filter(
      (id) => id.toString() !== userID
    );
    await document.save();
    return document;
  },

  acceptCollaborateInvitation: async (_, { documentID }, context) => {
    if (!context.user) throw new Error("Not Authenticated");
    const document = await DocumentModel.findById(documentID);
    if (!document) throw new Error("Document not found");

    const userId = context.user._id;
    // Use some + toString comparison for reliability, though includes might work if references match
    if (!document.invitations.some((id) => id.toString() === userId.toString()))
      throw new Error("No invitation found");

    document.invitations = document.invitations.filter(
      (id) => id.toString() !== userId.toString()
    );
    document.collaborators.push(userId);
    await document.save();
    return document;
  },

  declineCollaborateInvitation: async (_, { documentID }, context) => {
    if (!context.user) throw new Error("Not Authenticated");
    const document = await DocumentModel.findById(documentID);
    if (!document) throw new Error("Document not found");

    const userId = context.user._id;
    document.invitations = document.invitations.filter(
      (id) => id.toString() !== userId.toString()
    );
    await document.save();
    return true;
  },

  leaveDocument: async (_, { documentID }, context) => {
    if (!context.user) throw new Error("Not Authenticated");
    const document = await DocumentModel.findById(documentID);
    if (!document) throw new Error("Document not found");

    const userId = context.user._id;
    document.collaborators = document.collaborators.filter(
      (id) => id.toString() !== userId.toString()
    );
    await document.save();
    return true;
  },

  // Ownership
  transferOwnership: async (_, { documentID, input }, context) => {
    if (!context.user) throw new Error("Not Authenticated");
    const document = await DocumentModel.findById(documentID);
    if (!document) throw new Error("Document not found");
    if (document.owner.toString() !== context.user._id.toString())
      throw new Error("Not Authorized");

    // Make old owner a collaborator? Request says [3] Transfer ownership (current owner becomes collaborator)
    const oldOwner = document.owner;
    document.owner = new Types.ObjectId(input.newOwnerID);

    // Add old owner to collaborators if not already there
    if (!document.collaborators.includes(oldOwner)) {
      document.collaborators.push(oldOwner);
    }
    // Remove new owner from collaborators if they were one
    document.collaborators = document.collaborators.filter(
      (id) => id.toString() !== input.newOwnerID
    );

    await document.save();
    // In a real app, might update User models too (ownership arrays), but standard Mongoose relationships usually just store ref on one side or sync manually.
    // The User type resolver probably queries based on owner field, so this might be enough.

    // NOTIFICATION: Ownership Transfer
    await NotificationModel.create({
      recipient: new Types.ObjectId(input.newOwnerID),
      sender: context.user._id,
      type: NotificationType.DOCUMENT_UPDATE, // Or OWNERSHIP_TRANSFER if specific type desired
      document: document._id,
      message: `${context.user.email} transferred ownership of "${document.title}" to you`,
      read: false,
    });

    return document;
  },

  // Duplicate
  duplicateDocument: async (_, { documentID }, context) => {
    if (!context.user) throw new Error("Not Authenticated");
    const originalDoc = await DocumentModel.findById(documentID);
    if (!originalDoc) throw new Error("Document not found");

    const newDoc = new DocumentModel({
      title: `${originalDoc.title} (Copy)`,
      content: originalDoc.content,
      owner: context.user._id,
      isPublic: false,
      visibility: "PRIVATE",
      collaborators: [],
      invitations: [],
      versions: [], // Don't copy history? Usually fresh copy.
    });

    await newDoc.save();
    return newDoc;
  },

  // Versioning
  createSnapshot: async (_, { documentID, name }, context) => {
    if (!context.user) throw new Error("Not Authenticated");
    const document = await DocumentModel.findById(documentID);
    if (!document) throw new Error("Document not found");

    // Check access (Owner or Collaborator?)
    const isOwner = document.owner.toString() === context.user._id.toString();
    const isCollaborator = document.collaborators.some(
      (c) => c.toString() === context.user._id.toString()
    );
    if (!isOwner && !isCollaborator) throw new Error("Not Authorized");

    const snapshot = {
      content: document.content,
      createdAt: new Date(),
      // name: name // We didn't schema 'name' yet, just content/date.
    };

    document.versions.push(snapshot);
    await document.save();

    // Return the created version (last one)
    const newVersion = document.versions[document.versions.length - 1];
    // Map to GraphQL type
    return {
      id: newVersion._id!.toString(),
      documentId: document._id.toString(),
      content: newVersion.content,
      createdAt: newVersion.createdAt,
    };
  },

  revertToSnapshot: async (_, { documentID, snapshotID }, context) => {
    if (!context.user) throw new Error("Not Authenticated");
    const document = await DocumentModel.findById(documentID);
    if (!document) throw new Error("Document not found");

    // Owner only? Or collaborator? Reverting is destructive.
    if (document.owner.toString() !== context.user._id.toString())
      throw new Error("Not Authorized");

    const version = document.versions.find(
      (v) => v._id?.toString() === snapshotID
    );
    if (!version) throw new Error("Version not found");

    document.content = version.content;
    await document.save();
    return document;
  },
};

export default documentMutationResolvers;
// Force restart
