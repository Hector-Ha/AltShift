import { FilterQuery } from "mongoose";
import { DocumentModel } from "../../../models/MDocument.js";
import { IDocument } from "../../../interfaces/IDocument.js";
import { QueryResolvers } from "../../../generated/graphql.js";

const documentQueryResolvers: QueryResolvers = {
  getDocumentByID: async (_, { id }, context) => {
    // Optional: Check auth or if public
    const document = await DocumentModel.findById(id);
    if (!document) throw new Error("Document not found");
    // Privacy check
    const isOwner = document.owner.toString() === context.user?._id?.toString();
    const isCollaborator = document.collaborators?.includes(context.user?._id);
    const isPublic = document.visibility === "PUBLIC";

    if (document.visibility === "PRIVATE" && !isOwner) {
      throw new Error("Access Denied: Document is Private");
    }

    if (!isPublic && !isOwner && !isCollaborator) {
      throw new Error("Not Authorized");
    }

    // Auto-join if Public and Authenticated
    if (isPublic && context.user && !isOwner && !isCollaborator) {
      document.collaborators.push(context.user._id);
      await document.save();
    }

    return document;
  },

  getDocuments: async (_, { filter, sort, pagination }, context) => {
    if (!context.user) throw new Error("Not Authenticated");

    const criteria: FilterQuery<IDocument> = { deletedAt: undefined };

    // Accessibility
    const accessConditions = [
      { owner: context.user._id },
      { collaborators: context.user._id },
    ];
    // Filter specific ownership
    if (filter?.isOwned && !filter?.isCollaborating)
      criteria.owner = context.user._id;
    else if (!filter?.isOwned && filter?.isCollaborating)
      criteria.collaborators = context.user._id;
    else criteria.$or = accessConditions;

    // Status
    if (filter?.status) criteria.visibility = filter.status;
    if (filter?.isFavorite) {
      // This is hard because favorite is on User model.
      // We'd need to fetch User favorites first.
      const user = await context.UserModel.findById(context.user._id);
      if (user) {
        criteria._id = { $in: user.isFavorite };
      }
    }

    // Search
    if (filter?.search) {
      const searchRegex = { $regex: filter.search, $options: "i" };
      const searchCriteria = {
        $or: [{ title: searchRegex }, { content: searchRegex }],
      };
      // Merge with existing $or if any (accessibility) uses $and
      if (criteria.$or) {
        criteria.$and = [{ $or: criteria.$or }, searchCriteria];
        delete criteria.$or;
      } else {
        Object.assign(criteria, searchCriteria);
      }
    }

    let q = DocumentModel.find(criteria);

    // Sorting
    if (sort) {
      const sortOrder = sort.accending === false ? -1 : 1;
      q = q.sort({ [sort.field]: sortOrder });
    } else {
      q = q.sort({ updatedAt: -1 }); // Default desc
    }

    // Pagination
    if (pagination) {
      if (pagination.offset) q = q.skip(pagination.offset);
      if (pagination.limit) q = q.limit(pagination.limit);
    }

    return await q.exec();
  },

  getDocumentsInTrash: async (_, __, context) => {
    if (!context.user) throw new Error("Not Authenticated");
    return await DocumentModel.find({
      owner: context.user._id,
      deletedAt: { $ne: null },
    });
  },
};

export default documentQueryResolvers;
