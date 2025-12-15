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
import { markdownToSlate } from "../../../utils/markdownToSlate.js";

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
      if (firstLine && firstLine.length < 100) {
        // Strip common markdown symbols: #, *, _, [, ]
        title = firstLine
          .replace(/^[\s#*_\->]+/, "")
          .replace(/[*_\[\]]/g, "")
          .trim();
      }

      // Convert Markdown to Slate JSON with Pagination
      const slateNodes = markdownToSlate(content);
      const paginatedContent = [
        {
          type: "page",
          children:
            slateNodes.length > 0
              ? slateNodes
              : [{ type: "paragraph", children: [{ text: "" }] }],
        },
      ];

      const newDocument = new DocumentModel({
        title,
        content: JSON.stringify(paginatedContent),
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

    if (input.title) {
      if (!isOwner && !isCollaborator)
        throw new Error("Not Authorized to update title");
    }

    if (input.visibility) {
      if (!isOwner) throw new Error("Not Authorized to update visibility");
    }

    // Capture old title for notification
    const oldTitle = document.title;
    let titleChanged = false;

    if (input.title) {
      if (document.title !== input.title) {
        document.title = input.title;
        titleChanged = true;
      }
    }

    if (input.visibility) {
      document.visibility = input.visibility;
      // Sync deprecated field
      document.isPublic = input.visibility === "PUBLIC";

      // Handle switching to PRIVATE: Remove all collaborators and invitees
      if (input.visibility === "PRIVATE") {
        const removedCollaborators = [...document.collaborators];
        const removedInvitations = [...document.invitations];

        document.collaborators = [];
        document.invitations = [];

        // Notify removed users

        const allRemoved = [
          ...removedCollaborators,
          ...removedInvitations,
        ].filter((id) => id.toString() !== context.user._id.toString());

        if (allRemoved.length > 0) {
          const notifications = allRemoved.map((recipientId) => ({
            recipient: recipientId,
            sender: context.user._id,
            type: NotificationType.DOCUMENT_UPDATE,
            document: document._id,
            message: `${context.user.email} made the document "${document.title}" private`,
            read: false,
          }));
          await NotificationModel.insertMany(notifications);
        }
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

    if (titleChanged) {
      const recipients = [...document.collaborators, document.owner].filter(
        (id) => id.toString() !== context.user._id.toString()
      );
      // Deduplicate just in case
      const uniqueRecipients = [
        ...new Set(recipients.map((id) => id.toString())),
      ];

      if (uniqueRecipients.length > 0) {
        const notifications = uniqueRecipients.map((recipientId) => ({
          recipient: new Types.ObjectId(recipientId),
          sender: context.user._id,
          type: NotificationType.DOCUMENT_UPDATE,
          document: document._id,
          message: `Document name has been changed from "${oldTitle}" to "${document.title}"`,
          read: false,
        }));
        await NotificationModel.insertMany(notifications);
      }
    }

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

    // If Private, switch to Shared because we are inviting someone
    if (document.visibility === "PRIVATE") {
      document.visibility = "SHARED";
      document.isPublic = false;
    }

    await document.save();

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

    const oldOwner = document.owner;
    document.owner = new Types.ObjectId(input.newOwnerID);

    // Add old owner to collaborators if not already there
    if (!document.collaborators.includes(oldOwner)) {
      document.collaborators.push(oldOwner);
    }

    document.collaborators = document.collaborators.filter(
      (id) => id.toString() !== input.newOwnerID
    );

    // If Private, switching ownership while keeping old owner as collaborator implies Sharing
    if (document.visibility === "PRIVATE") {
      document.visibility = "SHARED";
      document.isPublic = false;
    }

    await document.save();

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
      versions: [],
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
