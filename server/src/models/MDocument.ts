import { Schema, model, Types, HydratedDocument } from "mongoose";
import { IDocument } from "../interfaces/IDocument.js";

const versionSchema = new Schema(
  {
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const documentSchema = new Schema<IDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
      default: "Untitled Document",
    },

    content: {
      type: String,
      required: true,
      default: "",
    },

    isPublic: {
      type: Boolean,
      default: false,
    },
    visibility: {
      type: String,
      enum: ["PUBLIC", "SHARED", "PRIVATE"],
      default: "PRIVATE",
    },
    invitations: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    versions: [versionSchema],

    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    collaborators: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    createdAt: {
      type: Date,
      default: Date.now,
    },

    updatedAt: {
      type: Date,
      default: Date.now,
    },

    deletedAt: {
      type: Date,
    },
  },
  // Adds createdAt and updatedAt
  { timestamps: true }
);

export const DocumentModel = model<IDocument>("Doc", documentSchema);
export type DocumentDocument = HydratedDocument<IDocument>;
