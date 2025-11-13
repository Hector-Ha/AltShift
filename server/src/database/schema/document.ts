import { Schema, Document, model, Types } from "mongoose";

export interface IDoc extends Document {
  uuid: Types.UUID;

  //
  title: string;
  content: string;
  isPublic: boolean;

  //
  owner: Types.ObjectId;
  collaborators: Types.ObjectId[];

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

// Doc Schema
const docSchema = new Schema<IDoc>({
  uuid: {
    type: Schema.Types.UUID,
    unique: true,
    required: true,
    default: new Types.UUID(),
  },

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
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  collaborators: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],

  createdAt: {
    type: Date,
    required: true,
    default: Date.now(),
  },

  updatedAt: {
    type: Date,
    required: true,
    default: Date.now(),
  },

  deletedAt: {
    type: Date,
    required: false,
  },
});

// Model
export const Doc = model<IDoc>("Doc", docSchema);
