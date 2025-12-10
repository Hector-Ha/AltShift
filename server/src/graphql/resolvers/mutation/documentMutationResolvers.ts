import { Types } from "mongoose";
import { DocumentModel } from "../../../models/MDocument.js";
import { UserModel } from "../../../models/MUser.js";
import { MutationResolvers } from "../../../generated/graphql.js";

const documentMutationResolvers: MutationResolvers = {
  createDocument: async (_, { input }, context) => {
    if (!context.user) throw new Error("Not Authenticated");

    const newDocument = new DocumentModel({
      ...input,
      owner: context.user._id,
      collaborators: [],
    });

    const result = await newDocument.save();
    return result;
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
